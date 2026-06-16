import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = '/Users/ericgagnon/.gemini/antigravity/brain/57908cd7-dcbc-4ef8-a51f-935f0f816e35/.system_generated/steps/13773/content.md';
let content = fs.readFileSync(sourcePath, 'utf8');

// Replace any malformed tags
content = content.replace(/<\/td(?!>)/gi, '</td>');

// Parse counties outside NYC
// e.g. <h2>Albany County Department for Children, Youth and Families</h2>
// <address>112 State Street, 3rd Floor<br />Albany, New York 12207<br />Main: 518-447-4820<br />Fax: 518-447-4855</address>
const sectionRegex = /<h2>(.*?)<\/h2>\s*(?:<p>[\s\S]*?<\/p>\s*<ul[\s\S]*?<\/ul>\s*)?<address>([\s\S]*?)<\/address>/g;
let match;
const parsedCounties = [];

while ((match = sectionRegex.exec(content)) !== null) {
  const header = match[1].trim();
  const addressHtml = match[2].trim();
  
  if (header.includes("New York City")) {
    continue; // Will parse NYC boroughs separately below
  }
  
  // Extract county name from header (e.g. "Albany County Department..." -> "Albany")
  const countyName = header.replace(/\s+County.*/gi, '').replace(/\s+Public Health.*/gi, '').replace(/\s+Health Department.*/gi, '').trim();
  
  parsedCounties.push({
    countyName,
    header,
    addressHtml
  });
}

// Map county names to county IDs
const countyIdMap = {
  'st. lawrence': 'st-lawrence-ny',
  'st lawrence': 'st-lawrence-ny'
};

const records = [];

for (const pc of parsedCounties) {
  let slug = pc.countyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (slug === 'st-lawrence' || slug === 'saint-lawrence') {
    slug = 'st-lawrence';
  }
  const countyId = `${slug}-ny`;
  
  // Parse address details
  const addressText = pc.addressHtml.replace(/<br\s*\/?>/gi, ', ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  
  // Extract phone (e.g. Main: 518-447-4820)
  const phoneRegex = /(?:Main|Phone|Phone Number in NYC Dial 311):\s*(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
  const phoneMatch = addressText.match(phoneRegex);
  let phone = '';
  if (phoneMatch) {
    phone = phoneMatch[1].trim();
  } else {
    // Try generic phone match
    const genPhoneMatch = addressText.match(/(\d{3}-\d{3}-\d{4})/);
    if (genPhoneMatch) {
      phone = genPhoneMatch[1].trim();
    }
  }
  
  // Extract clean address (everything before "Main:" or "Phone:")
  const addressClean = addressText.split(/(?:Main|Phone|Fax):/i)[0].replace(/,\s*$/, '').trim();
  
  records.push({
    source_url: 'https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm',
    confidence_score: 9.5,
    notes: `Official NYS Department of Health Early Intervention contact for ${pc.countyName} County.`,
    suggested_target_id: `ny-ei-${countyId}`,
    name: pc.header,
    phone: phone,
    physical_county: countyId,
    agency_type: 'early_intervention',
    physical_address: addressClean,
    evidence_level: 'source_listed',
    verification_status: 'pending_review',
    data_origin: 'scraped'
  });
}

// Parse NYC Boroughs
// e.g. <h3>Bronx (Bronx County)</h3>
// <address>1309 Fulton Avenue, 5th Floor<br />Bronx, NY 10456<br />Phone: 718-838-6887</address>
const nycRegex = /<h3>(.*?)\s*\((.*?)\)<\/h3>\s*<address>([\s\S]*?)<\/address>/g;
let nycMatch;

const nycCounties = {
  'bronx county': 'bronx-ny',
  'kings county': 'kings-ny',
  'new york county': 'new-york-ny',
  'queens county': 'queens-ny',
  'richmond county': 'richmond-ny'
};

while ((nycMatch = nycRegex.exec(content)) !== null) {
  const borough = nycMatch[1].trim();
  const countyNameRaw = nycMatch[2].trim().toLowerCase();
  const addressHtml = nycMatch[3].trim();
  
  const countyId = nycCounties[countyNameRaw];
  if (!countyId) continue;
  
  const addressText = addressHtml.replace(/<br\s*\/?>/gi, ', ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const phoneRegex = /Phone:\s*(\d{3}-\d{3}-\d{4})/;
  const phoneMatch = addressText.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[1].trim() : '';
  const addressClean = addressText.split('Phone:')[0].replace(/,\s*$/, '').trim();
  
  records.push({
    source_url: 'https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm',
    confidence_score: 9.5,
    notes: `Official NYS Department of Health Early Intervention contact for NYC Borough: ${borough}.`,
    suggested_target_id: `ny-ei-${countyId}`,
    name: `NYC Early Intervention Program - ${borough} Office`,
    phone: phone,
    physical_county: countyId,
    agency_type: 'early_intervention',
    physical_address: addressClean,
    evidence_level: 'source_listed',
    verification_status: 'pending_review',
    data_origin: 'scraped'
  });
}

console.log(`Parsed ${records.length} Early Intervention county contacts.`);

const outputPath = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/new-york/phase_records/early_intervention.json';
fs.writeFileSync(outputPath, JSON.stringify(records, null, 2), 'utf8');
console.log(`✓ Wrote early_intervention.json to: ${outputPath}`);
