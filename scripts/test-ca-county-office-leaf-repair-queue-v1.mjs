import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const scriptPath = path.join(repoRoot, 'scripts', 'generate-ca-county-office-leaf-repair-queue-v1.mjs');

const result = spawnSync(process.execPath, [scriptPath], {
  cwd: repoRoot,
  encoding: 'utf8',
});

assert.equal(result.status, 0, result.stderr || result.stdout);

const queuePath = path.join(repoRoot, 'data', 'generated', 'ca_county_office_leaf_repair_queue_v1.jsonl');
const summaryPath = path.join(repoRoot, 'data', 'generated', 'ca_county_office_leaf_repair_summary_v1.json');
const mdPath = path.join(repoRoot, 'docs', 'generated', 'ca-county-office-leaf-repair-queue-v1.md');

assert.equal(fs.existsSync(queuePath), true);
assert.equal(fs.existsSync(summaryPath), true);
assert.equal(fs.existsSync(mdPath), true);

const rows = fs.readFileSync(queuePath, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.equal(summary.totalRows, 6);
assert.deepEqual(summary.counties, ['el-dorado', 'merced', 'nevada', 'san-luis-obispo', 'sierra', 'stanislaus']);

for (const row of rows) {
  assert.equal(row.nextLane, 'author_first');
  assert.equal(row.targetFamily, 'medicaid_hhs_offices');
  assert.equal(row.desiredProgramId, 'ihss-for-children');
  assert.ok(Array.isArray(row.preferredPathTerms) && row.preferredPathTerms.length > 0);
}

const stanislaus = rows.find((row) => row.countyId === 'stanislaus');
assert.equal(Boolean(stanislaus), true);
assert.match(stanislaus.likelyAgency, /Community Services Agency/i);

assert.match(markdown, /Total author-first rows: `6`/);

console.log('ca county office leaf repair queue tests passed');
