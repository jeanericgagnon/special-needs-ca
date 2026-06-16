-- Rollback Script for State: Washington | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:15:38.858Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 104;

COMMIT;
