-- Rollback Script for State: Illinois | Phase: trusted_nonprofits
-- Generated At: 2026-06-15T16:53:48.230Z

BEGIN TRANSACTION;

DELETE FROM nonprofit_organizations WHERE id = 'np-il-center-for-autism-il';
DELETE FROM nonprofit_organizations WHERE id = 'np-silc-il';
DELETE FROM nonprofit_organizations WHERE id = 'np-illinois-lifespan-il';
DELETE FROM nonprofit_organizations WHERE id = 'np-arc-of-illinois-il';
DELETE FROM nonprofit_organizations WHERE id = 'np-family-matters-il';
DELETE FROM nonprofit_organizations WHERE id = 'np-frcd-il';
DELETE FROM nonprofit_organizations WHERE id = 'np-equip-for-equality-il';

COMMIT;
