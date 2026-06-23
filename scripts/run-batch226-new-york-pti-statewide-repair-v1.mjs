import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-york_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-york_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-york_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-york_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-york_next_action_queue_v2.jsonl'),
  ptiPacket: path.join(generatedDir, 'new-york_parent_training_information_center_scope_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch226_new_york_pti_statewide_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch226-new-york-pti-statewide-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-york-california-grade-audit-report-v2.md'),
};

const PTI_REASON =
  'Reviewed 2026-06-23 the authoritative Parent Center Hub New York leaf plus the listed first-party Starbridge host. `https://www.parentcenterhub.org/findurcenter/new-york/` explicitly says `There are 5 PTIs serving New York State` and then lists Starbridge, Advocates for Children of New York, INCLUDEnyc, Sinergia/Metropolitan Parent Center, and Long Island Advocacy Center with their service areas. The listed Starbridge host also resolves live at `https://starbridgeinc.org/`, so New York now has reviewed authoritative statewide PTI coverage rather than only the old Western New York regional blocker.';

const LESSON_HEADING =
  '### Parent Center Hub Can Prove Distributed Statewide PTI Coverage Even When No Single Center Covers The Entire State';
const LESSON_BODY =
  '*   **Lesson:** If an authoritative Parent Center Hub state leaf explicitly says multiple PTIs together serve the whole state, that can satisfy a statewide PTI gate even when each listed center has a regional service area. New York cleared once the Hub leaf said `There are 5 PTIs serving New York State` and named the regional coverage split, while the listed Starbridge host also resolved live.';

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

function buildPtiPacket() {
  return {
    state: 'new-york',
    family: 'parent_training_information_center',
    repair_lane: 'resolved_authoritative_statewide_leaf_plus_first_party_host',
    packet_complete_when:
      'The authoritative New York Parent Center Hub leaf preserves statewide PTI coverage and at least one listed first-party host remains live.',
    current_metrics: {
      reviewedRegionalSources: 1,
      reviewedStatewideSources: 1,
      listedPtiCount: 5,
      statewideCoverageProven: true,
    },
    authoritative_statewide_source: 'https://www.parentcenterhub.org/findurcenter/new-york/',
    supporting_first_party_host: 'https://starbridgeinc.org/',
    listed_ptis: [
      'Starbridge',
      'Advocates for Children of New York',
      'INCLUDEnyc',
      'Sinergia/Metropolitan Parent Center',
      'Long Island Advocacy Center',
    ],
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New York Blocker Packets v4',
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
    '## PTI repair',
    '',
    '- `parent_training_information_center` is now verified from the authoritative Parent Center Hub New York state leaf plus the live listed first-party Starbridge host.',
    '- The authoritative leaf explicitly says `There are 5 PTIs serving New York State`, so the PTI gate is now statewide by reviewed coverage split rather than blocked on one regional center.',
    '',
    '## Completion decision',
    '',
    '- New York remains `BLOCKED` and `index_safe=false`.',
    '- County-local remains blocked on a host-wide official 403 plus zero reviewed replacement locators.',
    '- Education remains blocked because three exact BOCES leaves are not enough for 62-county coverage.',
    '- PTI is no longer a blocker.',
  ].join('\n') + '\n';
}

export function generateBatch226NewYorkPtiStatewideRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'parent_training_information_center'
      ? {
          ...row,
          family_status: 'verified_state_grade',
          status_reason: PTI_REASON,
        }
      : row
  ));

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'parent_training_information_center');

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'parent_training_information_center') return row;
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      query_basis: 'Reviewed 2026-06-23 the authoritative Parent Center Hub New York leaf plus the listed first-party Starbridge host.',
      blocker_code: null,
      blocker_evidence: null,
      sample_count: 2,
      samples: [
        {
          sample_name: 'Parent Center Hub New York PTI listing',
          source_url: 'https://www.parentcenterhub.org/findurcenter/new-york/',
          final_url: 'https://www.parentcenterhub.org/findurcenter/new-york/',
          verification_status: 'reviewed',
          source_type: 'authoritative_state_leaf',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'There are 5 PTIs serving New York State. Starbridge (serving statewide except for the 5 boroughs of New York City and Long Island) ... Advocates for Children of New York ... INCLUDEnyc ... Sinergia/Metropolitan Parent Center ... Long Island Advocacy Center.',
        },
        {
          sample_name: 'Starbridge first-party host',
          source_url: 'https://starbridgeinc.org/',
          final_url: 'https://starbridgeinc.org/',
          verification_status: 'reviewed',
          source_type: 'listed_first_party_host',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The listed Starbridge first-party host resolves live with title `Home - Starbridge` and H1 `Welcome to Starbridge`.',
        },
      ],
    };
  });

  const updatedNextRows = nextRows.filter((row) => row.family !== 'parent_training_information_center');

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    major_gap_families: [],
    final_blockers: (summary.final_blockers || []).filter((row) => row.family !== 'parent_training_information_center'),
  };

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const ptiPacket = buildPtiPacket();
  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch226_new_york_pti_statewide_repair_v1',
    state: 'new-york',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    ptiFamilyRepaired: true,
    listedPtiCount: 5,
    supportingFirstPartyHostLive: true,
    lesson_added: lessonAdded,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.ptiPacket, ptiPacket);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch226NewYorkPtiStatewideRepairV1();
}
