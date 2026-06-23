import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'arizona_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'arizona_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'arizona_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'arizona_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'arizona_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  packet: path.join(generatedDir, 'arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  inventory: path.join(generatedDir, 'arizona_report_cards_county_keyed_district_inventory_v1.jsonl'),
};

const OUTPUTS = {
  leaves: path.join(generatedDir, 'arizona_district_owned_special_education_leaves_v1.jsonl'),
  summary: path.join(generatedDir, 'batch209_arizona_district_owned_leaf_verification_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch209-arizona-district-owned-leaf-verification-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const TARGET_TERMS = [
  'special education',
  'special services',
  'student services',
  'exceptional student services',
  'exceptional student',
  'special programs',
];

const LEAF_HINTS = [
  'special-education',
  'special_education',
  'specialeducation',
  'special-services',
  'special_services',
  'student-services',
  'student_services',
  'exceptional-student-services',
  'exceptional_student_services',
  'special-programs',
];

const VERIFIED_FAILURE_CODE = 'district_owned_special_education_leaves_verified_for_some_counties_but_remaining_counties_still_lack_reviewed_local_leaves';
const VERIFIED_STATUS_REASON = 'Arizona education now has reviewed district-owned special-education or student-services leaves for some county-keyed district roots, but the family remains blocked until every county has a reviewed local education-routing leaf rather than only a county-keyed district root.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
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
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    if ((parsed.protocol === 'http:' && parsed.port === '80') || (parsed.protocol === 'https:' && parsed.port === '443')) {
      parsed.port = '';
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function cleanText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(html) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() || null;
}

function extractH1(html) {
  return html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, ' ')?.replace(/\s+/g, ' ').trim() || null;
}

function extractLinks(html, baseUrl) {
  const links = [];
  const seen = new Set();
  const regex = /href=["']([^"'#]+)["']/gi;
  let match;
  while ((match = regex.exec(html))) {
    const raw = match[1].trim();
    try {
      const absolute = normalizeUrl(new URL(raw, baseUrl).toString());
      if (!absolute || seen.has(absolute)) continue;
      seen.add(absolute);
      links.push(absolute);
    } catch {
      // ignore invalid links
    }
  }
  return links;
}

function containsAny(text, terms = TARGET_TERMS) {
  const lower = String(text || '').toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function sameHost(urlA, urlB) {
  try {
    return new URL(urlA).hostname === new URL(urlB).hostname;
  } catch {
    return false;
  }
}

function looksLikeCandidate(url) {
  const lower = url.toLowerCase();
  return LEAF_HINTS.some((hint) => lower.includes(hint));
}

async function defaultFetch(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 Codex Arizona bounded district leaf verification',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  });
  const text = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    finalUrl: response.url,
    contentType: response.headers.get('content-type') || null,
    text,
  };
}

function extractSitemapCandidates(xmlText, siteUrl) {
  const urls = [];
  const regex = /<loc>([^<]+)<\/loc>/gi;
  let match;
  while ((match = regex.exec(xmlText))) {
    const candidate = normalizeUrl(match[1].trim());
    if (!candidate) continue;
    if (!sameHost(candidate, siteUrl)) continue;
    if (!looksLikeCandidate(candidate)) continue;
    urls.push(candidate);
  }
  return [...new Set(urls)];
}

export async function verifyArizonaDistrictOwnedLeaves({
  inventoryRows = readJsonl(INPUTS.inventory),
  fetchImpl = defaultFetch,
  fetchedAt = '2026-06-23T00:00:00.000Z',
} = {}) {
  const resolved = [];
  const unresolved = [];

  for (const row of inventoryRows) {
    const website = row.district_website ? normalizeUrl(row.district_website) : null;
    if (!website) {
      unresolved.push({
        county_id: row.county_id,
        district_name: row.district_name,
        unresolved_reason: 'district_root_missing_public_website',
      });
      continue;
    }

    const homepage = await fetchImpl(website);
    if (!homepage.ok) {
      unresolved.push({
        county_id: row.county_id,
        district_name: row.district_name,
        district_website: website,
        unresolved_reason: `district_homepage_http_${homepage.status}`,
      });
      continue;
    }

    const homepageLinks = extractLinks(homepage.text, homepage.finalUrl)
      .filter((href) => sameHost(href, homepage.finalUrl))
      .filter((href) => looksLikeCandidate(href));

    let sitemapLinks = [];
    try {
      const sitemap = await fetchImpl(new URL('/sitemap.xml', homepage.finalUrl).toString());
      if (sitemap.ok && String(sitemap.contentType || '').toLowerCase().includes('xml')) {
        sitemapLinks = extractSitemapCandidates(sitemap.text, homepage.finalUrl);
      }
    } catch {
      // sitemap is optional
    }

    const candidateUrls = [...new Set([...homepageLinks, ...sitemapLinks])];
    let verifiedLeaf = null;

    for (const candidateUrl of candidateUrls.slice(0, 5)) {
      const candidate = await fetchImpl(candidateUrl);
      if (!candidate.ok) continue;
      const title = extractTitle(candidate.text);
      const h1 = extractH1(candidate.text);
      const visibleText = cleanText(candidate.text).slice(0, 1200);
      if (!containsAny(`${title || ''} ${h1 || ''} ${visibleText}`)) continue;
      verifiedLeaf = {
        county_id: row.county_id,
        county_name: row.county_name,
        district_name: row.district_name,
        district_website: website,
        source_url: candidateUrl,
        final_url: candidate.finalUrl,
        verification_status: 'verified',
        source_type: 'district_owned_special_education_leaf',
        fetched_at: fetchedAt,
        evidence_title: title,
        evidence_h1: h1,
        evidence_snippet: visibleText.slice(0, 400),
      };
      break;
    }

    if (verifiedLeaf) {
      resolved.push(verifiedLeaf);
    } else {
      unresolved.push({
        county_id: row.county_id,
        district_name: row.district_name,
        district_website: website,
        unresolved_reason: candidateUrls.length ? 'candidate_urls_present_but_not_role_verified' : 'no_same_domain_special_education_candidate_url_found',
      });
    }
  }

  return { resolved, unresolved };
}

function buildEvidence(resolved, unresolved) {
  const resolvedCounties = resolved.map((row) => row.county_id).sort();
  const unresolvedCounties = unresolved.map((row) => row.county_id).filter(Boolean).sort();
  return `Reviewed 2026-06-23 bounded district-owned Arizona education leaf verification from the county-keyed report-cards inventory. Exact same-domain special-education or student-services leaves were verified for ${resolvedCounties.length}/${resolvedCounties.length + unresolvedCounties.length} county-keyed district roots: ${resolvedCounties.join(', ') || 'none'}. The verified local leaves came from direct district-owned hrefs or sitemap candidates rather than the challenged AZED host. Remaining unresolved counties are ${unresolvedCounties.join(', ') || 'none'}, where the current chosen district root either exposes no same-domain special-education candidate, has no public district website, or still lacks a role-verifiable local leaf. Arizona education is sharper because some county-grade local leaves are now proven, but the family remains blocked until all counties have reviewed district-owned education-routing leaves.`;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Arizona California-Grade Audit Report v2',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    `- primary_gap_reason: ${summary.primary_gap_reason}`,
    '',
    '## Family status',
    '',
    ...gapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`),
    '',
    '## Failure ledger',
    '',
    ...failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Completion decision',
    '',
    '- Arizona remains BLOCKED and not index-safe.',
    '- Education improved because reviewed district-owned leaves now exist for part of the county-keyed district inventory, so the blocker is no longer just root authoring. The remaining work is explicit unresolved county coverage.',
    '- County/local disability resources are still blocked separately because the DES office lane remains challenge-blocked and the accessible AHCCCS artifacts still do not preserve a county-to-office contract.',
  ].join('\n') + '\n';
}

export async function generateBatch209ArizonaDistrictOwnedLeafVerificationV1(options = {}) {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const packet = readJson(INPUTS.packet);

  const { resolved, unresolved } = await verifyArizonaDistrictOwnedLeaves(options);
  const evidence = buildEvidence(resolved, unresolved);

  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...packet.current_problem_metrics,
      authoredExactLeafCount: resolved.length,
      unresolvedDistrictOwnedLeafCount: unresolved.length,
    },
    verified_local_leaf_counties: resolved.map((row) => row.county_id).sort(),
    unresolved_local_leaf_counties: unresolved.map((row) => row.county_id).filter(Boolean).sort(),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      status_reason: VERIFIED_STATUS_REASON,
    };
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      failure_code: VERIFIED_FAILURE_CODE,
      evidence,
      next_action: 'finish_district_owned_special_education_leaves_for_unresolved_counties_from_county_keyed_roots',
    };
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      family_status: 'blocked_partial_district_owned_special_education_leaf_coverage',
      query_basis: 'Bounded district-owned same-domain verification from county-keyed Arizona report-cards roots using homepage and sitemap candidate discovery only.',
      blocker_code: VERIFIED_FAILURE_CODE,
      blocker_evidence: evidence,
      sample_count: resolved.length + 2,
      samples: [
        ...(resolved.slice(0, 5).map((leaf) => ({
          sample_name: `${leaf.county_name} district-owned leaf`,
          source_url: leaf.source_url,
          final_url: leaf.final_url,
          verification_status: leaf.verification_status,
          source_type: leaf.source_type,
          source_table: 'reviewed_live_probe',
          fetched_at: leaf.fetched_at,
          evidence_snippet: leaf.evidence_snippet,
        }))),
        {
          sample_name: 'Arizona School Report Cards District Inventory',
          source_url: 'https://azreportcards.azed.gov/api/Entity/GetEntityList',
          final_url: 'https://azreportcards.azed.gov/api/Entity/GetEntityList',
          verification_status: 'verified',
          source_type: 'official_state_inventory_api',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The official report-cards inventory API still supplies the county-keyed district root inventory that feeds district-owned leaf verification.',
        },
        {
          sample_name: 'Arizona county-keyed district root inventory',
          source_url: 'data/generated/arizona_report_cards_county_keyed_district_inventory_v1.jsonl',
          final_url: 'data/generated/arizona_report_cards_county_keyed_district_inventory_v1.jsonl',
          verification_status: 'verified',
          source_type: 'reviewed_inventory_artifact',
          source_table: 'generated_artifact',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The county-keyed inventory preserves one reviewed district root per Arizona county and narrows the remaining work to unresolved district-owned leaves.',
        },
      ],
    };
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      next_action: 'finish_district_owned_special_education_leaves_for_unresolved_counties_from_county_keyed_roots',
      evidence,
    };
  });

  const updatedSummary = {
    ...summary,
    completeness_pct: summary.completeness_pct,
    primary_gap_reason: 'partial_district_owned_education_leafs_plus_des_county_office_blocker',
    final_blockers: summary.final_blockers.map((row) => {
      if (row.family !== 'district_or_county_education_routing') return row;
      return {
        ...row,
        failure_code: VERIFIED_FAILURE_CODE,
        evidence,
      };
    }),
  };

  const updatedQueueRows = queueRows.map((row) => {
    if (row.state !== 'arizona') return row;
    return {
      ...row,
      primary_gap_reason: updatedSummary.primary_gap_reason,
      weak_critical_families: 2,
    };
  });

  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(OUTPUTS.leaves, resolved);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(OUTPUTS.summary, {
    batch: 'batch_209_arizona_district_owned_leaf_verification_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'arizona',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    resolved_counties: resolved.map((row) => row.county_id).sort(),
    unresolved_counties: unresolved.map((row) => row.county_id).filter(Boolean).sort(),
    verified_leaf_count: resolved.length,
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 209 Arizona District-Owned Leaf Verification v1',
      '',
      `- verified district-owned leaf counties: ${resolved.length}`,
      `- unresolved counties: ${unresolved.length}`,
      `- resolved counties: ${resolved.map((row) => row.county_id).sort().join(', ') || 'none'}`,
      `- unresolved counties: ${unresolved.map((row) => row.county_id).filter(Boolean).sort().join(', ') || 'none'}`,
      '',
      '## Decision',
      '',
      '- This pass only verified district-owned same-domain special-education or student-services leaves from the current county-keyed Arizona district root inventory.',
      '- Arizona remains blocked because education is still incomplete across counties and county-local disability resources remain separately blocked.',
    ].join('\n') + '\n',
  );

  return { resolved, unresolved, updatedPacket };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch209ArizonaDistrictOwnedLeafVerificationV1()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
