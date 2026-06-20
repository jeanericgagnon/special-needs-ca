import path from 'node:path';
import { slugify } from './source-acquisition-stage-lib.mjs';

export function isGenericHeading(value) {
  const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (/^(home|contact us|contact|page inactive|find a chapter|menu|ranked among the best|our vision|our mission|who we are|what we do|public safety|empowering our community|best place for kids|get care|learn how to connect with us)$/i.test(normalized)) {
    return true;
  }

  if (/^#?\d+\s+ranked\b/i.test(normalized)) return true;
  if (/^maternity, women'?s( &| and) pediatric hospital\b/i.test(normalized)) return true;

  // Treat long slogan-like headings without an org cue as unsafe for promotion.
  const orgCue = /(arc|association|society|center|centre|coalition|alliance|foundation|legal aid|hospital|services|support|advocacy|autism|disability|family|council|office|department|agency|program|resource|health|children|clinic)/i;
  if (!orgCue.test(normalized) && normalized.split(' ').length >= 6) {
    return true;
  }

  return false;
}

export function hasContactSignal(record) {
  return Boolean(
    (record.extracted_phone && String(record.extracted_phone).trim()) ||
    (record.extracted_email && String(record.extracted_email).trim()) ||
    (record.extracted_address && String(record.extracted_address).trim()) ||
    (record.extracted_website && String(record.extracted_website).trim()),
  );
}

export function officialLikeUrl(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return (
      hostname.endsWith('.gov') ||
      hostname.includes('.state.') ||
      hostname.includes('.ca.gov') ||
      hostname.includes('.tx.gov') ||
      hostname.includes('.ny.gov') ||
      hostname.includes('.pa.gov')
    );
  } catch {
    return false;
  }
}

export function determinePromotionDecision(tableName, row) {
  if (tableName === 'staging_scraped_nonprofit_organizations') {
    if (!row.county_id) return { action: 'manual_review', reason: 'missing_county_id_for_nonprofit' };
    if (isGenericHeading(row.extracted_name)) return { action: 'manual_review', reason: 'generic_nonprofit_name' };
    if (!hasContactSignal(row)) return { action: 'manual_review', reason: 'missing_nonprofit_contact_signal' };
    return { action: 'promote', reason: 'safe_nonprofit_candidate' };
  }

  if (tableName === 'staging_scraped_resource_providers') {
    if (!row.county_id) return { action: 'manual_review', reason: 'missing_county_id_for_provider' };
    if (isGenericHeading(row.extracted_name)) return { action: 'manual_review', reason: 'generic_provider_name' };
    if (!row.extracted_address) return { action: 'manual_review', reason: 'missing_provider_address' };
    if (!hasContactSignal(row)) return { action: 'manual_review', reason: 'missing_provider_contact_signal' };
    return { action: 'promote', reason: 'safe_provider_candidate' };
  }

  if (tableName === 'staging_scraped_iep_advocates') {
    if (!row.county_id) return { action: 'manual_review', reason: 'missing_county_id_for_advocate' };
    if (isGenericHeading(row.extracted_name)) return { action: 'manual_review', reason: 'generic_advocate_name' };
    if (!row.extracted_email && !row.extracted_phone) return { action: 'manual_review', reason: 'missing_advocate_contact_signal' };
    return { action: 'manual_review', reason: 'advocates_require_manual_review' };
  }

  if (tableName === 'staging_scraped_state_resource_agencies') {
    if (isGenericHeading(row.extracted_name)) return { action: 'manual_review', reason: 'generic_agency_name' };
    if (!row.extracted_phone && !row.agency_intake_contact && !row.early_intervention_contact) {
      return { action: 'manual_review', reason: 'missing_agency_contact_signal' };
    }
    if (!officialLikeUrl(row.source_url) && !officialLikeUrl(row.extracted_website)) {
      return { action: 'manual_review', reason: 'non_official_agency_domain' };
    }
    if (!row.counties_served || row.counties_served === row.state_id) {
      return { action: 'manual_review', reason: 'missing_precise_county_mapping' };
    }
    return { action: 'promote', reason: 'safe_state_agency_candidate' };
  }

  if (tableName === 'staging_scraped_knowledge_content') {
    const normalizedTitle = String(row.title || '').trim().toLowerCase();
    if (!normalizedTitle || /^(home|contact us|contact|menu|page inactive)$/.test(normalizedTitle)) {
      return { action: 'manual_review', reason: 'generic_knowledge_title' };
    }
    if (!row.summary && !row.raw_text_excerpt) {
      return { action: 'manual_review', reason: 'missing_knowledge_summary' };
    }
    return { action: 'promote', reason: 'safe_knowledge_candidate' };
  }

  return { action: 'manual_review', reason: 'unsupported_staging_table' };
}

export function targetIdFor(tableName, row) {
  if (tableName === 'staging_scraped_nonprofit_organizations') {
    return slugify(`${row.state_id}-${row.county_id}-${row.extracted_name}-np`);
  }
  if (tableName === 'staging_scraped_resource_providers') {
    return slugify(`${row.state_id}-${row.county_id}-${row.extracted_name}-rp`);
  }
  if (tableName === 'staging_scraped_iep_advocates') {
    return slugify(`${row.state_id}-${row.county_id}-${row.extracted_name}-adv`);
  }
  if (tableName === 'staging_scraped_state_resource_agencies') {
    return slugify(`${row.state_id}-${row.agency_type}-${row.extracted_name}`);
  }
  if (tableName === 'staging_scraped_knowledge_content') {
    return row.slug || slugify(`${row.state_id}-${row.title}-knowledge`);
  }
  return slugify(`${row.state_id}-${row.extracted_name}`);
}

export function normalizeProductionInsert(tableName, row, timestamp) {
  const today = timestamp.slice(0, 10);
  if (tableName === 'staging_scraped_nonprofit_organizations') {
    return {
      targetTable: 'nonprofit_organizations',
      targetId: targetIdFor(tableName, row),
      columns: ['id', 'name', 'county_id', 'website', 'phone', 'focus_condition', 'source_url', 'source_type', 'data_origin', 'verification_status', 'last_verified_date', 'last_scraped_at', 'confidence_score'],
      values: [
        targetIdFor(tableName, row),
        row.extracted_name,
        row.county_id,
        row.extracted_website,
        row.extracted_phone,
        row.focus_condition || 'nonprofit_support',
        row.source_url,
        row.source_type,
        'lightweight_validated_stage',
        'source_listed',
        today,
        row.scraped_at,
        row.confidence_score,
      ],
      duplicateQuery: {
        sql: 'SELECT * FROM nonprofit_organizations WHERE county_id = ? AND (name = ? OR website = ?)',
        params: [row.county_id, row.extracted_name, row.extracted_website],
      },
    };
  }

  if (tableName === 'staging_scraped_resource_providers') {
    // The production table requires a non-null Medi-Cal flag, but lightweight
    // national provider pulls usually do not establish that claim. Persist
    // "unknown / unverified" as false rather than failing promotion or
    // fabricating a positive acceptance claim.
    const acceptsMediCal = row.accepts_medi_cal ?? 0;
    return {
      targetTable: 'resource_providers',
      targetId: targetIdFor(tableName, row),
      columns: ['id', 'name', 'categories', 'county_id', 'phone', 'email', 'address', 'accepts_medi_cal', 'regional_center_vendor_ids', 'source_url', 'source_type', 'data_origin', 'verification_status', 'last_verified_date', 'last_scraped_at', 'confidence_score', 'source_name', 'next_step_type', 'next_step_label', 'next_step_url', 'next_step_phone', 'next_step_email'],
      values: [
        targetIdFor(tableName, row),
        row.extracted_name,
        row.categories || 'providers_care',
        row.county_id,
        row.extracted_phone,
        row.extracted_email || null,
        row.extracted_address,
        acceptsMediCal,
        '',
        row.source_url,
        row.source_type,
        'lightweight_validated_stage',
        'source_listed',
        today,
        row.scraped_at,
        row.confidence_score,
        row.source_name || row.extracted_name,
        'contact_provider',
        'Contact provider',
        row.source_url,
        row.extracted_phone || null,
        row.extracted_email || null,
      ],
      duplicateQuery: {
        sql: 'SELECT * FROM resource_providers WHERE county_id = ? AND (name = ? OR phone = ? OR source_url = ?)',
        params: [row.county_id, row.extracted_name, row.extracted_phone, row.source_url],
      },
    };
  }

  if (tableName === 'staging_scraped_state_resource_agencies') {
    return {
      targetTable: 'state_resource_agencies',
      targetId: targetIdFor(tableName, row),
      columns: ['id', 'state_id', 'agency_type', 'name', 'counties_served', 'catchment_boundaries', 'website', 'intake_phone', 'early_intervention_contact', 'agency_intake_contact', 'eligibility_info_page', 'services_page', 'appeals_info', 'languages', 'last_verified_date', 'source_urls', 'source_url', 'source_type', 'data_origin', 'verification_status', 'last_scraped_at', 'confidence_score'],
      values: [
        targetIdFor(tableName, row),
        row.state_id,
        row.agency_type,
        row.extracted_name,
        row.counties_served,
        row.catchment_boundaries,
        row.extracted_website,
        row.extracted_phone,
        row.early_intervention_contact,
        row.agency_intake_contact,
        row.eligibility_info_page,
        row.services_page,
        row.appeals_info,
        'English',
        today,
        row.source_url,
        row.source_url,
        row.source_type,
        'lightweight_validated_stage',
        'source_listed',
        row.scraped_at,
        row.confidence_score,
      ],
      duplicateQuery: {
        sql: 'SELECT * FROM state_resource_agencies WHERE state_id = ? AND (name = ? OR website = ?)',
        params: [row.state_id, row.extracted_name, row.extracted_website],
      },
    };
  }

  if (tableName === 'staging_scraped_knowledge_content') {
    const subtitle = String(row.summary || row.raw_text_excerpt || '').trim();
    const readTimeMinutes = Math.max(1, Math.ceil(subtitle.split(/\s+/).filter(Boolean).length / 180));
    return {
      targetTable: 'knowledge_articles',
      targetId: targetIdFor(tableName, row),
      columns: ['id', 'category', 'title', 'subtitle', 'title_es', 'subtitle_es', 'read_time', 'read_time_es', 'difficulty', 'color', 'steps_json', 'steps_json_es'],
      values: [
        targetIdFor(tableName, row),
        row.content_category || 'knowledge_content',
        row.title,
        subtitle,
        '',
        '',
        `${readTimeMinutes} min`,
        '',
        'general',
        'slate',
        JSON.stringify([
          {
            title: 'Overview',
            content: subtitle,
            citation: row.canonical_url || row.source_url || '',
          },
        ]),
        JSON.stringify([]),
      ],
      duplicateQuery: {
        sql: 'SELECT * FROM knowledge_articles WHERE id = ? OR title = ?',
        params: [targetIdFor(tableName, row), row.title],
      },
    };
  }

  return null;
}

export function tableToFamily(tableName) {
  return tableName.replace(/^staging_scraped_/, '');
}

export function auditReason(action, reason) {
  return `${action}:${reason}`;
}
