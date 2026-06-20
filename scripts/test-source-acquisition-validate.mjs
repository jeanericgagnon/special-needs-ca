import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function testValidateWaitsForRequestedFamilyRecords() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-race-'));
  const runId = 'run-1';
  const parsedRoot = path.join(fixtureRoot, 'data', 'source-acquisition-runs', runId, 'parsed');
  fs.mkdirSync(parsedRoot, { recursive: true });

  const validate = spawn(
    process.execPath,
    [path.join(repoRoot, 'scripts', 'run-source-acquisition-validate.mjs'), `--run-id=${runId}`, '--family=providers_care'],
    { cwd: fixtureRoot, stdio: ['ignore', 'pipe', 'pipe'] },
  );

  let stdout = '';
  let stderr = '';
  validate.stdout.on('data', (chunk) => {
    stdout += chunk;
  });
  validate.stderr.on('data', (chunk) => {
    stderr += chunk;
  });

  await delay(250);

  const familyDir = path.join(parsedRoot, 'providers_care');
  fs.mkdirSync(familyDir, { recursive: true });
  fs.writeFileSync(
    path.join(familyDir, 'records.ndjson'),
    `${JSON.stringify({
      recordId: 'provider-1',
      gapFamily: 'providers_care',
      stateId: 'texas',
      sourceUrl: 'https://example.org/provider',
      finalUrl: 'https://example.org/provider',
      pageTitle: 'Example Provider',
      h1s: ['Example Provider'],
      familyExtraction: {
        organizationName: 'Example Provider',
        contactPhone: '(512) 555-0100',
        contactAddress: '100 Main St, Austin, TX 78701',
        publicContactSignalCount: 2,
      },
      phones: ['(512) 555-0100'],
      emails: [],
      addressLines: ['100 Main St, Austin, TX 78701'],
    })}\n`,
  );

  const exitCode = await new Promise((resolve) => validate.on('close', resolve));
  assert.equal(exitCode, 0, stderr);
  const jsonStart = stdout.indexOf('{');
  const output = JSON.parse(stdout.slice(jsonStart));
  assert.equal(output.familyCount, 1);
  assert.equal(output.families[0].family, 'providers_care');
  assert.equal(output.families[0].parsedCount, 1);
  assert.equal(output.families[0].acceptedCount + output.families[0].rejectedCount, 1);
}

async function testValidateWaitsForParsedRootCreation() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-root-race-'));
  const runId = 'run-2';

  const validate = spawn(
    process.execPath,
    [path.join(repoRoot, 'scripts', 'run-source-acquisition-validate.mjs'), `--run-id=${runId}`, '--family=providers_care'],
    { cwd: fixtureRoot, stdio: ['ignore', 'pipe', 'pipe'] },
  );

  let stdout = '';
  let stderr = '';
  validate.stdout.on('data', (chunk) => {
    stdout += chunk;
  });
  validate.stderr.on('data', (chunk) => {
    stderr += chunk;
  });

  await delay(250);

  const parsedRoot = path.join(fixtureRoot, 'data', 'source-acquisition-runs', runId, 'parsed');
  const familyDir = path.join(parsedRoot, 'providers_care');
  fs.mkdirSync(familyDir, { recursive: true });
  fs.writeFileSync(
    path.join(familyDir, 'records.ndjson'),
    `${JSON.stringify({
      recordId: 'provider-2',
      gapFamily: 'providers_care',
      stateId: 'texas',
      sourceUrl: 'https://example.org/provider-2',
      finalUrl: 'https://example.org/provider-2',
      pageTitle: 'Example Provider Two',
      h1s: ['Example Provider Two'],
      familyExtraction: {
        organizationName: 'Example Provider Two',
        contactPhone: '(512) 555-0200',
        contactAddress: '200 Main St, Austin, TX 78701',
        publicContactSignalCount: 2,
      },
      phones: ['(512) 555-0200'],
      emails: [],
      addressLines: ['200 Main St, Austin, TX 78701'],
    })}\n`,
  );

  const exitCode = await new Promise((resolve) => validate.on('close', resolve));
  assert.equal(exitCode, 0, stderr);
  const jsonStart = stdout.indexOf('{');
  const output = JSON.parse(stdout.slice(jsonStart));
  assert.equal(output.familyCount, 1);
  assert.equal(output.families[0].family, 'providers_care');
  assert.equal(output.families[0].parsedCount, 1);
}

await testValidateWaitsForRequestedFamilyRecords();
await testValidateWaitsForParsedRootCreation();

console.log('source acquisition validate tests passed');
