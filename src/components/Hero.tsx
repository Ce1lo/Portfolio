"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  Play,
  Pause,
  Sparkle,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { hero, CTA_LABELS, profile } from "@/content/portfolio";
import { getAllImages } from "@/lib/manifest";
import { SmartImage } from "@/components/SmartImage";
import { cx } from "@/lib/cx";

export function Hero() {
  const images = getAllImages();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = images.length > 0 ? images.length : 1;
  const currentImage = images[currentIdx] ?? null;

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + total) % total);
  };

  // Keyboard navigation: Left / Right arrows to cycle frames
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") setCurrentIdx((prev) => (prev + 1) % total);
      if (e.key === "ArrowLeft") setCurrentIdx((prev) => (prev - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  // Auto-play interval (pauses when user hovers the showcase screen)
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, total]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="top"
      className="relative min-h-[92dvh] flex flex-col justify-between pt-12 md:pt-16 pb-16 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-accent/10 blur-[130px]"
      />

      <div className="max-shell relative z-10 mx-auto w-full px-4 sm:px-6 md:px-8">
        {/* Retro System Status Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 border-2 border-hairline-strong bg-surface px-4 py-1.5 font-arcade text-xs text-fg shadow-pixel-sm">
            <span className="size-2 bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span>{profile.availability}</span>
          </div>
        </div>

        {/* Headline Header */}
        <div className="mx-auto max-w-5xl text-center">
          <span className="font-arcade text-[11px] tracking-wider text-accent uppercase block mb-3">
            {hero.eyebrow}
          </span>

          <h1 className="text-balance font-display text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold tracking-tight text-fg leading-[1.05]">
            <span className="block">{hero.headline[0]}</span>
            <span className="block text-accent">{hero.headline[1]}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-mono text-sm sm:text-base text-fg-muted leading-relaxed">
            {hero.subtext}
          </p>

          {/* Retro Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#gallery"
              className="pixel-press inline-flex items-center gap-2 border-2 border-fg bg-accent px-7 py-3 font-arcade text-xs sm:text-sm text-accent-fg shadow-pixel hover:bg-accent-hover"
            >
              <span>{CTA_LABELS.primary}</span>
              <ArrowDown size={15} weight="bold" />
            </Link>

            <Link
              href="#contact"
              className="pixel-press inline-flex items-center gap-2 border-2 border-fg bg-surface px-7 py-3 font-arcade text-xs sm:text-sm text-fg shadow-pixel hover:border-accent"
            >
              <span>{CTA_LABELS.secondary}</span>
              <ArrowUpRight size={15} weight="bold" />
            </Link>
          </div>
        </div>

        {/* ======================================================================
            INTERACTIVE RETRO PIXEL SHOWCASE SCREEN (75% WIDTH SCALE)
            ====================================================================== */}
        <div
          className="mt-10 mx-auto w-full md:w-[85%] lg:w-[80%]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="border-2 border-hairline-strong bg-surface p-2 sm:p-3 shadow-pixel-lg">
            {/* Top Arcade Screen Header Bar */}
            <div className="flex items-center justify-between border-b-2 border-hairline-strong pb-2.5 mb-2 px-1 font-arcade text-[11px] sm:text-xs">
              <div className="flex items-center gap-2 text-fg truncate">
                <Sparkle size={14} weight="fill" className="text-accent shrink-0" />
                <span className="text-accent">ORYWT.ROM</span>
                <span className="text-fg-subtle hidden sm:inline">{"//"}</span>
                <span className="text-fg-subtle truncate hidden sm:inline">
                  {currentImage?.albumName || "ARCHIVE"}
                </span>
              </div>

              {/* Controls: Prev / Next / Auto */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-arcade text-xs text-accent mr-1">
                  [FRAME #{String(currentIdx + 1).padStart(2, "0")}]
                </span>

                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? "Pause auto-slide" : "Resume auto-slide"}
                  className="pixel-press border border-hairline-strong bg-bg-sunken px-2 py-1 text-fg hover:border-accent flex items-center gap-1"
                  title={isPlaying ? "Pause auto-slide" : "Resume auto-slide"}
                >
                  {isPlaying ? (
                    <>
                      <Pause size={12} weight="fill" className="text-accent" />
                      <span className="hidden md:inline">PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Play size={12} weight="fill" className="text-emerald-500" />
                      <span className="hidden md:inline">PLAY</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous frame"
                  className="pixel-press border border-hairline-strong bg-bg-sunken px-2 py-1 text-fg hover:border-accent"
                >
                  <CaretLeft size={14} weight="bold" />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next frame"
                  className="pixel-press border border-hairline-strong bg-bg-sunken px-2 py-1 text-fg hover:border-accent"
                >
                  <CaretRight size={14} weight="bold" />
                </button>
              </div>
            </div>

            {/* Main CRT Viewport Display with smooth crossfade */}
            <div className="relative overflow-hidden border border-hairline bg-black/80 aspect-[16/10]">
              {/* Corner crosshairs for retro HUD feel */}
              <div className="absolute top-2 left-2 z-20 font-arcade text-xs text-white/50 pointer-events-none select-none">
                +
              </div>
              <div className="absolute top-2 right-2 z-20 font-arcade text-xs text-white/50 pointer-events-none select-none">
                +
              </div>
              <div className="absolute bottom-2 left-2 z-20 font-arcade text-xs text-white/50 pointer-events-none select-none">
                +
              </div>
              <div className="absolute bottom-2 right-2 z-20 font-arcade text-xs text-white/50 pointer-events-none select-none">
                +
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage?.id || currentIdx}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="size-full"
                >
                  <SmartImage
                    image={currentImage}
                    alt={currentImage?.customTitle || "Showcase frame"}
                    fallbackSeed={hero.fallbackSeed}
                    fallbackWidth={1920}
                    fallbackHeight={1080}
                    priority
                    sizes="(max-width: 1024px) 95vw, 1100px"
                    ratioClassName="size-full"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Bottom HUD readout */}
              <div className="absolute inset-x-3 bottom-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="flex items-center gap-2 rounded bg-black/75 backdrop-blur-md px-3 py-1.5 font-mono text-xs text-white/95 border border-white/10 shadow-pixel-sm">
                  <span className="font-arcade text-accent font-bold">
                    {currentImage?.indexTag || `#${String(currentIdx + 1).padStart(2, "0")}`}
                  </span>
                  <span className="text-white/40">{"//"}</span>
                  <span className="truncate max-w-[200px] sm:max-w-[320px] font-medium">
                    {currentImage?.customTitle || currentImage?.source.name || "Master Frame"}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-3 rounded bg-black/75 backdrop-blur-md px-3 py-1.5 font-mono text-[11px] text-white/80 border border-white/10">
                  <span>DIR: /{currentImage?.albumSlug || "archive"}</span>
                  <span className="text-white/40">•</span>
                  <span>{currentImage ? `${currentImage.width}x${currentImage.height}` : "1920x1280"}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-accent uppercase">WEBP</span>
                </div>
              </div>
            </div>

            {/* Interactive Thumbnail Filmstrip (Chọn nhanh ảnh) */}
            <div className="mt-3 pt-2.5 border-t border-hairline flex items-center justify-between gap-3">
              <span className="font-arcade text-[10px] text-fg-subtle uppercase shrink-0 hidden sm:inline">
                [QUICK_SELECT]:
              </span>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                {images.slice(0, 12).map((img, i) => {
                  const isSelected = i === currentIdx;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setCurrentIdx(i)}
                      aria-label={`Jump to frame ${i + 1}`}
                      className={cx(
                        "relative size-11 sm:size-12 shrink-0 border overflow-hidden transition-all",
                        isSelected
                          ? "border-2 border-accent shadow-pixel-sm scale-105 z-10"
                          : "border-hairline-strong opacity-60 hover:opacity-100"
                      )}
                    >
                      <SmartImage
                        image={img}
                        alt={`Thumb ${i + 1}`}
                        fallbackSeed={img.slug}
                        fallbackWidth={100}
                        fallbackHeight={100}
                        ratioClassName="size-full"
                        className="object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 border border-accent pointer-events-none" />
                      )}
                    </button>
                  );
                })}

                {total > 12 && (
                  <Link
                    href="#gallery"
                    className="border border-hairline-strong bg-bg-sunken px-3 h-11 sm:h-12 flex items-center justify-center font-arcade text-[10px] text-fg-subtle hover:text-accent hover:border-accent shrink-0"
                  >
                    [ALL]
                  </Link>
                )}
              </div>

              {/* Keyboard hint */}
              <div className="hidden lg:flex items-center gap-1 font-mono text-[10px] text-fg-subtle shrink-0">
                <kbd className="border border-hairline-strong px-1 bg-bg-sunken rounded">←</kbd>
                <kbd className="border border-hairline-strong px-1 bg-bg-sunken rounded">→</kbd>
                <span>cycle frames</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
