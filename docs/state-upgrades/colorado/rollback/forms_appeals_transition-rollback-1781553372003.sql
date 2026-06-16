-- Rollback Script for State: Colorado | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T19:56:12.027Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 110;

COMMIT;
