-- Rollback Script for State: Wyoming | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T01:51:02.039Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 85;

COMMIT;
