import { skillGroups } from "@/content/portfolio";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

/**
 * Technical stack section.
 *
 * Layout family: asymmetric group grid (1 + 2).
 * The first group ("Language and runtime") spans full width across 12 columns,
 * with items arranged in an open horizontal chip matrix. The second and third
 * groups ("Framework and data", "Delivery and verification") sit side-by-side
 * on 6 columns each.
 *
 * Rule check: avoids the generic "three equal cards in a row" anti-pattern.
 * Eyebrow budget: zero eyebrows here.
 */
export function Skills() {
  const [core, framework, delivery] = skillGroups;

  return (
    <section id="stack" className="hairline-t bg-bg py-24 md:py-32">
      <div className="max-shell px-5 md:px-8">
        <SectionHeading
          headline="Core technologies, treated seriously."
          body={
            <p>
              I avoid surface-level familiarity across thirty libraries. The stack
              below is pinned and exercised every week through reproducible test suites.
            </p>
          }
        />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Group 1: Full width (12 cols) */}
          <Reveal from="up" delay={0.08} className="md:col-span-12">
            <div className="rounded-[12px] border border-hairline bg-surface p-7 md:p-9 shadow-tinted">
              <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                <h3 className="text-xl font-medium tracking-tight text-fg">
                  {core.title}
                </h3>
                <p className="measure text-sm text-fg-muted">{core.note}</p>
              </div>

              <ul className="mt-8 flex flex-wrap gap-2.5" aria-label={core.title}>
                {core.items.map((item) => (
                  <li
                    key={item}
                    className="press rounded-[8px] border border-hairline bg-bg-sunken px-4 py-2 font-mono text-[13px] font-medium text-fg hover:border-hairline-strong hover:bg-surface"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Group 2: Half width (6 cols) */}
          <Reveal from="up" delay={0.16} className="md:col-span-6">
            <div className="flex h-full flex-col justify-between rounded-[12px] border border-hairline bg-surface p-7 md:p-8 shadow-tinted">
              <div>
                <h3 className="text-lg font-medium tracking-tight text-fg">
                  {framework.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {framework.note}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label={framework.title}>
                  {framework.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-[8px] border border-hairline bg-bg-sunken px-3 py-1.5 font-mono text-[12px] text-fg-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Group 3: Half width (6 cols) */}
          <Reveal from="up" delay={0.24} className="md:col-span-6">
            <div className="flex h-full flex-col justify-between rounded-[12px] border border-hairline bg-surface p-7 md:p-8 shadow-tinted">
              <div>
                <h3 className="text-lg font-medium tracking-tight text-fg">
                  {delivery.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {delivery.note}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label={delivery.title}>
                  {delivery.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-[8px] border border-hairline bg-bg-sunken px-3 py-1.5 font-mono text-[12px] text-fg-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
