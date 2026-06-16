-- Rollback Script for State: Maine | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:53:23.079Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 134;

COMMIT;
