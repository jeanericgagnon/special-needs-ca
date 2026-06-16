-- Rollback Script for State: Washington | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:03:17.003Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 95;

COMMIT;
