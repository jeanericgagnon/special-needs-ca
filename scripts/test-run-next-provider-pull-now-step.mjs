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

function seedPackage(root) {
  fs.writeFileSync(path.join(root, 'package.json'), `${JSON.stringify({
    name: 'fixture',
    private: true,
    type: 'module',
    scripts: {
      'fix:provider-pull-now-decision-file': `node ${JSON.stringify(path.join(repoRoot, 'scripts', 'sync-provider-pull-now-decision-file.mjs'))}`,
      'fix:provider-pull-now-prune-stale': `node ${JSON.stringify(path.join(repoRoot, 'scripts', 'prune-provider-pull-now-decisions.mjs'))} --apply`,
      'audit:low-token-control-plane': `node ${JSON.stringify(path.join(repoRoot, 'src', 'db', 'generate_low_token_control_plane_audit.js'))}`,
    },
  }, null, 2)}\n`);
}

function seedMinimalAuditInputs(root) {
  writeJson(path.join(root, 'docs', 'generated', `official-domain-followup-queue-${generatedDate}.json`), {
    summary: { totalRows: 0, byState: {} },
    rows: [],
  });
  writeJson(path.join(root, 'data', 'official-domain-followup-decisions.json'), { rows: [] });
  writeJson(path.join(root, 'docs', 'generated', `provider-followup-repair-queue-${generatedDate}.json`), {
    summary: { totalRows: 2 },
    rows: [
      { stateId: 'tennessee', sourceUrl: 'https://www.lebonheur.org/', readinessLane: 'pull-now', actionClass: 'replace_domain', followupReason: 'dns_lookup_failed', repeatCount: 2, hostname: 'www.lebonheur.org', recommendedAction: 'Replace.' },
      { stateId: 'indiana', sourceUrl: 'https://www.rileychildrens.org/', readinessLane: 'pull-now', actionClass: 'bounded_retry_then_replace', followupReason: 'network_timeout', repeatCount: 2, hostname: 'www.rileychildrens.org', recommendedAction: 'Retry once.' },
    ],
  });
  writeJson(path.join(root, 'docs', 'generated', `provider-repair-execution-backlog-${generatedDate}.json`), {
    summary: { totalRows: 2, firstExecutionLane: 'pull-now' },
  });
  writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-runbook-${generatedDate}.json`), {
    summary: { pullNowRowCount: 2, pullNowStateCount: 2, firstActionClass: 'replace_domain' },
    stateSlices: [{ stateId: 'tennessee', rowCount: 1 }, { stateId: 'indiana', rowCount: 1 }],
  });
  writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-decision-template-${generatedDate}.json`), {
    rows: [
      { stateId: 'tennessee', sourceUrl: 'https://www.lebonheur.org/', decisionMode: '', reviewedBy: '' },
      { stateId: 'indiana', sourceUrl: 'https://www.rileychildrens.org/', decisionMode: '', reviewedBy: '' },
    ],
  });
  writeJson(path.join(root, 'docs', 'generated', `forms-fallback-scrape-queue-${generatedDate}.json`), {
    summary: { totalQueueRows: 0, excludedFederalOnlyStates: [] },
    rows: [],
  });
  writeJson(path.join(root, 'docs', 'generated', `forms-fallback-manual-review-queue-${generatedDate}.json`), {
    summary: { totalRows: 0, byState: {}, byFailureReason: {} },
    rows: [],
  });
  writeJson(path.join(root, 'docs', 'generated', `forms-fallback-manual-review-decision-template-${generatedDate}.json`), { rows: [] });
  writeJson(path.join(root, 'data', 'forms-fallback-manual-review-decisions.json'), { rows: [] });
  writeJson(path.join(root, 'data', 'source-acquisition-state', 'forms-fallback-manual-review-ledger.json'), { rows: [] });
  writeJson(path.join(root, 'docs', 'generated', `forms-fallback-state-ledger-${generatedDate}.json`), {
    summary: { totalStates: 0, byStatus: {}, nextState: '' },
    rows: [],
  });
  writeJson(path.join(root, 'docs', 'generated', `provider-followup-blocker-registry-${generatedDate}.json`), {
    summary: { totalRepeatedRows: 0, byBucket: {}, byReason: {}, latestRunIds: [] },
    rows: [],
  });
  fs.writeFileSync(path.join(root, 'stub-regression.mjs'), 'console.log("stub regression ok");\n');
}

function testSyncModeWhenDecisionFileIsEmpty() {
  const root = makeTempRepo('provider-next-step-sync');
  seedPackage(root);
  seedMinimalAuditInputs(root);
  runNode('src/db/generate_low_token_control_plane_audit.js', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root, ABLEFULL_REGRESSION_SCRIPT: path.join(root, 'stub-regression.mjs') },
  });

  const output = runNode('scripts/run-next-provider-pull-now-step.mjs', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root, ABLEFULL_REGRESSION_SCRIPT: path.join(root, 'stub-regression.mjs') },
  });

  assert.equal(output.mode, 'sync');
  assert.equal(output.command, 'npm run fix:provider-pull-now-decision-file');
  const active = readJson(path.join(root, 'data', 'provider-pull-now-decisions.json'));
  assert.equal(active.rows.length, 2);
  assert.equal(output.refreshedControlPlane.providerPullNow.activeDecisionRows, 2);
}

function testAwaitingReviewedDecisionsModeWhenRowsExistButAreBlank() {
  const root = makeTempRepo('provider-next-step-awaiting');
  seedPackage(root);
  seedMinimalAuditInputs(root);
  writeJson(path.join(root, 'data', 'provider-pull-now-decisions.json'), {
    rows: [
      { stateId: 'tennessee', sourceUrl: 'https://www.lebonheur.org/', decisionMode: '', reviewedBy: '' },
    ],
  });
  runNode('src/db/generate_low_token_control_plane_audit.js', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root, ABLEFULL_REGRESSION_SCRIPT: path.join(root, 'stub-regression.mjs') },
  });

  const output = runNode('scripts/run-next-provider-pull-now-step.mjs', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root, ABLEFULL_REGRESSION_SCRIPT: path.join(root, 'stub-regression.mjs') },
  });

  assert.equal(output.mode, 'awaiting_reviewed_decisions');
  assert.equal(output.providerLane.status, 'needs_followup');
}

function testPruneModeWhenOnlyStaleRowsRemain() {
  const root = makeTempRepo('provider-next-step-prune-stale');
  seedPackage(root);
  seedMinimalAuditInputs(root);
  writeJson(path.join(root, 'data', 'provider-pull-now-decisions.json'), {
    rows: [
      { stateId: 'stale', sourceUrl: 'https://example.com/stale', decisionMode: 'needs_manual_research', reviewedBy: 'tester' },
    ],
  });
  runNode('src/db/generate_provider_pull_now_decision_progress.js', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root },
  });
  runNode('src/db/generate_low_token_control_plane_audit.js', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root, ABLEFULL_REGRESSION_SCRIPT: path.join(root, 'stub-regression.mjs') },
  });

  const output = runNode('scripts/run-next-provider-pull-now-step.mjs', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root, ABLEFULL_REGRESSION_SCRIPT: path.join(root, 'stub-regression.mjs') },
  });

  assert.equal(output.mode, 'prune_stale');
  assert.equal(output.command, 'npm run fix:provider-pull-now-prune-stale');
  const active = readJson(path.join(root, 'data', 'provider-pull-now-decisions.json'));
  assert.equal(active.rows.length, 0);
}

testSyncModeWhenDecisionFileIsEmpty();
testAwaitingReviewedDecisionsModeWhenRowsExistButAreBlank();
testPruneModeWhenOnlyStaleRowsRemain();

console.log('run next provider pull-now step tests passed');
