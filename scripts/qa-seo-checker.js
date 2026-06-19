import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_DIR = path.join(__dirname, '../frontend/src');

let errors = 0;
let warnings = 0;

function logError(msg) {
  console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`);
  errors++;
}

function logWarning(msg) {
  console.warn(`\x1b[33m[WARNING]\x1b[0m ${msg}`);
  warnings++;
}

function logSuccess(msg) {
  console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
}

/**
 * Validates metadata rules for TSX pages.
 */
function checkFileSeo(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relPath = path.relative(FRONTEND_DIR, filePath);

  console.log(`Checking SEO standards in: ${relPath}`);

  // Rule 1: Check metadata format and length
  const titleMatch = content.match(/title:\s*[`"']([^`"'\n]+)[`"']/);
  if (titleMatch) {
    const title = titleMatch[1];
    if (title.length > 70) {
      logWarning(`${relPath}: Title length (${title.length}) exceeds recommended 70 characters: "${title}"`);
    } else {
      logSuccess(`${relPath}: Title length is optimal (${title.length} chars)`);
    }
  }

  const descMatch = content.match(/description:\s*[`"']([^`"'\n]+)[`"']/);
  if (descMatch) {
    const desc = descMatch[1];
    if (desc.length > 165) {
      logError(`${relPath}: Description length (${desc.length}) exceeds 165 characters!`);
    } else if (desc.length < 90) {
      logWarning(`${relPath}: Description length (${desc.length}) is below recommended 90 characters.`);
    } else {
      logSuccess(`${relPath}: Description length is optimal (${desc.length} chars)`);
    }

    // Check for target keywords
    const lowerDesc = desc.toLowerCase();
    const hasKeywords = ['eligibility', 'waiver', 'apply', 'contact', 'benefit', 'clinical', 'medical', 'guide'].some(kw => lowerDesc.includes(kw));
    if (!hasKeywords) {
      logWarning(`${relPath}: Description does not contain standard keywords.`);
    }
  }

  // Rule 2: Check for structured schemas
  if (filePath.endsWith('page.tsx')) {
    if (!content.includes('SeoSchema') && !content.includes('BreadcrumbList')) {
      logWarning(`${relPath}: No visible JSON-LD schema or SeoSchema component detected.`);
    } else {
      logSuccess(`${relPath}: JSON-LD SeoSchema detected.`);
    }
  }
}

/**
 * Recursively find all page and layout files.
 */
function scanDirectory(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (file.endsWith('.tsx') && (file.startsWith('page') || file.startsWith('layout'))) {
      checkFileSeo(fullPath);
    }
  }
}

console.log('--- Starting SEO QA Checks ---');
scanDirectory(path.join(FRONTEND_DIR, 'app'));
console.log('\n--- SEO QA Verification Summary ---');
console.log(`Errors Found: ${errors}`);
console.log(`Warnings Found: ${warnings}`);

if (errors > 0) {
  console.log('\x1b[31mSEO QA verification failed. Please fix the errors before releasing.\x1b[0m');
  process.exit(1);
} else {
  console.log('\x1b[32mSEO QA verification passed successfully!\x1b[0m');
}
