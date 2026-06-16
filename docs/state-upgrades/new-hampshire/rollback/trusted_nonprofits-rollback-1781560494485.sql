-- Rollback Script for State: New Hampshire | Phase: trusted_nonprofits
-- Generated At: 2026-06-15T21:54:54.502Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-sullivan-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-sullivan-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-sullivan-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-strafford-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-strafford-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-strafford-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-rockingham-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-rockingham-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-rockingham-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-merrimack-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-merrimack-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-merrimack-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-hillsborough-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-hillsborough-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-hillsborough-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-grafton-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-grafton-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-grafton-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-co-s-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-co-s-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-co-s-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-cheshire-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-cheshire-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-cheshire-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-carroll-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-carroll-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-carroll-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-belknap-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-belknap-nh';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-belknap-nh';

COMMIT;
