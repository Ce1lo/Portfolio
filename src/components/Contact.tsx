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
  Terminal,
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
    <section id="contact" className="py-24 md:py-36 hairline-t bg-bg relative">
      <div className="max-shell px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 font-arcade text-xs uppercase tracking-wider text-accent mb-3">
            <Terminal size={14} weight="bold" />
            <span>[CONTACT.ROM // SAY_HELLO]</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-medium tracking-tight text-fg">
            Get in Touch
          </h2>

          <p className="mx-auto mt-4 max-w-xl font-mono text-sm sm:text-base text-fg-muted leading-relaxed">
            Feel free to reach out if you want to collaborate, need someone to take photos for your event, or just want to say hi.
          </p>

          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${cleanEmail}`}
                className="pixel-press inline-flex items-center gap-2 border-2 border-fg bg-accent px-8 py-3.5 font-arcade text-xs sm:text-sm text-accent-fg shadow-pixel hover:bg-accent-hover"
              >
                <EnvelopeSimple size={18} weight="bold" />
                <span>{CTA_LABELS.secondary.toUpperCase()}</span>
              </a>

              <button
                type="button"
                onClick={copyEmail}
                className="pixel-press inline-flex items-center gap-2 border-2 border-fg bg-surface px-7 py-3.5 font-arcade text-xs sm:text-sm text-fg shadow-pixel hover:border-accent"
              >
                {copied ? (
                  <>
                    <Check size={18} weight="bold" className="text-emerald-500" />
                    <span>[COPIED!]</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} weight="bold" />
                    <span>[COPY EMAIL]</span>
                  </>
                )}
              </button>
            </div>

            <div className="border border-hairline-strong bg-bg-sunken px-4 py-2 font-mono text-xs sm:text-sm text-fg shadow-pixel-sm">
              &gt; {cleanEmail}
            </div>

            {/* Social channels */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-lg pt-6 border-t border-hairline">
              {socials.map((s) => {
                const IconComponent = ICON_MAP[s.icon] ?? Globe;
                const cleanHref = s.href.replace(/^EDIT:\s*/, "");
                return (
                  <a
                    key={s.label}
                    href={cleanHref}
                    target="_blank"
                    rel="noreferrer"
                    className="pixel-press inline-flex items-center gap-2 border-2 border-hairline-strong bg-surface px-4 py-2 font-arcade text-xs text-fg hover:border-accent hover:text-accent shadow-pixel-sm"
                  >
                    <IconComponent size={16} weight="bold" />
                    <span>{s.label.toUpperCase()}</span>
                    <ArrowUpRight size={12} weight="bold" className="text-fg-subtle" />
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
          className={`fixed bottom-6 right-6 border-2 border-fg bg-surface px-4 py-2 font-arcade text-xs text-fg shadow-pixel ${Z.toast}`}
        >
          [SUCCESS]: EMAIL COPIED TO CLIPBOARD
        </div>
      )}
    </section>
  );
}
