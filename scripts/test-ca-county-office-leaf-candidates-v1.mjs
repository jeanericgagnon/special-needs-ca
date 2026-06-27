import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const scriptPath = path.join(repoRoot, 'scripts', 'generate-ca-county-office-leaf-candidates-v1.mjs');

const result = spawnSync(process.execPath, [scriptPath], {
  cwd: repoRoot,
  encoding: 'utf8',
});

assert.equal(result.status, 0, result.stderr || result.stdout);

const jsonlPath = path.join(repoRoot, 'data', 'generated', 'ca_county_office_leaf_candidates_v1.jsonl');
const jsonPath = path.join(repoRoot, 'data', 'generated', 'ca_county_office_leaf_candidates_summary_v1.json');
const mdPath = path.join(repoRoot, 'docs', 'generated', 'ca-county-office-leaf-candidates-v1.md');

assert.equal(fs.existsSync(jsonlPath), true);
assert.equal(fs.existsSync(jsonPath), true);
assert.equal(fs.existsSync(mdPath), true);

const rows = fs.readFileSync(jsonlPath, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
const summary = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.ok(summary.totalCandidates >= 1);
assert.ok(summary.countiesWithCandidates.length >= 1);

for (const row of rows) {
  assert.equal(row.discoverySource, 'existing_saved_homepage_html');
  assert.ok(/^https?:\/\//.test(row.candidateUrl));
  assert.ok(row.score > 0);
}

assert.match(markdown, /Total candidates:/);

console.log('ca county office leaf candidates tests passed');
