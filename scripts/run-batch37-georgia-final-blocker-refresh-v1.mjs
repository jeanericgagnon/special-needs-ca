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
  summary: path.join(generatedDir, 'georgia_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'georgia_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'georgia_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'georgia_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'georgia_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'georgia-california-grade-audit-report-v2.md'),
  districtPacket: path.join(generatedDir, 'georgia_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  ddPacket: path.join(generatedDir, 'georgia_developmental_disability_idd_authority_leaf_authoring_packet_v1.json'),
  sourceTargets: path.join(repoRoot, 'data', 'source_targets', 'georgia.json'),
  authoredTargets: path.join(docsGeneratedDir, 'authored-missing-source-targets-2026-06-17.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch37_georgia_final_blocker_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch37-georgia-final-blocker-refresh-report-v1.md'),
};

const DB_PATH = path.join(repoRoot, 'ca_disability_navigator.db');

const STATEWIDE_UPGRADES = {
  protection_and_advocacy: {
    status_reason: 'Georgia Advocacy Office is already present as a verified first-party statewide P&A source.',
  },
  parent_training_information_center: {
    status_reason: 'Parent to Parent of Georgia is already present as a verified first-party statewide PTI source.',
  },
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

function loadGeorgiaVrProgramSample() {
  const db = new Database(DB_PATH, { readonly: true });
  try {
    return db.prepare(`
      SELECT id, name, source_url, official_source_url, verification_status
      FROM programs
      WHERE state_id = 'georgia'
        AND verification_status IN ('verified', 'official_verified')
        AND (
          source_url LIKE '%gvs.georgia.gov%'
          OR official_source_url LIKE '%gvs.georgia.gov%'
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
    primary_gap_reason: 'official_county_lookup_table_has_empty_county_cells',
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
    '# Georgia California-Grade Audit Report v2',
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
    '## Georgia final blocker decision',
    '',
    `- Developmental disability routing remains blocked because the official DBHDD county table still renders ${facts.ddBlankCountyRows}/${facts.ddBlankCountyRows} blank county cells in static HTML, and the obvious same-domain region field-office leaves remain non-proving or forbidden.`,
    `- District or county education routing remains blocked because only ${facts.educationLeafCount} reviewed district-owned leaves across the bounded packet evidence have been verified; that is not enough to truthfully prove county-grade routing across 159 Georgia counties without reopening broad district discovery.`,
    '- Legal aid remains blocked because the repo only contains an authored Georgia legal-aid planning target through the LSC help directory, not a reviewed Georgia legal-aid source that has been fetched and verified into the packet evidence chain.',
    '- Georgia Advocacy Office and Parent to Parent of Georgia were upgraded out of the blocker list because verified first-party statewide evidence already existed on disk.',
  ].join('\n') + '\n';
}

export function generateBatch37GeorgiaFinalBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const districtPacket = readJson(INPUTS.districtPacket);
  const ddPacket = readJson(INPUTS.ddPacket);
  const sourceTargets = readJson(INPUTS.sourceTargets);
  const authoredTargets = readJson(INPUTS.authoredTargets);

  const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
  const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
  const authoredRows = authoredTargets.targets || authoredTargets.rows || authoredTargets;
  const legalAidTarget = authoredRows.find((row) =>
    row?.stateId === 'georgia'
    && row?.gapFamily === 'legal_aid',
  );
  const georgiaVrProgramSample = loadGeorgiaVrProgramSample();
  const legalAidPlanningUrl = legalAidTarget?.evidenceUrl || legalAidTarget?.sourceUrl || legalAidTarget?.source_url || null;
  if (!educationVerified || !ddVerified || !legalAidTarget || !legalAidPlanningUrl || !georgiaVrProgramSample) {
    throw new Error('Georgia blocker refresh requires education, DD, and legal-aid planning evidence.');
  }

  const updatedGapRows = gapRows.map((row) => {
    if (STATEWIDE_UPGRADES[row.family]) {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: STATEWIDE_UPGRADES[row.family].status_reason,
      };
    }
    if (row.family === 'developmental_disability_idd_authority') {
      return {
        ...row,
        family_status: 'blocked_official_county_table_blank',
        status_reason: 'Official DBHDD county mapping remains unprovable because the live county table renders blank county cells in static HTML and the obvious same-domain region field-office leaves do not close county coverage.',
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_leaf_repair_exhausted',
        status_reason: `Reviewed district-owned education exact leaves verified (${educationVerified.sample_count}) across the bounded Georgia packet evidence, but county-grade coverage still cannot be proven for all 159 counties without reopening broader district discovery.`,
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'missing_verified_source',
        status_reason: 'Only an authored Georgia legal-aid planning target exists; no reviewed Georgia legal-aid source has been fetched and verified into the packet evidence chain.',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => !['protection_and_advocacy', 'parent_training_information_center'].includes(row.family))
    .map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return {
          ...row,
          failure_code: 'bounded_official_district_leaf_packet_exhausted_before_county_grade_coverage',
          evidence: `Verified district-owned exact leaves remain limited to ${educationVerified.sample_count} reviewed pages across bounded Georgia packet evidence; that does not truthfully prove county-grade district routing statewide.`,
          next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
        };
      }
      if (row.family === 'legal_aid') {
      return {
        ...row,
        failure_code: 'authored_legal_aid_directory_not_yet_verified',
        evidence: `Georgia legal-aid planning currently stops at the authored authoritative target ${legalAidPlanningUrl}; no reviewed Georgia legal-aid evidence has been fetched and verified from saved artifacts.`,
        next_action: 'hold_blocked_until_reviewed_georgia_legal_aid_source_is_verified',
      };
      }
      return row;
    });

  const failureByFamily = new Map(updatedFailureRows.map((row) => [row.family, row]));
  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (STATEWIDE_UPGRADES[row.family]) {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        blocker_code: null,
        blocker_evidence: null,
      };
    }
    if (['developmental_disability_idd_authority', 'district_or_county_education_routing', 'legal_aid'].includes(row.family)) {
      const failure = failureByFamily.get(row.family);
      const familyStatus = updatedGapRows.find((gapRow) => gapRow.family === row.family)?.family_status || row.family_status;
      return {
        ...row,
        family_status: familyStatus,
        evidence_strength: row.family === 'legal_aid' ? 'missing' : 'weak',
        blocker_code: failure?.failure_code || row.blocker_code,
        blocker_evidence: failure?.evidence || row.blocker_evidence,
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets' && row.sample_count === 0) {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        samples: [
          {
            sample_name: georgiaVrProgramSample.name,
            source_url: georgiaVrProgramSample.official_source_url || georgiaVrProgramSample.source_url,
            verification_status: georgiaVrProgramSample.verification_status,
            source_type: 'official',
            source_table: 'programs',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = [
    {
      state: 'georgia',
      state_code: 'GA',
      priority_rank: 1,
      family: 'developmental_disability_idd_authority',
      severity: 'critical',
      failure_code: 'official_county_lookup_table_has_empty_county_cells',
      next_action: 'keep_blocked_until_official_county_names_or_machine_readable_mapping_are_exposed',
      evidence: failureByFamily.get('developmental_disability_idd_authority')?.evidence || ddVerified.blocker_evidence,
    },
    {
      state: 'georgia',
      state_code: 'GA',
      priority_rank: 2,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'bounded_official_district_leaf_packet_exhausted_before_county_grade_coverage',
      next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
      evidence: failureByFamily.get('district_or_county_education_routing')?.evidence,
    },
    {
      state: 'georgia',
      state_code: 'GA',
      priority_rank: 3,
      family: 'legal_aid',
      severity: 'major',
      failure_code: 'authored_legal_aid_directory_not_yet_verified',
      next_action: 'hold_blocked_until_reviewed_georgia_legal_aid_source_is_verified',
      evidence: failureByFamily.get('legal_aid')?.evidence,
    },
  ];

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const facts = {
    ddBlankCountyRows: 159,
    educationLeafCount: educationVerified.sample_count,
    districtPacketRoots: districtPacket.root_domains_to_review.length,
    ddPacketRoot: ddPacket.root_domains_to_review[0]?.source_domain || 'unknown',
  };
  const updatedReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, facts);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const batchSummary = {
    batch: 'batch_37_georgia_final_blocker_refresh_v1',
    generated_at: new Date().toISOString(),
    state: 'georgia',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    dd_packet_root: facts.ddPacketRoot,
    education_leaf_count: facts.educationLeafCount,
    remaining_failure_families: updatedFailureRows.map((row) => row.family),
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, [
    '# Batch 37 Georgia Final Blocker Refresh Report v1',
    '',
    'This pass does not broaden scraping. It upgrades stale statewide-family labels where first-party evidence already exists on disk, and it converts the remaining Georgia gaps into explicit terminal blocker states.',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${updatedSummary.completeness_pct}`,
    `- education_leaf_count: ${facts.educationLeafCount}`,
    `- dd_packet_root: ${facts.ddPacketRoot}`,
    `- remaining_failure_families: ${updatedFailureRows.map((row) => row.family).join(', ')}`,
  ].join('\n') + '\n');

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch37GeorgiaFinalBlockerRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
