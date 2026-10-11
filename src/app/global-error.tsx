"use client";

// Replaces the root layout when it crashes, so it cannot rely on the site's CSS or fonts.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100dvh", display: "grid", placeItems: "center", background: "#1a1a1a", color: "#f2f2f2", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ maxWidth: 520, padding: 24 }}>
          <h1 style={{ fontSize: 40, margin: "0 0 12px" }}>Something went wrong.</h1>
          <p style={{ color: "#a8a8a8", lineHeight: 1.6 }}>The page failed to load. Please try again.</p>
          <button onClick={reset} style={{ marginTop: 16, padding: "12px 22px", borderRadius: 999, border: 0, background: "#ff8a2b", color: "#1a1a1a", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>Try again</button>
        </main>
      </body>
    </html>
  );
}
