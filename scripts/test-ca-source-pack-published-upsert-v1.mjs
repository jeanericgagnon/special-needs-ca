import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import Database from 'better-sqlite3';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ca-upsert-'));
const generatedDir = path.join(tmp, 'data', 'generated');
const stagedDir = path.join(tmp, 'data', 'source-acquisition-runs', 'ca-v3', 'staged');
fs.mkdirSync(generatedDir, { recursive: true });
for (const family of ['dd_routing', 'medicaid_hhs_offices', 'forms_guides', 'waivers']) {
  fs.mkdirSync(path.join(stagedDir, family), { recursive: true });
}

const dbPath = path.join(tmp, 'test.db');
const db = new Database(dbPath);
db.exec(`
  CREATE TABLE state_resource_agencies (
    id TEXT PRIMARY KEY, state_id TEXT, agency_type TEXT, name TEXT, counties_served TEXT, catchment_boundaries TEXT,
    website TEXT, intake_phone TEXT, early_intervention_contact TEXT, agency_intake_contact TEXT,
    eligibility_info_page TEXT, services_page TEXT, appeals_info TEXT, languages TEXT,
    last_verified_date TEXT, source_urls TEXT, source_url TEXT, source_type TEXT, data_origin TEXT,
    verification_status TEXT, last_scraped_at TEXT, confidence_score REAL, evidence_level TEXT, frc_relationship TEXT,
    office_locations TEXT
  );
  CREATE TABLE county_offices (
    id TEXT PRIMARY KEY, county_id TEXT, program_id TEXT, office_name TEXT, address TEXT, phone TEXT, email TEXT, website TEXT,
    source_url TEXT, source_type TEXT, data_origin TEXT, verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT,
    confidence_score REAL, evidence_level TEXT
  );
  CREATE TABLE forms_and_guides (
    id TEXT PRIMARY KEY, state_id TEXT, program_id TEXT, title TEXT, slug TEXT, category TEXT, form_type TEXT, agency TEXT,
    source_url TEXT, pdf_url TEXT, description TEXT, related_action TEXT, display_context TEXT, who_uses_it TEXT,
    who_signs_it TEXT, where_to_send_it TEXT, deadline TEXT, attachments TEXT, common_mistakes TEXT, letter_template TEXT,
    call_script TEXT, evidence_level TEXT, data_origin TEXT, verification_status TEXT, confidence_score REAL, last_checked_at TEXT, last_verified_at TEXT
  );
  CREATE TABLE programs (
    id TEXT PRIMARY KEY, name TEXT, description TEXT, who_it_is_for TEXT, who_might_qualify TEXT, official_source_url TEXT,
    category TEXT, confidence_score REAL, last_verified_date TEXT, state_id TEXT, source_url TEXT, source_type TEXT,
    data_origin TEXT, verification_status TEXT, last_scraped_at TEXT, program_type TEXT
  );
`);
db.exec(`
  INSERT INTO state_resource_agencies (id, state_id, agency_type, name, counties_served, catchment_boundaries, website, source_url)
  VALUES ('existing-rc', 'california', 'regional_center', 'Alta California Regional Center (ACRC)', 'alameda', 'alameda', 'https://www.altaregional.org', 'https://www.altaregional.org');
  INSERT INTO county_offices (id, county_id, program_id, office_name)
  VALUES ('existing-office', 'alameda', 'ihss-for-children', 'Old Alameda IHSS');
`);
db.close();

const publishedRows = [
  {
    runId: 'ca-v3',
    recordId: 'california|dd_routing|alta-california-regional-center|regional_center_root_from_dds_directory|hash1',
    family: 'dd_routing',
    stateId: 'california',
    authority: 'official_regional_center',
    agency: 'Alta California Regional Center',
    provenanceUrl: 'https://www.dds.ca.gov/rc/listings/',
    sourceRole: 'regional_center_root_from_dds_directory',
    sourceUrl: 'https://www.altaregional.org/',
    finalUrl: 'https://www.altaregional.org/',
    artifactPath: 'data/source-acquisition-runs/ca-v3/raw/hash1.html',
    sha256: 'hash1',
    fetchedAt: '2026-06-20T20:20:19.705Z',
    pageTitle: 'Alta California Regional Center',
    entityType: 'agency',
    destinationTable: 'state_resource_agencies',
    semanticStatus: 'stage_ready',
    classificationReason: 'regional_center_root_page',
    confidenceScore: 1,
    requiredFieldCompleteness: 1,
    unsupportedDefaultedFieldCount: 0,
    fieldEvidenceCoverage: 0.67,
    displayStatusDecision: 'published',
    fieldEntries: [
      { field: 'name', value: 'Alta California Regional Center' },
      { field: 'website', value: 'https://www.altaregional.org/' },
      { field: 'phone', value: '(916) 978-6572' },
      { field: 'address', value: '4151 E Commerce Way, Suite 100, Sacramento, CA 95834' },
      { field: 'eligibility_info_page', value: '/am-i-eligible' },
      { field: 'services_page', value: '/family-support' },
      { field: 'appeals_info', value: '/rights-advocacy-and-appeals' },
    ],
  },
  {
    runId: 'ca-v3',
    recordId: 'california|medicaid_hhs_offices|county-ihss-alameda|county_ihss_entry_from_cdss_directory|hash2',
    family: 'medicaid_hhs_offices',
    stateId: 'california',
    authority: 'official_county',
    agency: 'Alameda County',
    provenanceUrl: 'https://cdss.ca.gov',
    sourceRole: 'county_ihss_entry_from_cdss_directory',
    sourceUrl: 'https://socialservices.alamedacountyca.gov/index.page',
    finalUrl: 'https://socialservices.alamedacountyca.gov/index.page',
    artifactPath: 'data/source-acquisition-runs/ca-v3/raw/hash2.html',
    sha256: 'hash2',
    fetchedAt: '2026-06-20T20:23:02.988Z',
    pageTitle: 'Alameda County Social Services Agency',
    entityType: 'office',
    destinationTable: 'county_offices',
    semanticStatus: 'stage_ready',
    classificationReason: 'local_office_contact_signals_present',
    confidenceScore: 0.9,
    requiredFieldCompleteness: 1,
    unsupportedDefaultedFieldCount: 0,
    fieldEvidenceCoverage: 1,
    displayStatusDecision: 'published',
    fieldEntries: [
      { field: 'office_name', value: 'Alameda County Social Services Agency' },
      { field: 'phone', value: '(510) 263-2420' },
      { field: 'address', value: '8477 Enterprise Way, Oakland, CA 94621' },
      { field: 'website', value: 'https://socialservices.alamedacountyca.gov/index.page' },
    ],
  },
  {
    runId: 'ca-v3',
    recordId: 'california|forms_guides|soc-856|provider_denial_appeal_form_pdf|hash3',
    family: 'forms_guides',
    stateId: 'california',
    authority: 'official_state',
    agency: 'CDSS',
    provenanceUrl: 'https://cdss.ca.gov',
    sourceRole: 'provider_denial_appeal_form_pdf',
    sourceUrl: 'https://cdss.ca.gov/Portals/9/Additional-Resources/Forms-and-Brochures/2019/Q-T/SOC856.pdf',
    finalUrl: 'https://cdss.ca.gov/Portals/9/Additional-Resources/Forms-and-Brochures/2019/Q-T/SOC856.pdf',
    artifactPath: 'data/source-acquisition-runs/ca-v3/raw/hash3.pdf',
    sha256: 'hash3',
    fetchedAt: '2026-06-20T20:23:01.440Z',
    pageTitle: 'SOC 856',
    entityType: 'form',
    destinationTable: 'forms_and_guides',
    semanticStatus: 'stage_ready',
    classificationReason: 'exact_form_pdf_or_form_like_source_role',
    confidenceScore: 1,
    requiredFieldCompleteness: 1,
    unsupportedDefaultedFieldCount: 0,
    fieldEvidenceCoverage: 1,
    displayStatusDecision: 'published',
    fieldEntries: [
      { field: 'title', value: 'TO REQUEST APPEAL OF PROVIDER ENROLLMENT DENIAL:' },
      { field: 'form_number', value: 'SOC 856' },
      { field: 'official_download_url', value: 'https://cdss.ca.gov/Portals/9/Additional-Resources/Forms-and-Brochures/2019/Q-T/SOC856.pdf' },
      { field: 'issuing_agency', value: 'California Department of Social Services' },
      { field: 'who_uses_it', value: 'Appeal applicants' },
      { field: 'who_signs_it', value: 'Applicant signs form' },
      { field: 'where_to_send_it', value: 'Send to county appeal office' },
      { field: 'revision_date', value: '7/19' },
    ],
  },
  {
    runId: 'ca-v3',
    recordId: 'california|waivers|dds-hcbs|hcbs_program_index|hash4',
    family: 'waivers',
    stateId: 'california',
    authority: 'official_state',
    agency: 'DDS',
    provenanceUrl: 'https://www.dds.ca.gov/initiatives/hcbs/',
    sourceRole: 'hcbs_program_index',
    sourceUrl: 'https://www.dds.ca.gov/initiatives/hcbs/',
    finalUrl: 'https://www.dds.ca.gov/initiatives/hcbs/',
    artifactPath: 'data/source-acquisition-runs/ca-v3/raw/hash4.html',
    sha256: 'hash4',
    fetchedAt: '2026-06-20T20:23:02.950Z',
    pageTitle: 'Home and Community-Based Services Programs',
    entityType: 'program',
    destinationTable: 'programs',
    semanticStatus: 'stage_ready',
    classificationReason: 'program_action_signals_present',
    confidenceScore: 0.95,
    requiredFieldCompleteness: 1,
    unsupportedDefaultedFieldCount: 0,
    fieldEvidenceCoverage: 0.8,
    displayStatusDecision: 'published',
    fieldEntries: [
      { field: 'name', value: 'Home and Community-Based Services Programs' },
      { field: 'description', value: 'DDS HCBS overview' },
      { field: 'action_url', value: 'https://www.dds.ca.gov/wp-content/uploads/2025/02/Application_for_1915c_HCBSWaiver_CA.0336.R05.10_1.1.25.pdf' },
      { field: 'source_url', value: 'https://www.dds.ca.gov/initiatives/hcbs/' },
    ],
  },
];

fs.writeFileSync(path.join(generatedDir, 'ca_publish_decisions_v1.jsonl'), publishedRows.map((row) => JSON.stringify(row)).join('\n') + '\n');

const stagedRows = {
  dd_routing: [{ recordId: publishedRows[0].recordId, candidate: { row: { suggested_target_table: 'state_resource_agencies', extracted_name: 'Home', extracted_website: 'https://www.altaregional.org/', extracted_phone: '(916) 978-6572', counties_served: 'alameda', catchment_boundaries: 'alameda', display_status: 'published' } } }],
  medicaid_hhs_offices: [{ recordId: publishedRows[1].recordId, candidate: { row: { suggested_target_table: 'county_offices', extracted_name: 'Welcome', extracted_website: 'https://socialservices.alamedacountyca.gov/index.page', extracted_phone: '(510) 263-2420', extracted_address: '8477 Enterprise Way, Oakland, CA 94621', display_status: 'published' } } }],
  forms_guides: [{ recordId: publishedRows[2].recordId, candidate: { row: { suggested_target_table: 'forms_and_guides', slug: 'soc-856', source_name: 'CDSS', official_download_url: publishedRows[2].sourceUrl, display_status: 'published' } } }],
  waivers: [{ recordId: publishedRows[3].recordId, candidate: { row: { suggested_target_table: 'programs', extracted_name: 'Bad Name', program_type: 'waivers', display_status: 'published' } } }],
};
for (const [family, rows] of Object.entries(stagedRows)) {
  fs.writeFileSync(path.join(stagedDir, family, 'promotion-candidates.ndjson'), rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
}

let result = spawnSync(process.execPath, [path.join(repoRoot, 'scripts', 'run-ca-source-pack-published-upsert-v1.mjs'), `--db-path=${dbPath}`, `--input-dir=${generatedDir}`, `--runs-dir=${path.join(tmp, 'data', 'source-acquisition-runs')}`, '--run-id=ca-v3', '--mode=apply'], {
  cwd: repoRoot,
  encoding: 'utf8',
});
assert.equal(result.status, 0, result.stderr);

const verifyDb = new Database(dbPath);
const rc = verifyDb.prepare(`SELECT name, office_locations, display_status FROM state_resource_agencies WHERE id = 'existing-rc'`).get();
assert.equal(rc.name, 'Alta California Regional Center');
assert.equal(rc.display_status, 'published');
assert.match(rc.office_locations, /Sacramento/);

const office = verifyDb.prepare(`SELECT office_name, county_id, program_id, display_status FROM county_offices WHERE id = 'existing-office'`).get();
assert.equal(office.office_name, 'Alameda County Social Services Agency');
assert.equal(office.county_id, 'alameda');
assert.equal(office.program_id, 'ihss-for-children');
assert.equal(office.display_status, 'published');

const form = verifyDb.prepare(`SELECT title, form_type, display_status FROM forms_and_guides`).get();
assert.equal(form.title, 'TO REQUEST APPEAL OF PROVIDER ENROLLMENT DENIAL:');
assert.equal(form.form_type, 'SOC 856');
assert.equal(form.display_status, 'published');

const program = verifyDb.prepare(`SELECT name, program_type, display_status FROM programs`).get();
assert.equal(program.name, 'Home and Community-Based Services Programs');
assert.equal(program.program_type, 'waivers');
assert.equal(program.display_status, 'published');

console.log('ca source pack published upsert tests passed');
