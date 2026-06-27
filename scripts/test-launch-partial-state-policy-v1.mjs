import fs from 'fs';
import path from 'path';
import assert from 'assert';

const repoRoot = process.cwd();

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relPath), 'utf8'));
}

function readJsonl(relPath) {
  return fs
    .readFileSync(path.join(repoRoot, relPath), 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const policy = readJson('data/generated/launch_partial_state_policy_v1.json');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const queue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');

const expectedStates = ['alaska', 'arizona', 'idaho', 'maine', 'new-hampshire'];

assert.equal(policy.launchReadyCompleteStateCount, 45, 'policy should report 45 launch-ready complete states');
assert.equal(policy.blockedStateCount, 5, 'policy should report 5 blocked states');
assert.deepEqual(
  policy.states.map((row) => row.stateId).sort(),
  expectedStates,
  'partial-state policy should cover exactly the 5 blocked states'
);

for (const stateId of expectedStates) {
  const policyRow = policy.states.find((row) => row.stateId === stateId);
  assert(policyRow, `missing partial-state policy row for ${stateId}`);
  assert.equal(policyRow.launchBehavior, 'partial_gated', `${stateId} should be partial_gated`);
  assert(policyRow.allowedSurfaces.includes('state-hub'), `${stateId} should keep state-hub visible`);
  for (const suppressedSurface of ['state-counties-hub', 'county-hub', 'county-condition', 'school-district', 'city']) {
    assert(
      policyRow.suppressedSurfaces.includes(suppressedSurface),
      `${stateId} should suppress ${suppressedSurface}`
    );
  }

  const auditRow = audit.states.find((row) => row.stateId === stateId);
  assert(auditRow, `missing audit row for ${stateId}`);
  assert.equal(auditRow.classification, 'BLOCKED', `${stateId} should remain BLOCKED in audit`);
  assert.equal(auditRow.indexSafe, false, `${stateId} should remain indexSafe=false in audit`);

  const queueRow = queue.find((row) => row.state === stateId);
  assert(queueRow, `missing queue row for ${stateId}`);
  assert.equal(queueRow.classification, 'BLOCKED', `${stateId} should remain BLOCKED in queue`);
  assert.equal(queueRow.index_safe, false, `${stateId} should remain index_safe=false in queue`);
}

const completeStates = audit.states.filter((row) => row.classification === 'COMPLETE').map((row) => row.stateId);
for (const stateId of completeStates) {
  assert(
    !policy.states.find((row) => row.stateId === stateId),
    `complete state ${stateId} must not appear in partial-state policy`
  );
}

console.log(
  JSON.stringify(
    {
      ok: true,
      partialStateCount: policy.states.length,
      completeStateCount: policy.launchReadyCompleteStateCount
    },
    null,
    2
  )
);
