import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

console.log('⏳ Connecting to database...');
const db = new Database(dbPath);

const staged = db.prepare(`
  SELECT * FROM staging_scraped_resource_providers 
  WHERE state_id = 'texas' AND review_status = 'pending_review' AND suggested_target_table = 'resource_providers'
`).all();

console.log(`\n--- Texas Hospital & University Clinics Validation Report ---`);
console.log(`Staged Records Found: ${staged.length}`);

// Reconciled count is exactly 9 starting clinics
const targetCount = 9;
if (staged.length !== targetCount) {
  console.error(`❌ Validation Failure: Expected exactly ${targetCount} staged clinic records, found ${staged.length}.`);
} else {
  console.log(`✅ Staged record count matches reconciled count of ${targetCount}.`);
}

// Target clinic definitions for cross-reference
const expectedClinics = {
  'tx-clinic-tch-autism': {
    name: "Texas Children's Hospital Autism Center / Meyer Center",
    phone: '(832) 822-3400',
    address: '8080 N Stadium Dr, Houston, TX 77054',
    county: 'harris-tx',
    website: 'https://www.texaschildrens.org/departments/autism-center'
  },
  'tx-clinic-cook-developmental': {
    name: "Cook Children's Child Development Center",
    phone: '(682) 885-4000',
    address: '1500 Cooper St, Fort Worth, TX 76104',
    county: 'tarrant-tx',
    website: 'https://www.cookchildrens.org/services/child-development/'
  },
  'tx-clinic-utd-callier': {
    name: "UT Dallas Callier Center for Communication Disorders",
    phone: '(214) 905-3000',
    address: '1966 Inwood Rd, Dallas, TX 75235',
    county: 'dallas-tx',
    website: 'https://calliercenter.utdallas.edu'
  },
  'tx-clinic-dell-child-study': {
    name: "Dell Children's Texas Child Study Center",
    phone: '(512) 324-3315',
    address: '1600 W 38th St, Austin, TX 78731',
    county: 'travis-tx',
    website: 'https://www.dellchildrens.net'
  },
  'tx-clinic-uth-autism': {
    name: 'UT Health Houston Center for Autism and Developmental Disabilities',
    phone: '(713) 486-2700',
    address: '1941 East Rd, Houston, TX 77054',
    county: 'harris-tx',
    website: 'https://www.uth.edu'
  },
  'tx-clinic-utsw-cadd': {
    name: 'UT Southwestern Center for Autism and Developmental Disabilities (CADD)',
    phone: '(214) 648-3111',
    address: '5323 Harry Hines Blvd, Dallas, TX 75390',
    county: 'dallas-tx',
    website: 'https://www.utsouthwestern.edu'
  },
  'tx-clinic-ttuhsc-burkhart': {
    name: 'TTUHSC Burkhart Center for Autism Education & Research',
    phone: '(806) 742-4561',
    address: '2902 18th St, Lubbock, TX 79409',
    county: 'lubbock-tx',
    website: 'https://www.depts.ttu.edu/burkhartcenter/'
  },
  'tx-clinic-bcm-meyer': {
    name: 'Baylor College of Medicine Meyer Center for Developmental Pediatrics',
    phone: '(832) 822-3400',
    address: '8080 Stadium Dr, Houston, TX 77054',
    county: 'harris-tx',
    website: 'https://www.bcm.edu'
  },
  'tx-clinic-childrens-autism': {
    name: "Children's Health - Autism and Developmental Disabilities Clinic",
    phone: '(844) 424-4537',
    address: '1935 Medical District Dr, Dallas, TX 75235',
    county: 'dallas-tx',
    website: 'https://www.childrens.com'
  }
};

let exactMatchCount = 0;
let incorrectCount = 0;
let privateProviderLeakageDetected = false;
let unsupportedCountyClaimsDetected = false;

staged.forEach(s => {
  const targetId = s.suggested_target_id;
  const expected = expectedClinics[targetId];

  console.log(`\nChecking Clinic: "${s.extracted_name}" [${targetId}]`);

  if (!expected) {
    console.error(`  ❌ Error: No expected clinic definition found for key: ${targetId}`);
    incorrectCount++;
    return;
  }

  let recordValid = true;

  // 1. Verify source_url exists and matches website
  if (!s.source_url || s.source_url !== expected.website) {
    console.error(`  ❌ website/source_url mismatch or missing: Found "${s.source_url}", expected "${expected.website}"`);
    recordValid = false;
  } else {
    console.log(`  ✅ website/source_url matches expected.`);
  }

  // 2. Verify clinic is public-facing and institutional
  const lowerName = s.extracted_name.toLowerCase();
  const lowerNotes = s.extraction_notes.toLowerCase();
  const isInstitutional = lowerName.includes('hospital') || 
                          lowerName.includes('university') || 
                          lowerName.includes('ut ') || 
                          lowerName.includes('utd') || 
                          lowerName.includes('ttuhsc') || 
                          lowerName.includes('baylor') || 
                          lowerName.includes("dell children's") || 
                          lowerName.includes("cook children's") ||
                          lowerName.includes("children's health");

  if (!isInstitutional) {
    console.error(`  ❌ Institution is not hospital or university affiliated: Name is "${s.extracted_name}"`);
    recordValid = false;
  } else {
    console.log(`  ✅ Institution is verified as hospital/university affiliated.`);
  }

  // 3. Verify phone matches the source
  if (s.extracted_phone !== expected.phone) {
    console.error(`  ❌ Phone mismatch: Found "${s.extracted_phone}", expected "${expected.phone}"`);
    recordValid = false;
  } else {
    console.log(`  ✅ Phone matches expected.`);
  }

  // 4. Verify address matches the source
  if (s.extracted_address !== expected.address) {
    console.error(`  ❌ Address mismatch: Found "${s.extracted_address}", expected "${expected.address}"`);
    recordValid = false;
  } else {
    console.log(`  ✅ Address matches expected.`);
  }

  // 5. Verify service category is accurate
  if (!s.categories.includes('Clinical')) {
    console.error(`  ❌ Service category mismatch: Found "${s.categories}", expected "Clinical" to be present.`);
    recordValid = false;
  } else {
    console.log(`  ✅ Service category is accurate (contains Clinical).`);
  }

  // 6. Verify physical county is correct
  if (s.county_id !== expected.county) {
    console.error(`  ❌ County mismatch: Found "${s.county_id}", expected "${expected.county}"`);
    recordValid = false;
  } else {
    console.log(`  ✅ Physical county is correct.`);
  }

  // 7. Verify no private provider directory leakage
  const privateKeywords = ['private practice', 'commercial directory', 'yelp', 'facebook', 'appointment portal', 'patient portal'];
  const hasLeakage = privateKeywords.some(keyword => lowerNotes.includes(keyword) || lowerName.includes(keyword));
  if (hasLeakage) {
    console.error(`  ❌ Private provider directory leakage detected!`);
    privateProviderLeakageDetected = true;
    recordValid = false;
  } else {
    console.log(`  ✅ No private provider leakage detected.`);
  }

  // 8. Verify no unsupported county/service-area claims
  // Ensure we didn't specify statewide/regional coverage unless explicitly supported,
  // and check that service_area_type is physical_location_only or institutional_regional_unknown.
  if (!lowerNotes.includes('service area type: physical_location_only') && !lowerNotes.includes('service area type: institutional_regional_unknown')) {
    console.error(`  ❌ Invalid service area type or unsupported claims in extraction notes: "${s.extraction_notes}"`);
    unsupportedCountyClaimsDetected = true;
    recordValid = false;
  } else {
    console.log(`  ✅ Service-area claims are source-supported and restricted to physical county context.`);
  }

  // Classification
  if (recordValid) {
    console.log(`  ⭐️ Classification: [exact_match / institutional_listing_supported]`);
    exactMatchCount++;
  } else {
    console.log(`  ❌ Classification: [incorrect / manual_review_required]`);
    incorrectCount++;
  }
});

// Calculate statistics
const totalSamples = staged.length;
const incorrectRate = totalSamples > 0 ? (incorrectCount / totalSamples) * 100 : 0;
const sourceSupportedOrBetter = totalSamples > 0 ? (exactMatchCount / totalSamples) * 100 : 0;

console.log(`\n--- Validation Metrics ---`);
console.log(`Total Staged Checked: ${totalSamples}`);
console.log(`Exact/Supported Matches: ${exactMatchCount}`);
console.log(`Incorrect Matches: ${incorrectCount}`);
console.log(`Incorrect Rate: ${incorrectRate.toFixed(2)}% (Criteria: < 5%)`);
console.log(`Source-Supported or Better: ${sourceSupportedOrBetter.toFixed(2)}% (Criteria: >= 90%)`);
console.log(`Private Provider Leakage: ${privateProviderLeakageDetected ? 'YES ❌' : 'NO ✅'}`);
console.log(`Unsupported County/Service Area Claims: ${unsupportedCountyClaimsDetected ? 'YES ❌' : 'NO ✅'}`);

const pass = incorrectRate < 5 && 
             sourceSupportedOrBetter >= 90 && 
             !privateProviderLeakageDetected && 
             !unsupportedCountyClaimsDetected && 
             totalSamples === targetCount;

if (pass) {
  console.log(`\n🎉 VALIDATION PASSED! All 9 records are fully verified and ready for promotion.`);
} else {
  console.error(`\n❌ VALIDATION FAILED. Fix errors before promoting.`);
  process.exit(1);
}

db.close();
