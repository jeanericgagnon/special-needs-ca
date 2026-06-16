-- Rollback Script for State: Connecticut | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:51:02.645Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 128;

COMMIT;
