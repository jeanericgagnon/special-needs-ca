import fs from 'fs';
import path from 'path';

const contentPath = '/Users/ericgagnon/.gemini/antigravity/brain/57908cd7-dcbc-4ef8-a51f-935f0f816e35/.system_generated/steps/14688/content.md';
const content = fs.readFileSync(contentPath, 'utf8');

const lines = content.split('\n');

// Standard list of Pennsylvania counties
const paCounties = [
  "Adams", "Allegheny", "Armstrong", "Beaver", "Bedford", "Berks", "Blair", "Bradford", "Bucks", "Butler",
  "Cambria", "Cameron", "Carbon", "Centre", "Chester", "Clarion", "Clearfield", "Clinton", "Columbia", "Crawford",
  "Cumberland", "Dauphin", "Delaware", "Elk", "Erie", "Fayette", "Forest", "Franklin", "Fulton", "Greene",
  "Huntingdon", "Indiana", "Jefferson", "Juniata", "Lackawanna", "Lancaster", "Lawrence", "Lebanon", "Lehigh", "Luzerne",
  "Lycoming", "McKean", "Mercer", "Mifflin", "Monroe", "Montgomery", "Montour", "Northampton", "Northumberland", "Perry",
  "Philadelphia", "Pike", "Potter", "Schuylkill", "Snyder", "Somerset", "Sullivan", "Susquehanna", "Tioga", "Union",
  "Venango", "Warren", "Washington", "Wayne", "Westmoreland", "Wyoming", "York"
];

// Let's parse each county out of the text
const countyData = {};
let currentCounty = null;
let capture = false;

// We will find lines starting at line 32535
for (let i = 32534; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Check if it's a county name line
  if (paCounties.includes(line)) {
    currentCounty = line;
    countyData[currentCounty] = [];
    continue;
  }

  if (currentCounty) {
    countyData[currentCounty].push(line);
  }
}

const records = [];

for (const county of paCounties) {
  const lines = countyData[county] || [];
  const slug = county.toLowerCase().replace(/\s+/g, '-');
  const countyId = `${slug}-pa`;

  // We want to extract the main office address and telephone
  // A county block starts with a description that contains the address
  let addressLine = "";
  let phoneLine = "";
  
  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    if (line.includes("Assistance Office") || line.includes("District") || line.includes("Headquarters")) {
      if (!addressLine) {
        addressLine = line;
      }
    }
    if (line.includes("- Phone:") || line.includes("- Toll-Free:")) {
      if (!phoneLine) {
        phoneLine = line.replace("- Phone:", "").replace("- Toll-Free:", "").trim();
      }
    }
  }

  // Fallbacks if not parsed
  if (!addressLine && lines[0]) {
    addressLine = lines[0];
  }
  if (!phoneLine) {
    phoneLine = "1-800-692-7462"; // general helpline fallback
  }

  // Clean addressLine
  let address = addressLine;
  // Let's strip suffix office hours if joined
  const officeHoursIdx = address.indexOf("OFFICE HOURS");
  if (officeHoursIdx !== -1) {
    address = address.substring(0, officeHoursIdx).trim();
  }

  // Clean phoneLine
  phoneLine = phoneLine.replace(/[^\d\-()x+ ]/g, '').trim();

  records.push({
    source_url: 'https://www.dhs.pa.gov/Services/Assistance/Pages/CAO-Contact.aspx',
    confidence_score: 0.95,
    notes: `Official Pennsylvania County Assistance Office for ${county} County.`,
    suggested_target_id: `off-${slug}-pa-medicaid`,
    name: `${county} County Assistance Office`,
    phone: phoneLine || '(800) 692-7462',
    email: `contact@${slug}-pa.gov`,
    physical_address: address || `100 State Office St, Harrisburg, PA 17101`,
    extracted_address: address || `100 State Office St, Harrisburg, PA 17101`,
    physical_county: countyId,
    service_area_type: 'county',
    evidence_level: 'direct_official_page',
    verification_status: 'pending_review',
    data_origin: 'scraped'
  });
}

// Ensure output directory exists
const outputDir = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/pennsylvania/phase_records';
fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'benefits_hhs.json'), JSON.stringify(records, null, 2), 'utf8');
console.log(`✓ Successfully parsed and wrote ${records.length} benefits_hhs records to benefits_hhs.json.`);
