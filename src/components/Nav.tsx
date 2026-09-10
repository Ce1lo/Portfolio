"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { List, X, ArrowUpRight } from "@phosphor-icons/react";
import { nav, profile, CTA_LABELS } from "@/content/portfolio";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cx } from "@/lib/cx";
import { Z } from "@/lib/z";

const SECTION_IDS = nav.map((item) => item.id);

export function Nav() {
  const [active, setActive] = useState<string>(SECTION_IDS[0]);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActive(id);
          }
        },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => {
      for (const observer of observers) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const go = useCallback((id: string) => {
    setOpen(false);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: "start" });
  }, []);

  return (
    <>
      <header
        className={cx(
          "sticky top-0 w-full border-b-2 border-hairline-strong bg-bg/95 backdrop-blur-md",
          Z.nav,
        )}
      >
        <div className="max-shell flex h-[64px] items-center justify-between px-4 sm:px-6 md:px-8">
          {/* Retro Pixel Logo */}
          <button
            type="button"
            onClick={() => go("top")}
            aria-label="Back to top"
            className="pixel-press shrink-0 font-arcade text-sm sm:text-base font-bold tracking-wider text-fg flex items-center gap-1"
          >
            <span>{profile.shortName.toUpperCase()}</span>
            <span className="text-accent">.ROM</span>
            <span className="inline-block w-2 h-3.5 bg-accent animate-pulse ml-0.5" />
          </button>

          {/* Desktop Navigation */}
          <nav aria-label="Sections" className="hidden items-center gap-2 md:flex">
            {nav.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cx(
                    "pixel-press relative px-3.5 py-1.5 font-arcade text-xs uppercase transition-all",
                    isActive
                      ? "border-2 border-fg bg-accent text-accent-fg font-bold shadow-pixel-sm"
                      : "border-2 border-transparent text-fg-muted hover:border-hairline-strong hover:text-fg"
                  )}
                >
                  <span>[{item.label}]</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => go("contact")}
              className="pixel-press hidden items-center gap-1.5 border-2 border-fg bg-accent px-4 py-1.5 font-arcade text-xs uppercase text-accent-fg shadow-pixel-sm hover:bg-accent-hover sm:inline-flex"
            >
              <span>{CTA_LABELS.secondary}</span>
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="pixel-press grid size-9 place-items-center border-2 border-hairline-strong bg-surface text-fg-muted hover:text-fg md:hidden"
            >
              <List size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Retro Progress Line */}
        <motion.div
          style={{ scaleX: progress }}
          className="h-[2px] w-full origin-left bg-accent"
          aria-hidden="true"
        />
      </header>

      {/* Mobile Drawer */}
      {open ? (
        <div
          className={cx("fixed inset-0 md:hidden", Z.mobileMenu)}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-0 border-b-2 border-hairline-strong bg-surface px-5 pt-5 pb-7 shadow-pixel-lg"
          >
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <span className="font-arcade text-sm font-bold tracking-wider text-fg">
                {profile.shortName.toUpperCase()}
                <span className="text-accent">.ROM</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="pixel-press grid size-8 place-items-center border border-hairline-strong text-fg-muted hover:text-fg"
              >
                <X size={18} weight="bold" aria-hidden="true" />
              </button>
            </div>

            <ul className="mt-4 flex flex-col gap-2">
              {nav.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduce ? 0 : index * 0.04, duration: 0.2 }}
                >
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    className="flex w-full items-center justify-between py-2.5 px-3 border border-hairline-strong bg-bg-sunken text-left font-arcade text-sm font-bold text-fg hover:border-accent hover:text-accent"
                  >
                    <span>[{item.label}]</span>
                    <ArrowUpRight size={16} weight="bold" className="text-fg-subtle" aria-hidden="true" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      ) : null}
    </>
  );
}
