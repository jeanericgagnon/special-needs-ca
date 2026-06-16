-- Rollback Script for State: Tennessee | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:59:43.485Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 114;

COMMIT;
