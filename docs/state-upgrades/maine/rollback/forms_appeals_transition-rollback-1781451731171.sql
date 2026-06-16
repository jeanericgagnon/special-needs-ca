-- Rollback Script for State: Maine | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:42:11.183Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 43;

COMMIT;
