export const STATIC_ROUTE_ALLOWLIST = new Set([
  '/',
  '/benefits',
  '/forms',
  '/find-help',
  '/ihss-behavior-log',
  '/iep-goals',
  '/regional-center-funding'
]);

export const STATIC_GUIDE_PREFIXES = [
  '/forms/',
  '/situations/',
  '/deadlines/',
  '/programs/'
];

export const SITEMAP_CHILD_MANIFEST = [
  { id: 'static', loc: '/sitemaps/static.xml', hardBlocked: false },
  { id: 'counties', loc: '/sitemaps/counties.xml', hardBlocked: false },
  { id: 'districts', loc: '/sitemaps/districts.xml', hardBlocked: true },
  { id: 'cities', loc: '/sitemaps/cities.xml', hardBlocked: true }
] as const;

export function normalizeManifestPath(path: string | null | undefined): string {
  if (!path) {
    return '/';
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized.replace(/\/+$/, '') || '/';
}

export function isAllowlistedStaticPath(path: string | null | undefined): boolean {
  const normalized = normalizeManifestPath(path);
  if (STATIC_ROUTE_ALLOWLIST.has(normalized)) {
    return true;
  }
  return STATIC_GUIDE_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

export function isStaticGuidePath(path: string | null | undefined): boolean {
  const normalized = normalizeManifestPath(path);
  return STATIC_GUIDE_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

export function isHardBlockedSitemapRoute(routeType: string): boolean {
  return routeType === 'school-district' || routeType === 'city';
}
