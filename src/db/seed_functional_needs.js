import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const FUNCTIONAL_NEEDS = [
  {
    id: 'protective-supervision',
    name: 'Protective Supervision (24/7 Safety Supervision)',
    category: 'behavioral',
    description: 'Requires continuous monitoring to prevent elopement, self-injury, pica, or other serious safety risks.',
    program_triggers: 'ihss-for-children,regional-centers',
  },
  {
    id: 'speech-therapy',
    name: 'Speech-Language Therapy & AAC Devices',
    category: 'communication',
    description: 'Needs support with speech, language, social communication, or augmentative communication devices.',
    program_triggers: 'early-start,iep-special-education,regional-centers',
  },
  {
    id: 'occupational-therapy',
    name: 'Occupational Therapy',
    category: 'daily-living',
    description: 'Needs help with fine motor skills, sensory regulation, dressing, feeding, or other daily living tasks.',
    program_triggers: 'early-start,iep-special-education,regional-centers,california-childrens-services',
  },
  {
    id: 'physical-therapy',
    name: 'Physical Therapy',
    category: 'mobility',
    description: 'Needs support with walking, balance, transfers, posture, endurance, or gross motor development.',
    program_triggers: 'early-start,iep-special-education,california-childrens-services,regional-centers',
  },
  {
    id: 'behavior-support',
    name: 'Behavior Support',
    category: 'behavioral',
    description: 'Needs behavioral assessment, parent coaching, crisis prevention, or intensive behavior intervention.',
    program_triggers: 'regional-centers,iep-special-education,early-start',
  },
  {
    id: 'respite-care',
    name: 'Respite Care (Parent Relief hours)',
    category: 'daily-living',
    description: 'Needs planned caregiver relief because the child requires ongoing supervision or high daily support.',
    program_triggers: 'regional-centers,hcba',
  },
  {
    id: 'diapers-incontinence-supplies',
    name: 'Diapers & Incontinence Briefs (Age 3+)',
    category: 'daily-living',
    description: 'Needs medically necessary continence supplies because toileting independence is delayed beyond expected age.',
    program_triggers: 'medi-cal-for-kids-and-teens',
  },
  {
    id: 'feeding-therapy',
    name: 'Feeding Therapy',
    category: 'medical',
    description: 'Needs help with chewing, swallowing, oral motor skills, or severe feeding selectivity.',
    program_triggers: 'early-start,california-childrens-services,medi-cal-for-kids-and-teens',
  },
  {
    id: 'mobility-equipment',
    name: 'Mobility Equipment',
    category: 'mobility',
    description: 'Needs a wheelchair, walker, stander, gait trainer, orthotics, or other mobility-support equipment.',
    program_triggers: 'california-childrens-services,medi-cal-for-kids-and-teens,hcba',
  },
  {
    id: 'hearing-aids',
    name: 'Hearing Aids & Accessories',
    category: 'communication',
    description: 'Needs audiology services, hearing devices, or assistive listening supports.',
    program_triggers: 'hearing-aid-coverage,california-childrens-services,iep-special-education',
  },
  {
    id: 'vision-services',
    name: 'Vision Services & Blindness Supports',
    category: 'daily-living',
    description: 'Needs low-vision supports, orientation and mobility services, Braille, or visual impairment accommodations.',
    program_triggers: 'california-childrens-services,iep-special-education',
  },
  {
    id: 'assistive-technology',
    name: 'Assistive Technology',
    category: 'communication',
    description: 'Needs adapted communication, access, learning, or sensory equipment to participate at home or school.',
    program_triggers: 'iep-special-education,regional-centers,california-childrens-services',
  },
  {
    id: 'transportation-support',
    name: 'Transportation Support',
    category: 'daily-living',
    description: 'Needs transportation help to reach school, therapies, medical visits, or community-based services.',
    program_triggers: 'iep-special-education,regional-centers,medi-cal-for-kids-and-teens',
  },
  {
    id: 'nursing-care',
    name: 'Skilled Nursing Care',
    category: 'medical',
    description: 'Needs private duty nursing, shift nursing, or complex medical oversight at home.',
    program_triggers: 'hcba,medi-cal-for-kids-and-teens',
  },
  {
    id: 'iep-evaluation',
    name: 'School District IEP Evaluation Request',
    category: 'education',
    description: 'Needs formal school-based evaluation to determine eligibility for special education and related services.',
    program_triggers: 'iep-special-education',
  },
  {
    id: 'school-accommodations',
    name: 'School Accommodations & Classroom Supports',
    category: 'education',
    description: 'Needs accommodations, related services, classroom supports, or behavior/sensory planning in school.',
    program_triggers: 'iep-special-education',
  },
  {
    id: 'transition-planning',
    name: 'Transition Planning',
    category: 'planning',
    description: 'Needs age-14+ planning for adulthood, services transition, postsecondary goals, or legal changes at 18.',
    program_triggers: 'iep-special-education,regional-centers,calable,ssi-for-children',
  },
  {
    id: 'caregiver-support',
    name: 'Caregiver Support & Parent Training',
    category: 'planning',
    description: 'Needs coaching, parent education, peer support, or system-navigation help for the caregiver.',
    program_triggers: 'regional-centers,early-start,iep-special-education',
  },
];

const DB_PATHS = [
  path.join(repoRoot, 'ca_disability_navigator.db'),
  path.join(repoRoot, 'frontend', 'ca_disability_navigator.db'),
];

const existingDbPaths = DB_PATHS.filter((dbPath) => fs.existsSync(dbPath));

if (existingDbPaths.length === 0) {
  console.error('No ca_disability_navigator.db files found.');
  process.exit(1);
}

for (const dbPath of existingDbPaths) {
  const db = new Database(dbPath);
  const upsert = db.prepare(`
    INSERT INTO functional_needs (id, name, category, description, program_triggers)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      category = excluded.category,
      description = excluded.description,
      program_triggers = excluded.program_triggers
  `);

  const tx = db.transaction((needs) => {
    for (const need of needs) {
      upsert.run(need.id, need.name, need.category, need.description, need.program_triggers);
    }
  });

  tx(FUNCTIONAL_NEEDS);
  const count = db.prepare('SELECT COUNT(*) AS count FROM functional_needs').get().count;
  db.close();
  console.log(`Seeded ${FUNCTIONAL_NEEDS.length} functional needs into ${dbPath} (total now ${count}).`);
}
