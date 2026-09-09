import { profile } from "@/content/portfolio";

/**
 * Clean, restrained footer.
 *
 * Anti-pattern check:
 *  - No fake version footers ("v1.4.2", "build 0042").
 *  - No decorative locale strips ("14:23 - 28C").
 *  - Purely names, navigation return, and copyright.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="hairline-t bg-bg-sunken py-12 text-sm text-fg-muted">
      <div className="max-shell flex flex-col items-center justify-between gap-6 px-5 md:flex-row md:px-8">
        <div className="flex items-center gap-2 font-medium text-fg">
          <span>{profile.shortName}</span>
          <span className="text-accent" aria-hidden="true">/</span>
          <span className="text-fg-subtle font-normal">{profile.role}</span>
        </div>

        <div className="text-center font-mono text-xs text-fg-subtle md:text-right">
          (c) {year} {profile.name.replace(/^EDIT:\s*/, "")}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
