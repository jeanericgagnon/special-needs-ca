import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nonprofit-gap-batch-'));
const repoRoot = path.join(tempRoot, 'repo');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const registryDir = path.join(repoRoot, 'data', 'nonprofit-link-registry', '2026-06-17T00-00-00-000Z');

fs.mkdirSync(docsDir, { recursive: true });
fs.mkdirSync(registryDir, { recursive: true });

const planner = {
  prioritizedPlan: [
    {
      id: 'nonprofit_local_in_person',
      targetTypes: ['affiliate_chapter', 'affiliate_site', 'site_path'],
    },
  ],
};

const registry = {
  entries: [
    {
      id: 'safe-1',
      targetType: 'affiliate_chapter',
      seedUrl: 'https://example.org/chapter/a',
      host: 'example.org',
      familyKey: 'example.org',
      trustedMissingRows: 12,
      rowCount: 12,
      riskLevel: 'medium',
      scrapeStrategy: 'site_path',
    },
    {
      id: 'risky-1',
      targetType: 'affiliate_chapter',
      seedUrl: 'https://example.org/chapter/b',
      host: 'example.org',
      familyKey: 'example.org',
      trustedMissingRows: 30,
      rowCount: 30,
      riskLevel: 'high',
      scrapeStrategy: 'site_path',
    },
  ],
};

const date = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(docsDir, `nonprofit-gap-planner-${date}.json`), `${JSON.stringify(planner, null, 2)}\n`);
fs.writeFileSync(path.join(registryDir, 'registry.json'), `${JSON.stringify(registry, null, 2)}\n`);

const scriptPath = '/Users/ericgagnon/Documents/Ablefull/special-needs-ca/scripts/run-nonprofit-gap-batch.mjs';
const result = spawnSync('node', [scriptPath, '--goal=nonprofit_local_in_person', '--domain=example.org'], {
  cwd: repoRoot,
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(result.stderr || result.stdout || 'gap batch script failed');
}

const output = JSON.parse(result.stdout);
if (output.candidateCount !== 1) {
  throw new Error(`expected 1 safe candidate, received ${output.candidateCount}`);
}
if (output.blockedForRisk !== 1) {
  throw new Error(`expected 1 blocked high-risk candidate, received ${output.blockedForRisk}`);
}

console.log(JSON.stringify({
  message: 'Nonprofit gap batch test passed',
  summaryPath: output.summaryPath,
}, null, 2));
