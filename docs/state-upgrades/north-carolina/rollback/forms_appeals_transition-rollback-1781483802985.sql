-- Rollback Script for State: North Carolina | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:36:42.995Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 108;

COMMIT;
