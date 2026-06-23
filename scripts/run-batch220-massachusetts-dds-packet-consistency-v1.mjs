import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const PACKET_PATHS = [
  path.join(generatedDir, 'massachusetts_county_local_disability_resources_town_routing_packet_v1.json'),
  path.join(generatedDir, 'massachusetts_county_local_disability_resources_host403_packet_v1.json'),
];

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch220_massachusetts_dds_packet_consistency_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch220-massachusetts-dds-packet-consistency-report-v1.md'),
};

const PURPOSE =
  'Deterministic packet for Massachusetts DDS county-local routing while the live Mass.gov DDS org, locations, and interactive-map surfaces are public but still do not expose a reusable county-grade contract.';
const ROOT_REVIEW_RULE =
  'browser-assisted or cached Mass.gov DDS org, locations, and interactive-map surfaces only; the old host-wide 403 assumption is retired and the remaining blocker is the missing county-grade locality contract';
const LESSON_HEADING =
  '### Retire Stale Blocker Labels Inside The Packet Once The Live Surface Recovers';
const LESSON_BODY =
  "*   **Lesson:** When a state packet's metrics already prove the live surface recovered, remove old blocker labels from the packet purpose and review rules too. Massachusetts DDS had `hostWide403Surfaces: 0` and live org/locations/map access, so leaving `host-wide 403` in the packet text would have kept steering later repairs at the wrong failure mode.";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

export function generateBatch220MassachusettsDdsPacketConsistencyV1() {
  const updatedPackets = [];
  for (const packetPath of PACKET_PATHS) {
    const packet = readJson(packetPath);
    const updated = {
      ...packet,
      purpose: PURPOSE,
      root_domains_to_review: (packet.root_domains_to_review || []).map((entry, index) => (
        index === 0 ? ROOT_REVIEW_RULE : entry
      )),
    };
    writeJson(packetPath, updated);
    updatedPackets.push(path.basename(packetPath));
  }

  const lessonsPath = path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md');
  const lessonsUpdated = appendLessonIfMissing(lessonsPath);

  const summary = {
    batch: 'batch220_massachusetts_dds_packet_consistency_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'massachusetts',
    updated_packets: updatedPackets,
    retired_stale_host403_wording: true,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.summary, summary);

  const report = [
    '# Batch 220 Massachusetts DDS Packet Consistency Report v1',
    '',
    '- state: massachusetts',
    '- family: county_local_disability_resources',
    '- change: retired stale host-wide-403 wording from the live DDS packet artifacts',
    '',
    '## Why',
    '',
    '- The current metrics already show `hostWide403Surfaces: 0` and live access to the org page, locations index, and interactive map.',
    '- The remaining blocker is the lack of a county-grade locality contract, not a host availability failure.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.report, report);

  return summary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch220MassachusettsDdsPacketConsistencyV1();
  console.log(JSON.stringify(result, null, 2));
}
