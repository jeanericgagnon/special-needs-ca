-- Rollback Script for State: Pennsylvania | Phase: forms_appeals_transition
-- Generated At: 2026-06-13T21:28:30.407Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 22;

COMMIT;
