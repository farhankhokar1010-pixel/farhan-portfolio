import type { Project } from "./types";

/**
 * ─────────────────────────────────────────────────────────────
 *  WHERE TO PUT YOUR LINKS
 *  Each project has `links: { live, github }`.
 *  Replace `undefined` with the URL string, e.g.
 *     links: { live: "https://resume-nova.example.com", github: "https://github.com/you/resume-nova" }
 *  While a link is `undefined` its button shows "Coming soon".
 * ─────────────────────────────────────────────────────────────
 */
export const projects: Project[] = [
  {
    slug: "resume-nova",
    index: "01",
    name: "Resume Nova",
    status: "built",
    flagship: true,
    tagline: "Build a resume that gets hired — then write the cover letter from the same profile.",
    summary:
      "A full-stack Flask product for building, previewing and exporting resumes and cover letters. It combines a database-backed editor, an AI writing layer, job-match insights, an admin-managed template system and support tooling in one app.",
    highlights: [
      "Live preview uses the same markup as the exported PDF, so what you see is what you download",
      "Provider-agnostic AI layer (Groq or xAI/Grok) that fails gracefully when no key is set",
      "Admin-managed templates, font pairings and colour themes rendered in a sandboxed Jinja environment",
      "Recovery-code password reset with no email dependency",
    ],
    stack: ["Python", "Flask 3", "SQLAlchemy", "Flask-Login", "Flask-Migrate", "SQLite / PostgreSQL", "Jinja2", "WeasyPrint", "Vanilla JS & CSS"],
    screens: [
      { src: "/images/projects/resume-nova/landing.webp", alt: "Resume Nova landing page with the headline 'Build a Resume That Gets Hired'", caption: "Landing page", width: 1600, height: 765 },
      { src: "/images/projects/resume-nova/cover-letter.webp", alt: "Resume Nova cover letter editor with live PDF-style preview", caption: "Cover-letter editor with live preview", width: 1600, height: 763 },
      { src: "/images/projects/resume-nova/admin-dashboard.webp", alt: "Resume Nova admin dashboard with usage metrics and template statistics", caption: "Admin dashboard", width: 1600, height: 763 },
    ],
    features: [
      { title: "Resume builder", items: ["Multiple resumes per user", "Dynamic sections: add, remove, enable, reorder", "Theme and font pairing per resume", "Debounced autosave", "Duplicate, rename, delete"] },
      { title: "Cover letters", items: ["Generate from a resume or freeform profile", "Tone and length controls", "Job-match insights sheet", "Rich-text editing", "Live preview and PDF export"] },
      { title: "AI actions", items: ["Professional summary", "Experience bullets", "Education notes", "Skill suggestions", "Candidate introduction", "Text rewriting", "ATS analysis", "Job matching with keyword fallback"] },
      { title: "Admin & support", items: ["Resume and cover-letter template management", "Font pairings and colour themes", "Dashboard metrics and usage trends", "User management with guardrails", "Support tickets with shared conversations"] },
    ],
    links: { live: undefined, github: undefined },
  },
  {
    slug: "medimart",
    index: "02",
    name: "MediMart",
    status: "built",
    tagline: "A pharmacy that runs itself — storefront, stock and staff in one system.",
    summary:
      "A full-featured pharmacy management web app built with Flask and SQLite. Customers shop online, staff manage stock and orders, and a super admin controls hiring, inventory and analytics — each role sees only what it needs.",
    highlights: [
      "Role-based access for Super Admin, Pharmacist, Inventory Manager, Cashier and Customer",
      "Staff hiring workflow: apply, admin approves, account created with a temporary password",
      "Inventory with low-stock, out-of-stock and colour-coded expiry alerts",
      "Full order flow with checkout, status timeline and printable receipts",
    ],
    stack: ["Python", "Flask", "SQLite", "SQLAlchemy", "bcrypt", "Jinja2", "Vanilla JS & CSS"],
    screens: [
      { src: "/images/projects/medimart/storefront.webp", alt: "MediMart public storefront with the headline 'Your Smart Online Pharmacy'", caption: "Public storefront", width: 1600, height: 768 },
      { src: "/images/projects/medimart/admin-dashboard.webp", alt: "MediMart admin dashboard showing medicines, orders, revenue and staff counts", caption: "Admin dashboard", width: 1600, height: 752 },
      { src: "/images/projects/medimart/order-receipt.webp", alt: "MediMart order receipt showing items, payment method and payment status", caption: "Order receipt", width: 1600, height: 771 },
    ],
    features: [
      { title: "Security & access", items: ["bcrypt password hashing", "Lockout for 15 minutes after 5 failed logins", "Fixed Super Admin account that cannot be deleted", "Staff signup only after admin approval"] },
      { title: "Medicines & inventory", items: ["SKU, category, supplier, pricing and cost price", "Image upload and expiry tracking", "Real-time stock levels with configurable minimum", "Inventory valuation (stock × cost)"] },
      { title: "Customer shop", items: ["Browse, search and filter by category", "Cart with quantity updates", "Checkout with address and payment method", "Order history with live status timeline"] },
      { title: "Admin analytics", items: ["Monthly revenue chart", "Top-selling medicines", "Sales by category", "Activity logs, suppliers and purchases"] },
    ],
    links: { live: undefined, github: undefined },
  },
  {
    slug: "passportai",
    index: "03",
    name: "PassportAI",
    status: "built",
    tagline: "Upload any portrait. Get a compliant passport photo.",
    summary:
      "An AI-powered passport photo processor. A nine-step pipeline detects the face, analyses and corrects pose, enhances lighting, replaces the background and exports four print-ready sizes — streaming live progress to the browser as each step finishes. The core pipeline runs on CPU with no GPU required.",
    highlights: [
      "Real-time pipeline progress streamed to the UI with Server-Sent Events",
      "Image hashing (MD5 + perceptual) returns cached results instantly for repeat uploads",
      "Face embeddings with cosine similarity update an existing record when the same face is re-uploaded",
      "Each step is self-contained, so CPU implementations can be swapped for GPU models without touching the orchestrator",
    ],
    stack: ["Python", "Flask", "Server-Sent Events", "SQLite", "SQLAlchemy", "OpenCV", "MediaPipe", "rembg (U2Net)", "Pillow"],
    screens: [
      { src: "/images/projects/passportai/upload.webp", alt: "PassportAI upload page with drag-and-drop area and processing pipeline list", caption: "Upload and pipeline overview", width: 1600, height: 756 },
      { src: "/images/projects/passportai/result-dark.webp", alt: "PassportAI result page in dark mode showing pipeline images and final passport photo", caption: "Result page (dark)", width: 1600, height: 760 },
      { src: "/images/projects/passportai/result-light.webp", alt: "PassportAI result page in light mode with download size options", caption: "Result page (light)", width: 1600, height: 756 },
    ],
    features: [
      { title: "Pipeline", items: ["Validation and database check", "Face detection (OpenCV Haar cascade)", "Pose analysis (MediaPipe FaceMesh)", "Geometric pose correction and framing", "Lighting: CLAHE and colour balance, with an optional PicsArt AI step", "Background removal (U2Net) with GrabCut fallback"] },
      { title: "Outputs", items: ["Passport 413 × 531 px at 300 dpi", "Full 1800 × 2400 px at 300 dpi", "Medium 900 × 1200 px at 150 dpi", "Thumbnail 200 × 267 px at 72 dpi"] },
      { title: "Engineering", items: ["Flask blueprints, one per concern", "Per-step enable flags in config", "Stubs for Grounded-SAM, ControlNet SDXL, Retinexformer and MODNet", "Light and dark UI"] },
    ],
    links: { live: undefined, github: undefined },
  },
  {
    slug: "document-setter",
    index: "04",
    name: "Document Setter",
    status: "in-development",
    tagline: "Document automation and formatting — currently being built.",
    summary: "A new product in active development. Details will appear here as it takes shape.",
    highlights: [],
    stack: [],
    screens: [],
    features: [],
    links: { live: undefined, github: undefined },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)!;
