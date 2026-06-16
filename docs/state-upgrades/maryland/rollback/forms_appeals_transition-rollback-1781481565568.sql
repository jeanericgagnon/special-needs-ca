-- Rollback Script for State: Maryland | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T23:59:25.590Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 91;

COMMIT;
