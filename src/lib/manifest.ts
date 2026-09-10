import rawManifest from "@/generated/image-manifest.json";

/**
 * Shape written by scripts/sync-drive.mjs.
 *
 * Declared by hand rather than inferred from the JSON import, because an empty
 * manifest infers `images: never[]` and every consumer would then have to cast.
 */
export type PortfolioImage = {
  id: string;
  slug: string;
  source: {
    fileId: string;
    name: string;
    folderPath: string;
    md5: string | null;
    mimeType: string | null;
    sizeBytes: number;
    modifiedTime: string | null;
  };
  avif: string;
  webp: string;
  width: number;
  height: number;
  bytes: { avif: number; webp: number };
  createdAt: string;
  syncedAt: string;
  // Curation & classification extensions
  customTitle?: string;
  category?: "Portrait" | "Group" | "Landscape" | "Moment" | "Nocturne" | string;
  detectedTheme?: string;
  sortOrder?: number;
};

export type ImageManifest = {
  generatedAt: string | null;
  count: number;
  source: { provider: string; folderId: string };
  publicBase: string;
  images: PortfolioImage[];
};

const typed = rawManifest as Partial<ImageManifest>;

export const manifest: ImageManifest = {
  generatedAt: typed.generatedAt ?? null,
  count: typed.count ?? 0,
  source: typed.source ?? { provider: "google-drive", folderId: "" },
  publicBase: typed.publicBase ?? "/images",
  images: Array.isArray(typed.images) ? typed.images : [],
};

export const isSynced = manifest.images.length > 0 && manifest.generatedAt !== null;

/** Every synced image, newest first (the sync script already sorts, this re-asserts it). */
export function getAllImages(): PortfolioImage[] {
  return [...manifest.images].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

/**
 * Images whose Drive folder path starts with `prefix`.
 * Matching is on the Drive folder structure, so organising Drive as
 * `projects/ticket-booking/` and `gallery/` directly controls which
 * section an image lands in.
 */
export function getImagesByFolder(prefix: string): PortfolioImage[] {
  const needle = prefix.replace(/^\/+|\/+$/g, "").toLowerCase();
  if (needle.length === 0) return getAllImages();
  return getAllImages().filter((img) => img.source.folderPath.toLowerCase().startsWith(needle));
}

/** First image whose Drive filename or slug contains `needle`. */
export function findImage(needle: string): PortfolioImage | null {
  const q = needle.toLowerCase();
  return (
    getAllImages().find(
      (img) => img.slug.includes(q) || img.source.name.toLowerCase().includes(q),
    ) ?? null
  );
}

/**
 * Deterministic placeholder used until the first Drive sync produces real assets.
 * picsum.photos serves real CC0 photography keyed by seed, so the layout keeps a
 * believable aspect ratio instead of collapsing into a grey box.
 */
export function placeholderUrl(seed: string, width: number, height: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

export type ResolvedImage =
  | { kind: "synced"; src: PortfolioImage }
  | { kind: "placeholder"; url: string; width: number; height: number; alt: string };

/** Prefer a real synced asset, fall back to a seeded placeholder. */
export function resolveImage(
  preferred: PortfolioImage | null,
  fallback: { seed: string; width: number; height: number; alt: string },
): ResolvedImage {
  if (preferred) return { kind: "synced", src: preferred };
  return {
    kind: "placeholder",
    url: placeholderUrl(fallback.seed, fallback.width, fallback.height),
    width: fallback.width,
    height: fallback.height,
    alt: fallback.alt,
  };
}

/** Human readable byte count for the gallery caption and the sync badge. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function totalSyncedBytes(): number {
  return manifest.images.reduce((sum, img) => sum + (img.bytes.webp || 0), 0);
}
