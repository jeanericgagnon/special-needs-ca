import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourcePath = '/Users/ericgagnon/.gemini/antigravity/brain/57908cd7-dcbc-4ef8-a51f-935f0f816e35/.system_generated/steps/13653/content.md';

const content = fs.readFileSync(sourcePath, 'utf8');

// We want to find the table body
const tableRegex = /<table summary="" class="alt_row">([\s\S]*?)<\/table>/;
const match = content.match(tableRegex);
if (!match) {
  console.error("Could not find table in source content.");
  process.exit(1);
}

const tbody = match[1];
const trRegex = /<tr>([\s\S]*?)<\/tr>/g;
let trMatch;

const offices = [];

while ((trMatch = trRegex.exec(tbody)) !== null) {
  const rowContent = trMatch[1];
  
  // Extract td fields
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
  const tds = [];
  let tdMatch;
  while ((tdMatch = tdRegex.exec(rowContent)) !== null) {
    tds.push(tdMatch[1].trim());
  }
  
  if (tds.length >= 3) {
    // Column 0: County Name & Map link
    // e.g. <td id="albany"><strong>Albany</strong><br><a href="#top">Back to Map</a></td>
    // Column 1: Website
    // e.g. <a href="https://www.albanycounty.com/departments/social-services">Albany DSS</a>
    // Column 2: Address & Phone
    // e.g. 162 Washington Avenue, Albany, New York 12210, (518) 447-7492
    
    // Parse County Name
    const nameMatch = tds[0].match(/<strong>(.*?)<\/strong>/);
    if (!nameMatch) continue;
    const countyName = nameMatch[1].trim();
    
    // Parse URL
    const urlMatch = tds[1].match(/href="(.*?)"/);
    const url = urlMatch ? urlMatch[1].trim() : '';
    const agencyName = tds[1].replace(/<[^>]*>/g, '').trim();
    
    // Parse Address and Phone
    const addressPhone = tds[2].replace(/<[^>]*>/g, '').trim();
    
    // Phone number regex: e.g. (518) 447-7492 or 315-366-2211 or (585) 396-4060
    const phoneRegex = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
    const phoneMatch = addressPhone.match(phoneRegex);
    let phone = '';
    let address = addressPhone;
    
    if (phoneMatch) {
      phone = phoneMatch[1].trim();
      address = addressPhone.replace(phone, '').replace(/,\s*$/, '').replace(/,\s*,\s*/g, ', ').trim();
    }
    
    // Remove trailing commas or extra whitespace from address
    address = address.replace(/^,\s*|,$/g, '').trim();
    
    offices.push({
      rawCounty: countyName,
      agencyName,
      url,
      address,
      phone
    });
  }
}

console.log(`Parsed ${offices.length} offices from table.`);
console.log("Sample Parsed Offices:");
console.log(offices.slice(0, 5));
console.log("NYC office check:", offices.find(o => o.rawCounty.includes("New York City")));
