-- Rollback Script for State: Alaska | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:50:33.372Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 127;

COMMIT;
