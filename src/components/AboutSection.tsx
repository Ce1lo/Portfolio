"use client";

import { aboutStatement, profile } from "@/content/portfolio";
import { getAllImages } from "@/lib/manifest";
import { SmartImage } from "@/components/SmartImage";
import { Terminal, MapPin, Sparkle } from "@phosphor-icons/react";

export function AboutSection() {
  const images = getAllImages();
  const signatureFrame = images[0] ?? null;

  return (
    <section id="about" className="py-24 md:py-36 hairline-t bg-bg relative">
      <div className="max-shell px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Retro Terminal Statement */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-2 font-arcade text-xs text-accent uppercase tracking-wider">
              <Terminal size={15} weight="bold" />
              <span>{aboutStatement.eyebrow}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-sans font-medium tracking-tight text-fg leading-[1.1]">
              {aboutStatement.headline}
            </h2>

            <div className="space-y-4 font-mono text-sm sm:text-base text-fg-muted leading-relaxed">
              {aboutStatement.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Grounded specs card */}
            <div className="mt-4 border-2 border-hairline-strong bg-surface p-4 shadow-pixel">
              <div className="flex items-center gap-2 font-arcade text-xs text-fg pb-3 border-b border-hairline mb-4">
                <Sparkle size={13} weight="fill" className="text-accent" />
                <span>[DATA_SPEC // METRICS]</span>
              </div>

              <dl className="grid grid-cols-3 gap-4 text-center">
                {aboutStatement.stats.map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <dd className="font-mono text-2xl sm:text-3xl font-bold text-accent">
                      {s.value}
                    </dd>
                    <dt className="font-mono text-[11px] sm:text-xs text-fg-subtle leading-tight">
                      {s.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Right Column: Signature Plate inside Retro CRT Frame */}
          <div className="lg:col-span-5">
            <div className="border-2 border-hairline-strong bg-surface p-3 shadow-pixel-lg">
              <div className="flex items-center justify-between border-b border-hairline pb-2 mb-2 font-arcade text-[11px] text-fg-subtle">
                <span className="text-accent">SIGNATURE_FRAME</span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} weight="bold" />
                  {profile.location}
                </span>
              </div>

              <div className="overflow-hidden border border-hairline aspect-[4/3] bg-black/20">
                <SmartImage
                  image={signatureFrame}
                  alt={signatureFrame?.customTitle || profile.name}
                  fallbackSeed="saigon-street-portrait"
                  fallbackWidth={1200}
                  fallbackHeight={900}
                  sizes="(max-width: 1024px) 90vw, 450px"
                  ratioClassName="size-full"
                  className="object-cover"
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between font-mono text-xs text-fg-subtle px-1">
                <span className="font-medium text-fg">{profile.name}</span>
                <span className="text-accent">/{profile.shortName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
