import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { fetchWithRetry } from './source-acquisition-fetch-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  batch19Queue: path.join(generatedDir, 'batch19_county_district_leaf_authoring_queue_v1.jsonl'),
  txSummaryV10: path.join(generatedDir, 'tx_verification_summary_v10.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch20_leaf_target_verification_summary_v1.json'),
  verifiedTargets: path.join(generatedDir, 'batch20_verified_leaf_targets_v1.jsonl'),
  blockedTargets: path.join(generatedDir, 'batch20_blocked_leaf_targets_v1.jsonl'),
  report: path.join(docsGeneratedDir, 'batch20-leaf-target-verification-report-v1.md'),
};

const USER_RATE_LIMIT_MS = 400;
const MAX_ROOTS_PER_PACKET = 4;
const MAX_CANDIDATES_PER_ROOT = 6;
const MAX_FETCHES_PER_PACKET = 12;
const TERM_SCORE_WEIGHT = 5;
const PATH_SCORE_WEIGHT = 3;
const HOMEPAGE_PENALTY = 20;

const FAMILY_REQUIRED_TERMS = {
  early_intervention_part_c: ['referral', 'intake', 'eligibility', 'provider', 'contact', 'complaint', 'family rights'],
  developmental_disability_idd_authority: ['regional', 'county', 'field office', 'office', 'eligibility', 'intake', 'appeal', 'complaint', 'contact'],
  district_or_county_education_routing: ['special education', 'student services', 'exceptional', 'procedural safeguards', 'parent rights', 'staff directory', 'contact', 'special services'],
  county_local_disability_resources: ['office', 'location', 'contact', 'directory', 'phone', 'services', 'county office'],
};

const GENERIC_STATEWIDE_PATH_PATTERNS = [
  /\/agencies\/[^/]+\/?$/i,
  /\/services\/?$/i,
  /\/about\/?$/i,
  /\/locations\/?$/i,
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readCommittedFile(relativePath) {
  return execFileSync('git', ['show', `HEAD:${relativePath}`], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

function readCommittedJson(relativePath) {
  return JSON.parse(readCommittedFile(relativePath));
}

function readCommittedJsonl(relativePath) {
  return readCommittedFile(relativePath)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
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

function sanitizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function normalizeUrl(raw) {
  if (!raw) return '';
  try {
    const url = new URL(raw);
    url.hash = '';
    return url.toString();
  } catch {
    return '';
  }
}

function normalizeHost(value) {
  return String(value || '').toLowerCase().replace(/^www\./, '');
}

function getHost(url) {
  try {
    return normalizeHost(new URL(url).hostname);
  } catch {
    return '';
  }
}

function sameDomain(a, b) {
  return a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);
}

function pathLooksGeneric(url) {
  try {
    const parsed = new URL(url);
    return parsed.pathname === '/' || parsed.pathname === '';
  } catch {
    return true;
  }
}

function pathContainsTerms(url, terms) {
  const lower = url.toLowerCase();
  return terms.filter((term) => lower.includes(term.toLowerCase()));
}

function blobContainsTerms(blob, terms) {
  const lower = sanitizeText(blob).toLowerCase();
  return terms.filter((term) => lower.includes(term.toLowerCase()));
}

function extractSitemaps(robotsText) {
  return robotsText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^sitemap:/i.test(line))
    .map((line) => normalizeUrl(line.replace(/^sitemap:\s*/i, '')))
    .filter(Boolean);
}

function extractSitemapLocs(xml) {
  return [...String(xml || '').matchAll(/<loc>(.*?)<\/loc>/gi)]
    .map((match) => sanitizeText(match[1]))
    .map(normalizeUrl)
    .filter(Boolean);
}

async function fetchText(url, options = {}) {
  try {
    return await fetchWithRetry(url, {
      retryCount: 1,
      requestTimeoutMs: options.requestTimeoutMs || 10000,
      bodyTimeoutMs: options.bodyTimeoutMs || 10000,
      rateLimitMs: USER_RATE_LIMIT_MS,
    });
  } catch (error) {
    return {
      ok: false,
      status: 0,
      finalUrl: url,
      contentType: '',
      body: '',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function collectHomepageCandidates(rootUrl, html, terms) {
  const $ = cheerio.load(html);
  const candidates = [];
  $('a[href]').each((_, el) => {
    const href = normalizeUrl(new URL($(el).attr('href'), rootUrl).toString());
    const anchorText = sanitizeText($(el).text());
    if (!href) return;
    const termHits = [...new Set([
      ...pathContainsTerms(href, terms),
      ...blobContainsTerms(anchorText, terms),
    ])];
    if (termHits.length === 0) return;
    candidates.push({
      url: href,
      discovery_method: 'homepage_link',
      anchor_text: anchorText,
      term_hits: termHits,
    });
  });
  return candidates;
}

function scoreCandidate(url, fetchResult, packet, discoveryMethod, seedTermHits = []) {
  const headerBlob = sanitizeText(`${fetchResult.title || ''} ${(fetchResult.headings || []).join(' ')}`);
  const bodyBlob = sanitizeText(`${headerBlob} ${fetchResult.snippet || ''}`);
  const termHits = [...new Set([
    ...seedTermHits,
    ...blobContainsTerms(bodyBlob, packet.exact_target_terms),
    ...pathContainsTerms(url, packet.exact_target_terms),
  ])];
  const goalHits = blobContainsTerms(bodyBlob, packet.exact_target_goals);
  let score = termHits.length * TERM_SCORE_WEIGHT + goalHits.length * 2;
  if (!pathLooksGeneric(url)) score += PATH_SCORE_WEIGHT;
  if (discoveryMethod === 'sitemap') score += 2;
  if (pathLooksGeneric(url)) score -= HOMEPAGE_PENALTY;
  return { termHits, goalHits, score };
}

export function verifyCandidate(url, fetchResult, packet, discoveryMethod, seedTermHits = []) {
  const finalUrl = fetchResult.finalUrl || url;
  const finalHost = getHost(finalUrl);
  const expectedHosts = packet.root_domains_to_review.map((row) => normalizeHost(row.source_domain));
  const sameFamilyDomain = expectedHosts.some((host) => sameDomain(finalHost, host));
  if (!sameFamilyDomain) return { verified: false, reason: 'off_domain' };
  if (!fetchResult.ok) return { verified: false, reason: `fetch_failed_${fetchResult.status || '0'}` };
  if (!/html|pdf/i.test(fetchResult.contentType || '')) return { verified: false, reason: 'unsupported_content_type' };
  if (pathLooksGeneric(finalUrl)) return { verified: false, reason: 'generic_root_only' };

  const textBlob = typeof fetchResult.body === 'string'
    ? fetchResult.body
    : Buffer.isBuffer(fetchResult.body) ? fetchResult.body.toString('utf8') : '';
  const title = /html/i.test(fetchResult.contentType || '')
    ? sanitizeText(cheerio.load(textBlob)('title').first().text())
    : '';
  const headings = /html/i.test(fetchResult.contentType || '')
    ? cheerio.load(textBlob)('h1,h2,h3').toArray().map((el) => sanitizeText(cheerio.load(textBlob)(el).text())).filter(Boolean).slice(0, 8)
    : [];
  const snippet = sanitizeText(/html/i.test(fetchResult.contentType || '')
    ? cheerio.load(textBlob)('body').text()
    : textBlob).slice(0, 1000);
  const scored = scoreCandidate(finalUrl, { title, headings, snippet }, packet, discoveryMethod, seedTermHits);
  const requiredTermHits = blobContainsTerms(
    `${title} ${headings.join(' ')} ${snippet} ${finalUrl}`,
    FAMILY_REQUIRED_TERMS[packet.family] || packet.exact_target_terms,
  );
  if (scored.termHits.length === 0 || requiredTermHits.length === 0) return { verified: false, reason: 'missing_role_terms' };

  if (GENERIC_STATEWIDE_PATH_PATTERNS.some((pattern) => pattern.test(finalUrl)) && requiredTermHits.length < 2) {
    return { verified: false, reason: 'generic_statewide_landing' };
  }

  if (packet.family === 'county_local_disability_resources') {
    const localSignals = blobContainsTerms(`${title} ${headings.join(' ')} ${finalUrl}`, ['office', 'location', 'directory', 'phone', 'county', 'locations']);
    if (/\/agencies\//i.test(finalUrl)) return { verified: false, reason: 'generic_statewide_landing' };
    if (localSignals.length === 0) return { verified: false, reason: 'missing_local_office_signal' };
  }

  if (packet.family === 'district_or_county_education_routing') {
    const districtSignals = blobContainsTerms(`${title} ${headings.join(' ')} ${snippet} ${finalUrl}`, ['special education', 'student services', 'exceptional', 'procedural safeguards', 'parent rights', 'staff', 'directory', 'contact']);
    if (districtSignals.length === 0) return { verified: false, reason: 'missing_district_signal' };
  }

  if (packet.family === 'developmental_disability_idd_authority') {
    const localDdSignals = blobContainsTerms(`${title} ${headings.join(' ')} ${finalUrl}`, ['regional', 'county', 'field office', 'office', 'locations', 'region']);
    if (/\/about\//i.test(finalUrl)) return { verified: false, reason: 'generic_statewide_landing' };
    if (localDdSignals.length === 0) return { verified: false, reason: 'missing_dd_local_signal' };
  }

  return {
    verified: true,
    reason: null,
    title,
    headings,
    snippet,
    termHits: scored.termHits,
    goalHits: scored.goalHits,
    score: scored.score + requiredTermHits.length,
  };
}

async function discoverPacketCandidates(packet) {
  const verified = [];
  const blocked = [];
  let fetchBudget = 0;

  for (const root of packet.root_domains_to_review.slice(0, MAX_ROOTS_PER_PACKET)) {
    if (fetchBudget >= MAX_FETCHES_PER_PACKET) break;
    const rootUrl = root.source_root;
    const rootFetch = await fetchText(rootUrl);
    fetchBudget += 1;

    const rootCandidates = [];
    if (rootFetch.ok && /html/i.test(rootFetch.contentType || '') && typeof rootFetch.body === 'string') {
      rootCandidates.push(...collectHomepageCandidates(rootUrl, rootFetch.body, packet.exact_target_terms));
    } else {
      blocked.push({
        state: packet.state,
        family: packet.family,
        root_url: rootUrl,
        reason: rootFetch.ok ? 'non_html_root' : `root_fetch_failed_${rootFetch.status || '0'}`,
      });
    }

    if (fetchBudget >= MAX_FETCHES_PER_PACKET) break;
    const robotsUrl = normalizeUrl(new URL('/robots.txt', rootUrl).toString());
    const robotsFetch = await fetchText(robotsUrl, { requestTimeoutMs: 7000, bodyTimeoutMs: 7000 });
    fetchBudget += 1;
    const sitemapUrls = [];
    if (robotsFetch.ok && typeof robotsFetch.body === 'string') {
      sitemapUrls.push(...extractSitemaps(robotsFetch.body));
    }
    if (sitemapUrls.length === 0) {
      sitemapUrls.push(normalizeUrl(new URL('/sitemap.xml', rootUrl).toString()));
    }

    for (const sitemapUrl of sitemapUrls.slice(0, 2)) {
      if (fetchBudget >= MAX_FETCHES_PER_PACKET) break;
      const sitemapFetch = await fetchText(sitemapUrl, { requestTimeoutMs: 8000, bodyTimeoutMs: 8000 });
      fetchBudget += 1;
      if (!sitemapFetch.ok || typeof sitemapFetch.body !== 'string') continue;
      const locs = extractSitemapLocs(sitemapFetch.body)
        .filter((candidateUrl) => sameDomain(getHost(candidateUrl), root.source_domain))
        .map((candidateUrl) => ({
          url: candidateUrl,
          discovery_method: 'sitemap',
          anchor_text: 'sitemap loc',
          term_hits: pathContainsTerms(candidateUrl, packet.exact_target_terms),
        }))
        .filter((row) => row.term_hits.length > 0);
      rootCandidates.push(...locs);
    }

    const deduped = [];
    const seen = new Set();
    for (const candidate of rootCandidates) {
      const normalized = normalizeUrl(candidate.url);
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      deduped.push({ ...candidate, url: normalized });
    }

    const ranked = deduped
      .map((candidate) => ({
        ...candidate,
        preliminary_score: candidate.term_hits.length * TERM_SCORE_WEIGHT + (pathLooksGeneric(candidate.url) ? -HOMEPAGE_PENALTY : PATH_SCORE_WEIGHT),
      }))
      .sort((a, b) => b.preliminary_score - a.preliminary_score)
      .slice(0, MAX_CANDIDATES_PER_ROOT);

    for (const candidate of ranked) {
      if (fetchBudget >= MAX_FETCHES_PER_PACKET) break;
      const fetchResult = await fetchText(candidate.url);
      fetchBudget += 1;
      const verdict = verifyCandidate(candidate.url, fetchResult, packet, candidate.discovery_method, candidate.term_hits);
      if (verdict.verified) {
        verified.push({
          state: packet.state,
          state_code: packet.state_code,
          family: packet.family,
          source_role: packet.family,
          candidate_url: candidate.url,
          final_url: fetchResult.finalUrl || candidate.url,
          discovery_method: candidate.discovery_method,
          source_domain: getHost(fetchResult.finalUrl || candidate.url),
          title: verdict.title,
          headings: verdict.headings,
          snippet: verdict.snippet,
          term_hits: verdict.termHits,
          goal_hits: verdict.goalHits,
          score: verdict.score,
        });
      } else {
        blocked.push({
          state: packet.state,
          family: packet.family,
          root_url: rootUrl,
          candidate_url: candidate.url,
          reason: verdict.reason,
        });
      }
    }
  }

  const dedupedVerified = [];
  const seenVerified = new Set();
  for (const row of verified.sort((a, b) => b.score - a.score)) {
    const key = `${row.state}::${row.family}::${row.final_url}`;
    if (seenVerified.has(key)) continue;
    seenVerified.add(key);
    dedupedVerified.push(row);
  }
  return { verified: dedupedVerified.slice(0, 3), blocked };
}

function updateGapRows(gapRows, verifiedByFamily) {
  return gapRows.map((row) => {
    const matches = verifiedByFamily.get(row.family) || [];
    if (!matches.length) return row;
    return {
      ...row,
      family_status: 'exact_leaf_targets_verified_partial',
      status_reason: `Reviewed exact leaf targets verified (${matches.length}) but broader county/district mapping still requires expansion before California-grade proof.`,
    };
  });
}

function updateFailureRows(failureRows, verifiedByFamily) {
  return failureRows.map((row) => {
    const matches = verifiedByFamily.get(row.family) || [];
    if (!matches.length) return row;
    return {
      ...row,
      failure_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
      evidence: `Verified exact leaf targets: ${matches.map((match) => match.final_url).join(', ')}`,
      next_action: 'expand_verified_leaf_targets_into_county_or_district_mapping',
    };
  });
}

function updateVerifiedSources(verifiedSources, verifiedByFamily) {
  return verifiedSources.map((row) => {
    const matches = verifiedByFamily.get(row.family) || [];
    if (!matches.length) return row;
    return {
      ...row,
      family_status: 'exact_leaf_targets_verified_partial',
      evidence_strength: 'medium',
      sample_count: matches.length,
      query_basis: `${row.query_basis}; Batch 20 verified exact leaf targets`,
      blocker_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
      blocker_evidence: `Verified exact leaf targets exist but statewide/countywide coverage still needs expansion.`,
      samples: matches.map((match) => ({
        sample_name: match.title || match.final_url,
        source_url: match.final_url,
        verification_status: 'verified',
        source_type: 'exact_leaf_target',
        source_table: 'batch20_verified_leaf_targets',
      })),
    };
  });
}

function updateNextActions(nextActions, verifiedByFamily) {
  return nextActions.map((row) => {
    const matches = verifiedByFamily.get(row.family) || [];
    if (!matches.length) return row;
    return {
      ...row,
      failure_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
      next_action: 'expand_verified_leaf_targets_into_county_or_district_mapping',
      evidence: `Verified exact leaf targets: ${matches.map((match) => match.final_url).join(', ')}`,
    };
  });
}

function updateStateReport(reportText, summary, verifiedByFamily) {
  const lines = [
    ...reportText.trimEnd().split('\n'),
    '',
    '## Batch 20 exact leaf verification',
    '',
  ];
  const families = [...verifiedByFamily.keys()];
  if (!families.length) {
    lines.push('- No new exact leaf targets verified in Batch 20.');
  } else {
    for (const family of families) {
      const matches = verifiedByFamily.get(family) || [];
      lines.push(`- ${family}: verified exact leaf targets -> ${matches.map((match) => match.final_url).join(', ')}`);
    }
  }
  lines.push('');
  lines.push(`- ${summary.state_name} remains ${summary.classification} and ${summary.index_safe ? 'index-safe' : 'not index-safe'} until every critical family passes county-grade proof.`);
  return `${lines.join('\n')}\n`;
}

function buildBatchReport(summary) {
  return [
    '# Batch 20 Leaf Target Verification Report v1',
    '',
    'This pass uses the Batch 19 root-domain packets to fetch and verify exact county/district leaf targets for CA/PA/FL/GA/OH. It replaces generic-root evidence where exact leaves were verified, but it does not promote any state to COMPLETE unless every critical family actually passes.',
    '',
    '## State results',
    '',
    ...summary.states.map((row) => `- ${row.state}: verified_leaf_targets=${row.verified_leaf_targets}; repaired_families=${row.repaired_families.join(', ') || 'none'}; classification=${row.classification}; index_safe=${row.index_safe}`),
    '',
    '## Outcome',
    '',
    '- Texas remains COMPLETE/index_safe and was not modified.',
    '- States with verified exact leaves still remain gated until county/district coverage is fully re-proved.',
  ].join('\n');
}

export async function generateBatch20LeafTargetVerificationV1() {
  const batch19Queue = readJsonl(INPUTS.batch19Queue);
  const txSummaryV10 = readJson(INPUTS.txSummaryV10);
  if (txSummaryV10.v10.pass_counties !== 254 || txSummaryV10.index_safe !== true) {
    throw new Error('Batch 20 requires Texas v10 truth preserved.');
  }

  const allVerified = [];
  const allBlocked = [];
  const stateResults = [];

  for (const packet of batch19Queue) {
    const result = await discoverPacketCandidates(packet);
    allVerified.push(...result.verified);
    allBlocked.push(...result.blocked);
    await new Promise((resolve) => setTimeout(resolve, USER_RATE_LIMIT_MS));
  }

  const states = [...new Set(batch19Queue.map((row) => row.state))];
  for (const state of states) {
    const summaryRel = `data/generated/${state}_california_grade_summary_v2.json`;
    const gapRel = `data/generated/${state}_gap_matrix_v2.jsonl`;
    const failureRel = `data/generated/${state}_failure_ledger_v2.jsonl`;
    const verifiedRel = `data/generated/${state}_verified_sources_v1.jsonl`;
    const nextRel = `data/generated/${state}_next_action_queue_v2.jsonl`;
    const reportRel = `docs/generated/${state}-california-grade-audit-report-v2.md`;

    const summaryPath = path.join(repoRoot, summaryRel);
    const gapPath = path.join(repoRoot, gapRel);
    const failurePath = path.join(repoRoot, failureRel);
    const verifiedPath = path.join(repoRoot, verifiedRel);
    const nextPath = path.join(repoRoot, nextRel);
    const reportPath = path.join(repoRoot, reportRel);

    const summary = readCommittedJson(summaryRel);
    const gapRows = readCommittedJsonl(gapRel);
    const failureRows = readCommittedJsonl(failureRel);
    const verifiedRows = readCommittedJsonl(verifiedRel);
    const nextRows = readCommittedJsonl(nextRel);
    const reportText = readCommittedFile(reportRel);

    const stateVerified = allVerified.filter((row) => row.state === state);
    const verifiedByFamily = new Map();
    for (const row of stateVerified) {
      if (!verifiedByFamily.has(row.family)) verifiedByFamily.set(row.family, []);
      verifiedByFamily.get(row.family).push(row);
    }

    const updatedGaps = updateGapRows(gapRows, verifiedByFamily);
    const updatedFailures = updateFailureRows(failureRows, verifiedByFamily);
    const updatedVerifiedRows = updateVerifiedSources(verifiedRows, verifiedByFamily);
    const updatedNextRows = updateNextActions(nextRows, verifiedByFamily);
    const updatedReport = updateStateReport(reportText, summary, verifiedByFamily);

    writeJsonl(gapPath, updatedGaps);
    writeJsonl(failurePath, updatedFailures);
    writeJsonl(verifiedPath, updatedVerifiedRows);
    writeJsonl(nextPath, updatedNextRows);
    fs.writeFileSync(reportPath, updatedReport);

    stateResults.push({
      state,
      classification: summary.classification,
      index_safe: summary.index_safe,
      verified_leaf_targets: stateVerified.length,
      repaired_families: [...verifiedByFamily.keys()],
    });
  }

  const summary = {
    batch: 'batch_20_leaf_target_verification_v1',
    generated_at: new Date().toISOString(),
    states: stateResults,
    total_verified_leaf_targets: allVerified.length,
    total_blocked_leaf_targets: allBlocked.length,
    texas_preserved_complete: true,
  };

  writeJson(OUTPUTS.summary, summary);
  writeJsonl(OUTPUTS.verifiedTargets, allVerified);
  writeJsonl(OUTPUTS.blockedTargets, allBlocked);
  fs.writeFileSync(OUTPUTS.report, `${buildBatchReport(summary)}\n`);

  return summary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch20LeafTargetVerificationV1()
    .then((summary) => {
      console.log(JSON.stringify({
        ok: true,
        totalVerifiedLeafTargets: summary.total_verified_leaf_targets,
        states: summary.states,
      }, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
