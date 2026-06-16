-- Rollback Script for State: Oregon | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:02:12.600Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 94;

COMMIT;
