-- Rollback Script for State: West Virginia | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:24:36.094Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 99;

COMMIT;
