'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, Copy, Check, Scale, 
  AlertCircle, ShieldCheck, Clock
} from 'lucide-react';
import PrintButton from '@/components/print-button';

type LetterTemplateId = 'iep-request' | 'ihss-appeal' | 'rc-appeal' | 'ssi-reconsideration' | 'epsdt-therapy';

export default function AppealsClient() {
  const [activeTemplate, setActiveTemplate] = useState<LetterTemplateId>('iep-request');
  const [copied, setCopied] = useState(false);
  const [selectedState, setSelectedState] = useState('california');

  // Common Contact States
  const [parentName, setParentName] = useState('Jane Doe');
  const [parentEmail, setParentEmail] = useState('jane.doe@example.com');
  const [parentPhone, setParentPhone] = useState('(310) 555-0199');
  const [parentAddress, setParentAddress] = useState('123 Caregiver Way, Los Angeles, CA 90001');
  const [childName, setChildName] = useState('Alex');
  const [childDob, setChildDob] = useState('2021-04-15');

  // Statutory IEP Submission timeline date
  const [iepSubmissionDate, setIepSubmissionDate] = useState('');

  // Load from local storage on client mount
  useEffect(() => {
    const savedParentName = localStorage.getItem('caregiver_name') || localStorage.getItem('funding_parent_name') || localStorage.getItem('ca_special_needs_safety_parent');
    const savedParentEmail = localStorage.getItem('caregiver_email');
    const savedParentPhone = localStorage.getItem('caregiver_phone') || localStorage.getItem('funding_parent_phone');
    const savedParentAddress = localStorage.getItem('caregiver_address');
    const savedChildName = localStorage.getItem('child_name') || localStorage.getItem('iep_student_name') || localStorage.getItem('funding_child_name') || localStorage.getItem('ca_special_needs_safety_child');
    const savedChildDob = localStorage.getItem('child_dob') || localStorage.getItem('funding_child_dob');
    const savedState = localStorage.getItem('selected_state');

    const timer = setTimeout(() => {
      setIepSubmissionDate(new Date().toISOString().split('T')[0]);
      if (savedParentName) setParentName(savedParentName);
      if (savedParentEmail) setParentEmail(savedParentEmail);
      if (savedParentPhone) setParentPhone(savedParentPhone);
      if (savedParentAddress) setParentAddress(savedParentAddress);
      if (savedChildName) setChildName(savedChildName);
      if (savedChildDob) setChildDob(savedChildDob);
      if (savedState) setSelectedState(savedState);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Update helpers that persist to localStorage
  const updateSelectedState = (val: string) => {
    setSelectedState(val);
    localStorage.setItem('selected_state', val);
  };

  const updateParentName = (val: string) => {
    setParentName(val);
    localStorage.setItem('caregiver_name', val);
    localStorage.setItem('funding_parent_name', val);
    localStorage.setItem('ca_special_needs_safety_parent', val);
  };

  const updateParentEmail = (val: string) => {
    setParentEmail(val);
    localStorage.setItem('caregiver_email', val);
  };

  const updateParentPhone = (val: string) => {
    setParentPhone(val);
    localStorage.setItem('caregiver_phone', val);
    localStorage.setItem('funding_parent_phone', val);
  };

  const updateParentAddress = (val: string) => {
    setParentAddress(val);
    localStorage.setItem('caregiver_address', val);
  };

  const updateChildName = (val: string) => {
    setChildName(val);
    localStorage.setItem('child_name', val);
    localStorage.setItem('iep_student_name', val);
    localStorage.setItem('funding_child_name', val);
    localStorage.setItem('ca_special_needs_safety_child', val);
  };

  const updateChildDob = (val: string) => {
    setChildDob(val);
    localStorage.setItem('child_dob', val);
    localStorage.setItem('funding_child_dob', val);
  };

  const calculateDateOffset = (baseDateStr: string, offsetDays: number) => {
    if (!baseDateStr) return 'N/A';
    try {
      const date = new Date(baseDateStr + 'T00:00:00');
      date.setDate(date.getDate() + offsetDays);
      return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // IEP States
  const [schoolDistrict, setSchoolDistrict] = useState('Los Angeles Unified School District (LAUSD)');
  const [schoolName, setSchoolName] = useState('Sunshine Elementary School');
  const [iepConcerns, setIepConcerns] = useState({
    speech: true,
    sensory: true,
    academic: false,
    fineMotor: true,
    social: true,
    behavioral: false,
  });
  const [customIepText, setCustomIepText] = useState('Alex struggles to communicate wants and needs, exhibits sensory overload in loud classrooms, and cannot hold pencils without modifications.');

  // IHSS Appeal States
  const [ihssCounty, setIhssCounty] = useState('Los Angeles');
  const [ihssDenialDate, setIhssDenialDate] = useState('2026-05-15');
  const [ihssSafetyConcerns, setIhssSafetyConcerns] = useState({
    elopement: true,
    pica: false,
    selfInjury: true,
    climbing: true,
    electricalSafety: false
  });
  const [customIhssText, setCustomIhssText] = useState('Alex elopes out of doors and into high-risk traffic zones, head-bangs when overwhelmed, and attempts to climb furniture without any awareness of hazard, requiring constant 24/7 oversight.');

  // Regional Center Appeal States
  const [regionalCenterName, setRegionalCenterName] = useState('Frank D. Lanterman Regional Center');
  const [rcDenialDate, setRcDenialDate] = useState('2026-05-20');
  const [rcDiagnosis, setRcDiagnosis] = useState('Autism Spectrum Disorder (Level 3)');
  const [rcLimitations, setRcLimitations] = useState({
    receptiveLanguage: true,
    expressiveLanguage: true,
    learning: true,
    mobility: false,
    selfCare: true,
    selfDirection: true,
  });
  const [customRcText, setCustomRcText] = useState('Alex is non-verbal, cannot perform independent self-care (bathing/feeding), and lacks the self-direction necessary to navigate basic environments safely, satisfying four of the Lanterman Act core limitations.');

  // SSI Reconsideration States
  const [ssiDate, setSsiDate] = useState('2026-05-10');
  const [ssiDiagnosis, setSsiDiagnosis] = useState('Autism Spectrum Disorder & Speech Apraxia');
  const [ssiClinicInfo, setSsiClinicInfo] = useState('Children\'s Hospital Los Angeles (CHLA) - Developmental Pediatrics Division');
  const [customSsiText, setCustomSsiText] = useState('Alex meets Childhood Listing 112.10 (Autism spectrum disorder) and exhibits marked limitations in communication (social interaction) and self-regulation (severe emotional dysregulation).');

  // Therapy Appeal States
  const [therapyType, setTherapyType] = useState('Speech-Language Therapy');
  const [denialReason, setDenialReason] = useState('Excludes developmental delays / Not rehabilitative');
  const [insurancePlanName, setInsurancePlanName] = useState('L.A. Care Medi-Cal Managed Care Plan');
  const [prescribingDoctor, setPrescribingDoctor] = useState('Dr. Robert Chen, Pediatric Neurologist');
  const [customTherapyText, setCustomTherapyText] = useState('Alex has expressive-receptive language delay and verbal apraxia. He requires 2 sessions per week of clinical Speech Therapy to develop functional communication, utilizing alternative and augmentative communication (AAC) devices.');

  // Trigger temporary copied state
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pre-calculate Child Age in Years
  const getChildAge = () => {
    if (!childDob) return 0;
    const today = new Date();
    const dob = new Date(childDob);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };
  // State-specific tab labels and badges
  const getIepTabDetails = () => {
    switch (selectedState) {
      case 'texas': return { label: 'IEP Evaluation Request', badge: '19 TAC' };
      case 'florida': return { label: 'IEP Evaluation Request', badge: 'F.A.C.' };
      case 'new-york': return { label: 'IEP Evaluation Request', badge: '8 NYCRR' };
      case 'pennsylvania': return { label: 'IEP Evaluation Request', badge: '22 Pa. Code' };
      case 'california':
      default: return { label: 'IEP Evaluation Request', badge: 'Ed Code' };
    }
  };

  const getIhssTabDetails = () => {
    switch (selectedState) {
      case 'texas': return { label: 'MDCP / PCS Appeal', badge: '1 TAC § 357' };
      case 'florida': return { label: 'Personal Care Appeal', badge: 'F.A.C.' };
      case 'new-york': return { label: 'CDPAP Personal Care Appeal', badge: '18 NYCRR' };
      case 'pennsylvania': return { label: 'DHS Personal Care Appeal', badge: '55 Pa. Code' };
      case 'california':
      default: return { label: 'IHSS Denial Appeal', badge: 'W&I Code' };
    }
  };

  const getRcTabDetails = () => {
    switch (selectedState) {
      case 'texas': return { label: 'LIDDA Services Appeal', badge: 'LIDDA' };
      case 'florida': return { label: 'APD iBudget Appeal', badge: 'APD' };
      case 'new-york': return { label: 'OPWDD Denial Appeal', badge: 'OPWDD' };
      case 'pennsylvania': return { label: 'ODP Waiver Appeal', badge: 'ODP' };
      case 'california':
      default: return { label: 'Regional Center Denial', badge: 'Lanterman' };
    }
  };

  // Compile letter draft dynamically
  const compileLetterText = (): string => {
    const todayStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    switch (activeTemplate) {
      case 'iep-request': {
        const concernsList: string[] = [];
        if (iepConcerns.speech) concernsList.push('Speech/Language development and expressive communication delays');
        if (iepConcerns.sensory) concernsList.push('Sensory integration and processing disorders');
        if (iepConcerns.academic) concernsList.push('Significant learning difficulties and pre-academic struggles');
        if (iepConcerns.fineMotor) concernsList.push('Fine/gross motor skill delays and occupational support needs');
        if (iepConcerns.social) concernsList.push('Social communication and peer interaction barriers');
        if (iepConcerns.behavioral) concernsList.push('Behavioral struggles and emotional regulation difficulties');

        let legalCitation = 'Individuals with Disabilities Education Act (IDEA) and California Education Code';
        let timelineRef = 'In accordance with California Education Code Section 56321, please provide me with an Assessment Plan within the legally mandated 15-day timeline from receipt of this request.';
        let meetingRef = 'schedule the initial IEP meeting within the 60-day calendar limit (California Education Code § 56344)';

        if (selectedState === 'texas') {
          legalCitation = 'Individuals with Disabilities Education Act (IDEA) and Texas Education Code / 19 TAC § 89.1011';
          timelineRef = 'In accordance with 19 Texas Administrative Code § 89.1011, please provide me with an Assessment Plan and Notice of Proposal to Evaluate within the legally mandated 15 school days from receipt of this request.';
          meetingRef = 'schedule the Admission, Review, and Dismissal (ARD) meeting within 45 school days to complete the evaluation and 30 calendar days to collaborate on the program (19 TAC § 89.1011)';
        } else if (selectedState === 'florida') {
          legalCitation = 'Individuals with Disabilities Education Act (IDEA) and Florida State Board of Education Rules / Rule 6A-6.03311';
          timelineRef = 'In accordance with Florida Administrative Code Rule 6A-6.03311, please provide me with a consent for evaluation and notice of proposal within 30 days of this request.';
          meetingRef = 'schedule the eligibility and IEP meeting within the 60 school days limit for evaluation and 30 calendar days for IEP placement (F.A.C. Rule 6A-6.03028)';
        } else if (selectedState === 'new-york') {
          legalCitation = 'Individuals with Disabilities Education Act (IDEA) and New York State Regulations / 8 NYCRR § 200.5';
          timelineRef = 'In accordance with 8 NYCRR § 200.5, please provide me with a consent for evaluation and referral receipt within 10 school days.';
          meetingRef = 'schedule the initial Committee on Special Education (CSE) meeting and place the student within the 60 calendar days limit (8 NYCRR § 200.4)';
        } else if (selectedState === 'pennsylvania') {
          legalCitation = 'Individuals with Disabilities Education Act (IDEA) and Pennsylvania Code / 22 Pa. Code § 14.162';
          timelineRef = 'In accordance with 22 Pa. Code § 14.123, please provide me with a Permission to Evaluate (PTE) form within 10 calendar days of this request.';
          meetingRef = 'schedule the IEP team meeting within 60 calendar days from receipt of signed consent to complete the evaluation and 30 calendar days to write the IEP (22 Pa. Code § 14.131)';
        } else if (selectedState !== 'california') {
          legalCitation = 'Individuals with Disabilities Education Act (IDEA) and state educational guidelines';
          timelineRef = 'In accordance with federal regulations under 34 CFR § 300.301, please provide me with a response and evaluation consent form in a timely manner.';
          meetingRef = 'schedule the evaluation and IEP team meeting within the standard 60-day federal timeline (34 CFR § 300.301)';
        }

        return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

To:
Director of Special Education / IEP Intake Department
${schoolDistrict}
Re: Written Request for Initial Special Education Assessment
Child Name: ${childName}
Child Date of Birth: ${childDob} (Age: ${getChildAge()})
School: ${schoolName}

Dear Director of Special Education and IEP Team,

I am writing as the parent/caregiver of ${childName} to formally request a comprehensive educational assessment to determine educational eligibility for special education and related services under the ${legalCitation}. 

I suspect ${childName} has a disability that is negatively impacting their ability to access the general education curriculum. Specifically, ${childName} is exhibiting significant challenges in the following areas:
${concernsList.map(c => `- ${c}`).join('\n')}

Supporting details regarding my child's observed challenges:
${customIepText}

${timelineRef} I request that the assessment cover all areas of suspected disability, which may include Psychoeducational (Cognitive/Academic), Speech and Language, Occupational Therapy (OT/Fine Motor), Physical Therapy (PT/Gross Motor), and Functional Behavior (FBA) assessments.

I look forward to cooperating with the school team. Please contact me as soon as possible to arrange the consent forms so that we can ${meetingRef} to collaborate on an educational program that matches ${childName}'s needs.

Sincerely,

[Signature]

${parentName}`;
      }

      case 'ihss-appeal': {
        const safetyList: string[] = [];
        if (ihssSafetyConcerns.elopement) safetyList.push('Severe elopement/wandering behaviors (running away into dangerous traffic zones, lakes, or woods)');
        if (ihssSafetyConcerns.pica) safetyList.push('Pica (ingesting dangerous non-food objects like soil, gravel, plastics, or coins)');
        if (ihssSafetyConcerns.selfInjury) safetyList.push('Self-injurious behaviors (head-banging, scratching, wrist-biting, or skin-picking)');
        if (ihssSafetyConcerns.climbing) safetyList.push('High-risk climbing behavior (scaling shelves, doors, or counters without safety awareness)');
        if (ihssSafetyConcerns.electricalSafety) safetyList.push('Severe lack of safety awareness around electrical outlets, open flames, or kitchen appliances');

        let targetAddress = `State Hearings Division
California Department of Social Services
744 P Street, M.S. 21-97
Sacramento, CA 95814`;
        let programName = 'In-Home Supportive Services (IHSS)';
        let legalRef = 'Welfare and Institutions Code Section 12300 and California Department of Social Services Manual of Policies and Procedures (MPP) Section 30-757.17';
        let detailSentence = 'my child qualifies for Protective Supervision due to severe mental impairment and a complete lack of safety awareness.';
        let evidenceRef = 'MPP 30-757 protective criteria';

        if (selectedState === 'texas') {
          targetAddress = `Texas Health and Human Services Commission
Appeals Division, Mail Code 120-3
P.O. Box 149030
Austin, TX 78714`;
          programName = 'Medically Dependent Children Program (MDCP) / Personal Care Services (PCS)';
          legalRef = '1 Texas Administrative Code § 357 (Texas Fair Hearing Procedures) and Texas Medicaid guidelines';
          detailSentence = 'my child qualifies for enhanced personal care hours and safety monitoring due to severe cognitive/behavioral limitations and developmental delays.';
          evidenceRef = 'Texas Medicaid Personal Care Services medical necessity guidelines';
        } else if (selectedState === 'florida') {
          targetAddress = `Agency for Health Care Administration
Medicaid Fair Hearings Unit
P.O. Box 14247
Tallahassee, FL 32317`;
          programName = 'Medicaid Personal Care / iBudget Waiver Services';
          legalRef = 'Florida Administrative Code Rule 59G-1.100 and Florida Statutes Chapter 409';
          detailSentence = 'my child qualifies for personal care assistance and safety supervision due to severe functional limitations and developmental safety risks.';
          evidenceRef = 'Florida Medicaid pediatric personal care criteria';
        } else if (selectedState === 'new-york') {
          targetAddress = `New York State Office of Temporary and Disability Assistance
Office of Administrative Hearings
P.O. Box 1930
Albany, NY 12201`;
          programName = 'Consumer Directed Personal Assistance Program (CDPAP) / Personal Care Services';
          legalRef = '18 New York Codes, Rules and Regulations (NYCRR) § 358-3.5 and Social Services Law § 365-a';
          detailSentence = 'my child qualifies for continuous safety supervision and personal care support due to severe intellectual/developmental deficits and elopement risks.';
          evidenceRef = 'NYS CDPAP medical necessity and safety supervision rules';
        } else if (selectedState === 'pennsylvania') {
          targetAddress = `Department of Human Services
Bureau of Hearings and Appeals
P.O. Box 2675
Harrisburg, PA 17105`;
          programName = 'ODP Waiver Personal Care / DHS Personal Care Services';
          legalRef = '55 Pennsylvania Code Chapter 275 and Pennsylvania Medical Assistance guidelines';
          detailSentence = 'my child qualifies for personal care support and safety monitoring due to severe developmental impairments and lack of safety awareness.';
          evidenceRef = 'PA DHS Medical Assistance personal care assessment guidelines';
        } else if (selectedState !== 'california') {
          targetAddress = `State Medicaid Appeals Division
Health and Human Services Agency`;
          programName = 'Medicaid Personal Care Services (PCS)';
          legalRef = '42 Code of Federal Regulations (CFR) § 431.220 and State Medicaid Fair Hearing rules';
          detailSentence = 'my child qualifies for personal care assistance and safety supervision due to severe functional limitations and lack of safety awareness.';
          evidenceRef = 'State Medicaid personal care necessity criteria';
        }

        return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

To:
${targetAddress}

Re: Request for Fair Hearing / Appeal of ${programName} Notice of Action
Recipient: ${childName}
Date of Birth: ${childDob} (Age: ${getChildAge()})
County: ${ihssCounty}
Date of Denial/Reduction Notice: ${ihssDenialDate}

To Whom It May Concern,

I am writing to formally request a Fair Hearing to appeal the Notice of Action dated ${ihssDenialDate} regarding ${programName} benefits for my minor child, ${childName}. The program has denied or reduced hours for my child under the category of personal care, respite, or safety/protective supervision.

I dispute this determination. Under ${legalRef}, ${detailSentence}

${childName} exhibits dangerous behaviors that require active safety monitoring to prevent severe self-harm or accidental injury. Specifically, these behaviors include:
${safetyList.map(s => `- ${s}`).join('\n')}

Clinical details of safety hazards and oversight demands:
${customIhssText}

Contrary to the caseworker's assessment, my child's behaviors are not simple tantrums, nor is this standard supervision typical of a child of this age. My child's developmental and cognitive delays prevent them from recognizing hazard. Without constant protective monitoring, my child is at critical risk of injury. 

I request a fair hearing to present medical records, school logs, and a daily safety behavior log confirming that my child meets ${evidenceRef}. Please schedule this appeal and notify me of the date and location.

Sincerely,

[Signature]

${parentName}`;
      }

      case 'rc-appeal': {
        const limitsList: string[] = [];
        if (rcLimitations.receptiveLanguage) limitsList.push('Receptive Language: Child struggles to understand basic verbal instructions or warnings.');
        if (rcLimitations.expressiveLanguage) limitsList.push('Expressive Language: Child has severe verbal communication deficits or is fully non-verbal.');
        if (rcLimitations.learning) limitsList.push('Learning: Child has severe cognitive delays and educational barriers.');
        if (rcLimitations.mobility) limitsList.push('Mobility: Child has developmental motor planning and physical barriers.');
        if (rcLimitations.selfCare) limitsList.push('Self-Care: Child requires assistance for basic ADLs (feeding, toileting, dressing) far beyond peer averages.');
        if (rcLimitations.selfDirection) limitsList.push('Self-Direction: Child cannot navigate safety parameters, has wandering behaviors, and lacks safety boundaries.');

        let programName = 'Regional Center';
        let legalAct = 'Lanterman Developmental Disabilities Services Act';
        let legalRef = 'California Welfare and Institutions Code Section 4512';
        let limitationCitation = 'Welfare and Institutions Code § 4512(l), a substantial disability is defined as significant functional limitations in three or more areas';
        let targetRef = 'Intake Appeal Coordinator\n' + regionalCenterName;
        let timelineRef = 'Lanterman Act rules, I submit this appeal within the statutory 30-day window';

        if (selectedState === 'texas') {
          programName = 'Local Intellectual and Developmental Disability Authority (LIDDA) / HCS Waiver';
          legalAct = 'Texas Health and Safety Code Chapter 533A';
          legalRef = 'Texas Administrative Code Title 26 Chapter 563';
          limitationCitation = 'state criteria, eligibility requires a documented diagnosis of intellectual disability or a qualifying related condition with substantial functional limitations';
          targetRef = 'Intake Appeal Committee\n' + regionalCenterName;
          timelineRef = 'Texas HHS regulations, I submit this appeal within the statutory 90-day window';
        } else if (selectedState === 'florida') {
          programName = 'Agency for Persons with Disabilities (APD) / iBudget';
          legalAct = 'Florida Statutes Chapter 393';
          legalRef = 'Florida Statutes Section 393.065 and Florida Administrative Code Rule 65G-4';
          limitationCitation = 'Florida Statutes § 393.063, a developmental disability constitutes a substantial handicap in three or more major life activities';
          targetRef = 'APD Regional Intake Coordinator\n' + regionalCenterName;
          timelineRef = 'Florida Statutes § 393.125, I submit this appeal within the statutory 30-day window';
        } else if (selectedState === 'new-york') {
          programName = 'Office for People With Developmental Disabilities (OPWDD)';
          legalAct = 'New York Mental Hygiene Law';
          legalRef = 'New York Mental Hygiene Law Section 13.07 and 14 NYCRR Section 602';
          limitationCitation = 'Mental Hygiene Law § 1.03(22), a developmental disability is a substantial handicap to the individual\'s ability to function normally in society';
          targetRef = 'OPWDD DDRO Eligibility Coordinator\n' + regionalCenterName;
          timelineRef = 'OPWDD regulations, I submit this appeal within the statutory 30-day window';
        } else if (selectedState === 'pennsylvania') {
          programName = 'Office of Developmental Programs (ODP) / County Administrative Entity';
          legalAct = 'Pennsylvania Mental Health and Intellectual Disability Act of 1966';
          legalRef = '55 Pennsylvania Code Chapter 275 and ODP guidelines';
          limitationCitation = 'state rules, eligibility requires a diagnosis of intellectual disability or a developmental disability with substantial functional limitations in three or more life domains';
          targetRef = 'County Administrative Entity Appeals Office\n' + regionalCenterName;
          timelineRef = '55 Pa. Code § 275.4, I submit this appeal within the statutory 30-day window';
        } else if (selectedState !== 'california') {
          programName = 'State Developmental Services Agency';
          legalAct = 'State Developmental Disabilities Services Act';
          legalRef = 'State Administrative Code';
          limitationCitation = 'state regulations, eligibility requires substantial functional limitations in major life activities due to a developmental delay or intellectual disability';
          targetRef = 'Intake Appeal Coordinator\n' + regionalCenterName;
          timelineRef = 'state administrative rules, I submit this appeal within the statutory 30-day window';
        }

        return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

To:
${targetRef}

Re: Formal Appeal of ${programName} Eligibility Denial
Child Name: ${childName}
Date of Birth: ${childDob} (Age: ${getChildAge()})
Date of Denial Notice: ${rcDenialDate}

Dear Appeal Coordinator,

I am writing to formally appeal the determination of eligibility denial dated ${rcDenialDate} regarding my child, ${childName}, under the ${legalAct}. The agency has determined that my child does not qualify as developmentally disabled.

I dispute this finding. My child has a diagnosed condition of ${rcDiagnosis}, which constitutes a developmental disability under ${legalRef}. This condition originated before the age of 18, is expected to continue indefinitely, and constitutes a substantial disability.

Under ${limitationCitation}. ${childName} exhibits severe functional limitations in the following domains:
${limitsList.map(l => `- ${l}`).join('\n')}

Supporting details regarding my child's developmental limitations:
${customRcText}

I request an informal meeting with the intake director, and if necessary, a formal Fair Hearing to present diagnostic records, psychological evaluations, and school IEP reports confirming my child's eligibility. 

Under ${timelineRef} from the receipt of the denial notice. Please schedule an appeal review and contact me to arrange an informal conference.

Sincerely,

[Signature]

${parentName}`;
      }

      case 'ssi-reconsideration': {
        let stateDdsAddress = `Social Security Administration / Disability Determination Services
[Insert Local SSA Office Address here]`;
        
        if (selectedState === 'california') {
          stateDdsAddress = `Social Security Administration
California Disability Determination Services Division
P.O. Box 989045
West Sacramento, CA 95798`;
        } else if (selectedState === 'texas') {
          stateDdsAddress = `Social Security Administration
Texas Disability Determination Services
P.O. Box 149141
Austin, TX 78714`;
        } else if (selectedState === 'florida') {
          stateDdsAddress = `Social Security Administration
Florida Division of Disability Determinations
P.O. Box 1180
Tallahassee, FL 32302`;
        } else if (selectedState === 'new-york') {
          stateDdsAddress = `Social Security Administration
New York Division of Disability Determinations
P.O. Box 3845
Albany, NY 12203`;
        } else if (selectedState === 'pennsylvania') {
          stateDdsAddress = `Social Security Administration
Pennsylvania Bureau of Disability Determination
P.O. Box 9000
Harrisburg, PA 17108`;
        }

        return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

To:
${stateDdsAddress}

Re: Written Request for Reconsideration of Childhood Disability Denial
Claimant Name: ${childName}
Claimant Date of Birth: ${childDob} (Age: ${getChildAge()})
Claimant SSN: [Insert Child's SSN here]
Date of denial notice: ${ssiDate}

To Whom It May Concern,

I am writing to request a Reconsideration of the disability denial notice dated ${ssiDate} regarding Supplemental Security Income (SSI) childhood disability benefits for my child, ${childName}.

I dispute the Social Security Administration's finding that my child's impairment does not meet, medically equal, or functionally equal the listings in the Listing of Impairments. My child has a severe clinical diagnosis of: ${ssiDiagnosis}.

This impairment causes marked and severe functional limitations. Specifically, my child exhibits extreme difficulties in social-emotional functioning, communication, and self-care, satisfying the requirements of SSA Childhood Disability Listings (e.g. Listing 112.10 for Autism Spectrum Disorder).

Clinical descriptions and treating specialist evaluations:
${customSsiText}
Treating Clinical Location: ${ssiClinicInfo}

I submit that the original evaluation failed to consider the full extent of my child's behavioral outbursts, educational speech therapist reports, and daily care interruptions. I request a review of all clinical evidence, including the new evaluations and IEP reports which I have enclosed with this request.

Please review this claim and contact me if any further consultative medical examinations are required.

Sincerely,

[Signature]

${parentName}`;
      }

      case 'epsdt-therapy': {
        let legalRef = 'Under California Title 22 Code of Regulations Section 51340, services must be authorized if they are necessary to correct or "ameliorate" a developmental condition. Ameliorate includes maintaining the child\'s level of functioning or preventing deterioration.';
        let stateMandateRef = 'California Title 22 state law and federal Medicaid EPSDT mandates';
        let ruleTimeRef = 'Under California health plan rules, I request that this grievance be processed on an expedited basis as the ongoing delay in development constitutes a risk of permanent functional loss.';

        if (selectedState === 'texas') {
          legalRef = 'Under 1 Texas Administrative Code § 354.1131, Texas Medicaid covers early and periodic screening, diagnosis, and treatment (EPSDT) services, including all medically necessary physical, occupational, and speech therapies needed to correct or ameliorate a physical or mental condition.';
          stateMandateRef = 'Texas Administrative Code Title 1 and federal Medicaid EPSDT mandates';
          ruleTimeRef = 'Under Texas Medicaid guidelines, I request an expedited review of this appeal as my child\'s developmental window represents an urgent need.';
        } else if (selectedState === 'florida') {
          legalRef = 'Under Florida Administrative Code Rule 59G-1.100 and Agency for Health Care Administration (AHCA) guidelines, Florida Medicaid requires coverage of all medically necessary developmental therapies to correct or ameliorate defects, illnesses, or conditions.';
          stateMandateRef = 'Florida Administrative Code and federal Medicaid EPSDT mandates';
          ruleTimeRef = 'Under Florida Medicaid managed care guidelines, I request that this appeal be expedited to prevent clinical regression.';
        } else if (selectedState === 'new-york') {
          legalRef = 'Under New York Social Services Law § 365-a and 18 NYCRR § 360-4.8, New York Medicaid Managed Care plans must cover all therapies necessary under EPSDT to correct or ameliorate developmental conditions.';
          stateMandateRef = 'NYS Social Services regulations and federal Medicaid EPSDT mandates';
          ruleTimeRef = 'Under NYS health plan rules, I request an expedited fair hearing review to prevent functional deterioration.';
        } else if (selectedState === 'pennsylvania') {
          legalRef = 'Under 55 Pennsylvania Code Chapter 1101 and DHS guidelines, Medical Assistance plans must cover physical, occupational, and speech therapies under EPSDT that correct or ameliorate a developmental or physical condition.';
          stateMandateRef = 'Pennsylvania Code Title 55 and federal Medicaid EPSDT mandates';
          ruleTimeRef = 'Under Pennsylvania DHS guidelines, I request that this grievance be processed on an expedited basis.';
        } else if (selectedState !== 'california') {
          legalRef = 'Under Federal Medicaid mandates, states are required to cover all treatment services necessary to correct or ameliorate physical or mental defects, illnesses, or conditions identified during an EPSDT screening.';
          stateMandateRef = 'State Medicaid regulations and federal Medicaid EPSDT mandates';
          ruleTimeRef = 'Under state and federal guidelines, I request that this appeal be handled on an expedited basis to prevent regression.';
        }

        return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

To:
Appeals and Grievance Department
${insurancePlanName}

Re: Expedited Appeal of Therapy Authorization Denial / Mandate under EPSDT
Member Name: ${childName}
Member Date of Birth: ${childDob} (Age: ${getChildAge()})
Member ID: [Insert Member ID]
Service Denied: ${therapyType}
Reason for Denial: ${denialReason}

To Whom It May Concern,

I am writing to formally appeal the denial of coverage for ${therapyType} recommended for my child, ${childName}, by their treating clinician, ${prescribingDoctor}. The plan has denied coverage citing: "${denialReason}".

I dispute this denial under federal Medicaid EPSDT mandates and ${stateMandateRef}. Specifically, under 42 U.S.C. Section 1396d(r)(5), the federal Medicaid program requires states to provide "early and periodic screening, diagnostic, and treatment services" (EPSDT) to determine physical or mental illnesses or conditions, and provide "necessary health care, diagnostic services, treatment, and other measures... to correct or ameliorate defects and physical and mental illnesses and conditions."

${legalRef}

Denying clinical therapy on the grounds that it is "not rehabilitative" or that it "excludes developmental conditions" is a direct violation of the EPSDT federal mandate. My child requires this therapy as specified below:

${customTherapyText}

I have enclosed a letter of medical necessity from ${prescribingDoctor} confirming that these services are medically necessary. I request that ${insurancePlanName} immediately overturn this denial and authorize the requested sessions.

${ruleTimeRef}

Sincerely,

[Signature]

${parentName}`;
      }

      default:
        return '';
    }
  };

  const letterText = compileLetterText();

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '5rem', maxWidth: '1150px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <Scale size={48} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
        <h1>{selectedState === 'california' ? 'California' : selectedState === 'texas' ? 'Texas' : selectedState === 'florida' ? 'Florida' : selectedState === 'new-york' ? 'New York' : selectedState === 'pennsylvania' ? 'Pennsylvania' : 'State-Specific'} Special Needs Appeals & Letter Builder</h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', color: 'var(--text-light)' }}>
          Create legally grounded appeal letters and formal request letters citing {selectedState === 'california' ? 'California' : selectedState === 'texas' ? 'Texas' : selectedState === 'florida' ? 'Florida' : selectedState === 'new-york' ? 'New York' : selectedState === 'pennsylvania' ? 'Pennsylvania' : 'state'} codes. Select a template and customize the details to download or print.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        
        {/* Template Selector & Settings Sidebar */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="grid-col-lg-4">
          
          {/* Template Tabs */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={16} color="var(--primary-color)" /> Select Letter Template
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveTemplate('iep-request')}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  background: activeTemplate === 'iep-request' ? 'var(--primary-color)' : 'white',
                  color: activeTemplate === 'iep-request' ? 'white' : 'var(--text-main)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{getIepTabDetails().label}</span>
                <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: activeTemplate === 'iep-request' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.04)', color: activeTemplate === 'iep-request' ? 'white' : 'var(--text-light)' }}>{getIepTabDetails().badge}</span>
              </button>

              <button
                onClick={() => setActiveTemplate('ihss-appeal')}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  background: activeTemplate === 'ihss-appeal' ? 'var(--primary-color)' : 'white',
                  color: activeTemplate === 'ihss-appeal' ? 'white' : 'var(--text-main)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{getIhssTabDetails().label}</span>
                <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: activeTemplate === 'ihss-appeal' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.04)', color: activeTemplate === 'ihss-appeal' ? 'white' : 'var(--text-light)' }}>{getIhssTabDetails().badge}</span>
              </button>

              <button
                onClick={() => setActiveTemplate('rc-appeal')}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  background: activeTemplate === 'rc-appeal' ? 'var(--primary-color)' : 'white',
                  color: activeTemplate === 'rc-appeal' ? 'white' : 'var(--text-main)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{getRcTabDetails().label}</span>
                <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: activeTemplate === 'rc-appeal' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.04)', color: activeTemplate === 'rc-appeal' ? 'white' : 'var(--text-light)' }}>{getRcTabDetails().badge}</span>
              </button>

              <button
                onClick={() => setActiveTemplate('ssi-reconsideration')}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  background: activeTemplate === 'ssi-reconsideration' ? 'var(--primary-color)' : 'white',
                  color: activeTemplate === 'ssi-reconsideration' ? 'white' : 'var(--text-main)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>SSI Reconsideration</span>
                <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: activeTemplate === 'ssi-reconsideration' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.04)', color: activeTemplate === 'ssi-reconsideration' ? 'white' : 'var(--text-light)' }}>SSA</span>
              </button>

              <button
                onClick={() => setActiveTemplate('epsdt-therapy')}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  background: activeTemplate === 'epsdt-therapy' ? 'var(--primary-color)' : 'white',
                  color: activeTemplate === 'epsdt-therapy' ? 'white' : 'var(--text-main)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>Therapy Authorization</span>
                <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: activeTemplate === 'epsdt-therapy' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.04)', color: activeTemplate === 'epsdt-therapy' ? 'white' : 'var(--text-light)' }}>EPSDT</span>
              </button>
            </div>
          </div>

          {/* Form Settings */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
              Personal Details
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>State Jurisdiction</label>
                <select 
                  value={selectedState} 
                  onChange={(e) => updateSelectedState(e.target.value)} 
                  style={{ 
                    padding: '0.5rem 0.75rem', 
                    fontSize: '0.85rem',
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.12)',
                    background: 'white',
                    color: 'var(--text-main)',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  <option value="california">California</option>
                  <option value="texas">Texas</option>
                  <option value="florida">Florida</option>
                  <option value="new-york">New York</option>
                  <option value="pennsylvania">Pennsylvania</option>
                  <option value="other">Other State / General</option>
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Parent/Caregiver Name</label>
                <input 
                  type="text" 
                  value={parentName} 
                  onChange={(e) => updateParentName(e.target.value)} 
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Parent Address</label>
                <input 
                  type="text" 
                  value={parentAddress} 
                  onChange={(e) => updateParentAddress(e.target.value)} 
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Parent Phone</label>
                <input 
                  type="text" 
                  value={parentPhone} 
                  onChange={(e) => updateParentPhone(e.target.value)} 
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Parent Email</label>
                <input 
                  type="text" 
                  value={parentEmail} 
                  onChange={(e) => updateParentEmail(e.target.value)} 
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Child&apos;s Name</label>
                <input 
                  type="text" 
                  value={childName} 
                  onChange={(e) => updateChildName(e.target.value)} 
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Child&apos;s Date of Birth</label>
                <input 
                  type="date" 
                  value={childDob} 
                  onChange={(e) => updateChildDob(e.target.value)} 
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Template Customizer Panel */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="grid-col-lg-8">
          
          {/* Custom Form Fields for selected template */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            
            {/* A. IEP assessment settings */}
            {activeTemplate === 'iep-request' && (
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>IEP Assessment Parameters</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                  Specify district parameters and checking specific delay categories to cite in the assessment plan request.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>School District Name</label>
                    <input 
                      type="text" 
                      value={schoolDistrict} 
                      onChange={(e) => setSchoolDistrict(e.target.value)} 
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>School Name</label>
                    <input 
                      type="text" 
                      value={schoolName} 
                      onChange={(e) => setSchoolName(e.target.value)} 
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Areas of suspected delay:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {Object.keys(iepConcerns).map((key) => (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox"
                          checked={iepConcerns[key as keyof typeof iepConcerns]}
                          onChange={(e) => setIepConcerns(prev => ({ ...prev, [key]: e.target.checked }))}
                        />
                        <span style={{ textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1')} Concerns
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.85rem' }}>Observed challenges (Specific Details)</label>
                  <textarea 
                    value={customIepText}
                    onChange={(e) => setCustomIepText(e.target.value)}
                    style={{ width: '100%', minHeight: '80px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
                  />
                </div>

                {/* Interactive Statutory IEP Timeline Calculator */}
                {(() => {
                  const timelines = (() => {
                    switch (selectedState) {
                      case 'texas':
                        return {
                          title: 'Statutory Texas ARD/IEP Timelines',
                          desc: 'Texas defines timelines based on school days and calendar days.',
                          cite: 'Cites 19 Texas Administrative Code § 89.1011',
                          milestones: [
                            { label: '1. Notice of Evaluation Proposed (15 School Days):', offset: 21, color: 'var(--primary-color)' },
                            { label: '2. Complete Evaluation Report (45 School Days):', offset: 84, color: 'inherit' },
                            { label: '3. Collaborate & Hold ARD Meeting (30 Days):', offset: 114, color: '#10b981' }
                          ]
                        };
                      case 'florida':
                        return {
                          title: 'Statutory Florida IEP Timelines',
                          desc: 'Florida enforces strict evaluation and placement timelines.',
                          cite: 'Cites F.A.C. Rules 6A-6.03311 & 6A-6.03028',
                          milestones: [
                            { label: '1. Notice & Consent Form Sent (30 Days):', offset: 30, color: 'var(--primary-color)' },
                            { label: '2. Evaluation Completed (60 School Days):', offset: 114, color: 'inherit' },
                            { label: '3. Placement & IEP Meeting (30 Days):', offset: 144, color: '#10b981' }
                          ]
                        };
                      case 'new-york':
                        return {
                          title: 'Statutory New York IEP Timelines',
                          desc: 'New York defines calendar day limits from consent to placement.',
                          cite: 'Cites 8 NYCRR §§ 200.4 & 200.5',
                          milestones: [
                            { label: '1. Referral Receipt / Consent Form (10 School Days):', offset: 14, color: 'var(--primary-color)' },
                            { label: '2. Initial CSE Meeting & Placement (60 Days):', offset: 74, color: '#10b981' }
                          ]
                        };
                      case 'pennsylvania':
                        return {
                          title: 'Statutory Pennsylvania IEP Timelines',
                          desc: 'Pennsylvania details timeline requirements for evaluations.',
                          cite: 'Cites 22 Pa. Code §§ 14.123 & 14.131',
                          milestones: [
                            { label: '1. Permission to Evaluate Form (10 Days):', offset: 10, color: 'var(--primary-color)' },
                            { label: '2. Evaluation Completed (60 Days from Consent):', offset: 70, color: 'inherit' },
                            { label: '3. Write IEP & Hold Meeting (30 Days):', offset: 100, color: '#10b981' }
                          ]
                        };
                      case 'california':
                      default:
                        return {
                          title: 'Statutory California IEP Timelines',
                          desc: 'California enforces strict legal limits on school districts.',
                          cite: 'Cites CA Education Code §§ 56321 & 56344',
                          milestones: [
                            { label: '1. Assessment Plan Proposed (15 Days):', offset: 15, color: 'var(--primary-color)' },
                            { label: '2. Return Signed Plan By (15 Days):', offset: 30, color: 'inherit' },
                            { label: '3. Assessments & Initial IEP Meeting (60 Days):', offset: 90, color: '#10b981' }
                          ]
                        };
                    }
                  })();

                  return (
                    <div style={{ 
                      marginTop: '1.5rem', 
                      borderTop: '1px dashed rgba(0,0,0,0.08)', 
                      paddingTop: '1.25rem',
                      background: 'rgba(var(--primary-rgb), 0.03)',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(var(--primary-rgb), 0.08)'
                    }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} color="var(--primary-color)" /> {timelines.title}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                        {timelines.desc} Select your request submission date to calculate your legal milestones:
                      </p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: '0.75rem' }}>Submission Date</label>
                          <input 
                            type="date"
                            value={iepSubmissionDate}
                            onChange={(e) => setIepSubmissionDate(e.target.value)}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                          />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', paddingBottom: '0.4rem' }}>
                          {timelines.cite}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.8rem' }}>
                        {timelines.milestones.map((m, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: idx < timelines.milestones.length - 1 ? '1px dashed rgba(0,0,0,0.04)' : 'none', paddingBottom: idx < timelines.milestones.length - 1 ? '0.25rem' : 0 }}>
                            <span>{m.label}</span>
                            <strong style={{ color: m.color }}>{calculateDateOffset(iepSubmissionDate, m.offset)}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

              </div>
            )}

            {/* B. IHSS protective supervision settings */}
            {activeTemplate === 'ihss-appeal' && (
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>IHSS Appeal Parameters</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                  Select safety behaviors and safety hazards to contest the In-Home Supportive Services denial decision.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>County Name</label>
                    <input 
                      type="text" 
                      value={ihssCounty} 
                      onChange={(e) => setIhssCounty(e.target.value)} 
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Notice of Action Date</label>
                    <input 
                      type="date" 
                      value={ihssDenialDate} 
                      onChange={(e) => setIhssDenialDate(e.target.value)} 
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Safety Hazards checklist:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={ihssSafetyConcerns.elopement}
                        onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, elopement: e.target.checked }))}
                      />
                      <span>Elopement & Wandering</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={ihssSafetyConcerns.pica}
                        onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, pica: e.target.checked }))}
                      />
                      <span>Pica (Swallowing Hazards)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={ihssSafetyConcerns.selfInjury}
                        onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, selfInjury: e.target.checked }))}
                      />
                      <span>Self-Injurious Behaviors</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={ihssSafetyConcerns.climbing}
                        onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, climbing: e.target.checked }))}
                      />
                      <span>Furniture climbing/Falls</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={ihssSafetyConcerns.electricalSafety}
                        onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, electricalSafety: e.target.checked }))}
                      />
                      <span>Appliances / Fire Safety</span>
                    </label>
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.85rem' }}>Detailed description of safety monitoring needs</label>
                  <textarea 
                    value={customIhssText}
                    onChange={(e) => setCustomIhssText(e.target.value)}
                    style={{ width: '100%', minHeight: '80px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
                  />
                </div>

                {/* Statutory IHSS Appeal Deadline warning */}
                {(() => {
                  const timelines = (() => {
                    switch (selectedState) {
                      case 'texas':
                        return {
                          title: 'Statutory MDCP / PCS Appeal Timelines',
                          desc: 'Under 1 Texas Administrative Code § 357, you must file your fair hearing request within **90 calendar days** of the Notice of Action date.',
                          days: 90
                        };
                      case 'florida':
                        return {
                          title: 'Statutory Medicaid Personal Care Appeal Timelines',
                          desc: 'Under Florida Medicaid guidelines, you must file your fair hearing request within **90 calendar days** of the Notice of Action date.',
                          days: 90
                        };
                      case 'new-york':
                        return {
                          title: 'Statutory CDPAP Appeal Timelines',
                          desc: 'Under 18 NYCRR § 358-3.5, you must file your fair hearing request within **60 calendar days** of the Notice of Action date.',
                          days: 60
                        };
                      case 'pennsylvania':
                        return {
                          title: 'Statutory DHS Personal Care Appeal Timelines',
                          desc: 'Under 55 Pa. Code § 275, you must file your fair hearing request within **60 calendar days** of the Notice of Action date.',
                          days: 60
                        };
                      case 'california':
                      default:
                        return {
                          title: 'Statutory IHSS Appeal Timelines',
                          desc: 'Under Welfare & Institutions Code § 10951, you must file your fair hearing request within **90 calendar days** of the Notice of Action date.',
                          days: 90
                        };
                    }
                  })();

                  return (
                    <div style={{ 
                      marginTop: '1.5rem', 
                      borderTop: '1px dashed rgba(0,0,0,0.08)', 
                      paddingTop: '1.25rem',
                      background: 'rgba(239, 68, 68, 0.02)',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(239, 68, 68, 0.08)'
                    }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Scale size={14} color="#ef4444" /> {timelines.title}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                        {timelines.desc}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span>Notice of Action Date:</span>
                        <strong>{ihssDenialDate ? new Date(ihssDenialDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.4rem', borderTop: '1px dashed rgba(0,0,0,0.04)', paddingTop: '0.4rem' }}>
                        <span style={{ color: '#b91c1c', fontWeight: 600 }}>Filing Submission Deadline:</span>
                        <strong style={{ color: '#ef4444' }}>{calculateDateOffset(ihssDenialDate, timelines.days)}</strong>
                      </div>
                    </div>
                  );
                })()}

              </div>
            )}

            {/* C. Regional Center Denial parameters */}
            {activeTemplate === 'rc-appeal' && (
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{selectedState === 'california' ? 'Regional Center' : selectedState === 'texas' ? 'LIDDA' : selectedState === 'florida' ? 'APD iBudget' : selectedState === 'new-york' ? 'OPWDD' : selectedState === 'pennsylvania' ? 'ODP Waiver' : 'Developmental Services'} Appeal Parameters</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                  Cite the core developmental limitations to appeal a {selectedState === 'california' ? 'Regional Center Lanterman Act' : selectedState === 'texas' ? 'LIDDA Services' : selectedState === 'florida' ? 'APD iBudget Services' : selectedState === 'new-york' ? 'OPWDD Services' : selectedState === 'pennsylvania' ? 'ODP Waiver Services' : 'Developmental Services'} eligibility decision.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>{selectedState === 'california' ? 'Regional Center' : selectedState === 'texas' ? 'LIDDA Agency' : selectedState === 'florida' ? 'APD Office' : selectedState === 'new-york' ? 'OPWDD Office' : selectedState === 'pennsylvania' ? 'ODP Office' : 'Developmental Services Agency'} Name</label>
                    <input 
                      type="text" 
                      value={regionalCenterName} 
                      onChange={(e) => setRegionalCenterName(e.target.value)} 
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Date of Denial Notice</label>
                    <input 
                      type="date" 
                      value={rcDenialDate} 
                      onChange={(e) => setRcDenialDate(e.target.value)} 
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Primary Diagnosis</label>
                    <input 
                      type="text" 
                      value={rcDiagnosis} 
                      onChange={(e) => setRcDiagnosis(e.target.value)} 
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Substantial limitations (Select 3+):</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={rcLimitations.receptiveLanguage}
                        onChange={(e) => setRcLimitations(prev => ({ ...prev, receptiveLanguage: e.target.checked }))}
                      />
                      <span>Receptive Language</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={rcLimitations.expressiveLanguage}
                        onChange={(e) => setRcLimitations(prev => ({ ...prev, expressiveLanguage: e.target.checked }))}
                      />
                      <span>Expressive Language</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={rcLimitations.learning}
                        onChange={(e) => setRcLimitations(prev => ({ ...prev, learning: e.target.checked }))}
                      />
                      <span>Learning Delays</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={rcLimitations.mobility}
                        onChange={(e) => setRcLimitations(prev => ({ ...prev, mobility: e.target.checked }))}
                      />
                      <span>Mobility / Gross Motor</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={rcLimitations.selfCare}
                        onChange={(e) => setRcLimitations(prev => ({ ...prev, selfCare: e.target.checked }))}
                      />
                      <span>Self-Care (ADLs)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={rcLimitations.selfDirection}
                        onChange={(e) => setRcLimitations(prev => ({ ...prev, selfDirection: e.target.checked }))}
                      />
                      <span>Self-Direction / Safety</span>
                    </label>
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.85rem' }}>Detailed description of qualifying developmental needs</label>
                  <textarea 
                    value={customRcText}
                    onChange={(e) => setCustomRcText(e.target.value)}
                    style={{ width: '100%', minHeight: '80px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
                  />
                </div>

                {/* Statutory Lanterman Appeal Deadline warning */}
                {(() => {
                  const timelines = (() => {
                    switch (selectedState) {
                      case 'texas':
                        return {
                          title: 'LIDDA / HCS Appeal Timelines',
                          desc: 'Under Texas Health and Safety Code guidelines, you must submit your appeal within **30 calendar days** of the eligibility denial notice.',
                          days: 30
                        };
                      case 'florida':
                        return {
                          title: 'APD iBudget Appeal Timelines',
                          desc: 'Under Florida Statutes Section 393.125, you must submit your appeal within **30 calendar days** of the eligibility denial notice.',
                          days: 30
                        };
                      case 'new-york':
                        return {
                          title: 'OPWDD Appeal Timelines',
                          desc: 'Under New York Mental Hygiene Law Section 13.07, you must submit your appeal within **30 calendar days** of the eligibility denial notice.',
                          days: 30
                        };
                      case 'pennsylvania':
                        return {
                          title: 'ODP Waiver Appeal Timelines',
                          desc: 'Under Pennsylvania ODP regulations, you must submit your appeal within **30 calendar days** of the eligibility denial notice.',
                          days: 30
                        };
                      case 'california':
                      default:
                        return {
                          title: 'Lanterman Act Appeal Timelines',
                          desc: 'Under Welfare & Institutions Code § 4710.5, you must submit your appeal within **30 calendar days** of the Regional Center eligibility denial notice.',
                          days: 30
                        };
                    }
                  })();

                  return (
                    <div style={{ 
                      marginTop: '1.5rem', 
                      borderTop: '1px dashed rgba(0,0,0,0.08)', 
                      paddingTop: '1.25rem',
                      background: 'rgba(239, 68, 68, 0.02)',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(239, 68, 68, 0.08)'
                    }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Scale size={14} color="#ef4444" /> {timelines.title}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                        {timelines.desc}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span>Denial Notice Date:</span>
                        <strong>{rcDenialDate ? new Date(rcDenialDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.4rem', borderTop: '1px dashed rgba(0,0,0,0.04)', paddingTop: '0.4rem' }}>
                        <span style={{ color: '#b91c1c', fontWeight: 600 }}>Filing Submission Deadline:</span>
                        <strong style={{ color: '#ef4444' }}>{calculateDateOffset(rcDenialDate, timelines.days)}</strong>
                      </div>
                    </div>
                  );
                })()}

              </div>
            )}

            {/* D. SSI Childhood Disability settings */}
            {activeTemplate === 'ssi-reconsideration' && (
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>SSI Reconsideration Parameters</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                  Cite clinical diagnoses and medical listings to appeal a childhood Supplemental Security Income denial.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Date of Denial Notice</label>
                    <input 
                      type="date" 
                      value={ssiDate} 
                      onChange={(e) => setSsiDate(e.target.value)} 
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Clinical Diagnosis</label>
                    <input 
                      type="text" 
                      value={ssiDiagnosis} 
                      onChange={(e) => setSsiDiagnosis(e.target.value)} 
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Treating Hospital / Specialists</label>
                    <input 
                      type="text" 
                      value={ssiClinicInfo} 
                      onChange={(e) => setSsiClinicInfo(e.target.value)} 
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.85rem' }}>Description of Childhood Listing matches (marked limitations)</label>
                  <textarea 
                    value={customSsiText}
                    onChange={(e) => setCustomSsiText(e.target.value)}
                    style={{ width: '100%', minHeight: '80px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
                  />
                </div>

                {/* Statutory SSI Reconsideration Deadline warning */}
                <div style={{ 
                  marginTop: '1.5rem', 
                  borderTop: '1px dashed rgba(0,0,0,0.08)', 
                  paddingTop: '1.25rem',
                  background: 'rgba(239, 68, 68, 0.02)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(239, 68, 68, 0.08)'
                }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Scale size={14} color="#ef4444" /> Social Security Appeal Timelines
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                    Under Social Security rules (20 CFR § 416.1401), you must file a request for Reconsideration within **60 calendar days** of receipt of the denial notice.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span>Denial Notice Date:</span>
                    <strong>{ssiDate ? new Date(ssiDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.4rem', borderTop: '1px dashed rgba(0,0,0,0.04)', paddingTop: '0.4rem' }}>
                    <span style={{ color: '#b91c1c', fontWeight: 600 }}>Filing Submission Deadline:</span>
                    <strong style={{ color: '#ef4444' }}>{calculateDateOffset(ssiDate, 60)}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* E. EPSDT Therapy Authorization appeal settings */}
            {activeTemplate === 'epsdt-therapy' && (
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Therapy Denial Appeal Parameters (EPSDT Mandate)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                  Provide details about the denied therapy and insurance plan. Under federal law, {selectedState === 'california' ? 'Medi-Cal' : selectedState === 'texas' ? 'Texas Medicaid' : selectedState === 'florida' ? 'Florida Medicaid' : selectedState === 'new-york' ? 'New York Medicaid' : selectedState === 'pennsylvania' ? 'Medical Assistance (Medicaid)' : 'Medicaid'} plans must authorize therapies that &quot;correct or ameliorate&quot; a condition.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Therapy Type</label>
                    <select 
                      value={therapyType} 
                      onChange={(e) => setTherapyType(e.target.value)} 
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', background: 'white', color: 'var(--text-main)' }}
                    >
                      <option value="Speech-Language Therapy">Speech-Language Therapy</option>
                      <option value="Occupational Therapy">Occupational Therapy</option>
                      <option value="Physical Therapy">Physical Therapy</option>
                      <option value="Feeding Therapy">Feeding Therapy</option>
                      <option value="Behavioral Therapy (ABA)">Behavioral Therapy (ABA)</option>
                      <option value="Mental Health / Psychotherapy">Mental Health / Psychotherapy</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Denial Reason</label>
                    <select 
                      value={denialReason} 
                      onChange={(e) => setDenialReason(e.target.value)} 
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', background: 'white', color: 'var(--text-main)' }}
                    >
                      <option value="Excludes developmental delays / Not rehabilitative">Excludes developmental delays / Not rehabilitative</option>
                      <option value="Not medically necessary">Not medically necessary</option>
                      <option value="Exceeds annual session limits">Exceeds annual session limits</option>
                      <option value="Lack of progress / Maintenance care only">Lack of progress / Maintenance care only</option>
                      <option value="Out-of-network provider">Out-of-network provider</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Insurance / Managed Care Plan Name</label>
                    <input 
                      type="text" 
                      value={insurancePlanName} 
                      onChange={(e) => setInsurancePlanName(e.target.value)} 
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Prescribing Physician / Specialist</label>
                    <input 
                      type="text" 
                      value={prescribingDoctor} 
                      onChange={(e) => setPrescribingDoctor(e.target.value)} 
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.85rem' }}>Ameliorating therapeutic necessity statement (Clinical details)</label>
                  <textarea 
                    value={customTherapyText}
                    onChange={(e) => setCustomTherapyText(e.target.value)}
                    style={{ width: '100%', minHeight: '100px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
                  />
                </div>

                {/* Statutory EPSDT Appeal Timeline warning */}
                <div style={{ 
                  marginTop: '1.5rem', 
                  borderTop: '1px dashed rgba(0,0,0,0.08)', 
                  paddingTop: '1.25rem',
                  background: 'rgba(59, 130, 246, 0.02)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.08)'
                }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <ShieldCheck size={14} color="#3b82f6" /> Federal EPSDT & State Appeal Timelines
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                    {selectedState === 'texas' ? (
                      'Under Texas Medicaid managed care rules (1 TAC § 354.1131), you have **60 calendar days** from the date of the denial Notice of Action to file an internal appeal.'
                    ) : selectedState === 'florida' ? (
                      'Under Florida Medicaid managed care guidelines, you have **60 calendar days** from the date of the denial Notice of Action to file an internal appeal.'
                    ) : selectedState === 'new-york' ? (
                      'Under New York Social Services regulations, you have **60 calendar days** from the date of the denial Notice of Action to file an internal appeal.'
                    ) : selectedState === 'pennsylvania' ? (
                      'Under Pennsylvania DHS Medical Assistance guidelines, you have **60 calendar days** from the date of the denial Notice of Action to file an internal appeal.'
                    ) : (
                      'Under Medi-Cal Managed Care rules (Title 22 CCR § 51014.1), you have **60 calendar days** from the date of the denial Notice of Action to file an appeal.'
                    )}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(0,0,0,0.04)', paddingBottom: '0.25rem' }}>
                      <span>Expedited Appeal Decision:</span>
                      <strong style={{ color: '#10b981' }}>Within 72 Hours</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(0,0,0,0.04)', paddingBottom: '0.25rem' }}>
                      <span>Standard Internal Appeal:</span>
                      <strong>Within 30 Days</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Fair Hearing filing (if internal appeal denied):</span>
                      <strong>Within {selectedState === 'california' ? '120 Days' : selectedState === 'texas' ? '120 Days' : '90 Days'}</strong>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Render Compiled Letter Editor */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Generated Request Letter</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Instantly formatted to official agency standards</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleCopy(letterText)}
                  className="btn-primary"
                  style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.82rem', borderRadius: '8px', background: 'rgba(0,0,0,0.04)', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  {copied ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#10b981' }}><Check size={14} /> Copied!</span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><Copy size={14} /> Copy to Clipboard</span>
                  )}
                </button>
                <PrintButton label="Print Letter" />
              </div>
            </div>

            {/* Simulated Paper Draft Canvas */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04)',
              minHeight: '400px',
              overflowX: 'auto'
            }}
            className="print-expand"
            >
              <pre style={{
                fontFamily: 'Courier, monospace',
                fontSize: '0.88rem',
                color: '#334155',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
                margin: 0
              }}>
                {letterText}
              </pre>
            </div>
            
            {/* Legal Advisory warning */}
            <div style={{ 
              marginTop: '1.5rem', 
              background: 'rgba(245, 158, 11, 0.05)', 
              border: '1px solid rgba(245, 158, 11, 0.2)', 
              borderRadius: '12px', 
              padding: '1rem', 
              display: 'flex', 
              gap: '0.75rem', 
              alignItems: 'flex-start' 
            }}>
              <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.8rem', color: '#b45309', margin: 0, lineHeight: 1.4 }}>
                <strong>Legal Disclaimer:</strong> Ablefull is an educational tool. This builder provides templates referencing state regulations but does not constitute formal legal counsel. Always review and attach supporting medical records before sending letters to agencies.
              </p>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
