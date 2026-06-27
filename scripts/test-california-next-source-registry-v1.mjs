import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ca-next-source-registry-'));

const generatedDataDir = path.join(tmp, 'data', 'generated');
const generatedDocsDir = path.join(tmp, 'docs', 'generated');
fs.mkdirSync(generatedDataDir, { recursive: true });
fs.mkdirSync(generatedDocsDir, { recursive: true });

const result = spawnSync(
  process.execPath,
  [path.join(repoRoot, 'scripts', 'generate-california-next-source-registry-v1.mjs')],
  {
    cwd: tmp,
    encoding: 'utf8',
  },
);

assert.equal(result.status, 0, result.stderr);

const registryPath = path.join(generatedDataDir, 'california-next-source-registry-v1.json');
const markdownPath = path.join(generatedDocsDir, 'california-next-source-registry-v1.md');
assert.ok(fs.existsSync(registryPath), 'registry json should be written');
assert.ok(fs.existsSync(markdownPath), 'registry markdown should be written');

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

assert.equal(registry.state, 'california');
assert.equal(registry.sourceFamilies.length, 10);
assert.ok(registry.seedEntries.length >= 16, 'expected multiple exact seed entries');
assert.deepEqual(registry.summary.duplicateUrlCount, 0);
assert.equal(registry.summary.seedReadyCount, registry.seedEntries.length);
assert.equal(registry.summary.needsReviewCount, 0);

for (const family of ['ihss', 'selpa', 'ccs_mtu', 'dhcs_epsdt', 'ssi', 'calable', 'frcnca', 'pti_cprc', 'help_me_grow', 'local_nonprofits']) {
  assert.ok(registry.sourceFamilies.some((entry) => entry.family === family), `missing family ${family}`);
  assert.ok(registry.seedEntries.some((entry) => entry.family === family), `missing seed entry for ${family}`);
}

for (const entry of registry.seedEntries) {
  assert.equal(entry.validationStatus, 'seed_ready', `${entry.label} should be seed_ready`);
  assert.ok(entry.sourceUrl.startsWith('https://'), `${entry.label} should use https`);
  assert.ok(Array.isArray(entry.requiredValidationChecks) && entry.requiredValidationChecks.includes('display_eligibility'));

  if (entry.authority.startsWith('official_')) {
    assert.match(entry.normalizedDomain, /(\.gov|\.ca\.gov)$/);
  }
}

const markdown = fs.readFileSync(markdownPath, 'utf8');
assert.match(markdown, /## Validation Checks/);
assert.match(markdown, /## Seed Entries/);
assert.match(markdown, /CDSS County IHSS Offices Directory/);

console.log('california next-source registry tests passed');
