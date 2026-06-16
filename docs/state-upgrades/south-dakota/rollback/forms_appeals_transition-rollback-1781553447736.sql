-- Rollback Script for State: South Dakota | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:57:27.754Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 112;

COMMIT;
