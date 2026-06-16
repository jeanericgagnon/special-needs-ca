-- Rollback Script for State: Tennessee | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:52:46.461Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 71;

COMMIT;
