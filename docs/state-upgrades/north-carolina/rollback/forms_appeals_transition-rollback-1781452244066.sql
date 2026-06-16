-- Rollback Script for State: North Carolina | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:50:44.078Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 65;

COMMIT;
