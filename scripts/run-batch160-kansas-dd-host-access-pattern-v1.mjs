import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'kansas_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kansas_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'),
  repairPacket: path.join(generatedDir, 'kansas_developmental_disability_idd_authority_repair_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch160_kansas_dd_host_access_pattern_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch160-kansas-dd-host-access-pattern-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

const DD_FAILURE_CODE = 'exact_kdads_and_kancare_dd_leaves_are_hostwide_access_denied_while_robots_stays_open';
const DD_STATUS_REASON = 'Kansas now has a sharper DD blocker: the exact KDADS DD candidate leaves, KDADS search, and KDADS sitemap all return hostwide access-denied shells, and the supporting KanCare HCBS crossover leaves do the same. Only robots.txt remains publicly readable, which is not completion evidence. The next honest lane is browser-assisted or alternate-official DD leaf review, not more raw same-host guessing.';
const DD_EVIDENCE = 'Reviewed 2026-06-23 bounded live official Kansas DD probes on https://www.kdads.ks.gov/, https://www.kdads.ks.gov/services/developmental-disabilities, https://www.kdads.ks.gov/services/disability-services, https://www.kdads.ks.gov/commissions/home-community-based-services-hcbs, https://www.kdads.ks.gov/search?searchTerm=developmental%20disabilities, https://www.kdads.ks.gov/sitemap.xml, https://www.kancare.ks.gov/, https://www.kancare.ks.gov/home-and-community-based-services-hcbs, https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000, https://www.kancare.ks.gov/search-results?searchtext=developmental%20disability, and https://www.kancare.ks.gov/sitemap.xml. Every exact KDADS and KanCare content, search, and sitemap surface returned the same Access Denied shell in bounded raw fetches, while https://www.kdads.ks.gov/robots.txt still responded publicly. Kansas therefore still lacks any raw-fetch-reviewable official DD authority leaf, and the blocker is now transport-specific rather than a generic stale-root claim.';
const DD_NEXT_ACTION = 'browser_assisted_or_reviewed_alt_official_dd_leaf_after_hostwide_access_denied_confirmation';
const LESSON_HEADING = '### Open robots.txt Does Not Mean The Official Host Is Scrapeable';
const LESSON_BODY = '*   **Lesson:** If `robots.txt` stays public but the exact content, search, and sitemap leaves all return the same access-denied shell, treat the host as transport-blocked and stop same-host retries. Kansas KDADS and KanCare both left `robots.txt` open while every DD or HCBS content surface still returned access denied.';

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

function updateLessonsFile(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Kansas California-Grade Education Leaf Rehydration v1',
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
    '- Kansas remains BLOCKED and not index-safe.',
    '- The DD blocker is now transport-specific: exact KDADS and KanCare DD/HCBS leaves, search, and sitemaps all return access-denied shells in bounded raw fetches.',
    '- An open robots.txt on the same host does not change that blocker or count as a reviewable DD authority leaf.',
    '- The next honest DD lane is browser-assisted or alternate-official reviewed leaves, not more raw same-host probing.',
  ].join('\n') + '\n';
}

export function generateBatch160KansasDdHostAccessPatternV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const repairPacket = readJson(INPUTS.repairPacket);

  const updatedPacket = {
    ...repairPacket,
    current_problem_metrics: {
      ...repairPacket.current_problem_metrics,
      reviewedBlockedReplacementRoots: 2,
      kdadsExactBlockedLeaves: 5,
      kdadsSitemapBlocked: true,
      kancareSupportingBlockedLeaves: 4,
      kancareSitemapBlocked: true,
      kdadsRobotsReadable: true,
    },
    representative_sources: [
      'https://dhhs.kansas.gov/dd',
      'https://www.kdads.ks.gov/services/developmental-disabilities',
      'https://www.kdads.ks.gov/sitemap.xml',
      'https://www.kdads.ks.gov/robots.txt',
      'https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000',
    ],
    root_domains_to_review: [
      'browser-assisted reviewed KDADS DD leaves if access permits',
      'alternate-official Kansas DD leaves outside the hostwide access-denied stack',
      'KanCare HCBS crossover pages only as supporting context, not completion proof',
    ],
    packet_complete_when: 'Kansas has a reviewed official DD authority leaf that preserves DD intake, eligibility, or entry routing without relying on the dead dhhs.kansas.gov/dd root or on raw-fetch-blocked KDADS/KanCare shells.',
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, family_status: 'blocked_hostwide_access_denied_dd_stack', status_reason: DD_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, failure_code: DD_FAILURE_CODE, evidence: DD_EVIDENCE, next_action: DD_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? {
          ...row,
          family_status: 'blocked_hostwide_access_denied_dd_stack',
          query_basis: 'Reviewed exact KDADS and KanCare DD/HCBS leaves, search surfaces, and sitemaps after the stale legacy root remained unresolved.',
          blocker_code: DD_FAILURE_CODE,
          blocker_evidence: DD_EVIDENCE,
          sample_count: 3,
          samples: [
            {
              sample_name: 'KDADS DD candidate leaf',
              source_url: 'https://www.kdads.ks.gov/services/developmental-disabilities',
              final_url: 'https://www.kdads.ks.gov/services/developmental-disabilities',
              verification_status: 'blocked',
              source_type: 'official_access_denied_leaf',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The exact KDADS developmental-disabilities leaf returned the same Access Denied shell as the host root instead of DD intake, eligibility, or services content.',
            },
            {
              sample_name: 'KDADS robots.txt',
              source_url: 'https://www.kdads.ks.gov/robots.txt',
              final_url: 'https://www.kdads.ks.gov/robots.txt',
              verification_status: 'reviewed',
              source_type: 'official_host_transport_signal',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The KDADS robots.txt file still responds publicly even while the exact DD content, search, and sitemap leaves remain access denied, so robots readability cannot be treated as content accessibility.',
            },
            {
              sample_name: 'KanCare HCBS crossover leaf',
              source_url: 'https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000',
              final_url: 'https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000',
              verification_status: 'blocked',
              source_type: 'official_access_denied_supporting_leaf',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The supporting KanCare HCBS fact-sheet leaf now returns the same Access Denied shell in raw fetches, so it cannot currently serve as a raw-reviewable DD crossover artifact.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, failure_code: DD_FAILURE_CODE, next_action: DD_NEXT_ACTION, evidence: DD_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'kansas_dd_hosts_are_transport_blocked_and_education_still_lacks_county_or_district_contract',
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'developmental_disability_idd_authority'
        ? { ...blocker, failure_code: DD_FAILURE_CODE, evidence: DD_EVIDENCE, next_action: DD_NEXT_ACTION }
        : blocker
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJson(INPUTS.repairPacket, updatedPacket);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);

  const lessonAdded = updateLessonsFile(INPUTS.lessons);
  writeJson(OUTPUTS.summary, {
    batch: 'batch_160_kansas_dd_host_access_pattern_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    kdads_access_denied: true,
    kancare_access_denied: true,
    kdads_robots_readable: true,
    lesson_added: lessonAdded,
  });
  const report = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, report);
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Kansas DD Host Access Pattern Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      '- refined_family: developmental_disability_idd_authority',
      `- failure_code: ${DD_FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${DD_EVIDENCE}`,
      '',
      '## Repair decision',
      '',
      '- Kansas DD remains blocked on a hostwide transport pattern, not just a stale root.',
      '- Exact KDADS DD leaves, search, and sitemap are access denied; the supporting KanCare crossover leaves are too.',
      '- The next honest lane is browser-assisted or alternate-official DD review.',
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (process.argv[1] === __filename || (process.argv[1] && path.resolve(process.argv[1]) === __filename)) {
  generateBatch160KansasDdHostAccessPatternV1();
  console.log('batch160_kansas_dd_host_access_pattern_v1: ok');
}
