"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { getAllImages, getAlbums, formatBytes, type PortfolioImage } from "@/lib/manifest";
import { SmartImage } from "@/components/SmartImage";
import { X, CaretLeft, CaretRight, SlidersHorizontal, FolderSimple } from "@phosphor-icons/react";
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

  const close = useCallback(() => setActiveIdx(null), []);
  const next = useCallback(() => {
    setActiveIdx((prev) => (prev === null ? null : (prev + 1) % filteredImages.length));
  }, [filteredImages.length]);
  const prev = useCallback(() => {
    setActiveIdx((curr) => (curr === null ? null : (curr - 1 + filteredImages.length) % filteredImages.length));
  }, [filteredImages.length]);

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
    <section id="archive" className="py-32 md:py-48 hairline-t bg-bg-sunken">
      <div className="max-shell px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              Permanent Archive
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-medium tracking-tight text-fg">
              The Complete Gallery
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-fg-subtle">
              {filteredImages.length} tác phẩm
            </span>
            <Link
              href="/studio"
              className="press inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-4 py-1.5 text-xs font-mono text-fg hover:border-accent shadow-tinted"
            >
              <SlidersHorizontal size={14} className="text-accent" />
              <span>Studio Sắp xếp</span>
            </Link>
          </div>
        </div>

        {/* Album Folder Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          <button
            type="button"
            onClick={() => {
              setSelectedAlbum("all");
              setActiveIdx(null);
            }}
            className={cx(
              "press rounded-full px-4 py-1.5 font-mono text-xs transition-colors",
              selectedAlbum === "all"
                ? "bg-accent text-accent-fg font-medium"
                : "border border-hairline bg-surface text-fg-muted hover:border-hairline-strong hover:text-fg"
            )}
          >
            Tất cả ({images.length})
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
                  "press inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-mono text-xs transition-colors",
                  active
                    ? "bg-accent text-accent-fg font-medium"
                    : "border border-hairline bg-surface text-fg-muted hover:border-hairline-strong hover:text-fg"
                )}
              >
                <FolderSimple size={14} />
                <span>{album.name}</span>
                <span className="opacity-75">({album.count})</span>
              </button>
            );
          })}
        </div>

        {/* Masonry Grid with auto STT & Album label */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-20 font-mono text-sm text-fg-subtle">
            Chưa có ảnh nào trong album này.
          </div>
        ) : (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
            {filteredImages.map((img, idx) => {
              const displayTitle = img.customTitle || `${img.albumName || "Highlights"} #${String(idx + 1).padStart(2, "0")}`;

              return (
                <figure
                  key={img.id}
                  onClick={() => setActiveIdx(idx)}
                  className="group press mb-6 break-inside-avoid cursor-pointer overflow-hidden rounded-[12px] border border-hairline bg-surface p-2 shadow-tinted hover:border-accent transition-all duration-300"
                >
                  <div className="overflow-hidden rounded-[8px]">
                    <SmartImage
                      image={img}
                      alt={displayTitle}
                      fallbackSeed={img.slug}
                      fallbackWidth={img.width}
                      fallbackHeight={img.height}
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                      className="transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="mt-2.5 flex items-center justify-between px-1.5 pb-1 font-mono text-[11px] text-fg-subtle">
                    <div className="flex items-center gap-1.5 truncate max-w-[190px]">
                      <span className="font-bold text-accent">{img.indexTag || `#${String(idx + 1).padStart(2, "0")}`}</span>
                      <span className="truncate font-medium text-fg">{displayTitle}</span>
                    </div>
                    <span>{formatBytes(img.bytes.webp)}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Inspector */}
      {activeIdx !== null && filteredImages[activeIdx] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className={`fixed inset-0 flex items-center justify-center bg-bg/95 backdrop-blur-md p-4 md:p-8 ${Z.lightbox}`}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="press absolute top-5 right-5 z-20 grid size-11 place-items-center rounded-full border border-hairline bg-surface text-fg hover:border-fg-subtle shadow-tinted"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={prev}
            aria-label="Previous plate"
            className="press absolute left-4 z-20 grid size-11 place-items-center rounded-full border border-hairline bg-surface text-fg hover:border-fg-subtle md:left-8 shadow-tinted"
          >
            <CaretLeft size={20} />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next plate"
            className="press absolute right-4 z-20 grid size-11 place-items-center rounded-full border border-hairline bg-surface text-fg hover:border-fg-subtle md:right-8 shadow-tinted"
          >
            <CaretRight size={20} />
          </button>

          <div className="relative max-h-[90vh] max-w-[92vw] overflow-hidden rounded-[14px] border border-hairline bg-surface p-2 shadow-tinted-lg flex flex-col">
            <div className="overflow-hidden rounded-[10px] flex items-center justify-center bg-black/40">
              <SmartImage
                image={filteredImages[activeIdx]}
                alt={filteredImages[activeIdx].customTitle || filteredImages[activeIdx].source.name}
                fallbackSeed={filteredImages[activeIdx].slug}
                fallbackWidth={filteredImages[activeIdx].width}
                fallbackHeight={filteredImages[activeIdx].height}
                priority
                className="max-h-[78vh] w-auto object-contain"
              />
            </div>
            <div className="mt-3 flex items-center justify-between px-3 pb-1 font-mono text-xs text-fg-subtle">
              <div className="flex items-center gap-3">
                <span className="font-bold text-accent">{filteredImages[activeIdx].indexTag || `#${activeIdx + 1}`}</span>
                <span className="font-medium text-fg">
                  {filteredImages[activeIdx].customTitle || filteredImages[activeIdx].source.name}
                </span>
                <span>Thư mục: {filteredImages[activeIdx].albumName || "Highlights"}</span>
                <span>{filteredImages[activeIdx].width}x{filteredImages[activeIdx].height}</span>
              </div>
              <span>
                {activeIdx + 1} / {filteredImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
