import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'hawaii_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'hawaii_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'hawaii_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'hawaii_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'hawaii_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch123_hawaii_official_replacement_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch123-hawaii-official-replacement-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'hawaii-california-grade-audit-report-v2.md'),
};

const EIS_ROOT = 'https://health.hawaii.gov/eis/';
const EIS_SERVICES = 'https://health.hawaii.gov/eis/home/eiservices/';
const SPECIAL_ED_OVERVIEW = 'https://hawaiipublicschools.org/school-services/what-is-special-education/';
const SPECIAL_ED_CHILD_FIND = 'https://hawaiipublicschools.org/school-services/does-my-child-have-a-disability-child-find/';
const SPECIAL_ED_DATA = 'https://hawaiipublicschools.org/school-services/special-education-data-and-reports/';
const COMPLEX_AREA_DIR = 'https://hawaiipublicschools.org/contact/complex-area-directory/';
const HDRC_ADVOCACY = 'https://hawaiidisabilityrights.org/advocacy-legal-representation-systematic-casework/';
const HDRC_ASSISTANCE = 'https://hawaiidisabilityrights.org/assistance-application-form/';
const DHS_PROCESSING_PDF = 'https://humanservices.hawaii.gov/wp-content/uploads/2018/04/Statewide-Processing-Centers-04-2018.pdf';
const LEGACY_KALAWAO = 'https://dhhs.hawaii.gov/locations';

const COUNTY_BLOCKER_CODE = 'official_processing_centers_pdf_covers_four_counties_but_kalawao_unresolved';
const COUNTY_BLOCKER_EVIDENCE = 'Reviewed 2026-06-22 official Hawaii DHS local-office replacements. The official DHS State of Hawaii Processing Centers PDF at https://humanservices.hawaii.gov/wp-content/uploads/2018/04/Statewide-Processing-Centers-04-2018.pdf preserves named local processing centers with addresses and phones for Honolulu County (Kapolei, Koolau, KPT, OR&L, Pohulani, Wahiawa, Waianae, Waipahu), Kauai County (Lihue), Maui County (Maui Public Assistance, Molokai Unit, Lanai Sub-Unit), and Hawaii County (North Hilo, South Hilo, North Kona, South Kona, Kaʻu, Kamuela-Hamakua, Kohala). The only remaining Hawaii county-local gap is Kalawao County: its current row still depends on the dead legacy root https://dhhs.hawaii.gov/locations, and this bounded pass did not recover a reviewed official local-office leaf that explicitly names Kalawao County.';
const EIS_REASON = 'Reviewed live official Hawaii Early Intervention Section root and services leaf now replace the fake dhhs.hawaii.gov/earlystart sample and preserve Part C authority plus referral routing.';
const SPECIAL_ED_REASON = 'Reviewed current HIDOE What is Special Education, Child Find, and Special Education Data and Reports pages now preserve statewide special-education authority on an accessible official host.';
const DISTRICT_REASON = 'Reviewed current official HIDOE Complex Area Directory now preserves district and complex-area routing from an accessible first-party page instead of the old statewide root only.';
const LEGAL_AID_REASON = 'Reviewed first-party HDRC Advocacy and Assistance Application pages now preserve explicit legal representation, staff-attorney, grievance/appeals, and assistance-routing evidence for statewide legal-aid coverage.';
const COUNTY_REASON = 'Official Hawaii DHS processing-centers PDF now replaces the DOI fallback for Honolulu, Hawaii, Kauai, and Maui counties, but Kalawao County still lacks explicit reviewed county-grade local-office proof and still points to a dead legacy locator root.';
const LESSON_HEADING = '### Official Site Search And Current WordPress Leaves Can Replace Dead Legacy Paths Without Broad Rediscovery';
const LESSON_BODY = '*   **Lesson:** When an old state-host path 403s or dies, try the current official site search and live navigation before reopening broad discovery. Hawaii’s old public-schools `Pages/default.aspx` paths were unusable, but the current official search exposed live `what-is-special-education`, `child-find`, and `complex-area-directory` leaves that cleared multiple blockers in one bounded pass.';

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

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Hawaii California-Grade Audit Report v2',
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
    '- Hawaii no longer depends on the fake dhhs early-intervention path; the live official EIS site now preserves statewide Part C authority and referral routing.',
    '- HIDOE special-education authority and district routing now come from accessible current official pages: What is Special Education, Child Find, Special Education Data and Reports, and the Complex Area Directory.',
    '- HDRC now truthfully satisfies statewide legal-aid coverage because its first-party Advocacy and Assistance Application pages explicitly preserve legal representation, staff-attorney, grievance/appeals, and assistance-routing evidence.',
    '- County/local disability resources improved materially: the official DHS processing-centers PDF now covers Honolulu, Hawaii, Kauai, and Maui counties with named local offices, but Kalawao County still lacks explicit reviewed county-grade office proof and still depends on a dead legacy locator root.',
    '- Hawaii therefore remains BLOCKED and not index-safe until Kalawao County has explicit reviewed official local-office coverage or a reviewed official exception path.',
  ].join('\n') + '\n';
}

export function generateBatch123HawaiiOfficialReplacementRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'early_intervention_part_c') {
      return { ...row, family_status: 'verified_state_grade', status_reason: EIS_REASON };
    }
    if (row.family === 'special_education_idea_part_b') {
      return { ...row, family_status: 'verified_state_grade', status_reason: SPECIAL_ED_REASON };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'verified_state_grade', status_reason: DISTRICT_REASON };
    }
    if (row.family === 'legal_aid') {
      return { ...row, family_status: 'verified_state_grade', status_reason: LEGAL_AID_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'blocked_official_pdf_covers_four_counties_kalawao_unresolved', status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedFailureRows = [
    {
      state: 'hawaii',
      state_code: 'HI',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: COUNTY_BLOCKER_CODE,
      evidence: COUNTY_BLOCKER_EVIDENCE,
      next_action: 'hold_blocked_until_kalawao_county_has_reviewed_official_local_office_or_exception_path',
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed live official Hawaii Early Intervention Section root and services leaf on the current health.hawaii.gov host.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Early Intervention Section',
            source_url: EIS_ROOT,
            final_url: EIS_ROOT,
            verification_status: 'verified',
            source_type: 'official_live_probe',
            source_table: 'batch123_hawaii_official_replacement_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Early Intervention Section - State of Hawaii, Department of Health. The Department of Health is the lead agency for the implementation of Part C, Individuals with Disabilities Education Act (IDEA) for the State of Hawaii.',
          },
          {
            sample_name: 'Early Intervention Services',
            source_url: EIS_SERVICES,
            final_url: EIS_SERVICES,
            verification_status: 'verified',
            source_type: 'official_live_probe',
            source_table: 'batch123_hawaii_official_replacement_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'If you are concerned about a child’s development or would like to make a referral, please call our Early Intervention information and referral line at 808-594-0066 for Oahu or 1-800-235-5477 for Neighbor Islands.',
          },
        ],
      };
    }
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'What is Special Education',
            source_url: SPECIAL_ED_OVERVIEW,
            final_url: SPECIAL_ED_OVERVIEW,
            verification_status: 'verified',
            source_type: 'official_live_probe',
            source_table: 'batch123_hawaii_official_replacement_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'What is Special Education. The official HIDOE page preserves overview, evaluation and eligibility, and individualized education program sections.',
          },
          {
            sample_name: 'Does my child need Special Education services?',
            source_url: SPECIAL_ED_CHILD_FIND,
            final_url: SPECIAL_ED_CHILD_FIND,
            verification_status: 'verified',
            source_type: 'official_live_probe',
            source_table: 'batch123_hawaii_official_replacement_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Child Find is a statewide effort to identify, locate and evaluate children and youth who may have a disability and need special education and related services.',
          },
          {
            sample_name: 'Special Education Data and Reports',
            source_url: SPECIAL_ED_DATA,
            final_url: SPECIAL_ED_DATA,
            verification_status: 'verified',
            source_type: 'official_live_probe',
            source_table: 'batch123_hawaii_official_replacement_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Special Education Data and Reports. The official HIDOE page preserves statewide IDEA Section 618 and performance-report authority on the current host.',
          },
        ],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed current official HIDOE district-routing pages on the accessible WordPress host.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Complex Area Directory',
            source_url: COMPLEX_AREA_DIR,
            final_url: COMPLEX_AREA_DIR,
            verification_status: 'verified',
            source_type: 'official_district_directory',
            source_table: 'batch123_hawaii_official_replacement_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Complex Area Directory. The official HIDOE page lists Honolulu, Central, Leeward, Windward, Hawaiʻi, Maui, and Kauaʻi districts plus named complex areas and their superintendents/support staff.',
          },
          {
            sample_name: 'HIDOE Contact',
            source_url: 'https://hawaiipublicschools.org/contact/',
            final_url: 'https://hawaiipublicschools.org/contact/',
            verification_status: 'verified',
            source_type: 'official_contact_navigation',
            source_table: 'batch123_hawaii_official_replacement_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The official HIDOE contact page links the current Complex Area Directory and common phone-number resources on the accessible official host.',
          },
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 2,
        samples: [
          {
            sample_name: 'Advocacy, Legal Representation & Systematic Casework',
            source_url: HDRC_ADVOCACY,
            final_url: HDRC_ADVOCACY,
            verification_status: 'verified',
            source_type: 'first_party_legal_aid',
            source_table: 'batch123_hawaii_official_replacement_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Advocacy, Legal Representation & Systematic Casework. HDRC staff attorneys can provide legal representation for clients in court processes concerned with rights, grievances, or appeals.',
          },
          {
            sample_name: 'Assistance Application Form',
            source_url: HDRC_ASSISTANCE,
            final_url: HDRC_ASSISTANCE,
            verification_status: 'verified',
            source_type: 'first_party_legal_aid',
            source_table: 'batch123_hawaii_official_replacement_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The assistance application form says information on the website should not be used as a substitute for legal advice from a licensed professional attorney and preserves statewide apply-for-assistance routing.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_official_pdf_covers_four_counties_kalawao_unresolved',
        evidence_strength: 'medium',
        blocker_code: COUNTY_BLOCKER_CODE,
        blocker_evidence: COUNTY_BLOCKER_EVIDENCE,
        sample_count: 2,
        samples: [
          {
            sample_name: 'State of Hawaii Processing Centers PDF',
            source_url: DHS_PROCESSING_PDF,
            final_url: DHS_PROCESSING_PDF,
            verification_status: 'verified',
            source_type: 'official_pdf_local_directory',
            source_table: 'batch123_hawaii_official_replacement_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The official DHS PDF preserves local processing-center addresses and phones for Oahu, Kauai, Maui County, and Hawaii Island units including Kapolei, Kaneohe, Lihue, Wailuku, Molokai, Lanai, Hilo, Kona, Captain Cook, Naalehu, Honokaa, and Kapaau.',
          },
          {
            sample_name: 'Kalawao legacy locator row',
            source_url: LEGACY_KALAWAO,
            verification_status: 'blocked',
            source_type: 'dead_legacy_locator',
            source_table: 'county_offices',
            evidence_snippet: 'Kalawao County still depends on the dead legacy dhhs.hawaii.gov/locations root and no explicit reviewed official local-office replacement for Kalawao County was recovered in this bounded pass.',
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
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: COUNTY_BLOCKER_CODE,
    critical_gap_families: ['county_local_disability_resources'],
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

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'hawaii'
      ? {
          ...row,
          completeness_pct: 91,
          weak_critical_families: 1,
          missing_critical_families: 0,
          primary_gap_reason: COUNTY_BLOCKER_CODE,
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    state: 'hawaii',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    repaired_families: [
      'early_intervention_part_c',
      'special_education_idea_part_b',
      'district_or_county_education_routing',
      'legal_aid',
    ],
    remaining_blockers: ['county_local_disability_resources'],
    localOfficeCoverage: {
      countiesCoveredByOfficialPdf: ['honolulu-hi', 'kauai-hi', 'maui-hi', 'hawai-i-hi'],
      unresolvedCounty: 'kalawao-hi',
    },
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 123 Hawaii Official Replacement Repair Report v1',
      '',
      'This pass replaces fake, blocked, or stale Hawaii statewide sources with current official or first-party leaves and narrows the remaining blocker to Kalawao county-local coverage.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      `- repaired_families: ${batchSummary.repaired_families.join(', ')}`,
      `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch123HawaiiOfficialReplacementRepairV1();
  console.log(JSON.stringify(summary, null, 2));
}
