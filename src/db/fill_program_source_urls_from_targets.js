import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const dbPaths = [
  path.join(repoRoot, 'ca_disability_navigator.db'),
  path.join(repoRoot, 'frontend', 'ca_disability_navigator.db'),
].filter((dbPath) => fs.existsSync(dbPath));

function getSourceTargets(stateId) {
  const filePath = path.join(sourceTargetsDir, `${stateId}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function pickTargetUrl(targets, categoryPrefix) {
  return targets.find((target) => String(target.category || '').startsWith(categoryPrefix))?.source_url || null;
}

function inferProgramSourceUrl(programId, targets) {
  const id = (programId || '').toLowerCase();
  if (!targets.length) return null;

  if (id.includes('-dd-waiver') || id.includes('-dd-self-direction')) {
    return pickTargetUrl(targets, 'D. HCBS waivers');
  }
  if (id.includes('-medicaid') || id.includes('-personal-care') || id.includes('-chip')) {
    return pickTargetUrl(targets, 'B. Medicaid / benefits / HHS');
  }
  if (id.includes('-early-intervention')) {
    return pickTargetUrl(targets, 'E. Early intervention');
  }
  if (id.includes('-special-education')) {
    return pickTargetUrl(targets, 'F. Special education / IEP');
  }
  if (id.includes('-transition-services')) {
    return pickTargetUrl(targets, 'L. Transition / adult services');
  }

  return null;
}

if (dbPaths.length === 0) {
  console.error('No navigator database files found.');
  process.exit(1);
}

for (const dbPath of dbPaths) {
  const db = new Database(dbPath);
  const states = db.prepare('SELECT id FROM states ORDER BY id').all();
  const updateProgram = db.prepare(`
    UPDATE programs
    SET source_url = CASE
          WHEN source_url IS NULL OR TRIM(source_url) = '' THEN ?
          ELSE source_url
        END,
        official_source_url = CASE
          WHEN official_source_url IS NULL OR TRIM(official_source_url) = '' THEN ?
          ELSE official_source_url
        END
    WHERE id = ?
      AND ((source_url IS NULL OR TRIM(source_url) = '') OR (official_source_url IS NULL OR TRIM(official_source_url) = ''))
  `);

  let updated = 0;

  const tx = db.transaction(() => {
    for (const state of states) {
      const targets = getSourceTargets(state.id);
      if (!targets.length) continue;

      const programs = db.prepare(`
        SELECT id
        FROM programs
        WHERE state_id = ?
          AND ((source_url IS NULL OR TRIM(source_url) = '') OR (official_source_url IS NULL OR TRIM(official_source_url) = ''))
      `).all(state.id);

      for (const program of programs) {
        const url = inferProgramSourceUrl(program.id, targets);
        if (!url) continue;
        const result = updateProgram.run(url, url, program.id);
        if (result.changes > 0) updated += 1;
      }
    }
  });

  tx();

  db.close();
  console.log(`Filled missing program source URLs in ${dbPath}: ${updated} updated rows.`);
}
