-- Rollback Script for State: Idaho | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:16:14.433Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 105;

COMMIT;
