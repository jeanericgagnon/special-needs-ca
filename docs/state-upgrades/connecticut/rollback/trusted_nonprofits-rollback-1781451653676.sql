-- Rollback Script for State: Connecticut | Phase: trusted_nonprofits
-- Generated At: 2026-06-14T15:40:53.688Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'np-local-hartford-ct';
DELETE FROM nonprofit_organizations WHERE id = 'np-local-fairfield-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-arc-windham-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-arc-tolland-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-arc-new-london-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-arc-new-haven-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-arc-middlesex-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-arc-litchfield-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-arc-hartford-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-arc-fairfield-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-parent-windham-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-parent-tolland-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-parent-new-london-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-parent-new-haven-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-parent-middlesex-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-parent-litchfield-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-parent-hartford-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-parent-fairfield-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-rights-windham-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-rights-tolland-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-rights-new-london-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-rights-new-haven-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-rights-middlesex-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-rights-litchfield-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-rights-hartford-ct';
DELETE FROM nonprofit_organizations WHERE id = 'ct-np-rights-fairfield-ct';

COMMIT;
