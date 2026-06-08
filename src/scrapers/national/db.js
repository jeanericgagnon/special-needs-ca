import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = process.env.DB_PATH || path.resolve(process.cwd(), 'national_special_needs.db');

export function initDb(db) {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS advocates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      state TEXT NOT NULL,
      city TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      specialties TEXT,
      organization TEXT,
      description TEXT,
      source TEXT,
      scraped_at TEXT
    );

    CREATE TABLE IF NOT EXISTS attorneys (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      state TEXT NOT NULL,
      city TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      specialties TEXT,
      organization TEXT,
      description TEXT,
      source TEXT,
      scraped_at TEXT
    );

    CREATE TABLE IF NOT EXISTS legal_decisions (
      id TEXT PRIMARY KEY,
      state TEXT NOT NULL,
      case_name TEXT NOT NULL,
      case_number TEXT,
      decision_date TEXT,
      summary TEXT,
      document_url TEXT,
      body_text TEXT,
      source TEXT,
      scraped_at TEXT
    );

    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      state TEXT NOT NULL,
      city TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      description TEXT,
      source TEXT,
      scraped_at TEXT
    );
  `);
}

function validateRecord(r, scraperName) {
  if (!r.id) return 'Missing id';
  if (!r.state) return 'Missing state';
  if (scraperName === 'justia') {
    if (!r.case_name) return 'Missing case_name';
  } else {
    if (!r.name) return 'Missing name';
  }
  return null;
}

function importFile(db, filePath, scraperName) {
  console.log(`Importing file: ${filePath}`);
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Failed to read file ${filePath}:`, error.message);
    return;
  }

  let records;
  try {
    records = JSON.parse(content);
  } catch (error) {
    // T2.F4.2: Malformed raw JSON syntax is caught; pipeline logs error and skips the file without crashing
    console.error(`Error parsing JSON in file ${filePath}:`, error.message);
    return;
  }

  if (!Array.isArray(records)) {
    console.error(`Invalid JSON content in ${filePath}: expected an array.`);
    return;
  }

  const insertAdvocate = db.prepare(`
    INSERT INTO advocates (id, name, state, city, phone, email, website, specialties, organization, description, source, scraped_at)
    VALUES ($id, $name, $state, $city, $phone, $email, $website, $specialties, $organization, $description, $source, $scraped_at)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      state = excluded.state,
      city = excluded.city,
      phone = excluded.phone,
      email = excluded.email,
      website = excluded.website,
      specialties = excluded.specialties,
      organization = excluded.organization,
      description = excluded.description,
      source = excluded.source,
      scraped_at = excluded.scraped_at;
  `);

  const insertAttorney = db.prepare(`
    INSERT INTO attorneys (id, name, state, city, phone, email, website, specialties, organization, description, source, scraped_at)
    VALUES ($id, $name, $state, $city, $phone, $email, $website, $specialties, $organization, $description, $source, $scraped_at)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      state = excluded.state,
      city = excluded.city,
      phone = excluded.phone,
      email = excluded.email,
      website = excluded.website,
      specialties = excluded.specialties,
      organization = excluded.organization,
      description = excluded.description,
      source = excluded.source,
      scraped_at = excluded.scraped_at;
  `);

  const insertDecision = db.prepare(`
    INSERT INTO legal_decisions (id, state, case_name, case_number, decision_date, summary, document_url, body_text, source, scraped_at)
    VALUES ($id, $state, $case_name, $case_number, $decision_date, $summary, $document_url, $body_text, $source, $scraped_at)
    ON CONFLICT(id) DO UPDATE SET
      state = excluded.state,
      case_name = excluded.case_name,
      case_number = excluded.case_number,
      decision_date = excluded.decision_date,
      summary = excluded.summary,
      document_url = excluded.document_url,
      body_text = excluded.body_text,
      source = excluded.source,
      scraped_at = excluded.scraped_at;
  `);

  const insertOrganization = db.prepare(`
    INSERT INTO organizations (id, name, state, city, phone, email, website, description, source, scraped_at)
    VALUES ($id, $name, $state, $city, $phone, $email, $website, $description, $source, $scraped_at)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      state = excluded.state,
      city = excluded.city,
      phone = excluded.phone,
      email = excluded.email,
      website = excluded.website,
      description = excluded.description,
      source = excluded.source,
      scraped_at = excluded.scraped_at;
  `);

  const tx = db.transaction((list) => {
    for (const r of list) {
      const validationError = validateRecord(r, scraperName);
      if (validationError) {
        console.warn(`[Validation Warning] Skipping record in ${filePath}: ${validationError}. Record: ${JSON.stringify(r)}`);
        continue;
      }

      try {
        if (scraperName === 'copaa') {
          insertAdvocate.run({
            id: r.id,
            name: r.name,
            state: r.state,
            city: r.city || null,
            phone: r.phone || null,
            email: r.email || null,
            website: r.website || null,
            specialties: r.specialties || null,
            organization: r.organization || null,
            description: r.description || null,
            source: r.source || 'copaa',
            scraped_at: r.scraped_at || new Date().toISOString()
          });
          if (r.organization_info) {
            insertOrganization.run({
              id: r.organization_info.id,
              name: r.organization_info.name,
              state: r.organization_info.state,
              city: r.organization_info.city || null,
              phone: r.organization_info.phone || null,
              email: r.organization_info.email || null,
              website: r.organization_info.website || null,
              description: r.organization_info.description || null,
              source: r.organization_info.source || 'copaa',
              scraped_at: r.organization_info.scraped_at || new Date().toISOString()
            });
          }
        } else if (scraperName === 'wrightslaw') {
          const isAttorney = r.type !== undefined && r.type !== null ? r.type === 'attorney' : (
            (r.description && r.description.toLowerCase().includes('attorney')) ||
            (r.credentials && r.credentials.toLowerCase().includes('attorney'))
          );
          const stmt = isAttorney ? insertAttorney : insertAdvocate;
          stmt.run({
            id: r.id,
            name: r.name,
            state: r.state,
            city: r.city || null,
            phone: r.phone || null,
            email: r.email || null,
            website: r.website || null,
            specialties: r.specialties || null,
            organization: r.organization || null,
            description: r.description || null,
            source: r.source || 'wrightslaw',
            scraped_at: r.scraped_at || new Date().toISOString()
          });
          if (r.organization_info) {
            insertOrganization.run({
              id: r.organization_info.id,
              name: r.organization_info.name,
              state: r.organization_info.state,
              city: r.organization_info.city || null,
              phone: r.organization_info.phone || null,
              email: r.organization_info.email || null,
              website: r.organization_info.website || null,
              description: r.organization_info.description || null,
              source: r.organization_info.source || 'wrightslaw',
              scraped_at: r.organization_info.scraped_at || new Date().toISOString()
            });
          }
        } else if (scraperName === 'justia') {
          insertDecision.run({
            id: r.id,
            state: r.state,
            case_name: r.case_name,
            case_number: r.case_number || null,
            decision_date: r.decision_date || null,
            summary: r.summary || null,
            document_url: r.document_url || null,
            body_text: r.body_text || null,
            source: r.source || 'justia',
            scraped_at: r.scraped_at || new Date().toISOString()
          });
        }
      } catch (dbError) {
        console.error(`[Database Error] Skipping insert of record ${r.id} due to error: ${dbError.message}`);
      }
    }
  });

  try {
    tx(records);
    console.log(`Successfully imported ${records.length} records from ${filePath}`);
  } catch (error) {
    console.error(`Failed to commit transaction for ${filePath}:`, error.message);
  }
}

export function runPipeline() {
  console.log(`Connecting to database at ${dbPath}...`);
  const db = new Database(dbPath);
  try {
    initDb(db);

    const rawDir = process.env.RAW_DIR || path.resolve(process.cwd(), 'src/scrapers/national/data/raw');
    if (!fs.existsSync(rawDir)) {
      console.log(`Raw directory ${rawDir} does not exist. Skipping import.`);
      return;
    }

    // Traverse raw folders: raw/{STATE}/{scraper}.json
    const states = fs.readdirSync(rawDir);
    for (const state of states) {
      const statePath = path.join(rawDir, state);
      if (!fs.statSync(statePath).isDirectory()) continue;

      const files = fs.readdirSync(statePath);
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const scraperName = file.replace('.json', '');
        const filePath = path.join(statePath, file);
        importFile(db, filePath, scraperName);
      }
    }
  } finally {
    db.close();
    console.log('Database connection closed.');
  }
  console.log('Database pipeline import finished.');
}

// Check if run directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] && (process.argv[1].endsWith('db.js') || process.argv[1].endsWith('db'))) {
  runPipeline();
}
