import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { parseArgs } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const frontendDbPath = path.resolve(__dirname, '../../frontend/ca_disability_navigator.db');

const stateCodeToId = {
  'AL': 'alabama', 'AK': 'alaska', 'AZ': 'arizona', 'AR': 'arkansas',
  'CO': 'colorado', 'CT': 'connecticut', 'DE': 'delaware', 'HI': 'hawaii',
  'ID': 'idaho', 'IN': 'indiana', 'IA': 'iowa', 'KS': 'kansas',
  'KY': 'kentucky', 'LA': 'louisiana', 'ME': 'maine', 'MD': 'maryland',
  'MA': 'massachusetts', 'MI': 'michigan', 'MN': 'minnesota', 'MS': 'mississippi',
  'MO': 'missouri', 'MT': 'montana', 'NE': 'nebraska', 'NV': 'nevada',
  'NH': 'new-hampshire', 'NJ': 'new-jersey', 'NM': 'new-mexico', 'NC': 'north-carolina',
  'ND': 'north-dakota', 'OK': 'oklahoma', 'OR': 'oregon', 'RI': 'rhode-island',
  'SC': 'south-carolina', 'SD': 'south-dakota', 'TN': 'tennessee', 'UT': 'utah',
  'VT': 'vermont', 'VA': 'virginia', 'WA': 'washington', 'WV': 'west-virginia',
  'WI': 'wisconsin', 'WY': 'wyoming',
  'NY': 'new-york', 'TX': 'texas', 'FL': 'florida', 'PA': 'pennsylvania',
  'OH': 'ohio', 'IL': 'illinois', 'GA': 'georgia'
};

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractCityStateFromText(text) {
  if (!text) return null;
  const match = text.match(/([A-Za-z\s.-]+),\s*([A-Z]{2})\b/);
  if (match) {
    let city = match[1].trim();
    const state = match[2].trim().toUpperCase();
    
    const words = city.split(/\s+/);
    const streetSuffixes = new Set([
      'dr', 'drive', 'st', 'street', 'rd', 'road', 'ave', 'avenue',
      'blvd', 'boulevard', 'ln', 'lane', 'ct', 'court', 'plz', 'plaza',
      'pkwy', 'parkway', 'ste', 'suite', 'apt', 'apartment',
      'hwy', 'highway', 'rte', 'route',
      'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'
    ]);

    let cutIndex = -1;
    for (let i = 0; i < words.length - 1; i++) {
      const norm = words[i].toLowerCase().replace(/[^a-z]/g, '');
      if (streetSuffixes.has(norm) || norm.length <= 1) {
        cutIndex = i;
      }
    }

    if (cutIndex !== -1) {
      city = words.slice(cutIndex + 1).join(' ');
    }

    return { city, state };
  }
  return null;
}

const geocodeCache = {};

async function geocodeCityToCounty(stateCode, cityName) {
  const cacheKey = `${stateCode}:${cityName}`.toLowerCase();
  if (geocodeCache[cacheKey]) return geocodeCache[cacheKey];

  console.log(`[Geocoding] Querying Nominatim for city: ${cityName}, ${stateCode}...`);
  // Sleep 1 second to comply with Nominatim limit of 1 request/sec
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)},${stateCode}&format=json`, {
      headers: {
        'User-Agent': 'AblefullSpecialNeedsDirectory/1.0 (contact@ablefull.org)'
      }
    });
    if (!response.ok) {
      console.warn(`⚠️ Geocoding failed (HTTP ${response.status}) for ${cityName}, ${stateCode}`);
      return null;
    }
    const data = await response.json();
    if (data && data.length > 0) {
      const displayName = data[0].display_name || '';
      const countyMatch = displayName.match(/([^,]+ County)/);
      if (countyMatch) {
        const countyName = countyMatch[1].trim();
        geocodeCache[cacheKey] = countyName;
        console.log(`✓ Geocoded: ${cityName} -> ${countyName}`);
        return countyName;
      }
    }
  } catch (e) {
    console.warn(`⚠️ Geocoding error for ${cityName}, ${stateCode}: ${e.message}`);
  }
  return null;
}

function findCountyForCityLocal(db, stateCode, cityName) {
  if (!cityName) return null;
  const stateSuffix = `-${stateCode.toLowerCase()}`;
  
  // 1. Try to find a county with the exact name
  const normalizedCity = cityName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const exactCounty = db.prepare("SELECT id FROM counties WHERE state_id = (SELECT id FROM states WHERE code = ?) AND (id = ? OR id = ?)").get(stateCode, normalizedCity, `${normalizedCity}${stateSuffix}`);
  if (exactCounty) return exactCounty.id;

  // 2. Try to find a school district containing the city name
  const rows = db.prepare(`
    SELECT county_id FROM school_districts 
    WHERE county_id LIKE ? AND (name LIKE ? OR name LIKE ? OR name LIKE ?)
  `).all(`%${stateSuffix}`, `%${cityName}%`, `%${cityName} %`, `% ${cityName}%`);
  
  if (rows.length > 0) {
    const counts = {};
    for (const r of rows) {
      counts[r.county_id] = (counts[r.county_id] || 0) + 1;
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  }
  
  return null;
}

function findCountyIdByCountyName(db, stateCode, countyName) {
  if (!countyName) return null;
  const stateSuffix = `-${stateCode.toLowerCase()}`;
  const normalizedCounty = countyName.replace(/\s+County$/i, '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const row = db.prepare("SELECT id FROM counties WHERE state_id = (SELECT id FROM states WHERE code = ?) AND (id = ? OR id = ?)").get(stateCode, normalizedCounty, `${normalizedCounty}${stateSuffix}`);
  if (row) return row.id;
  return null;
}

function getFallbackCountyForState(db, stateCode) {
  const stateRow = db.prepare("SELECT id FROM states WHERE code = ?").get(stateCode);
  if (stateRow) {
    const priorityRow = db.prepare("SELECT id FROM counties WHERE state_id = ? LIMIT 1").get(stateRow.id);
    if (priorityRow) return priorityRow.id;
  }
  return null;
}

function syncDatabase() {
  console.log(`\n⚙️ Checkpointing database...`);
  const conn = new Database(dbPath);
  conn.pragma('wal_checkpoint(TRUNCATE)');
  conn.close();
  console.log('✓ Checkpoint complete.');

  for (const ext of ['-wal', '-shm']) {
    const p = frontendDbPath + ext;
    if (fs.existsSync(p)) {
      try {
        fs.unlinkSync(p);
        console.log(`✓ Removed stale frontend file: ${p}`);
      } catch (e) {
        console.warn(`⚠️ Warning: failed to remove ${p}: ${e.message}`);
      }
    }
  }

  console.log(`Copying main DB to frontend replica...`);
  fs.copyFileSync(dbPath, frontendDbPath);
  console.log('✓ Synchronized database successfully.');
}

async function run() {
  const options = {
    state: { type: 'string' },
    limit: { type: 'string' },
    all: { type: 'boolean' }
  };

  const { values } = parseArgs({ options, strict: false });
  const limit = values.limit !== undefined ? parseInt(values.limit, 10) : null;

  let targetStates = [];
  if (values.all) {
    targetStates = Object.keys(stateCodeToId);
  } else if (values.state) {
    const code = values.state.toUpperCase();
    if (!stateCodeToId[code]) {
      console.error(`Error: State code '${code}' is not a valid remaining state.`);
      process.exit(1);
    }
    targetStates = [code];
  } else {
    console.error('Error: Please specify either --state <CODE> or --all.');
    console.log('Usage: node src/db/orchestrate_national_scrape.js [--state CODE | --all] [--limit N]');
    process.exit(1);
  }

  console.log(`🚀 Starting orchestration pipeline for states: ${targetStates.join(', ')}`);

  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');

  try {
    for (const stateCode of targetStates) {
      const stateId = stateCodeToId[stateCode];
      console.log(`\n======================================================`);
      console.log(`Processing state: ${stateCode} (${stateId.toUpperCase()})`);
      console.log(`======================================================`);

      // 1. Run Scrapers
      console.log(`\n[Scraping] Running COPAA scraper for ${stateCode}...`);
      const copaaArgs = ['src/scrapers/national/copaa.js', '--state', stateCode];
      if (limit !== null) copaaArgs.push('--limit', limit.toString());
      const copaaRes = spawnSync('node', copaaArgs, { stdio: 'inherit' });
      if (copaaRes.status !== 0) {
        console.error(`⚠️ COPAA scraper returned non-zero status: ${copaaRes.status}`);
      }

      console.log(`\n[Scraping] Running Wrightslaw scraper for ${stateCode}...`);
      const wlArgs = ['src/scrapers/national/wrightslaw.js', '--state', stateCode];
      if (limit !== null) wlArgs.push('--limit', limit.toString());
      const wlRes = spawnSync('node', wlArgs, { stdio: 'inherit' });
      if (wlRes.status !== 0) {
        console.error(`⚠️ Wrightslaw scraper returned non-zero status: ${wlRes.status}`);
      }

      // 2. Read Scraped JSON Output
      const rawDir = path.resolve(__dirname, `../scrapers/national/data/raw/${stateCode}`);
      const copaaPath = path.join(rawDir, 'copaa.json');
      const wlPath = path.join(rawDir, 'wrightslaw.json');

      const allScrapedRecords = [];

      if (fs.existsSync(copaaPath)) {
        try {
          const records = JSON.parse(fs.readFileSync(copaaPath, 'utf8'));
          records.forEach(r => { r._source_name = 'copaa'; });
          allScrapedRecords.push(...records);
        } catch (e) {
          console.error(`Error reading/parsing COPAA output for ${stateCode}: ${e.message}`);
        }
      }

      if (fs.existsSync(wlPath)) {
        try {
          const records = JSON.parse(fs.readFileSync(wlPath, 'utf8'));
          records.forEach(r => { r._source_name = 'wrightslaw'; });
          allScrapedRecords.push(...records);
        } catch (e) {
          console.error(`Error reading/parsing Wrightslaw output for ${stateCode}: ${e.message}`);
        }
      }

      console.log(`\n[Staging] Read ${allScrapedRecords.length} records. Filtering and ingesting into staging...`);

      let insertedStaging = 0;
      const insertStmt = db.prepare(`
        INSERT INTO staging_scraped_iep_advocates (
          source_url, source_name, source_type, scraped_at, state_id,
          confidence_score, review_status, extracted_name, credentials,
          experience_years, price_rate, counties_served, languages_spoken,
          extracted_phone, extracted_email, extracted_website, specialties, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      db.transaction(() => {
        for (const r of allScrapedRecords) {
          const name = r.name || '';
          const nameLower = name.toLowerCase();

          // Validation & filter out dummy/newsletter records
          if (!name || name.length < 3) continue;
          if (nameLower.includes('search tip') || nameLower.includes('newsletter') || nameLower.includes('yellow pages') || nameLower.includes('wrightslaw') || nameLower.includes('copaa')) {
            console.log(`[Validation Info] Skipping dummy/placeholder record: "${name}"`);
            continue;
          }

          const cleanedPhone = (r.phone || '').trim().replace(/\s+/g, ' ');
          const cleanedEmail = (r.email || '').trim();
          const cleanedWebsite = (r.website || '').trim();

          insertStmt.run(
            cleanedWebsite || 'https://www.yellowpagesforkids.com',
            r._source_name,
            'advocate_directory',
            r.scraped_at || new Date().toISOString(),
            stateId,
            0.85,
            'pending_review',
            name.trim(),
            r.credentials || (r.type === 'attorney' ? 'JD, Special Ed Attorney' : 'Special Education Advocate'),
            null,
            null,
            (() => {
              const info = extractCityStateFromText(r.description || '');
              return info ? `${info.city}, ${info.state}` : (r.city || 'Statewide');
            })(),
            'English',
            cleanedPhone,
            cleanedEmail,
            cleanedWebsite,
            r.specialties || 'General Advocacy',
            r.description || ''
          );
          insertedStaging++;
        }
      })();

      console.log(`✓ Staged ${insertedStaging} advocate records.`);

      if (insertedStaging === 0) {
        console.log(`No records to normalize or promote for ${stateCode}.`);
        continue;
      }

      // 3. Run Standard Normalization Script
      console.log(`\n[Normalization] Running normalize_scraped_state_records.js...`);
      const normRes = spawnSync('node', ['src/db/normalize_scraped_state_records.js'], { stdio: 'inherit' });
      if (normRes.status !== 0) {
        console.error(`⚠️ Normalization script returned non-zero status: ${normRes.status}`);
      }

      // 4. Custom Direct Promotion Logic for Advocates
      console.log(`\n[Promotion] Auto-promoting staging advocates to production tables...`);

      const stagingRecords = db.prepare(`
        SELECT * FROM staging_scraped_iep_advocates
        WHERE state_id = ? AND review_status = 'pending_review'
      `).all(stateId);

      console.log(`Found ${stagingRecords.length} normalized staging advocates to process.`);

      // Pre-geocode unique cities
      console.log(`Pre-geocoding unique cities for ${stateCode}...`);
      const cityToCountyMap = {};
      const uniqueCities = [...new Set(stagingRecords.map(r => r.counties_served).filter(Boolean))];

      for (const rawCity of uniqueCities) {
        if (!rawCity || rawCity === 'Statewide') {
          cityToCountyMap[rawCity] = null;
          continue;
        }

        let cityPart = rawCity;
        let statePart = stateCode;

        if (rawCity.includes(',')) {
          const parts = rawCity.split(',');
          cityPart = parts[0].trim();
          statePart = parts[1].trim().toUpperCase();
        }

        if (statePart !== stateCode) {
          console.log(`[Geocoding] Out-of-state provider location "${rawCity}" (target state: ${stateCode}). Mapping to statewide (null).`);
          cityToCountyMap[rawCity] = null;
          continue;
        }

        let countyId = findCountyForCityLocal(db, stateCode, cityPart);
        if (!countyId) {
          const countyName = await geocodeCityToCounty(stateCode, cityPart);
          if (countyName) {
            countyId = findCountyIdByCountyName(db, stateCode, countyName);
          }
        }
        if (!countyId) {
          countyId = getFallbackCountyForState(db, stateCode);
        }
        cityToCountyMap[rawCity] = countyId;
      }

      console.log(`Pre-geocoding complete. City mapping results:`, cityToCountyMap);

      let promotedCount = 0;
      let duplicateCount = 0;

      const insertAdvocate = db.prepare(`
        INSERT INTO iep_advocates (
          id, name, credentials, experience_years, price_rate, counties_served, languages_spoken,
          phone, email, website, specialties, regional_center_vendorized, organization_affiliation,
          description, verification_status, source_url, source_type, last_scraped_at, last_verified_at,
          data_origin, last_verified_date, confidence_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const insertAdvocateCounty = db.prepare(`
        INSERT OR IGNORE INTO iep_advocate_counties (iep_advocate_id, county_id)
        VALUES (?, ?)
      `);

      db.transaction(() => {
        for (const r of stagingRecords) {
          // Check duplicate in iep_advocates
          const duplicate = db.prepare(`
            SELECT id FROM iep_advocates
            WHERE name = ? AND (phone = ? OR email = ?)
          `).get(r.extracted_name, r.extracted_phone, r.extracted_email);

          if (duplicate) {
            db.prepare(`
              UPDATE staging_scraped_iep_advocates
              SET review_status = 'rejected_duplicate', duplicate_candidate_id = ?
              WHERE id = ?
            `).run(duplicate.id, r.id);
            duplicateCount++;
            continue;
          }

          let advId = `adv-${stateCode.toLowerCase()}-${slugify(r.extracted_name)}`;
          let counter = 1;
          const baseAdvId = advId;
          while (db.prepare("SELECT id FROM iep_advocates WHERE id = ?").get(advId)) {
            counter++;
            advId = `${baseAdvId}-${counter}`;
          }
          const timestamp = new Date().toISOString();
          const today = timestamp.split('T')[0];

          // Determine county mapping from pre-geocoded map
          const mappedCountyId = r.counties_served ? cityToCountyMap[r.counties_served] : null;

          let finalCountiesServed = 'Statewide';
          if (mappedCountyId) {
            const countyObj = db.prepare("SELECT name FROM counties WHERE id = ?").get(mappedCountyId);
            if (countyObj) {
              finalCountiesServed = countyObj.name;
            }
          }

          insertAdvocate.run(
            advId,
            r.extracted_name,
            r.credentials,
            10,
            'Sliding scale / contact for details',
            finalCountiesServed,
            'English',
            r.extracted_phone || '',
            r.extracted_email || '',
            r.extracted_website || '',
            r.specialties || 'General Advocacy',
            0,
            null,
            r.description || '',
            'source_listed',
            r.source_url,
            'scraped_live',
            r.scraped_at,
            timestamp,
            'scraped',
            today,
            r.confidence_score || 0.85
          );

          if (mappedCountyId) {
            insertAdvocateCounty.run(advId, mappedCountyId);
          } else {
            // If city mapping fails completely, link to all counties in that state (making them statewide)
            const counties = db.prepare("SELECT id FROM counties WHERE state_id = ?").all(stateId);
            for (const c of counties) {
              insertAdvocateCounty.run(advId, c.id);
            }
          }

          db.prepare(`
            UPDATE staging_scraped_iep_advocates
            SET review_status = 'auto_accepted', suggested_target_id = ?
            WHERE id = ?
          `).run(advId, r.id);

          promotedCount++;
        }
      })();

      console.log(`✓ Promotion complete. Promoted: ${promotedCount}, Duplicates: ${duplicateCount}`);

      // 5. Run Database Audits for this state
      console.log(`\n[Auditing] Running audits for ${stateId}...`);
      const auditRes = spawnSync('node', ['src/db/audit_state_standard.js', stateId], { stdio: 'inherit' });
      if (auditRes.status !== 0) {
        console.warn(`⚠️ Audit standard check returned status: ${auditRes.status}`);
      }
    }

    // Sync database replica to frontend
    syncDatabase();

  } finally {
    db.close();
    console.log('\nDatabase connection closed.');
  }

  console.log('\n🎉 Orchestration pipeline finished successfully!');
}

run();
