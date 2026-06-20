import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import {
  ensureDir,
  getLatestRunId,
  outputRoot,
  writeJson,
} from './source-acquisition-lightweight-lib.mjs';
import {
  buildCountyIndex,
  inferCountyAssignment,
  buildCountyUpdate,
} from './source-acquisition-county-inference-lib.mjs';
import { familyDirName } from './source-acquisition-stage-lib.mjs';

function parseArgs(argv) {
  const args = {
    runId: '',
    mode: 'dry-run',
    family: 'all',
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'run-id' && value) args.runId = value;
    if (flag === 'mode' && value) args.mode = value;
    if (flag === 'family' && value) args.family = value;
  }
  return args;
}

function countBy(rows, keyFn) {
  const counts = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))
    .map(([label, count]) => ({ label, count }));
}

function readNdjson(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function buildScopedRowKeys(runDir, family) {
  if (!family || family === 'all') return null;
  const candidatesPath = path.join(runDir, 'staged', familyDirName(family), 'promotion-candidates.ndjson');
  if (!fs.existsSync(candidatesPath)) return null;
  return new Set(
    readNdjson(candidatesPath).map((entry) => {
      const row = entry?.candidate?.row || {};
      return [
        row.state_id || '',
        row.source_url || '',
        row.extracted_name || '',
      ].join('|');
    }),
  );
}

const args = parseArgs(process.argv.slice(2));
const runId = args.runId || getLatestRunId();
if (!runId) throw new Error('No source acquisition run found.');

const runDir = path.join(outputRoot, runId);
const inferenceRoot = path.join(runDir, 'county-inference');
ensureDir(inferenceRoot);
const scopedRowKeys = buildScopedRowKeys(runDir, args.family);

const db = new Database(path.join(process.cwd(), 'ca_disability_navigator.db'));
const countyRows = db.prepare('SELECT id, name, state_id FROM counties').all();
const countyIndex = buildCountyIndex(countyRows);

const stagingTables = [
  'staging_scraped_nonprofit_organizations',
  'staging_scraped_resource_providers',
  'staging_scraped_iep_advocates',
  'staging_scraped_state_resource_agencies',
];

const familyToTables = {
  nonprofit_support: ['staging_scraped_nonprofit_organizations'],
  condition_nonprofits: ['staging_scraped_nonprofit_organizations'],
  parent_training_nonprofits: ['staging_scraped_nonprofit_organizations'],
  providers_care: ['staging_scraped_resource_providers'],
  advocates_legal: ['staging_scraped_iep_advocates'],
  dd_routing: ['staging_scraped_state_resource_agencies'],
};

function pendingWhereClause(tableName) {
  if (tableName === 'staging_scraped_state_resource_agencies') {
    return `
      county_id IS NULL
      OR counties_served = state_id
      OR catchment_boundaries = state_id
    `;
  }
  return 'county_id IS NULL';
}

const familyFilter = args.family === 'all'
  ? new Set(stagingTables)
  : new Set(familyToTables[args.family] || stagingTables.filter((tableName) => tableName.includes(args.family)));

const summaries = [];
const allDecisions = [];

const tx = db.transaction(() => {
  for (const tableName of stagingTables) {
    if (!familyFilter.has(tableName)) continue;

    const rows = db.prepare(`
      SELECT * FROM ${tableName}
      WHERE source_type = 'lightweight_source_acquisition'
        AND (${pendingWhereClause(tableName)})
    `).all().filter((row) => {
      if (!scopedRowKeys) return true;
      const rowKey = [
        row.state_id || '',
        row.source_url || '',
        row.extracted_name || '',
      ].join('|');
      return scopedRowKeys.has(rowKey);
    });

    const decisions = [];
    for (const row of rows) {
      if (['multi-state', 'national'].includes(String(row.state_id || ''))) {
        decisions.push({
          tableName,
          rowId: row.id,
          stateId: row.state_id,
          extractedName: row.extracted_name,
          action: 'skipped',
          reason: 'non_single_state_record',
          update: null,
          matches: [],
        });
        continue;
      }

      const matchers = countyIndex.get(row.state_id) || [];
      const inference = inferCountyAssignment(row, matchers);
      const update = buildCountyUpdate(tableName, inference);

      if (update && args.mode === 'apply') {
        const assignments = Object.keys(update).map((column) => `${column} = ?`).join(', ');
        db.prepare(`UPDATE ${tableName} SET ${assignments} WHERE id = ?`).run(...Object.values(update), row.id);
      }

      decisions.push({
        tableName,
        rowId: row.id,
        stateId: row.state_id,
        extractedName: row.extracted_name,
        sourceUrl: row.source_url,
        action: update ? 'updated' : 'skipped',
        reason: inference.reason,
        update,
        matches: inference.matches || [],
      });
    }

    const summary = {
      tableName,
      runId,
      mode: args.mode,
      inspectedCount: rows.length,
      updatedCount: decisions.filter((row) => row.action === 'updated').length,
      skippedCount: decisions.filter((row) => row.action !== 'updated').length,
      reasons: countBy(decisions, (row) => `${row.action}:${row.reason}`),
      evidenceLevels: countBy(decisions.filter((row) => row.update?.evidence_level), (row) => row.update.evidence_level),
    };

    writeJson(path.join(inferenceRoot, `${tableName}-decisions.json`), decisions);
    writeJson(path.join(inferenceRoot, `${tableName}-summary.json`), summary);
    summaries.push(summary);
    allDecisions.push(...decisions);
  }
});

tx();

const indexSummary = {
  runId,
  mode: args.mode,
  tables: summaries,
  totals: {
    inspected: summaries.reduce((sum, row) => sum + row.inspectedCount, 0),
    updated: summaries.reduce((sum, row) => sum + row.updatedCount, 0),
    skipped: summaries.reduce((sum, row) => sum + row.skippedCount, 0),
  },
  topReasons: countBy(allDecisions, (row) => `${row.action}:${row.reason}`),
};

writeJson(path.join(inferenceRoot, 'index-summary.json'), indexSummary);
fs.writeFileSync(
  path.join(inferenceRoot, 'index-summary.md'),
  [
    '# County Inference Summary',
    '',
    `- Run ID: \`${runId}\``,
    `- Mode: \`${args.mode}\``,
    `- Inspected: \`${indexSummary.totals.inspected}\``,
    `- Updated: \`${indexSummary.totals.updated}\``,
    `- Skipped: \`${indexSummary.totals.skipped}\``,
    '',
    '## Tables',
    '',
    ...summaries.map((summary) => `- ${summary.tableName}: updated ${summary.updatedCount}, skipped ${summary.skippedCount}`),
    '',
    '## Top Reasons',
    '',
    ...(indexSummary.topReasons.length ? indexSummary.topReasons.map((item) => `- ${item.label}: ${item.count}`) : ['_None_']),
    '',
  ].join('\n'),
);

db.close();
console.log(JSON.stringify(indexSummary, null, 2));
