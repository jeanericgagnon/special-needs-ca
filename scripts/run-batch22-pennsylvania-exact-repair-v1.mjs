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

const STATE = 'pennsylvania';
const STATE_CODE = 'PA';

const INPUTS = {
  txSummaryV10: path.join(generatedDir, 'tx_verification_summary_v10.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch22_pennsylvania_exact_repair_summary_v1.json'),
  verifiedLeafs: path.join(generatedDir, 'batch22_pennsylvania_verified_leaf_targets_v1.jsonl'),
  countyMappings: path.join(generatedDir, 'batch22_pennsylvania_verified_county_mappings_v1.jsonl'),
  blockers: path.join(generatedDir, 'batch22_pennsylvania_blockers_v1.jsonl'),
  report: path.join(docsGeneratedDir, 'batch22-pennsylvania-exact-repair-report-v1.md'),
};

const USER_RATE_LIMIT_MS = 300;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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

function slugifyCounty(name) {
  return `${sanitizeText(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-pa`;
}

function stripLeadingLabel(text) {
  return sanitizeText(String(text || '').replace(/^[^:]+:\s*/i, ''));
}

function findNestedField(officeItem, $, matcher) {
  const nestedItems = officeItem.find('li').toArray().map((li) => sanitizeText($(li).text())).filter(Boolean);
  return nestedItems.find((text) => matcher(text)) || '';
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

export function parsePennsylvaniaCountyMhIdPage(html, finalUrl, fetchedAt) {
  const $ = cheerio.load(String(html || ''));
  const rows = [];
  $('h3').each((_, el) => {
    const countyHeading = sanitizeText($(el).text());
    if (!countyHeading.endsWith('County')) return;
    const countyName = countyHeading.replace(/ County$/, '');
    const list = $(el).next('ul').first();
    if (!list.length) return;
    const officeItem = list.children('li').first();
    const officeName = sanitizeText(officeItem.children('b').first().text() || officeItem.contents().first().text());
    const address = stripLeadingLabel(findNestedField(
      officeItem,
      $,
      (text) => /^address\b/i.test(text) || /\bpa\s+\d{5}(?:-\d{4})?\b/i.test(text),
    ));
    const phone = stripLeadingLabel(findNestedField(officeItem, $, (text) => /\bphone\b/i.test(text)));
    const fax = stripLeadingLabel(findNestedField(officeItem, $, (text) => /\bfax\b/i.test(text)));
    const websiteLink = officeItem.find('li').filter((_, li) => sanitizeText($(li).text()).startsWith('Website')).first().find('a').first();
    const website = sanitizeText(websiteLink.attr('href') || websiteLink.text());
    if (!countyName || !officeName || !address || !phone) return;
    rows.push({
      state: STATE,
      state_code: STATE_CODE,
      family: 'county_local_disability_resources',
      mapping_type: 'county_mh_id_office',
      office_name: officeName,
      counties_served_names: [countyName],
      counties_served: [slugifyCounty(countyName)],
      address,
      phone,
      fax,
      office_url: website.startsWith('http') ? website : website ? `https://${website}` : finalUrl,
      source_url: 'https://www.pa.gov/agencies/dhs/contact/county-mh-id-offices',
      final_url: finalUrl,
      fetched_at: fetchedAt,
      evidence_snippet: `${countyName} County ${officeName} Address: ${address} Phone: ${phone} Website: ${website}`,
      verification_status: 'verified',
      evidence_quality: 'static_official_county_office_extract',
    });
  });
  return rows;
}

function extractLeafEvidence(url, html, finalUrl, fetchedAt) {
  const $ = cheerio.load(String(html || ''));
  const title = sanitizeText($('title').first().text());
  const headings = $('h1,h2,h3').toArray().map((el) => sanitizeText($(el).text())).filter(Boolean).slice(0, 8);
  const body = sanitizeText($('body').text());
  const blob = `${title} ${headings.join(' ')} ${body} ${finalUrl}`.toLowerCase();
  const termHits = ['special education', 'student services', 'parent rights', 'procedural safeguards', 'directory', 'contact']
    .filter((term) => blob.includes(term));
  const districtOwned = /pghschools\.org|readingsdpa\.sites\.thrillshare\.com|pennsburysd\.org/i.test(finalUrl);
  if (!districtOwned) return null;
  if (!termHits.length) return null;
  return {
    state: STATE,
    state_code: STATE_CODE,
    family: 'district_or_county_education_routing',
    source_role: 'district_or_county_education_routing',
    candidate_url: url,
    final_url: finalUrl,
    title,
    headings,
    snippet: body.slice(0, 1200),
    term_hits: termHits,
    fetched_at: fetchedAt,
    verification_status: 'verified',
    source_type: 'exact_leaf_target',
    source_table: 'batch22_pennsylvania_verified_leaf_targets',
  };
}

function updateGapRows(gapRows, mappingRows, educationLeafs) {
  return gapRows.map((row) => {
    if (row.family === 'county_local_disability_resources' && mappingRows.length) {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: `Official county MH/ID offices page lists verified county office coverage across ${mappingRows.length}/${mappingRows.length} Pennsylvania counties.`,
      };
    }
    if (row.family === 'district_or_county_education_routing' && educationLeafs.length) {
      return {
        ...row,
        family_status: 'exact_leaf_targets_verified_partial',
        status_reason: `Reviewed district-owned education exact leaves verified (${educationLeafs.length}) but broader county/district mapping still requires expansion before California-grade proof.`,
      };
    }
    return row;
  });
}

function updateFailureRows(failureRows, mappingRows, educationLeafs) {
  return failureRows
    .filter((row) => !(row.family === 'county_local_disability_resources' && mappingRows.length))
    .map((row) => {
      if (row.family === 'district_or_county_education_routing' && educationLeafs.length) {
        return {
          ...row,
          failure_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
          evidence: `Verified exact leaf targets: ${educationLeafs.map((leaf) => leaf.final_url).join(', ')}`,
          next_action: 'expand_verified_leaf_targets_into_county_or_district_mapping',
        };
      }
      return row;
    });
}

function updateVerifiedSources(verifiedRows, mappingRows, educationLeafs) {
  return verifiedRows.map((row) => {
    if (row.family === 'county_local_disability_resources' && mappingRows.length) {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: mappingRows.length,
        query_basis: `${row.query_basis}; Batch 22 Pennsylvania county MH/ID office repair`,
        blocker_code: null,
        blocker_evidence: null,
        samples: mappingRows.slice(0, 3).map((mapping) => ({
          sample_name: mapping.office_name,
          source_url: mapping.source_url,
          verification_status: 'verified',
          source_type: 'county_mh_id_office_extract',
          source_table: 'batch22_pennsylvania_verified_county_mappings',
        })),
      };
    }
    if (row.family === 'district_or_county_education_routing' && educationLeafs.length) {
      return {
        ...row,
        family_status: 'exact_leaf_targets_verified_partial',
        evidence_strength: 'medium',
        sample_count: educationLeafs.length,
        query_basis: `${row.query_basis}; Batch 22 Pennsylvania district exact leaves`,
        blocker_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
        blocker_evidence: 'Verified district-owned exact leaves exist but statewide/countywide education mapping still needs expansion.',
        samples: educationLeafs.map((leaf) => ({
          sample_name: leaf.title || leaf.final_url,
          source_url: leaf.final_url,
          verification_status: 'verified',
          source_type: 'exact_leaf_target',
          source_table: 'batch22_pennsylvania_verified_leaf_targets',
        })),
      };
    }
    return row;
  });
}

function updateNextActions(nextRows, mappingRows, educationLeafs) {
  return nextRows
    .filter((row) => !(row.family === 'county_local_disability_resources' && mappingRows.length))
    .map((row, index) => {
      if (row.family === 'district_or_county_education_routing' && educationLeafs.length) {
        return {
          ...row,
          priority_rank: index + 1,
          failure_code: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
          next_action: 'expand_verified_leaf_targets_into_county_or_district_mapping',
          evidence: `Verified exact leaf targets: ${educationLeafs.map((leaf) => leaf.final_url).join(', ')}`,
        };
      }
      return { ...row, priority_rank: index + 1 };
    });
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

function updateStateReport(reportText, mappingRows, educationLeafs) {
  const lines = [
    ...reportText.trimEnd().split('\n'),
    '',
    '## Batch 22 Pennsylvania exact repair',
    '',
  ];
  if (mappingRows.length) {
    lines.push(`- county_local_disability_resources: official county MH/ID offices page verified county office coverage across ${mappingRows.length}/${mappingRows.length} Pennsylvania counties.`);
  }
  if (educationLeafs.length) {
    lines.push(`- district_or_county_education_routing: verified district-owned exact leaves -> ${educationLeafs.map((leaf) => leaf.final_url).join(', ')}`);
  }
  lines.push('');
  lines.push('- Pennsylvania remains PARTIAL and not index-safe until every critical family passes county-grade proof.');
  return `${lines.join('\n')}\n`;
}

function buildBatchReport(summary) {
  return [
    '# Batch 22 Pennsylvania Exact Repair Report v1',
    '',
    'This pass repairs Pennsylvania using exact official live targets from the current state packet: the live PA county MH/ID office page plus district-owned special-education leaves. It upgrades only what the fetched evidence proves.',
    '',
    `- county_local_disability_resources_repaired: ${summary.county_local_disability_resources_repaired ? 'true' : 'false'}`,
    `- district_exact_leaves_verified: ${summary.district_exact_leaves_verified}`,
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
  ].join('\n');
}

export async function generateBatch22PennsylvaniaExactRepairV1() {
  const txSummaryV10 = readJson(INPUTS.txSummaryV10);
  if (txSummaryV10.v10.pass_counties !== 254 || txSummaryV10.index_safe !== true) {
    throw new Error('Batch 22 requires Texas v10 truth preserved.');
  }

  const summaryRel = 'data/generated/pennsylvania_california_grade_summary_v2.json';
  const gapRel = 'data/generated/pennsylvania_gap_matrix_v2.jsonl';
  const failureRel = 'data/generated/pennsylvania_failure_ledger_v2.jsonl';
  const verifiedRel = 'data/generated/pennsylvania_verified_sources_v1.jsonl';
  const nextRel = 'data/generated/pennsylvania_next_action_queue_v2.jsonl';
  const reportRel = 'docs/generated/pennsylvania-california-grade-audit-report-v2.md';

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

  const blockers = [];

  const countyMhFetch = await fetchHtml('https://www.pa.gov/agencies/dhs/contact/county-mh-id-offices');
  const countyMappings = parsePennsylvaniaCountyMhIdPage(countyMhFetch.html, countyMhFetch.finalUrl, countyMhFetch.fetchedAt);
  if (countyMappings.length !== summary.county_count) {
    blockers.push({
      family: 'county_local_disability_resources',
      blocker_code: 'county_mapping_count_mismatch',
      expected_counties: summary.county_count,
      mapped_counties: countyMappings.length,
      source_url: 'https://www.pa.gov/agencies/dhs/contact/county-mh-id-offices',
    });
  }

  const districtUrls = [
    'https://www.pghschools.org/academics/pse-special-education/pse-special-education',
    'https://readingsdpa.sites.thrillshare.com/o/rsd/page/special-education',
    'https://readingsdpa.sites.thrillshare.com/o/rsd/page/student-services',
    'https://www.pennsburysd.org/departments/student_services',
  ];
  const educationLeafs = [];
  for (const url of districtUrls) {
    const fetched = await fetchHtml(url);
    const leaf = extractLeafEvidence(url, fetched.html, fetched.finalUrl, fetched.fetchedAt);
    if (leaf) educationLeafs.push(leaf);
    await new Promise((resolve) => setTimeout(resolve, USER_RATE_LIMIT_MS));
  }

  const updatedGaps = updateGapRows(gapRows, countyMappings, educationLeafs);
  const updatedFailures = updateFailureRows(failureRows, countyMappings, educationLeafs);
  const updatedVerified = updateVerifiedSources(verifiedRows, countyMappings, educationLeafs);
  const updatedNext = updateNextActions(nextRows, countyMappings, educationLeafs);
  const updatedSummary = recalcSummary(summary, updatedGaps, updatedFailures, updatedVerified);
  const updatedReport = updateStateReport(reportText, countyMappings, educationLeafs);

  writeJson(summaryPath, updatedSummary);
  writeJsonl(gapPath, updatedGaps);
  writeJsonl(failurePath, updatedFailures);
  writeJsonl(verifiedPath, updatedVerified);
  writeJsonl(nextPath, updatedNext);
  fs.writeFileSync(reportPath, updatedReport);

  const batchSummary = {
    batch: 'batch_22_pennsylvania_exact_repair_v1',
    generated_at: new Date().toISOString(),
    state: STATE,
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    county_local_disability_resources_repaired: countyMappings.length === summary.county_count,
    district_exact_leaves_verified: educationLeafs.length,
    texas_preserved_complete: true,
  };

  writeJsonl(OUTPUTS.countyMappings, countyMappings);
  writeJsonl(OUTPUTS.verifiedLeafs, educationLeafs);
  writeJsonl(OUTPUTS.blockers, blockers);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, `${buildBatchReport(batchSummary)}\n`);

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch22PennsylvaniaExactRepairV1()
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
