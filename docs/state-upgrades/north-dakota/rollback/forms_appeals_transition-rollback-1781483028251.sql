-- Rollback Script for State: North Dakota | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:23:48.285Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 98;

COMMIT;
