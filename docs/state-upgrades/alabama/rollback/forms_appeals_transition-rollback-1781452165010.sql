-- Rollback Script for State: Alabama | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:49:25.021Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 61;

COMMIT;
