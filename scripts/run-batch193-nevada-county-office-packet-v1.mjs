import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'nevada_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'nevada_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'nevada_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'nevada_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'nevada_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  packet: path.join(generatedDir, 'nevada_county_local_disability_resources_welfare_office_packet_v1.json'),
  batchSummary: path.join(generatedDir, 'batch193_nevada_county_office_packet_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch193-nevada-county-office-packet-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'nevada-california-grade-audit-report-v2.md'),
};

const COUNTY_FAILURE =
  'official_welfare_district_office_pages_live_but_no_county_coverage_contract';
const COUNTY_REASON =
  'Reviewed 2026-06-23 bounded live probes on the official Nevada DSS welfare-office stack. The stale parent office root no longer preserves a county-grade directory contract, and the live Contact, Welfare District Offices-North, and Welfare District Offices-South pages expose exact office leaves with real addresses and phones but zero county terms, zero county-served labels, and no county filter or county assignment. Nevada therefore still lacks a reviewed official county-to-office routing contract for all 17 counties.';
const COUNTY_NEXT =
  'hold_blocked_until_official_county_to_welfare_office_contract_is_reviewed';

const LESSON_HEADING =
  '### Stale Parent Locators Should Not Override Live Child Leaves';
const LESSON_BODY =
  '*   **Lesson:** If a statewide office root goes stale or retargets but its exact child office leaves are still live, retire the parent root and evaluate the child leaves directly. Nevada DSS kept live North/South welfare office pages after the older parent route stopped being a usable county contract, which let the blocker be narrowed without reopening broad locator guessing.';

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

function buildPacket() {
  return {
    state: 'nevada',
    family: 'county_local_disability_resources',
    failure_code: COUNTY_FAILURE,
    repair_lane: 'browser_or_cached_capture_only',
    packet_complete_when:
      'Nevada can reopen only when a reviewed first-party DSS or sibling official page exposes a truthful county-to-office contract, county-served labels, or a machine-readable county filter for all 17 counties.',
    current_metrics: {
      countyTotal: 17,
      liveChildLeavesReviewed: 2,
      liveContactHubReviewed: true,
      staleParentRootRetired: true,
      zeroCountyTokensOnReviewedPages: 3,
      countyServedFieldPresent: false,
      countyFilterPresent: false,
    },
    representative_sources: [
      {
        label: 'Stale parent office root',
        url: 'https://dwss.nv.gov/Contact/Welfare_District_Offices/',
        status: 'stale_parent_root',
        evidence:
          'The older parent office route no longer acts as a usable county-office contract and should not be used as Nevada county-local proof.',
      },
      {
        label: 'Nevada DSS Contact hub',
        url: 'https://www.dss.nv.gov/contact/',
        status: 'live_contact_hub_without_county_contract',
        evidence:
          'The live contact hub preserves exact North and South welfare office leaves, but its public HTML exposes zero county terms and no county-served assignment.',
      },
      {
        label: 'Welfare District Offices-North',
        url: 'https://www.dss.nv.gov/contact/welfare-district-offices-north/',
        status: 'live_office_leaf_without_county_contract',
        evidence:
          'The North page lists exact offices such as Carson City, Elko / Winnemucca, Ely, Fallon, Hawthorne, Reno, Sparks, and Yerington with addresses and phones, but no county labels or county-served fields.',
      },
      {
        label: 'Welfare District Offices-South',
        url: 'https://www.dss.nv.gov/contact/welfare-district-offices-south/',
        status: 'live_office_leaf_without_county_contract',
        evidence:
          'The South page lists exact offices such as Belrose, Cambridge, Decatur, Eastern, Henderson, Nellis, Owens, Pahrump, Spring Mountain, and Flamingo with addresses and phones, but no county labels or county-served fields.',
      },
    ],
    zero_county_term_probes: [
      {
        url: 'https://www.dss.nv.gov/contact/',
        probes: {
          county: 0,
          counties: 0,
          county_served: 0,
        },
      },
      {
        url: 'https://www.dss.nv.gov/contact/welfare-district-offices-north/',
        probes: {
          county: 0,
          counties: 0,
          county_served: 0,
        },
      },
      {
        url: 'https://www.dss.nv.gov/contact/welfare-district-offices-south/',
        probes: {
          county: 0,
          counties: 0,
          county_served: 0,
        },
      },
    ],
    next_roots_if_state_reopens: [
      'reviewed first-party DSS county-to-office export or directory contract',
      'reviewed official statewide county filter or service-area contract on a DSS sibling host',
    ],
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows, packetPath) {
  return [
    '# Nevada California-Grade County Office Packet v3',
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
    '## Packetized blocker',
    '',
    `- County-local packet saved at \`${path.relative(repoRoot, packetPath)}\`.`,
    '- The stale parent office root is now retired from future Nevada county-local retries.',
    '- The live DSS contact stack remains useful for evidence, but the reviewed HTML still exposes zero county terms and no county-served contract.',
    '',
    '## Completion decision',
    '',
    '- Nevada remains `BLOCKED` and `index_safe=false`.',
    '- Education routing stays cleared from the official county-district mapping already on disk.',
    '- County/local disability resources remain blocked because no reviewed official Nevada page yet maps all 17 counties to a welfare office or service area.',
  ].join('\n') + '\n';
}

export function generateBatch193NevadaCountyOfficePacketV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: 'blocked_live_welfare_office_pages_without_county_contract',
      status_reason: COUNTY_REASON,
    };
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      failure_code: COUNTY_FAILURE,
      evidence: COUNTY_REASON,
      next_action: COUNTY_NEXT,
    };
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: 'blocked_live_welfare_office_pages_without_county_contract',
      query_basis:
        'Reviewed 2026-06-23 the stale parent office root plus the live Nevada DSS Contact, Welfare District Offices-North, and Welfare District Offices-South pages.',
      blocker_code: COUNTY_FAILURE,
      blocker_evidence: COUNTY_REASON,
      sample_count: 4,
      samples: [
        {
          sample_name: 'Stale Nevada parent office root',
          source_url: 'https://dwss.nv.gov/Contact/Welfare_District_Offices/',
          final_url: 'https://www.dss.nv.gov/contact/designation-of-authorized-representative/',
          verification_status: 'blocked',
          source_type: 'stale_parent_route_not_county_contract',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet:
            'The older parent office route no longer preserves a welfare-office county contract and should be retired from Nevada county-local proof.',
        },
        {
          sample_name: 'Nevada DSS Contact hub',
          source_url: 'https://www.dss.nv.gov/contact/',
          final_url: 'https://www.dss.nv.gov/contact/',
          verification_status: 'reviewed',
          source_type: 'official_contact_hub_with_exact_office_leaves',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet:
            'The official DSS contact hub links exact North and South welfare office leaves, but the reviewed HTML exposes zero county terms and no county-served labels.',
        },
        {
          sample_name: 'Welfare District Offices-North',
          source_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-north/',
          final_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-north/',
          verification_status: 'reviewed',
          source_type: 'official_regional_office_leaf_without_county_contract',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet:
            'The live North welfare office page lists Carson City, Elko / Winnemucca, Ely, Fallon, Hawthorne, Reno, Sparks, and Yerington office details, but no county labels or county-served fields.',
        },
        {
          sample_name: 'Welfare District Offices-South',
          source_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-south/',
          final_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-south/',
          verification_status: 'reviewed',
          source_type: 'official_regional_office_leaf_without_county_contract',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet:
            'The live South welfare office page lists Belrose, Cambridge, Decatur, Eastern, Henderson, Nellis, Owens, Pahrump, Spring Mountain, and Flamingo office details, but no county labels or county-served fields.',
        },
      ],
    };
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      failure_code: COUNTY_FAILURE,
      next_action: COUNTY_NEXT,
      evidence: COUNTY_REASON,
    };
  });

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 92,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: 'live_welfare_office_pages_without_county_contract',
    complete_ready: false,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: COUNTY_FAILURE,
        evidence: COUNTY_REASON,
        next_action: COUNTY_NEXT,
      },
    ],
  };

  const packet = buildPacket();
  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch193_nevada_county_office_packet_v1',
    state: 'nevada',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    packet_written: true,
    live_child_leaves_reviewed: 2,
    stale_parent_root_retired: true,
    zero_county_term_pages: 3,
    county_total: 17,
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    lesson_added: lessonAdded,
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, OUTPUTS.packet);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(OUTPUTS.packet, packet);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch193NevadaCountyOfficePacketV1();
}
