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

const jsonOutPath = path.join(docsDir, `launch-scraper-fixture-matrix-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-fixture-matrix-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated input for prefix "${prefix}"`);
  }
  return path.join(docsDir, matches.at(-1));
}

const fieldContractPath = latestGeneratedJson('launch-scraper-field-contract-');
const scraperContractPath = latestGeneratedJson('launch-scraper-contract-');

const fieldContract = readJson(fieldContractPath);
const scraperContract = readJson(scraperContractPath);

const fixtureProfiles = {
  dd_routing: {
    positiveFixture: {
      description: 'Official state DD intake page with agency name, intake phone, and services or eligibility link.',
      minimumPageSignals: ['agency heading', 'phone or intake contact', 'services or eligibility link'],
      expectedAcceptedFields: ['officeName', 'contactPhone', 'publicContactSignalCount', 'services_page'],
      stagingExpectation: 'staging_scraped_state_resource_agencies candidate written with extracted_name and routing links',
    },
    negativeFixtures: [
      {
        description: 'Agency page shell without agency name extraction.',
        expectedRejectionReasons: ['missing_office_name'],
      },
      {
        description: 'Agency overview with no phone, email, or intake contact signal.',
        expectedRejectionReasons: ['missing_dd_contact_signal'],
      },
    ],
  },
  programs_benefits: {
    positiveFixture: {
      description: 'Official program page with program name plus apply/contact action path.',
      minimumPageSignals: ['program heading', 'apply or learn-more action link or phone', 'official source page'],
      expectedAcceptedFields: ['programName', 'callToActionLinks or contactPhone', 'outboundLinkCount'],
      stagingExpectation: 'staging_scraped_programs candidate written with extracted_name, description, and action_url',
    },
    negativeFixtures: [
      {
        description: 'Generic agency page that never names a distinct program.',
        expectedRejectionReasons: ['missing_program_name'],
      },
      {
        description: 'Program explainer without apply link, outbound action path, or phone.',
        expectedRejectionReasons: ['missing_action_signal'],
      },
    ],
  },
  waivers: {
    positiveFixture: {
      description: 'Official HCBS or DD waiver page with explicit waiver identity and action path.',
      minimumPageSignals: ['waiver name', 'application or eligibility step link', 'official source page'],
      expectedAcceptedFields: ['programName', 'callToActionLinks or contactPhone', 'outboundLinkCount'],
      stagingExpectation: 'staging_scraped_programs candidate written with waiver-linked extracted_name and action_url',
    },
    negativeFixtures: [
      {
        description: 'Generic Medicaid page with no distinct waiver identity.',
        expectedRejectionReasons: ['missing_program_name'],
      },
      {
        description: 'Waiver summary page with no application/contact step.',
        expectedRejectionReasons: ['missing_action_signal'],
      },
    ],
  },
  program_waitlists: {
    positiveFixture: {
      description: 'Official waitlist or interest-list page tied to a named program and explicit next-step contact or link.',
      minimumPageSignals: ['program or waiver name', 'waitlist or interest-list language', 'official next-step link or phone'],
      expectedAcceptedFields: ['programName', 'callToActionLinks or contactPhone'],
      stagingExpectation: 'staging_scraped_waitlists candidate written with inferred program_id plus waitlist provenance fields',
    },
    negativeFixtures: [
      {
        description: 'Program page with no named program or waiver identity.',
        expectedRejectionReasons: ['missing_program_name'],
      },
      {
        description: 'Waitlist mention inferred from generic program copy without explicit action signal.',
        expectedRejectionReasons: ['missing_action_signal'],
      },
    ],
  },
  medicaid_hhs_offices: {
    positiveFixture: {
      description: 'Official county office page with office name, phone, and postal address.',
      minimumPageSignals: ['office name', 'office phone', 'street address'],
      expectedAcceptedFields: ['officeName', 'contactPhone', 'contactAddress', 'publicContactSignalCount'],
      stagingExpectation: 'staging_scraped_county_offices candidate written with extracted_name, phone, and address',
    },
    negativeFixtures: [
      {
        description: 'County office page that fails to expose an office name.',
        expectedRejectionReasons: ['missing_office_name'],
      },
      {
        description: 'Office page with no phone.',
        expectedRejectionReasons: ['missing_office_phone'],
      },
      {
        description: 'Office page with no physical address.',
        expectedRejectionReasons: ['missing_office_address'],
      },
    ],
  },
  education_routing: {
    positiveFixture: {
      description: 'Official regional or district education routing page with credible site and phone or explicit routing path.',
      minimumPageSignals: ['district or agency identity', 'credible official site', 'phone, email, or routing page link'],
      expectedAcceptedFields: ['pageTitle', 'phones or emails or links'],
      stagingExpectation: 'target-table-aware staging to regional or district staging table based on queue target',
    },
    negativeFixtures: [
      {
        description: 'Thin education page with no phone, no email, and no usable routing link.',
        expectedRejectionReasons: ['missing_basic_signal'],
      },
    ],
  },
  providers_care: {
    positiveFixture: {
      description: 'First-party clinic or program page with named provider service, contact signal, and location evidence.',
      minimumPageSignals: ['provider or clinic name', 'phone or email', 'address or explicit location signal'],
      expectedAcceptedFields: ['organizationName', 'contactPhone or contactEmail', 'contactAddress or location signal', 'publicContactSignalCount'],
      stagingExpectation: 'staging_scraped_resource_providers candidate written with extracted_name, categories, and contact fields',
    },
    negativeFixtures: [
      {
        description: 'Provider shell page that never names the clinic or program.',
        expectedRejectionReasons: ['missing_provider_name'],
      },
      {
        description: 'Named provider page with no phone, email, address, or other public contact signal.',
        expectedRejectionReasons: ['missing_provider_contact_signal'],
      },
    ],
  },
  forms_guides: {
    positiveFixture: {
      description: 'Official form page or official library root with program context and downloadable form or library URL.',
      minimumPageSignals: ['official-like source URL', 'program or form title', 'download URL or library URL'],
      expectedAcceptedFields: ['programName', 'officialDownloadUrl', 'documentLikeLinks'],
      stagingExpectation: 'staging_scraped_forms candidate written with program, official_download_url, and usage fields',
    },
    negativeFixtures: [
      {
        description: 'Unofficial mirror or placeholder domain page.',
        expectedRejectionReasons: ['forms_requires_official_source'],
      },
      {
        description: 'Official form library page with no form/program context extractable.',
        expectedRejectionReasons: ['missing_form_program_name'],
      },
      {
        description: 'Official page with no download URL and no approved library target.',
        expectedRejectionReasons: ['missing_official_download_or_library_url'],
      },
    ],
  },
  knowledge_content: {
    positiveFixture: {
      description: 'Trusted official or mission-aligned guidance page with article title and meaningful summary text.',
      minimumPageSignals: ['trusted source URL', 'article title', 'summary text at least 80 characters'],
      expectedAcceptedFields: ['articleTitle', 'canonicalKnowledgeUrl', 'summaryText', 'contentCategory'],
      stagingExpectation: 'staging_scraped_knowledge_content candidate written with slug, title, canonical_url, and summary',
    },
    negativeFixtures: [
      {
        description: 'Guidance page from non-trusted or weak source domain.',
        expectedRejectionReasons: ['knowledge_requires_high_trust_source'],
      },
      {
        description: 'Trusted article page with no extractable title.',
        expectedRejectionReasons: ['missing_knowledge_title'],
      },
      {
        description: 'Trusted article page whose extracted summary is too thin.',
        expectedRejectionReasons: ['knowledge_summary_too_thin'],
      },
    ],
  },
};

const familyContractsByName = new Map(
  (fieldContract.familyFieldContracts || []).map((contract) => [contract.family, contract]),
);
const executionContractsByName = new Map(
  (scraperContract.familyContracts || []).map((contract) => [contract.family, contract]),
);

const familyFixtureMatrix = Object.keys(fixtureProfiles).map((family) => {
  const field = familyContractsByName.get(family);
  const execution = executionContractsByName.get(family);
  if (!field) {
    throw new Error(`Missing field contract for family "${family}"`);
  }
  if (!execution) {
    throw new Error(`Missing scraper contract for family "${family}"`);
  }
  return {
    family,
    recordType: field.recordType,
    parserFunction: field.parserFunction,
    currentReadyTargetScrape: execution.currentCounts.readyTargetScrape,
    currentReadyByLane: execution.currentCounts.readyByLane,
    positiveFixture: fixtureProfiles[family].positiveFixture,
    negativeFixtures: fixtureProfiles[family].negativeFixtures,
    acceptanceRules: field.acceptanceRules,
    rejectionReasons: field.rejectionReasons,
    stagingTable: field.stagingTable,
    stagedFields: field.stagedFields,
  };
});

const payload = {
  generatedAt: generatedDate,
  sourceArtifacts: {
    launchScraperContract: path.relative(repoRoot, scraperContractPath),
    launchScraperFieldContract: path.relative(repoRoot, fieldContractPath),
  },
  familyCount: familyFixtureMatrix.length,
  familyFixtureMatrix,
};

const markdown = [
  '# Launch Scraper Fixture Matrix',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This artifact defines the minimum passing page shape and the expected failing page shapes for each launch-critical scraper family.',
  '',
];

for (const family of familyFixtureMatrix) {
  markdown.push(`## ${family.family}`);
  markdown.push('');
  markdown.push(`- recordType: ${family.recordType}`);
  markdown.push(`- parserFunction: ${family.parserFunction}`);
  markdown.push(`- currentReadyTargetScrape: ${family.currentReadyTargetScrape}`);
  markdown.push(`- currentReadyByLane: ${JSON.stringify(family.currentReadyByLane)}`);
  markdown.push('- positiveFixture:');
  markdown.push(`  - description: ${family.positiveFixture.description}`);
  markdown.push(`  - minimumPageSignals: ${family.positiveFixture.minimumPageSignals.join(', ')}`);
  markdown.push(`  - expectedAcceptedFields: ${family.positiveFixture.expectedAcceptedFields.join(', ')}`);
  markdown.push(`  - stagingExpectation: ${family.positiveFixture.stagingExpectation}`);
  markdown.push('- negativeFixtures:');
  for (const negative of family.negativeFixtures) {
    markdown.push(`  - description: ${negative.description}`);
    markdown.push(`    - expectedRejectionReasons: ${negative.expectedRejectionReasons.join(', ')}`);
  }
  markdown.push(`- acceptanceRules: ${family.acceptanceRules.join(', ')}`);
  markdown.push(`- rejectionReasons: ${family.rejectionReasons.join(', ')}`);
  markdown.push(`- stagingTable: ${family.stagingTable}`);
  if (family.stagedFields.length) {
    markdown.push(`- stagedFields: ${family.stagedFields.join(', ')}`);
  }
  markdown.push('');
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${markdown.join('\n')}\n`);

console.log(`Wrote ${path.relative(repoRoot, jsonOutPath)}`);
console.log(`Wrote ${path.relative(repoRoot, mdOutPath)}`);
