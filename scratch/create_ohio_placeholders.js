import fs from 'fs';
import path from 'path';

const dataDir = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/ohio';
const recordsDir = path.join(dataDir, 'phase_records');
const docsDir = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/docs/state-upgrades/ohio';

// Ensure directories exist
fs.mkdirSync(recordsDir, { recursive: true });
fs.mkdirSync(docsDir, { recursive: true });

// Create empty JSON files
const jsonFiles = [
  'benefits_hhs.json',
  'dd_idd.json',
  'early_intervention.json',
  'education_regional.json',
  'district_replacements.json',
  'clinics.json',
  'forms_appeals_transition.json',
  'trusted_nonprofits.json',
  'provider_legal_review_queue.json'
];

for (const file of jsonFiles) {
  fs.writeFileSync(path.join(recordsDir, file), '[]', 'utf8');
}
console.log('✓ Created blank JSON phase records for Ohio.');

// Create empty/template metadata configs
fs.writeFileSync(path.join(dataDir, 'source_targets.json'), '[]', 'utf8');
fs.writeFileSync(path.join(dataDir, 'resource_truth_map.json'), '{}', 'utf8');
fs.writeFileSync(path.join(dataDir, 'gap_analysis.json'), '{}', 'utf8');
fs.writeFileSync(path.join(dataDir, 'pull_plan.json'), '{}', 'utf8');

// Create markdown documents
fs.writeFileSync(path.join(docsDir, '00-baseline.md'), `# Ohio Baseline Audit\n\nOhio baseline metrics.`, 'utf8');
fs.writeFileSync(path.join(docsDir, '01-resource-truth-map.md'), `# Ohio Resource Truth Map\n\nOhio truth map.`, 'utf8');
fs.writeFileSync(path.join(docsDir, '02-gap-analysis.md'), `# Ohio Gap Analysis\n\nOhio gaps.`, 'utf8');
fs.writeFileSync(path.join(docsDir, '03-pull-plan.md'), `# Ohio Pull Plan\n\nOhio pull plan.`, 'utf8');
fs.writeFileSync(path.join(docsDir, '11-research-summary.md'), `# Ohio Research Summary\n\nOhio research.`, 'utf8');
console.log('✓ Created template research docs for Ohio.');
