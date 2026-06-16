-- Rollback Script for State: Kentucky | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:53:00.607Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 133;

COMMIT;
