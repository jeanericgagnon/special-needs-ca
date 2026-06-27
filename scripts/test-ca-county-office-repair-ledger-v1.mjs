import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const scriptPath = path.join(repoRoot, 'scripts', 'run-ca-county-office-repair-ledger-v1.mjs');

const result = spawnSync(process.execPath, [scriptPath], {
  cwd: repoRoot,
  encoding: 'utf8',
});

assert.equal(result.status, 0, result.stderr || result.stdout);

const ledgerPath = path.join(repoRoot, 'data', 'generated', 'ca_county_office_repair_ledger_v1.jsonl');
const summaryPath = path.join(repoRoot, 'data', 'generated', 'ca_county_office_repair_summary_v1.json');
const mdPath = path.join(repoRoot, 'docs', 'generated', 'ca-county-office-repair-ledger-v1.md');

assert.equal(fs.existsSync(ledgerPath), true);
assert.equal(fs.existsSync(summaryPath), true);
assert.equal(fs.existsSync(mdPath), true);

const ledgerRows = fs.readFileSync(ledgerPath, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.equal(summary.totalRows, 10);
assert.equal(summary.publishedRows, 0);
assert.equal(summary.needsReviewRows, 10);

const sanJoaquin = ledgerRows.find((row) => row.countyId === 'san-joaquin');
assert.equal(Boolean(sanJoaquin), true);
assert.equal(sanJoaquin.displayStatus, 'needs_review');
assert.equal(sanJoaquin.blockerType, 'aging_only_page');
assert.equal(sanJoaquin.nextAction, 'author_exact_ihss_or_human_services_leaf');

const calaveras = ledgerRows.find((row) => row.countyId === 'calaveras');
assert.equal(Boolean(calaveras), true);
assert.equal(calaveras.blockerType, 'likely_repairable_leaf');

const parentTraining = ledgerRows.find((row) => row.sourceRole === 'parent_training_information_and_family_empowerment_directory');
assert.equal(Boolean(parentTraining), true);
assert.equal(parentTraining.blockerType, 'wrong_family_source');

assert.match(markdown, /Published rows: `0`/);
assert.match(markdown, /Needs review rows: `10`/);
assert.match(markdown, /generic_needs_repair: 1/);
assert.match(markdown, /aging_only_page: 1/);

console.log('ca county office repair ledger tests passed');
