import stateProgramsMap from './state_programs_map.json';

export interface ParentResource {
  name: string;
  url: string;
  description: string;
}

export interface FAQItem {
  q: string;
  a: (
    county: string,
    rc: string,
    sd: string,
    wage: number,
    payout: string,
    diagnosis: string
  ) => string;
}

export interface StateConfig {
  name: string;
  code: string;
  catchmentName: string;
  catchmentDesc: string;
  waiverProgram: string;
  personalCareProgram: string;
  medicaidName: string;
  educationAgencyLabel: string;
  earlyInterventionLabel: string;
  legalDisclaimer: string;
  timelineDaysPlan: string;
  timelineDaysMeeting: string;
  timelinesCode: string;
  localAgencyType: string;
  stateMedicaidAgency: string;
  ddAgency: string;
  educationAgency: string;
  specialEducationSupport: string;
  earlyIntervention: string;
  ableProgram: string;
  parentTrainingResources: ParentResource[];
  corePrograms: string[];
  requiredForms: string[];
  faqs: FAQItem[];
  priorityMetroCounties?: string[];
}

export const stateConfigs: Record<string, StateConfig> = {
  'california': {
    name: 'California',
    code: 'CA',
    catchmentName: 'Regional Center',
    catchmentDesc: 'Coordinates Lanterman Act eligibility, respite care packages, and developmental therapies.',
    waiverProgram: 'HCBS DD Waiver',
    personalCareProgram: 'IHSS Protective Supervision',
    medicaidName: 'Medi-Cal',
    educationAgencyLabel: 'Special Education Local Plan Areas (SELPAs)',
    earlyInterventionLabel: 'California Early Start (Ages 0-3)',
    legalDisclaimer: 'Lanterman Developmental Disabilities Services Act: California Welfare & Institutions (W&I) Code § 4600 et seq. assessments guidelines are enforced under W&I § 4646. In-Home Supportive Services (IHSS) Protective Supervision regulatory guidelines: California Department of Social Services (CDSS) Manual of Policies and Procedures (MPP) Section 30-757. Special education assessment timelines and Free Appropriate Public Education (FAPE): Federal Individuals with Disabilities Education Act (IDEA) 20 U.S.C. § 1400 et seq. and California Education Code § 56300 et seq. Timeline rules are cited under CA Ed Code § 56321.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'California Education Code § 56321',
    localAgencyType: 'Regional Center',
    stateMedicaidAgency: 'California Department of Health Care Services',
    ddAgency: 'California Department of Developmental Services',
    educationAgency: 'California Department of Education',
    specialEducationSupport: 'SELPA',
    earlyIntervention: 'California Early Start',
    ableProgram: 'CalABLE',
    parentTrainingResources: [
      {
        name: 'Family Resource Centers Network of California (FRCNCA)',
        url: 'https://frcnca.org',
        description: 'Supports families of children with special needs across California.'
      }
    ],
    corePrograms: [
      'ihss-for-children',
      'regional-centers',
      'early-start',
      'self-determination-program',
      'medi-cal-for-kids-and-teens',
      'california-childrens-services',
      'hearing-aid-coverage',
      'ssi-for-children',
      'calable',
      'iep-special-education',
      'hcba'
    ],
    requiredForms: [
      'soc-295',
      'soc-873',
      'soc-821',
      'soc-825',
      'soc-839',
      'regional-center-intake-request',
      'regional-center-ipp-request',
      'regional-center-service-request',
      'regional-center-appeal-request',
      'iep-assessment-request',
      'independent-educational-evaluation-request',
      'prior-written-notice-request',
      'education-records-request',
      'cde-state-complaint',
      'due-process-complaint',
      'ccs-application',
      'dhcs-4480',
      'medi-cal-application',
      'medi-cal-epsdt-request',
      'ssi-child-disability-checklist',
      'calable-account-opening',
      'hcba-waiver-application'
    ],
    priorityMetroCounties: [
      'los-angeles',
      'orange',
      'san-diego',
      'riverside',
      'sacramento',
      'san-francisco',
      'alameda',
      'fresno'
    ],
    faqs: [
      {
        q: 'How do I start the Regional Center intake process for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `To access Lanterman Act services for ${diagnosis} in ${county} County, you must request an intake assessment from ${rc}. Under California Welfare & Institutions Code § 4648, the center must complete the initial intake within 15 days of your request and determine eligibility within 120 days. If eligible, your child will receive a designated service coordinator and access to funded respite care, social recreation slots, and behavior services.`
      },
      {
        q: 'Does my child qualify for paid caregiver hours (IHSS) for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes, if your child's ${diagnosis} results in severe cognitive or behavioral limitations—such as wandering, self-injury, or inability to perceive danger—they may qualify for IHSS Protective Supervision. This is a California program that pays you (the parent) to protect and supervise your child. In ${county} County, a child categorized as Severely Impaired can receive up to 283 hours per month, which at standard caregiver wages ($${wage.toFixed(2)}/hr) yields approximately $${payout} per month in tax-free income.`
      },
      {
        q: 'What are my rights if the school district delays assessing my child with [diagnosis]?',
        a: (county, rc, sd, wage, payout, diagnosis) => `If you suspect your child has ${diagnosis} and requires special education, submit a formal assessment request in writing to ${sd}. Under California Education Code § 56321, the district has exactly 15 calendar days from receipt of your letter to provide an Assessment Plan. Once you sign and return that plan, they have 60 calendar days to complete all evaluations and hold the initial IEP meeting. Do not accept informal academic interventions as a substitute for a formal IEP evaluation.`
      },
      {
        q: 'Can we get Medi-Cal and therapy funding for [diagnosis] if our household income is too high?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Absolutely. California offers the Regional Center Institutional Deeming waiver (also known as the HCBS DD Waiver) which completely bypasses parental income and asset limits. If your child is eligible for ${rc}, they can qualify for full-scope Medi-Cal based solely on their own income (which is $0), regardless of how much you earn. This covers co-pays, specialized pediatric therapies, and adaptive equipment at no cost.`
      }
    ]
  },
  'texas': {
    name: 'Texas',
    code: 'TX',
    catchmentName: 'LIDDA',
    catchmentDesc: 'Manages local intake, assessments, and interest lists for Texas Medicaid waivers.',
    waiverProgram: 'HCS Waiver',
    personalCareProgram: 'Medically Dependent Children\'s Program (MDCP)',
    medicaidName: 'Texas Medicaid',
    educationAgencyLabel: 'Regional Education Service Centers',
    earlyInterventionLabel: 'Texas Early Childhood Intervention (ECI) (Ages 0-3)',
    legalDisclaimer: 'Texas Administrative Code (TAC) Title 26, Part 1, Chapter 263 governs Home and Community-based Services. Texas Health and Safety Code Chapter 121 regulates local public health and developmental services. Special education assessment timelines are governed by the Texas Education Code (TEC) § 29.004, which mandates school districts complete evaluations within 45 school days of receiving written consent, and hold an ARD/IEP meeting within 30 calendar days of evaluation completion.',
    timelineDaysPlan: '15 school days',
    timelineDaysMeeting: '45 school days',
    timelinesCode: 'Texas Education Code § 29.004',
    localAgencyType: 'LIDDA',
    stateMedicaidAgency: 'Texas Health and Human Services',
    ddAgency: 'Texas HHS / IDD services',
    educationAgency: 'Texas Education Agency',
    specialEducationSupport: 'SPEDTex',
    earlyIntervention: 'Texas ECI',
    ableProgram: 'Texas ABLE',
    parentTrainingResources: [
      {
        name: 'Texas Parent to Parent',
        url: 'https://www.txp2p.org',
        description: 'Empowers families to be strong advocates for their children.'
      },
      {
        name: 'Partners Resource Network',
        url: 'https://prntexas.org',
        description: 'Texas Parent Training and Information (PTI) centers.'
      }
    ],
    corePrograms: [
      'tx-hcs',
      'tx-class',
      'tx-txhml',
      'tx-mdcp',
      'tx-eci',
      'tx-tea-sped',
      'tx-able',
      'ssi-for-children'
    ],
    requiredForms: [
      'tx-medicaid-chip',
      'tx-hcs-guide',
      'tx-class-guide',
      'tx-txhml-guide',
      'tx-mdcp-guide',
      'tx-eci-referral',
      'tx-sped-evaluation-request',
      'tx-tea-complaint',
      'tx-due-process-complaint',
      'tx-mediation-request',
      'tx-records-request',
      'tx-iee-request',
      'tx-able-guide',
      'tx-ssi-checklist',
      'tx-starkids-overview',
      'tx-starkids-coordination',
      'tx-starkids-mco-appeal',
      'tx-starkids-reduction-appeal',
      'tx-medicaid-fair-hearing',
      'tx-expedited-appeal',
      'tx-benefits-continuation'
    ],
    priorityMetroCounties: [
      'harris-tx',
      'dallas-tx',
      'tarrant-tx',
      'travis-tx',
      'bexar-tx',
      'el-paso-tx',
      'collin-tx',
      'denton-tx',
      'fort-bend-tx',
      'williamson-tx',
      'montgomery-tx',
      'hidalgo-tx'
    ],
    faqs: [
      {
        q: 'How do I start the LIDDA intake process for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `To access local developmental services for families in ${county} County, you must contact ${rc}. They will perform assessments and place your child on the HCS or TxHmL interest lists. Note that waitlists for these programs can be extremely long (often 10-15+ years), so it is critical to register as early as possible.`
      },
      {
        q: 'Does my child qualify for paid caregiver hours (MDCP) for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes, through Texas Medicaid waiver programs like MDCP (Medically Dependent Children's Program) or CLASS, you can select the Consumer Directed Services (CDS) option. This allows you to hire caregivers, including family members in some programs, to provide personal care services. Hourly wages are based on state program allocations, typically averaging around $${wage.toFixed(2)}/hr.`
      },
      {
        q: 'What are my rights if the school district delays assessing my child with [diagnosis]?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Submit your evaluation request in writing to ${sd}. Under Texas Education Code § 29.004, the district has 15 school days to provide a consent form. Once consent is signed, they have 45 school days to complete the Full and Individual Initial Evaluation (FIIE) and 30 calendar days after the report to hold the ARD/IEP meeting.`
      },
      {
        q: 'Can we get Texas Medicaid and therapy funding for [diagnosis] if our household income is too high?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes. By enrolling in a Texas Medicaid waiver program (such as HCS, CLASS, or MDCP), parental income and assets are completely bypassed. Eligibility is determined solely based on the child's financial resources, which ensures access to full Medicaid coverage, pediatric therapies, and private duty nursing.`
      }
    ]
  },
  'florida': {
    name: 'Florida',
    code: 'FL',
    catchmentName: 'APD Region',
    catchmentDesc: 'Coordinates iBudget waiver eligibility, regional center offices, and developmental therapies.',
    waiverProgram: 'Florida iBudget Waiver',
    personalCareProgram: 'iBudget Waiver / CDC+',
    medicaidName: 'Florida Medicaid',
    educationAgencyLabel: 'FDLRS Associate Centers',
    earlyInterventionLabel: 'Florida Early Steps (Ages 0-3)',
    legalDisclaimer: 'Florida Agency for Persons with Disabilities (APD) iBudget Waiver is governed under Chapter 393, Florida Statutes, and Chapter 65G, Florida Administrative Code. Exceptional Student Education (ESE) special education assessment timelines and dispute resolution procedures are governed under Florida Administrative Code Rule 6A-6.0331. Early intervention services (Early Steps) Part C of IDEA: 34 CFR Part 303.',
    timelineDaysPlan: '30 calendar days',
    timelineDaysMeeting: '60 school days',
    timelinesCode: 'Florida Administrative Code Rule 6A-6.0331',
    localAgencyType: 'APD Region',
    stateMedicaidAgency: 'Florida Agency for Health Care Administration',
    ddAgency: 'Florida Agency for Persons with Disabilities',
    educationAgency: 'Florida Department of Education',
    specialEducationSupport: 'FDLRS Associate Centers',
    earlyIntervention: 'Florida Early Steps',
    ableProgram: 'ABLE United',
    parentTrainingResources: [
      {
        name: 'Family Network on Disabilities (FND)',
        url: 'https://fndusa.org',
        description: 'Florida\'s Parent Training and Information (PTI) center.'
      }
    ],
    corePrograms: [
      'fl-ibudget',
      'fl-cdc-plus',
      'fl-medicaid-dcf',
      'fl-medicaid-managed-care',
      'fl-cms-plan',
      'fl-kidcare',
      'fl-family-empowerment',
      'fl-earlysteps',
      'fl-fldoe-ese',
      'fl-fdlrs-childfind',
      'fl-able',
      'fl-ssi-child',
      'fl-vocational-rehabilitation'
    ],
    requiredForms: [
      'fl-medicaid-application',
      'fl-apd-application',
      'fl-ibudget-guide',
      'fl-ibudget-appeal',
      'fl-apd-hearing-guide',
      'fl-cdc-plus-guide',
      'fl-earlysteps-referral',
      'fl-fldoe-complaint',
      'fl-due-process-complaint',
      'fl-mediation-request',
      'fl-iep-evaluation-request',
      'fl-records-request',
      'fl-iee-request',
      'fl-pwn-request',
      'fl-family-empowerment-scholarship-unique-abilities',
      'fl-cms-plan-guide',
      'fl-kidcare-guide',
      'fl-able-guide',
      'fl-ssi-checklist',
      'fl-vocational-rehabilitation-transition'
    ],
    priorityMetroCounties: [
      'miami-dade-fl',
      'broward-fl',
      'palm-beach-fl',
      'hillsborough-fl',
      'orange-fl',
      'pinellas-fl',
      'duval-fl',
      'lee-fl',
      'polk-fl',
      'brevard-fl',
      'pasco-fl',
      'seminole-fl',
      'alachua-fl',
      'leon-fl'
    ],
    faqs: [
      {
        q: 'How do I start the APD intake process for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `To access iBudget waiver services for ${diagnosis} in ${county} County, you must request an intake assessment from ${rc}. Under Florida Chapter 393, the Agency for Persons with Disabilities (APD) must process applications and determine eligibility within 45 days. If eligible, your child will be placed on the iBudget waiver waitlist (interest list) or fast-tracked if in crisis.`
      },
      {
        q: 'Does my child qualify for paid caregiver hours (CDC+) for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes, through the Florida Consumer Directed Care Plus (CDC+) option under the iBudget waiver, you can hire caregivers, including parents or legal guardians. CDC+ gives you budget authority to manage your own care staff. Caregiver wages are set based on your approved iBudget allocation and plan.`
      },
      {
        q: 'What are my rights if the school district delays assessing my child with [diagnosis]?',
        a: (county, rc, sd, wage, payout, diagnosis) => `If you suspect your child has ${diagnosis} and requires Exceptional Student Education (ESE) services, submit your evaluation request in writing to ${sd}. Under Florida Rule 6A-6.0331, the school district has 30 calendar days to either obtain your consent or refuse in writing. Once consent is signed, they have exactly 60 school days to complete the evaluations and hold the eligibility meeting.`
      },
      {
        q: 'Can we get Florida Medicaid and therapy funding for [diagnosis] if our household income is too high?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes. When your child is enrolled in the Florida iBudget HCBS waiver, parent income and assets are completely bypassed. Eligibility for full-scope Florida Medicaid is determined solely based on the child's financial resources, which are typically $0. This covers therapies, co-pays, and medical equipment at no cost to your family.`
      }
    ]
  },
  'new-york': {
    name: 'New York',
    code: 'NY',
    catchmentName: 'OPWDD Regional Office',
    catchmentDesc: 'Coordinates OPWDD eligibility, respite services, and self-direction.',
    waiverProgram: 'OPWDD HCBS Waiver',
    personalCareProgram: 'CDPAP (Consumer Directed Personal Assistance)',
    medicaidName: 'New York Medicaid',
    educationAgencyLabel: 'Committee on Special Education (CSE)',
    earlyInterventionLabel: 'NYS Early Intervention Program (Ages 0-3)',
    legalDisclaimer: 'New York OPWDD waiver programs are governed under Article 16 of the NYS Mental Hygiene Law. Special education evaluations and Committees on Special Education (CSE) timelines are governed by Part 200 of the Regulations of the Commissioner of Education. CSE must complete evaluation within 60 calendar days of receiving parental consent.',
    timelineDaysPlan: '30 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: '8 NYCRR § 200.4',
    localAgencyType: 'OPWDD DDRO',
    stateMedicaidAgency: 'New York State Department of Health',
    ddAgency: 'NYS Office for People With Developmental Disabilities',
    educationAgency: 'New York State Education Department',
    specialEducationSupport: 'BOCES / Committee on Special Education',
    earlyIntervention: 'New York Early Intervention Program',
    ableProgram: 'NY ABLE',
    parentTrainingResources: [
      {
        name: 'Parent to Parent of NYS',
        url: 'https://parenttoparentnys.org',
        description: 'NYS family support network.'
      }
    ],
    corePrograms: [
      'ny-opwdd-waiver', 'ny-opwdd-self-direction', 'ny-medicaid', 'ny-cdpap', 'ny-child-health-plus', 'ny-early-intervention', 'ny-special-education', 'ny-able', 'ny-ssi-child', 'ny-acces-vr'
    ],
    requiredForms: [
      'ny-medicaid-app', 'ny-opwdd-trans-referral', 'ny-opwdd-frontdoor-guide', 'ny-cdpap-med-eval', 'ny-cdpap-peer-agreement', 'ny-child-health-plus-app', 'ny-ei-referral', 'ny-cse-evaluation-request', 'ny-iep-appeal', 'ny-prior-written-notice', 'ny-due-process', 'ny-state-complaint', 'ny-records-request', 'ny-iee-request', 'ny-able-opening', 'ny-ssi-checklist', 'ny-acces-vr-app', 'ny-opwdd-self-direction-guide', 'ny-medicaid-renewal', 'ny-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'kings-ny', 'queens-ny', 'new-york-ny', 'bronx-ny', 'richmond-ny',
      'nassau-ny', 'suffolk-ny', 'westchester-ny', 'erie-ny', 'monroe-ny',
      'onondaga-ny', 'albany-ny'
    ],
    faqs: [
      {
        q: 'How do I start the OPWDD intake process for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `To access OPWDD services for ${diagnosis} in ${county} County, you must request an intake assessment through the OPWDD Front Door process at ${rc}. NYS Mental Hygiene Law Article 16 governs eligibility and services. If eligible, your child can access respite care packages and self-direction options.`
      },
      {
        q: 'Does my child qualify for paid caregiver hours (CDPAP) for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes, through New York's Consumer Directed Personal Assistance Program (CDPAP), you can hire caregivers, including family members (except spouses or parents of minor children). You manage your own personal assistants and care schedule, and wages are paid at local county rates.`
      },
      {
        q: 'What are my rights if the school district delays assessing my child with [diagnosis]?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Submit your evaluation request in writing to ${sd}. Under NYS Commissioner\'s Regulations Part 200, the school district must obtain your consent and complete the evaluation within 60 calendar days of receiving your consent, followed by an IEP meeting to determine eligibility.`
      },
      {
        q: 'Can we get New York Medicaid and therapy funding for [diagnosis] if our household income is too high?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes. When your child is enrolled in the OPWDD HCBS waiver, parental income and assets are completely bypassed. Eligibility for NY Medicaid is determined based solely on the child's financial resources, enabling full coverage for therapies and adaptive equipment.`
      }
    ]
  },
  'pennsylvania': {
    name: 'Pennsylvania',
    code: 'PA',
    catchmentName: 'County MH/ID AE',
    catchmentDesc: 'Coordinates intake, assessments, and ODP waiver interest lists.',
    waiverProgram: 'ODP waivers',
    personalCareProgram: 'Participant Directed Services',
    medicaidName: 'Pennsylvania Medicaid',
    educationAgencyLabel: 'Intermediate Units (IUs)',
    earlyInterventionLabel: 'PA Early Intervention (Ages 0-3)',
    legalDisclaimer: 'Pennsylvania ODP waiver programs are governed under 55 Pa. Code Chapters 6100 and 2390. Special education assessments and IEP timelines are governed by 22 Pa. Code Chapter 14, requiring evaluations within 60 calendar days of receiving parental consent.',
    timelineDaysPlan: '30 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: '22 Pa. Code Chapter 14',
    localAgencyType: 'County MH/ID AE',
    stateMedicaidAgency: 'Pennsylvania Department of Human Services',
    ddAgency: 'Office of Developmental Programs (ODP)',
    educationAgency: 'Pennsylvania Department of Education',
    specialEducationSupport: 'Intermediate Unit',
    earlyIntervention: 'Pennsylvania Early Intervention',
    ableProgram: 'PA ABLE',
    parentTrainingResources: [
      {
        name: 'The PEAL Center',
        url: 'https://pealcenter.org',
        description: 'PA Parent Training and Information Center.'
      }
    ],
    corePrograms: [
      'pa-consolidated-waiver', 'pa-community-living-waiver', 'pa-pfds-waiver', 'pa-medicaid', 'pa-chip', 'pa-early-intervention', 'pa-special-education', 'pa-able', 'pa-ssi-child', 'pa-ovr'
    ],
    requiredForms: [
      'pa-medicaid-compass-app', 'pa-odp-intake-request', 'pa-odp-waiver-guide', 'pa-puns-form', 'pa-chip-app', 'pa-early-intervention-referral', 'pa-iep-evaluation-request', 'pa-norep-form', 'pa-due-process-complaint', 'pa-state-complaint', 'pa-records-request', 'pa-iee-request', 'pa-able-opening', 'pa-ssi-checklist', 'pa-ovr-referral', 'pa-medicaid-renewal', 'pa-medicaid-fair-hearing', 'pa-comp-waiver-guide', 'pa-comm-living-waiver-guide', 'pa-pfds-waiver-guide'
    ],
    priorityMetroCounties: [
      'philadelphia-pa', 'allegheny-pa', 'montgomery-pa', 'bucks-pa', 'delaware-pa',
      'chester-pa', 'lancaster-pa', 'berks-pa'
    ],
    faqs: [
      {
        q: 'How do I start the local intake process for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Contact the local Administrative Entity (AE) at ${rc} to register your child. They will assess your child and complete a PUNS (Prioritization of Urgency of Need for Services) form to place them on the ODP waiver interest list.`
      },
      {
        q: 'Does my child qualify for paid caregiver hours for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes, through the ODP Participant Directed Services option under the Consolidated or Community Living waivers, you can manage your own staff and select family members or relatives as paid caregivers.`
      },
      {
        q: 'What are my rights if the school district delays assessing my child with [diagnosis]?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Submit your evaluation request in writing to ${sd}. Under 22 Pa. Code Chapter 14, the school district must complete the evaluation report (ER) within 60 calendar days of receiving your signed consent form.`
      },
      {
        q: 'Can we get Pennsylvania Medicaid and therapy funding for [diagnosis] if our household income is too high?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes. PA offers Medical Assistance for children with disabilities (often called Loophole or PH-95). If your child meets SSA disability standards, parent income is completely bypassed, giving access to full Medicaid coverage.`
      }
    ]
  },
  'illinois': {
    name: 'Illinois',
    code: 'IL',
    catchmentName: 'ISC Agency',
    catchmentDesc: 'Manages intake, assessments, and the PUNS database in Illinois.',
    waiverProgram: 'Children\'s Support Waiver',
    personalCareProgram: 'Home Services Program (HSP)',
    medicaidName: 'Illinois Medicaid',
    educationAgencyLabel: 'ISBE Special Education Services',
    earlyInterventionLabel: 'Illinois Early Intervention',
    legalDisclaimer: 'Illinois waiver services are administered by the Department of Human Services (DHS) under the Illinois Administrative Code. Special education guidelines are managed under the Illinois State Board of Education (ISBE), which requires school districts to complete evaluations within 60 school days of consent.',
    timelineDaysPlan: '30 school days',
    timelineDaysMeeting: '60 school days',
    timelinesCode: 'Illinois Administrative Code Title 23 § 226',
    localAgencyType: 'ISC Agency',
    stateMedicaidAgency: 'Illinois Department of Healthcare and Family Services',
    ddAgency: 'Illinois Department of Human Services Division of Developmental Disabilities',
    educationAgency: 'Illinois State Board of Education (ISBE)',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Illinois Early Intervention / CFC',
    ableProgram: 'IL ABLE',
    parentTrainingResources: [
      {
        name: 'Family Resource Center on Disabilities',
        url: 'https://frcd.org',
        description: 'Illinois Parent Training and Information Center.'
      }
    ],
    corePrograms: [
      'il-childrens-support-waiver', 'il-adults-dd-waiver', 'il-hsp', 'il-medicaid', 'il-all-kids', 'il-early-intervention', 'il-special-education', 'il-able', 'il-ssi-child', 'il-drs'
    ],
    requiredForms: [
      'il-medicaid-abe-app', 'il-dd-intake-request', 'il-puns-registration', 'il-hsp-application', 'il-all-kids-app', 'il-ei-referral', 'il-iep-evaluation-request', 'il-isbe-due-process', 'il-isbe-complaint', 'il-records-request', 'il-iee-request', 'il-able-opening', 'il-ssi-checklist', 'il-drs-referral', 'il-medicaid-renewal', 'il-medicaid-fair-hearing', 'il-csw-waiver-guide', 'il-adults-dd-waiver-guide', 'il-hsp-caregiver-agreement', 'il-isbe-mediation-request'
    ],
    priorityMetroCounties: [
      'cook-il', 'dupage-il', 'lake-il', 'will-il', 'kane-il',
      'mchenry-il', 'winnebago-il', 'sangamon-il', 'st-clair-il', 'madison-il'
    ],
    faqs: [
      {
        q: 'How do I start the local intake process for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Contact the Independent Service Coordination (ISC) agency at ${rc} serving ${county} County. They will complete the intake and register your child on the PUNS database.`
      },
      {
        q: 'Does my child qualify for paid caregiver hours (HSP) for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes, through the Home Services Program (HSP) administered by Illinois DHS, you can hire personal assistants to provide care, and parents can be paid as caregivers under specific program allocations.`
      },
      {
        q: 'What are my rights if the school district delays assessing my child with [diagnosis]?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Submit your request in writing to ${sd}. Under ISBE rules, the school district must determine if an evaluation is needed, obtain consent, and complete all evaluations and the IEP meeting within 60 school days of consent.`
      },
      {
        q: 'Can we get Illinois Medicaid and therapy funding for [diagnosis] if our household income is too high?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes, if your child is selected from the PUNS list and enrolled in an Illinois HCBS waiver (such as the Children\'s Support Waiver), parental income is completely bypassed for Medicaid eligibility.`
      }
    ]
  },
  'ohio': {
    name: 'Ohio',
    code: 'OH',
    catchmentName: 'County Board of DD',
    catchmentDesc: 'Local county board managing intake, waiver assessments, and service coordination.',
    waiverProgram: 'Individual Options (IO) Waiver',
    personalCareProgram: 'Participant Directed Services',
    medicaidName: 'Ohio Medicaid',
    educationAgencyLabel: 'Educational Service Centers (ESCs)',
    earlyInterventionLabel: 'Ohio Early Intervention (Ages 0-3)',
    legalDisclaimer: 'Ohio DODD waiver programs are governed under Chapter 5123 of the Ohio Revised Code. Special education evaluations and IEP timelines are governed by Ohio Administrative Code Rule 3301-51-06, requiring evaluations within 60 calendar days of receiving parental consent.',
    timelineDaysPlan: '30 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Ohio Administrative Code Rule 3301-51-06',
    localAgencyType: 'County Board of DD',
    stateMedicaidAgency: 'Ohio Department of Medicaid',
    ddAgency: 'Ohio Department of Developmental Disabilities (DODD)',
    educationAgency: 'Ohio Department of Education',
    specialEducationSupport: 'Educational Service Center',
    earlyIntervention: 'Ohio Early Intervention / Help Me Grow',
    ableProgram: 'STABLE Account',
    parentTrainingResources: [
      {
        name: 'OCECD',
        url: 'https://www.ocecd.org',
        description: 'Ohio Coalition for the Education of Children with Disabilities.'
      }
    ],
    corePrograms: [
      'oh-individual-options-waiver', 'oh-level-one-waiver', 'oh-self-waiver', 'oh-medicaid', 'oh-healthy-start', 'oh-early-intervention', 'oh-special-education', 'oh-stable', 'oh-ssi-child', 'oh-ood'
    ],
    requiredForms: [
      'oh-medicaid-app', 'oh-dodd-intake-request', 'oh-io-waiver-guide', 'oh-level-one-waiver-guide', 'oh-self-waiver-guide', 'oh-healthy-start-app', 'oh-ei-referral', 'oh-iep-evaluation-request', 'oh-due-process-complaint', 'oh-state-complaint', 'oh-records-request', 'oh-iee-request', 'oh-stable-opening', 'oh-ssi-checklist', 'oh-ood-referral', 'oh-medicaid-renewal', 'oh-medicaid-fair-hearing', 'oh-dodd-waiting-list-assessment', 'oh-ode-mediation-request', 'oh-stable-guide'
    ],
    priorityMetroCounties: [
      'franklin-oh', 'cuyahoga-oh', 'hamilton-oh', 'summit-oh', 'montgomery-oh',
      'lucas-oh', 'stark-oh'
    ],
    faqs: [
      {
        q: 'How do I start the local Board of DD intake process for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `To begin, contact the County Board of Developmental Disabilities at ${rc} serving ${county} County. They will determine eligibility and perform a waiting list assessment to see if your child has unmet needs.`
      },
      {
        q: 'Does my child qualify for paid caregiver hours for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes, Ohio\'s waivers (IO, Level One, and SELF) offer participant-directed service options, allowing you to hire caregivers, including family members or neighbors, to provide home care.`
      },
      {
        q: 'What are my rights if the school district delays assessing my child with [diagnosis]?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Submit your request in writing to ${sd}. Under Ohio Administrative Code 3301-51-06, the school district must complete the evaluation and hold the IEP eligibility meeting within 60 calendar days of receiving your signed consent.`
      },
      {
        q: 'Can we get Ohio Medicaid and therapy funding for [diagnosis] if our household income is too high?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes. If your child is enrolled in an Ohio DODD waiver (such as the IO waiver), parental income is completely bypassed, and Medicaid eligibility is based solely on the child\'s resources.`
      }
    ]
  },
  'georgia': {
    name: 'Georgia',
    code: 'GA',
    catchmentName: 'DBHDD Regional Office',
    catchmentDesc: 'Coordinates developmental disability services, NOW/COMP waivers, and planning lists.',
    waiverProgram: 'COMP Waiver',
    personalCareProgram: 'Georgia Pediatric Program (GAPP)',
    medicaidName: 'Georgia Medicaid',
    educationAgencyLabel: 'Regional Education Service Agencies (RESAs)',
    earlyInterventionLabel: 'Babies Can\'t Wait (Ages 0-3)',
    legalDisclaimer: 'Georgia DBHDD programs are governed under Title 37 of the Official Code of Georgia Annotated (O.C.G.A.). Special education assessments and IEP timelines are governed by Georgia Department of Education rules, requiring evaluations within 60 calendar days of receiving parental consent.',
    timelineDaysPlan: '30 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Georgia Board of Education Rule 160-4-7-.04',
    localAgencyType: 'DBHDD Regional Office',
    stateMedicaidAgency: 'Georgia Department of Community Health',
    ddAgency: 'Georgia Department of Behavioral Health and Developmental Disabilities',
    educationAgency: 'Georgia Department of Education',
    specialEducationSupport: 'RESA',
    earlyIntervention: 'Georgia Early Intervention / Babies Can\'t Wait',
    ableProgram: 'Georgia Path2College / ABLE',
    parentTrainingResources: [
      {
        name: 'Parent to Parent of Georgia',
        url: 'https://www.p2pga.org',
        description: 'Georgia\'s parent training and resource network.'
      }
    ],
    corePrograms: [
      'ga-comp-waiver', 'ga-now-waiver', 'ga-medicaid', 'ga-gapp', 'ga-peachcare', 'ga-early-intervention', 'ga-special-education', 'ga-able', 'ga-ssi-child', 'ga-gvra'
    ],
    requiredForms: [
      'ga-medicaid-gateway-app', 'ga-dbhdd-intake-request', 'ga-comp-waiver-guide', 'ga-now-waiver-guide', 'ga-gapp-application', 'ga-peachcare-app', 'ga-bcw-referral', 'ga-iep-evaluation-request', 'ga-due-process-complaint', 'ga-state-complaint', 'ga-records-request', 'ga-iee-request', 'ga-able-opening', 'ga-ssi-checklist', 'ga-gvra-referral', 'ga-medicaid-renewal', 'ga-medicaid-fair-hearing', 'ga-gapp-medical-necessity', 'ga-gadoe-mediation-request', 'ga-dbhdd-planning-list-form'
    ],
    priorityMetroCounties: [
      'fulton-ga', 'gwinnett-ga', 'cobb-ga', 'dekalb-ga', 'clayton-ga',
      'cherokee-ga', 'forsyth-ga', 'chatham-ga', 'richmond-ga', 'muscogee-ga', 'clarke-ga'
    ],
    faqs: [
      {
        q: 'How do I start the DBHDD intake process for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Contact the DBHDD Regional Field Office at ${rc} serving ${county} County to request intake. They will perform a developmental assessment and place your child on the COMP or NOW planning list.`
      },
      {
        q: 'Does my child qualify for paid caregiver hours (GAPP) for [diagnosis] in [county] County?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes, through the Georgia Pediatric Program (GAPP), children with complex medical or developmental needs can receive paid in-home personal care and private duty skilled nursing, bypassing parental income.`
      },
      {
        q: 'What are my rights if the school district delays assessing my child with [diagnosis]?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Submit your request in writing to ${sd}. Under GaDOE Rule 160-4-7-.04, the school district must complete the evaluation and determine eligibility within 60 calendar days of receiving your signed consent.`
      },
      {
        q: 'Can we get Georgia Medicaid and therapy funding for [diagnosis] if our household income is too high?',
        a: (county, rc, sd, wage, payout, diagnosis) => `Yes. Georgia's GAPP program and the NOW/COMP waivers utilize institutional deeming, which completely bypasses parental income and resources, qualifying the child for full-scope Medicaid.`
      }
    ]
  },
  'alabama': {
    name: 'Alabama',
    code: 'AL',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Alabama Department of Mental Health.',
    waiverProgram: 'Alabama HCBS Waiver',
    personalCareProgram: 'Alabama Medicaid Personal Care',
    medicaidName: 'Alabama Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Alabama Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Alabama disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Alabama Medicaid Agency',
    ddAgency: 'Alabama Department of Mental Health',
    educationAgency: 'Alabama Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Alabama Early Intervention',
    ableProgram: 'Alabama ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'al-dd-waiver', 'al-dd-self-direction', 'al-medicaid', 'al-personal-care', 'al-chip',
      'al-early-intervention', 'al-special-education', 'al-able', 'al-ssi-child', 'al-transition-services'
    ],
    requiredForms: [
      'al-medicaid-app', 'al-dd-intake-request', 'al-dd-eligibility-guide', 'al-personal-care-app', 'al-personal-care-agreement',
      'al-chip-app', 'al-ei-referral', 'al-iep-evaluation-request', 'al-iep-appeal', 'al-prior-written-notice',
      'al-due-process', 'al-state-complaint', 'al-records-request', 'al-iee-request', 'al-able-opening',
      'al-ssi-checklist', 'al-transition-app', 'al-dd-self-direction-guide', 'al-medicaid-renewal', 'al-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'jefferson-al', 'madison-al'
    ],
    faqs: []
  },
  'alaska': {
    name: 'Alaska',
    code: 'AK',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Alaska Division of Senior and Disabilities Services.',
    waiverProgram: 'Alaska HCBS Waivers',
    personalCareProgram: 'Alaska Personal Care Services',
    medicaidName: 'Alaska Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Alaska Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Alaska disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Alaska Medicaid Agency',
    ddAgency: 'Alaska Division of Senior and Disabilities Services',
    educationAgency: 'Alaska Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Alaska Early Intervention',
    ableProgram: 'Alaska ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'ak-dd-waiver', 'ak-dd-self-direction', 'ak-medicaid', 'ak-personal-care', 'ak-chip',
      'ak-early-intervention', 'ak-special-education', 'ak-able', 'ak-ssi-child', 'ak-transition-services'
    ],
    requiredForms: [
      'ak-medicaid-app', 'ak-dd-intake-request', 'ak-dd-eligibility-guide', 'ak-personal-care-app', 'ak-personal-care-agreement',
      'ak-chip-app', 'ak-ei-referral', 'ak-iep-evaluation-request', 'ak-iep-appeal', 'ak-prior-written-notice',
      'ak-due-process', 'ak-state-complaint', 'ak-records-request', 'ak-iee-request', 'ak-able-opening',
      'ak-ssi-checklist', 'ak-transition-app', 'ak-dd-self-direction-guide', 'ak-medicaid-renewal', 'ak-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'anchorage-ak', 'matanuska-susitna-borough-ak'
    ],
    faqs: []
  },
  'arizona': {
    name: 'Arizona',
    code: 'AZ',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Arizona Division of Developmental Disabilities.',
    waiverProgram: 'Arizona HCBS Waivers',
    personalCareProgram: 'AHCCCS Medical Assistance',
    medicaidName: 'Arizona Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Arizona Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Arizona disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Arizona Medicaid Agency',
    ddAgency: 'Arizona Division of Developmental Disabilities',
    educationAgency: 'Arizona Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Arizona Early Intervention',
    ableProgram: 'Arizona ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'az-dd-waiver', 'az-dd-self-direction', 'az-medicaid', 'az-personal-care', 'az-chip',
      'az-early-intervention', 'az-special-education', 'az-able', 'az-ssi-child', 'az-transition-services'
    ],
    requiredForms: [
      'az-medicaid-app', 'az-dd-intake-request', 'az-dd-eligibility-guide', 'az-personal-care-app', 'az-personal-care-agreement',
      'az-chip-app', 'az-ei-referral', 'az-iep-evaluation-request', 'az-iep-appeal', 'az-prior-written-notice',
      'az-due-process', 'az-state-complaint', 'az-records-request', 'az-iee-request', 'az-able-opening',
      'az-ssi-checklist', 'az-transition-app', 'az-dd-self-direction-guide', 'az-medicaid-renewal', 'az-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'maricopa-az', 'pima-az'
    ],
    faqs: []
  },
  'arkansas': {
    name: 'Arkansas',
    code: 'AR',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Arkansas Division of Developmental Disabilities Services.',
    waiverProgram: 'Arkansas HCBS Waivers',
    personalCareProgram: 'Arkansas Medicaid Personal Care',
    medicaidName: 'Arkansas Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Arkansas Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Arkansas disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Arkansas Medicaid Agency',
    ddAgency: 'Arkansas Division of Developmental Disabilities Services',
    educationAgency: 'Arkansas Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Arkansas Early Intervention',
    ableProgram: 'Arkansas ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'ar-dd-waiver', 'ar-dd-self-direction', 'ar-medicaid', 'ar-personal-care', 'ar-chip',
      'ar-early-intervention', 'ar-special-education', 'ar-able', 'ar-ssi-child', 'ar-transition-services'
    ],
    requiredForms: [
      'ar-medicaid-app', 'ar-dd-intake-request', 'ar-dd-eligibility-guide', 'ar-personal-care-app', 'ar-personal-care-agreement',
      'ar-chip-app', 'ar-ei-referral', 'ar-iep-evaluation-request', 'ar-iep-appeal', 'ar-prior-written-notice',
      'ar-due-process', 'ar-state-complaint', 'ar-records-request', 'ar-iee-request', 'ar-able-opening',
      'ar-ssi-checklist', 'ar-transition-app', 'ar-dd-self-direction-guide', 'ar-medicaid-renewal', 'ar-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'pulaski-ar', 'benton-ar'
    ],
    faqs: []
  },
  'colorado': {
    name: 'Colorado',
    code: 'CO',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Colorado Division for Developmental Disabilities.',
    waiverProgram: 'Colorado HCBS Waivers',
    personalCareProgram: 'Colorado Medicaid Personal Care',
    medicaidName: 'Colorado Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Colorado Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Colorado disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Colorado Medicaid Agency',
    ddAgency: 'Colorado Division for Developmental Disabilities',
    educationAgency: 'Colorado Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Colorado Early Intervention',
    ableProgram: 'Colorado ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'co-dd-waiver', 'co-dd-self-direction', 'co-medicaid', 'co-personal-care', 'co-chip',
      'co-early-intervention', 'co-special-education', 'co-able', 'co-ssi-child', 'co-transition-services'
    ],
    requiredForms: [
      'co-medicaid-app', 'co-dd-intake-request', 'co-dd-eligibility-guide', 'co-personal-care-app', 'co-personal-care-agreement',
      'co-chip-app', 'co-ei-referral', 'co-iep-evaluation-request', 'co-iep-appeal', 'co-prior-written-notice',
      'co-due-process', 'co-state-complaint', 'co-records-request', 'co-iee-request', 'co-able-opening',
      'co-ssi-checklist', 'co-transition-app', 'co-dd-self-direction-guide', 'co-medicaid-renewal', 'co-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'el-paso-co', 'city-and-county-of-denver-co'
    ],
    faqs: []
  },
  'connecticut': {
    name: 'Connecticut',
    code: 'CT',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Connecticut Department of Developmental Services.',
    waiverProgram: 'Connecticut HCBS Waivers',
    personalCareProgram: 'Connecticut Medicaid Personal Care',
    medicaidName: 'Connecticut Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Connecticut Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Connecticut disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Connecticut Medicaid Agency',
    ddAgency: 'Connecticut Department of Developmental Services',
    educationAgency: 'Connecticut Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Connecticut Early Intervention',
    ableProgram: 'Connecticut ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'ct-dd-waiver', 'ct-dd-self-direction', 'ct-medicaid', 'ct-personal-care', 'ct-chip',
      'ct-early-intervention', 'ct-special-education', 'ct-able', 'ct-ssi-child', 'ct-transition-services'
    ],
    requiredForms: [
      'ct-medicaid-app', 'ct-dd-intake-request', 'ct-dd-eligibility-guide', 'ct-personal-care-app', 'ct-personal-care-agreement',
      'ct-chip-app', 'ct-ei-referral', 'ct-iep-evaluation-request', 'ct-iep-appeal', 'ct-prior-written-notice',
      'ct-due-process', 'ct-state-complaint', 'ct-records-request', 'ct-iee-request', 'ct-able-opening',
      'ct-ssi-checklist', 'ct-transition-app', 'ct-dd-self-direction-guide', 'ct-medicaid-renewal', 'ct-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'fairfield-ct', 'hartford-ct'
    ],
    faqs: []
  },
  'delaware': {
    name: 'Delaware',
    code: 'DE',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Delaware Division of Developmental Disabilities Services.',
    waiverProgram: 'Delaware HCBS Waivers',
    personalCareProgram: 'Delaware Medicaid Personal Care',
    medicaidName: 'Delaware Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Delaware Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Delaware disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Delaware Medicaid Agency',
    ddAgency: 'Delaware Division of Developmental Disabilities Services',
    educationAgency: 'Delaware Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Delaware Early Intervention',
    ableProgram: 'Delaware ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'de-dd-waiver', 'de-dd-self-direction', 'de-medicaid', 'de-personal-care', 'de-chip',
      'de-early-intervention', 'de-special-education', 'de-able', 'de-ssi-child', 'de-transition-services'
    ],
    requiredForms: [
      'de-medicaid-app', 'de-dd-intake-request', 'de-dd-eligibility-guide', 'de-personal-care-app', 'de-personal-care-agreement',
      'de-chip-app', 'de-ei-referral', 'de-iep-evaluation-request', 'de-iep-appeal', 'de-prior-written-notice',
      'de-due-process', 'de-state-complaint', 'de-records-request', 'de-iee-request', 'de-able-opening',
      'de-ssi-checklist', 'de-transition-app', 'de-dd-self-direction-guide', 'de-medicaid-renewal', 'de-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'new-castle-de', 'sussex-de'
    ],
    faqs: []
  },
  'hawaii': {
    name: 'Hawaii',
    code: 'HI',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Hawaii Developmental Disabilities Division.',
    waiverProgram: 'Hawaii HCBS Waivers',
    personalCareProgram: 'Hawaii Medicaid Personal Care',
    medicaidName: 'Hawaii Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Hawaii Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Hawaii disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Hawaii Medicaid Agency',
    ddAgency: 'Hawaii Developmental Disabilities Division',
    educationAgency: 'Hawaii Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Hawaii Early Intervention',
    ableProgram: 'Hawaii ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'hi-dd-waiver', 'hi-dd-self-direction', 'hi-medicaid', 'hi-personal-care', 'hi-chip',
      'hi-early-intervention', 'hi-special-education', 'hi-able', 'hi-ssi-child', 'hi-transition-services'
    ],
    requiredForms: [
      'hi-medicaid-app', 'hi-dd-intake-request', 'hi-dd-eligibility-guide', 'hi-personal-care-app', 'hi-personal-care-agreement',
      'hi-chip-app', 'hi-ei-referral', 'hi-iep-evaluation-request', 'hi-iep-appeal', 'hi-prior-written-notice',
      'hi-due-process', 'hi-state-complaint', 'hi-records-request', 'hi-iee-request', 'hi-able-opening',
      'hi-ssi-checklist', 'hi-transition-app', 'hi-dd-self-direction-guide', 'hi-medicaid-renewal', 'hi-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'honolulu-hi', 'hawai-i-hi'
    ],
    faqs: []
  },
  'idaho': {
    name: 'Idaho',
    code: 'ID',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Idaho Department of Health and Welfare.',
    waiverProgram: 'Idaho HCBS Waivers',
    personalCareProgram: 'Idaho Medicaid Personal Care',
    medicaidName: 'Idaho Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Idaho Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Idaho disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Idaho Medicaid Agency',
    ddAgency: 'Idaho Department of Health and Welfare',
    educationAgency: 'Idaho Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Idaho Early Intervention',
    ableProgram: 'Idaho ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'id-dd-waiver', 'id-dd-self-direction', 'id-medicaid', 'id-personal-care', 'id-chip',
      'id-early-intervention', 'id-special-education', 'id-able', 'id-ssi-child', 'id-transition-services'
    ],
    requiredForms: [
      'id-medicaid-app', 'id-dd-intake-request', 'id-dd-eligibility-guide', 'id-personal-care-app', 'id-personal-care-agreement',
      'id-chip-app', 'id-ei-referral', 'id-iep-evaluation-request', 'id-iep-appeal', 'id-prior-written-notice',
      'id-due-process', 'id-state-complaint', 'id-records-request', 'id-iee-request', 'id-able-opening',
      'id-ssi-checklist', 'id-transition-app', 'id-dd-self-direction-guide', 'id-medicaid-renewal', 'id-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'ada-id', 'canyon-id'
    ],
    faqs: []
  },
  'indiana': {
    name: 'Indiana',
    code: 'IN',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Indiana Division of Disability and Rehabilitative Services.',
    waiverProgram: 'Indiana HCBS Waivers',
    personalCareProgram: 'Indiana Medicaid Personal Care',
    medicaidName: 'Indiana Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Indiana Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Indiana disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Indiana Medicaid Agency',
    ddAgency: 'Indiana Division of Disability and Rehabilitative Services',
    educationAgency: 'Indiana Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Indiana Early Intervention',
    ableProgram: 'Indiana ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'in-dd-waiver', 'in-dd-self-direction', 'in-medicaid', 'in-personal-care', 'in-chip',
      'in-early-intervention', 'in-special-education', 'in-able', 'in-ssi-child', 'in-transition-services'
    ],
    requiredForms: [
      'in-medicaid-app', 'in-dd-intake-request', 'in-dd-eligibility-guide', 'in-personal-care-app', 'in-personal-care-agreement',
      'in-chip-app', 'in-ei-referral', 'in-iep-evaluation-request', 'in-iep-appeal', 'in-prior-written-notice',
      'in-due-process', 'in-state-complaint', 'in-records-request', 'in-iee-request', 'in-able-opening',
      'in-ssi-checklist', 'in-transition-app', 'in-dd-self-direction-guide', 'in-medicaid-renewal', 'in-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'marion-in', 'lake-in'
    ],
    faqs: []
  },
  'iowa': {
    name: 'Iowa',
    code: 'IA',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Iowa Department of Health and Human Services.',
    waiverProgram: 'Iowa HCBS Waivers',
    personalCareProgram: 'Iowa Medicaid Personal Care',
    medicaidName: 'Iowa Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Iowa Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Iowa disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Iowa Medicaid Agency',
    ddAgency: 'Iowa Department of Health and Human Services',
    educationAgency: 'Iowa Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Iowa Early Intervention',
    ableProgram: 'Iowa ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'ia-dd-waiver', 'ia-dd-self-direction', 'ia-medicaid', 'ia-personal-care', 'ia-chip',
      'ia-early-intervention', 'ia-special-education', 'ia-able', 'ia-ssi-child', 'ia-transition-services'
    ],
    requiredForms: [
      'ia-medicaid-app', 'ia-dd-intake-request', 'ia-dd-eligibility-guide', 'ia-personal-care-app', 'ia-personal-care-agreement',
      'ia-chip-app', 'ia-ei-referral', 'ia-iep-evaluation-request', 'ia-iep-appeal', 'ia-prior-written-notice',
      'ia-due-process', 'ia-state-complaint', 'ia-records-request', 'ia-iee-request', 'ia-able-opening',
      'ia-ssi-checklist', 'ia-transition-app', 'ia-dd-self-direction-guide', 'ia-medicaid-renewal', 'ia-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'polk-ia', 'linn-ia'
    ],
    faqs: []
  },
  'kansas': {
    name: 'Kansas',
    code: 'KS',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Kansas Department for Aging and Disability Services.',
    waiverProgram: 'Kansas HCBS Waivers',
    personalCareProgram: 'Kansas Medicaid Personal Care',
    medicaidName: 'Kansas Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Kansas Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Kansas disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Kansas Medicaid Agency',
    ddAgency: 'Kansas Department for Aging and Disability Services',
    educationAgency: 'Kansas Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Kansas Early Intervention',
    ableProgram: 'Kansas ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'ks-dd-waiver', 'ks-dd-self-direction', 'ks-medicaid', 'ks-personal-care', 'ks-chip',
      'ks-early-intervention', 'ks-special-education', 'ks-able', 'ks-ssi-child', 'ks-transition-services'
    ],
    requiredForms: [
      'ks-medicaid-app', 'ks-dd-intake-request', 'ks-dd-eligibility-guide', 'ks-personal-care-app', 'ks-personal-care-agreement',
      'ks-chip-app', 'ks-ei-referral', 'ks-iep-evaluation-request', 'ks-iep-appeal', 'ks-prior-written-notice',
      'ks-due-process', 'ks-state-complaint', 'ks-records-request', 'ks-iee-request', 'ks-able-opening',
      'ks-ssi-checklist', 'ks-transition-app', 'ks-dd-self-direction-guide', 'ks-medicaid-renewal', 'ks-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'johnson-ks', 'sedgwick-ks'
    ],
    faqs: []
  },
  'kentucky': {
    name: 'Kentucky',
    code: 'KY',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Kentucky Department for Behavioral Health, Developmental and Intellectual Disabilities.',
    waiverProgram: 'Kentucky HCBS Waivers',
    personalCareProgram: 'Kentucky Medicaid Personal Care',
    medicaidName: 'Kentucky Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Kentucky Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Kentucky disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Kentucky Medicaid Agency',
    ddAgency: 'Kentucky Department for Behavioral Health, Developmental and Intellectual Disabilities',
    educationAgency: 'Kentucky Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Kentucky Early Intervention',
    ableProgram: 'Kentucky ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'ky-dd-waiver', 'ky-dd-self-direction', 'ky-medicaid', 'ky-personal-care', 'ky-chip',
      'ky-early-intervention', 'ky-special-education', 'ky-able', 'ky-ssi-child', 'ky-transition-services'
    ],
    requiredForms: [
      'ky-medicaid-app', 'ky-dd-intake-request', 'ky-dd-eligibility-guide', 'ky-personal-care-app', 'ky-personal-care-agreement',
      'ky-chip-app', 'ky-ei-referral', 'ky-iep-evaluation-request', 'ky-iep-appeal', 'ky-prior-written-notice',
      'ky-due-process', 'ky-state-complaint', 'ky-records-request', 'ky-iee-request', 'ky-able-opening',
      'ky-ssi-checklist', 'ky-transition-app', 'ky-dd-self-direction-guide', 'ky-medicaid-renewal', 'ky-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'jefferson-ky', 'fayette-ky'
    ],
    faqs: []
  },
  'louisiana': {
    name: 'Louisiana',
    code: 'LA',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Louisiana Office for Citizens with Developmental Disabilities.',
    waiverProgram: 'Louisiana HCBS Waivers',
    personalCareProgram: 'Louisiana Medicaid Personal Care',
    medicaidName: 'Louisiana Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Louisiana Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Louisiana disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Louisiana Medicaid Agency',
    ddAgency: 'Louisiana Office for Citizens with Developmental Disabilities',
    educationAgency: 'Louisiana Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Louisiana Early Intervention',
    ableProgram: 'Louisiana ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'la-dd-waiver', 'la-dd-self-direction', 'la-medicaid', 'la-personal-care', 'la-chip',
      'la-early-intervention', 'la-special-education', 'la-able', 'la-ssi-child', 'la-transition-services'
    ],
    requiredForms: [
      'la-medicaid-app', 'la-dd-intake-request', 'la-dd-eligibility-guide', 'la-personal-care-app', 'la-personal-care-agreement',
      'la-chip-app', 'la-ei-referral', 'la-iep-evaluation-request', 'la-iep-appeal', 'la-prior-written-notice',
      'la-due-process', 'la-state-complaint', 'la-records-request', 'la-iee-request', 'la-able-opening',
      'la-ssi-checklist', 'la-transition-app', 'la-dd-self-direction-guide', 'la-medicaid-renewal', 'la-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'east-baton-rouge-parish-la', 'jefferson-parish-la'
    ],
    faqs: []
  },
  'maine': {
    name: 'Maine',
    code: 'ME',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Maine Office of Aging and Disability Services.',
    waiverProgram: 'Maine HCBS Waivers',
    personalCareProgram: 'MaineCare Personal Care Services',
    medicaidName: 'Maine Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Maine Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Maine disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Maine Medicaid Agency',
    ddAgency: 'Maine Office of Aging and Disability Services',
    educationAgency: 'Maine Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Maine Early Intervention',
    ableProgram: 'Maine ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'me-dd-waiver', 'me-dd-self-direction', 'me-medicaid', 'me-personal-care', 'me-chip',
      'me-early-intervention', 'me-special-education', 'me-able', 'me-ssi-child', 'me-transition-services'
    ],
    requiredForms: [
      'me-medicaid-app', 'me-dd-intake-request', 'me-dd-eligibility-guide', 'me-personal-care-app', 'me-personal-care-agreement',
      'me-chip-app', 'me-ei-referral', 'me-iep-evaluation-request', 'me-iep-appeal', 'me-prior-written-notice',
      'me-due-process', 'me-state-complaint', 'me-records-request', 'me-iee-request', 'me-able-opening',
      'me-ssi-checklist', 'me-transition-app', 'me-dd-self-direction-guide', 'me-medicaid-renewal', 'me-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'cumberland-me', 'york-me'
    ],
    faqs: []
  },
  'maryland': {
    name: 'Maryland',
    code: 'MD',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Maryland Developmental Disabilities Administration.',
    waiverProgram: 'Maryland HCBS Waivers',
    personalCareProgram: 'Maryland Medicaid Personal Care',
    medicaidName: 'Maryland Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Maryland Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Maryland disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Maryland Medicaid Agency',
    ddAgency: 'Maryland Developmental Disabilities Administration',
    educationAgency: 'Maryland Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Maryland Early Intervention',
    ableProgram: 'Maryland ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'md-dd-waiver', 'md-dd-self-direction', 'md-medicaid', 'md-personal-care', 'md-chip',
      'md-early-intervention', 'md-special-education', 'md-able', 'md-ssi-child', 'md-transition-services'
    ],
    requiredForms: [
      'md-medicaid-app', 'md-dd-intake-request', 'md-dd-eligibility-guide', 'md-personal-care-app', 'md-personal-care-agreement',
      'md-chip-app', 'md-ei-referral', 'md-iep-evaluation-request', 'md-iep-appeal', 'md-prior-written-notice',
      'md-due-process', 'md-state-complaint', 'md-records-request', 'md-iee-request', 'md-able-opening',
      'md-ssi-checklist', 'md-transition-app', 'md-dd-self-direction-guide', 'md-medicaid-renewal', 'md-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'montgomery-md', 'prince-george-s-md'
    ],
    faqs: []
  },
  'massachusetts': {
    name: 'Massachusetts',
    code: 'MA',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Massachusetts Department of Developmental Services.',
    waiverProgram: 'Massachusetts HCBS Waivers',
    personalCareProgram: 'MassHealth Personal Care Attendant Program',
    medicaidName: 'Massachusetts Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Massachusetts Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Massachusetts disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Massachusetts Medicaid Agency',
    ddAgency: 'Massachusetts Department of Developmental Services',
    educationAgency: 'Massachusetts Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Massachusetts Early Intervention',
    ableProgram: 'Massachusetts ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'ma-dd-waiver', 'ma-dd-self-direction', 'ma-medicaid', 'ma-personal-care', 'ma-chip',
      'ma-early-intervention', 'ma-special-education', 'ma-able', 'ma-ssi-child', 'ma-transition-services'
    ],
    requiredForms: [
      'ma-medicaid-app', 'ma-dd-intake-request', 'ma-dd-eligibility-guide', 'ma-personal-care-app', 'ma-personal-care-agreement',
      'ma-chip-app', 'ma-ei-referral', 'ma-iep-evaluation-request', 'ma-iep-appeal', 'ma-prior-written-notice',
      'ma-due-process', 'ma-state-complaint', 'ma-records-request', 'ma-iee-request', 'ma-able-opening',
      'ma-ssi-checklist', 'ma-transition-app', 'ma-dd-self-direction-guide', 'ma-medicaid-renewal', 'ma-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'middlesex-ma', 'worcester-ma'
    ],
    faqs: []
  },
  'michigan': {
    name: 'Michigan',
    code: 'MI',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Michigan Department of Health and Human Services.',
    waiverProgram: 'Michigan HCBS Waivers',
    personalCareProgram: 'Michigan Medicaid Personal Care',
    medicaidName: 'Michigan Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Michigan Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Michigan disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Michigan Medicaid Agency',
    ddAgency: 'Michigan Department of Health and Human Services',
    educationAgency: 'Michigan Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Michigan Early Intervention',
    ableProgram: 'Michigan ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'mi-dd-waiver', 'mi-dd-self-direction', 'mi-medicaid', 'mi-personal-care', 'mi-chip',
      'mi-early-intervention', 'mi-special-education', 'mi-able', 'mi-ssi-child', 'mi-transition-services'
    ],
    requiredForms: [
      'mi-medicaid-app', 'mi-dd-intake-request', 'mi-dd-eligibility-guide', 'mi-personal-care-app', 'mi-personal-care-agreement',
      'mi-chip-app', 'mi-ei-referral', 'mi-iep-evaluation-request', 'mi-iep-appeal', 'mi-prior-written-notice',
      'mi-due-process', 'mi-state-complaint', 'mi-records-request', 'mi-iee-request', 'mi-able-opening',
      'mi-ssi-checklist', 'mi-transition-app', 'mi-dd-self-direction-guide', 'mi-medicaid-renewal', 'mi-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'wayne-mi', 'oakland-mi'
    ],
    faqs: []
  },
  'minnesota': {
    name: 'Minnesota',
    code: 'MN',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Minnesota Department of Human Services.',
    waiverProgram: 'Minnesota HCBS Waivers',
    personalCareProgram: 'Minnesota Personal Care Assistance',
    medicaidName: 'Minnesota Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Minnesota Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Minnesota disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Minnesota Medicaid Agency',
    ddAgency: 'Minnesota Department of Human Services',
    educationAgency: 'Minnesota Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Minnesota Early Intervention',
    ableProgram: 'Minnesota ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'mn-dd-waiver', 'mn-dd-self-direction', 'mn-medicaid', 'mn-personal-care', 'mn-chip',
      'mn-early-intervention', 'mn-special-education', 'mn-able', 'mn-ssi-child', 'mn-transition-services'
    ],
    requiredForms: [
      'mn-medicaid-app', 'mn-dd-intake-request', 'mn-dd-eligibility-guide', 'mn-personal-care-app', 'mn-personal-care-agreement',
      'mn-chip-app', 'mn-ei-referral', 'mn-iep-evaluation-request', 'mn-iep-appeal', 'mn-prior-written-notice',
      'mn-due-process', 'mn-state-complaint', 'mn-records-request', 'mn-iee-request', 'mn-able-opening',
      'mn-ssi-checklist', 'mn-transition-app', 'mn-dd-self-direction-guide', 'mn-medicaid-renewal', 'mn-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'hennepin-mn', 'ramsey-mn'
    ],
    faqs: []
  },
  'mississippi': {
    name: 'Mississippi',
    code: 'MS',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Mississippi Department of Mental Health.',
    waiverProgram: 'Mississippi HCBS Waivers',
    personalCareProgram: 'Mississippi Medicaid Personal Care',
    medicaidName: 'Mississippi Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Mississippi Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Mississippi disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Mississippi Medicaid Agency',
    ddAgency: 'Mississippi Department of Mental Health',
    educationAgency: 'Mississippi Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Mississippi Early Intervention',
    ableProgram: 'Mississippi ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'ms-dd-waiver', 'ms-dd-self-direction', 'ms-medicaid', 'ms-personal-care', 'ms-chip',
      'ms-early-intervention', 'ms-special-education', 'ms-able', 'ms-ssi-child', 'ms-transition-services'
    ],
    requiredForms: [
      'ms-medicaid-app', 'ms-dd-intake-request', 'ms-dd-eligibility-guide', 'ms-personal-care-app', 'ms-personal-care-agreement',
      'ms-chip-app', 'ms-ei-referral', 'ms-iep-evaluation-request', 'ms-iep-appeal', 'ms-prior-written-notice',
      'ms-due-process', 'ms-state-complaint', 'ms-records-request', 'ms-iee-request', 'ms-able-opening',
      'ms-ssi-checklist', 'ms-transition-app', 'ms-dd-self-direction-guide', 'ms-medicaid-renewal', 'ms-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'harrison-ms', 'hinds-ms'
    ],
    faqs: []
  },
  'missouri': {
    name: 'Missouri',
    code: 'MO',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Missouri Division of Developmental Disabilities.',
    waiverProgram: 'Missouri HCBS Waivers',
    personalCareProgram: 'Missouri Medicaid Personal Care',
    medicaidName: 'Missouri Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Missouri Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Missouri disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Missouri Medicaid Agency',
    ddAgency: 'Missouri Division of Developmental Disabilities',
    educationAgency: 'Missouri Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Missouri Early Intervention',
    ableProgram: 'Missouri ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'mo-dd-waiver', 'mo-dd-self-direction', 'mo-medicaid', 'mo-personal-care', 'mo-chip',
      'mo-early-intervention', 'mo-special-education', 'mo-able', 'mo-ssi-child', 'mo-transition-services'
    ],
    requiredForms: [
      'mo-medicaid-app', 'mo-dd-intake-request', 'mo-dd-eligibility-guide', 'mo-personal-care-app', 'mo-personal-care-agreement',
      'mo-chip-app', 'mo-ei-referral', 'mo-iep-evaluation-request', 'mo-iep-appeal', 'mo-prior-written-notice',
      'mo-due-process', 'mo-state-complaint', 'mo-records-request', 'mo-iee-request', 'mo-able-opening',
      'mo-ssi-checklist', 'mo-transition-app', 'mo-dd-self-direction-guide', 'mo-medicaid-renewal', 'mo-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'saint-louis-mo', 'jackson-mo'
    ],
    faqs: []
  },
  'montana': {
    name: 'Montana',
    code: 'MT',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Montana Developmental Disabilities Program.',
    waiverProgram: 'Montana HCBS Waivers',
    personalCareProgram: 'Montana Medicaid Personal Care',
    medicaidName: 'Montana Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Montana Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Montana disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Montana Medicaid Agency',
    ddAgency: 'Montana Developmental Disabilities Program',
    educationAgency: 'Montana Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Montana Early Intervention',
    ableProgram: 'Montana ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'mt-dd-waiver', 'mt-dd-self-direction', 'mt-medicaid', 'mt-personal-care', 'mt-chip',
      'mt-early-intervention', 'mt-special-education', 'mt-able', 'mt-ssi-child', 'mt-transition-services'
    ],
    requiredForms: [
      'mt-medicaid-app', 'mt-dd-intake-request', 'mt-dd-eligibility-guide', 'mt-personal-care-app', 'mt-personal-care-agreement',
      'mt-chip-app', 'mt-ei-referral', 'mt-iep-evaluation-request', 'mt-iep-appeal', 'mt-prior-written-notice',
      'mt-due-process', 'mt-state-complaint', 'mt-records-request', 'mt-iee-request', 'mt-able-opening',
      'mt-ssi-checklist', 'mt-transition-app', 'mt-dd-self-direction-guide', 'mt-medicaid-renewal', 'mt-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'yellowstone-mt', 'gallatin-mt'
    ],
    faqs: []
  },
  'nebraska': {
    name: 'Nebraska',
    code: 'NE',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Nebraska Division of Developmental Disabilities.',
    waiverProgram: 'Nebraska HCBS Waivers',
    personalCareProgram: 'Nebraska Medicaid Personal Care',
    medicaidName: 'Nebraska Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Nebraska Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Nebraska disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Nebraska Medicaid Agency',
    ddAgency: 'Nebraska Division of Developmental Disabilities',
    educationAgency: 'Nebraska Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Nebraska Early Intervention',
    ableProgram: 'Nebraska ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'ne-dd-waiver', 'ne-dd-self-direction', 'ne-medicaid', 'ne-personal-care', 'ne-chip',
      'ne-early-intervention', 'ne-special-education', 'ne-able', 'ne-ssi-child', 'ne-transition-services'
    ],
    requiredForms: [
      'ne-medicaid-app', 'ne-dd-intake-request', 'ne-dd-eligibility-guide', 'ne-personal-care-app', 'ne-personal-care-agreement',
      'ne-chip-app', 'ne-ei-referral', 'ne-iep-evaluation-request', 'ne-iep-appeal', 'ne-prior-written-notice',
      'ne-due-process', 'ne-state-complaint', 'ne-records-request', 'ne-iee-request', 'ne-able-opening',
      'ne-ssi-checklist', 'ne-transition-app', 'ne-dd-self-direction-guide', 'ne-medicaid-renewal', 'ne-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'douglas-ne', 'lancaster-ne'
    ],
    faqs: []
  },
  'nevada': {
    name: 'Nevada',
    code: 'NV',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Nevada Aging and Disability Services Division.',
    waiverProgram: 'Nevada HCBS Waivers',
    personalCareProgram: 'Nevada Medicaid Personal Care',
    medicaidName: 'Nevada Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Nevada Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Nevada disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Nevada Medicaid Agency',
    ddAgency: 'Nevada Aging and Disability Services Division',
    educationAgency: 'Nevada Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Nevada Early Intervention',
    ableProgram: 'Nevada ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'nv-dd-waiver', 'nv-dd-self-direction', 'nv-medicaid', 'nv-personal-care', 'nv-chip',
      'nv-early-intervention', 'nv-special-education', 'nv-able', 'nv-ssi-child', 'nv-transition-services'
    ],
    requiredForms: [
      'nv-medicaid-app', 'nv-dd-intake-request', 'nv-dd-eligibility-guide', 'nv-personal-care-app', 'nv-personal-care-agreement',
      'nv-chip-app', 'nv-ei-referral', 'nv-iep-evaluation-request', 'nv-iep-appeal', 'nv-prior-written-notice',
      'nv-due-process', 'nv-state-complaint', 'nv-records-request', 'nv-iee-request', 'nv-able-opening',
      'nv-ssi-checklist', 'nv-transition-app', 'nv-dd-self-direction-guide', 'nv-medicaid-renewal', 'nv-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'clark-nv', 'washoe-nv'
    ],
    faqs: []
  },
  'new-hampshire': {
    name: 'New Hampshire',
    code: 'NH',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for New Hampshire Bureau of Developmental Services.',
    waiverProgram: 'New Hampshire HCBS Waivers',
    personalCareProgram: 'New Hampshire Medicaid Personal Care',
    medicaidName: 'New Hampshire Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'New Hampshire Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for New Hampshire disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'New Hampshire Medicaid Agency',
    ddAgency: 'New Hampshire Bureau of Developmental Services',
    educationAgency: 'New Hampshire Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'New Hampshire Early Intervention',
    ableProgram: 'New Hampshire ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'nh-dd-waiver', 'nh-dd-self-direction', 'nh-medicaid', 'nh-personal-care', 'nh-chip',
      'nh-early-intervention', 'nh-special-education', 'nh-able', 'nh-ssi-child', 'nh-transition-services'
    ],
    requiredForms: [
      'nh-medicaid-app', 'nh-dd-intake-request', 'nh-dd-eligibility-guide', 'nh-personal-care-app', 'nh-personal-care-agreement',
      'nh-chip-app', 'nh-ei-referral', 'nh-iep-evaluation-request', 'nh-iep-appeal', 'nh-prior-written-notice',
      'nh-due-process', 'nh-state-complaint', 'nh-records-request', 'nh-iee-request', 'nh-able-opening',
      'nh-ssi-checklist', 'nh-transition-app', 'nh-dd-self-direction-guide', 'nh-medicaid-renewal', 'nh-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'hillsborough-nh', 'rockingham-nh'
    ],
    faqs: []
  },
  'new-jersey': {
    name: 'New Jersey',
    code: 'NJ',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for New Jersey Division of Developmental Disabilities.',
    waiverProgram: 'New Jersey HCBS Waivers',
    personalCareProgram: 'New Jersey Personal Care Assistant Program',
    medicaidName: 'New Jersey Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'New Jersey Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for New Jersey disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'New Jersey Medicaid Agency',
    ddAgency: 'New Jersey Division of Developmental Disabilities',
    educationAgency: 'New Jersey Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'New Jersey Early Intervention',
    ableProgram: 'New Jersey ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'nj-dd-waiver', 'nj-dd-self-direction', 'nj-medicaid', 'nj-personal-care', 'nj-chip',
      'nj-early-intervention', 'nj-special-education', 'nj-able', 'nj-ssi-child', 'nj-transition-services'
    ],
    requiredForms: [
      'nj-medicaid-app', 'nj-dd-intake-request', 'nj-dd-eligibility-guide', 'nj-personal-care-app', 'nj-personal-care-agreement',
      'nj-chip-app', 'nj-ei-referral', 'nj-iep-evaluation-request', 'nj-iep-appeal', 'nj-prior-written-notice',
      'nj-due-process', 'nj-state-complaint', 'nj-records-request', 'nj-iee-request', 'nj-able-opening',
      'nj-ssi-checklist', 'nj-transition-app', 'nj-dd-self-direction-guide', 'nj-medicaid-renewal', 'nj-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'bergen-nj', 'middlesex-nj'
    ],
    faqs: []
  },
  'new-mexico': {
    name: 'New Mexico',
    code: 'NM',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for New Mexico Developmental Disabilities Division.',
    waiverProgram: 'New Mexico HCBS Waivers',
    personalCareProgram: 'New Mexico Medicaid Personal Care',
    medicaidName: 'New Mexico Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'New Mexico Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for New Mexico disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'New Mexico Medicaid Agency',
    ddAgency: 'New Mexico Developmental Disabilities Division',
    educationAgency: 'New Mexico Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'New Mexico Early Intervention',
    ableProgram: 'New Mexico ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'nm-dd-waiver', 'nm-dd-self-direction', 'nm-medicaid', 'nm-personal-care', 'nm-chip',
      'nm-early-intervention', 'nm-special-education', 'nm-able', 'nm-ssi-child', 'nm-transition-services'
    ],
    requiredForms: [
      'nm-medicaid-app', 'nm-dd-intake-request', 'nm-dd-eligibility-guide', 'nm-personal-care-app', 'nm-personal-care-agreement',
      'nm-chip-app', 'nm-ei-referral', 'nm-iep-evaluation-request', 'nm-iep-appeal', 'nm-prior-written-notice',
      'nm-due-process', 'nm-state-complaint', 'nm-records-request', 'nm-iee-request', 'nm-able-opening',
      'nm-ssi-checklist', 'nm-transition-app', 'nm-dd-self-direction-guide', 'nm-medicaid-renewal', 'nm-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'bernalillo-nm', 'do-a-ana-nm'
    ],
    faqs: []
  },
  'north-carolina': {
    name: 'North Carolina',
    code: 'NC',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for North Carolina Division of Mental Health, Developmental Disabilities and Substance Abuse Services.',
    waiverProgram: 'North Carolina Innovations HCBS Waiver',
    personalCareProgram: 'North Carolina Medicaid Personal Care',
    medicaidName: 'North Carolina Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'North Carolina Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for North Carolina disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'North Carolina Medicaid Agency',
    ddAgency: 'North Carolina Division of Mental Health, Developmental Disabilities and Substance Abuse Services',
    educationAgency: 'North Carolina Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'North Carolina Early Intervention',
    ableProgram: 'North Carolina ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'nc-dd-waiver', 'nc-dd-self-direction', 'nc-medicaid', 'nc-personal-care', 'nc-chip',
      'nc-early-intervention', 'nc-special-education', 'nc-able', 'nc-ssi-child', 'nc-transition-services'
    ],
    requiredForms: [
      'nc-medicaid-app', 'nc-dd-intake-request', 'nc-dd-eligibility-guide', 'nc-personal-care-app', 'nc-personal-care-agreement',
      'nc-chip-app', 'nc-ei-referral', 'nc-iep-evaluation-request', 'nc-iep-appeal', 'nc-prior-written-notice',
      'nc-due-process', 'nc-state-complaint', 'nc-records-request', 'nc-iee-request', 'nc-able-opening',
      'nc-ssi-checklist', 'nc-transition-app', 'nc-dd-self-direction-guide', 'nc-medicaid-renewal', 'nc-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'wake-nc', 'mecklenburg-nc'
    ],
    faqs: []
  },
  'north-dakota': {
    name: 'North Dakota',
    code: 'ND',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for North Dakota Developmental Disabilities Division.',
    waiverProgram: 'North Dakota HCBS Waivers',
    personalCareProgram: 'North Dakota Medicaid Personal Care',
    medicaidName: 'North Dakota Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'North Dakota Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for North Dakota disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'North Dakota Medicaid Agency',
    ddAgency: 'North Dakota Developmental Disabilities Division',
    educationAgency: 'North Dakota Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'North Dakota Early Intervention',
    ableProgram: 'North Dakota ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'nd-dd-waiver', 'nd-dd-self-direction', 'nd-medicaid', 'nd-personal-care', 'nd-chip',
      'nd-early-intervention', 'nd-special-education', 'nd-able', 'nd-ssi-child', 'nd-transition-services'
    ],
    requiredForms: [
      'nd-medicaid-app', 'nd-dd-intake-request', 'nd-dd-eligibility-guide', 'nd-personal-care-app', 'nd-personal-care-agreement',
      'nd-chip-app', 'nd-ei-referral', 'nd-iep-evaluation-request', 'nd-iep-appeal', 'nd-prior-written-notice',
      'nd-due-process', 'nd-state-complaint', 'nd-records-request', 'nd-iee-request', 'nd-able-opening',
      'nd-ssi-checklist', 'nd-transition-app', 'nd-dd-self-direction-guide', 'nd-medicaid-renewal', 'nd-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'cass-nd', 'burleigh-nd'
    ],
    faqs: []
  },
  'oklahoma': {
    name: 'Oklahoma',
    code: 'OK',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Oklahoma Developmental Disabilities Services.',
    waiverProgram: 'Oklahoma HCBS Waivers',
    personalCareProgram: 'Oklahoma SoonerCare Personal Care',
    medicaidName: 'Oklahoma Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Oklahoma Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Oklahoma disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Oklahoma Medicaid Agency',
    ddAgency: 'Oklahoma Developmental Disabilities Services',
    educationAgency: 'Oklahoma Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Oklahoma Early Intervention',
    ableProgram: 'Oklahoma ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'ok-dd-waiver', 'ok-dd-self-direction', 'ok-medicaid', 'ok-personal-care', 'ok-chip',
      'ok-early-intervention', 'ok-special-education', 'ok-able', 'ok-ssi-child', 'ok-transition-services'
    ],
    requiredForms: [
      'ok-medicaid-app', 'ok-dd-intake-request', 'ok-dd-eligibility-guide', 'ok-personal-care-app', 'ok-personal-care-agreement',
      'ok-chip-app', 'ok-ei-referral', 'ok-iep-evaluation-request', 'ok-iep-appeal', 'ok-prior-written-notice',
      'ok-due-process', 'ok-state-complaint', 'ok-records-request', 'ok-iee-request', 'ok-able-opening',
      'ok-ssi-checklist', 'ok-transition-app', 'ok-dd-self-direction-guide', 'ok-medicaid-renewal', 'ok-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'oklahoma-ok', 'tulsa-ok'
    ],
    faqs: []
  },
  'oregon': {
    name: 'Oregon',
    code: 'OR',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Oregon Developmental Disability Services.',
    waiverProgram: 'Oregon HCBS Waivers',
    personalCareProgram: 'Oregon Medicaid Personal Care',
    medicaidName: 'Oregon Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Oregon Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Oregon disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Oregon Medicaid Agency',
    ddAgency: 'Oregon Developmental Disability Services',
    educationAgency: 'Oregon Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Oregon Early Intervention',
    ableProgram: 'Oregon ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'or-dd-waiver', 'or-dd-self-direction', 'or-medicaid', 'or-personal-care', 'or-chip',
      'or-early-intervention', 'or-special-education', 'or-able', 'or-ssi-child', 'or-transition-services'
    ],
    requiredForms: [
      'or-medicaid-app', 'or-dd-intake-request', 'or-dd-eligibility-guide', 'or-personal-care-app', 'or-personal-care-agreement',
      'or-chip-app', 'or-ei-referral', 'or-iep-evaluation-request', 'or-iep-appeal', 'or-prior-written-notice',
      'or-due-process', 'or-state-complaint', 'or-records-request', 'or-iee-request', 'or-able-opening',
      'or-ssi-checklist', 'or-transition-app', 'or-dd-self-direction-guide', 'or-medicaid-renewal', 'or-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'multnomah-or', 'washington-or'
    ],
    faqs: []
  },
  'rhode-island': {
    name: 'Rhode Island',
    code: 'RI',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Rhode Island Division of Developmental Disabilities.',
    waiverProgram: 'Rhode Island HCBS Waivers',
    personalCareProgram: 'Rhode Island Medicaid Personal Care',
    medicaidName: 'Rhode Island Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Rhode Island Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Rhode Island disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Rhode Island Medicaid Agency',
    ddAgency: 'Rhode Island Division of Developmental Disabilities',
    educationAgency: 'Rhode Island Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Rhode Island Early Intervention',
    ableProgram: 'Rhode Island ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'ri-dd-waiver', 'ri-dd-self-direction', 'ri-medicaid', 'ri-personal-care', 'ri-chip',
      'ri-early-intervention', 'ri-special-education', 'ri-able', 'ri-ssi-child', 'ri-transition-services'
    ],
    requiredForms: [
      'ri-medicaid-app', 'ri-dd-intake-request', 'ri-dd-eligibility-guide', 'ri-personal-care-app', 'ri-personal-care-agreement',
      'ri-chip-app', 'ri-ei-referral', 'ri-iep-evaluation-request', 'ri-iep-appeal', 'ri-prior-written-notice',
      'ri-due-process', 'ri-state-complaint', 'ri-records-request', 'ri-iee-request', 'ri-able-opening',
      'ri-ssi-checklist', 'ri-transition-app', 'ri-dd-self-direction-guide', 'ri-medicaid-renewal', 'ri-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'providence-ri', 'kent-ri'
    ],
    faqs: []
  },
  'south-carolina': {
    name: 'South Carolina',
    code: 'SC',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for South Carolina Department of Disabilities and Special Needs.',
    waiverProgram: 'South Carolina HCBS Waivers',
    personalCareProgram: 'South Carolina Medicaid Personal Care',
    medicaidName: 'South Carolina Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'South Carolina Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for South Carolina disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'South Carolina Medicaid Agency',
    ddAgency: 'South Carolina Department of Disabilities and Special Needs',
    educationAgency: 'South Carolina Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'South Carolina Early Intervention',
    ableProgram: 'South Carolina ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'sc-dd-waiver', 'sc-dd-self-direction', 'sc-medicaid', 'sc-personal-care', 'sc-chip',
      'sc-early-intervention', 'sc-special-education', 'sc-able', 'sc-ssi-child', 'sc-transition-services'
    ],
    requiredForms: [
      'sc-medicaid-app', 'sc-dd-intake-request', 'sc-dd-eligibility-guide', 'sc-personal-care-app', 'sc-personal-care-agreement',
      'sc-chip-app', 'sc-ei-referral', 'sc-iep-evaluation-request', 'sc-iep-appeal', 'sc-prior-written-notice',
      'sc-due-process', 'sc-state-complaint', 'sc-records-request', 'sc-iee-request', 'sc-able-opening',
      'sc-ssi-checklist', 'sc-transition-app', 'sc-dd-self-direction-guide', 'sc-medicaid-renewal', 'sc-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'greenville-sc', 'richland-sc'
    ],
    faqs: []
  },
  'south-dakota': {
    name: 'South Dakota',
    code: 'SD',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for South Dakota Division of Developmental Disabilities.',
    waiverProgram: 'South Dakota HCBS Waivers',
    personalCareProgram: 'South Dakota Medicaid Personal Care',
    medicaidName: 'South Dakota Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'South Dakota Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for South Dakota disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'South Dakota Medicaid Agency',
    ddAgency: 'South Dakota Division of Developmental Disabilities',
    educationAgency: 'South Dakota Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'South Dakota Early Intervention',
    ableProgram: 'South Dakota ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'sd-dd-waiver', 'sd-dd-self-direction', 'sd-medicaid', 'sd-personal-care', 'sd-chip',
      'sd-early-intervention', 'sd-special-education', 'sd-able', 'sd-ssi-child', 'sd-transition-services'
    ],
    requiredForms: [
      'sd-medicaid-app', 'sd-dd-intake-request', 'sd-dd-eligibility-guide', 'sd-personal-care-app', 'sd-personal-care-agreement',
      'sd-chip-app', 'sd-ei-referral', 'sd-iep-evaluation-request', 'sd-iep-appeal', 'sd-prior-written-notice',
      'sd-due-process', 'sd-state-complaint', 'sd-records-request', 'sd-iee-request', 'sd-able-opening',
      'sd-ssi-checklist', 'sd-transition-app', 'sd-dd-self-direction-guide', 'sd-medicaid-renewal', 'sd-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'minnehaha-sd', 'pennington-sd'
    ],
    faqs: []
  },
  'tennessee': {
    name: 'Tennessee',
    code: 'TN',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Tennessee Department of Intellectual and Developmental Disabilities.',
    waiverProgram: 'Tennessee HCBS Waivers',
    personalCareProgram: 'Tennessee Medicaid Personal Care',
    medicaidName: 'Tennessee Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Tennessee Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Tennessee disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Tennessee Medicaid Agency',
    ddAgency: 'Tennessee Department of Intellectual and Developmental Disabilities',
    educationAgency: 'Tennessee Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Tennessee Early Intervention',
    ableProgram: 'Tennessee ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'tn-dd-waiver', 'tn-dd-self-direction', 'tn-medicaid', 'tn-personal-care', 'tn-chip',
      'tn-early-intervention', 'tn-special-education', 'tn-able', 'tn-ssi-child', 'tn-transition-services'
    ],
    requiredForms: [
      'tn-medicaid-app', 'tn-dd-intake-request', 'tn-dd-eligibility-guide', 'tn-personal-care-app', 'tn-personal-care-agreement',
      'tn-chip-app', 'tn-ei-referral', 'tn-iep-evaluation-request', 'tn-iep-appeal', 'tn-prior-written-notice',
      'tn-due-process', 'tn-state-complaint', 'tn-records-request', 'tn-iee-request', 'tn-able-opening',
      'tn-ssi-checklist', 'tn-transition-app', 'tn-dd-self-direction-guide', 'tn-medicaid-renewal', 'tn-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'shelby-tn', 'davidson-tn'
    ],
    faqs: []
  },
  'utah': {
    name: 'Utah',
    code: 'UT',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Utah Division of Services for People with Disabilities.',
    waiverProgram: 'Utah HCBS Waivers',
    personalCareProgram: 'Utah Medicaid Personal Care',
    medicaidName: 'Utah Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Utah Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Utah disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Utah Medicaid Agency',
    ddAgency: 'Utah Division of Services for People with Disabilities',
    educationAgency: 'Utah Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Utah Early Intervention',
    ableProgram: 'Utah ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'ut-dd-waiver', 'ut-dd-self-direction', 'ut-medicaid', 'ut-personal-care', 'ut-chip',
      'ut-early-intervention', 'ut-special-education', 'ut-able', 'ut-ssi-child', 'ut-transition-services'
    ],
    requiredForms: [
      'ut-medicaid-app', 'ut-dd-intake-request', 'ut-dd-eligibility-guide', 'ut-personal-care-app', 'ut-personal-care-agreement',
      'ut-chip-app', 'ut-ei-referral', 'ut-iep-evaluation-request', 'ut-iep-appeal', 'ut-prior-written-notice',
      'ut-due-process', 'ut-state-complaint', 'ut-records-request', 'ut-iee-request', 'ut-able-opening',
      'ut-ssi-checklist', 'ut-transition-app', 'ut-dd-self-direction-guide', 'ut-medicaid-renewal', 'ut-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'salt-lake-ut', 'utah-ut'
    ],
    faqs: []
  },
  'vermont': {
    name: 'Vermont',
    code: 'VT',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Vermont Developmental Disabilities Services Division.',
    waiverProgram: 'Vermont HCBS Waivers',
    personalCareProgram: 'Vermont Medicaid Personal Care',
    medicaidName: 'Vermont Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Vermont Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Vermont disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Vermont Medicaid Agency',
    ddAgency: 'Vermont Developmental Disabilities Services Division',
    educationAgency: 'Vermont Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Vermont Early Intervention',
    ableProgram: 'Vermont ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'vt-dd-waiver', 'vt-dd-self-direction', 'vt-medicaid', 'vt-personal-care', 'vt-chip',
      'vt-early-intervention', 'vt-special-education', 'vt-able', 'vt-ssi-child', 'vt-transition-services'
    ],
    requiredForms: [
      'vt-medicaid-app', 'vt-dd-intake-request', 'vt-dd-eligibility-guide', 'vt-personal-care-app', 'vt-personal-care-agreement',
      'vt-chip-app', 'vt-ei-referral', 'vt-iep-evaluation-request', 'vt-iep-appeal', 'vt-prior-written-notice',
      'vt-due-process', 'vt-state-complaint', 'vt-records-request', 'vt-iee-request', 'vt-able-opening',
      'vt-ssi-checklist', 'vt-transition-app', 'vt-dd-self-direction-guide', 'vt-medicaid-renewal', 'vt-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'chittenden-vt', 'rutland-vt'
    ],
    faqs: []
  },
  'virginia': {
    name: 'Virginia',
    code: 'VA',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Virginia Department of Behavioral Health and Developmental Services.',
    waiverProgram: 'Virginia HCBS Waivers',
    personalCareProgram: 'Virginia Medicaid Personal Care',
    medicaidName: 'Virginia Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Virginia Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Virginia disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Virginia Medicaid Agency',
    ddAgency: 'Virginia Department of Behavioral Health and Developmental Services',
    educationAgency: 'Virginia Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Virginia Early Intervention',
    ableProgram: 'Virginia ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'va-dd-waiver', 'va-dd-self-direction', 'va-medicaid', 'va-personal-care', 'va-chip',
      'va-early-intervention', 'va-special-education', 'va-able', 'va-ssi-child', 'va-transition-services'
    ],
    requiredForms: [
      'va-medicaid-app', 'va-dd-intake-request', 'va-dd-eligibility-guide', 'va-personal-care-app', 'va-personal-care-agreement',
      'va-chip-app', 'va-ei-referral', 'va-iep-evaluation-request', 'va-iep-appeal', 'va-prior-written-notice',
      'va-due-process', 'va-state-complaint', 'va-records-request', 'va-iee-request', 'va-able-opening',
      'va-ssi-checklist', 'va-transition-app', 'va-dd-self-direction-guide', 'va-medicaid-renewal', 'va-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'fairfax-va', 'prince-william-va'
    ],
    faqs: []
  },
  'washington': {
    name: 'Washington',
    code: 'WA',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Washington Developmental Disabilities Administration.',
    waiverProgram: 'Washington HCBS Waivers',
    personalCareProgram: 'Washington Medicaid Personal Care',
    medicaidName: 'Washington Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Washington Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Washington disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Washington Medicaid Agency',
    ddAgency: 'Washington Developmental Disabilities Administration',
    educationAgency: 'Washington Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Washington Early Intervention',
    ableProgram: 'Washington ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'wa-dd-waiver', 'wa-dd-self-direction', 'wa-medicaid', 'wa-personal-care', 'wa-chip',
      'wa-early-intervention', 'wa-special-education', 'wa-able', 'wa-ssi-child', 'wa-transition-services'
    ],
    requiredForms: [
      'wa-medicaid-app', 'wa-dd-intake-request', 'wa-dd-eligibility-guide', 'wa-personal-care-app', 'wa-personal-care-agreement',
      'wa-chip-app', 'wa-ei-referral', 'wa-iep-evaluation-request', 'wa-iep-appeal', 'wa-prior-written-notice',
      'wa-due-process', 'wa-state-complaint', 'wa-records-request', 'wa-iee-request', 'wa-able-opening',
      'wa-ssi-checklist', 'wa-transition-app', 'wa-dd-self-direction-guide', 'wa-medicaid-renewal', 'wa-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'king-wa', 'pierce-wa'
    ],
    faqs: []
  },
  'west-virginia': {
    name: 'West Virginia',
    code: 'WV',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for West Virginia Intellectual and Developmental Disabilities Division.',
    waiverProgram: 'West Virginia HCBS Waivers',
    personalCareProgram: 'West Virginia Medicaid Personal Care',
    medicaidName: 'West Virginia Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'West Virginia Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for West Virginia disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'West Virginia Medicaid Agency',
    ddAgency: 'West Virginia Intellectual and Developmental Disabilities Division',
    educationAgency: 'West Virginia Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'West Virginia Early Intervention',
    ableProgram: 'West Virginia ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'wv-dd-waiver', 'wv-dd-self-direction', 'wv-medicaid', 'wv-personal-care', 'wv-chip',
      'wv-early-intervention', 'wv-special-education', 'wv-able', 'wv-ssi-child', 'wv-transition-services'
    ],
    requiredForms: [
      'wv-medicaid-app', 'wv-dd-intake-request', 'wv-dd-eligibility-guide', 'wv-personal-care-app', 'wv-personal-care-agreement',
      'wv-chip-app', 'wv-ei-referral', 'wv-iep-evaluation-request', 'wv-iep-appeal', 'wv-prior-written-notice',
      'wv-due-process', 'wv-state-complaint', 'wv-records-request', 'wv-iee-request', 'wv-able-opening',
      'wv-ssi-checklist', 'wv-transition-app', 'wv-dd-self-direction-guide', 'wv-medicaid-renewal', 'wv-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'kanawha-wv', 'berkeley-wv'
    ],
    faqs: []
  },
  'wisconsin': {
    name: 'Wisconsin',
    code: 'WI',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Wisconsin Department of Health Services.',
    waiverProgram: 'Wisconsin Family Care HCBS Waiver',
    personalCareProgram: 'Wisconsin Medicaid Personal Care',
    medicaidName: 'Wisconsin Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Wisconsin Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Wisconsin disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Wisconsin Medicaid Agency',
    ddAgency: 'Wisconsin Department of Health Services',
    educationAgency: 'Wisconsin Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Wisconsin Early Intervention',
    ableProgram: 'Wisconsin ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'wi-dd-waiver', 'wi-dd-self-direction', 'wi-medicaid', 'wi-personal-care', 'wi-chip',
      'wi-early-intervention', 'wi-special-education', 'wi-able', 'wi-ssi-child', 'wi-transition-services'
    ],
    requiredForms: [
      'wi-medicaid-app', 'wi-dd-intake-request', 'wi-dd-eligibility-guide', 'wi-personal-care-app', 'wi-personal-care-agreement',
      'wi-chip-app', 'wi-ei-referral', 'wi-iep-evaluation-request', 'wi-iep-appeal', 'wi-prior-written-notice',
      'wi-due-process', 'wi-state-complaint', 'wi-records-request', 'wi-iee-request', 'wi-able-opening',
      'wi-ssi-checklist', 'wi-transition-app', 'wi-dd-self-direction-guide', 'wi-medicaid-renewal', 'wi-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'milwaukee-wi', 'dane-wi'
    ],
    faqs: []
  },
  'wyoming': {
    name: 'Wyoming',
    code: 'WY',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for Wyoming Developmental Disabilities Division.',
    waiverProgram: 'Wyoming HCBS Waivers',
    personalCareProgram: 'Wyoming Medicaid Personal Care',
    medicaidName: 'Wyoming Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: 'Wyoming Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for Wyoming disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: 'Wyoming Medicaid Agency',
    ddAgency: 'Wyoming Developmental Disabilities Division',
    educationAgency: 'Wyoming Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: 'Wyoming Early Intervention',
    ableProgram: 'Wyoming ABLE',
    parentTrainingResources: [],
    corePrograms: [
      'wy-dd-waiver', 'wy-dd-self-direction', 'wy-medicaid', 'wy-personal-care', 'wy-chip',
      'wy-early-intervention', 'wy-special-education', 'wy-able', 'wy-ssi-child', 'wy-transition-services'
    ],
    requiredForms: [
      'wy-medicaid-app', 'wy-dd-intake-request', 'wy-dd-eligibility-guide', 'wy-personal-care-app', 'wy-personal-care-agreement',
      'wy-chip-app', 'wy-ei-referral', 'wy-iep-evaluation-request', 'wy-iep-appeal', 'wy-prior-written-notice',
      'wy-due-process', 'wy-state-complaint', 'wy-records-request', 'wy-iee-request', 'wy-able-opening',
      'wy-ssi-checklist', 'wy-transition-app', 'wy-dd-self-direction-guide', 'wy-medicaid-renewal', 'wy-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      'laramie-wy', 'natrona-wy'
    ],
    faqs: []
  }
};

export function getDynamicStateConfig(stateId: string, stateName: string, stateCode: string): StateConfig {
  const normalizedId = stateId.toLowerCase();
  if (stateConfigs[normalizedId]) {
    return stateConfigs[normalizedId];
  }

  // Generate a programmatic fallback config using state_programs_map.json
  const mapData = (stateProgramsMap as Record<string, Record<string, { name?: string }>>)[stateCode.toUpperCase()] || {};
  const devServicesName = mapData.developmental_services?.name || `${stateName} Developmental Services`;
  const personalCareName = mapData.personal_care?.name || `${stateName} Personal Care Services`;
  const hcbsWaiversName = mapData.hcbs_waivers?.name || `${stateName} HCBS Waivers`;

  const fallbackConfig: StateConfig = {
    name: stateName,
    code: stateCode.toUpperCase(),
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: `Local agency managing intake and services for ${devServicesName}.`,
    waiverProgram: hcbsWaiversName,
    personalCareProgram: personalCareName,
    medicaidName: `${stateName} Medicaid`,
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: `${stateName} Early Intervention`,
    legalDisclaimer: `This guide provides resource routing for ${stateName} disability benefits. Standard federal IDEA guidelines apply to special education timelines.`,
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: `${stateName} Medicaid Agency`,
    ddAgency: devServicesName,
    educationAgency: `${stateName} Department of Education`,
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: `${stateName} Early Intervention`,
    ableProgram: `${stateName} ABLE`,
    parentTrainingResources: [],
    corePrograms: [],
    requiredForms: [],
    faqs: [
      {
        q: `How do I start the local intake process for [diagnosis] in [county] County?`,
        a: (county, rc) => `To start the assessment process, contact the local agency desk at ${rc}.`
      }
    ]
  };

  return fallbackConfig;
}
