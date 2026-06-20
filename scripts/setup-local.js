import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const frontendDir = path.join(repoRoot, 'frontend');

const dbFiles = [
  'ca_disability_crawler.db',
  'ca_disability_navigator.db',
];

const envPath = path.join(frontendDir, '.env.local');
const envTemplate = `JWT_SECRET=local-dev-jwt-secret-change-me
DB_ENCRYPTION_KEY=ca-special-needs-navigator-key-dev-32
# Optional: switch the frontend to PostgreSQL instead of the bundled SQLite files.
# DATABASE_URL=postgres://user:password@localhost:5432/special_needs_ca
`;

function ensureFrontendEnv() {
  if (fs.existsSync(envPath)) {
    console.log(`• Keeping existing ${path.relative(repoRoot, envPath)}`);
    return;
  }

  fs.writeFileSync(envPath, envTemplate, 'utf8');
  console.log(`• Created ${path.relative(repoRoot, envPath)}`);
}

function ensureDbLink(fileName) {
  const rootPath = path.join(repoRoot, fileName);
  const frontendPath = path.join(frontendDir, fileName);

  if (!fs.existsSync(frontendPath)) {
    console.warn(`• Skipped ${fileName}: missing ${path.relative(repoRoot, frontendPath)}`);
    return;
  }

  if (fs.existsSync(rootPath)) {
    console.log(`• Keeping existing ${fileName}`);
    return;
  }

  const relativeTarget = path.relative(repoRoot, frontendPath);
  fs.symlinkSync(relativeTarget, rootPath);
  console.log(`• Linked ${fileName} -> ${relativeTarget}`);
}

console.log('Setting up local development workspace...');

ensureFrontendEnv();
dbFiles.forEach(ensureDbLink);

console.log('Local setup complete.');
