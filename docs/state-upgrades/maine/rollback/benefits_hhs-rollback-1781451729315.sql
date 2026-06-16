-- Rollback Script for State: Maine | Phase: benefits_hhs
-- Generated At: 2026-06-14T15:42:09.327Z

BEGIN TRANSACTION;

UPDATE county_offices SET county_id = 'york-me', program_id = 'me-medicaid', office_name = 'York Medicaid Office', address = '100 Main St, York, ME 99999', phone = '(800) 555-0250', email = 'medicaid@york-me.gov', website = 'https://medicaid.york-me.gov', source_url = 'https://medicaid.york-me.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.550Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-york-me-medicaid';
DELETE FROM county_offices WHERE id = 'off-washington-me-medicaid';
DELETE FROM county_offices WHERE id = 'off-waldo-me-medicaid';
DELETE FROM county_offices WHERE id = 'off-somerset-me-medicaid';
DELETE FROM county_offices WHERE id = 'off-sagadahoc-me-medicaid';
DELETE FROM county_offices WHERE id = 'off-piscataquis-me-medicaid';
DELETE FROM county_offices WHERE id = 'off-penobscot-me-medicaid';
DELETE FROM county_offices WHERE id = 'off-oxford-me-medicaid';
DELETE FROM county_offices WHERE id = 'off-lincoln-me-medicaid';
DELETE FROM county_offices WHERE id = 'off-knox-me-medicaid';
DELETE FROM county_offices WHERE id = 'off-kennebec-me-medicaid';
DELETE FROM county_offices WHERE id = 'off-hancock-me-medicaid';
DELETE FROM county_offices WHERE id = 'off-franklin-me-medicaid';
UPDATE county_offices SET county_id = 'cumberland-me', program_id = 'me-medicaid', office_name = 'Cumberland Medicaid Office', address = '100 Main St, Cumberland, ME 99999', phone = '(800) 555-0250', email = 'medicaid@cumberland-me.gov', website = 'https://medicaid.cumberland-me.gov', source_url = 'https://medicaid.cumberland-me.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.550Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-cumberland-me-medicaid';
DELETE FROM county_offices WHERE id = 'off-aroostook-me-medicaid';
DELETE FROM county_offices WHERE id = 'off-androscoggin-me-medicaid';

COMMIT;
