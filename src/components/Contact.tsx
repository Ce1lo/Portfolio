"use client";

import { useState } from "react";
import {
  GithubLogo,
  LinkedinLogo,
  EnvelopeSimple,
  Copy,
  Check,
  ArrowUpRight,
  Globe,
  GitlabLogo,
} from "@phosphor-icons/react";
import { profile, socials, CTA_LABELS } from "@/content/portfolio";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Z } from "@/lib/z";

const ICON_MAP = {
  github: GithubLogo,
  linkedin: LinkedinLogo,
  envelope: EnvelopeSimple,
  gitlab: GitlabLogo,
  globe: Globe,
};

/**
 * Contact section.
 *
 * Layout family: centered CTA band.
 * Provides direct mailto access plus an inline clipboard copy with a transient
 * toast confirmation. Social channels are pulled cleanly from configuration.
 *
 * CTA Label Check: uses `CTA_LABELS.secondary` ("Get in touch") exclusively.
 * Eyebrow budget: zero eyebrows here.
 */
export function Contact() {
  const [copied, setCopied] = useState(false);

  const cleanEmail = profile.email.replace(/^EDIT:\s*/, "");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(cleanEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${cleanEmail}`;
    }
  };

  return (
    <section id="contact" className="hairline-t bg-bg py-24 md:py-32">
      <div className="max-shell px-5 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            align="center"
            headline="Let us talk systems."
            body={
              <p>
                Currently exploring Backend Intern positions starting March 2027.
                Open to technical discussions, architecture critique, or roadmap exchanges.
              </p>
            }
          />

          <Reveal from="up" delay={0.12} className="mt-12 flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${cleanEmail}`}
                className="press inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-medium text-accent-fg hover:bg-accent-hover shadow-tinted"
              >
                <EnvelopeSimple size={18} weight="bold" />
                {CTA_LABELS.secondary}
              </a>

              <button
                type="button"
                onClick={copyEmail}
                className="press inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface px-6 py-3.5 text-base font-medium text-fg hover:border-fg-subtle"
              >
                {copied ? (
                  <>
                    <Check size={18} weight="bold" className="text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} weight="regular" />
                    <span>Copy email</span>
                  </>
                )}
              </button>
            </div>

            <div className="font-mono text-sm text-fg-muted">{cleanEmail}</div>

            {/* Social links */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 hairline-t pt-8">
              {socials.map((s) => {
                const IconComponent = ICON_MAP[s.icon] ?? Globe;
                const cleanHref = s.href.replace(/^EDIT:\s*/, "");
                return (
                  <a
                    key={s.label}
                    href={cleanHref}
                    target="_blank"
                    rel="noreferrer"
                    className="press flex items-center gap-1.5 text-sm font-medium text-fg-muted hover:text-fg"
                  >
                    <IconComponent size={18} weight="regular" />
                    <span>{s.label}</span>
                    <ArrowUpRight size={13} weight="bold" className="text-fg-subtle" />
                  </a>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Copy Toast */}
      {copied && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 rounded-full border border-hairline-strong bg-surface px-4 py-2 text-xs font-medium text-fg shadow-tinted-lg ${Z.toast}`}
        >
          Email address copied to clipboard
        </div>
      )}
    </section>
  );
}
