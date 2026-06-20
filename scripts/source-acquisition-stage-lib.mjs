import path from 'node:path';

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

export function deriveName(record) {
  return record.familyExtraction?.organizationName
    || record.familyExtraction?.officeName
    || record.familyExtraction?.programName
    || record.h1s?.find(Boolean)
    || record.pageTitle
    || record.sourceName
    || '';
}

export function deriveConfidence(record) {
  if (record.gapFamily === 'nonprofit_support') return 0.92;
  if (record.gapFamily === 'dd_routing') return 0.88;
  if (record.gapFamily === 'providers_care') return 0.86;
  if (record.gapFamily === 'forms_guides') return 0.87;
  if (record.gapFamily === 'advocates_legal') return 0.82;
  if (record.gapFamily === 'knowledge_content') return 0.84;
  return 0.8;
}

function commonCandidate(record) {
  const name = deriveName(record);
  const sourceUrl = record.finalUrl || record.sourceUrl || '';
  return {
    recordId: record.recordId,
    sourceUrl,
    sourceName: record.sourceName || name,
    sourceType: 'lightweight_source_acquisition',
    scrapedAt: record.parsedAt,
    stateId: record.stateId,
    countyId: record.countyId || record.familyExtraction?.countyId || null,
    confidenceScore: deriveConfidence(record),
    extractionNotes: `Accepted lightweight ${record.gapFamily} candidate from validated source acquisition pipeline.`,
    rawTextExcerpt: record.textSample || '',
    suggestedTargetId: null,
    duplicateCandidateId: null,
    reviewStatus: 'pending_review',
    name,
  };
}

export function buildPromotionCandidate(record) {
  const common = commonCandidate(record);
  const website = record.familyExtraction?.organizationWebsite || record.finalUrl || record.sourceUrl || '';
  const phone = record.familyExtraction?.contactPhone || record.phones?.[0] || '';
  const email = record.familyExtraction?.contactEmail || record.emails?.[0] || '';
  const address = record.familyExtraction?.contactAddress || record.familyExtraction?.contactAddress || record.addressLines?.[0] || '';
  const actionUrl = record.familyExtraction?.callToActionLinks?.[0]?.href
    || record.familyExtraction?.actionLinks?.[0]?.href
    || website
    || common.sourceUrl;

  if (['programs_benefits', 'waivers', 'transition_programs', 'early_intervention_programs'].includes(record.gapFamily)) {
    const programName = record.familyExtraction?.programName || common.name;
    const category = common.stateId === 'national' ? 'federal' : 'state';
    return {
      supported: true,
      stagingTable: 'staging_scraped_programs',
      targetTable: 'programs',
      row: {
        source_url: common.sourceUrl,
        source_name: common.sourceName,
        source_type: common.sourceType,
        scraped_at: common.scrapedAt,
        state_id: common.stateId,
        county_id: common.countyId,
        confidence_score: common.confidenceScore,
        extraction_notes: common.extractionNotes,
        raw_text_excerpt: common.rawTextExcerpt,
        suggested_target_table: 'programs',
        suggested_target_id: common.suggestedTargetId,
        duplicate_candidate_id: common.duplicateCandidateId,
        review_status: common.reviewStatus,
        extracted_name: programName,
        description: record.familyExtraction?.serviceSummary || record.metaDescription || record.textSample || '',
        who_it_is_for: record.familyExtraction?.audienceSummary || '',
        who_might_qualify: record.familyExtraction?.eligibilitySummary || '',
        official_source_url: common.sourceUrl,
        category,
        program_type: record.gapFamily,
        extracted_phone: phone,
        extracted_email: email,
        action_url: actionUrl,
      },
    };
  }

  if (['nonprofit_support', 'condition_nonprofits', 'parent_training_nonprofits'].includes(record.gapFamily)) {
    return {
      supported: true,
      stagingTable: 'staging_scraped_nonprofit_organizations',
      targetTable: 'nonprofit_organizations',
      row: {
        source_url: common.sourceUrl,
        source_name: common.sourceName,
        source_type: common.sourceType,
        scraped_at: common.scrapedAt,
        state_id: common.stateId,
        county_id: common.countyId,
        confidence_score: common.confidenceScore,
        extraction_notes: common.extractionNotes,
        raw_text_excerpt: common.rawTextExcerpt,
        suggested_target_table: 'nonprofit_organizations',
        suggested_target_id: common.suggestedTargetId,
        duplicate_candidate_id: common.duplicateCandidateId,
        review_status: common.reviewStatus,
        extracted_name: common.name,
        extracted_website: website,
        extracted_phone: phone,
        focus_condition: record.gapFamily,
      },
    };
  }

  if (record.gapFamily === 'advocates_legal') {
    return {
      supported: true,
      stagingTable: 'staging_scraped_iep_advocates',
      targetTable: 'iep_advocates',
      row: {
        source_url: common.sourceUrl,
        source_name: common.sourceName,
        source_type: common.sourceType,
        scraped_at: common.scrapedAt,
        state_id: common.stateId,
        county_id: common.countyId,
        confidence_score: common.confidenceScore,
        extraction_notes: common.extractionNotes,
        raw_text_excerpt: common.rawTextExcerpt,
        suggested_target_table: 'iep_advocates',
        suggested_target_id: common.suggestedTargetId,
        duplicate_candidate_id: common.duplicateCandidateId,
        review_status: common.reviewStatus,
        extracted_name: common.name,
        credentials: '',
        experience_years: null,
        price_rate: '',
        counties_served: '',
        languages_spoken: '',
        extracted_phone: phone,
        extracted_email: email,
        extracted_website: website,
        specialties: '',
        description: record.textSample || '',
      },
    };
  }

  if (record.gapFamily === 'providers_care') {
    return {
      supported: true,
      stagingTable: 'staging_scraped_resource_providers',
      targetTable: 'resource_providers',
      row: {
        source_url: common.sourceUrl,
        source_name: common.sourceName,
        source_type: common.sourceType,
        scraped_at: common.scrapedAt,
        state_id: common.stateId,
        county_id: common.countyId,
        confidence_score: common.confidenceScore,
        extraction_notes: common.extractionNotes,
        raw_text_excerpt: common.rawTextExcerpt,
        suggested_target_table: 'resource_providers',
        suggested_target_id: common.suggestedTargetId,
        duplicate_candidate_id: common.duplicateCandidateId,
        review_status: common.reviewStatus,
        extracted_name: common.name,
        categories: record.gapFamily,
        extracted_phone: phone,
        extracted_email: email,
        extracted_address: address,
        accepts_medi_cal: null,
      },
    };
  }

  if (record.gapFamily === 'dd_routing') {
    const officeName = record.familyExtraction?.officeName || common.name;
    const contactToken = email || phone || common.sourceUrl;
    return {
      supported: true,
      stagingTable: 'staging_scraped_state_resource_agencies',
      targetTable: 'state_resource_agencies',
      row: {
        source_url: common.sourceUrl,
        source_name: common.sourceName,
        source_type: common.sourceType,
        scraped_at: common.scrapedAt,
        state_id: common.stateId,
        county_id: common.countyId,
        confidence_score: common.confidenceScore,
        extraction_notes: common.extractionNotes,
        raw_text_excerpt: common.rawTextExcerpt,
        suggested_target_table: 'state_resource_agencies',
        suggested_target_id: common.suggestedTargetId,
        duplicate_candidate_id: common.duplicateCandidateId,
        review_status: common.reviewStatus,
        extracted_name: officeName,
        agency_type: 'dd_routing',
        counties_served: common.stateId,
        catchment_boundaries: common.stateId,
        extracted_website: website,
        extracted_phone: phone,
        early_intervention_contact: contactToken,
        agency_intake_contact: contactToken,
        eligibility_info_page: common.sourceUrl,
        services_page: common.sourceUrl,
        appeals_info: common.sourceUrl,
      },
    };
  }

  if (record.gapFamily === 'education_routing') {
    const officeName = record.familyExtraction?.officeName || common.name;
    if (record.targetTable === 'school_districts') {
      return {
        supported: true,
        stagingTable: 'staging_scraped_school_districts',
        targetTable: 'school_districts',
        row: {
          source_url: common.sourceUrl,
          source_name: common.sourceName,
          source_type: common.sourceType,
          scraped_at: common.scrapedAt,
          state_id: common.stateId,
          county_id: common.countyId,
          confidence_score: common.confidenceScore,
          extraction_notes: common.extractionNotes,
          raw_text_excerpt: common.rawTextExcerpt,
          suggested_target_table: 'school_districts',
          suggested_target_id: common.suggestedTargetId,
          duplicate_candidate_id: common.duplicateCandidateId,
          review_status: common.reviewStatus,
          extracted_name: officeName,
          spec_ed_contact_phone: phone,
          spec_ed_contact_email: email,
          extracted_website: website,
          total_enrollment: null,
          evidence_level: 'lightweight_school_district_page',
        },
      };
    }

    return {
      supported: true,
      stagingTable: 'staging_scraped_regional_education_agencies',
      targetTable: 'regional_education_agencies',
      row: {
        source_url: common.sourceUrl,
        source_name: common.sourceName,
        source_type: common.sourceType,
        scraped_at: common.scrapedAt,
        state_id: common.stateId,
        county_id: common.countyId,
        confidence_score: common.confidenceScore,
        extraction_notes: common.extractionNotes,
        raw_text_excerpt: common.rawTextExcerpt,
        suggested_target_table: 'regional_education_agencies',
        suggested_target_id: common.suggestedTargetId,
        duplicate_candidate_id: common.duplicateCandidateId,
        review_status: common.reviewStatus,
        extracted_name: officeName,
        agency_type: 'education_routing',
        counties_served: common.stateId,
        extracted_website: website || common.sourceUrl,
        extracted_phone: phone,
        evidence_level: 'lightweight_regional_education_page',
      },
    };
  }

  if (record.gapFamily === 'medicaid_hhs_offices') {
    const officeName = record.familyExtraction?.officeName || common.name;
    return {
      supported: true,
      stagingTable: 'staging_scraped_county_offices',
      targetTable: 'county_offices',
      row: {
        source_url: common.sourceUrl,
        source_name: common.sourceName,
        source_type: common.sourceType,
        scraped_at: common.scrapedAt,
        state_id: common.stateId,
        county_id: common.countyId,
        confidence_score: common.confidenceScore,
        extraction_notes: common.extractionNotes,
        raw_text_excerpt: common.rawTextExcerpt,
        suggested_target_table: 'county_offices',
        suggested_target_id: common.suggestedTargetId,
        duplicate_candidate_id: common.duplicateCandidateId,
        review_status: common.reviewStatus,
        extracted_name: officeName,
        extracted_phone: phone,
        extracted_email: email,
        extracted_address: address,
        extracted_website: website,
        program_id: '',
        evidence_level: 'lightweight_office_page',
      },
    };
  }

  if (record.gapFamily === 'forms_guides') {
    const programName = record.familyExtraction?.programName || common.name;
    return {
      supported: true,
      stagingTable: 'staging_scraped_forms',
      targetTable: 'forms_and_guides',
      row: {
        source_url: common.sourceUrl,
        source_name: common.sourceName,
        source_type: common.sourceType,
        scraped_at: common.scrapedAt,
        state_id: common.stateId,
        county_id: common.countyId,
        confidence_score: common.confidenceScore,
        extraction_notes: common.extractionNotes,
        raw_text_excerpt: common.rawTextExcerpt,
        suggested_target_table: 'forms_and_guides',
        suggested_target_id: common.suggestedTargetId,
        duplicate_candidate_id: common.duplicateCandidateId,
        review_status: common.reviewStatus,
        slug: slugify(`${common.stateId}-${programName}`),
        program: programName,
        official_download_url: record.familyExtraction?.officialDownloadUrl || common.sourceUrl,
        who_uses_it: record.textSample || '',
        who_signs_it: '',
        where_to_send_it: '',
        letter_script: '',
      },
    };
  }

  if (record.gapFamily === 'program_waitlists') {
    const waitlistName = record.familyExtraction?.programName || common.name;
    const estimateSourceUrl = common.sourceUrl;
    const estimateSourceType = common.stateId === 'national' ? 'official_federal' : 'official_state';
    return {
      supported: true,
      stagingTable: 'staging_scraped_waitlists',
      targetTable: 'program_waitlists',
      row: {
        source_url: common.sourceUrl,
        source_name: common.sourceName,
        source_type: common.sourceType,
        scraped_at: common.scrapedAt,
        state_id: common.stateId,
        county_id: common.countyId,
        confidence_score: common.confidenceScore,
        extraction_notes: common.extractionNotes,
        raw_text_excerpt: common.rawTextExcerpt,
        suggested_target_table: 'program_waitlists',
        suggested_target_id: common.suggestedTargetId,
        duplicate_candidate_id: common.duplicateCandidateId,
        review_status: common.reviewStatus,
        program_id: '',
        name: waitlistName,
        duration_label: 'Not officially stated',
        duration_months: -1,
        status: 'Unknown',
        description: record.familyExtraction?.serviceSummary || record.textSample || '',
        estimate_source_url: estimateSourceUrl,
        estimate_source_type: estimateSourceType,
        last_checked_at: common.scrapedAt,
      },
    };
  }

  if (['housing', 'goods_supplies', 'jobs_vocational', 'care_independent_living', 'legal_aid'].includes(record.gapFamily)) {
    return {
      supported: true,
      stagingTable: 'staging_scraped_help_resources',
      targetTable: 'help_resources',
      row: {
        source_url: common.sourceUrl,
        source_name: common.sourceName,
        source_type: common.sourceType,
        scraped_at: common.scrapedAt,
        state_id: common.stateId,
        county_id: common.countyId,
        confidence_score: common.confidenceScore,
        extraction_notes: common.extractionNotes,
        raw_text_excerpt: common.rawTextExcerpt,
        suggested_target_table: 'help_resources',
        suggested_target_id: common.suggestedTargetId,
        duplicate_candidate_id: common.duplicateCandidateId,
        review_status: common.reviewStatus,
        extracted_name: common.name,
        gap_family: record.gapFamily,
        help_type: record.gapFamily,
        extracted_website: website,
        extracted_phone: phone,
        extracted_email: email,
        extracted_address: address,
        action_url: record.familyExtraction?.actionLinks?.[0]?.href || website || common.sourceUrl,
        service_summary: record.familyExtraction?.serviceSummary || record.textSample || '',
      },
    };
  }

  if (record.gapFamily === 'knowledge_content') {
    const articleTitle = record.familyExtraction?.articleTitle || common.name;
    return {
      supported: true,
      stagingTable: 'staging_scraped_knowledge_content',
      targetTable: 'knowledge_content',
      row: {
        source_url: common.sourceUrl,
        source_name: common.sourceName,
        source_type: common.sourceType,
        scraped_at: common.scrapedAt,
        state_id: common.stateId,
        county_id: common.countyId,
        confidence_score: common.confidenceScore,
        extraction_notes: common.extractionNotes,
        raw_text_excerpt: common.rawTextExcerpt,
        suggested_target_table: 'knowledge_content',
        suggested_target_id: common.suggestedTargetId,
        duplicate_candidate_id: common.duplicateCandidateId,
        review_status: common.reviewStatus,
        slug: slugify(`${common.stateId}-${articleTitle}`),
        title: articleTitle,
        content_category: record.familyExtraction?.contentCategory || record.gapFamily,
        canonical_url: record.familyExtraction?.canonicalKnowledgeUrl || common.sourceUrl,
        summary: record.familyExtraction?.summaryText || record.textSample || '',
      },
    };
  }

  return {
    supported: false,
    reason: 'no_staging_mapping_for_family',
    targetTable: record.targetTable || null,
  };
}

export function insertConfigForTable(tableName) {
  if (tableName === 'staging_scraped_nonprofit_organizations') {
    return {
      keyFields: ['source_url', 'state_id', 'extracted_name'],
      columns: [
        'source_url', 'source_name', 'source_type', 'scraped_at', 'state_id', 'county_id',
        'confidence_score', 'extraction_notes', 'raw_text_excerpt', 'suggested_target_table',
        'suggested_target_id', 'duplicate_candidate_id', 'review_status', 'extracted_name',
        'extracted_website', 'extracted_phone', 'focus_condition',
      ],
    };
  }
  if (tableName === 'staging_scraped_programs') {
    return {
      keyFields: ['source_url', 'state_id', 'extracted_name'],
      columns: [
        'source_url', 'source_name', 'source_type', 'scraped_at', 'state_id', 'county_id',
        'confidence_score', 'extraction_notes', 'raw_text_excerpt', 'suggested_target_table',
        'suggested_target_id', 'duplicate_candidate_id', 'review_status', 'extracted_name',
        'description', 'who_it_is_for', 'who_might_qualify', 'official_source_url',
        'category', 'program_type', 'extracted_phone', 'extracted_email', 'action_url',
      ],
    };
  }
  if (tableName === 'staging_scraped_iep_advocates') {
    return {
      keyFields: ['source_url', 'state_id', 'extracted_name'],
      columns: [
        'source_url', 'source_name', 'source_type', 'scraped_at', 'state_id', 'county_id',
        'confidence_score', 'extraction_notes', 'raw_text_excerpt', 'suggested_target_table',
        'suggested_target_id', 'duplicate_candidate_id', 'review_status', 'extracted_name',
        'credentials', 'experience_years', 'price_rate', 'counties_served', 'languages_spoken',
        'extracted_phone', 'extracted_email', 'extracted_website', 'specialties', 'description',
      ],
    };
  }
  if (tableName === 'staging_scraped_resource_providers') {
    return {
      keyFields: ['source_url', 'state_id', 'extracted_name'],
      columns: [
        'source_url', 'source_name', 'source_type', 'scraped_at', 'state_id', 'county_id',
        'confidence_score', 'extraction_notes', 'raw_text_excerpt', 'suggested_target_table',
        'suggested_target_id', 'duplicate_candidate_id', 'review_status', 'extracted_name',
        'categories', 'extracted_phone', 'extracted_email', 'extracted_address', 'accepts_medi_cal',
      ],
    };
  }
  if (tableName === 'staging_scraped_state_resource_agencies') {
    return {
      keyFields: ['source_url', 'state_id', 'extracted_name'],
      columns: [
        'source_url', 'source_name', 'source_type', 'scraped_at', 'state_id', 'county_id',
        'confidence_score', 'extraction_notes', 'raw_text_excerpt', 'suggested_target_table',
        'suggested_target_id', 'duplicate_candidate_id', 'review_status', 'extracted_name',
        'agency_type', 'counties_served', 'catchment_boundaries', 'extracted_website',
        'extracted_phone', 'early_intervention_contact', 'agency_intake_contact',
        'eligibility_info_page', 'services_page', 'appeals_info',
      ],
    };
  }
  if (tableName === 'staging_scraped_regional_education_agencies') {
    return {
      keyFields: ['source_url', 'state_id', 'extracted_name'],
      columns: [
        'source_url', 'source_name', 'source_type', 'scraped_at', 'state_id', 'county_id',
        'confidence_score', 'extraction_notes', 'raw_text_excerpt', 'suggested_target_table',
        'suggested_target_id', 'duplicate_candidate_id', 'review_status', 'extracted_name',
        'agency_type', 'counties_served', 'extracted_website', 'evidence_level', 'extracted_phone',
      ],
    };
  }
  if (tableName === 'staging_scraped_school_districts') {
    return {
      keyFields: ['source_url', 'state_id', 'extracted_name'],
      columns: [
        'source_url', 'source_name', 'source_type', 'scraped_at', 'state_id', 'county_id',
        'confidence_score', 'extraction_notes', 'raw_text_excerpt', 'suggested_target_table',
        'suggested_target_id', 'duplicate_candidate_id', 'review_status', 'extracted_name',
        'spec_ed_contact_phone', 'spec_ed_contact_email', 'extracted_website', 'total_enrollment',
        'evidence_level',
      ],
    };
  }
  if (tableName === 'staging_scraped_county_offices') {
    return {
      keyFields: ['source_url', 'state_id', 'extracted_name'],
      columns: [
        'source_url', 'source_name', 'source_type', 'scraped_at', 'state_id', 'county_id',
        'confidence_score', 'extraction_notes', 'raw_text_excerpt', 'suggested_target_table',
        'suggested_target_id', 'duplicate_candidate_id', 'review_status', 'extracted_name',
        'extracted_phone', 'extracted_email', 'extracted_address', 'extracted_website',
        'program_id', 'evidence_level',
      ],
    };
  }
  if (tableName === 'staging_scraped_forms') {
    return {
      keyFields: ['source_url', 'state_id', 'slug'],
      columns: [
        'source_url', 'source_name', 'source_type', 'scraped_at', 'state_id', 'county_id',
        'confidence_score', 'extraction_notes', 'raw_text_excerpt', 'suggested_target_table',
        'suggested_target_id', 'duplicate_candidate_id', 'review_status', 'slug',
        'program', 'official_download_url', 'who_uses_it', 'who_signs_it',
        'where_to_send_it', 'letter_script',
      ],
    };
  }
  if (tableName === 'staging_scraped_waitlists') {
    return {
      keyFields: ['estimate_source_url', 'state_id', 'name'],
      columns: [
        'source_url', 'source_name', 'source_type', 'scraped_at', 'state_id', 'county_id',
        'confidence_score', 'extraction_notes', 'raw_text_excerpt', 'suggested_target_table',
        'suggested_target_id', 'duplicate_candidate_id', 'review_status', 'program_id',
        'name', 'duration_label', 'duration_months', 'status', 'description',
        'estimate_source_url', 'estimate_source_type', 'last_checked_at',
      ],
    };
  }
  if (tableName === 'staging_scraped_help_resources') {
    return {
      keyFields: ['source_url', 'state_id', 'gap_family'],
      columns: [
        'source_url', 'source_name', 'source_type', 'scraped_at', 'state_id', 'county_id',
        'confidence_score', 'extraction_notes', 'raw_text_excerpt', 'suggested_target_table',
        'suggested_target_id', 'duplicate_candidate_id', 'review_status', 'extracted_name',
        'gap_family', 'help_type', 'extracted_website', 'extracted_phone',
        'extracted_email', 'extracted_address', 'action_url', 'service_summary',
      ],
    };
  }
  if (tableName === 'staging_scraped_knowledge_content') {
    return {
      keyFields: ['source_url', 'state_id', 'slug'],
      columns: [
        'source_url', 'source_name', 'source_type', 'scraped_at', 'state_id', 'county_id',
        'confidence_score', 'extraction_notes', 'raw_text_excerpt', 'suggested_target_table',
        'suggested_target_id', 'duplicate_candidate_id', 'review_status', 'slug',
        'title', 'content_category', 'canonical_url', 'summary',
      ],
    };
  }
  throw new Error(`Unsupported staging table: ${tableName}`);
}

export function deleteWhereClause(keyFields) {
  return keyFields.map((field) => `${field} = ?`).join(' AND ');
}

export function summaryRecord(candidate) {
  return {
    stagingTable: candidate.stagingTable || null,
    targetTable: candidate.targetTable || null,
    supported: candidate.supported,
    reason: candidate.reason || null,
  };
}

export function familyDirName(family) {
  return String(family || 'unknown_family')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function mergePreservedStagingFields(tableName, nextRow, existingRow) {
  if (!existingRow) return nextRow;

  const merged = { ...nextRow };
  const preserveIfMissing = (field) => {
    if ((merged[field] === null || merged[field] === undefined || merged[field] === '') && existingRow[field]) {
      merged[field] = existingRow[field];
    }
  };

  preserveIfMissing('county_id');
  preserveIfMissing('evidence_level');

  if (tableName === 'staging_scraped_state_resource_agencies') {
    preserveIfMissing('counties_served');
    preserveIfMissing('catchment_boundaries');
  }

  if (tableName === 'staging_scraped_regional_education_agencies') {
    preserveIfMissing('counties_served');
  }

  return merged;
}
