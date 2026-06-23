import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-hampshire_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-hampshire_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'new-hampshire_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-hampshire_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'new-hampshire_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  packet: path.join(generatedDir, 'new-hampshire_host_family_blocker_packet_v1.json'),
  batchSummary: path.join(generatedDir, 'batch194_new_hampshire_host_family_packet_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch194-new-hampshire-host-family-packet-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-hampshire-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP =
  'official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable';
const PACKET_REASON =
  'Reviewed 2026-06-23 bounded first-party probes on the New Hampshire host families already named in the packet. The current-looking successor family `dhhs.new-hampshire.gov` stays unresolvable for the saved Medicaid/DD/waiver/early-intervention paths, while the public-facing `www.dhhs.nh.gov`, `www.education.nh.gov`, `my.doe.nh.gov`, and `www.nhes.nh.gov` families each return the same short Access Denied shell on exact roots and saved leaf paths. New Hampshire therefore remains blocked on two distinct host-family failure modes: dead successor-host assumptions and public access-denied official hosts.';

const LESSON_HEADING =
  '### Split Dead Successor Hosts From Live Access-Denied Host Families';
const LESSON_BODY =
  '*   **Lesson:** When a state packet mixes neat-looking successor hosts with live official roots, separate DNS-dead successor assumptions from public access-denied host families. New Hampshire needed two blocker lanes: `dhhs.new-hampshire.gov` was simply unresolvable, while `www.dhhs.nh.gov`, `www.education.nh.gov`, and `www.nhes.nh.gov` were live-but-blocked shells.';

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

function buildPacket() {
  return {
    state: 'new-hampshire',
    primary_gap_reason: PRIMARY_GAP,
    purpose:
      'Deterministic blocker packet for New Hampshire while the current official host families remain either unresolvable or publicly access-denied.',
    packet_complete_when:
      'New Hampshire can reopen only when at least one reviewed first-party official host family either resolves publicly for Medicaid/DD/EI and county-office lanes or exposes a public export or browser-reviewable directory for education, VR, or district offices.',
    blocker_classes: [
      {
        blocker_class: 'successor_host_unresolvable',
        families: [
          'medicaid_state_health_coverage',
          'medicaid_waiver_hcbs_disability_services',
          'developmental_disability_idd_authority',
          'early_intervention_part_c',
        ],
        host_family: 'dhhs.new-hampshire.gov',
        exact_paths: [
          'https://dhhs.new-hampshire.gov/',
          'https://dhhs.new-hampshire.gov/dd',
          'https://dhhs.new-hampshire.gov/dd/waivers',
          'https://dhhs.new-hampshire.gov/earlystart',
        ],
        finding:
          'The successor-host family saved into the packet does not resolve in bounded review and cannot remain verified statewide evidence.',
      },
      {
        blocker_class: 'public_host_access_denied_shell',
        families: [
          'district_or_county_education_routing',
          'county_local_disability_resources',
          'vocational_rehabilitation_pre_ets',
        ],
        host_families: [
          'www.education.nh.gov',
          'my.doe.nh.gov',
          'www.dhhs.nh.gov',
          'www.nhes.nh.gov',
        ],
        exact_paths: [
          'https://www.education.nh.gov/',
          'https://www.education.nh.gov/school-and-district-profiles',
          'https://www.education.nh.gov/find-school-or-district',
          'https://my.doe.nh.gov/ehb/',
          'https://www.dhhs.nh.gov/',
          'https://www.dhhs.nh.gov/contact-us',
          'https://www.dhhs.nh.gov/contact-us/district-offices',
          'https://www.nhes.nh.gov/',
          'https://www.nhes.nh.gov/services/disabilities/bvr.htm',
        ],
        finding:
          'The public-facing official roots and exact leaves return the same short Access Denied shell, so low-token path guessing will not repair these families.',
      },
      {
        blocker_class: 'alternate_host_unresolvable',
        families: ['vocational_rehabilitation_pre_ets'],
        host_family: 'www.nheasy.nh.gov',
        exact_paths: ['https://www.nheasy.nh.gov/'],
        finding:
          'The likely public-assistance/VR alternate host does not resolve and should not remain in an active New Hampshire review lane.',
      },
    ],
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows, packetPath) {
  return [
    '# New Hampshire California-Grade Host-Family Packet v3',
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
    '## Packetized blocker',
    '',
    `- Host-family packet saved at \`${path.relative(repoRoot, packetPath)}\`.`,
    '- The packet now separates dead successor-host assumptions from live-but-access-denied official host families.',
    '- Future New Hampshire retries should reopen only when one of those exact host families changes state or an official export is preserved.',
    '',
    '## Completion decision',
    '',
    '- New Hampshire remains `BLOCKED` and `index_safe=false`.',
    '- Medicaid, waiver, DD, and early-intervention remain blocked on an unresolvable saved successor host family.',
    '- Education, county-local, and VR remain blocked on public access-denied official hosts or dead alternate hosts, not on missing guessed paths.',
  ].join('\n') + '\n';
}

export function generateBatch194NewHampshireHostFamilyPacketV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP,
  };

  const packet = buildPacket();
  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch194_new_hampshire_host_family_packet_v1',
    state: 'new-hampshire',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    packet_written: true,
    successor_host_unresolvable_paths: 4,
    access_denied_host_paths: 9,
    blocker_classes: packet.blocker_classes.map((row) => row.blocker_class),
    lesson_added: lessonAdded,
  };

  const report = buildReport(updatedSummary, gapRows, failureRows, verifiedRows, nextRows, OUTPUTS.packet);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, gapRows);
  writeJsonl(INPUTS.failures, failureRows);
  writeJsonl(INPUTS.verified, verifiedRows);
  writeJsonl(INPUTS.nextActions, nextRows);
  writeJson(OUTPUTS.packet, packet);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch194NewHampshireHostFamilyPacketV1();
}
