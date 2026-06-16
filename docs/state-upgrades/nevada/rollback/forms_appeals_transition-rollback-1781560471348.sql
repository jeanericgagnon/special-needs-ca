-- Rollback Script for State: Nevada | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:54:31.362Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 137;

COMMIT;
