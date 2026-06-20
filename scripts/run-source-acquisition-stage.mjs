import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import {
  ensureDir,
  getLatestRunId,
  outputRoot,
  parseArgs,
  writeJson,
  writeNdjson,
  countBy,
} from './source-acquisition-lightweight-lib.mjs';
import {
  buildPromotionCandidate,
  deleteWhereClause,
  familyDirName,
  insertConfigForTable,
  mergePreservedStagingFields,
  summaryRecord,
} from './source-acquisition-stage-lib.mjs';

const WAIT_TIMEOUT_MS = 5000;
const WAIT_POLL_MS = 50;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseStageArgs(argv) {
  const args = parseArgs(argv);
  args.mode = 'dry-run';
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'mode' && value) args.mode = value;
  }
  return args;
}

function readNdjson(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function inferOfficeProgramId(db, row) {
  const sourceUrl = String(row.source_url || '').trim();
  const stateId = String(row.state_id || '').trim();
  if (!db || !sourceUrl || !stateId) return '';

  const exact = db.prepare(`
    SELECT program_id, COUNT(*) AS count
    FROM county_offices
    WHERE state_id = ?
      AND source_url = ?
      AND program_id IS NOT NULL
      AND TRIM(program_id) <> ''
    GROUP BY program_id
    ORDER BY count DESC, program_id ASC
    LIMIT 1
  `).get(stateId, sourceUrl);
  if (exact?.program_id) return exact.program_id;

  const website = String(row.extracted_website || '').trim();
  if (website) {
    const byWebsite = db.prepare(`
      SELECT program_id, COUNT(*) AS count
      FROM county_offices
      WHERE state_id = ?
        AND website = ?
        AND program_id IS NOT NULL
        AND TRIM(program_id) <> ''
      GROUP BY program_id
      ORDER BY count DESC, program_id ASC
      LIMIT 1
    `).get(stateId, website);
    if (byWebsite?.program_id) return byWebsite.program_id;
  }

  return '';
}

function inferWaitlistProgramId(db, row) {
  const sourceUrl = String(row.estimate_source_url || row.source_url || '').trim();
  const stateId = String(row.state_id || '').trim();
  const waitlistName = String(row.name || '').trim();
  if (!db || !stateId) return '';

  if (sourceUrl) {
    const existingWaitlist = db.prepare(`
      SELECT program_id
      FROM program_waitlists
      WHERE estimate_source_url = ?
        AND program_id IS NOT NULL
        AND TRIM(program_id) <> ''
      LIMIT 1
    `).get(sourceUrl);
    if (existingWaitlist?.program_id) return existingWaitlist.program_id;

    const exactProgram = db.prepare(`
      SELECT id
      FROM programs
      WHERE state_id = ?
        AND (
          official_source_url = ?
          OR source_url = ?
        )
      LIMIT 1
    `).get(stateId, sourceUrl, sourceUrl);
    if (exactProgram?.id) return exactProgram.id;
  }

  if (waitlistName) {
    const byExactName = db.prepare(`
      SELECT id
      FROM programs
      WHERE state_id = ?
        AND lower(name) = lower(?)
      LIMIT 1
    `).get(stateId, waitlistName);
    if (byExactName?.id) return byExactName.id;

    const byContainedName = db.prepare(`
      SELECT id, name
      FROM programs
      WHERE state_id = ?
        AND (
          instr(lower(?), lower(name)) > 0
          OR instr(lower(name), lower(?)) > 0
        )
      ORDER BY length(name) ASC, id ASC
      LIMIT 1
    `).get(stateId, waitlistName, waitlistName);
    if (byContainedName?.id) return byContainedName.id;
  }

  return '';
}

function loadAcceptedFamilies(validatedRoot, familyFilter) {
  if (!fs.existsSync(validatedRoot)) return [];
  const dirs = fs.readdirSync(validatedRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((family) => familyFilter === 'all' || family === familyFilter);

  return dirs.map((family) => ({
    family,
    recordsPath: path.join(validatedRoot, family, 'accepted.ndjson'),
  })).filter((item) => fs.existsSync(item.recordsPath));
}

async function waitForValidatedRoot(validatedRoot) {
  const deadline = Date.now() + WAIT_TIMEOUT_MS;
  while (!fs.existsSync(validatedRoot) && Date.now() < deadline) {
    await sleep(WAIT_POLL_MS);
  }
  return fs.existsSync(validatedRoot);
}

async function waitForAcceptedFamilies(validatedRoot, familyFilter) {
  const deadline = Date.now() + WAIT_TIMEOUT_MS;
  let familyInputs = loadAcceptedFamilies(validatedRoot, familyFilter);
  while (!familyInputs.length && familyFilter !== 'all' && Date.now() < deadline) {
    await sleep(WAIT_POLL_MS);
    familyInputs = loadAcceptedFamilies(validatedRoot, familyFilter);
  }
  return familyInputs;
}

const args = parseStageArgs(process.argv.slice(2));
const runId = args.runId || getLatestRunId();

if (!runId) {
  throw new Error('No source acquisition run found.');
}

const runDir = path.join(outputRoot, runId);
const validatedRoot = path.join(runDir, 'validated');
const stagedRoot = path.join(runDir, 'staged');
ensureDir(stagedRoot);

if (!(await waitForValidatedRoot(validatedRoot))) {
  throw new Error(`Missing validated directory: ${validatedRoot}`);
}

const familyInputs = await waitForAcceptedFamilies(validatedRoot, args.family);
const dbPath = path.join(process.cwd(), 'ca_disability_navigator.db');
let db = null;
const dbStats = {
  inserted: 0,
  replaced: 0,
};

if (args.family !== 'all' && familyInputs.length === 0) {
  if (args.mode === 'dry-run') {
    const emptySummary = {
      runId,
      family: args.family,
      mode: args.mode,
      acceptedInputCount: 0,
      supportedCount: 0,
      unsupportedCount: 0,
      supportedByTable: {},
      unsupportedReasons: {},
      noAcceptedRows: true,
    };
    const familyDir = path.join(stagedRoot, familyDirName(args.family));
    ensureDir(familyDir);
    writeNdjson(path.join(familyDir, 'promotion-candidates.ndjson'), []);
    writeNdjson(path.join(familyDir, 'unsupported-candidates.ndjson'), []);
    writeJson(path.join(familyDir, 'promotion-summary.json'), emptySummary);
    fs.writeFileSync(
      path.join(familyDir, 'promotion-summary.md'),
      [
        `# Staging Summary: ${args.family}`,
        '',
        `- Mode: \`${args.mode}\``,
        '- Accepted input rows: 0',
        '- Supported candidates: 0',
        '- Unsupported candidates: 0',
        '- No accepted validated rows were available for this family in the requested run.',
        '',
      ].join('\n')
    );
    console.log(JSON.stringify({
      runId,
      family: args.family,
      mode: args.mode,
      acceptedInputCount: 0,
      supportedCount: 0,
      unsupportedCount: 0,
      noAcceptedRows: true,
      summaryPath: path.join(familyDir, 'promotion-summary.json'),
    }, null, 2));
    process.exit(0);
  }
  throw new Error(`No accepted validated rows found for family "${args.family}" in ${validatedRoot}`);
}

if (args.mode === 'apply') {
  db = new Database(dbPath);
}

const familySummaries = [];

for (const input of familyInputs) {
  const acceptedRecords = readNdjson(input.recordsPath);
  const limitedRecords = args.limit > 0 ? acceptedRecords.slice(0, args.limit) : acceptedRecords;
  const familyDir = path.join(stagedRoot, familyDirName(input.family));
  ensureDir(familyDir);

  const supported = [];
  const unsupported = [];

  for (const record of limitedRecords) {
    const candidate = buildPromotionCandidate(record);
    const entry = {
      recordId: record.recordId,
      family: input.family,
      stateId: record.stateId,
      sourceUrl: record.finalUrl || record.sourceUrl,
      candidate,
    };
    if (candidate.supported) supported.push(entry);
    else unsupported.push(entry);
  }

  if (db && supported.length) {
    const tx = db.transaction(() => {
      for (const entry of supported) {
        const config = insertConfigForTable(entry.candidate.stagingTable);
        let row = entry.candidate.row;
        if (entry.candidate.stagingTable === 'staging_scraped_county_offices' && !String(row.program_id || '').trim()) {
          row = {
            ...row,
            program_id: inferOfficeProgramId(db, row),
          };
        }
        if (entry.candidate.stagingTable === 'staging_scraped_waitlists' && !String(row.program_id || '').trim()) {
          row = {
            ...row,
            program_id: inferWaitlistProgramId(db, row),
          };
        }
        if (entry.candidate.stagingTable === 'staging_scraped_county_offices' && !String(row.program_id || '').trim()) {
          continue;
        }
        if (entry.candidate.stagingTable === 'staging_scraped_waitlists' && !String(row.program_id || '').trim()) {
          continue;
        }
        const existing = db.prepare(`SELECT * FROM ${entry.candidate.stagingTable} WHERE ${deleteWhereClause(config.keyFields)} LIMIT 1`)
          .get(...config.keyFields.map((field) => row[field]));
        row = mergePreservedStagingFields(entry.candidate.stagingTable, row, existing);
        const deleteStmt = db.prepare(`DELETE FROM ${entry.candidate.stagingTable} WHERE ${deleteWhereClause(config.keyFields)}`);
        deleteStmt.run(...config.keyFields.map((field) => row[field]));
        dbStats.replaced += 1;
        const placeholders = config.columns.map(() => '?').join(', ');
        const insertStmt = db.prepare(`INSERT INTO ${entry.candidate.stagingTable} (${config.columns.join(', ')}) VALUES (${placeholders})`);
        insertStmt.run(...config.columns.map((column) => row[column] ?? null));
        dbStats.inserted += 1;
      }
    });
    tx();
  }

  const summary = {
    runId,
    family: input.family,
    mode: args.mode,
    acceptedInputCount: limitedRecords.length,
    supportedCount: supported.length,
    unsupportedCount: unsupported.length,
    supportedByTable: countBy(supported.map((entry) => summaryRecord(entry.candidate)), (row) => row.stagingTable),
    unsupportedReasons: countBy(unsupported.map((entry) => summaryRecord(entry.candidate)), (row) => row.reason),
  };

  writeNdjson(path.join(familyDir, 'promotion-candidates.ndjson'), supported);
  writeNdjson(path.join(familyDir, 'unsupported-candidates.ndjson'), unsupported);
  writeJson(path.join(familyDir, 'promotion-summary.json'), summary);
  fs.writeFileSync(
    path.join(familyDir, 'promotion-summary.md'),
    [
      `# Staging Summary: ${input.family}`,
      '',
      `- Run ID: \`${runId}\``,
      `- Mode: \`${args.mode}\``,
      `- Accepted Input: \`${summary.acceptedInputCount}\``,
      `- Supported: \`${summary.supportedCount}\``,
      `- Unsupported: \`${summary.unsupportedCount}\``,
      '',
      '## Supported By Table',
      '',
      ...(summary.supportedByTable.length ? summary.supportedByTable.map((item) => `- ${item.label}: ${item.count}`) : ['_None_']),
      '',
      '## Unsupported Reasons',
      '',
      ...(summary.unsupportedReasons.length ? summary.unsupportedReasons.map((item) => `- ${item.label}: ${item.count}`) : ['_None_']),
      '',
    ].join('\n'),
  );

  familySummaries.push(summary);
}

const indexSummary = {
  runId,
  mode: args.mode,
  familyFilter: args.family,
  familyCount: familySummaries.length,
  dbPath: args.mode === 'apply' ? dbPath : null,
  dbStats,
  families: familySummaries,
};

writeJson(path.join(stagedRoot, 'index-summary.json'), indexSummary);
fs.writeFileSync(
  path.join(stagedRoot, 'index-summary.md'),
  [
    '# Lightweight Staging Summary',
    '',
    `- Run ID: \`${runId}\``,
    `- Mode: \`${args.mode}\``,
    `- Family Count: \`${familySummaries.length}\``,
    `- Inserted: \`${dbStats.inserted}\``,
    `- Replaced Before Insert: \`${dbStats.replaced}\``,
    '',
    '## Families',
    '',
    ...familySummaries.map((summary) => `- ${summary.family}: supported ${summary.supportedCount}, unsupported ${summary.unsupportedCount}`),
    '',
  ].join('\n'),
);

if (db) {
  db.close();
}

console.log(JSON.stringify(indexSummary, null, 2));
