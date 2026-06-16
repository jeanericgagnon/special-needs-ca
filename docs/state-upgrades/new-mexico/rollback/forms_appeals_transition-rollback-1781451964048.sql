-- Rollback Script for State: New Mexico | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:46:04.056Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 50;

COMMIT;
