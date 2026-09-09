"use client";

import { useCallback, useEffect, useState } from "react";
import { X, CaretLeft, CaretRight, Images } from "@phosphor-icons/react";
import { getAllImages, formatBytes, type PortfolioImage } from "@/lib/manifest";
import { SectionHeading } from "@/components/SectionHeading";
import { SmartImage } from "@/components/SmartImage";
import { Reveal } from "@/components/Reveal";
import { Z } from "@/lib/z";

const PLACEHOLDER_ITEMS = [
  { seed: "terminal-code-editor-dark", w: 1200, h: 800, caption: "Architecture diagram" },
  { seed: "server-rack-datacenter-lights", w: 800, h: 1000, caption: "Infrastructure rack" },
  { seed: "k6-grafana-metrics-dashboard", w: 1200, h: 675, caption: "Load testing run" },
  { seed: "postgresql-query-explain-plan", w: 900, h: 900, caption: "Query execution plan" },
  { seed: "clean-mechanical-keyboard-desk", w: 1200, h: 800, caption: "Workstation setup" },
  { seed: "docker-container-terminal-logs", w: 800, h: 1100, caption: "Deployment logs" },
];

/**
 * Gallery section with integrated full-screen lightbox.
 *
 * Layout family: responsive CSS columns (masonry rhythm without JavaScript math).
 * When Drive has not been synced yet, renders seeded photography placeholders
 * accompanied by a clear setup instruction box, so the page is never blank.
 */
export function Gallery() {
  const images = getAllImages();
  const hasSynced = images.length > 0;

  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const close = useCallback(() => setActiveIdx(null), []);

  const next = useCallback(() => {
    setActiveIdx((prev) => {
      if (prev === null) return null;
      return (prev + 1) % (hasSynced ? images.length : PLACEHOLDER_ITEMS.length);
    });
  }, [hasSynced, images.length]);

  const prev = useCallback(() => {
    setActiveIdx((curr) => {
      if (curr === null) return null;
      const count = hasSynced ? images.length : PLACEHOLDER_ITEMS.length;
      return (curr - 1 + count) % count;
    });
  }, [hasSynced, images.length]);

  useEffect(() => {
    if (activeIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIdx, close, next, prev]);

  return (
    <section id="gallery" className="hairline-t bg-bg-sunken py-24 md:py-32">
      <div className="max-shell px-5 md:px-8">
        <SectionHeading
          headline="Artifacts and traces."
          body={
            <p>
              Screenshots, benchmark captures, and workspace logs synced directly
              from Google Drive at build time.
            </p>
          }
        />

        {!hasSynced && (
          <Reveal from="up" delay={0.08} className="mt-8">
            <div className="flex items-start gap-3 rounded-[12px] border border-hairline bg-surface p-5 text-sm text-fg-muted">
              <Images size={20} className="shrink-0 text-accent" />
              <div>
                <span className="font-medium text-fg">Drive sync pending: </span>
                Showing seeded preview photography. Drop screenshots into your Drive folder,
                run <code className="rounded bg-bg-sunken px-1.5 py-0.5 font-mono text-xs">npm run sync</code>,
                and real assets will populate this grid.
              </div>
            </div>
          </Reveal>
        )}

        <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {hasSynced
            ? images.map((img, idx) => (
                <Reveal
                  key={img.id}
                  from="up"
                  delay={(idx % 3) * 0.06}
                  className="mb-6 break-inside-avoid"
                >
                  <figure
                    onClick={() => setActiveIdx(idx)}
                    className="group press cursor-pointer overflow-hidden rounded-[12px] border border-hairline bg-surface p-2 shadow-tinted hover:border-hairline-strong"
                  >
                    <SmartImage
                      image={img}
                      alt={img.source.name}
                      fallbackSeed={img.slug}
                      fallbackWidth={img.width}
                      fallbackHeight={img.height}
                      sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 30vw"
                      ratioClassName="rounded-[8px]"
                    />
                    <figcaption className="mt-2.5 flex items-center justify-between px-1.5 pb-1 font-mono text-[11.5px] text-fg-subtle">
                      <span className="truncate max-w-[180px]">{img.source.name}</span>
                      <span>{formatBytes(img.bytes.webp)}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))
            : PLACEHOLDER_ITEMS.map((item, idx) => (
                <Reveal
                  key={item.seed}
                  from="up"
                  delay={(idx % 3) * 0.06}
                  className="mb-6 break-inside-avoid"
                >
                  <figure
                    onClick={() => setActiveIdx(idx)}
                    className="group press cursor-pointer overflow-hidden rounded-[12px] border border-hairline bg-surface p-2 shadow-tinted hover:border-hairline-strong"
                  >
                    <SmartImage
                      image={null}
                      alt={item.caption}
                      fallbackSeed={item.seed}
                      fallbackWidth={item.w}
                      fallbackHeight={item.h}
                      sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 30vw"
                      ratioClassName="rounded-[8px]"
                    />
                    <figcaption className="mt-2.5 flex items-center justify-between px-1.5 pb-1 font-mono text-[11.5px] text-fg-subtle">
                      <span>{item.caption}</span>
                      <span className="italic">preview</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
        </div>
      </div>

      {/* Lightbox */}
      {activeIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className={`fixed inset-0 flex items-center justify-center bg-bg/90 backdrop-blur-md p-4 md:p-8 ${Z.lightbox}`}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="press absolute top-5 right-5 z-20 grid size-10 place-items-center rounded-full border border-hairline bg-surface text-fg hover:border-fg-subtle"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="press absolute left-4 z-20 grid size-10 place-items-center rounded-full border border-hairline bg-surface text-fg hover:border-fg-subtle md:left-8"
          >
            <CaretLeft size={20} />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="press absolute right-4 z-20 grid size-10 place-items-center rounded-full border border-hairline bg-surface text-fg hover:border-fg-subtle md:right-8"
          >
            <CaretRight size={20} />
          </button>

          <div className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-[12px] border border-hairline bg-surface p-2 shadow-tinted-lg">
            {hasSynced ? (
              <SmartImage
                image={images[activeIdx]}
                alt={images[activeIdx].source.name}
                fallbackSeed={images[activeIdx].slug}
                fallbackWidth={images[activeIdx].width}
                fallbackHeight={images[activeIdx].height}
                priority
                className="max-h-[75vh] w-auto rounded-[8px] object-contain"
              />
            ) : (
              <SmartImage
                image={null}
                alt={PLACEHOLDER_ITEMS[activeIdx].caption}
                fallbackSeed={PLACEHOLDER_ITEMS[activeIdx].seed}
                fallbackWidth={PLACEHOLDER_ITEMS[activeIdx].w}
                fallbackHeight={PLACEHOLDER_ITEMS[activeIdx].h}
                priority
                className="max-h-[75vh] w-auto rounded-[8px] object-contain"
              />
            )}
            <div className="mt-3 flex items-center justify-between px-2 pb-1 font-mono text-xs text-fg-subtle">
              <span>
                {hasSynced
                  ? images[activeIdx].source.name
                  : PLACEHOLDER_ITEMS[activeIdx].caption}
              </span>
              <span>
                {activeIdx + 1} / {hasSynced ? images.length : PLACEHOLDER_ITEMS.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
