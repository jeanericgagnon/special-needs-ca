-- Rollback Script for State: Indiana | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:52:05.400Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 69;

COMMIT;
