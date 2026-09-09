/**
 * Z-index scale.
 *
 * The only permitted stacking layers in this project. Arbitrary `z-50` sprinkled
 * into a component is a bug: pick the layer that matches the intent, and if none
 * fits, add a named layer here instead of inventing a number inline.
 *
 * Each class string is written out literally on purpose. Tailwind v4 discovers
 * utilities by scanning source text, so a template-built `z-[${n}]` would never
 * be emitted into the stylesheet.
 */
export const Z = {
  /** Decorative backgrounds that sit behind section content. */
  backdrop: "z-0",
  /** Normal in-flow content, including overlapping card art. */
  content: "z-10",
  /** Sticky navigation bar. */
  nav: "z-30",
  /** Mobile navigation sheet, above the nav bar that triggers it. */
  mobileMenu: "z-40",
  /** Gallery lightbox: backdrop and controls. */
  lightbox: "z-50",
  /** Fixed film grain. Above everything visual, never interactive. */
  grain: "z-60",
  /** Transient toasts, e.g. "email copied". */
  toast: "z-70",
} as const;

export type ZLayer = keyof typeof Z;

/** Named layer -> literal Tailwind class, e.g. `Z.nav` -> `"z-30"`. */
export function zClass(layer: ZLayer): string {
  return Z[layer];
}
