-- Rollback Script for State: Wyoming | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:56:44.803Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 142;

COMMIT;
