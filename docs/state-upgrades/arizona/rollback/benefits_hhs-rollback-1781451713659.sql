-- Rollback Script for State: Arizona | Phase: benefits_hhs
-- Generated At: 2026-06-14T15:41:53.670Z

BEGIN TRANSACTION;

DELETE FROM county_offices WHERE id = 'off-yuma-az-medicaid';
DELETE FROM county_offices WHERE id = 'off-yavapai-az-medicaid';
DELETE FROM county_offices WHERE id = 'off-santa-cruz-az-medicaid';
DELETE FROM county_offices WHERE id = 'off-pinal-az-medicaid';
UPDATE county_offices SET county_id = 'pima-az', program_id = 'az-medicaid', office_name = 'Pima Medicaid Office', address = '100 Main St, Pima, AZ 99999', phone = '(800) 555-0250', email = 'medicaid@pima-az.gov', website = 'https://medicaid.pima-az.gov', source_url = 'https://medicaid.pima-az.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.536Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-pima-az-medicaid';
DELETE FROM county_offices WHERE id = 'off-navajo-az-medicaid';
DELETE FROM county_offices WHERE id = 'off-mohave-az-medicaid';
UPDATE county_offices SET county_id = 'maricopa-az', program_id = 'az-medicaid', office_name = 'Maricopa Medicaid Office', address = '100 Main St, Maricopa, AZ 99999', phone = '(800) 555-0250', email = 'medicaid@maricopa-az.gov', website = 'https://medicaid.maricopa-az.gov', source_url = 'https://medicaid.maricopa-az.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.536Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-maricopa-az-medicaid';
DELETE FROM county_offices WHERE id = 'off-la-paz-az-medicaid';
DELETE FROM county_offices WHERE id = 'off-greenlee-az-medicaid';
DELETE FROM county_offices WHERE id = 'off-graham-az-medicaid';
DELETE FROM county_offices WHERE id = 'off-gila-az-medicaid';
DELETE FROM county_offices WHERE id = 'off-coconino-az-medicaid';
DELETE FROM county_offices WHERE id = 'off-cochise-az-medicaid';
DELETE FROM county_offices WHERE id = 'off-apache-az-medicaid';

COMMIT;
