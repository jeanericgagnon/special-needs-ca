import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'nevada_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'nevada_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'nevada_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'nevada_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'nevada_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch174_nevada_welfare_office_blocker_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch174-nevada-welfare-office-blocker-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'nevada-california-grade-audit-report-v2.md'),
};

const COUNTY_FAILURE =
  'official_welfare_district_office_pages_live_but_no_county_coverage_contract';
const COUNTY_REASON =
  'Reviewed 2026-06-23 bounded live probes on the official Nevada DSS contact stack. The DSS contact hub now preserves exact Welfare District Offices-North and Welfare District Offices-South leaves with real office addresses, phones, fax numbers, and reschedule lines, but the reviewed pages label offices by city or district name only and do not map counties served. Nevada therefore still lacks a reviewed official county-to-office routing contract for all 17 counties.';
const COUNTY_NEXT =
  'hold_blocked_until_official_county_to_welfare_office_contract_is_reviewed';

const LESSON_HEADING =
  '### Live Office Leaves Still Need County Coverage Evidence';
const LESSON_BODY =
  '*   **Lesson:** If an official office stack upgrades from a dead locator root to real office leaves, do not auto-clear county-local routing unless the reviewed leaves explicitly map counties served. Nevada DSS exposed live North/South welfare office pages with real addresses and phones, but they still only named offices by city or district, so the county-local family stayed blocked.';

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
    '# Nevada California-Grade Welfare Office Blocker Refresh v2',
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
    '- Nevada remains `BLOCKED` and `index_safe=false`.',
    '- The old stale-locator explanation has been replaced with live official Nevada DSS evidence.',
    '- Nevada education routing remains cleared because the official School and District Information page still enumerates all 17 county district websites and the bounded district homepage probes already passed.',
    '- County/local disability resources remain blocked because the official DSS contact stack now exposes exact North/South welfare office pages with real office details, but those leaves still do not preserve a county-to-office contract for all 17 counties.',
  ].join('\n') + '\n';
}

export function generateBatch174NevadaWelfareOfficeBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: 'blocked_live_welfare_office_pages_without_county_contract',
      status_reason: COUNTY_REASON,
    };
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      failure_code: COUNTY_FAILURE,
      evidence: COUNTY_REASON,
      next_action: COUNTY_NEXT,
    };
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: 'blocked_live_welfare_office_pages_without_county_contract',
      query_basis: 'Reviewed 2026-06-23 the official Nevada DSS contact hub plus the exact Welfare District Offices-North and Welfare District Offices-South leaves.',
      blocker_code: COUNTY_FAILURE,
      blocker_evidence: COUNTY_REASON,
      sample_count: 4,
      samples: [
        {
          sample_name: 'Legacy Nevada locations root',
          source_url: 'https://dhhs.nv.gov/locations',
          final_url: 'https://www.dhs.nv.gov/',
          verification_status: 'blocked',
          source_type: 'legacy_root_redirect_to_generic_homepage',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The legacy local-resource root still redirects to the generic Nevada Department of Human Services homepage and is no longer the operative county-office contract.',
        },
        {
          sample_name: 'Nevada DSS Contact hub',
          source_url: 'https://www.dss.nv.gov/contact/',
          final_url: 'https://www.dss.nv.gov/contact/',
          verification_status: 'reviewed',
          source_type: 'official_contact_hub_with_exact_office_leaves',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The official DSS contact hub now links exact Welfare District Offices-North and Welfare District Offices-South pages instead of a dead locator root.',
        },
        {
          sample_name: 'Welfare District Offices-North',
          source_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-north/',
          final_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-north/',
          verification_status: 'reviewed',
          source_type: 'official_regional_office_leaf_without_county_contract',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The live North welfare office page lists offices such as Carson City, Elko / Winnemucca, Ely, Fallon, Hawthorne, Reno, Sparks, and Yerington with addresses and phones, but it does not label counties served.',
        },
        {
          sample_name: 'Welfare District Offices-South',
          source_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-south/',
          final_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-south/',
          verification_status: 'reviewed',
          source_type: 'official_regional_office_leaf_without_county_contract',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The live South welfare office page lists offices such as Belrose, Cambridge, Decatur, Eastern, Henderson, Nellis, Owens, Pahrump, Spring Mountain, and Flamingo with office details, but it still does not map Nevada counties to those offices.',
        },
      ],
    };
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      failure_code: COUNTY_FAILURE,
      next_action: COUNTY_NEXT,
      evidence: COUNTY_REASON,
    };
  });

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 92,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: 'live_welfare_office_pages_without_county_contract',
    complete_ready: false,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: COUNTY_FAILURE,
        evidence: COUNTY_REASON,
        next_action: COUNTY_NEXT,
      },
    ],
  };

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch174_nevada_welfare_office_blocker_refresh_v1',
    state: 'nevada',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    office_pages_reviewed: 2,
    county_total: 17,
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    lesson_added: lessonAdded,
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch174NevadaWelfareOfficeBlockerRefreshV1();
}
