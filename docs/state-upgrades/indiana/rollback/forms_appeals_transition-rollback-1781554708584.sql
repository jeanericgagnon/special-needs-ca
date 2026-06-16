-- Rollback Script for State: Indiana | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T20:18:28.604Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 121;

COMMIT;
