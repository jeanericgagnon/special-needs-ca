import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const BATCH_STATES = ['new-jersey'];
const STATE_CODE = { 'new-jersey': 'NJ' };
const STATE_LABEL = { 'new-jersey': 'New Jersey' };

const INPUTS = {
  auditV2: path.join(generatedDir, 'all_state_california_grade_audit_v2.json'),
  failureV2: path.join(generatedDir, 'all_state_failure_ledger_v2.jsonl'),
  priorityV2: path.join(generatedDir, 'all_state_priority_queue_v2.jsonl'),
  gapV2: path.join(generatedDir, 'all_state_gap_matrix_v2.jsonl'),
  txSummaryV10: path.join(generatedDir, 'tx_verification_summary_v10.json'),
  txReportV10: path.join(docsGeneratedDir, 'tx-final-three-repair-report-v10.md'),
};

const FAMILY_QUERIES = {
  medicaid_state_health_coverage: {
    description: 'Programs table rows with verified state program evidence.',
    sql: `
      select programs.name as sample_name, coalesce(programs.source_url, programs.official_source_url) as source_url, programs.verification_status, programs.source_type, 'programs' as source_table
      from programs
      where programs.state_id = @state
        and programs.verification_status in ('verified','official_verified')
        and coalesce(programs.source_url, programs.official_source_url, '') <> ''
      order by case when programs.verification_status='official_verified' then 0 else 1 end, programs.name
      limit 3
    `,
  },
  medicaid_waiver_hcbs_disability_services: {
    description: 'Waiver-like program rows or fallback to verified program rows when the state stores waiver entry in the general spine.',
    sql: `
      select programs.name as sample_name, coalesce(programs.source_url, programs.official_source_url) as source_url, programs.verification_status, programs.source_type, 'programs' as source_table
      from programs
      where programs.state_id = @state
        and programs.verification_status in ('verified','official_verified')
        and coalesce(programs.source_url, programs.official_source_url, '') <> ''
        and (
          lower(coalesce(programs.program_type,'')) like '%waiver%'
          or lower(coalesce(programs.name,'')) like '%waiver%'
          or lower(coalesce(programs.description,'')) like '%hcbs%'
        )
      order by case when programs.verification_status='official_verified' then 0 else 1 end, programs.name
      limit 3
    `,
    fallbackFamily: 'medicaid_state_health_coverage',
  },
  developmental_disability_idd_authority: {
    description: 'Verified DD/IDD state-resource-agency rows.',
    sql: `
      select name as sample_name, coalesce(source_url, website, services_page, eligibility_info_page) as source_url, verification_status, source_type, 'state_resource_agencies' as source_table
      from state_resource_agencies
      where state_id = @state
        and verification_status in ('verified','official_verified')
        and lower(coalesce(agency_type,'')) not like '%early%'
        and coalesce(source_url, website, services_page, eligibility_info_page, '') <> ''
      order by case when verification_status='official_verified' then 0 else 1 end, name
      limit 3
    `,
  },
  early_intervention_part_c: {
    description: 'Verified early-intervention or Part C agency rows.',
    sql: `
      select name as sample_name, coalesce(source_url, website, services_page, eligibility_info_page) as source_url, verification_status, source_type, 'state_resource_agencies' as source_table
      from state_resource_agencies
      where state_id = @state
        and verification_status in ('verified','official_verified')
        and (
          lower(coalesce(agency_type,'')) like '%early%'
          or lower(coalesce(name,'')) like '%early%'
          or lower(coalesce(name,'')) like '%part c%'
        )
        and coalesce(source_url, website, services_page, eligibility_info_page, '') <> ''
      order by case when verification_status='official_verified' then 0 else 1 end, name
      limit 3
    `,
  },
  special_education_idea_part_b: {
    description: 'Verified regional education or district pages with special-education routing.',
    sql: `
      select name as sample_name, coalesce(source_url, website) as source_url, verification_status, source_type, 'regional_education_agencies' as source_table
      from regional_education_agencies
      where state_id = @state
        and verification_status in ('verified','official_verified')
        and coalesce(source_url, website, '') <> ''
      order by case when verification_status='official_verified' then 0 else 1 end, name
      limit 3
    `,
  },
  district_or_county_education_routing: {
    description: 'Verified school-district routing pages for the state.',
    sql: `
      select school_districts.name as sample_name, coalesce(school_districts.source_url, school_districts.website) as source_url, school_districts.verification_status, school_districts.source_type, 'school_districts' as source_table
      from school_districts
      join counties on counties.id = school_districts.county_id
      where counties.state_id = @state
        and school_districts.verification_status in ('verified','official_verified')
        and coalesce(school_districts.source_url, school_districts.website, '') <> ''
      order by case when school_districts.verification_status='official_verified' then 0 else 1 end, school_districts.name
      limit 3
    `,
  },
  vocational_rehabilitation_pre_ets: {
    description: 'Verified programs with VR or Pre-ETS context.',
    sql: `
      select programs.name as sample_name, coalesce(programs.source_url, programs.official_source_url) as source_url, programs.verification_status, programs.source_type, 'programs' as source_table
      from programs
      where programs.state_id = @state
        and programs.verification_status in ('verified','official_verified')
        and coalesce(programs.source_url, programs.official_source_url, '') <> ''
        and (
          lower(coalesce(programs.name,'')) like '%rehabil%'
          or lower(coalesce(programs.name,'')) like '%pre-ets%'
          or lower(coalesce(programs.description,'')) like '%pre-employment%'
        )
      order by case when programs.verification_status='official_verified' then 0 else 1 end, programs.name
      limit 3
    `,
  },
  protection_and_advocacy: {
    description: 'Verified nonprofit rows that explicitly look like protection and advocacy resources.',
    sql: `
      select nonprofit_organizations.name as sample_name, coalesce(nonprofit_organizations.source_url, nonprofit_organizations.website) as source_url, nonprofit_organizations.verification_status, nonprofit_organizations.source_type, 'nonprofit_organizations' as source_table
      from nonprofit_organizations
      join counties on counties.id = nonprofit_organizations.county_id
      where counties.state_id = @state
        and nonprofit_organizations.verification_status in ('verified','official_verified')
        and (
          lower(coalesce(nonprofit_organizations.name,'')) like '%disability rights%'
          or lower(coalesce(nonprofit_organizations.name,'')) like '%protection%'
          or lower(coalesce(nonprofit_organizations.name,'')) like '%advocacy%'
        )
        and coalesce(nonprofit_organizations.source_url, nonprofit_organizations.website, '') <> ''
      order by nonprofit_organizations.name
      limit 3
    `,
  },
  parent_training_information_center: {
    description: 'Verified nonprofit rows that look like parent centers or PTIs.',
    sql: `
      select nonprofit_organizations.name as sample_name, coalesce(nonprofit_organizations.source_url, nonprofit_organizations.website) as source_url, nonprofit_organizations.verification_status, nonprofit_organizations.source_type, 'nonprofit_organizations' as source_table
      from nonprofit_organizations
      join counties on counties.id = nonprofit_organizations.county_id
      where counties.state_id = @state
        and nonprofit_organizations.verification_status in ('verified','official_verified')
        and (
          lower(coalesce(nonprofit_organizations.name,'')) like '%parent%'
          or lower(coalesce(nonprofit_organizations.name,'')) like '%family network%'
          or lower(coalesce(nonprofit_organizations.name,'')) like '%training and information%'
        )
        and coalesce(nonprofit_organizations.source_url, nonprofit_organizations.website, '') <> ''
      order by nonprofit_organizations.name
      limit 3
    `,
  },
  legal_aid: {
    description: 'Verified nonprofit or advocate rows that look like legal-aid resources.',
    sql: `
      select nonprofit_organizations.name as sample_name, coalesce(nonprofit_organizations.source_url, nonprofit_organizations.website) as source_url, nonprofit_organizations.verification_status, nonprofit_organizations.source_type, 'nonprofit_organizations' as source_table
      from nonprofit_organizations
      join counties on counties.id = nonprofit_organizations.county_id
      where counties.state_id = @state
        and nonprofit_organizations.verification_status in ('verified','official_verified')
        and (
          lower(coalesce(nonprofit_organizations.name,'')) like '%legal%'
          or lower(coalesce(nonprofit_organizations.name,'')) like '%law center%'
          or lower(coalesce(nonprofit_organizations.name,'')) like '%justice%'
        )
        and coalesce(nonprofit_organizations.source_url, nonprofit_organizations.website, '') <> ''
      order by nonprofit_organizations.name
      limit 3
    `,
  },
  able_program: {
    description: 'Verified ABLE program pages from the program spine.',
    sql: `
      select programs.name as sample_name, coalesce(programs.source_url, programs.official_source_url) as source_url, programs.verification_status, programs.source_type, 'programs' as source_table
      from programs
      where programs.state_id = @state
        and programs.verification_status in ('verified','official_verified')
        and coalesce(programs.source_url, programs.official_source_url, '') <> ''
        and (
          lower(coalesce(programs.name,'')) like '%able%'
          or lower(coalesce(programs.description,'')) like '%able account%'
        )
      order by case when programs.verification_status='official_verified' then 0 else 1 end, programs.name
      limit 3
    `,
  },
  ssi_ssa_federal_reference: {
    description: 'Verified federal/state crossover program rows.',
    sql: `
      select programs.name as sample_name, coalesce(programs.source_url, programs.official_source_url) as source_url, programs.verification_status, programs.source_type, 'programs' as source_table
      from programs
      where programs.state_id = @state
        and programs.verification_status in ('verified','official_verified')
        and coalesce(programs.source_url, programs.official_source_url, '') <> ''
        and (
          lower(coalesce(programs.name,'')) like '%ssi%'
          or lower(coalesce(programs.name,'')) like '%supplemental security%'
          or lower(coalesce(programs.description,'')) like '%social security%'
        )
      order by case when programs.verification_status='official_verified' then 0 else 1 end, programs.name
      limit 3
    `,
  },
  county_local_disability_resources: {
    description: 'Verified county office rows for local routing.',
    sql: `
      select county_offices.office_name as sample_name, coalesce(county_offices.source_url, county_offices.website) as source_url, county_offices.verification_status, county_offices.source_type, 'county_offices' as source_table
      from county_offices
      join counties on counties.id = county_offices.county_id
      where counties.state_id = @state
        and county_offices.verification_status in ('verified','official_verified')
        and coalesce(county_offices.source_url, county_offices.website, '') <> ''
      order by case when county_offices.verification_status='official_verified' then 0 else 1 end, county_offices.office_name
      limit 3
    `,
  },
};

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
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function sampleRowsForFamily(db, stateId, familyId) {
  const query = FAMILY_QUERIES[familyId];
  if (!query) return [];
  const rows = db.prepare(query.sql).all({ state: stateId }).filter((row) => row.source_url);
  if (rows.length || !query.fallbackFamily) return rows;
  return sampleRowsForFamily(db, stateId, query.fallbackFamily);
}

function buildVerifiedSources(db, stateRow, stateFailures) {
  return Object.entries(stateRow.familyStatuses).map(([familyId, familyStatus]) => {
    const samples = sampleRowsForFamily(db, stateRow.stateId, familyId);
    const failure = stateFailures.find((row) => row.family === familyId) || null;
    const strength = familyStatus.startsWith('verified_')
      ? 'strong'
      : familyStatus.includes('legacy') || familyStatus === 'inventory_only'
        ? 'weak'
        : 'missing';
    return {
      state: stateRow.stateId,
      state_code: stateRow.stateCode,
      family: familyId,
      family_status: familyStatus,
      evidence_strength: strength,
      sample_count: samples.length,
      query_basis: FAMILY_QUERIES[familyId]?.description || 'no query configured',
      blocker_code: failure?.failure_code || null,
      blocker_evidence: failure?.evidence || null,
      samples,
    };
  });
}

function buildNextActions(stateRow, stateFailures) {
  return stateFailures.map((row, index) => ({
    state: stateRow.stateId,
    state_code: stateRow.stateCode,
    priority_rank: index + 1,
    family: row.family,
    severity: row.severity,
    failure_code: row.failure_code,
    next_action: row.next_action,
    evidence: row.evidence,
  }));
}

function buildStateSummary(stateRow, stateFailures, priorityRow, verifiedSources) {
  const criticalGaps = stateFailures.filter((row) => row.severity === 'critical').map((row) => row.family);
  const majorGaps = stateFailures.filter((row) => row.severity === 'major').map((row) => row.family);
  return {
    state: stateRow.stateId,
    state_code: stateRow.stateCode,
    state_name: stateRow.stateName,
    batch: 'batch_17_procedure_hardening_states_v1',
    classification: stateRow.classification,
    index_safe: stateRow.indexSafe,
    incorrectly_index_safe: stateRow.incorrectlyIndexSafe,
    county_count: stateRow.countyCount,
    completeness_pct: stateRow.completenessPct,
    strong_critical_families: stateRow.strongCriticalFamilies,
    weak_critical_families: stateRow.weakCriticalFamilies,
    missing_critical_families: stateRow.missingCriticalFamilies,
    total_critical_families: stateRow.totalCriticalFamilies,
    primary_gap_reason: priorityRow?.primary_gap_reason || stateFailures[0]?.failure_code || 'none',
    recommended_batch: priorityRow?.recommended_batch || null,
    critical_gap_families: criticalGaps,
    major_gap_families: majorGaps,
    verified_source_families_with_samples: verifiedSources.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: stateRow.classification === 'COMPLETE' && stateRow.indexSafe,
    texas_v10_rule_basis: [
      'Preserve noindex until all critical families are verified',
      'District-grade routing must use direct local or district-owned evidence, not generic or statewide fallback',
      'Legacy/inventory-only evidence does not satisfy California-grade completeness',
    ],
  };
}

function buildStateReport(stateRow, summary, gapRows, failureRows, verifiedSources, nextActions) {
  return [
    `# ${stateRow.stateName} California-Grade Batch 17 Report v1`,
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
    ...verifiedSources.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextActions.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Completion decision',
    '',
    summary.complete_ready
      ? `- ${stateRow.stateName} is COMPLETE and index-safe under current evidence.`
      : `- ${stateRow.stateName} remains ${summary.classification} and not index-safe because one or more critical families are still legacy, inventory-only, or missing.`,
  ].join('\n');
}

function buildBatchSummary(stateRows, auditV2, txSummaryV10) {
  const completeStates = stateRows.filter((row) => row.summary.complete_ready).map((row) => row.state);
  return {
    batch: 'batch_17_procedure_hardening_states_v1',
    generated_at: new Date().toISOString(),
    states: stateRows.map((row) => ({
      state: row.state,
      classification: row.summary.classification,
      index_safe: row.summary.index_safe,
      completeness_pct: row.summary.completeness_pct,
      primary_gap_reason: row.summary.primary_gap_reason,
      critical_gap_families: row.summary.critical_gap_families,
    })),
    complete_states: completeStates,
    generated_all_state_v3: completeStates.length > 0,
    texas_preserved_complete: Boolean(
      auditV2.states.find((row) => row.stateId === 'texas' && row.classification === 'COMPLETE' && row.indexSafe)
      && txSummaryV10.v10.pass_counties === 254
      && txSummaryV10.index_safe === true,
    ),
  };
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 17 Procedure Hardening States Report v1',
    '',
    'This pass creates a state-specific California-grade repair control-plane artifact for New Jersey using the hardened Texas v10 rules. It does not promote the state without full critical-family verification.',
    '',
    '## State status',
    '',
    ...batchSummary.states.map((row) => `- ${STATE_LABEL[row.state]}: ${row.classification}; index_safe=${row.index_safe}; completeness_pct=${row.completeness_pct}; primary_gap_reason=${row.primary_gap_reason}`),
    '',
    '## Batch outcome',
    '',
    `- complete_states: ${batchSummary.complete_states.join(', ') || 'none'}`,
    `- generated_all_state_v3: ${batchSummary.generated_all_state_v3 ? 'true' : 'false'}`,
    `- texas_preserved_complete: ${batchSummary.texas_preserved_complete ? 'true' : 'false'}`,
    '',
    '## Lessons learned update',
    '',
    '- No new reusable lesson was promoted from Batch 17; existing Texas v10 rules and the current lessons docs remain authoritative for the next batch.',
  ].join('\n');
}

export function generateBatch17ProcedureHardeningStatesV1() {
  const auditV2 = readJson(INPUTS.auditV2);
  const failuresV2 = readJsonl(INPUTS.failureV2);
  const priorityV2 = readJsonl(INPUTS.priorityV2);
  const gapsV2 = readJsonl(INPUTS.gapV2);
  const txSummaryV10 = readJson(INPUTS.txSummaryV10);
  const txReportV10 = fs.readFileSync(INPUTS.txReportV10, 'utf8');
  if (!txReportV10.includes('v10 PASS/PARTIAL/BLOCKED: 254/0/0')) throw new Error('Texas v10 report no longer proves 254/0/0.');

  const db = new Database(dbPath, { readonly: true });
  try {
    const batchRows = [];
    for (const stateId of BATCH_STATES) {
      const stateRow = auditV2.states.find((row) => row.stateId === stateId);
      if (!stateRow) throw new Error(`Missing state row for ${stateId} in all_state_california_grade_audit_v2.json`);
      const stateGapRows = gapsV2.filter((row) => row.state === stateId);
      const stateFailureRows = failuresV2.filter((row) => row.state === stateId);
      const statePriorityRow = priorityV2.find((row) => row.state === stateId) || null;
      const verifiedSources = buildVerifiedSources(db, stateRow, stateFailureRows);
      const nextActions = buildNextActions(stateRow, stateFailureRows);
      const summary = buildStateSummary(stateRow, stateFailureRows, statePriorityRow, verifiedSources);
      const report = buildStateReport(stateRow, summary, stateGapRows, stateFailureRows, verifiedSources, nextActions);

      writeJson(path.join(generatedDir, `${stateId}_california_grade_summary_v2.json`), summary);
      writeJsonl(path.join(generatedDir, `${stateId}_gap_matrix_v2.jsonl`), stateGapRows);
      writeJsonl(path.join(generatedDir, `${stateId}_failure_ledger_v2.jsonl`), stateFailureRows);
      writeJsonl(path.join(generatedDir, `${stateId}_verified_sources_v1.jsonl`), verifiedSources);
      writeJsonl(path.join(generatedDir, `${stateId}_next_action_queue_v2.jsonl`), nextActions);
      fs.writeFileSync(path.join(docsGeneratedDir, `${stateId}-california-grade-audit-report-v2.md`), `${report}\n`);

      batchRows.push({ state: stateId, summary, gapRows: stateGapRows, failureRows: stateFailureRows, verifiedSources, nextActions });
    }

    const batchSummary = buildBatchSummary(batchRows, auditV2, txSummaryV10);
    writeJson(path.join(generatedDir, 'batch17_procedure_hardening_states_summary_v1.json'), batchSummary);
    fs.writeFileSync(path.join(docsGeneratedDir, 'batch17-procedure-hardening-states-report-v1.md'), `${buildBatchReport(batchSummary)}\n`);
    return batchSummary;
  } finally {
    db.close();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch17ProcedureHardeningStatesV1();
  console.log(JSON.stringify(summary, null, 2));
}
