"use client";

import { ArrowUpRight, ArrowDown } from "@phosphor-icons/react";
import Link from "next/link";
import {
  profile,
  hero,
  stats,
  CTA_LABELS,
  imageSlots,
} from "@/content/portfolio";
import { getAllImages, getImagesByFolder, formatBytes, totalSyncedBytes, isSynced } from "@/lib/manifest";
import { SmartImage } from "@/components/SmartImage";
import { Reveal } from "@/components/Reveal";
import { Z } from "@/lib/z";

/**
 * Asymmetric split hero.
 *
 * Text budget is enforced by src/content/portfolio.ts: one status pill, a
 * two-line headline, a 20-word subtext, and two CTAs. Nothing else is allowed in
 * here. Trust strips, feature bullets and pricing teasers belong in their own
 * sections below the fold.
 *
 * `min-h-[calc(100dvh-68px)]` matches the 68px sticky nav exactly, so the CTAs
 * are always inside the initial viewport and the hero never overflows into a
 * forced scroll. `dvh` rather than `vh` because iOS Safari's dynamic toolbar
 * otherwise pushes the bottom of the hero off-screen.
 */
export function Hero() {
  const heroImage = getImagesByFolder(imageSlots.hero)[0] ?? getAllImages()[0] ?? null;

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-32 -right-40 size-[560px] rounded-full bg-accent-soft blur-3xl ${Z.backdrop}`}
      />

      <div className="max-shell relative flex min-h-[calc(100dvh-68px)] items-center px-5 py-14 md:px-8 md:py-20">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-7 lg:col-span-7">
            <Reveal from="up" delay={0.05} duration={0.55}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-surface px-3.5 py-1.5 text-[12.5px] font-medium text-fg-muted">
                <span className="relative flex size-2" aria-hidden="true">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                {profile.availability}
              </span>
            </Reveal>

            <Reveal from="up" delay={0.12}>
              <h1 className="text-balance text-4xl leading-[1.04] font-medium tracking-tight text-fg md:text-5xl lg:text-6xl">
                <span className="block">{hero.headline[0]}</span>
                <span className="block text-fg-subtle">{hero.headline[1]}</span>
              </h1>
            </Reveal>

            <Reveal from="up" delay={0.2}>
              <p className="measure text-[17px] leading-relaxed text-fg-muted">{hero.subtext}</p>
            </Reveal>

            <Reveal from="up" delay={0.27}>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="#work"
                  className="press inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-accent-fg hover:bg-accent-hover"
                >
                  {CTA_LABELS.primary}
                  <ArrowDown size={17} weight="bold" aria-hidden="true" />
                </Link>
                <Link
                  href="#contact"
                  className="press inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface px-6 py-3 text-[15px] font-medium text-fg hover:border-fg-subtle"
                >
                  {CTA_LABELS.secondary}
                  <ArrowUpRight size={17} weight="bold" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal from="left" delay={0.18} duration={0.75} className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none">
              {/* Offset accent frame. Purely a compositional offset, not a glow. */}
              <div
                aria-hidden="true"
                className="absolute -top-3 -right-3 h-full w-full rounded-[12px] border border-accent/35"
              />
              <SmartImage
                image={heroImage}
                alt={heroImage ? heroImage.source.name : "Workspace photograph"}
                fallbackSeed={hero.fallbackSeed}
                fallbackWidth={900}
                fallbackHeight={1120}
                sizes="(max-width: 1023px) 90vw, 38vw"
                priority
                ratioClassName="aspect-[4/5] rounded-[12px] shadow-tinted-lg"
                wrapperClassName="relative"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * Fact band directly under the hero.
 *
 * Kept out of the hero itself so the hero stays at four text elements. Values
 * come from src/content/portfolio.ts and are all verifiable from the roadmap;
 * invented metrics would be worse than no metrics.
 */
export function StatsBand() {
  const syncedNote = isSynced
    ? `${getAllImages().length} images synced from Drive, ${formatBytes(totalSyncedBytes())} served as WebP`
    : "No Drive sync yet. Images below are seeded placeholders.";

  return (
    <section aria-label="Facts" className="border-y border-hairline bg-bg-sunken">
      <div className="max-shell px-5 py-8 md:px-8 md:py-10">
        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              from="up"
              delay={index * 0.08}
              duration={0.5}
              className="flex flex-col gap-1"
            >
              <dt className="order-2 text-[13px] leading-snug text-fg-muted">{stat.label}</dt>
              <dd className="order-1 font-mono text-2xl font-medium tracking-tight text-fg md:text-[28px]">
                {stat.value}
              </dd>
            </Reveal>
          ))}
        </dl>
        <p className="mt-8 font-mono text-[11.5px] leading-relaxed text-fg-subtle">{syncedNote}</p>
      </div>
    </section>
  );
}
