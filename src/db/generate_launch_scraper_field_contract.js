import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);

const jsonOutPath = path.join(docsDir, `launch-scraper-field-contract-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-field-contract-${generatedDate}.md`);

const familyFieldContracts = [
  {
    family: 'dd_routing',
    recordType: 'dd_routing_page',
    parserFunction: 'extractDdRouting',
    extractedFields: [
      'officeName',
      'contactPhone',
      'contactEmail',
      'contactAddress',
      'serviceSummary',
      'publicContactSignalCount',
    ],
    acceptanceRules: [
      'officeName required',
      'publicContactSignalCount > 0 required',
    ],
    rejectionReasons: [
      'missing_office_name',
      'missing_dd_contact_signal',
    ],
    stagingTable: 'staging_scraped_state_resource_agencies',
    stagedFields: [
      'extracted_name',
      'agency_type',
      'counties_served',
      'catchment_boundaries',
      'extracted_website',
      'extracted_phone',
      'early_intervention_contact',
      'agency_intake_contact',
      'eligibility_info_page',
      'services_page',
      'appeals_info',
    ],
  },
  {
    family: 'programs_benefits',
    recordType: 'program_information_page',
    parserFunction: 'extractPrograms',
    extractedFields: [
      'programName',
      'contactPhone',
      'contactEmail',
      'callToActionLinks',
      'outboundLinkCount',
    ],
    acceptanceRules: [
      'programName required',
      'links or phones required as action signal',
    ],
    rejectionReasons: [
      'missing_program_name',
      'missing_action_signal',
    ],
    stagingTable: 'staging_scraped_programs',
    stagedFields: [
      'extracted_name',
      'description',
      'who_it_is_for',
      'who_might_qualify',
      'official_source_url',
      'category',
      'program_type',
      'extracted_phone',
      'extracted_email',
      'action_url',
    ],
  },
  {
    family: 'waivers',
    recordType: 'program_information_page',
    parserFunction: 'extractPrograms',
    extractedFields: [
      'programName',
      'contactPhone',
      'contactEmail',
      'callToActionLinks',
      'outboundLinkCount',
    ],
    acceptanceRules: [
      'programName required',
      'links or phones required as action signal',
    ],
    rejectionReasons: [
      'missing_program_name',
      'missing_action_signal',
    ],
    stagingTable: 'staging_scraped_programs',
    stagedFields: [
      'extracted_name',
      'description',
      'who_it_is_for',
      'who_might_qualify',
      'official_source_url',
      'category',
      'program_type',
      'extracted_phone',
      'extracted_email',
      'action_url',
    ],
  },
  {
    family: 'program_waitlists',
    recordType: 'program_information_page',
    parserFunction: 'extractPrograms',
    extractedFields: [
      'programName',
      'contactPhone',
      'contactEmail',
      'callToActionLinks',
      'outboundLinkCount',
    ],
    acceptanceRules: [
      'programName required',
      'links or phones required as action signal',
      'waitlist identity still requires downstream family-specific interpretation',
    ],
    rejectionReasons: [
      'missing_program_name',
      'missing_action_signal',
    ],
    stagingTable: 'staging_scraped_waitlists',
    stagedFields: [
      'program_id',
      'name',
      'duration_label',
      'duration_months',
      'status',
      'description',
      'estimate_source_url',
      'estimate_source_type',
      'last_checked_at',
    ],
  },
  {
    family: 'medicaid_hhs_offices',
    recordType: 'county_office_page',
    parserFunction: 'extractCountyOffice',
    extractedFields: [
      'officeName',
      'contactPhone',
      'contactEmail',
      'contactAddress',
      'publicContactSignalCount',
    ],
    acceptanceRules: [
      'officeName required',
      'contactPhone required',
      'contactAddress required',
    ],
    rejectionReasons: [
      'missing_office_name',
      'missing_office_phone',
      'missing_office_address',
    ],
    stagingTable: 'staging_scraped_county_offices',
    stagedFields: [
      'extracted_name',
      'extracted_phone',
      'extracted_email',
      'extracted_address',
      'extracted_website',
      'program_id',
      'evidence_level',
    ],
  },
  {
    family: 'education_routing',
    recordType: 'generic_page_with_education_staging_mapping',
    parserFunction: 'parseCommonExtraction + targetTable-aware staging',
    extractedFields: [
      'pageTitle',
      'phones',
      'emails',
      'links',
      'addressLines',
    ],
    acceptanceRules: [
      'credible website or phone path required',
      'regional agencies stage to regional table',
      'school districts stage to district table',
    ],
    rejectionReasons: [
      'missing_basic_signal',
    ],
    stagingTable: 'staging_scraped_regional_education_agencies or staging_scraped_school_districts',
    stagedFields: [
      'extracted_name',
      'agency_type',
      'counties_served',
      'extracted_website',
      'evidence_level',
      'extracted_phone',
      'spec_ed_contact_phone',
      'spec_ed_contact_email',
    ],
  },
  {
    family: 'providers_care',
    recordType: 'provider_page',
    parserFunction: 'extractProviders',
    extractedFields: [
      'organizationName',
      'contactPhone',
      'contactEmail',
      'contactAddress',
      'publicContactSignalCount',
    ],
    acceptanceRules: [
      'organizationName required',
      'publicContactSignalCount > 0 required',
    ],
    rejectionReasons: [
      'missing_provider_name',
      'missing_provider_contact_signal',
    ],
    stagingTable: 'staging_scraped_resource_providers',
    stagedFields: [
      'extracted_name',
      'categories',
      'extracted_phone',
      'extracted_email',
      'extracted_address',
      'accepts_medi_cal',
    ],
  },
  {
    family: 'forms_guides',
    recordType: 'forms_page',
    parserFunction: 'extractForms',
    extractedFields: [
      'programName',
      'officialDownloadUrl',
      'documentLikeLinks',
      'mailingAddress',
    ],
    acceptanceRules: [
      'official-like final/source URL required',
      'programName required',
      'officialDownloadUrl required',
    ],
    rejectionReasons: [
      'forms_requires_official_source',
      'missing_form_program_name',
      'missing_official_download_or_library_url',
    ],
    stagingTable: 'staging_scraped_forms',
    stagedFields: [
      'slug',
      'program',
      'official_download_url',
      'who_uses_it',
      'who_signs_it',
      'where_to_send_it',
      'letter_script',
    ],
  },
  {
    family: 'knowledge_content',
    recordType: 'knowledge_content_page',
    parserFunction: 'extractKnowledgeContent',
    extractedFields: [
      'articleTitle',
      'canonicalKnowledgeUrl',
      'contentCategory',
      'topicLinks',
      'summaryText',
    ],
    acceptanceRules: [
      'trusted knowledge source required',
      'articleTitle required',
      'summaryText length >= 80 required',
    ],
    rejectionReasons: [
      'knowledge_requires_high_trust_source',
      'missing_knowledge_title',
      'knowledge_summary_too_thin',
    ],
    stagingTable: 'staging_scraped_knowledge_content',
    stagedFields: [
      'slug',
      'title',
      'content_category',
      'canonical_url',
      'summary',
    ],
  },
];

const payload = {
  generatedAt: generatedDate,
  familyCount: familyFieldContracts.length,
  familyFieldContracts,
};

const mdLines = [
  '# Launch Scraper Field Contract',
  '',
  `Generated: ${generatedDate}`,
  '',
];

for (const family of familyFieldContracts) {
  mdLines.push(`## ${family.family}`);
  mdLines.push('');
  mdLines.push(`- recordType: ${family.recordType}`);
  mdLines.push(`- parserFunction: ${family.parserFunction}`);
  mdLines.push('- extractedFields:');
  for (const field of family.extractedFields) mdLines.push(`- ${field}`);
  mdLines.push('- acceptanceRules:');
  for (const rule of family.acceptanceRules) mdLines.push(`- ${rule}`);
  mdLines.push('- rejectionReasons:');
  for (const reason of family.rejectionReasons) mdLines.push(`- ${reason}`);
  mdLines.push(`- stagingTable: ${family.stagingTable}`);
  if (family.stagedFields.length) {
    mdLines.push('- stagedFields:');
    for (const field of family.stagedFields) mdLines.push(`- ${field}`);
  }
  mdLines.push('');
}

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  json: jsonOutPath,
  md: mdOutPath,
  familyCount: familyFieldContracts.length,
}, null, 2));
