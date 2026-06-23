import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'nebraska_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'nebraska_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'nebraska_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'nebraska_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'nebraska_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch173_nebraska_open_config_blocker_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch173-nebraska-open-config-blocker-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'nebraska-california-grade-audit-report-v2.md'),
};

const EDUCATION_FAILURE =
  'live_nde_host_accessible_but_no_county_or_esu_routing_contract_reviewed';
const EDUCATION_REASON =
  'Reviewed 2026-06-23 bounded browser-style probes on the live official NDE host. The Special Education page and Contact Us / SPED Staff Directory page are publicly reachable again, but they still preserve statewide dispute/staff content only. The live `Service Agencies/Providers` page is also public, yet its visible contract is a provider application workflow rather than an ESU or county routing table. The only clearly local-looking outbound program link from the SPED stack was the single ESU 9 Deaf or Hard of Hearing program page, which is not a statewide county-to-ESU or county-to-district routing contract. No reviewed district-owned, ESU-wide, or county-mapped education-routing surface is preserved on disk yet.';
const EDUCATION_NEXT =
  'hold_blocked_until_live_official_county_to_esu_or_district_contract_is_reviewed';

const COUNTY_FAILURE =
  'official_public_office_experiencebuilder_config_opens_but_public_layer_only_covers_37_counties';
const COUNTY_REASON =
  'Reviewed 2026-06-23 the official Nebraska Public Office Location ExperienceBuilder config and backing web map directly. The public app data is open and points to the official web map plus a public office feature layer, but that layer contains only 42 office rows and 37 distinct USER_County values while Nebraska has 93 counties. The county-boundary layer carries only county geometry fields and no county-to-office assignment. Nebraska therefore still lacks a reviewed official service-area contract for the remaining counties.';
const COUNTY_NEXT =
  'hold_blocked_until_official_service_area_or_full_county_office_contract_is_reviewed';

const LESSON_HEADING =
  '### Open ExperienceBuilder Configs Can Prove A County Layer Is Still Incomplete';
const LESSON_BODY =
  '*   **Lesson:** If an official locator app opens but the visible page is only an `Experience` shell, check the public ExperienceBuilder item data before giving up. Nebraska’s config exposed the exact web map and office layer URLs, which let us prove the official office layer only covered 37 counties. That saved more blind probing while still keeping the county-office family blocked.';
const EDUCATION_LESSON_HEADING =
  '### Service-Agency Application Pages Do Not Count As ESU Or County Routing';
const EDUCATION_LESSON_BODY =
  '*   **Lesson:** If a live state special-education page exposes a `Service Agencies/Providers` leaf, inspect whether it is a public routing table or just a provider application workflow. Nebraska’s page stayed statewide and application-oriented, so it could not replace a missing county-to-ESU education contract.';

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
  const additions = [];
  if (!current.includes(LESSON_HEADING)) additions.push(`${LESSON_HEADING}\n${LESSON_BODY}`);
  if (!current.includes(EDUCATION_LESSON_HEADING)) additions.push(`${EDUCATION_LESSON_HEADING}\n${EDUCATION_LESSON_BODY}`);
  if (!additions.length) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${additions.join('\n\n')}\n`);
  return true;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Nebraska California-Grade Truth Refresh v2',
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
    '- Nebraska remains `BLOCKED` and `index_safe=false`.',
    '- The old statewide-only Nebraska blockers are now sharper and tied to current official evidence rather than stale assumptions.',
    '- Education remains blocked because the live NDE SPED host is reachable but still does not preserve a reviewed county-to-ESU or district-owned routing contract on disk, and the public Service Agencies/Providers leaf is application-oriented rather than local-routing evidence.',
    '- County/local disability resources remain blocked because the open official DHHS office app config proves the public office layer only names 37 counties and the county boundary layer has no office assignment fields for the remaining 56 counties.',
  ].join('\n') + '\n';
}

export function generateBatch173NebraskaOpenConfigBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_live_nde_host_without_county_or_esu_contract',
        status_reason: EDUCATION_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_public_office_layer_only_37_counties',
        status_reason: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: EDUCATION_FAILURE,
        evidence: EDUCATION_REASON,
        next_action: EDUCATION_NEXT,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: COUNTY_FAILURE,
        evidence: COUNTY_REASON,
        next_action: COUNTY_NEXT,
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_live_nde_host_without_county_or_esu_contract',
        query_basis: 'Reviewed 2026-06-23 bounded browser-style probes on the live NDE special-education stack, the SPED staff directory page, and the live Service Agencies/Providers page.',
        blocker_code: EDUCATION_FAILURE,
        blocker_evidence: EDUCATION_REASON,
        sample_count: 4,
        samples: [
          {
            sample_name: 'Nebraska Special Education',
            source_url: 'https://www.education.ne.gov/sped/',
            final_url: 'https://www.education.ne.gov/sped/',
            verification_status: 'reviewed',
            source_type: 'official_statewide_special_education_root',
            source_table: 'batch173_nebraska_open_config_blocker_refresh',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The live NDE Special Education page is publicly reachable with browser-style headers, but it still preserves statewide guidance and dispute paths rather than a county-mapped local routing contract.',
          },
          {
            sample_name: 'Contact Us / SPED Staff Directory',
            source_url: 'https://www.education.ne.gov/sped/contact-us/',
            final_url: 'https://www.education.ne.gov/sped/contact-us/',
            verification_status: 'reviewed',
            source_type: 'official_statewide_staff_directory',
            source_table: 'batch173_nebraska_open_config_blocker_refresh',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The live SPED contact page is a statewide staff directory and does not preserve a county-to-ESU or county-to-district routing table.',
          },
          {
            sample_name: 'Service Agencies/Providers',
            source_url: 'https://www.education.ne.gov/sped/service-agencies/',
            final_url: 'https://www.education.ne.gov/sped/service-agencies/',
            verification_status: 'reviewed',
            source_type: 'official_statewide_provider_application_page',
            source_table: 'batch173_nebraska_open_config_blocker_refresh',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The live Service Agencies/Providers page stays public on the NDE host, but its visible contract is a Service Agency/Provider Application workflow and paraprofessional agreement resources rather than a county-to-ESU routing table.',
          },
          {
            sample_name: 'ESU 9 program link from SPED stack',
            source_url: 'https://www.esu9.org/nebraskaregionalprograms',
            verification_status: 'reviewed',
            source_type: 'single_external_regional_program_link',
            source_table: 'batch173_nebraska_open_config_blocker_refresh',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The only clearly local-looking outbound program link found on the official SPED stack pointed to one ESU 9 regional program, which is not a statewide county routing contract.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_public_office_layer_only_37_counties',
        query_basis: 'Reviewed 2026-06-23 the public ExperienceBuilder item data, web map, county boundary layer, and office feature layer for the Nebraska Public Office Location app.',
        blocker_code: COUNTY_FAILURE,
        blocker_evidence: COUNTY_REASON,
        sample_count: 4,
        samples: [
          {
            sample_name: 'Public Assistance Offices page',
            source_url: 'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
            final_url: 'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
            verification_status: 'reviewed',
            source_type: 'official_office_navigation_root',
            source_table: 'batch173_nebraska_open_config_blocker_refresh',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The official Public Assistance Offices page links the Nebraska Public Office Location Lookup but does not itself preserve county-office rows.',
          },
          {
            sample_name: 'Nebraska Public Office Location app config',
            source_url: 'https://gis.ne.gov/portal/apps/experiencebuilder/experience/?id=76a6ec0ec7c449448c95d00f59002457',
            final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
            verification_status: 'reviewed',
            source_type: 'official_experiencebuilder_config',
            source_table: 'batch173_nebraska_open_config_blocker_refresh',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The open ExperienceBuilder config points to the official Nebraska DHHS Public Assistance Office Location web map item and exposes the backing office and county layers.',
          },
          {
            sample_name: 'Public Assistance Office layer',
            source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0',
            final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=json',
            verification_status: 'reviewed',
            source_type: 'official_public_office_layer',
            source_table: 'batch173_nebraska_open_config_blocker_refresh',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The official office layer exposes fields such as USER_County, USER_Address_1, USER_City, and USER_Tel, but only 42 office rows and 37 distinct office counties.',
          },
          {
            sample_name: 'County Boundary layer',
            source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1',
            final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=json',
            verification_status: 'reviewed',
            source_type: 'official_county_boundary_layer',
            source_table: 'batch173_nebraska_open_config_blocker_refresh',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The county layer covers Nebraska counties geographically but preserves only county boundary fields like NAME, COUNTYFP, and GEOID, not county-to-office assignment fields.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_FAILURE, next_action: EDUCATION_NEXT, evidence: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE, next_action: COUNTY_NEXT, evidence: COUNTY_REASON };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'live_nde_host_without_county_or_esu_contract_and_public_office_layer_only_37_counties',
    critical_gap_families: ['district_or_county_education_routing', 'county_local_disability_resources'],
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: EDUCATION_FAILURE,
        evidence: EDUCATION_REASON,
        next_action: EDUCATION_NEXT,
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: COUNTY_FAILURE,
        evidence: COUNTY_REASON,
        next_action: COUNTY_NEXT,
      },
    ],
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    state: 'nebraska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_families: ['district_or_county_education_routing', 'county_local_disability_resources'],
    district_routing_blocker: EDUCATION_FAILURE,
    county_local_blocker: COUNTY_FAILURE,
    office_layer_rows: 42,
    office_layer_distinct_counties: 37,
    county_total: 93,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 173 Nebraska Open Config Blocker Refresh Report v1',
      '',
      'This pass does not clear Nebraska. It replaces softer Nebraska blockers with current official evidence from the live NDE host and the open Nebraska DHHS ExperienceBuilder / ArcGIS office stack.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- office_layer_rows: ${batchSummary.office_layer_rows}`,
      `- office_layer_distinct_counties: ${batchSummary.office_layer_distinct_counties}`,
      `- county_total: ${batchSummary.county_total}`,
      `- refined_families: ${batchSummary.refined_families.join(', ')}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateBatch173NebraskaOpenConfigBlockerRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
