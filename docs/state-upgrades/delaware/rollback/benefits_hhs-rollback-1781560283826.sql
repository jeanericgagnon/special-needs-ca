-- Rollback Script for State: Delaware | Phase: benefits_hhs
-- Generated At: 2026-06-15T21:51:23.844Z

BEGIN TRANSACTION;

UPDATE county_offices SET county_id = 'sussex-de', program_id = 'de-medicaid', office_name = 'Sussex County storefront office', address = '', phone = '(800) 372-2022', email = '', website = 'https://dhss.delaware.gov/dhss/dss/', source_url = 'https://dhss.delaware.gov/', source_type = 'official_locator', data_origin = 'scraped', verification_status = 'source_listed', last_verified_date = '2026-06-14', last_scraped_at = '2026-06-14', confidence_score = 0.85, evidence_level = 'official_locator_derived' WHERE id = 'off-sussex-de-medicaid';
UPDATE county_offices SET county_id = 'new-castle-de', program_id = 'de-medicaid', office_name = 'New Castle County storefront office', address = '', phone = '(800) 372-2022', email = '', website = 'https://dhss.delaware.gov/dhss/dss/', source_url = 'https://dhss.delaware.gov/', source_type = 'official_locator', data_origin = 'scraped', verification_status = 'source_listed', last_verified_date = '2026-06-14', last_scraped_at = '2026-06-14', confidence_score = 0.85, evidence_level = 'official_locator_derived' WHERE id = 'off-new-castle-de-medicaid';
UPDATE county_offices SET county_id = 'kent-de', program_id = 'de-medicaid', office_name = 'Kent County storefront office', address = '', phone = '(800) 372-2022', email = '', website = 'https://dhss.delaware.gov/dhss/dss/', source_url = 'https://dhss.delaware.gov/', source_type = 'official_locator', data_origin = 'scraped', verification_status = 'source_listed', last_verified_date = '2026-06-14', last_scraped_at = '2026-06-14', confidence_score = 0.85, evidence_level = 'official_locator_derived' WHERE id = 'off-kent-de-medicaid';

COMMIT;
