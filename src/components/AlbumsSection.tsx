"use client";

import { useState, useMemo } from "react";
import { getAlbums, getImagesByAlbum, getAllImages } from "@/lib/manifest";
import { SmartImage } from "@/components/SmartImage";
import { MapPin, FolderSimple, CaretRight } from "@phosphor-icons/react";
import { cx } from "@/lib/cx";

export function AlbumsSection() {
  const albums = getAlbums();
  const [activeSlug, setActiveSlug] = useState<string>(albums[0]?.slug ?? "highlights");

  const currentAlbum = albums.find((a) => a.slug === activeSlug) ?? albums[0];
  const albumImages = useMemo(() => {
    return getImagesByAlbum(activeSlug);
  }, [activeSlug]);

  return (
    <section id="albums" className="py-32 md:py-48 hairline-t bg-bg">
      <div className="max-shell px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              Drive Synced Collections
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-medium tracking-tight text-fg">
              Event Albums & Projects
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-fg-muted leading-relaxed">
            Mỗi thư mục sự kiện trên Google Drive được tự động nhận diện thành một Album độc lập,
            được đánh số thứ tự frame chuẩn mực.
          </p>
        </div>

        {/* Album Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-14">
          {albums.map((album) => {
            const isSelected = album.slug === activeSlug;
            const previewImage = getImagesByAlbum(album.slug)[0] ?? null;

            return (
              <button
                key={album.slug}
                type="button"
                onClick={() => setActiveSlug(album.slug)}
                className={cx(
                  "group text-left p-5 rounded-[14px] border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[170px]",
                  isSelected
                    ? "border-accent bg-surface shadow-tinted-lg"
                    : "border-hairline bg-surface/50 hover:border-hairline-strong hover:bg-surface"
                )}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs text-fg-subtle mb-3">
                    <span className="flex items-center gap-1.5 text-accent">
                      <FolderSimple size={15} />
                      Drive Folder
                    </span>
                    <span className="rounded bg-bg-sunken px-2 py-0.5 font-medium text-fg">
                      {album.count} frames
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-fg tracking-tight group-hover:text-accent transition-colors truncate">
                    {album.name}
                  </h3>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-mono text-fg-subtle hairline-t pt-3">
                  <span className="truncate max-w-[140px]">/{album.slug}</span>
                  <span className="flex items-center gap-1 text-accent">
                    Xem album <CaretRight size={12} weight="bold" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Album Bento Stage */}
        <div className="rounded-[16px] border border-hairline bg-surface p-6 md:p-8 shadow-tinted">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hairline-b pb-6">
            <div>
              <span className="font-mono text-xs uppercase text-accent tracking-wider">
                Album Hiện Tại
              </span>
              <h4 className="text-2xl font-medium text-fg mt-1">
                {currentAlbum?.name ?? "Highlights"}
              </h4>
            </div>
            <span className="font-mono text-xs text-fg-subtle">
              Hiển thị {albumImages.length} tác phẩm đã đánh số STT
            </span>
          </div>

          {/* Bento Grid layout with STT overlay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-flow-dense gap-4">
            {/* Lead Frame: col-span-2 row-span-2 */}
            {albumImages[0] ? (
              <div className="col-span-1 sm:col-span-2 row-span-2 group relative overflow-hidden rounded-[10px] border border-hairline bg-bg-sunken">
                <SmartImage
                  image={albumImages[0]}
                  alt={albumImages[0].customTitle || albumImages[0].source.name}
                  fallbackSeed="lead-plate"
                  fallbackWidth={1200}
                  fallbackHeight={800}
                  sizes="(max-width: 1024px) 90vw, 60vw"
                  ratioClassName="aspect-[4/3] sm:aspect-[16/11]"
                  className="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-mono text-white/90 backdrop-blur-md">
                  <span className="font-semibold text-accent">
                    {albumImages[0].indexTag || "#01"}
                  </span>
                  <span className="truncate max-w-[240px]">
                    {albumImages[0].customTitle || albumImages[0].source.name}
                  </span>
                  <span>{albumImages[0].width}x{albumImages[0].height}</span>
                </div>
              </div>
            ) : null}

            {/* Child Frames */}
            {albumImages.slice(1, 7).map((img, i) => (
              <div
                key={img.id}
                className="col-span-1 row-span-1 group relative overflow-hidden rounded-[10px] border border-hairline bg-bg-sunken"
              >
                <SmartImage
                  image={img}
                  alt={img.customTitle || img.source.name}
                  fallbackSeed={`plate-${i}`}
                  fallbackWidth={800}
                  fallbackHeight={600}
                  sizes="(max-width: 1024px) 45vw, 30vw"
                  ratioClassName="aspect-[4/3]"
                  className="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-mono text-white/85 backdrop-blur-sm">
                  <span className="font-semibold text-accent">{img.indexTag || `#0${i + 2}`}</span>
                  <span className="truncate max-w-[140px]">{img.source.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
