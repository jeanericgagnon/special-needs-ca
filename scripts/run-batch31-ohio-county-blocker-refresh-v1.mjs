import fs from 'fs';
import path from 'path';
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
  summary: path.join(generatedDir, 'batch31_ohio_repair_summary_v1.json'),
  blockers: path.join(generatedDir, 'batch31_ohio_blockers_v1.jsonl'),
  report: path.join(docsGeneratedDir, 'batch31-ohio-repair-report-v1.md'),
};

const USER_RATE_LIMIT_MS = 300;
const COUNTY_DIRECTORY_TARGETS = [
  'https://jfs.ohio.gov/county/county_directory.pdf',
  'https://jfs.ohio.gov/county/',
  'https://jfs.ohio.gov/County/County_Directory.stm',
  'https://odjfs.ohio.gov/',
  'https://jobandfamilyservices.ohio.gov/',
  'https://jobandfamilyservices.ohio.gov/wps/portal/gov/jfs/',
  'https://odjfs.ohio.gov/wps/portal/gov/odjfs/',
  'https://jobandfamilyservices.ohio.gov/county-agencies',
  'https://jfs.ohio.gov/wps/portal/gov/jfs/county-agencies',
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

async function fetchUrl(url) {
  try {
    const result = await fetchWithRetry(url, {
      retryCount: 1,
      requestTimeoutMs: 15000,
      bodyTimeoutMs: 15000,
      rateLimitMs: USER_RATE_LIMIT_MS,
    });
    return {
      url,
      ok: result.ok,
      status: result.status,
      finalUrl: result.finalUrl || url,
      body: result.body,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: typeof error?.statusCode === 'number' ? error.statusCode : null,
      finalUrl: url,
      body: '',
      fetchedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function classifyOhioCountyDirectoryBlocker(attempts) {
  const statuses = attempts.map((attempt) => `${attempt.url} => ${attempt.status || attempt.error}`);
  const hasOnly404OrDns = attempts.every((attempt) => {
    if (attempt.status === 404) return true;
    if (!attempt.status && attempt.error && /nodename nor servname|not known|name resolution|fetch failed/i.test(attempt.error)) return true;
    return false;
  });
  if (hasOnly404OrDns) {
    return {
      blocker_code: 'official_county_directory_targets_unresolved_after_bounded_live_check',
      reason: `Bounded official county directory targets failed: ${statuses.join('; ')}`,
    };
  }
  return {
    blocker_code: 'official_county_directory_replacement_requires_manual_review',
    reason: `Bounded official county directory recheck returned mixed outcomes: ${statuses.join('; ')}`,
  };
}

function updateFailureRows(failureRows, countyBlocker) {
  return failureRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: countyBlocker.blocker_code,
        evidence: countyBlocker.reason,
        next_action: 'author_or_verify_live_official_county_directory_replacement',
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
        next_action: 'expand_verified_leaf_targets_into_county_or_district_mapping',
      };
    }
    return row;
  });
}

function updateVerifiedSources(verifiedRows, countyBlocker) {
  return verifiedRows.map((row) => {
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

function updateNextRows(nextRows, countyBlocker, districtEvidence) {
  return nextRows.map((row, index) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        priority_rank: index + 1,
        failure_code: countyBlocker.blocker_code,
        next_action: 'author_or_verify_live_official_county_directory_replacement',
        evidence: countyBlocker.reason,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        priority_rank: index + 1,
        failure_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
        next_action: 'expand_verified_leaf_targets_into_county_or_district_mapping',
        evidence: districtEvidence,
      };
    }
    return {
      ...row,
      priority_rank: index + 1,
    };
  });
}

function recalcSummary(summary, failureRows, verifiedRows) {
  return {
    ...summary,
    primary_gap_reason: failureRows[0]?.failure_code || summary.primary_gap_reason,
    critical_gap_families: failureRows.filter((row) => row.severity === 'critical').map((row) => row.family),
    major_gap_families: failureRows.filter((row) => row.severity === 'major').map((row) => row.family),
    verified_source_families_with_samples: verifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: summary.classification === 'COMPLETE' && summary.index_safe,
  };
}

function updateStateReport(reportText, countyBlocker) {
  const lines = [...reportText.trimEnd().split('\n'), '', '## Batch 31 Ohio county blocker refresh', ''];
  lines.push(`- county_local_disability_resources: ${countyBlocker.reason}`);
  lines.push('- district_or_county_education_routing: queue wording refreshed to keep the live exact-leaf expansion lane as the active next action.');
  lines.push('- No new reusable lesson was promoted from Batch 31; the existing dead-official-directory and fail-closed county-local lessons remain authoritative.');
  lines.push('', '- Ohio remains BLOCKED and not index-safe until every critical family reaches California-grade proof.');
  return `${lines.join('\n')}\n`;
}

function buildBatchReport(summary, countyBlocker) {
  return [
    '# Batch 31 Ohio Repair Report v1',
    '',
    'This pass rechecks the official Ohio Job and Family Services county-directory lane on the current and legacy state domains. It does not loosen the county-local gate; it sharpens the blocker with bounded live evidence showing that the obvious official replacement targets are still unresolved.',
    '',
    `- county_local_blocker_code: ${countyBlocker.blocker_code}`,
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
  ].join('\n');
}

export async function generateBatch31OhioCountyBlockerRefreshV1() {
  const txSummaryV10 = readJson(INPUTS.txSummaryV10);
  if (txSummaryV10.v10.pass_counties !== 254 || txSummaryV10.index_safe !== true) {
    throw new Error('Batch 31 requires Texas v10 truth preserved.');
  }

  const summaryRel = 'data/generated/ohio_california_grade_summary_v2.json';
  const failureRel = 'data/generated/ohio_failure_ledger_v2.jsonl';
  const verifiedRel = 'data/generated/ohio_verified_sources_v1.jsonl';
  const nextRel = 'data/generated/ohio_next_action_queue_v2.jsonl';
  const reportRel = 'docs/generated/ohio-california-grade-audit-report-v2.md';

  const summaryPath = path.join(repoRoot, summaryRel);
  const failurePath = path.join(repoRoot, failureRel);
  const verifiedPath = path.join(repoRoot, verifiedRel);
  const nextPath = path.join(repoRoot, nextRel);
  const reportPath = path.join(repoRoot, reportRel);

  const summary = readCommittedJson(summaryRel);
  const failureRows = readCommittedJsonl(failureRel);
  const verifiedRows = readCommittedJsonl(verifiedRel);
  const nextRows = readCommittedJsonl(nextRel);
  const reportText = readCommittedFile(reportRel);

  const attempts = [];
  for (const url of COUNTY_DIRECTORY_TARGETS) {
    const result = await fetchUrl(url);
    attempts.push(result);
    await new Promise((resolve) => setTimeout(resolve, USER_RATE_LIMIT_MS));
  }

  const countyBlocker = classifyOhioCountyDirectoryBlocker(attempts);
  const districtEvidence = failureRows.find((row) => row.family === 'district_or_county_education_routing')?.evidence || '';
  const updatedFailures = updateFailureRows(failureRows, countyBlocker);
  const updatedVerified = updateVerifiedSources(verifiedRows, countyBlocker);
  const updatedNext = updateNextRows(nextRows, countyBlocker, districtEvidence);
  const updatedSummary = recalcSummary(summary, updatedFailures, updatedVerified);
  const updatedReport = updateStateReport(reportText, countyBlocker);

  writeJson(summaryPath, updatedSummary);
  writeJsonl(failurePath, updatedFailures);
  writeJsonl(verifiedPath, updatedVerified);
  writeJsonl(nextPath, updatedNext);
  fs.writeFileSync(reportPath, updatedReport);

  const blockers = attempts.map((attempt) => ({
    family: 'county_local_disability_resources',
    blocker_code: attempt.status === 404
      ? 'official_county_directory_http_404'
      : (!attempt.status ? 'official_county_directory_dns_or_network_failure' : 'official_county_directory_observed'),
    source_url: attempt.url,
    final_url: attempt.finalUrl,
    reason: attempt.status ? `Bounded recheck returned HTTP ${attempt.status}.` : `Bounded recheck failed: ${attempt.error}`,
  }));

  const batchSummary = {
    batch: 'batch_31_ohio_repair_v1',
    generated_at: new Date().toISOString(),
    state: STATE,
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    county_local_blocker_code: countyBlocker.blocker_code,
    texas_preserved_complete: true,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  writeJsonl(OUTPUTS.blockers, blockers);
  fs.writeFileSync(OUTPUTS.report, `${buildBatchReport(batchSummary, countyBlocker)}\n`);

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch31OhioCountyBlockerRefreshV1()
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
