import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'minnesota_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'minnesota_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'minnesota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'minnesota_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'minnesota_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch178_minnesota_mdeorg_directory_root_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch178-minnesota-mdeorg-directory-root-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'minnesota-california-grade-audit-report-v2.md'),
  educationPacket: path.join(generatedDir, 'minnesota_district_or_county_education_routing_directory_contract_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'minnesota_county_local_disability_resources_radware_packet_v1.json'),
};

const PRIMARY_GAP_REASON =
  'official_mdeorg_directory_root_is_live_but_public_directory_contract_is_embedded_or_challenged_and_mn_dhs_local_office_family_is_stale_or_radware_challenged';

const EDUCATION_STATUS_REASON =
  'The Minnesota education blocker is now sharper: the official MDE-ORG root at `/MDE/about/SchOrg/` is live and explicitly says it is a searchable database for school, district, and education-related organization directories, but the exact embedded front-end it points to loads only as a JS bundle shell under `/mdeprod/groups/communications/documents/unzip/048426/index.html` with no static county/district export in bounded fetches. The adjacent official public search surfaces still fail to yield a county-grade contract: `findsch` resolves into a Radware challenge and `MDEAnalytics/Summary.jsp` is only a shell page without an exposed iframe/export contract in static HTML. Minnesota therefore still lacks a reviewed county-mapped district routing artifact, but the blocker is no longer just dead guessed paths.';

const EDUCATION_BLOCKER_EVIDENCE =
  'Reviewed 2026-06-22/2026-06-23 bounded official Minnesota MDE education surfaces. The live Special Education page links to the official Schools and Organizations (MDE-ORG) root at https://education.mn.gov/MDE/about/SchOrg/, and that page explicitly says MDE-ORG is a searchable database that includes Minnesota school, district, and education-related organization directories and can generate files from search parameters. However, the exact embedded bundle it references at https://education.mn.gov/mdeprod/groups/communications/documents/unzip/048426/index.html only loads as a JS shell in bounded fetches, while adjacent official public-search surfaces still do not yield a preserved county-grade contract: https://pub.education.mn.gov/findsch/ resolves into a Radware challenge and https://pub.education.mn.gov/MDEAnalytics/Summary.jsp is just a summary shell without an exposed iframe or export URL in static HTML. Minnesota therefore still lacks a reviewed county-to-district routing artifact, but the blocker is now correctly classified as a live official directory root whose usable query/export contract is embedded or challenge-protected.';

const EDUCATION_FAILURE_CODE =
  'official_mdeorg_directory_root_is_live_but_query_or_export_contract_is_embedded_or_challenged';
const EDUCATION_NEXT_ACTION =
  'browser_assisted_or_cached_capture_only_for_live_mdeorg_directory_contract';

const LESSON_HEADING =
  '### Live Directory Glossaries Can Hide The Real Query Contract In An Embedded Bundle';
const LESSON_BODY =
  '*   **Lesson:** If an official state directory page explicitly says it is a searchable database, do not keep chasing retired legacy paths. Minnesota MDE exposed a live `MDE-ORG` root, but the usable directory front-end was tucked into an embedded bundle while adjacent public search surfaces were Radware-challenged, so the right next lane became browser-assisted contract capture, not more guessed URL probes.';

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
    '# Minnesota California-Grade Audit Report v2',
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
    '- Minnesota remains `BLOCKED` and `index_safe=false`.',
    '- Education is still blocked, but the blocker is now more precise: the official MDE-ORG directory root is live, while the actual query/export contract remains embedded or challenge-protected instead of preserved as a county-grade artifact.',
    '- County-local is still blocked because the DHS county-and-tribal-office family still resolves to stale legacy URLs or Radware challenge surfaces in bounded low-token mode.',
    '- PACER support evidence is still real, but the current first-party pages plus the retired PTI-specific path family still do not preserve explicit PTI designation text.',
  ].join('\n') + '\n';
}

export function generateBatch178MinnesotaMdeorgDirectoryRootRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_live_mdeorg_directory_root_without_static_county_contract',
          status_reason: EDUCATION_STATUS_REASON,
        }
      : row
  );

  const updatedFailureRows = failureRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_BLOCKER_EVIDENCE }
      : row
  );

  const updatedVerifiedRows = verifiedRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_live_mdeorg_directory_root_without_static_county_contract',
          query_basis: 'Reviewed 2026-06-22/2026-06-23 the official Minnesota Special Education page, live MDE-ORG directory root, embedded directory bundle, and adjacent public search shells.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_BLOCKER_EVIDENCE,
        }
      : row
  );

  const updatedNextRows = nextRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: EDUCATION_NEXT_ACTION, evidence: EDUCATION_BLOCKER_EVIDENCE }
      : row
  );

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) =>
      row.family === 'district_or_county_education_routing'
        ? {
            ...row,
            failure_code: EDUCATION_FAILURE_CODE,
            evidence: EDUCATION_BLOCKER_EVIDENCE,
            next_action: EDUCATION_NEXT_ACTION,
          }
        : row
    ),
  };

  const educationPacket = {
    state: 'minnesota',
    state_code: 'MN',
    family: 'district_or_county_education_routing',
    repair_lane: 'browser_or_cached_capture_only',
    purpose: 'Deterministic packet for Minnesota education routing while the live official MDE-ORG contract is embedded or challenge-protected.',
    current_problem_metrics: {
      countyRowCount: 87,
      liveDirectoryRootAccessible: true,
      embeddedBundleMiswired: true,
      publicSearchChallengeProtected: true,
    },
    representative_sources: [
      'https://education.mn.gov/MDE/about/SchOrg/',
      'https://education.mn.gov/mdeprod/groups/communications/documents/unzip/048426/index.html',
      'https://pub.education.mn.gov/findsch/',
      'https://pub.education.mn.gov/MDEAnalytics/Summary.jsp',
      'https://pub.education.mn.gov/MDEAnalytics/Data.jsp',
      'https://pub.education.mn.gov/MdeOrgView/',
    ],
    exact_target_goals: [
      'reviewed first-party county-or-district export contract',
      'browser-readable MDE-ORG query results',
      'cached public search capture only if the first-party directory contract is preserved',
    ],
    packet_complete_when: 'Minnesota can reopen education only when the live MDE-ORG family yields a reviewed county-mapped district routing contract instead of an embedded shell or challenge page.',
  };

  const countyPacket = {
    state: 'minnesota',
    state_code: 'MN',
    family: 'county_local_disability_resources',
    repair_lane: 'browser_or_cached_capture_only',
    purpose: 'Deterministic packet for Minnesota county-local routing while the replatformed DHS county-and-tribal family is fronted by Radware captcha.',
    current_problem_metrics: {
      countyRowCount: 87,
      legacyJspStale: true,
      replacementFamilyLiveButCaptchaProtected: true,
      reviewedReplacementRoots: 2,
    },
    representative_sources: [
      'https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/',
      'https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/',
      'https://validate.perfdrive.com/',
    ],
    exact_target_goals: [
      'reviewed first-party county-or-tribal office contract',
      'browser-readable or cached county-and-tribal directory capture',
      'precise county-or-tribal coverage proof without reopening generic discovery',
    ],
    packet_complete_when: 'Minnesota can reopen county-local only when the live DHS replacement family yields a reviewed county-or-tribal directory contract instead of a Radware validation gate.',
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
    state: 'minnesota',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    education_blocker_sharpened: true,
    education_packet_created: true,
    county_packet_created: true,
    lessons_updated: lessonsUpdated,
    blocker_basis: 'live_mdeorg_root_plus_embedded_bundle_and_public_search_shell_audit',
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${report}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch178MinnesotaMdeorgDirectoryRootRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
