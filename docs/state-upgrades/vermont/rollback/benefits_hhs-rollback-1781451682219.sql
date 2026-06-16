-- Rollback Script for State: Vermont | Phase: benefits_hhs
-- Generated At: 2026-06-14T15:41:22.233Z

BEGIN TRANSACTION;

DELETE FROM county_offices WHERE id = 'off-windsor-vt-medicaid';
DELETE FROM county_offices WHERE id = 'off-windham-vt-medicaid';
DELETE FROM county_offices WHERE id = 'off-washington-vt-medicaid';
UPDATE county_offices SET county_id = 'rutland-vt', program_id = 'vt-medicaid', office_name = 'Rutland Medicaid Office', address = '100 Main St, Rutland, VT 99999', phone = '(800) 555-0250', email = 'medicaid@rutland-vt.gov', website = 'https://medicaid.rutland-vt.gov', source_url = 'https://medicaid.rutland-vt.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.575Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-rutland-vt-medicaid';
DELETE FROM county_offices WHERE id = 'off-orleans-vt-medicaid';
DELETE FROM county_offices WHERE id = 'off-orange-vt-medicaid';
DELETE FROM county_offices WHERE id = 'off-lamoille-vt-medicaid';
DELETE FROM county_offices WHERE id = 'off-grand-isle-vt-medicaid';
DELETE FROM county_offices WHERE id = 'off-franklin-vt-medicaid';
DELETE FROM county_offices WHERE id = 'off-essex-vt-medicaid';
UPDATE county_offices SET county_id = 'chittenden-vt', program_id = 'vt-medicaid', office_name = 'Chittenden Medicaid Office', address = '100 Main St, Chittenden, VT 99999', phone = '(800) 555-0250', email = 'medicaid@chittenden-vt.gov', website = 'https://medicaid.chittenden-vt.gov', source_url = 'https://medicaid.chittenden-vt.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.575Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-chittenden-vt-medicaid';
DELETE FROM county_offices WHERE id = 'off-caledonia-vt-medicaid';
DELETE FROM county_offices WHERE id = 'off-bennington-vt-medicaid';
DELETE FROM county_offices WHERE id = 'off-addison-vt-medicaid';

COMMIT;
