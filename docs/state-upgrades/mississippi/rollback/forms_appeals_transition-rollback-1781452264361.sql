-- Rollback Script for State: Mississippi | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:51:04.372Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 66;

COMMIT;
