import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../../../ca_disability_navigator.db');

const args = process.argv.slice(2);
let stateArg = '';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--state' && i + 1 < args.length) {
    stateArg = args[i + 1].toLowerCase();
  }
}

if (stateArg !== 'texas') {
  console.error('❌ Error: This script is only for --state texas');
  process.exit(1);
}

console.log('⏳ Connecting to database...');
const db = new Database(dbPath);

console.log('⏳ Cleaning up old staged Texas clinics...');
db.prepare("DELETE FROM staging_scraped_resource_providers WHERE county_id LIKE '%-tx'").run();

// 9 starting clinics definition
const clinics = [
  {
    id: 'tx-clinic-tch-autism',
    name: "Texas Children's Hospital Autism Center / Meyer Center",
    website: 'https://www.texaschildrens.org/departments/autism-center',
    phone: '(832) 822-3400',
    address: '8080 N Stadium Dr, Houston, TX 77054',
    city: 'Houston',
    county: 'harris-tx',
    categories: 'Clinical,Therapy,Autism',
    subtype: "children's hospital autism / developmental clinic",
    service_area_type: 'institutional_regional_unknown',
    notes: 'Primary diagnostic and therapy center in Houston.'
  },
  {
    id: 'tx-clinic-cook-developmental',
    name: "Cook Children's Child Development Center",
    website: 'https://www.cookchildrens.org/services/child-development/',
    phone: '(682) 885-4000',
    address: '1500 Cooper St, Fort Worth, TX 76104',
    city: 'Fort Worth',
    county: 'tarrant-tx',
    categories: 'Clinical,Therapy,Developmental',
    subtype: "children's hospital developmental pediatrics clinic",
    service_area_type: 'institutional_regional_unknown',
    notes: 'Comprehensive neurodevelopmental diagnostic services in North Texas.'
  },
  {
    id: 'tx-clinic-utd-callier',
    name: "UT Dallas Callier Center for Communication Disorders",
    website: 'https://calliercenter.utdallas.edu',
    phone: '(214) 905-3000',
    address: '1966 Inwood Rd, Dallas, TX 75235',
    city: 'Dallas',
    county: 'dallas-tx',
    categories: 'Clinical,Therapy,Speech',
    subtype: 'university communication disorders / speech clinic',
    service_area_type: 'physical_location_only',
    notes: 'Speech-language pathology and hearing diagnostics.'
  },
  {
    id: 'tx-clinic-dell-child-study',
    name: "Dell Children's Texas Child Study Center",
    website: 'https://www.dellchildrens.net',
    phone: '(512) 324-3315',
    address: '1600 W 38th St, Austin, TX 78731',
    city: 'Austin',
    county: 'travis-tx',
    categories: 'Clinical,Therapy,Developmental',
    subtype: "children's hospital mental health & child study center",
    service_area_type: 'physical_location_only',
    notes: 'Collaborative pediatric psychology and diagnostics.'
  },
  {
    id: 'tx-clinic-uth-autism',
    name: 'UT Health Houston Center for Autism and Developmental Disabilities',
    website: 'https://www.uth.edu',
    phone: '(713) 486-2700',
    address: '1941 East Rd, Houston, TX 77054',
    city: 'Houston',
    county: 'harris-tx',
    categories: 'Clinical,Autism',
    subtype: 'university autism clinic',
    service_area_type: 'physical_location_only',
    notes: 'Interdisciplinary diagnostics and behavior therapies.'
  },
  {
    id: 'tx-clinic-utsw-cadd',
    name: 'UT Southwestern Center for Autism and Developmental Disabilities (CADD)',
    website: 'https://www.utsouthwestern.edu',
    phone: '(214) 648-3111',
    address: '5323 Harry Hines Blvd, Dallas, TX 75390',
    city: 'Dallas',
    county: 'dallas-tx',
    categories: 'Clinical,Autism,Developmental',
    subtype: 'university autism & developmental clinic',
    service_area_type: 'institutional_regional_unknown',
    notes: 'UT Southwestern / Children\'s Health medical clinic.'
  },
  {
    id: 'tx-clinic-ttuhsc-burkhart',
    name: 'TTUHSC Burkhart Center for Autism Education & Research',
    website: 'https://www.depts.ttu.edu/burkhartcenter/',
    phone: '(806) 742-4561',
    address: '2902 18th St, Lubbock, TX 79409',
    city: 'Lubbock',
    county: 'lubbock-tx',
    categories: 'Clinical,Autism,Education',
    subtype: 'university autism education & research clinic',
    service_area_type: 'institutional_regional_unknown',
    notes: 'Serves Lubbock and West Texas regions.'
  },
  {
    id: 'tx-clinic-bcm-meyer',
    name: 'Baylor College of Medicine Meyer Center for Developmental Pediatrics',
    website: 'https://www.bcm.edu',
    phone: '(832) 822-3400',
    address: '8080 Stadium Dr, Houston, TX 77054',
    city: 'Houston',
    county: 'harris-tx',
    categories: 'Clinical,Developmental',
    subtype: 'university developmental pediatrics clinic',
    service_area_type: 'institutional_regional_unknown',
    notes: 'Specializes in developmental delays and cerebral palsy diagnoses.'
  },
  {
    id: 'tx-clinic-childrens-autism',
    name: "Children's Health - Autism and Developmental Disabilities Clinic",
    website: 'https://www.childrens.com',
    phone: '(844) 424-4537',
    address: '1935 Medical District Dr, Dallas, TX 75235',
    city: 'Dallas',
    county: 'dallas-tx',
    categories: 'Clinical,Autism',
    subtype: "children's hospital autism clinic",
    service_area_type: 'physical_location_only',
    notes: 'Diagnostics and therapy programs for children.'
  }
];

const insertStaged = db.prepare(`
  INSERT INTO staging_scraped_resource_providers (
    source_url, source_name, source_type, scraped_at, state_id, county_id, confidence_score,
    extraction_notes, raw_text_excerpt, suggested_target_table, suggested_target_id, review_status,
    extracted_name, categories, extracted_phone, extracted_address, accepts_medi_cal, evidence_level
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
`);

let stagedCount = 0;
const timestamp = new Date().toISOString();

try {
  db.transaction(() => {
    clinics.forEach(c => {
      // Format phone number
      const digits = c.phone.replace(/\D/g, '');
      const cleanPhone = `(${digits.substring(0,3)}) ${digits.substring(3,6)}-${digits.substring(6)}`;

      const rawTextExcerpt = `Name: ${c.name}
Phone: ${cleanPhone}
Website: ${c.website}
Address: ${c.address}
City: ${c.city}
County: ${c.county}
Subtype: ${c.subtype}
Service Area Type: ${c.service_area_type}
Categories: ${c.categories}`;

      const extractionNotes = `Physical Address: ${c.address}. City: ${c.city}. Physical County: ${c.county}. Service Area Type: ${c.service_area_type}. Subtype: ${c.subtype}.`;

      insertStaged.run(
        c.website,
        'Texas Institutional Clinical Directory',
        'hospital_university_directory', // maps to data_origin
        timestamp,
        'texas',
        c.county,
        0.90, // confidence score for official direct listing
        extractionNotes,
        rawTextExcerpt,
        'resource_providers',
        c.id,
        'pending_review',
        c.name,
        c.categories,
        cleanPhone,
        c.address,
        'hospital_or_university_listing' // evidence_level
      );
      stagedCount++;
    });
  })();
  console.log(`✓ Successfully staged ${stagedCount} hospital and university clinic records.`);
} catch (err) {
  console.error('❌ Staging transaction failed:', err.message);
  process.exit(1);
} finally {
  db.close();
}
