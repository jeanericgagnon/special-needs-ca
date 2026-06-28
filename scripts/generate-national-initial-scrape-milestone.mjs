import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const auditPath = path.join(repoRoot, 'data', 'generated', 'all_state_california_grade_audit_v3.json');
const canonicalJsonPath = path.join(repoRoot, 'data', 'generated', 'national-initial-scrape-v1.json');
const legacyJsonPath = path.join(repoRoot, 'data', 'generated', 'national_initial_scrape_v1.json');
const outMdPath = path.join(repoRoot, 'docs', 'generated', 'national-initial-scrape-v1.md');

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const completeStates = audit.states.filter((state) => state.classification === 'COMPLETE').map((state) => state.stateId);
const blockedStates = audit.states.filter((state) => state.classification === 'BLOCKED').map((state) => state.stateId);

const payload = {
  milestone: 'national-initial-scrape-v1',
  generatedAt: new Date().toISOString(),
  phase: 'transition_to_data_governance',
  summary: {
    completeStates: completeStates.length,
    blockedStates: blockedStates.length,
    indexSafeStates: audit.indexSafeCount,
    incorrectlyIndexSafeStates: (audit.incorrectlyIndexSafeStates || []).length,
  },
  incorrectlyIndexSafeStates: audit.incorrectlyIndexSafeStates || [],
  completeStateIds: completeStates,
  blockedStateIds: blockedStates,
  sourceArtifacts: {
    allStateAudit: 'data/generated/all_state_california_grade_audit_v3.json',
    priorityQueue: 'data/generated/all_state_priority_queue_v3.jsonl',
  },
  notes: [
    'This milestone freezes the 45-state initial scrape baseline.',
    'From this point forward, work should treat scraping as a completed baseline and move into data governance, truth maintenance, and blocker preservation.',
  ],
};

fs.mkdirSync(path.dirname(canonicalJsonPath), { recursive: true });
fs.mkdirSync(path.dirname(outMdPath), { recursive: true });
fs.writeFileSync(canonicalJsonPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(legacyJsonPath, `${JSON.stringify({
  milestoneId: payload.milestone,
  generatedAt: payload.generatedAt,
  completeStates: payload.summary.completeStates,
  blockedStates: payload.summary.blockedStates,
  incorrectlyIndexSafeStates: payload.incorrectlyIndexSafeStates,
  indexSafeStates: payload.summary.indexSafeStates,
  completeStateIds: payload.completeStateIds,
  blockedStateIds: payload.blockedStateIds,
}, null, 2)}\n`);

const md = [
  '# National Initial Scrape v1',
  '',
  `Generated at: ${payload.generatedAt}`,
  '',
  '- Milestone: `national-initial-scrape-v1`',
  `- COMPLETE states: ${payload.summary.completeStates}`,
  `- BLOCKED states: ${payload.summary.blockedStates}`,
  `- index-safe states: ${payload.summary.indexSafeStates}`,
  `- incorrectly index-safe states: ${payload.incorrectlyIndexSafeStates.length}`,
  '',
  '## COMPLETE',
  payload.completeStateIds.join(', '),
  '',
  '## BLOCKED',
  payload.blockedStateIds.join(', '),
  '',
].join('\n');

fs.writeFileSync(outMdPath, `${md}\n`);
console.log(`Wrote ${canonicalJsonPath}`);
console.log(`Wrote ${legacyJsonPath}`);
console.log(`Wrote ${outMdPath}`);
