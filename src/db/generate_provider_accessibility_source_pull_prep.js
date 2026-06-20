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
const jsonOutPath = path.join(docsDir, `provider-accessibility-source-pull-prep-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-accessibility-source-pull-prep-${generatedDate}.md`);
const db = new Database(dbPath, { readonly: true });

const FOCUS_STATES = ['florida', 'texas', 'pennsylvania', 'illinois'];
const STATE_DOC_PATHS = {
  florida: path.join(repoRoot, 'docs', 'state-source-targets', 'florida.md'),
  texas: path.join(repoRoot, 'docs', 'state-source-targets', 'texas.md'),
  pennsylvania: path.join(repoRoot, 'docs', 'state-source-targets', 'pennsylvania.md'),
  illinois: path.join(repoRoot, 'docs', 'state-source-targets', 'illinois.md'),
};

function host(url) {
  if (!url || !String(url).trim()) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

function pathHint(url) {
  if (!url || !String(url).trim()) return '';
  try {
    return new URL(url).pathname;
  } catch {
    return '';
  }
}

function parseProviderTargets(markdown) {
  const targets = [];
  for (const line of markdown.split('\n')) {
    if (!line.startsWith('| **')) continue;
    if (!line.includes('| `resource_providers` |')) continue;
    const cells = line.split('|').map((cell) => cell.trim()).filter(Boolean);
    if (cells.length < 5) continue;
    const targetName = cells[0].replace(/^\*\*|\*\*$/g, '');
    const category = cells[1];
    const domainMatch = cells[2].match(/\[([^\]]+)\]\(([^)]+)\)/);
    const crawlMethod = cells[3].replace(/`/g, '');
    const targetTable = cells[4].replace(/`/g, '');
    if (!domainMatch || targetTable !== 'resource_providers') continue;
    targets.push({
      targetName,
      category,
      sourceDomain: domainMatch[1],
      sourceUrl: domainMatch[2],
      crawlMethod,
    });
  }
  return targets;
}

function getExtractionHints(row) {
  const hints = [];
  const categories = String(row.categories || '').toLowerCase();
  const sourcePath = pathHint(row.source_url);

  hints.push('look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page');
  hints.push('check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion');

  if (categories.includes('speech')) {
    hints.push('speech/communication clinics often publish teletherapy or interpreter details on intake or services pages');
  }
  if (categories.includes('autism') || sourcePath.includes('autism')) {
    hints.push('autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages');
  }
  if (categories.includes('developmental') || sourcePath.includes('development')) {
    hints.push('developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages');
  }
  if (String(row.next_step_type || '') === 'email') {
    hints.push('email-first providers are good candidates for language/contact-form accessibility cues on their contact pages');
  }
  if (String(row.next_step_type || '') === 'call') {
    hints.push('call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages');
  }

  return [...new Set(hints)];
}

function getPriorityTargets(providerRows, stateTargets) {
  const providerHosts = new Set(providerRows.map((row) => host(row.source_url)).filter(Boolean));
  const directMatches = stateTargets.filter((target) => providerHosts.has(target.sourceDomain.toLowerCase()));
  const hospitalTargets = stateTargets.filter((target) => /hospital|clinic|autism|development|card|child/i.test(target.targetName));
  const rosterTargets = stateTargets.filter((target) => /roster/i.test(target.targetName));

  return {
    directMatches,
    hospitalTargets: hospitalTargets.slice(0, 12),
    rosterTargets: rosterTargets.slice(0, 8),
  };
}

function loadProviderRows(stateId) {
  return db.prepare(`
    SELECT resource_providers.id,
           resource_providers.name,
           resource_providers.county_id,
           counties.state_id,
           resource_providers.source_url,
           resource_providers.phone,
           resource_providers.categories,
           resource_providers.next_step_type,
           resource_providers.checked_at,
           resource_providers.last_verified_date
    FROM resource_providers
    LEFT JOIN counties ON counties.id = resource_providers.county_id
    WHERE resource_providers.source_url IS NOT NULL
      AND TRIM(resource_providers.source_url) <> ''
      AND resource_providers.verification_status IN ('official_verified','verified','human_verified','source_listed')
      AND counties.state_id = ?
    ORDER BY resource_providers.id
  `).all(stateId);
}

const states = FOCUS_STATES.map((stateId) => {
  const providerRows = loadProviderRows(stateId);
  const sourceDocPath = STATE_DOC_PATHS[stateId];
  const sourceDoc = fs.readFileSync(sourceDocPath, 'utf8');
  const stateTargets = parseProviderTargets(sourceDoc);
  const priorityTargets = getPriorityTargets(providerRows, stateTargets);

  return {
    stateId,
    providerRowCount: providerRows.length,
    providerHosts: [...new Set(providerRows.map((row) => host(row.source_url)).filter(Boolean))],
    directTargetMatches: priorityTargets.directMatches,
    hospitalTargets: priorityTargets.hospitalTargets,
    rosterTargets: priorityTargets.rosterTargets,
    providers: providerRows.map((row) => ({
      ...row,
      sourceHost: host(row.source_url),
      extractionHints: getExtractionHints(row),
    })),
  };
});

const report = {
  generatedAt: generatedDate,
  dbPath,
  focusStates: states,
};

const mdLines = [
  '# Provider Accessibility Source-Pull Prep',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This prep artifact turns the provider accessibility gap into a concrete first-party pull queue for Florida, Texas, Pennsylvania, and Illinois. It pairs the current live provider rows with matching state source-target entries and extraction hints for truthful accessibility enrichment.',
];

for (const state of states) {
  mdLines.push('', `## ${state.stateId}`, '');
  mdLines.push(`- trusted provider rows: ${state.providerRowCount}`);
  mdLines.push(`- live provider hosts: ${state.providerHosts.join(', ') || 'none'}`);

  mdLines.push('', 'Direct target matches from state source docs:', '');
  if (state.directTargetMatches.length === 0) {
    mdLines.push('- none');
  } else {
    for (const target of state.directTargetMatches) {
      mdLines.push(`- ${target.targetName}: ${target.sourceUrl} (${target.crawlMethod})`);
    }
  }

  mdLines.push('', 'Hospital and clinic source targets to pull first:', '');
  for (const target of state.hospitalTargets) {
    mdLines.push(`- ${target.targetName}: ${target.sourceUrl} (${target.crawlMethod})`);
  }

  mdLines.push('', 'Roster sources to use only as secondary discovery support:', '');
  for (const target of state.rosterTargets) {
    mdLines.push(`- ${target.targetName}: ${target.sourceUrl} (${target.crawlMethod})`);
  }

  mdLines.push('', 'Live provider rows and extraction hints:', '');
  for (const provider of state.providers) {
    mdLines.push(`- ${provider.id}: ${provider.source_url}`);
    mdLines.push(`  categories=${provider.categories || 'none'} | next_step=${provider.next_step_type || 'none'} | host=${provider.sourceHost || 'unknown'}`);
    mdLines.push(`  hints=${provider.extractionHints.join(' ; ')}`);
  }
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
