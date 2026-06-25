import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch357_idaho_residual_district_wrong_role_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch357-idaho-residual-district-wrong-role-finality-report-v1.md'),
};

const BATCH_NAME = 'batch357_idaho_residual_district_wrong_role_finality_v1';
const PRIMARY_GAP_REASON =
  'remaining_idaho_district_roots_now_reduce_to_wrong_role_contact_or_title_ix_leaves_without_special_education_or_student_services_routing';
const DISTRICT_STATUS =
  'blocked_remaining_live_district_roots_only_materialize_wrong_role_contact_or_title_ix_leaves_after_jefferson_and_oneida_recovery';
const FAILURE_CODE =
  'remaining_live_idaho_district_roots_materialize_contact_or_title_ix_leaves_but_zero_role_bearing_special_education_or_student_services_routing';
const NEXT_ACTION =
  'continue_exact_district_leaf_expansion_only_when_camas_clark_fremont_or_shoshone_publish_role_bearing_special_education_special_services_student_services_504_or_procedural_safeguards_leaves';
const DISTRICT_REASON =
  'Reviewed 2026-06-25 one more bounded official Idaho district pass focused on exact same-host leaves for the four remaining district roots. The unresolved remainder is now more specific than generic homepage/sitemap exhaustion. Camas still only materializes a district-owned `Contact Information` leaf with district address and phone. Clark now clearly materializes exact district-owned `Contact Us` and `Title IX` leaves, but they remain wrong-role leaves: `Contact Us` only lists district office staff and superintendent routing, while `Title IX` only links a Title IX policy and repeats generic district accessibility language. Fremont now clearly materializes exact district-owned `Contact Us` and `Title IX-Sexual Harassment` leaves, but they also remain wrong-role leaves: `Contact Us` only preserves district address, phone, and generic resources, while the `Title IX` page collapses back to the same generic contact/resource shell. Shoshone remains live with district-office contacts, principal contacts, and federal-program menu leaves like Title I and Title IX-A for homeless children and youth, but still exposes no reusable district-owned special-education, special-services, student-services, 504, or procedural-safeguards leaf. Idaho therefore remains blocked on a smaller but better-defined education remainder: the surviving district-owned leaves are real, but they are the wrong role for special-education routing.';
const DISTRICT_EVIDENCE =
  'Reviewed 2026-06-25 bounded official Idaho district-root checks on `https://www.camascountyschools.org/`, `https://www.camascountyschools.org/contact-information`, `https://www.clarkcountyschools161.org/`, `https://www.clarkcountyschools161.org/about-us/contact-us-ccsd`, `https://www.clarkcountyschools161.org/administration/title-ix`, `https://www.sd215.net/`, `https://www.sd215.net/page/contact-us`, `https://www.sd215.net/o/sd215/page/title-ix`, `https://shoshonesd.org/`, and the previously reviewed Jefferson and Oneida recovery sources. Jefferson remains positively recovered from district-owned `special-education`, `special-services`, `section-504`, and `student-services` leaves. Oneida remains positively recovered from the district-owned Child Find PDF. But the residual four districts now finalize as wrong-role survivors rather than unknown roots: Camas only exposes a district-owned `Contact Information` leaf with address and phone; Clark exposes exact district-owned `Contact Us` and `Title IX` leaves, but no special-education or student-services routing; Fremont exposes exact district-owned `Contact Us` and `Title IX-Sexual Harassment` leaves, but no special-education or student-services routing; and Shoshone exposes district-office contacts plus federal-program leaves like Title I and Title IX-A for homeless children and youth, but no special-education, special-services, student-services, 504, or procedural-safeguards leaf. Idaho therefore remains blocked because the remaining district-owned leaves are still the wrong role for local special-education routing.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function replaceSample(samples, sampleName, replacement) {
  const index = samples.findIndex((sample) => sample.sample_name === sampleName);
  if (index >= 0) samples[index] = replacement;
  else samples.push(replacement);
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Idaho California-Grade Audit Report v2',
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
    '## Completion decision',
    '',
    '- Idaho remains BLOCKED and not index-safe.',
    '- County-local remains explicitly split between the existing clean exact-office replacements and the legacy counties that still lack a public county contract.',
    '- Education remains the highest blocker, but the residual live districts are now narrowed to exact wrong-role leaves rather than generic unknown roots.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const lines = text.split('\n').filter((line) => !line.startsWith('- Idaho remains blocked'));
  const next = '- Idaho remains blocked after a sharper district-leaf finality pass: the remaining live district roots now materialize exact district-owned `Contact Us` or `Title IX` leaves, but still no special-education, student-services, 504, or procedural-safeguards routing contract.';
  return `${lines.join('\n').trimEnd()}\n${next}\n`;
}

function buildHandoff(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));

  return [
    '# Gemini Source Scout Handoff',
    '',
    `Updated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
    '## Current Focus State: Idaho',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` remains the highest-priority Idaho blocker, but the residual district remainder is now more precise than generic root exhaustion. Jefferson still clears from district-owned special-education / special-services / section-504 / student-services leaves. Oneida still clears from the district-owned Child Find PDF. The four remaining district roots now materialize exact wrong-role leaves instead of recoverable special-ed routing. Camas only exposes a district-owned `Contact Information` leaf with address and phone. Clark exposes exact district-owned `Contact Us` and `Title IX` leaves, but they only provide generic district office / policy routing. Fremont exposes exact district-owned `Contact Us` and `Title IX-Sexual Harassment` leaves, but they collapse back to generic contact and compliance routing. Shoshone exposes district-office contacts plus federal-program leaves like Title I and Title IX-A for homeless children and youth, but still no special-education, special-services, student-services, 504, or procedural-safeguards leaf. Idaho remains BLOCKED because the remaining district-owned leaves are real but still the wrong role for local special-education routing.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official district-owned special-education, special-services, student-services, 504, procedural-safeguards, or Child Find leaf on Camas, Clark, Fremont, or Shoshone.',
    '- Any district-owned PDF, handbook, or notice on those hosts that explicitly preserves special-education routing plus named contact information.',
    '- Any official Idaho DHW county-to-office crosswalk, service-area table, export, PDF, ArcGIS layer, or API that ties counties to named office leaves.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Camas root](https://www.camascountyschools.org/)',
    '- [Camas Contact Information](https://www.camascountyschools.org/contact-information)',
    '- [Clark root](https://www.clarkcountyschools161.org/)',
    '- [Clark Contact Us](https://www.clarkcountyschools161.org/about-us/contact-us-ccsd)',
    '- [Clark Title IX](https://www.clarkcountyschools161.org/administration/title-ix)',
    '- [Fremont root](https://www.sd215.net/)',
    '- [Fremont Contact Us](https://www.sd215.net/page/contact-us)',
    '- [Fremont Title IX](https://www.sd215.net/o/sd215/page/title-ix)',
    '- [Shoshone root](https://shoshonesd.org/)',
    '- [Oneida Child Find PDF](https://5il.co/26a73)',
    '- [Jefferson sitemap](https://www.jeffersonsd251.org/wp-sitemap.xml)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any current district-owned special-education, student-services, 504, or procedural-safeguards leaf for Camas, Clark, Fremont, or Shoshone.',
    '- Any district-owned Child Find PDF or special-ed handbook already linked from those hosts but not yet surfaced on the homepage HTML.',
    '- Any public Idaho DHW county-to-office contract that can reduce the separate county-local blocker.',
    '',
    '## Next State Order After Idaho',
    '',
    '1. Arizona',
    '2. Massachusetts',
    '3. New Mexico',
    '4. South Dakota',
    '5. Rhode Island',
    '6. Virginia',
    '7. West Virginia',
    '8. North Dakota',
    '9. Wisconsin',
    '10. Washington',
    '',
  ].join('\n');
}

function buildBatchReport() {
  return [
    '# Batch 357 Idaho Residual District Wrong-Role Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tightened the residual Idaho education blocker from generic live roots to exact wrong-role district-owned leaves',
    '',
    '## Evidence',
    '',
    `- ${DISTRICT_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch357IdahoResidualDistrictWrongRoleFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 85,
    strong_critical_families: 10,
    weak_critical_families: 2,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
    final_blockers: summary.final_blockers.map((blocker) => (
      blocker.family === 'district_or_county_education_routing'
        ? {
            family: 'district_or_county_education_routing',
            severity: 'critical',
            failure_code: FAILURE_CODE,
            evidence: DISTRICT_EVIDENCE,
            next_action: NEXT_ACTION,
          }
        : blocker
    )),
    familyStatuses: {
      ...summary.familyStatuses,
      district_or_county_education_routing: DISTRICT_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: DISTRICT_STATUS, status_reason: DISTRICT_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence: DISTRICT_EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    const samples = [...row.samples];
    replaceSample(samples, 'Camas Contact Information leaf', {
      sample_name: 'Camas Contact Information leaf',
      source_url: 'https://www.camascountyschools.org/contact-information',
      final_url: 'https://www.camascountyschools.org/contact-information',
      verification_status: 'reviewed',
      source_type: 'official_contact_leaf_wrong_role_for_special_education_routing',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The district-owned Contact Information page only preserves Camas district address and phone; it does not expose special-education, student-services, 504, or procedural-safeguards routing.',
    });
    replaceSample(samples, 'Clark Contact Us leaf', {
      sample_name: 'Clark Contact Us leaf',
      source_url: 'https://www.clarkcountyschools161.org/about-us/contact-us-ccsd',
      final_url: 'https://www.clarkcountyschools161.org/about-us/contact-us-ccsd',
      verification_status: 'reviewed',
      source_type: 'official_contact_leaf_wrong_role_for_special_education_routing',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The district-owned Contact Us page lists district office staff, superintendent, address, and phone, but no special-education or student-services routing.',
    });
    replaceSample(samples, 'Clark Title IX leaf', {
      sample_name: 'Clark Title IX leaf',
      source_url: 'https://www.clarkcountyschools161.org/administration/title-ix',
      final_url: 'https://www.clarkcountyschools161.org/administration/title-ix',
      verification_status: 'reviewed',
      source_type: 'official_compliance_leaf_wrong_role_for_special_education_routing',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The district-owned Title IX page only links Title IX policy and repeats generic accessibility language; it does not expose special-education, 504, or student-services routing.',
    });
    replaceSample(samples, 'Fremont Contact Us leaf', {
      sample_name: 'Fremont Contact Us leaf',
      source_url: 'https://www.sd215.net/page/contact-us',
      final_url: 'https://www.sd215.net/page/contact-us',
      verification_status: 'reviewed',
      source_type: 'official_contact_leaf_wrong_role_for_special_education_routing',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The district-owned Contact Us page preserves district address, phone, and generic resource links, but no special-education or student-services routing.',
    });
    replaceSample(samples, 'Fremont Title IX leaf', {
      sample_name: 'Fremont Title IX leaf',
      source_url: 'https://www.sd215.net/o/sd215/page/title-ix',
      final_url: 'https://www.sd215.net/o/sd215/page/title-ix',
      verification_status: 'reviewed',
      source_type: 'official_compliance_leaf_wrong_role_for_special_education_routing',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The district-owned Title IX page collapses back to the same generic contact/resource shell and does not expose special-education, 504, or student-services routing.',
    });
    replaceSample(samples, 'Shoshone district-office and federal-program menu', {
      sample_name: 'Shoshone district-office and federal-program menu',
      source_url: 'https://shoshonesd.org/',
      final_url: 'https://shoshonesd.org/',
      verification_status: 'reviewed',
      source_type: 'official_root_with_wrong_role_federal_program_leaves',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The live district root preserves superintendent and principal contacts plus federal-program leaves like Title I and Title IX-A for homeless children and youth, but no special-education, special-services, student-services, 504, or procedural-safeguards routing.',
    });
    return {
      ...row,
      family_status: DISTRICT_STATUS,
      sample_count: samples.length,
      blocker_code: FAILURE_CODE,
      blocker_evidence: DISTRICT_EVIDENCE,
      query_basis: 'Reviewed the four remaining live Idaho district roots plus their exact district-owned contact and compliance leaves after Jefferson and Oneida recovery.',
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: DISTRICT_EVIDENCE }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'idaho'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
          repair_lane: 'repair_from_state_packet',
        }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'idaho'
        ? {
            ...row,
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
            familyStatuses: {
              ...row.familyStatuses,
              district_or_county_education_routing: DISTRICT_STATUS,
            },
          }
        : row
    )),
  };

  const batchSummary = {
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    camas_contact_leaf_live: true,
    clark_contact_leaf_live: true,
    clark_title_ix_leaf_live: true,
    fremont_contact_leaf_live: true,
    fremont_title_ix_leaf_live: true,
    shoshone_root_live: true,
    residual_districts_with_exact_wrong_role_leaves: 4,
    residual_districts_with_special_ed_routing_leaves: 0,
    result: 'residual_live_districts_materialize_wrong_role_contact_or_title_ix_leaves_without_special_ed_routing',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAudit));
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateBatch357IdahoResidualDistrictWrongRoleFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
