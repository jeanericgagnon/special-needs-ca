import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const generatedDate = new Date().toISOString().slice(0, 10);

function makeTempRepo(name) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  fs.mkdirSync(path.join(root, 'docs', 'generated'), { recursive: true });
  fs.mkdirSync(path.join(root, 'data', 'source-acquisition-runs', 'run-1', 'pages'), { recursive: true });
  return root;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function runNode(scriptRelativePath, { cwd, env = {}, args = [] }) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, scriptRelativePath), ...args], {
    cwd,
    env: {
      ...process.env,
      ...env,
    },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return JSON.parse(result.stdout.trim());
}

const root = makeTempRepo('provider-repair-authoring-brief');
fs.writeFileSync(
  path.join(root, 'data', 'source-acquisition-runs', 'run-1', 'pages', 'upmc-404.html'),
  `
  <html>
    <head><title>Page Not Found | Test</title></head>
    <body>
      <a href="/our-services">Our Services</a>
      <a href="/locations/specialty-care-centers">Specialty Care Centers</a>
      <a href="/contact-us">Contact Us</a>
    </body>
  </html>
  `
);

writeJson(path.join(root, 'docs', 'generated', `provider-repair-batch-packet-author-targets-first-pennsylvania-${generatedDate}.json`), {
  selection: {
    stateId: 'pennsylvania',
  },
  selectedRows: [
    {
      stateId: 'pennsylvania',
      actionClass: 'replace_exact_url',
      followupReason: 'stale_or_invalid_404',
      sourceUrl: 'https://www.chp.edu/our-services/developmental-pediatrics',
      hostname: 'www.chp.edu',
      repeatCount: 3,
      topSavedPath: 'data/source-acquisition-runs/run-1/pages/upmc-404.html',
    },
  ],
});

const output = runNode('src/db/generate_provider_repair_authoring_brief.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--state=pennsylvania'],
});

assert.equal(output.summary.unresolvedRows, 1);
assert.equal(output.summary.rowsWithCandidateHints, 1);

const payload = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'generated', `provider-repair-authoring-brief-pennsylvania-${generatedDate}.json`), 'utf8'));
assert.equal(payload.rows[0].savedEvidenceStatus, 'page_not_found');
assert.ok(payload.rows[0].candidateHints.some((hint) => hint.includes('/our-services')));

console.log('provider repair authoring brief tests passed');
