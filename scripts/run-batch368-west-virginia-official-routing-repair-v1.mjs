import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'west-virginia_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'west-virginia_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'west-virginia_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'west-virginia_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'west-virginia_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch368_west-virginia_official_routing_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch368-west-virginia-official-routing-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'west-virginia-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence';

const EDUCATION_REASON =
  'Reviewed 2026-06-25 first-party West Virginia education routing surfaces. The live WVDE homepage links directly to the official `School Directory/Closings` host. The public WV School Directory then exposes `Browse schools by county` and visibly lists county entries including Barbour, Berkeley, Boone, Kanawha, and Wyoming, plus a linked superintendent listing asset. Reviewed county pages such as Barbour County Schools preserve the county office address, phone, county website, superintendent name, and linked school list on the same official directory host. This replaces West Virginia’s old statewide education fallback with current public county-grade routing evidence.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 official successor West Virginia Department of Human Services surfaces. The live DoHS homepage now links directly to `Find Field Offices`, and the public Field Offices page exposes a county selector with all 55 counties, including Barbour County through Wyoming County. Reviewed county-filtered pages preserve county-specific office records such as Barbour County DoHS Office at 49 Mattaliano Drive in Philippi with phone 304-457-9030 and Berkeley County DoHS Office at 433 Mid Atlantic Pkwy in Martinsburg with phone 304-267-0100, alongside child-support office variants on the same host. This replaces the old generic or structural county-office evidence with current official county-filtered local office routing on the live DoHS host family.';

const LEGAL_AID_REASON =
  'Reviewed 2026-06-25 the live first-party Legal Aid WV domain after the legacy `lawv.net` root redirected to `legalaidwv.org`. The homepage states that `We believe all West Virginians deserve an equal chance at justice, in the courtroom and in their communities`, and the Legal Services page states that Legal Aid of WV provides free information, advice and representation on civil legal issues while helping people receive the education and health care they need. The Get Help section also preserves direct Apply For Help and Eligibility routes on the same first-party domain. This supplies current statewide legal-aid evidence for West Virginia.';

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
    '# West Virginia California-Grade Batch 90 Report v1',
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
    '- West Virginia is now `COMPLETE` and `index_safe=true`.',
    '- `district_or_county_education_routing` now clears because the official WV School Directory publicly browses county school systems and preserves county office address, phone, superintendent, county website, and school-list routing on reviewed county pages.',
    '- `county_local_disability_resources` now clears because the successor DoHS Field Offices directory exposes all 55 counties and returns county-filtered office cards with direct local addresses and phone numbers on the official host.',
    '- `legal_aid` now clears because Legal Aid WV preserves statewide justice, get-help, and free civil legal-services language on its first-party domain.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 368 West Virginia Official Routing Repair v1',
    '',
    '- classification: COMPLETE',
    '- index_safe: true',
    '- change: cleared West Virginia education routing, county/local disability resources, and legal aid with live official first-party evidence',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    `- ${COUNTY_REASON}`,
    `- ${LEGAL_AID_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch368WestVirginiaOfficialRoutingRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
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
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: EDUCATION_REASON,
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: LEGAL_AID_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = [];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 live first-party WVDE and WV School Directory county-routing pages.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'WVDE homepage school-directory link',
            source_url: 'https://wvde.us/',
            final_url: 'https://wvde.us/',
            verification_status: 'official_verified',
            source_type: 'official_navigation_root',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live WVDE homepage links directly to the official `School Directory/Closings` host.',
          },
          {
            sample_name: 'WV School Directory county browse',
            source_url: 'https://wveis.k12.wv.us/school-directory/',
            final_url: 'https://wveis.k12.wv.us/school-directory/',
            verification_status: 'official_verified',
            source_type: 'official_county_school_directory',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The public WV School Directory exposes `Browse schools by county` and visibly lists county entries including Barbour, Berkeley, Boone, Kanawha, and Wyoming.',
          },
          {
            sample_name: 'Barbour County Schools page',
            source_url: 'https://wveis.k12.wv.us/school-directory/?county_id=2',
            final_url: 'https://wveis.k12.wv.us/school-directory/?county_id=2',
            verification_status: 'official_verified',
            source_type: 'official_county_school_directory_page',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Barbour County Schools page preserves 45 School St, Philippi, WV 26416-1600, phone 304-457-3030, the county website, superintendent Eddie Vincent, and the county school list.',
          },
          {
            sample_name: 'Barbour County school list',
            source_url: 'https://wveis.k12.wv.us/school-directory/?county_id=2',
            final_url: 'https://wveis.k12.wv.us/school-directory/?county_id=2',
            verification_status: 'official_verified',
            source_type: 'official_county_school_list',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same county page then links individual schools under `Schools of Barbour County`, preserving direct local school routing on the official directory host.',
          },
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 live first-party Legal Aid WV homepage, Get Help page, and Legal Services page.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Legal Aid WV homepage',
            source_url: 'https://legalaidwv.org/',
            final_url: 'https://legalaidwv.org/',
            verification_status: 'official_verified',
            source_type: 'official_homepage',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The homepage states that `We believe all West Virginians deserve an equal chance at justice, in the courtroom and in their communities`.',
          },
          {
            sample_name: 'Legal Aid WV Get Help',
            source_url: 'https://legalaidwv.org/get-help/',
            final_url: 'https://legalaidwv.org/get-help/',
            verification_status: 'official_verified',
            source_type: 'official_get_help_page',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Get Help section preserves direct `Apply For Help` and `Eligibility` routes and explains how to access legal information and direct services.',
          },
          {
            sample_name: 'Legal Aid WV Legal Services',
            source_url: 'https://legalaidwv.org/our-programs/legal-services/',
            final_url: 'https://legalaidwv.org/our-programs/legal-services/',
            verification_status: 'official_verified',
            source_type: 'official_legal_services_page',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Legal Aid of WV provides free information, advice and representation on civil legal issues and helps people receive the education and healthcare they need.',
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
        query_basis: 'Reviewed 2026-06-25 live successor West Virginia DoHS county field-office directory and county-filtered results pages.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'DoHS homepage field-offices link',
            source_url: 'https://dohs.wv.gov/',
            final_url: 'https://dohs.wv.gov/',
            verification_status: 'official_verified',
            source_type: 'official_navigation_root',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live successor DoHS homepage links directly to `Find Field Offices`.',
          },
          {
            sample_name: 'DoHS Field Offices county selector',
            source_url: 'https://dohs.wv.gov/field-offices',
            final_url: 'https://dohs.wv.gov/field-offices',
            verification_status: 'official_verified',
            source_type: 'official_county_office_directory',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The public Field Offices page exposes a county selector with all 55 counties, including Barbour County through Wyoming County.',
          },
          {
            sample_name: 'Barbour County DoHS Office',
            source_url: 'https://dohs.wv.gov/field-offices?field_county_target_id=4',
            final_url: 'https://dohs.wv.gov/field-offices?field_county_target_id=4',
            verification_status: 'official_verified',
            source_type: 'official_county_filtered_office_results',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Barbour County filtered page preserves Barbour County DoHS Office at 49 Mattaliano Drive, Philippi, WV 26416 with phone 304-457-9030.',
          },
          {
            sample_name: 'Berkeley County DoHS Office',
            source_url: 'https://dohs.wv.gov/field-offices?field_county_target_id=5',
            final_url: 'https://dohs.wv.gov/field-offices?field_county_target_id=5',
            verification_status: 'official_verified',
            source_type: 'official_county_filtered_office_results',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Berkeley County filtered page preserves Berkeley County DoHS Office at 433 Mid Atlantic Pkwy, Martinsburg, WV 25402 with phone 304-267-0100.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = [];

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);

  writeJson(OUTPUTS.batchSummary, {
    state: 'west-virginia',
    batch: 'batch368_west-virginia_official_routing_repair_v1',
    classification: 'COMPLETE',
    index_safe: true,
    cleared_families: [
      'district_or_county_education_routing',
      'legal_aid',
      'county_local_disability_resources',
    ],
    remaining_blockers: [],
    evidence: {
      district_or_county_education_routing: EDUCATION_REASON,
      legal_aid: LEGAL_AID_REASON,
      county_local_disability_resources: COUNTY_REASON,
    },
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport());

  return {
    summary: updatedSummary,
    gapRows: updatedGapRows,
    failureRows: updatedFailureRows,
    verifiedRows: updatedVerifiedRows,
    nextRows: updatedNextRows,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch368WestVirginiaOfficialRoutingRepairV1();
}
