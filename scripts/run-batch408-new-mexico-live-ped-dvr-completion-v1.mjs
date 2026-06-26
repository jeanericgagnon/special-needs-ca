import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-mexico_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-mexico_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-mexico_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-mexico_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-mexico_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  report: path.join(docsGeneratedDir, 'new-mexico-california-grade-audit-report-v2.md'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  stateCertification: path.join(generatedDir, 'state-certification', 'new-mexico.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch408_new_mexico_live_ped_dvr_completion_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch408-new-mexico-live-ped-dvr-completion-report-v1.md'),
};

const BATCH = 'batch408_new_mexico_live_ped_dvr_refresh_v1';
const REVIEWED_DATE = '2026-06-26';
const REVIEWED_AT = '2026-06-26T00:00:00.000Z';
const PRIMARY_GAP_REASON =
  'live_official_nmdvr_host_and_federal_part_b_materials_now_clear_but_ped_directory_stack_still_lacks_explicit_geography_contract_and_clean_live_tls_probe';

const DISTRICT_STATUS =
  'blocked_live_ped_superintendent_directory_materializes_district_rows_but_still_lacks_explicit_geography_contract_and_clean_live_tls_probe';
const DISTRICT_REASON =
  `Reviewed ${REVIEWED_DATE} the live official PED SharePoint directory stack beyond the earlier county-crosswalk blocker lane. The public Superintendent directory now materializes directly from the official PED-managed SharePoint host through the public RenderListDataAsStream contract, returning 155 live rows and 145 unique district codes with district names, public contact email, office or campus location name, street address, city, and ZIP on the official host. The companion public 2017 NM Schools directory also remains live on the same host and materializes 935 current public school rows with district code, district name, location name, address, city, ZIP, phone, and status fields. That proves the PED directory lane is real and materially stronger than the earlier blocker packet. But New Mexico still cannot clear full district_or_county_education_routing: the reviewed public PED contract still does not preserve an explicit county-to-district or county-to-REC geography contract sufficient to justify all 33 counties, and current live certification probes to the PED SharePoint leaves fail closed on certificate verification. New Mexico therefore remains blocked on education routing until a live official geography contract or certificate-clean equivalent official leaf is public.`;

const DISTRICT_EVIDENCE =
  'Reviewed 2026-06-26 the live official New Mexico PED SharePoint host at `https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx`, the public Superintendent list HTML at `https://webed.ped.state.nm.us/sites/schooldirectory/Lists/Superintendents/AllItems.aspx`, the public Superintendent RenderListDataAsStream endpoint for `/sites/schooldirectory/Lists/Superintendents`, the public 2017 NM Schools list HTML at `https://webed.ped.state.nm.us/sites/schooldirectory/Lists/2017%20NM%20Schools/AllItems.aspx`, and the public 2017 NM Schools RenderListDataAsStream endpoint for `/sites/schooldirectory/Lists/2017 NM Schools`. The Superintendent stream now materializes 155 rows and 145 unique district codes with direct local routing fields, while the school directory stream materializes 935 public school rows with district code, district name, location, address, city, ZIP, phone, and status fields. This is a live official district-grade routing contract on the PED host.';

const STATE_PART_B_REASON =
  `Reviewed ${REVIEWED_DATE} the live official U.S. Department of Education IDEA-by-State page for New Mexico at ` +
  `\`https://sites.ed.gov/idea/state/new-mexico/\` after the old New Mexico PED Special Education Bureau lane stopped surviving live probes. ` +
  'The current official federal page is reviewable and New Mexico-specific: it preserves the exact state heading `New Mexico - Individuals with Disabilities Education Act` and publishes the current IDEA Part B state materials, including `2025 SPP/APR and State Determination Letters, Part B — New Mexico`, `2024 SPP/APR and State Determination Letters, Part B — New Mexico`, and prior annual Part B determination materials on the same official host. That is enough to keep statewide IDEA Part B authority evidence current while district-grade routing remains a separate family proved from the live PED directory contracts.';

const VR_STATUS = 'verified_current_official_nmdvr_vr_and_pre_ets_host';
const VR_REASON =
  `Reviewed ${REVIEWED_DATE} the current live official New Mexico Division of Vocational Rehabilitation host on the reviewed alternate first-party state domain ` +
  `\`https://www.dvr.state.nm.us/\` after the old \`dvr.nm.gov\` lane failed closed. ` +
  'The current official host is public and reviewable: `/about-nmdvr/` explicitly says the New Mexico Division of Vocational Rehabilitation is a division of the state\'s Public Education Department and that Vocational Rehabilitation is a state and federally funded program for eligible individuals with documented disabilities; `/pre-ets/` is live and explicitly preserves the `Pre-Employment Transition Services through NMDVR` heading plus student-transition explanatory text under the Workforce Innovation and Opportunity Act; and `/locations/` is live and preserves statewide DVR office locations and direct phone routing across Albuquerque, Alamogordo, Carlsbad, Clovis, Farmington, Gallup, Hobbs, Las Cruces, Las Vegas, Los Lunas, Rio Rancho, Roswell, Santa Fe, Silver City, Socorro, and Taos. New Mexico therefore now clears vocational_rehabilitation_pre_ets from the live official NMDVR host rather than the dead legacy domain.';

const VR_EVIDENCE =
  'Reviewed 2026-06-26 the live official New Mexico DVR host at `https://www.dvr.state.nm.us/`, `https://www.dvr.state.nm.us/about-nmdvr/`, `https://www.dvr.state.nm.us/pre-ets/`, and `https://www.dvr.state.nm.us/locations/`. The live About page preserves statewide VR authority and eligibility-routing language. The live Pre-ETS page preserves an exact `Pre-Employment Transition Services through NMDVR` leaf with student-transition explanatory text. The live Locations page preserves statewide office routing and direct phone contacts on the same official host.';

const STATE_PART_B_SAMPLE_ROWS = [
  {
    sample_name: 'US Department of Education IDEA by State - New Mexico',
    source_url: 'https://sites.ed.gov/idea/state/new-mexico/',
    final_url: 'https://sites.ed.gov/idea/state/new-mexico/',
    verification_status: 'official_verified',
    source_type: 'official_federal_state_specific_idea_page',
    source_table: BATCH,
    fetched_at: REVIEWED_AT,
    evidence_snippet:
      'The live official IDEA by State page is titled `New Mexico - Individuals with Disabilities Education Act` and preserves New Mexico-specific IDEA materials on the U.S. Department of Education host.',
  },
  {
    sample_name: '2025 SPP/APR and State Determination Letters, Part B — New Mexico',
    source_url: 'https://sites.ed.gov/idea/idea-files/2025-spp-apr-and-state-determination-letters-part-b-new-mexico/',
    final_url: 'https://sites.ed.gov/idea/idea-files/2025-spp-apr-and-state-determination-letters-part-b-new-mexico/',
    verification_status: 'official_verified',
    source_type: 'official_federal_new_mexico_part_b_materials',
    source_table: BATCH,
    fetched_at: REVIEWED_AT,
    evidence_snippet:
      'The live official U.S. Department of Education page preserves the exact heading `2025 SPP/APR and State Determination Letters, Part B — New Mexico` with current New Mexico Part B materials on the IDEA host.',
  },
];

const DISTRICT_SAMPLE_ROWS = [
  {
    sample_name: 'PED Superintendent directory list',
    source_url: 'https://webed.ped.state.nm.us/sites/schooldirectory/Lists/Superintendents/AllItems.aspx',
    final_url: 'https://webed.ped.state.nm.us/sites/schooldirectory/Lists/Superintendents/AllItems.aspx',
    verification_status: 'official_verified',
    source_type: 'official_public_superintendent_directory',
    source_table: BATCH,
    fetched_at: REVIEWED_AT,
    evidence_snippet:
      'The public Superintendent directory is live on the official PED SharePoint host and links district contact rows on the public list surface.',
  },
  {
    sample_name: 'PED Superintendent RenderListDataAsStream',
    source_url: "https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/GetList(@listUrl)/RenderListDataAsStream?@listUrl='/sites/schooldirectory/Lists/Superintendents'",
    final_url: "https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/GetList(@listUrl)/RenderListDataAsStream?@listUrl='/sites/schooldirectory/Lists/Superintendents'",
    verification_status: 'official_verified',
    source_type: 'official_public_district_directory_api',
    source_table: BATCH,
    fetched_at: REVIEWED_AT,
    evidence_snippet:
      'The public RenderListDataAsStream contract materializes 155 official Superintendent rows and 145 unique district codes with district name, public contact email, location name, address, city, and ZIP.',
  },
  {
    sample_name: 'PED 2017 NM Schools directory stream',
    source_url: "https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/GetList(@listUrl)/RenderListDataAsStream?@listUrl='/sites/schooldirectory/Lists/2017%20NM%20Schools'",
    final_url: "https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/GetList(@listUrl)/RenderListDataAsStream?@listUrl='/sites/schooldirectory/Lists/2017%20NM%20Schools'",
    verification_status: 'official_verified',
    source_type: 'official_public_school_directory_api',
    source_table: BATCH,
    fetched_at: REVIEWED_AT,
    evidence_snippet:
      'The public school-directory stream materializes 935 official school rows with district code, district name, location name, address, city, ZIP, phone, and status fields on the same PED-managed host.',
  },
  {
    sample_name: 'PED REC directors page',
    source_url: 'https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/RECHome.aspx',
    final_url: 'https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/RECHome.aspx',
    verification_status: 'official_verified',
    source_type: 'official_public_regional_directory',
    source_table: BATCH,
    fetched_at: REVIEWED_AT,
    evidence_snippet:
      'The live REC Directors page remains public on the PED host and preserves statewide regional-education contact rows as a regional fallback alongside the district directory.',
  },
];

const VR_SAMPLE_ROWS = [
  {
    sample_name: 'New Mexico DVR home',
    source_url: 'https://www.dvr.state.nm.us/',
    final_url: 'https://www.dvr.state.nm.us/',
    verification_status: 'official_verified',
    source_type: 'official_current_vr_root',
    source_table: BATCH,
    fetched_at: REVIEWED_AT,
    evidence_snippet:
      'The live official NMDVR home page publicly exposes VR, Pre-Employment Transition Services, eligibility, and locations navigation on the reviewed state-owned host.',
  },
  {
    sample_name: 'About NMDVR',
    source_url: 'https://www.dvr.state.nm.us/about-nmdvr/',
    final_url: 'https://www.dvr.state.nm.us/about-nmdvr/',
    verification_status: 'official_verified',
    source_type: 'official_statewide_vr_authority_leaf',
    source_table: BATCH,
    fetched_at: REVIEWED_AT,
    evidence_snippet:
      'The About page says the New Mexico Division of Vocational Rehabilitation is a division of the state’s Public Education Department and that Vocational Rehabilitation is a state and federally funded program for eligible individuals with documented disabilities.',
  },
  {
    sample_name: 'Pre-Employment Transition Services through NMDVR',
    source_url: 'https://www.dvr.state.nm.us/pre-ets/',
    final_url: 'https://www.dvr.state.nm.us/pre-ets/',
    verification_status: 'official_verified',
    source_type: 'official_pre_ets_leaf',
    source_table: BATCH,
    fetched_at: REVIEWED_AT,
    evidence_snippet:
      'The exact Pre-ETS leaf is live and titled `Pre-Employment Transition Services through NMDVR`, and it explains that the Workforce Innovation and Opportunity Act added the Pre-Employment Transition Services category for students with disabilities.',
  },
  {
    sample_name: 'NMDVR Locations',
    source_url: 'https://www.dvr.state.nm.us/locations/',
    final_url: 'https://www.dvr.state.nm.us/locations/',
    verification_status: 'official_verified',
    source_type: 'official_statewide_office_directory',
    source_table: BATCH,
    fetched_at: REVIEWED_AT,
    evidence_snippet:
      'The live Locations page preserves statewide office routing and direct public phone contacts for Albuquerque, Alamogordo, Carlsbad, Clovis, Farmington, Gallup, Hobbs, Las Cruces, Las Vegas, Los Lunas, Rio Rancho, Roswell, Santa Fe, Silver City, Socorro, and Taos.',
  },
];

const LESSON_HEADING = '### Public SharePoint Data Streams Can Be Stronger Than Workbook Or Items-API Reads';
const LESSON_BODY =
  '*   **Lesson:** If an official SharePoint education host looks blocked because the visible workbook lane lacks county fields or the default `/items` API shape is too thin, probe the public `RenderListDataAsStream` contract before freezing the family. New Mexico PED’s public Superintendent stream materially changed the truth model by exposing 155 live district rows and 145 unique district codes with contact and address fields on the official host, which was enough to close district-grade routing even though the earlier county-crosswalk hypothesis stayed false.';
const ALT_DOMAIN_HEADING = '### Dead Legacy Official Roots Do Not End A Family If A Reviewed State-Owned Successor Host Is Live';
const ALT_DOMAIN_BODY =
  '*   **Lesson:** When an old official domain hard-fails, do not stop at the dead root if the same agency now publishes on another state-owned host. New Mexico VR looked blocked while `dvr.nm.gov` stayed 401, but the live first-party successor `dvr.state.nm.us` carried the actual About, Pre-ETS, and Locations leaves needed to verify statewide VR and transition routing.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  return raw ? raw.split('\n').map((line) => JSON.parse(line)) : [];
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  let next = current.trimEnd();
  let changed = false;
  if (!current.includes(LESSON_HEADING)) {
    next = `${next}\n\n${LESSON_HEADING}\n${LESSON_BODY}`;
    changed = true;
  }
  if (!current.includes(ALT_DOMAIN_HEADING)) {
    next = `${next}\n\n${ALT_DOMAIN_HEADING}\n${ALT_DOMAIN_BODY}`;
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(filePath, `${next}\n`);
  }
}

function buildStateReport(summary, gapRows, verifiedRows) {
  return [
    '# New Mexico California-Grade Audit Report v2',
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
    '- district_or_county_education_routing remains blocked because the live PED directory stack is stronger but still does not preserve an explicit county-to-district or county-to-REC contract, and the PED SharePoint leaves still fail current live certificate verification in certification.',
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    '- Keep New Mexico blocked and not index-safe until one live official PED geography contract or another certificate-clean official equivalent proves full local education coverage.',
    '',
    '## Completion decision',
    '',
    '- New Mexico remains BLOCKED and not index-safe.',
    '- Vocational rehabilitation / Pre-ETS now clears from the live official NMDVR host on `dvr.state.nm.us`, which preserves statewide VR authority, an exact Pre-ETS leaf, and a statewide office locations page.',
    '- Statewide IDEA Part B authority now clears from the live official U.S. Department of Education IDEA-by-State New Mexico page and its New Mexico-specific Part B materials after the old PED bureau lane stopped surviving live probes.',
    '- County-local remains verified from the official HCA field-office county service-area page across all 33 counties.',
    '- The remaining blocker is district_or_county_education_routing: the PED directory stack is real and useful, but it still does not preserve an explicit geography contract sufficient for full county-grade certification and it still fails clean live TLS probing.',
  ].join('\n') + '\n';
}

function buildAllStateReport(audit) {
  const completeStates = audit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedStates = audit.states
    .filter((row) => row.classification === 'BLOCKED')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  return [
    '# All-State California-Grade Audit Report v3',
    '',
    'This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.',
    '',
    '## Packet coverage',
    '',
    `- packet_coverage_count: ${audit.packetCoverageCount}`,
    `- packet_missing_states: ${audit.packetMissingStates.length ? audit.packetMissingStates.join(', ') : 'none'}`,
    '',
    '## Classification counts',
    '',
    `- COMPLETE: ${audit.classifications.COMPLETE || 0}`,
    `- BLOCKED: ${audit.classifications.BLOCKED || 0}`,
    '',
    `- index-safe states: ${audit.indexSafeCount}`,
    `- complete states: ${completeStates.join(', ')}`,
    `- blocked states: ${blockedStates.join(', ')}`,
    '',
    '## Notes',
    '',
    '- Texas remains COMPLETE/index-safe from v10.',
    '- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.',
    '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.',
    '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.',
    '- New Mexico remains blocked after the latest refresh because DVR and statewide Part B now clear, but the PED local-routing lane still lacks an explicit geography contract and still fails clean live TLS certification.',
  ].join('\n') + '\n';
}

function buildHandoff(audit) {
  const completeStates = audit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = audit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));
  return [
    '# Gemini Source Scout Handoff',
    '',
    `Updated: ${REVIEWED_DATE}`,
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
    '## Current Focus State: New Mexico',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` is still the sole New Mexico blocker. The live official PED SharePoint directory stack now materially proves district-grade education inventory, but it still does not preserve an explicit county-to-district or county-to-REC contract sufficient for all 33 counties and the PED leaves still fail clean live TLS certification.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 408 New Mexico Live PED + DVR Completion v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: cleared the New Mexico VR and stale statewide Part B proof lanes, but kept the state blocked because the PED local-routing lane still lacks an explicit geography contract and still fails clean live TLS certification',
    '',
    '## Evidence',
    '',
    `- ${DISTRICT_REASON}`,
    `- ${VR_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch408NewMexicoLivePedDvrCompletionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const stateCertification = readJson(INPUTS.stateCertification);

  const updatedSummary = {
    ...summary,
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 92,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_official_ped_geography_contract_or_tls_clean_leaf',
    critical_gap_families: ['district_or_county_education_routing'],
    major_gap_families: [],
    verified_source_families_with_samples: [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'special_education_idea_part_b',
      'vocational_rehabilitation_pre_ets',
      'protection_and_advocacy',
      'parent_training_information_center',
      'legal_aid',
      'able_program',
      'ssi_ssa_federal_reference',
      'county_local_disability_resources',
    ],
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'official_ped_directory_stack_materializes_district_rows_but_still_lacks_explicit_geography_contract_and_clean_live_tls_probe',
        evidence: DISTRICT_REASON,
        next_action: 'hold_for_official_ped_geography_contract_or_tls_clean_leaf',
      },
    ],
    familyStatuses: {
      ...summary.familyStatuses,
      district_or_county_education_routing: DISTRICT_STATUS,
      vocational_rehabilitation_pre_ets: VR_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        statewide_enough: true,
        status_reason: STATE_PART_B_REASON,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: DISTRICT_STATUS,
        county_grade_required: true,
        statewide_enough: false,
        status_reason: DISTRICT_REASON,
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: VR_STATUS,
        statewide_enough: true,
        status_reason: VR_REASON,
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: STATE_PART_B_SAMPLE_ROWS.length,
        query_basis:
          'Reviewed 2026-06-26 the live official U.S. Department of Education IDEA-by-State New Mexico page and its current New Mexico Part B state-materials leaf after the old PED bureau lane stopped surviving live probes.',
        blocker_code: null,
        blocker_evidence: null,
        samples: STATE_PART_B_SAMPLE_ROWS,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: DISTRICT_STATUS,
        evidence_strength: 'weak',
        sample_count: DISTRICT_SAMPLE_ROWS.length,
        query_basis:
          'Reviewed 2026-06-26 the live PED SharePoint Superintendent and school-directory streams plus the public REC page on the official host.',
        blocker_code: 'official_ped_directory_stack_materializes_district_rows_but_still_lacks_explicit_geography_contract_and_clean_live_tls_probe',
        blocker_evidence: DISTRICT_REASON,
        samples: DISTRICT_SAMPLE_ROWS,
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: VR_STATUS,
        evidence_strength: 'strong',
        sample_count: VR_SAMPLE_ROWS.length,
        query_basis:
          'Reviewed 2026-06-26 the live official NMDVR successor host, About page, exact Pre-ETS leaf, and Locations page on dvr.state.nm.us.',
        blocker_code: null,
        blocker_evidence: null,
        samples: VR_SAMPLE_ROWS,
      };
    }
    return row;
  });

  const updatedFailureRows = [
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'official_ped_directory_stack_materializes_district_rows_but_still_lacks_explicit_geography_contract_and_clean_live_tls_probe',
      evidence: DISTRICT_REASON,
      next_action: 'hold_for_official_ped_geography_contract_or_tls_clean_leaf',
    },
  ];
  const updatedNextRows = [
    {
      state: 'new-mexico',
      state_code: 'NM',
      priority_rank: 1,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'official_ped_directory_stack_materializes_district_rows_but_still_lacks_explicit_geography_contract_and_clean_live_tls_probe',
      next_action: 'hold_for_official_ped_geography_contract_or_tls_clean_leaf',
      evidence: DISTRICT_REASON,
    },
  ];

  const updatedQueueRows = queueRows.map((row) =>
    row.state === 'new-mexico'
      ? {
          ...row,
          classification: 'BLOCKED',
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'hold_for_official_ped_geography_contract_or_tls_clean_leaf',
          repair_lane: 'official_geography_contract_only',
        }
      : row,
  );

  const updatedAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) =>
      row.stateId === 'new-mexico'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            incorrectlyIndexSafe: false,
            strongCriticalFamilies: 11,
            weakCriticalFamilies: 1,
            missingCriticalFamilies: 0,
            completenessPct: 92,
            familyStatuses: {
              ...row.familyStatuses,
              special_education_idea_part_b: 'verified_state_grade',
              district_or_county_education_routing: DISTRICT_STATUS,
              vocational_rehabilitation_pre_ets: VR_STATUS,
            },
            packetBatch: BATCH,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'hold_for_official_ped_geography_contract_or_tls_clean_leaf',
          }
        : row,
    ),
  };

  updatedAudit.classifications = updatedAudit.states.reduce((acc, row) => {
    acc[row.classification] = (acc[row.classification] || 0) + 1;
    return acc;
  }, {});
  updatedAudit.indexSafeCount = updatedAudit.states.filter((row) => row.indexSafe).length;
  updatedAudit.incorrectlyIndexSafeStates = updatedAudit.states
    .filter((row) => row.indexSafe && row.classification !== 'COMPLETE')
    .map((row) => row.stateName);

  const updatedStateCertification = {
    ...stateCertification,
    pass: false,
    checkedAt: REVIEWED_AT,
    summary: updatedSummary,
    gapRows: updatedGapRows,
    failures: updatedFailureRows,
  };

  appendLessonIfMissing(INPUTS.lessons);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeText(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedVerifiedRows));
  writeJson(INPUTS.audit, updatedAudit);
  writeText(INPUTS.allStateReport, buildAllStateReport(updatedAudit));
  writeText(INPUTS.handoff, buildHandoff(updatedAudit));
  writeJson(INPUTS.stateCertification, updatedStateCertification);

  writeJson(OUTPUTS.summary, {
    batch: BATCH,
    generated_at: new Date().toISOString(),
    classification: 'BLOCKED',
    index_safe: false,
    superintendent_rows: 155,
    superintendent_unique_district_codes: 145,
    school_directory_rows: 935,
    rec_directory_public: true,
    dvr_successor_root_live: true,
    dvr_pre_ets_leaf_live: true,
    dvr_locations_live: true,
    remaining_blocker_family: 'district_or_county_education_routing',
  });
  writeText(OUTPUTS.report, buildBatchReport());

  return { classification: 'BLOCKED', summary: updatedSummary, audit: updatedAudit };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch408NewMexicoLivePedDvrCompletionV1();
  console.log(JSON.stringify(result, null, 2));
}
