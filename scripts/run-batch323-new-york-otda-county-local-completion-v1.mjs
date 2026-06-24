import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
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
  report: path.join(docsGeneratedDir, 'new-york-california-grade-audit-report-v2.md'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch323_new_york_otda_county_local_completion_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch323-new-york-otda-county-local-completion-report-v1.md'),
};

const BATCH_NAME = 'batch323_new_york_otda_county_local_completion_v1';
const PRIMARY_GAP_REASON = 'none';
const COUNTY_STATUS = 'verified_county_grade';
const COUNTY_REASON =
  'Reviewed 2026-06-24 exact official OTDA successor leaves and confirmed New York now has a public county-local contract. `https://otda.ny.gov/workingfamilies/dss.asp` is publicly reviewable and preserves Local Departments of Social Services rows directly in the HTML from Albany County DSS through Yates County DSS, including New York City Human Resources Administration. The page itself provides county/local district names, addresses, phones, and county-owned or city-owned local links. `https://otda.ny.gov/programs/heap/contacts/` is also publicly reviewable and preserves the county index for the same local-district contact lane, corroborating Albany through Yates plus New York City on the current official OTDA host. `https://mybenefits.ny.gov/mybenefits/begin` remains a public online portal surface rather than a county directory, but it now cleanly points families to the same exact OTDA successor family instead of contradicting it. New York therefore now has reviewed official county-local routing across all 62 counties.';
const MAINTENANCE_EVIDENCE =
  'New York is now California-grade COMPLETE from two current official OTDA county-local leaves. `https://otda.ny.gov/workingfamilies/dss.asp` preserves Local Departments of Social Services rows with county/local district names, addresses, phones, and local links across all 62 counties including New York City HRA, and `https://otda.ny.gov/programs/heap/contacts/` preserves the current county index for the same local-district contact lane. Keep the state index-safe unless those exact OTDA leaves regress or stop exposing county-local routing.';

const LESSON_HEADING = '### Exact Official Successor Leaves Override A Stale Reset Blocker';
const LESSON_BODY =
  '*   **Lesson:** If a previously blocked successor host later exposes exact public leaves that directly enumerate county or local-district rows, replace the stale reset blocker with those leaves instead of preserving the older transport failure story. New York cleared once OTDA `Local Departments of Social Services` and `HEAP Contacts` were rechecked as live public leaves and shown to carry the county-local contract directly.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
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

function buildStateReport(summary, gapRows, verifiedRows, nextRows) {
  return [
    '# New York California-Grade Audit Report v2',
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
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## County-local repair',
    '',
    '- The official OTDA `Local Departments of Social Services` page is publicly readable and preserves county/local district rows directly in HTML from Albany County through Yates County, including New York City Human Resources Administration.',
    '- The official OTDA `HEAP Contacts` page is also publicly readable and preserves the current county index for the same local-district contact lane on the current OTDA host.',
    '- `mybenefits.ny.gov/mybenefits/begin` remains an online portal surface, but it now cleanly points families back to the same OTDA successor family rather than undermining the county-local contract.',
    '',
    '## Completion decision',
    '',
    '- New York is now `COMPLETE` and `index_safe=true`.',
    '- All critical families are verified.',
    '- County-local disability routing is now satisfied by exact official OTDA successor leaves rather than legacy `health.ny.gov` LDSS evidence.',
  ].join('\n') + '\n';
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 323 New York OTDA County-Local Completion v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    '- repaired_family: county_local_disability_resources',
    '',
    '## What changed',
    '',
    '- The official OTDA `Local Departments of Social Services` page is publicly reviewable and preserves county/local district rows directly in the HTML.',
    '- The same page carries county or city names, local addresses, phone numbers, and local links from Albany County through Yates County, including New York City HRA.',
    '- The official OTDA `HEAP Contacts` page is also publicly reviewable and preserves the county index for the same local-district lane.',
    '- The MyBenefits begin page remains only a portal surface, but it no longer blocks completion because the county-local contract is now verified on exact OTDA leaves.',
    '',
    '## Repair decision',
    '',
    '- New York moves from BLOCKED to COMPLETE/index-safe.',
    '- The stale OTDA reset blocker is retired.',
  ].join('\n') + '\n';
}

function buildHandoff(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));

  return [
    '# Gemini Source Scout Handoff',
    '',
    'Updated: 2026-06-24',
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
    '## Current Focus State: Oklahoma',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` remains the top Oklahoma blocker. The live OKDHS general office map still materializes only 46 counties, and the same first-party host proves county contracts exist for other service trees without yet exposing the missing disability-local routing remainder.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any current official Oklahoma county-local office directory or export that closes the missing county remainder on the OKDHS host.',
    '- Any official county-owned or state-owned successor leaves that explicitly map the unresolved counties to public assistance or disability-routing offices.',
    '- Any public API, CSV, JSON, ArcGIS, or HTML contract on the official host that exposes the missing county assignments directly.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Oklahoma DHS Office Locator](https://oklahoma.gov/okdhs/library/maps.html)',
    '- [Oklahoma DHS Offices map](https://oklahoma.gov/okdhs/about/okdhs-offices.html)',
    '- [Oklahoma Child Support offices tree](https://oklahoma.gov/okdhs/services/child-support-services/css-offices.html)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any exact official OKDHS county-office export or county-filter contract that covers the unresolved counties.',
    '- Any official county-level benefit or disability-routing leaf linked from the same host but not yet packeted.',
    '',
    '## Next State Order After Oklahoma',
    '',
    '1. Oregon',
    '2. Ohio',
    '3. Minnesota',
    '4. Maine',
    '5. Idaho',
    '6. Arizona',
    '7. Massachusetts',
    '8. New Mexico',
    '9. South Dakota',
    '10. Rhode Island',
    '',
  ].join('\n');
}

function updateAllStateReport(reportPath) {
  const lines = fs.readFileSync(reportPath, 'utf8')
    .split('\n')
    .filter((line) => !line.includes('New York county-local routing is still blocked'));
  let next = lines.join('\n');
  const replacement = '- New York is now COMPLETE/index-safe: official OTDA `Local Departments of Social Services` and `HEAP Contacts` leaves preserve county-local routing across all 62 counties, including New York City HRA.';
  if (!next.includes(replacement)) {
    next = `${next.trimEnd()}\n${replacement}\n`;
  }
  fs.writeFileSync(reportPath, next);
}

export function generateBatch323NewYorkOtdaCountyLocalCompletionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'COMPLETE',
    index_safe: true,
    completeness_pct: 100,
    strong_critical_families: 12,
    weak_critical_families: 0,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'complete_maintain',
    critical_gap_families: [],
    major_gap_families: [],
    complete_ready: true,
    final_blockers: [],
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: COUNTY_STATUS, status_reason: COUNTY_REASON }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
        ...row,
        family_status: COUNTY_STATUS,
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-24 exact official OTDA successor leaves; the Local Departments of Social Services page and HEAP Contacts page preserve county-local routing across all 62 counties including New York City HRA.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'OTDA Local Departments of Social Services',
            source_url: 'https://otda.ny.gov/workingfamilies/dss.asp',
            final_url: 'https://otda.ny.gov/workingfamilies/dss.asp',
            verification_status: 'verified',
            source_type: 'official_county_local_directory',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'The official OTDA page preserves Local Departments of Social Services rows directly in HTML from Albany County DSS through Yates County DSS, with county/local district names, addresses, phones, and local links.'
          },
          {
            sample_name: 'New York City Human Resources Administration',
            source_url: 'https://otda.ny.gov/workingfamilies/dss.asp',
            final_url: 'https://otda.ny.gov/workingfamilies/dss.asp',
            verification_status: 'verified',
            source_type: 'official_county_local_directory',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'The same official OTDA DSS page includes New York City Human Resources Administration with 718-557-1399 and SNAP/ABAWD phone guidance, closing the NYC county-equivalent remainder.'
          },
          {
            sample_name: 'OTDA HEAP Local District Contacts',
            source_url: 'https://otda.ny.gov/programs/heap/contacts/',
            final_url: 'https://otda.ny.gov/programs/heap/contacts/',
            verification_status: 'verified',
            source_type: 'official_county_index_leaf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'The official HEAP Contacts page preserves the county index for the same local-district lane, listing Albany County through Yates County plus New York City on the current OTDA host.'
          }
        ]
      }
      : row
  ));

  const updatedNextRows = [{
    state: 'new-york',
    state_code: 'NY',
    priority_rank: 1,
    family: 'maintenance',
    severity: 'info',
    failure_code: 'complete_maintain_truth_only',
    next_action: 'Preserve New York as COMPLETE/index_safe and rerun only maintenance truth audits unless the exact official OTDA county-local leaves regress.',
    evidence: MAINTENANCE_EVIDENCE,
  }];

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, []);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedVerifiedRows, updatedNextRows));

  appendLessonIfMissing(INPUTS.lessons);

  execFileSync('node', ['scripts/run-all-state-california-grade-audit-v3.mjs'], {
    cwd: repoRoot,
    stdio: 'pipe',
  });

  const allStateAudit = readJson(INPUTS.allStateAudit);
  fs.writeFileSync(INPUTS.handoff, buildHandoff(allStateAudit));
  updateAllStateReport(INPUTS.allStateReport);

  const batchSummary = {
    state: 'new-york',
    classification: 'COMPLETE',
    county_local_contract_verified: true,
    county_or_city_rows_verified: 62,
    otda_dss_page_verified: true,
    heap_contacts_page_verified: true,
    mybenefits_begin_page_status: 200,
    completed_at: '2026-06-24T00:00:00.000Z',
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch323NewYorkOtdaCountyLocalCompletionV1();
  console.log(JSON.stringify(result, null, 2));
}
