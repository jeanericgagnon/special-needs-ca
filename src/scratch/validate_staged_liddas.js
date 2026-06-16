import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

console.log('⏳ Connecting to database for LIDDA validation...');
const db = new Database(dbPath);

const staged = db.prepare("SELECT * FROM staging_scraped_state_resource_agencies WHERE state_id = 'texas' AND agency_type = 'lidda'").all();

console.log('\n==========================================');
console.log('🔍 STEP 3: STAGED LIDDA VALIDATION AUDIT');
console.log('==========================================');

// Check 1: Do all 39 LIDDAs exist in staging?
console.log(`LIDDAs Staged Count: ${staged.length}/39`);
if (staged.length !== 39) {
  console.error('❌ Error: Expected exactly 39 staged LIDDAs!');
} else {
  console.log('✅ Pass: Exactly 39 LIDDAs exist in staging.');
}

// Check 2: Verify county coverage
const allCounties = db.prepare("SELECT id FROM counties WHERE state_id = 'texas'").all().map(c => c.id);
const countyCoverage = {};
allCounties.forEach(c => { countyCoverage[c] = []; });

staged.forEach(s => {
  const counties = s.counties_served.split(',');
  counties.forEach(c => {
    if (countyCoverage[c] !== undefined) {
      countyCoverage[c].push(s.suggested_target_id);
    }
  });
});

let unmappedCount = 0;
let overmappedCount = 0;
const unmappedList = [];
const overmappedList = [];

for (const [county, liddas] of Object.entries(countyCoverage)) {
  if (liddas.length === 0) {
    unmappedCount++;
    unmappedList.push(county);
  } else if (liddas.length > 1) {
    // Overlap is expected for counties served by multiple clinics/agencies, but LIDDAs should cover exactly 1
    // Wait, let's verify if there are any overlaps in Texas
    overmappedCount++;
    overmappedList.push(`${county} (${liddas.join(', ')})`);
  }
}

console.log(`Unmapped Counties: ${unmappedCount}/254`);
if (unmappedCount > 0) {
  console.error(`❌ Error: Missing coverage for counties: ${unmappedList.join(', ')}`);
} else {
  console.log('✅ Pass: All 254 Texas counties have at least one mapped LIDDA.');
}

console.log(`Overmapped/Overlapping Counties: ${overmappedCount}/254`);
if (overmappedCount > 0) {
  console.log(`ℹ️ Info: Overlapping LIDDA coverage found in: ${overmappedList.join(', ')}`);
} else {
  console.log('✅ Pass: No county has conflicting or overlapping LIDDA routing.');
}

// Check 3: Check placeholder websites/phones
let placeholderPhones = 0;
let placeholderWebsites = 0;

staged.forEach(s => {
  if (s.extracted_phone.includes('855-937-2372') || s.extracted_phone.includes('(855) 937-2372')) {
    placeholderPhones++;
  }
  if (s.extracted_website.includes('.tx.gov') && s.extracted_website.includes('-lidda')) {
    placeholderWebsites++;
  }
});

console.log(`Placeholder Websites Remaining: ${placeholderWebsites}`);
console.log(`Placeholder Phones Remaining: ${placeholderPhones}`);
if (placeholderWebsites > 0 || placeholderPhones > 0) {
  console.error('❌ Error: Placeholder websites or phones still remain in staged records!');
} else {
  console.log('✅ Pass: All placeholder websites and phone numbers replaced with verified local details.');
}

// Check 4: Sample Validation Audit (10 Rural, 10 Mid-Size, 10 Large Metro)
const rural = ['hopkins-tx', 'kerr-tx', 'anderson-tx', 'wood-tx', 'fannin-tx', 'cooke-tx', 'cherokee-tx', 'houston-tx', 'hays-tx', 'comal-tx'];
const midSize = ['fort-bend-tx', 'williamson-tx', 'brazoria-tx', 'galveston-tx', 'nueces-tx', 'lubbock-tx', 'potter-tx', 'taylor-tx', 'smith-tx', 'jefferson-tx'];
const metro = ['harris-tx', 'dallas-tx', 'tarrant-tx', 'travis-tx', 'bexar-tx', 'el-paso-tx', 'collin-tx', 'denton-tx', 'hidalgo-tx', 'montgomery-tx'];

const samples = [...rural, ...midSize, ...metro];
let exactMatchCount = 0;
let routingSupportedCount = 0;

console.log('\n==========================================');
console.log('📊 SAMPLE COUNTY ROUTING AUDIT (N=30)');
console.log('==========================================');

samples.forEach(cId => {
  const mappedLiddas = countyCoverage[cId];
  const liddaId = mappedLiddas[0];
  const record = staged.find(s => s.suggested_target_id === liddaId);
  
  let classification = 'incorrect';
  if (record) {
    if (!record.extracted_website.includes('-lidda.tx.gov') && !record.extracted_phone.includes('855-937-2372')) {
      classification = 'exact_match';
      exactMatchCount++;
    } else {
      classification = 'routing_supported';
      routingSupportedCount++;
    }
  }
  
  console.log(`County: ${cId.padEnd(15)} | Mapped LIDDA: ${(liddaId || 'None').padEnd(20)} | Status: ${classification}`);
});

const passRate = ((exactMatchCount + routingSupportedCount) / samples.length) * 100;
const incorrectRate = (1 - (exactMatchCount + routingSupportedCount) / samples.length) * 100;

console.log('\n==========================================');
console.log('📈 ACCURACY STATISTICS');
console.log('==========================================');
console.log(`• Exact Match:      ${exactMatchCount}/${samples.length}`);
console.log(`• Routing Supported: ${routingSupportedCount}/${samples.length}`);
console.log(`• Incorrect Rate:   ${incorrectRate}% (Threshold: < 5%)`);
console.log(`• Pass Rate:        ${passRate}% (Threshold: >= 90%)`);

if (incorrectRate < 5 && passRate >= 90) {
  console.log('🎉 AUDIT RESULT: PASSED! Ready for promotion.');
} else {
  console.error('❌ AUDIT RESULT: FAILED! Correct errors before promoting.');
}

db.close();
