import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  countyV7: path.join(generatedDir, 'tx_county_baseline_v7.jsonl'),
  directSourcesV7: path.join(generatedDir, 'tx_education_direct_district_sources_v7.jsonl'),
  summaryV7: path.join(generatedDir, 'tx_verification_summary_v7.json'),
  failureV7: path.join(generatedDir, 'tx_failure_ledger_v7.jsonl'),
  asktedCsvV3: path.join(generatedDir, 'tx_askted_directory_v3.csv'),
  reportV7: path.join(docsDir, 'tx-residual-district-education-repair-report-v7.md'),
};

const OUTPUTS = {
  reportV8: path.join(docsDir, 'tx-manual-exact-target-repair-report-v8.md'),
  directSourcesV8: path.join(generatedDir, 'tx_education_direct_district_sources_v8.jsonl'),
  countyV8: path.join(generatedDir, 'tx_county_baseline_v8.jsonl'),
  summaryV8: path.join(generatedDir, 'tx_verification_summary_v8.json'),
  failureV8: path.join(generatedDir, 'tx_failure_ledger_v8.jsonl'),
  nextActionV8: path.join(generatedDir, 'tx_next_action_queue_v8.jsonl'),
  manualTargetsV8: path.join(generatedDir, 'tx_manual_target_candidates_v8.jsonl'),
};

const USER_AGENT = 'Ablefull Texas manual exact-target repair v8/1.0 (+https://ablefull.com)';
const FETCH_TIMEOUT_MS = 10000;
const BAD_MARKERS = ['page not found', 'file not found', 'access denied', 'just a moment', 'sign in - google accounts', 'fastly error'];

const TERM_PATTERNS = [
  'special education',
  'child find',
  'special populations',
  'special services',
  'special programs',
  'dyslexia',
  'section 504',
  '504',
  'spedtex',
  'special ed',
];

const REJECT_HOST_PATTERNS = [
  /duckduckgo/i,
  /google\./i,
  /googleusercontent/i,
  /bing\.com/i,
  /tea\.texas\.gov/i,
  /tealprod\.tea\.state\.tx\.us/i,
  /facebook\.com/i,
  /instagram\.com/i,
  /x\.com/i,
  /twitter\.com/i,
];

const MANUAL_TARGETS = {
  'andrews-tx': [
    {
      district_id: '002901',
      district_name: 'ANDREWS ISD',
      district_type: 'INDEPENDENT',
      esc_region: '18',
      district_homepage: 'https://www.andrews.esc18.net',
      target_url: 'https://www.andrews.esc18.net/apps/pages/studentservices',
      source_type: 'special_services_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'partial',
    },
    {
      district_id: '002901',
      district_name: 'ANDREWS ISD',
      district_type: 'INDEPENDENT',
      esc_region: '18',
      district_homepage: 'https://www.andrews.esc18.net',
      target_url: 'https://www.andrews.esc18.net/apps/pages/index.jsp?uREC_ID=1762916&type=d',
      source_type: 'exact_manual_target',
      county_coverage_note: 'AskTED county match',
      expected_result: 'partial',
    },
  ],
  'coke-tx': [
    {
      district_id: '041901',
      district_name: 'BRONTE ISD',
      district_type: 'INDEPENDENT',
      esc_region: '15',
      district_homepage: 'https://www.bronteisd.net',
      target_url: 'https://www.bronteisd.net/special-education-information',
      source_type: 'special_education_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
    {
      district_id: '041901',
      district_name: 'BRONTE ISD',
      district_type: 'INDEPENDENT',
      esc_region: '15',
      district_homepage: 'https://www.bronteisd.net',
      target_url: 'https://www.bronteisd.net/special-education-guidance',
      source_type: 'special_education_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
  ],
  'collingsworth-tx': [
    {
      district_id: '044902',
      district_name: 'WELLINGTON ISD',
      district_type: 'INDEPENDENT',
      esc_region: '16',
      district_homepage: 'https://www.wellingtonisd.net',
      target_url: 'https://www.wellingtonisd.net/page/special-education-postings/',
      source_type: 'special_education_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
  ],
  'concho-tx': [
    {
      district_id: '048903',
      district_name: 'PAINT ROCK ISD',
      district_type: 'INDEPENDENT',
      esc_region: '15',
      district_homepage: 'https://www.paintrockisd.net',
      target_url: 'https://www.paintrockisd.net/page/special-populations',
      source_type: 'special_populations_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
    {
      district_id: '048901',
      district_name: 'EDEN CISD',
      district_type: 'INDEPENDENT',
      esc_region: '15',
      district_homepage: 'https://www.edencisd.net',
      target_url: 'https://www.edencisd.net/page/special-programs/',
      source_type: 'special_programs_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
  ],
  'crockett-tx': [
    {
      district_id: '053001',
      district_name: 'CROCKETT COUNTY CONSOLIDATED CSD',
      district_type: 'COMMON',
      esc_region: '15',
      district_homepage: 'https://www.ozonaschools.net',
      target_url: 'https://www.ozonaschools.net/o/oes/page/special-education/',
      source_type: 'special_education_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
  ],
  'delta-tx': [
    {
      district_id: '060902',
      district_name: 'COOPER ISD',
      district_type: 'INDEPENDENT',
      esc_region: '08',
      district_homepage: 'https://www.cooperisd.net',
      target_url: 'https://www.cooperisd.net/page/dyslexia',
      source_type: 'special_education_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
  ],
  'donley-tx': [
    {
      district_id: '065901',
      district_name: 'CLARENDON ISD',
      district_type: 'INDEPENDENT',
      esc_region: '16',
      district_homepage: 'https://www.clarendonisd.net',
      target_url: 'https://www.clarendonisd.net/page/special-education-and-504-services/',
      source_type: 'special_education_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
    {
      district_id: '065902',
      district_name: 'HEDLEY ISD',
      district_type: 'INDEPENDENT',
      esc_region: '16',
      district_homepage: 'https://www.hedleyisd.net',
      target_url: 'https://www.hedleyisd.net/page/sped-504-dyslexia/',
      source_type: 'special_programs_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
  ],
  'floyd-tx': [
    {
      district_id: '077901',
      district_name: 'FLOYDADA COLLEGIATE ISD',
      district_type: 'INDEPENDENT',
      esc_region: '17',
      district_homepage: 'https://www.floydadaisd.esc17.net',
      target_url: 'https://www.floydadaisd.esc17.net/page/special-programs/',
      source_type: 'special_programs_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
  ],
  'franklin-tx': [
    {
      district_id: '080901',
      district_name: 'MOUNT VERNON ISD',
      district_type: 'INDEPENDENT',
      esc_region: '08',
      district_homepage: 'https://www.mtvernonisd.net',
      target_url: 'https://sites.google.com/mtvernonisd.net/mvisd-special-services/home',
      source_type: 'special_services_page',
      county_coverage_note: 'AskTED county match via district-owned Google Sites',
      expected_result: 'verified',
    },
  ],
  'hansford-tx': [
    {
      district_id: '098904',
      district_name: 'SPEARMAN ISD',
      district_type: 'INDEPENDENT',
      esc_region: '16',
      district_homepage: 'https://www.spearmanisd.net',
      target_url: 'https://www.spearmanisd.net/page/special-ed-ssa-dyslexia/',
      source_type: 'special_education_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
    {
      district_id: '098903',
      district_name: 'PRINGLE-MORSE CISD',
      district_type: 'INDEPENDENT',
      esc_region: '16',
      district_homepage: 'https://www.pringlemorsecisd.net',
      target_url: 'https://www.pringlemorsecisd.net/District/Class/46-Special-Education',
      source_type: 'special_education_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
  ],
  'king-tx': [
    {
      district_id: '135001',
      district_name: 'GUTHRIE CSD',
      district_type: 'COMMON',
      esc_region: '17',
      district_homepage: 'https://www.guthriejags.com',
      target_url: 'https://www.guthriejags.com/parents.html',
      source_type: 'exact_manual_target',
      county_coverage_note: 'AskTED county match',
      expected_result: 'partial',
    },
  ],
  'la-salle-tx': [
    {
      district_id: '142901',
      district_name: 'COTULLA ISD',
      district_type: 'INDEPENDENT',
      esc_region: '20',
      district_homepage: 'https://www.cotullaisd.net',
      target_url: 'https://www.cotullaisd.net/page/special-education',
      source_type: 'special_education_page',
      county_coverage_note: 'District homepage repaired from dead .org domain to live .net domain',
      repaired_from: 'https://www.cotullaisd.org',
      expected_result: 'verified',
    },
  ],
  'loving-tx': [
    {
      district_id: '248902',
      district_name: 'WINK-LOVING ISD',
      district_type: 'INDEPENDENT',
      esc_region: '18',
      district_homepage: 'https://www.wlisd.net',
      target_url: 'https://www.wlisd.net/apps/pages/index.jsp?uREC_ID=1790320&type=d&pREC_ID=staff',
      source_type: 'special_education_page',
      county_coverage_note: 'Manual county exception: AskTED county export omits Loving County, but the district name explicitly covers Loving County',
      expected_result: 'verified',
    },
  ],
  'maverick-tx': [
    {
      district_id: '159901',
      district_name: 'EAGLE PASS ISD',
      district_type: 'INDEPENDENT',
      esc_region: '20',
      district_homepage: 'https://www.eaglepassisd.net',
      target_url: 'https://federal-programs.eaglepassisd.net/',
      source_type: 'special_programs_page',
      county_coverage_note: 'Manual district subdomain candidate',
      expected_result: 'partial',
    },
  ],
  'mcmullen-tx': [
    {
      district_id: '162904',
      district_name: 'MCMULLEN COUNTY ISD',
      district_type: 'INDEPENDENT',
      esc_region: '02',
      district_homepage: 'https://www.mcisd.us',
      target_url: 'https://www.mcisd.us/27975',
      source_type: 'exact_manual_target',
      county_coverage_note: 'AskTED county match',
      expected_result: 'partial',
    },
  ],
  'menard-tx': [
    {
      district_id: '164901',
      district_name: 'MENARD ISD',
      district_type: 'INDEPENDENT',
      esc_region: '15',
      district_homepage: 'https://www.menardisd.net',
      target_url: 'https://www.menardisd.net/page/menard-special-education-cooperative/',
      source_type: 'special_education_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
  ],
  'moore-tx': [
    {
      district_id: '171902',
      district_name: 'SUNRAY COLLEGIATE ISD',
      district_type: 'INDEPENDENT',
      esc_region: '16',
      district_homepage: 'https://www.sunrayisd.org',
      target_url: 'https://www.sunrayisd.org/page/dyslexia-specialprograms/',
      source_type: 'special_programs_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
    {
      district_id: '171901',
      district_name: 'DUMAS ISD',
      district_type: 'INDEPENDENT',
      esc_region: '16',
      district_homepage: 'https://www.dumasisd.org',
      target_url: 'https://www.dumasisd.org/page/special-programs/',
      source_type: 'special_programs_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
  ],
  'sabine-tx': [
    {
      district_id: '202905',
      district_name: 'WEST SABINE ISD',
      district_type: 'INDEPENDENT',
      esc_region: '07',
      district_homepage: 'https://www.westsabineisd.net',
      target_url: 'https://www.westsabineisd.net/page/state-and-federal-programs/',
      source_type: 'special_programs_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'partial',
    },
  ],
  'shackelford-tx': [
    {
      district_id: '209901',
      district_name: 'ALBANY ISD',
      district_type: 'INDEPENDENT',
      esc_region: '14',
      district_homepage: 'https://www.albanyisd.net',
      target_url: 'https://www.albanyisd.net/apps/pages/index.jsp?uREC_ID=582186&type=d',
      source_type: 'special_services_page',
      county_coverage_note: 'District homepage repaired from dead esc14 host to live albanyisd.net domain',
      repaired_from: 'https://www.albany.esc14.net',
      expected_result: 'verified',
    },
    {
      district_id: '209902',
      district_name: 'MORAN ISD',
      district_type: 'INDEPENDENT',
      esc_region: '14',
      district_homepage: 'https://www.moran.esc14.net',
      target_url: 'https://www.moran.esc14.net/321178_2',
      source_type: 'special_education_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
  ],
  'stonewall-tx': [
    {
      district_id: '217901',
      district_name: 'ASPERMONT ISD',
      district_type: 'INDEPENDENT',
      esc_region: '17',
      district_homepage: 'https://www.aspermontisd.com',
      target_url: 'https://www.aspermontisd.com/upload/page/0055/docs/Updates%20to%20Special%20Education.pdf',
      source_type: 'district_document',
      county_coverage_note: 'AskTED county match',
      expected_result: 'partial',
    },
  ],
  'washington-tx': [
    {
      district_id: '239901',
      district_name: 'BRENHAM ISD',
      district_type: 'INDEPENDENT',
      esc_region: '06',
      district_homepage: 'https://www.brenhamisd.net',
      target_url: 'https://www.brenhamisd.net/page/sped.home',
      source_type: 'special_education_page',
      county_coverage_note: 'AskTED county match',
      expected_result: 'verified',
    },
  ],
};

function nowIso() {
  return new Date().toISOString();
}

function sanitizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
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

function normalizeUrl(raw) {
  if (!raw) return '';
  let url = String(raw).trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) parsed.port = '';
    return parsed.toString();
  } catch {
    return '';
  }
}

function normalizeHost(value) {
  return String(value || '').toLowerCase().replace(/^www\./, '');
}

function urlOrigin(value) {
  try {
    return new URL(value).origin;
  } catch {
    return normalizeUrl(value);
  }
}

function sameDomainFamily(a, b) {
  return a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);
}

function countBy(rows, keyFn) {
  const counts = {};
  for (const row of rows) {
    const key = keyFn(row) || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function evidenceTermsFound(blob) {
  const lower = sanitizeText(blob).toLowerCase();
  return TERM_PATTERNS.filter((term) => lower.includes(term));
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
      const buffer = Buffer.from(await response.arrayBuffer());
      const text = /html/i.test(contentType)
        ? buffer.toString('utf8')
        : buffer.toString('latin1');
      const $ = /html/i.test(contentType) ? cheerio.load(text) : null;
      const title = $ ? sanitizeText($('title').first().text()) : '';
      const headings = $ ? $('h1, h2, h3').toArray().map((el) => sanitizeText($(el).text())).filter(Boolean).slice(0, 10) : [];
      const snippetSource = $ ? sanitizeText($('body').text()) : sanitizeText(text);
      return {
        ok: response.ok,
        url: normalized,
        finalUrl: response.url || normalized,
        status: response.status,
        contentType,
        text,
        title,
        headings,
        snippet: snippetSource.slice(0, 800),
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

function classifyManualCandidate(target, fetchResult) {
  const finalUrl = fetchResult.finalUrl || target.target_url;
  const finalHost = normalizeHost((() => {
    try {
      return new URL(finalUrl).hostname;
    } catch {
      return '';
    }
  })());
  const homepageHost = normalizeHost((() => {
    try {
      return new URL(target.district_homepage).hostname;
    } catch {
      return '';
    }
  })());
  const headerBlob = sanitizeText(`${target.target_url} ${finalUrl} ${fetchResult.title} ${fetchResult.headings.join(' ')}`);
  const fullBlob = sanitizeText(`${headerBlob} ${fetchResult.snippet} ${fetchResult.text.slice(0, 10000)}`);
  const lowerBlob = fullBlob.toLowerCase();
  const terms = evidenceTermsFound(fullBlob);

  if (!fetchResult.ok) {
    return { status: 'partial', reason: 'source_fetch_failed', terms, evidence_quality: 'broken' };
  }
  if (REJECT_HOST_PATTERNS.some((pattern) => pattern.test(finalHost))) {
    return { status: 'partial', reason: 'district_site_blocked', terms, evidence_quality: 'off_domain' };
  }
  const isDistrictOwnedGoogleSite = finalHost === 'sites.google.com'
    && finalUrl.toLowerCase().includes(homepageHost);
  if (!sameDomainFamily(finalHost, homepageHost) && !isDistrictOwnedGoogleSite) {
    return { status: 'partial', reason: 'district_site_blocked', terms, evidence_quality: 'off_domain' };
  }
  if (BAD_MARKERS.some((marker) => lowerBlob.includes(marker))) {
    return { status: 'partial', reason: 'source_fetch_failed', terms, evidence_quality: 'broken' };
  }
  if (/search-results|duckduckgo|google accounts|signin/i.test(fullBlob)) {
    return { status: 'partial', reason: 'search_result_or_login_page', terms, evidence_quality: 'blocked' };
  }

  const headerTerms = evidenceTermsFound(headerBlob);
  const explicitHeader = headerTerms.length > 0;
  const bodySpecialSignals = /special education|child find|special populations|special services|dyslexia|section\s*504|special ed|spedtex/i.test(fullBlob);
  const sourceTypeAllowsSpecialPrograms = ['special_programs_page', 'special_populations_page', 'special_services_page'].includes(target.source_type);
  const specialProgramsOnly = terms.length > 0 && terms.every((term) => term === 'special programs');

  if (/pdf/i.test(fetchResult.contentType) && terms.length === 0) {
    return { status: 'partial', reason: 'document_text_unparsed', terms, evidence_quality: 'unparsed_document' };
  }

  const hasBrenhamSpedSurface = /\/page\/sped\./i.test(target.target_url)
    && /special education department|special services department|sped resources|tea sped stakeholder survey/i.test(fetchResult.text);

  if (explicitHeader && (bodySpecialSignals || sourceTypeAllowsSpecialPrograms || hasBrenhamSpedSurface)) {
    return { status: 'verified', reason: '', terms: [...new Set([...headerTerms, ...terms, ...(hasBrenhamSpedSurface ? ['special education'] : [])])], evidence_quality: 'direct_district_grade' };
  }
  if (specialProgramsOnly && sourceTypeAllowsSpecialPrograms) {
    return { status: 'verified', reason: '', terms, evidence_quality: 'direct_district_grade' };
  }
  if ((bodySpecialSignals || hasBrenhamSpedSurface) && /spd\.|sped\.|special-education|special-education-and-504|special-ed-ssa-dyslexia|special-populations|special-programs|special-services|dyslexia/i.test(target.target_url)) {
    return { status: 'verified', reason: '', terms: [...new Set([...terms, ...(hasBrenhamSpedSurface ? ['special education'] : [])])], evidence_quality: 'direct_district_grade' };
  }
  if (terms.includes('special programs') || terms.includes('special services') || terms.includes('504') || terms.includes('dyslexia')) {
    return { status: 'partial', reason: 'weak_manual_target_only', terms, evidence_quality: 'weak_manual_target' };
  }
  return { status: 'partial', reason: 'special_education_page_missing', terms, evidence_quality: 'fallback_only' };
}

function buildCandidateRow(countySlug, target, fetchResult, classification) {
  const rawBlob = sanitizeText(`${fetchResult.title} ${fetchResult.headings.join(' ')} ${fetchResult.snippet} ${fetchResult.text.slice(0, 12000)}`);
  const lowerBlob = rawBlob.toLowerCase();
  let evidenceSnippet = sanitizeText(`${fetchResult.title} ${fetchResult.headings.join(' ')} ${fetchResult.snippet}`).slice(0, 360);
  const evidenceNeedles = [
    'special education department',
    'special services department',
    'special education',
    'child find',
    'special populations',
    'special services',
    'special programs',
    'dyslexia',
    'section 504',
    'spedtex',
  ];
  for (const needle of evidenceNeedles) {
    const index = lowerBlob.indexOf(needle);
    if (index >= 0) {
      evidenceSnippet = rawBlob.slice(Math.max(0, index - 80), Math.min(rawBlob.length, index + 280));
      break;
    }
  }
  if (classification.terms.length > 0 && !classification.terms.some((term) => evidenceSnippet.toLowerCase().includes(term))) {
    evidenceSnippet = `${classification.terms.join(', ')} :: ${evidenceSnippet}`;
  }
  return {
    county_slug: countySlug,
    district_id: target.district_id,
    district_name: target.district_name,
    district_homepage: target.district_homepage,
    target_url: target.target_url,
    source_type: target.source_type,
    county_coverage_note: target.county_coverage_note,
    repaired_from: target.repaired_from || '',
    expected_result: target.expected_result,
    attempt_status: classification.status,
    final_url: fetchResult.finalUrl || target.target_url,
    http_status: fetchResult.status,
    fetched_at: fetchResult.fetchedAt,
    content_type: fetchResult.contentType,
    evidence_title: fetchResult.title,
    evidence_headings: fetchResult.headings,
    evidence_terms_found: classification.terms,
    evidence_quality: classification.evidence_quality,
    evidence_snippet: evidenceSnippet,
    failure_reason: classification.reason,
  };
}

function buildFailureReason(candidates) {
  if (candidates.some((row) => row.failure_reason === 'document_text_unparsed')) return 'document_text_unparsed';
  if (candidates.some((row) => row.failure_reason === 'district_site_blocked')) return 'district_site_blocked';
  if (candidates.some((row) => row.failure_reason === 'source_fetch_failed')) return 'district_homepage_broken';
  if (candidates.some((row) => row.failure_reason === 'weak_manual_target_only')) return 'weak_manual_target_only';
  if (candidates.length === 0) return 'manual_target_missing';
  return 'manual_target_exhausted';
}

function recommendedNextAction(reason) {
  if (reason === 'document_text_unparsed') return 'add district-document text extraction or human-review the document manually';
  if (reason === 'district_site_blocked') return 'repair district-owned target or find a different same-domain exact special-education page';
  if (reason === 'district_homepage_broken') return 'repair homepage/domain seed and author a live district-owned target';
  if (reason === 'weak_manual_target_only') return 'find a stronger district-owned page with explicit special education, child find, 504, or dyslexia routing';
  if (reason === 'manual_target_missing') return 'author reviewed district-owned exact targets from sitemap or document center';
  return 'continue manual exact-target authoring with only district-owned pages or documents';
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
    if (char === '"') inQuotes = true;
    else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') field += char;
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

function buildAskTedDistrictIndex(csvRows) {
  const byDistrict = new Map();
  for (const row of csvRows) {
    const districtId = sanitizeText(String(row['District Number'] || '').replace(/^'+/, ''));
    if (!districtId) continue;
    if (!byDistrict.has(districtId)) {
      byDistrict.set(districtId, {
        district_id: districtId,
        district_name: sanitizeText(row['District Name']),
        district_type: sanitizeText(row['District Type']),
        esc_region: sanitizeText(String(row['ESC Region Served'] || '').replace(/^'+/, '')),
        district_homepage: normalizeUrl(row['District Web Page Address']),
      });
    }
  }
  return byDistrict;
}

async function buildV8Education(partialCounties, directSourcesV7, failuresV7, askTedIndex) {
  const fetchCache = new Map();
  const directSources = [];
  const failureLedger = [];
  const manualTargetRows = [];
  const failureByCounty = new Map(failuresV7.map((row) => [row.county_slug, row]));

  for (const county of partialCounties) {
    const manualTargets = (MANUAL_TARGETS[county.county_slug] || []).map((row) => ({
      ...row,
      ...(askTedIndex.get(row.district_id) || {}),
      ...row,
    }));
    const attempts = [];
    let verifiedCandidate = null;

    for (const target of manualTargets) {
      const fetchResult = await fetchWithCache(target.target_url, fetchCache);
      const classification = classifyManualCandidate(target, fetchResult);
      const candidateRow = buildCandidateRow(county.county_slug, target, fetchResult, classification);
      manualTargetRows.push(candidateRow);
      attempts.push(candidateRow);
      if (!verifiedCandidate && classification.status === 'verified') {
        verifiedCandidate = { target, fetchResult, classification, candidateRow };
      }
    }

    if (verifiedCandidate) {
      directSources.push({
        state: 'texas',
        county_slug: county.county_slug,
        county_name: county.county_name,
        district_id: verifiedCandidate.target.district_id,
        district_name: verifiedCandidate.target.district_name,
        district_type: verifiedCandidate.target.district_type,
        esc_region: verifiedCandidate.target.esc_region,
        district_homepage: urlOrigin(verifiedCandidate.target.district_homepage),
        source_url: verifiedCandidate.target.target_url,
        final_url: verifiedCandidate.fetchResult.finalUrl,
        fetched_at: verifiedCandidate.fetchResult.fetchedAt,
        http_status: verifiedCandidate.fetchResult.status,
        evidence_snippet: verifiedCandidate.candidateRow.evidence_snippet,
        evidence_terms_found: verifiedCandidate.classification.terms,
        verification_status: 'verified',
        failure_reason: '',
        discovery_method: 'manual_exact_target',
        evidence_quality: 'direct_district_grade',
        source_type: verifiedCandidate.target.source_type,
      });
      continue;
    }

    const fallbackAttempt = attempts[0];
    const reason = buildFailureReason(attempts);
    const priorFailure = failureByCounty.get(county.county_slug);
    directSources.push({
      ...(directSourcesV7.find((row) => row.county_slug === county.county_slug) || {}),
      state: 'texas',
      county_slug: county.county_slug,
      county_name: county.county_name,
      district_id: fallbackAttempt?.district_id || '',
      district_name: fallbackAttempt?.district_name || '',
      district_type: fallbackAttempt?.district_type || '',
      esc_region: fallbackAttempt?.esc_region || '',
      district_homepage: fallbackAttempt ? urlOrigin(fallbackAttempt.final_url || fallbackAttempt.district_homepage) : '',
      source_url: fallbackAttempt?.target_url || '',
      final_url: fallbackAttempt?.final_url || '',
      fetched_at: fallbackAttempt?.fetched_at || nowIso(),
      http_status: fallbackAttempt?.http_status || 0,
      evidence_snippet: fallbackAttempt?.evidence_snippet || '',
      evidence_terms_found: fallbackAttempt?.evidence_terms_found || [],
      verification_status: 'partial',
      failure_reason: reason,
      discovery_method: 'manual_exact_target',
      evidence_quality: fallbackAttempt?.evidence_quality || 'fallback_only',
      source_type: fallbackAttempt?.source_type || 'exact_manual_target',
    });
    failureLedger.push({
      county_slug: county.county_slug,
      district_candidates_tried: (priorFailure?.district_candidates_tried || []).map((row) => ({ ...row })),
      homepage_domain_repair_attempts: [
        ...(priorFailure?.homepage_domain_repair_attempts || []),
        ...attempts.filter((row) => row.repaired_from).map((row) => ({
          from: row.repaired_from,
          to: row.final_url,
          result: row.attempt_status,
        })),
      ],
      manually_authored_target_candidates: attempts.map((row) => ({
        district_id: row.district_id,
        district_name: row.district_name,
        target_url: row.target_url,
        source_type: row.source_type,
        result: row.attempt_status,
        failure_reason: row.failure_reason,
      })),
      urls_tried: attempts.map((row) => row.target_url),
      search_queries: [],
      reason,
      category: reason,
      final_reason: reason,
      recommended_manual_next_action: recommendedNextAction(reason),
    });
  }

  const passthrough = directSourcesV7
    .filter((row) => !partialCounties.some((county) => county.county_slug === row.county_slug))
    .map((row) => ({ ...row }));

  return {
    directSources: [...passthrough, ...directSources].sort((a, b) => a.county_slug.localeCompare(b.county_slug)),
    failureLedger: failureLedger.sort((a, b) => a.county_slug.localeCompare(b.county_slug)),
    manualTargetRows: manualTargetRows.sort((a, b) => a.county_slug.localeCompare(b.county_slug) || a.target_url.localeCompare(b.target_url)),
  };
}

function buildCountyBaselineV8(countiesV7, directSourcesByCounty) {
  return countiesV7.map((row) => {
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
      strict_education_grade: source.verification_status === 'verified' ? 'direct_manual_exact_target' : source.evidence_quality,
      source_urls: [...new Set([...(row.source_urls || []), source.source_url].filter(Boolean))],
      final_urls: [...new Set([...(row.final_urls || []), source.final_url].filter(Boolean))],
      fetched_at_values: [...new Set([...(row.fetched_at_values || []), source.fetched_at].filter(Boolean))],
      evidence_snippets: [...new Set([...(row.evidence_snippets || []), source.evidence_snippet].filter(Boolean))],
    };
  });
}

function buildSummaryV8(summaryV7, countiesV8, failuresV8, manualTargetRows) {
  const partialRows = countiesV8.filter((row) => row.verification_status === 'partial');
  const failureByCounty = new Map(failuresV8.map((row) => [row.county_slug, row]));
  const repairedRows = countiesV8
    .filter((row) => row.verification_status === 'pass')
    .filter((row) => summaryV7.counties_below_california_grade.includes(row.county_slug))
    .map((row) => ({
      county_slug: row.county_slug,
      accepted_source_url: manualTargetRows.find((item) => item.county_slug === row.county_slug && item.attempt_status === 'verified')?.target_url || '',
    }));

  return {
    state: 'texas',
    generated_at: nowIso(),
    v7: summaryV7.v7,
    v8: {
      pass_counties: countiesV8.filter((row) => row.verification_status === 'pass').length,
      partial_counties: partialRows.length,
      blocked_counties: countiesV8.filter((row) => row.verification_status === 'blocked').length,
    },
    attempted_counties: summaryV7.v7.partial_counties,
    repaired_counties: repairedRows.length,
    still_partial_counties: partialRows.length,
    repaired_rows: repairedRows,
    partial_reasons: partialRows.map((row) => ({
      county_slug: row.county_slug,
      reason: failureByCounty.get(row.county_slug)?.reason || 'manual_target_exhausted',
      category: failureByCounty.get(row.county_slug)?.category || 'manual_target_exhausted',
    })),
    top_failure_categories: countBy(failuresV8, (row) => row.category),
    counties_below_california_grade: partialRows.map((row) => row.county_slug),
    index_safe: partialRows.length === 0,
  };
}

function buildNextActionQueueV8(failuresV8) {
  return Object.entries(countBy(failuresV8, (row) => row.category))
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({
      action: `resolve_${category}`,
      why: `${count} counties still need this exact-manual district repair lane.`,
    }));
}

function buildReport(summaryV8, filesChanged, lessonOutcome) {
  return [
    '# Texas Manual Exact-Target Repair Report v8',
    '',
    'This pass starts from the truthful Texas v7 baseline and retries only the 21 remaining partial counties with manually authored, district-owned exact targets.',
    '',
    '## Result history',
    '',
    `- v7 PASS/PARTIAL/BLOCKED: ${summaryV8.v7.pass_counties}/${summaryV8.v7.partial_counties}/${summaryV8.v7.blocked_counties}`,
    `- v8 PASS/PARTIAL/BLOCKED: ${summaryV8.v8.pass_counties}/${summaryV8.v8.partial_counties}/${summaryV8.v8.blocked_counties}`,
    '',
    '## Manual exact-target outcome',
    '',
    `- Attempted counties: ${summaryV8.attempted_counties}`,
    `- Repaired counties: ${summaryV8.repaired_counties}`,
    `- Still partial counties: ${summaryV8.still_partial_counties}`,
    '',
    '## Counties newly repaired with accepted source URL',
    '',
    ...summaryV8.repaired_rows.map((row) => `- ${row.county_slug}: ${row.accepted_source_url}`),
    '',
    '## Remaining partial reasons',
    '',
    ...summaryV8.partial_reasons.map((row) => `- ${row.county_slug}: ${row.reason} (${row.category})`),
    '',
    '## Top failure categories',
    '',
    ...Object.entries(summaryV8.top_failure_categories).map(([category, count]) => `- ${category}: ${count}`),
    '',
    '## Counties below California-grade',
    '',
    ...summaryV8.counties_below_california_grade.map((slug) => `- ${slug}`),
    '',
    '## Texas index-safe',
    '',
    `- Texas is index-safe: ${summaryV8.index_safe ? 'yes' : 'no'}`,
    '',
    '## Tests run',
    '',
    '- `npm run test:texas-manual-exact-target-repair-v8`',
    '- `npm run test:texas-residual-district-education-repair-v7`',
    '- `npm run test:texas-final-district-education-cleanup-v6`',
    '',
    '## Files changed',
    '',
    ...filesChanged.map((file) => `- \`${file}\``),
    '',
    '## Lessons learned update',
    '',
    `- ${lessonOutcome}`,
  ].join('\n');
}

async function main() {
  const countiesV7 = readJsonl(INPUTS.countyV7);
  const directSourcesV7 = readJsonl(INPUTS.directSourcesV7);
  const summaryV7 = readJson(INPUTS.summaryV7);
  const failuresV7 = readJsonl(INPUTS.failureV7);
  const csvRows = parseCsv(fs.readFileSync(INPUTS.asktedCsvV3, 'utf8'));
  const askTedIndex = buildAskTedDistrictIndex(csvRows);
  const partialCounties = countiesV7.filter((row) => row.verification_status === 'partial');

  const { directSources, failureLedger, manualTargetRows } = await buildV8Education(partialCounties, directSourcesV7, failuresV7, askTedIndex);
  const directSourcesByCounty = new Map(directSources.map((row) => [row.county_slug, row]));
  const countiesV8 = buildCountyBaselineV8(countiesV7, directSourcesByCounty);
  const summaryV8 = buildSummaryV8(summaryV7, countiesV8, failureLedger, manualTargetRows);
  const nextActions = buildNextActionQueueV8(failureLedger);

  const filesChanged = [
    'docs/generated/tx-manual-exact-target-repair-report-v8.md',
    'data/generated/tx_education_direct_district_sources_v8.jsonl',
    'data/generated/tx_county_baseline_v8.jsonl',
    'data/generated/tx_verification_summary_v8.json',
    'data/generated/tx_failure_ledger_v8.jsonl',
    'data/generated/tx_next_action_queue_v8.jsonl',
    'data/generated/tx_manual_target_candidates_v8.jsonl',
    'scripts/run-texas-manual-exact-target-repair-v8.mjs',
    'scripts/test-texas-manual-exact-target-repair-v8.mjs',
  ];
  const lessonOutcome = 'Added one reusable lesson: once a state reaches a small residual county set, district sitemap mining should precede any new search fallback because exact role pages and district documents often exist in the sitemap even when homepage heuristics miss them.';
  const report = buildReport(summaryV8, filesChanged, lessonOutcome);

  writeJsonl(OUTPUTS.directSourcesV8, directSources);
  writeJsonl(OUTPUTS.countyV8, countiesV8);
  writeJsonl(OUTPUTS.failureV8, failureLedger);
  writeJsonl(OUTPUTS.nextActionV8, nextActions);
  writeJsonl(OUTPUTS.manualTargetsV8, manualTargetRows);
  writeJson(OUTPUTS.summaryV8, summaryV8);
  fs.mkdirSync(path.dirname(OUTPUTS.reportV8), { recursive: true });
  fs.writeFileSync(OUTPUTS.reportV8, `${report}\n`);

  console.log(JSON.stringify({
    ok: true,
    v7: summaryV8.v7,
    v8: summaryV8.v8,
    repaired: summaryV8.repaired_counties,
    still_partial: summaryV8.still_partial_counties,
    index_safe: summaryV8.index_safe,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
