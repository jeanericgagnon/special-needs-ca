-- Rollback Script for State: Maryland | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:14:12.204Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 99;

COMMIT;
