import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

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
  report: path.join(docsGeneratedDir, 'new-york-california-grade-audit-report-v2.md'),
  sourceTargets: path.join(repoRoot, 'data', 'source_targets', 'new-york.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch39_new-york_final_blocker_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch39-new-york-final-blocker-refresh-report-v1.md'),
};

const DB_PATH = path.join(repoRoot, 'ca_disability_navigator.db');
const NEW_YORK_PARENT_TRAINING_ACCEPTED_PATH = path.join(
  repoRoot,
  'data',
  'source-acquisition-runs',
  '2026-06-17T16-58-43-900Z',
  'validated',
  'parent_training_nonprofits',
  'accepted.ndjson',
);
const NEW_YORK_PARENT_NETWORK_PARSED_SAMPLES_PATH = path.join(
  repoRoot,
  'data',
  'source-acquisition-runs',
  '2026-06-19T23-40-07-308Z',
  'parsed',
  'nonprofit_support',
  'samples.json',
);

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
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function loadNewYorkVrProgramSample() {
  const db = new Database(DB_PATH, { readonly: true });
  try {
    return db.prepare(`
      SELECT id, name, source_url, official_source_url, verification_status
      FROM programs
      WHERE state_id = 'new-york'
        AND verification_status IN ('verified', 'official_verified')
        AND (
          source_url LIKE '%nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services%'
          OR official_source_url LIKE '%nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services%'
          OR name LIKE '%ACCES-VR%'
          OR name LIKE '%Vocational%'
          OR name LIKE '%Transition%'
        )
      ORDER BY
        CASE verification_status WHEN 'official_verified' THEN 0 ELSE 1 END,
        id ASC
      LIMIT 1
    `).get();
  } finally {
    db.close();
  }
}

function loadNewYorkPaAcceptedArtifact() {
  const rows = readJsonl(NEW_YORK_PARENT_TRAINING_ACCEPTED_PATH);
  return rows.find((row) => String(row.sourceUrl || '').includes('disabilityrightsny.org'));
}

function loadNewYorkPtiRegionalSample() {
  const rows = readJson(NEW_YORK_PARENT_NETWORK_PARSED_SAMPLES_PATH);
  return rows.find((row) => String(row.sourceUrl || '').includes('parentnetworkwny.org'));
}

function recalcSummary(summary, gapRows, failureRows, verifiedRows) {
  const criticalRows = gapRows.filter((row) => row.critical);
  const strong = criticalRows.filter((row) => String(row.family_status || '').startsWith('verified_')).length;
  const missing = criticalRows.filter((row) => row.family_status === 'missing').length;
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
    primary_gap_reason: 'official_county_directory_returns_http_403',
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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows, facts) {
  return [
    '# New York California-Grade Audit Report v2',
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
    '## New York final blocker decision',
    '',
    `- County-local disability resources remain blocked because the official New York LDSS county directory at ${facts.countyDirectoryUrl} returned HTTP 403 during bounded live verification, and no replacement live county-grade official locator is attached to the packet evidence chain.`,
    `- District or county education routing remains blocked because only ${facts.educationLeafCount} reviewed BOCES-owned exact leaves have been verified; that is not enough to truthfully prove district-grade routing across all ${summary.county_count} New York counties without reopening broader district authoring.`,
    `- Parent training information center remains below California-grade because the reviewed Parent Network of WNY evidence at ${facts.ptiUrl} is still explicitly scoped to Western New York support, not a truthful statewide PTI route.`,
    '- Legal aid is now verified at the statewide support layer because LawHelpNY is a reviewed New York statewide legal-help portal with county-based resource routing and a free legal-services directory.',
    '- ACCES-VR and Disability Rights New York remain upgraded out of the blocker list because reviewed verified evidence already existed on disk and now anchors those statewide support families truthfully.',
    '- New York is therefore truthfully final-blocked and not index-safe until a live official county-office directory or county-owned locator is verified, district-grade education leaves expand beyond the current bounded BOCES set, and a statewide PTI route is proven beyond Western New York scope.',
  ].join('\n') + '\n';
}

export function generateBatch39NewYorkFinalBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const sourceTargets = readJson(INPUTS.sourceTargets);

  const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
  const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
  const vrTarget = sourceTargets.find((row) => row.source_name === 'NYS ACCES-VR');
  const ptiTarget = sourceTargets.find((row) => row.source_name === 'Parent Network of WNY');
  const paTarget = sourceTargets.find((row) => row.source_name === 'Disability Rights New York (DRNY)');
  const countyTarget = sourceTargets.find((row) => row.source_name === 'NYS Local Social Services Districts (LDSS)');
  const vrProgramSample = loadNewYorkVrProgramSample();
  const paAcceptedArtifact = loadNewYorkPaAcceptedArtifact();
  const ptiRegionalSample = loadNewYorkPtiRegionalSample();

  if (!educationVerified || !countyVerified || !vrTarget || !ptiTarget || !paTarget || !countyTarget || !vrProgramSample || !paAcceptedArtifact || !ptiRegionalSample) {
    throw new Error('New York final blocker refresh requires source targets plus county and education packet evidence.');
  }

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_leaf_repair_exhausted',
        status_reason: `Reviewed BOCES-owned education exact leaves verified (${educationVerified.sample_count}), but district-grade coverage still cannot be proven for all ${summary.county_count} counties from the authored exact targets.`,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_official_directory_returns_403',
        status_reason: `The live official LDSS county directory ${countyTarget.source_url} returned HTTP 403 during bounded verification, so the current county-office rows cannot remain California-grade local proof.`,
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed verified ACCES-VR program evidence already exists in the New York program spine and satisfies the statewide VR / Pre-ETS gate.',
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Accepted first-party Disability Rights New York evidence is already present on disk and satisfies the statewide P&A gate.',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'blocked_reviewed_regional_source_not_statewide',
        status_reason: 'Reviewed Parent Network of WNY evidence is present, but the saved first-party page limits its reach to Western New York rather than a truthful statewide PTI route.',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'LawHelpNY now provides reviewed New York statewide legal-help routing from a first-party portal with county-based resource lookup.',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => !['vocational_rehabilitation_pre_ets', 'protection_and_advocacy'].includes(row.family))
    .map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'bounded_boces_leaf_packet_exhausted_before_county_grade_coverage',
        evidence: `Verified exact leaves remain limited to ${educationVerified.sample_count} reviewed BOCES-owned pages; this does not truthfully prove district-grade routing statewide.`,
        next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: 'live_official_ldss_directory_403_without_replacement_locator',
        evidence: `Official New York LDSS county directory returned HTTP 403 at ${countyTarget.source_url} during bounded live verification, and no replacement live county-grade official locator is attached to the packet.`,
        next_action: 'hold_blocked_until_live_official_ldss_directory_or_county_owned_locator_is_verified',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        failure_code: 'reviewed_western_new_york_pti_source_not_statewide',
        evidence: `Reviewed Parent Network of WNY evidence from ${ptiTarget.source_url} says the organization reaches families across WNY per year, which does not truthfully satisfy the statewide PTI gate.`,
        next_action: 'hold_blocked_until_reviewed_statewide_new_york_pti_source_or_statewide_scope_proof_is_verified',
      };
    }
    return row;
  });

  const failureByFamily = new Map(updatedFailureRows.map((row) => [row.family, row]));
  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: vrProgramSample.name,
            source_url: vrProgramSample.official_source_url || vrProgramSample.source_url,
            verification_status: vrProgramSample.verification_status,
            source_type: 'official',
            source_table: 'programs',
          },
        ],
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights New York',
            source_url: paAcceptedArtifact.finalUrl || paAcceptedArtifact.sourceUrl,
            verification_status: 'accepted_first_party',
            source_type: 'accepted_first_party_artifact',
            source_table: 'source_acquisition_validated',
          },
        ],
      };
    }
    if (row.family === 'parent_training_information_center') {
      const failure = failureByFamily.get(row.family);
      return {
        ...row,
        family_status: 'blocked_reviewed_regional_source_not_statewide',
        evidence_strength: 'weak',
        sample_count: 1,
        blocker_code: failure.failure_code,
        blocker_evidence: failure.evidence,
        samples: [
          {
            sample_name: 'Parent Network of WNY',
            source_url: ptiRegionalSample.finalUrl || ptiRegionalSample.sourceUrl,
            verification_status: 'reviewed_first_party_regional',
            source_type: 'parsed_first_party_artifact',
            source_table: 'source_acquisition_parsed',
          },
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        blocker_code: null,
        blocker_evidence: null,
      };
    }
    if (failureByFamily.has(row.family)) {
      const failure = failureByFamily.get(row.family);
      const familyStatus = updatedGapRows.find((gapRow) => gapRow.family === row.family)?.family_status || row.family_status;
      return {
        ...row,
        family_status: familyStatus,
        evidence_strength: row.family === 'district_or_county_education_routing' ? 'weak' : row.sample_count > 0 ? 'weak' : 'missing',
        blocker_code: failure.failure_code,
        blocker_evidence: failure.evidence,
      };
    }
    return row;
  });

  const updatedNextRows = [
    {
      state: 'new-york',
      state_code: 'NY',
      priority_rank: 1,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'live_official_ldss_directory_403_without_replacement_locator',
      next_action: 'hold_blocked_until_live_official_ldss_directory_or_county_owned_locator_is_verified',
      evidence: failureByFamily.get('county_local_disability_resources')?.evidence,
    },
    {
      state: 'new-york',
      state_code: 'NY',
      priority_rank: 2,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'bounded_boces_leaf_packet_exhausted_before_county_grade_coverage',
      next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
      evidence: failureByFamily.get('district_or_county_education_routing')?.evidence,
    },
    {
      state: 'new-york',
      state_code: 'NY',
      priority_rank: 3,
      family: 'parent_training_information_center',
      severity: 'major',
      failure_code: 'reviewed_western_new_york_pti_source_not_statewide',
      next_action: 'hold_blocked_until_reviewed_statewide_new_york_pti_source_or_statewide_scope_proof_is_verified',
      evidence: failureByFamily.get('parent_training_information_center')?.evidence,
    },
  ];

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const facts = {
    countyDirectoryUrl: countyTarget.source_url,
    educationLeafCount: educationVerified.sample_count,
    vrUrl: vrTarget.source_url,
    paUrl: paTarget.source_url,
    ptiUrl: ptiRegionalSample.finalUrl || ptiTarget.source_url,
  };
  const updatedReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, facts);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const batchSummary = {
    batch: 'batch_39_new-york_final_blocker_refresh_v1',
    generated_at: new Date().toISOString(),
    state: 'new-york',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    education_leaf_count: educationVerified.sample_count,
    final_blocker_count: updatedFailureRows.length,
    county_directory_url: countyTarget.source_url,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, [
    '# Batch 39 New York Final Blocker Refresh Report v1',
    '',
    'This pass does not reopen scraping. It converts New York’s stale legacy and discovery-only wording into explicit terminal blockers so the state packet, report, and all-state audit all tell the same truth.',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- education_leaf_count: ${educationVerified.sample_count}`,
    `- county_directory_url: ${countyTarget.source_url}`,
    '- ACCES-VR and Disability Rights New York remain upgraded from reviewed evidence already on disk.',
    '- New York remains blocked until a live official LDSS county directory or county-owned locator is verified, district-grade education leaves expand beyond the current bounded BOCES set, and a statewide PTI route is proven beyond Western New York scope.',
  ].join('\n') + '\n');

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch39NewYorkFinalBlockerRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
