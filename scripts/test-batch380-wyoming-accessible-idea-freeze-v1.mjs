import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch380WyomingAccessibleIdeaFreezeV1 } from './run-batch380-wyoming-accessible-idea-freeze-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

async function fetchText(url, init) {
  const response = await fetch(url, init);
  assert.equal(response.ok, true, `expected 200 from ${url}, got ${response.status}`);
  return response.text();
}

function decodeEntities(value) {
  return value
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&')
    .replaceAll('&nbsp;', ' ');
}

function hidden(text) {
  const out = {};
  for (const key of ['__VIEWSTATE', '__VIEWSTATEGENERATOR', '__EVENTVALIDATION']) {
    const match = text.match(new RegExp(`name="${key}" id="${key}" value="([^"]*)"`));
    assert.ok(match, `missing ${key}`);
    out[key] = match[1];
  }
  return out;
}

async function fetchWithCookie(url, init = {}, session = { cookie: '' }) {
  const headers = new Headers(init.headers || {});
  if (session.cookie) headers.set('cookie', session.cookie);
  const response = await fetch(url, { ...init, headers });
  const setCookies = response.headers.getSetCookie?.() || [];
  if (setCookies.length) {
    session.cookie = setCookies.map((value) => value.split(';', 1)[0]).join('; ');
  }
  return response;
}

async function validateLiveWdeDirectory() {
  const base = 'https://portals.edu.wyoming.gov/wyedpro/Pages/OnlineDirectory/OnlineDirectoryBreadCrumb.aspx';
  const session = { cookie: '' };
  const landingResponse = await fetchWithCookie(base, {}, session);
  assert.equal(landingResponse.ok, true, `expected 200 from ${base}, got ${landingResponse.status}`);
  const landing = await landingResponse.text();
  const post = hidden(landing);
  post['ctl00$ctl00$ctl00$ContentPlaceHolder1$CphBody$CphODBody$ColumnsGrid$ctl00$ctl10$ctl00'] = 'Wyoming Public School Districts';
  const listingResponse = await fetchWithCookie(base, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(post),
  }, session);
  assert.equal(listingResponse.ok, true, `expected 200 from ${base} listing POST, got ${listingResponse.status}`);
  const listing = await listingResponse.text();
  const buttons = [...listing.matchAll(/<input[^>]+type="button"[^>]+name="([^"]+)"[^>]+value="([^"]+)"[^>]+onclick="([^"]+)"/g)];
  assert.equal(buttons.length, 51);

  const records = [];
  for (const [, name, value, onclick] of buttons) {
    const eventTarget = decodeEntities(onclick).match(/__doPostBack\('([^']+)'/i)?.[1];
    assert.ok(eventTarget, `missing event target for ${value}`);
    const detailPost = hidden(listing);
    detailPost.__EVENTTARGET = eventTarget;
    detailPost.__EVENTARGUMENT = '';
    const detailResponse = await fetchWithCookie(base, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(detailPost),
    }, session);
    assert.equal(detailResponse.ok, true, `expected 200 from ${base} detail POST, got ${detailResponse.status}`);
    const detail = await detailResponse.text();
    assert.match(detail, /Special Education Director/i, `missing special-ed contact for ${value}`);
    const title = detail.match(/id="ctl00_ctl00_ctl00_ContentPlaceHolder1_CphBody_CphODBody_Name">([\s\S]*?)<\/h2>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
    assert.equal(title, value, `detail title mismatch for ${value}`);
    records.push({
      district_name: value,
      detail_title: title,
      special_education_rows: [...detail.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
        .map(([, row]) => decodeEntities(row.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim())
        .filter((row) => /Special Education/i.test(row)),
    });
  }

  return records;
}

async function validateLiveHcbsPdfs() {
  const urls = [
    'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
    'https://health.wyo.gov/wp-content/uploads/2025/09/HCBS-IMS-Specialists.pdf',
    'https://health.wyo.gov/wp-content/uploads/2025/09/HCBS-Credentialing-Specialist.pdf',
  ];
  for (const url of urls) {
    const response = await fetch(url, { method: 'HEAD' });
    assert.equal(response.ok, true, `expected 200 from ${url}, got ${response.status}`);
    assert.match(response.headers.get('content-type') || '', /application\/pdf/i, `expected PDF content type from ${url}`);
  }
}

const liveWdeRecords = await validateLiveWdeDirectory();
await validateLiveHcbsPdfs();

const result = generateBatch380WyomingAccessibleIdeaFreezeV1();
assert.equal(result.classification, 'COMPLETE');
assert.equal(result.index_safe, true);

const wdeEvidence = readJson('data/generated/wyoming_wde_directory_leaf_validation_v1.json');
assert.equal(wdeEvidence.district_count, 51);
assert.equal(wdeEvidence.county_count, 23);
assert.equal(wdeEvidence.county_names.length, 23);
assert.equal(wdeEvidence.district_leaf_records.length, 51);
assert.deepEqual(
  new Set(wdeEvidence.district_leaf_records.map((row) => row.district_name)),
  new Set(liveWdeRecords.map((row) => row.district_name))
);
assert.deepEqual(
  wdeEvidence.district_leaf_records
    .filter((row) => row.special_education_row_count < 1 || row.detail_title !== row.district_name)
    .map((row) => row.district_name),
  []
);
assert.equal(Object.keys(wdeEvidence.county_to_districts).length, 23);

const hcbsEvidence = readJson('data/generated/wyoming_hcbs_county_assignments_v1.json');
assert.equal(hcbsEvidence.county_count, 23);
assert.equal(hcbsEvidence.all_county_names.length, 23);
assert.equal(hcbsEvidence.contacts_page_live_status, 'cloudflare_403_blocked_from_current_runtime');
assert.match(hcbsEvidence.bes_excerpt, /Counties Served for DD/i);
assert.match(hcbsEvidence.bes_excerpt, /Albany/i);
assert.match(hcbsEvidence.bes_excerpt, /Weston/i);
assert.match(hcbsEvidence.ims_excerpt, /Assigned Counties/i);
assert.match(hcbsEvidence.credentialing_excerpt, /Assigned Counties/i);
assert.deepEqual(
  hcbsEvidence.all_county_names.filter((county) => !hcbsEvidence.county_to_bes_specialist[county]),
  []
);

const summary = readJson('data/generated/wyoming_california_grade_summary_v2.json');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.strong_critical_families, 12);
assert.equal(summary.weak_critical_families, 0);
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.final_blockers, []);

const gapRows = readJsonl('data/generated/wyoming_gap_matrix_v2.jsonl');
const district = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(district.family_status, 'verified_county_grade');
assert.match(district.status_reason, /51\/51 district detail leaves preserve the matching district title plus at least one direct `Special Education Director` contact row/i);

const county = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'verified_county_grade');
assert.match(county.status_reason, /Counties Served for DD`? assignments across all 23 Wyoming counties/i);
assert.match(county.status_reason, /landing page .* Cloudflare challenge/i);

const failureRows = readJsonl('data/generated/wyoming_failure_ledger_v2.jsonl');
assert.equal(failureRows.length, 0);

const nextRows = readJsonl('data/generated/wyoming_next_action_queue_v2.jsonl');
assert.equal(nextRows.length, 0);

const verifiedRows = readJsonl('data/generated/wyoming_verified_sources_v1.jsonl');
const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtVerified.family_status, 'verified_county_grade');
assert.equal(districtVerified.sample_count, 3);
assert.match(districtVerified.samples[2].evidence_snippet, /51\/51/i);
assert.doesNotMatch(districtVerified.samples[1].source_type, /generic_district_root/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_county_grade');
assert.equal(countyVerified.sample_count, 3);
assert.match(countyVerified.samples[0].source_url, /BES-Caseloads-Effective-10\.2025\.pdf$/);
assert.deepEqual(
  countyVerified.samples.filter((sample) => /contacts page/i.test(sample.sample_name)),
  []
);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'wyoming-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Wyoming is now `COMPLETE` and `index_safe=true`\./);
assert.match(report, /51 district detail leaves/i);
assert.match(report, /BES county-assignment PDF covers all 23 Wyoming counties/i);
assert.match(report, /Cloudflare challenge/i);

console.log('test-batch380-wyoming-accessible-idea-freeze-v1: ok');
