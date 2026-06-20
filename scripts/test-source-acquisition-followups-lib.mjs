import assert from 'node:assert/strict';

const libModulePath = new URL('./source-acquisition-followups-lib.mjs', import.meta.url).pathname;
const originalSandboxNetworkDisabled = process.env.CODEX_SANDBOX_NETWORK_DISABLED;

async function loadLib(search = '') {
  return import(`${libModulePath}${search}`);
}

delete process.env.CODEX_SANDBOX_NETWORK_DISABLED;
const defaultLib = await loadLib('?default');
const dnsFailure = defaultLib.classifyFailure({
  error: 'dns_lookup_failed',
  errorCode: 'ENOTFOUND',
});
assert.deepEqual(dnsFailure, {
  bucket: 'source_repair',
  reason: 'dns_lookup_failed',
});

process.env.CODEX_SANDBOX_NETWORK_DISABLED = '1';
const sandboxLib = await loadLib('?sandbox');
const sandboxDnsFailure = sandboxLib.classifyFailure({
  error: 'dns_lookup_failed',
  errorCode: 'ENOTFOUND',
});
assert.deepEqual(sandboxDnsFailure, {
  bucket: 'blocked',
  reason: 'sandbox_network_disabled',
});

const malformedCountyDnsFailure = sandboxLib.classifyFailure({
  error: 'dns_lookup_failed',
  errorCode: 'ENOTFOUND',
  gapFamily: 'medicaid_hhs_offices',
  targetTable: 'county_offices',
  hostname: 'www.alamedacounty.ca.gov',
});
assert.deepEqual(malformedCountyDnsFailure, {
  bucket: 'source_repair',
  reason: 'malformed_county_hostname',
});
delete process.env.CODEX_SANDBOX_NETWORK_DISABLED;
if (originalSandboxNetworkDisabled !== undefined) {
  process.env.CODEX_SANDBOX_NETWORK_DISABLED = originalSandboxNetworkDisabled;
}

const timeoutFailure = defaultLib.classifyFailure({
  error: 'request_timed_out_after_3000ms',
  errorCode: 'TIMEOUT',
});
assert.deepEqual(timeoutFailure, {
  bucket: 'retryable',
  reason: 'network_timeout',
});

const forbiddenFailure = defaultLib.classifyFailure({
  status: 403,
});
assert.deepEqual(forbiddenFailure, {
  bucket: 'blocked',
  reason: 'access_blocked_403',
});

const parseReady = defaultLib.classifyParseReady({
  hostname: 'www.example.org',
  finalUrl: 'https://www.example.org/help',
  contentType: 'text/html; charset=utf-8',
});
assert.deepEqual(parseReady, {
  bucket: 'parse_ready_high_signal',
  reason: 'http_success_useful_artifact',
});

const suspectParseReady = defaultLib.classifyParseReady({
  hostname: 'sites.google.com',
  finalUrl: 'https://sites.google.com/example',
  contentType: 'text/html; charset=utf-8',
});
assert.deepEqual(suspectParseReady, {
  bucket: 'parse_ready_suspect',
  reason: 'suspect_redirect_or_platform',
});

console.log(JSON.stringify({
  ok: true,
  tested: [
    'dns_lookup_source_repair_default',
    'dns_lookup_blocked_when_sandbox_network_disabled',
    'malformed_county_hostname_source_repair_even_in_sandbox_mode',
    'network_timeout_retryable',
    'access_blocked_403',
    'parse_ready_high_signal',
    'parse_ready_suspect',
  ],
}, null, 2));
