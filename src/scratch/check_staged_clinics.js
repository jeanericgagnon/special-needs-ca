import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

const db = new Database(dbPath);

const rows = db.prepare("SELECT * FROM staging_scraped_resource_providers WHERE state_id = 'texas'").all();
console.log('Staged count:', rows.length);
rows.forEach(r => {
  console.log(`- ${r.extracted_name} (${r.county_id}) | type: ${r.source_type} | website: ${r.source_url} | phone: ${r.extracted_phone} | address: ${r.extracted_address}`);
});

db.close();
