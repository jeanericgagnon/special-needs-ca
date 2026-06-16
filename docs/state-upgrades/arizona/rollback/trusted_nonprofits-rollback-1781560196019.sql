-- Rollback Script for State: Arizona | Phase: trusted_nonprofits
-- Generated At: 2026-06-15T21:49:56.046Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-yuma-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-yuma-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-yuma-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-yavapai-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-yavapai-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-yavapai-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-santa-cruz-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-santa-cruz-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-santa-cruz-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-pinal-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-pinal-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-pinal-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-pima-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-pima-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-pima-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-navajo-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-navajo-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-navajo-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-mohave-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-mohave-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-mohave-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-maricopa-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-maricopa-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-maricopa-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-la-paz-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-la-paz-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-la-paz-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-greenlee-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-greenlee-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-greenlee-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-graham-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-graham-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-graham-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-gila-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-gila-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-gila-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-coconino-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-coconino-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-coconino-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-cochise-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-cochise-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-cochise-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-parent-apache-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-arc-apache-az';
DELETE FROM nonprofit_organizations WHERE id = 'ar-np-rights-apache-az';

COMMIT;
