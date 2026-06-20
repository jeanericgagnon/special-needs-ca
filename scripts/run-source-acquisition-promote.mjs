import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';
import {
  ensureDir,
  getLatestRunId,
  outputRoot,
  writeJson,
  countBy,
} from './source-acquisition-lightweight-lib.mjs';
import {
  determinePromotionDecision,
  normalizeProductionInsert,
  auditReason,
} from './source-acquisition-promote-lib.mjs';
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
const stagedRoot = path.join(runDir, 'staged');
const promotedRoot = path.join(runDir, 'promoted');
ensureDir(promotedRoot);
const scopedRowKeys = buildScopedRowKeys(runDir, args.family);

if (!fs.existsSync(stagedRoot)) {
  throw new Error(`Missing staged directory: ${stagedRoot}`);
}

const dbPath = path.join(process.cwd(), 'ca_disability_navigator.db');
const db = new Database(dbPath);
const timestamp = new Date().toISOString();

const stagingTables = [
  'staging_scraped_nonprofit_organizations',
  'staging_scraped_state_resource_agencies',
  'staging_scraped_iep_advocates',
  'staging_scraped_resource_providers',
  'staging_scraped_knowledge_content',
];

const familyToTables = {
  nonprofit_support: ['staging_scraped_nonprofit_organizations'],
  condition_nonprofits: ['staging_scraped_nonprofit_organizations'],
  parent_training_nonprofits: ['staging_scraped_nonprofit_organizations'],
  providers_care: ['staging_scraped_resource_providers'],
  advocates_legal: ['staging_scraped_iep_advocates'],
  dd_routing: ['staging_scraped_state_resource_agencies'],
  knowledge_content: ['staging_scraped_knowledge_content'],
};

const overall = [];

const tx = db.transaction(() => {
  for (const tableName of stagingTables) {
    let rows = db.prepare(`
      SELECT * FROM ${tableName}
      WHERE source_type = 'lightweight_source_acquisition'
        AND review_status IN ('pending_review', 'auto_accepted', 'needs_manual_review', 'rejected_duplicate')
    `).all().filter((row) => {
      if (!scopedRowKeys) return true;
      const rowKey = [
        row.state_id || '',
        row.source_url || '',
        row.extracted_name || '',
      ].join('|');
      return scopedRowKeys.has(rowKey);
    });
    if (args.family !== 'all') {
      const allowedTables = new Set(familyToTables[args.family] || stagingTables.filter((name) => name.includes(args.family)));
      if (!allowedTables.has(tableName)) {
        rows = [];
      }
    }
    const decisions = [];
    const promoted = [];
    const manual = [];
    const duplicates = [];

    for (const row of rows) {
      const decision = determinePromotionDecision(tableName, row);
      const production = normalizeProductionInsert(tableName, row, timestamp);
      let targetId = null;
      let duplicateId = null;

      if (production) {
        targetId = production.targetId;
        const duplicate = db.prepare(production.duplicateQuery.sql).get(...production.duplicateQuery.params);
        if (duplicate) duplicateId = duplicate.id;

        if (decision.action === 'promote' && !duplicate && args.mode === 'apply') {
          const placeholders = production.columns.map(() => '?').join(', ');
          db.prepare(`INSERT INTO ${production.targetTable} (${production.columns.join(', ')}) VALUES (${placeholders})`).run(...production.values);
          db.prepare(`UPDATE ${tableName} SET review_status = 'auto_accepted', suggested_target_id = ? WHERE id = ?`).run(targetId, row.id);
          db.prepare(`
            INSERT INTO staging_promotion_audit
            (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
            VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)
          `).run(tableName, row.id, production.targetTable, targetId, timestamp, row.source_url, JSON.stringify(row), auditReason(decision.action, decision.reason));
          promoted.push({ id: row.id, targetId, reason: decision.reason });
        } else if (duplicate) {
          if (args.mode === 'apply') {
            db.prepare(`UPDATE ${tableName} SET review_status = 'rejected_duplicate', duplicate_candidate_id = ? WHERE id = ?`).run(duplicate.id, row.id);
          }
          duplicates.push({ id: row.id, duplicateId: duplicate.id });
        } else {
          if (args.mode === 'apply') {
            db.prepare(`UPDATE ${tableName} SET review_status = 'needs_manual_review' WHERE id = ?`).run(row.id);
          }
          manual.push({ id: row.id, reason: decision.reason });
        }
      } else {
        manual.push({ id: row.id, reason: 'unsupported_target_mapping' });
      }

      decisions.push({
        stagingTable: tableName,
        stagingId: row.id,
        action: duplicateId ? 'duplicate' : decision.action,
        reason: duplicateId ? 'duplicate_existing_record' : decision.reason,
        targetId,
        duplicateId,
        sourceUrl: row.source_url,
        extractedName: row.extracted_name,
      });
    }

    const summary = {
      runId,
      mode: args.mode,
      stagingTable: tableName,
      inspectedCount: rows.length,
      promotedCount: promoted.length,
      duplicateCount: duplicates.length,
      manualReviewCount: manual.length,
      reasons: countBy(decisions, (row) => `${row.action}:${row.reason}`),
    };

    writeJson(path.join(promotedRoot, `${tableName}-decisions.json`), decisions);
    writeJson(path.join(promotedRoot, `${tableName}-summary.json`), summary);
    overall.push(summary);
  }
});

tx();

const indexSummary = {
  runId,
  mode: args.mode,
  dbPath,
  tables: overall,
  totals: {
    inspected: overall.reduce((sum, row) => sum + row.inspectedCount, 0),
    promoted: overall.reduce((sum, row) => sum + row.promotedCount, 0),
    duplicates: overall.reduce((sum, row) => sum + row.duplicateCount, 0),
    manualReview: overall.reduce((sum, row) => sum + row.manualReviewCount, 0),
  },
};

writeJson(path.join(promotedRoot, 'index-summary.json'), indexSummary);
db.close();
console.log(JSON.stringify(indexSummary, null, 2));
