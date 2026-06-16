-- Rollback Script for State: Montana | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:25:19.366Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 100;

COMMIT;
