import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  buildNmControlPlane,
  discoverNmCandidates,
  buildNmScraperQueue,
  runNmScraperQueue,
  writeNmArtifacts,
} from './nm-low-token-source-acquisition-lib.mjs';

function makeTempRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ablefull-nm-low-token-'));
  fs.mkdirSync(path.join(root, 'data', 'generated'), { recursive: true });
  fs.mkdirSync(path.join(root, 'data', 'source_targets'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs', 'generated'), { recursive: true });
  return root;
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function mockFetch(map) {
  return async function fetchImpl(url) {
    const key = String(url);
    const entry = map[key];
    if (!entry) {
      throw new Error(`Unexpected fetch: ${key}`);
    }
    return {
      ok: entry.ok ?? true,
      status: entry.status ?? 200,
      url: entry.finalUrl ?? key,
      headers: {
        get(name) {
          return entry.headers?.[name.toLowerCase()] || entry.headers?.[name] || '';
        },
      },
      async text() {
        return entry.text ?? '';
      },
      async arrayBuffer() {
        return Buffer.from(entry.body ?? entry.text ?? '', 'utf8');
      },
      body: null,
    };
  };
}

function seedRepo(root) {
  writeJson(path.join(root, 'data', 'source_targets', 'new-mexico.json'), [
    { source_url: 'https://www.hca.nm.gov/developmental-disabilities-supports-division/', category: 'C. Developmental disability / DD / IDD services' },
    { source_url: 'https://www.hca.nm.gov/lookingforassistance/apply-for-benefits/', category: 'B. Medicaid / benefits / HHS' },
    { source_url: 'https://www.nmececd.org/family-infant-toddler-fit-program/', category: 'E. Early intervention' },
    { source_url: 'https://webnew.ped.state.nm.us/bureaus/special-education/', category: 'F. Special education / IEP' },
    { source_url: 'https://drnm.org/', category: 'H. Parent training / disability rights / legal aid' },
    { source_url: 'https://www.lawhelpnewmexico.org/', category: 'H. Parent training / disability rights / legal aid' },
  ]);
  writeJsonl(path.join(root, 'data', 'generated', 'state_source_unresolved_v2.jsonl'), [
    { state: 'New Mexico', missing_role: 'main_dd_agency', best_candidate_url: 'https://www.hca.nm.gov/developmental-disabilities-supports-division/' },
    { state: 'New Mexico', missing_role: 'medicaid_application', best_candidate_url: 'https://www.hca.nm.gov/lookingforassistance/apply-for-benefits/' },
  ]);
  writeJsonl(path.join(root, 'data', 'generated', 'state_source_candidates_v2.jsonl'), [
    { state: 'New Mexico', source_role: 'main_dd_agency', url: 'https://www.hca.nm.gov/developmental-disabilities-supports-division/', status: 'legacy_candidate' },
  ]);
}

async function testControlPlaneAndDiscovery() {
  const root = makeTempRepo();
  seedRepo(root);
  const { registryRows, roleRows } = buildNmControlPlane({
    repoRoot: root,
    dbPath: path.join(root, 'missing.db'),
  });

  assert.ok(registryRows.some((row) => row.agency === 'New Mexico Health Care Authority' && row.official_domains.includes('hca.nm.gov')));
  assert.ok(registryRows.some((row) => row.agency === 'Early intervention / Part C' && row.official_domains.includes('nmececd.org')));
  assert.ok(registryRows.some((row) => row.agency === 'Protection and Advocacy' && row.official_domains.includes('drnm.org')));
  assert.ok(roleRows.some((row) => row.role_id === 'main_dd_agency'));
  assert.equal(roleRows.filter((row) => row.role_id === 'main_dd_agency').length, 1);
  assert.ok(roleRows.every((row) => Array.isArray(row.allowed_domains)));

  const fetchImpl = mockFetch({
    'https://www.hca.nm.gov/developmental-disabilities-supports-division/': {
      text: `
        <html><head><title>Developmental Disabilities Supports Division</title></head>
        <body>
          <h1>Developmental Disabilities Supports Division</h1>
          <a href="/eligibility-determination/">Eligibility Determination</a>
          <a href="/developmental-disabilities-supports-division/">Apply for Services</a>
          <a href="/contact-us/">Contact Us</a>
        </body></html>`,
      headers: { 'content-type': 'text/html' },
    },
    'https://www.hca.nm.gov/lookingforassistance/apply-for-benefits/': {
      text: `
        <html><head><title>Apply For Benefits</title></head>
        <body>
          <h1>Apply For Benefits</h1>
          <a href="/lookingforassistance/apply-for-benefits/">Apply for Benefits</a>
          <a href="/lookingforassistance/">Medicaid Benefits</a>
        </body></html>`,
      headers: { 'content-type': 'text/html' },
    },
    'https://www.nmececd.org/family-infant-toddler-fit-program/': {
      text: `
        <html><head><title>Family Infant Toddler (FIT) Program</title></head>
        <body>
          <h1>Family Infant Toddler (FIT) Program</h1>
          <a href="/regional-office-map/">Regional Office Map</a>
          <a href="/family-infant-toddler-fit-program/">Make a Referral</a>
        </body></html>`,
      headers: { 'content-type': 'text/html' },
    },
    'https://webnew.ped.state.nm.us/bureaus/special-education/': {
      text: `
        <html><head><title>Special Education</title></head>
        <body>
          <a href="/bureaus/special-education/procedural-safeguards/">Procedural Safeguards</a>
        </body></html>`,
      headers: { 'content-type': 'text/html' },
    },
    'https://drnm.org/': {
      text: `
        <html><head><title>Disability Rights New Mexico</title></head>
        <body>
          <h1>Disability Rights New Mexico</h1>
          <a href="/get-help/">Get Help</a>
        </body></html>`,
      headers: { 'content-type': 'text/html' },
    },
    'https://ssa.gov/': { text: '<html><title>SSA</title><body><a href="/benefits/disability/apply-child.html">Apply for Child SSI</a></body></html>', headers: { 'content-type': 'text/html' }, finalUrl: 'https://www.ssa.gov/' },
    'https://www.ssa.gov/benefits/disability/apply-child.html': { text: '<html><title>Apply for Child SSI</title><body><h1>Apply for Child SSI</h1></body></html>', headers: { 'content-type': 'text/html' } },
    'https://ablenrc.org/': { text: '<html><title>ABLE NRC</title><body><a href="/state-review/new-mexico/">New Mexico ABLE</a></body></html>', headers: { 'content-type': 'text/html' }, finalUrl: 'https://www.ablenrc.org/' },
    'https://www.ablenrc.org/': { text: '<html><title>ABLE NRC</title><body><a href="/state-review/new-mexico/">New Mexico ABLE</a></body></html>', headers: { 'content-type': 'text/html' } },
    'https://www.lawhelpnewmexico.org/': { text: '<html><title>Law Help New Mexico</title><body><h1>Law Help New Mexico</h1></body></html>', headers: { 'content-type': 'text/html' } },
  });

  const candidates = await discoverNmCandidates({
    registryRows,
    roleRows,
    options: { delayMs: 0, requestTimeoutMs: 5000, maxCandidatesPerRole: 3 },
    fetchImpl,
  });

  assert.ok(candidates.some((row) => row.role_id === 'main_dd_agency'));
  assert.ok(candidates.some((row) => row.role_id === 'medicaid_application' && row.candidate_url.includes('/apply-for-benefits')));
  assert.ok(candidates.some((row) => row.role_id === 'ei_part_c_program' && row.candidate_url.includes('/family-infant-toddler-fit-program/')));
  assert.ok(!candidates.some((row) => row.role_id === 'medicaid_application' && row.candidate_url === 'https://www.hca.nm.gov/'));
}

async function testQueueAndVerification() {
  const root = makeTempRepo();
  seedRepo(root);
  const { registryRows, roleRows } = buildNmControlPlane({
    repoRoot: root,
    dbPath: path.join(root, 'missing.db'),
  });

  const candidates = [
    {
      state: 'New Mexico',
      role_id: 'main_dd_agency',
      source_role: 'dd_routing',
      candidate_url: 'https://www.hca.nm.gov/developmental-disabilities-supports-division/',
      discovery_method: 'official_site_navigation',
      discovery_parent_url: 'https://www.hca.nm.gov/developmental-disabilities-supports-division/',
      link_text_or_sitemap_evidence: 'Developmental Disabilities Supports Division',
      responsible_agency: 'New Mexico Health Care Authority',
      allowed_domain_matched: 'hca.nm.gov',
      existed_in_old_repo: true,
      candidate_reason: 'seed',
      estimated_relevance: 'high',
    },
    {
      state: 'New Mexico',
      role_id: 'medicaid_grievances_appeals',
      source_role: 'programs_benefits',
      candidate_url: 'https://www.hca.nm.gov/lookingforassistance/apply-for-benefits/',
      discovery_method: 'official_site_navigation',
      discovery_parent_url: 'https://www.hca.nm.gov/lookingforassistance/apply-for-benefits/',
      link_text_or_sitemap_evidence: 'Eligibility',
      responsible_agency: 'New Mexico Human Services Department / Medicaid',
      allowed_domain_matched: 'hca.nm.gov',
      existed_in_old_repo: false,
      candidate_reason: 'bad cross-role candidate',
      estimated_relevance: 'high',
    },
    {
      state: 'New Mexico',
      role_id: 'special_education_due_process',
      source_role: 'education_routing',
      candidate_url: 'https://webnew.ped.state.nm.us/bureaus/special-education/due-process/',
      discovery_method: 'same_domain_index_links',
      discovery_parent_url: 'https://webnew.ped.state.nm.us/bureaus/special-education/',
      link_text_or_sitemap_evidence: 'Due Process',
      responsible_agency: 'New Mexico Public Education Department',
      allowed_domain_matched: 'webnew.ped.state.nm.us',
      existed_in_old_repo: false,
      candidate_reason: 'seed',
      estimated_relevance: 'high',
    },
  ];

  const queueRows = buildNmScraperQueue(candidates, roleRows, {
    maxJobs: 75,
    maxCandidatesPerRole: 3,
    maxResponseBytes: 100000,
    requestTimeoutMs: 5000,
  });
  assert.ok(queueRows.every((row) => row.estimated_relevance !== 'low'));
  assert.ok(queueRows.length <= 75);

  const fetchImpl = async (url) => {
    const value = String(url);
    if (value === 'https://www.hca.nm.gov/developmental-disabilities-supports-division/') {
      return {
        ok: true,
        status: 200,
        url: value,
        headers: { get: () => 'text/html' },
        body: null,
        async arrayBuffer() {
          return Buffer.from('<html><title>Developmental Disabilities Supports Division</title><body><h1>Developmental Disabilities Supports Division</h1><p>New Mexico developmental disabilities services.</p></body></html>');
        },
      };
    }
    if (value === 'https://www.hca.nm.gov/lookingforassistance/apply-for-benefits/') {
      return {
        ok: true,
        status: 200,
        url: value,
        headers: { get: () => 'text/html' },
        body: null,
        async arrayBuffer() {
          return Buffer.from('<html><title>Apply For Benefits</title><body><h1>Apply For Benefits</h1><p>Apply for Medicaid benefits in New Mexico.</p></body></html>');
        },
      };
    }
    if (value === 'https://webnew.ped.state.nm.us/bureaus/special-education/due-process/') {
      return {
        ok: false,
        status: 403,
        url: value,
        headers: { get: () => 'text/html' },
        body: null,
        async arrayBuffer() {
          return Buffer.from('<html><title>Access denied</title><body>Request unsuccessful</body></html>');
        },
      };
    }
    throw new Error(`Unexpected fetch ${value}`);
  };

  const outputDir = path.join(root, 'data', 'generated');
  const result = await runNmScraperQueue({
    queueRows,
    roleRows,
    outputDir,
    options: { delayMs: 0, requestTimeoutMs: 5000, bodyTimeoutMs: 5000, maxResponseBytes: 100000 },
    fetchImpl,
  });

  assert.ok(result.verifiedRows.some((row) => row.role_id === 'main_dd_agency'));
  assert.ok(result.rejectedRows.some((row) => row.role_id === 'medicaid_grievances_appeals' && row.rejection_reason));
  assert.ok(result.blockedRows.some((row) => row.role_id === 'special_education_due_process' && row.next_lane === 'browser_assisted'));
  assert.equal(result.summary.total_missing_roles, roleRows.length);
}

async function testArtifactsWrite() {
  const root = makeTempRepo();
  const outputDir = path.join(root, 'data', 'generated');
  const docsDir = path.join(root, 'docs', 'generated');
  writeNmArtifacts({
    outputDir,
    docsDir,
    registryRows: [{ state: 'New Mexico', agency: 'A', program_family: 'x', official_domains: [], authority: 'official_state', domain_evidence_url: '', evidence_title: '', notes: '' }],
    roleRows: [{ state: 'New Mexico', role_id: 'main_dd_agency', source_role: 'dd_routing', workflow_category: 'dd_system', required_priority: 'critical', responsible_agency: 'A', allowed_domains: [], must_have_terms: [], should_have_terms: [], prohibited_terms: [], acceptable_batch_classes: ['html'], why_it_matters: '' }],
    candidateRows: [],
    queueRows: [],
    verifiedRows: [],
    rejectedRows: [],
    blockedRows: [],
    unresolvedRows: [],
    summary: {
      state: 'New Mexico',
      generated_at: new Date().toISOString(),
      total_missing_roles: 1,
      verified_roles: 0,
      unresolved_roles: 1,
      candidates_discovered: 0,
      candidates_sent_to_scraper: 0,
      scrape_jobs_used: 0,
      verified_urls: 0,
      rejected_urls: 0,
      blocked_urls: 0,
      average_candidates_per_role: 0,
      average_scrape_jobs_per_verified_role: 0,
      newly_discovered_urls: 0,
      existed_in_old_repo: { candidates: 0, verified: 0, rejected: 0 },
      per_domain_job_counts: {},
      terminal_states: [{ role_id: 'main_dd_agency', terminal_state: 'unresolved' }],
    },
  });

  assert.ok(fs.existsSync(path.join(outputDir, 'nm_official_domain_registry_v1.jsonl')));
  assert.ok(fs.existsSync(path.join(outputDir, 'nm_missing_critical_roles_v1.jsonl')));
  assert.ok(fs.existsSync(path.join(outputDir, 'nm_low_token_candidate_urls_v1.jsonl')));
  assert.ok(fs.existsSync(path.join(outputDir, 'nm_scraper_queue_v1.jsonl')));
  assert.ok(fs.existsSync(path.join(outputDir, 'nm_low_token_acquisition_summary_v1.json')));
  assert.ok(fs.existsSync(path.join(docsDir, 'nm-low-token-source-acquisition-report-v1.md')));
}

await testControlPlaneAndDiscovery();
await testQueueAndVerification();
await testArtifactsWrite();

console.log('test-nm-low-token-source-acquisition: ok');
