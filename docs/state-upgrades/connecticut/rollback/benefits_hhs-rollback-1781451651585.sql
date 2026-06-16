-- Rollback Script for State: Connecticut | Phase: benefits_hhs
-- Generated At: 2026-06-14T15:40:51.597Z

BEGIN TRANSACTION;

DELETE FROM county_offices WHERE id = 'off-windham-ct-medicaid';
DELETE FROM county_offices WHERE id = 'off-tolland-ct-medicaid';
DELETE FROM county_offices WHERE id = 'off-new-london-ct-medicaid';
DELETE FROM county_offices WHERE id = 'off-new-haven-ct-medicaid';
DELETE FROM county_offices WHERE id = 'off-middlesex-ct-medicaid';
DELETE FROM county_offices WHERE id = 'off-litchfield-ct-medicaid';
UPDATE county_offices SET county_id = 'hartford-ct', program_id = 'ct-medicaid', office_name = 'Hartford Medicaid Office', address = '100 Main St, Hartford, CT 99999', phone = '(800) 555-0250', email = 'medicaid@hartford-ct.gov', website = 'https://medicaid.hartford-ct.gov', source_url = 'https://medicaid.hartford-ct.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.539Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-hartford-ct-medicaid';
UPDATE county_offices SET county_id = 'fairfield-ct', program_id = 'ct-medicaid', office_name = 'Fairfield Medicaid Office', address = '100 Main St, Fairfield, CT 99999', phone = '(800) 555-0250', email = 'medicaid@fairfield-ct.gov', website = 'https://medicaid.fairfield-ct.gov', source_url = 'https://medicaid.fairfield-ct.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.539Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-fairfield-ct-medicaid';

COMMIT;
