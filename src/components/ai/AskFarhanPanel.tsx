"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadStore } from "@/lib/loadStore";
import { RichText } from "./richText";

interface Msg { id: string; role: "user" | "assistant"; content: string; error?: boolean }

const STORE_KEY = "fp:ask";
const MAX_INPUT = 1000;
const SUGGESTIONS = [
  "What does Farhan do?",
  "Tell me about Resume Nova",
  "What technologies does he use?",
  "What projects has he built?",
  "How does PassportAI work?",
  "Is he available for work?",
];
const uid = () => Math.random().toString(36).slice(2, 10);

export default function AskFarhanPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [source, setSource] = useState<"groq" | "local" | null>(null);
  const [notice, setNotice] = useState("");
  const [devNote, setDevNote] = useState("");
  const abort = useRef<AbortController | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);
  const stick = useRef(true);

  // Restore this tab's conversation.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
    box.current?.focus();
    return () => { abort.current?.abort(); loadStore.set({ ai: "idle" }); };
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.filter((m) => !m.error).slice(-20))); } catch {}
  }, [messages]);

  // Keep the newest text in view unless the visitor scrolled up.
  useEffect(() => {
    const el = list.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  const send = useCallback(async (raw: string, history?: Msg[]) => {
    const text = raw.trim();
    if (!text || busy) return;
    const base = history ?? messages;
    const next: Msg[] = [...base, { id: uid(), role: "user", content: text }];
    const replyId = uid();
    setMessages([...next, { id: replyId, role: "assistant", content: "" }]);
    setInput(""); setBusy(true); setNotice(""); stick.current = true;
    loadStore.set({ ai: "thinking" });

    const ctrl = new AbortController();
    abort.current = ctrl;
    const fail = (msg: string) =>
      setMessages((m) => m.map((x) => (x.id === replyId ? { ...x, content: msg, error: true } : x)));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => !m.error).map(({ role, content }) => ({ role, content })) }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        if (res.status === 429) {
          const j = await res.json().catch(() => ({}));
          const wait = j.retryAfter ? ` Please try again in about ${Math.ceil(j.retryAfter / 60)} min.` : " Please try again in a moment.";
          fail(`That's a lot of questions at once.${wait}`);
        } else {
          const j = await res.json().catch(() => ({}));
          fail(`I couldn't reach the assistant just now. Please try again.${j.detail ? `\n\n(dev only) ${j.detail}` : ""}`);
        }
        return;
      }
      setSource(res.headers.get("x-ask-source") === "local" ? "local" : "groq");
      // Development only: explain why the live model was skipped (e.g. bad key, model not enabled, network blocked).
      const why = res.headers.get("x-ask-fallback");
      if (process.env.NODE_ENV !== "production") setDevNote(why ? `Groq unavailable → offline answer. ${why}` : "");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        loadStore.set({ ai: "speaking" });
        setMessages((m) => m.map((x) => (x.id === replyId ? { ...x, content: acc } : x)));
      }
      if (!acc.trim()) fail("I couldn't put an answer together. Please try again.");
    } catch (e) {
      if ((e as Error).name !== "AbortError") fail("The connection dropped. Please try again.");
    } finally {
      setBusy(false);
      loadStore.set({ ai: "idle" });
      box.current?.focus();
    }
  }, [busy, messages]);

  const retry = (id: string) => {
    const i = messages.findIndex((m) => m.id === id);
    const q = messages[i - 1];
    if (q?.role === "user") send(q.content, messages.slice(0, i - 1));
  };
  const clear = () => { abort.current?.abort(); setMessages([]); setNotice(""); setSource(null); try { sessionStorage.removeItem(STORE_KEY); } catch {} };
  const stop = () => abort.current?.abort();

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(input); }
  };
  const onInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value.slice(0, MAX_INPUT));
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  return (
    <div
      role="dialog"
      aria-label="Ask Farhan"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      className="glass fixed inset-x-0 bottom-0 z-[70] flex h-[88dvh] flex-col overflow-hidden rounded-t-3xl shadow-lift sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[min(640px,calc(100dvh-10rem))] sm:w-[410px] sm:rounded-3xl"
      style={{ background: "color-mix(in srgb, var(--bg-elevated) 98%, transparent)" }}
    >
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Image src="/images/farhan-avatar.webp" alt="" width={40} height={40} className="h-10 w-10 rounded-full ring-2 ring-accent" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-semibold leading-tight">Ask Farhan</p>
          <p className="truncate text-xs text-muted">
            {source === "local" ? "Offline mode · answers from portfolio data" : "AI assistant · answers from Farhan's portfolio"}
          </p>
        </div>
        {messages.length > 0 && (
          <button type="button" onClick={clear} data-cursor="button" aria-label="Clear conversation" title="Clear" className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-surface hover:text-ink">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
          </button>
        )}
        <button type="button" onClick={onClose} data-cursor="button" aria-label="Close Ask Farhan" className="grid h-9 w-9 place-items-center rounded-full bg-surface hover:bg-accent hover:text-on-accent">✕</button>
      </header>

      <div
        ref={list}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        onScroll={(e) => { const el = e.currentTarget; stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; }}
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        {messages.length === 0 ? (
          <div className="flex min-h-full flex-col gap-4">
            <div className="mt-auto">
              <p className="font-display text-xl font-semibold leading-tight sm:text-2xl">Ask me anything about Farhan&rsquo;s work.</p>
              <p className="mt-2 text-sm text-muted">Projects, skills, education — or a technical question. I answer from his portfolio and say so when I don&rsquo;t know.</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => send(s)} data-cursor="button" className="rounded-full border border-line bg-bg px-3 py-1.5 text-left text-sm transition-colors hover:border-accent hover:bg-accent/10">{s}</button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ol className="flex flex-col gap-4">
            {messages.map((m) => (
              <li key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-sm text-on-accent"
                      : `max-w-[92%] rounded-2xl rounded-bl-md border px-4 py-2.5 text-sm leading-relaxed ${m.error ? "border-accent/60 bg-accent/10" : "border-line bg-surface"}`
                  }
                >
                  {m.role === "user" ? m.content : m.content ? <RichText text={m.content} /> : (
                    <span className="flex items-center gap-1 py-1" aria-label="Thinking">
                      {[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d * 120}ms` }} />)}
                    </span>
                  )}
                  {m.error && (
                    <button type="button" onClick={() => retry(m.id)} data-cursor="button" className="mt-2 block rounded-full border border-line px-3 py-1 text-xs font-medium hover:border-accent">↻ Try again</button>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
        {notice && <p className="mt-3 text-xs text-muted">{notice}</p>}
        {devNote && <p className="mt-3 rounded-lg border border-accent/50 bg-accent/10 px-3 py-2 font-mono text-[0.68rem]">(dev only) {devNote}</p>}
      </div>

      <footer className="border-t border-line p-3">
        <div className="flex items-end gap-2 rounded-2xl border border-line bg-bg p-2 focus-within:border-accent">
          <textarea
            ref={box}
            value={input}
            onChange={onInput}
            onKeyDown={onKey}
            rows={1}
            placeholder="Ask a question…"
            aria-label="Your question"
            className="max-h-36 min-h-[2.25rem] flex-1 resize-none bg-transparent px-2 py-1.5 text-base outline-none sm:text-sm placeholder:text-muted"
          />
          {busy ? (
            <button type="button" onClick={stop} aria-label="Stop" data-cursor="button" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-bg">■</button>
          ) : (
            <button type="button" onClick={() => send(input)} disabled={!input.trim()} aria-label="Send" data-cursor="button" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-on-accent disabled:opacity-40">↑</button>
          )}
        </div>
        <p className="mt-2 px-1 text-[0.68rem] text-muted">AI can make mistakes. Answers about Farhan come from his portfolio data. Enter to send · Shift+Enter for a new line.{input.length > MAX_INPUT - 100 && ` ${MAX_INPUT - input.length} left.`}</p>
      </footer>
    </div>
  );
}
