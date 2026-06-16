-- Rollback Script for State: Illinois | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T16:53:47.946Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 91;
DELETE FROM staging_scraped_forms WHERE id = 90;
DELETE FROM staging_scraped_forms WHERE id = 89;
DELETE FROM staging_scraped_forms WHERE id = 88;
DELETE FROM staging_scraped_forms WHERE id = 87;

COMMIT;
