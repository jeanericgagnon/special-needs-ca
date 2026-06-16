-- Rollback Script for State: Montana | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:55:33.933Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 109;

COMMIT;
