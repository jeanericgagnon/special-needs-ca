import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const INPUTS = {
  summary: path.join(generatedDir, 'arizona_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'arizona_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'arizona_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'arizona_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'arizona_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  educationPacket: path.join(generatedDir, 'arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch166_arizona_zero_district_root_inventory_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch166-arizona-zero-district-root-inventory-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const EDUCATION_FAILURE_CODE = 'no_district_owned_arizona_root_inventory_exists_in_live_or_staging_packet';
const EDUCATION_STATUS_REASON = 'Arizona education remains blocked because the official AZED host is challenge-blocked and the current packet still has no runnable local root inventory: all 15 live county rows and all 15 staging rows point to statewide Arizona education placeholders instead of district-owned domains. The next honest lane is county-keyed district-root authoring first, then district-owned special-education leaf authoring.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 current Arizona education blocker artifacts, the live school_districts DB rows, the staging_scraped_school_districts rows, and the on-disk district packet. All 15 live Arizona school_district rows still point at the same statewide AZED fallback source https://www.azed.gov/specialeducation, while the 13 Arizona staging rows still point at the older statewide placeholder https://www.education.arizona.gov. Neither inventory preserves a single district-owned Arizona root domain, and the packet still reports authoredExactLeafCount=0. Because the official AZED root, likely replacement leaves, robots.txt, and sitemap.xml are all challenge-blocked, Arizona cannot jump straight to district-owned leaf verification yet; it first needs county-keyed district-root authoring from outside the challenged AZED host.';

const LESSON_HEADING = '### Leaf Authoring Packets Need Real Local Roots Before They Count As Runnable';
const LESSON_BODY = '*   **Lesson:** If a state packet says the next lane is district-owned or county-owned leaf authoring, verify that live or staging inventory already preserves at least one real local root per affected county. Arizona had a leaf-authoring packet but zero district-owned roots in either live or staging rows, so the honest next lane is root authoring first, not leaf verification.';

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
    '# Arizona California-Grade Audit Report v2',
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
    '## Repair decision',
    '',
    '- Arizona remains BLOCKED and not index-safe.',
    '- Education is now sharpened one step further: this is not yet a runnable district-leaf queue because neither live nor staging inventory preserves any district-owned Arizona roots.',
    '- That means the next honest education lane is county-keyed district-root authoring first, then exact district-owned special-education or student-services leaves.',
    '- County-local is still blocked on a missing official county-to-office contract, so Arizona still cannot complete until both a real district-root inventory and a real AHCCCS or DES county contract exist on reviewable official surfaces.',
  ].join('\n') + '\n';
}

export function generateBatch166ArizonaZeroDistrictRootInventoryV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const educationPacket = readJson(INPUTS.educationPacket);
  const db = new Database(dbPath, { readonly: true });

  const liveRows = db.prepare(`
    select county_id, source_url
    from school_districts
    where county_id like '%-az'
  `).all();
  const stagingRows = db.prepare(`
    select county_id, source_url
    from staging_scraped_school_districts
    where county_id like '%-az'
  `).all();
  db.close();

  const liveDistinctRoots = [...new Set(liveRows.map((row) => row.source_url).filter(Boolean))];
  const stagingDistinctRoots = [...new Set(stagingRows.map((row) => row.source_url).filter(Boolean))];
  const liveDistrictOwnedRoots = liveDistinctRoots.filter((url) => !/azed\.gov/i.test(url));
  const stagingDistrictOwnedRoots = stagingDistinctRoots.filter((url) => !/education\.arizona\.gov|azed\.gov/i.test(url));

  const updatedEducationPacket = {
    ...educationPacket,
    repair_lane: 'county_keyed_district_root_authoring_then_leaf_authoring',
    purpose: 'Deterministic authoring packet for Arizona education that must first attach one district-owned root per affected county before any district special-education leaf verification can begin.',
    current_problem_metrics: {
      ...educationPacket.current_problem_metrics,
      genericFallbackCountyRows: liveRows.length,
      statewideFallbackRows: liveRows.length,
      authoredExactLeafCount: 0,
      liveDistinctRootCount: liveDistinctRoots.length,
      stagingDistinctRootCount: stagingDistinctRoots.length,
      liveDistrictOwnedRootCount: liveDistrictOwnedRoots.length,
      stagingDistrictOwnedRootCount: stagingDistrictOwnedRoots.length,
    },
    root_domains_to_review: [
      'county-keyed Arizona district-owned domains only',
      'do not reopen AZED host discovery until the challenge clears on root, likely replacement leaves, robots.txt, and sitemap.xml',
    ],
    representative_sources: [
      'district-owned Arizona K-12 domains must be authored first from outside the challenged AZED host',
      'https://www.azed.gov/specialeducation',
      'https://www.education.arizona.gov',
    ],
    packet_complete_when: 'At least one district-owned Arizona root is authored for every affected county and then at least one reviewed district-owned education-routing leaf is attached per county without relying on challenged AZED-host placeholders.',
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_zero_local_root_inventory_before_leaf_authoring',
          status_reason: EDUCATION_STATUS_REASON,
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: EDUCATION_FAILURE_CODE,
          evidence: EDUCATION_EVIDENCE,
          next_action: 'author_county_keyed_district_owned_root_inventory_then_exact_special_education_leaves',
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_zero_local_root_inventory_before_leaf_authoring',
          query_basis: 'Reviewed Arizona education blocker artifacts plus live and staging district inventory to test whether any district-owned Arizona roots were already available for exact leaf authoring.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: EDUCATION_FAILURE_CODE,
          next_action: 'author_county_keyed_district_owned_root_inventory_then_exact_special_education_leaves',
          evidence: EDUCATION_EVIDENCE,
        }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'zero_district_root_inventory_and_ahcccs_sitemap_exposes_no_county_office_contract',
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE }
        : row
    )),
  };

  writeJson(INPUTS.educationPacket, updatedEducationPacket);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  const batchSummary = {
    state: 'arizona',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    live_fallback_rows: liveRows.length,
    staging_fallback_rows: stagingRows.length,
    live_distinct_root_count: liveDistinctRoots.length,
    staging_distinct_root_count: stagingDistinctRoots.length,
    live_district_owned_root_count: liveDistrictOwnedRoots.length,
    staging_district_owned_root_count: stagingDistrictOwnedRoots.length,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${stateReport}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch166ArizonaZeroDistrictRootInventoryV1();
  console.log(JSON.stringify(result, null, 2));
}
