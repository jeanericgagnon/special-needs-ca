-- Rollback Script for State: North Carolina | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T20:05:17.873Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 117;

COMMIT;
