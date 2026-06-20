import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = process.env.DB_PATH || path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const docsDir = process.env.OUTPUT_DIR || path.join(repoRoot, 'docs', 'generated');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `provider-accessibility-review-decision-template-${generatedDate}.json`);
const csvOutPath = path.join(docsDir, `provider-accessibility-review-decision-template-${generatedDate}.csv`);

const db = new Database(dbPath, { readonly: true });

const rows = db.prepare(`
  SELECT par.id,
         par.provider_id,
         rp.name AS provider_name,
         par.state_id,
         par.county_id,
         par.source_url,
         par.source_host,
         par.clue_page_type,
         par.clue_field,
         par.clue_status,
         par.review_notes
  FROM provider_accessibility_pull_results par
  LEFT JOIN resource_providers rp ON rp.id = par.provider_id
  WHERE par.clue_status = 'queued'
  ORDER BY par.state_id, par.provider_id, par.clue_page_type, par.clue_field, par.id
`).all();

const payload = {
  generatedAt: generatedDate,
  dbPath,
  entryCommand: 'npm run audit:provider-accessibility-review-decision-template',
  applyCommand: 'npm run fix:provider-accessibility-apply-review-decisions',
  promoteCommand: 'npm run fix:provider-accessibility-promote-reviewed',
  auditCommand: 'npm run audit:directory-foundation-enrichment-queue',
  commands: [
    'npm run audit:provider-accessibility-review-decision-template',
    'npm run fix:provider-accessibility-apply-review-decisions',
    'npm run fix:provider-accessibility-promote-reviewed',
    'npm run audit:directory-foundation-enrichment-queue',
  ],
  instructions: {
    allowedDecisions: ['reviewed', 'rejected'],
    requiredForReviewed: ['id', 'decision', 'clue_page_url', 'reviewed_by', 'clue_value or clue_text'],
    requiredForRejected: ['id', 'decision', 'reviewed_by', 'review_notes'],
    note: 'Do not mark rows promoted here. Promotion is handled separately by the reviewed-clue promotion pass.',
  },
  rows: rows.map((row) => ({
    id: row.id,
    provider_id: row.provider_id,
    provider_name: row.provider_name,
    state_id: row.state_id,
    county_id: row.county_id,
    source_url: row.source_url,
    source_host: row.source_host,
    clue_page_type: row.clue_page_type,
    clue_field: row.clue_field,
    current_status: row.clue_status,
    decision: '',
    clue_page_url: '',
    clue_value: '',
    clue_text: '',
    review_notes: row.review_notes || '',
    reviewed_by: '',
  })),
};

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

const csvHeaders = [
  'id',
  'provider_id',
  'provider_name',
  'state_id',
  'county_id',
  'source_url',
  'source_host',
  'clue_page_type',
  'clue_field',
  'current_status',
  'decision',
  'clue_page_url',
  'clue_value',
  'clue_text',
  'review_notes',
  'reviewed_by',
];

const csvLines = [
  csvHeaders.join(','),
  ...payload.rows.map((row) =>
    csvHeaders.map((header) => csvEscape(row[header])).join(',')
  ),
];

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(csvOutPath, `${csvLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${csvOutPath}`);
