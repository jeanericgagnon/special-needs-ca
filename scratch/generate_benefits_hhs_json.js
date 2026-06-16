import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = '/Users/ericgagnon/.gemini/antigravity/brain/57908cd7-dcbc-4ef8-a51f-935f0f816e35/.system_generated/steps/13653/content.md';
let content = fs.readFileSync(sourcePath, 'utf8');

// Sanitize malformed HTML tag </td in the source
content = content.replace(/<\/td(?!>)/gi, '</td>');

const tableRegex = /<table summary="" class="alt_row">([\s\S]*?)<\/table>/;
const match = content.match(tableRegex);
if (!match) {
  console.error("Could not find table.");
  process.exit(1);
}

const tbody = match[1];
const trRegex = /<tr>([\s\S]*?)<\/tr>/g;
let trMatch;

const rawOffices = [];
while ((trMatch = trRegex.exec(tbody)) !== null) {
  const rowContent = trMatch[1];
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
  const tds = [];
  let tdMatch;
  while ((tdMatch = tdRegex.exec(rowContent)) !== null) {
    tds.push(tdMatch[1].trim());
  }
  
  if (tds.length >= 3) {
    const nameMatch = tds[0].match(/<strong>(.*?)<\/strong>/);
    if (!nameMatch) continue;
    const countyName = nameMatch[1].trim();
    
    const urlMatch = tds[1].match(/href="(.*?)"/);
    const url = urlMatch ? urlMatch[1].trim() : '';
    const agencyName = tds[1].replace(/<[^>]*>/g, '').trim();
    
    const addressPhone = tds[2].replace(/<[^>]*>/g, '').trim();
    const phoneRegex = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
    const phoneMatch = addressPhone.match(phoneRegex);
    let phone = '';
    let address = addressPhone;
    
    if (phoneMatch) {
      phone = phoneMatch[1].trim();
      address = addressPhone.replace(phone, '').trim();
    }
    
    // Clean trailing commas and spaces
    address = address.replace(/^,\s*|,$/g, '').replace(/,\s*,\s*/g, ', ').trim();
    
    rawOffices.push({
      countyName,
      agencyName,
      url,
      address,
      phone
    });
  }
}

// 12 Curated/protected counties to skip
const curatedCounties = new Set([
  'albany-ny', 'bronx-ny', 'erie-ny', 'kings-ny', 'monroe-ny', 'nassau-ny',
  'new-york-ny', 'onondaga-ny', 'queens-ny', 'richmond-ny', 'suffolk-ny', 'westchester-ny'
]);

const records = [];

for (const raw of rawOffices) {
  let countySlug = raw.countyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  if (countySlug === 'saint-lawrence') {
    countySlug = 'st-lawrence';
  } else if (countySlug === 'new-york-city') {
    continue; // NYC is skipped as its boroughs are curated seeds
  }
  
  const countyId = `${countySlug}-ny`;
  
  // If this is one of the curated/protected counties, skip it
  if (curatedCounties.has(countyId)) {
    console.log(`Skipping curated/protected county: ${countyId}`);
    continue;
  }
  
  const record = {
    source_url: 'https://www.health.ny.gov/health_care/medicaid/ldss.htm',
    office_type: 'official_locator',
    physical_county: countyId,
    confidence_score: 9.5,
    notes: `Official NYS Department of Health LDSS entry for ${raw.countyName} County.`,
    suggested_target_id: `off-${countyId}-medicaid`,
    name: raw.agencyName,
    phone: raw.phone,
    extracted_phone: raw.phone,
    physical_address: raw.address,
    extracted_address: raw.address,
    evidence_level: 'source_listed',
    verification_status: 'pending_review',
    data_origin: 'scraped'
  };
  
  records.push(record);
}

console.log(`Generated ${records.length} JSON records (target 50).`);

const outputPath = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/new-york/phase_records/benefits_hhs.json';
fs.writeFileSync(outputPath, JSON.stringify(records, null, 2), 'utf8');
console.log(`✓ Wrote benefits_hhs.json to: ${outputPath}`);
