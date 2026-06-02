import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_crawler.db');
const db = new Database(dbPath);

console.log(`Initializing crawler database at: ${dbPath}`);

db.exec(`
  CREATE TABLE IF NOT EXISTS raw_scraped_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    domain TEXT NOT NULL,
    title TEXT,
    raw_text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX IF NOT EXISTS idx_domain ON raw_scraped_pages(domain);
`);

console.log("Database initialized successfully.");
db.close();
