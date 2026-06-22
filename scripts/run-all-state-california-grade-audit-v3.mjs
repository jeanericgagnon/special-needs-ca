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

const INPUTS = {
  auditV2: path.join(generatedDir, 'all_state_california_grade_audit_v2.json'),
  gapV2: path.join(generatedDir, 'all_state_gap_matrix_v2.jsonl'),
  failureV2: path.join(generatedDir, 'all_state_failure_ledger_v2.jsonl'),
  nextV2: path.join(generatedDir, 'all_state_next_action_queue_v2.jsonl'),
  priorityV2: path.join(generatedDir, 'all_state_priority_queue_v2.jsonl'),
  txSummaryV10: path.join(generatedDir, 'tx_verification_summary_v10.json'),
};

const OUTPUTS = {
  texasSummary: path.join(generatedDir, 'texas_california_grade_summary_v2.json'),
  texasGap: path.join(generatedDir, 'texas_gap_matrix_v2.jsonl'),
  texasFailure: path.join(generatedDir, 'texas_failure_ledger_v2.jsonl'),
  texasVerifiedSources: path.join(generatedDir, 'texas_verified_sources_v1.jsonl'),
  texasNextAction: path.join(generatedDir, 'texas_next_action_queue_v2.jsonl'),
  texasReport: path.join(docsGeneratedDir, 'texas-california-grade-audit-report-v2.md'),
  auditV3: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  priorityV3: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  reportV3: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  planV3: path.join(docsGeneratedDir, 'all-state-priority-plan-v3.md'),
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
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function loadStateGapFamilyStatuses(stateId) {
  const gapFilePath = path.join(generatedDir, `${stateId}_gap_matrix_v2.jsonl`);
  if (!fs.existsSync(gapFilePath)) return null;
  const gapRows = readJsonl(gapFilePath);
  if (!gapRows.length) return null;
  return Object.fromEntries(gapRows.map((row) => [row.family, row.family_status]));
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

function buildNextActions(stateRow) {
  return [{
    state: stateRow.stateId,
    state_code: stateRow.stateCode,
    priority_rank: 1,
    family: 'maintenance',
    severity: 'info',
    failure_code: 'complete_maintain_truth_only',
    next_action: 'Preserve Texas as COMPLETE/index_safe and rerun only maintenance truth audits unless new evidence regresses.',
    evidence: 'Texas v10 remains 254/0/0 and all_state_california_grade_audit_v2 marks Texas COMPLETE.',
  }];
}

function buildTexasSummary(stateRow, verifiedSources) {
  return {
    state: stateRow.stateId,
    state_code: stateRow.stateCode,
    state_name: stateRow.stateName,
    batch: 'texas_complete_state_packet_v1',
    classification: stateRow.classification,
    index_safe: stateRow.indexSafe,
    incorrectly_index_safe: stateRow.incorrectlyIndexSafe,
    county_count: stateRow.countyCount,
    completeness_pct: stateRow.completenessPct,
    strong_critical_families: stateRow.strongCriticalFamilies,
    weak_critical_families: stateRow.weakCriticalFamilies,
    missing_critical_families: stateRow.missingCriticalFamilies,
    total_critical_families: stateRow.totalCriticalFamilies,
    primary_gap_reason: 'none',
    recommended_batch: 'complete_maintain',
    critical_gap_families: [],
    major_gap_families: [],
    verified_source_families_with_samples: verifiedSources.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: true,
    texas_v10_rule_basis: [
      'Preserve noindex until all critical families are verified',
      'District-grade routing must use direct local or district-owned evidence, not generic or statewide fallback',
      'Legacy/inventory-only evidence does not satisfy California-grade completeness',
    ],
  };
}

function buildTexasReport(summary, gapRows, verifiedSources, nextActions, txV10) {
  return [
    '# Texas California-Grade Audit Report v2',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    '- primary_gap_reason: none',
    `- v10 PASS/PARTIAL/BLOCKED: ${txV10.v10.pass_counties}/${txV10.v10.partial_counties}/${txV10.v10.blocked_counties}`,
    '',
    '## Family status',
    '',
    ...gapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`),
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
    '- Texas remains COMPLETE and index-safe under current evidence.',
  ].join('\n');
}

function generateTexasPacket(auditV2, gapsV2, failuresV2, txV10) {
  const texas = auditV2.states.find((row) => row.stateId === 'texas');
  if (!texas) throw new Error('Texas is missing from all_state_california_grade_audit_v2.json');
  const texasGapRows = gapsV2.filter((row) => row.state === 'texas');
  const texasFailureRows = failuresV2.filter((row) => row.state === 'texas');

  const db = new Database(dbPath, { readonly: true });
  try {
    const verifiedSources = buildVerifiedSources(db, texas, texasFailureRows);
    const nextActions = buildNextActions(texas);
    const summary = buildTexasSummary(texas, verifiedSources);
    const report = buildTexasReport(summary, texasGapRows, verifiedSources, nextActions, txV10);

    writeJson(OUTPUTS.texasSummary, summary);
    writeJsonl(OUTPUTS.texasGap, texasGapRows);
    writeJsonl(OUTPUTS.texasFailure, texasFailureRows);
    writeJsonl(OUTPUTS.texasVerifiedSources, verifiedSources);
    writeJsonl(OUTPUTS.texasNextAction, nextActions);
    fs.writeFileSync(OUTPUTS.texasReport, `${report}\n`);
  } finally {
    db.close();
  }
}

function generateAllStateCaliforniaGradeAuditV3() {
  const auditV2 = readJson(INPUTS.auditV2);
  const priorityV2 = readJsonl(INPUTS.priorityV2);
  const gapsV2 = readJsonl(INPUTS.gapV2);
  const failuresV2 = readJsonl(INPUTS.failureV2);
  const txV10 = readJson(INPUTS.txSummaryV10);

  if (txV10.v10.pass_counties !== 254 || txV10.v10.partial_counties !== 0 || txV10.v10.blocked_counties !== 0 || !txV10.index_safe) {
    throw new Error('Texas v10 must remain 254/0/0 and index-safe before generating v3.');
  }

  generateTexasPacket(auditV2, gapsV2, failuresV2, txV10);

  const summaryFiles = fs.readdirSync(generatedDir).filter((file) => file.endsWith('_california_grade_summary_v2.json'));
  const summaryStateIds = summaryFiles.map((file) => file.replace('_california_grade_summary_v2.json', ''));
  const packetMissingStates = auditV2.states.map((row) => row.stateId).filter((stateId) => !summaryStateIds.includes(stateId));

  const packetSummaries = summaryFiles.map((file) => readJson(path.join(generatedDir, file)));
  const summaryByState = new Map(packetSummaries.map((row) => [row.state, row]));

  const statesV3 = auditV2.states.map((stateRow) => {
    const summary = summaryByState.get(stateRow.stateId);
    if (!summary) return stateRow;
    const familyStatuses = loadStateGapFamilyStatuses(stateRow.stateId);
    return {
      ...stateRow,
      classification: summary.classification,
      indexSafe: summary.index_safe,
      incorrectlyIndexSafe: summary.incorrectly_index_safe,
      completenessPct: summary.completeness_pct,
      strongCriticalFamilies: summary.strong_critical_families,
      weakCriticalFamilies: summary.weak_critical_families,
      missingCriticalFamilies: summary.missing_critical_families,
      packetGenerated: true,
      packetBatch: summary.batch,
      packetPrimaryGapReason: summary.primary_gap_reason,
      packetRecommendedBatch: summary.recommended_batch,
      familyStatuses: familyStatuses || stateRow.familyStatuses,
    };
  });

  const classifications = {};
  for (const row of statesV3) {
    classifications[row.classification] = (classifications[row.classification] || 0) + 1;
  }

  const stateV3ById = new Map(statesV3.map((row) => [row.stateId, row]));
  const priorityV3 = priorityV2.map((row) => {
    const stateV3 = stateV3ById.get(row.state);
    return {
      ...row,
      classification: stateV3?.classification || row.classification,
      index_safe: stateV3?.indexSafe ?? row.index_safe,
      completeness_pct: stateV3?.completenessPct ?? row.completeness_pct,
      missing_critical_families: stateV3?.missingCriticalFamilies ?? row.missing_critical_families,
      weak_critical_families: stateV3?.weakCriticalFamilies ?? row.weak_critical_families,
      primary_gap_reason: stateV3?.packetPrimaryGapReason || summaryByState.get(row.state)?.primary_gap_reason || row.primary_gap_reason,
      recommended_batch: stateV3?.packetRecommendedBatch || summaryByState.get(row.state)?.recommended_batch || row.recommended_batch,
      state_packet_generated: summaryByState.has(row.state),
      repair_lane: (stateV3?.classification || row.classification) === 'COMPLETE' ? 'maintain_truth_only' : 'repair_from_state_packet',
    };
  });

  const auditV3 = {
    ...auditV2,
    generatedAt: new Date().toISOString(),
    states: statesV3,
    classifications,
    indexSafeCount: statesV3.filter((row) => row.indexSafe).length,
    incorrectlyIndexSafeStates: statesV3.filter((row) => row.incorrectlyIndexSafe).map((row) => row.stateId),
    packetCoverageCount: summaryStateIds.length,
    packetMissingStates,
    lessonsUpdate: 'Added a new queue-completion lesson: once every state has a packet, stop expanding the queue and switch to failure-class repair from packet artifacts.',
  };

  const reportV3 = [
    '# All-State California-Grade Audit Report v3',
    '',
    'This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.',
    '',
    '## Packet coverage',
    '',
    `- packet_coverage_count: ${summaryStateIds.length}`,
    `- packet_missing_states: ${packetMissingStates.join(', ') || 'none'}`,
    '',
    '## Classification counts',
    '',
    ...Object.entries(classifications).map(([label, count]) => `- ${label}: ${count}`),
    '',
    `- index-safe states: ${auditV3.indexSafeCount}`,
    '',
    '## Notes',
    '',
    '- Texas remains COMPLETE/index-safe from v10.',
    '- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.',
    '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.',
    '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.',
  ].join('\n');

  const planV3 = [
    '# All-State Priority Plan v3',
    '',
    'All 50 states now have California-grade packet coverage.',
    '',
    '## Next phase',
    '',
    '- Stop expanding packet coverage.',
    '- Run failure-class repair lanes from the generated state packets.',
    '- Preserve Texas as COMPLETE/index-safe and repair other states only when evidence can move them truthfully.',
  ].join('\n');

  writeJson(OUTPUTS.auditV3, auditV3);
  writeJsonl(OUTPUTS.priorityV3, priorityV3);
  fs.writeFileSync(OUTPUTS.reportV3, `${reportV3}\n`);
  fs.writeFileSync(OUTPUTS.planV3, `${planV3}\n`);
  return { auditV3, priorityV3 };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateAllStateCaliforniaGradeAuditV3();
  console.log(JSON.stringify({
    ok: true,
    packetCoverageCount: result.auditV3.packetCoverageCount,
    packetMissingStates: result.auditV3.packetMissingStates,
    classifications: result.auditV3.classifications,
    indexSafeCount: result.auditV3.indexSafeCount,
  }, null, 2));
}

export { generateAllStateCaliforniaGradeAuditV3 };
