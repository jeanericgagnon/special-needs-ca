import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

function runNode(scriptRelativePath) {
  const scriptPath = path.join(repoRoot, scriptRelativePath);
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }

  return JSON.parse(result.stdout.trim());
}

const output = runNode('src/db/generate_launch_critical_data_acquisition_plan.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `launch-critical-data-acquisition-plan-${generatedDate}.json`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `launch-critical-data-acquisition-plan-${generatedDate}.md`);
const blockerRegistryPath = path.join(repoRoot, 'docs', 'generated', `blocker-resolution-registry-${generatedDate}.json`);
const providerLedgerPath = path.join(repoRoot, 'docs', 'generated', `provider-blocker-resolution-ledger-${generatedDate}.json`);
const formsLedgerPath = path.join(repoRoot, 'docs', 'generated', `forms-blocker-resolution-ledger-${generatedDate}.json`);
const knowledgeLedgerPath = path.join(repoRoot, 'docs', 'generated', `knowledge-topic-blocker-ledger-${generatedDate}.json`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(mdPath));
assert.ok(fs.existsSync(blockerRegistryPath));
assert.ok(fs.existsSync(providerLedgerPath));
assert.ok(fs.existsSync(formsLedgerPath));
assert.ok(fs.existsSync(knowledgeLedgerPath));
assert.equal(output.queueBaseline.missingSourceFamilyCount, 0);

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');
const blockerRegistry = JSON.parse(fs.readFileSync(blockerRegistryPath, 'utf8'));
const completionPlan = JSON.parse(fs.readFileSync(path.join(repoRoot, payload.authoritativeInputs.completionPlanPath), 'utf8'));
const expectedWaitlistFollowupRows = (completionPlan.combinedReadyRows || []).filter((row) => row.targetTable === 'program_waitlists').length;

assert.equal(payload.queueBaseline.missingSourceFamilyCount, 0);
assert.ok(Array.isArray(payload.launchCriticalFamilies));
assert.ok(payload.launchCriticalFamilies.some((family) => family.id === 'programs_benefits'));
assert.ok(payload.launchCriticalFamilies.some((family) => family.id === 'dd_routing'));
assert.ok(payload.launchCriticalFamilies.some((family) => family.id === 'knowledge_content'));
assert.ok(payload.launchCriticalFamilies.every((family) => Array.isArray(family.requiredSubtypes) && family.requiredSubtypes.length > 0));
assert.ok(payload.launchCriticalFamilies.every((family) => Array.isArray(family.enoughForLaunch) && family.enoughForLaunch.length > 0));
assert.ok(payload.launchCriticalFamilies.every((family) => family.currentStateInventory && family.gapAnalysis && family.sourceAcquisitionPlan));
assert.ok(payload.launchCriticalFamilies.every((family) => family.launchExecutionClass));
assert.ok(payload.launchCriticalFamilies.every((family) => typeof family.directAcquisitionRequired === 'boolean'));
assert.ok(payload.launchCriticalFamilies.every((family) => family.resolutionTarget));
assert.ok(payload.launchCriticalFamilies.every((family) => family.resolutionCompleteWhen));
assert.ok(payload.launchCriticalFamilies.every((family) => Number.isInteger(family.remainingBlockerCount)));
assert.ok(payload.launchCriticalFamilies.every((family) => family.ledgerArtifactPath));
assert.ok(Array.isArray(payload.blockedWorkTaxonomy) && payload.blockedWorkTaxonomy.length >= 5);
assert.ok(payload.blockerResolutionRegistry && payload.blockerResolutionRegistry.artifactPath);
assert.ok(payload.launchCriticalFamilies.every((family) => family.blockedWorkSummary && family.blockedWorkSummary.primaryUnblockClass && family.blockedWorkSummary.nextLane));
assert.ok(payload.launchCriticalFamilies.every((family) => family.launchThreshold));
assert.ok(payload.launchCriticalFamilies.every((family) => family.truthThreshold));
assert.ok(payload.launchCriticalFamilies.every((family) => family.blockerCondition));
assert.ok(payload.launchCriticalFamilies.every((family) => family.goodEnoughForLaunchRule));
assert.ok(Array.isArray(payload.executionBuckets.scrapeNow));
assert.ok(Array.isArray(payload.executionBuckets.authorFirst));
assert.ok(Array.isArray(payload.executionBuckets.dependencyVerificationOnly));
assert.ok(Array.isArray(payload.executionBuckets.blockedLater));
assert.ok(payload.executionBuckets.authorFirst.some((family) => family.id === 'forms_guides'));
assert.ok(payload.executionBuckets.authorFirst.some((family) => family.id === 'providers_care'));
assert.ok(payload.executionBuckets.authorFirst.some((family) => family.id === 'knowledge_content'));
assert.ok(!payload.executionBuckets.scrapeNow.some((family) => family.id === 'disability_to_program_matching'));
assert.ok(payload.executionBuckets.dependencyVerificationOnly.some((family) => family.id === 'disability_to_program_matching'));
assert.ok(!payload.executionBuckets.scrapeNow.some((family) => family.lane === 'none direct'));
assert.ok(!payload.executionBuckets.scrapeNow.some((family) => Number(family.queueCount || 0) === 0));
const nonDirectFamilyIds = new Set(payload.launchCriticalFamilies.filter((family) => family.directAcquisitionRequired === false).map((family) => family.id));
assert.ok(!payload.executionBuckets.scrapeNow.some((family) => nonDirectFamilyIds.has(family.id)));
assert.ok(payload.executionOrder.scrapeNow.includes('programs_benefits'));
assert.ok(payload.executionOrder.authorFirst.includes('program_waitlists'));
assert.ok(payload.executionOrder.authorFirst.includes('waivers'));
assert.ok(payload.executionOrder.authorFirst.includes('education_routing'));
assert.ok(payload.executionOrder.dependencyVerificationOnly.includes('disability_to_program_matching'));
assert.ok(Array.isArray(payload.exitCriteria) && payload.exitCriteria.length > 5);
assert.ok(Array.isArray(payload.importantInterfaceChanges) && payload.importantInterfaceChanges.length > 0);
assert.ok(Array.isArray(payload.testPlan) && payload.testPlan.length > 0);
assert.equal(payload.canonicalLaunchQueueAccounting.formsGuides.totalStates, 50);
assert.equal(payload.canonicalLaunchQueueAccounting.formsGuides.alreadyClearedStates, 7);
assert.equal(payload.canonicalLaunchQueueAccounting.formsGuides.readyExactStates, 6);
assert.equal(payload.canonicalLaunchQueueAccounting.formsGuides.authorFirstStates, 37);
assert.equal(payload.canonicalLaunchQueueAccounting.formsGuides.stateSpecificFallbackOnlyStates, 34);
assert.equal(payload.canonicalLaunchQueueAccounting.formsGuides.federalOnlyFallbackStates, 3);
assert.equal(payload.canonicalLaunchQueueAccounting.formsGuides.unaccountedStates, 0);
assert.equal(payload.canonicalLaunchQueueAccounting.programWaitlists.launchExactReadyRows, 6);
assert.equal(payload.canonicalLaunchQueueAccounting.programWaitlists.followupReadyRows, expectedWaitlistFollowupRows);
for (const state of ['florida', 'georgia', 'ohio', 'pennsylvania', 'illinois', 'texas']) {
  assert.ok(payload.canonicalLaunchQueueAccounting.programWaitlists.launchExactReadyStates.includes(state));
}
assert.equal(payload.launchProviderStandard.anchorsRequiredPerState, 3);
assert.equal(payload.launchProviderStandard.mandatorySubtypeBuckets.length, 3);
assert.equal(payload.launchProviderStandard.currentStatus.launchReadyStates, 0);
assert.equal(payload.launchProviderStandard.currentStatus.pullNowPlannedStates, 10);
assert.equal(payload.launchProviderStandard.currentStatus.authoredProviderTargets, 42);
assert.equal(payload.launchCriticalFamilies.find((family) => family.id === 'forms_guides')?.remainingBlockerCount, 0);
assert.equal(payload.launchCriticalFamilies.find((family) => family.id === 'providers_care')?.remainingBlockerCount, 46);
assert.equal(payload.launchCriticalFamilies.find((family) => family.id === 'medicaid_hhs_offices')?.remainingBlockerCount, 40);
assert.ok(Array.isArray(payload.launchClosureTable));
assert.equal(payload.launchClosureTable.length, payload.launchCriticalFamilies.length);
assert.ok(payload.launchClosureTable.every((row) => row.family && row.currentCountOrStatus && row.launchThreshold && row.currentPercentToThreshold && row.blockingGapType && row.actionableUnblockClass && row.nextControlPlaneArtifact && row.nextCommand));
assert.ok(Array.isArray(blockerRegistry.rows));
assert.ok(blockerRegistry.rows.every((row) => row.family && row.blockerClass && row.currentEvidence && row.nextArtifact && row.nextCommand && row.terminalResolutionState));
assert.match(markdown, /## Launch-Critical Families/);
assert.match(markdown, /## Blocker Resolution Registry/);
assert.match(markdown, /### Programs and benefits `programs_benefits`/);
assert.match(markdown, /## Canonical Launch Queue Accounting/);
assert.match(markdown, /## Blocked Work Taxonomy/);
assert.match(markdown, /### Dependency \/ verification only/);
assert.match(markdown, /Launch sufficiency standard/);
assert.match(markdown, /Current-state inventory/);
assert.match(markdown, /Gap analysis/);
assert.match(markdown, /Source acquisition plan/);
assert.match(markdown, /## Execution Order/);
assert.match(markdown, /## Exit Criteria/);
assert.match(markdown, /## Launch Closure Table/);

console.log('launch critical data acquisition plan tests passed');
