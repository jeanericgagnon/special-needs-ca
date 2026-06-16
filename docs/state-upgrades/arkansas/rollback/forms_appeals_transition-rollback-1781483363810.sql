-- Rollback Script for State: Arkansas | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:29:23.829Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 106;

COMMIT;
