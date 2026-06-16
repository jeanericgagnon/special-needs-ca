-- Rollback Script for State: Tennessee | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T20:26:17.304Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 124;

COMMIT;
