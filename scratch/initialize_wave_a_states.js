import fs from 'fs';
import path from 'path';

const states = [
  { id: 'pennsylvania', code: 'PA', name: 'Pennsylvania', counties: 67 },
  { id: 'illinois', code: 'IL', name: 'Illinois', counties: 102 },
  { id: 'georgia', code: 'GA', name: 'Georgia', counties: 159 },
  { id: 'north-carolina', code: 'NC', name: 'North Carolina', counties: 100 }
];

const baseDataDir = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades';
const baseDocsDir = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/docs/state-upgrades';

for (const state of states) {
  const dataDir = path.join(baseDataDir, state.id);
  const recordsDir = path.join(dataDir, 'phase_records');
  const docsDir = path.join(baseDocsDir, state.id);

  // Ensure directories exist
  fs.mkdirSync(recordsDir, { recursive: true });
  fs.mkdirSync(docsDir, { recursive: true });

  // Create state_config.json
  const config = {
    state_id: state.id,
    state_slug: state.id,
    state_name: state.name,
    state_code: state.code,
    county_id_suffix: `-${state.code.toLowerCase()}`,
    program_id_prefix: `${state.code.toLowerCase()}-`,
    fallback_id_patterns: [
      `%-${state.code.toLowerCase()}-fallback`
    ],
    expected_counties: state.counties,
    priority_counties: [],
    phase_sequence: [
      "benefits_hhs",
      "dd_idd",
      "early_intervention",
      "education_regional",
      "district_replacements",
      "clinics",
      "forms_appeals_transition",
      "trusted_nonprofits",
      "provider_legal_review"
    ],
    routing_labels: {
      medicaid_name: `${state.name} Medicaid`,
      medicaid_agency: `${state.name} Department of Human Services`,
      dd_agency: `${state.name} Developmental Services`,
      dd_intake_label: "Regional Intake Office",
      early_intervention_label: "Early Intervention",
      education_agency_label: "Regional Education Center",
      education_agency: `${state.name} Department of Education`,
      special_education_support: "Special Education"
    },
    validation_expectations: {
      benefits_hhs_count: state.counties,
      dd_idd_count: 0,
      early_intervention_count: 0,
      education_regional_count: 0,
      district_replacements_count: 0,
      clinics_count: 0,
      forms_appeals_transition_count: 0,
      trusted_nonprofits_count: 0,
      provider_legal_review_count: 0
    }
  };

  fs.writeFileSync(path.join(dataDir, 'state_config.json'), JSON.stringify(config, null, 2), 'utf8');

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

  // Create empty config metadata files
  fs.writeFileSync(path.join(dataDir, 'source_targets.json'), '[]', 'utf8');
  fs.writeFileSync(path.join(dataDir, 'resource_truth_map.json'), '{}', 'utf8');
  fs.writeFileSync(path.join(dataDir, 'gap_analysis.json'), '{}', 'utf8');
  fs.writeFileSync(path.join(dataDir, 'pull_plan.json'), '{}', 'utf8');

  // Create template docs
  fs.writeFileSync(path.join(docsDir, '00-baseline.md'), `# ${state.name} Baseline\n`, 'utf8');
  fs.writeFileSync(path.join(docsDir, '01-resource-truth-map.md'), `# ${state.name} Truth Map\n`, 'utf8');
  fs.writeFileSync(path.join(docsDir, '02-gap-analysis.md'), `# ${state.name} Gap Analysis\n`, 'utf8');
  fs.writeFileSync(path.join(docsDir, '03-pull-plan.md'), `# ${state.name} Pull Plan\n`, 'utf8');
}

console.log('✓ Successfully initialized Pennsylvania, Illinois, Georgia, and North Carolina.');
