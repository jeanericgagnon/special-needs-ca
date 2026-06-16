-- Rollback Script for State: North Dakota | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:54:29.770Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 107;

COMMIT;
