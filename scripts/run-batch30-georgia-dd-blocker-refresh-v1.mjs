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

const STATE = 'georgia';
const STATE_CODE = 'GA';

const INPUTS = {
  txSummaryV10: path.join(generatedDir, 'tx_verification_summary_v10.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch30_georgia_repair_summary_v1.json'),
  blockers: path.join(generatedDir, 'batch30_georgia_blockers_v1.jsonl'),
  report: path.join(docsGeneratedDir, 'batch30-georgia-repair-report-v1.md'),
};

const USER_RATE_LIMIT_MS = 300;
const DBHDD_COUNTY_URL = 'https://dbhdd.georgia.gov/regional-field-office-county';
const REGION_CHECK_URLS = [
  'https://dbhdd.georgia.gov/region-1-field-office',
  'https://dbhdd.georgia.gov/region-2-field-office',
  'https://dbhdd.georgia.gov/regional-field-offices',
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
    const httpStatus = typeof error?.statusCode === 'number' ? error.statusCode : null;
    return {
      ok: false,
      status: httpStatus,
      finalUrl: url,
      body: '',
      fetchedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function inspectGeorgiaDbhddCountyPage(html, finalUrl, fetchedAt) {
  const $ = cheerio.load(String(html || ''));
  const rows = $('table tr').toArray().slice(1).map((tr) => {
    const cells = $(tr).find('td').toArray().map((cell) => sanitizeText($(cell).text()));
    return { countyCell: cells[0] || '', regionCell: cells[1] || '' };
  }).filter((row) => row.regionCell);
  const emptyCountyCount = rows.filter((row) => !row.countyCell).length;
  return {
    rowCount: rows.length,
    emptyCountyCount,
    source_url: DBHDD_COUNTY_URL,
    final_url: finalUrl,
    fetched_at: fetchedAt,
  };
}

export function classifyGeorgiaDdBlocker(ddInspection, regionChecks) {
  const forbiddenCount = regionChecks.filter((row) => row.status === 403).length;
  if (ddInspection.rowCount > 0 && ddInspection.emptyCountyCount === ddInspection.rowCount && forbiddenCount >= 2) {
    return {
      blocker_code: 'official_county_lookup_table_has_empty_county_cells',
      reason: `Official DBHDD county table renders ${ddInspection.rowCount} region rows but ${ddInspection.emptyCountyCount}/${ddInspection.rowCount} county cells are blank in static HTML, and the obvious same-domain region field-office leaves return ${forbiddenCount} HTTP 403 responses, so county-to-region coverage remains unprovable from current official evidence.`,
    };
  }
  if (ddInspection.rowCount > 0 && ddInspection.emptyCountyCount === ddInspection.rowCount) {
    return {
      blocker_code: 'official_county_lookup_table_has_empty_county_cells',
      reason: `Official DBHDD county table renders ${ddInspection.rowCount} region rows but ${ddInspection.emptyCountyCount}/${ddInspection.rowCount} county cells are blank in static HTML, so county-to-region coverage remains unprovable from current official evidence.`,
    };
  }
  return {
    blocker_code: 'official_dd_county_mapping_requires_manual_review',
    reason: 'Georgia DBHDD county routing recheck returned a partial or unexpected structure that needs manual review before changing the DD family gate.',
  };
}

function updateFailureRows(failureRows, ddBlocker) {
  return failureRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return {
        ...row,
        failure_code: ddBlocker.blocker_code,
        evidence: ddBlocker.reason,
        next_action: 'keep_blocked_until_official_county_names_or_machine_readable_mapping_are_exposed',
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

function updateVerifiedSources(verifiedRows, ddBlocker) {
  return verifiedRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return {
        ...row,
        blocker_code: ddBlocker.blocker_code,
        blocker_evidence: ddBlocker.reason,
      };
    }
    return row;
  });
}

function updateNextRows(nextRows, ddBlocker) {
  const rows = nextRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return {
        ...row,
        failure_code: ddBlocker.blocker_code,
        next_action: 'keep_blocked_until_official_county_names_or_machine_readable_mapping_are_exposed',
        evidence: ddBlocker.reason,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
        next_action: 'expand_verified_leaf_targets_into_county_or_district_mapping',
        evidence: row.evidence,
      };
    }
    return row;
  });
  return rows.map((row, index) => ({ ...row, priority_rank: index + 1 }));
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

function updateStateReport(reportText, ddBlocker, regionChecks) {
  const lines = [...reportText.trimEnd().split('\n'), '', '## Batch 30 Georgia DD blocker refresh', ''];
  lines.push(`- developmental_disability_idd_authority: ${ddBlocker.reason}`);
  lines.push(`- same-domain DBHDD region leaf recheck: ${regionChecks.map((row) => `${row.url} -> ${row.status || row.error}`).join('; ')}`);
  lines.push('- No new reusable lesson was promoted from Batch 30; the existing fail-closed county-grade lessons still cover this pattern.');
  lines.push('', '- Georgia remains BLOCKED and not index-safe until every critical family reaches California-grade proof.');
  return `${lines.join('\n')}\n`;
}

function buildBatchReport(summary, ddBlocker) {
  return [
    '# Batch 30 Georgia Repair Report v1',
    '',
    'This pass rechecks Georgia DBHDD county-routing evidence on the same official domain. It does not loosen the DD gate; it sharpens the blocker with live evidence showing the county table is still blank and the obvious region leaves are not fetchable.',
    '',
    `- dd_blocker_code: ${ddBlocker.blocker_code}`,
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
  ].join('\n');
}

export async function generateBatch30GeorgiaDdBlockerRefreshV1() {
  const txSummaryV10 = readJson(INPUTS.txSummaryV10);
  if (txSummaryV10.v10.pass_counties !== 254 || txSummaryV10.index_safe !== true) {
    throw new Error('Batch 30 requires Texas v10 truth preserved.');
  }

  const summaryRel = 'data/generated/georgia_california_grade_summary_v2.json';
  const failureRel = 'data/generated/georgia_failure_ledger_v2.jsonl';
  const verifiedRel = 'data/generated/georgia_verified_sources_v1.jsonl';
  const nextRel = 'data/generated/georgia_next_action_queue_v2.jsonl';
  const reportRel = 'docs/generated/georgia-california-grade-audit-report-v2.md';

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

  const ddFetched = await fetchUrl(DBHDD_COUNTY_URL);
  if (!ddFetched.ok) {
    throw new Error(`Official Georgia DBHDD county page failed during bounded recheck: ${ddFetched.status || ddFetched.error}`);
  }
  const ddInspection = inspectGeorgiaDbhddCountyPage(String(ddFetched.body || ''), ddFetched.finalUrl, ddFetched.fetchedAt);

  const regionChecks = [];
  for (const url of REGION_CHECK_URLS) {
    await new Promise((resolve) => setTimeout(resolve, USER_RATE_LIMIT_MS));
    const result = await fetchUrl(url);
    regionChecks.push({
      url,
      status: result.status,
      final_url: result.finalUrl,
      error: result.error || null,
    });
  }

  const ddBlocker = classifyGeorgiaDdBlocker(ddInspection, regionChecks);
  const updatedFailures = updateFailureRows(failureRows, ddBlocker);
  const updatedVerified = updateVerifiedSources(verifiedRows, ddBlocker);
  const updatedNext = updateNextRows(nextRows, ddBlocker);
  const updatedSummary = recalcSummary(summary, updatedFailures, updatedVerified);
  const updatedReport = updateStateReport(reportText, ddBlocker, regionChecks);

  writeJson(summaryPath, updatedSummary);
  writeJsonl(failurePath, updatedFailures);
  writeJsonl(verifiedPath, updatedVerified);
  writeJsonl(nextPath, updatedNext);
  fs.writeFileSync(reportPath, updatedReport);

  const blockers = [
    {
      family: 'developmental_disability_idd_authority',
      blocker_code: ddBlocker.blocker_code,
      source_url: DBHDD_COUNTY_URL,
      final_url: ddFetched.finalUrl,
      reason: ddBlocker.reason,
    },
    ...regionChecks.filter((row) => row.status || row.error).map((row) => ({
      family: 'developmental_disability_idd_authority',
      blocker_code: row.status === 403 ? 'official_region_leaf_http_403' : 'official_region_leaf_recheck_observed',
      source_url: row.url,
      final_url: row.final_url,
      reason: row.status ? `Bounded same-domain region leaf check returned HTTP ${row.status}.` : `Bounded same-domain region leaf check failed: ${row.error}`,
    })),
  ];

  const batchSummary = {
    batch: 'batch_30_georgia_repair_v1',
    generated_at: new Date().toISOString(),
    state: STATE,
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    dd_blocker_code: ddBlocker.blocker_code,
    texas_preserved_complete: true,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  writeJsonl(OUTPUTS.blockers, blockers);
  fs.writeFileSync(OUTPUTS.report, `${buildBatchReport(batchSummary, ddBlocker)}\n`);

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch30GeorgiaDdBlockerRefreshV1()
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
