-- Rollback Script for State: Kansas | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:53:48.354Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 74;

COMMIT;
