import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ca-county-office-semantic-lift-'));
const runsDir = path.join(tmp, 'runs');
const outputDir = path.join(tmp, 'generated');
const familyDir = path.join(runsDir, 'run-a', 'validated', 'medicaid_hhs_offices');
fs.mkdirSync(familyDir, { recursive: true });

const accepted = [
  {
    recordId: 'r1',
    gapFamily: 'medicaid_hhs_offices',
    stateId: 'california',
    countyId: 'nevada',
    authority: 'official_county',
    agency: 'Nevada County Health and Human Services',
    provenanceUrl: 'https://example.org/ihss',
    sourceRole: 'county_ihss_leaf_candidate',
    sourceUrl: 'https://example.org/ihss',
    finalUrl: 'https://example.org/ihss',
    artifactPath: 'data/source-acquisition-runs/run-a/raw/a.html',
    sha256: 'abc',
    fetchedAt: '2026-06-27T00:00:00Z',
    pageTitle: 'In-Home Supportive Services (IHSS)',
    h1s: ['In-Home Supportive Services (IHSS)'],
    h2s: ['How to Apply for IHSS:'],
    paragraphs: ['To apply for IHSS call (530) 265-1639.'],
    textSample: 'To apply for IHSS call (530) 265-1639.',
    phones: ['(530) 265-1639'],
    emails: [],
    addressLines: ['950 Maidu Ave, Nevada City, CA 95959'],
    links: [],
  },
];
fs.writeFileSync(path.join(familyDir, 'accepted.ndjson'), `${accepted.map((row) => JSON.stringify(row)).join('\n')}\n`);

const result = spawnSync(process.execPath, [
  path.join(repoRoot, 'scripts', 'run-ca-county-office-semantic-lift-v1.mjs'),
  '--run-ids=run-a',
  `--runs-dir=${runsDir}`,
  `--output-dir=${outputDir}`,
  '--output-prefix=test_ca_county_office',
], {
  cwd: repoRoot,
  encoding: 'utf8',
});

assert.equal(result.status, 0, result.stderr || result.stdout);
const summary = JSON.parse(fs.readFileSync(path.join(outputDir, 'test_ca_county_office_summary.json'), 'utf8'));
assert.equal(summary.stageReadyCount, 1);
const stageReady = fs.readFileSync(path.join(outputDir, 'test_ca_county_office_stage_ready.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
assert.equal(stageReady[0].classificationReason, 'local_office_contact_signals_present');
assert.equal(stageReady[0].requiredFieldCompleteness, 1);

console.log('test-ca-county-office-semantic-lift-v1: ok');
