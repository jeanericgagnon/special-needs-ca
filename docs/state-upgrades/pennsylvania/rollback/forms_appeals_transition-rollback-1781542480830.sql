-- Rollback Script for State: Pennsylvania | Phase: forms_appeals_transition
-- Generated At: 2026-06-15T16:54:40.841Z

BEGIN TRANSACTION;

DELETE FROM staging_scraped_forms WHERE id = 98;
DELETE FROM staging_scraped_forms WHERE id = 97;
DELETE FROM staging_scraped_forms WHERE id = 96;
DELETE FROM staging_scraped_forms WHERE id = 95;
DELETE FROM staging_scraped_forms WHERE id = 94;
DELETE FROM staging_scraped_forms WHERE id = 93;
DELETE FROM staging_scraped_forms WHERE id = 92;

COMMIT;
