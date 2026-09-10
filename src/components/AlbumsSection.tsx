"use client";

import { useState } from "react";
import { albums } from "@/content/portfolio";
import { getAllImages } from "@/lib/manifest";
import { SmartImage } from "@/components/SmartImage";
import { MapPin, ArrowRight } from "@phosphor-icons/react";
import { cx } from "@/lib/cx";

export function AlbumsSection() {
  const [activeAlbumId, setActiveAlbumId] = useState(albums[0].id);
  const allImages = getAllImages();

  const currentAlbum = albums.find((a) => a.id === activeAlbumId) ?? albums[0];
  const albumImages = currentAlbum.imageIndices
    .map((idx) => allImages[idx])
    .filter(Boolean);

  return (
    <section id="albums" className="py-32 md:py-48 hairline-t bg-bg">
      <div className="max-shell px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              Curated Monographs
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-medium tracking-tight text-fg">
              Thematic Chapters
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-fg-muted leading-relaxed">
            Photographs sequenced into three distinct narrative investigations of
            space, texture, and light falloff.
          </p>
        </div>

        {/* Album Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {albums.map((album) => {
            const isSelected = album.id === activeAlbumId;
            const coverImage = allImages[album.imageIndices[0]] ?? null;

            return (
              <button
                key={album.id}
                type="button"
                onClick={() => setActiveAlbumId(album.id)}
                className={cx(
                  "group text-left p-6 rounded-[14px] border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[190px]",
                  isSelected
                    ? "border-accent bg-surface shadow-tinted-lg"
                    : "border-hairline bg-surface/50 hover:border-hairline-strong hover:bg-surface"
                )}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs text-fg-subtle mb-3">
                    <span>{album.year}</span>
                    <span className="text-accent">#{album.focalTag}</span>
                  </div>
                  <h3 className="text-xl font-medium text-fg tracking-tight group-hover:text-accent transition-colors">
                    {album.title}
                  </h3>
                  <p className="mt-1 text-xs text-fg-muted font-normal">{album.subtitle}</p>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs font-mono text-fg-subtle hairline-t pt-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-accent" />
                    {album.location}
                  </span>
                  <span className="font-medium text-fg">{album.imageIndices.length} plates</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Album Feature Grid: Gapless Bento Layout */}
        <div className="rounded-[16px] border border-hairline bg-surface p-6 md:p-8 shadow-tinted">
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hairline-b pb-6">
            <div>
              <span className="font-mono text-xs uppercase text-accent tracking-wider">
                Exhibition Chapter
              </span>
              <h4 className="text-2xl font-medium text-fg mt-1">{currentAlbum.title}</h4>
            </div>
            <p className="max-w-xl text-sm text-fg-muted leading-relaxed">
              {currentAlbum.curatorNote}
            </p>
          </div>

          {/* Gapless Grid-Flow-Dense Bento with exact span interlocking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-flow-dense gap-4">
            {/* Lead Large Frame: col-span-2 row-span-2 */}
            {albumImages[0] ? (
              <div className="col-span-1 sm:col-span-2 row-span-2 group relative overflow-hidden rounded-[10px] border border-hairline bg-bg-sunken">
                <SmartImage
                  image={albumImages[0]}
                  alt={albumImages[0].source.name}
                  fallbackSeed="curated-frame-lead"
                  fallbackWidth={1200}
                  fallbackHeight={800}
                  sizes="(max-width: 1024px) 90vw, 60vw"
                  ratioClassName="aspect-[4/3] sm:aspect-[16/11]"
                  className="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full bg-black/60 px-3 py-1 text-[11px] font-mono text-white/90 backdrop-blur-md">
                  <span className="truncate max-w-[200px]">{albumImages[0].source.name}</span>
                  <span>Plate 01</span>
                </div>
              </div>
            ) : null}

            {/* Standard Frames filling the remaining 2 rows */}
            {albumImages.slice(1, 5).map((img, i) => (
              <div
                key={img.id}
                className="col-span-1 row-span-1 group relative overflow-hidden rounded-[10px] border border-hairline bg-bg-sunken"
              >
                <SmartImage
                  image={img}
                  alt={img.source.name}
                  fallbackSeed={`curated-frame-${i}`}
                  fallbackWidth={800}
                  fallbackHeight={600}
                  sizes="(max-width: 1024px) 45vw, 30vw"
                  ratioClassName="aspect-[4/3]"
                  className="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between rounded-full bg-black/50 px-2.5 py-0.5 text-[10.5px] font-mono text-white/80 backdrop-blur-sm">
                  <span className="truncate max-w-[140px]">{img.source.name}</span>
                  <span>Plate 0{i + 2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
