export const phaseConfigs = {
  benefits_hhs: {
    phase_id: 'benefits_hhs',
    allowed_tables: ['staging_scraped_county_offices', 'county_offices'],
    staging_table: 'staging_scraped_county_offices',
    production_table: 'county_offices',
    required_fields: ['source_url', 'evidence_level', 'data_origin', 'verification_status', 'confidence_score', 'physical_address'],
    allowed_evidence_levels: ['official_locator_derived', 'source_listed', 'direct_official_page'],
    allow_deletes: false,
    allow_rekey: true,
    requires_reference_audit: false
  },
  dd_idd: {
    phase_id: 'dd_idd',
    allowed_tables: [
      'staging_scraped_state_resource_agencies',
      'staging_scraped_waitlists',
      'staging_scraped_forms',
      'state_resource_agencies',
      'programs',
      'program_waitlists',
      'regional_center_counties'
    ],
    staging_table: 'staging_scraped_state_resource_agencies',
    production_table: 'state_resource_agencies',
    required_fields: ['source_url', 'evidence_level', 'data_origin', 'verification_status', 'confidence_score'],
    allowed_evidence_levels: ['official_locator_derived', 'statewide_routing_official', 'official_report', 'direct_official_page'],
    allow_deletes: true, // APD Regional mappings wipe and replace
    allow_rekey: false,
    requires_reference_audit: false
  },
  early_intervention: {
    phase_id: 'early_intervention',
    allowed_tables: ['staging_scraped_state_resource_agencies', 'state_resource_agencies', 'regional_center_counties'],
    staging_table: 'staging_scraped_state_resource_agencies',
    production_table: 'state_resource_agencies',
    required_fields: ['source_url', 'evidence_level', 'data_origin', 'verification_status', 'confidence_score'],
    allowed_evidence_levels: ['official_locator_derived', 'source_listed'],
    allow_deletes: true, // Early Steps mappings wipe and replace
    allow_rekey: false,
    requires_reference_audit: false
  },
  education_regional: {
    phase_id: 'education_regional',
    allowed_tables: [
      'staging_scraped_regional_education_agencies',
      'staging_scraped_school_districts',
      'regional_education_agencies',
      'school_districts',
      'selpa_counties'
    ],
    staging_table: 'staging_scraped_regional_education_agencies',
    production_table: 'regional_education_agencies',
    required_fields: ['source_url', 'evidence_level', 'data_origin', 'verification_status', 'confidence_score'],
    allowed_evidence_levels: ['official_locator_derived', 'source_listed'],
    allow_deletes: false,
    allow_rekey: false,
    requires_reference_audit: false
  },
  district_replacements: {
    phase_id: 'district_replacements',
    allowed_tables: ['staging_scraped_school_districts', 'school_districts'],
    staging_table: 'staging_scraped_school_districts',
    production_table: 'school_districts',
    required_fields: ['source_url', 'evidence_level', 'data_origin', 'verification_status', 'confidence_score'],
    allowed_evidence_levels: ['source_listed', 'direct_official_page', 'official_locator_derived'],
    allow_deletes: false,
    allow_rekey: true,
    requires_reference_audit: true
  },
  clinics: {
    phase_id: 'clinics',
    allowed_tables: ['resource_providers'],
    staging_table: 'resource_providers', // Staged directly under transactional guards
    production_table: 'resource_providers',
    required_fields: ['source_url', 'evidence_level', 'data_origin', 'verification_status', 'confidence_score', 'address'],
    allowed_evidence_levels: ['official_locator_derived', 'source_listed'],
    allow_deletes: false,
    allow_rekey: false,
    requires_reference_audit: false
  },
  forms_appeals_transition: {
    phase_id: 'forms_appeals_transition',
    allowed_tables: ['staging_scraped_forms', 'forms_and_guides'],
    staging_table: 'staging_scraped_forms',
    production_table: 'forms_and_guides',
    required_fields: ['source_url', 'evidence_level', 'data_origin', 'verification_status', 'confidence_score'],
    allowed_evidence_levels: ['direct_official_page', 'official_locator_derived'],
    allow_deletes: false,
    allow_rekey: false,
    requires_reference_audit: false
  },
  trusted_nonprofits: {
    phase_id: 'trusted_nonprofits',
    allowed_tables: ['nonprofit_organizations'],
    staging_table: 'nonprofit_organizations', // Staged directly under transactional guards
    production_table: 'nonprofit_organizations',
    required_fields: ['source_url', 'evidence_level', 'data_origin', 'verification_status', 'confidence_score'],
    allowed_evidence_levels: ['official_locator_derived', 'source_listed'],
    allow_deletes: false,
    allow_rekey: false,
    requires_reference_audit: false
  }
};
