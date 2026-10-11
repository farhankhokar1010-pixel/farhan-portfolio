import { Fragment } from "react";

/** Tiny, safe formatter for model replies: paragraphs, "- " / "1." lists, **bold**, `code`. Never injects HTML. */
function inline(text: string, key: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**") && p.length > 4) return <strong key={`${key}${i}`}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`") && p.length > 2) return <code key={`${key}${i}`} className="rounded bg-surface px-1 py-0.5 font-mono text-[0.85em]">{p.slice(1, -1)}</code>;
    return <Fragment key={`${key}${i}`}>{p}</Fragment>;
  });
}

type Block = { kind: "p"; lines: string[] } | { kind: "ul" | "ol"; items: string[] };
const BULLET = /^\s*([-*•])\s+/;
const NUMBERED = /^\s*\d+[.)]\s+/;

/** Line-based so a list directly after a sentence (no blank line) still renders as a list. */
function parse(text: string): Block[] {
  const blocks: Block[] = [];
  const st: { cur: Block | null } = { cur: null };
  const flush = () => { if (st.cur) blocks.push(st.cur); st.cur = null; };
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    if (!raw.trim()) { flush(); continue; }
    const kind = BULLET.test(raw) ? "ul" : NUMBERED.test(raw) ? "ol" : "p";
    if (kind === "p") {
      let block = st.cur;
      if (!block || block.kind !== "p") { flush(); block = { kind: "p", lines: [] }; st.cur = block; }
      block.lines.push(raw.trim());
    } else {
      let block = st.cur;
      if (!block || block.kind !== kind) { flush(); block = { kind, items: [] }; st.cur = block; }
      block.items.push(raw.replace(kind === "ul" ? BULLET : NUMBERED, "").trim());
    }
  }
  flush();
  return blocks;
}

export function RichText({ text }: { text: string }) {
  return (
    <>
      {parse(text).map((b, bi) => {
        if (b.kind === "p") {
          return (
            <p key={bi} className="my-2 first:mt-0 last:mb-0">
              {b.lines.map((l, li) => <Fragment key={li}>{li > 0 && <br />}{inline(l, `${bi}-${li}-`)}</Fragment>)}
            </p>
          );
        }
        const Tag = b.kind;
        return (
          <Tag key={bi} className={`my-2 flex flex-col gap-1 pl-5 first:mt-0 last:mb-0 ${b.kind === "ol" ? "list-decimal" : "list-disc"} marker:text-accent`}>
            {b.items.map((it, li) => <li key={li}>{inline(it, `${bi}-${li}-`)}</li>)}
          </Tag>
        );
      })}
    </>
  );
}
