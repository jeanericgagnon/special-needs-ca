import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  countyV5: path.join(generatedDir, 'tx_county_baseline_v5.jsonl'),
  directSourcesV5: path.join(generatedDir, 'tx_education_direct_district_sources_v5.jsonl'),
  summaryV5: path.join(generatedDir, 'tx_verification_summary_v5.json'),
  failureV5: path.join(generatedDir, 'tx_failure_ledger_v5.jsonl'),
  asktedCsvV3: path.join(generatedDir, 'tx_askted_directory_v3.csv'),
};

const OUTPUTS = {
  reportV6: path.join(docsDir, 'tx-final-district-education-cleanup-report-v6.md'),
  directSourcesV6: path.join(generatedDir, 'tx_education_direct_district_sources_v6.jsonl'),
  countyV6: path.join(generatedDir, 'tx_county_baseline_v6.jsonl'),
  summaryV6: path.join(generatedDir, 'tx_verification_summary_v6.json'),
  failureV6: path.join(generatedDir, 'tx_failure_ledger_v6.jsonl'),
  nextActionV6: path.join(generatedDir, 'tx_next_action_queue_v6.jsonl'),
};

const USER_AGENT = 'Ablefull Texas district-grade cleanup/1.0 (+https://ablefull.com)';
const FETCH_TIMEOUT_MS = 8000;
const COUNTY_CONCURRENCY = 6;
const MAX_FETCHES_PER_DISTRICT = 20;
const MAX_SEARCH_QUERIES_PER_COUNTY = 2;

const DISTRICT_PATH_CANDIDATES = [
  '/special-education',
  '/specialeducation',
  '/special-ed',
  '/special-services',
  '/specialservices',
  '/special-programs',
  '/specialprograms',
  '/student-services',
  '/studentservices',
  '/departments/special-education',
  '/departments/special-services',
  '/departments/student-services',
  '/programs/special-education',
  '/services/special-education',
  '/academics/special-education',
  '/page/special-education',
  '/apps/pages/specialeducation',
  '/apps/pages/specialed',
  '/apps/pages/special-services',
  '/apps/pages/special-programs',
  '/vnews/display.v/SEC/Departments%7CSpecial%20Education',
  '/vnews/display.v/SEC/Administration%7CSpecial%20Education',
  '/page/sped.home',
  '/page/SPR.Home',
  '/page/special.programs.home',
  '/page/specialeducation',
  '/special-education-information',
  '/child-find',
  '/childfind',
  '/child-find-notice',
  '/child-find-information',
  '/dyslexia',
  '/section-504',
  '/section504',
  '/ard',
  '/iep',
];

const HOMEPAGE_DISCOVERY_TERMS = [
  'special',
  'education',
  'services',
  'programs',
  'department',
  'child',
  'find',
  'dyslexia',
  'section 504',
  'student support',
  'intervention',
  'sped',
];

const TERM_PATTERNS = [
  { label: 'special education', regex: /\bspecial education\b/i, strength: 'strong' },
  { label: 'special services', regex: /\bspecial services\b/i, strength: 'strong' },
  { label: 'child find', regex: /\bchild find\b/i, strength: 'strong' },
  { label: 'dyslexia', regex: /\bdyslexia\b/i, strength: 'strong' },
  { label: 'section 504', regex: /\bsection\s*504\b/i, strength: 'strong' },
  { label: 'iep', regex: /\bIEP\b/i, strength: 'strong' },
  { label: 'ard committee', regex: /\bARD committee\b/i, strength: 'strong' },
  { label: 'admission review dismissal', regex: /\badmission, review, and dismissal\b/i, strength: 'strong' },
  { label: 'special needs', regex: /\bspecial needs\b/i, strength: 'strong' },
  { label: 'student services', regex: /\bstudent services\b/i, strength: 'weak' },
  { label: 'student support', regex: /\bstudent support\b/i, strength: 'weak' },
  { label: 'intervention', regex: /\bintervention\b/i, strength: 'weak' },
  { label: 'special programs', regex: /\bspecial programs\b/i, strength: 'conditional' },
];

const BAD_MARKERS = ['404', 'page not found', 'file not found', 'access denied', 'forbidden', 'just a moment'];
const FORBIDDEN_EDUCATION_PAGE_PATTERNS = [
  /\bboard of trustees\b/i,
  /\bschool board\b/i,
  /\bboard meeting\b/i,
  /\bboard policy\b/i,
  /\bboard policies\b/i,
  /\bagenda\b/i,
  /\bminutes\b/i,
  /\bemployment\b/i,
  /\bcalendar\b/i,
  /\bathletics\b/i,
  /\bmaintenance\b/i,
  /\btax\b/i,
  /\belection\b/i,
];
const GENERAL_PROGRAMS_PATTERNS = [
  /\blunch\b/i,
  /\btesting\b/i,
  /\btransportation\b/i,
  /\bcareer\b/i,
  /\bcte\b/i,
  /\bathletics\b/i,
];

function nowIso() {
  return new Date().toISOString();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift() || [];
  return rows.filter((cols) => cols.some((value) => value !== '')).map((cols) => {
    const obj = {};
    for (let i = 0; i < headers.length; i += 1) obj[headers[i]] = cols[i] || '';
    return obj;
  });
}

function normalizeCountyName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\bcounty\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normalizeHost(host) {
  return String(host || '').toLowerCase().replace(/^www\./, '');
}

function normalizeUrl(raw) {
  if (!raw) return '';
  let url = String(raw).trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) parsed.port = '';
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return '';
  }
}

function pathJoin(baseUrl, pathname) {
  try {
    return new URL(pathname, `${baseUrl}/`).toString();
  } catch {
    return '';
  }
}

function urlOrigin(value) {
  try {
    return new URL(value).origin;
  } catch {
    return normalizeUrl(value);
  }
}

function sanitizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function evidenceTermsFound(blob) {
  const text = sanitizeText(blob);
  return TERM_PATTERNS.filter((item) => item.regex.test(text)).map((item) => item.label);
}

function sameDomainFamily(a, b) {
  return a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);
}

function hasBadMarker(blob) {
  const text = sanitizeText(blob).toLowerCase();
  return BAD_MARKERS.some((term) => text.includes(term));
}

function hasForbiddenEducationSignals(blob) {
  const text = sanitizeText(blob);
  return FORBIDDEN_EDUCATION_PAGE_PATTERNS.some((pattern) => pattern.test(text));
}

function isDistrictTypePreferred(value) {
  const text = String(value || '').toUpperCase();
  return text.includes('INDEPENDENT') || text.includes('COMMON') || text.includes('MUNICIPAL');
}

function countBy(rows, keyFn) {
  const counts = {};
  for (const row of rows) {
    const key = keyFn(row) || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

async function fetchWithCache(url, cache) {
  const normalized = normalizeUrl(url);
  if (!normalized) {
    return { ok: false, url, finalUrl: url, status: 0, contentType: '', text: '', title: '', headings: [], snippet: '', fetchedAt: nowIso(), error: 'invalid_url' };
  }
  if (cache.has(normalized)) return cache.get(normalized);
  const pending = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(normalized, {
        headers: {
          'user-agent': USER_AGENT,
          'accept-language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
        signal: controller.signal,
      });
      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      const $ = cheerio.load(text);
      const title = sanitizeText($('title').first().text());
      const headings = $('h1, h2').toArray().map((el) => sanitizeText($(el).text())).filter(Boolean).slice(0, 8);
      const bodyText = sanitizeText($('body').text()).slice(0, 6000);
      return {
        ok: response.ok,
        url: normalized,
        finalUrl: response.url || normalized,
        status: response.status,
        contentType,
        text,
        title,
        headings,
        snippet: bodyText.slice(0, 500),
        fetchedAt: nowIso(),
        error: null,
      };
    } catch (error) {
      return {
        ok: false,
        url: normalized,
        finalUrl: normalized,
        status: 0,
        contentType: '',
        text: '',
        title: '',
        headings: [],
        snippet: '',
        fetchedAt: nowIso(),
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      clearTimeout(timer);
    }
  })();
  cache.set(normalized, pending);
  return pending;
}

function districtCandidatesByCounty(csvRows) {
  const byCounty = new Map();
  for (const row of csvRows) {
    const countyName = String(row['County Name'] || '').trim();
    const key = normalizeCountyName(countyName);
    if (!byCounty.has(key)) byCounty.set(key, new Map());
    const districtName = sanitizeText(row['District Name']);
    const districtNumber = sanitizeText(String(row['District Number'] || '').replace(/^'+/, ''));
    const website = normalizeUrl(row['District Web Page Address']);
    const candidateKey = `${districtNumber}|${districtName}`;
    const existing = byCounty.get(key).get(candidateKey);
    const candidate = {
      county_name: countyName,
      district_id: districtNumber,
      district_name: districtName,
      district_type: sanitizeText(row['District Type']),
      esc_region: sanitizeText(String(row['ESC Region Served'] || '').replace(/^'+/, '')),
      district_homepage: website,
      district_phone: sanitizeText(row['District Phone']),
      district_email: sanitizeText(row['District Email Address']),
    };
    if (!existing || (!existing.district_homepage && candidate.district_homepage)) {
      byCounty.get(key).set(candidateKey, candidate);
    }
  }
  const result = new Map();
  for (const [countyKey, districtMap] of byCounty.entries()) {
    const list = [...districtMap.values()];
    list.sort((a, b) => {
      const aWebsite = a.district_homepage ? 1 : 0;
      const bWebsite = b.district_homepage ? 1 : 0;
      if (aWebsite !== bWebsite) return bWebsite - aWebsite;
      const aPreferred = isDistrictTypePreferred(a.district_type) ? 1 : 0;
      const bPreferred = isDistrictTypePreferred(b.district_type) ? 1 : 0;
      if (aPreferred !== bPreferred) return bPreferred - aPreferred;
      return a.district_name.localeCompare(b.district_name);
    });
    result.set(countyKey, list);
  }
  return result;
}

function extractHomepageLinks(fetchResult, districtHost) {
  if (!fetchResult.ok || !/html/i.test(fetchResult.contentType)) return [];
  const $ = cheerio.load(fetchResult.text);
  const links = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = sanitizeText($(el).text());
    const absolute = normalizeUrl(pathJoin(fetchResult.finalUrl, href));
    if (!absolute) return;
    try {
      const host = normalizeHost(new URL(absolute).hostname);
      if (!sameDomainFamily(host, districtHost)) return;
      const blob = `${text} ${href}`.toLowerCase();
      if (!HOMEPAGE_DISCOVERY_TERMS.some((term) => blob.includes(term.replace(/\s+/g, '-')) || blob.includes(term.replace(/\s+/g, '')) || blob.includes(term))) return;
      links.push({ url: absolute, text });
    } catch {
      // ignore malformed links
    }
  });
  return links.slice(0, 8);
}

function classifyEvidence(result) {
  const blob = sanitizeText(`${result.title} ${result.headings.join(' ')} ${result.snippet}`);
  const terms = evidenceTermsFound(blob);
  if (hasBadMarker(blob)) {
    return { status: 'reject', reason: 'source_fetch_failed', terms };
  }
  if (hasForbiddenEducationSignals(`${result.finalUrl} ${blob}`)) {
    return { status: 'reject', reason: 'special_education_page_missing', terms };
  }
  if (terms.length === 0) {
    return { status: 'reject', reason: 'special_education_page_missing', terms };
  }
  const strongTerms = terms.filter((term) => !['student services', 'student support', 'intervention', 'special programs'].includes(term));
  const hasStudentSupportBridge = /student support services?/i.test(blob) && /special education|section\s*504|child find|dyslexia|iep|ard committee/i.test(blob);
  const specialProgramsOnly = terms.every((term) => term === 'special programs') || (terms.includes('special programs') && strongTerms.length === 0 && !hasStudentSupportBridge);
  if (specialProgramsOnly && GENERAL_PROGRAMS_PATTERNS.some((pattern) => pattern.test(blob))) {
    return { status: 'weak', reason: 'special_education_page_missing', terms };
  }
  if (strongTerms.length > 0 || hasStudentSupportBridge) {
    return { status: 'verified', reason: '', terms };
  }
  if (terms.includes('student services') || terms.includes('student support') || terms.includes('intervention') || terms.includes('special programs')) {
    return { status: 'weak', reason: 'weak_student_services_only', terms };
  }
  return { status: 'reject', reason: 'special_education_page_missing', terms };
}

function extractSearchResultUrl(rawHref) {
  const normalized = normalizeUrl(rawHref);
  if (normalized) return normalized;
  try {
    const url = new URL(rawHref, 'https://duckduckgo.com');
    const uddg = url.searchParams.get('uddg');
    return uddg ? normalizeUrl(decodeURIComponent(uddg)) : '';
  } catch {
    return '';
  }
}

async function searchFallbackCandidates(candidate, searchCache, usedQueries, searchLog) {
  const candidates = [];
  if (!candidate.district_homepage) return candidates;
  const homepageHost = normalizeHost(new URL(candidate.district_homepage).hostname);
  const queries = [
    `"${candidate.district_name}" special education`,
    `"${candidate.district_name}" child find`,
  ];
  for (const query of queries) {
    if (usedQueries.count >= MAX_SEARCH_QUERIES_PER_COUNTY) break;
    usedQueries.count += 1;
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const page = await fetchWithCache(searchUrl, searchCache);
    searchLog.push({ query, url: searchUrl, status: page.status, fetched_at: page.fetchedAt });
    if (!page.ok || !/html/i.test(page.contentType)) continue;
    const $ = cheerio.load(page.text);
    $('a[href]').each((_, el) => {
      if (candidates.length >= 8) return;
      const href = $(el).attr('href') || '';
      const text = sanitizeText($(el).text());
      const absolute = extractSearchResultUrl(href);
      if (!absolute) return;
      try {
        const host = normalizeHost(new URL(absolute).hostname);
        if (!sameDomainFamily(host, homepageHost)) return;
        if (/duckduckgo|askted|tealprod\.tea\.state\.tx\.us|tea\.texas\.gov/i.test(absolute)) return;
        candidates.push({ url: absolute, method: 'search_fallback', text, query });
      } catch {
        // ignore malformed search results
      }
    });
  }
  return candidates;
}

async function inspectDistrictCandidate(candidate, fetchCache, searchCache, usedQueries, searchLog) {
  const tried = [];
  const failures = [];
  if (!candidate.district_homepage) {
    return {
      verification_status: 'blocked',
      evidence_quality: 'homepage_only',
      failure_reason: 'district_homepage_missing',
      tried,
      failures,
      search_queries: [],
    };
  }

  const homepage = await fetchWithCache(candidate.district_homepage, fetchCache);
  tried.push(homepage.finalUrl || candidate.district_homepage);
  if (!homepage.ok) {
    return {
      verification_status: 'blocked',
      evidence_quality: 'broken',
      failure_reason: 'district_homepage_broken',
      tried,
      failures: [...failures, { url: candidate.district_homepage, reason: 'district_homepage_broken' }],
      search_queries: [],
    };
  }

  const homepageHost = normalizeHost(new URL(homepage.finalUrl || candidate.district_homepage).hostname);
  const fetchQueue = [];
  const seen = new Set();
  const pushCandidate = (url, method, meta = {}) => {
    const normalized = normalizeUrl(url);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    fetchQueue.push({ url: normalized, method, ...meta });
  };

  for (const link of extractHomepageLinks(homepage, homepageHost)) pushCandidate(link.url, 'homepage_link');
  pushCandidate(pathJoin(candidate.district_homepage, '/sitemap.xml'), 'sitemap');
  for (const pathname of DISTRICT_PATH_CANDIDATES) pushCandidate(pathJoin(candidate.district_homepage, pathname), 'path_guess');

  let fetches = 1;
  let weakResult = null;
  let homepageOnlyResult = null;
  const homepageBlob = sanitizeText(`${homepage.title} ${homepage.headings.join(' ')} ${homepage.snippet}`);
  const homepageTerms = evidenceTermsFound(homepageBlob);
  if (homepageTerms.length > 0 && !hasBadMarker(homepageBlob) && !hasForbiddenEducationSignals(homepageBlob)) {
    homepageOnlyResult = {
      source_url: candidate.district_homepage,
      final_url: homepage.finalUrl,
      http_status: homepage.status,
      fetched_at: homepage.fetchedAt,
      evidence_snippet: homepageBlob.slice(0, 320),
      evidence_terms_found: homepageTerms,
      verification_status: 'partial',
      failure_reason: 'homepage_only',
      discovery_method: 'homepage_only',
      evidence_quality: 'homepage_only',
    };
  }

  while (fetchQueue.length && fetches < MAX_FETCHES_PER_DISTRICT) {
    const job = fetchQueue.shift();
    const result = await fetchWithCache(job.url, fetchCache);
    fetches += 1;
    tried.push(result.finalUrl || job.url);

    if (job.method === 'sitemap' && result.ok && /xml/i.test(result.contentType)) {
      const urls = [...result.text.matchAll(/<loc>([^<]+)<\/loc>/gi)]
        .map((m) => normalizeUrl(m[1]))
        .filter(Boolean)
        .filter((url) => {
          try {
            return sameDomainFamily(normalizeHost(new URL(url).hostname), homepageHost);
          } catch {
            return false;
          }
        })
        .filter((url) => HOMEPAGE_DISCOVERY_TERMS.some((term) => url.toLowerCase().includes(term.replace(/\s+/g, '-')) || url.toLowerCase().includes(term.replace(/\s+/g, ''))))
        .slice(0, 10);
      for (const url of urls) pushCandidate(url, 'sitemap');
      continue;
    }

    if (!result.ok) {
      failures.push({ url: job.url, reason: 'source_fetch_failed' });
      continue;
    }

    const finalHost = normalizeHost(new URL(result.finalUrl).hostname);
    if (!sameDomainFamily(finalHost, homepageHost)) {
      failures.push({ url: job.url, reason: 'district_site_blocked' });
      continue;
    }

    const classification = classifyEvidence(result);
    if (classification.status === 'verified') {
      return {
        verification_status: 'verified',
        evidence_quality: 'direct_district_grade',
        failure_reason: '',
        tried,
        failures,
        search_queries: searchLog,
        source_url: job.url,
        final_url: result.finalUrl,
        http_status: result.status,
        fetched_at: result.fetchedAt,
        evidence_snippet: sanitizeText(`${result.title} ${result.headings.join(' ')} ${result.snippet}`).slice(0, 320),
        evidence_terms_found: classification.terms,
        discovery_method: job.method,
      };
    }
    if (classification.status === 'weak' && !weakResult) {
      weakResult = {
        source_url: job.url,
        final_url: result.finalUrl,
        http_status: result.status,
        fetched_at: result.fetchedAt,
        evidence_snippet: sanitizeText(`${result.title} ${result.headings.join(' ')} ${result.snippet}`).slice(0, 320),
        evidence_terms_found: classification.terms,
        verification_status: 'partial',
        failure_reason: classification.reason,
        discovery_method: job.method,
        evidence_quality: 'weak_student_services',
      };
    } else if (classification.status === 'reject') {
      failures.push({ url: job.url, reason: classification.reason });
    }
  }

  if (usedQueries.count < MAX_SEARCH_QUERIES_PER_COUNTY) {
    const searchCandidates = await searchFallbackCandidates(candidate, searchCache, usedQueries, searchLog);
    for (const job of searchCandidates) {
      if (fetches >= MAX_FETCHES_PER_DISTRICT) break;
      pushCandidate(job.url, 'search_fallback', { query: job.query });
    }
    while (fetchQueue.length && fetches < MAX_FETCHES_PER_DISTRICT) {
      const job = fetchQueue.shift();
      if (job.method !== 'search_fallback') continue;
      const result = await fetchWithCache(job.url, fetchCache);
      fetches += 1;
      tried.push(result.finalUrl || job.url);

      if (!result.ok) {
        failures.push({ url: job.url, reason: 'source_fetch_failed' });
        continue;
      }

      const finalHost = normalizeHost(new URL(result.finalUrl).hostname);
      if (!sameDomainFamily(finalHost, homepageHost)) {
        failures.push({ url: job.url, reason: 'district_site_blocked' });
        continue;
      }

      const classification = classifyEvidence(result);
      if (classification.status === 'verified') {
        return {
          verification_status: 'verified',
          evidence_quality: 'direct_district_grade',
          failure_reason: '',
          tried,
          failures,
          search_queries: searchLog,
          source_url: job.url,
          final_url: result.finalUrl,
          http_status: result.status,
          fetched_at: result.fetchedAt,
          evidence_snippet: sanitizeText(`${result.title} ${result.headings.join(' ')} ${result.snippet}`).slice(0, 320),
          evidence_terms_found: classification.terms,
          discovery_method: 'search_fallback',
        };
      }
      if (classification.status === 'weak' && !weakResult) {
        weakResult = {
          source_url: job.url,
          final_url: result.finalUrl,
          http_status: result.status,
          fetched_at: result.fetchedAt,
          evidence_snippet: sanitizeText(`${result.title} ${result.headings.join(' ')} ${result.snippet}`).slice(0, 320),
          evidence_terms_found: classification.terms,
          verification_status: 'partial',
          failure_reason: classification.reason,
          discovery_method: 'search_fallback',
          evidence_quality: 'weak_student_services',
        };
      } else if (classification.status === 'reject') {
        failures.push({ url: job.url, reason: classification.reason });
      }
    }
  }

  if (weakResult) {
    return {
      ...weakResult,
      tried,
      failures: [...failures, { url: weakResult.final_url, reason: weakResult.failure_reason }],
      search_queries: searchLog,
    };
  }
  if (homepageOnlyResult) {
    return {
      ...homepageOnlyResult,
      tried,
      failures: [...failures, { url: homepageOnlyResult.final_url, reason: 'homepage_only' }],
      search_queries: searchLog,
    };
  }
  return {
    verification_status: 'blocked',
    evidence_quality: 'fallback_only',
    failure_reason: searchLog.length > 0 ? 'search_fallback_exhausted' : (
      failures.some((item) => item.reason === 'district_homepage_broken')
        ? 'district_homepage_broken'
        : (failures.some((item) => item.reason === 'district_site_blocked') ? 'district_site_blocked' : 'special_education_page_missing')
    ),
    tried,
    failures,
    search_queries: searchLog,
  };
}

function buildFailureLedgerEntry(county, candidatesTried, urlsTried, reason, category, searchQueries = []) {
  return {
    county_slug: county.county_slug,
    district_candidates_tried: candidatesTried,
    urls_tried: urlsTried,
    search_queries: searchQueries,
    reason,
    category,
  };
}

async function buildV6Education(partialCounties, directSourcesV5, askTedByCounty, fetchCache, searchCache) {
  const results = [];
  const failureLedger = [];
  let completed = 0;

  async function processCounty(county) {
    const candidates = (askTedByCounty.get(normalizeCountyName(county.county_name)) || [])
      .filter((candidate) => candidate.district_homepage);
    let verified = null;
    let bestPartial = null;
    const candidatesTried = [];
    const urlsTried = [];
    const usedQueries = { count: 0 };
    const countySearchLog = [];

    for (const candidate of candidates) {
      const inspection = await inspectDistrictCandidate(candidate, fetchCache, searchCache, usedQueries, countySearchLog);
      candidatesTried.push({
        district_id: candidate.district_id,
        district_name: candidate.district_name,
        district_homepage: candidate.district_homepage,
        result: inspection.verification_status,
        reason: inspection.failure_reason || '',
      });
      urlsTried.push(...inspection.tried);
      if (inspection.verification_status === 'verified') {
        verified = { candidate, inspection };
        break;
      }
      if (!bestPartial && (inspection.verification_status === 'partial' || inspection.verification_status === 'blocked')) {
        bestPartial = { candidate, inspection };
      }
    }

    if (verified) {
      return {
        directSource: {
          state: 'texas',
          county_slug: county.county_slug,
          county_name: county.county_name,
          district_id: verified.candidate.district_id,
          district_name: verified.candidate.district_name,
          district_type: verified.candidate.district_type,
          esc_region: verified.candidate.esc_region,
          district_homepage: urlOrigin(verified.inspection.final_url || verified.candidate.district_homepage),
          source_url: verified.inspection.source_url,
          final_url: verified.inspection.final_url,
          fetched_at: verified.inspection.fetched_at,
          http_status: verified.inspection.http_status,
          evidence_snippet: verified.inspection.evidence_snippet,
          evidence_terms_found: verified.inspection.evidence_terms_found,
          verification_status: 'verified',
          failure_reason: '',
          discovery_method: verified.inspection.discovery_method,
          evidence_quality: 'direct_district_grade',
        },
        failure: null,
      };
    }

    const fallback = bestPartial || {
      candidate: candidates[0] || {
        district_id: '',
        district_name: '',
        district_type: '',
        esc_region: '',
        district_homepage: '',
      },
      inspection: {
        verification_status: 'blocked',
        failure_reason: candidates.length === 0 ? 'district_homepage_broken' : 'special_education_page_missing',
        evidence_quality: candidates.length === 0 ? 'broken' : 'fallback_only',
        source_url: candidates[0]?.district_homepage || '',
        final_url: candidates[0]?.district_homepage || '',
        fetched_at: nowIso(),
        http_status: 0,
        evidence_snippet: '',
        evidence_terms_found: [],
        discovery_method: 'path_guess',
        search_queries: countySearchLog,
      },
    };

    const categoryMap = {
      district_homepage_missing: 'district_homepage_broken',
      district_homepage_broken: 'district_homepage_broken',
      district_site_blocked: 'district_site_blocked',
      weak_student_services_only: 'weak_student_services_only',
      homepage_only: 'homepage_only',
      special_education_page_missing: 'special_education_page_missing',
      source_fetch_failed: 'source_fetch_failed',
      search_fallback_exhausted: 'search_fallback_exhausted',
    };

    return {
      directSource: {
        state: 'texas',
        county_slug: county.county_slug,
        county_name: county.county_name,
        district_id: fallback.candidate.district_id,
        district_name: fallback.candidate.district_name,
        district_type: fallback.candidate.district_type,
        esc_region: fallback.candidate.esc_region,
        district_homepage: urlOrigin(fallback.inspection.final_url || fallback.candidate.district_homepage),
        source_url: fallback.inspection.source_url || fallback.candidate.district_homepage,
        final_url: fallback.inspection.final_url || fallback.candidate.district_homepage,
        fetched_at: fallback.inspection.fetched_at,
        http_status: fallback.inspection.http_status,
        evidence_snippet: fallback.inspection.evidence_snippet || '',
        evidence_terms_found: fallback.inspection.evidence_terms_found || [],
        verification_status: 'partial',
        failure_reason: fallback.inspection.failure_reason || 'search_fallback_exhausted',
        discovery_method: fallback.inspection.discovery_method || 'path_guess',
        evidence_quality: fallback.inspection.evidence_quality || 'fallback_only',
      },
      failure: buildFailureLedgerEntry(
        county,
        candidatesTried,
        [...new Set(urlsTried)],
        fallback.inspection.failure_reason || 'search_fallback_exhausted',
        categoryMap[fallback.inspection.failure_reason] || 'search_fallback_exhausted',
        countySearchLog,
      ),
    };
  }

  const queue = [...partialCounties];
  async function worker() {
    while (queue.length) {
      const county = queue.shift();
      if (!county) break;
      const outcome = await processCounty(county);
      results.push(outcome.directSource);
      if (outcome.failure) failureLedger.push(outcome.failure);
      completed += 1;
      if (completed % 10 === 0 || completed === partialCounties.length) {
        console.log(`tx-v6 progress ${completed}/${partialCounties.length}`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(COUNTY_CONCURRENCY, partialCounties.length || 1) }, () => worker()));

  const passthrough = directSourcesV5
    .filter((row) => !partialCounties.some((county) => county.county_slug === row.county_slug))
    .map((row) => ({ ...row }));

  return {
    directSources: [...passthrough, ...results].sort((a, b) => a.county_slug.localeCompare(b.county_slug)),
    failureLedger: failureLedger.sort((a, b) => a.county_slug.localeCompare(b.county_slug)),
  };
}

function buildCountyBaselineV6(countiesV5, directSourcesByCounty) {
  return countiesV5.map((row) => {
    const source = directSourcesByCounty.get(row.county_slug);
    if (!source) return row;
    const roleStatuses = { ...(row.role_statuses || {}) };
    roleStatuses.education = source.verification_status === 'verified' ? 'verified' : 'downgraded_unverified';

    const missingRoles = (row.missing_roles || []).filter((item) => item !== 'district-grade education routing');
    if (roleStatuses.education !== 'verified') missingRoles.push('district-grade education routing');

    const hasCore = roleStatuses.lidda === 'verified'
      && roleStatuses.eci === 'verified'
      && roleStatuses.medicaid_hhs === 'verified';
    const hasStatewide = roleStatuses.legal === 'verified'
      && roleStatuses.pti === 'verified'
      && roleStatuses.able === 'verified';

    let verificationStatus = 'pass';
    if (!hasCore) verificationStatus = 'blocked';
    else if (roleStatuses.education !== 'verified' || !hasStatewide) verificationStatus = 'partial';

    return {
      ...row,
      education_routing: source.district_name ? `${source.district_name}${source.esc_region ? ` (ESC ${source.esc_region})` : ''}` : row.education_routing,
      verification_status: verificationStatus,
      missing_roles: missingRoles,
      role_statuses: roleStatuses,
      strict_education_grade: source.verification_status === 'verified' ? 'direct_live_district_page' : source.evidence_quality,
      source_urls: [...new Set([...(row.source_urls || []), source.source_url].filter(Boolean))],
      final_urls: [...new Set([...(row.final_urls || []), source.final_url].filter(Boolean))],
      fetched_at_values: [...new Set([...(row.fetched_at_values || []), source.fetched_at].filter(Boolean))],
      evidence_snippets: [...new Set([...(row.evidence_snippets || []), source.evidence_snippet].filter(Boolean))],
    };
  });
}

function buildSummaryV6(summaryV5, countiesV6, failuresV6) {
  const partialRows = countiesV6.filter((row) => row.verification_status === 'partial');
  const failureByCounty = new Map(failuresV6.map((row) => [row.county_slug, row]));
  return {
    state: 'texas',
    generated_at: nowIso(),
    v5: summaryV5.v5,
    v6: {
      pass_counties: countiesV6.filter((row) => row.verification_status === 'pass').length,
      partial_counties: partialRows.length,
      blocked_counties: countiesV6.filter((row) => row.verification_status === 'blocked').length,
    },
    attempted_partial_counties: summaryV5.v5.partial_counties,
    repaired_to_pass: countiesV6.filter((row) => row.verification_status === 'pass').length - summaryV5.v5.pass_counties,
    still_partial: partialRows.length,
    partial_reasons: partialRows.map((row) => ({
      county_slug: row.county_slug,
      reason: failureByCounty.get(row.county_slug)?.reason || 'district_grade_source_missing',
      category: failureByCounty.get(row.county_slug)?.category || 'special_education_page_missing',
    })),
    top_failure_categories: countBy(failuresV6, (row) => row.category),
    index_safe: countiesV6.every((row) => row.verification_status === 'pass'),
  };
}

function buildNextActionQueueV6(failuresV6) {
  return Object.entries(countBy(failuresV6, (row) => row.category))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({
      action: `resolve_${category}`,
      why: `${count} counties still depend on this unresolved district-grade education failure class.`,
    }));
}

function buildReport(summaryV6, filesChanged) {
  return [
    '# Texas Final District Education Cleanup Report v6',
    '',
    'This pass starts from the truthful Texas v5 baseline and retries only the 38 remaining partial counties for direct district-grade education evidence.',
    '',
    '## Result history',
    '',
    `- v5 PASS/PARTIAL/BLOCKED: ${summaryV6.v5.pass_counties}/${summaryV6.v5.partial_counties}/${summaryV6.v5.blocked_counties}`,
    `- v6 PASS/PARTIAL/BLOCKED: ${summaryV6.v6.pass_counties}/${summaryV6.v6.partial_counties}/${summaryV6.v6.blocked_counties}`,
    '',
    '## Cleanup outcome',
    '',
    `- Remaining 38 attempted: ${summaryV6.attempted_partial_counties}`,
    `- Number repaired: ${summaryV6.repaired_to_pass}`,
    `- Number still partial: ${summaryV6.still_partial}`,
    '',
    '## Counties still partial with exact reason',
    '',
    ...summaryV6.partial_reasons.map((row) => `- ${row.county_slug}: ${row.reason} (${row.category})`),
    '',
    '## Top failure categories',
    '',
    ...Object.entries(summaryV6.top_failure_categories).map(([category, count]) => `- ${category}: ${count}`),
    '',
    '## Texas index-safe',
    '',
    `- Texas is index-safe: ${summaryV6.index_safe ? 'yes' : 'no'}`,
    '',
    '## Tests run',
    '',
    '- `npm run test:texas-final-district-education-cleanup-v6`',
    '',
    '## Files changed',
    '',
    ...filesChanged.map((file) => `- \`${file}\``),
    '',
    '## Next action',
    '',
    summaryV6.index_safe ? '- none' : '- Keep the remaining partial counties gated and repair the residual district-grade evidence gaps county-by-county.',
  ].join('\n');
}

async function main() {
  const countiesV5 = readJsonl(INPUTS.countyV5);
  const directSourcesV5 = readJsonl(INPUTS.directSourcesV5);
  const summaryV5 = readJson(INPUTS.summaryV5);
  const csvRows = parseCsv(fs.readFileSync(INPUTS.asktedCsvV3, 'utf8'));
  const partialCounties = countiesV5.filter((row) => row.verification_status === 'partial');
  const askTedByCounty = districtCandidatesByCounty(csvRows);
  const fetchCache = new Map();
  const searchCache = new Map();

  const { directSources, failureLedger } = await buildV6Education(partialCounties, directSourcesV5, askTedByCounty, fetchCache, searchCache);
  const directSourcesByCounty = new Map(directSources.map((row) => [row.county_slug, row]));
  const countiesV6 = buildCountyBaselineV6(countiesV5, directSourcesByCounty);
  const summaryV6 = buildSummaryV6(summaryV5, countiesV6, failureLedger);
  const nextActions = buildNextActionQueueV6(failureLedger);

  const filesChanged = [
    'docs/generated/tx-final-district-education-cleanup-report-v6.md',
    'data/generated/tx_education_direct_district_sources_v6.jsonl',
    'data/generated/tx_county_baseline_v6.jsonl',
    'data/generated/tx_verification_summary_v6.json',
    'data/generated/tx_failure_ledger_v6.jsonl',
    'data/generated/tx_next_action_queue_v6.jsonl',
    'scripts/run-texas-final-district-education-cleanup-v6.mjs',
    'scripts/test-texas-final-district-education-cleanup-v6.mjs',
  ];
  const report = buildReport(summaryV6, filesChanged);

  writeJsonl(OUTPUTS.directSourcesV6, directSources);
  writeJsonl(OUTPUTS.countyV6, countiesV6);
  writeJsonl(OUTPUTS.failureV6, failureLedger);
  writeJsonl(OUTPUTS.nextActionV6, nextActions);
  writeJson(OUTPUTS.summaryV6, summaryV6);
  fs.mkdirSync(path.dirname(OUTPUTS.reportV6), { recursive: true });
  fs.writeFileSync(OUTPUTS.reportV6, `${report}\n`);

  console.log(JSON.stringify({
    ok: true,
    v5: summaryV6.v5,
    v6: summaryV6.v6,
    repaired: summaryV6.repaired_to_pass,
    still_partial: summaryV6.still_partial,
    index_safe: summaryV6.index_safe,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
