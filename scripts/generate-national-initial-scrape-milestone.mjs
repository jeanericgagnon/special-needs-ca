import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const auditPath = path.join(repoRoot, 'data', 'generated', 'all_state_california_grade_audit_v3.json');
const outJsonPath = path.join(repoRoot, 'data', 'generated', 'national_initial_scrape_v1.json');
const outMdPath = path.join(repoRoot, 'docs', 'generated', 'national-initial-scrape-v1.md');

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const completeStates = audit.states.filter((state) => state.classification === 'COMPLETE').map((state) => state.stateId);
const blockedStates = audit.states.filter((state) => state.classification === 'BLOCKED').map((state) => state.stateId);

const payload = {
  milestoneId: 'national-initial-scrape-v1',
  generatedAt: new Date().toISOString(),
  completeStates: completeStates.length,
  blockedStates: blockedStates.length,
  incorrectlyIndexSafeStates: audit.incorrectlyIndexSafeStates || [],
  indexSafeStates: audit.indexSafeCount,
  completeStateIds: completeStates,
  blockedStateIds: blockedStates,
};

fs.mkdirSync(path.dirname(outJsonPath), { recursive: true });
fs.mkdirSync(path.dirname(outMdPath), { recursive: true });
fs.writeFileSync(outJsonPath, `${JSON.stringify(payload, null, 2)}\n`);

const md = [
  '# National Initial Scrape v1',
  '',
  `Generated at: ${payload.generatedAt}`,
  '',
  '- Milestone: `national-initial-scrape-v1`',
  `- COMPLETE states: ${payload.completeStates}`,
  `- BLOCKED states: ${payload.blockedStates}`,
  `- index-safe states: ${payload.indexSafeStates}`,
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
console.log(`Wrote ${outJsonPath}`);
console.log(`Wrote ${outMdPath}`);
