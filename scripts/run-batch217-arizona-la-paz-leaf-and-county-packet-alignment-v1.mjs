import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const lessonsPath = path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md');

const FILES = {
  summary: path.join(generatedDir, 'arizona_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'arizona_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'arizona_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'arizona_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'arizona_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'arizona_county_local_disability_resources_leaf_authoring_packet_v1.json'),
  leaves: path.join(generatedDir, 'arizona_district_owned_special_education_leaves_v1.jsonl'),
  batchSummary: path.join(generatedDir, 'batch217_arizona_la_paz_leaf_and_county_packet_alignment_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch217-arizona-la-paz-leaf-and-county-packet-alignment-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const LA_PAZ_LEAF = {
  county_id: 'la-paz-az',
  county_name: 'la paz',
  district_name: 'Parker Unified School District',
  district_website: 'https://www.parkerusd.org/',
  source_url: 'https://www.parkerusd.org/page/ess-department',
  final_url: 'https://www.parkerusd.org/page/ess-department',
  verification_status: 'verified',
  source_type: 'district_owned_special_education_leaf',
  fetched_at: '2026-06-23T00:00:00.000Z',
  evidence_title: 'Exceptional Students Services (ESS) | Parker Unified School District',
  evidence_h1: 'Welcome to Exceptional Student Services (ESS)',
  evidence_snippet:
    'Exceptional Students Services (ESS) | Parker Unified School District Skip to content Staff Portal Search site Parker Unified School District A Learning Organization Staff Portal Search site District Links District Links Schools Translate Sign in District Links Schools Translate Sign in District Show submenu for District District Welcome to the Parker Family Open Enrollment Policy District Vision Rights and Signs of Homeless Students Restraint/Seclusion Title IX School Board School Board Employment Employment Departments Show submenu for Departments Departments Business Office Parker Alternative School Exceptional Students Services (ESS)',
};

const VERIFIED_COUNTIES = [
  'apache-az',
  'graham-az',
  'greenlee-az',
  'la-paz-az',
  'maricopa-az',
  'pinal-az',
  'santa-cruz-az',
  'yuma-az',
];

const UNRESOLVED_COUNTIES = [
  'cochise-az',
  'coconino-az',
  'gila-az',
  'mohave-az',
  'navajo-az',
  'pima-az',
  'yavapai-az',
];

const EDUCATION_FAILURE_CODE =
  'district_owned_special_education_leaves_verified_for_some_counties_but_remaining_counties_still_lack_reviewed_local_leaves';
const EDUCATION_STATUS_REASON =
  'Arizona education now has reviewed district-owned special-education or student-services leaves for 8/15 county-keyed district roots, but the family remains blocked until every county has a reviewed local education-routing leaf rather than only a county-keyed district root.';
const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-23 bounded district-owned Arizona education leaf verification from the county-keyed report-cards inventory. Exact same-domain special-education or student-services leaves were verified for 8/15 county-keyed district roots: apache-az, graham-az, greenlee-az, la-paz-az, maricopa-az, pinal-az, santa-cruz-az, yuma-az. The verified local leaves came from direct district-owned hrefs or sitemap candidates rather than the challenged AZED host. Remaining unresolved counties are cochise-az, coconino-az, gila-az, mohave-az, navajo-az, pima-az, yavapai-az, where the current chosen district root either exposes no same-domain special-education candidate, has no public district website, or still lacks a role-verifiable local leaf. Arizona education is sharper because some county-grade local leaves are now proven, but the family remains blocked until all counties have reviewed district-owned education-routing leaves.';

const COUNTY_FAILURE_CODE =
  'official_local_office_roots_challenge_and_existing_packet_still_zero_exact_leaves';
const COUNTY_STATUS_REASON =
  'Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table currently contains 14 Arizona rows still anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row still anchored to the generic legacy root https://dhhs.arizona.gov/locations. The existing authoring packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json is real, but it still reports authoredExactLeafCount=0, so Arizona still has no reviewed county-office leaves to replace the stale rows.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table currently contains 14 Arizona rows still anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row still anchored to the generic legacy root https://dhhs.arizona.gov/locations. The existing authoring packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json is real, but it still reports authoredExactLeafCount=0, so Arizona still has no reviewed county-office leaves to replace the stale rows.';
const COUNTY_NEXT_ACTION =
  'use_existing_arizona_county_local_packet_to_author_reviewed_county_specific_office_leaves_before_reopening_browser_lane';

const LESSON_HEADING =
  '### Homepage Anchor Text Can Beat Slug-Only Leaf Discovery';
const LESSON_BODY =
  '*   **Lesson:** If a district-owned homepage exposes a role-exact anchor like `Exceptional Students Services (ESS)`, verify that direct href even when sitemap scans and slug-only homepage filters return nothing. Arizona only recovered La Paz once Parker USD\'s homepage anchor surfaced `/page/ess-department` as the real local leaf.';

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

function upsertLesson() {
  const current = fs.readFileSync(lessonsPath, 'utf8');
  if (current.includes(LESSON_HEADING)) {
    return false;
  }
  const updated = `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`;
  fs.writeFileSync(lessonsPath, updated);
  return true;
}

function replaceVerifiedSample(verifiedRows) {
  const row = verifiedRows.find((entry) => entry.family === 'district_or_county_education_routing');
  row.family_status = 'blocked_partial_district_owned_special_education_leaf_coverage';
  row.sample_count = 10;
  row.query_basis = 'Bounded district-owned same-domain verification from county-keyed Arizona report-cards roots using homepage anchors, homepage links, and sitemap candidate discovery only.';
  row.blocker_code = EDUCATION_FAILURE_CODE;
  row.blocker_evidence = EDUCATION_EVIDENCE;

  const existing = row.samples.filter((sample) => sample.county_id !== 'la-paz-az' && sample.sample_name !== 'la-paz district-owned leaf');
  const summarySamples = [
    {
      sample_name: 'la-paz district-owned leaf',
      county_id: 'la-paz-az',
      source_url: LA_PAZ_LEAF.source_url,
      final_url: LA_PAZ_LEAF.final_url,
      verification_status: 'verified',
      source_type: 'district_owned_special_education_leaf',
      source_table: 'reviewed_live_probe',
      fetched_at: LA_PAZ_LEAF.fetched_at,
      evidence_snippet: LA_PAZ_LEAF.evidence_snippet,
    },
  ];
  row.samples = [...existing, ...summarySamples];
}

function renderStateReport({ summary, gapRows, failureRows, verifiedRows, nextRows }) {
  const familyLines = gapRows.map(
    (row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`,
  );
  const failureLines = failureRows.map(
    (row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`,
  );
  const verifiedLines = verifiedRows.map((row) => {
    const first = row.samples?.[0]?.source_url || 'n/a';
    return `- ${row.family}: ${row.family_status}; samples=${row.sample_count}; first=${first}`;
  });
  const nextLines = nextRows.map(
    (row) => `- [${row.severity}] ${row.family}: ${row.next_action}`,
  );

  return [
    '# Arizona California-Grade Audit Report v2',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    `- primary_gap_reason: ${summary.primary_gap_reason}`,
    '',
    '## Family status',
    '',
    ...familyLines,
    '',
    '## Failure ledger',
    '',
    ...failureLines,
    '',
    '## Verified source samples',
    '',
    ...verifiedLines,
    '',
    '## Next actions',
    '',
    ...nextLines,
    '',
  ].join('\n');
}

export function generateBatch217ArizonaLaPazLeafAndCountyPacketAlignmentV1() {
  const summary = readJson(FILES.summary);
  const gapRows = readJsonl(FILES.gap);
  const failureRows = readJsonl(FILES.failures);
  const verifiedRows = readJsonl(FILES.verified);
  const nextRows = readJsonl(FILES.next);
  const packet = readJson(FILES.packet);
  const countyPacket = readJson(FILES.countyPacket);
  const leaves = readJsonl(FILES.leaves);

  if (!leaves.some((row) => row.county_id === 'la-paz-az')) {
    leaves.push(LA_PAZ_LEAF);
  }

  leaves.sort((a, b) => a.county_id.localeCompare(b.county_id));
  packet.current_problem_metrics.authoredExactLeafCount = 8;
  packet.current_problem_metrics.unresolvedDistrictOwnedLeafCount = 7;

  const unresolvedSet = new Set(UNRESOLVED_COUNTIES);
  packet.packet_complete_when =
    'At least one reviewed district-owned special-education or student-services leaf is attached per Arizona county from the county-keyed report-cards district root inventory without relying on generic AZED fallback rows.';

  const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
  educationGap.status_reason = EDUCATION_STATUS_REASON;

  const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
  countyGap.family_status = 'blocked_ahcccs_accessible_host_without_county_office_contract';
  countyGap.status_reason = COUNTY_STATUS_REASON;

  const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
  educationFailure.failure_code = EDUCATION_FAILURE_CODE;
  educationFailure.evidence = EDUCATION_EVIDENCE;
  educationFailure.next_action = 'finish_district_owned_special_education_leaves_for_unresolved_counties_from_county_keyed_roots';

  const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
  countyFailure.failure_code = COUNTY_FAILURE_CODE;
  countyFailure.evidence = COUNTY_EVIDENCE;
  countyFailure.next_action = COUNTY_NEXT_ACTION;

  replaceVerifiedSample(verifiedRows);

  const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
  countyVerified.blocker_code = COUNTY_FAILURE_CODE;
  countyVerified.blocker_evidence = COUNTY_EVIDENCE;
  countyVerified.query_basis = 'Reviewed Arizona county-local blocker artifacts, the existing county-local authoring packet, and aligned the on-disk packet to evidence-only AHCCCS surfaces after DES discovery proved exhausted.';

  const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
  educationNext.failure_code = EDUCATION_FAILURE_CODE;
  educationNext.evidence = EDUCATION_EVIDENCE;

  const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
  countyNext.failure_code = COUNTY_FAILURE_CODE;
  countyNext.next_action = COUNTY_NEXT_ACTION;
  countyNext.evidence = COUNTY_EVIDENCE;

  for (const blocker of summary.final_blockers) {
    if (blocker.family === 'district_or_county_education_routing') {
      blocker.failure_code = EDUCATION_FAILURE_CODE;
      blocker.evidence = EDUCATION_EVIDENCE;
    }
    if (blocker.family === 'county_local_disability_resources') {
      blocker.failure_code = COUNTY_FAILURE_CODE;
      blocker.evidence = COUNTY_EVIDENCE;
    }
  }

  const lessonAdded = upsertLesson();

  writeJsonl(FILES.leaves, leaves);
  writeJson(FILES.packet, packet);
  writeJsonl(FILES.gap, gapRows);
  writeJsonl(FILES.failures, failureRows);
  writeJsonl(FILES.verified, verifiedRows);
  writeJsonl(FILES.next, nextRows);
  writeJson(FILES.summary, summary);

  const stateReport = renderStateReport({ summary, gapRows, failureRows, verifiedRows, nextRows });
  fs.writeFileSync(FILES.stateReport, `${stateReport}\n`);

  const batchSummary = {
    batch: 'batch_217_arizona_la_paz_leaf_and_county_packet_alignment_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'arizona',
    classification: summary.classification,
    index_safe: summary.index_safe,
    verified_district_leaf_count: 8,
    unresolved_district_leaf_count: 7,
    repaired_counties: ['la-paz-az'],
    education_verified_counties: VERIFIED_COUNTIES,
    education_unresolved_counties: UNRESOLVED_COUNTIES,
    county_packet_exact_leaf_count: countyPacket.current_problem_metrics.authoredExactLeafCount,
    lesson_added: lessonAdded,
    consistency_fixes: ['county_local_packet_exists_but_zero_exact_leaves'],
  };
  writeJson(FILES.batchSummary, batchSummary);

  const batchReport = [
    '# Arizona La Paz Leaf And County Packet Alignment Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- repaired_counties: la-paz-az',
    '- education_verified_counties: apache-az, graham-az, greenlee-az, la-paz-az, maricopa-az, pinal-az, santa-cruz-az, yuma-az',
    '- education_unresolved_counties: cochise-az, coconino-az, gila-az, mohave-az, navajo-az, pima-az, yavapai-az',
    '- county_local_packet_exact_leaf_count: 0',
    '',
    '## What changed',
    '',
    '- Added the reviewed Parker Unified School District ESS leaf at `https://www.parkerusd.org/page/ess-department` for La Paz County.',
    '- Updated the Arizona education packet metrics from 7 reviewed exact leaves / 8 unresolved counties to 8 reviewed exact leaves / 7 unresolved counties.',
    '- Corrected the Arizona county-local blocker so it no longer falsely says no packet exists; the real blocker is that the existing packet still has zero reviewed exact county-office leaves.',
    '',
    '## Result',
    '',
    '- Arizona remains BLOCKED and `index_safe=false` because both critical local families are still incomplete.',
    '- Education is sharper and now verified for 8/15 counties.',
    '- County-local remains blocked until AHCCCS or DES yields a real county-to-office contract or reviewed county-office leaves.',
    '',
  ].join('\n');
  fs.writeFileSync(FILES.batchReport, `${batchReport}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch217ArizonaLaPazLeafAndCountyPacketAlignmentV1();
  console.log(JSON.stringify(summary, null, 2));
}
