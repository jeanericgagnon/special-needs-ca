-- Rollback Script for State: New Mexico | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:14:58.351Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 102;

COMMIT;
