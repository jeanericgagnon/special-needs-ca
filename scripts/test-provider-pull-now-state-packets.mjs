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

const root = makeTempRepo('provider-state-packets');
writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-review-packet-${generatedDate}.json`), {
  statePackets: [
    {
      stateId: 'tennessee',
      unresolvedRows: 2,
      byActionClass: { replace_domain: 1, author_alternate_first_party_target: 1 },
      byDecisionHint: { needs_manual_research: 2 },
      topConcreteTargets: [{ sourceName: 'Le Bonheur', sourceUrl: 'https://www.lebonheur.org/' }],
      rows: [
        { actionClass: 'replace_domain', decisionHint: 'needs_manual_research', repeatCount: 2, sourceUrl: 'https://a.example' },
        { actionClass: 'author_alternate_first_party_target', decisionHint: 'needs_manual_research', repeatCount: 1, sourceUrl: 'https://b.example' },
      ],
    },
    {
      stateId: 'indiana',
      unresolvedRows: 1,
      byActionClass: { bounded_retry_then_replace: 1 },
      byDecisionHint: { bounded_retry_once: 1 },
      topConcreteTargets: [{ sourceName: 'Riley', sourceUrl: 'https://www.rileychildrens.org/' }],
      rows: [
        { actionClass: 'bounded_retry_then_replace', decisionHint: 'bounded_retry_once', repeatCount: 4, sourceUrl: 'https://c.example' },
      ],
    },
  ],
});

const output = runNode('src/db/generate_provider_pull_now_state_packets.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(output.statePacketCount, 2);

const index = readJson(path.join(root, 'docs', 'generated', `provider-pull-now-state-packets-${generatedDate}.json`));
assert.equal(index.summary.statePacketCount, 2);
assert.equal(index.summary.firstState, 'tennessee');
assert.ok(fs.existsSync(path.join(root, index.packets[0].jsonPath)));

console.log('provider pull-now state packets tests passed');
