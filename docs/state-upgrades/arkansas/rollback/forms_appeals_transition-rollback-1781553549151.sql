-- Rollback Script for State: Arkansas | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:59:09.173Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 115;

COMMIT;
