import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'washington_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'washington_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'washington_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'washington_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'washington_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch378_washington_ddcs_dvr_completion_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch378-washington-ddcs-dvr-completion-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'washington-california-grade-audit-report-v2.md'),
};

const BATCH_NAME = 'batch378_washington_ddcs_dvr_completion_v1';
const PRIMARY_GAP_REASON = 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence';

const DD_REASON =
  'Reviewed 2026-06-25 the official DSHS Developmental Disabilities Administration `Find a DDCS Office` page and its linked DDCS county map PDF. The DSHS page sits under DDA, publishes a `DDCS Office Locator`, and links a one-page `DEVELOPMENTAL DISABILITIES COMMUNITY SERVICES CONTACTS` PDF that visibly assigns every Washington county to DDCS Region 1, Region 2, or Region 3 while listing regional administrator contacts. This supplies current official DDA/DDCS authority and statewide regional routing on the DSHS host.';

const EARLY_REASON =
  'Reviewed 2026-06-25 the official Washington DCYF Early Support for Infants and Toddlers (ESIT) page. The page states that ESIT gives early help to children from birth to age 3 who have developmental delays or disabilities and identifies IDEA Part C as the federal program funding and guiding ESIT\'s statewide system. The same official page also links an `ESIT Statewide Directory` for families who need services or support in their local area. This supplies current official Part C authority plus state-to-local routing evidence.';

const VR_REASON =
  'Reviewed 2026-06-25 the official DSHS DVR `Pre-Employment Transition Services (Pre-ETS)` page, the `Student and Youth VR Transition Services` page, and the filtered DSHS office locator for `Vocational rehabilitation services`. The Transition Services page tells families to connect with a `Regional Transition Consultant` or `DVR School Transition Counselor` in their area and says they can start by contacting their local DVR office. The official office locator simultaneously preserves public DVR office leaves across Washington, including Aberdeen, Bellevue, Bellingham, Spokane, Tacoma, Vancouver, Wenatchee, Yakima, and many more. This replaces Washington\'s stale DDA-backed VR row with current official DVR and Pre-ETS routing evidence.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 the official DSHS DDA `Find a DDCS Office` page and its linked DDCS county map PDF. The page publicly links a `DDCS Office Locator` and a one-page `DEVELOPMENTAL DISABILITIES COMMUNITY SERVICES CONTACTS` PDF that visibly colors every Washington county into DDCS Region 1, Region 2, or Region 3 while listing regional administrator contacts. The reviewed routing packet also directs families seeking an application packet, an assessment for services, or more about DDCS services and resources to the official DDA service-and-information-request path. Because Washington now publishes a reviewable county-to-region DDCS routing crosswalk on the DSHS host, county/local disability resources clear without forbidden city, distance, or nearest-office inference.';

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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Washington California-Grade Audit Report v2',
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
    '## Completion decision',
    '',
    '- Washington is now `COMPLETE` and `index_safe=true`.',
    '- `county_local_disability_resources` now clears because DSHS publishes a reviewable DDCS county-to-region routing crosswalk on the `Find a DDCS Office` page and linked county map PDF.',
    '- `developmental_disability_idd_authority` is now anchored to current official DDA/DDCS evidence on the DSHS host rather than a stale placeholder URL.',
    '- `early_intervention_part_c` is now anchored to the official DCYF ESIT page and its statewide local-support directory.',
    '- `vocational_rehabilitation_pre_ets` is now anchored to current official DVR, Pre-ETS, transition-services, and local DVR office-locator evidence on the DSHS host.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 378 Washington DDCS and DVR Completion v1',
    '',
    '- classification: COMPLETE',
    '- index_safe: true',
    '- change: cleared Washington county/local disability routing with the official DDCS county-region map and strengthened DDA, ESIT, and DVR evidence to current official hosts',
    '',
    '## Evidence',
    '',
    `- ${DD_REASON}`,
    `- ${EARLY_REASON}`,
    `- ${VR_REASON}`,
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch378WashingtonDdcsDvrCompletionV1() {
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
    final_blockers: null,
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return { ...row, family_status: 'verified_state_grade', status_reason: DD_REASON };
    }
    if (row.family === 'early_intervention_part_c') {
      return { ...row, family_status: 'verified_state_grade', status_reason: EARLY_REASON };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return { ...row, family_status: 'verified_state_grade', status_reason: VR_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'verified_state_grade', status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedFailureRows = [];
  const updatedNextRows = [];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 official DSHS DDA/DDCS routing pages and the DDCS county map PDF on dshs.wa.gov.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'DSHS Find a DDCS Office page',
            source_url: 'https://www.dshs.wa.gov/dda/find-ddcs-office',
            final_url: 'https://www.dshs.wa.gov/dda/find-ddcs-office',
            verification_status: 'official_verified',
            source_type: 'official_idd_authority_page',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official page title is `Find a DDCS Office` and it sits under the Developmental Disabilities Administration on the DSHS host.',
          },
          {
            sample_name: 'DDCS office locator link',
            source_url: 'https://www.dshs.wa.gov/dda/find-ddcs-office',
            final_url: 'https://www.dshs.wa.gov/dda/find-ddcs-office',
            verification_status: 'official_verified',
            source_type: 'official_idd_routing_entrypoint',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same official page publishes a `DDCS Office Locator` entrypoint for local DDCS routing.',
          },
          {
            sample_name: 'DDCS county-region contacts PDF',
            source_url: 'https://www.dshs.wa.gov/sites/default/files/DDA/dda/documents/25-1017-DDCS-Contact-page.pdf',
            final_url: 'https://www.dshs.wa.gov/sites/default/files/DDA/dda/documents/25-1017-DDCS-Contact-page.pdf',
            verification_status: 'official_verified',
            source_type: 'official_idd_region_map',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed `DEVELOPMENTAL DISABILITIES COMMUNITY SERVICES CONTACTS` PDF assigns every Washington county to DDCS Region 1, Region 2, or Region 3 and lists regional administrator contacts.',
          },
        ],
      };
    }
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 official DCYF ESIT page and linked local-support directory on dcyf.wa.gov.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'DCYF ESIT overview',
            source_url: 'https://dcyf.wa.gov/services/child-development-supports/esit',
            final_url: 'https://dcyf.wa.gov/services/child-development-supports/esit',
            verification_status: 'official_verified',
            source_type: 'official_part_c_overview',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official page says the Early Support for Infants and Toddlers program gives early help to children from birth to age 3 who have developmental delays or disabilities.',
          },
          {
            sample_name: 'DCYF ESIT IDEA Part C statement',
            source_url: 'https://dcyf.wa.gov/services/child-development-supports/esit',
            final_url: 'https://dcyf.wa.gov/services/child-development-supports/esit',
            verification_status: 'official_verified',
            source_type: 'official_part_c_authority_statement',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same official page identifies IDEA Part C as the federal program that funds and guides ESIT\'s statewide system of services and supports.',
          },
          {
            sample_name: 'DCYF ESIT statewide directory',
            source_url: 'https://dcyf.wa.gov/services/child-development-supports/esit',
            final_url: 'https://dcyf.wa.gov/services/child-development-supports/esit',
            verification_status: 'official_verified',
            source_type: 'official_part_c_local_directory_link',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Under `I need services or support in my local area`, the official page links an `ESIT Statewide Directory` and lists ESIT program staff contact information.',
          },
        ],
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 official DSHS DVR Pre-ETS, transition-services, services overview, and local office-locator pages on dshs.wa.gov.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'DSHS DVR services overview',
            source_url: 'https://www.dshs.wa.gov/dvr/services-individuals-disabilities',
            final_url: 'https://www.dshs.wa.gov/dvr/services-individuals-disabilities',
            verification_status: 'official_verified',
            source_type: 'official_vr_program_overview',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official page says the Division of Vocational Rehabilitation provides services to individuals who want to work but need assistance due to cognitive, mental, physical, or sensory disabilities.',
          },
          {
            sample_name: 'DSHS Pre-ETS page',
            source_url: 'https://www.dshs.wa.gov/dvr/pre-employment-transition-services-pre-ets',
            final_url: 'https://www.dshs.wa.gov/dvr/pre-employment-transition-services-pre-ets',
            verification_status: 'official_verified',
            source_type: 'official_pre_ets_program_page',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official Pre-ETS page says the contract provides workplace readiness training, work-based learning, and self-advocacy for students with disabilities and preserves a `Find a DVR Office` link on the same DVR menu.',
          },
          {
            sample_name: 'DSHS student and youth transition services',
            source_url: 'https://www.dshs.wa.gov/dvr/student-and-youth-vr-transition-services',
            final_url: 'https://www.dshs.wa.gov/dvr/student-and-youth-vr-transition-services',
            verification_status: 'official_verified',
            source_type: 'official_transition_services_page',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official Transition Services page tells families to connect with a Regional Transition Consultant or DVR School Transition Counselor in their area and says they can start by contacting their local DVR office.',
          },
          {
            sample_name: 'DSHS DVR office locator',
            source_url: 'https://www.dshs.wa.gov/office-locations?field_geofield_distance%5Bdistance%5D=100&field_geofield_distance%5Bunit%5D=3959&field_geofield_distance%5Borigin%5D=&field_office_type_tid%5B%5D=9654',
            final_url: 'https://www.dshs.wa.gov/office-locations?field_geofield_distance%5Bdistance%5D=100&field_geofield_distance%5Bunit%5D=3959&field_geofield_distance%5Borigin%5D=&field_office_type_tid%5B%5D=9654',
            verification_status: 'official_verified',
            source_type: 'official_vr_office_locator',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The filtered official office locator publicly preserves DVR office leaves across Washington, including Aberdeen, Bellevue, Bellingham, Spokane, Tacoma, Vancouver, Wenatchee, and Yakima.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 official DSHS DDA county-routing pages, county map PDF, and local DDCS office leaves on dshs.wa.gov.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'DSHS Find a DDCS Office page',
            source_url: 'https://www.dshs.wa.gov/dda/find-ddcs-office',
            final_url: 'https://www.dshs.wa.gov/dda/find-ddcs-office',
            verification_status: 'official_verified',
            source_type: 'official_county_routing_page',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official DDA page publishes both a `DDCS Office Locator` and a downloadable county-routing PDF from the same Washington DSHS host.',
          },
          {
            sample_name: 'DDCS county-region contacts PDF',
            source_url: 'https://www.dshs.wa.gov/sites/default/files/DDA/dda/documents/25-1017-DDCS-Contact-page.pdf',
            final_url: 'https://www.dshs.wa.gov/sites/default/files/DDA/dda/documents/25-1017-DDCS-Contact-page.pdf',
            verification_status: 'official_verified',
            source_type: 'official_county_to_region_crosswalk',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed `DEVELOPMENTAL DISABILITIES COMMUNITY SERVICES CONTACTS` PDF visibly colors every Washington county into DDCS Region 1, Region 2, or Region 3.',
          },
          {
            sample_name: 'DDCS regional contacts and service request instruction',
            source_url: 'https://www.dshs.wa.gov/sites/default/files/DDA/dda/documents/25-1017-DDCS-Contact-page.pdf',
            final_url: 'https://www.dshs.wa.gov/sites/default/files/DDA/dda/documents/25-1017-DDCS-Contact-page.pdf',
            verification_status: 'official_verified',
            source_type: 'official_region_contact_contract',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same reviewed DDCS PDF lists regional administrator contacts for Regions 1, 2, and 3 and directs families seeking an application packet or assessment to the official DDA service-and-information-request path.',
          },
          {
            sample_name: 'Whitman County DDA field office leaf',
            source_url: 'https://www.dshs.wa.gov/location/dshs-dda-colfax-fo',
            final_url: 'https://www.dshs.wa.gov/location/dshs-dda-colfax-fo',
            verification_status: 'official_verified',
            source_type: 'official_county_office_detail_leaf',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'A county-named DSHS leaf such as `Whitman County DDA Field Office` remains publicly reviewable as a concrete local office endpoint after the county-to-region crosswalk is established.',
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

  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchReport = buildBatchReport();
  writeJson(OUTPUTS.batchSummary, {
    state: 'washington',
    classification: 'COMPLETE',
    index_safe: true,
    cleared_families: [
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'vocational_rehabilitation_pre_ets',
      'county_local_disability_resources',
    ],
    county_local_evidence: COUNTY_REASON,
  });
  fs.mkdirSync(path.dirname(OUTPUTS.stateReport), { recursive: true });
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return {
    state: 'washington',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    cleared_families: [
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'vocational_rehabilitation_pre_ets',
      'county_local_disability_resources',
    ],
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch378WashingtonDdcsDvrCompletionV1();
  console.log(JSON.stringify(result, null, 2));
}
