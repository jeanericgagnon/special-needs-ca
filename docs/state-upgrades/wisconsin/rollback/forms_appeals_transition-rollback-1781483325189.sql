-- Rollback Script for State: Wisconsin | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:28:45.210Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 105;

COMMIT;
