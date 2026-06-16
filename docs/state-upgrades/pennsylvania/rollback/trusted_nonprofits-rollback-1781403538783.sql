-- Rollback Script for State: Pennsylvania | Phase: trusted_nonprofits
-- Generated At: 2026-06-14T02:18:58.795Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'pa-nonprofit-arc-alliance';
DELETE FROM nonprofit_organizations WHERE id = 'pa-nonprofit-tripil';
DELETE FROM nonprofit_organizations WHERE id = 'pa-nonprofit-achieva';
DELETE FROM nonprofit_organizations WHERE id = 'pa-nonprofit-cilcp';
DELETE FROM nonprofit_organizations WHERE id = 'pa-nonprofit-liberty-cil';
DELETE FROM nonprofit_organizations WHERE id = 'pa-nonprofit-arc-state';
DELETE FROM nonprofit_organizations WHERE id = 'pa-nonprofit-peal';
DELETE FROM nonprofit_organizations WHERE id = 'pa-nonprofit-drp';

COMMIT;
