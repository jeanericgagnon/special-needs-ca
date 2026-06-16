-- Rollback Script for State: Michigan | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T20:06:26.243Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 119;

COMMIT;
