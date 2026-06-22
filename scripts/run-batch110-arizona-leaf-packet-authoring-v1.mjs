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
  failure: path.join(generatedDir, 'arizona_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'arizona_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'arizona_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch110_arizona_leaf_packet_authoring_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch110-arizona-leaf-packet-authoring-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
  educationPacket: path.join(generatedDir, 'arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'arizona_county_local_disability_resources_leaf_authoring_packet_v1.json'),
};

const PRIMARY_GAP = 'official_roots_challenged_and_local_leaf_packets_authored_but_unverified';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 live Arizona Department of Education special-education candidates. The root, parental-rights, dispute-resolution, az-find, ESSO, publications, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live school_district table still contains 15/15 Arizona rows pointing at https://www.azed.gov/specialeducation as generic county fallback evidence, but a county-by-county local leaf authoring packet now exists on disk at data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json so later repairs can target district-owned leaves instead of re-reading the challenged state root.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table still contains 14 Arizona rows anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row anchored to the generic legacy root https://dhhs.arizona.gov/locations, but a county-by-county local office authoring packet now exists on disk at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json so later repairs can replace those fallback rows with reviewed county-specific leaves.';

const EDUCATION_COUNTIES = [
  'apache-az', 'cochise-az', 'coconino-az', 'gila-az', 'graham-az',
  'greenlee-az', 'la-paz-az', 'maricopa-az', 'mohave-az', 'navajo-az',
  'pima-az', 'pinal-az', 'santa-cruz-az', 'yavapai-az', 'yuma-az',
];

const COUNTY_LOCAL_COUNTIES = [
  'apache-az', 'cochise-az', 'coconino-az', 'gila-az', 'graham-az',
  'greenlee-az', 'la-paz-az', 'maricopa-az', 'mohave-az', 'navajo-az',
  'pima-az', 'pinal-az', 'santa-cruz-az', 'yavapai-az', 'yuma-az',
];

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
    '- The official state education and DES roots are still challenged, so this pass did not claim local proof.',
    '- The missing control-plane gap is now closed: both blocked families have deterministic Arizona leaf authoring packets on disk so later bounded repairs can target exact district-owned or county-specific leaves instead of generic fallbacks.',
  ].join('\n') + '\n';
}

export function generateBatch110ArizonaLeafPacketAuthoringV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const educationPacket = {
    state: 'arizona',
    state_code: 'AZ',
    family: 'district_or_county_education_routing',
    repair_lane: 'county_district_leaf_repair',
    purpose: 'Deterministic authoring packet for replacing generic statewide Arizona education fallback rows with district-owned special-education or student-services leaves.',
    current_problem_metrics: {
      genericFallbackCountyRows: 15,
      challengedOfficialRoots: 8,
      authoredExactLeafCount: 0,
    },
    exact_target_goals: [
      'district special education page',
      'student services or exceptional student services page',
      'district special education contact or department page',
    ],
    exact_target_terms: [
      'special education',
      'exceptional student services',
      'student services',
      'special services',
      'parent rights',
      'special education contact',
    ],
    representative_sources: [
      'https://www.azed.gov/specialeducation',
    ],
    root_domains_to_review: [
      'district-owned Arizona K-12 domains once identified from reviewed county/district routing work',
      'https://www.azed.gov/specialeducation',
    ],
    affected_counties: EDUCATION_COUNTIES,
    packet_complete_when: 'At least one reviewed district-owned education-routing leaf is authored for every Arizona county without relying on the challenged AZED root.',
  };

  const countyPacket = {
    state: 'arizona',
    state_code: 'AZ',
    family: 'county_local_disability_resources',
    repair_lane: 'county_district_leaf_repair',
    purpose: 'Deterministic authoring packet for replacing DOI and generic locator fallback rows with reviewed Arizona county-specific Medicaid or DES office leaves.',
    current_problem_metrics: {
      doiFallbackCountyRows: 14,
      genericLegacyRootRows: 1,
      challengedOfficialRoots: 8,
      authoredExactLeafCount: 0,
    },
    exact_target_goals: [
      'county or regional FAA office page',
      'county benefits office contact page',
      'official office directory or locator leaf with address and phone',
    ],
    exact_target_terms: [
      'office',
      'locations',
      'family assistance administration',
      'faa',
      'benefits office',
      'contact',
      'address',
    ],
    representative_sources: [
      'https://doi.org/10.7910/DVN/AVRHMI',
      'https://dhhs.arizona.gov/locations',
    ],
    root_domains_to_review: [
      'https://des.az.gov/',
      'https://www.azahcccs.gov/',
    ],
    affected_counties: COUNTY_LOCAL_COUNTIES,
    packet_complete_when: 'At least one reviewed county-specific office leaf is authored for every Arizona county without relying on DOI or generic state-root placeholders.',
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, status_reason: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, status_reason: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, evidence: EDUCATION_EVIDENCE, next_action: 'use_authored_arizona_education_leaf_packet_to_collect_district_owned_leaves' };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, evidence: COUNTY_EVIDENCE, next_action: 'use_authored_arizona_county_local_packet_to_collect_county_specific_office_leaves' };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, blocker_evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, blocker_evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, next_action: 'use_authored_arizona_education_leaf_packet_to_collect_district_owned_leaves', evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, next_action: 'use_authored_arizona_county_local_packet_to_collect_county_specific_office_leaves', evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        failure_code: 'official_education_root_challenge_and_county_fallback_only_rows',
        evidence: EDUCATION_EVIDENCE,
      },
      {
        family: 'county_local_disability_resources',
        failure_code: 'official_local_office_roots_challenge_and_doi_fallback_rows',
        evidence: COUNTY_EVIDENCE,
      },
    ],
  };

  writeJson(OUTPUTS.educationPacket, educationPacket);
  writeJson(OUTPUTS.countyPacket, countyPacket);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  writeJson(OUTPUTS.summary, {
    batch: 'batch_110_arizona_leaf_packet_authoring_v1',
    generated_at: '2026-06-22T18:30:00.000Z',
    state: 'arizona',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    authored_packets: [
      path.relative(repoRoot, OUTPUTS.educationPacket),
      path.relative(repoRoot, OUTPUTS.countyPacket),
    ],
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Arizona Leaf Packet Authoring Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- primary_gap_reason: ${updatedSummary.primary_gap_reason}`,
      '',
      '## Authored packets',
      '',
      `- ${path.relative(repoRoot, OUTPUTS.educationPacket)}`,
      `- ${path.relative(repoRoot, OUTPUTS.countyPacket)}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch110ArizonaLeafPacketAuthoringV1();
}
