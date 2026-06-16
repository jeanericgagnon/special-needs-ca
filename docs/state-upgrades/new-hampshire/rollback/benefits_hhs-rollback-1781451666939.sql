-- Rollback Script for State: New Hampshire | Phase: benefits_hhs
-- Generated At: 2026-06-14T15:41:06.952Z

BEGIN TRANSACTION;

DELETE FROM county_offices WHERE id = 'off-sullivan-nh-medicaid';
DELETE FROM county_offices WHERE id = 'off-strafford-nh-medicaid';
UPDATE county_offices SET county_id = 'rockingham-nh', program_id = 'nh-medicaid', office_name = 'Rockingham Medicaid Office', address = '100 Main St, Rockingham, NH 99999', phone = '(800) 555-0250', email = 'medicaid@rockingham-nh.gov', website = 'https://medicaid.rockingham-nh.gov', source_url = 'https://medicaid.rockingham-nh.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.562Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-rockingham-nh-medicaid';
DELETE FROM county_offices WHERE id = 'off-merrimack-nh-medicaid';
UPDATE county_offices SET county_id = 'hillsborough-nh', program_id = 'nh-medicaid', office_name = 'Hillsborough Medicaid Office', address = '100 Main St, Hillsborough, NH 99999', phone = '(800) 555-0250', email = 'medicaid@hillsborough-nh.gov', website = 'https://medicaid.hillsborough-nh.gov', source_url = 'https://medicaid.hillsborough-nh.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.562Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-hillsborough-nh-medicaid';
DELETE FROM county_offices WHERE id = 'off-grafton-nh-medicaid';
DELETE FROM county_offices WHERE id = 'off-co-s-nh-medicaid';
DELETE FROM county_offices WHERE id = 'off-cheshire-nh-medicaid';
DELETE FROM county_offices WHERE id = 'off-carroll-nh-medicaid';
DELETE FROM county_offices WHERE id = 'off-belknap-nh-medicaid';

COMMIT;
