"use client";

import { useEffect } from "react";
import { Button } from "@/components/common/Button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-3xl flex-col items-start justify-center gap-6 px-6 sm:px-12">
      <p className="label text-accent-text">Something broke</p>
      <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-7xl">That wasn&apos;t supposed to happen.</h1>
      <p className="max-w-md text-lg text-muted">An unexpected error stopped this page from loading. Trying again usually fixes it.</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
