-- Rollback Script for State: Minnesota | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:38:36.450Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 111;

COMMIT;
