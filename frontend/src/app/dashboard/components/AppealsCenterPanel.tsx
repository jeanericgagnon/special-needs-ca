'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChildProfile } from './ChildProfileContext';
import { AlertCircle } from 'lucide-react';
import {
  getCaregiverProfileAction,
  saveCaregiverProfileAction,
  getChildCoordinatorAction,
  saveChildCoordinatorAction
} from '../child-actions';
import AppealsSelector from './AppealsSelector';
import AppealsForm from './AppealsForm';
import AppealTemplateCard from './AppealTemplateCard';

interface AppealsCenterPanelProps {
  isSpanish?: boolean;
}

export default function AppealsCenterPanel({ isSpanish = false }: AppealsCenterPanelProps) {
  const {
    currentChild,
    parentName,
    setParentName,
    childName,
    setChildName,
    activeTemplate,
    setActiveTemplate
  } = useChildProfile();

  const loadedProfileRef = useRef<{name: string, email: string, phone: string, address: string} | null>(null);
  const loadedCoordinatorRef = useRef<string | null>(null);

  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentAddress, setParentAddress] = useState('');
  const [childDob, setChildDob] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');

  const [iepSubmissionDate, setIepSubmissionDate] = useState('2026-06-01');

  // Specific letter settings
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
  const [customIepText, setCustomIepText] = useState('Liam struggles to communicate wants and needs, exhibits sensory overload in loud classrooms, and cannot hold pencils without modifications.');

  const [ihssCounty, setIhssCounty] = useState('Los Angeles');
  const [ihssDenialDate, setIhssDenialDate] = useState('2026-05-15');
  const [ihssSafetyConcerns, setIhssSafetyConcerns] = useState({
    elopement: true,
    pica: false,
    selfInjury: true,
    climbing: true,
    electricalSafety: false
  });
  const [customIhssText, setCustomIhssText] = useState('Liam elopes out of doors and into high-risk traffic zones, head-bangs when overwhelmed, and attempts to climb furniture without any awareness of hazard, requiring constant 24/7 oversight.');

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
  const [customRcText, setCustomRcText] = useState('Liam is non-verbal, cannot perform independent self-care (bathing/feeding), and lacks the self-direction necessary to navigate basic environments safely, satisfying four of the Lanterman Act core limitations.');

  const [ssiDate, setSsiDate] = useState('2026-05-10');
  const [ssiDiagnosis, setSsiDiagnosis] = useState('Autism Spectrum Disorder & Speech Apraxia');
  const [ssiClinicInfo, setSsiClinicInfo] = useState("Children's Hospital Los Angeles (CHLA) - Developmental Pediatrics Division");
  const [customSsiText, setCustomSsiText] = useState('Liam meets Childhood Listing 112.10 (Autism spectrum disorder) and exhibits marked limitations in communication (social interaction) and self-regulation (severe emotional dysregulation).');

  const [therapyType, setTherapyType] = useState('Speech-Language Therapy');
  const [denialReason, setDenialReason] = useState('Excludes developmental delays / Not rehabilitative');
  const [insurancePlanName, setInsurancePlanName] = useState('L.A. Care Medi-Cal Managed Care Plan');
  const [prescribingDoctor, setPrescribingDoctor] = useState('Dr. Robert Chen, Pediatric Neurologist');
  const [customTherapyText, setCustomTherapyText] = useState('Liam has expressive-receptive language delay and verbal apraxia. He requires 2 sessions per week of clinical Speech Therapy to develop functional communication, utilizing alternative and augmentative communication (AAC) devices.');

  // Pre-hydrate default appeals info with child's info
  useEffect(() => {
    if (currentChild) {
      Promise.resolve().then(() => {
        setChildName(currentChild.nickname);
        setChildDob(currentChild.dob || '');
        setIepSubmissionDate(new Date().toISOString().split('T')[0]);

        // Load caregiver profile from DB
        getCaregiverProfileAction()
          .then(res => {
            if (res.success && res.profile) {
              const name = res.profile.name || '';
              const email = res.profile.email || '';
              const phone = res.profile.phone || '';
              const address = res.profile.address || '';

              setParentName(name);
              setParentEmail(email);
              setParentPhone(phone);
              setParentAddress(address);

              loadedProfileRef.current = { name, email, phone, address };
            } else {
              // Fallback to localStorage
              const savedParentName = localStorage.getItem('caregiver_name') || localStorage.getItem('funding_parent_name') || '';
              const savedParentEmail = localStorage.getItem('caregiver_email') || '';
              const savedParentPhone = localStorage.getItem('caregiver_phone') || localStorage.getItem('funding_parent_phone') || '';
              const savedParentAddress = localStorage.getItem('caregiver_address') || '';

              setParentName(savedParentName);
              setParentEmail(savedParentEmail);
              setParentPhone(savedParentPhone);
              setParentAddress(savedParentAddress);

              loadedProfileRef.current = {
                name: savedParentName,
                email: savedParentEmail,
                phone: savedParentPhone,
                address: savedParentAddress
              };
            }
          })
          .catch(() => {
            const savedParentName = localStorage.getItem('caregiver_name') || localStorage.getItem('funding_parent_name') || '';
            const savedParentEmail = localStorage.getItem('caregiver_email') || '';
            const savedParentPhone = localStorage.getItem('caregiver_phone') || localStorage.getItem('funding_parent_phone') || '';
            const savedParentAddress = localStorage.getItem('caregiver_address') || '';

            setParentName(savedParentName);
            setParentEmail(savedParentEmail);
            setParentPhone(savedParentPhone);
            setParentAddress(savedParentAddress);

            loadedProfileRef.current = {
              name: savedParentName,
              email: savedParentEmail,
              phone: savedParentPhone,
              address: savedParentAddress
            };
          });

        // Load coordinator from DB
        getChildCoordinatorAction(currentChild.id)
          .then(res => {
            if (res.success && res.name) {
              setCoordinatorName(res.name);
              loadedCoordinatorRef.current = res.name;
            } else {
              const savedCoordName = localStorage.getItem(`funding_coordinator_name_${currentChild.id}`) || '';
              setCoordinatorName(savedCoordName);
              loadedCoordinatorRef.current = savedCoordName;
            }
          })
          .catch(() => {
            const savedCoordName = localStorage.getItem(`funding_coordinator_name_${currentChild.id}`) || '';
            setCoordinatorName(savedCoordName);
            loadedCoordinatorRef.current = savedCoordName;
          });
      });
    }
  }, [currentChild, setChildName, setParentName]);

  // Debounced save of caregiver profile to DB via server action
  useEffect(() => {
    if (!parentName && !parentEmail && !parentPhone && !parentAddress) return;

    // Check if dirty (differs from loaded values)
    const isDirty = !loadedProfileRef.current ||
      parentName !== loadedProfileRef.current.name ||
      parentEmail !== loadedProfileRef.current.email ||
      parentPhone !== loadedProfileRef.current.phone ||
      parentAddress !== loadedProfileRef.current.address;

    if (!isDirty) return;

    const delayDebounce = setTimeout(() => {
      // Also save locally as fallback
      if (parentName) localStorage.setItem('caregiver_name', parentName);
      if (parentEmail) localStorage.setItem('caregiver_email', parentEmail);
      if (parentPhone) localStorage.setItem('caregiver_phone', parentPhone);
      if (parentAddress) localStorage.setItem('caregiver_address', parentAddress);

      saveCaregiverProfileAction(parentName, parentEmail, parentPhone, parentAddress)
        .then(() => {
          loadedProfileRef.current = {
            name: parentName,
            email: parentEmail,
            phone: parentPhone,
            address: parentAddress
          };
        })
        .catch(err => console.error('Failed to save caregiver profile:', err));
    }, 800);

    return () => clearTimeout(delayDebounce);
  }, [parentName, parentEmail, parentPhone, parentAddress]);

  // Debounced save of child coordinator name to DB via server action
  useEffect(() => {
    if (!currentChild || !coordinatorName) return;

    const isDirty = loadedCoordinatorRef.current !== coordinatorName;
    if (!isDirty) return;

    const delayDebounce = setTimeout(() => {
      localStorage.setItem(`funding_coordinator_name_${currentChild.id}`, coordinatorName);

      saveChildCoordinatorAction(currentChild.id, coordinatorName)
        .then(() => {
          loadedCoordinatorRef.current = coordinatorName;
        })
        .catch(err => console.error('Failed to save child coordinator:', err));
    }, 800);

    return () => clearTimeout(delayDebounce);
  }, [coordinatorName, currentChild]);

  if (!currentChild) return null;

  // Pre-calculate Child Age in Years for Appeals
  const getChildAgeForAppeals = () => {
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

  const calculateDateOffset = (baseDateStr: string, offsetDays: number) => {
    if (!baseDateStr) return 'N/A';
    try {
      const date = new Date(baseDateStr + 'T00:00:00');
      date.setDate(date.getDate() + offsetDays);
      return date.toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // Compile letter draft dynamically
  const compileAppealLetterText = (): string => {
    const todayStr = new Date().toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    switch (activeTemplate) {
      case 'iep-request': {
        const concernsList: string[] = [];
        if (iepConcerns.speech) {
          concernsList.push(isSpanish 
            ? 'Retrasos en el desarrollo del habla/lenguaje y comunicación expresiva' 
            : 'Speech/Language development and expressive communication delays');
        }
        if (iepConcerns.sensory) {
          concernsList.push(isSpanish 
            ? 'Trastornos del procesamiento e integración sensorial' 
            : 'Sensory integration and processing disorders');
        }
        if (iepConcerns.academic) {
          concernsList.push(isSpanish 
            ? 'Dificultades significativas de aprendizaje y preacadémicas' 
            : 'Significant learning difficulties and pre-academic struggles');
        }
        if (iepConcerns.fineMotor) {
          concernsList.push(isSpanish 
            ? 'Retrasos en habilidades motoras finas/gruesas y necesidad de terapia ocupacional' 
            : 'Fine/gross motor skill delays and occupational support needs');
        }
        if (iepConcerns.social) {
          concernsList.push(isSpanish 
            ? 'Barreras en la comunicación social e interacción con compañeros' 
            : 'Social communication and peer interaction barriers');
        }
        if (iepConcerns.behavioral) {
          concernsList.push(isSpanish 
            ? 'Dificultades de comportamiento y de regulación emocional' 
            : 'Behavioral struggles and emotional regulation difficulties');
        }

        if (isSpanish) {
          return `Fecha: ${todayStr}

De:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

A:
Director de Educación Especial / Departamento de Admisión de IEP
${schoolDistrict}

Asunto: Solicitud por Escrito de Evaluación Inicial de Educación Especial
Nombre del Niño: ${childName}
Fecha de Nacimiento del Niño: ${childDob} (Edad: ${getChildAgeForAppeals()})
Escuela: ${schoolName}

Estimado Director de Educación Especial y Equipo del IEP:

Le escribo como padre/tutor de ${childName} para solicitar formalmente una evaluación educativa integral para determinar la elegibilidad para servicios de educación especial y servicios relacionados bajo la ley federal IDEA (Individuals with Disabilities Education Act) y el Código de Educación de California.

Sospecho que ${childName} tiene una discapacidad que afecta negativamente su capacidad para acceder al currículo de educación general. Específicamente, ${childName} presenta desafíos significativos en las siguientes áreas:
${concernsList.map(c => `- ${c}`).join('\n')}

Detalles de respaldo sobre los desafíos observados en mi hijo:
${customIepText}

De acuerdo con la Sección 56321 del Código de Educación de California, le solicito que me proporcione un Plan de Evaluación dentro del plazo legalmente establecido de 15 días a partir de la recepción de esta solicitud. Solicito que la evaluación cubra todas las áreas de sospecha de discapacidad, que pueden incluir evaluaciones psicoeducativas (cognitivas/académicas), de habla y lenguaje, terapia ocupacional (OT/motora fina), terapia física (PT/motora gruesa) y de comportamiento funcional (FBA).

Espero recibir el Plan de Evaluación dentro de los 15 días estatutarios para que podamos programar la reunión inicial del IEP dentro del límite de 60 días naturales (Código de Educación de California § 56344) para colaborar en un programa educativo que se adapte a las necesidades de ${childName}.

Atentamente,

[Firma]

${parentName}`;
        } else {
          return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

A:
Director of Special Education / IEP Intake Department
${schoolDistrict}

Re: Written Request for Initial Special Education Assessment
Child Name: ${childName}
Child Date of Birth: ${childDob} (Age: ${getChildAgeForAppeals()})
School: ${schoolName}

Dear Director of Special Education and IEP Team,

I am writing as the parent/caregiver of ${childName} to formally request a comprehensive educational assessment to determine eligibility for special education and related services under the Individuals with Disabilities Education Act (IDEA) and California Education Code. 

I suspect ${childName} has a disability that is negatively impacting their ability to access the general education curriculum. Specifically, ${childName} is exhibiting significant challenges in the following areas:
${concernsList.map(c => `- ${c}`).join('\n')}

Supporting details regarding my child's observed challenges:
${customIepText}

In accordance with California Education Code Section 56321, please provide me with an Assessment Plan within the legally mandated 15-day timeline from receipt of this request. I request that the assessment cover all areas of suspected disability, which may include Psychoeducational (Cognitive/Academic), Speech and Language, Occupational Therapy (OT/Fine Motor), Physical Therapy (PT/Gross Motor), and Functional Behavior (FBA) assessments.

I look forward to receiving the Assessment Plan within the statutory 15 days so that we can schedule the initial IEP meeting within the 60-day calendar limit (California Education Code § 56344) to collaborate on an educational program that matches ${childName}'s needs.

Sincerely,

[Signature]

${parentName}`;
        }
      }

      case 'ihss-appeal': {
        const safetyList: string[] = [];
        if (ihssSafetyConcerns.elopement) {
          safetyList.push(isSpanish
            ? 'Conductas graves de fuga/deambulación (correr hacia zonas de tráfico peligroso, lagos o bosques)'
            : 'Severe elopement/wandering behaviors (running away into dangerous traffic zones, lakes, or woods)');
        }
        if (ihssSafetyConcerns.pica) {
          safetyList.push(isSpanish
            ? 'Pica (ingesta de objetos no alimentarios peligrosos como tierra, grava, plásticos o monedas)'
            : 'Pica (ingesting dangerous non-food objects like soil, gravel, plastics, or coins)');
        }
        if (ihssSafetyConcerns.selfInjury) {
          safetyList.push(isSpanish
            ? 'Conductas autolesivas (golpearse la cabeza, rascarse, morderse las muñecas o pellizcarse la piel)'
            : 'Self-injurious behaviors (head-banging, scratching, wrist-biting, or skin-picking)');
        }
        if (ihssSafetyConcerns.climbing) {
          safetyList.push(isSpanish
            ? 'Conducta de escalada de alto riesgo (subirse a estantes, puertas o mostradores sin conciencia del peligro)'
            : 'High-risk climbing behavior (scaling shelves, doors, or counters without safety awareness)');
        }
        if (ihssSafetyConcerns.electricalSafety) {
          safetyList.push(isSpanish
            ? 'Grave falta de conciencia de seguridad alrededor de enchufes eléctricos, llamas abiertas o electrodomésticos'
            : 'Severe lack of safety awareness around electrical outlets, open flames, or kitchen appliances');
        }

        if (isSpanish) {
          return `Fecha: ${todayStr}

De:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

A:
División de Audiencias Estatales
Departamento de Servicios Sociales de California
744 P Street, M.S. 21-97
Sacramento, CA 95814

Asunto: Solicitud de Audiencia Imparcial / Apelación de Aviso de Acción de IHSS
Beneficiario: ${childName}
Fecha de Nacimiento: ${childDob} (Edad: ${getChildAgeForAppeals()})
Condado: ${ihssCounty}
Fecha del Aviso de Denegación/Reducción: ${ihssDenialDate}

A quien corresponda:

Le escribo para solicitar formalmente una Audiencia Imparcial para apelar el Aviso de Acción con fecha ${ihssDenialDate} con respecto a los beneficios de In-Home Supportive Services (IHSS) para mi hijo menor de edad, ${childName}. El condado ha denegado o reducido las horas de mi hijo bajo la categoría de Supervisión Proactiva (Protective Supervision).

Impugno la determinación del condado. Bajo la Sección 12300 del Código de Bienestar e Instituciones y la Sección 30-757.17 del Manual de Políticas y Procedimientos (MPP) del Departamento de Servicios Sociales de California, mi hijo califica para la Supervisión Proactiva debido a un deterioro mental severo y una falta total de conciencia de seguridad.

${childName} presenta conductas peligrosas que requieren un monitoreo activo de seguridad las 24 horas del día, los 7 días de la semana, para evitar autolesiones graves o una muerte accidental. Específicamente, estas conductas incluyen:
${safetyList.map(s => `- ${s}`).join('\n')}

Detalles clínicos de los peligros de seguridad y la necesidad de supervisión:
${customIhssText}

Contrariamente a la evaluación del trabajador social, las conductas de mi hijo no son simples berrinches, ni es esta una supervisión estándar típica de un niño de su edad. Los retrasos en el desarrollo y cognitivos de mi hijo le impiden reconocer el peligro. Sin una supervisión protectora constante, mi hijo corre un riesgo crítico de sufrir lesiones.

Solicito una audiencia imparcial para presentar registros médicos, registros escolares y un registro de comportamiento de seguridad de 24 horas que confirme que mi hijo cumple con los criterios de protección de la sección MPP 30-757. Por favor, programe esta apelación y notifíqueme la fecha y el lugar.

Atentamente,

[Firma]

${parentName}`;
        } else {
          return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

A:
State Hearings Division
California Department of Social Services
744 P Street, M.S. 21-97
Sacramento, CA 95814

Re: Request for Fair Hearing / Appeal of IHSS Notice of Action
Recipient: ${childName}
Date of Birth: ${childDob} (Age: ${getChildAgeForAppeals()})
County: ${ihssCounty}
Date of Denial/Reduction Notice: ${ihssDenialDate}

To Whom It May Concern,

I am writing to formally request a Fair Hearing to appeal the Notice of Action dated ${ihssDenialDate} regarding In-Home Supportive Services (IHSS) benefits for my minor child, ${childName}. The county has denied or reduced hours for my child under the category of Protective Supervision.

I dispute the county's determination. Under Welfare and Institutions Code Section 12300 and California Department of Social Services Manual of Policies and Procedures (MPP) Section 30-757.17, my child qualifies for Protective Supervision due to severe mental impairment and a complete lack of safety awareness. 

${childName} exhibits dangerous behaviors that require 24/7 active safety monitoring to prevent severe self-harm or accidental death. Specifically, these behaviors include:
${safetyList.map(s => `- ${s}`).join('\n')}

Clinical details of safety hazards and oversight demands:
${customIhssText}

Contrary to the social worker's assessment, my child's behaviors are not simple tantrums, nor is this standard supervision typical of a child of this age. My child's developmental and cognitive delays prevent them from recognizing hazard. Without constant protective monitoring, my child is at critical risk of injury. 

I request a fair hearing to present medical records, school logs, and a 24-hour safety behavior log confirming that my child meets MPP 30-757 protective criteria. Please schedule this appeal and notify me of the date and location.

Sincerely,

[Signature]

${parentName}`;
        }
      }

      case 'rc-appeal': {
        const limitsList: string[] = [];
        if (rcLimitations.receptiveLanguage) {
          limitsList.push(isSpanish
            ? 'Lenguaje receptivo: El niño tiene dificultades para comprender instrucciones o advertencias verbales básicas.'
            : 'Receptive Language: Child struggles to understand basic verbal instructions or warnings.');
        }
        if (rcLimitations.expressiveLanguage) {
          limitsList.push(isSpanish
            ? 'Lenguaje expresivo: El niño tiene graves déficits de comunicación verbal o es completamente no verbal.'
            : 'Expressive Language: Child has severe verbal communication deficits or is fully non-verbal.');
        }
        if (rcLimitations.learning) {
          limitsList.push(isSpanish
            ? 'Aprendizaje: El niño tiene retrasos cognitivos significativos y barreras educativas.'
            : 'Learning: Child has severe cognitive delays and educational barriers.');
        }
        if (rcLimitations.mobility) {
          limitsList.push(isSpanish
            ? 'Movilidad: El niño tiene dificultades en la planificación motora del desarrollo y barreras físicas.'
            : 'Mobility: Child has developmental motor planning and physical barriers.');
        }
        if (rcLimitations.selfCare) {
          limitsList.push(isSpanish
            ? 'Cuidado personal: El niño requiere asistencia para actividades de la vida diaria (alimentación, aseo, vestirse) muy por encima del promedio de sus compañeros.'
            : 'Self-Care: Child requires assistance for basic ADLs (feeding, toileting, dressing) far beyond peer averages.');
        }
        if (rcLimitations.selfDirection) {
          limitsList.push(isSpanish
            ? 'Autodirección: El niño no puede navegar parámetros de seguridad, tiene conductas de deambulación y carece de límites de seguridad.'
            : 'Self-Direction: Child cannot navigate safety parameters, has wandering behaviors, and lacks safety boundaries.');
        }

        if (isSpanish) {
          return `Fecha: ${todayStr}

De:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

A:
Coordinador de Apelaciones de Admisión
${regionalCenterName}

Asunto: Apelación Formal de Denegación de Elegibilidad del Centro Regional
Nombre del Niño: ${childName}
Fecha de Nacimiento: ${childDob} (Edad: ${getChildAgeForAppeals()})
Fecha del Aviso de Denegación: ${rcDenialDate}

Estimado Coordinador de Apelaciones:

Le escribo para apelar formalmente la determinación de denegación de elegibilidad con fecha ${rcDenialDate} con respecto a mi hijo, ${childName}, bajo la Ley de Servicios para Personas con Discapacidades del Desarrollo Lanterman. El Centro Regional ha determinado que mi hijo no califica como persona con una discapacidad del desarrollo.

Impugno esta conclusión. Mi hijo tiene un diagnóstico documentado de ${rcDiagnosis}, lo que constituye una discapacidad del desarrollo según la Sección 4512 del Código de Bienestar e Instituciones de California. Esta condición se originó antes de los 18 años, se espera que continúe indefinidamente y constituye una discapacidad sustancial.

Según el Código de Bienestar e Instituciones § 4512(l), una discapacidad sustancial se define como limitaciones funcionales significativas en tres o más áreas de actividades de la vida diaria. ${childName} presenta limitaciones funcionales severas en las siguientes áreas:
${limitsList.map(l => `- ${l}`).join('\n')}

Detalles de respaldo sobre las limitaciones de desarrollo de mi hijo:
${customRcText}

Solicito una reunión informal con el director de admisiones del Centro Regional y, si es necesario, una Audiencia Imparcial formal para presentar expedientes de diagnóstico, evaluaciones psicológicas e informes del IEP que confirmen la elegibilidad de mi hijo.

De acuerdo con las reglas de la Ley Lanterman, presento esta apelación dentro del plazo legal de 30 días a partir de la recepción de la notificación de denegación. Por favor, programe una revisión de apelación y póngase en contacto conmigo para concertar una conferencia informal.

Atentamente,

[Firma]

${parentName}`;
        } else {
          return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

A:
Intake Appeal Coordinator
${regionalCenterName}

Re: Formal Appeal of Regional Center Eligibility Denial
Child Name: ${childName}
Date of Birth: ${childDob} (Age: ${getChildAgeForAppeals()})
Date of Denial Notice: ${rcDenialDate}

Dear Appeal Coordinator,

I am writing to formally appeal the determination of eligibility denial dated ${rcDenialDate} regarding my child, ${childName}, under the Lanterman Developmental Disabilities Services Act. The Regional Center has determined that my child does not qualify as developmentally disabled.

I dispute this finding. My child has a diagnosed condition of ${rcDiagnosis}, which constitutes a developmental disability under California Welfare and Institutions Code Section 4512. This condition originated before the age of 18, is expected to continue indefinitely, and constitutes a substantial disability.

Under Welfare and Institutions Code § 4512(l), a substantial disability is defined as significant functional limitations in three or more areas of major life activity. ${childName} exhibits severe functional limitations in the following domains:
${limitsList.map(l => `- ${l}`).join('\n')}

Supporting details regarding my child's developmental limitations:
${customRcText}

I request an informal meeting with the Regional Center intake director, and if necessary, a formal Fair Hearing to present diagnostic records, psychological evaluations, and IEP reports confirming my child's eligibility. 

Under Lanterman Act rules, I submit this appeal within the statutory 30-day window from the receipt of the denial notice. Please schedule an appeal review and contact me to arrange an informal conference.

Sincerely,

[Signature]

${parentName}`;
        }
      }

      case 'ssi-reconsideration': {
        if (isSpanish) {
          return `Fecha: ${todayStr}

De:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

A:
Administración del Seguro Social / Servicios de Determinación de Discapacidad

Asunto: Solicitud por Escrito de Reconsideración de Denegación de Discapacidad Infantil
Nombre del Reclamante: ${childName}
Fecha de Nacimiento del Reclamante: ${childDob} (Edad: ${getChildAgeForAppeals()})
SSN del Reclamante: [Ingrese el Seguro Social del Niño aquí]
Fecha de la notificación de denegación: ${ssiDate}

A quien corresponda:

Le escribo para solicitar una Reconsideración de la notificación de denegación de discapacidad con fecha ${ssiDate} con respecto a los beneficios de Seguridad de Ingreso Suplementario (SSI) por discapacidad infantil para mi hijo, ${childName}.

Impugno la conclusión de la Administración del Seguro Social de que el deterioro de mi hijo no cumple, no es equivalente médicamente ni equivale funcionalmente a los listados de la Lista de Deterioros. Mi hijo tiene un diagnóstico clínico severo de: ${ssiDiagnosis}.

Este deterioro causa limitaciones funcionales severas y marcadas. Específicamente, mi hijo presenta dificultades extremas en el funcionamiento socioemocional, la comunicación y el cuidado personal, cumpliendo con los requisitos de la Lista de Discapacidad Infantil de la SSA (por ejemplo, el Listado 112.10 para el Trastorno del Espectro Autista).

Descripciones clínicas y evaluaciones de especialistas:
${customSsiText}
Lugar Clínico de Tratamiento: ${ssiClinicInfo}

Sostengo que la evaluación original no consideró la extensión completa de las demandas de cuidado diario de mi hijo, las boletas de calificaciones escolares y las notas de terapia. Solicito una revisión de toda la evidencia clínica, incluidas las nuevas evaluaciones y los informes del IEP que adjunto a esta solicitud.

Por favor, revise este reclamo y comuníquese conmigo si se requieren exámenes médicos consultivos adicionales.

Atentamente,

[Firma]

${parentName}`;
        } else {
          return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

A:
Social Security Administration / Disability Determination Services

Re: Written Request for Reconsideration of Childhood Disability Denial
Claimant Name: ${childName}
Claimant Date of Birth: ${childDob} (Age: ${getChildAgeForAppeals()})
Claimant SSN: [Insert Child's SSN here]
Date of denial notice: ${ssiDate}

To Whom It May Concern,

I am writing to request a Reconsideration of the disability denial notice dated ${ssiDate} regarding Supplemental Security Income (SSI) childhood disability benefits for my child, ${childName}.

I dispute the Social Security Administration's finding that my child's impairment does not meet, medically equal, or functionally equal the listings in the Listing of Impairments. My child has a severe clinical diagnosis of: ${ssiDiagnosis}.

This impairment causes marked and severe functional limitations. Specifically, my child exhibits extreme difficulties in social-emotional functioning, communication, and self-care, satisfying the requirements of SSA Childhood Disability Listings (e.g. Listing 112.10 for Autism Spectrum Disorder).

Clinical descriptions and treating specialist evaluations:
${customSsiText}
Treating Clinical Location: ${ssiClinicInfo}

I submit that the original evaluation failed to consider the full extent of my child's daily care demands, school report cards, and therapy notes. I request a review of all clinical evidence, including the new evaluations and IEP reports which I have enclosed with this request.

Please review this claim and contact me if any further consultative medical examinations are required.

Sincerely,

[Signature]

${parentName}`;
        }
      }

      case 'epsdt-therapy': {
        if (isSpanish) {
          return `Fecha: ${todayStr}

De:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

A:
Departamento de Apelaciones y Quejas
${insurancePlanName}

Asunto: Apelación Urgente de Denegación de Autorización de Terapia / Mandato bajo EPSDT
Nombre del Miembro: ${childName}
Fecha de Nacimiento del Miembro: ${childDob} (Edad: ${getChildAgeForAppeals()})
ID del Miembro: [Ingrese el ID del Miembro]
Servicio Denegado: ${therapyType}
Motivo de la Denegación: ${denialReason}

A quien corresponda:

Le escribo para apelar formalmente la denegación de cobertura para la terapia de ${therapyType} recomendada para mi hijo, ${childName}, por su médico tratante, el/la ${prescribingDoctor}. El plan ha denegado la cobertura citando: "${denialReason}".

Impugno esta denegación bajo los mandatos federales de Medicaid EPSDT y la ley del estado de California. Específicamente, bajo la Sección 1396d(r)(5) del Título 42 del U.S.C., el programa federal de Medicaid requiere que los estados proporcionen "servicios de detección, diagnóstico y tratamiento tempranos y periódicos" (EPSDT) para determinar enfermedades o afecciones físicas o mentales, y proporcionar "atención médica, servicios de diagnóstico, tratamiento y otras medidas necesarias... para corregir o mejorar defectos y enfermedades y afecciones físicas y mentales".

Bajo la Sección 51340 del Código de Regulaciones del Título 22 de California, los servicios deben autorizarse si son necesarios para corregir o "mejorar" (ameliorate) una condición del desarrollo. Mejorar incluye mantener el nivel de funcionamiento del niño o prevenir el deterioro.

Denegar la terapia clínica con el argumento de que "no es rehabilitadora" o que "excluye condiciones del desarrollo" es una violación directa del mandato federal EPSDT. Mi hijo requiere esta terapia según se especifica a continuación:

${customTherapyText}

He adjuntado una carta de necesidad médica de ${prescribingDoctor} que confirma que estos servicios son médicamente necesarios. Solicito que ${insurancePlanName} revoque de inmediato esta denegación y autorice las sesiones solicitadas.

Bajo las reglas de planes de salud de California, solicito que esta queja se procese de manera urgente, ya que el retraso continuo en el desarrollo constituye un riesgo de pérdida funcional permanente.

Atentamente,

[Firma]

${parentName}`;
        } else {
          return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

A:
Appeals and Grievance Department
${insurancePlanName}

Re: Expedited Appeal of Therapy Authorization Denial / Mandate under EPSDT
Member Name: ${childName}
Member Date of Birth: ${childDob} (Age: ${getChildAgeForAppeals()})
Member ID: [Insert Member ID]
Service Denied: ${therapyType}
Reason for Denial: ${denialReason}

To Whom It May Concern,

I am writing to formally appeal the denial of coverage for ${therapyType} recommended for my child, ${childName}, by their treating clinician, ${prescribingDoctor}. The plan has denied coverage citing: "${denialReason}".

I dispute this denial under federal Medicaid EPSDT mandates and California state law. Specifically, under 42 U.S.C. Section 1396d(r)(5), the federal Medicaid program requires states to provide "early and periodic screening, diagnostic, and treatment services" (EPSDT) to determine physical or mental illnesses or conditions, and provide "necessary health care, diagnostic services, treatment, and other measures... to correct or improve defects and physical and mental illnesses and conditions."

Under California Title 22 Code of Regulations Section 51340, services must be authorized if they are necessary to correct or "ameliorate" a developmental condition. Ameliorate includes maintaining the child's level of functioning or preventing deterioration. 

Denying clinical therapy on the grounds that it is "not rehabilitative" or that it "excludes developmental conditions" is a direct violation of the EPSDT federal mandate. My child requires this therapy as specified below:

${customTherapyText}

I have enclosed a letter of medical necessity from ${prescribingDoctor} confirming that these services are medically necessary. I request that ${insurancePlanName} immediately overturn this denial and authorize the requested sessions.

Under California health plan rules, I request that this grievance be processed on an expedited basis as the ongoing delay in development constitutes a risk of permanent functional loss.

Sincerely,

[Signature]

${parentName}`;
        }
      }

      default:
        return '';
    }
  };

  const letterText = compileAppealLetterText();

  // Bilingual translation dictionary for UI labels
  const t = {
    selectTemplate: isSpanish ? 'Seleccionar Plantilla de Carta' : 'Select Letter Template',
    personalDetails: isSpanish ? 'Detalles Personales' : 'Personal Details',
    parentNameLabel: isSpanish ? 'Nombre del Padre/Cuidador' : 'Parent/Caregiver Name',
    parentAddressLabel: isSpanish ? 'Dirección del Padre' : 'Parent Address',
    parentPhoneLabel: isSpanish ? 'Teléfono del Padre' : 'Parent Phone',
    parentEmailLabel: isSpanish ? 'Correo del Padre' : 'Parent Email',
    childNameLabel: isSpanish ? 'Nombre del Niño' : 'Child\'s Name',
    childDobLabel: isSpanish ? 'Fecha de Nacimiento del Niño' : 'Child\'s Date of Birth',

    // IEP params
    iepParamsTitle: isSpanish ? 'Parámetros de Evaluación del IEP' : 'IEP Assessment Parameters',
    iepParamsSub: isSpanish 
      ? 'Especifique los parámetros del distrito y marque las categorías de retraso específicas para citar en la solicitud.'
      : 'Specify district parameters and check specific delay categories to cite in the assessment plan request.',
    schoolDistrictLabel: isSpanish ? 'Nombre del Distrito Escolar' : 'School District Name',
    schoolNameLabel: isSpanish ? 'Nombre de la Escuela' : 'School Name',
    iepSuspectedDelay: isSpanish ? 'Áreas de sospecha de retraso:' : 'Areas of suspected delay:',
    iepSpeechConcerns: isSpanish ? 'Problemas de Habla/Lenguaje' : 'Speech Concerns',
    iepSensoryConcerns: isSpanish ? 'Problemas Sensoriales' : 'Sensory Concerns',
    iepAcademicConcerns: isSpanish ? 'Problemas Académicos' : 'Academic Concerns',
    iepFineMotorConcerns: isSpanish ? 'Problemas de Motricidad Fina' : 'Fine Motor Concerns',
    iepSocialConcerns: isSpanish ? 'Problemas Sociales' : 'Social Concerns',
    iepBehavioralConcerns: isSpanish ? 'Problemas de Comportamiento' : 'Behavioral Concerns',
    iepObservedChallenges: isSpanish ? 'Desafíos observados (Detalles específicos)' : 'Observed challenges (Specific Details)',
    iepTimelineTitle: isSpanish ? 'Líneas de Tiempo Estatutarias del IEP en California' : 'Statutory California IEP Timelines',
    iepTimelineSub: isSpanish 
      ? 'California impone límites legales estrictos a los distritos escolares. Seleccione la fecha de envío para calcular sus hitos:'
      : 'California enforces strict legal limits on school districts. Select your request submission date to calculate your milestones:',
    submissionDateLabel: isSpanish ? 'Fecha de Envío' : 'Submission Date',
    iepStatCode: isSpanish ? 'Cita el Código de Educación de CA §§ 56321 y 56344' : 'Cites CA Education Code §§ 56321 & 56344',
    iepTimeline1: isSpanish ? '1. Vencimiento del Plan de Evaluación (15 días):' : '1. Assessment Plan Due (15 Days):',
    iepTimeline2: isSpanish ? '2. Devolver el Plan Firmado (15 días):' : '2. Return Signed Plan By (15 Days):',
    iepTimeline3: isSpanish ? '3. Evaluaciones y Reunión Inicial del IEP (60 días):' : '3. Assessments & Initial IEP Meeting Held (60 Days):',

    // IHSS params
    ihssParamsTitle: isSpanish ? 'Parámetros de Apelación de IHSS' : 'IHSS Appeal Parameters',
    ihssParamsSub: isSpanish 
      ? 'Seleccione los comportamientos y peligros de seguridad para impugnar la decisión de denegación de IHSS.'
      : 'Select safety behaviors and safety hazards to contest the In-Home Supportive Services denial decision.',
    countyNameLabel: isSpanish ? 'Nombre del Condado' : 'County Name',
    noticeDateLabel: isSpanish ? 'Fecha del Aviso de Acción' : 'Notice of Action Date',
    ihssHazardsLabel: isSpanish ? 'Lista de verificación de peligros de seguridad:' : 'Safety Hazards checklist:',
    ihssElopement: isSpanish ? 'Fuga y Deambulación' : 'Elopement & Wandering',
    ihssPica: isSpanish ? 'Pica (Ingestión de Peligros)' : 'Pica (Swallowing Hazards)',
    ihssSelfInjury: isSpanish ? 'Conductas Autolesivas' : 'Self-Injurious Behaviors',
    ihssClimbing: isSpanish ? 'Escalada de Muebles / Caídas' : 'Furniture climbing/Falls',
    ihssElectrical: isSpanish ? 'Electrodomésticos / Seguridad contra Incendios' : 'Appliances / Fire Safety',
    ihssDescriptionLabel: isSpanish ? 'Descripción detallada de las necesidades de monitoreo de seguridad' : 'Detailed description of safety monitoring needs',
    ihssTimelineTitle: isSpanish ? 'Líneas de Tiempo Estatutarias de Apelación de IHSS' : 'Statutory IHSS Appeal Timelines',
    ihssTimelineSub: isSpanish 
      ? 'Bajo el Código de Bienestar e Instituciones § 10951, debe presentar su solicitud de audiencia dentro de los **90 días naturales** posteriores a la fecha del Aviso de Acción.'
      : 'Under Welfare & Institutions Code § 10951, you must file your fair hearing request within **90 calendar days** of the Notice of Action date.',
    noaDateLabel: isSpanish ? 'Fecha del Aviso de Acción:' : 'Notice of Action Date:',
    filingDeadlineLabel: isSpanish ? 'Fecha Límite de Presentación:' : 'Filing Submission Deadline:',

    // RC params
    rcParamsTitle: isSpanish ? 'Parámetros de Apelación del Centro Regional' : 'Regional Center Appeal Parameters',
    rcParamsSub: isSpanish 
      ? 'Cite las limitaciones fundamentales del desarrollo para apelar una decisión de denegación del Centro Regional.'
      : 'Cite the core developmental limitations to appeal a Regional Center Lanterman Act eligibility decision.',
    rcNameLabel: isSpanish ? 'Nombre del Centro Regional' : 'Regional Center Name',
    rcDenialDateLabel: isSpanish ? 'Fecha del Aviso de Denegación' : 'Date of Denial Notice',
    rcDiagnosisLabel: isSpanish ? 'Diagnóstico Principal' : 'Primary Diagnosis',
    rcLimitationsLabel: isSpanish ? 'Limitaciones sustanciales (Seleccione 3+):' : 'Substantial limitations (Select 3+):',
    rcReceptive: isSpanish ? 'Lenguaje Receptivo' : 'Receptive Language',
    rcExpressive: isSpanish ? 'Lenguaje Expresivo' : 'Expressive Language',
    rcLearning: isSpanish ? 'Retrasos de Aprendizaje' : 'Learning Delays',
    rcMobility: isSpanish ? 'Movilidad / Motricidad Gruesa' : 'Mobility / Gross Motor',
    rcSelfCare: isSpanish ? 'Cuidado Personal (ADLs)' : 'Self-Care (ADLs)',
    rcSelfDirection: isSpanish ? 'Autodirección / Seguridad' : 'Self-Direction / Safety',
    rcDescLabel: isSpanish ? 'Descripción detallada de las necesidades calificadas de desarrollo' : 'Detailed description of qualifying developmental needs',
    rcTimelineTitle: isSpanish ? 'Líneas de Tiempo de Apelación de la Ley Lanterman' : 'Lanterman Act Appeal Timelines',
    rcTimelineSub: isSpanish 
      ? 'Bajo el Código de Bienestar e Instituciones § 4710.5, debe presentar su apelación dentro de los **30 días naturales** a partir del aviso de denegación.'
      : 'Under Welfare & Institutions Code § 4710.5, you must submit your appeal within **30 calendar days** of the Regional Center eligibility denial notice.',

    // SSI params
    ssiParamsTitle: isSpanish ? 'Parámetros de Reconsideración de SSI' : 'SSI Reconsideration Parameters',
    ssiParamsSub: isSpanish 
      ? 'Cite diagnósticos clínicos y listados médicos para apelar una denegación de Seguridad de Ingreso Suplementario infantil.'
      : 'Cite clinical diagnoses and medical listings to appeal a childhood Supplemental Security Income denial.',
    ssiDenialDateLabel: isSpanish ? 'Fecha del Aviso de Denegación' : 'Date of Denial Notice',
    ssiDiagnosisLabel: isSpanish ? 'Diagnóstico Clínico' : 'Clinical Diagnosis',
    ssiClinicLabel: isSpanish ? 'Hospital / Especialistas Tratantes' : 'Treating Hospital / Specialists',
    ssiDescLabel: isSpanish ? 'Descripción de coincidencia con la Lista Infantil (limitaciones marcadas)' : 'Description of Childhood Listing matches (marked limitations)',
    ssiTimelineTitle: isSpanish ? 'Líneas de Tiempo de Apelación del Seguro Social' : 'Social Security Appeal Timelines',
    ssiTimelineSub: isSpanish 
      ? 'Bajo las reglas del Seguro Social (20 CFR § 416.1401), debe presentar una solicitud de Reconsideración dentro de los **60 días naturales** posteriores a la recepción de la notificación.'
      : 'Under Social Security rules (20 CFR § 416.1401), you must file a request for Reconsideration within **60 calendar days** of receipt of the denial notice.',

    // EPSDT params
    epsdtParamsTitle: isSpanish ? 'Parámetros de Apelación de Terapia (EPSDT)' : 'Therapy Denial Appeal Parameters (EPSDT Mandate)',
    epsdtParamsSub: isSpanish 
      ? 'Proporcione detalles sobre la terapia denegada y el plan. Bajo la ley federal, los planes de Medi-Cal deben autorizar terapias que "corrijan o mejoren" una condición.'
      : 'Provide details about the denied therapy and insurance plan. Under federal law, Medi-Cal plans must authorize therapies that "correct or ameliorate" a condition.',
    therapyTypeLabel: isSpanish ? 'Tipo de Terapia' : 'Therapy Type',
    denialReasonLabel: isSpanish ? 'Motivo de Denegación' : 'Denial Reason',
    insuranceNameLabel: isSpanish ? 'Nombre del Plan de Seguro / Atención Administrada' : 'Insurance / Managed Care Plan Name',
    physicianLabel: isSpanish ? 'Médico Prescriptor / Especialista' : 'Prescribing Physician / Specialist',
    epsdtDescLabel: isSpanish ? 'Declaración de necesidad terapéutica de mejora (Detalles clínicos)' : 'Ameliorating therapeutic necessity statement (Clinical details)',
    epsdtTimelineTitle: isSpanish ? 'Líneas de Tiempo de Apelaciones Federales de EPSDT y Estatales' : 'Federal EPSDT & State Appeal Timelines',
    epsdtTimelineSub: isSpanish 
      ? 'Bajo las reglas de Medi-Cal Managed Care (Título 22 CCR § 51014.1), tiene **60 días naturales** a partir de la fecha del Aviso de Acción para presentar una apelación.'
      : 'Under Medi-Cal Managed Care rules (Title 22 CCR § 51014.1), you have **60 calendar days** from the date of the denial Notice of Action to file an appeal.',
    epsdtTimeline1: isSpanish ? 'Decisión de Apelación Rápida:' : 'Expedited Appeal Decision:',
    epsdtTimeline1Val: isSpanish ? 'Dentro de 72 Horas' : 'Within 72 Hours',
    epsdtTimeline2: isSpanish ? 'Apelación Interna Estándar:' : 'Standard Internal Appeal:',
    epsdtTimeline2Val: isSpanish ? 'Dentro de 30 Días' : 'Within 30 Days',
    epsdtTimeline3: isSpanish ? 'Presentación de Audiencia Imparcial (si se deniega la apelación interna):' : 'Fair Hearing filing (if internal appeal denied):',
    epsdtTimeline3Val: isSpanish ? 'Dentro de 120 Días' : 'Within 120 Days',

    // Preview area
    previewTitle: isSpanish ? 'Carta de Solicitud Generada' : 'Generated Request Letter',
    previewSub: isSpanish ? 'Formateado instantáneamente según los estándares oficiales de la agencia' : 'Instantly formatted to official agency standards',
    copiedText: isSpanish ? '¡Copiado!' : 'Copied!',
    copyLabel: isSpanish ? 'Copiar al Portapapeles' : 'Copy to Clipboard',
    printLabel: isSpanish ? 'Imprimir Carta' : 'Print Letter',
    disclaimerTitle: isSpanish ? 'Aviso Legal:' : 'Legal Disclaimer:',
    disclaimerText: isSpanish 
      ? 'El Navegador de Necesidades Especiales de CA es una herramienta educativa. Este generador proporciona plantillas que hacen referencia a las regulaciones de California, pero no constituye asesoría legal formal. Revise y adjunte siempre los registros médicos de respaldo antes de enviar cartas a las agencias.'
      : 'The CA Special Needs Navigator is an educational tool. This builder provides templates referencing California regulations but does not constitute formal legal counsel. Always review and attach supporting medical records before sending letters to agencies.'
  };

  return (
    <div className="animate-fade-in dashboard-grid-12">
      
      {/* Template Selector & Settings Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="grid-col-lg-4">
        
        <AppealsSelector
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
          isSpanish={isSpanish}
          t={t}
        />

        {/* Personal Contact Details */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            {t.personalDetails}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.parentNameLabel}</label>
              <input 
                type="text" 
                value={parentName} 
                onChange={(e) => setParentName(e.target.value)} 
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.parentAddressLabel}</label>
              <input 
                type="text" 
                value={parentAddress} 
                onChange={(e) => setParentAddress(e.target.value)} 
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.parentPhoneLabel}</label>
              <input 
                type="text" 
                value={parentPhone} 
                onChange={(e) => setParentPhone(e.target.value)} 
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.parentEmailLabel}</label>
              <input 
                type="text" 
                value={parentEmail} 
                onChange={(e) => setParentEmail(e.target.value)} 
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.childNameLabel}</label>
              <input 
                type="text" 
                value={childName} 
                onChange={(e) => setChildName(e.target.value)} 
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.childDobLabel}</label>
              <input 
                type="date" 
                value={childDob} 
                onChange={(e) => setChildDob(e.target.value)} 
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Template Customizer & Preview Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="grid-col-lg-8">
        
        <AppealsForm
          activeTemplate={activeTemplate}
          isSpanish={isSpanish}
          t={t}
          calculateDateOffset={calculateDateOffset}

          // IEP
          schoolDistrict={schoolDistrict}
          setSchoolDistrict={setSchoolDistrict}
          schoolName={schoolName}
          setSchoolName={setSchoolName}
          iepSubmissionDate={iepSubmissionDate}
          setIepSubmissionDate={setIepSubmissionDate}
          iepConcerns={iepConcerns}
          setIepConcerns={setIepConcerns}
          customIepText={customIepText}
          setCustomIepText={setCustomIepText}

          // IHSS
          ihssCounty={ihssCounty}
          setIhssCounty={setIhssCounty}
          ihssDenialDate={ihssDenialDate}
          setIhssDenialDate={setIhssDenialDate}
          ihssSafetyConcerns={ihssSafetyConcerns}
          setIhssSafetyConcerns={setIhssSafetyConcerns}
          customIhssText={customIhssText}
          setCustomIhssText={setCustomIhssText}

          // RC
          regionalCenterName={regionalCenterName}
          setRegionalCenterName={setRegionalCenterName}
          rcDenialDate={rcDenialDate}
          setRcDenialDate={setRcDenialDate}
          rcDiagnosis={rcDiagnosis}
          setRcDiagnosis={setRcDiagnosis}
          rcLimitations={rcLimitations}
          setRcLimitations={setRcLimitations}
          customRcText={customRcText}
          setCustomRcText={setCustomRcText}

          // SSI
          ssiDate={ssiDate}
          setSsiDate={setSsiDate}
          ssiDiagnosis={ssiDiagnosis}
          setSsiDiagnosis={setSsiDiagnosis}
          ssiClinicInfo={ssiClinicInfo}
          setSsiClinicInfo={setSsiClinicInfo}
          customSsiText={customSsiText}
          setCustomSsiText={setCustomSsiText}

          // EPSDT
          therapyType={therapyType}
          setTherapyType={setTherapyType}
          denialReason={denialReason}
          setDenialReason={setDenialReason}
          insurancePlanName={insurancePlanName}
          setInsurancePlanName={setInsurancePlanName}
          prescribingDoctor={prescribingDoctor}
          setPrescribingDoctor={setPrescribingDoctor}
          customTherapyText={customTherapyText}
          setCustomTherapyText={setCustomTherapyText}
        />

        <AppealTemplateCard
          letterText={letterText}
          t={t}
        />
        
        {/* Legal Advisory warning */}
        <div style={{ 
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
            <strong>{t.disclaimerTitle}</strong> {t.disclaimerText}
          </p>
        </div>

      </div>

    </div>
  );
}
