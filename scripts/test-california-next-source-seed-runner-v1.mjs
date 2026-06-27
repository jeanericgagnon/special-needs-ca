import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { mapSeedQueueRowToSourcePackRow, parseArgs, runCaliforniaNextSourceSeedQueue } from './run-california-next-source-seed-queue-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const sampleQueueRow = {
  jobId: 'ca_seed_001',
  state: 'california',
  family: 'ihss',
  sourceRole: 'county_office_directory',
  label: 'CDSS County IHSS Offices Directory',
  url: 'https://www.cdss.ca.gov/inforesources/county-ihss-offices',
  authority: 'official_county_and_state',
  owner: 'California Department of Social Services + county IHSS offices',
  sourceType: 'official_directory',
  targetKind: 'directory_root',
  expectedCoverage: 'county IHSS office routing',
  normalizedDomain: 'www.cdss.ca.gov',
  batchClass: 'directory_root',
  fetchMode: 'http_fetch_with_same_domain_discovery',
  maxBytes: 3145728,
  timeoutMs: 20000,
  retryCount: 1,
  delayMs: 400,
  requiredValidationChecks: ['source_url', 'official_domain'],
  displayStatusOnIngest: 'needs_review',
  queueLane: 'registry_seed_fetch',
  notes: 'Primary statewide directory for county IHSS office contact pages.',
};

const mapped = mapSeedQueueRowToSourcePackRow(sampleQueueRow);
assert.equal(mapped.state, 'CA');
assert.equal(mapped.entity_id, 'ihss');
assert.equal(mapped.source_role, 'county_office_directory');
assert.equal(mapped.batch_class, 'directory_root');
assert.equal(mapped.provenance_url, sampleQueueRow.url);
assert.equal(mapped.display_status_on_ingest, 'needs_review');

function makeResponse({
  url,
  status = 200,
  contentType = 'text/html; charset=utf-8',
  body = '<html><head><title>County IHSS Offices</title></head><body><h1>County IHSS Offices</h1><a href="/alameda">Alameda</a></body></html>',
}) {
  const buffer = Buffer.from(body);
  const headers = new Map([
    ['content-type', contentType],
    ['etag', 'W/"seed-runner"'],
    ['last-modified', 'Sat, 27 Jun 2026 00:00:00 GMT'],
  ]);
  return {
    ok: status >= 200 && status < 300,
    status,
    url,
    headers: {
      get(name) {
        return headers.get(String(name).toLowerCase()) || '';
      },
    },
    arrayBuffer: async () => buffer,
    text: async () => buffer.toString('utf8'),
  };
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ca-next-source-runner-'));
fs.mkdirSync(path.join(tmp, 'data', 'generated'), { recursive: true });
const queuePath = path.join(tmp, 'data', 'generated', 'california-next-source-seed-queue-v1.jsonl');
fs.writeFileSync(queuePath, `${JSON.stringify(sampleQueueRow)}\n`);

const result = spawnSync(
  process.execPath,
  [path.join(repoRoot, 'scripts', 'run-california-next-source-seed-queue-v1.mjs'), '--mode=plan-only'],
  {
    cwd: tmp,
    encoding: 'utf8',
  },
);
assert.equal(result.status, 0, result.stderr);

const mappedPackPath = path.join(tmp, 'data', 'generated', 'california-next-source-seed-pack-v1.jsonl');
const planSummaryPath = path.join(tmp, 'data', 'generated', 'california-next-source-seed-run-plan-v1.json');
assert.ok(fs.existsSync(mappedPackPath), 'mapped seed pack should be written in plan-only mode');
assert.ok(fs.existsSync(planSummaryPath), 'plan summary should be written in plan-only mode');

const mappedRows = fs.readFileSync(mappedPackPath, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
const planSummary = JSON.parse(fs.readFileSync(planSummaryPath, 'utf8'));
assert.equal(mappedRows.length, 1);
assert.equal(mappedRows[0].seed_job_id, 'ca_seed_001');
assert.equal(planSummary.queueRows, 1);
assert.equal(planSummary.mappedRows, 1);
assert.equal(planSummary.byBatchClass.directory_root, 1);

const liveArgs = parseArgs([
  `--queue-path=${queuePath}`,
  `--output-dir=${path.join(tmp, 'data', 'generated')}`,
  `--runs-dir=${path.join(tmp, 'data', 'source-acquisition-runs')}`,
  '--mode=live',
  '--run-id=seed-runner-live-test',
  '--limit=1',
  '--max-concurrency=1',
  '--delay-ms=0',
  '--retry-delay-ms=0',
]);

const liveResult = await runCaliforniaNextSourceSeedQueue(liveArgs, async (url) => makeResponse({ url }));
assert.equal(liveResult.mode, 'live');
assert.equal(liveResult.queueRows, 1);
assert.equal(liveResult.selectedCount, 1);
assert.equal(liveResult.resultCount, 1);
assert.equal(liveResult.failureCount, 0);
assert.equal(liveResult.blockedCount, 0);

const liveResultsPath = path.join(tmp, 'data', 'generated', 'ca_scrape_results_v1.jsonl');
assert.ok(fs.existsSync(liveResultsPath), 'live run should emit scrape results');
const liveRows = fs.readFileSync(liveResultsPath, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
assert.equal(liveRows.length, 1);
assert.equal(liveRows[0].source_role, 'county_office_directory');
assert.equal(liveRows[0].fetch_status, 'fetched');

console.log('california next-source seed runner tests passed');
