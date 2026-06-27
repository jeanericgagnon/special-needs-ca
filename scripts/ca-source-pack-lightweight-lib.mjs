import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_USER_AGENT = 'Ablefull CA source pack runner/1.0 (+https://ablefull.com)';
export const DIRECTORY_DISCOVERY_KEYWORDS = [
  'ihss',
  'intake',
  'eligibility',
  'appeal',
  'appeals',
  'contact',
  'county office',
  'county offices',
  'application',
  'apply',
  'regional center',
];

const CHALLENGE_MARKERS = [
  'captcha',
  'verify you are human',
  'attention required',
  'cloudflare',
  'request unsuccessful',
  'access denied',
  'temporarily unavailable',
  'incapsula',
  '/_incapsula_resource',
];

const STRONG_CHALLENGE_PATTERNS = [
  /incapsula incident id/i,
  /request unsuccessful/i,
  /attention required/i,
  /verify (?:you are )?human/i,
  /captcha/i,
  /access denied/i,
  /cloudflare/i,
  /temporarily unavailable/i,
];

const KNOWN_CHALLENGE_SHELL_HASHES = new Set([
  'd02032286070b4dd9d8fbd985a7bdca8af8edf52b89ff177db3bfcb2c8a9c43d',
]);

const COUNTY_IHSS_POSITIVE_PATTERNS = [
  /\bihss\b/i,
  /in-?home support(?:ive)? services?/i,
  /aging and adult services/i,
  /adult services/i,
  /disability assistance/i,
  /provider enrollment/i,
];

const COUNTY_IHSS_NEGATIVE_PATTERNS = [
  /\btax\b/i,
  /employment|careers|job(s)?/i,
  /building|safety|permit/i,
  /election|poll worker|voting/i,
  /environmental health/i,
  /assessor|assessment appeals?/i,
  /clerk[- ]recorder/i,
];

const HTML_CONTENT_TYPE_PATTERNS = [
  'text/html',
  'application/xhtml+xml',
];

const TEXTUAL_CONTENT_TYPE_PATTERNS = [
  ...HTML_CONTENT_TYPE_PATTERNS,
  'text/plain',
  'text/xml',
  'application/xml',
  'application/json',
  'text/csv',
];

function sha256Hex(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`Invalid JSONL at ${filePath}:${index + 1}: ${error.message}`);
      }
    });
}

export function normalizeUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  parsed.hash = '';
  parsed.protocol = parsed.protocol.toLowerCase();
  parsed.hostname = parsed.hostname.toLowerCase();
  if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) {
    parsed.port = '';
  }
  if (parsed.pathname !== '/' && parsed.pathname.endsWith('/')) {
    parsed.pathname = parsed.pathname.replace(/\/+$/, '');
  }
  return parsed.toString();
}

export function entityIdPrefix(entityId) {
  return String(entityId || '').split('-')[0] || 'unknown';
}

export function buildRowKey(record, inputIndex) {
  return `${inputIndex}:${record.state}:${record.entity_id}:${record.source_role}:${record.url}`;
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const content = rows.map((row) => JSON.stringify(row)).join('\n');
  fs.writeFileSync(filePath, content ? `${content}\n` : '');
}

export function appendJsonl(filePath, row) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(row)}\n`);
}

export function readNdjsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

export function readJsonIfExists(filePath, fallbackValue) {
  if (!fs.existsSync(filePath)) return fallbackValue;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function clearTimer(timer) {
  if (timer) clearTimeout(timer);
}

function getHeaderValue(headers, name) {
  if (!headers) return '';
  if (typeof headers.get === 'function') {
    return headers.get(name) || '';
  }
  if (headers instanceof Map) {
    return headers.get(name) || headers.get(name.toLowerCase()) || '';
  }
  return headers[name] || headers[name.toLowerCase()] || '';
}

function absoluteUrl(baseUrl, candidate) {
  try {
    return new URL(candidate, baseUrl).toString();
  } catch {
    return null;
  }
}

function domainFor(url) {
  return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
}

function stripTags(html) {
  return String(html || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeBasicEntities(text) {
  return String(text || '')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function firstMatch(pattern, text) {
  const match = pattern.exec(String(text || ''));
  return match ? decodeBasicEntities(stripTags(match[1])) : '';
}

function collectMatches(pattern, text, limit = 5) {
  const matches = [];
  let match = pattern.exec(String(text || ''));
  while (match && matches.length < limit) {
    matches.push(decodeBasicEntities(stripTags(match[1])));
    match = pattern.exec(String(text || ''));
  }
  return matches.filter(Boolean);
}

export function extractHtmlEvidence(html, finalUrl) {
  const title = firstMatch(/<title[^>]*>([\s\S]*?)<\/title>/i, html);
  const h1 = firstMatch(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html);
  const h2s = collectMatches(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, html, 5);
  const canonicalCandidate = firstMatch(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i, html);
  const canonicalUrl = canonicalCandidate ? absoluteUrl(finalUrl, canonicalCandidate) || canonicalCandidate : '';
  const textSample = decodeBasicEntities(stripTags(html)).slice(0, 400);
  const outboundOfficialLinks = [];
  const hrefPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match = hrefPattern.exec(String(html || ''));
  while (match && outboundOfficialLinks.length < 10) {
    const href = absoluteUrl(finalUrl, match[1]);
    const linkText = decodeBasicEntities(stripTags(match[2]));
    if (href) {
      const host = domainFor(href);
      if (/\.(gov|ca\.gov)$/i.test(host) || host.endsWith('ssa.gov')) {
        outboundOfficialLinks.push({ url: href, text: linkText });
      }
    }
    match = hrefPattern.exec(String(html || ''));
  }
  return {
    title,
    h1,
    h2s,
    canonicalUrl,
    textSample,
    outboundOfficialLinks,
  };
}

function candidateScore(url, text) {
  const haystack = `${url} ${text}`.toLowerCase();
  return DIRECTORY_DISCOVERY_KEYWORDS.reduce((score, keyword) => (
    haystack.includes(keyword) ? score + 1 : score
  ), 0);
}

function isCountyIhssDirectoryRecord(record) {
  return /county_ihss_entry_from_cdss_directory/i.test(`${record?.source_role || ''}`);
}

function scoreCandidateForRecord(record, resolved, text) {
  if (isCountyIhssDirectoryRecord(record)) {
    const haystack = `${resolved} ${text}`.toLowerCase();
    const hasPositive = COUNTY_IHSS_POSITIVE_PATTERNS.some((pattern) => pattern.test(haystack));
    const hasNegative = COUNTY_IHSS_NEGATIVE_PATTERNS.some((pattern) => pattern.test(haystack));
    if (!hasPositive || hasNegative) return 0;
    let score = 10;
    if (/apply/i.test(haystack)) score += 3;
    if (/provider/i.test(haystack)) score += 2;
    if (/contact/i.test(haystack)) score += 1;
    return score;
  }
  return candidateScore(resolved, text);
}

export function selectSameDomainDiscoveryCandidate(baseUrl, html, record = {}) {
  const baseDomain = domainFor(baseUrl);
  const candidates = [];
  const hrefPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match = hrefPattern.exec(String(html || ''));
  while (match) {
    const resolved = absoluteUrl(baseUrl, match[1]);
    const text = decodeBasicEntities(stripTags(match[2]));
    if (resolved) {
      const resolvedDomain = domainFor(resolved);
      if (resolvedDomain === baseDomain && normalizeUrl(resolved) !== normalizeUrl(baseUrl)) {
        const score = scoreCandidateForRecord(record, resolved, text);
        if (score > 0) {
          candidates.push({ url: resolved, text, score });
        }
      }
    }
    match = hrefPattern.exec(String(html || ''));
  }

  candidates.sort((left, right) => (
    right.score - left.score || left.url.localeCompare(right.url)
  ));
  return candidates[0] || null;
}

function responseHeadersSnapshot(headers) {
  return {
    etag: getHeaderValue(headers, 'etag'),
    lastModified: getHeaderValue(headers, 'last-modified'),
    contentType: getHeaderValue(headers, 'content-type'),
  };
}

function inferParserClass(batchClass, url, contentType) {
  const normalizedContentType = String(contentType || '').toLowerCase();
  if (batchClass === 'portal') return 'portal';
  if (HTML_CONTENT_TYPE_PATTERNS.some((pattern) => normalizedContentType.includes(pattern))) return 'html';
  if (normalizedContentType.includes('application/pdf')) return 'pdf';
  if (normalizedContentType.includes('wordprocessingml') || normalizedContentType.includes('msword')) return 'docx';
  if (
    normalizedContentType.includes('spreadsheetml')
    || normalizedContentType.includes('ms-excel')
    || normalizedContentType.includes('application/vnd.oasis.opendocument.spreadsheet')
  ) {
    return 'xlsx';
  }
  if (TEXTUAL_CONTENT_TYPE_PATTERNS.some((pattern) => normalizedContentType.includes(pattern))) return 'text';

  let lower = String(url).toLowerCase();
  try {
    lower = new URL(url).pathname.toLowerCase();
  } catch {
    lower = String(url).toLowerCase();
  }
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.docx') || lower.endsWith('.doc')) return 'docx';
  if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) return 'xlsx';
  return 'html';
}

function extensionForParserClass(parserClass) {
  switch (parserClass) {
    case 'pdf':
      return 'pdf';
    case 'docx':
      return 'docx';
    case 'xlsx':
      return 'xlsx';
    case 'text':
      return 'txt';
    case 'html':
      return 'html';
    default:
      return 'bin';
  }
}

function buildTimeoutError(stage, timeoutMs) {
  const error = new Error(`${stage}_timed_out_after_${timeoutMs}ms`);
  error.name = 'TimeoutError';
  error.stage = stage;
  error.timeoutMs = timeoutMs;
  return error;
}

async function readResponseBuffer(response, controller, timeoutMs, maxResponseBytes) {
  let timer = null;
  try {
    timer = setTimeout(() => {
      controller.abort(buildTimeoutError('body_read', timeoutMs));
    }, timeoutMs);

    if (response.body && typeof response.body.getReader === 'function') {
      const reader = response.body.getReader();
      const chunks = [];
      let totalBytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = Buffer.from(value);
        totalBytes += chunk.length;
        if (Number.isFinite(maxResponseBytes) && maxResponseBytes > 0 && totalBytes > maxResponseBytes) {
          throw Object.assign(new Error(`response_too_large_after_${totalBytes}_bytes`), { code: 'response_too_large' });
        }
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (Number.isFinite(maxResponseBytes) && maxResponseBytes > 0 && buffer.length > maxResponseBytes) {
      throw Object.assign(new Error(`response_too_large_after_${buffer.length}_bytes`), { code: 'response_too_large' });
    }
    return buffer;
  } finally {
    clearTimer(timer);
  }
}

function isRedirectStatus(status) {
  return [301, 302, 303, 307, 308].includes(Number(status));
}

function shouldRetryResponse(status) {
  return status === 429 || status >= 500;
}

function isChallengeLike(text) {
  const haystack = String(text || '').toLowerCase();
  return CHALLENGE_MARKERS.some((marker) => haystack.includes(marker));
}

function looksBlankOrThinHtml(text) {
  const stripped = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  return stripped.length < 80;
}

function isChallenge200Html(fetchEntry) {
  if (fetchEntry?.parserClass !== 'html') return false;
  if (Number(fetchEntry?.httpStatus || 0) !== 200) return false;
  const lowerText = String(fetchEntry?.bodyText || '').toLowerCase();
  const evidence = extractHtmlEvidence(fetchEntry?.bodyText || '', fetchEntry?.finalUrl || fetchEntry?.url || '');
  const strippedText = stripTags(fetchEntry?.bodyText || '');
  const hasMeaningfulStructure = Boolean(
    (evidence.title && evidence.title.length >= 5)
    || (evidence.h1 && evidence.h1.length >= 5)
    || (evidence.h2s || []).some((item) => item && item.length >= 5)
  );
  const hasSubstantiveText = strippedText.length >= 250 || evidence.textSample.length >= 180;
  const missingStructure = !hasMeaningfulStructure && looksBlankOrThinHtml(evidence.textSample);
  const strongChallengeMarker = STRONG_CHALLENGE_PATTERNS.some((pattern) => pattern.test(lowerText));
  const knownChallengeShell = KNOWN_CHALLENGE_SHELL_HASHES.has(String(fetchEntry?.contentHash || ''));

  if (knownChallengeShell) return true;
  if (strongChallengeMarker && !(hasMeaningfulStructure && hasSubstantiveText)) return true;
  if (missingStructure && Number(fetchEntry?.byteCount || 0) <= 512) return true;
  return false;
}

function decodeBodyToText(bodyBuffer) {
  return new TextDecoder('utf-8', { fatal: false }).decode(bodyBuffer);
}

function buildRawSavedPaths(rawDir, normalizedUrl, parserClass) {
  const urlHash = sha256Hex(normalizedUrl);
  const extension = extensionForParserClass(parserClass);
  return {
    urlHash,
    savedPath: path.join(rawDir, `${urlHash}.${extension}`),
    metadataPath: path.join(rawDir, `${urlHash}.json`),
  };
}

function saveRawFetchArtifact(rawDir, normalizedUrl, fetchEntry) {
  fs.mkdirSync(rawDir, { recursive: true });
  const { savedPath, metadataPath } = buildRawSavedPaths(rawDir, normalizedUrl, fetchEntry.parserClass);

  if (fetchEntry.bodyBuffer && fetchEntry.bodyBuffer.length) {
    fs.writeFileSync(savedPath, fetchEntry.bodyBuffer);
  }

  const metadata = {
    url: fetchEntry.url,
    normalizedUrl,
    finalUrl: fetchEntry.finalUrl,
    redirectHistory: fetchEntry.redirectHistory,
    httpStatus: fetchEntry.httpStatus,
    contentType: fetchEntry.contentType,
    etag: fetchEntry.etag,
    lastModified: fetchEntry.lastModified,
    fetchedAt: fetchEntry.fetchedAt,
    byteCount: fetchEntry.byteCount,
    sha256: fetchEntry.contentHash,
    parserClass: fetchEntry.parserClass,
    savedPath: fetchEntry.bodyBuffer && fetchEntry.bodyBuffer.length ? savedPath : '',
  };
  writeJson(metadataPath, metadata);
  return {
    savedPath: metadata.savedPath,
    metadataPath,
  };
}

function serializeCacheEntry(cacheEntry) {
  const { bodyBuffer, ...rest } = cacheEntry;
  return rest;
}

function restoreCacheEntry(cacheEntry) {
  let bodyBuffer = null;
  if (cacheEntry?.savedPath && fs.existsSync(cacheEntry.savedPath)) {
    bodyBuffer = fs.readFileSync(cacheEntry.savedPath);
  }
  return {
    ...cacheEntry,
    bodyBuffer,
  };
}

export async function fetchRawUrl(url, options = {}, fetchImpl = global.fetch) {
  const redirectHistory = [];
  const maxRedirects = Number(options.maxRedirects ?? 5);
  const requestTimeoutMs = Number(options.requestTimeoutMs ?? 20000);
  const bodyTimeoutMs = Number(options.bodyTimeoutMs ?? 20000);
  const maxResponseBytes = Number(options.maxResponseBytes ?? 5_000_000);
  let currentUrl = url;
  let lastResponse = null;

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    const controller = new AbortController();
    let timer = null;
    try {
      timer = setTimeout(() => {
        controller.abort(buildTimeoutError('request', requestTimeoutMs));
      }, requestTimeoutMs);
      const response = await fetchImpl(currentUrl, {
        headers: {
          'user-agent': DEFAULT_USER_AGENT,
          'accept-language': 'en-US,en;q=0.9',
        },
        redirect: 'manual',
        signal: controller.signal,
      });
      clearTimer(timer);

      if (isRedirectStatus(response.status)) {
        const location = getHeaderValue(response.headers, 'location');
        if (!location) {
          throw new Error(`redirect_missing_location_${response.status}`);
        }
        const resolvedLocation = absoluteUrl(currentUrl, location);
        redirectHistory.push({
          from: currentUrl,
          status: response.status,
          location,
          to: resolvedLocation || location,
        });
        currentUrl = resolvedLocation || location;
        lastResponse = response;
        continue;
      }

      const headerSnapshot = responseHeadersSnapshot(response.headers);
      const parserClass = inferParserClass(options.batchClass, currentUrl, headerSnapshot.contentType);
      const bodyBuffer = await readResponseBuffer(response, controller, bodyTimeoutMs, maxResponseBytes);
      const byteCount = bodyBuffer.length;
      return {
        ok: response.ok,
        url,
        finalUrl: response.url || currentUrl,
        redirectHistory,
        httpStatus: response.status,
        contentType: headerSnapshot.contentType,
        etag: headerSnapshot.etag,
        lastModified: headerSnapshot.lastModified,
        fetchedAt: new Date().toISOString(),
        bodyBuffer,
        byteCount,
        contentHash: sha256Hex(bodyBuffer),
        parserClass,
      };
    } catch (error) {
      clearTimer(timer);
      throw error;
    }
  }

  throw new Error(`too_many_redirects_after_${maxRedirects}`);
}

export function buildBlockedErrorCode(record, fetchEntry) {
  const status = Number(fetchEntry?.httpStatus || 0);
  const parserClass = String(fetchEntry?.parserClass || '');
  const lowerText = String(fetchEntry?.bodyText || '').toLowerCase();

  if (status === 403) {
    return 'blocked_http_403';
  }

  if (
    (record.entity_id === 'school-district-data' || parserClass === 'xlsx')
    && (fetchEntry?.errorCode === 'timeout' || isChallengeLike(lowerText) || status === 429)
  ) {
    return 'blocked_fetch_challenge';
  }

  if (isChallenge200Html(fetchEntry)) {
    return 'blocked_fetch_challenge';
  }

  if (isChallengeLike(lowerText) && (status === 401 || status === 429)) {
    return 'blocked_fetch_challenge';
  }

  return '';
}

export function buildErrorCode(record, error, parserClass = '') {
  if (error?.code === 'response_too_large') return 'response_too_large';
  if (error?.name === 'TimeoutError') {
    if (record.entity_id === 'school-district-data' || parserClass === 'xlsx') {
      return 'blocked_fetch_challenge';
    }
    return 'timeout';
  }
  if (String(error?.message || '').includes('fetch failed')) {
    return 'fetch_failed';
  }
  return 'error';
}

export async function fetchWithStatusRetry(record, options = {}, fetchImpl = global.fetch) {
  const maxAttempts = 2;
  let attempt = 0;
  let lastError = null;
  let lastResult = null;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      const result = await fetchRawUrl(record.url, {
        ...options,
        batchClass: record.batch_class,
      }, fetchImpl);
      const bodyText = (result.parserClass === 'html' || result.parserClass === 'text')
        ? decodeBodyToText(result.bodyBuffer)
        : '';
      const errorCode = buildBlockedErrorCode(record, { ...result, bodyText });
      lastResult = {
        ...result,
        bodyText,
        errorCode,
        errorMessage: errorCode ? errorCode : result.ok ? '' : `http_${result.httpStatus}`,
      };
      if (shouldRetryResponse(result.httpStatus) && attempt < maxAttempts) {
        await wait(Number(options.retryDelayMs ?? 1000));
        continue;
      }
      return lastResult;
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts && (error?.name === 'TimeoutError')) {
        await wait(Number(options.retryDelayMs ?? 1000));
        continue;
      }
    }
  }

  return {
    ok: false,
    url: record.url,
    finalUrl: record.url,
    redirectHistory: [],
    httpStatus: 0,
    contentType: '',
    etag: '',
    lastModified: '',
    fetchedAt: new Date().toISOString(),
    bodyBuffer: Buffer.alloc(0),
    bodyText: '',
    byteCount: 0,
    contentHash: '',
    parserClass: inferParserClass(record.batch_class, record.url, ''),
    errorCode: buildErrorCode(record, lastError, inferParserClass(record.batch_class, record.url, '')),
    errorMessage: lastError?.message || 'unknown_error',
  };
}

export function classifyOutcome(record, outcome) {
  if (outcome.errorCode === 'blocked_http_403' || outcome.errorCode === 'blocked_fetch_challenge') {
    return 'blocked';
  }
  if (record.batch_class === 'portal') {
    return outcome.ok ? 'skipped_portal' : 'failed';
  }
  if (outcome.ok && ['pdf', 'docx', 'xlsx'].includes(outcome.parserClass)) {
    return 'fetched_unparsed';
  }
  if (outcome.ok) {
    return 'fetched';
  }
  return 'failed';
}

function inferGapFamily(record) {
  const joined = `${record.entity_id} ${record.source_role}`.toLowerCase();
  if (joined.includes('county_ihss')) return 'medicaid_hhs_offices';
  if (record.batch_class === 'directory_root') {
    if (joined.includes('regional_center') || joined.includes('regional-center')) return 'dd_routing';
    if (joined.includes('selpa') || joined.includes('school') || joined.includes('district')) return 'education_routing';
    return 'medicaid_hhs_offices';
  }
  if (joined.includes('form') || joined.includes('_pdf') || joined.includes('catalog')) return 'forms_guides';
  if (joined.includes('waiver') || joined.includes('hcbs') || joined.includes('hcba') || joined.includes('wpcs')) return 'waivers';
  if (joined.includes('appeal') || joined.includes('complaint') || joined.includes('hearing')) return 'programs_benefits';
  if (joined.includes('special-education') || joined.includes('iep') || joined.includes('selpa') || joined.includes('school')) return 'education_routing';
  if (joined.includes('regional-center') || joined.includes('early-start') || joined.includes('dds') || joined.includes('developmental')) return 'dd_routing';
  if (joined.includes('legal') || joined.includes('court') || joined.includes('bar')) return 'advocates_legal';
  return 'general_gap_fill';
}

export function buildParseAdapterRow(record, outputRow) {
  return {
    runId: outputRow.run_id,
    stateId: 'california',
    stateCode: record.state,
    countyId: record.county_id || record.countyId || '',
    desiredProgramId: record.desired_program_id || record.desiredProgramId || '',
    gapFamily: inferGapFamily(record),
    sourceFamily: 'california_source_pack',
    sourceRole: record.source_role,
    sourceUrl: record.url,
    finalUrl: outputRow.final_url,
    provenanceUrl: record.provenance_url || outputRow.final_url || record.url,
    authority: record.authority,
    agency: record.agency,
    sourceName: `${record.agency} ${record.source_role}`.trim(),
    savedPath: outputRow.saved_path,
    artifactPath: outputRow.saved_path
      ? path.relative(process.cwd(), outputRow.saved_path).replace(/\\/g, '/')
      : '',
    batchClass: record.batch_class,
    parserClass: outputRow.parser_class,
    contentType: outputRow.content_type,
    entityId: record.entity_id,
    originalStatus: record.status,
    fetchedAt: outputRow.fetched_at,
    sha256: outputRow.sha256,
    byteCount: outputRow.byte_count,
  };
}

function isCaliforniaDhcsAgency(record) {
  return /department of health care services|dhcs/i.test(`${record.agency || ''} ${record.entity_id || ''} ${record.source_role || ''}`);
}

function isDhcsDirectParseRole(record) {
  return new Set([
    'fair_hearing_and_aid_paid_pending',
    'fee_for_service_complaint',
    'fee_for_service_appeal',
  ]).has(String(record.source_role || ''));
}

function shouldRouteToBrowserAssistedAuthoring(record, row) {
  if (!isCaliforniaDhcsAgency(record)) return false;
  if (isDhcsDirectParseRole(record)) return false;
  if (row.parser_class === 'pdf') return false;
  if (row.fetch_status === 'skipped_portal') return false;
  return ['fetched', 'fetched_unparsed', 'blocked', 'failed'].includes(row.fetch_status);
}

function buildDiscoveredTargetRow(record, candidate, outputRow) {
  return {
    state: record.state,
    entity_id: `${record.entity_id}-discovered`,
    source_role: `discovered_leaf_from_${record.source_role}`,
    url: candidate.url,
    authority: record.authority,
    agency: record.agency,
    status: 'discovered_exact_target',
    batch_class: 'html',
    provenance_url: outputRow.final_url,
    candidate_text: candidate.text,
    candidate_score: candidate.score,
    discovered_at: outputRow.fetched_at,
  };
}

export function buildRecordOutcome(record, fetchEntry) {
  const effectiveBodyText = fetchEntry.bodyText || (
    fetchEntry.bodyBuffer && (fetchEntry.parserClass === 'html' || fetchEntry.parserClass === 'text')
      ? decodeBodyToText(fetchEntry.bodyBuffer)
      : ''
  );
  const effectiveErrorCode = fetchEntry.errorCode || buildBlockedErrorCode(record, { ...fetchEntry, bodyText: effectiveBodyText });
  const fetchStatus = classifyOutcome(record, { ...fetchEntry, errorCode: effectiveErrorCode });
  const evidence = (fetchEntry.ok && fetchEntry.parserClass === 'html')
    ? extractHtmlEvidence(effectiveBodyText || '', fetchEntry.finalUrl || record.url)
    : {
      title: '',
      h1: '',
      h2s: [],
      canonicalUrl: '',
      textSample: '',
      outboundOfficialLinks: [],
    };

  const discoveredCandidate = (
    fetchEntry.ok
    && fetchEntry.parserClass === 'html'
    && record.batch_class === 'directory_root'
  )
    ? selectSameDomainDiscoveryCandidate(fetchEntry.finalUrl || record.url, effectiveBodyText || '', record)
    : null;

  return {
    finalUrl: fetchEntry.finalUrl || record.url,
    httpStatus: fetchEntry.httpStatus,
    contentType: fetchEntry.contentType || '',
    etag: fetchEntry.etag || '',
    lastModified: fetchEntry.lastModified || '',
    fetchedAt: fetchEntry.fetchedAt,
    fetchStatus,
    parserClass: fetchEntry.parserClass,
    parserUsed: fetchEntry.parserClass === 'html'
      ? 'html-basic'
      : fetchEntry.parserClass === 'portal'
        ? 'portal-skip'
        : `${fetchEntry.parserClass}-metadata-only`,
    errorCode: effectiveErrorCode || '',
    errorMessage: fetchEntry.errorMessage || '',
    evidenceTitle: evidence.title,
    evidenceH1: evidence.h1,
    evidenceH2s: evidence.h2s,
    textSample: evidence.textSample,
    canonicalUrl: evidence.canonicalUrl,
    outboundOfficialLinks: evidence.outboundOfficialLinks,
    discoveredCandidate,
    redirectHistory: fetchEntry.redirectHistory || [],
    sha256: fetchEntry.contentHash || '',
    byteCount: fetchEntry.byteCount || 0,
    savedPath: fetchEntry.savedPath || '',
    rawMetadataPath: fetchEntry.metadataPath || '',
  };
}

export function buildOutputRow(record, inputIndex, outcome) {
  const outputRow = {
    row_key: buildRowKey(record, inputIndex),
    run_id: '',
    input_index: inputIndex,
    state: record.state,
    entity_id: record.entity_id,
    source_role: record.source_role,
    authority: record.authority,
    agency: record.agency,
    original_status: record.status,
    batch_class: record.batch_class,
    county_id: record.county_id || record.countyId || '',
    desired_program_id: record.desired_program_id || record.desiredProgramId || '',
    provenance_url: record.provenance_url || '',
    url: record.url,
    final_url: outcome.finalUrl,
    http_status: outcome.httpStatus,
    content_type: outcome.contentType,
    etag: outcome.etag,
    last_modified: outcome.lastModified,
    fetched_at: outcome.fetchedAt,
    fetch_status: outcome.fetchStatus,
    evidence_title: outcome.evidenceTitle,
    evidence_h1: outcome.evidenceH1,
    evidence_h2s: outcome.evidenceH2s,
    text_sample: outcome.textSample,
    parser_used: outcome.parserUsed,
    parser_class: outcome.parserClass,
    error_code: outcome.errorCode || '',
    error_message: outcome.errorMessage || '',
    canonical_url: outcome.canonicalUrl || '',
    outbound_official_links: outcome.outboundOfficialLinks || [],
    redirect_history: outcome.redirectHistory || [],
    sha256: outcome.sha256 || '',
    byte_count: outcome.byteCount || 0,
    saved_path: outcome.savedPath || '',
    raw_metadata_path: outcome.rawMetadataPath || '',
  };
  if (outcome.discoveredCandidate) {
    outputRow.discovered_target = buildDiscoveredTargetRow(record, outcome.discoveredCandidate, outputRow);
  }
  return outputRow;
}

export function summarizeRows(rows) {
  const summary = {
    total: rows.length,
    byFetchStatus: {},
    byBatchClass: {},
    byAuthority: {},
    byEntityIdPrefix: {},
  };

  for (const row of rows) {
    summary.byFetchStatus[row.fetch_status] = (summary.byFetchStatus[row.fetch_status] || 0) + 1;
    summary.byBatchClass[row.batch_class || 'unknown'] = (summary.byBatchClass[row.batch_class || 'unknown'] || 0) + 1;
    summary.byAuthority[row.authority || 'unknown'] = (summary.byAuthority[row.authority || 'unknown'] || 0) + 1;
    const prefix = entityIdPrefix(row.entity_id);
    summary.byEntityIdPrefix[prefix] = (summary.byEntityIdPrefix[prefix] || 0) + 1;
  }

  return summary;
}

function buildOutputsFromCompleted(completedRows, repairLedger) {
  const results = completedRows.filter((row) => ['fetched', 'fetched_unparsed', 'skipped_portal'].includes(row.fetch_status));
  const failures = completedRows.filter((row) => row.fetch_status === 'failed');
  const blocked = completedRows.filter((row) => row.fetch_status === 'blocked');
  const repairTargets = repairLedger.filter((row) => row.ledger === 'repair');
  const authorFirstTargets = repairLedger.filter((row) => row.ledger === 'author_first');
  const discoveredMap = new Map();
  for (const row of completedRows) {
    if (!row.discovered_target) continue;
    const key = normalizeUrl(row.discovered_target.url);
    if (!discoveredMap.has(key)) {
      discoveredMap.set(key, row.discovered_target);
    }
  }
  const discoveredTargets = Array.from(discoveredMap.values());
  const parseAdapterCandidateRows = completedRows
    .filter((row) => (
      row.saved_path
      && (
        (row.fetch_status === 'fetched' && row.parser_class === 'html')
        || (row.fetch_status === 'fetched_unparsed' && row.parser_class === 'pdf')
      )
    ));
  const browserAssistedAuthoringRows = completedRows
    .filter((row) => shouldRouteToBrowserAssistedAuthoring({
      state: row.state,
      entity_id: row.entity_id,
      source_role: row.source_role,
      authority: row.authority,
      agency: row.agency,
      status: row.original_status,
      batch_class: row.batch_class,
      provenance_url: row.provenance_url,
      url: row.url,
    }, row))
    .map((row) => ({
      runId: row.run_id,
      state: row.state,
      entity_id: row.entity_id,
      source_role: row.source_role,
      authority: row.authority,
      agency: row.agency,
      source_url: row.url,
      final_url: row.final_url,
      saved_path: row.saved_path,
      parser_class: row.parser_class,
      gap_family: inferGapFamily({
        entity_id: row.entity_id,
        source_role: row.source_role,
        batch_class: row.batch_class,
      }),
      next_lane: 'author_browser_assisted',
      reason: 'dhcs_index_or_directory_requires_author_browser_assisted_review',
    }));
  const parseAdapterRows = parseAdapterCandidateRows
    .filter((row) => !shouldRouteToBrowserAssistedAuthoring({
      state: row.state,
      entity_id: row.entity_id,
      source_role: row.source_role,
      authority: row.authority,
      agency: row.agency,
      status: row.original_status,
      batch_class: row.batch_class,
      county_id: row.county_id,
      desired_program_id: row.desired_program_id,
      provenance_url: row.provenance_url,
      url: row.url,
    }, row))
    .map((row) => buildParseAdapterRow({
      state: row.state,
      entity_id: row.entity_id,
      source_role: row.source_role,
      authority: row.authority,
      agency: row.agency,
      status: row.original_status,
      batch_class: row.batch_class,
      county_id: row.county_id,
      desired_program_id: row.desired_program_id,
      provenance_url: row.provenance_url,
      url: row.url,
    }, row));

  return {
    results,
    failures,
    blocked,
    repairTargets,
    authorFirstTargets,
    discoveredTargets,
    browserAssistedAuthoringRows,
    parseAdapterRows,
  };
}

function writeCheckpointOutputs(runContext) {
  const completedRows = Array.from(runContext.completedMap.values()).sort((left, right) => left.input_index - right.input_index);
  const outputs = buildOutputsFromCompleted(completedRows, runContext.repairLedger);
  writeJsonl(runContext.outputPaths.resultsPath, outputs.results);
  writeJsonl(runContext.outputPaths.failuresPath, outputs.failures);
  writeJsonl(runContext.outputPaths.blockedPath, outputs.blocked);
  writeJsonl(runContext.outputPaths.repairPath, outputs.repairTargets);
  writeJsonl(runContext.outputPaths.authorFirstPath, outputs.authorFirstTargets);
  writeJsonl(runContext.outputPaths.discoveredPath, outputs.discoveredTargets);
  writeJsonl(runContext.outputPaths.discoveredReviewPath, outputs.discoveredTargets.map((row) => ({
    ...row,
    review_status: 'human_review_required',
    promotion_status: 'do_not_promote_without_review',
  })));
  writeJsonl(runContext.outputPaths.browserAssistedPath, outputs.browserAssistedAuthoringRows);
  writeJson(runContext.outputPaths.parseAdapterPath, outputs.parseAdapterRows);

  const summary = {
    generated_at: new Date().toISOString(),
    runId: runContext.runId,
    sourceDir: runContext.sourceDir,
    outputDir: runContext.outputDir,
    runDir: runContext.runDir,
    inputs: {
      totalInputRows: runContext.inputRows.length,
      completedInputRows: completedRows.length,
      remainingInputRows: runContext.inputRows.length - completedRows.length,
      currentBatchSize: runContext.currentBatchSize,
      selectedOffset: runContext.offset,
      selectedLimit: runContext.limit,
    },
    outputs: {
      resultsPath: runContext.outputPaths.resultsPath,
      failuresPath: runContext.outputPaths.failuresPath,
      blockedPath: runContext.outputPaths.blockedPath,
      repairPath: runContext.outputPaths.repairPath,
      authorFirstPath: runContext.outputPaths.authorFirstPath,
      discoveredPath: runContext.outputPaths.discoveredPath,
      discoveredReviewPath: runContext.outputPaths.discoveredReviewPath,
      browserAssistedPath: runContext.outputPaths.browserAssistedPath,
      parseAdapterPath: runContext.outputPaths.parseAdapterPath,
      summaryPath: runContext.outputPaths.summaryPath,
      resultCount: outputs.results.length,
      failureCount: outputs.failures.length,
      blockedCount: outputs.blocked.length,
      repairCount: outputs.repairTargets.length,
      authorFirstCount: outputs.authorFirstTargets.length,
      discoveredCount: outputs.discoveredTargets.length,
      browserAssistedCount: outputs.browserAssistedAuthoringRows.length,
      parseAdapterCount: outputs.parseAdapterRows.length,
      categoryTotal: outputs.results.length + outputs.failures.length + outputs.blocked.length,
      uniqueFetchCount: Object.keys(runContext.urlCache).length,
    },
    repairLedgerCounts: runContext.repairLedger.reduce((accumulator, row) => {
      accumulator[row.ledger] = (accumulator[row.ledger] || 0) + 1;
      return accumulator;
    }, {}),
    counts: summarizeRows(completedRows),
  };

  writeJson(runContext.outputPaths.summaryPath, summary);
  return summary;
}

async function getOrFetchUrlCacheEntry(record, runContext, fetchImpl) {
  const normalizedUrl = normalizeUrl(record.url);
  if (runContext.urlCache[normalizedUrl]) {
    return restoreCacheEntry(runContext.urlCache[normalizedUrl]);
  }
  if (!runContext.fetchPromiseCache.has(normalizedUrl)) {
    runContext.fetchPromiseCache.set(normalizedUrl, (async () => {
      const fetchedEntry = await fetchWithStatusRetry(record, runContext.args, fetchImpl);
      const persisted = saveRawFetchArtifact(runContext.rawDir, normalizedUrl, fetchedEntry);
      const cacheEntry = {
        ...fetchedEntry,
        savedPath: persisted.savedPath,
        metadataPath: persisted.metadataPath,
      };
      runContext.urlCache[normalizedUrl] = serializeCacheEntry(cacheEntry);
      writeJson(runContext.cachePath, runContext.urlCache);
      return cacheEntry;
    })());
  }
  return runContext.fetchPromiseCache.get(normalizedUrl);
}

async function processSingleRecord(record, inputIndex, runContext, fetchImpl) {
  const cacheEntry = await getOrFetchUrlCacheEntry(record, runContext, fetchImpl);
  const outcome = buildRecordOutcome(record, cacheEntry);
  const outputRow = buildOutputRow(record, inputIndex, outcome);
  outputRow.run_id = runContext.runId;
  runContext.completedMap.set(outputRow.row_key, outputRow);
  appendJsonl(runContext.completedPath, outputRow);
  const summary = writeCheckpointOutputs(runContext);
  if (runContext.args.simulateCrashAfter > 0 && runContext.completedMap.size >= runContext.args.simulateCrashAfter) {
    throw new Error('simulated_crash_after_checkpoint');
  }
  return { outputRow, summary };
}

export async function executeSourcePackRun({
  runId,
  inputRows,
  repairLedger,
  sourceDir,
  outputDir,
  runDir,
  args,
  fetchImpl = global.fetch,
}) {
  const rawDir = path.join(runDir, 'raw');
  const checkpointDir = path.join(runDir, 'checkpoints');
  const followupsDir = path.join(runDir, 'followups');
  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(checkpointDir, { recursive: true });
  fs.mkdirSync(followupsDir, { recursive: true });

  const completedPath = path.join(checkpointDir, 'ca-completed-rows.ndjson');
  const cachePath = path.join(checkpointDir, 'ca-url-cache.json');
  const completedRows = readNdjsonIfExists(completedPath);
  const completedMap = new Map(completedRows.map((row) => [row.row_key, row]));
  const urlCache = readJsonIfExists(cachePath, {});
  const outputPaths = {
    resultsPath: path.join(outputDir, 'ca_scrape_results_v1.jsonl'),
    failuresPath: path.join(outputDir, 'ca_fetch_failures_v1.jsonl'),
    blockedPath: path.join(outputDir, 'ca_blocked_targets_v1.jsonl'),
    repairPath: path.join(outputDir, 'ca_repair_targets_v1.jsonl'),
    authorFirstPath: path.join(outputDir, 'ca_author_first_targets_v1.jsonl'),
    discoveredPath: path.join(outputDir, 'ca_discovered_target_queue_v1.jsonl'),
    discoveredReviewPath: path.join(outputDir, 'ca_discovered_target_review_queue_v1.jsonl'),
    browserAssistedPath: path.join(followupsDir, 'author-browser-assisted.json'),
    summaryPath: path.join(outputDir, 'ca_source_completion_summary_v1.json'),
    parseAdapterPath: path.join(followupsDir, 'parse-ready-high-signal.json'),
  };

  const rowsWithIndex = inputRows.map((row, inputIndex) => ({ row, inputIndex }));
  const filtered = rowsWithIndex.filter(({ inputIndex }) => inputIndex >= args.offset);
  const pending = filtered.filter(({ row, inputIndex }) => !completedMap.has(buildRowKey(row, inputIndex)));
  const selected = args.limit > 0 ? pending.slice(0, args.limit) : pending;

  const runContext = {
    runId,
    sourceDir,
    outputDir,
    runDir,
    rawDir,
    repairLedger,
    inputRows,
    args,
    limit: args.limit,
    offset: args.offset,
    currentBatchSize: selected.length,
    completedPath,
    cachePath,
    urlCache,
    completedMap,
    fetchPromiseCache: new Map(),
    outputPaths,
  };

  writeCheckpointOutputs(runContext);

  let cursor = 0;
  const workers = new Array(Math.max(1, Number(args.maxConcurrency || 1))).fill(null).map(async () => {
    while (cursor < selected.length) {
      const currentIndex = cursor;
      cursor += 1;
      const { row, inputIndex } = selected[currentIndex];
      await processSingleRecord(row, inputIndex, runContext, fetchImpl);
      await wait(Number(args.delayMs || 0));
    }
  });

  await Promise.all(workers);

  const finalSummary = writeCheckpointOutputs(runContext);
  return {
    summary: finalSummary,
    completedCount: runContext.completedMap.size,
    selectedCount: selected.length,
  };
}
