-- Rollback Script for State: Delaware | Phase: district_replacements
-- Generated At: 2026-06-15T21:51:25.483Z

BEGIN TRANSACTION;

UPDATE school_districts SET county_id = 'kent-de', name = 'Kent County School District', spec_ed_contact_phone = '(302) 735-4210', spec_ed_contact_email = '', website = 'https://www.doe.k12.de.us/domain/76', total_enrollment = NULL, special_ed_pct = NULL, inclusion_rate_pct = NULL, self_contained_rate_pct = NULL, source_url = 'https://www.doe.k12.de.us/', source_type = 'official_directory', data_origin = 'scraped', verification_status = 'source_listed', last_verified_date = '2026-06-14', last_scraped_at = NULL, confidence_score = 0.85, evidence_level = 'official_locator_derived' WHERE id = 'sd-kent-de';

COMMIT;
