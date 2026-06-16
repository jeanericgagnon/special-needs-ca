-- Rollback Script for State: Illinois | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T14:58:58.412Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 33;
DELETE FROM staging_scraped_forms WHERE id = 32;
DELETE FROM staging_scraped_forms WHERE id = 31;
DELETE FROM staging_scraped_forms WHERE id = 30;
DELETE FROM staging_scraped_forms WHERE id = 29;

COMMIT;
