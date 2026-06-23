import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-york_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-york_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-york_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-york_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-york_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'new-york_county_local_disability_resources_health_host_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch245_new_york_otda_replacement_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch245-new-york-otda-replacement-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-york-california-grade-audit-report-v2.md'),
};

const COUNTY_REASON =
  'Reviewed 2026-06-23 the current New York county-local blocker surfaces plus one bounded official replacement-host lane. The official health.ny.gov Medicaid lane is still blocked host-wide, not just at one LDSS page: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all returned HTTP 403 in the bounded lane. A bounded replacement-host probe also showed `https://otda.ny.gov/workingfamilies/dss.asp`, `https://otda.ny.gov/workingfamilies/`, `https://otda.ny.gov/programs/applications/`, `https://otda.ny.gov/workingfamilies/contact.asp`, `https://otda.ny.gov/`, `https://www.otda.ny.gov/workingfamilies/dss.asp`, and `https://www.otda.ny.gov/` all failing with connection resets. The old county rows that still point at `ldss.htm` therefore cannot remain as sample proof, and the obvious OTDA replacement host family cannot yet serve as a reviewed rescue path either; only a public replacement locator or county-owned directory can clear this blocker.';

const LESSON_HEADING =
  '### Treat Apex And WWW Connection Resets As A Failed Official Replacement-Host Family';
const LESSON_BODY =
  '*   **Lesson:** If both the apex and `www` variants of a likely official replacement host reset the connection on the same bounded lane, preserve that as a host-family blocker instead of retrying deeper paths. New York OTDA reset on both `otda.ny.gov` and `www.otda.ny.gov`, which was enough to stop speculative county-locator guessing there.';

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
    '# New York Blocker Packets v4',
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
    '## PTI repair',
    '',
    '- `parent_training_information_center` is now verified from the authoritative Parent Center Hub New York state leaf plus the live listed first-party Starbridge host.',
    '- The authoritative leaf explicitly says `There are 5 PTIs serving New York State`, so the PTI gate is now statewide by reviewed coverage split rather than blocked on one regional center.',
    '',
    '## Completion decision',
    '',
    '- New York remains `BLOCKED` and `index_safe=false`.',
    '- County-local remains blocked because both the original `health.ny.gov` Medicaid host family and the bounded OTDA replacement-host family failed in live review.',
    '- Education remains blocked because three exact BOCES leaves are not enough for 62-county coverage.',
    '- PTI is no longer a blocker.',
  ].join('\n') + '\n';
}

export function generateBatch245NewYorkOtdaReplacementRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);

  const updatedGapRows = gapRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, family_status: 'blocked_health_hostwide_403', status_reason: COUNTY_REASON }
    : row);

  const updatedFailureRows = failureRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, failure_code: 'bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement', evidence: COUNTY_REASON, next_action: 'hold_blocked_until_public_health_ny_ldss_replacement_or_county_owned_locator_is_verified' }
    : row);

  const updatedVerifiedRows = verifiedRows.map((row) => row.family === 'county_local_disability_resources'
    ? {
      ...row,
      family_status: 'blocked_health_hostwide_403',
      query_basis: 'Reviewed 2026-06-23 the blocked official health.ny.gov Medicaid host family plus the bounded OTDA replacement-host lane.',
      blocker_code: 'bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement',
      blocker_evidence: COUNTY_REASON,
      evidence_strength: 'weak',
      sample_count: 7,
      samples: [
        { sample_name: 'LDSS directory', source_url: 'https://www.health.ny.gov/health_care/medicaid/ldss.htm', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
        { sample_name: 'robots.txt', source_url: 'https://www.health.ny.gov/robots.txt', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
        { sample_name: 'sitemap.xml', source_url: 'https://www.health.ny.gov/sitemap.xml', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
        { sample_name: 'Medicaid root', source_url: 'https://www.health.ny.gov/health_care/medicaid/', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
        { sample_name: 'Medicaid redesign', source_url: 'https://www.health.ny.gov/health_care/medicaid/redesign/', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
        { sample_name: 'OTDA DSS locator', source_url: 'https://otda.ny.gov/workingfamilies/dss.asp', verification_status: 'blocked', source_type: 'official_host_reset', source_table: 'reviewed_live_probe' },
        { sample_name: 'OTDA root', source_url: 'https://www.otda.ny.gov/', verification_status: 'blocked', source_type: 'official_host_reset', source_table: 'reviewed_live_probe' },
      ],
    }
    : row);

  const updatedNextRows = nextRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, failure_code: 'bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement', next_action: 'hold_blocked_until_public_health_ny_ldss_replacement_or_county_owned_locator_is_verified', evidence: COUNTY_REASON }
    : row);

  const updatedSummary = {
    ...summary,
    final_blockers: (summary.final_blockers || []).map((row) => row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: 'bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement', evidence: COUNTY_REASON, next_action: 'hold_blocked_until_public_health_ny_ldss_replacement_or_county_owned_locator_is_verified' }
      : row),
  };

  const updatedPacket = {
    ...packet,
    current_metrics: {
      ...(packet.current_metrics || {}),
      blockedHealthNySurfaces: 5,
      reviewedReplacementLocatorCount: 0,
      boundedOtdaReplacementHostFailures: 7,
    },
    blocked_surfaces: Array.from(new Set([
      ...(packet.blocked_surfaces || []),
      'https://otda.ny.gov/workingfamilies/dss.asp',
      'https://otda.ny.gov/workingfamilies/',
      'https://otda.ny.gov/programs/applications/',
      'https://otda.ny.gov/workingfamilies/contact.asp',
      'https://otda.ny.gov/',
      'https://www.otda.ny.gov/workingfamilies/dss.asp',
      'https://www.otda.ny.gov/',
    ])),
    replacement_host_probe: {
      attempted_at: '2026-06-23T00:00:00.000Z',
      host_family: ['otda.ny.gov', 'www.otda.ny.gov'],
      outcome: 'connection_reset_across_bounded_replacement_urls',
      exact_urls: [
        'https://otda.ny.gov/workingfamilies/dss.asp',
        'https://otda.ny.gov/workingfamilies/',
        'https://otda.ny.gov/programs/applications/',
        'https://otda.ny.gov/workingfamilies/contact.asp',
        'https://otda.ny.gov/',
        'https://www.otda.ny.gov/workingfamilies/dss.asp',
        'https://www.otda.ny.gov/',
      ],
    },
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
    batch: 'batch245_new_york_otda_replacement_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'new-york',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    healthNyBlockedSurfaceCount: 5,
    otdaReplacementHostFailureCount: 7,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 245 New York OTDA Replacement Refresh Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tightened the New York county-local blocker with bounded OTDA replacement-host failures',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
    '',
    '## Repair decision',
    '',
    '- Kept New York BLOCKED.',
    '- Confirmed the original `health.ny.gov` Medicaid host family is still unusable for county-local proof.',
    '- Confirmed the obvious OTDA replacement-host family also fails in bounded live review, so it cannot yet be treated as a rescue path.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch245NewYorkOtdaReplacementRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
