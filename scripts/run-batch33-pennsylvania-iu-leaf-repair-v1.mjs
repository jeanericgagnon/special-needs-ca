import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import { fetchWithRetry } from './source-acquisition-fetch-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const STATE = 'pennsylvania';
const STATE_CODE = 'PA';
const GENERIC_IU_DIRECTORY_URL = 'https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx';

const INPUTS = {
  summary: path.join(generatedDir, 'pennsylvania_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'pennsylvania_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'pennsylvania_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'pennsylvania_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'pennsylvania_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'pennsylvania-california-grade-audit-report-v2.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch33_pennsylvania_repair_summary_v1.json'),
  verifiedLeaves: path.join(generatedDir, 'batch33_pennsylvania_verified_iu_leaves_v1.jsonl'),
  verifiedCountyMappings: path.join(generatedDir, 'batch33_pennsylvania_verified_county_mappings_v1.jsonl'),
  blockers: path.join(generatedDir, 'batch33_pennsylvania_blockers_v1.jsonl'),
  report: path.join(docsGeneratedDir, 'batch33-pennsylvania-repair-report-v1.md'),
};

const OFFICIAL_IU_ROOTS = new Map([
  ['Intermediate Unit 1', 'https://www.iu1.org/'],
  ['Midwestern Intermediate Unit 4', 'https://www.miu4.org/'],
  ['Northwest Tri-County Intermediate Unit 5', 'https://www.iu5.org/'],
  ['Riverview Intermediate Unit 6', 'https://www.riu6.org/'],
  ['Westmoreland Intermediate Unit 7', 'https://www.wiu7.org/'],
  ['Appalachia Intermediate Unit 8', 'https://www.iu08.org/'],
  ['Seneca Highlands Intermediate Unit 9', 'https://www.iu9.org/'],
  ['Central Intermediate Unit 10', 'https://www.ciu10.org/'],
  ['Tuscarora Intermediate Unit 11', 'https://www.tiu11.org/'],
  ['Lincoln Intermediate Unit 12', 'https://www.iu12.org/'],
  ['Lancaster-Lebanon Intermediate Unit 13', 'https://www.iu13.org/'],
  ['Capital Area Intermediate Unit 15', 'https://www.caiu.org/'],
  ['Central Susquehanna Intermediate Unit 16', 'https://www.csiu.org/'],
  ['BLaST Intermediate Unit 17', 'https://www.iu17.org/'],
  ['Luzerne Intermediate Unit 18', 'https://www.liu18.org/'],
  ['Colonial Intermediate Unit 20', 'https://www.ciu20.org/'],
  ['Carbon-Lehigh Intermediate Unit 21', 'https://www.cliu.org/'],
  ['Beaver Valley Intermediate Unit 27', 'https://www.bviu.org/'],
  ['ARIN Intermediate Unit 28', 'https://www.iu28.org/'],
  ['Schuylkill Intermediate Unit 29', 'https://www.iu29.org/'],
]);

const SERVICE_DISCOVERY_TERMS = [
  'special education',
  'student services',
  'special services',
  'parent & student services',
  'parent and student services',
  'referral',
  'school age student services',
  'support services',
];

const MENU_DISCOVERY_TERMS = [
  'student',
  'services',
  'special',
  'department',
  'program',
  'menu of services',
  'parent',
];

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

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function lower(value) {
  return normalizeText(value).toLowerCase();
}

function uniqueBy(rows, keyFn) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = keyFn(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function scoreCandidate(url, text = '') {
  const blob = `${text} ${url}`.toLowerCase();
  let score = 0;
  if (blob.includes('special education')) score += 10;
  if (blob.includes('student services')) score += 9;
  if (blob.includes('special services')) score += 8;
  if (blob.includes('parent & student services') || blob.includes('parent and student services')) score += 8;
  if (blob.includes('referral')) score += 7;
  if (blob.includes('school age student services')) score += 7;
  if (blob.includes('support services')) score += 5;
  if (blob.includes('special-education') || blob.includes('student-services')) score += 2;
  if (/news|blog|post|calendar|event/.test(blob)) score -= 6;
  return score;
}

function extractLinks(html, baseUrl, predicate) {
  const $ = cheerio.load(String(html || ''));
  const rows = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    const text = normalizeText($(el).text());
    if (!href) return;
    try {
      const abs = new URL(href, baseUrl).toString();
      const sameDomain = new URL(abs).hostname === new URL(baseUrl).hostname;
      if (!sameDomain) return;
      if (predicate(abs, text)) {
        rows.push({ url: abs, text, score: scoreCandidate(abs, text) });
      }
    } catch {
      // ignore malformed links
    }
  });
  return uniqueBy(rows, (row) => row.url).sort((a, b) => b.score - a.score || a.url.localeCompare(b.url));
}

async function fetchPage(url) {
  const result = await fetchWithRetry(url, {
    retryCount: 1,
    requestTimeoutMs: 15000,
    bodyTimeoutMs: 15000,
    rateLimitMs: 150,
  });
  return {
    status: result.status,
    finalUrl: result.finalUrl || url,
    body: String(result.body || ''),
    fetchedAt: new Date().toISOString(),
  };
}

function verifyEducationLeaf({ iuName, sourceUrl, finalUrl, fetchedAt, html }) {
  const $ = cheerio.load(String(html || ''));
  const title = normalizeText($('title').first().text());
  const headings = $('h1,h2,h3').toArray().map((el) => normalizeText($(el).text())).filter(Boolean).slice(0, 8);
  const snippet = normalizeText($('body').text()).slice(0, 1400);
  const blob = `${title} ${headings.join(' ')} ${snippet} ${finalUrl}`.toLowerCase();
  const evidenceTermsFound = SERVICE_DISCOVERY_TERMS.filter((term) => blob.includes(term));
  const blockedSurface = `${title} ${headings.join(' ')} ${finalUrl}`.toLowerCase();
  const blockedTerms = ['page not found', 'forbidden', 'access denied', 'huge domains'];
  const blockedCodePattern = /\b(?:403|404)\b\s*[-: ]\s*(?:forbidden|page not found|access denied)|(?:forbidden|page not found|access denied)\s*[-: ]\s*\b(?:403|404)\b/;
  if (blockedTerms.some((term) => blockedSurface.includes(term)) || blockedCodePattern.test(blockedSurface)) return null;
  if (!evidenceTermsFound.length) return null;
  if (/news|blog|calendar|event/.test(blob) && !/special education|student services|school age student services/.test(blob)) return null;
  return {
    state: STATE,
    state_code: STATE_CODE,
    family: 'district_or_county_education_routing',
    iu_name: iuName,
    source_url: sourceUrl,
    final_url: finalUrl,
    fetched_at: fetchedAt,
    evidence_title: title,
    evidence_headings: headings,
    evidence_snippet: snippet,
    evidence_terms_found: evidenceTermsFound,
    verification_status: 'verified',
    source_type: 'exact_iu_leaf_target',
    source_table: 'batch33_pennsylvania_verified_iu_leaves',
  };
}

function getPennsylvaniaFallbackGroups() {
  const db = new Database(dbPath, { readonly: true });
  try {
    const rows = db.prepare(`
      select
        c.name as county_name,
        lower(replace(replace(c.name, ' County', ''), ' ', '-')) || '-pa' as county_slug,
        sd.name as district_name
      from school_districts sd
      join counties c on c.id = sd.county_id
      where c.state_id = ?
        and coalesce(sd.source_url, sd.website) = ?
      order by c.name
    `).all(STATE, GENERIC_IU_DIRECTORY_URL);

    const groups = new Map();
    for (const row of rows) {
      const iuName = row.district_name.replace(/\s+\([^)]+\)\s*$/, '');
      if (!groups.has(iuName)) groups.set(iuName, []);
      groups.get(iuName).push({
        county_name: row.county_name,
        county_slug: row.county_slug,
      });
    }
    return groups;
  } finally {
    db.close();
  }
}

async function discoverLeafCandidates(iuName, rootUrl) {
  const root = await fetchPage(rootUrl);
  const rootCandidates = extractLinks(root.body, root.finalUrl, (url, text) => {
    const blob = `${text} ${url}`.toLowerCase();
    return SERVICE_DISCOVERY_TERMS.some((term) => blob.includes(term));
  }).slice(0, 6);

  if (rootCandidates.length) {
    return { root, candidates: rootCandidates, exploredMenuUrls: [] };
  }

  const menuLinks = extractLinks(root.body, root.finalUrl, (url, text) => {
    const blob = `${text} ${url}`.toLowerCase();
    return MENU_DISCOVERY_TERMS.some((term) => blob.includes(term));
  }).slice(0, 3);

  const exploredMenuUrls = [];
  const menuCandidates = [];
  for (const menu of menuLinks) {
    exploredMenuUrls.push(menu.url);
    try {
      const page = await fetchPage(menu.url);
      const found = extractLinks(page.body, page.finalUrl, (url, text) => {
        const blob = `${text} ${url}`.toLowerCase();
        return SERVICE_DISCOVERY_TERMS.some((term) => blob.includes(term));
      });
      menuCandidates.push(...found);
    } catch {
      // keep deterministic; failures are handled later if no candidate verifies
    }
  }

  return {
    root,
    candidates: uniqueBy(menuCandidates, (row) => row.url).sort((a, b) => b.score - a.score || a.url.localeCompare(b.url)).slice(0, 6),
    exploredMenuUrls,
  };
}

async function repairPennsylvaniaIntermediateUnits() {
  const fallbackGroups = getPennsylvaniaFallbackGroups();
  const verifiedLeaves = [];
  const blockers = [];
  const countyMappings = [];

  for (const [iuName, counties] of [...fallbackGroups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const rootUrl = OFFICIAL_IU_ROOTS.get(iuName) || null;
    if (!rootUrl) {
      blockers.push({
        state: STATE,
        state_code: STATE_CODE,
        family: 'district_or_county_education_routing',
        iu_name: iuName,
        counties,
        blocker_code: 'official_iu_root_unresolved_after_bounded_probe',
        evidence: `No official IU root was verified for ${iuName}; counties remain unresolved: ${counties.map((row) => row.county_name).join(', ')}`,
      });
      continue;
    }

    let discovery;
    try {
      discovery = await discoverLeafCandidates(iuName, rootUrl);
    } catch (error) {
      blockers.push({
        state: STATE,
        state_code: STATE_CODE,
        family: 'district_or_county_education_routing',
        iu_name: iuName,
        counties,
        blocker_code: 'iu_root_fetch_failed',
        evidence: `${rootUrl} failed during bounded repair: ${error instanceof Error ? error.message : String(error)}`,
      });
      continue;
    }

    let verifiedLeaf = null;
    for (const candidate of discovery.candidates) {
      try {
        const page = await fetchPage(candidate.url);
        verifiedLeaf = verifyEducationLeaf({
          iuName,
          sourceUrl: candidate.url,
          finalUrl: page.finalUrl,
          fetchedAt: page.fetchedAt,
          html: page.body,
        });
        if (verifiedLeaf) break;
      } catch {
        // continue to next candidate
      }
    }

    if (!verifiedLeaf) {
      blockers.push({
        state: STATE,
        state_code: STATE_CODE,
        family: 'district_or_county_education_routing',
        iu_name: iuName,
        counties,
        blocker_code: 'iu_exact_leaf_unresolved_after_bounded_official_repair',
        evidence: `Root ${rootUrl} did not yield a verified exact education-routing leaf. Candidate URLs reviewed: ${discovery.candidates.map((row) => row.url).join(', ') || 'none'}. Menu URLs reviewed: ${discovery.exploredMenuUrls.join(', ') || 'none'}.`,
      });
      continue;
    }

    verifiedLeaves.push(verifiedLeaf);
    for (const county of counties) {
      countyMappings.push({
        state: STATE,
        state_code: STATE_CODE,
        family: 'district_or_county_education_routing',
        mapping_type: 'intermediate_unit_special_education_leaf',
        county_name: county.county_name,
        county_slug: county.county_slug,
        iu_name: iuName,
        source_url: verifiedLeaf.source_url,
        final_url: verifiedLeaf.final_url,
        fetched_at: verifiedLeaf.fetched_at,
        evidence_title: verifiedLeaf.evidence_title,
        evidence_snippet: verifiedLeaf.evidence_snippet,
        evidence_terms_found: verifiedLeaf.evidence_terms_found,
        verification_status: 'verified',
      });
    }
  }

  return { verifiedLeaves, countyMappings, blockers };
}

function updateGapRows(gapRows, countyMappings, blockers) {
  const unresolvedCounties = blockers.flatMap((row) => row.counties || []).map((row) => row.county_name);
  return gapRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    if (!unresolvedCounties.length) {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: `Official IU and district exact education leaves now provide county-grade routing coverage across all 67 Pennsylvania counties.`,
      };
    }
    return {
      ...row,
      family_status: 'exact_leaf_targets_verified_partial',
      status_reason: `Official IU and district exact education leaves now cover ${countyMappings.length + 8}/67 Pennsylvania counties. Remaining unresolved counties: ${unresolvedCounties.join(', ')}.`,
    };
  });
}

function updateFailureRows(failureRows, countyMappings, blockers) {
  const unresolvedCounties = blockers.flatMap((row) => row.counties || []).map((row) => row.county_name);
  return failureRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    if (!unresolvedCounties.length) return null;
    return {
      ...row,
      failure_code: 'remaining_counties_lack_exact_iu_or_district_education_leaf_after_bounded_official_repair',
      evidence: `Verified official IU/district exact leaves now cover ${countyMappings.length + 8}/67 Pennsylvania counties. Remaining unresolved counties: ${unresolvedCounties.join(', ')}. Exact blockers: ${blockers.map((blocker) => `${blocker.iu_name}:${blocker.blocker_code}`).join('; ')}.`,
      next_action: 'resolve_remaining_intermediate_unit_or_county_specific_education_leaves_for_uncovered_counties',
    };
  }).filter(Boolean);
}

function updateVerifiedRows(verifiedRows, verifiedLeaves, blockers, countyMappings) {
  const unresolvedCounties = blockers.flatMap((row) => row.counties || []).map((row) => row.county_name);
  return verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      family_status: unresolvedCounties.length ? 'exact_leaf_targets_verified_partial' : 'verified_state_grade',
      evidence_strength: unresolvedCounties.length ? 'medium' : 'strong',
      sample_count: verifiedLeaves.length,
      query_basis: `${row.query_basis}; Batch 33 Pennsylvania IU exact-leaf repair`,
      blocker_code: unresolvedCounties.length ? 'remaining_counties_lack_exact_iu_or_district_education_leaf_after_bounded_official_repair' : null,
      blocker_evidence: unresolvedCounties.length ? `County-grade IU/district exact leaves now cover ${countyMappings.length + 8}/67 Pennsylvania counties; unresolved counties: ${unresolvedCounties.join(', ')}.` : null,
      samples: verifiedLeaves.slice(0, 6).map((leaf) => ({
        sample_name: `${leaf.iu_name} :: ${leaf.evidence_title || leaf.final_url}`,
        source_url: leaf.final_url,
        verification_status: 'verified',
        source_type: 'exact_iu_leaf_target',
        source_table: 'batch33_pennsylvania_verified_iu_leaves',
      })),
    };
  });
}

function updateNextRows(nextRows, blockers, countyMappings) {
  const unresolvedCounties = blockers.flatMap((row) => row.counties || []).map((row) => row.county_name);
  return nextRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      failure_code: unresolvedCounties.length ? 'remaining_counties_lack_exact_iu_or_district_education_leaf_after_bounded_official_repair' : 'none',
      next_action: unresolvedCounties.length
        ? 'resolve_remaining_intermediate_unit_or_county_specific_education_leaves_for_uncovered_counties'
        : 'maintain_verified_county_grade_education_routing',
      evidence: unresolvedCounties.length
        ? `Verified official IU/district exact leaves now cover ${countyMappings.length + 8}/67 Pennsylvania counties. Remaining unresolved counties: ${unresolvedCounties.join(', ')}.`
        : 'Pennsylvania county-grade district/IU education routing is fully covered by exact official leaves.',
    };
  });
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows, countyMappings, blockers) {
  return [
    '# Pennsylvania California-Grade Audit Report v2',
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
    '## Batch 33 Pennsylvania IU exact-leaf repair',
    '',
    `- verified IU/county mappings added: ${countyMappings.length}`,
    `- unresolved county blockers remaining: ${blockers.flatMap((row) => row.counties || []).map((row) => row.county_name).join(', ') || 'none'}`,
  ].join('\n') + '\n';
}

function buildBatchReport(summary, countyMappings, blockers) {
  const unresolvedCounties = blockers.flatMap((row) => row.counties || []).map((row) => row.county_name);
  return [
    '# Batch 33 Pennsylvania Repair Report v1',
    '',
    'This pass repairs Pennsylvania Intermediate Unit education fallbacks with official exact special-education or student-services leaves, then leaves only the residual county blocker visible.',
    '',
    `- exact iu leaves verified: ${summary.verified_iu_leaf_count}`,
    `- county mappings repaired: ${countyMappings.length}`,
    `- unresolved counties: ${unresolvedCounties.join(', ') || 'none'}`,
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
  ].join('\n');
}

export async function generateBatch33PennsylvaniaIuLeafRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const { verifiedLeaves, countyMappings, blockers } = await repairPennsylvaniaIntermediateUnits();

  const updatedGapRows = updateGapRows(gapRows, countyMappings, blockers);
  const updatedFailureRows = updateFailureRows(failureRows, countyMappings, blockers);
  const updatedVerifiedRows = updateVerifiedRows(verifiedRows, verifiedLeaves, blockers, countyMappings);
  const updatedNextRows = updateNextRows(nextRows, blockers, countyMappings);

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, countyMappings, blockers));

  writeJsonl(OUTPUTS.verifiedLeaves, verifiedLeaves);
  writeJsonl(OUTPUTS.verifiedCountyMappings, countyMappings);
  writeJsonl(OUTPUTS.blockers, blockers);

  const batchSummary = {
    batch: 'batch_33_pennsylvania_iu_leaf_repair_v1',
    generated_at: new Date().toISOString(),
    state: STATE,
    state_code: STATE_CODE,
    classification: summary.classification,
    index_safe: summary.index_safe,
    verified_iu_leaf_count: verifiedLeaves.length,
    county_mappings_repaired: countyMappings.length,
    unresolved_county_count: blockers.flatMap((row) => row.counties || []).length,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, `${buildBatchReport(batchSummary, countyMappings, blockers)}\n`);
  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch33PennsylvaniaIuLeafRepairV1()
    .then((summary) => console.log(JSON.stringify(summary, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}

export { verifyEducationLeaf };
