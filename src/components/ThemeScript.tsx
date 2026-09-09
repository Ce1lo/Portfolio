/**
 * Sets `data-theme` on <html> synchronously during HTML parsing, before first
 * paint. Without this the server-rendered palette paints first and the stored
 * preference flips it a frame later, which is a visible flash on every load.
 *
 * This is the documented Next.js pattern for client-only state: an inline script
 * plus `suppressHydrationWarning` on the element it mutates.
 *
 * Server Component on purpose. It must not be a Client Component, or it would
 * hydrate too late to prevent the flash.
 */
export function ThemeScript() {
  const code = `(function(){
  try {
    var KEY = "pf-theme";
    var stored = localStorage.getItem(KEY);
    var theme = (stored === "dark" || stored === "light")
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
