import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const sourcePacksDir = path.join(repoRoot, 'data', 'source_packs');
const generatedDate = new Date().toISOString().slice(0, 10);

const scrapeJsonPath = path.join(docsDir, `scrape-now-only-${generatedDate}.json`);
const scrapeCsvPath = path.join(docsDir, `scrape-now-only-${generatedDate}.csv`);
const authorJsonPath = path.join(docsDir, `missing-source-families-${generatedDate}.json`);
const authorMdPath = path.join(docsDir, `missing-source-families-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function safeReadJson(filePath) {
  return fs.existsSync(filePath) ? readJson(filePath) : null;
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated input for prefix "${prefix}" in ${docsDir}`);
  }
  return path.join(docsDir, matches.at(-1));
}

function toCsv(rows, headers) {
  const escape = (value) => {
    const stringValue = String(value ?? '');
    if (/[",\n]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
    return stringValue;
  };
  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(',')),
  ].join('\n');
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function sumBy(rows, key) {
  return rows.reduce((sum, row) => sum + Number(row[key] || 0), 0);
}

function topRows(rows, limit, primaryKey) {
  return [...rows]
    .sort((a, b) => (b[primaryKey] || 0) - (a[primaryKey] || 0) || (b.priority || 0) - (a.priority || 0) || a.sourceUrl.localeCompare(b.sourceUrl))
    .slice(0, limit);
}

const ledgerPath = latestGeneratedJson('master-source-target-ledger-');
const exhaustiveGapPath = latestGeneratedJson('exhaustive-gap-master-');
const providerBuildoutPath = latestGeneratedJson('provider-buildout-priority-plan-');
const providerSourcePackPath = latestGeneratedJson('provider-source-pack-plan-');
const authoredTargetsPath = latestGeneratedJson('authored-missing-source-targets-');
const ledger = readJson(ledgerPath);
const exhaustive = readJson(exhaustiveGapPath);
const providerBuildout = readJson(providerBuildoutPath);
const providerSourcePack = readJson(providerSourcePackPath);
const authoredTargets = readJson(authoredTargetsPath);
const rows = ledger.ledger || [];
const scrapeNow = rows.filter((row) => row.shouldScrape);
const californiaPackStillMissing = (ledger.summary?.missingStateFiles || []).includes('california');
const competitiveHelpPackPresent = fs.existsSync(path.join(sourcePacksDir, 'competitive_help.json'));
const providerSourceFamilyStillMissing =
  Number(providerSourcePack?.summary?.limitedPullNowStates || 0) > 0 ||
  Number(providerSourcePack?.summary?.replacePlaceholdersFirstStates || 0) > 0 ||
  Number(providerSourcePack?.summary?.authorTargetsFirstStates || 0) > 0;
const authoredGapCounts = authoredTargets.summary?.byGapFamily || {};
const advocateSourceFamilyStillMissing = Number(authoredGapCounts.advocates_legal || 0) < 50;
const knowledgeSourceFamilyStillMissing = Number(authoredGapCounts.knowledge_content || 0) < 8;
const officialRepairPack = safeReadJson(path.join(sourcePacksDir, 'official_state_domain_repairs.json'));
const formsSourcePack = safeReadJson(path.join(sourcePacksDir, 'forms_source_pack.json'));
const officialSourceFamilyStillMissing = !(
  officialRepairPack &&
  Array.isArray(officialRepairPack.rows) &&
  officialRepairPack.rows.length > 0
);
const formsSourceFamilyStillMissing = !(
  formsSourcePack &&
  Array.isArray(formsSourcePack.rows) &&
  formsSourcePack.rows.length > 0 &&
  Number(formsSourcePack.summary?.noCandidateStates || 0) === 0
);

const scrapeNowSorted = [...scrapeNow].sort((a, b) =>
  (b.trustedMissingRows || 0) - (a.trustedMissingRows || 0) ||
  (b.priority || 0) - (a.priority || 0) ||
  a.sourceUrl.localeCompare(b.sourceUrl)
);

const scrapeSummary = {
  generatedAt: generatedDate,
  totalReadyRows: scrapeNowSorted.length,
  lightweightRows: scrapeNowSorted.filter((row) => row.ledgerStatus === 'ready_lightweight').length,
  jsHeavyRows: scrapeNowSorted.filter((row) => row.ledgerStatus === 'ready_js_heavy').length,
  pdfRows: scrapeNowSorted.filter((row) => row.ledgerStatus === 'ready_pdf').length,
  byGapFamily: countBy(scrapeNowSorted, 'gapFamily'),
  byTargetTable: countBy(scrapeNowSorted, 'targetTable'),
  topByMissingRows: topRows(scrapeNowSorted, 100, 'trustedMissingRows'),
  rows: scrapeNowSorted,
};

const authoringFamilies = [
  ...(officialSourceFamilyStillMissing ? [{
    id: 'official_state_domains_repair',
    label: 'Repair generated fake official domains',
    reason: 'Many state office, DD, waiver, early intervention, and form targets are blocked because the repo currently has generated fake official domains.',
    neededFor: ['county offices', 'DD routing', 'waivers', 'early intervention', 'forms', 'transition'],
    severity: 'critical',
  }] : []),
  ...(formsSourceFamilyStillMissing ? [{
    id: 'forms_exact_urls',
    label: 'Exact forms libraries for most states',
    reason: 'Only 1 forms source is currently scrape-ready; most state form targets are blocked by fake-domain patterns or still too weak.',
    neededFor: ['Medicaid forms', 'special education forms', 'appeal forms', 'guide downloads'],
    severity: 'high',
  }] : []),
  ...(providerSourceFamilyStillMissing ? [{
    id: 'provider_exact_targets',
    label: 'More named first-party provider targets',
    reason: 'Provider coverage is still the biggest visible info gap even after the ready provider URLs are scraped.',
    neededFor: ['clinics', 'therapy centers', 'hospital specialty programs', 'developmental pediatrics', 'diagnostic centers'],
    severity: 'critical',
  }] : []),
  ...(advocateSourceFamilyStillMissing ? [{
    id: 'advocate_first_party_sources',
    label: 'First-party advocate and legal-support sources',
    reason: 'Current advocate/legal targets are overwhelmingly quarantined COPAA-style directories and need replacement with first-party or official sources.',
    neededFor: ['IEP advocates', 'special education legal aid', 'dispute resolution support'],
    severity: 'high',
  }] : []),
  ...(knowledgeSourceFamilyStillMissing ? [{
    id: 'knowledge_content_sources',
    label: 'Knowledge article source families',
    reason: 'The product needs many more explanatory content inputs, but the current target inventory is mostly directory/routing oriented.',
    neededFor: ['waiver explainers', 'school rights', 'respite', 'transition', 'appeals', 'condition journeys'],
    severity: 'medium',
  }] : []),
  ...(californiaPackStillMissing ? [{
    id: 'california_source_targets',
    label: 'California exact source-target pack',
    reason: 'California has no state source-target JSON file, so its exact scrape URL coverage is incomplete.',
    neededFor: ['county offices', 'DD routing', 'education routing', 'forms', 'providers', 'nonprofits', 'advocates'],
    severity: 'critical',
  }] : []),
  ...(competitiveHelpPackPresent ? [] : [{
    id: 'housing_goods_jobs_legal',
    label: 'Competitive help layers: housing, goods, jobs, legal',
    reason: 'The ledger has little exact-URL coverage for these families even though the product model includes those service tags.',
    neededFor: ['housing', 'goods/supplies', 'jobs/vocational', 'legal aid', 'utilities', 'transport'],
    severity: 'critical',
  }]),
];

const gapFamilyStats = Object.entries(countBy(rows, 'gapFamily')).map(([gapFamily, total]) => {
  const group = rows.filter((row) => row.gapFamily === gapFamily);
  return {
    gapFamily,
    total,
    ready: group.filter((row) => row.shouldScrape).length,
    blocked: group.filter((row) => row.ledgerStatus === 'do_not_use').length,
    discoveryOnly: group.filter((row) => row.ledgerStatus === 'discovery_only').length,
    manualReview: group.filter((row) => row.ledgerStatus === 'manual_review').length,
    trustedMissingRows: sumBy(group, 'trustedMissingRows'),
  };
}).sort((a, b) => b.trustedMissingRows - a.trustedMissingRows || b.total - a.total);

const exhaustiveCritical = (exhaustive.nationalGapMatrix || []).filter((item) =>
  ['critical_gap', 'partial', 'not_started', 'meaningful_but_not_exhaustive'].includes(item.status)
);

const authoringPlan = {
  generatedAt: generatedDate,
  criticalExhaustiveGaps: exhaustiveCritical,
  gapFamilyStats,
  authoredFamilyBlockers: authoringFamilies,
  authoredFamilyBlockerCount: authoringFamilies.length,
  families: authoringFamilies,
};

const scrapeHeaders = [
  'id', 'stateId', 'targetTable', 'gapFamily', 'sourceName', 'sourceUrl', 'domain',
  'ledgerStatus', 'crawlMethod', 'priority', 'trustedMissingRows', 'sourceFamily', 'whyNeeded',
];

const mdLines = [
  '# Missing Source Families',
  '',
  `Generated: ${generatedDate}`,
  '',
  authoringFamilies.length > 0
    ? 'This artifact lists the source families we still need to author because scraping the current ready queue will not fully close the remaining product gaps.'
    : 'No authored source-family blockers remain right now; this artifact now acts as a confirmation checkpoint plus a depth-backlog snapshot.',
  '',
  '## Why This Exists',
  '',
  '- `scrape-now-only` tells us what we can crawl immediately.',
  authoringFamilies.length > 0
    ? '- This file tells us what target families we still have to create so the scrape universe becomes actually complete.'
    : '- This file confirms that authoring is cleared and that the remaining work is queue burn-down, validation, staging, and explicit blocker capture.',
  '',
  '## Critical Exhaustive Gaps',
  '',
];

for (const gap of exhaustiveCritical) {
  mdLines.push(`- ${gap.label}: ${gap.exhaustiveGap}`);
}

mdLines.push('', '## Gap Family Coverage Snapshot', '');
for (const item of gapFamilyStats) {
  mdLines.push(`- ${item.gapFamily}: total=${item.total}, ready=${item.ready}, blocked=${item.blocked}, discovery=${item.discoveryOnly}, manual=${item.manualReview}, trustedMissingRows=${item.trustedMissingRows}`);
}

mdLines.push('', '## Authored Source-Family Blockers', '');
if (authoringFamilies.length === 0) {
  mdLines.push('- none; authoring is currently cleared for the tracked family set.');
} else {
  for (const family of authoringFamilies) {
    mdLines.push(`### ${family.label}`);
    mdLines.push('');
    mdLines.push(`- severity: ${family.severity}`);
    mdLines.push(`- reason: ${family.reason}`);
    mdLines.push(`- needed for: ${family.neededFor.join(', ')}`);
    mdLines.push('');
  }
}

fs.writeFileSync(scrapeJsonPath, `${JSON.stringify(scrapeSummary, null, 2)}\n`);
fs.writeFileSync(scrapeCsvPath, `${toCsv(scrapeNowSorted, scrapeHeaders)}\n`);
fs.writeFileSync(authorJsonPath, `${JSON.stringify(authoringPlan, null, 2)}\n`);
fs.writeFileSync(authorMdPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  scrapeNow: {
    json: scrapeJsonPath,
    csv: scrapeCsvPath,
    totalReadyRows: scrapeSummary.totalReadyRows,
  },
  missingSourceFamilies: {
    json: authorJsonPath,
    md: authorMdPath,
    familyCount: authoringFamilies.length,
  },
}, null, 2));
