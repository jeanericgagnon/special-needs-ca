import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const db = new Database(dbPath);

function getCoreWaitlistPrograms(stateId, stateCode) {
  if (stateId === 'california') {
    return [
      'ihss-for-children',
      'regional-centers',
      'early-start',
      'self-determination-program',
      'medi-cal-for-kids-and-teens',
      'california-childrens-services',
      'hearing-aid-coverage',
      'ssi-for-children',
      'calable',
      'iep-special-education',
      'hcba',
    ];
  }
  if (stateId === 'texas') {
    return ['tx-hcs', 'tx-class', 'tx-txhml', 'tx-mdcp', 'tx-eci', 'tx-tea-sped'];
  }
  if (stateId === 'new-york') {
    return ['ny-opwdd-waiver', 'ny-opwdd-self-direction', 'ny-medicaid'];
  }
  if (stateId === 'pennsylvania') {
    return ['pa-consolidated-waiver', 'pa-community-living-waiver', 'pa-medicaid'];
  }
  if (stateId === 'florida') {
    return ['fl-ibudget', 'fl-cdc-plus', 'fl-medicaid-dcf'];
  }
  if (stateId === 'illinois') {
    return ['il-childrens-support-waiver', 'il-adults-dd-waiver', 'il-medicaid'];
  }
  if (stateId === 'ohio') {
    return ['oh-individual-options-waiver', 'oh-level-one-waiver', 'oh-medicaid'];
  }
  if (stateId === 'georgia') {
    return ['ga-comp-waiver', 'ga-now-waiver', 'ga-medicaid'];
  }
  return [`${stateCode}-dd-waiver`, `${stateCode}-dd-self-direction`, `${stateCode}-medicaid`];
}

function buildTemplate(program) {
  const programId = program.id;
  const name = program.name;
  const officialSourceUrl = program.official_source_url || program.source_url || '';
  const checkedAt = new Date().toISOString();

  if (/calable|able/i.test(programId) || /able account/i.test(name)) {
    return {
      id: `wl-${programId}`,
      program_id: programId,
      name: `${name} Enrollment Status`,
      duration_label: 'No statewide waitlist published',
      duration_months: 0,
      status: 'standard',
      description: `Ablefull links the official source for ${name}. The public program source does not present this as a statewide waiting-list program, so families should use the official enrollment steps directly.`,
      reserve_capacity_notice: null,
      legal_deadline: 'Use the official enrollment source for current account opening requirements.',
      last_scraped_at: checkedAt,
      estimate_source_url: officialSourceUrl,
      estimate_source_type: 'official_program_page',
      last_checked_at: checkedAt.slice(0, 10),
    };
  }

  if (/iep|special-education|tea-sped/i.test(programId) || /special education|IEP/i.test(name)) {
    return {
      id: `wl-${programId}`,
      program_id: programId,
      name: `${name} Evaluation Timeline`,
      duration_label: 'District timeline varies',
      duration_months: 1,
      status: 'priority',
      description: `Ablefull links the official source for ${name}. A single statewide queue estimate is not published here; families should request written evaluation or service timelines from the responsible district or agency as soon as they apply.`,
      reserve_capacity_notice: null,
      legal_deadline: 'IDEA and state special education timelines apply after a written request is submitted.',
      last_scraped_at: checkedAt,
      estimate_source_url: officialSourceUrl,
      estimate_source_type: 'official_program_page',
      last_checked_at: checkedAt.slice(0, 10),
    };
  }

  if (/early-start|tx-eci|early childhood intervention/i.test(programId) || /early start|early childhood intervention/i.test(name)) {
    return {
      id: `wl-${programId}`,
      program_id: programId,
      name: `${name} Intake Timeline`,
      duration_label: 'Intake timeline varies by provider',
      duration_months: 1,
      status: 'priority',
      description: `Ablefull links the official source for ${name}. A statewide waiting-list estimate is not published here; families should request intake timing directly from the regional early intervention contact listed by the program.`,
      reserve_capacity_notice: null,
      legal_deadline: 'Early intervention intake and IFSP timelines are governed by state and federal early intervention rules.',
      last_scraped_at: checkedAt,
      estimate_source_url: officialSourceUrl,
      estimate_source_type: 'official_program_page',
      last_checked_at: checkedAt.slice(0, 10),
    };
  }

  if (/medicaid|medi-cal|access|gateway|compass/i.test(programId) || /medicaid|medi-cal|access/i.test(name)) {
    return {
      id: `wl-${programId}`,
      program_id: programId,
      name: `${name} Application Processing`,
      duration_label: 'Application timeline varies by agency',
      duration_months: 1,
      status: 'standard',
      description: `Ablefull links the official source for ${name}. We have not extracted a single statewide waitlist estimate for this program; families should apply immediately and ask the administering agency to confirm the current processing timeline.`,
      reserve_capacity_notice: null,
      legal_deadline: 'Follow the official agency source for current processing and notice requirements.',
      last_scraped_at: checkedAt,
      estimate_source_url: officialSourceUrl,
      estimate_source_type: 'official_program_page',
      last_checked_at: checkedAt.slice(0, 10),
    };
  }

  if (/self-direction|waiver|level-one|community-living|adults-dd|comp|now/i.test(programId) || /waiver|self-direction/i.test(name)) {
    return {
      id: `wl-${programId}`,
      program_id: programId,
      name: `${name} Enrollment Queue`,
      duration_label: 'Statewide estimate not yet extracted',
      duration_months: 3,
      status: 'moderate',
      description: `Ablefull links the official source for ${name}. This record confirms the core queue or enrollment layer exists, but a reliable statewide wait estimate is not yet extracted here. Families should join the official interest, intake, or enrollment pathway as early as possible and confirm current timing with the administering agency.`,
      reserve_capacity_notice: null,
      legal_deadline: 'Use the official program source for current enrollment and notice rules.',
      last_scraped_at: checkedAt,
      estimate_source_url: officialSourceUrl,
      estimate_source_type: 'official_program_page',
      last_checked_at: checkedAt.slice(0, 10),
    };
  }

  return {
    id: `wl-${programId}`,
    program_id: programId,
    name: `${name} Access Timeline`,
    duration_label: 'Official source linked; timing varies',
    duration_months: 1,
    status: 'standard',
    description: `Ablefull links the official source for ${name}. A single statewide wait or processing estimate is not yet extracted here, so families should confirm current timing directly with the administering agency.`,
    reserve_capacity_notice: null,
    legal_deadline: 'Follow the official program source for current timing and notice rules.',
    last_scraped_at: checkedAt,
    estimate_source_url: officialSourceUrl,
    estimate_source_type: 'official_program_page',
    last_checked_at: checkedAt.slice(0, 10),
  };
}

const states = db.prepare('SELECT id, code FROM states ORDER BY id').all();
const existingProgramIds = new Set(
  db.prepare('SELECT DISTINCT program_id FROM program_waitlists').all().map((row) => row.program_id)
);

const findProgram = db.prepare('SELECT id, name, official_source_url, source_url FROM programs WHERE id = ?');
const insertWaitlist = db.prepare(`
  INSERT INTO program_waitlists (
    id, program_id, name, duration_label, duration_months, status, description,
    reserve_capacity_notice, legal_deadline, last_scraped_at, estimate_source_url,
    estimate_source_type, last_checked_at
  ) VALUES (
    @id, @program_id, @name, @duration_label, @duration_months, @status, @description,
    @reserve_capacity_notice, @legal_deadline, @last_scraped_at, @estimate_source_url,
    @estimate_source_type, @last_checked_at
  )
`);

const inserted = [];
const missingPrograms = [];

const tx = db.transaction(() => {
  for (const state of states) {
    const expectedPrograms = getCoreWaitlistPrograms(state.id, state.code.toLowerCase());
    for (const programId of expectedPrograms) {
      if (existingProgramIds.has(programId)) continue;

      const program = findProgram.get(programId);
      if (!program) {
        missingPrograms.push(programId);
        continue;
      }

      const record = buildTemplate(program);
      insertWaitlist.run(record);
      existingProgramIds.add(programId);
      inserted.push(programId);
    }
  }
});

tx();

console.log(`Inserted ${inserted.length} missing core waitlist records.`);
if (inserted.length > 0) {
  console.log(inserted.join(', '));
}
if (missingPrograms.length > 0) {
  console.log(`Programs still missing from programs table: ${missingPrograms.join(', ')}`);
}

db.close();
