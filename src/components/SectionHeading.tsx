import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Reveal } from "@/components/Reveal";

export type SectionHeadingProps = {
  headline: string;
  /** Stacked under the headline, never floated into a second column. */
  body?: ReactNode;
  /**
   * Rationed on purpose. The page budget is one eyebrow per three sections, so
   * this prop is passed by exactly one section. If you find yourself adding it
   * to a third section, delete it from one of the others instead.
   */
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
  /** Heading level for the document outline. The page has one h1, in the hero. */
  as?: "h2" | "h3";
};

export function SectionHeading({
  headline,
  body,
  eyebrow,
  align = "left",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cx(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{eyebrow}</span>
      ) : null}

      <Tag
        className={cx(
          "text-balance text-3xl leading-[1.08] font-medium tracking-tight text-fg",
          "md:text-4xl lg:text-[2.75rem]",
          align === "center" && "mx-auto max-w-[22ch]",
          align === "left" && "max-w-[24ch]",
        )}
      >
        {headline}
      </Tag>

      {body ? (
        <div
          className={cx(
            "measure text-base leading-relaxed text-fg-muted",
            align === "center" && "mx-auto",
          )}
        >
          {body}
        </div>
      ) : null}
    </Reveal>
  );
}
