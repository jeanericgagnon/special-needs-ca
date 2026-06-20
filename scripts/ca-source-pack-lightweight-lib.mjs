import fs from 'node:fs';
import path from 'node:path';
import { fetchWithRetry } from './source-acquisition-fetch-lib.mjs';

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

function stripTags(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeBasicEntities(text) {
  return text
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function firstMatch(pattern, text) {
  const match = pattern.exec(text);
  return match ? decodeBasicEntities(stripTags(match[1])) : '';
}

function collectMatches(pattern, text, limit = 5) {
  const matches = [];
  let match = pattern.exec(text);
  while (match && matches.length < limit) {
    matches.push(decodeBasicEntities(stripTags(match[1])));
    match = pattern.exec(text);
  }
  return matches.filter(Boolean);
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

export function extractHtmlEvidence(html, finalUrl) {
  const title = firstMatch(/<title[^>]*>([\s\S]*?)<\/title>/i, html);
  const h1 = firstMatch(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html);
  const h2s = collectMatches(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, html, 5);
  const canonicalCandidate = firstMatch(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i, html);
  const canonicalUrl = canonicalCandidate ? absoluteUrl(finalUrl, canonicalCandidate) || canonicalCandidate : '';
  const textSample = decodeBasicEntities(stripTags(html)).slice(0, 400);
  const outboundOfficialLinks = [];
  const hrefPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match = hrefPattern.exec(html);
  while (match && outboundOfficialLinks.length < 10) {
    const href = absoluteUrl(finalUrl, match[1]);
    const linkText = decodeBasicEntities(stripTags(match[2]));
    if (!href) {
      match = hrefPattern.exec(html);
      continue;
    }
    const host = domainFor(href);
    if (/\.(gov|ca\.gov)$/i.test(host) || host.endsWith('ssa.gov')) {
      outboundOfficialLinks.push({ url: href, text: linkText });
    }
    match = hrefPattern.exec(html);
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

export function selectSameDomainDiscoveryCandidate(baseUrl, html) {
  const baseDomain = domainFor(baseUrl);
  const candidates = [];
  const hrefPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match = hrefPattern.exec(html);
  while (match) {
    const resolved = absoluteUrl(baseUrl, match[1]);
    const text = decodeBasicEntities(stripTags(match[2]));
    if (resolved) {
      const resolvedDomain = domainFor(resolved);
      if (resolvedDomain === baseDomain && normalizeUrl(resolved) !== normalizeUrl(baseUrl)) {
        const score = candidateScore(resolved, text);
        if (score > 0) {
          candidates.push({ url: resolved, text, score });
        }
      }
    }
    match = hrefPattern.exec(html);
  }

  candidates.sort((left, right) => (
    right.score - left.score || left.url.localeCompare(right.url)
  ));
  return candidates[0] || null;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function classifyExtension(url) {
  let lower = String(url).toLowerCase();
  try {
    lower = new URL(url).pathname.toLowerCase();
  } catch {
    lower = String(url).toLowerCase();
  }
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.docx')) return 'docx';
  if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) return 'xlsx';
  return 'html';
}

export function classifyOutcome(record, outcome) {
  if (record.batch_class === 'portal') {
    return 'skipped_portal';
  }
  if (outcome.errorCode === 'blocked_http_403' || outcome.errorCode === 'blocked_fetch_challenge') {
    return 'blocked';
  }
  if (
    outcome.ok &&
    (
      record.batch_class === 'pdf' ||
      record.batch_class === 'docx' ||
      record.batch_class === 'xlsx' ||
      String(outcome.parserUsed || '').endsWith('-metadata-only')
    )
  ) {
    return 'fetched_unparsed';
  }
  if (outcome.ok) {
    return 'fetched';
  }
  return 'failed';
}

async function fetchOnce(url, options) {
  return fetchWithRetry(url, {
    retryCount: 1,
    requestTimeoutMs: options.requestTimeoutMs,
    bodyTimeoutMs: options.bodyTimeoutMs,
    rateLimitMs: options.retryDelayMs,
  });
}

export async function fetchWithStatusRetry(url, options = {}) {
  let attempt = 0;
  let lastResponse = null;
  while (attempt < 2) {
    attempt += 1;
    const response = await fetchOnce(url, options);
    lastResponse = response;
    if (response.status === 429 || response.status >= 500) {
      if (attempt < 2) {
        await wait(options.retryDelayMs);
        continue;
      }
    }
    return response;
  }
  return lastResponse;
}

export function buildBlockedErrorCode(record, responseOrError) {
  const status = Number(responseOrError?.status || 0);
  const url = String(record.url || '');
  if (status === 403) {
    return 'blocked_http_403';
  }
  const lowerUrl = url.toLowerCase();
  if (
    record.entity_id === 'school-district-data' ||
    lowerUrl.endsWith('.xlsx') ||
    lowerUrl.endsWith('.xls')
  ) {
    return 'blocked_fetch_challenge';
  }
  return '';
}

export function buildErrorCode(record, error) {
  if (error?.name === 'TimeoutError') {
    return buildBlockedErrorCode(record, error) || 'timeout';
  }
  if (error?.message?.includes('fetch failed')) {
    return 'fetch_failed';
  }
  return 'error';
}

export async function fetchRecord(record, options = {}) {
  const parserClass = record.batch_class === 'portal'
    ? 'portal'
    : classifyExtension(record.url);

  try {
    const response = await fetchWithStatusRetry(record.url, options);
    const errorCode = !response.ok ? buildBlockedErrorCode(record, response) : '';
    const baseResult = {
      ok: response.ok,
      finalUrl: response.finalUrl || record.url,
      httpStatus: response.status,
      contentType: response.contentType || '',
      parserUsed: parserClass === 'html' ? 'html-basic' : parserClass === 'portal' ? 'portal-skip' : `${parserClass}-metadata-only`,
      errorCode,
      errorMessage: response.ok ? '' : `http_${response.status}`,
      evidenceTitle: '',
      evidenceH1: '',
      evidenceH2s: [],
      textSample: '',
      canonicalUrl: '',
      outboundOfficialLinks: [],
      discoveredLeaf: null,
    };

    if (!response.ok) {
      return baseResult;
    }

    if (record.batch_class === 'portal') {
      return {
        ...baseResult,
        errorMessage: '',
      };
    }

    if (parserClass !== 'html') {
      return baseResult;
    }

    const evidence = extractHtmlEvidence(String(response.body || ''), response.finalUrl || record.url);
    const sameDomainCandidate = record.batch_class === 'directory_root'
      ? selectSameDomainDiscoveryCandidate(response.finalUrl || record.url, String(response.body || ''))
      : null;

    let discoveredLeaf = null;
    if (sameDomainCandidate) {
      await wait(options.delayMs);
      try {
        const leafResponse = await fetchWithStatusRetry(sameDomainCandidate.url, options);
        if (leafResponse.ok && String(leafResponse.contentType || '').includes('html')) {
          const leafEvidence = extractHtmlEvidence(String(leafResponse.body || ''), leafResponse.finalUrl || sameDomainCandidate.url);
          discoveredLeaf = {
            url: leafResponse.finalUrl || sameDomainCandidate.url,
            httpStatus: leafResponse.status,
            title: leafEvidence.title,
            h1: leafEvidence.h1,
            candidateText: sameDomainCandidate.text,
          };
        } else {
          discoveredLeaf = {
            url: leafResponse.finalUrl || sameDomainCandidate.url,
            httpStatus: leafResponse.status,
            title: '',
            h1: '',
            candidateText: sameDomainCandidate.text,
          };
        }
      } catch (error) {
        discoveredLeaf = {
          url: sameDomainCandidate.url,
          httpStatus: 0,
          title: '',
          h1: '',
          candidateText: sameDomainCandidate.text,
          errorCode: buildErrorCode(record, error),
        };
      }
    }

    return {
      ...baseResult,
      evidenceTitle: evidence.title,
      evidenceH1: evidence.h1,
      evidenceH2s: evidence.h2s,
      textSample: evidence.textSample,
      canonicalUrl: evidence.canonicalUrl,
      outboundOfficialLinks: evidence.outboundOfficialLinks,
      discoveredLeaf,
    };
  } catch (error) {
    return {
      ok: false,
      finalUrl: record.url,
      httpStatus: 0,
      contentType: '',
      parserUsed: parserClass === 'html' ? 'html-basic' : parserClass === 'portal' ? 'portal-skip' : `${parserClass}-metadata-only`,
      errorCode: buildErrorCode(record, error),
      errorMessage: error?.message || 'unknown_error',
      evidenceTitle: '',
      evidenceH1: '',
      evidenceH2s: [],
      textSample: '',
      canonicalUrl: '',
      outboundOfficialLinks: [],
      discoveredLeaf: null,
    };
  }
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

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const content = rows.map((row) => JSON.stringify(row)).join('\n');
  fs.writeFileSync(filePath, content ? `${content}\n` : '');
}

export async function processSourcePackRecords(inputRows, args, buildOutputRow, fetchRecordImpl = fetchRecord) {
  const fetchCache = new Map();
  const results = [];
  const failures = [];
  const blocked = [];

  for (const row of inputRows) {
    const normalized = normalizeUrl(row.url);
    if (!fetchCache.has(normalized)) {
      fetchCache.set(normalized, fetchRecordImpl(row, args));
    }
    const fetchResult = await fetchCache.get(normalized);
    const outputRow = buildOutputRow(row, fetchResult);

    if (outputRow.fetch_status === 'blocked') {
      blocked.push(outputRow);
    } else if (outputRow.fetch_status === 'failed') {
      failures.push(outputRow);
    } else {
      results.push(outputRow);
    }

    await new Promise((resolve) => setTimeout(resolve, args.delayMs));
  }

  return {
    results,
    failures,
    blocked,
    uniqueFetchCount: fetchCache.size,
  };
}
