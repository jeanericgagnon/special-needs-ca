-- Rollback Script for State: Wyoming | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:45:16.772Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 47;

COMMIT;
