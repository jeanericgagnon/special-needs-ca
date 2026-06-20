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
      'fix:provider-pull-now-state-workfile': `node ${JSON.stringify(path.join(repoRoot, 'scripts', 'sync-provider-pull-now-state-workfile.mjs'))}`,
      'audit:low-token-control-plane': `node ${JSON.stringify(path.join(repoRoot, 'src', 'db', 'generate_low_token_control_plane_audit.js'))}`,
      'audit:provider-pull-now-state-decision-packet': `node ${JSON.stringify(path.join(repoRoot, 'src', 'db', 'generate_provider_pull_now_state_decision_packet.js'))}`,
      'audit:provider-pull-now-state-workfile-status': `node ${JSON.stringify(path.join(repoRoot, 'src', 'db', 'generate_provider_pull_now_state_workfile_status.js'))}`,
      'audit:provider-pull-now-state-workfile-validation': `node ${JSON.stringify(path.join(repoRoot, 'src', 'db', 'generate_provider_pull_now_state_workfile_validation.js'))}`,
      'audit:provider-pull-now-state-review-loop': `node ${JSON.stringify(path.join(repoRoot, 'src', 'db', 'generate_provider_pull_now_state_review_loop.js'))}`,
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
  writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-manual-fill-queue-${generatedDate}.json`), {
    summary: { unresolvedRows: 2, byState: { tennessee: 1, indiana: 1 } },
    rows: [],
  });
  writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-decision-progress-${generatedDate}.json`), {
    summary: { totalRows: 2, filledRows: 0, unresolvedRows: 2, completionPercent: 0 },
  });
  writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-review-packet-${generatedDate}.json`), {
    summary: { statePacketCount: 2, firstState: 'tennessee' },
  });
  writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-state-packets-${generatedDate}.json`), {
    summary: { statePacketCount: 2, totalUnresolvedRows: 2, firstState: 'tennessee' },
    packets: [
      {
        stateId: 'tennessee',
        unresolvedRows: 1,
        jsonPath: `docs/generated/provider-pull-now-state-packets/provider-pull-now-state-packet-tennessee-${generatedDate}.json`,
        markdownPath: `docs/generated/provider-pull-now-state-packets/provider-pull-now-state-packet-tennessee-${generatedDate}.md`,
      },
      {
        stateId: 'indiana',
        unresolvedRows: 1,
        jsonPath: `docs/generated/provider-pull-now-state-packets/provider-pull-now-state-packet-indiana-${generatedDate}.json`,
        markdownPath: `docs/generated/provider-pull-now-state-packets/provider-pull-now-state-packet-indiana-${generatedDate}.md`,
      },
    ],
  });
  writeJson(path.join(root, 'docs', 'generated', 'provider-pull-now-state-packets', `provider-pull-now-state-packet-tennessee-${generatedDate}.json`), {
    stateId: 'tennessee',
    rows: [{ actionClass: 'replace_domain' }],
    topConcreteTargets: [{ sourceName: 'Le Bonheur', sourceUrl: 'https://www.lebonheur.org/' }],
  });
  writeJson(path.join(root, 'docs', 'generated', 'provider-pull-now-state-packets', `provider-pull-now-state-packet-indiana-${generatedDate}.json`), {
    stateId: 'indiana',
    rows: [{ actionClass: 'bounded_retry_then_replace' }],
    topConcreteTargets: [{ sourceName: 'Riley', sourceUrl: 'https://www.rileychildrens.org/' }],
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

function testSyncAndReviewMode() {
  const root = makeTempRepo('provider-state-packet-sync');
  seedPackage(root);
  seedMinimalAuditInputs(root);
  runNode('src/db/generate_low_token_control_plane_audit.js', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root, ABLEFULL_REGRESSION_SCRIPT: path.join(root, 'stub-regression.mjs') },
  });

  const output = runNode('scripts/run-next-provider-pull-now-state-packet.mjs', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root, ABLEFULL_REGRESSION_SCRIPT: path.join(root, 'stub-regression.mjs') },
  });

  assert.equal(output.mode, 'sync_and_review_state_packet');
  assert.equal(output.nextState, 'tennessee');
  assert.equal(output.statePacketUnresolvedRows, 1);
  assert.equal(output.unresolvedDecisionRowsForState, 1);
  assert.ok(output.stateDecisionPacketPath.includes('provider-pull-now-state-decision-packet-tennessee-'));
  assert.ok(output.stateWorkfilePath.includes('provider-pull-now-state-workfile-tennessee.json'));
  assert.ok(output.stateWorkfileStatusPath.includes('provider-pull-now-state-workfile-status-tennessee-'));
  assert.ok(output.stateWorkfileValidationPath.includes('provider-pull-now-state-workfile-validation-tennessee-'));
  assert.ok(output.stateReviewLoopPath.includes('provider-pull-now-state-review-loop-tennessee-'));
}

function testSelectsFirstStateWithOutstandingDecisionRows() {
  const root = makeTempRepo('provider-state-packet-review');
  seedPackage(root);
  seedMinimalAuditInputs(root);
  writeJson(path.join(root, 'data', 'provider-pull-now-decisions.json'), {
    rows: [
      { stateId: 'tennessee', sourceUrl: 'https://www.lebonheur.org/', decisionMode: 'replace_with_reviewed_first_party_target', reviewedBy: 'op' },
      { stateId: 'indiana', sourceUrl: 'https://www.rileychildrens.org/', decisionMode: '', reviewedBy: '' },
    ],
  });
  runNode('src/db/generate_low_token_control_plane_audit.js', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root, ABLEFULL_REGRESSION_SCRIPT: path.join(root, 'stub-regression.mjs') },
  });

  const output = runNode('scripts/run-next-provider-pull-now-state-packet.mjs', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root, ABLEFULL_REGRESSION_SCRIPT: path.join(root, 'stub-regression.mjs') },
  });

  assert.equal(output.mode, 'review_state_packet');
  assert.equal(output.nextState, 'indiana');
  assert.equal(output.firstActionClass, 'bounded_retry_then_replace');
  assert.equal(output.unresolvedDecisionRowsForState, 1);
  assert.ok(output.stateDecisionPacketPath.includes('provider-pull-now-state-decision-packet-indiana-'));
  assert.ok(output.stateWorkfilePath.includes('provider-pull-now-state-workfile-indiana.json'));
  assert.ok(output.stateWorkfileStatusPath.includes('provider-pull-now-state-workfile-status-indiana-'));
  assert.ok(output.stateWorkfileValidationPath.includes('provider-pull-now-state-workfile-validation-indiana-'));
  assert.ok(output.stateReviewLoopPath.includes('provider-pull-now-state-review-loop-indiana-'));
}

testSyncAndReviewMode();
testSelectsFirstStateWithOutstandingDecisionRows();

console.log('run next provider pull-now state packet tests passed');
