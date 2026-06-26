import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const lessonsPath = path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md');

const INPUTS = {
  summary: path.join(generatedDir, 'wyoming_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'wyoming_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'wyoming_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'wyoming_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'wyoming_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch393_wyoming_hcbs_county_clear_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch393-wyoming-hcbs-county-clear-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'wyoming-california-grade-audit-report-v2.md'),
};

const BATCH_NAME = 'batch393_wyoming_hcbs_county_clear_v1';
const PRIMARY_GAP_REASON =
  'official_wde_public_again_but_no_reviewable_county_to_district_special_education_crosswalk_or_district_owned_special_education_leaf_set_exists';
const DISTRICT_REASON =
  'Reviewed 2026-06-25 a bounded official Wyoming district-routing recheck on the exact WDE host family. The `special-education` hub, `IDEA` page, and `School District Enrollment & Staffing Data` page all return HTTP 200 in the replayable lane, but the reviewed WDE artifacts still do not preserve a statewide county-to-district crosswalk, district directory, or district-owned special-education leaf set. Existing Wyoming district evidence still stops at generic district roots such as Albany County School District #1, Big Horn County School District #1, and Campbell County School District #1. Wyoming district or county education routing therefore remains blocked on the missing local routing contract, not on a dead WDE host.';
const COUNTY_REASON =
  'Reviewed 2026-06-25 the live official Wyoming HCBS contact stack and linked county-assignment PDF. The official `Contact Staff, Subscribe or Suggest` page on `https://health.wyo.gov/healthcarefin/hcbs/contacts-and-important-links/` is publicly reviewable and links a live official PDF at `https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf`. That PDF is titled `HCBS Benefits and Eligibility Specialists (BES) Assistance & Eligibility County Assignments` and explicitly lists `Counties Served for DD` across all 23 Wyoming counties, including `Crook, Johnson, Lincoln, Niobrara, Uinta`, `Carbon, Laramie (A-L), Weston`, `Big Horn, Platte, Sublette, Sweetwater, Washakie`, `Campbell, Converse, Goshen`, `Natrona`, `Fremont, Hot Springs`, `Albany, Sheridan, Teton`, and `Laramie (M-Z), Park`. Together the live official HCBS page, county-keyed DD assignment PDF, and current Supports Waiver application guide now provide a disability-specific county-to-contact contract on the official WDH host.';
const WAIVER_REASON =
  'Reviewed 2026-06-25 the current official HCBS public participant-facing stack on `https://health.wyo.gov/healthcarefin/hcbs/`. The live `HCBS Welcomes You` page now preserves a public `Apply for DD Waivers` lane, explains that the Supports and Comprehensive Waiver programs are the Developmental Disability Waivers, and links the current `Supports Waiver Guide and Application` PDF plus online and paper application paths on the official WDH host.';
const DD_AUTHORITY_REASON =
  'Reviewed 2026-06-25 the current official Wyoming HCBS public stack after confirming the older `dhhs.wyoming.gov/dd` host no longer resolves. The live WDH HCBS pages now expose the active state disability-waiver authority surface through the official `HCBS Welcomes You` page and `Contact Staff, Subscribe or Suggest` page, including the HCBS Section purpose, statewide section contact information, Section Administrator, Benefits and Eligibility Unit leadership, and county-keyed DD specialist assignments.';

const LESSON_HEADING =
  '### County-Keyed DD Assignment PDFs Can Clear Local Routing When Generic County Resource Pages Fail';
const LESSON_BODY =
  '*   **Lesson:** If an official county-resource page only yields aging or generic service listings, inspect the disability-program contact stack on the same official host before freezing the local blocker. Wyoming stayed blocked on aging-only county pages until the official HCBS contact page surfaced a live `Benefits and Eligibility Specialists` PDF that explicitly assigned all 23 counties for DD and CCW support.';

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

function appendLessonIfMissing() {
  const current = fs.readFileSync(lessonsPath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(lessonsPath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Wyoming California-Grade Audit Report v2',
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
    ...(failureRows.length ? failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`) : ['- none']),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...(nextRows.length ? nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`) : ['- none']),
    '',
    '## Repair decision',
    '',
    '- Wyoming remains `BLOCKED` and `index_safe=false`.',
    '- `county_local_disability_resources` now clears from the live official HCBS county-assignment PDF for DD and CCW Benefits and Eligibility Specialists across all 23 counties.',
    '- `medicaid_waiver_hcbs_disability_services` and `developmental_disability_idd_authority` now rely on the current live WDH HCBS stack instead of stale dead `dhhs.wyoming.gov/dd` or 404 waiver leaves.',
    '- `district_or_county_education_routing` remains blocked because reviewed WDE artifacts still do not provide a county-to-district crosswalk, statewide district directory, or district-owned special-education leaf set.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 393 Wyoming HCBS County Clear v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: cleared Wyoming county-local disability routing from the live official HCBS county-assignment PDF and replaced stale DD / waiver sample evidence with the current WDH HCBS public stack',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
    `- ${WAIVER_REASON}`,
    `- ${DD_AUTHORITY_REASON}`,
    `- ${DISTRICT_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch393WyomingHcbsCountyClearV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 92,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: ['district_or_county_education_routing'],
    major_gap_families: [],
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'official_wde_is_public_but_no_reviewable_county_to_district_or_special_education_crosswalk',
        evidence: DISTRICT_REASON,
        next_action: 'hold_blocked_until_wde_or_district_hosts_publish_reviewable_county_to_district_or_special_education_leaf_crosswalk',
      },
    ],
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_official_wde_public_but_without_reviewable_county_to_district_special_education_crosswalk',
        status_reason: DISTRICT_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_official_hcbs_bes_county_assignments_pdf',
        status_reason: COUNTY_REASON,
      };
    }
    if (row.family === 'medicaid_waiver_hcbs_disability_services') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: WAIVER_REASON,
      };
    }
    if (row.family === 'developmental_disability_idd_authority') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: DD_AUTHORITY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'county_local_disability_resources').map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'official_wde_is_public_but_no_reviewable_county_to_district_or_special_education_crosswalk',
        evidence: DISTRICT_REASON,
        next_action: 'hold_blocked_until_wde_or_district_hosts_publish_reviewable_county_to_district_or_special_education_leaf_crosswalk',
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.filter((row) => row.family !== 'county_local_disability_resources').map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'official_wde_is_public_but_no_reviewable_county_to_district_or_special_education_crosswalk',
        evidence: DISTRICT_REASON,
        next_action: 'hold_blocked_until_wde_or_district_hosts_publish_reviewable_county_to_district_or_special_education_leaf_crosswalk',
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_official_wde_public_but_without_reviewable_county_to_district_special_education_crosswalk',
        evidence_strength: 'weak',
        blocker_code: 'official_wde_is_public_but_no_reviewable_county_to_district_or_special_education_crosswalk',
        blocker_evidence: DISTRICT_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_official_hcbs_bes_county_assignments_pdf',
        evidence_strength: 'strong',
        query_basis: 'Reviewed 2026-06-25 the live official HCBS contact page plus the linked county-assignment PDF for DD and CCW Benefits and Eligibility Specialists.',
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 8,
        samples: [
          {
            sample_name: 'HCBS contact page',
            source_url: 'https://health.wyo.gov/healthcarefin/hcbs/contacts-and-important-links/',
            final_url: 'https://health.wyo.gov/healthcarefin/hcbs/contacts-and-important-links/',
            verification_status: 'official_verified',
            source_type: 'official_state_hcbs_contact_page',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official HCBS contact page names the HCBS Section Administrator and links `Benefits and Eligibility Specialists` under `Click below for HCBS Specialists by County`.',
          },
          {
            sample_name: 'HCBS BES county assignments PDF overview',
            source_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            final_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            verification_status: 'official_verified',
            source_type: 'official_county_assignment_pdf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The PDF title is `HCBS Benefits and Eligibility Specialists (BES) Assistance & Eligibility County Assignments` and it explicitly lists counties served for DD across all 23 Wyoming counties.',
          },
          {
            sample_name: 'HCBS BES counties served group 1',
            source_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            final_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            verification_status: 'official_verified',
            source_type: 'official_county_assignment_pdf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The DD county assignments PDF lists `Crook, Johnson, Lincoln, Niobrara, Uinta` as counties served for DD under one Benefits and Eligibility Specialist assignment.',
          },
          {
            sample_name: 'HCBS BES counties served group 2',
            source_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            final_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            verification_status: 'official_verified',
            source_type: 'official_county_assignment_pdf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same official PDF separately assigns `Carbon, Laramie (A-L), Weston` as counties served for DD.',
          },
          {
            sample_name: 'HCBS BES counties served group 3',
            source_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            final_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            verification_status: 'official_verified',
            source_type: 'official_county_assignment_pdf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official county-assignment PDF also lists `Big Horn, Platte, Sublette, Sweetwater, Washakie` as counties served for DD.',
          },
          {
            sample_name: 'HCBS BES counties served group 4',
            source_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            final_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            verification_status: 'official_verified',
            source_type: 'official_county_assignment_pdf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same official PDF separately assigns `Campbell, Converse, Goshen` and then `Natrona` in the DD county coverage table.',
          },
          {
            sample_name: 'HCBS BES counties served group 5',
            source_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            final_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            verification_status: 'official_verified',
            source_type: 'official_county_assignment_pdf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official DD county assignments also cover `Fremont, Hot Springs` and `Albany, Sheridan, Teton` as separate county groups.',
          },
          {
            sample_name: 'HCBS BES counties served group 6',
            source_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            final_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            verification_status: 'official_verified',
            source_type: 'official_county_assignment_pdf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The final DD county group on the official PDF assigns `Laramie (M-Z), Park`, completing explicit county coverage for all 23 Wyoming counties.',
          },
          {
            sample_name: 'Supports Waiver guide county-contact process',
            source_url: 'https://health.wyo.gov/wp-content/uploads/2026/03/TOOL19-Application-Guide-for-Supports-Waiver.pdf',
            final_url: 'https://health.wyo.gov/wp-content/uploads/2026/03/TOOL19-Application-Guide-for-Supports-Waiver.pdf',
            verification_status: 'official_verified',
            source_type: 'official_supports_waiver_application_guide',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The current Supports Waiver application guide instructs applicants to contact the Division Benefits and Eligibility Specialist and confirms the DD waiver application process on the official WDH host.',
          },
        ],
      };
    }
    if (row.family === 'medicaid_waiver_hcbs_disability_services') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        query_basis: 'Reviewed 2026-06-25 the current official HCBS participant-facing public stack and current Supports Waiver application guide.',
        sample_count: 2,
        samples: [
          {
            sample_name: 'HCBS Welcomes You',
            source_url: 'https://health.wyo.gov/healthcarefin/hcbs/',
            final_url: 'https://health.wyo.gov/healthcarefin/hcbs/',
            verification_status: 'official_verified',
            source_type: 'official_state_hcbs_public_root',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live HCBS page publicly explains `What are the DD Waivers?` and preserves the `Apply for DD Waivers` participant-facing lane on the official WDH host.',
          },
          {
            sample_name: 'Supports Waiver guide and application',
            source_url: 'https://health.wyo.gov/wp-content/uploads/2026/03/TOOL19-Application-Guide-for-Supports-Waiver.pdf',
            final_url: 'https://health.wyo.gov/wp-content/uploads/2026/03/TOOL19-Application-Guide-for-Supports-Waiver.pdf',
            verification_status: 'official_verified',
            source_type: 'official_supports_waiver_application_guide',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The current official Supports Waiver guide preserves eligibility criteria, DD/ID level-of-care references, and the step-by-step participant application process.',
          },
        ],
      };
    }
    if (row.family === 'developmental_disability_idd_authority') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        query_basis: 'Reviewed 2026-06-25 the current live WDH HCBS authority surfaces after confirming the older `dhhs.wyoming.gov/dd` host no longer resolves.',
        sample_count: 2,
        samples: [
          {
            sample_name: 'HCBS Welcomes You purpose and DD waivers',
            source_url: 'https://health.wyo.gov/healthcarefin/hcbs/',
            final_url: 'https://health.wyo.gov/healthcarefin/hcbs/',
            verification_status: 'official_verified',
            source_type: 'official_state_hcbs_public_root',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live HCBS page states the section provides community-based options to Wyoming citizens who are aging or have disabilities and publicly defines the Developmental Disability Waivers.',
          },
          {
            sample_name: 'HCBS section administrator and DD county specialists',
            source_url: 'https://health.wyo.gov/healthcarefin/hcbs/contacts-and-important-links/',
            final_url: 'https://health.wyo.gov/healthcarefin/hcbs/contacts-and-important-links/',
            verification_status: 'official_verified',
            source_type: 'official_state_hcbs_contact_page',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official HCBS contact page names the Section Administrator and links the county-keyed DD Benefits and Eligibility Specialists assignment PDF on the same official WDH host.',
          },
        ],
      };
    }
    return row;
  });

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  const lessonAdded = appendLessonIfMissing();

  const batchSummary = {
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    county_local_family_cleared: true,
    district_family_still_blocked: true,
    hcbs_bes_pdf_live: true,
    county_local_counties_covered: 23,
    dd_waiver_public_lane_live: true,
    stale_dhhs_dd_host_replaced: true,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport());

  return batchSummary;
}

if (process.argv[1] === __filename) {
  generateBatch393WyomingHcbsCountyClearV1();
}
