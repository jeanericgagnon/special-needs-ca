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
  failure: path.join(generatedDir, 'minnesota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'minnesota_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'minnesota_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'minnesota_district_or_county_education_routing_directory_contract_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch231_minnesota_mdeanalytics_instability_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch231-minnesota-mdeanalytics-instability-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'minnesota-california-grade-audit-report-v2.md'),
};

const FAMILY_STATUS = 'blocked_live_mdeorg_root_with_unstable_mdeanalytics_and_radware_protected_directory_routes';
const FAILURE_CODE = 'official_mdeorg_root_is_live_but_mdeanalytics_data_route_is_unstable_and_directory_routes_are_radware_protected';
const STATUS_REASON = 'The Minnesota education blocker is now narrower and more concrete: the official MDE-ORG glossary root at `/MdeOrgView/` is live and public, but the child routes do not yield a stable county-grade district routing contract. A bounded 2026-06-23 recheck showed the root glossary page loading normally with district, county, city, contact, and search route links in static HTML. The county, district, and contact routes still resolve to Radware captcha pages, while `MDEAnalytics/Data.jsp` is unstable: one bounded probe returned a live `Data Reports and Analytics` shell, but a second exact probe on the same route flipped to `validate.perfdrive.com` / `Radware Captcha Page`. Minnesota therefore still lacks a reproducible reviewed county-mapped district routing artifact, but the blocker is now precisely live root plus unstable analytics shell plus route-level Radware protection.';
const EVIDENCE = 'Reviewed 2026-06-23 bounded official Minnesota MDE education surfaces at the live MDE-ORG family. The glossary root https://pub.education.mn.gov/MdeOrgView/ loads publicly with title `MDE Organization Reference Glossary` and preserves static first-party links to `/MdeOrgView/search/index`, `/MdeOrgView/search/searchContacts`, `/MdeOrgView/districts/index`, `/MdeOrgView/districts/cities`, `/MdeOrgView/reference/county`, `/MdeOrgView/contact/contactTypeList`, and `/MdeOrgView/home/howToUse`. Fresh bounded probes still showed the county, district, and contact routes resolving to `Radware Captcha Page` shells with route-specific `You reached this page when trying to access` text. A further bounded check on https://pub.education.mn.gov/MDEAnalytics/Data.jsp showed unstable behavior: one exact probe returned HTTP 200 on the public route with title `Data Reports and Analytics`, but a second exact probe on the same route flipped to validate.perfdrive.com with title `Radware Captcha Page`. The older MDE-ORG description page at https://education.mn.gov/MDE/about/SchOrg/ remains useful because it explicitly describes MDE-ORG as a searchable database that can generate files from search parameters, but the live public contract we can actually verify in low-token mode is now: root glossary page visible, directory child routes challenge-protected, and analytics data route unstable. Minnesota therefore still lacks a reproducible county-grade district routing contract.';
const NEXT_ACTION = 'hold_blocked_until_reviewed_first_party_mdeorg_route_capture_or_stable_export_contract_exists';

const LESSON_HEADING = '### Flapping Official Child Routes Still Count As Blocked';
const LESSON_BODY = '*   **Lesson:** If an official child route alternates between a live shell and a captcha page across bounded probes, keep it blocked unless it consistently exposes the needed local contract. Minnesota `MDEAnalytics/Data.jsp` briefly returned a `Data Reports and Analytics` shell, then flipped back to Radware on the same exact route.';

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
    '- Minnesota remains BLOCKED and index_safe=false.',
    '- district_or_county_education_routing remains blocked because the public MDE-ORG root is live, but the county/district/contact routes still challenge and the analytics data route is unstable across exact bounded probes.',
    '- county_local_disability_resources remains blocked on the separate DHS county-and-tribal captcha family.',
    '- parent_training_information_center remains below standard because current PACER first-party pages still do not preserve explicit PTI designation text.',
  ].join('\n') + '\n';
}

export function generateBatch231MinnesotaMdeanalyticsInstabilityRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          query_basis: 'Reviewed 2026-06-23 the official Minnesota MDE-ORG glossary root, challenged child routes, and the unstable MDEAnalytics data route.',
          sample_count: 5,
          samples: [
            {
              sample_name: 'Minnesota MDE-ORG glossary root',
              source_url: 'https://pub.education.mn.gov/MdeOrgView/',
              final_url: 'https://pub.education.mn.gov/MdeOrgView/',
              verification_status: 'verified',
              source_type: 'official_directory_root',
              source_table: 'batch231_minnesota_mdeanalytics_instability_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public glossary root loads with title `MDE Organization Reference Glossary` and preserves direct links to district, county, contact, and search routes.',
            },
            {
              sample_name: 'Minnesota MDE-ORG district route challenge',
              source_url: 'https://pub.education.mn.gov/MdeOrgView/districts/index',
              final_url: 'https://validate.perfdrive.com/.../MdeOrgView/districts/index',
              verification_status: 'blocked',
              source_type: 'official_directory_child_route_radware',
              source_table: 'batch231_minnesota_mdeanalytics_instability_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The district index child route returns the `Radware Captcha Page` shell instead of a reviewable district directory contract.',
            },
            {
              sample_name: 'Minnesota MDE-ORG county route challenge',
              source_url: 'https://pub.education.mn.gov/MdeOrgView/reference/county',
              final_url: 'https://validate.perfdrive.com/.../MdeOrgView/reference/county',
              verification_status: 'blocked',
              source_type: 'official_directory_child_route_radware',
              source_table: 'batch231_minnesota_mdeanalytics_instability_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The county reference route returns the same Radware captcha shell, so the official county lookup contract is not reviewable in low-token mode.',
            },
            {
              sample_name: 'Minnesota MDE-ORG contact route challenge',
              source_url: 'https://pub.education.mn.gov/MdeOrgView/search/searchContacts',
              final_url: 'https://validate.perfdrive.com/.../MdeOrgView/search/searchContacts',
              verification_status: 'blocked',
              source_type: 'official_directory_child_route_radware',
              source_table: 'batch231_minnesota_mdeanalytics_instability_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The contact-search route also lands on the same Radware captcha shell, blocking direct district-contact extraction.',
            },
            {
              sample_name: 'Minnesota MDEAnalytics Data route instability',
              source_url: 'https://pub.education.mn.gov/MDEAnalytics/Data.jsp',
              final_url: 'https://validate.perfdrive.com/.../MDEAnalytics/Data.jsp',
              verification_status: 'blocked',
              source_type: 'official_analytics_route_unstable',
              source_table: 'batch231_minnesota_mdeanalytics_instability_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'One bounded probe returned a live `Data Reports and Analytics` shell, but a second exact probe on the same route flipped to `Radware Captcha Page`, so the analytics contract is not stable enough to count.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'official_mdeorg_root_has_unstable_analytics_and_radware_protected_directory_routes_plus_mn_dhs_local_office_family_is_radware_challenged',
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
  };

  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...(packet.current_problem_metrics || {}),
      glossaryRootPublic: true,
      countyRoutePublic: false,
      districtRoutePublic: false,
      mdeAnalyticsDataRouteFlaps: true,
    },
    representative_sources: Array.from(new Set([
      ...(packet.representative_sources || []),
      'https://pub.education.mn.gov/MDEAnalytics/Data.jsp',
    ])),
    analytics_contract: {
      data_route: 'https://pub.education.mn.gov/MDEAnalytics/Data.jsp',
      observed_states: ['live_data_reports_and_analytics_shell', 'radware_captcha'],
      stable_county_or_district_export: false,
    },
    packet_complete_when: 'Minnesota can reopen education only when the live MDE-ORG family yields a consistently reviewable county-mapped district routing contract or stable export instead of challenged child routes and a flapping analytics shell.',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch231_minnesota_mdeanalytics_instability_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'minnesota',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    glossary_root_public: true,
    directory_child_routes_public: false,
    analytics_route_flaps: true,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 231 Minnesota MDEAnalytics Instability Refresh Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- family updated: district_or_county_education_routing',
    '',
    '## What changed',
    '',
    '- Kept the public MDE-ORG glossary root as real official evidence.',
    '- Confirmed the district, county, and contact child routes still land on Radware captcha pages.',
    '- Corrected the education blocker to reflect that `MDEAnalytics/Data.jsp` is unstable rather than simply absent: one bounded probe returned a live `Data Reports and Analytics` shell, while a second exact probe on the same route flipped to `Radware Captcha Page`.',
    '',
    '## Result',
    '',
    '- Minnesota remains BLOCKED and index_safe=false.',
    '- The education lane is now more precise: live official root, challenged directory routes, unstable analytics route, and still no reproducible county-grade contract.',
  ].join('\n') + '\n';

  fs.writeFileSync(OUTPUTS.batchReport, batchReport);
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch231MinnesotaMdeanalyticsInstabilityRefreshV1();
}
