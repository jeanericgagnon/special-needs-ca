-- Rollback Script for State: Wisconsin | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:49:44.673Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 62;

COMMIT;
