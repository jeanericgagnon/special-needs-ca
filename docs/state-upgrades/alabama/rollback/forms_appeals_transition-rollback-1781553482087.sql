-- Rollback Script for State: Alabama | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:58:02.112Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 113;

COMMIT;
