-- Rollback Script for State: New Jersey | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T22:50:08.674Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 77;

COMMIT;
