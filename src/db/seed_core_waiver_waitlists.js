import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPaths = [
  path.join(repoRoot, 'ca_disability_navigator.db'),
  path.join(repoRoot, 'frontend', 'ca_disability_navigator.db'),
].filter((dbPath) => fs.existsSync(dbPath));
const stateConfigsPath = path.join(repoRoot, 'frontend/src/lib/stateConfigs.ts');
const stateConfigsContent = fs.readFileSync(stateConfigsPath, 'utf8');
const generatedDate = new Date().toISOString().slice(0, 10);

function parseStateBlock(stateId) {
  const stateBlockRegex = new RegExp(`['"]${stateId}['"]\\s*:\\s*\\{[\\s\\S]*?\\n\\s*\\}\\s*(?:,\\n\\s*['"]|\\n\\})`);
  return stateConfigsContent.match(stateBlockRegex)?.[0] || '';
}

function parseStringArray(block, key) {
  const match = block.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) return [];
  return match[1]
    .split(',')
    .map((value) => value.trim().replace(/['"]/g, ''))
    .filter(Boolean);
}

function isWaiverLike(program) {
  const combined = `${(program.id || '').toLowerCase()} ${(program.program_type || '').toLowerCase()} ${(program.name || '').toLowerCase()}`;
  return (
    combined.includes('waiver') ||
    combined.includes('self-direction') ||
    combined.includes('regional center') ||
    combined.includes('regional-centers') ||
    combined.includes('planning list') ||
    combined.includes('interest list')
  );
}

if (dbPaths.length === 0) {
  console.error('No navigator database files found.');
  process.exit(1);
}

for (const dbPath of dbPaths) {
  const db = new Database(dbPath);
  const states = db.prepare('SELECT id FROM states ORDER BY id').all();
  const insertWaitlist = db.prepare(`
    INSERT OR IGNORE INTO program_waitlists (
      id, program_id, name, duration_label, duration_months, status, description,
      reserve_capacity_notice, legal_deadline, last_scraped_at, estimate_source_url, estimate_source_type, last_checked_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let inserted = 0;

  const tx = db.transaction(() => {
    for (const state of states) {
      const stateBlock = parseStateBlock(state.id);
      const corePrograms = parseStringArray(stateBlock, 'corePrograms');

      for (const programId of corePrograms) {
        const program = db.prepare('SELECT * FROM programs WHERE id = ?').get(programId);
        if (!program || !isWaiverLike(program)) continue;
        const existing = db.prepare('SELECT 1 FROM program_waitlists WHERE program_id = ?').get(programId);
        if (existing) continue;

        const sourceUrl = program.official_source_url || program.source_url || '';
        const result = insertWaitlist.run(
          `${programId}__waitlist`,
          programId,
          `${program.name} waitlist or interest list status`,
          'See official source for current waitlist or interest-list status',
          0,
          'not_published',
          `Check the official ${program.name} source for the most current waitlist, interest-list, or enrollment status before applying or requesting services.`,
          null,
          null,
          generatedDate,
          sourceUrl || null,
          'program_source_fallback',
          generatedDate
        );
        if (result.changes > 0) inserted += 1;
      }
    }
  });

  tx();
  db.close();
  console.log(`Seeded core waiver waitlists into ${dbPath}: +${inserted} waitlist rows.`);
}
