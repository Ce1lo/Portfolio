import { about, timeline, imageSlots } from "@/content/portfolio";
import { getImagesByFolder } from "@/lib/manifest";
import { SectionHeading } from "@/components/SectionHeading";
import { SmartImage } from "@/components/SmartImage";
import { Reveal } from "@/components/Reveal";

/**
 * About section.
 *
 * Layout family: sticky two-column.
 * The left column pins while the right column scrolls through the long-form
 * copy and the roadmap timeline. On viewports below md (768px) the sticky
 * pinning is disabled and the columns stack into a standard single column.
 *
 * Eyebrow budget: zero eyebrows here. The heading alone names the section.
 */
export function About() {
  const portrait = getImagesByFolder(imageSlots.about)[0] ?? null;

  return (
    <section id="about" className="hairline-t bg-bg py-24 md:py-32">
      <div className="max-shell px-5 md:px-8">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12 md:gap-10 lg:gap-16">
          <div className="flex flex-col gap-8 md:sticky md:top-28 md:col-span-5">
            <SectionHeading
              headline={about.headline}
              body={
                <p>
                  A final-year view on backend software: the hard part is never writing
                  the framework glue, it is reasoning about state transitions when three
                  things fail at once.
                </p>
              }
            />

            <div className="w-full max-w-[340px]">
              <SmartImage
                image={portrait}
                alt={portrait ? portrait.source.name : "Portrait photograph"}
                fallbackSeed="software-engineer-portrait-workspace"
                fallbackWidth={720}
                fallbackHeight={900}
                sizes="(max-width: 767px) 90vw, 32vw"
                ratioClassName="aspect-[4/5] rounded-[12px] shadow-tinted"
              />
            </div>
          </div>

          <div className="flex flex-col gap-12 md:col-span-7">
            <div className="flex flex-col gap-6 text-[16px] leading-[1.7] text-fg-muted">
              {about.paragraphs.map((p, index) => (
                <Reveal key={index} from="up" delay={index * 0.08}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal from="up" delay={0.2} className="hairline-t pt-10">
              <h3 className="text-xl font-medium tracking-tight text-fg">Timeline</h3>
              <p className="mt-1 text-sm text-fg-muted">
                From core language semantics to production verification on Oracle Cloud.
              </p>

              <ol className="mt-8 relative border-l border-hairline-strong pl-6">
                {timeline.map((entry, index) => (
                  <li key={index} className="mb-9 last:mb-0 relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[31px] top-1.5 size-2.5 rounded-full border border-hairline-strong bg-surface"
                    />
                    <div className="font-mono text-[12px] uppercase tracking-wider text-accent">
                      {entry.period}
                    </div>
                    <div className="mt-1 text-base font-medium text-fg">{entry.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-fg-muted">{entry.detail}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
