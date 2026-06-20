import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import assert from 'assert/strict';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const generatedDate = new Date().toISOString().slice(0, 10);

function runNode(scriptPath) {
  execFileSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    stdio: 'pipe',
  });
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function findRow(rows, stateId, targetTable) {
  return rows.find((row) => row.stateId === stateId && row.targetTable === targetTable);
}

function findSourceTarget(relativePath, targetTable, sourceName) {
  const payload = readJson(relativePath);
  const items = Array.isArray(payload) ? payload : payload.targets || [];
  return items.find((item) => item.target_table === targetTable && item.source_name === sourceName);
}

runNode('src/db/generate_official_state_domain_repair_pack.js');
runNode('src/db/generate_official_domain_followup_queue.js');

const pack = readJson('data/source_packs/official_state_domain_repairs.json');
const queue = readJson(`docs/generated/official-domain-followup-queue-${generatedDate}.json`);

assert.ok(pack.summary.exactCandidateRows >= 100, `Expected >=100 exact candidates, received ${pack.summary.exactCandidateRows}`);

const alaskaFormsTarget = findSourceTarget('data/source_targets/alaska.json', 'forms', 'Alaska Division of Senior and Disabilities Services');
assert.ok(alaskaFormsTarget, 'Expected Alaska forms source target to be repaired in source_targets');
assert.ok(
  alaskaFormsTarget.source_url === 'https://health.alaska.gov/dsds',
  `Expected Alaska forms source target to use health.alaska.gov/dsds, received ${alaskaFormsTarget.source_url}`,
);

const washingtonForms = findRow(pack.rows, 'washington', 'forms');
assert.ok(washingtonForms, 'Expected Washington forms repair row');
assert.ok(
  washingtonForms.replacementCandidates.some((candidate) => candidate.url === 'https://www.dshs.wa.gov/dda'),
  'Expected Washington forms row to include the DDA fallback candidate from local artifacts',
);
assert.ok(
  washingtonForms.replacementCandidates.some((candidate) => candidate.url === 'https://www.hca.wa.gov/'),
  'Expected Washington forms row to include the HCA fallback candidate from local artifacts',
);

assert.ok(queue.summary.totalRows >= 100, `Expected large follow-up queue, received ${queue.summary.totalRows}`);
assert.ok(Number(queue.summary.byLane.forms_library || 0) >= 34, 'Expected forms follow-up lane count to remain explicit');

console.log(JSON.stringify({
  ok: true,
  exactCandidateRows: pack.summary.exactCandidateRows,
  followupRows: queue.summary.totalRows,
}, null, 2));
