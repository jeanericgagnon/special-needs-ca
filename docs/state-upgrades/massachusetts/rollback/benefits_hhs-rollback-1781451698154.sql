-- Rollback Script for State: Massachusetts | Phase: benefits_hhs
-- Generated At: 2026-06-14T15:41:38.167Z

BEGIN TRANSACTION;

UPDATE county_offices SET county_id = 'worcester-ma', program_id = 'ma-medicaid', office_name = 'Worcester Medicaid Office', address = '100 Main St, Worcester, MA 99999', phone = '(800) 555-0250', email = 'medicaid@worcester-ma.gov', website = 'https://medicaid.worcester-ma.gov', source_url = 'https://medicaid.worcester-ma.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.551Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-worcester-ma-medicaid';
DELETE FROM county_offices WHERE id = 'off-suffolk-ma-medicaid';
DELETE FROM county_offices WHERE id = 'off-plymouth-ma-medicaid';
DELETE FROM county_offices WHERE id = 'off-norfolk-ma-medicaid';
DELETE FROM county_offices WHERE id = 'off-nantucket-ma-medicaid';
UPDATE county_offices SET county_id = 'middlesex-ma', program_id = 'ma-medicaid', office_name = 'Middlesex Medicaid Office', address = '100 Main St, Middlesex, MA 99999', phone = '(800) 555-0250', email = 'medicaid@middlesex-ma.gov', website = 'https://medicaid.middlesex-ma.gov', source_url = 'https://medicaid.middlesex-ma.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.551Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-middlesex-ma-medicaid';
DELETE FROM county_offices WHERE id = 'off-hampshire-ma-medicaid';
DELETE FROM county_offices WHERE id = 'off-hampden-ma-medicaid';
DELETE FROM county_offices WHERE id = 'off-franklin-ma-medicaid';
DELETE FROM county_offices WHERE id = 'off-essex-ma-medicaid';
DELETE FROM county_offices WHERE id = 'off-dukes-ma-medicaid';
DELETE FROM county_offices WHERE id = 'off-bristol-ma-medicaid';
DELETE FROM county_offices WHERE id = 'off-berkshire-ma-medicaid';
DELETE FROM county_offices WHERE id = 'off-barnstable-ma-medicaid';

COMMIT;
