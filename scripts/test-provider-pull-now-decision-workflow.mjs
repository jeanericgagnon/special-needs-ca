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
  fs.mkdirSync(path.join(root, 'data', 'source_packs'), { recursive: true });
  fs.mkdirSync(path.join(root, 'data', 'source-acquisition-state'), { recursive: true });
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

function runNode(args, { cwd, env = {} }) {
  const result = spawnSync(process.execPath, args, {
    cwd,
    env: {
      ...process.env,
      ...env,
    },
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${args.join(' ')}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }

  return JSON.parse(result.stdout.trim());
}

function seedFixture(root) {
  writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-decision-template-${generatedDate}.json`), {
    rows: [
      {
        stateId: 'tennessee',
        actionClass: 'replace_domain',
        sourceUrl: 'https://www.lebonheur.org/',
        hostname: 'www.lebonheur.org',
        followupReason: 'dns_lookup_failed',
      },
      {
        stateId: 'indiana',
        actionClass: 'bounded_retry_then_replace',
        sourceUrl: 'https://www.rileychildrens.org/',
        hostname: 'www.rileychildrens.org',
        followupReason: 'network_timeout',
      },
    ],
  });

  writeJson(path.join(root, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
    states: [
      {
        stateId: 'tennessee',
        concreteProviderTargets: [
          {
            source_name: "Le Bonheur Children's Hospital",
            source_url: 'https://www.lebonheur.org',
          },
        ],
      },
      {
        stateId: 'indiana',
        concreteProviderTargets: [
          {
            source_name: 'Riley Hospital for Children',
            source_url: 'https://www.rileychildrens.org/contact-and-locations/riley-hospital-for-children-at-iu-health',
          },
        ],
      },
    ],
  });

  writeJson(path.join(root, 'data', 'source_targets', 'tennessee.json'), [
    {
      target_table: 'resource_providers',
      source_name: 'Legacy Le Bonheur',
      source_url: 'https://www.lebonheur.org/',
      domain: 'lebonheur.org',
      notes: 'Legacy provider target.',
    },
  ]);

  writeJson(path.join(root, 'data', 'source_targets', 'indiana.json'), [
    {
      target_table: 'resource_providers',
      source_name: 'Legacy Riley',
      source_url: 'https://www.rileychildrens.org/',
      domain: 'rileychildrens.org',
      notes: 'Legacy provider target.',
    },
  ]);
}

function testDryRunSkipsMissingReviewedBy() {
  const root = makeTempRepo('provider-pull-now-dry-run');
  seedFixture(root);
  writeJson(path.join(root, 'data', 'provider-pull-now-decisions.json'), {
    rows: [
      {
        stateId: 'tennessee',
        actionClass: 'replace_domain',
        sourceUrl: 'https://www.lebonheur.org/',
        decisionMode: 'replace_with_reviewed_first_party_target',
        reviewedSourceName: "Le Bonheur Children's Hospital",
        reviewedSourceUrl: 'https://www.lebonheur.org',
        reviewedBy: '',
      },
    ],
  });

  const output = runNode(
    [path.join(repoRoot, 'scripts', 'apply-provider-pull-now-decisions.mjs')],
    { cwd: root, env: { ABLEFULL_REPO_ROOT: root } },
  );

  assert.equal(output.summary.inputRows, 1);
  assert.deepEqual(output.summary.skippedByReason, { missing_reviewed_by: 1 });
}

function testApplyPersistsReplacementAndResolutionArtifacts() {
  const root = makeTempRepo('provider-pull-now-apply');
  seedFixture(root);
  writeJson(path.join(root, 'data', 'provider-pull-now-decisions.json'), {
    rows: [
      {
        stateId: 'tennessee',
        actionClass: 'replace_domain',
        sourceUrl: 'https://www.lebonheur.org/',
        decisionMode: 'replace_with_reviewed_first_party_target',
        reviewedSourceName: "Le Bonheur Children's Hospital",
        reviewedSourceUrl: 'https://www.lebonheur.org',
        reviewNotes: 'Use the concrete first-party hospital root.',
        reviewedBy: 'codex',
      },
      {
        stateId: 'indiana',
        actionClass: 'bounded_retry_then_replace',
        sourceUrl: 'https://www.rileychildrens.org/',
        decisionMode: 'bounded_retry_once',
        retryNotes: 'One bounded retry allowed later.',
        reviewedBy: 'codex',
      },
    ],
  });

  const output = runNode(
    [path.join(repoRoot, 'scripts', 'apply-provider-pull-now-decisions.mjs'), '--apply'],
    { cwd: root, env: { ABLEFULL_REPO_ROOT: root } },
  );

  assert.equal(output.summary.resolvedRows, 1);
  assert.equal(output.summary.deferredRows, 1);

  const tnTargets = readJson(path.join(root, 'data', 'source_targets', 'tennessee.json'));
  assert.equal(tnTargets[0].source_url, 'https://www.lebonheur.org/');
  assert.equal(tnTargets[0].source_name, "Le Bonheur Children's Hospital");
  assert.ok(String(tnTargets[0].notes).includes('Provider pull-now decision applied'));

  const ledger = readJson(path.join(root, 'data', 'source-acquisition-state', 'provider-pull-now-resolution-ledger.json'));
  assert.equal(ledger.rows.length, 2);

  const resolutionPack = readJson(path.join(root, 'data', 'source_packs', 'provider_pull_now_resolutions.json'));
  assert.equal(resolutionPack.rows.length, 1);
  assert.equal(resolutionPack.rows[0].stateId, 'tennessee');
}

testDryRunSkipsMissingReviewedBy();
testApplyPersistsReplacementAndResolutionArtifacts();

console.log('provider pull-now decision workflow tests passed');
