'use client';

import { useState } from 'react';
import { 
  BookOpen, ChevronDown, ChevronUp, Lightbulb,
  AlertCircle, CheckCircle2, FileText, Scale, Users, Clock,
  ArrowRight, Info, Landmark, GraduationCap, Heart
} from 'lucide-react';

interface GuideStep {
  title: string;
  content: string;
  tip?: string;
  warning?: string;
  citation?: string;
}

interface Guide {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: GuideStep[];
}

const GUIDES: Guide[] = [
  {
    id: 'rc-intake',
    title: 'Preparing for Regional Center Intake',
    subtitle: 'How to navigate your first Lanterman Act intake meeting and maximize your child\'s eligibility assessment',
    icon: <Landmark size={22} />,
    color: '#6366f1',
    readTime: '8 min read',
    difficulty: 'Beginner',
    steps: [
      {
        title: 'Understand what Regional Centers can fund',
        content: 'California\'s 21 Regional Centers are funded under the Lanterman Developmental Disabilities Services Act. They coordinate and pay for services for individuals with autism, cerebral palsy, intellectual disability, epilepsy, and "fifth category" (disabling conditions similar to intellectual disability that originate before age 18). Services include respite care, speech/OT/PT therapy, behavior intervention, adaptive equipment, transportation, and day programs.',
        tip: 'Regional Centers are the payor of LAST RESORT — this means they will try to redirect you to Medi-Cal, private insurance, or your school district first. You must exhaust those options (or show they don\'t apply) before the RC will fund services.',
        citation: 'California Welfare & Institutions Code § 4512'
      },
      {
        title: 'Gather your intake documentation BEFORE the appointment',
        content: 'Come prepared with: (1) Child\'s birth certificate and Social Security card, (2) Most recent diagnostic report from a licensed psychologist or physician (must name the qualifying diagnosis), (3) Medical records showing functional limitations, (4) Any prior IEP or school evaluation reports, (5) Immunization and medical history records.',
        warning: 'A diagnosis alone is not sufficient. The RC evaluates FUNCTIONAL LIMITATIONS in areas like communication, self-care, mobility, and self-direction. Document specific examples of daily living challenges.'
      },
      {
        title: 'Know your statutory rights before the meeting',
        content: 'Under the Lanterman Act, the RC must: (1) Initiate intake within 15 days of your request, (2) Complete eligibility determination within 120 days, (3) Provide an interpreter at no cost if you are not English-proficient, (4) Give you a written Notice of Action (NOA) for any denial with your appeal rights.',
        citation: 'California Welfare & Institutions Code § 4642(a)'
      },
      {
        title: 'What happens at the intake meeting',
        content: 'You will meet with an intake coordinator who reviews documentation and completes a standardized assessment (often the Vineland Adaptive Behavior Scales or similar). They assess your child across 7 areas: self-care, receptive and expressive language, learning, mobility, self-direction, capacity for independent living, and economic self-sufficiency. Be specific and concrete — describe your child\'s WORST days, not average days.',
        tip: 'Bring a written narrative (1-2 pages) describing your child\'s daily functioning challenges. This becomes part of the permanent file and forces the coordinator to address your specific concerns.',
      },
      {
        title: 'If they deny eligibility — your appeal rights',
        content: 'You have 30 days to request a Fair Hearing from the Office of Administrative Hearings (OAH) if you disagree with the eligibility denial or any service decision. You may also request a State Mediation (informal, faster) as an alternative. During an appeal, your current services cannot be reduced until the hearing is resolved ("Aid Paid Pending" protection).',
        warning: 'Missing the 30-day appeal window means you must restart the intake process. Track the date on your Notice of Action carefully.',
        citation: 'California Welfare & Institutions Code § 4710.5'
      },
      {
        title: 'After approval: Your Individual Program Plan (IPP)',
        content: 'Once eligible, the RC must develop an Individual Program Plan (IPP) with you within 60 days of eligibility. The IPP documents your child\'s goals and what services the RC will fund. You are a REQUIRED member of the IPP team — the RC cannot finalize an IPP without your input. Request a copy in writing after every meeting.',
        tip: 'Request that your IPP be reviewed at least annually or any time your child\'s needs change significantly. There is no limit to how often you can request an IPP review.'
      }
    ]
  },
  {
    id: 'iep-meeting',
    title: 'Mastering the IEP Process',
    subtitle: 'How to prepare for IEP meetings, exercise your rights as an equal team member, and push back on inadequate placements',
    icon: <GraduationCap size={22} />,
    color: '#0ea5e9',
    readTime: '10 min read',
    difficulty: 'Intermediate',
    steps: [
      {
        title: 'Your rights as an IEP team member',
        content: 'Under the Individuals with Disabilities Education Act (IDEA) and California Education Code, you are an EQUAL team member with every right to: disagree with assessments, propose different placements or goals, bring any individual to the meeting (advocate, therapist, friend), record the meeting (with 24-hour written notice in California), and reject any part of the IEP in writing.',
        tip: 'The school district CANNOT hold an IEP meeting or finalize an IEP without you. You have the absolute right to reschedule if the meeting time is inconvenient.',
        citation: 'IDEA 20 U.S.C. § 1414(d); California Ed Code § 56341'
      },
      {
        title: 'Prepare your parent statement in writing before the meeting',
        content: 'Write a 1-2 page "Parent\'s Concerns and Vision" statement before each IEP meeting. Include: specific skill deficits you observe at home, safety concerns, social/emotional needs, your vision for your child\'s long-term independence, and any services you are requesting. Hand a copy to each team member at the start of the meeting and request it be attached to the IEP.',
        tip: 'This statement becomes part of the official IEP record. It forces the team to formally respond to your concerns and creates documentation if you need to appeal later.'
      },
      {
        title: 'Understanding Least Restrictive Environment (LRE)',
        content: 'California and federal law require that children receive special education in the Least Restrictive Environment — meaning as much time as possible alongside non-disabled peers. Schools frequently push for more restrictive settings (self-contained classrooms) because they are cheaper. You have the right to demand a continuum of placement options be considered and documented.',
        warning: 'If the district recommends a more restrictive placement than you believe is appropriate, ask them to document in the IEP: (1) why inclusion with supports cannot meet your child\'s needs, and (2) what supplementary aids and services were considered.',
        citation: 'IDEA 20 U.S.C. § 1412(a)(5); California Ed Code § 56364'
      },
      {
        title: 'Requesting independent evaluations',
        content: 'If you disagree with the district\'s assessment, you have the right to request an Independent Educational Evaluation (IEE) at the district\'s expense. The district must either fund the IEE or file for a due process hearing to prove their own evaluation was appropriate. Common IEEs include: psychoeducational assessments, speech/language evaluations, OT/PT evaluations, and FBA (Functional Behavior Assessments).',
        citation: 'California Ed Code § 56329; 34 CFR § 300.502'
      },
      {
        title: 'When to disagree and how to document it',
        content: 'NEVER sign an IEP you disagree with under pressure. You may: (1) Sign only the attendance page (not consent), (2) Write "Parent does not consent" on the IEP before signing, (3) Submit a written disagreement letter within 5 school days, (4) Request a 30-day extension to review with an advocate. If you sign the IEP, you legally agree to the placement — districts know this and use meeting time pressure as a tactic.',
        warning: 'Signing the IEP in the meeting under pressure is the #1 mistake parents make. Take the document home. You have time.'
      },
      {
        title: 'Escalation: Filing a complaint or due process',
        content: 'Two formal escalation paths exist: (1) California Department of Education (CDE) Compliance Complaint — free to file, resolved within 60 days, covers procedural violations like missed timelines or failure to implement the IEP. (2) Office of Administrative Hearings (OAH) Due Process — formal legal hearing, can result in compensatory services or placement changes. Due process is expensive ($10,000–$40,000) unless you have an advocate or nonprofit legal representation.',
        tip: 'File a CDE compliance complaint FIRST for procedural violations. It\'s free, fast, and often resolves issues without needing due process.',
        citation: 'California Ed Code § 56501'
      }
    ]
  },
  {
    id: 'ihss-apply',
    title: 'Applying for IHSS Protective Supervision',
    subtitle: 'How to secure paid parent caregiver hours for children with severe behavioral or safety impairments under IHSS',
    icon: <Heart size={22} />,
    color: '#10b981',
    readTime: '9 min read',
    difficulty: 'Intermediate',
    steps: [
      {
        title: 'What Protective Supervision actually means',
        content: 'IHSS Protective Supervision (PS) pays a designated caregiver (including a parent) to provide continuous oversight to prevent injury for individuals who "are mentally impaired and cannot call for help or recognize danger." This is distinct from general personal care. For children with autism or intellectual disability, the key standard is that the child is "unable to direct their own care" due to cognitive impairment — not just a physical disability.',
        citation: 'California Welfare & Institutions Code § 12300(b); CDSS MPP § 30-756.17'
      },
      {
        title: 'What documentation you need',
        content: 'To qualify for Protective Supervision, your child\'s physician must complete the SOC 873 medical certification form. Beyond the SOC 873, you should also gather: (1) A physician\'s letter explicitly describing the child\'s inability to recognize and avoid danger, (2) Behavior therapy records noting elopement, self-injury, PICA, or aggression incidents, (3) School incident reports and IEP safety plans, (4) Your own written safety log documenting specific dangerous incidents with dates and times.',
        tip: 'Generic doctor notes saying "child has autism" are insufficient. The documentation must specifically describe HOW the child cannot recognize danger and what specific safety risks require 24/7 supervision.'
      },
      {
        title: 'What "unable to direct care" really means for the county',
        content: 'County social workers often apply the PS standard incorrectly, denying benefits by claiming the child "can ask for help" or "shows some awareness." To meet the standard, your documentation must show the child CANNOT: consistently recognize dangerous situations (traffic, strangers, heights), understand consequences of self-injurious behavior, summon help reliably, or self-regulate to prevent injury.',
        warning: 'Social workers sometimes frame elopement or self-harm as "behavioral problems" rather than safety supervision needs. Push back by emphasizing COGNITIVE inability to recognize danger — not behavior management.'
      },
      {
        title: 'The county assessment home visit',
        content: 'A county social worker will visit your home for an assessment. During this visit: (1) Do NOT tidy up or hide safety equipment — let the social worker see the real environment (door alarms, cabinet locks, window guards). (2) Describe your child\'s behavior on their WORST days, not typical days. (3) Have your documentation packet ready to hand over. (4) If possible, have your child present so the worker observes their functioning directly.',
        tip: 'Ask the social worker to document everything they observe during the home visit. If they don\'t write it down, it doesn\'t count.'
      },
      {
        title: 'If you receive a Notice of Action (NOA) denial or reduction',
        content: 'You have two critical deadlines: (1) FILE APPEAL WITHIN 10 DAYS to maintain "Aid Paid Pending" — this means your CURRENT hours stay active while the appeal is processed. (2) FILE APPEAL WITHIN 90 DAYS if you do not need Aid Paid Pending protection. Missing the 10-day window means you lose existing hours immediately while you wait for the hearing.',
        warning: 'The 10-day rule for Aid Paid Pending is the most commonly missed deadline in IHSS appeals. Mark the NOA date on a calendar the day you receive it.',
        citation: 'California Welfare & Institutions Code § 10950; CDSS MPP § 22-072'
      },
      {
        title: 'Preparing for the State Fair Hearing',
        content: 'At the OAH hearing, an Administrative Law Judge (ALJ) reviews evidence. Key strategies: (1) Bring objective, third-party evidence — medical records, therapy notes, school incident logs, behavioral assessments. The ALJ heavily discounts parent testimony alone. (2) Have your treating physician or behavior therapist provide a letter or, ideally, testimony. (3) Bring a printout of your IHSS Behavior Log (generated through this platform) as your incident evidence.',
        tip: 'Request all county records about your child\'s case before the hearing (Public Records Act request). You are entitled to see what the county submitted as evidence and can challenge inaccuracies.'
      }
    ]
  },
  {
    id: 'appeals-guide',
    title: 'Filing a State Fair Hearing Appeal',
    subtitle: 'Step-by-step guide to contesting IHSS, Regional Center, and Medi-Cal denials at the Office of Administrative Hearings',
    icon: <Scale size={22} />,
    color: '#f59e0b',
    readTime: '7 min read',
    difficulty: 'Advanced',
    steps: [
      {
        title: 'When to file and which agency to contact',
        content: 'State Fair Hearings are adjudicated by the California Office of Administrative Hearings (OAH) for IHSS and Medi-Cal cases, and by the Office of Administrative Hearings as well for Regional Center disputes. For IEP/school disputes, the same OAH handles "due process" hearings under the Education Code. You can request a hearing by calling 1-800-952-5253 or filing online at cdss.ca.gov/fair-hearings.',
        citation: 'California Welfare & Institutions Code § 10950; California Ed Code § 56501'
      },
      {
        title: 'The most critical deadlines',
        content: 'IHSS/Medi-Cal: 90 days from the NOA date to file a Fair Hearing. 10 days for Aid Paid Pending protection. Regional Center: 30 days from the written Notice of Action. IEP Due Process: 2 years from the date you knew or should have known about the violation (with exceptions for active concealment). California CDE Complaint: 1 year from the violation.',
        warning: 'These deadlines are ABSOLUTE — courts have upheld dismissals for hearings filed even 1 day late. Confirm the exact date on your Notice of Action and calculate your deadline immediately.'
      },
      {
        title: 'Preparing your evidence packet',
        content: 'Organize your evidence into a tabbed binder: Tab 1 — The denial Notice of Action. Tab 2 — Medical records and physician letters specifically addressing the eligibility criteria. Tab 3 — Therapy records (ABA, speech, OT). Tab 4 — Behavior logs and incident reports. Tab 5 — School records (IEPs, assessments, incident reports). Tab 6 — Any written communications with the agency. Provide 3 copies: one for yourself, one for the ALJ, one for the opposing agency representative.',
        tip: 'Ask your treating providers to write letters that use the EXACT statutory language from the relevant code section. A physician who writes "this child requires 24-hour protective supervision as defined under Welfare & Institutions Code § 12300(b)" is far more persuasive than one who writes "the child needs constant supervision."'
      },
      {
        title: 'At the hearing',
        content: 'You will appear before an Administrative Law Judge (ALJ) either in person or by phone/video. The hearing follows a semi-formal process: opening statements, county presents their case, you cross-examine their witness, you present your evidence, county cross-examines. You may represent yourself (pro per) or have an advocate or attorney. Non-attorney representatives are allowed at Fair Hearings.',
        tip: 'Request a Spanish or other-language interpreter in advance if needed — this is your right at no cost.'
      },
      {
        title: 'After the decision',
        content: 'The ALJ issues a proposed decision, which the agency Director must adopt, reject, or modify within 35 days (IHSS/Medi-Cal) or 30 days (Regional Center). If you win, services must be restored retroactively. If you lose, you may appeal to the Superior Court (writ of mandamus) within 90 days of the final agency decision. Free legal help is available through: Disability Rights California (1-800-776-5746), Regional Center Client Rights Advocates, COPAA member attorneys.',
        citation: 'California Welfare & Institutions Code § 10960; Government Code § 11517'
      }
    ]
  },
  {
    id: 'self-determination',
    title: 'Transitioning to Self-Determination Program',
    subtitle: 'Understanding the SDP spending plan, FMS selection, and avoiding the common pitfalls of the transition',
    icon: <Users size={22} />,
    color: '#8b5cf6',
    readTime: '8 min read',
    difficulty: 'Advanced',
    steps: [
      {
        title: 'What the Self-Determination Program (SDP) is',
        content: 'SDP allows Regional Center consumers (or their families) to control an individualized budget and directly hire their own service providers, instead of working through RC-vendorized agencies. This gives enormous flexibility to hire bilingual providers, set specific schedules, and access less common supports. The program is overseen by the Dept. of Developmental Services and managed locally by each Regional Center.',
        citation: 'California Welfare & Institutions Code § 4685.8'
      },
      {
        title: 'The Individual Budget calculation',
        content: 'Your SDP budget is based on your current "Purchase of Service" (POS) spending from the Regional Center, adjusted by a statewide formula. You cannot receive more than a calculated maximum, but you can allocate the budget across any approved service categories differently than your current plan. Hire a Financial Management Service (FMS) first — they will help you create the Spending Plan before your budget is finalized.',
        tip: 'Your RC coordinator may present the budget as fixed. You can challenge the calculation. Request the worksheet that shows how your budget was computed and compare it against your historical POS spending.'
      },
      {
        title: 'Choosing a Financial Management Service (FMS)',
        content: 'The FMS acts as your fiscal employer — they handle background checks, payroll, billing to the RC, and compliance for the workers you hire. California has multiple DDS-approved FMS providers. Compare them on: (1) How quickly they process new hire paperwork, (2) How quickly they pay workers (delays cause provider turnover), (3) Whether they have bilingual staff, (4) Their track record with the RC in your catchment.',
        warning: 'Slow FMS processing is the #1 cause of SDP service gaps. Workers can quit if paychecks are delayed. Interview your FMS on their average time-to-first-paycheck before signing.'
      },
      {
        title: 'Writing your Spending Plan',
        content: 'Your Spending Plan must allocate your budget across service categories: respite, behavior services, community-based supports, personal care, transportation, etc. Each category needs: a service description, number of hours/units, cost per unit, and total cost. The plan must align with your child\'s IPP goals. An Independent Facilitator (IF) can help you write the plan — this is an RC-funded role.',
        tip: 'Build a 5-10% unallocated reserve for unexpected needs. The SDP allows you to reallocate funds between categories during the year with RC approval.'
      },
      {
        title: 'Avoiding the transition service gap',
        content: 'The most dangerous moment in SDP is the transition date — when RC-vendorized services stop and your self-hired providers must be fully credentialed through the FMS. Providers who are not fully cleared on day 1 cannot legally provide (or be paid for) services. Start the FMS onboarding process 60-90 days before your SDP start date. Do not finalize a start date until all key providers are cleared.',
        warning: 'Never agree to a SDP start date until your FMS confirms all providers are cleared. The Regional Center may pressure you to "go live" before providers are ready.'
      }
    ]
  }
];

const GUIDES_ES: Guide[] = [
  {
    id: 'rc-intake',
    title: 'Preparación para la Admisión al Centro Regional',
    subtitle: 'Cómo navegar su primera reunión de admisión bajo la Ley Lanterman y maximizar la evaluación de elegibilidad de su hijo',
    icon: <Landmark size={22} />,
    color: '#6366f1',
    readTime: '8 min de lectura',
    difficulty: 'Beginner',
    steps: [
      {
        title: 'Comprender lo que los Centros Regionales pueden financiar',
        content: 'Los 21 Centros Regionales de California están financiados bajo la Ley de Servicios para Personas con Discapacidades del Desarrollo Lanterman. Coordinan y pagan servicios para personas con autismo, parálisis cerebral, discapacidad intelectual, epilepsia y la "quinta categoría" (condiciones discapacitantes similares a la discapacidad intelectual que se originan antes de los 18 años). Los servicios incluyen cuidado de relevo (respite), terapias de lenguaje/OT/PT, intervención conductual, equipo adaptativo, transporte y programas diurnos.',
        tip: 'Los Centros Regionales son el pagador de ÚLTIMO RECURSO; esto significa que intentarán redirigirlo primero a Medi-Cal, seguro privado o su distrito escolar. Debe agotar esas opciones antes de que el Centro Regional financie los servicios.',
        citation: 'Código de Bienestar e Instituciones de California § 4512'
      },
      {
        title: 'Reunir su documentación de admisión ANTES de la cita',
        content: 'Venga preparado con: (1) Acta de nacimiento y tarjeta de Seguro Social del niño, (2) Informe de diagnóstico más reciente de un psicólogo o médico certificado (debe nombrar el diagnóstico calificado), (3) Registros médicos que muestren limitaciones funcionales, (4) Informes previos de IEP o evaluaciones escolares, (5) Registros de vacunación e historial médico.',
        warning: 'Un diagnóstico por sí solo no es suficiente. El Centro Regional evalúa las LIMITACIONES FUNCIONALES en áreas como comunicación, cuidado personal, movilidad y autodirección. Documente ejemplos específicos de desafíos de la vida diaria.'
      },
      {
        title: 'Conocer sus derechos legales antes de la reunión',
        content: 'Bajo la Ley Lanterman, el Centro Regional debe: (1) Iniciar la admisión dentro de los 15 días de su solicitud, (2) Completar la determinación de elegibilidad dentro de los 120 días, (3) Proporcionar un intérprete sin costo si no domina el inglés, (4) Entregarle un Aviso de Acción (NOA) por escrito para cualquier denegación con sus derechos de apelación.',
        citation: 'Código de Bienestar e Instituciones de California § 4642(a)'
      },
      {
        title: 'Qué sucede en la reunión de admisión',
        content: 'Se reunirá con un coordinador de admisión que revisará la documentación y completará una evaluación estandarizada (a menudo las Escalas de Conducta Adaptativa Vineland o similar). Evalúan a su hijo en 7 áreas: cuidado personal, lenguaje receptivo y expresivo, aprendizaje, movilidad, autodirección, capacidad para la vida independiente y autosuficiencia económica. Sea específico y concreto: describa los PEORES días de su hijo, no los días promedio.',
        tip: 'Traiga una narrativa escrita (1-2 páginas) que describa los desafíos de funcionamiento diario de su hijo. Esto se convierte en parte del expediente permanente y obliga al coordinador a abordar sus preocupaciones específicas.',
      },
      {
        title: 'Si le niegan la elegibilidad: sus derechos de apelación',
        content: 'Tiene 30 días para solicitar una Audiencia Imparcial ante la Oficina de Audiencias Administrativas (OAH) si no está de acuerdo con la denegación de elegibilidad o cualquier decisión de servicio. También puede solicitar una Mediación Estatal (informal, más rápida) como alternativa. Durante una apelación, sus servicios actuales no pueden reducirse hasta que se resuelva la audiencia (protección de "Ayuda Pagada Pendiente").',
        warning: 'Perder el plazo de apelación de 30 días significa que debe reiniciar el proceso de admisión. Realice un seguimiento cuidadoso de la fecha en su Aviso de Acción.',
        citation: 'Código de Bienestar e Instituciones de California § 4710.5'
      },
      {
        title: 'Después de la aprobación: Su Plan de Programa Individual (IPP)',
        content: 'Una vez elegible, el Centro Regional debe desarrollar un Plan de Programa Individual (IPP) con usted dentro de los 60 días de la elegibilidad. El IPP documenta las metas de su hijo y qué servicios financiará el Centro Regional. Usted es un miembro REQUERIDO del equipo del IPP; el Centro Regional no puede finalizar un IPP sin su opinión. Solicite una copia por escrito después de cada reunión.',
        tip: 'Solicite que su IPP se revise al menos anualmente o en cualquier momento en que las necesidades de su hijo cambien significativamente. No hay límite en la frecuencia con la que puede solicitar una revisión del IPP.'
      }
    ]
  },
  {
    id: 'iep-meeting',
    title: 'Dominar el Proceso del IEP',
    subtitle: 'Cómo prepararse para las reuniones del IEP, ejercer sus derechos como miembro igualitario del equipo y rechazar colocaciones inadecuadas',
    icon: <GraduationCap size={22} />,
    color: '#0ea5e9',
    readTime: '10 min de lectura',
    difficulty: 'Intermediate',
    steps: [
      {
        title: 'Sus derechos como miembro del equipo del IEP',
        content: 'Bajo la Ley de Educación para Personas con Discapacidades (IDEA) y el Código de Educación de California, usted es un miembro IGUALITARIO del equipo con derecho a: no estar de acuerdo con las evaluaciones, proponer colocaciones o metas diferentes, traer a cualquier persona a la reunión (defensor, terapeuta, amigo), grabar la reunión (con aviso por escrito de 24 horas en California) y rechazar cualquier parte del IEP por escrito.',
        tip: 'El distrito escolar NO PUEDE celebrar una reunión del IEP ni finalizar un IEP sin usted. Tiene el derecho absoluto de reprogramar si la hora de la reunión es inconveniente.',
        citation: 'IDEA 20 U.S.C. § 1414(d); Código de Educación de California § 56341'
      },
      {
        title: 'Preparar su declaración de los padres por escrito antes de la reunión',
        content: 'Escriba una declaración de 1 a 2 páginas de "Preocupaciones y Visión de los Padres" antes de cada reunión del IEP. Incluya: déficits de habilidades específicos que observa en el hogar, preocupaciones de seguridad, necesidades sociales/emocionales, su visión para la independencia a largo plazo de su hijo y cualquier servicio que esté solicitando. Entregue una copia a cada miembro del equipo al comienzo de la reunión y solicite que se adjunte al IEP.',
        tip: 'Esta declaración se convierte en parte del registro oficial del IEP. Obliga al equipo a responder formalmente a sus preocupaciones y crea documentación si necesita apelar más adelante.'
      },
      {
        title: 'Comprender el Entorno Menos Restrictivo (LRE)',
        content: 'La ley de California y la ley federal requieren que los niños reciban educación especial en el Entorno Menos Restrictivo, lo que significa el mayor tiempo posible junto a sus compañeros sin discapacidades. Las escuelas con frecuencia presionan por entornos más restrictivos (aulas especiales) porque son menos costosos para ellas. Tiene derecho a exigir que se considere y documente una continuidad de opciones de colocación.',
        warning: 'Si el distrito recomienda una colocación más restrictiva de lo que considera apropiado, pídales que documenten en el IEP: (1) por qué la inclusión con apoyos no puede satisfacer las necesidades de su hijo, y (2) qué ayudas y servicios suplementarios se consideraron.',
        citation: 'IDEA 20 U.S.C. § 1412(a)(5); Código de Ed de California § 56364'
      },
      {
        title: 'Solicitar evaluaciones independientes',
        content: 'Si no está de acuerdo con la evaluación del distrito, tiene derecho a solicitar una Evaluación Educativa Independiente (IEE) a expensas del distrito. El distrito debe financiar la IEE o presentar una solicitud de audiencia de debido proceso para demostrar que su propia evaluación fue apropiada. Las IEE comunes incluyen: evaluaciones psicoeducativas, evaluaciones del habla/lenguaje, evaluaciones de terapia ocupacional/física y FBA (Evaluaciones de Comportamiento Funcional).',
        citation: 'Código de Educación de California § 56329; 34 CFR § 300.502'
      },
      {
        title: 'Cuándo no estar de acuerdo y cómo documentarlo',
        content: 'NUNCA firme un IEP con el que no esté de acuerdo bajo presión. Puede: (1) Firmar solo la página de asistencia (no el consentimiento), (2) Escribir "El padre no da su consentimiento" en el IEP antes de firmar, (3) Enviar una carta de desacuerdo por escrito dentro de los 5 días escolares, (4) Solicitar una extensión de 30 días para revisar con un defensor. Si firma el IEP, acepta legalmente la colocación; los distritos saben esto y usan la presión del tiempo como táctica.',
        warning: 'Firmar el IEP en la reunión bajo presión es el error número 1 que cometen los padres. Lleve el documento a casa. Tiene tiempo.'
      },
      {
        title: 'Escalada: Presentar una queja o debido proceso',
        content: 'Existen dos caminos formales de escalada: (1) Queja de Cumplimiento del Departamento de Educación de California (CDE): gratuita, se resuelve dentro de los 60 días, cubre violaciones de procedimiento como incumplimiento de plazos o falta de implementación del IEP. (2) Audiencia de Debido Proceso de la OAH: audiencia legal formal que puede resultar en servicios compensatorios o cambios de colocación. El debido proceso es costoso ($10,000–$40,000) a menos que tenga un defensor o representación legal sin fines de lucro.',
        tip: 'Presente una queja de cumplimiento ante el CDE PRIMERO para violaciones de procedimiento. Es gratuita, rápida y a menudo resuelve los problemas sin necesidad de debido proceso.',
        citation: 'Código de Ed de California § 56501'
      }
    ]
  },
  {
    id: 'ihss-apply',
    title: 'Solicitar Supervisión Proactiva de IHSS',
    subtitle: 'Cómo asegurar horas remuneradas para padres cuidadores de niños con discapacidades cognitivas o de comportamiento graves bajo IHSS',
    icon: <Heart size={22} />,
    color: '#10b981',
    readTime: '9 min de lectura',
    difficulty: 'Intermediate',
    steps: [
      {
        title: 'Qué significa realmente la Supervisión Proactiva',
        content: 'La Supervisión Proactiva (Protective Supervision - PS) de IHSS paga a un cuidador designado (incluido un padre) para proporcionar supervisión continua para evitar lesiones a personas que "tienen un deterioro mental y no pueden pedir ayuda o reconocer el peligro". Esto es diferente del cuidado personal general. Para niños con autismo o discapacidad intelectual, el estándar clave es que el niño es "incapaz de dirigir su propio cuidado" debido a un deterioro cognitivo, no solo una discapacidad física.',
        citation: 'Código de Bienestar e Instituciones de California § 12300(b); CDSS MPP § 30-756.17'
      },
      {
        title: 'Qué documentación necesita',
        content: 'Para calificar para la Supervisión Proactiva, el médico de su hijo debe completar el formulario de certificación médica SOC 873. Más allá del SOC 873, debe reunir: (1) Una carta del médico que describa explícitamente la incapacidad del niño para reconocer y evitar el peligro, (2) Registros de terapia de comportamiento que indiquen incidentes de fuga (elopement), autolesión, PICA o agresión, (3) Informes de incidentes escolares y planes de seguridad del IEP, (4) Su propio registro de seguridad por escrito que documente incidentes peligrosos específicos con fechas y horas.',
        tip: 'Las notas médicas genéricas que dicen "el niño tiene autismo" son insuficientes. La documentación debe describir específicamente CÓMO el niño no puede reconocer el peligro y qué riesgos específicos de seguridad requieren supervisión las 24 horas, los 7 días de la semana.'
      },
      {
        title: 'Qué significa realmente "incapaz de dirigir el cuidado" para el condado',
        content: 'Los trabajadores sociales del condado a menudo aplican incorrectamente el estándar de PS, denegando los beneficios al afirmar que el niño "puede pedir ayuda" o "muestra cierta conciencia". Para cumplir con el estándar, su documentación debe mostrar que el niño NO PUEDE: reconocer consistentemente situaciones peligrosas (tráfico, extraños, alturas), comprender las consecuencias del comportamiento autolesivo, pedir ayuda de manera confiable o autorregularse para evitar lesiones.',
        warning: 'Los trabajadores sociales a veces enmarcan la fuga o la autolesión como "problemas de comportamiento" en lugar de necesidades de supervisión de seguridad. Presione enfatizando la incapacidad COGNITIVA para reconocer el peligro, no el manejo del comportamiento.'
      },
      {
        title: 'La visita domiciliaria de evaluación del condado',
        content: 'Un trabajador social del condado visitará su hogar para una evaluación. Durante esta visita: (1) NO ordene ni esconda el equipo de seguridad; deje que el trabajador social vea el entorno real (alarmas de puertas, cerraduras de gabinetes, protectores de ventanas). (2) Describa el comportamiento de su hijo en sus PEORES días, no en los días típicos. (3) Tenga su paquete de documentación listo para entregar. (4) Si es posible, tenga a su hijo presente para que el trabajador observe su funcionamiento directamente.',
        tip: 'Pídale al trabajador social que documente todo lo que observe durante la visita domiciliaria. Si no lo escriben, no cuenta.'
      },
      {
        title: 'Si recibe una denegación o reducción por Aviso de Acción (NOA)',
        content: 'Tiene dos plazos críticos: (1) PRESENTE LA APELACIÓN DENTRO DE LOS 10 DÍAS para mantener la "Ayuda Pagada Pendiente" (Aid Paid Pending): esto significa que sus horas ACTUALES permanecen activas mientras se procesa la apelación. (2) PRESENTE LA APELACIÓN DENTRO DE LOS 90 DÍAS si no necesita la protección de Ayuda Pagada Pendiente. Perder el plazo de 10 días significa que pierde las horas existentes de inmediato mientras espera la audiencia.',
        warning: 'La regla de los 10 días para la Ayuda Pagada Pendiente es el plazo que más se pierde en las apelaciones de IHSS. Marque la fecha del NOA en un calendario el día que lo reciba.',
        citation: 'Código de Bienestar e Instituciones de California § 10950; CDSS MPP § 22-072'
      },
      {
        title: 'Preparación para la Audiencia Imparcial del Estado',
        content: 'En la audiencia de la OAH, un Juez de Derecho Administrativo (ALJ) revisa la evidencia. Estrategias clave: (1) Traiga evidencia objetiva de terceros: registros médicos, notas de terapia, registros de incidentes escolares, evaluaciones de comportamiento. El juez descuenta en gran medida el testimonio de los padres por sí solo. (2) Pida a su médico tratante o terapeuta de comportamiento que proporcione una carta o, idealmente, testimonio. (3) Traiga una copia impresa de su Registro de Comportamiento de IHSS.',
        tip: 'Solicite todos los registros del condado sobre el caso de su hijo antes de la audiencia (solicitud bajo la Ley de Registros Públicos). Tiene derecho a ver lo que el condado presentó como evidencia y puede impugnar las inexactitudes.'
      }
    ]
  },
  {
    id: 'appeals-guide',
    title: 'Presentar una Apelación de Audiencia Imparcial',
    subtitle: 'Guía paso a paso para impugnar denegaciones de IHSS, Centro Regional y Medi-Cal ante la Oficina de Audiencias Administrativas',
    icon: <Scale size={22} />,
    color: '#f59e0b',
    readTime: '7 min de lectura',
    difficulty: 'Advanced',
    steps: [
      {
        title: 'Cuándo presentar y a qué agencia contactar',
        content: 'Las Audiencias Imparciales del Estado son adjudicadas por la Oficina de Audiencias Administrativas (OAH) de California para casos de IHSS y Medi-Cal, y también por la OAH para disputas del Centro Regional. Para disputas de IEP/escolares, la misma OAH maneja las audiencias de "debido proceso" bajo el Código de Educación. Puede solicitar una audiencia llamando al 1-800-952-5253 o presentando su solicitud en línea en cdss.ca.gov/fair-hearings.',
        citation: 'Código de Bienestar e Instituciones de California § 10950; Código de Ed de California § 56501'
      },
      {
        title: 'Los plazos más críticos',
        content: 'IHSS/Medi-Cal: 90 días desde la fecha del NOA para presentar una Audiencia Imparcial. 10 días para la protección de Ayuda Pagada Pendiente. Centro Regional: 30 días desde el Aviso de Acción por escrito. Debido Proceso del IEP: 2 años a partir de la fecha en que conoció o debería haber conocido la violación (con excepciones por ocultamiento activo). Queja del CDE de California: 1 año desde la violación.',
        warning: 'Estos plazos son ABSOLUTOS: los tribunales han confirmado las desestimaciones de audiencias presentadas incluso 1 día tarde. Confirme la fecha exacta en su Aviso de Acción y calcule su plazo de inmediato.'
      },
      {
        title: 'Preparar su paquete de pruebas',
        content: 'Organice sus pruebas en una carpeta con pestañas: Pestaña 1 — El Aviso de Acción de denegación. Pestaña 2 — Registros médicos y cartas del médico que aborden específicamente los criterios de elegibilidad. Pestaña 3 — Registros de terapia (ABA, habla, OT). Pestaña 4 — Registros de comportamiento e informes de incidentes. Pestaña 5 — Registros escolares (IEP, evaluaciones, informes de incidentes). Proporcione 3 copias: una para usted, otra para el juez y otra para el representante de la agencia opositora.',
        tip: 'Pida a sus proveedores tratantes que escriban cartas que utilicen el lenguaje legal EXACTO de la sección del código correspondiente. Un médico que escribe "este niño requiere supervisión de seguridad las 24 horas como se define en el Código de Bienestar e Instituciones § 12300(b)" es mucho más persuasivo que uno que escribe "el niño necesita supervisión constante".'
      },
      {
        title: 'Durante la audiencia',
        content: 'Aparecerá ante un Juez de Derecho Administrativo (ALJ) en persona o por teléfono/video. La audiencia sigue un proceso semi-formal: declaraciones de apertura, el condado presenta su caso, usted interroga a su testigo, usted presenta sus pruebas y el condado realiza el contrainterrogatorio. Puede representarse a sí mismo (pro per) o contar con un defensor o abogado. Se permiten representantes que no sean abogados en las Audiencias Imparciales.',
        tip: 'Solicite un intérprete de español u otro idioma con anticipación si es necesario: este es su derecho sin costo alguno.'
      },
      {
        title: 'Después de la decisión',
        content: 'El juez emite una decisión propuesta, que el director de la agencia debe adoptar, rechazar o modificar dentro de los 35 días (IHSS/Medi-Cal) o 30 días (Centro Regional). Si gana, los servicios deben restablecerse retroactivamente. Si pierde, puede apelar ante el Tribunal Superior (orden de mandato) dentro de los 90 días de la decisión final de la agencia. Hay ayuda legal gratuita disponible a través de: Disability Rights California (1-800-776-5746) y defensores de derechos del cliente de los Centros Regionales.',
        citation: 'Código de Bienestar e Instituciones de California § 10960; Código de Gobierno § 11517'
      }
    ]
  },
  {
    id: 'self-determination',
    title: 'Transición al Programa de Autodeterminación',
    subtitle: 'Comprender el plan de gastos del SDP, la selección de FMS y cómo evitar los errores comunes de la transición',
    icon: <Users size={22} />,
    color: '#8b5cf6',
    readTime: '8 min de lectura',
    difficulty: 'Advanced',
    steps: [
      {
        title: 'Qué es el Programa de Autodeterminación (SDP)',
        content: 'El SDP permite a los consumidores del Centro Regional (o a sus familias) controlar un presupuesto individualizado y contratar directamente a sus propios proveedores de servicios, en lugar de trabajar a través de agencias vendidas por el Centro Regional. Esto brinda una flexibilidad enorme para contratar proveedores bilingües, establecer horarios específicos y acceder a apoyos menos comunes. El programa es supervisado por el Dept. de Servicios del Desarrollo (DDS) y administrado localmente por cada Centro Regional.',
        citation: 'Código de Bienestar e Instituciones de California § 4685.8'
      },
      {
        title: 'El cálculo del Presupuesto Individual',
        content: 'Su presupuesto del SDP se basa en su gasto actual de "Compra de Servicios" (POS) del Centro Regional, ajustado por una fórmula estatal. No puede recibir más de un máximo calculado, pero puede asignar el presupuesto entre las categorías de servicios aprobadas de manera diferente a su plan actual. Contrate primero un Servicio de Gestión Financiera (FMS): ellos le ayudarán a crear el Plan de Gastos antes de que se finalice su presupuesto.',
        tip: 'Su coordinador del Centro Regional puede presentar el presupuesto como fijo. Puede impugnar el cálculo. Solicite la hoja de trabajo que muestra cómo se calculó su presupuesto y compárela con su gasto POS histórico.',
      },
      {
        title: 'Elegir un Servicio de Gestión Financiera (FMS)',
        content: 'El FMS actúa como su empleador fiscal: maneja las verificaciones de antecedentes, la nómina, la facturación al Centro Regional y el cumplimiento de los trabajadores que contrata. California tiene múltiples proveedores de FMS aprobados por el DDS. Compárelos en: (1) Qué tan rápido procesan el papeleo de las nuevas contrataciones, (2) Qué tan rápido pagan a los trabajadores, (3) Si tienen personal bilingüe, (4) Su historial con el Centro Regional en su área.',
        warning: 'El procesamiento lento del FMS es la causa número 1 de las brechas en el servicio del SDP. Los trabajadores pueden renunciar si los cheques de pago se retrasan. Entreviste a su FMS sobre su tiempo promedio para el primer cheque de pago antes de firmar.'
      },
      {
        title: 'Redactar su Plan de Gastos',
        content: 'Su Plan de Gastos debe asignar su presupuesto a las categorías de servicio: respiro, servicios de comportamiento, apoyos basados en la comunidad, cuidado personal, transporte, etc. Cada categoría necesita: una descripción del servicio, número de horas/unidades, costo por unidad y costo total. El plan debe alinearse con las metas del IPP de su hijo. Un Facilitador Independiente (IF) puede ayudarle a redactar el plan (este es un rol financiado por el Centro Regional).',
        tip: 'Construya una reserva no asignada del 5-10% para necesidades inesperadas. El SDP le permite reasignar fondos entre categorías durante el año con la aprobación del Centro Regional.'
      },
      {
        title: 'Evitar la brecha de servicio de transición',
        content: 'El momento más crítico en el SDP es la fecha de transición, cuando se detienen los servicios vendidos por el Centro Regional y sus proveedores contratados por usted mismo deben estar completamente acreditados a través del FMS. Los proveedores que no estén completamente autorizados el día 1 no pueden prestar servicios legalmente. Comience el proceso de incorporación del FMS de 60 a 90 días antes de su fecha de inicio del SDP.',
        warning: 'Nunca acepte una fecha de inicio del SDP hasta que su FMS confirme que todos los proveedores están autorizados. El Centro Regional puede presionarle para "comenzar en vivo" antes de que los proveedores estén listos.'
      }
    ]
  }
];

const DIFFICULTY_COLORS = {
  'Beginner': { bg: 'rgba(16, 185, 129, 0.08)', color: '#059669', border: 'rgba(16, 185, 129, 0.15)' },
  'Intermediate': { bg: 'rgba(245, 158, 11, 0.08)', color: '#d97706', border: 'rgba(245, 158, 11, 0.15)' },
  'Advanced': { bg: 'rgba(239, 68, 68, 0.08)', color: '#dc2626', border: 'rgba(239, 68, 68, 0.15)' },
};

interface KnowledgeBasePanelProps {
  isSpanish?: boolean;
}

export default function KnowledgeBasePanel({ isSpanish = false }: KnowledgeBasePanelProps) {
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeGuides = isSpanish ? GUIDES_ES : GUIDES;

  const filteredGuides = activeGuides.filter(g => 
    searchQuery === '' || 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentGuide = activeGuide ? activeGuides.find(g => g.id === activeGuide) : null;

  // Translated difficulty names
  const getDifficultyLabel = (diff: string) => {
    if (isSpanish) {
      if (diff === 'Beginner') return 'Principiante';
      if (diff === 'Intermediate') return 'Intermedio';
      return 'Avanzado';
    }
    return diff;
  };

  return (
    <div className="animate-fade-in">
      {!currentGuide ? (
        <>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={22} color="var(--primary-color)" />
              {isSpanish ? 'Biblioteca de Guías de Autoayuda' : 'Self-Help Knowledge Base'}
            </h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              {isSpanish 
                ? 'Guías paso a paso para navegar los sistemas de apoyo para necesidades especiales en California, redactadas en un lenguaje claro y fundamentadas en la ley.'
                : 'Step-by-step guides on navigating California\'s special needs support systems — written in plain language, backed by law.'}
            </p>

            {/* Search */}
            <div style={{ position: 'relative', maxWidth: '420px' }}>
              <input
                type="text"
                placeholder={isSpanish ? 'Buscar guías...' : 'Search guides...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 1rem 0.6rem 2.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  fontSize: '0.9rem',
                  background: 'rgba(255,255,255,0.85)',
                  outline: 'none'
                }}
              />
              <BookOpen size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          {/* Guide Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {filteredGuides.map(guide => {
              const diffStyle = DIFFICULTY_COLORS[guide.difficulty];
              return (
                <button
                  key={guide.id}
                  onClick={() => { setActiveGuide(guide.id); setExpandedStep(null); }}
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 20px rgba(0,0,0,0.08), 0 0 0 2px ${guide.color}20`;
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  }}
                >
                  {/* Icon + title */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ background: `${guide.color}15`, color: guide.color, padding: '0.65rem', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                      {guide.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-main)', lineHeight: 1.3 }}>{guide.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: 1.4, margin: 0 }}>{guide.subtitle}</p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', background: diffStyle.bg, color: diffStyle.color, border: `1px solid ${diffStyle.border}`, padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>
                      {getDifficultyLabel(guide.difficulty)}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={11} /> {guide.readTime}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {guide.steps.length} {isSpanish ? 'pasos' : 'steps'}
                    </span>
                  </div>

                  {/* CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: guide.color, fontWeight: 600, fontSize: '0.85rem', marginTop: 'auto' }}>
                    {isSpanish ? 'Leer Guía' : 'Read Guide'} <ArrowRight size={14} />
                  </div>
                </button>
              );
            })}
          </div>

          {filteredGuides.length === 0 && (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
              <BookOpen size={36} style={{ marginBottom: '1rem', opacity: 0.4 }} />
              <p>{isSpanish ? 'No hay guías que coincidan con su búsqueda. Intente con otras palabras clave.' : 'No guides match your search. Try different keywords.'}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: '12px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Info size={16} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text-main)' }}>{isSpanish ? 'Aviso Legal:' : 'Legal Disclaimer:'}</strong>{' '}
              {isSpanish 
                ? 'Estas guías proporcionan información general sobre la educación especial de California y la ley de beneficios por discapacidad. No constituyen asesoría legal. Para su situación específica, consulte con un abogado de educación especial con licencia en California o con un defensor certificado. Los recursos legales gratuitos incluyen '
                : 'These guides provide general information about California special education and disability benefits law. They do not constitute legal advice. For your specific situation, consult a licensed California special education attorney or Board Certified advocate. Free legal resources include '}
              <a href="https://www.disabilityrightsca.org" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>Disability Rights California</a> {isSpanish ? ' y ' : ' and ' }
              <a href="https://www.copaa.org" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>COPAA</a>.
            </p>
          </div>
        </>
      ) : (
        // Individual Guide View
        <div>
          {/* Back */}
          <button
            onClick={() => { setActiveGuide(null); setExpandedStep(null); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.5rem', padding: 0 }}
          >
            {isSpanish ? '← Volver a Todas las Guías' : '← Back to All Guides'}
          </button>

          {/* Guide Header */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.9)', borderTop: `4px solid ${currentGuide.color}` }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ background: `${currentGuide.color}15`, color: currentGuide.color, padding: '0.75rem', borderRadius: '14px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {currentGuide.icon}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.35rem' }}>{currentGuide.title}</h2>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>{currentGuide.subtitle}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
              <span style={{ background: DIFFICULTY_COLORS[currentGuide.difficulty].bg, color: DIFFICULTY_COLORS[currentGuide.difficulty].color, border: `1px solid ${DIFFICULTY_COLORS[currentGuide.difficulty].border}`, padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>{getDifficultyLabel(currentGuide.difficulty)}</span>
              <span style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {currentGuide.readTime}</span>
              <span style={{ color: 'var(--text-light)' }}>{currentGuide.steps.length} {isSpanish ? 'pasos en total' : 'steps total'}</span>
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentGuide.steps.map((step, idx) => {
              const isOpen = expandedStep === idx;
              return (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{ padding: 0, overflow: 'hidden', background: 'rgba(255,255,255,0.85)', border: isOpen ? `1px solid ${currentGuide.color}30` : '1px solid var(--glass-border)', transition: 'border 0.2s' }}
                >
                  <button
                    onClick={() => setExpandedStep(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      background: isOpen ? `${currentGuide.color}06` : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '1.1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: isOpen ? currentGuide.color : 'rgba(0,0,0,0.05)',
                      color: isOpen ? 'white' : 'var(--text-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.78rem', fontWeight: 700, flexShrink: 0, transition: 'all 0.2s'
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{step.title}</span>
                    {step.citation && (
                      <span style={{ fontSize: '0.7rem', color: currentGuide.color, fontWeight: 600, flexShrink: 0, marginRight: '0.5rem', display: 'none' }} className="citation-badge">{step.citation}</span>
                    )}
                    {isOpen ? <ChevronUp size={18} color="var(--text-light)" /> : <ChevronDown size={18} color="var(--text-light)" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-main)', margin: 0 }}>{step.content}</p>

                      {step.citation && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: `${currentGuide.color}08`, border: `1px solid ${currentGuide.color}20`, borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: currentGuide.color, fontWeight: 600, alignSelf: 'flex-start' }}>
                          <FileText size={12} />
                          {step.citation}
                        </div>
                      )}

                      {step.tip && (
                        <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                          <Lightbulb size={16} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6366f1', display: 'block', marginBottom: '0.2rem' }}>{isSpanish ? 'CONSEJO PRÁCTICO' : 'PRO TIP'}</span>
                            <p style={{ fontSize: '0.83rem', lineHeight: 1.5, color: 'var(--text-main)', margin: 0 }}>{step.tip}</p>
                          </div>
                        </div>
                      )}

                      {step.warning && (
                        <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                          <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', display: 'block', marginBottom: '0.2rem' }}>{isSpanish ? 'ADVERTENCIA IMPORTANTE' : 'IMPORTANT WARNING'}</span>
                            <p style={{ fontSize: '0.83rem', lineHeight: 1.5, color: 'var(--text-main)', margin: 0 }}>{step.warning}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom nav */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={() => { setActiveGuide(null); setExpandedStep(null); }}
              style={{ background: 'none', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '0.6rem 1.25rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}
            >
              {isSpanish ? '← Todas las Guías' : '← All Guides'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
              <CheckCircle2 size={14} color="#10b981" />
              {isSpanish ? 'Revisado de acuerdo con la ley de California a partir de 2025' : 'Reviewed against California law as of 2025'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
