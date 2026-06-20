import fs from 'node:fs';
import path from 'node:path';

export const repoRoot = process.cwd();
export const CHALLENGE_MARKERS = [
  'incapsula',
  'cloudflare',
  'captcha',
  'access denied',
  'request unsuccessful',
  'verify you are human',
  'verify human',
  'attention required',
  'incident id',
];

const STRONG_CHALLENGE_PATTERNS = [
  /incapsula incident id/i,
  /request unsuccessful/i,
  /attention required/i,
  /verify (?:you are )?human/i,
  /captcha/i,
  /access denied/i,
  /cloudflare/i,
];

const KNOWN_CHALLENGE_SHELL_HASHES = new Set([
  'd02032286070b4dd9d8fbd985a7bdca8af8edf52b89ff177db3bfcb2c8a9c43d',
]);

const COUNTY_IHSS_POSITIVE_PATTERNS = [
  /\bihss\b/i,
  /in-?home support(?:ive)? services?/i,
  /apply for ihss/i,
  /ihss intake/i,
  /ihss recipient/i,
  /adult services/i,
  /home care/i,
];

const COUNTY_IHSS_NEGATIVE_PATTERNS = [
  /\btax\b/i,
  /\bassessor\b/i,
  /\bbuilding\b/i,
  /\bplanning\b/i,
  /\belection\b/i,
  /\bpoll worker\b/i,
  /\bemployment\b|\bjobs?\b|\bcareers?\b/i,
  /environmental health/i,
  /\bclaims\b/i,
  /general assistance/i,
];

const REGIONAL_CENTER_ROLE_RULES = [
  { role: 'intake_application', pattern: /(intake|apply|application|assessment for ages 3 and above)/i },
  { role: 'eligibility', pattern: /\beligibility\b/i },
  { role: 'early_start_intake', pattern: /early start/i },
  { role: 'appeals_complaints', pattern: /(appeals?|complaints?|grievance|rights, advocacy)/i },
  { role: 'purchase_of_service_policies', pattern: /(purchase of service|pos policy|pos policies)/i },
  { role: 'service_standards', pattern: /(service standard|service standards)/i },
  { role: 'catchment_service_area', pattern: /(catchment|service area|counties served|areas served)/i },
  { role: 'self_determination_contacts', pattern: /self-?determination/i },
  { role: 'office_contact_directory', pattern: /(contact|office|directory|locations)/i },
];

export function readNdjson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

export function writeNdjson(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function writeCsv(filePath, rows, headers) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((header) => {
      const value = row[header] ?? '';
      const serialized = String(value).replace(/"/g, '""');
      return /[",\n]/.test(serialized) ? `"${serialized}"` : serialized;
    }).join(','));
  }
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`);
}

export function repoRelativePath(targetPath) {
  return path.relative(repoRoot, targetPath).replace(/\\/g, '/');
}

export function stripHtml(html) {
  return String(html || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstMatch(pattern, text) {
  const match = String(text || '').match(pattern);
  return match ? stripHtml(match[1] || '') : '';
}

export function extractHtmlSignals(html) {
  return {
    title: firstMatch(/<title[^>]*>([\s\S]*?)<\/title>/i, html),
    h1: firstMatch(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html),
    h2s: Array.from(String(html || '').matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)).map((match) => stripHtml(match[1] || '')).filter(Boolean).slice(0, 5),
    textSample: stripHtml(html).slice(0, 400),
  };
}

export function isChallengeText(text) {
  const lower = String(text || '').toLowerCase();
  return CHALLENGE_MARKERS.some((marker) => lower.includes(marker));
}

export function isFalseHttp200Challenge(row, html, repeatedHashCount = 0) {
  if (row.http_status !== 200 || row.parser_class !== 'html') return false;
  const signals = extractHtmlSignals(html);
  const hasMeaningfulStructure = Boolean(
    (signals.title && signals.title.length >= 5)
    || (signals.h1 && signals.h1.length >= 5)
    || (signals.h2s || []).some((item) => item.length >= 5)
  );
  const noMeaningfulContent = !hasMeaningfulStructure && signals.textSample.length < 80;
  const tinyBlankBody = Number(row.byte_count || 0) <= 400 && noMeaningfulContent;
  const suspiciousText = STRONG_CHALLENGE_PATTERNS.some((pattern) => pattern.test(String(html || '')));
  const meaningfulPage = hasMeaningfulStructure && signals.textSample.length >= 180;
  const repeatedSuspiciousHash = Number(row.byte_count || 0) <= 400 && repeatedHashCount >= 3;
  const knownChallengeShell = KNOWN_CHALLENGE_SHELL_HASHES.has(String(row.sha256 || ''));
  return knownChallengeShell || (suspiciousText && !meaningfulPage) || tinyBlankBody || repeatedSuspiciousHash;
}

export function validateCountyIhssCandidate(candidate) {
  const haystack = `${candidate.url || ''} ${candidate.candidate_text || ''}`.toLowerCase();
  const hasPositive = COUNTY_IHSS_POSITIVE_PATTERNS.some((pattern) => pattern.test(haystack));
  const hasNegative = COUNTY_IHSS_NEGATIVE_PATTERNS.some((pattern) => pattern.test(haystack));
  if (hasPositive && !hasNegative) return { decision: 'accepted', reason: 'county_ihss_strong_signal' };
  if (hasNegative && !/\bihss\b/i.test(haystack)) return { decision: 'rejected', reason: 'county_ihss_unrelated_context' };
  return { decision: 'manual_review', reason: 'county_ihss_borderline_relevance' };
}

export function extractRegionalCenterRoleCandidates(baseRecord, html) {
  const baseUrl = new URL(baseRecord.url);
  const hrefPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const candidates = [];
  let match = hrefPattern.exec(String(html || ''));
  while (match) {
    try {
      const resolved = new URL(match[1], baseUrl).toString();
      const resolvedUrl = new URL(resolved);
      if (resolvedUrl.hostname !== baseUrl.hostname) {
        match = hrefPattern.exec(String(html || ''));
        continue;
      }
      const text = stripHtml(match[2] || '');
      const haystack = `${resolved} ${text}`;
      for (const rule of REGIONAL_CENTER_ROLE_RULES) {
        if (rule.pattern.test(haystack)) {
          candidates.push({
            state: baseRecord.state,
            entity_id: `${baseRecord.entity_id}-${rule.role}`,
            source_role: `regional_center_discovered_${rule.role}`,
            authority: baseRecord.authority,
            agency: baseRecord.agency,
            status: 'discovered_exact_target',
            batch_class: 'html',
            provenance_url: baseRecord.url,
            url: resolved,
            candidate_text: text,
            discovery_role: rule.role,
          });
          break;
        }
      }
    } catch {
      // ignore malformed urls
    }
    match = hrefPattern.exec(String(html || ''));
  }
  const seen = new Set();
  return candidates.filter((candidate) => {
    const key = `${candidate.discovery_role}|${candidate.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function hasFieldLevelProvenance(record) {
  return Boolean(
    String(record.source_url || record.sourceUrl || '').trim()
    && String(record.artifact_path || '').trim()
    && String(record.source_role || record.sourceRole || '').trim()
    && String(record.supporting_text || '').trim()
    && String(record.fetched_at || '').trim()
    && String(record.content_hash || '').trim()
  );
}

export function classifyRepairLane(row, reason) {
  if (reason === 'blocked_challenge') return 'browser_assisted';
  if (row.parser_class === 'pdf' || row.parser_class === 'xlsx') return 'direct_official_download';
  if (row.http_status === 0) return 'official_alternate_page';
  return 'corrected_canonical_url';
}
