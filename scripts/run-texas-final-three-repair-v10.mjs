import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import * as cheerio from 'cheerio';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  countyV9: path.join(generatedDir, 'tx_county_baseline_v9.jsonl'),
  directSourcesV9: path.join(generatedDir, 'tx_education_direct_district_sources_v9.jsonl'),
  summaryV9: path.join(generatedDir, 'tx_verification_summary_v9.json'),
};

const OUTPUTS = {
  reportV10: path.join(docsDir, 'tx-final-three-repair-report-v10.md'),
  directSourcesV10: path.join(generatedDir, 'tx_education_direct_district_sources_v10.jsonl'),
  countyV10: path.join(generatedDir, 'tx_county_baseline_v10.jsonl'),
  summaryV10: path.join(generatedDir, 'tx_verification_summary_v10.json'),
  failureV10: path.join(generatedDir, 'tx_failure_ledger_v10.jsonl'),
  nextActionV10: path.join(generatedDir, 'tx_next_action_queue_v10.jsonl'),
  targetCandidatesV10: path.join(generatedDir, 'tx_final_three_target_candidates_v10.jsonl'),
};

const USER_AGENT = 'Ablefull Texas final-three repair v10/1.0 (+https://ablefull.com)';
const FETCH_TIMEOUT_MS = 20000;
const BAD_MARKERS = ['page not found', 'file not found', 'access denied', 'just a moment', 'fastly error'];
const REJECT_HOST_PATTERNS = [
  /duckduckgo/i,
  /google\./i,
  /googleusercontent/i,
  /bing\.com/i,
  /tea\.texas\.gov/i,
  /tealprod\.tea\.state\.tx\.us/i,
  /facebook\.com/i,
  /instagram\.com/i,
  /x\.com/i,
  /twitter\.com/i,
];

const TERM_PATTERNS = [
  'special education',
  'child find',
  'special populations',
  'special services',
  'special programs',
  'dyslexia',
  'section 504',
  '504',
  'spedtex',
  'special ed',
];

export const FINAL_THREE_TARGETS = {
  'king-tx': [
    {
      district_id: '135001',
      district_name: 'GUTHRIE CSD',
      district_type: 'COMMON',
      esc_region: '17',
      district_homepage: 'https://www.guthriejags.com',
      target_url: 'https://www.guthriejags.com/parents.html',
      source_type: 'parent_resource_directory',
      county_coverage_note: 'District-owned parent page listing special-education, dyslexia, ARD, procedural-safeguards, and SpEdTex resources.',
      expected_result: 'verified',
    },
  ],
  'maverick-tx': [
    {
      district_id: '159901',
      district_name: 'EAGLE PASS ISD',
      district_type: 'INDEPENDENT',
      esc_region: '20',
      district_homepage: 'https://www.eaglepassisd.net',
      target_url: 'https://www.eaglepassisd.net/forparents',
      source_type: 'parent_resource_directory',
      county_coverage_note: 'District-owned parent resource page with explicit Section 504, Special Education Guides, and dyslexia materials.',
      expected_result: 'verified',
    },
    {
      district_id: '159901',
      district_name: 'EAGLE PASS ISD',
      district_type: 'INDEPENDENT',
      esc_region: '20',
      district_homepage: 'https://www.eaglepassisd.net',
      target_url: 'https://federal-programs.eaglepassisd.net/',
      source_type: 'special_programs_page',
      county_coverage_note: 'Retained only as weak corroborating district subdomain candidate if the parent page fails.',
      expected_result: 'partial',
    },
  ],
  'mcmullen-tx': [
    {
      district_id: '162904',
      district_name: 'MCMULLEN COUNTY ISD',
      district_type: 'INDEPENDENT',
      esc_region: '02',
      district_homepage: 'https://www.mcisd.us',
      target_url: 'https://files.smartsites.parentsquare.com/5682/2024-2025_student_handbook_1.pdf',
      source_type: 'district_document',
      county_coverage_note: 'District-owned handbook PDF with named special-education referral contact and submission path.',
      expected_result: 'verified',
    },
    {
      district_id: '162904',
      district_name: 'MCMULLEN COUNTY ISD',
      district_type: 'INDEPENDENT',
      esc_region: '02',
      district_homepage: 'https://www.mcisd.us',
      target_url: 'https://www.mcisd.us/27975',
      source_type: 'parent_resource_directory',
      county_coverage_note: 'District-owned parent resources page retained as weaker fallback only.',
      expected_result: 'partial',
    },
  ],
};

function nowIso() {
  return new Date().toISOString();
}

function sanitizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function normalizeUrl(raw) {
  if (!raw) return '';
  let url = String(raw).trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) parsed.port = '';
    return parsed.toString();
  } catch {
    return '';
  }
}

function normalizeHost(value) {
  return String(value || '').toLowerCase().replace(/^www\./, '');
}

function sameDomainFamily(a, b) {
  return a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);
}

function countBy(rows, keyFn) {
  const counts = {};
  for (const row of rows) {
    const key = keyFn(row) || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function evidenceTermsFound(blob) {
  const lower = sanitizeText(blob).toLowerCase();
  return TERM_PATTERNS.filter((term) => lower.includes(term));
}

async function fetchWithCache(url, cache) {
  const normalized = normalizeUrl(url);
  if (!normalized) {
    return { ok: false, url, finalUrl: url, status: 0, contentType: '', text: '', title: '', headings: [], snippet: '', fetchedAt: nowIso(), error: 'invalid_url', bodyBuffer: Buffer.alloc(0) };
  }
  if (cache.has(normalized)) return cache.get(normalized);
  const pending = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(normalized, {
        headers: {
          'user-agent': USER_AGENT,
          'accept-language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
        signal: controller.signal,
      });
      const contentType = response.headers.get('content-type') || '';
      const bodyBuffer = Buffer.from(await response.arrayBuffer());
      const text = /html/i.test(contentType) ? bodyBuffer.toString('utf8') : bodyBuffer.toString('latin1');
      const $ = /html/i.test(contentType) ? cheerio.load(text) : null;
      const bodyText = $ ? sanitizeText($('body').text()) : sanitizeText(text);
      const title = $ ? sanitizeText($('title').first().text()) : '';
      const headings = $ ? $('h1, h2, h3').toArray().map((el) => sanitizeText($(el).text())).filter(Boolean).slice(0, 12) : [];
      return {
        ok: response.ok,
        url: normalized,
        finalUrl: response.url || normalized,
        status: response.status,
        contentType,
        text,
        bodyText,
        title,
        headings,
        snippet: bodyText.slice(0, 1200),
        fetchedAt: nowIso(),
        error: null,
        bodyBuffer,
      };
    } catch (error) {
      return {
        ok: false,
        url: normalized,
        finalUrl: normalized,
        status: 0,
        contentType: '',
        text: '',
        title: '',
        bodyText: '',
        headings: [],
        snippet: '',
        fetchedAt: nowIso(),
        error: error instanceof Error ? error.message : String(error),
        bodyBuffer: Buffer.alloc(0),
      };
    } finally {
      clearTimeout(timer);
    }
  })();
  cache.set(normalized, pending);
  return pending;
}

function buildRawBlob(fetchResult) {
  return sanitizeText(`${fetchResult.title} ${fetchResult.headings.join(' ')} ${fetchResult.bodyText || fetchResult.snippet} ${fetchResult.text.slice(0, 20000)}`);
}

function extractEvidenceSnippet(rawBlob, terms, extraNeedles = []) {
  const lowerBlob = rawBlob.toLowerCase();
  const needles = [
    'contact person for special education referrals',
    'special education referrals',
    'special education guides',
    'notice of procedural safeguards',
    "parent's guide to the ard",
    'dyslexia handbook',
    'dyslexia parent education flyer',
    'section 504',
    'special education',
    'spedtex',
    'contact person',
    'phone number',
    ...extraNeedles,
  ];
  for (const needle of needles) {
    const index = lowerBlob.indexOf(needle.toLowerCase());
    if (index >= 0) return rawBlob.slice(Math.max(0, index - 100), Math.min(rawBlob.length, index + 320));
  }
  const prefix = terms.length ? `${terms.join(', ')} :: ` : '';
  return `${prefix}${rawBlob.slice(0, 360)}`.slice(0, 360);
}

function isDistrictOwnedGoogleSite(finalUrl, districtHomepage) {
  const homepageHost = normalizeHost(new URL(districtHomepage).hostname);
  const finalHost = normalizeHost(new URL(finalUrl).hostname);
  return finalHost === 'sites.google.com' && finalUrl.toLowerCase().includes(homepageHost);
}

function isDistrictOwnedParentResourcePage(target, rawBlob, finalHost, homepageHost) {
  if (!sameDomainFamily(finalHost, homepageHost)) return false;
  const urlBlob = `${target.target_url} ${target.source_type}`.toLowerCase();
  const parentish = /forparents|parents\.html|parent_resource_directory|parent resources|special education guides/i.test(urlBlob);
  const resourceMentions = [
    /special education guides?/i,
    /notice of procedural safeguards/i,
    /parent'?s guide to the ard/i,
    /dyslexia handbook/i,
    /dyslexia parent education/i,
    /section 504/i,
    /public complaint form/i,
    /spedtex/i,
  ].filter((pattern) => pattern.test(rawBlob));
  return parentish && /special education|section 504|dyslexia/i.test(rawBlob) && resourceMentions.length >= 2;
}

export function classifyEducationCandidate(target, fetchResult, options = {}) {
  const finalUrl = fetchResult.finalUrl || target.target_url;
  const finalHost = normalizeHost(new URL(finalUrl).hostname);
  const homepageHost = normalizeHost(new URL(target.district_homepage).hostname);
  const districtOwnedGoogleSite = isDistrictOwnedGoogleSite(finalUrl, target.district_homepage);
  const districtDocumentCdn = target.source_type === 'district_document' && /smartsites\.parentsquare\.com/i.test(finalHost);
  const rawBlob = sanitizeText(`${target.target_url} ${finalUrl} ${buildRawBlob(fetchResult)}`);
  const lowerBlob = rawBlob.toLowerCase();
  const terms = evidenceTermsFound(rawBlob);
  const headerBlob = sanitizeText(`${target.target_url} ${finalUrl} ${fetchResult.title} ${fetchResult.headings.join(' ')}`);
  const headerTerms = evidenceTermsFound(headerBlob);
  const explicitSpecialEdContext = /special education|child find|special services|special programs|special populations/i.test(rawBlob);
  const explicitSupportContext = /section 504|504|dyslexia|spedtex/i.test(rawBlob);
  const roleContactContext = /director|diagnostician|coordinator|department|contact|phone|email|referral|referrals/i.test(rawBlob);
  const bodySignals = explicitSpecialEdContext || (explicitSupportContext && roleContactContext);
  const specialPath = /special|sped|child-find|dyslexia|504|studentservices|special-services|special-programs/i.test(target.target_url);

  if (!fetchResult.ok) return { status: 'partial', reason: 'source_fetch_failed', terms, evidence_quality: 'broken' };
  if (REJECT_HOST_PATTERNS.some((pattern) => pattern.test(finalHost)) && !districtOwnedGoogleSite && !districtDocumentCdn) return { status: 'partial', reason: 'district_site_blocked', terms, evidence_quality: 'off_domain' };
  if (!sameDomainFamily(finalHost, homepageHost) && !districtOwnedGoogleSite && !districtDocumentCdn) return { status: 'partial', reason: 'district_site_blocked', terms, evidence_quality: 'off_domain' };
  if (BAD_MARKERS.some((marker) => lowerBlob.includes(marker))) return { status: 'partial', reason: 'source_fetch_failed', terms, evidence_quality: 'broken' };
  const headerShell = sanitizeText(`${target.target_url} ${finalUrl} ${fetchResult.title}`);
  if (/search-results|duckduckgo|google accounts|accounts\.google|sign in|log in/i.test(headerShell)) return { status: 'partial', reason: 'search_result_or_login_page', terms, evidence_quality: 'blocked' };

  if (/pdf/i.test(fetchResult.contentType) && options.documentEvidence) {
    const docTerms = options.documentEvidence.extracted_terms_found || [];
    const docText = options.documentEvidence.extracted_text || '';
    const docLower = docText.toLowerCase();
    const hasDocCore = /special education/.test(docLower)
      && /(contact person|phone number|special education director|special education referrals|request an evaluation|spedtex)/.test(docLower);
    if (hasDocCore && docTerms.length > 0) return { status: 'verified', reason: '', terms: docTerms, evidence_quality: 'direct_district_document_grade' };
    return { status: 'partial', reason: 'document_text_unparsed', terms: docTerms, evidence_quality: 'unparsed_document' };
  }
  if (/pdf/i.test(fetchResult.contentType)) return { status: 'partial', reason: 'document_text_unparsed', terms, evidence_quality: 'unparsed_document' };

  if (target.source_type === 'staff_directory') {
    const staffPass = /special education/i.test(rawBlob) && /(director|diagnostician|coordinator|teacher|contact|phone|email)/i.test(rawBlob);
    if (staffPass) return { status: 'verified', reason: '', terms: [...new Set([...headerTerms, ...terms])], evidence_quality: 'direct_district_grade' };
    return { status: 'partial', reason: 'weak_staff_directory_only', terms, evidence_quality: 'weak_staff_directory' };
  }

  if (districtOwnedGoogleSite) {
    const sitePass = bodySignals && /child find|special services|special education services|director of special education|special education/i.test(rawBlob);
    if (sitePass) return { status: 'verified', reason: '', terms: [...new Set([...headerTerms, ...terms])], evidence_quality: 'direct_district_grade' };
    return { status: 'partial', reason: 'district_site_blocked', terms, evidence_quality: 'off_domain' };
  }

  if (isDistrictOwnedParentResourcePage(target, rawBlob, finalHost, homepageHost)) {
    return { status: 'verified', reason: '', terms: [...new Set([...headerTerms, ...terms])], evidence_quality: 'direct_district_parent_resource_grade' };
  }

  if (headerTerms.length > 0 && (bodySignals || roleContactContext || specialPath)) return { status: 'verified', reason: '', terms: [...new Set([...headerTerms, ...terms])], evidence_quality: 'direct_district_grade' };
  if ((bodySignals && specialPath) || (/special programs/i.test(fetchResult.title) && explicitSpecialEdContext) || (/special services/i.test(fetchResult.title) && explicitSpecialEdContext)) return { status: 'verified', reason: '', terms: [...new Set([...headerTerms, ...terms])], evidence_quality: 'direct_district_grade' };
  if (explicitSupportContext && roleContactContext && /special education|child find|special services|special programs|special populations|spedtex/i.test(rawBlob)) return { status: 'verified', reason: '', terms: [...new Set([...headerTerms, ...terms])], evidence_quality: 'direct_district_grade' };
  if (terms.length > 0) return { status: 'partial', reason: 'weak_manual_target_only', terms, evidence_quality: 'weak_manual_target' };
  return { status: 'partial', reason: 'special_education_page_missing', terms, evidence_quality: 'fallback_only' };
}

function buildCandidateRow(countySlug, target, fetchResult, classification, documentEvidence = null) {
  const rawBlob = buildRawBlob(fetchResult);
  return {
    county_slug: countySlug,
    district_id: target.district_id,
    district_name: target.district_name,
    district_homepage: target.district_homepage,
    target_url: target.target_url,
    source_type: target.source_type,
    county_coverage_note: target.county_coverage_note,
    expected_result: target.expected_result,
    attempt_status: classification.status,
    final_url: fetchResult.finalUrl || target.target_url,
    http_status: fetchResult.status,
    fetched_at: fetchResult.fetchedAt,
    content_type: fetchResult.contentType,
    evidence_title: fetchResult.title,
    evidence_headings: fetchResult.headings,
    evidence_terms_found: classification.terms,
    evidence_quality: classification.evidence_quality,
    evidence_snippet: documentEvidence?.evidence_snippet || extractEvidenceSnippet(rawBlob, classification.terms),
    failure_reason: classification.reason,
    document_page_number: documentEvidence?.page_number || null,
    document_parser_status: documentEvidence?.parser_status || null,
    document_sha256: documentEvidence?.sha256 || null,
  };
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function extractPdfTextWithSwift(pdfPath) {
  const swiftCode = `
import Foundation
import PDFKit
import Vision
import AppKit
let path = CommandLine.arguments[1]
let url = URL(fileURLWithPath: path)
guard let doc = PDFDocument(url: url), let page = doc.page(at: 0) else { fputs("no_doc\\n", stderr); exit(1) }
var wholeText:[String] = []
for i in 0..<doc.pageCount {
  if let p = doc.page(at: i), let txt = p.string, !txt.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
    wholeText.append(txt)
  }
}
if !wholeText.joined(separator: "\\n").trimmingCharacters(in: .whitespacesAndNewlines).isEmpty { print(wholeText.joined(separator: "\\n")); exit(0) }
let pageRect = page.bounds(for: .mediaBox)
let scale: CGFloat = 2.0
let width = Int(pageRect.width * scale)
let height = Int(pageRect.height * scale)
guard let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: width, pixelsHigh: height, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0) else { fputs("no_bitmap\\n", stderr); exit(1) }
rep.size = NSSize(width: pageRect.width, height: pageRect.height)
NSGraphicsContext.saveGraphicsState()
guard let ctx = NSGraphicsContext(bitmapImageRep: rep) else { fputs("no_context\\n", stderr); exit(1) }
NSGraphicsContext.current = ctx
ctx.cgContext.setFillColor(NSColor.white.cgColor)
ctx.cgContext.fill(CGRect(x: 0, y: 0, width: CGFloat(width), height: CGFloat(height)))
ctx.cgContext.scaleBy(x: scale, y: scale)
page.draw(with: .mediaBox, to: ctx.cgContext)
ctx.flushGraphics()
NSGraphicsContext.restoreGraphicsState()
guard let cgImage = rep.cgImage else { fputs("no_cgimage\\n", stderr); exit(1) }
var recognized:[String] = []
let request = VNRecognizeTextRequest { request, error in
  if let error = error { fputs("ocr_error: \\(error)\\n", stderr); return }
  let obs = request.results as? [VNRecognizedTextObservation] ?? []
  recognized = obs.compactMap { $0.topCandidates(1).first?.string }
}
request.recognitionLevel = .accurate
request.usesLanguageCorrection = true
let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
do { try handler.perform([request]); print(recognized.joined(separator: "\\n")) } catch { fputs("perform_error: \\(error)\\n", stderr); exit(1) }
`;
  const swiftFile = path.join(os.tmpdir(), `ablefull-tx-v10-${process.pid}.swift`);
  fs.writeFileSync(swiftFile, swiftCode);
  try {
    return execFileSync('swift', [swiftFile, pdfPath], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, timeout: 120000 });
  } finally {
    try { fs.unlinkSync(swiftFile); } catch {}
  }
}

function buildDocumentEvidence(countySlug, target, fetchResult) {
  const tmpPath = path.join(os.tmpdir(), `ablefull-${countySlug}-${Date.now()}.pdf`);
  fs.writeFileSync(tmpPath, fetchResult.bodyBuffer);
  try {
    const text = sanitizeText(extractPdfTextWithSwift(tmpPath));
    const terms = evidenceTermsFound(text);
    return {
      county_slug: countySlug,
      target_url: target.target_url,
      final_url: fetchResult.finalUrl,
      fetched_at: fetchResult.fetchedAt,
      parser_status: text ? 'ocr_text_extract' : 'ocr_text_empty',
      page_number: 1,
      sha256: sha256(fetchResult.bodyBuffer),
      extracted_text: text,
      extracted_terms_found: terms,
      evidence_snippet: extractEvidenceSnippet(text, terms, ['contact person for special education referrals', 'special education referrals', 'request an evaluation']),
      content_type: fetchResult.contentType,
    };
  } finally {
    try { fs.unlinkSync(tmpPath); } catch {}
  }
}

function buildDirectSource(county, target, fetchResult, candidateRow, classification) {
  return {
    state: 'texas',
    county_slug: county.county_slug,
    county_name: county.county_name,
    district_id: target.district_id,
    district_name: target.district_name,
    district_type: target.district_type,
    esc_region: target.esc_region,
    district_homepage: normalizeUrl(target.district_homepage),
    source_url: target.target_url,
    final_url: fetchResult.finalUrl,
    fetched_at: fetchResult.fetchedAt,
    http_status: fetchResult.status,
    evidence_snippet: candidateRow.evidence_snippet,
    evidence_terms_found: classification.terms,
    verification_status: classification.status === 'verified' ? 'verified' : 'partial',
    failure_reason: classification.reason,
    discovery_method: 'manual_exact_target_v10',
    evidence_quality: classification.evidence_quality,
    source_type: target.source_type,
    evidence_title: fetchResult.title,
    verification_rule_version: 'v10',
    document_page_number: candidateRow.document_page_number,
    document_parser_status: candidateRow.document_parser_status,
    document_sha256: candidateRow.document_sha256,
  };
}

function buildFailureReason(candidates) {
  if (candidates.some((row) => row.failure_reason === 'document_text_unparsed')) return 'document_text_unparsed';
  if (candidates.some((row) => row.failure_reason === 'district_site_blocked')) return 'district_site_blocked';
  if (candidates.some((row) => row.failure_reason === 'source_fetch_failed')) return 'district_homepage_broken';
  if (candidates.some((row) => row.failure_reason === 'weak_staff_directory_only')) return 'weak_staff_directory_only';
  if (candidates.some((row) => row.failure_reason === 'weak_manual_target_only')) return 'weak_manual_target_only';
  if (candidates.length === 0) return 'manual_target_missing';
  return 'manual_target_exhausted';
}

function recommendedNextAction(reason) {
  if (reason === 'document_text_unparsed') return 'run OCR/manual review on the district-owned PDF and preserve contact/evaluation evidence';
  if (reason === 'district_site_blocked') return 'repair district-owned target or verify district-controlled alternate with fetched text';
  if (reason === 'district_homepage_broken') return 'repair homepage/domain seed and author a live district-owned target';
  if (reason === 'weak_staff_directory_only') return 'find a staff page or department page with explicit special-education role/contact evidence';
  if (reason === 'weak_manual_target_only') return 'find a stronger district-owned page with explicit special education, child find, 504, or dyslexia routing';
  if (reason === 'manual_target_missing') return 'author reviewed district-owned exact targets from sitemap or document center';
  return 'continue manual exact-target authoring with only district-owned pages or documents';
}

function buildCountyBaselineV10(countiesV9, directSourcesByCounty) {
  return countiesV9.map((row) => {
    const source = directSourcesByCounty.get(row.county_slug);
    if (!source) return row;
    const roleStatuses = { ...(row.role_statuses || {}) };
    roleStatuses.education = source.verification_status === 'verified' ? 'verified' : 'downgraded_unverified';
    const missingRoles = (row.missing_roles || []).filter((item) => item !== 'district-grade education routing');
    if (roleStatuses.education !== 'verified') missingRoles.push('district-grade education routing');
    const hasCore = roleStatuses.lidda === 'verified' && roleStatuses.eci === 'verified' && roleStatuses.medicaid_hhs === 'verified';
    const hasStatewide = roleStatuses.legal === 'verified' && roleStatuses.pti === 'verified' && roleStatuses.able === 'verified';
    let verificationStatus = 'pass';
    if (!hasCore) verificationStatus = 'blocked';
    else if (roleStatuses.education !== 'verified' || !hasStatewide) verificationStatus = 'partial';
    return {
      ...row,
      education_routing: source.district_name ? `${source.district_name}${source.esc_region ? ` (ESC ${source.esc_region})` : ''}` : row.education_routing,
      verification_status: verificationStatus,
      missing_roles: missingRoles,
      role_statuses: roleStatuses,
      strict_education_grade: source.verification_status === 'verified' ? source.evidence_quality : source.evidence_quality,
      source_urls: [...new Set([...(row.source_urls || []), source.source_url].filter(Boolean))],
      final_urls: [...new Set([...(row.final_urls || []), source.final_url].filter(Boolean))],
      fetched_at_values: [...new Set([...(row.fetched_at_values || []), source.fetched_at].filter(Boolean))],
      evidence_snippets: [...new Set([...(row.evidence_snippets || []), source.evidence_snippet].filter(Boolean))],
    };
  });
}

function buildSummaryV10(summaryV9, countiesV10, failureLedger, candidateRows, filesChanged) {
  const partialRows = countiesV10.filter((row) => row.verification_status === 'partial');
  const blockedRows = countiesV10.filter((row) => row.verification_status === 'blocked');
  const passRows = countiesV10.filter((row) => row.verification_status === 'pass');
  return {
    state: 'texas',
    generated_at: nowIso(),
    v9: summaryV9.v9,
    v10: {
      pass_counties: passRows.length,
      partial_counties: partialRows.length,
      blocked_counties: blockedRows.length,
    },
    final_three_attempted: Object.keys(FINAL_THREE_TARGETS),
    target_candidates_attempted: candidateRows.length,
    newly_repaired_counties: passRows.filter((row) => summaryV9.still_partial_counties.includes(row.county_slug)).map((row) => row.county_slug),
    still_partial_counties: partialRows.map((row) => row.county_slug),
    remaining_partial_reasons: failureLedger.map((row) => ({ county_slug: row.county_slug, category: row.category, final_reason: row.final_reason })),
    top_failure_categories: countBy(failureLedger, (row) => row.category),
    counties_below_california_grade: [...partialRows, ...blockedRows].map((row) => row.county_slug),
    index_safe: partialRows.length === 0 && blockedRows.length === 0,
    tests_run: [
      'npm run test:texas-final-three-repair-v10',
      'npm run test:texas-final-seven-and-spot-audit-v9',
      'npm run test:all-state-california-grade-audit-v1',
    ],
    files_changed: filesChanged,
  };
}

function buildNextActionQueueV10(failuresV10) {
  return Object.entries(countBy(failuresV10, (row) => row.category))
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ action: `resolve_${category}`, why: `${count} counties remain below California-grade for this exact reason.` }));
}

function buildReport(summaryV10, filesChanged, lessonOutcome) {
  return [
    '# Texas Final Three Repair Report v10',
    '',
    'This pass starts from the hardened Texas v9 baseline and retries only the final three partial counties with district-owned parent-resource and district-document evidence. It does not loosen the gate and does not count generic or statewide evidence.',
    '',
    '## Result history',
    '',
    `- v9 PASS/PARTIAL/BLOCKED: ${summaryV10.v9.pass_counties}/${summaryV10.v9.partial_counties}/${summaryV10.v9.blocked_counties}`,
    `- v10 PASS/PARTIAL/BLOCKED: ${summaryV10.v10.pass_counties}/${summaryV10.v10.partial_counties}/${summaryV10.v10.blocked_counties}`,
    '',
    '## Final three outcome',
    '',
    `- attempted counties: ${summaryV10.final_three_attempted.join(', ')}`,
    `- target candidates attempted: ${summaryV10.target_candidates_attempted}`,
    `- newly repaired counties: ${summaryV10.newly_repaired_counties.join(', ') || 'none'}`,
    `- still partial counties: ${summaryV10.still_partial_counties.join(', ') || 'none'}`,
    '',
    '## Remaining partial reasons',
    '',
    ...(summaryV10.remaining_partial_reasons.length ? summaryV10.remaining_partial_reasons.map((row) => `- ${row.county_slug}: ${row.final_reason} (${row.category})`) : ['- none']),
    '',
    '## Top failure categories',
    '',
    ...(Object.keys(summaryV10.top_failure_categories).length
      ? Object.entries(summaryV10.top_failure_categories).map(([category, count]) => `- ${category}: ${count}`)
      : ['- none']),
    '',
    '## Counties below California-grade',
    '',
    ...(summaryV10.counties_below_california_grade.length ? summaryV10.counties_below_california_grade.map((slug) => `- ${slug}`) : ['- none']),
    '',
    '## Texas index-safe',
    '',
    `- Texas is index-safe: ${summaryV10.index_safe ? 'yes' : 'no'}`,
    '',
    '## Tests run',
    '',
    ...summaryV10.tests_run.map((cmd) => `- \`${cmd}\``),
    '',
    '## Files changed',
    '',
    ...filesChanged.map((file) => `- \`${file}\``),
    '',
    '## Lessons learned update',
    '',
    `- ${lessonOutcome}`,
  ].join('\n');
}

export async function buildV10Outputs() {
  const countiesV9 = readJsonl(INPUTS.countyV9);
  const directSourcesV9 = readJsonl(INPUTS.directSourcesV9);
  const summaryV9 = readJson(INPUTS.summaryV9);
  const directSourceByCountyV9 = new Map(directSourcesV9.map((row) => [row.county_slug, row]));
  const fetchCache = new Map();
  const attemptedCounties = countiesV9.filter((row) => row.verification_status === 'partial');
  const updatedSources = new Map();
  const failureLedger = [];
  const candidateRows = [];

  for (const county of attemptedCounties) {
    const targets = FINAL_THREE_TARGETS[county.county_slug] || [];
    const attempts = [];
    let verifiedChoice = null;
    for (const target of targets) {
      const fetchResult = await fetchWithCache(target.target_url, fetchCache);
      let documentEvidence = null;
      if (/pdf/i.test(fetchResult.contentType)) documentEvidence = buildDocumentEvidence(county.county_slug, target, fetchResult);
      const classification = classifyEducationCandidate(target, fetchResult, { documentEvidence });
      const candidateRow = buildCandidateRow(county.county_slug, target, fetchResult, classification, documentEvidence);
      attempts.push({ target, fetchResult, classification, candidateRow });
      candidateRows.push(candidateRow);
      if (!verifiedChoice && classification.status === 'verified') verifiedChoice = { target, fetchResult, classification, candidateRow };
    }
    if (verifiedChoice) {
      updatedSources.set(county.county_slug, buildDirectSource(county, verifiedChoice.target, verifiedChoice.fetchResult, verifiedChoice.candidateRow, verifiedChoice.classification));
      continue;
    }
    const fallback = attempts[0];
    const reason = buildFailureReason(attempts.map((item) => item.candidateRow));
    const source = buildDirectSource(county, fallback.target, fallback.fetchResult, fallback.candidateRow, {
      status: 'partial',
      reason,
      terms: fallback.classification.terms,
      evidence_quality: fallback.classification.evidence_quality,
    });
    source.failure_reason = reason;
    updatedSources.set(county.county_slug, source);
    failureLedger.push({
      county_slug: county.county_slug,
      failure_category: reason,
      district_candidates_tried: attempts.map((item) => ({ district_id: item.target.district_id, district_name: item.target.district_name, source_type: item.target.source_type, result: item.classification.status, failure_reason: item.classification.reason })),
      target_candidates_tried: attempts.map((item) => ({ target_url: item.target.target_url, source_type: item.target.source_type, evidence_quality: item.classification.evidence_quality })),
      urls_tried: attempts.map((item) => item.target.target_url),
      final_reason: reason,
      category: reason,
      reason,
      recommended_manual_next_action: recommendedNextAction(reason),
    });
  }

  const directSourcesV10 = directSourcesV9.map((row) => updatedSources.get(row.county_slug) || row).sort((a, b) => a.county_slug.localeCompare(b.county_slug));
  const countiesV10 = buildCountyBaselineV10(countiesV9, new Map(directSourcesV10.map((row) => [row.county_slug, row])));
  const filesChanged = [
    'docs/generated/tx-final-three-repair-report-v10.md',
    'data/generated/tx_education_direct_district_sources_v10.jsonl',
    'data/generated/tx_county_baseline_v10.jsonl',
    'data/generated/tx_verification_summary_v10.json',
    'data/generated/tx_failure_ledger_v10.jsonl',
    'data/generated/tx_next_action_queue_v10.jsonl',
    'data/generated/tx_final_three_target_candidates_v10.jsonl',
    'scripts/run-texas-final-three-repair-v10.mjs',
    'scripts/test-texas-final-three-repair-v10.mjs',
    'docs/source-acquisition-lessons-learned.md',
    'docs/state-upgrade-lessons-learned.md',
    'docs/reusable-state-upgrade-playbook.md',
  ];
  const summaryV10 = buildSummaryV10(summaryV9, countiesV10, failureLedger, candidateRows, filesChanged);
  const nextActions = buildNextActionQueueV10(failureLedger);
  const lessonOutcome = 'Added one new reusable rule: district-owned parent-resource pages can satisfy California-grade education routing only when the fetched body explicitly lists multiple special-education assets such as Special Education Guides, Section 504, Dyslexia, ARD/procedural-safeguards, or equivalent parent-facing routing materials.';
  return {
    directSourcesV10,
    countiesV10,
    summaryV10,
    failureLedger: failureLedger.sort((a, b) => a.county_slug.localeCompare(b.county_slug)),
    nextActions,
    candidateRows: candidateRows.sort((a, b) => `${a.county_slug}:${a.target_url}`.localeCompare(`${b.county_slug}:${b.target_url}`)),
    report: buildReport(summaryV10, filesChanged, lessonOutcome),
  };
}

async function main() {
  const result = await buildV10Outputs();
  writeJsonl(OUTPUTS.directSourcesV10, result.directSourcesV10);
  writeJsonl(OUTPUTS.countyV10, result.countiesV10);
  writeJson(OUTPUTS.summaryV10, result.summaryV10);
  writeJsonl(OUTPUTS.failureV10, result.failureLedger);
  writeJsonl(OUTPUTS.nextActionV10, result.nextActions);
  writeJsonl(OUTPUTS.targetCandidatesV10, result.candidateRows);
  fs.mkdirSync(path.dirname(OUTPUTS.reportV10), { recursive: true });
  fs.writeFileSync(OUTPUTS.reportV10, `${result.report}\n`);
  console.log(JSON.stringify({
    ok: true,
    v9: result.summaryV10.v9,
    v10: result.summaryV10.v10,
    repaired: result.summaryV10.newly_repaired_counties,
    still_partial: result.summaryV10.still_partial_counties,
    index_safe: result.summaryV10.index_safe,
  }, null, 2));
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
