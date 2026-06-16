-- Rollback Script for State: Pennsylvania | Phase: forms_appeals_transition
-- Generated At: 2026-06-14T23:53:55.392Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 90;
DELETE FROM staging_scraped_forms WHERE id = 89;
DELETE FROM staging_scraped_forms WHERE id = 88;
DELETE FROM staging_scraped_forms WHERE id = 87;
DELETE FROM staging_scraped_forms WHERE id = 86;
DELETE FROM staging_scraped_forms WHERE id = 85;
DELETE FROM staging_scraped_forms WHERE id = 84;

COMMIT;
