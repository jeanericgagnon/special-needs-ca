-- Rollback Script for State: Pennsylvania | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T02:18:41.577Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 28;
DELETE FROM staging_scraped_forms WHERE id = 27;
DELETE FROM staging_scraped_forms WHERE id = 26;
DELETE FROM staging_scraped_forms WHERE id = 25;
DELETE FROM staging_scraped_forms WHERE id = 24;
DELETE FROM staging_scraped_forms WHERE id = 23;
DELETE FROM staging_scraped_forms WHERE id = 22;

COMMIT;
