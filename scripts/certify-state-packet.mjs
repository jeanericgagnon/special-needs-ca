import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const LOCAL_FAMILIES = new Set([
  'district_or_county_education_routing',
  'county_local_disability_resources',
]);

const KNOWN_BAD_PATTERNS = {
  statewideRoster: /(district websites?|website roster|school districts page|public local education agencies|district roster|directory reports?|district inventory|find contact information)/i,
  providerAddressOnly: /(provider organizations?|provider list|licensed dd service providers?|local mailing addresses?|mailing addresses and phone numbers|local addresses and phone numbers)/i,
  genericDistrictRoot: /(generic district root|district homepage|district root rather than a reviewed special-education leaf|inventory page)/i,
  sitemapOnly: /(sitemap\.xml|sitemap[- ]discovered|official sitemap also publishes)/i,
  blockedLane: /(access denied|forbidden|page not found|request rejected|unresolvable|dns resolution|challenge|cloudflare|blocked shell)/i,
  explicitCoverage: /(all \d+ count(?:ies|y)|all counties|every county|county-to-|counties served|by county|service area|service-area|regional offices?|region 1 through region \d+|county-filtered|county listings|district-specific pages|city\/town lookup|city-to-office|town-to-office|municipality lookup|municipal lookup|every city and town|all rhode island cities and towns)/i,
};

function parseArgs(argv) {
  const out = {
    state: null,
    candidateBranch: null,
    liveProbe: true,
  };
  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--state=')) out.state = arg.split('=')[1];
    else if (arg.startsWith('--candidate-branch=')) out.candidateBranch = arg.split('=')[1];
    else if (arg === '--no-live-probe') out.liveProbe = false;
    else if (arg === '--live-probe') out.liveProbe = true;
  }
  return out;
}

function readJson(relativePath, branch = null) {
  return JSON.parse(readText(relativePath, branch));
}

function readJsonl(relativePath, branch = null) {
  const text = readText(relativePath, branch).trim();
  return text ? text.split('\n').filter(Boolean).map((line) => JSON.parse(line)) : [];
}

function readText(relativePath, branch = null) {
  if (!branch) {
    return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
  }
  return execFileSync('git', ['show', `${branch}:${relativePath}`], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

function branchFileExists(relativePath, branch) {
  try {
    execFileSync('git', ['cat-file', '-e', `${branch}:${relativePath}`], { cwd: repoRoot });
    return true;
  } catch {
    return false;
  }
}

function listBranchFiles(branch, dir = 'scripts') {
  return execFileSync('git', ['ls-tree', '-r', '--name-only', branch, dir], {
    cwd: repoRoot,
    encoding: 'utf8',
  }).split('\n').filter(Boolean);
}

function slugToTitle(slug) {
  return slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeJson(filePath, value) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(filePath, value) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, value);
}

function addFailure(failures, code, family, filesChecked, reason, suggestedRepairClass, details = {}) {
  failures.push({
    code,
    family,
    filesChecked,
    reason,
    suggestedRepairClass,
    ...details,
  });
}

function familyRowsByName(rows) {
  return new Map(rows.map((row) => [row.family, row]));
}

function getStatePaths(state) {
  return {
    summary: `data/generated/${state}_california_grade_summary_v2.json`,
    gap: `data/generated/${state}_gap_matrix_v2.jsonl`,
    failure: `data/generated/${state}_failure_ledger_v2.jsonl`,
    verified: `data/generated/${state}_verified_sources_v1.jsonl`,
    next: `data/generated/${state}_next_action_queue_v2.jsonl`,
    report: `docs/generated/${state}-california-grade-audit-report-v2.md`,
  };
}

function collectStateTests(state, branch = null) {
  const files = branch ? listBranchFiles(branch, 'scripts') : fs.readdirSync(path.join(repoRoot, 'scripts')).map((name) => `scripts/${name}`);
  return files.filter((file) => file.includes(state) && path.basename(file).startsWith('test-'));
}

function readBranchOrWorkingFile(relativePath, branch = null) {
  return branch ? readText(relativePath, branch) : fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function analyzeTestQuality(state, branch, failures) {
  const tests = collectStateTests(state, branch);
  if (!tests.length) {
    addFailure(
      failures,
      'missing_state_specific_tests',
      null,
      ['scripts/*'],
      `No state-specific test file was found for ${state}.`,
      'add_state_test'
    );
    return;
  }

  for (const file of tests) {
    const text = readBranchOrWorkingFile(file, branch);
    const hasCompletionAsserts = /classification.*COMPLETE|index_safe.*true|completeness_pct.*100/s.test(text);
    const hasEvidenceAssertions = /source_url|evidence_snippet|status_reason|sample_count|failureRows|verifiedRows/.test(text);
    const hasCoverageAssertions = /county|district|region|service area|service-area|counties served|listings|mapping/i.test(text);
    if (hasCompletionAsserts && !hasEvidenceAssertions) {
      addFailure(
        failures,
        'test_only_asserts_complete_fields',
        null,
        [file],
        `State-specific test ${file} asserts completion fields without inspecting evidence rows or snippets.`,
        'strengthen_test_contract'
      );
    }
    if (hasCompletionAsserts && !hasCoverageAssertions) {
      addFailure(
        failures,
        'test_missing_geography_coverage_assertions',
        null,
        [file],
        `State-specific test ${file} does not assert explicit geography coverage or mapping behavior.`,
        'add_geography_coverage_assertions'
      );
    }
  }
}

function textForRow(row) {
  const parts = [
    row?.status_reason,
    row?.query_basis,
    row?.blocker_evidence,
    ...(row?.samples || []).flatMap((sample) => [
      sample.sample_name,
      sample.source_url,
      sample.final_url,
      sample.source_type,
      sample.verification_status,
      sample.evidence_snippet,
    ]),
  ].filter(Boolean);
  return parts.join(' ');
}

function runFamilyConsistencyChecks(summary, gapRows, failureRows, verifiedRows, nextRows, paths, failures) {
  const gapByFamily = familyRowsByName(gapRows);
  const failureByFamily = familyRowsByName(failureRows);
  const verifiedByFamily = familyRowsByName(verifiedRows);
  const nextByFamily = familyRowsByName(nextRows);

  if (summary.classification === 'COMPLETE') {
    if (summary.index_safe !== true || summary.completeness_pct !== 100) {
      addFailure(
        failures,
        'complete_summary_missing_required_flags',
        null,
        [paths.summary],
        'Candidate claims COMPLETE but summary is missing index_safe=true or completeness_pct=100.',
        'fix_summary_contract'
      );
    }
    if ((summary.critical_gap_families || []).length || (summary.major_gap_families || []).length) {
      addFailure(
        failures,
        'complete_summary_still_has_gap_families',
        null,
        [paths.summary],
        'Candidate claims COMPLETE but summary still contains critical or major gap families.',
        'fix_gap_summary'
      );
    }
    if ((summary.final_blockers && summary.final_blockers.length) || failureRows.length || nextRows.length) {
      addFailure(
        failures,
        'complete_candidate_still_has_failures_or_blockers',
        null,
        [paths.summary, paths.failure, paths.next],
        'Candidate claims COMPLETE but still has a failure ledger, next-action queue, or final blockers.',
        'fix_failure_clearance'
      );
    }
  } else {
    addFailure(
      failures,
      'not_completion_candidate',
      null,
      [paths.summary],
      `Candidate classification is ${summary.classification}, not COMPLETE.`,
      'keep_blocked_or_repair_more'
    );
  }

  for (const gapRow of gapRows) {
    const family = gapRow.family;
    const verifiedRow = verifiedByFamily.get(family);
    const failureRow = failureByFamily.get(family);
    const nextRow = nextByFamily.get(family);
    const gapVerified = typeof gapRow.family_status === 'string' && gapRow.family_status.startsWith('verified');

    if (gapVerified && verifiedRow && typeof verifiedRow.family_status === 'string' && !verifiedRow.family_status.startsWith('verified')) {
      addFailure(
        failures,
        'family_status_mismatch_verified_vs_verified_sources',
        family,
        [paths.gap, paths.verified],
        `Gap matrix marks ${family} verified but verified-sources row does not.`,
        'align_family_rows'
      );
    }

    if (gapVerified && (failureRow || nextRow)) {
      addFailure(
        failures,
        'verified_family_still_has_failure_or_next_action',
        family,
        [paths.gap, paths.failure, paths.next],
        `Family ${family} is marked verified while still present in the failure ledger or next-action queue.`,
        'remove_false_clearance'
      );
    }

    if (!gapVerified && summary.classification === 'COMPLETE') {
      addFailure(
        failures,
        'complete_candidate_contains_non_verified_family',
        family,
        [paths.gap],
        `Candidate claims COMPLETE but ${family} is still ${gapRow.family_status}.`,
        'do_not_claim_complete'
      );
    }
  }
}

function runLocalEvidenceChecks(summary, gapRows, verifiedRows, paths, failures) {
  const countyCount = summary.county_count || summary.countyCount || null;
  for (const row of verifiedRows) {
    if (!LOCAL_FAMILIES.has(row.family)) continue;
    if (!String(row.family_status || '').startsWith('verified')) continue;

    const text = textForRow(row);
    const filesChecked = [paths.verified, paths.gap];

    if (KNOWN_BAD_PATTERNS.statewideRoster.test(text) && !KNOWN_BAD_PATTERNS.explicitCoverage.test(text)) {
      addFailure(
        failures,
        'statewide_roster_used_as_local_routing',
        row.family,
        filesChecked,
        `${row.family} relies on a statewide roster, website list, or directory inventory without an explicit local routing contract.`,
        'find_local_routing_contract'
      );
    }

    if (KNOWN_BAD_PATTERNS.providerAddressOnly.test(text) && !/(counties served|service area|service-area|by county|county-to-office|county listings|county-filtered)/i.test(text)) {
      addFailure(
        failures,
        'provider_address_without_service_area_proof',
        row.family,
        filesChecked,
        `${row.family} relies on provider addresses or provider lists without explicit served-area or county-routing proof.`,
        'find_service_area_contract'
      );
    }

    if (KNOWN_BAD_PATTERNS.genericDistrictRoot.test(text)) {
      addFailure(
        failures,
        'generic_district_root_used_as_special_ed_routing',
        row.family,
        filesChecked,
        `${row.family} still includes generic district roots or homepages as routing proof.`,
        'verify_exact_district_leaf'
      );
    }

    if (KNOWN_BAD_PATTERNS.sitemapOnly.test(text)) {
      addFailure(
        failures,
        'sitemap_only_or_directory_only_leaf_used',
        row.family,
        filesChecked,
        `${row.family} relies on sitemap-only or directory-only leaf discovery instead of reviewed exact leaf proof.`,
        'verify_exact_leaf'
      );
    }

    if (countyCount && (!KNOWN_BAD_PATTERNS.explicitCoverage.test(text) || (row.sample_count || 0) < Math.min(5, countyCount))) {
      addFailure(
        failures,
        'missing_explicit_geography_mappings',
        row.family,
        filesChecked,
        `${row.family} does not preserve an explicit geography mapping contract sufficient to justify complete local coverage.`,
        'add_county_district_region_mapping',
        { expectedCoverage: countyCount, observedSamples: row.sample_count || 0 }
      );
    }
  }
}

function runSourceValidityChecks(verifiedRows, paths, failures) {
  for (const row of verifiedRows) {
    if (!String(row.family_status || '').startsWith('verified')) continue;
    const badSamples = (row.samples || []).filter((sample) => {
      const text = [
        sample.verification_status,
        sample.source_type,
        sample.evidence_snippet,
      ].filter(Boolean).join(' ');
      return KNOWN_BAD_PATTERNS.blockedLane.test(text);
    });
    if (badSamples.length) {
      addFailure(
        failures,
        'verified_family_uses_blocked_or_stale_proof_lane',
        row.family,
        [paths.verified],
        `${row.family} is marked verified even though ${badSamples.length} saved sample(s) are blocked, stale, dead, or challenged.`,
        'remove_stale_verified_lane',
        {
          offendingSamples: badSamples.map((sample) => sample.sample_name || sample.source_url),
        }
      );
    }
  }
}

async function probeUrl(url, timeoutMs = 15000, redirectsRemaining = 4) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https:') ? https : http;
    const req = lib.request(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 Ablefull certification gate' },
    }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsRemaining > 0) {
        const redirectedUrl = new URL(res.headers.location, url).toString();
        res.resume();
        probeUrl(redirectedUrl, timeoutMs, redirectsRemaining - 1).then((redirected) => {
          resolve({
            ...redirected,
            redirectFrom: url,
          });
        });
        return;
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        if (data.length < 300) data += chunk;
      });
      res.on('end', () => resolve({
        url,
        status: res.statusCode,
        contentType: res.headers['content-type'] || '',
        snippet: data.replace(/\s+/g, ' ').slice(0, 220),
      }));
    });
    req.on('error', (error) => resolve({ url, error: error.message }));
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error('timeout'));
    });
    req.end();
  });
}

async function runLiveProbeChecks(verifiedRows, failures, paths) {
  const probeTargets = [];
  for (const row of verifiedRows) {
    if (!String(row.family_status || '').startsWith('verified')) continue;
    if (!LOCAL_FAMILIES.has(row.family) && row.family !== 'special_education_idea_part_b') continue;
    for (const sample of row.samples || []) {
      if (sample?.source_url && /^https?:\/\//.test(sample.source_url)) {
        probeTargets.push({ family: row.family, url: sample.source_url });
      }
    }
  }
  const deduped = [];
  const seen = new Set();
  for (const row of probeTargets) {
    const key = `${row.family}|${row.url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(row);
  }
  for (const target of deduped.slice(0, 12)) {
    // bounded
    // eslint-disable-next-line no-await-in-loop
      const result = await probeUrl(target.url);
      const bad = result.error || (result.status && result.status >= 400) || KNOWN_BAD_PATTERNS.blockedLane.test(result.snippet || '');
    if (bad) {
      addFailure(
        failures,
        'live_probe_rejects_claimed_official_proof_lane',
        target.family,
        [paths.verified],
        `${target.family} includes a claimed proof URL that failed live probe: ${target.url} -> ${result.error || result.status}.`,
        'recheck_live_official_source',
        { liveProbe: result }
      );
    }
  }
}

function buildMarkdown(result) {
  const lines = [
    `# State Certification: ${slugToTitle(result.state)}`,
    '',
    `- candidate_branch: ${result.candidateBranch || 'current-worktree'}`,
    `- pass: ${result.pass ? 'true' : 'false'}`,
    `- state_classification: ${result.summary.classification}`,
    `- index_safe: ${String(result.summary.index_safe)}`,
    `- completeness_pct: ${result.summary.completeness_pct}`,
    `- checked_files: ${result.filesChecked.join(', ')}`,
    '',
    '## Result',
    '',
    result.pass
      ? '- Candidate passed all implemented certification checks.'
      : `- Candidate failed ${result.failures.length} certification check(s).`,
    '',
    '## Failures',
    '',
  ];
  if (!result.failures.length) {
    lines.push('- none');
  } else {
    for (const failure of result.failures) {
      lines.push(`- \`${failure.code}\`${failure.family ? ` [${failure.family}]` : ''}: ${failure.reason}`);
      lines.push(`  files: ${failure.filesChecked.join(', ')}`);
      lines.push(`  suggested_repair_class: ${failure.suggestedRepairClass}`);
    }
  }
  lines.push('', '## Family Snapshot', '');
  for (const row of result.gapRows) {
    lines.push(`- ${row.family}: ${row.family_status}`);
  }
  return `${lines.join('\n')}\n`;
}

export async function certifyStatePacket({ state, candidateBranch = null, liveProbe = true }) {
  if (!state) throw new Error('Missing required --state');
  const paths = getStatePaths(state);
  const filesChecked = Object.values(paths);

  const summary = readJson(paths.summary, candidateBranch);
  const gapRows = readJsonl(paths.gap, candidateBranch);
  const failureRows = readJsonl(paths.failure, candidateBranch);
  const verifiedRows = readJsonl(paths.verified, candidateBranch);
  const nextRows = readJsonl(paths.next, candidateBranch);

  const failures = [];

  runFamilyConsistencyChecks(summary, gapRows, failureRows, verifiedRows, nextRows, paths, failures);
  runLocalEvidenceChecks(summary, gapRows, verifiedRows, paths, failures);
  runSourceValidityChecks(verifiedRows, paths, failures);
  analyzeTestQuality(state, candidateBranch, failures);
  if (liveProbe) {
    await runLiveProbeChecks(verifiedRows, failures, paths);
  }

  const result = {
    state,
    candidateBranch,
    pass: failures.length === 0,
    summary,
    gapRows,
    filesChecked,
    failures,
    checkedAt: new Date().toISOString(),
    liveProbeEnabled: liveProbe,
  };

  const jsonPath = path.join(generatedDir, 'state-certification', `${state}.json`);
  const mdPath = path.join(docsGeneratedDir, `state-certification-${state}.md`);
  writeJson(jsonPath, result);
  writeText(mdPath, buildMarkdown(result));
  return { result, jsonPath, mdPath };
}

async function main() {
  const args = parseArgs(process.argv);
  const { result, jsonPath, mdPath } = await certifyStatePacket(args);
  process.stdout.write(JSON.stringify({
    state: result.state,
    pass: result.pass,
    failureCount: result.failures.length,
    jsonPath: path.relative(repoRoot, jsonPath),
    mdPath: path.relative(repoRoot, mdPath),
  }, null, 2) + '\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
