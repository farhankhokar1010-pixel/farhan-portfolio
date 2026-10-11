import type { Metadata } from "next";
import { ButtonLink } from "@/components/common/Button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-3xl flex-col items-start justify-center gap-6 px-6 sm:px-12">
      <p className="label text-accent-text">Error 404</p>
      <h1 className="font-display text-6xl font-semibold tracking-tight sm:text-8xl">Lost in 3D space.</h1>
      <p className="max-w-md text-lg text-muted">That page doesn&apos;t exist. The portfolio is a single page, so everything you need is one click away.</p>
      <ButtonLink href="/">Back to the portfolio</ButtonLink>
    </main>
  );
}
