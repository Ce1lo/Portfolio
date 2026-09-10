"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import { hero, CTA_LABELS, profile } from "@/content/portfolio";
import { getAllImages } from "@/lib/manifest";
import { SmartImage } from "@/components/SmartImage";

export function Hero() {
  const images = getAllImages();
  const heroImage = images[0] ?? null;
  const inlineImage = images[1] ?? null;

  return (
    <section id="top" className="relative min-h-[92dvh] flex flex-col justify-between pt-16 pb-12 overflow-hidden">
      {/* Background ambient radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[780px] rounded-full bg-accent/8 blur-[140px]"
      />

      <div className="max-shell relative z-10 mx-auto w-full px-5 md:px-8">
        {/* Availability pill */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-surface/80 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-fg-muted shadow-tinted">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {profile.availability}
          </span>
        </div>

        {/* 2-Line Iron Rule Heading with Ultra-Wide Container */}
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-balance font-medium tracking-tight text-fg text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] leading-[1.05]">
            <span className="block">{hero.headline[0]}</span>
            <span className="block text-fg-subtle">
              captured{" "}
              {inlineImage ? (
                <span className="inline-block mx-2.5 h-10 w-24 sm:h-14 sm:w-32 md:h-16 md:w-36 rounded-full overflow-hidden border border-hairline-strong align-middle shadow-tinted">
                  <SmartImage
                    image={inlineImage}
                    alt="Inline preview"
                    fallbackSeed="art-detail"
                    fallbackWidth={300}
                    fallbackHeight={150}
                    className="h-full w-full object-cover grayscale contrast-125"
                  />
                </span>
              ) : null}
              between seconds.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base md:text-lg text-fg-muted leading-relaxed">
            {hero.subtext}
          </p>

          {/* High-Contrast CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#albums"
              className="press inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-[15px] font-medium text-accent-fg hover:bg-accent-hover shadow-tinted"
            >
              {CTA_LABELS.primary}
              <ArrowDown size={17} weight="bold" />
            </Link>
            <Link
              href="#contact"
              className="press inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface/90 backdrop-blur-sm px-8 py-3.5 text-[15px] font-medium text-fg hover:border-fg-subtle shadow-tinted"
            >
              {CTA_LABELS.secondary}
              <ArrowUpRight size={17} weight="bold" />
            </Link>
          </div>
        </div>

        {/* Cinematic Preview Banner */}
        <div className="mt-16 mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[16px] border border-hairline bg-surface p-2 shadow-tinted-lg">
            <SmartImage
              image={heroImage}
              alt="Hero showcase frame"
              fallbackSeed={hero.fallbackSeed}
              fallbackWidth={1920}
              fallbackHeight={1080}
              priority
              sizes="(max-width: 1024px) 95vw, 1100px"
              ratioClassName="aspect-[21/9] sm:aspect-[2.4/1] rounded-[10px]"
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between pointer-events-none text-xs font-mono text-white/90 drop-shadow-md px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md">
              <span>{heroImage ? heroImage.source.name : "35mm Archive"}</span>
              <span>{heroImage ? `${heroImage.width} x ${heroImage.height} px` : "Master Frame"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
