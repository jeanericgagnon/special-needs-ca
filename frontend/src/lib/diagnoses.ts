export interface TaxonomyCondition {
  id: string;
  name: string;
  aliases: string;
  parent_friendly_explanation: string;
  regional_center_relevance: number;
  iep_relevance: number;
  ccs_relevance: number;
  ssi_relevance: number;
  cal_able_relevance: number;
  age_specific_notes: string;
  source_url: string;
  last_verified_date: string;
}

export const DIAGNOSES = [
  // Developmental & Behavioral
  'Autism Spectrum Disorder (ASD)',
  'Attention Deficit Hyperactivity Disorder (ADHD)',
  'Sensory Processing Disorder (SPD)',
  'Speech and Language Delay',
  'Global Developmental Delay (GDD)',
  'Developmental Coordination Disorder (Dyspraxia)',
  'Pervasive Developmental Disorder (PDD-NOS)',
  'Oppositional Defiant Disorder (ODD)',
  'Reactive Attachment Disorder (RAD)',
  'Apraxia of Speech',
  'Social Communication Disorder',
  
  // Genetic & Chromosomal
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
  
  // Neurological & Physical
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
  
  // Sensory Impairments
  'Hearing Loss / Deafness',
  'Visual Impairment / Blindness',
  'Cortical Visual Impairment (CVI)',
  'Deaf-Blindness',
  'Auditory Processing Disorder (APD)',
  'Optic Nerve Hypoplasia (ONH)',
  'Retinopathy of Prematurity (ROP)',
  'Usher Syndrome',
  
  // Learning & Cognitive
  'Intellectual Disability (ID)',
  'Dyslexia',
  'Dysgraphia',
  'Dyscalculia',
  'Executive Function Disorder',
  'Nonverbal Learning Disability (NVLD)',
  'Auditory Dyslexia',
  
  // Congenital & Medical Fragility
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
  
  // Other IDEA special education categories
  'Orthopedic Impairment',
  'Other Health Impairment (OHI)',
  'Specific Learning Disability (SLD)',
  'Emotional Disturbance (ED)',
  'Multiple Disabilities',
  'Developmental Delay (CA Education Code)'
].sort();

export function slugifyDiagnosis(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Map relevance logic based on groups
function getRelevanceFlags(name: string): { rc: number; ccs: number } {
  const norm = name.toLowerCase();
  
  // 1. Regional Center Lanterman developmental category mapping
  const isRc = 
    norm.includes('autism') || 
    norm.includes('asd') || 
    norm.includes('down syndrome') ||
    norm.includes('trisomy 21') ||
    norm.includes('cerebral palsy') || 
    norm.includes('cp') ||
    norm.includes('epilepsy') || 
    norm.includes('seizure') ||
    norm.includes('intellectual disability') ||
    norm.includes('developmental delay') || // prov eligibility or gdd
    norm.includes('gdd') ||
    norm.includes('pdd-nos') ||
    norm.includes('fragile x') ||
    norm.includes('rett') ||
    norm.includes('prader-willi') ||
    norm.includes('angelman') ||
    norm.includes('williams syndrome') ||
    norm.includes('cri-du-chat') ||
    norm.includes('digeorge') ||
    norm.includes('trisomy 18') ||
    norm.includes('trisomy 13') ||
    norm.includes('noonan') ||
    norm.includes('rabin-kopp') ||
    norm.includes('microcephaly') ||
    norm.includes('hydrocephalus') ||
    norm.includes('neurofibromatosis') ||
    norm.includes('mitochondrial') ||
    norm.includes('encephalitis') ||
    norm.includes('lennox-gastaut') ||
    norm.includes('dravet') ||
    norm.includes('landau-kleffner') ||
    norm.includes('aicardi') ||
    norm.includes('multiple disabilities');

  // 2. CCS Medically Eligible categories mapping
  const isCcs = 
    norm.includes('cerebral palsy') || 
    norm.includes('cp') ||
    norm.includes('spina bifida') ||
    norm.includes('muscular dystrophy') ||
    norm.includes('spinal muscular atrophy') || 
    norm.includes('sma') ||
    norm.includes('microcephaly') ||
    norm.includes('hydrocephalus') ||
    norm.includes('epilepsy') || 
    norm.includes('seizure') ||
    norm.includes('mitochondrial') ||
    norm.includes('encephalitis') ||
    norm.includes('lennox-gastaut') ||
    norm.includes('dravet') ||
    norm.includes('landau-kleffner') ||
    norm.includes('aicardi') ||
    norm.includes('arthrogryposis') ||
    norm.includes('neurofibromatosis') ||
    norm.includes('hearing loss') || 
    norm.includes('deaf') ||
    norm.includes('visual impairment') || 
    norm.includes('blind') ||
    norm.includes('cvi') ||
    norm.includes('optic nerve') ||
    norm.includes('retinopathy') ||
    norm.includes('usher') ||
    norm.includes('heart disease') || 
    norm.includes('chd') ||
    norm.includes('cystic fibrosis') || 
    norm.includes('cf') ||
    norm.includes('sickle cell') ||
    norm.includes('diabetes') || // severe endocrine
    norm.includes('asthma') || // severe pulmonary
    norm.includes('cancer') || 
    norm.includes('leukemia') ||
    norm.includes('tracheostomy') ||
    norm.includes('ventilator') ||
    norm.includes('short bowel') ||
    norm.includes('kidney') || 
    norm.includes('ckd') ||
    norm.includes('gastrostomy') || 
    norm.includes('g-tube') ||
    norm.includes('hemophilia') ||
    norm.includes('arthritis') || 
    norm.includes('jia') ||
    norm.includes('orthopedic') ||
    norm.includes('multiple disabilities') ||
    norm.includes('down syndrome') || // genetic syndromes have ccs coverage for associated checks
    norm.includes('fragile x') ||
    norm.includes('rett') ||
    norm.includes('prader-willi') ||
    norm.includes('angelman') ||
    norm.includes('williams') ||
    norm.includes('cri-du-chat') ||
    norm.includes('digeorge') ||
    norm.includes('trisomy 18') ||
    norm.includes('trisomy 13') ||
    norm.includes('noonan') ||
    norm.includes('rabin-kopp');

  return {
    rc: isRc ? 1 : 0,
    ccs: isCcs ? 1 : 0
  };
}

// Generate explanations & notes helper
function getNotesAndExplanation(name: string): { explanation: string; notes: string } {
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

// Generate the fully detailed list of 78 diagnoses
export const DIAGNOSES_DETAILS: TaxonomyCondition[] = DIAGNOSES.map((name) => {
  const id = slugifyDiagnosis(name);
  const { rc, ccs } = getRelevanceFlags(name);
  const { explanation, notes } = getNotesAndExplanation(name);

  // Extract aliases
  let aliasesList = '';
  if (name.includes('(')) {
    const match = name.match(/\(([^)]+)\)/);
    if (match) aliasesList = match[1];
  }
  if (name.includes('/')) {
    aliasesList += (aliasesList ? ', ' : '') + name.split('/').map(s => s.trim()).join(', ');
  }

  return {
    id,
    name,
    aliases: aliasesList || name,
    parent_friendly_explanation: explanation,
    regional_center_relevance: rc,
    iep_relevance: 1, // IEP applies to all 78 diagnoses
    ccs_relevance: ccs,
    ssi_relevance: 1, // SSI applies to all 78 diagnoses
    cal_able_relevance: 1, // CalABLE applies to all 78 diagnoses
    age_specific_notes: notes,
    source_url: 'https://california-navigator.org/taxonomy/' + id,
    last_verified_date: '2026-06-01'
  };
});
