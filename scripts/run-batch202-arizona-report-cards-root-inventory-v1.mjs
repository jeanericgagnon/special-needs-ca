import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'arizona_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'arizona_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'arizona_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'arizona_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'arizona_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  educationPacket: path.join(generatedDir, 'arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch202_arizona_report_cards_root_inventory_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch202-arizona-report-cards-root-inventory-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const EDUCATION_FAILURE_CODE = 'official_report_cards_district_detail_roots_live_but_not_yet_county_keyed_or_leaf_verified';
const EDUCATION_NEXT_ACTION = 'materialize_reviewed_district_root_inventory_from_report_cards_api_then_map_counties_before_special_education_leaf_authoring';
const EDUCATION_STATUS_REASON = 'The official AZ School Report Cards host now preserves reviewable district-detail roots and API-backed local routing fields, but Arizona is still not county-grade because those district-specific roots have not yet been converted into one reviewed county-keyed district inventory and no exact district special-education leaves have been attached.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 bounded official Arizona report-cards checks beyond the generic inventory call. The public AZ School Report Cards app still exposes /api/Entity/GetEntityList and the live district detail route /districts/Detail/<educationOrganizationId>. The app bundle also reveals the exact local-detail contract: /api/Entity/GetEntity?id=<educationOrganizationId>&fiscalYear=2025 returns district-specific fields including nameOfInstitution, webSite, telephone, and address, and sample live calls for St Johns Unified District (educationOrganizationId 4153), Window Rock Unified District (4154), and Round Valley Unified District (4155) returned first-party district websites plus district phones and addresses. Arizona education therefore is no longer blocked by zero local-root inventory; it is now blocked because those reviewable district roots have not yet been materialized into a county-keyed Arizona district inventory and no district-owned special-education leaves have been verified from them.';
const PRIMARY_GAP_REASON = 'des_host_challenge_plus_unmaterialized_report_cards_district_root_inventory';

const LESSON_HEADING = '### State-Hosted District Detail Apps Can Count As Local-Root Inventory Even When The Main DOE Host Is Challenged';
const LESSON_BODY = "*   **Lesson:** If a sibling official report-card app exposes district detail routes plus API fields like district website, address, and telephone, treat that app as a real local-root inventory lane instead of leaving the state at `zero_root_inventory`. Arizona's `azreportcards.azed.gov` app exposed `/districts/Detail/<id>` and `/api/Entity/GetEntity?id=<id>&fiscalYear=2025`, which is enough to seed district-root authoring before district-owned special-education leaf checks.";

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

function appendLessonIfMissing() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Arizona California-Grade Audit Report v2',
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
    '- Arizona remains BLOCKED and not index-safe.',
    '- Education is sharper than the prior zero-root blocker: the official report-cards app now proves live district-detail roots and district website/address/phone fields, so the missing work is county-keyed root materialization plus exact special-education leaf verification, not another statewide-host guess.',
    '- County/local disability resources are still blocked separately because the DES office lane remains challenge-blocked and the accessible AHCCCS artifacts still do not preserve a county-to-office contract.',
  ].join('\n') + '\n';
}

export function generateBatch202ArizonaReportCardsRootInventoryV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const queueRows = readJsonl(INPUTS.queue);
  const educationPacket = readJson(INPUTS.educationPacket);

  const reviewedSamples = [
    {
      county_hint: 'apache-az',
      educationOrganizationId: 4153,
      district_name: 'St Johns Unified District',
      detail_url: 'https://azreportcards.azed.gov/districts/Detail/4153',
      api_url: 'https://azreportcards.azed.gov/api/Entity/GetEntity?id=4153&fiscalYear=2025',
      district_website: 'http://www.sjusd.net',
      telephone: '928-337-2255',
      address: '450 S 13th W, St Johns, AZ85936',
    },
    {
      county_hint: 'apache-az',
      educationOrganizationId: 4154,
      district_name: 'Window Rock Unified District',
      detail_url: 'https://azreportcards.azed.gov/districts/Detail/4154',
      api_url: 'https://azreportcards.azed.gov/api/Entity/GetEntity?id=4154&fiscalYear=2025',
      district_website: 'https://www.wrschool.net/',
      telephone: '928-729-6706',
      address: 'Navajo Rte 12, Fort Defiance, AZ86504',
    },
    {
      county_hint: 'apache-az',
      educationOrganizationId: 4155,
      district_name: 'Round Valley Unified District',
      detail_url: 'https://azreportcards.azed.gov/districts/Detail/4155',
      api_url: 'https://azreportcards.azed.gov/api/Entity/GetEntity?id=4155&fiscalYear=2025',
      district_website: 'https://www.elks.net',
      telephone: '928-333-6580',
      address: '940 E MARICOPA DR UNIT B, SPRINGERVILLE, AZ85938-5362',
    },
  ];

  const updatedEducationPacket = {
    ...educationPacket,
    repair_lane: 'report_cards_root_materialization_then_county_keyed_mapping_then_leaf_authoring',
    purpose: 'Deterministic Arizona education packet that now has reviewable official district-detail roots on the AZ School Report Cards host and must convert them into county-keyed district root inventory before exact special-education leaf verification.',
    current_problem_metrics: {
      ...educationPacket.current_problem_metrics,
      reviewedOfficialDistrictInventoryRoots: reviewedSamples.length,
      liveDistrictOwnedRootCount: reviewedSamples.length,
      authoredExactLeafCount: 0,
      countyKeyedDistrictRootCount: 0,
    },
    exact_target_goals: [
      'official district detail root per county',
      'district special education page',
      'student services or exceptional student services page',
      'district special education contact or department page',
    ],
    representative_sources: [
      'https://azreportcards.azed.gov/api/Entity/GetEntityList',
      'https://azreportcards.azed.gov/districts/Detail/4153',
      'https://azreportcards.azed.gov/api/Entity/GetEntity?id=4153&fiscalYear=2025',
      'https://azed.gov/specialeducation',
    ],
    root_domains_to_review: [
      'official report-cards district detail roots first',
      'district-owned Arizona K-12 domains extracted from report-cards detail fields next',
      'do not reopen challenged AZED host discovery until root, robots.txt, and sitemap.xml clear',
    ],
    reviewed_root_samples: reviewedSamples,
    packet_complete_when: 'At least one reviewed Arizona district detail root or linked district-owned root is attached per affected county and then at least one reviewed district special-education or student-services leaf is attached per county without relying on generic AZED fallback rows.',
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_report_cards_district_roots_live_but_not_county_keyed',
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
          next_action: EDUCATION_NEXT_ACTION,
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_report_cards_district_roots_live_but_not_county_keyed',
          evidence_strength: 'medium',
          sample_count: 5,
          query_basis: 'Reviewed Arizona report-cards inventory, the official district detail route, and exact GetEntity detail responses to confirm that local district root fields now exist on a live official host.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
          samples: [
            {
              sample_name: 'Arizona School Report Cards District Inventory',
              source_url: 'https://azreportcards.azed.gov/api/Entity/GetEntityList',
              final_url: 'https://azreportcards.azed.gov/api/Entity/GetEntityList',
              verification_status: 'verified',
              source_type: 'official_state_inventory_api',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official report-cards inventory API returns Arizona LEA rows including St Johns Unified District, Window Rock Unified District, and Round Valley Unified District.',
            },
            ...reviewedSamples.map((sample) => ({
              sample_name: `${sample.district_name} district detail`,
              source_url: sample.detail_url,
              final_url: sample.detail_url,
              verification_status: 'verified',
              source_type: 'official_state_district_detail_root',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: `${sample.district_name} is exposed on the official report-cards host through a district detail route, and the paired GetEntity detail call preserves district website ${sample.district_website}, phone ${sample.telephone}, and address ${sample.address}.`,
            })),
            {
              sample_name: 'Arizona Department of Education Special Education Challenge Shell',
              source_url: 'https://www.azed.gov/specialeducation',
              final_url: 'https://www.azed.gov/specialeducation',
              verification_status: 'blocked',
              source_type: 'official_browser_challenge',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The main AZED special-education root still returns the Cloudflare challenge shell, so the local lane must materialize from the report-cards host instead of the challenged AZED host.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: EDUCATION_FAILURE_CODE,
          next_action: EDUCATION_NEXT_ACTION,
          evidence: EDUCATION_EVIDENCE,
        }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE }
        : row
    )),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'arizona'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
        }
      : row
  ));

  writeJson(INPUTS.educationPacket, updatedEducationPacket);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.queue, updatedQueueRows);

  const lessonsUpdated = appendLessonIfMissing();
  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);
  fs.writeFileSync(OUTPUTS.report, `${stateReport}\n`);

  const batchSummary = {
    state: 'arizona',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewed_official_district_inventory_roots: reviewedSamples.length,
    county_keyed_district_roots: 0,
    authored_exact_leaves: 0,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.summary, batchSummary);
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch202ArizonaReportCardsRootInventoryV1();
  console.log(JSON.stringify(result, null, 2));
}
