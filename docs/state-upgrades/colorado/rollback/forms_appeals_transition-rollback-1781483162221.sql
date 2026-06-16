-- Rollback Script for State: Colorado | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:26:02.244Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 101;

COMMIT;
