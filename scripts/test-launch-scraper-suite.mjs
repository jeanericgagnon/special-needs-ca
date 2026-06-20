import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const auditResult = spawnSync(process.execPath, ['scripts/run-launch-scraper-suite.mjs', 'audit'], {
  cwd: repoRoot,
  encoding: 'utf8',
});

assert.equal(auditResult.status, 0, `audit suite failed\nSTDOUT:\n${auditResult.stdout}\nSTDERR:\n${auditResult.stderr}`);
assert.match(auditResult.stdout, /launch scraper suite audit passed/);

const testResult = spawnSync(process.execPath, ['scripts/run-launch-scraper-suite.mjs', 'test'], {
  cwd: repoRoot,
  encoding: 'utf8',
});

assert.equal(testResult.status, 0, `test suite failed\nSTDOUT:\n${testResult.stdout}\nSTDERR:\n${testResult.stderr}`);
assert.match(testResult.stdout, /launch scraper suite test passed/);

console.log('launch scraper suite tests passed');
