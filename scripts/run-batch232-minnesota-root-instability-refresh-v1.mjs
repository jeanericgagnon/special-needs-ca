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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch232_minnesota_root_instability_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch232-minnesota-root-instability-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'minnesota-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'mdeorg_root_and_analytics_routes_flap_to_radware_plus_mn_dhs_local_office_family_is_radware_challenged';
const DISTRICT_FAMILY_STATUS = 'blocked_mdeorg_root_and_analytics_routes_flap_to_radware_without_stable_county_contract';
const DISTRICT_FAILURE_CODE = 'official_mdeorg_root_itself_now_flaps_to_radware_and_no_stable_export_contract_exists';
const DISTRICT_STATUS_REASON = 'The Minnesota education blocker is now tighter and more current: exact bounded probes no longer support treating the MDE-ORG glossary root as a stable public entrypoint. A fresh 2026-06-23 exact fetch of `https://pub.education.mn.gov/MdeOrgView/` returned the `Radware Captcha Page` title, while a separate bounded session-backed probe reached the same root with HTTP 200 before the child analytics route flipped to `validate.perfdrive.com`. The district, county, and contact routes remain Radware-protected, and `MDEAnalytics/Data.jsp` still resolves into the same captcha family under exact recheck. Minnesota therefore still lacks a reproducible county-grade district routing contract, and the live blocker is now root instability plus route-level Radware protection rather than a stable public glossary root.';
const DISTRICT_EVIDENCE = 'Reviewed 2026-06-23 bounded official Minnesota MDE education surfaces at the MDE-ORG family. A fresh exact fetch of https://pub.education.mn.gov/MdeOrgView/ returned title `Radware Captcha Page`, which is stronger blocker evidence than the prior assumption that the glossary root stayed stably public. A separate bounded session-backed probe still reached the same root with HTTP 200, but the child analytics route at https://pub.education.mn.gov/MDEAnalytics/Data.jsp immediately flipped to validate.perfdrive.com with title `Radware Captcha Page`, and the district, county, and contact routes remain challenge-protected. The older MDE-ORG description page at https://education.mn.gov/MDE/about/SchOrg/ still describes MDE-ORG as a searchable database that can generate files from search parameters, but the live first-party contract we can actually verify in low-token mode is now: root flaps between public and captcha responses, child routes challenge, and no stable county-grade export or directory capture is reproducible.';
const DISTRICT_NEXT_ACTION = 'hold_blocked_until_reviewed_first_party_mdeorg_route_capture_or_stable_export_contract_exists';

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

function updateLessons(filePath) {
  let text = fs.readFileSync(filePath, 'utf8');
  const oldLesson = '*   **Lesson:** If an official state directory page explicitly says it is a searchable database, do not keep chasing retired legacy paths. Minnesota MDE exposed a live `MDE-ORG` root, but the usable directory front-end was tucked into an embedded bundle while adjacent public search surfaces were Radware-challenged, so the right next lane became browser-assisted contract capture, not more guessed URL probes.';
  const newLesson = '*   **Lesson:** If a first-party directory root once looked public but later exact probes flip the root itself into Radware, downgrade that root from reusable evidence and stop treating its child links as stable scrape entrypoints. Minnesota `MDE-ORG` moved from a seemingly public glossary root to a flapping root-plus-child-route captcha family, so the right next lane stayed browser-assisted capture or a stable export contract, not more guessed URL probes.';
  if (text.includes(oldLesson)) {
    text = text.replace(oldLesson, newLesson);
  } else if (!text.includes(newLesson)) {
    text = `${text.trimEnd()}\n\n### Flapping Directory Roots Must Be Downgraded, Not Reused\n${newLesson}\n`;
  }
  fs.writeFileSync(filePath, text);
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
    '- district_or_county_education_routing remains blocked because exact bounded rechecks now show the MDE-ORG root itself flapping into Radware, while the child routes and analytics lane still do not yield a stable county-grade contract.',
    '- county_local_disability_resources remains blocked on the separate DHS county-and-tribal captcha family.',
    '- parent_training_information_center remains below standard because current PACER first-party pages still do not preserve explicit PTI designation text.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 232 Minnesota Root Instability Refresh Report v1',
    '',
    '- state: minnesota',
    '- refined_family: district_or_county_education_routing',
    '- classification: BLOCKED',
    '- index_safe: false',
    '',
    '## What changed',
    '',
    '- Rechecked the exact MDE-ORG glossary root instead of relying on the earlier saved assumption that it remained stably public.',
    '- Confirmed the glossary root itself can now return a `Radware Captcha Page` title under exact bounded fetches.',
    '- Preserved the stronger blocker: root instability plus challenge-protected district/county/contact routes plus unstable analytics route.',
  ].join('\n') + '\n';
}

export function generateBatch232MinnesotaRootInstabilityRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: DISTRICT_FAILURE_CODE, evidence: DISTRICT_EVIDENCE, next_action: DISTRICT_NEXT_ACTION }
        : row
    )),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: DISTRICT_FAMILY_STATUS, status_reason: DISTRICT_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: DISTRICT_FAILURE_CODE, evidence: DISTRICT_EVIDENCE, next_action: DISTRICT_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: DISTRICT_FAMILY_STATUS,
          blocker_code: DISTRICT_FAILURE_CODE,
          blocker_evidence: DISTRICT_EVIDENCE,
          query_basis: 'Reviewed 2026-06-23 exact MDE-ORG root instability plus the challenged district/county/contact routes and the analytics route that still flips into Radware.',
          samples: [
            {
              sample_name: 'Minnesota MDE-ORG root instability',
              source_url: 'https://pub.education.mn.gov/MdeOrgView/',
              final_url: 'https://validate.perfdrive.com/.../MdeOrgView/',
              verification_status: 'blocked',
              source_type: 'official_directory_root_flapping_radware',
              source_table: 'batch232_minnesota_root_instability_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A fresh exact fetch of the official MDE-ORG root returned title `Radware Captcha Page`, so the root itself is no longer a stable public glossary entrypoint.',
            },
            {
              sample_name: 'Minnesota MDE-ORG district route challenge',
              source_url: 'https://pub.education.mn.gov/MdeOrgView/districts/index',
              final_url: 'https://validate.perfdrive.com/.../MdeOrgView/districts/index',
              verification_status: 'blocked',
              source_type: 'official_directory_child_route_radware',
              source_table: 'batch232_minnesota_root_instability_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The district child route still lands on the `Radware Captcha Page` shell instead of a reviewable district directory contract.',
            },
            {
              sample_name: 'Minnesota MDEAnalytics Data route challenge',
              source_url: 'https://pub.education.mn.gov/MDEAnalytics/Data.jsp',
              final_url: 'https://validate.perfdrive.com/.../MDEAnalytics/Data.jsp',
              verification_status: 'blocked',
              source_type: 'official_analytics_route_unstable',
              source_table: 'batch232_minnesota_root_instability_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded session-backed probe still let the analytics route flip immediately into validate.perfdrive.com, so no stable county-grade export contract is reproducible.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: DISTRICT_FAILURE_CODE, next_action: DISTRICT_NEXT_ACTION, evidence: DISTRICT_EVIDENCE }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'minnesota'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  updateLessons(INPUTS.lessons);

  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport());

  const batchSummary = {
    batch: 'batch232_minnesota_root_instability_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'minnesota',
    classification: 'BLOCKED',
    index_safe: false,
    refined_family: 'district_or_county_education_routing',
    exact_root_fetch_title: 'Radware Captcha Page',
    analytics_final_host: 'validate.perfdrive.com',
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch232MinnesotaRootInstabilityRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
