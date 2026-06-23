import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-york_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-york_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-york_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-york_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-york_next_action_queue_v2.jsonl'),
  educationPacket: path.join(generatedDir, 'new-york_district_or_county_education_routing_boces_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch255_new_york_nysed_boces_remainder_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch255-new-york-nysed-boces-remainder-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-york-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'official_nysed_boces_pages_cover_non_nyc_counties_but_no_reviewed_nyc_borough_route_and_no_public_ldss_replacement';
const EDUCATION_FAILURE_CODE = 'official_nysed_boces_pages_cover_57_non_nyc_counties_but_no_reviewed_nyc_borough_route';
const EDUCATION_NEXT_ACTION = 'hold_blocked_until_reviewed_official_nyc_borough_special_education_route_exists';
const EDUCATION_REASON =
  'Reviewed 2026-06-23 one bounded official NYSED education replacement lane beyond the saved three BOCES leaves. The official Joint Management Teams page at `https://www.p12.nysed.gov/ds/jmt.html` and the official Directory of District Superintendents page at `https://www.p12.nysed.gov/ds/superintendents.html` are both live and publicly reviewable. Together they now prove county-bearing BOCES routing for the non-NYC portion of the state: the pages preserve county-cluster BOCES groupings and district-superintendent contact rows for 57 non-NYC counties such as Albany, Broome, Cattaraugus, Dutchess, Erie, Monroe, Nassau, Onondaga, Suffolk, Westchester, and Wyoming. But that same official lane still exposes no reviewed borough-specific routing for Bronx, Kings, Queens, Richmond, or a clear New York County / Manhattan special-education route. New York education therefore no longer looks like a three-leaf-only state; it is now blocked specifically on the NYC borough remainder.';

const LESSON_HEADING = '### County-Cluster BOCES Pages Can Collapse A Statewide Education Blocker To An NYC Remainder';
const LESSON_BODY =
  '*   **Lesson:** If an official state education page groups BOCES by county clusters and a companion superintendent directory preserves contact rows for those same BOCES, use that pair to shrink the blocker before authoring more district leaves. New York NYSED `jmt.html` plus `superintendents.html` proved 57 non-NYC counties at once, leaving only the NYC borough route as the real remainder.';

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

function buildEducationPacket() {
  return {
    state: 'new-york',
    family: 'district_or_county_education_routing',
    repair_lane: 'official_boces_county_cluster_plus_nyc_remainder_only',
    packet_complete_when:
      'A reviewed official NYC borough special-education route complements the official NYSED county-cluster BOCES pages, or a broader official county-grade local route replaces both.',
    current_metrics: {
      countyTotal: 62,
      nonNycCountiesCoveredByOfficialBocesPages: 57,
      nycBoroughRemainderCount: 5,
      reviewedOfficialStatePages: 2,
      legacyExactLeafCount: 3,
    },
    representative_sources: [
      'https://www.p12.nysed.gov/ds/jmt.html',
      'https://www.p12.nysed.gov/ds/superintendents.html',
      'https://www.schools.nyc.gov/learning/special-education',
      'https://www.schools.nyc.gov/learning/special-education/help/contacts-and-resources',
      'https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education',
    ],
    covered_non_nyc_examples: [
      'Albany-Schoharie-Schenectady-Saratoga (Capital Region BOCES)',
      'Broome-Delaware-Tioga BOCES',
      'Cattaraugus-Allegany-Erie-Wyoming BOCES',
      'Putnam-Northern Westchester',
      'Wayne-Finger Lakes BOCES',
    ],
    remaining_nyc_boroughs: ['Bronx', 'Kings', 'New York', 'Queens', 'Richmond'],
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New York Blocker Packets v5',
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
    '## Education refinement',
    '',
    '- The official NYSED Joint Management Teams and District Superintendents pages now prove county-bearing BOCES routing for the non-NYC portion of the state.',
    '- That collapses the old “three exact leaves only” story into a more precise NYC-borough remainder.',
    '- The remaining education blocker is now the lack of a reviewed official NYC borough special-education route for Bronx, Kings, New York/Manhattan, Queens, and Richmond.',
    '',
    '## Completion decision',
    '',
    '- New York remains `BLOCKED` and `index_safe=false`.',
    '- County-local remains blocked because both the original `health.ny.gov` Medicaid host family and the bounded OTDA replacement-host family failed in live review.',
    '- Education remains blocked, but now specifically on the NYC borough remainder instead of a generic statewide leaf shortage.',
    '- PTI remains repaired and is not a blocker.',
  ].join('\n') + '\n';
}

export function generateBatch255NewYorkNysedBocesRemainderRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_official_boces_pages_cover_non_nyc_counties_but_nyc_borough_route_missing',
          status_reason: EDUCATION_REASON,
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: EDUCATION_FAILURE_CODE,
          evidence: EDUCATION_REASON,
          next_action: EDUCATION_NEXT_ACTION,
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      family_status: 'blocked_official_boces_pages_cover_non_nyc_counties_but_nyc_borough_route_missing',
      evidence_strength: 'medium',
      query_basis: 'Reviewed 2026-06-23 the official NYSED Joint Management Teams and District Superintendents pages plus the exact NYC DOE special-education root and child help pages.',
      blocker_code: EDUCATION_FAILURE_CODE,
      blocker_evidence: EDUCATION_REASON,
      sample_count: 5,
      samples: [
        {
          sample_name: 'NYSED Joint Management Teams',
          source_url: 'https://www.p12.nysed.gov/ds/jmt.html',
          final_url: 'https://www.p12.nysed.gov/ds/jmt.html',
          verification_status: 'reviewed',
          source_type: 'official_county_cluster_boces_page',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The official Joint Management Teams page groups BOCES by county-bearing clusters such as Albany-Schoharie-Schenectady-Saratoga, Broome-Delaware-Tioga, Cattaraugus-Allegany-Erie-Wyoming, and Ontario-Seneca-Yates-Cayuga-Wayne.',
        },
        {
          sample_name: 'NYSED Directory of District Superintendents',
          source_url: 'https://www.p12.nysed.gov/ds/superintendents.html',
          final_url: 'https://www.p12.nysed.gov/ds/superintendents.html',
          verification_status: 'reviewed',
          source_type: 'official_boces_contact_directory',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The official superintendent directory preserves BOCES contact rows with addresses and phones for county-cluster regions such as Capital Region BOCES, Broome-Delaware-Tioga BOCES, and Cattaraugus-Allegany-Erie Wyoming BOCES.',
        },
        {
          sample_name: 'NYC DOE Special Education root',
          source_url: 'https://www.schools.nyc.gov/learning/special-education',
          final_url: 'https://www.schools.nyc.gov/learning/special-education',
          verification_status: 'reviewed',
          source_type: 'official_nyc_special_education_root',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The official NYC DOE Special Education root is live and links exact child routes for Contacts and Resources, Committees on Special Education, Family Resources, and District 75.',
        },
        {
          sample_name: 'NYC DOE Contacts and Resources',
          source_url: 'https://www.schools.nyc.gov/learning/special-education/help/contacts-and-resources',
          final_url: 'https://www.schools.nyc.gov/learning/special-education/help/contacts-and-resources',
          verification_status: 'reviewed',
          source_type: 'official_nyc_special_education_help_page',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The official Contacts and Resources page is live and explicitly links Committee on Special Education, Family Welcome Centers, and District 75 resources, but this bounded raw pass did not yet recover a borough-specific routing contract from the page body.',
        },
        {
          sample_name: 'NYC DOE Committees on Special Education',
          source_url: 'https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education',
          final_url: 'https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education',
          verification_status: 'blocked',
          source_type: 'official_nyc_special_education_remainder',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The official CSE page is live and role-bearing, but the bounded raw extraction still did not materialize a borough-specific special-education routing table for Bronx, Kings, New York/Manhattan, Queens, and Richmond.',
        },
      ],
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: EDUCATION_FAILURE_CODE,
          next_action: EDUCATION_NEXT_ACTION,
          evidence: 'Reviewed official NYSED BOCES county-cluster pages now cover the 57 non-NYC counties, but the exact NYC DOE special-education pages still need a reviewed borough-specific routing contract for Bronx, Kings, New York/Manhattan, Queens, and Richmond.',
        }
      : row
  ));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? {
            ...row,
            failure_code: EDUCATION_FAILURE_CODE,
            evidence: EDUCATION_REASON,
            next_action: EDUCATION_NEXT_ACTION,
          }
        : row
    )),
  };

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const educationPacket = buildEducationPacket();
  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch255_new_york_nysed_boces_remainder_refresh_v1',
    state: 'new-york',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    nonNycCountiesCoveredByOfficialBocesPages: 57,
    nycBoroughRemainderCount: 5,
    lesson_added: lessonAdded,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.educationPacket, educationPacket);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch255NewYorkNysedBocesRemainderRefreshV1();
}
