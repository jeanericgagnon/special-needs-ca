-- Rollback Script for State: Nebraska | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:52:26.129Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 70;

COMMIT;
