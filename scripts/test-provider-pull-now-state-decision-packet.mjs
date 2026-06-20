import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const generatedDate = new Date().toISOString().slice(0, 10);

function makeTempRepo(name) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  fs.mkdirSync(path.join(root, 'docs', 'generated', 'provider-pull-now-state-packets'), { recursive: true });
  fs.mkdirSync(path.join(root, 'data'), { recursive: true });
  return root;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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

function testGeneratesPacketForFirstUnresolvedState() {
  const root = makeTempRepo('provider-state-decision-packet');
  writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-state-packets-${generatedDate}.json`), {
    packets: [
      {
        stateId: 'tennessee',
        unresolvedRows: 2,
        jsonPath: `docs/generated/provider-pull-now-state-packets/provider-pull-now-state-packet-tennessee-${generatedDate}.json`,
      },
      {
        stateId: 'indiana',
        unresolvedRows: 1,
        jsonPath: `docs/generated/provider-pull-now-state-packets/provider-pull-now-state-packet-indiana-${generatedDate}.json`,
      },
    ],
  });
  writeJson(path.join(root, 'docs', 'generated', 'provider-pull-now-state-packets', `provider-pull-now-state-packet-tennessee-${generatedDate}.json`), {
    stateId: 'tennessee',
    topConcreteTargets: [{ sourceName: 'Le Bonheur', sourceUrl: 'https://www.lebonheur.org/' }],
    rows: [
      {
        actionClass: 'author_alternate_first_party_target',
        followupReason: 'access_blocked_403',
        sourceUrl: 'https://www.dollychildrens.org/',
        hostname: 'www.dollychildrens.org',
        repeatCount: 12,
        sameDomainCandidateCount: 0,
        sameDomainCandidates: [],
      },
      {
        actionClass: 'replace_domain',
        followupReason: 'dns_lookup_failed',
        sourceUrl: 'https://www.lebonheur.org/',
        hostname: 'www.lebonheur.org',
        repeatCount: 2,
        sameDomainCandidateCount: 1,
        sameDomainCandidates: [{ sourceName: 'Le Bonheur', sourceUrl: 'https://www.lebonheur.org/' }],
      },
    ],
  });
  writeJson(path.join(root, 'docs', 'generated', 'provider-pull-now-state-packets', `provider-pull-now-state-packet-indiana-${generatedDate}.json`), {
    stateId: 'indiana',
    rows: [],
  });
  writeJson(path.join(root, 'data', 'provider-pull-now-decisions.json'), {
    rows: [
      { stateId: 'tennessee', sourceUrl: 'https://www.dollychildrens.org/', decisionMode: '', reviewedBy: '' },
      { stateId: 'tennessee', sourceUrl: 'https://www.lebonheur.org/', decisionMode: '', reviewedBy: '' },
      { stateId: 'indiana', sourceUrl: 'https://www.rileychildrens.org/', decisionMode: 'bounded_retry_once', reviewedBy: 'op' },
    ],
  });

  const output = runNode('src/db/generate_provider_pull_now_state_decision_packet.js', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root },
  });

  assert.equal(output.stateId, 'tennessee');
  assert.equal(output.summary.unresolvedRows, 2);
  const payload = readJson(output.json);
  assert.equal(payload.rows[0].suggestedDecisionMode, 'needs_manual_research');
  assert.equal(payload.rows[1].suggestedDecisionMode, 'needs_manual_research');
  assert.equal(payload.rows[0].currentDecision.decisionMode, '');
}

function testHonorsStateFilter() {
  const root = makeTempRepo('provider-state-decision-packet-filter');
  writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-state-packets-${generatedDate}.json`), {
    packets: [
      {
        stateId: 'indiana',
        unresolvedRows: 1,
        jsonPath: `docs/generated/provider-pull-now-state-packets/provider-pull-now-state-packet-indiana-${generatedDate}.json`,
      },
    ],
  });
  writeJson(path.join(root, 'docs', 'generated', 'provider-pull-now-state-packets', `provider-pull-now-state-packet-indiana-${generatedDate}.json`), {
    stateId: 'indiana',
    rows: [
      {
        actionClass: 'bounded_retry_then_replace',
        followupReason: 'network_timeout',
        sourceUrl: 'https://www.rileychildrens.org/',
        hostname: 'www.rileychildrens.org',
        repeatCount: 4,
        sameDomainCandidateCount: 0,
        sameDomainCandidates: [],
      },
    ],
  });
  writeJson(path.join(root, 'data', 'provider-pull-now-decisions.json'), {
    rows: [
      { stateId: 'indiana', sourceUrl: 'https://www.rileychildrens.org/', decisionMode: '', reviewedBy: '' },
    ],
  });

  const output = runNode('src/db/generate_provider_pull_now_state_decision_packet.js', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root },
    args: ['--state=indiana'],
  });

  assert.equal(output.stateId, 'indiana');
  const payload = readJson(output.json);
  assert.equal(payload.rows[0].suggestedDecisionMode, 'bounded_retry_once');
}

testGeneratesPacketForFirstUnresolvedState();
testHonorsStateFilter();

console.log('provider pull-now state decision packet tests passed');
