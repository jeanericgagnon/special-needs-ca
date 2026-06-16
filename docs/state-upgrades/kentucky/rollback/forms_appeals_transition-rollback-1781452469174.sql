-- Rollback Script for State: Kentucky | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:54:29.186Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 76;

COMMIT;
