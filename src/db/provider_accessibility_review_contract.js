export const PROVIDER_ACCESSIBILITY_FOCUS_STATES = ['florida', 'texas', 'pennsylvania', 'illinois'];

export const PROVIDER_ACCESSIBILITY_BUCKET_PROMPTS = {
  contact_page: 'Check for explicit languages, multilingual phone lines, interpreter wording, and contact-form language choices.',
  appointment_page: 'Check scheduling and referral pages for interpreter requests, telehealth, appointment-required, and referral-required wording.',
  patient_services: 'Check patient services or patient info pages for transportation, accessibility, interpreter, and family-support notes.',
  faq_page: 'Check FAQ or family-support pages for explicit telehealth, language, or support-service wording.',
  telehealth_page: 'Check for explicit telehealth, virtual visit, or remote therapy statements.',
  accessibility_page: 'Check official accessibility or interpreter pages for language access, ASL, wheelchair, and patient-access statements that plausibly apply to clinic visits.',
  program_overview: 'Check the main program page for language, referral, family-support, and intake or eligibility instructions.',
};

export const PROVIDER_ACCESSIBILITY_BUCKET_LABELS = {
  contact_page: 'Contact Page',
  appointment_page: 'Appointment / Scheduling Page',
  patient_services: 'Patient Services / Patient Info',
  faq_page: 'FAQ / Family Support',
  telehealth_page: 'Telehealth / Virtual Care',
  accessibility_page: 'Accessibility / Interpreter / Language Access',
  program_overview: 'Program Overview',
};

export const PROVIDER_ACCESSIBILITY_BUCKET_FIELD_MAP = {
  contact_page: ['languages', 'interpreter_available', 'next_step_type'],
  appointment_page: ['virtual_services', 'requirements', 'referral_url'],
  patient_services: ['transportation_help', 'wheelchair_accessible', 'home_visits', 'accessibility_notes'],
  faq_page: ['accessibility_notes'],
  telehealth_page: ['virtual_services'],
  accessibility_page: ['interpreter_available', 'asl_available', 'wheelchair_accessible'],
  program_overview: ['in_person_services', 'application_url', 'requirements'],
};

export function providerAccessibilityHost(url) {
  if (!url || !String(url).trim()) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

export function inferProviderAccessibilityBuckets(row) {
  const categories = String(row.categories || '').toLowerCase();
  const nextStep = String(row.next_step_type || '').toLowerCase();
  const url = String(row.source_url || '').toLowerCase();
  const buckets = new Set(['contact_page', 'patient_services', 'program_overview', 'accessibility_page']);

  if (nextStep === 'call') {
    buckets.add('appointment_page');
  }
  if (nextStep === 'email') {
    buckets.add('contact_page');
  }
  if (categories.includes('speech') || categories.includes('therapy')) {
    buckets.add('telehealth_page');
  }
  if (categories.includes('autism') || url.includes('autism')) {
    buckets.add('faq_page');
  }
  if (categories.includes('developmental') || url.includes('development') || categories.includes('clinical')) {
    buckets.add('appointment_page');
  }
  if (url.includes('contact')) {
    buckets.add('contact_page');
  }

  return [...buckets];
}

export function providerAccessibilityBucketLabel(id) {
  return PROVIDER_ACCESSIBILITY_BUCKET_LABELS[id] || id;
}

export function providerAccessibilityExtractionPrompts(bucketId) {
  switch (bucketId) {
    case 'contact_page':
      return [
        'check for direct language listings, multilingual phone lines, interpreter wording, and contact-form language choices',
        'capture only explicit language or interpreter claims',
      ];
    case 'appointment_page':
      return [
        'check scheduling and referral pages for interpreter requests, telehealth, and visit-format notes',
        'look for appointment-required, referral-required, or virtual-visit wording',
      ];
    case 'patient_services':
      return [
        'check patient-services or patient-info pages for transportation, interpreter, accessibility, and family-support notes',
        'look for hospital-wide language access programs that clearly apply to clinic visits',
      ];
    case 'faq_page':
      return [
        'check FAQ or family-support sections for telehealth, language, or support-service wording',
        'avoid inferring clinic accessibility from generic mission copy',
      ];
    case 'telehealth_page':
      return [
        'look for explicit telehealth, virtual visit, or remote therapy wording',
        'capture only clear service-delivery modality statements',
      ];
    case 'accessibility_page':
      return [
        'check official accessibility or interpreter pages for language access, ASL, wheelchair, and patient-access statements',
        'only promote accessibility claims if they plausibly apply to the clinic or appointment flow',
      ];
    case 'program_overview':
      return [
        'check the main program page for language, referral, or family-support wording near intake and eligibility',
        'capture explicit support details, not implied audience fit',
      ];
    default:
      return [];
  }
}
