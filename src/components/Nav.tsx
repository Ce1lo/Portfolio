"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { List, X, ArrowUpRight } from "@phosphor-icons/react";
import { nav, profile, CTA_LABELS } from "@/content/portfolio";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cx } from "@/lib/cx";
import { Z } from "@/lib/z";

const SECTION_IDS = nav.map((item) => item.id);

/**
 * Sticky navigation.
 *
 * Three constraints that shape this component:
 *  - Height capped at 68px desktop. A nav that eats 15% of the viewport is a bug.
 *  - Links render on a single line at `lg`. If they ever wrap, shorten a label
 *    in src/content/portfolio.ts rather than adding a second row.
 *  - Active-section detection uses IntersectionObserver, not a scroll listener.
 *    A `window.addEventListener("scroll")` handler runs on every frame and cannot
 *    be batched, which is the standard way a smooth page turns janky.
 */
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
        // A thin band near the top of the viewport, so the highlight moves when a
        // section actually occupies the reading position rather than when it peeks in.
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
          "sticky top-0 w-full border-b border-hairline bg-bg/85 backdrop-blur-md",
          Z.nav,
        )}
      >
        <div className="max-shell flex h-[68px] items-center gap-6 px-5 md:px-8">
          <button
            type="button"
            onClick={() => go("top")}
            aria-label="Back to top"
            className="press shrink-0 text-[15px] font-semibold tracking-tight text-fg"
          >
            {profile.shortName}
            <span className="text-accent">.</span>
          </button>

          <nav aria-label="Sections" className="ml-auto hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cx(
                    "press relative rounded-full px-3.5 py-2 text-[13.5px] font-medium",
                    isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 32 }
                      }
                      className="absolute inset-0 rounded-full bg-bg-sunken"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => go("contact")}
              className={cx(
                "press hidden items-center gap-1.5 rounded-full bg-accent px-4 py-2",
                "text-[13.5px] font-medium text-accent-fg hover:bg-accent-hover sm:inline-flex",
              )}
            >
              {CTA_LABELS.secondary}
              <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="press grid size-9 place-items-center rounded-full border border-hairline bg-surface text-fg-muted hover:text-fg lg:hidden"
            >
              <List size={18} weight="regular" aria-hidden="true" />
            </button>
          </div>
        </div>

        <motion.div
          style={{ scaleX: progress }}
          className="h-px w-full origin-left bg-accent"
          aria-hidden="true"
        />
      </header>

      {open ? (
        <div className={cx("fixed inset-0 lg:hidden", Z.mobileMenu)} role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
          />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-0 border-b border-hairline bg-surface px-5 pt-5 pb-7"
          >
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold tracking-tight text-fg">
                {profile.shortName}
                <span className="text-accent">.</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="press grid size-9 place-items-center rounded-full border border-hairline text-fg-muted hover:text-fg"
              >
                <X size={18} weight="regular" aria-hidden="true" />
              </button>
            </div>

            <ul className="mt-6 flex flex-col">
              {nav.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduce ? 0 : index * 0.045, duration: 0.3 }}
                  className="border-b border-hairline last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    className="flex w-full items-center justify-between py-3.5 text-left text-lg font-medium text-fg"
                  >
                    {item.label}
                    <ArrowUpRight size={18} weight="regular" className="text-fg-subtle" aria-hidden="true" />
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
