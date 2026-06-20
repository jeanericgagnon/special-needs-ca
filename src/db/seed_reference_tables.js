import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const AGE_BANDS = [
  {
    id: 'prenatal-newborn',
    label: 'Prenatal to Newborn',
    description: 'Pregnancy through the first weeks of life, including newborn screening and early-risk follow-up.',
  },
  {
    id: '0-3',
    label: 'Birth to 3',
    description: 'Infants and toddlers in the early intervention window.',
  },
  {
    id: '3-5',
    label: 'Ages 3 to 5',
    description: 'Preschool-aged children transitioning into school-based supports.',
  },
  {
    id: 'k-12',
    label: 'School Age (K-12)',
    description: 'Children and teens using K-12 school, therapy, and disability support systems.',
  },
  {
    id: '14-16',
    label: 'Ages 14 to 16',
    description: 'Early transition-planning years when school, work, and adulthood preparation should begin.',
  },
  {
    id: '16-18',
    label: 'Ages 16 to 18',
    description: 'Late high-school years covering transition, benefits planning, and legal preparation for adulthood.',
  },
  {
    id: '18plus',
    label: '18 and Older',
    description: 'Adults navigating higher education, work, housing, benefits, and long-term support systems.',
  },
];

const INSURANCE_TYPES = [
  { id: 'medicaid', label: 'Medicaid / CHIP' },
  { id: 'private', label: 'Private Insurance' },
  { id: 'both', label: 'Dual Coverage (Medicaid + Private)' },
  { id: 'none', label: 'Uninsured / Coverage Gap' },
];

const DB_PATHS = [
  path.join(repoRoot, 'ca_disability_navigator.db'),
  path.join(repoRoot, 'frontend', 'ca_disability_navigator.db'),
];

const existingDbPaths = DB_PATHS.filter((dbPath) => fs.existsSync(dbPath));

if (existingDbPaths.length === 0) {
  console.error('No ca_disability_navigator.db files found.');
  process.exit(1);
}

for (const dbPath of existingDbPaths) {
  const db = new Database(dbPath);

  const upsertAgeBand = db.prepare(`
    INSERT INTO age_bands (id, label, description)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      label = excluded.label,
      description = excluded.description
  `);

  const upsertInsuranceType = db.prepare(`
    INSERT INTO insurance_types (id, label)
    VALUES (?, ?)
    ON CONFLICT(id) DO UPDATE SET
      label = excluded.label
  `);

  const tx = db.transaction(() => {
    for (const ageBand of AGE_BANDS) {
      upsertAgeBand.run(ageBand.id, ageBand.label, ageBand.description);
    }

    for (const insuranceType of INSURANCE_TYPES) {
      upsertInsuranceType.run(insuranceType.id, insuranceType.label);
    }
  });

  tx();

  const ageBandCount = db.prepare('SELECT COUNT(*) AS count FROM age_bands').get().count;
  const insuranceTypeCount = db.prepare('SELECT COUNT(*) AS count FROM insurance_types').get().count;
  db.close();

  console.log(
    `Seeded ${AGE_BANDS.length} age bands and ${INSURANCE_TYPES.length} insurance types into ${dbPath} ` +
      `(totals now ${ageBandCount} age bands / ${insuranceTypeCount} insurance types).`,
  );
}
