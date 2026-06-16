-- Rollback Script for State: Delaware | Phase: benefits_hhs
-- Generated At: 2026-06-14T15:40:06.577Z

BEGIN TRANSACTION;

UPDATE county_offices SET county_id = 'sussex-de', program_id = 'de-medicaid', office_name = 'Sussex Medicaid Office', address = '100 Main St, Sussex, DE 99999', phone = '(800) 555-0250', email = 'medicaid@sussex-de.gov', website = 'https://medicaid.sussex-de.gov', source_url = 'https://medicaid.sussex-de.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.540Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-sussex-de-medicaid';
UPDATE county_offices SET county_id = 'new-castle-de', program_id = 'de-medicaid', office_name = 'New Castle Medicaid Office', address = '100 Main St, New Castle, DE 99999', phone = '(800) 555-0250', email = 'medicaid@new-castle-de.gov', website = 'https://medicaid.new-castle-de.gov', source_url = 'https://medicaid.new-castle-de.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.540Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-new-castle-de-medicaid';
DELETE FROM county_offices WHERE id = 'off-kent-de-medicaid';

COMMIT;
