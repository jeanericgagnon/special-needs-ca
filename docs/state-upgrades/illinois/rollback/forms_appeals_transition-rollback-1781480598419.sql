-- Rollback Script for State: Illinois | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T23:43:18.431Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 83;
DELETE FROM staging_scraped_forms WHERE id = 82;
DELETE FROM staging_scraped_forms WHERE id = 81;
DELETE FROM staging_scraped_forms WHERE id = 80;
DELETE FROM staging_scraped_forms WHERE id = 79;

COMMIT;
