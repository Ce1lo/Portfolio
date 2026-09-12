/**
 * ---------------------------------------------------------------------------
 *  PERSONAL PHOTO ARCHIVE & SHOWCASE
 * ---------------------------------------------------------------------------
 *  Personal photo collection and contact information.
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
  role: "Student & Hobbyist Photographer",
  location: "Ho Chi Minh City, Vietnam",
  email: "toan.orywt@icloud.com",
  availability: "[AVAILABLE] Open for photo shoots & collaborations",
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
  primary: "View Gallery",
  secondary: "Contact Me",
} as const;

export const hero = {
  eyebrow: "ORYWT.ROM // PHOTO ARCHIVE",
  headline: ["Moments captured,", "one frame at a time."],
  subtext:
    "A personal collection of photos taken around Ho Chi Minh City, synced straight from Google Drive.",
  fallbackSeed: "cinematic-vietnam-portrait-film-light",
} as const;

export const aboutStatement = {
  eyebrow: "ABOUT.TXT // BIO",
  headline: "Just someone who likes taking photos.",
  paragraphs: [
    "Hey, I am Lâm Quốc Toàn (Orywt), a student based in Ho Chi Minh City.",
    "Photography is my hobby. I enjoy capturing campus events, street scenes, and everyday moments with friends. This website is where I keep and share my favorite shots.",
  ],
  stats: [
    { value: "HCM", label: "based in" },
    { value: "PHOTO", label: "hobby & passion" },
    { value: "DRIVE", label: "cloud synced" },
  ],
} as const;

export const site = {
  url: "https://orywt.vercel.app",
  title: `${profile.name} (${profile.shortName}) - Photo Gallery`,
  description:
    "Personal photo gallery of Lâm Quốc Toàn (Orywt), student and hobbyist photographer based in Ho Chi Minh City.",
  locale: "en",
  themeColor: "#c2410c",
} as const;
