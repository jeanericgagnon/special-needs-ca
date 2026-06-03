'use server'

import { getProgramsByKeywords, getMatchedCorePrograms, Program, CoreProgramMatch } from '@/lib/db';
import { hasNonNegatedKeyword } from '@/lib/negation';

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

export async function fetchBenefits(age: number, diagnosis: string): Promise<Program[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return getProgramsByKeywords(age, diagnosis, []);
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

  const lowerText = additionalText.toLowerCase();
  const lowerDiag = diagnosis.toLowerCase();

  const detectedNeedIds: string[] = [];
  const detectedNeedNames: string[] = [];
  const detectedConditionIds: string[] = [];
  const detectedConditionNames: string[] = [];
  const explanations: string[] = [];

  // 1. Map Diagnosis to relational conditions
  if (lowerDiag.includes('autism') || lowerDiag.includes('asd') || lowerDiag.includes('asperger')) {
    detectedConditionIds.push('autism');
    detectedConditionNames.push('Autism Spectrum Disorder');
    explanations.push('California Regional Centers prioritize Autism as a primary developmental qualifying condition under the Lanterman Act.');
  }
  if (lowerDiag.includes('down') || lowerDiag.includes('trisomy 21') || lowerDiag.includes('down syndrome')) {
    detectedConditionIds.push('down-syndrome');
    detectedConditionNames.push('Down Syndrome');
    explanations.push('Down Syndrome qualifies automatically for childhood SSI medical listings and coordinates with CCS for cardiac/audiology specialists.');
  }
  if (lowerDiag.includes('hearing') || lowerDiag.includes('deaf')) {
    detectedConditionIds.push('hearing-loss');
    detectedConditionNames.push('Hearing Loss');
  }
  if (lowerDiag.includes('vision') || lowerDiag.includes('blind') || lowerDiag.includes('cvi')) {
    detectedConditionIds.push('vision-impairment');
    detectedConditionNames.push('Vision Impairment');
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
      explanations.push('Confirmed safety risks (wandering, elopement, or self-injury) verify eligibility for max IHSS hours under the Protective Supervision category.');
    } else {
      explanations.push('Your mention of safety hazards indicates a critical need for IHSS Protective Supervision, which pays parents to provide 24/7 care.');
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
    explanations.push('Speech and language needs trigger Early Start (under 3) and public school IEP therapy evaluations.');
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
    explanations.push('Respite hours are funded by Regional Centers to prevent caregiver burnout, providing a vetted sitter to look after your child.');
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
    detectedConditionIds.push('hearing-loss');
    if (refiners?.insuranceExcludesHearing === true) {
      explanations.push('Since your private insurance excludes hearing aid coverage, you trigger the CA HACCP Waiver which funds device fitting costs for children up to 600% FPL.');
    } else {
      explanations.push('Hearing impairment triggers eligibility for the state HACCP program and CCS medical fittings.');
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
    detectedConditionIds.push('vision-impairment');
    explanations.push('Vision delays qualify for CDE Specialized Teachers (TVI) and Orientation & Mobility assessments in schools.');
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
    if (age >= 3) {
      explanations.push('Medi-Cal covers diapers and incontinence briefs starting at age 3 for children with documented developmental delays.');
    } else {
      explanations.push('Note: Medi-Cal incontinence brief coverage typically starts at age 3. Keep tracking this for future eligibility.');
    }
  }

  // IEP / School
  if (
    lowerText.includes('iep') || 
    lowerText.includes('school') || 
    lowerText.includes('education') || 
    lowerText.includes('special ed') || 
    lowerText.includes('learning')
  ) {
    detectedNeedIds.push('iep-evaluation');
    detectedNeedNames.push('IEP Evaluation');
    explanations.push('School district special education departments are legally mandated under the IDEA act to evaluate learning adaptations within 60 days of written parent request.');
  }

  // Lanterman Institutional Deeming Nuance
  if (refiners?.exceedsIncomeLimits === true) {
    explanations.push('Exceeding standard Medi-Cal income limits triggers the Lanterman Act Institutional Deeming waiver, letting you bypass parent wealth limits completely.');
  }

  // CCS MTU School Therapy Nuance
  if (refiners?.schoolBasedTherapy === true) {
    explanations.push('School-based Medical Therapy Unit (MTU) physical and occupational therapies are funded by CCS regardless of family income limits.');
  }

  // 3. Extract custom keywords for raw text crawler DB matching
  const stopwords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 'do', 'does', 'did',
    'to', 'for', 'with', 'by', 'at', 'from', 'in', 'on', 'of', 'about', 'my', 'child', 'has', 'needs', 'they', 'have'
  ]);
  const words = lowerText.split(/[\s,.\-\/]+/).filter(w => w.length > 3 && !stopwords.has(w));
  const uniqueKeywords = Array.from(new Set(words)).slice(0, 5);

  // 4. Query Core Relational Database Matches
  const coreMatches = getMatchedCorePrograms(age, detectedConditionIds, detectedNeedIds);

  // 5. Query Crawler Database Rules Matches (combining age, diagnosis, and extracted text keywords)
  const crawlerMatches = getProgramsByKeywords(age, diagnosis, uniqueKeywords);

  // Default explanation if empty
  if (explanations.length === 0) {
    explanations.push('Matched general programs. Add details like "supervision", "diapers", or "speech therapy" to screen for specialized wagers and services.');
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

  const success = submitCommunitySuggestion({
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
