import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const sourcePacksDir = path.join(repoRoot, 'data', 'source_packs');
const generatedDate = new Date().toISOString().slice(0, 10);

const queuePath = path.join(docsDir, `official-domain-followup-queue-${generatedDate}.json`);
const repairPackPath = path.join(sourcePacksDir, 'official_state_domain_repairs.json');
const jsonOutPath = path.join(docsDir, `official-domain-followup-decision-template-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const queue = readJson(queuePath);
const repairPack = readJson(repairPackPath);

const payload = {
  generatedAt: generatedDate,
  sourceQueue: path.relative(repoRoot, queuePath),
  sourcePack: path.relative(repoRoot, repairPackPath),
  instructions: {
    allowedDecisionModes: [
      'choose_exact_candidate',
      'verify_first_party_root_hint',
      'skip_followup',
    ],
    requiredTopLevelFields: [
      'stateId',
      'targetTable',
      'sourceName',
      'fakeSourceUrl',
      'decisionMode',
      'reviewedBy',
    ],
    chooseExactCandidateFields: [
      'chosenCandidateUrl',
    ],
    verifyFirstPartyRootHintFields: [
      'verifiedReplacementUrl',
      'verifiedReplacementName',
    ],
    skipFields: [
      'reviewNotes',
    ],
    rules: [
      'Use choose_exact_candidate only when selecting a single medium-confidence official URL from the provided candidate list.',
      'Use verify_first_party_root_hint only when the root-hint domain has been reviewed and judged safe for the specific lane.',
      'Do not invent new replacement URLs outside the row candidate context unless they are added deliberately in a later repair pass.',
      'Do not apply any follow-up row without reviewedBy and a decisionMode.',
    ],
  },
  rows: (queue.rows || []).map((row) => {
    const repairRow = (repairPack.rows || []).find((candidate) =>
      candidate.stateId === row.stateId &&
      candidate.targetTable === row.targetTable &&
      candidate.sourceName === row.sourceName &&
      candidate.fakeSourceUrl === row.fakeSourceUrl
    );

    return {
      stateId: row.stateId,
      targetTable: row.targetTable,
      lane: row.lane,
      sourceName: row.sourceName,
      fakeSourceUrl: row.fakeSourceUrl,
      followupType: row.followupType,
      desiredEvidence: row.desiredEvidence,
      replacementCandidates: (repairRow?.replacementCandidates || []).map((candidate) => ({
        name: candidate.name,
        url: candidate.url,
        confidence: candidate.confidence,
        origin: candidate.origin,
        matchType: candidate.matchType,
      })),
      decisionMode: '',
      chosenCandidateUrl: '',
      verifiedReplacementUrl: '',
      verifiedReplacementName: '',
      reviewNotes: '',
      reviewedBy: '',
    };
  }),
};

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  template: jsonOutPath,
  rows: payload.rows.length,
}, null, 2));
