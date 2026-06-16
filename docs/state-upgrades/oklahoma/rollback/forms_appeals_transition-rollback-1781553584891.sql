-- Rollback Script for State: Oklahoma | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:59:44.917Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 116;

COMMIT;
