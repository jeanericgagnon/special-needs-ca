import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const db = new Database(dbPath);

const fixes = [
  {
    id: 'pennsylvania-philadelphia-pa-philadelphia-county-cao-https-www-dhs-pa-gov-services-assistance-pages-cao-contact-aspxchelten-district',
    office_name: 'Philadelphia County CAO - Chelten District',
  },
  {
    id: 'pennsylvania-philadelphia-pa-philadelphia-county-cao-https-www-dhs-pa-gov-services-assistance-pages-cao-contact-aspxsomerset-district',
    office_name: 'Philadelphia County CAO - Somerset District',
  },
  {
    id: 'pennsylvania-philadelphia-pa-philadelphia-county-cao-https-www-dhs-pa-gov-services-assistance-pages-cao-contact-aspxunity-district',
    office_name: 'Philadelphia County CAO - Unity District',
  },
];

const updateStmt = db.prepare(`
  UPDATE county_offices
  SET office_name = ?
  WHERE id = ?
`);

const updated = [];
const tx = db.transaction(() => {
  for (const fix of fixes) {
    const result = updateStmt.run(fix.office_name, fix.id);
    if (result.changes > 0) {
      updated.push(fix.id);
    }
  }
});

tx();

console.log(`Repaired ${updated.length} office names.`);
console.log(JSON.stringify(updated, null, 2));

db.close();
