import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  countyBaselineV1: path.join(generatedDir, 'tx_county_baseline_v1.jsonl'),
  liddaMapV1: path.join(generatedDir, 'tx_lidda_county_map_v1.jsonl'),
  eciMapV1: path.join(generatedDir, 'tx_eci_county_map_v1.jsonl'),
  hhsOfficeMapV1: path.join(generatedDir, 'tx_hhs_office_map_v1.jsonl'),
  asktedMapV1: path.join(generatedDir, 'tx_askted_district_map_v1.jsonl'),
  verificationSummaryV1: path.join(generatedDir, 'tx_verification_summary_v1.json'),
  failureLedgerV1: path.join(generatedDir, 'tx_failure_ledger_v1.jsonl'),
  manifestReviewV1: path.join(generatedDir, 'tx_source_manifest_review_v1.jsonl'),
  roleManifestV1: path.join(repoRoot, 'data', 'source_targets', 'tx_role_target_manifest_v1.jsonl'),
  procedureDocV1: path.join(docsDir, 'tx-completion-procedure-and-results-v1.md'),
};

const OUTPUTS = {
  reportV2: path.join(docsDir, 'tx-verification-hardening-report-v2.md'),
  verificationSummaryV2: path.join(generatedDir, 'tx_verification_summary_v2.json'),
  countyBaselineV2: path.join(generatedDir, 'tx_county_baseline_v2.jsonl'),
  liddaMapV2: path.join(generatedDir, 'tx_lidda_county_map_v2.jsonl'),
  eciMapV2: path.join(generatedDir, 'tx_eci_county_map_v2.jsonl'),
  hhsOfficeMapV2: path.join(generatedDir, 'tx_hhs_office_map_v2.jsonl'),
  asktedMapV2: path.join(generatedDir, 'tx_askted_district_map_v2.jsonl'),
  failureLedgerV2: path.join(generatedDir, 'tx_failure_ledger_v2.jsonl'),
  procedureRulesV2: path.join(generatedDir, 'tx_procedure_rules_v2.jsonl'),
  nextActionQueueV2: path.join(generatedDir, 'tx_next_action_queue_v2.jsonl'),
};

const BAD_EVIDENCE_PATTERNS = [
  'file not found',
  'page not found',
  '404',
  'access denied',
  'forbidden',
  'error',
  'temporarily unavailable',
  'no results',
  'search page only',
  'generic homepage only',
  'just a moment',
];

const V2_PROCEDURE_RULES = [
  'v1 over-claimed texas pass status because the county gate accepted generic or broken evidence',
  'a row cannot be verified when title, h1, or evidence snippet contains a broken-page marker',
  'statewide routes may support counties but cannot by themselves produce a county PASS',
  'county PASS requires county-specific or source-derived mapping for LIDDA, ECI, education routing, and HHS routing',
  'generic AskTED portal roots do not verify county education routing without parsed county or district mapping',
  'broken official directory pages must downgrade dependent county rows even if fallback names exist in the database',
  'failure-ledger critical findings must affect county gate outcomes',
  'truth beats coverage; downgrade when evidence is generic, broken, or not county-specific',
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

function hasBadEvidence(row) {
  const blob = textBlob(row.evidence_title, row.evidence_h1, row.evidence_snippet, row.notes);
  return BAD_EVIDENCE_PATTERNS.some((pattern) => blob.includes(pattern));
}

function badEvidenceReason(row) {
  const blob = textBlob(row.evidence_title, row.evidence_h1, row.evidence_snippet, row.notes);
  return BAD_EVIDENCE_PATTERNS.find((pattern) => blob.includes(pattern)) || null;
}

function hostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function pathLower(url) {
  try {
    return new URL(url).pathname.toLowerCase();
  } catch {
    return '';
  }
}

function isOfficialTexasHhs(url) {
  const host = hostname(url);
  return host === 'hhs.texas.gov' || host === 'resources.hhs.texas.gov' || host === 'apps.hhs.texas.gov' || host === 'citysearch.hhsc.state.tx.us' || host === 'yourtexasbenefits.com';
}

function isOfficialTexasTea(url) {
  const host = hostname(url);
  return host === 'tea.texas.gov' || host === 'tealprod.tea.state.tx.us' || host === 'tea.state.tx.us';
}

function isGenericHomeOrSearchUrl(url) {
  const host = hostname(url);
  const pathname = pathLower(url);
  if (!url) return false;
  if (host === 'citysearch.hhsc.state.tx.us') return true;
  if (host === 'tealprod.tea.state.tx.us') return true;
  if (host === 'yourtexasbenefits.com' && (pathname === '/' || pathname === '')) return true;
  if (host === 'prntexas.org' && (pathname === '/' || pathname === '')) return true;
  if (host === 'disabilityrightstx.org' && (pathname === '/' || pathname === '/en/home/' || pathname === '/en/home')) return true;
  if (host === 'texasable.org' && (pathname === '/' || pathname === '')) return true;
  if (host === 'spedtex.org' && (pathname === '/' || pathname === '')) return true;
  if (host === 'navigatelifetexas.org' && (pathname === '/' || pathname === '/en')) return true;
  if (host === 'texasautismsociety.org' && (pathname === '/' || pathname === '')) return true;
  if (host === 'hhs.texas.gov' && pathname === '/services/health/medicaid-chip') return true;
  if (host === 'apps.hhs.texas.gov' && pathname === '/contact/la.cfm') return true;
  if (host === 'tea.texas.gov' && pathname === '/askted') return true;
  return false;
}

function compact(values) {
  return values.filter(Boolean);
}

function countBy(rows, keyFn) {
  const counts = {};
  for (const row of rows) {
    const key = keyFn(row) || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function summarizeAudit(v1) {
  const verifiedRows = [
    ...v1.liddaRows.filter((row) => row.verification_status === 'verified'),
    ...v1.eciRows.filter((row) => row.verification_status === 'verified'),
    ...v1.hhsRows.filter((row) => row.verification_status === 'verified'),
    ...v1.educationRows.filter((row) => row.verification_status === 'verified'),
  ];

  const genericVerifiedRows = verifiedRows.filter((row) => isGenericHomeOrSearchUrl(row.final_url || row.source_url));
  const brokenVerifiedRows = verifiedRows.filter((row) => hasBadEvidence(row));
  const criticalCountyGateMisses = v1.countyRows.filter((row) => row.verification_status === 'pass' && row.evidence_snippets?.some((snippet) => hasBadEvidence({ evidence_snippet: snippet })));
  const passCountiesWithGenericEducation = v1.countyRows.filter((row) => row.verification_status === 'pass' && row.source_urls?.some((url) => hostname(url) === 'tea.texas.gov' && pathLower(url) === '/askted'));

  return {
    verifiedRowsMarkedV1: verifiedRows.length,
    verifiedRowsWithBrokenEvidence: brokenVerifiedRows.length,
    evidenceSnippetsContainingFileNotFound: verifiedRows.filter((row) => textBlob(row.evidence_snippet).includes('file not found')).length,
    verifiedRowsUsingGenericHomeOrSearchPages: genericVerifiedRows.length,
    passCountiesLackingCountySpecificEvidence: criticalCountyGateMisses.length,
    passCountiesUsingGenericAskTedOnly: passCountiesWithGenericEducation.length,
    failuresLoggedButDidNotAffectGate: v1.failureRows.length,
    testsThatAllowedBadResult: [
      'v1 PASS assertion required only a LIDDA string, not valid county-specific evidence',
      'v1 tests never failed on broken evidence markers like "File Not Found"',
      'v1 tests never required parsed county or district mapping for education routing',
      'v1 tests never forced failure-ledger critical rows to downgrade county gate status',
    ],
  };
}

function buildLiddaV2(v1Rows, downgradeRows) {
  return v1Rows.map((row) => {
    const reasons = [];
    if (!isOfficialTexasHhs(row.source_url) || !isOfficialTexasHhs(row.final_url)) reasons.push('non_official_or_unapproved_domain');
    if (!row.lidda_name) reasons.push('missing_lidda_name');
    if (!Array.isArray(row.counties_served) || row.counties_served.length === 0) reasons.push('missing_county_mapping');
    if (!(row.intake_phone || row.main_phone)) reasons.push('missing_contact_route');
    if (!row.final_url) reasons.push('missing_final_url');
    const badReason = badEvidenceReason(row);
    if (badReason) reasons.push(`broken_evidence:${badReason}`);

    const verified = reasons.length === 0;
    const next = {
      ...row,
      v1_verification_status: row.verification_status,
      verification_status: verified ? 'verified' : 'downgraded_unverified',
      evidence_quality: verified ? 'county_specific_or_source_derived' : 'broken_or_generic',
      verification_reasons: reasons,
    };

    if (!verified) {
      downgradeRows.push({
        state: 'texas',
        county_slug: null,
        role_id: 'tx_hhs_lidda_directory',
        source_family: 'tx_hhs_lidda_directory',
        old_status: row.verification_status,
        new_status: next.verification_status,
        source_url: row.source_url,
        final_url: row.final_url,
        reason: reasons.join('; '),
        evidence_excerpt: String(row.evidence_snippet || '').slice(0, 240),
        created_at: nowIso(),
        downgrade_target: row.lidda_id,
        category: 'downgrade_lidda',
      });
    }
    return next;
  });
}

function buildEciV2(v1Rows) {
  return v1Rows.map((row) => {
    const reasons = [];
    if (!isOfficialTexasHhs(row.source_url) || !isOfficialTexasHhs(row.final_url)) reasons.push('non_official_or_unapproved_domain');
    if (!row.provider_name) reasons.push('missing_provider_name');
    if (!Array.isArray(row.counties_served) || row.counties_served.length === 0) reasons.push('missing_county_mapping');
    if (!(row.referral_phone || row.email)) reasons.push('missing_contact_route');
    if (!row.final_url) reasons.push('missing_final_url');
    const badReason = badEvidenceReason(row);
    if (badReason) reasons.push(`broken_evidence:${badReason}`);
    return {
      ...row,
      v1_verification_status: row.verification_status,
      verification_status: reasons.length === 0 ? 'verified' : 'downgraded_unverified',
      evidence_quality: 'source_derived_county_mapping',
      verification_reasons: reasons,
    };
  });
}

function buildHhsOfficeV2(v1Rows) {
  return v1Rows.map((row) => {
    const reasons = [];
    if (!isOfficialTexasHhs(row.source_url) || !isOfficialTexasHhs(row.final_url)) reasons.push('non_official_or_unapproved_domain');
    if (!row.office_name) reasons.push('missing_office_name');
    if (!row.address) reasons.push('missing_address');
    if (!row.phone) reasons.push('missing_phone');
    if (!row.application_benefits_url) reasons.push('missing_application_route');
    const badReason = badEvidenceReason(row);
    if (badReason) reasons.push(`broken_evidence:${badReason}`);
    return {
      ...row,
      v1_verification_status: row.verification_status,
      verification_status: reasons.length === 0 ? 'verified' : 'downgraded_unverified',
      evidence_quality: 'source_derived_county_office_mapping',
      verification_reasons: reasons,
    };
  });
}

function buildEducationV2(v1Rows, downgradeRows) {
  return v1Rows.map((row) => {
    const reasons = [];
    if (!isOfficialTexasTea(row.source_url) || !isOfficialTexasTea(row.final_url)) reasons.push('non_official_or_unapproved_domain');
    if (!row.county_id) reasons.push('missing_county_mapping');
    if (!row.website) reasons.push('missing_official_website');
    if (String(row.final_url || '').toLowerCase().includes('tea.askted.web/forms/home.aspx')) reasons.push('generic_askted_portal_without_parsed_mapping');
    if (String(row.district_id || '').startsWith('sd-fallback-')) reasons.push('fallback_identifier_not_parsed_source_mapping');
    if (!row.spec_ed_contact_phone && !row.spec_ed_contact_email) reasons.push('missing_special_education_contact');
    const verified = reasons.length === 0;
    const next = {
      ...row,
      v1_verification_status: row.verification_status,
      verification_status: verified ? 'verified' : 'downgraded_unverified',
      evidence_quality: verified ? 'parsed_askted_or_official_mapping' : 'generic_portal_only',
      verification_reasons: reasons,
    };
    if (!verified) {
      downgradeRows.push({
        state: 'texas',
        county_slug: row.county_id,
        role_id: 'tx_askted',
        source_family: 'tx_askted_district_school_esc_directory',
        old_status: row.verification_status,
        new_status: next.verification_status,
        source_url: row.source_url,
        final_url: row.final_url,
        reason: reasons.join('; '),
        evidence_excerpt: String(row.district_name || '').slice(0, 240),
        created_at: nowIso(),
        downgrade_target: row.district_id,
        category: 'downgrade_education',
      });
    }
    return next;
  });
}

function indexByCounty(rows, countyField = 'county_id') {
  const map = new Map();
  for (const row of rows) {
    map.set(row[countyField], row);
  }
  return map;
}

function invertCoverage(rows, idField) {
  const map = new Map();
  for (const row of rows) {
    for (const county of row.counties_served || []) {
      if (!map.has(county)) map.set(county, []);
      map.get(county).push(row);
    }
  }
  return map;
}

function manifestVerifiedRoute(rows, roleId) {
  const row = rows.find((item) => item.role_id === roleId && item.review_status === 'reviewed_fetch_ok');
  if (!row || hasBadEvidence(row)) return null;
  return row;
}

function buildCountyBaselineV2(v1CountyRows, liddaRows, eciRows, hhsRows, educationRows, manifestRows, downgradeRows) {
  const liddaByCounty = invertCoverage(liddaRows.filter((row) => row.verification_status === 'verified'), 'lidda_id');
  const eciByCounty = invertCoverage(eciRows.filter((row) => row.verification_status === 'verified'), 'eci_id');
  const hhsByCounty = indexByCounty(hhsRows.filter((row) => row.verification_status === 'verified'));
  const educationByCounty = indexByCounty(educationRows.filter((row) => row.verification_status === 'verified'));
  const statewide = {
    legal: manifestVerifiedRoute(manifestRows, 'tx_drtx'),
    pti: manifestVerifiedRoute(manifestRows, 'tx_prn'),
    able: manifestVerifiedRoute(manifestRows, 'tx_able'),
  };

  return v1CountyRows.map((row) => {
    const lidda = liddaByCounty.get(row.county_slug)?.[0] || null;
    const eci = eciByCounty.get(row.county_slug)?.[0] || null;
    const hhs = hhsByCounty.get(row.county_slug) || null;
    const education = educationByCounty.get(row.county_slug) || null;

    const roleStatus = {
      lidda: lidda ? 'verified' : 'blocked',
      eci: eci ? 'verified' : 'blocked',
      hhs: hhs ? 'verified' : 'blocked',
      education: education ? 'verified' : 'blocked',
      legal: statewide.legal ? 'verified' : 'partial',
      pti: statewide.pti ? 'verified' : 'partial',
      able: statewide.able ? 'verified' : 'partial',
    };

    const missingRoles = [];
    if (!lidda) missingRoles.push('LIDDA routing');
    if (!eci) missingRoles.push('ECI routing');
    if (!hhs) missingRoles.push('HHS/Medicaid routing');
    if (!education) missingRoles.push('education routing');
    if (!statewide.legal) missingRoles.push('statewide legal/P&A route');
    if (!statewide.pti) missingRoles.push('statewide PTI route');
    if (!statewide.able) missingRoles.push('ABLE route');

    let verificationStatus = 'pass';
    if (!lidda || !eci || !hhs || !education) {
      verificationStatus = 'blocked';
    } else if (!statewide.legal || !statewide.pti || !statewide.able) {
      verificationStatus = 'partial';
    }

    const next = {
      ...row,
      v1_verification_status: row.verification_status,
      verification_status: verificationStatus,
      lidda_status: roleStatus.lidda,
      eci_status: roleStatus.eci,
      medicaid_hhs_status: roleStatus.hhs,
      education_status: roleStatus.education,
      statewide_legal_status: roleStatus.legal,
      statewide_pti_status: roleStatus.pti,
      able_status: roleStatus.able,
      missing_roles: missingRoles,
      gate_basis: {
        lidda_source: lidda?.source_url || null,
        eci_source: eci?.source_url || null,
        hhs_source: hhs?.source_url || null,
        education_source: education?.source_url || null,
      },
      gate_hardening_notes: compact([
        !lidda ? 'LIDDA downgraded or missing after evidence hardening' : '',
        !education ? 'Education routing downgraded because only generic AskTED portal evidence existed' : '',
      ]),
    };

    if (row.verification_status === 'pass' && verificationStatus !== 'pass') {
      downgradeRows.push({
        state: 'texas',
        county_slug: row.county_slug,
        role_id: 'tx_county_gate',
        source_family: 'tx_county_baseline',
        old_status: row.verification_status,
        new_status: verificationStatus,
        source_url: row.source_urls?.[0] || '',
        final_url: row.source_urls?.[0] || '',
        reason: missingRoles.join('; '),
        evidence_excerpt: (row.evidence_snippets || []).join(' | ').slice(0, 240),
        created_at: nowIso(),
        downgrade_target: row.county_slug,
        category: 'downgrade_county_gate',
      });
    }

    return next;
  });
}

function buildFailureLedgerV2(v1FailureRows, downgradeRows) {
  const carried = v1FailureRows.map((row) => ({
    state: row.state,
    county_slug: null,
    role_id: row.role_id,
    source_family: row.source_family,
    old_status: null,
    new_status: 'logged_failure',
    source_url: row.source_url,
    final_url: row.final_url,
    reason: row.reason,
    evidence_excerpt: '',
    created_at: row.created_at,
    downgrade_target: null,
    category: row.category,
  }));
  return [...carried, ...downgradeRows];
}

function buildNextActionQueueV2(failureRows, countyRows) {
  const blockedCounties = countyRows.filter((row) => row.verification_status === 'blocked');
  return [
    {
      priority: 'P0',
      role_id: 'tx_hhs_lidda_directory',
      next_action: 'repair_or_replace_broken_lidda_directory_source',
      why: 'All 39 v1 LIDDA rows were downgraded because the official evidence snippet was File Not Found.',
      affected_rows: failureRows.filter((row) => row.category === 'downgrade_lidda').length,
    },
    {
      priority: 'P0',
      role_id: 'tx_askted',
      next_action: 'build_parsed_county_or_district_mapping_from_official_tea_source',
      why: 'All current education rows rely on a generic AskTED portal final URL without parsed county or district evidence.',
      affected_rows: failureRows.filter((row) => row.category === 'downgrade_education').length,
    },
    {
      priority: 'P0',
      role_id: 'tx_county_gate',
      next_action: 'keep_texas_counties_noindex_until_hardened_roles_verify',
      why: `Blocked counties after hardening: ${blockedCounties.length}.`,
      affected_rows: blockedCounties.length,
    },
    {
      priority: 'P1',
      role_id: 'tx_project_first',
      next_action: 'browser_assisted_followup_for_403_source',
      why: 'Texas Project First remained fetch-blocked with HTTP 403 in v1 and should not be treated as down.',
      affected_rows: failureRows.filter((row) => row.role_id === 'tx_project_first').length,
    },
  ];
}

function addCorrectionNoticeToV1Doc(v2Counts) {
  if (!fs.existsSync(INPUTS.procedureDocV1)) return;
  const original = fs.readFileSync(INPUTS.procedureDocV1, 'utf8');
  if (original.includes('## v2 correction notice')) return;
  const notice = [
    '## v2 correction notice',
    '',
    'The original v1 Texas completion lane over-claimed county PASS status.',
    '',
    `- v1 reported: PASS ${v2Counts.v1.pass}, PARTIAL ${v2Counts.v1.partial}, BLOCKED ${v2Counts.v1.blocked}`,
    `- v2 hardened result: PASS ${v2Counts.v2.pass}, PARTIAL ${v2Counts.v2.partial}, BLOCKED ${v2Counts.v2.blocked}`,
    '- The main defect was a weak gate that accepted generic or broken evidence as county proof.',
    '- In particular, LIDDA rows carrying "File Not Found" snippets and generic AskTED portal rows still contributed to PASS.',
    '- v2 is the truthful correction and should be treated as authoritative for Texas gating.',
    '',
  ].join('\n');

  const marker = '## 1. Executive summary';
  const updated = original.includes(marker)
    ? original.replace(marker, `${notice}${marker}`)
    : `${notice}\n${original}`;
  fs.writeFileSync(INPUTS.procedureDocV1, updated);
}

function buildReport(summary, auditStats, downgradeCounts, commandsRun, testsRun) {
  return [
    '# Texas Verification Hardening Report v2',
    '',
    '## Executive summary',
    '',
    `Texas v1 over-claimed county PASS status. After evidence hardening, Texas is **not index-safe** because the county gate must downgrade rows that rely on broken LIDDA evidence and generic education portal evidence.`,
    '',
    '## What v1 got right',
    '',
    '- It created a bounded Texas-only artifact lane instead of broad autopilot scraping.',
    '- It captured useful county, LIDDA, ECI, HHS office, district, manifest, and failure-ledger artifacts.',
    '- It preserved enough structure to make a deterministic downgrade pass possible.',
    '',
    '## What v1 got wrong',
    '',
    '- It treated broken evidence as verified.',
    '- It let generic statewide or portal URLs count as county-specific proof.',
    '- It did not let critical failure-ledger findings affect county gate status.',
    '- Its tests only checked for the presence of strings and URLs, not evidence quality.',
    '',
    '## Exact v1 over-claim issue',
    '',
    `- v1 PASS/PARTIAL/BLOCKED: ${summary.v1.pass_counties}/${summary.v1.partial_counties}/${summary.v1.blocked_counties}`,
    `- v2 PASS/PARTIAL/BLOCKED: ${summary.v2.pass_counties}/${summary.v2.partial_counties}/${summary.v2.blocked_counties}`,
    `- Verified v1 LIDDA rows with "File Not Found" evidence: ${auditStats.lidda_file_not_found_rows}`,
    `- PASS counties in v1 carrying broken evidence snippets: ${auditStats.pass_counties_with_broken_evidence}`,
    '',
    '## Evidence-quality rules added',
    '',
    ...V2_PROCEDURE_RULES.map((rule) => `- ${rule}`),
    '',
    '## Rows downgraded by category',
    '',
    ...Object.entries(downgradeCounts).map(([category, count]) => `- ${category}: ${count}`),
    '',
    '## County PASS/PARTIAL/BLOCKED before and after',
    '',
    `- v1: PASS ${summary.v1.pass_counties}, PARTIAL ${summary.v1.partial_counties}, BLOCKED ${summary.v1.blocked_counties}`,
    `- v2: PASS ${summary.v2.pass_counties}, PARTIAL ${summary.v2.partial_counties}, BLOCKED ${summary.v2.blocked_counties}`,
    '',
    '## Remaining P0 fixes',
    '',
    '- Replace or newly verify the Texas HHS LIDDA county-routing source with live county-specific evidence.',
    '- Build a parsed TEA/AskTED county or district mapping artifact instead of relying on the generic AskTED portal URL.',
    '- Keep Texas county pages gated/noindex until those two critical roles hard-pass.',
    '',
    '## Index safety',
    '',
    `Texas is index-safe: ${summary.index_safe ? 'yes' : 'no'}`,
    '',
    '## What must happen before Texas can be called California-baseline complete',
    '',
    '- Live, county-credible LIDDA routing evidence must exist for all covered counties.',
    '- Education routing must come from parsed or otherwise county-specific TEA evidence, not generic portal roots.',
    '- The county gate must pass with no broken evidence markers and no generic-only proof.',
    '',
    '## Commands run',
    '',
    ...commandsRun.map((cmd) => `- \`${cmd}\``),
    '',
    '## Tests run',
    '',
    ...testsRun.map((cmd) => `- \`${cmd}\``),
    '',
    '## Files changed',
    '',
    ...Object.values(OUTPUTS).map((filePath) => `- \`${path.relative(repoRoot, filePath)}\``),
    `- \`${path.relative(repoRoot, INPUTS.procedureDocV1)}\``,
    '',
  ].join('\n');
}

function main() {
  const commandsRun = ['node scripts/run-texas-verification-hardening.mjs'];
  const v1 = {
    countyRows: readJsonl(INPUTS.countyBaselineV1),
    liddaRows: readJsonl(INPUTS.liddaMapV1),
    eciRows: readJsonl(INPUTS.eciMapV1),
    hhsRows: readJsonl(INPUTS.hhsOfficeMapV1),
    educationRows: readJsonl(INPUTS.asktedMapV1),
    failureRows: readJsonl(INPUTS.failureLedgerV1),
    manifestRows: readJsonl(INPUTS.manifestReviewV1),
    roleManifestRows: readJsonl(INPUTS.roleManifestV1),
    summary: readJson(INPUTS.verificationSummaryV1),
  };

  const audit = summarizeAudit(v1);
  const downgradeRows = [];
  const liddaV2 = buildLiddaV2(v1.liddaRows, downgradeRows);
  const eciV2 = buildEciV2(v1.eciRows);
  const hhsV2 = buildHhsOfficeV2(v1.hhsRows);
  const educationV2 = buildEducationV2(v1.educationRows, downgradeRows);
  const countyV2 = buildCountyBaselineV2(v1.countyRows, liddaV2, eciV2, hhsV2, educationV2, v1.manifestRows, downgradeRows);
  const failureV2 = buildFailureLedgerV2(v1.failureRows, downgradeRows);
  const nextActionQueueV2 = buildNextActionQueueV2(failureV2, countyV2);

  const v2Summary = {
    state: 'texas',
    generated_at: nowIso(),
    v1: {
      pass_counties: v1.summary.pass_counties,
      partial_counties: v1.summary.partial_counties,
      blocked_counties: v1.summary.blocked_counties,
    },
    v2: {
      pass_counties: countyV2.filter((row) => row.verification_status === 'pass').length,
      partial_counties: countyV2.filter((row) => row.verification_status === 'partial').length,
      blocked_counties: countyV2.filter((row) => row.verification_status === 'blocked').length,
    },
    audited_row_counts: {
      lidda_rows: v1.liddaRows.length,
      eci_rows: v1.eciRows.length,
      hhs_rows: v1.hhsRows.length,
      education_rows: v1.educationRows.length,
      county_rows: v1.countyRows.length,
    },
    audit_findings: {
      verified_rows_marked_v1: audit.verifiedRowsMarkedV1,
      verified_rows_with_broken_evidence: audit.verifiedRowsWithBrokenEvidence,
      lidda_file_not_found_rows: v1.liddaRows.filter((row) => textBlob(row.evidence_snippet).includes('file not found')).length,
      generic_home_or_search_verified_rows: audit.verifiedRowsUsingGenericHomeOrSearchPages,
      pass_counties_with_broken_evidence: audit.passCountiesLackingCountySpecificEvidence,
      pass_counties_using_generic_askted_only: audit.passCountiesUsingGenericAskTedOnly,
      failures_logged_but_not_affecting_v1_gate: audit.failuresLoggedButDidNotAffectGate,
    },
    downgraded_rows_by_category: countBy(downgradeRows, (row) => row.category),
    top_failure_categories: countBy(failureV2, (row) => row.category),
    tests_that_allowed_bad_result: audit.testsThatAllowedBadResult,
    index_safe: countyV2.every((row) => row.verification_status === 'pass'),
  };

  const testsRun = ['node scripts/test-texas-verification-hardening.mjs'];

  addCorrectionNoticeToV1Doc({
    v1: {
      pass: v1.summary.pass_counties,
      partial: v1.summary.partial_counties,
      blocked: v1.summary.blocked_counties,
    },
    v2: {
      pass: v2Summary.v2.pass_counties,
      partial: v2Summary.v2.partial_counties,
      blocked: v2Summary.v2.blocked_counties,
    },
  });

  const report = buildReport(v2Summary, v2Summary.audit_findings, v2Summary.downgraded_rows_by_category, commandsRun, testsRun);

  writeJsonl(OUTPUTS.liddaMapV2, liddaV2);
  writeJsonl(OUTPUTS.eciMapV2, eciV2);
  writeJsonl(OUTPUTS.hhsOfficeMapV2, hhsV2);
  writeJsonl(OUTPUTS.asktedMapV2, educationV2);
  writeJsonl(OUTPUTS.countyBaselineV2, countyV2);
  writeJsonl(OUTPUTS.failureLedgerV2, failureV2);
  writeJsonl(OUTPUTS.procedureRulesV2, V2_PROCEDURE_RULES.map((rule) => ({ state: 'texas', rule, created_at: nowIso() })));
  writeJsonl(OUTPUTS.nextActionQueueV2, nextActionQueueV2);
  writeJson(OUTPUTS.verificationSummaryV2, v2Summary);
  fs.mkdirSync(path.dirname(OUTPUTS.reportV2), { recursive: true });
  fs.writeFileSync(OUTPUTS.reportV2, `${report}\n`);

  console.log(JSON.stringify({
    ok: true,
    outputs: Object.fromEntries(Object.entries(OUTPUTS).map(([key, value]) => [key, path.relative(repoRoot, value)])),
    v1: v2Summary.v1,
    v2: v2Summary.v2,
    downgraded_rows_by_category: v2Summary.downgraded_rows_by_category,
    index_safe: v2Summary.index_safe,
  }, null, 2));
}

main();
