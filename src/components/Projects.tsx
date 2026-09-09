"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { projects, type ProjectStatus } from "@/content/portfolio";
import { getImagesByFolder } from "@/lib/manifest";
import { SectionHeading } from "@/components/SectionHeading";
import { SmartImage } from "@/components/SmartImage";
import { Reveal } from "@/components/Reveal";
import { cx } from "@/lib/cx";

const STATUS_MAP: Record<ProjectStatus, { label: string; dot: string }> = {
  shipped: { label: "Shipped", dot: "bg-emerald-500" },
  "in-progress": { label: "In progress", dot: "bg-accent" },
  planned: { label: "Planned", dot: "bg-fg-subtle" },
};

/**
 * Projects section.
 *
 * Layout family: asymmetric bento grid.
 * Exactly 3 cells for 3 items:
 *  - Project 1 (Ticket Booking) occupies 7 columns with a full-height card,
 *    screenshot asset, architectural highlights, and load testing specs.
 *  - Projects 2 and 3 occupy the remaining 5 columns, stacked vertically.
 *
 * Eyebrow: exactly 1 eyebrow used here ("Selected work"). This satisfies the
 * one-eyebrow-per-three-sections budget without repeating on other sections.
 */
export function Projects() {
  const [p1, p2, p3] = projects;
  const img1 = getImagesByFolder(p1.imageFolder)[0] ?? null;
  const img2 = getImagesByFolder(p2.imageFolder)[0] ?? null;
  const img3 = getImagesByFolder(p3.imageFolder)[0] ?? null;

  return (
    <section id="work" className="hairline-t bg-bg-sunken py-24 md:py-32">
      <div className="max-shell px-5 md:px-8">
        <SectionHeading
          eyebrow="Selected work"
          headline="Real invariants, defended in code."
          body={
            <p>
              Projects built to answer interview questions with traces, benchmarks,
              and isolation-level proofs rather than framework buzzwords.
            </p>
          }
        />

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main feature project: 7 cols */}
          <Reveal from="up" delay={0.08} className="lg:col-span-7">
            <article className="flex h-full flex-col justify-between rounded-[12px] border border-hairline bg-surface p-7 md:p-9 shadow-tinted">
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-[12px] uppercase text-fg-subtle">
                    {p1.period}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-bg-sunken px-3 py-1 text-[12px] text-fg-muted">
                    <span className={cx("size-1.5 rounded-full", STATUS_MAP[p1.status].dot)} />
                    {STATUS_MAP[p1.status].label}
                  </span>
                </div>

                <h3 className="text-2xl font-medium tracking-tight text-fg md:text-3xl">
                  {p1.name}
                </h3>

                <p className="text-[15px] leading-relaxed text-fg-muted">
                  {p1.summary}
                </p>

                <div className="my-2">
                  <SmartImage
                    image={img1}
                    alt={p1.name}
                    fallbackSeed="ticket-booking-concurrency-dashboard"
                    fallbackWidth={1280}
                    fallbackHeight={720}
                    sizes="(max-width: 1023px) 90vw, 55vw"
                    ratioClassName="aspect-[16/9] rounded-[8px] border border-hairline"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-accent">
                    Key implementation decisions
                  </h4>
                  <ul className="space-y-2 text-[14px] leading-relaxed text-fg-muted">
                    {p1.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 hairline-t pt-6">
                <ul className="flex flex-wrap gap-2" aria-label="Technology stack">
                  {p1.stack.map((t) => (
                    <li
                      key={t}
                      className="rounded-[8px] border border-hairline bg-bg-sunken px-2.5 py-1 font-mono text-[12px] text-fg-muted"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                {p1.repoUrl ? (
                  <a
                    href={p1.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="press inline-flex items-center gap-1.5 text-sm font-medium text-fg hover:text-accent"
                  >
                    View repository
                    <ArrowUpRight size={15} weight="bold" />
                  </a>
                ) : (
                  <span className="font-mono text-[11.5px] text-fg-subtle">
                    Code published upon W21 completion
                  </span>
                )}
              </div>
            </article>
          </Reveal>

          {/* Secondary projects: 5 cols stacked */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Project 2 */}
            <Reveal from="up" delay={0.16} className="h-full">
              <article className="flex h-full flex-col justify-between rounded-[12px] border border-hairline bg-surface p-7 shadow-tinted">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] uppercase text-fg-subtle">
                      {p2.period}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-bg-sunken px-2.5 py-0.5 text-[11.5px] text-fg-muted">
                      <span className={cx("size-1.5 rounded-full", STATUS_MAP[p2.status].dot)} />
                      {STATUS_MAP[p2.status].label}
                    </span>
                  </div>

                  <h3 className="text-xl font-medium tracking-tight text-fg">
                    {p2.name}
                  </h3>

                  <p className="text-[14.5px] leading-relaxed text-fg-muted">
                    {p2.summary}
                  </p>

                  <div className="my-1">
                    <SmartImage
                      image={img2}
                      alt={p2.name}
                      fallbackSeed="data-analytics-stream-code"
                      fallbackWidth={800}
                      fallbackHeight={450}
                      sizes="(max-width: 1023px) 90vw, 38vw"
                      ratioClassName="aspect-[16/9] rounded-[8px] border border-hairline"
                    />
                  </div>

                  <ul className="space-y-1.5 text-[13px] leading-relaxed text-fg-muted">
                    {p2.highlights.slice(0, 2).map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5 hairline-t pt-5">
                  {p2.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-[8px] border border-hairline bg-bg-sunken px-2 py-0.5 font-mono text-[11px] text-fg-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>

            {/* Project 3 */}
            <Reveal from="up" delay={0.24} className="h-full">
              <article className="flex h-full flex-col justify-between rounded-[12px] border border-hairline bg-surface p-7 shadow-tinted">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] uppercase text-fg-subtle">
                      {p3.period}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-bg-sunken px-2.5 py-0.5 text-[11.5px] text-fg-muted">
                      <span className={cx("size-1.5 rounded-full", STATUS_MAP[p3.status].dot)} />
                      {STATUS_MAP[p3.status].label}
                    </span>
                  </div>

                  <h3 className="text-xl font-medium tracking-tight text-fg">
                    {p3.name}
                  </h3>

                  <p className="text-[14.5px] leading-relaxed text-fg-muted">
                    {p3.summary}
                  </p>

                  <div className="my-1">
                    <SmartImage
                      image={img3}
                      alt={p3.name}
                      fallbackSeed="sorting-algorithm-java-code"
                      fallbackWidth={800}
                      fallbackHeight={450}
                      sizes="(max-width: 1023px) 90vw, 38vw"
                      ratioClassName="aspect-[16/9] rounded-[8px] border border-hairline"
                    />
                  </div>

                  <ul className="space-y-1.5 text-[13px] leading-relaxed text-fg-muted">
                    {p3.highlights.slice(0, 2).map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5 hairline-t pt-5">
                  {p3.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-[8px] border border-hairline bg-bg-sunken px-2 py-0.5 font-mono text-[11px] text-fg-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
