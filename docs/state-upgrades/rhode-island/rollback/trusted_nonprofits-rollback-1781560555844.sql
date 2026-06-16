-- Rollback Script for State: Rhode Island | Phase: trusted_nonprofits
-- Generated At: 2026-06-15T21:55:55.863Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'rh-np-parent-washington-ri';
DELETE FROM nonprofit_organizations WHERE id = 'rh-np-arc-washington-ri';
DELETE FROM nonprofit_organizations WHERE id = 'rh-np-rights-washington-ri';
DELETE FROM nonprofit_organizations WHERE id = 'rh-np-parent-providence-ri';
DELETE FROM nonprofit_organizations WHERE id = 'rh-np-arc-providence-ri';
DELETE FROM nonprofit_organizations WHERE id = 'rh-np-rights-providence-ri';
DELETE FROM nonprofit_organizations WHERE id = 'rh-np-parent-newport-ri';
DELETE FROM nonprofit_organizations WHERE id = 'rh-np-arc-newport-ri';
DELETE FROM nonprofit_organizations WHERE id = 'rh-np-rights-newport-ri';
DELETE FROM nonprofit_organizations WHERE id = 'rh-np-parent-kent-ri';
DELETE FROM nonprofit_organizations WHERE id = 'rh-np-arc-kent-ri';
DELETE FROM nonprofit_organizations WHERE id = 'rh-np-rights-kent-ri';
DELETE FROM nonprofit_organizations WHERE id = 'rh-np-parent-bristol-ri';
DELETE FROM nonprofit_organizations WHERE id = 'rh-np-arc-bristol-ri';
DELETE FROM nonprofit_organizations WHERE id = 'rh-np-rights-bristol-ri';

COMMIT;
