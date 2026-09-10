"use client";

import { useRef, useEffect } from "react";
import { curatorStatement } from "@/content/portfolio";
import { getAllImages } from "@/lib/manifest";
import { SmartImage } from "@/components/SmartImage";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CuratorSection() {
  const images = getAllImages();
  const pinnedRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinnedRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top+=80",
        end: "bottom bottom",
        pin: pinnedRef.current,
        pinSpacing: false,
      });
    });

    return () => ctx.revert();
  }, []);

  const showcaseFrames = images.slice(18, 24);

  return (
    <section id="curator" ref={containerRef} className="py-32 md:py-48 hairline-t bg-bg relative">
      <div className="max-shell px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Pinned Curator Column (GSAP Split Pin) */}
          <div ref={pinnedRef} className="md:col-span-5 flex flex-col gap-6">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              Artistic Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-fg leading-[1.1]">
              {curatorStatement.headline}
            </h2>
            <div className="space-y-4 text-fg-muted text-base leading-relaxed">
              {curatorStatement.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Archive Metrics */}
            <dl className="mt-6 grid grid-cols-3 gap-4 hairline-t pt-6">
              {curatorStatement.stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <dt className="order-2 font-mono text-[11px] text-fg-subtle leading-tight">
                    {s.label}
                  </dt>
                  <dd className="order-1 font-mono text-2xl font-medium text-fg">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right Scrolling Visual Plates */}
          <div className="md:col-span-7 flex flex-col gap-8">
            {showcaseFrames.map((frame, i) => (
              <div
                key={frame.id}
                className="group overflow-hidden rounded-[14px] border border-hairline bg-surface p-3 shadow-tinted hover:border-accent transition-colors duration-500"
              >
                <div className="overflow-hidden rounded-[10px]">
                  <SmartImage
                    image={frame}
                    alt={frame.source.name}
                    fallbackSeed={`curator-plate-${i}`}
                    fallbackWidth={1200}
                    fallbackHeight={800}
                    sizes="(max-width: 1024px) 90vw, 55vw"
                    ratioClassName="aspect-[3/2]"
                    className="transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between px-2 pb-1 font-mono text-xs text-fg-subtle">
                  <span>{frame.source.name}</span>
                  <span>Plate Ref {i + 19}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
