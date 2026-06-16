-- Rollback Script for State: South Carolina | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:47:10.929Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 54;

COMMIT;
