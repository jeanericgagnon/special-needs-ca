import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'south-dakota_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'south-dakota_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'south-dakota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'south-dakota_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'south-dakota_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch366_south-dakota_official_routing_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch366-south-dakota-official-routing-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'south-dakota-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON =
  'current_dhs_host_exposes_no_public_county_or_local_office_contract_for_south_dakota_county_local_disability_routing';

const COUNTY_FAILURE_CODE =
  'current_dhs_host_exposes_page_not_found_localoffices_route_and_statewide_contact_surfaces_only';
const COUNTY_FAMILY_STATUS =
  'blocked_current_dhs_host_without_public_county_or_local_office_contract';
const COUNTY_NEXT_ACTION =
  'hold_blocked_until_current_dhs_host_exposes_public_county_to_office_or_local_service_contract';
const COUNTY_REASON =
  'Reviewed 2026-06-25 and rechecked 2026-06-25 bounded first-party South Dakota DHS surfaces. The current `/en/localoffices` route still serves a JS shell in raw HTML and the embedded application payload resolves the `localoffices` entry to `title":"Page Not Found"` on a page-not-found content record instead of a public local-office directory. The current `Contact Us` page also serves through the same client-rendered shell, but its embedded payload only exposes statewide phone, email, and Pierre mailing contacts. A fresh raw recheck now tightens the third lane too: `Staff and Program Directory` no longer needs a transport-only blocker because the current `/en/staff-and-program-directory` route also resolves to a 200 `Loading` shell whose embedded payload points at the same `title":"Page Not Found"` content record rather than a reviewable county or local-office directory. South Dakota therefore still lacks a truthful public county-grade local-office routing contract on the current official DHS host family.';

const EDUCATION_REASON =
  'Reviewed 2026-06-25 bounded first-party South Dakota DOE directory surfaces. The public South Dakota Educational Directory root lists statewide Public School Districts and links each district into a detail page. Reviewed district detail pages such as Bennett County 03-1 and Sioux Falls 49-5 preserve mailing and physical addresses plus a named `Special Education Director` field directly on the official DOE host. The same official directory family also publishes district maps and county map PDFs and exposes special-education cooperatives as directory entities. This is current first-party district-grade public education routing evidence, replacing the old generic statewide fallback.';

const LEGAL_AID_REASON =
  'Reviewed 2026-06-25 the official South Dakota Unified Judicial System self-help pages. The official `Get Legal Help` page states that people can apply for free or low-cost legal help in South Dakota and that SD Law Help forwards applications to South Dakota legal-services programs including East River Legal Services, Dakota Plains Legal Services, and Access to Justice. This is current authoritative statewide legal-aid routing evidence on the official state judiciary host.';

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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# South Dakota California-Grade Batch 84 Report v1',
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
    '- South Dakota remains `BLOCKED` and `index_safe=false`.',
    '- `district_or_county_education_routing` is now cleared with official DOE district-directory pages that publish district contacts and a `Special Education Director` field on the public host.',
    '- `legal_aid` is now cleared with the official South Dakota UJS `Get Legal Help` page and its statewide SD Law Help routing references.',
    '- `county_local_disability_resources` is the sole remaining critical blocker because the current DHS host still exposes no public county or local-office contract.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 366 South Dakota Official Routing Repair v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: cleared South Dakota education routing and legal aid with official evidence and narrowed the remaining county-local blocker to the current DHS host family',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    `- ${LEGAL_AID_REASON}`,
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch366SouthDakotaOfficialRoutingRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedSummary = {
    ...summary,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: ['county_local_disability_resources'],
    major_gap_families: [],
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: COUNTY_FAILURE_CODE,
        evidence: COUNTY_REASON,
        next_action: COUNTY_NEXT_ACTION,
      },
    ],
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed official South Dakota DOE district-directory pages now preserve district-grade public routing and a Special Education Director field on live district detail pages',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed official South Dakota UJS Get Legal Help page now preserves statewide free or low-cost legal-aid routing through SD Law Help',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: COUNTY_FAMILY_STATUS,
        status_reason: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => row.family === 'county_local_disability_resources')
    .map((row) => ({
      ...row,
      failure_code: COUNTY_FAILURE_CODE,
      evidence: COUNTY_REASON,
      next_action: COUNTY_NEXT_ACTION,
    }));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 5,
        query_basis: 'Reviewed 2026-06-25 first-party South Dakota DOE educational-directory root plus public district detail pages.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'South Dakota Educational Directory',
            source_url: 'https://doe.sd.gov/ofm/edudir.aspx',
            final_url: 'https://doe.sd.gov/ofm/edudir.aspx',
            verification_status: 'official_verified',
            source_type: 'official_statewide_district_directory',
            source_table: 'school_districts',
            evidence_snippet: 'The public South Dakota Educational Directory lists statewide Public School Districts and links each district to district-specific pages on the official DOE host.',
          },
          {
            sample_name: 'Bennett County 03-1 district detail',
            source_url: 'https://doe.sd.gov/ofm/results.aspx?districtnumber=03001',
            final_url: 'https://doe.sd.gov/ofm/results.aspx?districtnumber=03001',
            verification_status: 'official_verified',
            source_type: 'official_district_detail',
            source_table: 'school_districts',
            evidence_snippet: 'The public Bennett County district detail page preserves district addresses and a named `Special Education Director` field.',
          },
          {
            sample_name: 'Sioux Falls 49-5 district detail',
            source_url: 'https://doe.sd.gov/ofm/results.aspx?districtnumber=49005',
            final_url: 'https://doe.sd.gov/ofm/results.aspx?districtnumber=49005',
            verification_status: 'official_verified',
            source_type: 'official_district_detail',
            source_table: 'school_districts',
            evidence_snippet: 'A second reviewed district detail page for Sioux Falls 49-5 also preserves district addresses and a `Special Education Director` field on the public DOE host.',
          },
          {
            sample_name: 'South Dakota District Maps',
            source_url: 'https://doe.sd.gov/ofm/districts.aspx',
            final_url: 'https://doe.sd.gov/ofm/districts.aspx',
            verification_status: 'official_verified',
            source_type: 'official_district_map_directory',
            source_table: 'school_districts',
            evidence_snippet: 'The official district-maps page publishes district and county map PDFs on the same DOE directory family, reinforcing county listings and public local-routing support.',
          },
          {
            sample_name: 'Aberdeen 06-1 district detail',
            source_url: 'https://doe.sd.gov/ofm/results.aspx?districtnumber=06001',
            final_url: 'https://doe.sd.gov/ofm/results.aspx?districtnumber=06001',
            verification_status: 'official_verified',
            source_type: 'official_district_detail',
            source_table: 'school_districts',
            evidence_snippet: 'A third reviewed district-specific page for Aberdeen 06-1 also preserves public contact data and a Special Education Director field on the official DOE host.',
          },
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 official South Dakota UJS Get Legal Help page for statewide civil legal-aid routing.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'South Dakota UJS Get Legal Help',
            source_url: 'https://ujs.sd.gov/self-help/get-legal-help/',
            final_url: 'https://ujs.sd.gov/self-help/get-legal-help/',
            verification_status: 'official_verified',
            source_type: 'official_state_judiciary_self_help',
            source_table: 'reviewed_authoritative_artifact',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'If you need legal assistance in civil matters, you can apply for free or low-cost legal help in South Dakota.',
          },
          {
            sample_name: 'SD Law Help routing statement',
            source_url: 'https://ujs.sd.gov/self-help/get-legal-help/',
            final_url: 'https://ujs.sd.gov/self-help/get-legal-help/',
            verification_status: 'official_verified',
            source_type: 'official_statewide_legal_aid_router',
            source_table: 'reviewed_authoritative_artifact',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'SD Law Help is a website created by three nonprofit legal aid groups serving South Dakota and local Tribal Nations.',
          },
          {
            sample_name: 'East River and Dakota Plains listing',
            source_url: 'https://ujs.sd.gov/self-help/get-legal-help/',
            final_url: 'https://ujs.sd.gov/self-help/get-legal-help/',
            verification_status: 'official_verified',
            source_type: 'official_statewide_legal_aid_program_list',
            source_table: 'reviewed_authoritative_artifact',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Applications are automatically forwarded to legal services programs in South Dakota including East River Legal Services and Dakota Plains Legal Services.',
          },
          {
            sample_name: 'Access to Justice listing',
            source_url: 'https://ujs.sd.gov/self-help/get-legal-help/',
            final_url: 'https://ujs.sd.gov/self-help/get-legal-help/',
            verification_status: 'official_verified',
            source_type: 'official_statewide_legal_aid_program_list',
            source_table: 'reviewed_authoritative_artifact',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same official page also routes applicants to Access to Justice.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: COUNTY_FAMILY_STATUS,
        evidence_strength: 'weak',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 first-party South Dakota DHS localoffices, contact-us, and staff-directory surfaces for public county-local routing evidence, then rechecked the current host again live.',
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: COUNTY_REASON,
        samples: [
          {
            sample_name: 'South Dakota DHS localoffices route',
            source_url: 'https://dhs.sd.gov/en/localoffices',
            final_url: 'https://dhs.sd.gov/en/localoffices',
            verification_status: 'official_verified',
            source_type: 'official_route_without_public_directory',
            source_table: 'county_offices',
            evidence_snippet: 'The raw page serves only a JS shell and embeds `aemPages.localoffices.title` as `Page Not Found` instead of a public local-office directory.',
          },
          {
            sample_name: 'South Dakota DHS Contact Us',
            source_url: 'https://dhs.sd.gov/en/contact-us',
            final_url: 'https://dhs.sd.gov/en/contact-us',
            verification_status: 'official_verified',
            source_type: 'official_statewide_contact_page',
            source_table: 'county_offices',
            evidence_snippet: 'The current Contact Us page exposes only statewide phone, email, and Pierre mailing contacts.',
          },
          {
            sample_name: 'South Dakota DHS Staff and Program Directory',
            source_url: 'https://dhs.sd.gov/en/staff-and-program-directory',
            final_url: 'https://dhs.sd.gov/en/staff-and-program-directory',
            verification_status: 'official_verified',
            source_type: 'official_route_without_public_directory',
            source_table: 'county_offices',
            evidence_snippet: 'The current Staff and Program Directory route also resolves to a 200 `Loading` shell whose embedded payload points at `Page Not Found`, so it still exposes no county field, no local-office list, and no county-to-office contract.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = [
    {
      state: 'south-dakota',
      state_code: 'SD',
      priority_rank: 1,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: COUNTY_FAILURE_CODE,
      next_action: COUNTY_NEXT_ACTION,
      evidence: 'Current DHS host still exposes a page-not-found localoffices route plus statewide-only contact and staff surfaces instead of a county-grade local-office contract.',
    },
  ];

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);

  writeJson(OUTPUTS.batchSummary, {
    state: 'south-dakota',
    batch: 'batch366_south-dakota_official_routing_repair_v1',
    classification: 'BLOCKED',
    index_safe: false,
    cleared_families: ['district_or_county_education_routing', 'legal_aid'],
    remaining_blockers: ['county_local_disability_resources'],
    evidence: {
      district_or_county_education_routing: EDUCATION_REASON,
      legal_aid: LEGAL_AID_REASON,
      county_local_disability_resources: COUNTY_REASON,
    },
  });
  fs.mkdirSync(path.dirname(OUTPUTS.batchReport), { recursive: true });
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport());
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
}

generateBatch366SouthDakotaOfficialRoutingRepairV1();
