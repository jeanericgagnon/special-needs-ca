import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'vermont_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'vermont_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'vermont_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'vermont_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'vermont_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch377_vermont_accessible_official_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch377-vermont-accessible-official-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'vermont-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON =
  'official_vermont_vr_and_pre_ets_host_family_returns_403_without_reviewable_public_alternate';
const VR_FAMILY_STATUS =
  'blocked_official_vr_hosts_return_403_without_reviewed_public_alternate';
const VR_FAILURE_CODE =
  'official_vr_and_pre_ets_hosts_return_403_without_reviewed_public_alternate';
const VR_NEXT_ACTION =
  'browser_review_or_author_reviewed_alternate_official_vermont_vr_and_pre_ets_source';

const MEDICAID_REASON =
  'Reviewed 2026-06-25 the accessible official Vermont Department of Health `Find Health Insurance` page. The page says health insurance is the first step to accessing health care and screenings for children and youth, explicitly lists `Dr. Dynasaur- Medicaid`, and describes it as low-cost or free health insurance for children, teenagers under age 19, and pregnant people. The same page also links Department of Vermont Health Access Medicaid information for children and adults, including people who are blind or disabled.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 the accessible official Vermont Department of Health local-health network. `Find Your Local Health Office` publishes a statewide town selector, links each local office, and includes a map whose alt text says it outlines the towns and counties served by Health Districts. The local office pages then preserve explicit service-area contracts such as `The Barre Local Health Office serves all of Washington County and five towns in Orange County`, `Serving East Central Vermont (Northern Windsor and Southern Orange Counties)`, and `We work with partners in Franklin and Grand Isle Counties to prevent disease.` The same official local `Family and Child Health` leaves connect those local offices to disability-adjacent routing: Bennington says the local office refers children with development concerns to the `Children Integrated (CIS) Team` and links `Children with Special Health Needs`, Morrisville links `Children with Special Health Needs`, `Help Me Grow`, and `Children\'s Integrated Services - Lamoille Family Center`, and White River Junction lists `Children’s Integrated Services` plus county-local parent-child and rehabilitation partners. This is now sufficient official county-grade local disability-family routing.';

const VR_REASON =
  'Reviewed 2026-06-25 bounded official Vermont vocational-rehabilitation probes on `https://vocrehab.vermont.gov/`, `https://vocrehab.vermont.gov/students`, `https://vocrehab.vermont.gov/pre-employment-transition-services`, `https://dbvi.vermont.gov/`, and `https://dbvi.vermont.gov/pre-employment-transition-services`. Each returned an HTTP 403 CloudFront/Volt ADC error shell in the current pass, and no reviewed alternate public official Vermont VR or Pre-ETS page is preserved on disk. Vermont therefore remains blocked on the official VR / Pre-ETS family even though county-local routing is now repaired.';

const LESSON_HEADING =
  '### Local Health District Finders Can Clear County-Grade Disability Routing When The Child-Service Leaves Stay On The Same Official Host';
const LESSON_BODY =
  '*   **Lesson:** If a state\'s benefits or human-services office directory is blocked, do not stop before checking accessible sibling official public-health office networks. Vermont\'s AHS and DCF office lanes still returned 403, but the official Health Department host published a town-complete local-office finder, county-served language on local office pages, and same-host Family and Child Health leaves that explicitly linked Children with Special Health Needs, Help Me Grow, and Children\'s Integrated Services. That combined same-host chain was strong enough to clear county-grade local disability routing.';

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
  if (current.includes(LESSON_HEADING)) {
    return false;
  }
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Vermont California-Grade Audit Report v2',
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
    '## Refresh decision',
    '',
    '- Vermont remains `BLOCKED` and `index_safe=false`.',
    '- `county_local_disability_resources` now clears because the official Vermont Department of Health local-office finder publishes statewide town coverage, county-served local office contracts, and same-host Family and Child Health leaves that link Children with Special Health Needs, Help Me Grow, and Children’s Integrated Services.',
    '- `medicaid_state_health_coverage` is now anchored to the accessible official Vermont Department of Health insurance page instead of the mixed generic packet samples.',
    '- The active blocker moves to `vocational_rehabilitation_pre_ets`: the current official Vermont VR and DBVI host family returned only 403 shells in bounded review, and no alternate reviewed public official Vermont VR / Pre-ETS source is preserved on disk.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 377 Vermont Accessible Official Refresh v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: cleared Vermont county-local disability routing through the Health Department local-office network and moved the active blocker to the official VR / Pre-ETS host family',
    '',
    '## Evidence',
    '',
    `- ${MEDICAID_REASON}`,
    `- ${COUNTY_REASON}`,
    `- ${VR_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch377VermontAccessibleOfficialRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'medicaid_state_health_coverage') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: MEDICAID_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        status_reason: COUNTY_REASON,
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: VR_FAMILY_STATUS,
        status_reason: VR_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = [
    {
      state: 'vermont',
      state_code: 'VT',
      family: 'vocational_rehabilitation_pre_ets',
      severity: 'critical',
      failure_code: VR_FAILURE_CODE,
      evidence: VR_REASON,
      next_action: VR_NEXT_ACTION,
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'medicaid_state_health_coverage') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed 2026-06-25 the accessible official Vermont Department of Health child and youth insurance page.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Vermont Department of Health Find Health Insurance page',
            source_url: 'https://www.healthvermont.gov/family/health-care-children-youth/find-health-insurance',
            final_url: 'https://www.healthvermont.gov/family/health-care-children-youth/find-health-insurance',
            verification_status: 'official_verified',
            source_type: 'official_child_health_insurance_page',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official page says health insurance is the first step to accessing health care and screenings for children and youth and lists Dr. Dynasaur- Medicaid.',
          },
          {
            sample_name: 'Dr. Dynasaur and adult Medicaid routing',
            source_url: 'https://www.healthvermont.gov/family/health-care-children-youth/find-health-insurance',
            final_url: 'https://www.healthvermont.gov/family/health-care-children-youth/find-health-insurance',
            verification_status: 'official_verified',
            source_type: 'official_medicaid_program_snippet',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same official page describes Dr. Dynasaur as low-cost or free health insurance for children and pregnant people and links Medicaid information for people who are blind or disabled.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        evidence_strength: 'strong',
        sample_count: 6,
        query_basis: 'Reviewed 2026-06-25 the accessible official Vermont Department of Health local-office finder, county-served office pages, and same-host Family and Child Health leaves.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Find Your Local Health Office',
            source_url: 'https://www.healthvermont.gov/find-your-local-health-office',
            final_url: 'https://www.healthvermont.gov/find-your-local-health-office',
            verification_status: 'official_verified',
            source_type: 'official_statewide_local_office_finder',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official finder publishes a statewide town selector and a map outlining the towns and counties served by Health Districts.',
          },
          {
            sample_name: 'Barre Local Health Office service area',
            source_url: 'https://www.healthvermont.gov/local/barre',
            final_url: 'https://www.healthvermont.gov/local/barre',
            verification_status: 'official_verified',
            source_type: 'official_county_service_area_page',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Barre Local Health Office serves all of Washington County and five towns in Orange County.',
          },
          {
            sample_name: 'White River Junction Local Health Office service area',
            source_url: 'https://www.healthvermont.gov/local/white-river-junction',
            final_url: 'https://www.healthvermont.gov/local/white-river-junction',
            verification_status: 'official_verified',
            source_type: 'official_county_service_area_page',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The White River Junction office says it is serving East Central Vermont, including Northern Windsor and Southern Orange Counties.',
          },
          {
            sample_name: 'St. Albans county coverage',
            source_url: 'https://www.healthvermont.gov/local/st-albans',
            final_url: 'https://www.healthvermont.gov/local/st-albans',
            verification_status: 'official_verified',
            source_type: 'official_county_service_area_page',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The St. Albans office says it works with partners in Franklin and Grand Isle Counties to prevent disease.',
          },
          {
            sample_name: 'Bennington Family and Child Health',
            source_url: 'https://www.healthvermont.gov/local/bennington/family-and-child-health',
            final_url: 'https://www.healthvermont.gov/local/bennington/family-and-child-health',
            verification_status: 'official_verified',
            source_type: 'official_local_family_child_health_page',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Bennington local Family and Child Health page refers children with development concerns to the Children Integrated (CIS) Team and links Children with Special Health Needs.',
          },
          {
            sample_name: 'Morrisville Family and Child Health',
            source_url: 'https://www.healthvermont.gov/local/morrisville/family-and-child-health',
            final_url: 'https://www.healthvermont.gov/local/morrisville/family-and-child-health',
            verification_status: 'official_verified',
            source_type: 'official_local_family_child_health_page',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Morrisville local Family and Child Health page links Children with Special Health Needs, Help Me Grow, and Children\'s Integrated Services - Lamoille Family Center.',
          },
        ],
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: VR_FAMILY_STATUS,
        evidence_strength: 'strong_but_blocked',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 bounded official Vermont VR and DBVI host-family probes.',
        blocker_code: VR_FAILURE_CODE,
        blocker_evidence: VR_REASON,
        samples: [
          {
            sample_name: 'VocRehab Vermont root returns 403',
            source_url: 'https://vocrehab.vermont.gov/',
            final_url: 'https://vocrehab.vermont.gov/',
            verification_status: 'official_verified',
            source_type: 'official_host_status_check',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The bounded probe to vocrehab.vermont.gov returned an HTTP 403 CloudFront/Volt ADC error shell.',
          },
          {
            sample_name: 'VocRehab Vermont students route returns 403',
            source_url: 'https://vocrehab.vermont.gov/students',
            final_url: 'https://vocrehab.vermont.gov/students',
            verification_status: 'official_verified',
            source_type: 'official_host_status_check',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The bounded probe to the Vermont students route also returned an HTTP 403 error shell instead of a public student-services page.',
          },
          {
            sample_name: 'DBVI Pre-Employment Transition Services route returns 403',
            source_url: 'https://dbvi.vermont.gov/pre-employment-transition-services',
            final_url: 'https://dbvi.vermont.gov/pre-employment-transition-services',
            verification_status: 'official_verified',
            source_type: 'official_host_status_check',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The bounded DBVI pre-employment-transition-services route likewise returned an HTTP 403 error shell in the current pass.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = [
    {
      state: 'vermont',
      state_code: 'VT',
      priority_rank: 1,
      family: 'vocational_rehabilitation_pre_ets',
      severity: 'critical',
      failure_code: VR_FAILURE_CODE,
      next_action: VR_NEXT_ACTION,
      evidence: VR_REASON,
    },
  ];

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_reviewed_official_vermont_vr_or_pre_ets_alternate',
    critical_gap_families: ['vocational_rehabilitation_pre_ets'],
    major_gap_families: [],
    verified_source_families_with_samples: updatedVerifiedRows
      .filter((row) => row.sample_count > 0)
      .map((row) => row.family),
    complete_ready: false,
    final_blockers: updatedFailureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
    familyStatuses: {
      ...summary.familyStatuses,
      medicaid_state_health_coverage: 'verified_state_grade',
      county_local_disability_resources: 'verified_county_grade',
      vocational_rehabilitation_pre_ets: VR_FAMILY_STATUS,
    },
  };

  appendLessonIfMissing(INPUTS.lessons);

  const stateReport = buildStateReport(
    updatedSummary,
    updatedGapRows,
    updatedFailureRows,
    updatedVerifiedRows,
    updatedNextRows
  );
  const batchSummary = {
    state: 'Vermont',
    state_code: 'VT',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    repaired_families: ['medicaid_state_health_coverage', 'county_local_disability_resources'],
    sharpened_families: ['vocational_rehabilitation_pre_ets'],
    remaining_blocker_family: 'vocational_rehabilitation_pre_ets',
    remaining_blocker_code: VR_FAILURE_CODE,
  };
  const batchReport = buildBatchReport();

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch377VermontAccessibleOfficialRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
