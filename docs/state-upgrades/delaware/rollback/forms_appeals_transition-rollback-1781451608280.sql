-- Rollback Script for State: Delaware | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:40:08.289Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 35;

COMMIT;
