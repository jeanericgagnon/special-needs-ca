-- Rollback Script for State: South Dakota | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:49:05.718Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 60;

COMMIT;
