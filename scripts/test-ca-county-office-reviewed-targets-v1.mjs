import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const scriptPath = path.join(repoRoot, 'scripts', 'generate-ca-county-office-reviewed-targets-v1.mjs');

const result = spawnSync(process.execPath, [scriptPath], {
  cwd: repoRoot,
  encoding: 'utf8',
});

assert.equal(result.status, 0, result.stderr || result.stdout);

const reviewedPath = path.join(repoRoot, 'data', 'generated', 'ca_county_office_reviewed_targets_v1.jsonl');
const unresolvedPath = path.join(repoRoot, 'data', 'generated', 'ca_county_office_unresolved_leaf_gaps_v1.jsonl');
const summaryPath = path.join(repoRoot, 'data', 'generated', 'ca_county_office_reviewed_targets_summary_v1.json');
const mdPath = path.join(repoRoot, 'docs', 'generated', 'ca-county-office-reviewed-targets-v1.md');

assert.equal(fs.existsSync(reviewedPath), true);
assert.equal(fs.existsSync(unresolvedPath), true);
assert.equal(fs.existsSync(summaryPath), true);
assert.equal(fs.existsSync(mdPath), true);

const reviewed = fs.readFileSync(reviewedPath, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
const unresolved = fs.readFileSync(unresolvedPath, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.equal(summary.reviewedTargetCount, reviewed.length);
assert.ok(reviewed.length >= 4);
assert.deepEqual(summary.unresolvedCounties.sort(), ['san-luis-obispo', 'sierra']);
assert.equal(unresolved.length, 2);

const nevada = reviewed.find((row) => row.countyId === 'nevada');
assert.equal(Boolean(nevada), true);
assert.match(nevada.candidateUrl, /In-Home-Supportive-Services-IHSS|Health-Human-Services-Agency/);

const sierra = unresolved.find((row) => row.countyId === 'sierra');
assert.equal(Boolean(sierra), true);
assert.equal(sierra.unresolvedReason, 'no_same_domain_leaf_candidate_found_in_saved_homepage');

assert.match(markdown, /Reviewed targets:/);

console.log('ca county office reviewed targets tests passed');
