import assert from 'node:assert/strict';
import { isSafePublishedFormGuide } from '../frontend/src/lib/publishedFormGuideSafety.ts';

const safeOfficialForm = {
  id: 'ca-form-soc-856',
  state_id: 'california',
  title: 'TO REQUEST APPEAL OF PROVIDER ENROLLMENT DENIAL:',
  slug: 'california-safe-form',
  form_type: 'SOC 856',
  agency: 'California Department of Social Services',
  who_uses_it: 'Parents or authorized representatives filing an appeal.',
  who_signs_it: 'Parent or authorized representative',
  where_to_send_it: 'Mail to the hearing address listed on the official form instructions.',
  source_url: 'https://cdss.ca.gov/Portals/9/Additional-Resources/Forms-and-Brochures/2019/Q-T/SOC856.pdf',
  pdf_url: 'https://cdss.ca.gov/Portals/9/Additional-Resources/Forms-and-Brochures/2019/Q-T/SOC856.pdf',
  evidence_level: 'ca_source_pack_published_v1',
  source_type: 'official_form_library',
  data_origin: 'ca_source_pack_published_v1',
  verification_status: 'official_verified',
  confidence_score: 1,
  last_checked_at: '2026-06-20',
  last_verified_at: '2026-06-20T20:19:39.162Z',
  display_status: 'published',
};

assert.equal(isSafePublishedFormGuide(safeOfficialForm), true);

const placeholderPublishedForm = {
  ...safeOfficialForm,
  id: 'form1',
  slug: 'unsafe-placeholder-form',
  source_url: 'https://example.org/forms',
  pdf_url: 'https://example.org/form.pdf',
};

assert.equal(isSafePublishedFormGuide(placeholderPublishedForm), false);

const missingProvenanceForm = {
  ...safeOfficialForm,
  id: 'form2',
  slug: 'unsafe-missing-provenance',
  source_url: '',
  verification_status: '',
};

assert.equal(isSafePublishedFormGuide(missingProvenanceForm), false);

const missingSignerOrRoute = {
  ...safeOfficialForm,
  id: 'form3',
  slug: 'unsafe-missing-signer-route',
  who_signs_it: 'See source instructions',
  where_to_send_it: '',
};

assert.equal(isSafePublishedFormGuide(missingSignerOrRoute), false);

console.log('published form guides tests passed');
