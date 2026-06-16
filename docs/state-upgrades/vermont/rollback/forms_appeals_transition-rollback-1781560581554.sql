-- Rollback Script for State: Vermont | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:56:21.569Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 141;

COMMIT;
