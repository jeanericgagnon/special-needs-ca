-- Rollback Script for State: Massachusetts | Phase: trusted_nonprofits
-- Generated At: 2026-06-15T21:53:45.976Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-worcester-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-worcester-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-worcester-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-suffolk-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-suffolk-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-suffolk-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-plymouth-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-plymouth-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-plymouth-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-norfolk-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-norfolk-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-norfolk-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-nantucket-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-nantucket-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-nantucket-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-middlesex-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-middlesex-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-middlesex-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-hampshire-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-hampshire-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-hampshire-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-hampden-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-hampden-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-hampden-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-franklin-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-franklin-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-franklin-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-essex-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-essex-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-essex-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-dukes-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-dukes-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-dukes-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-bristol-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-bristol-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-bristol-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-berkshire-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-berkshire-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-berkshire-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-barnstable-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-barnstable-ma';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-barnstable-ma';

COMMIT;
