-- Rollback Script for State: Kansas | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:52:37.175Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 132;

COMMIT;
