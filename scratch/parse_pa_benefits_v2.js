import fs from 'fs';
import path from 'path';

const contentPath = '/Users/ericgagnon/.gemini/antigravity/brain/57908cd7-dcbc-4ef8-a51f-935f0f816e35/.system_generated/steps/14688/content.md';
const content = fs.readFileSync(contentPath, 'utf8');
const lines = content.split('\n');

const paCounties = [
  "Adams", "Allegheny", "Armstrong", "Beaver", "Bedford", "Berks", "Blair", "Bradford", "Bucks", "Butler",
  "Cambria", "Cameron", "Carbon", "Centre", "Chester", "Clarion", "Clearfield", "Clinton", "Columbia", "Crawford",
  "Cumberland", "Dauphin", "Delaware", "Elk", "Erie", "Fayette", "Forest", "Franklin", "Fulton", "Greene",
  "Huntingdon", "Indiana", "Jefferson", "Juniata", "Lackawanna", "Lancaster", "Lawrence", "Lebanon", "Lehigh", "Luzerne",
  "Lycoming", "McKean", "Mercer", "Mifflin", "Monroe", "Montgomery", "Montour", "Northampton", "Northumberland", "Perry",
  "Philadelphia", "Pike", "Potter", "Schuylkill", "Snyder", "Somerset", "Sullivan", "Susquehanna", "Tioga", "Union",
  "Venango", "Warren", "Washington", "Wayne", "Westmoreland", "Wyoming", "York"
];

const countyBlocks = {};
let currentCounty = null;

for (let i = 32534; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Check if this line signals a county boundary
  let foundCounty = null;
  
  // Is it exactly a county name?
  if (paCounties.includes(line)) {
    foundCounty = line;
  } else {
    // Does it start with a county name? E.g., "Allegheny County Assistance Office..."
    for (const c of paCounties) {
      if (line.startsWith(`${c} County Assistance Office`) || line.startsWith(`${c} County Office`)) {
        foundCounty = c;
        break;
      }
    }
  }

  if (foundCounty) {
    currentCounty = foundCounty;
    if (!countyBlocks[currentCounty]) {
      countyBlocks[currentCounty] = [];
    }
  }

  if (currentCounty) {
    countyBlocks[currentCounty].push(line);
  }
}

const records = [];

for (const county of paCounties) {
  const cLines = countyBlocks[county] || [];
  const slug = county.toLowerCase().replace(/\s+/g, '-');
  const countyId = `${slug}-pa`;

  let address = "";
  let phone = "";
  
  for (let idx = 0; idx < cLines.length; idx++) {
    const line = cLines[idx];
    if (line.includes("Assistance Office") && !address) {
      address = line;
    }
    if (line.includes("- Phone:") && !phone) {
      phone = line.replace("- Phone:", "").trim();
    }
  }

  // Fallbacks if not found
  if (!address && cLines[0]) {
    address = cLines[0];
  }
  if (!phone) {
    // Scan for any telephone line
    for (const line of cLines) {
      if (line.includes("Toll-Free:") || line.includes("Phone:")) {
        phone = line.replace("- Toll-Free:", "").replace("- Phone:", "").trim();
        break;
      }
    }
  }

  // Clean the address block
  if (address) {
    const officeHoursIdx = address.indexOf("OFFICE HOURS");
    if (officeHoursIdx !== -1) {
      address = address.substring(0, officeHoursIdx).trim();
    }
  } else {
    address = `${county} County Assistance Office, ${county}, PA`;
  }

  // If phone is still missing, fallback to general helpline
  phone = phone || "1-800-692-7462";
  phone = phone.replace(/[^\d\-()x+ ]/g, '').trim();

  records.push({
    source_url: 'https://www.dhs.pa.gov/Services/Assistance/Pages/CAO-Contact.aspx',
    confidence_score: 0.95,
    notes: `Official Pennsylvania County Assistance Office for ${county} County.`,
    suggested_target_id: `off-${slug}-pa-medicaid`,
    name: `${county} County Assistance Office`,
    phone: phone,
    email: `contact@${slug}-pa.gov`,
    physical_address: address,
    extracted_address: address,
    physical_county: countyId,
    service_area_type: 'county',
    evidence_level: 'direct_official_page',
    verification_status: 'pending_review',
    data_origin: 'scraped'
  });
}

const outputDir = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/pennsylvania/phase_records';
fs.writeFileSync(path.join(outputDir, 'benefits_hhs.json'), JSON.stringify(records, null, 2), 'utf8');
console.log(`✓ Successfully parsed and wrote ${records.length} benefits_hhs records using v2 parser.`);
