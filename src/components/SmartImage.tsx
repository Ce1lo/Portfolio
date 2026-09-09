import type { PortfolioImage } from "@/lib/manifest";
import { placeholderUrl } from "@/lib/manifest";
import { cx } from "@/lib/cx";

export type SmartImageProps = {
  /** Synced Drive asset, or null to fall back to a seeded placeholder photo. */
  image: PortfolioImage | null;
  alt: string;
  /** Seed for the placeholder. Describe the subject, it picks the photo. */
  fallbackSeed: string;
  fallbackWidth?: number;
  fallbackHeight?: number;
  /** Responsive sizes hint. Required for anything wider than a thumbnail. */
  sizes?: string;
  /** Above-the-fold images must opt out of lazy loading. */
  priority?: boolean;
  className?: string;
  wrapperClassName?: string;
  /** Optional aspect-ratio utility applied to the wrapper to reserve space. */
  ratioClassName?: string;
};

/**
 * Renders a pre-optimised asset as `<picture>` with AVIF preferred and WebP as
 * the universal fallback.
 *
 * next/image is intentionally not used here. The sync script already produced
 * AVIF and WebP at a fixed size with real pixel dimensions, so next/image would
 * re-encode an already-compressed file at request time and spend Vercel function
 * CPU for no visual gain. Plain `<img>` with explicit width and height gives the
 * same CLS protection without the runtime cost.
 */
export function SmartImage({
  image,
  alt,
  fallbackSeed,
  fallbackWidth = 1200,
  fallbackHeight = 800,
  sizes,
  priority = false,
  className,
  wrapperClassName,
  ratioClassName,
}: SmartImageProps) {
  const shared = {
    alt,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    decoding: "async" as const,
    sizes,
    fetchPriority: priority ? ("high" as const) : undefined,
    className: cx("block h-full w-full object-cover", className),
  };

  const inner = image ? (
    <picture>
      <source srcSet={`/${image.avif}`} type="image/avif" width={image.width} height={image.height} />
      <source srcSet={`/${image.webp}`} type="image/webp" width={image.width} height={image.height} />
      <img src={`/${image.webp}`} width={image.width} height={image.height} {...shared} />
    </picture>
  ) : (
    <img
      src={placeholderUrl(fallbackSeed, fallbackWidth, fallbackHeight)}
      width={fallbackWidth}
      height={fallbackHeight}
      {...shared}
    />
  );

  return (
    <div className={cx("overflow-hidden bg-bg-sunken", ratioClassName, wrapperClassName)}>{inner}</div>
  );
}
