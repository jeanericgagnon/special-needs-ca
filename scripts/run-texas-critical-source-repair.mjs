import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  countyBaselineV2: path.join(generatedDir, 'tx_county_baseline_v2.jsonl'),
  eciMapV2: path.join(generatedDir, 'tx_eci_county_map_v2.jsonl'),
  hhsOfficeMapV2: path.join(generatedDir, 'tx_hhs_office_map_v2.jsonl'),
  verificationSummaryV2: path.join(generatedDir, 'tx_verification_summary_v2.json'),
  manifestReviewV1: path.join(generatedDir, 'tx_source_manifest_review_v1.jsonl'),
};

const OUTPUTS = {
  reportV3: path.join(docsDir, 'tx-critical-source-repair-report-v3.md'),
  liddaV3: path.join(generatedDir, 'tx_lidda_county_map_v3.jsonl'),
  educationV3: path.join(generatedDir, 'tx_askted_district_map_v3.jsonl'),
  countyV3: path.join(generatedDir, 'tx_county_baseline_v3.jsonl'),
  summaryV3: path.join(generatedDir, 'tx_verification_summary_v3.json'),
  failureV3: path.join(generatedDir, 'tx_failure_ledger_v3.jsonl'),
  nextActionV3: path.join(generatedDir, 'tx_next_action_queue_v3.jsonl'),
  asktedCsvV3: path.join(generatedDir, 'tx_askted_directory_v3.csv'),
};

const LIDDA_URL = 'https://resources.hhs.texas.gov/directories/lidda';
const ASKTED_DOWNLOAD_URL = 'https://tealprod.tea.state.tx.us/Tea.AskTed.Web/Forms/DownloadFile.aspx';
const USER_AGENT = 'Ablefull Texas critical-source repair/1.0 (+https://ablefull.com)';
const BAD_EVIDENCE_PATTERNS = [
  'file not found',
  'page not found',
  '404',
  'access denied',
  'forbidden',
  'generic homepage only',
  'just a moment',
];

function nowIso() {
  return new Date().toISOString();
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

function textBlob(...parts) {
  return parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

function hasBadEvidence(...parts) {
  const blob = textBlob(...parts);
  return BAD_EVIDENCE_PATTERNS.some((pattern) => blob.includes(pattern));
}

function decodeHtml(text) {
  return String(text || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&rsquo;/g, "'")
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-')
    .replace(/&#x27;/g, "'")
    .replace(/&#039;/g, "'");
}

function stripHtml(text) {
  return decodeHtml(String(text || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeCountyName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\bcounty\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

async function fetchText(url, options = {}) {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs || 25000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'user-agent': USER_AGENT,
        'accept-language': 'en-US,en;q=0.9',
        ...(options.headers || {}),
      },
      body: options.body,
      redirect: 'follow',
      signal: controller.signal,
    });
    const body = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url || url,
      contentType: response.headers.get('content-type') || '',
      body,
      fetchedAt: nowIso(),
    };
  } finally {
    clearTimeout(timer);
  }
}

function countyIndexFromV2(countyRows) {
  const byNormalized = new Map();
  for (const row of countyRows) {
    byNormalized.set(normalizeCountyName(row.county_name), row);
  }
  return byNormalized;
}

function parseLiddaDirectory(html, countyIndex, fetchedMeta, failures) {
  const cards = [...html.matchAll(/<div class="views-view-responsive-grid__item card-[\s\S]*?<div class="c-card__body">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g)];
  const rows = [];
  for (const card of cards) {
    const block = card[1];
    const liddaName = decodeHtml((block.match(/<h2 class="field-content">([\s\S]*?)<\/h2>/i) || [])[1] || '').trim();
    const intakePhone = decodeHtml((block.match(/Intake Phone:\s*([^<\n]+)/i) || [])[1] || '').trim();
    const mainPhone = decodeHtml((block.match(/Main Phone:\s*([^<\n]+)/i) || [])[1] || '').trim();
    const crisisPhone = decodeHtml((block.match(/Crisis Phone:\s*([^<\n]+)/i) || [])[1] || '').trim();
    const website = decodeHtml((block.match(/<a href="([^"]+)"/i) || [])[1] || '').trim();
    const addressRaw = decodeHtml((block.match(/<span class="field-content">([\s\S]*?)<\/span><\/div><span class="views-field views-field-field-counties">/i) || [])[1] || '');
    const address = stripHtml(addressRaw);
    const countiesRaw = decodeHtml((block.match(/Counties Served:\s*<\/strong><span class="field-content">([\s\S]*?)<\/span>/i) || [])[1] || '');
    const countyNames = countiesRaw.split(',').map((value) => value.trim()).filter(Boolean);
    const countyIds = countyNames
      .map((name) => countyIndex.get(normalizeCountyName(name))?.county_slug)
      .filter(Boolean);
    const evidenceSnippet = stripHtml(block).slice(0, 360);
    const reasons = [];
    if (!liddaName) reasons.push('missing_lidda_name');
    if (countyIds.length === 0) reasons.push('missing_county_mapping');
    if (!intakePhone && !mainPhone) reasons.push('missing_contact_route');
    if (hasBadEvidence(fetchedMeta.title, evidenceSnippet)) reasons.push('bad_evidence_marker');

    const verificationStatus = reasons.length === 0 ? 'verified' : 'blocked';
    const liddaId = liddaName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const row = {
      state: 'texas',
      lidda_id: liddaId,
      lidda_name: liddaName,
      counties_served: countyIds,
      counties_served_names: countyNames,
      intake_phone: intakePhone,
      main_phone: mainPhone,
      crisis_phone: crisisPhone,
      address,
      website,
      source_url: LIDDA_URL,
      final_url: fetchedMeta.finalUrl,
      fetched_at: fetchedMeta.fetchedAt,
      evidence_title: fetchedMeta.title,
      evidence_snippet: evidenceSnippet,
      verification_status: verificationStatus,
      verification_reasons: reasons,
      evidence_quality: verificationStatus === 'verified' ? 'live_official_lidda_directory_card' : 'live_official_lidda_directory_card_blocked',
    };
    rows.push(row);

    if (verificationStatus !== 'verified') {
      failures.push({
        state: 'texas',
        county_slug: null,
        role_id: 'tx_hhs_lidda_directory',
        source_family: 'tx_hhs_lidda_directory_live',
        status: 'blocked',
        source_url: row.source_url,
        final_url: row.final_url,
        reason: reasons.join('; ') || 'lidda_parse_failed',
        evidence_excerpt: evidenceSnippet,
        created_at: nowIso(),
        target_id: liddaId,
        category: 'lidda_row_unverified',
      });
    }
  }
  return rows;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift() || [];
  return rows.filter((cols) => cols.some((value) => value !== '')).map((cols) => {
    const obj = {};
    for (let i = 0; i < headers.length; i += 1) {
      obj[headers[i]] = cols[i] || '';
    }
    return obj;
  });
}

function bestAskTedRowForCounty(rows) {
  const deduped = [];
  const seen = new Set();
  for (const row of rows) {
    const key = `${row['District Number']}|${row['District Name']}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(row);
  }
  deduped.sort((a, b) => {
    const aWeb = a['District Web Page Address'] ? 1 : 0;
    const bWeb = b['District Web Page Address'] ? 1 : 0;
    if (aWeb !== bWeb) return bWeb - aWeb;
    return String(a['District Name'] || '').localeCompare(String(b['District Name'] || ''));
  });
  return deduped[0] || null;
}

async function fetchAskTedCsv() {
  const page = await fetchText(ASKTED_DOWNLOAD_URL);
  const viewState = (page.body.match(/__VIEWSTATE" value="([^"]+)"/i) || [])[1] || '';
  const viewStateGenerator = (page.body.match(/__VIEWSTATEGENERATOR" value="([^"]+)"/i) || [])[1] || '';
  if (!page.ok || !viewState || !viewStateGenerator) {
    return {
      ok: false,
      page,
      csvText: '',
      reason: 'parser_missing_or_download_form_unavailable',
    };
  }

  const params = new URLSearchParams({
    __VIEWSTATE: viewState,
    __VIEWSTATEGENERATOR: viewStateGenerator,
    ddlSortOrder: 'County Name',
    btnDownloadFile: 'Download File',
  });
  const csvResponse = await fetchText(ASKTED_DOWNLOAD_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
    timeoutMs: 40000,
  });

  const isCsv = /text\/csv/i.test(csvResponse.contentType || '');
  return {
    ok: csvResponse.ok && isCsv,
    page,
    csvResponse,
    csvText: isCsv ? csvResponse.body : '',
    reason: !csvResponse.ok ? `download_http_${csvResponse.status}` : (!isCsv ? 'parser_missing_or_dynamic_directory_parse_error' : ''),
  };
}

function buildAskTedRows(csvText, countyIndex, csvArtifactRelativePath, fetchedMeta, failures) {
  const parsedRows = parseCsv(csvText);
  const byCounty = new Map();
  for (const row of parsedRows) {
    const countyName = String(row['County Name'] || '').trim();
    const county = countyIndex.get(normalizeCountyName(countyName));
    if (!county) continue;
    if (!byCounty.has(county.county_slug)) byCounty.set(county.county_slug, []);
    byCounty.get(county.county_slug).push(row);
  }

  const output = [];
  for (const county of countyIndex.values()) {
    const matched = byCounty.get(county.county_slug) || [];
    const best = bestAskTedRowForCounty(matched);
    if (!best) {
      const row = {
        state: 'texas',
        county_id: county.county_slug,
        county_name: county.county_name,
        district_id: '',
        district_name: '',
        district_type: '',
        esc_region: '',
        district_phone: '',
        district_email: '',
        district_website: '',
        source_url: ASKTED_DOWNLOAD_URL,
        downloaded_artifact_path: csvArtifactRelativePath,
        fetched_at: fetchedMeta.fetchedAt,
        evidence_snippet: '',
        verification_status: 'blocked',
        verification_reasons: ['missing_county_in_askted_export'],
        evidence_quality: 'askted_csv_missing_county',
      };
      output.push(row);
      failures.push({
        state: 'texas',
        county_slug: county.county_slug,
        role_id: 'tx_askted_download_export',
        source_family: 'tx_askted_directory_export',
        status: 'blocked',
        source_url: row.source_url,
        final_url: fetchedMeta.finalUrl,
        reason: 'missing_county_in_askted_export',
        evidence_excerpt: '',
        created_at: nowIso(),
        target_id: county.county_slug,
        category: 'education_county_missing_from_export',
      });
      continue;
    }

    const districtWebsite = String(best['District Web Page Address'] || '').trim();
    const districtPhone = String(best['District Phone'] || '').trim();
    const districtEmail = String(best['District Email Address'] || '').trim();
    const districtName = String(best['District Name'] || '').trim();
    const districtId = String(best['District Number'] || '').replace(/^'+/, '').trim();
    const escRegion = String(best['ESC Region Served'] || '').replace(/^'+/, '').trim();
    const reasons = [];
    if (!districtName) reasons.push('missing_district_name');
    if (!districtId && !escRegion) reasons.push('missing_district_or_esc_identifier');
    if (hasBadEvidence(districtName, districtWebsite)) reasons.push('bad_evidence_marker');

    const verificationStatus = reasons.length === 0 ? 'verified' : 'blocked';
    const evidenceSnippet = [
      `County ${best['County Name']}`,
      `District ${districtName}`,
      districtId ? `District Number ${districtId}` : '',
      escRegion ? `ESC Region ${escRegion}` : '',
      districtWebsite ? `District Web ${districtWebsite}` : '',
      districtPhone ? `District Phone ${districtPhone}` : '',
    ].filter(Boolean).join(' | ');

    const row = {
      state: 'texas',
      county_id: county.county_slug,
      county_name: county.county_name,
      district_id: districtId,
      district_name: districtName,
      district_type: String(best['District Type'] || '').trim(),
      esc_region: escRegion,
      district_phone: districtPhone,
      district_email: districtEmail,
      district_website: districtWebsite,
      source_url: ASKTED_DOWNLOAD_URL,
      downloaded_artifact_path: csvArtifactRelativePath,
      fetched_at: fetchedMeta.fetchedAt,
      evidence_snippet: evidenceSnippet,
      verification_status: verificationStatus,
      verification_reasons: reasons,
      evidence_quality: verificationStatus === 'verified' ? 'askted_official_csv_county_district_mapping' : 'askted_official_csv_blocked',
    };
    output.push(row);

    if (verificationStatus !== 'verified') {
      failures.push({
        state: 'texas',
        county_slug: county.county_slug,
        role_id: 'tx_askted_download_export',
        source_family: 'tx_askted_directory_export',
        status: 'blocked',
        source_url: row.source_url,
        final_url: fetchedMeta.finalUrl,
        reason: reasons.join('; ') || 'education_parse_failed',
        evidence_excerpt: evidenceSnippet,
        created_at: nowIso(),
        target_id: county.county_slug,
        category: 'education_row_unverified',
      });
    }
  }
  return { output, parsedRowsCount: parsedRows.length };
}

function invertCoverage(rows, idField) {
  const coverage = new Map();
  for (const row of rows) {
    for (const countyId of row.counties_served || []) {
      if (!coverage.has(countyId)) coverage.set(countyId, []);
      coverage.get(countyId).push(row);
    }
  }
  return coverage;
}

function indexByCounty(rows, countyField = 'county_id') {
  return new Map(rows.map((row) => [row[countyField], row]));
}

function manifestRoute(rows, roleId) {
  const row = rows.find((item) => item.role_id === roleId && item.review_status === 'reviewed_fetch_ok');
  if (!row) return null;
  if (hasBadEvidence(row.evidence_title, row.evidence_h1, row.evidence_snippet)) return null;
  return row;
}

function buildCountyBaselineV3(countiesV2, liddaRows, eciRows, hhsRows, educationRows, manifestRows, failures) {
  const liddaByCounty = invertCoverage(liddaRows.filter((row) => row.verification_status === 'verified'), 'lidda_id');
  const eciByCounty = invertCoverage(eciRows.filter((row) => row.verification_status === 'verified'), 'eci_id');
  const hhsByCounty = indexByCounty(hhsRows.filter((row) => row.verification_status === 'verified'));
  const educationByCounty = indexByCounty(educationRows.filter((row) => row.verification_status === 'verified'));
  const statewide = {
    legal: manifestRoute(manifestRows, 'tx_drtx'),
    pti: manifestRoute(manifestRows, 'tx_prn'),
    able: manifestRoute(manifestRows, 'tx_able'),
  };

  return countiesV2.map((row) => {
    const lidda = liddaByCounty.get(row.county_slug)?.[0] || null;
    const eci = eciByCounty.get(row.county_slug)?.[0] || null;
    const hhs = hhsByCounty.get(row.county_slug) || null;
    const education = educationByCounty.get(row.county_slug) || null;
    const missingRoles = [];
    if (!lidda) missingRoles.push('LIDDA routing');
    if (!education) missingRoles.push('AskTED education mapping');
    if (!eci) missingRoles.push('ECI routing');
    if (!hhs) missingRoles.push('HHS/Medicaid routing');
    if (!statewide.legal) missingRoles.push('statewide legal/P&A route');
    if (!statewide.pti) missingRoles.push('statewide PTI route');
    if (!statewide.able) missingRoles.push('ABLE route');

    const coreSupportBroken = !eci || !hhs || !statewide.legal || !statewide.pti || !statewide.able;
    const repairedCriticalCount = Number(Boolean(lidda)) + Number(Boolean(education));
    let verificationStatus = 'blocked';
    if (!coreSupportBroken && repairedCriticalCount === 2) {
      verificationStatus = 'pass';
    } else if (!coreSupportBroken && repairedCriticalCount === 1) {
      verificationStatus = 'partial';
    }

    if (verificationStatus !== 'pass') {
      failures.push({
        state: 'texas',
        county_slug: row.county_slug,
        role_id: 'tx_county_gate_v3',
        source_family: 'tx_county_gate_critical_sources',
        status: verificationStatus,
        source_url: lidda?.source_url || education?.source_url || '',
        final_url: lidda?.final_url || '',
        reason: missingRoles.join('; '),
        evidence_excerpt: [lidda?.evidence_snippet, education?.evidence_snippet].filter(Boolean).join(' || ').slice(0, 260),
        created_at: nowIso(),
        target_id: row.county_slug,
        category: 'county_gate_below_threshold',
      });
    }

    return {
      county_name: row.county_name,
      county_slug: row.county_slug,
      state: 'texas',
      lidda_routing: lidda?.lidda_name || null,
      eci_routing: row.eci_routing,
      medicaid_hhs_routing: row.medicaid_hhs_routing,
      education_routing: education ? `${education.district_name}${education.esc_region ? ` (ESC ${education.esc_region})` : ''}` : null,
      statewide_legal_parent_route: row.statewide_legal_parent_route,
      statewide_pti_parent_route: row.statewide_pti_parent_route,
      able_route: row.able_route,
      trusted_enrichment_candidates: row.trusted_enrichment_candidates || [],
      missing_roles: missingRoles,
      verification_status: verificationStatus,
      source_urls: [
        lidda?.source_url,
        row.source_urls?.find((url) => /citysearch\.hhsc\.state\.tx\.us/.test(url || '')),
        row.source_urls?.find((url) => /hhs\.texas\.gov\/services\/health\/medicaid-chip/.test(url || '')),
        education?.source_url,
        statewide.legal?.authority_url,
        statewide.pti?.authority_url,
        statewide.able?.authority_url,
      ].filter(Boolean),
      evidence_snippets: [
        lidda?.evidence_snippet,
        row.evidence_snippets?.[1],
        row.evidence_snippets?.[2],
        education?.evidence_snippet,
        statewide.legal?.evidence_snippet,
        statewide.pti?.evidence_snippet,
        statewide.able?.evidence_snippet,
      ].filter(Boolean),
      fetched_at_values: [
        lidda?.fetched_at,
        education?.fetched_at,
        row.fetched_at_values?.[1],
        row.fetched_at_values?.[2],
        statewide.legal?.fetched_at,
        statewide.pti?.fetched_at,
        statewide.able?.fetched_at,
      ].filter(Boolean),
      lidda_status: lidda ? 'verified' : 'blocked',
      education_status: education ? 'verified' : 'blocked',
      eci_status: eci ? 'verified' : 'blocked',
      medicaid_hhs_status: hhs ? 'verified' : 'blocked',
      support_status: {
        legal: statewide.legal ? 'verified' : 'blocked',
        pti: statewide.pti ? 'verified' : 'blocked',
        able: statewide.able ? 'verified' : 'blocked',
      },
    };
  });
}

function countBy(rows, keyFn) {
  const counts = {};
  for (const row of rows) {
    const key = keyFn(row) || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function buildNextActionQueue(summary, failures) {
  const actions = [];
  if (summary.counties_still_blocked > 0) {
    actions.push({
      action: 'repair_remaining_critical_county_gaps',
      why: `${summary.counties_still_blocked} counties still lack one or both repaired critical source families.`,
    });
  }
  if (failures.some((row) => row.category === 'askted_source_failure')) {
    actions.push({
      action: 'investigate_askted_download_contract',
      why: 'AskTED export could not be fetched or parsed cleanly from the official TEA source.',
    });
  }
  if (actions.length === 0) {
    actions.push({
      action: 'hold_gate_strict_and_reuse_repaired_sources',
      why: 'The two critical source families were repaired without reopening generic evidence.',
    });
  }
  return actions;
}

function buildReport(summary, failures, testsRun) {
  const partialList = summary.partial_county_slugs?.length
    ? summary.partial_county_slugs.map((slug) => `- ${slug}`).join('\n')
    : '- none';
  return [
    '# Texas Critical-Source Repair Report v3',
    '',
    'This pass repairs only the two broken critical source families that caused the hardened Texas gate to block all 254 counties: LIDDA and AskTED.',
    '',
    '## Result history',
    '',
    `- v2 PASS/PARTIAL/BLOCKED: ${summary.v2.pass_counties}/${summary.v2.partial_counties}/${summary.v2.blocked_counties}`,
    `- v3 PASS/PARTIAL/BLOCKED: ${summary.v3.pass_counties}/${summary.v3.partial_counties}/${summary.v3.blocked_counties}`,
    '',
    '## What was repaired',
    '',
    `- LIDDA rows repaired from live official directory: ${summary.lidda_rows_repaired}`,
    `- AskTED rows repaired from official district/school/ESC export: ${summary.askted_rows_repaired}`,
    `- Counties unblocked from v2: ${summary.counties_unblocked}`,
    '',
    '## Counties still below full pass and why',
    '',
    `- Counties still blocked: ${summary.counties_still_blocked}`,
    `- Counties still partial: ${summary.v3.partial_counties}`,
    '- Partial counties:',
    partialList,
    `- Top failure categories: ${JSON.stringify(summary.top_failure_categories)}`,
    '',
    '## Exact source failures',
    '',
    ...Object.entries(countBy(failures, (row) => row.category)).map(([key, value]) => `- ${key}: ${value}`),
    '',
    `## Texas index-safe`,
    '',
    `- Texas is index-safe: ${summary.index_safe ? 'yes' : 'no'}`,
    '',
    '## Tests run',
    '',
    ...testsRun.map((cmd) => `- \`${cmd}\``),
  ].join('\n');
}

async function main() {
  const countyV2 = readJsonl(INPUTS.countyBaselineV2);
  const eciV2 = readJsonl(INPUTS.eciMapV2);
  const hhsV2 = readJsonl(INPUTS.hhsOfficeMapV2);
  const summaryV2 = readJson(INPUTS.verificationSummaryV2);
  const manifestRows = readJsonl(INPUTS.manifestReviewV1);
  const countyIndex = countyIndexFromV2(countyV2);
  const failures = [];

  const liddaPage = await fetchText(LIDDA_URL);
  const liddaTitle = decodeHtml((liddaPage.body.match(/<title[^>]*>([^<]+)/i) || [])[1] || '').trim();
  const liddaV3 = parseLiddaDirectory(liddaPage.body, countyIndex, {
    finalUrl: liddaPage.finalUrl,
    fetchedAt: liddaPage.fetchedAt,
    title: liddaTitle,
  }, failures);

  const askTed = await fetchAskTedCsv();
  let educationV3 = [];
  let parsedAskTedRows = 0;
  const csvArtifactRelativePath = 'data/generated/tx_askted_directory_v3.csv';
  if (!askTed.ok) {
    failures.push({
      state: 'texas',
      county_slug: null,
      role_id: 'tx_askted_download_export',
      source_family: 'tx_askted_directory_export',
      status: 'failed',
      source_url: ASKTED_DOWNLOAD_URL,
      final_url: askTed.csvResponse?.finalUrl || askTed.page?.finalUrl || ASKTED_DOWNLOAD_URL,
      reason: askTed.reason,
      evidence_excerpt: '',
      created_at: nowIso(),
      target_id: 'askted',
      category: 'askted_source_failure',
    });
    for (const county of countyV2) {
      educationV3.push({
        state: 'texas',
        county_id: county.county_slug,
        county_name: county.county_name,
        district_id: '',
        district_name: '',
        district_type: '',
        esc_region: '',
        district_phone: '',
        district_email: '',
        district_website: '',
        source_url: ASKTED_DOWNLOAD_URL,
        downloaded_artifact_path: csvArtifactRelativePath,
        fetched_at: askTed.page?.fetchedAt || nowIso(),
        evidence_snippet: '',
        verification_status: 'blocked',
        verification_reasons: [askTed.reason],
        evidence_quality: 'askted_download_failed',
      });
    }
  } else {
    fs.mkdirSync(path.dirname(OUTPUTS.asktedCsvV3), { recursive: true });
    fs.writeFileSync(OUTPUTS.asktedCsvV3, askTed.csvText);
    const built = buildAskTedRows(askTed.csvText, countyIndex, csvArtifactRelativePath, {
      finalUrl: askTed.csvResponse.finalUrl,
      fetchedAt: askTed.csvResponse.fetchedAt,
    }, failures);
    educationV3 = built.output;
    parsedAskTedRows = built.parsedRowsCount;
  }

  const countyV3 = buildCountyBaselineV3(countyV2, liddaV3, eciV2, hhsV2, educationV3, manifestRows, failures);
  const summary = {
    state: 'texas',
    generated_at: nowIso(),
    v2: summaryV2.v2,
    v3: {
      pass_counties: countyV3.filter((row) => row.verification_status === 'pass').length,
      partial_counties: countyV3.filter((row) => row.verification_status === 'partial').length,
      blocked_counties: countyV3.filter((row) => row.verification_status === 'blocked').length,
    },
    lidda_rows_repaired: liddaV3.filter((row) => row.verification_status === 'verified').length,
    askted_rows_repaired: educationV3.filter((row) => row.verification_status === 'verified').length,
    counties_unblocked: countyV3.filter((row) => row.verification_status !== 'blocked').length,
    counties_still_blocked: countyV3.filter((row) => row.verification_status === 'blocked').length,
    parsed_askted_export_rows: parsedAskTedRows,
    top_failure_categories: countBy(failures, (row) => row.category),
    index_safe: countyV3.every((row) => row.verification_status === 'pass'),
    partial_county_slugs: countyV3.filter((row) => row.verification_status === 'partial').map((row) => row.county_slug),
  };
  const nextAction = buildNextActionQueue(summary, failures);
  const report = buildReport(summary, failures, ['npm run test:texas-critical-source-repair']);

  writeJsonl(OUTPUTS.liddaV3, liddaV3);
  writeJsonl(OUTPUTS.educationV3, educationV3);
  writeJsonl(OUTPUTS.countyV3, countyV3);
  writeJsonl(OUTPUTS.failureV3, failures);
  writeJsonl(OUTPUTS.nextActionV3, nextAction);
  writeJson(OUTPUTS.summaryV3, summary);
  fs.mkdirSync(path.dirname(OUTPUTS.reportV3), { recursive: true });
  fs.writeFileSync(OUTPUTS.reportV3, `${report}\n`);

  console.log(JSON.stringify({
    ok: true,
    counts: summary.v3,
    lidda_rows_repaired: summary.lidda_rows_repaired,
    askted_rows_repaired: summary.askted_rows_repaired,
    counties_unblocked: summary.counties_unblocked,
    counties_still_blocked: summary.counties_still_blocked,
    index_safe: summary.index_safe,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
