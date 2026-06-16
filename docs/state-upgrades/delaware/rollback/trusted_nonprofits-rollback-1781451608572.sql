-- Rollback Script for State: Delaware | Phase: trusted_nonprofits
-- Generated At: 2026-06-14T15:40:08.582Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'np-local-sussex-de';
DELETE FROM nonprofit_organizations WHERE id = 'np-local-new-castle-de';
DELETE FROM nonprofit_organizations WHERE id = 'de-np-arc-sussex-de';
DELETE FROM nonprofit_organizations WHERE id = 'de-np-arc-new-castle-de';
DELETE FROM nonprofit_organizations WHERE id = 'de-np-arc-kent-de';
DELETE FROM nonprofit_organizations WHERE id = 'de-np-parent-sussex-de';
DELETE FROM nonprofit_organizations WHERE id = 'de-np-parent-new-castle-de';
DELETE FROM nonprofit_organizations WHERE id = 'de-np-parent-kent-de';
DELETE FROM nonprofit_organizations WHERE id = 'de-np-rights-sussex-de';
DELETE FROM nonprofit_organizations WHERE id = 'de-np-rights-new-castle-de';
DELETE FROM nonprofit_organizations WHERE id = 'de-np-rights-kent-de';

COMMIT;
