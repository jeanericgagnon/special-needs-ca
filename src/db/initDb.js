import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const schemaPath = path.resolve(__dirname, './schema.sql');

console.log(`⏳ Initializing SQLite database at: ${dbPath}...`);

// Remove old database if exists to ensure clean state
if (fs.existsSync(dbPath)) {
  console.log('  🗑️  Deleting old database file to ensure clean, normalized state...');
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// 1. Compile schema.sql DDL
try {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
  console.log('  ✅ Database relational tables created successfully!');
} catch (err) {
  console.error('  ❌ Error creating relational tables:', err);
  process.exit(1);
}

// 2. Seeding Datasets
console.log('⏳ Seeding exhaustive MVP datasets into relational tables...');

// Counties Seed
const seedCounties = [
  { id: 'los-angeles', name: 'Los Angeles', website: 'https://lacounty.gov' },
  { id: 'orange', name: 'Orange County', website: 'https://ocgov.com' },
  { id: 'alameda', name: 'Alameda County', website: 'https://alamedacountyca.gov' },
  { id: 'san-francisco', name: 'San Francisco', website: 'https://sf.gov' }
];

const insertCounty = db.prepare('INSERT OR REPLACE INTO counties (id, name, website) VALUES (?, ?, ?)');
const seedCountiesTx = db.transaction((countiesList) => {
  for (const c of countiesList) {
    insertCounty.run(c.id, c.name, c.website);
  }
});
seedCountiesTx(seedCounties);
console.log(`  ✓ Seeded ${seedCounties.length} California Counties.`);

// Programs Seed
const seedPrograms = [
  {
    id: 'ihss-for-children',
    name: 'In-Home Supportive Services (IHSS) for Children',
    description: 'Pays a caregiver (including a parent) to provide essential supervision and care for a child with a severe disability to keep them safely in their own home.',
    who_it_is_for: 'Children under 18 with severe developmental delays, autism, cerebral palsy, or medical fragile profiles who need more safety supervision than a typically developing child.',
    who_might_qualify: 'California resident, active Medi-Cal (often via Regional Center waiver), and a documented medical certification of self-injurious behaviors or elopement.',
    official_source_url: 'https://www.cdss.ca.gov/in-home-supportive-services',
    category: 'state',
    confidence_score: 5,
    last_verified_date: '2026-05-18'
  },
  {
    id: 'regional-centers',
    name: 'California Regional Centers (Lanterman Act)',
    description: 'Lifelong service coordination network funding respite care, adaptive behavioral support, and social skills coaching for children and adults with developmental disabilities.',
    who_it_is_for: 'Individuals with developmental disabilities originating before age 18 (Autism, Down Syndrome, Cerebral Palsy, Epilepsy, or Fifth Category conditions) that are expected to continue indefinitely.',
    who_might_qualify: 'Diagnosis matching one of 5 developmental categories plus substantial limitations in at least 3 out of 7 major life domains (self-care, communication, learning, etc.).',
    official_source_url: 'https://www.dds.ca.gov',
    category: 'state',
    confidence_score: 5,
    last_verified_date: '2026-05-20'
  },
  {
    id: 'early-start',
    name: 'California Early Start (Early Intervention)',
    description: 'California\'s system of early intervention services for infants and toddlers from birth to 36 months who have significant developmental delays or established high-risk conditions.',
    who_it_is_for: 'Infants and toddlers (0 to 3 years old) and their families.',
    who_might_qualify: 'Under 36 months of age, with a 25% or greater delay in motor, speech, cognitive, or adaptive domains, or high-risk established conditions.',
    official_source_url: 'https://www.dds.ca.gov/services/early-start/',
    category: 'state',
    confidence_score: 5,
    last_verified_date: '2026-05-10'
  },
  {
    id: 'medi-cal-for-kids-and-teens',
    name: 'Medi-Cal for Kids & Teens (EPSDT)',
    description: 'Free healthcare and developmental medical therapy program for eligible youth under age 21, guaranteeing checkups, dental, vision, mental health, and medically necessary therapies.',
    who_it_is_for: 'Children and teens up to age 21.',
    who_might_qualify: 'Low-income households under 266% FPL, or children with developmental delays who bypass family wealth limits via Regional Center institutional deeming waivers.',
    official_source_url: 'https://www.dhcs.ca.gov/services/medi-cal/Pages/default.aspx',
    category: 'state',
    confidence_score: 5,
    last_verified_date: '2026-05-05'
  },
  {
    id: 'california-childrens-services',
    name: 'California Children\'s Services (CCS)',
    description: 'A state program that coordinates and pays for specialized pediatric medical care, surgery, wheel-chairs, and school Medical Therapy Unit (MTU) physical/occupational therapies.',
    who_it_is_for: 'Children under 21 with chronic, complex physical, orthopedic, visual, or audiological diagnoses (cerebral palsy, spina bifida, muscular dystrophy, deafness, statutory blindness).',
    who_might_qualify: 'Resident under 21, has CCS-eligible diagnosis, and household income below $40,000 (waived for school-based Medical Therapy Program therapies).',
    official_source_url: 'https://www.dhcs.ca.gov/services/ccs/Pages/default.aspx',
    category: 'state',
    confidence_score: 5,
    last_verified_date: '2026-05-14'
  },
  {
    id: 'iep-special-education',
    name: 'Individualized Education Program (IEP) / Special Education',
    description: 'Legally binding public school document detailing academic accommodations, behavior support, assistive devices, and speech/OT/PT therapies for qualifying disabled students.',
    who_it_is_for: 'School-aged children (ages 3 to 22) who reside in California.',
    who_might_qualify: 'Must qualify under 1 out of 13 federal special education eligibility categories and require specialized instruction to access the standard curriculum.',
    official_source_url: 'https://www.cde.ca.gov/sp/se/',
    category: 'state',
    confidence_score: 5,
    last_verified_date: '2026-05-22'
  },
  {
    id: 'ssi-for-children',
    name: 'Supplemental Security Income (SSI) for Children',
    description: 'Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and automatic Medi-Cal coverage to low-income disabled children.',
    who_it_is_for: 'Children under age 18 with severe physical or mental impairments.',
    who_might_qualify: 'Child meets SSA definition of medical disability (severe marked limitation expected to exceed 12 months) and household falls within resource limits ($2,000 resource ceiling).',
    official_source_url: 'https://www.ssa.gov/benefits/disability/apply-child.html',
    category: 'federal',
    confidence_score: 5,
    last_verified_date: '2026-05-11'
  },
  {
    id: 'calable',
    name: 'CalABLE (ABLE Accounts)',
    description: 'Tax-advantaged savings and investment portal letting families save money for future therapy, college, or housing, completely protected from public benefit resource limits (SSI/Medi-Cal).',
    who_it_is_for: 'Individuals who developed a significant disability before age 26.',
    who_might_qualify: 'Disability originated prior to age 26, and is eligible for SSI/SSDI or has a physician-certified chronic impairment.',
    official_source_url: 'https://calable.ca.gov',
    category: 'state',
    confidence_score: 5,
    last_verified_date: '2026-05-19'
  },
  {
    id: 'hearing-aid-coverage',
    name: 'Hearing Aid Coverage for Children Program (HACCP)',
    description: 'California state program covering audiology tests and hearing aid fittings for children who do not qualify for full-scope Medi-Cal and lack hearing coverage.',
    who_it_is_for: 'Children under age 21 with sensorineural or conductive hearing loss.',
    who_might_qualify: 'Under 21, California resident, family income under 600% FPL, and private health insurance excludes hearing aid devices.',
    official_source_url: 'https://www.dhcs.ca.gov/services/Pages/HACCP.aspx',
    category: 'state',
    confidence_score: 5,
    last_verified_date: '2026-04-12'
  }
];

const insertProgram = db.prepare(`
  INSERT OR REPLACE INTO programs 
  (id, name, description, who_it_is_for, who_might_qualify, official_source_url, category, confidence_score, last_verified_date) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const seedProgramsTx = db.transaction((progs) => {
  for (const p of progs) {
    insertProgram.run(p.id, p.name, p.description, p.who_it_is_for, p.who_might_qualify, p.official_source_url, p.category, p.confidence_score, p.last_verified_date);
  }
});
seedProgramsTx(seedPrograms);
console.log(`  ✓ Seeded ${seedPrograms.length} California/Federal Programs.`);

// Eligibility Rules Seed
const seedRules = [
  // Early Start Rules
  { id: 'rule-es-1', program_id: 'early-start', min_age_years: 0.0, max_age_years: 3.0, required_condition: null, required_need: 'speech-therapy', insurance_status: 'any', school_status: 'any', trigger_reason: 'Child is under age 3 and has active speech delay or therapeutic needs; Early Start IFSP evaluation is recommended.' },
  { id: 'rule-es-2', program_id: 'early-start', min_age_years: 0.0, max_age_years: 3.0, required_condition: null, required_need: 'feeding-therapy', insurance_status: 'any', school_status: 'any', trigger_reason: 'Child under 3 with swallowing/feeding needs qualifies for early intervention physical support.' },
  // Regional Center Rules
  { id: 'rule-rc-1', program_id: 'regional-centers', min_age_years: 3.0, max_age_years: 120.0, required_condition: 'down-syndrome', required_need: null, insurance_status: 'any', school_status: 'any', trigger_reason: 'Down Syndrome is a genetic/developmental listing that matches Lanterman Act categories (Intellectual Disability/Fifth Category) after age 3.' },
  { id: 'rule-rc-2', program_id: 'regional-centers', min_age_years: 3.0, max_age_years: 120.0, required_condition: 'autism', required_need: null, insurance_status: 'any', school_status: 'any', trigger_reason: 'Autism is a primary qualifying category for California Regional Centers.' },
  // IHSS Rules
  { id: 'rule-ihss-1', program_id: 'ihss-for-children', min_age_years: 0.0, max_age_years: 18.0, required_condition: null, required_need: 'protective-supervision', insurance_status: 'any', school_status: 'any', trigger_reason: 'Child profile exhibits a critical lack of safety awareness (elopement, pica, self-injury) requiring 24/7 Protective Supervision care.' },
  { id: 'rule-ihss-2', program_id: 'ihss-for-children', min_age_years: 3.0, max_age_years: 18.0, required_condition: null, required_need: 'diapers-incontinence-supplies', insurance_status: 'any', school_status: 'any', trigger_reason: 'Incontinence after age 36 months represents an eligible personal care delay; screen for IHSS hours.' },
  // IEP Rules
  { id: 'rule-iep-1', program_id: 'iep-special-education', min_age_years: 3.0, max_age_years: 22.0, required_condition: null, required_need: 'iep-evaluation', insurance_status: 'any', school_status: 'any', trigger_reason: 'School-aged child exhibits speech, developmental, or academic needs requiring a formal school district IEP assessment.' },
  // CCS Rules
  { id: 'rule-ccs-1', program_id: 'california-childrens-services', min_age_years: 0.0, max_age_years: 21.0, required_condition: 'hearing-loss', required_need: null, insurance_status: 'any', school_status: 'any', trigger_reason: 'Hearing loss is a CCS eligible physical medical condition for specialized audiology and device coverage.' },
  { id: 'rule-ccs-2', program_id: 'california-childrens-services', min_age_years: 0.0, max_age_years: 21.0, required_condition: 'vision-impairment', required_need: null, insurance_status: 'any', school_status: 'any', trigger_reason: 'Blindness or cortical visual impairment triggers eligibility for CCS medical eye specialists.' },
  { id: 'rule-ccs-3', program_id: 'california-childrens-services', min_age_years: 0.0, max_age_years: 21.0, required_condition: 'down-syndrome', required_need: null, insurance_status: 'any', school_status: 'any', trigger_reason: 'Down Syndrome is an established high-risk medical condition qualifying for CCS specialized medical care and MTP physical/occupational therapies.' },
  // SSI Rules
  { id: 'rule-ssi-1', program_id: 'ssi-for-children', min_age_years: 0.0, max_age_years: 18.0, required_condition: 'down-syndrome', required_need: null, insurance_status: 'any', school_status: 'any', trigger_reason: 'Down Syndrome automatically satisfies the childhood disability medical listing (Listing 110.06) for cash benefits.' }
];

const insertRule = db.prepare(`
  INSERT OR REPLACE INTO program_eligibility_rules 
  (id, program_id, min_age_years, max_age_years, required_condition, required_need, insurance_status, school_status, trigger_reason) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const seedRulesTx = db.transaction((rules) => {
  for (const r of rules) {
    insertRule.run(r.id, r.program_id, r.min_age_years, r.max_age_years, r.required_condition, r.required_need, r.insurance_status, r.school_status, r.trigger_reason);
  }
});
seedRulesTx(seedRules);
console.log(`  ✓ Seeded ${seedRules.length} Program Eligibility Rules.`);

// Document Requirements Seed
const seedDocs = [
  { id: 'doc-req-1', program_id: 'ihss-for-children', name: 'SOC 873 Medical Certification Form', description: 'Pediatrician completed form certifying chronic physical/mental impairment and safety risks.', is_mandatory: 1 },
  { id: 'doc-req-2', program_id: 'ihss-for-children', name: '24-hour Daily Care & Supervision Log', description: 'Log tracking safety hazards, self-injurious attempts, and interventions performed.', is_mandatory: 0 },
  { id: 'doc-req-3', program_id: 'regional-centers', name: 'Clinical Neuropsychological Evaluation', description: 'Formal psychological report determining developmental milestones and intelligence ratings.', is_mandatory: 1 },
  { id: 'doc-req-4', program_id: 'iep-special-education', name: 'Parent Assessment Request Letter', description: 'A dated, signed written request submitted to the school principal requesting psycho-educational assessments.', is_mandatory: 1 }
];

const insertDocReq = db.prepare('INSERT OR REPLACE INTO program_document_requirements (id, program_id, name, description, is_mandatory) VALUES (?, ?, ?, ?, ?)');
const seedDocsTx = db.transaction((docs) => {
  for (const d of docs) {
    insertDocReq.run(d.id, d.program_id, d.name, d.description, d.is_mandatory);
  }
});
seedDocsTx(seedDocs);
console.log(`  ✓ Seeded ${seedDocs.length} Document Requirements.`);

// Application Steps Seed
const seedSteps = [
  { id: 'step-ihss-1', program_id: 'ihss-for-children', step_number: 1, title: 'Call County IHSS Helpline', action_description: 'Initiate application by phone. Social worker will log names and mail a package.', apply_url_or_contact: 'County office helpline' },
  { id: 'step-ihss-2', program_id: 'ihss-for-children', step_number: 2, title: 'Pediatrician signs SOC 873', action_description: 'Pediatrician must certify child has a chronic impairment and sign within 45 days.', apply_url_or_contact: 'Local Pediatrician' },
  { id: 'step-rc-1', program_id: 'regional-centers', step_number: 1, title: 'Submit Referral Webform', action_description: 'Complete online intake referral form with birth records and clinical reports attached.', apply_url_or_contact: 'Regional Center Portal' }
];

const insertStep = db.prepare('INSERT OR REPLACE INTO program_application_steps (id, program_id, step_number, title, action_description, apply_url_or_contact) VALUES (?, ?, ?, ?, ?, ?)');
const seedStepsTx = db.transaction((steps) => {
  for (const s of steps) {
    insertStep.run(s.id, s.program_id, s.step_number, s.title, s.action_description, s.apply_url_or_contact);
  }
});
seedStepsTx(seedSteps);
console.log(`  ✓ Seeded ${seedSteps.length} Application Steps.`);

// Appeal Info Seed
db.prepare(`
  INSERT OR REPLACE INTO program_appeal_info 
  (program_id, deadline_days, appeal_steps, denial_reasons, appeal_form_name, official_appeal_source_url) 
  VALUES (?, ?, ?, ?, ?, ?)
`).run(
  'ihss-for-children',
  '90 days',
  '1. Complete State Hearing request on NA 690 slip.\n2. Submit daily logs, clinical assessments, and school behavior logs.\n3. Participate in phone/video hearing with CDSS Administrative Law Judge.',
  'Claims parent provider care covers all safety risks; claims child does not show active wandering behavior.',
  'Notice of Action back side appeal request (NA 690)',
  'https://www.cdss.ca.gov/hearing-requests'
);
console.log('  ✓ Seeded Program Appeal Info.');

// Regional Centers Seed
const seedRCs = [
  {
    id: 'lanterman',
    name: 'Frank D. Lanterman Regional Center',
    counties_served: 'los-angeles',
    catchment_boundaries: 'Serves Central Los Angeles, Glendale, Pasadena, La Cañada, and Burbank.',
    website: 'https://lanterman.org',
    intake_phone: '(213) 383-1300',
    early_start_contact: 'Phone: (213) 252-5600, Email: earlystartintake@lanterman.org',
    lanterman_intake_contact: 'Phone: (213) 252-5699, Email: intake@lanterman.org',
    eligibility_info_page: 'https://lanterman.org/eligibility',
    services_page: 'https://lanterman.org/services',
    appeals_info: 'https://lanterman.org/appeals_and_complaints',
    frc_relationship: 'Koch-Young Family Resource Center shares same headquarters building.',
    office_locations: '3303 Wilshire Blvd, Los Angeles, CA 90010',
    languages: 'English, Spanish, Korean, Armenian, Tagalog',
    last_verified_date: '2026-04-10',
    source_urls: 'https://lanterman.org'
  },
  {
    id: 'golden-gate',
    name: 'Golden Gate Regional Center',
    counties_served: 'san-francisco',
    catchment_boundaries: 'Serves San Francisco, Marin, and San Mateo counties.',
    website: 'https://ggrc.org',
    intake_phone: '(415) 546-9222',
    early_start_contact: 'Phone: (415) 832-5160, Email: earlystart@ggrc.org',
    lanterman_intake_contact: 'Phone: (415) 546-9222, Email: intake@ggrc.org',
    eligibility_info_page: 'https://ggrc.org/services/eligibility',
    services_page: 'https://ggrc.org/services',
    appeals_info: 'https://ggrc.org/rights-appeals',
    frc_relationship: 'Partners with Support for Families of Children with Disabilities.',
    office_locations: '1355 Market St, Suite 220, San Francisco, CA 94103',
    languages: 'English, Spanish, Cantonese, Mandarin, Tagalog',
    last_verified_date: '2026-05-15',
    source_urls: 'https://ggrc.org'
  }
];

const insertRC = db.prepare(`
  INSERT OR REPLACE INTO regional_centers 
  (id, name, counties_served, catchment_boundaries, website, intake_phone, early_start_contact, lanterman_intake_contact, eligibility_info_page, services_page, appeals_info, frc_relationship, office_locations, languages, last_verified_date, source_urls) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const seedRCsTx = db.transaction((rcs) => {
  for (const rc of rcs) {
    insertRC.run(rc.id, rc.name, rc.counties_served, rc.catchment_boundaries, rc.website, rc.intake_phone, rc.early_start_contact, rc.lanterman_intake_contact, rc.eligibility_info_page, rc.services_page, rc.appeals_info, rc.frc_relationship, rc.office_locations, rc.languages, rc.last_verified_date, rc.source_urls);
  }
});
seedRCsTx(seedRCs);
console.log(`  ✓ Seeded ${seedRCs.length} Regional Centers.`);

// County Offices Seed
const seedOffices = [
  { id: 'off-la-ihss', county_id: 'los-angeles', program_id: 'ihss-for-children', office_name: 'LA County DPSS - IHSS Helpline', address: '2707 S. Grand Ave, Los Angeles, CA 90007', phone: '(888) 944-4477', email: 'ihssintake@dpss.lacounty.gov', website: 'https://dpss.lacounty.gov' },
  { id: 'off-la-ccs', county_id: 'los-angeles', program_id: 'california-childrens-services', office_name: 'Los Angeles County CCS Dept', address: '9320 Telstar Ave, El Monte, CA 91731', phone: '(800) 288-4584', email: 'ccs@ph.lacounty.gov', website: 'https://publichealth.lacounty.gov/cms/ccs' },
  { id: 'off-oc-ihss', county_id: 'orange', program_id: 'ihss-for-children', office_name: 'OC SSA - Adult & Child IHSS Intake', address: '1505 E Warner Ave, Santa Ana, CA 92705', phone: '(714) 825-3000', email: 'ihss@ssa.ocgov.com', website: 'https://ssa.ocgov.com' }
];

const insertOffice = db.prepare('INSERT OR REPLACE INTO county_offices (id, county_id, program_id, office_name, address, phone, email, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
const seedOfficesTx = db.transaction((offices) => {
  for (const o of offices) {
    insertOffice.run(o.id, o.county_id, o.program_id, o.office_name, o.address, o.phone, o.email, o.website);
  }
});
seedOfficesTx(seedOffices);
console.log(`  ✓ Seeded ${seedOffices.length} County Offices.`);

// School Districts Seed
const seedDistricts = [
  { id: 'sd-la-usd', county_id: 'los-angeles', name: 'Los Angeles Unified School District (LAUSD)', spec_ed_contact_phone: '(213) 241-6701', spec_ed_contact_email: 'sp-ed-parent@lausd.net', website: 'https://achieve.lausd.net/sped' },
  { id: 'sd-sa-usd', county_id: 'orange', name: 'Santa Ana Unified School District (SAUSD)', spec_ed_contact_phone: '(714) 558-5832', spec_ed_contact_email: 'specialed@sausd.us', website: 'https://sausd.us' }
];

const insertDistrict = db.prepare('INSERT OR REPLACE INTO school_districts (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website) VALUES (?, ?, ?, ?, ?, ?)');
const seedDistrictsTx = db.transaction((districts) => {
  for (const sd of districts) {
    insertDistrict.run(sd.id, sd.county_id, sd.name, sd.spec_ed_contact_phone, sd.spec_ed_contact_email, sd.website);
  }
});
seedDistrictsTx(seedDistricts);
console.log(`  ✓ Seeded ${seedDistricts.length} School Districts.`);

// Conditions Seed
const seedConditions = [
  {
    id: 'down-syndrome',
    name: 'Down Syndrome (Trisomy 21)',
    aliases: 'Trisomy 21, Downs, DS',
    parent_friendly_explanation: 'A genetic condition caused by an extra copy of chromosome 21, leading to low muscle tone (hypotonia), speech delays, developmental blocks, and increased risk of heart/vision conditions.',
    regional_center_relevance: 1,
    iep_relevance: 1,
    ccs_relevance: 1,
    ssi_relevance: 1,
    cal_able_relevance: 1,
    age_specific_notes: 'Birth to 3 focus on Early Start physical/speech therapies. Transition to school IEP at age 3. CalABLE accounts protect savings during teen years. At 18, transfer educational rights and secure adult SSI.',
    source_url: 'https://www.ndss.org',
    last_verified_date: '2026-05-01'
  },
  {
    id: 'autism',
    name: 'Autism Spectrum Disorder (ASD)',
    aliases: 'Autism, ASD, Aspergers',
    parent_friendly_explanation: 'A developmental condition that affects social interaction, communication milestones, sensory integration, and self-regulatory behaviors.',
    regional_center_relevance: 1,
    iep_relevance: 1,
    ccs_relevance: 0,
    ssi_relevance: 1,
    cal_able_relevance: 1,
    age_specific_notes: 'Early detection triggers intensive Early Start behavioral supports. School IEP goals focus on speech and behavior. Transition services are critical age 16+.',
    source_url: 'https://www.autismspeaks.org',
    last_verified_date: '2026-05-12'
  },
  {
    id: 'hearing-loss',
    name: 'Hearing Loss & Deafness',
    aliases: 'Deaf, Hard of Hearing, Bilateral Sensorineural Loss',
    parent_friendly_explanation: 'Partial or complete hearing loss in one or both ears, requiring specialized testing, DHH specialized instruction, or hearing aids.',
    regional_center_relevance: 0,
    iep_relevance: 1,
    ccs_relevance: 1,
    ssi_relevance: 1,
    cal_able_relevance: 1,
    age_specific_notes: 'Newborn auditory tests trigger early start. Public school provides FM hearing loop accessories and speech therapists.',
    source_url: 'https://www.cdc.gov/ncbddd/hearingloss',
    last_verified_date: '2026-04-18'
  },
  {
    id: 'vision-impairment',
    name: 'Vision Impairment & Blindness',
    aliases: 'Low Vision, Blind, Statutory Blindness, CVI',
    parent_friendly_explanation: 'Significant vision loss that cannot be corrected by glasses or medicine, impacting a child\'s ability to navigate and learn without specialized aids.',
    regional_center_relevance: 0,
    iep_relevance: 1,
    ccs_relevance: 1,
    ssi_relevance: 1,
    cal_able_relevance: 1,
    age_specific_notes: 'Requires Orientation & Mobility (O&M) assessments early. IEP requires TVI (Teacher of Visual Impairments) accommodations.',
    source_url: 'https://www.afb.org',
    last_verified_date: '2026-04-20'
  }
];

const insertCondition = db.prepare(`
  INSERT OR REPLACE INTO conditions 
  (id, name, aliases, parent_friendly_explanation, regional_center_relevance, iep_relevance, ccs_relevance, ssi_relevance, cal_able_relevance, age_specific_notes, source_url, last_verified_date) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const seedConditionsTx = db.transaction((conds) => {
  for (const c of conds) {
    insertCondition.run(c.id, c.name, c.aliases, c.parent_friendly_explanation, c.regional_center_relevance, c.iep_relevance, c.ccs_relevance, c.ssi_relevance, c.cal_able_relevance, c.age_specific_notes, c.source_url, c.last_verified_date);
  }
});
seedConditionsTx(seedConditions);
console.log(`  ✓ Seeded ${seedConditions.length} Conditions in Taxonomy.`);

// Functional Needs Seed
const seedNeeds = [
  { id: 'protective-supervision', name: 'Protective Supervision (24/7 Safety Supervision)', category: 'behavioral', description: 'Requires continuous visual monitoring to prevent severe elopement, self-injury, or choking pica hazards.', program_triggers: 'ihss-for-children' },
  { id: 'speech-therapy', name: 'Speech-Language Therapy & AAC Devices', category: 'communication', description: 'Needs vocabulary instruction, pronunciation coaching, or specialized communication tablet software.', program_triggers: 'early-start,iep-special-education,regional-centers' },
  { id: 'respite-care', name: 'Respite Care (Parent Relief hours)', category: 'daily-living', description: 'Requires in-home or out-of-home caregiver relief hours due to child\'s developmental behaviors.', program_triggers: 'regional-centers' },
  { id: 'hearing-aids', name: 'Hearing Aids & Accessories', category: 'communication', description: 'Requires audiological assessments, device fits, or cochlear implants.', program_triggers: 'hearing-aid-coverage,california-childrens-services' },
  { id: 'vision-services', name: 'Vision Teacher & Braille Aids', category: 'daily-living', description: 'Requires DHH visual specialist or tactile learning aids.', program_triggers: 'california-childrens-services,iep-special-education' },
  { id: 'diapers-incontinence-supplies', name: 'Diapers & Incontinence Briefs (Age 3+)', category: 'daily-living', description: 'Delayed bowel/bladder training due to developmental milestones. Briefs covered by Medi-Cal after 3rd birthday.', program_triggers: 'medi-cal-for-kids-and-teens' },
  { id: 'iep-evaluation', name: 'School District IEP Evaluation Request', category: 'education', description: 'Requires formal psycho-educational testing by school specialists.', program_triggers: 'iep-special-education' }
];

const insertNeed = db.prepare('INSERT OR REPLACE INTO functional_needs (id, name, category, description, program_triggers) VALUES (?, ?, ?, ?, ?)');
const seedNeedsTx = db.transaction((needs) => {
  for (const n of needs) {
    insertNeed.run(n.id, n.name, n.category, n.description, n.program_triggers);
  }
});
seedNeedsTx(seedNeeds);
console.log(`  ✓ Seeded ${seedNeeds.length} Functional Needs in Taxonomy.`);

// Coverage Gaps Seed
const seedGaps = [
  { id: 'gap-1', county_id: 'los-angeles', gap_category: 'SELPA Admins', description: 'Direct school coordinators missing for East Valley.', severity: 'moderate' },
  { id: 'gap-2', county_id: 'orange', gap_category: 'Respite Agencies', description: 'Only RCOC vended agency logs are seeded.', severity: 'low' }
];

const insertGap = db.prepare('INSERT OR REPLACE INTO coverage_gaps (id, county_id, gap_category, description, severity) VALUES (?, ?, ?, ?, ?)');
const seedGapsTx = db.transaction((gaps) => {
  for (const g of gaps) {
    insertGap.run(g.id, g.county_id, g.gap_category, g.description, g.severity);
  }
});
seedGapsTx(seedGaps);
console.log(`  ✓ Seeded ${seedGaps.length} Known Database Coverage Gaps.`);

// Verification Queue Items Seed
const seedQueue = [
  { id: 'v-1', record_type: 'program', record_id: 'hearing-aid-coverage', record_name: 'HACCP Hearing Aid Support', reason: 'Audit regular 180-day freshness checks for FPL income updates.', verification_level: 5 },
  { id: 'v-2', record_type: 'regional-center', record_id: 'lanterman', record_name: 'Lanterman Regional Center', reason: 'Check intake department email coordinator updates.', verification_level: 1 }
];

const insertQueueItem = db.prepare('INSERT OR REPLACE INTO verification_queue_items (id, record_type, record_id, record_name, reason, verification_level) VALUES (?, ?, ?, ?, ?, ?)');
const seedQueueTx = db.transaction((items) => {
  for (const qi of items) {
    insertQueueItem.run(qi.id, qi.record_type, qi.record_id, qi.record_name, qi.reason, qi.verification_level);
  }
});
seedQueueTx(seedQueue);
console.log(`  ✓ Seeded ${seedQueue.length} Stale Verification Queue Items.`);

// Resource Providers Seed
const seedProviders = [
  { id: 'prov-1', name: 'Dynamic Pediatric Speech LA', categories: 'speech-therapy', county_id: 'los-angeles', phone: '(213) 555-0198', email: 'intake@dynamicspeechla.com', address: '1200 Wilshire Blvd, LA 90017', accepts_medi_cal: 1, regional_center_vendor_ids: 'LRC-77291' },
  { id: 'prov-2', name: 'OC Respite Agency Santa Ana', categories: 'respite', county_id: 'orange', phone: '(714) 555-0321', email: 'scheduling@ocrespite.org', address: '800 N Tustin Ave, SA 92705', accepts_medi_cal: 1, regional_center_vendor_ids: 'RCOC-88912' }
];

const insertProvider = db.prepare('INSERT OR REPLACE INTO resource_providers (id, name, categories, county_id, phone, email, address, accepts_medi_cal, regional_center_vendor_ids) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
const seedProvidersTx = db.transaction((providers) => {
  for (const prov of providers) {
    insertProvider.run(prov.id, prov.name, prov.categories, prov.county_id, prov.phone, prov.email, prov.address, prov.accepts_medi_cal, prov.regional_center_vendor_ids);
  }
});
seedProvidersTx(seedProviders);
console.log(`  ✓ Seeded ${seedProviders.length} Resource Providers.`);

db.close();
console.log('🎉 SQLite Relational Database build and seed execution completed successfully!\n');
