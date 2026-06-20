import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import assert from 'assert/strict';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function runNode(scriptPath) {
  execFileSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    stdio: 'pipe',
  });
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readSourceTarget(relativePath, sourceName) {
  const payload = readJson(relativePath);
  const items = Array.isArray(payload) ? payload : payload.targets || [];
  return items.find((item) => item.target_table === 'forms' && item.source_name === sourceName);
}

runNode('src/db/generate_forms_source_pack.js');

const pack = readJson('data/source_packs/forms_source_pack.json');
const arkansas = (pack.rows || []).find((row) => row.stateId === 'arkansas');
const arkansasTarget = readSourceTarget('data/source_targets/arkansas.json', 'Arkansas Division of Developmental Disabilities Services');

assert.ok(arkansasTarget, 'Expected Arkansas forms source target to be repaired');
assert.equal(arkansasTarget.source_url, 'https://humanservices.arkansas.gov/wp-content/uploads/DDS.docx');
assert.equal(arkansas, undefined, 'Expected Arkansas to drop out of the blocked forms source pack after repair application');
assert.ok(pack.summary.blockedFormsStates <= 37, `Expected blocked forms states to be reduced after repair, received ${pack.summary.blockedFormsStates}`);

console.log(JSON.stringify({
  ok: true,
  blockedFormsStates: pack.summary.blockedFormsStates,
  arkansasFormsUrl: arkansasTarget.source_url,
}, null, 2));
