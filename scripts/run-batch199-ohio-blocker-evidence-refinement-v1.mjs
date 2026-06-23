import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const queuePath = path.join(generatedDir, 'all_state_priority_queue_v3.jsonl');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const INPUTS = {
  summary: path.join(generatedDir, 'ohio_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'ohio_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'ohio_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'ohio_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'ohio_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'ohio-california-grade-audit-report-v2.md'),
  districtPacket: path.join(generatedDir, 'ohio_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'ohio_county_local_disability_resources_leaf_authoring_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  queue: queuePath,
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch199_ohio_blocker_evidence_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch199-ohio-blocker-evidence-refinement-report-v1.md'),
};

const COUNTY_PROBE_RESULTS = [
  { url: 'https://jfs.ohio.gov/home/local-agencies-directory', status: 404, title: '404 Error Page' },
  { url: 'https://jfs.ohio.gov/home/local-agencies-directory/', status: 404, title: '404 Error Page' },
  { url: 'https://medicaid.ohio.gov/families-and-individuals/county-agencies', status: 404, title: '404 Error Page' },
  { url: 'https://medicaid.ohio.gov/families-and-individuals/county-agencies/', status: 404, title: '404 Error Page' },
  { url: 'https://medicaid.ohio.gov/resources/county-agencies', status: 404, title: '404 Error Page' },
  { url: 'https://medicaid.ohio.gov/resources/county-agencies/', status: 404, title: '404 Error Page' },
  { url: 'https://ohio.gov/residents/resources/job-family-services-directory', status: 404, title: '404 Error Page' },
  { url: 'https://ohio.gov/residents/resources/job-family-services-directory/', status: 404, title: '404 Error Page' },
];

const LESSON_HEADING =
  '### Probe Obvious State Successor Paths Before Reopening A Dead County Directory Family';
const LESSON_BODY =
  '*   **Lesson:** If a county-office family looks retired on its legacy domain, probe the obvious state-root and program-root successor paths once before reopening discovery. Ohio stayed blocked only after the legacy JFS paths, the guessed `home/local-agencies-directory` child, Medicaid-host county-agency guesses, and an Ohio.gov resident-resource guess all returned the same 404 shell.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function computeEducationMetrics() {
  const db = new Database(dbPath, { readonly: true });
  try {
    const rows = db.prepare(`
      select county_id, source_url
      from school_districts
      where county_id like '%-oh'
        and source_url is not null
        and trim(source_url) <> ''
    `).all();

    const urlToCounties = new Map();
    for (const row of rows) {
      const url = String(row.source_url || '').trim();
      if (!url) continue;
      const hostnameAndPath = url.split('://', 2).at(-1) || '';
      const slashIndex = hostnameAndPath.indexOf('/');
      const pathPart = slashIndex >= 0 ? hostnameAndPath.slice(slashIndex + 1).replace(/^\/+|\/+$/g, '') : '';
      const isLeafish = pathPart.length > 0;
      if (!urlToCounties.has(url)) {
        urlToCounties.set(url, { isLeafish, counties: new Set() });
      }
      urlToCounties.get(url).counties.add(row.county_id);
    }

    let leafishUrlCount = 0;
    let rootOnlyUrlCount = 0;
    let leafishCountyCoverage = 0;
    const leafishExamples = [];
    for (const [url, info] of urlToCounties.entries()) {
      if (info.isLeafish) {
        leafishUrlCount += 1;
        leafishCountyCoverage += info.counties.size;
        leafishExamples.push({
          source_url: url,
          county_count: info.counties.size,
          counties: [...info.counties].sort(),
        });
      } else {
        rootOnlyUrlCount += 1;
      }
    }

    leafishExamples.sort((a, b) => b.county_count - a.county_count || a.source_url.localeCompare(b.source_url));
    return {
      leafishUrlCount,
      leafishCountyCoverage,
      rootOnlyUrlCount,
      leafishExamples,
    };
  } finally {
    db.close();
  }
}

function buildCountyEvidence() {
  const probeList = COUNTY_PROBE_RESULTS.map((entry) => `${entry.url} => HTTP ${entry.status}`).join('; ');
  return `Reviewed 2026-06-23 bounded live official successor-path checks after the earlier JFS retirement finding. Legacy and guessed successor pages all resolved to the same dead family: ${probeList}. This adds eight more 404 confirmations on top of the prior jfs.ohio.gov root/sitemap/robots and NXDOMAIN checks for odjfs.ohio.gov and jobandfamilyservices.ohio.gov, so the remaining DOI-hosted county dataset is still planning evidence only and no live official county-office directory or locator is verified.`;
}

function buildEducationEvidence(metrics) {
  const exampleDomains = metrics.leafishExamples
    .slice(0, 4)
    .map((entry) => entry.source_url)
    .join(', ');
  return `Reviewed 2026-06-23 Ohio school_district source inventory from disk. Only ${metrics.leafishUrlCount} distinct source URLs still preserve any path-level leaf signal, covering just ${metrics.leafishCountyCoverage} county rows total, while ${metrics.rootOnlyUrlCount} distinct URLs remain generic roots only. The leaf-like URLs are ${exampleDomains}; that is still not enough county-grade coverage to truthfully clear district_or_county_education_routing statewide.`;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows, metrics) {
  return [
    '# Ohio California-Grade Audit Report v2',
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
    '## Ohio final blocker decision',
    '',
    `- County-local disability resources remain blocked because the retired Ohio JFS family still has no live official successor: the legacy root/path failures remain in place, ` +
      `the guessed JFS child locator path now also returns 404, the guessed Medicaid-host county-agency paths return 404, and an Ohio.gov resident-resource guess also returns 404.`,
    `- District or county education routing remains blocked because only ${metrics.leafishUrlCount} distinct Ohio school-district source URLs on disk preserve path-level leaf signal, ` +
      `covering just ${metrics.leafishCountyCoverage} county rows, while ${metrics.rootOnlyUrlCount} distinct URLs remain root-only.`,
    '- Ohio is still truthfully BLOCKED and not index-safe.',
  ].join('\n') + '\n';
}

export function generateBatch199OhioBlockerEvidenceRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const districtPacket = readJson(INPUTS.districtPacket);
  const countyPacket = readJson(INPUTS.countyPacket);
  const queueRows = readJsonl(INPUTS.queue);
  const metrics = computeEducationMetrics();

  const countyEvidence = buildCountyEvidence();
  const educationEvidence = buildEducationEvidence(metrics);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: 'retired_official_county_family_no_live_successor_and_education_inventory_still_root_only',
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_retired_official_county_family',
        status_reason: 'The retired Ohio JFS county-office family still has no live official successor on the legacy JFS host, guessed JFS child locator path, Medicaid-host guesses, or Ohio.gov resident-resource guess.',
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_leaf_inventory_still_root_only',
        status_reason: `Only ${metrics.leafishUrlCount} distinct Ohio school-district source URLs on disk preserve path-level leaf signal, covering ${metrics.leafishCountyCoverage} county rows, while ${metrics.rootOnlyUrlCount} distinct URLs remain root-only.`,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: 'retired_official_county_family_no_live_successor_verified',
        evidence: countyEvidence,
        next_action: 'hold_blocked_until_new_live_official_ohio_county_directory_or_locator_is_verified',
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'education_inventory_still_mostly_root_only_after_bounded_leaf_review',
        evidence: educationEvidence,
        next_action: 'hold_blocked_until_more_exact_district_or_esc_leaf_targets_are_authored',
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_retired_official_county_family',
        query_basis: 'Reviewed bounded live official JFS, Medicaid, and Ohio.gov successor-path checks for the Ohio county-office family.',
        blocker_code: 'retired_official_county_family_no_live_successor_verified',
        blocker_evidence: countyEvidence,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_leaf_inventory_still_root_only',
        query_basis: 'Reviewed Ohio school_district source_url inventory plus previously verified ESC-owned exact leaves.',
        blocker_code: 'education_inventory_still_mostly_root_only_after_bounded_leaf_review',
        blocker_evidence: educationEvidence,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: 'retired_official_county_family_no_live_successor_verified',
        evidence: countyEvidence,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'education_inventory_still_mostly_root_only_after_bounded_leaf_review',
        next_action: 'hold_blocked_until_more_exact_district_or_esc_leaf_targets_are_authored',
        evidence: educationEvidence,
      };
    }
    return row;
  });

  const updatedDistrictPacket = {
    ...districtPacket,
    current_problem_metrics: {
      ...districtPacket.current_problem_metrics,
      distinctLeafishSourceUrlCount: metrics.leafishUrlCount,
      leafishCountyCoverage: metrics.leafishCountyCoverage,
      distinctRootOnlySourceUrlCount: metrics.rootOnlyUrlCount,
    },
    reviewed_leafish_source_urls: metrics.leafishExamples,
    packet_complete_when: 'More county-grade or ESC-owned exact leaf targets are authored beyond the small set of path-level URLs already present on disk.',
  };

  const updatedCountyPacket = {
    ...countyPacket,
    current_problem_metrics: {
      ...countyPacket.current_problem_metrics,
      reviewedOfficialSuccessor404Count: COUNTY_PROBE_RESULTS.length,
      successorDomainsStillMissingLiveDirectory: 4,
    },
    reviewed_successor_probes: COUNTY_PROBE_RESULTS,
    packet_complete_when: 'A new live official Ohio county-office directory or locator is verified on a real state or county host.',
  };

  const updatedQueueRows = queueRows.map((row) => row.state === 'ohio'
    ? {
        ...row,
        primary_gap_reason: updatedSummary.primary_gap_reason,
      }
    : row);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    batch: 'batch199_ohio_blocker_evidence_refinement_v1',
    state: 'ohio',
    classification_after: updatedSummary.classification,
    index_safe_after: updatedSummary.index_safe,
    county_successor_404_count: COUNTY_PROBE_RESULTS.length,
    education_leafish_url_count: metrics.leafishUrlCount,
    education_leafish_county_coverage: metrics.leafishCountyCoverage,
    education_root_only_url_count: metrics.rootOnlyUrlCount,
    lesson_added: lessonAdded,
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, metrics);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.districtPacket, updatedDistrictPacket);
  writeJson(INPUTS.countyPacket, updatedCountyPacket);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  fs.writeFileSync(INPUTS.report, report);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch199OhioBlockerEvidenceRefinementV1();
}
