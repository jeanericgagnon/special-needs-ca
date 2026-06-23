import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch250FloridaPacketConsistencyRefreshV1 } from './run-batch250-florida-packet-consistency-refresh-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

const result = generateBatch250FloridaPacketConsistencyRefreshV1();
const packet = readJson('data/generated/florida_county_local_disability_resources_leaf_authoring_packet_v1.json');
const batchSummary = readJson('data/generated/batch250_florida_packet_consistency_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch250-florida-packet-consistency-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(packet.current_problem_metrics.deadCircuitLeavesAdvertisedInSitemap, true);
assert.equal(packet.current_problem_metrics.deadCircuitLeavesLive404, true);
assert.equal(packet.current_problem_metrics.shellOnlyPublicRoutes, 2);
assert.equal(packet.current_problem_metrics.publicAssistanceSitemapEnumerated, true);
assert.ok(packet.representative_sources.includes('https://www.myflfamilies.com/sitemap.xml'));
assert.ok(packet.representative_sources.includes('https://myaccess.myflfamilies.com/Help/HCINT'));
assert.ok(packet.root_domains_to_review.some((row) => row.includes('live 404s')));
assert.ok(packet.root_domains_to_review.some((row) => row.includes('one shell lane')));
assert.match(packet.packet_complete_when, /Dead sitemap circuit leaves, shell-only public routes, and wrong-role county-complete contacts do not satisfy the family/);

assert.equal(batchSummary.shellOnlyPublicRoutes, 2);
assert.equal(batchSummary.deadCircuitLeavesLive404, true);
assert.match(report, /county_local_disability_resources: blocked_public_assistance_sitemap_dead_circuit_leaves_and_authenticated_only_results/);
assert.match(batchReport, /dead sitemap-advertised circuit leaves/);

console.log('test-batch250-florida-packet-consistency-refresh-v1: ok');
