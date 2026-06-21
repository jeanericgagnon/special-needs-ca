import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summaryV3: path.join(generatedDir, 'tx_verification_summary_v3.json'),
  countyV3: path.join(generatedDir, 'tx_county_baseline_v3.jsonl'),
  educationV3: path.join(generatedDir, 'tx_askted_district_map_v3.jsonl'),
  liddaV3: path.join(generatedDir, 'tx_lidda_county_map_v3.jsonl'),
  eciV3: path.join(generatedDir, 'tx_eci_county_map_v3.jsonl'),
  hhsV3: path.join(generatedDir, 'tx_hhs_office_map_v3.jsonl'),
};

const OUTPUTS = {
  summaryV4: path.join(generatedDir, 'tx_verification_summary_v4.json'),
  countyV4: path.join(generatedDir, 'tx_county_baseline_v4.jsonl'),
  educationV4: path.join(generatedDir, 'tx_askted_district_map_v4.jsonl'),
  failureV4: path.join(generatedDir, 'tx_failure_ledger_v4.jsonl'),
  nextActionV4: path.join(generatedDir, 'tx_next_action_queue_v4.jsonl'),
  reportV4: path.join(docsDir, 'tx-california-grade-repair-report-v4.md'),
};

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

function isStrictDistrictGrade(row) {
  if (!row) return false;
  return row.verification_status === 'verified'
    && row.evidence_quality === 'live_education_route'
    && row.district_type === 'district'
    && !String(row.district_id || '').startsWith('sd-fallback-');
}

function buildStrictEducationV4(educationV3, failures) {
  return educationV3.map((row) => {
    const strictVerified = isStrictDistrictGrade(row);
    const reasons = [...(row.verification_reasons || [])];
    if (!strictVerified) {
      if (String(row.district_id || '').startsWith('sd-fallback-')) reasons.push('education_fallback_not_district_grade');
      if (row.evidence_quality !== 'live_education_route') reasons.push('education_not_live_direct_district_route');
      if (row.district_type !== 'district') reasons.push('education_not_district_specific');
      failures.push({
        state: 'texas',
        county_slug: row.county_id,
        role_id: 'tx_askted_education_routing_strict_v4',
        status: 'downgraded',
        source_url: row.source_url,
        final_url: row.final_url,
        reason: reasons.join('; '),
        category: 'education_not_district_grade',
        evidence_excerpt: String(row.evidence_snippet || '').slice(0, 240),
        created_at: nowIso(),
        target_id: row.district_id,
      });
    }
    return {
      ...row,
      verification_status: strictVerified ? 'verified' : 'downgraded_unverified',
      verification_reasons: strictVerified ? [] : [...new Set(reasons)],
      evidence_quality: strictVerified ? 'live_direct_district_grade_route' : row.evidence_quality,
      district_grade_standard: strictVerified ? 'direct_live_district_page' : 'fallback_or_non_district_route',
    };
  });
}

function indexByCounty(rows) {
  return new Map(rows.map((row) => [row.county_slug || row.county_id, row]));
}

function buildCountyBaselineV4(countyV3, educationV4, failures) {
  const educationByCounty = indexByCounty(educationV4);
  return countyV3.map((row) => {
    const education = educationByCounty.get(row.county_slug) || null;
    const roleStatuses = {
      ...row.role_statuses,
      education: education?.verification_status === 'verified' ? 'verified' : 'downgraded_unverified',
    };
    const missingRoles = (row.missing_roles || []).filter((item) => item !== 'education routing');
    if (roleStatuses.education !== 'verified') {
      missingRoles.push('district-grade education routing');
    }

    const hasCore = roleStatuses.lidda === 'verified'
      && roleStatuses.eci === 'verified'
      && roleStatuses.medicaid_hhs === 'verified';
    const hasStatewide = roleStatuses.legal === 'verified'
      && roleStatuses.pti === 'verified'
      && roleStatuses.able === 'verified';

    let verificationStatus = 'pass';
    if (!hasCore) {
      verificationStatus = 'blocked';
    } else if (roleStatuses.education !== 'verified' || !hasStatewide) {
      verificationStatus = 'partial';
    }

    if (verificationStatus !== 'pass' && roleStatuses.education !== 'verified') {
      failures.push({
        state: 'texas',
        county_slug: row.county_slug,
        role_id: 'tx_county_gate_v4',
        status: verificationStatus,
        source_url: education?.source_url || '',
        final_url: education?.final_url || '',
        reason: 'county lacks direct district-grade education evidence',
        category: 'county_below_strict_district_grade',
        evidence_excerpt: String(education?.evidence_snippet || '').slice(0, 240),
        created_at: nowIso(),
        target_id: row.county_slug,
      });
    }

    return {
      ...row,
      education_routing: education?.district_name || row.education_routing,
      missing_roles: missingRoles,
      verification_status: verificationStatus,
      role_statuses: roleStatuses,
      source_urls: [...new Set([
        ...(row.source_urls || []),
        education?.source_url || '',
      ].filter(Boolean))],
      final_urls: [...new Set([
        ...(row.final_urls || []),
        education?.final_url || '',
      ].filter(Boolean))],
      fetched_at_values: [...new Set([
        ...(row.fetched_at_values || []),
        education?.fetched_at || '',
      ].filter(Boolean))],
      evidence_snippets: [...new Set([
        ...(row.evidence_snippets || []),
        education?.evidence_snippet || '',
      ].filter(Boolean))],
      strict_education_grade: education?.district_grade_standard || 'unknown',
    };
  });
}

function buildNextActionQueueV4(summary) {
  const actions = [];
  if (summary.v4.partial_counties > 0) {
    actions.push({
      action: 'Parse direct district-grade Texas education routes for remaining counties',
      why: `${summary.v4.partial_counties} counties still rely on ESC/TEA fallback rather than live district-grade evidence.`,
    });
  }
  if (!summary.index_safe) {
    actions.push({
      action: 'Keep Texas county pages gated and noindex',
      why: 'Texas is not California-grade under the stricter district-grade bar.',
    });
  }
  return actions;
}

function buildReport(summary, nextActions) {
  return [
    '# Texas California-Grade Repair Report v4',
    '',
    'This v4 pass keeps the hardened county gate and applies a stricter district-grade education rule: only direct, live district education evidence counts for PASS.',
    '',
    '## Result history',
    '',
    `- v1: PASS ${summary.v1.pass_counties}, PARTIAL ${summary.v1.partial_counties}, BLOCKED ${summary.v1.blocked_counties}`,
    `- v2: PASS ${summary.v2.pass_counties}, PARTIAL ${summary.v2.partial_counties}, BLOCKED ${summary.v2.blocked_counties}`,
    `- v3: PASS ${summary.v3.pass_counties}, PARTIAL ${summary.v3.partial_counties}, BLOCKED ${summary.v3.blocked_counties}`,
    `- v4: PASS ${summary.v4.pass_counties}, PARTIAL ${summary.v4.partial_counties}, BLOCKED ${summary.v4.blocked_counties}`,
    '',
    '## What changed in v4',
    '',
    '- Direct district-grade education evidence is now required for PASS.',
    '- ESC fallback, county fallback, and TEA fallback education rows no longer satisfy California-grade PASS.',
    '- LIDDA, ECI, HHS, statewide legal/PTI/ABLE evidence remains as repaired in v3.',
    '',
    '## Strict education breakdown',
    '',
    `- Direct live district-grade counties: ${summary.education_route_breakdown.direct_district_grade}`,
    `- Fallback or non-district education counties: ${summary.education_route_breakdown.fallback_or_non_district}`,
    '',
    '## County status',
    '',
    `- Counties still below California-grade: ${summary.counties_below_california_grade}`,
    `- Texas is index-safe: ${summary.index_safe ? 'yes' : 'no'}`,
    '',
    '## Exact next actions',
    '',
    ...nextActions.map((row) => `- ${row.action}: ${row.why}`),
    '',
    '## Standard applied',
    '',
    '- PASS requires verified LIDDA, verified ECI, verified Medicaid/HHS, statewide legal/PTI/ABLE, and a direct live district-grade education route.',
    '- PARTIAL means the official skeleton exists but the education layer is still fallback-grade.',
    '- BLOCKED is reserved for counties missing core official routing outside education fallback.',
  ].join('\n');
}

function main() {
  const summaryV3 = readJson(INPUTS.summaryV3);
  const countyV3 = readJsonl(INPUTS.countyV3);
  const educationV3 = readJsonl(INPUTS.educationV3);
  const liddaV3 = readJsonl(INPUTS.liddaV3);
  const eciV3 = readJsonl(INPUTS.eciV3);
  const hhsV3 = readJsonl(INPUTS.hhsV3);

  const failures = [];
  const educationV4 = buildStrictEducationV4(educationV3, failures);
  const countyV4 = buildCountyBaselineV4(countyV3, educationV4, failures);
  const nextActions = buildNextActionQueueV4({
    v4: {
      pass_counties: countyV4.filter((row) => row.verification_status === 'pass').length,
      partial_counties: countyV4.filter((row) => row.verification_status === 'partial').length,
      blocked_counties: countyV4.filter((row) => row.verification_status === 'blocked').length,
    },
    index_safe: countyV4.every((row) => row.verification_status === 'pass'),
    education_route_breakdown: {
      direct_district_grade: educationV4.filter((row) => row.verification_status === 'verified').length,
      fallback_or_non_district: educationV4.filter((row) => row.verification_status !== 'verified').length,
    },
    counties_below_california_grade: countyV4.filter((row) => row.verification_status !== 'pass').length,
  });

  const summary = {
    state: 'texas',
    generated_at: nowIso(),
    v1: summaryV3.v1,
    v2: summaryV3.v2,
    v3: summaryV3.v3,
    v4: {
      pass_counties: countyV4.filter((row) => row.verification_status === 'pass').length,
      partial_counties: countyV4.filter((row) => row.verification_status === 'partial').length,
      blocked_counties: countyV4.filter((row) => row.verification_status === 'blocked').length,
    },
    lidda_rows_verified_v3: liddaV3.filter((row) => row.verification_status === 'verified').length,
    eci_rows_verified_v3: eciV3.filter((row) => row.verification_status === 'verified').length,
    hhs_rows_verified_v3: hhsV3.filter((row) => row.verification_status === 'verified').length,
    education_route_breakdown: {
      direct_district_grade: educationV4.filter((row) => row.verification_status === 'verified').length,
      fallback_or_non_district: educationV4.filter((row) => row.verification_status !== 'verified').length,
    },
    counties_below_california_grade: countyV4.filter((row) => row.verification_status !== 'pass').length,
    index_safe: countyV4.every((row) => row.verification_status === 'pass'),
    strict_pass_county_examples: countyV4.filter((row) => row.verification_status === 'pass').slice(0, 15).map((row) => row.county_slug),
    direct_district_grade_counties: educationV4.filter((row) => row.verification_status === 'verified').map((row) => row.county_id),
    top_failure_categories: failures.reduce((acc, row) => {
      acc[row.category] = (acc[row.category] || 0) + 1;
      return acc;
    }, {}),
  };

  const report = buildReport(summary, nextActions);

  writeJsonl(OUTPUTS.educationV4, educationV4);
  writeJsonl(OUTPUTS.countyV4, countyV4);
  writeJsonl(OUTPUTS.failureV4, failures);
  writeJsonl(OUTPUTS.nextActionV4, nextActions);
  writeJson(OUTPUTS.summaryV4, summary);
  fs.mkdirSync(path.dirname(OUTPUTS.reportV4), { recursive: true });
  fs.writeFileSync(OUTPUTS.reportV4, `${report}\n`);

  console.log(JSON.stringify({
    ok: true,
    output_files: OUTPUTS,
    counts: summary.v4,
    index_safe: summary.index_safe,
  }, null, 2));
}

main();
