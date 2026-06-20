import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);

const jsonOutPath = path.join(docsDir, `launch-scraper-queue-governance-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-queue-governance-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated input for prefix "${prefix}"`);
  }
  return path.join(docsDir, matches.at(-1));
}

const inventoryPath = latestGeneratedJson('launch-scrape-link-inventory-');
const launchPlanPath = latestGeneratedJson('launch-critical-data-acquisition-plan-');
const inventory = readJson(inventoryPath);
const launchPlan = readJson(launchPlanPath);

const launchNeedClassRules = [
  {
    class: 'ready_target_scrape',
    meaning: 'Exact runnable target already present in control-plane artifacts and allowed to consume scrape volume now.',
    classificationTriggers: [
      'ledgerStatus is one of ready_lightweight, ready_js_heavy, or ready_pdf',
      'family is launch-critical',
      'row is not quarantined',
    ],
    allowedNextLanes: ['ready_target_scrape', 'defer_blocked_source', 'repair_first', 'manual_review', 'promotion_only'],
    terminalWhen: 'family lane is exhausted and downstream decision is captured elsewhere',
  },
  {
    class: 'author_first',
    meaning: 'Candidate exists but needs source-pack authoring or packet completion before scraping.',
    classificationTriggers: [
      'ledgerStatus is author_first_candidate',
      'or family plan marks the blocker as author_first',
    ],
    allowedNextLanes: ['author_first', 'ready_target_scrape', 'manual_review'],
    terminalWhen: 'authoring is complete and row becomes ready_target_scrape, or family is explicitly blocked',
  },
  {
    class: 'repair_first',
    meaning: 'Known broken, malformed, stale, or fake source must be repaired before more scraping.',
    classificationTriggers: [
      'ledgerStatus is repair_first',
      'or official-domain/followup repair pack provides reviewed replacements',
    ],
    allowedNextLanes: ['repair_first', 'ready_target_scrape', 'do_not_scrape_quarantined'],
    terminalWhen: 'replacement is accepted into ready_target_scrape or source is permanently quarantined',
  },
  {
    class: 'defer_blocked_source',
    meaning: 'Known blocked or dead source that should not be retried until replaced.',
    classificationTriggers: [
      'ledgerStatus is defer_blocked_source',
      'or knowledge/blocked-source registry marks it deferred',
    ],
    allowedNextLanes: ['defer_blocked_source', 'author_first', 'repair_first'],
    terminalWhen: 'replacement exact target is authored or family records an explicit blocked outcome',
  },
  {
    class: 'live_refresh_candidate',
    meaning: 'Existing DB provenance URL for refresh/validation, not first-pass launch scraping.',
    classificationTriggers: [
      'row comes from live DB source fields',
      'launchNeedClass explicitly set to live_refresh_candidate',
    ],
    allowedNextLanes: ['live_refresh_candidate', 'ready_target_scrape', 'repair_first', 'do_not_scrape_quarantined'],
    terminalWhen: 'either promoted into a real exact-target lane or explicitly retired/quarantined',
  },
  {
    class: 'manual_review',
    meaning: 'Needs operator judgment before entering a runnable fetch or repair lane.',
    classificationTriggers: [
      'crawlMethod implies manual review',
      'or candidate confidence is low in repair/source-pack artifacts',
    ],
    allowedNextLanes: ['manual_review', 'author_first', 'repair_first', 'ready_target_scrape', 'do_not_scrape_quarantined'],
    terminalWhen: 'operator decides a next lane and the row leaves manual_review',
  },
  {
    class: 'do_not_scrape_quarantined',
    meaning: 'Fake, malformed, stale, or forbidden target retained only so it stays visible and excluded.',
    classificationTriggers: [
      'quarantineReason or quarantineClassification is present',
      'or reviewed pack explicitly marks it do_not_scrape',
    ],
    allowedNextLanes: ['do_not_scrape_quarantined', 'repair_first'],
    terminalWhen: 'remains excluded until an explicit reviewed repair row replaces it',
  },
  {
    class: 'discovery_only',
    meaning: 'Known URL exists but is not yet an exact runnable launch target.',
    classificationTriggers: [
      'ledgerStatus is discovery_only',
    ],
    allowedNextLanes: ['discovery_only', 'author_first', 'manual_review'],
    terminalWhen: 'either narrowed into author_first/ready_target_scrape or dropped from launch scope',
  },
];

const blockedWorkTaxonomy = launchPlan.blockedWorkTaxonomy || [];
const familyBlockedLaneSummary = launchPlan.familyBlockedLaneSummary || {
  programs_benefits: {
    primaryUnblockClass: 'promotion_blocked',
    nextLane: 'promotion_only',
  },
  waivers: {
    primaryUnblockClass: 'coverage_below_threshold',
    nextLane: 'author_first',
  },
  forms_guides: {
    primaryUnblockClass: 'author_first',
    nextLane: 'author_first',
  },
  program_waitlists: {
    primaryUnblockClass: 'author_first',
    nextLane: 'author_first',
  },
  medicaid_hhs_offices: {
    primaryUnblockClass: 'repair_first',
    nextLane: 'repair_first',
  },
  dd_routing: {
    primaryUnblockClass: 'coverage_below_threshold',
    nextLane: 'ready_target_scrape',
  },
  education_routing: {
    primaryUnblockClass: 'coverage_below_threshold',
    nextLane: 'author_first',
  },
  providers_care: {
    primaryUnblockClass: 'author_first',
    nextLane: 'author_first',
  },
  knowledge_content: {
    primaryUnblockClass: 'fetch_blocked',
    nextLane: 'defer_blocked_source',
  },
  disability_to_program_matching: {
    primaryUnblockClass: 'coverage_below_threshold',
    nextLane: 'promotion_only',
  },
};

const inventorySummary = inventory.summary || {};
const byClass = inventorySummary.byLaunchNeedClass || {};

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    launchScrapeLinkInventory: path.relative(repoRoot, inventoryPath),
    launchCriticalDataPlan: path.relative(repoRoot, launchPlanPath),
  },
  purpose: 'Governance contract for launch scraper queue classes, lane transitions, and terminal queue states.',
  launchNeedClassRules,
  blockedWorkTaxonomy,
  familyBlockedLaneSummary,
  queueClassCounts: byClass,
  invariants: [
    'A quarantined URL must never appear in ready_target_scrape.',
    'A launch-critical URL must resolve to one explicit queue class.',
    'Only ready_target_scrape is allowed to consume scrape volume directly.',
    'author_first and repair_first are preparation lanes, not fetch lanes.',
    'defer_blocked_source is terminal for fetch until a reviewed replacement exists.',
    'live_refresh_candidate is not equivalent to ready_target_scrape.',
  ],
};

const mdLines = [
  '# Launch Scraper Queue Governance',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  '## Queue Class Counts',
  '',
  ...Object.entries(payload.queueClassCounts).map(([klass, count]) => `- ${klass}: ${count}`),
  '',
  '## Launch Need Class Rules',
  '',
];

for (const rule of launchNeedClassRules) {
  mdLines.push(`## ${rule.class}`);
  mdLines.push('');
  mdLines.push(`- meaning: ${rule.meaning}`);
  mdLines.push(`- classificationTriggers: ${rule.classificationTriggers.join('; ')}`);
  mdLines.push(`- allowedNextLanes: ${rule.allowedNextLanes.join(', ')}`);
  mdLines.push(`- terminalWhen: ${rule.terminalWhen}`);
  mdLines.push('');
}

mdLines.push('## Blocked Work Taxonomy', '');
for (const item of blockedWorkTaxonomy) {
  mdLines.push(`- ${item.class}: ${item.meaning}`);
  mdLines.push(`  - allowedNextLanes: ${(item.allowedNextLanes || []).join(', ')}`);
}
mdLines.push('', '## Family Blocked Lane Summary', '');
for (const [family, summary] of Object.entries(familyBlockedLaneSummary)) {
  mdLines.push(`- ${family}: primaryUnblockClass=${summary.primaryUnblockClass}; nextLane=${summary.nextLane}`);
}
mdLines.push('', '## Invariants', '');
for (const invariant of payload.invariants) {
  mdLines.push(`- ${invariant}`);
}
mdLines.push('');

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
}, null, 2));
