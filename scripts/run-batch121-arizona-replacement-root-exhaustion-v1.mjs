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
  batchSummary: path.join(generatedDir, 'batch121_arizona_replacement_root_exhaustion_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch121-arizona-replacement-root-exhaustion-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const EDUCATION_STATUS_REASON = 'The Arizona education packet still contains 0 exact district-owned leaves, and the obvious official replacement roots are now exhausted too: https://www.azed.gov/school-district-web-sites/, https://www.azed.gov/asd/school-district-web-sites/, https://www.azed.gov/exceptionalstudentservices/, and https://www.azed.gov/ess all returned the same Cloudflare challenge shell in bounded live checks. Until exact district-owned special-education or student-services targets are authored, the family remains blocked on generic statewide fallback rows rather than on a runnable local repair queue.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 bounded live probes of Arizona Department of Education replacement candidates for district routing. The existing statewide root https://www.azed.gov/specialeducation still returns the Cloudflare "Just a moment..." shell, and the likely replacement leaves https://www.azed.gov/school-district-web-sites/, https://www.azed.gov/asd/school-district-web-sites/, https://www.azed.gov/exceptionalstudentservices/, and https://www.azed.gov/ess also each returned HTTP 403 with cf-mitigated: challenge. The authored packet at data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0 across 15 affected counties, so no district-owned Arizona special-education or student-services leaf has yet been attached to the repair queue.';

const COUNTY_STATUS_REASON = 'The Arizona county-local office packet still contains 0 exact office leaves, and the obvious official replacement roots are now exhausted too: https://des.az.gov/office-locator, https://des.az.gov/services/basic-needs/apply-for-benefits/where-to-apply, and https://des.az.gov/find-your-local-office all returned the same Cloudflare challenge shell, while companion AHCCCS guesses https://www.azahcccs.gov/Members/GetCovered/Categories/where.html and https://www.azahcccs.gov/AHCCCS/Downloads/FFA.pdf returned 200 "Page/Document not found" shells. Until the stale county-root inventory is replaced with live official office roots or exact leaves, the family remains blocked on DOI and generic locator fallback rows rather than on a trustworthy local repair queue.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded live probes of Arizona local-office replacement candidates. Apache, Cochise, Coconino, Gila, Graham, Greenlee, La Paz, Mohave, Navajo, Pima, Pinal, Santa Cruz, Yavapai, and Yuma still fail DNS resolution on their stored `*-az.gov` roots, while Maricopa returns HTTP 403. The likely DES office replacements https://des.az.gov/office-locator, https://des.az.gov/services/basic-needs/apply-for-benefits/where-to-apply, and https://des.az.gov/find-your-local-office also each returned HTTP 403 with cf-mitigated: challenge, and the companion AHCCCS guesses https://www.azahcccs.gov/Members/GetCovered/Categories/where.html plus https://www.azahcccs.gov/AHCCCS/Downloads/FFA.pdf returned 200 "Page/Document not found" shells. The authored packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0, so the county-local repair queue cannot yet be truthfully seeded from either the stale county-root inventory or the reviewed replacement roots.';

const LESSON_HEADING = '### Exhausted Replacement Roots Should Be Written Into The Packet Before Another Challenged-Host Retry';
const LESSON_BODY = '*   **Lesson:** When a challenged state host blocks the obvious replacement leaves too, record the exact exhausted URLs in the packet and stop guessing sibling roots. Arizona only became decision-complete after the packet named the challenged AZED `school-district-web-sites` / `ess` leaves and the DES office-locator guesses, plus the AHCCCS `Page/Document not found` companion URLs.';

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
    '- Education is still blocked because the packet has zero district-owned exact leaves, and the obvious AZED replacement roots now also prove out as challenge shells rather than runnable district-routing surfaces.',
    '- County-local is still blocked because the stale county-root inventory is mostly dead, the DES office-locator guesses are also challenge-blocked, and the companion AHCCCS guesses are only 200 Page/Document not found shells.',
    '- Arizona should only reopen these families once exact district-owned or county-specific first-party targets are authored, not by retrying the same challenged or not-found roots.',
  ].join('\n') + '\n';
}

export function generateBatch121ArizonaReplacementRootExhaustionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const educationPacket = readJson(INPUTS.educationPacket);
  const countyPacket = readJson(INPUTS.countyPacket);

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
        query_basis: 'Reviewed Arizona education blocker artifacts, packet metrics, and bounded live probes of exact AZED replacement roots.',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        query_basis: 'Reviewed Arizona county-local blocker artifacts, packet metrics, stored county-root failures, and bounded live probes of exact DES/AHCCCS replacement roots.',
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

  const updatedSummary = {
    ...summary,
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

  const updatedEducationPacket = {
    ...educationPacket,
    root_domains_to_review: [
      'https://www.azed.gov/specialeducation',
      'https://www.azed.gov/school-district-web-sites/',
      'https://www.azed.gov/asd/school-district-web-sites/',
      'https://www.azed.gov/exceptionalstudentservices/',
      'https://www.azed.gov/ess',
    ],
  };

  const updatedCountyPacket = {
    ...countyPacket,
    root_domains_to_review: [
      'replace current DB county roots; 14 of 15 current Arizona county roots do not resolve and Maricopa returns HTTP 403',
      'https://des.az.gov/',
      'https://des.az.gov/office-locator',
      'https://des.az.gov/services/basic-needs/apply-for-benefits/where-to-apply',
      'https://des.az.gov/find-your-local-office',
      'https://www.azahcccs.gov/Members/GetCovered/Categories/where.html',
      'https://www.azahcccs.gov/AHCCCS/Downloads/FFA.pdf',
    ],
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
    refined_families: ['district_or_county_education_routing', 'county_local_disability_resources'],
    exhaustedEducationReplacementRoots: updatedEducationPacket.root_domains_to_review.length,
    exhaustedCountyReplacementRoots: updatedCountyPacket.root_domains_to_review.length,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 121 Arizona Replacement Root Exhaustion Report v1',
      '',
      'This pass does not broaden Arizona discovery. It records the exact official replacement roots that were already exhausted before another challenged-host retry.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- exhausted_education_replacement_roots: ${batchSummary.exhaustedEducationReplacementRoots}`,
      `- exhausted_county_replacement_roots: ${batchSummary.exhaustedCountyReplacementRoots}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch121ArizonaReplacementRootExhaustionV1();
  console.log(JSON.stringify(summary, null, 2));
}
