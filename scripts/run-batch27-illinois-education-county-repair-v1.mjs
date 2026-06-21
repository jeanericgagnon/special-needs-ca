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

const STATE = 'illinois';
const STATE_CODE = 'IL';

const INPUTS = {
  txSummaryV10: path.join(generatedDir, 'tx_verification_summary_v10.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch27_illinois_repair_summary_v1.json'),
  verifiedLeafs: path.join(generatedDir, 'batch27_illinois_verified_leaf_targets_v1.jsonl'),
  blockers: path.join(generatedDir, 'batch27_illinois_blockers_v1.jsonl'),
  report: path.join(docsGeneratedDir, 'batch27-illinois-repair-report-v1.md'),
};

const USER_RATE_LIMIT_MS = 300;
const STALE_COUNTY_URL = 'https://www.dhs.state.il.us/page.aspx?item=33612';
const COUNTY_LOCATOR_URL = 'https://www.dhs.state.il.us/page.aspx?item=26210';
const DISTRICT_CANDIDATES = [
  { url: 'https://www.roe1.net/about-us/contact-us/', district_name: 'Regional Office of Education #1' },
  { url: 'https://www.roe1.net/services/', district_name: 'Regional Office of Education #1' },
  { url: 'https://www.roe3.org/about/roe-staff', district_name: 'Regional Office of Education #3' },
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

export function verifyIllinoisDistrictLeaf(url, html, finalUrl, fetchedAt, districtName = '') {
  const { title, headings, snippet } = extractTextSignals(html);
  const blob = `${title} ${headings.join(' ')} ${snippet} ${finalUrl}`.toLowerCase();
  const roleTerms = [
    'regional office of education',
    'contact',
    'services',
    'school',
    'education',
  ];
  const matchedRoleTerms = roleTerms.filter((term) => blob.includes(term));
  const domain = (() => {
    try {
      return new URL(finalUrl).hostname.toLowerCase();
    } catch {
      return '';
    }
  })();
  const districtOwned = /(roe1\.net|roe3\.org)$/i.test(domain);
  if (!districtOwned || matchedRoleTerms.length < 2) return null;
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
    source_table: 'batch27_illinois_verified_leaf_targets',
  };
}

export function classifyIllinoisCountyLocator(staleFetch, locatorFetch) {
  if (staleFetch.ok) {
    const staleSignals = extractTextSignals(String(staleFetch.body || ''));
    const staleBlob = `${staleSignals.title} ${staleSignals.headings.join(' ')} ${staleSignals.snippet}`.toLowerCase();
    if (staleBlob.includes('page not found')) {
      // expected stale page
    }
  }
  if (!locatorFetch.ok) {
    return {
      blocker_code: 'official_county_locator_unresolved_after_bounded_live_check',
      reason: `Official Illinois county office locator failed during bounded live verification: ${locatorFetch.status || locatorFetch.error}.`,
    };
  }
  const locatorSignals = extractTextSignals(String(locatorFetch.body || ''));
  const locatorBlob = `${locatorSignals.title} ${locatorSignals.headings.join(' ')} ${locatorSignals.snippet}`.toLowerCase();
  if (locatorBlob.includes('office locator')) {
    return {
      blocker_code: null,
      reason: `Official Illinois county office routing now points to the live IDHS Office Locator at ${locatorFetch.finalUrl}.`,
    };
  }
  return {
    blocker_code: 'official_county_locator_requires_followup_review',
    reason: `Illinois county office replacement target responded at ${locatorFetch.finalUrl}, but did not preserve clear office-locator evidence in the bounded fetch.`,
  };
}

function updateGapRows(gapRows, exactDistrictLeafs, countyResolved) {
  return gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing' && exactDistrictLeafs.length) {
      return {
        ...row,
        family_status: 'exact_leaf_targets_verified_partial',
        status_reason: `Reviewed ROE-owned education exact leaves verified (${exactDistrictLeafs.length}) across Illinois ROE domains, but broader county/district mapping still requires expansion before California-grade proof.`,
      };
    }
    if (row.family === 'county_local_disability_resources' && countyResolved) {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Official IDHS Office Locator replaced the dead county-office page and now serves as the verified county/local routing surface.',
      };
    }
    return row;
  });
}

function updateFailureRows(failureRows, exactDistrictLeafs, countyOutcome) {
  return failureRows
    .filter((row) => !(row.family === 'county_local_disability_resources' && !countyOutcome.blocker_code))
    .map((row) => {
      if (row.family === 'district_or_county_education_routing' && exactDistrictLeafs.length) {
        return {
          ...row,
          failure_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
          evidence: `Verified exact leaf targets: ${exactDistrictLeafs.map((leaf) => leaf.final_url).join(', ')}`,
          next_action: 'expand_verified_leaf_targets_into_county_or_district_mapping',
        };
      }
      if (row.family === 'county_local_disability_resources' && countyOutcome.blocker_code) {
        return {
          ...row,
          failure_code: countyOutcome.blocker_code,
          evidence: countyOutcome.reason,
          next_action: 'review_live_official_county_locator',
        };
      }
      return row;
    });
}

function updateVerifiedSources(verifiedRows, exactDistrictLeafs, countyOutcome) {
  return verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing' && exactDistrictLeafs.length) {
      return {
        ...row,
        family_status: 'exact_leaf_targets_verified_partial',
        evidence_strength: 'medium',
        sample_count: exactDistrictLeafs.length,
        query_basis: `${row.query_basis}; Batch 27 Illinois ROE exact repair`,
        blocker_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
        blocker_evidence: 'Verified ROE-owned exact leaves now span Illinois ROE domains, but broader county-grade district mapping is still incomplete.',
        samples: exactDistrictLeafs.map((leaf) => ({
          sample_name: leaf.evidence_title || leaf.final_url,
          source_url: leaf.final_url,
          verification_status: 'verified',
          source_type: 'exact_leaf_target',
          source_table: 'batch27_illinois_verified_leaf_targets',
        })),
      };
    }
    if (row.family === 'county_local_disability_resources') {
      if (!countyOutcome.blocker_code) {
        return {
          ...row,
          family_status: 'verified_state_grade',
          evidence_strength: 'strong',
          blocker_code: null,
          blocker_evidence: null,
          sample_count: 1,
          query_basis: `${row.query_basis}; Batch 27 Illinois office locator replacement`,
          samples: [
            {
              sample_name: 'IDHS Office Locator',
              source_url: COUNTY_LOCATOR_URL,
              verification_status: 'verified',
              source_type: 'official_locator',
              source_table: 'batch27_illinois_verified_leaf_targets',
            },
          ],
        };
      }
      return {
        ...row,
        blocker_code: countyOutcome.blocker_code,
        blocker_evidence: countyOutcome.reason,
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

function updateNextRows(nextRows, countyOutcome) {
  const remapped = nextRows.filter((row) => !(row.family === 'county_local_disability_resources' && !countyOutcome.blocker_code)).map((row) => {
    if (row.family === 'county_local_disability_resources' && countyOutcome.blocker_code) {
      return {
        ...row,
        failure_code: countyOutcome.blocker_code,
        next_action: 'review_live_official_county_locator',
        evidence: countyOutcome.reason,
      };
    }
    return row;
  });
  return remapped.map((row, index) => ({ ...row, priority_rank: index + 1 }));
}

function updateStateReport(reportText, exactDistrictLeafs, countyOutcome) {
  const lines = [...reportText.trimEnd().split('\n'), '', '## Batch 27 Illinois repair', ''];
  if (exactDistrictLeafs.length) {
    lines.push(`- district_or_county_education_routing: verified ROE-owned exact leaves -> ${exactDistrictLeafs.map((leaf) => leaf.final_url).join(', ')}`);
  }
  lines.push(`- county_local_disability_resources: ${countyOutcome.reason}`);
  lines.push('', '- Illinois remains BLOCKED and not index-safe until every critical family reaches California-grade proof.');
  return `${lines.join('\n')}\n`;
}

function buildBatchReport(summary, countyOutcome) {
  return [
    '# Batch 27 Illinois Repair Report v1',
    '',
    'This pass uses only current Illinois official roots. It upgrades county-local routing from a dead IDHS page to the live IDHS Office Locator and replaces generic education fallback with reviewed ROE-owned exact leaves.',
    '',
    `- district_exact_leaves_verified: ${summary.district_exact_leaves_verified}`,
    `- county_local_blocker_code: ${countyOutcome.blocker_code || 'none'}`,
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
  ].join('\n');
}

export async function generateBatch27IllinoisEducationCountyRepairV1() {
  const txSummaryV10 = readJson(INPUTS.txSummaryV10);
  if (txSummaryV10.v10.pass_counties !== 254 || txSummaryV10.index_safe !== true) {
    throw new Error('Batch 27 requires Texas v10 truth preserved.');
  }

  const summaryRel = 'data/generated/illinois_california_grade_summary_v2.json';
  const gapRel = 'data/generated/illinois_gap_matrix_v2.jsonl';
  const failureRel = 'data/generated/illinois_failure_ledger_v2.jsonl';
  const verifiedRel = 'data/generated/illinois_verified_sources_v1.jsonl';
  const nextRel = 'data/generated/illinois_next_action_queue_v2.jsonl';
  const reportRel = 'docs/generated/illinois-california-grade-audit-report-v2.md';

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

  const staleFetch = await fetchUrl(STALE_COUNTY_URL);
  await new Promise((resolve) => setTimeout(resolve, USER_RATE_LIMIT_MS));
  const locatorFetch = await fetchUrl(COUNTY_LOCATOR_URL);
  const countyOutcome = classifyIllinoisCountyLocator(staleFetch, locatorFetch);
  if (countyOutcome.blocker_code) {
    blockers.push({
      family: 'county_local_disability_resources',
      blocker_code: countyOutcome.blocker_code,
      source_url: COUNTY_LOCATOR_URL,
      final_url: locatorFetch.finalUrl,
      reason: countyOutcome.reason,
    });
  }
  await new Promise((resolve) => setTimeout(resolve, USER_RATE_LIMIT_MS));

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
    const verified = verifyIllinoisDistrictLeaf(
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
        reason: `Live ROE-owned page on ${candidate.district_name} did not preserve enough district-routing evidence to verify.`,
      });
    }
    await new Promise((resolve) => setTimeout(resolve, USER_RATE_LIMIT_MS));
  }

  const exactDistrictLeafs = uniqueBy(verifiedLeafs, (row) => row.final_url);
  const updatedGaps = updateGapRows(gapRows, exactDistrictLeafs, !countyOutcome.blocker_code);
  const updatedFailures = updateFailureRows(failureRows, exactDistrictLeafs, countyOutcome);
  const updatedVerified = updateVerifiedSources(verifiedRows, exactDistrictLeafs, countyOutcome);
  const updatedNext = updateNextRows(nextRows, countyOutcome);
  const updatedSummary = recalcSummary(summary, updatedGaps, updatedFailures, updatedVerified);
  const updatedReport = updateStateReport(reportText, exactDistrictLeafs, countyOutcome);

  writeJson(summaryPath, updatedSummary);
  writeJsonl(gapPath, updatedGaps);
  writeJsonl(failurePath, updatedFailures);
  writeJsonl(verifiedPath, updatedVerified);
  writeJsonl(nextPath, updatedNext);
  fs.writeFileSync(reportPath, updatedReport);

  const batchSummary = {
    batch: 'batch_27_illinois_repair_v1',
    generated_at: new Date().toISOString(),
    state: STATE,
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    district_exact_leaves_verified: exactDistrictLeafs.length,
    county_local_blocker_code: countyOutcome.blocker_code,
    texas_preserved_complete: true,
  };

  writeJsonl(OUTPUTS.verifiedLeafs, exactDistrictLeafs);
  writeJsonl(OUTPUTS.blockers, blockers);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, `${buildBatchReport(batchSummary, countyOutcome)}\n`);

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch27IllinoisEducationCountyRepairV1()
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
