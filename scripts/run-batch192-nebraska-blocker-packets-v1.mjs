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
  educationPacket: path.join(generatedDir, 'nebraska_district_or_county_education_routing_local_contract_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'nebraska_county_local_disability_resources_service_area_packet_v1.json'),
  batchSummary: path.join(generatedDir, 'batch192_nebraska_blocker_packets_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch192-nebraska-blocker-packets-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'nebraska-california-grade-audit-report-v2.md'),
};

const EDUCATION_REASON =
  'Reviewed 2026-06-23 bounded browser-style probes on the live official NDE host. The Special Education page and Contact Us / SPED Staff Directory page are publicly reachable again and now preserve one additional exact official leaf: `SPED Contact List-Directory by Topic` on the NDE domain. But that directory is still statewide by staff topic rather than county-to-ESU or county-to-district routing, and the only clearly local-looking outbound program page remains the single ESU 9 Deaf or Hard of Hearing page. No reviewed district-owned, ESU-wide, or county-mapped education-routing surface is preserved on disk yet.';

const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-23 bounded browser-style probes on the live official NDE Special Education and SPED staff-directory pages. The host is publicly reachable and now exposes one more exact official leaf at https://www.education.ne.gov/wp-content/uploads/2025/11/SPED-Calling-Tree-January-2026.pdf titled `SPED Contact List-Directory by Topic`, plus the previously reviewed ESU 9 Deaf or Hard of Hearing program page. However, the topic directory is statewide by staff function and does not publish county-to-ESU assignments, district-owned special-education routing, or an ESU service-area contract. The ESU 9 page is still only one regional program page, not a statewide local-routing contract. Nebraska therefore remains blocked because the live NDE SPED lane still lacks reviewed county-mapped education routing despite the now-live official leaves.';

const COUNTY_REASON =
  'Reviewed 2026-06-23 the official Nebraska Public Office Location ExperienceBuilder config and backing web map directly. The public app data is open and points to the official web map plus a public office feature layer, but that layer contains only 42 office rows and 37 distinct USER_County values while Nebraska has 93 counties. The county-boundary layer carries only county geometry fields and no county-to-office assignment. Nebraska therefore still lacks a reviewed official service-area contract for the remaining counties.';

const COUNTY_EVIDENCE = COUNTY_REASON;

const LESSON_HEADING =
  '### State Packetize Open-But-Incomplete Official Apps Once The Exact Layers Are Known';
const LESSON_BODY =
  '*   **Lesson:** Once an official map or directory stack is narrowed to exact public layers and exact missing fields, save that as a blocker packet instead of re-probing the same app. Nebraska’s NDE and DHHS lanes were both live enough to identify exact next roots, but still incomplete for county-grade proof.';

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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
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
    '- Education remains blocked because the live NDE SPED host now preserves deeper official leaves, including a topic directory PDF, but still no reviewed county-to-ESU or district-owned routing contract.',
    '- County/local disability resources remain blocked because the open official DHHS office app config still proves the public office layer only names 37 counties and the county boundary layer has no office-assignment fields for the remaining counties.',
  ].join('\n') + '\n';
}

export function generateBatch192NebraskaBlockerPacketsV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        query_basis: 'Reviewed the live NDE Special Education page, SPED staff directory, topic-directory PDF, and the single ESU 9 local program leaf; saved as a deterministic local-contract blocker packet.',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        query_basis: 'Reviewed the public ExperienceBuilder item data, web map, county boundary layer, and office feature layer for the Nebraska Public Office Location app; saved as a deterministic service-area blocker packet.',
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    final_blockers: (summary.final_blockers || []).map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return { ...row, evidence: EDUCATION_EVIDENCE };
      }
      if (row.family === 'county_local_disability_resources') {
        return { ...row, evidence: COUNTY_EVIDENCE };
      }
      return row;
    }),
  };

  const educationPacket = {
    state: 'nebraska',
    state_code: 'NE',
    family: 'district_or_county_education_routing',
    repair_lane: 'browser_or_cached_capture_only',
    purpose: 'Deterministic packet for Nebraska education routing while the live NDE SPED stack preserves statewide leaves but no county-to-ESU or county-to-district routing contract.',
    current_problem_metrics: {
      countyRowCount: 93,
      specialEducationHostLive: true,
      topicDirectoryPdfLive: true,
      localContractReviewed: false,
      reviewedLocalLeafCount: 1,
    },
    representative_sources: [
      'https://www.education.ne.gov/sped/',
      'https://www.education.ne.gov/sped/contact-us/',
      'https://www.education.ne.gov/sped/service-agencies/',
      'https://www.education.ne.gov/wp-content/uploads/2025/11/SPED-Calling-Tree-January-2026.pdf',
      'https://esu9.org/programs-services/deaf-hard-of-hearing/',
    ],
    exact_target_goals: [
      'county-to-ESU service-area contract',
      'district-owned special-education routing leaves',
      'reviewed official ESU-wide directory or county-mapped export',
    ],
    packet_complete_when: 'Nebraska can reopen education only when a reviewed official county-to-ESU or county-to-district routing contract is preserved on disk.',
  };

  const countyPacket = {
    state: 'nebraska',
    state_code: 'NE',
    family: 'county_local_disability_resources',
    repair_lane: 'service_area_contract_audit_only',
    purpose: 'Deterministic packet for Nebraska county-local routing while the open official office app exposes only partial county coverage and no county-to-office assignment layer.',
    current_problem_metrics: {
      countyTotal: 93,
      officeLayerRows: 42,
      officeLayerDistinctCounties: 37,
      countyBoundaryLayerHasAssignmentFields: false,
      officialConfigOpen: true,
    },
    representative_sources: [
      'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
      'https://gis.ne.gov/portal/apps/experiencebuilder/experience/?id=76a6ec0ec7c449448c95d00f59002457',
      'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
      'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=json',
      'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=json',
    ],
    exact_target_goals: [
      'official service-area layer or assignment table',
      'full county office contract',
      'county-to-office join fields on a reviewed official layer',
    ],
    packet_complete_when: 'Nebraska can reopen county-local only when an official full-county office contract or service-area assignment layer is preserved on disk.',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(OUTPUTS.educationPacket, educationPacket);
  writeJson(OUTPUTS.countyPacket, countyPacket);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const report = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  const batchSummary = {
    state: 'nebraska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    education_packet_created: true,
    county_packet_created: true,
    lessons_updated: lessonsUpdated,
    blocker_basis: 'live_sped_topic_directory_plus_open_office_config_packetization',
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${report}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch192NebraskaBlockerPacketsV1();
  console.log(JSON.stringify(result, null, 2));
}
