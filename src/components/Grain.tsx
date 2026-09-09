/**
 * Fixed film-grain overlay.
 *
 * A single `position: fixed`, `pointer-events: none` element mounted once in the
 * root layout. Never attach a texture like this to a scrolling container: the
 * browser repaints the whole layer on every scroll frame and mobile frame rate
 * collapses.
 */
export function Grain() {
  return <div className="grain-layer" aria-hidden="true" />;
}
