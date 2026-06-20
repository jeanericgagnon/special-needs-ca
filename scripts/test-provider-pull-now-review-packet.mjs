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
  return root;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function runNode(scriptRelativePath, { cwd, env = {} }) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, scriptRelativePath)], {
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

const root = makeTempRepo('provider-review-packet');
writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-manual-fill-queue-${generatedDate}.json`), {
  rows: [
    { stateId: 'tennessee', actionClass: 'replace_domain', decisionHint: 'needs_manual_research', repeatCount: 5, sourceUrl: 'https://a.example', topConcreteTargets: [{ sourceName: 'A', sourceUrl: 'https://a2.example' }] },
    { stateId: 'tennessee', actionClass: 'author_alternate_first_party_target', decisionHint: 'needs_manual_research', repeatCount: 2, sourceUrl: 'https://b.example', topConcreteTargets: [{ sourceName: 'A', sourceUrl: 'https://a2.example' }] },
    { stateId: 'indiana', actionClass: 'bounded_retry_then_replace', decisionHint: 'bounded_retry_once', repeatCount: 4, sourceUrl: 'https://c.example', topConcreteTargets: [{ sourceName: 'C', sourceUrl: 'https://c2.example' }] },
  ],
});
writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-decision-progress-${generatedDate}.json`), {
  summary: { unresolvedRows: 3, filledRows: 1, completionPercent: 25 },
});

const output = runNode('src/db/generate_provider_pull_now_review_packet.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(output.statePacketCount, 2);
assert.equal(output.unresolvedRows, 3);

const payload = readJson(path.join(root, 'docs', 'generated', `provider-pull-now-review-packet-${generatedDate}.json`));
assert.equal(payload.summary.firstState, 'tennessee');
assert.equal(payload.statePackets[0].stateId, 'tennessee');
assert.equal(payload.statePackets[0].unresolvedRows, 2);

console.log('provider pull-now review packet tests passed');
