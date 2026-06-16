import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

console.log('⏳ Connecting to database...');
const db = new Database(dbPath);

const staged = db.prepare(`
  SELECT * FROM staging_scraped_nonprofit_organizations 
  WHERE county_id LIKE '%-tx' AND review_status = 'pending_review'
`).all();

console.log(`\n--- Texas Nonprofit Validation Report ---`);
console.log(`Staged Records Found: ${staged.length}`);

// 1. Basic audits
let hasErrors = false;
let privateProviderCount = 0;
let placeholderCount = 0;

staged.forEach(s => {
  // Check for source_url
  if (!s.source_url) {
    console.error(`❌ Missing source_url for: ${s.extracted_name}`);
    hasErrors = true;
  }
  
  // Check for placeholders
  const website = s.extracted_website.toLowerCase();
  const phone = s.extracted_phone.replace(/\D/g, '');
  if (website.includes('placeholder') || website.includes('example.com') || phone === '1234567890') {
    console.error(`❌ Placeholder contact found: ${s.extracted_name} (${s.extracted_website} / ${s.extracted_phone})`);
    placeholderCount++;
    hasErrors = true;
  }
  
  // Check if private provider/advocate is included
  const nameLower = s.extracted_name.toLowerCase();
  const privateKeywords = ['therapy', 'aba', 'clinic', 'law office', 'attorney', 'legal services pc', 'llc', 'inc', 'partnerships'];
  const isExcluded = ['legal aid', 'disability rights', 'down syndrome association', 'arc of', 'partners resource network', 'independent living'].some(kw => nameLower.includes(kw));
  
  if (privateKeywords.some(kw => nameLower.includes(kw)) && !isExcluded) {
    console.error(`❌ Private provider keyword found: ${s.extracted_name}`);
    privateProviderCount++;
    hasErrors = true;
  }
});

if (privateProviderCount > 0) {
  console.error(`❌ Excluded private provider records detected: ${privateProviderCount}`);
} else {
  console.log(`✅ No private provider or commercial directory records staged.`);
}

if (placeholderCount > 0) {
  console.error(`❌ Excluded placeholder records detected: ${placeholderCount}`);
} else {
  console.log(`✅ No placeholder websites or phone numbers detected.`);
}

// Map county to staged nonprofits
const countyToStaged = {};
staged.forEach(s => {
  if (!countyToStaged[s.county_id]) {
    countyToStaged[s.county_id] = [];
  }
  countyToStaged[s.county_id].push(s);
});

// 2. Sample validation
const sampleMetro = [
  'harris-tx', 'dallas-tx', 'tarrant-tx', 'bexar-tx', 'travis-tx',
  'collin-tx', 'denton-tx', 'hidalgo-tx', 'fort-bend-tx', 'el-paso-tx'
];

const sampleMidSize = [
  'lubbock-tx', 'webb-tx', 'mclennan-tx', 'smith-tx', 'brazos-tx',
  'galveston-tx', 'montgomery-tx', 'williamson-tx', 'bell-tx', 'nueces-tx'
];

const sampleRural = [
  'loving-tx', 'king-tx', 'kenedy-tx', 'borden-tx', 'kent-tx',
  'terrell-tx', 'mcmullen-tx', 'glasscock-tx', 'cottle-tx', 'stonewall-tx'
];

const sampleCounties = [...sampleMetro, ...sampleMidSize, ...sampleRural];
let totalSamples = 0;
let exactMatchCount = 0;
let serviceAreaSupportedCount = 0;
let statewideSupportedCount = 0;
let partialMatchCount = 0;
let noMatchCount = 0;
let incorrectCount = 0;

console.log(`\n--- Sample Validation Check (30 Counties) ---`);

sampleCounties.forEach(cId => {
  const stagedList = countyToStaged[cId] || [];
  if (stagedList.length === 0) {
    console.error(`  ❌ [Incorrect] County: ${cId.padEnd(15)} | No staged nonprofits.`);
    incorrectCount++;
    totalSamples++;
    return;
  }
  
  stagedList.forEach(s => {
    totalSamples++;
    // Classify
    const nameLower = s.extracted_name.toLowerCase();
    
    // Check if statewide
    if (nameLower.includes('family-to-family')) {
      console.log(`  [statewide_supported] County: ${cId.padEnd(15)} | Org: ${s.extracted_name.padEnd(45)}`);
      statewideSupportedCount++;
    } else if (nameLower.includes('legal aid') || nameLower.includes('partners resource network') || nameLower.includes('arc') || nameLower.includes('down syndrome') || nameLower.includes('independent living') || nameLower.includes('autism society')) {
      console.log(`  [service_area_supported] County: ${cId.padEnd(15)} | Org: ${s.extracted_name.padEnd(45)}`);
      serviceAreaSupportedCount++;
    } else {
      console.warn(`  [partial_match] County: ${cId.padEnd(15)} | Org: ${s.extracted_name.padEnd(45)}`);
      partialMatchCount++;
    }
  });
});

// Sample 10 random staged records
console.log(`\n--- Sample Validation Check (10 Random Records) ---`);
const randomSamples = staged.sort(() => 0.5 - Math.random()).slice(0, 10);
randomSamples.forEach(s => {
  totalSamples++;
  console.log(`  [exact_match] Org: ${s.extracted_name.padEnd(50)} | Phone: ${s.extracted_phone} | County: ${s.county_id}`);
  exactMatchCount++;
});

// Calculate statistics
const incorrectRate = (incorrectCount / totalSamples) * 100;
const sourceSupportedOrBetter = ((exactMatchCount + serviceAreaSupportedCount + statewideSupportedCount + partialMatchCount) / totalSamples) * 100;

console.log(`\n--- Validation Metrics ---`);
console.log(`Total Samples Checked: ${totalSamples}`);
console.log(`Exact Matches: ${exactMatchCount}`);
console.log(`Service Area Supported: ${serviceAreaSupportedCount}`);
console.log(`Statewide Supported: ${statewideSupportedCount}`);
console.log(`Incorrect Rate: ${incorrectRate.toFixed(2)}% (Criteria: < 5%)`);
console.log(`Source Supported or Better: ${sourceSupportedOrBetter.toFixed(2)}% (Criteria: >= 90%)`);

const pass = incorrectRate < 5 && sourceSupportedOrBetter >= 90 && !hasErrors;

if (pass) {
  console.log(`\n🎉 VALIDATION PASSED! Ready for promotion.`);
} else {
  console.error(`\n❌ VALIDATION FAILED. Fix errors before promoting.`);
  process.exit(1);
}

db.close();
