import Database from 'better-sqlite3';
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../frontend/ca_disability_navigator.db');
const db = new Database(dbPath);

// Convert county name lists (e.g. "Amador, Calaveras, San Joaquin") to slugs
function parseCountiesServed(text) {
  let cleaned = text.replace(/\(\d{4}\)/g, ''); // Strip year parentheticals like (2022)
  
  if (cleaned.toLowerCase().includes('los angeles') || cleaned.toLowerCase().includes('los-angeles')) {
    return 'los-angeles';
  }
  if (cleaned.toLowerCase().includes('all') && cleaned.length < 10) {
    return 'all';
  }
  
  const parts = cleaned.split(/[,&]/);
  const slugs = parts
    .map(p => p.trim().toLowerCase())
    .filter(Boolean)
    .map(p => p.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    .filter(slug => slug !== 'and' && slug !== 'empowerment');
    
  return slugs.join(',');
}

async function run() {
  console.log("Starting California Family Empowerment Centers (FEC) Ingestion (Playwright)...");
  const url = 'https://www.californiafamilyempowermentcenters.org/overview.html';
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles'
  });
  const page = await context.newPage();
  
  console.log(`Fetching FEC directory from: ${url}`);
  let html = '';
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1000);
    html = await page.content();
  } catch (err) {
    console.error(`Failed to fetch page. Error: ${err.message}`);
    await browser.close();
    process.exit(1);
  }
  await browser.close();
  
  const trRegex = /<tr>([\s\S]*?)<\/tr>/gi;
  const records = [];
  
  let match;
  while ((match = trRegex.exec(html)) !== null) {
    const trContent = match[1];
    const tds = [];
    let tdMatch;
    const tdRegexLocal = /<td>([\s\S]*?)<\/td>/gi;
    
    while ((tdMatch = tdRegexLocal.exec(trContent)) !== null) {
      tds.push(tdMatch[1]);
    }
    
    if (tds.length === 2) {
      const contactCell = tds[0];
      const countiesCell = tds[1];
      
      // Skip headers, global CDE reference, or Seeds reference
      if (
        contactCell.includes('class="tableHeader"') || 
        contactCell.includes('Organization and Contact Info') ||
        contactCell.includes('California Department of Education') || 
        contactCell.includes('Seeds of Partnership')
      ) {
        continue;
      }
      
      // Extract organization name
      let name = '';
      const bLinkMatch = contactCell.match(/<b>\s*<a[^>]*>([\s\S]*?)<\/a>\s*<\/b>/i);
      if (bLinkMatch) {
        name = bLinkMatch[1];
      } else {
        const bMatch = contactCell.match(/<b>([\s\S]*?)<\/b>/i);
        if (bMatch) {
          name = bMatch[1];
        }
      }
      
      if (!name) continue;
      name = name
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&mdash;/g, '—')
        .replace(/&bull;/g, '•')
        .trim();
        
      // Extract phone
      const phoneRegex = /\b\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
      const phoneMatch = contactCell.match(phoneRegex);
      const phone = phoneMatch ? phoneMatch[0] : 'None Listed';
      
      // Extract website
      let website = '';
      const websiteMatch = contactCell.match(/website:\s*([^\s<]+)/i);
      if (websiteMatch) {
        website = websiteMatch[1].trim();
      } else {
        const hrefMatch = contactCell.match(/href="([^"]+)"/i);
        if (hrefMatch && !hrefMatch[1].includes('spotlight-') && !hrefMatch[1].includes('cde.ca.gov')) {
          website = hrefMatch[1];
        }
      }
      
      website = website.replace(/[.,;]$/, '').trim();
      if (website && !website.startsWith('http')) {
        website = 'https://' + website;
      }
      if (!website) {
        website = 'https://www.californiafamilyempowermentcenters.org';
      }
      
      // Extract email (fallback to seeds if none)
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
      const emailMatch = contactCell.match(emailRegex);
      const email = emailMatch ? emailMatch[0] : 'seeds@scoe.net';
      
      // Counties served
      const countiesServed = parseCountiesServed(countiesCell);
      
      // Scan for specialties
      const combinedText = name.toLowerCase() + ' ' + contactCell.toLowerCase() + ' ' + countiesCell.toLowerCase();
      const specs = [];
      if (combinedText.includes('autism') || combinedText.includes('asd') || combinedText.includes('spectrum')) specs.push('Autism');
      if (combinedText.includes('down syndrome') || combinedText.includes('down\'s') || combinedText.includes('trisomy')) specs.push('Down Syndrome');
      if (combinedText.includes('hearing') || combinedText.includes('deaf') || combinedText.includes('hard of hearing') || combinedText.includes('auditory')) specs.push('Hearing Loss');
      if (combinedText.includes('vision') || combinedText.includes('blind') || combinedText.includes('visual')) specs.push('Vision Impairment');
      if (combinedText.includes('speech') || combinedText.includes('language') || combinedText.includes('apraxia')) specs.push('Speech & Language');
      if (combinedText.includes('behavior') || combinedText.includes('bcba') || combinedText.includes('aba')) specs.push('Behavioral Needs');
      if (combinedText.includes('cerebral palsy') || combinedText.includes('spastic')) specs.push('Cerebral Palsy');
      if (combinedText.includes('epilepsy') || combinedText.includes('seizure')) specs.push('Epilepsy');
      if (combinedText.includes('spina bifida')) specs.push('Spina Bifida');
      if (combinedText.includes('muscular dystrophy')) specs.push('Muscular Dystrophy');
      if (combinedText.includes('intellectual disability') || combinedText.includes('cognitive delay') || combinedText.includes('developmental delay')) specs.push('Intellectual Disability');
      if (combinedText.includes('emotional disturbance') || combinedText.includes('mental health') || combinedText.includes('anxiety')) specs.push('Emotional Disturbance');
      if (combinedText.includes('learning') || combinedText.includes('dyslexia') || combinedText.includes('dysgraphia')) specs.push('Learning Disabilities');
      
      specs.push('General Advocacy');
      specs.push('IEP Navigation');
      const specialties = Array.from(new Set(specs)).join(', ');

      const record = {
        id: 'fec-' + name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 15),
        name,
        credentials: 'Family Empowerment Center (FEC) Advocate',
        experience_years: 20, // established organization standard
        price_rate: 'Free / CDE-Funded',
        counties_served: countiesServed,
        languages_spoken: contactCell.toLowerCase().includes('español') || name.toLowerCase().includes('parents place') || name.toLowerCase().includes('warmline') ? 'English, Spanish' : 'English',
        phone,
        email,
        website,
        specialties,
        regional_center_vendorized: 0,
        organization_affiliation: name,
        description: contactCell.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      };
      
      records.push(record);
    }
  }
  
  console.log(`Parsed ${records.length} FEC records. Merging into iep_advocates table...`);
  
  const insertStmt = db.prepare(`
    INSERT INTO iep_advocates 
      (id, name, credentials, experience_years, price_rate, counties_served, languages_spoken, phone, email, website, specialties, regional_center_vendorized, organization_affiliation, description)
    VALUES 
      ($id, $name, $credentials, $experience_years, $price_rate, $counties_served, $languages_spoken, $phone, $email, $website, $specialties, $regional_center_vendorized, $organization_affiliation, $description)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      credentials = excluded.credentials,
      counties_served = excluded.counties_served,
      phone = excluded.phone,
      email = excluded.email,
      website = excluded.website,
      specialties = excluded.specialties,
      regional_center_vendorized = excluded.regional_center_vendorized,
      organization_affiliation = excluded.organization_affiliation,
      description = excluded.description
  `);
  
  const transaction = db.transaction((recs) => {
    for (const r of recs) {
      insertStmt.run(r);
    }
  });
  
  transaction(records);
  console.log(`Successfully synced ${records.length} FEC centers into the database.`);
  db.close();
}

run().catch(err => {
  console.error("Fatal error during FEC ingestion:", err);
  db.close();
  process.exit(1);
});
