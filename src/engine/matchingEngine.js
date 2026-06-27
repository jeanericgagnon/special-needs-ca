import { programs, counties, regionalCenters, functionalNeeds, conditions } from '../data/seedData.js';

/**
 * Helper to calculate age in years and months from date of birth
 * @param {string} dobString - YYYY-MM-DD
 * @returns {{ years: number, months: number }}
 */
export function calculateAge(dobString) {
  if (!dobString) return { years: 0, months: 0 };
  const birthDate = new Date(dobString);
  const today = new Date();
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }
  
  return { years: Math.max(0, years), months: Math.max(0, months) };
}

/**
 * Rules-Based Matching Engine
 * @param {Object} profile - The child's profile inputs
 * @returns {Object} Structured outputs including highPriority, possible, notRelevant, revisitLater, and local references.
 */
export function runMatchingEngine(profile) {
  const age = calculateAge(profile.dob);
  const ageInYears = age.years + (age.months / 12);
  
  const selectedConditions = profile.conditionIds || [];
  const suspectedConditions = profile.suspectedConditionIds || [];
  const allConditions = [...selectedConditions, ...suspectedConditions];
  const selectedNeeds = profile.functionalNeedIds || [];
  
  const isMediCal = profile.insuranceType === 'medi-cal' || profile.insuranceType === 'both';
  const isPrivateInsurance = profile.insuranceType === 'private' || profile.insuranceType === 'both';
  
  const hasRC = profile.currentServiceIds?.includes('regional-centers') || profile.regionalCenterStatus === 'active';
  const hasEarlyStart = profile.currentServiceIds?.includes('early-start') || profile.earlyStartStatus === 'active';
  const hasIEP = profile.schoolStatus === 'iep' || profile.iepStatus === 'active';
  
  // Find local entities based on matched county
  const countyId = profile.countyId || 'los-angeles';
  const localCounty = counties.find(c => c.id === countyId) || counties[0];
  
  const localRC = regionalCenters.find(rc => rc.countiesServed.includes(countyId)) || regionalCenters[0];
  
  const results = {
    highPriority: [],
    possible: [],
    notRelevant: [],
    revisitLater: [],
    localOffices: [],
    localOrganizations: [],
    requiredDocuments: [],
    applicationSequence: [],
    suggestedReminders: [],
    summaryRationale: ''
  };

  // Compile general local office/org routing
  if (localCounty) {
    results.localOffices.push(
      { type: 'County IHSS', name: localCounty.ihssOffice, contact: localCounty.ihssContact },
      { type: 'County Medi-Cal', name: localCounty.mediCalOffice, contact: localCounty.mediCalContact },
      { type: 'County CCS Office', name: localCounty.ccsOffice, contact: localCounty.ccsContact }
    );
    if (localRC) {
      results.localOffices.push({
        type: 'Regional Center Intake',
        name: localRC.name,
        contact: `Main: ${localRC.intakePhone} | Early Start: ${localRC.earlyStartContact}`
      });
    }
    localCounty.schoolDistricts?.forEach(sd => {
      results.localOffices.push({
        type: 'School District Special Ed',
        name: sd.name,
        contact: `Phone: ${sd.specEdPhone} | Email: ${sd.email || 'N/A'}`
      });
    });
    
    localCounty.localOrganizations?.forEach(org => {
      results.localOrganizations.push({ name: org.name, website: org.website });
    });
  }

  // Define dynamic rationales and populate results
  programs.forEach(prog => {
    let recommendation = {
      id: prog.id,
      name: prog.name,
      description: prog.description,
      officialSourceUrl: prog.officialSourceUrl,
      lastVerifiedDate: prog.lastVerifiedDate,
      confidenceScore: prog.confidenceScore,
      whyMatched: '',
      childProfileTrigger: '',
      whatIsStillUnknown: '',
      whatToDoNext: '',
      requiredDocs: prog.requiredDocuments,
      applicationSteps: prog.applicationSteps
    };

    // --- PROGRAM 1: EARLY START (0-3) ---
    if (prog.id === 'early-start') {
      if (ageInYears < 3) {
        const triggers = [];
        const matchedConditions = conditions.filter(c => allConditions.includes(c.id));
        matchedConditions.forEach(c => {
          if (c.categoryMappings?.regionalCenterRelevance || c.categoryMappings?.ccsRelevance) {
            triggers.push(`${c.name} diagnosis`);
          }
        });
        if (selectedNeeds.includes('speech-therapy')) triggers.push('speech therapy needs');
        if (selectedNeeds.includes('feeding-therapy')) triggers.push('feeding therapy needs');
        if (suspectedConditions.length > 0) triggers.push('suspected undiagnosed conditions');

        if (triggers.length > 0) {
          recommendation.whyMatched = `Because your child is under 3 years old (${age.years}y ${age.months}m) and exhibits ${triggers.join(' and ')}, they are a high-priority match.`;
          recommendation.childProfileTrigger = `Age < 3, Triggers: ${triggers.join(', ')}`;
          recommendation.whatIsStillUnknown = 'The exact level of developmental delay in cognitive and motor sectors.';
          recommendation.whatToDoNext = `Call the Regional Center Early Start intake at ${localRC?.earlyStartContact || 'DDS line'} and request an early intervention evaluation immediately.`;
          results.highPriority.push(recommendation);
        } else {
          recommendation.whyMatched = 'Your child is under 3 years old. While no specific delays were selected, a screening is worth checking if you have developmental concerns.';
          recommendation.childProfileTrigger = 'Age < 3, No explicit delay selected';
          recommendation.whatIsStillUnknown = 'Whether your child has a 25% or greater developmental delay.';
          recommendation.whatToDoNext = 'Monitor developmental milestones. If concerned, request a free developmental assessment from your local Regional Center.';
          results.possible.push(recommendation);
        }
      } else {
        recommendation.whyMatched = `Not relevant now because your child is ${age.years} years old, which exceeds the Early Start eligibility ceiling of 36 months.`;
        recommendation.childProfileTrigger = `Age ${age.years} >= 3`;
        results.notRelevant.push(recommendation);
      }
    }

    // --- PROGRAM 2: REGIONAL CENTERS (LANTERMAN ACT 3+) ---
    else if (prog.id === 'regional-centers') {
      if (ageInYears >= 3) {
        const matchedConditions = conditions.filter(c => allConditions.includes(c.id));
        const rcDiagnoses = matchedConditions.filter(c => c.categoryMappings?.regionalCenterRelevance);
        const rcNeeds = selectedNeeds.filter(n => ['respite-care', 'behavior-support'].includes(n));
        
        if (rcDiagnoses.length > 0 || rcNeeds.length > 0) {
          const matchedTerms = [...rcDiagnoses.map(c => c.name), ...rcNeeds.map(n => functionalNeeds.find(fn => fn.id === n)?.name)];
          recommendation.whyMatched = `Because your child is over age 3 and has developmental markers (${matchedTerms.join(', ')}), they may be highly eligible for lifelong Regional Center services.`;
          recommendation.childProfileTrigger = `Age >= 3, Condition/Needs: ${matchedTerms.join(', ')}`;
          recommendation.whatIsStillUnknown = 'Whether they meet the strict legal standard of substantial limitations in 3 of the 7 major life activity domains.';
          recommendation.whatToDoNext = `Submit an intake referral to the Frank D. Lanterman Regional Center intake line at ${localRC?.intakePhone || 'local office'}.`;
          results.highPriority.push(recommendation);
        } else if (suspectedConditions.length > 0) {
          recommendation.whyMatched = 'Because your child has suspected undiagnosed conditions and is over 3, they are likely worth screening for Fifth Category or autism eligibility.';
          recommendation.childProfileTrigger = 'Age >= 3, Suspected condition';
          recommendation.whatIsStillUnknown = 'Formal psychological and adaptive behavior scores.';
          recommendation.whatToDoNext = 'Request a formal developmental and psychological intake assessment.';
          results.possible.push(recommendation);
        } else {
          recommendation.whyMatched = 'Your child is age 3+. While no developmental diagnoses are recorded, you should check this program if intellectual or adaptive delays arise.';
          recommendation.childProfileTrigger = 'Age >= 3, No explicit developmental diagnosis';
          results.possible.push(recommendation);
        }
      } else {
        recommendation.whyMatched = `Because your child is under age 3 (${age.years} years old), they should first be served under Early Start. They will face Lanterman Transition at age 3.`;
        recommendation.childProfileTrigger = 'Age < 3';
        recommendation.whatIsStillUnknown = 'Progress under Early Start therapies prior to age 3.';
        recommendation.whatToDoNext = 'Ensure active enrollment in Early Start/IFSP and flag transition planning 6 months before their 3rd birthday.';
        results.revisitLater.push(recommendation);
      }
    }

    // --- PROGRAM 3: IHSS FOR CHILDREN ---
    else if (prog.id === 'ihss-for-children') {
      const matchedConditions = conditions.filter(c => allConditions.includes(c.id));
      const isDangerous = selectedNeeds.includes('protective-supervision') || selectedNeeds.includes('behavior-support');
      const isHighlyDependent = selectedNeeds.includes('diapers-incontinence-supplies') || selectedNeeds.includes('feeding-therapy');
      const hasEligibleCondition = matchedConditions.some(c => c.categoryMappings?.regionalCenterRelevance || c.categoryMappings?.ccsRelevance);
      const condNames = matchedConditions.map(c => c.name);
      
      if (hasEligibleCondition && (isDangerous || isHighlyDependent)) {
        recommendation.whyMatched = `Because your child has a developmental condition (${condNames.join(', ')}) combined with severe safety needs (${selectedNeeds.includes('protective-supervision') ? 'Protective Supervision' : 'high-care dependencies'}), they are likely worth screening for paid IHSS care hours.`;
        recommendation.childProfileTrigger = `Conditions: ${condNames.join(', ')}, Needs: ${selectedNeeds.join(', ')}`;
        recommendation.whatIsStillUnknown = `Active Medi-Cal status (required). If family income is too high, you must secure the Regional Center Waiver first.`;
        recommendation.whatToDoNext = `Have your pediatrician complete the SOC 873 Medical Certification and call the County IHSS Intake office at ${localCounty?.ihssContact || 'local DPSS'}.`;
        
        if (isMediCal) {
          results.highPriority.push(recommendation);
        } else {
          recommendation.whyMatched += ' NOTE: Active Medi-Cal is required. Since you do not have Medi-Cal selected, your first step is obtaining it (e.g., through Regional Center Institutional Deeming).';
          results.possible.push(recommendation);
        }
      } else if (hasEligibleCondition) {
        recommendation.whyMatched = `Because your child has ${condNames.join(', ')}, they may qualify for personal care support (bathing, dressing, diapers). Screen for safety concerns to unlock protective supervision.`;
        recommendation.childProfileTrigger = `Conditions: ${condNames.join(', ')}`;
        recommendation.whatIsStillUnknown = 'Hours of daily physical care needed and safety elopement habits.';
        recommendation.whatToDoNext = 'Keep a daily care log for 2 weeks tracking safety hazards or extra hygiene routines.';
        results.possible.push(recommendation);
      } else {
        recommendation.whyMatched = 'IHSS provides home care support. Worth screening if your child develops major self-care delays compared to typically developing children.';
        recommendation.childProfileTrigger = 'No primary developmental diagnosis selected';
        results.possible.push(recommendation);
      }
    }

    // --- PROGRAM 4: MEDI-CAL FOR KIDS & TEENS ---
    else if (prog.id === 'medi-cal-for-kids-and-teens') {
      if (isMediCal) {
        recommendation.whyMatched = 'Active Medi-Cal is already set up. You can utilize EPSDT rules to request any medically necessary therapy, orthotics, or incontinence briefs at no cost.';
        recommendation.childProfileTrigger = 'Insurance: Medi-Cal';
        recommendation.whatToDoNext = 'Ask your primary pediatrician to write direct therapy prescriptions citing "EPSDT medical necessity."';
        results.highPriority.push(recommendation);
      } else {
        recommendation.whyMatched = 'Because you have private insurance or no Medi-Cal listed, you should apply to Medi-Cal for Kids & Teens. It provides vital secondary coverage and funds behavioral ABA and specialized equipment that private plans often exclude.';
        recommendation.childProfileTrigger = 'Insurance: Private or None';
        recommendation.whatIsStillUnknown = 'Family income status or Regional Center waiver eligibility.';
        recommendation.whatToDoNext = 'Submit a screening on BenefitsCal.com or request a Medi-Cal waiver referral from your Regional Center service coordinator.';
        results.possible.push(recommendation);
      }
    }

    // --- PROGRAM 5: CALIFORNIA CHILDREN\'S SERVICES (CCS) ---
    else if (prog.id === 'california-childrens-services') {
      const matchedConditions = conditions.filter(c => allConditions.includes(c.id));
      const ccsConditions = matchedConditions.filter(c => c.categoryMappings?.ccsRelevance);
      const ccsNeeds = selectedNeeds.filter(n => ['hearing-aids', 'vision-services', 'feeding-therapy'].includes(n));
      const ccsCondNames = ccsConditions.map(c => c.name);
      
      if (ccsConditions.length > 0 || ccsNeeds.length > 0) {
        recommendation.whyMatched = `Because your child has a qualifying physical, sensory, or genetic condition (${[...ccsCondNames, ...ccsNeeds].join(', ')}), they are a high-priority screen for CCS specialty care and school-based Medical Therapy Program (MTP) speech/occupational therapies.`;
        recommendation.childProfileTrigger = `Triggers: ${[...ccsCondNames, ...ccsNeeds].join(', ')}`;
        recommendation.whatIsStillUnknown = 'Income verification (waived for school-based MTP, required under $40k for medical specialty referrals).';
        recommendation.whatToDoNext = `Submit a CCS application (DHCS 4480) along with diagnostic audiograms/cardiac records to the local CCS office: ${localCounty?.ccsContact || 'county health'}.`;
        results.highPriority.push(recommendation);
      } else {
        recommendation.whyMatched = 'CCS handles specific physical disabilities, cerebral palsy, cardiac issues, or extreme sensory loss. If your child has complex physical needs, screen here.';
        recommendation.childProfileTrigger = 'No primary physical/sensory trigger';
        results.possible.push(recommendation);
      }
    }

    // --- PROGRAM 6: IEP SPECIAL EDUCATION (3-22) ---
    else if (prog.id === 'iep-special-education') {
      if (ageInYears >= 3 && ageInYears <= 22) {
        const matchedConditions = conditions.filter(c => allConditions.includes(c.id));
        const iepTriggers = [];
        matchedConditions.forEach(c => {
          if (c.categoryMappings?.iepRelevance) {
            iepTriggers.push(c.name);
          }
        });
        if (selectedNeeds.includes('speech-therapy')) iepTriggers.push('speech delay');
        if (selectedNeeds.includes('iep-evaluation')) iepTriggers.push('IEP assessment needs');
        
        if (iepTriggers.length > 0) {
          recommendation.whyMatched = `Because your child is school age (${age.years} years old) and has ${iepTriggers.join(' / ')}, they have a legal right to formal school district special education assessments and an IEP.`;
          recommendation.childProfileTrigger = `Age 3-22, triggers: ${iepTriggers.join(', ')}`;
          recommendation.whatIsStillUnknown = 'Their current school placement and any prior learning logs.';
          recommendation.whatToDoNext = 'Submit a written assessment request letter to the Special Education Director of your school district (see County routing).';
          results.highPriority.push(recommendation);
        } else {
          recommendation.whyMatched = 'Your child is school age. If you observe any speech, reading, behavior, or motor delays, you are likely worth screening for an IEP.';
          recommendation.childProfileTrigger = 'Age 3-22, no explicit school trigger';
          recommendation.whatToDoNext = 'Consult with their classroom teacher. If delays persist, submit a written evaluation request.';
          results.possible.push(recommendation);
        }
      } else if (ageInYears < 3) {
        recommendation.whyMatched = `Not relevant currently because your child is under age 3 (${age.years} years old). They must be served by Early Start first. Transition to IEP begins at age 2.5.`;
        recommendation.childProfileTrigger = 'Age < 3';
        recommendation.whatIsStillUnknown = 'Developmental progress prior to their 3rd birthday.';
        recommendation.whatToDoNext = 'Request that your Early Start coordinator schedule the school transition IEP meeting 90 days before your child turns 3.';
        results.revisitLater.push(recommendation);
      } else {
        recommendation.whyMatched = 'Not relevant because child has graduated or is over 22 years old.';
        recommendation.childProfileTrigger = 'Age > 22';
        results.notRelevant.push(recommendation);
      }
    }

    // --- PROGRAM 7: SSI FOR CHILDREN ---
    else if (prog.id === 'ssi-for-children') {
      const hasMedicallyListed = allConditions.some(cId => cId.includes('down-syndrome'));
      const matchedConditions = conditions.filter(c => allConditions.includes(c.id));
      const hasEligibleCondition = matchedConditions.some(c => c.categoryMappings?.ssiRelevance);
      const condNames = matchedConditions.map(c => c.name);
      
      if (hasMedicallyListed) {
        recommendation.whyMatched = `Because your child has Down Syndrome, they automatically meet the childhood medical listing (110.06) without further testing. If you meet the income requirements, this is a high-priority program.`;
        recommendation.childProfileTrigger = 'Condition: Down Syndrome';
        recommendation.whatIsStillUnknown = 'Household income and liquid asset limits ($2,000/$3,000).';
        recommendation.whatToDoNext = 'Call the SSA at 1-800-772-1213 to schedule a financial intake interview.';
        results.highPriority.push(recommendation);
      } else if (hasEligibleCondition) {
        recommendation.whyMatched = `Because your child has a chronic condition (${condNames.join(', ')}), they may qualify for monthly financial aid if the household meets income/asset tests and has marked functional limitations.`;
        recommendation.childProfileTrigger = `Conditions: ${condNames.join(', ')}`;
        recommendation.whatIsStillUnknown = 'Household wealth and level of childhood developmental severity.';
        recommendation.whatToDoNext = 'Complete the online Child Disability Report (SSA-3820) and review the SSA Deeming Charts.';
        results.possible.push(recommendation);
      } else {
        recommendation.whyMatched = 'SSI provides cash aid for severe childhood disabilities in low-income families. Check financial tables to see if your household qualifies.';
        recommendation.childProfileTrigger = 'No automatic listing condition';
        results.possible.push(recommendation);
      }
    }

    // --- PROGRAM 8: CALABLE ---
    else if (prog.id === 'calable') {
      const matchedConditions = conditions.filter(c => allConditions.includes(c.id));
      const hasEligibleCondition = matchedConditions.some(c => c.categoryMappings?.calAbleRelevance);
      const condNames = matchedConditions.map(c => c.name);
      const isEligible = hasEligibleCondition || selectedNeeds.length > 0;
      if (isEligible) {
        recommendation.whyMatched = 'Because your child has a documented chronic developmental or sensory condition, they are a high-priority match to open a tax-free CalABLE savings account. This lets you save money for therapies, schools, or houses, protecting them from public benefit asset caps.';
        recommendation.childProfileTrigger = `Has conditions/needs: ${[...condNames, ...selectedNeeds].join(', ')}`;
        recommendation.whatIsStillUnknown = 'None. Child qualifies based on age of onset of disability (< 26 years).';
        recommendation.whatToDoNext = 'Visit CalABLE.ca.gov and open a free account online with an initial $25 contribution.';
        results.highPriority.push(recommendation);
      } else {
        recommendation.whyMatched = 'A CalABLE account lets families of children with disabilities save money tax-free. Highly recommended if developmental or physical delays are formally diagnosed.';
        recommendation.childProfileTrigger = 'No formal diagnosis selected yet';
        results.possible.push(recommendation);
      }
    }
  });

  // Compile general application sequence based on priority
  const highPriorityIds = results.highPriority.map(p => p.id);
  const possibleIds = results.possible.map(p => p.id);
  results.applicationSequence = [...highPriorityIds, ...possibleIds];

  // Generate suggested reminders based on age pivots
  if (ageInYears < 3) {
    results.suggestedReminders.push({
      title: 'Initiate Early Start evaluation request',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    // Transition alarm
    const thirdBirthday = new Date(profile.dob);
    thirdBirthday.setFullYear(thirdBirthday.getFullYear() + 3);
    const transitionDate = new Date(thirdBirthday);
    transitionDate.setMonth(transitionDate.getMonth() - 6); // 6 months prior
    results.suggestedReminders.push({
      title: 'Schedule Age 3 transition IEP meeting (90-180 days before 3rd birthday)',
      dueDate: transitionDate.toISOString().split('T')[0]
    });
  } else if (ageInYears >= 3 && ageInYears < 18) {
    results.suggestedReminders.push({
      title: 'Submit school IEP assessment request letter',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    if (ageInYears >= 16) {
      results.suggestedReminders.push({
        title: 'Review Age 18 transition planning (SSI adult redetermination & rights transfer)',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
  }

  // Compile general text rationale
  const summaryProfileStr = `Age: ${age.years}y ${age.months}m, County: ${localCounty?.name || 'California'}, Conditions: ${allConditions.join(', ') || 'None'}, Needs: ${selectedNeeds.join(', ') || 'None'}`;
  results.summaryRationale = `Based on your child's profile (${summaryProfileStr}), the matching engine has scanned 8 core state and federal programs. We identified ${results.highPriority.length} high-priority recommendations and ${results.possible.length} potential programs.`;

  return results;
}
