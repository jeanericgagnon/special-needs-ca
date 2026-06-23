import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'north-carolina_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'north-carolina_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'north-carolina_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'north-carolina_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'north-carolina_next_action_queue_v2.jsonl'),
  sourceFamilyPacket: path.join(generatedDir, 'north-carolina_statewide_support_source_family_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch227_north_carolina_statewide_support_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch227-north-carolina-statewide-support-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'north-carolina-california-grade-audit-report-v2.md'),
};

const PNA_REASON =
  'Reviewed 2026-06-23 the authoritative NDRN member-agencies directory plus the live Disability Rights North Carolina first-party host. The NDRN directory lists `Disability Rights North Carolina` with Raleigh contact information and the `disabilityrightsnc.org` website, and the live DRNC homepage preserves the explicit description `Disability Rights North Carolina (DRNC) is the federally designated protection and advocacy agency for the State of North Carolina.` North Carolina therefore now has reviewed statewide protection-and-advocacy proof.';

const PTI_REASON =
  'Reviewed 2026-06-23 the authoritative Parent Center Hub North Carolina leaf plus the ECAC first-party host already preserved on disk. `https://www.parentcenterhub.org/findurcenter/north-carolina/` explicitly says `North Carolina PTI (Serving all North Carolina)` and names `ECAC, Inc. (Exceptional Children’s Assistance Center)` with direct contact information and the ECAC host. North Carolina therefore now has reviewed statewide PTI designation and scope proof.';

const LEGAL_REASON =
  "Reviewed 2026-06-23 the live Legal Aid of North Carolina first-party host. `https://legalaidnc.org/` preserves the title `Legal Aid - Legal Aid of North Carolina` and H1 `North Carolina's Non Profit Law Firm`, while `https://legalaidnc.org/get-help/` says `We provide free legal help to low-income North Carolinians in civil cases involving basic human needs`, and `https://legalaidnc.org/about-us/` preserves `Legal Aid of North Carolina is a statewide, no...` mission statement. North Carolina therefore now has reviewed statewide legal-aid proof from a first-party source.";

const LESSON_HEADING =
  '### Authoritative PTI Leaves Can Upgrade A First-Party Homepage That Lacks Explicit Designation Text';
const LESSON_BODY =
  '*   **Lesson:** If a PTI first-party homepage is live but only shows general support navigation, check the authoritative Parent Center Hub state leaf before leaving the family blocked. North Carolina cleared once the Hub leaf explicitly said `North Carolina PTI (Serving all North Carolina)` and named ECAC, even though the ECAC homepage alone had been too weak.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildSourceFamilyPacket() {
  return {
    state: 'north-carolina',
    family_group: 'statewide_support_families',
    repair_lane: 'resolved_reviewed_first_party_and_authoritative_sources',
    packet_complete_when:
      'Reviewed statewide first-party or authoritative artifacts exist for protection and advocacy, legal aid, and PTI designation/scope.',
    missing_families: [],
    weak_family: null,
    weak_family_current_source: null,
    weak_family_issue: null,
    resolved_families: {
      protection_and_advocacy: 'https://www.disabilityrightsnc.org/',
      parent_training_information_center: 'https://www.parentcenterhub.org/findurcenter/north-carolina/',
      legal_aid: 'https://legalaidnc.org/get-help/',
    },
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# North Carolina Blocker Packets v3',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    `- primary_gap_reason: ${summary.primary_gap_reason}`,
    '',
    '## Family status',
    '',
    ...gapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`),
    '',
    '## Failure ledger',
    '',
    ...failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Statewide support repair',
    '',
    '- `protection_and_advocacy` is now verified from the authoritative NDRN member-agencies directory plus the live DRNC first-party host.',
    '- `parent_training_information_center` is now verified from the authoritative Parent Center Hub North Carolina leaf, which explicitly says `North Carolina PTI (Serving all North Carolina)` and names ECAC.',
    '- `legal_aid` is now verified from the live Legal Aid of North Carolina first-party host and its get-help / about-us leaves.',
    '',
    '## Completion decision',
    '',
    '- North Carolina remains `BLOCKED` and `index_safe=false`.',
    '- Education remains blocked on missing district-owned local leaves beyond the single Charlotte-Mecklenburg anchor.',
    '- County-local remains blocked on DOI-backed non-county-owned rows.',
    '- Statewide support families are no longer blockers.',
  ].join('\n') + '\n';
}

export function generateBatch227NorthCarolinaStatewideSupportRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return { ...row, family_status: 'verified_state_grade', status_reason: PNA_REASON };
    }
    if (row.family === 'parent_training_information_center') {
      return { ...row, family_status: 'verified_state_grade', status_reason: PTI_REASON };
    }
    if (row.family === 'legal_aid') {
      return { ...row, family_status: 'verified_state_grade', status_reason: LEGAL_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter(
    (row) => !['protection_and_advocacy', 'parent_training_information_center', 'legal_aid'].includes(row.family),
  );

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed 2026-06-23 the authoritative NDRN member-agencies directory plus the live Disability Rights North Carolina first-party host.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'NDRN member agencies directory',
            source_url: 'https://www.ndrn.org/about/ndrn-member-agencies/',
            final_url: 'https://www.ndrn.org/about/ndrn-member-agencies/',
            verification_status: 'reviewed',
            source_type: 'authoritative_directory',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The NDRN member-agencies directory lists Disability Rights North Carolina with Raleigh address, phone numbers, and the disabilityrightsnc.org website.',
          },
          {
            sample_name: 'Disability Rights North Carolina homepage',
            source_url: 'https://www.disabilityrightsnc.org/',
            final_url: 'https://disabilityrightsnc.org/',
            verification_status: 'reviewed',
            source_type: 'first_party_designation_page',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'Disability Rights North Carolina (DRNC) is the federally designated protection and advocacy agency for the State of North Carolina.',
          },
        ],
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed 2026-06-23 the authoritative Parent Center Hub North Carolina leaf plus the ECAC first-party host already preserved on disk.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Parent Center Hub North Carolina PTI listing',
            source_url: 'https://www.parentcenterhub.org/findurcenter/north-carolina/',
            final_url: 'https://www.parentcenterhub.org/findurcenter/north-carolina/',
            verification_status: 'reviewed',
            source_type: 'authoritative_state_leaf',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'North Carolina PTI (Serving all North Carolina) ECAC, Inc. (Exceptional Children’s Assistance Center) 907 Barra Row, Suites 102/103 Davidson, NC 28036.',
          },
          {
            sample_name: 'Exceptional Children’s Assistance Center (ECAC)',
            source_url: 'https://www.ecac-parentcenter.org/',
            final_url: 'https://www.ecac-parentcenter.org/',
            verification_status: 'reviewed',
            source_type: 'listed_first_party_host',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-19T23:26:47.012Z',
            evidence_snippet: 'ECAC homepage preserves Parent Training and Information Center navigation and family-support context on the listed North Carolina PTI first-party host.',
          },
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed 2026-06-23 the live Legal Aid of North Carolina first-party host plus its get-help and about-us leaves.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Legal Aid of North Carolina homepage',
            source_url: 'https://legalaidnc.org/',
            final_url: 'https://legalaidnc.org/',
            verification_status: 'reviewed',
            source_type: 'first_party_homepage',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: "North Carolina's Non Profit Law Firm. Trusted legal help that lifts up families, supports workers, and honors veterans — building a stronger North Carolina for all.",
          },
          {
            sample_name: 'Legal Aid of North Carolina get help',
            source_url: 'https://legalaidnc.org/get-help/',
            final_url: 'https://legalaidnc.org/get-help/',
            verification_status: 'reviewed',
            source_type: 'first_party_intake_page',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'We provide free legal help to low-income North Carolinians in civil cases involving basic human needs like safety, shelter, income and more.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.filter(
    (row) => !['protection_and_advocacy', 'parent_training_information_center', 'legal_aid'].includes(row.family),
  );

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    missing_critical_families: 0,
    major_gap_families: [],
    final_blockers: (summary.final_blockers || []).filter(
      (row) => !['protection_and_advocacy', 'parent_training_information_center', 'legal_aid'].includes(row.family),
    ),
  };

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const sourceFamilyPacket = buildSourceFamilyPacket();
  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch227_north_carolina_statewide_support_repair_v1',
    state: 'north-carolina',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    protectionAndAdvocacyRepaired: true,
    ptiRepaired: true,
    legalAidRepaired: true,
    lesson_added: lessonAdded,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.sourceFamilyPacket, sourceFamilyPacket);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch227NorthCarolinaStatewideSupportRepairV1();
}
