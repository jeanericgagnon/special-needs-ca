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

function classifyProgram(program) {
  const id = (program.id || '').toLowerCase();
  const type = (program.program_type || '').toLowerCase();
  const name = (program.name || '').toLowerCase();
  const text = `${id} ${type} ${name}`;

  if (text.includes('able')) return 'able';
  if (text.includes('ssi')) return 'ssi';
  if (text.includes('special_education') || text.includes('iep') || text.includes('education')) return 'education';
  if (text.includes('early_intervention') || text.includes('early start') || text.includes('eci')) return 'early_intervention';
  if (text.includes('waiver') || text.includes('regional center') || text.includes('regional-centers') || text.includes('self-direction')) return 'waiver';
  if (text.includes('medicaid') || text.includes('chip') || text.includes('ihss') || text.includes('ccs') || text.includes('hearing-aid')) return 'benefits';
  if (text.includes('vocational')) return 'transition';
  return 'general';
}

function buildAppeal(program) {
  const sourceUrl = program.official_source_url || program.source_url || '';
  const programClass = classifyProgram(program);
  const programName = program.name;

  if (programClass === 'education') {
    return {
      deadline_days: 'See official source for IDEA, state complaint, mediation, or due process timelines.',
      appeal_steps: `Use the official ${programName} dispute process to document the issue in writing, keep copies of notices and evaluations, and follow the published complaint, mediation, or due process path described by the agency or district.`,
      denial_reasons: 'Common disputes include delayed evaluations, disagreement with eligibility or services, refusal to provide written notice, or disagreement with placement or implementation.',
      official_appeal_source_url: sourceUrl,
    };
  }

  if (programClass === 'early_intervention') {
    return {
      deadline_days: 'See official source for complaint, mediation, or due process timelines.',
      appeal_steps: `If ${programName} services are denied, delayed, reduced, or disputed, use the official complaint or dispute resolution process listed by the program and preserve copies of referrals, evaluations, consent forms, and written notices.`,
      denial_reasons: 'Common disputes include eligibility denials, delayed evaluation or intake, disagreement with service levels, or transition disputes.',
      official_appeal_source_url: sourceUrl,
    };
  }

  if (programClass === 'waiver') {
    return {
      deadline_days: 'See official source for fair hearing, notice, or waiver appeal deadlines.',
      appeal_steps: `If ${programName} denies eligibility, services, budget authority, or enrollment action, use the official notice and appeal path published by the administering agency. Keep the notice date, request appeal or hearing rights quickly, and submit supporting records before the stated deadline.`,
      denial_reasons: 'Common disputes include eligibility denials, service authorization reductions, waiting-list or interest-list disputes, budget disagreements, or refusal to approve requested supports.',
      official_appeal_source_url: sourceUrl,
    };
  }

  if (programClass === 'benefits' || programClass === 'ssi') {
    return {
      deadline_days: 'See official source for reconsideration, grievance, or fair hearing deadlines.',
      appeal_steps: `If ${programName} denies coverage, services, hours, or financial eligibility, use the official notice and appeal instructions from the agency, preserve the denial notice date, and submit the requested supporting documents through the official review or hearing path.`,
      denial_reasons: 'Common disputes include ineligibility findings, missing documentation, service denials, coverage reductions, or disagreement with medical necessity or benefit level.',
      official_appeal_source_url: sourceUrl,
    };
  }

  if (programClass === 'transition') {
    return {
      deadline_days: 'See official source for review or appeal deadlines.',
      appeal_steps: `If ${programName} denies or limits access to services, use the official review, appeal, or dispute process published by the administering agency and keep copies of applications, evaluations, and written notices.`,
      denial_reasons: 'Common disputes include ineligibility, incomplete applications, service denials, or disagreement with the scope of approved supports.',
      official_appeal_source_url: sourceUrl,
    };
  }

  return {
    deadline_days: 'See official source for appeal or dispute deadlines.',
    appeal_steps: `If ${programName} denies eligibility, enrollment, coverage, or services, follow the official review, complaint, or appeal instructions published by the administering agency and keep a copy of every notice and submission.`,
    denial_reasons: 'Common disputes include eligibility denials, incomplete applications, missing documentation, or disagreement with approved services or benefits.',
    official_appeal_source_url: sourceUrl,
  };
}

if (dbPaths.length === 0) {
  console.error('No navigator database files found.');
  process.exit(1);
}

for (const dbPath of dbPaths) {
  const db = new Database(dbPath);
  const states = db.prepare('SELECT id FROM states ORDER BY id').all();

  const upsertAppeal = db.prepare(`
    INSERT OR IGNORE INTO program_appeal_info (
      program_id, deadline_days, appeal_steps, denial_reasons, appeal_form_name, official_appeal_source_url
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  let insertedAppeals = 0;

  const tx = db.transaction(() => {
    for (const state of states) {
      const stateBlock = parseStateBlock(state.id);
      const corePrograms = parseStringArray(stateBlock, 'corePrograms');

      for (const programId of corePrograms) {
        const program = db.prepare('SELECT * FROM programs WHERE id = ?').get(programId);
        if (!program) continue;
        if (classifyProgram(program) === 'able') continue;

        const existing = db.prepare('SELECT 1 FROM program_appeal_info WHERE program_id = ?').get(programId);
        if (existing) continue;

        const appeal = buildAppeal(program);
        const result = upsertAppeal.run(
          programId,
          appeal.deadline_days,
          appeal.appeal_steps,
          appeal.denial_reasons,
          'See official source',
          appeal.official_appeal_source_url
        );
        if (result.changes > 0) insertedAppeals += 1;
      }
    }
  });

  tx();

  const totalAppeals = db.prepare('SELECT COUNT(*) AS count FROM program_appeal_info').get().count;
  db.close();
  console.log(`Seeded core program appeal guides into ${dbPath}: +${insertedAppeals} appeal rows. Total appeals now ${totalAppeals}.`);
}
