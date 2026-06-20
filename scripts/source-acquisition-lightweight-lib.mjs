import fs from 'node:fs';
import path from 'node:path';

export const repoRoot = process.cwd();
export const outputRoot = path.join(repoRoot, 'data', 'source-acquisition-runs');
export const STATE_ID_TO_CODE = {
  alabama: 'AL',
  alaska: 'AK',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  florida: 'FL',
  georgia: 'GA',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new-hampshire': 'NH',
  'new-jersey': 'NJ',
  'new-mexico': 'NM',
  'new-york': 'NY',
  'north-carolina': 'NC',
  'north-dakota': 'ND',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  pennsylvania: 'PA',
  'rhode-island': 'RI',
  'south-carolina': 'SC',
  'south-dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  virginia: 'VA',
  washington: 'WA',
  'west-virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY',
  'district-of-columbia': 'DC',
};
const STATE_NAME_TO_CODE = Object.fromEntries(
  Object.entries(STATE_ID_TO_CODE).map(([stateId, code]) => [stateId.replace(/-/g, ' ').toLowerCase(), code]),
);

export function parseArgs(argv) {
  const args = {
    runId: '',
    family: 'all',
    limit: 0,
    bucket: 'parse-ready-high-signal',
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'run-id' && value) args.runId = value;
    if (flag === 'family' && value) args.family = value;
    if (flag === 'bucket' && value) args.bucket = value;
    if (flag === 'limit' && Number.isFinite(Number(value))) args.limit = Number(value);
  }

  return args;
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function writeNdjson(filePath, rows) {
  const content = rows.map((row) => JSON.stringify(row)).join('\n');
  fs.writeFileSync(filePath, `${content}${rows.length ? '\n' : ''}`);
}

export function getLatestRunId() {
  const entries = fs.readdirSync(outputRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();
  return entries[0] || '';
}

export function pickFollowupRows({ runId, bucket, family, limit }) {
  const inputPath = path.join(outputRoot, runId, 'followups', `${bucket}.json`);
  if (!fs.existsSync(inputPath)) {
    return {
      inputPath,
      rows: [],
    };
  }
  let rows = readJson(inputPath);
  if (family && family !== 'all') {
    rows = rows.filter((row) => row.gapFamily === family);
  }
  if (limit > 0) {
    rows = rows.slice(0, limit);
  }
  return {
    inputPath,
    rows,
  };
}

export function stripHtml(html) {
  return String(html || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

export function extractFirstMatch(pattern, text) {
  const match = String(text || '').match(pattern);
  return match ? match[1]?.trim() || match[0]?.trim() || '' : '';
}

export function extractAll(pattern, text, normalizer = (value) => value) {
  const results = [];
  const source = String(text || '');
  for (const match of source.matchAll(pattern)) {
    const raw = match[1] || match[0] || '';
    const normalized = normalizer(raw.trim());
    if (!normalized) continue;
    if (!results.includes(normalized)) results.push(normalized);
  }
  return results;
}

export function dedupeList(values) {
  const results = [];
  for (const value of values) {
    const normalized = String(value || '').replace(/\s+/g, ' ').trim();
    if (!normalized) continue;
    if (!results.includes(normalized)) results.push(normalized);
  }
  return results;
}

export function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return String(value || '').trim();
}

export function parseTitle(html) {
  return extractFirstMatch(/<title[^>]*>([\s\S]*?)<\/title>/i, html);
}

export function parseMetaDescription(html) {
  const doubleQuoted = extractFirstMatch(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i, html);
  if (doubleQuoted) return doubleQuoted;
  return extractFirstMatch(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["'][^>]*>/i, html);
}

export function parseCanonical(html) {
  return extractFirstMatch(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i, html);
}

export function parseHeadings(html, tagName) {
  return extractAll(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi'), html, (value) => stripHtml(value));
}

export function parseLinks(html) {
  const links = [];
  for (const match of String(html || '').matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = (match[1] || '').trim();
    const text = stripHtml(match[2] || '');
    if (!href) continue;
    links.push({ href, text });
  }
  return links;
}

export function extractMultilineAddressBlocks(text) {
  const matches = [];
  const lines = String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const cityLinePattern = /^[A-Za-z .'-]+,\s*(?:[A-Z]{2}|[A-Za-z .'-]+)(?:,\s*USA)?\s+\d{5}(?:-\d{4})?(?:\s*[•|].*)?$/;
  const suitePattern = /^(suite|ste\.?|unit|bldg|building|floor|fl\.?|room|rm\.?|#)\s*/i;

  for (let index = 0; index < lines.length - 1; index += 1) {
    const line = lines[index];
    const nextLine = lines[index + 1];
    if (!/^\d{1,6}\s+[A-Za-z0-9.#'’\- ]+$/.test(line)) continue;
    if (cityLinePattern.test(nextLine)) {
      matches.push(`${line}, ${normalizeCityLine(nextLine)}`);
      continue;
    }
    const thirdLine = lines[index + 2];
    if (suitePattern.test(nextLine) && thirdLine && cityLinePattern.test(thirdLine)) {
      matches.push(`${line}, ${nextLine}, ${normalizeCityLine(thirdLine)}`);
      continue;
    }
  }

  return dedupeList(matches);
}

function normalizeCityLine(value) {
  const cleaned = String(value || '')
    .replace(/\s*[•|].*$/, '')
    .replace(/,\s*USA\b/i, '')
    .trim();
  const fullStateMatch = cleaned.match(/^([A-Za-z .'-]+),\s*([A-Za-z .'-]+)\s+(\d{5}(?:-\d{4})?)$/);
  if (!fullStateMatch) return cleaned;
  const stateCode = STATE_NAME_TO_CODE[fullStateMatch[2].trim().toLowerCase()];
  if (!stateCode) return cleaned;
  return `${fullStateMatch[1]}, ${stateCode} ${fullStateMatch[3]}`;
}

export function extractStructuredAddressBlocks(html) {
  const results = [];
  const microformatPattern = /street-address["'][^>]*>([\s\S]*?)<[\s\S]*?locality["'][^>]*>([\s\S]*?)<[\s\S]*?region["'][^>]*>([\s\S]*?)<[\s\S]*?postal-code["'][^>]*>([\s\S]*?)</gi;

  for (const match of String(html || '').matchAll(microformatPattern)) {
    const street = stripHtml(match[1] || '').replace(/\s+/g, ' ').trim();
    const city = stripHtml(match[2] || '').replace(/\s+/g, ' ').trim();
    const region = stripHtml(match[3] || '').replace(/\s+/g, ' ').trim();
    const postal = stripHtml(match[4] || '').replace(/\s+/g, ' ').trim();
    if (street && city && region && postal) {
      results.push(`${street}, ${city}, ${region} ${postal}`.replace(/\s+,/g, ',').replace(/\s{2,}/g, ' ').trim());
    }
  }

  return dedupeList(results);
}

function normalizeMapAddressCandidate(rawValue) {
  const cleaned = String(rawValue || '')
    .replace(/&#038;/g, '&')
    .replace(/\+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/,\s*USA\b/i, '')
    .trim();

  if (/^\d{1,6}[\w.#'’\- ]+,\s*[^,]+,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?$/.test(cleaned)) {
    return cleaned.replace(/\s+,/g, ',');
  }

  const streetSuffixes = [
    'Street', 'St', 'Avenue', 'Ave', 'Road', 'Rd', 'Boulevard', 'Blvd', 'Drive', 'Dr',
    'Lane', 'Ln', 'Court', 'Ct', 'Circle', 'Cir', 'Way', 'Parkway', 'Pkwy', 'Place', 'Pl',
    'Terrace', 'Ter', 'Trail', 'Trl', 'Highway', 'Hwy',
  ];
  const suffixPattern = streetSuffixes.join('|');
  const noCommaMatch = cleaned.match(new RegExp(`^(\\d{1,6}[A-Za-z0-9.#'’\\- ]*?\\b(?:${suffixPattern}))\\s+([A-Za-z .'-]+)\\s+([A-Z]{2})\\s+(\\d{5}(?:-\\d{4})?)$`, 'i'));
  if (noCommaMatch) {
    return `${noCommaMatch[1].trim()}, ${noCommaMatch[2].trim()}, ${noCommaMatch[3].toUpperCase()} ${noCommaMatch[4]}`;
  }

  return cleaned;
}

export function extractMapQueryAddresses(html) {
  const results = [];
  const patterns = [
    /https:\/\/www\.google\.com\/maps\/search\/\?api=1(?:[^"' ]*?)query=([^"'&>]+)/gi,
    /https:\/\/www\.google\.com\/maps\/embed\/v1\/place\?[^"' ]*?\bq=([^"'&>]+)/gi,
    /https:\/\/www\.google\.com\/maps\/embed\?pb=[^"' ]*?!2s([^"'!<]+)/gi,
    /https:\/\/www\.google\.com\/maps\/place\/([^"'?&<]+)/gi,
  ];

  for (const pattern of patterns) {
    for (const match of String(html || '').matchAll(pattern)) {
      const raw = match[1] || '';
      const decoded = normalizeMapAddressCandidate(decodeURIComponent(raw));
      if (/\d{1,6}\s+.+\b[A-Z]{2}\s+\d{5}/.test(decoded)) {
        results.push(decoded.replace(/\s+,/g, ',').replace(/,\s*USA\b/i, ''));
      }
    }
  }

  return dedupeList(results);
}

function cleanProviderTitle(value) {
  return String(value || '')
    .replace(/&raquo;/gi, ' ')
    .replace(/&#8211;|&ndash;|&mdash;/gi, ' - ')
    .replace(/&#x27;|&#39;/gi, "'")
    .replace(/&#x2019;|&#8217;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function isWeakProviderHeading(value) {
  return /^(home|welcome to\b|your child|care that gets kids|built for kids|believe in better care|leading the way)/i.test(String(value || '').trim());
}

function normalizeTitleEntities(value) {
  return String(value || '')
    .replace(/&raquo;/gi, ' ')
    .replace(/&#8211;|&ndash;|&mdash;/gi, ' - ')
    .replace(/&#x27;|&#39;/gi, "'")
    .replace(/&#x2019;|&#8217;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/&#038;/gi, '&')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function listStateSignals(text) {
  const hits = [];
  const rawSource = String(text || '');
  const loweredSource = ` ${rawSource.toLowerCase()} `;
  for (const [stateId, code] of Object.entries(STATE_ID_TO_CODE)) {
    const name = stateId.replace(/-/g, ' ');
    const codePattern = new RegExp(`(^|[^A-Z])${code}([^A-Z]|$)`);
    if (loweredSource.includes(` ${name} `) || codePattern.test(rawSource)) {
      hits.push(stateId);
    }
  }
  return dedupeList(hits);
}

function extractAddressFromTitleishText(value) {
  const text = normalizeTitleEntities(value);
  const direct = text.match(/(\d{1,6}\s+[A-Za-z0-9.#'’\- ]+,\s*[A-Za-z .'-]+,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?)/);
  if (direct) return direct[1].replace(/\s+/g, ' ').trim();
  const withSuite = text.match(/(\d{1,6}\s+[A-Za-z0-9.#'’\- ]+,\s*(?:suite|ste\.?|unit|bldg|building|floor|fl\.?|room|rm\.?|#)\s*[A-Za-z0-9\-]+,\s*[A-Za-z .'-]+,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?)/i);
  return withSuite ? withSuite[1].replace(/\s+/g, ' ').trim() : '';
}

const ADVOCATE_GOOD_PATTERNS = [
  /\bspecial education\b/i,
  /\beducation lawyer\b/i,
  /\beducation law\b/i,
  /\bspecial needs\b/i,
  /\bdisability rights?\b/i,
  /\bdisabilities\b/i,
  /\biep\b/i,
  /\b504\b/i,
  /\badvocat(?:e|es|ing|cy)\b/i,
  /\bguardianship\b/i,
  /\bautism\b/i,
  /\bdevelopmental disab/i,
  /\bdown syndrome\b/i,
  /\btransition services\b/i,
  /\beducational consultant/i,
];

const ADVOCATE_BAD_PATTERNS = [
  /\bigaming\b/i,
  /\bcasino\b/i,
  /\bbetting\b/i,
  /\bslot\b/i,
  /\bpoker\b/i,
  /\btogel\b/i,
  /\bjudol\b/i,
  /\bcrypto\b/i,
  /\bseo\b/i,
  /\bmarketing\b/i,
  /\bwordpress\b/i,
  /\bdefault parallels plesk panel\b/i,
  /\bweb server's default page\b/i,
  /\bdivorce\b/i,
  /\bbankruptcy\b/i,
  /\breal estate\b/i,
  /\basset managers?\b/i,
  /\bcredit union\b/i,
  /\bmortgage\b/i,
  /\bstudent loans?\b/i,
  /\bcar accident\b/i,
  /\bpersonal injury\b/i,
  /\bmed spa\b/i,
  /\bdentist\b/i,
  /\bplumbing\b/i,
  /\broofing\b/i,
  /\bhvac\b/i,
  /\bnews indonesia\b/i,
];

const ADVOCATE_MULTI_STATE_MARKERS = [
  /\bnationwide\b/i,
  /\bnational\b/i,
  /\bserving families across\b/i,
  /\bsurrounding states\b/i,
  /\bmulti-state\b/i,
];

function hasAdvocateGoodSignal(text) {
  return ADVOCATE_GOOD_PATTERNS.some((pattern) => pattern.test(text));
}

function hasAdvocateBadSignal(text) {
  return ADVOCATE_BAD_PATTERNS.some((pattern) => pattern.test(text));
}

function hasExplicitMultiStateMarker(text) {
  return ADVOCATE_MULTI_STATE_MARKERS.some((pattern) => pattern.test(text));
}

function hostFromUrl(rawUrl) {
  try {
    return new URL(rawUrl).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function resolveUrl(baseUrl, rawUrl) {
  if (!rawUrl) return '';
  try {
    return new URL(rawUrl, baseUrl).toString();
  } catch {
    return rawUrl;
  }
}

function isOfficialLikeUrl(rawUrl) {
  const host = hostFromUrl(rawUrl);
  return Boolean(host) && (host.endsWith('.gov') || host.endsWith('.us') || host.endsWith('.edu'));
}

function isTrustedKnowledgeUrl(rawUrl) {
  const host = hostFromUrl(rawUrl);
  if (!host) return false;
  if (isOfficialLikeUrl(rawUrl)) return true;
  return [
    'parentcenterhub.org',
    'undivided.io',
    'understood.org',
    'autismsociety.org',
    'easterseals.com',
    'disabilityrightsca.org',
    'disabilityrightsflorida.org',
    'disabilityrightstx.org',
  ].some((trusted) => host === trusted || host.endsWith(`.${trusted}`));
}

function looksLikeBlockedOrErrorPage(...values) {
  const text = values
    .flat()
    .filter(Boolean)
    .join(' | ')
    .toLowerCase();
  if (!text) return false;
  return [
    'access denied',
    'page not found',
    '404 not found',
    '403 forbidden',
    'forbidden',
    'request blocked',
    'you don\'t have permission',
    'you do not have permission',
    'error reference',
  ].some((marker) => text.includes(marker));
}

function pickActionLinks(common, matcher) {
  return common.links
    .map((link) => ({
      href: resolveUrl(common.finalUrl || common.sourceUrl, link.href),
      text: link.text,
    }))
    .filter((link) => /^https?:|^tel:|^mailto:/i.test(link.href))
    .filter((link) => matcher(link))
    .slice(0, 10);
}

function pickFallbackName(common) {
  return common.h1s.find((heading) => heading && !/^(contact us|find a chapter|menu|home)$/i.test(heading))
    || common.pageTitle.replace(/\s+\|\s+.*$/i, '').replace(/\s*-\s*The Arc\s*$/i, '').trim()
    || common.sourceName
    || '';
}

function extractForms(common) {
  const officialDownloadUrl = common.links
    .map((link) => resolveUrl(common.finalUrl || common.sourceUrl, link.href))
    .find((href) => /\.(pdf|docx?|rtf)(?:[?#].*)?$/i.test(href))
    || '';
  const guideLinks = pickActionLinks(common, (link) =>
    /form|apply|application|guide|packet|checklist|appeal|download|eligibility/i.test(link.text)
    || /\.(pdf|docx?|rtf)(?:[?#].*)?$/i.test(link.href)
  );
  const programName = common.h1s[0] || common.pageTitle || common.sourceName || '';
  return {
    recordType: 'forms_guide_page',
    programName,
    officialDownloadUrl: officialDownloadUrl || common.finalUrl || common.sourceUrl,
    guideLinks,
    publicContactSignalCount: [officialDownloadUrl, common.phones[0], common.emails[0]].filter(Boolean).length,
  };
}

function extractHelpResource(common, helpType) {
  const actionLinks = pickActionLinks(common, (link) =>
    /apply|contact|get help|request|services|program|housing|legal|employment|job|vocational|food|transport|respite|support/i.test(link.text)
  );
  return {
    recordType: `${helpType}_resource_page`,
    organizationName: pickFallbackName(common),
    contactPhone: common.phones[0] || '',
    contactEmail: common.emails[0] || '',
    contactAddress: common.addressLines[0] || '',
    actionLinks,
    serviceSummary: common.paragraphs.slice(0, 6).join(' '),
    publicContactSignalCount: [common.phones[0], common.emails[0], common.addressLines[0]].filter(Boolean).length,
  };
}

function extractKnowledgeContent(common) {
  const topicLinks = pickActionLinks(common, (link) =>
    /apply|appeal|rights|services|support|waiver|iep|504|transition|respite|diagnosis/i.test(link.text)
  );
  return {
    recordType: 'knowledge_content_page',
    articleTitle: common.h1s[0] || common.pageTitle || common.sourceName || '',
    canonicalKnowledgeUrl: common.canonicalUrl || common.finalUrl || common.sourceUrl,
    contentCategory: common.gapFamily,
    topicLinks,
    summaryText: common.paragraphs.slice(0, 8).join(' '),
  };
}

function pickProviderName(common) {
  const title = cleanProviderTitle(common.pageTitle || common.sourceName || '');
  const titleSegments = title
    .split(/\s+\|\s+|\s+-\s+|»/)
    .map((segment) => segment.trim())
    .filter(Boolean);
  const orgCue = /(hospital|children|childrens|children's|health|healthcare|autism|center|centre|clinic|medical|medicine|card|pediatrics|multidisciplinary|nemours|musc|lebonheur|hasbro|golisano|lurie|st\.?\s*luke|unm|fau|kapiolani)/i;
  const meaningfulTitleSegment = titleSegments.find((segment) => orgCue.test(segment) && !isWeakProviderHeading(segment))
    || titleSegments.find((segment) => !isWeakProviderHeading(segment))
    || title;
  const heading = common.h1s.find((item) => item && !/^(home|menu)$/i.test(item));
  if (heading && !isWeakProviderHeading(heading) && orgCue.test(heading)) {
    return heading;
  }
  return meaningfulTitleSegment || heading || common.sourceName || '';
}

function pickAdvocateName(common) {
  const title = normalizeTitleEntities(common.pageTitle || common.sourceName || '');
  const titleSegments = title
    .split(/\s+\|\s+|\s+-\s+|»/)
    .map((segment) => segment.trim())
    .filter(Boolean);
  const heading = common.h1s.find((item) => item && !/^(home|menu|welcome)$/i.test(item.trim()));
  const titleCandidate = titleSegments.find((segment) => hasAdvocateGoodSignal(segment))
    || titleSegments.find((segment) => !hasAdvocateBadSignal(segment) && segment.length > 5)
    || title;
  if (heading && hasAdvocateGoodSignal(heading)) return heading;
  if (titleCandidate) return titleCandidate;
  return heading || common.sourceName || '';
}

function inferAdvocateStateId(common) {
  const signalText = [
    common.pageTitle,
    common.metaDescription,
    common.textSample,
    common.addressLines.join(' | '),
  ].join(' | ');
  const stateHits = listStateSignals(signalText);
  if (stateHits.length !== 1) return common.stateId;
  if (hasExplicitMultiStateMarker(signalText)) return common.stateId;
  return stateHits[0];
}

export function extractAdvocates(common) {
  const titleAddress = extractAddressFromTitleishText(`${common.pageTitle} | ${common.metaDescription}`);
  const inferredStateId = inferAdvocateStateId(common);
  return {
    recordType: 'advocate_page',
    organizationName: pickAdvocateName(common),
    contactPhone: common.phones[0] || '',
    contactEmail: common.emails[0] || '',
    contactAddress: common.addressLines[0] || titleAddress || '',
    inferredStateId,
    publicContactSignalCount: [common.phones[0], common.emails[0], common.addressLines[0] || titleAddress].filter(Boolean).length,
  };
}

export function parseCommonExtraction({ row, html }) {
  const text = stripHtml(html);
  const title = parseTitle(html);
  const h1s = parseHeadings(html, 'h1');
  const h2s = parseHeadings(html, 'h2');
  const phones = extractAll(/(?:Phone:\s*)?(\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4})/g, text, normalizePhone);
  const emails = extractAll(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi, text, (value) => value.toLowerCase());
  const links = parseLinks(html);
  const addressLines = extractAll(
    /(\d{1,6}\s+[A-Za-z0-9.#'’\- ]+,\s*[A-Za-z .'-]+,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?)/g,
    text,
    (value) => value.replace(/\s+/g, ' ').trim(),
  );
  const multilineAddresses = extractMultilineAddressBlocks(text);
  const structuredAddresses = extractStructuredAddressBlocks(html);
  const mapAddresses = extractMapQueryAddresses(html);
  const paragraphs = text.split('\n').map((line) => line.trim()).filter(Boolean);
  return {
    sourceUrl: row.sourceUrl,
    finalUrl: row.finalUrl || row.sourceUrl,
    stateId: row.stateId,
    gapFamily: row.gapFamily,
    targetTable: row.targetTable,
    sourceQueue: row.sourceQueue,
    sourceName: row.sourceName || '',
    savedPath: row.savedPath,
    contentType: row.contentType,
    pageTitle: title,
    metaDescription: parseMetaDescription(html),
    canonicalUrl: parseCanonical(html) || row.finalUrl || row.sourceUrl,
    h1s,
    h2s,
    phones,
    emails,
    addressLines: dedupeList([...addressLines, ...multilineAddresses, ...structuredAddresses, ...mapAddresses]),
    links: links.slice(0, 100),
    paragraphs: paragraphs.slice(0, 80),
    textSample: paragraphs.slice(0, 12).join('\n'),
  };
}

export function extractTheArcChapter(common) {
  const preferredHeading = common.h1s.find((heading) => heading && !/^(find a chapter|your vote has power)$/i.test(heading));
  const organizationName = preferredHeading
    || common.pageTitle.replace(/\s*-\s*The Arc\s*$/i, '').trim()
    || common.sourceName
    || '';
  const contactIndex = common.paragraphs.findIndex((line) => /^contact$/i.test(line) || /^contact us$/i.test(line));
  const windowLines = contactIndex >= 0
    ? common.paragraphs.slice(contactIndex, contactIndex + 8)
    : common.paragraphs.slice(0, 20);
  const address = windowLines.find((line) => /\d{1,6}\s+.+,\s*[A-Z]{2}\s+\d{5}/.test(line)) || common.addressLines[0] || '';
  const phone = common.phones[0] || '';
  const email = common.emails[0] || '';
  const chapterWebsite = common.links.find((link) => /visit website/i.test(link.text) && /^https?:\/\//i.test(link.href))?.href
    || common.links.find((link) => /^https?:\/\//i.test(link.href) && !/thearc\.org/i.test(link.href) && !/bonfire\.com|facebook\.com|linkedin\.com|instagram\.com|youtube\.com/i.test(link.href))?.href
    || '';
  return {
    recordType: 'nonprofit_contact_page',
    organizationName,
    contactAddress: address,
    contactPhone: phone,
    contactEmail: email,
    organizationWebsite: chapterWebsite,
    publicContactSignalCount: [address, phone, email, chapterWebsite].filter(Boolean).length,
  };
}

export function extractDdRouting(common) {
  const officeName = common.h1s[0] || common.pageTitle || common.sourceName || '';
  const contactEmail = common.emails[0] || '';
  const contactPhone = common.phones[0] || '';
  const contactAddress = common.addressLines[0] || '';
  const serviceParagraphs = common.paragraphs.filter((line) => /(eligib|service|supports coordination|administrative entity|autism|developmental disabilities)/i.test(line)).slice(0, 8);
  return {
    recordType: 'dd_routing_page',
    officeName,
    contactPhone,
    contactEmail,
    contactAddress,
    serviceSummary: serviceParagraphs.join(' '),
    publicContactSignalCount: [contactPhone, contactEmail, contactAddress].filter(Boolean).length,
  };
}

export function extractCountyOffice(common) {
  const officeName = common.h1s[0] || common.pageTitle || common.sourceName || '';
  const contactEmail = common.emails[0] || '';
  const contactPhone = common.phones[0] || '';
  const contactAddress = common.addressLines[0] || '';
  return {
    recordType: 'county_office_page',
    officeName,
    contactPhone,
    contactEmail,
    contactAddress,
    publicContactSignalCount: [contactPhone, contactEmail, contactAddress].filter(Boolean).length,
  };
}

export function extractPrograms(common) {
  const programName = common.h1s[0] || common.pageTitle || common.sourceName || '';
  const callLines = common.links.filter((link) => /^tel:/i.test(link.href)).map((link) => ({
    href: link.href,
    text: link.text,
  }));
  return {
    recordType: 'program_information_page',
    programName,
    contactPhone: common.phones[0] || '',
    contactEmail: common.emails[0] || '',
    callToActionLinks: callLines.slice(0, 10),
    outboundLinkCount: common.links.length,
  };
}

export function extractProviders(common) {
  return {
    recordType: 'provider_page',
    organizationName: pickProviderName(common),
    contactPhone: common.phones[0] || '',
    contactEmail: common.emails[0] || '',
    contactAddress: common.addressLines[0] || '',
    publicContactSignalCount: [common.phones[0], common.emails[0], common.addressLines[0]].filter(Boolean).length,
  };
}

export function parseFamilyRecord(row, html) {
  const common = parseCommonExtraction({ row, html });
  const fallbackName = pickFallbackName(common);

  let familyExtraction = {
    recordType: 'generic_page',
    organizationName: fallbackName,
    publicContactSignalCount: [common.phones[0], common.emails[0], common.addressLines[0]].filter(Boolean).length,
  };

  if (row.gapFamily === 'nonprofit_support' && /thearc\.org/i.test(common.finalUrl)) {
    familyExtraction = extractTheArcChapter(common);
  } else if (row.gapFamily === 'dd_routing') {
    familyExtraction = extractDdRouting(common);
  } else if (row.gapFamily === 'medicaid_hhs_offices') {
    familyExtraction = extractCountyOffice(common);
  } else if (row.gapFamily === 'providers_care') {
    familyExtraction = extractProviders(common);
  } else if (row.gapFamily === 'advocates_legal') {
    familyExtraction = extractAdvocates(common);
  } else if (row.gapFamily === 'forms_guides') {
    familyExtraction = extractForms(common);
  } else if (['housing', 'goods_supplies', 'jobs_vocational', 'care_independent_living', 'legal_aid'].includes(row.gapFamily)) {
    familyExtraction = extractHelpResource(common, row.gapFamily);
  } else if (row.gapFamily === 'knowledge_content') {
    familyExtraction = extractKnowledgeContent(common);
  } else if (['programs_benefits', 'waivers', 'program_waitlists', 'general_gap_fill', 'transition_programs', 'early_intervention_programs'].includes(row.gapFamily)) {
    familyExtraction = extractPrograms(common);
  }

  const recordId = [
    row.stateId || 'unknown',
    row.gapFamily || 'unknown',
    path.basename(row.savedPath || '', path.extname(row.savedPath || '')),
  ].join('|');

  const parseStatus = familyExtraction.recordType !== 'generic_page'
    || common.h1s[0]
    || common.phones.length
    || common.emails.length
    ? 'parsed'
    : 'needs_review';

  return {
    recordId,
    parserId: `lightweight-${row.gapFamily || 'generic'}-v1`,
    parsedAt: new Date().toISOString(),
    ...common,
    stateId: familyExtraction.inferredStateId || common.stateId,
    familyExtraction,
    parseStatus,
  };
}

export function validateFamilyRecord(record) {
  const reasons = [];
  const addReason = (reason) => {
    if (!reasons.includes(reason)) reasons.push(reason);
  };
  if (!record.pageTitle && !record.h1s?.length) reasons.push('missing_title_and_heading');
  if (!record.finalUrl) reasons.push('missing_final_url');
  if (!record.savedPath) reasons.push('missing_saved_path');

  if (record.gapFamily === 'nonprofit_support') {
    const nonprofitName = record.familyExtraction.organizationName || record.h1s?.[0] || record.pageTitle || '';
    if (!nonprofitName) reasons.push('missing_organization_name');
    if (!record.familyExtraction.publicContactSignalCount && !record.phones?.length && !record.emails?.length && !record.addressLines?.length) {
      reasons.push('missing_public_contact_signal');
    }
  } else if (record.gapFamily === 'dd_routing') {
    if (!record.familyExtraction.officeName) reasons.push('missing_office_name');
    if (!record.familyExtraction.publicContactSignalCount) reasons.push('missing_dd_contact_signal');
  } else if (record.gapFamily === 'medicaid_hhs_offices') {
    if (!record.familyExtraction.officeName) reasons.push('missing_office_name');
    if (!record.familyExtraction.contactPhone) reasons.push('missing_office_phone');
    if (!record.familyExtraction.contactAddress) reasons.push('missing_office_address');
  } else if (['programs_benefits', 'waivers', 'program_waitlists', 'general_gap_fill', 'transition_programs', 'early_intervention_programs'].includes(record.gapFamily)) {
    if (!record.familyExtraction.programName) addReason('missing_program_name');
    if (looksLikeBlockedOrErrorPage(record.pageTitle, record.metaDescription, record.textSample, record.familyExtraction.programName)) {
      addReason('missing_action_signal');
    }
    if (!record.links?.length && !record.phones?.length) addReason('missing_action_signal');
  } else if (record.gapFamily === 'education_routing') {
    const routingText = [
      record.pageTitle,
      record.metaDescription,
      record.textSample,
      record.familyExtraction?.organizationName,
    ].filter(Boolean).join(' | ');
    const hasContactSignal = Boolean(record.phones?.length || record.emails?.length);
    const hasCredibleRoutingLink = (record.links || []).some((link) =>
      /district|school|special education|special-ed|regional|selpa|boces|intermediate unit|education service|esc|directory|center/i.test(`${link.text} ${link.href}`)
    );
    if (looksLikeBlockedOrErrorPage(routingText)) addReason('missing_basic_signal');
    if (!hasContactSignal && !hasCredibleRoutingLink) addReason('missing_basic_signal');
  } else if (record.gapFamily === 'providers_care') {
    if (!record.familyExtraction.organizationName) reasons.push('missing_provider_name');
    if (!record.familyExtraction.publicContactSignalCount) reasons.push('missing_provider_contact_signal');
  } else if (record.gapFamily === 'advocates_legal') {
    const advocateText = [
      record.pageTitle,
      record.metaDescription,
      record.textSample,
      record.familyExtraction?.organizationName,
      record.familyExtraction?.contactAddress,
    ].filter(Boolean).join(' | ');
    if (!record.familyExtraction.organizationName) reasons.push('missing_advocate_name');
    if (hasAdvocateBadSignal(advocateText)) reasons.push('bad_advocate_topic_signal');
    if (!hasAdvocateGoodSignal(advocateText)) reasons.push('missing_advocate_relevance_signal');
    if (!record.familyExtraction.publicContactSignalCount && !record.links?.length) reasons.push('missing_advocate_contact_signal');
  } else if (record.gapFamily === 'forms_guides') {
    if (!isOfficialLikeUrl(record.finalUrl || record.sourceUrl)) reasons.push('forms_requires_official_source');
    if (!record.familyExtraction.programName) reasons.push('missing_form_program_name');
    if (!record.familyExtraction.officialDownloadUrl) reasons.push('missing_official_download_or_library_url');
  } else if (['housing', 'goods_supplies', 'jobs_vocational', 'care_independent_living', 'legal_aid'].includes(record.gapFamily)) {
    if (!record.familyExtraction.organizationName) reasons.push('missing_help_resource_name');
    if (!record.familyExtraction.publicContactSignalCount && !(record.familyExtraction.actionLinks || []).length) {
      reasons.push('missing_actionable_service_signal');
    }
    if ((record.familyExtraction.actionLinks || []).length === 0 && !record.familyExtraction.publicContactSignalCount) {
      reasons.push('topical_reference_only');
    }
  } else if (record.gapFamily === 'knowledge_content') {
    if (!isTrustedKnowledgeUrl(record.finalUrl || record.sourceUrl)) reasons.push('knowledge_requires_high_trust_source');
    if (!record.familyExtraction.articleTitle) reasons.push('missing_knowledge_title');
    if (looksLikeBlockedOrErrorPage(record.pageTitle, record.metaDescription, record.textSample, record.familyExtraction.articleTitle)) {
      addReason('knowledge_summary_too_thin');
    }
    if ((record.familyExtraction.summaryText || '').length < 80) reasons.push('knowledge_summary_too_thin');
  } else {
    if (!record.phones?.length && !record.emails?.length && !record.links?.length) reasons.push('missing_basic_signal');
  }

  return {
    isAccepted: reasons.length === 0,
    reasons,
  };
}

export function countBy(rows, getKey) {
  const counts = {};
  for (const row of rows) {
    const key = getKey(row) || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));
}
