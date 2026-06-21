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
  batch18Queue: path.join(generatedDir, 'batch18_failure_class_repair_queue_v1.jsonl'),
  batch18Summary: path.join(generatedDir, 'batch18_failure_class_repair_states_summary_v1.json'),
  txSummaryV10: path.join(generatedDir, 'tx_verification_summary_v10.json'),
};

const FAMILY_CONFIG = {
  early_intervention_part_c: {
    sourceTable: 'state_resource_agencies',
    sampleQuery: `
      select agency_type as entity_kind, name as entity_name,
        coalesce(source_url, website, services_page, eligibility_info_page) as source_url,
        verification_status
      from state_resource_agencies
      where state_id = @state
        and (
          lower(coalesce(agency_type,'')) like '%early%'
          or lower(coalesce(name,'')) like '%early%'
          or lower(coalesce(name,'')) like '%part c%'
        )
        and coalesce(source_url, website, services_page, eligibility_info_page, '') <> ''
      order by case when verification_status='official_verified' then 0 else 1 end, name
      limit 12
    `,
    exactTargetGoals: ['referral', 'intake', 'eligibility', 'local office directory', 'family rights or dispute path'],
    exactTargetTerms: ['referral', 'intake', 'eligibility', 'contact', 'county', 'provider', 'family rights', 'complaint'],
  },
  developmental_disability_idd_authority: {
    sourceTable: 'state_resource_agencies',
    sampleQuery: `
      select agency_type as entity_kind, name as entity_name,
        coalesce(source_url, website, services_page, eligibility_info_page) as source_url,
        verification_status
      from state_resource_agencies
      where state_id = @state
        and lower(coalesce(agency_type,'')) not like '%early%'
        and coalesce(source_url, website, services_page, eligibility_info_page, '') <> ''
      order by case when verification_status='official_verified' then 0 else 1 end, name
      limit 12
    `,
    exactTargetGoals: ['eligibility', 'intake or application', 'county or regional catchment page', 'office contact page', 'appeals or complaints path'],
    exactTargetTerms: ['eligibility', 'apply', 'intake', 'office', 'contact', 'county', 'regional', 'appeal', 'complaint'],
  },
  district_or_county_education_routing: {
    sourceTable: 'school_districts',
    sampleQuery: `
      select 'school_districts' as entity_kind, school_districts.name as entity_name,
        coalesce(school_districts.source_url, school_districts.website) as source_url,
        school_districts.verification_status
      from school_districts
      join counties on counties.id = school_districts.county_id
      where counties.state_id = @state
        and coalesce(school_districts.source_url, school_districts.website, '') <> ''
      union all
      select coalesce(regional_education_agencies.agency_type,'regional_education_agency') as entity_kind,
        regional_education_agencies.name as entity_name,
        coalesce(regional_education_agencies.source_url, regional_education_agencies.website) as source_url,
        regional_education_agencies.verification_status
      from regional_education_agencies
      where regional_education_agencies.state_id = @state
        and coalesce(regional_education_agencies.source_url, regional_education_agencies.website, '') <> ''
      limit 12
    `,
    exactTargetGoals: ['special education contact page', 'IEP or exceptional student services page', 'parent rights or procedural safeguards', 'district directory or county routing page'],
    exactTargetTerms: ['special education', 'student services', 'exceptional', 'ESE', 'IEP', 'parent rights', 'procedural safeguards', 'directory'],
  },
  county_local_disability_resources: {
    sourceTable: 'county_offices',
    sampleQuery: `
      select 'county_offices' as entity_kind, county_offices.office_name as entity_name,
        coalesce(county_offices.source_url, county_offices.website) as source_url,
        county_offices.verification_status
      from county_offices
      join counties on counties.id = county_offices.county_id
      where counties.state_id = @state
        and coalesce(county_offices.source_url, county_offices.website, '') <> ''
      order by case when county_offices.verification_status='official_verified' then 0 else 1 end, county_offices.office_name
      limit 12
    `,
    exactTargetGoals: ['county office contact page', 'application or services page', 'office locator or local directory', 'eligibility or intake page'],
    exactTargetTerms: ['office', 'contact', 'services', 'apply', 'eligibility', 'directory', 'location', 'phone'],
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

function toDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function toRoot(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}/`;
  } catch {
    return null;
  }
}

function parseEvidenceMetrics(evidence) {
  const metrics = {
    dbFieldAgencyLabelCount: 0,
    federalMismatchCount: 0,
    genericRootCount: 0,
  };
  const fieldMatch = evidence.match(/(\d+)\s+inventory rows use DB-field agency labels/i);
  if (fieldMatch) metrics.dbFieldAgencyLabelCount = Number(fieldMatch[1]);
  const mismatchMatch = evidence.match(/(\d+)\s+inventory rows show federal\/state mismatch/i);
  if (mismatchMatch) metrics.federalMismatchCount = Number(mismatchMatch[1]);
  const rootMatch = evidence.match(/(\d+)\s+generic roots need leaf verification/i);
  if (rootMatch) metrics.genericRootCount = Number(rootMatch[1]);
  return metrics;
}

function sampleRowsForFamily(db, stateId, family) {
  const config = FAMILY_CONFIG[family];
  if (!config) return [];
  return db.prepare(config.sampleQuery).all({ state: stateId });
}

function buildPacket(stateId, stateCode, family, evidence, db) {
  const config = FAMILY_CONFIG[family];
  const samples = sampleRowsForFamily(db, stateId, family)
    .filter((row) => row.source_url)
    .map((row) => ({
      entity_kind: row.entity_kind,
      entity_name: row.entity_name,
      source_url: row.source_url,
      source_domain: toDomain(row.source_url),
      source_root: toRoot(row.source_url),
      verification_status: row.verification_status,
    }));

  const uniqueRoots = [];
  const seenRoots = new Set();
  for (const sample of samples) {
    if (sample.source_root && !seenRoots.has(sample.source_root)) {
      seenRoots.add(sample.source_root);
      uniqueRoots.push({
        source_root: sample.source_root,
        source_domain: sample.source_domain,
        sample_entity_name: sample.entity_name,
      });
    }
  }

  return {
    state: stateId,
    state_code: stateCode,
    family,
    repair_lane: 'county_district_leaf_repair',
    purpose: 'Deterministic authoring packet for replacing generic or statewide evidence with county/district exact leaf targets.',
    current_problem_metrics: parseEvidenceMetrics(evidence),
    exact_target_goals: config.exactTargetGoals,
    exact_target_terms: config.exactTargetTerms,
    representative_sources: samples.slice(0, 8),
    root_domains_to_review: uniqueRoots.slice(0, 8),
    packet_complete_when: 'At least one reviewed district/county/local exact target is authored for each affected critical family without relying on a generic root or statewide-only page.',
  };
}

function buildBatchReport(summary) {
  return [
    '# Batch 19 County/District Leaf Authoring Report v1',
    '',
    'This pass turns the Batch 18 county_district_leaf_repair cohort into deterministic authoring packets. It does not scrape or promote; it packages the existing DB and packet evidence into family-specific exact-target intents and reviewed root domains.',
    '',
    '## Cohort status',
    '',
    ...summary.states.map((row) => `- ${row.state}: packets=${row.packet_count}; families=${row.families.join(', ')}`),
    '',
    '## Shared repair pattern',
    '',
    ...Object.entries(summary.familyCounts).map(([family, count]) => `- ${family}: ${count}`),
    '',
    '## Root-domain review counts',
    '',
    ...Object.entries(summary.rootDomainCounts).map(([state, count]) => `- ${state}: ${count}`),
    '',
    '## Outcome',
    '',
    '- Texas remains COMPLETE/index-safe and is not included in this authoring cohort.',
    '- The next operator can now author exact county/district leaf targets from these packets without reopening the broad queue.',
  ].join('\n');
}

export function generateBatch19CountyDistrictLeafAuthoringV1() {
  const batch18Queue = readJsonl(INPUTS.batch18Queue).filter((row) => row.repair_lane === 'county_district_leaf_repair');
  const batch18Summary = readJson(INPUTS.batch18Summary);
  const txSummaryV10 = readJson(INPUTS.txSummaryV10);

  if (!batch18Summary.texas_preserved_complete || txSummaryV10.v10.pass_counties !== 254 || txSummaryV10.index_safe !== true) {
    throw new Error('Batch 19 requires Texas v10 truth preserved.');
  }

  const db = new Database(dbPath, { readonly: true });
  try {
    const grouped = new Map();
    for (const row of batch18Queue) {
      const key = `${row.state}::${row.family}`;
      if (!grouped.has(key)) grouped.set(key, row);
    }

    const packets = [];
    const stateSummaries = new Map();
    for (const row of grouped.values()) {
      const packet = buildPacket(row.state, row.state_code, row.family, row.evidence, db);
      packets.push(packet);

      const stateRow = stateSummaries.get(row.state) || { state: row.state, packet_count: 0, families: [], root_domain_count: 0 };
      stateRow.packet_count += 1;
      stateRow.families.push(row.family);
      stateRow.root_domain_count += packet.root_domains_to_review.length;
      stateSummaries.set(row.state, stateRow);

      writeJson(
        path.join(generatedDir, `${row.state}_${row.family}_leaf_authoring_packet_v1.json`),
        packet,
      );
    }

    const summary = {
      batch: 'batch_19_county_district_leaf_authoring_v1',
      generated_at: new Date().toISOString(),
      states: Array.from(stateSummaries.values()),
      familyCounts: packets.reduce((acc, packet) => {
        acc[packet.family] = (acc[packet.family] || 0) + 1;
        return acc;
      }, {}),
      rootDomainCounts: Array.from(stateSummaries.values()).reduce((acc, row) => {
        acc[row.state] = row.root_domain_count;
        return acc;
      }, {}),
      texas_preserved_complete: true,
    };

    writeJson(path.join(generatedDir, 'batch19_county_district_leaf_authoring_summary_v1.json'), summary);
    writeJsonl(path.join(generatedDir, 'batch19_county_district_leaf_authoring_queue_v1.jsonl'), packets);
    fs.writeFileSync(path.join(docsGeneratedDir, 'batch19-county-district-leaf-authoring-report-v1.md'), `${buildBatchReport(summary)}\n`);

    return summary;
  } finally {
    db.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch19CountyDistrictLeafAuthoringV1();
  console.log(JSON.stringify({
    ok: true,
    states: summary.states.map((row) => row.state),
    familyCounts: summary.familyCounts,
    texasPreservedComplete: summary.texas_preserved_complete,
  }, null, 2));
}
