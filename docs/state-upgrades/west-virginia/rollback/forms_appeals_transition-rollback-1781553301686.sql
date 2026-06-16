-- Rollback Script for State: West Virginia | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:55:01.706Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 108;

COMMIT;
