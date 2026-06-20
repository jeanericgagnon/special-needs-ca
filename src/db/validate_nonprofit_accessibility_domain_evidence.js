import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateAddressEvidence } from './nonprofit_accessibility_domain_pipeline.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const evidencePath = process.argv[2] || process.env.EVIDENCE_PATH;

if (!evidencePath) {
  throw new Error('Usage: node src/db/validate_nonprofit_accessibility_domain_evidence.js <evidence.json>');
}

const payload = JSON.parse(fs.readFileSync(path.resolve(repoRoot, evidencePath), 'utf8'));
const validations = (payload.evidence || []).map((evidence) => ({
  sourceUrl: evidence.sourceUrl,
  address: evidence.address,
  confidence: evidence.confidence,
  ...validateAddressEvidence(evidence, payload.domain),
}));
const validCount = validations.filter((row) => row.valid).length;

console.log(JSON.stringify({
  domain: payload.domain,
  evidencePath: path.resolve(repoRoot, evidencePath),
  evidenceCount: validations.length,
  validCount,
  invalidCount: validations.length - validCount,
  sample: validations.slice(0, 5),
}, null, 2));
