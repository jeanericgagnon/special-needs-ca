import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `provider-accessibility-pull-results-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-accessibility-pull-results-audit-${generatedDate}.md`);
const db = new Database(dbPath, { readonly: true });

const FOCUS_STATES = ['florida', 'texas', 'pennsylvania', 'illinois'];
const ACCESSIBILITY_FIELDS = [
  'languages',
  'interpreter_available',
  'asl_available',
  'wheelchair_accessible',
  'virtual_services',
  'in_person_services',
  'home_visits',
  'transportation_help',
  'accessibility_notes',
  'next_step_type',
  'requirements',
  'application_url',
  'referral_url',
];

function tableExists(tableName) {
  const row = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table' AND name = ?
  `).get(tableName);
  return Boolean(row);
}

function rows(sql, ...params) {
  return db.prepare(sql).all(...params);
}

const hasResultsTable = tableExists('provider_accessibility_pull_results');

const providerRows = rows(`
  SELECT resource_providers.id,
         resource_providers.name,
         resource_providers.categories,
         resource_providers.county_id,
         counties.state_id,
         resource_providers.source_url,
         resource_providers.verification_status
  FROM resource_providers
  LEFT JOIN counties ON counties.id = resource_providers.county_id
  WHERE resource_providers.source_url IS NOT NULL
    AND TRIM(resource_providers.source_url) <> ''
    AND resource_providers.verification_status IN ('official_verified', 'verified', 'human_verified', 'source_listed')
    AND counties.state_id IN (${FOCUS_STATES.map(() => '?').join(', ')})
  ORDER BY counties.state_id, resource_providers.id
`, ...FOCUS_STATES);

const resultRows = hasResultsTable
  ? rows(`
      SELECT provider_accessibility_pull_results.*,
             resource_providers.name AS provider_name
      FROM provider_accessibility_pull_results
      LEFT JOIN resource_providers ON resource_providers.id = provider_accessibility_pull_results.provider_id
      WHERE provider_accessibility_pull_results.state_id IN (${FOCUS_STATES.map(() => '?').join(', ')})
      ORDER BY provider_accessibility_pull_results.state_id,
               provider_accessibility_pull_results.provider_id,
               provider_accessibility_pull_results.clue_field,
               provider_accessibility_pull_results.id
    `, ...FOCUS_STATES)
  : [];

const resultsByProvider = new Map();
for (const row of resultRows) {
  const bucket = resultsByProvider.get(row.provider_id) || [];
  bucket.push(row);
  resultsByProvider.set(row.provider_id, bucket);
}

const statusCounts = {};
const fieldCounts = {};
for (const row of resultRows) {
  statusCounts[row.clue_status] = (statusCounts[row.clue_status] || 0) + 1;
  fieldCounts[row.clue_field] = (fieldCounts[row.clue_field] || 0) + 1;
}

const states = FOCUS_STATES.map((stateId) => {
  const stateProviders = providerRows.filter((row) => row.state_id === stateId);
  const stateResults = resultRows.filter((row) => row.state_id === stateId);
  const queueProviders = stateProviders.map((provider) => {
    const providerResults = resultsByProvider.get(provider.id) || [];
    return {
      id: provider.id,
      name: provider.name,
      sourceUrl: provider.source_url,
      categories: provider.categories,
      resultCount: providerResults.length,
      statuses: [...new Set(providerResults.map((row) => row.clue_status))].sort(),
      clueFields: [...new Set(providerResults.map((row) => row.clue_field))].sort(),
      missingFields: ACCESSIBILITY_FIELDS.filter((field) => !providerResults.some((row) => row.clue_field === field)),
    };
  });

  const reviewReady = stateResults.filter((row) =>
    row.clue_status === 'reviewed' &&
    String(row.clue_text || '').trim() &&
    String(row.clue_page_url || '').trim()
  );
  const queued = stateResults.filter((row) => row.clue_status === 'queued');
  const promoted = stateResults.filter((row) => row.clue_status === 'promoted');
  const rejected = stateResults.filter((row) => row.clue_status === 'rejected');

  return {
    stateId,
    providerCount: stateProviders.length,
    resultCount: stateResults.length,
    queuedCount: queued.length,
    reviewReadyCount: reviewReady.length,
    promotedCount: promoted.length,
    rejectedCount: rejected.length,
    providersWithoutResults: queueProviders.filter((provider) => provider.resultCount === 0),
    providersWithPartialResults: queueProviders.filter((provider) => provider.resultCount > 0 && provider.missingFields.length > 0),
    reviewReady: reviewReady.slice(0, 12),
    queued: queued.slice(0, 12),
  };
});

const report = {
  generatedAt: generatedDate,
  dbPath,
  hasResultsTable,
  focusStates: FOCUS_STATES,
  summary: {
    providerCount: providerRows.length,
    resultCount: resultRows.length,
    statusCounts,
    fieldCounts,
  },
  states,
};

const mdLines = [
  '# Provider Accessibility Pull Results Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This artifact turns provider accessibility source-pull work into a review contract. It shows whether first-party accessibility clues have actually been recorded, reviewed, and promoted for the current focus states without publishing unverified claims.',
  '',
  '## Summary',
  '',
  `- results table present: ${hasResultsTable ? 'yes' : 'no'}`,
  `- trusted provider rows in focus states: ${providerRows.length}`,
  `- recorded pull-result rows: ${resultRows.length}`,
  `- clue statuses: ${Object.entries(statusCounts).map(([status, count]) => `${status}=${count}`).join(', ') || 'none'}`,
  `- clue fields captured: ${Object.entries(fieldCounts).map(([field, count]) => `${field}=${count}`).join(', ') || 'none'}`,
  '',
  'Required evidence before promotion:',
  '',
  '- a trusted provider row with a valid first-party `source_url`',
  '- a specific `clue_page_url` where the claim was found',
  '- the `clue_field` being proposed for enrichment',
  '- explicit `clue_text` or structured value from the source page',
  '- a `clue_status` that shows whether the clue is queued, reviewed, promoted, or rejected',
];

for (const state of states) {
  mdLines.push('', `## ${state.stateId}`, '');
  mdLines.push(`- trusted provider rows: ${state.providerCount}`);
  mdLines.push(`- recorded pull-result rows: ${state.resultCount}`);
  mdLines.push(`- queued clues: ${state.queuedCount}`);
  mdLines.push(`- review-ready clues: ${state.reviewReadyCount}`);
  mdLines.push(`- promoted clues: ${state.promotedCount}`);
  mdLines.push(`- rejected clues: ${state.rejectedCount}`);

  mdLines.push('', 'Providers with no recorded clue results yet:', '');
  if (state.providersWithoutResults.length === 0) {
    mdLines.push('- none');
  } else {
    for (const provider of state.providersWithoutResults) {
      mdLines.push(`- ${provider.id}: ${provider.sourceUrl} | categories=${provider.categories || 'none'} | still missing all review rows`);
    }
  }

  mdLines.push('', 'Providers with partial clue coverage:', '');
  if (state.providersWithPartialResults.length === 0) {
    mdLines.push('- none');
  } else {
    for (const provider of state.providersWithPartialResults.slice(0, 12)) {
      mdLines.push(`- ${provider.id}: results=${provider.resultCount} | missing=${provider.missingFields.join(', ') || 'none'}`);
    }
  }

  mdLines.push('', 'Review-ready clues:', '');
  if (state.reviewReady.length === 0) {
    mdLines.push('- none');
  } else {
    for (const clue of state.reviewReady) {
      mdLines.push(`- ${clue.provider_id} ${clue.clue_field}: ${clue.clue_page_url}`);
    }
  }

  mdLines.push('', 'Queued clues:', '');
  if (state.queued.length === 0) {
    mdLines.push('- none');
  } else {
    for (const clue of state.queued) {
      mdLines.push(`- ${clue.provider_id} ${clue.clue_field} [${clue.clue_page_type || 'unknown_page'}]: ${clue.clue_page_url || clue.source_url}`);
    }
  }
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
