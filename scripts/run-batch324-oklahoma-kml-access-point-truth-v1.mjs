import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'oklahoma_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'oklahoma_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'oklahoma_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'oklahoma_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'oklahoma_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'oklahoma-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch324_oklahoma_kml_access_point_truth_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch324-oklahoma-kml-access-point-truth-report-v1.md'),
};

const BATCH_NAME = 'batch324_oklahoma_kml_access_point_truth_v1';
const PRIMARY_GAP_REASON =
  'live_okdhs_kml_only_yields_45_benefit_capable_counties_while_tanf_only_access_points_and_child_support_only_county_tree_cannot_close_the_remaining_32';
const FAILURE_CODE =
  'live_okdhs_kml_only_yields_45_benefit_capable_counties_while_tanf_only_access_points_and_child_support_only_tree_do_not_close_remaining_32';
const FAMILY_STATUS = 'blocked_okdhs_kml_partial_county_contract_with_service_limited_access_points';
const NEXT_ACTION =
  'hold_blocked_until_live_oklahoma_human_services_county_export_or_county_owned_local_office_leaves_cover_the_remaining_32_counties';

const COUNTY_REASON =
  'Reviewed 2026-06-24 one more bounded official Oklahoma county-local pass against the live OKDHS office-map KML rather than only the older county-key heuristic. The current successor lane is still real: `https://oklahoma.gov/okdhs/contact-us.html` directs users to the public office map and the backing KML at `https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1` is publicly fetchable. But a stricter role-aware review now shows the KML only yields 45 benefit-capable county-local contracts, not 46. It contains 60 placemarks total, yet only 43 preserve an explicit `County Name:` field and only some of the remaining `Access Point - <County>` placemarks are usable for this family. Access points that advertise `SNAP, Child Care, Medical` can count as county-local benefit routing for counties like Caddo, Cherokee, Choctaw, Delaware, Latimer, Love, Mayes, Oklahoma, and Tulsa, but Grady (`TANF`), Pittsburg (`TANF Only`), and Washington (`TANF Only`) do not satisfy the broader disability/local-routing role. The same host still proves county trees are technically publishable because `https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html` exposes a county-by-county tree, but that surface is explicitly `Child Support District Offices` and cannot substitute for disability/local routing. The DDS apply page at `https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html` remains statewide-only with one phone/email and no county-served matrix. Oklahoma therefore remains blocked with 32 counties still lacking truth-safe county-local routing on current official evidence.';

const BLOCKER_EVIDENCE =
  'Reviewed 2026-06-24 bounded official Oklahoma checks on `https://oklahoma.gov/okdhs/contact-us.html`, the public KML office-map feed at `https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1`, `https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html`, and `https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html`. The live KML preserves 60 placemarks, but only 45 counties now qualify as benefit-capable county-local routing after strict review: 43 placemarks expose an explicit `County Name:` field and only a subset of `Access Point - <County>` rows advertise `SNAP, Child Care, Medical`. TANF-limited access points for Grady, Pittsburg, and Washington do not satisfy the broader county-local disability routing role. The same host still publishes a county tree for Child Support District Offices, which proves county trees are technically possible but does not clear disability/local routing. The DDS area-contact page remains one statewide intake route with no county-served matrix. Oklahoma therefore still lacks county-local proof for the remaining 32 counties: Adair, Alfalfa, Beaver, Blaine, Cimarron, Coal, Dewey, Ellis, Grant, Greer, Harmon, Harper, Haskell, Hughes, Jefferson, Kingfisher, Kiowa, Logan, Major, Marshall, McClain, McIntosh, Murray, Noble, Nowata, Okfuskee, Pawnee, Roger Mills, Seminole, Tillman, Washita, and Woods.';

const REMAINING_COUNTIES = [
  'Adair', 'Alfalfa', 'Beaver', 'Blaine', 'Cimarron', 'Coal', 'Dewey', 'Ellis',
  'Grant', 'Greer', 'Harmon', 'Harper', 'Haskell', 'Hughes', 'Jefferson', 'Kingfisher',
  'Kiowa', 'Logan', 'Major', 'Marshall', 'McClain', 'McIntosh', 'Murray', 'Noble',
  'Nowata', 'Okfuskee', 'Pawnee', 'Roger Mills', 'Seminole', 'Tillman', 'Washita', 'Woods',
];

const LESSON_HEADING = '### Service-Limited Access Points Do Not Close A County-Local Routing Gap';
const LESSON_BODY =
  '*   **Lesson:** If an official county map includes partner access points, count them only when their published service mix matches the required local-routing role. Oklahoma’s OKDHS KML exposed extra county-named access points, but TANF-only entries for Grady, Pittsburg, and Washington could not truthfully close the broader county-local disability routing gap.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Oklahoma California-Grade Audit Report v2',
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
    '## County-local refinement',
    '',
    '- The live OKDHS contact-us page still points to one real public office-map KML, so the successor lane is official and reviewable.',
    '- The stricter KML review now proves only 45 benefit-capable counties, not 46: 43 `County Name` placemarks plus a small set of county-named access points that advertise `SNAP, Child Care, Medical`.',
    '- TANF-limited access points for Grady, Pittsburg, and Washington do not satisfy the broader county-local disability routing role and therefore cannot be counted toward California-grade coverage.',
    '- The child-support office tree remains county-complete on the same host, which proves a county contract is technically publishable, but it stays out of scope because it is explicitly child-support-only.',
    '- The DDS area-contact page is still statewide-only and does not close any county remainder.',
    '',
    '## Completion decision',
    '',
    '- Oklahoma remains `BLOCKED` and `index_safe=false`.',
    '- Education remains cleared by the current official OSDE State School and District Directory.',
    `- County-local remains blocked with a measured 32-county remainder: ${REMAINING_COUNTIES.join(', ')}.`,
    '- Oklahoma therefore still cannot be marked `COMPLETE` or index-safe.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const replacement = '- Oklahoma remains blocked on a stricter county-local truth test: the live OKDHS KML only yields 45 benefit-capable counties once TANF-only access points are excluded, and the same host’s full county tree is still child-support-only.';
  const lines = text
    .split('\n')
    .filter((line) => !line.includes('Oklahoma remains blocked, but the blocker is now tighter'));
  const next = lines.join('\n');
  return next.includes(replacement) ? next : `${next.trimEnd()}\n${replacement}\n`;
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
    '`county_local_disability_resources` remains the top Oklahoma blocker. The live OKDHS office-map KML is real, but a stricter role-aware review shows it only yields 45 benefit-capable counties once TANF-only access points are excluded. The same first-party host still proves county trees are technically publishable for child-support offices, but not yet for the missing disability/local-routing remainder.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any current official Oklahoma county-local office directory or export that closes the 32-county remainder on the OKDHS host.',
    '- Any official county-owned or state-owned successor leaves that explicitly map the unresolved counties to public assistance or disability-routing offices.',
    '- Any public API, CSV, JSON, ArcGIS, or HTML contract on the official host that exposes the missing county assignments directly.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Oklahoma DHS Office Locator](https://oklahoma.gov/okdhs/library/maps.html)',
    '- [Oklahoma DHS Offices map](https://oklahoma.gov/okdhs/about/okdhs-offices.html)',
    '- [Oklahoma Human Services Contact Us](https://oklahoma.gov/okdhs/contact-us.html)',
    '- [Oklahoma Human Services public office-map KML](https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1)',
    '- [Oklahoma Child Support offices tree](https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html)',
    '- [Oklahoma DDS area-contact page](https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any exact official OKDHS county-office export or county-filter contract that covers the unresolved counties.',
    '- Any official county-level benefit or disability-routing leaf linked from the same host but not yet packeted.',
    `- The current measured county remainder is: ${REMAINING_COUNTIES.join(', ')}.`,
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

function buildBatchReport(summary) {
  return [
    '# Batch 324 Oklahoma KML Access-Point Truth v1',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    '- change: replaced the fuzzy 46-county Oklahoma KML claim with a role-aware 45-county contract and a 32-county explicit remainder',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch324OklahomaKmlAccessPointTruthV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'batch_3_procedure_hardening',
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: FAILURE_CODE,
        evidence: BLOCKER_EVIDENCE,
        next_action: NEXT_ACTION,
      },
    ],
    familyStatuses: {
      ...summary.familyStatuses,
      county_local_disability_resources: FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: COUNTY_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: BLOCKER_EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
        ...row,
        family_status: FAMILY_STATUS,
        sample_count: 6,
        blocker_code: FAILURE_CODE,
        blocker_evidence: BLOCKER_EVIDENCE,
        query_basis: 'Reviewed the live Oklahoma Human Services Contact Us page, the backing public KML office feed, access-point service mixes, the DDS area-contact page, and the child-support county tree on the current Oklahoma.gov host.',
        samples: [
          {
            sample_name: 'Oklahoma Human Services Contact Us page',
            source_url: 'https://oklahoma.gov/okdhs/contact-us.html',
            verification_status: 'reviewed',
            source_type: 'official_general_office_root',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'The page says people looking for their local office are in the right place and embeds the public office map.'
          },
          {
            sample_name: 'Oklahoma Human Services public office-map KML',
            source_url: 'https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1',
            verification_status: 'reviewed',
            source_type: 'official_kml_partial_county_contract',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'Bounded review of the public KML preserved 60 placemarks but only 45 benefit-capable county-local matches after TANF-only access points were excluded.'
          },
          {
            sample_name: 'Benefit-capable access point example',
            source_url: 'https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1',
            verification_status: 'reviewed',
            source_type: 'official_access_point_with_benefit_scope',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'Access Point - Caddo advertises `SNAP, Child Care, Medical`, making it a truth-safe county-local benefit-routing point on the official map.'
          },
          {
            sample_name: 'Service-limited access point exclusion',
            source_url: 'https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1',
            verification_status: 'reviewed',
            source_type: 'official_access_point_too_narrow_for_family',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'Access Point - Pittsburg advertises `TANF Only`, so it does not satisfy the broader county-local disability routing role.'
          },
          {
            sample_name: 'Oklahoma child-support county tree',
            source_url: 'https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html',
            verification_status: 'reviewed',
            source_type: 'official_service_specific_county_tree',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'The page explicitly preserves Child Support District Offices and a county-by-county tree across the state, proving the host can publish county contracts without clearing disability/local routing.'
          },
          {
            sample_name: 'Oklahoma DDS area-contact page',
            source_url: 'https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html',
            verification_status: 'reviewed',
            source_type: 'official_statewide_intake_only',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'The page preserves one statewide DDS intake phone/email route with no county-served matrix.'
          }
        ],
      }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: BLOCKER_EVIDENCE }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'oklahoma'
      ? {
        ...row,
        primary_gap_reason: PRIMARY_GAP_REASON,
        recommended_batch: 'batch_3_procedure_hardening',
        classification: 'BLOCKED',
        status: 'BLOCKED',
        index_safe: false,
        completeness_pct: 83,
        missing_critical_families: 0,
        weak_critical_families: 1,
      }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    generatedAt: new Date().toISOString(),
    states: allStateAudit.states.map((row) => (
      row.stateId === 'oklahoma'
        ? {
          ...row,
          classification: 'BLOCKED',
          indexSafe: false,
          completenessPct: 83,
          strongCriticalFamilies: 10,
          weakCriticalFamilies: 1,
          missingCriticalFamilies: 0,
          packetGenerated: true,
          packetBatch: BATCH_NAME,
          packetPrimaryGapReason: PRIMARY_GAP_REASON,
          packetRecommendedBatch: 'batch_3_procedure_hardening',
          familyStatuses: {
            ...row.familyStatuses,
            county_local_disability_resources: FAMILY_STATUS,
          },
        }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAudit));
  appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    state: 'oklahoma',
    classification: 'BLOCKED',
    liveSuccessorOfficeMapVerified: true,
    officeMapPlacemarkCount: 60,
    explicitCountyFieldCount: 43,
    benefitCapableCountyCoverageCount: 45,
    excludedServiceLimitedAccessPointCount: 3,
    remainingCountyGapCount: 32,
    remainingCountyGap: REMAINING_COUNTIES,
    childSupportCountyTreeVerified: true,
    ddsStatewideOnlyVerified: true,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(updatedSummary));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch324OklahomaKmlAccessPointTruthV1();
  console.log(JSON.stringify(result, null, 2));
}
