-- Rollback Script for State: Utah | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:14:39.369Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 101;

COMMIT;
