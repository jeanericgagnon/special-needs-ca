-- Rollback Script for State: Nebraska | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T20:25:46.589Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 123;

COMMIT;
