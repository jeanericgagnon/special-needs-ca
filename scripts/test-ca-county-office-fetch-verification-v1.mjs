import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ca-county-office-verify-'));

const rows = [
  {
    entity_id: 'nevada-row',
    evidence_title: 'In-Home Supportive Services (IHSS) | Nevada County, CA',
    evidence_h1: 'In-Home Supportive Services (IHSS)',
    text_sample: 'How to apply for IHSS call (530) 265-1639. 950 Maidu Ave Nevada City, CA.',
  },
  {
    entity_id: 'stanislaus-row',
    evidence_title: 'IHSS Advisory Committee',
    evidence_h1: '',
    text_sample: 'IHSS Advisory Committee members are appointed by the Board of Supervisors.',
  },
];

fs.writeFileSync(
  path.join(tmp, 'ca_scrape_results_v1.jsonl'),
  `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`,
);

const result = spawnSync(process.execPath, [
  path.join(repoRoot, 'scripts', 'run-ca-county-office-fetch-verification-v1.mjs'),
  `--input-dir=${tmp}`,
  `--output-dir=${tmp}`,
], {
  cwd: repoRoot,
  encoding: 'utf8',
});

assert.equal(result.status, 0, result.stderr || result.stdout);

const output = fs.readFileSync(path.join(tmp, 'ca_county_office_fetch_verification_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .map((line) => JSON.parse(line));

assert.equal(output[0].verification_status, 'verified_exact_county_office_leaf');
assert.equal(output[1].verification_status, 'rejected_non_office_leaf');

console.log('test-ca-county-office-fetch-verification-v1: ok');
