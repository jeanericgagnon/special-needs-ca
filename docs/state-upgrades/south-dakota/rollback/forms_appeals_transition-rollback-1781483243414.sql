-- Rollback Script for State: South Dakota | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:27:23.439Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 103;

COMMIT;
