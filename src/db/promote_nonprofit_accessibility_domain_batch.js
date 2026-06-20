import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildNonprofitMutationPlan,
  buildRowStats,
  chooseBestEvidence,
  classifyDomain,
  classifyRowEvidenceLevel,
  classifyRowSemantics,
  crawlFirstPartyDomain,
  ensureDir,
  ensureNonprofitAccessibilitySchema,
  extractAddressEvidenceFromHtml,
  getTrustedStatuses,
  parseCliArgs,
  readFixtureManifest,
  slugify,
  summarizeSkipReasons,
  validateAddressEvidence,
} from './nonprofit_accessibility_domain_pipeline.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const args = parseCliArgs(process.argv.slice(2));

if (!args.domain) {
  throw new Error('Missing required --domain=<domain> argument');
}

const generatedDate = args.generatedDate || new Date().toISOString().slice(0, 10);
const runStamp = new Date().toISOString().replace(/[:.]/g, '-');
const dbPath = args.dbPath || path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const outputRoot = args.outputRoot || path.join(repoRoot, 'data', 'nonprofit-accessibility-domains');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const domainSlug = slugify(args.domain);
const artifactDir = path.join(outputRoot, domainSlug, runStamp);
const fixtureManifest = readFixtureManifest(args.fixtureManifestPath);

ensureDir(artifactDir);
ensureDir(docsDir);

const db = new Database(dbPath);
ensureNonprofitAccessibilitySchema(db);

const trustedStatuses = [...getTrustedStatuses()];
const candidateRows = db.prepare(`
  SELECT n.id,
         n.name,
         n.county_id,
         c.name AS county_name,
         c.state_id,
         n.source_url,
         n.website,
         n.verification_status,
         n.in_person_services,
         n.accessibility_notes,
         n.data_quality_notes,
         n.accessibility_evidence_level,
         n.accessibility_source_address,
         n.service_tags,
         n.serving_tags
  FROM nonprofit_organizations n
  LEFT JOIN counties c ON c.id = n.county_id
  WHERE n.verification_status IN (${trustedStatuses.map(() => '?').join(', ')})
    AND (
      LOWER(COALESCE(n.source_url, '')) LIKE ?
      OR LOWER(COALESCE(n.website, '')) LIKE ?
      OR ${args.orgTerms.length > 0 ? args.orgTerms.map(() => `LOWER(COALESCE(n.name, '')) LIKE ?`).join(' OR ') : '0'}
    )
    ${args.state ? 'AND LOWER(COALESCE(c.state_id, \'\')) = ?' : ''}
  ORDER BY n.id
`).all(
  ...trustedStatuses,
  `%${args.domain}%`,
  `%${args.domain}%`,
  ...args.orgTerms.map((term) => `%${term.toLowerCase()}%`),
  ...(args.state ? [args.state] : [])
);

const countSnapshot = db.prepare(`
  SELECT COUNT(*) AS total,
         SUM(CASE WHEN COALESCE(in_person_services, 0) = 1 THEN 1 ELSE 0 END) AS inPerson,
         SUM(CASE WHEN accessibility_evidence_level IN ('organization_physical_address','statewide_service_area') THEN 1 ELSE 0 END) AS orgLevelPresence,
         SUM(CASE WHEN accessibility_evidence_level IN ('service_location_address','county_specific_location') THEN 1 ELSE 0 END) AS localInPersonEvidence,
         SUM(CASE WHEN source_url IS NOT NULL AND TRIM(source_url) <> '' AND verification_status IN ('official_verified','verified','human_verified','source_listed')
                    AND (COALESCE(languages, '') = '')
                    AND (COALESCE(accessibility_notes, '') = '')
                    AND COALESCE(interpreter_available, 0) = 0
                    AND COALESCE(asl_available, 0) = 0
                    AND COALESCE(wheelchair_accessible, 0) = 0
                    AND COALESCE(virtual_services, 0) = 0
                    AND COALESCE(in_person_services, 0) = 0
                    AND COALESCE(home_visits, 0) = 0
                    AND COALESCE(transportation_help, 0) = 0
                  THEN 1 ELSE 0 END) AS trustedMissing
  FROM nonprofit_organizations
  WHERE verification_status IN ('official_verified','verified','human_verified','source_listed')
    AND (LOWER(COALESCE(source_url, '')) LIKE ? OR LOWER(COALESCE(website, '')) LIKE ?)
`);

const beforeDomainCounts = countSnapshot.get(`%${args.domain}%`, `%${args.domain}%`);

const crawl = await crawlFirstPartyDomain({
  domain: args.domain,
  seedUrls: args.seedUrls,
  artifactDir,
  fixtureManifest,
  maxPages: args.maxPages,
  maxRetries: args.maxRetries,
  rateLimitMs: args.rateLimitMs,
});

const rawPages = crawl.pages.map((page) => ({
  ...page,
  html: fs.readFileSync(page.rawPath, 'utf8'),
}));

const extractedEvidence = rawPages.flatMap((page) => extractAddressEvidenceFromHtml({
  html: page.html,
  pageUrl: page.url,
  fetchedAt: page.fetchedAt,
  domain: args.domain,
}));

const bestEvidenceResult = chooseBestEvidence(extractedEvidence, args.domain);
const validationErrors = bestEvidenceResult ? [] : ['no_high_confidence_first_party_address_evidence'];
const bestEvidence = bestEvidenceResult?.evidence || null;
const domainInfo = classifyDomain(candidateRows, args.domain);
const rowStats = buildRowStats(candidateRows);
const uniqueAddresses = new Set(extractedEvidence.map((row) => row.address)).size;
const warnings = [...domainInfo.warnings];
if (uniqueAddresses <= 1 && candidateRows.length > 1) warnings.push('many_to_one_evidence');
if (candidateRows.length > 50) warnings.push('bulk_org_level_review_threshold');
if (candidateRows.length > 1 && uniqueAddresses > 0 && uniqueAddresses * 10 < candidateRows.length) warnings.push('address_count_tiny_relative_to_row_count');

const mutations = [];
const skipped = [];
const classificationCounts = {};
const evidenceLevelCounts = {};
const actionCounts = {};
const sampleRows = [];

for (const row of candidateRows) {
  if (!bestEvidence) {
    skipped.push({ id: row.id, name: row.name, reason: 'missing_validated_domain_evidence' });
    continue;
  }

  const rowType = classifyRowSemantics(row, rowStats, domainInfo);
  const classification = classifyRowEvidenceLevel({
    rowType,
    evidence: bestEvidence,
    row,
    domainInfo,
    evidenceCount: uniqueAddresses,
    rowCount: candidateRows.length,
  });
  const mutation = buildNonprofitMutationPlan({
    row,
    rowType,
    evidenceLevel: classification.evidenceLevel,
    evidence: bestEvidence,
    warnings: classification.warnings,
    domainInfo,
    args,
    rowCount: candidateRows.length,
  });

  classificationCounts[rowType] = (classificationCounts[rowType] || 0) + 1;
  evidenceLevelCounts[classification.evidenceLevel] = (evidenceLevelCounts[classification.evidenceLevel] || 0) + 1;
  actionCounts[mutation.action] = (actionCounts[mutation.action] || 0) + 1;

  const isNoop =
    Number(row.in_person_services || 0) === Number(mutation.fields.in_person_services || 0) &&
    String(row.accessibility_notes || '').trim() === String(mutation.fields.accessibility_notes || '').trim() &&
    String(row.accessibility_evidence_level || '').trim() === String(mutation.fields.accessibility_evidence_level || '').trim() &&
    String(row.accessibility_source_address || '').trim() === String(mutation.fields.accessibility_source_address || '').trim();

  const record = {
    id: row.id,
    name: row.name,
    county_id: row.county_id,
    county_name: row.county_name,
    state_id: row.state_id,
    rowType,
    evidenceLevel: classification.evidenceLevel,
    action: mutation.action,
    warnings: mutation.warningReasons,
    before: {
      in_person_services: row.in_person_services || 0,
      accessibility_notes: row.accessibility_notes || '',
      accessibility_evidence_level: row.accessibility_evidence_level || '',
      accessibility_source_address: row.accessibility_source_address || '',
    },
    after: mutation.fields,
    publicSafeWording: mutation.publicNote,
  };

  if (sampleRows.length < 10) sampleRows.push(record);

  if (isNoop) {
    skipped.push({ id: row.id, name: row.name, reason: 'already_in_safe_state' });
    continue;
  }

  if (mutation.action === 'skip_network_domain') {
    skipped.push({ id: row.id, name: row.name, reason: 'network_domain_requires_special_mode' });
    continue;
  }
  if (mutation.action === 'bulk_org_level_promotion' && !args.allowBulkOrgLevel) {
    skipped.push({ id: row.id, name: row.name, reason: 'bulk_org_level_promotion_requires_allow_flag' });
    continue;
  }

  mutations.push(record);
}

const rollbackSqlPath = path.join(artifactDir, 'rollback.sql');
const forwardSqlPath = path.join(artifactDir, 'forward.sql');
const escapeSql = (value) => value === null || value === undefined ? 'NULL' : `'${String(value).replace(/'/g, "''")}'`;

fs.writeFileSync(rollbackSqlPath, `${mutations.map((row) => `UPDATE nonprofit_organizations SET in_person_services = ${escapeSql(row.before.in_person_services)}, accessibility_notes = ${escapeSql(row.before.accessibility_notes)}, accessibility_evidence_level = ${escapeSql(row.before.accessibility_evidence_level)}, accessibility_source_address = ${escapeSql(row.before.accessibility_source_address)} WHERE id = ${escapeSql(row.id)};`).join('\n')}\n`);
fs.writeFileSync(forwardSqlPath, `${mutations.map((row) => `UPDATE nonprofit_organizations SET in_person_services = ${escapeSql(row.after.in_person_services)}, accessibility_notes = ${escapeSql(row.after.accessibility_notes)}, accessibility_evidence_level = ${escapeSql(row.after.accessibility_evidence_level)}, accessibility_source_address = ${escapeSql(row.after.accessibility_source_address)}, data_quality_notes = ${escapeSql(row.after.data_quality_notes)}, checked_at = ${escapeSql(row.after.checked_at)} WHERE id = ${escapeSql(row.id)};`).join('\n')}\n`);

if (!args.dryRun && mutations.length > 0) {
  const updateStmt = db.prepare(`
    UPDATE nonprofit_organizations
    SET in_person_services = @in_person_services,
        accessibility_notes = @accessibility_notes,
        data_quality_notes = @data_quality_notes,
        checked_at = @checked_at,
        accessibility_evidence_level = @accessibility_evidence_level,
        accessibility_source_address = @accessibility_source_address
    WHERE id = @id
  `);
  const tx = db.transaction((rows) => {
    for (const row of rows) {
      updateStmt.run({
        ...row.after,
        id: row.id,
      });
    }
  });
  tx(mutations);
}

const afterDomainCounts = countSnapshot.get(`%${args.domain}%`, `%${args.domain}%`);
const safeStatus = beforeDomainCounts.inPerson > afterDomainCounts.localInPersonEvidence && afterDomainCounts.orgLevelPresence > 0
  ? 'over-promoted_corrected_to_org_level'
  : domainInfo.domainType === 'statewide_org_service_area'
    ? 'partially_safe_org_level_only'
    : 'safe';

const nextDomainRows = db.prepare(`
  SELECT source_url, website
  FROM nonprofit_organizations
  WHERE source_url IS NOT NULL
    AND TRIM(source_url) <> ''
    AND verification_status IN ('official_verified','verified','human_verified','source_listed')
    AND (COALESCE(languages, '') = '')
    AND (COALESCE(accessibility_notes, '') = '')
    AND COALESCE(interpreter_available, 0) = 0
    AND COALESCE(asl_available, 0) = 0
    AND COALESCE(wheelchair_accessible, 0) = 0
    AND COALESCE(virtual_services, 0) = 0
    AND COALESCE(in_person_services, 0) = 0
    AND COALESCE(home_visits, 0) = 0
    AND COALESCE(transportation_help, 0) = 0
`).all();

const nextDomainCounts = new Map();
for (const row of nextDomainRows) {
  const rawUrl = row.source_url || row.website;
  if (!rawUrl) continue;
  try {
    const host = new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
    nextDomainCounts.set(host, (nextDomainCounts.get(host) || 0) + 1);
  } catch {
    continue;
  }
}
const nextDomains = [...nextDomainCounts.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 12)
  .map(([domain, missingRows]) => ({ domain, missingRows }));

const evidencePayload = {
  generatedAt: generatedDate,
  runStamp,
  domain: args.domain,
  dryRun: args.dryRun,
  dbPath,
  candidateCount: candidateRows.length,
  pagesFetched: crawl.pages.length,
  fetchFailures: crawl.failures.length,
  evidenceCount: extractedEvidence.length,
  uniqueAddressCount: uniqueAddresses,
  bestEvidence,
  validation: bestEvidence ? validateAddressEvidence(bestEvidence, args.domain) : { valid: false, errors: validationErrors },
  domainInfo,
  warnings,
  pages: crawl.pages,
  failures: crawl.failures,
  evidence: extractedEvidence,
};

const promotionPayload = {
  generatedAt: generatedDate,
  runStamp,
  domain: args.domain,
  orgTerms: args.orgTerms,
  dryRun: args.dryRun,
  safeStatus,
  beforeDomainCounts,
  afterDomainCounts,
  candidateCount: candidateRows.length,
  mutationCount: mutations.length,
  skippedCount: skipped.length,
  classificationCounts,
  evidenceLevelCounts,
  actionCounts,
  warnings,
  sampleRows,
  mutations,
  skipped,
  skipReasons: summarizeSkipReasons(skipped),
  nextDomains,
  rollbackSqlPath,
  forwardSqlPath,
};

const evidencePath = path.join(artifactDir, 'evidence.json');
const crawlPath = path.join(artifactDir, 'crawl-manifest.json');
const failuresPath = path.join(artifactDir, 'failed-urls.json');
const promotionPath = path.join(artifactDir, 'promotion-decisions.json');
const summaryPath = path.join(artifactDir, 'summary.json');
const mdReportPath = path.join(docsDir, `nonprofit-accessibility-domain-${domainSlug}-${generatedDate}.md`);
const jsonReportPath = path.join(docsDir, `nonprofit-accessibility-domain-${domainSlug}-${generatedDate}.json`);

fs.writeFileSync(crawlPath, `${JSON.stringify({ pages: crawl.pages }, null, 2)}\n`);
fs.writeFileSync(failuresPath, `${JSON.stringify(crawl.failures, null, 2)}\n`);
fs.writeFileSync(evidencePath, `${JSON.stringify(evidencePayload, null, 2)}\n`);
fs.writeFileSync(promotionPath, `${JSON.stringify(promotionPayload, null, 2)}\n`);
fs.writeFileSync(summaryPath, `${JSON.stringify({
  domain: args.domain,
  dryRun: args.dryRun,
  safeStatus,
  candidateCount: candidateRows.length,
  mutationCount: mutations.length,
  skippedCount: skipped.length,
  bestEvidence,
  validationErrors: evidencePayload.validation.errors,
  warnings,
  artifactDir,
}, null, 2)}\n`);

const mdLines = [
  '# Nonprofit Accessibility Domain Batch Report',
  '',
  `Generated: ${generatedDate}`,
  '',
  `Domain: ${args.domain}`,
  '',
  `Dry run: ${args.dryRun ? 'yes' : 'no'}`,
  '',
  `Status: ${safeStatus}`,
  '',
  `Artifacts: ${artifactDir}`,
  '',
  '## Crawl summary',
  '',
  `- candidate nonprofit rows: ${candidateRows.length}`,
  `- pages fetched: ${crawl.pages.length}`,
  `- fetch failures: ${crawl.failures.length}`,
  `- extracted address evidence rows: ${extractedEvidence.length}`,
  `- unique addresses: ${uniqueAddresses}`,
  `- validated first-party address evidence: ${bestEvidence ? 'yes' : 'no'}`,
  '',
  '## Guardrails',
  '',
  ...warnings.map((warning) => `- ${warning}`),
  '',
  '## Accessibility counts',
  '',
  `- before in-person rows: ${beforeDomainCounts.inPerson}/${beforeDomainCounts.total}`,
  `- after in-person rows: ${afterDomainCounts.inPerson}/${afterDomainCounts.total}`,
  `- before org-level physical presence rows: ${beforeDomainCounts.orgLevelPresence}/${beforeDomainCounts.total}`,
  `- after org-level physical presence rows: ${afterDomainCounts.orgLevelPresence}/${afterDomainCounts.total}`,
  `- before local in-person evidence rows: ${beforeDomainCounts.localInPersonEvidence}/${beforeDomainCounts.total}`,
  `- after local in-person evidence rows: ${afterDomainCounts.localInPersonEvidence}/${afterDomainCounts.total}`,
  `- before trusted rows missing all accessibility: ${beforeDomainCounts.trustedMissing}/${beforeDomainCounts.total}`,
  `- after trusted rows missing all accessibility: ${afterDomainCounts.trustedMissing}/${afterDomainCounts.total}`,
  '',
  '## Classification summary',
  '',
  ...Object.entries(classificationCounts).map(([key, value]) => `- ${key}: ${value}`),
  ...Object.entries(evidenceLevelCounts).map(([key, value]) => `- evidence ${key}: ${value}`),
  ...Object.entries(actionCounts).map(([key, value]) => `- action ${key}: ${value}`),
  '',
  '## Sample rows',
  '',
  ...sampleRows.map((row) => `- ${row.id}: row_type=${row.rowType}, evidence_level=${row.evidenceLevel}, before_in_person=${row.before.in_person_services}, after_in_person=${row.after.in_person_services}, wording="${row.publicSafeWording}"`),
  '',
  '## Best evidence',
  '',
];

if (bestEvidence) {
  mdLines.push(`- address: ${bestEvidence.address}`);
  mdLines.push(`- source URL: ${bestEvidence.sourceUrl}`);
  mdLines.push(`- fetched at: ${bestEvidence.fetchedAt}`);
  mdLines.push(`- confidence: ${bestEvidence.confidence}`);
  mdLines.push(`- reason: ${bestEvidence.reason}`);
} else {
  mdLines.push(`- validation errors: ${validationErrors.join(', ')}`);
}

mdLines.push('', '## Remaining gap', '');
mdLines.push(`- remaining rows without local in-person confirmation: ${afterDomainCounts.total - afterDomainCounts.localInPersonEvidence}`);
mdLines.push(`- remaining rows without org-level physical presence evidence: ${afterDomainCounts.total - afterDomainCounts.orgLevelPresence}`);
mdLines.push('', '## Next highest-volume domains to process', '');
for (const row of nextDomains.slice(0, 10)) {
  mdLines.push(`- ${row.domain}: ${row.missingRows} trusted nonprofit rows still missing all accessibility`);
}

fs.writeFileSync(mdReportPath, `${mdLines.join('\n')}\n`);
fs.writeFileSync(jsonReportPath, `${JSON.stringify({
  evidencePath,
  promotionPath,
  summaryPath,
  mdReportPath,
  ...promotionPayload,
}, null, 2)}\n`);

console.log(JSON.stringify({
  domain: args.domain,
  dryRun: args.dryRun,
  safeStatus,
  candidateRows: candidateRows.length,
  mutationRows: mutations.length,
  skippedRows: skipped.length,
  pagesFetched: crawl.pages.length,
  fetchFailures: crawl.failures.length,
  warnings,
  bestEvidence: bestEvidence ? {
    address: bestEvidence.address,
    sourceUrl: bestEvidence.sourceUrl,
    fetchedAt: bestEvidence.fetchedAt,
    confidence: bestEvidence.confidence,
  } : null,
  report: mdReportPath,
  artifacts: artifactDir,
}, null, 2));

db.close();
