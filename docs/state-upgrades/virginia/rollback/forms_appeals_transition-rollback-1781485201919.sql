-- Rollback Script for State: Virginia | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T01:00:01.931Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 115;

COMMIT;
