-- Rollback Script for State: Rhode Island | Phase: benefits_hhs
-- Generated At: 2026-06-14T15:40:36.683Z

BEGIN TRANSACTION;

DELETE FROM county_offices WHERE id = 'off-washington-ri-medicaid';
UPDATE county_offices SET county_id = 'providence-ri', program_id = 'ri-medicaid', office_name = 'Providence Medicaid Office', address = '100 Main St, Providence, RI 99999', phone = '(800) 555-0250', email = 'medicaid@providence-ri.gov', website = 'https://medicaid.providence-ri.gov', source_url = 'https://medicaid.providence-ri.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.570Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-providence-ri-medicaid';
DELETE FROM county_offices WHERE id = 'off-newport-ri-medicaid';
UPDATE county_offices SET county_id = 'kent-ri', program_id = 'ri-medicaid', office_name = 'Kent Medicaid Office', address = '100 Main St, Kent, RI 99999', phone = '(800) 555-0250', email = 'medicaid@kent-ri.gov', website = 'https://medicaid.kent-ri.gov', source_url = 'https://medicaid.kent-ri.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.570Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-kent-ri-medicaid';
DELETE FROM county_offices WHERE id = 'off-bristol-ri-medicaid';

COMMIT;
