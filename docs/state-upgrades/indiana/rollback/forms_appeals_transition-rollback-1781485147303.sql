-- Rollback Script for State: Indiana | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T00:59:07.313Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 112;

COMMIT;
