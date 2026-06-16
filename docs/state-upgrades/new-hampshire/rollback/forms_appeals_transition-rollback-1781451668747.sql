-- Rollback Script for State: New Hampshire | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:41:08.763Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 39;

COMMIT;
