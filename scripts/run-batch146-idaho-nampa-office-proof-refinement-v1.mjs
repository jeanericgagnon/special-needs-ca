import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch146_idaho_nampa_office_proof_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch146-idaho-nampa-office-proof-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const COUNTY_FAILURE_CODE = 'official_dhw_office_directory_exposes_exact_office_leaves_but_nampa_resolves_only_to_switc_and_county_mapping_stays_publicly_missing';
const COUNTY_STATUS_REASON = 'Reviewed 2026-06-22 current official Idaho DHW office routing pages plus the paginated office directory. The official directory still exposes 27 exact office leaves and 17 DOI-backed county rows already name-match reviewed official office leaves. But the unresolved Canyon/Nampa gap is now narrower: the official directory mentions Nampa only on page 2 for Southwest Idaho Treatment Center (SWITC), not for a county office or benefits office leaf. Twenty-seven county rows still rely on the dead legacy `dhhs.idaho.gov/locations` root, and the public DHW office stack remains city-or-ZIP search only, so county-to-office routing is still not publicly verifiable.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 current official Idaho DHW office routing pages: https://healthandwelfare.idaho.gov/contact-us, https://healthandwelfare.idaho.gov/offices?page=0, https://healthandwelfare.idaho.gov/offices?page=1, https://healthandwelfare.idaho.gov/offices?page=2, and the DHW sitemap https://healthandwelfare.idaho.gov/sitemap.xml, plus one bounded follow-up on Nampa mentions inside the public office directory HTML. The paginated official directory preserves 27 exact office entries and the sitemap preserves exact office leaves such as /dhw/boise-office-westgate-building, /dhw/pocatello-office-horizon-building, /dhw/blackfoot-office-blackfoot-services-complex, /dhw/caldwell-office, /dhw/idaho-falls-office, /dhw/payette-office, /dhw/rexburg-office, /dhw/sandpoint-ponderay-office, and /dhw/twin-falls-office-pole-line-building. Seventeen DOI-backed county rows already name-match official office leaves, but 27 county rows still use the dead legacy locator https://dhhs.idaho.gov/locations. The bounded Nampa follow-up showed that the current public directory mentions Nampa only for Southwest Idaho Treatment Center (SWITC) at 1660 11th Ave N, Nampa, ID 83687, not for a reviewed county office or benefits office leaf. The public office search is still city-or-ZIP only, so county-to-office routing cannot yet be verified.';
const COUNTY_NEXT_ACTION = 'replace_17_named_doi_rows_with_exact_office_leaves_and_keep_27_legacy_counties_blocked_until_a_public_county_to_office_contract_exists';
const LESSON_HEADING = '### City Matches Inside An Office Directory Still Need Role Checks';
const LESSON_BODY = '*   **Lesson:** If a blocked state still has one unresolved city-name office guess, verify that the city mention belongs to the right office role before treating it as progress. Idaho’s public DHW directory did mention Nampa, but only for Southwest Idaho Treatment Center, not for a county-benefits office leaf.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function updateLessonsFile(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Idaho California-Grade Audit Report v2',
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
    '- Idaho remains BLOCKED and not index-safe.',
    '- Education is still blocked on county-keyed or reviewed district special-education routing, even though the official state district directory exposes exact district links.',
    '- County-local is narrower: the missing Nampa/Canyon office question is now resolved negatively, because the official directory mentions Nampa only as Southwest Idaho Treatment Center rather than as a county office leaf.',
  ].join('\n') + '\n';
}

export function generateBatch146IdahoNampaOfficeProofRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: 'blocked_exact_office_leafs_exist_but_nampa_is_treatment_center_and_county_mapping_partial', status_reason: COUNTY_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_exact_office_leafs_exist_but_nampa_is_treatment_center_and_county_mapping_partial',
          blocker_code: COUNTY_FAILURE_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
          query_basis: 'Reviewed official Idaho DHW office directory, sitemap, and one bounded Nampa follow-up inside the public office-directory HTML.',
          samples: (row.samples || []).map((sample) => (
            sample.sample_name === 'Nampa Office unresolved exact leaf'
              ? {
                  sample_name: 'Nampa mention resolves only to SWITC',
                  source_url: 'https://healthandwelfare.idaho.gov/offices?page=2',
                  final_url: 'https://healthandwelfare.idaho.gov/offices?page=2',
                  verification_status: 'blocked',
                  source_type: 'official_city_match_wrong_role',
                  source_table: 'reviewed_live_probe',
                  fetched_at: '2026-06-22T22:25:00.000Z',
                  evidence_snippet: 'The only public Nampa mention on the official office directory is Southwest Idaho Treatment Center (SWITC) at 1660 11th Ave N, Nampa, ID 83687, not a county office or benefits office leaf.',
                }
              : sample
          )),
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: COUNTY_FAILURE_CODE, next_action: COUNTY_NEXT_ACTION, evidence: COUNTY_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'official_directories_now_expose_exact_targets_but_nampa_negative_proof_and_missing_county_mapping_keep_idaho_blocked',
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION }
        : row
    )),
  };

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  const lessonAdded = updateLessonsFile(INPUTS.lessons);

  writeJson(OUTPUTS.summary, {
    batch: 'batch_146_idaho_nampa_office_proof_refinement_v1',
    generated_at: '2026-06-22T22:28:00.000Z',
    state: 'idaho',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    refined_families: ['county_local_disability_resources'],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    nampaNegativeProof: 'SWITC_only',
    lesson_added: lessonAdded,
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Idaho Nampa Office Proof Refinement Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      '- refined_family: county_local_disability_resources',
      `- failure_code: ${COUNTY_FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${COUNTY_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (process.argv[1] === __filename || (process.argv[1] && path.resolve(process.argv[1]) === __filename)) {
  generateBatch146IdahoNampaOfficeProofRefinementV1();
  console.log('batch146_idaho_nampa_office_proof_refinement_v1: ok');
}
