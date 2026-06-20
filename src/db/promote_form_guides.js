import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPaths = [
  path.join(repoRoot, 'ca_disability_navigator.db'),
  path.join(repoRoot, 'frontend', 'ca_disability_navigator.db'),
].filter((dbPath) => fs.existsSync(dbPath));

const stateConfigsPath = path.join(repoRoot, 'frontend/src/lib/stateConfigs.ts');
const seoDataPath = path.join(repoRoot, 'frontend/src/lib/seo-data.ts');

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

function inferFormType(text = '') {
  const value = text.toLowerCase();
  if (value.includes('appeal') || value.includes('hearing') || value.includes('complaint')) return 'appeal';
  if (value.includes('referral')) return 'referral';
  if (value.includes('evaluation') || value.includes('request')) return 'request';
  if (value.includes('guide')) return 'guide';
  if (value.includes('application') || value.includes('enrollment')) return 'application';
  return 'guide';
}

function summarizeAttachments(documents = []) {
  if (!documents.length) {
    return 'See the official source instructions for required supporting documents.';
  }
  return documents.map((document) => document.name).join('; ');
}

function defaultDeadline() {
  return 'Follow the deadline or timeline listed on the official source page for this form or appeal.';
}

function defaultCommonMistakes() {
  return 'Common delays come from missing signatures, missing dates, and missing supporting documents; verify the official instructions before submitting.';
}

function defaultCallScript(title) {
  return `Hello, I am calling about ${title}. I want to confirm the correct submission process, destination, and supporting documents required before I send it in.`;
}

function defaultLetterTemplate(title) {
  return `Use a short cover note for ${title} that identifies the child, parent or guardian, the purpose of the request, and the documents attached.`;
}

function stateIdFromSlug(slug = '') {
  const parts = slug.split('-');
  return parts.length > 1 ? parts[0] : null;
}

function safeProgramId(db, programId) {
  if (!programId) return null;
  const row = db.prepare('SELECT id FROM programs WHERE id = ?').get(programId);
  return row ? row.id : null;
}

function buildCaliforniaRows(seoClusters) {
  const californiaBlock = parseStateBlock('california');
  const requiredForms = parseStringArray(californiaBlock, 'requiredForms');

  return requiredForms
    .map((slug) => seoClusters[slug])
    .filter(Boolean)
    .map((entry) => {
      const officialSource = entry.officialSources?.[0]?.url || null;
      const agency = entry.officialSources?.[0]?.name || 'California official source';
      const firstDownload = entry.documentsToGather?.find((document) => document.downloadUrl)?.downloadUrl || null;
      const signerPoint = entry.tldrPoints?.find((point) => /authorized signer/i.test(point.label));
      const sendPoint = entry.tldrPoints?.find((point) => /where to send/i.test(point.label));

      return {
        slug: entry.slug,
        state_id: 'california',
        program_id: null,
        title: entry.title,
        category: 'forms',
        form_type: inferFormType(entry.title),
        agency,
        source_url: officialSource || firstDownload || 'https://www.cdss.ca.gov/inforesources/forms',
        pdf_url: firstDownload,
        language: 'en',
        description: entry.quickAnswer,
        related_action: entry.whatToDoFirst?.[0] || null,
        display_context: 'statewide',
        who_uses_it: entry.whenThisMatters || 'Parents, guardians, or caregivers using this California disability-related form or request.',
        who_signs_it: signerPoint?.value || 'See official instructions for required signer.',
        where_to_send_it: sendPoint?.value || entry.whoToCall?.[0]?.name || 'See official source for the correct submission destination.',
        deadline: defaultDeadline(),
        attachments: summarizeAttachments(entry.documentsToGather || []),
        common_mistakes: (entry.commonMistakes || []).join(' ') || defaultCommonMistakes(),
        letter_template: entry.letterTemplate?.description || defaultLetterTemplate(entry.title),
        call_script: entry.callScriptTemplate?.script || defaultCallScript(entry.title),
        evidence_level: 'repo_canonical_form_guide',
        data_origin: 'repo_canonical_form_guide',
        verification_status: 'source_listed',
        confidence_score: 9.5,
        last_checked_at: generatedDate,
        last_verified_at: entry.lastReviewedDate || generatedDate,
      };
    });
}

function buildStagingRows(db) {
  const staged = db.prepare(`
    SELECT state_id, slug, source_name, source_url, official_download_url, program,
           who_uses_it, who_signs_it, where_to_send_it, extraction_notes, raw_text_excerpt,
           letter_script, scraped_at, confidence_score
    FROM staging_scraped_forms
    WHERE slug IS NOT NULL AND TRIM(slug) <> ''
  `).all();

  return staged.map((row) => ({
    slug: row.slug,
    state_id: row.state_id || stateIdFromSlug(row.slug) || 'unknown',
    program_id: safeProgramId(db, row.program),
    title: row.source_name || row.slug,
    category: 'forms',
    form_type: inferFormType(`${row.slug} ${row.source_name || ''}`),
    agency: row.source_name || `${row.state_id} official source`,
    source_url: row.source_url,
    pdf_url: row.official_download_url || null,
    language: 'en',
    description: row.extraction_notes || row.raw_text_excerpt || row.source_name || row.slug,
    related_action: row.program || null,
    display_context: 'statewide',
    who_uses_it: row.who_uses_it || `Parents, guardians, caregivers, or advocates using ${row.source_name || row.slug}.`,
    who_signs_it: row.who_signs_it || 'See official instructions for who must sign this form.',
    where_to_send_it: row.where_to_send_it || 'See the official source page for the correct submission destination.',
    deadline: defaultDeadline(),
    attachments: 'See the official source instructions for required supporting documents.',
    common_mistakes: defaultCommonMistakes(),
    letter_template: row.letter_script || defaultLetterTemplate(row.source_name || row.slug),
    call_script: defaultCallScript(row.source_name || row.slug),
    evidence_level: 'state_upgrade_staging_form',
    data_origin: 'state_upgrade_staging_form',
    verification_status: 'source_listed',
    confidence_score: row.confidence_score || 8.5,
    last_checked_at: row.scraped_at || generatedDate,
    last_verified_at: row.scraped_at || generatedDate,
  })).filter((row) => row.state_id !== 'unknown' && row.source_url);
}

if (dbPaths.length === 0) {
  console.error('No navigator database files found.');
  process.exit(1);
}

const { SEO_CLUSTERS } = await import(pathToFileURL(seoDataPath).href);

for (const dbPath of dbPaths) {
  const db = new Database(dbPath);

  const upsert = db.prepare(`
    INSERT INTO forms_and_guides (
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
    ON CONFLICT(slug) DO UPDATE SET
      state_id = excluded.state_id,
      program_id = COALESCE(excluded.program_id, forms_and_guides.program_id),
      title = excluded.title,
      category = excluded.category,
      form_type = excluded.form_type,
      agency = excluded.agency,
      source_url = excluded.source_url,
      pdf_url = COALESCE(excluded.pdf_url, forms_and_guides.pdf_url),
      language = excluded.language,
      description = excluded.description,
      related_action = COALESCE(excluded.related_action, forms_and_guides.related_action),
      display_context = excluded.display_context,
      who_uses_it = COALESCE(excluded.who_uses_it, forms_and_guides.who_uses_it),
      who_signs_it = COALESCE(excluded.who_signs_it, forms_and_guides.who_signs_it),
      where_to_send_it = COALESCE(excluded.where_to_send_it, forms_and_guides.where_to_send_it),
      deadline = COALESCE(excluded.deadline, forms_and_guides.deadline),
      attachments = COALESCE(excluded.attachments, forms_and_guides.attachments),
      common_mistakes = COALESCE(excluded.common_mistakes, forms_and_guides.common_mistakes),
      letter_template = COALESCE(excluded.letter_template, forms_and_guides.letter_template),
      call_script = COALESCE(excluded.call_script, forms_and_guides.call_script),
      evidence_level = excluded.evidence_level,
      data_origin = excluded.data_origin,
      verification_status = excluded.verification_status,
      confidence_score = excluded.confidence_score,
      last_checked_at = excluded.last_checked_at,
      last_verified_at = excluded.last_verified_at
  `);

  const californiaRows = buildCaliforniaRows(SEO_CLUSTERS);
  const stagingRows = buildStagingRows(db);
  const rows = [...stagingRows, ...californiaRows];

  const tx = db.transaction((records) => {
    for (const row of records) {
      upsert.run(
        `${row.state_id}:${row.slug}`,
        row.state_id,
        row.program_id,
        row.title,
        row.slug,
        row.category,
        row.form_type,
        row.agency,
        row.source_url,
        row.pdf_url,
        row.language,
        row.description,
        row.related_action,
        row.display_context,
        row.who_uses_it,
        row.who_signs_it,
        row.where_to_send_it,
        row.deadline,
        row.attachments,
        row.common_mistakes,
        row.letter_template,
        row.call_script,
        row.evidence_level,
        row.data_origin,
        row.verification_status,
        row.confidence_score,
        row.last_checked_at,
        row.last_verified_at
      );
    }
  });

  tx(rows);
  const total = db.prepare('SELECT COUNT(*) AS count FROM forms_and_guides').get().count;
  const californiaCount = db.prepare("SELECT COUNT(*) AS count FROM forms_and_guides WHERE state_id = 'california'").get().count;
  db.close();
  console.log(`Promoted ${rows.length} form-guide records into ${dbPath}. Total forms_and_guides rows: ${total}. California rows: ${californiaCount}.`);
}
