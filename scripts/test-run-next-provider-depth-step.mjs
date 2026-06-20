import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import Database from 'better-sqlite3';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const generatedDate = new Date().toISOString().slice(0, 10);

function makeTempRepo(name) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  fs.mkdirSync(path.join(root, 'docs', 'generated'), { recursive: true });
  fs.mkdirSync(path.join(root, 'data', 'source-acquisition-state'), { recursive: true });
  return root;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function runNode(scriptRelativePath, { cwd, env = {} }) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, scriptRelativePath)], {
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return JSON.parse(result.stdout.trim());
}

const root = makeTempRepo('run-next-provider-depth-step');
const rootDb = new Database(path.join(root, 'ca_disability_navigator.db'));
rootDb.exec(`
  CREATE TABLE staging_scraped_resource_providers (
    state_id TEXT,
    source_url TEXT,
    source_type TEXT
  );
`);
rootDb.prepare(`
  INSERT INTO staging_scraped_resource_providers (state_id, source_url, source_type)
  VALUES (?, ?, ?)
`).run('california', 'https://health.ucdavis.edu/mind-institute', 'lightweight_source_acquisition');
rootDb.close();

writeJson(path.join(root, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [
    { stateId: 'indiana' },
    { stateId: 'california' },
  ],
});

writeJson(path.join(root, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`), {
  combinedReadyRows: [
    {
      gapFamily: 'providers_care',
      executionLane: 'ready_target_scrape',
      ledgerStatus: 'ready_lightweight',
      stateId: 'california',
      sourceUrl: 'https://health.ucdavis.edu/mind-institute',
      crawlMethod: 'static_fetch',
    },
    {
      gapFamily: 'providers_care',
      executionLane: 'ready_target_scrape',
      ledgerStatus: 'ready_lightweight',
      stateId: 'indiana',
      sourceUrl: 'https://iuhealth.org/',
      crawlMethod: 'static_fetch',
    },
    {
      gapFamily: 'providers_care',
      executionLane: 'ready_target_scrape',
      ledgerStatus: 'ready_lightweight',
      stateId: 'california',
      sourceUrl: 'https://health.ucdavis.edu/mindinstitute',
      crawlMethod: 'static_fetch',
    },
  ],
});

writeJson(path.join(root, 'data', 'source-acquisition-state', 'provider-pull-now-resolution-ledger.json'), {
  rows: [
    { stateId: 'indiana', sourceUrl: 'https://iuhealth.org/', status: 'deferred_manual_research' },
  ],
});

writeJson(path.join(root, 'docs', 'generated', `provider-followup-repair-queue-${generatedDate}.json`), {
  rows: [
    {
      stateId: 'maryland',
      sourceUrl: 'https://www.hopkinsmedicine.org/johns-hopkins-childrens-center',
      readinessLane: 'author-targets-first',
      actionClass: 'author_alternate_first_party_target',
      followupReason: 'access_blocked_403',
      repeatCount: 5,
      recommendedAction: 'Author an alternate first-party provider target on the same organization.',
    },
  ],
});

const output = runNode('scripts/run-next-provider-depth-step.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});

assert.equal(output.mode, 'provider_repair_next_step');
assert.equal(output.selectedTarget.stateId, 'maryland');
assert.equal(output.selectedTarget.actionClass, 'author_alternate_first_party_target');
assert.ok(output.commands.includes('npm run run:next-provider-repair-batch'));

const stagedSkipRoot = makeTempRepo('run-next-provider-depth-step-staged-skip');
const stagedSkipDb = new Database(path.join(stagedSkipRoot, 'ca_disability_navigator.db'));
stagedSkipDb.exec(`
  CREATE TABLE staging_scraped_resource_providers (
    state_id TEXT,
    source_url TEXT,
    source_type TEXT
  );
`);
stagedSkipDb.prepare(`
  INSERT INTO staging_scraped_resource_providers (state_id, source_url, source_type)
  VALUES (?, ?, ?)
`).run('california', 'https://health.ucdavis.edu/mind-institute', 'lightweight_source_acquisition');
stagedSkipDb.close();
writeJson(path.join(stagedSkipRoot, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [
    { stateId: 'california' },
    { stateId: 'indiana' },
  ],
});
writeJson(path.join(stagedSkipRoot, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`), {
  combinedReadyRows: [
    {
      gapFamily: 'providers_care',
      executionLane: 'ready_target_scrape',
      ledgerStatus: 'ready_lightweight',
      stateId: 'california',
      sourceUrl: 'https://health.ucdavis.edu/mind-institute',
      crawlMethod: 'static_fetch',
    },
    {
      gapFamily: 'providers_care',
      executionLane: 'ready_target_scrape',
      ledgerStatus: 'ready_lightweight',
      stateId: 'indiana',
      sourceUrl: 'https://iuhealth.org/',
      crawlMethod: 'static_fetch',
    },
  ],
});
writeJson(path.join(stagedSkipRoot, 'data', 'source-acquisition-state', 'provider-pull-now-resolution-ledger.json'), {
  rows: [],
});

const stagedSkipOutput = runNode('scripts/run-next-provider-depth-step.mjs', {
  cwd: stagedSkipRoot,
  env: { ABLEFULL_REPO_ROOT: stagedSkipRoot },
});

assert.equal(stagedSkipOutput.mode, 'provider_depth_next_step');
assert.equal(stagedSkipOutput.selectedTarget.stateId, 'indiana');
assert.equal(stagedSkipOutput.selectedTarget.sourceUrl, 'https://iuhealth.org/');

const idleRoot = makeTempRepo('run-next-provider-depth-step-idle');
writeJson(path.join(idleRoot, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [{ stateId: 'indiana' }],
});
writeJson(path.join(idleRoot, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`), {
  combinedReadyRows: [
    {
      gapFamily: 'providers_care',
      executionLane: 'ready_target_scrape',
      ledgerStatus: 'ready_lightweight',
      stateId: 'indiana',
      sourceUrl: 'https://iuhealth.org/',
      crawlMethod: 'static_fetch',
    },
  ],
});
writeJson(path.join(idleRoot, 'docs', 'generated', `provider-authoring-state-packets-${generatedDate}.json`), {
  packets: [
    {
      stateId: 'alabama',
      markdownPath: `docs/generated/provider-authoring-state-packets/provider-authoring-state-packet-alabama-${generatedDate}.md`,
      jsonPath: `docs/generated/provider-authoring-state-packets/provider-authoring-state-packet-alabama-${generatedDate}.json`,
      executionPriority: 1,
    },
  ],
});
writeJson(path.join(idleRoot, 'docs', 'generated', 'provider-authoring-state-packets', `provider-authoring-state-packet-alabama-${generatedDate}.json`), {
  stateId: 'alabama',
  sourceTargetsPath: 'data/source_targets/alabama.json',
  concreteProviderTargetCount: 1,
  neededConcreteTargets: 1,
  providerTargets: [],
  supportTargets: [],
  nextAction: 'Add one more Alabama target.',
});
writeJson(path.join(idleRoot, 'data', 'source_targets', 'alabama.json'), [
  { state: 'AL', source_name: 'Existing', source_url: 'https://example.org', domain: 'example.org', target_table: 'programs' },
]);
writeJson(path.join(idleRoot, 'data', 'source-acquisition-state', 'provider-pull-now-resolution-ledger.json'), {
  rows: [
    { stateId: 'indiana', sourceUrl: 'https://iuhealth.org/', status: 'deferred_manual_research' },
  ],
});

const idleOutput = runNode('scripts/run-next-provider-depth-step.mjs', {
  cwd: idleRoot,
  env: { ABLEFULL_REPO_ROOT: idleRoot },
});

assert.equal(idleOutput.mode, 'provider_depth_authoring_next_step');
assert.equal(idleOutput.selectedTarget.scope, 'provider_authoring_backlog');
assert.equal(idleOutput.selectedTarget.nextPacketStateId, 'alabama');
assert.ok(idleOutput.commands.includes('npm run audit:provider-authoring-backlog'));
assert.ok(idleOutput.commands.includes('npm run run:next-provider-authoring-packet'));

const stalePacketRoot = makeTempRepo('run-next-provider-depth-step-stale-packets');
writeJson(path.join(stalePacketRoot, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [{ stateId: 'virginia', readinessLane: 'pull-now' }],
});
writeJson(path.join(stalePacketRoot, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`), {
  combinedReadyRows: [],
});
writeJson(path.join(stalePacketRoot, 'docs', 'generated', `provider-authoring-backlog-${generatedDate}.json`), {
  rows: [],
  summary: { totalRows: 0 },
});
writeJson(path.join(stalePacketRoot, 'docs', 'generated', `provider-authoring-state-packets-${generatedDate}.json`), {
  packets: [
    {
      stateId: 'virginia',
      markdownPath: `docs/generated/provider-authoring-state-packets/provider-authoring-state-packet-virginia-${generatedDate}.md`,
      jsonPath: `docs/generated/provider-authoring-state-packets/provider-authoring-state-packet-virginia-${generatedDate}.json`,
      executionPriority: 1,
    },
  ],
});

const stalePacketOutput = runNode('scripts/run-next-provider-depth-step.mjs', {
  cwd: stalePacketRoot,
  env: { ABLEFULL_REPO_ROOT: stalePacketRoot },
});

assert.equal(stalePacketOutput.mode, 'provider_depth_idle');
assert.equal(stalePacketOutput.selectedTarget, null);

const applyReadyRoot = makeTempRepo('run-next-provider-depth-step-apply-ready');
writeJson(path.join(applyReadyRoot, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [{ stateId: 'alabama', readinessLane: 'pull-now' }],
});
writeJson(path.join(applyReadyRoot, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`), {
  combinedReadyRows: [],
});
writeJson(path.join(applyReadyRoot, 'docs', 'generated', `provider-authoring-backlog-${generatedDate}.json`), {
  rows: [{ stateId: 'alabama', stateName: 'Alabama' }],
  summary: { totalRows: 1 },
});
writeJson(path.join(applyReadyRoot, 'docs', 'generated', `provider-authoring-state-packets-${generatedDate}.json`), {
  packets: [
    {
      stateId: 'alabama',
      markdownPath: `docs/generated/provider-authoring-state-packets/provider-authoring-state-packet-alabama-${generatedDate}.md`,
      jsonPath: `docs/generated/provider-authoring-state-packets/provider-authoring-state-packet-alabama-${generatedDate}.json`,
      executionPriority: 1,
    },
  ],
});
writeJson(path.join(applyReadyRoot, 'docs', 'generated', 'provider-authoring-state-packets', `provider-authoring-state-packet-alabama-${generatedDate}.json`), {
  stateId: 'alabama',
  sourceTargetsPath: 'data/source_targets/alabama.json',
  concreteProviderTargetCount: 3,
  neededConcreteTargets: 0,
  providerTargets: [],
  supportTargets: [],
  nextAction: 'Refresh Alabama provider targets.',
});
writeJson(path.join(applyReadyRoot, 'data', 'source_targets', 'alabama.json'), [
  { state: 'AL', source_name: 'Existing', source_url: 'https://example.org', domain: 'example.org', target_table: 'programs' },
]);
writeJson(path.join(applyReadyRoot, 'data', 'provider-authoring-state-workfiles', 'provider-authoring-state-workfile-alabama.json'), {
  candidateProviderTargets: [
    {
      slotNumber: 1,
      sourceName: 'Alabama Provider Ready',
      sourceUrl: 'https://al.example.org/provider',
      domain: 'al.example.org',
      reviewedBy: 'op',
    },
  ],
});

const applyReadyOutput = runNode('scripts/run-next-provider-depth-step.mjs', {
  cwd: applyReadyRoot,
  env: { ABLEFULL_REPO_ROOT: applyReadyRoot },
});
assert.equal(applyReadyOutput.mode, 'provider_depth_apply_ready_workfiles');
assert.equal(applyReadyOutput.selectedTarget.readyStateCount, 1);
assert.ok(applyReadyOutput.commands.includes('node scripts/run-provider-authoring-apply-ready-workfiles.mjs'));

writeJson(path.join(applyReadyRoot, 'data', 'source_targets', 'alabama.json'), [
  { state: 'AL', source_name: 'Existing', source_url: 'https://example.org', domain: 'example.org', target_table: 'programs' },
  { state: 'AL', source_name: 'Alabama Provider Ready', source_url: 'https://al.example.org/provider', domain: 'al.example.org', target_table: 'resource_providers' },
]);

const blockedNoQueueOutput = runNode('scripts/run-next-provider-depth-step.mjs', {
  cwd: applyReadyRoot,
  env: { ABLEFULL_REPO_ROOT: applyReadyRoot },
});
assert.equal(blockedNoQueueOutput.mode, 'provider_depth_blocked_no_ready_queue');
assert.equal(blockedNoQueueOutput.selectedTarget.scope, 'provider_blocked_no_ready_queue');
assert.ok(blockedNoQueueOutput.commands.includes('npm run audit:provider-source-pack'));

const downstreamRoot = makeTempRepo('run-next-provider-depth-step-downstream');
const downstreamDb = new Database(path.join(downstreamRoot, 'ca_disability_navigator.db'));
downstreamDb.exec(`
  CREATE TABLE staging_scraped_resource_providers (
    state_id TEXT,
    source_url TEXT,
    extracted_name TEXT,
    review_status TEXT,
    source_type TEXT
  );
`);
downstreamDb.prepare(`
  INSERT INTO staging_scraped_resource_providers (state_id, source_url, extracted_name, review_status, source_type)
  VALUES (?, ?, ?, ?, ?)
`).run('north-carolina', 'https://www.med.unc.edu/cidd/', 'The Carolina Institute for Developmental Disabilities', 'pending_review', 'lightweight_source_acquisition');
downstreamDb.close();
writeJson(path.join(downstreamRoot, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [{ stateId: 'north-carolina', readinessLane: 'pull-now' }],
});
writeJson(path.join(downstreamRoot, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`), {
  combinedReadyRows: [],
});
writeJson(path.join(downstreamRoot, 'docs', 'generated', `provider-authoring-backlog-${generatedDate}.json`), {
  rows: [{ stateId: 'north-carolina', stateName: 'North Carolina' }],
  summary: { totalRows: 1 },
});
writeJson(path.join(downstreamRoot, 'docs', 'generated', `provider-authoring-state-packets-${generatedDate}.json`), {
  packets: [],
});
writeJson(path.join(downstreamRoot, 'data', 'source-acquisition-runs', '2026-06-19T01-34-25-789Z', 'staged', 'providers-care', 'promotion-summary.json'), {
  runId: '2026-06-19T01-34-25-789Z',
  family: 'providers_care',
  acceptedInputCount: 1,
  supportedCount: 1,
  unsupportedCount: 0,
});
fs.mkdirSync(path.join(downstreamRoot, 'data', 'source-acquisition-runs', '2026-06-19T01-34-25-789Z', 'staged', 'providers-care'), { recursive: true });
fs.writeFileSync(
  path.join(downstreamRoot, 'data', 'source-acquisition-runs', '2026-06-19T01-34-25-789Z', 'staged', 'providers-care', 'promotion-candidates.ndjson'),
  `${JSON.stringify({ candidate: { row: { state_id: 'north-carolina', source_url: 'https://www.med.unc.edu/cidd/', extracted_name: 'The Carolina Institute for Developmental Disabilities' } } })}\n`,
);

const downstreamOutput = runNode('scripts/run-next-provider-depth-step.mjs', {
  cwd: downstreamRoot,
  env: { ABLEFULL_REPO_ROOT: downstreamRoot },
});
assert.equal(downstreamOutput.mode, 'provider_depth_downstream_followup');
assert.equal(downstreamOutput.selectedTarget.runId, '2026-06-19T01-34-25-789Z');
assert.equal(downstreamOutput.selectedTarget.matchedStagingRows, 1);
assert.equal(downstreamOutput.selectedTarget.unresolvedStagingRows, 1);
assert.equal(downstreamOutput.selectedTarget.reviewStatusCounts.pending_review, 1);
assert.ok(downstreamOutput.commands.some((command) => command.includes('run:source-acquisition-provider-support-followup')));

const terminalStagingRoot = makeTempRepo('run-next-provider-depth-step-terminal-staging');
const terminalStagingDb = new Database(path.join(terminalStagingRoot, 'ca_disability_navigator.db'));
terminalStagingDb.exec(`
  CREATE TABLE staging_scraped_resource_providers (
    state_id TEXT,
    source_url TEXT,
    extracted_name TEXT,
    review_status TEXT,
    source_type TEXT
  );
`);
const insertTerminalRow = terminalStagingDb.prepare(`
  INSERT INTO staging_scraped_resource_providers (state_id, source_url, extracted_name, review_status, source_type)
  VALUES (?, ?, ?, ?, ?)
`);
insertTerminalRow.run('north-carolina', 'https://a.example.org/', 'A', 'rejected_duplicate', 'lightweight_source_acquisition');
insertTerminalRow.run('north-carolina', 'https://b.example.org/', 'B', 'auto_accepted', 'lightweight_source_acquisition');
insertTerminalRow.run('virginia', 'https://c.example.org/', 'C', 'blocked_county_equivalent_missing_from_repo', 'lightweight_source_acquisition');
terminalStagingDb.close();
writeJson(path.join(terminalStagingRoot, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [{ stateId: 'north-carolina', readinessLane: 'pull-now' }],
});
writeJson(path.join(terminalStagingRoot, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`), {
  combinedReadyRows: [],
});
writeJson(path.join(terminalStagingRoot, 'docs', 'generated', `provider-authoring-backlog-${generatedDate}.json`), {
  rows: [],
  summary: { totalRows: 0 },
});
writeJson(path.join(terminalStagingRoot, 'docs', 'generated', `provider-authoring-state-packets-${generatedDate}.json`), {
  packets: [],
});
fs.mkdirSync(path.join(terminalStagingRoot, 'data', 'source-acquisition-runs', '2026-06-19T01-34-25-789Z', 'staged', 'providers-care'), { recursive: true });
writeJson(path.join(terminalStagingRoot, 'data', 'source-acquisition-runs', '2026-06-19T01-34-25-789Z', 'staged', 'providers-care', 'promotion-summary.json'), {
  runId: '2026-06-19T01-34-25-789Z',
  family: 'providers_care',
  acceptedInputCount: 3,
  supportedCount: 3,
  unsupportedCount: 0,
});
fs.writeFileSync(
  path.join(terminalStagingRoot, 'data', 'source-acquisition-runs', '2026-06-19T01-34-25-789Z', 'staged', 'providers-care', 'promotion-candidates.ndjson'),
  [
    { candidate: { row: { state_id: 'north-carolina', source_url: 'https://a.example.org/', extracted_name: 'A' } } },
    { candidate: { row: { state_id: 'north-carolina', source_url: 'https://b.example.org/', extracted_name: 'B' } } },
    { candidate: { row: { state_id: 'virginia', source_url: 'https://c.example.org/', extracted_name: 'C' } } },
  ].map((row) => JSON.stringify(row)).join('\n') + '\n',
);

const terminalStagingOutput = runNode('scripts/run-next-provider-depth-step.mjs', {
  cwd: terminalStagingRoot,
  env: { ABLEFULL_REPO_ROOT: terminalStagingRoot },
});
assert.equal(terminalStagingOutput.mode, 'provider_depth_idle');
assert.equal(terminalStagingOutput.selectedTarget, null);

const followupRoot = makeTempRepo('run-next-provider-depth-step-followup');
writeJson(path.join(followupRoot, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [{ stateId: 'indiana', readinessLane: 'pull-now' }],
});
writeJson(path.join(followupRoot, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`), {
  combinedReadyRows: [],
});
writeJson(path.join(followupRoot, 'docs', 'generated', `low-token-control-plane-${generatedDate}.json`), {
  lanes: {
    providerPullNow: {
      action: {
        blocker: 'provider_pull_now_stale_decisions',
        nextAction: 'Prune stale provider pull-now decision rows.',
        recommendedCommands: [
          'npm run fix:provider-pull-now-prune-stale',
          'npm run audit:provider-pull-now-decision-progress',
        ],
      },
      staleDecisionRows: 3,
      activeDecisionRows: 3,
    },
  },
});
const followupOutput = runNode('scripts/run-next-provider-depth-step.mjs', {
  cwd: followupRoot,
  env: { ABLEFULL_REPO_ROOT: followupRoot },
});
assert.equal(followupOutput.mode, 'provider_pull_now_followup_next_step');
assert.equal(followupOutput.selectedTarget.blocker, 'provider_pull_now_stale_decisions');
assert.ok(followupOutput.commands.includes('npm run fix:provider-pull-now-prune-stale'));

const statePacketRoot = makeTempRepo('run-next-provider-depth-step-state-packets');
writeJson(path.join(statePacketRoot, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [{ stateId: 'tennessee', readinessLane: 'pull-now' }],
});
writeJson(path.join(statePacketRoot, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`), {
  combinedReadyRows: [],
});
writeJson(path.join(statePacketRoot, 'docs', 'generated', `low-token-control-plane-${generatedDate}.json`), {
  lanes: {
    providerPullNow: {
      action: {
        blocker: 'none',
        nextAction: 'Provider pull-now lane is clear; no action needed.',
        recommendedCommands: [],
      },
      statePacketsPath: `docs/generated/provider-pull-now-state-packets-${generatedDate}.json`,
      statePacketsSummary: {
        statePacketCount: 2,
        totalUnresolvedRows: 7,
      },
    },
  },
});
writeJson(path.join(statePacketRoot, 'docs', 'generated', `provider-pull-now-state-packets-${generatedDate}.json`), {
  packets: [
    {
      stateId: 'tennessee',
      unresolvedRows: 6,
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
const statePacketOutput = runNode('scripts/run-next-provider-depth-step.mjs', {
  cwd: statePacketRoot,
  env: { ABLEFULL_REPO_ROOT: statePacketRoot },
});
assert.equal(statePacketOutput.mode, 'provider_pull_now_state_packet_next_step');
assert.equal(statePacketOutput.selectedTarget.nextState, 'tennessee');
assert.equal(statePacketOutput.selectedTarget.totalUnresolvedRows, 7);
assert.ok(statePacketOutput.commands.includes('npm run run:next-provider-pull-now-state-packet'));

console.log('run next provider depth step tests passed');
