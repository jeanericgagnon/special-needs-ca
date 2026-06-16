-- Rollback Script for State: Wisconsin | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:58:36.325Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 114;

COMMIT;
