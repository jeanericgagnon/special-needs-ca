import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

const scCounties = [
  'Abbeville', 'Aiken', 'Allendale', 'Anderson', 'Bamberg', 'Barnwell', 'Beaufort', 'Berkeley',
  'Calhoun', 'Charleston', 'Cherokee', 'Chester', 'Chesterfield', 'Clarendon', 'Colleton', 'Darlington',
  'Dillon', 'Dorchester', 'Edgefield', 'Fairfield', 'Florence', 'Georgetown', 'Greenville', 'Greenwood',
  'Hampton', 'Horry', 'Jasper', 'Kershaw', 'Lancaster', 'Laurens', 'Lee', 'Lexington',
  'McCormick', 'Marion', 'Marlboro', 'Newberry', 'Oconee', 'Orangeburg', 'Pickens', 'Richland',
  'Saluda', 'Spartanburg', 'Sumter', 'Union', 'Williamsburg', 'York'
];

try {
  db.transaction(() => {
    const insertCounty = db.prepare(`
      INSERT OR REPLACE INTO counties (id, state_id, name, website, ihss_wage_rate, medi_cal_plans)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    for (const c of scCounties) {
      const slug = `${c.toLowerCase().replace(/\s+/g, '-')}-sc`;
      const countyName = `${c} County`;
      const website = `https://www.${c.toLowerCase().replace(/\s+/g, '')}countysc.gov`;
      
      insertCounty.run(slug, 'south-carolina', countyName, website, 16.0, null);
    }
  })();
  console.log('✓ Seeded 46 South Carolina counties successfully.');
} catch (e) {
  console.error('❌ Failed to seed South Carolina counties:', e.message);
  process.exit(1);
} finally {
  db.close();
}
