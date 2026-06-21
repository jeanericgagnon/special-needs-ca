import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  countyV4: path.join(generatedDir, 'tx_county_baseline_v4.jsonl'),
  educationV4: path.join(generatedDir, 'tx_askted_district_map_v4.jsonl'),
  asktedCsvV3: path.join(generatedDir, 'tx_askted_directory_v3.csv'),
  summaryV4: path.join(generatedDir, 'tx_verification_summary_v4.json'),
  failureV4: path.join(generatedDir, 'tx_failure_ledger_v4.jsonl'),
  handoffV4: path.join(docsDir, 'tx-california-grade-handoff-v4.md'),
};

const OUTPUTS = {
  reportV5: path.join(docsDir, 'tx-district-grade-education-repair-report-v5.md'),
  directSourcesV5: path.join(generatedDir, 'tx_education_direct_district_sources_v5.jsonl'),
  educationV5: path.join(generatedDir, 'tx_askted_district_map_v5.jsonl'),
  countyV5: path.join(generatedDir, 'tx_county_baseline_v5.jsonl'),
  summaryV5: path.join(generatedDir, 'tx_verification_summary_v5.json'),
  failureV5: path.join(generatedDir, 'tx_failure_ledger_v5.jsonl'),
  nextActionV5: path.join(generatedDir, 'tx_next_action_queue_v5.jsonl'),
};

const USER_AGENT = 'Ablefull Texas district-grade repair/1.0 (+https://ablefull.com)';
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
  '/child-find',
  '/childfind',
  '/ard',
  '/iep',
];
const TERM_PATTERNS = [
  { label: 'special education', regex: /\bspecial education\b/i, strength: 'strong' },
  { label: 'special services', regex: /\bspecial services\b/i, strength: 'strong' },
  { label: 'special programs', regex: /\bspecial programs\b/i, strength: 'strong' },
  { label: 'exceptional learners', regex: /\bexceptional learners\b/i, strength: 'strong' },
  { label: 'child find', regex: /\bchild find\b/i, strength: 'strong' },
  { label: 'iep', regex: /\bIEP\b/i, strength: 'strong' },
  { label: 'ard committee', regex: /\bARD committee\b/i, strength: 'strong' },
  { label: 'admission review dismissal', regex: /\badmission, review, and dismissal\b/i, strength: 'strong' },
  { label: 'special needs', regex: /\bspecial needs\b/i, strength: 'strong' },
  { label: 'student services', regex: /\bstudent services\b/i, strength: 'weak' },
  { label: 'support services', regex: /\bsupport services\b/i, strength: 'weak' },
  { label: 'evaluation', regex: /\bevaluation\b/i, strength: 'weak' },
];
const DISCOVERY_TERMS = TERM_PATTERNS.map((item) => item.label);
const WEAK_TERMS = TERM_PATTERNS.filter((item) => item.strength === 'weak').map((item) => item.label);
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
const MAX_DISTRICTS_PER_COUNTY = 5;
const MAX_FETCHES_PER_COUNTY = 20;
const FETCH_TIMEOUT_MS = 8000;
const COUNTY_CONCURRENCY = 8;

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

function strongEvidenceTermsFound(blob) {
  const text = sanitizeText(blob);
  return TERM_PATTERNS.filter((item) => item.strength === 'strong' && item.regex.test(text)).map((item) => item.label);
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
    return { ok: false, url, finalUrl: url, status: 0, contentType: '', text: '', title: '', snippet: '', fetchedAt: nowIso(), error: 'invalid_url' };
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
      const bodyText = sanitizeText($('body').text()).slice(0, 5000);
      return {
        ok: response.ok,
        url: normalized,
        finalUrl: response.url || normalized,
        status: response.status,
        contentType,
        text,
        title,
        snippet: bodyText.slice(0, 400),
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
      if (host !== districtHost) return;
      const blob = `${text} ${href}`.toLowerCase();
      if (!DISCOVERY_TERMS.some((term) => blob.includes(term.replace(/\s+/g, '-')) || blob.includes(term.replace(/\s+/g, '')) || blob.includes(term))) return;
      links.push({ url: absolute, text });
    } catch {
      // ignore malformed links
    }
  });
  return links.slice(0, 5);
}

async function inspectDistrictCandidate(candidate, fetchCache) {
  const tried = [];
  const failures = [];
  if (!candidate.district_homepage) {
    return {
      verification_status: 'blocked',
      evidence_quality: 'homepage_only',
      failure_reason: 'district_homepage_missing',
      tried,
      failures,
    };
  }

  const homepage = await fetchWithCache(candidate.district_homepage, fetchCache);
  tried.push(homepage.finalUrl || candidate.district_homepage);
  const homepageHost = normalizeHost(new URL(homepage.finalUrl || candidate.district_homepage).hostname);
  if (!homepage.ok) {
    return {
      verification_status: 'blocked',
      evidence_quality: 'broken',
      failure_reason: 'district_homepage_broken',
      tried,
      failures: [...failures, { url: candidate.district_homepage, reason: 'district_homepage_broken' }],
    };
  }

  const fetchQueue = [];
  const seen = new Set();
  const pushCandidate = (url, method) => {
    const normalized = normalizeUrl(url);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    fetchQueue.push({ url: normalized, method });
  };

  for (const link of extractHomepageLinks(homepage, homepageHost)) pushCandidate(link.url, 'homepage_link');
  pushCandidate(pathJoin(candidate.district_homepage, '/sitemap.xml'), 'sitemap');
  for (const pathname of DISTRICT_PATH_CANDIDATES) pushCandidate(pathJoin(candidate.district_homepage, pathname), 'askTED_homepage_path');

  let fetches = 1;
  let weakResult = null;
  const homepageBlob = `${homepage.title} ${homepage.snippet}`;
  if (evidenceTermsFound(homepageBlob).length > 0 && !hasBadMarker(homepageBlob)) {
    weakResult = {
      source_url: candidate.district_homepage,
      final_url: homepage.finalUrl,
      http_status: homepage.status,
      fetched_at: homepage.fetchedAt,
      evidence_snippet: sanitizeText(`${homepage.title} ${homepage.snippet}`).slice(0, 320),
      evidence_terms_found: evidenceTermsFound(homepageBlob),
      verification_status: 'partial',
      failure_reason: 'homepage_only',
      discovery_method: 'askTED_homepage_path',
      evidence_quality: 'homepage_only',
    };
  }

  for (const job of fetchQueue) {
    if (fetches >= MAX_FETCHES_PER_COUNTY) break;
    const result = await fetchWithCache(job.url, fetchCache);
    fetches += 1;
    tried.push(result.finalUrl || job.url);

    if (job.method === 'sitemap' && result.ok && /xml/i.test(result.contentType)) {
      const urls = [...result.text.matchAll(/<loc>([^<]+)<\/loc>/gi)]
        .map((m) => normalizeUrl(m[1]))
        .filter(Boolean)
        .filter((url) => normalizeHost(new URL(url).hostname) === homepageHost)
        .filter((url) => DISCOVERY_TERMS.some((term) => url.toLowerCase().includes(term.replace(/\s+/g, '-')) || url.toLowerCase().includes(term.replace(/\s+/g, ''))))
        .slice(0, 5);
      for (const url of urls) pushCandidate(url, 'sitemap');
      continue;
    }

    if (!result.ok) {
      failures.push({ url: job.url, reason: 'source_fetch_failed' });
      continue;
    }

    const finalHost = normalizeHost(new URL(result.finalUrl).hostname);
    if (finalHost !== homepageHost) {
      failures.push({ url: job.url, reason: 'district_site_blocked' });
      continue;
    }

    const blob = `${result.title} ${result.snippet}`;
    const terms = evidenceTermsFound(blob);
    const strongTerms = strongEvidenceTermsFound(blob);
    if (hasBadMarker(blob)) {
      failures.push({ url: job.url, reason: 'source_fetch_failed' });
      continue;
    }
    if (hasForbiddenEducationSignals(`${result.finalUrl} ${blob}`)) {
      failures.push({ url: job.url, reason: 'special_education_page_missing' });
      continue;
    }
    if (terms.length > 0) {
      const weakOnly = strongTerms.length === 0;
      if (weakOnly && !weakResult) {
        weakResult = {
          source_url: job.url,
          final_url: result.finalUrl,
          http_status: result.status,
          fetched_at: result.fetchedAt,
          evidence_snippet: sanitizeText(`${result.title} ${result.snippet}`).slice(0, 320),
          evidence_terms_found: terms,
          verification_status: 'partial',
          failure_reason: 'weak_student_services_only',
          discovery_method: job.method,
          evidence_quality: 'weak_student_services',
        };
        continue;
      }
      if (!weakOnly) {
        return {
          verification_status: 'verified',
          evidence_quality: 'direct_district_grade',
          failure_reason: '',
          tried,
          failures,
          source_url: job.url,
          final_url: result.finalUrl,
          http_status: result.status,
          fetched_at: result.fetchedAt,
          evidence_snippet: sanitizeText(`${result.title} ${result.snippet}`).slice(0, 320),
          evidence_terms_found: terms,
          discovery_method: job.method,
        };
      }
    }
  }

  if (weakResult) {
    return {
      ...weakResult,
      tried,
      failures: [...failures, { url: weakResult.final_url, reason: weakResult.failure_reason }],
    };
  }
  return {
    verification_status: 'blocked',
    evidence_quality: 'fallback_only',
    failure_reason: failures.some((item) => item.reason === 'district_homepage_broken')
      ? 'district_homepage_broken'
      : (failures.some((item) => item.reason === 'district_site_blocked') ? 'district_site_blocked' : 'special_education_page_missing'),
    tried,
    failures,
  };
}

function buildFailureLedgerEntry(county, candidatesTried, urlsTried, reason, category) {
  return {
    county_slug: county.county_slug,
    district_candidates_tried: candidatesTried,
    urls_tried: urlsTried,
    reason,
    category,
  };
}

async function buildV5Education(partialCounties, existingEducationV4, askTedByCounty, fetchCache) {
  const v4ByCounty = new Map(existingEducationV4.map((row) => [row.county_id, row]));
  const results = [];
  const failureLedger = [];
  let completed = 0;

  async function processCounty(county) {
    const candidates = (askTedByCounty.get(normalizeCountyName(county.county_name)) || [])
      .filter((candidate) => candidate.district_homepage)
      .slice(0, MAX_DISTRICTS_PER_COUNTY);
    let verified = null;
    let weak = null;
    const candidatesTried = [];
    const urlsTried = [];

    for (const candidate of candidates) {
      const inspection = await inspectDistrictCandidate(candidate, fetchCache);
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
      if (!weak && inspection.verification_status === 'partial') {
        weak = { candidate, inspection };
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

    const fallback = weak || {
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
        discovery_method: 'askTED_homepage_path',
      },
    };

    const categoryMap = {
      district_homepage_missing: 'district_homepage_broken',
      district_homepage_broken: 'district_homepage_broken',
      district_site_blocked: 'district_site_blocked',
      weak_student_services_only: 'weak_student_services_only',
      homepage_only: 'special_education_page_missing',
      special_education_page_missing: 'special_education_page_missing',
      source_fetch_failed: 'source_fetch_failed',
      parser_failed: 'parser_failed',
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
        verification_status: weak ? 'partial' : 'blocked',
        failure_reason: fallback.inspection.failure_reason || 'search_fallback_exhausted',
        discovery_method: fallback.inspection.discovery_method || 'askTED_homepage_path',
        evidence_quality: fallback.inspection.evidence_quality || 'fallback_only',
      },
      failure: buildFailureLedgerEntry(
      county,
      candidatesTried,
      [...new Set(urlsTried)],
      fallback.inspection.failure_reason || 'search_fallback_exhausted',
      categoryMap[fallback.inspection.failure_reason] || 'search_fallback_exhausted',
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
      if (completed % 25 === 0 || completed === partialCounties.length) {
        console.log(`tx-v5 progress ${completed}/${partialCounties.length}`);
      }
    }
  }

  const workerCount = Math.min(COUNTY_CONCURRENCY, partialCounties.length || 1);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  const passthrough = existingEducationV4
    .filter((row) => !partialCounties.some((county) => county.county_slug === row.county_id))
    .map((row) => ({
      state: 'texas',
      county_slug: row.county_id,
      county_name: row.county_name || '',
      district_id: row.district_id,
      district_name: row.district_name,
      district_type: row.district_type,
      esc_region: row.esc_region,
      district_homepage: normalizeUrl(row.website || row.district_website || ''),
      source_url: row.source_url,
      final_url: row.final_url,
      fetched_at: row.fetched_at,
      http_status: 200,
      evidence_snippet: row.evidence_snippet,
      evidence_terms_found: evidenceTermsFound(`${row.evidence_title || ''} ${row.evidence_snippet || ''}`),
      verification_status: row.verification_status === 'verified' ? 'verified' : 'blocked',
      failure_reason: row.verification_status === 'verified' ? '' : (row.verification_reasons || []).join('; '),
      discovery_method: 'previous_v4_verified',
      evidence_quality: row.evidence_quality === 'live_direct_district_grade_route' ? 'direct_district_grade' : 'fallback_only',
    }));

  return {
    directSources: [...passthrough, ...results].sort((a, b) => a.county_slug.localeCompare(b.county_slug)),
    failureLedger: failureLedger.sort((a, b) => a.county_slug.localeCompare(b.county_slug)),
  };
}

function buildCountyBaselineV5(countiesV4, directSourcesByCounty) {
  return countiesV4.map((row) => {
    const source = directSourcesByCounty.get(row.county_slug);
    const roleStatuses = { ...(row.role_statuses || {}) };
    roleStatuses.education = source?.verification_status === 'verified' ? 'verified' : 'downgraded_unverified';

    const missingRoles = (row.missing_roles || []).filter((item) => item !== 'district-grade education routing');
    if (roleStatuses.education !== 'verified') missingRoles.push('district-grade education routing');

    const hasCore = roleStatuses.lidda === 'verified'
      && roleStatuses.eci === 'verified'
      && roleStatuses.medicaid_hhs === 'verified';
    const hasStatewide = roleStatuses.legal === 'verified'
      && roleStatuses.pti === 'verified'
      && roleStatuses.able === 'verified';

    let verificationStatus = 'pass';
    if (!hasCore) {
      verificationStatus = 'blocked';
    } else if (roleStatuses.education !== 'verified' || !hasStatewide) {
      verificationStatus = 'partial';
    }

    return {
      ...row,
      education_routing: source?.district_name ? `${source.district_name}${source.esc_region ? ` (ESC ${source.esc_region})` : ''}` : row.education_routing,
      missing_roles: missingRoles,
      verification_status: verificationStatus,
      role_statuses: roleStatuses,
      strict_education_grade: source?.verification_status === 'verified' ? 'direct_live_district_page' : (source?.evidence_quality || row.strict_education_grade),
      source_urls: [...new Set([...(row.source_urls || []), source?.source_url].filter(Boolean))],
      final_urls: [...new Set([...(row.final_urls || []), source?.final_url].filter(Boolean))],
      fetched_at_values: [...new Set([...(row.fetched_at_values || []), source?.fetched_at].filter(Boolean))],
      evidence_snippets: [...new Set([...(row.evidence_snippets || []), source?.evidence_snippet].filter(Boolean))],
    };
  });
}

function buildAskTedDistrictMapV5(existingEducationV4, directSourcesByCounty) {
  return existingEducationV4.map((row) => {
    const source = directSourcesByCounty.get(row.county_id);
    if (!source) return row;
    return {
      ...row,
      district_id: source.district_id || row.district_id,
      district_name: source.district_name || row.district_name,
      district_type: source.district_type || row.district_type,
      esc_region: source.esc_region || row.esc_region,
      website: source.district_homepage || row.website,
      source_url: source.source_url || row.source_url,
      final_url: source.final_url || row.final_url,
      fetched_at: source.fetched_at || row.fetched_at,
      evidence_snippet: source.evidence_snippet || row.evidence_snippet,
      verification_status: source.verification_status === 'verified' ? 'verified' : 'downgraded_unverified',
      verification_reasons: source.verification_status === 'verified'
        ? []
        : [source.failure_reason || 'district_grade_source_missing'],
      evidence_quality: source.verification_status === 'verified' ? 'live_direct_district_grade_route' : row.evidence_quality,
      district_grade_standard: source.verification_status === 'verified' ? 'direct_live_district_page' : 'fallback_or_non_district_route',
      evidence_terms_found: source.evidence_terms_found || [],
      direct_district_grade_source_url: source.verification_status === 'verified' ? source.final_url : '',
    };
  });
}

function buildSummaryV5(summaryV4, countiesV5, directSources, failureLedger) {
  const attemptedCounties = directSources.filter((row) => row.discovery_method !== 'previous_v4_verified').length;
  return {
    state: 'texas',
    generated_at: nowIso(),
    v4: summaryV4.v4,
    v5: {
      pass_counties: countiesV5.filter((row) => row.verification_status === 'pass').length,
      partial_counties: countiesV5.filter((row) => row.verification_status === 'partial').length,
      blocked_counties: countiesV5.filter((row) => row.verification_status === 'blocked').length,
    },
    partial_counties_attempted: attemptedCounties,
    repaired_to_pass: countiesV5.filter((row) => row.verification_status === 'pass').length - (summaryV4.v4?.pass_counties || 0),
    still_partial: countiesV5.filter((row) => row.verification_status === 'partial').length,
    blocked_counties: countiesV5.filter((row) => row.verification_status === 'blocked').length,
    top_failure_categories: countBy(failureLedger, (row) => row.category),
    counties_below_california_grade: countiesV5.filter((row) => row.verification_status !== 'pass').map((row) => row.county_slug),
    index_safe: countiesV5.every((row) => row.verification_status === 'pass'),
  };
}

function buildNextActionQueueV5(summary, failureLedger) {
  const top = Object.entries(countBy(failureLedger, (row) => row.category))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));
  return top.map((item) => ({
    action: `resolve_${item.category}`,
    why: `${item.count} counties still depend on this unresolved education failure class.`,
  }));
}

function buildReport(summary, commandsRun, testsRun, filesChanged) {
  return [
    '# Texas District-Grade Education Repair Report v5',
    '',
    'This pass repairs only the remaining district-grade education layer for the 244 counties that were still partial in v4.',
    '',
    '## Result history',
    '',
    `- v4 PASS/PARTIAL/BLOCKED: ${summary.v4.pass_counties}/${summary.v4.partial_counties}/${summary.v4.blocked_counties}`,
    `- v5 PASS/PARTIAL/BLOCKED: ${summary.v5.pass_counties}/${summary.v5.partial_counties}/${summary.v5.blocked_counties}`,
    '',
    '## Repair outcome',
    '',
    `- Partial counties attempted: ${summary.partial_counties_attempted}`,
    `- Repaired to PASS: ${summary.repaired_to_pass}`,
    `- Still PARTIAL: ${summary.still_partial}`,
    `- BLOCKED: ${summary.blocked_counties}`,
    '',
    '## Top failure categories',
    '',
    ...Object.entries(summary.top_failure_categories).map(([key, value]) => `- ${key}: ${value}`),
    '',
    '## Counties still below California-grade',
    '',
    ...summary.counties_below_california_grade.map((slug) => `- ${slug}`),
    '',
    `## Texas index-safe`,
    '',
    `- Texas is index-safe: ${summary.index_safe ? 'yes' : 'no'}`,
    '',
    '## Commands run',
    '',
    ...commandsRun.map((cmd) => `- \`${cmd}\``),
    '',
    '## Tests run',
    '',
    ...testsRun.map((cmd) => `- \`${cmd}\``),
    '',
    '## Files changed',
    '',
    ...filesChanged.map((file) => `- \`${file}\``),
  ].join('\n');
}

async function main() {
  const countiesV4 = readJsonl(INPUTS.countyV4);
  const educationV4 = readJsonl(INPUTS.educationV4);
  const summaryV4 = readJson(INPUTS.summaryV4);
  const csvRows = parseCsv(fs.readFileSync(INPUTS.asktedCsvV3, 'utf8'));
  const partialCounties = countiesV4.filter((row) => row.verification_status === 'partial');
  const askTedByCounty = districtCandidatesByCounty(csvRows);
  const fetchCache = new Map();

  const { directSources, failureLedger } = await buildV5Education(partialCounties, educationV4, askTedByCounty, fetchCache);
  const directSourcesByCounty = new Map(directSources.map((row) => [row.county_slug, row]));
  const educationV5 = buildAskTedDistrictMapV5(educationV4, directSourcesByCounty);
  const countiesV5 = buildCountyBaselineV5(countiesV4, directSourcesByCounty);
  const summaryV5 = buildSummaryV5(summaryV4, countiesV5, directSources, failureLedger);
  const nextActions = buildNextActionQueueV5(summaryV5, failureLedger);
  const filesChanged = [
    'docs/generated/tx-district-grade-education-repair-report-v5.md',
    'data/generated/tx_education_direct_district_sources_v5.jsonl',
    'data/generated/tx_askted_district_map_v5.jsonl',
    'data/generated/tx_county_baseline_v5.jsonl',
    'data/generated/tx_verification_summary_v5.json',
    'data/generated/tx_failure_ledger_v5.jsonl',
    'data/generated/tx_next_action_queue_v5.jsonl',
    'scripts/run-texas-district-grade-education-repair-v5.mjs',
    'scripts/test-texas-district-grade-education-repair-v5.mjs',
  ];
  const report = buildReport(
    summaryV5,
    ['npm run run:texas-district-grade-education-repair-v5'],
    ['npm run test:texas-district-grade-education-repair-v5'],
    filesChanged,
  );

  writeJsonl(OUTPUTS.directSourcesV5, directSources);
  writeJsonl(OUTPUTS.educationV5, educationV5);
  writeJsonl(OUTPUTS.countyV5, countiesV5);
  writeJsonl(OUTPUTS.failureV5, failureLedger);
  writeJsonl(OUTPUTS.nextActionV5, nextActions);
  writeJson(OUTPUTS.summaryV5, summaryV5);
  fs.mkdirSync(path.dirname(OUTPUTS.reportV5), { recursive: true });
  fs.writeFileSync(OUTPUTS.reportV5, `${report}\n`);

  console.log(JSON.stringify({
    ok: true,
    v4: summaryV5.v4,
    v5: summaryV5.v5,
    still_partial: summaryV5.still_partial,
    blocked: summaryV5.blocked_counties,
    index_safe: summaryV5.index_safe,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
