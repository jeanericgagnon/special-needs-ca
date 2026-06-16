-- Rollback Script for State: Idaho | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:46:53.201Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 53;

COMMIT;
