-- Rollback Script for State: Maine | Phase: trusted_nonprofits
-- Generated At: 2026-06-15T21:53:23.490Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-york-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-york-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-york-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-washington-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-washington-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-washington-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-waldo-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-waldo-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-waldo-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-somerset-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-somerset-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-somerset-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-sagadahoc-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-sagadahoc-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-sagadahoc-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-piscataquis-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-piscataquis-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-piscataquis-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-penobscot-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-penobscot-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-penobscot-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-oxford-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-oxford-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-oxford-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-lincoln-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-lincoln-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-lincoln-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-knox-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-knox-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-knox-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-kennebec-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-kennebec-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-kennebec-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-hancock-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-hancock-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-hancock-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-franklin-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-franklin-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-franklin-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-cumberland-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-cumberland-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-cumberland-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-aroostook-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-aroostook-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-aroostook-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-parent-androscoggin-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-arc-androscoggin-me';
DELETE FROM nonprofit_organizations WHERE id = 'ma-np-rights-androscoggin-me';

COMMIT;
