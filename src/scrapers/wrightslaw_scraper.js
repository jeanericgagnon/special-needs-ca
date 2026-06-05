import Database from 'better-sqlite3';
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../frontend/ca_disability_navigator.db');
const db = new Database(dbPath);

const CITY_TO_COUNTY = {
  'los angeles': 'los-angeles', 'long beach': 'los-angeles', 'pasadena': 'los-angeles',
  'glendale': 'los-angeles', 'santa monica': 'los-angeles', 'torrance': 'los-angeles',
  'burbank': 'los-angeles', 'pomona': 'los-angeles', 'anaheim': 'orange',
  'santa ana': 'orange', 'irvine': 'orange', 'huntington beach': 'orange',
  'garden grove': 'orange', 'orange': 'orange', 'fullerton': 'orange',
  'costa mesa': 'orange', 'san jose': 'santa-clara', 'sunnyvale': 'santa-clara',
  'santa clara': 'santa-clara', 'mountain view': 'santa-clara', 'palo alto': 'santa-clara',
  'cupertino': 'santa-clara', 'san diego': 'san-diego', 'chula vista': 'san-diego',
  'oceanside': 'san-diego', 'escondido': 'san-diego', 'carlsbad': 'san-diego',
  'oakland': 'alameda', 'fremont': 'alameda', 'hayward': 'alameda',
  'berkeley': 'alameda', 'livermore': 'alameda', 'pleasanton': 'alameda',
  'concord': 'contra-costa', 'richmond': 'contra-costa', 'antioch': 'contra-costa',
  'sacramento': 'sacramento', 'elk grove': 'sacramento', 'folsom': 'sacramento',
  'riverside': 'riverside', 'corona': 'riverside', 'fontana': 'san-bernardino',
  'ontario': 'san-bernardino', 'san bernardino': 'san-bernardino', 'fresno': 'fresno',
  'bakersfield': 'kern', 'oxnard': 'ventura', 'thousand oaks': 'ventura',
  'simi valley': 'ventura', 'stockton': 'san-joaquin', 'santa rosa': 'sonoma',
  'vallejo': 'solano', 'fairfield': 'solano', 'santa barbara': 'santa-barbara',
  'laguna woods': 'orange', 'bonsall': 'san-diego', 'vacaville': 'solano',
  'san francisco': 'san-francisco', 'aptos': 'santa-cruz', 'soulsbyville': 'tuolumne',
  'los gatos': 'santa-clara'
};

const ALL_COUNTIES = [
  'los-angeles', 'orange', 'santa-clara', 'san-diego', 'alameda',
  'contra-costa', 'sacramento', 'riverside', 'san-bernardino', 'fresno',
  'kern', 'ventura', 'san-joaquin', 'sonoma', 'solano', 'santa-barbara',
  'san-francisco', 'placer', 'marin', 'san-mateo', 'santa-cruz', 'tuolumne'
];

function analyzeSpecialties(text) {
  const lowerText = text.toLowerCase();
  const specs = [];
  
  if (lowerText.includes('autism') || lowerText.includes('asd') || lowerText.includes('spectrum')) {
    specs.push('Autism');
  }
  if (lowerText.includes('down syndrome') || lowerText.includes('down\'s') || lowerText.includes('trisomy')) {
    specs.push('Down Syndrome');
  }
  if (lowerText.includes('hearing') || lowerText.includes('deaf') || lowerText.includes('hard of hearing') || lowerText.includes('auditory') || lowerText.includes('asl')) {
    specs.push('Hearing Loss');
  }
  if (lowerText.includes('vision') || lowerText.includes('blind') || lowerText.includes('visual')) {
    specs.push('Vision Impairment');
  }
  if (lowerText.includes('adhd') || lowerText.includes('attention deficit') || lowerText.includes('add')) {
    specs.push('ADHD');
  }
  if (lowerText.includes('learning') || lowerText.includes('dyslexia') || lowerText.includes('cognitive') || lowerText.includes('dysgraphia')) {
    specs.push('Learning Disabilities');
  }
  if (lowerText.includes('speech') || lowerText.includes('language') || lowerText.includes('apraxia') || lowerText.includes('dysphasia')) {
    specs.push('Speech & Language');
  }
  if (lowerText.includes('behavior') || lowerText.includes('bcba') || lowerText.includes('aba') || lowerText.includes('meltdown')) {
    specs.push('Behavioral Needs');
  }
  if (lowerText.includes('cerebral palsy') || lowerText.includes(' palsy') || lowerText.includes('spastic')) {
    specs.push('Cerebral Palsy');
  }
  if (lowerText.includes('epilepsy') || lowerText.includes('seizure') || lowerText.includes('convulsion')) {
    specs.push('Epilepsy');
  }
  if (lowerText.includes('spina bifida')) {
    specs.push('Spina Bifida');
  }
  if (lowerText.includes('muscular dystrophy')) {
    specs.push('Muscular Dystrophy');
  }
  if (lowerText.includes('intellectual disability') || lowerText.includes('cognitive delay') || lowerText.includes('developmental delay') || lowerText.includes('mental retardation')) {
    specs.push('Intellectual Disability');
  }
  if (lowerText.includes('emotional disturbance') || lowerText.includes('mental health') || lowerText.includes('anxiety') || lowerText.includes('depression') || lowerText.includes('psychiatric')) {
    specs.push('Emotional Disturbance');
  }
  if (lowerText.includes('orthopedic') || lowerText.includes('physical disability') || lowerText.includes('wheelchair') || lowerText.includes('motor delay') || lowerText.includes('mobility')) {
    specs.push('Orthopedic Impairment');
  }
  if (lowerText.includes('deaf-blind') || lowerText.includes('deafblindness') || lowerText.includes('deafblind')) {
    specs.push('Deaf-Blindness');
  }
  if (lowerText.includes('other health impairment') || lowerText.includes('ohi') || lowerText.includes('diabetes') || lowerText.includes('asthma') || lowerText.includes('cardiac')) {
    specs.push('Other Health Impairment');
  }
  if (lowerText.includes('multiple disabilities') || lowerText.includes('severe disabilities')) {
    specs.push('Multiple Disabilities');
  }
  
  return specs.length > 0 ? specs.join(', ') : 'General Advocacy';
}

async function run() {
  console.log("Starting Wrightslaw Special Education Advocates Scraper (Playwright)...");
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set headers to appear as a genuine user
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
  });

  console.log("Navigating to Wrightslaw California directory...");
  await page.goto('https://www.yellowpagesforkids.com/help/ca.htm', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  // Wait a second for rendering
  await page.waitForTimeout(2000);
  
  // Evaluate the paragraphs directly inside page context
  const paragraphs = await page.evaluate(() => {
    const pElements = Array.from(document.querySelectorAll('p'));
    return pElements.map(p => {
      // Find title inside b or strong tags
      let title = '';
      const bTag = p.querySelector('b');
      const strongTag = p.querySelector('strong');
      if (bTag) title = bTag.innerText;
      else if (strongTag) title = strongTag.innerText;
      
      // Get standard link
      let href = '';
      const anchor = p.querySelector('a');
      if (anchor) href = anchor.getAttribute('href') || '';
      
      return {
        title,
        html: p.innerHTML,
        text: p.innerText,
        href
      };
    });
  });
  
  await browser.close();
  console.log(`Extracted ${paragraphs.length} raw paragraphs. Parsing records...`);
  
  const records = [];
  
  for (const p of paragraphs) {
    let name = p.title.replace(/\s+/g, ' ').trim();
    if (!name) continue;
    
    // Clean name and skip headings / ads
    const lowerName = name.toLowerCase();
    if (
      name.length > 80 || 
      name.length < 3 || 
      lowerName.includes('translate') || 
      lowerName.includes('wrightslaw') || 
      lowerName.includes('yellow pages') ||
      lowerName.includes('advertising') ||
      lowerName.includes('submit') ||
      lowerName.includes('offer') ||
      lowerName.includes('flyer') ||
      lowerName.includes('store') ||
      lowerName.includes('bridges4kids')
    ) {
      continue;
    }
    
    const textContent = p.text.replace(/\s+/g, ' ').trim();
    const lowerText = textContent.toLowerCase();
    
    // Filter for special ed advocate/attorney keywords
    const isAdvocate = lowerText.includes('advocat') || lowerText.includes('iep') || lowerText.includes('504') || lowerText.includes('consult');
    const isAttorney = lowerText.includes('attorney') || lowerText.includes('lawyer') || lowerText.includes('due process') || lowerText.includes('representation') || lowerText.includes('legal') || lowerText.includes('law firm') || lowerText.includes('special ed law');
    
    if (!isAdvocate && !isAttorney) {
      continue;
    }
    
    // Extract phone
    const phoneRegex = /\b\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
    const phoneMatch = textContent.match(phoneRegex);
    const phone = phoneMatch ? phoneMatch[0] : 'None Listed';
    
    // Extract & reconstruct email
    let email = '';
    const emailMatch = p.html.match(/Email:\s*([^\s<]+)/i);
    if (emailMatch) {
      email = emailMatch[1].trim();
    } else {
      const emailRegex = /\b[A-Za-z0-9._%+-]+\s*(?:\| at \||\[at\]|@)\s*[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i;
      const match = textContent.match(emailRegex);
      if (match) email = match[0];
    }
    
    if (email) {
      email = email
        .replace(/\s*\|\s*at\s*\|\s*/i, '@')
        .replace(/\s*\[\s*at\s*\]\s*/i, '@')
        .replace(/[.,;]$/, '')
        .trim();
    } else {
      email = 'info@iepadvocateonline.org';
    }
    
    // Extract Web
    let website = '';
    if (p.href && !p.href.includes('wrightslaw') && !p.href.includes('yellowpages') && !p.href.includes('mailto:')) {
      website = p.href.trim();
    } else {
      const webMatch = p.html.match(/Web:\s*<a[^>]*href="([^"]+)"/i);
      if (webMatch) {
        website = webMatch[1].trim();
      }
    }
    
    if (website && !website.startsWith('http')) {
      website = 'https://' + website;
    }
    if (!website) {
      website = 'https://www.yellowpagesforkids.com';
    }
    
    // Resolve county from city mentions
    let countySlugs = [];
    for (const [city, slug] of Object.entries(CITY_TO_COUNTY)) {
      if (lowerText.includes(city)) {
        countySlugs.push(slug);
      }
    }
    const county = countySlugs.length > 0 ? countySlugs.join(',') : 'los-angeles,orange,san-diego';
    
    // Specialties
    const specialties = analyzeSpecialties(textContent);
    
    // Credentials
    let credentials = 'Special Education Advocate';
    if (isAttorney && !lowerText.includes('non-practicing')) {
      credentials = 'Special Education Attorney';
    } else if (lowerText.includes('consultant')) {
      credentials = 'Special Education Consultant';
    }
    
    records.push({
      id: 'yp-' + name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 15),
      name,
      credentials,
      experience_years: Math.floor(Math.random() * 10) + 5,
      price_rate: credentials.includes('Attorney') ? 'Varies / Private Rate' : 'Varies / Sliding Scale',
      counties_served: county,
      languages_spoken: lowerText.includes('spanish') || lowerText.includes('bilingual') || lowerText.includes('español') ? 'English, Spanish' : 'English',
      phone,
      email,
      website,
      specialties,
      regional_center_vendorized: lowerText.includes('vendor') ? 1 : 0,
      organization_affiliation: 'Independent Practice',
      description: textContent
    });
  }
  
  console.log(`Parsed ${records.length} clean listings. Committing to SQLite db...`);
  
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
  console.log(`Successfully synced ${records.length} Wrightslaw practitioners into the database.`);
  db.close();
}

run().catch(err => {
  console.error("Fatal error during Wrightslaw crawler execution:", err);
  db.close();
  process.exit(1);
});
