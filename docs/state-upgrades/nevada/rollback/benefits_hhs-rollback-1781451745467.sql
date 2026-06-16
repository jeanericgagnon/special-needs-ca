-- Rollback Script for State: Nevada | Phase: benefits_hhs
-- Generated At: 2026-06-14T15:42:25.480Z

BEGIN TRANSACTION;

DELETE FROM county_offices WHERE id = 'off-white-pine-nv-medicaid';
UPDATE county_offices SET county_id = 'washoe-nv', program_id = 'nv-medicaid', office_name = 'Washoe Medicaid Office', address = '100 Main St, Washoe, NV 99999', phone = '(800) 555-0250', email = 'medicaid@washoe-nv.gov', website = 'https://medicaid.washoe-nv.gov', source_url = 'https://medicaid.washoe-nv.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.562Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-washoe-nv-medicaid';
DELETE FROM county_offices WHERE id = 'off-storey-nv-medicaid';
DELETE FROM county_offices WHERE id = 'off-pershing-nv-medicaid';
DELETE FROM county_offices WHERE id = 'off-nye-nv-medicaid';
DELETE FROM county_offices WHERE id = 'off-mineral-nv-medicaid';
DELETE FROM county_offices WHERE id = 'off-lyon-nv-medicaid';
DELETE FROM county_offices WHERE id = 'off-lincoln-nv-medicaid';
DELETE FROM county_offices WHERE id = 'off-lander-nv-medicaid';
DELETE FROM county_offices WHERE id = 'off-humboldt-nv-medicaid';
DELETE FROM county_offices WHERE id = 'off-eureka-nv-medicaid';
DELETE FROM county_offices WHERE id = 'off-esmeralda-nv-medicaid';
DELETE FROM county_offices WHERE id = 'off-elko-nv-medicaid';
DELETE FROM county_offices WHERE id = 'off-douglas-nv-medicaid';
UPDATE county_offices SET county_id = 'clark-nv', program_id = 'nv-medicaid', office_name = 'Clark Medicaid Office', address = '100 Main St, Clark, NV 99999', phone = '(800) 555-0250', email = 'medicaid@clark-nv.gov', website = 'https://medicaid.clark-nv.gov', source_url = 'https://medicaid.clark-nv.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_verified_date = '2026-06-12', last_scraped_at = '2026-06-13T02:29:27.562Z', confidence_score = 5, evidence_level = NULL WHERE id = 'off-clark-nv-medicaid';
DELETE FROM county_offices WHERE id = 'off-churchill-nv-medicaid';
DELETE FROM county_offices WHERE id = 'off-carson-city-nv-medicaid';

COMMIT;
