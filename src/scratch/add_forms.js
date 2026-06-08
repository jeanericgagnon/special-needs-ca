import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seoDataPath = path.resolve(__dirname, '../../frontend/src/lib/seo-data.ts');

const FORMS_CODE_STRING = `,
  'soc-295': {
    slug: 'soc-295',
    category: 'forms',
    title: 'Form SOC 295: California IHSS Application',
    metaTitle: 'Form SOC 295 PDF | Apply for IHSS in California',
    metaDescription: 'Step-by-step parent guide to completing California Form SOC 295 for In-Home Supportive Services. Download blank PDF and review submission steps.',
    quickAnswer: 'Form SOC 295 is the official application for In-Home Supportive Services (IHSS) in California. It initiates the application process for receiving caregiver hours. Parents applying for their disabled children should submit this form to their county social services office. Only the parent or legal guardian signs the application on behalf of a minor.',
    tldrPoints: [
      { label: 'Form PDF Link', value: 'Download CDSS Official' },
      { label: 'Authorized Signer', value: 'Parent or Guardian' },
      { label: 'Where to Send', value: 'County DPSS / Social Services' },
      { label: 'Required Attachments', value: 'Medi-Cal Card, ID' }
    ],
    whenThisMatters: 'To initiate an IHSS application. You must submit this form to begin the process, after which you will have 45 days to return the medical certification (SOC 873).',
    signsThisMayApply: [
      'Your child has a developmental disability and is active on Medi-Cal.',
      'You are a parent caregiver seeking compensation for care hours.'
    ],
    whatToDoFirst: [
      'Download and complete the blank Form SOC 295 PDF.',
      'Gather the child\\\'s Medi-Cal details.',
      'Mail or fax the form to your local county social services department.',
      'Wait for the county to assign an intake worker and send the medical certificate.'
    ],
    documentsToGather: [
      { name: 'Form SOC 295 PDF', description: 'Official CDSS IHSS Application form.', downloadUrl: 'https://www.cdss.ca.gov/Portals/9/FMUD/Forms/Form-English/SOC295.pdf' },
      { name: 'Medi-Cal Card Copy', description: 'Proof of active Medi-Cal coverage, which is a prerequisite for IHSS.' }
    ],
    whoToCall: [
      { name: 'County DPSS / Social Services Office', description: 'Contact your local county office to verify their fax or mailing address for applications.' }
    ],
    whatToSay: 'I am submitting a completed Form SOC 295 to apply for In-Home Supportive Services for my minor child who has a developmental disability.',
    commonMistakes: [
      'Failing to verify that the child has active Medi-Cal before applying.',
      'Leaving the child\\\'s social security number or date of birth blank.',
      'Sending to the state office instead of your local county office.'
    ],
    relatedGuides: [
      { title: 'IHSS for Children Guide', url: '/programs/ihss-for-children' },
      { title: 'Form SOC 873 Medical Certification', url: '/forms/soc-873' }
    ],
    officialSources: [
      { name: 'California CDSS IHSS Official Page', url: 'https://www.cdss.ca.gov/in-home-supportive-services' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Calling County DPSS to Confirm Receipt',
      script: 'Hello, my name is [Parent Name]. I am calling to confirm that you have received the SOC 295 IHSS application for my child, [Child Name], which I faxed on [Date]. Please let me know who our assigned caseworker is and if you have sent out the SOC 873 Medical Certification form to our pediatrician.',
      tips: 'Keep the fax confirmation page as proof of the submission date.'
    },
    letterTemplate: {
      title: 'IHSS Application Cover Letter',
      description: 'Use this template when mailing or faxing the SOC 295 application to your county office.',
      fields: [
        { key: 'parentName', label: 'Parent/Guardian Name', placeholder: 'Jane Doe' },
        { key: 'childName', label: 'Child\\\'s Name', placeholder: 'Tommy Doe' },
        { key: 'dob', label: 'Child\\\'s DOB', placeholder: '01/01/2020' },
        { key: 'medicalNum', label: 'Child\\\'s Medi-Cal Number', placeholder: '99999999A' }
      ],
      generateFn: (f) => \`Date: \${new Date().toLocaleDateString()}
To: In-Home Supportive Services County Office
County of [Insert County]

RE: New IHSS Application for minor child
Claimant Name: \${f.childName || '[Child Name]'}
Date of Birth: \${f.dob || '[DOB]'}
Medi-Cal BIC Number: \${f.medicalNum || '[Medi-Cal Number]'}

Dear Intake Coordinator,

Please find enclosed the completed Form SOC 295 to initiate an application for In-Home Supportive Services (IHSS) on behalf of my minor child, \${f.childName || '[Child Name]'}.

My child has a developmental disability and requires assistance with daily activities. I have active Medi-Cal coverage established for my child under the number listed above.

Please process this application, assign a caseworker, and send the Form SOC 873 Medical Certification to my address.

Sincerely,
\${f.parentName || '[Parent Name]'}\`
    },
    eligibilityQuiz: [
      {
        question: 'Does your child have active Medi-Cal?',
        options: [
          { text: 'Yes, they have active Medi-Cal coverage', score: 'high', reason: 'Medi-Cal is a requirement for IHSS. Your application can proceed.' },
          { text: 'No, but we are currently applying', score: 'med', reason: 'You should submit the Medi-Cal application immediately so it is active by the time IHSS is evaluated.' }
        ]
      }
    ]
  },
  'soc-821': {
    slug: 'soc-821',
    category: 'forms',
    title: 'Form SOC 821: IHSS Protective Supervision Checklist',
    metaTitle: 'Form SOC 821 PDF | IHSS Protective Supervision Guide',
    metaDescription: 'Step-by-step parent guide to completing California Form SOC 821 for IHSS Protective Supervision. Download form and view tips.',
    quickAnswer: 'Form SOC 821 is the crucial "Assessment of Need for Protective Supervision" form. It must be completed by a physician, psychologist, or other clinician to document that a child requires 24/7 observation due to cognitive impairment to prevent self-harm or injury. It is the single most important document for securing up to 283 hours of caregiver pay.',
    tldrPoints: [
      { label: 'Form PDF Link', value: 'Download CDSS Official' },
      { label: 'Authorized Signer', value: 'Licensed Physician / MD' },
      { label: 'Key Criteria', value: 'Non-self-directing cognitive impairment' },
      { label: 'Goal', value: 'Qualify for Protective Supervision' }
    ],
    whenThisMatters: 'Apply when your child has severe behavioral issues, wanders, runs into traffic, eats non-food items, or has no sense of danger, and you want to qualify for Protective Supervision.',
    signsThisMayApply: [
      'Child is active on a Regional Center case and has an intellectual disability or Autism.',
      'Child attempts to wander or displays self-injurious behaviors.'
    ],
    whatToDoFirst: [
      'Download Form SOC 821.',
      'Discuss your child\\\'s safety behaviors with your pediatrician.',
      'Have the pediatrician fill out the checklist, ensuring they tick "Non-Self-Directing" and write specific examples of unsafe behaviors.',
      'Submit the signed form to your IHSS caseworker along with a 24-hour behavior log.'
    ],
    documentsToGather: [
      { name: 'Form SOC 821 PDF', description: 'Assessment of Need for Protective Supervision form.', downloadUrl: 'https://www.cdss.ca.gov/Portals/9/FMUD/Forms/Form-English/SOC821.pdf' },
      { name: '24-Hour Behavior/Safety Log', description: 'A detailed diary tracking all dangerous impulses or wandering behaviors.' }
    ],
    whoToCall: [
      { name: 'County DPSS / IHSS Caseworker', description: 'Contact your caseworker directly to submit the completed SOC 821.' }
    ],
    whatToSay: 'I am submitting Form SOC 821 signed by my child\\\'s pediatrician to verify that they require 24-hour Protective Supervision to prevent injury due to cognitive deficits.',
    commonMistakes: [
      'Letting the doctor write "child is smart" or similar descriptions. The county evaluates cognitive safety, not school intelligence.',
      'Assuming physical inability to walk qualifies. Protective Supervision is strictly for cognitive/behavioral deficits, not physical mobility issues.',
      'Failing to back up the form with a detailed 24-hour log.'
    ],
    relatedGuides: [
      { title: 'IHSS Protective Supervision Guide', url: '/situations/ihss-protective-supervision' },
      { title: 'Form SOC 873 Medical Certification', url: '/forms/soc-873' }
    ],
    officialSources: [
      { name: 'California CDSS Protective Supervision', url: 'https://www.cdss.ca.gov/inforesources/ihss/protective-supervision' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Briefing Pediatrician on SOC 821',
      script: 'Doctor, my child, [Child Name], has no safety awareness and will touch hot stoves or run into traffic if not watched. I need you to complete the SOC 821 form, marking [Child Name] as Non-Self-Directing and documenting these specific dangerous behaviors. This is vital to secure the care hours needed to keep them safe.',
      tips: 'Provide a written list of 5-6 recent unsafe situations to the doctor.'
    },
    letterTemplate: {
      title: 'Protective Supervision Cover Letter',
      description: 'Mailing template to send the SOC 821 form and supporting logs to IHSS.',
      fields: [
        { key: 'parentName', label: 'Parent/Guardian Name', placeholder: 'Jane Doe' },
        { key: 'childName', label: 'Child\\\'s Name', placeholder: 'Tommy Doe' },
        { key: 'caseworker', label: 'Caseworker Name', placeholder: 'John Smith' }
      ],
      generateFn: (f) => \`Date: \${new Date().toLocaleDateString()}
To: \${f.caseworker || '[Caseworker Name]'}
In-Home Supportive Services

RE: Submission of SOC 821 and Safety Documentation for \${f.childName || '[Child Name]'}

Dear Caseworker,

Please find enclosed the completed Form SOC 821, signed by my child\\\'s pediatrician, confirming that \${f.childName || '[Child Name]'} requires 24-hour Protective Supervision due to severe cognitive deficits and a total lack of safety awareness.

I have also attached a detailed 14-day behavior log documenting specific daily interventions I must perform to prevent injury or self-harm.

Please review this documentation and add these hours to our assessment.

Sincerely,
\${f.parentName || '[Parent Name]'}\`
    },
    eligibilityQuiz: [
      {
        question: 'Does your child show active self-harm or wandering behaviors?',
        options: [
          { text: 'Yes, they regularly run away, climb, or eat non-food items', score: 'high', reason: 'These active safety threats fit the eligibility for Protective Supervision.' },
          { text: 'No, they sit quietly but need physical assistance', score: 'low', reason: 'Protective Supervision is for cognitive safety, not physical assist needs.' }
        ]
      }
    ]
  },
  'soc-825': {
    slug: 'soc-825',
    category: 'forms',
    title: 'Form SOC 825: IHSS Protective Supervision Recipient Agreement',
    metaTitle: 'Form SOC 825 PDF | Recipient Agreement Guidelines',
    metaDescription: 'Complete parent guide to California Form SOC 825. Learn rules for signing the Protective Supervision Recipient Agreement.',
    quickAnswer: 'Form SOC 825 is the Protective Supervision Recipient Agreement. It is a signed contract between the parent/recipient and the county, where the parent agrees that they will use the awarded hours to provide 24-hour protective monitoring for the recipient and notify the county if the recipient\\\'s placement changes (such as hospitalization).',
    tldrPoints: [
      { label: 'Form PDF Link', value: 'Download CDSS Official' },
      { label: 'Authorized Signer', value: 'Parent or Guardian' },
      { label: 'Key Term', value: 'Must provide 24-hour monitoring' }
    ],
    whenThisMatters: 'Required after the county approves Protective Supervision. The hours cannot be released to your timesheet until this agreement is signed and returned.',
    signsThisMayApply: [
      'Your child has been approved for Protective Supervision.',
      'You are transitioning timesheets to parent provider status.'
    ],
    whatToDoFirst: [
      'Download Form SOC 825.',
      'Sign the recipient agreement, verifying you understand the 24-hour care obligation.',
      'Mail or fax the signed form back to your county caseworker.',
      'Confirm the status on the Electronic Timesheet Portal (EVSP).'
    ],
    documentsToGather: [
      { name: 'Form SOC 825 PDF', description: 'Protective Supervision Recipient Agreement form.', downloadUrl: 'https://www.cdss.ca.gov/Portals/9/FMUD/Forms/Form-English/SOC825.pdf' }
    ],
    whoToCall: [
      { name: 'County DPSS Office', description: 'Contact your caseworker to check if they received and recorded your SOC 825.' }
    ],
    whatToSay: 'I have signed the SOC 825 Recipient Agreement and am faxing it back to enable the Protective Supervision hours on my timesheets.',
    commonMistakes: [
      'Forgetting to sign and date the form, which delays Timesheet activation.',
      'Failing to report hospitalizations. You cannot claim IHSS hours while the child is admitted to an inpatient hospital.'
    ],
    relatedGuides: [
      { title: 'IHSS Timesheet Rules', url: '/programs/ihss-for-children' }
    ],
    officialSources: [
      { name: 'CDSS Official Forms Catalog', url: 'https://www.cdss.ca.gov/inforesources/forms' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Confirming Timesheet Release',
      script: 'Hello, this is [Parent Name]. I submitted our signed SOC 825 Recipient Agreement yesterday. I want to check if the protective supervision hours are now released and if I can fill them out on our electronic timesheets.',
      tips: 'Ensure the form lists the correct caseworker name.'
    },
    eligibilityQuiz: [
      {
        question: 'Has your child been formally approved for Protective Supervision?',
        options: [
          { text: 'Yes, we received the Notice of Action approval', score: 'high', reason: 'You are ready to submit the SOC 825 to release the hours.' },
          { text: 'No, we are still in the application phase', score: 'low', reason: 'This form is only signed AFTER approval.' }
        ]
      }
    ]
  },
  'soc-839': {
    slug: 'soc-839',
    category: 'forms',
    title: 'Form SOC 839: IHSS Provider Overtime Agreement',
    metaTitle: 'Form SOC 839 PDF | IHSS Overtime Rules & Workweek Limits',
    metaDescription: 'Step-by-step parent guide to completing California Form SOC 839 for IHSS Provider Overtime. Download form and avoid timesheet violations.',
    quickAnswer: 'Form SOC 839 is the In-Home Supportive Services (IHSS) Provider Workweek Agreement. It is used to declare how multiple providers will split care hours or to establish overtime eligibility. Minor child parent providers who are authorized to work more than 40 hours per week (up to the maximum 66-hour provider limit or 70.75-hour limit for multiple recipients) must sign this agreement.',
    tldrPoints: [
      { label: 'Form PDF Link', value: 'Download CDSS Official' },
      { label: 'Workweek Max Limit', value: '66 hours per provider' },
      { label: 'Key Constraint', value: 'Overtime requires prior county sign-off' }
    ],
    whenThisMatters: 'When your child has been awarded more than 40 hours per week (typically when receiving Protective Supervision), or when you are splitting hours between two parent providers.',
    signsThisMayApply: [
      'Your child is authorized for more than 160 hours per month.',
      'You are the sole provider and need to register for overtime.'
    ],
    whatToDoFirst: [
      'Download Form SOC 839.',
      'Detail the monthly hours split and weekly work schedules.',
      'Sign the form along with any secondary providers.',
      'Submit to the county to avoid timesheet violations and payment delays.'
    ],
    documentsToGather: [
      { name: 'Form SOC 839 PDF', description: 'Provider Workweek Agreement form.', downloadUrl: 'https://www.cdss.ca.gov/Portals/9/FMUD/Forms/Form-English/SOC839.pdf' },
      { name: 'Notice of Action (NOA)', description: 'Showing total authorized monthly hours.' }
    ],
    whoToCall: [
      { name: 'IHSS Timesheet Support Help Desk', number: '1-866-376-7066', description: 'Call for assistance resolving overtime timesheet blocks.' }
    ],
    whatToSay: 'I am submitting our SOC 839 Provider Workweek Agreement to declare our weekly schedule and avoid timesheet violations.',
    commonMistakes: [
      'Exceeding 66 hours in a single workweek (Sunday through Saturday). Exceeding this triggers a timesheet violation.',
      'Failing to submit a new agreement when hours are changed, leading to blocked payments.'
    ],
    relatedGuides: [
      { title: 'IHSS Overtime and Workweek Rules', url: '/programs/ihss-for-children' }
    ],
    officialSources: [
      { name: 'CDSS IHSS Workweek Limits', url: 'https://www.cdss.ca.gov/inforesources/ihss/live-in-provider-information' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Resolving Workweek Violations',
      script: 'Hello, my name is [Parent Name]. I received a warning about exceeding our workweek limit. I want to submit our SOC 839 form to clarify our schedule and ensure our timesheets are processed.',
      tips: 'Submit the form before claiming hours to prevent automatic lints.'
    },
    eligibilityQuiz: [
      {
        question: 'Does your monthly IHSS authorization exceed 160 hours?',
        options: [
          { text: 'Yes, we have a high hourly award', score: 'high', reason: 'You must file the SOC 839 to establish an overtime schedule.' },
          { text: 'No, we are under 160 hours monthly', score: 'low', reason: 'Standard workweeks under 40 hours do not require an overtime agreement.' }
        ]
      }
    ]
  },
  'regional-center-intake-request': {
    slug: 'regional-center-intake-request',
    category: 'forms',
    title: 'Regional Center Intake Request Form (CA Lanterman Act)',
    metaTitle: 'Regional Center Intake Request Form | Lanterman Act eligibility',
    metaDescription: 'Guide to submitting a California Regional Center intake request. Download instructions, checklist, and sample letters.',
    quickAnswer: 'The Regional Center Intake Request is a formal request to establish eligibility under the Lanterman Act (for ages 3+) or Early Start (for ages 0-3). While some regional centers use their own web forms, a parent can legally submit a written request letter containing child identification, diagnostics, and functional care deficits. Under California code, the agency has 15 days to respond and 60 days to complete evaluations.',
    tldrPoints: [
      { label: 'Official Instructions Page', value: 'Refer to Local Regional Center' },
      { label: 'Statutory Response Time', value: '15 calendar days' },
      { label: 'Evaluation Timeline', value: '60 days from signed consent' },
      { label: 'Age Criteria', value: 'Lanterman: 3+ | Early Start: 0-3' }
    ],
    whenThisMatters: 'Immediately upon recognizing developmental delays, autism indicators, motor delays, or receiving a clinical diagnosis.',
    signsThisMayApply: [
      'Your child is showing delays in speech, motor skills, or social development.',
      'Your child has an official diagnosis of Autism, Down Syndrome, or Cerebral Palsy.'
    ],
    whatToDoFirst: [
      'Locate the website of your local California Regional Center (based on county).',
      'Download their custom intake request form, or prepare our standard intake request letter.',
      'Gather all medical diagnostics and pediatrician clinical reports.',
      'Submit the request via certified mail or secure email, ensuring you request a read receipt.'
    ],
    documentsToGather: [
      { name: 'Specialist Diagnostic Evaluations', description: 'Reports confirming Autism (ADOS), genetic reports, or neurology reports.' },
      { name: 'Pediatric Medical History', description: 'Standard clinical notes showing motor or developmental delays.' }
    ],
    whoToCall: [
      { name: 'California DDS Intake Division', description: 'Select your county below to find the specific contact details for your local center.' }
    ],
    whatToSay: 'I am requesting a developmental intake assessment for my child. I am submitting this request under the California Lanterman Act to determine eligibility for services.',
    commonMistakes: [
      'Making a verbal request without a written follow-up. Verbal requests do not trigger the legal 15-day timeline.',
      'Submitting incomplete diagnostic records, which slows down the evaluation schedule.'
    ],
    relatedGuides: [
      { title: 'Regional Center Intake Guide', url: '/programs/regional-centers' },
      { title: 'Early Start Eligibility', url: '/programs/early-start' }
    ],
    officialSources: [
      { name: 'California DDS Lanterman Eligibility', url: 'https://www.dds.ca.gov/general/eligibility/' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Starting Lanterman Intake',
      script: 'Hello, I want to speak to the intake department. I am submitting a written request for a Lanterman Act evaluation for my child, [Child Name], who has a diagnosis of [Diagnosis]. I want to know who the assigned intake coordinator is and where I should email the clinical records.',
      tips: 'Ask for the intake coordinator\\\'s direct email address.'
    },
    letterTemplate: {
      title: 'Lanterman Act Intake Request Letter',
      description: 'Formal written request to initiate intake evaluations at your local Regional Center.',
      fields: [
        { key: 'parentName', label: 'Parent/Guardian Name', placeholder: 'Jane Doe' },
        { key: 'childName', label: 'Child\\\'s Name', placeholder: 'Tommy Doe' },
        { key: 'dob', label: 'Child\\\'s DOB', placeholder: '01/01/2021' },
        { key: 'diagnosis', label: 'Diagnosis/Suspected Delays', placeholder: 'Autism Spectrum Disorder' }
      ],
      generateFn: (f) => \`Date: \${new Date().toLocaleDateString()}
To: Intake Department
[Local Regional Center Name]

RE: Request for Lanterman Act Eligibility Assessment
Child's Name: \${f.childName || '[Child Name]'}
Date of Birth: \${f.dob || '[DOB]'}
Diagnosis / Suspected Delay: \${f.diagnosis || '[Diagnosis]'}

Dear Intake Coordinator,

I am writing as the parent of \${f.childName || '[Child Name]'} to formally request an intake evaluation under the California Lanterman Developmental Disabilities Services Act.

My child has a diagnosis of \${f.diagnosis || 'developmental delays'}, which significantly impacts their cognitive development, communication skills, and social functioning in daily life. I have attached the clinical assessments and diagnostic reports for your review.

Under California Title 17 regulations, I look forward to receiving your assessment plan within 15 calendar days of this request.

Sincerely,
\${f.parentName || '[Parent Name]'}\`
    },
    eligibilityQuiz: [
      {
        question: 'Is your child older than 3 years old?',
        options: [
          { text: 'Yes, they are 3 or older', score: 'high', reason: 'They qualify for Lanterman Act assessment. Evaluations look at lifetime developmental disabilities.' },
          { text: 'No, they are under 3', score: 'med', reason: 'Children under 3 are evaluated under the Early Start program rather than the Lanterman Act.' }
        ]
      }
    ]
  },
  'regional-center-ipp-request': {
    slug: 'regional-center-ipp-request',
    category: 'forms',
    title: 'Individual Program Plan (IPP) Request Form',
    metaTitle: 'IPP Request Form Guide | California Regional Centers',
    metaDescription: 'Learn how to request a meeting to review or modify your child\\\'s Individual Program Plan (IPP) at a California Regional Center.',
    quickAnswer: 'The IPP Request is a formal request to hold a meeting to establish or modify your child\\\'s Individual Program Plan (IPP). Under Welfare and Institutions Code Section 4646, you have the right to request an IPP meeting at any time. Once requested in writing, the Regional Center must hold the meeting within 30 days.',
    tldrPoints: [
      { label: 'Official Instructions Page', value: 'Refer to Local Regional Center' },
      { label: 'Required Timeline', value: 'Meeting must occur in 30 days' },
      { label: 'Key Goal', value: 'Modify services, respite, or therapies' }
    ],
    whenThisMatters: 'When your child\\\'s needs change, or when you need to request new services like respite care, behavior training, or speech therapies.',
    signsThisMayApply: [
      'Your child is already a Regional Center client.',
      'The current IPP is outdated or missing required services.',
      'The service coordinator is delaying services.'
    ],
    whatToDoFirst: [
      'Draft a written request detailing why you need an IPP review.',
      'State specific changes in your child\\\'s schedule or care load.',
      'Submit the request to your Service Coordinator.',
      'Keep a copy and note the 30-day legal deadline.'
    ],
    documentsToGather: [
      { name: 'Current IPP Document', description: 'The current service plan on file.' },
      { name: 'Supporting Clinical Recommendations', description: 'Speech, behavior, or doctor notes recommending the requested services.' }
    ],
    whoToCall: [
      { name: 'Your Regional Center Service Coordinator', description: 'Send the request directly to their official email.' }
    ],
    whatToSay: 'I am requesting a formal IPP meeting to review my child\\\'s services and modify our care plan. Under W&I Code Section 4646, I request this meeting be held within 30 days.',
    commonMistakes: [
      'Making a casual phone request without putting it in writing.',
      'Accepting a coordinator\\\'s claim that "we cannot do meetings until next year". W&I Code 4646 mandates a 30-day response.'
    ],
    relatedGuides: [
      { title: 'Regional Center IPP Meeting Guide', url: '/programs/regional-centers' }
    ],
    officialSources: [
      { name: 'California DDS IPP Guidelines', url: 'https://www.dds.ca.gov/inforesources/ipp/' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Demanding IPP Review Meeting',
      script: 'Hi, this is [Parent Name]. I want to schedule a formal IPP meeting to add behavioral services and respite care. I am requesting this in writing today. Please let me know which dates in the next 30 days work for you and the supervisor.',
      tips: 'If the coordinator is unresponsive, cc their supervisor.'
    },
    letterTemplate: {
      title: 'IPP Meeting Request Letter',
      description: 'Formal letter to request an IPP meeting within the 30-day statutory window.',
      fields: [
        { key: 'parentName', label: 'Parent Name', placeholder: 'Jane Doe' },
        { key: 'childName', label: 'Child Name', placeholder: 'Tommy Doe' },
        { key: 'coordinator', label: 'Service Coordinator', placeholder: 'John Smith' },
        { key: 'services', label: 'Requested Services', placeholder: 'additional Respite hours and Behavior Intervention' }
      ],
      generateFn: (f) => \`Date: \${new Date().toLocaleDateString()}
To: \${f.coordinator || '[Service Coordinator Name]'}
[Regional Center Name]

RE: Request for IPP Review Meeting (Welfare & Institutions Code § 4646)
Recipient Name: \${f.childName || '[Child Name]'}

Dear \${f.coordinator || 'Service Coordinator'},

I am writing as the parent of \${f.childName || '[Child Name]'} to formally request an Individual Program Plan (IPP) meeting.

We are requesting this meeting to discuss changes in our child\\\'s care needs and to request the addition of: \${f.services || '[Requested Services]'}.

Under California Welfare and Institutions Code Section 4646(c), the Regional Center is required to hold an IPP meeting within 30 days of a written request. Please contact me to schedule a meeting date.

Sincerely,
\${f.parentName || '[Parent Name]'}\`
    },
    eligibilityQuiz: [
      {
        question: 'Is your child currently active on a Regional Center case?',
        options: [
          { text: 'Yes, they are an active consumer', score: 'high', reason: 'You have the legal right to request an IPP meeting within 30 days.' },
          { text: 'No, we are still waiting for eligibility determinations', score: 'low', reason: 'You must establish intake eligibility first before an IPP can be requested.' }
        ]
      }
    ]
  },
  'regional-center-service-request': {
    slug: 'regional-center-service-request',
    category: 'forms',
    title: 'Regional Center Service Request Form',
    metaTitle: 'Regional Center Service Request Guide | Respite & Services',
    metaDescription: 'Complete parent guide to submitting a formal service request for respite, speech therapy, or ABA to a California Regional Center.',
    quickAnswer: 'A Regional Center Service Request is a formal request for specific services (like respite, behavior services, or social skills groups). If your service coordinator verbally denies a request, you should submit a formal service request in writing. The Regional Center must provide a written Notice of Action (NOA) within 15 days if they deny or reduce services, which you need in order to appeal.',
    tldrPoints: [
      { label: 'Official Instructions Page', value: 'Refer to Local Regional Center' },
      { label: 'Response Window', value: '15 days to issue Notice of Action' },
      { label: 'Required for Appeal', value: 'Written Notice of Action' }
    ],
    whenThisMatters: 'Whenever you need to request a specific service (like respite care or speech therapy) and want to get a formal decision in writing so you can appeal if they deny it.',
    signsThisMayApply: [
      'Your child needs behavioral support, social skills training, or caregiver respite.',
      'Your coordinator verbally claims "we do not fund that service".'
    ],
    whatToDoFirst: [
      'Draft a detailed service request letter stating the service needed and how it relates to the IPP goals.',
      'Attach pediatrician or therapist recommendations.',
      'Send it to your coordinator and ask for a written Notice of Action if denied.',
      'Track the 15-day timeline.'
    ],
    documentsToGather: [
      { name: 'Physician / Therapist Letter', description: 'Recommending the specific service.' },
      { name: 'Parent Impact Statement', description: 'Explaining why the service is necessary for the child\\\'s health/inclusion.' }
    ],
    whoToCall: [
      { name: 'Your Service Coordinator / Supervisor', description: 'To request the service formally.' }
    ],
    whatToSay: 'I am formally requesting this service in writing. If the regional center denies this request, please issue a formal written Notice of Action within 15 days so we can pursue an appeal.',
    commonMistakes: [
      'Accepting verbal denials. Always demand a written Notice of Action (NOA).',
      'Requesting services that do not align with any goals listed in your child\\\'s IPP.'
    ],
    relatedGuides: [
      { title: 'Regional Center Denial Appeal', url: '/forms/regional-center-appeal-request' }
    ],
    officialSources: [
      { name: 'DDS Consumer Rights and Appeals', url: 'https://www.dds.ca.gov/general/appeals-complaints-comments/' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Filing Service Request',
      script: 'Hi, I am sending a formal written request for [Service Name]. Under California code, if you cannot fund this, I expect a written Notice of Action in the mail within 15 days explaining the legal reason for denial.',
      tips: 'Ask for confirmation that the request has been logged in the client notes.'
    },
    letterTemplate: {
      title: 'Formal Service Request and Notice of Action Demand',
      description: 'Formal letter to request a service and demand a Notice of Action if denied.',
      fields: [
        { key: 'parentName', label: 'Parent Name', placeholder: 'Jane Doe' },
        { key: 'childName', label: 'Child Name', placeholder: 'Tommy Doe' },
        { key: 'serviceName', label: 'Requested Service', placeholder: 'In-Home Behavior ABA Training' },
        { key: 'reason', label: 'Reason/Need', placeholder: 'prevent safety issues and self-harm' }
      ],
      generateFn: (f) => \`Date: \${new Date().toLocaleDateString()}
To: Service Coordinator / Director
[Local Regional Center Name]

RE: Request for Service and Written Notice of Action Demand
Recipient Name: \${f.childName || '[Child Name]'}

Dear Service Coordinator,

I am writing as the parent of \${f.childName || '[Child Name]'} to formally request the authorization of the following service: \${f.serviceName || '[Requested Service]'}.

This service is necessary to support our child\\\'s IPP goals and to address the following need: \${f.reason || '[Reason]'}.

If the Regional Center denies or reduces this request, I request a formal written Notice of Action (NOA) be issued within 15 days, in accordance with California Welfare and Institutions Code Section 4710.

Sincerely,
\${f.parentName || '[Parent Name]'}\`
    },
    eligibilityQuiz: [
      {
        question: 'Did your coordinator verbally deny your request?',
        options: [
          { text: 'Yes, they told me it cannot be funded', score: 'high', reason: 'You should submit a formal service request and demand a written Notice of Action.' },
          { text: 'No, we have not asked yet', score: 'med', reason: 'You should ask first, but prepare this form in case they decline.' }
        ]
      }
    ]
  },
  'regional-center-appeal-request': {
    slug: 'regional-center-appeal-request',
    category: 'forms',
    title: 'Regional Center Fair Hearing Appeal Form (DS 1805)',
    metaTitle: 'DDS Appeal Form DS 1805 | Regional Center Appeals',
    metaDescription: 'Step-by-step parent guide to completing California Form DS 1805 for Regional Center appeals and Fair Hearings.',
    quickAnswer: 'The DDS Appeal Form DS 1805 is the official form used to appeal a Regional Center\\\'s decision to deny eligibility, reduce hours, or deny services. You must file the appeal within 30 days of receiving the Notice of Action to ensure "aid paid pending" (continuing current services during the appeal process) or within 60 days max.',
    tldrPoints: [
      { label: 'Form PDF Link', value: 'Download DDS Official' },
      { label: 'Filing Deadline', value: '30 days for aid paid pending (60 days max)' },
      { label: 'Where to Send', value: 'Office of Administrative Hearings (OAH)' }
    ],
    whenThisMatters: 'When you receive a written Notice of Action (NOA) denying eligibility or reducing services (respite, therapies) and want to appeal the decision.',
    signsThisMayApply: [
      'You received a Notice of Action in the mail.',
      'The regional center is reducing your respite or therapy hours.'
    ],
    whatToDoFirst: [
      'Download Form DS 1805.',
      'Fill out the consumer details and state why you disagree with the decision.',
      'Check the box requesting "Mediation" and "Fair Hearing".',
      'Fax or email the form to the Office of Administrative Hearings and your local center.'
    ],
    documentsToGather: [
      { name: 'Form DS 1805 PDF', description: 'Official DDS Appeal form.', downloadUrl: 'https://www.dds.ca.gov/wp-content/uploads/2023/02/DS1805.pdf' },
      { name: 'Notice of Action (NOA)', description: 'The official written denial letter from the center.' }
    ],
    whoToCall: [
      { name: 'Office of Administrative Hearings (OAH)', number: '916-263-0550', description: 'State office that manages DDS fair hearings.' }
    ],
    whatToSay: 'I am filing an appeal on behalf of my child to challenge the Regional Center\\\'s decision. We request mediation and a fair hearing.',
    commonMistakes: [
      'Missing the 30-day deadline for aid paid pending. If you miss this, your current services will stop during the appeal.',
      'Failing to specify why the service is necessary based on the Lanterman Act.'
    ],
    relatedGuides: [
      { title: 'Filing a State Fair Hearing Appeal', url: '/benefits/california/regional-center-denial-appeal' }
    ],
    officialSources: [
      { name: 'DDS Fair Hearing Info', url: 'https://www.dds.ca.gov/general/appeals-complaints-comments/fair-hearings-complaint-process/' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Filing OAH Appeal',
      script: 'Hi, I am calling to confirm that you received our DS 1805 appeal form for [Child Name] that I faxed today. I want to verify that our current services will continue under aid paid pending rules.',
      tips: 'Ensure the fax transmission report indicates SUCCESS.'
    },
    letterTemplate: {
      title: 'DDS Appeal DS 1805 Cover Letter',
      description: 'Cover letter to send along with your official DS 1805 appeal form.',
      fields: [
        { key: 'parentName', label: 'Parent Name', placeholder: 'Jane Doe' },
        { key: 'childName', label: 'Child Name', placeholder: 'Tommy Doe' },
        { key: 'regionalCenter', label: 'Regional Center Name', placeholder: 'Lantermans Regional Center' }
      ],
      generateFn: (f) => \`Date: \${new Date().toLocaleDateString()}
To: Office of Administrative Hearings (OAH)
DDS Appeals Division

RE: Fair Hearing Request for \${f.childName || '[Child Name]'}
Local Regional Center: \${f.regionalCenter || '[Regional Center]'}

Dear Appeals Coordinator,

Please find enclosed the completed DDS Form DS 1805 requesting a Fair Hearing and Mediation on behalf of my minor child, \${f.childName || '[Child Name]'}.

We are appealing the Notice of Action dated [Insert Date] issued by the \${f.regionalCenter || 'Regional Center'} which denies/reduces [Insert Service].

We request that all current services remain in place under "aid paid pending" rules during the course of these proceedings.

Sincerely,
\${f.parentName || '[Parent Name]'}\`
    },
    eligibilityQuiz: [
      {
        question: 'Did you receive a written Notice of Action?',
        options: [
          { text: 'Yes, we have the official written notice', score: 'high', reason: 'You have the necessary document to file your appeal. Verify the date.' },
          { text: 'No, we only received verbal notification', score: 'med', reason: 'Demand a written Notice of Action first, as W&I Code requires it for appeals.' }
        ]
      }
    ]
  },
  'iep-assessment-request': {
    slug: 'iep-assessment-request',
    category: 'forms',
    title: 'IEP Assessment Request Letter (Special Ed Evaluation)',
    metaTitle: 'IEP Assessment Request Letter | California Special Ed',
    metaDescription: 'Step-by-step parent guide to requesting a special education IEP assessment in California. Download templates and track school timelines.',
    quickAnswer: 'An IEP Assessment Request is a formal written letter requesting that a school district evaluate your child for special education eligibility. Under California Education Code Section 56321, once you submit this request in writing, the school district has 15 calendar days to provide you with a written Assessment Plan for your signature.',
    tldrPoints: [
      { label: 'Official Instructions Page', value: 'Refer to Local School District' },
      { label: 'District Response Time', value: '15 calendar days' },
      { label: 'Evaluation Timeline', value: '60 days from signed consent' },
      { label: 'Signer', value: 'Parent or Guardian' }
    ],
    whenThisMatters: 'When your child has a diagnosed developmental disability, ADHD, or learning delays, and you want the school district to evaluate them for an IEP or 504 plan.',
    signsThisMayApply: [
      'Your child is falling behind academically or socially.',
      'The pediatrician suggests evaluations for speech or occupational therapy.',
      'The school suggests behavior interventions.'
    ],
    whatToDoFirst: [
      'Draft a written IEP assessment request letter.',
      'Identify all areas of suspected disability (speech, behavior, academic).',
      'Submit the letter to the school Principal and Special Education Director.',
      'Request a signed receipt or email confirmation to start the 15-day clock.'
    ],
    documentsToGather: [
      { name: 'Pediatric Clinical Diagnoses', description: 'Autism ADOS, ADHD, or psychologist assessments.' },
      { name: 'Work Samples & Report Cards', description: 'Showing spelling or writing delays.' }
    ],
    whoToCall: [
      { name: 'Local School District Special Education Office', description: 'Contact them to find the email of the Special Ed Director.' }
    ],
    whatToSay: 'I am submitting a written request for a comprehensive special education assessment for my child under California Education Code Section 56321.',
    commonMistakes: [
      'Making a verbal request to a teacher. Only a written request to an administrator triggers the legal 15-day timeline.',
      'Signing a generic Assessment Plan without checking if all areas (like speech or behavior) are included.'
    ],
    relatedGuides: [
      { title: 'IEP Special Education Guide', url: '/programs/iep-special-education' }
    ],
    officialSources: [
      { name: 'California Department of Education IEP Rules', url: 'https://www.cde.ca.gov/sp/se/raw/iepref.asp' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Confirming Assessment Timeline',
      script: 'Hi, I am calling to confirm receipt of the IEP assessment request I submitted for [Child Name] on [Date]. Under California law, the district has 15 days to provide me with the written Assessment Plan. Can you confirm when I will receive it?',
      tips: 'Always ask for the case manager\\\'s contact details.'
    },
    letterTemplate: {
      title: 'IEP Assessment Request Letter',
      description: 'Formal written request to start special education evaluations under California law.',
      fields: [
        { key: 'parentName', label: 'Parent Name', placeholder: 'Jane Doe' },
        { key: 'childName', label: 'Child Name', placeholder: 'Tommy Doe' },
        { key: 'dob', label: 'Child\\\'s DOB', placeholder: '01/01/2020' },
        { key: 'school', label: 'Current School', placeholder: 'Oak Elementary' },
        { key: 'suspectedDisabilities', label: 'Suspected Disabilities / Delays', placeholder: 'Speech impairment, motor delays, and social challenges' }
      ],
      generateFn: (f) => \`Date: \${new Date().toLocaleDateString()}
To: Special Education Director / Principal
School District: [Insert School District]
School: \${f.school || '[School Name]'}

RE: Request for Special Education Psycho-Educational Assessment
Child Name: \${f.childName || '[Child Name]'}
Date of Birth: \${f.dob || '[DOB]'}

Dear School Administrators,

I am writing as the parent of \${f.childName || '[Child Name]'} to formally request a comprehensive educational assessment to determine eligibility for special education services and accommodations under the Individuals with Disabilities Education Act (IDEA) and California Education Code Section 56321.

I request my child be evaluated in all areas of suspected disability, including but not limited to: \${f.suspectedDisabilities || '[Suspected Disabilities]'}.

Under California Education Code Section 56321(a), the district is required to provide me with a written Assessment Plan within 15 calendar days of this request. Please send this plan to my address.

Sincerely,
\${f.parentName || '[Parent Name]'}\`
    },
    eligibilityQuiz: [
      {
        question: 'Have you requested evaluations in writing before?',
        options: [
          { text: 'No, this is our first written request', score: 'high', reason: 'You are ready to submit this letter to start the 15-day clock.' },
          { text: 'Yes, but the district ignored us', score: 'med', reason: 'You should file this letter again, explicitly citing the Education Code, and cc the Director.' }
        ]
      }
    ]
  },
  'independent-educational-evaluation-request': {
    slug: 'independent-educational-evaluation-request',
    category: 'forms',
    title: 'Independent Educational Evaluation (IEE) Request Letter',
    metaTitle: 'IEE Request Letter Template | Special Ed Advocacy',
    metaDescription: 'Complete guide for parents requesting an Independent Educational Evaluation (IEE) at school district expense in California.',
    quickAnswer: 'An IEE Request is a letter sent by a parent to a school district expressing disagreement with the district\\\'s recent psycho-educational assessment and requesting a private evaluation at public expense. Under 34 CFR § 300.502 and California Education Code Section 56329, once requested, the district must either fund the IEE or file for due process to defend their own assessment "without unnecessary delay."',
    tldrPoints: [
      { label: 'Official Instructions Page', value: 'Refer to Local School District' },
      { label: 'Key Right', value: 'Private evaluation paid by school district' },
      { label: 'District Response Time', value: '"Without unnecessary delay" (typically 10-15 days)' }
    ],
    whenThisMatters: 'When you disagree with the school district\\\'s IEP assessment (for example, if they claim your child does not need speech therapy or does not qualify for Autism services).',
    signsThisMayApply: [
      'The school district completed their triennial or initial assessment.',
      'You disagree with their findings, scores, or service recommendations.'
    ],
    whatToDoFirst: [
      'Write a letter expressing your disagreement with the district\\\'s assessment.',
      'Formally request an Independent Educational Evaluation (IEE) at public expense.',
      'Specify the areas of evaluation (like psycho-educational, OT, or speech).',
      'Submit the letter to the Special Education Director.'
    ],
    documentsToGather: [
      { name: 'District Assessment Report', description: 'The evaluation report you disagree with.' },
      { name: 'Private Clinic Recommendations', description: 'Letters from private specialists supporting your case.' }
    ],
    whoToCall: [
      { name: 'Special Education Director', description: 'Send the letter directly to the district special education office.' }
    ],
    whatToSay: 'I disagree with the school district\\\'s assessment of my child. Under 34 CFR Section 300.502, I am requesting an Independent Educational Evaluation (IEE) at district expense.',
    commonMistakes: [
      'Failing to explicitly write "I disagree with the district\\\'s assessment". You must state disagreement to trigger the right to an IEE.',
      'Paying for a private evaluation out-of-pocket first and expecting reimbursement without prior written agreement.'
    ],
    relatedGuides: [
      { title: 'Understanding Your IEP Rights', url: '/programs/iep-special-education' }
    ],
    officialSources: [
      { name: 'US Dept of Education IEE Rules', url: 'https://sites.ed.gov/idea/regs/b/e/300.502' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Challenging School Assessment',
      script: 'Hi, I am sending our written disagreement with the district\\\'s psycho-educational report and requesting an IEE at district expense in the areas of speech and OT. Please send me the district\\\'s list of approved independent assessors.',
      tips: 'Ask for the district\\\'s "IEE criteria and cost caps" document.'
    },
    letterTemplate: {
      title: 'Independent Educational Evaluation (IEE) Request Letter',
      description: 'Formal letter to request private assessments paid for by the school district.',
      fields: [
        { key: 'parentName', label: 'Parent Name', placeholder: 'Jane Doe' },
        { key: 'childName', label: 'Child Name', placeholder: 'Tommy Doe' },
        { key: 'assessmentDate', label: 'Date of District Assessment', placeholder: '05/12/2026' },
        { key: 'assessmentType', label: 'Type of Assessment', placeholder: 'Psycho-Educational and Speech/Language' }
      ],
      generateFn: (f) => \`Date: \${new Date().toLocaleDateString()}
To: Special Education Director
School District: [Insert School District]

RE: Request for Independent Educational Evaluation (IEE) at Public Expense
Child Name: \${f.childName || '[Child Name]'}
Disagreement with District Assessment dated: \${f.assessmentDate || '[Assessment Date]'}

Dear Special Education Director,

I am writing to formally notify the district that I disagree with the recent \${f.assessmentType || '[Assessment Type]'} assessment completed on my child, \${f.childName || '[Child Name]'}, on \${f.assessmentDate || '[Assessment Date]'}.

Under 34 C.F.R. § 300.502 and California Education Code Section 56329(b), I am formally requesting an Independent Educational Evaluation (IEE) at public expense. I request independent evaluations in the areas of: [Insert Assessment Areas, e.g., Speech/Language, Occupational Therapy].

Please provide me with the district\\\'s IEE criteria and policy guidelines, along with a list of approved independent evaluators, without unnecessary delay.

Sincerely,
\${f.parentName || '[Parent Name]'}\`
    },
    eligibilityQuiz: [
      {
        question: 'Did the district complete an evaluation in the last 2 years?',
        options: [
          { text: 'Yes, they completed their assessments recently', score: 'high', reason: 'You have the right to disagree and request an IEE at district expense.' },
          { text: 'No, they refuse to evaluate my child at all', score: 'low', reason: 'You cannot request an IEE until the district has first conducted its own evaluation.' }
        ]
      }
    ]
  },
  'prior-written-notice-request': {
    slug: 'prior-written-notice-request',
    category: 'forms',
    title: 'Prior Written Notice (PWN) Request Letter',
    metaTitle: 'PWN Request Letter Template | IEP Advocacy',
    metaDescription: 'Learn how to demand Prior Written Notice (PWN) from a school district when they refuse IEP services or accommodations.',
    quickAnswer: 'A PWN Request is a letter demanding that a school district put their decisions in writing when they refuse to add services, accommodations, or modify placements. Under 34 CFR § 300.503, the district MUST provide a detailed written explanation listing the reasons for the refusal, what options were considered, and the data used. This holds the school accountable and prepares your file for legal appeals.',
    tldrPoints: [
      { label: 'Official Instructions Page', value: 'Refer to Local School District' },
      { label: 'Statutory Obligation', value: 'Required for any IEP changes/refusals' },
      { label: 'Legal Target', value: '34 CFR Section 300.503' }
    ],
    whenThisMatters: 'When the school verbally denies a service or accommodation in an IEP meeting, claiming "we do not offer that here" or "he does not need it."',
    signsThisMayApply: [
      'The district refuses to provide speech therapy, a 1:1 aide, or specific accommodations.',
      'The district refuses to evaluate your child for an IEP.'
    ],
    whatToDoFirst: [
      'Identify what request the school district refused.',
      'Draft a written letter demanding Prior Written Notice for that specific refusal.',
      'Submit the letter to the Principal and Special Education Case Manager.',
      'Wait for the district\\\'s formal response before filing a state complaint.'
    ],
    documentsToGather: [
      { name: 'Written IEP Meeting Notes', description: 'Showing that you requested the service during the meeting.' }
    ],
    whoToCall: [
      { name: 'Your IEP Case Manager / Coordinator', description: 'Submit the demand directly to their work email.' }
    ],
    whatToSay: 'I am formally demanding Prior Written Notice regarding the district\\\'s refusal to provide the services we requested. Please put the refusal and its legal justification in writing.',
    commonMistakes: [
      'Accepting verbal refusals. Always demand a written PWN.',
      'Failing to specify exactly what request the district denied.'
    ],
    relatedGuides: [
      { title: 'IEP Prior Written Notice Guide', url: '/programs/iep-special-education' }
    ],
    officialSources: [
      { name: 'US Dept of Education PWN Rules', url: 'https://sites.ed.gov/idea/regs/b/e/300.503' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Demanding Prior Written Notice',
      script: 'Hi, since the district is refusing to provide [Service Name], I am requesting a formal Prior Written Notice under federal law. Please ensure this notice is mailed to me, detailing the evidence you are using to deny this service.',
      tips: 'Keep a copy of the request to verify you demanded PWN.'
    },
    letterTemplate: {
      title: 'Prior Written Notice Demand Letter',
      description: 'Formal letter to force the school district to document their refusal in writing.',
      fields: [
        { key: 'parentName', label: 'Parent Name', placeholder: 'Jane Doe' },
        { key: 'childName', label: 'Child Name', placeholder: 'Tommy Doe' },
        { key: 'refusal', label: 'Refused Service/Request', placeholder: '1:1 behavioral aide and speech therapy' }
      ],
      generateFn: (f) => \`Date: \${new Date().toLocaleDateString()}
To: Special Education Coordinator / Principal
School District: [Insert School District]

RE: Demand for Prior Written Notice (34 C.F.R. § 300.503)
Child Name: \${f.childName || '[Child Name]'}

Dear School Administrators,

During our recent IEP meeting on [Insert Date], I requested that the school district provide the following services/accommodations: \${f.refusal || '[Refused Service]'}.

The school district verbally refused this request. Under federal IDEA regulations (34 C.F.R. § 300.503), the district is required to provide Prior Written Notice (PWN) whenever it proposes or refuses to initiate or change the identification, evaluation, or educational placement of a child.

Please provide a formal written Prior Written Notice explaining the district\\\'s refusal, including:
1. A description of the action refused;
2. An explanation of why the district refuses to take the action;
3. A description of each evaluation procedure, assessment, record, or report the district used as the basis for the refusal.

I look forward to receiving this notice in a timely manner.

Sincerely,
\${f.parentName || '[Parent Name]'}\`
    },
    eligibilityQuiz: [
      {
        question: 'Did the school district refuse a service in writing?',
        options: [
          { text: 'No, they only verbally refused', score: 'high', reason: 'You should submit this letter to force them to document their decision.' },
          { text: 'Yes, they already sent a PWN letter', score: 'low', reason: 'If they already issued a PWN, you are ready to file for mediation or due process.' }
        ]
      }
    ]
  },
  'education-records-request': {
    slug: 'education-records-request',
    category: 'forms',
    title: 'Student Education Records Request Letter',
    metaTitle: 'IEP Student Records Request | California Education Code',
    metaDescription: 'Step-by-step parent guide to requesting your child\\\'s student files and IEP records in California. Download templates and track deadlines.',
    quickAnswer: 'An Education Records Request is a letter sent to request copies of all educational records, evaluations, emails, and disciplinary files held by a school district. Under California Education Code Section 56504, the school district must provide copies of all student records within 5 business days of a written or oral request, or before any IEP meeting.',
    tldrPoints: [
      { label: 'Official Instructions Page', value: 'Refer to Local School District' },
      { label: 'California Deadline', value: 'Strict 5 business days' },
      { label: 'Signer', value: 'Parent or Guardian' }
    ],
    whenThisMatters: 'Before any IEP meeting, transition planning, or when preparing for a special education dispute, to ensure you have all evaluations and teacher files.',
    signsThisMayApply: [
      'You are preparing for an annual or triennial IEP review.',
      'You suspect the school is not tracking accommodations properly.',
      'You are preparing for due process or mediation.'
    ],
    whatToDoFirst: [
      'Draft a written records request letter.',
      'State that you request all files, including test protocols, email records, and behavior charts.',
      'Submit it to the Special Education Director and Principal.',
      'Confirm receipt to start the 5-day clock.'
    ],
    documentsToGather: [
      { name: 'Written Request Copy', description: 'Your submitted records request letter.' }
    ],
    whoToCall: [
      { name: 'School District Records Coordinator', description: 'Contact the district office to find who manages student files.' }
    ],
    whatToSay: 'I am requesting a complete copy of my child\\\'s educational records under California Education Code Section 56504. Please make them available within 5 business days.',
    commonMistakes: [
      'Failing to ask for "test protocols". Districts often omit the raw scoring sheets unless you request them specifically.',
      'Accepting a district\\\'s claim that they need weeks to compile the records. The California code mandates 5 business days.'
    ],
    relatedGuides: [
      { title: 'Mastering the IEP process', url: '/programs/iep-special-education' }
    ],
    officialSources: [
      { name: 'California Ed Code Section 56504', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=EDC&sectionNum=56504.' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Demanding Student Files',
      script: 'Hi, I am calling to follow up on the student records request I submitted for [Child Name] on [Date]. Under California law, the 5 business day deadline is tomorrow. Please let me know if I should pick them up or if they are uploaded online.',
      tips: 'Confirm the business days exclude federal holidays.'
    },
    letterTemplate: {
      title: 'Student Education Records Request Letter',
      description: 'Formal letter to request a complete copy of all student files within 5 business days.',
      fields: [
        { key: 'parentName', label: 'Parent Name', placeholder: 'Jane Doe' },
        { key: 'childName', label: 'Child Name', placeholder: 'Tommy Doe' },
        { key: 'schoolName', label: 'Current School', placeholder: 'Oak Elementary' }
      ],
      generateFn: (f) => \`Date: \${new Date().toLocaleDateString()}
To: Records Department / Special Education Director
School District: [Insert School District]

RE: Request for Student Records (California Education Code § 56504)
Student Name: \${f.childName || '[Child Name]'}
School: \${f.schoolName || '[School Name]'}

Dear Records Department,

I am writing as the parent of \${f.childName || '[Child Name]'} to formally request a complete copy of all my child\\\'s educational and student records under California Education Code Section 56504.

This request includes, but is not limited to:
1. All IEP documents, assessment reports, and draft plans;
2. All raw test data, scoring protocols, and evaluator worksheets;
3. All email correspondence between school staff, teachers, and administrators regarding my child;
4. All progress monitoring data, behavior logs, and work samples.

Under California Education Code Section 56504, the district must provide these records within 5 business days. Please notify me when they are ready.

Sincerely,
\Ref.parentName || '[Parent Name]'}\`
    },
    eligibilityQuiz: [
      {
        question: 'Do you have an IEP meeting scheduled in the next week?',
        options: [
          { text: 'Yes, our meeting is in a few days', score: 'high', reason: 'You should file this immediately to ensure you review all evaluations before the meeting starts.' },
          { text: 'No, we do not have an active meeting scheduled', score: 'med', reason: 'You can request records at any time to verify compliance.' }
        ]
      }
    ]
  },
  'cde-state-complaint': {
    slug: 'cde-state-complaint',
    category: 'forms',
    title: 'California Department of Education (CDE) State Complaint',
    metaTitle: 'CDE State Complaint Form | California Special Education',
    metaDescription: 'Step-by-step parent guide to completing the California Department of Education (CDE) State Complaint Form for IEP non-compliance.',
    quickAnswer: 'The CDE State Complaint is filed with the California Department of Education when a school district fails to implement a signed IEP (for example, failing to provide speech therapy hours or occupational therapy sessions). The CDE investigates the non-compliance and issues a ruling within 60 days, ordering corrective action.',
    tldrPoints: [
      { label: 'Form PDF Link', value: 'Download CDE Official' },
      { label: 'Resolution Timeline', value: 'Strict 60 calendar days' },
      { label: 'Where to Send', value: 'California Department of Education' }
    ],
    whenThisMatters: 'When the school district is violating your child\\\'s signed IEP (e.g. skipping therapy sessions, ignoring accommodations, or failing to hold annual meetings).',
    signsThisMayApply: [
      'The school is not providing the speech therapy minutes listed in the IEP.',
      'The school has not assigned a 1:1 aide as authorized in the IEP.',
      'The school district missed the annual IEP meeting deadline.'
    ],
    whatToDoFirst: [
      'Download the official CDE State Complaint Form.',
      'List specific dates and examples of the school\\\'s failure to comply.',
      'Attach a copy of the signed IEP showing the service promised.',
      'Submit the complaint to the CDE Special Education Division and copy the school district.'
    ],
    documentsToGather: [
      { name: 'CDE State Complaint Form PDF', description: 'Official CDE Special Education complaint form.', downloadUrl: 'https://www.cde.ca.gov/sp/se/qa/documents/cdecomplntfrm.pdf' },
      { name: 'Signed IEP Document', description: 'Showing the services that are not being implemented.' },
      { name: 'Service Logs / Absence Records', description: 'Evidence that the services were missed.' }
    ],
    whoToCall: [
      { name: 'CDE Special Education Division', number: '800-926-0648', description: 'State office managing special ed compliance complaints.' }
    ],
    whatToSay: 'I am filing a compliance complaint because the school district is failing to implement the services authorized in our signed IEP document.',
    commonMistakes: [
      'Filing a complaint about a disagreement on goals. For disagreements on what *should* be in the IEP, you must file for Due Process, not a compliance complaint.',
      'Failing to attach a copy of the signed IEP as evidence.'
    ],
    relatedGuides: [
      { title: 'Special Education Dispute Resolution Guide', url: '/benefits/california/special-education-dispute-resolution' }
    ],
    officialSources: [
      { name: 'CDE Special Ed Complaints Official Portal', url: 'https://www.cde.ca.gov/sp/se/qa/cmplntprocs.asp' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Checking Complaint Status',
      script: 'Hi, I am calling to confirm that you received our state compliance complaint for [Child Name] against [School District]. Can you confirm the assigned investigator and the date the investigation report is due?',
      tips: 'The CDE must issue a final report within 60 days.'
    },
    letterTemplate: {
      title: 'State Compliance Complaint Submission Letter',
      description: 'Formal letter to submit your CDE compliance complaint to the state and school district.',
      fields: [
        { key: 'parentName', label: 'Parent Name', placeholder: 'Jane Doe' },
        { key: 'childName', label: 'Child Name', placeholder: 'Tommy Doe' },
        { key: 'district', label: 'School District Name', placeholder: 'Sacramento Unified' },
        { key: 'violation', label: 'IEP Service Violated', placeholder: 'speech therapy services were not provided for 6 weeks' }
      ],
      generateFn: (f) => \`Date: \${new Date().toLocaleDateString()}
To: California Department of Education
Special Education Division - Complaint Support Unit

RE: State Compliance Complaint against \${f.district || '[School District]'}
Student Name: \${f.childName || '[Child Name]'}

Dear Complaints Coordinator,

Please find enclosed the completed California Department of Education (CDE) State Complaint form filed on behalf of my minor child, \${f.childName || '[Child Name]'}.

We are filing this compliance complaint because the \${f.district || 'School District'} has failed to implement our signed IEP. Specifically, the district has violated the IEP by failing to provide: \${f.violation || '[IEP Service Violated]'}.

I have attached our signed IEP and service logs showing the missed sessions.

Sincerely,
\${f.parentName || '[Parent Name]'}\`
    },
    eligibilityQuiz: [
      {
        question: 'Are you complaining about a service that is ALREADY written in a signed IEP?',
        options: [
          { text: 'Yes, it is written down and signed, but they are not doing it', score: 'high', reason: 'This is a clear compliance issue. CDE is the correct agency.' },
          { text: 'No, we disagree on what services should be added', score: 'low', reason: 'Disagreements on services require Due Process or Mediation, not a CDE compliance complaint.' }
        ]
      }
    ]
  },
  'due-process-complaint': {
    slug: 'due-process-complaint',
    category: 'forms',
    title: 'OAH Due Process & Mediation Complaint (California)',
    metaTitle: 'OAH Due Process Complaint Form | IEP Appeals CA',
    metaDescription: 'Step-by-step parent guide to completing the California Office of Administrative Hearings (OAH) Due Process Complaint Form.',
    quickAnswer: 'The OAH Due Process Complaint is filed with the California Office of Administrative Hearings (OAH) to resolve formal disputes with a school district regarding IEP eligibility, evaluations, placement, or services. You can request Mediation-Only (which is voluntary and helpful for resolving issues early) or a formal Due Process Hearing.',
    tldrPoints: [
      { label: 'Form PDF Link', value: 'Download OAH Official' },
      { label: 'Mediation Option', value: 'Voluntary and highly recommended' },
      { label: 'Where to Send', value: 'Office of Administrative Hearings (OAH)' }
    ],
    whenThisMatters: 'When you have a major disagreement with the school district\\\'s IEP recommendations and want to go to mediation or a formal administrative trial.',
    signsThisMayApply: [
      'The school district refuses to place your child in a specialized SDC class.',
      'The district refuses to provide speech or occupational therapy hours.',
      'The district holds an IEP meeting and you disagree with all of their recommendations.'
    ],
    whatToDoFirst: [
      'Download the official OAH Due Process Complaint Form.',
      'Formulate your "Statement of Disagreement" and specify the exact resolution you want.',
      'Check the box for "Mediation Only" if you want to try resolving it early without a trial.',
      'File the form online, via fax, or certified mail with OAH and the school district.'
    ],
    documentsToGather: [
      { name: 'OAH Due Process Complaint Form', description: 'Official OAH Special Education form.', downloadUrl: 'https://www.dgs.ca.gov/OAH/Case-Types/Special-Education/Forms' },
      { name: 'Notice of Action / IEP Drafts', description: 'The current drafts you are disputing.' }
    ],
    whoToCall: [
      { name: 'Office of Administrative Hearings (OAH)', number: '916-263-0550', description: 'State agency managing California special ed due process hearings.' }
    ],
    whatToSay: 'I am filing a due process complaint on behalf of my child to challenge the school district\\\'s IEP recommendations. We request mediation to resolve the dispute.',
    commonMistakes: [
      'Filing a due process complaint without first seeking advocate or attorney advice. Hearing procedures are formal and follow trial rules.',
      'Failing to detail a specific proposed resolution (for example, you must state "We request 60 minutes of individual speech therapy weekly").'
    ],
    relatedGuides: [
      { title: 'Due Process Disputes and Mediation', url: '/benefits/california/special-education-dispute-resolution' }
    ],
    officialSources: [
      { name: 'OAH Special Education Division Portal', url: 'https://www.dgs.ca.gov/OAH/Case-Types/Special-Education' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Setting Up Mediation',
      script: 'Hi, I am calling regarding Case Number [OAH Case Number] which I filed last week. I want to verify when our mediation date will be scheduled and confirm that both parties have agreed to participate.',
      tips: 'Mediation dates are typically scheduled within 10-15 business days.'
    },
    letterTemplate: {
      title: 'Due Process and Mediation Filing Cover Letter',
      description: 'Formal cover letter to submit your due process complaint to OAH and your school district.',
      fields: [
        { key: 'parentName', label: 'Parent Name', placeholder: 'Jane Doe' },
        { key: 'childName', label: 'Child Name', placeholder: 'Tommy Doe' },
        { key: 'districtName', label: 'School District Name', placeholder: 'Fresno Unified' }
      ],
      generateFn: (f) => \`Date: \${new Date().toLocaleDateString()}
To: Office of Administrative Hearings (OAH)
Special Education Division

RE: Special Education Due Process Filing
Student Name: \${f.childName || '[Child Name]'}
Respondent District: \${f.districtName || '[School District]'}

Dear Filing Clerk,

Please find enclosed the completed OAH Due Process Complaint form filed on behalf of my minor child, \${f.childName || '[Child Name]'}, against the \${f.districtName || 'School District'}.

We are requesting a formal [Mediation Only / Due Process Hearing] to resolve our disputes regarding the child\\\'s IEP placement and services. A copy of this complaint has been sent to the Special Education Director of the school district today.

Sincerely,
\${f.parentName || '[Parent Name]'}\`
    },
    eligibilityQuiz: [
      {
        question: 'Are you prepared to attend a mediation meeting with the district?',
        options: [
          { text: 'Yes, we want to try mediation to resolve it quickly', score: 'high', reason: 'Filing for Mediation-Only is a highly effective way to negotiate services without a trial.' },
          { text: 'No, we do not want to discuss options with the school staff', score: 'low', reason: 'Due process requires a resolution meeting or mediation before a hearing can proceed.' }
        ]
      }
    ]
  },
  'ccs-application': {
    slug: 'ccs-application',
    category: 'forms',
    title: 'California Children\\\'s Services (CCS) Application',
    metaTitle: 'CCS Application PDF | California Children\\\'s Services',
    metaDescription: 'Step-by-step parent guide to completing the California Children\\\'s Services (CCS) Application. Download forms and gather documents.',
    quickAnswer: 'The CCS Application (Form DHCS 4480) is used to enroll in California Children\\\'s Services. This state-county program funds medical diagnostics, therapies, and equipment for children under age 21 with specific physical, neurological, or orthopedic disabilities (e.g. Cerebral Palsy, spina bifida, hearing loss, cystic fibrosis). It is separate from Medi-Cal.',
    tldrPoints: [
      { label: 'Form PDF Link', value: 'Download DHCS Official' },
      { label: 'Age Limit', value: 'Under 21 years old' },
      { label: 'Key Criterion', value: 'Orthopedic / Neurological diagnosis' }
    ],
    whenThisMatters: 'When your child has a physical disability or severe chronic medical condition and needs physical therapy, occupational therapy, or medical equipment.',
    signsThisMayApply: [
      'Your child is diagnosed with Cerebral Palsy, Spina Bifida, Muscular Dystrophy, or Cancer.',
      'Your child requires a wheelchair, braces, or hearing aids.'
    ],
    whatToDoFirst: [
      'Download Form DHCS 4480.',
      'Complete the parent details, medical history, and income statements (if applicable).',
      'Attach a signed pediatrician referral letter and diagnostic reports.',
      'Submit the application to your county\\\'s local CCS office.'
    ],
    documentsToGather: [
      { name: 'Form DHCS 4480 PDF', description: 'Official CCS Application Form.', downloadUrl: 'https://www.dhcs.ca.gov/services/ccs/Documents/dhcs4480.pdf' },
      { name: 'Diagnostic Neurological / Orthopedic Reports', description: 'To confirm eligibility of the medical condition.' }
    ],
    whoToCall: [
      { name: 'Local County CCS Office', description: 'Contact your county health department to find their local CCS address.' }
    ],
    whatToSay: 'I am applying for California Children\\\'s Services (CCS) on behalf of my child who has a physical orthopedic diagnosis. I want to schedule an evaluation at our local Medical Therapy Unit.',
    commonMistakes: [
      'Failing to attach diagnostic reports. CCS will deny the application if doctor notes do not prove the physical diagnosis.',
      'Assuming general developmental delay or Autism qualifies. CCS is strictly for physical, orthopedic, and chronic medical conditions.'
    ],
    relatedGuides: [
      { title: 'California Children\\\'s Services Guide', url: '/programs/california-childrens-services' }
    ],
    officialSources: [
      { name: 'DHCS CCS Program Guidelines', url: 'https://www.dhcs.ca.gov/services/ccs' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'CCS Intake Verification',
      script: 'Hi, I submitted a CCS application for [Child Name] last week. I want to check if the application has been processed and if we have been assigned to a Medical Therapy Unit coordinator.',
      tips: 'Follow up every 14 days until eligibility is confirmed.'
    },
    letterTemplate: {
      title: 'CCS Application Submission Cover Letter',
      description: 'Formal cover letter to send with your CCS application.',
      fields: [
        { key: 'parentName', label: 'Parent Name', placeholder: 'Jane Doe' },
        { key: 'childName', label: 'Child Name', placeholder: 'Tommy Doe' },
        { key: 'countyName', label: 'County Name', placeholder: 'San Diego' }
      ],
      generateFn: (f) => \`Date: \${new Date().toLocaleDateString()}
To: California Children\\\'s Services (CCS) Office
County of \${f.countyName || '[County]'}

RE: Application for CCS Enrollment and MTU Therapy Services
Child Name: \${f.childName || '[Child Name]'}

Dear CCS Intake Coordinator,

Please find enclosed the completed CCS Application Form DHCS 4480 along with supporting medical records for my child, \${f.childName || '[Child Name]'}.

My child has a physical medical diagnosis of [Insert Diagnosis] which qualifies for the CCS program. We request enrollment in the program and an evaluation for physical and occupational therapy at our local Medical Therapy Unit (MTU).

Sincerely,
\${f.parentName || '[Parent Name]'}\`
    },
    eligibilityQuiz: [
      {
        question: 'Does your child have an eligible physical/chronic medical condition?',
        options: [
          { text: 'Yes, they have Cerebral Palsy, Muscular Dystrophy, or hearing loss', score: 'high', reason: 'These conditions qualify directly under the CCS medical criteria.' },
          { text: 'No, they have general learning delays or ADHD', score: 'low', reason: 'General cognitive delays without orthopedic or severe medical conditions do not qualify for CCS.' }
        ]
      }
    ]
  },
  'dhcs-4480': {
    slug: 'dhcs-4480',
    category: 'forms',
    title: 'Form DHCS 4480: CCS Application Form',
    metaTitle: 'Form DHCS 4480 PDF | CCS Eligibility Guide',
    metaDescription: 'Step-by-step parent guide to completing the California DHCS 4480 application form for California Children\\\'s Services.',
    quickAnswer: 'Form DHCS 4480 is the official code name for the California Children\\\'s Services (CCS) Application. It is used to apply for medical equipment and physical/occupational therapy under the state\\\'s Medical Therapy Program. Parents must complete and sign this form and return it to their county\\\'s health department.',
    tldrPoints: [
      { label: 'Form PDF Link', value: 'Download DHCS Official' },
      { label: 'Authorized Signer', value: 'Parent or Guardian' },
      { label: 'Eligibility', value: 'Children under 21 with chronic conditions' }
    ],
    whenThisMatters: 'Identical to the CCS Application. Use this checklist and guide to complete the fields on the DHCS 4480 form.',
    signsThisMayApply: [
      'You are applying for medical therapy services at an MTU.',
      'Your child requires specialized medical equipment.'
    ],
    whatToDoFirst: [
      'Download Form DHCS 4480.',
      'Complete the identification and diagnosis fields.',
      'Provide your insurance details (Medi-Cal or private).',
      'Mail the form to your county\\\'s local CCS office.'
    ],
    documentsToGather: [
      { name: 'Form DHCS 4480 PDF', description: 'Official blank DHCS 4480 form.', downloadUrl: 'https://www.dhcs.ca.gov/services/ccs/Documents/dhcs4480.pdf' }
    ],
    whoToCall: [
      { name: 'County CCS Office Liaison', description: 'Contact them to submit the completed DHCS 4480.' }
    ],
    whatToSay: 'I am submitting Form DHCS 4480 to enroll my minor child in the California Children\\\'s Services program.',
    commonMistakes: [
      'Leaving the financial section blank if your family income exceeds $40,000. Note: MTU services are exempt from the income cap, but general CCS services require financial eligibility details.'
    ],
    relatedGuides: [
      { title: 'California Children\\\'s Services Guide', url: '/programs/california-childrens-services' }
    ],
    officialSources: [
      { name: 'DHCS Forms Directory', url: 'https://www.dhcs.ca.gov' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'CCS Form Submission Follow-up',
      script: 'Hi, I am calling to confirm receipt of Form DHCS 4480 which I sent on [Date] for my child, [Child Name]. Please let me know if you need additional neurologist reports to finalize eligibility.',
      tips: 'Ensure your return address is listed clearly on the envelope.'
    },
    eligibilityQuiz: [
      {
        question: 'Is your child under 21 years old?',
        options: [
          { text: 'Yes, they are under 21', score: 'high', reason: 'They are within the age range for CCS eligibility.' },
          { text: 'No, they are 21 or older', score: 'low', reason: 'CCS coverage ends on the child\\\'s 21st birthday.' }
        ]
      }
    ]
  },
  'medi-cal-application': {
    slug: 'medi-cal-application',
    category: 'forms',
    title: 'California Medi-Cal Application (Single Streamlined Form)',
    metaTitle: 'Medi-Cal Application Form | California Medicaid Guide',
    metaDescription: 'Complete parent guide to completing the California Medi-Cal application form. Bypassing asset limits and applying for minor children.',
    quickAnswer: 'The Medi-Cal Application (Form MC 210 or the Single Streamlined Application) is used to enroll in California\\\'s Medicaid program. For families with special needs children, Medi-Cal is vital to fund IHSS, behavioral therapies, and medical equipment. Parents can apply online via Covered California or by submitting a paper application to their county social services office.',
    tldrPoints: [
      { label: 'Official Portal', value: 'Apply Online via Covered California' },
      { label: 'Submission Methods', value: 'Online, Paper Form, or In-Person' },
      { label: 'Parent Signature', value: 'Required for minor applicants' }
    ],
    whenThisMatters: 'To establish health insurance coverage for your child that supports special needs waivers and care hours.',
    signsThisMayApply: [
      'Your child does not have health insurance, or you want secondary coverage.',
      'You are applying for the Regional Center Institutional Deeming waiver.'
    ],
    whatToDoFirst: [
      'Visit the Covered California portal or download the paper MC 210 application.',
      'Complete all demographic and household income sections.',
      'If applying via a waiver (e.g. Institutional Deeming), do NOT submit online; instead, submit a paper application directly to your Regional Center coordinator to process with the county.',
      'Track your application status on the BenefitsCal portal.'
    ],
    documentsToGather: [
      { name: 'Paper Medi-Cal Application Form', description: 'Official streamlined application form.', downloadUrl: 'https://www.dhcs.ca.gov/services/medi-cal/pages/apply_for_medi-cal.aspx' },
      { name: 'Income Statements', description: 'Tax returns or paystubs (unless parent income is waived under institutional deeming).' }
    ],
    whoToCall: [
      { name: 'Medi-Cal Member Helpline', number: '1-800-541-5555', description: 'State helpline for coverage and application questions.' }
    ],
    whatToSay: 'I am applying for Medi-Cal for my child. We are using the Regional Center institutional deeming waiver, so I want to confirm parent income is excluded from the calculation.',
    commonMistakes: [
      'Applying online if you are utilizing the Institutional Deeming waiver. Online applications automatically count parent income and will deny you. You must submit a paper application via your Regional Center worker.'
    ],
    relatedGuides: [
      { title: 'Medi-Cal for Kids Guide', url: '/programs/medi-cal-for-kids-and-teens' }
    ],
    officialSources: [
      { name: 'Covered California Portal', url: 'https://www.coveredca.com' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Checking Medi-Cal Status',
      script: 'Hello, this is [Parent Name]. I submitted a paper application for my child under the Institutional Deeming waiver. I want to check if the case has been approved and if my child\\\'s BIC card has been mailed.',
      tips: 'Always ask for the case number.'
    },
    eligibilityQuiz: [
      {
        question: 'Are you applying under the Regional Center Institutional Deeming waiver?',
        options: [
          { text: 'Yes, our Regional Center coordinator is helping us', score: 'high', reason: 'You must submit a paper application to bypass standard household income limits.' },
          { text: 'No, we are applying under standard low-income criteria', score: 'med', reason: 'You can apply online via Covered California or BenefitsCal.' }
        ]
      }
    ]
  },
  'medi-cal-epsdt-request': {
    slug: 'medi-cal-epsdt-request',
    category: 'forms',
    title: 'Medi-Cal EPSDT Supplemental Services Request Form',
    metaTitle: 'EPSDT Services Request | Medi-Cal EPSDT Guidelines',
    metaDescription: 'Step-by-step parent guide to submitting a Medi-Cal EPSDT request for private nursing, therapy, and behavioral services.',
    quickAnswer: 'The EPSDT (Early and Periodic Screening, Diagnostic, and Treatment) Supplemental Services Request is used to secure specialized medical services not normally covered by Medi-Cal, such as private duty nursing, intensive therapy sessions, or behavior therapy. Under federal law, Medi-Cal must fund any medically necessary service to treat a child\\\'s physical or mental condition under EPSDT.',
    tldrPoints: [
      { label: 'Official Instructions Page', value: 'Refer to DHCS EPSDT' },
      { label: 'Key Right', value: 'Any medically necessary service is covered' },
      { label: 'Authorized Requestor', value: 'Licensed Physician or Clinical Provider' }
    ],
    whenThisMatters: 'When your child requires home nursing hours, extra physical therapy sessions, or specialized diagnostic tests, and Medi-Cal has denied the initial coverage request.',
    signsThisMayApply: [
      'Your child is medically fragile and requires private nursing at home.',
      'Standard therapy caps prevent your child from receiving adequate speech/OT.'
    ],
    whatToDoFirst: [
      'Work with your child\\\'s doctor to draft a detailed letter of medical necessity.',
      'Complete the EPSDT services request details (typically submitted via a Prior Authorization Request/TAR by the provider).',
      'Submit the provider TAR to Medi-Cal.',
      'If denied, file an appeal immediately citing EPSDT regulations.'
    ],
    documentsToGather: [
      { name: 'Detailed Physician Recommendation', description: 'Letter stating why the specific hours/services are medically necessary.' },
      { name: 'Prior Authorization / TAR Form', description: 'Completed by the requesting medical provider.' }
    ],
    whoToCall: [
      { name: 'DHCS EPSDT Division Office', number: '916-552-9200', description: 'State office managing the EPSDT waiver program.' }
    ],
    whatToSay: 'I am requesting supplemental home nursing services under EPSDT guidelines. The doctor has confirmed this is medically necessary to prevent hospitalization.',
    commonMistakes: [
      'Accepting a denial that claims "service is not a benefit". Under federal EPSDT rules, if it is medically necessary, the state MUST cover it, regardless of whether it is listed in the standard state plan.'
    ],
    relatedGuides: [
      { title: 'Medi-Cal EPSDT Guide', url: '/benefits/california/medi-cal-epsdt-behavioral-services' }
    ],
    officialSources: [
      { name: 'DHCS EPSDT Guidelines Portal', url: 'https://www.dhcs.ca.gov/services/medi-cal/pages/epsdt.aspx' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Nursing Hours Appeal',
      script: 'Hi, I am calling to appeal the reduction of our private nursing hours. Under EPSDT guidelines, these hours are medically necessary to manage my child\\\'s safety.',
      tips: 'Document all clinical events that occurred due to nursing shortages.'
    },
    eligibilityQuiz: [
      {
        question: 'Is the requested service medically necessary?',
        options: [
          { text: 'Yes, the pediatrician signed a letter of medical necessity', score: 'high', reason: 'This triggers the state\\\'s legal obligation to cover the service under EPSDT.' },
          { text: 'No, we are seeking this for social/after-school support', score: 'low', reason: 'EPSDT requires clinical diagnostic justification.' }
        ]
      }
    ]
  },
  'ssi-child-disability-checklist': {
    slug: 'ssi-child-disability-checklist',
    category: 'forms',
    title: 'SSI Child Disability Starter Kit Checklist',
    metaTitle: 'SSI Child Disability Checklist | Social Security Administration',
    metaDescription: 'Complete checklist of records needed to apply for SSI Child Disability benefits. Avoid application delays.',
    quickAnswer: 'The SSI Child Disability Checklist is the starter kit detailing the forms, medical records, school IEPs, and financial data required to apply for Supplemental Security Income (SSI) for a minor child. While the application is completed online or in-person, parents should use this checklist to compile their records to ensure their application is not delayed or denied.',
    tldrPoints: [
      { label: 'Official Check-List Portal', value: 'Download SSA Starter Kit' },
      { label: 'Key Form', value: 'Form SSA-3820 (Disability Report)' },
      { label: 'Financial Limit', value: 'Household income checks apply' }
    ],
    whenThisMatters: 'When applying for monthly SSI cash assistance on behalf of a disabled child whose family meets the household income limits.',
    signsThisMayApply: [
      'Your child has severe developmental or physical limitations.',
      'Your family household income and resources are within the SSA limits.'
    ],
    whatToDoFirst: [
      'Download the SSA Child Disability Starter Kit checklist.',
      'Gather all physician contact details, school IEPs, and therapist files.',
      'Complete the online Child Disability Report (Form SSA-3820).',
      'Schedule an intake interview with your local Social Security office.'
    ],
    documentsToGather: [
      { name: 'SSA Child Disability Checklist PDF', description: 'Official SSA check-sheet.', downloadUrl: 'https://www.ssa.gov/disability/Documents/ChildStatKit.pdf' },
      { name: 'Form SSA-3820 PDF', description: 'The comprehensive Child Disability Report.' }
    ],
    whoToCall: [
      { name: 'Social Security Administration Helpline', number: '1-800-772-1213', description: 'National call center to schedule intake appointments.' }
    ],
    whatToSay: 'I want to schedule an appointment to apply for child SSI disability benefits. I have compiled the child disability report and clinical records.',
    commonMistakes: [
      'Failing to detail how your child\\\'s disability limits their daily activities compared to typically developing peers. SSA evaluates functional limitations.',
      'Assuming parents\\\' assets are not counted. SSI is resource-tested, and parent resources "deem" to the child (except in certain waiver programs).'
    ],
    relatedGuides: [
      { title: 'SSI for Children Guide', url: '/programs/ssi-for-children' }
    ],
    officialSources: [
      { name: 'Social Security Administration Portal', url: 'https://www.ssa.gov/benefits/disability/apply-child.html' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Scheduling SSI Interview',
      script: 'Hi, I want to apply for SSI child disability benefits for my minor child. I have completed the online disability report. Please schedule a phone interview with my local SSA office.',
      tips: 'Keep a notebook of all representatives you speak with.'
    },
    eligibilityQuiz: [
      {
        question: 'Does your family have resource assets under $3,000 (excluding one home/car)?',
        options: [
          { text: 'Yes, we are within the resource limits', score: 'high', reason: 'You meet the financial resource criteria to apply for SSI.' },
          { text: 'No, our assets exceed the resource limits', score: 'low', reason: 'Your child will be financially disqualified from SSI, regardless of the severity of their disability.' }
        ]
      }
    ]
  },
  'calable-account-opening': {
    slug: 'calable-account-opening',
    category: 'forms',
    title: 'CalABLE Account Enrollment & Savings Form',
    metaTitle: 'CalABLE Account Enrollment Form | California ABLE',
    metaDescription: 'Step-by-step guide to opening a tax-exempt CalABLE savings account for a special needs child in California.',
    quickAnswer: 'The CalABLE Account Enrollment Form is the official registration application to establish a CalABLE account. It can be completed entirely online. Minor child accounts are opened by an Authorized Legal Representative (ALR), typically a parent or legal guardian. The form enables tax-free savings up to $18,000 annually without disqualifying the child from SSI and Medi-Cal.',
    tldrPoints: [
      { label: 'Official Portal', value: 'Open Account Online via CalABLE' },
      { label: 'Annual Contribution Limit', value: '$18,000' },
      { label: 'SSI Resource Waiver Limit', value: '$100,000' }
    ],
    whenThisMatters: 'To save money for a child with special needs without triggering the $2,000 asset limit set by SSI and Medi-Cal.',
    signsThisMayApply: [
      'The child has a disability that began before age 26.',
      'The family wants to invest savings, accept monetary gifts, or protect inheritance funds.'
    ],
    whatToDoFirst: [
      'Visit the official CalABLE online portal.',
      'Complete the registration, declaring your status as the ALR.',
      'Link your bank account to make the initial minimum deposit.',
      'Choose conservative, moderate, or aggressive investment portfolios.'
    ],
    documentsToGather: [
      { name: 'Physician Disability Certification Letter', description: 'A signed letter from a doctor confirming the disability onset occurred before age 26.' }
    ],
    whoToCall: [
      { name: 'CalABLE Board Customer Relations', number: '1-833-225-3253', description: 'Call for assistance setting up portfolios.' }
    ],
    whatToSay: 'I am opening a CalABLE savings account as the ALR on behalf of my minor child. I want to confirm our deposit limits and tax-exempt status.',
    commonMistakes: [
      'Registering the account under the parent\\\'s SSN. It MUST be opened under the child\\\'s SSN to shield their benefits eligibility.',
      'Allowing the balance to exceed $100,000 if the child receives SSI.'
    ],
    relatedGuides: [
      { title: 'CalABLE Disability Accounts', url: '/programs/calable' }
    ],
    officialSources: [
      { name: 'Official CalABLE Website', url: 'https://www.calable.ca.gov' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'CalABLE Customer Service Support',
      script: 'Hi, I am setting up a CalABLE account for my child. I am their parent and legal guardian. I want to verify the fee structures and check if we can set up automated monthly deposits.',
      tips: 'Select the electronic delivery option to avoid paper statement fees.'
    },
    eligibilityQuiz: [
      {
        question: 'Did your child\\\'s disability onset occur before age 26?',
        options: [
          { text: 'Yes, disability was diagnosed in childhood', score: 'high', reason: 'You meet the eligibility rules to open a CalABLE account.' },
          { text: 'No, onset was after age 26', score: 'low', reason: 'Currently, the age of onset limit is 26. Note: Under new federal guidelines, this raises to 46 in 2026.' }
        ]
      }
    ]
  },
  'hcba-waiver-application': {
    slug: 'hcba-waiver-application',
    category: 'forms',
    title: 'Home and Community-Based Alternatives (HCBA) Waiver Application',
    metaTitle: 'HCBA Waiver Application Form | California DHCS',
    metaDescription: 'Complete parent guide to applying for the California HCBA Waiver for medically fragile children. Bypassing asset limits for nursing care.',
    quickAnswer: 'The HCBA Waiver Application is used to apply for California\\\'s Home and Community-Based Alternatives Waiver. This program provides in-home nursing care, case management, and home modifications for medically fragile children who would otherwise require hospitalization or institutional care. Like the Regional Center waiver, parental income is completely ignored for eligibility.',
    tldrPoints: [
      { label: 'Official Application Portal', value: 'Refer to Local HCBA agency' },
      { label: 'Target Audience', value: 'Medically fragile children needing nursing care' },
      { label: 'Waitlist Time', value: 'Can be up to 1-2 years' }
    ],
    whenThisMatters: 'When your child has complex medical needs (such as tracheostomy, ventilators, G-tubes, or severe seizure disorders) and requires home nursing care.',
    signsThisMayApply: [
      'Your child requires active nursing interventions throughout the day or night.',
      'Your child is in danger of being placed in a sub-acute facility due to care needs.'
    ],
    whatToDoFirst: [
      'Identify the local HCBA waiver agency that covers your county.',
      'Download and complete the HCBA Waiver Application.',
      'Gather clinical medical summaries and nursing logs.',
      'Mail or email the application to the assigned agency and follow up to verify your waitlist placement date.'
    ],
    documentsToGather: [
      { name: 'HCBA Application PDF', description: 'The official HCBA waiver intake form.', downloadUrl: 'https://www.dhcs.ca.gov/services/ltc/Pages/Home-and-Community-Based-Alternatives-Waiver.aspx' },
      { name: 'Clinical Nursing Assessment / Logs', description: 'Confirming the hours of daily nursing care required.' }
    ],
    whoToCall: [
      { name: 'DHCS Integrated Systems of Care Division', number: '916-552-9105', description: 'State office managing the HCBA waiver program.' }
    ],
    whatToSay: 'I am submitting an HCBA waiver application for my medically fragile child. I want to confirm that parent income is waived and request our waitlist placement date.',
    commonMistakes: [
      'Failing to apply early. The waitlist is extremely long, and applying immediately upon diagnosis is critical.',
      'Completing the application without listing all life-sustaining medical equipment (like feeding pumps or oxygen).'
    ],
    relatedGuides: [
      { title: 'HCBA Waiver Program Details', url: '/programs/hcba' }
    ],
    officialSources: [
      { name: 'DHCS HCBA Waiver Program Page', url: 'https://www.dhcs.ca.gov/services/ltc/Pages/Home-and-Community-Based-Alternatives-Waiver.aspx' }
    ],
    lastReviewedDate: '2026-06-01',
    callScriptTemplate: {
      intro: 'Filing HCBA Application',
      script: 'Hi, I am calling to follow up on the HCBA waiver application I submitted for my child, [Child Name]. I want to confirm our application is logged and verify our position on the waiting list.',
      tips: 'Always ask for the date of your waitlist registry entry.'
    },
    letterTemplate: {
      title: 'HCBA Waiver Interest Request Letter',
      description: 'Use this letter to request waitlist placement at your local HCBA agency.',
      fields: [
        { key: 'parentName', label: 'Parent Name', placeholder: 'Jane Doe' },
        { key: 'childName', label: 'Child Name', placeholder: 'Tommy Doe' },
        { key: 'dob', label: 'Child\\\'s DOB', placeholder: '01/01/2021' },
        { key: 'agencyName', label: 'Local HCBA Agency', placeholder: 'Libertana or equivalent' }
      ],
      generateFn: (f) => \`Date: \${new Date().toLocaleDateString()}
To: Intake Department
HCBA Waiver Agency: \${f.agencyName || '[Agency Name]'}

RE: Application for HCBA Waiver Interest List Registry
Child Name: \${f.childName || '[Child Name]'}
Date of Birth: \${f.dob || '[DOB]'}

Dear Waiver Intake Specialist,

I am writing on behalf of my minor child, \${f.childName || '[Child Name]'}, to formally request that they be placed on the California Home and Community-Based Alternatives (HCBA) Waiver interest list.

My child has complex medical needs, including [Insert Medical Needs, e.g., G-tube feeding, respiratory support], and requires active clinical support to remain safely at home. I have attached the latest hospital discharge summary and nursing assessment to confirm eligibility.

Please register our interest date immediately and notify me of our placement confirmation in writing.

Sincerely,
\${f.parentName || '[Parent Name]'}\`
    },
    eligibilityQuiz: [
      {
        question: 'Does your child require active medical or nursing interventions daily?',
        options: [
          { text: 'Yes, they have a G-tube, tracheostomy, or ventilator', score: 'high', reason: 'They qualify under the medically fragile criteria for the HCBA waiver.' },
          { text: 'No, they have developmental delays without medical fragility', score: 'low', reason: 'General developmental or learning delays do not qualify for the HCBA waiver.' }
        ]
      }
    ]
  }
`;

// Read current seo-data.ts file
let fileContent = fs.readFileSync(seoDataPath, 'utf8');

// Find the position of the closing bracket of SEO_CLUSTERS
const lastBracketIndex = fileContent.lastIndexOf('};');
if (lastBracketIndex === -1) {
  console.error("Could not find the end of the file or SEO_CLUSTERS declaration.");
  process.exit(1);
}

// Insert before the last bracket
const newContent = fileContent.slice(0, lastBracketIndex) + FORMS_CODE_STRING + fileContent.slice(lastBracketIndex);
fs.writeFileSync(seoDataPath, newContent, 'utf8');
console.log("Successfully appended all form profiles to SEO_CLUSTERS in seo-data.ts!");
process.exit(0);
