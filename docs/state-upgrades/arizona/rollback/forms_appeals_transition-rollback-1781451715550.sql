-- Rollback Script for State: Arizona | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:41:55.559Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 42;

COMMIT;
