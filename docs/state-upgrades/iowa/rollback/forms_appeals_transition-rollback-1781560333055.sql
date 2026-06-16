-- Rollback Script for State: Iowa | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T21:52:13.070Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 131;

COMMIT;
