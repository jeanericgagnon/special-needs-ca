-- Rollback Script for State: Georgia | Phase: forms_appeals_transition
-- Generated At: 2026-06-13T21:28:31.638Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 24;

COMMIT;
