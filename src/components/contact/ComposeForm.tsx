"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { Button } from "@/components/common/Button";

const field =
  "w-full rounded-2xl border border-line bg-bg px-4 py-3 text-base outline-none sm:text-sm transition-colors placeholder:text-muted focus:border-accent";

/**
 * No backend: this opens the visitor's own mail client or Gmail with the message filled in.
 * We never claim a message was sent — the visitor presses Send in their mail app.
 */
export function ComposeForm() {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [status, setStatus] = useState("");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const build = () => {
    const subject = `Portfolio enquiry${name.trim() ? ` from ${name.trim()}` : ""}`;
    const sig = [name.trim(), from.trim()].filter(Boolean).join(" · ");
    const body = `${msg.trim()}${sig ? `\n\n— ${sig}` : ""}`;
    return { subject, body };
  };
  const valid = () => {
    if (msg.trim().length < 10) { setErr("Write a short message first (at least 10 characters)."); return false; }
    if (from.trim() && !/^\S+@\S+\.\S+$/.test(from.trim())) { setErr("That email address doesn't look right."); return false; }
    setErr("");
    return true;
  };
  const note = (s: string) => {
    setStatus(s);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus(""), 7000);
  };

  const gmail = () => {
    if (!valid()) return;
    const { subject, body } = build();
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    note("Gmail opened in a new tab with your message filled in. Press Send there to deliver it — nothing has been sent yet.");
  };
  const mailto = () => {
    if (!valid()) return;
    const { subject, body } = build();
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note("Your email app should open with the message ready. Press Send there to deliver it — nothing has been sent yet.");
  };
  const copy = async () => {
    if (!valid()) return;
    const { subject, body } = build();
    try {
      await navigator.clipboard.writeText(`To: ${profile.email}\nSubject: ${subject}\n\n${body}`);
      note("Message copied. Paste it into any email app and send it to " + profile.email + ".");
    } catch {
      note("Couldn't copy automatically. Select the text and copy it manually.");
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate className="flex flex-col gap-4 rounded-3xl border border-line bg-elevated p-6 shadow-soft sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Your name
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Ayesha Khan" className={field} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          <span>Your email <span className="font-normal text-muted">(optional)</span></span>
          <input value={from} onChange={(e) => setFrom(e.target.value)} type="email" autoComplete="email" placeholder="you@example.com" className={field} />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Message
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value.slice(0, 3000))}
          rows={7}
          placeholder="Tell me about the project, role or idea…"
          aria-invalid={!!err}
          aria-describedby="compose-err"
          className={`${field} resize-y`}
        />
      </label>
      <p id="compose-err" role="alert" className="min-h-5 text-sm text-accent-text">{err}</p>

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={gmail}>Compose in Gmail <span aria-hidden>↗</span></Button>
        <Button type="button" variant="secondary" onClick={mailto}>Open email app</Button>
        <Button type="button" variant="ghost" onClick={copy}>Copy message</Button>
      </div>
      <p role="status" aria-live="polite" className="min-h-10 text-sm text-muted">{status}</p>
    </form>
  );
}
