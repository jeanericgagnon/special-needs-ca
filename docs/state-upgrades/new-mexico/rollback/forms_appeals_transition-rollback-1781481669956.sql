-- Rollback Script for State: New Mexico | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:01:09.981Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 93;

COMMIT;
