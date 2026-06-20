# Launch Scraper Staging Support Matrix

Generated: 2026-06-19T23:21:11.406Z

Launch-family staging support matrix so it is explicit which families can stage, where they stage, and why unsupported families stop.

- supportedFamilyCount: 9
- unsupportedFamilyCount: 0

## Matrix

| family | supported | staging table | target table | unsupported reason |
|---|---|---|---|---|
| dd_routing | true | staging_scraped_state_resource_agencies | state_resource_agencies |  |
| programs_benefits | true | staging_scraped_programs | programs |  |
| waivers | true | staging_scraped_programs | programs |  |
| forms_guides | true | staging_scraped_forms | forms_and_guides |  |
| program_waitlists | true | staging_scraped_waitlists | program_waitlists |  |
| medicaid_hhs_offices | true | staging_scraped_county_offices | county_offices |  |
| education_routing | true | staging_scraped_regional_education_agencies | regional_education_agencies |  |
| providers_care | true | staging_scraped_resource_providers | resource_providers |  |
| knowledge_content | true | staging_scraped_knowledge_content | knowledge_content |  |

## dd_routing

- stageSupported: true
- stagingTable: staging_scraped_state_resource_agencies
- targetTable: state_resource_agencies
- unsupportedReason: none
- recommendedRunMode: full_lane_when_successful
- stageProceedRule: accepted validated rows exist and the family has a supported staging target
- stageStopRule: no accepted rows remain or family target is unsupported for staging
- compactAcceptanceSignals: agency heading, phone or intake contact, services or eligibility link
- truthFieldsThatMustSurvive: sourceUrl/finalUrl, stateId, pageTitle/textSample, familyExtraction.officeName
- stageSpecificFields: extracted_name, agency_type, counties_served, catchment_boundaries, extracted_website, extracted_phone, early_intervention_contact, agency_intake_contact, eligibility_info_page, services_page, appeals_info

## programs_benefits

- stageSupported: true
- stagingTable: staging_scraped_programs
- targetTable: programs
- unsupportedReason: none
- recommendedRunMode: fetch_only_first
- stageProceedRule: accepted validated rows exist and the family has a supported staging target
- stageStopRule: no accepted rows remain or family target is unsupported for staging
- compactAcceptanceSignals: program heading, apply or learn-more action link or phone, official source page
- truthFieldsThatMustSurvive: sourceUrl/finalUrl, stateId, familyExtraction.programName, textSample or metaDescription
- stageSpecificFields: extracted_name, description, who_it_is_for, who_might_qualify, official_source_url, category, program_type, extracted_phone, extracted_email, action_url

## waivers

- stageSupported: true
- stagingTable: staging_scraped_programs
- targetTable: programs
- unsupportedReason: none
- recommendedRunMode: full_lane_when_successful
- stageProceedRule: accepted validated rows exist and the family has a supported staging target
- stageStopRule: no accepted rows remain or family target is unsupported for staging
- compactAcceptanceSignals: waiver name, application or eligibility step link, official source page
- truthFieldsThatMustSurvive: sourceUrl/finalUrl, stateId, familyExtraction.programName, gapFamily-as-program_type
- stageSpecificFields: extracted_name, description, who_it_is_for, who_might_qualify, official_source_url, category, program_type, extracted_phone, extracted_email, action_url

## forms_guides

- stageSupported: true
- stagingTable: staging_scraped_forms
- targetTable: forms_and_guides
- unsupportedReason: none
- recommendedRunMode: fetch_only_first
- stageProceedRule: accepted validated rows exist and the family has a supported staging target
- stageStopRule: no accepted rows remain or family target is unsupported for staging
- compactAcceptanceSignals: official-like source URL, program or form title, download URL or library URL
- truthFieldsThatMustSurvive: sourceUrl/finalUrl, stateId, familyExtraction.programName, familyExtraction.officialDownloadUrl
- stageSpecificFields: slug, program, official_download_url, who_uses_it, who_signs_it, where_to_send_it, letter_script

## program_waitlists

- stageSupported: true
- stagingTable: staging_scraped_waitlists
- targetTable: program_waitlists
- unsupportedReason: none
- recommendedRunMode: author_first_only
- stageProceedRule: skip until validate is allowed
- stageStopRule: skip
- compactAcceptanceSignals: program or waiver name, waitlist or interest-list language, official next-step link or phone
- truthFieldsThatMustSurvive: sourceUrl/finalUrl, stateId, familyExtraction.programName, textSample or serviceSummary, validationReasons when rejected
- stageSpecificFields: program_id, name, duration_label, duration_months, status, description, estimate_source_url, estimate_source_type, last_checked_at

## medicaid_hhs_offices

- stageSupported: true
- stagingTable: staging_scraped_county_offices
- targetTable: county_offices
- unsupportedReason: none
- recommendedRunMode: fetch_only_first
- stageProceedRule: accepted validated rows exist and the family has a supported staging target
- stageStopRule: no accepted rows remain or family target is unsupported for staging
- compactAcceptanceSignals: office name, office phone, street address
- truthFieldsThatMustSurvive: sourceUrl/finalUrl, stateId, familyExtraction.officeName, familyExtraction.contactPhone, familyExtraction.contactAddress
- stageSpecificFields: extracted_name, extracted_phone, extracted_email, extracted_address, extracted_website, program_id, evidence_level

## education_routing

- stageSupported: true
- stagingTable: staging_scraped_regional_education_agencies
- targetTable: regional_education_agencies
- unsupportedReason: none
- recommendedRunMode: full_lane_when_successful
- stageProceedRule: accepted validated rows exist and the family has a supported staging target
- stageStopRule: no accepted rows remain or family target is unsupported for staging
- compactAcceptanceSignals: district or agency identity, credible official site, phone, email, or routing page link
- truthFieldsThatMustSurvive: sourceUrl/finalUrl, stateId, targetTable, pageTitle/textSample, phones/emails when present
- stageSpecificFields: extracted_name, agency_type or district contact fields, counties_served, extracted_website, evidence_level, extracted_phone or spec_ed_contact_phone, spec_ed_contact_email

## providers_care

- stageSupported: true
- stagingTable: staging_scraped_resource_providers
- targetTable: resource_providers
- unsupportedReason: none
- recommendedRunMode: fetch_only_first
- stageProceedRule: accepted validated rows exist and the family has a supported staging target
- stageStopRule: no accepted rows remain or family target is unsupported for staging
- compactAcceptanceSignals: provider or clinic name, phone or email, address or explicit location signal
- truthFieldsThatMustSurvive: sourceUrl/finalUrl, stateId, familyExtraction.organizationName, familyExtraction.contactPhone/contactEmail/contactAddress
- stageSpecificFields: extracted_name, categories, extracted_phone, extracted_email, extracted_address, accepts_medi_cal

## knowledge_content

- stageSupported: true
- stagingTable: staging_scraped_knowledge_content
- targetTable: knowledge_content
- unsupportedReason: none
- recommendedRunMode: fetch_only_first
- stageProceedRule: accepted validated rows exist and the family has a supported staging target
- stageStopRule: no accepted rows remain or family target is unsupported for staging
- compactAcceptanceSignals: trusted source URL, article title, summary text at least 80 characters
- truthFieldsThatMustSurvive: sourceUrl/finalUrl, stateId, familyExtraction.articleTitle, familyExtraction.canonicalKnowledgeUrl, familyExtraction.summaryText
- stageSpecificFields: slug, title, content_category, canonical_url, summary

