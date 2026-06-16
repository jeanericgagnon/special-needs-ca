-- Rollback Script for State: North Carolina | Phase: forms_appeals_transition
-- Generated At: 2026-06-13T21:28:32.235Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 25;

COMMIT;
