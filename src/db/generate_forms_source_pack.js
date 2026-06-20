import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const sourcePacksDir = path.join(repoRoot, 'data', 'source_packs');
const generatedDate = new Date().toISOString().slice(0, 10);
const formsFallbackManualResolutionsPath = path.join(sourcePacksDir, 'forms_fallback_manual_resolutions.json');

const jsonOutPath = path.join(sourcePacksDir, 'forms_source_pack.json');
const mdOutPath = path.join(docsDir, `forms-source-pack-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function normalizeUrl(rawUrl) {
  if (!rawUrl || !String(rawUrl).trim()) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

function domainFromUrl(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function latestGeneratedJson(prefix) {
  const entries = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!entries.length) {
    throw new Error(`No generated artifact found for prefix ${prefix}`);
  }
  return path.join(docsDir, entries[entries.length - 1]);
}

function inferCandidateType(row) {
  const text = `${row.sourceName || ''} ${row.sourceUrl || ''} ${row.category || ''}`.toLowerCase();
  if (/forms|publications|downloads|laws-regulations\/forms|\.pdf\b|\.docx?\b/.test(text)) return 'exact_forms_library';
  if (/procedural safeguards|state complaint form|appeals|hearings/.test(text)) return 'appeal_or_notice_form';
  if (/eligibility|hcbs|waiver|cdc\+|cap\/c|referral|evaluation request guide/.test(text)) return 'application_or_eligibility_guide';
  return 'general_form_related_page';
}

function candidatePriority(type) {
  const map = {
    exact_forms_library: 4,
    appeal_or_notice_form: 3,
    application_or_eligibility_guide: 2,
    general_form_related_page: 1,
  };
  return map[type] || 0;
}

function classifyReplacement(candidates) {
  if (!candidates.length) return 'no_state_specific_form_candidate';
  if (candidates[0].candidateType === 'exact_forms_library') return 'exact_forms_library_available';

  const hasStateSpecificCandidate = candidates.some((candidate) => !/^ssa\.gov$/i.test(candidate.domain || ''));
  if (hasStateSpecificCandidate) return 'state_specific_form_fallback_only';

  return 'federal_only_form_fallback';
}

function canonicalTargetClass(replacementClass) {
  if (replacementClass === 'exact_forms_library_available') return 'exact_official_forms_library';
  if (replacementClass === 'state_specific_form_fallback_only') return 'approved_state_specific_fallback_root';
  if (replacementClass === 'federal_only_form_fallback') return 'approved_federal_only_fallback';
  return 'unresolved_no_candidate';
}

function buildBlockedFormsByState(ledger) {
  const blocked = ledger.ledger.filter((row) => row.targetTable === 'forms' && row.ledgerStatus === 'do_not_use');
  return new Map(blocked.map((row) => [row.stateId, row]));
}

function readFallbackManualResolutions() {
  if (!fs.existsSync(formsFallbackManualResolutionsPath)) return [];
  const payload = readJson(formsFallbackManualResolutionsPath);
  return Array.isArray(payload?.rows) ? payload.rows : [];
}

function dedupeCandidates(candidates) {
  const seen = new Set();
  const deduped = [];
  for (const candidate of candidates) {
    const key = `${candidate.sourceUrl}|${candidate.sourceName}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(candidate);
  }
  return deduped;
}

function buildManualResolutionCandidates(blockedFormsByState) {
  const rows = readFallbackManualResolutions();
  const byState = new Map();

  for (const row of rows) {
    if (!blockedFormsByState.has(row.stateId)) continue;
    const candidate = {
      stateId: row.stateId,
      sourceName: row.sourceName,
      sourceUrl: normalizeUrl(row.sourceUrl),
      domain: row.domain || domainFromUrl(row.sourceUrl),
      candidateType: inferCandidateType(row),
      priority: candidatePriority(inferCandidateType(row)),
      recordCount: 0,
      verificationStatus: 'reviewed',
      whyNeeded: row.reviewNotes || 'Reviewed state-specific forms fallback candidate from saved manual resolution artifact.',
      origin: row.resolutionMode ? `forms_fallback_manual_resolution:${row.resolutionMode}` : 'forms_fallback_manual_resolution',
    };
    const current = byState.get(row.stateId) || [];
    current.push(candidate);
    byState.set(row.stateId, current);
  }

  return byState;
}

function buildCandidateRows(dbDiscovered, blockedFormsByState) {
  const actionable = dbDiscovered.actionableNewTargets || [];
  const manualResolutionCandidates = buildManualResolutionCandidates(blockedFormsByState);
  const filtered = actionable
    .filter((row) => row.targetTable === 'forms')
    .filter((row) => row.sourceFamily === 'official_government')
    .filter((row) => row.verificationStatus === 'verified')
    .filter((row) => row.ledgerStatus === 'ready_pdf')
    .filter((row) => blockedFormsByState.has(row.stateId))
    .filter((row) => !/^ed\.gov$/.test(row.domain || domainFromUrl(row.sourceUrl)))
    .filter((row) => !/alreadyInMasterLedger/.test('') || !row.alreadyInMasterLedger)
    .map((row) => {
      const candidateType = inferCandidateType(row);
      return {
        stateId: row.stateId,
        sourceName: row.sourceName,
        sourceUrl: normalizeUrl(row.sourceUrl),
        domain: row.domain || domainFromUrl(row.sourceUrl),
        candidateType,
        priority: candidatePriority(candidateType),
        recordCount: Number(row.recordCount || 0),
        verificationStatus: row.verificationStatus,
        whyNeeded: row.whyNeeded || '',
        origin: row.origin || 'db_discovered',
      };
    });

  const byState = new Map();
  for (const row of filtered) {
    const current = byState.get(row.stateId) || [];
    current.push(row);
    byState.set(row.stateId, current);
  }

  const packRows = [];
  for (const [stateId, blocked] of blockedFormsByState.entries()) {
    const candidates = dedupeCandidates([
      ...(manualResolutionCandidates.get(stateId) || []),
      ...(byState.get(stateId) || []),
    ])
      .sort((a, b) => b.priority - a.priority || b.recordCount - a.recordCount || a.sourceUrl.localeCompare(b.sourceUrl));
    const replacementClass = classifyReplacement(candidates);
    packRows.push({
      stateId,
      blockedFormsTarget: {
        sourceName: blocked.sourceName,
        sourceUrl: blocked.sourceUrl,
        quarantineReason: blocked.quarantineReason,
      },
      replacementClass,
      canonicalTargetClass: canonicalTargetClass(replacementClass),
      topCandidates: candidates.slice(0, 5),
      candidateCount: candidates.length,
    });
  }

  return packRows.sort((a, b) => a.stateId.localeCompare(b.stateId));
}

const ledger = readJson(latestGeneratedJson('master-source-target-ledger-'));
const dbDiscovered = readJson(latestGeneratedJson('db-discovered-source-targets-'));
const blockedFormsByState = buildBlockedFormsByState(ledger);
const rows = buildCandidateRows(dbDiscovered, blockedFormsByState);

const summary = {
  blockedFormsStates: rows.length,
  exactFormsLibraryStates: rows.filter((row) => row.replacementClass === 'exact_forms_library_available').length,
  fallbackOnlyStates: rows.filter((row) => row.replacementClass === 'state_specific_form_fallback_only').length,
  federalOnlyFallbackStates: rows.filter((row) => row.replacementClass === 'federal_only_form_fallback').length,
  noCandidateStates: rows.filter((row) => row.replacementClass === 'no_state_specific_form_candidate').length,
  byReplacementClass: countBy(rows, 'replacementClass'),
  byCanonicalTargetClass: countBy(rows, 'canonicalTargetClass'),
  byTopCandidateType: countBy(
    rows
      .filter((row) => row.topCandidates.length)
      .map((row) => ({ topCandidateType: row.topCandidates[0].candidateType })),
    'topCandidateType',
  ),
};

const payload = {
  packId: 'forms_source_pack',
  generatedAt: generatedDate,
  purpose: 'Conservative state-specific forms-source pack that distinguishes true forms libraries from weaker but still truthful official form-related fallback pages.',
  summary,
  rows,
};

const mdLines = [
  '# Forms Source Pack',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This pack does not pretend every state already has a true forms library URL. It separates exact forms-library coverage from weaker state-specific official fallback pages.',
  '',
  '## Summary',
  '',
  `- blocked forms states: ${summary.blockedFormsStates}`,
  `- states with exact forms-library candidates: ${summary.exactFormsLibraryStates}`,
  `- states with state-specific fallback-only candidates: ${summary.fallbackOnlyStates}`,
  `- states with federal-only fallback candidates: ${summary.federalOnlyFallbackStates}`,
  `- states with no state-specific forms candidate yet: ${summary.noCandidateStates}`,
  '',
  '## By Replacement Class',
  '',
];

for (const [key, value] of Object.entries(summary.byReplacementClass).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${key}: ${value}`);
}

mdLines.push('', '## By Top Candidate Type', '');
for (const [key, value] of Object.entries(summary.byTopCandidateType).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${key}: ${value}`);
}

mdLines.push('', '## By Canonical Target Class', '');
for (const [key, value] of Object.entries(summary.byCanonicalTargetClass).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${key}: ${value}`);
}

mdLines.push('', '## Sample States', '');
for (const row of rows.slice(0, 20)) {
  const top = row.topCandidates[0];
  mdLines.push(`- ${row.stateId}: ${row.replacementClass} | ${row.canonicalTargetClass}${top ? ` | ${top.candidateType} | ${top.sourceUrl}` : ''}`);
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
