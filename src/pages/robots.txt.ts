import type { APIRoute } from 'astro';
import { withBase } from '../utils/url';

/**
 * Generated rather than kept in `public/` so the sitemap URL follows `site` and the configured
 * base path instead of being hardcoded.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(withBase('/sitemap-index.xml'), site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
