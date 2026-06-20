import fs from 'fs';
import path from 'path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const docsDir = path.join(repoRoot, 'docs', 'generated');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const defaultInputPath = process.env.INPUT_PATH || path.join(repoRoot, 'data', 'provider-placeholder-replacement-decisions.json');
const runTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
const today = new Date().toISOString().slice(0, 10);

const BLOCKED_DOMAINS = new Set([
  'childrenshospital.org',
]);

function parseArgs(argv) {
  const args = {
    apply: false,
    input: defaultInputPath,
    state: null,
  };

  for (const arg of argv) {
    if (arg === '--apply') args.apply = true;
    else if (arg.startsWith('--input=')) args.input = arg.slice('--input='.length).trim();
    else if (arg.startsWith('--state=')) args.state = arg.slice('--state='.length).trim().toLowerCase();
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeSourceTargetsPayload(filePath, payload, items) {
  const nextPayload = Array.isArray(payload)
    ? items
    : {
        ...payload,
        targets: items,
      };
  fs.writeFileSync(filePath, `${JSON.stringify(nextPayload, null, 2)}\n`);
}

function hasText(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

function normalizeUrl(rawUrl) {
  if (!hasText(rawUrl)) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) parsed.port = '';
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

function domainFromUrl(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function findFallbackPlaceholderIndexes(items) {
  const indexes = [];
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if ((item.target_table || '') !== 'resource_providers') continue;
    const domain = domainFromUrl(item.source_url || '');
    if (!BLOCKED_DOMAINS.has(domain)) continue;
    indexes.push(index);
  }
  return indexes;
}

function toMarkdown(report) {
  const lines = [
    '# Provider Placeholder Replacement Run',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Mode: ${report.mode}`,
    '',
    '## Summary',
    '',
    `- state filter: ${report.stateFilter || 'all'}`,
    `- input path: ${report.inputPath}`,
    `- decision rows: ${report.summary.inputRows}`,
    `- applied states: ${report.summary.appliedStates}`,
    `- applied replacements: ${report.summary.appliedReplacements}`,
    `- files changed: ${report.summary.filesChanged}`,
    '',
    '## Skipped By Reason',
    '',
    ...Object.entries(report.summary.skippedByReason).sort((a, b) => b[1] - a[1]).map(([reason, count]) => `- ${reason}: ${count}`),
    '',
    '## Decisions',
    '',
  ];

  for (const item of report.decisions) {
    lines.push(`- ${item.stateId} | ${item.placeholderSourceName} | ${item.status} | replacements=${item.replacementCount}`);
  }

  return `${lines.join('\n')}\n`;
}

const args = parseArgs(process.argv.slice(2));

if (!fs.existsSync(args.input)) {
  console.log(JSON.stringify({
    message: 'No provider placeholder replacement decision file found; nothing to apply.',
    expectedPath: args.input,
    appliedStates: 0,
    appliedReplacements: 0,
  }, null, 2));
  process.exit(0);
}

const raw = readJson(args.input);
const rows = Array.isArray(raw) ? raw : raw.rows;
if (!Array.isArray(rows)) {
  throw new Error(`Expected rows array in ${args.input}`);
}

const selectedRows = rows.filter((row) => !args.state || row.stateId === args.state);
const changedFiles = new Set();
const decisions = [];
const summary = {
  inputRows: selectedRows.length,
  appliedStates: 0,
  appliedPlaceholderRows: 0,
  appliedReplacements: 0,
  filesChanged: 0,
  skippedByReason: {},
};

function note(reason) {
  summary.skippedByReason[reason] = (summary.skippedByReason[reason] || 0) + 1;
}

for (const row of selectedRows) {
  const stateId = hasText(row?.stateId) ? String(row.stateId).trim().toLowerCase() : '';
  const placeholderSourceUrls = Array.isArray(row?.placeholderSourceUrls)
    ? row.placeholderSourceUrls.map((item) => normalizeUrl(item)).filter(Boolean)
    : [normalizeUrl(row?.placeholderSourceUrl)].filter(Boolean);
  const placeholderSourceNames = Array.isArray(row?.placeholderSourceNames)
    ? row.placeholderSourceNames.map((item) => String(item || '').trim()).filter(Boolean)
    : [hasText(row?.placeholderSourceName) ? String(row.placeholderSourceName).trim() : ''].filter(Boolean);
  const placeholderSourceUrl = placeholderSourceUrls[0] || '';
  const placeholderSourceName = placeholderSourceNames[0] || '';
  const reviewedBy = hasText(row?.reviewedBy) ? String(row.reviewedBy).trim() : '';
  const replacements = Array.isArray(row?.replacements) ? row.replacements : [];

  if (!stateId || placeholderSourceUrls.length === 0 || placeholderSourceNames.length === 0) {
    note('missing_state_or_placeholder_identity');
    continue;
  }
  if (!reviewedBy) {
    note('missing_reviewed_by');
    decisions.push({ stateId, placeholderSourceName, status: 'skipped_missing_reviewed_by', replacementCount: replacements.length });
    continue;
  }
  if (replacements.length < 2 || replacements.length > 5) {
    note('invalid_replacement_count');
    decisions.push({ stateId, placeholderSourceName, status: 'skipped_invalid_replacement_count', replacementCount: replacements.length });
    continue;
  }

  const normalizedReplacements = [];
  let invalidReason = '';
  for (const replacement of replacements) {
    const sourceName = hasText(replacement?.source_name) ? String(replacement.source_name).trim() : '';
    const sourceUrl = normalizeUrl(replacement?.source_url);
    const organizationType = hasText(replacement?.organization_type) ? String(replacement.organization_type).trim() : '';
    const crawlMethod = hasText(replacement?.crawl_method) ? String(replacement.crawl_method).trim() : '';
    const notes = hasText(replacement?.notes) ? String(replacement.notes).trim() : '';
    const domain = domainFromUrl(sourceUrl);

    if (!sourceName || !sourceUrl || !organizationType || !crawlMethod || !notes) {
      invalidReason = 'replacement_missing_required_fields';
      break;
    }
    if (!domain || BLOCKED_DOMAINS.has(domain)) {
      invalidReason = 'replacement_uses_blocked_or_invalid_domain';
      break;
    }

    normalizedReplacements.push({
      source_name: sourceName,
      source_url: sourceUrl,
      domain,
      target_table: 'resource_providers',
      category: 'M. Hospitals / university clinics',
      specific_subcategory: replacement.specific_subcategory || 'Hospitals',
      organization_type: organizationType,
      expected_extraction_fields: replacement.expected_extraction_fields || 'name, phone, address',
      crawl_method: crawlMethod,
      robots_status: replacement.robots_status || 'allowed',
      terms_risk: replacement.terms_risk || 'low',
      priority: Number.isFinite(Number(replacement.priority)) ? Number(replacement.priority) : 2,
      notes,
      last_checked_at: today,
      state: replacement.state || '',
    });
  }

  if (invalidReason) {
    note(invalidReason);
    decisions.push({ stateId, placeholderSourceName, status: `skipped_${invalidReason}`, replacementCount: replacements.length });
    continue;
  }

  const filePath = path.join(sourceTargetsDir, `${stateId}.json`);
  if (!fs.existsSync(filePath)) {
    note('missing_source_targets_file');
    decisions.push({ stateId, placeholderSourceName, status: 'skipped_missing_source_targets_file', replacementCount: replacements.length });
    continue;
  }

  const payload = readJson(filePath);
  const items = Array.isArray(payload) ? payload : payload.targets || [];
  let matchIndexes = [];
  let matchStrategy = 'exact_placeholder_url';
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if ((item.target_table || '') !== 'resource_providers') continue;
    const itemUrl = normalizeUrl(item.source_url || '');
    if (!placeholderSourceUrls.includes(itemUrl)) continue;
    matchIndexes.push(index);
  }

  if (matchIndexes.length === 0) {
    const fallbackIndexes = findFallbackPlaceholderIndexes(items);
    if (fallbackIndexes.length === 1) {
      matchIndexes = fallbackIndexes;
      matchStrategy = 'single_blocked_domain_scaffold_fallback';
    } else if (fallbackIndexes.length > 1) {
      note('ambiguous_blocked_domain_scaffold_fallback');
      decisions.push({
        stateId,
        placeholderSourceName,
        status: 'skipped_ambiguous_blocked_domain_scaffold_fallback',
        replacementCount: replacements.length,
      });
      continue;
    } else {
      note('missing_placeholder_row');
      decisions.push({ stateId, placeholderSourceName, status: 'skipped_missing_placeholder_row', replacementCount: replacements.length });
      continue;
    }
  }

  const placeholderRow = items[matchIndexes[0]];
  const stateCode = placeholderRow.state || '';
  const finalizedReplacements = normalizedReplacements.map((replacement) => ({
    ...replacement,
    state: replacement.state || stateCode,
  }));

  if (args.apply) {
    const keptItems = items.filter((_, index) => !matchIndexes.includes(index));
    const insertAt = matchIndexes[0];
    keptItems.splice(insertAt, 0, ...finalizedReplacements);
    writeSourceTargetsPayload(filePath, payload, keptItems);
    changedFiles.add(filePath);
  }

  summary.appliedStates += 1;
  summary.appliedPlaceholderRows += matchIndexes.length;
  summary.appliedReplacements += finalizedReplacements.length;
  decisions.push({
    stateId,
    placeholderSourceName,
    status: args.apply ? 'applied' : 'dry_run_ready',
    matchStrategy,
    placeholderRowCount: matchIndexes.length,
    replacementCount: finalizedReplacements.length,
    replacements: finalizedReplacements.map((item) => ({ source_name: item.source_name, source_url: item.source_url, domain: item.domain })),
  });
}

summary.filesChanged = changedFiles.size;

const report = {
  generatedAt: new Date().toISOString(),
  mode: args.apply ? 'apply' : 'dry-run',
  stateFilter: args.state,
  inputPath: args.input,
  summary,
  decisions,
};

const jsonOutPath = path.join(docsDir, `provider-placeholder-replacement-run-${runTimestamp}.json`);
const mdOutPath = path.join(docsDir, `provider-placeholder-replacement-run-${runTimestamp}.md`);
fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(mdOutPath, toMarkdown(report));

console.log(JSON.stringify({
  generatedAt: report.generatedAt,
  mode: report.mode,
  stateFilter: report.stateFilter,
  summary: report.summary,
  report: {
    json: jsonOutPath,
    md: mdOutPath,
  },
}, null, 2));
