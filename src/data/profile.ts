import type { Profile } from "./types";

// Contact details come from Farhan's resume PDF; phone + WhatsApp were added at his request.
// Fiverr link and availability wording are still unknown: add them here and the UI picks them up.
export const profile: Profile = {
  name: "Muhammad Farhan",
  title: "Software Engineer",
  tagline: "I build digital experiences where technology meets creativity.",
  email: "farhankhokar1010@gmail.com",
  location: "Bahawalpur, Pakistan",
  phone: { display: "0313 7050232", tel: "+923137050232" },
  // Opens a WhatsApp chat with a ready-made first message. (Old QR link, if ever needed: https://wa.me/qr/247DIYQYSU55M1)
  whatsappUrl: "https://wa.me/923137050232?text=Hey%20there!%20I%20need%20help%20with%20a%20quick%20query",
  socials: [
    { label: "GitHub", href: "https://github.com/farhankhokar1010-pixel" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammadfarhan1010" },
    // { label: "Fiverr", href: "https://www.fiverr.com/<username>" },   // TODO: add when Farhan shares it
  ],
  resumeUrl: "/Muhammad_Farhan_Resume.pdf",
  // availability: "…",   // TODO: confirm wording with Farhan
};
