// Two trivial runtime helpers (SPEC.md §2) — each has exactly one sane
// behavior, unlike the fallback-pattern helper deferred in §3.

import type { AquiliferGlobal } from './types.js';

/** Returns `window.aquilifer` if the extension is installed and has
 *  injected it into this page, `undefined` otherwise. Guards against
 *  `window` itself being undefined so this is safe to call from
 *  server-rendered code paths without special-casing the environment. */
export function getAquilifer(): AquiliferGlobal | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.aquilifer;
}

/** Same check as `getAquilifer()`, as a boolean. */
export function isAquiliferAvailable(): boolean {
  return getAquilifer() !== undefined;
}
