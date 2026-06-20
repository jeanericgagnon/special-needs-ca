import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `nonprofit-scrape-queue-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `nonprofit-scrape-queue-${generatedDate}.md`);
const profileOutPath = path.join(repoRoot, 'scripts', 'nonprofit-domain-profiles.generated.json');

const db = new Database(dbPath, { readonly: true });

function getNormalizedUrl(rawUrl) {
  if (!rawUrl || !String(rawUrl).trim()) return null;
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    parsed.search = '';
    parsed.pathname = parsed.pathname.replace(/\/+$/, '') || '/';
    return parsed;
  } catch {
    return null;
  }
}

function normalizeName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(the|of|for|and|inc|llc|center|services|support|organization|office)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function classifyTarget({ host, pathName, distinctNames, stateCount, countyCount, rowCount }) {
  const cues = [];
  let targetType = 'single_site';
  let scrapeStrategy = 'domain';
  let riskLevel = 'medium';

  if (host.includes('thearc.org') && pathName.startsWith('/chapter/')) {
    targetType = 'affiliate_chapter';
    scrapeStrategy = 'site_path';
    riskLevel = 'medium';
    cues.push('chapter_path');
  } else if (host.includes('parentcenterhub.org')) {
    targetType = 'network_directory';
    scrapeStrategy = 'affiliate_discovery';
    riskLevel = 'high';
    cues.push('network_directory');
  } else if (host.includes('thearc.org')) {
    targetType = 'network_directory';
    scrapeStrategy = 'affiliate_discovery';
    riskLevel = 'high';
    cues.push('umbrella_domain');
  } else if (distinctNames > 8 || stateCount > 2) {
    targetType = 'aggregator_or_network';
    scrapeStrategy = 'affiliate_discovery';
    riskLevel = 'high';
    cues.push('multi_name_or_multi_state');
  } else if (rowCount > 50 && countyCount > 25 && stateCount === 1) {
    targetType = 'statewide_service_org';
    scrapeStrategy = 'domain';
    riskLevel = 'medium';
    cues.push('statewide_many_county_rows');
  } else if (pathName !== '/' && rowCount <= 25) {
    targetType = 'site_path';
    scrapeStrategy = 'site_path';
    riskLevel = 'low';
    cues.push('path_specific_source');
  } else {
    targetType = 'single_site';
    scrapeStrategy = 'domain';
    riskLevel = rowCount > 50 ? 'medium' : 'low';
  }

  return { targetType, scrapeStrategy, riskLevel, cues };
}

function buildRecommendedFlags(target) {
  const flags = [`--domain=${target.domain}`];
  for (const term of target.orgTerms.slice(0, 4)) {
    flags.push(`--org=${JSON.stringify(term)}`);
  }
  if (target.stateCount === 1 && target.states[0]) {
    flags.push(`--state=${target.states[0]}`);
  }
  if (target.scrapeStrategy === 'site_path' && target.sampleUrl) {
    flags.push(`--seed-url=${target.sampleUrl}`);
  }
  return flags;
}

const rows = db.prepare(`
  SELECT
    n.id,
    n.name,
    n.county_id,
    c.state_id,
    n.source_url,
    n.website,
    n.verification_status,
    n.in_person_services,
    n.accessibility_evidence_level,
    n.accessibility_notes
  FROM nonprofit_organizations n
  LEFT JOIN counties c ON c.id = n.county_id
  WHERE n.source_url IS NOT NULL
    AND TRIM(n.source_url) <> ''
    AND n.verification_status IN ('official_verified','verified','human_verified','source_listed')
`).all();

const targets = new Map();
for (const row of rows) {
  const parsed = getNormalizedUrl(row.source_url || row.website);
  if (!parsed) continue;
  const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
  const pathName = parsed.pathname || '/';
  const groupingKey = host.includes('thearc.org') && pathName.startsWith('/chapter/')
    ? `${host}${pathName}`
    : host.includes('parentcenterhub.org')
      ? host
      : host;

  if (!targets.has(groupingKey)) {
    targets.set(groupingKey, {
      key: groupingKey,
      domain: host,
      pathName,
      sampleUrl: `${parsed.origin}${pathName}`,
      rowCount: 0,
      trustedMissingRows: 0,
      existingLocalEvidenceRows: 0,
      orgLevelEvidenceRows: 0,
      counties: new Set(),
      states: new Set(),
      names: new Set(),
      orgTerms: new Set(),
    });
  }

  const target = targets.get(groupingKey);
  target.rowCount += 1;
  if (!row.accessibility_notes && !row.in_person_services && !row.accessibility_evidence_level) {
    target.trustedMissingRows += 1;
  }
  if (['service_location_address', 'county_specific_location'].includes(String(row.accessibility_evidence_level || ''))) {
    target.existingLocalEvidenceRows += 1;
  }
  if (['organization_physical_address', 'statewide_service_area'].includes(String(row.accessibility_evidence_level || ''))) {
    target.orgLevelEvidenceRows += 1;
  }
  if (row.county_id) target.counties.add(row.county_id);
  if (row.state_id) target.states.add(String(row.state_id).toLowerCase());
  const normalizedName = normalizeName(row.name);
  if (normalizedName) {
    target.names.add(normalizedName);
    const titleish = String(row.name || '').replace(/\s+-\s+.*$/, '').trim();
    if (titleish) target.orgTerms.add(titleish);
  }
}

const queue = [...targets.values()].map((target) => {
  const states = [...target.states].sort();
  const orgTerms = [...target.orgTerms].sort((a, b) => a.localeCompare(b));
  const distinctNames = target.names.size;
  const stateCount = target.states.size;
  const countyCount = target.counties.size;
  const { targetType, scrapeStrategy, riskLevel, cues } = classifyTarget({
    host: target.domain,
    pathName: target.pathName,
    distinctNames,
    stateCount,
    countyCount,
    rowCount: target.rowCount,
  });
  return {
    key: target.key,
    domain: target.domain,
    sampleUrl: target.sampleUrl,
    rowCount: target.rowCount,
    trustedMissingRows: target.trustedMissingRows,
    existingLocalEvidenceRows: target.existingLocalEvidenceRows,
    orgLevelEvidenceRows: target.orgLevelEvidenceRows,
    distinctNames,
    countyCount,
    stateCount,
    states,
    targetType,
    scrapeStrategy,
    riskLevel,
    cues,
    orgTerms,
  };
}).sort((a, b) =>
  b.trustedMissingRows - a.trustedMissingRows ||
  b.rowCount - a.rowCount ||
  a.domain.localeCompare(b.domain)
);

const topQueue = queue.slice(0, 100).map((target) => ({
  ...target,
  recommendedFlags: buildRecommendedFlags(target),
}));

const generatedProfiles = {};
for (const target of topQueue.slice(0, 40)) {
  generatedProfiles[target.domain] = {
    orgTerms: target.orgTerms.slice(0, 4),
    defaultMode: 'dry-run',
    notes: `${target.targetType}; strategy=${target.scrapeStrategy}; risk=${target.riskLevel}`,
  };
}

const payload = {
  generatedAt: generatedDate,
  dbPath,
  totalTrustedRows: rows.length,
  distinctScrapeTargets: queue.length,
  queue,
  topQueue,
};

const mdLines = [
  '# Nonprofit Scrape Queue',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  `- trusted nonprofit rows considered: ${rows.length}`,
  `- distinct normalized scrape targets: ${queue.length}`,
  '',
  'This queue is the low-token prep list for nonprofit scraping. It collapses raw source URLs into actual scrape targets, flags network/affiliate patterns, and suggests the right scrape strategy before any promotion work starts.',
  '',
  '## Top targets',
  '',
  '| Target | Missing Rows | Total Rows | Type | Strategy | Risk | States |',
  '| --- | ---: | ---: | --- | --- | --- | --- |',
];

for (const target of topQueue.slice(0, 20)) {
  mdLines.push(`| ${target.key} | ${target.trustedMissingRows} | ${target.rowCount} | ${target.targetType} | ${target.scrapeStrategy} | ${target.riskLevel} | ${target.states.join(', ') || '-'} |`);
}

mdLines.push('', '## First batch to run', '');
for (const target of topQueue.slice(0, 12)) {
  mdLines.push(`- ${target.key}: missing=${target.trustedMissingRows}, type=${target.targetType}, strategy=${target.scrapeStrategy}, flags=${target.recommendedFlags.join(' ')}`);
}

mdLines.push('', '## Network or affiliate targets needing discovery first', '');
for (const target of topQueue.filter((item) => ['network_directory', 'aggregator_or_network'].includes(item.targetType)).slice(0, 12)) {
  mdLines.push(`- ${target.key}: missing=${target.trustedMissingRows}, states=${target.stateCount}, names=${target.distinctNames}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.mkdirSync(path.dirname(profileOutPath), { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);
fs.writeFileSync(profileOutPath, `${JSON.stringify(generatedProfiles, null, 2)}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  distinctScrapeTargets: queue.length,
  topTargets: topQueue.slice(0, 10).map((target) => ({
    key: target.key,
    trustedMissingRows: target.trustedMissingRows,
    targetType: target.targetType,
    scrapeStrategy: target.scrapeStrategy,
    riskLevel: target.riskLevel,
  })),
  report: mdOutPath,
  json: jsonOutPath,
  generatedProfiles: profileOutPath,
}, null, 2));
