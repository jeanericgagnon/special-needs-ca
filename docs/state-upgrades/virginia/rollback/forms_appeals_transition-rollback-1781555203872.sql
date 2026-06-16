-- Rollback Script for State: Virginia | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T20:26:43.885Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 125;

COMMIT;
