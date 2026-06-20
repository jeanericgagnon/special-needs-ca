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
  fs.mkdirSync(path.join(root, 'data', 'source_targets'), { recursive: true });
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

const root = makeTempRepo('provider-authoring-backlog');
writeJson(path.join(root, 'docs', 'generated', `provider-buildout-priority-plan-${generatedDate}.json`), {
  lanes: {
    remediation: [],
    validation: [
      { stateId: 'alabama', stateName: 'Alabama', countyCount: 67, publicSafeProviders: 1, totalProviderRows: 1, providerTruthScore: 100, publicSafeNonprofits: 500, advocatePublicSafeCount: 20 },
      { stateId: 'alaska', stateName: 'Alaska', countyCount: 1, publicSafeProviders: 2, totalProviderRows: 2, providerTruthScore: 100, publicSafeNonprofits: 100, advocatePublicSafeCount: 5 },
    ],
  },
});
writeJson(path.join(root, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [
    { stateId: 'alaska', readinessLane: 'limited-pull-now' },
  ],
});
writeJson(path.join(root, 'data', 'source-acquisition-state', 'provider-authoring-ledger.json'), {
  rows: [
    { stateId: 'alabama', status: 'complete', note: 'added-concrete-targets' },
  ],
});
writeJson(path.join(root, 'data', 'source_targets', 'alabama.json'), [
  { target_table: 'resource_providers', source_name: 'Alabama Children', source_url: 'https://alchild.org', domain: 'alchild.org', crawl_method: 'static_fetch' },
  { target_table: 'nonprofit_organizations', source_name: 'NP', source_url: 'https://np.org' },
]);
writeJson(path.join(root, 'data', 'source_targets', 'alaska.json'), [
  { target_table: 'resource_providers', source_name: 'Alaska Children', source_url: 'https://akchild.org', domain: 'akchild.org', crawl_method: 'static_fetch' },
  { target_table: 'resource_providers', source_name: 'Alaska Pediatrics', source_url: 'https://akpeds.org', domain: 'akpeds.org', crawl_method: 'static_fetch' },
  { target_table: 'resource_providers', source_name: 'Alaska Therapy', source_url: 'https://aktherapy.org', domain: 'aktherapy.org', crawl_method: 'static_fetch' },
  { target_table: 'resource_providers', source_name: 'Alaska Directory', source_url: 'https://akdir.org/roster', domain: 'akdir.org', crawl_method: 'static_fetch', organization_type: 'provider_directory' },
]);

const output = runNode('src/db/generate_provider_authoring_backlog.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(output.summary.totalRows, 2);
const payload = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'generated', `provider-authoring-backlog-${generatedDate}.json`), 'utf8'));
assert.equal(payload.rows[0].stateId, 'alabama');
assert.equal(payload.rows[0].neededConcreteTargets, 2);
assert.equal(payload.rows[0].ledgerStatus, 'complete');
assert.equal(payload.rows[1].stateId, 'alaska');
assert.equal(payload.rows[1].neededConcreteTargets, 0);
assert.equal(payload.rows[1].neededLiveProviderRows, 1);
assert.equal(payload.rows[1].authoringGapClass, 'needs_refresh_or_deeper_targets');
assert.equal(payload.summary.statesBelowConcreteThreshold, 1);
assert.equal(payload.summary.statesBelowLiveProviderThreshold, 2);
assert.equal(payload.summary.completedStatesPresent, 1);

console.log('provider authoring backlog tests passed');
