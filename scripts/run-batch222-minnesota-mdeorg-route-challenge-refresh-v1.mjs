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
  packet: path.join(generatedDir, 'minnesota_district_or_county_education_routing_directory_contract_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch222_minnesota_mdeorg_route_challenge_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch222-minnesota-mdeorg-route-challenge-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'minnesota-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'official_mdeorg_glossary_root_is_live_but_all_actionable_routes_are_radware_challenged';
const STATUS_REASON = 'The Minnesota education blocker is now narrower and more concrete: the official MDE-ORG glossary root at `/MdeOrgView/` is live and public, but every actionable route needed for county-grade district routing is currently challenge-protected. A bounded 2026-06-23 recheck showed the root glossary page loading normally with district, county, city, contact, and search route links in static HTML, while `/MdeOrgView/search/index`, `/MdeOrgView/search/searchContacts`, `/MdeOrgView/districts/index`, `/MdeOrgView/districts/cities`, `/MdeOrgView/reference/county`, `/MdeOrgView/contact/contactTypeList`, and `/MdeOrgView/home/howToUse` each resolved to a Radware captcha page. Minnesota therefore still lacks a reviewed county-mapped district routing artifact, but the blocker is now precisely the live glossary root plus route-level Radware protection rather than a vague dead-directory assumption.';
const EVIDENCE = 'Reviewed 2026-06-23 bounded official Minnesota MDE education surfaces at the live MDE-ORG family. The glossary root https://pub.education.mn.gov/MdeOrgView/ loads publicly with title `MDE Organization Reference Glossary` and preserves static first-party links to `/MdeOrgView/search/index`, `/MdeOrgView/search/searchContacts`, `/MdeOrgView/districts/index`, `/MdeOrgView/districts/cities`, `/MdeOrgView/reference/county`, `/MdeOrgView/contact/contactTypeList`, and `/MdeOrgView/home/howToUse`. But a fresh bounded probe showed each one of those actionable routes returning the same `Radware Captcha Page` shell with route-specific `You reached this page when trying to access` text. The older MDE-ORG description page at https://education.mn.gov/MDE/about/SchOrg/ remains useful because it explicitly describes MDE-ORG as a searchable database that can generate files from search parameters, but the live public contract we can actually verify in low-token mode is now: root glossary page visible, all actionable query/county/contact routes challenge-protected. Minnesota therefore still lacks a reviewable county-grade district routing contract.';
const NEXT_ACTION = 'hold_blocked_until_reviewed_first_party_mdeorg_route_capture_or_export_contract_exists';

const LESSON_HEADING = '### A Live Glossary Root Does Not Mean The Directory Routes Are Reachable';
const LESSON_BODY = '*   **Lesson:** If an official directory root loads publicly and lists rich child routes in static HTML, probe the child routes directly before upgrading the family. Minnesota `MdeOrgView` exposed district, county, contact, and search links on the root page, but every actionable child route still landed on the same Radware captcha shell.';

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
    '- The district_or_county_education_routing blocker is sharper: the public MDE-ORG glossary root is live, but every actionable district, county, contact, and search child route we tested is Radware-protected.',
    '- county_local_disability_resources remains blocked on the separate DHS county-and-tribal captcha family.',
    '- parent_training_information_center remains below standard because current PACER first-party pages still do not preserve explicit PTI designation text.',
  ].join('\n') + '\n';
}

export function generateBatch222MinnesotaMdeorgRouteChallengeRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const packet = readJson(INPUTS.packet);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_live_mdeorg_glossary_root_with_radware_protected_child_routes', status_reason: STATUS_REASON }
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
          family_status: 'blocked_live_mdeorg_glossary_root_with_radware_protected_child_routes',
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          query_basis: 'Reviewed 2026-06-23 the official Minnesota MDE-ORG glossary root and direct child routes for search, districts, county, contacts, and how-to pages.',
          sample_count: 4,
          samples: [
            {
              sample_name: 'Minnesota MDE-ORG glossary root',
              source_url: 'https://pub.education.mn.gov/MdeOrgView/',
              final_url: 'https://pub.education.mn.gov/MdeOrgView/',
              verification_status: 'verified',
              source_type: 'official_directory_root',
              source_table: 'batch222_minnesota_mdeorg_route_challenge_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public glossary root loads with title `MDE Organization Reference Glossary` and preserves direct links to district, county, contact, and search routes.',
            },
            {
              sample_name: 'Minnesota MDE-ORG district route challenge',
              source_url: 'https://pub.education.mn.gov/MdeOrgView/districts/index',
              final_url: 'https://pub.education.mn.gov/MdeOrgView/districts/index',
              verification_status: 'blocked',
              source_type: 'official_directory_child_route_radware',
              source_table: 'batch222_minnesota_mdeorg_route_challenge_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The district index child route returns the `Radware Captcha Page` shell instead of a reviewable district directory contract.',
            },
            {
              sample_name: 'Minnesota MDE-ORG county route challenge',
              source_url: 'https://pub.education.mn.gov/MdeOrgView/reference/county',
              final_url: 'https://pub.education.mn.gov/MdeOrgView/reference/county',
              verification_status: 'blocked',
              source_type: 'official_directory_child_route_radware',
              source_table: 'batch222_minnesota_mdeorg_route_challenge_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The county reference route returns the same Radware captcha shell, so the official county lookup contract is not reviewable in low-token mode.',
            },
            {
              sample_name: 'Minnesota MDE-ORG contact route challenge',
              source_url: 'https://pub.education.mn.gov/MdeOrgView/search/searchContacts',
              final_url: 'https://pub.education.mn.gov/MdeOrgView/search/searchContacts',
              verification_status: 'blocked',
              source_type: 'official_directory_child_route_radware',
              source_table: 'batch222_minnesota_mdeorg_route_challenge_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The contact-search route also lands on the same Radware captcha shell, blocking direct district-contact extraction.',
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
      liveGlossaryRootAccessible: true,
      directChildRoutesRadwareProtected: true,
      staticChildRouteLinksVisible: true,
    },
    representative_sources: Array.from(new Set([
      ...(packet.representative_sources || []),
      'https://pub.education.mn.gov/MdeOrgView/',
      'https://pub.education.mn.gov/MdeOrgView/search/index',
      'https://pub.education.mn.gov/MdeOrgView/search/searchContacts',
      'https://pub.education.mn.gov/MdeOrgView/districts/index',
      'https://pub.education.mn.gov/MdeOrgView/districts/cities',
      'https://pub.education.mn.gov/MdeOrgView/reference/county',
      'https://pub.education.mn.gov/MdeOrgView/contact/contactTypeList',
      'https://pub.education.mn.gov/MdeOrgView/home/howToUse',
    ])),
    packet_complete_when: 'Minnesota can reopen education only when the live MDE-ORG glossary family yields a reviewed first-party district/county/contact contract instead of a public root page whose actionable child routes are still Radware-protected.',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch222_minnesota_mdeorg_route_challenge_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'minnesota',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    live_glossary_root_accessible: true,
    direct_child_routes_radware_protected: true,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 222 Minnesota MDE-ORG Route Challenge Refresh Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: district_or_county_education_routing',
    `- failure_code: ${FAILURE_CODE}`,
    '',
    '## Evidence',
    '',
    `- ${EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Kept Minnesota BLOCKED.',
    '- Confirmed the exact public MDE-ORG glossary root is live and useful as a first-party discovery surface.',
    '- Confirmed the actionable district, county, contact, and search child routes are all Radware-protected in the low-token lane.',
    '- Reclassified the blocker from vague embedded-directory trouble to a route-level official captcha contract.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch222MinnesotaMdeorgRouteChallengeRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
