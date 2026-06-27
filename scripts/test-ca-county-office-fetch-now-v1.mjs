import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runCaCountyOfficeFetchNow } from './run-ca-county-office-fetch-now-v1.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ca-county-office-fetch-now-'));
const queuePath = path.join(tmp, 'queue.jsonl');
const outputDir = path.join(tmp, 'generated');
const runsDir = path.join(tmp, 'runs');

fs.writeFileSync(queuePath, `${JSON.stringify({
  jobId: 'job-1',
  state: 'california',
  countyId: 'nevada',
  targetFamily: 'medicaid_hhs_offices',
  desiredProgramId: 'ihss-for-children',
  currentRecordId: 'record-1',
  candidateUrl: 'https://county.example.org/ihss',
  likelyAgency: 'Nevada County Health and Human Services',
  reviewedStatus: 'high_confidence_leaf_candidate',
  batchClass: 'html',
  source: 'saved_homepage_leaf_mining_v1',
  acceptanceRule: 'exact_county_ihss_or_social_services_leaf_with_phone_address_and_county_role',
  executionLane: 'fetch_now',
})}\n`);

const html = `
  <html>
    <head><title>Nevada County IHSS</title></head>
    <body>
      <h1>In-Home Supportive Services</h1>
      <h2>Phone and address</h2>
      <p>Call (530) 000-0000. Visit 123 County Way, Nevada City, CA.</p>
    </body>
  </html>
`;

const fetchImpl = async () => ({
  ok: true,
  status: 200,
  url: 'https://county.example.org/ihss',
  headers: new Map([
    ['content-type', 'text/html; charset=utf-8'],
    ['etag', 'test-etag'],
    ['last-modified', 'Fri, 27 Jun 2026 00:00:00 GMT'],
  ]),
  body: {
    getReader() {
      let done = false;
      return {
        async read() {
          if (done) return { done: true, value: undefined };
          done = true;
          return { done: false, value: new TextEncoder().encode(html) };
        },
      };
    },
  },
});

const payload = await runCaCountyOfficeFetchNow({
  runId: 'test-run',
  queuePath,
  outputDir,
  runsDir,
  delayMs: 0,
  retryDelayMs: 0,
  requestTimeoutMs: 1000,
  bodyTimeoutMs: 1000,
  maxResponseBytes: 1024 * 1024,
  limit: 0,
  offset: 0,
  resume: false,
  maxConcurrency: 1,
  simulateCrashAfter: 0,
}, fetchImpl);

assert.equal(payload.ok, true);

const laneSummary = JSON.parse(fs.readFileSync(path.join(outputDir, 'ca_county_office_fetch_lane_summary_v1.json'), 'utf8'));
assert.equal(laneSummary.queueCount, 1);
assert.equal(laneSummary.outputs.resultCount, 1);
assert.equal(laneSummary.outputs.failureCount, 0);

const mirrored = fs.readFileSync(path.join(outputDir, 'ca_county_office_fetch_input_v1.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
assert.equal(mirrored.length, 1);
assert.equal(mirrored[0].jobId, 'job-1');

const parseReady = JSON.parse(fs.readFileSync(path.join(runsDir, 'test-run', 'followups', 'parse-ready-high-signal.json'), 'utf8'));
assert.equal(parseReady.length, 1);
assert.equal(parseReady[0].gapFamily, 'medicaid_hhs_offices');
assert.equal(parseReady[0].sourceRole, 'county_ihss_leaf_candidate');
assert.equal(parseReady[0].countyId, 'nevada');
assert.equal(parseReady[0].desiredProgramId, 'ihss-for-children');

console.log('test-ca-county-office-fetch-now-v1: ok');
