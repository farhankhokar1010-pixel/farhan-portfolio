"use client";

import { useState } from "react";
import { getProject } from "@/data/projects";
import { cn } from "@/lib/cn";
import { CaseStudy } from "./CaseStudy";
import { useLightbox } from "./Lightbox";
import { ProjectLinks } from "./ProjectLinks";
import { ScreenFrame } from "./ScreenFrame";

const project = getProject("medimart");

const VIEWS = [
  { tab: "Storefront", note: "The public entry point: shop as a customer, sign in, register, or apply to join the team." },
  { tab: "Admin panel", note: "Quick actions plus live counters for medicines, orders, revenue, customers and staff — and the hiring switch." },
  { tab: "Orders & receipts", note: "Itemised receipts with payment method and status, tied to a customer-visible order timeline." },
];

const ROLES = [
  { role: "Super Admin", can: "Full system control: hiring, inventory, suppliers, purchases, analytics, settings and logs." },
  { role: "Staff", sub: "Pharmacist · Inventory Manager · Cashier", can: "Role-specific dashboards for medicines, inventory and orders. Accounts exist only after admin approval." },
  { role: "Customer", can: "Browse and search, build a cart, check out and track orders. Nothing beyond that." },
];

const FLOW = ["Browse", "Cart", "Checkout", "Track", "Receipt"];

/** Practical-software treatment: light, clean, role-first — mirrors MediMart's own green/yellow UI. */
export function MediMartShowcase() {
  const { open } = useLightbox();
  const [view, setView] = useState(1);

  const vars = {
    "--p-ink": "#17301f", "--p-accent": "#2f7d4f", "--p-accent-text": "#256a42", "--p-on": "#ffffff", "--p-line": "rgba(23,48,31,0.22)",
    background: "radial-gradient(70% 60% at 100% 0%, rgba(224,193,58,0.55), transparent 60%), radial-gradient(60% 50% at 0% 100%, rgba(47,125,79,0.18), transparent 60%), #f4f6ef",
  } as React.CSSProperties;

  return (
    <article id="medimart" style={vars} className="relative overflow-hidden rounded-[2rem] p-5 text-[color:var(--p-ink)] sm:p-8 lg:p-10">
      <header className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_auto] lg:items-end [&>*]:min-w-0">
        <div className="flex max-w-3xl flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--p-accent-text)]">{project.index} · Practical software</span>
            <span className="rounded-full border border-[color:var(--p-line)] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest">Built · online soon</span>
          </div>
          <h3 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">Medi<span className="text-[color:var(--p-accent)]">Mart</span></h3>
          <p className="font-display text-xl font-medium sm:text-2xl">{project.tagline}</p>
          <p className="max-w-2xl opacity-85">{project.summary}</p>
        </div>
        <ProjectLinks project={project} />
      </header>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[7fr_5fr] [&>*]:min-w-0">
        <div className="flex flex-col gap-4">
          <div role="tablist" aria-label="MediMart views" className="flex flex-wrap gap-2">
            {VIEWS.map((v, i) => (
              <button
                key={v.tab}
                role="tab"
                aria-selected={view === i}
                onClick={() => setView(i)}
                data-cursor="button"
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  view === i ? "bg-[color:var(--p-accent)] text-[color:var(--p-on)]" : "border border-[color:var(--p-line)] hover:border-[color:var(--p-accent)]",
                )}
              >
                {v.tab}
              </button>
            ))}
          </div>
          <div key={view} className="lb-in">
            <ScreenFrame screen={project.screens[view]} onClick={() => open(project.screens, view)} sizes="(min-width: 1024px) 700px, 100vw" />
          </div>
          <p className="text-sm opacity-85" aria-live="polite">{VIEWS[view].note}</p>
        </div>

        <div className="flex flex-col gap-5">
          <section aria-labelledby="mm-roles">
            <h4 id="mm-roles" className="font-mono text-xs uppercase tracking-widest text-[color:var(--p-accent-text)]">Who can do what</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {ROLES.map((r) => (
                <li key={r.role} className="rounded-2xl border border-[color:var(--p-line)] bg-white/60 px-4 py-3 transition-colors hover:bg-white">
                  <p className="font-display text-lg font-semibold">{r.role}</p>
                  {r.sub && <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[color:var(--p-accent-text)]">{r.sub}</p>}
                  <p className="mt-1 text-sm opacity-85">{r.can}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="mm-flow">
            <h4 id="mm-flow" className="font-mono text-xs uppercase tracking-widest text-[color:var(--p-accent-text)]">Order flow</h4>
            <ol className="mt-4 flex flex-wrap items-center gap-2">
              {FLOW.map((f, i) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="flex items-center gap-2 rounded-full bg-[color:var(--p-accent)] px-3 py-1.5 text-sm font-medium text-[color:var(--p-on)]">
                    <span className="font-mono text-[0.65rem]">0{i + 1}</span>{f}
                  </span>
                  {i < FLOW.length - 1 && <span aria-hidden className="text-[color:var(--p-accent)]">→</span>}
                </li>
              ))}
            </ol>
          </section>

        </div>
      </div>

      <div className="mt-6"><CaseStudy project={project} /></div>
    </article>
  );
}
