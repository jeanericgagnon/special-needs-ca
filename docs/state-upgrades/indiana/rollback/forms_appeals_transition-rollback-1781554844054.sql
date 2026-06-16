-- Rollback Script for State: Indiana | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T20:20:44.218Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 122;

COMMIT;
