/**
 * ---------------------------------------------------------------------------
 *  PHOTOGRAPHIC ARCHIVE & EXHIBITION MANIFEST
 * ---------------------------------------------------------------------------
 *  Curated collection, narrative statements, and contact.
 *  Images stream directly from your Google Drive synced manifest.
 */

export type SocialLink = {
  label: string;
  href: string;
  icon: "instagram" | "behance" | "envelope" | "globe" | "linkedin";
};

export const profile = {
  name: "Lâm Quốc Toàn",
  shortName: "Orywt",
  role: "Visual Artist & Documentary Photographer",
  location: "Ho Chi Minh City, Vietnam",
  email: "toan.orywt@icloud.com",
  availability: "[ONLINE] Available for commissions & event coverage",
} as const;

export const socials: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/orywt_/", icon: "instagram" },
  { label: "Email", href: "mailto:toan.orywt@icloud.com", icon: "envelope" },
];

export const nav = [
  { id: "gallery", label: "Gallery" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export const CTA_LABELS = {
  primary: "Explore Gallery",
  secondary: "Get in Touch",
} as const;

export const hero = {
  eyebrow: "SYS.ROM // ARCHIVE 2025-2026",
  headline: ["The human presence,", "captured frame by frame."],
  subtext:
    "An evolving visual archive capturing human gesture and event cadence across Ho Chi Minh City. Synced live from Google Drive.",
  fallbackSeed: "cinematic-vietnam-portrait-film-light",
} as const;

export const aboutStatement = {
  eyebrow: "ABOUT.TXT // PROFILE",
  headline: "Observing fleeting moments through natural light.",
  paragraphs: [
    "I am Lâm Quốc Toàn (Orywt), a visual artist and documentary photographer based in Ho Chi Minh City, Vietnam.",
    "Every photograph in this collection was captured under ambient conditions, preserving authentic emotion, urban texture, and the honest cadence of everyday life.",
  ],
  stats: [
    { value: "LIVE", label: "cloud archive stream" },
    { value: "SYNC", label: "Google Drive automation" },
    { value: "HCM", label: "primary operating base" },
  ],
} as const;

export const site = {
  url: "https://orywt.vercel.app",
  title: `${profile.name} (${profile.shortName}) - Photography Archive & Visual Gallery`,
  description:
    "Curated photographic gallery and visual archive of Lâm Quốc Toàn (Orywt) based in Ho Chi Minh City, Vietnam.",
  locale: "en",
  themeColor: "#c2410c",
} as const;
