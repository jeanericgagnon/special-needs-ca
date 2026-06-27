import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const scriptPath = path.join(repoRoot, 'scripts', 'generate-ca-county-office-fetch-queue-v1.mjs');

const result = spawnSync(process.execPath, [scriptPath], {
  cwd: repoRoot,
  encoding: 'utf8',
});

assert.equal(result.status, 0, result.stderr || result.stdout);

const fetchNowPath = path.join(repoRoot, 'data', 'generated', 'ca_county_office_fetch_now_queue_v1.jsonl');
const reviewFirstPath = path.join(repoRoot, 'data', 'generated', 'ca_county_office_review_first_queue_v1.jsonl');
const summaryPath = path.join(repoRoot, 'data', 'generated', 'ca_county_office_fetch_queue_summary_v1.json');
const mdPath = path.join(repoRoot, 'docs', 'generated', 'ca-county-office-fetch-queue-v1.md');

assert.equal(fs.existsSync(fetchNowPath), true);
assert.equal(fs.existsSync(reviewFirstPath), true);
assert.equal(fs.existsSync(summaryPath), true);
assert.equal(fs.existsSync(mdPath), true);

const fetchNow = fs.readFileSync(fetchNowPath, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
const reviewFirst = fs.readFileSync(reviewFirstPath, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.equal(summary.fetchNowCount, fetchNow.length);
assert.equal(summary.reviewFirstCount, reviewFirst.length);
assert.equal(summary.unresolvedCount, 2);
assert.deepEqual(summary.unresolvedCounties.sort(), ['san-luis-obispo', 'sierra']);

assert.ok(fetchNow.length >= 3);
assert.ok(reviewFirst.length >= 1);
assert.ok(fetchNow.every((row) => row.executionLane === 'fetch_now'));
assert.ok(reviewFirst.every((row) => row.executionLane === 'review_first'));

const nevada = fetchNow.find((row) => row.countyId === 'nevada');
assert.equal(Boolean(nevada), true);
assert.match(nevada.candidateUrl, /In-Home-Supportive-Services-IHSS/);

assert.match(markdown, /Fetch-now rows:/);

console.log('ca county office fetch queue tests passed');
