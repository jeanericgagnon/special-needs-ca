-- Rollback Script for State: Maine | Phase: trusted_nonprofits
-- Generated At: 2026-06-14T15:42:11.476Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'np-local-york-me';
DELETE FROM nonprofit_organizations WHERE id = 'np-local-cumberland-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-york-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-washington-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-waldo-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-somerset-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-sagadahoc-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-piscataquis-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-penobscot-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-oxford-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-lincoln-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-knox-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-kennebec-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-hancock-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-franklin-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-cumberland-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-aroostook-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-arc-androscoggin-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-york-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-washington-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-waldo-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-somerset-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-sagadahoc-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-piscataquis-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-penobscot-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-oxford-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-lincoln-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-knox-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-kennebec-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-hancock-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-franklin-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-cumberland-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-aroostook-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-parent-androscoggin-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-york-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-washington-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-waldo-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-somerset-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-sagadahoc-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-piscataquis-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-penobscot-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-oxford-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-lincoln-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-knox-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-kennebec-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-hancock-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-franklin-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-cumberland-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-aroostook-me';
DELETE FROM nonprofit_organizations WHERE id = 'me-np-rights-androscoggin-me';

COMMIT;
