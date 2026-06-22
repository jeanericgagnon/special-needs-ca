import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'connecticut_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'connecticut_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'connecticut_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'connecticut_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'connecticut_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch117_connecticut_dds_county_map_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch117-connecticut-dds-county-map-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'connecticut-california-grade-audit-report-v2.md'),
  countyMap: path.join(generatedDir, 'connecticut_dds_region_county_map_v1.jsonl'),
};

const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 bounded live checks on the current Public EdSight district-finder shell https://public-edsight.ct.gov/overview/find-schools/find-school-district and its linked official OrgSearchReport endpoint https://edsight.ct.gov/SASStoredProcess/do?_keyword=&_program=%2FCTDOE%2FEdSight%2FRelease%2FReporting%2FPublic%2FReports%2FStoredProcesses%2FOrgSearchReport_SiteCore&orgtype=&orgdistrict=&orgname=Hartford&_select=Submit. The public shell renders anonymous navigation only, while the direct district query bounces to SAS Logon instead of returning public district records, so the official state directory surface still does not preserve county- or district-grade routing contacts that can replace Connecticut\'s statewide SDE fallback rows.';
const COUNTY_STATUS_REASON = 'Connecticut DDS county-local routing is now recoverable from live official first-party pages: the DDS Regions hub names the counties served by North, South, and West, and the public regional general-contact pages preserve region headquarters, satellite offices, phones, emails, and toll-free numbers. New Haven county remains dual-routed because the official hub assigns New Haven broadly to South while explicitly assigning Northern New Haven to West.';
const COUNTY_QUERY_BASIS = 'Reviewed 2026-06-22 live official DDS Regions hub plus the North, South, and West general-contact leaves and derived a county-to-region routing map from the counties-served text on the hub.';
const EDUCATION_NEXT = 'author_district_owned_exact_targets_or_browser_auth_edsight_query';
const LESSON_HEADING = '### Live Regional Contact Pages Can Retire A PDF-Only Blocker';
const LESSON_BODY = '*   **Lesson:** If a state replaces dead county-office leaves with a live regional hub, check whether that hub also links public region-specific contact pages before stopping at the PDF. Connecticut DDS became county-grade again because the counties-served text lived on the hub while region headquarters and satellite contacts lived on the public North/South/West contact leaves.';

const COUNTY_ROWS = [
  {
    county_id: 'fairfield-ct',
    region: 'West Region',
    coverage_scope: 'all_county',
    counties_evidence: 'West Region serves Fairfield, Northern New Haven, and Litchfield counties.',
    source_url: 'https://portal.ct.gov/dds/about/dds-regions',
    contact_url: 'https://portal.ct.gov/dds/searchable-archive/westregion/west-region-contacts/west-region-general-contact-information',
    office_address: '55 West Main Street, Waterbury, CT 06702',
    office_phone: '(203) 805-7400',
    office_email: 'ddsct.west@ct.gov',
  },
  {
    county_id: 'hartford-ct',
    region: 'North Region',
    coverage_scope: 'all_county',
    counties_evidence: 'North Region serves Hartford, Tolland, and Windham counties.',
    source_url: 'https://portal.ct.gov/dds/about/dds-regions',
    contact_url: 'https://portal.ct.gov/dds/searchable-archive/northregion/north-region-contacts/north-region-general-contact-information',
    office_address: '155 Founders Plaza, 255 Pitkin Street, East Hartford, CT 06108',
    office_phone: '(860) 263-2500',
    office_email: 'ddsct.north@ct.gov',
  },
  {
    county_id: 'litchfield-ct',
    region: 'West Region',
    coverage_scope: 'all_county',
    counties_evidence: 'West Region serves Fairfield, Northern New Haven, and Litchfield counties.',
    source_url: 'https://portal.ct.gov/dds/about/dds-regions',
    contact_url: 'https://portal.ct.gov/dds/searchable-archive/westregion/west-region-contacts/west-region-general-contact-information',
    office_address: '55 West Main Street, Waterbury, CT 06702',
    office_phone: '(203) 805-7400',
    office_email: 'ddsct.west@ct.gov',
  },
  {
    county_id: 'middlesex-ct',
    region: 'South Region',
    coverage_scope: 'all_county',
    counties_evidence: 'South Region serves New Haven, Middlesex, and New London counties.',
    source_url: 'https://portal.ct.gov/dds/about/dds-regions',
    contact_url: 'https://portal.ct.gov/dds/searchable-archive/southregion/contacts/south-region-general-contact-information',
    office_address: '35 Thorpe Avenue, 3rd Floor, Wallingford, CT 06492',
    office_phone: '(203) 294-5049',
    office_email: 'ddsct.south@ct.gov',
  },
  {
    county_id: 'new-haven-ct',
    region: 'South Region',
    coverage_scope: 'county_wide_default',
    counties_evidence: 'South Region serves New Haven, Middlesex, and New London counties.',
    source_url: 'https://portal.ct.gov/dds/about/dds-regions',
    contact_url: 'https://portal.ct.gov/dds/searchable-archive/southregion/contacts/south-region-general-contact-information',
    office_address: '35 Thorpe Avenue, 3rd Floor, Wallingford, CT 06492',
    office_phone: '(203) 294-5049',
    office_email: 'ddsct.south@ct.gov',
  },
  {
    county_id: 'new-haven-ct',
    region: 'West Region',
    coverage_scope: 'northern_new_haven_subcounty',
    counties_evidence: 'West Region serves Fairfield, Northern New Haven, and Litchfield counties.',
    source_url: 'https://portal.ct.gov/dds/about/dds-regions',
    contact_url: 'https://portal.ct.gov/dds/searchable-archive/westregion/west-region-contacts/west-region-general-contact-information',
    office_address: '55 West Main Street, Waterbury, CT 06702',
    office_phone: '(203) 805-7400',
    office_email: 'ddsct.west@ct.gov',
  },
  {
    county_id: 'new-london-ct',
    region: 'South Region',
    coverage_scope: 'all_county',
    counties_evidence: 'South Region serves New Haven, Middlesex, and New London counties.',
    source_url: 'https://portal.ct.gov/dds/about/dds-regions',
    contact_url: 'https://portal.ct.gov/dds/searchable-archive/southregion/contacts/south-region-general-contact-information',
    office_address: '35 Thorpe Avenue, 3rd Floor, Wallingford, CT 06492',
    office_phone: '(203) 294-5049',
    office_email: 'ddsct.south@ct.gov',
  },
  {
    county_id: 'tolland-ct',
    region: 'North Region',
    coverage_scope: 'all_county',
    counties_evidence: 'North Region serves Hartford, Tolland, and Windham counties.',
    source_url: 'https://portal.ct.gov/dds/about/dds-regions',
    contact_url: 'https://portal.ct.gov/dds/searchable-archive/northregion/north-region-contacts/north-region-general-contact-information',
    office_address: '155 Founders Plaza, 255 Pitkin Street, East Hartford, CT 06108',
    office_phone: '(860) 263-2500',
    office_email: 'ddsct.north@ct.gov',
  },
  {
    county_id: 'windham-ct',
    region: 'North Region',
    coverage_scope: 'all_county',
    counties_evidence: 'North Region serves Hartford, Tolland, and Windham counties.',
    source_url: 'https://portal.ct.gov/dds/about/dds-regions',
    contact_url: 'https://portal.ct.gov/dds/searchable-archive/northregion/north-region-contacts/north-region-general-contact-information',
    office_address: '155 Founders Plaza, 255 Pitkin Street, East Hartford, CT 06108',
    office_phone: '(860) 263-2500',
    office_email: 'ddsct.north@ct.gov',
  },
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
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

function buildCountyVerifiedRow() {
  return {
    state: 'connecticut',
    state_code: 'CT',
    family: 'county_local_disability_resources',
    family_status: 'verified_state_grade',
    evidence_strength: 'strong',
    sample_count: COUNTY_ROWS.length,
    query_basis: COUNTY_QUERY_BASIS,
    blocker_code: null,
    blocker_evidence: null,
    samples: COUNTY_ROWS.map((row) => ({
      sample_name: `${row.region} -> ${row.county_id}`,
      source_url: row.source_url,
      final_url: row.contact_url,
      verification_status: 'official_verified',
      source_type: 'official_regional_contact_page',
      source_table: 'reviewed_first_party_artifact',
      fetched_at: '2026-06-22T00:00:00.000Z',
      evidence_snippet: `${row.counties_evidence} Public regional contact page preserves ${row.office_address}, ${row.office_phone}, and ${row.office_email}.`,
    })),
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Connecticut California-Grade Audit Report v2',
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
    '- Connecticut still cannot reach California-grade or become index-safe because the official education directory surface stops at a public finder shell plus a SAS-logon-gated district query.',
    '- County/local disability resources are no longer blocked: the live DDS Regions hub names the counties served by North, South, and West, and the public region contact pages preserve headquarters, satellite offices, phones, and emails for those routes.',
    '- New Haven county remains dual-routed in the evidence chain because the official DDS hub assigns the county broadly to South while explicitly assigning Northern New Haven to West; that is preserved as a truthful multi-region county mapping rather than flattened into one fake county office.',
    '- Connecticut therefore remains BLOCKED and not index-safe, but the remaining blocker is now narrowed to the authenticated state education directory lane only.',
  ].join('\n') + '\n';
}

export function generateBatch117ConnecticutDdsCountyMapRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const countyVerifiedRow = buildCountyVerifiedRow();

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'verified_state_grade', status_reason: COUNTY_STATUS_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'county_local_disability_resources');

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources' ? countyVerifiedRow : row
  ));

  const updatedNextRows = nextRows.filter((row) => row.family !== 'county_local_disability_resources');

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    complete_ready: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    primary_gap_reason: 'public_edsight_shell_does_not_yield_anonymous_district_records',
    critical_gap_families: ['district_or_county_education_routing'],
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'public_edsight_shell_does_not_yield_anonymous_district_records',
        evidence: EDUCATION_EVIDENCE,
        next_action: EDUCATION_NEXT,
      },
    ],
  };

  writeJsonl(OUTPUTS.countyMap, COUNTY_ROWS.map((row) => ({
    state: 'connecticut',
    state_code: 'CT',
    county_id: row.county_id,
    region: row.region,
    coverage_scope: row.coverage_scope,
    source_url: row.source_url,
    contact_url: row.contact_url,
    office_address: row.office_address,
    office_phone: row.office_phone,
    office_email: row.office_email,
    verification_status: 'official_verified',
    evidence_snippet: `${row.counties_evidence} Public regional contact page preserves ${row.office_address}, ${row.office_phone}, and ${row.office_email}.`,
  })));
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'connecticut',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    repaired_family: 'county_local_disability_resources',
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    county_region_rows: COUNTY_ROWS.length,
    unique_counties_covered: new Set(COUNTY_ROWS.map((row) => row.county_id)).size,
    lesson_added: lessonAdded,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 117 Connecticut DDS County Map Repair Report v1',
      '',
      'This pass upgrades only the Connecticut county/local disability-resources family from live official DDS region evidence. It does not reopen the authenticated EdSight education blocker.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- repaired_family: county_local_disability_resources`,
      `- county_region_rows: ${COUNTY_ROWS.length}`,
      `- unique_counties_covered: ${new Set(COUNTY_ROWS.map((row) => row.county_id)).size}`,
      `- remaining_blocker: ${updatedSummary.final_blockers[0].family}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch117ConnecticutDdsCountyMapRepairV1();
  console.log(JSON.stringify(summary, null, 2));
}
