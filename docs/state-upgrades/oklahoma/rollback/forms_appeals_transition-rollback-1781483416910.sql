-- Rollback Script for State: Oklahoma | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:30:16.953Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 107;

COMMIT;
