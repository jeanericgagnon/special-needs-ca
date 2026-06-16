-- Rollback Script for State: Nevada | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:42:27.307Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 44;

COMMIT;
