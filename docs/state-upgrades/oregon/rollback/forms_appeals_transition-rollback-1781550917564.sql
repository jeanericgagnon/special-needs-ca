-- Rollback Script for State: Oregon | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:15:17.575Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 103;

COMMIT;
