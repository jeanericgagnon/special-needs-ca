import fs from 'fs';
import path from 'path';

const TRUSTED_STATUSES = new Set(['official_verified', 'verified', 'human_verified', 'source_listed']);
const ADDRESS_PATTERN = /\b\d{1,6}\s+[A-Za-z0-9.'#&/-]+(?:\s+[A-Za-z0-9.'#&/-]+){1,10},\s*[A-Za-z .'-]+,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/g;
const DEFAULT_USER_AGENT = 'Ablefull nonprofit accessibility evidence bot/1.0 (+https://ablefull.com)';
const DEFAULT_FETCH_TIMEOUT_MS = 12000;
const LOCAL_IN_PERSON_LEVELS = new Set(['service_location_address', 'county_specific_location']);
const ORG_LEVEL_LEVELS = new Set(['organization_physical_address', 'statewide_service_area']);
const NETWORK_LEVELS = new Set(['national_or_network_directory']);

export function getTrustedStatuses() {
  return TRUSTED_STATUSES;
}

export function getLocalInPersonLevels() {
  return LOCAL_IN_PERSON_LEVELS;
}

export function getOrgLevelEvidenceLevels() {
  return ORG_LEVEL_LEVELS;
}

export function getNetworkEvidenceLevels() {
  return NETWORK_LEVELS;
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unknown';
}

export function normalizeName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(the|inc|llc|corp|corporation|organization|office|of|for|and)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseCliArgs(argv) {
  const args = {
    dryRun: false,
    domain: '',
    orgTerms: [],
    seedUrls: [],
    state: '',
    maxPages: 12,
    rateLimitMs: 400,
    maxRetries: 2,
    fixtureManifestPath: '',
    dbPath: '',
    outputRoot: '',
    generatedDate: '',
    allowNetworkDomain: false,
    allowBulkOrgLevel: false,
  };

  for (const part of argv) {
    if (part === '--dry-run') {
      args.dryRun = true;
      continue;
    }
    if (part === '--allow-network-domain') {
      args.allowNetworkDomain = true;
      continue;
    }
    if (part === '--allow-bulk-org-level') {
      args.allowBulkOrgLevel = true;
      continue;
    }
    if (!part.startsWith('--')) continue;
    const [flag, rawValue = ''] = part.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'domain') args.domain = value.toLowerCase();
    if (flag === 'org') args.orgTerms.push(value);
    if (flag === 'seed-url' && value) args.seedUrls.push(value);
    if (flag === 'state') args.state = value.toLowerCase();
    if (flag === 'max-pages' && Number.isFinite(Number(value))) args.maxPages = Number(value);
    if (flag === 'rate-limit-ms' && Number.isFinite(Number(value))) args.rateLimitMs = Number(value);
    if (flag === 'max-retries' && Number.isFinite(Number(value))) args.maxRetries = Number(value);
    if (flag === 'fixture-manifest') args.fixtureManifestPath = value;
    if (flag === 'db-path') args.dbPath = value;
    if (flag === 'output-root') args.outputRoot = value;
    if (flag === 'generated-date') args.generatedDate = value;
  }

  if (process.env.DRY_RUN === '1') args.dryRun = true;
  if (process.env.ALLOW_NETWORK_DOMAIN === '1') args.allowNetworkDomain = true;
  if (process.env.ALLOW_BULK_ORG_LEVEL === '1') args.allowBulkOrgLevel = true;
  if (!args.domain && process.env.DOMAIN) args.domain = process.env.DOMAIN.toLowerCase();
  if (!args.fixtureManifestPath && process.env.FIXTURE_MANIFEST_PATH) args.fixtureManifestPath = process.env.FIXTURE_MANIFEST_PATH;
  if (!args.dbPath && process.env.DB_PATH) args.dbPath = process.env.DB_PATH;
  if (!args.outputRoot && process.env.OUTPUT_ROOT) args.outputRoot = process.env.OUTPUT_ROOT;
  if (!args.generatedDate && process.env.GENERATED_DATE) args.generatedDate = process.env.GENERATED_DATE;
  if (!args.state && process.env.STATE_FILTER) args.state = process.env.STATE_FILTER.toLowerCase();
  if (process.env.ORG_TERMS) {
    args.orgTerms.push(...process.env.ORG_TERMS.split('|').map((item) => item.trim()).filter(Boolean));
  }
  if (process.env.SEED_URLS) {
    args.seedUrls.push(...process.env.SEED_URLS.split('|').map((item) => item.trim()).filter(Boolean));
  }

  return args;
}

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function readFixtureManifest(manifestPath) {
  if (!manifestPath) return new Map();
  const payload = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  return new Map(Object.entries(payload).map(([url, filePath]) => [normalizeUrl(url), filePath]));
}

export function normalizeUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  parsed.hash = '';
  if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) {
    parsed.port = '';
  }
  if (parsed.pathname.endsWith('/') && parsed.pathname !== '/') {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }
  return parsed.toString();
}

export function isFirstPartyUrl(rawUrl, domain) {
  try {
    const host = new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
    return host === domain || host.endsWith(`.${domain}`);
  } catch {
    return false;
  }
}

export function buildSeedUrls(domain, explicitSeedUrls = []) {
  const urls = explicitSeedUrls.filter(Boolean);
  if (urls.length > 0) return [...new Set(urls.map((url) => normalizeUrl(url)))];
  return [normalizeUrl(`https://${domain}/`), normalizeUrl(`https://www.${domain}/`)];
}

export function decodeHtmlEntities(text) {
  return String(text || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

export function htmlToText(html) {
  return decodeHtmlEntities(
    String(html || '')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<\/(p|div|section|article|li|footer|header|br|h[1-6])>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{2,}/g, '\n')
  )
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

export function extractInternalLinks(html, pageUrl, domain) {
  const found = new Set();
  const hrefRegex = /href\s*=\s*["']([^"'#]+)["']/gi;
  for (const match of html.matchAll(hrefRegex)) {
    const href = String(match[1] || '').trim();
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    try {
      const url = normalizeUrl(new URL(href, pageUrl).toString());
      if (!isFirstPartyUrl(url, domain)) continue;
      const pathname = new URL(url).pathname.toLowerCase();
      const depth = pathname.split('/').filter(Boolean).length;
      if (depth > 3) continue;
      found.add(url);
    } catch {
      continue;
    }
  }
  return [...found];
}

export function classifyBaseEvidenceLevel(surroundingText) {
  const text = String(surroundingText || '').toLowerCase();
  if (/\b(affiliate|chapter|directory|find a|network|member organizations?)\b/.test(text)) {
    return 'national_or_network_directory';
  }
  if (/\b(serving statewide|statewide|across georgia|across the state|throughout the state)\b/.test(text)) {
    return 'statewide_service_area';
  }
  if (/\b(service center|service location|our clinic|visit our office|office location)\b/.test(text)) {
    return 'service_location_address';
  }
  if (/\b(address|location|office|contact us)\b/.test(text)) {
    return 'organization_physical_address';
  }
  return 'ambiguous_address_evidence';
}

export function extractAddressEvidenceFromHtml({ html, pageUrl, fetchedAt, domain }) {
  if (!isFirstPartyUrl(pageUrl, domain)) return [];
  const text = htmlToText(html);
  const evidence = [];
  const matches = [...text.matchAll(ADDRESS_PATTERN)];

  for (const match of matches) {
    const address = String(match[0] || '').trim();
    const surrounding = text.slice(Math.max(0, match.index - 120), Math.min(text.length, (match.index || 0) + address.length + 120));
    let confidence = 'medium';
    let reason = 'Address pattern found on first-party page.';
    if (/\b(address|location|office|visit us|contact us)\b/i.test(surrounding)) {
      confidence = 'high';
      reason = 'Address pattern found near explicit location/contact wording on first-party page.';
    }

    evidence.push({
      evidenceType: 'first_party_address',
      baseEvidenceLevel: classifyBaseEvidenceLevel(surrounding),
      confidence,
      reason,
      sourceUrl: pageUrl,
      fetchedAt,
      address,
      surroundingText: surrounding,
    });
  }

  return evidence;
}

export function validateAddressEvidence(evidence, domain) {
  const errors = [];
  if (!evidence) {
    errors.push('missing_evidence');
    return { valid: false, errors };
  }
  if (evidence.evidenceType !== 'first_party_address') errors.push('unsupported_evidence_type');
  if (!isFirstPartyUrl(evidence.sourceUrl, domain)) errors.push('non_first_party_source');
  if (!/\b\d{5}(?:-\d{4})?\b/.test(String(evidence.address || ''))) errors.push('missing_zip_code');
  if (!/\b[A-Z]{2}\b/.test(String(evidence.address || ''))) errors.push('missing_state_code');
  if (!/\b\d{1,6}\s+/.test(String(evidence.address || ''))) errors.push('missing_street_number');
  if (evidence.confidence !== 'high') errors.push('confidence_below_high');
  return { valid: errors.length === 0, errors };
}

export function chooseBestEvidence(evidenceList, domain) {
  const reviewed = evidenceList
    .map((evidence) => ({ evidence, validation: validateAddressEvidence(evidence, domain) }))
    .filter((item) => item.validation.valid);

  reviewed.sort((a, b) => {
    if (a.evidence.sourceUrl !== b.evidence.sourceUrl) {
      return a.evidence.sourceUrl.localeCompare(b.evidence.sourceUrl);
    }
    return a.evidence.address.localeCompare(b.evidence.address);
  });

  return reviewed[0] || null;
}

export function mergeSentence(existing, sentence) {
  const current = String(existing || '').trim();
  const next = String(sentence || '').trim();
  if (!next) return current;
  if (!current) return next;
  if (current.includes(next)) return current;
  return `${current} ${next}`.trim();
}

export function ensureNonprofitAccessibilitySchema(db) {
  const columns = db.prepare(`PRAGMA table_info(nonprofit_organizations)`).all().map((row) => row.name);
  if (!columns.includes('accessibility_evidence_level')) {
    db.exec(`ALTER TABLE nonprofit_organizations ADD COLUMN accessibility_evidence_level TEXT;`);
  }
  if (!columns.includes('accessibility_source_address')) {
    db.exec(`ALTER TABLE nonprofit_organizations ADD COLUMN accessibility_source_address TEXT;`);
  }
}

export function classifyDomain(rows, domain) {
  const normalizedNames = new Set(rows.map((row) => normalizeName(row.name)).filter(Boolean));
  const states = new Set(rows.map((row) => row.state_id).filter(Boolean));
  const counties = new Set(rows.map((row) => row.county_id).filter(Boolean));
  const warnings = [];
  const host = String(domain || '').toLowerCase();
  let domainType = 'single_org_domain';

  const cueMatch = ['arc', 'parentcenter', 'directory', 'network', 'affiliate', 'chapter', 'hub'].some((token) => host.includes(token));
  if (normalizedNames.size > 5 || states.size > 2 || cueMatch) {
    domainType = 'aggregator_or_network';
    warnings.push('aggregator_or_network_domain');
  } else if (counties.size > 25 && normalizedNames.size <= 2 && states.size === 1) {
    domainType = 'statewide_org_service_area';
    warnings.push('statewide_many_county_service_area');
  }

  return {
    domainType,
    normalizedNameCount: normalizedNames.size,
    stateCount: states.size,
    countyCount: counties.size,
    warnings,
  };
}

export function classifyRowSemantics(row, stats, domainInfo) {
  const normalizedName = normalizeName(row.name);
  const duplicatesInCounty = stats.byCountyName.get(`${row.county_id}::${normalizedName}`) || 0;
  const countForName = stats.byName.get(normalizedName) || 0;

  if (domainInfo.domainType === 'aggregator_or_network') return 'aggregator_or_network_record';
  if (duplicatesInCounty > 1) return 'duplicate_normalized_record';
  if (countForName > 1) return 'county_service_area_record';
  if (countForName === 1) return 'physical_service_location_record';
  return 'organization_level_record';
}

export function buildRowStats(rows) {
  const byName = new Map();
  const byCountyName = new Map();
  for (const row of rows) {
    const normalizedName = normalizeName(row.name);
    byName.set(normalizedName, (byName.get(normalizedName) || 0) + 1);
    byCountyName.set(`${row.county_id}::${normalizedName}`, (byCountyName.get(`${row.county_id}::${normalizedName}`) || 0) + 1);
  }
  return { byName, byCountyName };
}

export function classifyRowEvidenceLevel({ rowType, evidence, row, domainInfo, evidenceCount, rowCount }) {
  const warnings = [];
  if (domainInfo.domainType === 'aggregator_or_network') {
    warnings.push('network_domain_requires_special_mode');
    return { evidenceLevel: 'national_or_network_directory', warnings };
  }
  if (evidenceCount <= 1 && rowCount > 1) {
    warnings.push('many_to_one_evidence');
  }
  if (rowType === 'duplicate_normalized_record') {
    warnings.push('duplicate_normalized_record');
    return { evidenceLevel: 'ambiguous_address_evidence', warnings };
  }
  if (rowType === 'county_service_area_record' && domainInfo.stateCount === 1 && domainInfo.countyCount > 1) {
    warnings.push('county_rows_share_one_org_address');
    return { evidenceLevel: 'statewide_service_area', warnings };
  }
  if (rowType === 'county_service_area_record') {
    warnings.push('org_address_not_local_county_confirmation');
    return { evidenceLevel: 'organization_physical_address', warnings };
  }
  if (rowType === 'physical_service_location_record' && evidence.baseEvidenceLevel === 'organization_physical_address') {
    return { evidenceLevel: 'service_location_address', warnings };
  }
  if (rowType === 'physical_service_location_record') {
    return { evidenceLevel: evidence.baseEvidenceLevel, warnings };
  }
  if (rowType === 'organization_level_record') {
    return { evidenceLevel: 'organization_physical_address', warnings };
  }
  return { evidenceLevel: 'ambiguous_address_evidence', warnings: warnings.concat('ambiguous_row_semantics') };
}

export function buildPublicSafeWording({ evidenceLevel, row, evidence }) {
  const countyLabel = String(row.county_name || row.county_id || 'this county');
  if (evidenceLevel === 'service_location_address') {
    return `First-party site lists a physical office at ${evidence.address}.`;
  }
  if (evidenceLevel === 'county_specific_location') {
    return `First-party site lists a county-specific location at ${evidence.address}.`;
  }
  if (evidenceLevel === 'statewide_service_area') {
    return `Organization lists a physical office at ${evidence.address} and appears to serve families statewide; this does not confirm an in-person office in ${countyLabel}.`;
  }
  if (evidenceLevel === 'organization_physical_address') {
    return `Organization lists a physical office at ${evidence.address}; this does not confirm a local in-person office in ${countyLabel}.`;
  }
  if (evidenceLevel === 'national_or_network_directory') {
    return `Source domain appears to represent a network or affiliate directory; this address does not confirm a local office for ${countyLabel}.`;
  }
  return `Address found on the first-party site (${evidence.address}), but local in-person service coverage is not confirmed for ${countyLabel}.`;
}

export function buildNonprofitMutationPlan({ row, rowType, evidenceLevel, evidence, warnings, domainInfo, args, rowCount }) {
  const qualityParts = [
    'nonprofit_accessibility_batch_v2',
    `evidence=first_party_address`,
    `level=${evidenceLevel}`,
    `row_type=${rowType}`,
    `confidence=${evidence.confidence}`,
    `fetched_at=${evidence.fetchedAt}`,
    `source_url=${evidence.sourceUrl}`,
  ];
  if (warnings.length > 0) qualityParts.push(`warnings=${warnings.join('|')}`);
  if (rowCount > 50) qualityParts.push('bulk_org_level_promotion');

  const publicNote = buildPublicSafeWording({ evidenceLevel, row, evidence });
  const fields = {
    accessibility_notes: publicNote,
    data_quality_notes: mergeSentence(row.data_quality_notes, qualityParts.join(' ')),
    checked_at: evidence.fetchedAt,
    accessibility_evidence_level: evidenceLevel,
    accessibility_source_address: evidence.address,
  };

  let action = 'record_org_level_evidence';
  let setInPersonServices = 0;
  let warningReasons = [...warnings];

  if (LOCAL_IN_PERSON_LEVELS.has(evidenceLevel)) {
    action = 'promote_local_in_person';
    setInPersonServices = 1;
  } else if (NETWORK_LEVELS.has(evidenceLevel)) {
    action = 'skip_network_domain';
    warningReasons.push('network_domain_requires_special_mode');
  } else if (ORG_LEVEL_LEVELS.has(evidenceLevel)) {
    action = rowCount > 50 ? 'bulk_org_level_promotion' : 'record_org_level_evidence';
    setInPersonServices = 0;
  } else {
    action = 'record_ambiguous_evidence';
    setInPersonServices = 0;
  }

  if (domainInfo.domainType === 'aggregator_or_network' && !args.allowNetworkDomain) {
    action = 'skip_network_domain';
    setInPersonServices = 0;
  }

  if (rowCount > 50 && ORG_LEVEL_LEVELS.has(evidenceLevel) && !args.dryRun && !args.allowBulkOrgLevel) {
    action = 'bulk_org_level_promotion';
  }

  fields.in_person_services = setInPersonServices;

  return {
    action,
    fields,
    warningReasons,
    publicNote,
  };
}

export async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPage(url, { fixtureManifest, maxRetries, rateLimitMs, userAgent }) {
  const normalizedUrl = normalizeUrl(url);
  if (fixtureManifest.has(normalizedUrl)) {
    const filePath = fixtureManifest.get(normalizedUrl);
    return {
      ok: true,
      url: normalizedUrl,
      finalUrl: normalizedUrl,
      status: 200,
      fetchedAt: new Date().toISOString(),
      html: fs.readFileSync(filePath, 'utf8'),
      mode: 'fixture',
    };
  }

  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      if (attempt > 0) await sleep(rateLimitMs * attempt);
      const response = await fetch(normalizedUrl, {
        headers: {
          'user-agent': userAgent || DEFAULT_USER_AGENT,
          'accept-language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(DEFAULT_FETCH_TIMEOUT_MS),
      });
      const html = await response.text();
      return {
        ok: response.ok,
        url: normalizedUrl,
        finalUrl: normalizeUrl(response.url || normalizedUrl),
        status: response.status,
        fetchedAt: new Date().toISOString(),
        html,
        mode: 'network',
      };
    } catch (error) {
      lastError = error;
    }
  }

  return {
    ok: false,
    url: normalizedUrl,
    finalUrl: normalizedUrl,
    status: null,
    fetchedAt: new Date().toISOString(),
    html: '',
    mode: 'network',
    error: lastError ? String(lastError.message || lastError) : 'unknown_fetch_error',
  };
}

export async function crawlFirstPartyDomain({ domain, seedUrls, artifactDir, fixtureManifest, maxPages, maxRetries, rateLimitMs, userAgent }) {
  const rawDir = path.join(artifactDir, 'raw');
  ensureDir(rawDir);
  const queue = [...buildSeedUrls(domain, seedUrls)];
  const seen = new Set();
  const pages = [];
  const failures = [];

  while (queue.length > 0 && pages.length < maxPages) {
    const nextUrl = queue.shift();
    if (!nextUrl || seen.has(nextUrl)) continue;
    seen.add(nextUrl);

    const fetched = await fetchPage(nextUrl, { fixtureManifest, maxRetries, rateLimitMs, userAgent });
    if (!fetched.ok || !isFirstPartyUrl(fetched.finalUrl, domain)) {
      failures.push({
        url: fetched.url,
        finalUrl: fetched.finalUrl,
        fetchedAt: fetched.fetchedAt,
        status: fetched.status,
        error: fetched.error || (!fetched.ok ? 'non_200_response' : 'redirected_off_domain'),
      });
      continue;
    }

    const fileBase = `${String(pages.length + 1).padStart(3, '0')}-${slugify(new URL(fetched.finalUrl).pathname || 'home') || 'home'}`;
    const rawPath = path.join(rawDir, `${fileBase}.html`);
    fs.writeFileSync(rawPath, fetched.html);

    const links = extractInternalLinks(fetched.html, fetched.finalUrl, domain);
    for (const link of links) {
      if (!seen.has(link) && !queue.includes(link) && queue.length + pages.length < maxPages * 4) {
        queue.push(link);
      }
    }

    pages.push({
      url: fetched.finalUrl,
      fetchedAt: fetched.fetchedAt,
      status: fetched.status,
      mode: fetched.mode,
      rawPath,
      linkCount: links.length,
    });

    await sleep(rateLimitMs);
  }

  return { pages, failures };
}

export function summarizeSkipReasons(items) {
  const counts = {};
  for (const item of items) {
    const reason = item.reason || 'unknown';
    counts[reason] = (counts[reason] || 0) + 1;
  }
  return counts;
}
