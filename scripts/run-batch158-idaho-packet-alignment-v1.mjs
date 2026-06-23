import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  educationPacket: path.join(generatedDir, 'idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'idaho_county_local_disability_resources_leaf_authoring_packet_v1.json'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const EDUCATION_STATUS_REASON = 'The Idaho education packet remains a district-owned leaf authoring lane only. The statewide SDE directory proves 116 district links exist, but all 44 county rows still point at statewide fallbacks and the public directory still exposes neither county labels nor district special-education fields.';
const COUNTY_STATUS_REASON = 'The Idaho county-local packet remains an exact-office alignment lane only. The DHW office stack exposes real office leaves, but public county mapping is still missing and the only public Nampa mention remains SWITC rather than a county-benefits office.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 current official Idaho DHW office routing pages plus the live county_offices DB rows. The paginated official directory and sitemap still prove exact office leaves such as Boise, Caldwell, Pocatello, Blackfoot, Idaho Falls, Rexburg, Moscow, Payette, and Sandpoint-Ponderay. A live DB reconciliation shows 18 DOI-backed county rows already name-match reviewed official office leaves, 27 county rows still use the dead legacy locator https://dhhs.idaho.gov/locations, and Canyon County remains duplicated across Caldwell and Nampa. The bounded Nampa follow-up still resolves only to Southwest Idaho Treatment Center (SWITC) at 1660 11th Ave N, Nampa, ID 83687, not to a county office or benefits office leaf. Idaho therefore still lacks a public county-to-office contract, but the next lane can now work from a deterministic office-leaf packet instead of rereading the statewide directory.';
const LESSON_HEADING = '### When A Blocked Family Uses Sample Evidence, Keep The Samples Distinct';
const LESSON_BODY = '*   **Lesson:** If a blocked family sample set is meant to justify different parts of the blocker, do not repeat the same directory row multiple times. Idaho’s county-local sample set became more useful once it preserved distinct evidence for the statewide office directory, the sitemap office-leaf surface, the exact Caldwell office leaf, and the Nampa negative proof instead of repeating the same `/offices` sample.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
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

export function generateBatch158IdahoPacketAlignmentV1() {
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const educationPacket = readJson(INPUTS.educationPacket);
  const countyPacket = readJson(INPUTS.countyPacket);

  const updatedEducationPacket = {
    ...educationPacket,
    repair_lane: 'district_owned_leaf_authoring_only',
    root_domains_to_review: [
      'district-owned Idaho K-12 domains reached from the official Idaho School Districts directory',
      'do not reopen statewide SDE discovery until a district-owned leaf is attached',
    ],
  };

  const updatedCountyPacket = {
    ...countyPacket,
    repair_lane: 'exact_office_alignment_then_hold_unmapped_counties',
    representative_sources: [
      'https://healthandwelfare.idaho.gov/offices',
      'https://healthandwelfare.idaho.gov/sitemap.xml',
      'https://healthandwelfare.idaho.gov/dhw/caldwell-office',
      'https://healthandwelfare.idaho.gov/offices?page=2',
    ],
    root_domains_to_review: [
      'https://healthandwelfare.idaho.gov/offices',
      'https://healthandwelfare.idaho.gov/sitemap.xml',
      'exact reviewed DHW office leaves only',
    ],
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, status_reason: EDUCATION_STATUS_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, status_reason: COUNTY_STATUS_REASON };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        query_basis: 'Reviewed Idaho DHW office directory, sitemap-exposed office leaves, live DB fallback inventory, and aligned the office packet so its representative evidence stays distinct.',
        blocker_evidence: COUNTY_EVIDENCE,
        sample_count: 4,
        samples: [
          {
            sample_name: 'Find a Service Location',
            source_url: 'https://healthandwelfare.idaho.gov/offices',
            final_url: 'https://healthandwelfare.idaho.gov/offices',
            verification_status: 'verified',
            source_type: 'official_statewide_office_directory',
            source_table: 'batch141_idaho_official_local_directory_refinement',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The official Find a Service Location page exposes a 27-result DHW office directory with city-or-ZIP search and exact office list pagination, but the reviewed page does not expose county labels.',
          },
          {
            sample_name: 'Idaho DHW sitemap office-leaf surface',
            source_url: 'https://healthandwelfare.idaho.gov/sitemap.xml',
            final_url: 'https://healthandwelfare.idaho.gov/sitemap.xml',
            verification_status: 'verified',
            source_type: 'official_sitemap_with_exact_office_leaves',
            source_table: 'batch141_idaho_official_local_directory_refinement',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The DHW sitemap exposes exact office leaves such as /dhw/caldwell-office, /dhw/idaho-falls-office, /dhw/payette-office, and /dhw/twin-falls-office-pole-line-building, proving real office pages exist even though county mapping is still missing.',
          },
          {
            sample_name: 'Idaho DHW Caldwell Office',
            source_url: 'https://healthandwelfare.idaho.gov/dhw/caldwell-office',
            final_url: 'https://healthandwelfare.idaho.gov/dhw/caldwell-office',
            verification_status: 'verified',
            source_type: 'official_exact_office_leaf',
            source_table: 'batch141_idaho_official_local_directory_refinement',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The exact Caldwell Office leaf is a reviewed official DHW office page, which is why some DOI-backed county rows can be replaced with real office leaves even though county-to-office mapping is still not public.',
          },
          {
            sample_name: 'Nampa mention resolves only to SWITC',
            source_url: 'https://healthandwelfare.idaho.gov/offices?page=2',
            final_url: 'https://healthandwelfare.idaho.gov/offices?page=2',
            verification_status: 'blocked',
            source_type: 'official_city_match_wrong_role',
            source_table: 'batch141_idaho_official_local_directory_refinement',
            fetched_at: '2026-06-22T22:25:00.000Z',
            evidence_snippet: 'The only public Nampa mention on the official office directory is Southwest Idaho Treatment Center (SWITC) at 1660 11th Ave N, Nampa, ID 83687, not a county office or benefits office leaf.',
          },
        ],
      };
    }
    return row;
  });

  writeJson(INPUTS.educationPacket, updatedEducationPacket);
  writeJson(INPUTS.countyPacket, updatedCountyPacket);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, nextRows);
  writeJsonl(INPUTS.failures, failureRows);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  const report = fs.readFileSync(INPUTS.stateReport, 'utf8')
    .replace(
      'but the next lane now has a dedicated Idaho district-owned leaf packet instead of only a statewide directory blocker.',
      'but the next lane now has a dedicated Idaho district-owned leaf packet instead of only a statewide directory blocker, and that packet no longer implies more statewide SDE discovery is useful.'
    )
    .replace(
      'but the next lane now has a dedicated Idaho office-leaf packet that captures the 18 exact matches, 27 legacy rows, and the unresolved Canyon/Nampa split.',
      'but the next lane now has a dedicated Idaho office-leaf packet that captures the 18 exact matches, 27 legacy rows, and the unresolved Canyon/Nampa split with distinct supporting evidence rather than repeated directory samples.'
    );
  fs.writeFileSync(INPUTS.stateReport, report);

  const batchSummary = {
    state: 'idaho',
    classification: 'BLOCKED',
    index_safe: false,
    education_packet_aligned: true,
    county_packet_aligned: true,
    county_sample_set_deduped: true,
    lessons_updated: lessonsUpdated,
  };

  writeJson(path.join(generatedDir, 'batch158_idaho_packet_alignment_summary_v1.json'), batchSummary);
  fs.writeFileSync(path.join(docsGeneratedDir, 'batch158-idaho-packet-alignment-report-v1.md'), `${report}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch158IdahoPacketAlignmentV1();
  console.log(JSON.stringify(result, null, 2));
}
