import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'maine_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'maine_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'maine_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'maine_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'maine_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch228_maine_office_town_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch228-maine-office-town-refinement-report-v1.md'),
};

const COUNTY_FAILURE_CODE = 'official_dhhs_office_page_lists_office_towns_but_has_no_county_or_service_area_crosswalk';
const COUNTY_REASON = 'Maine now has a narrower county-local blocker than the previous zero-town claim. The live DHHS District Office Locations page is public and role-bearing and it clearly lists named office towns such as Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan, plus exact office addresses, phones, emails, and map links. But the same bounded 2026-06-23 HTML inspection still exposes zero county names, zero county-served labels, and zero service-area fields in the public page itself. Office-town text alone is not a truthful county-routing contract, so Maine county-local remains blocked until an official county or service-area crosswalk appears.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 live official Maine DHHS District Office Locations page at https://www.maine.gov/dhhs/about/contact/offices. The page preserves district office names, exact office towns and addresses, phones, emails, cross-office program notes, and `Show Map` links for offices such as Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan. But a bounded HTML inspection still exposed zero county names such as Aroostook, Washington, or York, zero county-served labels, and zero service-area fields in the public page itself. The official page therefore remains office-grade evidence without a truthful county-to-office routing contract.';
const NEXT_ACTION = 'find_official_county_or_service_area_crosswalk_for_named_dhhs_office_towns_or_keep_maine_counties_blocked';

const LESSON_HEADING = '### Office-Town Text Is Not The Same As County Coverage';
const LESSON_BODY = '*   **Lesson:** If a public office page lists real office towns and map links but never names counties or service areas, correct the blocker to “no county crosswalk” rather than “no locality text.” Maine DHHS office locations proved Bangor, Calais, Machias, and Portland office towns, but that still was not enough to claim county-grade routing.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Maine California-Grade Audit Report v2',
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
    '## Completion decision',
    '',
    '- Maine remains BLOCKED and not index-safe.',
    '- Education still needs reviewed browser/manual capture or district-owned local leaves because the public SAU replay lane still does not materialize reusable local contact rows.',
    '- County-local is now more precise: the official DHHS office page does list real office towns and map links, but it still exposes no official county or service-area crosswalk.',
    '- Future Maine county-local repair should start from an official county or service-area bridge, not from re-auditing whether the office towns exist.',
  ].join('\n') + '\n';
}

export function generateBatch228MaineOfficeTownRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedSummary = {
    ...summary,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_district_office_locations_with_towns_but_without_county_crosswalk',
        status_reason: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: COUNTY_FAILURE_CODE,
        evidence: COUNTY_EVIDENCE,
        next_action: NEXT_ACTION,
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_district_office_locations_with_towns_but_without_county_crosswalk',
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
        query_basis: 'Reviewed the live official DHHS district office page and bounded locality-field presence, distinguishing office-town text from county/service-area mapping.',
        samples: [
          {
            sample_name: 'DHHS District Office Locations',
            source_url: 'https://www.maine.gov/dhhs/about/contact/offices',
            final_url: 'https://www.maine.gov/dhhs/about/contact/offices',
            verification_status: 'blocked',
            source_type: 'official_district_office_list_without_county_crosswalk',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The official DHHS page lists district offices such as Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan with addresses, phones, emails, and map links, but it never assigns counties or service areas to those offices.',
          },
        ],
        sample_count: 1,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: COUNTY_FAILURE_CODE,
        next_action: NEXT_ACTION,
        evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_228_maine_office_town_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'maine',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    dhhs_office_page_has_county_fields: false,
    dhhs_office_page_has_town_fields: true,
    dhhs_office_page_has_service_area_fields: false,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 228 Maine Office Town Refinement Report v1',
    '',
    '- Confirmed the official DHHS office page preserves real office towns, addresses, phones, emails, and map links.',
    '- Confirmed the same public page still exposes no county names, no county-served labels, and no service-area fields.',
    '- Maine remains blocked and not index-safe because office-town text is not yet a truthful county-routing contract.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch228MaineOfficeTownRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
