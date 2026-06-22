import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'arizona_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'arizona_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'arizona_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'arizona_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'arizona_next_action_queue_v2.jsonl'),
  countyPacket: path.join(generatedDir, 'arizona_county_local_disability_resources_leaf_authoring_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch118_arizona_county_root_live_probe_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch118-arizona-county-root-live-probe-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const COUNTY_BLOCKER_CODE = 'county_office_packet_empty_and_county_root_inventory_nonresolving';
const COUNTY_NEXT = 'replace_nonresolving_county_root_seeds_before_authoring_arizona_county_local_leaves';
const COUNTY_STATUS_REASON = 'The Arizona county-local office packet is still not runnable: it contains 0 exact office leaves, and a bounded live probe of the 15 county-root seeds currently stored in the DB showed 14/15 do not resolve at all while the remaining Maricopa root returned HTTP 403. Until the stale county-root inventory is replaced with live official office roots or exact leaves, the family remains blocked on DOI and generic locator fallback rows rather than on a trustworthy local repair queue.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded live probes of the 15 Arizona county-root URLs currently stored in the DB for county-local authoring. Apache, Cochise, Coconino, Gila, Graham, Greenlee, La Paz, Mohave, Navajo, Pima, Pinal, Santa Cruz, Yavapai, and Yuma all failed DNS resolution on their current `*-az.gov` roots, while Maricopa returned HTTP 403. The official Arizona DES lane also remains challenge-blocked, and the authored packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0, so the county-local repair queue cannot yet be truthfully seeded from the existing county-root inventory.';

const LESSON_HEADING = '### County Root Inventory Must Pass Live DNS Before It Seeds A Leaf Packet';
const LESSON_BODY = '*   **Lesson:** Do not treat county homepage URLs from legacy inventory as valid authoring seeds until they survive a live DNS/HTTP probe. Arizona showed that 14/15 stored `*-az.gov` county roots did not resolve at all and the lone surviving root returned 403, so a packet can look populated while still having no live local repair surface.';

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

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
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
    '- Education is still blocked because the packet has zero district-owned exact leaves.',
    '- County-local is now sharper than “zero exact leaves” alone: the current county-root inventory itself is mostly dead, so the repair lane cannot be trusted until those seeds are replaced with live official office roots or exact leaves.',
    '- Arizona should only reopen county-local once the stale county-root inventory is replaced and exact first-party office targets are authored.',
  ].join('\n') + '\n';
}

export function generateBatch118ArizonaCountyRootLiveProbeV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const countyPacket = readJson(INPUTS.countyPacket);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, status_reason: COUNTY_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: COUNTY_BLOCKER_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          blocker_code: COUNTY_BLOCKER_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
          query_basis: 'Reviewed Arizona county-local blocker artifacts, packet metrics, and bounded live probes of the stored Arizona county-root inventory.',
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: COUNTY_BLOCKER_CODE, next_action: COUNTY_NEXT, evidence: COUNTY_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'challenged_official_roots_zero_exact_education_leaves_and_nonresolving_county_root_inventory',
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: COUNTY_BLOCKER_CODE, evidence: COUNTY_EVIDENCE }
        : row
    )),
  };

  const updatedCountyPacket = {
    ...countyPacket,
    current_problem_metrics: {
      ...countyPacket.current_problem_metrics,
      nonresolvingCountyRootCount: 14,
      blockedCountyRootCount: 1,
    },
    root_domains_to_review: [
      'replace current DB county roots; 14 of 15 current Arizona county roots do not resolve and Maricopa returns HTTP 403',
      'https://des.az.gov/',
      'https://www.azahcccs.gov/',
    ],
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.countyPacket, updatedCountyPacket);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'arizona',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_family: 'county_local_disability_resources',
    nonresolvingCountyRootCount: 14,
    blockedCountyRootCount: 1,
    authoredExactLeafCount: updatedCountyPacket.current_problem_metrics.authoredExactLeafCount ?? null,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 118 Arizona County Root Live Probe Report v1',
      '',
      'This pass does not broaden Arizona scraping. It sharpens the county-local blocker by proving that the current county-root inventory cannot seed a truthful local-office leaf queue.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- primary_gap_reason: ${updatedSummary.primary_gap_reason}`,
      `- nonresolving_county_roots: ${batchSummary.nonresolvingCountyRootCount}`,
      `- blocked_county_roots: ${batchSummary.blockedCountyRootCount}`,
      `- authored_exact_leaf_count: ${batchSummary.authoredExactLeafCount}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch118ArizonaCountyRootLiveProbeV1();
  console.log(JSON.stringify(summary, null, 2));
}
