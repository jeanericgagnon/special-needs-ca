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

// States Seed
const seedStates = [
  {
    "id": "california",
    "name": "California",
    "code": "CA"
  },
  {
    "id": "texas",
    "name": "Texas",
    "code": "TX"
  },
  {
    "id": "florida",
    "name": "Florida",
    "code": "FL"
  },
  {
    "id": "new-york",
    "name": "New York",
    "code": "NY"
  }
];

const insertState = db.prepare('INSERT OR REPLACE INTO states (id, name, code) VALUES (?, ?, ?)');
const seedStatesTx = db.transaction((statesList) => {
  for (const s of statesList) {
    insertState.run(s.id, s.name, s.code);
  }
});
seedStatesTx(seedStates);
console.log(`  ✓ Seeded ${seedStates.length} States.`);

// Initial CA Counties Seed
const seedCounties = [
  {
    "id": "los-angeles",
    "state_id": "california",
    "name": "Los Angeles",
    "website": "https://lacounty.gov"
  },
  {
    "id": "orange",
    "state_id": "california",
    "name": "Orange County",
    "website": "https://ocgov.com"
  },
  {
    "id": "alameda",
    "state_id": "california",
    "name": "Alameda County",
    "website": "https://alamedacountyca.gov"
  },
  {
    "id": "san-francisco",
    "state_id": "california",
    "name": "San Francisco",
    "website": "https://sf.gov"
  }
];

const insertCounty = db.prepare('INSERT OR REPLACE INTO counties (id, state_id, name, website) VALUES (?, ?, ?, ?)');
const seedCountiesTx = db.transaction((countiesList) => {
  for (const c of countiesList) {
    insertCounty.run(c.id, c.state_id, c.name, c.website);
  }
});
seedCountiesTx(seedCounties);
console.log(`  ✓ Seeded ${seedCounties.length} Initial California Counties.`);

// Programs Seed
const seedPrograms = [
  {
    "id": "ihss-for-children",
    "name": "In-Home Supportive Services (IHSS) for Children",
    "description": "Pays a caregiver (including a parent) to provide essential supervision and care for a child with a severe disability to keep them safely in their own home.",
    "who_it_is_for": "Children under 18 with severe developmental delays, autism, cerebral palsy, or medical fragile profiles who need more safety supervision than a typically developing child.",
    "who_might_qualify": "California resident, active Medi-Cal (often via Regional Center waiver), and a documented medical certification of self-injurious behaviors or elopement.",
    "official_source_url": "https://www.cdss.ca.gov/in-home-supportive-services",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-05-18",
    "state_id": "california"
  },
  {
    "id": "regional-centers",
    "name": "California Regional Centers (Lanterman Act)",
    "description": "Lifelong service coordination network funding respite care, adaptive behavioral support, and social skills coaching for children and adults with developmental disabilities.",
    "who_it_is_for": "Individuals with developmental disabilities originating before age 18 (Autism, Down Syndrome, Cerebral Palsy, Epilepsy, or Fifth Category conditions) that are expected to continue indefinitely.",
    "who_might_qualify": "Diagnosis matching one of 5 developmental categories plus substantial limitations in at least 3 out of 7 major life domains (self-care, communication, learning, etc.).",
    "official_source_url": "https://www.dds.ca.gov",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-05-20",
    "state_id": "california"
  },
  {
    "id": "early-start",
    "name": "California Early Start (Early Intervention)",
    "description": "California's system of early intervention services for infants and toddlers from birth to 36 months who have significant developmental delays or established high-risk conditions.",
    "who_it_is_for": "Infants and toddlers (0 to 3 years old) and their families.",
    "who_might_qualify": "Under 36 months of age, with a 25% or greater delay in motor, speech, cognitive, or adaptive domains, or high-risk established conditions.",
    "official_source_url": "https://www.dds.ca.gov/services/early-start/",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-05-10",
    "state_id": "california"
  },
  {
    "id": "medi-cal-for-kids-and-teens",
    "name": "Medi-Cal for Kids & Teens (EPSDT)",
    "description": "Free healthcare and developmental medical therapy program for eligible youth under age 21, guaranteeing checkups, dental, vision, mental health, and medically necessary therapies.",
    "who_it_is_for": "Children and teens up to age 21.",
    "who_might_qualify": "Low-income households under 266% FPL, or children with developmental delays who bypass family wealth limits via Regional Center institutional deeming waivers.",
    "official_source_url": "https://www.dhcs.ca.gov/services/medi-cal/Pages/default.aspx",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-05-05",
    "state_id": "california"
  },
  {
    "id": "california-childrens-services",
    "name": "California Children's Services (CCS)",
    "description": "A state program that coordinates and pays for specialized pediatric medical care, surgery, wheel-chairs, and school Medical Therapy Unit (MTU) physical/occupational therapies.",
    "who_it_is_for": "Children under 21 with chronic, complex physical, orthopedic, visual, or audiological diagnoses (cerebral palsy, spina bifida, muscular dystrophy, deafness, statutory blindness).",
    "who_might_qualify": "Resident under 21, has CCS-eligible diagnosis, and household income below $40,000 (waived for school-based Medical Therapy Program therapies).",
    "official_source_url": "https://www.dhcs.ca.gov/services/ccs/Pages/default.aspx",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-05-14",
    "state_id": "california"
  },
  {
    "id": "iep-special-education",
    "name": "Individualized Education Program (IEP) / Special Education",
    "description": "Legally binding public school document detailing academic accommodations, behavior support, assistive devices, and speech/OT/PT therapies for qualifying disabled students.",
    "who_it_is_for": "School-aged children (ages 3 to 22) who reside in California.",
    "who_might_qualify": "Must qualify under 1 out of 13 federal special education eligibility categories and require specialized instruction to access the standard curriculum.",
    "official_source_url": "https://www.cde.ca.gov/sp/se/",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-05-22",
    "state_id": "california"
  },
  {
    "id": "ssi-for-children",
    "name": "Supplemental Security Income (SSI) for Children",
    "description": "Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and automatic Medi-Cal coverage to low-income disabled children.",
    "who_it_is_for": "Children under age 18 with severe physical or mental impairments.",
    "who_might_qualify": "Child meets SSA definition of medical disability (severe marked limitation expected to exceed 12 months) and household falls within resource limits ($2,000 resource ceiling).",
    "official_source_url": "https://www.ssa.gov/benefits/disability/apply-child.html",
    "category": "federal",
    "confidence_score": 5,
    "last_verified_date": "2026-05-11",
    "state_id": null
  },
  {
    "id": "calable",
    "name": "CalABLE (ABLE Accounts)",
    "description": "Tax-advantaged savings and investment portal letting families save money for future therapy, college, or housing, completely protected from public benefit resource limits (SSI/Medi-Cal).",
    "who_it_is_for": "Individuals who developed a significant disability before age 26.",
    "who_might_qualify": "Disability originated prior to age 26, and is eligible for SSI/SSDI or has a physician-certified chronic impairment.",
    "official_source_url": "https://calable.ca.gov",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-05-19",
    "state_id": "california"
  },
  {
    "id": "hearing-aid-coverage",
    "name": "Hearing Aid Coverage for Children Program (HACCP)",
    "description": "California state program covering audiology tests and hearing aid fittings for children who do not qualify for full-scope Medi-Cal and lack hearing coverage.",
    "who_it_is_for": "Children under age 21 with sensorineural or conductive hearing loss.",
    "who_might_qualify": "Under 21, California resident, family income under 600% FPL, and private health insurance excludes hearing aid devices.",
    "official_source_url": "https://www.dhcs.ca.gov/services/Pages/HACCP.aspx",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-05-31",
    "state_id": "california"
  },
  {
    "id": "tx-hcs",
    "name": "Texas Home and Community-Based Services (HCS) Waiver",
    "description": "Provides services and supports to people with an intellectual disability or a related condition who live with their family, in their own home, or in a small group home.",
    "who_it_is_for": "Individuals with intellectual and developmental disabilities or related conditions of any age.",
    "who_might_qualify": "Texas resident, diagnosed with IDD or related condition, qualifies for Medicaid, and has an IQ score of 69 or below or a related condition with substantial functional limitations.",
    "official_source_url": "https://www.hhs.texas.gov/providers/individual-family-support/home-community-based-services-hcs",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-06-01",
    "state_id": "texas"
  },
  {
    "id": "fl-ibudget",
    "name": "Florida iBudget HCBS Waiver",
    "description": "Medicaid home and community-based waiver designed to help people with developmental disabilities live as independently as possible in their communities.",
    "who_it_is_for": "Florida residents with developmental disabilities (autism, cerebral palsy, Down syndrome, intellectual disabilities, spina bifida, Prader-Willi syndrome).",
    "who_might_qualify": "Florida resident, diagnosed with one of the specific developmental disabilities originating before age 18, and meeting ICF/IID level of care.",
    "official_source_url": "https://apd.myflorida.com/ibudget/",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-06-01",
    "state_id": "florida"
  },
  {
    "id": "ny-opwdd-hcbs",
    "name": "New York OPWDD Comprehensive HCBS Waiver",
    "description": "Provides opportunities for developmental disability patients to receive services in their own home or community, rather than in an institution.",
    "who_it_is_for": "New York residents with intellectual and developmental disabilities.",
    "who_might_qualify": "NY resident, diagnosed with a developmental disability before age 22, and meeting intermediate care facility (ICF/IID) level of care.",
    "official_source_url": "https://opwdd.ny.gov/services-guidance/home-and-community-based-services-waiver",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-06-01",
    "state_id": "new-york"
  },
  {
    "id": "tx-class",
    "name": "Texas Community Living Assistance and Support Services (CLASS) Waiver",
    "description": "Provides home and community-based services to people with related conditions as an alternative to an intermediate care facility.",
    "who_it_is_for": "Texas residents of any age with a related condition (other than an intellectual disability) that originated before age 22.",
    "who_might_qualify": "Texas resident, diagnosed with a qualifying related condition (e.g. spina bifida, cerebral palsy), and meets financial eligibility limits.",
    "official_source_url": "https://www.hhs.texas.gov/providers/long-term-care-providers/community-living-assistance-support-services-class",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-06-01",
    "state_id": "texas"
  },
  {
    "id": "tx-txhml",
    "name": "Texas Home Living (TxHmL) Waiver",
    "description": "Provides essential services and supports to people with an intellectual disability or a related condition who live in their own home or their family's home.",
    "who_it_is_for": "Individuals with intellectual and developmental disabilities of any age living in their own/family home.",
    "who_might_qualify": "Texas resident, meets HCS waiver eligibility criteria, but has a capped annual service cost limit ($17,000 maximum budget).",
    "official_source_url": "https://www.hhs.texas.gov/providers/individual-family-support/texas-home-living-txhml",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-06-01",
    "state_id": "texas"
  },
  {
    "id": "tx-mdcp",
    "name": "Texas Medically Dependent Children Program (MDCP)",
    "description": "Provides services to support families caring for children and young adults who are medically fragile as an alternative to a nursing facility.",
    "who_it_is_for": "Texas residents under age 21 who are medically fragile.",
    "who_might_qualify": "Resident under 21, meets medical necessity criteria for nursing facility care, and meets Medicaid financial guidelines.",
    "official_source_url": "https://www.hhs.texas.gov/providers/individual-family-support/medically-dependent-children-program-mdcp",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-06-01",
    "state_id": "texas"
  },
  {
    "id": "tx-eci",
    "name": "Texas Early Childhood Intervention (ECI)",
    "description": "Statewide program for families with children, birth up to age 3, with developmental delays, disabilities, or certain medical diagnoses.",
    "who_it_is_for": "Texas children under age 3 showing signs of developmental delay, atypical development, or diagnosed medical conditions.",
    "who_might_qualify": "Texas resident, age 0-36 months, with a documented medically diagnosed condition, auditory/visual impairment, or developmental delay of at least 25%.",
    "official_source_url": "https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-06-01",
    "state_id": "texas"
  },
  {
    "id": "tx-tea-sped",
    "name": "Texas Education Agency Special Education Services",
    "description": "Specially designed instruction and related services provided to eligible students with disabilities under the Individuals with Disabilities Education Act (IDEA).",
    "who_it_is_for": "Texas students aged 3-21 who meet eligibility criteria in one or more disability categories and require special education services.",
    "who_might_qualify": "Texas resident, diagnosed with a qualifying disability (e.g., autism, speech impairment, learning disability), showing educational need.",
    "official_source_url": "https://tea.texas.gov/academics/special-student-populations/special-education",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-06-01",
    "state_id": "texas"
  },
  {
    "id": "tx-able",
    "name": "Texas ABLE Program",
    "description": "Tax-advantaged savings program for Texans with disabilities, allowing them to save for qualified disability expenses without losing government benefits.",
    "who_it_is_for": "Texans who developed a qualifying disability before age 26.",
    "who_might_qualify": "Texas resident, disability onset before age 26, and either receives SSI/SSDI or has a physician's certificate of disability.",
    "official_source_url": "https://www.texasable.org",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-06-01",
    "state_id": "texas"
  },
  {
    "id": "fl-cdc-plus",
    "name": "Florida Consumer Directed Care Plus (CDC+) Waiver",
    "description": "A consumer-directed option for iBudget Florida waiver clients that allows them to hire their own caregivers, including parents or relatives.",
    "who_it_is_for": "Florida residents enrolled in the APD iBudget waiver who want budget authority.",
    "who_might_qualify": "Enrolled in Florida iBudget HCBS waiver, completed training, and demonstrates ability to manage their own care budget.",
    "official_source_url": "https://apd.myflorida.com/cdcplus/",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-06-01",
    "state_id": "florida"
  },
  {
    "id": "ny-cdpap",
    "name": "New York Consumer Directed Personal Assistance Program (CDPAP)",
    "description": "A statewide Medicaid program that allows self-directing clients (or their parents/guardians) to recruit, hire, and direct their own personal care assistants.",
    "who_it_is_for": "New York residents of any age who require personal care or services.",
    "who_might_qualify": "Active NY Medicaid, requires help with daily living activities (ADLs), and is self-directing or has a designated representative.",
    "official_source_url": "https://www.health.ny.gov/health_care/medicaid/program/longterm/cdpap.htm",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-06-01",
    "state_id": "new-york"
  },
  {
    "id": "ny-childrens-waiver",
    "name": "New York Children's HCBS Waiver",
    "description": "Consolidated children's Medicaid waiver providing health home care management, respite, habilitation, and family support services.",
    "who_it_is_for": "New York children under age 21 with significant physical, medical, or developmental needs.",
    "who_might_qualify": "Under 21, NY resident, meets nursing facility, hospital, or ICF/IID level of care, and meets financial eligibility.",
    "official_source_url": "https://www.health.ny.gov/health_care/medicaid/redesign/behavioral_health_reform.htm",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-06-01",
    "state_id": "new-york"
  },
  {
    "id": "self-determination-program",
    "name": "California Self-Determination Program (SDP)",
    "description": "An alternative way to receive Regional Center services, allowing consumers and families more control over their service budget to hire their own staff and design custom plans.",
    "who_it_is_for": "California Regional Center consumers of any age who want more flexibility and control over their services.",
    "who_might_qualify": "Must be an active Regional Center consumer, complete an SDP orientation, and choose a Financial Management Service (FMS).",
    "official_source_url": "https://www.dds.ca.gov/initiatives/sdp/",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-06-01",
    "state_id": "california"
  },
  {
    "id": "hcba",
    "name": "California Home & Community-Based Alternatives (HCBA) Waiver",
    "description": "Provides in-home private duty nursing and care coordination for medically fragile individuals who would otherwise require long-term institutionalized care.",
    "who_it_is_for": "California residents of any age with high-level nursing needs (ventilators, tracheostomies, complex medical fragile status).",
    "who_might_qualify": "Meets nursing facility level of care, eligible for full-scope Medi-Cal (parent income can be waived via institutional deeming), and safely careable at home.",
    "official_source_url": "https://www.dhcs.ca.gov/services/ltc/Pages/Home-and-Community-Based-Alternatives-Waiver.aspx",
    "category": "state",
    "confidence_score": 5,
    "last_verified_date": "2026-06-01",
    "state_id": "california"
  }
];

const insertProgram = db.prepare('INSERT OR REPLACE INTO programs (id, name, description, who_it_is_for, who_might_qualify, official_source_url, category, confidence_score, last_verified_date, state_id, source_url, source_type, data_origin, verification_status, last_scraped_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
const seedProgramsTx = db.transaction((progs) => {
  for (const p of progs) {
    insertProgram.run(
      p.id,
      p.name,
      p.description,
      p.who_it_is_for,
      p.who_might_qualify,
      p.official_source_url,
      p.category,
      p.confidence_score,
      p.last_verified_date,
      p.state_id,
      p.official_source_url,
      'official',
      'seed',
      'official_verified',
      new Date().toISOString()
    );
  }
});
seedProgramsTx(seedPrograms);
console.log(`  ✓ Seeded ${seedPrograms.length} Statewide and Federal Programs.`);

// Eligibility Rules Seed
const seedRules = [
  {
    "id": "rule-es-1",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": null,
    "required_need": "speech-therapy",
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has active speech delay or therapeutic needs; Early Start IFSP evaluation is recommended."
  },
  {
    "id": "rule-es-2",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": null,
    "required_need": "feeding-therapy",
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child under 3 with swallowing/feeding needs qualifies for early intervention physical support."
  },
  {
    "id": "rule-ihss-1",
    "program_id": "ihss-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": null,
    "required_need": "protective-supervision",
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child profile exhibits a critical lack of safety awareness (elopement, pica, self-injury) requiring 24/7 Protective Supervision care."
  },
  {
    "id": "rule-ihss-2",
    "program_id": "ihss-for-children",
    "min_age_years": 3.0,
    "max_age_years": 18.0,
    "required_condition": null,
    "required_need": "diapers-incontinence-supplies",
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Incontinence after age 36 months represents an eligible personal care delay; screen for IHSS hours."
  },
  {
    "id": "rule-iep-1",
    "program_id": "iep-special-education",
    "min_age_years": 3.0,
    "max_age_years": 22.0,
    "required_condition": null,
    "required_need": "iep-evaluation",
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "School-aged child exhibits speech, developmental, or academic needs requiring a formal school district IEP assessment."
  },
  {
    "id": "rule-haccp-1",
    "program_id": "hearing-aid-coverage",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "hearing-loss-deafness",
    "required_need": "hearing-aids",
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Hearing loss and private insurance device exclusions trigger the California HACCP waiver program to fund fitting and audiology device costs."
  },
  {
    "id": "rule-haccp-2",
    "program_id": "hearing-aid-coverage",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "hearing-loss-deafness",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Documented hearing loss triggers potential coverage under the California HACCP waiver for pediatric hearing services."
  },
  {
    "id": "rule-ssi-attention-deficit-hyperactivity-disorder-adhd",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "attention-deficit-hyperactivity-disorder-adhd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Attention Deficit Hyperactivity Disorder (ADHD) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-attention-deficit-hyperactivity-disorder-adhd",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "attention-deficit-hyperactivity-disorder-adhd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Attention Deficit Hyperactivity Disorder (ADHD) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-rc-autism-spectrum-disorder-asd",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "autism-spectrum-disorder-asd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Autism Spectrum Disorder (ASD) is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ssi-autism-spectrum-disorder-asd",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "autism-spectrum-disorder-asd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Autism Spectrum Disorder (ASD) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-autism-spectrum-disorder-asd",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "autism-spectrum-disorder-asd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Autism Spectrum Disorder (ASD) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-autism-spectrum-disorder-asd",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "autism-spectrum-disorder-asd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Autism Spectrum Disorder (ASD)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ssi-sensory-processing-disorder-spd",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "sensory-processing-disorder-spd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Sensory Processing Disorder (SPD) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-sensory-processing-disorder-spd",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "sensory-processing-disorder-spd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Sensory Processing Disorder (SPD) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ssi-speech-and-language-delay",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "speech-and-language-delay",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Speech and Language Delay check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-speech-and-language-delay",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "speech-and-language-delay",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Speech and Language Delay before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-rc-global-developmental-delay-gdd",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "global-developmental-delay-gdd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Global Developmental Delay (GDD) is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ssi-global-developmental-delay-gdd",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "global-developmental-delay-gdd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Global Developmental Delay (GDD) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-global-developmental-delay-gdd",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "global-developmental-delay-gdd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Global Developmental Delay (GDD) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-global-developmental-delay-gdd",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "global-developmental-delay-gdd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Global Developmental Delay (GDD)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ssi-developmental-coordination-disorder-dyspraxia",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "developmental-coordination-disorder-dyspraxia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Developmental Coordination Disorder (Dyspraxia) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-developmental-coordination-disorder-dyspraxia",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "developmental-coordination-disorder-dyspraxia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Developmental Coordination Disorder (Dyspraxia) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-rc-pervasive-developmental-disorder-pdd-nos",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "pervasive-developmental-disorder-pdd-nos",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Pervasive Developmental Disorder (PDD-NOS) is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ssi-pervasive-developmental-disorder-pdd-nos",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "pervasive-developmental-disorder-pdd-nos",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Pervasive Developmental Disorder (PDD-NOS) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-pervasive-developmental-disorder-pdd-nos",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "pervasive-developmental-disorder-pdd-nos",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Pervasive Developmental Disorder (PDD-NOS) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-pervasive-developmental-disorder-pdd-nos",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "pervasive-developmental-disorder-pdd-nos",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Pervasive Developmental Disorder (PDD-NOS)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ssi-oppositional-defiant-disorder-odd",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "oppositional-defiant-disorder-odd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Oppositional Defiant Disorder (ODD) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-oppositional-defiant-disorder-odd",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "oppositional-defiant-disorder-odd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Oppositional Defiant Disorder (ODD) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ssi-reactive-attachment-disorder-rad",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "reactive-attachment-disorder-rad",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Reactive Attachment Disorder (RAD) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-reactive-attachment-disorder-rad",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "reactive-attachment-disorder-rad",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Reactive Attachment Disorder (RAD) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ssi-apraxia-of-speech",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "apraxia-of-speech",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Apraxia of Speech check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-apraxia-of-speech",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "apraxia-of-speech",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Apraxia of Speech before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ssi-social-communication-disorder",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "social-communication-disorder",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Social Communication Disorder check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-social-communication-disorder",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "social-communication-disorder",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Social Communication Disorder before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-rc-down-syndrome-trisomy-21",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "down-syndrome-trisomy-21",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Down Syndrome (Trisomy 21) is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-down-syndrome-trisomy-21",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "down-syndrome-trisomy-21",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Down Syndrome (Trisomy 21) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-down-syndrome-trisomy-21",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "down-syndrome-trisomy-21",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Down Syndrome automatically satisfies the childhood disability medical listing (Listing 110.06) for cash benefits."
  },
  {
    "id": "rule-able-down-syndrome-trisomy-21",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "down-syndrome-trisomy-21",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Down Syndrome (Trisomy 21) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-down-syndrome-trisomy-21",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "down-syndrome-trisomy-21",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Down Syndrome (Trisomy 21)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-fragile-x-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "fragile-x-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Fragile X Syndrome is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-fragile-x-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "fragile-x-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Fragile X Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-fragile-x-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "fragile-x-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Fragile X Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-fragile-x-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "fragile-x-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Fragile X Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-fragile-x-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "fragile-x-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Fragile X Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-rett-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "rett-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Rett Syndrome is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-rett-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "rett-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Rett Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-rett-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "rett-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Rett Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-rett-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "rett-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Rett Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-rett-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "rett-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Rett Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-prader-willi-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "prader-willi-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Prader-Willi Syndrome is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-prader-willi-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "prader-willi-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Prader-Willi Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-prader-willi-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "prader-willi-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Prader-Willi Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-prader-willi-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "prader-willi-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Prader-Willi Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-prader-willi-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "prader-willi-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Prader-Willi Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-angelman-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "angelman-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Angelman Syndrome is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-angelman-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "angelman-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Angelman Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-angelman-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "angelman-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Angelman Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-angelman-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "angelman-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Angelman Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-angelman-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "angelman-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Angelman Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-williams-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "williams-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Williams Syndrome is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-williams-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "williams-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Williams Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-williams-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "williams-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Williams Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-williams-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "williams-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Williams Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-williams-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "williams-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Williams Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ssi-turner-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "turner-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Turner Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-turner-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "turner-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Turner Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ssi-klinefelter-syndrome-xxy",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "klinefelter-syndrome-xxy",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Klinefelter Syndrome (XXY) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-klinefelter-syndrome-xxy",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "klinefelter-syndrome-xxy",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Klinefelter Syndrome (XXY) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-rc-cri-du-chat-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "cri-du-chat-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Cri-du-Chat Syndrome is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-cri-du-chat-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "cri-du-chat-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Cri-du-Chat Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-cri-du-chat-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "cri-du-chat-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Cri-du-Chat Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-cri-du-chat-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "cri-du-chat-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Cri-du-Chat Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-cri-du-chat-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "cri-du-chat-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Cri-du-Chat Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-digeorge-syndrome-22q112-deletion",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "digeorge-syndrome-22q112-deletion",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "DiGeorge Syndrome (22q11.2 deletion) is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-digeorge-syndrome-22q112-deletion",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "digeorge-syndrome-22q112-deletion",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "DiGeorge Syndrome (22q11.2 deletion) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-digeorge-syndrome-22q112-deletion",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "digeorge-syndrome-22q112-deletion",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for DiGeorge Syndrome (22q11.2 deletion) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-digeorge-syndrome-22q112-deletion",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "digeorge-syndrome-22q112-deletion",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of DiGeorge Syndrome (22q11.2 deletion) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-digeorge-syndrome-22q112-deletion",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "digeorge-syndrome-22q112-deletion",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (DiGeorge Syndrome (22q11.2 deletion)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-trisomy-18-edwards-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "trisomy-18-edwards-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Trisomy 18 (Edwards Syndrome) is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-trisomy-18-edwards-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "trisomy-18-edwards-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Trisomy 18 (Edwards Syndrome) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-trisomy-18-edwards-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "trisomy-18-edwards-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Trisomy 18 (Edwards Syndrome) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-trisomy-18-edwards-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "trisomy-18-edwards-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Trisomy 18 (Edwards Syndrome) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-trisomy-18-edwards-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "trisomy-18-edwards-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Trisomy 18 (Edwards Syndrome)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-trisomy-13-patau-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "trisomy-13-patau-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Trisomy 13 (Patau Syndrome) is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-trisomy-13-patau-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "trisomy-13-patau-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Trisomy 13 (Patau Syndrome) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-trisomy-13-patau-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "trisomy-13-patau-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Trisomy 13 (Patau Syndrome) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-trisomy-13-patau-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "trisomy-13-patau-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Trisomy 13 (Patau Syndrome) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-trisomy-13-patau-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "trisomy-13-patau-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Trisomy 13 (Patau Syndrome)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-noonan-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "noonan-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Noonan Syndrome is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-noonan-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "noonan-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Noonan Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-noonan-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "noonan-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Noonan Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-noonan-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "noonan-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Noonan Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-noonan-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "noonan-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Noonan Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-rabin-kopp-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "rabin-kopp-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Rabin-Kopp Syndrome is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-rabin-kopp-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "rabin-kopp-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Rabin-Kopp Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-rabin-kopp-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "rabin-kopp-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Rabin-Kopp Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-rabin-kopp-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "rabin-kopp-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Rabin-Kopp Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-rabin-kopp-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "rabin-kopp-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Rabin-Kopp Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-cerebral-palsy-cp",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "cerebral-palsy-cp",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Cerebral Palsy (CP) is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-cerebral-palsy-cp",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "cerebral-palsy-cp",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Cerebral Palsy (CP) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-cerebral-palsy-cp",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "cerebral-palsy-cp",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Cerebral Palsy (CP) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-cerebral-palsy-cp",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "cerebral-palsy-cp",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Cerebral Palsy (CP) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-cerebral-palsy-cp",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "cerebral-palsy-cp",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Cerebral Palsy (CP)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-spina-bifida",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "spina-bifida",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Spina Bifida is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-spina-bifida",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "spina-bifida",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Spina Bifida check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-spina-bifida",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "spina-bifida",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Spina Bifida before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-spina-bifida",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "spina-bifida",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Spina Bifida); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-muscular-dystrophy-duchenne",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "muscular-dystrophy-duchenne",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Muscular Dystrophy (Duchenne) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-muscular-dystrophy-duchenne",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "muscular-dystrophy-duchenne",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Muscular Dystrophy (Duchenne) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-muscular-dystrophy-duchenne",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "muscular-dystrophy-duchenne",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Muscular Dystrophy (Duchenne) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-muscular-dystrophy-duchenne",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "muscular-dystrophy-duchenne",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Muscular Dystrophy (Duchenne)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-muscular-dystrophy-becker",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "muscular-dystrophy-becker",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Muscular Dystrophy (Becker) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-muscular-dystrophy-becker",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "muscular-dystrophy-becker",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Muscular Dystrophy (Becker) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-muscular-dystrophy-becker",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "muscular-dystrophy-becker",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Muscular Dystrophy (Becker) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-muscular-dystrophy-becker",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "muscular-dystrophy-becker",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Muscular Dystrophy (Becker)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-spinal-muscular-atrophy-sma",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "spinal-muscular-atrophy-sma",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Spinal Muscular Atrophy (SMA) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-spinal-muscular-atrophy-sma",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "spinal-muscular-atrophy-sma",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Spinal Muscular Atrophy (SMA) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-spinal-muscular-atrophy-sma",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "spinal-muscular-atrophy-sma",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Spinal Muscular Atrophy (SMA) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-spinal-muscular-atrophy-sma",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "spinal-muscular-atrophy-sma",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Spinal Muscular Atrophy (SMA)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-microcephaly",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "microcephaly",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Microcephaly is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-microcephaly",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "microcephaly",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Microcephaly is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-microcephaly",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "microcephaly",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Microcephaly check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-microcephaly",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "microcephaly",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Microcephaly before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-microcephaly",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "microcephaly",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Microcephaly); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-hydrocephalus",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "hydrocephalus",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Hydrocephalus is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-hydrocephalus",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "hydrocephalus",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Hydrocephalus is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-hydrocephalus",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "hydrocephalus",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Hydrocephalus check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-hydrocephalus",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "hydrocephalus",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Hydrocephalus before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-hydrocephalus",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "hydrocephalus",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Hydrocephalus); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-epilepsy-seizure-disorder",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "epilepsy-seizure-disorder",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Epilepsy / Seizure Disorder is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-epilepsy-seizure-disorder",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "epilepsy-seizure-disorder",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Epilepsy / Seizure Disorder is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-epilepsy-seizure-disorder",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "epilepsy-seizure-disorder",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Epilepsy / Seizure Disorder check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-epilepsy-seizure-disorder",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "epilepsy-seizure-disorder",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Epilepsy / Seizure Disorder before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-epilepsy-seizure-disorder",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "epilepsy-seizure-disorder",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Epilepsy / Seizure Disorder); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-tourette-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "tourette-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Tourette Syndrome is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-tourette-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "tourette-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Tourette Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-tourette-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "tourette-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Tourette Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-tourette-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "tourette-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Tourette Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-tourette-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "tourette-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Tourette Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ssi-traumatic-brain-injury-tbi",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "traumatic-brain-injury-tbi",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Traumatic Brain Injury (TBI) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-traumatic-brain-injury-tbi",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "traumatic-brain-injury-tbi",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Traumatic Brain Injury (TBI) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ccs-arthrogryposis-multiplex-congenita",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "arthrogryposis-multiplex-congenita",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Arthrogryposis Multiplex Congenita is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-arthrogryposis-multiplex-congenita",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "arthrogryposis-multiplex-congenita",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Arthrogryposis Multiplex Congenita check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-arthrogryposis-multiplex-congenita",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "arthrogryposis-multiplex-congenita",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Arthrogryposis Multiplex Congenita before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-arthrogryposis-multiplex-congenita",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "arthrogryposis-multiplex-congenita",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Arthrogryposis Multiplex Congenita); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-neurofibromatosis-type-1-nf1",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "neurofibromatosis-type-1-nf1",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Neurofibromatosis Type 1 (NF1) is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-neurofibromatosis-type-1-nf1",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "neurofibromatosis-type-1-nf1",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Neurofibromatosis Type 1 (NF1) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-neurofibromatosis-type-1-nf1",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "neurofibromatosis-type-1-nf1",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Neurofibromatosis Type 1 (NF1) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-neurofibromatosis-type-1-nf1",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "neurofibromatosis-type-1-nf1",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Neurofibromatosis Type 1 (NF1) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-neurofibromatosis-type-1-nf1",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "neurofibromatosis-type-1-nf1",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Neurofibromatosis Type 1 (NF1)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-neurofibromatosis-type-2-nf2",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "neurofibromatosis-type-2-nf2",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Neurofibromatosis Type 2 (NF2) is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-neurofibromatosis-type-2-nf2",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "neurofibromatosis-type-2-nf2",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Neurofibromatosis Type 2 (NF2) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-neurofibromatosis-type-2-nf2",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "neurofibromatosis-type-2-nf2",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Neurofibromatosis Type 2 (NF2) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-neurofibromatosis-type-2-nf2",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "neurofibromatosis-type-2-nf2",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Neurofibromatosis Type 2 (NF2) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-neurofibromatosis-type-2-nf2",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "neurofibromatosis-type-2-nf2",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Neurofibromatosis Type 2 (NF2)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-mitochondrial-disease",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "mitochondrial-disease",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Mitochondrial Disease is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-mitochondrial-disease",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "mitochondrial-disease",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Mitochondrial Disease is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-mitochondrial-disease",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "mitochondrial-disease",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Mitochondrial Disease check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-mitochondrial-disease",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "mitochondrial-disease",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Mitochondrial Disease before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-mitochondrial-disease",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "mitochondrial-disease",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Mitochondrial Disease); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-rasmussen-encephalitis",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "rasmussen-encephalitis",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Rasmussen Encephalitis is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-rasmussen-encephalitis",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "rasmussen-encephalitis",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Rasmussen Encephalitis is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-rasmussen-encephalitis",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "rasmussen-encephalitis",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Rasmussen Encephalitis check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-rasmussen-encephalitis",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "rasmussen-encephalitis",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Rasmussen Encephalitis before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-rasmussen-encephalitis",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "rasmussen-encephalitis",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Rasmussen Encephalitis); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-lennox-gastaut-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "lennox-gastaut-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Lennox-Gastaut Syndrome is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-lennox-gastaut-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "lennox-gastaut-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Lennox-Gastaut Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-lennox-gastaut-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "lennox-gastaut-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Lennox-Gastaut Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-lennox-gastaut-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "lennox-gastaut-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Lennox-Gastaut Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-lennox-gastaut-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "lennox-gastaut-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Lennox-Gastaut Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-dravet-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "dravet-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Dravet Syndrome is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-dravet-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "dravet-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Dravet Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-dravet-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "dravet-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Dravet Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-dravet-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "dravet-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Dravet Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-dravet-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "dravet-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Dravet Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-landau-kleffner-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "landau-kleffner-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Landau-Kleffner Syndrome is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-landau-kleffner-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "landau-kleffner-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Landau-Kleffner Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-landau-kleffner-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "landau-kleffner-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Landau-Kleffner Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-landau-kleffner-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "landau-kleffner-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Landau-Kleffner Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-landau-kleffner-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "landau-kleffner-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Landau-Kleffner Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-aicardi-syndrome",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "aicardi-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Aicardi Syndrome is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-aicardi-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "aicardi-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Aicardi Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-aicardi-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "aicardi-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Aicardi Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-aicardi-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "aicardi-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Aicardi Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-aicardi-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "aicardi-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Aicardi Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-hearing-loss-deafness",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "hearing-loss-deafness",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Hearing Loss / Deafness is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-hearing-loss-deafness",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "hearing-loss-deafness",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Hearing Loss / Deafness check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-hearing-loss-deafness",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "hearing-loss-deafness",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Hearing Loss / Deafness before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-hearing-loss-deafness",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "hearing-loss-deafness",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Hearing Loss / Deafness); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-visual-impairment-blindness",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "visual-impairment-blindness",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Visual Impairment / Blindness is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-visual-impairment-blindness",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "visual-impairment-blindness",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Visual Impairment / Blindness check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-visual-impairment-blindness",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "visual-impairment-blindness",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Visual Impairment / Blindness before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-visual-impairment-blindness",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "visual-impairment-blindness",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Visual Impairment / Blindness); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-cortical-visual-impairment-cvi",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "cortical-visual-impairment-cvi",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Cortical Visual Impairment (CVI) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-cortical-visual-impairment-cvi",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "cortical-visual-impairment-cvi",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Cortical Visual Impairment (CVI) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-cortical-visual-impairment-cvi",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "cortical-visual-impairment-cvi",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Cortical Visual Impairment (CVI) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-cortical-visual-impairment-cvi",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "cortical-visual-impairment-cvi",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Cortical Visual Impairment (CVI)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-deaf-blindness",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "deaf-blindness",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Deaf-Blindness is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-deaf-blindness",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "deaf-blindness",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Deaf-Blindness check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-deaf-blindness",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "deaf-blindness",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Deaf-Blindness before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-deaf-blindness",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "deaf-blindness",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Deaf-Blindness); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ssi-auditory-processing-disorder-apd",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "auditory-processing-disorder-apd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Auditory Processing Disorder (APD) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-auditory-processing-disorder-apd",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "auditory-processing-disorder-apd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Auditory Processing Disorder (APD) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ccs-optic-nerve-hypoplasia-onh",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "optic-nerve-hypoplasia-onh",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Optic Nerve Hypoplasia (ONH) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-optic-nerve-hypoplasia-onh",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "optic-nerve-hypoplasia-onh",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Optic Nerve Hypoplasia (ONH) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-optic-nerve-hypoplasia-onh",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "optic-nerve-hypoplasia-onh",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Optic Nerve Hypoplasia (ONH) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-optic-nerve-hypoplasia-onh",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "optic-nerve-hypoplasia-onh",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Optic Nerve Hypoplasia (ONH)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-retinopathy-of-prematurity-rop",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "retinopathy-of-prematurity-rop",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Retinopathy of Prematurity (ROP) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-retinopathy-of-prematurity-rop",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "retinopathy-of-prematurity-rop",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Retinopathy of Prematurity (ROP) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-retinopathy-of-prematurity-rop",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "retinopathy-of-prematurity-rop",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Retinopathy of Prematurity (ROP) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-retinopathy-of-prematurity-rop",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "retinopathy-of-prematurity-rop",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Retinopathy of Prematurity (ROP)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-usher-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "usher-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Usher Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-usher-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "usher-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Usher Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-usher-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "usher-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Usher Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-usher-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "usher-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Usher Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-intellectual-disability-id",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "intellectual-disability-id",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Intellectual Disability (ID) is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ssi-intellectual-disability-id",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "intellectual-disability-id",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Intellectual Disability (ID) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-intellectual-disability-id",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "intellectual-disability-id",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Intellectual Disability (ID) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-intellectual-disability-id",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "intellectual-disability-id",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Intellectual Disability (ID)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ssi-dyslexia",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "dyslexia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Dyslexia check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-dyslexia",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "dyslexia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Dyslexia before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ssi-dysgraphia",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "dysgraphia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Dysgraphia check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-dysgraphia",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "dysgraphia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Dysgraphia before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ssi-dyscalculia",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "dyscalculia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Dyscalculia check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-dyscalculia",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "dyscalculia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Dyscalculia before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ssi-executive-function-disorder",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "executive-function-disorder",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Executive Function Disorder check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-executive-function-disorder",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "executive-function-disorder",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Executive Function Disorder before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ssi-nonverbal-learning-disability-nvld",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "nonverbal-learning-disability-nvld",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Nonverbal Learning Disability (NVLD) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-nonverbal-learning-disability-nvld",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "nonverbal-learning-disability-nvld",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Nonverbal Learning Disability (NVLD) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ssi-auditory-dyslexia",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "auditory-dyslexia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Auditory Dyslexia check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-auditory-dyslexia",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "auditory-dyslexia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Auditory Dyslexia before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ccs-congenital-heart-disease-chd",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "congenital-heart-disease-chd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Congenital Heart Disease (CHD) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-congenital-heart-disease-chd",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "congenital-heart-disease-chd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Congenital Heart Disease (CHD) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-congenital-heart-disease-chd",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "congenital-heart-disease-chd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Congenital Heart Disease (CHD) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-congenital-heart-disease-chd",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "congenital-heart-disease-chd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Congenital Heart Disease (CHD)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-cystic-fibrosis-cf",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "cystic-fibrosis-cf",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Cystic Fibrosis (CF) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-cystic-fibrosis-cf",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "cystic-fibrosis-cf",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Cystic Fibrosis (CF) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-cystic-fibrosis-cf",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "cystic-fibrosis-cf",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Cystic Fibrosis (CF) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-cystic-fibrosis-cf",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "cystic-fibrosis-cf",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Cystic Fibrosis (CF)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-sickle-cell-disease",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "sickle-cell-disease",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Sickle Cell Disease is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-sickle-cell-disease",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "sickle-cell-disease",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Sickle Cell Disease check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-sickle-cell-disease",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "sickle-cell-disease",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Sickle Cell Disease before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-sickle-cell-disease",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "sickle-cell-disease",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Sickle Cell Disease); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-type-1-diabetes",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "type-1-diabetes",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Type 1 Diabetes is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-type-1-diabetes",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "type-1-diabetes",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Type 1 Diabetes check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-type-1-diabetes",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "type-1-diabetes",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Type 1 Diabetes before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-type-1-diabetes",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "type-1-diabetes",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Type 1 Diabetes); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-severe-persistent-asthma",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "severe-persistent-asthma",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Severe Persistent Asthma is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-severe-persistent-asthma",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "severe-persistent-asthma",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Severe Persistent Asthma check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-severe-persistent-asthma",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "severe-persistent-asthma",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Severe Persistent Asthma before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-severe-persistent-asthma",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "severe-persistent-asthma",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Severe Persistent Asthma); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-pediatric-cancer-leukemia",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "pediatric-cancer-leukemia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Pediatric Cancer / Leukemia is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-pediatric-cancer-leukemia",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "pediatric-cancer-leukemia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Pediatric Cancer / Leukemia check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-pediatric-cancer-leukemia",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "pediatric-cancer-leukemia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Pediatric Cancer / Leukemia before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-pediatric-cancer-leukemia",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "pediatric-cancer-leukemia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Pediatric Cancer / Leukemia); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-tracheostomy-dependency",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "tracheostomy-dependency",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Tracheostomy Dependency is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-tracheostomy-dependency",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "tracheostomy-dependency",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Tracheostomy Dependency check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-tracheostomy-dependency",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "tracheostomy-dependency",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Tracheostomy Dependency before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-tracheostomy-dependency",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "tracheostomy-dependency",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Tracheostomy Dependency); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-ventilator-dependency",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "ventilator-dependency",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Ventilator Dependency is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-ventilator-dependency",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "ventilator-dependency",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Ventilator Dependency check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-ventilator-dependency",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "ventilator-dependency",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Ventilator Dependency before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-ventilator-dependency",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "ventilator-dependency",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Ventilator Dependency); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-short-bowel-syndrome",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "short-bowel-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Short Bowel Syndrome is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-short-bowel-syndrome",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "short-bowel-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Short Bowel Syndrome check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-short-bowel-syndrome",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "short-bowel-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Short Bowel Syndrome before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-short-bowel-syndrome",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "short-bowel-syndrome",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Short Bowel Syndrome); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-chronic-kidney-disease-ckd",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "chronic-kidney-disease-ckd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Chronic Kidney Disease (CKD) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-chronic-kidney-disease-ckd",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "chronic-kidney-disease-ckd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Chronic Kidney Disease (CKD) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-chronic-kidney-disease-ckd",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "chronic-kidney-disease-ckd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Chronic Kidney Disease (CKD) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-chronic-kidney-disease-ckd",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "chronic-kidney-disease-ckd",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Chronic Kidney Disease (CKD)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-gastrostomy-g-tube-dependency",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "gastrostomy-g-tube-dependency",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Gastrostomy (G-tube) Dependency is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-gastrostomy-g-tube-dependency",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "gastrostomy-g-tube-dependency",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Gastrostomy (G-tube) Dependency check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-gastrostomy-g-tube-dependency",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "gastrostomy-g-tube-dependency",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Gastrostomy (G-tube) Dependency before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-gastrostomy-g-tube-dependency",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "gastrostomy-g-tube-dependency",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Gastrostomy (G-tube) Dependency); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-severe-hemophilia",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "severe-hemophilia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Severe Hemophilia is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-severe-hemophilia",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "severe-hemophilia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Severe Hemophilia check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-severe-hemophilia",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "severe-hemophilia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Severe Hemophilia before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-severe-hemophilia",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "severe-hemophilia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Severe Hemophilia); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-juvenile-idiopathic-arthritis-jia",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "juvenile-idiopathic-arthritis-jia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Juvenile Idiopathic Arthritis (JIA) is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-juvenile-idiopathic-arthritis-jia",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "juvenile-idiopathic-arthritis-jia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Juvenile Idiopathic Arthritis (JIA) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-juvenile-idiopathic-arthritis-jia",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "juvenile-idiopathic-arthritis-jia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Juvenile Idiopathic Arthritis (JIA) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-juvenile-idiopathic-arthritis-jia",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "juvenile-idiopathic-arthritis-jia",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Juvenile Idiopathic Arthritis (JIA)); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ccs-orthopedic-impairment",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "orthopedic-impairment",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Orthopedic Impairment is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-orthopedic-impairment",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "orthopedic-impairment",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Orthopedic Impairment check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-orthopedic-impairment",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "orthopedic-impairment",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Orthopedic Impairment before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-orthopedic-impairment",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "orthopedic-impairment",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Orthopedic Impairment); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-ssi-other-health-impairment-ohi",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "other-health-impairment-ohi",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Other Health Impairment (OHI) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-other-health-impairment-ohi",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "other-health-impairment-ohi",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Other Health Impairment (OHI) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ssi-specific-learning-disability-sld",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "specific-learning-disability-sld",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Specific Learning Disability (SLD) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-specific-learning-disability-sld",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "specific-learning-disability-sld",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Specific Learning Disability (SLD) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-ssi-emotional-disturbance-ed",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "emotional-disturbance-ed",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Emotional Disturbance (ED) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-emotional-disturbance-ed",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "emotional-disturbance-ed",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Emotional Disturbance (ED) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-rc-multiple-disabilities",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "multiple-disabilities",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Multiple Disabilities is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ccs-multiple-disabilities",
    "program_id": "california-childrens-services",
    "min_age_years": 0.0,
    "max_age_years": 21.0,
    "required_condition": "multiple-disabilities",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Multiple Disabilities is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies."
  },
  {
    "id": "rule-ssi-multiple-disabilities",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "multiple-disabilities",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Multiple Disabilities check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-multiple-disabilities",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "multiple-disabilities",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Multiple Disabilities before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-multiple-disabilities",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "multiple-disabilities",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Multiple Disabilities); Early Start intervention is highly recommended."
  },
  {
    "id": "rule-rc-developmental-delay-ca-education-code",
    "program_id": "regional-centers",
    "min_age_years": 3.0,
    "max_age_years": 120.0,
    "required_condition": "developmental-delay-ca-education-code",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Developmental Delay (CA Education Code) is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers."
  },
  {
    "id": "rule-ssi-developmental-delay-ca-education-code",
    "program_id": "ssi-for-children",
    "min_age_years": 0.0,
    "max_age_years": 18.0,
    "required_condition": "developmental-delay-ca-education-code",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Assessments for Developmental Delay (CA Education Code) check for marked and severe functional limitations under childhood SSI guidelines."
  },
  {
    "id": "rule-able-developmental-delay-ca-education-code",
    "program_id": "calable",
    "min_age_years": 0.0,
    "max_age_years": 120.0,
    "required_condition": "developmental-delay-ca-education-code",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Disability onset of Developmental Delay (CA Education Code) before age 26 qualifies for a tax-advantaged CalABLE savings account."
  },
  {
    "id": "rule-es-developmental-delay-ca-education-code",
    "program_id": "early-start",
    "min_age_years": 0.0,
    "max_age_years": 3.0,
    "required_condition": "developmental-delay-ca-education-code",
    "required_need": null,
    "insurance_status": "any",
    "school_status": "any",
    "trigger_reason": "Child is under age 3 and has an established high-risk condition (Developmental Delay (CA Education Code)); Early Start intervention is highly recommended."
  }
];

const insertRule = db.prepare('INSERT OR REPLACE INTO program_eligibility_rules (id, program_id, min_age_years, max_age_years, required_condition, required_need, insurance_status, school_status, trigger_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
const seedRulesTx = db.transaction((rules) => {
  for (const r of rules) {
    insertRule.run(r.id, r.program_id, r.min_age_years, r.max_age_years, r.required_condition, r.required_need, r.insurance_status, r.school_status, r.trigger_reason);
  }
});
seedRulesTx(seedRules);
console.log(`  ✓ Seeded ${seedRules.length} Program Eligibility Rules.`);

// Document Requirements Seed
const seedDocs = [
  {
    "id": "doc-req-1",
    "program_id": "ihss-for-children",
    "name": "SOC 873 Medical Certification Form",
    "description": "Pediatrician completed form certifying chronic physical/mental impairment and safety risks.",
    "is_mandatory": 1
  },
  {
    "id": "doc-req-2",
    "program_id": "ihss-for-children",
    "name": "24-hour Daily Care & Supervision Log",
    "description": "Log tracking safety hazards, self-injurious attempts, and interventions performed.",
    "is_mandatory": 0
  },
  {
    "id": "doc-req-3",
    "program_id": "regional-centers",
    "name": "Clinical Neuropsychological Evaluation",
    "description": "Formal psychological report determining developmental milestones and intelligence ratings.",
    "is_mandatory": 1
  },
  {
    "id": "doc-req-4",
    "program_id": "iep-special-education",
    "name": "Parent Assessment Request Letter",
    "description": "A dated, signed written request submitted to the school principal requesting psycho-educational assessments.",
    "is_mandatory": 1
  },
  {
    "id": "doc-req-5",
    "program_id": "early-start",
    "name": "Early Start Referral Form",
    "description": "A standard referral webform or phone intake sheet detailing child's birth and developmental concerns.",
    "is_mandatory": 1
  },
  {
    "id": "doc-req-6",
    "program_id": "medi-cal-for-kids-and-teens",
    "name": "Proof of Income (Medi-Cal)",
    "description": "Paystubs, tax statements, or institutional deeming letters showing financial context.",
    "is_mandatory": 1
  },
  {
    "id": "doc-req-7",
    "program_id": "california-childrens-services",
    "name": "CCS Medical Report",
    "description": "Detailed clinical reports from a specialist indicating a qualifying medical diagnosis.",
    "is_mandatory": 1
  },
  {
    "id": "doc-req-8",
    "program_id": "hearing-aid-coverage",
    "name": "Audiological Evaluation",
    "description": "Comprehensive audiogram and diagnostic report performed within the last 12 months.",
    "is_mandatory": 1
  },
  {
    "id": "doc-req-9",
    "program_id": "ssi-for-children",
    "name": "SSA Child Disability Report (SSA-3820)",
    "description": "Form documenting child's medical, developmental, and school progress history.",
    "is_mandatory": 1
  },
  {
    "id": "doc-req-10",
    "program_id": "calable",
    "name": "Self-Certification of Disability (CalABLE)",
    "description": "Document confirming childhood disability onset prior to age 26.",
    "is_mandatory": 1
  },
  {
    "id": "doc-req-11",
    "program_id": "hcba",
    "name": "HCBA Waiver Intake Application",
    "description": "Intake paperwork requesting home care agency nursing coordination assessments.",
    "is_mandatory": 1
  },
  {
    "id": "doc-req-12",
    "program_id": "self-determination-program",
    "name": "Individual Program Plan (IPP) SDP Amendment",
    "description": "Regional Center IPP agreement confirming transitions into self-determination.",
    "is_mandatory": 1
  }
];

const insertDoc = db.prepare('INSERT OR REPLACE INTO program_document_requirements (id, program_id, name, description, is_mandatory) VALUES (?, ?, ?, ?, ?)');
const seedDocsTx = db.transaction((docs) => {
  for (const d of docs) {
    insertDoc.run(d.id, d.program_id, d.name, d.description, d.is_mandatory);
  }
});
seedDocsTx(seedDocs);
console.log(`  ✓ Seeded ${seedDocs.length} Program Document Requirements.`);

// Application Steps Seed
const seedSteps = [
  {
    "id": "step-ihss-1",
    "program_id": "ihss-for-children",
    "step_number": 1,
    "title": "Call County IHSS Helpline",
    "action_description": "Initiate application by phone. Social worker will log names and mail a package.",
    "apply_url_or_contact": "County office helpline"
  },
  {
    "id": "step-ihss-2",
    "program_id": "ihss-for-children",
    "step_number": 2,
    "title": "Pediatrician signs SOC 873",
    "action_description": "Pediatrician must certify child has a chronic impairment and sign within 45 days.",
    "apply_url_or_contact": "Local Pediatrician"
  },
  {
    "id": "step-rc-1",
    "program_id": "regional-centers",
    "step_number": 1,
    "title": "Submit Referral Webform",
    "action_description": "Complete online intake referral form with birth records and clinical reports attached.",
    "apply_url_or_contact": "Regional Center Portal"
  },
  {
    "id": "step-es-1",
    "program_id": "early-start",
    "step_number": 1,
    "title": "Submit Early Start Referral",
    "action_description": "Contact local Regional Center early intervention department by phone or online form.",
    "apply_url_or_contact": "Regional Center Intake Portal"
  },
  {
    "id": "step-mc-1",
    "program_id": "medi-cal-for-kids-and-teens",
    "step_number": 1,
    "title": "Submit BenefitsCal Application",
    "action_description": "File single streamline application for Medi-Cal online.",
    "apply_url_or_contact": "https://www.benefitscal.com"
  },
  {
    "id": "step-ccs-1",
    "program_id": "california-childrens-services",
    "step_number": 1,
    "title": "Submit CCS Application",
    "action_description": "Mail or upload the completed application form to the county health department's CCS office.",
    "apply_url_or_contact": "Local County CCS Office"
  },
  {
    "id": "step-haccp-1",
    "program_id": "hearing-aid-coverage",
    "step_number": 1,
    "title": "Submit HACCP Webform",
    "action_description": "Download and file the HACCP application package with the Department of Health Care Services.",
    "apply_url_or_contact": "https://www.dhcs.ca.gov/services/Pages/HACCP.aspx"
  },
  {
    "id": "step-ssi-1",
    "program_id": "ssi-for-children",
    "step_number": 1,
    "title": "Complete Child Disability Report",
    "action_description": "Submit report describing medical conditions, treatments, and education background.",
    "apply_url_or_contact": "https://www.ssa.gov/benefits/disability/apply-child.html"
  },
  {
    "id": "step-able-1",
    "program_id": "calable",
    "step_number": 1,
    "title": "Open Account Online",
    "action_description": "Complete CalABLE enrollment wizard and verify childhood disability onset details.",
    "apply_url_or_contact": "https://calable.ca.gov"
  },
  {
    "id": "step-iep-1",
    "program_id": "iep-special-education",
    "step_number": 1,
    "title": "Request Educational Assessment",
    "action_description": "Send written request to the school principal asking for special education evaluations.",
    "apply_url_or_contact": "School Principal"
  },
  {
    "id": "step-hcba-1",
    "program_id": "hcba",
    "step_number": 1,
    "title": "Contact HCBA Waiver Agency",
    "action_description": "Contact local waiver agency to start intake assessment request.",
    "apply_url_or_contact": "Local Waiver Agency"
  },
  {
    "id": "step-sdp-1",
    "program_id": "self-determination-program",
    "step_number": 1,
    "title": "Attend SDP Orientation",
    "action_description": "Complete mandatory state orientation course offered by Regional Center or family empowerment centers.",
    "apply_url_or_contact": "Regional Center Coordinator"
  }
];

const insertStep = db.prepare('INSERT OR REPLACE INTO program_application_steps (id, program_id, step_number, title, action_description, apply_url_or_contact) VALUES (?, ?, ?, ?, ?, ?)');
const seedStepsTx = db.transaction((stepsList) => {
  for (const s of stepsList) {
    insertStep.run(s.id, s.program_id, s.step_number, s.title, s.action_description, s.apply_url_or_contact);
  }
});
seedStepsTx(seedSteps);
console.log(`  ✓ Seeded ${seedSteps.length} Program Application Steps.`);

// Appeal Info Seed
const seedAppeals = [
  {
    "program_id": "ihss-for-children",
    "deadline_days": "90 days",
    "appeal_steps": "1. Complete State Hearing request on NA 690 slip.\n2. Submit daily logs, clinical assessments, and school behavior logs.\n3. Participate in phone/video hearing with CDSS Administrative Law Judge.",
    "denial_reasons": "Claims parent provider care covers all safety risks; claims child does not show active wandering behavior.",
    "appeal_form_name": "Notice of Action back side appeal request (NA 690)",
    "official_appeal_source_url": "https://www.cdss.ca.gov/hearing-requests"
  },
  {
    "program_id": "regional-centers",
    "deadline_days": "30 days",
    "appeal_steps": "1. Submit DDS Fair Hearing request form to the Regional Center.\n2. Attend voluntary mediation with a Regional Center representative.\n3. Present medical/developmental evidence at formal OAH hearing.",
    "denial_reasons": "Does not meet qualifying developmental diagnosis criteria (Autism, Cerebral Palsy, Epilepsy, Down Syndrome, or Fifth Category).",
    "appeal_form_name": "DDS Fair Hearing Request Form (DS 1805)",
    "official_appeal_source_url": "https://www.dds.ca.gov/general/appeals/"
  },
  {
    "program_id": "early-start",
    "deadline_days": "30 days",
    "appeal_steps": "1. Request State Mediation or Early Start Due Process Hearing.\n2. Participate in informal case resolution.\n3. Provide clinical reports demonstrating developmental delay.",
    "denial_reasons": "Developmental delay is evaluated as less than 25% across motor/cognitive/speech scales.",
    "appeal_form_name": "Early Start Due Process Hearing / Mediation Request Form",
    "official_appeal_source_url": "https://www.dds.ca.gov/general/appeals/early-start-complaints/"
  },
  {
    "program_id": "medi-cal-for-kids-and-teens",
    "deadline_days": "90 days",
    "appeal_steps": "1. File State Fair Hearing request online or via phone.\n2. Work with county eligibility caseworker or submit doctor's letters.\n3. Present case at fair hearing.",
    "denial_reasons": "Household income exceeds eligibility limits; services deemed not medically necessary.",
    "appeal_form_name": "State Hearing Request Form",
    "official_appeal_source_url": "https://www.cdss.ca.gov/hearing-requests"
  },
  {
    "program_id": "california-childrens-services",
    "deadline_days": "30 days",
    "appeal_steps": "1. File written appeal with the county CCS office.\n2. Request state-level administrative review from DHCS.\n3. Submit detailed pediatric diagnostic evaluations.",
    "denial_reasons": "Condition is not on the list of CCS-eligible complex physical diagnoses.",
    "appeal_form_name": "CCS Appeal Request Letter",
    "official_appeal_source_url": "https://www.dhcs.ca.gov/services/ccs/"
  },
  {
    "program_id": "hearing-aid-coverage",
    "deadline_days": "60 days",
    "appeal_steps": "1. Send appeal letter directly to DHCS HACCP program.\n2. Submit official health insurance declarations showing device exclusions.\n3. Participate in administrative review.",
    "denial_reasons": "Primary health plan covers pediatric hearing devices; household income exceeds 600% FPL.",
    "appeal_form_name": "HACCP Appeal Request Letter",
    "official_appeal_source_url": "https://www.dhcs.ca.gov/services/Pages/HACCP.aspx"
  },
  {
    "program_id": "ssi-for-children",
    "deadline_days": "60 days",
    "appeal_steps": "1. File Request for Reconsideration online.\n2. Submit new clinical records or school evaluations.\n3. Request administrative hearing before an ALJ if reconsideration fails.\n4. Present case and educator testimony to Special Ed ALJ.",
    "denial_reasons": "Impairments do not meet SSI childhood listings; parental resources exceed asset ceilings.",
    "appeal_form_name": "Request for Reconsideration (SSA-561-U2)",
    "official_appeal_source_url": "https://www.ssa.gov/benefits/disability/appeal.html"
  },
  {
    "program_id": "iep-special-education",
    "deadline_days": "2 years",
    "appeal_steps": "1. Submit Due Process complaint to Office of Administrative Hearings (OAH).\n2. Participate in voluntary special education mediation.\n3. Present case and educator testimony to Special Ed ALJ.",
    "denial_reasons": "School evaluation determines student does not meet special ed eligibility criteria or need specialized services.",
    "appeal_form_name": "OAH Special Education Due Process Hearing Request Form",
    "official_appeal_source_url": "https://www.dgs.ca.gov/OAH/Case-Types/Special-Education"
  },
  {
    "program_id": "hcba",
    "deadline_days": "90 days",
    "appeal_steps": "1. Request State Fair Hearing through CDSS.\n2. Submit clinical nurse records indicating medically fragile nursing need.\n3. Present case at fair hearing.",
    "denial_reasons": "Medical records do not verify nursing facility level of care requirement.",
    "appeal_form_name": "State Hearing Request Form",
    "official_appeal_source_url": "https://www.dhcs.ca.gov/services/ltc/Pages/Home-and-Community-Based-Alternatives-Waiver.aspx"
  },
  {
    "program_id": "self-determination-program",
    "deadline_days": "30 days",
    "appeal_steps": "1. File DDS Fair Hearing request regarding budget or transition disputes.\n2. Participate in informal local RC meetings.\n3. Present case to OAH ALJ.",
    "denial_reasons": "Proposed spending plan categories violate DDS state guidelines.",
    "appeal_form_name": "DDS Fair Hearing Request Form (DS 1805)",
    "official_appeal_source_url": "https://www.dds.ca.gov/general/appeals/"
  }
];

const insertAppeal = db.prepare('INSERT OR REPLACE INTO program_appeal_info (program_id, deadline_days, appeal_steps, denial_reasons, appeal_form_name, official_appeal_source_url) VALUES (?, ?, ?, ?, ?, ?)');
const seedAppealsTx = db.transaction((appealsList) => {
  for (const a of appealsList) {
    insertAppeal.run(a.program_id, a.deadline_days, a.appeal_steps, a.denial_reasons, a.appeal_form_name, a.official_appeal_source_url);
  }
});
seedAppealsTx(seedAppeals);
console.log(`  ✓ Seeded ${seedAppeals.length} Program Appeal Info records.`);

// State Resource Agencies Seed (TX, FL, NY)
const seedAgencies = [
  {
    "id": "integral-care",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Integral Care (Travis County LIDDA)",
    "counties_served": "travis-tx",
    "catchment_boundaries": "Serves Travis County, TX.",
    "website": "https://integralcare.org",
    "intake_phone": "(512) 472-4357",
    "early_intervention_contact": "Phone: (512) 472-4357, Email: info@integralcare.org",
    "agency_intake_contact": "Phone: (512) 472-HELP, Email: intake@integralcare.org",
    "eligibility_info_page": "https://integralcare.org/en/intellectual-developmental-disabilities/",
    "services_page": "https://integralcare.org/en/services/",
    "appeals_info": "https://integralcare.org/en/client-rights/",
    "frc_relationship": "Collaborates with Austin/Travis County Parent Network.",
    "office_locations": "1700 S Lamar Blvd, Austin, TX 78704",
    "languages": "English, Spanish, Vietnamese",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://integralcare.org"
  },
  {
    "id": "the-harris-center",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "The Harris Center for Mental Health and IDD",
    "counties_served": "harris-tx",
    "catchment_boundaries": "Serves Harris County, TX.",
    "website": "https://www.theharriscenter.org",
    "intake_phone": "(713) 970-7000",
    "early_intervention_contact": "Phone: (713) 970-7000, Email: info@theharriscenter.org",
    "agency_intake_contact": "Phone: (713) 970-7000, Option 2",
    "eligibility_info_page": "https://www.theharriscenter.org/Services/Intellectual-and-Developmental-Disability-Services",
    "services_page": "https://www.theharriscenter.org/Services",
    "appeals_info": "https://www.theharriscenter.org/About-Us/Rights-and-Privacy",
    "frc_relationship": "Partners with Family to Family Network Houston.",
    "office_locations": "9401 Southwest Fwy, Houston, TX 77074",
    "languages": "English, Spanish, Vietnamese, Chinese",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.theharriscenter.org"
  },
  {
    "id": "apd-southern",
    "state_id": "florida",
    "agency_type": "apd_office",
    "name": "APD Southern Region (Miami)",
    "counties_served": "miami-dade-fl,monroe-fl",
    "catchment_boundaries": "Serves Miami-Dade and Monroe counties.",
    "website": "https://apd.myflorida.com/region/southern/",
    "intake_phone": "(305) 349-1478",
    "early_intervention_contact": "Phone: (305) 349-1478, Email: apd.southern@apd.myflorida.com",
    "agency_intake_contact": "Phone: (305) 349-1478, Option 1",
    "eligibility_info_page": "https://apd.myflorida.com/customers/application/",
    "services_page": "https://apd.myflorida.com/customers/services/",
    "appeals_info": "https://apd.myflorida.com/customers/appeals/",
    "frc_relationship": "Partners with Family Network on Disabilities POPIN program.",
    "office_locations": "401 NW 2nd Ave, Suite S-812, Miami, FL 33128",
    "languages": "English, Spanish, Creole",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://apd.myflorida.com/region/southern/"
  },
  {
    "id": "opwdd-region-4",
    "state_id": "new-york",
    "agency_type": "ddro",
    "name": "OPWDD Region 4 - Metro NY DDRO",
    "counties_served": "kings-ny,queens-ny,new-york-ny,bronx-ny",
    "catchment_boundaries": "Serves Kings (Brooklyn), Queens, New York (Manhattan), and Bronx counties.",
    "website": "https://opwdd.ny.gov/contact-us/regional-offices",
    "intake_phone": "(718) 217-5890",
    "early_intervention_contact": "Phone: (718) 217-5890 (Front Door line)",
    "agency_intake_contact": "Phone: (718) 217-5890, Email: metrony.frontdoor@opwdd.ny.gov",
    "eligibility_info_page": "https://opwdd.ny.gov/get-started/eligibility",
    "services_page": "https://opwdd.ny.gov/services-assistance",
    "appeals_info": "https://opwdd.ny.gov/regulations-guidance/appeals-process",
    "frc_relationship": "Collaborates closely with IncludeNYC and local CCOs.",
    "office_locations": "75 Morton St, New York, NY 10014",
    "languages": "English, Spanish, Cantonese, Mandarin, Russian, Yiddish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://opwdd.ny.gov/contact-us/regional-offices"
  },
  {
    "id": "access",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "ACCESS (Anderson-Cherokee Community Enrichment Services)",
    "counties_served": "anderson-tx,cherokee-tx",
    "catchment_boundaries": "Serves counties in Texas: anderson-tx, cherokee-tx.",
    "website": "https://access-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "andrews",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Andrews Center",
    "counties_served": "smith-tx,wood-tx,rains-tx,van-zandt-tx,henderson-tx",
    "catchment_boundaries": "Serves counties in Texas: smith-tx, wood-tx, rains-tx, van-zandt-tx, henderson-tx.",
    "website": "https://andrews-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "betty-hardwick",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Betty Hardwick Center",
    "counties_served": "taylor-tx,jones-tx,callahan-tx,shackelford-tx,stephens-tx",
    "catchment_boundaries": "Serves counties in Texas: taylor-tx, jones-tx, callahan-tx, shackelford-tx, stephens-tx.",
    "website": "https://betty-hardwick-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "bluebonnet-trails",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Bluebonnet Trails Community Services",
    "counties_served": "bastrop-tx,burnet-tx,caldwell-tx,fayette-tx,gonzales-tx,guadalupe-tx,lee-tx,williamson-tx",
    "catchment_boundaries": "Serves counties in Texas: bastrop-tx, burnet-tx, caldwell-tx, fayette-tx, gonzales-tx, guadalupe-tx, lee-tx, williamson-tx.",
    "website": "https://bluebonnet-trails-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "border-region",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Border Region Behavioral Health Center",
    "counties_served": "webb-tx,zapata-tx,jim-hogg-tx,starr-tx",
    "catchment_boundaries": "Serves counties in Texas: webb-tx, zapata-tx, jim-hogg-tx, starr-tx.",
    "website": "https://border-region-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "brazos-valley",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "MHMR Authority of Brazos Valley",
    "counties_served": "brazos-tx,burleson-tx,grimes-tx,leon-tx,madison-tx,robertson-tx,washington-tx",
    "catchment_boundaries": "Serves counties in Texas: brazos-tx, burleson-tx, grimes-tx, leon-tx, madison-tx, robertson-tx, washington-tx.",
    "website": "https://brazos-valley-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "burke",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Burke Center",
    "counties_served": "angelina-tx,houston-tx,jasper-tx,nacogdoches-tx,newton-tx,polk-tx,sabine-tx,san-augustine-tx,san-jacinto-tx,shelby-tx,tyler-tx",
    "catchment_boundaries": "Serves counties in Texas: angelina-tx, houston-tx, jasper-tx, nacogdoches-tx, newton-tx, polk-tx, sabine-tx, san-augustine-tx, san-jacinto-tx, shelby-tx, tyler-tx.",
    "website": "https://burke-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "camino-real",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Camino Real Community Services",
    "counties_served": "atascosa-tx,dimmit-tx,frio-tx,la-salle-tx,mcmullen-tx,maverick-tx,medina-tx,wilson-tx,zavala-tx,karnes-tx",
    "catchment_boundaries": "Serves counties in Texas: atascosa-tx, dimmit-tx, frio-tx, la-salle-tx, mcmullen-tx, maverick-tx, medina-tx, wilson-tx, zavala-tx, karnes-tx.",
    "website": "https://camino-real-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "chcs",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "The Center for Health Care Services",
    "counties_served": "bexar-tx",
    "catchment_boundaries": "Serves counties in Texas: bexar-tx.",
    "website": "https://chcs-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "life-resources",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Center for Life Resources",
    "counties_served": "brown-tx,coleman-tx,comanche-tx,eastland-tx,mcculloch-tx,mills-tx,san-saba-tx",
    "catchment_boundaries": "Serves counties in Texas: brown-tx, coleman-tx, comanche-tx, eastland-tx, mcculloch-tx, mills-tx, san-saba-tx.",
    "website": "https://life-resources-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "central-counties",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Central Counties Services",
    "counties_served": "bell-tx,coryell-tx,hamilton-tx,lampasas-tx,milam-tx",
    "catchment_boundaries": "Serves counties in Texas: bell-tx, coryell-tx, hamilton-tx, lampasas-tx, milam-tx.",
    "website": "https://central-counties-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "central-plains",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Central Plains Center",
    "counties_served": "bailey-tx,briscoe-tx,castro-tx,floyd-tx,hale-tx,hall-tx,lamb-tx,motley-tx,parmer-tx,swisher-tx",
    "catchment_boundaries": "Serves counties in Texas: bailey-tx, briscoe-tx, castro-tx, floyd-tx, hale-tx, hall-tx, lamb-tx, motley-tx, parmer-tx, swisher-tx.",
    "website": "https://central-plains-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "coastal-plains",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Coastal Plains Community Center",
    "counties_served": "aransas-tx,bee-tx,brooks-tx,duval-tx,jim-wells-tx,kenedy-tx,kleberg-tx,live-oak-tx,san-patricio-tx",
    "catchment_boundaries": "Serves counties in Texas: aransas-tx, bee-tx, brooks-tx, duval-tx, jim-wells-tx, kenedy-tx, kleberg-tx, live-oak-tx, san-patricio-tx.",
    "website": "https://coastal-plains-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "concho-valley",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "MHMR Services for the Concho Valley",
    "counties_served": "coke-tx,concho-tx,crockett-tx,irion-tx,reagan-tx,sterling-tx,tom-green-tx",
    "catchment_boundaries": "Serves counties in Texas: coke-tx, concho-tx, crockett-tx, irion-tx, reagan-tx, sterling-tx, tom-green-tx.",
    "website": "https://concho-valley-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "metrocare",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Metrocare Services",
    "counties_served": "dallas-tx",
    "catchment_boundaries": "Serves counties in Texas: dallas-tx.",
    "website": "https://metrocare-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "denton-mhmr",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Denton County MHMR Center",
    "counties_served": "denton-tx",
    "catchment_boundaries": "Serves counties in Texas: denton-tx.",
    "website": "https://denton-mhmr-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "emergence-health",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Emergence Health Network",
    "counties_served": "el-paso-tx",
    "catchment_boundaries": "Serves counties in Texas: el-paso-tx.",
    "website": "https://emergence-health-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "gulf-bend",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Gulf Bend Center",
    "counties_served": "victoria-tx,jackson-tx,calhoun-tx,goliad-tx,refugio-tx,dewitt-tx,lavaca-tx",
    "catchment_boundaries": "Serves counties in Texas: victoria-tx, jackson-tx, calhoun-tx, goliad-tx, refugio-tx, dewitt-tx, lavaca-tx.",
    "website": "https://gulf-bend-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "gulf-coast",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Gulf Coast Center",
    "counties_served": "galveston-tx,brazoria-tx",
    "catchment_boundaries": "Serves counties in Texas: galveston-tx, brazoria-tx.",
    "website": "https://gulf-coast-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "heart-of-texas",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Heart of Texas Region MHMR Center",
    "counties_served": "bosque-tx,falls-tx,freestone-tx,hill-tx,limestone-tx,mclennan-tx",
    "catchment_boundaries": "Serves counties in Texas: bosque-tx, falls-tx, freestone-tx, hill-tx, limestone-tx, mclennan-tx.",
    "website": "https://heart-of-texas-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "helen-farabee",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Helen Farabee Centers",
    "counties_served": "archer-tx,baylor-tx,clay-tx,cottle-tx,foard-tx,hardeman-tx,jack-tx,montague-tx,wichita-tx,wilbarger-tx,young-tx",
    "catchment_boundaries": "Serves counties in Texas: archer-tx, baylor-tx, clay-tx, cottle-tx, foard-tx, hardeman-tx, jack-tx, montague-tx, wichita-tx, wilbarger-tx, young-tx.",
    "website": "https://helen-farabee-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "hill-country",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Hill Country Mental Health and Developmental Disabilities Centers",
    "counties_served": "bandera-tx,blanco-tx,comal-tx,edwards-tx,gillespie-tx,hays-tx,kendall-tx,kerr-tx,kimble-tx,kinney-tx,llano-tx,mason-tx,menard-tx,real-tx,schleicher-tx,sutton-tx,val-verde-tx",
    "catchment_boundaries": "Serves counties in Texas: bandera-tx, blanco-tx, comal-tx, edwards-tx, gillespie-tx, hays-tx, kendall-tx, kerr-tx, kimble-tx, kinney-tx, llano-tx, mason-tx, menard-tx, real-tx, schleicher-tx, sutton-tx, val-verde-tx.",
    "website": "https://hill-country-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "lakes-regional",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Lakes Regional MHMR Center",
    "counties_served": "camp-tx,delta-tx,ellis-tx,franklin-tx,hopkins-tx,hunt-tx,kaufman-tx,lamar-tx,morris-tx,navarro-tx,rockwall-tx,titus-tx",
    "catchment_boundaries": "Serves counties in Texas: camp-tx, delta-tx, ellis-tx, franklin-tx, hopkins-tx, hunt-tx, kaufman-tx, lamar-tx, morris-tx, navarro-tx, rockwall-tx, titus-tx.",
    "website": "https://lakes-regional-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "lifepath",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "LifePath Systems",
    "counties_served": "collin-tx",
    "catchment_boundaries": "Serves counties in Texas: collin-tx.",
    "website": "https://lifepath-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "starcare",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "StarCare Specialty Health System",
    "counties_served": "lubbock-tx,lynn-tx,cochran-tx,crosby-tx,hockley-tx,garza-tx",
    "catchment_boundaries": "Serves counties in Texas: lubbock-tx, lynn-tx, cochran-tx, crosby-tx, hockley-tx, garza-tx.",
    "website": "https://starcare-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "nueces-mhmr",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Nueces Center for Mental Health and Intellectual Disability",
    "counties_served": "nueces-tx",
    "catchment_boundaries": "Serves counties in Texas: nueces-tx.",
    "website": "https://nueces-mhmr-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "pecan-valley",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Pecan Valley Centers for Behavioral & Developmental HealthCare",
    "counties_served": "erath-tx,hood-tx,johnson-tx,palo-pinto-tx,parker-tx,somervell-tx",
    "catchment_boundaries": "Serves counties in Texas: erath-tx, hood-tx, johnson-tx, palo-pinto-tx, parker-tx, somervell-tx.",
    "website": "https://pecan-valley-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "permiacare",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "PermiaCare",
    "counties_served": "ector-tx,midland-tx,andrews-tx,crane-tx,gaines-tx,glasscock-tx,martin-tx,pecos-tx,reeves-tx,terrell-tx,upton-tx,ward-tx,winkler-tx",
    "catchment_boundaries": "Serves counties in Texas: ector-tx, midland-tx, andrews-tx, crane-tx, gaines-tx, glasscock-tx, martin-tx, pecos-tx, reeves-tx, terrell-tx, upton-tx, ward-tx, winkler-tx.",
    "website": "https://permiacare-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "healthcore",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Community Healthcore",
    "counties_served": "bowie-tx,cass-tx,gregg-tx,harrison-tx,marion-tx,panola-tx,red-river-tx,rusk-tx,upshur-tx",
    "catchment_boundaries": "Serves counties in Texas: bowie-tx, cass-tx, gregg-tx, harrison-tx, marion-tx, panola-tx, red-river-tx, rusk-tx, upshur-tx.",
    "website": "https://healthcore-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "spindletop",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Spindletop Center",
    "counties_served": "jefferson-tx,orange-tx,hardin-tx,chambers-tx",
    "catchment_boundaries": "Serves counties in Texas: jefferson-tx, orange-tx, hardin-tx, chambers-tx.",
    "website": "https://spindletop-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "mhmr-tarrant",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "MHMR of Tarrant County",
    "counties_served": "tarrant-tx",
    "catchment_boundaries": "Serves counties in Texas: tarrant-tx.",
    "website": "https://mhmr-tarrant-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "texana",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Texana Center",
    "counties_served": "austin-tx,colorado-tx,fort-bend-tx,matagorda-tx,waller-tx,wharton-tx",
    "catchment_boundaries": "Serves counties in Texas: austin-tx, colorado-tx, fort-bend-tx, matagorda-tx, waller-tx, wharton-tx.",
    "website": "https://texana-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "panhandle",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Texas Panhandle Centers",
    "counties_served": "armstrong-tx,carson-tx,collingsworth-tx,dallam-tx,deaf-smith-tx,donley-tx,gray-tx,hansford-tx,hartley-tx,hemphill-tx,hutchinson-tx,lipscomb-tx,moore-tx,ochiltree-tx,oldham-tx,potter-tx,randall-tx,roberts-tx,sherman-tx,wheeler-tx",
    "catchment_boundaries": "Serves counties in Texas: armstrong-tx, carson-tx, collingsworth-tx, dallam-tx, deaf-smith-tx, donley-tx, gray-tx, hansford-tx, hartley-tx, hemphill-tx, hutchinson-tx, lipscomb-tx, moore-tx, ochiltree-tx, oldham-tx, potter-tx, randall-tx, roberts-tx, sherman-tx, wheeler-tx.",
    "website": "https://panhandle-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "texoma",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Texoma Community Center",
    "counties_served": "cooke-tx,fannin-tx,grayson-tx",
    "catchment_boundaries": "Serves counties in Texas: cooke-tx, fannin-tx, grayson-tx.",
    "website": "https://texoma-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "tri-county",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Tri-County Services",
    "counties_served": "liberty-tx,montgomery-tx,walker-tx",
    "catchment_boundaries": "Serves counties in Texas: liberty-tx, montgomery-tx, walker-tx.",
    "website": "https://tri-county-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "tropical-texas",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "Tropical Texas Behavioral Health",
    "counties_served": "cameron-tx,hidalgo-tx,willacy-tx",
    "catchment_boundaries": "Serves counties in Texas: cameron-tx, hidalgo-tx, willacy-tx.",
    "website": "https://tropical-texas-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "west-texas",
    "state_id": "texas",
    "agency_type": "lidda",
    "name": "West Texas Centers",
    "counties_served": "mitchell-tx,nolan-tx,scurry-tx,loving-tx,ward-tx,winkler-tx,pecos-tx,terrell-tx,brewster-tx,presidio-tx,jeff-davis-tx,culberson-tx,hudspeth-tx",
    "catchment_boundaries": "Serves counties in Texas: mitchell-tx, nolan-tx, scurry-tx, loving-tx, ward-tx, winkler-tx, pecos-tx, terrell-tx, brewster-tx, presidio-tx, jeff-davis-tx, culberson-tx, hudspeth-tx.",
    "website": "https://west-texas-lidda.tx.gov",
    "intake_phone": "(855) 937-2372",
    "early_intervention_contact": "Phone: (855) 937-2372 (State Referral)",
    "agency_intake_contact": "Phone: (855) 937-2372",
    "eligibility_info_page": "https://www.hhs.texas.gov/services/disability",
    "services_page": "https://www.hhs.texas.gov/services/disability",
    "appeals_info": "https://www.hhs.texas.gov/services/disability",
    "frc_relationship": null,
    "office_locations": "Main Center, TX",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://www.hhs.texas.gov"
  },
  {
    "id": "apd-northwest",
    "state_id": "florida",
    "agency_type": "apd_office",
    "name": "APD Northwest Region (Tallahassee)",
    "counties_served": "escambia-fl,santa-rosa-fl,okaloosa-fl,walton-fl,holmes-fl,washington-fl,bay-fl,jackson-fl,calhoun-fl,gulf-fl,liberty-fl,franklin-fl,gadsden-fl,leon-fl,wakulla-fl,jefferson-fl,madison-fl,taylor-fl",
    "catchment_boundaries": "Serves counties in Florida: escambia-fl, santa-rosa-fl, okaloosa-fl, walton-fl, holmes-fl, washington-fl, bay-fl, jackson-fl, calhoun-fl, gulf-fl, liberty-fl, franklin-fl, gadsden-fl, leon-fl, wakulla-fl, jefferson-fl, madison-fl, taylor-fl.",
    "website": "https://apd.myflorida.com",
    "intake_phone": "(850) 488-4257",
    "early_intervention_contact": "Phone: (850) 488-4257",
    "agency_intake_contact": "Phone: (850) 488-4257",
    "eligibility_info_page": "https://apd.myflorida.com/customers/application/",
    "services_page": "https://apd.myflorida.com/customers/services/",
    "appeals_info": "https://apd.myflorida.com/customers/appeals/",
    "frc_relationship": null,
    "office_locations": "Regional Office, FL",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://apd.myflorida.com"
  },
  {
    "id": "apd-northeast",
    "state_id": "florida",
    "agency_type": "apd_office",
    "name": "APD Northeast Region (Jacksonville)",
    "counties_served": "hamilton-fl,suwannee-fl,lafayette-fl,dixie-fl,columbia-fl,gilchrist-fl,levy-fl,alachua-fl,union-fl,bradford-fl,baker-fl,nassau-fl,duval-fl,clay-fl,st-johns-fl,putnam-fl,flagler-fl,volusia-fl",
    "catchment_boundaries": "Serves counties in Florida: hamilton-fl, suwannee-fl, lafayette-fl, dixie-fl, columbia-fl, gilchrist-fl, levy-fl, alachua-fl, union-fl, bradford-fl, baker-fl, nassau-fl, duval-fl, clay-fl, st-johns-fl, putnam-fl, flagler-fl, volusia-fl.",
    "website": "https://apd.myflorida.com",
    "intake_phone": "(850) 488-4257",
    "early_intervention_contact": "Phone: (850) 488-4257",
    "agency_intake_contact": "Phone: (850) 488-4257",
    "eligibility_info_page": "https://apd.myflorida.com/customers/application/",
    "services_page": "https://apd.myflorida.com/customers/services/",
    "appeals_info": "https://apd.myflorida.com/customers/appeals/",
    "frc_relationship": null,
    "office_locations": "Regional Office, FL",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://apd.myflorida.com"
  },
  {
    "id": "apd-central",
    "state_id": "florida",
    "agency_type": "apd_office",
    "name": "APD Central Region (Orlando)",
    "counties_served": "marion-fl,citrus-fl,hernando-fl,sumter-fl,lake-fl,seminole-fl,orange-fl,osceola-fl,brevard-fl",
    "catchment_boundaries": "Serves counties in Florida: marion-fl, citrus-fl, hernando-fl, sumter-fl, lake-fl, seminole-fl, orange-fl, osceola-fl, brevard-fl.",
    "website": "https://apd.myflorida.com",
    "intake_phone": "(850) 488-4257",
    "early_intervention_contact": "Phone: (850) 488-4257",
    "agency_intake_contact": "Phone: (850) 488-4257",
    "eligibility_info_page": "https://apd.myflorida.com/customers/application/",
    "services_page": "https://apd.myflorida.com/customers/services/",
    "appeals_info": "https://apd.myflorida.com/customers/appeals/",
    "frc_relationship": null,
    "office_locations": "Regional Office, FL",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://apd.myflorida.com"
  },
  {
    "id": "apd-suncoast",
    "state_id": "florida",
    "agency_type": "apd_office",
    "name": "APD Suncoast Region (Tampa)",
    "counties_served": "pasco-fl,pinellas-fl,hillsborough-fl,manatee-fl,sarasota-fl,desoto-fl,charlotte-fl,lee-fl,collier-fl,hendry-fl,glades-fl",
    "catchment_boundaries": "Serves counties in Florida: pasco-fl, pinellas-fl, hillsborough-fl, manatee-fl, sarasota-fl, desoto-fl, charlotte-fl, lee-fl, collier-fl, hendry-fl, glades-fl.",
    "website": "https://apd.myflorida.com",
    "intake_phone": "(850) 488-4257",
    "early_intervention_contact": "Phone: (850) 488-4257",
    "agency_intake_contact": "Phone: (850) 488-4257",
    "eligibility_info_page": "https://apd.myflorida.com/customers/application/",
    "services_page": "https://apd.myflorida.com/customers/services/",
    "appeals_info": "https://apd.myflorida.com/customers/appeals/",
    "frc_relationship": null,
    "office_locations": "Regional Office, FL",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://apd.myflorida.com"
  },
  {
    "id": "apd-southeast",
    "state_id": "florida",
    "agency_type": "apd_office",
    "name": "APD Southeast Region (West Palm Beach)",
    "counties_served": "indian-river-fl,okeechobee-fl,st-lucie-fl,martin-fl,palm-beach-fl,broward-fl",
    "catchment_boundaries": "Serves counties in Florida: indian-river-fl, okeechobee-fl, st-lucie-fl, martin-fl, palm-beach-fl, broward-fl.",
    "website": "https://apd.myflorida.com",
    "intake_phone": "(850) 488-4257",
    "early_intervention_contact": "Phone: (850) 488-4257",
    "agency_intake_contact": "Phone: (850) 488-4257",
    "eligibility_info_page": "https://apd.myflorida.com/customers/application/",
    "services_page": "https://apd.myflorida.com/customers/services/",
    "appeals_info": "https://apd.myflorida.com/customers/appeals/",
    "frc_relationship": null,
    "office_locations": "Regional Office, FL",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://apd.myflorida.com"
  },
  {
    "id": "opwdd-region-1",
    "state_id": "new-york",
    "agency_type": "ddro",
    "name": "OPWDD Region 1 - Finger Lakes & Western NY DDRO",
    "counties_served": "allegany-ny,cattaraugus-ny,chautauqua-ny,erie-ny,genesee-ny,niagara-ny,orleans-ny,wyoming-ny,chemung-ny,livingston-ny,monroe-ny,ontario-ny,schuyler-ny,seneca-ny,steuben-ny,wayne-ny,yates-ny",
    "catchment_boundaries": "Serves counties in New York: allegany-ny, cattaraugus-ny, chautauqua-ny, erie-ny, genesee-ny, niagara-ny, orleans-ny, wyoming-ny, chemung-ny, livingston-ny, monroe-ny, ontario-ny, schuyler-ny, seneca-ny, steuben-ny, wayne-ny, yates-ny.",
    "website": "https://opwdd.ny.gov",
    "intake_phone": "(866) 946-9733",
    "early_intervention_contact": "Phone: (866) 946-9733 (Front Door)",
    "agency_intake_contact": "Phone: (866) 946-9733, Email: frontdoor@opwdd.ny.gov",
    "eligibility_info_page": "https://opwdd.ny.gov/get-started/eligibility",
    "services_page": "https://opwdd.ny.gov/services-assistance",
    "appeals_info": "https://opwdd.ny.gov/regulations-guidance/appeals-process",
    "frc_relationship": null,
    "office_locations": "Regional Front Door Office, NY",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://opwdd.ny.gov"
  },
  {
    "id": "opwdd-region-2",
    "state_id": "new-york",
    "agency_type": "ddro",
    "name": "OPWDD Region 2 - Central NY & Broome DDRO",
    "counties_served": "broome-ny,chenango-ny,delaware-ny,otsego-ny,tioga-ny,tompkins-ny,cayuga-ny,cortland-ny,herkimer-ny,lewis-ny,madison-ny,oneida-ny,onondaga-ny,oswego-ny",
    "catchment_boundaries": "Serves counties in New York: broome-ny, chenango-ny, delaware-ny, otsego-ny, tioga-ny, tompkins-ny, cayuga-ny, cortland-ny, herkimer-ny, lewis-ny, madison-ny, oneida-ny, onondaga-ny, oswego-ny.",
    "website": "https://opwdd.ny.gov",
    "intake_phone": "(866) 946-9733",
    "early_intervention_contact": "Phone: (866) 946-9733 (Front Door)",
    "agency_intake_contact": "Phone: (866) 946-9733, Email: frontdoor@opwdd.ny.gov",
    "eligibility_info_page": "https://opwdd.ny.gov/get-started/eligibility",
    "services_page": "https://opwdd.ny.gov/services-assistance",
    "appeals_info": "https://opwdd.ny.gov/regulations-guidance/appeals-process",
    "frc_relationship": null,
    "office_locations": "Regional Front Door Office, NY",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://opwdd.ny.gov"
  },
  {
    "id": "opwdd-region-3",
    "state_id": "new-york",
    "agency_type": "ddro",
    "name": "OPWDD Region 3 - Taconic & Hudson Valley & Capital District DDRO",
    "counties_served": "columbia-ny,dutchess-ny,putnam-ny,greene-ny,ulster-ny,orange-ny,rockland-ny,sullivan-ny,westchester-ny,albany-ny,fulton-ny,montgomery-ny,rensselaer-ny,saratoga-ny,schenectady-ny,schoharie-ny,warren-ny,washington-ny,clinton-ny,essex-ny,franklin-ny,hamilton-ny,jefferson-ny,st-lawrence-ny",
    "catchment_boundaries": "Serves counties in New York: columbia-ny, dutchess-ny, putnam-ny, greene-ny, ulster-ny, orange-ny, rockland-ny, sullivan-ny, westchester-ny, albany-ny, fulton-ny, montgomery-ny, rensselaer-ny, saratoga-ny, schenectady-ny, schoharie-ny, warren-ny, washington-ny, clinton-ny, essex-ny, franklin-ny, hamilton-ny, jefferson-ny, st-lawrence-ny.",
    "website": "https://opwdd.ny.gov",
    "intake_phone": "(866) 946-9733",
    "early_intervention_contact": "Phone: (866) 946-9733 (Front Door)",
    "agency_intake_contact": "Phone: (866) 946-9733, Email: frontdoor@opwdd.ny.gov",
    "eligibility_info_page": "https://opwdd.ny.gov/get-started/eligibility",
    "services_page": "https://opwdd.ny.gov/services-assistance",
    "appeals_info": "https://opwdd.ny.gov/regulations-guidance/appeals-process",
    "frc_relationship": null,
    "office_locations": "Regional Front Door Office, NY",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://opwdd.ny.gov"
  },
  {
    "id": "opwdd-region-5",
    "state_id": "new-york",
    "agency_type": "ddro",
    "name": "OPWDD Region 5 - Long Island DDRO",
    "counties_served": "nassau-ny,suffolk-ny",
    "catchment_boundaries": "Serves counties in New York: nassau-ny, suffolk-ny.",
    "website": "https://opwdd.ny.gov",
    "intake_phone": "(866) 946-9733",
    "early_intervention_contact": "Phone: (866) 946-9733 (Front Door)",
    "agency_intake_contact": "Phone: (866) 946-9733, Email: frontdoor@opwdd.ny.gov",
    "eligibility_info_page": "https://opwdd.ny.gov/get-started/eligibility",
    "services_page": "https://opwdd.ny.gov/services-assistance",
    "appeals_info": "https://opwdd.ny.gov/regulations-guidance/appeals-process",
    "frc_relationship": null,
    "office_locations": "Regional Front Door Office, NY",
    "languages": "English, Spanish",
    "last_verified_date": "2026-06-01",
    "source_urls": "https://opwdd.ny.gov"
  }
];

const insertAgency = db.prepare('INSERT OR REPLACE INTO state_resource_agencies (id, state_id, agency_type, name, website, counties_served, catchment_boundaries, intake_phone, early_intervention_contact, agency_intake_contact, eligibility_info_page, services_page, appeals_info, frc_relationship, office_locations, languages, last_verified_date, source_urls, source_url, source_type, data_origin, verification_status, last_scraped_at, confidence_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
const seedAgenciesTx = db.transaction((agenciesList) => {
  for (const ag of agenciesList) {
    insertAgency.run(
      ag.id,
      ag.state_id,
      ag.agency_type,
      ag.name,
      ag.website,
      ag.counties_served,
      ag.catchment_boundaries,
      ag.intake_phone,
      ag.early_intervention_contact,
      ag.agency_intake_contact,
      ag.eligibility_info_page,
      ag.services_page,
      ag.appeals_info,
      ag.frc_relationship,
      ag.office_locations,
      ag.languages,
      ag.last_verified_date,
      ag.source_urls,
      ag.website,
      'official',
      'state_seed',
      'official_verified',
      new Date().toISOString(),
      5.0
    );
  }
});
seedAgenciesTx(seedAgencies);
console.log(`  ✓ Seeded ${seedAgencies.length} non-California State Resource Agencies.`);

// Non-California Agency Counties mappings
const seedAgencyCounties = [];

const insertAgencyCounty = db.prepare('INSERT OR REPLACE INTO regional_center_counties (regional_center_id, county_id) VALUES (?, ?)');
const seedAgencyCountiesTx = db.transaction((mappings) => {
  for (const m of mappings) {
    insertAgencyCounty.run(m.regional_center_id, m.county_id);
  }
});
seedAgencyCountiesTx(seedAgencyCounties);
console.log(`  ✓ Seeded ${seedAgencyCounties.length} non-California Agency County mappings.`);

// Program Waitlists Seed
const seedWaitlists = [
  {
    "id": "wl-hcba",
    "program_id": "hcba",
    "name": "Home and Community-Based Alternatives (HCBA) Waiver",
    "duration_label": "1.5 to 2+ Years Wait",
    "duration_months": 24.0,
    "status": "critical",
    "description": "California capped enrollment for the HCBA Waiver in July 2023. Newly submitted applications face significant wait times unless reserve capacity criteria apply.",
    "reserve_capacity_notice": "Priority intake applies to applicants under age 21 (under EPSDT rules), those transitioning from similar waivers, or those residing in health facilities for 60+ days.",
    "legal_deadline": "None (Capped waiver slots)",
    "last_scraped_at": "2026-06-07T20:04:49.460Z"
  },
  {
    "id": "wl-rc",
    "program_id": "regional-centers",
    "name": "Regional Center Lanterman Act Intake",
    "duration_label": "45 Days Max",
    "duration_months": 1.5,
    "status": "standard",
    "description": "Initial intake and assessment to determine eligibility under the Lanterman Act (Autism, Cerebral Palsy, Intellectual Disability, Epilepsy, Fifth Category).",
    "reserve_capacity_notice": null,
    "legal_deadline": "Statutory 45-day assessment limit (Welfare & Institutions Code \u00a7 4646)",
    "last_scraped_at": "2026-06-07T20:04:49.461Z"
  },
  {
    "id": "wl-ihss",
    "program_id": "ihss-for-children",
    "name": "In-Home Supportive Services (IHSS) Processing",
    "duration_label": "30 Days from Medical Form",
    "duration_months": 1.0,
    "status": "standard",
    "description": "County social workers conduct an in-home assessment of personal care and protective safety supervision needs once the SOC 873 medical form is submitted.",
    "reserve_capacity_notice": null,
    "legal_deadline": "30-day regulatory processing limit after receiving completed medical certification",
    "last_scraped_at": "2026-06-07T20:04:49.461Z"
  },
  {
    "id": "wl-ssi",
    "program_id": "ssi-for-children",
    "name": "SSI Childhood Disability Determination",
    "duration_label": "3 to 5 Months",
    "duration_months": 5.0,
    "status": "moderate",
    "description": "Social Security Administration reviews household financial records and coordinates with State Disability Determination Services (DDS) to evaluate clinical eligibility.",
    "reserve_capacity_notice": null,
    "legal_deadline": "No strict statutory limit, but standard initial reviews average 120 days",
    "last_scraped_at": "2026-06-07T20:04:49.461Z"
  },
  {
    "id": "wl-ccs",
    "program_id": "california-childrens-services",
    "name": "California Children's Services (CCS) Medical Therapy Program",
    "duration_label": "30 to 45 Days",
    "duration_months": 1.5,
    "status": "standard",
    "description": "CCS review of complex physical disabilities (Cerebral Palsy, Spina Bifida) for school-based physical/occupational therapies inside Medical Therapy Units.",
    "reserve_capacity_notice": null,
    "legal_deadline": "30 days for medical eligibility determination from completed application",
    "last_scraped_at": "2026-06-07T20:04:49.461Z"
  },
  {
    "id": "wl-tx-hcs",
    "program_id": "tx-hcs",
    "name": "Texas HCS Waiver Interest List",
    "duration_label": "15+ Years",
    "duration_months": 180.0,
    "status": "severe",
    "description": "The HCS Interest List is notoriously long with tens of thousands of individuals waiting. Placement is strictly based on chronological order of registration.",
    "reserve_capacity_notice": "Crisis or diversion cases may bypass the list under special criteria.",
    "legal_deadline": "No statutory limit on interest list wait times",
    "last_scraped_at": "2026-06-07T20:04:49.461Z"
  },
  {
    "id": "wl-tx-class",
    "program_id": "tx-class",
    "name": "Texas CLASS Waiver Interest List",
    "duration_label": "12+ Years",
    "duration_months": 144.0,
    "status": "severe",
    "description": "CLASS provides home and community-based services to people with related conditions. The interest list wait times average 12-15 years.",
    "reserve_capacity_notice": null,
    "legal_deadline": "No statutory limit on interest list wait times",
    "last_scraped_at": "2026-06-07T20:04:49.461Z"
  },
  {
    "id": "wl-fl-ibudget",
    "program_id": "fl-ibudget",
    "name": "Florida APD iBudget Waiver Waitlist",
    "duration_label": "5 to 7 Years",
    "duration_months": 72.0,
    "status": "severe",
    "description": "Florida's Agency for Persons with Disabilities (APD) maintains a waitlist for the iBudget waiver, categorized by priority groups (Categories 1-7). Only high-priority cases (e.g. crisis, foster children) receive immediate funding.",
    "reserve_capacity_notice": "Category 1 (Crisis) and Category 2 (Foster/Adoption) are prioritized above others.",
    "legal_deadline": "No statutory limit on waitlist duration",
    "last_scraped_at": "2026-06-07T20:04:49.461Z"
  },
  {
    "id": "wl-ny-opwdd",
    "program_id": "ny-opwdd-hcbs",
    "name": "New York OPWDD Request for Services Registry",
    "duration_label": "1 to 3 Years",
    "duration_months": 24.0,
    "status": "moderate",
    "description": "Rather than a chronological waitlist, NY OPWDD uses a portal registry. Services are allocated based on a scoring system evaluating critical needs and caregiver age/capabilities.",
    "reserve_capacity_notice": "Emergency or emergency-impending status cases receive immediate allocation.",
    "legal_deadline": "Evaluations and planning must start upon intake authorization",
    "last_scraped_at": "2026-06-07T20:04:49.461Z"
  }
];

const insertWaitlist = db.prepare('INSERT OR REPLACE INTO program_waitlists (id, program_id, name, duration_label, duration_months, status, description, reserve_capacity_notice, legal_deadline, last_scraped_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
const seedWaitlistsTx = db.transaction((waitlistsList) => {
  for (const wl of waitlistsList) {
    insertWaitlist.run(wl.id, wl.program_id, wl.name, wl.duration_label, wl.duration_months, wl.status, wl.description, wl.reserve_capacity_notice, wl.legal_deadline, wl.last_scraped_at);
  }
});
seedWaitlistsTx(seedWaitlists);
console.log(`  ✓ Seeded ${seedWaitlists.length} Program Waitlists.`);

// Knowledge Articles Seed
const seedArticles = [
  {
    "id": "rc-intake",
    "category": "Regional Center",
    "title": "Preparing for Regional Center Intake",
    "subtitle": "How to navigate your first Lanterman Act intake meeting and maximize your child's eligibility assessment",
    "title_es": "Preparaci\u00f3n para la Admisi\u00f3n al Centro Regional",
    "subtitle_es": "C\u00f3mo navegar su primera reuni\u00f3n de admisi\u00f3n bajo la Ley Lanterman y maximizar la evaluaci\u00f3n de elegibilidad de su hijo",
    "read_time": "8 min read",
    "read_time_es": "8 min de lectura",
    "difficulty": "Beginner",
    "color": "#6366f1",
    "steps_json": "[{\"title\":\"Understand what Regional Centers can fund\",\"content\":\"California's 21 Regional Centers are funded under the Lanterman Developmental Disabilities Services Act. They coordinate and pay for services for individuals with autism, cerebral palsy, intellectual disability, epilepsy, and \\\"fifth category\\\" (disabling conditions similar to intellectual disability that originate before age 18). Services include respite care, speech/OT/PT therapy, behavior intervention, adaptive equipment, transportation, and day programs.\",\"tip\":\"Regional Centers are the payor of LAST RESORT \u2014 this means they will try to redirect you to Medi-Cal, private insurance, or your school district first. You must exhaust those options (or show they don't apply) before the RC will fund services.\",\"citation\":\"California Welfare & Institutions Code \u00a7 4512\"},{\"title\":\"Gather your intake documentation BEFORE the appointment\",\"content\":\"Come prepared with: (1) Child's birth certificate and Social Security card, (2) Most recent diagnostic report from a licensed psychologist or physician (must name the qualifying diagnosis), (3) Medical records showing functional limitations, (4) Any prior IEP or school evaluation reports, (5) Immunization and medical history records.\",\"warning\":\"A diagnosis alone is not sufficient. The RC evaluates FUNCTIONAL LIMITATIONS in areas like communication, self-care, mobility, and self-direction. Document specific examples of daily living challenges.\"},{\"title\":\"Know your statutory rights before the meeting\",\"content\":\"Under the Lanterman Act, the RC must: (1) Initiate intake within 15 days of your request, (2) Complete eligibility determination within 120 days, (3) Provide an interpreter at no cost if you are not English-proficient, (4) Give you a written Notice of Action (NOA) for any denial with your appeal rights.\",\"citation\":\"California Welfare & Institutions Code \u00a7 4642(a)\"},{\"title\":\"What happens at the intake meeting\",\"content\":\"You will meet with an intake coordinator who reviews documentation and completes a standardized assessment (often the Vineland Adaptive Behavior Scales or similar). They assess your child across 7 areas: self-care, receptive and expressive language, learning, mobility, self-direction, capacity for independent living, and economic self-sufficiency. Be specific and concrete \u2014 describe your child's WORST days, not average days.\",\"tip\":\"Bring a written narrative (1-2 pages) describing your child's daily functioning challenges. This becomes part of the permanent file and forces the coordinator to address your specific concerns.\"},{\"title\":\"If they deny eligibility \u2014 your appeal rights\",\"content\":\"You have 30 days to request a Fair Hearing from the Office of Administrative Hearings (OAH) if you disagree with the eligibility denial or any service decision. You may also request a State Mediation (informal, faster) as an alternative. During an appeal, your current services cannot be reduced until the hearing is resolved (\\\"Aid Paid Pending\\\" protection).\",\"warning\":\"Missing the 30-day appeal window means you must restart the intake process. Track the date on your Notice of Action carefully.\",\"citation\":\"California Welfare & Institutions Code \u00a7 4710.5\"},{\"title\":\"After approval: Your Individual Program Plan (IPP)\",\"content\":\"Once eligible, the RC must develop an Individual Program Plan (IPP) with you within 60 days of eligibility. The IPP documents your child's goals and what services the RC will fund. You are a REQUIRED member of the IPP team \u2014 the RC cannot finalize an IPP without your input. Request a copy in writing after every meeting.\",\"tip\":\"Request that your IPP be reviewed at least annually or any time your child's needs change significantly. There is no limit to how often you can request an IPP review.\"}]",
    "steps_json_es": "[{\"title\":\"Comprender lo que los Centros Regionales pueden financiar\",\"content\":\"Los 21 Centros Regionales de California est\u00e1n financiados bajo la Ley de Servicios para Personas con Discapacidades del Desarrollo Lanterman. Coordinan y pagan servicios para personas con autismo, par\u00e1lisis cerebral, discapacidad intelectual, epilepsia y la \\\"quinta categor\u00eda\\\" (condiciones discapacitantes similares a la discapacidad intelectual que se originan antes de los 18 a\u00f1os). Los servicios incluyen cuidado de relevo (respite), terapias de lenguaje/OT/PT, intervenci\u00f3n conductual, equipo adaptativo, transporte y programas diurnos.\",\"tip\":\"Los Centros Regionales son el pagador de \u00daLTIMO RECURSO; esto significa que intentar\u00e1n redirigirlo primero a Medi-Cal, seguro privado o su distrito escolar. Debe agotar esas opciones antes de que el Centro Regional financie los servicios.\",\"citation\":\"C\u00f3digo de Bienestar e Instituciones de California \u00a7 4512\"},{\"title\":\"Reunir su documentaci\u00f3n de admisi\u00f3n ANTES de la cita\",\"content\":\"Venga preparado con: (1) Acta de nacimiento y tarjeta de Seguro Social del ni\u00f1o, (2) Informe de diagn\u00f3stico m\u00e1s reciente de un psic\u00f3logo o m\u00e9dico certificado (debe nombrar el diagn\u00f3stico calificado), (3) Registros m\u00e9dicos que muestren limitaciones funcionales, (4) Informes previos de IEP o evaluaciones escolares, (5) Registros de vacunaci\u00f3n e historial m\u00e9dico.\",\"warning\":\"Un diagn\u00f3stico por s\u00ed solo no es suficiente. El Centro Regional eval\u00faa las LIMITACIONES FUNCIONALES en \u00e1reas como comunicaci\u00f3n, cuidado personal, movilidad y autodirecci\u00f3n. Documente ejemplos espec\u00edficos de desaf\u00edos de la vida diaria.\"},{\"title\":\"Conocer sus derechos legales antes de la reuni\u00f3n\",\"content\":\"Bajo la Ley Lanterman, el Centro Regional debe: (1) Iniciar la admisi\u00f3n dentro de los 15 d\u00edas de su solicitud, (2) Completar la determinaci\u00f3n de elegibilidad dentro de los 120 d\u00edas, (3) Proporcionar un int\u00e9rprete sin costo si no domina el ingl\u00e9s, (4) Entregarle un Aviso de Acci\u00f3n (NOA) por escrito para cualquier denegaci\u00f3n con sus derechos de apelaci\u00f3n.\",\"citation\":\"C\u00f3digo de Bienestar e Instituciones de California \u00a7 4642(a)\"},{\"title\":\"Qu\u00e9 sucede en la reuni\u00f3n de admisi\u00f3n\",\"content\":\"Se reunir\u00e1 con un coordinador de admisi\u00f3n que revisar\u00e1 la documentaci\u00f3n y completar\u00e1 una evaluaci\u00f3n estandarizada (a menudo las Escalas de Conducta Adaptativa Vineland o similar). Eval\u00faan a su hijo en 7 \u00e1reas: cuidado personal, lenguaje receptivo y expresivo, aprendizaje, movilidad, autodirecci\u00f3n, capacidad para la vida independiente y autosuficiencia econ\u00f3mica. Sea espec\u00edfico y concreto: describa los PEORES d\u00edas de su hijo, no los d\u00edas promedio.\",\"tip\":\"Traiga una narrativa escrita (1-2 p\u00e1ginas) que describa los desaf\u00edos de funcionamiento diario de su hijo. Esto se convierte en parte del expediente permanente y obliga al coordinador a abordar sus preocupaciones espec\u00edficas.\"},{\"title\":\"Si le niegan la elegibilidad: sus derechos de apelaci\u00f3n\",\"content\":\"Tiene 30 d\u00edas para solicitar una Audiencia Imparcial ante la Oficina de Audiencias Administrativas (OAH) si no est\u00e1 de acuerdo con la denegaci\u00f3n de elegibilidad o cualquier decisi\u00f3n de servicio. Tambi\u00e9n puede solicitar una Mediaci\u00f3n Estatal (informal, m\u00e1s r\u00e1pida) como alternativa. Durante una apelaci\u00f3n, sus servicios actuales no pueden reducirse hasta que se resuelva la audiencia (protecci\u00f3n de \\\"Ayuda Pagada Pendiente\\\").\",\"warning\":\"Perder el plazo de apelaci\u00f3n de 30 d\u00edas significa que debe reiniciar el proceso de admisi\u00f3n. Realice un seguimiento cuidadoso de la fecha en su Aviso de Acci\u00f3n.\",\"citation\":\"C\u00f3digo de Bienestar e Instituciones de California \u00a7 4710.5\"},{\"title\":\"Despu\u00e9s de la aprobaci\u00f3n: Su Plan de Programa Individual (IPP)\",\"content\":\"Una vez elegible, el Centro Regional debe desarrollar un Plan de Programa Individual (IPP) con usted dentro de los 60 d\u00edas de la elegibilidad. El IPP documenta las metas de su hijo y qu\u00e9 servicios financiar\u00e1 el Centro Regional. Usted es un miembro REQUERIDO del equipo del IPP; el Centro Regional no puede finalizar un IPP sin su opini\u00f3n. Solicite una copia por escrito despu\u00e9s de cada reuni\u00f3n.\",\"tip\":\"Solicite que su IPP se revise al menos anualmente o en cualquier momento en que las necesidades de su hijo cambien significativamente. No hay l\u00edmite en la frecuencia con la que puede solicitar una revisi\u00f3n del IPP.\"}]"
  },
  {
    "id": "iep-meeting",
    "category": "IEP",
    "title": "Mastering the IEP Process",
    "subtitle": "How to prepare for IEP meetings, exercise your rights as an equal team member, and push back on inadequate placements",
    "title_es": "Dominar el Proceso del IEP",
    "subtitle_es": "C\u00f3mo prepararse para las reuniones del IEP, ejercer sus derechos como miembro igualitario del equipo y rechazar colocaciones inadecuadas",
    "read_time": "10 min read",
    "read_time_es": "10 min de lectura",
    "difficulty": "Intermediate",
    "color": "#0ea5e9",
    "steps_json": "[{\"title\":\"Your rights as an IEP team member\",\"content\":\"Under the Individuals with Disabilities Education Act (IDEA) and California Education Code, you are an EQUAL team member with every right to: disagree with assessments, propose different placements or goals, bring any individual to the meeting (advocate, therapist, friend), record the meeting (with 24-hour written notice in California), and reject any part of the IEP in writing.\",\"tip\":\"The school district CANNOT hold an IEP meeting or finalize an IEP without you. You have the absolute right to reschedule if the meeting time is inconvenient.\",\"citation\":\"IDEA 20 U.S.C. \u00a7 1414(d); California Ed Code \u00a7 56341\"},{\"title\":\"Prepare your parent statement in writing before the meeting\",\"content\":\"Write a 1-2 page \\\"Parent's Concerns and Vision\\\" statement before each IEP meeting. Include: specific skill deficits you observe at home, safety concerns, social/emotional needs, your vision for your child's long-term independence, and any services you are requesting. Hand a copy to each team member at the start of the meeting and request it be attached to the IEP.\",\"tip\":\"This statement becomes part of the official IEP record. It forces the team to formally respond to your concerns and creates documentation if you need to appeal later.\"},{\"title\":\"Understanding Least Restrictive Environment (LRE)\",\"content\":\"California and federal law require that children receive special education in the Least Restrictive Environment \u2014 meaning as much time as possible alongside non-disabled peers. Schools frequently push for more restrictive settings (self-contained classrooms) because they are cheaper. You have the right to demand a continuum of placement options be considered and documented.\",\"warning\":\"If the district recommends a more restrictive placement than you believe is appropriate, ask them to document in the IEP: (1) why inclusion with supports cannot meet your child's needs, and (2) what supplementary aids and services were considered.\",\"citation\":\"IDEA 20 U.S.C. \u00a7 1412(a)(5); California Ed Code \u00a7 56364\"},{\"title\":\"Requesting independent evaluations\",\"content\":\"If you disagree with the district's assessment, you have the right to request an Independent Educational Evaluation (IEE) at the district's expense. The district must either fund the IEE or file for a due process hearing to prove their own evaluation was appropriate. Common IEEs include: psychoeducational assessments, speech/language evaluations, OT/PT evaluations, and FBA (Functional Behavior Assessments).\",\"citation\":\"California Ed Code \u00a7 56329; 34 CFR \u00a7 300.502\"},{\"title\":\"When to disagree and how to document it\",\"content\":\"NEVER sign an IEP you disagree with under pressure. You may: (1) Sign only the attendance page (not consent), (2) Write \\\"Parent does not consent\\\" on the IEP before signing, (3) Submit a written disagreement letter within 5 school days, (4) Request a 30-day extension to review with an advocate. If you sign the IEP, you legally agree to the placement \u2014 districts know this and use meeting time pressure as a tactic.\",\"warning\":\"Signing the IEP in the meeting under pressure is the #1 mistake parents make. Take the document home. You have time.\"},{\"title\":\"Escalation: Filing a complaint or due process\",\"content\":\"Two formal escalation paths exist: (1) California Department of Education (CDE) Compliance Complaint \u2014 free to file, resolved within 60 days, covers procedural violations like missed timelines or failure to implement the IEP. (2) Office of Administrative Hearings (OAH) Due Process \u2014 formal legal hearing, can result in compensatory services or placement changes. Due process is expensive ($10,000\u2013$40,000) unless you have an advocate or nonprofit legal representation.\",\"tip\":\"File a CDE compliance complaint FIRST for procedural violations. It's free, fast, and often resolves issues without needing due process.\",\"citation\":\"California Ed Code \u00a7 56501\"}]",
    "steps_json_es": "[{\"title\":\"Sus derechos como miembro del equipo del IEP\",\"content\":\"Bajo la Ley de Educaci\u00f3n para Personas con Discapacidades (IDEA) y el C\u00f3digo de Educaci\u00f3n de California, usted es un miembro IGUALITARIO del equipo con derecho a: no estar de acuerdo con las evaluaciones, proponer colocaciones o metas diferentes, traer a cualquier persona a la reuni\u00f3n (defensor, terapeuta, amigo), grabar la reuni\u00f3n (con aviso por escrito de 24 horas en California) y rechazar cualquier parte del IEP por escrito.\",\"tip\":\"El distrito escolar NO PUEDE celebrar una reuni\u00f3n del IEP ni finalizar un IEP sin usted. Tiene el derecho absoluto de reprogramar si la hora de la reuni\u00f3n es inconveniente.\",\"citation\":\"IDEA 20 U.S.C. \u00a7 1414(d); C\u00f3digo de Educaci\u00f3n de California \u00a7 56341\"},{\"title\":\"Preparar su declaraci\u00f3n de los padres por escrito antes de la reuni\u00f3n\",\"content\":\"Escriba una declaraci\u00f3n de 1 a 2 p\u00e1ginas de \\\"Preocupaciones y Visi\u00f3n de los Padres\\\" antes de cada reuni\u00f3n del IEP. Incluya: d\u00e9ficits de habilidades espec\u00edficos que observa en el hogar, preocupaciones de seguridad, necesidades sociales/emocionales, su visi\u00f3n para la independencia a largo plazo de su hijo y cualquier servicio que est\u00e9 solicitando. Entregue una copia a cada miembro del equipo al comienzo de la reuni\u00f3n y solicite que se adjunte al IEP.\",\"tip\":\"Esta declaraci\u00f3n se convierte en parte del registro oficial del IEP. Obliga al equipo a responder formalmente a sus preocupaciones y crea documentaci\u00f3n si necesita apelar m\u00e1s adelante.\"},{\"title\":\"Comprender el Entorno Menos Restrictivo (LRE)\",\"content\":\"La ley de California y la ley federal requieren que los ni\u00f1os reciban educaci\u00f3n especial en el Entorno Menos Restrictivo, lo que significa el mayor tiempo posible junto a sus compa\u00f1eros sin discapacidades. Las escuelas con frecuencia presionan por entornos m\u00e1s restrictivos (aulas especiales) porque son menos costosos para ellas. Tiene derecho a exigir que se considere y documente una continuidad de opciones de colocaci\u00f3n.\",\"warning\":\"Si el distrito recomienda una colocaci\u00f3n m\u00e1s restrictiva de lo que considera apropiado, p\u00eddales que documenten en el IEP: (1) por qu\u00e9 la inclusi\u00f3n con apoyos no puede satisfacer las necesidades de su hijo, y (2) qu\u00e9 ayudas y servicios suplementarios se consideraron.\",\"citation\":\"IDEA 20 U.S.C. \u00a7 1412(a)(5); C\u00f3digo de Ed de California \u00a7 56364\"},{\"title\":\"Solicitar evaluaciones independientes\",\"content\":\"Si no est\u00e1 de acuerdo con la evaluaci\u00f3n del distrito, tiene derecho a solicitar una Evaluaci\u00f3n Educativa Independiente (IEE) a expensas del distrito. El distrito debe financiar la IEE o presentar una solicitud de audiencia de debido proceso para demostrar que su propia evaluaci\u00f3n fue apropiada. Las IEE comunes incluyen: evaluaciones psicoeducativas, evaluaciones del habla/lenguaje, evaluaciones de terapia ocupacional/f\u00edsica y FBA (Evaluaciones de Comportamiento Funcional).\",\"citation\":\"C\u00f3digo de Educaci\u00f3n de California \u00a7 56329; 34 CFR \u00a7 300.502\"},{\"title\":\"Cu\u00e1ndo no estar de acuerdo y c\u00f3mo documentarlo\",\"content\":\"NUNCA firme un IEP con el que no est\u00e9 de acuerdo bajo presi\u00f3n. Puede: (1) Firmar solo la p\u00e1gina de asistencia (no el consentimiento), (2) Escribir \\\"El padre no da su consentimiento\\\" en el IEP antes de firmar, (3) Enviar una carta de desacuerdo por escrito dentro de los 5 d\u00edas escolares, (4) Solicitar una extensi\u00f3n de 30 d\u00edas para revisar con un defensor. Si firma el IEP, acepta legalmente la colocaci\u00f3n; los distritos saben esto y usan la presi\u00f3n del tiempo como t\u00e1ctica.\",\"warning\":\"Firmar el IEP en la reuni\u00f3n bajo presi\u00f3n es el error n\u00famero 1 que cometen los padres. Lleve el documento a casa. Tiene tiempo.\"},{\"title\":\"Escalada: Presentar una queja o debido proceso\",\"content\":\"Existen dos caminos formales de escalada: (1) Queja de Cumplimiento del Departamento de Educaci\u00f3n de California (CDE): gratuita, se resuelve dentro de los 60 d\u00edas, cubre violaciones de procedimiento como incumplimiento de plazos o falta de implementaci\u00f3n del IEP. (2) Audiencia de Debido Proceso de la OAH: audiencia legal formal que puede resultar en servicios compensatorios o cambios de colocaci\u00f3n. El debido proceso es costoso ($10,000\u2013$40,000) a menos que tenga un defensor o representaci\u00f3n legal sin fines de lucro.\",\"tip\":\"Presente una queja de cumplimiento ante el CDE PRIMERO para violaciones de procedimiento. Es gratuita, r\u00e1pida y a menudo resuelve los problemas sin necesidad de debido proceso.\",\"citation\":\"C\u00f3digo de Ed de California \u00a7 56501\"}]"
  },
  {
    "id": "ihss-apply",
    "category": "IHSS",
    "title": "Applying for IHSS Protective Supervision",
    "subtitle": "How to secure paid parent caregiver hours for children with severe behavioral or safety impairments under IHSS",
    "title_es": "Solicitar Supervisi\u00f3n Proactiva de IHSS",
    "subtitle_es": "C\u00f3mo asegurar horas remuneradas para padres cuidadores de ni\u00f1os con discapacidades cognitivas o de comportamiento graves bajo IHSS",
    "read_time": "9 min read",
    "read_time_es": "9 min de lectura",
    "difficulty": "Intermediate",
    "color": "#10b981",
    "steps_json": "[{\"title\":\"What Protective Supervision actually means\",\"content\":\"IHSS Protective Supervision (PS) pays a designated caregiver (including a parent) to provide continuous oversight to prevent injury for individuals who \\\"are mentally impaired and cannot call for help or recognize danger.\\\" This is distinct from general personal care. For children with autism or intellectual disability, the key standard is that the child is \\\"unable to direct their own care\\\" due to cognitive impairment \u2014 not just a physical disability.\",\"citation\":\"California Welfare & Institutions Code \u00a7 12300(b); CDSS MPP \u00a7 30-756.17\"},{\"title\":\"What documentation you need\",\"content\":\"To qualify for Protective Supervision, your child's physician must complete the SOC 873 medical certification form. Beyond the SOC 873, you should also gather: (1) A physician's letter explicitly describing the child's inability to recognize and avoid danger, (2) Behavior therapy records noting elopement, self-injury, PICA, or aggression incidents, (3) School incident reports and IEP safety plans, (4) Your own written safety log documenting specific dangerous incidents with dates and times.\",\"tip\":\"Generic doctor notes saying \\\"child has autism\\\" are insufficient. The documentation must specifically describe HOW the child cannot recognize danger and what specific safety risks require 24/7 supervision.\"},{\"title\":\"What \\\"unable to direct care\\\" really means for the county\",\"content\":\"County social workers often apply the PS standard incorrectly, denying benefits by claiming the child \\\"can ask for help\\\" or \\\"shows some awareness.\\\" To meet the standard, your documentation must show the child CANNOT: consistently recognize dangerous situations (traffic, strangers, heights), understand consequences of self-injurious behavior, summon help reliably, or self-regulate to prevent injury.\",\"warning\":\"Social workers sometimes frame elopement or self-harm as \\\"behavioral problems\\\" rather than safety supervision needs. Push back by emphasizing COGNITIVE inability to recognize danger \u2014 not behavior management.\"},{\"title\":\"The county assessment home visit\",\"content\":\"A county social worker will visit your home for an assessment. During this visit: (1) Do NOT tidy up or hide safety equipment \u2014 let the social worker see the real environment (door alarms, cabinet locks, window guards). (2) Describe your child's behavior on their WORST days, not typical days. (3) Have your documentation packet ready to hand over. (4) If possible, have your child present so the worker observes their functioning directly.\",\"tip\":\"Ask the social worker to document everything they observe during the home visit. If they don't write it down, it doesn't count.\"},{\"title\":\"If you receive a Notice of Action (NOA) denial or reduction\",\"content\":\"You have two critical deadlines: (1) FILE APPEAL WITHIN 10 DAYS to maintain \\\"Aid Paid Pending\\\" \u2014 this means your CURRENT hours stay active while the appeal is processed. (2) FILE APPEAL WITHIN 90 DAYS if you do not need Aid Paid Pending protection. Missing the 10-day window means you lose existing hours immediately while you wait for the hearing.\",\"warning\":\"The 10-day rule for Aid Paid Pending is the most commonly missed deadline in IHSS appeals. Mark the NOA date on a calendar the day you receive it.\",\"citation\":\"California Welfare & Institutions Code \u00a7 10950; CDSS MPP \u00a7 22-072\"},{\"title\":\"Preparing for the State Fair Hearing\",\"content\":\"At the OAH hearing, an Administrative Law Judge (ALJ) reviews evidence. Key strategies: (1) Bring objective, third-party evidence \u2014 medical records, therapy notes, school incident logs, behavioral assessments. The ALJ heavily discounts parent testimony alone. (2) Have your treating physician or behavior therapist provide a letter or, ideally, testimony. (3) Bring a printout of your IHSS Behavior Log (generated through this platform) as your incident evidence.\",\"tip\":\"Request all county records about your child's case before the hearing (Public Records Act request). You are entitled to see what the county submitted as evidence and can challenge inaccuracies.\"}]",
    "steps_json_es": "[{\"title\":\"Qu\u00e9 significa realmente la Supervisi\u00f3n Proactiva\",\"content\":\"La Supervisi\u00f3n Proactiva (Protective Supervision - PS) de IHSS paga a un cuidador designado (incluido un padre) para proporcionar supervisi\u00f3n continua para evitar lesiones a personas que \\\"tienen un deterioro mental y no pueden pedir ayuda o reconocer el peligro\\\". Esto es diferente del cuidado personal general. Para ni\u00f1os con autismo o discapacidad intelectual, el est\u00e1ndar clave es que el ni\u00f1o es \\\"incapaz de dirigir su propio cuidado\\\" debido a un deterioro cognitivo, no solo una discapacidad f\u00edsica.\",\"citation\":\"C\u00f3digo de Bienestar e Instituciones de California \u00a7 12300(b); CDSS MPP \u00a7 30-756.17\"},{\"title\":\"Qu\u00e9 documentaci\u00f3n necesita\",\"content\":\"Para calificar para la Supervisi\u00f3n Proactiva, el m\u00e9dico de su hijo debe completar el formulario de certificaci\u00f3n m\u00e9dica SOC 873. M\u00e1s all\u00e1 del SOC 873, debe reunir: (1) Una carta del m\u00e9dico que describa expl\u00edcitamente la incapacidad del ni\u00f1o para reconocer y evitar el peligro, (2) Registros de terapia de comportamiento que indiquen incidentes de fuga (elopement), autolesi\u00f3n, PICA o agresi\u00f3n, (3) Informes de incidentes escolares y planes de seguridad del IEP, (4) Su propio registro de seguridad por escrito que documente incidentes peligrosos espec\u00edficos con fechas y horas.\",\"tip\":\"Las notas m\u00e9dicas gen\u00e9ricas que dicen \\\"el ni\u00f1o tiene autismo\\\" son insuficientes. La documentaci\u00f3n debe describir espec\u00edficamente C\u00d3MO el ni\u00f1o no puede reconocer el peligro y qu\u00e9 riesgos espec\u00edficos de seguridad requieren supervisi\u00f3n las 24 horas, los 7 d\u00edas de la semana.\"},{\"title\":\"Qu\u00e9 significa realmente \\\"incapaz de dirigir el cuidado\\\" para el condado\",\"content\":\"Los trabajadores sociales del condado a menudo aplican incorrectamente el est\u00e1ndar de PS, denegando los beneficios al afirmar que el ni\u00f1o \\\"puede pedir ayuda\\\" o \\\"muestra cierta conciencia\\\". Para cumplir con el est\u00e1ndar, su documentaci\u00f3n debe mostrar que el ni\u00f1o NO PUEDE: reconocer consistentemente situaciones peligrosas (tr\u00e1fico, extra\u00f1os, alturas), comprender las consecuencias del comportamiento autolesivo, pedir ayuda de manera confiable o autorregularse para evitar lesiones.\",\"warning\":\"Los trabajadores sociales a veces enmarcan la fuga o la autolesi\u00f3n como \\\"problemas de comportamiento\\\" en lugar de necesidades de supervisi\u00f3n de seguridad. Presione enfatizando la incapacidad COGNITIVA para reconocer el peligro, no el manejo del comportamiento.\"},{\"title\":\"La visita domiciliaria de evaluaci\u00f3n del condado\",\"content\":\"Un trabajador social del condado visitar\u00e1 su hogar para una evaluaci\u00f3n. Durante esta visita: (1) NO ordene ni esconda el equipo de seguridad; deje que el trabajador social vea el entorno real (alarmas de puertas, cerraduras de gabinetes, protectores de ventanas). (2) Describa el comportamiento de su hijo en sus PEORES d\u00edas, no en los d\u00edas t\u00edpicos. (3) Tenga su paquete de documentaci\u00f3n listo para entregar. (4) Si es posible, tenga a su hijo presente para que el trabajador observe su funcionamiento directamente.\",\"tip\":\"P\u00eddale al trabajador social que documente todo lo que observe durante la visita domiciliaria. Si no lo escriben, no cuenta.\"},{\"title\":\"Si recibe una denegaci\u00f3n o reducci\u00f3n por Aviso de Acci\u00f3n (NOA)\",\"content\":\"Tiene dos plazos cr\u00edticos: (1) PRESENTE LA APELACI\u00d3N DENTRO DE LOS 10 D\u00cdAS para mantener la \\\"Ayuda Pagada Pendiente\\\" (Aid Paid Pending): esto significa que sus horas ACTUALES permanecen activas mientras se procesa la apelaci\u00f3n. (2) PRESENTE LA APELACI\u00d3N DENTRO DE LOS 90 D\u00cdAS si no necesita la protecci\u00f3n de Ayuda Pagada Pendiente. Perder el plazo de 10 d\u00edas significa que pierde las horas existentes de inmediato mientras espera la audiencia.\",\"warning\":\"La regla de los 10 d\u00edas para la Ayuda Pagada Pendiente es el plazo que m\u00e1s se pierde en las apelaciones de IHSS. Marque la fecha del NOA en un calendario el d\u00eda que lo reciba.\",\"citation\":\"C\u00f3digo de Bienestar e Instituciones de California \u00a7 10950; CDSS MPP \u00a7 22-072\"},{\"title\":\"Preparaci\u00f3n para la Audiencia Imparcial del Estado\",\"content\":\"En la audiencia de la OAH, un Juez de Derecho Administrativo (ALJ) revisa la evidencia. Estrategias clave: (1) Traiga evidencia objetiva de terceros: registros m\u00e9dicos, notas de terapia, registros de incidentes escolares, evaluaciones de comportamiento. El juez descuenta en gran medida el testimonio de los padres por s\u00ed solo. (2) Pida a su m\u00e9dico tratante o terapeuta de comportamiento que proporcione una carta o, idealmente, testimonio. (3) Traiga una copia impresa de su Registro de Comportamiento de IHSS.\",\"tip\":\"Solicite todos los registros del condado sobre el caso de su hijo antes de la audiencia (solicitud bajo la Ley de Registros P\u00fablicos). Tiene derecho a ver lo que el condado present\u00f3 como evidencia y puede impugnar las inexactitudes.\"}]"
  },
  {
    "id": "appeals-guide",
    "category": "Appeals",
    "title": "Filing a State Fair Hearing Appeal",
    "subtitle": "Step-by-step guide to contesting IHSS, Regional Center, and Medi-Cal denials at the Office of Administrative Hearings",
    "title_es": "Presentar una Apelaci\u00f3n de Audiencia Imparcial",
    "subtitle_es": "Gu\u00eda paso a paso para impugnar denegaciones de IHSS, Centro Regional y Medi-Cal ante la Oficina de Audiencias Administrativas",
    "read_time": "7 min read",
    "read_time_es": "7 min de lectura",
    "difficulty": "Advanced",
    "color": "#f59e0b",
    "steps_json": "[{\"title\":\"When to file and which agency to contact\",\"content\":\"State Fair Hearings are adjudicated by the California Office of Administrative Hearings (OAH) for IHSS and Medi-Cal cases, and by the Office of Administrative Hearings as well for Regional Center disputes. For IEP/school disputes, the same OAH handles \\\"due process\\\" hearings under the Education Code. You can request a hearing by calling 1-800-952-5253 or filing online at cdss.ca.gov/fair-hearings.\",\"citation\":\"California Welfare & Institutions Code \u00a7 10950; California Ed Code \u00a7 56501\"},{\"title\":\"The most critical deadlines\",\"content\":\"IHSS/Medi-Cal: 90 days from the NOA date to file a Fair Hearing. 10 days for Aid Paid Pending protection. Regional Center: 30 days from the written Notice of Action. IEP Due Process: 2 years from the date you knew or should have known about the violation (with exceptions for active concealment). California CDE Complaint: 1 year from the violation.\",\"warning\":\"These deadlines are ABSOLUTE \u2014 courts have upheld dismissals for hearings filed even 1 day late. Confirm the exact date on your Notice of Action and calculate your deadline immediately.\"},{\"title\":\"Preparing your evidence packet\",\"content\":\"Organize your evidence into a tabbed binder: Tab 1 \u2014 The denial Notice of Action. Tab 2 \u2014 Medical records and physician letters specifically addressing the eligibility criteria. Tab 3 \u2014 Therapy records (ABA, speech, OT). Tab 4 \u2014 Behavior logs and incident reports. Tab 5 \u2014 School records (IEPs, assessments, incident reports). Tab 6 \u2014 Any written communications with the agency. Provide 3 copies: one for yourself, one for the ALJ, one for the opposing agency representative.\",\"tip\":\"Ask your treating providers to write letters that use the EXACT statutory language from the relevant code section. A physician who writes \\\"this child requires 24-hour protective supervision as defined under Welfare & Institutions Code \u00a7 12300(b)\\\" is far more persuasive than one who writes \\\"the child needs constant supervision.\\\"\"},{\"title\":\"At the hearing\",\"content\":\"You will appear before an Administrative Law Judge (ALJ) either in person or by phone/video. The hearing follows a semi-formal process: opening statements, county presents their case, you cross-examine their witness, you present your evidence, county cross-examines. You may represent yourself (pro per) or have an advocate or attorney. Non-attorney representatives are allowed at Fair Hearings.\",\"tip\":\"Request a Spanish or other-language interpreter in advance if needed \u2014 this is your right at no cost.\"},{\"title\":\"After the decision\",\"content\":\"The ALJ issues a proposed decision, which the agency Director must adopt, reject, or modify within 35 days (IHSS/Medi-Cal) or 30 days (Regional Center). If you win, services must be restored retroactively. If you lose, you may appeal to the Superior Court (writ of mandamus) within 90 days of the final agency decision. Free legal help is available through: Disability Rights California (1-800-776-5746), Regional Center Client Rights Advocates, COPAA member attorneys.\",\"citation\":\"California Welfare & Institutions Code \u00a7 10960; Government Code \u00a7 11517\"}]",
    "steps_json_es": "[{\"title\":\"Cu\u00e1ndo presentar y a qu\u00e9 agencia contactar\",\"content\":\"Las Audiencias Imparciales del Estado son adjudicadas por la Oficina de Audiencias Administrativas (OAH) de California para casos de IHSS y Medi-Cal, y tambi\u00e9n por la OAH para disputas del Centro Regional. Para disputas de IEP/escolares, la misma OAH maneja las audiencias de \\\"debido proceso\\\" bajo el C\u00f3digo de Educaci\u00f3n. Puede solicitar una audiencia llamando al 1-800-952-5253 o presentando su solicitud en l\u00ednea en cdss.ca.gov/fair-hearings.\",\"citation\":\"C\u00f3digo de Bienestar e Instituciones de California \u00a7 10950; C\u00f3digo de Ed de California \u00a7 56501\"},{\"title\":\"Los plazos m\u00e1s cr\u00edticos\",\"content\":\"IHSS/Medi-Cal: 90 d\u00edas desde la fecha del NOA para presentar una Audiencia Imparcial. 10 d\u00edas para la protecci\u00f3n de Ayuda Pagada Pendiente. Centro Regional: 30 d\u00edas desde el Aviso de Acci\u00f3n por escrito. Debido Proceso del IEP: 2 a\u00f1os a partir de la fecha en que conoci\u00f3 o deber\u00eda haber conocido la violaci\u00f3n (con excepciones por ocultamiento activo). Queja del CDE de California: 1 a\u00f1o desde la violaci\u00f3n.\",\"warning\":\"Estos plazos son ABSOLUTOS: los tribunales han confirmado las desestimaciones de audiencias presentadas incluso 1 d\u00eda tarde. Confirme la fecha exacta en su Aviso de Acci\u00f3n y calcule su plazo de inmediato.\"},{\"title\":\"Preparar su paquete de pruebas\",\"content\":\"Organice sus pruebas en una carpeta con pesta\u00f1as: Pesta\u00f1a 1 \u2014 El Aviso de Acci\u00f3n de denegaci\u00f3n. Pesta\u00f1a 2 \u2014 Registros m\u00e9dicos y cartas del m\u00e9dico que aborden espec\u00edficamente los criterios de elegibilidad. Pesta\u00f1a 3 \u2014 Registros de terapia (ABA, habla, OT). Pesta\u00f1a 4 \u2014 Registros de comportamiento e informes de incidentes. Pesta\u00f1a 5 \u2014 Registros escolares (IEP, evaluaciones, informes de incidentes). Proporcione 3 copias: una para usted, otra para el juez y otra para el representante de la agencia opositora.\",\"tip\":\"Pida a sus proveedores tratantes que escriban cartas que utilicen el lenguaje legal EXACTO de la secci\u00f3n del c\u00f3digo correspondiente. Un m\u00e9dico que escribe \\\"este ni\u00f1o requiere supervisi\u00f3n de seguridad las 24 horas como se define en el C\u00f3digo de Bienestar e Instituciones \u00a7 12300(b)\\\" es mucho m\u00e1s persuasivo que uno que escribe \\\"el ni\u00f1o necesita supervisi\u00f3n constante\\\".\"},{\"title\":\"Durante la audiencia\",\"content\":\"Aparecer\u00e1 ante un Juez de Derecho Administrativo (ALJ) en persona o por tel\u00e9fono/video. La audiencia sigue un proceso semi-formal: declaraciones de apertura, el condado presenta su caso, usted interroga a su testigo, usted presenta sus pruebas y el condado realiza el contrainterrogatorio. Puede representarse a s\u00ed mismo (pro per) o contar con un defensor o abogado. Se permiten representantes que no sean abogados en las Audiencias Imparciales.\",\"tip\":\"Solicite un int\u00e9rprete de espa\u00f1ol u otro idioma con anticipaci\u00f3n si es necesario: este es su derecho sin costo alguno.\"},{\"title\":\"Despu\u00e9s de la decisi\u00f3n\",\"content\":\"El juez emite una decisi\u00f3n propuesta, que el director de la agencia debe adoptar, rechazar o modificar dentro de los 35 d\u00edas (IHSS/Medi-Cal) o 30 d\u00edas (Centro Regional). Si gana, los servicios deben restablecerse retroactivamente. Si pierde, puede apelar ante el Tribunal Superior (orden de mandato) dentro de los 90 d\u00edas de la decisi\u00f3n final de la agencia. Hay ayuda legal gratuita disponible a trav\u00e9s de: Disability Rights California (1-800-776-5746) y defensores de derechos del cliente de los Centros Regionales.\",\"citation\":\"C\u00f3digo de Bienestar e Instituciones de California \u00a7 10960; C\u00f3digo de Gobierno \u00a7 11517\"}]"
  },
  {
    "id": "self-determination",
    "category": "SDP",
    "title": "Transitioning to Self-Determination Program",
    "subtitle": "Understanding the SDP spending plan, FMS selection, and avoiding the common pitfalls of the transition",
    "title_es": "Transici\u00f3n al Programa de Autodeterminaci\u00f3n",
    "subtitle_es": "Comprender el plan de gastos del SDP, la selecci\u00f3n de FMS y c\u00f3mo evitar los errores comunes de la transici\u00f3n",
    "read_time": "8 min read",
    "read_time_es": "8 min de lectura",
    "difficulty": "Advanced",
    "color": "#8b5cf6",
    "steps_json": "[{\"title\":\"What the Self-Determination Program (SDP) is\",\"content\":\"SDP allows Regional Center consumers (or their families) to control an individualized budget and directly hire their own service providers, instead of working through RC-vendorized agencies. This gives enormous flexibility to hire bilingual providers, set specific schedules, and access less common supports. The program is overseen by the Dept. of Developmental Services and managed locally by each Regional Center.\",\"citation\":\"California Welfare & Institutions Code \u00a7 4685.8\"},{\"title\":\"The Individual Budget calculation\",\"content\":\"Your SDP budget is based on your current \\\"Purchase of Service\\\" (POS) spending from the Regional Center, adjusted by a statewide formula. You cannot receive more than a calculated maximum, but you can allocate the budget across any approved service categories differently than your current plan. Hire a Financial Management Service (FMS) first \u2014 they will help you create the Spending Plan before your budget is finalized.\",\"tip\":\"Your RC coordinator may present the budget as fixed. You can challenge the calculation. Request the worksheet that shows how your budget was computed and compare it against your historical POS spending.\"},{\"title\":\"Choosing a Financial Management Service (FMS)\",\"content\":\"The FMS acts as your fiscal employer \u2014 they handle background checks, payroll, billing to the RC, and compliance for the workers you hire. California has multiple DDS-approved FMS providers. Compare them on: (1) How quickly they process new hire paperwork, (2) How quickly they pay workers (delays cause provider turnover), (3) Whether they have bilingual staff, (4) Their track record with the RC in your catchment.\",\"warning\":\"Slow FMS processing is the #1 cause of SDP service gaps. Workers can quit if paychecks are delayed. Interview your FMS on their average time-to-first-paycheck before signing.\"},{\"title\":\"Writing your Spending Plan\",\"content\":\"Your Spending Plan must allocate your budget across service categories: respite, behavior services, community-based supports, personal care, transportation, etc. Each category needs: a service description, number of hours/units, cost per unit, and total cost. The plan must align with your child's IPP goals. An Independent Facilitator (IF) can help you write the plan \u2014 this is an RC-funded role.\",\"tip\":\"Build a 5-10% unallocated reserve for unexpected needs. The SDP allows you to reallocate funds between categories during the year with RC approval.\"},{\"title\":\"Avoiding the transition service gap\",\"content\":\"The most dangerous moment in SDP is the transition date \u2014 when RC-vendorized services stop and your self-hired providers must be fully credentialed through the FMS. Providers who are not fully cleared on day 1 cannot legally provide (or be paid for) services. Start the FMS onboarding process 60-90 days before your SDP start date. Do not finalize a start date until all key providers are cleared.\",\"warning\":\"Never agree to a SDP start date until your FMS confirms all providers are cleared. The Regional Center may pressure you to \\\"go live\\\" before providers are ready.\"}]",
    "steps_json_es": "[{\"title\":\"Qu\u00e9 es el Programa de Autodeterminaci\u00f3n (SDP)\",\"content\":\"El SDP permite a los consumidores del Centro Regional (o a sus familias) controlar un presupuesto individualizado y contratar directamente a sus propios proveedores de servicios, en lugar de trabajar a trav\u00e9s de agencias vendidas por el Centro Regional. Esto brinda una flexibilidad enorme para contratar proveedores biling\u00fces, establecer horarios espec\u00edficos y acceder a apoyos menos comunes. El programa es supervisado por el Dept. de Servicios del Desarrollo (DDS) y administrado localmente por cada Centro Regional.\",\"citation\":\"C\u00f3digo de Bienestar e Instituciones de California \u00a7 4685.8\"},{\"title\":\"El c\u00e1lculo del Presupuesto Individual\",\"content\":\"Su presupuesto del SDP se basa en su gasto actual de \\\"Compra de Servicios\\\" (POS) del Centro Regional, ajustado por una f\u00f3rmula estatal. No puede recibir m\u00e1s de un m\u00e1ximo del presupuesto calculado, pero puede asignar el presupuesto a categor\u00edas diferentes.\",\"tip\":\"Su coordinador del Centro Regional puede presentar el presupuesto como fijo. Puede impugnar el c\u00e1lculo. Solicite la hoja de trabajo que muestra c\u00f3mo se calcul\u00f3 su presupuesto y comp\u00e1rela con su gasto POS hist\u00f3rico.\"},{\"title\":\"Elegir un Servicio de Gesti\u00f3n Financiera (FMS)\",\"content\":\"El FMS act\u00faa como su empleador fiscal: maneja las verificaciones de antecedentes, la n\u00f3mina, la facturaci\u00f3n al Centro Regional y el cumplimiento de los trabajadores que contrata. California tiene m\u00faltiples proveedores de FMS aprobados por el DDS. Comp\u00e1relos en: (1) Qu\u00e9 tan r\u00e1pido procesan el papeleo de las nuevas contrataciones, (2) Qu\u00e9 tan r\u00e1pido pagan a los trabajadores, (3) Si tienen personal biling\u00fce, (4) Su historial con el Centro Regional en su \u00e1rea.\",\"warning\":\"El procesamiento lento del FMS es la causa n\u00famero 1 de las brechas en el servicio del SDP. Los trabajadores pueden renunciar si los cheques de pago se retrasan. Entreviste a su FMS sobre su tiempo promedio para el primer cheque de pago antes de firmar.\"},{\"title\":\"Redactar su Plan de Gastos\",\"content\":\"Su Plan de Gastos debe asignar su presupuesto a las categor\u00edas de servicio: respiro, servicios de comportamiento, apoyos basados en la comunidad, cuidado personal, transporte, etc. Cada categor\u00eda necesita: una descripci\u00f3n del servicio, n\u00famero de horas/unidades, costo por unidad y costo total. El plan debe alinearse con las metas del IPP de su hijo. Un Facilitador Independiente (IF) puede ayudarle a redactar el plan (este es un rol financiado por el Centro Regional).\",\"tip\":\"Construya una reserva no asignada del 5-10% para necesidades inesperadas. El SDP le permite reasignar fondos entre categor\u00edas durante el a\u00f1o con la aprobaci\u00f3n del Centro Regional.\"},{\"title\":\"Evitar la brecha de servicio de transici\u00f3n\",\"content\":\"El momento m\u00e1s cr\u00edtico en el SDP es la fecha de transici\u00f3n, cuando se detienen los servicios vendidos por el Centro Regional y sus proveedores contratados por usted mismo deben estar completamente acreditados a trav\u00e9s del FMS. Los proveedores que no est\u00e9n completamente autorizados el d\u00eda 1 no pueden prestar servicios legalmente. Comience el proceso de incorporaci\u00f3n del FMS de 60 a 90 d\u00edas antes de su fecha de inicio del SDP.\",\"warning\":\"Nunca acepte una fecha de inicio del SDP hasta que su FMS confirme que todos los proveedores est\u00e1n autorizados. El Centro Regional puede presionarle para \\\"comenzar en vivo\\\" antes de que los proveedores est\u00e9n listo.\"}]"
  }
];

const insertArticle = db.prepare('INSERT OR REPLACE INTO knowledge_articles (id, category, title, subtitle, title_es, subtitle_es, read_time, read_time_es, difficulty, color, steps_json, steps_json_es) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
const seedArticlesTx = db.transaction((articlesList) => {
  for (const art of articlesList) {
    insertArticle.run(art.id, art.category, art.title, art.subtitle, art.title_es, art.subtitle_es, art.read_time, art.read_time_es, art.difficulty, art.color, art.steps_json, art.steps_json_es);
  }
});
const extraArticles = [
  {
    id: "calable-guide",
    category: "Savings & Benefits",
    title: "Saving with CalABLE Accounts",
    subtitle: "How to save up to $100,000 tax-free for disability expenses without losing Medi-Cal or SSI benefits",
    title_es: "Ahorrar con Cuentas CalABLE",
    subtitle_es: "Cómo ahorrar hasta $100,000 libres de impuestos para gastos de discapacidad sin perder los beneficios de Medi-Cal o SSI",
    read_time: "7 min read",
    read_time_es: "7 min de lectura",
    difficulty: "Beginner",
    color: "#3b82f6",
    steps_json: JSON.stringify([
      {
        title: "What is CalABLE?",
        content: "California's implementation of the federal ABLE Act allows eligible individuals with disabilities to save money in a tax-advantaged account. Earnings grow tax-free when used for qualified disability expenses.",
        citation: "IRC Section 529A; California Welfare & Institutions Code § 4860"
      },
      {
        title: "Eligibility Criteria",
        content: "Must have a disability onset before age 26 (changing to age 46 in 2026), and meet the severity standards of SSI or SSDI, or have a signed physician's diagnosis.",
        tip: "You do not need to be receiving SSI or SSDI to open an account, as long as you meet the disability severity requirements and have a doctor's letter."
      },
      {
        title: "The $100,000 Rule and SSI Limits",
        content: "Up to $100,000 in a CalABLE account is completely disregarded for the SSI resource limit (normally $2,000 for individuals). If the balance exceeds $100k, SSI benefits are suspended, but Medi-Cal remains active.",
        warning: "If you exceed the $100k threshold, the excess is counted toward your resource limit, which can temporarily suspend your monthly SSI check. Keep an eye on the account balance."
      },
      {
        title: "Qualified Disability Expenses (QDE)",
        content: "Funds can be spent on a very wide range of expenses related to the disability: housing, education, transportation, employment training, assistive technology, personal support services, health, and wellness.",
        tip: "Keep all receipts for expenses paid from your CalABLE account. While you don't submit them with taxes, the IRS can audit you to verify the funds were used for QDEs."
      },
      {
        title: "Contribution Limits",
        content: "Annual contribution limits match the federal gift tax exclusion (currently $18,000), plus additional savings if the beneficiary is employed under the ABLE to Work Act.",
        citation: "26 U.S.C. § 529A(b)(2)"
      },
      {
        title: "Opening and Managing the Account",
        content: "CalABLE accounts are opened online at calable.ca.gov. You can choose from various investment portfolios or a FDIC-insured interest-bearing option.",
        tip: "You can link a debit card directly to your CalABLE account for easy access to funds for daily qualified expenses."
      }
    ]),
    steps_json_es: JSON.stringify([
      {
        title: "¿Qué es CalABLE?",
        content: "La implementación de California de la Ley ABLE federal permite a las personas elegibles con discapacidades ahorrar dinero en una cuenta con ventajas impositivas. Las ganancias crecen libres de impuestos cuando se usan para gastos calificados de discapacidad.",
        citation: "Sección 529A del IRC; Código de Bienestar e Instituciones de California § 4860"
      },
      {
        title: "Criterios de Elegibilidad",
        content: "El inicio de la discapacidad debe ser antes de los 26 años (cambiará a 46 años en 2026) y cumplir con los estándares de gravedad de SSI o SSDI, o tener un diagnóstico médico firmado.",
        tip: "No necesita recibir SSI o SSDI para abrir una cuenta, siempre que cumpla con los requisitos de gravedad de la discapacidad y tenga una carta del médico."
      },
      {
        title: "La Regla de los $100,000 y los Límites de SSI",
        content: "Se ignoran por completo hasta $100,000 en una cuenta CalABLE para el límite de recursos de SSI (normalmente $2,000 para individuos). Si el saldo supera los $100k, los beneficios de SSI se suspenden, pero Medi-Cal permanece activo.",
        warning: "Si supera el límite de $100k, el exceso se cuenta para su límite de recursos, lo que puede suspender temporalmente su cheque mensual de SSI. Supervise el saldo de la cuenta."
      },
      {
        title: "Gastos Calificados de Discapacidad (QDE)",
        content: "Los fondos se pueden gastar en una amplia gama de gastos relacionados con la discapacidad: vivienda, educación, transporte, capacitación laboral, tecnología asistiva, servicios de apoyo personal, salud y bienestar.",
        tip: "Guarde todos los recibos de los gastos pagados con su cuenta CalABLE. Aunque no los envíe con los impuestos, el IRS puede auditarlo para verificar que los fondos se usaron para QDE."
      },
      {
        title: "Límites de Contribución",
        content: "Los límites anuales de contribución coinciden con la exclusión del impuesto federal sobre donaciones (actualmente $18,000), más ahorros adicionales si el beneficiario trabaja bajo la Ley ABLE to Work.",
        citation: "26 U.S.C. § 529A(b)(2)"
      },
      {
        title: "Apertura y Gestión de la Cuenta",
        content: "Las cuentas CalABLE se abren en línea en calable.ca.gov. Puede elegir entre varias carteras de inversión o una opción con intereses asegurada por la FDIC.",
        tip: "Puede vincular una tarjeta de débito directamente a su cuenta CalABLE para acceder fácilmente a los fondos para gastos calificados diarios."
      }
    ])
  },
  {
    id: "mdr-guide",
    category: "IEP & School Rights",
    title: "Navigating Manifestation Determination Reviews",
    subtitle: "A parent's guide to school suspension and expulsion defense for students with IEPs",
    title_es: "Navegar las Revisiones de Determinación de Manifestación",
    subtitle_es: "Guía para padres sobre la defensa contra suspensiones y expulsiones escolares para estudiantes con IEP",
    read_time: "8 min read",
    read_time_es: "8 min de lectura",
    difficulty: "Intermediate",
    color: "#ef4444",
    steps_json: JSON.stringify([
      {
        title: "What is an MDR?",
        content: "When a student with an IEP faces a disciplinary change of placement (suspension of more than 10 consecutive school days or a pattern of shorter suspensions totaling 10+ days), the school must hold a Manifestation Determination Review (MDR) meeting.",
        citation: "IDEA 20 U.S.C. § 1415(k)(1)(E); 34 CFR § 300.530(e)"
      },
      {
        title: "The Two Critical Questions",
        content: "The IEP team must answer: (1) Was the student's behavior caused by, or did it have a direct and substantial relationship to, their disability? or (2) Was the behavior the direct result of the school's failure to implement the IEP?",
        warning: "School administrators often try to downplay the connection between behavior and disability by arguing the behavior was 'intentional' or 'planned'. You must show that the disability affects impulse control, social skills, or emotional regulation."
      },
      {
        title: "Preparing Your Evidence",
        content: "Gather behavior intervention plans (BIPs), school incident logs, independent psychological evaluations, and medical reports. Show how your child's specific diagnosis (e.g., ADHD, Autism, ODD) manifests in school settings.",
        tip: "If you have a private behavior therapist or doctor, ask them to write a letter explaining how the student's disability directly relates to the specific incident."
      },
      {
        title: "The Outcomes of the Meeting",
        content: "If the behavior IS a manifestation, the student returns to their placement (unless parent and school agree otherwise), and the school must conduct a Functional Behavior Assessment (FBA) and implement or revise a BIP. If it is NOT a manifestation, the school can apply the same discipline as for general education students.",
        citation: "34 CFR § 300.530(f)"
      },
      {
        title: "Appealing an MDR Decision",
        content: "If you disagree with the MDR decision, you have the right to request an expedited due process hearing. The hearing must occur within 20 school days of filing, and the ALJ must make a decision within 10 school days.",
        warning: "During an expedited appeal, the student remains in the disciplinary placement (interim alternative educational setting) pending the hearing decision unless the parent and district agree otherwise."
      }
    ]),
    steps_json_es: JSON.stringify([
      {
        title: "¿Qué es una MDR?",
        content: "Cuando un estudiante con un IEP enfrenta un cambio disciplinario de colocación (suspensión de más de 10 días escolares consecutivos o un patrón de suspensiones más cortas que suman 10+ días), la escuela debe celebrar una reunión de Revisión de Determinación de Manifestación (MDR).",
        citation: "IDEA 20 U.S.C. § 1415(k)(1)(E); 34 CFR § 300.530(e)"
      },
      {
        title: "Las dos preguntas críticas",
        content: "El equipo del IEP debe responder: (1) ¿El comportamiento del estudiante fue causado por, o tuvo una relación directa y sustancial con su discapacidad? o (2) ¿El comportamiento fue el resultado directo de la falta de la escuela de implementar el IEP?",
        warning: "Los administradores escolares a menudo intentan restar importancia a la conexión entre el comportamiento y la discapacidad argumentando que el comportamiento fue 'intencional' o 'planificado'. Debe demostrar que la discapacidad afecta el control de impulsos, las habilidades sociales o la regulación emocional."
      },
      {
        title: "Preparar sus pruebas",
        content: "Reúna planes de intervención de comportamiento (BIP), registros de incidentes escolares, evaluaciones psicológicas independientes e informes médicos. Muestre cómo el diagnóstico específico de su hijo (por ejemplo, TDAH, Autismo, TOC) se manifiesta en el entorno escolar.",
        tip: "Si tiene un terapeuta de conducta privado o un médico, pídales que escriban una carta explicando cómo la discapacidad del estudiante se relaciona directamente con el incidente específico."
      },
      {
        title: "Los resultados de la reunión",
        content: "Si el comportamiento SÍ es una manifestación, el estudiante regresa a su colocación (a menos que el padre y la escuela acuerden lo contrario), y la escuela debe realizar una Evaluación de Comportamiento Funcional (FBA) e implementar o revisar un BIP. Si NO es una manifestación, la escuela puede aplicar la misma disciplina que para los estudiantes de educación general.",
        citation: "34 CFR § 300.530(f)"
      },
      {
        title: "Apelar una decisión de la MDR",
        content: "Si no está de acuerdo con la decisión de la MDR, tiene derecho a solicitar una audiencia de debido proceso acelerada. La audiencia debe realizarse dentro de los 20 días escolares posteriores a la presentación, y el juez debe tomar una decisión dentro de los 10 días escolares.",
        warning: "Durante una apelación acelerada, el estudiante permanece en la colocación disciplinaria (entorno educativo alternativo temporal) en espera de la decisión de la audiencia, a menos que el padre y el distrito acuerden lo contrario."
      }
    ])
  },
  {
    id: "respite-care-guide",
    category: "Regional Center",
    title: "Securing Respite Care Services",
    subtitle: "How to request, calculate, and maximize behavioral and in-home respite hours from your California Regional Center",
    title_es: "Asegurar Servicios de Cuidado de Relevo (Respite)",
    subtitle_es: "Cómo solicitar, calcular y maximizar las horas de relevo conductual y en el hogar de su Centro Regional de California",
    read_time: "8 min read",
    read_time_es: "8 min de lectura",
    difficulty: "Beginner",
    color: "#10b981",
    steps_json: JSON.stringify([
      {
        title: "Understanding Respite Care",
        content: "Respite care is designed to give primary caregivers a temporary break from the daily demands of caring for an individual with a developmental disability. It is provided in the home (In-Home Respite) or out of the home (Out-of-Home Respite) by trained staff.",
        citation: "California Welfare & Institutions Code § 4686"
      },
      {
        title: "How to Request Respite at your IPP",
        content: "Request respite care during your child's Individual Program Plan (IPP) meeting. Emphasize the extraordinary care needs compared to a typically developing child of the same age, highlighting sleeplessness, safety risks, or medical requirements.",
        tip: "Keep a 2-week log documenting the child's sleep patterns, behavioral challenges, and how often you must actively redirect or intervene. This provides concrete evidence of your need for a break."
      },
      {
        title: "Understanding the Allocation Formula",
        content: "Regional Centers use internal guidelines (which they must make public under SB 468) to determine the number of hours. Common allocations range from 12 to 30 hours per month, but can be higher for children with severe behavior or medical needs.",
        warning: "Regional Centers cannot use 'caps' or rigid maximums to deny you more hours if your child's needs justify it. Every allocation must be individualized based on your unique circumstances."
      },
      {
        title: "Selecting a Respite Agency",
        content: "You can use a vendorized agency where the agency hires and schedules the worker, or you can use the 'Employer of Record' (FMS) option to recruit and select your own trusted friend, relative, or therapist to be paid by the Regional Center.",
        tip: "Finding reliable respite workers is a common challenge. Recruiting your own worker (such as a college student studying special ed or a behavior therapist already working with your child) is often the most successful strategy."
      },
      {
        title: "Appealing Respite Denials",
        content: "If the Regional Center denies respite or awards fewer hours than requested, they must issue a Notice of Action (NOA). You have 30 days to file an appeal to request mediation or a Fair Hearing.",
        citation: "California Welfare & Institutions Code § 4710.5"
      }
    ]),
    steps_json_es: JSON.stringify([
      {
        title: "Comprender el Cuidado de Relevo (Respite)",
        content: "El cuidado de relevo está diseñado para dar a los cuidadores principales un descanso temporal de las demandas diarias de cuidar a una persona con una discapacidad del desarrollo. Es proporcionado en el hogar (Relevo en el Hogar) o fuera de él (Relevo Fuera del Hogar) por personal capacitado.",
        citation: "Código de Bienestar e Instituciones de California § 4686"
      },
      {
        title: "Cómo solicitar Relevo en su IPP",
        content: "Solicite cuidado de relevo durante la reunión del Plan de Programa Individual (IPP) de su hijo. Enfatice las necesidades extraordinarias de cuidado en comparación con un niño de desarrollo típico de la misma edad, destacando la falta de sueño, los riesgos de seguridad o los requisitos médicos.",
        tip: "Mantenga un registro de 2 semanas que documente los patrones de sueño de su hijo, los desafíos de comportamiento y la frecuencia con la que debe redirigir o intervenir activamente. Esto proporciona evidencia concreta de su necesidad de un descanso."
      },
      {
        title: "Comprender la fórmula de asignación",
        content: "Los Centros Regionales usan pautas internas (que deben hacer públicas bajo la ley SB 468) para determinar el número de horas. Las asignaciones comunes van de 12 a 30 horas por mes, pero pueden ser mayores para niños con necesidades de comportamiento o médicas graves.",
        warning: "Los Centros Regionales no pueden usar 'topes' o máximos rígidos para negarle más horas si las necesidades de su hijo lo justifican. Cada asignación debe ser individualizada según sus circunstancias únicas."
      },
      {
        title: "Seleccionar una agencia de relevo",
        content: "Puede usar una agencia proveedora autorizada donde la agencia contrata y programa al trabajador, o puede usar la opción de 'Empleador de Registro' (FMS) para reclutar y seleccionar a su propio amigo, familiar o terapeuta de confianza para que reciba el pago del Centro Regional.",
        tip: "Encontrar trabajadores de relevo confiables es un desafío común. Reclutar a su propio trabajador (como un estudiante universitario que estudia educación especial o un terapeuta conductual que ya trabaja con su hijo) suele ser la estrategia más exitosa."
      },
      {
        title: "Apelar denegaciones de relevo",
        content: "Si el Centro Regional niega el servicio de relevo o aprueba menos horas de las solicitadas, debe emitir un Aviso de Acción (NOA). Tiene 30 días para presentar una apelación para solicitar una mediación o una Audiencia Imparcial.",
        citation: "Código de Bienestar e Instituciones de California § 4710.5"
      }
    ])
  },
  {
    id: "institutional-deeming-guide",
    category: "Medi-Cal & Waivers",
    title: "Medi-Cal Institutional Deeming Waiver",
    subtitle: "How high-income families bypass income limits to secure full Medi-Cal coverage for Regional Center consumers",
    title_es: "Exención de Consideración Institucional de Medi-Cal",
    subtitle_es: "Cómo las familias de altos ingresos eluden los límites para asegurar la cobertura completa de Medi-Cal para consumidores del Centro Regional",
    read_time: "9 min read",
    read_time_es: "9 min de lectura",
    difficulty: "Advanced",
    color: "#f59e0b",
    steps_json: JSON.stringify([
      {
        title: "What is Institutional Deeming?",
        content: "Normally, Medi-Cal eligibility for a child is based on the parents' income. However, under the Home and Community-Based Services (HCBS) Developmental Disabilities Waiver, if a child is a client of a California Regional Center, the parents' income is completely bypassed (not 'deemed' to the child). Only the child's personal income and resources are evaluated.",
        citation: "California Welfare & Institutions Code § 14132.99; 42 U.S.C. § 1396n(c)"
      },
      {
        title: "The Golden Rule of Eligibility",
        content: "To qualify, the child must: (1) Be a Regional Center consumer, (2) Be under age 18, (3) Live at home with their parents, (4) Meet the institutional level of care (ICF-DD or nursing facility standard), (5) Not have personal resources exceeding $2,000.",
        warning: "The child cannot have assets in their own name (like a savings account or trust that is not special needs structured) exceeding $2,000. Open a CalABLE account to save money for the child safely."
      },
      {
        title: "The Application Process through the Regional Center",
        content: "The deeming process starts with your Regional Center service coordinator, NOT directly with Medi-Cal. Request an 'Institutional Deeming Referral' (sometimes called a DS 1957 referral). The coordinator submits this to the Department of Health Care Services (DHCS) to verify the level of care.",
        tip: "Service coordinators are often backlogged. Follow up in writing weekly once you request the deeming referral, as this process can take 3 to 6 months to complete."
      },
      {
        title: "Submitting the Medi-Cal Application",
        content: "Once the Regional Center sends the referral, you will receive a Medi-Cal packet from the county social services agency. You must complete the application, listing only the child's income and assets. You will need to provide the Regional Center's referral verification.",
        warning: "Do NOT include parent income in the child's income section of the Medi-Cal form, as this will lead to an automatic rejection by county eligibility workers who are unfamiliar with the institutional deeming rules. Include a cover letter explaining that the application is under the HCBS DD waiver."
      },
      {
        title: "Maintaining the Waiver",
        content: "The institutional deeming waiver must be renewed annually. This requires: (1) An active Regional Center IPP showing the child receives at least one qualifying Regional Center-funded service (like respite or speech therapy) per year, and (2) Annual Medi-Cal redetermination forms showing the child's personal assets remain under $2,000.",
        citation: "DHCS Medi-Cal Eligibility Procedures Manual Section 15I"
      }
    ]),
    steps_json_es: JSON.stringify([
      {
        title: "¿Qué es la Consideración Institucional?",
        content: "Normalmente, la elegibilidad de Medi-Cal para un niño se basa en los ingresos de los padres. Sin embargo, bajo la Exención de Servicios Basados en el Hogar y la Comunidad (HCBS) para Discapacidades del Desarrollo, si un niño es cliente de un Centro Regional de California, los ingresos de los padres se ignoran por completo (no se 'consideran' al niño). Solo se evalúan los ingresos y recursos personales del niño.",
        citation: "Código de Bienestar e Instituciones de California § 14132.99; 42 U.S.C. § 1396n(c)"
      },
      {
        title: "La regla de oro de la elegibilidad",
        content: "Para calificar, el niño debe: (1) Ser consumidor del Centro Regional, (2) Ser menor de 18 años, (3) Vivir en casa con sus padres, (4) Cumplir con el nivel de cuidado institucional (estándar ICF-DD o de centro de enfermería), (5) No tener recursos personales que superen los $2,000.",
        warning: "El niño no puede tener activos a su nombre (como una cuenta de ahorros o un fideicomiso que no esté estructurado para necesidades especiales) que superen los $2,000. Abra una cuenta CalABLE para ahorrar dinero de forma segura."
      },
      {
        title: "El proceso de solicitud a través del Centro Regional",
        content: "El proceso de consideración institucional comienza con su coordinator de servicios del Centro Regional, NO directamente con Medi-Cal. Solicite una 'Referencia de Consideración Institucional' (a veces llamada referencia DS 1957). El coordinador envía esto al Departamento de Servicios de Atención Médica (DHCS) para verificar el nivel de cuidado.",
        tip: "Los coordinadores de servicios a menudo tienen acumulaciones de trabajo. Haga un seguimiento por escrito semanalmente una vez que solicite la referencia de consideración, ya que este proceso puede tardar de 3 a 6 meses en completarse."
      },
      {
        title: "Presentar la solicitud de Medi-Cal",
        content: "Once the Regional Center sends the referral, you will receive a Medi-Cal packet from the county social services agency. You must complete the application, listing only the child's income and assets. You will need to provide the Regional Center's referral verification.",
        warning: "NO incluya los ingresos de los padres en la sección de ingresos del niño del formulario de Medi-Cal, ya que esto provocará un rechazo automático por parte de los trabajadores de elegibilidad del condado que no están familiarizados con las reglas de consideración institucional. Incluya una carta de presentación explicando que la solicitud está bajo la exención HCBS DD."
      },
      {
        title: "Mantener la exención",
        content: "La exención de consideración institucional debe renovarse anualmente. Esto requiere: (1) Un IPP activo del Centro Regional que demuestre que el niño recibe al menos un servicio calificado financiado por el Centro Regional (como cuidado de relevo o terapia de lenguaje) por año, y (2) Formularios anuales de redeterminación de Medi-Cal que demuestren que los activos personales del niño siguen siendo inferiores a $2,000.",
        citation: "Manual de Procedimientos de Elegibilidad de Medi-Cal de DHCS Sección 15I"
      }
    ])
  },
  {
    id: "ccs-mtu-guide",
    category: "Therapy & Medical",
    title: "California Children's Services (CCS) MTUs",
    subtitle: "Understanding physical and occupational therapy provided directly in public schools through CCS MTUs",
    title_es: "Unidades de Terapia Médica (MTU) de CCS",
    subtitle_es: "Comprensión de la terapia física y ocupacional proporcionada directamente en escuelas públicas a través de las MTU de CCS",
    read_time: "8 min read",
    read_time_es: "8 min de lectura",
    difficulty: "Intermediate",
    color: "#8b5cf6",
    steps_json: JSON.stringify([
      {
        title: "What is a CCS Medical Therapy Unit (MTU)?",
        content: "A Medical Therapy Unit (MTU) is a special clinic located in a designated public school where California Children's Services (CCS) provides physical therapy (PT) and occupational therapy (OT) to children with qualifying physical disabilities. Therapy is provided at no cost to families, regardless of household income.",
        citation: "California Health & Safety Code § 123875; California Code of Regulations Title 17 § 2900"
      },
      {
        title: "Qualifying Diagnoses for the MTP",
        content: "The Medical Therapy Program (MTP) is restricted to children under 21 with specific physical conditions: cerebral palsy, spina bifida, muscular dystrophy, rheumatoid arthritis, severe scoliosis, or other neuromuscular/musculoskeletal disorders. Developmental delays or autism without a physical/neurological condition do not qualify.",
        warning: "General developmental motor delays do not qualify a child for the CCS MTP. There must be an eligible neurological or musculoskeletal condition diagnosed by a physician."
      },
      {
        title: "The Relationship between CCS and the IEP",
        content: "If a student qualifies for CCS MTU therapy and the school district is providing special education, the therapy is written into the student's IEP under 'Related Services'. CCS is responsible for providing the therapy, but the school district must coordinate and provide transportation if the MTU is at a different school.",
        citation: "California Government Code § 7575"
      },
      {
        title: "How to Refer and Apply",
        content: "Anyone can refer a child (parents, teachers, doctors) by submitting a written referral to the local county CCS office. You must provide medical records and a physician's diagnosis of the qualifying physical condition.",
        tip: "If your child has an IEP, ask the school psychologist or special ed teacher to help initiate the CCS referral, as they have direct lines of communication with the county CCS coordinators."
      },
      {
        title: "The Medical Therapy Conference (MTC)",
        content: "Eligible children will have periodic Medical Therapy Conferences (MTC) at the MTU. At the MTC, a pediatric rehabilitation physician evaluates the child alongside the physical/occupational therapists, prescribes therapy frequency, and authorizes adaptive equipment like wheelchairs, braces, or walkers.",
        tip: "You are an active participant in the MTC. Prepare a list of questions about equipment needs, home exercises, and school accommodations before the conference."
      }
    ]),
    steps_json_es: JSON.stringify([
      {
        title: "¿Qué es una Unidad de Terapia Médica (MTU) de CCS?",
        content: "Una Unidad de Terapia Médica (MTU) es una clínica especial ubicada en una escuela pública designada donde los Servicios para Niños de California (CCS) brindan terapia física (PT) y terapia ocupacional (OT) a niños con discapacidades físicas calificadas. La terapia se brinda sin costo para las familias, independientemente de los ingresos del hogar.",
        citation: "Código de Salud y Seguridad de California § 123875; Código de Regulaciones de California Título 17 § 2900"
      },
      {
        title: "Diagnósticos que califican para el MTP",
        content: "El Programa de Terapia Médica (MTP) está restringido a niños menores de 21 años con condiciones físicas específicas: parálisis cerebral, espina bífida, distrofia muscular, artritis reumatoide, escoliosis grave u otros trastornos neuromusculares/musculoesqueléticos. Los retrasos en el desarrollo o el autismo sin una condición física/neurológica no califican.",
        warning: "Los retrasos motores generales del desarrollo no califican a un niño para el MTP de CCS. Debe haber una condición neurológica o musculoesquelética elegible diagnosticada por un médico."
      },
      {
        title: "La relación entre CCS y el IEP",
        content: "Si un estudiante califica para la terapia de la MTU de CCS y el distrito escolar brinda educación especial, la terapia se incluye en el IEP del estudiante bajo 'Servicios Relacionados'. CCS es responsable de brindar la terapia, pero el distrito escolar debe coordinar y proporcionar el transporte si la MTU se encuentra en una escuela diferente.",
        citation: "Código de Gobierno de California § 7575"
      },
      {
        title: "Cómo derivar y solicitar",
        content: "Cualquier persona puede derivar a un niño (padres, maestros, médicos) enviando una derivación por escrito a la oficina local de CCS del condado. Debe proporcionar registros médicos y el diagnóstico médico de la condición física calificada.",
        tip: "Si su hijo tiene un IEP, pídale al psicólogo escolar o al maestro de educación especial que le ayude a iniciar la derivación a CCS, ya que tienen líneas de comunicación directa con los coordinadores locales de CCS."
      },
      {
        title: "La Conferencia de Terapia Médica (MTC)",
        content: "Los niños elegibles tendrán Conferencias de Terapia Médica (MTC) periódicas en la MTU. En la MTC, un médico fisiatra evalúa al niño junto con los terapeutas físicos/ocupacionales, prescribe la frecuencia de la terapia y autoriza equipos adaptativos como sillas de ruedas, aparatos ortopédicos o andadores.",
        tip: "Usted es un participante activo en la MTC. Prepare una lista de preguntas sobre las necesidades de equipo, ejercicios en el hogar y adaptaciones escolares antes de la conferencia."
      }
    ])
  },
  {
    id: "conservatorship-sdm-guide",
    category: "Transition to Adulthood",
    title: "Conservatorship vs. Supported Decision-Making",
    subtitle: "Understanding legal rights and options for California Regional Center consumers turning 18",
    title_es: "Conservatela vs. Toma de Decisiones con Apoyo",
    subtitle_es: "Comprensión de los derechos y opciones legales para los consumidores del Centro Regional de California al cumplir 18 años",
    read_time: "8 min read",
    read_time_es: "8 min de lectura",
    difficulty: "Advanced",
    color: "#f59e0b",
    steps_json: JSON.stringify([
      {
        title: "Turning 18 and Legal Adulthood",
        content: "In California, all individuals become legal adults at age 18. Regardless of disability status, parents lose the automatic legal right to make decisions about their child's education, medical care, and finances unless a legal agreement or court order is established.",
        citation: "California Family Code § 6500; Probate Code § 1800.3"
      },
      {
        title: "What is a Limited Conservatorship?",
        content: "A Limited Conservatorship is a court-ordered arrangement specifically for adults with developmental disabilities. The court appoints a 'conservator' (usually a parent) and decides which of 7 specific legal powers are transferred (e.g. residence, access to records, marriage, contracting, medical consent, education, social relationships).",
        warning: "Limited Conservatorship strips the individual of specific civil rights. It requires petitioning the court, assessments by the Regional Center (CDER), an investigation by a court investigator, and representation by a court-appointed public defender (usually CAC)."
      },
      {
        title: "What is Supported Decision-Making (SDM)?",
        content: "Supported Decision-Making (SDM) is a formal, less-restrictive alternative to conservatorship. The adult with a disability (the self-advocate) signs a written agreement designating trusted 'supporters' (parents, siblings, friends) to help them understand options, gather information, and communicate decisions, while retaining all their legal rights.",
        citation: "California Welfare & Institutions Code § 21000 et seq."
      },
      {
        title: "Comparing Cost, Control, and Autonomy",
        content: "Conservatorships are legally binding, slow to change, and cost between $2,000 and $5,000 in court filing fees and attorney costs. Supported Decision-Making agreements are free, can be updated at any time without a court hearing, and foster self-determination by keeping the individual in control of their own life.",
        tip: "Many school districts and doctors push for conservatorship by default. Under California law, schools and medical providers must accept Supported Decision-Making agreements as valid authorization for parents to participate in IEPs and view records."
      },
      {
        title: "Timeline to Prepare for the Transition",
        content: "Start discussing transition options with your Regional Center service coordinator at age 16. If you choose Limited Conservatorship, begin the court petition process around age 17.5 so the hearing can occur shortly after their 18th birthday. If choosing SDM, draft and sign the agreement on or after their 18th birthday.",
        tip: "Ensure your child's IPP transition goals address self-determination, voting rights registration, and financial management tools like CalABLE."
      }
    ]),
    steps_json_es: JSON.stringify([
      {
        title: "Cumplir 18 años y la mayoría de edad",
        content: "En California, todas las personas se convierten en adultos legales a los 18 años. Independientemente de su discapacidad, los padres pierden el derecho legal automático de tomar decisiones sobre la educación, atención médica y finanzas de su hijo, a menos que se establezca un acuerdo legal o una orden judicial.",
        citation: "Código Familiar de California § 6500; Código de Sucesiones § 1800.3"
      },
      {
        title: "¿Qué es una conservatela limitada?",
        content: "Una Conservatela Limitada es un arreglo ordenado por la corte específicamente para adultos con discapacidades del desarrollo. El tribunal nombra a un 'curador' (generalmente un padre) y decide cuáles de 7 poderes legales específicos se transfieren (residencia, registros, matrimonio, contratos, decisiones médicas, educación, relaciones sociales).",
        warning: "La conservatela limitada despoja al individuo de derechos civiles específicos. Requiere una petición judicial, evaluaciones del Centro Regional (CDER), una investigación del tribunal y representación por parte de un defensor público asignado por el tribunal."
      },
      {
        title: "¿Qué es la Toma de Decisiones con Apoyo (SDM)?",
        content: "La Toma de Decisiones con Apoyo (SDM) es una alternativa formal y menos restrictiva a la conservatela. El adulto con discapacidad firma un acuerdo por escrito designando a 'apoyos' de confianza (padres, hermanos, amigos) para ayudarle a entender opciones, recopilar información y comunicar decisiones, conservando todos sus derechos legales.",
        citation: "Código de Bienestar e Instituciones de California § 21000 et seq."
      },
      {
        title: "Comparación de costo, control y autonomía",
        content: "Las conservatelas son legalmente vinculantes, difíciles de cambiar y cuestan entre $2,000 y $5,000 en tarifas de presentación y costos de abogados. Los acuerdos de Toma de Decisiones con Apoyo son gratuitos, se pueden actualizar en cualquier momento sin audiencia y fomentan la autodeterminación.",
        tip: "Muchos distritos escolares y médicos presionan por la conservatela por defecto. Bajo la ley de California, las escuelas y los proveedores médicos deben aceptar los acuerdos de Toma de Decisiones con Apoyo como autorización válida."
      },
      {
        title: "Cronograma para prepararse para la transición",
        content: "Comience a discutir las opciones de transición con su coordinador de servicios del Centro Regional a los 16 años. Si elige la Conservatela Limitada, comience la petición a los 17 años y medio. Si elige SDM, redacte y firme el acuerdo el día en que cumpla 18 años o después.",
        tip: "Asegúrese de que las metas del IPP de su hijo aborden la autodeterminación, el registro para votar y herramientas financieras como CalABLE."
      }
    ])
  },
  {
    id: "epsdt-services-guide",
    category: "Medi-Cal & Waivers",
    title: "Accessing Medi-Cal EPSDT Services",
    subtitle: "How to secure intensive therapies and private duty nursing for California children under 21",
    title_es: "Acceso a los Servicios EPSDT de Medi-Cal",
    subtitle_es: "Cómo asegurar terapias intensivas y enfermería de servicio privado para niños de California menores de 21 años",
    read_time: "7 min read",
    read_time_es: "7 min de lectura",
    difficulty: "Intermediate",
    color: "#3b82f6",
    steps_json: JSON.stringify([
      {
        title: "What is EPSDT?",
        content: "Early and Periodic Screening, Diagnostic, and Treatment (EPSDT) is a federal Medicaid mandate. It requires Medi-Cal to provide any medically necessary service to correct or ameliorate a physical or mental illness or condition in children under 21, even if that service is not otherwise covered under California's standard state plan.",
        citation: "42 U.S.C. § 1396d(r)(5); California Welfare & Institutions Code § 14132(v)"
      },
      {
        title: "The EPSDT 'Ameliorate' Standard",
        content: "Under federal law, EPSDT services do not require a child's condition to be curable. A service is considered medically necessary if it 'ameliorates' the condition — meaning it improves, maintains, or prevents the condition from worsening, or slows its rate of clinical deterioration.",
        warning: "Medi-Cal managed care plans often deny services using private insurance standards (like requiring 'significant functional improvement'). Push back by citing the federal EPSDT amelioration standard."
      },
      {
        title: "Accessing Intensive Behavioral Services (ABA)",
        content: "Under EPSDT, Medi-Cal covers Applied Behavior Analysis (ABA) and other behavioral therapies for children diagnosed with autism or other behavioral disorders. These services can be provided in the home, clinic, or community settings and are not subject to parental income limits if the child has waiver-based Medi-Cal.",
        citation: "DHCS Behavioral Health Treatment Services (BHT) Guidelines"
      },
      {
        title: "Securing Private Duty Nursing (PDN)",
        content: "Medically fragile children who require constant specialized nursing care (e.g. ventilators, tracheostomies, feeding tubes) can receive in-home private duty nursing under EPSDT. This is typically coordinated through the HCBA waiver or California Children's Services (CCS).",
        tip: "Due to nursing shortages, securing a nurse can be difficult. If your authorized nursing hours go unfilled, document the gaps. You can request a fair hearing to demand the state increase rates or locate an agency to fulfill the hours."
      },
      {
        title: "Filing an Appeal for Denied EPSDT Services",
        content: "If a Medi-Cal managed care plan or DHCS denies, reduces, or terminates a medically necessary EPSDT service, they must send a Notice of Action. You must first file an Internal Appeal with the plan within 60 days. If the plan denies, you have 120 days to file for a State Fair Hearing.",
        citation: "California Welfare & Institutions Code § 10950; 42 CFR § 438.402"
      }
    ]),
    steps_json_es: JSON.stringify([
      {
        title: "¿Qué es EPSDT?",
        content: "Detección Temprana y Periódica, Diagnóstico y Tratamiento (EPSDT) es un mandato federal de Medicaid. Requiere que Medi-Cal proporcione cualquier servicio médicamente necesario para corregir o aliviar una enfermedad o afección física o mental en niños menores de 21 años, incluso si no está cubierto en el plan estatal estándar.",
        citation: "42 U.S.C. § 1396d(r)(5); Código de Bienestar e Instituciones de California § 14132(v)"
      },
      {
        title: "El estándar de EPSDT para 'Aliviar' (Ameliorate)",
        content: "Bajo la ley federal, los servicios de EPSDT no requieren que la condición del niño sea curable. Un servicio es médicamente necesario si 'alivia' la condición; es decir, si mejora, mantiene o evita que la afección empeore, o retrasa su deterioro clínico.",
        warning: "Los planes de Medi-Cal a menudo niegan servicios usando estándares de seguros privados. Responda citando el estándar federal de alivio de EPSDT."
      },
      {
        title: "Acceso a servicios de comportamiento intensivo (ABA)",
        content: "Bajo EPSDT, Medi-Cal cubre el Análisis de Comportamiento Aplicado (ABA) y otras terapias conductuales para niños con autismo. Estos servicios se brindan en el hogar, clínica o comunidad y no están sujetos a límites de ingresos familiares si el niño tiene Medi-Cal por exención.",
        citation: "Directrices de Servicios de Tratamiento de Salud Conductual (BHT) de DHCS"
      },
      {
        title: "Asegurar enfermería de servicio privado (PDN)",
        content: "Los niños médicamente frágiles que requieren atención constante de enfermería especializada (ventiladores, traqueostomías, sondas) pueden recibir enfermería privada en el hogar bajo EPSDT. Se coordina a través de la exención HCBA o Servicios para Niños de California (CCS).",
        tip: "Debido a la escasez de enfermeras, puede ser difícil conseguir personal. Documente las horas vacías si no se cumplen. Puede solicitar una audiencia para exigir que el estado aumente las tarifas."
      },
      {
        title: "Presentar una apelación por servicios de EPSDT denegados",
        content: "Si un plan de Medi-Cal o DHCS deniega, reduce o termina un servicio de EPSDT, debe enviar un Aviso de Acción. Primero debe presentar una Apelación Interna con el plan dentro de los 60 días. Si el plan la niega, tiene 120 días para solicitar una Audiencia Imparcial del Estado.",
        citation: "Código de Bienestar e Instituciones de California § 10950; 42 CFR § 438.402"
      }
    ])
  },
  {
    id: "ihss-overtime-guide",
    category: "IHSS",
    title: "Navigating IHSS Overtime & Share of Cost",
    subtitle: "Rules for parent caregiver overtime and strategies to eliminate Medi-Cal Share of Cost in California",
    title_es: "Navegar las Horas Extras de IHSS y el Costo Compartido",
    subtitle_es: "Reglas para horas extras de padres cuidadores y estrategias para eliminar el Costo Compartido de Medi-Cal en California",
    read_time: "8 min read",
    read_time_es: "8 min de lectura",
    difficulty: "Advanced",
    color: "#10b981",
    steps_json: JSON.stringify([
      {
        title: "IHSS Overtime Workweek Limits",
        content: "In-Home Supportive Services (IHSS) limits the maximum hours a provider can work in a week. A single provider serving one client cannot work more than 66 hours per workweek. Providers serving multiple clients cannot exceed 66 hours total unless they qualify for a specific waiver, up to a maximum of 80 hours per week.",
        citation: "California Welfare & Institutions Code § 12300.4; CDSS ACL 16-01"
      },
      {
        title: "Overtime Violations and Progressive Discipline",
        content: "If you work more than your authorized monthly hours divided by 4, or exceed the weekly limits without prior county authorization, the state registers a 'workweek violation'. The penalty schedule is: (1) 1st violation: written warning, (2) 2nd violation: 2nd warning, (3) 3rd violation: 90-day suspension as provider, (4) 4th violation: 1-year termination as provider.",
        warning: "Violations accumulate across all clients served. Make sure to submit timesheets carefully and request a weekly hour adjustment in writing if temporary caregiver illness or emergencies force you to work overtime."
      },
      {
        title: "What is an IHSS Share of Cost (SOC)?",
        content: "A Share of Cost (SOC) acts as a monthly deductible. If your family income exceeds the Medi-Cal eligibility limit, Medi-Cal will assess a Share of Cost. Under California rules, the county will not pay your IHSS provider (even if it is you, the parent) until your family pays or incurs medical expenses equal to the monthly SOC amount.",
        tip: "A high Share of Cost can effectively wipe out the financial benefit of IHSS. If your SOC is $1,500, you must incur $1,500 in medical bills each month before IHSS covers any provider hours."
      },
      {
        title: "Eliminating Share of Cost via Medicaid Waivers",
        content: "For children under 18, the most effective way to eliminate Share of Cost is to enroll the child in a Medicaid Waiver program (like the HCBS DD Waiver through the Regional Center or the HCBA Waiver). Under these waivers, parent income is excluded from Medi-Cal eligibility calculations, reducing the child's SOC to $0.",
        citation: "DHCS ACWDL 17-21; 42 U.S.C. § 1396n(c)"
      },
      {
        title: "The 250% Working Disabled Program Alternative",
        content: "If your child does not qualify for a waiver, parents can check if they qualify for the 250% Working Disabled Program (WDP). This program allows working individuals with disabilities (which can include children/families under specific household structures) to pay a small monthly premium instead of a massive Share of Cost.",
        tip: "To qualify for the 250% WDP, there must be evidence of work. Even small, occasional earnings (like recycling, yard work, or babysitting documented with a 1099 or payment receipt) can satisfy the work requirement under DHCS regulations."
      }
    ]),
    steps_json_es: JSON.stringify([
      {
        title: "Límites semanales de horas extras de IHSS",
        content: "El programa de Servicios de Apoyo en el Hogar (IHSS) limita las horas semanales máximas que puede trabajar un proveedor. Un solo proveedor que atiende a un cliente no puede trabajar más de 66 horas semanales. Los proveedores con múltiples clientes no pueden superar las 66 horas semanales a menos que califiquen para una exención, hasta un máximo de 80 horas.",
        citation: "Código de Bienestar e Instituciones de California § 12300.4; CDSS ACL 16-01"
      },
      {
        title: "Violaciones de horas extras y medidas disciplinarias",
        content: "Si trabaja más de sus horas mensuales autorizadas divididas por 4, o excede los límites semanales sin autorización previa del condado, se registra una 'violación de la semana laboral'. Las sanciones son progresivas: advertencias escritas, seguidas de suspensión por 90 días y terminación por 1 año.",
        warning: "Las violaciones se acumulan entre todos los clientes atendidos. Envíe sus hojas de horas con cuidado y solicite un ajuste semanal de horas por escrito en caso de emergencias."
      },
      {
        title: "¿Qué es el Costo Compartido (Share of Cost - SOC) de IHSS?",
        content: "El Costo Compartido (SOC) funciona como un deducible mensual. Si los ingresos familiares superan el límite de Medi-Cal, se asigna un Costo Compartido. El condado no pagará a su proveedor de IHSS hasta que su familia pague o incurra en gastos médicos equivalentes al monto mensual del SOC.",
        tip: "Un Costo Compartido alto puede anular el beneficio financiero de IHSS. Si su SOC es de $1,500, debe incurrir en $1,500 en facturas médicas cada mes antes de que IHSS pague las horas del proveedor."
      },
      {
        title: "Eliminación del Costo Compartido a través de Exenciones",
        content: "Para niños menores de 18 años, la forma más efectiva de eliminar el Costo Compartido es inscribir al niño en una Exención de Medicaid (como la Exención HCBS DD a través del Centro Regional o la Exención HCBA). Bajo estas exenciones, los ingresos de los padres se excluyen de la elegibilidad, reduciendo el SOC del niño a $0.",
        citation: "DHCS ACWDL 17-21; 42 U.S.C. § 1396n(c)"
      },
      {
        title: "Alternativa del Programa de Trabajadores Discapacitados del 250%",
        content: "Si su hijo no califica para una exención, los padres pueden verificar si califican para el Programa para Trabajadores Discapacitados (WDP) del 250%. Este programa permite a las personas con discapacidades que trabajan pagar una pequeña prima mensual en lugar de un Costo Compartido masivo.",
        tip: "Para calificar para el WDP del 250%, debe haber evidencia de trabajo. Incluso ingresos pequeños y ocasionales (como reciclaje o jardinería documentados con un recibo) pueden satisfacer el requisito de trabajo."
      }
    ])
  },
  {
    id: "rc-fees-guide",
    category: "Regional Center",
    title: "Understanding Regional Center FCPP & Fees",
    subtitle: "Navigating California's Family Cost Participation Program and Annual Family Program Fees",
    title_es: "Comprender el FCPP y las Tarifas del Centro Regional",
    subtitle_es: "Navegación del Programa de Participación en el Costo Familiar y las Tarifas Anuales del Programa Familiar en California",
    read_time: "6 min read",
    read_time_es: "6 min de lectura",
    difficulty: "Intermediate",
    color: "#6366f1",
    steps_json: JSON.stringify([
      {
        title: "What is the Family Cost Participation Program (FCPP)?",
        content: "The Family Cost Participation Program (FCPP) is a California program that requires higher-income parents of Regional Center consumers aged 0 through 17 to pay a portion of the cost for three specific services: respite care, daycare, and camping. It does not apply to therapy services, speech, or behavior intervention.",
        citation: "California Welfare & Institutions Code § 4783; 17 CCR § 50250"
      },
      {
        title: "FCPP Calculation and Sliding Scale",
        content: "Your cost participation percentage (ranging from 10% to 100% of the service cost) is calculated based on: (1) The number of people in the household, (2) The gross family income compared to the Federal Poverty Level (FPL), and (3) The number of children receiving Regional Center services. FCPP only applies if family income is at or above 400% of the FPL.",
        warning: "The Regional Center will ask you to submit tax returns or W-2s to assess your income. If you refuse to provide financial documentation, the Regional Center is required by law to assess your participation rate at the maximum of 100%."
      },
      {
        title: "What is the Annual Family Program Fee (AFPF)?",
        content: "The Annual Family Program Fee (AFPF) is a flat yearly fee of $150 or $200 assessed to families with children (under age 18) receiving Regional Center services. The fee is assessed if the child lives at home, is not enrolled in Medi-Cal, and the family income is at or above 400% of the Federal Poverty Level.",
        citation: "California Welfare & Institutions Code § 4785"
      },
      {
        title: "Exemptions and Families Excluded from Fees",
        content: "FCPP and AFPF do NOT apply to families: (1) Whose child is enrolled in Medi-Cal (including the institutional deeming waiver), (2) Who receive Supplemental Security Income (SSI) for the child, or (3) Whose household income is below 400% of the Federal Poverty Level.",
        tip: "If your child is approved for Institutional Deeming Medi-Cal, submit their Medi-Cal card to your service coordinator immediately. This will automatically terminate any ongoing FCPP cost participation assessments and exempt you from the AFPF."
      },
      {
        title: "Appealing Fee Assessments and Hardship Requests",
        content: "If your family experiences financial hardship (such as high medical expenses, job loss, or emergency expenses), you can submit a written Hardship Request to your Regional Center's Executive Director to lower or waive your FCPP percentage or AFPF.",
        tip: "The Executive Director must review and respond to your hardship petition within 30 days. Keep services active during this evaluation period."
      }
    ]),
    steps_json_es: JSON.stringify([
      {
        title: "¿Qué es el Programa de Participación en el Costo Familiar (FCPP)?",
        content: "El Programa de Participación en el Costo Familiar (FCPP) es un programa de California que exige a los padres de altos ingresos de consumidores del Centro Regional (de 0 a 17 años) pagar una parte del costo de tres servicios específicos: cuidado de relevo (respite), guardería y campamentos.",
        citation: "Código de Bienestar e Instituciones de California § 4783; 17 CCR § 50250"
      },
      {
        title: "Cálculo del FCPP y escala móvil",
        content: "Su porcentaje de participación en el costo (que va del 10% al 100%) se calcula en función de: (1) El número de personas en el hogar, (2) Los ingresos familiares brutos en comparación con el Nivel Federal de Pobreza (FPL), y (3) El número de niños que reciben servicios. Solo se aplica si los ingresos familiares superan el 400% del FPL.",
        warning: "El Centro Regional le pedirá declaraciones de impuestos o W-2. Si se niega a proporcionarlas, la ley exige que el Centro Regional evalúe su tasa de participación en el máximo del 100%."
      },
      {
        title: "¿Qué es la Tarifa Anual del Programa Familiar (AFPF)?",
        content: "La Tarifa Anual del Programa Familiar (AFPF) es una tarifa fija anual de $150 o $200 para familias con niños menores de 18 años que reciben servicios del Centro Regional. Se cobra si el niño vive en el hogar, no tiene Medi-Cal y los ingresos familiares superan el 400% del FPL.",
        citation: "Código de Bienestar e Instituciones de California § 4785"
      },
      {
        title: "Exenciones y familias excluidas de tarifas",
        content: "El FCPP y la AFPF NO se aplican a las familias: (1) Cuyo hijo está inscrito en Medi-Cal (incluida la exención de consideración institucional), (2) Que reciben SSI para el niño, o (3) Cuyos ingresos son inferiores al 400% del FPL.",
        tip: "Si su hijo es aprobado para Medi-Cal por Consideración Institucional, presente su tarjeta de Medi-Cal a su coordinador inmediatamente. Esto cancelará las evaluaciones del FCPP y la AFPF."
      },
      {
        title: "Apelar tarifas y solicitudes de dificultad económica",
        content: "Si su familia experimenta dificultades financieras (altos gastos médicos, pérdida de empleo), puede enviar una Solicitud de Dificultad por escrito al Director Ejecutivo de su Centro Regional para reducir o eliminar el FCPP o la AFPF.",
        tip: "El Director Ejecutivo debe revisar y responder a su petición de dificultad dentro de los 30 días. Mantenga los servicios activos durante este período de evaluación."
      }
    ])
  },
  {
    id: "special-ed-appeals-guide",
    category: "IEP & School Rights",
    title: "Special Education Dispute Resolution",
    subtitle: "Comparing CDE compliance complaints, mediation, and OAH due process hearings in California",
    title_es: "Resolución de Disputas de Educación Especial",
    subtitle_es: "Comparación de quejas de cumplimiento del CDE, mediación y audiencias de debido proceso de la OAH en California",
    read_time: "9 min read",
    read_time_es: "9 min de lectura",
    difficulty: "Advanced",
    color: "#ef4444",
    steps_json: JSON.stringify([
      {
        title: "When to File a Compliance Complaint with the CDE",
        content: "A California Department of Education (CDE) Compliance Complaint is appropriate when the school district commits a procedural violation, such as failing to implement an agreed-upon IEP service, missing statutory timelines, or failing to provide records. The CDE investigates and issues a final report within 60 days.",
        citation: "California Education Code § 56500.2; 5 CCR § 4600 et seq."
      },
      {
        title: "The CDE Complaint Process and Resolution",
        content: "Filing a CDE complaint is free and does not require an attorney. You submit a written complaint detailing the procedural violation. If the CDE finds the district out of compliance, they will order corrective actions (e.g. compensatory education hours, staff training, and policy revisions).",
        tip: "Compliance complaints cannot resolve disagreements over IEP content or 'appropriate' placements. They only cover situations where the district failed to follow procedural rules or failed to do what is written in the signed IEP."
      },
      {
        title: "OAH 'Mediation Only' Option",
        content: "If you disagree about placement, services, or eligibility, you can request 'Mediation Only' through the Office of Administrative Hearings (OAH). This is a voluntary, confidential process where a neutral ALJ helps parents and the district reach a compromise agreement without a formal hearing.",
        citation: "California Education Code § 56500.3"
      },
      {
        title: "Filing for a Due Process Hearing",
        content: "A Due Process Hearing is a formal administrative trial before an OAH ALJ. It is used to resolve substantive disputes about the design or placement of the IEP (e.g. demanding a specialized non-public school placement). The statute of limitations is 2 years from the date the parent knew or should have known about the issue.",
        warning: "Due process hearings are highly legalistic. School districts will be represented by specialized attorneys. It is highly recommended that parents hire a special education attorney or advocate, as the burden of proof is on the party filing the request."
      },
      {
        title: "Stay Put Protection and Recovering Attorney's Fees",
        content: "Once a due process request is filed, the student has the right to 'Stay Put' — meaning their current placement and services cannot be changed without parent consent until the entire dispute is resolved. If the parent prevails at the hearing, they can petition a court to recover reasonable attorney's fees from the district.",
        citation: "California Education Code § 56505(d); 20 U.S.C. § 1415(i)(3)"
      }
    ]),
    steps_json_es: JSON.stringify([
      {
        title: "Cuándo presentar una Queja de Cumplimiento ante el CDE",
        content: "Una Queja de Cumplimiento ante el Departamento de Educación de California (CDE) es adecuada cuando el distrito comete una violación de procedimiento (por ejemplo, no brindar un servicio acordado en el IEP o no cumplir con los plazos). El CDE investiga y emite un informe dentro de los 60 días.",
        citation: "Código de Educación de California § 56500.2; 5 CCR § 4600 et seq."
      },
      {
        title: "El proceso de queja del CDE y su resolución",
        content: "Presentar una queja ante el CDE es gratuito y no requiere un abogado. Si el CDE determina que el distrito no cumple, ordenará acciones correctivas (como horas de educación compensatoria, capacitación del personal o revisiones de políticas).",
        tip: "Las quejas de cumplimiento no resuelven desacuerdos sobre el contenido del IEP o las colocaciones 'adecuadas'. Solo cubren situaciones donde el distrito no siguió las reglas de procedimiento o lo escrito en el IEP."
      },
      {
        title: "Opción de 'Mediación Solamente' de la OAH",
        content: "Si no está de acuerdo con la colocación, los servicios o la elegibilidad, puede solicitar 'Mediación Solamente' a través de la Oficina de Audiencias Administrativas (OAH). Es un proceso voluntario y confidencial donde un juez ayuda a llegar a un acuerdo.",
        citation: "Código de Educación de California § 56500.3"
      },
      {
        title: "Presentar una solicitud de Audiencia de Debido Proceso",
        content: "Una Audiencia de Debido Proceso es un juicio administrativo formal ante un juez de la OAH. Se usa para resolver disputas de fondo sobre el IEP (como exigir colocación en una escuela no pública especializada). El plazo para presentarla es de 2 años.",
        warning: "Las audiencias de debido proceso son muy legalistas. Los distritos escolares estarán representados por abogados. Se recomienda encarecidamente contratar a un abogado o defensor de educación especial."
      },
      {
        title: "Protección de 'Stay Put' y recuperación de honorarios de abogados",
        content: "Una vez presentada la solicitud de debido proceso, el estudiante tiene derecho a 'Stay Put' (Permanecer en el Lugar), lo que significa que sus servicios no pueden cambiarse sin el consentimiento de los padres hasta que se resuelva la disputa. Si los padres ganan, pueden exigir el reembolso de sus gastos de abogados.",
        citation: "Código de Educación de California § 56505(d); 20 U.S.C. § 1415(i)(3)"
      }
    ])
  }
];

seedArticles.push(...extraArticles);
seedArticlesTx(seedArticles);
console.log(`  ✓ Seeded ${seedArticles.length} Knowledge Articles.`);


// Conditions Seed
const DIAGNOSES = [
  'Attention Deficit Hyperactivity Disorder (ADHD)',
  'Autism Spectrum Disorder (ASD)',
  'Sensory Processing Disorder (SPD)',
  'Speech and Language Delay',
  'Global Developmental Delay (GDD)',
  'Developmental Coordination Disorder (Dyspraxia)',
  'Pervasive Developmental Disorder (PDD-NOS)',
  'Oppositional Defiant Disorder (ODD)',
  'Reactive Attachment Disorder (RAD)',
  'Apraxia of Speech',
  'Social Communication Disorder',
  'Down Syndrome (Trisomy 21)',
  'Fragile X Syndrome',
  'Rett Syndrome',
  'Prader-Willi Syndrome',
  'Angelman Syndrome',
  'Williams Syndrome',
  'Turner Syndrome',
  'Klinefelter Syndrome (XXY)',
  'Cri-du-Chat Syndrome',
  'DiGeorge Syndrome (22q11.2 deletion)',
  'Trisomy 18 (Edwards Syndrome)',
  'Trisomy 13 (Patau Syndrome)',
  'Noonan Syndrome',
  'Rabin-Kopp Syndrome',
  'Cerebral Palsy (CP)',
  'Spina Bifida',
  'Muscular Dystrophy (Duchenne)',
  'Muscular Dystrophy (Becker)',
  'Spinal Muscular Atrophy (SMA)',
  'Microcephaly',
  'Hydrocephalus',
  'Epilepsy / Seizure Disorder',
  'Tourette Syndrome',
  'Traumatic Brain Injury (TBI)',
  'Arthrogryposis Multiplex Congenita',
  'Neurofibromatosis Type 1 (NF1)',
  'Neurofibromatosis Type 2 (NF2)',
  'Mitochondrial Disease',
  'Rasmussen Encephalitis',
  'Lennox-Gastaut Syndrome',
  'Dravet Syndrome',
  'Landau-Kleffner Syndrome',
  'Aicardi Syndrome',
  'Hearing Loss / Deafness',
  'Visual Impairment / Blindness',
  'Cortical Visual Impairment (CVI)',
  'Deaf-Blindness',
  'Auditory Processing Disorder (APD)',
  'Optic Nerve Hypoplasia (ONH)',
  'Retinopathy of Prematurity (ROP)',
  'Usher Syndrome',
  'Intellectual Disability (ID)',
  'Dyslexia',
  'Dysgraphia',
  'Dyscalculia',
  'Executive Function Disorder',
  'Nonverbal Learning Disability (NVLD)',
  'Auditory Dyslexia',
  'Congenital Heart Disease (CHD)',
  'Cystic Fibrosis (CF)',
  'Sickle Cell Disease',
  'Type 1 Diabetes',
  'Severe Persistent Asthma',
  'Pediatric Cancer / Leukemia',
  'Tracheostomy Dependency',
  'Ventilator Dependency',
  'Short Bowel Syndrome',
  'Chronic Kidney Disease (CKD)',
  'Gastrostomy (G-tube) Dependency',
  'Severe Hemophilia',
  'Juvenile Idiopathic Arthritis (JIA)',
  'Orthopedic Impairment',
  'Other Health Impairment (OHI)',
  'Specific Learning Disability (SLD)',
  'Emotional Disturbance (ED)',
  'Multiple Disabilities',
  'Developmental Delay (CA Education Code)'
];

function slugifyDiagnosis(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getRelevanceFlags(name) {
  const norm = name.toLowerCase();
  const isRc = 
    norm.includes('autism') || norm.includes('asd') || norm.includes('down syndrome') || norm.includes('trisomy 21') ||
    norm.includes('cerebral palsy') || norm.includes('cp') || norm.includes('epilepsy') || norm.includes('seizure') ||
    norm.includes('intellectual disability') || norm.includes('developmental delay') || norm.includes('gdd') ||
    norm.includes('pdd-nos') || norm.includes('fragile x') || norm.includes('rett') || norm.includes('prader-willi') ||
    norm.includes('angelman') || norm.includes('williams syndrome') || norm.includes('cri-du-chat') ||
    norm.includes('digeorge') || norm.includes('trisomy 18') || norm.includes('trisomy 13') || norm.includes('noonan') ||
    norm.includes('rabin-kopp') || norm.includes('microcephaly') || norm.includes('hydrocephalus') ||
    norm.includes('neurofibromatosis') || norm.includes('mitochondrial') || norm.includes('encephalitis') ||
    norm.includes('lennox-gastaut') || norm.includes('dravet') || norm.includes('landau-kleffner') ||
    norm.includes('aicardi') || norm.includes('multiple disabilities');

  const isCcs = 
    norm.includes('cerebral palsy') || norm.includes('cp') || norm.includes('spina bifida') ||
    norm.includes('muscular dystrophy') || norm.includes('spinal muscular atrophy') || norm.includes('sma') ||
    norm.includes('microcephaly') || norm.includes('hydrocephalus') || norm.includes('epilepsy') || norm.includes('seizure') ||
    norm.includes('mitochondrial') || norm.includes('encephalitis') || norm.includes('lennox-gastaut') ||
    norm.includes('dravet') || norm.includes('landau-kleffner') || norm.includes('aicardi') ||
    norm.includes('arthrogryposis') || norm.includes('neurofibromatosis') || norm.includes('hearing loss') ||
    norm.includes('deaf') || norm.includes('visual impairment') || norm.includes('blind') || norm.includes('cvi') ||
    norm.includes('optic nerve') || norm.includes('retinopathy') || norm.includes('usher') || norm.includes('heart disease') ||
    norm.includes('chd') || norm.includes('cystic fibrosis') || norm.includes('cf') || norm.includes('sickle cell') ||
    norm.includes('diabetes') || norm.includes('asthma') || norm.includes('cancer') || norm.includes('leukemia') ||
    norm.includes('tracheostomy') || norm.includes('ventilator') || norm.includes('short bowel') ||
    norm.includes('kidney') || norm.includes('ckd') || norm.includes('gastrostomy') || norm.includes('g-tube') ||
    norm.includes('hemophilia') || norm.includes('arthritis') || norm.includes('jia') || norm.includes('orthopedic') ||
    norm.includes('multiple disabilities') || norm.includes('down syndrome') || norm.includes('fragile x') ||
    norm.includes('rett') || norm.includes('prader-willi') || norm.includes('angelman') || norm.includes('williams') ||
    norm.includes('cri-du-chat') || norm.includes('digeorge') || norm.includes('trisomy 18') ||
    norm.includes('trisomy 13') || norm.includes('noonan') || norm.includes('rabin-kopp');

  return { rc: isRc, ccs: isCcs };
}

function getNotesAndExplanation(name) {
  const norm = name.toLowerCase();
  let explanation = `A diagnosed medical or developmental condition: ${name}.`;
  let notes = 'Age 0-3 focus on Early Start/IFSP developmental therapies. At 3, transition to school district IEP. Setup CalABLE for financial protection. Transfer educational rights and file for adult SSI at 18.';

  if (norm.includes('autism') || norm.includes('asd')) {
    explanation = 'A developmental spectrum condition that affects communication, social interaction, sensory processing, and self-regulatory behaviors.';
    notes = 'Early Detection allows intensive Early Start ABA. School years benefit from IEP behavior plans. Review self-advocacy and employment transition plans from age 16.';
  } else if (norm.includes('down syndrome')) {
    explanation = 'A genetic chromosomal condition typically leading to mild-to-moderate intellectual disability, hypotonia, and potential cardiac or sensory differences.';
    notes = 'Infancy focuses on early motor and speech start. IEP speech accommodations are critical. Auto-eligible medically for SSI. Secure CalABLE and adult transition benefits.';
  } else if (norm.includes('cerebral palsy')) {
    explanation = 'A neurological motor disorder affecting body movement, posture, and coordination, often requiring physical therapies.';
    notes = 'Coordinate early with CCS Medical Therapy Unit (MTP) for school physical therapy. Select adaptive devices. Address orthopedic needs under IEP.';
  } else if (norm.includes('epilepsy') || norm.includes('seizure')) {
    explanation = 'A neurological condition characterized by recurrent, unprovoked seizures due to temporary electrical disturbances in the brain.';
    notes = 'Maintain an active Seizure Action Plan at school. Coordinate neurological consults. CCS covers seizure management and medications.';
  } else if (norm.includes('hearing') || norm.includes('deaf')) {
    explanation = 'Partial or complete loss of hearing in one or both ears, affecting language acquisition and communication.';
    notes = 'Audiology screening triggers early ASL or oral start. Public school IEP provides FM systems, DHH specialists, and speech therapy.';
  } else if (norm.includes('visual') || norm.includes('blind')) {
    explanation = 'Significant vision loss that cannot be fully corrected, impacting navigation, reading, and environmental interaction.';
    notes = 'Request Orientation & Mobility (O&M) school scans. Provide TVI (Teacher of Visual Impairments) Braille or large-print aids in IEP.';
  } else if (norm.includes('adhd')) {
    explanation = 'A neurobehavioral condition causing challenges with selective attention, hyperactivity, organization, and executive function.';
    notes = 'Provide visual schedules, sensory breaks, and executive function goals in IEP or 504. Monitor medication efficacy.';
  } else if (norm.includes('speech and language delay') || norm.includes('apraxia')) {
    explanation = 'Delays or impairments in speech production, language comprehension, or motor speech coordination.';
    notes = 'Prioritize early intervention speech therapy. IEP coordinates speech-language therapy and AAC device communication supports.';
  } else if (norm.includes('intellectual disability') || norm.includes('gdd')) {
    explanation = 'A cognitive or developmental condition characterized by limitations in both intellectual functioning and adaptive behavior.';
    notes = 'Lanterman Act eligibility triggers respite and service coordination. IEP focuses on life-skills, adaptive goals, and transitions.';
  } else if (norm.includes('diabetes')) {
    explanation = 'A chronic endocrine condition where the pancreas produces little or no insulin, requiring continuous monitoring and care.';
    notes = 'Establish a Section 504 Plan for blood glucose checking, nurse access, and emergency glucagon storage at school.';
  } else if (norm.includes('asthma')) {
    explanation = 'A chronic respiratory condition causing airway inflammation and bronchospasm, triggered by allergies, cold, or exertion.';
    notes = 'Provide school with an Asthma Action Plan and inhaler access. Set up PE accommodations if exercise-induced.';
  } else if (norm.includes('cancer') || norm.includes('leukemia')) {
    explanation = 'A serious medical oncology condition requiring chemotherapy, radiation, or surgery.';
    notes = 'Set up Home & Hospital Instruction under IEP/504 for periods of medical absence. CCS coordinates oncology treatment.';
  } else if (norm.includes('tracheostomy') || norm.includes('ventilator') || norm.includes('g-tube')) {
    explanation = 'A complex medical fragility profile requiring enteral feeding, mechanical ventilation, or airway maintenance devices.';
    notes = 'Qualifies for HCBA home nursing hours. IEP requires medical services / school nurse allocations. CCS covers device maintenance.';
  }

  return { explanation, notes };
}

const seedConditions = DIAGNOSES.map((name) => {
  const id = slugifyDiagnosis(name);
  const { rc, ccs } = getRelevanceFlags(name);
  const { explanation, notes } = getNotesAndExplanation(name);

  let aliasesList = '';
  if (name.includes('(')) {
    const match = name.match(/\(([^)]+)\)/);
    if (match) aliasesList = match[1];
  }
  if (name.includes('/')) {
    aliasesList += (aliasesList ? ', ' : '') + name.split('/').map(s => s.trim()).join(', ');
  }

  return {
    id,
    name,
    aliases: aliasesList || name,
    parent_friendly_explanation: explanation,
    regional_center_relevance: rc ? 1 : 0,
    iep_relevance: 1,
    ccs_relevance: ccs ? 1 : 0,
    ssi_relevance: 1,
    cal_able_relevance: 1,
    age_specific_notes: notes,
    source_url: 'https://california-navigator.org/taxonomy/' + id,
    last_verified_date: '2026-06-01'
  };
});


const insertCondition = db.prepare(`
  INSERT OR REPLACE INTO conditions 
  (id, name, aliases, parent_friendly_explanation, regional_center_relevance, iep_relevance, ccs_relevance, ssi_relevance, cal_able_relevance, age_specific_notes, source_url, last_verified_date) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const seedConditionsTx = db.transaction((conds) => {
  for (const c of conds) {
    insertCondition.run(c.id, c.name, c.aliases, c.parent_friendly_explanation, c.regional_center_relevance, c.iep_relevance, c.ccs_relevance, c.ssi_relevance, c.cal_able_relevance, c.age_specific_notes, c.source_url, c.last_verified_date);
    
    // Dynamically seed rules in program_eligibility_rules as well!
    if (c.regional_center_relevance === 1) {
      insertRule.run(
        `rule-rc-${c.id}`,
        'regional-centers',
        3.0,
        120.0,
        c.id,
        null,
        'any',
        'any',
        `${c.name} is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers.`
      );
    }
    if (c.ccs_relevance === 1) {
      insertRule.run(
        `rule-ccs-${c.id}`,
        'california-childrens-services',
        0.0,
        21.0,
        c.id,
        null,
        'any',
        'any',
        `${c.name} is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies.`
      );
    }
    if (c.ssi_relevance === 1) {
      const reason = c.id === 'down-syndrome-trisomy-21'
        ? 'Down Syndrome automatically satisfies the childhood disability medical listing (Listing 110.06) for cash benefits.'
        : `Assessments for ${c.name} check for marked and severe functional limitations under childhood SSI guidelines.`;
      insertRule.run(
        `rule-ssi-${c.id}`,
        'ssi-for-children',
        0.0,
        18.0,
        c.id,
        null,
        'any',
        'any',
        reason
      );
    }
    if (c.cal_able_relevance === 1) {
      insertRule.run(
        `rule-able-${c.id}`,
        'calable',
        0.0,
        120.0,
        c.id,
        null,
        'any',
        'any',
        `Disability onset of ${c.name} before age 26 qualifies for a tax-advantaged CalABLE savings account.`
      );
    }
    if (c.regional_center_relevance === 1 || c.ccs_relevance === 1) {
      insertRule.run(
        `rule-es-${c.id}`,
        'early-start',
        0.0,
        3.0,
        c.id,
        null,
        'any',
        'any',
        `Child is under age 3 and has an established high-risk condition (${c.name}); Early Start intervention is highly recommended.`
      );
    }
  }
});
seedConditionsTx(seedConditions);
console.log(`  ✓ Seeded ${seedConditions.length} Conditions & dynamically generated eligibility rules in Taxonomy.`);

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
console.log(`  ✓ Seeded ${seedNeeds.length} Functional Needs.`);

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
console.log(`  ✓ Seeded ${seedGaps.length} Coverage Gaps.`);

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
  { id: 'prov-1', name: 'Dynamic Pediatric Speech LA', categories: 'speech-therapy', county_id: 'los-angeles', phone: '(213) 492-0198', email: 'intake@dynamicspeechla.com', address: '1200 Wilshire Blvd, LA 90017', accepts_medi_cal: 1, regional_center_vendor_ids: 'LRC-77291' },
  { id: 'prov-2', name: 'OC Respite Agency Santa Ana', categories: 'respite', county_id: 'orange', phone: '(714) 710-0321', email: 'scheduling@ocrespite.org', address: '800 N Tustin Ave, SA 92705', accepts_medi_cal: 1, regional_center_vendor_ids: 'RCOC-88912' }
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

// Sync the generated database to the frontend directory
try {
  const frontendDbPath = path.resolve(__dirname, '../../frontend/ca_disability_navigator.db');
  fs.copyFileSync(dbPath, frontendDbPath);
  console.log(`  ✓ Synced database to frontend directory: ${frontendDbPath}`);
} catch (err) {
  console.error('  ❌ Error copying database to frontend directory:', err.message);
}

console.log('🎉 SQLite Relational Database build and seed execution completed successfully!\n');
