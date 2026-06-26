import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { slugify } from './source-acquisition-stage-lib.mjs';
import { isGenericHeading, officialLikeUrl, hasContactSignal } from './source-acquisition-promote-lib.mjs';

const repoRoot = process.cwd();
const defaultDbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const summaryJsonPath = path.join(generatedDir, 'canonical-consolidation-v1-summary.json');
const summaryMdPath = path.join(generatedDir, 'canonical-consolidation-v1-summary.md');

function parseArgs(argv) {
  const args = {
    dbPath: defaultDbPath,
    mode: 'apply',
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'db-path' && value) args.dbPath = path.resolve(value);
    if (flag === 'mode' && value) args.mode = value;
  }
  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readCount(db, tableName) {
  return db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get().count;
}

function appendReason(existing, reason) {
  const base = String(existing || '').trim();
  if (!base) return reason;
  if (base.includes(reason)) return base;
  return `${base} | ${reason}`;
}

function safeName(...values) {
  for (const value of values) {
    if (String(value || '').trim()) return String(value).trim();
  }
  return '';
}

function isGenericProgramName(name) {
  const normalized = String(name || '').trim().toLowerCase();
  if (!normalized) return true;
  if (isGenericHeading(normalized)) return true;
  return [
    'home',
    'welcome',
    'page inactive',
    'transition plan',
    'rules',
    'general information',
  ].some((token) => normalized === token || normalized.includes(`${token} |`) || normalized.endsWith(` ${token}`));
}

function isWeakProgramPage(row) {
  const name = String(row.extracted_name || '').toLowerCase();
  const description = String(row.description || '').toLowerCase();
  return (
    name.includes('transition plan')
    || name.includes('rules')
    || description.includes('transition plan')
    || description.includes('published the final rule')
  );
}

function hasFormRouteValue(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return false;
  return normalized === 'not_applicable'
    || normalized === 'n/a'
    || normalized.includes('portal')
    || normalized.includes('directory')
    || normalized.includes('mail')
    || normalized.includes('submit')
    || normalized.includes('send');
}

function programDuplicate(db, row) {
  return db.prepare(`
    SELECT id FROM programs
    WHERE state_id = ?
      AND (
        lower(name) = lower(?)
        OR official_source_url = ?
        OR source_url = ?
      )
    LIMIT 1
  `).get(row.state_id, row.extracted_name, row.official_source_url, row.source_url);
}

function formDuplicate(db, row, title) {
  return db.prepare(`
    SELECT id FROM forms_and_guides
    WHERE state_id = ?
      AND (
        pdf_url = ?
        OR source_url = ?
        OR lower(title) = lower(?)
      )
    LIMIT 1
  `).get(row.state_id, row.official_download_url, row.source_url, title);
}

function waitlistDuplicate(db, row) {
  return db.prepare(`
    SELECT id FROM program_waitlists
    WHERE (
      program_id = ?
      AND estimate_source_url = ?
    )
    OR (
      program_id = ?
      AND lower(name) = lower(?)
    )
    LIMIT 1
  `).get(row.program_id, row.estimate_source_url, row.program_id, row.name);
}

function countyOfficeDuplicate(db, row) {
  return db.prepare(`
    SELECT id FROM county_offices
    WHERE county_id = ?
      AND COALESCE(program_id, '') = COALESCE(?, '')
      AND (
        office_name = ?
        OR phone = ?
        OR website = ?
        OR source_url = ?
      )
    LIMIT 1
  `).get(row.county_id, row.program_id, row.extracted_name, row.extracted_phone, row.extracted_website, row.source_url);
}

function regionalAgencyDuplicate(db, row) {
  return db.prepare(`
    SELECT id FROM regional_education_agencies
    WHERE state_id = ?
      AND (
        lower(name) = lower(?)
        OR website = ?
        OR source_url = ?
      )
    LIMIT 1
  `).get(row.state_id, row.extracted_name, row.extracted_website, row.source_url);
}

function schoolDistrictDuplicate(db, row) {
  return db.prepare(`
    SELECT id FROM school_districts
    WHERE county_id = ?
      AND (
        lower(name) = lower(?)
        OR website = ?
        OR source_url = ?
      )
    LIMIT 1
  `).get(row.county_id, row.extracted_name, row.extracted_website, row.source_url);
}

function sourceDuplicate(db, row) {
  return db.prepare(`
    SELECT id FROM sources
    WHERE program_id = ?
      AND url = ?
    LIMIT 1
  `).get(row.program_id, row.url || row.source_url);
}

function nonprofitDuplicate(db, row) {
  return db.prepare(`
    SELECT id FROM nonprofit_organizations
    WHERE county_id = ?
      AND (
        lower(name) = lower(?)
        OR website = ?
        OR source_url = ?
      )
    LIMIT 1
  `).get(row.county_id, row.extracted_name, row.extracted_website, row.source_url);
}

function providerDuplicate(db, row) {
  return db.prepare(`
    SELECT id FROM resource_providers
    WHERE county_id = ?
      AND (
        lower(name) = lower(?)
        OR phone = ?
        OR source_url = ?
      )
    LIMIT 1
  `).get(row.county_id, row.extracted_name, row.extracted_phone, row.source_url);
}

function stateAgencyDuplicate(db, row) {
  return db.prepare(`
    SELECT id FROM state_resource_agencies
    WHERE state_id = ?
      AND agency_type = ?
      AND (
        lower(name) = lower(?)
        OR website = ?
        OR source_url = ?
      )
    LIMIT 1
  `).get(row.state_id, row.agency_type, row.extracted_name, row.extracted_website, row.source_url);
}

function inferFormTitle(row) {
  return safeName(row.source_name, row.program, row.slug);
}

function classifyRow(db, tableName, row) {
  if (String(row.review_status || '').startsWith('blocked_')) {
    return { disposition: 'blocked', reason: row.review_status, terminalStatus: row.review_status };
  }
  if (String(row.review_status || '').startsWith('quarantined_')) {
    return { disposition: 'quarantined', reason: row.review_status, terminalStatus: row.review_status };
  }
  if (String(row.review_status || '').startsWith('rejected_')) {
    return { disposition: 'rejected', reason: row.review_status, terminalStatus: row.review_status };
  }
  if (row.review_status === 'promoted_canonical') {
    return { disposition: 'promoted', reason: 'already_promoted_canonical', terminalStatus: 'promoted_canonical' };
  }

  if (tableName === 'staging_scraped_programs') {
    const duplicate = programDuplicate(db, row);
    if (duplicate) return { disposition: 'rejected', reason: 'duplicate_existing_program', terminalStatus: 'rejected_duplicate', duplicateId: duplicate.id };
    if (isGenericProgramName(row.extracted_name) || isWeakProgramPage(row)) {
      return { disposition: 'quarantined', reason: 'quarantined_generic_or_policy_program_page', terminalStatus: 'quarantined_generic_or_policy_program_page' };
    }
    if (!row.description || !String(row.description).trim() || !row.official_source_url) {
      return { disposition: 'blocked', reason: 'blocked_missing_program_core_fields', terminalStatus: 'blocked_missing_program_core_fields' };
    }
    return { disposition: 'promoted', reason: 'promote_program_candidate', terminalStatus: 'promoted_canonical' };
  }

  if (tableName === 'staging_scraped_waitlists') {
    const duplicate = waitlistDuplicate(db, row);
    if (duplicate) return { disposition: 'rejected', reason: 'duplicate_existing_waitlist', terminalStatus: 'rejected_duplicate', duplicateId: duplicate.id };
    if (!row.program_id || !row.estimate_source_url) {
      return { disposition: 'blocked', reason: 'blocked_missing_waitlist_program_or_source', terminalStatus: 'blocked_missing_waitlist_program_or_source' };
    }
    return { disposition: 'promoted', reason: 'promote_waitlist_candidate', terminalStatus: 'promoted_canonical' };
  }

  if (tableName === 'staging_scraped_forms') {
    const title = inferFormTitle(row);
    const duplicate = formDuplicate(db, row, title);
    if (duplicate) return { disposition: 'rejected', reason: 'duplicate_existing_form', terminalStatus: 'rejected_duplicate', duplicateId: duplicate.id };
    if (!row.official_download_url || !String(row.official_download_url).trim()) {
      return { disposition: 'blocked', reason: 'blocked_missing_exact_download_url', terminalStatus: 'blocked_missing_exact_download_url' };
    }
    if (isGenericHeading(title) || title.toLowerCase().includes('home') || title.toLowerCase().includes('welcome')) {
      return { disposition: 'quarantined', reason: 'quarantined_generic_form_page', terminalStatus: 'quarantined_generic_form_page' };
    }
    if (!String(row.who_uses_it || '').trim() || !hasFormRouteValue(row.who_signs_it) || !hasFormRouteValue(row.where_to_send_it)) {
      return { disposition: 'quarantined', reason: 'quarantined_incomplete_form_workflow', terminalStatus: 'quarantined_incomplete_form_workflow' };
    }
    return { disposition: 'promoted', reason: 'promote_form_candidate', terminalStatus: 'promoted_canonical' };
  }

  if (tableName === 'staging_scraped_county_offices') {
    const duplicate = countyOfficeDuplicate(db, row);
    if (duplicate) return { disposition: 'rejected', reason: 'duplicate_existing_county_office', terminalStatus: 'rejected_duplicate', duplicateId: duplicate.id };
    if (!row.county_id || !row.extracted_name || !row.extracted_phone || !row.extracted_address) {
      return { disposition: 'blocked', reason: 'blocked_missing_county_office_fields', terminalStatus: 'blocked_missing_county_office_fields' };
    }
    return { disposition: 'promoted', reason: 'promote_county_office_candidate', terminalStatus: 'promoted_canonical' };
  }

  if (tableName === 'staging_scraped_regional_education_agencies') {
    const duplicate = regionalAgencyDuplicate(db, row);
    if (duplicate) return { disposition: 'rejected', reason: 'duplicate_existing_regional_agency', terminalStatus: 'rejected_duplicate', duplicateId: duplicate.id };
    if (!row.state_id || !row.extracted_name || !row.extracted_website) {
      return { disposition: 'blocked', reason: 'blocked_missing_regional_agency_fields', terminalStatus: 'blocked_missing_regional_agency_fields' };
    }
    if (isGenericHeading(row.extracted_name)) {
      return { disposition: 'quarantined', reason: 'quarantined_generic_regional_agency_name', terminalStatus: 'quarantined_generic_regional_agency_name' };
    }
    return { disposition: 'promoted', reason: 'promote_regional_agency_candidate', terminalStatus: 'promoted_canonical' };
  }

  if (tableName === 'staging_scraped_school_districts') {
    const duplicate = schoolDistrictDuplicate(db, row);
    if (duplicate) return { disposition: 'rejected', reason: 'duplicate_existing_school_district', terminalStatus: 'rejected_duplicate', duplicateId: duplicate.id };
    if (!row.county_id || !row.extracted_name || !row.extracted_website) {
      return { disposition: 'blocked', reason: 'blocked_missing_school_district_fields', terminalStatus: 'blocked_missing_school_district_fields' };
    }
    if (isGenericHeading(row.extracted_name)) {
      return { disposition: 'quarantined', reason: 'quarantined_generic_school_district_name', terminalStatus: 'quarantined_generic_school_district_name' };
    }
    return { disposition: 'promoted', reason: 'promote_school_district_candidate', terminalStatus: 'promoted_canonical' };
  }

  if (tableName === 'staging_scraped_sources') {
    const duplicate = sourceDuplicate(db, row);
    if (duplicate) return { disposition: 'rejected', reason: 'duplicate_existing_source', terminalStatus: 'rejected_duplicate', duplicateId: duplicate.id };
    if (!row.program_id || !(row.url || row.source_url) || !row.type) {
      return { disposition: 'blocked', reason: 'blocked_missing_source_document_fields', terminalStatus: 'blocked_missing_source_document_fields' };
    }
    return { disposition: 'promoted', reason: 'promote_source_document_candidate', terminalStatus: 'promoted_canonical' };
  }

  if (tableName === 'staging_scraped_nonprofit_organizations') {
    const duplicate = nonprofitDuplicate(db, row);
    if (duplicate) return { disposition: 'rejected', reason: 'duplicate_existing_nonprofit', terminalStatus: 'rejected_duplicate', duplicateId: duplicate.id };
    if (!row.county_id || isGenericHeading(row.extracted_name)) {
      return { disposition: 'blocked', reason: 'blocked_missing_nonprofit_county_or_name', terminalStatus: 'blocked_missing_nonprofit_county_or_name' };
    }
    if (!hasContactSignal(row)) {
      return { disposition: 'quarantined', reason: 'quarantined_nonprofit_missing_contact_signal', terminalStatus: 'quarantined_nonprofit_missing_contact_signal' };
    }
    return { disposition: 'promoted', reason: 'promote_nonprofit_candidate', terminalStatus: 'promoted_canonical' };
  }

  if (tableName === 'staging_scraped_resource_providers') {
    const duplicate = providerDuplicate(db, row);
    if (duplicate) return { disposition: 'rejected', reason: 'duplicate_existing_provider', terminalStatus: 'rejected_duplicate', duplicateId: duplicate.id };
    if (!row.county_id || !row.extracted_address) {
      return { disposition: 'blocked', reason: 'blocked_missing_provider_county_or_address', terminalStatus: 'blocked_missing_provider_county_or_address' };
    }
    if (isGenericHeading(row.extracted_name)) {
      return { disposition: 'quarantined', reason: 'quarantined_generic_provider_name', terminalStatus: 'quarantined_generic_provider_name' };
    }
    if (!hasContactSignal(row)) {
      return { disposition: 'quarantined', reason: 'quarantined_provider_missing_contact_signal', terminalStatus: 'quarantined_provider_missing_contact_signal' };
    }
    return { disposition: 'promoted', reason: 'promote_provider_candidate', terminalStatus: 'promoted_canonical' };
  }

  if (tableName === 'staging_scraped_state_resource_agencies') {
    const duplicate = stateAgencyDuplicate(db, row);
    if (duplicate) return { disposition: 'rejected', reason: 'duplicate_existing_state_resource_agency', terminalStatus: 'rejected_duplicate', duplicateId: duplicate.id };
    if (isGenericHeading(row.extracted_name)) {
      return { disposition: 'quarantined', reason: 'quarantined_generic_state_agency_name', terminalStatus: 'quarantined_generic_state_agency_name' };
    }
    if (!row.extracted_phone && !row.extracted_website) {
      return { disposition: 'blocked', reason: 'blocked_missing_agency_contact_signal', terminalStatus: 'blocked_missing_agency_contact_signal' };
    }
    if (!officialLikeUrl(row.source_url) && !officialLikeUrl(row.extracted_website || '')) {
      return { disposition: 'quarantined', reason: 'quarantined_non_official_state_agency_domain', terminalStatus: 'quarantined_non_official_state_agency_domain' };
    }
    if (['lidda', 'eci', 'cfc', 'apd_office'].includes(row.agency_type) && (!row.counties_served || row.counties_served === row.state_id)) {
      return { disposition: 'blocked', reason: 'blocked_missing_precise_agency_coverage', terminalStatus: 'blocked_missing_precise_agency_coverage' };
    }
    return { disposition: 'promoted', reason: 'promote_state_resource_agency_candidate', terminalStatus: 'promoted_canonical' };
  }

  if (tableName === 'staging_scraped_iep_advocates') {
    return {
      disposition: 'quarantined',
      reason: 'quarantined_advocate_semantic_destination_split_required',
      terminalStatus: 'quarantined_advocate_semantic_destination_split_required',
    };
  }

  if (tableName === 'staging_scraped_knowledge_content') {
    return { disposition: 'rejected', reason: 'knowledge_content_already_resolved_duplicate_or_closed', terminalStatus: 'rejected_duplicate' };
  }

  return { disposition: 'quarantined', reason: 'quarantined_unsupported_staging_table', terminalStatus: 'quarantined_unsupported_staging_table' };
}

function buildPromotion(tableName, row, timestamp) {
  const today = timestamp.slice(0, 10);
  if (tableName === 'staging_scraped_programs') {
    const id = slugify(`${row.state_id}-${row.program_type || 'program'}-${row.extracted_name}`);
    return {
      targetTable: 'programs',
      targetId: id,
      columns: ['id', 'name', 'description', 'who_it_is_for', 'who_might_qualify', 'official_source_url', 'category', 'confidence_score', 'last_verified_date', 'state_id', 'source_url', 'source_type', 'data_origin', 'verification_status', 'last_scraped_at', 'program_type'],
      values: [id, row.extracted_name, row.description, row.who_it_is_for || '', row.who_might_qualify || '', row.official_source_url || row.source_url, row.state_id === 'national' ? 'federal' : 'state', row.confidence_score, today, row.state_id, row.source_url, row.source_type, 'canonical_consolidation_v1', 'verified', row.scraped_at, row.program_type || 'programs_benefits'],
    };
  }
  if (tableName === 'staging_scraped_waitlists') {
    const id = slugify(`${row.program_id}-${row.name}`);
    return {
      targetTable: 'program_waitlists',
      targetId: id,
      columns: ['id', 'program_id', 'name', 'duration_label', 'duration_months', 'status', 'description', 'reserve_capacity_notice', 'legal_deadline', 'last_scraped_at', 'estimate_source_url', 'estimate_source_type', 'last_checked_at'],
      values: [id, row.program_id, row.name, row.duration_label || '', row.duration_months || null, row.status || 'unknown', row.description || '', '', '', row.scraped_at, row.estimate_source_url || row.source_url, row.estimate_source_type || row.source_type, row.last_checked_at || timestamp],
    };
  }
  if (tableName === 'staging_scraped_forms') {
    const title = inferFormTitle(row);
    const id = slugify(`${row.state_id}-${title}-${row.official_download_url}`);
    return {
      targetTable: 'forms_and_guides',
      targetId: id,
      columns: ['id', 'state_id', 'program_id', 'title', 'slug', 'category', 'form_type', 'agency', 'source_url', 'pdf_url', 'language', 'description', 'related_action', 'display_context', 'who_uses_it', 'who_signs_it', 'where_to_send_it', 'deadline', 'attachments', 'common_mistakes', 'letter_template', 'call_script', 'evidence_level', 'data_origin', 'verification_status', 'confidence_score', 'last_checked_at', 'last_verified_at'],
      values: [id, row.state_id, null, title, row.slug || slugify(title), 'forms_guides', 'official_form_or_guide', row.source_name || '', row.source_url, row.official_download_url, 'en', row.raw_text_excerpt || '', '', 'program', row.who_uses_it || '', row.who_signs_it || '', row.where_to_send_it || '', '', '', '', '', row.letter_script || '', 'official_form_guide_extract', 'canonical_consolidation_v1', 'verified', row.confidence_score, timestamp, timestamp],
    };
  }
  if (tableName === 'staging_scraped_county_offices') {
    const id = slugify(`${row.county_id}-${row.program_id || 'office'}-${row.extracted_name}`);
    return {
      targetTable: 'county_offices',
      targetId: id,
      columns: ['id', 'county_id', 'program_id', 'office_name', 'address', 'phone', 'email', 'website', 'source_url', 'source_type', 'data_origin', 'verification_status', 'last_verified_date', 'last_scraped_at', 'confidence_score', 'evidence_level'],
      values: [id, row.county_id, row.program_id || '', row.extracted_name, row.extracted_address, row.extracted_phone, row.extracted_email || '', row.extracted_website || row.source_url, row.source_url, row.source_type, 'canonical_consolidation_v1', 'verified', today, row.scraped_at, row.confidence_score, row.evidence_level || 'official_county_office'],
    };
  }
  if (tableName === 'staging_scraped_regional_education_agencies') {
    const id = slugify(`${row.state_id}-${row.agency_type || 'regional'}-${row.extracted_name}`);
    return {
      targetTable: 'regional_education_agencies',
      targetId: id,
      columns: ['id', 'state_id', 'agency_type', 'name', 'counties_served', 'website', 'source_url', 'source_type', 'data_origin', 'verification_status', 'last_verified_date', 'last_scraped_at', 'confidence_score', 'evidence_level'],
      values: [id, row.state_id, row.agency_type || 'regional_education_agency', row.extracted_name, row.counties_served || '', row.extracted_website, row.source_url, row.source_type, 'canonical_consolidation_v1', 'verified', today, row.scraped_at, row.confidence_score, row.evidence_level || 'official_directory'],
    };
  }
  if (tableName === 'staging_scraped_school_districts') {
    const id = slugify(`${row.county_id}-${row.extracted_name}`);
    return {
      targetTable: 'school_districts',
      targetId: id,
      columns: ['id', 'county_id', 'name', 'spec_ed_contact_phone', 'spec_ed_contact_email', 'website', 'total_enrollment', 'special_ed_pct', 'inclusion_rate_pct', 'self_contained_rate_pct', 'source_url', 'source_type', 'data_origin', 'verification_status', 'last_verified_date', 'last_scraped_at', 'confidence_score', 'evidence_level'],
      values: [id, row.county_id, row.extracted_name, row.spec_ed_contact_phone || '', row.spec_ed_contact_email || '', row.extracted_website, row.total_enrollment || null, null, null, null, row.source_url, row.source_type, 'canonical_consolidation_v1', 'verified', today, row.scraped_at, row.confidence_score, row.evidence_level || 'official_directory'],
    };
  }
  if (tableName === 'staging_scraped_sources') {
    const url = row.url || row.source_url;
    const id = slugify(`src-${row.program_id}-${url}`);
    return {
      targetTable: 'sources',
      targetId: id,
      columns: ['id', 'program_id', 'url', 'type', 'confidence_rating', 'source_url', 'source_type', 'data_origin', 'verification_status', 'last_verified_date', 'last_scraped_at', 'confidence_score'],
      values: [id, row.program_id, url, row.type, row.confidence_rating || 'medium', row.source_url, row.source_type, 'canonical_consolidation_v1', 'verified', today, row.scraped_at, row.confidence_score],
    };
  }
  if (tableName === 'staging_scraped_nonprofit_organizations') {
    const id = slugify(`${row.state_id}-${row.county_id}-${row.extracted_name}-np`);
    return {
      targetTable: 'nonprofit_organizations',
      targetId: id,
      columns: ['id', 'name', 'county_id', 'website', 'phone', 'focus_condition', 'source_url', 'source_type', 'data_origin', 'verification_status', 'last_verified_date', 'last_scraped_at', 'confidence_score'],
      values: [id, row.extracted_name, row.county_id, row.extracted_website || row.source_url, row.extracted_phone || '', row.focus_condition || 'nonprofit_support', row.source_url, row.source_type, 'canonical_consolidation_v1', 'verified', today, row.scraped_at, row.confidence_score],
    };
  }
  if (tableName === 'staging_scraped_resource_providers') {
    const id = slugify(`${row.state_id}-${row.county_id}-${row.extracted_name}-rp`);
    return {
      targetTable: 'resource_providers',
      targetId: id,
      columns: ['id', 'name', 'categories', 'county_id', 'phone', 'email', 'address', 'accepts_medi_cal', 'regional_center_vendor_ids', 'source_url', 'source_type', 'data_origin', 'verification_status', 'last_verified_date', 'last_scraped_at', 'confidence_score', 'source_name', 'next_step_type', 'next_step_label', 'next_step_url', 'next_step_phone', 'next_step_email'],
      values: [id, row.extracted_name, row.categories || 'providers_care', row.county_id, row.extracted_phone || '', row.extracted_email || '', row.extracted_address, row.accepts_medi_cal || 0, '', row.source_url, row.source_type, 'canonical_consolidation_v1', 'verified', today, row.scraped_at, row.confidence_score, row.source_name || row.extracted_name, 'contact_provider', 'Contact provider', row.source_url, row.extracted_phone || '', row.extracted_email || ''],
    };
  }
  if (tableName === 'staging_scraped_state_resource_agencies') {
    const id = slugify(`${row.state_id}-${row.agency_type}-${row.extracted_name}`);
    return {
      targetTable: 'state_resource_agencies',
      targetId: id,
      columns: ['id', 'state_id', 'agency_type', 'name', 'counties_served', 'catchment_boundaries', 'website', 'intake_phone', 'early_intervention_contact', 'agency_intake_contact', 'eligibility_info_page', 'services_page', 'appeals_info', 'languages', 'last_verified_date', 'source_urls', 'source_url', 'source_type', 'data_origin', 'verification_status', 'last_scraped_at', 'confidence_score', 'evidence_level'],
      values: [id, row.state_id, row.agency_type, row.extracted_name, row.counties_served || row.state_id, row.counties_served || '', row.extracted_website || row.source_url, row.extracted_phone || '', row.early_intervention_contact || '', row.agency_intake_contact || row.extracted_phone || '', row.eligibility_info_page || row.source_url, row.services_page || row.source_url, row.appeals_info || row.source_url, 'English', today, row.source_url, row.source_url, row.source_type, 'canonical_consolidation_v1', 'verified', row.scraped_at, row.confidence_score, row.evidence_level || 'official_state_agency'],
    };
  }
  return null;
}

function insertPromotionAudit(db, tableName, stagingId, targetTable, targetId, sourceUrl, row, reason, timestamp) {
  db.prepare(`
    INSERT INTO staging_promotion_audit
      (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    tableName,
    stagingId,
    targetTable,
    targetId,
    timestamp,
    sourceUrl || '',
    null,
    JSON.stringify(row),
    reason,
  );
}

function insertVerificationEvent(db, sourceId, row, timestamp) {
  const existing = db.prepare(`
    SELECT id FROM source_verifications
    WHERE source_id = ?
      AND verified_by = 'canonical_consolidation_v1'
    LIMIT 1
  `).get(sourceId);
  if (existing) return;
  const verificationId = slugify(`ver-${sourceId}-${timestamp}`);
  db.prepare(`
    INSERT INTO source_verifications
      (id, source_id, verified_by, verified_date, notes, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    verificationId,
    sourceId,
    'canonical_consolidation_v1',
    timestamp.slice(0, 10),
    `Promoted from staging_scraped_sources during canonical consolidation v1.`,
    row.source_url || row.url || '',
    row.source_type || '',
    'canonical_consolidation_v1',
    'verified',
    timestamp.slice(0, 10),
    row.scraped_at || timestamp,
    row.confidence_score || null,
  );
}

const tableConfigs = [
  'staging_scraped_programs',
  'staging_scraped_waitlists',
  'staging_scraped_forms',
  'staging_scraped_county_offices',
  'staging_scraped_regional_education_agencies',
  'staging_scraped_school_districts',
  'staging_scraped_state_resource_agencies',
  'staging_scraped_nonprofit_organizations',
  'staging_scraped_resource_providers',
  'staging_scraped_iep_advocates',
  'staging_scraped_sources',
  'staging_scraped_knowledge_content',
];

const args = parseArgs(process.argv.slice(2));
const db = new Database(args.dbPath);
const timestamp = new Date().toISOString();
ensureDir(generatedDir);

const canonicalTables = [
  'programs',
  'state_resource_agencies',
  'county_offices',
  'school_districts',
  'regional_education_agencies',
  'forms_and_guides',
  'program_waitlists',
  'nonprofit_organizations',
  'resource_providers',
  'sources',
  'source_verifications',
];

const beforeCounts = Object.fromEntries(canonicalTables.map((table) => [table, readCount(db, table)]));
const summary = {
  runAt: timestamp,
  mode: args.mode,
  dbPath: path.relative(repoRoot, args.dbPath),
  tables: [],
  totals: {
    inspected: 0,
    promoted: 0,
    rejected: 0,
    quarantined: 0,
    blocked: 0,
  },
};

const tx = db.transaction(() => {
  for (const tableName of tableConfigs) {
    const rows = db.prepare(`SELECT * FROM ${tableName} ORDER BY id`).all();
    const tableSummary = {
      stagingTable: tableName,
      inspected: rows.length,
      promoted: 0,
      rejected: 0,
      quarantined: 0,
      blocked: 0,
      promotedTo: {},
      reasons: {},
    };

    for (const row of rows) {
      const outcome = classifyRow(db, tableName, row);
      tableSummary[outcome.disposition] += 1;
      tableSummary.reasons[outcome.reason] = (tableSummary.reasons[outcome.reason] || 0) + 1;
      summary.totals[outcome.disposition] += 1;
      summary.totals.inspected += 1;

      if (args.mode === 'apply') {
        if (outcome.disposition === 'promoted') {
          const promotion = buildPromotion(tableName, row, timestamp);
          if (promotion) {
            const placeholders = promotion.columns.map(() => '?').join(', ');
            db.prepare(`INSERT INTO ${promotion.targetTable} (${promotion.columns.join(', ')}) VALUES (${placeholders})`)
              .run(...promotion.values);
            db.prepare(`
              UPDATE ${tableName}
              SET review_status = ?, suggested_target_table = ?, suggested_target_id = ?, duplicate_candidate_id = NULL, extraction_notes = ?
              WHERE id = ?
            `).run(
              outcome.terminalStatus,
              promotion.targetTable,
              promotion.targetId,
              appendReason(row.extraction_notes, `canonical_consolidation_v1:${outcome.reason}`),
              row.id,
            );
            insertPromotionAudit(db, tableName, row.id, promotion.targetTable, promotion.targetId, row.source_url, row, outcome.reason, timestamp);
            if (tableName === 'staging_scraped_sources') {
              insertVerificationEvent(db, promotion.targetId, row, timestamp);
            }
            tableSummary.promotedTo[promotion.targetTable] = (tableSummary.promotedTo[promotion.targetTable] || 0) + 1;
          }
        } else if (outcome.disposition === 'rejected') {
          db.prepare(`
            UPDATE ${tableName}
            SET review_status = ?, duplicate_candidate_id = COALESCE(?, duplicate_candidate_id), extraction_notes = ?
            WHERE id = ?
          `).run(
            outcome.terminalStatus,
            outcome.duplicateId || null,
            appendReason(row.extraction_notes, `canonical_consolidation_v1:${outcome.reason}`),
            row.id,
          );
        } else {
          db.prepare(`
            UPDATE ${tableName}
            SET review_status = ?, extraction_notes = ?
            WHERE id = ?
          `).run(
            outcome.terminalStatus,
            appendReason(row.extraction_notes, `canonical_consolidation_v1:${outcome.reason}`),
            row.id,
          );
        }
      }
    }

    summary.tables.push(tableSummary);
  }
});

tx();

const afterCounts = Object.fromEntries(canonicalTables.map((table) => [table, readCount(db, table)]));
summary.canonicalCountsBefore = beforeCounts;
summary.canonicalCountsAfter = afterCounts;
summary.canonicalCountDeltas = Object.fromEntries(
  canonicalTables.map((table) => [table, afterCounts[table] - beforeCounts[table]]),
);

const markdown = [
  '# Canonical Consolidation V1',
  '',
  `- Run at: \`${timestamp}\``,
  `- Mode: \`${args.mode}\``,
  `- Database: \`${summary.dbPath}\``,
  '',
  '## Totals',
  '',
  `- Inspected: ${summary.totals.inspected}`,
  `- Promoted: ${summary.totals.promoted}`,
  `- Rejected: ${summary.totals.rejected}`,
  `- Quarantined: ${summary.totals.quarantined}`,
  `- Blocked: ${summary.totals.blocked}`,
  '',
  '## Canonical Count Deltas',
  '',
  ...Object.entries(summary.canonicalCountDeltas).map(([table, delta]) => `- ${table}: ${beforeCounts[table]} -> ${afterCounts[table]} (${delta >= 0 ? '+' : ''}${delta})`),
  '',
  '## Table Outcomes',
  '',
  ...summary.tables.flatMap((row) => [
    `### ${row.stagingTable}`,
    `- inspected: ${row.inspected}`,
    `- promoted: ${row.promoted}`,
    `- rejected: ${row.rejected}`,
    `- quarantined: ${row.quarantined}`,
    `- blocked: ${row.blocked}`,
    ...Object.entries(row.promotedTo).map(([table, count]) => `- promoted to ${table}: ${count}`),
    '',
  ]),
];

fs.writeFileSync(summaryJsonPath, `${JSON.stringify(summary, null, 2)}\n`);
fs.writeFileSync(summaryMdPath, `${markdown.join('\n')}\n`);

db.close();
console.log(JSON.stringify({
  ok: true,
  summaryPath: path.relative(repoRoot, summaryJsonPath),
  totals: summary.totals,
  canonicalCountDeltas: summary.canonicalCountDeltas,
}, null, 2));
