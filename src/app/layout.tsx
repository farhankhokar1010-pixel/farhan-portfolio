import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Loader } from "@/components/common/Loader";
import { HashScroll } from "@/components/common/HashScroll";
import { SoundEffects } from "@/components/common/SoundEffects";
import { EnvironmentZones } from "@/components/common/EnvironmentZones";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { NavShell } from "@/components/navigation/NavShell";
import { AskFarhan } from "@/components/ai/AskFarhan";
import { PreferencesProvider } from "@/components/common/PreferencesProvider";
import { bootScript } from "@/lib/bootScript";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";
import "@/styles/globals.css";

const display = localFont({ src: "../fonts/Bricolage.woff2", variable: "--font-bricolage", weight: "200 800", display: "swap" });
const sans = localFont({ src: "../fonts/Inter.woff2", variable: "--font-inter", weight: "100 900", display: "swap" });
const mono = localFont({ src: "../fonts/JetBrainsMono.woff2", variable: "--font-jetbrains", weight: "100 800", display: "swap" });

const pageTitle = `${profile.name} — ${profile.title}`;
const pageDescription = `${profile.name}, ${profile.title} and BS Software Engineering student at The Islamia University of Bahawalpur. Full-stack web, Flask and AI projects — ${profile.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: pageTitle, template: `%s | ${profile.name}` },
  description: pageDescription,
  applicationName: `${profile.name} — Portfolio`,
  authors: [{ name: profile.name, url: siteUrl }],
  keywords: ["Muhammad Farhan", "software engineer", "full-stack developer", "Flask", "Python", "AI", "portfolio", "Bahawalpur", "Pakistan"],
  alternates: { canonical: "/" },
  openGraph: { title: pageTitle, description: pageDescription, type: "website", url: "/", siteName: `${profile.name} — Portfolio`, locale: "en" },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  robots: { index: true, follow: true },
};

// Structured data so search engines understand who this page is about.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  description: pageDescription,
  url: siteUrl,
  image: `${siteUrl}/images/farhan-profile.webp`,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Bahawalpur", addressCountry: "PK" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "The Islamia University of Bahawalpur" },
  sameAs: profile.socials.map((s) => s.href),
  knowsAbout: ["Web development", "Flask", "Python", "JavaScript", "Artificial intelligence"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f9fd" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {/* Start downloading the right GLB immediately (matches the desktop / mobile choice in Scene). */}
        <link rel="preload" href="/models/farhan.glb" as="fetch" crossOrigin="anonymous" media="(min-width: 768px)" />
        <link rel="preload" href="/models/farhan-lite.glb" as="fetch" crossOrigin="anonymous" media="(max-width: 767px)" />
      </head>
      <body className="min-h-dvh text-ink antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }} />
        <PreferencesProvider>
          <a
            href="#main"
            className="sr-only z-[110] rounded-full bg-accent px-4 py-2 text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <Loader />
          <EnvironmentZones />
          <SoundEffects />
          <HashScroll />
          <CustomCursor />
          <NavShell />
          {children}
          <AskFarhan />
        </PreferencesProvider>
      </body>
    </html>
  );
}
