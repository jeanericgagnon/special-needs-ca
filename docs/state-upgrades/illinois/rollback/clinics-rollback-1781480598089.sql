-- Rollback Script for State: Illinois | Phase: clinics
-- Generated At: 2026-06-14T23:43:18.101Z

BEGIN TRANSACTION;

DELETE FROM resource_providers WHERE id = 'clinic-hope-chicago-il';
DELETE FROM resource_providers WHERE id = 'clinic-osf-peoria-il';
DELETE FROM resource_providers WHERE id = 'clinic-carle-dev-peds-il';
DELETE FROM resource_providers WHERE id = 'clinic-uic-family-il';
DELETE FROM resource_providers WHERE id = 'clinic-rush-aarts-il';
DELETE FROM resource_providers WHERE id = 'clinic-lurie-childrens-il';

COMMIT;
