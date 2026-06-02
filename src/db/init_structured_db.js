import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_crawler.db');
const db = new Database(dbPath);

console.log(`Initializing structured_programs table in: ${dbPath}`);

db.exec(`
  CREATE TABLE IF NOT EXISTS structured_programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    program_name TEXT NOT NULL,
    target_demographic TEXT,
    age_limit_min INTEGER,
    age_limit_max INTEGER,
    income_limit TEXT,
    diagnosis_required TEXT, -- JSON array string
    county_specific TEXT,
    extracted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(source_url) REFERENCES raw_scraped_pages(url)
  );
  
  CREATE INDEX IF NOT EXISTS idx_program_name ON structured_programs(program_name);
`);

console.log("Structured table initialized successfully.");
db.close();
