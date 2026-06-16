-- Rollback Script for State: Vermont | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:41:24.047Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 40;

COMMIT;
