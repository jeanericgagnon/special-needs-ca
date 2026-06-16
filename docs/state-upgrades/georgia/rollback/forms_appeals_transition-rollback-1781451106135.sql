-- Rollback Script for State: Georgia | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:31:46.144Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 34;

COMMIT;
