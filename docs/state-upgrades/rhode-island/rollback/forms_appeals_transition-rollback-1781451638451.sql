-- Rollback Script for State: Rhode Island | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:40:38.460Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 37;

COMMIT;
