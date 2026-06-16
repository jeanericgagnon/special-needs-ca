-- Rollback Script for State: Delaware | Phase: district_replacements
-- Generated At: 2026-06-14T15:40:07.703Z

BEGIN TRANSACTION;

DELETE FROM school_districts WHERE id = 'sd-kent-de';
INSERT INTO school_districts (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, total_enrollment, special_ed_pct, inclusion_rate_pct, self_contained_rate_pct, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score, evidence_level) VALUES ('sd-kent-de-fallback', 'kent-de', 'Kent County School District Special Education', '(800) 555-0199', 'sped-fallback@kent-de.gov', 'https://www.delaware-education.gov', 5000, 12, 60, 20, 'https://www.delaware-education.gov', 'official', 'programmatic_fallback', 'generated_county_fallback', '2026-06-12', '2026-06-13T02:29:27.540Z', 3, NULL);
UPDATE school_districts SET id = 'sd-kent-de-fallback' WHERE id = 'sd-kent-de';

COMMIT;
