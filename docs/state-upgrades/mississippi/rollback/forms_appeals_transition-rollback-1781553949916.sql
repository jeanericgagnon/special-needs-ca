-- Rollback Script for State: Mississippi | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T20:05:49.932Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 118;

COMMIT;
