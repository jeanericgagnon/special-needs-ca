import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const lessonsPath = path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md');

const INPUTS = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch397_idaho_live_sitemap_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch397-idaho-live-sitemap-finality-report-v1.md'),
};

const BATCH = 'batch397_idaho_live_sitemap_finality_v1';
const PRIMARY_GAP_REASON =
  'remaining_idaho_camas_and_clark_surfaces_still_reduce_to_wrong_role_contact_board_roster_title_ix_general_education_notice_and_image_only_child_find_lanes_while_live_dhw_sitemap_only_confirms_office_inventory_without_county_contract';
const DISTRICT_STATUS =
  'blocked_remaining_camas_and_clark_surfaces_only_materialize_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_after_shoshone_recovery';
const DISTRICT_REASON =
  'Reviewed 2026-06-26 one more bounded live Idaho district pass on the exact residual Camas and Clark hosts. Camas root and `Contact Information` are still public HTTP 200 pages, but `https://www.camascountyschools.org/sitemap.xml` now returns HTTP 404 and the reviewed public pages still preserve only district address/phone plus the same district-linked Google Doc board-roster lane rather than special-education, student-services, 504, Child Find, or procedural-safeguards routing. Clark root, `Contact Us`, `Title IX`, `Parent Notification of General Education Instruction`, and `Parent Resources` all still return HTTP 200, while `https://www.clarkcountyschools161.org/sitemap.xml` now returns HTTP 404. The live Clark surfaces still only preserve wrong-role or too-thin lanes: contact routing, Title IX, general-education intervention notice pages, and the same district-hosted `Idaho Child Find` flyer family without extractable Clark- or Dubois-specific special-education routing evidence. Idaho therefore remains blocked because the final district-owned surfaces are still public but remain the wrong role or too thin for local special-education routing.';
const COUNTY_LOCAL_REASON =
  'Reviewed 2026-06-26 one more bounded live Idaho DHW office-contract pass on the exact official office root, one exact office leaf, and the now-public sitemap. `https://healthandwelfare.idaho.gov/offices` remains a live `Find a Service Location` root, `https://healthandwelfare.idaho.gov/dhw/caldwell-office` remains a live exact office leaf, and `https://healthandwelfare.idaho.gov/sitemap.xml` now returns HTTP 200. But the public sitemap only confirms office inventory, not county assignment: it enumerates exact office leaves such as Coeur d’Alene, Caldwell, Payette, Boise Westgate, Mountain Home, Burley, Twin Falls, Blackfoot, Pocatello, Idaho Falls, Rexburg, Salmon, and Kellogg, while the county-named URLs that do appear on the host are unrelated food-bank or pantry pages like `adams-county-mobile-pantry-council`, `camas-county-mobile-pantry-fairfield`, and `clark-county-mobile-pantry-dubois`. The live DHW stack still preserves no county-served fields, county-to-office table, service-area contract, or county assignment export for disability-routing offices. Idaho county-local routing therefore remains an explicit split between the existing safe exact-office replacements and the legacy counties that still lack a public county contract.';

const LESSON_HEADING =
  '### Public Sitemaps Can Confirm Inventory Without Creating A County Contract';
const LESSON_BODY =
  '*   **Lesson:** If a live official sitemap reappears, treat it as inventory evidence first, not as automatic local-routing proof. Idaho DHW’s public sitemap now confirms exact office leaves, but it still exposes no county-to-office assignment surface, and its county-named URLs belong to unrelated food-bank pages rather than disability-routing contracts.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  return raw ? raw.split('\n').map((line) => JSON.parse(line)) : [];
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

function appendLessonIfMissing() {
  const current = fs.readFileSync(lessonsPath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  writeText(lessonsPath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Idaho California-Grade Audit Report v2',
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
    '- Idaho remains BLOCKED and not index-safe.',
    '- Education still bottoms out only in Camas and Clark wrong-role contact, board-roster, Title IX, general-education-notice, and image-only Child Find flyer lanes.',
    '- County-local is now stronger as a blocker too: the live DHW sitemap confirms office inventory but still does not expose any county-to-office disability-routing contract.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 397 Idaho Live Sitemap Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tightened Idaho’s remaining district and county-local blockers with a fresh live sitemap and exact-host pass',
    '',
    '## Evidence',
    '',
    `- ${DISTRICT_REASON}`,
    `- ${COUNTY_LOCAL_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch397IdahoLiveSitemapFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedSummary = {
    ...summary,
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 87,
    strong_critical_families: 10,
    weak_critical_families: 2,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: DISTRICT_STATUS,
    },
    final_blockers: (summary.final_blockers || []).map((row) => {
      if (row.family === 'district_or_county_education_routing') return { ...row, evidence: DISTRICT_REASON };
      if (row.family === 'county_local_disability_resources') return { ...row, evidence: COUNTY_LOCAL_REASON };
      return row;
    }),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') return { ...row, family_status: DISTRICT_STATUS, status_reason: DISTRICT_REASON };
    if (row.family === 'county_local_disability_resources') return { ...row, status_reason: COUNTY_LOCAL_REASON };
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') return { ...row, evidence: DISTRICT_REASON };
    if (row.family === 'county_local_disability_resources') return { ...row, evidence: COUNTY_LOCAL_REASON };
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        blocker_evidence: DISTRICT_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      const samples = [...(row.samples || [])];
      samples.push({
        sample_name: 'Idaho DHW public sitemap office inventory',
        source_url: 'https://healthandwelfare.idaho.gov/sitemap.xml',
        final_url: 'https://healthandwelfare.idaho.gov/sitemap.xml',
        verification_status: 'verified',
        source_type: 'official_public_sitemap_inventory_only',
        source_table: BATCH,
        fetched_at: '2026-06-26T00:00:00.000Z',
        evidence_snippet: 'The live DHW sitemap now returns HTTP 200 and enumerates exact office leaves like Caldwell, Payette, Boise Westgate, Burley, Twin Falls, Pocatello, Idaho Falls, Rexburg, Salmon, and Kellogg, but the county-named URLs on the same host are unrelated food-bank or pantry pages rather than county-to-office disability-routing contracts.',
      });
      return {
        ...row,
        sample_count: samples.length,
        blocker_evidence: COUNTY_LOCAL_REASON,
        samples,
      };
    }
    return row;
  });

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeText(INPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, nextRows));
  writeJson(OUTPUTS.summary, {
    batch: BATCH,
    generated_at: new Date().toISOString(),
    classification: 'BLOCKED',
    idaho_dhw_sitemap_live: true,
    idaho_dhw_sitemap_office_inventory_only: true,
    camas_sitemap_404: true,
    clark_sitemap_404: true,
    completeness_pct: 87,
  });
  writeText(OUTPUTS.report, buildBatchReport());
  const lessonAdded = appendLessonIfMissing();

  return { classification: 'BLOCKED', lesson_added: lessonAdded };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch397IdahoLiveSitemapFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
