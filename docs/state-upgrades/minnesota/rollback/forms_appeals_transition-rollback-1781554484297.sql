-- Rollback Script for State: Minnesota | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T20:14:44.333Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 120;

COMMIT;
