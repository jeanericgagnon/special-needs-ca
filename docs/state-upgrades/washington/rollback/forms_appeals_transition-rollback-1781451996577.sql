-- Rollback Script for State: Washington | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:46:36.586Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 52;

COMMIT;
