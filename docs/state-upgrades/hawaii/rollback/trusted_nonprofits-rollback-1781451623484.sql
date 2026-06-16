-- Rollback Script for State: Hawaii | Phase: trusted_nonprofits
-- Generated At: 2026-06-14T15:40:23.496Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'np-local-hawai-i-hi';
DELETE FROM nonprofit_organizations WHERE id = 'np-local-honolulu-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-arc-maui-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-arc-kauai-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-arc-kalawao-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-arc-honolulu-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-arc-hawai-i-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-parent-maui-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-parent-kauai-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-parent-kalawao-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-parent-honolulu-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-parent-hawai-i-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-rights-maui-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-rights-kauai-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-rights-kalawao-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-rights-honolulu-hi';
DELETE FROM nonprofit_organizations WHERE id = 'hi-np-rights-hawai-i-hi';

COMMIT;
