import { profile } from "@/content/portfolio";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-hairline-strong bg-bg-sunken py-10 text-sm text-fg-muted">
      <div className="max-shell flex flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row md:px-8">
        <div className="flex items-center gap-2 font-arcade text-xs text-fg">
          <span className="font-bold text-accent">{profile.shortName.toUpperCase()}.ROM</span>
          <span className="text-fg-subtle">/</span>
          <span className="text-fg-subtle font-normal">{profile.role}</span>
        </div>

        <div className="text-center font-mono text-xs text-fg-subtle md:text-right">
          (c) {year} {profile.name.replace(/^EDIT:\s*/, "")}. All frames stored on Drive.
        </div>
      </div>
    </footer>
  );
}
