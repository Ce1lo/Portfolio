/**
 * ---------------------------------------------------------------------------
 *  PHOTOGRAPHIC ARCHIVE & EXHIBITION MANIFEST
 * ---------------------------------------------------------------------------
 *  Curated collection, exhibition chapters, narrative statements, and contact.
 *  Images stream directly from your Google Drive synced manifest.
 */

export type SocialLink = {
  label: string;
  href: string;
  icon: "instagram" | "behance" | "envelope" | "globe" | "linkedin";
};

export type CuratedAlbum = {
  id: string;
  title: string;
  subtitle: string;
  curatorNote: string;
  year: string;
  location: string;
  imageIndices: number[];
  focalTag: string;
};

export const profile = {
  name: "Lâm Quốc Toàn",
  shortName: "Orywt",
  role: "Visual Artist & Documentary Photographer",
  location: "Ho Chi Minh City, Vietnam",
  email: "toan.orywt@icloud.com",
  availability: "Open for visual commissions, print sales & exhibitions",
} as const;

export const socials: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/orywt_/", icon: "instagram" },
  { label: "Email", href: "mailto:toan.orywt@icloud.com", icon: "envelope" },
];

export const nav = [
  { id: "albums", label: "Albums" },
  { id: "archive", label: "Archive" },
  { id: "curator", label: "Perspective" },
  { id: "contact", label: "Inquire" },
] as const;

export const CTA_LABELS = {
  primary: "Explore exhibition",
  secondary: "Commission work",
} as const;

export const hero = {
  headline: ["The human presence,", "captured between seconds."],
  subtext:
    "An archive of 33 frames exploring silence, natural light, and authentic fleeting gesture across Vietnam.",
  fallbackSeed: "cinematic-vietnam-portrait-film-light",
} as const;

export const albums: CuratedAlbum[] = [
  {
    id: "twilight-echoes",
    title: "Twilight Echoes",
    subtitle: "Chroma and Shadows at Dusk",
    curatorNote:
      "A nocturnal study of ambient street lighting and lingering silhouettes. Balancing deep tungsten warmth against quiet blue hours.",
    year: "2025 - 2026",
    location: "Saigon Alleys",
    imageIndices: [0, 1, 2, 3, 4, 5],
    focalTag: "Nocturne",
  },
  {
    id: "tacit-intimacy",
    title: "Tacit Intimacy",
    subtitle: "Portraits in Natural Falloff",
    curatorNote:
      "Stripping away set design to focus purely on tactile expression, unfiltered eye contact, and the gravity of stillness.",
    year: "2025",
    location: "Studio & Daylight",
    imageIndices: [6, 7, 8, 9, 10, 11],
    focalTag: "Portrait",
  },
  {
    id: "monsoon-cadence",
    title: "Monsoon Cadence",
    subtitle: "Documentary Rhythm of the Everyday",
    curatorNote:
      "Unrehearsed human scenes recorded with 35mm patience. Documenting the resilience, texture, and spirit of street life.",
    year: "2024 - 2025",
    location: "Central & Southern Coastal",
    imageIndices: [12, 13, 14, 15, 16, 17],
    focalTag: "Documentary",
  },
];

export const curatorStatement = {
  headline: "Light as memory, shadow as structure.",
  paragraphs: [
    "Photography is fundamentally an exercise in selective attention. In an era overwhelmed by algorithmic velocity and synthetic imagery, I deliberately turn toward the tactile, the imperfect, and the analog spirit of observation.",
    "Every photograph in this collection was captured under ambient conditions, allowing natural light to sculpt the mood without aggressive digital intervention. The goal is not technical perfection, but honest resonance: preserving the texture of a glance, the grain of a wall, or the briefest suspension of time.",
  ],
  stats: [
    { value: "33", label: "master frames in current archive" },
    { value: "35mm", label: "format discipline & medium" },
    { value: "03", label: "monograph chapters" },
  ],
} as const;

export const site = {
  url: "https://orywt.vercel.app",
  title: `${profile.name} (${profile.shortName}) - Photography Archive & Visual Gallery`,
  description:
    "Curated photographic gallery and visual archive of Lâm Quốc Toàn (Orywt), showcasing editorial portraits, nocturnal street essays, and documentary frames.",
  locale: "en",
  themeColor: "#c2410c",
} as const;
