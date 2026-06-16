-- Rollback Script for State: Iowa | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T01:02:23.129Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 116;

COMMIT;
