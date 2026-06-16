-- Rollback Script for State: South Carolina | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:23:01.326Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 97;

COMMIT;
