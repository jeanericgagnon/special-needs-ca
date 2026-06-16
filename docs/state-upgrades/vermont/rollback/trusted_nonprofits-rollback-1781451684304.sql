-- Rollback Script for State: Vermont | Phase: trusted_nonprofits
-- Generated At: 2026-06-14T15:41:24.314Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'np-local-rutland-vt';
DELETE FROM nonprofit_organizations WHERE id = 'np-local-chittenden-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-arc-windsor-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-arc-windham-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-arc-washington-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-arc-rutland-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-arc-orleans-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-arc-orange-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-arc-lamoille-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-arc-grand-isle-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-arc-franklin-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-arc-essex-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-arc-chittenden-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-arc-caledonia-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-arc-bennington-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-arc-addison-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-parent-windsor-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-parent-windham-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-parent-washington-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-parent-rutland-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-parent-orleans-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-parent-orange-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-parent-lamoille-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-parent-grand-isle-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-parent-franklin-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-parent-essex-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-parent-chittenden-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-parent-caledonia-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-parent-bennington-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-parent-addison-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-rights-windsor-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-rights-windham-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-rights-washington-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-rights-rutland-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-rights-orleans-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-rights-orange-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-rights-lamoille-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-rights-grand-isle-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-rights-franklin-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-rights-essex-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-rights-chittenden-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-rights-caledonia-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-rights-bennington-vt';
DELETE FROM nonprofit_organizations WHERE id = 'vt-np-rights-addison-vt';

COMMIT;
