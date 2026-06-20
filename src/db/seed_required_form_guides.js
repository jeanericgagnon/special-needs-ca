import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const stateConfigsPath = path.join(repoRoot, 'frontend/src/lib/stateConfigs.ts');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const stateConfigsContent = fs.readFileSync(stateConfigsPath, 'utf8');
const generatedDate = new Date().toISOString().slice(0, 10);

const dbPaths = [
  path.join(repoRoot, 'ca_disability_navigator.db'),
  path.join(repoRoot, 'frontend', 'ca_disability_navigator.db'),
].filter((dbPath) => fs.existsSync(dbPath));

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

function getSourceTargets(stateId) {
  const filePath = path.join(sourceTargetsDir, `${stateId}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function titleCase(value) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function inferFormType(slug) {
  const lower = slug.toLowerCase();
  if (lower.includes('appeal') || lower.includes('hearing') || lower.includes('complaint')) return 'appeal';
  if (lower.includes('referral')) return 'referral';
  if (lower.includes('request')) return 'request';
  if (lower.includes('checklist') || lower.includes('guide') || lower.includes('overview')) return 'guide';
  if (lower.includes('application') || lower.includes('opening') || lower.includes('app')) return 'application';
  return 'guide';
}

function pickTarget(targets, predicate) {
  return targets.find(predicate) || null;
}

function inferRelatedProgramId(slug, corePrograms) {
  const lower = slug.toLowerCase();

  const byKeyword = (keyword) => corePrograms.find((programId) => programId.includes(keyword)) || null;

  if (lower.includes('able')) return byKeyword('able');
  if (lower.includes('ssi')) return corePrograms.find((programId) => programId.includes('ssi')) || 'ssi-for-children';
  if (lower.includes('chip') || lower.includes('kidcare') || lower.includes('child-health-plus') || lower.includes('all-kids') || lower.includes('peachcare')) {
    return byKeyword('chip') || byKeyword('kidcare') || byKeyword('child-health-plus') || byKeyword('all-kids') || null;
  }
  if (lower.includes('early') || lower.includes('ei-') || lower.includes('eci') || lower.includes('babies')) {
    return byKeyword('early') || byKeyword('eci') || byKeyword('earlysteps') || null;
  }
  if (
    lower.includes('iep') ||
    lower.includes('iee') ||
    lower.includes('records-request') ||
    lower.includes('prior-written-notice') ||
    lower.includes('pwn') ||
    lower.includes('mediation') ||
    lower.includes('state-complaint') ||
    lower.includes('due-process') ||
    lower.includes('sped')
  ) {
    return byKeyword('special-education') || byKeyword('tea-sped') || byKeyword('education') || byKeyword('fldoe-ese') || null;
  }
  if (lower.includes('personal-care') || lower.includes('ihss') || lower.includes('gapp') || lower.includes('starkids')) {
    return byKeyword('personal-care') || byKeyword('ihss') || byKeyword('gapp') || byKeyword('mdcp') || null;
  }
  if (
    lower.includes('dd-') ||
    lower.includes('waiver') ||
    lower.includes('regional-center') ||
    lower.includes('regional-center') ||
    lower.includes('puns') ||
    lower.includes('planning-list') ||
    lower.includes('frontdoor') ||
    lower.includes('opwdd')
  ) {
    return byKeyword('dd-waiver') || byKeyword('waiver') || byKeyword('regional') || byKeyword('self-direction') || null;
  }
  if (lower.includes('medicaid')) return byKeyword('medicaid') || null;
  if (lower.includes('transition') || lower.includes('vr') || lower.includes('ovr') || lower.includes('drs') || lower.includes('acces') || lower.includes('ood') || lower.includes('gvra')) {
    return byKeyword('transition') || byKeyword('vocational') || byKeyword('vr') || byKeyword('ovr') || null;
  }

  return null;
}

function inferSourceContext(slug, targets, program) {
  const lower = slug.toLowerCase();

  const directProgramUrl = program?.official_source_url || program?.source_url;
  if (directProgramUrl) {
    return {
      url: directProgramUrl,
      agency: program.name,
      whoUsesIt: null,
      whereToSendIt: null,
    };
  }

  const formsLibrary = pickTarget(targets, (target) => String(target.category || '').startsWith('K. Forms and guides'));
  const medicaid = pickTarget(targets, (target) => String(target.category || '').startsWith('B. Medicaid / benefits / HHS'));
  const dd = pickTarget(targets, (target) => String(target.category || '').startsWith('C. Developmental disability / DD / IDD services'));
  const waiver = pickTarget(targets, (target) => String(target.category || '').startsWith('D. HCBS waivers'));
  const early = pickTarget(targets, (target) => String(target.category || '').startsWith('E. Early intervention'));
  const education = pickTarget(targets, (target) => String(target.category || '').startsWith('F. Special education / IEP'));
  const transition = pickTarget(targets, (target) => String(target.category || '').startsWith('L. Transition / adult services'));

  let chosen = formsLibrary || medicaid || dd || waiver || early || education || transition;

  if (lower.includes('able') || lower.includes('ssi')) {
    chosen = formsLibrary || chosen;
  } else if (lower.includes('early') || lower.includes('ei-') || lower.includes('eci') || lower.includes('babies')) {
    chosen = early || formsLibrary || chosen;
  } else if (
    lower.includes('iep') ||
    lower.includes('iee') ||
    lower.includes('records-request') ||
    lower.includes('prior-written-notice') ||
    lower.includes('pwn') ||
    lower.includes('mediation') ||
    lower.includes('state-complaint') ||
    lower.includes('due-process') ||
    lower.includes('sped')
  ) {
    chosen = education || formsLibrary || chosen;
  } else if (
    lower.includes('dd-') ||
    lower.includes('waiver') ||
    lower.includes('regional-center') ||
    lower.includes('puns') ||
    lower.includes('planning-list') ||
    lower.includes('frontdoor') ||
    lower.includes('opwdd')
  ) {
    chosen = waiver || dd || formsLibrary || chosen;
  } else if (lower.includes('transition') || lower.includes('vr') || lower.includes('ovr') || lower.includes('drs') || lower.includes('acces') || lower.includes('ood') || lower.includes('gvra')) {
    chosen = transition || formsLibrary || chosen;
  } else if (lower.includes('medicaid') || lower.includes('chip') || lower.includes('personal-care') || lower.includes('ihss') || lower.includes('gapp') || lower.includes('starkids')) {
    chosen = medicaid || formsLibrary || chosen;
  }

  if (!chosen) return null;

  return {
    url: chosen.source_url,
    agency: chosen.source_name || chosen.domain || 'Official state source',
    whoUsesIt: chosen.expected_extraction_fields || null,
    whereToSendIt: chosen.source_name ? `Use the official ${chosen.source_name} instructions to identify the correct submission destination.` : null,
  };
}

function buildTitle(stateName, slug) {
  const clean = slug
    .replace(new RegExp(`^${stateName.toLowerCase().replace(/\s+/g, '-')}-`), '')
    .replace(/^[a-z]{2}-/, '');
  return `${stateName} ${titleCase(clean)} Guide`;
}

function buildDescription(stateName, title, slug) {
  const type = inferFormType(slug);
  if (type === 'appeal') {
    return `Source-backed guide for ${title} in ${stateName}, pointing families to the official appeal, complaint, hearing, or dispute source before they file.`;
  }
  if (type === 'application') {
    return `Source-backed guide for ${title} in ${stateName}, helping families locate the official application or enrollment pathway and prepare supporting documents.`;
  }
  if (type === 'referral') {
    return `Source-backed guide for ${title} in ${stateName}, helping families locate the official referral pathway and understand what information to gather first.`;
  }
  return `Source-backed guide for ${title} in ${stateName}, helping families find the official form or process and understand the next step.`;
}

if (dbPaths.length === 0) {
  console.error('No navigator database files found.');
  process.exit(1);
}

for (const dbPath of dbPaths) {
  const db = new Database(dbPath);
  const states = db.prepare('SELECT id, name FROM states ORDER BY id').all();

  const upsert = db.prepare(`
    INSERT OR IGNORE INTO forms_and_guides (
      id, state_id, program_id, title, slug, category, form_type, agency, source_url, pdf_url,
      language, description, related_action, display_context, who_uses_it, who_signs_it,
      where_to_send_it, deadline, attachments, common_mistakes, letter_template, call_script,
      evidence_level, data_origin, verification_status, confidence_score, last_checked_at, last_verified_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
  `);

  let inserted = 0;

  const tx = db.transaction(() => {
    for (const state of states) {
      const stateBlock = parseStateBlock(state.id);
      const requiredForms = parseStringArray(stateBlock, 'requiredForms');
      const corePrograms = parseStringArray(stateBlock, 'corePrograms');
      const targets = getSourceTargets(state.id);

      for (const slug of requiredForms) {
        const existing = db.prepare('SELECT 1 FROM forms_and_guides WHERE state_id = ? AND slug = ?').get(state.id, slug);
        if (existing) continue;

        const relatedProgramId = inferRelatedProgramId(slug, corePrograms);
        const program = relatedProgramId ? db.prepare('SELECT * FROM programs WHERE id = ?').get(relatedProgramId) : null;
        const sourceContext = inferSourceContext(slug, targets, program);
        if (!sourceContext?.url) continue;

        const title = buildTitle(state.name, slug);
        const result = upsert.run(
          `${state.id}:${slug}`,
          state.id,
          relatedProgramId,
          title,
          slug,
          'forms',
          inferFormType(slug),
          sourceContext.agency,
          sourceContext.url,
          null,
          'en',
          buildDescription(state.name, title, slug),
          program?.name || null,
          'statewide',
          `Parents, guardians, caregivers, advocates, or service coordinators in ${state.name} who need the official ${title} pathway.`,
          'Check the official source to confirm who must sign this form or request.',
          sourceContext.whereToSendIt || `Use the official ${state.name} source to confirm where this form, request, or appeal must be submitted.`,
          'Check the official source for any deadline, timeline, or submission window tied to this form or request.',
          'Prepare the official form plus the supporting records, notices, evaluations, or identity documents described by the official source.',
          'Common problems include using an outdated form, missing signatures, missing supporting documents, or sending the request to the wrong office.',
          `Use a short cover note for ${title} that identifies the child, the caregiver, the reason for the request, and the documents attached.`,
          `Hello, I am calling about ${title}. I want to confirm the correct form, the right submission destination, and any documents that must be attached before I send it in.`,
          'required_form_source_target_fallback',
          'required_form_source_target_fallback',
          'source_listed',
          8.5,
          generatedDate,
          generatedDate
        );
        if (result.changes > 0) inserted += 1;
      }
    }
  });

  tx();
  db.close();
  console.log(`Seeded missing required form guides into ${dbPath}: +${inserted} rows.`);
}
