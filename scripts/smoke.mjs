#!/usr/bin/env node
/**
 * Dependency-free smoke test. Run against a running site:
 *   node scripts/smoke.mjs                      (defaults to http://localhost:3000)
 *   node scripts/smoke.mjs https://your-site.vercel.app
 * Checks pages, SEO files, assets, the chat API's guards, content placeholders, and that no secret leaks into served code.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
let failed = 0, passed = 0;
const ok = (name) => { passed++; console.log(`  PASS  ${name}`); };
const bad = (name, why) => { failed++; console.log(`  FAIL  ${name}${why ? ` — ${why}` : ""}`); };
const check = (name, cond, why) => (cond ? ok(name) : bad(name, why));
const get = (path, init) => fetch(base + path, { redirect: "manual", ...init });

console.log(`\nSmoke test: ${base}\n`);

// ---- pages ----
console.log("Pages");
const home = await get("/");
const html = await home.text();
check("GET / is 200 html", home.status === 200 && (home.headers.get("content-type") || "").includes("text/html"), `status ${home.status}`);
check("has exactly one <h1>", (html.match(/<h1[\s>]/g) || []).length === 1);
for (const id of ["top", "work", "about", "skills", "education", "resume", "certificates", "contact"])
  check(`section #${id} present`, html.includes(`id="${id}"`));
check("<title> set", /<title>[^<]*Farhan[^<]*<\/title>/.test(html));
check("meta description", /<meta name="description" content="[^"]{40,}/.test(html));
check("canonical link", /<link rel="canonical"/.test(html));
check("Open Graph image tag", /property="og:image"/.test(html));
check("JSON-LD Person", /application\/ld\+json/.test(html) && html.includes('"@type":"Person"'));
check("lang attribute", /<html[^>]*lang="en"/.test(html));
const nf = await get("/definitely-not-a-page");
check("unknown route is 404", nf.status === 404, `status ${nf.status}`);

// ---- seo + assets ----
console.log("\nSEO files and assets");
for (const [p, type] of [["/robots.txt", "text/plain"], ["/sitemap.xml", "xml"], ["/opengraph-image.png", "image/png"], ["/twitter-image.png", "image/png"], ["/icon.png", "image/png"]]) {
  const r = await get(p);
  check(`${p}`, r.status === 200 && (r.headers.get("content-type") || "").includes(type), `status ${r.status}`);
}
const pdf = await get("/Muhammad_Farhan_Resume.pdf");
const pdfHead = Buffer.from(await pdf.arrayBuffer()).subarray(0, 5).toString();
check("resume PDF is a real PDF", pdf.status === 200 && pdfHead === "%PDF-");
for (const [m, maxKB] of [["/models/farhan.glb", 700]]) {
  const r = await get(m);
  const buf = Buffer.from(await r.arrayBuffer());
  check(`${m} is a GLB`, r.status === 200 && buf.subarray(0, 4).toString() === "glTF", `status ${r.status}`);
  check(`${m} is under ${maxKB} KB (slow-network budget)`, buf.length / 1024 < maxKB, `${Math.round(buf.length / 1024)} KB`);
}
const poster = await get("/images/farhan-poster.webp");
check("hero poster is tiny (< 20 KB)", poster.status === 200 && Buffer.from(await poster.arrayBuffer()).length < 20 * 1024);
check("no /_next/image requests (images served straight from the CDN)", !html.includes("/_next/image"));
check("no 3D model preload competing with the page", !/rel="preload"[^>]*\.glb/.test(html));
check("page can reveal itself without JavaScript (loader give-up CSS)", /loader-giveup/.test(await (await get(html.match(/\/_next\/static\/[^"]+\.css/)[0])).text()));
for (const f of ["act-ai", "internship-iub", "python-ibm"]) {
  const r = await get(`/images/certificates/${f}.webp`);
  check(`certificate image ${f}`, r.status === 200 && (r.headers.get("content-type") || "").includes("webp"));
}

// ---- security headers ----
console.log("\nSecurity headers");
const h = home.headers;
check("X-Content-Type-Options: nosniff", h.get("x-content-type-options") === "nosniff", "missing — set in next.config.ts");
check("Referrer-Policy", !!h.get("referrer-policy"), "missing");
check("X-Frame-Options / frame-ancestors", !!(h.get("x-frame-options") || (h.get("content-security-policy") || "").includes("frame-ancestors")), "missing");
check("no X-Powered-By", !h.get("x-powered-by"), "header present");

// ---- chat API ----
console.log("\nChat API");
const info = await get("/api/chat");
const infoJson = await info.json().catch(() => ({}));
check("GET /api/chat reports config (never the key)", info.status === 200 && "configured" in infoJson && !JSON.stringify(infoJson).match(/gsk_/));
const wrongType = await get("/api/chat", { method: "POST", headers: { "Content-Type": "text/plain" }, body: "hi" });
check("POST wrong content-type → 415", wrongType.status === 415, `status ${wrongType.status}`);
const empty = await get("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [] }) });
check("POST empty messages → 400", empty.status === 400, `status ${empty.status}`);
const assistantLast = await get("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "assistant", content: "x" }] }) });
check("POST last message not from user → 400", assistantLast.status === 400);
const cross = await get("/api/chat", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://evil.example" }, body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }) });
check("POST from another origin → 403", cross.status === 403, `status ${cross.status}`);
const real = await get("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: "What projects has he built?" }] }) });
const txt = await real.text();
check("POST valid question → streamed answer", real.status === 200 && txt.length > 40, `status ${real.status}`);
check("answer mentions a real project", /Resume Nova|MediMart|PassportAI/i.test(txt));

// ---- secrets must never reach the browser ----
console.log("\nSecrets");
const envKey = (() => { for (const f of [".env.local", ".env"]) if (existsSync(f)) { const m = readFileSync(f, "utf8").match(/^GROQ_API_KEY=["']?([^"'\r\n]+)/m); if (m && m[1]) return m[1]; } return process.env.GROQ_API_KEY || ""; })();
if (envKey.length > 10) {
  const scripts = [...html.matchAll(/\/_next\/static\/[^"']+\.js/g)].map((m) => m[0]);
  let leaked = html.includes(envKey);
  for (const s of new Set(scripts)) if ((await (await get(s)).text()).includes(envKey)) leaked = true;
  check(`API key not present in HTML or ${new Set(scripts).size} JS files`, !leaked);
} else console.log("  SKIP  no GROQ_API_KEY found locally to look for");

// ---- content (run from the project root) ----
console.log("\nImage budget (everything shown inline must be 20 KB or less)");
{
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
  const imgDir = join(process.cwd(), "public", "images");
  if (existsSync(imgDir)) {
    const files = walk(imgDir).filter((f) => f.endsWith(".webp"));
    // Full-size originals (no ".sm.") exist only for the lightbox; they must have a small sibling that is what the page shows.
    const inline = files.filter((f) => f.includes(".sm.") || !existsSync(f.replace(/\.webp$/, ".sm.webp")));
    const over = inline.filter((f) => statSync(f).size > 20 * 1024);
    check(`all ${inline.length} inline images are <= 20 KB`, over.length === 0, over.map((f) => `${f.split("images")[1]} ${Math.round(statSync(f).size / 1024)}KB`).join(", "));
  }
}

console.log("\nContent");
const dataDir = join(process.cwd(), "src", "data");
if (existsSync(dataDir) && statSync(dataDir).isDirectory()) {
  const todo = [];
  for (const f of readdirSync(dataDir)) {
    const lines = readFileSync(join(dataDir, f), "utf8").split("\n");
    lines.forEach((l, i) => { if (!l.trim().startsWith("//") && /PLACEHOLDER|TODO|lorem ipsum|example\.com\/your/i.test(l)) todo.push(`${f}:${i + 1}`); });
  }
  check("no PLACEHOLDER/TODO text in src/data", todo.length === 0, todo.join(", "));
  const projects = readFileSync(join(dataDir, "projects.ts"), "utf8");
  const live = /^\s*links:.*live:\s*"https?:/m.test(projects);
  console.log(`  INFO  project live links ${live ? "set" : "not set yet (buttons say Coming soon)"}`);
  const profile = readFileSync(join(dataDir, "profile.ts"), "utf8");
  console.log(`  INFO  availability ${/^\s*availability:/m.test(profile) ? "set" : "not set (hidden)"}; Fiverr ${/^\s*\{[^}]*Fiverr/m.test(profile) ? "set" : "not set"}`);
} else console.log("  SKIP  run from the project root to check src/data");

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
