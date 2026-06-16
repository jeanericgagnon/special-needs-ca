-- Rollback Script for State: Arizona | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:49:55.543Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 126;

COMMIT;
