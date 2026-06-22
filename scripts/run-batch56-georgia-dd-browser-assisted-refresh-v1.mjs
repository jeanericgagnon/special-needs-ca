import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'georgia_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'georgia_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'georgia_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'georgia_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'georgia_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'georgia-california-grade-audit-report-v2.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch56_georgia_dd_browser_assisted_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch56-georgia-dd-browser-assisted-refresh-report-v1.md'),
};

const DD_BLOCKER_CODE = 'browser_visible_official_region_pages_not_rehydrated_from_static_403_shells';
const DD_STATUS = 'blocked_browser_assisted_region_rehydration_required';
const DD_REASON = 'Live browser-visible official DBHDD Region 2, 3, and 6 field-office pages prove the region leaves are still active and include counties served plus intake contacts, but the low-token static fetch lane still records 403 shells for the region pages and reviewed saved evidence has not yet rehydrated all six regions into a deterministic 159-county map.';
const DD_NEXT_ACTION = 'rerun_dbhdd_region_pages_through_browser_assisted_county_extraction_for_all_six_regions';
const FETCHED_AT = '2026-06-21T00:00:00.000Z';

const DD_SAMPLES = [
  {
    sample_name: 'Regional Field Office by County',
    source_url: 'https://dbhdd.georgia.gov/regional-field-office-county',
    final_url: 'https://dbhdd.georgia.gov/regional-field-office-county',
    verification_status: 'verified',
    source_type: 'official_browser_visible_directory',
    source_table: 'batch56_georgia_dd_browser_assisted_refresh',
    fetched_at: FETCHED_AT,
    evidence_snippet: 'Regional Field Office by County. Enter your county to determine your regional field office.',
  },
  {
    sample_name: 'Region 2 Field Office',
    source_url: 'https://dbhdd.georgia.gov/region-2-field-office',
    final_url: 'https://dbhdd.georgia.gov/region-2-field-office',
    verification_status: 'verified',
    source_type: 'official_browser_visible_region_page',
    source_table: 'batch56_georgia_dd_browser_assisted_refresh',
    fetched_at: FETCHED_AT,
    evidence_snippet: 'The Region 2 Field Office plans and oversees a network of public mental health, developmental disabilities, addictive disease and prevention services for 33 counties in East Central Georgia.',
  },
  {
    sample_name: 'Region 3 Field Office',
    source_url: 'https://dbhdd.georgia.gov/region-3-field-office',
    final_url: 'https://dbhdd.georgia.gov/region-3-field-office',
    verification_status: 'verified',
    source_type: 'official_browser_visible_region_page',
    source_table: 'batch56_georgia_dd_browser_assisted_refresh',
    fetched_at: FETCHED_AT,
    evidence_snippet: 'Counties in this region include Clayton, Dekalb, Fulton, Gwinnett, Newton, and Rockdale.',
  },
  {
    sample_name: 'Region 6 Field Office',
    source_url: 'https://dbhdd.georgia.gov/region-6-field-office',
    final_url: 'https://dbhdd.georgia.gov/region-6-field-office',
    verification_status: 'verified',
    source_type: 'official_browser_visible_region_page',
    source_table: 'batch56_georgia_dd_browser_assisted_refresh',
    fetched_at: FETCHED_AT,
    evidence_snippet: 'Counties in this region include Butts, Carroll, Chattahoochee, Clay, Coweta, Crawford, Crisp, Dooly, Fayette, Harris, Heard, Henry, Houston, Lamar, Macon, Marion, Meriwether, Muscogee, Peach, Pike, Quitman, Randolph, Schley, Spalding, Stewart, Sumter, Talbot, Taylor, Troup, Upson and Webster.',
  },
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
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
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function upsertLesson(lessonsText) {
  const heading = '### Browser-Visible Official Pages Can Falsely Look Like Static 403s';
  if (lessonsText.includes(heading)) {
    return lessonsText;
  }
  const lesson = [
    '',
    heading,
    '*   **Problem:** Georgia DBHDD region pages returned `403` in the low-token static fetch lane and were treated as dead or forbidden, while browser-visible official pages still exposed counties served and DD intake contacts.',
    '*   **Lesson:** Before final-blocking an official county-grade family on repeated static `403` shells, run one bounded browser-visible verification pass on the same reviewed official URLs. Treat a static/browser mismatch as a scraper-lane blocker that needs browser-assisted rehydration, not as proof that the official source family is gone.',
  ].join('\n');
  return `${lessonsText.trimEnd()}\n${lesson}\n`;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Georgia California-Grade Audit Report v2',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    `- primary_gap_reason: ${summary.primary_gap_reason}`,
    '',
    '## Family status',
    '',
    ...gapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`),
    '',
    '## Failure ledger',
    '',
    ...failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Georgia final blocker decision',
    '',
    '- Developmental disability routing remains blocked, but the old “region pages are forbidden/gone” story was too weak. Live browser-visible official DBHDD Region 2, 3, and 6 pages now prove the region leaves are still active and expose counties served plus DD intake contacts.',
    '- Georgia still cannot upgrade the DD family to California-grade in this pass because the low-token static fetch lane saved 403 shells for all six region pages and the reviewed artifact chain still has not rehydrated all six regions into a deterministic 159-county county-to-region map.',
    '- District or county education routing remains blocked because only 5 reviewed district-owned exact leaves across the bounded Georgia packet evidence have been verified; that is not enough to truthfully prove county-grade routing across 159 Georgia counties without reopening broad district discovery.',
    '- Georgia remains blocked and not index-safe until the DD family completes browser-assisted six-region rehydration and education gains new exact district-owned county leaves.',
  ].join('\n') + '\n';
}

export function generateBatch56GeorgiaDdBrowserAssistedRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const lessonsText = fs.readFileSync(INPUTS.lessons, 'utf8');

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? {
          ...row,
          family_status: DD_STATUS,
          status_reason: DD_REASON,
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? {
          ...row,
          failure_code: DD_BLOCKER_CODE,
          evidence: DD_REASON,
          next_action: DD_NEXT_ACTION,
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? {
          ...row,
          family_status: DD_STATUS,
          evidence_strength: 'medium',
          sample_count: DD_SAMPLES.length,
          query_basis: 'Reviewed browser-visible official DBHDD directory root plus Region 2, 3, and 6 field-office pages; static fetch artifacts still need full six-region rehydration.',
          blocker_code: DD_BLOCKER_CODE,
          blocker_evidence: DD_REASON,
          samples: DD_SAMPLES,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? {
          ...row,
          failure_code: DD_BLOCKER_CODE,
          next_action: DD_NEXT_ACTION,
          evidence: DD_REASON,
        }
      : row
  ));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    missing_critical_families: 0,
    primary_gap_reason: DD_BLOCKER_CODE,
    critical_gap_families: updatedFailureRows.filter((row) => row.severity === 'critical').map((row) => row.family),
    major_gap_families: updatedFailureRows.filter((row) => row.severity === 'major').map((row) => row.family),
    verified_source_families_with_samples: updatedVerifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: updatedFailureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };

  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const updatedLessons = upsertLesson(lessonsText);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);
  fs.writeFileSync(INPUTS.lessons, updatedLessons);

  const batchSummary = {
    batch: 'batch_56_georgia_dd_browser_assisted_refresh_v1',
    generated_at: FETCHED_AT,
    state: 'georgia',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_family: 'developmental_disability_idd_authority',
    failure_code: DD_BLOCKER_CODE,
    evidence_samples: DD_SAMPLES.length,
    remaining_blockers: updatedFailureRows.map((row) => row.family),
  };
  const batchReport = [
    '# Batch 56 Georgia DD Browser-Assisted Refresh Report v1',
    '',
    '- state: georgia',
    '- classification: BLOCKED',
    '- index_safe: false',
    `- updated_family: developmental_disability_idd_authority`,
    `- failure_code: ${DD_BLOCKER_CODE}`,
    `- evidence_samples: ${DD_SAMPLES.length}`,
    '',
    '## Decision',
    '',
    '- The old Georgia DD blocker overstated the problem by treating the DBHDD region pages as forbidden or gone.',
    '- Live browser-visible official pages now prove that the region leaves are still active, but the reviewed artifact chain still lacks a deterministic six-region county rehydration.',
    '- Georgia remains blocked until that browser-assisted extraction is completed and education gains broader exact district-owned county coverage.',
  ].join('\n') + '\n';

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch56GeorgiaDdBrowserAssistedRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
