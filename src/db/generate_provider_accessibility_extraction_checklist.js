import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  PROVIDER_ACCESSIBILITY_FOCUS_STATES,
  inferProviderAccessibilityBuckets,
  providerAccessibilityBucketLabel,
  providerAccessibilityExtractionPrompts,
  providerAccessibilityHost,
} from './provider_accessibility_review_contract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `provider-accessibility-extraction-checklist-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-accessibility-extraction-checklist-${generatedDate}.md`);
const db = new Database(dbPath, { readonly: true });

function loadProviderRows() {
  return db.prepare(`
    SELECT resource_providers.id,
           resource_providers.name,
           resource_providers.categories,
           resource_providers.county_id,
           counties.state_id,
           resource_providers.source_url,
           resource_providers.next_step_type,
           resource_providers.phone
    FROM resource_providers
    LEFT JOIN counties ON counties.id = resource_providers.county_id
    WHERE resource_providers.source_url IS NOT NULL
      AND TRIM(resource_providers.source_url) <> ''
      AND resource_providers.verification_status IN ('official_verified','verified','human_verified','source_listed')
      AND counties.state_id IN (${PROVIDER_ACCESSIBILITY_FOCUS_STATES.map(() => '?').join(', ')})
    ORDER BY counties.state_id, resource_providers.id
  `).all(...PROVIDER_ACCESSIBILITY_FOCUS_STATES);
}

const providerRows = loadProviderRows();
const byState = new Map();

for (const row of providerRows) {
  const stateId = row.state_id;
  const buckets = inferProviderAccessibilityBuckets(row);
  const state = byState.get(stateId) || {
    stateId,
    providers: [],
    buckets: {},
  };

  const providerEntry = {
    id: row.id,
    name: row.name,
    sourceUrl: row.source_url,
    sourceHost: providerAccessibilityHost(row.source_url),
    categories: row.categories,
    nextStepType: row.next_step_type || null,
    buckets,
  };

  state.providers.push(providerEntry);

  for (const bucket of buckets) {
    if (!state.buckets[bucket]) {
      state.buckets[bucket] = {
        id: bucket,
        label: providerAccessibilityBucketLabel(bucket),
        prompts: providerAccessibilityExtractionPrompts(bucket),
        providers: [],
      };
    }
    state.buckets[bucket].providers.push(providerEntry);
  }

  byState.set(stateId, state);
}

const states = PROVIDER_ACCESSIBILITY_FOCUS_STATES.map((stateId) => {
  const state = byState.get(stateId) || { stateId, providers: [], buckets: {} };
  return {
    stateId,
    providerCount: state.providers.length,
    buckets: Object.values(state.buckets).sort((a, b) => a.label.localeCompare(b.label)),
  };
});

const report = {
  generatedAt: generatedDate,
  dbPath,
  states,
};

const mdLines = [
  '# Provider Accessibility Extraction Checklist',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This checklist groups active provider accessibility pulls by the page locations most likely to expose truthful accessibility clues. It is designed to make first-party review faster without inventing claims.',
];

for (const state of states) {
  mdLines.push('', `## ${state.stateId}`, '');
  mdLines.push(`- trusted provider rows in scope: ${state.providerCount}`);

  for (const bucket of state.buckets) {
    mdLines.push('', `### ${bucket.label}`, '');
    for (const prompt of bucket.prompts) {
      mdLines.push(`- ${prompt}`);
    }
    mdLines.push('', 'Targets:', '');
    for (const provider of bucket.providers) {
      mdLines.push(`- ${provider.id}: ${provider.sourceUrl} | categories=${provider.categories || 'none'} | next_step=${provider.nextStepType || 'none'} | host=${provider.sourceHost || 'unknown'}`);
    }
  }
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
