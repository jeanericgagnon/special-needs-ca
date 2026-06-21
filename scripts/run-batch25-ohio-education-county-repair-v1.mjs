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

const STATE = 'ohio';
const STATE_CODE = 'OH';

const INPUTS = {
  txSummaryV10: path.join(generatedDir, 'tx_verification_summary_v10.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch25_ohio_repair_summary_v1.json'),
  verifiedLeafs: path.join(generatedDir, 'batch25_ohio_verified_leaf_targets_v1.jsonl'),
  blockers: path.join(generatedDir, 'batch25_ohio_blockers_v1.jsonl'),
  report: path.join(docsGeneratedDir, 'batch25-ohio-repair-report-v1.md'),
};

const USER_RATE_LIMIT_MS = 300;
const COUNTY_DIRECTORY_TARGET = 'https://jfs.ohio.gov/county/county_directory.pdf';
const COUNTY_DIRECTORY_REPLACEMENTS = [
  'https://jfs.ohio.gov/county/',
  'https://jfs.ohio.gov/County/County_Directory.stm',
  'https://odjfs.ohio.gov/',
  'https://jobandfamilyservices.ohio.gov/',
];

const DISTRICT_CANDIDATES = [
  { url: 'https://www.youresc.k12.oh.us/special-education-student-services/', district_name: 'Tri-County ESC' },
  { url: 'https://www.youresc.k12.oh.us/staff-directory/', district_name: 'Tri-County ESC' },
  { url: 'https://www.ashtabulaesc.org/services-1', district_name: 'Ashtabula County ESC' },
  { url: 'https://www.athensmeigs.com/departments/special-education', district_name: 'Athens-Meigs ESC' },
  { url: 'https://www.athensmeigs.com/services/student-services', district_name: 'Athens-Meigs ESC' },
  { url: 'https://www.ecoesc.org/specialeducation/', district_name: 'East Central Ohio ESC' },
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

function uniqueBy(rows, keyFn) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = keyFn(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchUrl(url) {
  try {
    const result = await fetchWithRetry(url, {
      retryCount: 1,
      requestTimeoutMs: 15000,
      bodyTimeoutMs: 15000,
      rateLimitMs: USER_RATE_LIMIT_MS,
    });
    return {
      ok: result.ok,
      status: result.status,
      finalUrl: result.finalUrl || url,
      body: result.body,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      finalUrl: url,
      body: '',
      fetchedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function extractTextSignals(html) {
  const $ = cheerio.load(String(html || ''));
  const title = sanitizeText($('title').first().text());
  const headings = $('h1,h2,h3').toArray().map((el) => sanitizeText($(el).text())).filter(Boolean).slice(0, 12);
  const snippet = sanitizeText($('body').text()).slice(0, 1600);
  return { title, headings, snippet };
}

export function verifyOhioDistrictLeaf(url, html, finalUrl, fetchedAt, districtName = '') {
  const { title, headings, snippet } = extractTextSignals(html);
  const blob = `${title} ${headings.join(' ')} ${snippet} ${finalUrl}`.toLowerCase();
  const roleTerms = [
    'special education',
    'student services',
    'staff directory',
    'related services',
    'parent mentor',
    'special needs',
  ];
  const matchedRoleTerms = roleTerms.filter((term) => blob.includes(term));
  const domain = (() => {
    try {
      return new URL(finalUrl).hostname.toLowerCase();
    } catch {
      return '';
    }
  })();
  const districtOwned = /(youresc\.k12\.oh\.us|ashtabulaesc\.org|athensmeigs\.com|ecoesc\.org)$/i.test(domain);
  if (!districtOwned || matchedRoleTerms.length === 0) return null;
  return {
    state: STATE,
    state_code: STATE_CODE,
    family: 'district_or_county_education_routing',
    district_name: districtName,
    source_url: url,
    final_url: finalUrl,
    fetched_at: fetchedAt,
    evidence_title: title,
    evidence_headings: headings.slice(0, 6),
    evidence_snippet: snippet,
    evidence_terms_found: matchedRoleTerms,
    verification_status: 'verified',
    source_type: 'exact_leaf_target',
    source_table: 'batch25_ohio_verified_leaf_targets',
  };
}

export function classifyOhioCountyDirectoryAttempts(attempts) {
  const dead404 = attempts.filter((attempt) => attempt.status === 404);
  const dnsOrNetwork = attempts.filter((attempt) => !attempt.status && attempt.error);
  if (dead404.length && dead404.length + dnsOrNetwork.length === attempts.length) {
    return {
      blocker_code: 'official_county_directory_targets_unresolved_after_bounded_live_check',
      reason: `Bounded official county directory targets failed: ${attempts.map((attempt) => `${attempt.url} => ${attempt.status || attempt.error}`).join('; ')}`,
    };
  }
  return {
    blocker_code: attempts.some((attempt) => attempt.ok)
      ? 'official_county_directory_target_requires_followup_parsing'
      : 'official_county_directory_targets_unresolved_after_bounded_live_check',
    reason: `County directory attempts: ${attempts.map((attempt) => `${attempt.url} => ${attempt.status || attempt.error}`).join('; ')}`,
  };
}

function updateGapRows(gapRows, exactDistrictLeafs) {
  return gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing' && exactDistrictLeafs.length) {
      return {
        ...row,
        family_status: 'exact_leaf_targets_verified_partial',
        status_reason: `Reviewed district-owned education exact leaves verified (${exactDistrictLeafs.length}) across multiple Ohio ESC domains, but broader county/district mapping still requires expansion before California-grade proof.`,
      };
    }
    return row;
  });
}

function updateFailureRows(failureRows, exactDistrictLeafs, countyBlocker) {
  const nextRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing' && exactDistrictLeafs.length) {
      return {
        ...row,
        failure_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
        evidence: `Verified exact leaf targets: ${exactDistrictLeafs.map((leaf) => leaf.final_url).join(', ')}`,
        next_action: 'expand_verified_leaf_targets_into_county_or_district_mapping',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: countyBlocker.blocker_code,
        evidence: countyBlocker.reason,
        next_action: countyBlocker.blocker_code === 'official_county_directory_target_requires_followup_parsing'
          ? 'parse_or_extract_official_county_directory_replacement'
          : 'author_or_verify_live_official_county_directory_replacement',
      };
    }
    return row;
  });

  return nextRows.sort((a, b) => {
    if (a.family === 'county_local_disability_resources') return -1;
    if (b.family === 'county_local_disability_resources') return 1;
    return 0;
  });
}

function updateVerifiedSources(verifiedRows, exactDistrictLeafs, countyBlocker) {
  return verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing' && exactDistrictLeafs.length) {
      return {
        ...row,
        family_status: 'exact_leaf_targets_verified_partial',
        evidence_strength: 'medium',
        sample_count: exactDistrictLeafs.length,
        query_basis: `${row.query_basis}; Batch 25 Ohio district exact repair`,
        blocker_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
        blocker_evidence: 'Verified ESC-owned exact leaves now span multiple Ohio domains, but broader county-grade district mapping is still incomplete.',
        samples: exactDistrictLeafs.map((leaf) => ({
          sample_name: leaf.evidence_title || leaf.final_url,
          source_url: leaf.final_url,
          verification_status: 'verified',
          source_type: 'exact_leaf_target',
          source_table: 'batch25_ohio_verified_leaf_targets',
        })),
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        blocker_code: countyBlocker.blocker_code,
        blocker_evidence: countyBlocker.reason,
      };
    }
    return row;
  });
}

function recalcSummary(summary, gapRows, failureRows, verifiedRows) {
  const criticalRows = gapRows.filter((row) => row.critical);
  const strong = criticalRows.filter((row) => String(row.family_status || '').startsWith('verified_')).length;
  const missing = criticalRows.filter((row) => row.family_status === 'missing').length;
  const weak = criticalRows.length - strong - missing;
  return {
    ...summary,
    completeness_pct: Math.floor((strong / criticalRows.length) * 100),
    strong_critical_families: strong,
    weak_critical_families: weak,
    missing_critical_families: missing,
    critical_gap_families: failureRows.filter((row) => row.severity === 'critical').map((row) => row.family),
    major_gap_families: failureRows.filter((row) => row.severity === 'major').map((row) => row.family),
    primary_gap_reason: failureRows[0]?.failure_code || summary.primary_gap_reason,
    verified_source_families_with_samples: verifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: summary.classification === 'COMPLETE' && summary.index_safe,
  };
}

function updateNextRows(nextRows, countyBlocker) {
  const remapped = nextRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: countyBlocker.blocker_code,
        next_action: countyBlocker.blocker_code === 'official_county_directory_target_requires_followup_parsing'
          ? 'parse_or_extract_official_county_directory_replacement'
          : 'author_or_verify_live_official_county_directory_replacement',
        evidence: countyBlocker.reason,
      };
    }
    return row;
  });
  return remapped
    .sort((a, b) => {
      if (a.family === 'county_local_disability_resources') return -1;
      if (b.family === 'county_local_disability_resources') return 1;
      return a.priority_rank - b.priority_rank;
    })
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));
}

function updateStateReport(reportText, exactDistrictLeafs, countyBlocker) {
  const lines = [...reportText.trimEnd().split('\n'), '', '## Batch 25 Ohio repair', ''];
  if (exactDistrictLeafs.length) {
    lines.push(`- district_or_county_education_routing: verified ESC-owned exact leaves -> ${exactDistrictLeafs.map((leaf) => leaf.final_url).join(', ')}`);
  }
  lines.push(`- county_local_disability_resources: ${countyBlocker.reason}`);
  lines.push('', '- Ohio remains BLOCKED and not index-safe until every critical family reaches California-grade proof.');
  return `${lines.join('\n')}\n`;
}

function buildBatchReport(summary, countyBlocker) {
  return [
    '# Batch 25 Ohio Repair Report v1',
    '',
    'This pass uses only existing Ohio packet roots plus bounded live verification. It expands Ohio ESC exact leaves for district routing and replaces the stale county-local directory claim with a live official-target blocker when the configured county directory no longer resolves.',
    '',
    `- district_exact_leaves_verified: ${summary.district_exact_leaves_verified}`,
    `- county_local_blocker_code: ${countyBlocker.blocker_code}`,
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
  ].join('\n');
}

export async function generateBatch25OhioEducationCountyRepairV1() {
  const txSummaryV10 = readJson(INPUTS.txSummaryV10);
  if (txSummaryV10.v10.pass_counties !== 254 || txSummaryV10.index_safe !== true) {
    throw new Error('Batch 25 requires Texas v10 truth preserved.');
  }

  const summaryRel = 'data/generated/ohio_california_grade_summary_v2.json';
  const gapRel = 'data/generated/ohio_gap_matrix_v2.jsonl';
  const failureRel = 'data/generated/ohio_failure_ledger_v2.jsonl';
  const verifiedRel = 'data/generated/ohio_verified_sources_v1.jsonl';
  const nextRel = 'data/generated/ohio_next_action_queue_v2.jsonl';
  const reportRel = 'docs/generated/ohio-california-grade-audit-report-v2.md';

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

  const verifiedLeafs = [];
  const blockers = [];

  const countyAttempts = [];
  for (const url of [COUNTY_DIRECTORY_TARGET, ...COUNTY_DIRECTORY_REPLACEMENTS]) {
    const fetched = await fetchUrl(url);
    countyAttempts.push({
      url,
      status: fetched.status,
      finalUrl: fetched.finalUrl,
      error: fetched.error || null,
      ok: fetched.ok,
    });
    await new Promise((resolve) => setTimeout(resolve, USER_RATE_LIMIT_MS));
  }

  const countyBlocker = classifyOhioCountyDirectoryAttempts(countyAttempts);
  blockers.push({
    family: 'county_local_disability_resources',
    blocker_code: countyBlocker.blocker_code,
    source_url: COUNTY_DIRECTORY_TARGET,
    reason: countyBlocker.reason,
  });

  for (const candidate of DISTRICT_CANDIDATES) {
    const fetched = await fetchUrl(candidate.url);
    if (!fetched.ok) {
      blockers.push({
        family: 'district_or_county_education_routing',
        blocker_code: 'district_exact_leaf_fetch_failed',
        source_url: candidate.url,
        reason: fetched.error || `HTTP ${fetched.status}`,
      });
      await new Promise((resolve) => setTimeout(resolve, USER_RATE_LIMIT_MS));
      continue;
    }
    const verified = verifyOhioDistrictLeaf(
      candidate.url,
      String(fetched.body || ''),
      fetched.finalUrl,
      fetched.fetchedAt,
      candidate.district_name,
    );
    if (verified) {
      verifiedLeafs.push(verified);
    } else {
      blockers.push({
        family: 'district_or_county_education_routing',
        blocker_code: 'district_exact_leaf_verification_failed',
        source_url: candidate.url,
        reason: `Live ESC-owned page on ${candidate.district_name} did not preserve enough district-routing evidence to verify.`,
      });
    }
    await new Promise((resolve) => setTimeout(resolve, USER_RATE_LIMIT_MS));
  }

  const exactDistrictLeafs = uniqueBy(verifiedLeafs, (row) => row.final_url);
  const updatedGaps = updateGapRows(gapRows, exactDistrictLeafs);
  const updatedFailures = updateFailureRows(failureRows, exactDistrictLeafs, countyBlocker);
  const updatedVerified = updateVerifiedSources(verifiedRows, exactDistrictLeafs, countyBlocker);
  const updatedNext = updateNextRows(nextRows, countyBlocker);
  const updatedSummary = recalcSummary(summary, updatedGaps, updatedFailures, updatedVerified);
  const updatedReport = updateStateReport(reportText, exactDistrictLeafs, countyBlocker);

  writeJson(summaryPath, updatedSummary);
  writeJsonl(gapPath, updatedGaps);
  writeJsonl(failurePath, updatedFailures);
  writeJsonl(verifiedPath, updatedVerified);
  writeJsonl(nextPath, updatedNext);
  fs.writeFileSync(reportPath, updatedReport);

  const batchSummary = {
    batch: 'batch_25_ohio_repair_v1',
    generated_at: new Date().toISOString(),
    state: STATE,
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    district_exact_leaves_verified: exactDistrictLeafs.length,
    county_local_blocker_code: countyBlocker.blocker_code,
    texas_preserved_complete: true,
  };

  writeJsonl(OUTPUTS.verifiedLeafs, exactDistrictLeafs);
  writeJsonl(OUTPUTS.blockers, blockers);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, `${buildBatchReport(batchSummary, countyBlocker)}\n`);

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch25OhioEducationCountyRepairV1()
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
