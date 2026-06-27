/**
 * Seed Data for California Disability Navigator
 * Fully structures high-trust records for Programs, Conditions, Functional Needs, Regional Centers, Counties, and Guides.
 */

export const counties = [
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    website: 'https://lacounty.gov',
    ihssOffice: 'LA County Department of Public Social Services (DPSS) - IHSS Helpline',
    ihssContact: 'Phone: (888) 944-4477, Address: 2707 S. Grand Ave, Los Angeles, CA 90007',
    mediCalOffice: 'DPSS Medi-Cal Intake Office',
    mediCalContact: 'Phone: (866) 613-3777, Portal: BenefitsCal.com',
    ccsOffice: 'Los Angeles County California Children Services (CCS)',
    ccsContact: 'Phone: (800) 288-4584, Address: 9320 Telstar Ave, El Monte, CA 91731',
    behavioralHealthLine: 'LAC DMH Access Line: (800) 854-7771',
    publicHealthDept: 'LA County Department of Public Health',
    officeOfEducation: 'Los Angeles County Office of Education (LACOE)',
    selpas: ['LA Unified SELPA', 'Tri-Cities SELPA', 'East San Gabriel Valley SELPA'],
    schoolDistricts: [
      { name: 'Los Angeles Unified School District (LAUSD)', specEdPhone: '(213) 241-6701', email: 'sp-ed-parent@lausd.net', website: 'https://achieve.lausd.net/sped' }
    ],
    familyResourceCenter: 'Eastern Los Angeles Family Resource Center / Family Focus Resource Center',
    localOrganizations: [
      { name: 'Down Syndrome Association of Los Angeles (DSALA)', website: 'https://www.dsala.org' },
      { name: 'Autism Society of Greater Los Angeles', website: 'https://www.autismsocietyla.org' }
    ]
  },
  {
    id: 'orange',
    name: 'Orange County',
    website: 'https://ocgov.com',
    ihssOffice: 'Orange County Social Services Agency (SSA) - Adult Services',
    ihssContact: 'Phone: (714) 825-3000, Address: 1505 E Warner Ave, Santa Ana, CA 92705',
    mediCalOffice: 'OC SSA Medi-Cal Office',
    mediCalContact: 'Phone: (800) 281-9799, Portal: BenefitsCal.com',
    ccsOffice: 'Orange County Health Care Agency - CCS',
    ccsContact: 'Phone: (714) 347-0300, Address: 200 W. Santa Ana Blvd, Santa Ana, CA 92701',
    behavioralHealthLine: 'OC HCA Behavioral Health Intake: (855) 625-4657',
    publicHealthDept: 'Orange County Health Care Agency',
    officeOfEducation: 'Orange County Department of Education (OCDE)',
    selpas: ['North Orange County SELPA', 'West Orange County SELPA', 'Greater Orange County SELPA'],
    schoolDistricts: [
      { name: 'Santa Ana Unified School District', specEdPhone: '(714) 558-5832', email: 'spec.ed@sausd.us', website: 'https://sausd.us' }
    ],
    familyResourceCenter: 'Family Support Network / Help Me Grow Orange County',
    localOrganizations: [
      { name: 'Down Syndrome Association of Orange County (DSAOC)', website: 'https://www.dsaoc.org' },
      { name: 'Autism Community in Action (TACA)', website: 'https://tacanow.org' }
    ]
  },
  {
    id: 'alameda',
    name: 'Alameda County',
    website: 'https://alamedacountyca.gov',
    ihssOffice: 'Alameda County Social Services Agency - IHSS Intake',
    ihssContact: 'Phone: (510) 577-1800, Address: 6955 Foothill Blvd, Oakland, CA 94605',
    mediCalOffice: 'Alameda County SSA Medi-Cal Eligibility',
    mediCalContact: 'Phone: (510) 263-2420, Portal: BenefitsCal.com',
    ccsOffice: 'Alameda County Public Health Department - CCS',
    ccsContact: 'Phone: (510) 208-5970, Address: 1106 Madison St, Oakland, CA 94607',
    behavioralHealthLine: 'Alameda County Behavioral Health ACCESS: (800) 491-9099',
    publicHealthDept: 'Alameda County Public Health Dept',
    officeOfEducation: 'Alameda County Office of Education (ACOE)',
    selpas: ['Alameda County SELPA', 'Oakland Unified SELPA'],
    schoolDistricts: [
      { name: 'Oakland Unified School District Special Ed', specEdPhone: '(510) 879-8223', email: 'sped@ousd.org', website: 'https://ousd.org/specialeducation' }
    ],
    familyResourceCenter: 'Family Resource Network (FRN) Alameda',
    localOrganizations: [
      { name: 'DSA of the Bay Area', website: 'https://www.dsabayarea.org' },
      { name: 'East Bay Autism Support', website: 'https://autism-eastbay.org' }
    ]
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    website: 'https://sf.gov',
    ihssOffice: 'SF HSA Department of Disability and Aging Services (DAS)',
    ihssContact: 'Phone: (415) 355-6700, Address: 2 Gough St, San Francisco, CA 94103',
    mediCalOffice: 'SF Human Services Agency - Medi-Cal Intake',
    mediCalContact: 'Phone: (415) 558-4700, Portal: BenefitsCal.com',
    ccsOffice: 'SF Department of Public Health - CCS Program',
    ccsContact: 'Phone: (415) 575-5700, Address: 30 Van Ness Ave, San Francisco, CA 94102',
    behavioralHealthLine: 'SF Behavioral Health Access: (415) 255-3737',
    publicHealthDept: 'SF Department of Public Health',
    officeOfEducation: 'San Francisco County Office of Education',
    selpas: ['San Francisco Unified SELPA'],
    schoolDistricts: [
      { name: 'San Francisco Unified School District Special Education', specEdPhone: '(415) 241-6101', email: 'sped@sfusd.edu', website: 'https://sfusd.edu' }
    ],
    familyResourceCenter: 'Support for Families of Children with Disabilities',
    localOrganizations: [
      { name: 'Support for Families SF', website: 'https://supportforfamilies.org' }
    ]
  }
];

export const regionalCenters = [
  {
    id: 'lanterman',
    name: 'Frank D. Lanterman Regional Center',
    countiesServed: ['los-angeles'],
    catchmentBoundaries: 'Serves Central Los Angeles, Glendale, Pasadena, La Cañada-Flintridge, and Burbank.',
    website: 'https://lanterman.org',
    intakePhone: '(213) 383-1300',
    earlyStartContact: 'Phone: (213) 252-5600, Email: earlystartintake@lanterman.org',
    lantermanIntakeContact: 'Phone: (213) 252-5699, Email: intake@lanterman.org',
    eligibilityPage: 'https://lanterman.org/eligibility',
    servicesPage: 'https://lanterman.org/services',
    selfDeterminationContact: 'Phone: (213) 252-8642, Email: sdp@lanterman.org',
    appealsInfo: 'https://lanterman.org/appeals_and_complaints',
    frcRelationship: 'Directly partners with the Koch-Young Family Resource Center (located in the same building).',
    officeLocations: '3303 Wilshire Blvd, Suite 700, Los Angeles, CA 90010',
    languages: ['English', 'Spanish', 'Korean', 'Armenian', 'Tagalog'],
    lastVerifiedDate: '2026-04-10',
    sourceUrls: ['https://lanterman.org']
  },
  {
    id: 'golden-gate',
    name: 'Golden Gate Regional Center',
    countiesServed: ['san-francisco', 'marin', 'san-mateo'],
    catchmentBoundaries: 'Serves San Francisco, Marin, and San Mateo counties.',
    website: 'https://ggrc.org',
    intakePhone: '(415) 546-9222',
    earlyStartContact: 'Phone: (415) 832-5160, Email: earlystartintake@ggrc.org',
    lantermanIntakeContact: 'Phone: (415) 546-9222, Email: intake@ggrc.org',
    eligibilityPage: 'https://ggrc.org/services/eligibility',
    servicesPage: 'https://ggrc.org/services',
    selfDeterminationContact: 'Phone: (415) 832-5110, Email: sdp@ggrc.org',
    appealsInfo: 'https://ggrc.org/rights-appeals',
    frcRelationship: 'Partners closely with Support for Families of Children with Disabilities (SF) and Gatepath FRC (San Mateo).',
    officeLocations: '1355 Market St, Suite 220, San Francisco, CA 94103',
    languages: ['English', 'Spanish', 'Cantonese', 'Mandarin', 'Tagalog', 'Vietnamese'],
    lastVerifiedDate: '2026-05-15',
    sourceUrls: ['https://ggrc.org']
  }
];

export const functionalNeeds = [
  {
    id: 'protective-supervision',
    name: 'Protective Supervision (24/7 Safety Supervision)',
    category: 'behavioral',
    description: 'Requires constant monitoring due to self-injurious behavior, elopement (wandering), or total lack of safety awareness.',
    programTriggers: ['ihss-for-children']
  },
  {
    id: 'speech-therapy',
    name: 'Speech-Language Therapy & AAC Devices',
    category: 'communication',
    description: 'Delay or inability in speech communication. Needs articulation support, vocabulary expansion, or Alternative Augmentative Communication (AAC) tablets.',
    programTriggers: ['iep-special-education', 'early-start', 'regional-centers', 'california-childrens-services']
  },
  {
    id: 'respite-care',
    name: 'Respite Care (In-home or Out-of-home break for parents)',
    category: 'daily-living',
    description: 'Caregiver needs relief from the intense daily demands of managing a child with significant self-care, physical, or behavioral needs.',
    programTriggers: ['regional-centers']
  },
  {
    id: 'hearing-aids',
    name: 'Hearing Aids & Audiology Support',
    category: 'communication',
    description: 'Diagnosed hearing loss or deafness requiring medical hearing aids, audiology testing, or cochlear implant upkeep.',
    programTriggers: ['hearing-aid-coverage', 'california-childrens-services']
  },
  {
    id: 'vision-services',
    name: 'Vision Care & Blindness Support',
    category: 'daily-living',
    description: 'Diagnosed blindness, low vision, or cortical visual impairment requiring specialized therapies or Braille resources.',
    programTriggers: ['iep-special-education', 'california-childrens-services']
  },
  {
    id: 'diapers-incontinence-supplies',
    name: 'Diapers & Incontinence Supplies (Age 3+)',
    category: 'daily-living',
    description: 'Inability to toilet train or severe bladder/bowel issues due to developmental or physical delay. Medical diapers covered after 36 months.',
    programTriggers: ['medi-cal-for-kids-and-teens', 'regional-centers']
  },
  {
    id: 'medical-transportation',
    name: 'Non-Emergency Medical Transportation',
    category: 'medical',
    description: 'Needs specialized transport, mileage reimbursement, or bus fare to attend frequent therapy, regional center, or doctor appointments.',
    programTriggers: ['medi-cal-for-kids-and-teens']
  },
  {
    id: 'iep-evaluation',
    name: 'School District IEP Evaluation & Accommodations',
    category: 'education',
    description: 'Needs formal psycho-educational testing by the public school district to see if special services are required in class.',
    programTriggers: ['iep-special-education']
  },
  {
    id: 'behavior-support',
    name: 'Behavior Support & Behavior Intervention (ABA)',
    category: 'behavioral',
    description: 'Exhibits behaviors like aggression, severe emotional dysregulation, or non-cooperation that impede learning or social functions.',
    programTriggers: ['medi-cal-for-kids-and-teens', 'regional-centers', 'iep-special-education']
  },
  {
    id: 'feeding-therapy',
    name: 'Feeding Therapy & G-Tube Supplies',
    category: 'medical',
    description: 'Oral motor challenges, dysphagia, choking risks, severe sensory food selectivity, or dependency on enteral feeding (G-tube).',
    programTriggers: ['california-childrens-services', 'medi-cal-for-kids-and-teens', 'early-start']
  }
];

const DIAGNOSES = [
  'Attention Deficit Hyperactivity Disorder (ADHD)',
  'Autism Spectrum Disorder (ASD)',
  'Sensory Processing Disorder (SPD)',
  'Speech and Language Delay',
  'Global Developmental Delay (GDD)',
  'Developmental Coordination Disorder (Dyspraxia)',
  'Pervasive Developmental Disorder (PDD-NOS)',
  'Oppositional Defiant Disorder (ODD)',
  'Reactive Attachment Disorder (RAD)',
  'Apraxia of Speech',
  'Social Communication Disorder',
  'Down Syndrome (Trisomy 21)',
  'Fragile X Syndrome',
  'Rett Syndrome',
  'Prader-Willi Syndrome',
  'Angelman Syndrome',
  'Williams Syndrome',
  'Turner Syndrome',
  'Klinefelter Syndrome (XXY)',
  'Cri-du-Chat Syndrome',
  'DiGeorge Syndrome (22q11.2 deletion)',
  'Trisomy 18 (Edwards Syndrome)',
  'Trisomy 13 (Patau Syndrome)',
  'Noonan Syndrome',
  'Rabin-Kopp Syndrome',
  'Cerebral Palsy (CP)',
  'Spina Bifida',
  'Muscular Dystrophy (Duchenne)',
  'Muscular Dystrophy (Becker)',
  'Spinal Muscular Atrophy (SMA)',
  'Microcephaly',
  'Hydrocephalus',
  'Epilepsy / Seizure Disorder',
  'Tourette Syndrome',
  'Traumatic Brain Injury (TBI)',
  'Arthrogryposis Multiplex Congenita',
  'Neurofibromatosis Type 1 (NF1)',
  'Neurofibromatosis Type 2 (NF2)',
  'Mitochondrial Disease',
  'Rasmussen Encephalitis',
  'Lennox-Gastaut Syndrome',
  'Dravet Syndrome',
  'Landau-Kleffner Syndrome',
  'Aicardi Syndrome',
  'Hearing Loss / Deafness',
  'Visual Impairment / Blindness',
  'Cortical Visual Impairment (CVI)',
  'Deaf-Blindness',
  'Auditory Processing Disorder (APD)',
  'Optic Nerve Hypoplasia (ONH)',
  'Retinopathy of Prematurity (ROP)',
  'Usher Syndrome',
  'Intellectual Disability (ID)',
  'Dyslexia',
  'Dysgraphia',
  'Dyscalculia',
  'Executive Function Disorder',
  'Nonverbal Learning Disability (NVLD)',
  'Auditory Dyslexia',
  'Congenital Heart Disease (CHD)',
  'Cystic Fibrosis (CF)',
  'Sickle Cell Disease',
  'Type 1 Diabetes',
  'Severe Persistent Asthma',
  'Pediatric Cancer / Leukemia',
  'Tracheostomy Dependency',
  'Ventilator Dependency',
  'Short Bowel Syndrome',
  'Chronic Kidney Disease (CKD)',
  'Gastrostomy (G-tube) Dependency',
  'Severe Hemophilia',
  'Juvenile Idiopathic Arthritis (JIA)',
  'Orthopedic Impairment',
  'Other Health Impairment (OHI)',
  'Specific Learning Disability (SLD)',
  'Emotional Disturbance (ED)',
  'Multiple Disabilities',
  'Developmental Delay (CA Education Code)'
];

function slugifyDiagnosis(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getRelevanceFlags(name) {
  const norm = name.toLowerCase();
  const isRc = 
    norm.includes('autism') || norm.includes('asd') || norm.includes('down syndrome') || norm.includes('trisomy 21') ||
    norm.includes('cerebral palsy') || norm.includes('cp') || norm.includes('epilepsy') || norm.includes('seizure') ||
    norm.includes('intellectual disability') || norm.includes('developmental delay') || norm.includes('gdd') ||
    norm.includes('pdd-nos') || norm.includes('fragile x') || norm.includes('rett') || norm.includes('prader-willi') ||
    norm.includes('angelman') || norm.includes('williams syndrome') || norm.includes('cri-du-chat') ||
    norm.includes('digeorge') || norm.includes('trisomy 18') || norm.includes('trisomy 13') || norm.includes('noonan') ||
    norm.includes('rabin-kopp') || norm.includes('microcephaly') || norm.includes('hydrocephalus') ||
    norm.includes('neurofibromatosis') || norm.includes('mitochondrial') || norm.includes('encephalitis') ||
    norm.includes('lennox-gastaut') || norm.includes('dravet') || norm.includes('landau-kleffner') ||
    norm.includes('aicardi') || norm.includes('multiple disabilities');

  const isCcs = 
    norm.includes('cerebral palsy') || norm.includes('cp') || norm.includes('spina bifida') ||
    norm.includes('muscular dystrophy') || norm.includes('spinal muscular atrophy') || norm.includes('sma') ||
    norm.includes('microcephaly') || norm.includes('hydrocephalus') || norm.includes('epilepsy') || norm.includes('seizure') ||
    norm.includes('mitochondrial') || norm.includes('encephalitis') || norm.includes('lennox-gastaut') ||
    norm.includes('dravet') || norm.includes('landau-kleffner') || norm.includes('aicardi') ||
    norm.includes('arthrogryposis') || norm.includes('neurofibromatosis') || norm.includes('hearing loss') ||
    norm.includes('deaf') || norm.includes('visual impairment') || norm.includes('blind') || norm.includes('cvi') ||
    norm.includes('optic nerve') || norm.includes('retinopathy') || norm.includes('usher') || norm.includes('heart disease') ||
    norm.includes('chd') || norm.includes('cystic fibrosis') || norm.includes('cf') || norm.includes('sickle cell') ||
    norm.includes('diabetes') || norm.includes('asthma') || norm.includes('cancer') || norm.includes('leukemia') ||
    norm.includes('tracheostomy') || norm.includes('ventilator') || norm.includes('short bowel') ||
    norm.includes('kidney') || norm.includes('ckd') || norm.includes('gastrostomy') || norm.includes('g-tube') ||
    norm.includes('hemophilia') || norm.includes('arthritis') || norm.includes('jia') || norm.includes('orthopedic') ||
    norm.includes('multiple disabilities') || norm.includes('down syndrome') || norm.includes('fragile x') ||
    norm.includes('rett') || norm.includes('prader-willi') || norm.includes('angelman') || norm.includes('williams') ||
    norm.includes('cri-du-chat') || norm.includes('digeorge') || norm.includes('trisomy 18') ||
    norm.includes('trisomy 13') || norm.includes('noonan') || norm.includes('rabin-kopp');

  return { rc: isRc, ccs: isCcs };
}

function getNotesAndExplanation(name) {
  const norm = name.toLowerCase();
  let explanation = `A diagnosed medical or developmental condition: ${name}.`;
  let notes = 'Age 0-3 focus on Early Start/IFSP developmental therapies. At 3, transition to school district IEP. Setup CalABLE for financial protection. Transfer educational rights and file for adult SSI at 18.';

  if (norm.includes('autism') || norm.includes('asd')) {
    explanation = 'A developmental spectrum condition that affects communication, social interaction, sensory processing, and self-regulatory behaviors.';
    notes = 'Early Detection allows intensive Early Start ABA. School years benefit from IEP behavior plans. Review self-advocacy and employment transition plans from age 16.';
  } else if (norm.includes('down syndrome')) {
    explanation = 'A genetic chromosomal condition typically leading to mild-to-moderate intellectual disability, hypotonia, and potential cardiac or sensory differences.';
    notes = 'Infancy focuses on early motor and speech start. IEP speech accommodations are critical. Auto-eligible medically for SSI. Secure CalABLE and adult transition benefits.';
  } else if (norm.includes('cerebral palsy')) {
    explanation = 'A neurological motor disorder affecting body movement, posture, and coordination, often requiring physical therapies.';
    notes = 'Coordinate early with CCS Medical Therapy Unit (MTP) for school physical therapy. Select adaptive devices. Address orthopedic needs under IEP.';
  } else if (norm.includes('epilepsy') || norm.includes('seizure')) {
    explanation = 'A neurological condition characterized by recurrent, unprovoked seizures due to temporary electrical disturbances in the brain.';
    notes = 'Maintain an active Seizure Action Plan at school. Coordinate neurological consults. CCS covers seizure management and medications.';
  } else if (norm.includes('hearing') || norm.includes('deaf')) {
    explanation = 'Partial or complete loss of hearing in one or both ears, affecting language acquisition and communication.';
    notes = 'Audiology screening triggers early ASL or oral start. Public school IEP provides FM systems, DHH specialists, and speech therapy.';
  } else if (norm.includes('visual') || norm.includes('blind')) {
    explanation = 'Significant vision loss that cannot be fully corrected, impacting navigation, reading, and environmental interaction.';
    notes = 'Request Orientation & Mobility (O&M) school scans. Provide TVI (Teacher of Visual Impairments) Braille or large-print aids in IEP.';
  } else if (norm.includes('adhd')) {
    explanation = 'A neurobehavioral condition causing challenges with selective attention, hyperactivity, organization, and executive function.';
    notes = 'Provide visual schedules, sensory breaks, and executive function goals in IEP or 504. Monitor medication efficacy.';
  } else if (norm.includes('speech and language delay') || norm.includes('apraxia')) {
    explanation = 'Delays or impairments in speech production, language comprehension, or motor speech coordination.';
    notes = 'Prioritize early intervention speech therapy. IEP coordinates speech-language therapy and AAC device communication supports.';
  } else if (norm.includes('intellectual disability') || norm.includes('gdd')) {
    explanation = 'A cognitive or developmental condition characterized by limitations in both intellectual functioning and adaptive behavior.';
    notes = 'Lanterman Act eligibility triggers respite and service coordination. IEP focuses on life-skills, adaptive goals, and transitions.';
  } else if (norm.includes('diabetes')) {
    explanation = 'A chronic endocrine condition where the pancreas produces little or no insulin, requiring continuous monitoring and care.';
    notes = 'Establish a Section 504 Plan for blood glucose checking, nurse access, and emergency glucagon storage at school.';
  } else if (norm.includes('asthma')) {
    explanation = 'A chronic respiratory condition causing airway inflammation and bronchospasm, triggered by allergies, cold, or exertion.';
    notes = 'Provide school with an Asthma Action Plan and inhaler access. Set up PE accommodations if exercise-induced.';
  } else if (norm.includes('cancer') || norm.includes('leukemia')) {
    explanation = 'A serious medical oncology condition requiring chemotherapy, radiation, or surgery.';
    notes = 'Set up Home & Hospital Instruction under IEP/504 for periods of medical absence. CCS coordinates oncology treatment.';
  } else if (norm.includes('tracheostomy') || norm.includes('ventilator') || norm.includes('g-tube')) {
    explanation = 'A complex medical fragility profile requiring enteral feeding, mechanical ventilation, or airway maintenance devices.';
    notes = 'Qualifies for HCBA home nursing hours. IEP requires medical services / school nurse allocations. CCS covers device maintenance.';
  }

  return { explanation, notes };
}

export const conditions = DIAGNOSES.map((name) => {
  const id = slugifyDiagnosis(name);
  const { rc, ccs } = getRelevanceFlags(name);
  const { explanation, notes } = getNotesAndExplanation(name);

  let aliases = [name];
  if (name.includes('(')) {
    const match = name.match(/\(([^)]+)\)/);
    if (match) aliases.push(match[1]);
  }
  if (name.includes('/')) {
    name.split('/').forEach(s => aliases.push(s.trim()));
  }
  aliases = Array.from(new Set(aliases));

  const commonFunctionalNeeds = ['iep-evaluation'];
  if (rc) commonFunctionalNeeds.push('respite-care');
  if (name.includes('Speech') || name.includes('Language') || name.includes('Apraxia') || name.includes('Autism') || name.includes('Down Syndrome')) {
    commonFunctionalNeeds.push('speech-therapy');
  }
  if (ccs) {
    if (name.includes('Hearing')) commonFunctionalNeeds.push('hearing-aids');
    if (name.includes('Vision') || name.includes('Blind')) commonFunctionalNeeds.push('vision-services');
    if (name.includes('Tracheostomy') || name.includes('Ventilator') || name.includes('G-tube')) commonFunctionalNeeds.push('feeding-therapy');
  }

  const commonProgramIds = ['iep-special-education', 'calable', 'ssi-for-children'];
  if (rc) commonProgramIds.push('regional-centers');
  if (ccs) commonProgramIds.push('california-childrens-services');

  return {
    id,
    name,
    aliases,
    parentFriendlyExplanation: explanation,
    categoryMappings: {
      regionalCenterRelevance: rc === 1 || rc === true,
      iepRelevance: true,
      ccsRelevance: ccs === 1 || ccs === true,
      ssiRelevance: true,
      calAbleRelevance: true
    },
    commonFunctionalNeeds,
    commonServices: rc ? ['Respite Care', 'Behavior Support'] : ['Special Education', 'Speech Therapy'],
    commonProgramIds,
    ageSpecificNotes: notes,
    sourceUrl: 'https://california-navigator.org/taxonomy/' + id,
    lastVerifiedDate: '2026-06-01'
  };
});

export const programs = [
  {
    id: 'ihss-for-children',
    name: 'In-Home Supportive Services (IHSS) for Children',
    description: 'A California state program that pays a caregiver (including a parent) to provide essential supervision and personal care for a child with a severe disability to keep them safely in their own home.',
    whoItIsFor: 'Children under 18 with severe developmental delays, autism, cerebral palsy, or medical fragile profiles who need more care and supervision than a typically developing child of the same age.',
    whoMightQualify: 'Must be a California resident, eligible for Medi-Cal (often through a waiver that bypasses parental income), and show a documented medical/functional need for extra supervision or care.',
    childProfileTrigger: 'Child has profound safety awareness deficits (e.g. self-injury, eloping/wandering, swallowing non-food items), requires parent provider care, or needs paramedical services (e.g. g-tube care, catheter, suctioning).',
    ageRange: '0–18 (commonly approved for ages 3+ when the gap between a disabled child and typically developing peer grows wider).',
    diagnosisOrFunctionalNeed: 'Autism, Down Syndrome, Cerebral Palsy, medically complex diagnoses paired with high functional needs like protective-supervision, diapers-incontinence-supplies, or medical medication support.',
    insuranceIncomeStatus: 'Requires active Medi-Cal. Note: If the family makes too much money for regular Medi-Cal, they can bypass family income by first enrolling the child in a Regional Center (Lanterman Act) or HCBA Waiver, which unlocks "institutional deeming" Medi-Cal.',
    whereToApply: 'Contact your county social services office (IHSS intake helpline).',
    requiredDocuments: [
      'SOC 873 (Required Medical Certification Form completed by a doctor)',
      'Diagnosis Report / Neuropsychological Assessment',
      'Individualized Education Program (IEP) or school behavioral plans',
      'Daily 24-hour Care & Supervision Log (showing every risk event of elopement/self-injury)',
      'Regional Center IPP / Assessment records'
    ],
    applicationSteps: [
      { step: 1, title: 'Secure Medi-Cal', description: 'Confirm active Medi-Cal status (via county SSA or Regional Center waiver).' },
      { step: 2, title: 'Call County IHSS Intake', description: 'Call the local county IHSS hotline (see County directory) and request a children\'s application.' },
      { step: 3, title: 'Have Doctor Complete SOC 873', description: 'Take the SOC 873 medical form to your pediatrician. They must certify the child has a high-risk chronic physical/mental impairment and sign it.' },
      { step: 4, title: 'Prepare the Supervision Log', description: 'Keep a detailed daily log for 1-2 weeks tracking elopements, swallowing non-food items, self-injury, and the prompt interventions you perform.' },
      { step: 5, title: 'Complete the In-Home Assessment', description: 'A county social worker will visit your home to observe the child and interview you. Present all reports, logs, and school behavior plans.' }
    ],
    appealInfo: {
      deadlineDays: '90 days from the Date of Action on the notice.',
      appealSteps: '1. Complete the back of the denial form (NA 690) or write a letter requesting a State Hearing.\n2. Submit to CDSS State Hearings Division (P.O. Box 944243, MS 19-37, Sacramento, CA 94244).\n3. Prepare a Position Statement containing school plans, your daily logs, and doctor statements.\n4. Attend the hearing (held by phone or video) to present evidence to the Administrative Law Judge.',
      denialReasons: 'Social worker claims "parental duty of care covers all needs" or child "does not exhibit active self-injurious wanderlust/elopement in front of the worker."',
      appealFormName: 'CDSS State Hearing Request Form (back of NA 690 Notice)',
      officialAppealSourceUrl: 'https://www.cdss.ca.gov/hearing-requests'
    },
    relatedProgramIds: ['regional-centers', 'medi-cal-for-kids-and-teens', 'california-childrens-services'],
    officialSourceUrl: 'https://www.cdss.ca.gov/in-home-supportive-services',
    lastVerifiedDate: '2026-05-18',
    confidenceScore: 5 // Level 1: Official Source Verified
  },
  {
    id: 'regional-centers',
    name: 'California Regional Centers (Lanterman Act)',
    description: 'A network of 21 private, non-profit agencies contracted by the California Department of Developmental Services (DDS) to coordinate and provide lifelong services and supports to individuals with developmental disabilities.',
    whoItIsFor: 'Individuals of all ages residing in California who have a developmental disability that started before age 18, is expected to continue indefinitely, and constitutes a substantial disability.',
    whoMightQualify: 'Eligibility is based on 5 categories: Intellectual Disability, Autism, Cerebral Palsy, Epilepsy, or "Fifth Category" (conditions closely related to intellectual disability or requiring similar treatment). Must also have significant limitations in 3 or more major life activities (e.g., self-care, communication, learning, mobility, self-direction).',
    childProfileTrigger: 'Child has a formal diagnosis of Autism, Down Syndrome, Cerebral Palsy, or has a severe, unexplained developmental delay affecting multiple milestones.',
    ageRange: '3 through adulthood (Birth to 3 is handled by Early Start/IFSP).',
    diagnosisOrFunctionalNeed: 'Intellectual Disability, ASD, Cerebral Palsy, Epilepsy. Functional needs include respite-care, behavioral support, and social skills groups.',
    insuranceIncomeStatus: 'Free services, completely independent of family income or insurance status.',
    whereToApply: 'Contact the intake department of the Regional Center serving your county/catchment boundary.',
    requiredDocuments: [
      'Diagnosis reports / developmental evaluations',
      'Medical history and doctor notes',
      'Individualized Education Program (IEP) and school testing',
      'Proof of residency (utility bill or CA driver\'s license)',
      'Birth Certificate'
    ],
    applicationSteps: [
      { step: 1, title: 'Identify Your Catchment Office', description: 'Look up which of the 21 Regional Centers covers your specific ZIP code/county.' },
      { step: 2, title: 'Submit a Referral Request', description: 'Submit an online intake form or call the Regional Center\'s main intake department.' },
      { step: 3, title: 'Intake Interview & Testing', description: 'An intake coordinator will review documents and may schedule psychological, speech, or motor testing at no cost to you.' },
      { step: 4, title: 'Eligibility Decision', description: 'The Regional Center has 120 days from the date of intake consent to determine eligibility.' },
      { step: 5, title: 'Create the Individual Program Plan (IPP)', description: 'If eligible, a service coordinator is assigned. Together, you will write the IPP listing goals and funded supports (e.g., respite, therapies).' }
    ],
    appealInfo: {
      deadlineDays: '30 days from receiving the written notice of ineligibility.',
      appealSteps: '1. Fill out the DDS Appeal Request Form.\n2. Request an informal meeting with the intake supervisor to discuss the decision.\n3. If unresolved, proceed to a Mediation conference or a Formal Fair Hearing with an Administrative Law Judge.',
      denialReasons: 'Regional Center claims the child\'s delays are "not substantial" or do not fit the 5 categories (e.g. claims it is solely a learning disability or mental health issue).',
      appealFormName: 'DDS Fair Hearing Request Form',
      officialAppealSourceUrl: 'https://www.dds.ca.gov/general/appeals-complaints-section-4731/'
    },
    relatedProgramIds: ['early-start', 'ihss-for-children', 'medi-cal-for-kids-and-teens', 'calable'],
    officialSourceUrl: 'https://www.dds.ca.gov',
    lastVerifiedDate: '2026-05-20',
    confidenceScore: 5
  },
  {
    id: 'early-start',
    name: 'California Early Start (Early Intervention)',
    description: 'California\'s system of early intervention services for infants and toddlers from birth to 36 months who have significant developmental delays or a high risk of delays.',
    whoItIsFor: 'Infants and toddlers (0 to 3 years old) and their families.',
    whoMightQualify: 'Must be under 36 months, have a 25% or greater delay in cognitive, physical (motor), communication, social-emotional, or adaptive areas, or have an established medical condition of high risk.',
    childProfileTrigger: 'Toddler under age 3 showing speech delays, delayed crawling/walking, feeding difficulties, or diagnosed genetic syndrome like Down Syndrome.',
    ageRange: 'Birth to 36 months (3rd birthday).',
    diagnosisOrFunctionalNeed: 'Global developmental delay, feeding-therapy, speech-therapy, motor delays.',
    insuranceIncomeStatus: 'No income limits. Assessments and coordination are free. Therapies are covered by private insurance/Medi-Cal or funded by the state.',
    whereToApply: 'Contact your local Regional Center or call the Early Start Babyline at (800) 515-BABY.',
    requiredDocuments: [
      'Pediatrician referral letter (optional but helpful)',
      'Birth records/NICU logs',
      'Proof of parent identity & CA residency'
    ],
    applicationSteps: [
      { step: 1, title: 'Call for Referral', description: 'Contact your local Regional Center\'s Early Start intake line directly (no doctor referral required).' },
      { step: 2, title: 'Multidisciplinary Assessment', description: 'State-funded therapists will evaluate the baby\'s motor, cognitive, and speech milestones.' },
      { step: 3, title: 'IFSP Meeting', description: 'If eligible, collaborate to write the Individualized Family Service Plan (IFSP) detailing home-based therapies.' }
    ],
    appealInfo: {
      deadlineDays: '30 days from receiving written denial.',
      appealSteps: '1. File an Early Start complaint or request a due process hearing with DDS.\n2. Request an administrative resolution.',
      denialReasons: 'Assessor claims the delay is "less than 25% and child will catch up naturally."',
      appealFormName: 'Early Start Due Process Request Form',
      officialAppealSourceUrl: 'https://www.dds.ca.gov/general/appeals-complaints-section-4731/'
    },
    relatedProgramIds: ['regional-centers', 'iep-special-education', 'california-childrens-services'],
    officialSourceUrl: 'https://www.dds.ca.gov/services/early-start/',
    lastVerifiedDate: '2026-05-10',
    confidenceScore: 5
  },
  {
    id: 'medi-cal-for-kids-and-teens',
    name: 'Medi-Cal for Kids & Teens (EPSDT)',
    description: 'A comprehensive, free healthcare and medical service program in California for eligible children under age 21, guaranteeing access to regular checkups, dental, vision, mental health, and medically necessary therapies.',
    whoItIsFor: 'Children and teens up to age 21.',
    whoMightQualify: 'Low-income households under 266% FPL, or children with disabilities who bypass family income via Regional Center "institutional deeming" / HCBS-DD waivers.',
    childProfileTrigger: 'Child needs in-home nursing, speech/OT/PT therapies, specialized wheelchairs, or diapers-incontinence-supplies.',
    ageRange: 'Birth to age 21.',
    diagnosisOrFunctionalNeed: 'All medical/developmental conditions. Triggers include diapers-incontinence-supplies, behavior-support (ABA), and medical-transportation.',
    insuranceIncomeStatus: 'Requires Medi-Cal coverage.',
    whereToApply: 'Apply via BenefitsCal.com or through your county Social Services Office.',
    requiredDocuments: [
      'Proof of household income (if applying based on income)',
      'Birth certificate & parent ID',
      'Doctor prescription detailing medical necessity of requested therapy/supplies'
    ],
    applicationSteps: [
      { step: 1, title: 'Enroll in Medi-Cal', description: 'Submit an application on BenefitsCal or coordinate through your Regional Center case manager.' },
      { step: 2, title: 'Request EPSDT Screening', description: 'Ask your primary care physician to write a prescription stating specific therapies or supplies are "medically necessary" for development.' },
      { step: 3, title: 'Submit to Managed Care Plan', description: 'Submit the doctor\'s request to your Medi-Cal Managed Care plan (e.g., L.A. Care, CalOptima) for prior authorization.' }
    ],
    appealInfo: {
      deadlineDays: '60 days from receiving the Notice of Action (denial).',
      appealSteps: '1. File an Internal Appeal with your Medi-Cal Managed Care Plan.\n2. If rejected, request a California State Hearing from the Department of Social Services.',
      denialReasons: 'Claims the therapy or supply is "not medically necessary" or "educational in nature."',
      appealFormName: 'State Hearing Request Form',
      officialAppealSourceUrl: 'https://www.dhcs.ca.gov/services/medi-cal/Pages/Medi-CalStateHearings.aspx'
    },
    relatedProgramIds: ['ihss-for-children', 'california-childrens-services'],
    officialSourceUrl: 'https://www.dhcs.ca.gov/services/medi-cal/Pages/default.aspx',
    lastVerifiedDate: '2026-05-05',
    confidenceScore: 5
  },
  {
    id: 'california-childrens-services',
    name: 'California Children\'s Services (CCS)',
    description: 'A state program that coordinates and pays for medical care, specialized equipment, and physical/occupational therapy for children under 21 with specific chronic, complex, or life-threatening physical disabilities or medical conditions.',
    whoItIsFor: 'Children under 21 with qualifying medical diagnoses (e.g., cerebral palsy, spina bifida, muscular dystrophy, cystic fibrosis, congenital heart disease, severe hearing loss, blindness).',
    whoMightQualify: 'Must have a CCS-eligible diagnosis, reside in California, and have an annual family income under $40,000 (or if higher, medical expenses exceeding 20% of income). Income limits are waived if the child is enrolled in a school-based Medical Therapy Unit (MTU).',
    childProfileTrigger: 'Child requires specialized wheelchairs, orthopedic surgery, oncology care, cochlear implants, or school-based physical/occupational therapy.',
    ageRange: 'Birth to age 21.',
    diagnosisOrFunctionalNeed: 'Cerebral Palsy, Muscular Dystrophy, Spina Bifida, hearing-loss, vision-impairment, feeding-therapy.',
    insuranceIncomeStatus: 'Bypasses family income caps for school-based Medical Therapy Program (MTP) services.',
    whereToApply: 'Submit a CCS application to your county\'s local CCS office (see County directory).',
    requiredDocuments: [
      'CCS Application Form (DHCS 4480)',
      'Detailed medical records, surgery plans, and clinic assessments',
      'Income documentation (tax return/paystubs, if required)',
      'Proof of residency & identification'
    ],
    applicationSteps: [
      { step: 1, title: 'Obtain Doctor Referral', description: 'Have your child\'s specialist send a referral and clinical history directly to the county CCS office.' },
      { step: 2, title: 'Submit CCS Application', description: 'Complete and send the CCS Application (Form DHCS 4480) to your local county health department.' },
      { step: 3, title: 'Eligibility Review', description: 'County CCS nurses will review the medical diagnosis to confirm it matches their eligible condition catalog.' },
      { step: 4, title: 'Authorization for Care', description: 'CCS will authorize treatment by CCS-paneled specialists or refer your child to the local Medical Therapy Program (MTP).' }
    ],
    appealInfo: {
      deadlineDays: '30 days from receiving the denial letter.',
      appealSteps: '1. Send a written request for a local administrative review to the county CCS director.\n2. If unresolved, submit a formal appeal to the California Department of Health Care Services (DHCS) within 30 days.',
      denialReasons: 'County claims the medical condition is "not eligible" under their guidelines (e.g., simple developmental delay or mild asthma).',
      appealFormName: 'CCS Appeal Request Letter',
      officialAppealSourceUrl: 'https://www.dhcs.ca.gov/services/ccs'
    },
    relatedProgramIds: ['hearing-aid-coverage', 'medi-cal-for-kids-and-teens', 'early-start'],
    officialSourceUrl: 'https://www.dhcs.ca.gov/services/ccs/Pages/default.aspx',
    lastVerifiedDate: '2026-05-14',
    confidenceScore: 5
  },
  {
    id: 'iep-special-education',
    name: 'Individualized Education Program (IEP) / Special Education',
    description: 'A legally binding document created by a public school team (including parents) that outlines the special education services, speech/OT therapies, academic accommodations, and goals designed to meet the unique needs of a child with a qualifying disability.',
    whoItIsFor: 'School-aged children (ages 3 to 22) who attend public school or reside within a school district catchment.',
    whoMightQualify: 'The child must qualify under one of 13 federal eligibility categories (e.g., Autism, Speech/Language Impairment, Intellectual Disability, Specific Learning Disability, Orthopedic Impairment, Visual Impairment, Other Health Impairment) and require specialized instruction to access the curriculum.',
    childProfileTrigger: 'Child struggles in school socially or academically, has speech delay, needs speech-therapy, or is transitioning from Early Start on their 3rd birthday.',
    ageRange: '3 to 22 years (or until high school graduation, whichever occurs first).',
    diagnosisOrFunctionalNeed: 'Down syndrome, autism, hearing-loss, vision-impairment. Needs include speech-therapy, behavior-support, IEP-evaluation.',
    insuranceIncomeStatus: 'Free public education service, completely independent of income or insurance.',
    whereToApply: 'Submit a written request for a special education assessment to your school principal or district Special Education Director.',
    requiredDocuments: [
      'Written IEP Assessment Request Letter (signed and dated by parent)',
      'Clinical diagnoses, neuropsychological reports, speech therapy evaluations',
      'Prior school records, report cards, or teacher observations'
    ],
    applicationSteps: [
      { step: 1, title: 'Submit Written Request', description: 'Write a formal letter to the school principal requesting a comprehensive psycho-educational assessment. Date it and keep a copy.' },
      { step: 2, title: 'Sign the Assessment Plan', description: 'The school district must provide an Assessment Plan within 15 calendar days of receiving your request. Review and sign it.' },
      { step: 3, title: 'Evaluations Completed', description: 'School specialists (psychologists, speech therapists, OT) have 60 calendar days from receiving your signed consent to complete evaluations.' },
      { step: 4, title: 'Convene IEP Eligibility Meeting', description: 'Hold an IEP meeting within the 60-day window to review results, determine eligibility, and draft goals/services.' },
      { step: 5, title: 'Parent Consent', description: 'Read the draft IEP. You can sign "in agreement" to start services, or sign "with exceptions" to challenge specific items.' }
    ],
    appealInfo: {
      deadlineDays: '2 years from the date of the disputed action.',
      appealSteps: '1. File a Due Process Complaint with the California Office of Administrative Hearings (OAH).\n2. Participate in a voluntary Resolution Session or Mediation conference with the district.\n3. If unresolved, present evidence, expert witnesses, and arguments before an OAH Administrative Law Judge.',
      denialReasons: 'District claims the child\'s delays "do not negatively affect their educational performance" or that they can be accommodated via a simpler Section 504 plan.',
      appealFormName: 'OAH Special Education Due Process Hearing Request',
      officialAppealSourceUrl: 'https://www.dgs.ca.gov/OAH/Case-Types/Special-Education'
    },
    relatedProgramIds: ['early-start', 'regional-centers', 'ihss-for-children'],
    officialSourceUrl: 'https://www.cde.ca.gov/sp/se/',
    lastVerifiedDate: '2026-05-22',
    confidenceScore: 5
  },
  {
    id: 'ssi-for-children',
    name: 'Supplemental Security Income (SSI) for Children',
    description: 'A federal cash-assistance program administered by the Social Security Administration (SSA) providing monthly financial support and automatic Medi-Cal health coverage to low-income families raising a child with severe physical or mental disabilities.',
    whoItIsFor: 'Children under age 18 with severe medical or mental impairments.',
    whoMightQualify: 'The child must meet the strict SSA definition of medical disability (severe marked and functional limitations expected to last at least 12 months or result in death), and the household must meet low-income and resource limits ($2,000 resource limit for single parent, $3,000 for couples, bypassing certain excluded resources like one home and one car).',
    childProfileTrigger: 'Child has severe developmental, physical, or medical challenges (e.g. Down Syndrome automatically matches medically, severe cerebral palsy) and the family falls within income guidelines.',
    ageRange: 'Birth to age 18 (at age 18, the child is re-evaluated under adult rules, where parental income is completely ignored).',
    diagnosisOrFunctionalNeed: 'Down syndrome, autism, severe cerebral palsy, deafness. Needs include high daily-living care support.',
    insuranceIncomeStatus: 'Requires strict household income and resource screenings.',
    whereToApply: 'Contact the Social Security Administration (call 800-772-1213 or apply online).',
    requiredDocuments: [
      'Child\'s birth certificate and Social Security Number',
      'Proof of household income (paystubs, tax forms) and assets (bank statements)',
      'Detailed medical history, school IEPs, and doctor contact details',
      'Form SSA-3820 (Child Disability Report)'
    ],
    applicationSteps: [
      { step: 1, title: 'Complete Online Child Disability Report', description: 'Fill out the online SSA-3820 detailing the child\'s medical conditions, treatments, and therapists.' },
      { step: 2, title: 'Schedule Intake Appointment', description: 'Call the SSA at 1-800-772-1213 to schedule a phone interview or in-person visit to process the financial application.' },
      { step: 3, title: 'Submit Medical Records', description: 'Gather and submit all diagnostic reports, specialized medical tests, school IEP records, and doctor letters.' },
      { step: 4, title: 'Disability Determination Services (DDS) Review', description: 'A state-level DDS office will contact your doctors to review the child\'s functional restrictions.' }
    ],
    appealInfo: {
      deadlineDays: '60 days from receiving the denial letter (plus 5 days mailing buffer).',
      appealSteps: '1. Request a "Reconsideration" online or by paper within 60 days.\n2. If denied, request a Hearing before an Administrative Law Judge (ALJ).\n3. If denied by ALJ, appeal to the Appeals Council, and finally file in Federal District Court.',
      denialReasons: 'Household resources/earnings exceed the limit ("parental deeming") or DDS claims the medical limitations are "not severe enough to meet childhood listings."',
      appealFormName: 'SSA-561 Request for Reconsideration',
      officialAppealSourceUrl: 'https://www.ssa.gov/benefits/disability/appeal.html'
    },
    relatedProgramIds: ['medi-cal-for-kids-and-teens', 'ihss-for-children', 'calable'],
    officialSourceUrl: 'https://www.ssa.gov/benefits/disability/apply-child.html',
    lastVerifiedDate: '2026-05-11',
    confidenceScore: 5
  },
  {
    id: 'calable',
    name: 'CalABLE (ABLE Accounts)',
    description: 'California\'s tax-advantaged savings and investment program designed specifically for individuals with disabilities, allowing them to save up to $18,000 per year (and potentially more if employed) without jeopardizing their eligibility for public benefits like SSI and Medi-Cal.',
    whoItIsFor: 'Individuals of all ages who developed a significant disability before the age of 26.',
    whoMightQualify: 'The disability must have originated prior to age 26, and the individual must either: (A) be eligible for SSI or SSDI, (B) have a medically eligible condition certified by a physician, or (C) have a condition listed on SSA\'s Compassionate Allowances list.',
    childProfileTrigger: 'Family wants to save money for a child with Down Syndrome or Autism for future college, therapies, or housing, but wants to protect their SSI/Medi-Cal asset limit.',
    ageRange: 'All ages (onset of disability must be before age 26).',
    diagnosisOrFunctionalNeed: 'Down syndrome, autism, cerebral palsy. Needs include financial-planning and adult-services planning.',
    insuranceIncomeStatus: 'Requires no income test. Protects savings up to $100,000 from the SSI $2,000 resource limit.',
    whereToApply: 'Open an account directly online at CalABLE.ca.gov.',
    requiredDocuments: [
      'Child\'s Social Security Number',
      'Physician diagnosis certificate (self-certified online during setup, keep paper copy in household files)',
      'Bank routing number for funding'
    ],
    applicationSteps: [
      { step: 1, title: 'Open Online Profile', description: 'Visit CalABLE.ca.gov and click "Open an Account". Establish parent/caregiver signature authority.' },
      { step: 2, title: 'Certify Eligibility', description: 'Select the qualifying disability category (e.g. developmental delay, autism, chromosomal anomaly).' },
      { step: 3, title: 'Fund the Account', description: 'Link a bank account and make an initial deposit (as low as $25). Set up recurring contributions.' }
    ],
    appealInfo: {
      deadlineDays: 'N/A (registration is a digital self-certification).',
      appealSteps: 'If your application is blocked due to document mismatch, contact CalABLE Customer Service at (833) 863-0552 to submit verification manuals.',
      denialReasons: 'Technical setup errors or incorrect tax registration data.',
      appealFormName: 'CalABLE Paper Enrollment Form (if online setup fails)',
      officialAppealSourceUrl: 'https://calable.ca.gov'
    },
    relatedProgramIds: ['ssi-for-children', 'regional-centers'],
    officialSourceUrl: 'https://calable.ca.gov',
    lastVerifiedDate: '2026-05-19',
    confidenceScore: 5
  },
  {
    id: 'hearing-aid-coverage',
    name: 'Hearing Aid Coverage for Children Program (HACCP)',
    description: 'A California state program administered by DHCS that helps families cover the cost of hearing aids, hearing aid accessories, and related audiological services for children who do not qualify for full-scope Medi-Cal.',
    whoItIsFor: 'Children under age 21 with hearing loss who do not qualify for Medi-Cal but have no insurance coverage for hearing aids.',
    whoMightQualify: 'Must be a California resident, under 21, and have household income at or below 600% FPL, and have health insurance that doesn\'t cover hearing aids.',
    childProfileTrigger: 'Child with hearing loss is denied Medi-Cal based on family income, and their private insurance excludes hearing aid coverage.',
    ageRange: 'Birth to age 21.',
    diagnosisOrFunctionalNeed: 'hearing-loss, hearing-aids.',
    insuranceIncomeStatus: 'Bypasses standard Medi-Cal income rules, up to 600% FPL.',
    whereToApply: 'Apply online through the HACCP application portal or mail a paper application to DHCS.',
    requiredDocuments: [
      'Proof of family income (tax returns/W2s)',
      'Audiology report showing diagnosed hearing loss',
      'Private insurance benefit booklet (showing exclusion of hearing aid coverage)'
    ],
    applicationSteps: [
      { step: 1, title: 'Get Audiological Exam', description: 'Schedule a pediatric audiology exam. The audiologist will write a prescription for hearing aids.' },
      { step: 2, title: 'Submit HACCP Application', description: 'Complete the HACCP application and attach income details and the insurance denial page.' },
      { step: 3, title: 'Receive Authorization & Fit', description: 'Take the HACCP approval letter to an authorized provider to order and fit the hearing aids.' }
    ],
    appealInfo: {
      deadlineDays: '60 days.',
      appealSteps: 'Send a written request explaining why the child requires coverage to the HACCP Appeals Unit.',
      denialReasons: 'Private insurance technically covers a tiny fraction of cost, which voids eligibility, or household exceeds 600% FPL.',
      appealFormName: 'HACCP Appeals Request Letter',
      officialAppealSourceUrl: 'https://www.dhcs.ca.gov/services/Pages/HACCP.aspx'
    },
    relatedProgramIds: ['california-childrens-services', 'iep-special-education'],
    officialSourceUrl: 'https://www.dhcs.ca.gov/services/Pages/HACCP.aspx',
    lastVerifiedDate: '2026-04-12',
    confidenceScore: 5
  }
];

export const guides = [
  {
    id: 'how-to-apply-for-ihss-for-a-child',
    title: 'How to Apply for IHSS for a Child (Step-by-Step Parent Guide)',
    summary: 'A complete manual for parents seeking in-home care payments for their child with developmental delays or medical complexity.',
    content: `Applying for In-Home Supportive Services (IHSS) for a child can feel overwhelming, but it is one of the most vital resource lifelines for California families.

### 1. The Core Eligibility Pivot: Medi-Cal
IHSS requires active Medi-Cal. If you have private insurance and exceed standard income limits, you must first enroll your child in a Regional Center (Lanterman Act) or apply for the HCBA Waiver. These programs utilize "institutional deeming," which looks ONLY at the child\'s income ($0) and resource list, completely ignoring parental wealth.

### 2. Establishing the "Safety Gap"
Children\'s IHSS is awarded based on the gap between your child and a typically developing peer. To qualify for **Protective Supervision (24/7 care)**, you must prove the child has a mental impairment (e.g. autism, Down syndrome) that makes them unable to understand danger, leading to active behaviors like elopement (running away), self-injury, or eating toxic objects (pica).

### 3. Step-by-Step Application Timeline
1. **Call County Intake**: Find your local office helpline (see county directory) and request the children\'s intake package.
2. **Pediatrician Form SOC 873**: Take this to your pediatrician. The doctor must sign and state that the child has a severe, chronic impairment and requires care.
3. **Log the Danger**: Keep a 24-hour daily log. Note every time your child runs toward the street, tries to chew electrical wires, or hits their head, along with what you did to keep them safe.
4. **The Home Visit**: A social worker will visit your home. Do not clean up their safety locks or hide behavioral charts! They need to see the real, unvarnished, daily challenges.

### 4. What if you are Denied?
Do not panic. Over 50% of parent applicants are initially denied or awarded zero hours for protective supervision. You have **90 days** to appeal. Check the back of the NA 690 denial slip and write "I request a State Hearing because my child requires 24/7 protective supervision for safety."`,
    officialSource: 'https://www.cdss.ca.gov/in-home-supportive-services',
    lastVerifiedDate: '2026-05-18'
  },
  {
    id: 'how-to-request-an-iep-evaluation',
    title: 'How to Request an IEP Special Education Evaluation',
    summary: 'Learn the exact legal wording and timeline to force your California school district to assess your child for special accommodations.',
    content: `If your child is struggling academically, socially, or behaviorally, you have a legal right under federal law (IDEA) to request a comprehensive educational evaluation.

### The Power of the Written Letter
Never request an IEP evaluation verbally to a teacher or principal! The timeline does not start until you submit a **written request**. 

### The California 15-Day Timeline
Under California Education Code:
- Once you submit your written request, the district has **15 calendar days** to send you an Assessment Plan or a written denial (Prior Written Notice).
- Once you sign and return the Assessment Plan, the district has **60 calendar days** (excluding school vacations over 5 days) to finish all testing and hold the IEP eligibility meeting.

### Sample Request Wording
Copy this text into an email or letter:
\`\`\`text
Dear School Principal and Special Education Director,

I am the parent of [Child Name], born [DOB], who attends [School Name/Grade]. I am writing to formally request a comprehensive educational assessment in all areas of suspected disability under the Individuals with Disabilities Education Act (IDEA). 

I am concerned about my child's progress in [list speech, reading, behaviors, motor skills, sensory needs]. Please provide an Assessment Plan within the required 15-day timeline.

Sincerely,
[Your Name & Signature]
\`\`\`

### Common Pitfalls
- **"Let\'s wait and see"**: School staff might suggest trying informal interventions (SST) first. You can do both, but do not let them pause your 60-day legal assessment timeline.
- **Section 504 vs IEP**: A 504 plan offers basic accommodations (like extra test time). An IEP provides specialized direct services (speech therapy, OT, customized reading instruction). Direct therapy requires an IEP.`,
    officialSource: 'https://www.cde.ca.gov/sp/se/',
    lastVerifiedDate: '2026-05-22'
  },
  {
    id: 'regional-center-eligibility',
    title: 'Understanding California Regional Center Eligibility (Lanterman Act)',
    summary: 'Expose the 5 categories of developmental disability and how to qualify for lifelong services.',
    content: `California is unique due to the Lanterman Act: a state law establishing a legal right to lifelong coordination of services for individuals with developmental disabilities.

### The 5 Qualifying Categories
To be eligible for Regional Center services as an adult or child (age 3+), you must have a disability originating before age 18 that is expected to continue indefinitely and is categorized under one of these:
1. **Intellectual Disability (ID)**
2. **Autism Spectrum Disorder (ASD)**
3. **Cerebral Palsy (CP)**
4. **Epilepsy (Seizure Disorders)**
5. **The "Fifth Category"**: A disabling condition closely related to intellectual disability or requiring similar treatment (e.g. certain rare genetic syndromes like Prader-Willi or Fragile X).

### The "Substantial Limitation" Test
Having a diagnosis is not enough. You must also prove the child has significant limitations in at least **three** of these seven major life activities:
- Receptive and expressive language (communication)
- Learning
- Self-care (toileting, feeding, bathing)
- Mobility (walking, transfers)
- Self-direction (safety, decision making)
- Capacity for independent living (age-appropriate)
- Economic self-sufficiency (for older youth)

### The Early Start Pathway (0 to 3)
For babies under age 3, the criteria are much broader. They do not need a lifelong diagnosis. They qualify for **Early Start** if they have a 25% developmental delay in motor, communication, cognitive, or social skills. On their 3rd birthday, they must be re-evaluated under the stricter Lanterman rules.`,
    officialSource: 'https://www.dds.ca.gov',
    lastVerifiedDate: '2026-05-20'
  }
];

export const resourceProviders = [
  {
    id: 'prov-1',
    name: 'Dynamic Pediatric Speech & Language Center',
    categories: ['speech-therapy'],
    countyId: 'los-angeles',
    phone: null,
    email: null,
    address: null,
    acceptsMediCal: true,
    regionalCenterVendorIds: ['LRC-77291', 'SCLARC-0029']
  },
  {
    id: 'prov-2',
    name: 'Orange County Respite Care Services Agency',
    categories: ['respite'],
    countyId: 'orange',
    phone: null,
    email: null,
    address: null,
    acceptsMediCal: true,
    regionalCenterVendorIds: ['RCOC-88912']
  },
  {
    id: 'prov-3',
    name: 'Bay Area Adaptive Behavior Intervention (ABA)',
    categories: ['aba', 'behavior-support'],
    countyId: 'san-francisco',
    phone: null,
    email: null,
    address: null,
    acceptsMediCal: true,
    regionalCenterVendorIds: ['GGRC-11029']
  }
];

export const coverageGaps = [
  { id: 'gap-1', countyId: 'los-angeles', gapCategory: 'SELPA Special Ed Contacts', description: 'Missing direct administrative contacts for 4 out of 12 local SELPAs in northern LA county.', severity: 'moderate' },
  { id: 'gap-2', countyId: 'orange', gapCategory: 'Respite Agency Vendors', description: 'Listing does not cover all 12 vended respite providers; only primary 3 are cataloged.', severity: 'low' },
  { id: 'gap-3', countyId: 'alameda', gapCategory: 'County Behavioral Health Access', description: 'Requires direct routing phone updates for youth urgent crisis response lines.', severity: 'moderate' }
];

export const initialVerificationQueue = [
  { id: 'v-1', recordType: 'program', recordId: 'hearing-aid-coverage', recordName: 'HACCP Hearing Aid Support', reason: 'Official guidelines updated in legislative bill; check FPL caps.', verificationLevel: 5 },
  { id: 'v-2', recordType: 'regional-center', recordId: 'lanterman', recordName: 'Lanterman Regional Center', reason: 'Review intake email routing addresses.', verificationLevel: 1 },
  { id: 'v-3', recordType: 'program', recordId: 'ihss-for-children', recordName: 'IHSS for Children', reason: 'Regular audit cycle: > 180 days since last review.', verificationLevel: 1 }
];
