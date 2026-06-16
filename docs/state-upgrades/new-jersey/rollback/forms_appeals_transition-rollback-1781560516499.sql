-- Rollback Script for State: New Jersey | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:55:16.514Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 139;

COMMIT;
