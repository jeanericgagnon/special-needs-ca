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
  report: path.join(docsGeneratedDir, 'new-mexico-california-grade-audit-report-v2.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch180_new_mexico_proof_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch180-new-mexico-proof-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-mexico-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON =
  'district_and_county_local_leaf_proof_still_missing_after_statewide_and_fit_regional_repairs';

const PTI_URL = 'https://parentsreachingout.org/about-us/';
const LEGAL_AID_URL = 'https://newmexicolegalaid.org/who-we-are/locations.html';
const FIT_URL = 'https://www.nmececd.org/family-infant-toddler-fit-program/';
const FIT_MAP_URL = 'https://www.nmececd.org/regional-office-map/';
const HCA_FIELD_OFFICES_URL = 'https://www.hca.nm.gov/lookingforassistance/field_offices_1/';
const HCA_FIELD_OFFICES_PAGE2_URL = 'https://www.hca.nm.gov/lookingforassistance/field_offices_1/page/2/?et_blog';
const VR_URL = 'https://www.dvr.nm.gov/';

const PTI_EVIDENCE =
  "Reviewed 2026-06-22 the first-party Parents Reaching Out About page. It explicitly says that in 1989 PRO was awarded a U.S. Department of Education grant to serve as New Mexico's statewide Parent Training and Information Center and says that designation has been held ever since.";
const LEGAL_AID_EVIDENCE =
  'Reviewed 2026-06-22 the first-party New Mexico Legal Aid locations page. It explicitly says New Mexico Legal Aid has ten office locations serving all counties in New Mexico and preserves a statewide intake line plus office addresses for Albuquerque, Las Cruces, Roswell, Santa Fe, Gallup, and other locations.';
const FIT_COUNTY_EVIDENCE =
  'Reviewed 2026-06-22 the official ECECD FIT page plus the linked Regional Office Map. The FIT page is the role-pure statewide Part C / referral source, and the official regional-office page enumerates county-labeled local offices covering all 33 New Mexico counties through 17 office rows, including Bernalillo, Sandoval, Valencia/Socorro, Chaves, Curry/De Baca/Guadalupe/Quay, Lea/Roosevelt, Santa Fe/Torrance, McKinley/Cibola, and San Juan. That is enough county-grade local routing for the FIT family.';
const COUNTY_LOCAL_BLOCKER_EVIDENCE =
  'Reviewed 2026-06-22 the live official HCA Field Offices archive. The page is role-aligned and public, and it now preserves county-specific office posts such as Bernalillo County NW, Bernalillo County SW, Hidalgo County, Roosevelt County, Chaves County, Curry County, and Dona Ana variants across the first two archive pages. But the bounded review still does not preserve a single county-complete contract or a reviewed full 33-county office extraction on disk, so county_local_disability_resources remains blocked until the live HCA field-office archive is converted into a complete county-grade office map.';
const VR_BLOCKER_EVIDENCE =
  'Reviewed 2026-06-22 the exact official New Mexico DVR root https://www.dvr.nm.gov/, which returned HTTP 401 Unauthorized in bounded fetches. The old packet still lacks any reviewed alternate first-party VR or Pre-ETS page on disk, so the family is no longer just missing-inventory; it is blocked on the official DVR lane requiring browser-assisted or alternate official-root review.';

const LESSON_1_HEADING =
  '### About Pages Can Preserve Official PTI Designation Even When The Homepage Does Not';
const LESSON_1_BODY =
  "*   **Lesson:** If a statewide parent-support homepage only proves general support scope, check the first-party About or history page before leaving PTI blocked. New Mexico's Parents Reaching Out homepage looked support-only, but the About page preserved explicit Parent Training and Information Center designation language dating back to its federal award.";

const LESSON_2_HEADING =
  '### County-Complete Regional Office Maps Linked From A Part C Program Page Can Clear Local FIT Routing';
const LESSON_2_BODY =
  '*   **Lesson:** If an official Part C / FIT page links a regional-office map that itself enumerates county-labeled offices for every county-equivalent, that linked map can satisfy county-grade early-intervention routing. New Mexico FIT cleared once the official regional-office map proved all 33 counties had named local office coverage.';

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

function appendLessonsIfMissing(filePath) {
  let current = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  for (const [heading, body] of [
    [LESSON_1_HEADING, LESSON_1_BODY],
    [LESSON_2_HEADING, LESSON_2_BODY],
  ]) {
    if (!current.includes(heading)) {
      current = `${current.trimEnd()}\n\n${heading}\n${body}\n`;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, current);
  }
  return changed;
}

function recalcSummary(summary, gapRows, failureRows, verifiedRows) {
  const criticalRows = gapRows.filter((row) => row.critical);
  const strong = criticalRows.filter((row) => String(row.family_status || '').startsWith('verified_')).length;
  const missing = criticalRows.filter((row) => String(row.family_status || '').startsWith('missing')).length;
  const weak = criticalRows.length - strong - missing;
  return {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: Math.floor((strong / criticalRows.length) * 100),
    strong_critical_families: strong,
    weak_critical_families: weak,
    missing_critical_families: missing,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'batch_2_repair_blocked',
    critical_gap_families: failureRows.filter((row) => row.severity === 'critical').map((row) => row.family),
    major_gap_families: failureRows.filter((row) => row.severity === 'major').map((row) => row.family),
    verified_source_families_with_samples: verifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: failureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Mexico California-Grade Audit Report v2',
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
    '## New Mexico bounded refresh decision',
    '',
    `- Parent training information center is now repaired from the first-party Parents Reaching Out About page (${PTI_URL}), which explicitly preserves New Mexico's statewide PTI designation.`,
    `- Legal aid is now repaired from the first-party New Mexico Legal Aid locations page (${LEGAL_AID_URL}), which explicitly says it serves all counties in New Mexico and preserves a statewide intake route.`,
    `- Early intervention / Part C now clears county-grade routing because the official FIT page (${FIT_URL}) links the official ECECD Regional Office Map (${FIT_MAP_URL}), and that map enumerates county-labeled local offices covering all 33 counties.`,
    `- County-local disability resources remain blocked, but the blocker is sharper: the live HCA Field Offices archive (${HCA_FIELD_OFFICES_URL}) is real and role-aligned, yet the current reviewed packet still preserves only a sparse partial county subset instead of a county-complete office contract.`,
    `- Vocational rehabilitation / Pre-ETS remains blocked rather than merely missing because the exact official DVR root (${VR_URL}) returns HTTP 401 and no reviewed alternate official VR source is yet preserved on disk.`,
    '- District or county education routing still lacks reviewed county-grade district or regional education leaves beyond the generic statewide PED surface.',
    '- New Mexico therefore remains truthfully `BLOCKED` and `index_safe=false`, but three statewide/local families are now materially more complete and the remaining blockers are more exact.',
  ].join('\n') + '\n';
}

export function generateBatch180NewMexicoProofRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        status_reason: 'The official ECECD FIT page plus the linked Regional Office Map now prove county-grade local FIT routing across all 33 counties.',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'The reviewed Parents Reaching Out About page explicitly preserves New Mexico PTI designation on a first-party source.',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'The reviewed New Mexico Legal Aid locations page preserves a statewide intake route and explicitly says it serves all counties in New Mexico.',
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'blocked_official_dvr_root_unauthorized_without_reviewed_alternate',
        status_reason: 'The exact official DVR root now returns HTTP 401 in bounded fetches, and no reviewed alternate first-party VR / Pre-ETS source is preserved on disk yet.',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_hca_field_office_archive_partial_county_contract',
        status_reason: 'The live official HCA Field Offices archive now proves some county-specific office leaves, but the current reviewed packet still does not preserve a county-complete office contract.',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => !['early_intervention_part_c', 'parent_training_information_center', 'legal_aid', 'vocational_rehabilitation_pre_ets', 'county_local_disability_resources'].includes(row.family))
    .concat([
      {
        state: 'new-mexico',
        state_code: 'NM',
        family: 'vocational_rehabilitation_pre_ets',
        severity: 'major',
        failure_code: 'official_dvr_root_returns_401_without_reviewed_public_alternate',
        evidence: VR_BLOCKER_EVIDENCE,
        next_action: 'browser_assisted_or_review_alternate_official_vr_root',
      },
      {
        state: 'new-mexico',
        state_code: 'NM',
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'live_hca_field_office_archive_exists_but_county_complete_contract_not_yet_preserved',
        evidence: COUNTY_LOCAL_BLOCKER_EVIDENCE,
        next_action: 'author_county_local_exact_targets_from_live_hca_field_office_archive',
      },
    ]);

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed the official FIT page plus the linked official Regional Office Map, which preserves county-labeled local offices covering all 33 counties.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Family Infant Toddler (FIT) Program',
            source_url: FIT_URL,
            final_url: FIT_URL,
            verification_status: 'verified',
            source_type: 'official',
            source_table: 'batch180_new_mexico_proof_refresh',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Family Infant Toddler (FIT) Program. FIT provides early intervention services to children from birth to age three and includes a Make a Referral path.',
          },
          {
            sample_name: 'ECECD Regional Office Map',
            source_url: FIT_MAP_URL,
            final_url: FIT_MAP_URL,
            verification_status: 'verified',
            source_type: 'official_county_map',
            source_table: 'batch180_new_mexico_proof_refresh',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Regional Office Map enumerates county-labeled offices across all 33 counties, including Bernalillo, Sandoval, Valencia/Socorro, Chaves, Curry/De Baca/Guadalupe/Quay, Lea/Roosevelt, and Santa Fe/Torrance.',
          },
        ],
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed the first-party Parents Reaching Out About page for explicit PTI designation evidence.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Parents Reaching Out About Us',
            source_url: PTI_URL,
            final_url: PTI_URL,
            verification_status: 'verified',
            source_type: 'official',
            source_table: 'batch180_new_mexico_proof_refresh',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: "In 1989, PRO was awarded a grant through the US Department of Education to serve as New Mexico's statewide Parent Training and Information Center, a designation we are proud to have held ever since.",
          },
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed the first-party New Mexico Legal Aid locations page for statewide service and intake evidence.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'New Mexico Legal Aid Locations',
            source_url: LEGAL_AID_URL,
            final_url: LEGAL_AID_URL,
            verification_status: 'verified',
            source_type: 'official',
            source_table: 'batch180_new_mexico_proof_refresh',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'New Mexico Legal Aid has ten office locations serving all counties in New Mexico and preserves a statewide intake line at 1-833-545-4357.',
          },
        ],
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'blocked_official_dvr_root_unauthorized_without_reviewed_alternate',
        evidence_strength: 'weak',
        sample_count: 1,
        query_basis: 'Reviewed the exact official New Mexico DVR root in bounded fetch mode.',
        blocker_code: 'official_dvr_root_returns_401_without_reviewed_public_alternate',
        blocker_evidence: VR_BLOCKER_EVIDENCE,
        samples: [
          {
            sample_name: 'New Mexico DVR root',
            source_url: VR_URL,
            final_url: VR_URL,
            verification_status: 'blocked',
            source_type: 'official',
            source_table: 'batch180_new_mexico_proof_refresh',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The exact official DVR root returned HTTP 401 Unauthorized in bounded fetches.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_hca_field_office_archive_partial_county_contract',
        evidence_strength: 'weak',
        sample_count: 2,
        query_basis: 'Reviewed the live HCA Field Offices archive pages and found county-specific office leaves, but not yet a preserved county-complete contract.',
        blocker_code: 'live_hca_field_office_archive_exists_but_county_complete_contract_not_yet_preserved',
        blocker_evidence: COUNTY_LOCAL_BLOCKER_EVIDENCE,
        samples: [
          {
            sample_name: 'HCA Field Offices archive',
            source_url: HCA_FIELD_OFFICES_URL,
            final_url: HCA_FIELD_OFFICES_URL,
            verification_status: 'blocked',
            source_type: 'official',
            source_table: 'batch180_new_mexico_proof_refresh',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The live HCA Field Offices archive preserves county-specific office leaves such as Bernalillo County NW, Bernalillo County SW, Hidalgo County, and Roosevelt County.',
          },
          {
            sample_name: 'HCA Field Offices archive page 2',
            source_url: HCA_FIELD_OFFICES_PAGE2_URL,
            final_url: HCA_FIELD_OFFICES_PAGE2_URL,
            verification_status: 'blocked',
            source_type: 'official',
            source_table: 'batch180_new_mexico_proof_refresh',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Additional county office leaves such as Chaves County, Curry County, and Dona Ana variants appear on the second archive page, but the full county-complete office contract is not yet preserved on disk.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows
    .filter((row) => !['early_intervention_part_c', 'parent_training_information_center', 'legal_aid', 'vocational_rehabilitation_pre_ets', 'county_local_disability_resources', 'district_or_county_education_routing'].includes(row.family))
    .concat([
      {
        state: 'new-mexico',
        state_code: 'NM',
        priority_rank: 1,
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        next_action: 'author_county_or_district_exact_targets',
        evidence: 'School-district packet rows still collapse to generic PED-root evidence, and the bounded PED Bureau fetch timed out before any district-owned or county-grade leaf could be verified.',
      },
      {
        state: 'new-mexico',
        state_code: 'NM',
        priority_rank: 2,
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'live_hca_field_office_archive_exists_but_county_complete_contract_not_yet_preserved',
        next_action: 'author_county_local_exact_targets_from_live_hca_field_office_archive',
        evidence: 'The live HCA Field Offices archive proves county-specific office leaves exist, but the current reviewed packet still does not preserve a county-complete office contract.',
      },
      {
        state: 'new-mexico',
        state_code: 'NM',
        priority_rank: 3,
        family: 'vocational_rehabilitation_pre_ets',
        severity: 'major',
        failure_code: 'official_dvr_root_returns_401_without_reviewed_public_alternate',
        next_action: 'browser_assisted_or_review_alternate_official_vr_root',
        evidence: 'The exact official DVR root returns HTTP 401 and no reviewed alternate first-party VR / Pre-ETS source is preserved on disk yet.',
      },
    ]);

  for (let i = 0; i < updatedNextRows.length; i += 1) {
    updatedNextRows[i].priority_rank = i + 1;
  }

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);

  const lessonsUpdated = appendLessonsIfMissing(INPUTS.lessons);
  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(INPUTS.report, report);

  const batchSummary = {
    state: 'new-mexico',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    repaired_families: [
      'early_intervention_part_c',
      'parent_training_information_center',
      'legal_aid',
    ],
    sharpened_families: [
      'county_local_disability_resources',
      'vocational_rehabilitation_pre_ets',
    ],
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, `${report}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch180NewMexicoProofRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
