import assert from 'node:assert/strict';
import { fetchWithRetry } from './source-acquisition-fetch-lib.mjs';

const originalFetch = global.fetch;

function makeAbortAwareNeverEndingText(signal) {
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      const reason = signal.reason instanceof Error
        ? signal.reason
        : Object.assign(new Error('aborted'), { name: 'AbortError' });
      reject(reason);
    };
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

try {
  global.fetch = async (_url, options = {}) => ({
    ok: true,
    status: 200,
    url: 'https://example.org/success',
    headers: new Map([['content-type', 'text/html; charset=utf-8']]),
    text: async () => '<html><body>ok</body></html>',
    arrayBuffer: async () => new TextEncoder().encode('ok').buffer,
  });

  const ok = await fetchWithRetry('https://example.org/success', {
    retryCount: 0,
    requestTimeoutMs: 500,
    bodyTimeoutMs: 500,
    rateLimitMs: 1,
  });
  assert.equal(ok.ok, true);
  assert.match(String(ok.body), /ok/);

  global.fetch = async (_url, options = {}) => ({
    ok: true,
    status: 200,
    url: 'https://example.org/hang',
    headers: new Map([['content-type', 'text/html; charset=utf-8']]),
    text: () => makeAbortAwareNeverEndingText(options.signal),
    arrayBuffer: () => makeAbortAwareNeverEndingText(options.signal),
  });

  await assert.rejects(
    () => fetchWithRetry('https://example.org/hang', {
      retryCount: 0,
      requestTimeoutMs: 500,
      bodyTimeoutMs: 150,
      rateLimitMs: 1,
    }),
    (error) => {
      assert.equal(error?.name, 'TimeoutError');
      assert.equal(error?.stage, 'body_read');
      return true;
    },
  );

  console.log(JSON.stringify({
    ok: true,
    tested: ['success_response', 'body_read_timeout'],
  }, null, 2));
} finally {
  global.fetch = originalFetch;
}
