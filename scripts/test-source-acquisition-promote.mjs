import assert from 'node:assert/strict';
import {
  determinePromotionDecision,
  normalizeProductionInsert,
} from './source-acquisition-promote-lib.mjs';

function testNonprofitNeedsCounty() {
  const decision = determinePromotionDecision('staging_scraped_nonprofit_organizations', {
    county_id: null,
    extracted_name: 'Example Org',
    extracted_phone: '(800) 555-1212',
    extracted_website: 'https://example.org',
  });
  assert.equal(decision.action, 'manual_review');
  assert.equal(decision.reason, 'missing_county_id_for_nonprofit');
}

function testDdRoutingNeedsPreciseMapping() {
  const decision = determinePromotionDecision('staging_scraped_state_resource_agencies', {
    state_id: 'texas',
    extracted_name: 'Texas HHS DD Office',
    extracted_phone: '(800) 555-1212',
    agency_intake_contact: '(800) 555-1212',
    early_intervention_contact: '(800) 555-1212',
    source_url: 'https://www.hhs.texas.gov/services/disability',
    extracted_website: 'https://www.hhs.texas.gov/services/disability',
    counties_served: 'texas',
  });
  assert.equal(decision.action, 'manual_review');
  assert.equal(decision.reason, 'missing_precise_county_mapping');
}

function testNonprofitInsertShape() {
  const production = normalizeProductionInsert('staging_scraped_nonprofit_organizations', {
    state_id: 'texas',
    county_id: 'travis-tx',
    extracted_name: 'Example Org',
    extracted_website: 'https://example.org',
    extracted_phone: '(800) 555-1212',
    focus_condition: 'nonprofit_support',
    source_url: 'https://example.org',
    source_type: 'lightweight_source_acquisition',
    scraped_at: '2026-06-17T00:00:00.000Z',
    confidence_score: 0.92,
  }, '2026-06-17T00:00:00.000Z');
  assert.equal(production.targetTable, 'nonprofit_organizations');
  assert.equal(production.values[1], 'Example Org');
  assert.equal(production.values[2], 'travis-tx');
}

function testProviderInsertDefaultsUnknownMediCalToFalse() {
  const production = normalizeProductionInsert('staging_scraped_resource_providers', {
    state_id: 'utah',
    county_id: 'salt-lake-ut',
    extracted_name: 'Example Provider',
    source_name: 'Example Provider Source',
    extracted_phone: '(801) 555-1212',
    extracted_email: '',
    extracted_address: '123 Main St, Salt Lake City, UT 84101',
    categories: 'providers_care',
    source_url: 'https://example.org/provider',
    source_type: 'lightweight_source_acquisition',
    scraped_at: '2026-06-18T00:00:00.000Z',
    confidence_score: 0.91,
    accepts_medi_cal: null,
  }, '2026-06-18T00:00:00.000Z');
  assert.equal(production.targetTable, 'resource_providers');
  assert.equal(production.values[7], 0);
  assert.equal(production.values[16], 'Example Provider Source');
  assert.equal(production.values[17], 'contact_provider');
  assert.equal(production.values[19], 'https://example.org/provider');
  assert.equal(production.values[20], '(801) 555-1212');
}

function testGenericHeadingGuardrails() {
  const sloganDecision = determinePromotionDecision('staging_scraped_nonprofit_organizations', {
    county_id: 'palm-beach-fl',
    extracted_name: 'A Wealth of Justice for Those Who Have Neither',
    extracted_phone: '(800) 555-1212',
    extracted_website: 'https://example.org',
  });
  assert.equal(sloganDecision.action, 'manual_review');
  assert.equal(sloganDecision.reason, 'generic_nonprofit_name');

  const agencyDecision = determinePromotionDecision('staging_scraped_state_resource_agencies', {
    state_id: 'pennsylvania',
    extracted_name: 'Public Safety',
    extracted_phone: '(800) 555-1212',
    agency_intake_contact: '(800) 555-1212',
    early_intervention_contact: '(800) 555-1212',
    source_url: 'https://www.buckscounty.gov/247/Public-Safety',
    extracted_website: 'https://www.buckscounty.gov/247/Public-Safety',
    counties_served: 'bucks-pa',
  });
  assert.equal(agencyDecision.action, 'manual_review');
  assert.equal(agencyDecision.reason, 'generic_agency_name');

  const providerDecision = determinePromotionDecision('staging_scraped_resource_providers', {
    county_id: 'shelby-tn',
    extracted_name: 'Best Place For Kids',
    extracted_address: '848 Adams Avenue, Memphis, TN 38103',
    extracted_phone: '(901) 287-5437',
    source_url: 'https://www.lebonheur.org/',
  });
  assert.equal(providerDecision.action, 'manual_review');
  assert.equal(providerDecision.reason, 'generic_provider_name');
}

function testKnowledgePromotionDecisionAndInsert() {
  const row = {
    state_id: 'national',
    slug: 'knowledge-cdc-autism-spectrum-disorder',
    title: 'About Autism Spectrum Disorder',
    summary: 'Official CDC overview covering signs, screening, and related developmental guidance.',
    content_category: 'knowledge_content',
    canonical_url: 'https://www.cdc.gov/autism/about/index.html',
    source_url: 'https://www.cdc.gov/autism/about/index.html',
    source_type: 'lightweight_source_acquisition',
    scraped_at: '2026-06-18T00:00:00.000Z',
    confidence_score: 0.95,
  };
  const decision = determinePromotionDecision('staging_scraped_knowledge_content', row);
  assert.equal(decision.action, 'promote');
  assert.equal(decision.reason, 'safe_knowledge_candidate');

  const production = normalizeProductionInsert('staging_scraped_knowledge_content', row, '2026-06-18T00:00:00.000Z');
  assert.equal(production.targetTable, 'knowledge_articles');
  assert.equal(production.targetId, 'knowledge-cdc-autism-spectrum-disorder');
  assert.equal(production.values[1], 'knowledge_content');
  assert.equal(production.values[2], 'About Autism Spectrum Disorder');
  assert.equal(production.values[3], row.summary);
  assert.equal(production.values[4], '');
  assert.equal(production.values[5], '');
  assert.equal(production.values[8], 'general');
  assert.equal(production.values[9], 'slate');
  assert.match(production.values[10], /Overview/);
  assert.equal(production.values[11], '[]');
}

testNonprofitNeedsCounty();
testDdRoutingNeedsPreciseMapping();
testNonprofitInsertShape();
testProviderInsertDefaultsUnknownMediCalToFalse();
testGenericHeadingGuardrails();
testKnowledgePromotionDecisionAndInsert();

console.log('source acquisition promotion tests passed');
