import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `provider-accessibility-enrichment-plan-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-accessibility-enrichment-plan-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });

function pct(n, d) {
  if (!d) return 0;
  return Math.round((n / d) * 1000) / 10;
}

function host(url) {
  if (!url || !String(url).trim()) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

function loadProviderRows() {
  return db.prepare(`
    SELECT resource_providers.*, counties.state_id
    FROM resource_providers
    LEFT JOIN counties ON counties.id = resource_providers.county_id
    WHERE resource_providers.source_url IS NOT NULL
      AND TRIM(resource_providers.source_url) <> ''
      AND resource_providers.verification_status IN ('official_verified','verified','human_verified','source_listed')
  `).all();
}

function hasAccessibilitySignal(row) {
  return Boolean(row.languages || row.accessibility_notes) ||
    Boolean(row.interpreter_available || row.asl_available || row.wheelchair_accessible) ||
    Boolean(row.virtual_services || row.in_person_services || row.home_visits || row.transportation_help);
}

function getStateRows(rows) {
  const byState = new Map();
  for (const row of rows) {
    const stateId = row.state_id || 'unknown';
    const stateRows = byState.get(stateId) || [];
    stateRows.push(row);
    byState.set(stateId, stateRows);
  }
  return [...byState.entries()].map(([stateId, stateRows]) => {
    const accessibilityRows = stateRows.filter(hasAccessibilitySignal);
    const uniqueHosts = [...new Set(stateRows.map((row) => host(row.source_url)).filter(Boolean))];
    return {
      stateId,
      providerRows: stateRows.length,
      accessibilityRows: accessibilityRows.length,
      accessibilityPct: pct(accessibilityRows.length, stateRows.length),
      topHosts: uniqueHosts.slice(0, 6),
      needsSourcePull: accessibilityRows.length === 0,
    };
  }).sort((a, b) => b.providerRows - a.providerRows || a.stateId.localeCompare(b.stateId));
}

function loadStagingAccessibilityCandidateCounts() {
  const stagingRows = db.prepare(`
    SELECT raw_text_excerpt
    FROM staging_scraped_resource_providers
    WHERE suggested_target_id IS NOT NULL
      AND TRIM(suggested_target_id) <> ''
  `).all();

  const patterns = {
    english: /\benglish\b/i,
    spanish: /\bspanish\b|\bespanol\b/i,
    asl: /\basl\b/i,
    interpreter: /\binterpreter\b/i,
    wheelchair: /\bwheelchair\b/i,
    transportation: /\btransportation\b|\btransport\b/i,
    homeVisits: /\bhome visit\b|\bhome visits\b/i,
    telehealth: /\btelehealth\b/i,
  };

  const totals = Object.fromEntries(Object.keys(patterns).map((key) => [key, 0]));
  for (const row of stagingRows) {
    const text = String(row.raw_text_excerpt || '');
    for (const [key, regex] of Object.entries(patterns)) {
      if (regex.test(text)) totals[key] += 1;
    }
  }
  return totals;
}

function buildExecutionLanes(stateRows) {
  const sourcePullStates = stateRows.filter((row) => row.providerRows > 0 && row.accessibilityRows === 0);
  const sustainStates = stateRows.filter((row) => row.accessibilityRows > 0);

  return {
    sourcePullStates,
    sustainStates,
  };
}

const providerRows = loadProviderRows();
const stateRows = getStateRows(providerRows);
const stagingClueTotals = loadStagingAccessibilityCandidateCounts();
const lanes = buildExecutionLanes(stateRows);

const report = {
  generatedAt: generatedDate,
  dbPath,
  summary: {
    trustedPublicProviders: providerRows.length,
    providersWithAccessibility: providerRows.filter(hasAccessibilitySignal).length,
    stagingClueTotals,
    statesWithProviderRows: stateRows.length,
    statesNeedingSourcePull: lanes.sourcePullStates.length,
  },
  states: stateRows,
  lanes,
  recommendedSequence: [
    {
      step: 1,
      label: 'Do not attempt provider accessibility backfill from checked-in staging',
      reason: 'The checked-in provider staging rows currently show zero explicit language or accessibility clues, so any automated backfill would be invented rather than source-backed.',
    },
    {
      step: 2,
      label: 'Run fresh provider source pulls for states that already have trusted provider rows',
      reason: 'These states are closest to producing a useful accessibility-rich live sample without broad new expansion.',
      targetStates: lanes.sourcePullStates.map((row) => row.stateId),
    },
    {
      step: 3,
      label: 'Prefer first-party provider pages that explicitly mention languages, telehealth, interpreter access, or transportation help',
      reason: 'This is the smallest safe path to truthful accessibility enrichment.',
    },
    {
      step: 4,
      label: 'Re-run accessibility and sample audits after each state pull',
      reason: 'The goal is to earn at least one accessibility-rich provider sample per active provider state cluster, not to bulk-fill uncertain booleans.',
    },
  ],
};

const mdLines = [
  '# Provider Accessibility Enrichment Plan',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This plan converts the current provider accessibility gap into an execution queue. It distinguishes what can be safely backfilled from checked-in data versus what requires fresh source pulls.',
  '',
  '## Summary',
  '',
  `- trusted public provider rows: ${report.summary.trustedPublicProviders}`,
  `- provider rows with any accessibility signal: ${report.summary.providersWithAccessibility}`,
  `- states with provider rows: ${report.summary.statesWithProviderRows}`,
  `- states needing fresh provider accessibility source pulls: ${report.summary.statesNeedingSourcePull}`,
  '',
  'Checked-in provider staging accessibility clue totals:',
  '',
  `- english: ${stagingClueTotals.english}`,
  `- spanish: ${stagingClueTotals.spanish}`,
  `- asl: ${stagingClueTotals.asl}`,
  `- interpreter: ${stagingClueTotals.interpreter}`,
  `- wheelchair: ${stagingClueTotals.wheelchair}`,
  `- transportation: ${stagingClueTotals.transportation}`,
  `- home visits: ${stagingClueTotals.homeVisits}`,
  `- telehealth: ${stagingClueTotals.telehealth}`,
  '',
  '## Recommended Sequence',
  '',
];

for (const step of report.recommendedSequence) {
  mdLines.push(`- Step ${step.step}: ${step.label} — ${step.reason}`);
  if (step.targetStates?.length) {
    mdLines.push(`  Targets: ${step.targetStates.join(', ')}`);
  }
}

mdLines.push('', '## State Queue', '');
for (const state of stateRows) {
  mdLines.push(`- ${state.stateId}: provider rows ${state.providerRows}, accessibility rows ${state.accessibilityRows} (${state.accessibilityPct}%), top hosts ${state.topHosts.join(', ') || 'none'}, action ${state.needsSourcePull ? 'fresh source pull required' : 'sustain and verify'}`);
}

mdLines.push('', '## Source-Pull Priority Lane', '');
for (const state of lanes.sourcePullStates) {
  mdLines.push(`- ${state.stateId}: ${state.providerRows} trusted provider rows, 0 accessibility rows, hosts ${state.topHosts.join(', ') || 'none'}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
