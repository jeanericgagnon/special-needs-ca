-- Rollback Script for State: Louisiana | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:48:45.265Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 59;

COMMIT;
