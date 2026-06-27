import assert from 'node:assert/strict';
import { getCountyTruthEligibility, isPublicCountyOfficeEligible, isPublicRecordEligible } from '../frontend/src/lib/publicTruth.ts';

const publishedRecord = {
  display_status: 'published',
  source_url: 'https://www.dds.ca.gov/rc/example',
  website: 'https://www.dds.ca.gov/rc/',
  verification_status: 'official_verified',
  data_origin: 'scraped',
  phone: '800-222-3333',
};

assert.equal(isPublicRecordEligible(publishedRecord), true);

assert.equal(
  isPublicRecordEligible({
    ...publishedRecord,
    display_status: 'needs_review',
  }),
  false,
);

assert.equal(
  isPublicCountyOfficeEligible({
    ...publishedRecord,
    office_name: 'Aging Services',
    source_url: 'https://www.sjchsa.org/Aging-Services',
    website: 'https://www.sjchsa.org/Aging-Services',
    program_id: 'ihss-for-children',
  }),
  false,
);

assert.equal(
  isPublicCountyOfficeEligible({
    ...publishedRecord,
    office_name: 'County Social Services Agency',
    source_url: 'https://socialservices.example.ca.gov/ihss',
    website: 'https://socialservices.example.ca.gov/ihss',
    program_id: 'ihss-for-children',
  }),
  true,
);

assert.equal(
  isPublicRecordEligible({
    ...publishedRecord,
    data_origin: 'seed',
    source_type: 'seed',
  }),
  false,
);

assert.equal(
  isPublicRecordEligible({
    ...publishedRecord,
    source_url: 'https://www.state.gov/medicaid/new-york',
  }),
  false,
);

assert.equal(
  isPublicRecordEligible({
    ...publishedRecord,
    source_url: 'https://www.google.com/search?q=county+family+resource+center',
  }),
  false,
);

assert.equal(
  isPublicRecordEligible({
    ...publishedRecord,
    data_origin: 'generated_county_fallback',
  }),
  false,
);

assert.equal(
  isPublicRecordEligible({
    ...publishedRecord,
    phone: '(800) 555-7777',
    email: 'specialed@district.org',
  }),
  false,
);

assert.equal(
  isPublicRecordEligible({
    ...publishedRecord,
    phone: '',
    email: 'placeholder@example.com',
    website: '',
  }),
  false,
);

assert.equal(
  isPublicRecordEligible({
    ...publishedRecord,
    phone: '',
    website: 'https://www.example.org/provider-7',
  }),
  false,
);

assert.equal(
  isPublicRecordEligible({
    ...publishedRecord,
    next_step_phone: '(555) 123-4567',
  }),
  false,
);

assert.equal(
  isPublicRecordEligible({
    ...publishedRecord,
    next_step_email: 'placeholder@example.com',
  }),
  false,
);

assert.equal(
  isPublicRecordEligible({
    ...publishedRecord,
    next_step_url: 'https://www.example.org/apply',
  }),
  false,
);

assert.equal(
  isPublicRecordEligible({
    ...publishedRecord,
    office_name: 'Placeholder County Services Record',
  }),
  false,
);

const countyTruthWithWebsiteOnlyDistrict = getCountyTruthEligibility('california', {
  id: 'los-angeles',
  regionalCenters: [{
    source_url: 'https://www.dds.ca.gov/rc/example',
    website: 'https://www.dds.ca.gov/rc/example',
    verification_status: 'official_verified',
    data_origin: 'scraped',
    intake_phone: '800-222-3333',
  }],
  selpas: [{
    source_url: 'https://www.cde.ca.gov/sp/se/as/example',
    website: 'https://www.cde.ca.gov/sp/se/as/example',
    verification_status: 'official_verified',
    data_origin: 'scraped',
    phone: '800-222-3334',
  }],
  countyOffices: [
    {
      program_id: 'ihss-for-children',
      source_url: 'https://www.cdss.ca.gov/example-ihss',
      verification_status: 'official_verified',
      data_origin: 'scraped',
      phone: '800-222-3335',
    },
    {
      program_id: 'medi-cal-for-kids-and-teens',
      source_url: 'https://www.dhcs.ca.gov/example-medi-cal',
      verification_status: 'official_verified',
      data_origin: 'scraped',
      phone: '800-222-3336',
    },
    {
      program_id: 'california-childrens-services',
      source_url: 'https://www.dhcs.ca.gov/example-ccs',
      verification_status: 'official_verified',
      data_origin: 'scraped',
      phone: '800-222-3337',
    },
  ],
  schoolDistricts: [{
    name: 'Website Only District',
    source_url: 'https://district.example.edu',
    website: 'https://district.example.edu',
    verification_status: 'official_verified',
    data_origin: 'scraped',
  }],
});

assert.equal(countyTruthWithWebsiteOnlyDistrict.publicSafe, false);
assert.equal(countyTruthWithWebsiteOnlyDistrict.indexSafe, false);
assert.equal(countyTruthWithWebsiteOnlyDistrict.blockers.includes('missing_public_school_district'), true);

const countyTruthWithAgingOnlyOffice = getCountyTruthEligibility('california', {
  id: 'san-joaquin',
  regionalCenters: [{
    source_url: 'https://www.dds.ca.gov/rc/example',
    website: 'https://www.dds.ca.gov/rc/example',
    verification_status: 'official_verified',
    data_origin: 'scraped',
    intake_phone: '800-222-3333',
  }],
  selpas: [{
    source_url: 'https://www.cde.ca.gov/sp/se/as/example',
    website: 'https://www.cde.ca.gov/sp/se/as/example',
    verification_status: 'official_verified',
    data_origin: 'scraped',
    phone: '800-222-3334',
  }],
  countyOffices: [
    {
      program_id: 'ihss-for-children',
      office_name: 'Aging Services',
      source_url: 'https://www.sjchsa.org/Aging-Services',
      website: 'https://www.sjchsa.org/Aging-Services',
      verification_status: 'official_verified',
      data_origin: 'scraped',
      phone: '800-222-3335',
    },
    {
      program_id: 'medi-cal-for-kids-and-teens',
      office_name: 'County Social Services Agency',
      source_url: 'https://socialservices.example.ca.gov/medi-cal',
      website: 'https://socialservices.example.ca.gov/medi-cal',
      verification_status: 'official_verified',
      data_origin: 'scraped',
      phone: '800-222-3336',
    },
    {
      program_id: 'california-childrens-services',
      office_name: 'Children Services',
      source_url: 'https://health.example.ca.gov/ccs',
      website: 'https://health.example.ca.gov/ccs',
      verification_status: 'official_verified',
      data_origin: 'scraped',
      phone: '800-222-3337',
    },
  ],
  schoolDistricts: [{
    name: 'Verified District',
    source_url: 'https://district.example.edu/special-education',
    website: 'https://district.example.edu/special-education',
    verification_status: 'official_verified',
    data_origin: 'scraped',
    spec_ed_contact_phone: '800-222-3338',
  }],
});

assert.equal(countyTruthWithAgingOnlyOffice.publicSafe, false);
assert.equal(countyTruthWithAgingOnlyOffice.blockers.includes('missing_public_ihss_office'), true);

console.log('public record display status gating tests passed');
