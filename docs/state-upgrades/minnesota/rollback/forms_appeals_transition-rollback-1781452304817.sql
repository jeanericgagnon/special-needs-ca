-- Rollback Script for State: Minnesota | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:51:44.829Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 68;

COMMIT;
