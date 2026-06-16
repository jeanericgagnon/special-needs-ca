-- Rollback Script for State: New Hampshire | Phase: trusted_nonprofits
-- Generated At: 2026-06-14T15:41:09.056Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'np-local-rockingham-nh';
DELETE FROM nonprofit_organizations WHERE id = 'np-local-hillsborough-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-arc-sullivan-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-arc-strafford-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-arc-rockingham-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-arc-merrimack-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-arc-hillsborough-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-arc-grafton-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-arc-co-s-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-arc-cheshire-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-arc-carroll-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-arc-belknap-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-parent-sullivan-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-parent-strafford-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-parent-rockingham-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-parent-merrimack-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-parent-hillsborough-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-parent-grafton-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-parent-co-s-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-parent-cheshire-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-parent-carroll-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-parent-belknap-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-rights-sullivan-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-rights-strafford-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-rights-rockingham-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-rights-merrimack-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-rights-hillsborough-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-rights-grafton-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-rights-co-s-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-rights-cheshire-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-rights-carroll-nh';
DELETE FROM nonprofit_organizations WHERE id = 'nh-np-rights-belknap-nh';

COMMIT;
