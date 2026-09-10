"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllImages, getAlbums } from "@/lib/manifest";
import { SmartImage } from "@/components/SmartImage";
import { X, CaretLeft, CaretRight, SlidersHorizontal, FolderSimple, Disc } from "@phosphor-icons/react";
import { Z } from "@/lib/z";
import { cx } from "@/lib/cx";
import Link from "next/link";

export function ArchiveGallery() {
  const images = getAllImages();
  const albums = getAlbums();

  const [selectedAlbum, setSelectedAlbum] = useState<string>("all");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const filteredImages = useMemo(() => {
    if (selectedAlbum === "all") return images;
    return images.filter((img) => (img.albumSlug || "highlights") === selectedAlbum);
  }, [images, selectedAlbum]);

  const close = () => setActiveIdx(null);
  const next = () => {
    setActiveIdx((prev) => (prev === null ? null : (prev + 1) % filteredImages.length));
  };
  const prev = () => {
    setActiveIdx((curr) => (curr === null ? null : (curr - 1 + filteredImages.length) % filteredImages.length));
  };

  useEffect(() => {
    if (activeIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIdx(null);
      if (e.key === "ArrowRight") {
        setActiveIdx((prev) => (prev === null ? null : (prev + 1) % filteredImages.length));
      }
      if (e.key === "ArrowLeft") {
        setActiveIdx((curr) => (curr === null ? null : (curr - 1 + filteredImages.length) % filteredImages.length));
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIdx, filteredImages.length]);

  return (
    <section id="gallery" className="py-24 md:py-36 hairline-t bg-bg-sunken relative">
      {/* Anchor for backward compatibility with #archive links */}
      <span id="archive" className="sr-only" />

      <div className="max-shell px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="font-arcade text-xs text-accent uppercase tracking-wider block mb-2">
              [GALLERY.ROM // MASTER_ARCHIVE]
            </span>
            <h2 className="text-3xl sm:text-5xl font-sans font-medium tracking-tight text-fg">
              The Master Gallery
            </h2>
            <p className="mt-2 text-sm sm:text-base font-mono text-fg-muted max-w-xl">
              Photographic archive streamed live from Google Drive, cataloged by event series.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-arcade text-xs border border-hairline-strong bg-surface px-3 py-1 text-fg-subtle shadow-pixel-sm">
              [CATALOG]
            </span>

            <Link
              href="/studio"
              className="pixel-press inline-flex items-center gap-2 border-2 border-hairline-strong bg-surface px-4 py-1.5 font-arcade text-xs text-fg shadow-pixel hover:border-accent hover:text-accent"
            >
              <SlidersHorizontal size={14} className="text-accent" />
              <span>Studio Organize</span>
            </Link>
          </div>
        </div>

        {/* Album Folder Filter Pills (Retro Arcade Tabs) */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10">
          <button
            type="button"
            onClick={() => {
              setSelectedAlbum("all");
              setActiveIdx(null);
            }}
            className={cx(
              "pixel-press inline-flex items-center gap-1.5 border-2 px-4 py-2 font-arcade text-xs transition-all",
              selectedAlbum === "all"
                ? "border-fg bg-accent text-accent-fg font-bold shadow-pixel"
                : "border-hairline-strong bg-surface text-fg-muted hover:text-fg shadow-pixel-sm"
            )}
          >
            <Disc size={14} weight="fill" />
            <span>ALL FRAMES</span>
          </button>

          {albums.map((album) => {
            const active = selectedAlbum === album.slug;
            return (
              <button
                key={album.slug}
                type="button"
                onClick={() => {
                  setSelectedAlbum(album.slug);
                  setActiveIdx(null);
                }}
                className={cx(
                  "pixel-press inline-flex items-center gap-1.5 border-2 px-4 py-2 font-arcade text-xs transition-all",
                  active
                    ? "border-fg bg-accent text-accent-fg font-bold shadow-pixel"
                    : "border-hairline-strong bg-surface text-fg-muted hover:text-fg shadow-pixel-sm"
                )}
              >
                <FolderSimple size={14} weight="bold" />
                <span>{album.name.toUpperCase()}</span>
              </button>
            );
          })}
        </div>

        {/* Grid Photo Gallery with Uniform Left-Aligned Rows */}
        {filteredImages.length === 0 ? (
          <div className="border-2 border-dashed border-hairline-strong p-16 text-center font-mono text-sm text-fg-subtle bg-surface">
            No frames available in this collection.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-start">
            {filteredImages.map((img, idx) => {
              const displayTitle =
                img.customTitle || `${img.albumName || "Highlights"} #${String(idx + 1).padStart(2, "0")}`;

              return (
                <figure
                  key={img.id}
                  onClick={() => setActiveIdx(idx)}
                  className="group pixel-press cursor-pointer overflow-hidden border-2 border-hairline-strong bg-surface p-2 shadow-pixel hover:border-accent hover:shadow-pixel-accent transition-all flex flex-col justify-between"
                >
                  <div className="overflow-hidden border border-hairline bg-black/5 relative">
                    <SmartImage
                      image={img}
                      alt={displayTitle}
                      fallbackSeed={img.slug}
                      fallbackWidth={img.width}
                      fallbackHeight={img.height}
                      sizes="(max-width: 640px) 95vw, (max-width: 1024px) 45vw, 25vw"
                      ratioClassName="aspect-[3/2] w-full"
                      className="transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>

                  <figcaption className="mt-2.5 flex items-center gap-2 px-1 pb-0.5 font-mono text-xs text-fg-subtle">
                    <span className="font-arcade text-[11px] font-bold text-accent px-1.5 py-0.5 border border-hairline-strong bg-bg-sunken shrink-0">
                      {img.indexTag || `#${String(idx + 1).padStart(2, "0")}`}
                    </span>
                    <span className="truncate font-medium text-fg">{displayTitle}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </div>

      {/* Retro Arcade Lightbox Viewer */}
      {activeIdx !== null && filteredImages[activeIdx] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className={`fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8 ${Z.lightbox}`}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={close}
            aria-label="Close viewer"
            className="pixel-press absolute top-4 right-4 z-20 size-11 grid place-items-center border-2 border-white bg-black text-white hover:bg-accent hover:border-accent shadow-pixel-sm"
          >
            <X size={20} weight="bold" />
          </button>

          {/* Prev button */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous plate"
            className="pixel-press absolute left-3 md:left-6 z-20 size-11 grid place-items-center border-2 border-white bg-black text-white hover:bg-accent hover:border-accent shadow-pixel-sm"
          >
            <CaretLeft size={22} weight="bold" />
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={next}
            aria-label="Next plate"
            className="pixel-press absolute right-3 md:right-6 z-20 size-11 grid place-items-center border-2 border-white bg-black text-white hover:bg-accent hover:border-accent shadow-pixel-sm"
          >
            <CaretRight size={22} weight="bold" />
          </button>

          {/* Retro Monitor Frame */}
          <div className="relative max-h-[92vh] max-w-[94vw] border-2 border-white/40 bg-zinc-950 p-2 sm:p-3 shadow-pixel-lg flex flex-col">
            {/* Top header HUD */}
            <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-2 font-arcade text-xs text-white/80 px-1">
              <span className="text-accent">VIEWPORT.ROM</span>
              <span>
                [FRAME #{String(activeIdx + 1).padStart(2, "0")}]
              </span>
            </div>

            {/* Photo Viewport */}
            <div className="overflow-hidden border border-white/10 flex items-center justify-center bg-black relative max-h-[76vh]">
              <SmartImage
                image={filteredImages[activeIdx]}
                alt={filteredImages[activeIdx].customTitle || filteredImages[activeIdx].source.name}
                fallbackSeed={filteredImages[activeIdx].slug}
                fallbackWidth={filteredImages[activeIdx].width}
                fallbackHeight={filteredImages[activeIdx].height}
                priority
                className="max-h-[74vh] w-auto object-contain"
              />
            </div>

            {/* Bottom metadata HUD */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 px-2 pt-1 font-mono text-xs text-white/90 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="font-arcade text-accent font-bold px-1.5 py-0.5 bg-white/10 border border-white/20">
                  {filteredImages[activeIdx].indexTag || `#${activeIdx + 1}`}
                </span>
                <span className="font-medium truncate max-w-[260px] sm:max-w-[400px]">
                  {filteredImages[activeIdx].customTitle || filteredImages[activeIdx].source.name}
                </span>
              </div>

              <div className="flex items-center gap-3 text-white/60 text-[11px]">
                <span>DIR: /{filteredImages[activeIdx].albumSlug || "highlights"}</span>
                <span>•</span>
                <span>{filteredImages[activeIdx].width}x{filteredImages[activeIdx].height}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
