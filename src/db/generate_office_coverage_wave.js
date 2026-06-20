import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs/generated');
const jsonOutPath = path.join(docsDir, 'office-coverage-wave-2026-06-16.json');
const mdOutPath = path.join(docsDir, 'office-coverage-wave-2026-06-16.md');

const db = new Database(dbPath, { readonly: true });

function getExpectedCountyCount(stateId, actualCount) {
  if (stateId === 'california') return 58;
  if (stateId === 'texas') return 254;
  return actualCount;
}

function getCoreOfficePrograms(stateId, stateCode) {
  if (stateId === 'california') {
    return ['medi-cal-for-kids-and-teens', 'california-childrens-services', 'hearing-aid-coverage', 'hcba', 'ihss-for-children'];
  }
  if (stateId === 'texas') {
    return ['tx-mdcp', 'tx-medicaid-chip'];
  }
  if (stateId === 'florida') {
    return ['fl-medicaid-dcf'];
  }
  if (stateId === 'new-york') {
    return ['ny-medicaid'];
  }
  if (stateId === 'pennsylvania') {
    return ['pa-medicaid'];
  }
  if (stateId === 'illinois') {
    return ['il-medicaid'];
  }
  if (stateId === 'ohio') {
    return ['oh-medicaid'];
  }
  if (stateId === 'georgia') {
    return ['ga-medicaid'];
  }
  return [`${stateCode}-medicaid`, `${stateCode}-personal-care`];
}

function classifyGap(missingCount) {
  if (missingCount === 0) return 'complete';
  if (missingCount === 1) return 'one-county-repair';
  if (missingCount <= 5) return 'small-gap';
  if (missingCount <= 15) return 'medium-gap';
  return 'broad-gap';
}

function renderMarkdown(report) {
  const lines = [];
  lines.push('# Office Coverage Wave');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- States still missing core office coverage: ${report.summary.incompleteStates}`);
  lines.push(`- One-county repair states: ${report.summary.oneCountyRepairStates}`);
  lines.push(`- Small-gap states (2-5 counties missing): ${report.summary.smallGapStates}`);
  lines.push(`- Broad-gap states (>15 counties missing): ${report.summary.broadGapStates}`);
  lines.push('');
  lines.push('## Repair Queue');
  lines.push('');
  lines.push('| State | Missing Counties | Gap Class | Missing County IDs |');
  lines.push('| --- | ---: | --- | --- |');
  report.states.forEach((state) => {
    lines.push(`| ${state.name} | ${state.missingCountyCount} | ${state.gapClass} | ${state.missingCountyIds.join(', ')} |`);
  });
  lines.push('');
  lines.push('## Fastest Honest Wins');
  lines.push('');
  report.fastWins.forEach((state) => {
    lines.push(`- ${state.name}: ${state.missingCountyCount} counties missing (${state.missingCountyIds.join(', ')})`);
  });
  lines.push('');
  return `${lines.join('\n')}\n`;
}

const states = db.prepare('SELECT id, name, code FROM states ORDER BY name').all().map((state) => {
  const counties = db.prepare('SELECT id FROM counties WHERE state_id = ? ORDER BY id').all(state.id).map((row) => row.id);
  const expectedCountyCount = getExpectedCountyCount(state.id, counties.length);
  const programs = getCoreOfficePrograms(state.id, state.code.toLowerCase());
  const officeRows = counties.length > 0
    ? db.prepare(`
        SELECT DISTINCT county_id
        FROM county_offices
        WHERE county_id IN (${counties.map(() => '?').join(',')})
          AND program_id IN (${programs.map(() => '?').join(',')})
      `).all(...counties, ...programs).map((row) => row.county_id)
    : [];

  const coveredCountyIds = new Set(officeRows);
  const missingCountyIds = counties.filter((countyId) => !coveredCountyIds.has(countyId));
  const missingCountyCount = Math.max(0, expectedCountyCount - coveredCountyIds.size);

  return {
    id: state.id,
    name: state.name,
    expectedCountyCount,
    coveredCountyCount: coveredCountyIds.size,
    missingCountyCount,
    gapClass: classifyGap(missingCountyCount),
    missingCountyIds,
    corePrograms: programs,
  };
}).filter((state) => state.missingCountyCount > 0).sort((a, b) => {
  if (a.missingCountyCount !== b.missingCountyCount) return a.missingCountyCount - b.missingCountyCount;
  return a.name.localeCompare(b.name);
});

const report = {
  generatedAt: '2026-06-16',
  summary: {
    incompleteStates: states.length,
    oneCountyRepairStates: states.filter((state) => state.gapClass === 'one-county-repair').length,
    smallGapStates: states.filter((state) => state.gapClass === 'small-gap').length,
    broadGapStates: states.filter((state) => state.gapClass === 'broad-gap').length,
  },
  fastWins: states.filter((state) => state.missingCountyCount <= 5).slice(0, 15),
  states,
};

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(mdOutPath, renderMarkdown(report), 'utf8');

console.log(`Wrote ${path.relative(repoRoot, jsonOutPath)}`);
console.log(`Wrote ${path.relative(repoRoot, mdOutPath)}`);

db.close();
