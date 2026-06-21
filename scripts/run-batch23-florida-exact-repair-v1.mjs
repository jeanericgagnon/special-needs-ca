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
  summary: path.join(generatedDir, 'batch23_florida_exact_repair_summary_v1.json'),
  verifiedLeafs: path.join(generatedDir, 'batch23_florida_verified_leaf_targets_v1.jsonl'),
  blockers: path.join(generatedDir, 'batch23_florida_blockers_v1.jsonl'),
  report: path.join(docsGeneratedDir, 'batch23-florida-exact-repair-report-v1.md'),
};

const USER_RATE_LIMIT_MS = 300;

const FDLRS_DIRECTORY_URL = 'https://www.fdlrs.org/find-a-center';
const FLORIDA_LOCAL_OFFICE_STALE_URL = 'https://www.myflfamilies.com/service-programs/access/map.shtml';
const DISTRICT_CANDIDATES = [
  { url: 'https://www.bakerk12.org/departments/exceptional-student-education-student-services/exceptional-student-education-student-services', district_name: 'Baker County School District' },
  { url: 'https://www.bakerk12.org/departments/exceptional-student-education-student-services/student-services-resources', district_name: 'Baker County School District' },
  { url: 'https://www.bakerk12.org/departments/exceptional-student-education-student-services/staff', district_name: 'Baker County School District' },
  { url: 'https://www.bay.k12.fl.us/page/ese/', district_name: 'Bay District Schools' },
  { url: 'https://www.bay.k12.fl.us/page/special-education-programs/', district_name: 'Bay District Schools' },
  { url: 'https://www.bradfordschools.org/departments/exceptional-student-education', district_name: 'Bradford County School District' },
  { url: 'https://www.yourcharlotteschools.net/82735_3', district_name: 'Charlotte County Public Schools' },
  { url: 'https://www.collierschools.com/students-families/ese', district_name: 'Collier County Public Schools' },
  { url: 'https://www.collierschools.com/students-families/ese/parent-resources', district_name: 'Collier County Public Schools' },
  { url: 'https://www.citrusschools.org/exceptional-student-education', district_name: 'Citrus County Schools' },
  { url: 'https://www.oneclay.net/page/exceptional-student-education/', district_name: 'Clay County District Schools' },
  { url: 'https://www.oneclay.net/page/ese-parent-services/', district_name: 'Clay County District Schools' },
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

async function fetchHtml(url) {
  const result = await fetchWithRetry(url, {
    retryCount: 1,
    requestTimeoutMs: 15000,
    bodyTimeoutMs: 15000,
    rateLimitMs: USER_RATE_LIMIT_MS,
  });
  if (!result.ok) {
    throw new Error(`Fetch failed for ${url}: ${result.status}`);
  }
  return {
    html: String(result.body || ''),
    finalUrl: result.finalUrl || url,
    fetchedAt: new Date().toISOString(),
  };
}

function extractTextSignals(html) {
  const $ = cheerio.load(String(html || ''));
  const title = sanitizeText($('title').first().text());
  const headings = $('h1,h2,h3').toArray().map((el) => sanitizeText($(el).text())).filter(Boolean).slice(0, 12);
  const snippet = sanitizeText($('body').text()).slice(0, 1600);
  return { title, headings, snippet };
}

export function verifyFloridaDistrictLeaf(url, html, finalUrl, fetchedAt, districtName = '') {
  const { title, headings, snippet } = extractTextSignals(html);
  const blob = `${title} ${headings.join(' ')} ${snippet} ${finalUrl}`.toLowerCase();
  const roleTerms = ['special education', 'exceptional student education', 'student services', 'procedural safeguards', 'ese', 'parent resources'];
  const matchedRoleTerms = roleTerms.filter((term) => blob.includes(term));
  const domain = (() => {
    try {
      return new URL(finalUrl).hostname.toLowerCase();
    } catch {
      return '';
    }
  })();
  const districtOwned = /(bakerk12\.org|bay\.k12\.fl\.us|bradfordschools\.org|yourcharlotteschools\.net|collierschools\.com|citrusschools\.org|oneclay\.net)$/i.test(domain);
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
    source_table: 'batch23_florida_verified_leaf_targets',
  };
}

export function parseFloridaFdlrsDirectory(url, html, finalUrl, fetchedAt) {
  const { title, headings, snippet } = extractTextSignals(html);
  const $ = cheerio.load(String(html || ''));
  const centerLinks = [];
  $('a[href]').each((_, el) => {
    const href = sanitizeText($(el).attr('href'));
    const text = sanitizeText($(el).text());
    if (!text || !/fdlrs/i.test(text)) return;
    const absolute = new URL(href, finalUrl).toString();
    centerLinks.push({ label: text, url: absolute });
  });
  const uniqueCenters = uniqueBy(
    centerLinks.filter((row) => /fdlrs/i.test(row.label) && !/about fdlrs/i.test(row.label)),
    (row) => row.url,
  );
  if (!/fdlrs/i.test(title) || uniqueCenters.length < 10) return null;
  return {
    state: STATE,
    state_code: STATE_CODE,
    family: 'special_education_idea_part_b',
    source_url: url,
    final_url: finalUrl,
    fetched_at: fetchedAt,
    evidence_title: title,
    evidence_headings: headings.slice(0, 6),
    evidence_snippet: snippet,
    center_count: uniqueCenters.length,
    center_samples: uniqueCenters.slice(0, 6),
    verification_status: 'verified',
    source_type: 'official_directory',
    source_table: 'batch23_florida_verified_leaf_targets',
  };
}

function updateGapRows(gapRows, exactDistrictLeafs, fdlrsDirectory, countyLocalBlocker) {
  return gapRows.map((row) => {
    if (row.family === 'special_education_idea_part_b' && fdlrsDirectory) {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: `Official FDLRS directory exposes statewide associate center routing with ${fdlrsDirectory.center_count} reviewed center links on the live official page.`,
      };
    }
    if (row.family === 'district_or_county_education_routing' && exactDistrictLeafs.length) {
      return {
        ...row,
        family_status: 'exact_leaf_targets_verified_partial',
        status_reason: `Reviewed district-owned education exact leaves verified (${exactDistrictLeafs.length}) across multiple Florida district domains, but county-grade coverage still requires broader district mapping.`,
      };
    }
    if (row.family === 'county_local_disability_resources' && countyLocalBlocker) {
      return {
        ...row,
        family_status: 'legacy_state_grade',
        status_reason: countyLocalBlocker.reason,
      };
    }
    return row;
  });
}

function updateFailureRows(failureRows, exactDistrictLeafs, fdlrsDirectory, countyLocalBlocker) {
  const rows = [];
  for (const row of failureRows) {
    if (row.family === 'special_education_idea_part_b' && fdlrsDirectory) continue;
    if (row.family === 'district_or_county_education_routing' && exactDistrictLeafs.length) {
      rows.push({
        ...row,
        failure_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
        evidence: `Verified exact leaf targets: ${exactDistrictLeafs.map((leaf) => leaf.final_url).join(', ')}`,
        next_action: 'expand_verified_leaf_targets_into_county_or_district_mapping',
      });
      continue;
    }
    if (row.family === 'county_local_disability_resources' && countyLocalBlocker) {
      rows.push({
        ...row,
        failure_code: countyLocalBlocker.blocker_code,
        evidence: countyLocalBlocker.reason,
        next_action: 'keep_blocked_until_official_county_service_center_locator_is_recovered',
      });
      continue;
    }
    rows.push(row);
  }
  return rows;
}

function updateVerifiedSources(verifiedRows, exactDistrictLeafs, fdlrsDirectory, countyLocalBlocker) {
  return verifiedRows.map((row) => {
    if (row.family === 'special_education_idea_part_b' && fdlrsDirectory) {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: fdlrsDirectory.center_count,
        query_basis: `${row.query_basis}; Batch 23 Florida FDLRS statewide directory repair`,
        blocker_code: null,
        blocker_evidence: null,
        samples: fdlrsDirectory.center_samples.map((sample) => ({
          sample_name: sample.label,
          source_url: sample.url,
          verification_status: 'verified',
          source_type: 'official_directory_center_link',
          source_table: 'batch23_florida_verified_leaf_targets',
        })),
      };
    }
    if (row.family === 'district_or_county_education_routing' && exactDistrictLeafs.length) {
      return {
        ...row,
        family_status: 'exact_leaf_targets_verified_partial',
        evidence_strength: 'medium',
        sample_count: exactDistrictLeafs.length,
        query_basis: `${row.query_basis}; Batch 23 Florida exact district repair`,
        blocker_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
        blocker_evidence: 'Verified district-owned exact leaves now span multiple Florida district domains, but broader county-grade mapping is still incomplete.',
        samples: exactDistrictLeafs.slice(0, 8).map((leaf) => ({
          sample_name: leaf.evidence_title || leaf.final_url,
          source_url: leaf.final_url,
          verification_status: 'verified',
          source_type: 'exact_leaf_target',
          source_table: 'batch23_florida_verified_leaf_targets',
        })),
      };
    }
    if (row.family === 'county_local_disability_resources' && countyLocalBlocker) {
      return {
        ...row,
        blocker_code: countyLocalBlocker.blocker_code,
        blocker_evidence: countyLocalBlocker.reason,
      };
    }
    return row;
  });
}

function updateNextActions(nextRows, fdlrsDirectory) {
  return nextRows
    .filter((row) => !(row.family === 'special_education_idea_part_b' && fdlrsDirectory))
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));
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

function updateStateReport(reportText, fdlrsDirectory, exactDistrictLeafs, countyLocalBlocker) {
  const lines = [...reportText.trimEnd().split('\n'), '', '## Batch 23 Florida exact repair', ''];
  if (fdlrsDirectory) {
    lines.push(`- special_education_idea_part_b: official FDLRS directory repaired to verified state-grade via ${fdlrsDirectory.final_url} with ${fdlrsDirectory.center_count} reviewed center links.`);
  }
  if (exactDistrictLeafs.length) {
    lines.push(`- district_or_county_education_routing: verified district-owned exact leaves -> ${exactDistrictLeafs.map((leaf) => leaf.final_url).join(', ')}`);
  }
  if (countyLocalBlocker) {
    lines.push(`- county_local_disability_resources: remained blocked after bounded same-domain repair; ${countyLocalBlocker.reason}`);
  }
  lines.push('', '- Florida remains PARTIAL and not index-safe until every critical family reaches California-grade proof.');
  return `${lines.join('\n')}\n`;
}

function buildBatchReport(summary, countyLocalBlocker) {
  return [
    '# Batch 23 Florida Exact Repair Report v1',
    '',
    'This pass uses only existing Florida packet roots and same-domain repairs. It upgrades statewide special-education routing where the live official directory now proves coverage, verifies additional district-owned ESE leaves, and truthfully keeps the county-office family blocked when the official locator path cannot be recovered.',
    '',
    `- special_education_repaired: ${summary.special_education_repaired ? 'true' : 'false'}`,
    `- district_exact_leaves_verified: ${summary.district_exact_leaves_verified}`,
    `- county_local_disability_resources_repaired: ${summary.county_local_disability_resources_repaired ? 'true' : 'false'}`,
    `- county_local_blocker_code: ${countyLocalBlocker?.blocker_code || 'none'}`,
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
  ].join('\n');
}

export async function generateBatch23FloridaExactRepairV1() {
  const txSummaryV10 = readJson(INPUTS.txSummaryV10);
  if (txSummaryV10.v10.pass_counties !== 254 || txSummaryV10.index_safe !== true) {
    throw new Error('Batch 23 requires Texas v10 truth preserved.');
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

  const verifiedLeafs = [];
  const blockers = [];

  const fdlrsFetched = await fetchHtml(FDLRS_DIRECTORY_URL);
  const fdlrsDirectory = parseFloridaFdlrsDirectory(FDLRS_DIRECTORY_URL, fdlrsFetched.html, fdlrsFetched.finalUrl, fdlrsFetched.fetchedAt);
  if (fdlrsDirectory) verifiedLeafs.push(fdlrsDirectory);

  for (const candidate of DISTRICT_CANDIDATES) {
    try {
      const fetched = await fetchHtml(candidate.url);
      const verified = verifyFloridaDistrictLeaf(candidate.url, fetched.html, fetched.finalUrl, fetched.fetchedAt, candidate.district_name);
      if (verified) {
        verifiedLeafs.push(verified);
      } else {
        blockers.push({
          family: 'district_or_county_education_routing',
          blocker_code: 'district_exact_leaf_verification_failed',
          source_url: candidate.url,
          reason: `Live district-owned page on ${candidate.district_name} did not preserve enough special-education routing evidence to verify.`,
        });
      }
    } catch (error) {
      blockers.push({
        family: 'district_or_county_education_routing',
        blocker_code: 'district_exact_leaf_fetch_failed',
        source_url: candidate.url,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
    await new Promise((resolve) => setTimeout(resolve, USER_RATE_LIMIT_MS));
  }

  let countyLocalBlocker = null;
  try {
    await fetchHtml(FLORIDA_LOCAL_OFFICE_STALE_URL);
  } catch {
    const publicAssistanceFetched = await fetchHtml('https://www.myflfamilies.com/services/public-assistance/applying-for-assistance');
    const blob = publicAssistanceFetched.html.toLowerCase();
    countyLocalBlocker = {
      family: 'county_local_disability_resources',
      blocker_code: 'official_local_service_center_locator_missing_after_same_domain_repair',
      source_url: FLORIDA_LOCAL_OFFICE_STALE_URL,
      reason: `The legacy ACCESS local service center map now 404s, and bounded same-domain repair only surfaced${blob.includes('community partner search') ? ' community-partner search' : ''}${blob.includes('customer service center') ? ' and a statewide customer service center' : ''}, not a county-grade official locator.`,
      final_url: publicAssistanceFetched.finalUrl,
    };
    blockers.push(countyLocalBlocker);
  }

  const exactDistrictLeafs = uniqueBy(
    verifiedLeafs.filter((row) => row.family === 'district_or_county_education_routing'),
    (row) => row.final_url,
  );

  const updatedGaps = updateGapRows(gapRows, exactDistrictLeafs, fdlrsDirectory, countyLocalBlocker);
  const updatedFailures = updateFailureRows(failureRows, exactDistrictLeafs, fdlrsDirectory, countyLocalBlocker);
  const updatedVerified = updateVerifiedSources(verifiedRows, exactDistrictLeafs, fdlrsDirectory, countyLocalBlocker);
  const updatedNext = updateNextActions(nextRows, fdlrsDirectory);
  const updatedSummary = recalcSummary(summary, updatedGaps, updatedFailures, updatedVerified);
  const updatedReport = updateStateReport(reportText, fdlrsDirectory, exactDistrictLeafs, countyLocalBlocker);

  writeJson(summaryPath, updatedSummary);
  writeJsonl(gapPath, updatedGaps);
  writeJsonl(failurePath, updatedFailures);
  writeJsonl(verifiedPath, updatedVerified);
  writeJsonl(nextPath, updatedNext);
  fs.writeFileSync(reportPath, updatedReport);

  const batchSummary = {
    batch: 'batch_23_florida_exact_repair_v1',
    generated_at: new Date().toISOString(),
    state: STATE,
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    special_education_repaired: Boolean(fdlrsDirectory),
    district_exact_leaves_verified: exactDistrictLeafs.length,
    county_local_disability_resources_repaired: false,
    texas_preserved_complete: true,
  };

  writeJsonl(OUTPUTS.verifiedLeafs, uniqueBy(verifiedLeafs, (row) => `${row.family}|${row.final_url}`));
  writeJsonl(OUTPUTS.blockers, blockers);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, `${buildBatchReport(batchSummary, countyLocalBlocker)}\n`);

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch23FloridaExactRepairV1()
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
