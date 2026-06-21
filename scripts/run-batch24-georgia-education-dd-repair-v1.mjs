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
  summary: path.join(generatedDir, 'batch24_georgia_repair_summary_v1.json'),
  verifiedLeafs: path.join(generatedDir, 'batch24_georgia_verified_leaf_targets_v1.jsonl'),
  blockers: path.join(generatedDir, 'batch24_georgia_blockers_v1.jsonl'),
  report: path.join(docsGeneratedDir, 'batch24-georgia-repair-report-v1.md'),
};

const USER_RATE_LIMIT_MS = 300;
const DBHDD_COUNTY_URL = 'https://dbhdd.georgia.gov/regional-field-office-county';
const DISTRICT_CANDIDATES = [
  { url: 'https://www.cherokeek12.net/divisions/curriculum-instruction/special-educationsection-504', district_name: 'Cherokee County School District' },
  { url: 'https://www.cherokeek12.net/divisions/curriculum-instruction/special-educationsection-504/parent-rights', district_name: 'Cherokee County School District' },
  { url: 'https://www.clayton.k12.ga.us/departments/special-education', district_name: 'Clayton County Public Schools' },
  { url: 'https://www.clayton.k12.ga.us/departments/student-services', district_name: 'Clayton County Public Schools' },
  { url: 'https://www.clarke.k12.ga.us/o/elc/page/preschool-special-education/', district_name: 'Clarke County School District' },
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

export function verifyGeorgiaDistrictLeaf(url, html, finalUrl, fetchedAt, districtName = '') {
  const { title, headings, snippet } = extractTextSignals(html);
  const blob = `${title} ${headings.join(' ')} ${snippet} ${finalUrl}`.toLowerCase();
  const roleTerms = ['special education', 'student services', 'parent rights', 'section 504', 'preschool special education'];
  const matchedRoleTerms = roleTerms.filter((term) => blob.includes(term));
  const domain = (() => {
    try {
      return new URL(finalUrl).hostname.toLowerCase();
    } catch {
      return '';
    }
  })();
  const districtOwned = /(cherokeek12\.net|clarke\.k12\.ga\.us|clayton\.k12\.ga\.us)$/i.test(domain);
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
    source_table: 'batch24_georgia_verified_leaf_targets',
  };
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
    blocker_code: emptyCountyCount === rows.length && rows.length > 0
      ? 'official_county_lookup_table_has_empty_county_cells'
      : null,
  };
}

function updateGapRows(gapRows, exactDistrictLeafs) {
  return gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing' && exactDistrictLeafs.length) {
      return {
        ...row,
        family_status: 'exact_leaf_targets_verified_partial',
        status_reason: `Reviewed district-owned education exact leaves verified (${exactDistrictLeafs.length}) across multiple Georgia district domains, but statewide county-grade mapping still requires broader district expansion.`,
      };
    }
    return row;
  });
}

function updateFailureRows(failureRows, exactDistrictLeafs, ddInspection) {
  return failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing' && exactDistrictLeafs.length) {
      return {
        ...row,
        failure_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
        evidence: `Verified exact leaf targets: ${exactDistrictLeafs.map((leaf) => leaf.final_url).join(', ')}`,
        next_action: 'expand_verified_leaf_targets_into_county_or_district_mapping',
      };
    }
    if (row.family === 'developmental_disability_idd_authority' && ddInspection?.blocker_code) {
      return {
        ...row,
        failure_code: ddInspection.blocker_code,
        evidence: `Official DBHDD county page renders ${ddInspection.rowCount} table rows with region links but ${ddInspection.emptyCountyCount}/${ddInspection.rowCount} county cells are blank in static HTML, so county-to-region coverage is not provable from the fetched page.`,
        next_action: 'keep_blocked_until_official_county_names_or_machine_readable_mapping_are_exposed',
      };
    }
    return row;
  });
}

function updateVerifiedSources(verifiedRows, exactDistrictLeafs, ddInspection) {
  return verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing' && exactDistrictLeafs.length) {
      return {
        ...row,
        family_status: 'exact_leaf_targets_verified_partial',
        evidence_strength: 'medium',
        sample_count: exactDistrictLeafs.length,
        query_basis: `${row.query_basis}; Batch 24 Georgia district exact repair`,
        blocker_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
        blocker_evidence: 'Verified district-owned exact leaves now span multiple Georgia district domains, but broader county-grade mapping is still incomplete.',
        samples: exactDistrictLeafs.map((leaf) => ({
          sample_name: leaf.evidence_title || leaf.final_url,
          source_url: leaf.final_url,
          verification_status: 'verified',
          source_type: 'exact_leaf_target',
          source_table: 'batch24_georgia_verified_leaf_targets',
        })),
      };
    }
    if (row.family === 'developmental_disability_idd_authority' && ddInspection?.blocker_code) {
      return {
        ...row,
        blocker_code: ddInspection.blocker_code,
        blocker_evidence: `Official DBHDD county page renders ${ddInspection.rowCount} region rows but no visible county names in static HTML.`,
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

function updateStateReport(reportText, exactDistrictLeafs, ddInspection) {
  const lines = [...reportText.trimEnd().split('\n'), '', '## Batch 24 Georgia repair', ''];
  if (exactDistrictLeafs.length) {
    lines.push(`- district_or_county_education_routing: verified district-owned exact leaves -> ${exactDistrictLeafs.map((leaf) => leaf.final_url).join(', ')}`);
  }
  if (ddInspection?.blocker_code) {
    lines.push(`- developmental_disability_idd_authority: remained blocked after bounded live re-check; official county table exposed ${ddInspection.rowCount} region rows but ${ddInspection.emptyCountyCount}/${ddInspection.rowCount} county cells were blank in static HTML.`);
  }
  lines.push('', '- Georgia remains BLOCKED and not index-safe until every critical family reaches California-grade proof.');
  return `${lines.join('\n')}\n`;
}

function buildBatchReport(summary, ddInspection) {
  return [
    '# Batch 24 Georgia Repair Report v1',
    '',
    'This pass uses only existing Georgia packet roots and same-domain district repairs. It upgrades the education family from vague legacy evidence to reviewed district-owned exact leaves, and it sharpens the DBHDD county blocker using the actual static HTML rendered by the official county page.',
    '',
    `- district_exact_leaves_verified: ${summary.district_exact_leaves_verified}`,
    `- dd_county_blocker_code: ${ddInspection?.blocker_code || 'none'}`,
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
  ].join('\n');
}

export async function generateBatch24GeorgiaEducationDdRepairV1() {
  const txSummaryV10 = readJson(INPUTS.txSummaryV10);
  if (txSummaryV10.v10.pass_counties !== 254 || txSummaryV10.index_safe !== true) {
    throw new Error('Batch 24 requires Texas v10 truth preserved.');
  }

  const summaryRel = 'data/generated/georgia_california_grade_summary_v2.json';
  const gapRel = 'data/generated/georgia_gap_matrix_v2.jsonl';
  const failureRel = 'data/generated/georgia_failure_ledger_v2.jsonl';
  const verifiedRel = 'data/generated/georgia_verified_sources_v1.jsonl';
  const nextRel = 'data/generated/georgia_next_action_queue_v2.jsonl';
  const reportRel = 'docs/generated/georgia-california-grade-audit-report-v2.md';

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

  const ddFetched = await fetchHtml(DBHDD_COUNTY_URL);
  const ddInspection = inspectGeorgiaDbhddCountyPage(ddFetched.html, ddFetched.finalUrl, ddFetched.fetchedAt);
  if (ddInspection.blocker_code) {
    blockers.push({
      family: 'developmental_disability_idd_authority',
      blocker_code: ddInspection.blocker_code,
      source_url: ddInspection.source_url,
      final_url: ddInspection.final_url,
      reason: `Official DBHDD county table exposed ${ddInspection.rowCount} rows with region links but ${ddInspection.emptyCountyCount}/${ddInspection.rowCount} county cells were blank in static HTML.`,
    });
  }

  for (const candidate of DISTRICT_CANDIDATES) {
    try {
      const fetched = await fetchHtml(candidate.url);
      const verified = verifyGeorgiaDistrictLeaf(candidate.url, fetched.html, fetched.finalUrl, fetched.fetchedAt, candidate.district_name);
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

  const exactDistrictLeafs = uniqueBy(verifiedLeafs, (row) => row.final_url);
  const updatedGaps = updateGapRows(gapRows, exactDistrictLeafs);
  const updatedFailures = updateFailureRows(failureRows, exactDistrictLeafs, ddInspection);
  const updatedVerified = updateVerifiedSources(verifiedRows, exactDistrictLeafs, ddInspection);
  const updatedNext = nextRows.map((row, index) => ({ ...row, priority_rank: index + 1 }));
  const updatedSummary = recalcSummary(summary, updatedGaps, updatedFailures, updatedVerified);
  const updatedReport = updateStateReport(reportText, exactDistrictLeafs, ddInspection);

  writeJson(summaryPath, updatedSummary);
  writeJsonl(gapPath, updatedGaps);
  writeJsonl(failurePath, updatedFailures);
  writeJsonl(verifiedPath, updatedVerified);
  writeJsonl(nextPath, updatedNext);
  fs.writeFileSync(reportPath, updatedReport);

  const batchSummary = {
    batch: 'batch_24_georgia_repair_v1',
    generated_at: new Date().toISOString(),
    state: STATE,
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    district_exact_leaves_verified: exactDistrictLeafs.length,
    dd_county_blocker_code: ddInspection.blocker_code,
    texas_preserved_complete: true,
  };

  writeJsonl(OUTPUTS.verifiedLeafs, exactDistrictLeafs);
  writeJsonl(OUTPUTS.blockers, blockers);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, `${buildBatchReport(batchSummary, ddInspection)}\n`);

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch24GeorgiaEducationDdRepairV1()
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
