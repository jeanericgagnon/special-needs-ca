import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../../ca_disability_navigator.db');

console.log('⏳ Ingesting the exhaustive directory of all 21 California Regional Centers into SQLite...');

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Exhaustive directory of all 21 California Regional Centers
const allRegionalCenters = [
  {
    id: 'alta-california',
    name: 'Alta California Regional Center (ACRC)',
    counties_served: 'sacramento,yolo,placer,el-dorado,nevada,sierra,alpine,colusa,sutter,yuba',
    catchment_boundaries: 'Serves Sacramento, Yolo, Placer, El Dorado, Nevada, Sierra, Alpine, Colusa, Sutter, and Yuba counties.',
    website: 'https://www.altaregional.org',
    intake_phone: '(916) 978-6400',
    early_start_contact: 'Phone: (916) 978-6249, Email: earlystartintake@altaregional.org',
    lanterman_intake_contact: 'Phone: (916) 978-6400, Email: intake@altaregional.org',
    eligibility_info_page: 'https://www.altaregional.org/eligibility',
    services_page: 'https://www.altaregional.org/services-we-provide',
    appeals_info: 'https://www.altaregional.org/appeals-complaints',
    frc_relationship: 'Partners closely with Warmline Family Resource Center.',
    office_locations: '2241 Harvard St, Suite 100, Sacramento, CA 95815',
    languages: 'English, Spanish, Hmong, Russian, Vietnamese, Tagalog',
    last_verified_date: '2026-05-24',
    source_urls: 'https://www.altaregional.org'
  },
  {
    id: 'central-valley',
    name: 'Central Valley Regional Center (CVRC)',
    counties_served: 'fresno,kings,madera,mariposa,merced,tulare',
    catchment_boundaries: 'Serves Fresno, Kings, Madera, Mariposa, Merced, and Tulare counties.',
    website: 'https://www.cvrc.org',
    intake_phone: '(559) 276-4300',
    early_start_contact: 'Phone: (559) 276-4300, Email: earlystart@cvrc.org',
    lanterman_intake_contact: 'Phone: (559) 276-44300, Email: intake@cvrc.org',
    eligibility_info_page: 'https://www.cvrc.org/eligibility',
    services_page: 'https://www.cvrc.org/services',
    appeals_info: 'https://www.cvrc.org/appeals-complaints',
    frc_relationship: 'Partners with Exceptional Parents Unlimited (EPU) Family Resource Center.',
    office_locations: '4615 N Marty Ave, Fresno, CA 93722',
    languages: 'English, Spanish, Hmong, Laotian, Portuguese, Tagalog',
    last_verified_date: '2026-05-18',
    source_urls: 'https://www.cvrc.org'
  },
  {
    id: 'eastern-los-angeles',
    name: 'Eastern Los Angeles Regional Center (ELARC)',
    counties_served: 'los-angeles',
    catchment_boundaries: 'Serves Eastern Los Angeles County including Alhambra, Pasadena, East LA, and Whittier.',
    website: 'https://www.elarc.org',
    intake_phone: '(626) 299-4700',
    early_start_contact: 'Phone: (626) 299-4770, Email: earlystartintake@elarc.org',
    lanterman_intake_contact: 'Phone: (626) 299-4700, Email: intake@elarc.org',
    eligibility_info_page: 'https://www.elarc.org/eligibility',
    services_page: 'https://www.elarc.org/services',
    appeals_info: 'https://www.elarc.org/appeals',
    frc_relationship: 'Directly partners with the Family Resource Library and Assistive Technology Center.',
    office_locations: '1000 S Fremont Ave, Alhambra, CA 91803',
    languages: 'English, Spanish, Cantonese, Mandarin, Vietnamese, Tagalog',
    last_verified_date: '2026-05-10',
    source_urls: 'https://www.elarc.org'
  },
  {
    id: 'far-northern',
    name: 'Far Northern Regional Center (FNRC)',
    counties_served: 'butte,glenn,lassen,modoc,plumas,shasta,siskiyou,tehama,trinity',
    catchment_boundaries: 'Serves Butte, Glenn, Lassen, Modoc, Plumas, Shasta, Siskiyou, Tehama, and Trinity counties.',
    website: 'https://www.farnorthernrc.org',
    intake_phone: '(530) 222-4791',
    early_start_contact: 'Phone: (530) 222-4791, Email: earlystart@farnorthernrc.org',
    lanterman_intake_contact: 'Phone: (530) 222-4791, Email: intake@farnorthernrc.org',
    eligibility_info_page: 'https://www.farnorthernrc.org/eligibility',
    services_page: 'https://www.farnorthernrc.org/services',
    appeals_info: 'https://www.farnorthernrc.org/rights-appeals',
    frc_relationship: 'Partners with Rowell Family Empowerment of Northern California.',
    office_locations: '1900 Churn Creek Rd, Redding, CA 96002',
    languages: 'English, Spanish, Hmong, Mien, Laotian',
    last_verified_date: '2026-05-14',
    source_urls: 'https://www.farnorthernrc.org'
  },
  {
    id: 'golden-gate',
    name: 'Golden Gate Regional Center (GGRC)',
    counties_served: 'san-francisco,marin,san-mateo',
    catchment_boundaries: 'Serves San Francisco, Marin, and San Mateo counties.',
    website: 'https://www.ggrc.org',
    intake_phone: '(415) 546-9222',
    early_start_contact: 'Phone: (415) 832-5160, Email: earlystartintake@ggrc.org',
    lanterman_intake_contact: 'Phone: (415) 546-9222, Email: intake@ggrc.org',
    eligibility_info_page: 'https://www.ggrc.org/services/eligibility',
    services_page: 'https://www.ggrc.org/services',
    appeals_info: 'https://www.ggrc.org/rights-appeals',
    frc_relationship: 'Partners with Support for Families of Children with Disabilities.',
    office_locations: '1355 Market St, Suite 220, San Francisco, CA 94103',
    languages: 'English, Spanish, Cantonese, Mandarin, Tagalog, Vietnamese',
    last_verified_date: '2026-05-15',
    source_urls: 'https://www.ggrc.org'
  },
  {
    id: 'harbor',
    name: 'Harbor Regional Center (HRC)',
    counties_served: 'los-angeles',
    catchment_boundaries: 'Serves Southern Los Angeles County including Torrance, Long Beach, Bellflower, and Harbor.',
    website: 'https://www.harborrc.org',
    intake_phone: '(310) 540-1711',
    early_start_contact: 'Phone: (310) 543-0686, Email: earlystartintake@harborrc.org',
    lanterman_intake_contact: 'Phone: (310) 540-1711, Email: intake@harborrc.org',
    eligibility_info_page: 'https://www.harborrc.org/eligibility',
    services_page: 'https://www.harborrc.org/services',
    appeals_info: 'https://www.harborrc.org/appeals-complaints',
    frc_relationship: 'HRC Resource Center provides direct library and advocate supports.',
    office_locations: '21231 Hawthorne Blvd, Torrance, CA 90503',
    languages: 'English, Spanish, Cambodian, Vietnamese, Korean, Japanese',
    last_verified_date: '2026-05-22',
    source_urls: 'https://www.harborrc.org'
  },
  {
    id: 'inland',
    name: 'Inland Regional Center (IRC)',
    counties_served: 'riverside,san-bernardino',
    catchment_boundaries: 'Serves Riverside and San Bernardino counties.',
    website: 'https://www.inlandrc.org',
    intake_phone: '(909) 890-3000',
    early_start_contact: 'Phone: (909) 890-3000, Email: earlystart@inlandrc.org',
    lanterman_intake_contact: 'Phone: (909) 890-3000, Email: intake@inlandrc.org',
    eligibility_info_page: 'https://www.inlandrc.org/eligibility',
    services_page: 'https://www.inlandrc.org/services',
    appeals_info: 'https://www.inlandrc.org/appeals-and-complaints',
    frc_relationship: 'Partners with Inland Empire Health Plan & local FRC networks.',
    office_locations: '1365 S Waterman Ave, San Bernardino, CA 92408',
    languages: 'English, Spanish, Vietnamese, Arabic, Tagalog',
    last_verified_date: '2026-05-24',
    source_urls: 'https://www.inlandrc.org'
  },
  {
    id: 'kern',
    name: 'Kern Regional Center (KRC)',
    counties_served: 'kern,inyo,mono',
    catchment_boundaries: 'Serves Kern, Inyo, and Mono counties.',
    website: 'https://www.kernrc.org',
    intake_phone: '(661) 327-8531',
    early_start_contact: 'Phone: (661) 852-3360, Email: earlystart@kernrc.org',
    lanterman_intake_contact: 'Phone: (661) 327-8531, Email: intake@kernrc.org',
    eligibility_info_page: 'https://www.kernrc.org/eligibility',
    services_page: 'https://www.kernrc.org/services',
    appeals_info: 'https://www.kernrc.org/appeals',
    frc_relationship: 'Partners with H.E.A.R.T.S. Connection Family Resource Center.',
    office_locations: '3200 Sillect Ave, Bakersfield, CA 93308',
    languages: 'English, Spanish, Tagalog',
    last_verified_date: '2026-05-11',
    source_urls: 'https://www.kernrc.org'
  },
  {
    id: 'lanterman',
    name: 'Frank D. Lanterman Regional Center (FDLRC)',
    counties_served: 'los-angeles',
    catchment_boundaries: 'Serves Central Los Angeles, Glendale, Pasadena, La Cañada, and Burbank.',
    website: 'https://www.lanterman.org',
    intake_phone: '(213) 383-1300',
    early_start_contact: 'Phone: (213) 252-5600, Email: earlystartintake@lanterman.org',
    lanterman_intake_contact: 'Phone: (213) 252-5699, Email: intake@lanterman.org',
    eligibility_info_page: 'https://www.lanterman.org/eligibility',
    services_page: 'https://www.lanterman.org/services',
    appeals_info: 'https://www.lanterman.org/appeals_and_complaints',
    frc_relationship: 'Directly partners with Koch-Young Family Resource Center.',
    office_locations: '3303 Wilshire Blvd, Los Angeles, CA 90010',
    languages: 'English, Spanish, Korean, Armenian, Tagalog',
    last_verified_date: '2026-04-10',
    source_urls: 'https://www.lanterman.org'
  },
  {
    id: 'north-bay',
    name: 'North Bay Regional Center (NBRC)',
    counties_served: 'napa,solano,sonoma',
    catchment_boundaries: 'Serves Napa, Solano, and Sonoma counties.',
    website: 'https://www.nbrc.net',
    intake_phone: '(707) 256-1100',
    early_start_contact: 'Phone: (707) 256-1100, Email: earlystart@nbrc.net',
    lanterman_intake_contact: 'Phone: (707) 256-1100, Email: intake@nbrc.net',
    eligibility_info_page: 'https://www.nbrc.net/services/eligibility',
    services_page: 'https://www.nbrc.net/services',
    appeals_info: 'https://www.nbrc.net/rights-appeals',
    frc_relationship: 'Partners with Matrix Parent Network and Resource Center.',
    office_locations: '10 Executive Ct, Napa, CA 94558',
    languages: 'English, Spanish, Tagalog, Vietnamese',
    last_verified_date: '2026-05-18',
    source_urls: 'https://www.nbrc.net'
  },
  {
    id: 'north-los-angeles',
    name: 'North Los Angeles County Regional Center (NLACRC)',
    counties_served: 'los-angeles',
    catchment_boundaries: 'Serves San Fernando Valley, Santa Clarita Valley, and Antelope Valley.',
    website: 'https://www.nlacrc.org',
    intake_phone: '(818) 778-1900',
    early_start_contact: 'Phone: (818) 756-6218, Email: earlystart@nlacrc.org',
    lanterman_intake_contact: 'Phone: (818) 778-1900, Email: intake@nlacrc.org',
    eligibility_info_page: 'https://www.nlacrc.org/eligibility',
    services_page: 'https://www.nlacrc.org/services',
    appeals_info: 'https://www.nlacrc.org/appeals',
    frc_relationship: 'Partners with Family Focus Resource Center.',
    office_locations: '9200 Oakdale Ave, Suite 100, Chatsworth, CA 91311',
    languages: 'English, Spanish, Armenian, Russian, Farsi, Korean',
    last_verified_date: '2026-05-24',
    source_urls: 'https://www.nlacrc.org'
  },
  {
    id: 'orange-county',
    name: 'Regional Center of Orange County (RCOC)',
    counties_served: 'orange',
    catchment_boundaries: 'Serves all cities and regions of Orange County.',
    website: 'https://www.rcocdd.com',
    intake_phone: '(714) 796-5100',
    early_start_contact: 'Phone: (714) 796-5350, Email: earlystartintake@rcocdd.com',
    lanterman_intake_contact: 'Phone: (714) 796-5100, Email: intake@rcocdd.com',
    eligibility_info_page: 'https://www.rcocdd.com/eligibility',
    services_page: 'https://www.rcocdd.com/services',
    appeals_info: 'https://www.rcocdd.com/appeals-complaints',
    frc_relationship: 'Partners with Help Me Grow Orange County and Comfort Connection Family Resource Center.',
    office_locations: '1525 North Tustin Ave, Santa Ana, CA 92705',
    languages: 'English, Spanish, Vietnamese, Korean, Tagalog',
    last_verified_date: '2026-05-20',
    source_urls: 'https://www.rcocdd.com'
  },
  {
    id: 'redwood-coast',
    name: 'Redwood Coast Regional Center (RCRC)',
    counties_served: 'del-norte,humboldt,lake,mendocino',
    catchment_boundaries: 'Serves Del Norte, Humboldt, Lake, and Mendocino counties.',
    website: 'https://www.redwoodcoastrc.org',
    intake_phone: '(707) 445-0893',
    early_start_contact: 'Phone: (707) 445-0893, Email: earlystart@redwoodcoastrc.org',
    lanterman_intake_contact: 'Phone: (707) 445-0893, Email: intake@redwoodcoastrc.org',
    eligibility_info_page: 'https://www.redwoodcoastrc.org/eligibility',
    services_page: 'https://www.redwoodcoastrc.org/services',
    appeals_info: 'https://www.redwoodcoastrc.org/rights-appeals',
    frc_relationship: 'Partners with Redwood Empire Parent Training and Information.',
    office_locations: '525 2nd St, Suite 300, Eureka, CA 95501',
    languages: 'English, Spanish, Hmong',
    last_verified_date: '2026-05-08',
    source_urls: 'https://www.redwoodcoastrc.org'
  },
  {
    id: 'east-bay',
    name: 'Regional Center of the East Bay (RCEB)',
    counties_served: 'alameda,contra-costa',
    catchment_boundaries: 'Serves Alameda and Contra Costa counties.',
    website: 'https://www.rceb.org',
    intake_phone: '(510) 618-6100',
    early_start_contact: 'Phone: (510) 618-6195, Email: earlystartintake@rceb.org',
    lanterman_intake_contact: 'Phone: (510) 618-6100, Email: intake@rceb.org',
    eligibility_info_page: 'https://www.rceb.org/eligibility',
    services_page: 'https://www.rceb.org/services',
    appeals_info: 'https://www.rceb.org/appeals',
    frc_relationship: 'Partners with Family Resource Network (FRN) Alameda.',
    office_locations: '500 Davis St, Suite 100, San Leandro, CA 94577',
    languages: 'English, Spanish, Cantonese, Mandarin, Vietnamese, Farsi',
    last_verified_date: '2026-05-24',
    source_urls: 'https://www.rceb.org'
  },
  {
    id: 'san-andreas',
    name: 'San Andreas Regional Center (SARC)',
    counties_served: 'santa-clara,santa-cruz,san-benito,monterey',
    catchment_boundaries: 'Serves Santa Clara, Santa Cruz, San Benito, and Monterey counties.',
    website: 'https://www.sarc.org',
    intake_phone: '(408) 374-9960',
    early_start_contact: 'Phone: (408) 374-9960, Email: earlystart@sarc.org',
    lanterman_intake_contact: 'Phone: (408) 374-9960, Email: intake@sarc.org',
    eligibility_info_page: 'https://www.sarc.org/eligibility',
    services_page: 'https://www.sarc.org/services',
    appeals_info: 'https://www.sarc.org/rights-appeals',
    frc_relationship: 'Partners with PHP (Parents Helping Parents).',
    office_locations: '6203 San Ignacio Ave, San Jose, CA 95119',
    languages: 'English, Spanish, Vietnamese, Mandarin, Tagalog',
    last_verified_date: '2026-05-18',
    source_urls: 'https://www.sarc.org'
  },
  {
    id: 'san-diego',
    name: 'San Diego Regional Center (SDRC)',
    counties_served: 'san-diego,imperial',
    catchment_boundaries: 'Serves San Diego and Imperial counties.',
    website: 'https://www.sdrc.org',
    intake_phone: '(858) 576-2996',
    early_start_contact: 'Phone: (858) 576-2996, Email: earlystart@sdrc.org',
    lanterman_intake_contact: 'Phone: (858) 576-2996, Email: intake@sdrc.org',
    eligibility_info_page: 'https://www.sdrc.org/eligibility',
    services_page: 'https://www.sdrc.org/services',
    appeals_info: 'https://www.sdrc.org/appeals',
    frc_relationship: 'Partners with Exceptional Family Resource Center (EFRC).',
    office_locations: '4355 Ruffin Rd, Suite 200, San Diego, CA 92123',
    languages: 'English, Spanish, Tagalog, Vietnamese, Arabic',
    last_verified_date: '2026-05-24',
    source_urls: 'https://www.sdrc.org'
  },
  {
    id: 'san-gabriel-pomona',
    name: 'San Gabriel/Pomona Regional Center (SGPRC)',
    counties_served: 'los-angeles',
    catchment_boundaries: 'Serves Eastern LA County, Pomona, and San Gabriel Valleys.',
    website: 'https://www.sgprc.org',
    intake_phone: '(909) 620-7722',
    early_start_contact: 'Phone: (909) 620-7722, Email: earlystart@sgprc.org',
    lanterman_intake_contact: 'Phone: (909) 620-7722, Email: intake@sgprc.org',
    eligibility_info_page: 'https://www.sgprc.org/eligibility',
    services_page: 'https://www.sgprc.org/services',
    appeals_info: 'https://www.sgprc.org/appeals',
    frc_relationship: 'Partners with Parents Place Family Resource Center.',
    office_locations: '75 Rancho Camino Dr, Pomona, CA 91766',
    languages: 'English, Spanish, Mandarin, Cantonese, Korean, Tagalog',
    last_verified_date: '2026-05-18',
    source_urls: 'https://www.sgprc.org'
  },
  {
    id: 'south-central-la',
    name: 'South Central Los Angeles County Regional Center (SCLARC)',
    counties_served: 'los-angeles',
    catchment_boundaries: 'Serves South Los Angeles, Compton, Gardena, and Downey.',
    website: 'https://www.sclarc.org',
    intake_phone: '(213) 744-7000',
    early_start_contact: 'Phone: (213) 744-8848, Email: earlystart@sclarc.org',
    lanterman_intake_contact: 'Phone: (213) 744-7000, Email: intake@sclarc.org',
    eligibility_info_page: 'https://www.sclarc.org/eligibility',
    services_page: 'https://www.sclarc.org/services',
    appeals_info: 'https://www.sclarc.org/appeals',
    frc_relationship: 'Directly houses the SCLARC Family Resource Center.',
    office_locations: '2500 S Figueroa St, Los Angeles, CA 90007',
    languages: 'English, Spanish, Korean',
    last_verified_date: '2026-05-10',
    source_urls: 'https://www.sclarc.org'
  },
  {
    id: 'tri-counties',
    name: 'Tri-Counties Regional Center (TCRC)',
    counties_served: 'ventura,santa-barbara,san-luis-obispo',
    catchment_boundaries: 'Serves Ventura, Santa Barbara, and San Luis Obispo counties.',
    website: 'https://www.tri-counties.org',
    intake_phone: '(805) 962-7881',
    early_start_contact: 'Phone: (805) 962-7881, Email: earlystart@tri-counties.org',
    lanterman_intake_contact: 'Phone: (805) 962-7881, Email: intake@tri-counties.org',
    eligibility_info_page: 'https://www.tri-counties.org/eligibility',
    services_page: 'https://www.tri-counties.org/services',
    appeals_info: 'https://www.tri-counties.org/rights-appeals',
    frc_relationship: 'Partners with Rainbow Connection Family Resource Center.',
    office_locations: '520 E Montecito St, Santa Barbara, CA 93103',
    languages: 'English, Spanish, Mixteco',
    last_verified_date: '2026-05-24',
    source_urls: 'https://www.tri-counties.org'
  },
  {
    id: 'valley-mountain',
    name: 'Valley Mountain Regional Center (VMRC)',
    counties_served: 'san-joaquin,stanislaus,amador,calaveras,tuolumne',
    catchment_boundaries: 'Serves San Joaquin, Stanislaus, Amador, Calaveras, and Tuolumne counties.',
    website: 'https://www.vmrc.net',
    intake_phone: '(209) 473-0951',
    early_start_contact: 'Phone: (209) 955-3269, Email: earlystart@vmrc.net',
    lanterman_intake_contact: 'Phone: (209) 473-0951, Email: intake@vmrc.net',
    eligibility_info_page: 'https://www.vmrc.net/eligibility',
    services_page: 'https://www.vmrc.net/services',
    appeals_info: 'https://www.vmrc.net/appeals',
    frc_relationship: 'Partners with Family Resource Network (FRN) Stockton.',
    office_locations: '702 N Aurora St, Stockton, CA 95202',
    languages: 'English, Spanish, Hmong, Cambodian, Vietnamese',
    last_verified_date: '2026-05-18',
    source_urls: 'https://www.vmrc.net'
  },
  {
    id: 'westside',
    name: 'Westside Regional Center (WRC)',
    counties_served: 'los-angeles',
    catchment_boundaries: 'Serves West Los Angeles County including Santa Monica, Culver City, Beverly Hills, and Inglewood.',
    website: 'https://www.westsiderc.org',
    intake_phone: '(310) 258-4000',
    early_start_contact: 'Phone: (310) 258-4120, Email: earlystartintake@westsiderc.org',
    lanterman_intake_contact: 'Phone: (310) 258-4000, Email: intake@westsiderc.org',
    eligibility_info_page: 'https://www.westsiderc.org/eligibility',
    services_page: 'https://www.westsiderc.org/services',
    appeals_info: 'https://www.westsiderc.org/appeals-complaints',
    frc_relationship: 'Directly partners with the Westside Family Resource and Empowerment Center.',
    office_locations: '5901 Green Valley Cir, Culver City, CA 90230',
    languages: 'English, Spanish, Farsi, Korean, Japanese',
    last_verified_date: '2026-05-24',
    source_urls: 'https://www.westsiderc.org'
  }
];

const insertRC = db.prepare(`
  INSERT OR REPLACE INTO state_resource_agencies 
  (id, state_id, agency_type, name, counties_served, catchment_boundaries, website, intake_phone, early_intervention_contact, agency_intake_contact, eligibility_info_page, services_page, appeals_info, frc_relationship, office_locations, languages, last_verified_date, source_urls) 
  VALUES (?, 'california', 'regional_center', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertRcCounty = db.prepare('INSERT OR REPLACE INTO regional_center_counties (regional_center_id, county_id) VALUES (?, ?)');

// Seeding in a single transaction
const seedAllRCsTx = db.transaction((rcs) => {
  for (const rc of rcs) {
    insertRC.run(rc.id, rc.name, rc.counties_served, rc.catchment_boundaries, rc.website, rc.intake_phone, rc.early_start_contact, rc.lanterman_intake_contact, rc.eligibility_info_page, rc.services_page, rc.appeals_info, rc.frc_relationship, rc.office_locations, rc.languages, rc.last_verified_date, rc.source_urls);
    if (rc.counties_served) {
      const counties = rc.counties_served.split(',').map(c => c.trim()).filter(Boolean);
      for (const c of counties) {
        insertRcCounty.run(rc.id, c);
      }
    }
  }
});

try {
  seedAllRCsTx(allRegionalCenters);
  console.log(`🎉 SUCCESS: Ingested all ${allRegionalCenters.length} California Regional Centers & county mappings into SQL database!`);
} catch (err) {
  console.error('❌ Database insertion failed:', err.message);
} finally {
  db.close();
}
