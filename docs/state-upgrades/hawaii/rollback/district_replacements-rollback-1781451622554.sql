-- Rollback Script for State: Hawaii | Phase: district_replacements
-- Generated At: 2026-06-14T15:40:22.565Z

BEGIN TRANSACTION;

DELETE FROM school_districts WHERE id = 'sd-maui-hi';
INSERT INTO school_districts (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, total_enrollment, special_ed_pct, inclusion_rate_pct, self_contained_rate_pct, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score, evidence_level) VALUES ('sd-maui-hi-fallback', 'maui-hi', 'Maui County School District Special Education', '(800) 555-0199', 'sped-fallback@maui-hi.gov', 'https://www.hawaii-education.gov', 5000, 12, 60, 20, 'https://www.hawaii-education.gov', 'official', 'programmatic_fallback', 'generated_county_fallback', '2026-06-12', '2026-06-13T02:29:27.540Z', 3, NULL);
UPDATE school_districts SET id = 'sd-maui-hi-fallback' WHERE id = 'sd-maui-hi';
DELETE FROM school_districts WHERE id = 'sd-kauai-hi';
INSERT INTO school_districts (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, total_enrollment, special_ed_pct, inclusion_rate_pct, self_contained_rate_pct, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score, evidence_level) VALUES ('sd-kauai-hi-fallback', 'kauai-hi', 'Kauai County School District Special Education', '(800) 555-0199', 'sped-fallback@kauai-hi.gov', 'https://www.hawaii-education.gov', 5000, 12, 60, 20, 'https://www.hawaii-education.gov', 'official', 'programmatic_fallback', 'generated_county_fallback', '2026-06-12', '2026-06-13T02:29:27.540Z', 3, NULL);
UPDATE school_districts SET id = 'sd-kauai-hi-fallback' WHERE id = 'sd-kauai-hi';
DELETE FROM school_districts WHERE id = 'sd-kalawao-hi';
INSERT INTO school_districts (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, total_enrollment, special_ed_pct, inclusion_rate_pct, self_contained_rate_pct, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score, evidence_level) VALUES ('sd-kalawao-hi-fallback', 'kalawao-hi', 'Kalawao County School District Special Education', '(800) 555-0199', 'sped-fallback@kalawao-hi.gov', 'https://www.hawaii-education.gov', 5000, 12, 60, 20, 'https://www.hawaii-education.gov', 'official', 'programmatic_fallback', 'generated_county_fallback', '2026-06-12', '2026-06-13T02:29:27.540Z', 3, NULL);
UPDATE school_districts SET id = 'sd-kalawao-hi-fallback' WHERE id = 'sd-kalawao-hi';

COMMIT;
