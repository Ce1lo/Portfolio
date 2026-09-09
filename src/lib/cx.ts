/**
 * Minimal class-name joiner.
 *
 * Deliberately not clsx or tailwind-merge: this project has no conditional
 * variant system and no overriding utility conflicts, so a 10-line function is
 * cheaper than two dependencies. If conflicting Tailwind utilities ever need
 * resolving at runtime, replace this with tailwind-merge and update every call
 * site, do not bolt a second joiner on top.
 */
export type ClassValue = string | number | null | undefined | false | ClassValue[];

export function cx(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const value of values) {
    if (!value && value !== 0) continue;
    if (Array.isArray(value)) {
      const nested = cx(...value);
      if (nested) out.push(nested);
      continue;
    }
    out.push(String(value));
  }
  return out.join(" ");
}
