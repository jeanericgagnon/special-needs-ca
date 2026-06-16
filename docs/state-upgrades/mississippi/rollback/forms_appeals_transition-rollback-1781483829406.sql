-- Rollback Script for State: Mississippi | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:37:09.425Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 109;

COMMIT;
