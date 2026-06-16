-- Rollback Script for State: Hawaii | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:40:23.208Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 36;

COMMIT;
