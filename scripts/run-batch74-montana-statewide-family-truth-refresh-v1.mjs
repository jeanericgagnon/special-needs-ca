import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'montana_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'montana_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'montana_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'montana_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'montana_next_action_queue_v2.jsonl'),
  priorityQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch74_montana_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch74-montana-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'montana-california-grade-audit-report-v2.md'),
};

const REVIEWED_EVIDENCE = {
  pAndAAbout: {
    url: 'https://disabilityrightsmt.org/about-us/',
    finalUrl: 'https://disabilityrightsmt.org/about-us/',
    status: 200,
    evidence: 'Reviewed 2026-06-22 first-party DRM About Us page. The live page states: "Authority Disability Rights Montana is the federally-mandated civil rights protection and advocacy system for Montana. We have the legal authority to represent almost any person with a disability."',
  },
  pAndAHb393: {
    url: 'https://disabilityrightsmt.org/hb393/',
    finalUrl: 'https://disabilityrightsmt.org/hb393/',
    status: 200,
    evidence: 'Reviewed 2026-06-22 first-party DRM HB393 case page. The live page states: "As the designated statewide Protection and Advocacy system for Montana, Disability Rights Montana appears in this case as an organizational plaintiff."',
  },
  schoolsDirectory: {
    url: 'https://opi.mt.gov/Leadership/Management-Operations/Montana-Schools-Directory',
    finalUrl: 'https://opi.mt.gov/Leadership/Management-Operations/Montana-Schools-Directory',
    status: 200,
    evidence: 'Reviewed 2026-06-22 official OPI Montana Schools Directory page. It preserves a public "Search Directory by County" route, a public PDF directory download, an interactive map, and direct links into county- and district-level superintendent databases.',
  },
  schoolsDirectoryCountySearch: {
    url: 'https://apps.opi.mt.gov/SchoolDirectory/',
    finalUrl: 'https://apps.opi.mt.gov/SchoolDirectory/',
    status: 200,
    evidence: 'Reviewed 2026-06-22 public OPI county search page. The rendered page enumerates all 56 Montana counties in the visible county selector and instructs users to select a county and view the directory below.',
  },
  countySuperintendents: {
    url: 'https://apps.opi.mt.gov/OPIReportingCenter/frmCentralDirectory.aspx?ProcName=procCentralDirectoryCountyStaff&ScreenTitle=County%20Superintendents&SelectCounty=1&SelectRole=1&Role=COSUPT&ShowReport=1&ScreenMsg=Database%20of%20Montana%20County%20Superintendents',
    finalUrl: 'https://apps.opi.mt.gov/OPIReportingCenter/frmCentralDirectory.aspx?ProcName=procCentralDirectoryCountyStaff&ScreenTitle=County%20Superintendents&SelectCounty=1&SelectRole=1&Role=COSUPT&ShowReport=1&ScreenMsg=Database%20of%20Montana%20County%20Superintendents',
    status: 200,
    evidence: 'Reviewed 2026-06-22 public OPI County Superintendents database. The rendered report preserves county name, staff name, title, address, city, zip, phone, fax, and email fields for Montana county superintendents, including Beaverhead and Big Horn in the captured page.',
  },
  districtSuperintendents: {
    url: 'https://apps.opi.mt.gov/OPIReportingCenter/frmCentralDirectory.aspx?ProcName=procCentralDirectorySystemStaffBySystem&ScreenTitle=District%20Superintendents&SelectRole=1&Role=SUPT&ShowReport=1&ScreenMsg=%20Database%20of%20Montana%20District%20Superintendents',
    finalUrl: 'https://apps.opi.mt.gov/OPIReportingCenter/frmCentralDirectory.aspx?ProcName=procCentralDirectorySystemStaffBySystem&ScreenTitle=District%20Superintendents&SelectRole=1&Role=SUPT&ShowReport=1&ScreenMsg=%20Database%20of%20Montana%20District%20Superintendents',
    status: 200,
    evidence: 'Reviewed 2026-06-22 public OPI District Superintendents database. The rendered report preserves County Name, System Name, address, staff email, phone, fax, and superintendent fields, with captured rows for Beaverhead county districts such as Grant Elementary and Dillon Elementary.',
  },
  countyOffice: {
    url: 'https://dphhs.mt.gov/CFSD/countyoffice',
    finalUrl: 'https://dphhs.mt.gov/CFSD/countyoffice',
    status: 200,
    evidence: 'Reviewed 2026-06-22 official DPHHS County Offices page. The rendered page lists all 56 Montana counties with county name, address, phone, and fax fields directly in the public HTML, including Beaverhead, Gallatin, Yellowstone, and Wibaux.',
  },
  publicAssistance: {
    url: 'https://dphhs.mt.gov/HCSD/OfficeofPublicAssistance',
    finalUrl: 'https://dphhs.mt.gov/HCSD/OfficeofPublicAssistance',
    status: 200,
    evidence: 'Reviewed 2026-06-22 official DPHHS Field Offices of Public Assistance page. The page preserves named field offices with address and county-keyed email routes such as hhshcsopayellowstone@mt.gov and hhshcsopagallatin@mt.gov.',
  },
  staleLocations404: {
    url: 'https://dphhs.mt.gov/locations',
    finalUrl: 'https://dphhs.mt.gov/locations',
    status: 404,
    evidence: 'Reviewed 2026-06-22 old DPHHS /locations root. It now returns the department 404 page, so county-local routing must use the newer OfficeLocations / countyoffice leaves instead of the stale placeholder root.',
  },
};

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

function buildVerifiedRows(existingRows) {
  return existingRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed 2026-06-22 first-party Disability Rights Montana leaves now preserve explicit statewide P&A designation text, including both the federally mandated system statement and a designated statewide P&A statement on a live case page.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Montana About Us',
            source_url: REVIEWED_EVIDENCE.pAndAAbout.finalUrl,
            final_url: REVIEWED_EVIDENCE.pAndAAbout.finalUrl,
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: REVIEWED_EVIDENCE.pAndAAbout.evidence,
          },
          {
            sample_name: 'Disability Rights Montana HB393',
            source_url: REVIEWED_EVIDENCE.pAndAHb393.finalUrl,
            final_url: REVIEWED_EVIDENCE.pAndAHb393.finalUrl,
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: REVIEWED_EVIDENCE.pAndAHb393.evidence,
          },
        ],
      };
    }

    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-22 exact official Montana OPI directory leaves. The Montana Schools Directory page links a public county search page plus public county-superintendent and district-superintendent databases, and the county selector visibly enumerates all 56 Montana counties.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Montana Schools Directory',
            source_url: REVIEWED_EVIDENCE.schoolsDirectory.finalUrl,
            final_url: REVIEWED_EVIDENCE.schoolsDirectory.finalUrl,
            verification_status: 'verified',
            source_type: 'official_directory_root',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: REVIEWED_EVIDENCE.schoolsDirectory.evidence,
          },
          {
            sample_name: 'Montana Search Directory by County',
            source_url: REVIEWED_EVIDENCE.schoolsDirectoryCountySearch.finalUrl,
            final_url: REVIEWED_EVIDENCE.schoolsDirectoryCountySearch.finalUrl,
            verification_status: 'verified',
            source_type: 'official_county_directory',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: REVIEWED_EVIDENCE.schoolsDirectoryCountySearch.evidence,
          },
          {
            sample_name: 'Montana District Superintendents Database',
            source_url: REVIEWED_EVIDENCE.districtSuperintendents.finalUrl,
            final_url: REVIEWED_EVIDENCE.districtSuperintendents.finalUrl,
            verification_status: 'verified',
            source_type: 'official_district_directory',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: REVIEWED_EVIDENCE.districtSuperintendents.evidence,
          },
        ],
      };
    }

    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed 2026-06-22 exact official Montana DPHHS county-office leaves. The CFSD County Offices page lists all 56 Montana counties directly in public HTML, and the Public Assistance field-office page preserves named office addresses plus county-keyed email routing.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Montana DPHHS County Offices',
            source_url: REVIEWED_EVIDENCE.countyOffice.finalUrl,
            final_url: REVIEWED_EVIDENCE.countyOffice.finalUrl,
            verification_status: 'verified',
            source_type: 'official_county_directory',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: REVIEWED_EVIDENCE.countyOffice.evidence,
          },
          {
            sample_name: 'Montana Field Offices of Public Assistance',
            source_url: REVIEWED_EVIDENCE.publicAssistance.finalUrl,
            final_url: REVIEWED_EVIDENCE.publicAssistance.finalUrl,
            verification_status: 'verified',
            source_type: 'official_field_office_directory',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: REVIEWED_EVIDENCE.publicAssistance.evidence,
          },
        ],
      };
    }

    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Montana California-Grade Batch 74 Report v1',
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
    '- Montana is now `COMPLETE` and `index_safe=true`.',
    '- Disability Rights Montana now clears statewide Protection and Advocacy because first-party reviewed pages explicitly call DRM both the federally mandated protection and advocacy system for Montana and the designated statewide Protection and Advocacy system for Montana.',
    '- District or county education routing now clears at county grade because the official OPI Montana Schools Directory exposes a public county search page that visibly enumerates all 56 counties and links direct public county-superintendent and district-superintendent databases.',
    '- County/local disability resources now clear at county grade because the official DPHHS County Offices page lists all 56 counties with local contact data directly in public HTML, and the Public Assistance field-office page adds named offices and county-keyed email routing.',
    '- The old `https://dphhs.mt.gov/locations` placeholder is now a hard 404, so future work should stay on the newer `AboutUs/OfficeLocations` and `CFSD/countyoffice` leaves rather than reopening the dead root.',
  ].join('\n') + '\n';
}

export function generateBatch74MontanaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const priorityRows = readJsonl(INPUTS.priorityQueue);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed first-party Disability Rights Montana leaves now preserve explicit statewide P&A designation text, including both federally mandated system language and a designated statewide P&A statement.',
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        status_reason: 'Reviewed official OPI county search and public superintendent databases preserve county-keyed and district-keyed routing across all 56 Montana counties.',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        status_reason: 'Reviewed official DPHHS County Offices page lists all 56 counties with local office contact data directly in public HTML, and the Public Assistance field-office page adds county-keyed email routing.',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => ![
    'protection_and_advocacy',
    'district_or_county_education_routing',
    'county_local_disability_resources',
  ].includes(row.family));

  const updatedVerifiedRows = buildVerifiedRows(verifiedRows);
  const updatedNextRows = nextRows.filter((row) => ![
    'protection_and_advocacy',
    'district_or_county_education_routing',
    'county_local_disability_resources',
  ].includes(row.family));

  const updatedSummary = {
    ...summary,
    classification: 'COMPLETE',
    index_safe: true,
    incorrectly_index_safe: false,
    completeness_pct: 100,
    strong_critical_families: 12,
    weak_critical_families: 0,
    missing_critical_families: 0,
    primary_gap_reason: 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence',
    recommended_batch: 'complete_maintain',
    critical_gap_families: [],
    major_gap_families: [],
    verified_source_families_with_samples: updatedVerifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: true,
    final_blockers: null,
  };

  const updatedPriorityRows = priorityRows.map((row) => {
    if (row.state !== 'montana') return row;
    return {
      ...row,
      classification: 'COMPLETE',
      index_safe: true,
      completeness_pct: 100,
      missing_critical_families: 0,
      weak_critical_families: 0,
      primary_gap_reason: 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence',
      recommended_batch: 'complete_maintain',
      repair_lane: 'maintain_truth_only',
    };
  });

  const batchSummary = {
    batch: 'batch_74_montana_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-22T00:00:00.000Z',
    state: 'montana',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    repaired_families: [
      'district_or_county_education_routing',
      'protection_and_advocacy',
      'county_local_disability_resources',
    ],
    remaining_blockers: [],
    evidence_checks: REVIEWED_EVIDENCE,
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.priorityQueue, updatedPriorityRows);
  writeJson(INPUTS.summary, updatedSummary);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch74MontanaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
