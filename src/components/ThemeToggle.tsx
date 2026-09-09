"use client";

import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { cx } from "@/lib/cx";

const STORAGE_KEY = "pf-theme";

function readTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

/**
 * Theme toggle.
 *
 * The initial render is deliberately icon-less (`mounted` guard). Reading
 * localStorage during render would produce a hydration mismatch, because the
 * server always renders the same markup while the client already knows the
 * stored preference from ThemeScript.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(readTheme());
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Private browsing with storage disabled: theme still applies for this
        // session, it just will not persist. Not worth surfacing to the user.
      }
      return next;
    });
  }, []);

  const label = !mounted
    ? "Toggle colour theme"
    : theme === "dark"
      ? "Switch to light theme"
      : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cx(
        "press grid size-9 place-items-center rounded-full border border-hairline",
        "bg-surface text-fg-muted hover:border-hairline-strong hover:text-fg",
        className,
      )}
    >
      {!mounted ? (
        <span className="size-4 rounded-full border border-current opacity-40" aria-hidden="true" />
      ) : theme === "dark" ? (
        <Sun size={18} weight="regular" aria-hidden="true" />
      ) : (
        <Moon size={18} weight="regular" aria-hidden="true" />
      )}
    </button>
  );
}
