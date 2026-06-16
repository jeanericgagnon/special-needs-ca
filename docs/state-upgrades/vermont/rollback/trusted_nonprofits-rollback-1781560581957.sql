-- Rollback Script for State: Vermont | Phase: trusted_nonprofits
-- Generated At: 2026-06-15T21:56:21.976Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 've-np-parent-windsor-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-arc-windsor-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-rights-windsor-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-parent-windham-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-arc-windham-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-rights-windham-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-parent-washington-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-arc-washington-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-rights-washington-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-parent-rutland-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-arc-rutland-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-rights-rutland-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-parent-orleans-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-arc-orleans-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-rights-orleans-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-parent-orange-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-arc-orange-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-rights-orange-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-parent-lamoille-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-arc-lamoille-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-rights-lamoille-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-parent-grand-isle-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-arc-grand-isle-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-rights-grand-isle-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-parent-franklin-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-arc-franklin-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-rights-franklin-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-parent-essex-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-arc-essex-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-rights-essex-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-parent-chittenden-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-arc-chittenden-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-rights-chittenden-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-parent-caledonia-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-arc-caledonia-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-rights-caledonia-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-parent-bennington-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-arc-bennington-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-rights-bennington-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-parent-addison-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-arc-addison-vt';
DELETE FROM nonprofit_organizations WHERE id = 've-np-rights-addison-vt';

COMMIT;
