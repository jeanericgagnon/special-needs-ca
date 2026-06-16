-- Rollback Script for State: New Hampshire | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:54:54.113Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 138;

COMMIT;
