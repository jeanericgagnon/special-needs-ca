export interface CategoryRule {
  requiredFields: string[];
  coverageRule: 'all_counties' | 'exact_count' | 'min_count' | 'match_state_programs';
  expectedCount?: number;
  allowGeneratedFallback: boolean;
  requiresSourceUrl: boolean;
  requiresLastVerifiedDate: boolean;
  requiresHumanVerification: boolean;
  pageRenderingRequirements?: string[];
}

export interface StateCompletenessChecklist {
  geography: CategoryRule;
  localDisabilityRouting: CategoryRule;
  medicaid: CategoryRule;
  paidCaregiver: CategoryRule;
  education: CategoryRule;
  earlyIntervention: CategoryRule;
  waivers: CategoryRule;
  financialPlanning: CategoryRule;
  forms: CategoryRule;
  nonprofits: CategoryRule;
  providers: CategoryRule;
  sources: CategoryRule;
  seo: CategoryRule;
  e2e: CategoryRule;
}

export const stateCompletenessChecklist: StateCompletenessChecklist = {
  geography: {
    requiredFields: ['id', 'state_id', 'name', 'website'],
    coverageRule: 'exact_count',
    allowGeneratedFallback: false,
    requiresSourceUrl: true,
    requiresLastVerifiedDate: false,
    requiresHumanVerification: true,
    pageRenderingRequirements: ['H1', 'title', 'meta_description', 'canonical']
  },
  localDisabilityRouting: {
    requiredFields: [
      'id',
      'state_id',
      'agency_type',
      'name',
      'counties_served',
      'catchment_boundaries',
      'website',
      'intake_phone',
      'early_intervention_contact',
      'agency_intake_contact',
      'eligibility_info_page',
      'services_page',
      'appeals_info',
      'languages',
      'last_verified_date'
    ],
    coverageRule: 'all_counties',
    allowGeneratedFallback: false,
    requiresSourceUrl: true,
    requiresLastVerifiedDate: true,
    requiresHumanVerification: true,
    pageRenderingRequirements: ['catchment_description', 'intake_contacts']
  },
  medicaid: {
    requiredFields: [
      'id',
      'name',
      'description',
      'who_it_is_for',
      'who_might_qualify',
      'official_source_url',
      'category',
      'last_verified_date'
    ],
    coverageRule: 'match_state_programs',
    allowGeneratedFallback: false,
    requiresSourceUrl: true,
    requiresLastVerifiedDate: true,
    requiresHumanVerification: true,
    pageRenderingRequirements: ['eligibility_details', 'application_steps', 'county_office_routing']
  },
  paidCaregiver: {
    requiredFields: [
      'id',
      'name',
      'description',
      'who_it_is_for',
      'who_might_qualify',
      'official_source_url',
      'category',
      'last_verified_date'
    ],
    coverageRule: 'match_state_programs',
    allowGeneratedFallback: false,
    requiresSourceUrl: true,
    requiresLastVerifiedDate: true,
    requiresHumanVerification: true,
    pageRenderingRequirements: ['wage_rates', 'parent_rules', 'max_hours', 'soc_forms_linked']
  },
  education: {
    requiredFields: ['id', 'county_id', 'name', 'spec_ed_contact_phone', 'website'],
    coverageRule: 'all_counties',
    allowGeneratedFallback: true,
    requiresSourceUrl: false,
    requiresLastVerifiedDate: false,
    requiresHumanVerification: false,
    pageRenderingRequirements: ['timelines', 'letters', 'safeguards']
  },
  earlyIntervention: {
    requiredFields: [
      'id',
      'name',
      'description',
      'who_it_is_for',
      'who_might_qualify',
      'official_source_url',
      'category',
      'last_verified_date'
    ],
    coverageRule: 'match_state_programs',
    allowGeneratedFallback: false,
    requiresSourceUrl: true,
    requiresLastVerifiedDate: true,
    requiresHumanVerification: true,
    pageRenderingRequirements: ['transition_age_3_guidance', 'ifsp_details']
  },
  waivers: {
    requiredFields: [
      'id',
      'name',
      'description',
      'who_it_is_for',
      'who_might_qualify',
      'official_source_url',
      'category',
      'last_verified_date'
    ],
    coverageRule: 'match_state_programs',
    allowGeneratedFallback: false,
    requiresSourceUrl: true,
    requiresLastVerifiedDate: true,
    requiresHumanVerification: true,
    pageRenderingRequirements: ['interest_list_info', 'covered_services']
  },
  financialPlanning: {
    requiredFields: [
      'id',
      'name',
      'description',
      'who_it_is_for',
      'who_might_qualify',
      'official_source_url',
      'category',
      'last_verified_date'
    ],
    coverageRule: 'match_state_programs',
    allowGeneratedFallback: false,
    requiresSourceUrl: true,
    requiresLastVerifiedDate: true,
    requiresHumanVerification: true,
    pageRenderingRequirements: ['able_basics', 'supplemental_income']
  },
  forms: {
    requiredFields: [
      'slug',
      'program',
      'official_download_url',
      'who_uses_it',
      'who_signs_it',
      'where_to_send_it',
      'letter_script'
    ],
    coverageRule: 'min_count',
    expectedCount: 13,
    allowGeneratedFallback: false,
    requiresSourceUrl: true,
    requiresLastVerifiedDate: true,
    requiresHumanVerification: true,
    pageRenderingRequirements: ['pdf_download', 'common_mistakes']
  },
  nonprofits: {
    requiredFields: ['id', 'name', 'county_id', 'website', 'phone', 'focus_condition'],
    coverageRule: 'all_counties',
    allowGeneratedFallback: true,
    requiresSourceUrl: false,
    requiresLastVerifiedDate: false,
    requiresHumanVerification: false
  },
  providers: {
    requiredFields: ['id', 'name', 'categories', 'county_id', 'phone', 'address'],
    coverageRule: 'min_count',
    expectedCount: 50,
    allowGeneratedFallback: true,
    requiresSourceUrl: false,
    requiresLastVerifiedDate: false,
    requiresHumanVerification: false
  },
  sources: {
    requiredFields: ['id', 'program_id', 'url', 'type', 'confidence_rating'],
    coverageRule: 'min_count',
    expectedCount: 5,
    allowGeneratedFallback: false,
    requiresSourceUrl: true,
    requiresLastVerifiedDate: true,
    requiresHumanVerification: true
  },
  seo: {
    requiredFields: [],
    coverageRule: 'min_count',
    expectedCount: 1,
    allowGeneratedFallback: false,
    requiresSourceUrl: false,
    requiresLastVerifiedDate: false,
    requiresHumanVerification: true,
    pageRenderingRequirements: ['sitemap_index', 'robots_gating', 'canonical_links']
  },
  e2e: {
    requiredFields: [],
    coverageRule: 'min_count',
    expectedCount: 1,
    allowGeneratedFallback: false,
    requiresSourceUrl: false,
    requiresLastVerifiedDate: false,
    requiresHumanVerification: true,
    pageRenderingRequirements: ['playwright_specs', 'terminology_leaks_testing']
  }
};
