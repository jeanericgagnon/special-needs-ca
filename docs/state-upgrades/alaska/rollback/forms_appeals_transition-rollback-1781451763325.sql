-- Rollback Script for State: Alaska | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:42:43.335Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 45;

COMMIT;
