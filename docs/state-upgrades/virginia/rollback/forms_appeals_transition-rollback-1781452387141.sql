-- Rollback Script for State: Virginia | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:53:07.153Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 72;

COMMIT;
