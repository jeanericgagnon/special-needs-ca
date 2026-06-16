-- Rollback Script for State: Louisiana | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:26:42.965Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 102;

COMMIT;
