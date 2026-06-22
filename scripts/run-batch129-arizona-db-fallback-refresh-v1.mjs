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
  educationPacket: path.join(generatedDir, 'arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'arizona_county_local_disability_resources_leaf_authoring_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch129_arizona_db_fallback_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch129-arizona-db-fallback-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'challenged_official_roots_and_db_inventory_still_placeholder_only';
const EDUCATION_STATUS_REASON = 'The Arizona education packet still contains 0 exact district-owned leaves, and the current DB inventory is still only statewide fallback coverage: 15/15 Arizona school_district rows point at the same challenged https://www.azed.gov/specialeducation root instead of district-owned special-education leaves. The obvious official replacement roots https://www.azed.gov/school-district-web-sites/, https://www.azed.gov/asd/school-district-web-sites/, https://www.azed.gov/exceptionalstudentservices/, and https://www.azed.gov/ess also returned the same Cloudflare challenge shell in bounded live checks. Until exact district-owned special-education or student-services targets are authored, the family remains blocked on statewide placeholders rather than on a runnable local repair queue.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 bounded live probes of Arizona Department of Education replacement candidates for district routing plus the current Arizona school_district DB rows. The existing statewide root https://www.azed.gov/specialeducation still returns the Cloudflare "Just a moment..." shell, and the likely replacement leaves https://www.azed.gov/school-district-web-sites/, https://www.azed.gov/asd/school-district-web-sites/, https://www.azed.gov/exceptionalstudentservices/, and https://www.azed.gov/ess also each returned HTTP 403 with cf-mitigated: challenge. The live DB inventory is still placeholder-only: 15/15 Arizona school_district rows point at the same statewide AZED root and are labeled as county fallback coverage rather than district-owned evidence pages. The authored packet at data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0 across 15 affected counties, so no district-owned Arizona special-education or student-services leaf has yet been attached to the repair queue.';

const COUNTY_STATUS_REASON = 'The Arizona county-local office packet still contains 0 exact office leaves, and the current DB inventory is still placeholder-only: 14/15 Arizona county_offices rows point at the DOI-derived FAA placeholder through https://www.azahcccs.gov/ and the remaining 1/15 row points at the generic legacy root https://dhhs.arizona.gov/locations. The obvious official replacement roots https://des.az.gov/office-locator, https://des.az.gov/services/basic-needs/apply-for-benefits/where-to-apply, and https://des.az.gov/find-your-local-office all returned the same Cloudflare challenge shell, while companion AHCCCS guesses https://www.azahcccs.gov/Members/GetCovered/Categories/where.html and https://www.azahcccs.gov/AHCCCS/Downloads/FFA.pdf returned 200 "Page/Document not found" shells. Until the stale county-root inventory is replaced with live official office roots or exact leaves, the family remains blocked on statewide placeholders rather than on a trustworthy local repair queue.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded live probes of Arizona local-office replacement candidates plus the current Arizona county_offices DB rows. Apache, Cochise, Coconino, Gila, Graham, La Paz, Mohave, Navajo, Pima, Pinal, Santa Cruz, Yavapai, and Yuma still rely on a DOI-derived FAA placeholder row through https://www.azahcccs.gov/, Greenlee still points at the generic legacy root https://dhhs.arizona.gov/locations, and Maricopa still lacks a reviewed county-specific official office leaf. The likely DES office replacements https://des.az.gov/office-locator, https://des.az.gov/services/basic-needs/apply-for-benefits/where-to-apply, and https://des.az.gov/find-your-local-office also each returned HTTP 403 with cf-mitigated: challenge, and the companion AHCCCS guesses https://www.azahcccs.gov/Members/GetCovered/Categories/where.html plus https://www.azahcccs.gov/AHCCCS/Downloads/FFA.pdf returned 200 "Page/Document not found" shells. The authored packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0, so the county-local repair queue cannot yet be truthfully seeded from either the stale county-root inventory or the reviewed replacement roots.';

const LESSON_HEADING = '### One Shared Statewide Fallback URL Across Every County Row Is A Packet Placeholder Signal';
const LESSON_BODY = '*   **Lesson:** If every county or district row in a blocked family points to the same statewide root, treat the DB inventory as placeholder-only and stop retrying that root as if it were local coverage. Arizona’s 15/15 `school_districts` rows all pointed at one challenged AZED page, and 14/15 `county_offices` rows all pointed at one DOI/AHCCCS placeholder, so the real next step was exact-leaf authoring, not more host retries.';

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
    '- Education is still blocked because 15/15 current Arizona district rows are the same challenged statewide ADE fallback URL, and no district-owned special-education leaf has been authored for any county.',
    '- County-local is still blocked because the current office inventory is still 14 DOI/AHCCCS placeholder rows plus 1 generic legacy locator row, and the reviewed DES/AHCCCS replacement roots remain challenge or not-found shells rather than county-grade office leaves.',
    '- Arizona should only reopen these families once exact district-owned or county-specific first-party targets are authored, not by retrying the same statewide placeholders or challenged roots.',
  ].join('\n') + '\n';
}

export function generateBatch129ArizonaDbFallbackRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const educationPacket = readJson(INPUTS.educationPacket);
  const countyPacket = readJson(INPUTS.countyPacket);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: summary.final_blockers.map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return { ...row, evidence: EDUCATION_EVIDENCE };
      }
      if (row.family === 'county_local_disability_resources') {
        return { ...row, evidence: COUNTY_EVIDENCE };
      }
      return row;
    }),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, status_reason: EDUCATION_STATUS_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, status_reason: COUNTY_STATUS_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        query_basis: 'Reviewed Arizona education blocker artifacts, current DB fallback inventory, packet metrics, and bounded live probes of exact AZED replacement roots.',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        query_basis: 'Reviewed Arizona county-local blocker artifacts, current DB fallback inventory, packet metrics, and bounded live probes of exact DES/AHCCCS replacement roots.',
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedEducationPacket = {
    ...educationPacket,
    current_problem_metrics: {
      ...educationPacket.current_problem_metrics,
      statewideFallbackRows: 15,
    },
  };

  const updatedCountyPacket = {
    ...countyPacket,
    current_problem_metrics: {
      ...countyPacket.current_problem_metrics,
      doiPlaceholderRows: 14,
      genericLegacyLocatorRows: 1,
    },
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.educationPacket, updatedEducationPacket);
  writeJson(INPUTS.countyPacket, updatedCountyPacket);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'arizona',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    primary_gap_reason: updatedSummary.primary_gap_reason,
    refined_families: ['district_or_county_education_routing', 'county_local_disability_resources'],
    education_statewide_fallback_rows: 15,
    county_doi_placeholder_rows: 14,
    county_legacy_locator_rows: 1,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 129 Arizona DB Fallback Refresh Report v1',
      '',
      'This pass does not broaden Arizona discovery. It tightens the Arizona blocker packet with current DB evidence proving that the remaining local families are still placeholder-backed rather than exact-leaf backed.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- education_statewide_fallback_rows: ${batchSummary.education_statewide_fallback_rows}`,
      `- county_doi_placeholder_rows: ${batchSummary.county_doi_placeholder_rows}`,
      `- county_legacy_locator_rows: ${batchSummary.county_legacy_locator_rows}`,
      `- primary_gap_reason: ${updatedSummary.primary_gap_reason}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch129ArizonaDbFallbackRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
