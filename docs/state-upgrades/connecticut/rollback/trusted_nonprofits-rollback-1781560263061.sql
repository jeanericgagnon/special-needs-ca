-- Rollback Script for State: Connecticut | Phase: trusted_nonprofits
-- Generated At: 2026-06-15T21:51:03.080Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'co-np-parent-windham-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-arc-windham-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-rights-windham-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-parent-tolland-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-arc-tolland-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-rights-tolland-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-parent-new-london-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-arc-new-london-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-rights-new-london-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-parent-new-haven-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-arc-new-haven-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-rights-new-haven-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-parent-middlesex-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-arc-middlesex-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-rights-middlesex-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-parent-litchfield-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-arc-litchfield-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-rights-litchfield-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-parent-hartford-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-arc-hartford-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-rights-hartford-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-parent-fairfield-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-arc-fairfield-ct';
DELETE FROM nonprofit_organizations WHERE id = 'co-np-rights-fairfield-ct';

COMMIT;
