import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'iowa_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'iowa_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'iowa_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'iowa_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'iowa_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch136_iowa_statewide_structure_dead_end_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch136-iowa-statewide-structure-dead-end-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'iowa-california-grade-audit-report-v2.md'),
};

const BLOCKER_CODE = 'official_iowa_education_pages_loop_only_to_statewide_structure_and_geodata';
const NEXT_ACTION = 'hold_blocked_until_reviewed_district_owned_or_aea_owned_special_education_leaves_are_authored_outside_statewide_structure_pages';
const IOWA_REASON = 'Reviewed 2026-06-22 current official Iowa Department of Education district-maps, special-education, dispute-resolution, and AEA Performance & Accountability pages. The district-maps surface still resolves only to statewide shapefile and geodata boundary artifacts plus more statewide DOE pages. The AEA page also loops only to statewide DOE structural, budget, CASA, and special-education pages rather than naming concrete AEA-owned routing leaves. No reviewed external AEA domain or district-owned special-education page is exposed from these official statewide surfaces, so they cannot truthfully seed county-grade education routing.';
const FAILURE_EVIDENCE = 'Reviewed 2026-06-22 official Iowa district-maps, special-education, dispute-resolution, and AEA Performance & Accountability pages. The district-maps page links statewide map/geodata artifacts such as 2025-26 Iowa Public School District Boundaries and internal DOE pages, while the AEA page links only statewide DOE structural, budget, CASA, and special-education pages. These official statewide surfaces expose no reviewed external AEA domains, no district-owned special-education leaves, and no county-grade routing contracts.';
const LESSON_HEADING = '### Statewide Map And Governance Pages Are Dead Ends When They Never Link Out To Local Education Operators';
const LESSON_BODY = '*   **Lesson:** If a state education page only loops into statewide shapefiles, budgets, CASA forms, and internal special-education pages, stop treating it as a discovery lane for county routing. Iowa became cheaper once the district-maps and AEA pages were proven to expose no reviewed external AEA domains or district-owned special-education leaves, so future repair work should skip those statewide surfaces unless a new local outbound link appears.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Iowa California-Grade Truth Refresh v2',
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
    '- Iowa remains BLOCKED and not index-safe because district_or_county_education_routing still lacks any reviewed district-owned or county-grade special-education routing leaf on disk.',
    '- The blocker is now sharper: the reviewed official district-maps and AEA pages are statewide structural dead ends that never link out to concrete AEA or district-owned routing leaves.',
  ].join('\n') + '\n';
}

export function generateBatch136IowaStatewideStructureDeadEndRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'blocked_statewide_structure_dead_end', status_reason: IOWA_REASON };
    }
    return row;
  });

  const updatedFailureRows = [
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: BLOCKER_CODE,
      evidence: FAILURE_EVIDENCE,
      next_action: NEXT_ACTION,
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_statewide_structure_dead_end',
        evidence_strength: 'weak',
        blocker_code: BLOCKER_CODE,
        blocker_evidence: 'The reviewed Iowa DOE district-maps and AEA pages loop only into statewide structural pages and geodata. They expose no reviewed external AEA domains or district-owned special-education routing leaves.',
        samples: [
          {
            sample_name: 'Iowa Special Education',
            source_url: 'https://educate.iowa.gov/pk-12/special-education',
            verification_status: 'verified',
            source_type: 'official',
            source_table: 'reviewed_live_probe',
          },
          {
            sample_name: 'Iowa Dispute Resolution',
            source_url: 'https://educate.iowa.gov/pk-12/special-education/dispute-resolution',
            verification_status: 'verified',
            source_type: 'official',
            source_table: 'reviewed_live_probe',
          },
          {
            sample_name: 'School District Maps',
            source_url: 'https://educate.iowa.gov/pk-12/district-maps',
            verification_status: 'verified',
            source_type: 'official_structural',
            source_table: 'batch136_iowa_statewide_structure_dead_end_refresh',
          },
          {
            sample_name: 'AEA Performance & Accountability',
            source_url: 'https://educate.iowa.gov/pk-12/aea-performance-accountability',
            verification_status: 'verified',
            source_type: 'official_structural',
            source_table: 'batch136_iowa_statewide_structure_dead_end_refresh',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = updatedFailureRows.map((row, index) => ({
    state: row.state,
    state_code: row.state_code,
    priority_rank: index + 1,
    family: row.family,
    severity: row.severity,
    failure_code: row.failure_code,
    next_action: row.next_action,
    evidence: row.evidence,
  }));

  const updatedSummary = {
    ...summary,
    batch: 'batch_136_iowa_statewide_structure_dead_end_refresh_v1',
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: BLOCKER_CODE,
    critical_gap_families: ['district_or_county_education_routing'],
    major_gap_families: [],
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

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'iowa',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_family: 'district_or_county_education_routing',
    blocker_code: BLOCKER_CODE,
    official_outbound_local_links_found: 0,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 136 Iowa Statewide Structure Dead-End Refresh Report v1',
      '',
      'This pass does not reopen Iowa acquisition. It sharpens the last education blocker by proving the official statewide DOE pages are structural dead ends for local routing rather than valid district or AEA discovery lanes.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      `- blocker_code: ${batchSummary.blocker_code}`,
      `- official_outbound_local_links_found: ${batchSummary.official_outbound_local_links_found}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch136IowaStatewideStructureDeadEndRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
