-- Rollback Script for State: Idaho | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:04:20.688Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 96;

COMMIT;
