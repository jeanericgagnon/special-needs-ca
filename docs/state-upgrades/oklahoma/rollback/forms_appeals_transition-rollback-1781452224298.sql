-- Rollback Script for State: Oklahoma | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:50:24.308Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 64;

COMMIT;
