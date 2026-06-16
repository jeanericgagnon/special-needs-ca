-- Rollback Script for State: Nevada | Phase: trusted_nonprofits
-- Generated At: 2026-06-15T21:54:31.783Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-white-pine-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-white-pine-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-white-pine-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-washoe-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-washoe-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-washoe-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-storey-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-storey-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-storey-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-pershing-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-pershing-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-pershing-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-nye-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-nye-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-nye-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-mineral-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-mineral-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-mineral-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-lyon-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-lyon-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-lyon-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-lincoln-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-lincoln-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-lincoln-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-lander-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-lander-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-lander-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-humboldt-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-humboldt-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-humboldt-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-eureka-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-eureka-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-eureka-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-esmeralda-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-esmeralda-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-esmeralda-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-elko-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-elko-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-elko-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-douglas-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-douglas-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-douglas-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-clark-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-clark-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-clark-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-churchill-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-churchill-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-churchill-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-parent-carson-city-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-arc-carson-city-nv';
DELETE FROM nonprofit_organizations WHERE id = 'ne-np-rights-carson-city-nv';

COMMIT;
