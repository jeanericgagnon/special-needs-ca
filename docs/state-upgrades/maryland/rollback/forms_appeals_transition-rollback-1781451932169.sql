-- Rollback Script for State: Maryland | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:45:32.181Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 48;

COMMIT;
