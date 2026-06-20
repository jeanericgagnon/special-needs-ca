import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

function makeTempRepo(name) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  fs.mkdirSync(path.join(root, 'data', 'source_packs'), { recursive: true });
  fs.mkdirSync(path.join(root, 'data', 'source_targets'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs', 'generated'), { recursive: true });
  return root;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function writeNdjson(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : '')
  );
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function runNode(scriptRelativePath, { cwd = repoRoot, env = {}, args = [] } = {}) {
  const scriptPath = path.join(repoRoot, scriptRelativePath);
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd,
    env: {
      ...process.env,
      ...env,
    },
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }

  const stdout = result.stdout.trim();
  return stdout ? JSON.parse(stdout) : null;
}

function runNodeExpectFailure(scriptRelativePath, { cwd = repoRoot, env = {}, args = [] } = {}) {
  const scriptPath = path.join(repoRoot, scriptRelativePath);
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd,
    env: {
      ...process.env,
      ...env,
    },
    encoding: 'utf8',
  });

  assert.notEqual(result.status, 0, `Expected ${scriptRelativePath} to fail.`);
  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function runNodeAllowText(scriptRelativePath, { cwd = repoRoot, env = {}, args = [] } = {}) {
  const scriptPath = path.join(repoRoot, scriptRelativePath);
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd,
    env: {
      ...process.env,
      ...env,
    },
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }

  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function testOfficialFollowupQueueReconcilesLiveRows() {
  const fixtureRoot = makeTempRepo('official-followup');
  writeJson(path.join(fixtureRoot, 'data', 'source_packs', 'official_state_domain_repairs.json'), {
    rows: [
      {
        stateId: 'north-carolina',
        targetTable: 'regional_education_agencies',
        lane: 'education_routing',
        sourceName: 'North Carolina Regional Special Education Support',
        fakeSourceUrl: 'https://education.north-carolina.gov/regional',
        replacementMode: 'first_party_root_hint_only',
        firstPartyRootHintCount: 1,
        replacementCandidates: [
          { confidence: 'low', url: 'https://www.dpi.nc.gov/' },
        ],
        desiredEvidence: 'Verified official regional education or district directory page.',
      },
      {
        stateId: 'florida',
        targetTable: 'state_resource_agencies',
        lane: 'early_intervention',
        sourceName: 'Florida Early Steps Local Directories',
        fakeSourceUrl: 'https://www.cmsplan.floridahealth.gov/earlysteps/directories',
        replacementMode: 'first_party_root_hint_only',
        firstPartyRootHintCount: 1,
        replacementCandidates: [
          { confidence: 'low', url: 'https://www.floridaearlysteps.com/' },
        ],
        desiredEvidence: 'Verified official Part C / early intervention page or local intake directory.',
      },
    ],
  });

  writeJson(path.join(fixtureRoot, 'data', 'source_targets', 'north-carolina.json'), {
    targets: [
      {
        target_table: 'regional_education_agencies',
        source_name: 'NCDPI School Districts Directory',
        source_url: 'https://www.dpi.nc.gov/districts-schools/district-operations/financial-and-business-services/demographics-and-enrollment/school-district-maps',
      },
    ],
  });

  writeJson(path.join(fixtureRoot, 'data', 'source_targets', 'florida.json'), {
    targets: [
      {
        target_table: 'state_resource_agencies',
        source_name: 'Florida Early Steps Local Directories',
        source_url: 'https://www.cmsplan.floridahealth.gov/earlysteps/directories',
      },
    ],
  });

  runNode('src/db/generate_official_domain_followup_queue.js', {
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  const queue = readJson(path.join(fixtureRoot, 'docs', 'generated', `official-domain-followup-queue-${generatedDate}.json`));
  assert.equal(queue.summary.totalRows, 1);
  assert.deepEqual(queue.summary.byState, { florida: 1 });
  assert.equal(queue.rows[0].stateId, 'florida');
}

function testOfficialFollowupDecisionDryRunStaysTrimmedToLiveRows() {
  const fixtureRoot = makeTempRepo('official-followup-decisions');
  writeJson(path.join(fixtureRoot, 'data', 'source_targets', 'florida.json'), {
    targets: [
      {
        target_table: 'state_resource_agencies',
        source_name: 'Florida Early Steps Local Directories',
        source_url: 'https://www.cmsplan.floridahealth.gov/earlysteps/directories',
      },
    ],
  });

  writeJson(path.join(fixtureRoot, 'data', 'official-domain-followup-decisions.json'), {
    rows: [
      {
        stateId: 'florida',
        targetTable: 'state_resource_agencies',
        sourceName: 'Florida Early Steps Local Directories',
        fakeSourceUrl: 'https://www.cmsplan.floridahealth.gov/earlysteps/directories',
        followupType: 'first_party_root_hint_verification',
        replacementCandidates: [
          {
            name: 'Florida Early Steps Program',
            url: 'https://www.floridaearlysteps.com/',
            confidence: 'low',
            origin: 'existing_state_source_targets',
            matchType: 'same_state_same_lane',
          },
        ],
        decisionMode: '',
        chosenCandidateUrl: '',
        verifiedReplacementUrl: '',
        verifiedReplacementName: '',
        reviewNotes: '',
        reviewedBy: '',
      },
    ],
  });

  const output = runNode('scripts/apply-official-domain-followup-decisions.mjs', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  const report = readJson(output.report.json);
  assert.equal(report.summary.inputRows, 1);
  assert.equal(report.summary.appliedStates, 0);
  assert.deepEqual(report.summary.skippedByReason, {
    missing_reviewed_by: 1,
  });
}

function testOfficialFollowupQueueExcludesReviewedSkipRows() {
  const fixtureRoot = makeTempRepo('official-followup-skip-rows');
  writeJson(path.join(fixtureRoot, 'data', 'source_packs', 'official_state_domain_repairs.json'), {
    rows: [
      {
        stateId: 'arizona',
        targetTable: 'county_offices',
        lane: 'medicaid_county_directory',
        sourceName: 'Arizona Medicaid Portal',
        fakeSourceUrl: 'https://dhhs.arizona.gov/',
        replacementMode: 'first_party_root_hint_only',
        firstPartyRootHintCount: 2,
        desiredEvidence: 'Verified official county or regional Medicaid / social services directory URL.',
        replacementCandidates: [
          {
            origin: 'state_programs_map',
            name: 'AHCCCS Medical Assistance',
            url: 'https://www.azahcccs.gov/',
            matchType: 'state_programs_map',
            confidence: 'low',
          },
        ],
      },
      {
        stateId: 'florida',
        targetTable: 'state_resource_agencies',
        lane: 'early_intervention',
        sourceName: 'Florida Early Steps Local Directories',
        fakeSourceUrl: 'https://www.cmsplan.floridahealth.gov/earlysteps/directories',
        replacementMode: 'first_party_root_hint_only',
        firstPartyRootHintCount: 1,
        desiredEvidence: 'Verified official Part C / early intervention page or local intake directory.',
        replacementCandidates: [
          {
            origin: 'existing_state_source_targets',
            name: 'Florida Early Steps Program',
            url: 'https://www.floridaearlysteps.com/',
            matchType: 'same_state_same_lane',
            confidence: 'low',
          },
        ],
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source_targets', 'arizona.json'), {
    targets: [
      {
        target_table: 'county_offices',
        source_name: 'Arizona Medicaid Portal',
        source_url: 'https://dhhs.arizona.gov/',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source_targets', 'florida.json'), {
    targets: [
      {
        target_table: 'state_resource_agencies',
        source_name: 'Florida Early Steps Local Directories',
        source_url: 'https://www.cmsplan.floridahealth.gov/earlysteps/directories',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'official-domain-followup-decisions.json'), {
    rows: [
      {
        stateId: 'arizona',
        targetTable: 'county_offices',
        sourceName: 'Arizona Medicaid Portal',
        fakeSourceUrl: 'https://dhhs.arizona.gov/',
        decisionMode: 'skip_followup',
        reviewNotes: 'Explicitly categorized as unresolved until a stronger office-directory source is authored.',
        reviewedBy: 'codex',
      },
    ],
  });

  runNode('src/db/generate_official_domain_followup_queue.js', {
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  const queue = readJson(path.join(fixtureRoot, 'docs', 'generated', `official-domain-followup-queue-${generatedDate}.json`));
  assert.equal(queue.summary.totalRows, 1);
  assert.deepEqual(queue.summary.byState, { florida: 1 });
  assert.equal(queue.rows[0].stateId, 'florida');
}

function testOfficialFollowupQueueExcludesReviewedAppliedRows() {
  const fixtureRoot = makeTempRepo('official-followup-applied-rows');
  writeJson(path.join(fixtureRoot, 'data', 'source_packs', 'official_state_domain_repairs.json'), {
    rows: [
      {
        stateId: 'indiana',
        targetTable: 'programs',
        lane: 'waiver_program',
        sourceName: 'Indiana HCBS Waivers Page',
        fakeSourceUrl: 'https://dhhs.indiana.gov/dd/waivers',
        replacementMode: 'multiple_exact_candidates',
        exactCandidateCount: 2,
        desiredEvidence: 'Verified official waiver program page on a first-party state agency domain.',
        replacementCandidates: [
          {
            origin: 'state_programs_map',
            name: 'Indiana HCBS Waivers',
            url: 'https://www.in.gov/fssa/ddrs/hcbs',
            matchType: 'state_programs_map',
            confidence: 'medium',
          },
          {
            origin: 'state_programs_map',
            name: 'Indiana HCBS Waivers Eligibility',
            url: 'https://www.in.gov/fssa/ddrs/hcbs/eligibility',
            matchType: 'state_programs_map',
            confidence: 'medium',
          },
        ],
      },
      {
        stateId: 'florida',
        targetTable: 'state_resource_agencies',
        lane: 'early_intervention',
        sourceName: 'Florida Early Steps Local Directories',
        fakeSourceUrl: 'https://www.cmsplan.floridahealth.gov/earlysteps/directories',
        replacementMode: 'first_party_root_hint_only',
        firstPartyRootHintCount: 1,
        desiredEvidence: 'Verified official Part C / early intervention page or local intake directory.',
        replacementCandidates: [
          {
            origin: 'existing_state_source_targets',
            name: 'Florida Early Steps Program',
            url: 'https://www.floridaearlysteps.com/',
            matchType: 'same_state_same_lane',
            confidence: 'low',
          },
        ],
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source_targets', 'indiana.json'), {
    targets: [
      {
        target_table: 'programs',
        source_name: 'Indiana HCBS Waivers Page',
        source_url: 'https://dhhs.indiana.gov/dd/waivers',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source_targets', 'florida.json'), {
    targets: [
      {
        target_table: 'state_resource_agencies',
        source_name: 'Florida Early Steps Local Directories',
        source_url: 'https://www.cmsplan.floridahealth.gov/earlysteps/directories',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'official-domain-followup-decisions.json'), {
    rows: [
      {
        stateId: 'indiana',
        targetTable: 'programs',
        sourceName: 'Indiana HCBS Waivers Page',
        fakeSourceUrl: 'https://dhhs.indiana.gov/dd/waivers',
        decisionMode: 'choose_exact_candidate',
        chosenCandidateUrl: 'https://www.in.gov/fssa/ddrs/hcbs',
        reviewNotes: 'Reviewed and applied.',
        reviewedBy: 'codex',
      },
    ],
  });

  runNode('src/db/generate_official_domain_followup_queue.js', {
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  const queue = readJson(path.join(fixtureRoot, 'docs', 'generated', `official-domain-followup-queue-${generatedDate}.json`));
  assert.equal(queue.summary.totalRows, 1);
  assert.deepEqual(queue.summary.byState, { florida: 1 });
  assert.equal(queue.rows[0].stateId, 'florida');
}

function testProviderPlaceholderEmptyQueueStaysEmptyDownstream() {
  const fixtureRoot = makeTempRepo('provider-placeholder');
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-replacement-queue-${generatedDate}.json`), {
    generatedAt: generatedDate,
    summary: {
      totalRows: 0,
      statesNeedingPlaceholderReplacement: 0,
      byState: {},
      byDomain: {},
      byReadinessLane: {},
    },
    rows: [],
  });

  runNode('src/db/generate_provider_placeholder_authoring_briefs.js', {
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });
  runNode('src/db/generate_provider_placeholder_replacement_decision_template.js', {
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  const briefs = readJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-authoring-briefs-${generatedDate}.json`));
  const template = readJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-replacement-decision-template-${generatedDate}.json`));
  assert.equal(briefs.summary.totalBriefs, 0);
  assert.deepEqual(briefs.briefs, []);
  assert.deepEqual(template.rows, []);
}

function testProviderPlaceholderDecisionDryRunStaysIdleWhenRowsAreEmpty() {
  const fixtureRoot = makeTempRepo('provider-placeholder-decisions');
  writeJson(path.join(fixtureRoot, 'data', 'provider-placeholder-replacement-decisions.json'), {
    generatedAt: generatedDate,
    sourceBriefs: `docs/generated/provider-placeholder-authoring-briefs-${generatedDate}.json`,
    rows: [],
  });

  const output = runNode('scripts/apply-provider-placeholder-replacements.mjs', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  const report = readJson(output.report.json);
  assert.equal(report.summary.inputRows, 0);
  assert.equal(report.summary.appliedStates, 0);
  assert.equal(report.summary.appliedReplacements, 0);
  assert.deepEqual(report.summary.skippedByReason, {});
}

function testProviderPlaceholderApplyMutatesSourceTargets() {
  const fixtureRoot = makeTempRepo('provider-placeholder-apply');
  writeJson(path.join(fixtureRoot, 'data', 'provider-placeholder-replacement-decisions.json'), {
    rows: [
      {
        stateId: 'georgia',
        placeholderSourceNames: ['GEORGIA Specialized Clinic Roster #1'],
        placeholderSourceUrls: ['https://dch.georgia.gov/specialized-roster-1'],
        reviewedBy: 'codex',
        replacements: [
          {
            source_name: 'Marcus Autism Center',
            source_url: 'https://www.marcus.org/',
            organization_type: 'hospital_system',
            crawl_method: 'static_fetch',
            notes: 'First-party provider homepage.',
          },
          {
            source_name: 'Marcus Autism Center Contact Us',
            source_url: 'https://www.marcus.org/contact-us',
            organization_type: 'hospital_system',
            crawl_method: 'static_fetch',
            notes: 'First-party provider contact page.',
          },
        ],
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source_targets', 'georgia.json'), [
    {
      source_name: 'Keep Me',
      source_url: 'https://example.org/keep',
      target_table: 'programs',
      state: 'GA',
    },
    {
      source_name: 'GEORGIA Specialized Clinic Roster #1',
      source_url: 'https://dch.georgia.gov/specialized-roster-1',
      target_table: 'resource_providers',
      organization_type: 'provider',
      crawl_method: 'static_fetch',
      expected_extraction_fields: 'name, address, phone',
      state: 'GA',
    },
    {
      source_name: 'Keep Provider',
      source_url: 'https://example.org/provider',
      target_table: 'resource_providers',
      state: 'GA',
    },
  ]);

  const output = runNode('scripts/apply-provider-placeholder-replacements.mjs', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
    args: ['--apply'],
  });

  const report = readJson(output.report.json);
  const targets = readJson(path.join(fixtureRoot, 'data', 'source_targets', 'georgia.json'));
  assert.equal(report.summary.appliedStates, 1);
  assert.equal(report.summary.appliedPlaceholderRows, 1);
  assert.equal(report.summary.appliedReplacements, 2);
  assert.equal(targets.length, 4);
  assert.equal(targets[1].source_name, 'Marcus Autism Center');
  assert.equal(targets[1].source_url, 'https://www.marcus.org/');
  assert.equal(targets[2].source_name, 'Marcus Autism Center Contact Us');
  assert.equal(targets[3].source_name, 'Keep Provider');
  assert.equal(targets.some((item) => item.source_name === 'GEORGIA Specialized Clinic Roster #1'), false);
}

function testProviderPlaceholderApplyFallsBackToSingleBlockedDomainScaffold() {
  const fixtureRoot = makeTempRepo('provider-placeholder-blocked-domain-fallback');
  writeJson(path.join(fixtureRoot, 'data', 'provider-placeholder-replacement-decisions.json'), {
    rows: [
      {
        stateId: 'alaska',
        placeholderSourceNames: ['anthc.org'],
        placeholderSourceUrls: ['https://www.anthc.org/what-we-do/alaska-native-medical-center/pediatrics'],
        reviewedBy: 'codex',
        replacements: [
          {
            source_name: 'Alaska Native Medical Center',
            source_url: 'https://anmc.org/',
            organization_type: 'hospital',
            crawl_method: 'static_fetch',
            notes: 'First-party provider homepage.',
          },
          {
            source_name: 'ANMC Specialty Care',
            source_url: 'https://anthc.org/patient-care/specialty-care/',
            organization_type: 'specialty_center',
            crawl_method: 'static_fetch',
            notes: 'First-party specialty care page.',
          },
        ],
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source_targets', 'alaska.json'), [
    {
      source_name: 'Keep Me',
      source_url: 'https://example.org/keep',
      target_table: 'programs',
      state: 'AK',
    },
    {
      source_name: 'Alaska Children\'s Hospital Clinics',
      source_url: 'https://www.childrenshospital.org',
      target_table: 'resource_providers',
      organization_type: 'hospital',
      crawl_method: 'manual_review',
      expected_extraction_fields: 'name, address, phone',
      state: 'AK',
    },
  ]);

  const output = runNode('scripts/apply-provider-placeholder-replacements.mjs', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
    args: ['--apply'],
  });

  const report = readJson(output.report.json);
  const targets = readJson(path.join(fixtureRoot, 'data', 'source_targets', 'alaska.json'));
  assert.equal(report.summary.appliedStates, 1);
  assert.equal(report.summary.appliedPlaceholderRows, 1);
  assert.equal(report.summary.appliedReplacements, 2);
  assert.equal(report.decisions[0].matchStrategy, 'single_blocked_domain_scaffold_fallback');
  assert.equal(targets.length, 3);
  assert.equal(targets[1].source_name, 'Alaska Native Medical Center');
  assert.equal(targets[1].source_url, 'https://anmc.org/');
  assert.equal(targets[2].source_name, 'ANMC Specialty Care');
  assert.equal(targets.some((item) => item.source_url === 'https://www.childrenshospital.org'), false);
}

function testProviderPlaceholderQueueCapturesSyntheticRosters() {
  const fixtureRoot = makeTempRepo('provider-synthetic-roster');

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-buildout-priority-plan-${generatedDate}.json`), {
    lanes: {
      missingProviderSorted: [
        {
          stateId: 'georgia',
          stateName: 'Georgia',
          countyCount: 159,
          publicSafeNonprofits: 25,
          advocatePublicSafeCount: 10,
        },
      ],
    },
  });

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `master-source-target-ledger-${generatedDate}.json`), {
    ledger: [
      {
        stateId: 'georgia',
        stateName: 'georgia',
        gapFamily: 'providers_care',
        ledgerStatus: 'source_repair',
        origin: 'state_source_targets',
        sourceName: 'GEORGIA Specialized Clinic Roster #1',
        sourceUrl: 'https://dch.georgia.gov/specialized-roster-1',
        domain: 'dch.georgia.gov',
        crawlMethod: 'static_fetch',
        priority: 3,
        expectedExtractionFields: 'name, address, phone',
        notes: 'Synthetic provider roster target.',
      },
    ],
  });

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-followup-blocker-registry-${generatedDate}.json`), {
    summary: {
      totalRepeatedRows: 0,
      byBucket: {},
    },
    rows: [],
  });

  writeJson(path.join(fixtureRoot, 'data', 'source_targets', 'georgia.json'), [
    {
      source_name: 'GEORGIA Specialized Clinic Roster #1',
      source_url: 'https://dch.georgia.gov/specialized-roster-1',
      target_table: 'resource_providers',
      organization_type: 'provider',
      crawl_method: 'static_fetch',
      expected_extraction_fields: 'name, address, phone',
    },
  ]);

  runNodeAllowText('src/db/generate_provider_source_pack_plan.js', {
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });
  runNode('src/db/generate_provider_placeholder_replacement_queue.js', {
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  const queue = readJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-replacement-queue-${generatedDate}.json`));
  assert.equal(queue.summary.totalRows, 1);
  assert.equal(queue.rows[0].stateId, 'georgia');
  assert.equal(queue.rows[0].placeholderSourceUrl, 'https://dch.georgia.gov/specialized-roster-1');
  assert.equal(queue.rows[0].sourceOrigin, 'master_source_target_ledger');
}

function testProviderPlaceholderQueueExcludesHistoricalRunRowsForStatesNoLongerNeedingReplacement() {
  const fixtureRoot = makeTempRepo('provider-placeholder-historical-run-filter');

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-buildout-priority-plan-${generatedDate}.json`), {
    lanes: {
      missingProviderSorted: [
        {
          stateId: 'alaska',
          stateName: 'Alaska',
          countyCount: 1,
          publicSafeNonprofits: 1,
          advocatePublicSafeCount: 1,
        },
      ],
    },
  });

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `master-source-target-ledger-${generatedDate}.json`), {
    ledger: [
      {
        stateId: 'alaska',
        stateName: 'Alaska',
        gapFamily: 'providers_care',
        ledgerStatus: 'source_repair',
        origin: 'state_source_targets',
        sourceName: 'anthc.org',
        sourceUrl: 'https://www.anthc.org/what-we-do/alaska-native-medical-center/pediatrics',
        domain: 'anthc.org',
        crawlMethod: 'static_fetch',
        priority: 1,
        expectedExtractionFields: 'name, address, phone',
        notes: 'Historical stale provider row.',
      },
    ],
  });

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-followup-blocker-registry-${generatedDate}.json`), {
    summary: {
      totalRepeatedRows: 0,
      byBucket: {},
    },
    rows: [],
  });

  writeJson(path.join(fixtureRoot, 'data', 'source_targets', 'alaska.json'), [
    {
      source_name: 'Alaska Native Medical Center',
      source_url: 'https://anmc.org/',
      domain: 'anmc.org',
      target_table: 'resource_providers',
      organization_type: 'hospital',
      crawl_method: 'static_fetch',
      expected_extraction_fields: 'name, address, phone',
    },
    {
      source_name: 'ANMC Specialty Care',
      source_url: 'https://anthc.org/patient-care/specialty-care/',
      domain: 'anthc.org',
      target_table: 'resource_providers',
      organization_type: 'specialty_center',
      crawl_method: 'static_fetch',
      expected_extraction_fields: 'name, address, phone',
    },
    {
      source_name: 'Behavioral Health Wellness Clinic at ANMC',
      source_url: 'https://anthc.org/patient-care/bhwc/',
      domain: 'anthc.org',
      target_table: 'resource_providers',
      organization_type: 'specialty_center',
      crawl_method: 'static_fetch',
      expected_extraction_fields: 'name, address, phone',
    },
  ]);

  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-runs', '2026-06-18T00-00-00-000Z', 'followups', 'source-repair.json'), [
    {
      stateId: 'alaska',
      gapFamily: 'providers_care',
      sourceUrl: 'https://www.anthc.org/what-we-do/alaska-native-medical-center/pediatrics',
      hostname: 'anthc.org',
      followupReason: 'stale_or_invalid_404',
    },
  ]);

  runNodeAllowText('src/db/generate_provider_source_pack_plan.js', {
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });
  const output = runNode('src/db/generate_provider_placeholder_replacement_queue.js', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  assert.equal(output.summary.totalRows, 0);
  assert.equal(output.summary.statesNeedingPlaceholderReplacement, 0);
}

function testFormsRepairReportSeparatesFallbackReasons() {
  const fixtureRoot = makeTempRepo('forms-repair');
  writeJson(path.join(fixtureRoot, 'data', 'source_packs', 'forms_source_pack.json'), {
    rows: [
      {
        stateId: 'alaska',
        replacementClass: 'state_specific_form_fallback_only',
        blockedFormsTarget: { sourceName: 'Alaska Forms', sourceUrl: 'https://dhhs.alaska.gov/forms' },
        topCandidates: [
          { candidateType: 'application_or_eligibility_guide', sourceUrl: 'https://dhss.alaska.gov/eligibility' },
        ],
      },
      {
        stateId: 'arizona',
        replacementClass: 'state_specific_form_fallback_only',
        blockedFormsTarget: { sourceName: 'Arizona Forms', sourceUrl: 'https://dhhs.arizona.gov/forms' },
        topCandidates: [
          { candidateType: 'general_form_related_page', sourceUrl: 'https://azahcccs.gov/' },
        ],
      },
      {
        stateId: 'new-mexico',
        replacementClass: 'federal_only_form_fallback',
        blockedFormsTarget: { sourceName: 'New Mexico Forms', sourceUrl: 'https://dhhs.new-mexico.gov/forms' },
        topCandidates: [
          { candidateType: 'application_or_eligibility_guide', sourceUrl: 'https://www.ssa.gov/' },
        ],
      },
    ],
  });

  const output = runNode('scripts/apply-forms-library-repairs.mjs', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  const report = readJson(output.report.json);
  assert.equal(report.summary.eligibleRepairRows, 0);
  assert.equal(report.summary.nonRepairableRows, 3);
  assert.deepEqual(report.summary.nonRepairableByReason, {
    state_specific_fallback_only: 2,
    federal_only_fallback: 1,
  });
}

function testFormsFallbackRunnerWarnsOnFederalOnlyState() {
  const fixtureRoot = makeTempRepo('forms-fallback-federal-only');
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-scrape-queue-${generatedDate}.json`), {
    generatedAt: generatedDate,
    summary: {
      fallbackPackStates: 1,
      blockedFallbackStates: 0,
      excludedFederalOnlyStates: ['new-mexico'],
      totalQueueRows: 0,
      byCandidateType: {},
      byDomain: {},
    },
    rows: [],
  });

  const failure = runNodeExpectFailure('scripts/run-forms-fallback-source-acquisition.mjs', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });
  assert.match(failure.stderr, /requires --state=<state>/i);

  const warned = runNode('scripts/run-forms-fallback-source-acquisition.mjs', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
    args: ['--state=new-mexico'],
  });

  assert.equal(warned.selectedCount, 0);
  assert.equal(warned.warnings.length, 1);
  assert.equal(warned.warnings[0].code, 'federal_only_excluded_state');
  assert.equal(warned.warnings[0].stateId, 'new-mexico');
}

function testFormsFallbackRunnerWarnsWhenFiltersMatchNoRows() {
  const fixtureRoot = makeTempRepo('forms-fallback-no-match');
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-scrape-queue-${generatedDate}.json`), {
    generatedAt: generatedDate,
    summary: {
      fallbackPackStates: 1,
      blockedFallbackStates: 1,
      excludedFederalOnlyStates: [],
      totalQueueRows: 1,
      byCandidateType: {
        application_or_eligibility_guide: 1,
      },
      byDomain: {
        'dhss.alaska.gov': 1,
      },
    },
    rows: [
      {
        stateId: 'alaska',
        candidateType: 'application_or_eligibility_guide',
        sourceName: 'Alaska Dd Intake Request Guide',
        sourceUrl: 'https://dhss.alaska.gov/dsds/Pages/hcbw/eligibility.aspx',
      },
    ],
  });

  const output = runNode('scripts/run-forms-fallback-source-acquisition.mjs', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
    args: ['--state=florida'],
  });

  assert.equal(output.selectedCount, 0);
  assert.equal(output.warnings.length, 1);
  assert.equal(output.warnings[0].code, 'no_matching_queue_rows');
  assert.equal(output.warnings[0].stateId, 'florida');
}

function testFormsFallbackRunnerCapsStateRunAtFiveRows() {
  const fixtureRoot = makeTempRepo('forms-fallback-cap');
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-scrape-queue-${generatedDate}.json`), {
    generatedAt: generatedDate,
    summary: {
      fallbackPackStates: 1,
      blockedFallbackStates: 1,
      excludedFederalOnlyStates: [],
      totalQueueRows: 6,
    },
    rows: Array.from({ length: 6 }, (_, index) => ({
      stateId: 'indiana',
      candidateType: 'application_or_eligibility_guide',
      sourceName: `Indiana guide ${index + 1}`,
      sourceUrl: `https://in.gov/forms/${index + 1}`,
      blockedFormsSourceUrl: 'https://in.gov/forms',
      domain: 'in.gov',
    })),
  });

  const output = runNode('scripts/run-forms-fallback-source-acquisition.mjs', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
    args: ['--state=indiana', '--limit=99'],
  });

  assert.equal(output.selectedCount, 5);
  assert.equal(output.processedCount, 5);
  assert.equal(output.completedCount, 5);
  assert.equal(output.remainingCount, 0);

  const summary = readJson(output.report.summary);
  assert.equal(summary.selectedCount, 5);
  assert.equal(summary.dryRunQueued, 5);

  const progress = readJson(output.report.progress);
  assert.equal(progress.completedRowKeys.length, 5);
}

function testFormsFallbackRunnerSkipsPreviouslyCompletedStateRows() {
  const fixtureRoot = makeTempRepo('forms-fallback-completed-state');
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-scrape-queue-${generatedDate}.json`), {
    generatedAt: generatedDate,
    summary: {
      fallbackPackStates: 1,
      blockedFallbackStates: 1,
      excludedFederalOnlyStates: [],
      totalQueueRows: 2,
    },
    rows: [
      {
        stateId: 'idaho',
        candidateType: 'application_or_eligibility_guide',
        sourceName: 'Idaho Guide A',
        sourceUrl: 'https://idaho.gov/a',
        blockedFormsSourceUrl: 'https://idaho.gov/forms',
        domain: 'idaho.gov',
      },
      {
        stateId: 'idaho',
        candidateType: 'general_form_related_page',
        sourceName: 'Idaho Guide B',
        sourceUrl: 'https://idaho.gov/b',
        blockedFormsSourceUrl: 'https://idaho.gov/forms',
        domain: 'idaho.gov',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'forms-fallback-completion-ledger.json'), {
    rows: [
      {
        rowKey: 'idaho|application_or_eligibility_guide|https://idaho.gov/a',
        stateId: 'idaho',
        candidateType: 'application_or_eligibility_guide',
        sourceUrl: 'https://idaho.gov/a',
        status: 'complete',
      },
      {
        rowKey: 'idaho|general_form_related_page|https://idaho.gov/b',
        stateId: 'idaho',
        candidateType: 'general_form_related_page',
        sourceUrl: 'https://idaho.gov/b',
        status: 'complete',
      },
    ],
  });

  const output = runNode('scripts/run-forms-fallback-source-acquisition.mjs', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
    args: ['--state=idaho', '--limit=2'],
  });

  assert.equal(output.selectedCount, 0);
  assert.equal(output.processedCount, 0);
  assert.equal(output.warnings.length, 1);
  assert.equal(output.warnings[0].code, 'state_already_completed');
}

function testLowTokenControlPlaneAuditSummarizesLaneStatus() {
  const fixtureRoot = makeTempRepo('low-token-control-plane');
  const stubRegressionPath = path.join(fixtureRoot, 'stub-regression.mjs');
  fs.writeFileSync(stubRegressionPath, 'console.log("stub regression ok");\n');

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `official-domain-followup-queue-${generatedDate}.json`), {
    summary: {
      totalRows: 1,
      byState: {
        florida: 1,
      },
    },
    rows: [
      { stateId: 'florida' },
    ],
  });

  writeJson(path.join(fixtureRoot, 'data', 'official-domain-followup-decisions.json'), {
    rows: [
      { stateId: 'florida' },
    ],
  });

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-replacement-queue-${generatedDate}.json`), {
    summary: {
      totalRows: 0,
    },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-authoring-briefs-${generatedDate}.json`), {
    summary: {
      totalBriefs: 0,
    },
    briefs: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-replacement-decision-template-${generatedDate}.json`), {
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'provider-placeholder-replacement-decisions.json'), {
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-followup-repair-queue-${generatedDate}.json`), {
    summary: { totalRows: 1 },
    rows: [
      { stateId: 'tennessee', readinessLane: 'pull-now', actionClass: 'replace_domain', sourceUrl: 'https://www.lebonheur.org/' },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-repair-execution-backlog-${generatedDate}.json`), {
    summary: { totalRows: 1, firstExecutionLane: 'pull-now' },
    firstTwentyRows: [
      { stateId: 'tennessee', readinessLane: 'pull-now', actionClass: 'replace_domain', sourceUrl: 'https://www.lebonheur.org/' },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-runbook-${generatedDate}.json`), {
    summary: { pullNowRowCount: 0, pullNowStateCount: 0, firstActionClass: '' },
    stateSlices: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-decision-template-${generatedDate}.json`), { rows: [] });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-manual-fill-queue-${generatedDate}.json`), {
    summary: { unresolvedRows: 0, byActionClass: {}, byDecisionHint: {}, byState: {} },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-decision-progress-${generatedDate}.json`), {
    summary: { totalRows: 1, filledRows: 1, unresolvedRows: 0, completionPercent: 100 },
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-review-packet-${generatedDate}.json`), {
    summary: { statePacketCount: 0, firstState: '' },
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-state-packets-${generatedDate}.json`), {
    summary: { statePacketCount: 0, totalUnresolvedRows: 0, firstState: '' },
    packets: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'provider-pull-now-decisions.json'), { rows: [] });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'provider-pull-now-resolution-ledger.json'), { rows: [] });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-followup-blocker-registry-${generatedDate}.json`), {
    summary: { totalRepeatedRows: 1, byBucket: { blocked: 1 }, byReason: { dns_lookup_failed: 1 }, latestRunIds: ['run-1'] },
  });

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-scrape-queue-${generatedDate}.json`), {
    summary: {
      totalQueueRows: 2,
      excludedFederalOnlyStates: ['new-mexico'],
    },
    rows: [
      {
        stateId: 'alaska',
        candidateType: 'application_or_eligibility_guide',
        sourceUrl: 'https://dhss.alaska.gov/eligibility',
      },
      {
        stateId: 'arizona',
        candidateType: 'application_or_eligibility_guide',
        sourceUrl: 'https://az.example',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', 'forms-library-repair-run-2099-01-01T00-00-00-000Z.json'), {
    summary: {
      eligibleRepairRows: 0,
      nonRepairableRows: 3,
      nonRepairableByReason: {
        state_specific_fallback_only: 2,
        federal_only_fallback: 1,
      },
    },
  });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-runs', '2099-01-01T00-00-00-000Z', 'forms-fallback-summary.json'), {
    runId: '2099-01-01T00-00-00-000Z',
    mode: 'dry-run',
    selectedCount: 3,
    warningCount: 0,
  });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-runs', '2099-01-01T00-00-00-000Z', 'forms-fallback-results.json'), {
    runId: '2099-01-01T00-00-00-000Z',
    filters: {
      state: 'alaska',
      limit: 3,
    },
    warnings: [],
    rows: [
      {
        rowKey: 'alaska|application_or_eligibility_guide|https://dhss.alaska.gov/eligibility',
        stateId: 'alaska',
        candidateType: 'application_or_eligibility_guide',
        outcome: 'needs_manual_review',
        failureReason: 'url_budget_exhausted_with_fetch_errors',
        urlsTried: 2,
        urlBudget: 3,
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-runs', '2099-01-02T00-00-00-000Z', 'forms-fallback-results.json'), {
    runId: '2099-01-02T00-00-00-000Z',
    filters: {
      state: 'arizona',
      limit: 3,
    },
    warnings: [],
    rows: [{ stateId: 'arizona', rowKey: 'arizona|application_or_eligibility_guide|https://az.example' }],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-runs', '2099-01-02T00-00-00-000Z', 'forms-fallback-summary.json'), {
    runId: '2099-01-02T00-00-00-000Z',
    mode: 'dry-run',
    selectedCount: 3,
    warningCount: 0,
  });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'forms-fallback-completion-ledger.json'), {
    rows: [
      {
        rowKey: 'alaska|application_or_eligibility_guide|https://dhss.alaska.gov/eligibility',
        stateId: 'alaska',
        candidateType: 'application_or_eligibility_guide',
        sourceUrl: 'https://dhss.alaska.gov/eligibility',
        status: 'complete',
        outcome: 'needs_manual_review',
        completedAt: '2099-01-01T00:00:00.000Z',
        runId: '2099-01-01T00-00-00-000Z',
      },
      {
        rowKey: 'arizona|application_or_eligibility_guide|https://az.example',
        stateId: 'arizona',
        candidateType: 'application_or_eligibility_guide',
        sourceUrl: 'https://az.example',
        status: 'previewed',
        outcome: 'dry_run_queued',
        completedAt: '2099-01-02T00:00:00.000Z',
        runId: '2099-01-02T00-00-00-000Z',
      },
    ],
  });

  const output = runNode('src/db/generate_low_token_control_plane_audit.js', {
    cwd: fixtureRoot,
    env: {
      ABLEFULL_REPO_ROOT: fixtureRoot,
      ABLEFULL_REGRESSION_SCRIPT: stubRegressionPath,
    },
  });

  assert.deepEqual(output.laneStatus, {
    officialFollowup: 'needs_followup',
    providerPullNow: 'idle_or_cleared',
    providerRepairBacklog: 'needs_followup',
    formsFallback: 'ready_for_low_token_scrape',
  });

  const audit = readJson(path.join(fixtureRoot, 'docs', 'generated', `low-token-control-plane-${generatedDate}.json`));
  assert.equal(audit.regression.ok, true);
  assert.equal(audit.regression.stdout, 'stub regression ok');
  assert.equal(audit.lanes.officialFollowup.pendingQueueRows, 1);
  assert.equal(audit.lanes.officialFollowup.action.focusState, 'florida');
  assert.equal(audit.lanes.officialFollowup.action.blocker, 'official_followup_pending');
  assert.ok(audit.lanes.officialFollowup.action.recommendedCommands.some((command) => command.includes('--state=florida')));
  assert.equal(audit.lanes.providerPullNow.activeDecisionRows, 0);
  assert.equal(audit.lanes.providerPullNow.action.blocker, 'none');
  assert.deepEqual(audit.lanes.providerPullNow.action.recommendedCommands, []);
  assert.equal(audit.lanes.providerRepairBacklog.status, 'needs_followup');
  assert.equal(audit.lanes.providerRepairBacklog.action.blocker, 'provider_followup_repair_backlog_pending');
  assert.equal(audit.lanes.providerRepairBacklog.action.nextState, 'tennessee');
  assert.ok(audit.lanes.providerRepairBacklog.action.recommendedCommands.includes('npm run run:next-provider-repair-batch'));
  assert.deepEqual(audit.lanes.formsFallback.nonRepairableByReason, {
    state_specific_fallback_only: 2,
    federal_only_fallback: 1,
  });
  assert.equal(audit.lanes.formsFallback.action.blocker, 'state_specific_forms_fallback_scrape_pending');
  assert.deepEqual(audit.lanes.formsFallback.action.firstBatchStates, ['alaska', 'arizona']);
  assert.deepEqual(audit.lanes.formsFallback.action.exercisedStates, ['alaska']);
  assert.deepEqual(audit.lanes.formsFallback.action.previewedStates, ['arizona']);
  assert.deepEqual(audit.lanes.formsFallback.action.pendingPreviewStates, ['arizona']);
  assert.deepEqual(audit.lanes.formsFallback.action.nextBatchStates, ['arizona']);
  assert.equal(audit.lanes.formsFallback.action.nextState, 'arizona');
  assert.equal(audit.lanes.formsFallback.action.nextMode, 'live');
  assert.ok(audit.lanes.formsFallback.action.exactNextCommand.includes('--mode=live --state=arizona --limit=5'));
  assert.ok(audit.lanes.formsFallback.action.recommendedCommands.some((command) => command.includes('--mode=live --state=arizona --limit=5')));
  assert.equal(audit.lanes.formsFallback.latestFallbackRunSummary.runId, '2099-01-02T00-00-00-000Z');
  assert.equal(audit.lanes.formsFallback.latestFallbackRunSummary.selectedCount, 3);
  assert.equal(audit.lanes.formsFallback.latestFallbackRunSummary.filters.state, 'arizona');
  assert.equal(audit.lanes.formsFallback.manualReviewQueueSummary.totalRows, 1);
  assert.deepEqual(audit.lanes.formsFallback.manualReviewQueueSummary.byState, { alaska: 1 });
  assert.deepEqual(audit.lanes.formsFallback.manualReviewQueueSummary.byFailureReason, {
    url_budget_exhausted_with_fetch_errors: 1,
  });
  const manualReviewQueue = readJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-queue-${generatedDate}.json`));
  assert.equal(manualReviewQueue.summary.totalRows, 1);
  assert.equal(manualReviewQueue.rows[0].stateId, 'alaska');
  assert.equal(audit.lanes.formsFallback.stateLedgerSummary.totalStates, 2);
  assert.deepEqual(audit.lanes.formsFallback.stateLedgerSummary.byStatus, {
    completed_manual_review: 1,
    preview_pending_live: 1,
  });
  assert.equal(audit.lanes.formsFallback.stateLedgerSummary.nextState, 'arizona');
}

function testFormsFallbackManualReviewQueueAuditGeneratesArtifact() {
  const fixtureRoot = makeTempRepo('forms-fallback-manual-review');
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-scrape-queue-${generatedDate}.json`), {
    rows: [
      {
        stateId: 'hawaii',
        candidateType: 'application_or_eligibility_guide',
        sourceUrl: 'https://health.hawaii.gov/ddd',
        sourceName: 'Hawaii Ei Referral Guide',
        blockedFormsSourceUrl: 'https://health.hawaii.gov/forms',
        blockedFormsSourceName: 'Hawaii Forms',
        domain: 'health.hawaii.gov',
        priority: 2,
        recordCount: 2,
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'forms-fallback-completion-ledger.json'), {
    rows: [
      {
        rowKey: 'hawaii|application_or_eligibility_guide|https://health.hawaii.gov/ddd',
        stateId: 'hawaii',
        candidateType: 'application_or_eligibility_guide',
        sourceUrl: 'https://health.hawaii.gov/ddd',
        status: 'complete',
        outcome: 'needs_manual_review',
        completedAt: '2099-01-01T00:00:00.000Z',
        runId: '2099-01-01T00-00-00-000Z',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-runs', '2099-01-01T00-00-00-000Z', 'forms-fallback-results.json'), {
    rows: [
      {
        rowKey: 'hawaii|application_or_eligibility_guide|https://health.hawaii.gov/ddd',
        failureReason: 'url_budget_exhausted_with_fetch_errors',
        urlsTried: 2,
        urlBudget: 3,
      },
    ],
  });

  const output = runNode('src/db/generate_forms_fallback_manual_review_queue.js', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  assert.equal(output.summary.totalRows, 1);
  const queue = readJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-queue-${generatedDate}.json`));
  assert.deepEqual(queue.summary.byState, { hawaii: 1 });
  assert.deepEqual(queue.summary.byFailureReason, { url_budget_exhausted_with_fetch_errors: 1 });
}

function testFormsFallbackManualReviewDecisionTemplateAndApplyWorkflow() {
  const fixtureRoot = makeTempRepo('forms-fallback-manual-review-decisions');
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-queue-${generatedDate}.json`), {
    summary: {
      totalRows: 1,
      byState: { hawaii: 1 },
      byFailureReason: { url_budget_exhausted_with_fetch_errors: 1 },
    },
    rows: [
      {
        rowKey: 'hawaii|application_or_eligibility_guide|https://health.hawaii.gov/ddd',
        stateId: 'hawaii',
        candidateType: 'application_or_eligibility_guide',
        sourceName: 'Hawaii Ei Referral Guide',
        sourceUrl: 'https://health.hawaii.gov/ddd',
        blockedFormsSourceName: 'Hawaii Forms',
        blockedFormsSourceUrl: 'https://health.hawaii.gov/forms',
        failureReason: 'url_budget_exhausted_with_fetch_errors',
      },
    ],
  });

  const templateOutput = runNode('src/db/generate_forms_fallback_manual_review_decision_template.js', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  assert.equal(templateOutput.rows, 1);
  const template = readJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-decision-template-${generatedDate}.json`));
  assert.equal(template.rows[0].rowKey, 'hawaii|application_or_eligibility_guide|https://health.hawaii.gov/ddd');
  assert.equal(template.rows[0].decisionMode, '');

  writeJson(path.join(fixtureRoot, 'data', 'forms-fallback-manual-review-decisions.json'), {
    rows: [
      {
        rowKey: 'hawaii|application_or_eligibility_guide|https://health.hawaii.gov/ddd',
        stateId: 'hawaii',
        sourceName: 'Hawaii Ei Referral Guide',
        sourceUrl: 'https://health.hawaii.gov/ddd',
        decisionMode: 'replace_with_reviewed_candidate',
        reviewedSourceName: 'Hawaii DOH Developmental Disabilities Division',
        reviewedSourceUrl: 'https://health.hawaii.gov/ddd/home-and-community-based-services/',
        reviewNotes: 'Reviewed official DDD landing page after bounded fetch failure.',
        reviewedBy: 'codex',
      },
    ],
  });

  const dryRun = runNode('scripts/apply-forms-fallback-manual-review-decisions.mjs', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });
  assert.equal(dryRun.summary.resolvedRows, 1);
  assert.equal(dryRun.summary.filesChanged, 0);

  const applied = runNode('scripts/apply-forms-fallback-manual-review-decisions.mjs', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
    args: ['--apply'],
  });
  assert.equal(applied.summary.resolvedRows, 1);
  assert.equal(applied.summary.filesChanged, 2);

  const ledger = readJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'forms-fallback-manual-review-ledger.json'));
  assert.equal(ledger.rows.length, 1);
  assert.equal(ledger.rows[0].status, 'resolved_replaced_with_reviewed_candidate');
  assert.equal(ledger.rows[0].resolvedSourceUrl, 'https://health.hawaii.gov/ddd/home-and-community-based-services');

  const pack = readJson(path.join(fixtureRoot, 'data', 'source_packs', 'forms_fallback_manual_resolutions.json'));
  assert.equal(pack.rows.length, 1);
  assert.equal(pack.rows[0].sourceUrl, 'https://health.hawaii.gov/ddd/home-and-community-based-services');
  assert.equal(pack.rows[0].resolutionMode, 'replace_with_reviewed_candidate');

  const refreshedQueueOutput = runNode('src/db/generate_forms_fallback_manual_review_queue.js', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });
  assert.equal(refreshedQueueOutput.summary.totalRows, 0);
  const refreshedQueue = readJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-queue-${generatedDate}.json`));
  assert.equal(refreshedQueue.summary.totalRows, 0);
}

function testFormsFallbackStateLedgerAuditGeneratesArtifact() {
  const fixtureRoot = makeTempRepo('forms-fallback-state-ledger');
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-scrape-queue-${generatedDate}.json`), {
    rows: [
      {
        stateId: 'hawaii',
        candidateType: 'application_or_eligibility_guide',
        sourceUrl: 'https://health.hawaii.gov/ddd',
      },
      {
        stateId: 'iowa',
        candidateType: 'general_form_related_page',
        sourceUrl: 'https://hhs.iowa.gov/forms',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-queue-${generatedDate}.json`), {
    rows: [
      { stateId: 'hawaii' },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'forms-fallback-completion-ledger.json'), {
    rows: [
      {
        rowKey: 'hawaii|application_or_eligibility_guide|https://health.hawaii.gov/ddd',
        stateId: 'hawaii',
        candidateType: 'application_or_eligibility_guide',
        sourceUrl: 'https://health.hawaii.gov/ddd',
        status: 'complete',
        outcome: 'needs_manual_review',
      },
    ],
  });

  const output = runNode('src/db/generate_forms_fallback_state_ledger.js', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  assert.equal(output.summary.totalStates, 2);
  assert.deepEqual(output.summary.byStatus, {
    completed_manual_review: 1,
    unstarted: 1,
  });
  assert.equal(output.summary.nextState, 'iowa');
}

function testProviderPlaceholderCandidatePackUsesDbDiscoveredFallbacks() {
  const fixtureRoot = makeTempRepo('provider-placeholder-candidate-pack');
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `master-source-target-ledger-${generatedDate}.json`), {
    ledger: [
      {
        stateId: 'illinois',
        gapFamily: 'providers_care',
        targetTable: 'resource_providers',
        sourceName: 'Ann & Robert H. Lurie Children\'s Hospital Developmental Pediatrics',
        sourceUrl: 'https://www.luriechildrens.org/en/specialties-conditions/developmental-behavioral-pediatrics',
        domain: 'luriechildrens.org',
        crawlMethod: 'static_fetch',
        organizationType: 'hospital',
        sourceFamily: 'official_government',
        ledgerStatus: 'ready_lightweight',
        priority: 2,
        notes: 'Lurie first-party page.',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `db-discovered-source-targets-${generatedDate}.json`), {
    actionableNewTargets: [
      {
        stateId: 'illinois',
        gapFamily: 'providers_care',
        targetTable: 'resource_providers',
        sourceName: 'Rush University Medical Center - Autism Assessment, Research, and Treatment Services (AARTS)',
        sourceUrl: 'https://www.rush.edu/',
        domain: 'rush.edu',
        crawlMethod: 'static_fetch',
        organizationType: 'hospital',
        sourceFamily: 'provider_first_party_or_directory',
        ledgerStatus: 'ready_lightweight',
        priority: 2,
        notes: 'Saved db-discovered first-party provider.',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-state-ledger-${generatedDate}.json`), {
    summary: {
      totalStates: 1,
      nextState: 'illinois',
    },
    rows: [
      {
        stateId: 'illinois',
        status: 'authoring_pending',
        queueRows: 23,
        placeholderDomains: ['hfs.illinois.gov'],
      },
    ],
  });

  const output = runNode('src/db/generate_provider_placeholder_candidate_pack.js', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  assert.equal(output.summary.totalStates, 1);
  assert.equal(output.summary.statesWithSuggestedReplacements, 1);
  const pack = readJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-candidate-pack-${generatedDate}.json`));
  assert.equal(pack.states[0].suggestedReplacements.length, 2);
  assert.deepEqual(
    pack.states[0].suggestedReplacements.map((item) => item.sourceArtifact),
    ['master_source_target_ledger', 'db_discovered_source_targets']
  );
}

function testLowTokenControlPlaneSwitchesToManualReviewResolutionWhenScrapeLaneIsExhausted() {
  const fixtureRoot = makeTempRepo('forms-fallback-manual-review-control-plane');
  const stubRegressionPath = path.join(fixtureRoot, 'stub-regression.mjs');
  fs.writeFileSync(stubRegressionPath, 'console.log("stub regression ok");\n');

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `official-domain-followup-queue-${generatedDate}.json`), {
    summary: { totalRows: 0, byState: {} },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'official-domain-followup-decisions.json'), { rows: [] });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-replacement-queue-${generatedDate}.json`), {
    summary: { totalRows: 0, byState: {}, byDomain: {}, byReadinessLane: {} },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-authoring-briefs-${generatedDate}.json`), {
    summary: { totalBriefs: 0 },
    briefs: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-replacement-decision-template-${generatedDate}.json`), {
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'provider-placeholder-replacement-decisions.json'), { rows: [] });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-scrape-queue-${generatedDate}.json`), {
    summary: {
      totalQueueRows: 1,
      excludedFederalOnlyStates: [],
    },
    rows: [
      {
        stateId: 'hawaii',
        candidateType: 'application_or_eligibility_guide',
        sourceUrl: 'https://health.hawaii.gov/ddd',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-queue-${generatedDate}.json`), {
    summary: {
      totalRows: 1,
      byState: { hawaii: 1 },
      byFailureReason: { url_budget_exhausted_with_fetch_errors: 1 },
    },
    rows: [
      {
        rowKey: 'hawaii|application_or_eligibility_guide|https://health.hawaii.gov/ddd',
        stateId: 'hawaii',
        candidateType: 'application_or_eligibility_guide',
        sourceUrl: 'https://health.hawaii.gov/ddd',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-decision-template-${generatedDate}.json`), {
    rows: [
      {
        rowKey: 'hawaii|application_or_eligibility_guide|https://health.hawaii.gov/ddd',
        stateId: 'hawaii',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'forms-fallback-manual-review-decisions.json'), { rows: [] });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'forms-fallback-manual-review-ledger.json'), { rows: [] });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'forms-fallback-completion-ledger.json'), {
    rows: [
      {
        rowKey: 'hawaii|application_or_eligibility_guide|https://health.hawaii.gov/ddd',
        stateId: 'hawaii',
        candidateType: 'application_or_eligibility_guide',
        sourceUrl: 'https://health.hawaii.gov/ddd',
        status: 'complete',
        outcome: 'needs_manual_review',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-state-ledger-${generatedDate}.json`), {
    summary: {
      totalStates: 1,
      byStatus: { completed_manual_review: 1 },
      nextState: '',
    },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source_packs', 'forms_source_pack.json'), { rows: [] });

  const output = runNode('src/db/generate_low_token_control_plane_audit.js', {
    cwd: fixtureRoot,
    env: {
      ABLEFULL_REPO_ROOT: fixtureRoot,
      ABLEFULL_REGRESSION_SCRIPT: stubRegressionPath,
    },
  });

  assert.equal(output.laneStatus.formsFallback, 'needs_manual_review_resolution');
  const audit = readJson(path.join(fixtureRoot, 'docs', 'generated', `low-token-control-plane-${generatedDate}.json`));
  assert.equal(audit.lanes.formsFallback.status, 'needs_manual_review_resolution');
  assert.equal(audit.lanes.formsFallback.action.blocker, 'forms_fallback_manual_review_resolution_pending');
  assert.deepEqual(audit.lanes.formsFallback.action.recommendedCommands, [
    'npm run audit:forms-fallback-manual-review-decision-template',
    'npm run fix:forms-fallback-manual-review-decisions -- --input=data/forms-fallback-manual-review-decisions.json --state=<state>',
  ]);
}

function testLowTokenControlPlaneUsesRowKeyScopedFormsManualReviewResolution() {
  const fixtureRoot = makeTempRepo('forms-fallback-manual-review-rowkey-scope');
  const stubRegressionPath = path.join(fixtureRoot, 'stub-regression.mjs');
  fs.writeFileSync(stubRegressionPath, 'console.log("stub regression ok");\n');

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `official-domain-followup-queue-${generatedDate}.json`), {
    summary: { totalRows: 0, byState: {} },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'official-domain-followup-decisions.json'), { rows: [] });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-replacement-queue-${generatedDate}.json`), {
    summary: { totalRows: 0, byState: {}, byDomain: {}, byReadinessLane: {} },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-authoring-briefs-${generatedDate}.json`), {
    summary: { totalBriefs: 0 },
    briefs: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-replacement-decision-template-${generatedDate}.json`), {
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'provider-placeholder-replacement-decisions.json'), { rows: [] });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-scrape-queue-${generatedDate}.json`), {
    summary: {
      totalQueueRows: 1,
      excludedFederalOnlyStates: [],
    },
    rows: [
      {
        stateId: 'hawaii',
        candidateType: 'general_form_related_page',
        sourceUrl: 'https://health.hawaii.gov/ddd',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-queue-${generatedDate}.json`), {
    summary: {
      totalRows: 1,
      byState: { hawaii: 1 },
      byFailureReason: { url_budget_exhausted_with_fetch_errors: 1 },
    },
    rows: [
      {
        rowKey: 'hawaii|general_form_related_page|https://health.hawaii.gov/ddd',
        stateId: 'hawaii',
        candidateType: 'general_form_related_page',
        sourceUrl: 'https://health.hawaii.gov/ddd',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-decision-template-${generatedDate}.json`), {
    rows: [
      {
        rowKey: 'hawaii|general_form_related_page|https://health.hawaii.gov/ddd',
        stateId: 'hawaii',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'forms-fallback-manual-review-decisions.json'), { rows: [] });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'forms-fallback-manual-review-ledger.json'), {
    rows: [
      {
        rowKey: 'alaska|general_form_related_page|https://health.alaska.gov/dsds',
        status: 'resolved_replaced_with_reviewed_candidate',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'forms-fallback-completion-ledger.json'), {
    rows: [
      {
        rowKey: 'hawaii|general_form_related_page|https://health.hawaii.gov/ddd',
        stateId: 'hawaii',
        candidateType: 'general_form_related_page',
        sourceUrl: 'https://health.hawaii.gov/ddd',
        status: 'complete',
        outcome: 'needs_manual_review',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-state-ledger-${generatedDate}.json`), {
    summary: {
      totalStates: 1,
      byStatus: { completed_manual_review: 1 },
      nextState: '',
    },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source_packs', 'forms_source_pack.json'), { rows: [] });

  const output = runNode('src/db/generate_low_token_control_plane_audit.js', {
    cwd: fixtureRoot,
    env: {
      ABLEFULL_REPO_ROOT: fixtureRoot,
      ABLEFULL_REGRESSION_SCRIPT: stubRegressionPath,
    },
  });

  assert.equal(output.laneStatus.formsFallback, 'needs_manual_review_resolution');
}

function testLowTokenControlPlaneClearsFormsLaneWhenNoActionableRowsRemain() {
  const fixtureRoot = makeTempRepo('forms-fallback-lane-clear');
  const stubRegressionPath = path.join(fixtureRoot, 'stub-regression.mjs');
  fs.writeFileSync(stubRegressionPath, 'console.log("stub regression ok");\n');

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `official-domain-followup-queue-${generatedDate}.json`), {
    summary: { totalRows: 0, byState: {} },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'official-domain-followup-decisions.json'), { rows: [] });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-replacement-queue-${generatedDate}.json`), {
    summary: { totalRows: 0, byState: {}, byDomain: {}, byReadinessLane: {} },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-authoring-briefs-${generatedDate}.json`), {
    summary: { totalBriefs: 0 },
    briefs: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-replacement-decision-template-${generatedDate}.json`), {
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'provider-placeholder-replacement-decisions.json'), { rows: [] });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-scrape-queue-${generatedDate}.json`), {
    summary: {
      totalQueueRows: 4,
      excludedFederalOnlyStates: ['new-mexico'],
    },
    rows: [
      { stateId: 'hawaii', candidateType: 'general_form_related_page', sourceUrl: 'https://health.hawaii.gov/ddd' },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-queue-${generatedDate}.json`), {
    summary: {
      totalRows: 0,
      byState: {},
      byFailureReason: {},
    },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-decision-template-${generatedDate}.json`), {
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'forms-fallback-manual-review-decisions.json'), { rows: [] });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'forms-fallback-manual-review-ledger.json'), {
    rows: [
      {
        rowKey: 'hawaii|general_form_related_page|https://health.hawaii.gov/ddd',
        status: 'deferred_manual_research',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'forms-fallback-completion-ledger.json'), {
    rows: [
      {
        rowKey: 'hawaii|general_form_related_page|https://health.hawaii.gov/ddd',
        stateId: 'hawaii',
        candidateType: 'general_form_related_page',
        sourceUrl: 'https://health.hawaii.gov/ddd',
        status: 'complete',
        outcome: 'needs_manual_review',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-state-ledger-${generatedDate}.json`), {
    summary: {
      totalStates: 1,
      byStatus: { completed: 1 },
      nextState: '',
    },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source_packs', 'forms_source_pack.json'), { rows: [] });

  const output = runNode('src/db/generate_low_token_control_plane_audit.js', {
    cwd: fixtureRoot,
    env: {
      ABLEFULL_REPO_ROOT: fixtureRoot,
      ABLEFULL_REGRESSION_SCRIPT: stubRegressionPath,
    },
  });

  assert.equal(output.laneStatus.formsFallback, 'idle_or_cleared');
}

function testRunNextFormsFallbackStepUsesExactControlPlaneCommand() {
  const fixtureRoot = makeTempRepo('forms-fallback-next-step');
  const stubRegressionPath = path.join(fixtureRoot, 'stub-regression.mjs');
  fs.writeFileSync(stubRegressionPath, 'console.log("stub regression ok");\n');
  fs.writeFileSync(path.join(fixtureRoot, 'package.json'), `${JSON.stringify({
    name: 'fixture',
    private: true,
    type: 'module',
    scripts: {
      'run:forms-fallback-source-acquisition': `node ${JSON.stringify(path.join(repoRoot, 'scripts', 'run-forms-fallback-source-acquisition.mjs'))}`,
      'audit:low-token-control-plane': `node ${JSON.stringify(path.join(repoRoot, 'src', 'db', 'generate_low_token_control_plane_audit.js'))}`,
    },
  }, null, 2)}\n`);
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-scrape-queue-${generatedDate}.json`), {
    rows: [
      {
        stateId: 'idaho',
        candidateType: 'application_or_eligibility_guide',
        sourceUrl: 'https://healthandwelfare.idaho.gov/a',
        blockedFormsSourceUrl: 'https://healthandwelfare.idaho.gov/forms',
        domain: 'healthandwelfare.idaho.gov',
      },
    ],
    summary: {
      totalQueueRows: 1,
      excludedFederalOnlyStates: [],
    },
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `official-domain-followup-queue-${generatedDate}.json`), {
    summary: { totalRows: 0 },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-replacement-queue-${generatedDate}.json`), {
    summary: {
      totalRows: 0,
      statesNeedingPlaceholderReplacement: 0,
      byState: {},
      byDomain: {},
      byReadinessLane: {},
    },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-authoring-briefs-${generatedDate}.json`), {
    summary: { totalBriefs: 0 },
    briefs: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-placeholder-replacement-decision-template-${generatedDate}.json`), {
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-queue-${generatedDate}.json`), {
    summary: {
      totalRows: 0,
      byState: {},
      byFailureReason: {},
    },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source_packs', 'forms_source_pack.json'), {
    rows: [
      {
        stateId: 'idaho',
        replacementClass: 'state_specific_form_fallback_only',
        blockedFormsTarget: { sourceName: 'Idaho Forms', sourceUrl: 'https://healthandwelfare.idaho.gov/forms' },
        topCandidates: [
          { candidateType: 'application_or_eligibility_guide', sourceUrl: 'https://healthandwelfare.idaho.gov/a' },
        ],
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `low-token-control-plane-${generatedDate}.json`), {
    laneStatus: {
      officialFollowup: 'idle_or_cleared',
      providerPullNow: 'idle_or_cleared',
      formsFallback: 'ready_for_low_token_scrape',
    },
    lanes: {
      formsFallback: {
        action: {
          exactNextCommand: 'npm run run:forms-fallback-source-acquisition -- --mode=dry-run --state=idaho --limit=5',
        },
      },
    },
  });

  const output = runNode('scripts/run-next-forms-fallback-step.mjs', {
    cwd: fixtureRoot,
    env: {
      ABLEFULL_REPO_ROOT: fixtureRoot,
      ABLEFULL_REGRESSION_SCRIPT: stubRegressionPath,
    },
  });

  assert.ok(output.command.includes('--mode=dry-run --state=idaho --limit=5'));
  assert.equal(output.refreshCommand, 'npm run audit:low-token-control-plane');
  assert.equal(output.result.state, 'idaho');
  assert.equal(output.result.mode, 'dry-run');
  assert.equal(output.refreshedControlPlane.laneStatus.formsFallback, 'ready_for_low_token_scrape');
  assert.equal(output.refreshedControlPlane.formsFallback.action.nextState, 'idaho');
  assert.equal(output.refreshedControlPlane.formsFallback.action.nextMode, 'live');
  assert.ok(output.refreshedControlPlane.formsFallback.action.exactNextCommand.includes('--mode=live --state=idaho --limit=5'));

  const refreshedAudit = readJson(path.join(fixtureRoot, 'docs', 'generated', `low-token-control-plane-${generatedDate}.json`));
  assert.equal(refreshedAudit.lanes.formsFallback.action.nextState, 'idaho');
  assert.equal(refreshedAudit.lanes.formsFallback.action.nextMode, 'live');
  assert.equal(refreshedAudit.lanes.formsFallback.latestFallbackRunSummary.filters.state, 'idaho');
}

function testSourceAcquisitionCompletionPlanPrioritizesBroadGapFamilies() {
  const fixtureRoot = makeTempRepo('source-acquisition-plan');
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `scrape-now-only-${generatedDate}.json`), {
    rows: [
      {
        stateId: 'texas',
        gapFamily: 'nonprofit_support',
        targetTable: 'nonprofit_organizations',
        ledgerStatus: 'ready_lightweight',
        sourceUrl: 'https://example.org/nonprofit',
        sourceName: 'Example Nonprofit',
        trustedMissingRows: 500,
      },
      {
        stateId: 'texas',
        gapFamily: 'providers_care',
        targetTable: 'resource_providers',
        ledgerStatus: 'ready_lightweight',
        sourceUrl: 'https://example.org/provider',
        sourceName: 'Example Provider',
        trustedMissingRows: 20,
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `db-discovered-source-targets-${generatedDate}.json`), {
    actionableNewTargets: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `missing-source-families-${generatedDate}.json`), {
    families: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `authored-missing-source-targets-${generatedDate}.json`), {
    targets: [
      {
        id: 'knowledge-example',
        stateId: 'texas',
        gapFamily: 'knowledge_content',
        targetTable: 'knowledge_content',
        sourceUrl: 'https://example.gov/knowledge',
        sourceName: 'Official Knowledge Source',
        priority: 1,
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `knowledge-content-status-queue-${generatedDate}.json`), {
    summary: {
      totalTargets: 1,
      blockerStatus: 'critical_gap',
    },
    rows: [
      {
        id: 'knowledge-example',
        sourceUrl: 'https://example.gov/knowledge',
        sourceName: 'Official Knowledge Source',
        finalStatus: 'pending_exact_target',
      },
    ],
  });

  runNode('src/db/generate_source_acquisition_completion_plan.js', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  const plan = readJson(path.join(fixtureRoot, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`));
  assert.equal(plan.combinedReadyRows[0].gapFamily, 'providers_care');
  assert.equal(plan.combinedReadyRows[0].executionLane, 'ready_target_scrape');
  assert.equal(plan.combinedReadyRows[1].gapFamily, 'nonprofit_support');
  assert.equal(plan.combinedReadyRows[1].executionLane, 'ready_target_scrape');
  assert.equal(plan.combinedReadyRows[2].gapFamily, 'knowledge_content');
  assert.equal(plan.combinedReadyRows[2].executionLane, 'remaining_ready');
}

function testSourceAcquisitionCompletionPlanKeepsRetryableKnowledgeRowsVisible() {
  const fixtureRoot = makeTempRepo('source-acquisition-plan-knowledge-retryable');
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `scrape-now-only-${generatedDate}.json`), {
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `db-discovered-source-targets-${generatedDate}.json`), {
    actionableNewTargets: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `missing-source-families-${generatedDate}.json`), {
    families: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `authored-missing-source-targets-${generatedDate}.json`), {
    targets: [
      {
        id: 'knowledge-retryable',
        stateId: 'national',
        gapFamily: 'knowledge_content',
        targetTable: 'knowledge_articles',
        sourceUrl: 'https://example.gov/knowledge-retryable',
        sourceName: 'Retryable Knowledge Source',
        ledgerStatus: 'ready_lightweight',
        priority: 1,
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `knowledge-content-status-queue-${generatedDate}.json`), {
    summary: {
      totalTargets: 1,
      blockerStatus: 'critical_gap',
      byFinalStatus: {
        deferred_unresolved: 1,
      },
    },
    rows: [
      {
        id: 'knowledge-retryable',
        sourceUrl: 'https://example.gov/knowledge-retryable',
        sourceName: 'Retryable Knowledge Source',
        finalStatus: 'deferred_unresolved',
        lastFollowupReason: 'sandbox_network_disabled',
      },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'knowledge-content-repair-ledger.json'), {
    rows: [],
  });
  writeNdjson(
    path.join(
      fixtureRoot,
      'data',
      'source-acquisition-runs',
      '2026-06-19T00-00-00-000Z',
      'followups',
      'blocked-failures.json'
    ),
    [
      {
        gapFamily: 'knowledge_content',
        sourceUrl: 'https://example.gov/knowledge-retryable',
        followupReason: 'sandbox_network_disabled',
      },
    ],
  );

  runNode('src/db/generate_source_acquisition_completion_plan.js', {
    cwd: fixtureRoot,
    env: { ABLEFULL_REPO_ROOT: fixtureRoot },
  });

  const plan = readJson(path.join(fixtureRoot, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`));
  assert.equal(plan.summary.combinedByGapFamily.knowledge_content, 1);
  const retryableRow = plan.combinedReadyRows.find((row) => row.id === 'knowledge-retryable');
  assert.ok(retryableRow);
  assert.equal(retryableRow.sourceQueue, 'authored_missing_family');
}

function testLowTokenControlPlaneExposesProviderReviewLoop() {
  const fixtureRoot = makeTempRepo('low-token-provider-review-loop');
  const stubRegressionPath = path.join(fixtureRoot, 'stub-regression.mjs');
  fs.writeFileSync(stubRegressionPath, 'console.log("stub regression ok");\n');

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `official-domain-followup-queue-${generatedDate}.json`), {
    summary: { totalRows: 0, byState: {} },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'official-domain-followup-decisions.json'), { rows: [] });

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-followup-repair-queue-${generatedDate}.json`), {
    summary: { totalRows: 2 },
    rows: [
      { stateId: 'tennessee', readinessLane: 'pull-now', actionClass: 'replace_domain', sourceUrl: 'https://www.lebonheur.org/' },
      { stateId: 'tennessee', readinessLane: 'pull-now', actionClass: 'author_alternate_first_party_target', sourceUrl: 'https://www.dollychildrens.org/' },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-repair-execution-backlog-${generatedDate}.json`), {
    summary: { totalRows: 2, firstExecutionLane: 'pull-now' },
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-runbook-${generatedDate}.json`), {
    summary: { pullNowRowCount: 2, pullNowStateCount: 1, firstActionClass: 'replace_domain' },
    stateSlices: [{ stateId: 'tennessee', rowCount: 2 }],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-decision-template-${generatedDate}.json`), { rows: [{}, {}] });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-manual-fill-queue-${generatedDate}.json`), {
    summary: { unresolvedRows: 2, byActionClass: { replace_domain: 1, author_alternate_first_party_target: 1 }, byDecisionHint: { needs_manual_research: 2 }, byState: { tennessee: 2 } },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-decision-progress-${generatedDate}.json`), {
    summary: { totalRows: 2, filledRows: 0, unresolvedRows: 2, completionPercent: 0 },
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-review-packet-${generatedDate}.json`), {
    summary: { statePacketCount: 1, firstState: 'tennessee' },
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-state-packets-${generatedDate}.json`), {
    summary: { statePacketCount: 1, totalUnresolvedRows: 2, firstState: 'tennessee' },
    packets: [{ stateId: 'tennessee', unresolvedRows: 2, jsonPath: `docs/generated/provider-pull-now-state-packets/provider-pull-now-state-packet-tennessee-${generatedDate}.json` }],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', 'provider-pull-now-state-packets', `provider-pull-now-state-packet-tennessee-${generatedDate}.json`), {
    stateId: 'tennessee',
    unresolvedRows: 2,
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', 'provider-pull-now-state-decision-packets', `provider-pull-now-state-decision-packet-tennessee-${generatedDate}.json`), {
    stateId: 'tennessee',
    summary: { unresolvedRows: 2 },
  });
  writeJson(path.join(fixtureRoot, 'data', 'provider-pull-now-state-workfiles', 'provider-pull-now-state-workfile-tennessee.json'), {
    rows: [
      { stateId: 'tennessee', actionClass: 'replace_domain', sourceUrl: 'https://www.lebonheur.org/', suggestedDecisionMode: 'needs_manual_research', decisionMode: '', reviewedBy: '' },
      { stateId: 'tennessee', actionClass: 'author_alternate_first_party_target', sourceUrl: 'https://www.dollychildrens.org/', suggestedDecisionMode: 'needs_manual_research', decisionMode: '', reviewedBy: '' },
    ],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-state-workfile-status-tennessee-${generatedDate}.json`), {
    summary: { totalRows: 2, filledRows: 0, unresolvedRows: 2, completionPercent: 0 },
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-state-workfile-validation-tennessee-${generatedDate}.json`), {
    summary: { totalRows: 2, filledRows: 0, unresolvedRows: 2, issueRows: 0, mergeReady: true },
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `provider-pull-now-state-review-loop-tennessee-${generatedDate}.json`), {
    summary: { statePacketUnresolvedRows: 2, workfileUnresolvedRows: 2, workfileCompletionPercent: 0, validationIssueRows: 0, mergeReady: true },
  });
  writeJson(path.join(fixtureRoot, 'data', 'provider-pull-now-decisions.json'), {
    rows: [
      { stateId: 'tennessee', actionClass: 'replace_domain', sourceUrl: 'https://www.lebonheur.org/', decisionMode: '', reviewedBy: '' },
      { stateId: 'tennessee', actionClass: 'author_alternate_first_party_target', sourceUrl: 'https://www.dollychildrens.org/', decisionMode: '', reviewedBy: '' },
    ],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'provider-pull-now-resolution-ledger.json'), { rows: [] });

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-scrape-queue-${generatedDate}.json`), {
    summary: { totalQueueRows: 0, excludedFederalOnlyStates: [] },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-queue-${generatedDate}.json`), {
    summary: { totalRows: 0, byState: {}, byFailureReason: {} },
    rows: [],
  });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-manual-review-decision-template-${generatedDate}.json`), { rows: [] });
  writeJson(path.join(fixtureRoot, 'data', 'forms-fallback-manual-review-decisions.json'), { rows: [] });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-state', 'forms-fallback-manual-review-ledger.json'), { rows: [] });
  writeJson(path.join(fixtureRoot, 'docs', 'generated', `forms-fallback-state-ledger-${generatedDate}.json`), {
    summary: { totalStates: 0, byStatus: {}, nextState: '' },
    rows: [],
  });

  const output = runNode('src/db/generate_low_token_control_plane_audit.js', {
    cwd: fixtureRoot,
    env: {
      ABLEFULL_REPO_ROOT: fixtureRoot,
      ABLEFULL_REGRESSION_SCRIPT: stubRegressionPath,
    },
  });

  assert.equal(output.laneStatus.providerPullNow, 'needs_followup');
  assert.equal(output.laneStatus.providerRepairBacklog, 'needs_followup');
  const audit = readJson(path.join(fixtureRoot, 'docs', 'generated', `low-token-control-plane-${generatedDate}.json`));
  assert.equal(audit.lanes.providerPullNow.firstStateReviewLoopPath.includes('provider-pull-now-state-review-loop-tennessee-'), true);
  assert.ok(audit.lanes.providerPullNow.action.recommendedCommands.includes('npm run run:provider-pull-now-state-review-loop -- --state=tennessee'));
  assert.ok(audit.lanes.providerPullNow.action.recommendedCommands.includes('npm run audit:provider-pull-now-state-workfile-validation -- --state=tennessee'));
  assert.equal(audit.lanes.providerRepairBacklog.action.blocker, 'provider_followup_repair_backlog_pending');
}

testOfficialFollowupQueueReconcilesLiveRows();
testOfficialFollowupDecisionDryRunStaysTrimmedToLiveRows();
testOfficialFollowupQueueExcludesReviewedSkipRows();
testOfficialFollowupQueueExcludesReviewedAppliedRows();
testProviderPlaceholderEmptyQueueStaysEmptyDownstream();
testProviderPlaceholderDecisionDryRunStaysIdleWhenRowsAreEmpty();
testProviderPlaceholderApplyMutatesSourceTargets();
testProviderPlaceholderApplyFallsBackToSingleBlockedDomainScaffold();
testProviderPlaceholderQueueCapturesSyntheticRosters();
testProviderPlaceholderQueueExcludesHistoricalRunRowsForStatesNoLongerNeedingReplacement();
testFormsRepairReportSeparatesFallbackReasons();
testFormsFallbackRunnerWarnsOnFederalOnlyState();
testFormsFallbackRunnerWarnsWhenFiltersMatchNoRows();
testFormsFallbackRunnerCapsStateRunAtFiveRows();
testFormsFallbackRunnerSkipsPreviouslyCompletedStateRows();
testFormsFallbackManualReviewQueueAuditGeneratesArtifact();
testFormsFallbackManualReviewDecisionTemplateAndApplyWorkflow();
testFormsFallbackStateLedgerAuditGeneratesArtifact();
testProviderPlaceholderCandidatePackUsesDbDiscoveredFallbacks();
testRunNextFormsFallbackStepUsesExactControlPlaneCommand();
testSourceAcquisitionCompletionPlanPrioritizesBroadGapFamilies();
testLowTokenControlPlaneExposesProviderReviewLoop();
testLowTokenControlPlaneAuditSummarizesLaneStatus();
testLowTokenControlPlaneSwitchesToManualReviewResolutionWhenScrapeLaneIsExhausted();
testLowTokenControlPlaneUsesRowKeyScopedFormsManualReviewResolution();
testLowTokenControlPlaneClearsFormsLaneWhenNoActionableRowsRemain();

console.log('low token workflow regression tests passed');
