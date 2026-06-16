-- Rollback Script for State: West Virginia | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T15:47:47.612Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 56;

COMMIT;
