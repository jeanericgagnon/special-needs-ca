import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import {
  buildNonprofitMutationPlan,
  buildRowStats,
  classifyDomain,
  classifyRowEvidenceLevel,
  classifyRowSemantics,
  extractAddressEvidenceFromHtml,
} from '../src/db/nonprofit_accessibility_domain_pipeline.js';

const repoRoot = process.cwd();
const fixtureDir = path.join(repoRoot, 'scripts', 'fixtures', 'nonprofit-accessibility');
const sourceDbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ablefull-nonprofit-acc-'));
const tempDbPath = path.join(tempRoot, 'ca_disability_navigator.db');
const tempOutputRoot = path.join(tempRoot, 'artifacts');

fs.copyFileSync(sourceDbPath, tempDbPath);
fs.mkdirSync(tempOutputRoot, { recursive: true });

const fixtureManifestPath = path.join(fixtureDir, 'thegao-fixture-manifest.json');
const env = {
  ...process.env,
  DB_PATH: tempDbPath,
  OUTPUT_ROOT: tempOutputRoot,
  GENERATED_DATE: '2099-01-01',
};

function run(args) {
  return execFileSync('node', args, {
    cwd: repoRoot,
    env,
    stdio: 'pipe',
    encoding: 'utf8',
  });
}

function readFixture(name) {
  return fs.readFileSync(path.join(fixtureDir, name), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function testLocalSingleLocation() {
  const html = readFixture('local-single.html');
  const evidence = extractAddressEvidenceFromHtml({
    html,
    pageUrl: 'https://local.example.org/contact',
    fetchedAt: '2099-01-01T00:00:00.000Z',
    domain: 'local.example.org',
  })[0];
  const rows = [{
    id: 'ny-local-1',
    name: 'Neighborhood Family Center',
    county_id: 'albany-ny',
    county_name: 'Albany',
    state_id: 'ny',
    data_quality_notes: '',
  }];
  const domainInfo = classifyDomain(rows, 'local.example.org');
  const rowStats = buildRowStats(rows);
  const rowType = classifyRowSemantics(rows[0], rowStats, domainInfo);
  const evidenceLevel = classifyRowEvidenceLevel({
    rowType,
    evidence,
    row: rows[0],
    domainInfo,
    evidenceCount: 1,
    rowCount: 1,
  }).evidenceLevel;
  const mutation = buildNonprofitMutationPlan({
    row: rows[0],
    rowType,
    evidenceLevel,
    evidence,
    warnings: [],
    domainInfo,
    args: { dryRun: false, allowNetworkDomain: false, allowBulkOrgLevel: false },
    rowCount: 1,
  });
  assert(rowType === 'physical_service_location_record', 'Expected local single row to classify as physical service location');
  assert(evidenceLevel === 'service_location_address', 'Expected local single row to classify as service location address');
  assert(mutation.fields.in_person_services === 1, 'Expected local single row to promote in-person services');
}

function testStatewideManyCountyOrg() {
  const html = readFixture('thegao-home.html');
  const evidence = extractAddressEvidenceFromHtml({
    html,
    pageUrl: 'https://thegao.org',
    fetchedAt: '2099-01-01T00:00:00.000Z',
    domain: 'thegao.org',
  })[0];
  const rows = Array.from({ length: 3 }, (_, index) => ({
    id: `ga-gao-${index + 1}`,
    name: 'Georgia Advocacy Office (GAO) - Statewide Support',
    county_id: `${index + 1}-ga`,
    county_name: `County ${index + 1}`,
    state_id: 'ga',
    data_quality_notes: '',
  }));
  const domainInfo = classifyDomain(rows, 'thegao.org');
  const rowStats = buildRowStats(rows);
  const rowType = classifyRowSemantics(rows[0], rowStats, domainInfo);
  const evidenceLevel = classifyRowEvidenceLevel({
    rowType,
    evidence,
    row: rows[0],
    domainInfo,
    evidenceCount: 1,
    rowCount: rows.length,
  }).evidenceLevel;
  const mutation = buildNonprofitMutationPlan({
    row: rows[0],
    rowType,
    evidenceLevel,
    evidence,
    warnings: ['many_to_one_evidence'],
    domainInfo,
    args: { dryRun: false, allowNetworkDomain: false, allowBulkOrgLevel: true },
    rowCount: rows.length,
  });
  assert(rowType === 'county_service_area_record', 'Expected GAO pattern to classify as county service-area record');
  assert(evidenceLevel === 'statewide_service_area', 'Expected GAO pattern to classify as statewide service area');
  assert(mutation.fields.in_person_services === 0, 'Expected statewide org rows not to imply local in-person services');
}

function testNetworkDomainGuardrail() {
  const html = readFixture('network-directory.html');
  const evidence = extractAddressEvidenceFromHtml({
    html,
    pageUrl: 'https://network.example.org',
    fetchedAt: '2099-01-01T00:00:00.000Z',
    domain: 'network.example.org',
  })[0];
  const rows = [
    { id: 'a', name: 'Arc Affiliate A', county_id: 'a-tx', county_name: 'A', state_id: 'tx', data_quality_notes: '' },
    { id: 'b', name: 'Arc Affiliate B', county_id: 'b-tx', county_name: 'B', state_id: 'tx', data_quality_notes: '' },
    { id: 'c', name: 'Arc Affiliate C', county_id: 'c-ok', county_name: 'C', state_id: 'ok', data_quality_notes: '' },
  ];
  const domainInfo = classifyDomain(rows, 'parentcenterhub.org');
  const rowStats = buildRowStats(rows);
  const rowType = classifyRowSemantics(rows[0], rowStats, domainInfo);
  const evidenceLevel = classifyRowEvidenceLevel({
    rowType,
    evidence,
    row: rows[0],
    domainInfo,
    evidenceCount: 1,
    rowCount: rows.length,
  }).evidenceLevel;
  const mutation = buildNonprofitMutationPlan({
    row: rows[0],
    rowType,
    evidenceLevel,
    evidence,
    warnings: ['network_domain_requires_special_mode'],
    domainInfo,
    args: { dryRun: false, allowNetworkDomain: false, allowBulkOrgLevel: false },
    rowCount: rows.length,
  });
  assert(domainInfo.domainType === 'aggregator_or_network', 'Expected domain to classify as aggregator/network');
  assert(evidenceLevel === 'national_or_network_directory', 'Expected network domain to classify as national/network directory');
  assert(mutation.action === 'skip_network_domain', 'Expected network domain promotion to be blocked');
}

function testAmbiguousAddressOnly() {
  const html = readFixture('ambiguous-address.html');
  const evidence = extractAddressEvidenceFromHtml({
    html,
    pageUrl: 'https://ambiguous.example.org',
    fetchedAt: '2099-01-01T00:00:00.000Z',
    domain: 'ambiguous.example.org',
  })[0];
  assert(evidence.confidence === 'medium', 'Expected ambiguous address fixture to stay below high confidence');
}

testLocalSingleLocation();
testStatewideManyCountyOrg();
testNetworkDomainGuardrail();
testAmbiguousAddressOnly();

const beforeDb = new Database(tempDbPath, { readonly: true });
const beforeCounts = beforeDb.prepare(`
  SELECT COUNT(*) AS total,
         SUM(CASE WHEN COALESCE(in_person_services, 0) = 1 THEN 1 ELSE 0 END) AS in_person
  FROM nonprofit_organizations
  WHERE source_url = 'https://thegao.org'
    AND verification_status = 'official_verified'
`).get();
beforeDb.close();

run([
  'src/db/promote_nonprofit_accessibility_domain_batch.js',
  '--domain=thegao.org',
  '--org=Georgia Advocacy Office',
  '--org=(GAO)',
  `--fixture-manifest=${fixtureManifestPath}`,
  '--dry-run',
]);

const dryRunDb = new Database(tempDbPath, { readonly: true });
const afterDryRun = dryRunDb.prepare(`
  SELECT SUM(CASE WHEN COALESCE(in_person_services, 0) = 1 THEN 1 ELSE 0 END) AS in_person
  FROM nonprofit_organizations
  WHERE source_url = 'https://thegao.org'
    AND verification_status = 'official_verified'
`).get();
dryRunDb.close();
assert(afterDryRun.in_person === beforeCounts.in_person, 'Dry run changed GAO in_person_services counts');

run([
  'src/db/promote_nonprofit_accessibility_domain_batch.js',
  '--domain=thegao.org',
  '--org=Georgia Advocacy Office',
  '--org=(GAO)',
  `--fixture-manifest=${fixtureManifestPath}`,
  '--allow-bulk-org-level',
]);

const afterDb = new Database(tempDbPath, { readonly: true });
const afterCounts = afterDb.prepare(`
  SELECT COUNT(*) AS total,
         SUM(CASE WHEN COALESCE(in_person_services, 0) = 1 THEN 1 ELSE 0 END) AS in_person,
         SUM(CASE WHEN accessibility_evidence_level = 'statewide_service_area' THEN 1 ELSE 0 END) AS statewide_rows,
         SUM(CASE WHEN accessibility_source_address = '1 W Ct Square #625, Decatur, GA 30030' THEN 1 ELSE 0 END) AS address_rows
  FROM nonprofit_organizations
  WHERE source_url = 'https://thegao.org'
    AND verification_status = 'official_verified'
`).get();
afterDb.close();

assert(afterCounts.in_person === 0, `Expected GAO rows to be corrected away from local in-person claims, got ${afterCounts.in_person}`);
assert(afterCounts.statewide_rows === afterCounts.total, `Expected all GAO rows to classify as statewide service area, got ${afterCounts.statewide_rows}/${afterCounts.total}`);
assert(afterCounts.address_rows === afterCounts.total, `Expected all GAO rows to retain org-level address evidence, got ${afterCounts.address_rows}/${afterCounts.total}`);

const reportPath = path.join(repoRoot, 'docs', 'generated', 'nonprofit-accessibility-domain-thegao-org-2099-01-01.md');
assert(fs.existsSync(reportPath), 'Expected markdown report to be written');

console.log(JSON.stringify({
  message: 'Nonprofit accessibility domain semantics test passed',
  tempRoot,
  beforeCounts,
  afterCounts,
}, null, 2));
