-- Rollback Script for State: Utah | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:45:47.710Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 49;

COMMIT;
