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
  countyPacket: path.join(generatedDir, 'arizona_county_local_disability_resources_leaf_authoring_packet_v1.json'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch156_arizona_packet_alignment_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch156-arizona-packet-alignment-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const EDUCATION_STATUS_REASON = 'Arizona education remains blocked because the official AZED host challenges the statewide root, likely replacement leaves, robots.txt, and sitemap.xml. All 15 current district rows still point at one statewide fallback URL, so the only honest next lane is district-owned leaf authoring from local district domains, not more AZED-host discovery.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 current Arizona education blocker artifacts plus the live school_districts DB rows and the on-disk district packet. All 15 Arizona county education rows still point at the same statewide AZED fallback source https://www.azed.gov/specialeducation, the packet still shows authoredExactLeafCount=0, and the host-level discovery surfaces on AZED are exhausted because the statewide root, likely replacement leaves, robots.txt, and sitemap.xml all returned the same Cloudflare challenge shell. Arizona therefore still needs district-owned local leaf authoring and should not reopen on any more AZED-host sibling guesses.';

const COUNTY_STATUS_REASON = 'Arizona county-local routing remains blocked because the accessible AHCCCS host proves real ALTCS offices and a partially parseable county map, but still exposes no county-to-office contract. DES remains fully challenged, so the county packet should stay evidence-only rather than inviting new DES or generic office-locator guesses.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 current Arizona county-local blocker artifacts plus the live county_offices DB rows and the on-disk county packet. Fourteen county rows still depend on DOI placeholders and one still uses the generic legacy locator root. The accessible AHCCCS host preserves the ALTCS Offices page, AHCCCS Contacts page, ALTCS member resource page, and the partially parseable ALTCS county map PDF, but none of those artifacts names a county-to-office assignment contract. DES remains challenge-blocked at root, robots.txt, sitemap.xml, and office-locator guesses. Arizona county-local routing therefore should stay blocked until an official county-to-office contract appears, not reopen on more DES guessing.';

const LESSON_HEADING = '### When A State Packet Is Decision-Complete, Trim Exhausted Guess Roots Out Of The Next Lane';
const LESSON_BODY = '*   **Lesson:** Once a blocker is decision-complete, update the state packet so it stops advertising exhausted sibling roots as if they were still live next steps. Arizona became safer once the packet stopped pointing future work back at challenged `AZED` and `DES` guess URLs and instead preserved only the real surviving lanes: district-owned local sites for education and evidence-only AHCCCS surfaces for county routing.';

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
    '- Education is still a district-owned leaf authoring problem, but the packet now makes that explicit by removing AZED-host sibling guesses from the active next lane.',
    '- County-local is still blocked on a missing county-to-office contract, and the packet now treats DES as exhausted and AHCCCS as evidence-only rather than implying more generic office-locator discovery is still justified.',
    '- Arizona should only reopen when district-owned education leaves or a true AHCCCS or DES county-to-office contract is attached from official surfaces, not from statewide placeholders or exhausted host guesses.',
  ].join('\n') + '\n';
}

export function generateBatch156ArizonaPacketAlignmentV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const educationPacket = readJson(INPUTS.educationPacket);
  const countyPacket = readJson(INPUTS.countyPacket);
  const db = new Database(dbPath, { readonly: true });

  const districtCounts = db.prepare(`
    select count(*) as cnt, source_url
    from school_districts
    where county_id like '%-az'
    group by source_url
    order by cnt desc
  `).all();

  const countyCounts = db.prepare(`
    select count(*) as cnt, source_url
    from county_offices
    where county_id like '%-az'
    group by source_url
    order by cnt desc
  `).all();
  db.close();

  const statewideEducationFallbackRows = districtCounts.reduce((acc, row) => acc + row.cnt, 0);
  const doiRows = countyCounts.find((row) => row.source_url === 'https://doi.org/10.7910/DVN/AVRHMI')?.cnt || 0;
  const legacyRows = countyCounts.find((row) => row.source_url === 'https://dhhs.arizona.gov/locations')?.cnt || 0;

  const updatedEducationPacket = {
    ...educationPacket,
    repair_lane: 'district_owned_leaf_authoring_only',
    purpose: 'Deterministic authoring packet for replacing statewide Arizona education fallback rows with district-owned special-education or student-services leaves after AZED-host discovery proved exhausted.',
    current_problem_metrics: {
      ...educationPacket.current_problem_metrics,
      genericFallbackCountyRows: statewideEducationFallbackRows,
      statewideFallbackRows: statewideEducationFallbackRows,
      azedHostExhaustedRoots: 8,
      authoredExactLeafCount: 0,
    },
    representative_sources: [
      'existing district-owned local domains to be authored from outside the challenged AZED host',
      'https://www.azed.gov/specialeducation',
    ],
    root_domains_to_review: [
      'district-owned Arizona K-12 domains only',
      'do not reopen AZED host discovery until the challenge clears on root, likely replacement leaves, robots.txt, and sitemap.xml',
    ],
    packet_complete_when: 'At least one reviewed district-owned education-routing leaf is authored for every Arizona county without relying on the challenged AZED host.',
  };

  const updatedCountyPacket = {
    ...countyPacket,
    repair_lane: 'evidence_only_until_county_office_contract_exists',
    purpose: 'Deterministic evidence packet for Arizona county-local routing while the official hosts still expose offices but no county-to-office contract.',
    current_problem_metrics: {
      ...countyPacket.current_problem_metrics,
      doiFallbackCountyRows: doiRows,
      doiPlaceholderRows: doiRows,
      genericLegacyRootRows: legacyRows,
      genericLegacyLocatorRows: legacyRows,
      authoredExactLeafCount: 0,
      desHostExhaustedRoots: 8,
    },
    representative_sources: [
      'https://www.azahcccs.gov/members/ALTCSlocations.html',
      'https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf',
      'https://www.azahcccs.gov/shared/AHCCCScontacts.html',
      'https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html',
    ],
    root_domains_to_review: [
      'reviewable AHCCCS leaves only',
      'do not reopen DES host discovery until the challenge clears on root, robots.txt, sitemap.xml, and office-locator leaves',
    ],
    packet_complete_when: 'Arizona can reopen only when a reviewed official county-to-office contract appears on AHCCCS or DES, not from DOI placeholders, support-letter PDFs, or generic locator guesses.',
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
        query_basis: 'Reviewed Arizona education blocker artifacts, current district fallback inventory, and aligned the on-disk packet to district-owned authoring only after AZED-host discovery proved exhausted.',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        query_basis: 'Reviewed Arizona county-local blocker artifacts, current county-office fallback inventory, and aligned the on-disk packet to evidence-only AHCCCS surfaces after DES discovery proved exhausted.',
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        next_action: 'author_district_owned_special_education_or_student_services_leaves_from_local_district_sites_not_azed',
        evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        next_action: 'hold_blocked_until_reviewable_ahcccs_or_des_county_to_office_contract_exists',
        evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  writeJson(INPUTS.educationPacket, updatedEducationPacket);
  writeJson(INPUTS.countyPacket, updatedCountyPacket);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const stateReport = buildStateReport(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  const batchSummary = {
    state: 'arizona',
    classification: summary.classification,
    index_safe: summary.index_safe,
    education_packet_aligned: true,
    county_packet_aligned: true,
    statewide_education_fallback_rows: statewideEducationFallbackRows,
    county_doi_rows: doiRows,
    county_legacy_rows: legacyRows,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${stateReport}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch156ArizonaPacketAlignmentV1();
  console.log(JSON.stringify(result, null, 2));
}
