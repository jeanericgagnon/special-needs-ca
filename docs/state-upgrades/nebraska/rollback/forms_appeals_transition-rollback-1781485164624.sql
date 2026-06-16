-- Rollback Script for State: Nebraska | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:59:24.636Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 113;

COMMIT;
