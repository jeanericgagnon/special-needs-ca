-- Rollback Script for State: Michigan | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:51:24.819Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 67;

COMMIT;
