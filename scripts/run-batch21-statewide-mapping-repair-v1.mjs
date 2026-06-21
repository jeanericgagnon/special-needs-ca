import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { fetchWithRetry } from './source-acquisition-fetch-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  batch20Verified: path.join(generatedDir, 'batch20_verified_leaf_targets_v1.jsonl'),
  txSummaryV10: path.join(generatedDir, 'tx_verification_summary_v10.json'),
};

const OUTPUTS = {
  verifiedMappings: path.join(generatedDir, 'batch21_verified_county_mappings_v1.jsonl'),
  blockers: path.join(generatedDir, 'batch21_mapping_blockers_v1.jsonl'),
  summary: path.join(generatedDir, 'batch21_statewide_mapping_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch21-statewide-mapping-repair-report-v1.md'),
};

const USER_RATE_LIMIT_MS = 400;

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

function readCommittedFile(relativePath) {
  return execFileSync('git', ['show', `HEAD:${relativePath}`], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

function readCommittedJson(relativePath) {
  return JSON.parse(readCommittedFile(relativePath));
}

function readCommittedJsonl(relativePath) {
  return readCommittedFile(relativePath)
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

function sanitizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function canonicalCountyName(countyName, stateCode) {
  const normalized = sanitizeText(countyName);
  if (stateCode === 'FL' && normalized === 'Dade') return 'Miami-Dade';
  return normalized;
}

function slugifyCountyName(countyName, stateCode) {
  const canonical = canonicalCountyName(countyName, stateCode);
  return `${canonical.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${stateCode.toLowerCase()}`;
}

function appendUnique(list, value) {
  if (!value) return;
  if (!list.includes(value)) list.push(value);
}

export function parseFloridaApdRegionPage(html, finalUrl, fetchedAt) {
  const body = String(html || '');
  const matches = [...body.matchAll(/<li><strong><a href="([^"]+)">([^<]+)<\/a><\/strong><br>\s*Counties Served:\s*([^<]+)/gi)];
  const rows = [];
  for (const match of matches) {
    const regionUrl = new URL(match[1], finalUrl).toString();
    const regionName = sanitizeText(match[2]);
    const countyNames = match[3]
      .split(/,| and /)
      .map((value) => canonicalCountyName(value, 'FL'))
      .filter(Boolean);
    if (!regionName || !countyNames.length) continue;
    rows.push({
      state: 'florida',
      state_code: 'FL',
      family: 'developmental_disability_idd_authority',
      mapping_type: 'regional_counties_served',
      office_name: regionName,
      office_url: regionUrl,
      counties_served_names: countyNames,
      counties_served: countyNames.map((name) => slugifyCountyName(name, 'FL')),
      source_url: 'https://apd.myflorida.com/region/',
      final_url: finalUrl,
      fetched_at: fetchedAt,
      evidence_snippet: `${regionName} Counties Served: ${countyNames.join(', ')}`,
      verification_status: 'verified',
      evidence_quality: 'static_official_counties_served_extract',
    });
  }
  return rows;
}

export function parseGeorgiaDfcsLocationsPage(html, finalUrl, fetchedAt) {
  const $ = cheerio.load(String(html || ''));
  const rows = [];
  $('table tbody tr').each((_, tr) => {
    const tds = $(tr).find('td');
    const link = $(tds[0]).find('a').first();
    if (!link.length) return;
    const officeName = sanitizeText(link.text());
    const officeUrl = new URL(link.attr('href'), finalUrl).toString();
    const areasServedText = sanitizeText(tds.eq(1).text());
    const countyNames = areasServedText
      .split(',')
      .map((value) => canonicalCountyName(value, 'GA'))
      .filter(Boolean);
    if (!officeName || !countyNames.length) return;
    rows.push({
      state: 'georgia',
      state_code: 'GA',
      family: 'county_local_disability_resources',
      mapping_type: 'county_office_directory',
      office_name: officeName,
      office_url: officeUrl,
      counties_served_names: countyNames,
      counties_served: countyNames.map((name) => slugifyCountyName(name, 'GA')),
      source_url: 'https://dfcs.georgia.gov/locations',
      final_url: finalUrl,
      fetched_at: fetchedAt,
      evidence_snippet: `${officeName} Areas Served: ${countyNames.join(', ')}`,
      verification_status: 'verified',
      evidence_quality: 'static_official_county_directory_extract',
    });
  });
  return rows;
}

async function fetchHtml(url) {
  const result = await fetchWithRetry(url, {
    retryCount: 1,
    requestTimeoutMs: 15000,
    bodyTimeoutMs: 15000,
    rateLimitMs: USER_RATE_LIMIT_MS,
  });
  if (!result.ok) {
    throw new Error(`Fetch failed for ${url}: ${result.status}`);
  }
  return {
    html: String(result.body || ''),
    finalUrl: result.finalUrl || url,
    fetchedAt: new Date().toISOString(),
  };
}

function coverageCount(rows) {
  return new Set(rows.flatMap((row) => row.counties_served || [])).size;
}

function takeMappingSamples(rows) {
  return rows.slice(0, 3).map((row) => ({
    sample_name: row.office_name,
    source_url: row.office_url,
    verification_status: 'verified',
    source_type: 'county_mapped_exact_leaf',
    source_table: 'batch21_verified_county_mappings',
  }));
}

function updateGapRows(gapRows, repairInfoByFamily) {
  return gapRows.map((row) => {
    const repair = repairInfoByFamily.get(row.family);
    if (!repair || repair.status !== 'repaired_statewide_mapping') return row;
    return {
      ...row,
      family_status: 'verified_state_grade',
      status_reason: repair.statusReason,
    };
  });
}

function updateFailureRows(failureRows, repairInfoByFamily) {
  return failureRows.filter((row) => {
    const repair = repairInfoByFamily.get(row.family);
    return !(repair && repair.status === 'repaired_statewide_mapping');
  });
}

function updateVerifiedSources(verifiedRows, repairInfoByFamily) {
  return verifiedRows.map((row) => {
    const repair = repairInfoByFamily.get(row.family);
    if (!repair || repair.status !== 'repaired_statewide_mapping') return row;
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: repair.mappingRows.length,
      query_basis: `${row.query_basis}; Batch 21 statewide county mapping repair`,
      blocker_code: null,
      blocker_evidence: null,
      samples: takeMappingSamples(repair.mappingRows),
    };
  });
}

function updateNextActions(nextRows, repairInfoByFamily) {
  return nextRows
    .filter((row) => {
      const repair = repairInfoByFamily.get(row.family);
      return !(repair && repair.status === 'repaired_statewide_mapping');
    })
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));
}

function recalcSummary(summary, gapRows, failureRows, verifiedRows) {
  const criticalRows = gapRows.filter((row) => row.critical);
  const strong = criticalRows.filter((row) => String(row.family_status || '').startsWith('verified_')).length;
  const missing = criticalRows.filter((row) => row.family_status === 'missing').length;
  const weak = criticalRows.length - strong - missing;
  return {
    ...summary,
    completeness_pct: Math.floor((strong / criticalRows.length) * 100),
    strong_critical_families: strong,
    weak_critical_families: weak,
    missing_critical_families: missing,
    critical_gap_families: failureRows.filter((row) => row.severity === 'critical').map((row) => row.family),
    major_gap_families: failureRows.filter((row) => row.severity === 'major').map((row) => row.family),
    primary_gap_reason: failureRows[0]?.failure_code || summary.primary_gap_reason,
    verified_source_families_with_samples: verifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: summary.classification === 'COMPLETE' && summary.index_safe,
  };
}

function updateStateReport(reportText, stateName, repairInfoByFamily) {
  const lines = [
    ...reportText.trimEnd().split('\n'),
    '',
    '## Batch 21 statewide mapping repair',
    '',
  ];
  const repairs = [...repairInfoByFamily.values()];
  if (!repairs.length) {
    lines.push('- No statewide county-grade mapping was promoted in Batch 21.');
  } else {
    for (const repair of repairs) {
      if (repair.status === 'repaired_statewide_mapping') {
        lines.push(`- ${repair.family}: ${repair.statusReason}`);
      } else {
        lines.push(`- ${repair.family}: ${repair.blockerReason}`);
      }
    }
  }
  lines.push('');
  lines.push(`- ${stateName} remains gated unless every critical family reaches California-grade proof.`);
  return `${lines.join('\n')}\n`;
}

function buildBatchReport(summary) {
  return [
    '# Batch 21 Statewide Mapping Repair Report v1',
    '',
    'This pass converts Batch 20 exact leaves into statewide county-grade repairs only when the verified leaf itself carries explicit structured county coverage in static official HTML. Local-only or interactive-only leaves remain partial.',
    '',
    '## State results',
    '',
    ...summary.states.map((row) => `- ${row.state}: repaired_families=${row.repaired_families.join(', ') || 'none'}; unresolved_families=${row.unresolved_families.join(', ') || 'none'}; classification=${row.classification}; index_safe=${row.index_safe}`),
    '',
    '## Outcome',
    '',
    `- repaired_family_count: ${summary.repaired_family_count}`,
    `- unresolved_family_count: ${summary.unresolved_family_count}`,
    '- No state was promoted COMPLETE/index_safe in this pass.',
    '- Texas remains COMPLETE/index_safe and was not modified.',
  ].join('\n');
}

export async function generateBatch21StatewideMappingRepairV1() {
  const batch20Verified = readJsonl(INPUTS.batch20Verified);
  const txSummaryV10 = readJson(INPUTS.txSummaryV10);
  if (txSummaryV10.v10.pass_counties !== 254 || txSummaryV10.index_safe !== true) {
    throw new Error('Batch 21 requires Texas v10 truth preserved.');
  }

  const allMappingRows = [];
  const blockers = [];
  const stateResults = [];

  const repairPlan = [
    {
      state: 'florida',
      family: 'developmental_disability_idd_authority',
      url: 'https://apd.myflorida.com/region/',
      parse: parseFloridaApdRegionPage,
      coverageReason: (count, total) => `Official APD regional offices page lists counties served across ${count}/${total} Florida counties.`,
    },
    {
      state: 'georgia',
      family: 'county_local_disability_resources',
      url: 'https://dfcs.georgia.gov/locations',
      parse: parseGeorgiaDfcsLocationsPage,
      coverageReason: (count, total) => `Official DFCS county offices directory lists county office coverage across ${count}/${total} Georgia counties.`,
    },
  ];

  const mappingResultsByState = new Map();
  for (const item of repairPlan) {
    const summaryRel = `data/generated/${item.state}_california_grade_summary_v2.json`;
    const stateSummary = readCommittedJson(summaryRel);
    const { html, finalUrl, fetchedAt } = await fetchHtml(item.url);
    const mappingRows = item.parse(html, finalUrl, fetchedAt);
    const countyCoverage = coverageCount(mappingRows);
    const repaired = countyCoverage === stateSummary.county_count;
    const info = {
      state: item.state,
      family: item.family,
      status: repaired ? 'repaired_statewide_mapping' : 'mapping_still_partial',
      countyCoverage,
      countyCount: stateSummary.county_count,
      mappingRows,
      statusReason: item.coverageReason(countyCoverage, stateSummary.county_count),
      blockerReason: item.coverageReason(countyCoverage, stateSummary.county_count),
    };
    if (!mappingResultsByState.has(item.state)) mappingResultsByState.set(item.state, new Map());
    mappingResultsByState.get(item.state).set(item.family, info);
    if (repaired) {
      allMappingRows.push(...mappingRows);
    } else {
      blockers.push({
        state: item.state,
        family: item.family,
        blocker_code: 'county_mapping_incomplete_after_exact_leaf_fetch',
        county_coverage: countyCoverage,
        county_count: stateSummary.county_count,
        evidence: item.url,
        reason: info.blockerReason,
      });
    }
    await new Promise((resolve) => setTimeout(resolve, USER_RATE_LIMIT_MS));
  }

  const additionalUnresolved = [
    {
      state: 'california',
      family: 'district_or_county_education_routing',
      blocker_code: 'local_only_exact_leaf_needs_broader_county_mapping',
      reason: 'Current verified OUSD exact leaves prove local district routing, but they do not supply statewide county-grade education coverage.',
    },
    {
      state: 'pennsylvania',
      family: 'district_or_county_education_routing',
      blocker_code: 'no_verified_exact_leaf_from_batch20',
      reason: 'Pennsylvania still lacks a verified county/district exact leaf target from the Batch 19 root packets.',
    },
    {
      state: 'pennsylvania',
      family: 'county_local_disability_resources',
      blocker_code: 'no_verified_exact_leaf_from_batch20',
      reason: 'Pennsylvania still lacks a verified county/local exact leaf target from the Batch 19 root packets.',
    },
    {
      state: 'florida',
      family: 'district_or_county_education_routing',
      blocker_code: 'local_only_exact_leaf_needs_broader_county_mapping',
      reason: 'Current verified Baker County district leaves do not prove statewide Florida district-grade routing.',
    },
    {
      state: 'georgia',
      family: 'developmental_disability_idd_authority',
      blocker_code: 'interactive_county_lookup_not_proved_in_static_html',
      reason: 'The official DBHDD county lookup remains interactive-only in static fetches, so statewide county mapping is not yet re-proved.',
    },
    {
      state: 'ohio',
      family: 'district_or_county_education_routing',
      blocker_code: 'local_only_exact_leaf_needs_broader_county_mapping',
      reason: 'Current verified ESC leaves prove local district routing, but they do not re-prove statewide Ohio county-grade education coverage.',
    },
  ];
  blockers.push(...additionalUnresolved);

  const statesToWrite = ['florida', 'georgia'];
  for (const state of statesToWrite) {
    const summaryRel = `data/generated/${state}_california_grade_summary_v2.json`;
    const gapRel = `data/generated/${state}_gap_matrix_v2.jsonl`;
    const failureRel = `data/generated/${state}_failure_ledger_v2.jsonl`;
    const verifiedRel = `data/generated/${state}_verified_sources_v1.jsonl`;
    const nextRel = `data/generated/${state}_next_action_queue_v2.jsonl`;
    const reportRel = `docs/generated/${state}-california-grade-audit-report-v2.md`;

    const summaryPath = path.join(repoRoot, summaryRel);
    const gapPath = path.join(repoRoot, gapRel);
    const failurePath = path.join(repoRoot, failureRel);
    const verifiedPath = path.join(repoRoot, verifiedRel);
    const nextPath = path.join(repoRoot, nextRel);
    const reportPath = path.join(repoRoot, reportRel);

    const summary = readCommittedJson(summaryRel);
    const gapRows = readCommittedJsonl(gapRel);
    const failureRows = readCommittedJsonl(failureRel);
    const verifiedRows = readCommittedJsonl(verifiedRel);
    const nextRows = readCommittedJsonl(nextRel);
    const reportText = readCommittedFile(reportRel);

    const repairInfoByFamily = mappingResultsByState.get(state) || new Map();
    const updatedGaps = updateGapRows(gapRows, repairInfoByFamily);
    const updatedFailures = updateFailureRows(failureRows, repairInfoByFamily);
    const updatedVerified = updateVerifiedSources(verifiedRows, repairInfoByFamily);
    const updatedNext = updateNextActions(nextRows, repairInfoByFamily);
    const updatedSummary = recalcSummary(summary, updatedGaps, updatedFailures, updatedVerified);
    const updatedReport = updateStateReport(reportText, summary.state_name, repairInfoByFamily);

    writeJson(summaryPath, updatedSummary);
    writeJsonl(gapPath, updatedGaps);
    writeJsonl(failurePath, updatedFailures);
    writeJsonl(verifiedPath, updatedVerified);
    writeJsonl(nextPath, updatedNext);
    fs.writeFileSync(reportPath, updatedReport);
  }

  const trackedStates = ['california', 'pennsylvania', 'florida', 'georgia', 'ohio'];
  for (const state of trackedStates) {
    const summary = readJson(path.join(generatedDir, `${state}_california_grade_summary_v2.json`));
    const repairedFamilies = (mappingResultsByState.get(state) ? [...mappingResultsByState.get(state).values()] : [])
      .filter((row) => row.status === 'repaired_statewide_mapping')
      .map((row) => row.family);
    const unresolvedFamilies = blockers.filter((row) => row.state === state).map((row) => row.family);
    stateResults.push({
      state,
      classification: summary.classification,
      index_safe: summary.index_safe,
      repaired_families: repairedFamilies,
      unresolved_families: unresolvedFamilies,
    });
  }

  const summary = {
    batch: 'batch_21_statewide_mapping_repair_v1',
    generated_at: new Date().toISOString(),
    states: stateResults,
    repaired_family_count: allMappingRows.length ? 2 : 0,
    unresolved_family_count: blockers.length,
    texas_preserved_complete: true,
  };

  writeJsonl(OUTPUTS.verifiedMappings, allMappingRows);
  writeJsonl(OUTPUTS.blockers, blockers);
  writeJson(OUTPUTS.summary, summary);
  fs.writeFileSync(OUTPUTS.report, `${buildBatchReport(summary)}\n`);
  return summary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch21StatewideMappingRepairV1()
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
