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
  failures: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch168_idaho_official_district_root_packet_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch168-idaho-official-district-root-packet-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const EDUCATION_FAILURE_CODE = 'official_district_directory_json_exposes_116_roots_and_30_county_bearing_names_but_not_special_education_leaves';
const EDUCATION_STATUS_REASON = 'The Idaho education packet is now a deterministic district-root authoring lane rather than a generic district search problem. The official School Districts page and its public page JSON preserve 116 exact outbound district website links, including 30 county-bearing district names, but still expose no explicit county field, no county-to-district contract, and no district special-education contact fields. Idaho still needs reviewed district-owned special-education or student-services leaves, but those leaves should now be authored from the official district-link packet rather than from broad search.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 bounded live official Idaho SDE probes on https://www.sde.idaho.gov/school-districts/ and https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049, plus the live DB fallback inventory. The rendered School Districts page and the public page JSON preserve 116 exact outbound district website links on official public surfaces. Within those official links, 30 district names are already county-bearing or county-paired, including Bear Lake County District #33, Blaine County District #61, Bonneville Joint District #93, Boundary County District #101, Butte County District #111, Camas County District #121, Canyon-Owyhee School Service Agency #555, Cassia Joint District #151, Clark County District #161, Fremont County Joint District #215, Jefferson County Joint District #251, Jerome Joint District #261, Minidoka County Joint District #331, Oneida County District #351, and Payette Joint District #371. That makes the official directory stronger than a generic statewide shell and gives Idaho a deterministic district-root packet. But the same public surfaces still expose no explicit county field, no county filter or county-to-district contract, and no district special-education contact fields. A live DB reconciliation still shows all 44 Idaho county rows pointing at statewide fallbacks rather than district-owned leaves: 42 rows use https://www.sde.idaho.gov/sped/ and 2 rows (Ada and Canyon) still use the generic SDE root https://www.sde.idaho.gov/. Idaho education therefore remains blocked until reviewed district-owned special-education or student-services leaves are attached from those official district roots.';

const LESSON_HEADING = '### Official Directory JSON Can Be A Root-Authoring Packet Even When It Is Not A Routing Contract';
const LESSON_BODY = '*   **Lesson:** If an official statewide directory exposes outbound local-domain links in rendered HTML and public JSON, preserve that as the exact root-authoring packet even when the page still fails county-grade routing. Idaho’s School Districts page did not satisfy county education proof, but its public JSON still yielded 116 exact district roots and 30 county-bearing names, which is far better than reopening broad district discovery.';

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
    '- The official SDE district directory is now sharper in a useful way: it already supplies a deterministic packet of district-owned roots through the rendered page and public page JSON.',
    '- That still does not clear county-grade education routing because the same public surfaces lack a county contract and district special-education fields.',
    '- Idaho education should reopen from those official district roots, not from more statewide SDE rereads or broad district discovery.',
  ].join('\n') + '\n';
}

export function generateBatch168IdahoOfficialDistrictRootPacketV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_official_district_root_packet_without_county_or_special_education_fields',
          status_reason: EDUCATION_STATUS_REASON,
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: EDUCATION_FAILURE_CODE,
          evidence: EDUCATION_EVIDENCE,
          next_action: 'author_reviewed_special_education_leaves_from_116_official_district_directory_links_or_keep_county_routing_blocked',
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_official_district_root_packet_without_county_or_special_education_fields',
          query_basis: 'Reviewed the official Idaho School Districts page, its public WordPress page JSON, and the live DB fallback inventory to convert the official district-link inventory into a deterministic root-authoring packet.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: EDUCATION_FAILURE_CODE,
          next_action: 'author_reviewed_special_education_leaves_from_116_official_district_directory_links_or_keep_county_routing_blocked',
          evidence: EDUCATION_EVIDENCE,
        }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'official_district_root_packet_and_office_leaf_packet_exist_but_county_grade_mapping_and_role_fields_still_missing',
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: 'author_reviewed_special_education_leaves_from_116_official_district_directory_links_or_keep_county_routing_blocked' }
        : row
    )),
  };

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  const batchSummary = {
    state: 'idaho',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    official_directory_link_count: 116,
    county_bearing_name_count: 30,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${stateReport}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch168IdahoOfficialDistrictRootPacketV1();
  console.log(JSON.stringify(result, null, 2));
}
