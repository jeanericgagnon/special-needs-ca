import fs from 'fs';
import path from 'path';

// Define 7 official forms, appeals, and transition guides for Pennsylvania
const forms = [
  {
    county_id: 'statewide',
    source_url: 'https://www.dhs.pennsylvania.gov/Services/Assistance/Pages/Medical-Assistance.aspx',
    form_title: 'Pennsylvania Medical Assistance (Medicaid) Application Form (PA 600-HC)',
    source_type: 'official_form',
    confidence_score: 0.95,
    slug: 'pa-medicaid-application-pa600',
    program: 'pa-medicaid-dcf',
    pdf_url: 'https://www.dhs.pennsylvania.gov/Services/Assistance/Documents/COMPASS-Applications/PA600-HC.pdf'
  },
  {
    county_id: 'statewide',
    source_url: 'https://www.dhs.pennsylvania.gov/Services/Disabilities-Aging/Pages/Intellectual-Disabilities.aspx',
    form_title: 'Pennsylvania ODP Waiver Services Referral Form',
    source_type: 'official_form',
    confidence_score: 0.95,
    slug: 'pa-odp-waiver-referral',
    program: 'pa-ibudget-waiver',
    pdf_url: 'https://www.dhs.pennsylvania.gov/Services/Disabilities-Aging/Pages/Intellectual-Disabilities.aspx'
  },
  {
    county_id: 'statewide',
    source_url: 'https://www.dhs.pennsylvania.gov/early-intervention',
    form_title: 'Pennsylvania Early Intervention CONNECT Referral COMPASS Portal',
    source_type: 'official_portal',
    confidence_score: 0.95,
    slug: 'pa-ei-referral-compass',
    program: 'pa-early-intervention',
    pdf_url: 'https://www.compass.state.pa.us/compass.web/Public/CMPHome'
  },
  {
    county_id: 'statewide',
    source_url: 'https://odr-pa.org/due-process/due-process-complaint/',
    form_title: 'Pennsylvania Special Education Due Process Complaint Form',
    source_type: 'official_form',
    confidence_score: 0.95,
    slug: 'pa-special-ed-complaint-form',
    program: 'pa-special-education',
    pdf_url: 'https://odr-pa.org/wp-content/uploads/Dispute-Resolution-Complaint-Form.pdf'
  },
  {
    county_id: 'statewide',
    source_url: 'https://odr-pa.org/mediation/',
    form_title: 'Pennsylvania Special Education Mediation Request Form',
    source_type: 'official_form',
    confidence_score: 0.95,
    slug: 'pa-special-ed-mediation-request',
    program: 'pa-special-education',
    pdf_url: 'https://odr-pa.org/wp-content/uploads/Mediation-Request-Form.pdf'
  },
  {
    county_id: 'statewide',
    source_url: 'https://www.dli.pa.gov/Individuals/Disability-Services/ovr/Pages/default.aspx',
    form_title: 'PA OVR Transition Services Pre-Employment Transition Services (Pre-ETS) Consent Form',
    source_type: 'official_form',
    confidence_score: 0.95,
    slug: 'pa-ovr-pre-ets-consent',
    program: 'pa-ovr-transition',
    pdf_url: 'https://www.dli.pa.gov/Individuals/Disability-Services/ovr/Pages/default.aspx'
  },
  {
    county_id: 'statewide',
    source_url: 'https://www.paable.gov/',
    form_title: 'PA ABLE Savings Program Disclosure & Enrollment Statement',
    source_type: 'official_form',
    confidence_score: 0.95,
    slug: 'pa-able-enrollment-guide',
    program: 'pa-able',
    pdf_url: 'https://www.paable.gov/pdf/PA-ABLE-Savings-Program-Disclosure-Statement.pdf'
  }
];

const outputFilePath = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/pennsylvania/phase_records/forms_appeals_transition.json';
fs.writeFileSync(outputFilePath, JSON.stringify(forms, null, 2), 'utf8');
console.log(`✓ Generated and wrote ${forms.length} forms and guides to forms_appeals_transition.json.`);
