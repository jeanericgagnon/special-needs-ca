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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  educationPacket: path.join(generatedDir, 'new-mexico_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'new-mexico_county_local_disability_resources_hca_archive_packet_v1.json'),
  vrPacket: path.join(generatedDir, 'new-mexico_vocational_rehabilitation_host_packet_v1.json'),
  batchSummary: path.join(generatedDir, 'batch195_new_mexico_blocker_packets_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch195-new-mexico-blocker-packets-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-mexico-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON =
  'district_and_county_local_leaf_proof_still_missing_after_statewide_and_fit_regional_repairs';

const EDUCATION_REASON =
  'Reviewed 2026-06-23 the New Mexico low-token education artifacts plus the current California-grade packet. The only retained PED education candidates on disk are still the generic `https://webnew.ped.state.nm.us/` root and the statewide Special Education Bureau leaf, while one retained candidate is a wrong-role `https://www.nmhealth.org/about/ddsd` cross-role leak on a non-PED host. No district-owned, county-grade, or regional education exact leaf is preserved in the current queue, so district_or_county_education_routing remains blocked on missing local leaf authoring rather than on another PED root retry.';
const COUNTY_REASON =
  'Reviewed 2026-06-23 the live HCA field-office blocker artifacts plus the existing New Mexico report. The official HCA field-office archive is publicly reachable and already preserves county-specific office posts across page 1 and page 2, including Bernalillo County NW, Bernalillo County SW, Hidalgo County, Roosevelt County, Chaves County, Curry County, and Dona Ana variants. But no reviewed county-complete 33-county office map or deterministic archive extraction is preserved on disk yet, so county_local_disability_resources remains blocked on exact county-complete authoring, not on a dead source.';
const VR_REASON =
  'Reviewed 2026-06-23 the New Mexico VR blocker artifacts plus the NM low-token registry. The exact official DVR root `https://www.dvr.nm.gov/` is still the only reviewed first-party VR host in the state packet and it returns HTTP 401 Unauthorized in bounded fetches. The New Mexico official-domain registry still carries no reviewed alternate VR domain, and the NM unresolved-roles ledger still shows both `vocational_rehabilitation` and `pre_ets` with `no_reviewed_allowed_domains`. New Mexico VR therefore remains blocked on missing reviewed alternate official-root evidence after the 401 lane, not on a broader discovery gap.';

const LESSON_HEADING =
  '### Low-Token State Queues That Leak Cross-Role Domains Need Packet Repair Before More Fetches';
const LESSON_BODY =
  '*   **Lesson:** If a state-specific low-token queue for one family still contains only generic roots and even leaks a cross-role host from another agency, stop rerunning the fetch lane and convert it into a leaf-authoring packet first. New Mexico PED district routing had no district-owned leaves at all and even retained `nmhealth.org/about/ddsd` as a wrong-role candidate, so more fetches would only churn the same bad queue.';

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
    state: 'new-mexico',
    family: 'district_or_county_education_routing',
    repair_lane: 'leaf_authoring_only',
    packet_complete_when:
      'Every retained New Mexico education-routing repair row points at a reviewed district-owned, county-grade, or regional special-education leaf rather than the generic PED root or the statewide PED Special Education Bureau page.',
    current_metrics: {
      retainedPedCandidates: 2,
      wrongRoleCrossHostCandidates: 1,
      districtOwnedLeavesOnDisk: 0,
      countyCount: 33,
    },
    exhausted_candidates: [
      'https://webnew.ped.state.nm.us/',
      'https://webnew.ped.state.nm.us/bureaus/special-education/',
    ],
    rejected_queue_contamination: [
      {
        url: 'https://www.nmhealth.org/about/ddsd',
        reason: 'wrong-role cross-host candidate leaked into PED education queue',
      },
    ],
    next_allowed_sources: [
      'district-owned special-education leaves on k12 district domains',
      'regional education or county-owned student-support directories if they preserve local routing',
    ],
  };
}

function buildCountyPacket() {
  return {
    state: 'new-mexico',
    family: 'county_local_disability_resources',
    repair_lane: 'county_complete_archive_extraction_only',
    packet_complete_when:
      'A reviewed deterministic extraction or manually preserved map covers all 33 New Mexico counties from the live HCA field-office archive without relying on partial archive paging notes.',
    current_metrics: {
      countyTotal: 33,
      reviewedArchivePages: 2,
      explicitlyNamedCountyLeavesSeen: 7,
      countyCompleteMapOnDisk: false,
    },
    representative_sources: [
      'https://www.hca.nm.gov/lookingforassistance/field_offices_1/',
      'https://www.hca.nm.gov/lookingforassistance/field_offices_1/page/2/?et_blog',
    ],
    named_county_examples: [
      'Bernalillo County NW',
      'Bernalillo County SW',
      'Hidalgo County',
      'Roosevelt County',
      'Chaves County',
      'Curry County',
      'Dona Ana',
    ],
    next_allowed_repairs: [
      'archive-to-county extraction from the live HCA office pages',
      'reviewed continuation pages on the same HCA field-office archive if needed for the remaining counties',
    ],
  };
}

function buildVrPacket() {
  return {
    state: 'new-mexico',
    family: 'vocational_rehabilitation_pre_ets',
    repair_lane: 'browser_assisted_or_alternate_official_root_review',
    packet_complete_when:
      'Either the official DVR root becomes publicly reviewable or a reviewed first-party alternate New Mexico VR or Pre-ETS root is attached on disk.',
    current_metrics: {
      officialDvrRoot401: true,
      reviewedAlternateVrDomains: 0,
      unresolvedHighPriorityRoles: 2,
    },
    exhausted_sources: [
      'https://www.dvr.nm.gov/',
    ],
    unresolved_roles: [
      'vocational_rehabilitation',
      'pre_ets',
    ],
    blocker_basis: [
      'exact official DVR root returns HTTP 401',
      'NM official domain registry has no reviewed alternate VR domain',
      'NM unresolved roles still report no reviewed allowed domains for VR and Pre-ETS',
    ],
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Mexico Blocker Packets v3',
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
    '## Packetized blockers',
    '',
    '- `district_or_county_education_routing` now has a leaf-authoring packet that explicitly rejects the wrong-role `nmhealth.org/about/ddsd` candidate and preserves that the queue still has zero district-owned leaves on disk.',
    '- `county_local_disability_resources` now has a county-complete archive packet that treats the HCA field-office archive as a live source needing full extraction, not a dead-source blocker.',
    '- `vocational_rehabilitation_pre_ets` now has a host packet separating the DVR 401 from the missing reviewed alternate-domain problem.',
    '',
    '## Completion decision',
    '',
    '- New Mexico remains `BLOCKED` and `index_safe=false`.',
    '- Education is still blocked on missing district-owned or county-grade local leaves, not on more statewide PED retries.',
    '- County-local remains blocked on preserving a full 33-county HCA office contract, not on source discovery.',
    '- VR remains blocked on the 401 DVR host plus zero reviewed alternate official roots.',
  ].join('\n') + '\n';
}

export function generateBatch195NewMexicoBlockerPacketsV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_district_or_county_leafs_unverified',
        status_reason: EDUCATION_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_hca_field_office_archive_partial_county_contract',
        status_reason: COUNTY_REASON,
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'blocked_official_dvr_root_unauthorized_without_reviewed_alternate',
        status_reason: VR_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, evidence: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, evidence: COUNTY_REASON };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return { ...row, evidence: VR_REASON };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_district_or_county_leafs_unverified',
        query_basis: 'Reviewed 2026-06-23 the NM low-token education candidate queue and the current PED packet roots.',
        blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
        blocker_evidence: EDUCATION_REASON,
        evidence_strength: 'missing',
        sample_count: 3,
        samples: [
          {
            sample_name: 'PED root candidate',
            source_url: 'https://webnew.ped.state.nm.us/',
            verification_status: 'blocked',
            source_type: 'generic_statewide_root_only',
            source_table: 'nm_low_token_candidate_urls_v1',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The retained education queue still includes the generic PED root, which is not county-grade or district-owned routing evidence.',
          },
          {
            sample_name: 'PED Special Education Bureau candidate',
            source_url: 'https://webnew.ped.state.nm.us/bureaus/special-education/',
            verification_status: 'blocked',
            source_type: 'statewide_special_education_leaf_only',
            source_table: 'nm_low_token_candidate_urls_v1',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The statewide PED Special Education Bureau leaf is role-pure for state authority, but it still is not district-owned or county-grade local routing.',
          },
          {
            sample_name: 'Cross-role queue contamination',
            source_url: 'https://www.nmhealth.org/about/ddsd',
            verification_status: 'blocked',
            source_type: 'wrong_role_cross_host_candidate',
            source_table: 'nm_low_token_candidate_urls_v1',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'A New Mexico Health DD page leaked into the PED education queue, proving the current queue needs leaf-authoring repair before more education fetches.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_hca_field_office_archive_partial_county_contract',
        query_basis: 'Reviewed 2026-06-23 the live HCA field-office archive notes already preserved on disk.',
        blocker_code: 'live_hca_field_office_archive_exists_but_county_complete_contract_not_yet_preserved',
        blocker_evidence: COUNTY_REASON,
        evidence_strength: 'weak',
        sample_count: 2,
        samples: [
          {
            sample_name: 'HCA Field Offices archive',
            source_url: 'https://www.hca.nm.gov/lookingforassistance/field_offices_1/',
            final_url: 'https://www.hca.nm.gov/lookingforassistance/field_offices_1/',
            verification_status: 'blocked',
            source_type: 'official_archive_partial_county_contract',
            source_table: 'batch180_new_mexico_proof_refresh',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The archive preserves county-specific office leaves such as Bernalillo County NW, Bernalillo County SW, Hidalgo County, and Roosevelt County, but not yet a county-complete 33-county map on disk.',
          },
          {
            sample_name: 'HCA Field Offices archive page 2',
            source_url: 'https://www.hca.nm.gov/lookingforassistance/field_offices_1/page/2/?et_blog',
            final_url: 'https://www.hca.nm.gov/lookingforassistance/field_offices_1/page/2/?et_blog',
            verification_status: 'blocked',
            source_type: 'official_archive_continuation_page',
            source_table: 'batch180_new_mexico_proof_refresh',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The continuation page adds Chaves County, Curry County, and Dona Ana variants, proving the source is live but still not fully materialized into a 33-county contract.',
          },
        ],
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'blocked_official_dvr_root_unauthorized_without_reviewed_alternate',
        query_basis: 'Reviewed 2026-06-23 the official DVR root plus the NM domain registry and unresolved-role artifacts.',
        blocker_code: 'official_dvr_root_returns_401_without_reviewed_public_alternate',
        blocker_evidence: VR_REASON,
        evidence_strength: 'weak',
        sample_count: 2,
        samples: [
          {
            sample_name: 'New Mexico DVR root',
            source_url: 'https://www.dvr.nm.gov/',
            final_url: 'https://www.dvr.nm.gov/',
            verification_status: 'blocked',
            source_type: 'official_root_401',
            source_table: 'batch180_new_mexico_proof_refresh',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The exact official DVR root returned HTTP 401 Unauthorized in bounded fetches.',
          },
          {
            sample_name: 'NM VR alternate-domain registry state',
            source_url: 'data/generated/nm_official_domain_registry_v1.jsonl',
            verification_status: 'blocked',
            source_type: 'registry_has_no_reviewed_alternate_domain',
            source_table: 'nm_official_domain_registry_v1',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The New Mexico official-domain registry still preserves no reviewed alternate VR domain, and unresolved roles for vocational_rehabilitation and pre_ets remain open with no reviewed allowed domains.',
          },
        ],
      };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
  };

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch195_new_mexico_blocker_packets_v1',
    state: 'new-mexico',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    educationPacketWritten: true,
    countyPacketWritten: true,
    vrPacketWritten: true,
    districtOwnedLeavesOnDisk: 0,
    countyCompleteMapOnDisk: false,
    reviewedAlternateVrDomains: 0,
    lesson_added: lessonAdded,
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, nextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, nextRows);
  writeJson(OUTPUTS.educationPacket, buildEducationPacket());
  writeJson(OUTPUTS.countyPacket, buildCountyPacket());
  writeJson(OUTPUTS.vrPacket, buildVrPacket());
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch195NewMexicoBlockerPacketsV1();
}
