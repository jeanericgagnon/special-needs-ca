import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const generatedDir = path.join(repoRoot, 'docs/generated');
const auditJsonPath = path.join(generatedDir, 'current-truth-audit-2026-06-16.json');
const stateConfigsPath = path.join(repoRoot, 'frontend/src/lib/stateConfigs.ts');
const publicTruthPath = path.join(repoRoot, 'frontend/src/lib/publicTruth.ts');
const outJsonPath = path.join(generatedDir, 'county-diagnosis-rollout-2026-06-16.json');
const outMdPath = path.join(generatedDir, 'county-diagnosis-rollout-2026-06-16.md');

const GENERATED_AT = '2026-06-16';
const db = new Database(dbPath, { readonly: true });

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseStateBlock(content, stateId) {
  const regex = new RegExp(`['"]${stateId}['"]\\s*:\\s*\\{([\\s\\S]*?)\\n\\s*\\}\\s*(?:,\\n\\s*['"]|\\n\\})`);
  return content.match(regex)?.[1] || '';
}

function parseStringArray(block, key) {
  const match = block.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) return [];
  return match[1]
    .split(',')
    .map((value) => value.trim().replace(/['"]/g, ''))
    .filter(Boolean);
}

function parsePublicTruthArray(content, constName) {
  const match = content.match(new RegExp(`${constName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const;`));
  if (!match) return [];
  return match[1]
    .split(',')
    .map((value) => value.trim().replace(/['"]/g, ''))
    .filter(Boolean);
}

function parsePublicTruthStateCountyMap(content, constName, fallbackArrayName) {
  const match = content.match(new RegExp(`${constName}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*as const;`));
  if (!match) return {};

  const fallbackValues = parsePublicTruthArray(content, fallbackArrayName);
  const block = match[1];
  const countyMap = {};
  const entries = [...block.matchAll(/['"]?([a-z-]+)['"]?\s*:\s*\[([^\]]*)\]|['"]?([a-z-]+)['"]?\s*:\s*HIGH_FIDELITY_COUNTY_DIAGNOSIS_IDS/g)];

  for (const entry of entries) {
    const stateId = entry[1] || entry[3];
    const inlineValues = entry[2];

    if (inlineValues !== undefined) {
      countyMap[stateId] = inlineValues
        .split(',')
        .map((value) => value.trim().replace(/['"]/g, ''))
        .filter(Boolean);
    } else {
      countyMap[stateId] = fallbackValues;
    }
  }

  return countyMap;
}

function parsePublicTruthStateKeys(content, constName) {
  const match = content.match(new RegExp(`${constName}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*as const;`));
  if (!match) return [];
  return [...match[1].matchAll(/([a-z-]+)\s*:/g)].map((result) => result[1]);
}

function getStateCountyIdSet(stateId) {
  return new Set(
    db.prepare('SELECT id FROM counties WHERE state_id = ?').all(stateId).map((row) => row.id)
  );
}

function buildStateQueue(state, stateConfigsContent, highFidelityCountyIdsByState, enabledStateIds) {
  const block = parseStateBlock(stateConfigsContent, state.id);
  const priorityCountyIds = parseStringArray(block, 'priorityMetroCounties');
  const countyIdSet = getStateCountyIdSet(state.id);
  const validPriorityCountyIds = priorityCountyIds.filter((countyId) => countyIdSet.has(countyId));
  const invalidPriorityCountyIds = priorityCountyIds.filter((countyId) => !countyIdSet.has(countyId));
  const highFidelitySet = new Set(highFidelityCountyIdsByState[state.id] || []);
  const promotedPriorityCounties = validPriorityCountyIds.filter((countyId) => highFidelitySet.has(countyId));
  const missingPriorityCounties = validPriorityCountyIds.filter((countyId) => !highFidelitySet.has(countyId));
  const codeEnabledForState = enabledStateIds.includes(state.id);
  const publicSafe = Boolean(state.verdict?.publicSafe);
  const indexSafe = Boolean(state.verdict?.indexSafe);
  const goldEligible = Boolean(state.verdict?.goldEligible);
  const promotionReadyPriorityCounties = publicSafe && indexSafe ? missingPriorityCounties : [];

  return {
    id: state.id,
    name: state.name,
    code: state.code,
    readiness: state.scores.compositeReadiness,
    publicSafe,
    indexSafe,
    goldEligible,
    codeEnabledForState,
    priorityCountyCount: priorityCountyIds.length,
    validPriorityCountyIds,
    validPriorityCount: validPriorityCountyIds.length,
    invalidPriorityCountyIds,
    invalidPriorityCount: invalidPriorityCountyIds.length,
    promotedPriorityCounties,
    promotedPriorityCount: promotedPriorityCounties.length,
    missingPriorityCounties,
    missingPriorityCount: missingPriorityCounties.length,
    promotionReadyPriorityCounties,
    promotionReadyPriorityCount: promotionReadyPriorityCounties.length,
    countyDiagnosisPriorityCoveragePct: state.countyDiagnosis?.priorityCoveragePct || 0,
    ddCoveragePct: state.coverage?.ddRouting || 0,
    officeCoveragePct: state.coverage?.localOffices || 0,
    educationCoveragePct: state.coverage?.education || 0,
    topBlocker: state.verdict.blockers[0]?.message || 'none',
  };
}

function buildWaves(queues) {
  const active = queues.filter((state) => state.missingPriorityCount > 0);

  const firstWave = active
    .filter((state) => state.publicSafe && state.indexSafe)
    .sort((a, b) => {
      if (b.readiness !== a.readiness) return b.readiness - a.readiness;
      return a.missingPriorityCount - b.missingPriorityCount;
    })
    .slice(0, 12);

  const firstWaveIds = new Set(firstWave.map((state) => state.id));
  const secondWave = active.filter((state) => !firstWaveIds.has(state.id));

  return [
    {
      id: 'wave-1',
      label: 'Near-Gold Priority Counties',
      focus: 'Promote county-diagnosis fidelity in the strongest public-safe states first.',
      stateIds: firstWave.map((state) => state.id),
    },
    {
      id: 'wave-2',
      label: 'Remaining Priority Counties',
      focus: 'Expand the same county-diagnosis promotion playbook across the rest of the states after the first metro wave is proven.',
      stateIds: secondWave.map((state) => state.id),
    },
  ];
}

function renderMarkdown(report) {
  const lines = [];
  lines.push('# County-Diagnosis Rollout Plan');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push('');
  lines.push('## Purpose');
  lines.push('');
  lines.push('- This artifact maps the county-diagnosis promotion backlog that still blocks truth-first gold.');
  lines.push('- Priority counties come from each state config `priorityMetroCounties` list.');
  lines.push(`- High-fidelity county-diagnosis counties currently enabled in code: ${report.highFidelityCountyIds.join(', ') || 'none'}.`);
  lines.push(`- States currently enabled for high-fidelity county-diagnosis in code: ${report.enabledStateIds.join(', ') || 'none'}.`);
  lines.push('');
  lines.push('## Global Status');
  lines.push('');
  lines.push(`- States already gold on county-diagnosis coverage: ${report.summary.statesComplete}`);
  lines.push(`- States still missing priority county-diagnosis coverage: ${report.summary.statesBlocked}`);
  lines.push(`- Total missing valid priority county promotions: ${report.summary.totalMissingPriorityCounties}`);
  lines.push(`- Total promotion-ready priority counties in public-safe states: ${report.summary.totalPromotionReadyPriorityCounties}`);
  lines.push(`- Total invalid priority county config slugs: ${report.summary.totalInvalidPriorityCountyIds}`);
  lines.push('');
  lines.push('## Priority Queue');
  lines.push('');
  lines.push('| State | Readiness | Code Enabled | Public Safe | Gold Eligible | Valid Priority Counties | Promoted | Missing | Ready Now | Invalid Config | Coverage | First Missing Counties |');
  lines.push('| --- | ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |');
  report.states.forEach((state) => {
    lines.push(`| ${state.name} | ${state.readiness}% | ${state.codeEnabledForState ? 'yes' : 'no'} | ${state.publicSafe ? 'yes' : 'no'} | ${state.goldEligible ? 'yes' : 'no'} | ${state.validPriorityCount} | ${state.promotedPriorityCount} | ${state.missingPriorityCount} | ${state.promotionReadyPriorityCount} | ${state.invalidPriorityCount} | ${state.countyDiagnosisPriorityCoveragePct}% | ${state.missingPriorityCounties.slice(0, 5).join(', ') || 'none'} |`);
  });
  lines.push('');
  lines.push('## Config Issues');
  lines.push('');
  const invalidStates = report.states.filter((state) => state.invalidPriorityCount > 0);
  if (invalidStates.length === 0) {
    lines.push('- No invalid priority county slugs found against the current counties table.');
  } else {
    invalidStates.forEach((state) => {
      lines.push(`- ${state.name}: invalid priority county IDs -> ${state.invalidPriorityCountyIds.join(', ')}`);
    });
  }
  lines.push('');
  lines.push('## Waves');
  lines.push('');
  report.waves.forEach((wave) => {
    lines.push(`### ${wave.label}`);
    lines.push('');
    lines.push(`- Focus: ${wave.focus}`);
    lines.push(`- States: ${wave.stateIds.join(', ') || 'none'}`);
    lines.push('');
  });
  lines.push('## Top Near-Gold States');
  lines.push('');
  report.topStates.forEach((state) => {
    lines.push(`- ${state.name}: ${state.readiness}% readiness, ${state.countyDiagnosisPriorityCoveragePct}% county-diagnosis priority coverage, ${state.promotionReadyPriorityCount} promotion-ready counties now (${state.promotionReadyPriorityCounties.slice(0, 6).join(', ') || 'none'}).`);
  });
  lines.push('');
  return `${lines.join('\n')}\n`;
}

const audit = readJson(auditJsonPath);
const stateConfigsContent = fs.readFileSync(stateConfigsPath, 'utf8');
const publicTruthContent = fs.readFileSync(publicTruthPath, 'utf8');
const highFidelityCountyIdsByState = parsePublicTruthStateCountyMap(
  publicTruthContent,
  'HIGH_FIDELITY_COUNTY_DIAGNOSIS_COUNTIES_BY_STATE',
  'HIGH_FIDELITY_COUNTY_DIAGNOSIS_IDS'
);
const enabledStateIds = parsePublicTruthStateKeys(publicTruthContent, 'HIGH_FIDELITY_COUNTY_DIAGNOSIS_COUNTIES_BY_STATE');
const highFidelityCountyIds = [...new Set(Object.values(highFidelityCountyIdsByState).flat())];

const states = audit.states
  .map((state) => buildStateQueue(state, stateConfigsContent, highFidelityCountyIdsByState, enabledStateIds))
  .sort((a, b) => {
    if (a.missingPriorityCount !== b.missingPriorityCount) return a.missingPriorityCount - b.missingPriorityCount;
    return b.readiness - a.readiness;
  });

const report = {
  generatedAt: GENERATED_AT,
  highFidelityCountyIds,
  enabledStateIds,
  summary: {
    statesComplete: states.filter((state) => state.missingPriorityCount === 0).length,
    statesBlocked: states.filter((state) => state.missingPriorityCount > 0).length,
    totalMissingPriorityCounties: states.reduce((sum, state) => sum + state.missingPriorityCount, 0),
    totalPromotionReadyPriorityCounties: states.reduce((sum, state) => sum + state.promotionReadyPriorityCount, 0),
    totalInvalidPriorityCountyIds: states.reduce((sum, state) => sum + state.invalidPriorityCount, 0),
  },
  waves: buildWaves(states),
  topStates: [...states]
    .filter((state) => state.publicSafe && state.indexSafe && state.missingPriorityCount > 0)
    .sort((a, b) => {
      if (a.missingPriorityCount !== b.missingPriorityCount) return a.missingPriorityCount - b.missingPriorityCount;
      return b.readiness - a.readiness;
    })
    .slice(0, 15),
  states,
};

fs.mkdirSync(generatedDir, { recursive: true });
fs.writeFileSync(outJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(outMdPath, renderMarkdown(report), 'utf8');

console.log(`Wrote ${path.relative(repoRoot, outJsonPath)}`);
console.log(`Wrote ${path.relative(repoRoot, outMdPath)}`);
db.close();
