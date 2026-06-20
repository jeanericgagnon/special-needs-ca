import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);

const jsonOutPath = path.join(docsDir, `launch-scraper-meta-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-meta-audit-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function requiredJson(name) {
  const filePath = path.join(docsDir, `${name}-${generatedDate}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required artifact: ${filePath}`);
  }
  return filePath;
}

function sorted(values) {
  return [...values].sort((a, b) => String(a).localeCompare(String(b)));
}

function familiesFrom(items, key = 'family') {
  return sorted(new Set((items || []).map((item) => item?.[key]).filter(Boolean)));
}

const artifactNames = [
  'launch-scrape-link-inventory',
  'launch-scraper-contract',
  'launch-scraper-field-contract',
  'launch-scraper-fixture-matrix',
  'launch-scraper-false-positive-taxonomy',
  'launch-scraper-queue-false-positive-risk',
  'launch-scraper-lifecycle-contract',
  'launch-scraper-staging-support-matrix',
  'launch-scraper-readiness-board',
  'launch-scraper-gap-registry',
  'launch-scraper-negative-fixture-plan',
  'launch-scraper-negative-fixture-capture-packet',
  'launch-scraper-negative-fixture-closure-status',
  'launch-scraper-runbook',
  'launch-scraper-artifact-contract',
  'launch-scraper-provenance-contract',
  'launch-scraper-queue-governance',
  'launch-scraper-qa-pack',
  'launch-scraper-fixture-coverage-audit',
];

const artifactPaths = Object.fromEntries(
  artifactNames.map((name) => [name, requiredJson(name)]),
);

const inventory = readJson(artifactPaths['launch-scrape-link-inventory']);
const contract = readJson(artifactPaths['launch-scraper-contract']);
const fieldContract = readJson(artifactPaths['launch-scraper-field-contract']);
const fixtureMatrix = readJson(artifactPaths['launch-scraper-fixture-matrix']);
const falsePositiveTaxonomy = readJson(artifactPaths['launch-scraper-false-positive-taxonomy']);
const queueFalsePositiveRisk = readJson(artifactPaths['launch-scraper-queue-false-positive-risk']);
const lifecycleContract = readJson(artifactPaths['launch-scraper-lifecycle-contract']);
const stagingSupportMatrix = readJson(artifactPaths['launch-scraper-staging-support-matrix']);
const readinessBoard = readJson(artifactPaths['launch-scraper-readiness-board']);
const gapRegistry = readJson(artifactPaths['launch-scraper-gap-registry']);
const runbook = readJson(artifactPaths['launch-scraper-runbook']);
const artifactContract = readJson(artifactPaths['launch-scraper-artifact-contract']);
const provenance = readJson(artifactPaths['launch-scraper-provenance-contract']);
const queueGovernance = readJson(artifactPaths['launch-scraper-queue-governance']);
const qaPack = readJson(artifactPaths['launch-scraper-qa-pack']);
const negativeFixturePlan = readJson(artifactPaths['launch-scraper-negative-fixture-plan']);
const negativeFixtureCapturePacket = readJson(artifactPaths['launch-scraper-negative-fixture-capture-packet']);
const negativeFixtureClosureStatus = readJson(artifactPaths['launch-scraper-negative-fixture-closure-status']);

const canonicalFamilies = sorted(contract.launchFamilyOrder || []);
const fieldFamilies = familiesFrom(fieldContract.familyFieldContracts);
const fixtureFamilies = familiesFrom(fixtureMatrix.familyFixtureMatrix);
const lifecycleFamilies = familiesFrom(lifecycleContract.familyLifecycles);
const stagingFamilies = familiesFrom(stagingSupportMatrix.rows);
const readinessFamilies = familiesFrom(readinessBoard.rows);
const gapFamilies = familiesFrom(gapRegistry.rows);
const runbookFamilies = familiesFrom(runbook.familyRunbooks);
const provenanceFamilies = familiesFrom(provenance.familyContracts);
const qaFamilies = familiesFrom(qaPack.familyQaPacks);
const coverageByFamily = new Map((readinessBoard.rows || []).map((row) => [row.family, row]));
const realCoverageByFamily = new Map((readJson(artifactPaths['launch-scraper-fixture-coverage-audit']).rows || []).map((row) => [row.family, row]));
const falsePositiveFamilies = sorted(new Set((falsePositiveTaxonomy.rows || []).flatMap((row) => row.appliesToFamilies || []).filter(Boolean)));

const checks = [
  {
    id: 'artifact_presence',
    passed: artifactNames.every((name) => fs.existsSync(artifactPaths[name])),
    detail: `requiredArtifacts=${artifactNames.length}`,
  },
  {
    id: 'canonical_family_count',
    passed: canonicalFamilies.length === 9,
    detail: `canonicalFamilyCount=${canonicalFamilies.length}`,
  },
  {
    id: 'field_contract_family_match',
    passed: JSON.stringify(fieldFamilies) === JSON.stringify(canonicalFamilies),
    detail: `fieldFamilies=${fieldFamilies.join(',')}`,
  },
  {
    id: 'fixture_matrix_family_match',
    passed: JSON.stringify(fixtureFamilies) === JSON.stringify(canonicalFamilies),
    detail: `fixtureFamilies=${fixtureFamilies.join(',')}`,
  },
  {
    id: 'false_positive_taxonomy_covers_launch_families',
    passed: ['education_routing', 'knowledge_content', 'programs_benefits', 'waivers', 'program_waitlists', 'medicaid_hhs_offices', 'providers_care', 'dd_routing'].every((family) => falsePositiveFamilies.includes(family)),
    detail: `falsePositiveFamilies=${falsePositiveFamilies.join(',')}`,
  },
  {
    id: 'lifecycle_contract_family_match',
    passed: JSON.stringify(lifecycleFamilies) === JSON.stringify(canonicalFamilies),
    detail: `lifecycleFamilies=${lifecycleFamilies.join(',')}`,
  },
  {
    id: 'staging_support_family_match',
    passed: JSON.stringify(stagingFamilies) === JSON.stringify(canonicalFamilies),
    detail: `stagingFamilies=${stagingFamilies.join(',')}`,
  },
  {
    id: 'readiness_board_family_match',
    passed: JSON.stringify(readinessFamilies) === JSON.stringify(canonicalFamilies),
    detail: `readinessFamilies=${readinessFamilies.join(',')}`,
  },
  {
    id: 'gap_registry_subset_valid',
    passed: gapFamilies.every((family) => canonicalFamilies.includes(family)),
    detail: `gapFamilies=${gapFamilies.join(',')}`,
  },
  {
    id: 'runbook_family_match',
    passed: JSON.stringify(runbookFamilies) === JSON.stringify(canonicalFamilies),
    detail: `runbookFamilies=${runbookFamilies.join(',')}`,
  },
  {
    id: 'provenance_family_match',
    passed: JSON.stringify(provenanceFamilies) === JSON.stringify(canonicalFamilies),
    detail: `provenanceFamilies=${provenanceFamilies.join(',')}`,
  },
  {
    id: 'qa_pack_family_match',
    passed: JSON.stringify(qaFamilies) === JSON.stringify(canonicalFamilies),
    detail: `qaFamilies=${qaFamilies.join(',')}`,
  },
  {
    id: 'queue_governance_has_ready_lane',
    passed: (queueGovernance.launchNeedClassRules || []).some((rule) => rule.class === 'ready_target_scrape'),
    detail: 'ready_target_scrape present',
  },
  {
    id: 'artifact_contract_has_resume_guarantees',
    passed: Array.isArray(artifactContract.resumeSafetyContract?.guarantees) && artifactContract.resumeSafetyContract.guarantees.length > 0,
    detail: `resumeGuarantees=${artifactContract.resumeSafetyContract?.guarantees?.length || 0}`,
  },
  {
    id: 'inventory_has_launch_rows',
    passed: Number(inventory.summary?.launchCriticalUniqueUrls || 0) > 0,
    detail: `launchCriticalUniqueUrls=${inventory.summary?.launchCriticalUniqueUrls || 0}`,
  },
  {
    id: 'inventory_ready_matches_governance_count',
    passed: Number(inventory.summary?.byLaunchNeedClass?.ready_target_scrape || 0) === Number(queueGovernance.queueClassCounts?.ready_target_scrape || 0),
    detail: `inventoryReady=${inventory.summary?.byLaunchNeedClass?.ready_target_scrape || 0}; governanceReady=${queueGovernance.queueClassCounts?.ready_target_scrape || 0}`,
  },
  {
    id: 'qa_pack_has_real_cases',
    passed: (qaPack.familyQaPacks || []).some((pack) => pack.hasRealAcceptedCase) && (qaPack.familyQaPacks || []).some((pack) => pack.hasRealRejectedCase),
    detail: `acceptedFamilies=${(qaPack.familyQaPacks || []).filter((pack) => pack.hasRealAcceptedCase).length}; rejectedFamilies=${(qaPack.familyQaPacks || []).filter((pack) => pack.hasRealRejectedCase).length}`,
  },
  {
    id: 'false_positive_taxonomy_has_real_examples',
    passed: (falsePositiveTaxonomy.rows || []).every((row) => Array.isArray(row.examples) && row.examples.length > 0),
    detail: `classesWithExamples=${(falsePositiveTaxonomy.rows || []).filter((row) => Array.isArray(row.examples) && row.examples.length > 0).length}`,
  },
  {
    id: 'queue_false_positive_risk_has_launch_rows',
    passed: Number(queueFalsePositiveRisk.summary?.rowCount || 0) > 0,
    detail: `queueRiskRows=${queueFalsePositiveRisk.summary?.rowCount || 0}`,
  },
  {
    id: 'queue_false_positive_risk_flags_live_refresh_placeholder_domains',
    passed: Number(queueFalsePositiveRisk.queueSafety?.placeholderLiveRefreshRows || 0) > 0,
    detail: `placeholderLiveRefreshRows=${queueFalsePositiveRisk.queueSafety?.placeholderLiveRefreshRows || 0}`,
  },
  {
    id: 'queue_false_positive_risk_keeps_placeholder_domains_out_of_ready_scrape',
    passed: Number(queueFalsePositiveRisk.queueSafety?.placeholderReadyRows || 0) === 0,
    detail: `placeholderReadyRows=${queueFalsePositiveRisk.queueSafety?.placeholderReadyRows || 0}`,
  },
  {
    id: 'readiness_board_matches_fixture_coverage',
    passed: canonicalFamilies.every((family) => {
      const readiness = coverageByFamily.get(family);
      const realCoverage = realCoverageByFamily.get(family);
      if (!readiness || !realCoverage) return false;
      return readiness.fixtureCoverageClass === realCoverage.coverageClass
        && readiness.fixtureGap === (realCoverage.gap || '');
    }),
    detail: canonicalFamilies.map((family) => {
      const readiness = coverageByFamily.get(family);
      const realCoverage = realCoverageByFamily.get(family);
      return `${family}:${readiness?.fixtureCoverageClass || 'missing'}/${realCoverage?.coverageClass || 'missing'}`;
    }).join('; '),
  },
  {
    id: 'negative_fixture_packet_matches_plan',
    passed: Number(negativeFixturePlan.rowCount || 0) === Number(negativeFixtureCapturePacket.rowCount || 0),
    detail: `planRows=${negativeFixturePlan.rowCount || 0}; captureRows=${negativeFixtureCapturePacket.rowCount || 0}`,
  },
  {
    id: 'negative_fixture_packet_has_commands',
    passed: (negativeFixtureCapturePacket.rows || []).every((row) => Array.isArray(row.preferredCommands) && row.preferredCommands.length > 0),
    detail: `rowsWithCommands=${(negativeFixtureCapturePacket.rows || []).filter((row) => Array.isArray(row.preferredCommands) && row.preferredCommands.length > 0).length}`,
  },
  {
    id: 'negative_fixture_closure_tracks_open_rows',
    passed: Number(negativeFixtureClosureStatus.openCount || 0) === Number(negativeFixturePlan.rowCount || 0),
    detail: `openCount=${negativeFixtureClosureStatus.openCount || 0}; plannedRows=${negativeFixturePlan.rowCount || 0}`,
  },
  {
    id: 'lifecycle_contract_has_resume_guarantees',
    passed: Array.isArray(lifecycleContract.resumeSafetyGuarantees) && lifecycleContract.resumeSafetyGuarantees.length > 0,
    detail: `resumeGuarantees=${lifecycleContract.resumeSafetyGuarantees?.length || 0}`,
  },
  {
    id: 'staging_support_has_full_launch_family_coverage',
    passed: Number(stagingSupportMatrix.unsupportedFamilyCount || 0) === 0,
    detail: `unsupportedFamilyCount=${stagingSupportMatrix.unsupportedFamilyCount || 0}`,
  },
  {
    id: 'readiness_board_flags_known_spec_gaps',
    passed:
      !(readinessBoard.rows || []).some((row) => row.topSpecGap === 'missing_real_rejected_fixture')
      && !(readinessBoard.rows || []).some((row) => row.family === 'program_waitlists' && row.topSpecGap === 'no_staging_mapping'),
    detail: 'no launch family retains the old rejected-fixture or waitlist staging spec gaps',
  },
  {
    id: 'gap_registry_row_count_matches_known_gaps',
    passed: Number(gapRegistry.rowCount || 0) === 0,
    detail: `gapRegistryRows=${gapRegistry.rowCount || 0}`,
  },
];

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  purpose: 'Meta-audit for launch scraper specification artifacts so the full spec stack can be checked with one command.',
  artifactPaths: Object.fromEntries(Object.entries(artifactPaths).map(([key, value]) => [key, path.relative(repoRoot, value)])),
  canonicalFamilies,
  checks,
  passedCheckCount: checks.filter((check) => check.passed).length,
  failedCheckCount: checks.filter((check) => !check.passed).length,
  overallPassed: checks.every((check) => check.passed),
};

const mdLines = [
  '# Launch Scraper Meta Audit',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  `- overallPassed: ${payload.overallPassed}`,
  `- passedCheckCount: ${payload.passedCheckCount}`,
  `- failedCheckCount: ${payload.failedCheckCount}`,
  '',
  '## Canonical Families',
  '',
  ...payload.canonicalFamilies.map((family) => `- ${family}`),
  '',
  '## Checks',
  '',
];

for (const check of checks) {
  mdLines.push(`- ${check.id}: ${check.passed ? 'PASS' : 'FAIL'} (${check.detail})`);
}

mdLines.push('', '## Artifact Paths', '');
for (const [key, value] of Object.entries(payload.artifactPaths)) {
  mdLines.push(`- ${key}: \`${value}\``);
}
mdLines.push('');

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  overallPassed: payload.overallPassed,
  failedCheckCount: payload.failedCheckCount,
}, null, 2));
