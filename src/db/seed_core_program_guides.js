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

function buildSteps(program) {
  const sourceUrl = program.official_source_url || program.source_url || 'the official program source';
  const programClass = classifyProgram(program);

  const steps = [
    {
      step_number: 1,
      title: `Review ${program.name} eligibility and intake rules`,
      action_description: `Read the official ${program.name} program information and confirm who the program serves, what eligibility rules apply, and whether there is a county, school, or state entry point for the request.`,
      apply_url_or_contact: sourceUrl,
    },
  ];

  if (programClass === 'education') {
    steps.push({
      step_number: 2,
      title: `Submit a written school request for ${program.name}`,
      action_description: `Use the district or state special education process to submit a written request, preserve a dated copy, and follow the official timelines for response, evaluation, meeting, complaint, or due process steps.`,
      apply_url_or_contact: sourceUrl,
    });
  } else if (programClass === 'early_intervention') {
    steps.push({
      step_number: 2,
      title: `Start intake or referral for ${program.name}`,
      action_description: `Contact the official intake or referral channel listed by the program, share the child's developmental concerns, and ask what evaluations or consent documents are needed next.`,
      apply_url_or_contact: sourceUrl,
    });
  } else if (programClass === 'able') {
    steps.push({
      step_number: 2,
      title: `Open or start the ${program.name} application`,
      action_description: `Use the official program enrollment process to start the account, confirm disability eligibility, and review identity, beneficiary, and representative requirements before submitting.`,
      apply_url_or_contact: sourceUrl,
    });
  } else {
    steps.push({
      step_number: 2,
      title: `Submit the official ${program.name} request or application`,
      action_description: `Use the official application, intake, or enrollment pathway listed by the program and keep copies of everything submitted so you can follow up if the agency asks for more information.`,
      apply_url_or_contact: sourceUrl,
    });
  }

  return steps;
}

function buildDoc(program) {
  const programClass = classifyProgram(program);

  if (programClass === 'education') {
    return {
      name: 'Written school request and child records',
      description: `Prepare a dated written request plus the child records, evaluations, and school information that the ${program.name} process asks the family to provide.`,
    };
  }

  if (programClass === 'early_intervention') {
    return {
      name: 'Referral details and developmental records',
      description: `Gather the referral details, developmental concerns, and medical or therapy records that the ${program.name} intake team requests during referral or evaluation.`,
    };
  }

  if (programClass === 'able') {
    return {
      name: 'Disability eligibility and account setup information',
      description: `Review the official ${program.name} source for the disability eligibility certification, beneficiary details, and identity information needed to open the account.`,
    };
  }

  if (programClass === 'ssi') {
    return {
      name: 'Medical, school, and functional records',
      description: `Gather the medical, school, and daily-function records that help document why the child meets the disability standard for ${program.name}.`,
    };
  }

  return {
    name: 'Official application documents and supporting records',
    description: `Review the official ${program.name} source and collect the identity, medical, school, financial, or service records that the agency requires for application, intake, or review.`,
  };
}

if (dbPaths.length === 0) {
  console.error('No navigator database files found.');
  process.exit(1);
}

for (const dbPath of dbPaths) {
  const db = new Database(dbPath);
  const states = db.prepare('SELECT id FROM states ORDER BY id').all();

  const insertStep = db.prepare(`
    INSERT OR IGNORE INTO program_application_steps (
      id, program_id, step_number, title, action_description, apply_url_or_contact
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertDoc = db.prepare(`
    INSERT OR IGNORE INTO program_document_requirements (
      id, program_id, name, description, is_mandatory
    ) VALUES (?, ?, ?, ?, 1)
  `);

  let insertedSteps = 0;
  let insertedDocs = 0;

  const tx = db.transaction(() => {
    for (const state of states) {
      const stateBlock = parseStateBlock(state.id);
      const corePrograms = parseStringArray(stateBlock, 'corePrograms');

      for (const programId of corePrograms) {
        const program = db.prepare('SELECT * FROM programs WHERE id = ?').get(programId);
        if (!program) continue;

        const stepCount = db.prepare('SELECT COUNT(*) AS count FROM program_application_steps WHERE program_id = ?').get(programId).count;
        if (stepCount === 0) {
          for (const step of buildSteps(program)) {
            const result = insertStep.run(
              `${programId}__step_${step.step_number}`,
              programId,
              step.step_number,
              step.title,
              step.action_description,
              step.apply_url_or_contact
            );
            if (result.changes > 0) insertedSteps += 1;
          }
        }

        const docCount = db.prepare('SELECT COUNT(*) AS count FROM program_document_requirements WHERE program_id = ?').get(programId).count;
        if (docCount === 0) {
          const doc = buildDoc(program);
          const result = insertDoc.run(
            `${programId}__doc_1`,
            programId,
            doc.name,
            doc.description
          );
          if (result.changes > 0) insertedDocs += 1;
        }
      }
    }
  });

  tx();

  const totalSteps = db.prepare('SELECT COUNT(*) AS count FROM program_application_steps').get().count;
  const totalDocs = db.prepare('SELECT COUNT(*) AS count FROM program_document_requirements').get().count;
  db.close();

  console.log(`Seeded core program guides into ${dbPath}: +${insertedSteps} steps, +${insertedDocs} docs. Totals now ${totalSteps} steps and ${totalDocs} docs.`);
}
