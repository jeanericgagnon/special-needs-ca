import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  classifyOutcome,
  fetchRecord,
  normalizeUrl,
  processSourcePackRecords,
  readJsonl,
  selectSameDomainDiscoveryCandidate,
} from './ca-source-pack-lightweight-lib.mjs';

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ca-source-pack-test-'));

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

  const htmlStatus = classifyOutcome(
    { batch_class: 'html' },
    { ok: true, parserUsed: 'html-basic', errorCode: '' },
  );
  assert.equal(htmlStatus, 'fetched');

  const pdfStatus = classifyOutcome(
    { batch_class: 'pdf', url: 'https://example.org/form.pdf?ver=1' },
    { ok: true, parserUsed: 'pdf-metadata-only', errorCode: '' },
  );
  assert.equal(pdfStatus, 'fetched_unparsed');

  const blockedStatus = classifyOutcome(
    { batch_class: 'html' },
    { ok: false, parserUsed: 'html-basic', errorCode: 'blocked_http_403' },
  );
  assert.equal(blockedStatus, 'blocked');

  const portalStatus = classifyOutcome(
    { batch_class: 'portal' },
    { ok: true, parserUsed: 'portal-skip', errorCode: '' },
  );
  assert.equal(portalStatus, 'skipped_portal');

  const discoveryCandidate = selectSameDomainDiscoveryCandidate(
    'https://county.example.org',
    `
      <html>
        <body>
          <a href="/about">About</a>
          <a href="/ihss/apply">Apply for IHSS</a>
          <a href="https://external.example.com/ihss">External</a>
          <a href="/contact">Contact us</a>
        </body>
      </html>
    `,
  );
  assert.equal(discoveryCandidate?.url, 'https://county.example.org/ihss/apply');

  let fetchCalls = 0;
  const fetchRows = [
    {
      state: 'CA',
      entity_id: 'dup-a',
      source_role: 'one',
      authority: 'official_state',
      agency: 'Agency',
      status: 'verified_target',
      batch_class: 'html',
      provenance_url: '',
      url: 'https://example.org/same',
    },
    {
      state: 'CA',
      entity_id: 'dup-b',
      source_role: 'two',
      authority: 'official_state',
      agency: 'Agency',
      status: 'verified_target',
      batch_class: 'html',
      provenance_url: '',
      url: 'https://EXAMPLE.org/same#frag',
    },
    {
      state: 'CA',
      entity_id: 'blocked-item',
      source_role: 'three',
      authority: 'official_state',
      agency: 'Agency',
      status: 'verified_target',
      batch_class: 'html',
      provenance_url: '',
      url: 'https://example.org/blocked',
    },
    {
      state: 'CA',
      entity_id: 'failed-item',
      source_role: 'four',
      authority: 'official_state',
      agency: 'Agency',
      status: 'verified_target',
      batch_class: 'html',
      provenance_url: '',
      url: 'https://example.org/failed',
    },
  ];

  const processed = await processSourcePackRecords(
    fetchRows,
    { delayMs: 0 },
    (row, fetchResult) => ({
      ...row,
      url: row.url,
      final_url: fetchResult.finalUrl,
      http_status: fetchResult.httpStatus,
      content_type: fetchResult.contentType,
      fetched_at: '2026-06-20T00:00:00.000Z',
      fetch_status: classifyOutcome(row, fetchResult),
      evidence_title: fetchResult.evidenceTitle || '',
      evidence_h1: fetchResult.evidenceH1 || '',
      text_sample: fetchResult.textSample || '',
      parser_used: fetchResult.parserUsed,
      error_code: fetchResult.errorCode || '',
      error_message: fetchResult.errorMessage || '',
    }),
    async (row) => {
      fetchCalls += 1;
      if (row.url.includes('/blocked')) {
        return {
          ok: false,
          finalUrl: row.url,
          httpStatus: 403,
          contentType: 'text/html',
          parserUsed: 'html-basic',
          errorCode: 'blocked_http_403',
          errorMessage: 'http_403',
        };
      }
      if (row.url.includes('/failed')) {
        return {
          ok: false,
          finalUrl: row.url,
          httpStatus: 0,
          contentType: '',
          parserUsed: 'html-basic',
          errorCode: 'fetch_failed',
          errorMessage: 'fetch failed',
        };
      }
      return {
        ok: true,
        finalUrl: row.url,
        httpStatus: 200,
        contentType: 'text/html',
        parserUsed: 'html-basic',
        errorCode: '',
        errorMessage: '',
        evidenceTitle: 'Title',
        evidenceH1: 'Heading',
        textSample: 'Sample',
      };
    },
  );

  assert.equal(processed.uniqueFetchCount, 3, 'normalized duplicate URLs should fetch once');
  assert.equal(fetchCalls, 3, 'no duplicate fetches should occur');
  assert.equal(processed.results.length, 2, 'two fetched rows should land in results');
  assert.equal(processed.blocked.length, 1, 'blocked row should route to blocked ledger');
  assert.equal(processed.failures.length, 1, 'failed row should route to failure ledger');

  let directoryFetchCalls = 0;
  await processSourcePackRecords(
    [{
      state: 'CA',
      entity_id: 'directory-root',
      source_role: 'county_ihss_entry_from_cdss_directory',
      authority: 'official_county',
      agency: 'County',
      status: 'official_directory_link',
      batch_class: 'directory_root',
      provenance_url: '',
      url: 'https://county.example.org',
    }],
    { delayMs: 0 },
    (row, fetchResult) => ({
      ...row,
      fetch_status: classifyOutcome(row, fetchResult),
      parser_used: fetchResult.parserUsed,
      url: row.url,
      final_url: fetchResult.finalUrl,
      http_status: fetchResult.httpStatus,
      content_type: fetchResult.contentType,
      fetched_at: '2026-06-20T00:00:00.000Z',
      evidence_title: fetchResult.evidenceTitle || '',
      evidence_h1: fetchResult.evidenceH1 || '',
      text_sample: fetchResult.textSample || '',
      error_code: fetchResult.errorCode || '',
      error_message: fetchResult.errorMessage || '',
    }),
    async (row) => {
      directoryFetchCalls += 1;
      if (row.url === 'https://county.example.org') {
        return {
          ok: true,
          finalUrl: row.url,
          httpStatus: 200,
          contentType: 'text/html',
          parserUsed: 'html-basic',
          errorCode: '',
          errorMessage: '',
          evidenceTitle: 'County Root',
          evidenceH1: 'County Root',
          textSample: 'Root sample',
        };
      }
      throw new Error('unexpected_deep_crawl');
    },
  );
  assert.equal(directoryFetchCalls, 1, 'record processor should not deep crawl on its own');

  const originalFetch = global.fetch;
  try {
    let callCount = 0;
    global.fetch = async (url) => {
      callCount += 1;
      if (url === 'https://county.example.org') {
        return {
          ok: true,
          status: 200,
          url,
          headers: new Map([['content-type', 'text/html; charset=utf-8']]),
          text: async () => `
            <html>
              <head><title>County Root</title></head>
              <body>
                <h1>County Root</h1>
                <a href="/ihss/apply">IHSS Apply</a>
                <a href="/contact">Contact</a>
                <a href="/eligibility">Eligibility</a>
              </body>
            </html>
          `,
          arrayBuffer: async () => new TextEncoder().encode('root').buffer,
        };
      }
      return {
        ok: true,
        status: 200,
        url,
        headers: new Map([['content-type', 'text/html; charset=utf-8']]),
        text: async () => '<html><head><title>Leaf</title></head><body><h1>Leaf</h1></body></html>',
        arrayBuffer: async () => new TextEncoder().encode('leaf').buffer,
      };
    };

    const discoveryResult = await fetchRecord({
      state: 'CA',
      entity_id: 'county-ihss-demo',
      source_role: 'county_ihss_entry_from_cdss_directory',
      authority: 'official_county',
      agency: 'County',
      status: 'official_directory_link',
      batch_class: 'directory_root',
      provenance_url: '',
      url: 'https://county.example.org',
    }, {
      delayMs: 0,
      retryDelayMs: 0,
      requestTimeoutMs: 500,
      bodyTimeoutMs: 500,
    });

    assert.equal(callCount, 2, 'directory fetch should perform at most one same-domain discovery pass');
    assert.equal(discoveryResult.discoveredLeaf?.url, 'https://county.example.org/ihss/apply');
  } finally {
    global.fetch = originalFetch;
  }

  console.log(JSON.stringify({
    ok: true,
    tested: [
      'jsonl_loading',
      'url_normalization',
      'fetch_status_classification',
      'blocked_failed_routing',
      'dedup_fetching',
      'no_deep_crawl_record_processor',
      'directory_single_leaf_probe',
    ],
  }, null, 2));
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
