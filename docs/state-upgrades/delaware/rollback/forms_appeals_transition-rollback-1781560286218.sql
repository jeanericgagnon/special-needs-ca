-- Rollback Script for State: Delaware | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:51:26.232Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 129;

COMMIT;
