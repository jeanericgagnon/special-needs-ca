-- Rollback Script for State: Oregon | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:46:20.378Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 51;

COMMIT;
