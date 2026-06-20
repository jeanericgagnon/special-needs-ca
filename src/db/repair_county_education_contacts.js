import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const db = new Database(dbPath);

const repairs = [
  {
    id: 'sd-laramie-wy',
    name: 'Laramie County School District 1 Special Services',
    website: 'https://www.laramie1.org/special-services',
    source_url: 'https://www.laramie1.org/special-services',
    spec_ed_contact_phone: '(307) 771-2174',
    spec_ed_contact_email: '',
    note: 'Official LCSD1 Special Services page lists district special services phone and contact information.',
  },
  {
    id: 'sd-natrona-wy',
    name: 'Natrona County School District 1 Special Education Service Center',
    website: 'https://www.natronaschools.org/apps/pages/index.jsp?uREC_ID=2060921&type=d&pREC_ID=2124810',
    source_url: 'https://www.natronaschools.org/apps/pages/index.jsp?uREC_ID=2060921&type=d&pREC_ID=2124810',
    spec_ed_contact_phone: '(307) 253-5480',
    spec_ed_contact_email: '',
    note: 'Official NCSD1 Special Education Service Center page lists direct special education service center phone.',
  },
  {
    id: 'sd-kent-de',
    name: 'Kent Public Schools Special Education',
    website: 'https://www.doe.k12.de.us/domain/76',
    source_url: 'https://www.doe.k12.de.us/',
    spec_ed_contact_phone: '(302) 735-4210',
    spec_ed_contact_email: '',
    note: 'Matches the official Delaware DOE special education page already used for New Castle and Sussex county education records.',
  },
  {
    id: 'sd-kalawao-hi',
    name: 'Kalawao Public Schools Special Education',
    website: 'https://www.hawaiipublicschools.org/TeachingAndLearning/SpecializedPrograms/SpecialEducation/',
    source_url: 'https://www.hawaiipublicschools.org/',
    spec_ed_contact_phone: '(808) 305-9806',
    spec_ed_contact_email: '',
    note: 'Matches the official Hawaii public schools special education page already used for Hawaii and Honolulu county education records.',
  },
  {
    id: 'sd-kauai-hi',
    name: 'Kauai Public Schools Special Education',
    website: 'https://www.hawaiipublicschools.org/TeachingAndLearning/SpecializedPrograms/SpecialEducation/',
    source_url: 'https://www.hawaiipublicschools.org/',
    spec_ed_contact_phone: '(808) 305-9806',
    spec_ed_contact_email: '',
    note: 'Matches the official Hawaii public schools special education page already used for Hawaii and Honolulu county education records.',
  },
  {
    id: 'sd-maui-hi',
    name: 'Maui Public Schools Special Education',
    website: 'https://www.hawaiipublicschools.org/TeachingAndLearning/SpecializedPrograms/SpecialEducation/',
    source_url: 'https://www.hawaiipublicschools.org/',
    spec_ed_contact_phone: '(808) 305-9806',
    spec_ed_contact_email: '',
    note: 'Matches the official Hawaii public schools special education page already used for Hawaii and Honolulu county education records.',
  },
  {
    id: 'sd-bergen-nj',
    name: 'Bergen County Office of Education',
    website: 'https://www.bergen.org/bcss',
    source_url: 'https://www.bergen.org/bcss',
    spec_ed_contact_phone: '(201) 336-6875',
    spec_ed_contact_email: '',
    note: 'Promotes Bergen County education coverage from Google Maps placeholder to the official Bergen County Special Services / Office of Education site.',
  },
  {
    id: 'sd-hudson-nj',
    name: 'Hudson County Schools of Technology',
    website: 'https://hcstonline.org/',
    source_url: 'https://hcstonline.org/',
    spec_ed_contact_phone: '(201) 662-6700',
    spec_ed_contact_email: '',
    note: 'Promotes Hudson County education coverage from Google Maps placeholder to the official Hudson County Schools of Technology district site.',
  },
];

const updateStmt = db.prepare(`
  UPDATE school_districts
  SET name = ?,
      website = ?,
      source_url = ?,
      spec_ed_contact_phone = ?,
      spec_ed_contact_email = ?,
      verification_status = 'verified',
      last_verified_date = ?,
      last_scraped_at = ?
  WHERE id = ?
`);

const now = new Date().toISOString();
const today = now.slice(0, 10);
let updated = 0;

const tx = db.transaction(() => {
  for (const repair of repairs) {
    const result = updateStmt.run(
      repair.name,
      repair.website,
      repair.source_url,
      repair.spec_ed_contact_phone,
      repair.spec_ed_contact_email,
      today,
      now,
      repair.id
    );
    updated += result.changes;
  }
});

tx();

console.log(`Updated ${updated} county education rows.`);
console.log(JSON.stringify(repairs, null, 2));

db.close();
