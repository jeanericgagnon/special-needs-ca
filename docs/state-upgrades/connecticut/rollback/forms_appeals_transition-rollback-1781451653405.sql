-- Rollback Script for State: Connecticut | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:40:53.414Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 38;

COMMIT;
