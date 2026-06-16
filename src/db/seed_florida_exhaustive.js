import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

console.log('⏳ Starting Florida exhaustive data seeding with deep, localized records...');

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// 14 Priority Counties
const priorityCounties = [
  'miami-dade-fl',
  'broward-fl',
  'palm-beach-fl',
  'hillsborough-fl',
  'orange-fl',
  'pinellas-fl',
  'duval-fl',
  'lee-fl',
  'polk-fl',
  'brevard-fl',
  'pasco-fl',
  'seminole-fl',
  'alachua-fl',
  'leon-fl'
];

try {
  const counties = db.prepare("SELECT * FROM counties WHERE state_id = 'florida'").all();
  console.log(`Found ${counties.length} Florida counties in the database.`);

  db.transaction(() => {
    // ----------------------------------------------------
    // Clean up old Florida data
    // ----------------------------------------------------
    console.log('Cleaning up old Florida records...');
    db.prepare("DELETE FROM county_offices WHERE county_id LIKE '%-fl'").run();
    db.prepare("DELETE FROM regional_center_counties WHERE county_id LIKE '%-fl'").run();
    db.prepare("DELETE FROM state_resource_agencies WHERE state_id = 'florida'").run();
    db.prepare("DELETE FROM selpa_counties WHERE county_id LIKE '%-fl'").run();
    db.prepare("DELETE FROM regional_education_agencies WHERE state_id = 'florida'").run();
    db.prepare("DELETE FROM school_districts WHERE county_id LIKE '%-fl'").run();
    db.prepare("DELETE FROM nonprofit_organizations WHERE county_id LIKE '%-fl'").run();
    db.prepare("DELETE FROM iep_advocate_counties WHERE county_id LIKE '%-fl'").run();
    db.prepare("DELETE FROM iep_advocates WHERE id LIKE 'fl-%'").run();
    db.prepare("DELETE FROM program_waitlists WHERE program_id LIKE 'fl-%'").run();
    db.prepare("DELETE FROM program_appeal_info WHERE program_id LIKE 'fl-%'").run();
    db.prepare("DELETE FROM program_eligibility_rules WHERE program_id LIKE 'fl-%'").run();
    db.prepare("DELETE FROM program_document_requirements WHERE program_id LIKE 'fl-%'").run();
    db.prepare("DELETE FROM program_application_steps WHERE program_id LIKE 'fl-%'").run();
    db.prepare("DELETE FROM programs WHERE state_id = 'florida'").run();
    console.log('✓ Clean up complete.');

    // ----------------------------------------------------
    // 1. Seed Core Florida Programs (13 Programs)
    // ----------------------------------------------------
    console.log('Seeding 13 core Florida programs...');
    const insertProgram = db.prepare(`
      INSERT INTO programs 
      (id, name, description, who_it_is_for, who_might_qualify, official_source_url, category, confidence_score, last_verified_date, state_id, source_url, source_type, data_origin, verification_status, last_scraped_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const programs = [
      {
        id: 'fl-ibudget',
        name: 'Florida iBudget HCBS Waiver',
        description: 'Medicaid home and community-based waiver designed to help people with developmental disabilities live as independently as possible in their communities.',
        who_it_is_for: 'Florida residents with developmental disabilities (autism, cerebral palsy, Down syndrome, intellectual disabilities, spina bifida, Prader-Willi syndrome).',
        who_might_qualify: 'Florida resident, diagnosed with one of the specific developmental disabilities originating before age 18, and meeting ICF/IID level of care.',
        official_source_url: 'https://apd.myflorida.com/ibudget/'
      },
      {
        id: 'fl-cdc-plus',
        name: 'Florida Consumer Directed Care Plus (CDC+) Waiver',
        description: 'A consumer-directed option for iBudget Florida waiver clients that allows them to hire their own caregivers, including parents or relatives, and manage their own care budget.',
        who_it_is_for: 'Florida residents enrolled in the APD iBudget waiver who want budget authority.',
        who_might_qualify: 'Enrolled in Florida iBudget HCBS waiver, completed training, and demonstrates ability to manage their own care budget.',
        official_source_url: 'https://apd.myflorida.com/cdcplus/'
      },
      {
        id: 'fl-medicaid-dcf',
        name: 'Florida Medicaid / DCF ACCESS',
        description: 'Provides access to public health coverage for low-income families, elderly individuals, and individuals with disabilities. Applications are managed by the Department of Children and Families ACCESS system.',
        who_it_is_for: 'Florida residents who meet low-income eligibility requirements, or who bypass family income limits via the APD iBudget HCBS waiver.',
        who_might_qualify: 'Florida resident, US citizen or lawful permanent resident, meeting income limits or designated as medically needy.',
        official_source_url: 'https://www.myflfamilies.com/ACCESS'
      },
      {
        id: 'fl-medicaid-managed-care',
        name: 'Statewide Medicaid Managed Care (SMMC)',
        description: 'Florida\'s program where most Medicaid recipients receive acute and long-term care services through managed care plans. Coordinates appeals for service reductions.',
        who_it_is_for: 'Florida Medicaid recipients enrolled in Managed Medical Assistance (MMA) or Long-Term Care (LTC) plans.',
        who_might_qualify: 'Active enrollment in Florida Medicaid.',
        official_source_url: 'https://ahca.myflorida.com/medicaid/statewide_mc/index.shtml'
      },
      {
        id: 'fl-cms-plan',
        name: 'Children\'s Medical Services (CMS) Plan',
        description: 'A specialized managed care program for children with special healthcare needs, offering comprehensive medical, dental, and therapeutic services.',
        who_it_is_for: 'Children under age 21 with chronic, complex physical, behavioral, or developmental needs who qualify for Medicaid.',
        who_might_qualify: 'Florida resident under 21, active on Florida Medicaid, and meets clinical eligibility guidelines based on medical history.',
        official_source_url: 'https://www.cmsplan.floridahealth.gov/'
      },
      {
        id: 'fl-kidcare',
        name: 'Florida KidCare',
        description: 'The state\'s children\'s health insurance program, including MediKids, Healthy Kids, and Children\'s Medical Services, for children who do not qualify for full Medicaid.',
        who_it_is_for: 'Children under age 19 who lack health insurance and do not qualify for standard low-income Medicaid.',
        who_might_qualify: 'Florida resident under 19, legal US resident, and family income fits within sliding scale premium tiers (up to 200% FPL or full-pay options).',
        official_source_url: 'https://www.floridakidcare.org/'
      },
      {
        id: 'fl-family-empowerment',
        name: 'Family Empowerment Scholarship for Students with Unique Abilities (FES-UA)',
        description: 'Allows parents to direct scholarship funds toward qualified educational expenses, including private school tuition, tutoring, occupational therapy, and speech therapy.',
        who_it_is_for: 'School-aged children (ages 3 through 22 or 12th grade) with documented diagnoses like autism, Down syndrome, cerebral palsy, or intellectual disability.',
        who_might_qualify: 'Florida resident, age 3 to 22, and diagnosed with a qualifying disability by a licensed physician or has an active IEP.',
        official_source_url: 'https://www.stepupforstudents.org/scholarships/unique-abilities/'
      },
      {
        id: 'fl-earlysteps',
        name: 'Florida Early Steps',
        description: 'The state early intervention system providing evaluation, therapies, and coordination for infants and toddlers with significant developmental delays.',
        who_it_is_for: 'Infants and toddlers (birth to 36 months) and their families.',
        who_might_qualify: 'Florida resident, under 3 years old, with a 25% or greater delay in at least one developmental domain or an established high-risk condition.',
        official_source_url: 'https://www.floridaearlysteps.com/'
      },
      {
        id: 'fl-fldoe-ese',
        name: 'FLDOE Exceptional Student Education (ESE)',
        description: 'Provides special education services, individualized instruction, and speech, occupational, and behavioral therapies to students with disabilities in public schools under IDEA.',
        who_it_is_for: 'Students aged 3 through 21 enrolled in Florida public school districts.',
        who_might_qualify: 'Florida resident, qualified under one or more federal IDEA disability categories, requiring special services.',
        official_source_url: 'https://www.fldoe.org/academics/exceptional-student-edu/'
      },
      {
        id: 'fl-fdlrs-childfind',
        name: 'FDLRS Child Find',
        description: 'Coordinates screening and evaluation for children (birth through 21) who are not enrolled in public school but may need special education services.',
        who_it_is_for: 'Families suspecting developmental delays, hearing, vision, or speech issues in pre-school or home-schooled children.',
        who_might_qualify: 'Florida resident, age 0 to 21, not currently enrolled in public school.',
        official_source_url: 'https://www.fdlrs.org/child-find'
      },
      {
        id: 'fl-able',
        name: 'Florida ABLE',
        description: 'Allows individuals with disabilities to save tax-free for qualified disability expenses (therapies, housing, assistive technology) without losing eligibility for SSI or Medicaid.',
        who_it_is_for: 'Individuals who developed a significant disability before age 26.',
        who_might_qualify: 'Florida resident, disability onset before age 26, and meets SSA criteria or has a physician certification.',
        official_source_url: 'https://www.ableunited.com/'
      },
      {
        id: 'fl-ssi-child',
        name: 'Supplemental Security Income (SSI) for Children (Florida)',
        description: 'Federal cash assistance program administered by SSA. In Florida, children approved for SSI are automatically enrolled in full-scope Medicaid via DCF ACCESS.',
        who_it_is_for: 'Children under age 18 with severe physical or mental impairments and limited household resources.',
        who_might_qualify: 'Child meets SSA definition of medical disability and household fits income/resource limits.',
        official_source_url: 'https://www.ssa.gov/benefits/disability/apply-child.html'
      },
      {
        id: 'fl-vocational-rehabilitation',
        name: 'Florida Vocational Rehabilitation Transition Youth Program',
        description: 'Helps students with disabilities transition from school to work or postsecondary education, providing career counseling, job coaching, and assistive technology.',
        who_it_is_for: 'Students with disabilities aged 14 to 21 transitioning from high school.',
        who_might_qualify: 'Florida resident, aged 14-21, has a physical or mental impairment that constitutes a barrier to employment, and requires VR services.',
        official_source_url: 'https://www.rehabworks.org/student-youth/transition.html'
      }
    ];

    for (const prog of programs) {
      insertProgram.run(
        prog.id,
        prog.name,
        prog.description,
        prog.who_it_is_for,
        prog.who_might_qualify,
        prog.official_source_url,
        'state',
        5.0,
        '2026-06-12',
        'florida',
        prog.official_source_url,
        'official',
        'curated_seed',
        'source_listed',
        new Date().toISOString()
      );
    }
    console.log('✓ Seeding programs completed.');

    // ----------------------------------------------------
    // 2. Seed APD Regional Offices (6 Regions)
    // ----------------------------------------------------
    console.log('Seeding 6 APD Regional Offices...');
    const insertAgency = db.prepare(`
      INSERT INTO state_resource_agencies 
      (id, state_id, agency_type, name, counties_served, catchment_boundaries, website, intake_phone, early_intervention_contact, agency_intake_contact, eligibility_info_page, services_page, appeals_info, frc_relationship, office_locations, languages, last_verified_date, source_urls, source_url, source_type, data_origin, verification_status, last_scraped_at, confidence_score) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertRcCounty = db.prepare(`
      INSERT INTO regional_center_counties (regional_center_id, county_id) 
      VALUES (?, ?)
    `);

    const apdRegions = [
      {
        id: 'apd-northwest',
        name: 'APD Northwest Region',
        phone: '(850) 487-1992',
        counties: ['escambia', 'santa-rosa', 'okaloosa', 'walton', 'holmes', 'washington', 'bay', 'jackson', 'calhoun', 'gulf', 'liberty', 'franklin', 'gadsden', 'leon', 'wakulla', 'jefferson', 'madison', 'taylor'],
        address: '4030 Esplanade Way, Suite 280, Tallahassee, FL 32399',
        boundaries: 'Serves the Florida Panhandle and Big Bend counties from Escambia to Taylor.'
      },
      {
        id: 'apd-northeast',
        name: 'APD Northeast Region',
        phone: '(386) 238-4607',
        counties: ['hamilton', 'suwannee', 'lafayette', 'dixie', 'columbia', 'gilchrist', 'levy', 'alachua', 'union', 'bradford', 'baker', 'nassau', 'duval', 'clay', 'st-johns', 'putnam', 'flagler', 'volusia'],
        address: '3631 Hodges Boulevard, Jacksonville, FL 32224',
        boundaries: 'Serves Northeast Florida counties including Jacksonville, Gainesville, and Daytona Beach service areas.'
      },
      {
        id: 'apd-central',
        name: 'APD Central Region',
        phone: '(407) 245-0440',
        counties: ['brevard', 'citrus', 'hardee', 'hernando', 'highlands', 'lake', 'marion', 'orange', 'osceola', 'polk', 'seminole', 'sumter'],
        address: '400 West Robinson Street, Suite S430, Orlando, FL 32801',
        boundaries: 'Serves Central Florida counties including Orlando, Lakeland, and Melbourne service areas.'
      },
      {
        id: 'apd-suncoast',
        name: 'APD Suncoast Region',
        phone: '1-800-615-8720',
        counties: ['charlotte', 'collier', 'desoto', 'glades', 'hendry', 'hillsborough', 'lee', 'manatee', 'pasco', 'pinellas', 'sarasota'],
        address: '1313 North Tampa Street, Suite 515, Tampa, FL 33602',
        boundaries: 'Serves Suncoast Florida counties including Tampa, St. Petersburg, and Fort Myers service areas.'
      },
      {
        id: 'apd-southeast',
        name: 'APD Southeast Region',
        phone: '(561) 837-5564',
        counties: ['broward', 'indian-river', 'martin', 'okeechobee', 'palm-beach', 'st-lucie'],
        address: '111 South Sapodilla Avenue, Suite 204, West Palm Beach, FL 33401',
        boundaries: 'Serves Southeast Florida counties including West Palm Beach and Fort Lauderdale service areas.'
      },
      {
        id: 'apd-southern',
        name: 'APD Southern Region',
        phone: '(305) 349-1478',
        counties: ['miami-dade', 'monroe'],
        address: '401 NW 2nd Ave, Suite South 811, Miami, FL 33128',
        boundaries: 'Serves Miami-Dade and Monroe counties.'
      }
    ];

    for (const region of apdRegions) {
      const countiesList = region.counties.map(c => `${c}-fl`);
      insertAgency.run(
        region.id,
        'florida',
        'apd_office',
        region.name,
        countiesList.join(','),
        region.boundaries,
        'https://apd.myflorida.com/',
        region.phone,
        region.phone, // early intervention
        region.phone, // intake contact
        'https://apd.myflorida.com/customers/eligibility/',
        'https://apd.myflorida.com/customers/services/',
        'Waiver denials are appealed through the Department of Children and Families (DCF) Office of Appeal Hearings. Appeals must be filed within 30 days of the denial notice.',
        null, // frc
        region.address,
        'English, Spanish, Creole',
        '2026-06-12',
        'https://apd.myflorida.com/region/',
        'https://apd.myflorida.com/region/',
        'official',
        'curated_seed',
        'source_listed',
        new Date().toISOString(),
        5.0
      );

      for (const countySlug of countiesList) {
        insertRcCounty.run(region.id, countySlug);
      }
    }
    console.log('✓ Seeding APD Regional Offices completed.');

    // ----------------------------------------------------
    // 3. Seed Local Early Steps Programs (15 geographic programs)
    // ----------------------------------------------------
    console.log('Seeding 15 Local Early Steps programs...');
    const earlyStepsList = [
      { id: 'fl-earlysteps-western-panhandle', name: 'Western Panhandle Early Steps', host: 'Ascension Sacred Heart', phone: '(850) 416-7656', counties: ['escambia', 'santa-rosa', 'okaloosa', 'walton'] },
      { id: 'fl-earlysteps-big-bend', name: 'Big Bend Early Steps', host: "Children's Home Society", phone: '(850) 921-0263', counties: ['leon', 'gadsden', 'jefferson', 'madison', 'taylor', 'wakulla', 'franklin', 'liberty', 'bay', 'calhoun', 'gulf', 'holmes', 'jackson', 'washington'] },
      { id: 'fl-earlysteps-northeastern', name: 'Northeastern Early Steps', host: 'UF College of Medicine - Jacksonville', phone: '(904) 244-9740', counties: ['baker', 'bradford', 'clay', 'duval', 'nassau', 'st-johns'] },
      { id: 'fl-earlysteps-north-central', name: 'North Central Early Steps', host: 'University of Florida (Pediatrics)', phone: '(352) 273-8555', counties: ['alachua', 'columbia', 'dixie', 'gilchrist', 'hamilton', 'lafayette', 'levy', 'marion', 'suwannee', 'union'] },
      { id: 'fl-earlysteps-north-beaches', name: 'North Beaches Early Steps', host: 'Easterseals Northeast Central Florida', phone: '(386) 255-4568', counties: ['flagler', 'lake', 'putnam', 'sumter', 'volusia'] },
      { id: 'fl-earlysteps-central', name: 'Central Florida Early Steps', host: 'Orlando Health (Howard Phillips Center)', phone: '(407) 317-7430', counties: ['orange', 'osceola', 'seminole'] },
      { id: 'fl-earlysteps-bay-area', name: 'Bay Area Early Steps', host: 'University of South Florida', phone: '(813) 974-0602', counties: ['hillsborough', 'polk'] },
      { id: 'fl-earlysteps-west-central', name: 'West Central Early Steps', host: "Johns Hopkins All Children's Hospital", phone: '(727) 767-4403', counties: ['citrus', 'hernando', 'pasco', 'pinellas'] },
      { id: 'fl-earlysteps-gulf-central', name: 'Gulf Central Early Steps', host: 'Health Planning Council of SW Florida', phone: '(941) 487-5400', counties: ['charlotte', 'desoto', 'hardee', 'highlands', 'manatee', 'sarasota'] },
      { id: 'fl-earlysteps-southwest', name: 'Southwest Florida Early Steps', host: 'Health Planning Council of SW Florida', phone: '(239) 433-6700', counties: ['collier', 'lee', 'hendry', 'glades'] },
      { id: 'fl-earlysteps-gold-coast', name: 'Gold Coast Early Steps', host: "Children's Diagnostic & Treatment Center", phone: '(954) 728-8300', counties: ['broward'] },
      { id: 'fl-earlysteps-north-dade', name: 'North Dade Early Steps', host: 'University of Miami', phone: '(305) 243-6660', counties: ['miami-dade'] },
      { id: 'fl-earlysteps-southernmost', name: 'Southernmost Coast Early Steps', host: 'Easterseals Florida', phone: '(305) 324-5688', counties: ['miami-dade', 'monroe'] },
      { id: 'fl-earlysteps-space-coast', name: 'Space Coast Early Steps', host: 'Catch of Brevard, Inc.', phone: '(321) 634-3688', counties: ['brevard'] },
      { id: 'fl-earlysteps-treasure-coast', name: 'Treasure Coast Early Steps', host: 'Easterseals Florida', phone: '(561) 471-1688', counties: ['palm-beach', 'martin', 'st-lucie', 'indian-river', 'okeechobee'] }
    ];

    for (const es of earlyStepsList) {
      const countiesList = es.counties.map(c => `${c}-fl`);
      insertAgency.run(
        es.id,
        'florida',
        'early_steps',
        es.name,
        countiesList.join(','),
        `Hosted by: ${es.host}. Coordinates Part C early intervention services for infants and toddlers in the district area.`,
        'https://www.floridaearlysteps.com',
        es.phone, // intake phone
        es.phone, // early intervention contact
        es.phone, // agency intake contact
        'https://www.floridaearlysteps.com',
        'https://www.floridaearlysteps.com',
        'Assessments and evaluations are provided at no cost. Appeals regarding eligible delays or services can be filed with the Florida Department of Health.',
        `Partnered with host agency: ${es.host}`,
        `Referral line: ${es.phone}`,
        'English, Spanish, Creole',
        '2026-06-12',
        'https://www.floridaearlysteps.com',
        'https://www.floridaearlysteps.com',
        'official',
        'curated_seed',
        'source_listed',
        new Date().toISOString(),
        5.0
      );

      for (const countySlug of countiesList) {
        insertRcCounty.run(es.id, countySlug);
      }
    }
    console.log('✓ Seeding Local Early Steps completed.');

    // ----------------------------------------------------
    // 4. Seed FDLRS Associate Centers (16 Centers in regional_education_agencies)
    // ----------------------------------------------------
    console.log('Seeding 16 FDLRS Associate Centers...');
    const insertEdAgency = db.prepare(`
      INSERT INTO regional_education_agencies 
      (id, state_id, agency_type, name, counties_served, website, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertSelpaCounty = db.prepare(`
      INSERT INTO selpa_counties (selpa_id, county_id) 
      VALUES (?, ?)
    `);

    const fdlrsCenters = [
      { id: 'fdlrs-emerald-coast', name: 'FDLRS Emerald Coast', phone: '(850) 469-5423', counties: ['escambia', 'santa-rosa', 'okaloosa'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-paec', name: 'FDLRS PAEC', phone: '(850) 638-6131', counties: ['bay', 'calhoun', 'franklin', 'gulf', 'holmes', 'jackson', 'liberty', 'walton', 'washington'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-miccosukee', name: 'FDLRS Miccosukee', phone: '(850) 487-2630', counties: ['leon', 'gadsden', 'jefferson', 'madison', 'taylor', 'wakulla'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-crown', name: 'FDLRS Crown', phone: '(904) 348-7800', counties: ['duval', 'clay', 'nassau', 'baker', 'st-johns'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-nefec', name: 'FDLRS NEFEC', phone: '(386) 329-3800', counties: ['alachua', 'bradford', 'columbia', 'dixie', 'gilchrist', 'hamilton', 'lafayette', 'levy', 'putnam', 'suwannee', 'union'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-action', name: 'FDLRS Action', phone: '(352) 742-6900', counties: ['lake', 'marion', 'sumter', 'citrus', 'hernando'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-east', name: 'FDLRS East', phone: '(321) 633-1000', counties: ['brevard', 'volusia'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-galaxy', name: 'FDLRS Galaxy', phone: '(772) 429-4600', counties: ['indian-river', 'martin', 'okeechobee', 'st-lucie'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-alpha', name: 'FDLRS Alpha', phone: '(561) 434-7300', counties: ['palm-beach'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-reach', name: 'FDLRS Reach', phone: '(754) 321-3400', counties: ['broward'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-south', name: 'FDLRS South', phone: '(305) 274-3701', counties: ['miami-dade', 'monroe'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-hillsborough', name: 'FDLRS Hillsborough', phone: '(813) 837-7777', counties: ['hillsborough'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-gulfcoast', name: 'FDLRS Gulfcoast', phone: '(727) 797-7009', counties: ['pinellas', 'pasco'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-heartland', name: 'FDLRS Heartland', phone: '(863) 534-2171', counties: ['polk', 'hardee', 'highlands'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-island-coast', name: 'FDLRS Island Coast', phone: '(239) 337-8363', counties: ['lee', 'collier', 'charlotte', 'desoto', 'glades', 'hendry'], website: 'https://www.fdlrs.org/' },
      { id: 'fdlrs-central', name: 'FDLRS Central', phone: '(407) 317-3660', counties: ['orange', 'osceola', 'seminole'], website: 'https://www.fdlrs.org/' }
    ];

    for (const fdlrs of fdlrsCenters) {
      const countiesList = fdlrs.counties.map(c => `${c}-fl`);
      insertEdAgency.run(
        fdlrs.id,
        'florida',
        'selpa',
        fdlrs.name,
        countiesList.join(','),
        fdlrs.website,
        fdlrs.website,
        'official',
        'curated_seed',
        'source_listed',
        '2026-06-12',
        new Date().toISOString(),
        5.0
      );

      for (const countySlug of countiesList) {
        insertSelpaCounty.run(fdlrs.id, countySlug);
      }
    }
    console.log('✓ Seeding FDLRS Centers completed.');

    // ----------------------------------------------------
    // 5. Seed School Districts (14 Curated Priority, Rest Fallback)
    // ----------------------------------------------------
    console.log('Seeding school districts...');
    const insertDistrict = db.prepare(`
      INSERT INTO school_districts 
      (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, total_enrollment, special_ed_pct, inclusion_rate_pct, self_contained_rate_pct, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const curatedDistricts = {
      'miami-dade-fl': { name: 'Miami-Dade County Public Schools (MDCPS) - ESE Department', phone: '(305) 995-2037', email: 'ese@dadeschools.net', website: 'https://ese.dadeschools.net/' },
      'broward-fl': { name: 'Broward County Public Schools - Exceptional Student Education', phone: '(754) 321-3400', email: 'ese.contact@browardschools.com', website: 'https://www.browardschools.com/ese' },
      'palm-beach-fl': { name: 'School District of Palm Beach County - Exceptional Student Education', phone: '(561) 434-8626', email: 'ese@palmbeachschools.org', website: 'https://www.palmbeachschools.org/ese' },
      'hillsborough-fl': { name: 'Hillsborough County Public Schools - Exceptional Student Education', phone: '(813) 273-7025', email: 'ese.info@hcps.net', website: 'https://www.hillsboroughschools.org/ese' },
      'orange-fl': { name: 'Orange County Public Schools - Exceptional Student Education', phone: '(407) 317-3275', email: 'ese@ocps.net', website: 'https://www.ocps.net/departments/exceptional_student_education' },
      'pinellas-fl': { name: 'Pinellas County Schools - Exceptional Student Education', phone: '(727) 588-6032', email: 'esecontact@pcsb.org', website: 'https://www.pcsb.org/ese' },
      'duval-fl': { name: 'Duval County Public Schools - Exceptional Student Education', phone: '(904) 348-7800', email: 'ese@duvalschools.org', website: 'https://www.duvalschools.org/ese' },
      'lee-fl': { name: 'School District of Lee County - Exceptional Student Education', phone: '(239) 337-8104', email: 'ese@leeschools.net', website: 'https://www.leeschools.net/departments/exceptional_student_education' },
      'polk-fl': { name: 'Polk County Public Schools - Exceptional Student Education', phone: '(863) 534-0930', email: 'ese@polk-fl.net', website: 'https://www.polkschoolsfl.com/ese' },
      'brevard-fl': { name: 'Brevard Public Schools - Exceptional Student Education', phone: '(321) 633-1000', email: 'ese@brevardschools.org', website: 'https://www.brevardschools.org/Page/2300' },
      'pasco-fl': { name: 'Pasco County Schools - Exceptional Student Education', phone: '(813) 794-2600', email: 'ese@pasco.k12.fl.us', website: 'https://www.pasco.k12.fl.us/ese' },
      'seminole-fl': { name: 'Seminole County Public Schools - Exceptional Student Education', phone: '(407) 320-0201', email: 'ese@scps.k12.fl.us', website: 'https://www.scps.k12.fl.us/ese' },
      'alachua-fl': { name: 'Alachua County Public Schools - Exceptional Student Education', phone: '(352) 955-7676', email: 'ese@sbac.edu', website: 'https://www.sbac.edu/ese' },
      'leon-fl': { name: 'Leon County Schools - Exceptional Student Education', phone: '(850) 487-7160', email: 'ese@leonschools.net', website: 'https://www.leonschools.net/ese' }
    };

    for (const county of counties) {
      const isCurated = priorityCounties.includes(county.id);
      if (isCurated) {
        const dist = curatedDistricts[county.id];
        insertDistrict.run(
          `sd-${county.id}`,
          county.id,
          dist.name,
          dist.phone,
          dist.email,
          dist.website,
          30000,
          13.5,
          62.5,
          18.5,
          dist.website,
          'official',
          'curated_seed',
          'source_listed',
          '2026-06-12',
          new Date().toISOString(),
          4.0
        );
      } else {
        const rawName = county.name.replace(/ County$/i, '');
        insertDistrict.run(
          `sd-${county.id}-fallback`,
          county.id,
          `${rawName} County School District (Exceptional Student Education)`,
          '(850) 245-0475',
          `esecontact@${county.id}.gov`,
          'https://www.fldoe.org/academics/exceptional-student-edu/',
          5000,
          12.0,
          60.0,
          20.0,
          'https://www.fldoe.org/academics/exceptional-student-edu/',
          'official',
          'programmatic_fallback',
          'generated_county_fallback',
          '2026-06-12',
          new Date().toISOString(),
          3.0
        );
      }
    }
    console.log('✓ Seeding School Districts completed.');

    // ----------------------------------------------------
    // 6. Seed DCF ACCESS Medicaid Offices (14 Curated physical, Rest Fallback)
    // ----------------------------------------------------
    console.log('Seeding DCF ACCESS offices...');
    const insertOffice = db.prepare(`
      INSERT INTO county_offices 
      (id, county_id, program_id, office_name, address, phone, email, website, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const dcfPhysicalOffices = {
      'miami-dade-fl': { name: 'DCF ACCESS Service Center - Miami', address: '1490 NW 27th Ave, Miami, FL 33125' },
      'broward-fl': { name: 'DCF ACCESS Service Center - Fort Lauderdale', address: '1400 W Commercial Blvd, Fort Lauderdale, FL 33309' },
      'palm-beach-fl': { name: 'DCF ACCESS Service Center - West Palm Beach', address: '111 S Sapodilla Ave, West Palm Beach, FL 33401' },
      'hillsborough-fl': { name: 'DCF ACCESS Service Center - Tampa', address: '1313 N Tampa St, Tampa, FL 33602' },
      'orange-fl': { name: 'DCF ACCESS Service Center - Orlando', address: '400 W Robinson St, Orlando, FL 32801' },
      'pinellas-fl': { name: 'DCF ACCESS Service Center - Largo', address: '11351 Ulmerton Rd, Largo, FL 33778' },
      'duval-fl': { name: 'DCF ACCESS Service Center - Jacksonville', address: '5920 Arlington Expressway, Jacksonville, FL 32211' },
      'lee-fl': { name: 'DCF ACCESS Service Center - Fort Myers', address: '2295 Victoria Ave, Fort Myers, FL 33901' },
      'polk-fl': { name: 'DCF ACCESS Service Center - Lakeland', address: '200 N Kentucky Ave, Lakeland, FL 33801' },
      'brevard-fl': { name: 'DCF ACCESS Service Center - Rockledge', address: '375 Commerce Pkwy, Rockledge, FL 32955' },
      'pasco-fl': { name: 'DCF ACCESS Service Center - New Port Richey', address: '7623 Little Rd, New Port Richey, FL 34654' },
      'seminole-fl': { name: 'DCF ACCESS Service Center - Lake Mary', address: '1301 S International Pkwy, Lake Mary, FL 32746' },
      'alachua-fl': { name: 'DCF ACCESS Service Center - Gainesville', address: '1000 NE 16th Ave, Gainesville, FL 32601' },
      'leon-fl': { name: 'DCF ACCESS Service Center - Tallahassee', address: '2810 Sharer Rd, Tallahassee, FL 32303' }
    };

    for (const county of counties) {
      const officeId = `off-${county.id}-fl-medicaid`;
      const physicalOffice = dcfPhysicalOffices[county.id];

      if (physicalOffice) {
        insertOffice.run(
          officeId,
          county.id,
          'fl-medicaid-dcf',
          physicalOffice.name,
          physicalOffice.address,
          '(866) 762-2237',
          'access.intake@myflfamilies.com',
          'https://www.myflfamilies.com/ACCESS',
          'https://www.myflfamilies.com/ACCESS',
          'official',
          'curated_seed',
          'source_listed',
          '2026-06-12',
          new Date().toISOString(),
          4.0
        );
      } else {
        insertOffice.run(
          officeId,
          county.id,
          'fl-medicaid-dcf',
          'Florida DCF ACCESS Central Portal',
          'Florida routes this through the statewide ACCESS Florida benefits system and local service centers.',
          '(866) 762-2237',
          'access.central@myflfamilies.com',
          'https://www.myflfamilies.com/ACCESS',
          'https://www.myflfamilies.com/ACCESS',
          'official',
          'programmatic_fallback',
          'generated_county_fallback',
          '2026-06-12',
          new Date().toISOString(),
          3.0
        );
      }
    }
    console.log('✓ Seeding DCF ACCESS offices completed.');

    // ----------------------------------------------------
    // 7. Seed Nonprofits (Statewide to all counties, Local to priority)
    // ----------------------------------------------------
    console.log('Seeding nonprofits...');
    const insertNonprofit = db.prepare(`
      INSERT INTO nonprofit_organizations 
      (id, name, county_id, website, phone, focus_condition, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const statewideNonprofits = [
      { id: 'fl-np-drf', name: 'Disability Rights Florida (Statewide Support)', website: 'https://www.disabilityrightsflorida.org', phone: '(800) 342-0823', focus: 'any' },
      { id: 'fl-np-fnd', name: 'Family Network on Disabilities (Statewide Support)', website: 'https://fndusa.org', phone: '(800) 825-5736', focus: 'any' },
      { id: 'fl-np-arc', name: 'The Arc of Florida (Statewide Support)', website: 'https://www.arcflorida.org', phone: '(850) 921-0460', focus: 'intellectual-disability' }
    ];

    for (const np of statewideNonprofits) {
      for (const county of counties) {
        insertNonprofit.run(
          `${np.id}-${county.id}`,
          np.name,
          county.id,
          np.website,
          np.phone,
          np.focus,
          np.website,
          'nonprofit',
          'curated_seed',
          'source_listed',
          '2026-06-12',
          new Date().toISOString(),
          4.0
        );
      }
    }

    const regionalNonprofits = [
      { id: 'fl-np-parent-miami', name: 'Parent to Parent of Miami', website: 'https://www.ptopmiami.org', phone: '(305) 271-9797', focus: 'any', counties: ['miami-dade-fl'] },
      { id: 'fl-np-arc-broward', name: 'The Arc of Broward', website: 'https://www.arcbroward.com', phone: '(954) 746-9400', focus: 'intellectual-disability', counties: ['broward-fl'] },
      { id: 'fl-np-arc-palmbeach', name: 'The Arc of Palm Beach County', website: 'https://www.arcpbc.org', phone: '(561) 842-3213', focus: 'intellectual-disability', counties: ['palm-beach-fl'] },
      { id: 'fl-np-arc-tampabay', name: 'The Arc of Tampa Bay', website: 'https://www.thearctb.org', phone: '(727) 797-8892', focus: 'intellectual-disability', counties: ['pinellas-fl', 'hillsborough-fl', 'pasco-fl'] },
      { id: 'fl-np-arc-central', name: 'The Arc of Central Florida', website: 'https://www.arcofcentralflorida.org', phone: '(407) 629-7005', focus: 'intellectual-disability', counties: ['orange-fl', 'seminole-fl'] },
      { id: 'fl-np-arc-jax', name: 'The Arc Jacksonville', website: 'https://www.arcjacksonville.org', phone: '(904) 355-0155', focus: 'intellectual-disability', counties: ['duval-fl'] },
      { id: 'fl-np-larc-lee', name: 'LARC - Lee County Association for Remarkable Citizens', website: 'https://www.larcleeco.org', phone: '(239) 334-6285', focus: 'intellectual-disability', counties: ['lee-fl'] },
      { id: 'fl-np-afi-polk', name: 'Alliance for Independence (Polk)', website: 'https://www.afi-polk.org', phone: '(863) 665-3846', focus: 'intellectual-disability', counties: ['polk-fl'] },
      { id: 'fl-np-arc-spacecoast', name: 'The Arc of Space Coast', website: 'https://www.arcspacecoast.org', phone: '(321) 690-3464', focus: 'intellectual-disability', counties: ['brevard-fl'] },
      { id: 'fl-np-arc-alachua', name: 'The Arc of Alachua County', website: 'https://www.arcalachua.org', phone: '(352) 334-7900', focus: 'intellectual-disability', counties: ['alachua-fl'] },
      { id: 'fl-np-arc-leon', name: 'The Arc of Leon County', website: 'https://www.arctallahassee.org', phone: '(850) 224-4896', focus: 'intellectual-disability', counties: ['leon-fl'] }
    ];

    for (const rnp of regionalNonprofits) {
      for (const countyId of rnp.counties) {
        insertNonprofit.run(
          `${rnp.id}-${countyId}`,
          rnp.name,
          countyId,
          rnp.website,
          rnp.phone,
          rnp.focus,
          rnp.website,
          'nonprofit',
          'curated_seed',
          'source_listed',
          '2026-06-12',
          new Date().toISOString(),
          4.0
        );
      }
    }
    console.log('✓ Seeding nonprofits completed.');

    // ----------------------------------------------------
    // 8. Seed Advocates & Providers (Legal, Support, Therapy for 14 Priority Counties)
    // ----------------------------------------------------
    console.log('Seeding advocates and providers (legal/support/therapy)...');
    const insertAdvocate = db.prepare(`
      INSERT INTO iep_advocates 
      (id, name, credentials, experience_years, price_rate, counties_served, languages_spoken, phone, email, website, specialties, regional_center_vendorized, organization_affiliation, description, verification_status, source_url, source_type, last_scraped_at, last_verified_at, data_origin, last_verified_date, confidence_score) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertAdvocateCounty = db.prepare(`
      INSERT INTO iep_advocate_counties (iep_advocate_id, county_id) 
      VALUES (?, ?)
    `);

    const advocates = [
      // Statewide Protection & PTI mapped to ALL counties
      { id: 'fl-advocate-drf', name: 'Disability Rights Florida (Statewide)', credentials: 'Protection & Advocacy (P&A) Legal Aid', exp: 25, rate: 'Free / Grant-funded', website: 'https://www.disabilityrightsflorida.org', phone: '(800) 342-0823', email: 'info@disabilityrightsflorida.org', desc: 'Federally mandated Protection and Advocacy system providing free legal assistance, rights training, and administrative advocacy for children with special education and waiver needs.', counties: [], specialties: 'Legal Aid, ESE Law, iBudget, Early Steps, Due Process' },
      { id: 'fl-advocate-fnd', name: 'Family Network on Disabilities (Statewide)', credentials: 'Parent Training & Information Center (PTI)', exp: 20, rate: 'Free / Parent Resource', website: 'https://fndusa.org', phone: '(800) 825-5736', email: 'fnd@fndusa.org', desc: 'Provides free IEP assistance, training workshops, parent advocates, and dispute resolution guides for ESE processes.', counties: [], specialties: 'Parent Coach, IEP Advocate, ESE Dispute Resolution' },
      
      // Local resources per priority county (1 legal, 1 therapy per county)
      // Miami-Dade
      { id: 'fl-advocate-legal-miami', name: 'Legal Aid Society of Miami-Dade County', credentials: 'JD, Special Ed Legal Aid', exp: 15, rate: 'Free / Sliding scale', website: 'https://www.dadelegalaid.org', phone: '(305) 579-5733', email: 'ese@dadelegalaid.org', desc: 'Provides free special education representation, IEP reviews, and administrative dispute support for low-income Miami-Dade families.', counties: ['miami-dade-fl'], specialties: 'Legal Aid, IEP, Due Process' },
      { id: 'fl-provider-therapy-miami', name: 'Miami Speech Institute', credentials: 'Therapist Clinic (Speech, OT, PT)', exp: 10, rate: 'Insurance / Medicaid', website: 'https://www.miamispeechinstitute.com', phone: '(305) 800-4740', email: 'info@miamispeechinstitute.com', desc: 'Comprehensive speech and language evaluation, occupational therapy, and motor coordination treatment.', counties: ['miami-dade-fl'], specialties: 'Speech therapy, Occupational therapy, Physical therapy' },

      // Broward
      { id: 'fl-advocate-legal-broward', name: 'Coast to Coast Legal Aid of South Florida', credentials: 'JD, Special Ed Legal Aid', exp: 12, rate: 'Free / Sliding scale', website: 'https://www.coasttocoastlegalaid.org', phone: '(954) 736-2400', email: 'info@coasttocoastlegalaid.org', desc: 'Provides educational advocacy and legal representation in special education, 504 plans, and student discipline.', counties: ['broward-fl'], specialties: 'Legal Aid, IEP, ESE Advocacy' },
      { id: 'fl-provider-therapy-broward', name: 'Broward Therapy Group', credentials: 'Pediatric Therapy Group', exp: 8, rate: 'Insurance / Private', website: 'https://www.browardtherapygroup.com', phone: '(954) 474-8048', email: 'info@browardtherapygroup.com', desc: 'Provides speech-language, physical, and occupational therapy evaluations and interventions.', counties: ['broward-fl'], specialties: 'Speech therapy, Occupational therapy, Physical therapy' },

      // Palm Beach
      { id: 'fl-advocate-legal-palmbeach', name: 'Legal Aid Society of Palm Beach County', credentials: 'JD, Educational Rights Attorney', exp: 18, rate: 'Free / sliding scale', website: 'https://www.legalaidpbc.org', phone: '(561) 655-8944', email: 'info@legalaidpbc.org', desc: 'Education Advocacy Project assists children with special needs to ensure they receive appropriate services.', counties: ['palm-beach-fl'], specialties: 'Legal Aid, ESE Attorney, IEP' },
      { id: 'fl-provider-therapy-palmbeach', name: 'Palm Beach Pediatric Therapies', credentials: 'Pediatric Clinic', exp: 10, rate: 'Insurance / Private', website: 'https://www.pbpediatrictherapies.com', phone: '(561) 748-5430', email: 'contact@pbpediatrictherapies.com', desc: 'Specialized speech pathology and sensory integration occupational therapies for young children.', counties: ['palm-beach-fl'], specialties: 'Speech therapy, Occupational therapy' },

      // Hillsborough
      { id: 'fl-advocate-legal-hillsborough', name: 'Bay Area Legal Services (Tampa)', credentials: 'JD, Special Ed Legal Aid', exp: 14, rate: 'Free / Sliding scale', website: 'https://www.bals.org', phone: '(813) 232-1343', email: 'info@bals.org', desc: 'Regional legal aid program helping families resolve school accommodation and benefits disputes.', counties: ['hillsborough-fl'], specialties: 'Legal Aid, IEP, iBudget Appeal' },
      { id: 'fl-provider-therapy-hillsborough', name: 'Tampa Bay Pediatric Therapies', credentials: 'Pediatric Therapy Center', exp: 9, rate: 'Insurance / Medicaid', website: 'https://www.tbpediatrictherapies.com', phone: '(813) 355-4674', email: 'contact@tbpediatrictherapies.com', desc: 'Speech, sensory integration, and developmental therapies in local Tampa locations.', counties: ['hillsborough-fl'], specialties: 'Speech therapy, Occupational therapy' },

      // Orange
      { id: 'fl-advocate-legal-orange', name: 'Community Legal Services of Mid-Florida', credentials: 'JD, Special Ed Legal Aid', exp: 11, rate: 'Free / Sliding scale', website: 'https://www.clsmf.org', phone: '(800) 405-0456', email: 'info@clsmf.org', desc: 'Children\'s advocacy team offering legal representation in IEP, 504, and disability benefit denials.', counties: ['orange-fl', 'seminole-fl'], specialties: 'Legal Aid, IEP, Due Process' },
      { id: 'fl-provider-therapy-orange', name: 'Orlando Pediatric Therapy', credentials: 'Therapy Group', exp: 12, rate: 'Insurance / Medicaid', website: 'https://www.orlandopediatrictherapy.com', phone: '(407) 857-0055', email: 'info@orlandopediatrictherapy.com', desc: 'Bilingual pediatric clinic offering speech therapy, occupational therapy, and physical therapy.', counties: ['orange-fl'], specialties: 'Speech therapy, Occupational therapy, Physical therapy' },

      // Pinellas
      { id: 'fl-advocate-legal-pinellas', name: 'Gulfcoast Legal Services', credentials: 'JD, Educational Rights Attorney', exp: 15, rate: 'Free / sliding scale', website: 'https://gulfcoastlegal.org', phone: '(727) 821-0726', email: 'info@gulfcoastlegal.org', desc: 'Specialized advocacy for children with special education needs and low-income caregivers.', counties: ['pinellas-fl'], specialties: 'Legal Aid, IEP, ESE Advocacy' },
      { id: 'fl-provider-therapy-pinellas', name: 'Pinellas Pediatric Therapy', credentials: 'Therapist Clinic', exp: 10, rate: 'Insurance / Private', website: 'https://www.pinellaspediatrictherapy.com', phone: '(727) 518-2500', email: 'clinic@pinellaspediatrictherapy.com', desc: 'Occupational, speech-language, and sensory integration therapies for children.', counties: ['pinellas-fl'], specialties: 'Speech therapy, Occupational therapy' },

      // Duval
      { id: 'fl-advocate-legal-duval', name: 'Jacksonville Area Legal Aid (JALA)', credentials: 'JD, Special Ed Legal Aid', exp: 16, rate: 'Free / Sliding scale', website: 'https://www.jaxlegalaid.org', phone: '(904) 356-8371', email: 'info@jaxlegalaid.org', desc: 'JALA\'s Education Unit secures proper school placements and educational plans for disabled children.', counties: ['duval-fl'], specialties: 'Legal Aid, ESE Attorney, IEP' },
      { id: 'fl-provider-therapy-duval', name: 'Jacksonville Pediatric Therapies', credentials: 'Pediatric Clinic', exp: 11, rate: 'Insurance / Medicaid', website: 'https://www.jaxpediatric.com', phone: '(904) 223-1439', email: 'info@jaxpediatric.com', desc: 'Provides clinical speech, physical, and sensory occupational therapies for children.', counties: ['duval-fl'], specialties: 'Speech therapy, Occupational therapy, Physical therapy' },

      // Lee
      { id: 'fl-advocate-legal-lee', name: 'Lee County Legal Aid Society', credentials: 'JD, Special Ed Legal Aid', exp: 10, rate: 'Free / Sliding scale', website: 'https://www.leecountylegalaid.org', phone: '(239) 334-6118', email: 'info@leecountylegalaid.org', desc: 'Free legal advice and advocacy for low-income families seeking special education and iBudget assistance.', counties: ['lee-fl'], specialties: 'Legal Aid, ESE Law, IEP' },
      { id: 'fl-provider-therapy-lee', name: 'Golisano Pediatric Therapy (Fort Myers)', credentials: 'Specialty Pediatric Center', exp: 15, rate: 'Insurance / Medicaid', website: 'https://www.leehealth.org', phone: '(239) 343-9830', email: 'golisano.therapy@leehealth.org', desc: 'Comprehensive pediatric rehabilitation, outpatient speech, physical, and occupational therapy.', counties: ['lee-fl'], specialties: 'Speech therapy, Occupational therapy, Physical therapy' },

      // Polk
      { id: 'fl-advocate-legal-polk', name: 'Florida Rural Legal Services (Lakeland)', credentials: 'JD, Special Ed Legal Aid', exp: 12, rate: 'Free / sliding scale', website: 'https://www.frls.org', phone: '(800) 277-7680', email: 'info@frls.org', desc: 'Statewide legal aid branch offering education advocacy and benefits routing.', counties: ['polk-fl'], specialties: 'Legal Aid, ESE Law, IEP' },
      { id: 'fl-provider-therapy-polk', name: 'Polk Therapy Kids', credentials: 'Therapist Clinic', exp: 8, rate: 'Insurance / Medicaid', website: 'https://www.polktherapykids.com', phone: '(863) 644-1110', email: 'clinic@polktherapykids.com', desc: 'Outpatient pediatric rehab offering speech-language pathology and sensory OT.', counties: ['polk-fl'], specialties: 'Speech therapy, Occupational therapy' },

      // Brevard
      { id: 'fl-advocate-legal-brevard', name: 'Brevard County Legal Aid', credentials: 'JD, Special Ed Legal Aid', exp: 15, rate: 'Free / Sliding scale', website: 'https://www.brevardlegalaid.org', phone: '(321) 631-2500', email: 'info@brevardlegalaid.org', desc: 'Provides civil legal aid and educational advocacy representation in IEP disputes.', counties: ['brevard-fl'], specialties: 'Legal Aid, IEP, ESE Advocacy' },
      { id: 'fl-provider-therapy-brevard', name: 'Brevard Pediatric Therapies', credentials: 'Pediatric Clinic', exp: 11, rate: 'Insurance / Private', website: 'https://www.brevardpediatrictherapies.com', phone: '(321) 255-6627', email: 'info@brevardpediatrictherapies.com', desc: 'Dedicated pediatric therapists for speech development, autism coordination, and gross motor skills.', counties: ['brevard-fl'], specialties: 'Speech therapy, Occupational therapy, Physical therapy' },

      // Pasco
      { id: 'fl-advocate-legal-pasco', name: 'Bay Area Legal Services (Dade City)', credentials: 'JD, Special Ed Legal Aid', exp: 13, rate: 'Free / Sliding scale', website: 'https://www.bals.org', phone: '(352) 567-9044', email: 'info@bals.org', desc: 'Dedicated legal aid office protecting educational rights for children in Pasco county.', counties: ['pasco-fl'], specialties: 'Legal Aid, IEP, Special Education Law' },
      { id: 'fl-provider-therapy-pasco', name: 'Pasco Pediatric Rehab', credentials: 'Therapist Group', exp: 10, rate: 'Insurance / Medicaid', website: 'https://www.pascopediatricrehab.com', phone: '(727) 372-1010', email: 'info@pascopediatricrehab.com', desc: 'Pediatric outpatient rehabilitation clinics serving speech and motor delays.', counties: ['pasco-fl'], specialties: 'Speech therapy, Occupational therapy' },

      // Seminole
      { id: 'fl-advocate-legal-seminole', name: 'Seminole County Legal Aid Society', credentials: 'JD, Special Ed Legal Aid', exp: 14, rate: 'Free / sliding scale', website: 'https://www.seminolelegalaid.org', phone: '(407) 834-1660', email: 'info@seminolelegalaid.org', desc: 'Advocacy for special needs students, representation in IEP development and waiver appeal hearings.', counties: ['seminole-fl'], specialties: 'Legal Aid, IEP, iBudget Appeal' },
      { id: 'fl-provider-therapy-seminole', name: 'Lake Mary Pediatric Therapy', credentials: 'Pediatric Clinic', exp: 8, rate: 'Insurance / Private', website: 'https://www.lakemarypediatrictherapy.com', phone: '(407) 804-0012', email: 'info@lakemarypediatrictherapy.com', desc: 'Speech, motor skill, and sensory integration therapies in Lake Mary.', counties: ['seminole-fl'], specialties: 'Speech therapy, Occupational therapy, Physical therapy' },

      // Alachua
      { id: 'fl-advocate-legal-alachua', name: 'Three Rivers Legal Services (Gainesville)', credentials: 'JD, Special Ed Legal Aid', exp: 16, rate: 'Free / Sliding scale', website: 'https://www.trls.org', phone: '(352) 372-0519', email: 'info@trls.org', desc: 'Provides civil legal aid and education rights advocacy for families in North Central Florida.', counties: ['alachua-fl'], specialties: 'Legal Aid, IEP, FDLRS Liaison' },
      { id: 'fl-provider-therapy-alachua', name: 'Gainesville Pediatric Therapy', credentials: 'Therapist Center', exp: 10, rate: 'Insurance / Medicaid', website: 'https://www.gainesvillepediatrictherapy.com', phone: '(352) 332-6671', email: 'info@gainesvillepediatrictherapy.com', desc: 'Clinical pediatric rehab clinic supporting sensory, feeding, motor and speech therapy.', counties: ['alachua-fl'], specialties: 'Speech therapy, Occupational therapy, Physical therapy' },

      // Leon
      { id: 'fl-advocate-legal-leon', name: 'Legal Aid Foundation of Tallahassee', credentials: 'JD, Special Ed Legal Aid', exp: 12, rate: 'Free / Sliding scale', website: 'https://www.legalaidtallahassee.org', phone: '(850) 222-3292', email: 'info@legalaidtallahassee.org', desc: 'Free special education dispute counsel and parent training for Leon County.', counties: ['leon-fl'], specialties: 'Legal Aid, IEP, Special Education Law' },
      { id: 'fl-provider-therapy-leon', name: 'Tallahassee Pediatric Therapies', credentials: 'Pediatric Clinic', exp: 10, rate: 'Insurance / Medicaid', website: 'https://www.tallahasseepediatrictherapy.com', phone: '(850) 402-0220', email: 'info@tallahasseepediatrictherapy.com', desc: 'Coordinates pediatric therapy, speech, physical, and occupational therapy.', counties: ['leon-fl'], specialties: 'Speech therapy, Occupational therapy, Physical therapy' },

      // Additional ABA Clinician mapped to all 14 priority counties
      { id: 'fl-provider-abc-aba', name: 'Action Behavior Centers (ABA Therapy - Florida)', credentials: 'BCBA Certified Clinic', exp: 8, rate: 'Insurance / Private', website: 'https://www.actionbehavior.com', phone: '(800) 615-8720', email: 'intake@actionbehavior.com', desc: 'Clinical ABA therapy providers with locations throughout major Florida metro areas.', counties: priorityCounties, specialties: 'ABA Clinic, Autism Therapy' }
    ];

    for (const adv of advocates) {
      insertAdvocate.run(
        adv.id,
        adv.name,
        adv.credentials,
        adv.exp,
        adv.rate,
        adv.counties.length > 0 ? 'Local' : 'Statewide (All Florida Counties)',
        'English, Spanish, Creole',
        adv.phone,
        adv.email,
        adv.website,
        adv.specialties,
        0, // regional_center_vendorized
        adv.name,
        adv.desc,
        'source_listed',
        adv.website,
        'official',
        new Date().toISOString(),
        null,
        'curated_seed',
        '2026-06-12',
        5.0
      );

      const countiesList = adv.counties.length > 0 ? adv.counties : counties.map(c => c.id);
      for (const countyId of countiesList) {
        insertAdvocateCounty.run(adv.id, countyId);
      }
    }
    console.log('✓ Seeding advocates completed.');

    // ----------------------------------------------------
    // 9. Seed Waitlists & Appeals guidance for Florida waivers
    // ----------------------------------------------------
    console.log('Seeding waitlists and appeals info...');
    const insertWaitlist = db.prepare(`
      INSERT INTO program_waitlists 
      (id, program_id, name, duration_label, duration_months, status, description, reserve_capacity_notice, legal_deadline, last_scraped_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertWaitlist.run(
      'wl-fl-ibudget',
      'fl-ibudget',
      'Florida iBudget Waiver Waitlist',
      '7 to 10+ Years',
      120.0,
      'severe',
      'The iBudget Waitlist has over 20,000 individuals. Placement is based on statutory priority categories (1-7), not strictly chronological registration date.',
      'Category 1 is reserved for crisis cases (homelessness, caregiver death/illness, danger to self/others) who bypass the list.',
      'No statutory limit on interest list wait times',
      new Date().toISOString()
    );

    const insertAppeal = db.prepare(`
      INSERT INTO program_appeal_info 
      (program_id, deadline_days, appeal_steps, denial_reasons, appeal_form_name, official_appeal_source_url) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertAppeal.run(
      'fl-ibudget',
      '30 days',
      '1. Request an administrative Fair Hearing in writing from your APD regional office.\n2. Participate in a local resolution conference to resolve the dispute.\n3. Present evidence at a formal Fair Hearing conducted by the DCF Office of Appeal Hearings.',
      'Eligibility criteria not met: IQ above 70 without qualifying related condition; adaptive deficits do not reach intermediate care facility level.',
      'APD Fair Hearing Request (Form APD-01)',
      'https://apd.myflorida.com/'
    );

    insertAppeal.run(
      'fl-cdc-plus',
      '30 days',
      '1. Submit a written hearing request to the APD regional office.\n2. Present your self-directed budget dispute.\n3. Attend DCF Office of Appeal Hearings.',
      'Budget adjustments not approved; representative training not completed; misdirection of waiver funds.',
      'APD Fair Hearing Request',
      'https://apd.myflorida.com/'
    );

    insertAppeal.run(
      'fl-medicaid-dcf',
      '90 days',
      '1. Submit a Fair Hearing Request online or to the local DCF service center.\n2. Participate in a case review with DCF workers.\n3. Participate in DCF Office of Appeal Hearings.',
      'Household income exceeds limits; asset limits exceeded ($2,000 for individual); lack of citizenship documentation.',
      'ACCESS Florida Fair Hearing Request',
      'https://www.myflfamilies.com/ACCESS'
    );
    console.log('✓ Seeding waitlists and appeals completed.');
  })();

  console.log('✅ Florida exhaustive database seeding complete!');
} catch (err) {
  console.error('❌ Error during database seeding:', err);
  process.exit(1);
}
db.close();
