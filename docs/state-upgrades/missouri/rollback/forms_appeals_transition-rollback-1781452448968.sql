-- Rollback Script for State: Missouri | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:54:08.979Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 75;

COMMIT;
