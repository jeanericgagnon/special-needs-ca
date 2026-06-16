-- Rollback Script for State: Iowa | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:53:27.567Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 73;

COMMIT;
