import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const scriptPath = path.join(repoRoot, 'scripts', 'run-california-scraping-foundation-status-v1.mjs');

const result = spawnSync(process.execPath, [scriptPath], {
  cwd: repoRoot,
  encoding: 'utf8',
});

assert.equal(result.status, 0, result.stderr || result.stdout);

const jsonPath = path.join(repoRoot, 'data', 'generated', 'california-scraping-foundation-status-v1.json');
const mdPath = path.join(repoRoot, 'docs', 'generated', 'california-scraping-foundation-status-v1.md');

assert.equal(fs.existsSync(jsonPath), true);
assert.equal(fs.existsSync(mdPath), true);

const status = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.equal(status.registryFamilies, 10);
assert.equal(status.registrySeedEntries, 18);
assert.equal(status.queueRows, 18);
assert.equal(status.alignmentStatus, 'pass');
assert.equal(status.postStageAuditStatus, 'pass');
assert.equal(status.postStageAcceptedReconciled, true);
assert.equal(status.postStageProvenanceHealthy, true);
assert.equal(status.postStageAcceptedCount, 100);
assert.equal(status.postStageStagedCount, 76);
assert.equal(status.postStageUnsupportedCount, 24);
assert.equal(status.postStageParseReadyCount, 134);
assert.equal(status.postStageBrowserAssistedCount, 30);
assert.deepEqual(status.postStageFamiliesWithIssues, []);
assert.deepEqual(status.publishedProvenanceBlockedTables, []);
assert.deepEqual(status.publishedProvenanceStrongReadyGaps, []);
assert.equal(status.stageReadyRows, 5);
assert.equal(status.publishedCount, 5);
assert.equal(status.needsReviewCount, 0);
assert.equal(status.publishedCountyOfficeRows, 5);
assert.equal(status.unsafePublishedCountyOfficeRows, 0);
assert.deepEqual(status.unsafePublishedCountyOfficeAgencies, []);
assert.equal(Array.isArray(status.upsertRuns), true);
assert.equal(status.upsertRuns.length >= 3, true);
assert.equal(status.actionableCount, 13);
assert.equal(status.skippedCount, 5);
assert.equal(status.upsertedByTable.county_offices, 6);
assert.equal(status.publicQueryGuards.countyOfficesBulkPublishedOnly, true);
assert.equal(status.publicQueryGuards.schoolDistrictsBulkPublishedOnly, true);
assert.equal(status.publicQueryGuards.schoolDistrictByIdPublishedOnly, true);
assert.equal(status.publicQueryGuards.schoolDistrictLitigationListPublishedOnly, true);
assert.equal(status.publicQueryGuards.schoolDistrictBySlugPublishedOnly, true);
assert.equal(status.publicQueryGuards.selpasByCountyPublishedOnly, true);
assert.equal(status.publicQueryGuards.waitlistsPublishedOnly, true);
assert.equal(status.publicQueryGuards.localProvidersPublishedOnly, true);
assert.equal(status.publicQueryGuards.programsBulkPublishedOnly, true);
assert.equal(status.publicQueryGuards.programBySlugPublishedOnly, true);
assert.match(markdown, /## Published-Only Query Guards/);
assert.match(markdown, /Post-stage audit status: `pass`/);
assert.match(markdown, /Post-stage accepted\/staged\/unsupported: `100\/76\/24`/);
assert.match(markdown, /Published provenance blocked tables: none/);
assert.match(markdown, /Published provenance strong-ready gaps: none/);
assert.match(markdown, /### County Office Trust Check/);
assert.match(markdown, /Unsafe published county office rows: `0`/);
assert.match(markdown, /Published rows: `5`/);
assert.match(markdown, /### Upsert Runs/);

console.log('california scraping foundation status tests passed');
