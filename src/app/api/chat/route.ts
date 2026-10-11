import { answerLocally } from "@/lib/ask/local";
import { systemPrompt } from "@/lib/ask/prompt";
import { checkRate } from "@/lib/ask/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30; // seconds — enough for a streamed answer, and keeps a stuck request from running long on Vercel

const MAX_MESSAGES = 12;
const MAX_CHARS = 1200;
const BASE = (process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1").replace(/\/$/, "");

type Msg = { role: "user" | "assistant"; content: string };

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers } });

function clean(input: unknown): Msg[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const out: Msg[] = [];
  for (const m of input.slice(-MAX_MESSAGES)) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return null;
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (content) out.push({ role: m.role, content });
  }
  return out.length && out[out.length - 1].role === "user" ? out : null;
}

const textStream = (producer: (push: (t: string) => void) => Promise<void>, source: string, extra: Record<string, string> = {}) =>
  new Response(
    new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        try { await producer((t) => controller.enqueue(enc.encode(t))); } catch { /* client left */ }
        controller.close();
      },
    }),
    { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Ask-Source": source, "X-Accel-Buffering": "no", ...extra } },
  );

/** Offline answer, streamed word by word so it feels the same as the live model. */
function localResponse(question: string, fallbackReason?: string) {
  const words = answerLocally(question).split(/(\s+)/);
  return textStream(async (push) => {
    for (const w of words) { push(w); await new Promise((r) => setTimeout(r, 12)); }
  }, "local", fallbackReason ? { "X-Ask-Fallback": fallbackReason.replace(/[^\x20-\x7E]/g, "-").slice(0, 200) } : {});
}

async function callGroq(messages: Msg[], strict: boolean, signal: AbortSignal) {
  const body: Record<string, unknown> = {
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    messages: [{ role: "system", content: systemPrompt() }, ...messages],
    stream: true,
    temperature: 0.4,
  };
  if (strict) { body.max_completion_tokens = 1500; body.reasoning_effort = "low"; body.include_reasoning = false; }
  else body.max_tokens = 900;
  return fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
}

export async function POST(req: Request) {
  // Same-origin only.
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json({ error: "Forbidden" }, 403);
  if (!req.headers.get("content-type")?.includes("application/json")) return json({ error: "Expected JSON" }, 415);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anon";
  const rate = checkRate(ip);
  if (!rate.ok) return json({ error: "rate_limited", retryAfter: rate.retryAfter }, 429, { "Retry-After": String(rate.retryAfter) });

  let messages: Msg[] | null = null;
  try { messages = clean((await req.json()).messages); } catch { /* handled below */ }
  if (!messages) return json({ error: "Invalid request" }, 400);

  if (!process.env.GROQ_API_KEY) return localResponse(messages[messages.length - 1].content);

  const timeout = AbortSignal.timeout(30000);
  let upstream: Response;
  try {
    upstream = await callGroq(messages, true, timeout);
    // Some models reject the optional reasoning parameters — retry plainly once.
    if (upstream.status === 400 || upstream.status === 422) upstream = await callGroq(messages, false, timeout);
  } catch (err) {
    // Network-level failure (DNS, TLS, firewall/ISP block, timeout). Logged for you; never shown to visitors.
    const why = (err as { cause?: { code?: string } })?.cause?.code ?? (err as Error)?.message ?? "unknown";
    console.error(`[ask-farhan] Could not reach Groq (${BASE}): ${why}`);
    // Visitors still get an answer (offline mode) instead of an error.
    return localResponse(messages[messages.length - 1].content, `Could not reach Groq: ${why}`);
  }
  if (upstream.status === 429) return json({ error: "busy" }, 429, { "Retry-After": upstream.headers.get("retry-after") ?? "20" });
  if (!upstream.ok || !upstream.body) {
    const text = (await upstream.text().catch(() => "")).slice(0, 400);
    const hint =
      upstream.status === 401 ? "API key rejected — check GROQ_API_KEY in .env.local (no quotes or spaces)." :
      upstream.status === 403 ? "Access denied — your network/region or Groq account may be blocked." :
      upstream.status === 404 ? `Model not found/enabled — check GROQ_MODEL (${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}) in the Groq console.` :
      "Groq rejected the request.";
    console.error(`[ask-farhan] Groq responded ${upstream.status}. ${hint}\n${text}`);
    return localResponse(messages[messages.length - 1].content, `Groq ${upstream.status}: ${hint}`);
  }

  const reader = upstream.body.getReader();
  return textStream(async (push) => {
    const dec = new TextDecoder();
    let buf = "";
    let wrote = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let nl: number;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") continue;
        try {
          const piece = JSON.parse(data)?.choices?.[0]?.delta?.content; // reasoning deltas are ignored
          if (typeof piece === "string" && piece) { push(piece); wrote = true; }
        } catch { /* partial / keep-alive line */ }
      }
    }
    if (!wrote) push("I couldn't put an answer together just now. Please try asking again.");
  }, "groq");
}

/** Setup check: open http://localhost:3000/api/chat to see whether the key and model were picked up. Never reveals the key. */
export async function GET() {
  return json({ configured: Boolean(process.env.GROQ_API_KEY), model: process.env.GROQ_MODEL || "openai/gpt-oss-20b", provider: new URL(BASE).host });
}
