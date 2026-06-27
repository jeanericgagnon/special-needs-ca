'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useChildProfile, TabType } from './ChildProfileContext';
import { 
  User, Trash2, MapPin, ChevronRight, AlertCircle, Phone, 
  Globe, Scale, Clock, Printer, Copy, CheckCircle2, Activity, 
  Mail, Check
} from 'lucide-react';
import { 
  toggleReminderAction, addReminderAction, deleteReminderAction,
  getSafetyIncidentsAction, saveSafetyIncidentAction,
  getParentDeclarationAction, saveParentDeclarationAction
} from '../child-actions';

interface CareRoadmapPanelProps {
  isSpanish?: boolean;
}

interface SafetyIncident {
  id: string;
  time: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'critical';
  details: string;
  intervention: string;
}

export default function CareRoadmapPanel({ isSpanish = false }: CareRoadmapPanelProps) {
  const { 
    currentChild, 
    conditions, 
    needs, 
    counties,
    savedStatuses, 
    savedChecklist, 
    savedReminders, 
    countyDetails,
    localAdvocates,
    setActiveTab,
    parentName,
    setParentName,
    childName,
    setChildName,
    stateConfig
  } = useChildProfile();

  // Resolve condition, need, and county details at top of render
  const childConditions = conditions.filter(c => currentChild?.conditionIds?.includes(c.id));
  const childNeeds = needs.filter(n => currentChild?.functionalNeedIds?.includes(n.id));
  const activeCounty = counties.find(c => c.id === currentChild?.county_id);

  // Component States
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [doctorName, setDoctorName] = useState<string>('');
  const [declarationText, setDeclarationText] = useState<string>('');
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<'cover' | 'pediatrician' | 'log' | 'checklist' | 'preview'>('cover');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedLetter, setCopiedLetter] = useState<boolean>(false);
  const [messageType, setMessageType] = useState<'email' | 'phone'>('email');
  
  // Quick-add Reminder States
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDate, setQuickDate] = useState('');

  // Calculate age helper
  const calculateAge = (dobString?: string) => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const childAge = currentChild ? calculateAge(currentChild.dob) : 0;

  // Status Labels Helper
  const getStatusLabel = (progId: string) => {
    const statusObj = savedStatuses.find(s => s.program_id === progId);
    return statusObj ? statusObj.status : 'untracked';
  };

  // Generate Default Declaration Text (using useCallback to prevent hook dependency warnings)
  const generateDefaultDeclaration = useCallback(() => {
    if (!currentChild) return;
    
    const conditionsStr = childConditions.map(c => c.name).join(', ') || (isSpanish ? 'Retraso en el desarrollo' : 'Developmental delays');
    const countyName = activeCounty?.name || (isSpanish ? 'su condado local' : 'local county');
    
    let text = '';
    if (isSpanish) {
      text = `DECLARACIÓN DEL PADRE/CUIDADOR PRINCIPAL (APOYO A LA SUPERVISIÓN PROTECTORA)

Yo, ${parentName || '[Nombre del Padre]'}, declaro bajo pena de perjurio lo siguiente:

1. Soy el padre y cuidador principal de ${childName || '[Nombre del Niño]'} (nacido el ${currentChild.dob || '[Fecha de Nacimiento]'}), quien reside conmigo en el Condado de ${countyName}.
2. ${childName} ha sido diagnosticado formalmente con: ${conditionsStr}.
3. Debido a su severo retraso mental y cognitivo, ${childName} carece por completo de conciencia del peligro y no puede dirigir sus propias acciones de seguridad. Requiere monitoreo continuo de seguridad las 24 horas del día para evitar lesiones graves, autolesiones o la muerte.
4. Las áreas específicas de peligro en las que se deambula o se autolesiona incluyen:
   - Riesgo crítico de fuga/escape (abre cerraduras de puertas, corre hacia calles con tráfico).
   - Comportamientos de Pica (ingiere piedras, objetos pequeños, plásticos).
   - Comportamientos autolesivos durante frustraciones sensoriales (golpearse la cabeza contra la pared).
   - Incompetencia de seguridad general (intenta subir a mostradores altos de la cocina, tocar estufas calientes).

Adjunto a esta declaración un Registro de Incidentes de seguridad y pido que estos hechos se consideren en la evaluación de la elegibilidad de ${stateConfig?.personalCareProgram || 'In-Home Supportive Services (IHSS)'} y del ${stateConfig?.catchmentName || 'Centro Regional'}.

Fecha: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
Firma: __________________________________________________
Parent/Cuidador`;
    } else {
      text = `PARENT DECLARATION & SAFETY CASE SPECIFICATIONS (IN SUPPORT OF PROTECTIVE SUPERVISION)

I, ${parentName || '[Parent/Guardian Name]'}, declare as follows:

1. I am the parent and primary caregiver of ${childName || '[Child Name]'} (DOB: ${currentChild.dob || '[DOB]'}), who resides with me in ${countyName} County, ${stateConfig?.name || 'California'}.
2. ${childName} is diagnosed with: ${conditionsStr}.
3. Due to severe mental impairment and cognitive delays, ${childName} has a complete lack of safety awareness and is unable to self-direct or recognize physical hazards. They require continuous 24/7 safety oversight and Protective Supervision to prevent severe bodily injury or accidental death.
4. Specific dangerous behaviors requiring immediate caregiver physical intervention include:
   - Critical elopement/wandering (unlocks deadbolts, flees toward active streets/traffic).
   - Pica hazards (ingests decorative gravel, dirt, plastics, and non-edible items).
   - Self-injurious outbursts during sensory dysregulation (violent head-banging on hard flooring).
   - Severe fall and burn risks (scales kitchen counters to access high shelves, reaches for open flames/hot stovetops).

Attached is a Safety Incident Log documenting these behaviors and intervention history. I request that these records be formally appended to my child's case file for ${stateConfig?.personalCareProgram || 'IHSS'} and ${stateConfig?.catchmentName || 'Regional Center'} assessment.

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Signature: __________________________________________________
Parent/Primary Caregiver`;
    }

    setDeclarationText(text);
  }, [
    currentChild,
    childConditions,
    activeCounty,
    isSpanish,
    parentName,
    childName,
    stateConfig?.catchmentName,
    stateConfig?.name,
    stateConfig?.personalCareProgram,
  ]);

  // Hydrate child-specific details (use Promise.resolve().then() to avoid calling setState synchronously in effect)
  useEffect(() => {
    if (currentChild) {
      const childId = currentChild.id;
      
      Promise.resolve().then(() => {
        // Load safety incidents from server action
        getSafetyIncidentsAction(childId).then(res => {
          if (res.success && res.incidents && res.incidents.length > 0) {
            setIncidents(res.incidents.map((inc: { id: string; time: string; category: string; risk_level?: string; riskLevel?: string; details: string; intervention: string }) => ({
              id: inc.id,
              time: inc.time,
              category: inc.category,
              riskLevel: (inc.risk_level || inc.riskLevel) as 'low' | 'medium' | 'critical',
              details: inc.details,
              intervention: inc.intervention
            })));
          } else {
            // Default incidents for preview
            const defaultInc = [
              {
                id: 'inc-1',
                time: '08:15 AM',
                category: 'Elopement / Wandering',
                riskLevel: 'critical' as const,
                details: 'Unlocked the front deadbolt lock while parent was in kitchen. Child eloped into the active driveway toward the main street with zero awareness of oncoming cars.',
                intervention: 'Chased child down, retrieved physically, carried back inside, locked deadbolt, and added safety cover to the doorknob.'
              },
              {
                id: 'inc-2',
                time: '11:30 AM',
                category: 'Pica (Swallowing non-foods)',
                riskLevel: 'critical' as const,
                details: 'Attempted to swallow small decorative gravel pebbles from a potted indoor plant, presenting an immediate choking/toxicity risk.',
                intervention: 'Verbally redirected, physically swept mouth to clear pebbles, and moved all potted plants to locked shelving areas.'
              }
            ];
            setIncidents(defaultInc);
            // Save defaults in background
            defaultInc.forEach(inc => {
              saveSafetyIncidentAction({
                id: inc.id,
                time: inc.time,
                category: inc.category,
                risk_level: inc.riskLevel,
                details: inc.details,
                intervention: inc.intervention
              }, childId);
            });
          }
        });

        // Load Parent Declaration & Doctor Name from database
        getParentDeclarationAction(childId).then(res => {
          if (res.success && res.declaration) {
            setDoctorName(res.declaration.doctor_name || '');
            setDeclarationText(res.declaration.declaration_text || '');
          } else {
            setDoctorName('');
            generateDefaultDeclaration();
          }
        });
      });
    }
  }, [currentChild, generateDefaultDeclaration]);

  // Re-generate declaration when parent or child details change (use Promise.resolve().then() to avoid state-in-effect issues)
  useEffect(() => {
    if (currentChild) {
      Promise.resolve().then(() => {
        getParentDeclarationAction(currentChild.id).then(res => {
          if (!res.success || !res.declaration || !res.declaration.declaration_text) {
            generateDefaultDeclaration();
          }
        });
      });
    }
  }, [currentChild, generateDefaultDeclaration]);

  // Persist edits to Database
  const handleDeclarationChange = (text: string) => {
    setDeclarationText(text);
    if (currentChild) {
      saveParentDeclarationAction(currentChild.id, text, doctorName);
    }
  };

  const handleDoctorNameChange = (name: string) => {
    setDoctorName(name);
    if (currentChild) {
      saveParentDeclarationAction(currentChild.id, declarationText, name);
    }
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(declarationText);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  if (!currentChild) return null;

  // ----------------------------------------------------
  // PRIORITIZATION ENGINE
  // ----------------------------------------------------
  const prioritiesList = [];

  const hasSafetyConcerns = currentChild.functionalNeedIds?.includes('protective-supervision');
  const isMedicallyComplex = currentChild.conditionIds?.some(id => 
    ['tracheostomy-dependency', 'ventilator-dependency', 'gastrostomy-g-tube-dependency', 
     'short-bowel-syndrome', 'cystic-fibrosis-cf', 'type-1-diabetes', 
     'chronic-kidney-disease-ckd', 'severe-hemophilia'].includes(id)
  );

  const ihssStatus = getStatusLabel('ihss-for-children');
  const rcStatus = getStatusLabel('regional-centers');
  const esStatus = getStatusLabel('early-start');
  const iepStatus = getStatusLabel('iep-special-education');
  const isCa = stateConfig?.code === 'CA';

  // Priority 1: IHSS & Protective Supervision
  if (hasSafetyConcerns && (ihssStatus === 'untracked' || ihssStatus === 'not_applied')) {
    prioritiesList.push({
      id: 'ihss-safety',
      rank: 1,
      severity: 'critical' as const,
      title: isSpanish ? `Solicitar ${stateConfig?.personalCareProgram || 'IHSS'} y Supervisión Protectora` : `Apply for ${stateConfig?.personalCareProgram || 'IHSS'} & Request Protective Supervision`,
      description: isSpanish 
        ? `Basado en los riesgos de fuga/seguridad de ${childName} y el estado de ${stateConfig?.personalCareProgram || 'IHSS'}, priorice la solicitud y comience la bitácora de incidentes para documentar el nivel de supervisión que su familia reporta.`
        : `Based on ${childName}'s safety hazards (elopement/self-injury) and untracked ${stateConfig?.personalCareProgram || 'IHSS'} status, prioritize the application and start a safety incident log to document the level of supervision your family reports.`,
      actionLabel: isSpanish ? 'Ir a Registro de Seguridad' : 'Go to Safety Log',
      targetTab: 'ihss' as TabType
    });
  }

  // Priority 2: Regional Center Intake (Lanterman vs Early Start)
  const isDevelopmentalDiagnoses = childConditions.some(c => c.regional_center_relevance === 1);
  if (isDevelopmentalDiagnoses && stateConfig) {
    if (childAge < 3 && (esStatus === 'untracked' || esStatus === 'not_applied')) {
      prioritiesList.push({
        id: 'rc-early-start',
        rank: 2,
        severity: 'high' as const,
        title: isSpanish ? `Iniciar Admisión en ${stateConfig.earlyInterventionLabel}` : `Initiate ${stateConfig.earlyInterventionLabel} Intake`,
        description: isSpanish
          ? `Dado que ${childName} es menor de 3 años y tiene diagnósticos relevantes, califica para la intervención temprana de ${stateConfig.earlyInterventionLabel}. Contacte a la oficina de ${stateConfig.catchmentName} para la evaluación.`
          : `${childName} is under 3 years old with developmental risk factors. Request early intervention services under the ${stateConfig.earlyInterventionLabel} program via your local ${stateConfig.catchmentName}.`,
        actionLabel: isSpanish ? `Ver Directorio de ${stateConfig.catchmentName}` : `View ${stateConfig.catchmentName} Directory`,
        targetTab: 'county' as TabType
      });
    } else if (childAge >= 3 && (rcStatus === 'untracked' || rcStatus === 'not_applied')) {
      prioritiesList.push({
        id: 'rc-lanterman',
        rank: 2,
        severity: 'high' as const,
        title: isSpanish ? (isCa ? 'Establecer Admisión al Centro Regional (Ley Lanterman)' : `Establecer Admisión a ${stateConfig.catchmentName}`) : (isCa ? 'Establish Regional Center Lanterman Intake' : `Establish ${stateConfig.catchmentName} Intake`),
        description: isSpanish
          ? `Su hijo tiene diagnósticos que califican según las pautas de ${stateConfig.name} (como autismo, parálisis cerebral, síndrome de Down o discapacidad intelectual). Inicie el proceso de admisión.`
          : `Initiate a formal ${stateConfig.catchmentName} eligibility assessment. ${stateConfig.catchmentName} services fund respite, behavioral therapies, and critical waivers (such as ${stateConfig.medicaidName} institutional deeming).`,
        actionLabel: isSpanish ? 'Ver Contacto de Admisión' : 'View Intake Contacts',
        targetTab: 'county' as TabType
      });
    }
  }

  // Priority 3: School District IEP Safety Protocols
  if (childAge >= 3 && hasSafetyConcerns && (iepStatus === 'approved' || iepStatus === 'applied')) {
    prioritiesList.push({
      id: 'iep-safety',
      rank: 3,
      severity: 'high' as const,
      title: isSpanish ? 'Añadir Protocolos de Fuga al IEP Escolar' : 'Add Elopement Protocols to School IEP',
      description: isSpanish
        ? `Asegúrese de que el IEP de ${childName} incluya metas específicas de seguridad, planes de deambulación y ayuda 1:1. Esto sirve como evidencia legal esencial para su caso de ${stateConfig?.personalCareProgram || 'IHSS'}.`
        : `Ensure ${childName}'s school IEP contains an active elopement prevention plan, safety goals, and 1:1 supervision protocols. This provides critical clinical evidence for county social workers.`,
      actionLabel: isSpanish ? 'Abrir Herramientas IEP' : 'Open IEP Prep Tools',
      targetTab: 'iepprep' as TabType
    });
  }

  // Priority 4: Waitlists tracking
  const hasWaitlists = savedReminders.length > 0;
  if (hasWaitlists) {
    prioritiesList.push({
      id: 'waitlist-mgmt',
      rank: 4,
      severity: 'medium' as const,
      title: isSpanish ? 'Monitorear Listas de Espera y Citas' : 'Monitor Waitlists & Appointments',
      description: isSpanish
        ? `Tiene plazos y recordatorios de citas pendientes. Realice un seguimiento constante para evitar perder ventanas de apelación o de inscripción de exenciones.`
        : `You have active reminders and waitlist targets. Stay on top of clinical evaluations and appeal filing dates to protect waiver enrollment queues.`,
      actionLabel: isSpanish ? 'Ver Calendario y Listas' : 'View Calendar & Waitlists',
      targetTab: 'waitlists' as TabType
    });
  }

  // Priority 5: Evidence Packet (Always shown)
  prioritiesList.push({
    id: 'evidence-packet-priority',
    rank: 5,
    severity: 'medium' as const,
    title: isSpanish ? 'Compilar Paquete de Evidencias de Casos' : 'Compile Case Evidence Packet',
    description: isSpanish
      ? 'Genere y prepare un paquete consolidado (Declaración del Padre, Registro de Incidentes de Seguridad de 24 horas y Guía del Médico) listo para imprimir y entregar a los evaluadores.'
      : 'Compile your Safety logs, Parent Declaration, and Doctor guidance instructions into a unified, print-ready document packet for your upcoming casework evaluation.',
    actionLabel: isSpanish ? 'Abrir Creador de Evidencias' : 'Open Evidence Builder',
    actionCallback: () => {
      setIsWizardOpen(true);
      setWizardStep('cover');
    },
    targetTab: 'roadmap' as TabType
  });

  // Urgency colors helper
  const getSeverityBadgeStyles = (severity: string) => {
    if (severity === 'critical') return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' };
    if (severity === 'high') return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)', text: '#d97706' };
    return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' };
  };

  // ----------------------------------------------------
  // MESSAGE HELPER ENGINE
  // ----------------------------------------------------
  const topPriority = prioritiesList[0] || { id: 'default' };
  
  const getNextMessageScript = () => {
    const todayStr = new Date().toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const rcName = countyDetails?.regionalCenters?.[0]?.name || stateConfig?.catchmentName || (isSpanish ? 'Agencia de Discapacidad local' : 'local Developmental Services Agency');
    const intakeContact = childAge < 3 
      ? (isCa ? (countyDetails?.regionalCenters?.[0]?.early_start_contact || (isSpanish ? 'Coordinador de Early Start' : 'Early Start Coordinator')) : (isSpanish ? 'Coordinador de Intervención Temprana' : 'Early Intervention Coordinator'))
      : (isCa ? (countyDetails?.regionalCenters?.[0]?.lanterman_intake_contact || (isSpanish ? 'Coordinador de Admisión de Lanterman' : 'Lanterman Intake Coordinator')) : (isSpanish ? 'Coordinador de Admisión' : 'Intake Coordinator'));

    if (topPriority.id === 'ihss-safety') {
      if (messageType === 'email') {
        return isSpanish 
          ? `De: ${parentName || '[Su Nombre]'}
Para: Oficina de ${stateConfig?.personalCareProgram || 'IHSS'} del Condado de ${activeCounty?.name || '[Condado]'}
Asunto: Solicitud de Evaluación de ${stateConfig?.personalCareProgram || 'IHSS'} - ${childName} (F.Nac: ${currentChild.dob})

Estimado Intake de ${stateConfig?.personalCareProgram || 'IHSS'}:

Por la presente solicito una evaluación inicial de ${stateConfig?.personalCareProgram || 'Servicios de Apoyo en el Hogar (IHSS)'} para mi hijo, ${childName} (DOB: ${currentChild.dob}) en este día ${todayStr}. 

Mi hijo tiene diagnósticos de ${childConditions.map(c => c.name).join(', ') || 'retrasos del desarrollo'} y exhibe una falta severa de conciencia de seguridad con comportamientos de riesgo continuo que requieren supervisión y cuidado (incluyendo fugas frecuentes y pica).

Por favor, envíeme el formulario de solicitud de servicio y los detalles de la certificación médica correspondiente.

Atentamente,
${parentName || '[Su Nombre]'}
Teléfono: [Su Teléfono]`
          : `From: ${parentName || '[Your Name]'}
To: County of ${activeCounty?.name || '[County]'} ${stateConfig?.personalCareProgram || 'IHSS'} Intake Office
Subject: Initial ${stateConfig?.personalCareProgram || 'IHSS'} Assessment Request - ${childName} (DOB: ${currentChild.dob})

Dear Intake Coordinator,

I am writing to formally request a ${stateConfig?.personalCareProgram || 'In-Home Supportive Services (IHSS)'} program assessment for my minor child, ${childName} (DOB: ${currentChild.dob}) on this date of ${todayStr}. 

Due to my child's developmental diagnoses of ${childConditions.map(c => c.name).join(', ') || 'developmental delays'}, they exhibit severe cognitive impairments and a complete lack of safety boundaries. Specifically, they require constant safety supervision due to risk behaviors (elopement and swallowing non-foods).

Please send me the necessary application and medical certification forms to initiate this request.

Sincerely,
${parentName || '[Your Name]'}
Phone: [Your Phone Number]`;
      } else {
        return isSpanish
          ? `Llamada telefónica a la Oficina de ${stateConfig?.personalCareProgram || 'IHSS'} del Condado:
(Diga esto al operador de Admisión / Intake)

"Hola, mi nombre es ${parentName || '[Su Nombre]'}. Estoy llamando para solicitar una evaluación de ${stateConfig?.personalCareProgram || 'IHSS'} para mi hijo menor de edad, ${childName}. Nació el ${currentChild.dob || '[Fecha]'}. Mi hijo tiene un diagnóstico de ${childConditions[0]?.name || 'un retraso del desarrollo'} y tiene necesidades críticas de seguridad que requieren supervisión las 24 horas del día debido a comportamientos de fuga. ¿Podría transferirme con el oficial de admisión de ${stateConfig?.personalCareProgram || 'IHSS'} o decirme cómo enviar la solicitud?"`
          : `Phone Call to County ${stateConfig?.personalCareProgram || 'IHSS'} Intake Office:
(Read this script to the intake caseworker)

"Hello, my name is ${parentName || '[Your Name]'}. I am calling to request an initial ${stateConfig?.personalCareProgram || 'IHSS'} evaluation for my minor child, ${childName}. Their date of birth is ${currentChild.dob || '[DOB]'}. My child has a diagnosis of ${childConditions[0]?.name || 'developmental delay'} and has severe, high-risk safety needs requiring continuous oversight to prevent wandering. Who is the intake worker I can speak with to initiate this case?"`;
      }
    } else if (topPriority.id === 'rc-early-start' || topPriority.id === 'rc-lanterman') {
      if (messageType === 'email') {
        return isSpanish
          ? `De: ${parentName || '[Su Nombre]'}
Para: Admisión del ${rcName}
Asunto: Solicitud de Evaluación de ${isCa ? 'Ley Lanterman' : stateConfig?.catchmentName || 'Admisión'} - ${childName} (F.Nac: ${currentChild.dob})

Estimado Equipo de Admisión:

En este día ${todayStr}, solicito formalmente una evaluación de elegibilidad de ${isCa ? 'Ley Lanterman' : stateConfig?.catchmentName || 'Servicios'} para mi hijo, ${childName} (DOB: ${currentChild.dob}). 

Mi hijo tiene un diagnóstico de ${childConditions.map(c => c.name).join(', ') || 'retraso de desarrollo'} y requiere servicios de coordinación de casos, respiro y apoyos de exención de la agencia de discapacidad. 

Por favor envíeme los formularios correspondientes y el oficial asignado para el proceso.

Atentamente,
${parentName || '[Su Nombre]'}
Teléfono: [Su Teléfono]`
          : `From: ${parentName || '[Your Name]'}
To: Intake Department, ${rcName}
Subject: ${isCa ? 'Lanterman Act' : stateConfig?.catchmentName || 'Developmental Services'} Assessment Request - ${childName} (DOB: ${currentChild.dob})

Dear Intake Department,

I am writing to formally request a ${isCa ? 'Lanterman Act' : stateConfig?.catchmentName || 'Developmental Services'} eligibility evaluation for my child, ${childName} (DOB: ${currentChild.dob}) on this date ${todayStr}.

My child is diagnosed with ${childConditions.map(c => c.name).join(', ') || 'developmental conditions'} and presents significant functional limitations in multiple domains (communication, safety, and self-care). We wish to establish intake to coordinate respite hours and evaluate state Medicaid waivers.

Please let me know the contact information for our assigned intake coordinator and what documents are required to begin.

Sincerely,
${parentName || '[Your Name]'}
Phone: [Your Phone Number]`;
      } else {
        return isSpanish
          ? `Llamada a ${rcName}:
(Diga esto al departamento de admisiones)

"Hola, mi nombre es ${parentName || '[Su Nombre]'}. Estoy llamando para solicitar una evaluación de admisión de ${isCa ? 'la Ley Lanterman' : stateConfig?.catchmentName || 'servicios de discapacidad'} para mi hijo, ${childName}. Él tiene un diagnóstico de ${childConditions[0]?.name || 'un retraso del desarrollo'}. ¿Podría ponerme en contacto con el departamento de admisiones o con ${intakeContact} para iniciar el proceso?"`
          : `Phone Call to ${rcName}:
(Read this script to the receptionist or intake worker)

"Hello, my name is ${parentName || '[Your Name]'}. I am calling to request a ${isCa ? 'Lanterman Act' : stateConfig?.catchmentName || 'developmental eligibility'} intake and assessment for my child, ${childName}. They have a diagnosis of ${childConditions[0]?.name || 'developmental condition'} and we want to establish coordination of services. Can you connect me to ${intakeContact} in the Intake Unit please?"`;
      }
    } else if (topPriority.id === 'iep-safety') {
      if (messageType === 'email') {
        return isSpanish
          ? `De: ${parentName || '[Su Nombre]'}
Para: Coordinación de Educación Especial, Distrito Escolar
Asunto: Solicitud de Reunión del IEP Escolar - Protocolos de Seguridad: ${childName}

Estimado Equipo del IEP:

Hoy ${todayStr}, solicito formalmente que se convoque a una reunión del IEP de manera oportuna para mi hijo, ${childName}, de conformidad con las leyes estatales aplicables de educación especial. 

El propósito de la reunión es discutir y añadir protocolos específicos de prevención de fugas, metas de seguridad física y evaluación de apoyo de supervisión 1:1. Esto se debe a incidentes recientes fuera de la escuela y necesidades de seguridad de deambular que he documentado.

Por favor, envíeme fechas propuestas para la reunión.

Atentamente,
${parentName || '[Su Nombre]'}`
          : `From: ${parentName || '[Your Name]'}
To: Special Education Coordinator, School District
Subject: Request to Convene IEP Meeting - Urgent Safety Protocols - ${childName}

Dear IEP Team,

I am writing to formally request that we convene an IEP team meeting for my child, ${childName}, as soon as possible on this date ${todayStr}.

The purpose of this meeting is to review and implement specific safety accommodations in their IEP, including a formal elopement prevention plan, physical safety boundaries, and the evaluation for a 1:1 safety aide. We have observed increased dangerous wandering behaviors that must be addressed to ensure their safe school placement.

Please provide a few proposed dates and times for this meeting within the statutory timeline.

Sincerely,
${parentName || '[Your Name]'}`;
      } else {
        return isSpanish
          ? `Llamada telefónica a la escuela o al distrito:
"Hola, mi nombre es ${parentName || '[Su Nombre]'}. Soy el padre de ${childName}. Me gustaría hablar con el director de educación especial o el administrador de casos del IEP para solicitar formalmente una reunión del IEP para añadir un plan de seguridad contra fugas de emergencia para mi hijo. ¿Quién es la persona adecuada para enviarle este correo de solicitud por escrito?"`
          : `Phone Call to School Special Education Office:
"Hello, my name is ${parentName || '[Your Name]'}. I am the parent of ${childName}. I need to request an IEP meeting to add safety accommodations and an elopement protocol for my child due to safety concerns. Who is the program specialist or program manager I should email to start the timeline for convening this meeting?"`;
      }
    } else {
      // Default / Inquiry Template
      if (messageType === 'email') {
        return `Subject: Case Inquiry - ${childName}

Dear Case Coordinator,

I am checking on the status of our file for ${childName}. Please let me know if you need any additional evidence or safety documentation to progress our case.

Sincerely,
${parentName || '[Your Name]'}`;
      } else {
        return `Phone Script:
"Hello, I am calling to follow up on the application status for my child, ${childName}. Can you let me know if there are any missing documents or evaluations needed from my end?"`;
      }
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(getNextMessageScript());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  // ----------------------------------------------------
  // DEADLINES & REMINDERS
  // ----------------------------------------------------
  const sortedReminders = [...savedReminders].sort((a, b) => {
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  const getUrgencyBadge = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const date = new Date(dateStr);
    date.setHours(0,0,0,0);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { 
        label: isSpanish ? 'Vencido' : 'Overdue', 
        bg: 'rgba(239,68,68,0.15)', 
        color: '#ef4444' 
      };
    } else if (diffDays <= 7) {
      return { 
        label: isSpanish ? `Urgente (en ${diffDays}d)` : `Urgent (${diffDays}d left)`, 
        bg: 'rgba(239,68,68,0.1)', 
        color: '#ef4444' 
      };
    } else if (diffDays <= 30) {
      return { 
        label: isSpanish ? `Próximo (${diffDays}d)` : `Soon (${diffDays}d left)`, 
        bg: 'rgba(245, 158, 11, 0.1)', 
        color: '#d97706' 
      };
    } else {
      return { 
        label: isSpanish ? 'En agenda' : 'Scheduled', 
        bg: 'rgba(59, 130, 246, 0.1)', 
        color: '#3b82f6' 
      };
    }
  };

  const handleToggleReminderLocal = async (remId: string, currentVal: number) => {
    await toggleReminderAction(remId, currentVal === 0);
  };

  const handleDeleteReminderLocal = async (remId: string) => {
    await deleteReminderAction(remId);
  };

  const handleAddReminderLocal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || !quickDate) return;
    await addReminderAction(currentChild.id, quickTitle.trim(), quickDate, null);
    setQuickTitle('');
    setQuickDate('');
  };

  return (
    <div className="animate-fade-in flex-col-gap-2">
      
      {/* SECTION 1: CHILD PROFILE COMMAND CARD */}
      <div 
        className="glass-panel" 
        style={{ 
          background: 'var(--glass-bg)',
          borderRadius: '24px', 
          overflow: 'hidden', 
          border: '1px solid var(--glass-border)',
          padding: '2rem',
          boxShadow: 'var(--glass-shadow)',
          position: 'relative'
        }}
      >
        {/* Decorative Gradient Blob */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '180px', height: '180px', background: 'var(--accent-gradient)', opacity: 0.08, filter: 'blur(40px)', pointerEvents: 'none' }}></div>
        
        <div className="flex-row-between-start">
          <div>
            <div className="flex-row-center-gap-2" style={{ marginBottom: '0.5rem' }}>
              <div className="badge-primary-bg">
                <User size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {childName}
                  <span className="badge-standard">
                    {childAge} {isSpanish ? 'años' : 'years old'}
                  </span>
                </h2>
                <div className="meta-text">
                  <MapPin size={14} />
                  <span>{activeCounty ? `${activeCounty.name} County, CA` : (isSpanish ? 'Condado no especificado' : 'County not specified')}</span>
                </div>
              </div>
            </div>

            {/* Diagnoses and Needs List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                <strong>{isSpanish ? 'Diagnósticos:' : 'Diagnoses:'}</strong>{' '}
                <span style={{ color: 'var(--text-light)' }}>
                  {childConditions.map(c => c.name).join(', ') || (isSpanish ? 'Ninguno registrado' : 'None registered')}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                <strong>{isSpanish ? 'Necesidades Funcionales:' : 'Functional Needs:'}</strong>{' '}
                <span style={{ color: 'var(--text-light)' }}>
                  {childNeeds.map(n => n.name).join(', ') || (isSpanish ? 'Ninguna registrada' : 'None registered')}
                </span>
              </div>
            </div>
          </div>

          {/* Program Status Badges Grid */}
          <div className="stat-grid-3 grid-col-lg-4">
            <div className="stat-box-small">
              <span className="stat-box-label">{stateConfig?.code === 'CA' ? 'IHSS' : stateConfig?.personalCareProgram || 'IHSS'}</span>
              <strong className="stat-box-val">
                {ihssStatus === 'approved' ? '🟢 ' + (isSpanish ? 'Aprobado' : 'Approved') : 
                 ihssStatus === 'applied' ? '🔵 ' + (isSpanish ? 'Pendiente' : 'Pending') : 
                 ihssStatus === 'denied' ? '🔴 ' + (isSpanish ? 'Denegado' : 'Denied') : '⚪ ' + (isSpanish ? 'Sin rastrear' : 'Untracked')}
              </strong>
            </div>
            <div className="stat-box-small">
              <span className="stat-box-label">{stateConfig?.code === 'CA' ? (isSpanish ? 'Centro Reg.' : 'Reg. Center') : stateConfig?.catchmentName || 'Agency'}</span>
              <strong style={{ fontSize: '0.85rem' }} className="stat-box-val">
                {rcStatus === 'approved' ? '🟢 ' + (isSpanish ? 'Aprobado' : 'Approved') : 
                 rcStatus === 'applied' ? '🔵 ' + (isSpanish ? 'Pendiente' : 'Pending') : 
                 rcStatus === 'denied' ? '🔴 ' + (isSpanish ? 'Denegado' : 'Denied') : '⚪ ' + (isSpanish ? 'Sin rastrear' : 'Untracked')}
              </strong>
            </div>
            <div className="stat-box-small">
              <span className="stat-box-label">IEP</span>
              <strong className="stat-box-val">
                {iepStatus === 'approved' ? '🟢 ' + (isSpanish ? 'Aprobado' : 'Approved') : 
                 iepStatus === 'applied' ? '🔵 ' + (isSpanish ? 'Pendiente' : 'Pending') : '⚪ ' + (isSpanish ? 'Sin rastrear' : 'Untracked')}
              </strong>
            </div>
          </div>
        </div>

        {/* Alerts / Risks Banner */}
        <div className="tag-row">
          {hasSafetyConcerns && (
            <span className="tag-red">
              <AlertCircle size={12} />
              {isSpanish ? 'RIESGO CRÍTICO DE SEGURIDAD / FUGA' : 'CRITICAL SAFETY / ELOPEMENT RISK'}
            </span>
          )}
          {isMedicallyComplex && (
            <span className="tag-blue">
              <Activity size={12} />
              {isSpanish ? 'COMPLEJIDAD MÉDICA REGISTRADA' : 'COMPLEX MEDICAL NEEDS REGISTERED'}
            </span>
          )}
          {!hasSafetyConcerns && !isMedicallyComplex && (
            <span className="tag-gray">
              <CheckCircle2 size={12} color="var(--primary-color)" />
              {isSpanish ? 'Perfil de Cuidados Activo' : 'Care Profile Active'}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }} className="iep-grid-layout">
        
        {/* LEFT COLUMN: PRIORITIES & EMAIL HELPER */}
        <div style={{ gridColumn: '1 / 8', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="grid-col-lg-7">
          
          {/* SECTION 2: TOP PRIORITIES CARD */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <Activity size={20} color="var(--primary-color)" />
              {isSpanish ? 'Mis Próximas Acciones Prioritarias' : 'Your Priority Roadmap Action Items'}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {prioritiesList.map((pri) => {
                const colors = getSeverityBadgeStyles(pri.severity);
                return (
                  <div 
                    key={pri.id} 
                    style={{ 
                      border: '1px solid var(--glass-border)', 
                      borderRadius: '16px', 
                      padding: '1.25rem',
                      background: 'rgba(255, 255, 255, 0.4)',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                      transition: 'transform 0.2s',
                      cursor: 'default'
                    }}
                    className="hover-card-transform"
                  >
                    <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text, width: '28px', height: '28px', display: 'flex', alignItems: 'center', borderRadius: '50%', flexShrink: 0, fontWeight: 700, fontSize: '0.85rem', justifyContent: 'center' }}>
                      {pri.rank}
                    </div>

                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{pri.title}</strong>
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: colors.text, background: colors.bg, border: `1px solid ${colors.border}`, padding: '0.1rem 0.4rem', borderRadius: '6px', textTransform: 'uppercase' }}>
                          {pri.severity}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.4, margin: '0 0 0.8rem 0' }}>
                        {pri.description}
                      </p>
                      
                      {pri.actionCallback ? (
                        <button 
                          onClick={pri.actionCallback} 
                          className="btn-primary" 
                          style={{ width: 'auto', padding: '0.35rem 0.8rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer', borderRadius: '8px' }}
                        >
                          {pri.actionLabel} <ChevronRight size={12} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => setActiveTab(pri.targetTab as TabType)} 
                          className="btn-secondary" 
                          style={{ width: 'auto', padding: '0.35rem 0.8rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer', borderRadius: '8px' }}
                        >
                          {pri.actionLabel} <ChevronRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 6: MY NEXT MESSAGE HELPER */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--text-main)' }}>
                  <Mail size={18} color="var(--primary-color)" />
                  {isSpanish ? 'Asistente de Próximo Mensaje' : 'Next-Step Message Helper'}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginTop: '0.15rem' }}>
                  {isSpanish ? 'Guiones y borradores basados en su mayor prioridad.' : 'Drafts and scripts generated based on your top active priority.'}
                </span>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: '0.3rem', background: 'rgba(0,0,0,0.03)', padding: '0.2rem', borderRadius: '8px' }}>
                <button 
                  onClick={() => setMessageType('email')} 
                  style={{ 
                    border: 'none', 
                    background: messageType === 'email' ? 'var(--primary-color)' : 'transparent', 
                    color: messageType === 'email' ? '#fff' : 'var(--text-light)',
                    padding: '0.3rem 0.6rem', 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    borderRadius: '6px', 
                    cursor: 'pointer' 
                  }}
                >
                  {isSpanish ? 'Correo / Carta' : 'Email/Letter'}
                </button>
                <button 
                  onClick={() => setMessageType('phone')} 
                  style={{ 
                    border: 'none', 
                    background: messageType === 'phone' ? 'var(--primary-color)' : 'transparent', 
                    color: messageType === 'phone' ? '#fff' : 'var(--text-light)',
                    padding: '0.3rem 0.6rem', 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    borderRadius: '6px', 
                    cursor: 'pointer' 
                  }}
                >
                  {isSpanish ? 'Llamada' : 'Phone Script'}
                </button>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div 
                style={{ 
                  background: 'rgba(0,0,0,0.02)', 
                  border: '1px solid var(--glass-border)', 
                  padding: '1.25rem', 
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  color: 'var(--text-main)'
                }}
              >
                {getNextMessageScript()}
              </div>

              <button 
                onClick={handleCopyScript}
                style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  border: '1px solid rgba(0,0,0,0.06)',
                  background: '#fff',
                  borderRadius: '6px',
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                {copiedScript ? <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.1rem' }}><Check size={12} /> {isSpanish ? '¡Copiado!' : 'Copied!'}</span> : <span style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', color: 'var(--text-main)' }}><Copy size={12} /> {isSpanish ? 'Copiar' : 'Copy'}</span>}
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: EVIDENCE PKT & DEADLINES */}
        <div style={{ gridColumn: '8 / 13', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="grid-col-lg-5">
          
          {/* SECTION 3: EVIDENCE PANEL & COMPILER */}
          <div 
            className="glass-panel" 
            style={{ 
              padding: '2rem', 
              border: '2px solid var(--primary-color)', 
              background: 'rgba(var(--primary-rgb), 0.02)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--primary-color)', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '0.25rem 0.75rem', transform: 'rotate(5deg)', borderRadius: '4px', textTransform: 'uppercase' }}>
              {isSpanish ? 'Generador' : 'Wizard'}
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <Scale size={20} color="var(--primary-color)" />
              {isSpanish ? 'Paquete de Evidencia del Caso' : 'Case Evidence Packet'}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, margin: '0 0 1.25rem 0' }}>
              {isSpanish 
                ? 'Compile sus registros de deambulación, la declaración escrita y la guía médica en un solo paquete oficial.'
                : 'Bundle safety behavior incidents, pediatrician briefing letters, and parent declarations into a clean clinical packet.'}
            </p>

            {/* Evidence Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#fff', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-light)', display: 'block' }}>{isSpanish ? 'Incidentes Grabados' : 'Log Incidents'}</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{incidents.length}</strong>
              </div>
              <div style={{ background: '#fff', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-light)', display: 'block' }}>{isSpanish ? 'Documentos Listos' : 'Documents Ready'}</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
                  {savedChecklist.filter(item => item.is_collected === 1).length} / {savedChecklist.length}
                </strong>
              </div>
            </div>

            <button 
              onClick={() => { setIsWizardOpen(true); setWizardStep('cover'); }}
              className="btn-primary" 
              style={{ width: '100%', padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', cursor: 'pointer', borderRadius: '10px', fontWeight: 700 }}
            >
              <Printer size={16} />
              {isSpanish ? 'Construir y Previsualizar Paquete' : 'Build & Preview Packet'}
            </button>
          </div>

          {/* SECTION 4: MY DEADLINES TIMELINE */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <Clock size={18} color="var(--primary-color)" />
              {isSpanish ? 'Próximos Plazos y Citas' : 'Upcoming Deadlines & Actions'}
            </h3>

            {sortedReminders.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '1rem 0' }}>
                {isSpanish ? 'No hay recordatorios registrados.' : 'No reminders logged yet.'}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {sortedReminders.slice(0, 4).map(rem => {
                  const badge = getUrgencyBadge(rem.due_date);
                  return (
                    <div 
                      key={rem.id} 
                      style={{ 
                        border: '1px solid var(--glass-border)', 
                        padding: '0.8rem', 
                        borderRadius: '10px', 
                        background: rem.is_completed ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.5)',
                        opacity: rem.is_completed ? 0.6 : 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', flexGrow: 1 }}>
                        <input 
                          type="checkbox" 
                          checked={rem.is_completed === 1} 
                          onChange={() => handleToggleReminderLocal(rem.id, rem.is_completed)} 
                          style={{ marginTop: '3px', cursor: 'pointer', width: 'auto' }}
                        />
                        <div>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, textDecoration: rem.is_completed ? 'line-through' : 'none', color: 'var(--text-main)', display: 'block', lineHeight: 1.3 }}>
                            {rem.title}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>
                            {new Date(rem.due_date).toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      {!rem.is_completed && (
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, background: badge.bg, color: badge.color, padding: '0.15rem 0.35rem', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                          {badge.label}
                        </span>
                      )}

                      <button 
                        onClick={() => handleDeleteReminderLocal(rem.id)} 
                        style={{ border: 'none', background: 'none', color: '#ef4444', padding: '0.2rem', cursor: 'pointer', opacity: 0.7 }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick add deadline */}
            <form onSubmit={handleAddReminderLocal} style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                {isSpanish ? 'Añadir Recordatorio Rápido' : 'Add Quick Reminder'}
              </span>
              <input 
                type="text" 
                placeholder={isSpanish ? 'Título (ej. Enviar SOC 873)' : 'Reminder Title (e.g. Mail SOC 873)'}
                value={quickTitle}
                onChange={e => setQuickTitle(e.target.value)}
                style={{ padding: '0.4rem', fontSize: '0.8rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                <input 
                  type="date"
                  value={quickDate}
                  onChange={e => setQuickDate(e.target.value)}
                  style={{ padding: '0.4rem', fontSize: '0.8rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                  required
                />
                <button type="submit" className="btn-secondary" style={{ padding: '0.4rem', fontSize: '0.78rem', cursor: 'pointer', borderRadius: '6px' }}>
                  {isSpanish ? 'Guardar' : 'Save'}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

      {/* SECTION 5: MY CONTACTS DIRECTORY */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
          <MapPin size={20} color="var(--primary-color)" />
          {isSpanish ? 'Directorio de Contactos de mi Condado' : 'Your Local County Contacts & Directory'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }} className="iep-grid-layout">
          
          {/* Contact 1: Regional Center */}
          <div style={{ border: '1px solid var(--glass-border)', padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--primary-color)', background: 'rgba(var(--primary-rgb), 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', width: 'fit-content', textTransform: 'uppercase' }}>
              {isCa ? (isSpanish ? 'Centro Regional' : 'Regional Center') : stateConfig?.catchmentName}
            </span>
            {(countyDetails?.regionalCenters && countyDetails.regionalCenters.length > 0) ? countyDetails.regionalCenters.map(rc => (
              <div key={rc.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{rc.name}</strong>
                <a href={rc.website} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}>
                  <Globe size={12} /> {isSpanish ? 'Visitar Sitio' : 'Visit Website'}
                </a>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Phone size={12} /> {isSpanish ? 'Admisión:' : 'Intake:'} {rc.intake_phone || rc.early_start_contact}
                </div>
              </div>
            )) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{stateConfig?.catchmentName}</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', lineHeight: 1.3 }}>{stateConfig?.catchmentDesc}</span>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600 }}>
                  {stateConfig?.ddAgency}
                </div>
              </div>
            )}
          </div>

          {/* Contact 2: IHSS County Office */}
          <div style={{ border: '1px solid var(--glass-border)', padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#d97706', background: 'rgba(245,158,11,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', width: 'fit-content', textTransform: 'uppercase' }}>
              {isCa ? (isSpanish ? 'Oficina IHSS' : 'County IHSS Office') : (isSpanish ? `Oficina de ${stateConfig?.personalCareProgram}` : `${stateConfig?.personalCareProgram} Office`)}
            </span>
            {((countyDetails?.countyOffices?.filter(o => o.program_id === 'ihss-for-children') || []).length > 0) ? (countyDetails?.countyOffices || []).filter(o => o.program_id === 'ihss-for-children').slice(0, 1).map(office => (
              <div key={office.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{office.office_name || (isSpanish ? 'Oficina del Seguro Social' : 'Social Services')}</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', lineHeight: 1.3 }}>{office.address}</span>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Phone size={12} /> {office.phone}
                </div>
              </div>
            )) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{stateConfig?.personalCareProgram}</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', lineHeight: 1.3 }}>{stateConfig?.stateMedicaidAgency}</span>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600 }}>
                  {stateConfig?.medicaidName}
                </div>
              </div>
            )}
          </div>

          {/* Contact 3: School District Spec Ed */}
          <div style={{ border: '1px solid var(--glass-border)', padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', width: 'fit-content', textTransform: 'uppercase' }}>
              {isSpanish ? 'Distrito Escolar' : 'School District'}
            </span>
            {countyDetails?.schoolDistricts?.slice(0, 1).map(dist => (
              <div key={dist.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{dist.name}</strong>
                {dist.spec_ed_contact_phone && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Phone size={12} /> {dist.spec_ed_contact_phone}
                  </div>
                )}
                {dist.spec_ed_contact_email && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.2rem', wordBreak: 'break-all' }}>
                    <Mail size={12} /> {dist.spec_ed_contact_email}
                  </div>
                )}
              </div>
            )) || <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>{isSpanish ? 'No disponible' : 'Not available'}</p>}
          </div>

          {/* Contact 4: Local Advocates */}
          <div style={{ border: '1px solid var(--glass-border)', padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', width: 'fit-content', textTransform: 'uppercase' }}>
              {isSpanish ? 'Defensores IEP' : 'Local IEP Advocates'}
            </span>
            {localAdvocates && localAdvocates.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{localAdvocates[0].name}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{localAdvocates[0].credentials}</span>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Phone size={12} /> {localAdvocates[0].phone}
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>{isSpanish ? 'No hay defensores en su área' : 'No advocates loaded'}</p>
            )}
          </div>

        </div>
      </div>

      {/* ----------------------------------------------------
          MODAL: EVIDENCE PACKET BUILDER WIZARD
         ---------------------------------------------------- */}
      {isWizardOpen && (
        <div 
          className="modal-overlay" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            background: 'rgba(0,0,0,0.5)', 
            backdropFilter: 'blur(4px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999,
            padding: '2rem'
          }}
        >
          {/* Injected CSS print styles that ensure ONLY `#evidence-packet-printable` prints */}
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              body > *:not(#evidence-packet-printable-wrapper) {
                display: none !important;
              }
              #evidence-packet-printable-wrapper {
                display: block !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                background: white !important;
                color: black !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              .no-print {
                display: none !important;
              }
              .page-break {
                page-break-after: always !important;
                break-after: page !important;
              }
            }
          `}} />

          <div 
            className="glass-panel no-print animate-fade-in" 
            style={{ 
              background: '#fff', 
              color: 'var(--text-main)',
              width: '100%', 
              maxWidth: '1000px', 
              maxHeight: '95vh',
              borderRadius: '24px', 
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.08)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1.5rem', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <Scale size={20} color="var(--primary-color)" />
                  {isSpanish ? 'Creador de Paquete de Evidencia del Caso' : 'Evidence Packet Builder Wizard'}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                  {isSpanish ? 'Configure las secciones del paquete antes de exportar.' : 'Configure each section of the evidence handout before printing.'}
                </span>
              </div>
              <button 
                onClick={() => setIsWizardOpen(false)} 
                style={{ border: 'none', background: 'rgba(0,0,0,0.04)', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            {/* Wizard Steps Navigation Bar */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem', overflowX: 'auto' }}>
              {[
                { id: 'cover' as const, label: isSpanish ? '1. Declaración' : '1. Parent Declaration' },
                { id: 'pediatrician' as const, label: isSpanish ? '2. Guía Médica' : '2. Doctor Guidelines' },
                { id: 'log' as const, label: isSpanish ? '3. Bitácora de Riesgos' : '3. Safety Log' },
                { id: 'checklist' as const, label: isSpanish ? '4. Índice' : '4. Index Checklist' },
                { id: 'preview' as const, label: isSpanish ? '5. Vista Impresión' : '5. Print Preview' }
              ].map(step => (
                <button
                  key={step.id}
                  onClick={() => setWizardStep(step.id)}
                  style={{
                    border: 'none',
                    background: wizardStep === step.id ? 'var(--primary-color)' : 'rgba(0,0,0,0.02)',
                    color: wizardStep === step.id ? '#fff' : 'var(--text-light)',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {step.label}
                </button>
              ))}
            </div>

            {/* Step Contents */}
            <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
              
              {/* STEP 1: COVER LETTER DECLARATION FORM */}
              {wizardStep === 'cover' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>{isSpanish ? 'Nombre del Cuidador / Padre' : 'Caregiver / Parent Full Name'}</label>
                      <input 
                        type="text" 
                        value={parentName} 
                        onChange={(e) => setParentName(e.target.value)} 
                        style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}
                      />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>{isSpanish ? 'Nombre del Niño' : 'Child Nickname'}</label>
                      <input 
                        type="text" 
                        value={childName} 
                        onChange={(e) => setChildName(e.target.value)} 
                        style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.3rem', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>{isSpanish ? 'Texto de Declaración Escrita (Editable)' : 'Declaration Text Content (Editable)'}</label>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                          onClick={handleCopyLetter}
                          style={{ border: 'none', background: 'none', color: 'var(--primary-color)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          📋 {copiedLetter ? (isSpanish ? '¡Copiado!' : 'Copied!') : (isSpanish ? 'Copiar Borrador' : 'Copy Draft')}
                        </button>
                        <button 
                          onClick={generateDefaultDeclaration}
                          style={{ border: 'none', background: 'none', color: 'var(--primary-color)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          🔄 {isSpanish ? 'Restablecer Borrador' : 'Reset to Default'}
                        </button>
                      </div>
                    </div>
                    <textarea 
                      value={declarationText} 
                      onChange={(e) => handleDeclarationChange(e.target.value)}
                      style={{ width: '100%', minHeight: '280px', fontSize: '0.85rem', fontFamily: 'monospace', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', lineHeight: 1.4 }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: PEDIATRICIAN BRIEFING SHEET */}
              {wizardStep === 'pediatrician' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>{isSpanish ? 'Nombre del Pediatra / Médico' : 'Pediatrician / Doctor Full Name'}</label>
                    <input 
                      type="text" 
                      value={doctorName} 
                      onChange={(e) => handleDoctorNameChange(e.target.value)} 
                      placeholder="e.g. Dr. Sarah Jenkins"
                      style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                  </div>

                  <div style={{ padding: '1rem', background: 'rgba(var(--primary-rgb), 0.05)', borderRadius: '12px', border: '1px solid rgba(var(--primary-rgb), 0.15)' }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
                      {isSpanish ? '💡 ¿Por qué es necesario este informe?' : '💡 Why is this briefing memo necessary?'}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.4, margin: 0 }}>
                      {isSpanish 
                        ? `Muchos médicos no comprenden el estándar legal de ${stateConfig?.personalCareProgram || 'IHSS'} para menores. Este resumen proporciona pautas claras para rellenar los formularios estatales, enfatizando que el niño requiere de monitoreo continuo debido a discapacidades mentales cognitivas en lugar de necesidades de desarrollo típicas de su edad.`
                        : `Doctors frequently fill out physician forms incorrectly by stating a child needs typical age-appropriate care. This briefing sheet explicitly instructs the physician on how to detail safety demands under ${stateConfig?.name || 'California'} regulations (such as documenting cognitive non-self-direction).`}
                    </p>
                  </div>

                  <div style={{ border: '1px solid #eee', borderRadius: '10px', padding: '1rem', background: '#fafafa' }}>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: 700, margin: '0 0 0.5rem 0', textTransform: 'uppercase', color: 'var(--text-light)' }}>
                      {isSpanish ? 'Borrador del Resumen para el Doctor:' : 'Draft Memo Preview:'}
                    </h5>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.78rem', margin: 0, fontFamily: 'sans-serif', color: '#555', lineHeight: 1.4 }}>
                      {isSpanish
                        ? `ATENCIÓN: MEMORÁNDUM DE EVALUACIÓN CLÍNICA
Para: ${doctorName || 'Dr. [Nombre del Médico]'}
De: ${parentName || 'Cuidador'}
Paciente: ${childName} (F.Nac: ${currentChild.dob})

Estimado Doctor,

Le solicito amablemente su ayuda para completar el formulario de certificación médica de ${stateConfig?.personalCareProgram || 'IHSS'}. Al evaluar a mi hijo, tenga en cuenta los siguientes estándares de ${stateConfig?.name || 'California'}:
1. El estándar clave para menores es que el niño requiera significativamente más supervisión activa que un niño de desarrollo típico de su misma edad debido a una incapacidad mental o física severa.
2. Por favor, especifique en sus notas si el niño es de "Dirección No Propia" (Non-Self-Directing), lo que significa que no puede anticipar los peligros de los autos, el fuego, o la ingestión de materiales tóxicos de forma independiente.
3. Se adjunta nuestro registro de incidentes de seguridad que muestra las amenazas de lesiones prevenidas.`
                        : `CLINICAL BRIEFING & GUIDELINES FOR STATE DISABILITY SERVICES
To: ${doctorName || 'Dr. [Physician Name]'}
From: ${parentName || 'Parent/Caregiver'}
Subject: Medical Certification Parameters for ${childName} (DOB: ${currentChild.dob})

Dear Doctor,

I am requesting your completion of medical certification forms for ${stateConfig?.personalCareProgram || 'IHSS'} for my child. Please note the clinical definitions mandated by ${stateConfig?.name || 'California'} regulations:
- Minor Standard: The child must require more active supervision than a typically developing child of the same age due to severe mental impairment.
- Non-Self-Direction: The physician must verify if the child is "non-self-directing." This means they cannot independently recognize, evaluate, and avoid danger (e.g. running into traffic, eating dangerous objects).
- Clinical details: Please document specific medical or behavioral indicators (such as Autism, Cerebral Palsy, or Down Syndrome cognitive constraints) that cause this deficit.`}
                    </pre>
                  </div>
                </div>
              )}

              {/* STEP 3: SAFETY LOGS PREVIEW */}
              {wizardStep === 'log' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>
                      {isSpanish ? 'Registro de Incidentes Recientes' : 'Logged Incidents Database'}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      {incidents.length} {isSpanish ? 'incidentes listos' : 'incidents loaded'}
                    </span>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '0.6rem', textAlign: 'left' }}>{isSpanish ? 'Hora/Nivel' : 'Time/Level'}</th>
                        <th style={{ padding: '0.6rem', textAlign: 'left' }}>{isSpanish ? 'Categoría' : 'Category'}</th>
                        <th style={{ padding: '0.6rem', textAlign: 'left' }}>{isSpanish ? 'Detalles del Riesgo' : 'Hazard Details'}</th>
                        <th style={{ padding: '0.6rem', textAlign: 'left' }}>{isSpanish ? 'Intervención de Padres' : 'Parent Intervention'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidents.map(inc => (
                        <tr key={inc.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.6rem', verticalAlign: 'top' }}>
                            <div>{inc.time}</div>
                            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: inc.riskLevel === 'critical' ? '#ef4444' : '#d97706', textTransform: 'uppercase' }}>{inc.riskLevel}</span>
                          </td>
                          <td style={{ padding: '0.6rem', verticalAlign: 'top', fontWeight: 600 }}>{inc.category}</td>
                          <td style={{ padding: '0.6rem', verticalAlign: 'top', color: '#555' }}>{inc.details}</td>
                          <td style={{ padding: '0.6rem', verticalAlign: 'top', color: 'var(--primary-color)' }}>{inc.intervention}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                    {isSpanish 
                      ? 'Nota: Para editar o agregar incidentes a esta lista, por favor hágalo en la pestaña "IHSS y Horas Extras".'
                      : 'Note: To add or remove items from this log, please use the main IHSS & Overtime tab.'}
                  </span>
                </div>
              )}

              {/* STEP 4: INDEX CHECKLIST */}
              {wizardStep === 'checklist' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>
                    {isSpanish ? 'Índice de Documentos Adjuntos' : 'Attached Documents Index Checklist'}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: 0 }}>
                    {isSpanish
                      ? 'Seleccione cuáles de los siguientes documentos respaldan su caso para incluirlos en el índice del paquete:'
                      : 'Indicate which documents are completed and attached to provide a summary index for caseworkers:'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {savedChecklist.map(item => (
                      <label 
                        key={item.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem', 
                          fontSize: '0.8rem', 
                          padding: '0.4rem', 
                          borderRadius: '6px', 
                          background: item.is_collected ? '#eefcf5' : '#fafafa',
                          border: `1px solid ${item.is_collected ? '#cbf7e1' : '#eee'}`
                        }}
                      >
                        <input type="checkbox" checked={item.is_collected === 1} readOnly style={{ width: 'auto' }} />
                        <strong>{item.document_name}</strong>
                        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: item.is_collected ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                          {item.is_collected ? (isSpanish ? 'Listo / Adjuntado' : 'Attached') : (isSpanish ? 'Pendiente' : 'Pending')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: OVERALL PRINT PREVIEW */}
              {wizardStep === 'preview' && (
                <div style={{ border: '2px dashed var(--primary-color)', padding: '1rem', borderRadius: '12px', background: '#fafafa' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    {isSpanish ? 'Vista Previa del Documento de Impresión' : 'Printable Layout Preview'}
                  </span>
                  
                  <div style={{ background: '#fff', border: '1px solid #ddd', padding: '2rem', height: '400px', overflowY: 'scroll', fontSize: '0.78rem', fontFamily: 'serif' }}>
                    <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                      <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>EVIDENCE HANDOUT PACKET</h2>
                      <span style={{ textTransform: 'uppercase', fontSize: '0.62rem' }}>State of ${stateConfig?.name || 'California'} Disability Services Supporting Records</span>
                    </div>

                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.2rem' }}>SECTION 1: CAREGIVER DECLARATION</h3>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'serif', fontSize: '0.75rem' }}>{declarationText}</pre>
                    
                    <div style={{ pageBreakBefore: 'always', marginTop: '2rem' }}></div>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.2rem' }}>SECTION 2: PEDIATRICIAN CLINICAL MEMO</h3>
                    <p style={{ fontWeight: 'bold' }}>To: {doctorName || 'Dr. [Physician Name]'}</p>
                    <p style={{ whiteSpace: 'pre-wrap' }}>
                      {isSpanish 
                        ? `Le solicito amablemente su ayuda para completar el formulario de certificación médica de ${stateConfig?.personalCareProgram || 'IHSS'}. Al evaluar a mi hijo, tenga en cuenta que requiere significativamente más supervisión activa que un niño de desarrollo típico de su misma edad debido a una incapacidad mental o física severa.`
                        : `Please review these instructions when completing the medical certification forms for ${stateConfig?.personalCareProgram || 'IHSS'}. Note that the child requires MORE supervision than a typically developing child of the same age due to mental impairment. They must indicate whether the child's behaviors are 'non-self-directing', meaning they cannot navigate hazards or self-correct in dangerous situations.`}
                    </p>

                    <div style={{ pageBreakBefore: 'always', marginTop: '2rem' }}></div>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.2rem' }}>SECTION 3: 24-HOUR SAFETY RISK INCIDENT LOG</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                      <thead>
                        <tr style={{ background: '#f0f0f0', borderBottom: '1px solid #000' }}>
                          <th style={{ border: '1px solid #ddd', padding: '4px' }}>Time</th>
                          <th style={{ border: '1px solid #ddd', padding: '4px' }}>Category</th>
                          <th style={{ border: '1px solid #ddd', padding: '4px' }}>Behavior Hazard</th>
                          <th style={{ border: '1px solid #ddd', padding: '4px' }}>Intervention</th>
                        </tr>
                      </thead>
                      <tbody>
                        {incidents.map(inc => (
                          <tr key={inc.id}>
                            <td style={{ border: '1px solid #ddd', padding: '4px' }}>{inc.time}</td>
                            <td style={{ border: '1px solid #ddd', padding: '4px', fontWeight: 'bold' }}>{inc.category}</td>
                            <td style={{ border: '1px solid #ddd', padding: '4px' }}>{inc.details}</td>
                            <td style={{ border: '1px solid #ddd', padding: '4px' }}>{inc.intervention}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ pageBreakBefore: 'always', marginTop: '2rem' }}></div>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.2rem' }}>SECTION 4: SUPPORTING EVIDENCE INDEX</h3>
                    <ul>
                      {savedChecklist.map(item => (
                        <li key={item.id} style={{ marginBottom: '0.4rem' }}>
                          <strong>{item.document_name}:</strong>{' '}
                          {item.is_collected ? 'Attached / Verified' : 'Pending Assessment'}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #eee', paddingTop: '1.25rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setIsWizardOpen(false)} 
                className="btn-secondary" 
                style={{ width: 'auto', padding: '0.5rem 1rem', cursor: 'pointer' }}
              >
                {isSpanish ? 'Cancelar' : 'Cancel'}
              </button>
              
              <button
                onClick={() => {
                  window.print();
                }}
                className="btn-primary"
                style={{ width: 'auto', padding: '0.5rem 1.25rem', cursor: 'pointer', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}
              >
                <Printer size={16} />
                {isSpanish ? 'Imprimir Paquete Completo (PDF)' : 'Print Full Evidence Packet (PDF)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          HIDDEN PRINT CONTAINER
          (Only rendered to the printer engine)
         ---------------------------------------------------- */}
      <div 
        id="evidence-packet-printable-wrapper" 
        style={{ display: 'none' }}
      >
        <div id="evidence-packet-printable" style={{ padding: '2rem', fontFamily: 'serif', color: '#000', background: '#fff' }}>
          
          {/* Cover Page */}
          <div className="page-break" style={{ minHeight: '900px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem' }}>
            <div style={{ textAlign: 'center', borderBottom: '3px double #000', paddingBottom: '1.5rem', marginBottom: '2.5rem' }}>
              <h1 style={{ fontSize: '24pt', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>Evidence Advocacy Handout</h1>
              <span style={{ fontSize: '10pt', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginTop: '0.5rem' }}>
                Supporting Documentation for Minor State Disability Services
              </span>
            </div>

            <div style={{ margin: '3rem 0', fontSize: '12pt', lineHeight: 1.6 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                <tbody>
                  <tr>
                    <td style={{ border: 'none', padding: '6px', fontWeight: 'bold', width: '200px' }}>Target Child:</td>
                    <td style={{ border: 'none', padding: '6px' }}>{childName} (DOB: {currentChild.dob || 'N/A'})</td>
                  </tr>
                  <tr>
                    <td style={{ border: 'none', padding: '6px', fontWeight: 'bold' }}>Calculated Age:</td>
                    <td style={{ border: 'none', padding: '6px' }}>{childAge} years old</td>
                  </tr>
                  <tr>
                    <td style={{ border: 'none', padding: '6px', fontWeight: 'bold' }}>Primary Caregiver:</td>
                    <td style={{ border: 'none', padding: '6px' }}>{parentName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: 'none', padding: '6px', fontWeight: 'bold' }}>Jurisdiction County:</td>
                    <td style={{ border: 'none', padding: '6px' }}>{activeCounty?.name ? `${activeCounty.name} County, ${stateConfig?.name}` : `${stateConfig?.name || 'California'} County`}</td>
                  </tr>
                  <tr>
                    <td style={{ border: 'none', padding: '6px', fontWeight: 'bold' }}>Conditions:</td>
                    <td style={{ border: 'none', padding: '6px' }}>{childConditions.map(c => c.name).join(', ') || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ textAlign: 'center', fontSize: '10pt', color: '#555', borderTop: '1px solid #ccc', paddingTop: '1.5rem' }}>
              Prepared on {new Date().toLocaleDateString()} via Ablefull
            </div>
          </div>

          {/* Section 1: Written Declaration */}
          <div className="page-break" style={{ padding: '2rem 0' }}>
            <h2 style={{ borderBottom: '2px solid #000', paddingBottom: '0.5rem', textTransform: 'uppercase', fontSize: '16pt', fontWeight: 700 }}>
              Section 1: Caregiver Written Declaration
            </h2>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'serif', fontSize: '11pt', lineHeight: 1.6, marginTop: '1.5rem' }}>
              {declarationText}
            </pre>
          </div>

          {/* Section 2: Clinical Instruction Sheet */}
          <div className="page-break" style={{ padding: '2rem 0' }}>
            <h2 style={{ borderBottom: '2px solid #000', paddingBottom: '0.5rem', textTransform: 'uppercase', fontSize: '16pt', fontWeight: 700 }}>
              Section 2: Medical Certification Briefing Note
            </h2>
            <div style={{ marginTop: '1.5rem', fontSize: '11pt', lineHeight: 1.6 }}>
              <p><strong>To:</strong> {doctorName || 'Dr. [Physician Name]'}</p>
              <p><strong>Subject:</strong> {stateConfig?.personalCareProgram || 'IHSS'} Medical Certification Guidelines</p>
              <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '1rem 0' }} />
              
              <p>Dear Doctor,</p>
              <p>
                In order for the county to authorize protective hours for a minor child under ${stateConfig?.name || 'California'} Medicaid and personal care program regulations, the medical record must reflect the child&apos;s specific safety monitoring needs.
              </p>
              <p>
                Please ensure that your medical records and state medical certification forms address the following criteria:
              </p>
              <ol style={{ paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <strong>Severe Cognitive/Mental Impairment:</strong> Describe the child&apos;s developmental age vs chronological age in safety management. Detail if the child is unable to understand consequences of hazardous actions.
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <strong>Non-Self-Direction:</strong> Explicitly state if the child exhibits &quot;non-self-directing&quot; behaviors. A child is non-self-directing if they cannot independently assess, navigate, and correct hazardous behaviors (e.g. climbing out of windows, running into traffic, eating dangerous objects).
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <strong>Behavioral Risks:</strong> Corroborate specific behaviors such as wandering, elopement, pica, aggression, and self-injurious actions.
                </li>
              </ol>
              <p style={{ marginTop: '1.5rem' }}>
                Thank you for your clinical assistance in supporting this child&apos;s safety in the home.
              </p>
            </div>
          </div>

          {/* Section 3: Safety Log */}
          <div className="page-break" style={{ padding: '2rem 0' }}>
            <h2 style={{ borderBottom: '2px solid #000', paddingBottom: '0.5rem', textTransform: 'uppercase', fontSize: '16pt', fontWeight: 700 }}>
              Section 3: 24-Hour Safety Incident Log
            </h2>
            <p style={{ fontSize: '10pt', fontStyle: 'italic', margin: '1rem 0' }}>
              The following table documents recent safety hazards observed by the caregiver, detailing the child&apos;s behaviors and the physical interventions required to prevent immediate bodily injury.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '10pt' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #000' }}>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>Time / Risk</th>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>Category</th>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>Specific Hazard details</th>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>Immediate Parent Intervention</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(inc => (
                  <tr key={inc.id} style={{ borderBottom: '1px solid #ccc' }}>
                    <td style={{ border: '1px solid #ccc', padding: '8px', verticalAlign: 'top' }}>
                      <div>{inc.time}</div>
                      <span style={{ fontSize: '8pt', fontWeight: 'bold', color: inc.riskLevel === 'critical' ? 'red' : 'orange', textTransform: 'uppercase' }}>{inc.riskLevel}</span>
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', verticalAlign: 'top', fontWeight: 'bold' }}>{inc.category}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', verticalAlign: 'top' }}>{inc.details}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', verticalAlign: 'top' }}>{inc.intervention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 4: Supporting Docs Index */}
          <div style={{ padding: '2rem 0' }}>
            <h2 style={{ borderBottom: '2px solid #000', paddingBottom: '0.5rem', textTransform: 'uppercase', fontSize: '16pt', fontWeight: 700 }}>
              Section 4: Index of Accompanying Case Files
            </h2>
            <p style={{ fontSize: '11pt', margin: '1rem 0' }}>
              The following files are appended to this handout packet as supporting records:
            </p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem', fontSize: '11pt' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #000' }}>
                  <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Document Type</th>
                  <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {savedChecklist.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #ccc' }}>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}><strong>{item.document_name}</strong></td>
                    <td style={{ border: '1px solid #ccc', padding: '10px', color: item.is_collected ? 'green' : 'orange', fontWeight: 'bold' }}>
                      {item.is_collected ? 'ATTACHED / INCLUDED' : 'PENDING EVALUATION'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  );
}
