import Database from 'better-sqlite3';
import path from 'path';
import {
  PROVIDER_ACCESSIBILITY_BUCKET_FIELD_MAP,
  PROVIDER_ACCESSIBILITY_BUCKET_PROMPTS,
  PROVIDER_ACCESSIBILITY_FOCUS_STATES,
  inferProviderAccessibilityBuckets,
  providerAccessibilityHost,
} from './provider_accessibility_review_contract.js';

const repoRoot = path.resolve(process.cwd());
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const db = new Database(dbPath);

function loadProviders() {
  return db.prepare(`
    SELECT resource_providers.id,
           resource_providers.name,
           resource_providers.categories,
           resource_providers.county_id,
           counties.state_id,
           resource_providers.source_url,
           resource_providers.next_step_type,
           resource_providers.verification_status
    FROM resource_providers
    LEFT JOIN counties ON counties.id = resource_providers.county_id
    WHERE resource_providers.source_url IS NOT NULL
      AND TRIM(resource_providers.source_url) <> ''
      AND resource_providers.verification_status IN ('official_verified', 'verified', 'human_verified', 'source_listed')
      AND counties.state_id IN (${PROVIDER_ACCESSIBILITY_FOCUS_STATES.map(() => '?').join(', ')})
    ORDER BY counties.state_id, resource_providers.id
  `).all(...PROVIDER_ACCESSIBILITY_FOCUS_STATES);
}

const providers = loadProviders();

const insertReviewQueueRow = db.prepare(`
  INSERT OR IGNORE INTO provider_accessibility_pull_results (
    id,
    provider_id,
    county_id,
    state_id,
    source_url,
    source_host,
    clue_page_url,
    clue_page_type,
    clue_field,
    clue_status,
    promotion_target_column,
    review_notes,
    created_at,
    updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'queued', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`);

let inserted = 0;
const byState = new Map();

const tx = db.transaction(() => {
  for (const provider of providers) {
    const sourceHost = providerAccessibilityHost(provider.source_url);
    const buckets = inferProviderAccessibilityBuckets(provider);

    for (const bucket of buckets) {
      const clueFields = PROVIDER_ACCESSIBILITY_BUCKET_FIELD_MAP[bucket] || [];
      for (const clueField of clueFields) {
        const id = [
          'prov-acc-review',
          provider.id,
          bucket,
          clueField,
        ].join('__');
        const reviewNotes = [
          `Seeded review task for ${provider.name}.`,
          PROVIDER_ACCESSIBILITY_BUCKET_PROMPTS[bucket] || 'Review first-party pages for explicit accessibility or intake clues.',
          'Do not promote without explicit first-party evidence captured in clue text or clue page URL.',
        ].join(' ');
        const result = insertReviewQueueRow.run(
          id,
          provider.id,
          provider.county_id,
          provider.state_id,
          provider.source_url,
          sourceHost,
          provider.source_url,
          bucket,
          clueField,
          clueField,
          reviewNotes,
        );
        if (result.changes > 0) {
          inserted += 1;
          byState.set(provider.state_id, (byState.get(provider.state_id) || 0) + 1);
        }
      }
    }
  }
});

tx();
db.close();

console.log(`Seeded provider accessibility review queue in ${dbPath}`);
console.log(JSON.stringify({
  providerCount: providers.length,
  insertedRows: inserted,
  insertedByState: Object.fromEntries([...byState.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
}, null, 2));
