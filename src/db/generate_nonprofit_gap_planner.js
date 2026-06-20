import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const registryRoot = path.join(repoRoot, 'data', 'nonprofit-link-registry');
const expansionRoot = path.join(repoRoot, 'data', 'nonprofit-link-registry-expansions');
const generatedDate = new Date().toISOString().slice(0, 10);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestFile(dir, fileName) {
  if (!fs.existsSync(dir)) return null;
  const dirs = fs.readdirSync(dir).sort();
  const last = dirs.at(-1);
  if (!last) return null;
  const full = path.join(dir, last, fileName);
  return fs.existsSync(full) ? full : null;
}

const auditPath = path.join(docsDir, `directory-accessibility-audit-${generatedDate}.json`);
const registryPath = latestFile(registryRoot, 'registry.json');
const expansionPath = latestFile(expansionRoot, 'summary.json');
const queuePath = path.join(docsDir, `nonprofit-scrape-queue-${generatedDate}.json`);

if (!fs.existsSync(auditPath) || !registryPath || !fs.existsSync(queuePath)) {
  throw new Error('Missing prerequisite inputs. Expected directory accessibility audit, nonprofit scrape queue, and link registry artifacts.');
}

const accessibilityAudit = readJson(auditPath);
const registry = readJson(registryPath);
const queue = readJson(queuePath);
const expansion = expansionPath ? readJson(expansionPath) : null;

const nonprofitAudit = accessibilityAudit.tables.find((table) => table.table === 'nonprofit_organizations');
if (!nonprofitAudit) {
  throw new Error('Could not find nonprofit_organizations in directory accessibility audit payload.');
}

const registryEntries = registry.entries || [];
const queueEntries = queue.queue || queue.topQueue || [];
const pageTypeCounts = expansion?.pageTypeCounts || {};

function countByTargetType(entries) {
  return entries.reduce((acc, entry) => {
    acc[entry.targetType] = (acc[entry.targetType] || 0) + 1;
    return acc;
  }, {});
}

function sumRows(entries, predicate) {
  return entries.filter(predicate).reduce((sum, entry) => sum + Number(entry.trustedMissingRows || 0), 0);
}

const targetTypeCounts = countByTargetType(registryEntries);

const majorGaps = [
  {
    id: 'nonprofit_local_in_person',
    title: 'Nonprofit local in-person evidence',
    blockerRows: nonprofitAudit.fieldCounts.localInPersonEvidence !== undefined
      ? nonprofitAudit.trustedButMissing
      : nonprofitAudit.trustedButMissing,
    currentCoverage: nonprofitAudit.fieldCounts.localInPersonEvidence || 0,
    desiredOutcome: 'Confirm county- or location-safe in-person coverage for nonprofit rows when local first-party evidence exists.',
    targetTypes: ['affiliate_chapter', 'affiliate_site', 'site_path'],
    pageTypes: ['contact', 'location', 'about', 'services'],
    sourceFamilies: queueEntries
      .filter((entry) => ['affiliate_chapter', 'single_site', 'site_path'].includes(entry.targetType))
      .slice(0, 12)
      .map((entry) => entry.key),
  },
  {
    id: 'nonprofit_org_level_presence',
    title: 'Nonprofit org-level physical presence',
    blockerRows: Math.max(nonprofitAudit.trustedButMissing - (nonprofitAudit.fieldCounts.orgLevelPhysicalPresence || 0), 0),
    currentCoverage: nonprofitAudit.fieldCounts.orgLevelPhysicalPresence || 0,
    desiredOutcome: 'Record safe org-level office or statewide service-area evidence without implying local office coverage.',
    targetTypes: ['statewide_service_org', 'single_site'],
    pageTypes: ['contact', 'about', 'services', 'events'],
    sourceFamilies: queueEntries
      .filter((entry) => ['statewide_service_org', 'single_site'].includes(entry.targetType))
      .slice(0, 12)
      .map((entry) => entry.key),
  },
  {
    id: 'nonprofit_affiliate_discovery',
    title: 'Affiliate discovery for umbrella domains',
    blockerRows: sumRows(registryEntries, (entry) => entry.targetType === 'network_directory' || entry.targetType === 'state_listing_page'),
    currentCoverage: targetTypeCounts.affiliate_chapter || 0,
    desiredOutcome: 'Convert umbrella and state-listing domains into real affiliate or chapter scrape targets before deep extraction.',
    targetTypes: ['network_directory', 'state_listing_page'],
    pageTypes: ['directory', 'affiliate', 'general'],
    sourceFamilies: queueEntries
      .filter((entry) => ['network_directory'].includes(entry.targetType))
      .slice(0, 8)
      .map((entry) => entry.key),
  },
  {
    id: 'nonprofit_page_extraction_depth',
    title: 'High-signal page extraction depth',
    blockerRows: registry.projected10kPages || 0,
    currentCoverage: expansion?.uniqueDiscoveredPageCount || 0,
    desiredOutcome: 'Expand enough candidate pages to feed deterministic extractors for contact, services, about, location, and event evidence.',
    targetTypes: ['affiliate_chapter', 'affiliate_site', 'statewide_service_org', 'single_site'],
    pageTypes: ['contact', 'about', 'services', 'location', 'events'],
    sourceFamilies: registryEntries
      .filter((entry) => ['affiliate_chapter', 'affiliate_site', 'statewide_service_org', 'single_site'].includes(entry.targetType))
      .slice(0, 15)
      .map((entry) => entry.seedUrl),
  },
];

function estimateNeededTargets(gap) {
  if (gap.id === 'nonprofit_local_in_person') return 150;
  if (gap.id === 'nonprofit_org_level_presence') return 80;
  if (gap.id === 'nonprofit_affiliate_discovery') return 60;
  if (gap.id === 'nonprofit_page_extraction_depth') return 400;
  return 50;
}

function estimateNeededPages(gap) {
  if (gap.id === 'nonprofit_local_in_person') return 3000;
  if (gap.id === 'nonprofit_org_level_presence') return 1800;
  if (gap.id === 'nonprofit_affiliate_discovery') return 600;
  if (gap.id === 'nonprofit_page_extraction_depth') return 10000;
  return 1000;
}

const prioritizedPlan = majorGaps.map((gap, index) => ({
  priority: index + 1,
  ...gap,
  estimatedTargets: estimateNeededTargets(gap),
  estimatedPages: estimateNeededPages(gap),
  matchingRegistryTargets: registryEntries.filter((entry) => gap.targetTypes.includes(entry.targetType)).length,
  topPageTypeSignals: gap.pageTypes.map((pageType) => ({
    pageType,
    observedInSampleExpansion: pageTypeCounts[pageType] || 0,
  })),
}));

const payload = {
  generatedAt: generatedDate,
  nonprofitGapSummary: {
    trustedPublicRows: nonprofitAudit.trustedPublic,
    trustedMissingAllAccessibility: nonprofitAudit.trustedButMissing,
    localInPersonEvidenceRows: nonprofitAudit.fieldCounts.localInPersonEvidence || 0,
    orgLevelPhysicalPresenceRows: nonprofitAudit.fieldCounts.orgLevelPhysicalPresence || 0,
    languagesRows: nonprofitAudit.fieldCounts.languages || 0,
  },
  registrySummary: {
    registryEntryCount: registry.registryEntryCount,
    projectedCandidatePages: registry.projected10kPages,
    targetTypeCounts,
  },
  sampleExpansionSummary: expansion
    ? {
        expandedTargets: expansion.targetCount,
        uniqueDiscoveredPageCount: expansion.uniqueDiscoveredPageCount,
        pageTypeCounts,
      }
    : null,
  prioritizedPlan,
};

const jsonOutPath = path.join(docsDir, `nonprofit-gap-planner-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `nonprofit-gap-planner-${generatedDate}.md`);

const mdLines = [
  '# Nonprofit Gap Planner',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This plan maps the current nonprofit repo gaps to the source families, target types, and page types most likely to close them.',
  '',
  '## Current gap summary',
  '',
  `- trusted nonprofit rows: ${payload.nonprofitGapSummary.trustedPublicRows}`,
  `- trusted nonprofit rows missing all accessibility: ${payload.nonprofitGapSummary.trustedMissingAllAccessibility}`,
  `- local in-person evidence rows: ${payload.nonprofitGapSummary.localInPersonEvidenceRows}`,
  `- org-level physical presence rows: ${payload.nonprofitGapSummary.orgLevelPhysicalPresenceRows}`,
  `- registry targets available: ${payload.registrySummary.registryEntryCount}`,
  `- projected candidate pages available: ${payload.registrySummary.projectedCandidatePages}`,
  '',
  '## Priority plan',
  '',
];

for (const gap of prioritizedPlan) {
  mdLines.push(`### ${gap.priority}. ${gap.title}`);
  mdLines.push('');
  mdLines.push(`- blocker rows/pages: ${gap.blockerRows}`);
  mdLines.push(`- current coverage: ${gap.currentCoverage}`);
  mdLines.push(`- desired outcome: ${gap.desiredOutcome}`);
  mdLines.push(`- target types: ${gap.targetTypes.join(', ')}`);
  mdLines.push(`- page types: ${gap.pageTypes.join(', ')}`);
  mdLines.push(`- matching registry targets: ${gap.matchingRegistryTargets}`);
  mdLines.push(`- estimated targets to work: ${gap.estimatedTargets}`);
  mdLines.push(`- estimated pages to collect: ${gap.estimatedPages}`);
  mdLines.push(`- top source families: ${gap.sourceFamilies.slice(0, 8).join(' | ')}`);
  mdLines.push('');
}

mdLines.push('## Immediate execution order', '');
mdLines.push('- Expand 100-150 `affiliate_chapter` targets from `thearc.org` first for local office/contact/service pages.');
mdLines.push('- Mine `parentcenterhub.org` state listing pages into real center-site domains before any promotion work.');
mdLines.push('- Re-run direct statewide orgs only after adding stronger contact/location/event extraction.');
mdLines.push('- Promote org-level presence separately from local in-person evidence.');

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  report: mdOutPath,
  json: jsonOutPath,
  gapSummary: payload.nonprofitGapSummary,
  topPriorities: prioritizedPlan.slice(0, 4).map((gap) => ({
    priority: gap.priority,
    id: gap.id,
    blockerRows: gap.blockerRows,
    targetTypes: gap.targetTypes,
    estimatedTargets: gap.estimatedTargets,
    estimatedPages: gap.estimatedPages,
  })),
}, null, 2));
