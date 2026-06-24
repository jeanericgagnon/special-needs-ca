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
  report: path.join(docsGeneratedDir, 'new-york-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch311_new_york_mybenefits_begin_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch311-new-york-mybenefits-begin-refresh-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'nygov_links_exact_otda_successor_leaves_that_still_reset_while_mybenefits_begin_page_recovers_without_county_local_contract_and_health_ny_ldss_family_remains_unusable';
const FAILURE_CODE =
  'nygov_links_exact_otda_successor_leaves_that_still_reset_while_mybenefits_begin_only_exposes_online_portal_and_health_ny_ldss_family_stays_blocked';
const FAMILY_STATUS = 'blocked_health_hostwide_403_plus_otda_successor_resets_plus_mybenefits_begin_without_county_local_contract';
const NEXT_ACTION = 'hold_blocked_until_public_otda_successor_leaf_or_county_owned_locator_is_verified';
const BATCH_NAME = 'batch311_new_york_mybenefits_begin_refresh_v1';

const STATUS_REASON =
  'Reviewed 2026-06-23 one more bounded official New York county-local replacement lane using the public `ny.gov` service stack plus the recovered MyBenefits root. The original `health.ny.gov` Medicaid lane is still blocked host-wide: `ldss.htm`, `robots.txt`, `sitemap.xml`, and `/health_care/medicaid/` still return CloudFront-style 403 `Request blocked` shells and remain unusable for county-local proof. The live `https://www.ny.gov/services/social-programs` page and `https://www.ny.gov/services/apply-cooling-assistance` still strengthen the blocker instead of clearing it: the cooling-assistance page explicitly says people may apply in person at their local district office and publicly links both `https://otda.ny.gov/programs/heap/contacts/` as `HEAP Local District Contact` and `https://mybenefits.ny.gov/` as the online benefits lane. The exact OTDA benefit and contact leaves still fail on the current successor family, including `otda.ny.gov/programs/heap/contacts/`, `otda.ny.gov/programs/heap/`, `otda.ny.gov/programs/applications/4826.pdf`, `otda.ny.gov/workingfamilies/dss.asp`, and the apex `otda.ny.gov` plus `www.otda.ny.gov` roots, all of which still reset the connection in the bounded lane. `https://mybenefits.ny.gov/` has changed: it now lands publicly on `https://mybenefits.ny.gov/mybenefits/begin`, but the recovered page is still only an online portal surface rather than a county-local contract. Its live HTML only exposes account/login and portal navigation plus links back to OTDA pages like `workingfamilies/dss.asp`; it still preserves no county names, district-office directory, local-office table, or county-keyed routing contract. New York therefore remains blocked on county-local not because the successor path is unknown, but because the public New York portal still points to exact OTDA surfaces that reset while the recovered MyBenefits begin page still does not materialize county-local proof.';

const EVIDENCE =
  'Reviewed 2026-06-23 bounded official New York rechecks across `https://www.health.ny.gov/health_care/medicaid/ldss.htm`, `https://www.health.ny.gov/robots.txt`, `https://www.health.ny.gov/sitemap.xml`, `https://www.health.ny.gov/health_care/medicaid/`, `https://www.ny.gov/services/social-programs`, `https://www.ny.gov/services/apply-cooling-assistance`, `https://otda.ny.gov/programs/heap/contacts/`, `https://otda.ny.gov/programs/heap/`, `https://otda.ny.gov/programs/applications/4826.pdf`, `https://otda.ny.gov/workingfamilies/dss.asp`, `https://otda.ny.gov/`, `https://www.otda.ny.gov/`, and `https://mybenefits.ny.gov/`. The old `health.ny.gov` Medicaid lane still fails host-wide with 403 `Request blocked` shells. The live `ny.gov` service pages still explicitly route people toward `HEAP Local District Contact` on OTDA and the online benefits lane. The exact OTDA successor leaves still reset the connection in the bounded lane. `https://mybenefits.ny.gov/` no longer resets; it now lands publicly on `https://mybenefits.ny.gov/mybenefits/begin` with title `myBenefits`. But the recovered begin page still only exposes portal/login navigation and links back to OTDA pages such as `https://otda.ny.gov/workingfamilies/dss.asp`; it preserves no county names, district office table, or local district contact contract. The linked `Apply for Cooling Assistance` page still says applicants may apply by phone or in person at their `HEAP Local District Contact`, which proves the county-local contract is still expected to exist outside the recovered portal begin page. New York therefore remains blocked because the old health-host lane is unusable, the exact OTDA successor leaves still reset, and the recovered MyBenefits root still does not itself expose county-local routing proof.';

const LESSON_HEADING = '### A Recovered Benefits Portal Begin Page Is Not County-Local Proof By Itself';
const LESSON_BODY =
  '*   **Lesson:** If a benefits portal root recovers from a reset and lands on a public begin page, verify whether that page actually exposes county or district routing before treating the host as repaired. New York `mybenefits.ny.gov` recovered to `/mybenefits/begin`, but the page still only exposed portal/login navigation and links back to OTDA paths, not a county-local district office contract.';

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
    '# New York Blocker Packets v8',
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
    '## Education refinement',
    '',
    '- The official NYSED Joint Management Teams and District Superintendents pages still prove county-bearing BOCES routing for the 57 non-NYC counties.',
    '- The live NYC DOE Committees on Special Education page already closes the five-borough remainder directly, so education is no longer a New York blocker.',
    '',
    '## County-local refinement',
    '',
    '- The live `ny.gov` service stack still proves New York intends OTDA and MyBenefits to be the successor county-local lane: `Apply for Cooling Assistance` explicitly tells people they may apply in person at a local district office and links both `HEAP Local District Contact` and `mybenefits.ny.gov`.',
    '- `mybenefits.ny.gov` has recovered to a public `begin` page, but that recovered page is still only an online benefits portal surface and does not itself expose county-local district office proof.',
    '- The exact OTDA contact, application, benefit, and apex surfaces still fail in bounded live review, so the successor county-local contract remains unverified.',
    '',
    '## Completion decision',
    '',
    '- New York remains `BLOCKED` and `index_safe=false`.',
    '- Education is verified across all 62 counties.',
    '- County-local remains blocked because the old `health.ny.gov` LDSS family is unusable, the exact OTDA successor leaves still reset, and the recovered MyBenefits begin page still does not materialize county-local routing proof.',
    '- PTI remains repaired and is not a blocker.',
  ].join('\n') + '\n';
}

function buildHandoff(allStateAudit) {
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));

  return [
    '# Gemini Source Scout Handoff',
    '',
    'Updated: 2026-06-23',
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
    '## Current Focus State: New York',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining New York critical blocker. The old `health.ny.gov` LDSS family still fails host-wide, the exact OTDA successor leaves still reset, and although `mybenefits.ny.gov` now lands on a public begin page, that recovered portal surface still does not expose county-local district office routing.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official New York surface that maps counties or local social services districts to Medicaid / HEAP / public assistance office contacts on a publicly reviewable host.',
    '- Any exact OTDA successor leaf that becomes reviewable and preserves local district office contact or county-local routing.',
    '- Any county-owned or state-managed local district directory that publicly replaces the old `health.ny.gov` LDSS lane.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [New York LDSS directory](https://www.health.ny.gov/health_care/medicaid/ldss.htm)',
    '- [New York health robots.txt](https://www.health.ny.gov/robots.txt)',
    '- [New York health sitemap.xml](https://www.health.ny.gov/sitemap.xml)',
    '- [New York Medicaid root](https://www.health.ny.gov/health_care/medicaid/)',
    '- [New York Social Programs portal](https://www.ny.gov/services/social-programs)',
    '- [Apply for Cooling Assistance](https://www.ny.gov/services/apply-cooling-assistance)',
    '- [OTDA HEAP Local District Contact](https://otda.ny.gov/programs/heap/contacts/)',
    '- [OTDA HEAP root](https://otda.ny.gov/programs/heap/)',
    '- [OTDA application PDF](https://otda.ny.gov/programs/applications/4826.pdf)',
    '- [OTDA DSS locator attempt](https://otda.ny.gov/workingfamilies/dss.asp)',
    '- [OTDA root](https://otda.ny.gov/)',
    '- [OTDA www root](https://www.otda.ny.gov/)',
    '- [myBenefits root](https://mybenefits.ny.gov/)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any public OTDA contact or applications surface that stops resetting and becomes reviewable in the bounded lane.',
    '- Any county-owned or state-owned local district office directory explicitly linked from current `ny.gov`, OTDA, or MyBenefits surfaces.',
    '- Any public page on the recovered MyBenefits host that goes beyond portal begin/login flow and actually preserves county-local contact routing.',
    '',
    '## Next State Order After New York',
    '',
    '1. Oklahoma',
    '2. Oregon',
    '3. Ohio',
    '4. Minnesota',
    '5. Maine',
    '6. Idaho',
    '7. Arizona',
    '8. Massachusetts',
    '9. New Mexico',
    '10. South Dakota',
    '',
  ].join('\n');
}

function replaceAllStateNote(text) {
  const oldNote = '- New York county-local routing is still blocked because the public New York portal points to exact official OTDA and MyBenefits successor surfaces that are still not reviewable from the repo-side verification lane.';
  let next = text.replace(`${oldNote}\n`, '');
  const replacement = '- New York county-local routing is still blocked, but the live successor contract is now sharper: `mybenefits.ny.gov` recovered to a public begin page while the exact OTDA leaves still reset, and the recovered portal still does not expose county-local district office proof.';
  if (!next.includes(replacement)) next = `${next.trimEnd()}\n${replacement}\n`;
  return next;
}

function buildBatchReport(summary) {
  return [
    '# Batch 311 New York MyBenefits Begin Refresh v1',
    '',
    '- state: New York',
    `- classification: ${summary.classification}`,
    '- blocker_family: county_local_disability_resources',
    '',
    '## What was confirmed',
    '',
    '- The old `health.ny.gov` LDSS family still fails host-wide with 403 `Request blocked` shells.',
    '- The live `ny.gov` service pages still explicitly route people toward OTDA local district contact paths and the MyBenefits online lane.',
    '- The exact OTDA successor leaves and OTDA host roots still reset the connection in the bounded lane.',
    '- `mybenefits.ny.gov` no longer resets and now lands publicly on `/mybenefits/begin`.',
    '- The recovered MyBenefits begin page still only exposes portal/login navigation and links back to OTDA pages, not a county-local office contract.',
    '',
    '## Repair decision',
    '',
    '- New York remains blocked on missing reviewable county-local office routing.',
    '- The successor family is sharper, but still not reviewable enough to clear county-local proof.',
  ].join('\n') + '\n';
}

export function generateBatch311NewYorkMybenefitsBeginRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        failure_code: FAILURE_CODE,
        evidence: EVIDENCE,
        next_action: NEXT_ACTION,
      },
    ],
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const keep = (row.samples || []).filter((sample) => ![
      'MyBenefits successor root',
      'Apply for Cooling Assistance page',
      'OTDA HEAP Local District Contact',
      'OTDA application PDF linked by ny.gov',
      'New York Social Programs portal',
    ].includes(sample.sample_name));
    const samples = [
      ...keep,
      {
        sample_name: 'New York Social Programs portal',
        source_url: 'https://www.ny.gov/services/social-programs',
        final_url: 'https://www.ny.gov/services/social-programs',
        verification_status: 'reviewed',
        source_type: 'official_state_portal',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The live `Social Programs` page publicly links benefit-service leaves on the New York state portal.',
      },
      {
        sample_name: 'Apply for Cooling Assistance page',
        source_url: 'https://www.ny.gov/services/apply-cooling-assistance',
        final_url: 'https://www.ny.gov/services/apply-cooling-assistance',
        verification_status: 'reviewed',
        source_type: 'official_state_portal',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The live `Apply for Cooling Assistance` page says people may apply in person at their local district office and links both `HEAP Local District Contact` and `mybenefits.ny.gov`.',
      },
      {
        sample_name: 'OTDA HEAP Local District Contact',
        source_url: 'https://otda.ny.gov/programs/heap/contacts/',
        verification_status: 'blocked',
        source_type: 'official_successor_leaf_reset',
        source_table: BATCH_NAME,
      },
      {
        sample_name: 'OTDA application PDF linked by ny.gov',
        source_url: 'https://otda.ny.gov/programs/applications/4826.pdf',
        verification_status: 'blocked',
        source_type: 'official_successor_leaf_reset',
        source_table: BATCH_NAME,
      },
      {
        sample_name: 'MyBenefits begin page',
        source_url: 'https://mybenefits.ny.gov/',
        final_url: 'https://mybenefits.ny.gov/mybenefits/begin',
        verification_status: 'blocked',
        source_type: 'official_successor_begin_page_without_county_local_contract',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The recovered begin page is publicly readable with title `myBenefits`, but still only exposes portal/login navigation and links back to OTDA pages such as `workingfamilies/dss.asp`, not a county-local district office directory.',
      },
    ];
    return {
      ...row,
      family_status: FAMILY_STATUS,
      evidence_strength: 'medium',
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      query_basis: 'Reviewed 2026-06-23 the blocked health.ny.gov Medicaid host family, the live ny.gov service portal, the exact OTDA successor leaves, and the recovered MyBenefits begin page.',
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'new-york'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            familyStatuses: {
              ...row.familyStatuses,
              county_local_disability_resources: FAMILY_STATUS,
            },
          }
        : row
    )),
  };

  const updatedAllStateQueue = allStateQueue.map((row) => (
    row.state === 'new-york'
      ? { ...row, classification: 'BLOCKED', status: 'BLOCKED', primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  writeJsonl(INPUTS.allStateQueue, updatedAllStateQueue);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAllStateAudit));
  fs.writeFileSync(INPUTS.allStateReport, replaceAllStateNote(fs.readFileSync(INPUTS.allStateReport, 'utf8')));
  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    batch: BATCH_NAME,
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'new-york',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    health_ldss_status: 403,
    otda_heap_contacts_status: 'connection_reset',
    otda_root_status: 'connection_reset',
    mybenefits_root_status: 200,
    mybenefits_final_url: 'https://mybenefits.ny.gov/mybenefits/begin',
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(updatedSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch311NewYorkMybenefitsBeginRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
