-- Rollback Script for State: Hawaii | Phase: benefits_hhs
-- Generated At: 2026-06-14T15:40:21.418Z

BEGIN TRANSACTION;

DELETE FROM county_offices WHERE id = 'off-maui-hi-medicaid';
DELETE FROM county_offices WHERE id = 'off-kauai-hi-medicaid';
DELETE FROM county_offices WHERE id = 'off-kalawao-hi-medicaid';
UPDATE county_offices SET county_id = 'honolulu-hi', program_id = 'hi-medicaid', office_name = 'Honolulu Medicaid Office', address = '100 Main St, Honolulu, HI 99999', phone = '(800) 555-0250', email = 'medicaid@honolulu-hi.gov', website = 'https://medicaid.honolulu-hi.gov', source_url = 'https://medicaid.honolulu-hi.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.540Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-honolulu-hi-medicaid';
UPDATE county_offices SET county_id = 'hawai-i-hi', program_id = 'hi-medicaid', office_name = 'Hawai''i Medicaid Office', address = '100 Main St, Hawai''i, HI 99999', phone = '(800) 555-0250', email = 'medicaid@hawai-i-hi.gov', website = 'https://medicaid.hawai-i-hi.gov', source_url = 'https://medicaid.hawai-i-hi.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.540Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-hawai-i-hi-medicaid';

COMMIT;
