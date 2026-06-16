-- Rollback Script for State: New Jersey | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T01:50:31.968Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 84;

COMMIT;
