import assert from 'node:assert/strict';
import { parseFamilyRecord, validateFamilyRecord } from './source-acquisition-lightweight-lib.mjs';

function makeRow(overrides = {}) {
  return {
    stateId: 'test-state',
    gapFamily: 'nonprofit_support',
    targetTable: 'nonprofit_organizations',
    sourceQueue: 'test',
    sourceUrl: 'https://example.org/page',
    finalUrl: 'https://example.org/page',
    savedPath: '/tmp/example.html',
    contentType: 'text/html',
    sourceName: '',
    ...overrides,
  };
}

function testTheArcChapter() {
  const row = makeRow({
    stateId: 'texas',
    sourceUrl: 'https://thearc.org/chapter/example',
    finalUrl: 'https://thearc.org/chapter/example',
  });
  const html = `
    <html>
      <head><title>The Arc of Example County - The Arc</title></head>
      <body>
        <h1>Find a Chapter</h1>
        <h1>The Arc of Example County</h1>
        <h2>Contact</h2>
        <p>The Arc of Example County</p>
        <p>123 Main Street, Example, TX 75000</p>
        <p>Phone: (817) 555-1234</p>
        <p>Email: info@examplearc.org</p>
        <a href="https://examplearc.org">VISIT WEBSITE</a>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  assert.equal(record.familyExtraction.organizationName, 'The Arc of Example County');
  assert.equal(record.familyExtraction.contactPhone, '(817) 555-1234');
  assert.equal(record.familyExtraction.contactEmail, 'info@examplearc.org');
  assert.equal(record.familyExtraction.organizationWebsite, 'https://examplearc.org');
  assert.equal(validateFamilyRecord(record).isAccepted, true);
}

function testDdRouting() {
  const row = makeRow({
    stateId: 'pennsylvania',
    gapFamily: 'dd_routing',
    targetTable: 'state_resource_agencies',
    sourceUrl: 'https://example.gov/dd',
    finalUrl: 'https://example.gov/dd',
    savedPath: '/tmp/dd.html',
  });
  const html = `
    <html>
      <head><title>Intellectual and Developmental Disabilities</title></head>
      <body>
        <h1>Intellectual and Developmental Disabilities</h1>
        <p>The County Office of Intellectual and Developmental Disabilities serves eligible residents.</p>
        <p>Contact 610-713-2330 for information.</p>
        <p>Email: help@example.gov</p>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  assert.equal(record.familyExtraction.officeName, 'Intellectual and Developmental Disabilities');
  assert.equal(record.familyExtraction.contactPhone, '(610) 713-2330');
  assert.equal(record.familyExtraction.contactEmail, 'help@example.gov');
  assert.equal(validateFamilyRecord(record).isAccepted, true);
}

function testGenericNonprofitFallback() {
  const row = makeRow({
    stateId: 'new-jersey',
    sourceUrl: 'https://spanadvocacy.org/programs/p2p/',
    finalUrl: 'https://spanadvocacy.org/programs/p2p/',
  });
  const html = `
    <html>
      <head><title>NJ Statewide Parent to Parent (P2P NJ) | SPAN Parent Advocacy Network</title></head>
      <body>
        <h1>NJ Statewide Parent to Parent (NJP2P)</h1>
        <h2>Contact Us</h2>
        <p>Call us at (973) 642-8100</p>
        <p>Email: info@spanadvocacy.org</p>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  assert.equal(record.familyExtraction.recordType, 'generic_page');
  assert.equal(record.familyExtraction.organizationName, 'NJ Statewide Parent to Parent (NJP2P)');
  assert.deepEqual(record.phones, ['(973) 642-8100']);
  assert.equal(validateFamilyRecord(record).isAccepted, true);
}

function testProgramExtraction() {
  const row = makeRow({
    stateId: 'texas',
    gapFamily: 'programs_benefits',
    targetTable: 'programs',
    sourceUrl: 'https://www.hhs.texas.gov/services/disability',
    finalUrl: 'https://www.hhs.texas.gov/services/disability',
  });
  const html = `
    <html>
      <head><title>Disability | Texas Health and Human Services</title></head>
      <body>
        <h1>Disability</h1>
        <a href="tel:855-937-2372">Call 855-YES-ADRC (855-937-2372) for help</a>
        <a href="https://resources.hhs.texas.gov/pages/find-services">Services Office Locator</a>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  assert.equal(record.familyExtraction.recordType, 'program_information_page');
  assert.equal(record.familyExtraction.programName, 'Disability');
  assert.equal(record.familyExtraction.callToActionLinks.length, 1);
  assert.equal(validateFamilyRecord(record).isAccepted, true);
}

function testExpectedValidationRejects() {
  const row = makeRow({
    stateId: 'ohio',
    gapFamily: 'advocates_legal',
    targetTable: 'iep_advocates',
    sourceUrl: 'https://example.org/empty',
    finalUrl: 'https://example.org/empty',
  });
  const html = `
    <html>
      <head></head>
      <body>
        <div>No usable contact info here.</div>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  const result = validateFamilyRecord(record);
  assert.equal(result.isAccepted, false);
  assert.ok(result.reasons.includes('missing_title_and_heading'));
  assert.ok(result.reasons.includes('missing_advocate_relevance_signal'));
  assert.ok(result.reasons.includes('missing_advocate_contact_signal'));
}

function testDdRoutingRejectWithoutContact() {
  const row = makeRow({
    stateId: 'pennsylvania',
    gapFamily: 'dd_routing',
    targetTable: 'state_resource_agencies',
    sourceUrl: 'https://example.gov/dd2',
    finalUrl: 'https://example.gov/dd2',
    savedPath: '/tmp/dd2.html',
  });
  const html = `
    <html>
      <head><title>County Developmental Disabilities Overview</title></head>
      <body>
        <h1>County Developmental Disabilities Overview</h1>
        <p>This page describes services but does not list direct contact details.</p>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  const result = validateFamilyRecord(record);
  assert.equal(result.isAccepted, false);
  assert.ok(result.reasons.includes('missing_dd_contact_signal'));
}

function testPhoneNormalizationAndDeduping() {
  const row = makeRow();
  const html = `
    <html>
      <head><title>Example</title></head>
      <body>
        <h1>Example Org</h1>
        <p>Phone: 1-800-555-1212</p>
        <p>Phone: (800) 555-1212</p>
        <p>Email: INFO@EXAMPLE.ORG</p>
        <p>Email: info@example.org</p>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  assert.deepEqual(record.phones, ['(800) 555-1212']);
  assert.deepEqual(record.emails, ['info@example.org']);
}

function testProviderAddressExtractionFromMultilineBlock() {
  const row = makeRow({
    stateId: 'florida',
    gapFamily: 'providers_care',
    targetTable: 'resource_providers',
    sourceUrl: 'https://card-usf.fmhi.usf.edu/',
    finalUrl: 'https://card-usf.fmhi.usf.edu/',
  });
  const html = `
    <html>
      <head><title>Center for Autism &amp; Related Disabilities</title></head>
      <body>
        <h1>Welcome to CARD-USF</h1>
        <p>13301 Bruce B Downs Blvd. MHC 2113A</p>
        <p>Tampa, FL, USA 33612 • 813-974-2532</p>
        <p>Phone: (813) 974-2532</p>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  assert.equal(record.familyExtraction.recordType, 'provider_page');
  assert.equal(record.familyExtraction.organizationName, 'Center for Autism & Related Disabilities');
  assert.equal(record.familyExtraction.contactAddress, '13301 Bruce B Downs Blvd. MHC 2113A, Tampa, FL 33612');
  assert.equal(validateFamilyRecord(record).isAccepted, true);
}

function testProviderAddressExtractionFromMapLink() {
  const row = makeRow({
    stateId: 'florida',
    gapFamily: 'providers_care',
    targetTable: 'resource_providers',
    sourceUrl: 'https://example.org/provider',
    finalUrl: 'https://example.org/provider',
  });
  const html = `
    <html>
      <head><title>Center for Autism and Related Disabilities (CARD)</title></head>
      <body>
        <h1>Center for Autism and Related Disabilities (CARD)</h1>
        <p>6271 St. Augustine Rd.</p>
        <p>Suite 1</p>
        <p>Jacksonville, FL 32217</p>
        <a href="tel:1-904-633-0760">Phone: (904) 633-0760</a>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  assert.equal(record.familyExtraction.contactAddress, '6271 St. Augustine Rd., Suite 1, Jacksonville, FL 32217');
  assert.equal(validateFamilyRecord(record).isAccepted, true);
}

function testProviderAddressExtractionFromMapEmbed() {
  const row = makeRow({
    stateId: 'florida',
    gapFamily: 'providers_care',
    targetTable: 'resource_providers',
    sourceUrl: 'https://example.org/provider-map',
    finalUrl: 'https://example.org/provider-map',
  });
  const html = `
    <html>
      <head><title>FSU Multidisciplinary Center</title></head>
      <body>
        <h1>FSU Multidisciplinary Center</h1>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!2s2139+Maryland+Cir+%231200%2C+Tallahassee%2C+FL+32303!5e0"></iframe>
        <p>Phone: (850) 644-2222</p>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  assert.equal(record.familyExtraction.contactAddress, '2139 Maryland Cir #1200, Tallahassee, FL 32303');
  assert.equal(validateFamilyRecord(record).isAccepted, true);
}

function testProviderAddressExtractionFromGoogleMapsPlaceLink() {
  const row = makeRow({
    stateId: 'new-york',
    gapFamily: 'providers_care',
    targetTable: 'resource_providers',
    sourceUrl: 'https://childrenshospital.northwell.edu/departments-services',
    finalUrl: 'https://childrenshospital.northwell.edu/departments-services',
  });
  const html = `
    <html>
      <head><title>Departments &amp; services - Cohen Children's</title></head>
      <body>
        <h1>Cohen Children's</h1>
        <a href="https://www.google.com/maps/place/269-01+76th+Avenue+New+Hyde+Park+NY+11040">Directions</a>
        <p>Call us at (833) 259-2367</p>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  assert.equal(record.familyExtraction.contactAddress, '269-01 76th Avenue, New Hyde Park, NY 11040');
  assert.equal(validateFamilyRecord(record).isAccepted, true);
}

function testProviderAddressExtractionFromStructuredMicroformat() {
  const row = makeRow({
    stateId: 'texas',
    gapFamily: 'providers_care',
    targetTable: 'resource_providers',
    sourceUrl: 'https://calliercenter.utdallas.edu/contact-us/',
    finalUrl: 'https://calliercenter.utdallas.edu/contact-us/',
  });
  const html = `
    <html>
      <head><title>Contact Us - Callier Center for Communication Disorders</title></head>
      <body>
        <span class="org fn">Callier Center for Communication Disorders</span>
        <span class="street-address">1966 Inwood Rd</span>
        <span class="locality">Dallas</span>,
        <span class="region"> TX</span>
        <span class="postal-code"> 75235 </span>
        <a href="mailto:communicationdisorders@utdallas.edu">Email</a>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  assert.equal(record.familyExtraction.contactAddress, '1966 Inwood Rd, Dallas, TX 75235');
  assert.equal(validateFamilyRecord(record).isAccepted, true);
}

function testAdvocateAcceptsSingleStateSpecialEducationPage() {
  const row = makeRow({
    stateId: 'multi-state',
    gapFamily: 'advocates_legal',
    targetTable: 'iep_advocates',
    sourceUrl: 'https://example.org/special-ed-law',
    finalUrl: 'https://example.org/special-ed-law',
  });
  const html = `
    <html>
      <head>
        <title>Special Education Lawyer - Freehold, NJ | Special Education Attorney</title>
        <meta name="description" content="Helping New Jersey families with IEP, 504, and guardianship matters.">
      </head>
      <body>
        <h1>Special Education Guardianship Attorneys Serving New Jersey</h1>
        <p>Phone: (732) 333-8900</p>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  const result = validateFamilyRecord(record);
  assert.equal(record.familyExtraction.recordType, 'advocate_page');
  assert.equal(record.stateId, 'new-jersey');
  assert.equal(record.familyExtraction.organizationName, 'Special Education Guardianship Attorneys Serving New Jersey');
  assert.equal(result.isAccepted, true);
}

function testAdvocateRejectsHijackedOrIrrelevantPage() {
  const row = makeRow({
    stateId: 'multi-state',
    gapFamily: 'advocates_legal',
    targetTable: 'iep_advocates',
    sourceUrl: 'https://example.org/hijacked',
    finalUrl: 'https://example.org/hijacked',
  });
  const html = `
    <html>
      <head>
        <title>Caryloberman | Berita iGaming Indonesia - Berita iGaming Indonesia</title>
        <meta name="description" content="Berita iGaming Indonesia">
      </head>
      <body>
        <h1>Caryloberman | Berita iGaming Indonesia</h1>
        <a href="https://example.org/slot">SITUS SLOT 777</a>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  const result = validateFamilyRecord(record);
  assert.equal(result.isAccepted, false);
  assert.ok(result.reasons.includes('bad_advocate_topic_signal'));
}

function testAdvocateStaysMultiStateWhenSiteServesSeveralStates() {
  const row = makeRow({
    stateId: 'multi-state',
    gapFamily: 'advocates_legal',
    targetTable: 'iep_advocates',
    sourceUrl: 'https://example.org/multistate-advocate',
    finalUrl: 'https://example.org/multistate-advocate',
  });
  const html = `
    <html>
      <head>
        <title>special needs advocacy special educational consulting Maryland, Virginia, DC and Nationwide</title>
      </head>
      <body>
        <h1>Special Needs Advocacy</h1>
        <p>Serving Maryland, Virginia, DC and surrounding states.</p>
        <p>Email: help@example.org</p>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  const result = validateFamilyRecord(record);
  assert.equal(record.stateId, 'multi-state');
  assert.equal(result.isAccepted, true);
}

function testAdvocateStateInferenceDoesNotTreatCommonWordsAsStateCodes() {
  const row = makeRow({
    stateId: 'multi-state',
    gapFamily: 'advocates_legal',
    targetTable: 'iep_advocates',
    sourceUrl: 'https://example.org/support-services',
    finalUrl: 'https://example.org/support-services',
  });
  const html = `
    <html>
      <head>
        <title>Special Support Services, LLC - We offer affordable advocacy and systems navigation for NYC families</title>
      </head>
      <body>
        <h1>Support for families</h1>
        <p>Contact us to learn more about our advocacy services.</p>
        <p>Phone: (212) 555-1212</p>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  assert.equal(record.stateId, 'multi-state');
}

function testFormsGuideAcceptsOfficialFormLibrary() {
  const row = makeRow({
    stateId: 'texas',
    gapFamily: 'forms_guides',
    targetTable: 'forms_and_guides',
    sourceUrl: 'https://www.hhs.texas.gov/forms',
    finalUrl: 'https://www.hhs.texas.gov/forms',
  });
  const html = `
    <html>
      <head><title>Forms and Applications | Texas HHS</title></head>
      <body>
        <h1>Forms and Applications</h1>
        <a href="/assets/forms/medicaid-application.pdf">Download Medicaid Application</a>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  const result = validateFamilyRecord(record);
  assert.equal(record.familyExtraction.recordType, 'forms_guide_page');
  assert.equal(record.familyExtraction.officialDownloadUrl, 'https://www.hhs.texas.gov/assets/forms/medicaid-application.pdf');
  assert.equal(result.isAccepted, true);
}

function testFormsGuideRejectsUnofficialSource() {
  const row = makeRow({
    stateId: 'texas',
    gapFamily: 'forms_guides',
    targetTable: 'forms_and_guides',
    sourceUrl: 'https://example.org/forms',
    finalUrl: 'https://example.org/forms',
  });
  const html = `
    <html>
      <head><title>Helpful Forms</title></head>
      <body>
        <h1>Helpful Forms</h1>
        <a href="/forms/example.pdf">Download</a>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  const result = validateFamilyRecord(record);
  assert.equal(result.isAccepted, false);
  assert.ok(result.reasons.includes('forms_requires_official_source'));
}

function testHousingRequiresActionableSignal() {
  const row = makeRow({
    stateId: 'georgia',
    gapFamily: 'housing',
    targetTable: 'help_resources',
    sourceUrl: 'https://example.org/housing',
    finalUrl: 'https://example.org/housing',
  });
  const html = `
    <html>
      <head><title>Accessible Housing Help</title></head>
      <body>
        <h1>Accessible Housing Help</h1>
        <p>Phone: (404) 555-1111</p>
        <a href="/apply">Apply for housing support</a>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  const result = validateFamilyRecord(record);
  assert.equal(record.familyExtraction.recordType, 'housing_resource_page');
  assert.equal(result.isAccepted, true);
}

function testKnowledgeContentRequiresHighTrustSource() {
  const row = makeRow({
    stateId: 'california',
    gapFamily: 'knowledge_content',
    targetTable: 'knowledge_content',
    sourceUrl: 'https://www.dds.ca.gov/waiver-explainer',
    finalUrl: 'https://www.dds.ca.gov/waiver-explainer',
  });
  const html = `
    <html>
      <head><title>Understanding HCBS Waivers | California DDS</title></head>
      <body>
        <h1>Understanding HCBS Waivers</h1>
        <p>HCBS waivers help children and adults with developmental disabilities access supports in community settings.</p>
        <p>Families can use this guide to understand eligibility, appeals, and next-step planning with regional centers.</p>
      </body>
    </html>
  `;
  const record = parseFamilyRecord(row, html);
  const result = validateFamilyRecord(record);
  assert.equal(record.familyExtraction.recordType, 'knowledge_content_page');
  assert.equal(result.isAccepted, true);
}

testTheArcChapter();
testDdRouting();
testGenericNonprofitFallback();
testProgramExtraction();
testExpectedValidationRejects();
testDdRoutingRejectWithoutContact();
testPhoneNormalizationAndDeduping();
testProviderAddressExtractionFromMultilineBlock();
testProviderAddressExtractionFromMapLink();
testProviderAddressExtractionFromMapEmbed();
testProviderAddressExtractionFromGoogleMapsPlaceLink();
testProviderAddressExtractionFromStructuredMicroformat();
testAdvocateAcceptsSingleStateSpecialEducationPage();
testAdvocateRejectsHijackedOrIrrelevantPage();
testAdvocateStaysMultiStateWhenSiteServesSeveralStates();
testAdvocateStateInferenceDoesNotTreatCommonWordsAsStateCodes();
testFormsGuideAcceptsOfficialFormLibrary();
testFormsGuideRejectsUnofficialSource();
testHousingRequiresActionableSignal();
testKnowledgeContentRequiresHighTrustSource();

console.log('source acquisition lightweight parser tests passed');
