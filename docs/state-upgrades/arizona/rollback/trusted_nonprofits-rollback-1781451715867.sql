-- Rollback Script for State: Arizona | Phase: trusted_nonprofits
-- Generated At: 2026-06-14T15:41:55.883Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'np-local-pima-az';
DELETE FROM nonprofit_organizations WHERE id = 'np-local-maricopa-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-yuma-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-yavapai-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-santa-cruz-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-pinal-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-pima-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-navajo-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-mohave-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-maricopa-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-la-paz-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-greenlee-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-graham-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-gila-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-coconino-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-cochise-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-arc-apache-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-yuma-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-yavapai-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-santa-cruz-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-pinal-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-pima-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-navajo-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-mohave-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-maricopa-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-la-paz-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-greenlee-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-graham-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-gila-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-coconino-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-cochise-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-parent-apache-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-yuma-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-yavapai-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-santa-cruz-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-pinal-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-pima-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-navajo-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-mohave-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-maricopa-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-la-paz-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-greenlee-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-graham-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-gila-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-coconino-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-cochise-az';
DELETE FROM nonprofit_organizations WHERE id = 'az-np-rights-apache-az';

COMMIT;
