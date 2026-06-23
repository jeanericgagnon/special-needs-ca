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
  stateReport: path.join(docsGeneratedDir, 'new-york-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch294_new_york_nyc_cse_borough_clear_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch294-new-york-nyc-cse-borough-clear-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'nygov_linked_exact_otda_successor_leaves_still_reset_while_health_ny_ldss_family_remains_unusable';
const COUNTY_FAILURE_CODE =
  'nygov_links_exact_otda_successor_leaves_but_successor_host_still_resets';
const COUNTY_NEXT_ACTION =
  'hold_blocked_until_public_otda_successor_leaf_or_county_owned_locator_is_verified';
const COUNTY_REASON =
  'Reviewed 2026-06-23 one bounded official New York county-local replacement lane using the public `ny.gov` service stack as the discovery surface rather than speculative OTDA host guessing. The original `health.ny.gov` Medicaid lane is still blocked host-wide: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all remain unusable for county-local proof. The live `https://www.ny.gov/services/social-programs` page and `https://www.ny.gov/services/apply-cooling-assistance` now strengthen the blocker instead of clearing it: both public state pages explicitly link exact OTDA successor leaves such as `https://otda.ny.gov/programs/heap/contacts/`, `https://otda.ny.gov/programs/applications/4826.pdf`, `https://otda.ny.gov/programs/snap/work-requirements.asp`, and `https://mybenefits.ny.gov/`. But the exact OTDA benefit and contact leaves still fail on the current host family, including `otda.ny.gov/programs/heap/contacts/`, `otda.ny.gov/programs/heap/`, `otda.ny.gov/programs/applications/4826.pdf`, `otda.ny.gov/workingfamilies/dss.asp`, and the apex `otda.ny.gov` plus `www.otda.ny.gov` roots, all of which reset the connection in the bounded lane. New York therefore remains blocked on county-local not because a successor path is unknown, but because the public New York portal points to an exact official OTDA successor family that is still not reviewable from the repo-side verification lane.';

const EDUCATION_REASON =
  'Reviewed 2026-06-23 one more bounded official NYC education lane on the live `https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education` page. The existing NYSED Joint Management Teams and District Superintendents pages already proved county-bearing BOCES routing for the 57 non-NYC counties. The live NYC DOE CSE page now closes the five-borough remainder directly: it publishes CPSE/CSE district groupings, emails, addresses, and phone numbers for Bronx (`CSE1` districts 7, 9, 10 and `CSE2` districts 8, 11, 12), Queens (`CSE3` districts 25, 26, 28, 29 and `CSE4` districts 24, 27, 30), Brooklyn (`CSE5` districts 19, 23, 32; `CSE6` districts 17, 18, 22; `CSE7` districts 20, 21; `CSE8` districts 13, 14, 15, 16), Manhattan / New York County (`CSE9` districts 1, 2, 4 and `CSE10` districts 3, 5, 6), and Staten Island / Richmond County (`CSE11` district 31). New York education therefore now has reviewed official routing across all 62 counties through one county-cluster BOCES lane plus one borough-explicit NYC DOE CSE lane.';

const LESSON_HEADING =
  '### Official CSE Office Tables Can Clear NYC Borough Routing';
const LESSON_BODY =
  '*   **Lesson:** If a live official special-education committee page publishes district groupings plus office addresses, phones, and emails, treat that as a real local-routing contract. New York cleared the NYC remainder once the official `Committees on Special Education` page itself proved Bronx, Brooklyn, Manhattan, Queens, and Staten Island committee coverage.';

const PRIORITY_ORDER = [
  'utah',
  'kansas',
  'nebraska',
  'nevada',
  'florida',
  'alaska',
  'south-carolina',
  'north-carolina',
  'new-york',
  'oklahoma',
  'oregon',
  'ohio',
  'minnesota',
  'maine',
  'idaho',
  'arizona',
  'massachusetts',
  'new-mexico',
  'south-dakota',
  'rhode-island',
  'virginia',
  'west-virginia',
  'north-dakota',
  'wisconsin',
  'washington',
  'tennessee',
  'vermont',
  'wyoming',
  'new-hampshire',
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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New York Blocker Packets v7',
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
    '- The official NYSED Joint Management Teams and District Superintendents pages still prove county-bearing BOCES routing for the 57 non-NYC counties.',
    '- The official NYC DOE Committees on Special Education page now closes the five-borough remainder with district groupings, emails, addresses, and phone numbers for Bronx, Brooklyn, Manhattan, Queens, and Staten Island.',
    '- Education is no longer a New York blocker.',
    '',
    '## County-local refinement',
    '',
    '- The live `ny.gov` service stack still proves New York intends OTDA to be the successor local-district lane: `Social Programs` and `Apply for Cooling Assistance` both link exact OTDA contact or application leaves.',
    '- The `Apply for Cooling Assistance` page specifically labels the OTDA successor contact path as `HEAP Local District Contact`, which makes the replacement lane exact enough to test but still not reviewable enough to clear.',
    '- Those exact OTDA successor leaves still fail in bounded live review, so the blocker remains on the successor host family rather than on an unknown replacement search.',
    '',
    '## Completion decision',
    '',
    '- New York remains `BLOCKED` and `index_safe=false`.',
    '- Education is now verified across all 62 counties.',
    '- County-local remains blocked because the old `health.ny.gov` LDSS family is unusable and the exact OTDA successor leaves publicly linked by `ny.gov` still reset the connection.',
    '- PTI remains repaired and is not a blocker.',
  ].join('\n') + '\n';
}

function buildAllStateReport(audit) {
  const completeStates = audit.states.filter((row) => row.classification === 'COMPLETE').map((row) => row.stateName);
  const blockedStates = audit.states.filter((row) => row.classification === 'BLOCKED').map((row) => row.stateName);
  return [
    '# All-State California-Grade Audit Report v3',
    '',
    'This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.',
    '',
    '## Packet coverage',
    '',
    `- packet_coverage_count: ${audit.packetCoverageCount}`,
    `- packet_missing_states: ${audit.packetMissingStates.length ? audit.packetMissingStates.join(', ') : 'none'}`,
    '',
    '## Classification counts',
    '',
    `- COMPLETE: ${audit.classifications.COMPLETE}`,
    `- BLOCKED: ${audit.classifications.BLOCKED}`,
    '',
    `- index-safe states: ${audit.indexSafeCount}`,
    `- complete states: ${completeStates.join(', ')}`,
    `- blocked states: ${blockedStates.join(', ')}`,
    '',
    '## Notes',
    '',
    '- Texas remains COMPLETE/index-safe from v10.',
    '- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.',
    '- New York remains blocked, but it is now blocked only on county-local routing: official NYSED BOCES pages plus the official NYC DOE CSE page now cover education across all 62 counties.',
    '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.',
    '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.',
  ].join('\n') + '\n';
}

function buildHandoff(allStateAudit) {
  const blockedSet = new Set(
    allStateAudit.states.filter((row) => row.classification === 'BLOCKED').map((row) => row.stateId)
  );
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));
  const newYorkIndex = PRIORITY_ORDER.indexOf('new-york');
  const nextStates = PRIORITY_ORDER
    .slice(newYorkIndex + 1)
    .filter((stateId) => blockedSet.has(stateId))
    .slice(0, 10)
    .map((stateId) => {
      const row = allStateAudit.states.find((state) => state.stateId === stateId);
      return row ? row.stateName : stateId;
    });

  return [
    '# Gemini Source Scout Handoff',
    '',
    'Updated: 2026-06-23',
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
    '## Current Focus State: Oklahoma',
    '',
    '### Blocker Reason',
    '',
    'Oklahoma has one remaining California-grade blocker: `county_local_disability_resources`. Education is already cleared by the current official OSDE State School and District Directory, but the county-local lane still depends on a dead statewide locator host and DOI planning rows.',
    '',
    '### Exact Evidence Needed',
    '',
    '- A live official Oklahoma county-grade local office directory that replaces the dead `https://dhhs.oklahoma.gov/locations` host.',
    '- County-owned or state-maintained local office leaves with real county routing, not planning placeholders or DOI mirrors.',
    '- Any public Oklahoma county-mapped office export, directory, or API that materializes county-local disability resource routing directly.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Dead Oklahoma DHHS locator host](https://dhhs.oklahoma.gov/locations)',
    '- [Official Oklahoma State School Directory](https://oklahoma.gov/education/resources/state-school-directory.html)',
    '- [Official Oklahoma District Directory download lane](https://oklahoma.gov/education/resources/state-school-directory.html)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any current Oklahoma.gov county-local office directory replacing the dead DHHS locator host.',
    '- Any official county-owned DHS or local human-services office pages that preserve county identity and direct contact routing.',
    '- Any public Oklahoma directory export or API that maps counties to local assistance or disability-resource offices.',
    '',
    '## Next State Order After New York',
    '',
    ...nextStates.map((stateName, index) => `${index + 1}. ${stateName}`),
  ].join('\n') + '\n';
}

function buildEducationPacket() {
  return {
    state: 'new-york',
    family: 'district_or_county_education_routing',
    repair_lane: 'official_boces_county_cluster_plus_official_nyc_cse_borough_routing',
    packet_complete_when:
      'The official NYSED BOCES county-cluster pages and the official NYC DOE CSE page together prove routing across all 62 counties.',
    current_metrics: {
      countyTotal: 62,
      nonNycCountiesCoveredByOfficialBocesPages: 57,
      nycBoroughRemainderCount: 0,
      reviewedOfficialStatePages: 2,
      reviewedOfficialNycPages: 1,
      reviewedOfficialNycBoroughContacts: 5,
    },
    representative_sources: [
      'https://www.p12.nysed.gov/ds/jmt.html',
      'https://www.p12.nysed.gov/ds/superintendents.html',
      'https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education',
    ],
    covered_non_nyc_examples: [
      'Albany-Schoharie-Schenectady-Saratoga (Capital Region BOCES)',
      'Broome-Delaware-Tioga BOCES',
      'Cattaraugus-Allegany-Erie-Wyoming BOCES',
      'Putnam-Northern Westchester',
      'Wayne-Finger Lakes BOCES',
    ],
    covered_nyc_borough_routes: {
      bronx: ['CSE1 districts 7, 9, 10', 'CSE2 districts 8, 11, 12'],
      kings: ['CSE5 districts 19, 23, 32', 'CSE6 districts 17, 18, 22', 'CSE7 districts 20, 21', 'CSE8 districts 13, 14, 15, 16'],
      new_york: ['CSE9 districts 1, 2, 4', 'CSE10 districts 3, 5, 6'],
      queens: ['CSE3 districts 25, 26, 28, 29', 'CSE4 districts 24, 27, 30'],
      richmond: ['CSE11 district 31'],
    },
  };
}

export function generateBatch294NewYorkNycCseBoroughClearV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: EDUCATION_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'district_or_county_education_routing')
    .map((row) => (
      row.family === 'county_local_disability_resources'
        ? {
            ...row,
            failure_code: COUNTY_FAILURE_CODE,
            evidence: COUNTY_REASON,
            next_action: COUNTY_NEXT_ACTION,
          }
        : row
    ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'high',
        query_basis: 'Reviewed 2026-06-23 the official NYSED Joint Management Teams and District Superintendents pages plus the official NYC DOE Committees on Special Education page.',
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 7,
        samples: [
          {
            sample_name: 'NYSED Joint Management Teams',
            source_url: 'https://www.p12.nysed.gov/ds/jmt.html',
            final_url: 'https://www.p12.nysed.gov/ds/jmt.html',
            verification_status: 'reviewed',
            source_type: 'official_county_cluster_boces_page',
            source_table: 'batch294_new_york_nyc_cse_borough_clear',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The official Joint Management Teams page groups BOCES by county-bearing clusters such as Albany-Schoharie-Schenectady-Saratoga, Broome-Delaware-Tioga, and Cattaraugus-Allegany-Erie-Wyoming.'
          },
          {
            sample_name: 'NYSED Directory of District Superintendents',
            source_url: 'https://www.p12.nysed.gov/ds/superintendents.html',
            final_url: 'https://www.p12.nysed.gov/ds/superintendents.html',
            verification_status: 'reviewed',
            source_type: 'official_boces_contact_directory',
            source_table: 'batch294_new_york_nyc_cse_borough_clear',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The official superintendent directory preserves BOCES contact rows with addresses and phones for county-cluster regions such as Capital Region BOCES, Broome-Delaware-Tioga BOCES, and Cattaraugus-Allegany-Erie Wyoming BOCES.'
          },
          {
            sample_name: 'NYC DOE Bronx CSE routing',
            source_url: 'https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education',
            final_url: 'https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education',
            verification_status: 'reviewed',
            source_type: 'official_nyc_cse_borough_contact_table',
            source_table: 'batch294_new_york_nyc_cse_borough_clear',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The live CSE page lists Bronx `CPSE/CSE 1` for districts 7, 9, 10 at 1 Fordham Plaza and `CPSE/CSE 2` for districts 8, 11, 12 at 3450 E. Tremont Avenue, both with borough-specific phones and emails.'
          },
          {
            sample_name: 'NYC DOE Queens CSE routing',
            source_url: 'https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education',
            final_url: 'https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education',
            verification_status: 'reviewed',
            source_type: 'official_nyc_cse_borough_contact_table',
            source_table: 'batch294_new_york_nyc_cse_borough_clear',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The live CSE page lists Queens `CPSE/CSE 3` for districts 25, 26, 28, 29 at Flushing and Jamaica addresses and `CPSE/CSE 4` for districts 24, 27, 30 at Long Island City and Ozone Park, each with phones and emails.'
          },
          {
            sample_name: 'NYC DOE Brooklyn CSE routing',
            source_url: 'https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education',
            final_url: 'https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education',
            verification_status: 'reviewed',
            source_type: 'official_nyc_cse_borough_contact_table',
            source_table: 'batch294_new_york_nyc_cse_borough_clear',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The live CSE page lists Brooklyn `CPSE/CSE 5` for districts 19, 23, 32, `CSE6` for districts 17, 18, 22, `CSE7` for districts 20, 21, and `CSE8` for districts 13, 14, 15, 16 with Brooklyn addresses, phones, and emails.'
          },
          {
            sample_name: 'NYC DOE Manhattan CSE routing',
            source_url: 'https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education',
            final_url: 'https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education',
            verification_status: 'reviewed',
            source_type: 'official_nyc_cse_borough_contact_table',
            source_table: 'batch294_new_york_nyc_cse_borough_clear',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The live CSE page lists Manhattan / New York County `CPSE/CSE 9` for districts 1, 2, 4 at 333 Seventh Avenue and `CPSE/CSE 10` for districts 3, 5, 6 at 388 West 125th Street, each with phones and emails.'
          },
          {
            sample_name: 'NYC DOE Staten Island CSE routing',
            source_url: 'https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education',
            final_url: 'https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education',
            verification_status: 'reviewed',
            source_type: 'official_nyc_cse_borough_contact_table',
            source_table: 'batch294_new_york_nyc_cse_borough_clear',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The live CSE page lists Staten Island / Richmond County `CPSE/CSE 11` for district 31 at 715 Ocean Terrace with a borough-specific phone and email.'
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_health_hostwide_403',
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'district_or_county_education_routing')
    .map((row) => (
      row.family === 'county_local_disability_resources'
        ? {
            ...row,
            failure_code: COUNTY_FAILURE_CODE,
            next_action: COUNTY_NEXT_ACTION,
            evidence: COUNTY_REASON,
          }
        : row
    ));

  const existingBlockers = (summary.final_blockers || []).filter((row) => row.family !== 'district_or_county_education_routing' && row.family !== 'county_local_disability_resources');
  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: [
      ...existingBlockers,
      {
        family: 'county_local_disability_resources',
        failure_code: COUNTY_FAILURE_CODE,
        evidence: COUNTY_REASON,
        next_action: COUNTY_NEXT_ACTION,
      },
    ],
  };

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const updatedQueueRows = readJsonl(INPUTS.queue).map((row) => (
    row.state === 'new-york'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 91,
          search_value_proxy: 62,
          risk_score: 22,
          fast_completion_score: 78,
          priority_score: 62,
          missing_critical_families: 0,
          weak_critical_families: 1,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'batch_2_repair_blocked',
          status: 'BLOCKED',
          repair_lane: 'repair_from_state_packet',
        }
      : row
  ));
  writeJsonl(INPUTS.queue, updatedQueueRows);

  const updatedStates = allStateAudit.states.map((row) => (
    row.stateId === 'new-york'
      ? {
          ...row,
          classification: 'BLOCKED',
          indexSafe: false,
          completenessPct: 91,
          strongCriticalFamilies: 11,
          weakCriticalFamilies: 1,
          missingCriticalFamilies: 0,
          familyStatuses: {
            ...row.familyStatuses,
            district_or_county_education_routing: 'verified_state_grade',
            county_local_disability_resources: 'blocked_health_hostwide_403',
          },
          packetBatch: 'batch_294_new_york_nyc_cse_borough_clear_v1',
          packetPrimaryGapReason: PRIMARY_GAP_REASON,
          packetRecommendedBatch: 'batch_2_repair_blocked',
        }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    generatedAt: new Date().toISOString(),
    lessonsUpdate: 'Added a new blocker lesson: official CSE office tables can clear NYC borough routing.',
    states: updatedStates,
    classifications: {
      COMPLETE: updatedStates.filter((row) => row.classification === 'COMPLETE').length,
      BLOCKED: updatedStates.filter((row) => row.classification === 'BLOCKED').length,
    },
    indexSafeCount: updatedStates.filter((row) => row.indexSafe).length,
    packetCoverageCount: updatedStates.filter((row) => row.packetGenerated).length,
    packetMissingStates: updatedStates.filter((row) => !row.packetGenerated).map((row) => row.stateId),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.educationPacket, buildEducationPacket());
  fs.writeFileSync(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(updatedAllStateAudit));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAllStateAudit));

  const batchSummary = {
    state: 'new-york',
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    education_now_verified: true,
    nonNycCountiesCoveredByOfficialBocesPages: 57,
    nycBoroughRoutesRecovered: 5,
    remaining_blocker_family_count: 1,
    lesson_added: lessonAdded,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 294 New York NYC CSE Borough Clear Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: cleared the New York education blocker by proving the five-borough NYC remainder from the official DOE CSE page',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    '',
    '## Repair decision',
    '',
    '- Kept New York BLOCKED.',
    '- Cleared education across all 62 counties using the existing official NYSED BOCES lane plus the official NYC DOE CSE borough-office table.',
    '- Left county-local blocked because the exact OTDA successor leaves publicly linked by `ny.gov` still reset in the bounded verification lane.',
    '- Advanced the handoff to Oklahoma because New York is now blocked on only one remaining family.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch294NewYorkNycCseBoroughClearV1();
  console.log(JSON.stringify(result, null, 2));
}
