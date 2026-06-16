-- Rollback Script for State: Louisiana | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:56:51.915Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 111;

COMMIT;
