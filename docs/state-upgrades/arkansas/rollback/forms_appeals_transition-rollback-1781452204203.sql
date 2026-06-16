-- Rollback Script for State: Arkansas | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:50:04.213Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 63;

COMMIT;
