-- Rollback Script for State: Pennsylvania | Phase: clinics
-- Generated At: 2026-06-14T02:18:35.797Z

BEGIN TRANSACTION;

DELETE FROM resource_providers WHERE id = 'pa-clinic-temple';
DELETE FROM resource_providers WHERE id = 'pa-clinic-st-christophers';
DELETE FROM resource_providers WHERE id = 'pa-clinic-chop-kop';
DELETE FROM resource_providers WHERE id = 'pa-clinic-geisinger';
DELETE FROM resource_providers WHERE id = 'pa-clinic-psu';
DELETE FROM resource_providers WHERE id = 'pa-clinic-upmc';
DELETE FROM resource_providers WHERE id = 'pa-clinic-chop';

COMMIT;
