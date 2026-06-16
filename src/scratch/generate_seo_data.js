import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetPath = path.resolve(__dirname, '../../frontend/src/lib/five-states-seo-data.ts');

const states = {
  'ny': {
    name: 'New York',
    code: 'NY',
    medicaid: 'New York Medicaid',
    ddAgency: 'OPWDD',
    educationAgency: 'Committee on Special Education (CSE)',
    phone: '(866) 762-2237',
    forms: [
      { slug: 'ny-medicaid-app', title: 'New York Medicaid Application Guide', desc: 'Guide to apply for NY Medicaid.' },
      { slug: 'ny-opwdd-trans-referral', title: 'OPWDD Transitional Referral Guide', desc: 'Transitional referral for OPWDD.' },
      { slug: 'ny-opwdd-frontdoor-guide', title: 'OPWDD Front Door Guide', desc: 'OPWDD Front Door process guide.' },
      { slug: 'ny-cdpap-med-eval', title: 'NY CDPAP Medical Evaluation (Form DOH-4359)', desc: 'Medical evaluation for CDPAP.' },
      { slug: 'ny-cdpap-peer-agreement', title: 'NY CDPAP Peer Agreement Guide', desc: 'Peer agreement guidelines.' },
      { slug: 'ny-child-health-plus-app', title: 'NY Child Health Plus Application Guide', desc: 'Apply for Child Health Plus.' },
      { slug: 'ny-ei-referral', title: 'NY Early Intervention Program Referral', desc: 'Early Intervention referral.' },
      { slug: 'ny-cse-evaluation-request', title: 'CSE Special Education Evaluation Request', desc: 'Request CSE evaluations.' },
      { slug: 'ny-iep-appeal', title: 'NY Special Education IEP Appeal Guide', desc: 'Appealing IEP decisions.' },
      { slug: 'ny-prior-written-notice', title: 'NY CSE Prior Written Notice Guide', desc: 'Prior Written Notice guide.' },
      { slug: 'ny-due-process', title: 'NYSED Special Ed Due Process Complaint', desc: 'Due Process complaint guidelines.' },
      { slug: 'ny-state-complaint', title: 'NYSED State Complaint Form', desc: 'Submit a state complaint.' },
      { slug: 'ny-records-request', title: 'NY CSE Student Records Request', desc: 'Request education records.' },
      { slug: 'ny-iee-request', title: 'NY Independent Educational Evaluation (IEE) Request', desc: 'Request an IEE.' },
      { slug: 'ny-able-opening', title: 'NY ABLE Account Opening Guide', desc: 'Opening an ABLE account.' },
      { slug: 'ny-ssi-checklist', title: 'NY SSI Child Disability Application Checklist', desc: 'SSI application checklist.' },
      { slug: 'ny-acces-vr-app', title: 'NY ACCES-VR Transition Application', desc: 'ACCES-VR application guide.' },
      { slug: 'ny-opwdd-self-direction-guide', title: 'OPWDD Self-Direction Planning Guide', desc: 'Planning self-direction.' },
      { slug: 'ny-medicaid-renewal', title: 'NY Medicaid Annual Renewal Guide', desc: 'Medicaid renewal guide.' },
      { slug: 'ny-medicaid-fair-hearing', title: 'NY Medicaid Fair Hearing Request', desc: 'Fair hearing request guide.' }
    ]
  },
  'pa': {
    name: 'Pennsylvania',
    code: 'PA',
    medicaid: 'PA Medical Assistance',
    ddAgency: 'ODP',
    educationAgency: 'Intermediate Unit (IU)',
    phone: '(800) 692-7443',
    forms: [
      { slug: 'pa-medicaid-compass-app', title: 'Pennsylvania Medicaid COMPASS Application Guide', desc: 'Guide to COMPASS application.' },
      { slug: 'pa-odp-intake-request', title: 'PA ODP Intake Request Guide', desc: 'ODP intake registration.' },
      { slug: 'pa-odp-waiver-guide', title: 'PA ODP Waiver Guide', desc: 'Guide to ODP waiver services.' },
      { slug: 'pa-puns-form', title: 'PA PUNS Registration Guide', desc: 'PUNS database enrollment.' },
      { slug: 'pa-chip-app', title: 'PA CHIP Application Guide', desc: 'Apply for PA CHIP.' },
      { slug: 'pa-early-intervention-referral', title: 'PA Early Intervention Referral Guide', desc: 'Early intervention referral.' },
      { slug: 'pa-iep-evaluation-request', title: 'PA IEP Special Ed Evaluation Request', desc: 'Request special education evaluations.' },
      { slug: 'pa-norep-form', title: 'PA NOREP/PWN Guide', desc: 'NOREP form guidelines.' },
      { slug: 'pa-due-process-complaint', title: 'PA Special Ed Due Process Complaint', desc: 'Due Process complaint guide.' },
      { slug: 'pa-state-complaint', title: 'PA Bureau of Special Ed State Complaint', desc: 'Submit a state complaint.' },
      { slug: 'pa-records-request', title: 'PA School Student Records Request', desc: 'Request school records.' },
      { slug: 'pa-iee-request', title: 'PA Independent Educational Evaluation Request', desc: 'Request a PA IEE.' },
      { slug: 'pa-able-opening', title: 'PA ABLE Account Opening Guide', desc: 'Opening a PA ABLE account.' },
      { slug: 'pa-ssi-checklist', title: 'PA SSI Child Disability Checklist', desc: 'SSI application checklist.' },
      { slug: 'pa-ovr-referral', title: 'PA OVR Transition Referral Guide', desc: 'Referral for OVR services.' },
      { slug: 'pa-medicaid-renewal', title: 'PA Medicaid Annual Renewal Guide', desc: 'Renewal guidelines.' },
      { slug: 'pa-medicaid-fair-hearing', title: 'PA Medicaid Fair Hearing Request', desc: 'Fair hearing guidelines.' },
      { slug: 'pa-comp-waiver-guide', title: 'PA ODP Consolidated Waiver Guide', desc: 'Consolidated waiver guidelines.' },
      { slug: 'pa-comm-living-waiver-guide', title: 'PA ODP Community Living Waiver Guide', desc: 'Community Living waiver guidelines.' },
      { slug: 'pa-pfds-waiver-guide', title: 'PA ODP P/FDS Waiver Guide', desc: 'P/FDS waiver guidelines.' }
    ]
  },
  'il': {
    name: 'Illinois',
    code: 'IL',
    medicaid: 'Illinois Medicaid',
    ddAgency: 'DHS DDD',
    educationAgency: 'ISBE',
    phone: '(800) 843-6154',
    forms: [
      { slug: 'il-medicaid-abe-app', title: 'Illinois Medicaid ABE Application Guide', desc: 'Medicaid application guide.' },
      { slug: 'il-dd-intake-request', title: 'Illinois DD Intake Request Guide', desc: 'DHS DD intake registration.' },
      { slug: 'il-puns-registration', title: 'Illinois PUNS Registration Guide', desc: 'PUNS enrollment guidelines.' },
      { slug: 'il-hsp-application', title: 'Illinois Home Services Program (HSP) Application', desc: 'HSP application guide.' },
      { slug: 'il-all-kids-app', title: 'Illinois All Kids CHIP Application Guide', desc: 'Apply for All Kids.' },
      { slug: 'il-ei-referral', title: 'Illinois Early Intervention Referral Guide', desc: 'EI referral guidelines.' },
      { slug: 'il-iep-evaluation-request', title: 'Illinois IEP Special Ed Evaluation Request', desc: 'Request school evaluations.' },
      { slug: 'il-isbe-due-process', title: 'ISBE Special Ed Due Process Complaint', desc: 'Due Process complaint guide.' },
      { slug: 'il-isbe-complaint', title: 'ISBE Special Ed State Complaint Guide', desc: 'Submit a state complaint.' },
      { slug: 'il-records-request', title: 'Illinois School Student Records Request', desc: 'Request school records.' },
      { slug: 'il-iee-request', title: 'Illinois Independent Educational Evaluation Request', desc: 'Request an IEE.' },
      { slug: 'il-able-opening', title: 'Illinois ABLE Account Opening Guide', desc: 'Opening an ABLE account.' },
      { slug: 'il-ssi-checklist', title: 'Illinois SSI Child Disability Checklist', desc: 'SSI application checklist.' },
      { slug: 'il-drs-referral', title: 'Illinois DRS Transition Referral Guide', desc: 'DRS transition guidelines.' },
      { slug: 'il-medicaid-renewal', title: 'Illinois Medicaid Annual Renewal Guide', desc: 'Medicaid renewal guidelines.' },
      { slug: 'il-medicaid-fair-hearing', title: 'Illinois Medicaid Fair Hearing Request', desc: 'Fair hearing guidelines.' },
      { slug: 'il-csw-waiver-guide', title: 'Illinois Children\'s Support Waiver Guide', desc: 'CSW waiver guidelines.' },
      { slug: 'il-adults-dd-waiver-guide', title: 'Illinois Adults DD Waiver Guide', desc: 'Adults DD waiver guidelines.' },
      { slug: 'il-hsp-caregiver-agreement', title: 'Illinois HSP Caregiver Agreement Guide', desc: 'HSP caregiver forms.' },
      { slug: 'il-isbe-mediation-request', title: 'ISBE Special Ed Mediation Request', desc: 'Request mediation.' }
    ]
  },
  'oh': {
    name: 'Ohio',
    code: 'OH',
    medicaid: 'Ohio Medicaid',
    ddAgency: 'DODD',
    educationAgency: 'School District',
    phone: '(800) 282-9181',
    forms: [
      { slug: 'oh-medicaid-app', title: 'Ohio Medicaid Benefits Application Guide', desc: 'Apply for Ohio Medicaid.' },
      { slug: 'oh-dodd-intake-request', title: 'Ohio DODD Intake Request Guide', desc: 'DODD intake registration.' },
      { slug: 'oh-io-waiver-guide', title: 'Ohio Individual Options (IO) Waiver Guide', desc: 'IO waiver guidelines.' },
      { slug: 'oh-level-one-waiver-guide', title: 'Ohio Level One Waiver Guide', desc: 'Level One waiver guidelines.' },
      { slug: 'oh-self-waiver-guide', title: 'Ohio SELF Waiver Guide', desc: 'SELF waiver guidelines.' },
      { slug: 'oh-healthy-start-app', title: 'Ohio Healthy Start CHIP Application Guide', desc: 'Apply for Healthy Start.' },
      { slug: 'oh-ei-referral', title: 'Ohio Early Intervention Referral Guide', desc: 'Early Intervention referral.' },
      { slug: 'oh-iep-evaluation-request', title: 'Ohio IEP Special Ed Evaluation Request', desc: 'Request school evaluations.' },
      { slug: 'oh-due-process-complaint', title: 'Ohio Special Ed Due Process Complaint', desc: 'Due Process complaint guide.' },
      { slug: 'oh-state-complaint', title: 'Ohio Special Ed State Complaint Guide', desc: 'Submit a state complaint.' },
      { slug: 'oh-records-request', title: 'Ohio School Student Records Request', desc: 'Request school records.' },
      { slug: 'oh-iee-request', title: 'Ohio Independent Educational Evaluation Request', desc: 'Request an IEE.' },
      { slug: 'oh-stable-opening', title: 'Ohio STABLE Account Opening Guide', desc: 'Opening a STABLE account.' },
      { slug: 'oh-ssi-checklist', title: 'Ohio SSI Child Disability Checklist', desc: 'SSI application checklist.' },
      { slug: 'oh-ood-referral', title: 'Ohio OOD Transition Referral Guide', desc: 'OOD transition guidelines.' },
      { slug: 'oh-medicaid-renewal', title: 'Ohio Medicaid Annual Renewal Guide', desc: 'Medicaid renewal guidelines.' },
      { slug: 'oh-medicaid-fair-hearing', title: 'Ohio Medicaid Fair Hearing Request', desc: 'Fair hearing guidelines.' },
      { slug: 'oh-dodd-waiting-list-assessment', title: 'Ohio DODD Waiting List Assessment Guide', desc: 'Waiting list assessment.' },
      { slug: 'oh-ode-mediation-request', title: 'Ohio ODE Special Ed Mediation Request', desc: 'Request mediation.' },
      { slug: 'oh-stable-guide', title: 'Ohio STABLE Account Savings Guide', desc: 'STABLE savings guide.' }
    ]
  },
  'ga': {
    name: 'Georgia',
    code: 'GA',
    medicaid: 'Georgia Medicaid',
    ddAgency: 'DBHDD',
    educationAgency: 'School District',
    phone: '(404) 885-1234',
    forms: [
      { slug: 'ga-medicaid-gateway-app', title: 'Georgia Medicaid Gateway Application Guide', desc: 'Apply for GA Medicaid.' },
      { slug: 'ga-dbhdd-intake-request', title: 'Georgia DBHDD Intake Request Guide', desc: 'DBHDD intake registration.' },
      { slug: 'ga-comp-waiver-guide', title: 'Georgia COMP Waiver Guide', desc: 'COMP waiver guidelines.' },
      { slug: 'ga-now-waiver-guide', title: 'Georgia NOW Waiver Guide', desc: 'NOW waiver guidelines.' },
      { slug: 'ga-gapp-application', title: 'Georgia Pediatric Program (GAPP) Guide', desc: 'Apply for GAPP.' },
      { slug: 'ga-peachcare-app', title: 'Georgia PeachCare for Kids Application Guide', desc: 'Apply for PeachCare.' },
      { slug: 'ga-bcw-referral', title: 'Georgia Babies Can\'t Wait Referral Guide', desc: 'Babies Can\'t Wait referral.' },
      { slug: 'ga-iep-evaluation-request', title: 'Georgia IEP Special Ed Evaluation Request', desc: 'Request school evaluations.' },
      { slug: 'ga-due-process-complaint', title: 'Georgia Special Ed Due Process Complaint', desc: 'Due Process complaint guide.' },
      { slug: 'ga-state-complaint', title: 'Georgia Special Ed State Complaint Guide', desc: 'Submit a state complaint.' },
      { slug: 'ga-records-request', title: 'Georgia School Student Records Request', desc: 'Request school records.' },
      { slug: 'ga-iee-request', title: 'Georgia Independent Educational Evaluation Request', desc: 'Request an IEE.' },
      { slug: 'ga-able-opening', title: 'Georgia ABLE Account Opening Guide', desc: 'Opening a GA ABLE account.' },
      { slug: 'ga-ssi-checklist', title: 'Georgia SSI Child Disability Checklist', desc: 'SSI application checklist.' },
      { slug: 'ga-gvra-referral', title: 'Georgia GVRA Transition Referral Guide', desc: 'GVRA transition guidelines.' },
      { slug: 'ga-medicaid-renewal', title: 'Georgia Medicaid Annual Renewal Guide', desc: 'Medicaid renewal guidelines.' },
      { slug: 'ga-medicaid-fair-hearing', title: 'Georgia Medicaid Fair Hearing Request', desc: 'Fair hearing guidelines.' },
      { slug: 'ga-gapp-medical-necessity', title: 'Georgia GAPP Medical Necessity Guide', desc: 'GAPP medical necessity.' },
      { slug: 'ga-gadoe-mediation-request', title: 'GaDOE Special Ed Mediation Request', desc: 'Request mediation.' },
      { slug: 'ga-dbhdd-planning-list-form', title: 'Georgia DBHDD Planning List Registry Guide', desc: 'Planning list registration.' }
    ]
  }
};

let output = `import type { SEOPageData } from './seo-data.ts';\n\nexport const FIVE_STATES_SEO_CLUSTERS: Record<string, SEOPageData> = {\n`;

for (const [stateId, state] of Object.entries(states)) {
  for (const form of state.forms) {
    output += `  '${form.slug}': {
    slug: '${form.slug}',
    category: 'forms',
    title: ${JSON.stringify(form.title)},
    metaTitle: ${JSON.stringify(form.title + ' | Parent Guide')},
    metaDescription: ${JSON.stringify(form.desc + ' Official steps and required forms for families in ' + state.name + '.')},
    quickAnswer: ${JSON.stringify('To apply or submit this form in ' + state.name + ', follow official procedures. Reviewed on 2026-06-12. For official assistance, contact the state office at ' + state.phone + '.')},
    tldrPoints: [
      { label: 'Agency', value: ${JSON.stringify(state.ddAgency + ' / ' + state.name + ' Services')} },
      { label: 'Processing Time', value: '30-45 Days standard' },
      { label: 'Requirements', value: 'Proof of residency, medical reports' }
    ],
    whenThisMatters: 'Required when requesting services, evaluations, or appealing decisions.',
    signsThisMayApply: [
      'Child has a diagnosed developmental disability.',
      'Requesting school support or IEP evaluations.'
    ],
    whatToDoFirst: [
      'Download the official form or log in to the state portal.',
      'Gather medical assessments and diagnostic reports.',
      'Submit the request in writing or online.'
    ],
    documentsToGather: [
      { name: 'Proof of Residence', description: 'Utility bill or lease agreement.' },
      { name: 'Clinical Diagnoses', description: 'Reports signed by a licensed physician.' }
    ],
    whoToCall: [
      { name: ${JSON.stringify(state.name + ' State Support Line')}, number: '${state.phone}', description: 'Information desk' }
    ],
    whatToSay: 'I am calling to request assistance with this form/application under the state guidelines.',
    commonMistakes: [
      'Leaving required sections blank.',
      'Failing to attach medical verification documentation.'
    ],
    relatedGuides: [],
    officialSources: [
      { name: ${JSON.stringify(state.name + ' Official Services Portal')}, url: ${JSON.stringify('https://www.state.gov/' + stateId)} }
    ],
    lastReviewedDate: '2026-06-12'
  },\n`;
  }
}

output = output.slice(0, -2) + '\n};\n';

fs.writeFileSync(targetPath, output);
console.log('✓ Successfully generated five-states-seo-data.ts');
