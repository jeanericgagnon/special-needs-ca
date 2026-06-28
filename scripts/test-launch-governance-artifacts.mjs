import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const canonicalMilestone = readJson('data/generated/national-initial-scrape-v1.json');
const legacyMilestone = readJson('data/generated/national_initial_scrape_v1.json');
const finalWebsiteAudit = readJson('docs/generated/final-website-audit-2026-06-28.json');
const exhaustiveGap = readJson('docs/generated/exhaustive-gap-master-2026-06-28.json');
const fullGap = readJson('docs/generated/full-information-gap-audit-2026-06-28.json');

const completeStates = audit.states.filter((state) => state.classification === 'COMPLETE').map((state) => state.stateId).sort();
const blockedStates = audit.states.filter((state) => state.classification === 'BLOCKED').map((state) => state.stateId).sort();
const expectedTruthLine = '0/50 strict-gold states means 45 states still sit in the public-safe-but-blocked lane on the stricter truth registry.';

assert.equal(canonicalMilestone.milestone, 'national-initial-scrape-v1');
assert.equal(canonicalMilestone.summary.completeStates, completeStates.length);
assert.equal(canonicalMilestone.summary.blockedStates, blockedStates.length);
assert.equal(canonicalMilestone.summary.indexSafeStates, audit.indexSafeCount);
assert.deepEqual([...canonicalMilestone.completeStateIds].sort(), completeStates);
assert.deepEqual([...canonicalMilestone.blockedStateIds].sort(), blockedStates);

assert.equal(legacyMilestone.milestoneId, 'national-initial-scrape-v1');
assert.equal(legacyMilestone.completeStates, canonicalMilestone.summary.completeStates);
assert.equal(legacyMilestone.blockedStates, canonicalMilestone.summary.blockedStates);
assert.equal(legacyMilestone.indexSafeStates, canonicalMilestone.summary.indexSafeStates);
assert.deepEqual([...legacyMilestone.completeStateIds].sort(), completeStates);
assert.deepEqual([...legacyMilestone.blockedStateIds].sort(), blockedStates);

assert.ok(
  finalWebsiteAudit.immediateTruths.includes(expectedTruthLine),
  'Final website audit should reflect the current public-safe-but-blocked truth.',
);
assert.ok(
  exhaustiveGap.immediateTruths.includes(expectedTruthLine),
  'Exhaustive gap master should reflect the current public-safe-but-blocked truth.',
);

assert.equal(
  fullGap.completionAudit.unknownGapCount,
  0,
  'Full information gap audit should not leave in-scope families in an unknown disposition.',
);
assert.equal(
  fullGap.completionAudit.allInScopeFamiliesAccountedFor,
  true,
  'Full information gap audit should account for every in-scope family.',
);

const formsFamily = fullGap.completionAudit.families.find((family) => family.id === 'forms_guides');
assert.equal(formsFamily?.disposition, 'processed');

for (const familyId of ['housing', 'goods_supplies', 'jobs_vocational', 'care_independent_living']) {
  const family = fullGap.completionAudit.families.find((entry) => entry.id === familyId);
  assert.equal(
    family?.disposition,
    'explicitly_blocked',
    `${familyId} should resolve to an explicit blocked disposition rather than unknown`,
  );
}

console.log('launch governance artifact tests passed');
