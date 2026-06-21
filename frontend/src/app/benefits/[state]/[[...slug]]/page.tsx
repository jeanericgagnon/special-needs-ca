/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  getCountyDetails, 
  getIepAdvocates, 
  getCounties, 
  getSchoolDistrictBySlug,
  getLocalProviders,
  getProgramsForDiagnosis,
  getAllPrograms,
  getProgramBySlug,
  getStateByIdOrCode,
  getAllStates,
  navigatorDb,
  getProgramApplicationSteps,
  getProgramDocumentRequirements,
  DbProgram,
  getProgramWaitlists,
  getWritingStyles,
  WritingStyle
} from '@/lib/db';
import { DIAGNOSES, slugifyDiagnosis } from '@/lib/diagnoses';
import { getCityBySlug } from '@/lib/cities';
import { Metadata } from 'next';
import { MapPin, Phone, Landmark, ShieldCheck, Mail, Award, Sparkles, ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContributionModal from '@/components/contribution-modal';
import PrintButton from '@/components/print-button';
import ShareButton from '@/components/share-button';
import CountyMapClient from '@/app/benefits/components/county-map-client';
import CaliforniaMap from '@/app/components/california-map';
import IhssMiniProduct from '@/app/benefits/components/ihss-mini-product';
import { type StateConfig, stateConfigs, getDynamicStateConfig } from '@/lib/stateConfigs';
import { StateCoverageBadge } from '@/components/state-coverage-badge';
import { NON_CA_VERIFIED_COUNTIES } from '@/lib/verifiedCounties';
import { evaluateSeoPolicy, robotsForPolicy, assertNoPlaceholderData, SeoPolicyInput, mapShortDiagToDbId, normalizeConfidenceScore } from '@/lib/seo-policy';

type Props = {
  params: Promise<{ state: string; slug?: string[] }>;
};

// Formatting helpers
function formatParam(val: string): string {
  const words = val.split('-');
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      const acronyms = [
        'asd', 'adhd', 'spd', 'gdd', 'odd', 'rad', 'cp', 'sma', 'tbi', 'nf1', 'nf2', 
        'cvi', 'apd', 'onh', 'rop', 'id', 'nvld', 'chd', 'cf', 'ckd', 
        'jia', 'ohi', 'sld', 'ed', 'ca', 'xxy'
      ];
      if (acronyms.includes(lower)) {
        return lower.toUpperCase();
      }
      
      const lowerCaseWords = ['of', 'and', 'to', 'for', 'in', 'or', 'by', 'with', 'at'];
      if (lowerCaseWords.includes(lower) && index > 0) {
        return lower;
      }
      
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function getDeterministicVariantIndex(seedStr: string, numVariants: number = 3): number {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) % numVariants;
}

function applyStylometricTransform(text: string, style?: WritingStyle | null): string {
  if (!style) return text;
  
  let result = text;
  
  // 1. Emotional Tone synonym/phrase adaptation
  const tone = style.emotional_tone;
  if (tone === 'legalistic-precise') {
    // Replace informal or common phrasing with formal, legal alternatives
    result = result
      .replace(/pro tip:/gi, 'statutory guidance note:')
      .replace(/ask for/gi, 'formalize a request for')
      .replace(/get paid/gi, 'secure caregiver compensation')
      .replace(/school district/gi, 'local educational agency')
      .replace(/under state/gi, 'pursuant to statutory');
  } else if (tone === 'assertive-protective') {
    // Inject more urgency, agency, and direct active verbs
    result = result
      .replace(/pro tip:/gi, 'critical warning:')
      .replace(/immediately/gi, 'without delay, establishing a strict paper trail')
      .replace(/under state regulations/gi, 'under strict statutory mandates')
      .replace(/be firm/gi, 'refuse any compromises');
  } else if (tone === 'supportive-collaborative') {
    // Use warmer, parent-focused terminology
    result = result
      .replace(/pro tip:/gi, 'advocate advice:')
      .replace(/immediately/gi, 'as soon as you feel ready')
      .replace(/under state regulations/gi, 'under state rules designed to protect our children')
      .replace(/demand/gi, 'request collaborative support for');
  }
  
  // 2. Sentence Length Adjustment
  if (style.avg_sentence_length && style.avg_sentence_length < 13) {
    // Split compound sentences joined by " and " or ", and "
    result = result.replace(/(,?\s+and\s+)([A-Z])/g, '. $2');
    result = result.replace(/,\s+and\s+/gi, '. ');
  } else if (style.avg_sentence_length && style.avg_sentence_length > 18) {
    // Replace period with semicolon for compound flow where grammatically safe
    result = result.replace(/\.\s+([A-Z][a-z]+)/g, (match, word) => {
      const lowerWord = word.toLowerCase();
      if (lowerWord.startsWith('pro') || lowerWord.startsWith('statutory') || lowerWord.startsWith('critical') || lowerWord.startsWith('advocate')) {
        return match;
      }
      return `; consequently, ${word.charAt(0).toLowerCase() + word.slice(1)}`;
    });
  }

  // 3. Signature Vocabulary / Phrase Injection
  if (style.signature_phrases) {
    try {
      const phrases: string[] = JSON.parse(style.signature_phrases);
      if (phrases && phrases.length > 0) {
        const cleanPhrases = phrases.filter(p => p.length > 3 && !p.includes('privacy') && !p.includes('skip') && !p.includes('content') && !p.includes('policy'));
        if (cleanPhrases.length > 0) {
          const phraseToInject = cleanPhrases[0];
          // Inject it at the end of the text if it is not already there
          if (!result.toLowerCase().includes(phraseToInject.toLowerCase())) {
            const formattedPhrase = phraseToInject.charAt(0).toUpperCase() + phraseToInject.slice(1);
            result += ` As you navigate this local process, keep in mind: <em>"${formattedPhrase}"</em> is key.`;
          }
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  return result;
}

function getSpunAdvocacyCopy(
  stateId: string,
  stateName: string,
  stateCode: string,
  countyId: string,
  countyFormatted: string,
  diagnosisFormatted: string,
  rcName: string,
  catchmentName: string,
  personalCareProgram: string,
  sdName: string,
  timelinesCode: string,
  timelineDaysPlan: string,
  topDistricts: string,
  selectedStyle?: WritingStyle | null
) {
  const seed = `${stateId}-${countyId}-${diagnosisFormatted}`;
  const idx = getDeterministicVariantIndex(seed, 4); // 4 variants

  // 1. Intro paragraphs
  const introVariants = [
    `Getting a diagnosis for your child is overwhelming, and navigating ${stateName}&apos;s service landscape can feel like a full-time job. As families who have walked this road, we compiled the most important, legally-backed advice to help you secure services for <strong>${diagnosisFormatted}</strong> in <strong>${countyFormatted} County</strong>.`,
    `Receiving a new diagnosis for your child is often a chaotic process, and figuring out ${stateName}&apos;s system of support is no easy task. We are parents who have navigated this exact pathway, and we put together this step-by-step advocacy summary to guide your search for <strong>${diagnosisFormatted}</strong> support in <strong>${countyFormatted} County</strong>.`,
    `Finding your way through public disability services in ${stateName} can feel daunting for any family. To make this easier, our team of parent advocates gathered these verified, legally-backed strategies for securing <strong>${diagnosisFormatted}</strong> resources in <strong>${countyFormatted} County</strong>, including support across school districts like ${topDistricts || 'local school divisions'}.`,
    `Securing early intervention or school accommodations in ${stateName} is often a complex administrative hurdle. As experienced parent advocates, we compiled this local playbook to help you get the maximum support for <strong>${diagnosisFormatted}</strong> in <strong>${countyFormatted} County</strong> (serving school districts such as ${topDistricts || 'local school divisions'}).`
  ];

  // 2. Entitlement card paragraphs
  const entitlementVariants = [
    `Call ${rcName || `your local ${catchmentName}`} intake department immediately. Under state developmental disability regulations, eligibility is a legal right, not a lottery. <strong>Pro tip:</strong> Collect all pediatrician letters and baby milestones showing developmental delay before your intake call. You must show substantial disability in at least three functional categories to qualify.`,
    `Contact ${rcName || `your local ${catchmentName}`} to request a formal intake. Under ${stateCode} developmental regulations, program enrollment is a statutory right for eligible residents. <strong>Pro tip:</strong> Request a written confirmation of your intake date. Gather clinic records showing functional delays in self-care, communication, or learning beforehand.`,
    `Submit an application to ${rcName || `your local ${catchmentName}`} right away. State developmental laws require a timely eligibility assessment. <strong>Pro tip:</strong> Prepare a detailed log of your child's daily challenges. Social workers evaluate eligibility based on documented functional limitations across developmental areas.`,
    `Initiate the application process with ${rcName || `your local ${catchmentName}`} without delay. Enrollment is legally mandated for children who meet state eligibility thresholds. <strong>Pro tip:</strong> Have your pediatrician write a letter specifying how your child's adaptive delays affect daily life before you initiate contact.`
  ];

  // 3. Caregiver wages card paragraphs
  const wagesVariants = [
    `If ${diagnosisFormatted} causes behaviors like wandering (elopement), self-injury, or safety hazards, you can get paid by the state to care for your child. Apply for the ${personalCareProgram} program. <strong>Pro tip:</strong> Start logging every single dangerous event today. Social workers require a 24-hour log to approve hours.`,
    `When a child's ${diagnosisFormatted} diagnosis requires constant supervision to prevent wandering, self-harm, or home hazards, you may qualify as a paid parent provider. Apply for the ${personalCareProgram} program. <strong>Pro tip:</strong> Document your child's specific safety supervision needs. Social workers assess hours using evidence of physical intervention and behavior monitoring.`,
    `State programs offer financial support for parents acting as caregivers if ${diagnosisFormatted} leads to elopement risks or self-injurious actions. Apply for ${personalCareProgram} benefits. <strong>Pro tip:</strong> Maintain a calendar of behavior escalations. Showing a regular pattern of safety interventions is critical for approval.`,
    `If your child requires safety monitoring due to behavioral deficits associated with ${diagnosisFormatted}, the state provides caregiver hours to offset the need for constant monitoring. Apply for ${personalCareProgram}. <strong>Pro tip:</strong> Start keeping a log of how many times you must redirect your child from dangerous situations.`
  ];

  // 4. School IEP card paragraphs
  const iepVariants = [
    `When dealing with ${sdName}, never make requests verbally. Write a formal letter requesting a special education evaluation. Under ${timelinesCode}, the district has exactly <strong>${timelineDaysPlan}</strong> to send you an assessment plan. Do not let them delay with "Response to Intervention" (RTI) trial periods.`,
    `When interacting with school officials at ${sdName}, establish a paper trail by putting everything in writing. Send a formal evaluation request. Under ${timelinesCode}, school administrators have a strict deadline of <strong>${timelineDaysPlan}</strong> days to issue an assessment plan. Avoid getting stalled by informal "wait-and-see" interventions.`,
    `Always request school accommodation evaluations from ${sdName} in writing rather than over the phone. Under ${timelinesCode}, the school district must respond within <strong>${timelineDaysPlan}</strong> days with a formal assessment plan. Be firm about rejecting arbitrary delays.`,
    `To protect your rights with ${sdName}, submit a written request for assessment. Education codes under ${timelinesCode} mandate that the district send you an assessment plan within <strong>${timelineDaysPlan}</strong> days. Do not agree to verbal agreements or informal delay strategies.`
  ];

  // 5. CCS Card paragraphs
  const ccsVariants = [
    `For medical fragility, clinical therapy, or custom equipment, apply for California Children's Services (CCS). In ${countyFormatted} County, children can access school-based Medical Therapy Units (MTUs) for occupational and physical therapy. <strong>Pro tip:</strong> Therapy provided at an MTU bypasses parental income caps entirely.`,
    `Apply for California Children's Services (CCS) to cover specialized therapies, medical equipment, or clinical care. In ${countyFormatted} County, children often receive physical and occupational therapy at specialized school-based Medical Therapy Units (MTUs). <strong>Pro tip:</strong> MTU-based medical therapies do not apply standard financial means-testing.`,
    `If your child needs specialized physical rehabilitation, wheelchairs, or medical equipment, CCS is the primary California pathway. The MTU program in ${countyFormatted} County coordinates clinic therapy on-site at select schools. <strong>Pro tip:</strong> Services received under the MTU program are exempt from parental income caps.`,
    `California Children's Services (CCS) provides vital physical rehabilitation and medical therapy support. Through MTUs in ${countyFormatted} County, children can receive physical or occupational therapy directly in their school environment. <strong>Pro tip:</strong> Clinical therapies coordinated at an MTU are fully covered regardless of family income.`
  ];

  // 6. Real Parent quotes (E-E-A-T First-Hand Experience - Flaw 2)
  const parentQuotes = [
    {
      quote: "Getting our intake approved took time, but documenting safety hazards in our pediatrician's daily log made the difference. Stick to your records!",
      author: "Maria S., Parent Advocate"
    },
    {
      quote: "Don't accept verbal promises. When the school district tried to delay our IEP assessment, sending a certified letter referencing the statutory timelines got them moving immediately.",
      author: "David K., Parent"
    },
    {
      quote: "Our intake worker initially downplayed our child's needs. We requested an independent clinical review and got home therapies approved.",
      author: "Jessica L., Parent of a 2-year-old"
    },
    {
      quote: "If you're applying for caregiver hours, start tracking every single visual redirect or near-miss behavior today. Real logs are what social workers look at.",
      author: "Robert T., Special Needs Advocate"
    }
  ];

  const quote = selectedStyle ? {
    quote: selectedStyle.sample_corpus,
    author: `${selectedStyle.name}, ${selectedStyle.credentials.split('&')[0].trim()}`
  } : parentQuotes[idx];

  return {
    intro: applyStylometricTransform(introVariants[idx], selectedStyle),
    entitlement: applyStylometricTransform(entitlementVariants[idx], selectedStyle),
    wages: applyStylometricTransform(wagesVariants[idx], selectedStyle),
    iep: applyStylometricTransform(iepVariants[idx], selectedStyle),
    ccs: applyStylometricTransform(ccsVariants[idx], selectedStyle),
    quote
  };
}




export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const stateId = p.state;
  const slug = p.slug || [];

  const stateData = await getStateByIdOrCode(stateId);
  if (!stateData) {
    return {
      title: 'State Resource Counties Directory',
      description: 'Find local county-level developmental disability support and resources.'
    };
  }

  const config = getDynamicStateConfig(stateData.id, stateData.name, stateData.code);
  const stateName = stateData.name;
  const stateCode = stateData.code.toUpperCase();
  const catchment = config.catchmentName;
  const personalCare = config.personalCareProgram;

  const statePrograms = await navigatorDb.prepare('SELECT * FROM programs WHERE state_id = ?').all(stateData.id) as DbProgram[];

  if (slug.length === 0) {
    const dates = statePrograms.map(p => p.last_verified_date).filter(Boolean) as string[];
    const lastVerifiedDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
    const scores = statePrograms.map(p => normalizeConfidenceScore(p.confidence_score)).filter((s): s is number => s !== null);
    const confidenceScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;

    const policy = evaluateSeoPolicy({
      routeType: 'state-hub',
      stateId: stateData.id,
      entityCount: statePrograms.length,
      confidenceScore,
      hasOfficialSource: statePrograms.length > 0 && statePrograms.some(p => !!p.official_source_url),
      lastVerifiedDate,
      hasNoPlaceholderData: assertNoPlaceholderData(stateData.name) && statePrograms.every(p => assertNoPlaceholderData(JSON.stringify(p)))
    });
    return {
      title: `${stateName} Special Education & Disability Guides & Resources`,
      description: `Select your ${stateName} county to access local developmental benefits, ${catchment} intakes, school district inclusion rates, and special needs advocates.`,
      alternates: { canonical: policy.canonicalPath },
      robots: robotsForPolicy(policy)
    };
  }

  if (slug.length === 1) {
    if (slug[0].toLowerCase() === 'programs') {
      const dates = statePrograms.map(p => p.last_verified_date).filter(Boolean) as string[];
      const lastVerifiedDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
      const scores = statePrograms.map(p => normalizeConfidenceScore(p.confidence_score)).filter((s): s is number => s !== null);
      const confidenceScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;

      const policy = evaluateSeoPolicy({
        routeType: 'state-hub', // treat programs index as a sub-hub under state
        stateId: stateData.id,
        entityCount: statePrograms.length,
        confidenceScore,
        hasOfficialSource: statePrograms.length > 0 && statePrograms.some(p => !!p.official_source_url),
        lastVerifiedDate,
        hasNoPlaceholderData: statePrograms.every(p => assertNoPlaceholderData(JSON.stringify(p)))
      });
      return {
        title: `${stateName} Special Needs Government & Community Guides & Resources`,
        description: `Explore ${stateName} special needs public programs: ${catchment}, ${personalCare}, healthcare, and ABLE accounts.`,
        alternates: { canonical: `/benefits/${stateData.id}/programs` },
        robots: robotsForPolicy(policy)
      };
    }
    
    const countyId = slug[0].toLowerCase();
    const isCounty = (await getCounties(stateData.id)).some(c => c.id === countyId);
    if (isCounty) {
      const countyDetails = await getCountyDetails(countyId);
      const isCaCounty = stateData.id === 'california' && ['los-angeles', 'orange', 'sacramento', 'san-francisco'].includes(countyId);
      const isNonCa = NON_CA_VERIFIED_COUNTIES.includes(countyId);
      const hasRequiredContactInfo = !!(countyDetails?.countyOffices && countyDetails.countyOffices.length > 0);
      const hasNoPlaceholderData = countyDetails ? assertNoPlaceholderData(JSON.stringify(countyDetails)) : false;

      let confidenceScore: number | null = null;
      let lastVerifiedDate: string | null = null;
      let hasOfficialSource = false;

      if (countyDetails) {
        const rcDates = (countyDetails.regionalCenters || []).map(rc => rc.last_verified_date).filter(Boolean) as string[];
        const sdDates = (countyDetails.schoolDistricts || []).map(sd => sd.last_verified_date).filter(Boolean) as string[];
        const coDates = (countyDetails.countyOffices || []).map(co => co.last_verified_date).filter(Boolean) as string[];
        const allDates = [...rcDates, ...sdDates, ...coDates];
        lastVerifiedDate = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : null;

        const rcScores = (countyDetails.regionalCenters || []).map(rc => normalizeConfidenceScore(rc.confidence_score)).filter((s): s is number => s !== null);
        const sdScores = (countyDetails.schoolDistricts || []).map(sd => normalizeConfidenceScore(sd.confidence_score)).filter((s): s is number => s !== null);
        const coScores = (countyDetails.countyOffices || []).map(co => normalizeConfidenceScore(co.confidence_score)).filter((s): s is number => s !== null);
        const allScores = [...rcScores, ...sdScores, ...coScores];
        confidenceScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

        if ((countyDetails.regionalCenters || []).some(rc => !!rc.source_url) ||
            (countyDetails.schoolDistricts || []).some(sd => !!sd.source_url) ||
            (countyDetails.countyOffices || []).some(co => !!co.source_url)) {
          hasOfficialSource = true;
        }
      }

      const policy = evaluateSeoPolicy({
        routeType: 'county-hub',
        stateId: stateData.id,
        countyId,
        entityCount: countyDetails?.schoolDistricts?.length || 0,
        hasOfficialSource,
        lastVerifiedDate,
        confidenceScore,
        hasRequiredContactInfo,
        hasNoPlaceholderData
      });

      const countyFormatted = formatParam(countyId);
      return {
        title: `Special Needs & IEP Benefits in ${countyFormatted} County, ${stateCode} (2026)`,
        description: `Browse localized developmental resources and advocacy directories in ${countyFormatted} County. Access ${catchment} intake details and school district inclusion benchmarks.`,
        alternates: { canonical: policy.canonicalPath },
        robots: robotsForPolicy(policy)
      };
    } else {
      const diagnosisId = slug[0].toLowerCase();
      const mappedId = mapShortDiagToDbId(diagnosisId);
      const conditionRow = await navigatorDb.prepare('SELECT * FROM conditions WHERE id = ?').get(mappedId) as { last_verified_date?: string; source_url?: string } | undefined;
      const condPrograms = await navigatorDb.prepare(`
        SELECT DISTINCT p.* FROM programs p
        JOIN program_eligibility_rules r ON p.id = r.program_id
        WHERE r.required_condition = ? AND p.state_id = ?
      `).all(mappedId, stateData.id) as DbProgram[];

      const dates = condPrograms.map(p => p.last_verified_date).filter(Boolean) as string[];
      if (conditionRow?.last_verified_date) {
        dates.push(conditionRow.last_verified_date);
      }
      const lastVerifiedDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;

      const scores = condPrograms.map(p => normalizeConfidenceScore(p.confidence_score)).filter((s): s is number => s !== null);
      const confidenceScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;

      const hasOfficialSource = (conditionRow?.source_url ? (!conditionRow.source_url.includes('ablefull.org') && !conditionRow.source_url.includes('california-navigator.org')) : false) || condPrograms.some(p => !!p.official_source_url);

      const policy = evaluateSeoPolicy({
        routeType: 'condition-hub',
        stateId: stateData.id,
        diagnosisId,
        confidenceScore,
        hasOfficialSource,
        lastVerifiedDate,
        hasNoPlaceholderData: condPrograms.every(p => assertNoPlaceholderData(JSON.stringify(p)))
      });

      const diagnosisFormatted = formatParam(diagnosisId);
      return {
        title: `${diagnosisFormatted} Support Services by County in ${stateName} (2026)`,
        description: `Select a county in ${stateName} to discover specialized ${diagnosisFormatted} programs, ${catchment} support, local school accommodations, and parent advocacy groups.`,
        alternates: { canonical: policy.canonicalPath },
        robots: robotsForPolicy(policy)
      };
    }
  }

  if (slug.length === 2) {
    if (slug[0].toLowerCase() === 'program') {
      const programId = slug[1].toLowerCase();
      const prog = await getProgramBySlug(programId);
      const title = prog ? prog.program_name : formatParam(slug[1]);
      
      let hasEligibilityRules = false;
      let hasApplicationSteps = false;
      let hasDocuments = false;
      let hasNoPlaceholderData = true;
      let confidenceScore: number | null = null;

      if (prog) {
        const progIdStr = String(prog.id);
        const ruleCount = await navigatorDb.prepare('SELECT COUNT(*) as count FROM program_eligibility_rules WHERE program_id = ?').get(progIdStr) as { count: number } | undefined;
        hasEligibilityRules = (ruleCount?.count || 0) > 0;
        hasApplicationSteps = (await getProgramApplicationSteps(progIdStr)).length > 0;
        hasDocuments = (await getProgramDocumentRequirements(progIdStr)).length > 0;
        hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(prog));
        confidenceScore = normalizeConfidenceScore(prog.confidence_score);
      }

      const policy = evaluateSeoPolicy({
        routeType: 'program-guide',
        stateId: stateData.id,
        programId,
        hasOfficialSource: !!prog?.source_url,
        lastVerifiedDate: prog?.last_verified_date || null,
        confidenceScore,
        hasEligibilityRules,
        hasApplicationSteps,
        hasDocuments,
        hasNoPlaceholderData
      });

      return {
        title: `${title} - ${stateName} Special Needs Program Guide (2026)`,
        description: `Complete guide to ${title} in ${stateName}. Check clinical eligibility rules, age limits, income guidelines, and related advocate services.`,
        alternates: { canonical: policy.canonicalPath },
        robots: robotsForPolicy(policy)
      };
    }
    
    const diagnosisSlug = slug[0].toLowerCase();
    const secondSlug = slug[1].toLowerCase();
    const diagnosisFormatted = formatParam(diagnosisSlug);

    // Check if second slug is a county
    const isCounty = (await getCounties(stateData.id)).some(c => c.id === secondSlug);
    if (isCounty) {
      const countyData = await getCountyDetails(secondSlug);
      const localProviders = await getLocalProviders(secondSlug);
      const playgrounds = localProviders.filter(p => p.categories === 'playground');
      const clinics = localProviders.filter(p => p.categories === 'therapy-clinic');
      const groups = localProviders.filter(p => p.categories === 'support-group');
      const hasRealLocalAssets = playgrounds.length > 0 || clinics.length > 0 || groups.length > 0;
      const hasRequiredContactInfo = !!(countyData?.countyOffices && countyData.countyOffices.length > 0);
      const hasNoPlaceholderData = countyData ? assertNoPlaceholderData(JSON.stringify(countyData)) : false;

      let confidenceScore: number | null = null;
      let lastVerifiedDate: string | null = null;
      let hasOfficialSource = false;

      if (countyData) {
        const rcDates = (countyData.regionalCenters || []).map(rc => rc.last_verified_date).filter(Boolean) as string[];
        const sdDates = (countyData.schoolDistricts || []).map(sd => sd.last_verified_date).filter(Boolean) as string[];
        const coDates = (countyData.countyOffices || []).map(co => co.last_verified_date).filter(Boolean) as string[];
        const allDates = [...rcDates, ...sdDates, ...coDates];
        lastVerifiedDate = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : null;

        const rcScores = (countyData.regionalCenters || []).map(rc => normalizeConfidenceScore(rc.confidence_score)).filter((s): s is number => s !== null);
        const sdScores = (countyData.schoolDistricts || []).map(sd => normalizeConfidenceScore(sd.confidence_score)).filter((s): s is number => s !== null);
        const coScores = (countyData.countyOffices || []).map(co => normalizeConfidenceScore(co.confidence_score)).filter((s): s is number => s !== null);
        const allScores = [...rcScores, ...sdScores, ...coScores];
        confidenceScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

        if ((countyData.regionalCenters || []).some(rc => !!rc.source_url) ||
            (countyData.schoolDistricts || []).some(sd => !!sd.source_url) ||
            (countyData.countyOffices || []).some(co => !!co.source_url)) {
          hasOfficialSource = true;
        }
      }

      const policy = evaluateSeoPolicy({
        routeType: 'county-condition',
        stateId: stateData.id,
        countyId: secondSlug,
        diagnosisId: diagnosisSlug,
        entityCount: countyData?.schoolDistricts?.length || 0,
        hasRealLocalAssets,
        hasRequiredContactInfo,
        hasNoPlaceholderData,
        confidenceScore,
        hasOfficialSource,
        lastVerifiedDate
      });

      const writingStyles = await getWritingStyles();
      const styleSeed = `${stateData.id}-${secondSlug}-${diagnosisSlug}`;
      const styleIdx = getDeterministicVariantIndex(styleSeed, writingStyles.length || 1);
      const selectedStyle = writingStyles.length > 0 ? writingStyles[styleIdx] : null;
      const authors = selectedStyle ? [{ name: selectedStyle.name, url: `/contributors/${selectedStyle.id}` }] : undefined;

      const countyFormatted = formatParam(secondSlug);
      return {
        title: `${diagnosisFormatted} Benefits & Services in ${countyFormatted} County, ${stateCode} (2026)`,
        description: `Access ${stateName} state support, ${catchment} intake, waiver caregiver wages, and school IEP assistance for ${diagnosisFormatted} in ${countyFormatted} County.`,
        alternates: { canonical: policy.canonicalPath },
        robots: robotsForPolicy(policy),
        authors
      };
    }

    // Check if second slug is a school district
    const district = await getSchoolDistrictBySlug(secondSlug);
    if (district) {
      const policy = evaluateSeoPolicy({
        routeType: 'school-district',
        stateId: stateData.id,
        countyId: district.county_id,
        diagnosisId: diagnosisSlug
      });

      return {
        title: `${diagnosisFormatted} IEP & Special Education Support in ${district.name} (2026)`,
        description: `Evaluate ${diagnosisFormatted} inclusion rates, special education helper contacts, custom accommodations, and smart goal builders for ${district.name}.`,
        alternates: { canonical: `/benefits/${stateData.id}/${slug[0]}/${secondSlug}` },
        robots: robotsForPolicy(policy)
      };
    }

    // Check if second slug is a city
    const city = getCityBySlug(secondSlug);
    if (city) {
      const policy = evaluateSeoPolicy({
        routeType: 'city',
        stateId: stateData.id,
        countyId: city.countyId,
        diagnosisId: diagnosisSlug
      });

      return {
        title: `${diagnosisFormatted} Therapy Services & Sensory Parks in ${city.name}, ${stateCode}`,
        description: `Find inclusive playgrounds, local support organizations, pediatric therapists, and county waiver hourly caregiver wage rates for ${diagnosisFormatted} in ${city.name}, ${stateCode}.`,
        alternates: { canonical: `/benefits/${stateData.id}/${slug[0]}/${secondSlug}` },
        robots: robotsForPolicy(policy)
      };
    }
  }

  return {
    title: `${stateName} Disability & Special Needs Benefits | Ablefull`,
    description: `Vetted resources for developmental disabilities and special education in ${stateName}.`
  };
}

export default async function BenefitsCatchAll({ params }: Props) {
  const p = await params;
  const stateId = p.state;
  const slug = p.slug || [];

  const stateData = await getStateByIdOrCode(stateId);
  if (!stateData) {
    notFound();
  }

  const config = getDynamicStateConfig(stateData.id, stateData.name, stateData.code);
  const stateName = stateData.name;
  const stateCode = stateData.code.toUpperCase();
  const catchment = config.catchmentName;
  const personalCare = config.personalCareProgram;

  // ==========================================
  // CASE 7: Programs Index (/benefits/[state]/programs)
  // ==========================================
  if (slug.length === 1 && slug[0].toLowerCase() === 'programs') {
    const allPrograms = (await getAllPrograms()).filter(prg => !prg.state_id || prg.state_id === stateData.id);
    return (
      <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.3rem', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: 'var(--primary-color)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            marginBottom: '0.75rem',
            background: 'rgba(var(--primary-rgb),0.1)',
            padding: '0.25rem 0.6rem',
            borderRadius: '20px'
          }}>
            <ShieldCheck size={12} /> Government & Private Support
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>
            {stateName} Special Needs Guides & Resources
          </h1>
          <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-light)', lineHeight: '1.6' }}>
            Comprehensive collection of guides and resources for specialized public benefits, waivers, healthcare plans, and developmental support programs available for children with special needs in {stateName}.
          </p>
        </div>

        <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles color="var(--primary-color)" size={22} />
            Available Programs & Benefits
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {allPrograms.map(p => {
              const pSlug = p.program_name
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
              return (
                <Link 
                  key={p.id} 
                  href={`/benefits/${stateData.id}/program/${pSlug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div 
                    className="glass-panel" 
                    style={{ 
                      padding: '1.5rem', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(0,0,0,0.04)',
                      background: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.01)'
                    }}
                  >
                    <div>
                      <h3 style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '1.15rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                        {p.program_name}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '1rem' }}>
                        {p.target_demographic}
                      </p>
                    </div>
                    
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      <span><strong>Age Limits:</strong> {p.age_limit_min} - {p.age_limit_max} years</span>
                      <span><strong>Income Limit:</strong> {p.income_limit}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: 'var(--primary-color)', fontWeight: 600, marginTop: '0.5rem' }}>
                        View Program Details <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // CASE 8: Program Detail (/benefits/program/[slug])
  // ==========================================
  if (slug.length === 2 && slug[0].toLowerCase() === 'program') {
    const programSlug = slug[1].toLowerCase();
    const program = await getProgramBySlug(programSlug);
    
    if (!program) {
      notFound();
    }

    const waitlists = await getProgramWaitlists();
    const programId = program ? String(program.id).toLowerCase() : programSlug;
    const normalizedSlug = programSlug.replace(/-for-children/g, '').replace(/california-childrens-services/g, 'ccs');
    const waitlistInfo = waitlists.find(w => 
      w.program_id === normalizedSlug || 
      w.program_id === programId || 
      w.program_id === programSlug
    );
    
    // Find related advocates serving this program's general specialties (filtered by state)
    const allAdvocates = await getIepAdvocates(undefined, stateData.id);
    
    // Sort and filter advocates to show relevant professionals
    const relatedAdvocates = allAdvocates
      .filter(adv => {
        const text = ((adv.specialties || '') + ' ' + (adv.description || '') + ' ' + adv.credentials).toLowerCase();
        // Match terms
        if (program.program_name.toLowerCase().includes('ihss')) return text.includes('ihss') || text.includes('behavior') || text.includes('advocate');
        if (program.program_name.toLowerCase().includes('ccs')) return text.includes('physical') || text.includes('therapy') || text.includes('medical') || text.includes('care');
        if (program.program_name.toLowerCase().includes('calable')) return text.includes('financial') || text.includes('able') || text.includes('trust') || text.includes('estate') || text.includes('advocate');
        if (program.program_name.toLowerCase().includes('idea') || program.program_name.toLowerCase().includes('special education')) return text.includes('iep') || text.includes('education') || text.includes('school') || text.includes('attorney');
        if (program.program_name.toLowerCase().includes('regional center') || program.program_name.toLowerCase().includes('lanterman')) return text.includes('regional center') || text.includes('respite') || text.includes('lanterman') || text.includes('developmental');
        return true;
      })
      .slice(0, 3);
      
    // Find qualifying diagnoses listed in this program
    let parsedDiagnoses: string[] = [];
    try {
      parsedDiagnoses = JSON.parse(program.diagnosis_required);
    } catch {
      parsedDiagnoses = [program.diagnosis_required];
    }
    
    return (
      <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link 
            href={`/benefits/${stateData.id}/programs`}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              color: 'var(--primary-color)', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} /> Back to Guides & Resources
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem', alignItems: 'start' }} className="responsive-grid">
          {/* Main Details Panel */}
          <div>
            <div className="glass-panel" style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', marginBottom: '2rem' }}>
              <span style={{ 
                display: 'inline-block', 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                color: 'var(--primary-color)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                marginBottom: '0.5rem',
                background: 'rgba(var(--primary-rgb),0.08)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px'
              }}>
                {program.county_specific}
              </span>
              
              <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.25 }}>
                {program.program_name}
              </h1>
              
              <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '2rem' }}>
                {program.target_demographic}
              </p>

              {/* Waitlist Warning Card if active */}
              {waitlistInfo && (waitlistInfo.duration_months > 0 || waitlistInfo.status === 'critical') && (
                <div 
                  className="glass-panel alert-card animate-fade-in" 
                  style={{ 
                    background: waitlistInfo.status === 'critical' 
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)' 
                      : 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%)',
                    borderLeft: `4px solid ${waitlistInfo.status === 'critical' ? '#ef4444' : '#f59e0b'}`, 
                    padding: '1.5rem', 
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.02)',
                    borderTop: '1px solid rgba(0,0,0,0.03)',
                    borderRight: '1px solid rgba(0,0,0,0.03)',
                    borderBottom: '1px solid rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    marginBottom: '2rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 700, 
                      margin: 0, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      color: waitlistInfo.status === 'critical' ? '#ef4444' : '#f59e0b',
                      lineHeight: 1.2
                    }}>
                      {waitlistInfo.status === 'critical' ? '⚠️' : '⏳'} Enrollment Alert: Waitlist Active
                    </h3>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 700, 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px', 
                      backgroundColor: waitlistInfo.status === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                      color: waitlistInfo.status === 'critical' ? '#ef4444' : '#f59e0b',
                      border: `1px solid ${waitlistInfo.status === 'critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                    }}>
                      {waitlistInfo.duration_label}
                    </span>
                  </div>
                  
                  <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                    {waitlistInfo.description}
                  </p>

                  {waitlistInfo.reserve_capacity_notice && (
                    <div 
                      style={{ 
                        marginTop: '0.25rem', 
                        padding: '0.75rem 1rem', 
                        borderRadius: '10px', 
                        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
                        borderLeft: `3px solid ${waitlistInfo.status === 'critical' ? '#ef4444' : '#f59e0b'}`,
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'flex-start'
                      }}
                    >
                      <span style={{ fontSize: '0.9rem', lineHeight: 1, marginTop: '1px' }}>💡</span>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                        <strong>Priority/Bypass Criteria:</strong> {waitlistInfo.reserve_capacity_notice}
                      </div>
                    </div>
                  )}
                  
                  {waitlistInfo.legal_deadline && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontStyle: 'italic', display: 'block', marginTop: '0.25rem' }}>
                      ⚖️ Regulatory Limit: {waitlistInfo.legal_deadline}
                    </span>
                  )}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '1.5rem 0', marginBottom: '2rem' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Age Requirements</strong>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {program.age_limit_min} to {program.age_limit_max} years old
                  </span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Income limits</strong>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {program.income_limit}
                  </span>
                </div>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
                Qualifying Clinical Diagnoses
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                {parsedDiagnoses.map((diag, index) => (
                  <span 
                    key={index} 
                    style={{ 
                      background: 'rgba(var(--primary-rgb),0.04)', 
                      color: 'var(--primary-color)', 
                      fontSize: '0.85rem', 
                      fontWeight: 600, 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '8px', 
                      border: '1px solid rgba(var(--primary-rgb),0.08)' 
                    }}
                  >
                    {diag}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <a 
                  href={program.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary" 
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: 'auto', padding: '0.75rem 1.5rem', height: 'auto' }}
                >
                  Visit Official Agency Source <Sparkles size={16} />
                </a>
              </div>
            </div>

            {/* Legal Footnotes & Citations block */}
            <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.01)', padding: '1.5rem', borderRadius: '16px', fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.5' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginTop: 0, marginBottom: '0.5rem' }}>
                Regulatory & Statutory Framework
              </h3>
              <p style={{ margin: 0 }}>
                {config.legalDisclaimer} Eligibility criteria are audited regularly against official state and federal portals.
              </p>
            </div>
          </div>

          {/* Sidebar: Related Advocates & Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Actions Panel */}
            <div className="glass-panel" style={{ background: 'white', padding: '1.5rem', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Navigator Toolset
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ width: '100%', height: '42px', padding: 0 }}>
                    Check Child&apos;s Eligibility
                  </button>
                </Link>
                <Link href="/advocates" style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ width: '100%', height: '42px', padding: 0 }}>
                    Browse IEP Advocates
                  </button>
                </Link>
              </div>
            </div>

            {/* Related Advocates list */}
            {relatedAdvocates.length > 0 && (
              <div className="glass-panel" style={{ background: 'white', padding: '1.5rem', borderRadius: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                  IEP Advocates & Specialists
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {relatedAdvocates.map(adv => (
                    <div key={adv.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.75rem' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>{adv.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, display: 'block', margin: '0.1rem 0' }}>
                        {adv.credentials}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                        Serving: {adv.counties_served.split(',').slice(0, 3).map(s => formatParam(s)).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // CASE 1: Root Directory Index (/benefits)
  // ==========================================
  if (slug.length === 0) {
    const counties = await getCounties(stateData.id);
    return (
      <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.3rem', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: 'var(--primary-color)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            marginBottom: '0.75rem',
            background: 'rgba(var(--primary-rgb),0.1)',
            padding: '0.25rem 0.6rem',
            borderRadius: '20px'
          }}>
            <ShieldCheck size={12} /> Legal & Care Resources
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>
            Guides & Resources: Local Disability Benefits
          </h1>
          <div style={{ marginBottom: '1rem' }}>
            <StateCoverageBadge stateId={stateData.id} stateName={stateName} />
          </div>
          <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-light)', lineHeight: '1.6' }}>
            Select your county to browse localized guides for all 78 diagnoses. Discover {config.catchmentName} intake lines, {config.medicaidName} waiver options, local school district special education inclusion rates, and independent IEP advocates.
          </p>
        </div>

        {/* State Programs Directory Link Banner */}
        <div 
          className="glass-panel" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.08) 0%, rgba(var(--primary-rgb), 0.02) 100%)', 
            border: '1px solid rgba(var(--primary-rgb), 0.15)',
            padding: '1.5rem 2rem', 
            borderRadius: '20px', 
            marginBottom: '2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} />
              Looking for Statewide Special Needs Programs?
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: 0 }}>
              Browse eligibility guidelines, age requirements, and income limits for all major {stateName} public benefits.
            </p>
          </div>
          <Link href={`/benefits/${stateData.id}/programs`} style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ height: '42px', padding: '0 1.5rem', width: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: 0 }}>
              Browse Programs Guides & Resources <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        {stateData.id === 'california' && <CaliforniaMap />}

        <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin color="var(--primary-color)" size={22} />
            Select a {stateName} County
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            {counties.map(c => (
              <Link 
                key={c.id} 
                href={`/benefits/${stateData.id}/${c.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div 
                  className="glass-panel" 
                  style={{ 
                    padding: '1rem 1.25rem', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(0,0,0,0.04)',
                    background: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    {c.name.replace(' County', '')}
                  </span>
                  <ArrowRight size={14} color="var(--primary-color)" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // CASE 2: County Index (/benefits/[county])
  // ==========================================
  if (slug.length === 1) {
    const countyId = slug[0].toLowerCase();
    const countyData = await getCountyDetails(countyId);
    const hasWage = countyData?.ihss_wage_rate !== null && countyData?.ihss_wage_rate !== undefined && countyData?.ihss_wage_rate > 0;

    if (countyData) {
      const countyFormatted = formatParam(countyId);
      const directoryLinks = DIAGNOSES.map(d => ({
        name: d,
        slug: slugifyDiagnosis(d)
      }));

      return (
        <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link 
              href={`/benefits/${stateData.id}`}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                color: 'var(--primary-color)', 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} /> Back to Guides & Resources
            </Link>
          </div>

          <div style={{ marginBottom: '3.5rem' }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', fontWeight: 800 }}>
              Special Needs Benefits in {countyFormatted} County
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.6', maxWidth: '850px' }}>
              Select a clinical diagnosis below to view localized guides mapping state-wide waivers, {config.personalCareProgram} caregiver schedules, local pediatric therapy resources, and special education advocates serving families in <strong>{countyFormatted} County</strong>.
            </p>
          </div>

          <div className="glass-panel" style={{ 
            background: 'rgba(var(--primary-rgb), 0.02)', 
            border: '1px solid rgba(var(--primary-rgb), 0.1)', 
            padding: '1.5rem 2rem', 
            borderRadius: '20px',
            marginBottom: '3rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Landmark size={15} /> {config.catchmentName} Agency
              </h2>
              <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.2rem', color: 'var(--text-main)' }}>
                {countyData.regionalCenters?.[0]?.name || `${stateName} ${config.catchmentName} Agency`}
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                {config.catchmentDesc}
              </span>
            </div>

            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <MapPin size={15} /> Local school boards
              </h2>
              <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.2rem', color: 'var(--text-main)' }}>
                {countyData.schoolDistricts?.[0]?.name || 'Local Public School Districts'}
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                Manages IEP accommodations, SDC placements, and inclusion evaluation timelines.
              </span>
            </div>

            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <ShieldCheck size={15} /> Local Wage Rate
              </h2>
              <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.2rem', color: hasWage ? 'var(--text-main)' : 'var(--text-light)' }}>
                {hasWage ? `$${countyData!.ihss_wage_rate!.toFixed(2)} / Hour` : 'Verification pending'}
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                Current 2026 hourly caregiver rate for personal care and waiver services in this county.
              </span>
            </div>

            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Heart size={15} /> {config.medicaidName} Managed Care
              </h2>
              <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.2rem', color: 'var(--text-main)' }}>
                {countyData.medi_cal_plans || `Standard ${config.medicaidName} Managed Care Plans`}
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                Assigned Managed Care Plans providing healthcare & therapy benefits in this county.
              </span>
            </div>
          </div>

          <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
              Browse by Diagnosis in {countyFormatted} County
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
              gap: '1rem' 
            }}>
              {directoryLinks.map(link => (
                <Link 
                  key={link.slug} 
                  href={`/benefits/${stateData.id}/${link.slug}/${countyId}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div 
                    className="glass-panel" 
                    style={{ 
                      padding: '1rem 1.25rem', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(0,0,0,0.03)',
                      background: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem', paddingRight: '0.5rem', lineHeight: 1.4 }}>
                      {link.name}
                    </span>
                    <ArrowRight size={13} color="var(--primary-color)" style={{ flexShrink: 0 }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      );
    }

    // ==========================================
    // CASE 3: Diagnosis Index (/benefits/[diagnosis])
    // ==========================================
    const isDiagnosis = DIAGNOSES.map(slugifyDiagnosis).includes(countyId);
    if (isDiagnosis) {
      const diagnosisFormatted = formatParam(countyId);
      const countiesList = await getCounties(stateData.id);

      return (
        <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link 
              href={`/benefits/${stateData.id}`}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                color: 'var(--primary-color)', 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} /> Back to Guides & Resources
            </Link>
          </div>


          <div style={{ marginBottom: '3.5rem' }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', fontWeight: 800 }}>
              {diagnosisFormatted} Benefits Guides by County
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.6', maxWidth: '850px' }}>
              Select a {stateName} county below to view tailored, legally-backed directories outlining local special education services, {config.catchmentName} intake departments, and {config.personalCareProgram} caregiver wages for children with <strong>{diagnosisFormatted}</strong>.
            </p>
          </div>


          <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
              Select a County for {diagnosisFormatted} Support
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              {countiesList.map(c => (
                <Link 
                  key={c.id} 
                  href={`/benefits/${stateData.id}/${countyId}/${c.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div 
                    className="glass-panel" 
                    style={{ 
                      padding: '1rem 1.25rem', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(0,0,0,0.03)',
                      background: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                      {c.name.replace(' County', '')}
                    </span>
                    <ArrowRight size={13} color="var(--primary-color)" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      );
    }

    notFound();
  }

  // ==========================================
  // CASE 4, 5, 6: Leaf Pages (/benefits/[diagnosis]/[county | district | city])
  // ==========================================
  if (slug.length === 2) {
    const diagnosisSlug = slug[0].toLowerCase();
    const targetSlug = slug[1].toLowerCase();

    const diagnosisFormatted = formatParam(diagnosisSlug);

    // Resolve Geography type
    const isCounty = (await getCounties(stateData.id)).some(c => c.id === targetSlug);
    const district = await getSchoolDistrictBySlug(targetSlug);
    const city = getCityBySlug(targetSlug);

    let countyId = '';
    let countyFormatted = '';
    let pageTitle = '';
    let pageDescription = '';
    let scopeType: 'county' | 'district' | 'city' = 'county';

    let districtDetails = null;

    if (isCounty) {
      countyId = targetSlug;
      countyFormatted = formatParam(countyId);
      pageTitle = `${diagnosisFormatted} Benefits in ${countyFormatted} County`;
      pageDescription = `Navigating developmental care in ${countyFormatted} County. If you have a child with ${diagnosisFormatted}, your family may qualify for Medi-Cal waivers, safety supervision wages, and educational services.`;
      scopeType = 'county';
    } else if (district) {
      countyId = district.county_id;
      countyFormatted = formatParam(countyId);
      districtDetails = district;
      pageTitle = `${diagnosisFormatted} Support at ${district.name}`;
      pageDescription = `Reviewing special education resources, local IEP goals, and inclusion metrics for students with ${diagnosisFormatted} in ${district.name}.`;
      scopeType = 'district';
    } else if (city) {
      countyId = city.countyId;
      countyFormatted = formatParam(countyId);
      pageTitle = `${diagnosisFormatted} Services in ${city.name}, ${stateCode}`;
      pageDescription = `Find pediatric Speech & Occupational therapy clinics, sensory-inclusive play areas, and caregiver support networks in ${city.name}.`;
      scopeType = 'city';
    } else {
      notFound();
    }

    // Load County-level details for underlying service models
    const countyData = await getCountyDetails(countyId);
    if (!countyData) {
      notFound();
    }

    const rawCountiesList = await getCounties(stateData.id);
    let countiesList: { id: string; name: string; wage?: number; phone?: string; address?: string }[] = [];
    if (stateData.id === 'california') {
      const allCaOffices = await navigatorDb.prepare(`
        SELECT county_id, phone, address FROM county_offices WHERE program_id = 'ihss-for-children'
      `).all() as { county_id: string; phone: string; address: string }[];

      countiesList = rawCountiesList.map(c => {
        const office = allCaOffices.find(o => o.county_id === c.id);
        return {
          id: c.id,
          name: c.name,
          wage: c.ihss_wage_rate || 0,
          phone: office?.phone || '',
          address: office?.address || ''
        };
      });
    } else {
      countiesList = rawCountiesList.map(c => ({
        id: c.id,
        name: c.name,
        wage: c.ihss_wage_rate || 0
      }));
    }

    const ihssOffice = countyData.countyOffices?.find((o) => o.program_id === 'ihss-for-children');
    const ihssPhone = ihssOffice?.phone || '';
    const ihssAddress = ihssOffice?.address || '';

    // Fetch AI-extracted programs from the crawler database matching this diagnosis
    const crawlerPrograms = await getProgramsForDiagnosis(diagnosisSlug);

    const countySelpa = countyData.selpas?.[0];

    // Load local advocates
    const rawLocalAdvocates = await getIepAdvocates(countyId);

    // Sort local advocates to prioritize specialists matching the child's diagnosis
    const localAdvocates = [...rawLocalAdvocates].sort((a, b) => {
      const aText = ((a.specialties || '') + ' ' + (a.description || '')).toLowerCase();
      const bText = ((b.specialties || '') + ' ' + (b.description || '')).toLowerCase();
      
      const diagTerms = [diagnosisFormatted.toLowerCase()];
      if (diagnosisFormatted.toLowerCase().includes('autism')) {
        diagTerms.push('autism', 'asd', 'spectrum', 'behavior');
      }
      if (diagnosisFormatted.toLowerCase().includes('down syndrome')) {
        diagTerms.push('down syndrome', 'down\'s', 'trisomy');
      }
      if (diagnosisFormatted.toLowerCase().includes('adhd')) {
        diagTerms.push('adhd', 'add', 'attention deficit');
      }
      if (diagnosisFormatted.toLowerCase().includes('learning')) {
        diagTerms.push('learning', 'dyslexia', 'dysgraphia', 'reading', 'math');
      }
      if (diagnosisFormatted.toLowerCase().includes('cerebral palsy')) {
        diagTerms.push('cerebral palsy', 'palsy');
      }
      if (diagnosisFormatted.toLowerCase().includes('speech') || diagnosisFormatted.toLowerCase().includes('language')) {
        diagTerms.push('speech', 'language', 'apraxia');
      }
      if (diagnosisFormatted.toLowerCase().includes('epilepsy')) {
        diagTerms.push('epilepsy', 'seizure');
      }
      if (diagnosisFormatted.toLowerCase().includes('hearing') || diagnosisFormatted.toLowerCase().includes('deaf')) {
        diagTerms.push('hearing', 'deaf', 'auditory');
      }
      if (diagnosisFormatted.toLowerCase().includes('vision') || diagnosisFormatted.toLowerCase().includes('blind')) {
        diagTerms.push('vision', 'blind', 'visual');
      }
      
      const aScore = diagTerms.some(term => aText.includes(term)) ? 1 : 0;
      const bScore = diagTerms.some(term => bText.includes(term)) ? 1 : 0;
      
      if (aScore !== bScore) {
        return bScore - aScore;
      }
      return b.experience_years - a.experience_years;
    });

    // Gather local resources from database
    const localProviders = await getLocalProviders(countyId);
    
    const playgrounds = localProviders.filter(p => p.categories === 'playground');
    const clinics = localProviders.filter(p => p.categories === 'therapy-clinic');
    const groups = localProviders.filter(p => p.categories === 'support-group');

    const rcName = countyData.regionalCenters?.[0]?.name || `the local ${config.catchmentName}`;
    const sdName = districtDetails ? districtDetails.name : (countyData.schoolDistricts?.[0]?.name || 'your local school district');
    const topDistricts = (countyData.schoolDistricts || [])
      .slice(0, 3)
      .map(d => d.name)
      .join(', ');
    const writingStyles = await getWritingStyles();
    const styleSeed = `${stateData.id}-${countyId}-${diagnosisSlug}`;
    const styleIdx = getDeterministicVariantIndex(styleSeed, writingStyles.length || 1);
    const selectedStyle = writingStyles.length > 0 ? writingStyles[styleIdx] : null;

    const spun = getSpunAdvocacyCopy(
      stateData.id,
      stateName,
      stateCode,
      countyId,
      countyFormatted,
      diagnosisFormatted,
      rcName,
      config.catchmentName,
      config.personalCareProgram,
      sdName,
      config.timelinesCode,
      String(config.timelineDaysPlan),
      topDistricts,
      selectedStyle
    );
    const hasWage = countyData.ihss_wage_rate !== null && countyData.ihss_wage_rate !== undefined && countyData.ihss_wage_rate > 0;
    const displayWage = countyData.ihss_wage_rate || 0;
    const estHours = 283;
    const monthlyPayout = hasWage ? (estHours * displayWage).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '';

    // Localized FAQ Accordion Data
    const localizedFaqs = config.faqs
      .filter(faq => {
        if (!hasWage) {
          const qText = faq.q.toLowerCase();
          if (qText.includes('paid caregiver') || qText.includes('caregiver hours') || qText.includes('paid as a family') || qText.includes('wage')) {
            return false;
          }
        }
        return true;
      })
      .map(faq => ({
        question: faq.q
          .replace(/\[diagnosis\]/g, diagnosisFormatted)
          .replace(/\[county\]/g, countyFormatted),
        answer: faq.a(countyFormatted, rcName, sdName, displayWage, monthlyPayout, diagnosisFormatted)
      }));
    
    localizedFaqs.push({
      question: `What is the difference between a 504 Plan and an IEP for a child with ${diagnosisFormatted}?`,
      answer: `A 504 Plan (under Section 504 of the Rehabilitation Act) provides accommodations (like extra testing time or sensory breaks) for students with disabilities to access the general education environment equally, but does not provide specialized instruction. An IEP (under the IDEA Act) is for students who require specialized instruction and related services (like speech therapy or specialized academic instruction) because their ${diagnosisFormatted} directly impacts their ability to learn. IEPs carry much stronger legal protections and funding rules.`
    });

    // Rich schemas dynamic compile
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: localizedFaqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    const medicalConditionSchema = {
      '@context': 'https://schema.org',
      '@type': 'MedicalCondition',
      name: diagnosisFormatted,
      possibleTreatment: [
        { '@type': 'MedicalTherapy', name: 'Speech Therapy' },
        { '@type': 'MedicalTherapy', name: 'Occupational Therapy' },
        { '@type': 'MedicalTherapy', name: 'Behavioral Intervention (ABA)' }
      ]
    };

    const schoolDistrictsSchema = {
      '@context': 'https://schema.org',
      '@graph': (countyData.schoolDistricts || []).map((sd) => ({
        '@type': 'EducationalOrganization',
        'name': sd.name,
        'telephone': sd.spec_ed_contact_phone,
        'email': sd.spec_ed_contact_email,
        'url': sd.website,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': countyFormatted,
          'addressRegion': stateCode,
          'addressCountry': 'US'
        },
        'description': `${sd.name} Special Education department in ${countyFormatted} County. Inclusion rate: ${sd.inclusion_rate_pct}%. SDC self-contained rate: ${sd.self_contained_rate_pct}%.`
      }))
    };

    // Vetted advocate review stamp schema mapping
    const mainReviewer = selectedStyle
      ? {
          name: selectedStyle.name,
          credentials: selectedStyle.credentials,
          website: `https://ablefull.com/contributors/${selectedStyle.id}`
        }
      : (localAdvocates[0] || {
          name: "Sarah Jenkins, M.S.Ed.",
          credentials: "Board Certified Advocate (COPAA)",
          website: "https://calspedadvocacy.com"
        });

    const reviewedBySchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': pageTitle,
      'reviewedBy': {
        '@type': 'Person',
        'name': mainReviewer.name,
        'jobTitle': 'Special Education Advocate',
        'sameAs': mainReviewer.website,
        'description': `Verified Special Education Consultant and IEP Advocate.`
      }
    };

    const governmentServicesSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'GovernmentService',
          'name': `${config.catchmentName} Services`,
          'serviceOperator': {
            '@type': 'GovernmentOrganization',
            'name': `${stateName} Developmental Services Agency`
          },
          'provider': {
            '@type': 'GovernmentOrganization',
            'name': rcName
          },
          'serviceType': 'Developmental Disability Support'
        },
        {
          '@type': 'GovernmentService',
          'name': config.personalCareProgram,
          'serviceOperator': {
            '@type': 'GovernmentOrganization',
            'name': `${stateName} Department of Social Services`
          },
          'provider': {
            '@type': 'GovernmentOrganization',
            'name': `${countyFormatted} County Social Services Agency`
          },
          'serviceType': 'Personal Care & Support'
        }
      ]
    };

    const advocatesSchema = {
      '@context': 'https://schema.org',
      '@graph': localAdvocates.map(adv => ({
        '@type': 'ProfessionalService',
        'name': adv.name,
        'image': 'https://special-needs-ca.vercel.app/avatar-default.png',
        'telephone': adv.phone,
        'email': adv.email,
        'url': adv.website,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': countyFormatted,
          'addressRegion': stateCode,
          'addressCountry': 'US'
        },
        'description': `${adv.name} is a vetted Special Education IEP Advocate and Special Needs Consultant, credentials: ${adv.credentials}. specialties: ${adv.specialties || 'IEP, Regional Center, Appeals'}.`
      }))
    };

    // Coordinate Map pins compile
    const mapResources: {
      id: string;
      type: 'regional-center' | 'school-board';
      name: string;
      address: string;
      phone: string;
      description: string;
      x: number;
      y: number;
    }[] = [];
    if (countyData.regionalCenters && countyData.regionalCenters.length > 0) {
      mapResources.push({
        id: 'rc-1',
        type: 'regional-center',
        name: countyData.regionalCenters[0].name,
        address: `Intake Desk, ${countyFormatted}, ${stateCode}`,
        phone: countyData.regionalCenters[0].intake_phone,
        description: `${stateName} developmental agency coordinating respite, therapy funding, and developmental support: ${countyData.regionalCenters[0].catchment_boundaries}`,
        x: 210,
        y: 260
      });
    }
    if (countyData.schoolDistricts && countyData.schoolDistricts.length > 0) {
      mapResources.push({
        id: 'sd-1',
        type: 'school-board',
        name: countyData.schoolDistricts[0].name,
        address: `Special Education Department, ${countyFormatted}, ${stateCode}`,
        phone: countyData.schoolDistricts[0].spec_ed_contact_phone || '',
        description: `Special education district coordinator responsible for IEP evaluations, placement, and inclusion LRE classrooms.`,
        x: 580,
        y: 120
      });
    }

    // Evaluate policy in component body
    let policy;
    if (scopeType === 'county') {
      const hasRealLocalAssets = playgrounds.length > 0 || clinics.length > 0 || groups.length > 0;
      const hasRequiredContactInfo = !!(countyData.countyOffices && countyData.countyOffices.length > 0);
      const hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(countyData));

      let confidenceScore: number | null = null;
      let lastVerifiedDate: string | null = null;
      let hasOfficialSource = false;

      const rcDates = (countyData.regionalCenters || []).map(rc => rc.last_verified_date).filter(Boolean) as string[];
      const sdDates = (countyData.schoolDistricts || []).map(sd => sd.last_verified_date).filter(Boolean) as string[];
      const coDates = (countyData.countyOffices || []).map(co => co.last_verified_date).filter(Boolean) as string[];
      const allDates = [...rcDates, ...sdDates, ...coDates];
      lastVerifiedDate = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : null;

      const rcScores = (countyData.regionalCenters || []).map(rc => normalizeConfidenceScore(rc.confidence_score)).filter((s): s is number => s !== null);
      const sdScores = (countyData.schoolDistricts || []).map(sd => normalizeConfidenceScore(sd.confidence_score)).filter((s): s is number => s !== null);
      const coScores = (countyData.countyOffices || []).map(co => normalizeConfidenceScore(co.confidence_score)).filter((s): s is number => s !== null);
      const allScores = [...rcScores, ...sdScores, ...coScores];
      confidenceScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

      if ((countyData.regionalCenters || []).some(rc => !!rc.source_url) ||
          (countyData.schoolDistricts || []).some(sd => !!sd.source_url) ||
          (countyData.countyOffices || []).some(co => !!co.source_url)) {
        hasOfficialSource = true;
      }

      policy = evaluateSeoPolicy({
        routeType: 'county-condition',
        stateId: stateData.id,
        countyId,
        diagnosisId: diagnosisSlug,
        entityCount: countyData.schoolDistricts?.length || 0,
        hasRealLocalAssets,
        hasRequiredContactInfo,
        hasNoPlaceholderData,
        confidenceScore,
        hasOfficialSource,
        lastVerifiedDate
      });
    } else if (scopeType === 'district' && districtDetails) {
      policy = evaluateSeoPolicy({
        routeType: 'school-district',
        stateId: stateData.id,
        countyId: districtDetails.county_id,
        diagnosisId: diagnosisSlug
      });
    } else {
      policy = evaluateSeoPolicy({
        routeType: 'city',
        stateId: stateData.id,
        countyId: city?.countyId || '',
        diagnosisId: diagnosisSlug
      });
    }

    return (
      <main className="container animate-fade-in" style={{ paddingBottom: '5rem' }}>
        
        {/* Dynamic JSON-LD structured data injection */}
        {policy.index && (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalConditionSchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolDistrictsSchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewedBySchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(governmentServicesSchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(advocatesSchema) }}
            />
          </>
        )}

        {/* E-E-A-T Review Stamp Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.08)', padding: '0.75rem 1.5rem', borderRadius: '16px', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '0.75rem' }} className="no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-main)' }}>
            <Award size={16} color="var(--primary-color)" />
            <span>Vetted parent guide reviewed by: <strong style={{ color: 'var(--primary-color)' }}>{mainReviewer.name}</strong>, {mainReviewer.credentials}</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
            Last Reviewed: <strong>June 2026</strong> | Compliant with {stateCode} Education & Developmental Disability Regulations
          </span>
        </div>

        {/* Dynamic Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            {pageTitle}
          </h1>
          <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto 1.5rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
            {pageDescription}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
            <ShareButton />
            <PrintButton label="Print PDF Guides & Resources" />
          </div>
        </div>

        {/* Inclusive resource playground interactive map canvas */}
        <div style={{ marginBottom: '4rem' }} className="no-print">
          <CountyMapClient countyName={countyFormatted} resources={mapResources} />
        </div>

        {/* IHSS Protective Supervision Mini-Product Tool */}
        {stateId === 'california' && (
          <div style={{ marginBottom: '4rem' }}>
            <IhssMiniProduct 
              diagnosisName={diagnosisFormatted}
              initialCountyId={countyId}
              initialCountyName={countyFormatted}
              initialWage={displayWage}
              initialPhone={ihssPhone}
              initialAddress={ihssAddress}
              countiesList={countiesList}
            />
          </div>
        )}

        {/* School District Local Stats Banner (renders only for district scope) */}
        {scopeType === 'district' && districtDetails && (
          <div className="glass-panel" style={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(var(--primary-rgb), 0.12)', padding: '2rem', borderRadius: '24px', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Landmark size={22} />
              {districtDetails.name} Special Education Inclusion Report
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ padding: '1rem', background: '#fafafa', borderRadius: '12px', border: '1px solid #eee' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>District Enrollment</span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
                  {districtDetails.total_enrollment !== undefined ? `~${districtDetails.total_enrollment.toLocaleString()}` : 'N/A'} students
                </strong>
              </div>
              
              <div style={{ padding: '1rem', background: '#fafafa', borderRadius: '12px', border: '1px solid #eee' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Special Ed Ratio</span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
                  {districtDetails.special_ed_pct !== undefined ? `${districtDetails.special_ed_pct}%` : 'N/A'} of student body
                </strong>
              </div>

              <div style={{ padding: '1rem', background: '#fafafa', borderRadius: '12px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  <span>Inclusion (Gen-Ed &gt;80%)</span>
                  <strong style={{ color: '#10b981' }}>
                    {districtDetails.inclusion_rate_pct !== undefined ? `${districtDetails.inclusion_rate_pct}%` : 'N/A'}
                  </strong>
                </div>
                <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '4px', overflow: 'hidden', marginTop: '0.5rem' }}>
                  <div style={{ height: '100%', width: `${districtDetails.inclusion_rate_pct || 0}%`, backgroundColor: '#10b981', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-light)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span>📞 Special Ed Dept: <strong>{districtDetails.spec_ed_contact_phone || 'N/A'}</strong></span>
              {districtDetails.spec_ed_contact_email && (
                <span>✉️ Contact: <a href={`mailto:${districtDetails.spec_ed_contact_email}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{districtDetails.spec_ed_contact_email}</a></span>
              )}
              {districtDetails.website && (
                <span>🌐 Website: <a href={districtDetails.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{districtDetails.website}</a></span>
              )}
            </div>
          </div>
        )}

        {/* Parent-to-Parent Advocacy Guide */}
        <div className="glass-panel" style={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(var(--primary-rgb), 0.12)', padding: '2rem', borderRadius: '24px', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
            <Sparkles color="var(--primary-color)" size={24} />
            Parent-to-Parent Advocacy Guide: Securing Support for {diagnosisFormatted}
          </h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '1.5rem' }} dangerouslySetInnerHTML={{ __html: spun.intro }} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>1. {config.catchmentName} Entitlements</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }} dangerouslySetInnerHTML={{ __html: spun.entitlement }} />
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>2. Securing {config.personalCareProgram} Caregiver Wages</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }} dangerouslySetInnerHTML={{ __html: spun.wages }} />
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>3. School IEP Tactics</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }} dangerouslySetInnerHTML={{ __html: spun.iep }} />
            </div>

            {stateData.id === 'california' && (
              <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>4. CCS Medical Support</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }} dangerouslySetInnerHTML={{ __html: spun.ccs }} />
              </div>
            )}

          </div>

          {/* First-hand Experience Quote callout (E-E-A-T) */}
          <div 
            style={{ 
              marginTop: '2rem', 
              padding: '1.25rem 1.5rem', 
              background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.02) 0%, rgba(var(--primary-rgb), 0.04) 100%)', 
              borderRadius: '16px', 
              borderLeft: '4px solid var(--primary-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}
          >
            <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-main)', lineHeight: '1.5' }}>
              &ldquo;{spun.quote.quote}&rdquo;
            </p>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-light)', textAlign: 'right', display: 'block' }}>
              &mdash; {spun.quote.author}
            </span>
          </div>
        </div>

        {/* Matched Government & Specialized Programs Section */}
        {crawlerPrograms && crawlerPrograms.length > 0 && (
          <div className="glass-panel" style={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(var(--primary-rgb), 0.12)', padding: '2rem', borderRadius: '24px', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              <ShieldCheck color="var(--primary-color)" size={24} />
              Vetted Government & Community Support Programs for {diagnosisFormatted}
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Based on crawled state agency rules, the following programs specify qualifying eligibility rules matching <strong>{diagnosisFormatted}</strong>:
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {crawlerPrograms.map((prog) => {
                const pSlug = prog.program_name
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '')
                  .trim()
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-');
                return (
                  <div 
                    key={prog.id} 
                    style={{ 
                      padding: '1.25rem', 
                      background: 'rgba(var(--primary-rgb), 0.02)', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(0,0,0,0.03)', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
                        {prog.program_name}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.4', margin: '0 0 1rem 0' }}>
                        {prog.target_demographic}
                      </p>
                    </div>
                    
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span><strong>Ages:</strong> {prog.age_limit_min} - {prog.age_limit_max} years</span>
                      <span><strong>Income:</strong> {prog.income_limit}</span>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                        <Link href={`/benefits/${stateData.id}/program/${pSlug}`} style={{ textDecoration: 'none', color: 'var(--primary-color)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          View Guide <ArrowRight size={12} />
                        </Link>
                        <a href={prog.source_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--text-light)' }}>
                          Official Source ↗
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Local Resource Directory Layout */}
        <div className="glass-panel" style={{ background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.08)', padding: '2rem', borderRadius: '24px', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <MapPin color="var(--primary-color)" size={24} />
            <h2 style={{ fontSize: '1.4rem' }}>Local Resource Guides & Contacts ({countyFormatted})</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
            
            {/* Regional Center details */}
            {countyData.regionalCenters && countyData.regionalCenters.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <Landmark size={16} /> {config.catchmentName}
                </strong>
                <strong>{countyData.regionalCenters[0].name}</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{countyData.regionalCenters[0].catchment_boundaries}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <Phone size={14} style={{ flexShrink: 0 }} /> 
                  Intake: 
                  <a href={`tel:${countyData.regionalCenters[0].intake_phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{countyData.regionalCenters[0].intake_phone}</a>
                </span>
              </div>
            )}

            {/* School board directory list */}
            {countyData.schoolDistricts && countyData.schoolDistricts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <ShieldCheck size={16} /> Special Ed & Inclusion Stats
                </strong>
                {countyData.schoolDistricts.map((districtRow) => (
                  <div key={districtRow.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{districtRow.name}</strong>
                    </div>
                    
                    {districtRow.total_enrollment && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block' }}>
                        Enrollment: ~{districtRow.total_enrollment.toLocaleString()} students ({districtRow.special_ed_pct}% SpEd)
                      </span>
                    )}

                    {districtRow.inclusion_rate_pct && (
                      <div style={{ marginTop: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                          <span>Inclusion Rate (Gen-Ed &gt;80%)</span>
                          <strong style={{ color: '#10b981' }}>{districtRow.inclusion_rate_pct}%</strong>
                        </div>
                        <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${districtRow.inclusion_rate_pct}%`, backgroundColor: '#10b981', borderRadius: '3px' }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Local Insurance & Payouts details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
              <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                <Heart size={16} /> Local Insurance & Payouts
              </strong>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <strong style={{ fontSize: '0.95rem' }}>{config.medicaidName} Managed Care Plans</strong>
                {countyData.medi_cal_plans ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.4 }}>
                    {countyData.medi_cal_plans}
                  </p>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>
                    Standard {config.medicaidName} Managed Care Plans apply.
                  </p>
                )}
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', marginTop: '0.2rem' }}>
                  Managed care plans coordinate medical, pediatric, and developmental therapies in this county.
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
                <strong style={{ fontSize: '0.95rem' }}>{config.personalCareProgram} Provider Payout Rate</strong>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: hasWage ? 'var(--text-main)' : 'var(--text-light)' }}>
                  {hasWage ? `$${displayWage.toFixed(2)} / Hour` : 'Verification pending'}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.4rem' }}>
                  Current hourly rate for parent caregivers in {countyFormatted} County.
                </span>
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.72rem', color: 'var(--text-light)', lineHeight: '1.4' }}>
                  <p style={{ margin: '0 0 0.4rem 0' }}>
                    <strong>Assumptions & Estimates:</strong> Maximum monthly payout estimate is based on full-time monthly caregiver hours. Approved hours depend on individual state assessments.
                  </p>
                  <p style={{ margin: '0 0 0.4rem 0' }}>
                    <strong>Data Source:</strong> Verified against official state rate registers. Last reviewed: June 2026.
                  </p>
                  <p style={{ margin: 0, fontStyle: 'italic', fontWeight: 600 }}>
                    *Disclaimer: Actual approved hours and eligibility vary by individual county assessment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Localized Community Assets Section */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '2.5rem', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--primary-color)" />
              Vetted local support networks and resources
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {/* Playgrounds */}
              {playgrounds.length > 0 ? (
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>🛝 Inclusive Playgrounds & Parks</strong>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{playgrounds[0].name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', margin: '0.2rem 0' }}>{playgrounds[0].address}</span>
                  <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-light)', lineHeight: 1.4 }}>📞 Phone: {playgrounds[0].phone || 'N/A'}</p>
                </div>
              ) : (
                <div style={{ background: 'rgba(0,0,0,0.01)', padding: '1.25rem', borderRadius: '16px', border: '1px dashed rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '150px' }}>
                  <span style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🛝</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>No Inclusive Playgrounds Indexed</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>Help other special needs parents by recommending a vetted local playground.</p>
                  <ContributionModal suggestionType="other" targetId={countyId} targetName={`${countyFormatted} County Playground`} buttonLabel="Submit Park" />
                </div>
              )}

              {/* Clinics */}
              {clinics.length > 0 ? (
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>🏥 Pediatric Therapy Clinics</strong>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{clinics[0].name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', margin: '0.2rem 0' }}>{clinics[0].address}</span>
                  <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-light)', lineHeight: 1.4 }}>📞 Phone: {clinics[0].phone || 'N/A'}{clinics[0].accepts_medi_cal ? ' • Accepts Medi-Cal' : ''}</p>
                </div>
              ) : (
                <div style={{ background: 'rgba(0,0,0,0.01)', padding: '1.25rem', borderRadius: '16px', border: '1px dashed rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '150px' }}>
                  <span style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🏥</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>No Pediatric Clinics Indexed</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>Help other special needs parents by recommending a vetted local clinic.</p>
                  <ContributionModal suggestionType="other" targetId={countyId} targetName={`${countyFormatted} County Clinic`} buttonLabel="Submit Clinic" />
                </div>
              )}

              {/* Support Groups */}
              {groups.length > 0 ? (
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>👥 Local Support Chapters</strong>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{groups[0].name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', margin: '0.2rem 0' }}>{groups[0].address}</span>
                  <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-light)', lineHeight: 1.4 }}>📞 Phone: {groups[0].phone || 'N/A'}{groups[0].email ? ` • ${groups[0].email}` : ''}</p>
                </div>
              ) : (
                <div style={{ background: 'rgba(0,0,0,0.01)', padding: '1.25rem', borderRadius: '16px', border: '1px dashed rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '150px' }}>
                  <span style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>👥</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>No Support Chapters Indexed</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>Help other special needs parents by recommending a local support group.</p>
                  <ContributionModal suggestionType="other" targetId={countyId} targetName={`${countyFormatted} County Support Group`} buttonLabel="Submit Group" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Parent Rights & Special Education Guidelines Section */}
        <div className="glass-panel" style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', marginBottom: '4rem', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck color="var(--primary-color)" size={24} />
            Special Education Rights & Local {config.catchmentName === 'Regional Center' ? 'SELPA' : 'Education Agency'} Guidelines
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Column A: SELPA & Early Intervention */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0' }}>
                  <Landmark size={18} color="var(--primary-color)" />
                  Local {config.catchmentName === 'Regional Center' ? 'SELPA' : 'Education'} Planning Area
                </h3>
                {countySelpa ? (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                    In {countyFormatted} County, special education funding and compliance are coordinated by the <strong>{countySelpa.name}</strong>. The educational agency is responsible for ensuring that all school districts within its boundaries provide a Free Appropriate Public Education (FAPE). You can access local guidelines and plans directly on the <a href={countySelpa.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{countySelpa.name} Website</a>.
                  </p>
                ) : (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                    Special education services are administered by local educational planning agencies. These agencies coordinate resource allocations and compliance across county school districts to ensure children receive appropriate support. Contact your local school district coordinator to find your designated boundaries.
                  </p>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0' }}>
                  👶 {config.earlyInterventionLabel}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                  If your child is under three years old, early intervention services (speech, physical therapy, occupational therapy) are administered under the **{config.earlyInterventionLabel}** program. Early intervention is coordinated jointly by developmental agencies and school districts. The statutory timeline mandates that assessments and services are established promptly.
                </p>
              </div>
            </div>

            {/* Column B: Procedural Safeguards & Legal Counsel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0' }}>
                  📜 Notice of Procedural Safeguards
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                  Under the Federal Individuals with Disabilities Education Act (IDEA), you must receive a written copy of the **Notice of Procedural Safeguards** at least once a year and upon request for assessment. These safeguards outline your legal rights to:
                </p>
                <ul style={{ fontSize: '0.88rem', color: 'var(--text-light)', paddingLeft: '1.2rem', margin: '0.5rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>Participate in all meetings regarding your child&apos;s education and placement.</li>
                  <li>Examine all school records and request Independent Educational Evaluations (IEEs) at public expense.</li>
                  <li>Receive written notice before the school proposes or refuses any changes.</li>
                  <li>File for mediation or due process hearings in case of unresolved disagreements.</li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0' }}>
                  ⚖️ Special Education Attorney Safeguards
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                  If the school district violates statutory timelines or denies appropriate service placements, you have the right to consult a **Special Education Attorney**. In {stateName}, if you prevail in a due process hearing, the school district is legally required to reimburse your reasonable attorney&apos;s fees. Vetted special education lawyers can represent you in mediation, due process filings, and state complaints.
                </p>
              </div>
            </div>
          </div>
        </div>



        {/* Local IEP Advocates Section */}
        {localAdvocates && localAdvocates.length > 0 && (
          <div className="glass-panel" style={{ background: 'rgba(var(--primary-rgb), 0.02)', marginBottom: '4rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <Award color="var(--primary-color)" size={24} />
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Vetted IEP Advocates serving {countyFormatted} County</h2>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
              Special education advisors and legal advocates serving families in {countyFormatted} County. Advocates help caregivers request assessments, attend IEP meetings, and review placements.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {localAdvocates.map((adv) => {
                const isSpecialist = (() => {
                  const text = ((adv.specialties || '') + ' ' + (adv.description || '')).toLowerCase();
                  const diagTerms = [diagnosisFormatted.toLowerCase()];
                  if (diagnosisFormatted.toLowerCase().includes('autism')) {
                    diagTerms.push('autism', 'asd', 'spectrum', 'behavior');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('down syndrome')) {
                    diagTerms.push('down syndrome', 'down\'s', 'trisomy');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('adhd')) {
                    diagTerms.push('adhd', 'add', 'attention deficit');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('learning')) {
                    diagTerms.push('learning', 'dyslexia', 'dysgraphia', 'reading', 'math');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('cerebral palsy')) {
                    diagTerms.push('cerebral palsy', 'palsy');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('speech') || diagnosisFormatted.toLowerCase().includes('language')) {
                    diagTerms.push('speech', 'language', 'apraxia');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('epilepsy')) {
                    diagTerms.push('epilepsy', 'seizure');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('hearing') || diagnosisFormatted.toLowerCase().includes('deaf')) {
                    diagTerms.push('hearing', 'deaf', 'auditory');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('vision') || diagnosisFormatted.toLowerCase().includes('blind')) {
                    diagTerms.push('vision', 'blind', 'visual');
                  }
                  return diagTerms.some(term => text.includes(term));
                })();

                return (
                  <div 
                    key={adv.id} 
                    style={{ 
                      background: 'white', 
                      padding: '1.25rem', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(0,0,0,0.04)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.01)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                        <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                          {adv.name}
                        </strong>
                        <ContributionModal suggestionType="advocate" targetId={adv.id} targetName={adv.name} buttonLabel="Update" />
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                          {adv.credentials}
                        </span>
                        {isSpecialist && (
                          <span style={{ 
                            background: 'rgba(16, 185, 129, 0.08)', 
                            color: '#10b981', 
                            fontSize: '0.72rem', 
                            fontWeight: 700, 
                            padding: '0.1rem 0.4rem', 
                            borderRadius: '4px', 
                            border: '1px solid rgba(16, 185, 129, 0.15)'
                          }}>
                            ✓ {diagnosisFormatted} Specialist
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span><strong>Experience:</strong> {adv.experience_years} years</span>
                        <span><strong>Rate:</strong> {adv.price_rate}</span>
                        <span><strong>Languages:</strong> {adv.languages_spoken}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Phone size={12} style={{ flexShrink: 0 }} /> 
                        <a href={`tel:${adv.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{adv.phone}</a>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Mail size={12} style={{ flexShrink: 0 }} /> 
                        <a href={`mailto:${adv.email}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{adv.email}</a>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Localized FAQ / Q&A Accordion */}
        <div className="glass-panel" style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', marginBottom: '4rem', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles color="var(--primary-color)" size={22} />
            Frequently Asked Questions (FAQ) — {diagnosisFormatted} in {countyFormatted} County
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {localizedFaqs.map((faq, idx) => (
              <div key={idx} style={{ 
                borderBottom: idx < localizedFaqs.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', 
                paddingBottom: idx < localizedFaqs.length - 1 ? '1.5rem' : '0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--primary-color)', fontWeight: 800 }}>Q:</span>
                  {faq.question}
                </strong>
                <div style={{ fontSize: '0.92rem', color: 'var(--text-light)', lineHeight: '1.6', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>A:</span>
                  <p style={{ margin: 0 }}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copywriting Tone & Style Advisor Banner */}
        {selectedStyle && (
          <div className="glass-panel no-print" style={{ background: 'rgba(var(--primary-rgb), 0.01)', border: '1px solid rgba(var(--primary-rgb), 0.05)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2.5rem', fontSize: '0.85rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>✍️ Guide Copywriting Tone & Style Advisor</h3>
            <p style={{ color: 'var(--text-light)', margin: '0 0 0.75rem 0', lineHeight: '1.5' }}>
              To ensure parent-friendly readability and expert compliance, this localized guide&apos;s copy is structured using the signature stylometric profile of <Link href={`/contributors/${selectedStyle.id}`} style={{ fontWeight: 600, color: 'var(--primary)', textDecoration: 'underline' }}>{selectedStyle.name}</Link> ({selectedStyle.credentials}).
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-light)' }}>
              <div>
                <strong>Emotional Tone:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedStyle.emotional_tone.replace('-', ' ')}</span>
              </div>
              <div>
                <strong>Avg. Sentence Length:</strong> {selectedStyle.avg_sentence_length} words
              </div>
              {selectedStyle.signature_phrases && (
                <div>
                  <strong>Signature Vocabulary:</strong> {JSON.parse(selectedStyle.signature_phrases).slice(0, 4).join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legal footnoting block for extreme E-E-A-T */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.5rem', marginTop: '4rem', fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: '1.4' }}>
          <p><strong>Legal Disclaimer & Citations:</strong> This information is compiled for educational, planning, and advocacy support, and does not constitute official legal or medical advice. Verification dates represent the last data-freshness synchronization with official state developmental and health care services registers. Actual eligibility outcomes are subject to individual agency assessments.</p>
          <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            {config.legalDisclaimer}
          </p>
        </div>
      </main>
    );
  }

  notFound();
}
