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
  packet: path.join(generatedDir, 'new-york_county_local_disability_resources_health_host_packet_v1.json'),
  stateReport: path.join(docsGeneratedDir, 'new-york-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch302_new_york_mybenefits_successor_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch302-new-york-mybenefits-successor-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'nygov_linked_exact_otda_and_mybenefits_successor_leaves_still_reset_while_health_ny_ldss_family_remains_unusable';
const FAILURE_CODE =
  'nygov_links_exact_otda_and_mybenefits_successor_leaves_but_successor_family_still_resets';
const COUNTY_STATUS = 'blocked_health_hostwide_403';
const NEXT_ACTION = 'hold_blocked_until_public_otda_successor_leaf_or_county_owned_locator_is_verified';

const COUNTY_REASON =
  'Reviewed 2026-06-23 one more bounded official New York county-local replacement lane using the public `ny.gov` service stack as the discovery surface rather than speculative OTDA host guessing. The original `health.ny.gov` Medicaid lane is still blocked host-wide: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all remain unusable for county-local proof. The live `https://www.ny.gov/services/social-programs` page and `https://www.ny.gov/services/apply-cooling-assistance` strengthen the blocker instead of clearing it: the cooling-assistance page explicitly says people may apply in person at their local district office and publicly links both `https://otda.ny.gov/programs/heap/contacts/` as `HEAP Local District Contact` and `https://mybenefits.ny.gov/` as the online benefits lane. But the exact OTDA benefit and contact leaves still fail on the current successor family, including `otda.ny.gov/programs/heap/contacts/`, `otda.ny.gov/programs/heap/`, `otda.ny.gov/programs/applications/4826.pdf`, `otda.ny.gov/workingfamilies/dss.asp`, and the apex `otda.ny.gov` plus `www.otda.ny.gov` roots, all of which reset the connection in the bounded lane. The same bounded probe now confirms `https://mybenefits.ny.gov/` also resets on the public successor family. New York therefore remains blocked on county-local not because a successor path is unknown, but because the public New York portal points to exact official OTDA and MyBenefits successor surfaces that are still not reviewable from the repo-side verification lane.';

const OKLAHOMA_FOCUS = [
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
  '',
].join('\n');

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

function replaceSection(text, startHeading, endHeading, replacement) {
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}

function replaceLiteral(text, searchValue, replaceValue) {
  return text.includes(searchValue) ? text.replace(searchValue, replaceValue) : text;
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
    '- North Carolina now reaches COMPLETE/index-safe because two public county-bearing contracts replaced both local blockers: the DPI School Report Card location dataset for district routing and the NCDHHS Local DSS sitemap lane for county-local routing.',
    '- New York remains blocked, but the county-local blocker is now tighter: `ny.gov` points to exact OTDA successor leaves and `mybenefits.ny.gov`, and every one of those public successor surfaces still resets in the bounded verification lane.',
    '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.',
    '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.',
  ].join('\n') + '\n';
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New York Blocker Packets v8',
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
    '- The live NYC DOE Committees on Special Education page already closes the five-borough remainder directly, so education is no longer a New York blocker.',
    '',
    '## County-local refinement',
    '',
    '- The live `ny.gov` service stack still proves New York intends OTDA and MyBenefits to be the successor county-local lane: `Apply for Cooling Assistance` explicitly tells people they may apply in person at a local district office and links both `HEAP Local District Contact` and `mybenefits.ny.gov`.',
    '- That makes the successor path exact enough to test in the low-token lane rather than leaving it as speculative host guessing.',
    '- But every exact public successor surface still fails in bounded live review, including the OTDA contact leaf, OTDA application PDF, OTDA benefit roots, OTDA apex roots, and `mybenefits.ny.gov` itself.',
    '',
    '## Completion decision',
    '',
    '- New York remains `BLOCKED` and `index_safe=false`.',
    '- Education is verified across all 62 counties.',
    '- County-local remains blocked because the old `health.ny.gov` LDSS family is unusable and the exact OTDA plus MyBenefits successor surfaces publicly linked by `ny.gov` still reset the connection.',
    '- PTI remains repaired and is not a blocker.',
  ].join('\n') + '\n';
}

function buildBatchReport(summary) {
  return [
    '# Batch 302 New York MyBenefits Successor Finality Report v1',
    '',
    '- state: New York',
    `- classification: ${summary.classification}`,
    '- blocker_family: county_local_disability_resources',
    '',
    '## What was confirmed',
    '',
    '- The live `ny.gov` service stack still points to exact county-local successor surfaces, not just generic OTDA branding.',
    '- `Apply for Cooling Assistance` explicitly says people may apply in person at their local district office and links both `HEAP Local District Contact` and `mybenefits.ny.gov`.',
    '- The OTDA successor leaves still reset in the bounded verification lane.',
    '- `mybenefits.ny.gov` also resets in the same bounded verification lane.',
    '',
    '## Repair decision',
    '',
    '- New York remains blocked on county-local routing.',
    '- The blocker is now sharper because both exact OTDA successor leaves and the public MyBenefits successor surface are confirmed unreachable from the repo-side review lane.',
  ].join('\n') + '\n';
}

export function generateBatch302NewYorkMybenefitsSuccessorFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');

  const updatedGapRows = gapRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, family_status: COUNTY_STATUS, status_reason: COUNTY_REASON }
    : row);

  const updatedFailureRows = failureRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, failure_code: FAILURE_CODE, evidence: COUNTY_REASON, next_action: NEXT_ACTION }
    : row);

  const updatedVerifiedRows = verifiedRows.map((row) => row.family === 'county_local_disability_resources'
    ? {
        ...row,
        family_status: COUNTY_STATUS,
        query_basis: 'Reviewed 2026-06-23 the blocked health.ny.gov Medicaid host family, the live ny.gov service portal, the exact OTDA successor leaves, and the public MyBenefits successor surface that ny.gov points people to.',
        blocker_code: FAILURE_CODE,
        blocker_evidence: COUNTY_REASON,
        evidence_strength: 'weak',
        sample_count: 10,
        samples: [
          { sample_name: 'LDSS directory', source_url: 'https://www.health.ny.gov/health_care/medicaid/ldss.htm', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
          { sample_name: 'robots.txt', source_url: 'https://www.health.ny.gov/robots.txt', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
          { sample_name: 'sitemap.xml', source_url: 'https://www.health.ny.gov/sitemap.xml', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
          { sample_name: 'Medicaid root', source_url: 'https://www.health.ny.gov/health_care/medicaid/', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
          { sample_name: 'Medicaid redesign', source_url: 'https://www.health.ny.gov/health_care/medicaid/redesign/', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
          { sample_name: 'New York Social Programs portal', source_url: 'https://www.ny.gov/services/social-programs', final_url: 'https://www.ny.gov/services/social-programs', verification_status: 'reviewed', source_type: 'official_state_portal', source_table: 'reviewed_live_probe', fetched_at: '2026-06-23T00:00:00.000Z', evidence_snippet: 'The live `Social Programs` page publicly links benefit-service leaves on the New York state portal.' },
          { sample_name: 'Apply for Cooling Assistance page', source_url: 'https://www.ny.gov/services/apply-cooling-assistance', final_url: 'https://www.ny.gov/services/apply-cooling-assistance', verification_status: 'reviewed', source_type: 'official_state_portal', source_table: 'reviewed_live_probe', fetched_at: '2026-06-23T00:00:00.000Z', evidence_snippet: 'The live `Apply for Cooling Assistance` page says people may apply in person at a local district office and links both `HEAP Local District Contact` and `mybenefits.ny.gov`.' },
          { sample_name: 'OTDA HEAP Local District Contact', source_url: 'https://otda.ny.gov/programs/heap/contacts/', verification_status: 'blocked', source_type: 'official_successor_leaf_reset', source_table: 'reviewed_live_probe' },
          { sample_name: 'OTDA application PDF linked by ny.gov', source_url: 'https://otda.ny.gov/programs/applications/4826.pdf', verification_status: 'blocked', source_type: 'official_successor_leaf_reset', source_table: 'reviewed_live_probe' },
          { sample_name: 'MyBenefits successor root', source_url: 'https://mybenefits.ny.gov/', verification_status: 'blocked', source_type: 'official_successor_root_reset', source_table: 'reviewed_live_probe' },
        ],
      }
    : row);

  const updatedNextRows = nextRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: COUNTY_REASON }
    : row);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: ['county_local_disability_resources'],
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        failure_code: FAILURE_CODE,
        evidence: COUNTY_REASON,
        next_action: NEXT_ACTION,
      },
    ],
  };

  const updatedPacket = {
    ...packet,
    current_metrics: {
      ...(packet.current_metrics || {}),
      blockedHealthNySurfaces: 5,
      reviewedStatePortalSuccessorPages: 2,
      boundedOtdaReplacementHostFailures: 9,
      boundedMyBenefitsFailures: 1,
    },
    blocked_surfaces: Array.from(new Set([
      ...(packet.blocked_surfaces || []),
      'https://otda.ny.gov/programs/heap/contacts/',
      'https://www.otda.ny.gov/programs/heap/contacts/',
      'https://otda.ny.gov/programs/heap/',
      'https://www.otda.ny.gov/programs/heap/',
      'https://otda.ny.gov/programs/applications/4826.pdf',
      'https://www.otda.ny.gov/programs/applications/4826.pdf',
      'https://mybenefits.ny.gov/',
    ])),
    replacement_host_probe: {
      attempted_at: '2026-06-23T00:00:00.000Z',
      host_family: ['otda.ny.gov', 'www.otda.ny.gov', 'mybenefits.ny.gov'],
      outcome: 'nygov_points_to_exact_otda_and_mybenefits_successor_surfaces_but_every_public_successor_surface_still_resets',
      exact_urls: [
        'https://otda.ny.gov/workingfamilies/dss.asp',
        'https://otda.ny.gov/programs/heap/contacts/',
        'https://otda.ny.gov/programs/heap/',
        'https://otda.ny.gov/programs/applications/4826.pdf',
        'https://otda.ny.gov/',
        'https://www.otda.ny.gov/',
        'https://mybenefits.ny.gov/',
      ],
      nygov_successor_refs: [
        'https://www.ny.gov/services/social-programs',
        'https://www.ny.gov/services/apply-cooling-assistance',
      ],
      summary: COUNTY_REASON,
    },
  };

  const updatedQueueRows = queueRows.map((row) => row.state === 'new-york'
    ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
    : row);

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => row.stateId === 'new-york'
      ? {
          ...row,
          packetBatch: 'batch_302_new_york_mybenefits_successor_finality_v1',
          packetPrimaryGapReason: PRIMARY_GAP_REASON,
          familyStatuses: {
            ...(row.familyStatuses || {}),
            county_local_disability_resources: COUNTY_STATUS,
            district_or_county_education_routing: 'verified_state_grade',
          },
        }
      : row),
  };

  let updatedHandoff = replaceSection(
    handoff,
    '## Current Focus State:',
    '## Next State Order After New York',
    OKLAHOMA_FOCUS,
  );
  updatedHandoff = replaceLiteral(updatedHandoff, '## Current Focus State: Alaska', '## Current Focus State: Oklahoma');
  updatedHandoff = replaceLiteral(updatedHandoff, '## Next State Order After Alaska', '## Next State Order After New York');

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(updatedAllStateAudit));
  fs.writeFileSync(INPUTS.handoff, updatedHandoff);

  const batchSummary = {
    batch: 'batch_302_new_york_mybenefits_successor_finality_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'new-york',
    classification: 'BLOCKED',
    index_safe: false,
    reviewedStatePortalSuccessorPages: 2,
    otdaExactSuccessorLeafFailures: 6,
    myBenefitsSuccessorFailures: 1,
    totalBoundedSuccessorFamilyFailures: 10,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(updatedSummary));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch302NewYorkMybenefitsSuccessorFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
