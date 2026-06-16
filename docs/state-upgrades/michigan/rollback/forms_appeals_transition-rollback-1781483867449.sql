-- Rollback Script for State: Michigan | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:37:47.474Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 110;

COMMIT;
