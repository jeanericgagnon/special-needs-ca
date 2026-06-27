/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getProgramsByKeywords, getMatchedCorePrograms, getCountyDetails, Program, CoreProgramMatch, getStateByIdOrCode } from '@/lib/db';
import { hasNonNegatedKeyword } from '@/lib/negation';
import { DIAGNOSES_DETAILS } from '@/lib/diagnoses';
import stateProgramsMapRaw from '@/lib/state_programs_map.json';

const stateProgramsMap = stateProgramsMapRaw as Record<string, any>;

export interface Refiners {
  insuranceExcludesHearing?: boolean;
  severeSafetyRisks?: boolean;
  schoolBasedTherapy?: boolean;
  exceedsIncomeLimits?: boolean;
}

export interface AnalysisResult {
  coreMatches: CoreProgramMatch[];
  crawlerMatches: Program[];
  explanations: string[];
  detectedNeeds: string[];
  detectedConditions: string[];
}

export async function fetchCountyDetailsAction(countyId: string) {
  return await getCountyDetails(countyId);
}

export async function fetchBenefits(age: number, diagnosis: string): Promise<Program[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return await getProgramsByKeywords(age, diagnosis, []);
}

export async function analyzeOnboarding(
  age: number,
  countyId: string,
  diagnosis: string,
  additionalText: string,
  refiners?: Refiners
): Promise<AnalysisResult> {
  // Artificial delay to simulate screening over 33k rules
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Determine state of the selected county
  const countyDetails = await getCountyDetails(countyId);
  const stateId = countyDetails?.state_id || 'california';

  // Fetch state details dynamically from database
  const stateObj = await getStateByIdOrCode(stateId);
  const stateName = stateObj?.name || 'California';
  const stateCode = (stateObj?.code || 'CA').toUpperCase();

  const lowerText = additionalText.toLowerCase();
  const lowerDiag = diagnosis.toLowerCase();

  const detectedNeedIds: string[] = [];
  const detectedNeedNames: string[] = [];
  const detectedConditionIds: string[] = [];
  const detectedConditionNames: string[] = [];
  const explanations: string[] = [];

  // 1. Map Diagnosis to relational conditions dynamically across all 78 taxonomy conditions
  for (const cond of DIAGNOSES_DETAILS) {
    const condName = cond.name.toLowerCase();
    const condId = cond.id;
    const condAliases = cond.aliases.toLowerCase().split(',').map(a => a.trim());

    let matches = false;
    if (lowerDiag.includes(condName) || condName.includes(lowerDiag)) {
      matches = true;
    } else if (lowerDiag.includes(condId) || condId.includes(lowerDiag)) {
      matches = true;
    } else {
      for (const alias of condAliases) {
        if (alias && (lowerDiag.includes(alias) || alias.includes(lowerDiag))) {
          matches = true;
          break;
        }
      }
    }

    if (matches) {
      detectedConditionIds.push(cond.id);
      detectedConditionNames.push(cond.name);

      if (cond.regional_center_relevance === 1) {
        if (stateId === 'california') {
          explanations.push(`California Regional Centers prioritize ${cond.name} as a qualifying condition under the Lanterman Act.`);
        } else if (stateId === 'texas') {
          explanations.push(`Texas LIDDAs prioritize ${cond.name} as a qualifying condition for state-funded IDD services.`);
        } else if (stateId === 'florida') {
          explanations.push(`Florida Agency for Persons with Disabilities (APD) prioritizes ${cond.name} for eligibility screening.`);
        } else if (stateId === 'new-york') {
          explanations.push(`New York OPWDD prioritizes ${cond.name} as a qualifying developmental disability.`);
        } else {
          const devServicesName = stateProgramsMap[stateCode]?.developmental_services?.name || `${stateName} Developmental Services`;
          explanations.push(`${devServicesName} prioritizes ${cond.name} as a qualifying condition.`);
        }
      }
      if (cond.ccs_relevance === 1) {
        if (stateId === 'california') {
          explanations.push(`${cond.name} is medically eligible for California Children's Services (CCS) therapy and specialized care.`);
        } else if (stateId === 'texas') {
          explanations.push(`${cond.name} qualifies for specialized pediatric medical and therapy support in Texas.`);
        } else if (stateId === 'florida') {
          explanations.push(`${cond.name} qualifies for Florida Children's Medical Services (CMS) specialized therapy and clinical programs.`);
        } else if (stateId === 'new-york') {
          explanations.push(`${cond.name} is eligible for specialized pediatric clinical and therapeutic benefits in New York.`);
        } else {
          explanations.push(`${cond.name} may qualify for specialized pediatric medical and clinical support in ${stateName}.`);
        }
      }
    }
  }

  // 2. Scan additional text & refiners for functional needs keywords
  // Supervision / Safety (triggers IHSS Protective Supervision!)
  if (
    refiners?.severeSafetyRisks === true ||
    hasNonNegatedKeyword(lowerText, ['supervision', 'safety', 'wander', 'elope', 'run away', 'pica', 'harm', 'danger', 'behavior'])
  ) {
    detectedNeedIds.push('protective-supervision');
    detectedNeedNames.push('Protective Supervision');
    if (refiners?.severeSafetyRisks === true) {
      if (stateId === 'california') {
        explanations.push('Confirmed safety risks (wandering, elopement, or self-injury) may support eligibility for additional IHSS hours under the Protective Supervision category. Actual approved hours depend on individual county assessment.');
      } else if (stateId === 'texas') {
        explanations.push('Confirmed safety risks (wandering, elopement, or self-injury) may support eligibility for personal care hours or behavioral support under the HCS or CLASS waivers.');
      } else if (stateId === 'florida') {
        explanations.push('Confirmed safety risks (wandering, elopement, or self-injury) support eligibility for personal care, respite, or behavioral services under the iBudget waiver.');
      } else if (stateId === 'new-york') {
        explanations.push('Confirmed safety risks (wandering, elopement, or self-injury) support eligibility for personal care hours under CDPAP or behavioral support under the OPWDD HCBS waiver.');
      } else {
        const hcbsWaiversName = stateProgramsMap[stateCode]?.hcbs_waivers?.name || `${stateName} HCBS Waivers`;
        explanations.push(`Confirmed safety risks (wandering, elopement, or self-injury) may support eligibility for personal care hours or behavioral support under ${stateName}'s ${hcbsWaiversName} program.`);
      }
    } else {
      if (stateId === 'california') {
        explanations.push('Your mention of safety hazards indicates a possible relevance to IHSS Protective Supervision, which may pay eligible providers for approved care hours. Eligibility requires a formal county assessment.');
      } else {
        const program = stateId === 'texas' ? 'HCS/CLASS waivers' : (stateId === 'florida' ? 'iBudget waiver' : (stateId === 'new-york' ? 'CDPAP/OPWDD programs' : `${stateProgramsMap[stateCode]?.hcbs_waivers?.name || `${stateName} HCBS Waivers`} program`));
        explanations.push(`Your mention of safety hazards indicates relevance to behavioral support or personal care under the state's ${program}.`);
      }
    }
  }

  // Speech / Communication
  if (
    lowerText.includes('speech') || 
    lowerText.includes('talk') || 
    lowerText.includes('language') || 
    lowerText.includes('communication') || 
    lowerText.includes('verbal') || 
    lowerText.includes('apraxia') || 
    lowerText.includes('aac')
  ) {
    detectedNeedIds.push('speech-therapy');
    detectedNeedNames.push('Speech Therapy');
    const earlyIntervention = stateId === 'california' ? 'Early Start' : (stateId === 'texas' ? 'Early Childhood Intervention (ECI)' : (stateId === 'florida' ? 'Early Steps' : (stateId === 'new-york' ? 'Early Intervention (EI)' : `${stateName} Early Intervention Program`)));
    explanations.push(`Speech and language needs may lead to ${earlyIntervention} (under 3) referrals and public school IEP therapy evaluations. Qualification requires a formal evaluation by a licensed speech-language pathologist.`);
  }

  // Respite
  if (
    lowerText.includes('respite') || 
    lowerText.includes('break') || 
    lowerText.includes('sitter') || 
    lowerText.includes('caregiver') || 
    lowerText.includes('relief')
  ) {
    detectedNeedIds.push('respite-care');
    detectedNeedNames.push('Respite Care');
    const agencyName = stateId === 'california' ? 'Regional Centers' : (stateId === 'texas' ? 'LIDDAs (via waiver lists)' : (stateId === 'florida' ? 'APD Regional Offices' : (stateId === 'new-york' ? 'OPWDD / CCO care coordinators' : (stateProgramsMap[stateCode]?.developmental_services?.name || `${stateName} Developmental Services`))));
    explanations.push(`Respite support is often routed through ${agencyName} to reduce caregiver burnout. Availability can include approved providers, agency-arranged respite, or reimbursement pathways depending on the program.`);
  }

  // Hearing / HACCP Waiver Nuance
  if (
    refiners?.insuranceExcludesHearing === true ||
    lowerText.includes('hearing') || 
    lowerText.includes('deaf') || 
    lowerText.includes('ear') || 
    lowerText.includes('audio') || 
    lowerText.includes('hearing aid')
  ) {
    detectedNeedIds.push('hearing-aids');
    detectedNeedNames.push('Hearing Aids');
    detectedConditionIds.push('hearing-loss-deafness');
    if (refiners?.insuranceExcludesHearing === true) {
      if (stateId === 'california') {
        explanations.push('Since your private insurance excludes hearing aid coverage, you may be eligible for the CA HACCP program, which may fund device fitting costs for children up to 600% FPL. Eligibility is determined by CDPH.');
      } else {
        explanations.push(`Since your private insurance excludes hearing aid coverage, you may qualify for children's special health services or Medicaid-sponsored hearing device programs in ${stateName}.`);
      }
    } else {
      if (stateId === 'california') {
        explanations.push('Hearing impairment may indicate relevance to the state HACCP program and CCS medical fittings. A formal audiological evaluation is required to confirm eligibility.');
      } else {
        explanations.push(`Hearing impairment indicates relevance to state-sponsored pediatric hearing screenings and device programs in ${stateName}. A formal audiological evaluation is required.`);
      }
    }
  }

  // Vision
  if (
    lowerText.includes('vision') || 
    lowerText.includes('blind') || 
    lowerText.includes('eye') || 
    lowerText.includes('cvi') || 
    lowerText.includes('sight')
  ) {
    detectedNeedIds.push('vision-services');
    detectedNeedNames.push('Vision Services');
    detectedConditionIds.push('visual-impairment-blindness');
    explanations.push('Vision delays qualify for Specialized Teachers (TVI) and Orientation & Mobility assessments in schools.');
  }

  // Diapers
  if (
    lowerText.includes('diaper') || 
    lowerText.includes('incontinence') || 
    lowerText.includes('potty') || 
    lowerText.includes('toilet') || 
    lowerText.includes('pee') || 
    lowerText.includes('poop') || 
    lowerText.includes('bladder')
  ) {
    detectedNeedIds.push('diapers-incontinence-supplies');
    detectedNeedNames.push('Incontinence Supplies');
    const medicaidName = stateId === 'california' ? 'Medi-Cal' : `${stateName} Medicaid`;
    if (age >= 3) {
      explanations.push(`${medicaidName} covers diapers and incontinence briefs starting at age 3 for children with documented developmental delays.`);
    } else {
      explanations.push(`Note: ${medicaidName} incontinence brief coverage typically starts at age 3. Keep tracking this for future eligibility.`);
    }
  }

  // IEP / School
  if (
    lowerText.includes('iep') || 
    lowerText.includes('school') || 
    lowerText.includes('education') || 
    lowerText.includes('special ed') || 
    lowerText.includes('learning') ||
    (age >= 3 && (detectedNeedIds.includes('speech-therapy') || detectedConditionIds.length > 0))
  ) {
    detectedNeedIds.push('iep-evaluation');
    detectedNeedNames.push('IEP Evaluation');
    explanations.push('School district special education departments are legally mandated under the IDEA act to evaluate learning adaptations within 60 days of written parent request.');
  }

  // Institutional Deeming Nuance
  if (refiners?.exceedsIncomeLimits === true) {
    if (stateId === 'california') {
      explanations.push('Exceeding standard Medi-Cal income limits may be relevant to the Lanterman Act Institutional Deeming rules: some waiver rules may reduce how parental income is counted. Consult with your Regional Center service coordinator to confirm applicability.');
    } else {
      const waiverType = stateId === 'texas' ? 'CLASS or HCS' : (stateId === 'florida' ? 'iBudget' : (stateId === 'new-york' ? 'OPWDD HCBS' : (stateProgramsMap[stateCode]?.hcbs_waivers?.name || 'HCBS Waivers')));
      explanations.push(`Exceeding standard Medicaid income limits may be bypassed by enrolling in the state's ${waiverType} waiver, which ignores parental income and counts only the child's assets. Consult your local intake office/care manager.`);
    }
  }

  // CCS MTU School Therapy Nuance
  if (refiners?.schoolBasedTherapy === true) {
    if (stateId === 'california') {
      explanations.push('School-based Medical Therapy Unit (MTU) physical and occupational therapies are funded by CCS regardless of family income limits.');
    } else {
      explanations.push(`School-based physical and occupational therapies are provided under your child's IEP as a related service, funded by the school district in ${stateName} regardless of family income.`);
    }
  }

  // 3. Extract custom keywords for raw text crawler DB matching
  const stopwords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 'do', 'does', 'did',
    'to', 'for', 'with', 'by', 'at', 'from', 'in', 'on', 'of', 'about', 'my', 'child', 'has', 'needs', 'they', 'have'
  ]);
  const words = lowerText.split(/[\s,.\-\/]+/).filter(w => w.length > 3 && !stopwords.has(w));
  const uniqueKeywords = Array.from(new Set(words)).slice(0, 5);

  // 4. Query Core Relational Database Matches
  const coreMatches = await getMatchedCorePrograms(age, detectedConditionIds, detectedNeedIds);

  // 5. Query Crawler Database Rules Matches (combining age, diagnosis, and extracted text keywords)
  const crawlerMatches = await getProgramsByKeywords(age, diagnosis, uniqueKeywords);

  // Default explanation if empty
  if (explanations.length === 0) {
    explanations.push('Matched general programs. Add details like "supervision", "diapers", or "speech therapy" to screen for specialized waivers and services.');
  }

  return {
    coreMatches,
    crawlerMatches,
    explanations,
    detectedNeeds: detectedNeedNames,
    detectedConditions: detectedConditionNames
  };
}

export async function submitSuggestionAction(formData: {
  suggestion_type: string;
  target_id: string | null;
  submitter_name: string;
  submitter_email: string;
  details: string;
}): Promise<{ success: boolean; message: string }> {
  // Import dynamically to avoid direct circular dependencies if any
  const { submitCommunitySuggestion } = await import('@/lib/db');
  
  if (!formData.submitter_name.trim() || !formData.submitter_email.trim() || !formData.details.trim()) {
    return { success: false, message: 'Please fill in all required fields.' };
  }

  const success = await submitCommunitySuggestion({
    suggestion_type: formData.suggestion_type,
    target_id: formData.target_id,
    submitter_name: formData.submitter_name,
    submitter_email: formData.submitter_email,
    details: formData.details
  });

  if (success) {
    return { success: true, message: 'Thank you! Your suggestion has been recorded for community review.' };
  } else {
    return { success: false, message: 'Failed to record suggestion. Please try again later.' };
  }
}
