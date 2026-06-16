-- Rollback Script for State: Hawaii | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:51:49.532Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 130;

COMMIT;
