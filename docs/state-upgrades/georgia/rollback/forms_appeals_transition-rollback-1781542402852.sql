-- Rollback Script for State: Georgia | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T16:53:22.862Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 86;

COMMIT;
