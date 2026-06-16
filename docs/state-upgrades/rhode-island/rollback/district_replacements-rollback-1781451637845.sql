-- Rollback Script for State: Rhode Island | Phase: district_replacements
-- Generated At: 2026-06-14T15:40:37.870Z

BEGIN TRANSACTION;

DELETE FROM school_districts WHERE id = 'sd-washington-ri';
INSERT INTO school_districts (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, total_enrollment, special_ed_pct, inclusion_rate_pct, self_contained_rate_pct, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score, evidence_level) VALUES ('sd-washington-ri-fallback', 'washington-ri', 'Washington County School District Special Education', '(800) 555-0199', 'sped-fallback@washington-ri.gov', 'https://www.rhode-island-education.gov', 5000, 12, 60, 20, 'https://www.rhode-island-education.gov', 'official', 'programmatic_fallback', 'generated_county_fallback', '2026-06-12', '2026-06-13T02:29:27.570Z', 3, NULL);
UPDATE school_districts SET id = 'sd-washington-ri-fallback' WHERE id = 'sd-washington-ri';
DELETE FROM school_districts WHERE id = 'sd-newport-ri';
INSERT INTO school_districts (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, total_enrollment, special_ed_pct, inclusion_rate_pct, self_contained_rate_pct, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score, evidence_level) VALUES ('sd-newport-ri-fallback', 'newport-ri', 'Newport County School District Special Education', '(800) 555-0199', 'sped-fallback@newport-ri.gov', 'https://www.rhode-island-education.gov', 5000, 12, 60, 20, 'https://www.rhode-island-education.gov', 'official', 'programmatic_fallback', 'generated_county_fallback', '2026-06-12', '2026-06-13T02:29:27.570Z', 3, NULL);
UPDATE school_districts SET id = 'sd-newport-ri-fallback' WHERE id = 'sd-newport-ri';
DELETE FROM school_districts WHERE id = 'sd-bristol-ri';
INSERT INTO school_districts (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, total_enrollment, special_ed_pct, inclusion_rate_pct, self_contained_rate_pct, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score, evidence_level) VALUES ('sd-bristol-ri-fallback', 'bristol-ri', 'Bristol County School District Special Education', '(800) 555-0199', 'sped-fallback@bristol-ri.gov', 'https://www.rhode-island-education.gov', 5000, 12, 60, 20, 'https://www.rhode-island-education.gov', 'official', 'programmatic_fallback', 'generated_county_fallback', '2026-06-12', '2026-06-13T02:29:27.570Z', 3, NULL);
UPDATE school_districts SET id = 'sd-bristol-ri-fallback' WHERE id = 'sd-bristol-ri';

COMMIT;
