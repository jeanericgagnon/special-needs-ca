-- Rollback Script for State: Montana | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:48:06.449Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 57;

COMMIT;
