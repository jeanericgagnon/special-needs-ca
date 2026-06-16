-- Rollback Script for State: Rhode Island | Phase: trusted_nonprofits
-- Generated At: 2026-06-14T15:40:38.746Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'np-local-kent-ri';
DELETE FROM nonprofit_organizations WHERE id = 'np-local-providence-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-arc-washington-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-arc-providence-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-arc-newport-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-arc-kent-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-arc-bristol-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-parent-washington-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-parent-providence-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-parent-newport-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-parent-kent-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-parent-bristol-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-rights-washington-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-rights-providence-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-rights-newport-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-rights-kent-ri';
DELETE FROM nonprofit_organizations WHERE id = 'ri-np-rights-bristol-ri';

COMMIT;
