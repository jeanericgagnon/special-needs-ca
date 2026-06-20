import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  buildRowKey,
  classifyOutcome,
  executeSourcePackRun,
  normalizeUrl,
  readJsonl,
  selectSameDomainDiscoveryCandidate,
} from './ca-source-pack-lightweight-lib.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const californiaPackDir = path.join(repoRoot, 'data', 'source_packs', 'california');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ca-source-pack-test-'));

function makeRecord(overrides = {}) {
  return {
    state: 'CA',
    entity_id: 'sample-entity',
    source_role: 'sample_role',
    authority: 'official_state',
    agency: 'Agency',
    status: 'verified_target',
    batch_class: 'html',
    provenance_url: '',
    url: 'https://example.org/page',
    ...overrides,
  };
}

function makeResponse({
  url,
  status = 200,
  contentType = 'text/html; charset=utf-8',
  body = '<html><head><title>Title</title></head><body><h1>Heading</h1><a href="/ihss/apply">Apply</a></body></html>',
  headers = {},
}) {
  const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const headerMap = new Map([
    ['content-type', contentType],
    ['etag', headers.etag || 'W/"etag"'],
    ['last-modified', headers.lastModified || 'Sat, 20 Jun 2026 00:00:00 GMT'],
    ['location', headers.location || ''],
  ]);
  return {
    ok: status >= 200 && status < 300,
    status,
    url,
    headers: {
      get(name) {
        return headerMap.get(String(name).toLowerCase()) || '';
      },
    },
    arrayBuffer: async () => buffer,
    text: async () => buffer.toString('utf8'),
  };
}

async function runWithTempContext({
  inputRows,
  repairLedger = [],
  fetchImpl,
  args = {},
  runId = 'test-run',
}) {
  const baseDir = fs.mkdtempSync(path.join(tempRoot, 'run-'));
  const outputDir = path.join(baseDir, 'generated');
  const runDir = path.join(baseDir, 'runs', runId);
  const sourceDir = path.join(baseDir, 'source');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(runDir, { recursive: true });
  fs.mkdirSync(sourceDir, { recursive: true });

  return executeSourcePackRun({
    runId,
    inputRows,
    repairLedger,
    sourceDir,
    outputDir,
    runDir,
    fetchImpl,
    args: {
      delayMs: 0,
      retryDelayMs: 0,
      requestTimeoutMs: 250,
      bodyTimeoutMs: 250,
      maxResponseBytes: 1_000_000,
      limit: 0,
      offset: 0,
      maxConcurrency: 1,
      simulateCrashAfter: 0,
      ...args,
    },
  }).then((result) => ({ ...result, baseDir, outputDir, runDir, sourceDir }));
}

try {
  const jsonlPath = path.join(tempRoot, 'sample.jsonl');
  fs.writeFileSync(jsonlPath, [
    JSON.stringify({ url: 'https://example.org/a', entity_id: 'sample-a' }),
    JSON.stringify({ url: 'https://example.org/b', entity_id: 'sample-b' }),
  ].join('\n'));

  const loaded = readJsonl(jsonlPath);
  assert.equal(loaded.length, 2, 'JSONL loader should read two records');
  assert.equal(
    normalizeUrl('HTTPS://Example.org/path/#fragment'),
    'https://example.org/path',
    'normalizeUrl should normalize case and strip fragments/trailing slash',
  );

  assert.equal(
    classifyOutcome(makeRecord({ batch_class: 'portal' }), { ok: true, parserClass: 'portal', errorCode: '' }),
    'skipped_portal',
    'successful portals should be skipped_portal',
  );
  assert.equal(
    classifyOutcome(makeRecord({ batch_class: 'portal' }), { ok: false, parserClass: 'portal', errorCode: 'blocked_http_403' }),
    'blocked',
    'blocked portals should be blocked',
  );
  assert.equal(
    classifyOutcome(makeRecord({ batch_class: 'portal' }), { ok: false, parserClass: 'portal', errorCode: 'fetch_failed' }),
    'failed',
    'failed portals should be failed, not skipped_portal',
  );
  assert.equal(
    classifyOutcome(makeRecord(), { ok: true, parserClass: 'html', errorCode: 'blocked_fetch_challenge' }),
    'blocked',
    'challenge-like HTTP 200 pages should be blocked',
  );

  const discoveryCandidate = selectSameDomainDiscoveryCandidate(
    'https://county.example.org',
    '<a href="/about">About</a><a href="/ihss/apply">Apply for IHSS</a><a href="/contact">Contact us</a>',
    makeRecord({ batch_class: 'directory_root', source_role: 'county_ihss_entry_from_cdss_directory' }),
  );
  assert.equal(discoveryCandidate?.url, 'https://county.example.org/ihss/apply');
  assert.equal(
    selectSameDomainDiscoveryCandidate(
      'https://county.example.org',
      '<a href="/jobs">Apply for a Job</a><a href="/building">Building Applications</a>',
      makeRecord({ batch_class: 'directory_root', source_role: 'county_ihss_entry_from_cdss_directory' }),
    ),
    null,
    'county IHSS discovery should reject non-IHSS pages',
  );

  {
    let fetchCalls = 0;
    const record = makeRecord({ url: 'https://example.org/file.pdf', batch_class: 'pdf' });
    const { summary } = await runWithTempContext({
      inputRows: [record],
      fetchImpl: async (url) => {
        fetchCalls += 1;
        assert.equal(url, 'https://example.org/file.pdf');
        return makeResponse({
          url,
          contentType: 'text/html; charset=utf-8',
          body: '<html><head><title>HTML Wins</title></head><body><h1>HTML Wins</h1></body></html>',
        });
      },
    });
    assert.equal(fetchCalls, 1);
    assert.equal(summary.counts.byFetchStatus.fetched, 1, 'content-type html should override .pdf URL extension');
  }

  {
    const record = makeRecord({ entity_id: 'challenge-200', url: 'https://example.org/challenge' });
    const { summary } = await runWithTempContext({
      inputRows: [record],
      fetchImpl: async (url) => makeResponse({
        url,
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: '<html><body>Request unsuccessful. Incapsula incident ID.</body></html>',
      }),
    });
    assert.equal(summary.outputs.blockedCount, 1, 'Incapsula-style 200 responses should be blocked');
  }

  {
    let textCalls = 0;
    let arrayBufferCalls = 0;
    const inputRows = [
      makeRecord({ entity_id: 'docx-row', url: 'https://example.org/file.docx', batch_class: 'html' }),
      makeRecord({ entity_id: 'xlsx-row', url: 'https://example.org/file.xlsx', batch_class: 'html' }),
    ];
    await runWithTempContext({
      inputRows,
      fetchImpl: async (url) => ({
        ok: true,
        status: 200,
        url,
        headers: {
          get(name) {
            if (name.toLowerCase() === 'content-type') {
              return url.endsWith('.docx')
                ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            }
            return '';
          },
        },
        arrayBuffer: async () => {
          arrayBufferCalls += 1;
          return Buffer.from('binary-file');
        },
        text: async () => {
          textCalls += 1;
          throw new Error('binary_text_should_not_be_called');
        },
      }),
    });
    assert.equal(arrayBufferCalls, 2, 'binary files should be read as buffers');
    assert.equal(textCalls, 0, 'binary files must not be read via response.text()');
  }

  {
    const record = makeRecord({ entity_id: 'xlsx-404', url: 'https://example.org/missing.xlsx', batch_class: 'html' });
    const { summary } = await runWithTempContext({
      inputRows: [record],
      fetchImpl: async (url) => makeResponse({
        url,
        status: 404,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: Buffer.from('missing'),
      }),
    });
    assert.equal(summary.outputs.failureCount, 1, 'xlsx 404 should be a failure');
    assert.equal(summary.outputs.blockedCount, 0, 'xlsx 404 must not be misclassified as a challenge block');
  }

  {
    let fetchCalls = 0;
    const sharedUrl = 'https://county.example.org/root';
    const inputRows = [
      makeRecord({ entity_id: 'html-row', url: sharedUrl, batch_class: 'html' }),
      makeRecord({
        entity_id: 'directory-row',
        url: sharedUrl,
        batch_class: 'directory_root',
        source_role: 'county_ihss_entry_from_cdss_directory',
      }),
    ];
    const { outputDir } = await runWithTempContext({
      inputRows,
      fetchImpl: async (url) => {
        fetchCalls += 1;
        return makeResponse({
          url,
          body: '<html><head><title>County Root</title></head><body><h1>County Root</h1><a href="/ihss/apply">IHSS Apply</a></body></html>',
        });
      },
    });
    assert.equal(fetchCalls, 1, 'duplicate normalized URLs should share a cached fetch');
    const discovered = readJsonl(path.join(outputDir, 'ca_discovered_target_queue_v1.jsonl'));
    assert.equal(discovered.length, 1, 'directory_root row should still emit discovery even when fetch is cached by URL');
    assert.equal(discovered[0].url, 'https://county.example.org/ihss/apply');
  }

  {
    let fetchCalls = 0;
    const inputRows = [
      makeRecord({ entity_id: 'resume-a', url: 'https://example.org/a' }),
      makeRecord({ entity_id: 'resume-b', url: 'https://example.org/b' }),
      makeRecord({ entity_id: 'resume-c', url: 'https://example.org/c' }),
    ];
    let crashed = false;
    try {
      const crashedRun = await runWithTempContext({
        inputRows,
        runId: 'resume-run',
        args: { simulateCrashAfter: 1, limit: 3 },
        fetchImpl: async (url) => {
          fetchCalls += 1;
          return makeResponse({ url });
        },
      });
      void crashedRun;
    } catch (error) {
      crashed = String(error.message || error).includes('simulated_crash_after_checkpoint');
    }
    assert.equal(crashed, true, 'simulated crash should trigger');

    const resumeBaseDir = fs.readdirSync(tempRoot)
      .map((name) => path.join(tempRoot, name))
      .filter((candidate) => fs.statSync(candidate).isDirectory())
      .sort((left, right) => fs.statSync(right).mtimeMs - fs.statSync(left).mtimeMs)[0];
    const resumed = await executeSourcePackRun({
      runId: 'resume-run',
      inputRows,
      repairLedger: [],
      sourceDir: path.join(resumeBaseDir, 'source'),
      outputDir: path.join(resumeBaseDir, 'generated'),
      runDir: path.join(resumeBaseDir, 'runs', 'resume-run'),
      fetchImpl: async (url) => {
        fetchCalls += 1;
        return makeResponse({ url });
      },
      args: {
        delayMs: 0,
        retryDelayMs: 0,
        requestTimeoutMs: 250,
        bodyTimeoutMs: 250,
        maxResponseBytes: 1_000_000,
        limit: 3,
        offset: 0,
        maxConcurrency: 1,
        simulateCrashAfter: 0,
        resume: true,
      },
    });
    assert.equal(resumed.summary.inputs.completedInputRows, 3, 'resume should finish all queued rows');
    assert.equal(fetchCalls, 3, 'resume should not refetch the successful checkpointed row');
  }

  {
    const { runDir, outputDir } = await runWithTempContext({
      inputRows: [makeRecord({ entity_id: 'raw-row', url: 'https://example.org/raw' })],
      fetchImpl: async (url) => makeResponse({ url, body: '<html><head><title>Raw</title></head><body><h1>Raw</h1></body></html>' }),
    });
    const rawDir = path.join(runDir, 'raw');
    const rawFiles = fs.readdirSync(rawDir);
    assert.equal(rawFiles.some((name) => !name.endsWith('.json')), true, 'raw response body should be persisted');
    assert.equal(rawFiles.some((name) => name.endsWith('.json')), true, 'raw response metadata should be persisted');
    const results = readJsonl(path.join(outputDir, 'ca_scrape_results_v1.jsonl'));
    assert.match(results[0].sha256, /^[a-f0-9]{64}$/i, 'sha256 should be present on result rows');
  }

  {
    const repairLedger = readJsonl(path.join(californiaPackDir, 'ca_source_repair_ledger_v2.jsonl'));
    const officialRows = readJsonl(path.join(californiaPackDir, 'ca_official_source_pack_v2.jsonl'));
    const directoryRows = readJsonl(path.join(californiaPackDir, 'ca_directory_targets_v1.jsonl'));
    const inputRows = [...officialRows, ...directoryRows];
    const { summary, outputDir } = await runWithTempContext({
      inputRows,
      repairLedger,
      args: { limit: 0, maxConcurrency: 4, maxResponseBytes: 256_000 },
      fetchImpl: async (url) => {
        if (url.includes('secure') || url.includes('login')) {
          return makeResponse({ url, status: 403 });
        }
        if (/\.pdf(?:[?#].*)?$/i.test(url)) {
          return makeResponse({
            url,
            contentType: 'application/pdf',
            body: Buffer.from('%PDF-1.4 fake pdf body'),
          });
        }
        return makeResponse({
          url,
          body: '<html><head><title>California Target</title></head><body><h1>California Target</h1><a href="/contact">Contact</a></body></html>',
        });
      },
    });
    const results = fs.existsSync(path.join(outputDir, 'ca_scrape_results_v1.jsonl'))
      ? readJsonl(path.join(outputDir, 'ca_scrape_results_v1.jsonl'))
      : [];
    const failures = fs.existsSync(path.join(outputDir, 'ca_fetch_failures_v1.jsonl'))
      ? readJsonl(path.join(outputDir, 'ca_fetch_failures_v1.jsonl'))
      : [];
    const blocked = fs.existsSync(path.join(outputDir, 'ca_blocked_targets_v1.jsonl'))
      ? readJsonl(path.join(outputDir, 'ca_blocked_targets_v1.jsonl'))
      : [];
    assert.equal(inputRows.length, 209, 'fixture source pack should still contain 209 rows');
    assert.equal(results.length + failures.length + blocked.length, 209, 'all 209 source-pack rows should be assigned exactly once');
    assert.equal(summary.outputs.categoryTotal, 209, 'summary category total should match all input rows');
    assert.equal(summary.outputs.browserAssistedCount, 30, '30 false DHCS rows should move to the browser-assisted lane');
    const discovered = fs.existsSync(path.join(outputDir, 'ca_discovered_target_queue_v1.jsonl'))
      ? readJsonl(path.join(outputDir, 'ca_discovered_target_queue_v1.jsonl'))
      : [];
    assert.equal(discovered.every((row) => row.status === 'discovered_exact_target'), true, 'discovered rows should be emitted as queued exact targets');
    const discoveredReview = fs.existsSync(path.join(outputDir, 'ca_discovered_target_review_queue_v1.jsonl'))
      ? readJsonl(path.join(outputDir, 'ca_discovered_target_review_queue_v1.jsonl'))
      : [];
    assert.equal(discoveredReview.every((row) => row.review_status === 'human_review_required'), true, 'discovered targets should require human review');
  }

  console.log(JSON.stringify({
    ok: true,
    tested: [
      'jsonl_loading',
      'url_normalization',
      'failed_portal_classification',
      'blocked_portal_classification',
      'challenge_http_200_classification',
      'content_type_overrides_extension',
      'docx_xlsx_binary_handling',
      'xlsx_404_failed_not_challenge',
      'duplicate_url_directory_mode',
      'county_ihss_negative_discovery_filter',
      'checkpoint_resume',
      'raw_response_and_sha256',
      'all_209_rows_assigned_once',
      'discovered_targets_not_fetched_recursively',
    ],
  }, null, 2));
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
