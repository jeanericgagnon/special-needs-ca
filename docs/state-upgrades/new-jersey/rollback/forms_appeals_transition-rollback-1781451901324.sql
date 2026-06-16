-- Rollback Script for State: New Jersey | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:45:01.332Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 46;

COMMIT;
