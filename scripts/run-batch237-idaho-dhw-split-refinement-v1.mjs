import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const lessonsPath = path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md');

const FILES = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'idaho_county_local_disability_resources_leaf_authoring_packet_v1.json'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch237_idaho_dhw_split_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch237-idaho-dhw-split-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const COUNTY_FAILURE_CODE =
  'official_dhw_office_stack_supports_17_clean_leaf_matches_but_27_legacy_counties_still_lack_public_contract';
const COUNTY_FAMILY_STATUS =
  'blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract';
const COUNTY_STATUS_REASON =
  'The Idaho DHW office lane is now an explicit split, not a generic local-office blocker. The live official office root and sitemap still expose no county terms or county-served fields, so they do not prove county-grade routing by themselves. But the existing deterministic office packet now safely materializes 17 clean county-to-exact-office leaf matches plus one Canyon split, while 27 counties remain blocked on the dead legacy locator because no public county-to-office contract exists for them.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-23 bounded live Idaho DHW confirmation on the official root plus the existing office-leaf packet. The public root at https://healthandwelfare.idaho.gov/offices is live with title `Find a Service Location` and still preserves exact city office cards like Caldwell Office in HTML, but it exposes zero county terms or county-served fields. The exact office leaf https://healthandwelfare.idaho.gov/dhw/caldwell-office is live with title `Caldwell Office`, confirming that the packet is grounded in real reviewable DHW office leaves. Idaho county-local routing therefore splits cleanly into 17 safe county-to-exact-office replacements plus one Canyon split that still rejects Nampa as SWITC-only, while 27 counties remain blocked because the public DHW stack still exposes no truthful county-to-office contract for them.';
const COUNTY_NEXT_ACTION =
  'retain_17_clean_exact_office_replacements_keep_canyon_split_explicit_and_leave_27_legacy_counties_blocked_until_idaho_publishes_county_contract';

const STATE_PRIMARY_GAP =
  'reviewed_idaho_district_leaves_exist_and_dhw_split_is_explicit_but_county_grade_remains_incomplete';

const LESSON_HEADING =
  '### Split Partial Office Coverage Into Clean Replacements Versus Truly Unmapped Counties';
const LESSON_BODY =
  '*   **Lesson:** If a live official office root proves exact office leaves but still exposes no county-served fields, separate the safe county-to-leaf replacements from the truly unmapped counties instead of leaving one generic blocker. Idaho DHW could truthfully support 17 exact county office replacements plus a Canyon split while 27 legacy counties stayed explicitly blocked.';

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

function upsertLesson() {
  const current = fs.readFileSync(lessonsPath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(lessonsPath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function renderStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Idaho California-Grade Audit Report v2',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe}`,
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
    ...verifiedRows.map((row) => {
      const first = row.samples?.[0]?.source_url || 'n/a';
      return `- ${row.family}: ${row.family_status}; samples=${row.sample_count}; first=${first}`;
    }),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Repair decision',
    '',
    '- Idaho remains BLOCKED and not index-safe.',
    '- Education is still a county-by-county exact-leaf expansion lane.',
    '- County-local is sharper than before: 17 clean exact office replacements and the Canyon split are now explicitly separated from 27 counties that remain blocked on the absent public county-to-office contract.',
  ].join('\n') + '\n';
}

export function generateBatch237IdahoDhwSplitRefinementV1() {
  const summary = readJson(FILES.summary);
  const gapRows = readJsonl(FILES.gap);
  const failureRows = readJsonl(FILES.failures);
  const verifiedRows = readJsonl(FILES.verified);
  const nextRows = readJsonl(FILES.next);
  const packet = readJson(FILES.packet);
  const queueRows = readJsonl(FILES.queue);

  packet.current_problem_metrics.reviewedBlockedLegacyCountyCount = packet.unresolved_legacy_counties.length;
  packet.current_problem_metrics.reviewedCleanReplacementCount = packet.exact_leaf_replacements.length;

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: COUNTY_FAMILY_STATUS,
          status_reason: COUNTY_STATUS_REASON,
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: COUNTY_FAILURE_CODE,
          evidence: COUNTY_EVIDENCE,
          next_action: COUNTY_NEXT_ACTION,
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const samples = [
      {
        sample_name: 'Idaho DHW office root',
        source_url: 'https://healthandwelfare.idaho.gov/offices',
        final_url: 'https://healthandwelfare.idaho.gov/offices',
        verification_status: 'verified',
        source_type: 'official_office_root_without_county_terms',
        source_table: 'reviewed_live_probe',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The live DHW office root is titled Find a Service Location and preserves exact city office cards like Caldwell Office, but still exposes no county terms or county-served fields in public HTML.',
      },
      {
        sample_name: 'Idaho DHW Caldwell Office',
        source_url: 'https://healthandwelfare.idaho.gov/dhw/caldwell-office',
        final_url: 'https://healthandwelfare.idaho.gov/dhw/caldwell-office',
        verification_status: 'verified',
        source_type: 'official_exact_office_leaf',
        source_table: 'reviewed_live_probe',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'Caldwell Office is a live exact DHW office leaf and remains the safe county-office replacement inside the 17 clean exact replacements set.',
      },
      {
        sample_name: 'Idaho office packet clean replacements',
        source_url: 'data/generated/idaho_county_local_disability_resources_leaf_authoring_packet_v1.json',
        final_url: 'data/generated/idaho_county_local_disability_resources_leaf_authoring_packet_v1.json',
        verification_status: 'verified',
        source_type: 'reviewed_packet_with_17_clean_exact_replacements',
        source_table: 'generated_artifact',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The deterministic Idaho county-local packet now materializes 17 clean exact county-to-office replacements plus an explicit Canyon split and 27 unresolved legacy counties.',
      },
      {
        sample_name: 'Nampa mention resolves only to SWITC',
        source_url: 'https://healthandwelfare.idaho.gov/offices?page=2',
        final_url: 'https://healthandwelfare.idaho.gov/offices?page=2',
        verification_status: 'blocked',
        source_type: 'official_city_match_wrong_role',
        source_table: 'batch182_idaho_office_leaf_materialization',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The only public Nampa mention still resolves to Southwest Idaho Treatment Center (SWITC), not to a county office or benefits office leaf.',
      },
    ];
    return {
      ...row,
      family_status: COUNTY_FAMILY_STATUS,
      query_basis: 'Reviewed live official Idaho DHW office root plus one exact office leaf, then reconciled those live sources against the deterministic county-local office packet.',
      blocker_code: COUNTY_FAILURE_CODE,
      blocker_evidence: COUNTY_EVIDENCE,
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: COUNTY_FAILURE_CODE,
          next_action: COUNTY_NEXT_ACTION,
          evidence: COUNTY_EVIDENCE,
        }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: STATE_PRIMARY_GAP,
    final_blockers: summary.final_blockers.map((blocker) => (
      blocker.family === 'county_local_disability_resources'
        ? {
            ...blocker,
            failure_code: COUNTY_FAILURE_CODE,
            evidence: COUNTY_EVIDENCE,
            next_action: COUNTY_NEXT_ACTION,
          }
        : blocker
    )),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'idaho'
      ? {
          ...row,
          primary_gap_reason: STATE_PRIMARY_GAP,
        }
      : row
  ));

  writeJson(FILES.summary, updatedSummary);
  writeJsonl(FILES.gap, updatedGapRows);
  writeJsonl(FILES.failures, updatedFailureRows);
  writeJsonl(FILES.verified, updatedVerifiedRows);
  writeJsonl(FILES.next, updatedNextRows);
  writeJson(FILES.packet, packet);
  writeJsonl(FILES.queue, updatedQueueRows);

  const stateReport = renderStateReport(
    updatedSummary,
    updatedGapRows,
    updatedFailureRows,
    updatedVerifiedRows,
    updatedNextRows,
  );
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  const lessonAdded = upsertLesson();

  const batchSummary = {
    state: 'idaho',
    batch: 'batch237_idaho_dhw_split_refinement_v1',
    classification: 'BLOCKED',
    index_safe: false,
    clean_exact_replacement_counties: packet.exact_leaf_replacements.map((row) => row.county_id),
    unresolved_legacy_counties: packet.unresolved_legacy_counties,
    canyon_split_open: true,
    primary_gap_reason: STATE_PRIMARY_GAP,
    lesson_added: lessonAdded,
  };
  writeJson(OUTPUTS.summary, batchSummary);

  const batchReport = [
    '# Idaho DHW Split Refinement Report v1',
    '',
    '- state: Idaho',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: county-local DHW blocker is now explicitly split into clean exact replacements vs legacy blocked counties',
    '',
    `- clean exact replacement counties: ${packet.exact_leaf_replacements.length}`,
    `- unresolved legacy counties: ${packet.unresolved_legacy_counties.length}`,
    '- canyon split remains explicit and unresolved for Nampa vs Caldwell office semantics',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.report, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch237IdahoDhwSplitRefinementV1();
  console.log(JSON.stringify(summary, null, 2));
}
