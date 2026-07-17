export type AppLocale = 'fr' | 'en';

/** Matches a leading /fr or /en locale prefix on a path or URL. */
export const LOCALE_PREFIX_RE = /^\/(fr|en)(\/|$)/;

/** Matches /fr or /en followed by an optional path remainder. */
export const LOCALE_PATH_RE = /^\/(fr|en)(\/.*)?$/;

export function matchLocaleFromPath(path: string): AppLocale | null {
  const match = path.match(LOCALE_PREFIX_RE);
  return match ? (match[1] as AppLocale) : null;
}

export function hasLocalePrefix(path: string): boolean {
  return LOCALE_PREFIX_RE.test(path);
}

/** Returns the path without the /fr|/en prefix ('' for locale home). */
export function stripLocalePrefix(url: string): string {
  const match = url.match(LOCALE_PATH_RE);
  if (match) {
    return match[2] || '';
  }
  return url;
}

export function isEnglishPath(path: string): boolean {
  return /^\/en(\/|$)/.test(path);
}
