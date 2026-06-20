import fs from 'fs';
import path from 'path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
const generatedDate = new Date().toISOString().slice(0, 10);
const templatePath = path.join(docsDir, `provider-placeholder-replacement-decision-template-${generatedDate}.json`);
const activePath = path.join(dataDir, 'provider-placeholder-replacement-decisions.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function rowCount(payload) {
  if (!payload) return 0;
  if (Array.isArray(payload)) return payload.length;
  if (Array.isArray(payload.rows)) return payload.rows.length;
  return 0;
}

if (!fs.existsSync(templatePath)) {
  throw new Error(`Missing decision template: ${templatePath}`);
}

const template = readJson(templatePath);
const templateRows = rowCount(template);
const existing = fs.existsSync(activePath) ? readJson(activePath) : null;
const existingRows = rowCount(existing);

let action = 'unchanged';

if (!existing || existingRows === 0) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(activePath, `${JSON.stringify(template, null, 2)}\n`);
  action = existing ? 'replaced_empty' : 'created';
}

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  templatePath,
  activePath,
  templateRows,
  existingRows,
  action,
}, null, 2));
