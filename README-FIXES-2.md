# Fixes round 2 — how to apply
1. Unzip over your project (same paths). No new dependencies.
2. Restart `npm run dev`, hard-refresh (Ctrl+Shift+R).

## What changed
- Contact: new tile layout with icons (Email + copy, WhatsApp, Call, LinkedIn, GitHub). Phone 0313 7050232 added (`tel:` link).
- WhatsApp tile opens your own WhatsApp QR link (wa.me/qr/247DIYQYSU55M1, decoded from your screenshot) = same as scanning it. If you ever reset the QR in WhatsApp, change `whatsappUrl` in `src/data/profile.ts` to https://wa.me/923137050232.
- ACT AI verify link now https://actai.aiskillbridge.pk/v/RQN3FGT6D58TQK8F.
- Certificates is its own section with its own heading (06) and nav link; Contact is now 07.
- Contact form is vertically centred against the left column and the section fills the laptop screen, so the form sits mid-screen.
- Mobile menu spacing tightened so 7 links + buttons fit.
- Ask Farhan knows the phone/WhatsApp and the new section names.
