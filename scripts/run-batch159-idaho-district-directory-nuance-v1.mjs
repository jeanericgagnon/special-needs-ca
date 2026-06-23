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
  educationPacket: path.join(generatedDir, 'idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch159_idaho_district_directory_nuance_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch159-idaho-district-directory-nuance-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const EDUCATION_FAILURE_CODE = 'official_district_directory_and_page_json_expose_links_and_some_county_bearing_names_but_no_county_contract_or_special_education_fields';
const EDUCATION_STATUS_REASON = 'The Idaho education packet remains a district-owned leaf authoring lane only. The official School Districts page and its public WordPress page JSON preserve 116 exact outbound district website links and some county-bearing district names, but they still expose no explicit county field, no county-to-district contract, and no district special-education contact fields.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 bounded live official Idaho SDE probes on https://www.sde.idaho.gov/school-districts/, https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049, and the live DB fallback inventory. The rendered School Districts page and the public page JSON both preserve district names plus exact outbound district website links, including county-bearing names such as Blaine County District #61, Boundary County District #101, Butte County District #111, and Camas County District #121. That makes the official directory stronger than a generic statewide shell. But the same public surfaces still expose no explicit county field, no county filter or county-to-district mapping contract, and no district special-education contact fields. A live DB reconciliation still shows all 44 Idaho county rows pointing at statewide fallbacks rather than district-owned leaves: 42 rows use https://www.sde.idaho.gov/sped/ and 2 rows (Ada and Canyon) still use the generic SDE root https://www.sde.idaho.gov/. Idaho education therefore remains blocked until reviewed district-owned special-education or student-services leaves are attached.';
const EDUCATION_NEXT_ACTION = 'author_reviewed_district_targets_from_official_school_districts_directory_links_or_keep_county_routing_blocked';
const LESSON_HEADING = '### County-Bearing District Names Do Not Equal County Routing';
const LESSON_BODY = '*   **Lesson:** If an official district directory or page JSON preserves district names that happen to contain county words, do not treat that as a county-routing contract. Idaho’s SDE School Districts page named districts like `Blaine County District #61` and `Boundary County District #101`, but it still had no county field, no county filter, and no special-education contacts, so the family stayed blocked until district-owned leaves are reviewed.';

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
    '## Repair decision',
    '',
    '- Idaho remains BLOCKED and not index-safe.',
    '- The SDE district directory is now documented more precisely: it is a real public district-link contract, not a generic statewide shell.',
    '- That still does not clear county-grade education routing because the same public surfaces lack an explicit county mapping contract and district special-education fields.',
    '- Idaho education should reopen only through reviewed district-owned special-education or student-services leaves, not through more statewide SDE rereads.',
  ].join('\n') + '\n';
}

export function generateBatch159IdahoDistrictDirectoryNuanceV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const educationPacket = readJson(INPUTS.educationPacket);

  const updatedEducationPacket = {
    ...educationPacket,
    current_problem_metrics: {
      ...educationPacket.current_problem_metrics,
      officialDistrictLinks: 116,
      countyBearingDistrictNamesVisible: true,
      explicitCountyFieldVisible: false,
      districtSpecialEducationFieldsVisible: false,
    },
    representative_sources: [
      'https://www.sde.idaho.gov/school-districts/',
      'https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049',
      'district-owned Idaho K-12 domains reached from the official School Districts directory',
    ],
    packet_complete_when: 'At least one reviewed district-owned education-routing leaf is authored for every Idaho county without relying on the statewide SDE fallback URLs or inferring county coverage from county-bearing district names alone.',
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_official_district_directory_with_links_but_without_county_contract_or_special_education_fields',
          status_reason: EDUCATION_STATUS_REASON,
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_official_district_directory_with_links_but_without_county_contract_or_special_education_fields',
          query_basis: 'Reviewed the official Idaho School Districts page, its public WordPress page JSON, and the live DB fallback inventory to separate real district-link evidence from missing county-routing evidence.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
          sample_count: 3,
          samples: [
            {
              sample_name: 'Idaho School Districts page',
              source_url: 'https://www.sde.idaho.gov/school-districts/',
              final_url: 'https://www.sde.idaho.gov/school-districts/',
              verification_status: 'verified',
              source_type: 'official_statewide_district_directory',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official School Districts page preserves 116 exact outbound district website links and district names including some county-bearing names such as Blaine County District #61 and Boundary County District #101, but it does not expose a county field or district special-education contacts.',
            },
            {
              sample_name: 'Idaho School Districts page JSON',
              source_url: 'https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049',
              final_url: 'https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049',
              verification_status: 'verified',
              source_type: 'official_public_page_json',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public WordPress page JSON mirrors the district names and outbound website links from the rendered directory page, confirming the official link inventory without adding county-routing or special-education fields.',
            },
            {
              sample_name: 'Idaho education DB fallback inventory',
              source_url: 'https://www.sde.idaho.gov/school-districts/',
              final_url: 'https://www.sde.idaho.gov/school-districts/',
              verification_status: 'blocked',
              source_type: 'db_reconciliation',
              source_table: 'live_db_reconciliation',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A live DB reconciliation still shows all 44 Idaho county education rows pointing at statewide SDE fallbacks rather than reviewed district-owned leaves: 42 rows use /sped/ and 2 rows use the generic SDE root.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: EDUCATION_NEXT_ACTION, evidence: EDUCATION_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'official_directories_expose_real_public_contracts_but_county_grade_mapping_and_role_fields_still_missing',
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'district_or_county_education_routing'
        ? { ...blocker, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION }
        : blocker
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJson(INPUTS.educationPacket, updatedEducationPacket);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);

  const lessonAdded = updateLessonsFile(INPUTS.lessons);
  writeJson(OUTPUTS.summary, {
    batch: 'batch_159_idaho_district_directory_nuance_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'idaho',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    district_directory_links_verified: 116,
    county_bearing_names_visible: true,
    explicit_county_contract_visible: false,
    district_special_education_fields_visible: false,
    lesson_added: lessonAdded,
  });
  const report = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, report);
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Idaho District Directory Nuance Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      '- refined_family: district_or_county_education_routing',
      `- failure_code: ${EDUCATION_FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${EDUCATION_EVIDENCE}`,
      '',
      '## Repair decision',
      '',
      '- Idaho’s SDE School Districts page is now documented as a real public district-link contract and not just a generic statewide shell.',
      '- That still does not clear county-grade education routing because the same public surfaces lack a county mapping contract and role-specific special-education fields.',
      '- Idaho remains blocked until reviewed district-owned leaves are attached.',
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (process.argv[1] === __filename || (process.argv[1] && path.resolve(process.argv[1]) === __filename)) {
  generateBatch159IdahoDistrictDirectoryNuanceV1();
  console.log('batch159_idaho_district_directory_nuance_v1: ok');
}
