-- Rollback Script for State: Hawaii | Phase: trusted_nonprofits
-- Generated At: 2026-06-15T21:51:49.946Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'ha-np-parent-maui-hi';
DELETE FROM nonprofit_organizations WHERE id = 'ha-np-arc-maui-hi';
DELETE FROM nonprofit_organizations WHERE id = 'ha-np-rights-maui-hi';
DELETE FROM nonprofit_organizations WHERE id = 'ha-np-parent-kauai-hi';
DELETE FROM nonprofit_organizations WHERE id = 'ha-np-arc-kauai-hi';
DELETE FROM nonprofit_organizations WHERE id = 'ha-np-rights-kauai-hi';
DELETE FROM nonprofit_organizations WHERE id = 'ha-np-parent-kalawao-hi';
DELETE FROM nonprofit_organizations WHERE id = 'ha-np-arc-kalawao-hi';
DELETE FROM nonprofit_organizations WHERE id = 'ha-np-rights-kalawao-hi';
DELETE FROM nonprofit_organizations WHERE id = 'ha-np-parent-honolulu-hi';
DELETE FROM nonprofit_organizations WHERE id = 'ha-np-arc-honolulu-hi';
DELETE FROM nonprofit_organizations WHERE id = 'ha-np-rights-honolulu-hi';
DELETE FROM nonprofit_organizations WHERE id = 'ha-np-parent-hawai-i-hi';
DELETE FROM nonprofit_organizations WHERE id = 'ha-np-arc-hawai-i-hi';
DELETE FROM nonprofit_organizations WHERE id = 'ha-np-rights-hawai-i-hi';

COMMIT;
