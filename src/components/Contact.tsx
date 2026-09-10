"use client";

import { useState } from "react";
import {
  InstagramLogo,
  Globe,
  EnvelopeSimple,
  Copy,
  Check,
  ArrowUpRight,
  LinkedinLogo,
} from "@phosphor-icons/react";
import { profile, socials, CTA_LABELS } from "@/content/portfolio";
import { Z } from "@/lib/z";

const ICON_MAP = {
  instagram: InstagramLogo,
  behance: Globe,
  linkedin: LinkedinLogo,
  envelope: EnvelopeSimple,
  globe: Globe,
};

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
    <section id="contact" className="py-32 md:py-48 hairline-t bg-bg relative">
      <div className="max-shell px-5 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            Inquiries & Representation
          </span>
          <h2 className="mt-4 text-4xl sm:text-6xl font-medium tracking-tight text-fg">
            Initiate a Commission.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-fg-muted leading-relaxed">
            Available for editorial assignments, artist profiles, fine-art print acquisitions,
            and collaborative exhibitions. Let us shape a timeless visual narrative.
          </p>

          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${cleanEmail}`}
                className="press inline-flex items-center gap-2 rounded-full bg-accent px-9 py-4 text-base font-medium text-accent-fg hover:bg-accent-hover shadow-tinted"
              >
                <EnvelopeSimple size={19} weight="bold" />
                {CTA_LABELS.secondary}
              </a>

              <button
                type="button"
                onClick={copyEmail}
                className="press inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface/90 px-7 py-4 text-base font-medium text-fg hover:border-fg-subtle shadow-tinted"
              >
                {copied ? (
                  <>
                    <Check size={19} weight="bold" className="text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={19} weight="regular" />
                    <span>Copy email</span>
                  </>
                )}
              </button>
            </div>

            <div className="font-mono text-sm text-fg-muted">{cleanEmail}</div>

            {/* Social channels */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 hairline-t pt-8 w-full max-w-lg">
              {socials.map((s) => {
                const IconComponent = ICON_MAP[s.icon] ?? Globe;
                const cleanHref = s.href.replace(/^EDIT:\s*/, "");
                return (
                  <a
                    key={s.label}
                    href={cleanHref}
                    target="_blank"
                    rel="noreferrer"
                    className="press flex items-center gap-2 text-sm font-medium text-fg-muted hover:text-fg"
                  >
                    <IconComponent size={19} weight="regular" />
                    <span>{s.label}</span>
                    <ArrowUpRight size={13} weight="bold" className="text-fg-subtle" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

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
