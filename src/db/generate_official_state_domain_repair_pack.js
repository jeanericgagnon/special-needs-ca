import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const stateUpgradesDir = path.join(repoRoot, 'data', 'state-upgrades');
const stateSourceTargetsDocsDir = path.join(repoRoot, 'docs', 'state-source-targets');
const stateReportsDir = path.join(repoRoot, 'docs', 'state-reports');
const sourcePacksDir = path.join(repoRoot, 'data', 'source_packs');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const formsFallbackManualResolutionsPath = path.join(sourcePacksDir, 'forms_fallback_manual_resolutions.json');
const stateProgramsMapPath = path.join(repoRoot, 'data', 'state_programs_map.json');
const quarantinePath = path.join(repoRoot, 'docs', 'national-rollout', 'source-target-quarantine-list.md');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(sourcePacksDir, 'official_state_domain_repairs.json');
const mdOutPath = path.join(docsDir, `official-state-domain-repair-pack-${generatedDate}.md`);

function normalizeUrl(rawUrl) {
  if (!rawUrl || !String(rawUrl).trim()) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) {
      parsed.port = '';
    }
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function parseMarkdownTable(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const rows = [];
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    if (line.includes(':---') || line.includes('---')) continue;
    const parts = line.split('|').slice(1, -1).map((part) => part.trim());
    if (parts[0] === 'State' || parts.length < 6) continue;
    rows.push(parts);
  }
  return rows;
}

function getDomain(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function isGeneratedOfficialPlaceholder(url) {
  if (!url) return false;
  return /https:\/\/(dhhs|education)\./.test(url) || url.includes('alabama-education.gov');
}

const weakThirdPartyHintDomains = new Set([
  'copaa.org',
]);

function parseQuarantineRows() {
  const rows = parseMarkdownTable(quarantinePath);
  return rows.map(([state, sourceName, targetTable, classification, reason, flaggedUrl]) => ({
    stateId: slugify(state),
    sourceName,
    targetTable,
    classification: classification.replace(/`/g, ''),
    reason,
    flaggedUrl: normalizeUrl(flaggedUrl),
  }));
}

function parseSourceTargets() {
  const entries = [];
  if (!fs.existsSync(sourceTargetsDir)) return entries;
  for (const fileName of fs.readdirSync(sourceTargetsDir).filter((name) => name.endsWith('.json')).sort()) {
    const stateId = fileName.replace(/\.json$/, '');
    const payload = JSON.parse(fs.readFileSync(path.join(sourceTargetsDir, fileName), 'utf8'));
    const items = Array.isArray(payload) ? payload : payload.targets || [];
    for (const item of items) {
      entries.push({
        stateId,
        sourceName: item.source_name || '',
        sourceUrl: normalizeUrl(item.source_url || ''),
        targetTable: item.target_table || '',
        notes: item.notes || '',
        category: item.category || '',
        specificSubcategory: item.specific_subcategory || '',
      });
    }
  }
  return entries;
}

function parseStateSourceTargetDocs() {
  const entries = [];
  if (!fs.existsSync(stateSourceTargetsDocsDir)) return entries;

  for (const fileName of fs.readdirSync(stateSourceTargetsDocsDir).filter((name) => name.endsWith('.md')).sort()) {
    const stateId = fileName.replace(/\.md$/, '');
    const content = fs.readFileSync(path.join(stateSourceTargetsDocsDir, fileName), 'utf8');
    const blocks = content.split(/\n### Category:/g);

    for (let index = 1; index < blocks.length; index += 1) {
      const block = blocks[index];
      const section = `### Category:${block}`;
      const sourceName = section.match(/- \*\*Source Name:\*\* ([^\n]+)/)?.[1]?.trim() || '';
      const sourceUrl = normalizeUrl(section.match(/- \*\*Source URL:\*\* \[[^\]]+\]\((https?:\/\/[^)]+)\)/)?.[1] || '');
      const targetTable = section.match(/- \*\*Target Table:\*\* `([^`]+)`/)?.[1]?.trim() || '';
      const notes = section.match(/- \*\*Notes:\*\* ([^\n]+)/)?.[1]?.trim() || '';
      const category = section.match(/^### Category:\s*([^\n]+)/)?.[1]?.trim() || '';

      if (!sourceUrl || !targetTable) continue;

      entries.push({
        stateId,
        sourceName,
        sourceUrl,
        targetTable,
        notes,
        category,
        specificSubcategory: '',
        origin: 'state_source_targets_doc',
      });
    }
  }

  return entries;
}

function parseFormsFallbackManualResolutions() {
  if (!fs.existsSync(formsFallbackManualResolutionsPath)) return [];
  const payload = JSON.parse(fs.readFileSync(formsFallbackManualResolutionsPath, 'utf8'));
  const rows = Array.isArray(payload) ? payload : Array.isArray(payload.rows) ? payload.rows : [];

  return rows
    .map((row) => ({
      stateId: row.stateId || '',
      sourceName: row.sourceName || '',
      sourceUrl: normalizeUrl(row.sourceUrl || ''),
      blockedFormsSourceUrl: normalizeUrl(row.blockedFormsSourceUrl || ''),
      candidateType: row.candidateType || '',
      resolutionMode: row.resolutionMode || '',
      origin: 'forms_fallback_manual_resolution',
      category: 'forms',
      targetTable: 'forms',
    }))
    .filter((row) => row.stateId && row.sourceUrl && row.blockedFormsSourceUrl);
}

function parseStateProgramsMapHints() {
  if (!fs.existsSync(stateProgramsMapPath)) return [];
  const payload = JSON.parse(fs.readFileSync(stateProgramsMapPath, 'utf8'));
  const hints = [];

  for (const value of Object.values(payload)) {
    if (!value || typeof value !== 'object') continue;
    const stateId = slugify(value.state_name || '');
    if (!stateId) continue;

    const pushHints = (program, category) => {
      if (!program || typeof program !== 'object') return;
      for (const [kind, rawUrl] of Object.entries({
        landing_page: program.landing_page,
        eligibility_url: program.eligibility_url,
      })) {
        const url = normalizeUrl(rawUrl || '');
        if (!url) continue;
        hints.push({
          stateId,
          category,
          name: program.name || `${stateId} ${category}`,
          url,
          origin: 'state_programs_map',
          hintKind: kind,
        });
      }
    };

    pushHints(value.developmental_services, 'dd_idd');
    pushHints(value.hcbs_waivers, 'waiver');
    pushHints(value.personal_care, 'medicaid');
  }

  return hints;
}

function parseStateReportHints() {
  const hints = [];
  if (!fs.existsSync(stateReportsDir)) return hints;

  for (const fileName of fs.readdirSync(stateReportsDir).filter((name) => name.endsWith('.md')).sort()) {
    const stateId = fileName.replace(/\.md$/, '');
    const content = fs.readFileSync(path.join(stateReportsDir, fileName), 'utf8');

    for (const match of content.matchAll(/- \*\*([^*]+)\*\* \((?:State Program|dd_intake|early_intervention)[^)]+\): (?:Source URL|Website): (https?:\/\/\S+)/g)) {
      hints.push({
        stateId,
        name: match[1].trim(),
        url: normalizeUrl(match[2]),
        origin: 'state_report',
      });
    }
  }

  return hints;
}

function readStateUpgradeHints(stateId) {
  const baseDir = path.join(stateUpgradesDir, stateId);
  const hints = [];

  const sourceTargetsPath = path.join(baseDir, 'source_targets.json');
  if (fs.existsSync(sourceTargetsPath)) {
    const payload = JSON.parse(fs.readFileSync(sourceTargetsPath, 'utf8'));
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload.targets)
        ? payload.targets
        : [];

    for (const item of items) {
      const url = normalizeUrl(item.url || item.source_url || item.sourceUrl || '');
      if (!url) continue;
      hints.push({
        origin: 'state_upgrade_source_targets',
        category: item.category || '',
        name: item.name || item.source_name || item.sourceName || '',
        url,
      });
    }

    if (payload.sources && typeof payload.sources === 'object') {
      for (const [key, value] of Object.entries(payload.sources)) {
        const url = normalizeUrl(value);
        if (!url) continue;
        hints.push({
          origin: 'state_upgrade_sources_object',
          category: key,
          name: `${stateId} ${key}`,
          url,
        });
      }
    }
  }

  return hints;
}

function inferLane(row) {
  const targetTable = String(row.targetTable || '').toLowerCase();
  const sourceName = String(row.sourceName || '').toLowerCase();
  const sourceUrl = String(row.sourceUrl || row.flaggedUrl || '').toLowerCase();

  if (targetTable === 'forms') return 'forms_library';
  if (sourceName.includes('early steps') || sourceName.includes('early intervention') || sourceName.includes('part c') || sourceUrl.includes('earlyintervention')) {
    return 'early_intervention';
  }
  if (sourceName.includes('special ed') || sourceName.includes('exceptional children')) {
    return targetTable === 'regional_education_agencies' || targetTable === 'school_districts'
      ? 'education_routing'
      : 'special_education';
  }
  if (sourceName.includes('rehab') || sourceName.includes('vocational')) return 'vocational_rehabilitation';
  if (sourceName.includes('waiver') || sourceUrl.includes('/waiver')) return 'waiver_program';

  if (targetTable === 'county_offices') return 'medicaid_county_directory';
  if (targetTable === 'state_resource_agencies') return 'dd_state_directory';
  if (targetTable === 'regional_education_agencies' || targetTable === 'school_districts') return 'education_routing';

  if (targetTable === 'programs') {
    if (sourceName.includes('education')) return 'special_education';
    return 'official_program';
  }
  return 'official_other';
}

function desiredEvidenceForLane(lane) {
  const map = {
    medicaid_county_directory: 'Verified official county or regional Medicaid / social services directory URL.',
    dd_state_directory: 'Verified official DD/IDD intake or regional office directory URL.',
    waiver_program: 'Verified official waiver program page on a first-party state agency domain.',
    early_intervention: 'Verified official Part C / early intervention page or local intake directory.',
    special_education: 'Verified official special education division or dispute-resolution page.',
    education_routing: 'Verified official regional education or district directory page.',
    forms_library: 'Verified official forms, downloads, or publications library.',
    vocational_rehabilitation: 'Verified official vocational rehabilitation program page.',
    official_program: 'Verified official first-party program page.',
    official_other: 'Verified official first-party replacement URL.',
  };
  return map[lane] || map.official_other;
}

function categoriesForLane(lane) {
  const map = {
    medicaid_county_directory: ['benefits_hhs', 'dcf', 'medicaid'],
    dd_state_directory: ['dd_idd', 'apd', 'developmental'],
    early_intervention: ['early_intervention', 'part_c'],
    special_education: ['education_regional', 'special_education'],
    education_routing: ['education_regional', 'school_districts'],
    forms_library: ['forms'],
    vocational_rehabilitation: ['vr', 'rehab'],
    waiver_program: ['waiver', 'caregiver'],
  };
  return map[lane] || [];
}

function findReplacementCandidates(row, stateUpgradeHints, allSourceTargets, stateSourceTargetDocs, formsFallbackManualResolutions, stateProgramsMapHints, stateReportHints) {
  const lane = inferLane(row);
  const categories = categoriesForLane(lane);
  const stateRows = allSourceTargets.filter((item) => item.stateId === row.stateId);
  const docRows = stateSourceTargetDocs.filter((item) => item.stateId === row.stateId);
  const formsRows = formsFallbackManualResolutions.filter((item) => item.stateId === row.stateId && item.blockedFormsSourceUrl === row.flaggedUrl);
  const programRows = stateProgramsMapHints.filter((item) => item.stateId === row.stateId);
  const reportRows = stateReportHints.filter((item) => item.stateId === row.stateId);
  const candidates = [];

  for (const hint of stateUpgradeHints) {
    const category = String(hint.category || '').toLowerCase();
    if (!categories.some((needle) => category.includes(needle))) continue;
    candidates.push({
      origin: hint.origin,
      name: hint.name,
      url: hint.url,
      matchType: 'state_upgrade_hint',
      confidence: hint.origin === 'state_upgrade_source_targets' ? 'medium' : 'low',
    });
  }

  if (lane === 'forms_library') {
    for (const item of formsRows) {
      candidates.push({
        origin: item.origin,
        name: item.sourceName,
        url: item.sourceUrl,
        matchType: 'forms_fallback_manual_resolution',
        confidence: isLikelyFirstPartyRootHint({
          url: item.sourceUrl,
          origin: item.origin,
        }, row)
          ? 'medium'
          : 'low',
      });
    }
  }

  for (const hint of programRows) {
    const category = String(hint.category || '').toLowerCase();
    if (!categories.some((needle) => category.includes(needle))) continue;
    candidates.push({
      origin: hint.origin,
      name: hint.name,
      url: hint.url,
      matchType: 'state_programs_map',
      confidence: isLikelyFirstPartyRootHint({
        url: hint.url,
        origin: hint.origin,
      }, row) && (lane === 'dd_state_directory' || lane === 'waiver_program')
        ? 'medium'
        : 'low',
    });
  }

  for (const item of reportRows) {
    if (!item.url || item.url === row.flaggedUrl) continue;
    if (isGeneratedOfficialPlaceholder(item.url)) continue;
    if (inferLane({
      sourceName: item.name,
      sourceUrl: item.url,
      targetTable: lane === 'education_routing' ? 'regional_education_agencies' : 'programs',
    }) !== lane) continue;

    candidates.push({
      origin: item.origin,
      name: item.name,
      url: item.url,
      matchType: 'state_report_same_lane',
      confidence: isLikelyFirstPartyRootHint({
        url: item.url,
        origin: item.origin,
      }, row) && lane !== 'medicaid_county_directory'
        ? 'medium'
        : 'low',
    });
  }

  for (const item of docRows) {
    if (!item.sourceUrl || item.sourceUrl === row.flaggedUrl) continue;
    if (isGeneratedOfficialPlaceholder(item.sourceUrl)) continue;
    if (inferLane(item) !== lane) continue;

    const confidence = item.targetTable === row.targetTable && isLikelyFirstPartyRootHint({
      url: item.sourceUrl,
      origin: item.origin,
    }, row)
      ? 'medium'
      : 'low';

    candidates.push({
      origin: item.origin,
      name: item.sourceName,
      url: item.sourceUrl,
      matchType: 'state_source_targets_doc_same_lane',
      confidence,
    });
  }

  if (lane !== 'official_program') {
    for (const item of stateRows) {
      if (!item.sourceUrl || item.sourceUrl === row.flaggedUrl) continue;
      if (isGeneratedOfficialPlaceholder(item.sourceUrl)) continue;
      if (inferLane(item) !== lane) continue;
      candidates.push({
        origin: 'existing_state_source_targets',
        name: item.sourceName,
        url: item.sourceUrl,
        matchType: 'same_state_same_lane',
        confidence: item.targetTable === row.targetTable ? 'medium' : 'low',
      });
    }
  }

  const deduped = [];
  const seen = new Set();
  for (const candidate of candidates) {
    const key = `${candidate.url}|${candidate.origin}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(candidate);
  }

  return deduped;
}

function isLikelyFirstPartyRootHint(candidate, row) {
  const domain = getDomain(candidate.url);
  if (!domain || weakThirdPartyHintDomains.has(domain)) return false;
  if ((candidate.origin || '').startsWith('state_upgrade')) return true;
  if (/\.gov$|\.us$/i.test(domain)) return true;

  const stateTokens = String(row.stateId || '')
    .split('-')
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length > 2);

  return stateTokens.some((token) => domain.includes(token));
}

function buildRepairRows() {
  const quarantineRows = parseQuarantineRows();
  const sourceTargets = parseSourceTargets();
  const stateSourceTargetDocs = parseStateSourceTargetDocs();
  const formsFallbackManualResolutions = parseFormsFallbackManualResolutions();
  const stateProgramsMapHints = parseStateProgramsMapHints();
  const stateReportHints = parseStateReportHints();
  const activeSourceTargetKeys = new Set(
    sourceTargets.map((row) => `${row.stateId}|${row.targetTable}|${row.sourceName}|${row.sourceUrl}`),
  );
  const officialTables = new Set([
    'county_offices',
    'state_resource_agencies',
    'forms',
    'programs',
    'regional_education_agencies',
    'school_districts',
  ]);
  const generatedFakeRows = quarantineRows.filter((row) =>
    row.classification === 'generated_fake_domain' &&
    officialTables.has(row.targetTable) &&
    activeSourceTargetKeys.has(`${row.stateId}|${row.targetTable}|${row.sourceName}|${row.flaggedUrl}`),
  );
  const sourceTargetByKey = new Map(
    sourceTargets.map((row) => [`${row.stateId}|${row.targetTable}|${row.sourceName}|${row.sourceUrl}`, row]),
  );

  return generatedFakeRows.map((row) => {
    const sourceTarget = sourceTargetByKey.get(`${row.stateId}|${row.targetTable}|${row.sourceName}|${row.flaggedUrl}`) || null;
    const stateUpgradeHints = readStateUpgradeHints(row.stateId);
    const lane = inferLane({
      ...row,
      sourceUrl: row.flaggedUrl,
    });
    const replacementCandidates = findReplacementCandidates(
      row,
      stateUpgradeHints,
      sourceTargets,
      stateSourceTargetDocs,
      formsFallbackManualResolutions,
      stateProgramsMapHints,
      stateReportHints,
    );
    const exactCandidates = replacementCandidates.filter((candidate) => candidate.confidence === 'medium');
    const rootHintCandidates = replacementCandidates.filter((candidate) => candidate.confidence === 'low');
    const firstPartyRootHintCandidates = rootHintCandidates.filter((candidate) => isLikelyFirstPartyRootHint(candidate, row));
    const weakRootHintCandidates = rootHintCandidates.filter((candidate) => !isLikelyFirstPartyRootHint(candidate, row));

    return {
      stateId: row.stateId,
      targetTable: row.targetTable,
      lane,
      sourceName: row.sourceName,
      fakeSourceUrl: row.flaggedUrl,
      fakeDomain: getDomain(row.flaggedUrl),
      quarantineReason: row.reason,
      scaffoldNotes: sourceTarget?.notes || '',
      desiredEvidence: desiredEvidenceForLane(lane),
      replacementMode: exactCandidates.length
        ? 'exact_candidate_available'
        : firstPartyRootHintCandidates.length
          ? 'first_party_root_hint_only'
          : weakRootHintCandidates.length
            ? 'third_party_cross_state_hint_only'
          : 'no_candidate_yet',
      replacementCandidates,
      exactCandidateCount: exactCandidates.length,
      rootHintCount: rootHintCandidates.length,
      firstPartyRootHintCount: firstPartyRootHintCandidates.length,
      weakRootHintCount: weakRootHintCandidates.length,
    };
  });
}

const repairRows = buildRepairRows().sort((a, b) =>
  a.stateId.localeCompare(b.stateId) ||
  a.targetTable.localeCompare(b.targetTable) ||
  a.sourceName.localeCompare(b.sourceName)
);

const summary = {
  totalRepairRows: repairRows.length,
  statesAffected: new Set(repairRows.map((row) => row.stateId)).size,
  exactCandidateRows: repairRows.filter((row) => row.replacementMode === 'exact_candidate_available').length,
  firstPartyRootHintRows: repairRows.filter((row) => row.replacementMode === 'first_party_root_hint_only').length,
  weakThirdPartyHintRows: repairRows.filter((row) => row.replacementMode === 'third_party_cross_state_hint_only').length,
  noCandidateRows: repairRows.filter((row) => row.replacementMode === 'no_candidate_yet').length,
  byLane: countBy(repairRows, 'lane'),
  byTargetTable: countBy(repairRows, 'targetTable'),
  byReplacementMode: countBy(repairRows, 'replacementMode'),
};

const payload = {
  packId: 'official_state_domain_repairs',
  generatedAt: generatedDate,
  purpose: 'Deterministic repair queue for fake/generated official source targets that should not remain hidden in scaffold files.',
  summary,
  rows: repairRows,
};

const mdLines = [
  '# Official State Domain Repair Pack',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This pack turns fake/generated official source targets into an explicit repair queue instead of leaving them buried in scaffold data.',
  '',
  '## Summary',
  '',
  `- total repair rows: ${summary.totalRepairRows}`,
  `- states affected: ${summary.statesAffected}`,
  `- rows with exact replacement candidates: ${summary.exactCandidateRows}`,
  `- rows with first-party root-hint-only candidates: ${summary.firstPartyRootHintRows}`,
  `- rows with weak third-party hint-only candidates: ${summary.weakThirdPartyHintRows}`,
  `- rows with no candidate yet: ${summary.noCandidateRows}`,
  '',
  '## By Lane',
  '',
];

for (const [lane, count] of Object.entries(summary.byLane).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${lane}: ${count}`);
}

mdLines.push('', '## By Replacement Mode', '');
for (const [mode, count] of Object.entries(summary.byReplacementMode).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${mode}: ${count}`);
}

mdLines.push('', '## Highest-Need States', '');
const byState = Object.entries(countBy(repairRows, 'stateId')).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
for (const [stateId, count] of byState.slice(0, 20)) {
  const rows = repairRows.filter((row) => row.stateId === stateId);
  const exact = rows.filter((row) => row.replacementMode === 'exact_candidate_available').length;
  mdLines.push(`- ${stateId}: total=${count}, exactCandidates=${exact}`);
}

mdLines.push('', '## Sample Repair Rows', '');
for (const row of repairRows.slice(0, 20)) {
  mdLines.push(`- ${row.stateId} | ${row.targetTable} | ${row.lane} | ${row.fakeSourceUrl} | ${row.replacementMode}`);
}

mdLines.push('', '## Files', '');
mdLines.push(`- JSON pack: ${path.relative(repoRoot, jsonOutPath)}`);
mdLines.push(`- Markdown report: ${path.relative(repoRoot, mdOutPath)}`);

fs.mkdirSync(sourcePacksDir, { recursive: true });
fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  pack: jsonOutPath,
  report: mdOutPath,
  summary,
}, null, 2));
