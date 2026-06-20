import fs from 'node:fs';
import path from 'node:path';

const MAX_RECORDS_PER_RUN = 5;
const MAX_URLS_PER_RECORD = 3;
const DEFAULT_RETRY_COUNT = 2;
const DEFAULT_RATE_LIMIT_MS = 1200;
const REQUEST_TIMEOUT_MS = 15000;

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const queuePath = path.join(docsDir, `forms-fallback-scrape-queue-${generatedDate}.json`);
const outputRoot = path.join(repoRoot, 'data', 'source-acquisition-runs');
const completionLedgerPath = path.join(repoRoot, 'data', 'source-acquisition-state', 'forms-fallback-completion-ledger.json');
const completionLedgerLockPath = `${completionLedgerPath}.lock`;

function parseArgs(argv) {
  const args = {
    mode: 'dry-run',
    limit: MAX_RECORDS_PER_RUN,
    state: '',
    candidateType: '',
    retryCount: DEFAULT_RETRY_COUNT,
    rateLimitMs: DEFAULT_RATE_LIMIT_MS,
    runId: '',
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'mode' && value) args.mode = value.toLowerCase();
    if (flag === 'limit' && Number.isFinite(Number(value))) args.limit = Number(value);
    if (flag === 'state' && value) args.state = value.toLowerCase();
    if (flag === 'candidate-type' && value) args.candidateType = value;
    if (flag === 'retry-count' && Number.isFinite(Number(value))) args.retryCount = Number(value);
    if (flag === 'rate-limit-ms' && Number.isFinite(Number(value))) args.rateLimitMs = Number(value);
    if (flag === 'run-id' && value) args.runId = value;
  }

  args.limit = Math.max(1, Math.min(MAX_RECORDS_PER_RUN, args.limit || MAX_RECORDS_PER_RUN));
  args.retryCount = Math.max(0, args.retryCount || DEFAULT_RETRY_COUNT);
  args.rateLimitMs = Math.max(0, args.rateLimitMs || DEFAULT_RATE_LIMIT_MS);
  return args;
}

function ensureStateFilter(args) {
  if (!args.state) {
    throw new Error('The forms fallback runner requires --state=<state>. Cross-state runs are disabled for this bounded workflow.');
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return readJson(filePath);
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function appendLine(filePath, line) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${line}\n`);
}

async function withFilesystemLock(lockPath, callback, { retryMs = 100, maxWaitMs = 20000 } = {}) {
  const startedAt = Date.now();
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  while (true) {
    try {
      fs.mkdirSync(lockPath, { recursive: false });
      break;
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
      if (Date.now() - startedAt >= maxWaitMs) {
        throw new Error(`Timed out waiting for filesystem lock: ${lockPath}`);
      }
      await sleep(retryMs);
    }
  }

  try {
    return await callback();
  } finally {
    fs.rmSync(lockPath, { recursive: true, force: true });
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function rowKey(row) {
  return `${row.stateId || ''}|${row.candidateType || ''}|${row.sourceUrl || ''}`;
}

function pickRows(queue, args, completionLedger) {
  const alreadyCompletedKeys = new Set(
    (completionLedger.rows || [])
      .filter((row) => row.stateId === args.state && row.status === 'complete')
      .map((row) => row.rowKey),
  );

  let rows = (queue.rows || []).filter((row) => row.stateId === args.state);
  if (args.candidateType) rows = rows.filter((row) => row.candidateType === args.candidateType);

  const filteredRows = rows
    .map((row) => ({ ...row, rowKey: rowKey(row) }))
    .filter((row) => !alreadyCompletedKeys.has(row.rowKey));

  return filteredRows.slice(0, args.limit);
}

function buildSelectionWarnings(queue, args, selectedRows, completionLedger) {
  const warnings = [];
  const excludedFederalOnlyStates = queue?.summary?.excludedFederalOnlyStates || [];
  const completedStateRows = (completionLedger.rows || []).filter((row) => row.stateId === args.state && row.status === 'complete');

  if (excludedFederalOnlyStates.includes(args.state)) {
    warnings.push({
      code: 'federal_only_excluded_state',
      stateId: args.state,
      reason: 'Only federal fallback evidence is available for this state, so no state-specific forms fallback rows were queued.',
    });
  } else if (selectedRows.length === 0 && completedStateRows.length > 0) {
    warnings.push({
      code: 'state_already_completed',
      stateId: args.state,
      reason: 'All queued rows for this state were already completed in prior bounded runs, so this run did not revisit them.',
    });
  } else if (selectedRows.length === 0) {
    warnings.push({
      code: 'no_matching_queue_rows',
      stateId: args.state,
      reason: 'No queued state-specific forms fallback rows matched the selected filters.',
    });
  }

  return warnings;
}

function domainMatches(expectedDomain, urlString) {
  try {
    const hostname = new URL(urlString).hostname.replace(/^www\./, '').toLowerCase();
    const normalized = String(expectedDomain || '').replace(/^www\./, '').toLowerCase();
    return hostname === normalized || hostname.endsWith(`.${normalized}`);
  } catch {
    return false;
  }
}

function extractHtmlSignals(bodyText) {
  const text = String(bodyText || '').toLowerCase();
  return {
    hasFormSignal: /(form|application|apply|eligibility|waiver|referral|packet|download|pdf)/i.test(text),
    hasAgencySignal: /(medicaid|disability|developmental|health|human services|special education|services)/i.test(text),
  };
}

function classifyFetchRecord(row, fetched) {
  const domainSafe = domainMatches(row.domain, fetched.finalUrl || row.sourceUrl);
  const contentType = String(fetched.contentType || '').toLowerCase();
  const isPdf = contentType.includes('application/pdf');
  const isHtml = contentType.includes('text/html') || contentType.includes('application/xhtml+xml') || !contentType;
  const htmlSignals = isHtml ? extractHtmlSignals(fetched.body) : { hasFormSignal: false, hasAgencySignal: false };
  const valid = fetched.ok && domainSafe && (isPdf || (htmlSignals.hasFormSignal && htmlSignals.hasAgencySignal));

  return {
    valid,
    evidenceType: isPdf ? 'pdf_or_download' : 'html_form_related_page',
    domainSafe,
    contentType: fetched.contentType,
    signalSummary: htmlSignals,
  };
}

function buildUrlBudget(row) {
  const budget = [];
  const seen = new Set();

  function push(url, purpose) {
    if (!url || seen.has(url) || budget.length >= MAX_URLS_PER_RECORD) return;
    seen.add(url);
    budget.push({ url, purpose });
  }

  push(row.sourceUrl, 'target_url');
  push(row.blockedFormsSourceUrl, 'supporting_page');
  return budget;
}

async function fetchWithRetry(url, args) {
  let lastError = null;
  for (let attempt = 1; attempt <= args.retryCount + 1; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': 'Ablefull forms fallback runner/1.0 (+https://ablefull.com)',
          'accept-language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const contentType = response.headers.get('content-type') || '';
      const body = contentType.includes('application/pdf')
        ? Buffer.from(await response.arrayBuffer())
        : await response.text();
      return {
        ok: response.ok,
        status: response.status,
        finalUrl: response.url || url,
        contentType,
        body,
        attempt,
      };
    } catch (error) {
      lastError = error;
      if (attempt <= args.retryCount) await sleep(args.rateLimitMs);
    }
  }
  throw lastError;
}

function saveFetchedArtifact({ runPaths, row, recordIndex, urlIndex, fetched }) {
  const extension = String(fetched.contentType || '').toLowerCase().includes('application/pdf') ? '.pdf' : '.html';
  const fileName = [
    String(recordIndex + 1).padStart(5, '0'),
    String(urlIndex + 1).padStart(2, '0'),
    slugify(row.stateId),
    slugify(row.candidateType),
    slugify(row.sourceName),
  ].join('-') + extension;
  const filePath = path.join(runPaths.pagesDir, fileName);
  fs.writeFileSync(filePath, fetched.body);
  return filePath;
}

function summarizeCounts(rows, key) {
  return rows.reduce((acc, row) => {
    const bucket = row?.[key] || 'unknown';
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});
}

function loadRunResults(resultsNdjsonPath) {
  if (!fs.existsSync(resultsNdjsonPath)) return [];
  return fs.readFileSync(resultsNdjsonPath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function renderMarkdownReport(summary, payload) {
  const rows = Array.isArray(payload.rows) ? payload.rows : [];
  const failures = rows.filter((row) => row.outcome !== 'validated_source' && row.outcome !== 'dry_run_queued');
  const lines = [
    '# Forms Fallback Source Acquisition Run',
    '',
    `- Run ID: \`${summary.runId}\``,
    `- Generated At: \`${summary.generatedAt}\``,
    `- Mode: \`${summary.mode}\``,
    `- State: \`${payload.filters.state}\``,
    `- Queue Rows Selected: \`${summary.selectedCount}\``,
    `- Processed This Invocation: \`${summary.processedCount}\``,
    `- Completed Total: \`${summary.completedCount}\``,
    `- Remaining: \`${summary.remainingCount}\``,
    `- URL Budget Per Record: \`${MAX_URLS_PER_RECORD}\``,
    '',
    '## Filters',
    '',
    `- State: \`${payload.filters.state}\``,
    `- Candidate Type: \`${payload.filters.candidateType || 'all'}\``,
    `- Limit Requested: \`${payload.filters.limitRequested}\``,
    `- Limit Applied: \`${payload.filters.limitApplied}\``,
    '',
    '## Warnings',
    '',
    ...(payload.warnings.length
      ? payload.warnings.map((warning) => `- ${warning.code}: ${warning.reason}${warning.stateId ? ` (${warning.stateId})` : ''}`)
      : ['- none']),
    '',
    '## Outcomes',
    '',
    ...Object.entries(summarizeCounts(rows, 'outcome')).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
    '',
    '## Failure Reasons',
    '',
    ...Object.entries(summarizeCounts(failures, 'failureReason')).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
    '',
    '## Sample Results',
    '',
    '| state | type | outcome | urlsTried | finalUrl | failureReason |',
    '| --- | --- | --- | --- | --- | --- |',
    ...rows.slice(0, 20).map((row) => `| ${row.stateId || ''} | ${row.candidateType || ''} | ${row.outcome || ''} | ${row.urlsTried || 0} | ${row.finalUrl || ''} | ${row.failureReason || ''} |`),
    '',
    `- Summary JSON: \`${summary.summaryPath}\``,
    `- Results JSON: \`${summary.resultsPath}\``,
    `- Results NDJSON: \`${summary.resultsNdjsonPath}\``,
    `- Progress JSON: \`${summary.progressPath}\``,
    `- Manifest JSON: \`${summary.manifestPath}\``,
    `- Report MD: \`${summary.reportPath}\``,
    `- Pages Dir: \`${summary.pagesDir}\``,
  ];
  fs.writeFileSync(summary.reportPath, `${lines.join('\n')}\n`);
}

function persistRunState({ runPaths, manifest, progress, warnings }) {
  const results = loadRunResults(runPaths.resultsNdjsonPath);
  const payload = {
    generatedAt: manifest.generatedAt,
    runId: manifest.runId,
    mode: manifest.mode,
    filters: manifest.filters,
    runtime: manifest.runtime,
    warnings,
    rows: results,
  };

  const summary = {
    runId: manifest.runId,
    generatedAt: new Date().toISOString(),
    mode: manifest.mode,
    selectedCount: manifest.selection.selectedCount,
    processedCount: progress.processedCount,
    completedCount: progress.completedCount,
    remainingCount: progress.remainingCount,
    succeeded: results.filter((row) => row.outcome === 'validated_source').length,
    manualReview: results.filter((row) => row.outcome === 'needs_manual_review').length,
    dryRunQueued: results.filter((row) => row.outcome === 'dry_run_queued').length,
    warningCount: warnings.length,
    pagesDir: runPaths.pagesDir,
    summaryPath: runPaths.summaryPath,
    resultsPath: runPaths.resultsPath,
    resultsNdjsonPath: runPaths.resultsNdjsonPath,
    progressPath: runPaths.progressPath,
    manifestPath: runPaths.manifestPath,
    reportPath: runPaths.reportPath,
  };

  writeJson(runPaths.progressPath, progress);
  writeJson(runPaths.resultsPath, payload);
  writeJson(runPaths.summaryPath, summary);
  renderMarkdownReport(summary, payload);
  return { summary, payload };
}

function upsertCompletionLedger(completionLedger, resultRow) {
  const index = completionLedger.rows.findIndex((row) => row.rowKey === resultRow.rowKey);
  const status = resultRow.outcome === 'dry_run_queued' ? 'previewed' : 'complete';
  const entry = {
    rowKey: resultRow.rowKey,
    stateId: resultRow.stateId,
    candidateType: resultRow.candidateType,
    sourceUrl: resultRow.sourceUrl,
    status,
    outcome: resultRow.outcome,
    completedAt: resultRow.completedAt,
    runId: resultRow.runId,
  };

  if (index >= 0) {
    completionLedger.rows[index] = entry;
  } else {
    completionLedger.rows.push(entry);
  }
  completionLedger.updatedAt = new Date().toISOString();
}

async function mergeCompletionLedgerResult(resultRow) {
  await withFilesystemLock(completionLedgerLockPath, async () => {
    const liveLedger = readJsonIfExists(completionLedgerPath, {
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rows: [],
    });
    upsertCompletionLedger(liveLedger, resultRow);
    writeJson(completionLedgerPath, liveLedger);
  });
}

function createRunPaths(runId) {
  const runDir = path.join(outputRoot, runId);
  return {
    runDir,
    pagesDir: path.join(runDir, 'forms-fallback-pages'),
    manifestPath: path.join(runDir, 'forms-fallback-manifest.json'),
    progressPath: path.join(runDir, 'forms-fallback-progress.json'),
    resultsPath: path.join(runDir, 'forms-fallback-results.json'),
    resultsNdjsonPath: path.join(runDir, 'forms-fallback-results.ndjson'),
    summaryPath: path.join(runDir, 'forms-fallback-summary.json'),
    reportPath: path.join(runDir, 'forms-fallback-report.md'),
  };
}

async function processRow({ row, args, recordIndex, runPaths }) {
  const urlPlan = buildUrlBudget(row);
  const startedAt = new Date().toISOString();

  if (args.mode !== 'live') {
    return {
      rowKey: row.rowKey,
      runId: path.basename(runPaths.runDir),
      stateId: row.stateId,
      candidateType: row.candidateType,
      sourceUrl: row.sourceUrl,
      finalUrl: '',
      outcome: 'dry_run_queued',
      failureReason: '',
      contentType: '',
      urlsTried: 0,
      urlBudget: MAX_URLS_PER_RECORD,
      fetchAttempts: [],
      startedAt,
      completedAt: new Date().toISOString(),
    };
  }

  const fetchAttempts = [];

  for (let urlIndex = 0; urlIndex < urlPlan.length; urlIndex += 1) {
    const target = urlPlan[urlIndex];
    try {
      const fetched = await fetchWithRetry(target.url, args);
      const artifactPath = saveFetchedArtifact({ runPaths, row, recordIndex, urlIndex, fetched });
      const classification = classifyFetchRecord(row, fetched);

      fetchAttempts.push({
        url: target.url,
        purpose: target.purpose,
        status: fetched.status,
        ok: fetched.ok,
        finalUrl: fetched.finalUrl,
        contentType: fetched.contentType,
        savedPath: artifactPath,
        valid: classification.valid,
        evidenceType: classification.evidenceType,
        signalSummary: classification.signalSummary,
      });

      if (classification.valid) {
        return {
          rowKey: row.rowKey,
          runId: path.basename(runPaths.runDir),
          stateId: row.stateId,
          candidateType: row.candidateType,
          sourceUrl: row.sourceUrl,
          finalUrl: fetched.finalUrl,
          outcome: 'validated_source',
          failureReason: '',
          contentType: fetched.contentType,
          urlsTried: fetchAttempts.length,
          urlBudget: MAX_URLS_PER_RECORD,
          fetchAttempts,
          startedAt,
          completedAt: new Date().toISOString(),
        };
      }
    } catch (error) {
      fetchAttempts.push({
        url: target.url,
        purpose: target.purpose,
        status: 0,
        ok: false,
        finalUrl: '',
        contentType: '',
        savedPath: '',
        valid: false,
        evidenceType: 'fetch_error',
        signalSummary: {},
        error: String(error?.message || error),
      });
    }

    if (urlIndex < urlPlan.length - 1) {
      await sleep(args.rateLimitMs);
    }
  }

  return {
    rowKey: row.rowKey,
    runId: path.basename(runPaths.runDir),
    stateId: row.stateId,
    candidateType: row.candidateType,
    sourceUrl: row.sourceUrl,
    finalUrl: fetchAttempts.find((attempt) => attempt.finalUrl)?.finalUrl || '',
    outcome: 'needs_manual_review',
    failureReason: fetchAttempts.some((attempt) => attempt.error)
      ? 'url_budget_exhausted_with_fetch_errors'
      : 'url_budget_exhausted_without_public_safe_validation',
    contentType: fetchAttempts.find((attempt) => attempt.contentType)?.contentType || '',
    urlsTried: fetchAttempts.length,
    urlBudget: MAX_URLS_PER_RECORD,
    fetchAttempts,
    startedAt,
    completedAt: new Date().toISOString(),
  };
}

const args = parseArgs(process.argv.slice(2));
ensureStateFilter(args);

if (!fs.existsSync(queuePath)) {
  throw new Error(`Missing forms fallback queue: ${queuePath}. Run npm run audit:forms-fallback-queue first.`);
}

const queue = readJson(queuePath);
const completionLedger = readJsonIfExists(completionLedgerPath, {
  generatedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  rows: [],
});
const selectedRows = pickRows(queue, args, completionLedger);
const warnings = buildSelectionWarnings(queue, args, selectedRows, completionLedger);
const runId = args.runId || new Date().toISOString().replace(/[:.]/g, '-');
const runPaths = createRunPaths(runId);

fs.mkdirSync(runPaths.pagesDir, { recursive: true });

const manifest = readJsonIfExists(runPaths.manifestPath, {
  generatedAt: generatedDate,
  runId,
  mode: args.mode,
  filters: {
    state: args.state,
    candidateType: args.candidateType || null,
    limitRequested: args.limit,
    limitApplied: selectedRows.length,
  },
  runtime: {
    retryCount: args.retryCount,
    rateLimitMs: args.rateLimitMs,
    maxRecordsPerRun: MAX_RECORDS_PER_RUN,
    maxUrlsPerRecord: MAX_URLS_PER_RECORD,
  },
  selection: {
    selectedCount: selectedRows.length,
    rowKeys: selectedRows.map((row) => row.rowKey),
  },
});

if (manifest.filters.state !== args.state) {
  throw new Error(`Run ${runId} is locked to state ${manifest.filters.state}, but this invocation requested ${args.state}.`);
}

const progress = readJsonIfExists(runPaths.progressPath, {
  runId,
  stateId: args.state,
  processedCount: 0,
  completedCount: 0,
  remainingCount: manifest.selection.selectedCount,
  completedRowKeys: [],
});

writeJson(runPaths.manifestPath, manifest);

const completedRowKeys = new Set(progress.completedRowKeys || []);
const rowsRemaining = selectedRows.filter((row) => !completedRowKeys.has(row.rowKey));
let processedThisInvocation = 0;

for (let index = 0; index < rowsRemaining.length; index += 1) {
  const row = rowsRemaining[index];
  const resultRow = await processRow({
    row,
    args,
    recordIndex: progress.completedCount,
    runPaths,
  });

  appendLine(runPaths.resultsNdjsonPath, JSON.stringify(resultRow));
  completedRowKeys.add(row.rowKey);
  progress.completedRowKeys = [...completedRowKeys];
  progress.processedCount += 1;
  progress.completedCount = progress.completedRowKeys.length;
  progress.remainingCount = Math.max(0, manifest.selection.selectedCount - progress.completedCount);
  processedThisInvocation += 1;

  upsertCompletionLedger(completionLedger, resultRow);
  await mergeCompletionLedgerResult(resultRow);
  persistRunState({ runPaths, manifest, progress, warnings });

  if (index < rowsRemaining.length - 1) {
    await sleep(args.rateLimitMs);
  }
}

const persisted = persistRunState({ runPaths, manifest, progress, warnings });

console.log(JSON.stringify({
  generatedAt: persisted.summary.generatedAt,
  mode: persisted.summary.mode,
  state: args.state,
  selectedCount: persisted.summary.selectedCount,
  processedCount: processedThisInvocation,
  completedCount: persisted.summary.completedCount,
  remainingCount: persisted.summary.remainingCount,
  warnings,
  report: {
    summary: persisted.summary.summaryPath,
    results: persisted.summary.resultsPath,
    resultsNdjson: persisted.summary.resultsNdjsonPath,
    progress: persisted.summary.progressPath,
    manifest: persisted.summary.manifestPath,
    md: persisted.summary.reportPath,
  },
}, null, 2));
