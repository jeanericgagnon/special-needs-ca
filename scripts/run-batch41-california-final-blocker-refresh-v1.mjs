import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const DB_PATH = path.join(repoRoot, 'ca_disability_navigator.db');

const INPUTS = {
  summary: path.join(generatedDir, 'california_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'california_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'california_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'california_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'california_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'california-california-grade-audit-report-v2.md'),
  sourceTargets: path.join(repoRoot, 'data', 'source_targets', 'california.json'),
  scrapeResults: path.join(generatedDir, 'ca_scrape_results_v1.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch41_california_final_blocker_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch41-california-final-blocker-refresh-report-v1.md'),
};

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

function readSavedHtml(savedPath) {
  return fs.readFileSync(savedPath, 'utf8');
}

function loadCaliforniaSsiSample() {
  const db = new Database(DB_PATH, { readonly: true });
  try {
    const row = db.prepare(`
      SELECT id, name, source_url, official_source_url, verification_status
      FROM programs
      WHERE (
        state_id = 'california'
        OR state_id IS NULL
        OR state_id = ''
      )
        AND (
          id = 'ssi-for-children'
          OR source_url LIKE '%ssa.gov/benefits/disability/apply-child%'
          OR official_source_url LIKE '%ssa.gov/benefits/disability/apply-child%'
        )
        AND verification_status IN ('verified', 'official_verified')
      ORDER BY CASE
        WHEN state_id = 'california' THEN 0
        WHEN id = 'ssi-for-children' THEN 1
        ELSE 2
      END
      LIMIT 1
    `).get();
    if (!row) {
      throw new Error('Missing reviewed California/federal SSI sample for California packet refresh.');
    }
    return row;
  } finally {
    db.close();
  }
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
    primary_gap_reason: 'county_grade_leaf_packets_exhausted_and_statewide_pti_source_still_unverified',
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
    '# California California-Grade Audit Report v2',
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
    '## California final blocker decision',
    '',
    `- Early intervention / Part C is no longer a blocker because the reviewed official DDS Early Start county directory (${facts.earlyStartUrl}) was fetched successfully and the saved HTML contains ${facts.earlyStartCountyHeadingCount} county headings plus Early Start / Family Resource Center routing context, which is enough structured county coverage to satisfy the statewide county-grade gate.`,
    `- Vocational rehabilitation / Pre-ETS is no longer a blocker because reviewed California Department of Rehabilitation pages already prove statewide VR routing and student-services entry points, including ${facts.vrUrl}.`,
    `- Protection and advocacy is no longer a blocker because Disability Rights California Get Help (${facts.paUrl}) is already present as reviewed first-party statewide P&A intake evidence.`,
    `- Legal aid is no longer a blocker because reviewed California judiciary and State Bar pages (${facts.legalAidJudiciaryUrl} and ${facts.legalAidBarUrl}) already provide authoritative statewide legal-help routing.`,
    `- Parent training information center remains blocked because the designated statewide PTI target on disk is Matrix Parent Network and Resource Center (${facts.ptiDesignatedUrl}), but the current California packet still has no reviewed first-party statewide PTI fetch evidence for that source.`,
    `- District or county education routing remains blocked because only ${facts.educationLeafCount} reviewed exact district leaves have been verified, which does not truthfully prove county-grade district routing across all ${summary.county_count} California counties.`,
    `- County-local disability resources remain blocked because the reviewed packet still proves only example county office leaves plus the statewide BenefitsCal intake portal, not a statewide county-grade local office directory or complete county-owned office coverage.`,
    '- California is therefore truthfully final-blocked and not index-safe until new exact district/county leaves are authored for education and county-local routing, and a reviewed statewide PTI source is verified.',
  ].join('\n') + '\n';
}

export function generateBatch41CaliforniaFinalBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const sourceTargets = readJson(INPUTS.sourceTargets);
  const scrapeResults = readJsonl(INPUTS.scrapeResults);

  const earlyStartResult = scrapeResults.find((row) => row.url === 'https://www.dds.ca.gov/services/early-start/family-resource-center/regional-center-early-start-intake-and-family-resource-centers/');
  const vrResult = scrapeResults.find((row) => row.url === 'https://www.dor.ca.gov/Home/StudentServices');
  const paResult = scrapeResults.find((row) => row.url === 'https://www.disabilityrightsca.org/get-help');
  const legalAidJudiciaryResult = scrapeResults.find((row) => row.url === 'https://selfhelp.courts.ca.gov/get-free-or-low-cost-legal-help');
  const legalAidBarResult = scrapeResults.find((row) => row.url === 'https://www.calbar.ca.gov/public/legal-resources/free-legal-help');
  const ptiTarget = sourceTargets.find((row) => row.source_name === 'Matrix Parent Network and Resource Center');
  const ssiSample = loadCaliforniaSsiSample();

  if (!earlyStartResult || !vrResult || !paResult || !legalAidJudiciaryResult || !legalAidBarResult || !ptiTarget || !ssiSample) {
    throw new Error('California refresh requires reviewed Early Start, VR, P&A, legal-aid, SSI evidence, and the designated PTI source target.');
  }

  const earlyStartHtml = readSavedHtml(earlyStartResult.saved_path);
  const earlyStartCountyHeadingCount = (earlyStartHtml.match(/County</g) || []).length;
  if (earlyStartCountyHeadingCount < 58) {
    throw new Error(`Expected statewide county coverage in Early Start directory, found only ${earlyStartCountyHeadingCount} county headings.`);
  }

  const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
  if (!educationVerified || educationVerified.sample_count < 3) {
    throw new Error('California refresh requires the reviewed exact-leaf education evidence already on disk.');
  }

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: `Reviewed official DDS Early Start county directory was fetched successfully and exposes structured county coverage (${earlyStartCountyHeadingCount} county headings) plus Family Resource Center routing.`,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_leaf_repair_exhausted',
        status_reason: `Only ${educationVerified.sample_count} reviewed exact district leaves are verified on disk; county-grade district routing still cannot be proven statewide from the bounded authored packet.`,
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed California Department of Rehabilitation program, student-services, office-contact, and disputes pages now provide authoritative statewide VR / Pre-ETS routing evidence.',
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Disability Rights California Get Help is already present as reviewed first-party statewide P&A intake evidence.',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'missing_verified_statewide_source',
        status_reason: `The designated statewide PTI target ${ptiTarget.source_url} exists in planning artifacts, but the current California packet still lacks reviewed first-party statewide PTI fetch evidence for that source.`,
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed California Courts and State Bar legal-help pages provide authoritative statewide legal-aid routing.',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_exact_leaf_repair_exhausted',
        status_reason: 'The reviewed county-local packet still proves only example county-owned leaves plus the statewide BenefitsCal intake portal, not statewide county-grade local office coverage.',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => !['early_intervention_part_c', 'vocational_rehabilitation_pre_ets', 'protection_and_advocacy', 'legal_aid'].includes(row.family))
    .map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return {
          ...row,
          failure_code: 'bounded_exact_leaf_packet_exhausted_before_statewide_district_grade_coverage',
          evidence: `Reviewed exact district leaves remain limited to ${educationVerified.sample_count} saved pages; that is not enough to truthfully prove county-grade district routing across all ${summary.county_count} California counties.`,
          next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
        };
      }
      if (row.family === 'parent_training_information_center') {
        return {
          ...row,
          severity: 'major',
          failure_code: 'designated_statewide_pti_target_not_reviewed_or_verified',
          evidence: `The designated statewide PTI source ${ptiTarget.source_url} is present only as a planning target; no reviewed first-party fetch evidence for that source exists in the current California packet.`,
          next_action: 'hold_blocked_until_reviewed_statewide_pti_source_is_verified',
        };
      }
      if (row.family === 'county_local_disability_resources') {
        return {
          ...row,
          failure_code: 'reviewed_county_examples_do_not_prove_statewide_county_grade_office_coverage',
          evidence: 'The current packet still proves only sample county-owned office leaves plus BenefitsCal, not a statewide county-grade local-office directory or complete county-owned office coverage.',
          next_action: 'hold_blocked_until_new_exact_county_local_targets_are_authored',
        };
      }
      return row;
    });

  const failureByFamily = new Map(updatedFailureRows.map((row) => [row.family, row]));
  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'California Early Start',
            source_url: 'https://www.dds.ca.gov/services/early-start/',
            verification_status: 'verified',
            source_type: 'official_state_source_pack',
            source_table: 'ca_official_source_pack_v2',
          },
          {
            sample_name: 'Regional Center Early Start Intake and Family Resource Centers',
            source_url: earlyStartResult.url,
            verification_status: 'verified',
            source_type: 'official_fetched_directory',
            source_table: 'ca_scrape_results_v1',
          },
        ],
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'California Department of Rehabilitation',
            source_url: 'https://www.dor.ca.gov/',
            verification_status: 'verified',
            source_type: 'official_state_source_pack',
            source_table: 'ca_official_source_pack_v2',
          },
          {
            sample_name: 'Student Services - CA Department of Rehabilitation',
            source_url: vrResult.url,
            verification_status: 'verified',
            source_type: 'official_fetched_page',
            source_table: 'ca_scrape_results_v1',
          },
          {
            sample_name: 'Resolving Disputes and Complaints - CA Department of Rehabilitation',
            source_url: 'https://www.dor.ca.gov/Home/ResolvingDisputesAndComplaints',
            verification_status: 'verified',
            source_type: 'official_state_source_pack',
            source_table: 'ca_official_source_pack_v2',
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
            sample_name: 'Get Help | Disability Rights California',
            source_url: paResult.url,
            verification_status: 'verified',
            source_type: 'first_party_fetched_page',
            source_table: 'ca_scrape_results_v1',
          },
        ],
      };
    }
    if (row.family === 'parent_training_information_center') {
      const failure = failureByFamily.get(row.family);
      return {
        ...row,
        family_status: 'missing_verified_statewide_source',
        evidence_strength: 'missing',
        sample_count: 0,
        blocker_code: failure.failure_code,
        blocker_evidence: failure.evidence,
        samples: [],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Get free or low-cost legal help | California Courts',
            source_url: legalAidJudiciaryResult.url,
            verification_status: 'verified',
            source_type: 'official_fetched_page',
            source_table: 'ca_scrape_results_v1',
          },
          {
            sample_name: 'Free Legal Help | The State Bar of California',
            source_url: legalAidBarResult.url,
            verification_status: 'verified',
            source_type: 'official_fetched_page',
            source_table: 'ca_scrape_results_v1',
          },
        ],
      };
    }
    if (row.family === 'ssi_ssa_federal_reference') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: ssiSample.name,
            source_url: ssiSample.official_source_url || ssiSample.source_url,
            verification_status: ssiSample.verification_status,
            source_type: 'official_database_program',
            source_table: 'programs',
          },
        ],
      };
    }
    if (failureByFamily.has(row.family)) {
      const failure = failureByFamily.get(row.family);
      return {
        ...row,
        family_status: updatedGapRows.find((gapRow) => gapRow.family === row.family)?.family_status || row.family_status,
        evidence_strength: row.family === 'district_or_county_education_routing' ? 'medium' : 'weak',
        blocker_code: failure.failure_code,
        blocker_evidence: failure.evidence,
      };
    }
    return row;
  });

  const updatedNextRows = [
    {
      state: 'california',
      state_code: 'CA',
      priority_rank: 1,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'bounded_exact_leaf_packet_exhausted_before_statewide_district_grade_coverage',
      next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
      evidence: failureByFamily.get('district_or_county_education_routing')?.evidence,
    },
    {
      state: 'california',
      state_code: 'CA',
      priority_rank: 2,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'reviewed_county_examples_do_not_prove_statewide_county_grade_office_coverage',
      next_action: 'hold_blocked_until_new_exact_county_local_targets_are_authored',
      evidence: failureByFamily.get('county_local_disability_resources')?.evidence,
    },
    {
      state: 'california',
      state_code: 'CA',
      priority_rank: 3,
      family: 'parent_training_information_center',
      severity: 'major',
      failure_code: 'designated_statewide_pti_target_not_reviewed_or_verified',
      next_action: 'hold_blocked_until_reviewed_statewide_pti_source_is_verified',
      evidence: failureByFamily.get('parent_training_information_center')?.evidence,
    },
  ];

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const facts = {
    earlyStartUrl: earlyStartResult.url,
    earlyStartCountyHeadingCount,
    vrUrl: vrResult.url,
    paUrl: paResult.url,
    legalAidJudiciaryUrl: legalAidJudiciaryResult.url,
    legalAidBarUrl: legalAidBarResult.url,
    ptiDesignatedUrl: ptiTarget.source_url,
    educationLeafCount: educationVerified.sample_count,
  };
  const updatedReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, facts);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const batchSummary = {
    state: 'california',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    strong_critical_families: updatedSummary.strong_critical_families,
    weak_critical_families: updatedSummary.weak_critical_families,
    missing_critical_families: updatedSummary.missing_critical_families,
    upgraded_families: [
      'early_intervention_part_c',
      'vocational_rehabilitation_pre_ets',
      'protection_and_advocacy',
      'legal_aid',
    ],
    remaining_blockers: updatedNextRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
    })),
    facts,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, updatedReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch41CaliforniaFinalBlockerRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
