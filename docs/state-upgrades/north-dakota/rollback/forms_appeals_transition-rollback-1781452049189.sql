-- Rollback Script for State: North Dakota | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:47:29.197Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 55;

COMMIT;
