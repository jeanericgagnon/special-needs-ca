import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-mexico_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-mexico_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-mexico_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-mexico_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-mexico_next_action_queue_v2.jsonl'),
  countyPacket: path.join(generatedDir, 'new-mexico_county_local_disability_resources_hca_archive_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch196_new_mexico_hca_county_remainder_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch196-new-mexico-hca-county-remainder-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-mexico-california-grade-audit-report-v2.md'),
};

const COVERED_COUNTIES = [
  'Bernalillo',
  'Roosevelt',
  'Hidalgo',
  'Chaves',
  'Curry',
  'Dona Ana',
  'Eddy',
  'Guadalupe',
  'Sandoval',
  'Lincoln',
  'McKinley',
  'Quay',
  'Rio Arriba',
  'Los Alamos',
  'San Juan',
  'San Miguel',
  'Santa Fe',
  'Socorro',
  'Torrance',
  'Valencia',
  'Otero',
  'Lea',
  'Sierra',
  'Taos',
  'Grant',
  'Cibola',
  'De Baca',
  'Luna',
  'Colfax',
];

const MISSING_COUNTIES = ['Catron', 'Harding', 'Mora', 'Union'];

const COUNTY_REASON =
  'Reviewed 2026-06-23 the live official HCA Field Offices archive across pages 1 through 8 plus bounded same-host county searches. The archive now proves county-specific office posts for 29 of 33 New Mexico counties: Bernalillo, Roosevelt, Hidalgo, Chaves, Curry, Doña Ana, Eddy, Guadalupe, Sandoval, Lincoln, McKinley, Quay, Rio Arriba, Los Alamos, San Juan, San Miguel, Santa Fe, Socorro, Torrance, Valencia, Otero, Lea, Sierra, Taos, Grant, Cibola, De Baca, Luna, and Colfax. The remaining counties Catron, Harding, Mora, and Union still lack a reviewed office-routing leaf: HCA site search only surfaced a non-office service-expansion article for Harding/Union, a SNAP-loss article for Mora, and no Catron county office hit. county_local_disability_resources therefore remains blocked on a four-county official office-routing remainder, not on a dead or partial source.';

const LESSON_HEADING =
  '### Official Archive Pagination Can Collapse A \"Partial County\" Blocker Into A Small Remainder';
const LESSON_BODY =
  '*   **Lesson:** If an official state archive only looks partial on page 1 or 2, keep bounded pagination before preserving the blocker. New Mexico HCA Field Offices expanded from 7 named county leaves on the first two pages to 29/33 county-specific office posts by page 8, which cut the real blocker down to Catron, Harding, Mora, and Union only.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildCountyPacket() {
  return {
    state: 'new-mexico',
    family: 'county_local_disability_resources',
    repair_lane: 'official_hca_four_county_remainder_only',
    packet_complete_when:
      'A reviewed deterministic county map covers all 33 New Mexico counties from the HCA field-office archive or same-host official county office followups.',
    current_metrics: {
      countyTotal: 33,
      reviewedArchivePages: 8,
      coveredCountiesFromArchive: 29,
      missingCountyRemainder: 4,
      countyCompleteMapOnDisk: false,
    },
    covered_counties: COVERED_COUNTIES,
    missing_counties: MISSING_COUNTIES,
    representative_sources: [
      'https://www.hca.nm.gov/lookingforassistance/field_offices_1/',
      'https://www.hca.nm.gov/lookingforassistance/field_offices_1/page/4/?et_blog',
      'https://www.hca.nm.gov/lookingforassistance/field_offices_1/page/7/?et_blog',
      'https://www.hca.nm.gov/lookingforassistance/field_offices_1/page/8/?et_blog',
      'https://www.hca.nm.gov/2023/06/26/human-services-department-partners-with-union-and-harding-county-to-provide-expanded-access-to-services/',
    ],
    missing_county_followup_notes: [
      'Harding and Union only surfaced an HCA service-expansion article, not a county office-routing leaf.',
      'Mora only surfaced a SNAP-loss article, not a county office-routing leaf.',
      'Catron produced no bounded HCA county office hit in the current official-site search lane.',
    ],
    next_allowed_repairs: [
      'reviewed same-host HCA county office followups for Catron, Harding, Mora, and Union only',
      'reviewed successor-state county-office root on HCA if those four counties were moved off the archive',
    ],
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Mexico Blocker Packets v4',
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
    '## New county-local refinement',
    '',
    '- The official HCA Field Offices archive is no longer just a vague partial source: reviewed pages 1 through 8 preserve county-specific office posts for 29 of 33 counties.',
    '- The exact remaining county-local blocker is now only Catron, Harding, Mora, and Union.',
    '- Harding and Union currently surface only an HCA service-expansion article, Mora only surfaces a SNAP article, and Catron still has no reviewed HCA county-office hit in the bounded same-host search lane.',
    '',
    '## Completion decision',
    '',
    '- New Mexico remains `BLOCKED` and `index_safe=false`.',
    '- Education is still blocked on missing district-owned or county-grade local leaves, not on more statewide PED retries.',
    '- County-local is now blocked on a four-county official office-routing remainder, not on a dead or partial archive assumption.',
    '- VR remains blocked on the 401 DVR host plus zero reviewed alternate official roots.',
  ].join('\n') + '\n';
}

export function generateBatch196NewMexicoHcaCountyRemainderV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_hca_archive_29_of_33_counties_with_four_county_remainder',
          status_reason: COUNTY_REASON,
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: 'official_hca_archive_still_missing_four_county_office_routing_remainder',
          evidence: COUNTY_REASON,
          next_action: 'review_official_hca_or_successor_office_roots_for_catron_harding_mora_union_only',
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: 'blocked_hca_archive_29_of_33_counties_with_four_county_remainder',
      query_basis: 'Reviewed 2026-06-23 the live HCA field-office archive through page 8 plus bounded same-host county searches for the uncovered counties.',
      blocker_code: 'official_hca_archive_still_missing_four_county_office_routing_remainder',
      blocker_evidence: COUNTY_REASON,
      evidence_strength: 'mixed',
      sample_count: 4,
      samples: [
        {
          sample_name: 'HCA archive page 1',
          source_url: 'https://www.hca.nm.gov/lookingforassistance/field_offices_1/',
          final_url: 'https://www.hca.nm.gov/lookingforassistance/field_offices_1/',
          verification_status: 'reviewed',
          source_type: 'official_archive_page',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The archive page preserves county office posts including Roosevelt County, Hidalgo County, and Bernalillo County NW/SW.',
        },
        {
          sample_name: 'HCA archive page 4',
          source_url: 'https://www.hca.nm.gov/lookingforassistance/field_offices_1/page/4/?et_blog',
          final_url: 'https://www.hca.nm.gov/lookingforassistance/field_offices_1/page/4/?et_blog',
          verification_status: 'reviewed',
          source_type: 'official_archive_page',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The continuation pages add Lincoln County, McKinley County, Quay County, Rio Arriba and Los Alamos Counties, and San Juan County.',
        },
        {
          sample_name: 'HCA archive page 7',
          source_url: 'https://www.hca.nm.gov/lookingforassistance/field_offices_1/page/7/?et_blog',
          final_url: 'https://www.hca.nm.gov/lookingforassistance/field_offices_1/page/7/?et_blog',
          verification_status: 'reviewed',
          source_type: 'official_archive_page',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'Later archive pages extend coverage to Grant County, Cibola County, De Baca County, Eddy County (Carlsbad Area), and Luna County.',
        },
        {
          sample_name: 'Harding and Union search remainder',
          source_url: 'https://www.hca.nm.gov/2023/06/26/human-services-department-partners-with-union-and-harding-county-to-provide-expanded-access-to-services/',
          final_url: 'https://www.hca.nm.gov/2023/06/26/human-services-department-partners-with-union-and-harding-county-to-provide-expanded-access-to-services/',
          verification_status: 'blocked',
          source_type: 'same_host_non_office_article',
          source_table: 'reviewed_official_site_search',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'Bounded same-host search for the remaining counties surfaced a service-expansion article for Harding and Union, but not a county office-routing leaf.',
        },
      ],
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: 'official_hca_archive_still_missing_four_county_office_routing_remainder',
          next_action: 'review_official_hca_or_successor_office_roots_for_catron_harding_mora_union_only',
          evidence: 'Reviewed HCA archive pages 1 through 8 now cover 29 of 33 counties; only Catron, Harding, Mora, and Union still lack reviewed county office-routing proof.',
        }
      : row
  ));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: 'district_leafs_missing_and_county_local_now_reduced_to_four_county_office_routing_remainder',
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? {
            ...row,
            failure_code: 'official_hca_archive_still_missing_four_county_office_routing_remainder',
            evidence: COUNTY_REASON,
            next_action: 'review_official_hca_or_successor_office_roots_for_catron_harding_mora_union_only',
          }
        : row
    )),
  };

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const countyPacket = buildCountyPacket();
  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch196_new_mexico_hca_county_remainder_v1',
    state: 'new-mexico',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    reviewedArchivePages: countyPacket.current_metrics.reviewedArchivePages,
    coveredCountiesFromArchive: countyPacket.current_metrics.coveredCountiesFromArchive,
    missingCountyRemainder: countyPacket.current_metrics.missingCountyRemainder,
    missingCounties: countyPacket.missing_counties,
    lesson_added: lessonAdded,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.countyPacket, countyPacket);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch196NewMexicoHcaCountyRemainderV1();
}
