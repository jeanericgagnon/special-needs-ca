-- Rollback Script for State: Alaska | Phase: benefits_hhs
-- Generated At: 2026-06-14T15:42:41.406Z

BEGIN TRANSACTION;

DELETE FROM county_offices WHERE id = 'off-yakutat-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-wrangell-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-unorganized-borough-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-skagway-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-sitka-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-petersburg-borough-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-northwest-arctic-borough-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-north-slope-borough-ak-medicaid';
UPDATE county_offices SET county_id = 'matanuska-susitna-borough-ak', program_id = 'ak-medicaid', office_name = 'Matanuska-Susitna Borough Medicaid Office', address = '100 Main St, Matanuska-Susitna Borough, AK 99999', phone = '(800) 555-0250', email = 'medicaid@matanuska-susitna-borough-ak.gov', website = 'https://medicaid.matanuska-susitna-borough-ak.gov', source_url = 'https://medicaid.matanuska-susitna-borough-ak.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.535Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-matanuska-susitna-borough-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-lake-and-peninsula-borough-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-kodiak-island-borough-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-ketchikan-gateway-borough-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-kenai-peninsula-borough-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-juneau-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-haines-borough-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-fairbanks-north-star-borough-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-denali-borough-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-bristol-bay-borough-ak-medicaid';
UPDATE county_offices SET county_id = 'anchorage-ak', program_id = 'ak-medicaid', office_name = 'Anchorage Medicaid Office', address = '100 Main St, Anchorage, AK 99999', phone = '(800) 555-0250', email = 'medicaid@anchorage-ak.gov', website = 'https://medicaid.anchorage-ak.gov', source_url = 'https://medicaid.anchorage-ak.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.535Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-anchorage-ak-medicaid';
DELETE FROM county_offices WHERE id = 'off-aleutians-east-borough-ak-medicaid';

COMMIT;
