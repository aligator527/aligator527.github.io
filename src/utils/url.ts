/**
 * Joins a site-internal path with Astro's configured base so links survive
 * deployment under a repository subpath (e.g. `/portfolio/`).
 */
export function withBase(path: string, base: string = import.meta.env.BASE_URL): string {
  if (/^([a-z][a-z\d+.-]*:|#)/i.test(path)) return path;
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const trimmedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}${trimmedPath}`;
}

function stripTrailingSlash(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

/**
 * Whether a navigation target should be marked as the current location.
 * Section links (e.g. `/work`) stay current on their child routes.
 */
export function isCurrent(
  href: string,
  pathname: string,
  options: { exact?: boolean } = {},
): 'page' | undefined {
  const target = stripTrailingSlash(href);
  const current = stripTrailingSlash(pathname);
  if (current === target) return 'page';
  if (!options.exact && target !== '/' && current.startsWith(`${target}/`)) return 'page';
  return undefined;
}
