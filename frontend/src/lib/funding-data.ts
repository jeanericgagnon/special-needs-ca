export interface DDSServiceCode {
  code: string;
  name: string;
  category: 'Respite & Relief' | 'Behavioral & Therapy' | 'Social & Recreation' | 'Supervision & Safety' | 'Training & Support';
  description: string;
  parentSummary: string;
  qualifyingCriteria: string;
  typicalAuthLimits: string;
}

export interface EmailTemplate {
  id: string;
  title: string;
  subject: string;
  body: string;
  placeholders: {
    key: string;
    label: string;
    defaultValue: string;
  }[];
}

export const DDS_SERVICE_CODES: DDSServiceCode[] = [
  {
    code: '862',
    name: 'In-Home Respite Services (Agency)',
    category: 'Respite & Relief',
    description: 'Intermittent care and supervision provided by an agency-employed caregiver to a consumer in their home to relieve family members.',
    parentSummary: 'A background-checked, agency-provided babysitter trained in special needs. They come to your house so you can take a break.',
    qualifyingCriteria: 'Requires a showing of care demands that exceed those of a neurotypical child of the same age (e.g., safety supervision, medical needs, diapering at an older age).',
    typicalAuthLimits: 'Typically 12 to 30 hours per month. Can be higher (40-60+ hours) if the child has severe medical or behavioral support needs.'
  },
  {
    code: '896',
    name: 'Individual Family Care Provider (Self-Directed Respite)',
    category: 'Respite & Relief',
    description: 'Respite care provided by an individual chosen by the family (often a relative or trusted friend) and paid through a Financial Management Service (FMS).',
    parentSummary: 'Allows you to hire your own trusted friend, neighbor, or family member (except parents/spouses) to provide respite, with the state paying them hourly.',
    qualifyingCriteria: 'Same basic respite criteria, but requires coordinating with a Financial Management Service (FMS) agency to handle payroll and background checks.',
    typicalAuthLimits: 'Usually matches standard respite hours allocation (12 to 40+ hours per month).'
  },
  {
    code: '612',
    name: 'Behavior Analyst / Behavior Intervention',
    category: 'Behavioral & Therapy',
    description: 'Design, implementation, and evaluation of environmental modifications, using behavioral stimuli and consequences, to produce socially significant improvement in human behavior.',
    parentSummary: 'ABA therapy, positive behavior support, and therapist hours to work with your child at home and train parents on managing behaviors.',
    qualifyingCriteria: 'Evidence of behaviors that present safety issues (aggression, self-injury, property destruction) or impede the child\'s ability to access the community.',
    typicalAuthLimits: 'Covers assessment (10-15 hours) and weekly therapy hours ranging from 5 to 20+ hours per week, depending on severity.'
  },
  {
    code: '028',
    name: 'Socialization Training Program (Social Rec)',
    category: 'Social & Recreation',
    description: 'Programs designed to provide structured integration and socialization opportunities, including recreational activities, specialized camps, and social skills groups.',
    parentSummary: 'Funding for social skills classes, specialized summer camps, and recreational program fees (restored fully under SB 188 in CA).',
    qualifyingCriteria: 'Socialization deficits identified in the IPP (Individual Program Plan) goals. The program must help the child interact with peers.',
    typicalAuthLimits: 'Registration fees for standard or specialized camps (up to a certain dollar cap), or monthly fees for social skills classes.'
  },
  {
    code: '820',
    name: 'Specialized Supervision',
    category: 'Supervision & Safety',
    description: 'Extra care and supervision provided during non-school hours to ensure the consumer’s safety and health when participating in extracurricular or camp activities.',
    parentSummary: 'Funding for a 1:1 aide to accompany your child to a mainstream after-school program, YMCA, or day camp to keep them safe and included.',
    qualifyingCriteria: 'The child requires constant 1:1 visual supervision to prevent running away (elopement), self-injury, or physical accidents, and standard programs do not provide this ratio.',
    typicalAuthLimits: 'Granted for the hours the child attends the summer camp or after-school program (e.g., 15-30 hours per week during summer).'
  },
  {
    code: '102',
    name: 'Individual and Family Training (Parent Training)',
    category: 'Training & Support',
    description: 'Educational services and workshops provided to parents to teach specialized advocacy, medical care, behavioral interventions, or sign language.',
    parentSummary: 'Funding for parents to attend special needs educational workshops, behavior intervention conferences, or communication classes.',
    qualifyingCriteria: 'Training must be directly related to the child\'s diagnosed developmental disability and outline how it helps parents implement IPP goals.',
    typicalAuthLimits: 'Covers specific class fees or authorized seminar registration costs.'
  },
  {
    code: '333',
    name: 'Specialized Therapeutic Services (Speech, OT, PT)',
    category: 'Behavioral & Therapy',
    description: 'Clinical occupational, physical, or speech therapy services provided to consumers to maintain or improve sensory-motor, communication, or physical functioning.',
    parentSummary: 'Speech, Occupational, or Physical Therapy sessions funded directly by the Regional Center when insurance has denied coverage and schools do not provide it.',
    qualifyingCriteria: 'Requires a written denial from the family\'s health insurance and a showing that the service is not available through the local school district\'s IEP.',
    typicalAuthLimits: 'Typically 1 session per week (4 sessions per month), re-authorized annually.'
  }
];

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'req-respite',
    title: 'Requesting In-Home Respite Care',
    subject: 'Request for IPP Review / Addition of In-Home Respite Services - {{child_name}}',
    body: `Dear {{coordinator_name}},

I hope this email finds you well. I am writing to formally request an Individual Program Plan (IPP) review meeting (or an IPP addendum) to request In-Home Respite Services (Service Code {{respite_code}}) for my child, {{child_name}} (DOB: {{child_dob}}).

Over the past several months, the care demands for {{child_name}} have increased significantly, far exceeding the care requirements of a neurotypical child of the same age. Specifically, {{child_name}} requires intensive care and continuous safety supervision due to the following reasons:
{{care_justification}}

These duties place a heavy cognitive, physical, and emotional load on our family. The addition of In-Home Respite hours is critical to prevent caregiver burnout, maintain family stability, and ensure {{child_name}}\'s safety in our home.

Based on our current care needs, we are requesting an allocation of {{requested_hours}} hours per month.

I look forward to discussing this at your earliest convenience. Under the Lanterman Act, I understand that the Regional Center must schedule an IPP review within 30 days of a parent\'s request.

Thank you for your advocacy and support.

Sincerely,
{{parent_name}}
{{parent_phone}}`,
    placeholders: [
      { key: 'coordinator_name', label: 'Service Coordinator Name', defaultValue: 'Jane Doe' },
      { key: 'child_name', label: 'Child\'s Nickname', defaultValue: 'Liam' },
      { key: 'child_dob', label: 'Child\'s Date of Birth', defaultValue: '2018-05-12' },
      { key: 'respite_code', label: 'Respite Service Code', defaultValue: '862 (Agency) / 896 (Self-Directed)' },
      { key: 'care_justification', label: 'Care Needs / Justification (Fills in automatically from calculator)', defaultValue: '- Requires 100% assistance with diapering/toileting.\n- Wakes 2-3 times nightly requiring safety checks.\n- Elopement risk: runs into streets or dangerous areas.' },
      { key: 'requested_hours', label: 'Requested Hours / Month', defaultValue: '24' },
      { key: 'parent_name', label: 'Caregiver Name', defaultValue: 'Sarah Jenkins' },
      { key: 'parent_phone', label: 'Caregiver Phone Number', defaultValue: '' }
    ]
  },
  {
    id: 'req-social-rec',
    title: 'Requesting Social Recreation / Camp Funding (SB 188)',
    subject: 'Request for Funding Approval for Social Recreation / Camp Services - {{child_name}}',
    body: `Dear {{coordinator_name}},

I am writing to request that the Regional Center authorize funding for socialization and recreational services for my child, {{child_name}} (DOB: {{child_dob}}), under DDS Service Code 028. Specifically, I am requesting funding for:
Program Name: {{program_name}}
Cost/Tuition: {{program_cost}}

As you are aware, Senate Bill 188 fully restored the Regional Center\'s authority to fund social recreation services, camp services, and travel training. {{child_name}} has significant socialization deficits, specifically in:
{{socialization_needs}}

Participating in this program directly aligns with {{child_name}}\'s IPP goal of improving peer socialization, community integration, and motor skills. Enclosed is the flyer/invoice for the program for your review.

Please let me know how we can expedite this authorization so {{child_name}} can begin this crucial social training.

Best regards,
{{parent_name}}
{{parent_phone}}`,
    placeholders: [
      { key: 'coordinator_name', label: 'Service Coordinator Name', defaultValue: 'Jane Doe' },
      { key: 'child_name', label: 'Child\'s Nickname', defaultValue: 'Liam' },
      { key: 'child_dob', label: 'Child\'s Date of Birth', defaultValue: '2018-05-12' },
      { key: 'program_name', label: 'Recreational Program / Camp Name', defaultValue: 'Sensory Gymnastics Class' },
      { key: 'program_cost', label: 'Cost / Tuition Amount', defaultValue: '$180 per month' },
      { key: 'socialization_needs', label: 'Social & Communication Needs', defaultValue: '- Struggles to initiate play with peer groups.\n- Needs visual cues to stay safe in public settings.\n- Has severe physical motor delays requiring a structured coach.' },
      { key: 'parent_name', label: 'Caregiver Name', defaultValue: 'Sarah Jenkins' },
      { key: 'parent_phone', label: 'Caregiver Phone Number', defaultValue: '' }
    ]
  },
  {
    id: 'appeal-denial',
    title: 'Appealing a Regional Center Verbal Denial (Notice of Action)',
    subject: 'Formal Request for Written Notice of Action (NOA) - {{child_name}}',
    body: `Dear {{coordinator_name}} and Regional Center Supervisor,

I am writing to follow up on our discussion on {{discussion_date}}, during which I was verbally informed that my request for {{requested_service}} for my child, {{child_name}}, was denied.

Under California Welfare and Institutions Code Section 4710.5, when a Regional Center decides to deny, reduce, or terminate a service requested by a consumer or family, it MUST provide a written Notice of Action (NOA). 

Please accept this email as my formal request for a written Notice of Action detailing the legal and factual basis for this denial. Under W&I Code Section 4710, this notice must be provided in writing and include details on how to file an appeal and request a Fair Hearing.

Please issue the written NOA within the statutory timelines so that we may proceed with our rights under the Lanterman Act appeal process.

Thank you,
{{parent_name}}
{{parent_phone}}`,
    placeholders: [
      { key: 'coordinator_name', label: 'Service Coordinator Name', defaultValue: 'Jane Doe' },
      { key: 'discussion_date', label: 'Date of Verbal Denial', defaultValue: 'Yesterday' },
      { key: 'requested_service', label: 'Service Requested (e.g. 20 hrs/mo Respite)', defaultValue: '24 hours of In-Home Respite Care' },
      { key: 'child_name', label: 'Child\'s Nickname', defaultValue: 'Liam' },
      { key: 'parent_name', label: 'Caregiver Name', defaultValue: 'Sarah Jenkins' },
      { key: 'parent_phone', label: 'Caregiver Phone Number', defaultValue: '' }
    ]
  }
];

export interface RespiteQuizAnswers {
  safety: number; // 0 - 5
  sleep: number; // 0 - 4
  medical: number; // 0 - 4
  behavior: number; // 0 - 4
}

export function calculateRespiteTier(answers: RespiteQuizAnswers) {
  const score = answers.safety + answers.sleep + answers.medical + answers.behavior;
  
  let tier: 'Low' | 'Moderate' | 'High' | 'Critical';
  let suggestedHours: string;
  let summary: string;

  if (score <= 3) {
    tier = 'Low';
    suggestedHours = '12 to 16 hours per month';
    summary = 'Your child has low safety or sleep disturbances compared to age baselines. Standard respite allocations are sufficient to prevent caregiver fatigue.';
  } else if (score <= 7) {
    tier = 'Moderate';
    suggestedHours = '20 to 28 hours per month';
    summary = 'Your child requires moderate daily care modifications, diapering/feeding support, or displays occasional sleep issues/safety risks. This warrant a standard active respite package.';
  } else if (score <= 11) {
    tier = 'High';
    suggestedHours = '30 to 45 hours per month';
    summary = 'Your child has high care demands, significant sleep disturbances (night waking), or moderate elopement/safety hazards. This requires a robust respite supervision package.';
  } else {
    tier = 'Critical';
    suggestedHours = '45 to 60+ hours per month (Consider Specialized Supervision / Nursing)';
    summary = 'Your child has intense, constant supervision needs due to severe safety risks (elopement, pica), critical medical fragility, or daily behaviors. This pattern may support a higher respite request, potentially including specialized supervision (Code 820) or medical nursing respite if the current program rules allow it.';
  }

  return {
    score,
    tier,
    suggestedHours,
    summary
  };
}

export function compileJustificationBulletPoints(answers: RespiteQuizAnswers): string {
  const bullets: string[] = [];
  
  if (answers.safety >= 4) {
    bullets.push('- Critical Elopement/Safety Risk: Child displays severe running-away behaviors, runs out of safe boundaries, or eats non-food items (pica), requiring constant 1:1 visual monitoring.');
  } else if (answers.safety >= 2) {
    bullets.push('- Safety Supervision: Child lacks age-appropriate safety awareness, requiring constant redirection to prevent physical injury.');
  }

  if (answers.sleep >= 3) {
    bullets.push('- Night Waking & Sleep Disruption: Child wakes up multiple times a night, requiring 1-2+ hours of active caregiving during sleep hours, causing severe caregiver sleep deprivation.');
  } else if (answers.sleep >= 1) {
    bullets.push('- Sleep Routine Support: Child has significant difficulty falling asleep or staying asleep, requiring intensive evening soothing and supervision.');
  }

  if (answers.medical >= 3) {
    bullets.push('- Significant Care/Medical Fragility: Child requires complete physical assistance for toileting/diapering (well past standard potty-training ages), or demands specialized medical tasks (e.g. seizure tracking, specialized diet preparation, or G-tube cleaning).');
  } else if (answers.medical >= 1) {
    bullets.push('- Care Demands: Child requires substantial extra assistance with activities of daily living (dressing, bathing, eating) due to motor delays.');
  }

  if (answers.behavior >= 3) {
    bullets.push('- Severe Behavioral Support Needs: Child exhibits intense daily tantrums, physical aggression, or self-injurious behavior requiring specialized behavior management methods.');
  } else if (answers.behavior >= 1) {
    bullets.push('- Behavioral Refocusing: Child needs structured support and positive reinforcement schedules to prevent emotional meltdowns during transitions.');
  }

  if (bullets.length === 0) {
    bullets.push('- General Care Demands: Child requires elevated supervision, structure, and physical assistance with daily routines that exceeds standard parental duties for this age group.');
  }

  return bullets.join('\n');
}

export interface RegionalCenterMetrics {
  id: string;
  name: string;
  counties: string;
  avgPosSpend: number;
  avgRespiteHours: number;
  utilizationRate: number;
  disparityScore: number;
  context: string;
}

export const REGIONAL_CENTER_METRICS: RegionalCenterMetrics[] = [
  {
    id: 'fdlrc',
    name: 'Frank D. Lanterman Regional Center (FDLRC)',
    counties: 'Los Angeles (Central, Hollywood, Pasadena)',
    avgPosSpend: 16800,
    avgRespiteHours: 28,
    utilizationRate: 52,
    disparityScore: 8,
    context: 'Higher average POS spending but significant service delivery disparities across language/ethnic groups, particularly in respite and behavioral services. Staffing shortages in central LA impact utilization.'
  },
  {
    id: 'sdrc',
    name: 'San Diego Regional Center (SDRC)',
    counties: 'San Diego, Imperial',
    avgPosSpend: 11400,
    avgRespiteHours: 18,
    utilizationRate: 42,
    disparityScore: 6,
    context: 'Below average respite allocations. Imperial County clients face severe staffing deserts, resulting in a low 42% utilization of authorized hours.'
  },
  {
    id: 'rceb',
    name: 'Regional Center of the East Bay (RCEB)',
    counties: 'Alameda, Contra Costa',
    avgPosSpend: 15200,
    avgRespiteHours: 24,
    utilizationRate: 58,
    disparityScore: 5,
    context: 'Moderate-high utilization rate compared to southern CA. Strong local advocate presence, though waitlists for social-recreation programs have grown post-restoration.'
  },
  {
    id: 'acrc',
    name: 'Alta California Regional Center (ACRC)',
    counties: 'Sacramento, Placer, Yolo, Alpine, El Dorado, Nevada, Sutter, Yuba',
    avgPosSpend: 13900,
    avgRespiteHours: 20,
    utilizationRate: 64,
    disparityScore: 4,
    context: 'Relatively high utilization due to robust agency networks in Sacramento. However, rural counties (e.g. Alpine, Sierra) experience critical therapist shortage bottlenecks.'
  },
  {
    id: 'irc',
    name: 'Inland Regional Center (IRC)',
    counties: 'Riverside, San Bernardino',
    avgPosSpend: 9800,
    avgRespiteHours: 16,
    utilizationRate: 38,
    disparityScore: 9,
    context: 'California\'s largest regional center. Suffers from critical under-funding per capita and the lowest respite utilization (38%) in the state due to severe vendor wage gaps.'
  },
  {
    id: 'rcoc',
    name: 'Regional Center of Orange County (RCOC)',
    counties: 'Orange',
    avgPosSpend: 17300,
    avgRespiteHours: 32,
    utilizationRate: 61,
    disparityScore: 7,
    context: 'High average spending and respite authorization levels. However, audit reports show substantial POS funding gaps between English-speaking and non-English-speaking households.'
  },
  {
    id: 'ggrc',
    name: 'Golden Gate Regional Center (GGRC)',
    counties: 'San Francisco, Marin, San Mateo',
    avgPosSpend: 18500,
    avgRespiteHours: 30,
    utilizationRate: 46,
    disparityScore: 3,
    context: 'Highest average POS expenditure per consumer in the state, driven by high cost of living. However, recruitment of respite workers in SF/Marin is extremely difficult.'
  },
  {
    id: 'vmrc',
    name: 'Valley Mountain Regional Center (VMRC)',
    counties: 'San Joaquin, Stanislaus, Amador, Calaveras, Tuolumne',
    avgPosSpend: 12100,
    avgRespiteHours: 22,
    utilizationRate: 50,
    disparityScore: 6,
    context: 'Moderate spending with significant geographic disparities between Stockton urban centers and foothill counties (Amador/Calaveras) which lack localized respite providers.'
  },
  {
    id: 'cvrc',
    name: 'Central Valley Regional Center (CVRC)',
    counties: 'Fresno, Kings, Madera, Mariposa, Merced, Tulare',
    avgPosSpend: 10500,
    avgRespiteHours: 18,
    utilizationRate: 45,
    disparityScore: 8,
    context: 'Lower than average expenditures per client. Language access barriers for agricultural communities limit intake and authorization of specialized supervision.'
  }
];

export const STATEWIDE_AVERAGES = {
  avgPosSpend: 14100,
  avgRespiteHours: 23,
  utilizationRate: 50,
  disparityScore: 6
};
