-- Rollback Script for State: Alabama | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:28:05.676Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 104;

COMMIT;
