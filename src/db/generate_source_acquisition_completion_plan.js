import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const stateDir = path.join(repoRoot, 'data', 'source-acquisition-state');
const runsDir = path.join(repoRoot, 'data', 'source-acquisition-runs');
const generatedDate = new Date().toISOString().slice(0, 10);

const jsonOutPath = path.join(docsDir, `source-acquisition-completion-plan-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `source-acquisition-completion-plan-${generatedDate}.md`);
const knowledgeRepairLedgerPath = path.join(stateDir, 'knowledge-content-repair-ledger.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return readJson(filePath);
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated input for prefix "${prefix}" in ${docsDir}`);
  }
  return path.join(docsDir, matches.at(-1));
}

function latestGeneratedJsonIfPresent(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  return matches.length ? path.join(docsDir, matches.at(-1)) : null;
}

function duplicateGroup(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    return `${parsed.hostname.replace(/^www\./, '').toLowerCase()}|${parsed.toString().replace(/^https?:\/\//, '')}`;
  } catch {
    return String(rawUrl || '');
  }
}

function normalizeUrl(rawUrl) {
  const value = String(rawUrl || '').trim();
  if (!value) return '';
  try {
    const parsed = new URL(value);
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.toString();
  } catch {
    return value.replace(/\/+$/, '');
  }
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function loadPreviouslyAcceptedFamilySourceUrls() {
  const acceptedByFamily = new Map();
  if (!fs.existsSync(runsDir)) return acceptedByFamily;

  const runDirs = fs.readdirSync(runsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const runId of runDirs) {
    const validatedDir = path.join(runsDir, runId, 'validated');
    if (!fs.existsSync(validatedDir)) continue;
    const familyDirs = fs.readdirSync(validatedDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    for (const family of familyDirs) {
      const acceptedPath = path.join(validatedDir, family, 'accepted.ndjson');
      if (!fs.existsSync(acceptedPath)) continue;
      const target = acceptedByFamily.get(family) || new Set();
      const lines = fs.readFileSync(acceptedPath, 'utf8')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      for (const line of lines) {
        const row = JSON.parse(line);
        const sourceUrl = normalizeUrl(row.sourceUrl || row.finalUrl || row.canonicalUrl);
        if (sourceUrl) target.add(sourceUrl);
      }
      acceptedByFamily.set(family, target);
    }
  }

  return acceptedByFamily;
}

function loadProviderRepeatedBlockerSourceUrls() {
  const registryPath = latestGeneratedJsonIfPresent('provider-followup-blocker-registry-');
  if (!fs.existsSync(registryPath)) return new Set();
  const payload = readJsonIfExists(registryPath, { rows: [] });
  return new Set((payload.rows || []).map((row) => normalizeUrl(row.sourceUrl)).filter(Boolean));
}

function loadAdvocateBlockedSourceUrls() {
  const grouped = new Map();
  if (!fs.existsSync(runsDir)) return new Set();
  const terminalBlockedReasons = new Set(['access_blocked_403']);
  const terminalSourceRepairReasons = new Set(['dns_lookup_failed', 'stale_or_invalid_404']);
  const terminalErrorCodes = new Set(['ENOTFOUND']);

  const runDirs = fs.readdirSync(runsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const runId of runDirs) {
    const followupDir = path.join(runsDir, runId, 'followups');
    if (!fs.existsSync(followupDir)) continue;
    for (const [fileName, bucket] of [
      ['blocked-failures.json', 'blocked'],
      ['source-repair.json', 'source_repair'],
      ['retryable-failures.json', 'retryable'],
    ]) {
      const filePath = path.join(followupDir, fileName);
      if (!fs.existsSync(filePath)) continue;
      const rows = readJsonIfExists(filePath, []);
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        if (String(row.gapFamily || '').trim() !== 'advocates_legal') continue;
        const sourceUrl = normalizeUrl(row.sourceUrl || row.finalUrl);
        const followupReason = String(row.followupReason || row.reason || '').trim();
        const errorCode = String(row.errorCode || '').trim().toUpperCase();
        if (!sourceUrl || !followupReason) continue;
        const key = `${bucket}|${followupReason}|${sourceUrl}`;
        const current = grouped.get(key) || {
          bucket,
          followupReason,
          sourceUrl,
          errorCode,
          count: 0,
        };
        if (!current.errorCode && errorCode) current.errorCode = errorCode;
        current.count += 1;
        grouped.set(key, current);
      }
    }
  }

  return new Set(
    [...grouped.values()]
      .filter((entry) =>
        entry.count >= 2 ||
        (entry.bucket === 'blocked' && terminalBlockedReasons.has(entry.followupReason)) ||
        (entry.bucket === 'blocked' && terminalErrorCodes.has(entry.errorCode)) ||
        (entry.bucket === 'source_repair' && terminalSourceRepairReasons.has(entry.followupReason)),
      )
      .map((entry) => entry.sourceUrl),
  );
}

function loadPreviouslyRejectedProviderSourceUrls() {
  const sourceUrls = new Set();
  const excludedReasons = new Set(['missing_provider_contact_signal']);
  if (!fs.existsSync(runsDir)) return sourceUrls;

  const runDirs = fs.readdirSync(runsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const runId of runDirs) {
    const rejectedPath = path.join(runsDir, runId, 'validated', 'providers_care', 'rejected.ndjson');
    if (!fs.existsSync(rejectedPath)) continue;
    const lines = fs.readFileSync(rejectedPath, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    for (const line of lines) {
      const row = JSON.parse(line);
      const reasons = Array.isArray(row.validationReasons) ? row.validationReasons : [];
      if (!reasons.some((reason) => excludedReasons.has(String(reason)))) continue;
      const sourceUrl = normalizeUrl(row.sourceUrl || row.finalUrl || row.canonicalUrl);
      if (sourceUrl) sourceUrls.add(sourceUrl);
    }
  }

  return sourceUrls;
}

function loadAlreadyStagedProviderKeys() {
  const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
  if (!fs.existsSync(dbPath)) return new Set();
  const db = new Database(dbPath, { readonly: true });
  const keys = new Set();
  try {
    const rows = db.prepare('SELECT state_id, source_url FROM staging_scraped_resource_providers').all();
    for (const row of rows) {
      keys.add(`${String(row.state_id || '').trim()}|${normalizeUrl(row.source_url)}`);
    }
  } catch {
    // ignore missing staging table in partial environments
  } finally {
    db.close();
  }
  return keys;
}

function loadDeterministicRejectedFamilySourceUrls() {
  const acceptedByFamily = new Map();
  const rejectedByFamily = new Map();
  const deterministicReasonsByFamily = new Map([
    ['forms_guides', new Set([
      'forms_requires_official_source',
      'missing_title_and_heading',
      'missing_form_program_name',
      'missing_official_download_or_library_url',
    ])],
    ['advocates_legal', new Set([
      'missing_advocate_relevance_signal',
    ])],
    ['housing', new Set([
      'missing_actionable_service_signal',
      'topical_reference_only',
    ])],
    ['programs_benefits', new Set([
      'missing_action_signal',
      'missing_title_and_heading',
      'missing_program_name',
    ])],
    ['waivers', new Set([
      'missing_action_signal',
      'missing_title_and_heading',
      'missing_program_name',
    ])],
    ['program_waitlists', new Set([
      'missing_action_signal',
      'missing_title_and_heading',
      'missing_program_name',
    ])],
    ['dd_routing', new Set([
      'missing_dd_contact_signal',
      'missing_title_and_heading',
      'missing_office_name',
    ])],
    ['medicaid_hhs_offices', new Set([
      'missing_office_phone',
      'missing_office_address',
    ])],
    ['geography_counties', new Set([
      'missing_basic_signal',
    ])],
    ['source_registry', new Set([
      'missing_title_and_heading',
      'missing_basic_signal',
    ])],
    ['condition_nonprofits', new Set([
      'missing_title_and_heading',
      'missing_basic_signal',
    ])],
    ['parent_training_nonprofits', new Set([
      'missing_title_and_heading',
      'missing_basic_signal',
    ])],
    ['nonprofit_support', new Set([
      'missing_public_contact_signal',
    ])],
  ]);
  const requiredReasonsByFamily = new Map([
    ['programs_benefits', new Set(['missing_action_signal'])],
    ['waivers', new Set(['missing_action_signal'])],
    ['program_waitlists', new Set(['missing_action_signal'])],
    ['dd_routing', new Set(['missing_dd_contact_signal'])],
  ]);
  if (!fs.existsSync(runsDir)) return new Map();

  const runDirs = fs.readdirSync(runsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const runId of runDirs) {
    const validatedDir = path.join(runsDir, runId, 'validated');
    if (!fs.existsSync(validatedDir)) continue;
    const familyDirs = fs.readdirSync(validatedDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const family of familyDirs) {
      const deterministicReasons = deterministicReasonsByFamily.get(family);
      if (!deterministicReasons) continue;

      const acceptedPath = path.join(validatedDir, family, 'accepted.ndjson');
      if (fs.existsSync(acceptedPath)) {
        const target = acceptedByFamily.get(family) || new Set();
        const lines = fs.readFileSync(acceptedPath, 'utf8')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);
        for (const line of lines) {
          const row = JSON.parse(line);
          const sourceUrl = normalizeUrl(row.sourceUrl || row.finalUrl || row.canonicalUrl);
          if (sourceUrl) target.add(sourceUrl);
        }
        acceptedByFamily.set(family, target);
      }

      const rejectedPath = path.join(validatedDir, family, 'rejected.ndjson');
      if (!fs.existsSync(rejectedPath)) continue;
      const target = rejectedByFamily.get(family) || new Map();
      const lines = fs.readFileSync(rejectedPath, 'utf8')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      for (const line of lines) {
        const row = JSON.parse(line);
        const sourceUrl = normalizeUrl(row.sourceUrl || row.finalUrl || row.canonicalUrl);
        if (!sourceUrl) continue;
        const reasons = Array.isArray(row.validationReasons) ? row.validationReasons : [];
        if (!reasons.length) continue;
        if (!reasons.every((reason) => deterministicReasons.has(reason))) continue;
        const requiredReasons = requiredReasonsByFamily.get(family);
        if (requiredReasons && ![...requiredReasons].every((reason) => reasons.includes(reason))) continue;
        const current = target.get(sourceUrl) || { count: 0 };
        current.count += 1;
        target.set(sourceUrl, current);
      }
      rejectedByFamily.set(family, target);
    }
  }

  const suppressed = new Map();
  for (const [family, rejectedMap] of rejectedByFamily.entries()) {
    const acceptedUrls = acceptedByFamily.get(family) || new Set();
    const target = new Set();
    for (const [sourceUrl] of rejectedMap.entries()) {
      if (acceptedUrls.has(sourceUrl)) continue;
      target.add(sourceUrl);
    }
    if (target.size) suppressed.set(family, target);
  }

  return suppressed;
}

function loadRepeatedFamilyFollowupSourceUrls(minRepeats = 2) {
  const grouped = new Map();
  const terminalBlockedReasonsByFamily = new Map([
    ['programs_benefits', new Set(['access_blocked_403'])],
    ['waivers', new Set(['access_blocked_403'])],
    ['program_waitlists', new Set(['access_blocked_403'])],
    ['medicaid_hhs_offices', new Set(['access_blocked_403'])],
    ['dd_routing', new Set(['access_blocked_403'])],
    ['knowledge_content', new Set(['access_blocked_403'])],
    ['nonprofit_support', new Set(['access_blocked_403'])],
  ]);
  if (!fs.existsSync(runsDir)) return new Map();

  const runDirs = fs.readdirSync(runsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const runId of runDirs) {
    const followupDir = path.join(runsDir, runId, 'followups');
    if (!fs.existsSync(followupDir)) continue;
    for (const fileName of ['blocked-failures.json', 'source-repair.json', 'retryable-failures.json']) {
      const filePath = path.join(followupDir, fileName);
      if (!fs.existsSync(filePath)) continue;
      const rows = readJsonIfExists(filePath, []);
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        const gapFamily = String(row.gapFamily || '').trim();
        if (!gapFamily || gapFamily === 'providers_care' || gapFamily === 'advocates_legal') continue;
        const sourceUrl = normalizeUrl(row.sourceUrl || row.finalUrl);
        const reason = String(row.followupReason || row.reason || '').trim();
        if (!sourceUrl || !reason) continue;
        const bucket = fileName === 'blocked-failures.json'
          ? 'blocked'
          : fileName === 'source-repair.json'
            ? 'source_repair'
            : 'retryable';
        const key = `${gapFamily}|${bucket}|${reason}|${sourceUrl}`;
        const current = grouped.get(key) || { gapFamily, sourceUrl, reason, bucket, count: 0 };
        current.count += 1;
        grouped.set(key, current);
      }
    }
  }

  const suppressed = new Map();
  for (const entry of grouped.values()) {
    const terminalBlockedReasons = terminalBlockedReasonsByFamily.get(entry.gapFamily) || new Set();
    if (entry.count < minRepeats && !(entry.bucket === 'blocked' && terminalBlockedReasons.has(entry.reason))) continue;
    const target = suppressed.get(entry.gapFamily) || new Set();
    target.add(entry.sourceUrl);
    suppressed.set(entry.gapFamily, target);
  }

  return suppressed;
}

function loadSuspectParseReadySourceUrls() {
  const suspectByFamily = new Map();
  if (!fs.existsSync(runsDir)) return suspectByFamily;

  const runDirs = fs.readdirSync(runsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const runId of runDirs) {
    const suspectPath = path.join(runsDir, runId, 'followups', 'parse-ready-suspect.json');
    if (!fs.existsSync(suspectPath)) continue;
    const rows = readJsonIfExists(suspectPath, []);
    if (!Array.isArray(rows)) continue;
    for (const row of rows) {
      const gapFamily = String(row.gapFamily || '').trim();
      const sourceUrl = normalizeUrl(row.sourceUrl || row.finalUrl);
      if (!gapFamily || !sourceUrl) continue;
      const target = suspectByFamily.get(gapFamily) || new Set();
      target.add(sourceUrl);
      suspectByFamily.set(gapFamily, target);
    }
  }

  return suspectByFamily;
}

function loadRepeatedStaleSourceRepairUrls() {
  const counts = new Map();
  const terminalSourceRepairReasonsByFamily = new Map([
    ['medicaid_hhs_offices', new Set(['malformed_county_hostname'])],
  ]);
  if (!fs.existsSync(runsDir)) return new Map();

  const runDirs = fs.readdirSync(runsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const runId of runDirs) {
    const sourceRepairPath = path.join(runsDir, runId, 'followups', 'source-repair.json');
    if (!fs.existsSync(sourceRepairPath)) continue;
    const rows = readJsonIfExists(sourceRepairPath, []);
    for (const row of rows) {
      const gapFamily = String(row.gapFamily || '').trim();
      const followupReason = String(row.followupReason || row.reason || '').trim();
      const sourceUrl = normalizeUrl(row.sourceUrl || row.finalUrl);
      if (!gapFamily || !sourceUrl) continue;
      const terminalReasons = terminalSourceRepairReasonsByFamily.get(gapFamily) || new Set();
      if (followupReason !== 'stale_or_invalid_404' && !terminalReasons.has(followupReason)) continue;
      const key = `${gapFamily}|${sourceUrl}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }

  const suppressed = new Map();
  for (const [key, count] of counts.entries()) {
    if (count < 1) continue;
    const [gapFamily, sourceUrl] = key.split('|');
    const target = suppressed.get(gapFamily) || new Set();
    target.add(sourceUrl);
    suppressed.set(gapFamily, target);
  }

  return suppressed;
}

const FAMILY_PRIORITY = {
  providers_care: 100,
  forms_guides: 95,
  advocates_legal: 90,
  housing: 85,
  goods_supplies: 80,
  jobs_vocational: 75,
  care_independent_living: 70,
  legal_aid: 65,
  knowledge_content: 60,
  programs_benefits: 30,
  dd_routing: 25,
  waivers: 20,
  nonprofit_support: 10,
};

const LANE_PRIORITY = {
  source_family_authoring: 300,
  ready_target_scrape: 200,
  remaining_ready: 100,
};

function familyPriority(gapFamily) {
  return FAMILY_PRIORITY[gapFamily] || 0;
}

function deriveExecutionLane(row) {
  if (row.sourceQueue === 'authored_missing_family') {
    return String(row.ledgerStatus || '').startsWith('ready_') ? 'ready_target_scrape' : 'remaining_ready';
  }
  if (String(row.ledgerStatus || '').startsWith('ready_')) return 'ready_target_scrape';
  return 'remaining_ready';
}

function deriveExecutionPriority(row) {
  const lane = deriveExecutionLane(row);
  const lanePriority = LANE_PRIORITY[lane] || 0;
  const familyScore = familyPriority(row.gapFamily);
  const rowScore = Number(row.trustedMissingRows || row.recordCount || row.priority || 0);
  return (lanePriority * 100000) + (familyScore * 1000) + rowScore;
}

function withExecutionMetadata(row) {
  return {
    ...row,
    executionLane: deriveExecutionLane(row),
    familyPriority: familyPriority(row.gapFamily),
    executionPriority: deriveExecutionPriority(row),
  };
}

function ranked(rows) {
  return [...rows].sort((a, b) =>
    Number(b.executionPriority || 0) - Number(a.executionPriority || 0) ||
    Number(b.trustedMissingRows || b.recordCount || 0) - Number(a.trustedMissingRows || a.recordCount || 0) ||
    Number(b.priority || 0) - Number(a.priority || 0) ||
    String(a.sourceUrl || '').localeCompare(String(b.sourceUrl || ''))
  );
}

const scrapeNowPath = latestGeneratedJson('scrape-now-only-');
const dbDiscoveredPath = latestGeneratedJson('db-discovered-source-targets-');
const missingFamiliesPath = latestGeneratedJson('missing-source-families-');
const authoredTargetsPath = latestGeneratedJson('authored-missing-source-targets-');
const knowledgeStatusQueuePath = latestGeneratedJsonIfPresent('knowledge-content-status-queue-');
const scrapeNow = readJson(scrapeNowPath);
const dbDiscovered = readJson(dbDiscoveredPath);
const missingFamilies = readJson(missingFamiliesPath);
const authoredTargets = fs.existsSync(authoredTargetsPath) ? readJson(authoredTargetsPath) : { targets: [] };
const knowledgeRepairLedger = readJsonIfExists(knowledgeRepairLedgerPath, { rows: [] });
const knowledgeStatusQueue = knowledgeStatusQueuePath ? readJson(knowledgeStatusQueuePath) : { rows: [] };
const acceptedFamilySourceUrls = loadPreviouslyAcceptedFamilySourceUrls();
const providerRepeatedBlockerSourceUrls = loadProviderRepeatedBlockerSourceUrls();
const advocateBlockedSourceUrls = loadAdvocateBlockedSourceUrls();
const previouslyRejectedProviderSourceUrls = loadPreviouslyRejectedProviderSourceUrls();
const alreadyStagedProviderKeys = loadAlreadyStagedProviderKeys();
const deterministicRejectedFamilySourceUrls = loadDeterministicRejectedFamilySourceUrls();
const repeatedFamilyFollowupSourceUrls = loadRepeatedFamilyFollowupSourceUrls();
const repeatedStaleSourceRepairUrls = loadRepeatedStaleSourceRepairUrls();
const suspectParseReadySourceUrls = loadSuspectParseReadySourceUrls();
const actionableKnowledgeTargetIds = new Set(
  (knowledgeStatusQueue.rows || [])
    .filter((row) => ['pending_exact_target', 'reviewed_replacement_ready'].includes(String(row.finalStatus || '').trim()))
    .map((row) => String(row.id || '').trim())
    .filter(Boolean),
);
const retryableKnowledgeTargetIds = new Set(
  (knowledgeStatusQueue.rows || [])
    .filter((row) =>
      String(row.finalStatus || '').trim() === 'deferred_unresolved'
      && String(row.lastFollowupReason || '').trim() === 'sandbox_network_disabled'
    )
    .map((row) => String(row.id || '').trim())
    .filter(Boolean),
);
const knownKnowledgeTargetIds = new Set(
  (knowledgeStatusQueue.rows || [])
    .map((row) => String(row.id || '').trim())
    .filter(Boolean),
);
const suppressedKnowledgeTargetIds = new Set(
  (knowledgeRepairLedger.rows || [])
    .filter((row) => ['deferred_blocked_source', 'skipped_unresolved'].includes(String(row.status || '').trim()))
    .map((row) => String(row.id || '').trim())
    .filter(Boolean),
);
const reviewedKnowledgeReplacementsById = new Map(
  (knowledgeRepairLedger.rows || [])
    .filter((row) =>
      String(row.status || '').trim() === 'reviewed_replacement_ready'
      && normalizeUrl(row.reviewedSourceUrl)
      && normalizeUrl(row.reviewedSourceUrl) !== normalizeUrl(row.sourceUrl)
    )
    .map((row) => [String(row.id || '').trim(), row])
);

function normalizeLaunchGapFamily(row) {
  if (String(row?.targetTable || '').trim() === 'program_waitlists') {
    return 'program_waitlists';
  }
  return row.gapFamily;
}

function sourceQueueRank(sourceQueue) {
  if (sourceQueue === 'master_ledger_ready') return 3;
  if (sourceQueue === 'authored_missing_family') return 2;
  if (sourceQueue === 'db_discovered_ready') return 1;
  return 0;
}

const normalizedScrapeRows = (scrapeNow.rows || []).map((row) => ({
  ...row,
  gapFamily: normalizeLaunchGapFamily(row),
  sourceQueue: 'master_ledger_ready',
  duplicateGroup: row.duplicateGroup || duplicateGroup(row.sourceUrl),
}));

const normalizedDbRows = (dbDiscovered.actionableNewTargets || []).map((row) => ({
  ...row,
  gapFamily: normalizeLaunchGapFamily(row),
  sourceQueue: 'db_discovered_ready',
  duplicateGroup: row.duplicateGroup || duplicateGroup(row.sourceUrl),
  targetTable: row.targetTable,
  trustedMissingRows: 0,
  priority: Number(row.recordCount || 0),
}));

const normalizedAuthoredRows = (authoredTargets.targets || [])
  .filter((row) => {
    if (row.gapFamily !== 'knowledge_content') return true;
    const id = String(row.id || '').trim();
    if (suppressedKnowledgeTargetIds.has(id) && !retryableKnowledgeTargetIds.has(id)) return false;
    if (actionableKnowledgeTargetIds.has(id)) return true;
    if (retryableKnowledgeTargetIds.has(id)) return true;
    return !knownKnowledgeTargetIds.has(id);
  })
  .map((row) => ({
    ...row,
    gapFamily: normalizeLaunchGapFamily(row),
    sourceQueue: 'authored_missing_family',
    duplicateGroup: row.duplicateGroup || duplicateGroup(row.sourceUrl),
    targetTable: row.targetTable,
    trustedMissingRows: 0,
    priority: Number(row.priority || 0),
  }))
  .map((row) => {
    const replacement = row.gapFamily === 'knowledge_content'
      ? reviewedKnowledgeReplacementsById.get(String(row.id || '').trim())
      : null;
    if (!replacement) return row;
    return {
      ...row,
      sourceName: replacement.reviewedSourceName || row.sourceName,
      sourceUrl: normalizeUrl(replacement.reviewedSourceUrl) || row.sourceUrl,
      domain: new URL(normalizeUrl(replacement.reviewedSourceUrl) || row.sourceUrl).hostname.replace(/^www\./, '').toLowerCase(),
      evidenceUrl: normalizeUrl(replacement.reviewedSourceUrl) || row.evidenceUrl,
    };
  });

const combinedMap = new Map();
for (const row of [...normalizedScrapeRows, ...normalizedDbRows, ...normalizedAuthoredRows]) {
  const familyAcceptedUrls = acceptedFamilySourceUrls.get(String(row.gapFamily || '').trim());
  const familyDeterministicRejectedUrls = deterministicRejectedFamilySourceUrls.get(String(row.gapFamily || '').trim());
  const familyRepeatedFollowupUrls = repeatedFamilyFollowupSourceUrls.get(String(row.gapFamily || '').trim());
  const familyRepeatedStaleUrls = repeatedStaleSourceRepairUrls.get(String(row.gapFamily || '').trim());
  const familySuspectParseReadyUrls = suspectParseReadySourceUrls.get(String(row.gapFamily || '').trim());
  const normalizedSourceUrl = normalizeUrl(row.sourceUrl);
  const isKnowledgeRetryableRow =
    row.gapFamily === 'knowledge_content'
    && retryableKnowledgeTargetIds.has(String(row.id || '').trim());
  const providerSelectionKey = `${String(row.stateId || '').trim()}|${normalizedSourceUrl}`;
  if (familyAcceptedUrls?.has(normalizedSourceUrl)) continue;
  if (row.gapFamily === 'providers_care' && providerRepeatedBlockerSourceUrls.has(normalizedSourceUrl)) continue;
  if (row.gapFamily === 'advocates_legal' && advocateBlockedSourceUrls.has(normalizedSourceUrl)) continue;
  if (row.gapFamily === 'providers_care' && previouslyRejectedProviderSourceUrls.has(normalizedSourceUrl)) continue;
  if (row.gapFamily === 'providers_care' && alreadyStagedProviderKeys.has(providerSelectionKey)) continue;
  if (familyDeterministicRejectedUrls?.has(normalizedSourceUrl)) continue;
  if (!isKnowledgeRetryableRow && familyRepeatedFollowupUrls?.has(normalizedSourceUrl)) continue;
  if (!isKnowledgeRetryableRow && familyRepeatedStaleUrls?.has(normalizedSourceUrl)) continue;
  if (familySuspectParseReadyUrls?.has(normalizedSourceUrl)) continue;
  const key = `${row.targetTable}|${row.duplicateGroup}`;
  if (!combinedMap.has(key)) {
    combinedMap.set(key, row);
    continue;
  }
  const existing = combinedMap.get(key);
  const existingScore = Number(existing.trustedMissingRows || existing.recordCount || existing.priority || 0);
  const rowScore = Number(row.trustedMissingRows || row.recordCount || row.priority || 0);
  const existingQueueRank = sourceQueueRank(existing.sourceQueue);
  const rowQueueRank = sourceQueueRank(row.sourceQueue);
  if (rowQueueRank > existingQueueRank || (rowQueueRank === existingQueueRank && rowScore > existingScore)) {
    combinedMap.set(key, row);
  }
}

const combinedReady = ranked([...combinedMap.values()].map(withExecutionMetadata));

function buildWave(id, label, rows) {
  const ordered = ranked(rows);
  return {
    id,
    label,
    rows: ordered,
  };
}

const queueWaves = [
  buildWave(
    'wave_0_source_family_unlock',
    'Source-family unlock packs',
    combinedReady.filter((row) => row.executionLane === 'source_family_authoring').slice(0, 500),
  ),
  buildWave(
    'wave_1_lightweight_priority',
    'Priority lightweight ready targets',
    combinedReady.filter((row) =>
      row.ledgerStatus === 'ready_lightweight'
      && ['providers_care', 'forms_guides', 'housing', 'goods_supplies', 'jobs_vocational', 'care_independent_living', 'legal_aid', 'knowledge_content'].includes(row.gapFamily)
    ).slice(0, 800),
  ),
  buildWave(
    'wave_2_advocates_legal',
    'Advocates and legal ready targets',
    combinedReady.filter((row) => row.ledgerStatus === 'ready_lightweight' && row.gapFamily === 'advocates_legal').slice(0, 500),
  ),
  buildWave(
    'wave_3_forms_pdf',
    'Forms and PDF targets',
    combinedReady.filter((row) => row.ledgerStatus === 'ready_pdf' || row.targetTable === 'forms').slice(0, 500),
  ),
  buildWave(
    'wave_4_js_heavy',
    'JS-heavy targets',
    combinedReady.filter((row) => row.ledgerStatus === 'ready_js_heavy').slice(0, 500),
  ),
  buildWave(
    'wave_5_remaining_ready',
    'Remaining ready targets',
    combinedReady.slice(0, 2000),
  ),
];

const payload = {
  generatedAt: generatedDate,
  summary: {
    masterReadyRows: normalizedScrapeRows.length,
    dbDiscoveredActionableRows: normalizedDbRows.length,
    authoredMissingFamilyRows: normalizedAuthoredRows.length,
    suppressedDeferredKnowledgeRows: suppressedKnowledgeTargetIds.size,
    suppressedProviderRepeatedBlockerUrls: providerRepeatedBlockerSourceUrls.size,
    suppressedAdvocateBlockedUrls: advocateBlockedSourceUrls.size,
    suppressedProviderRejectedUrls: previouslyRejectedProviderSourceUrls.size,
    suppressedProviderStagedKeys: alreadyStagedProviderKeys.size,
    suppressedDeterministicRejectedUrls: [...deterministicRejectedFamilySourceUrls.values()].reduce((sum, urls) => sum + urls.size, 0),
    suppressedRepeatedFamilyFollowupUrls: [...repeatedFamilyFollowupSourceUrls.values()].reduce((sum, urls) => sum + urls.size, 0),
    suppressedRepeatedStaleSourceRepairUrls: [...repeatedStaleSourceRepairUrls.values()].reduce((sum, urls) => sum + urls.size, 0),
    suppressedSuspectParseReadyUrls: [...suspectParseReadySourceUrls.values()].reduce((sum, urls) => sum + urls.size, 0),
    combinedReadyUniqueRows: combinedReady.length,
    missingSourceFamilyCount: (missingFamilies.families || []).length,
    combinedByGapFamily: countBy(combinedReady, 'gapFamily'),
    combinedByStatus: countBy(combinedReady, 'ledgerStatus'),
    combinedByQueue: countBy(combinedReady, 'sourceQueue'),
    combinedByExecutionLane: countBy(combinedReady, 'executionLane'),
  },
  queueWaves: queueWaves.map((wave) => ({
    id: wave.id,
    label: wave.label,
    count: wave.rows.length,
    byGapFamily: countBy(wave.rows, 'gapFamily'),
    byExecutionLane: countBy(wave.rows, 'executionLane'),
    rowKeys: wave.rows.map((row) => `${row.targetTable}|${row.sourceUrl}`),
    topRows: wave.rows.slice(0, 50),
  })),
  stillNeedToAuthor: missingFamilies.families || [],
  combinedReadyRows: combinedReady,
};

const mdLines = [
  '# Source Acquisition Completion Plan',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This is the current answer to: what do we still need to scrape or author to fill the repo gaps?',
  '',
  '## Summary',
  '',
  `- master-ledger ready rows: ${payload.summary.masterReadyRows}`,
  `- DB-discovered actionable rows not yet in master ledger: ${payload.summary.dbDiscoveredActionableRows}`,
  `- authored missing-family rows: ${payload.summary.authoredMissingFamilyRows}`,
  `- combined unique ready rows: ${payload.summary.combinedReadyUniqueRows}`,
  `- source families still needing authoring: ${payload.summary.missingSourceFamilyCount}`,
  `- suppressed provider repeated blocker urls: ${payload.summary.suppressedProviderRepeatedBlockerUrls}`,
  `- suppressed advocate blocked urls: ${payload.summary.suppressedAdvocateBlockedUrls}`,
  `- suppressed provider rejected urls: ${payload.summary.suppressedProviderRejectedUrls}`,
  `- suppressed provider staged keys: ${payload.summary.suppressedProviderStagedKeys}`,
  `- suppressed deterministic rejected urls: ${payload.summary.suppressedDeterministicRejectedUrls}`,
  `- suppressed repeated family followup urls: ${payload.summary.suppressedRepeatedFamilyFollowupUrls}`,
  `- suppressed repeated stale source-repair urls: ${payload.summary.suppressedRepeatedStaleSourceRepairUrls}`,
  `- suppressed suspect parse-ready urls: ${payload.summary.suppressedSuspectParseReadyUrls}`,
  '',
  '## Combined Ready Rows By Gap Family',
  '',
];

for (const [gapFamily, count] of Object.entries(payload.summary.combinedByGapFamily).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${gapFamily}: ${count}`);
}

mdLines.push('', '## Combined Ready Rows By Status', '');
for (const [status, count] of Object.entries(payload.summary.combinedByStatus).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${status}: ${count}`);
}

mdLines.push('', '## Combined Ready Rows By Execution Lane', '');
for (const [lane, count] of Object.entries(payload.summary.combinedByExecutionLane).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${lane}: ${count}`);
}

mdLines.push('', '## Queue Waves', '');
for (const wave of payload.queueWaves) {
  mdLines.push(`### ${wave.label}`);
  mdLines.push('');
  mdLines.push(`- rows: ${wave.count}`);
  for (const [gapFamily, count] of Object.entries(wave.byGapFamily).sort((a, b) => b[1] - a[1]).slice(0, 8)) {
    mdLines.push(`- ${gapFamily}: ${count}`);
  }
  mdLines.push('');
}

mdLines.push('## Still Need To Author', '');
for (const family of payload.stillNeedToAuthor) {
  mdLines.push(`- ${family.label}: ${family.reason}`);
}

mdLines.push('', '## Authored Missing-Family Coverage', '');
for (const [gapFamily, count] of Object.entries(countBy(normalizedAuthoredRows, 'gapFamily')).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${gapFamily}: ${count}`);
}

mdLines.push('', '## Top Combined Ready Targets', '');
for (const row of combinedReady.slice(0, 50)) {
  mdLines.push(`- ${row.stateId}: ${row.sourceUrl} (${row.targetTable}; ${row.gapFamily}; ${row.ledgerStatus}; queue=${row.sourceQueue})`);
}

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  summary: payload.summary,
  report: mdOutPath,
  json: jsonOutPath,
}, null, 2));
