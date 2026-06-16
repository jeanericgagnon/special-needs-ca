-- Rollback Script for State: Wyoming | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T23:24:36.741Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 78;

COMMIT;
