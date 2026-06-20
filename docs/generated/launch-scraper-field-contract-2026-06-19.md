# Launch Scraper Field Contract

Generated: 2026-06-19

## dd_routing

- recordType: dd_routing_page
- parserFunction: extractDdRouting
- extractedFields:
- officeName
- contactPhone
- contactEmail
- contactAddress
- serviceSummary
- publicContactSignalCount
- acceptanceRules:
- officeName required
- publicContactSignalCount > 0 required
- rejectionReasons:
- missing_office_name
- missing_dd_contact_signal
- stagingTable: staging_scraped_state_resource_agencies
- stagedFields:
- extracted_name
- agency_type
- counties_served
- catchment_boundaries
- extracted_website
- extracted_phone
- early_intervention_contact
- agency_intake_contact
- eligibility_info_page
- services_page
- appeals_info

## programs_benefits

- recordType: program_information_page
- parserFunction: extractPrograms
- extractedFields:
- programName
- contactPhone
- contactEmail
- callToActionLinks
- outboundLinkCount
- acceptanceRules:
- programName required
- links or phones required as action signal
- rejectionReasons:
- missing_program_name
- missing_action_signal
- stagingTable: staging_scraped_programs
- stagedFields:
- extracted_name
- description
- who_it_is_for
- who_might_qualify
- official_source_url
- category
- program_type
- extracted_phone
- extracted_email
- action_url

## waivers

- recordType: program_information_page
- parserFunction: extractPrograms
- extractedFields:
- programName
- contactPhone
- contactEmail
- callToActionLinks
- outboundLinkCount
- acceptanceRules:
- programName required
- links or phones required as action signal
- rejectionReasons:
- missing_program_name
- missing_action_signal
- stagingTable: staging_scraped_programs
- stagedFields:
- extracted_name
- description
- who_it_is_for
- who_might_qualify
- official_source_url
- category
- program_type
- extracted_phone
- extracted_email
- action_url

## program_waitlists

- recordType: program_information_page
- parserFunction: extractPrograms
- extractedFields:
- programName
- contactPhone
- contactEmail
- callToActionLinks
- outboundLinkCount
- acceptanceRules:
- programName required
- links or phones required as action signal
- waitlist identity still requires downstream family-specific interpretation
- rejectionReasons:
- missing_program_name
- missing_action_signal
- stagingTable: staging_scraped_waitlists
- stagedFields:
- program_id
- name
- duration_label
- duration_months
- status
- description
- estimate_source_url
- estimate_source_type
- last_checked_at

## medicaid_hhs_offices

- recordType: county_office_page
- parserFunction: extractCountyOffice
- extractedFields:
- officeName
- contactPhone
- contactEmail
- contactAddress
- publicContactSignalCount
- acceptanceRules:
- officeName required
- contactPhone required
- contactAddress required
- rejectionReasons:
- missing_office_name
- missing_office_phone
- missing_office_address
- stagingTable: staging_scraped_county_offices
- stagedFields:
- extracted_name
- extracted_phone
- extracted_email
- extracted_address
- extracted_website
- program_id
- evidence_level

## education_routing

- recordType: generic_page_with_education_staging_mapping
- parserFunction: parseCommonExtraction + targetTable-aware staging
- extractedFields:
- pageTitle
- phones
- emails
- links
- addressLines
- acceptanceRules:
- credible website or phone path required
- regional agencies stage to regional table
- school districts stage to district table
- rejectionReasons:
- missing_basic_signal
- stagingTable: staging_scraped_regional_education_agencies or staging_scraped_school_districts
- stagedFields:
- extracted_name
- agency_type
- counties_served
- extracted_website
- evidence_level
- extracted_phone
- spec_ed_contact_phone
- spec_ed_contact_email

## providers_care

- recordType: provider_page
- parserFunction: extractProviders
- extractedFields:
- organizationName
- contactPhone
- contactEmail
- contactAddress
- publicContactSignalCount
- acceptanceRules:
- organizationName required
- publicContactSignalCount > 0 required
- rejectionReasons:
- missing_provider_name
- missing_provider_contact_signal
- stagingTable: staging_scraped_resource_providers
- stagedFields:
- extracted_name
- categories
- extracted_phone
- extracted_email
- extracted_address
- accepts_medi_cal

## forms_guides

- recordType: forms_page
- parserFunction: extractForms
- extractedFields:
- programName
- officialDownloadUrl
- documentLikeLinks
- mailingAddress
- acceptanceRules:
- official-like final/source URL required
- programName required
- officialDownloadUrl required
- rejectionReasons:
- forms_requires_official_source
- missing_form_program_name
- missing_official_download_or_library_url
- stagingTable: staging_scraped_forms
- stagedFields:
- slug
- program
- official_download_url
- who_uses_it
- who_signs_it
- where_to_send_it
- letter_script

## knowledge_content

- recordType: knowledge_content_page
- parserFunction: extractKnowledgeContent
- extractedFields:
- articleTitle
- canonicalKnowledgeUrl
- contentCategory
- topicLinks
- summaryText
- acceptanceRules:
- trusted knowledge source required
- articleTitle required
- summaryText length >= 80 required
- rejectionReasons:
- knowledge_requires_high_trust_source
- missing_knowledge_title
- knowledge_summary_too_thin
- stagingTable: staging_scraped_knowledge_content
- stagedFields:
- slug
- title
- content_category
- canonical_url
- summary

