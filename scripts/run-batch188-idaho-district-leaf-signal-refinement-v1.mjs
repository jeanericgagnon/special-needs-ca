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
  batchSummary: path.join(generatedDir, 'batch188_idaho_district_leaf_signal_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch188-idaho-district-leaf-signal-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'district_owned_roots_now_show_live_special_services_leaf_signals_but_county_mapping_and_office_contracts_still_incomplete';
const EDUCATION_STATUS_REASON = 'The Idaho education packet is now sharper than a generic root-authoring lane. The official School Districts page and its public page JSON preserve 116 exact outbound district website links, and bounded checks on sampled district-owned roots already show likely education-routing leaves on the district hosts themselves: Cassia District sitemap exposes `/page/special-services/`, Payette Joint District navigation exposes `/departments/special-education`, and Pocatello-Chubbuck SD25 exposes `/departments/special-services` plus `/schools-programs/special-programs`. But the statewide directory still exposes no explicit county field or county-to-district contract, and the current DB rows still all point at statewide SDE fallbacks rather than reviewed district-owned leaves. Idaho therefore remains blocked until those district-owned leaf signals are converted into reviewed county-grade special-education or student-services pages.';
const EDUCATION_FAILURE_CODE = 'official_district_roots_now_show_live_special_services_leaf_signals_but_not_reviewed_county_grade_leaves';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 bounded live official Idaho SDE probes on https://www.sde.idaho.gov/school-districts/ and https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049, then ran one bounded sample on five district-owned roots taken directly from the official directory. The official SDE surfaces still preserve 116 exact outbound district website links and 30 county-bearing names, but still expose no explicit county field, county filter, or district special-education contacts. The sampled district-owned roots prove the next lane is exact district leaf authoring from those local sites rather than another statewide reread: https://www.cassiaschools.org/sitemap.xml exposes https://www.cassiaschools.org/page/special-services/ and a `compliance504` route; https://www.payetteschools.org/ navigation exposes /our-district/departments/special-education; and https://www.sd25.us/ exposes /departments/special-services plus /schools-programs/special-programs on the public homepage and robots surface. Blaine County District homepage text also preserves special-education and 504 signals on the district-owned host even though an exact department leaf was not yet isolated in this bounded pass. A live DB reconciliation still shows all 44 Idaho county rows pointing at statewide SDE fallbacks rather than reviewed district-owned leaves: 42 rows use https://www.sde.idaho.gov/sped/ and 2 rows (Ada and Canyon) still use the generic SDE root https://www.sde.idaho.gov/. Idaho education therefore remains blocked, but the exact next lane is now narrower: author reviewed district-owned special-education or student-services leaves from the official district roots and their local sitemap/navigation signals.';

const LESSON_HEADING = '### Sample District-Owned Roots Before Reopening A Statewide Education Blocker';
const LESSON_BODY = '*   **Lesson:** If an official state district directory already yields local domains, sample a few district-owned roots plus `robots.txt` or sitemap before rereading the state directory again. Idaho’s official SDE page still lacked county mapping, but Cassia, Payette, and SD25 immediately exposed likely `/special-services` or `/special-education` leaves on district-owned surfaces, which proved the next lane was exact local leaf authoring.';

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
    '- Education is now a clearer district-owned leaf-authoring lane: the official SDE directory still lacks county mapping, but sampled district-owned roots already expose likely special-education or special-services leaves on local sites.',
    '- County-local is still blocked on incomplete county-to-office mapping even though the exact DHW office leaf packet is materially stronger than the old locator placeholder.',
    '- Future Idaho repair should start from district-owned sitemap/navigation leaves and the exact DHW office-leaf packet, not from more statewide root rereads.',
  ].join('\n') + '\n';
}

export function generateBatch188IdahoDistrictLeafSignalRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, status_reason: EDUCATION_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      blocker_code: EDUCATION_FAILURE_CODE,
      blocker_evidence: EDUCATION_EVIDENCE,
      query_basis: 'Reviewed the official Idaho School Districts page and public JSON, then sampled district-owned roots from that official directory to prove whether exact special-education leaf authoring can proceed from local sitemap/navigation signals.',
      sample_count: 5,
      samples: [
        {
          sample_name: 'Idaho School Districts page',
          source_url: 'https://www.sde.idaho.gov/school-districts/',
          final_url: 'https://www.sde.idaho.gov/school-districts/',
          verification_status: 'verified',
          source_type: 'official_statewide_district_directory',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The official School Districts page preserves 116 exact outbound district website links on official public surfaces, but it still does not expose a county field or district special-education contacts.',
        },
        {
          sample_name: 'Cassia Joint District sitemap special-services signal',
          source_url: 'https://www.cassiaschools.org/sitemap.xml',
          final_url: 'https://www.cassiaschools.org/sitemap.xml',
          verification_status: 'reviewed',
          source_type: 'district_owned_sitemap_signal',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The district-owned sitemap exposes /page/special-services/ and a compliance504 route, proving the local domain already advertises likely education-routing leaves.',
        },
        {
          sample_name: 'Payette Joint District special-education nav signal',
          source_url: 'https://www.payetteschools.org/',
          final_url: 'https://www.payetteschools.org/',
          verification_status: 'reviewed',
          source_type: 'district_owned_navigation_signal',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The district-owned homepage navigation exposes /our-district/departments/special-education, proving a likely exact local leaf exists on the district host.',
        },
        {
          sample_name: 'Pocatello-Chubbuck SD25 special-services signal',
          source_url: 'https://www.sd25.us/',
          final_url: 'https://www.sd25.us/',
          verification_status: 'reviewed',
          source_type: 'district_owned_navigation_signal',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The district-owned homepage and robots surface expose /departments/special-services plus /schools-programs/special-programs, proving the next lane should author exact local leaves from the district host.',
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
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: 'author_reviewed_special_education_or_special_services_leaves_from_official_district_roots_and_local_sitemap_navigation_signals', evidence: EDUCATION_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: 'author_reviewed_special_education_or_special_services_leaves_from_official_district_roots_and_local_sitemap_navigation_signals' }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_188_idaho_district_leaf_signal_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'idaho',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    district_roots_sampled: 5,
    positive_local_leaf_signals: 3,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const report = [
    '# Batch 188 Idaho District Leaf Signal Refinement Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: district_or_county_education_routing',
    `- failure_code: ${EDUCATION_FAILURE_CODE}`,
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Idaho remains blocked and not index-safe.',
    '- The official statewide SDE directory still does not itself satisfy county-grade education routing.',
    '- But sampled district-owned roots now prove the next honest lane is exact local leaf authoring from district sitemap/navigation signals, not more statewide directory or search churn.',
    '- The county-local blocker remains unchanged in this pass.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch188IdahoDistrictLeafSignalRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
