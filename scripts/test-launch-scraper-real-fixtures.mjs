import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFamilyRecord, validateFamilyRecord } from './source-acquisition-lightweight-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);
const qaPackPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-qa-pack-${generatedDate}.json`);

if (!fs.existsSync(qaPackPath)) {
  throw new Error(`Missing QA pack: ${qaPackPath}`);
}

const qaPack = JSON.parse(fs.readFileSync(qaPackPath, 'utf8'));

const TARGET_TABLE_BY_FAMILY = {
  dd_routing: 'state_resource_agencies',
  programs_benefits: 'programs',
  waivers: 'programs',
  forms_guides: 'forms_and_guides',
  program_waitlists: 'program_waitlists',
  medicaid_hhs_offices: 'county_offices',
  education_routing: 'regional_education_agencies',
  providers_care: 'resource_providers',
  knowledge_content: 'knowledge_content',
};

function makeReplayRow(family, fixtureCase) {
  return {
    stateId: fixtureCase.stateId,
    gapFamily: family,
    targetTable: TARGET_TABLE_BY_FAMILY[family],
    sourceQueue: 'qa_pack_replay',
    sourceUrl: fixtureCase.sourceUrl,
    finalUrl: fixtureCase.finalUrl || fixtureCase.sourceUrl,
    savedPath: fixtureCase.savedPath,
    contentType: 'text/html',
    sourceName: '',
  };
}

function assertPreviewFields(record, preview) {
  if (!preview) return;
  const extraction = record.familyExtraction || {};
  for (const [key, value] of Object.entries(preview)) {
    assert.equal(extraction[key], value, `familyExtraction.${key} mismatch`);
  }
}

let replayedAccepted = 0;
let replayedRejected = 0;

for (const pack of qaPack.familyQaPacks || []) {
  if (pack.acceptedCase) {
    const row = makeReplayRow(pack.family, pack.acceptedCase);
    const html = fs.readFileSync(pack.acceptedCase.savedPath, 'utf8');
    const parsed = parseFamilyRecord(row, html);
    const validation = validateFamilyRecord(parsed);
    assert.equal(validation.isAccepted, true, `accepted fixture failed for ${pack.family}`);
    assert.equal(parsed.stateId, pack.acceptedCase.stateId, `stateId drifted for ${pack.family} accepted fixture`);
    assert.equal(parsed.sourceUrl, pack.acceptedCase.sourceUrl, `sourceUrl drifted for ${pack.family} accepted fixture`);
    assert.equal(parsed.finalUrl, pack.acceptedCase.finalUrl, `finalUrl drifted for ${pack.family} accepted fixture`);
    assertPreviewFields(parsed, pack.acceptedCase.familyExtractionPreview);
    replayedAccepted += 1;
  }

  if (pack.rejectedCase) {
    const row = makeReplayRow(pack.family, pack.rejectedCase);
    const html = fs.readFileSync(pack.rejectedCase.savedPath, 'utf8');
    const parsed = parseFamilyRecord(row, html);
    const validation = validateFamilyRecord(parsed);
    assert.equal(validation.isAccepted, false, `rejected fixture unexpectedly accepted for ${pack.family}`);
    assert.equal(parsed.stateId, pack.rejectedCase.stateId, `stateId drifted for ${pack.family} rejected fixture`);
    assert.equal(parsed.sourceUrl, pack.rejectedCase.sourceUrl, `sourceUrl drifted for ${pack.family} rejected fixture`);
    assert.equal(parsed.finalUrl, pack.rejectedCase.finalUrl, `finalUrl drifted for ${pack.family} rejected fixture`);
    assert.deepEqual(validation.reasons, pack.rejectedCase.validationReasons, `validation reasons drifted for ${pack.family}`);
    assertPreviewFields(parsed, pack.rejectedCase.familyExtractionPreview);
    replayedRejected += 1;
  }
}

assert.ok(replayedAccepted > 0, 'expected at least one accepted fixture replay');
assert.ok(replayedRejected > 0, 'expected at least one rejected fixture replay');

console.log(`launch scraper real fixture tests passed (accepted=${replayedAccepted}, rejected=${replayedRejected})`);
