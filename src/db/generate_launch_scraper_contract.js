import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  DEFAULT_REQUEST_TIMEOUT_MS,
  DEFAULT_BODY_TIMEOUT_MS,
} from '../../scripts/source-acquisition-fetch-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);

const jsonOutPath = path.join(docsDir, `launch-scraper-contract-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-contract-${generatedDate}.md`);

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

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function sortObject(object) {
  return Object.fromEntries(Object.entries(object).sort((a, b) => String(a[0]).localeCompare(String(b[0]))));
}

const inventoryPath = latestGeneratedJson('launch-scrape-link-inventory-');
const inventory = readJson(inventoryPath);

const familyConfigs = {
  dd_routing: {
    executionMode: 'fetch_first_then_parse',
    laneOrder: ['ready_lightweight', 'ready_js_heavy'],
    batchProfile: {
      ready_lightweight: { limitRange: '6-12', concurrency: 8, rateLimitMs: 300 },
      ready_js_heavy: { limitRange: '3-6', concurrency: 3, rateLimitMs: 1200 },
    },
    downstreamParser: 'extractDdRouting',
    downstreamValidator: ['missing_office_name', 'missing_dd_contact_signal'],
    acceptedSignals: ['office_name', 'contact_signal', 'routing_or_services_page'],
    stopConditions: ['ready_lane_exhausted', 'repeated_blocked_pattern', 'repair_needed_before_more_fetches'],
  },
  programs_benefits: {
    executionMode: 'fetch_first_then_parse',
    laneOrder: ['ready_lightweight'],
    batchProfile: {
      ready_lightweight: { limitRange: '10-20', concurrency: 8, rateLimitMs: 300 },
    },
    downstreamParser: 'extractPrograms',
    downstreamValidator: ['missing_program_name', 'missing_action_signal'],
    acceptedSignals: ['program_name', 'action_signal', 'official_source_page'],
    stopConditions: ['ready_lane_exhausted', 'generic_program_pages_dominate'],
  },
  waivers: {
    executionMode: 'fetch_first_then_parse',
    laneOrder: ['ready_lightweight'],
    batchProfile: {
      ready_lightweight: { limitRange: '8-13', concurrency: 8, rateLimitMs: 300 },
    },
    downstreamParser: 'extractPrograms',
    downstreamValidator: ['missing_program_name', 'missing_action_signal'],
    acceptedSignals: ['explicit_waiver_identity', 'action_signal', 'eligibility_or_steps_path'],
    stopConditions: ['ready_lane_exhausted', 'needs_repair_replacements'],
  },
  forms_guides: {
    executionMode: 'fetch_first_then_parse',
    laneOrder: ['ready_pdf'],
    batchProfile: {
      ready_pdf: { limitRange: '10-25', concurrency: 4, rateLimitMs: 300 },
    },
    downstreamParser: 'extractForms',
    downstreamValidator: ['forms_requires_official_source', 'missing_form_program_name', 'missing_official_download_or_library_url'],
    acceptedSignals: ['official_source', 'form_or_guide_context', 'download_or_library_url'],
    stopConditions: ['ready_lane_exhausted', 'pdf_batch_failure_spike'],
  },
  program_waitlists: {
    executionMode: 'author_or_queue_refresh_first',
    laneOrder: [],
    batchProfile: {},
    downstreamParser: 'extractPrograms',
    downstreamValidator: ['missing_program_name', 'missing_action_signal'],
    acceptedSignals: ['explicit_waitlist_identity', 'source_linkage'],
    stopConditions: ['queue_not_first_class', 'no_ready_targets_visible'],
  },
  medicaid_hhs_offices: {
    executionMode: 'fetch_first_after_repair',
    laneOrder: ['ready_lightweight', 'ready_js_heavy', 'ready_pdf'],
    batchProfile: {
      ready_lightweight: { limitRange: '15-30', concurrency: 10, rateLimitMs: 300 },
      ready_js_heavy: { limitRange: '3-6', concurrency: 3, rateLimitMs: 1200 },
      ready_pdf: { limitRange: '1-5', concurrency: 2, rateLimitMs: 300 },
    },
    downstreamParser: 'extractCountyOffice',
    downstreamValidator: ['missing_office_name', 'missing_office_phone', 'missing_office_address'],
    acceptedSignals: ['office_name', 'phone', 'address'],
    stopConditions: ['ready_lane_exhausted', 'malformed_hostname_cluster', 'repair_first_backlog_growth'],
  },
  education_routing: {
    executionMode: 'fetch_first_then_parse',
    laneOrder: ['ready_lightweight', 'ready_js_heavy'],
    batchProfile: {
      ready_lightweight: { limitRange: '5-10', concurrency: 8, rateLimitMs: 300 },
      ready_js_heavy: { limitRange: '3-6', concurrency: 3, rateLimitMs: 1200 },
    },
    downstreamParser: 'extractCommonExtraction->regional/district routing',
    downstreamValidator: ['credible_website_or_phone_required'],
    acceptedSignals: ['regional_or_district_entity', 'credible_site', 'phone_or_routing_path'],
    stopConditions: ['ready_lane_exhausted', '3_state_gap_needs_explicit_block_or_fallback'],
  },
  providers_care: {
    executionMode: 'fetch_small_anchor_batches',
    laneOrder: ['ready_lightweight', 'ready_js_heavy'],
    batchProfile: {
      ready_lightweight: { limitRange: '5-10', concurrency: 6, rateLimitMs: 300 },
      ready_js_heavy: { limitRange: '1-3', concurrency: 2, rateLimitMs: 1200 },
    },
    downstreamParser: 'extractProviders',
    downstreamValidator: ['missing_provider_name', 'missing_provider_contact_signal'],
    acceptedSignals: ['named_provider_or_program', 'contact_signal', 'location_signal'],
    stopConditions: ['ready_lane_exhausted', 'state_anchor_coverage_stalls', 'author_first_provider_packets_needed'],
  },
  knowledge_content: {
    executionMode: 'fetch_first_then_parse',
    laneOrder: ['ready_lightweight'],
    batchProfile: {
      ready_lightweight: { limitRange: '10-20', concurrency: 8, rateLimitMs: 300 },
    },
    downstreamParser: 'extractKnowledgeContent',
    downstreamValidator: ['knowledge_requires_high_trust_source', 'missing_knowledge_title', 'knowledge_summary_too_thin'],
    acceptedSignals: ['trusted_source', 'article_title', 'useful_summary_text'],
    stopConditions: ['ready_lane_exhausted', 'deferred_blocked_source_replacements_required'],
  },
};

const fetchContract = {
  userAgent: 'Ablefull source acquisition runner/1.0 (+https://ablefull.com)',
  requestTimeoutMs: DEFAULT_REQUEST_TIMEOUT_MS,
  bodyTimeoutMs: DEFAULT_BODY_TIMEOUT_MS,
  retryCount: 2,
  redirectMode: 'follow',
  defaultRateLimitMs: 1200,
  outputArtifacts: ['manifest.json', 'summary.json', 'results.csv', 'report.md', 'pages/'],
};

const followupContract = {
  buckets: ['parse_ready_high_signal', 'parse_ready_suspect', 'retryable', 'blocked', 'source_repair'],
  terminalBlockedStatuses: ['401', '403', '409', '421', '444', '999'],
  terminalRepairStatuses: ['400', '404', '410', '451'],
  retryableStatuses: ['500', '502', '503', '504', '523', '530'],
};

const familyContracts = Object.entries(familyConfigs).map(([family, config]) => {
  const rows = inventory.rows.filter((row) => row.family === family);
  const readyRows = rows.filter((row) => row.launchNeedClass === 'ready_target_scrape');
  const currentCounts = {
    totalKnownUrls: rows.length,
    readyTargetScrape: readyRows.length,
    authorFirst: rows.filter((row) => row.launchNeedClass === 'author_first').length,
    repairFirst: rows.filter((row) => row.launchNeedClass === 'repair_first').length,
    deferredBlockedSource: rows.filter((row) => row.launchNeedClass === 'defer_blocked_source').length,
    liveRefreshCandidate: rows.filter((row) => row.launchNeedClass === 'live_refresh_candidate').length,
    doNotScrapeQuarantined: rows.filter((row) => row.launchNeedClass === 'do_not_scrape_quarantined').length,
    manualReview: rows.filter((row) => row.launchNeedClass === 'manual_review').length,
    readyByLane: sortObject(countBy(readyRows, 'scrapeLane')),
  };

  const commandTemplates = config.laneOrder.map((lane) => ({
    lane,
    dryRun: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=${family} --status=${lane} --lane=ready_target_scrape --limit=${config.batchProfile[lane]?.limitRange?.split('-')[0] || '5'}`,
    liveRun: `npm run run:source-acquisition-wave -- --mode=live --gap=${family} --status=${lane} --lane=ready_target_scrape --limit=${config.batchProfile[lane]?.limitRange?.split('-')[0] || '5'} --concurrency=${config.batchProfile[lane]?.concurrency || 4} --rate-limit-ms=${config.batchProfile[lane]?.rateLimitMs || 300}`,
  }));

  return {
    family,
    currentCounts,
    executionMode: config.executionMode,
    laneOrder: config.laneOrder,
    batchProfile: config.batchProfile,
    downstreamParser: config.downstreamParser,
    downstreamValidator: config.downstreamValidator,
    acceptedSignals: config.acceptedSignals,
    stopConditions: config.stopConditions,
    commandTemplates,
  };
});

const payload = {
  generatedAt: generatedDate,
  sourceArtifacts: {
    launchScrapeLinkInventory: path.relative(repoRoot, inventoryPath),
  },
  fetchContract,
  followupContract,
  launchFamilyOrder: [
    'dd_routing',
    'programs_benefits',
    'waivers',
    'forms_guides',
    'program_waitlists',
    'medicaid_hhs_offices',
    'education_routing',
    'providers_care',
    'knowledge_content',
  ],
  familyContracts,
};

const mdLines = [
  '# Launch Scraper Contract',
  '',
  `Generated: ${generatedDate}`,
  '',
  '## Fetch Contract',
  '',
  ...Object.entries(fetchContract).map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`),
  '',
  '## Followup Contract',
  '',
  ...Object.entries(followupContract).map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`),
  '',
  '## Launch Family Order',
  '',
  ...payload.launchFamilyOrder.map((family) => `- ${family}`),
  '',
];

for (const family of familyContracts) {
  mdLines.push(`## ${family.family}`);
  mdLines.push('');
  mdLines.push('- Current counts:');
  for (const [key, value] of Object.entries(family.currentCounts)) {
    mdLines.push(`- ${key}: ${typeof value === 'object' ? Object.entries(value).map(([k, v]) => `${k}=${v}`).join(', ') : value}`);
  }
  mdLines.push(`- Execution mode: ${family.executionMode}`);
  mdLines.push(`- Lane order: ${family.laneOrder.join(', ') || 'none'}`);
  mdLines.push(`- Downstream parser: ${family.downstreamParser}`);
  mdLines.push(`- Downstream validator: ${family.downstreamValidator.join(', ')}`);
  mdLines.push('- Accepted signals:');
  for (const signal of family.acceptedSignals) mdLines.push(`- ${signal}`);
  mdLines.push('- Stop conditions:');
  for (const condition of family.stopConditions) mdLines.push(`- ${condition}`);
  if (family.commandTemplates.length) {
    mdLines.push('- Command templates:');
    for (const command of family.commandTemplates) {
      mdLines.push(`- ${command.lane} dry-run: \`${command.dryRun}\``);
      mdLines.push(`- ${command.lane} live: \`${command.liveRun}\``);
    }
  }
  mdLines.push('');
}

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  json: jsonOutPath,
  md: mdOutPath,
  familyCount: familyContracts.length,
}, null, 2));
