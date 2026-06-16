-- Rollback Script for State: Rhode Island | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:55:55.435Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 140;

COMMIT;
