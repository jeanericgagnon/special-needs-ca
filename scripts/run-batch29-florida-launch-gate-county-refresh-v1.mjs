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

const STATE = 'florida';
const STATE_CODE = 'FL';

const INPUTS = {
  txSummaryV10: path.join(generatedDir, 'tx_verification_summary_v10.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch29_florida_repair_summary_v1.json'),
  blockers: path.join(generatedDir, 'batch29_florida_blockers_v1.jsonl'),
  report: path.join(docsGeneratedDir, 'batch29-florida-repair-report-v1.md'),
};

const USER_RATE_LIMIT_MS = 300;
const STALE_MAP_URL = 'https://www.myflfamilies.com/service-programs/access/map.shtml';
const APPLYING_URL = 'https://www.myflfamilies.com/services/public-assistance/applying-for-assistance';
const PUBLIC_ASSISTANCE_URL = 'https://www.myflfamilies.com/services/public-assistance';

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

function extractPageSignals(html) {
  const $ = cheerio.load(String(html || ''));
  const title = sanitizeText($('title').first().text());
  const headings = $('h1,h2,h3').toArray().map((el) => sanitizeText($(el).text())).filter(Boolean).slice(0, 8);
  const body = sanitizeText($('body').text()).slice(0, 2400);
  const links = $('a[href]').toArray().map((el) => ({
    href: sanitizeText($(el).attr('href')),
    text: sanitizeText($(el).text()),
  })).filter((row) => row.href || row.text);
  return { title, headings, body, links };
}

export function classifyFloridaCountyLocalBlocker(staleFetch, applyingFetch, publicFetch) {
  if (staleFetch.ok) {
    return {
      blocker_code: 'legacy_county_locator_unexpectedly_alive',
      reason: `Legacy Florida ACCESS service-center map unexpectedly responded at ${staleFetch.finalUrl}; manual review required before changing the county-local gate.`,
      final_url: staleFetch.finalUrl,
    };
  }

  const applyingSignals = extractPageSignals(String(applyingFetch.body || ''));
  const publicSignals = extractPageSignals(String(publicFetch.body || ''));
  const combined = `${applyingSignals.title} ${applyingSignals.headings.join(' ')} ${applyingSignals.body} ${publicSignals.title} ${publicSignals.headings.join(' ')} ${publicSignals.body}`.toLowerCase();
  const combinedLinks = [...applyingSignals.links, ...publicSignals.links]
    .map((row) => `${row.text} ${row.href}`.toLowerCase());

  const hasCommunityPartner = combined.includes('community partner')
    || combinedLinks.some((text) => text.includes('community partner'));
  const hasCustomerCenter = combined.includes('customer service center')
    || combined.includes('customer call center')
    || combinedLinks.some((text) => text.includes('customer service center'));
  const hasOfficialCountyLocator = combined.includes('service center locator')
    || combined.includes('local office locator')
    || combined.includes('county office')
    || combinedLinks.some((text) => text.includes('service center locator') || text.includes('local office locator') || text.includes('county office'));

  if (!applyingFetch.ok || !publicFetch.ok) {
    return {
      blocker_code: 'official_local_service_center_recheck_incomplete',
      reason: `Florida DCF public-assistance recheck could not complete cleanly (applying=${applyingFetch.status || applyingFetch.error}; public=${publicFetch.status || publicFetch.error}).`,
      final_url: applyingFetch.finalUrl || publicFetch.finalUrl || APPLYING_URL,
    };
  }

  if (!hasOfficialCountyLocator && hasCommunityPartner && hasCustomerCenter) {
    return {
      blocker_code: 'official_local_service_center_locator_missing_after_same_domain_repair',
      reason: 'The legacy ACCESS local service center map now 404s, and bounded same-domain live recheck still exposes only community-partner search plus a statewide customer service center, not a county-grade official locator.',
      final_url: applyingFetch.finalUrl || APPLYING_URL,
    };
  }

  return {
    blocker_code: 'official_local_service_center_locator_requires_manual_review',
    reason: 'Florida DCF recheck returned live public-assistance pages, but the bounded evidence did not cleanly prove either a county-grade official locator or a definitive absence of one.',
    final_url: applyingFetch.finalUrl || APPLYING_URL,
  };
}

function updateGapRows(gapRows, countyLocalBlocker) {
  return gapRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'legacy_state_grade',
        status_reason: countyLocalBlocker.reason,
      };
    }
    return row;
  });
}

function updateFailureRows(failureRows, countyLocalBlocker) {
  return failureRows
    .filter((row) => row.family !== 'launch_gate')
    .map((row) => {
      if (row.family === 'county_local_disability_resources') {
        return {
          ...row,
          failure_code: countyLocalBlocker.blocker_code,
          evidence: countyLocalBlocker.reason,
          next_action: 'keep_blocked_until_official_county_service_center_locator_is_recovered',
        };
      }
      return row;
    });
}

function updateVerifiedSources(verifiedRows, countyLocalBlocker) {
  return verifiedRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        blocker_code: countyLocalBlocker.blocker_code,
        blocker_evidence: countyLocalBlocker.reason,
      };
    }
    return row;
  });
}

function updateNextRows(nextRows, countyLocalBlocker) {
  return nextRows
    .filter((row) => row.family !== 'launch_gate')
    .map((row, index) => {
      if (row.family === 'county_local_disability_resources') {
        return {
          ...row,
          priority_rank: index + 1,
          failure_code: countyLocalBlocker.blocker_code,
          next_action: 'keep_blocked_until_official_county_service_center_locator_is_recovered',
          evidence: countyLocalBlocker.reason,
        };
      }
      return {
        ...row,
        priority_rank: index + 1,
      };
    });
}

function recalcSummary(summary, gapRows, failureRows, verifiedRows) {
  const criticalRows = gapRows.filter((row) => row.critical);
  const strong = criticalRows.filter((row) => String(row.family_status || '').startsWith('verified_')).length;
  const missing = criticalRows.filter((row) => row.family_status === 'missing').length;
  const weak = criticalRows.length - strong - missing;
  return {
    ...summary,
    incorrectly_index_safe: false,
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

function updateStateReport(reportText, countyLocalBlocker) {
  const lines = [...reportText.trimEnd().split('\n'), '', '## Batch 29 Florida launch-gate and county-local refresh', ''];
  lines.push(`- county_local_disability_resources: ${countyLocalBlocker.reason}`);
  lines.push('- launch_gate: cleared as stale packet metadata because Florida now explicitly remains gated by current county-local and district-routing evidence, not by a legacy exposed/index-safe flag.');
  lines.push('- No new reusable lesson was promoted from Batch 29; the existing county-local replacement lesson remains authoritative.');
  lines.push('', '- Florida remains PARTIAL and not index-safe until every critical family reaches California-grade proof.');
  return `${lines.join('\n')}\n`;
}

function buildBatchReport(summary, countyLocalBlocker) {
  return [
    '# Batch 29 Florida Repair Report v1',
    '',
    'This pass rechecks Florida’s current official DCF public-assistance pages to confirm whether a county-grade official locator replaced the dead ACCESS map. It clears the stale launch-gate blocker only because the refreshed packet keeps Florida explicitly gated under current evidence.',
    '',
    `- county_local_blocker_code: ${countyLocalBlocker.blocker_code}`,
    `- launch_gate_cleared: ${summary.launch_gate_cleared ? 'true' : 'false'}`,
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
  ].join('\n');
}

export async function generateBatch29FloridaLaunchGateCountyRefreshV1() {
  const txSummaryV10 = readJson(INPUTS.txSummaryV10);
  if (txSummaryV10.v10.pass_counties !== 254 || txSummaryV10.index_safe !== true) {
    throw new Error('Batch 29 requires Texas v10 truth preserved.');
  }

  const summaryRel = 'data/generated/florida_california_grade_summary_v2.json';
  const gapRel = 'data/generated/florida_gap_matrix_v2.jsonl';
  const failureRel = 'data/generated/florida_failure_ledger_v2.jsonl';
  const verifiedRel = 'data/generated/florida_verified_sources_v1.jsonl';
  const nextRel = 'data/generated/florida_next_action_queue_v2.jsonl';
  const reportRel = 'docs/generated/florida-california-grade-audit-report-v2.md';

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

  const staleFetch = await fetchUrl(STALE_MAP_URL);
  await new Promise((resolve) => setTimeout(resolve, USER_RATE_LIMIT_MS));
  const applyingFetch = await fetchUrl(APPLYING_URL);
  await new Promise((resolve) => setTimeout(resolve, USER_RATE_LIMIT_MS));
  const publicFetch = await fetchUrl(PUBLIC_ASSISTANCE_URL);

  const countyLocalBlocker = classifyFloridaCountyLocalBlocker(staleFetch, applyingFetch, publicFetch);

  const updatedGaps = updateGapRows(gapRows, countyLocalBlocker);
  const updatedFailures = updateFailureRows(failureRows, countyLocalBlocker);
  const updatedVerified = updateVerifiedSources(verifiedRows, countyLocalBlocker);
  const updatedNext = updateNextRows(nextRows, countyLocalBlocker);
  const updatedSummary = recalcSummary(summary, updatedGaps, updatedFailures, updatedVerified);
  const updatedReport = updateStateReport(reportText, countyLocalBlocker);

  writeJson(summaryPath, updatedSummary);
  writeJsonl(gapPath, updatedGaps);
  writeJsonl(failurePath, updatedFailures);
  writeJsonl(verifiedPath, updatedVerified);
  writeJsonl(nextPath, updatedNext);
  fs.writeFileSync(reportPath, updatedReport);

  const blockers = [{
    family: 'county_local_disability_resources',
    blocker_code: countyLocalBlocker.blocker_code,
    source_url: STALE_MAP_URL,
    final_url: countyLocalBlocker.final_url,
    reason: countyLocalBlocker.reason,
  }];

  const batchSummary = {
    batch: 'batch_29_florida_repair_v1',
    generated_at: new Date().toISOString(),
    state: STATE,
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    incorrectly_index_safe: updatedSummary.incorrectly_index_safe,
    county_local_blocker_code: countyLocalBlocker.blocker_code,
    launch_gate_cleared: !updatedFailures.some((row) => row.family === 'launch_gate'),
    texas_preserved_complete: true,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  writeJsonl(OUTPUTS.blockers, blockers);
  fs.writeFileSync(OUTPUTS.report, `${buildBatchReport(batchSummary, countyLocalBlocker)}\n`);

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch29FloridaLaunchGateCountyRefreshV1()
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
