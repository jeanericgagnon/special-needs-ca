-- Rollback Script for State: Colorado | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:48:26.030Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 58;

COMMIT;
