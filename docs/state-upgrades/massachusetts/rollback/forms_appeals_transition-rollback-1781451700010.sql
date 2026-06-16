-- Rollback Script for State: Massachusetts | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:41:40.019Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 41;

COMMIT;
