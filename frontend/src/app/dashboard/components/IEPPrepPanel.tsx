'use client';

import React, { useState, useEffect } from 'react';
import { useChildProfile } from './ChildProfileContext';
import { 
  BookOpen, FileText, CheckCircle2, Copy, Printer, Scale 
} from 'lucide-react';
interface IEPPrepPanelProps {
  isSpanish?: boolean;
}

export default function IEPPrepPanel({ isSpanish = false }: IEPPrepPanelProps) {
  const { currentChild } = useChildProfile();
  
  // Parent Statement Builder Form States
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [strengths, setStrengths] = useState('');
  const [academicConcerns, setAcademicConcerns] = useState('');
  const [speechConcerns, setSpeechConcerns] = useState('');
  const [sensoryConcerns, setSensoryConcerns] = useState('');
  const [motorConcerns, setMotorConcerns] = useState('');
  const [socialConcerns, setSocialConcerns] = useState('');
  const [requestedServices, setRequestedServices] = useState('');
  const [parentVision, setParentVision] = useState('');
  const [copied, setCopied] = useState(false);

  // Hydrate child names
  useEffect(() => {
    if (currentChild) {
      const nickname = currentChild.nickname || '';
      const savedParent = localStorage.getItem('caregiver_name') || localStorage.getItem('funding_parent_name') || '';
      
      // Load cached form states for this child if any
      const cached = localStorage.getItem(`iep_prep_data_${currentChild.id}`);
      const formFields = {
        strengths: '',
        academicConcerns: '',
        speechConcerns: '',
        sensoryConcerns: '',
        motorConcerns: '',
        socialConcerns: '',
        requestedServices: '',
        parentVision: ''
      };
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.strengths) formFields.strengths = parsed.strengths;
          if (parsed.academicConcerns) formFields.academicConcerns = parsed.academicConcerns;
          if (parsed.speechConcerns) formFields.speechConcerns = parsed.speechConcerns;
          if (parsed.sensoryConcerns) formFields.sensoryConcerns = parsed.sensoryConcerns;
          if (parsed.motorConcerns) formFields.motorConcerns = parsed.motorConcerns;
          if (parsed.socialConcerns) formFields.socialConcerns = parsed.socialConcerns;
          if (parsed.requestedServices) formFields.requestedServices = parsed.requestedServices;
          if (parsed.parentVision) formFields.parentVision = parsed.parentVision;
        } catch {}
      }

      Promise.resolve().then(() => {
        setChildName(nickname);
        setParentName(savedParent);
        setStrengths(formFields.strengths);
        setAcademicConcerns(formFields.academicConcerns);
        setSpeechConcerns(formFields.speechConcerns);
        setSensoryConcerns(formFields.sensoryConcerns);
        setMotorConcerns(formFields.motorConcerns);
        setSocialConcerns(formFields.socialConcerns);
        setRequestedServices(formFields.requestedServices);
        setParentVision(formFields.parentVision);
      });
    }
  }, [currentChild]);

  // Persist form states
  const persistPrepData = (fields: Record<string, string>) => {
    if (!currentChild) return;
    const currentData = {
      strengths, academicConcerns, speechConcerns, sensoryConcerns,
      motorConcerns, socialConcerns, requestedServices, parentVision,
      ...fields
    };
    localStorage.setItem(`iep_prep_data_${currentChild.id}`, JSON.stringify(currentData));
  };

  if (!currentChild) return null;

  // Compile Parent Statement
  const compileStatementText = () => {
    const todayStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    if (isSpanish) {
      return `DECLARACIÓN DE PREOCUPACIONES DE LOS PADRES PARA EL IEP

Fecha: ${todayStr}
Estudiante: ${childName}
Padre/Tutor: ${parentName}

Estimado Equipo del IEP:

De acuerdo con el Código de Educación de California Sección 56341.1(a)(1) y la ley federal IDEA (20 U.S.C. § 1414(d)), el equipo del IEP debe considerar las preocupaciones de los padres para mejorar la educación de su hijo. Solicito que esta declaración se adjunte formalmente en su totalidad a los documentos de mi IEP para este ciclo escolar.

1. FORTALEZAS Y HABILIDADES DE ${childName.toUpperCase()}:
${strengths || 'No ingresado'}

2. PREOCUPACIONES DE LOS PADRES SOBRE EL DESARROLLO Y LA EDUCACIÓN:
${academicConcerns ? `- Académicas: ${academicConcerns}\n` : ''}${speechConcerns ? `- Comunicación y Lenguaje: ${speechConcerns}\n` : ''}${sensoryConcerns ? `- Sensoriales: ${sensoryConcerns}\n` : ''}${motorConcerns ? `- Motoras (Finas/Gruesas): ${motorConcerns}\n` : ''}${socialConcerns ? `- Socialización y Comportamiento: ${socialConcerns}\n` : ''}${!academicConcerns && !speechConcerns && !sensoryConcerns && !motorConcerns && !socialConcerns ? 'No se especificaron áreas de preocupación.\n' : ''}
3. SERVICIOS, ACOMODACIONES Y APOYOS SOLICITADOS:
${requestedServices || 'No ingresado'}

4. VISIÓN A LARGO PLAZO PARA ${childName.toUpperCase()}:
${parentVision || 'No ingresado'}

Solicito respetuosamente que el distrito documente por escrito su respuesta a cada una de estas solicitudes en las notas del IEP. Si el distrito decide denegar o rechazar alguna de las evaluaciones o adaptaciones propuestas aquí, solicito una Notificación Previa por Escrito (Prior Written Notice) formal detallando los motivos de dicha denegación.

Atentamente,

________________________________________
Firma del Padre/Tutor`;
    } else {
      return `PARENT STATEMENT OF CONCERNS FOR THE IEP RECORD

Date: ${todayStr}
Student: ${childName}
Parent/Guardian: ${parentName}

Dear IEP Team Members,

Pursuant to California Education Code Section 56341.1(a)(1) and the federal Individuals with Disabilities Education Act (IDEA) (20 U.S.C. § 1414(d)(3)(A)(i)), the IEP team is legally mandated to consider the concerns of the parents for enhancing the education of their child. I request that this statement of concerns be attached in its entirety to the official IEP document.

1. ${childName.toUpperCase()}'S STRENGTHS & INCLUSION INTERESTS:
${strengths || 'Not specified'}

2. SPECIFIC PARENTAL DEVELOPMENTAL & EDUCATIONAL CONCERNS:
${academicConcerns ? `- Academic & Learning: ${academicConcerns}\n` : ''}${speechConcerns ? `- Speech, Apraxia, & Communication: ${speechConcerns}\n` : ''}${sensoryConcerns ? `- Sensory Integration & Sensitivity: ${sensoryConcerns}\n` : ''}${motorConcerns ? `- Fine & Gross Motor Skills (OT/PT): ${motorConcerns}\n` : ''}${socialConcerns ? `- Social Interaction & Behavioral Regulation: ${socialConcerns}\n` : ''}${!academicConcerns && !speechConcerns && !sensoryConcerns && !motorConcerns && !socialConcerns ? 'No specific concerns categorized.\n' : ''}
3. REQUESTED PLACEMENT, SERVICES, & CLASSROOM ACCOMMODATIONS:
${requestedServices || 'Not specified'}

4. PARENT'S LONG-TERM INDEPENDENCE VISION FOR ${childName.toUpperCase()}:
${parentVision || 'Not specified'}

I request that the school team address each of these points during our IEP meeting, and document the team's responses in the IEP notes. If the school district declines to assess, accommodate, or fund any of these requested services, I request a formal Prior Written Notice (PWN) pursuant to 34 CFR § 300.503.

Sincerely,

________________________________________
Parent/Guardian Signature`;
    }
  };

  const handlePrint = () => {
    const text = compileStatementText();
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<pre style="font-family: sans-serif; font-size: 14px; padding: 40px; line-height: 1.6; max-width: 800px; white-space: pre-wrap; word-wrap: break-word;">${text}</pre>`);
      win.document.title = `${childName} IEP Parent Statement`;
      win.document.close();
      win.print();
    }
  };

  const t = {
    title: isSpanish ? 'Kit de Preparación para Reunión del IEP' : 'IEP Meeting Preparation Kit',
    subtitle: isSpanish 
      ? 'Prepárese para su reunión del IEP, ejerza sus derechos legales e incluya sus preocupaciones en el registro escolar.'
      : 'Prepare for your upcoming school meeting, exercise your legal rights, and anchor your caregiver concerns in the official record.',
    checklistTitle: isSpanish ? 'Lista de Verificación de la Reunión del IEP' : 'IEP Pre-Meeting Checklist',
    checklistSubtitle: isSpanish 
      ? 'Siga estos pasos críticos antes del día de la reunión:'
      : 'Complete these actions prior to sitting down with the school team:',
    chk1: isSpanish ? 'Solicitar copias de todos los informes de evaluación 5 días antes' : 'Request all clinical assessment drafts 5 days before the meeting',
    chk2: isSpanish ? 'Redactar su Declaración de Preocupaciones para el registro oficial' : 'Draft your Parent Concerns Statement to attach to the IEP document',
    chk3: isSpanish ? 'Enviar notificación de grabación (24 horas antes) si desea grabar' : 'Provide 24-hour written notice if you intend to audio record the IEP',
    chk4: isSpanish ? 'Pedirle a un amigo, terapeuta o defensor de IEP que le acompañe' : 'Secure a companion (advocate, therapist, or friend) to sit with you',
    chk5: isSpanish ? 'Revisar las metas del IEP anterior y recopilar muestras de trabajo' : 'Review previous IEP goals progress reports & gather school work samples',
    
    builderTitle: isSpanish ? 'Generador de Declaración de Preocupaciones' : 'Parent Statement of Concerns Generator',
    builderSubtitle: isSpanish 
      ? 'La ley exige que el distrito considere estas preocupaciones. Rellene el formulario para generar una declaración sólida.'
      : 'California law requires the IEP team to review parent concerns. Complete this form to draft a legally grounded statement.',
    
    lblParentName: isSpanish ? 'Nombre del Padre/Tutor' : 'Parent/Guardian Name',
    lblStrengths: isSpanish ? 'Fortalezas de su Hijo (Intereses, habilidades, qué funciona)' : 'Child\'s Strengths & Interests (What they excel at, motivators)',
    lblAcademic: isSpanish ? 'Preocupaciones Académicas (ej. lectura, atención)' : 'Academic Concerns (e.g., math, focus, literacy delays)',
    lblSpeech: isSpanish ? 'Preocupaciones de Comunicación (ej. articulación, AAC)' : 'Speech & Communication Concerns (e.g., non-verbal, apraxia)',
    lblSensory: isSpanish ? 'Preocupaciones Sensoriales (ej. ruidos, sobrecarga)' : 'Sensory & Sensitivity Concerns (e.g., sound triggers, meltdowns)',
    lblMotor: isSpanish ? 'Preocupaciones Motoras (ej. escritura, agarre, equilibrio)' : 'Fine & Gross Motor Concerns (e.g., handwriting, physical limits)',
    lblSocial: isSpanish ? 'Preocupaciones Sociales/Comportamiento (ej. amigos, enojos)' : 'Social & Behavioral Concerns (e.g., aggression, peer gaps)',
    lblServices: isSpanish ? 'Servicios/Acomodaciones Solicitados (ej. terapia del habla, ayuda 1:1)' : 'Requested Services & Accommodations (e.g., 1:1 aide, sensory breaks)',
    lblVision: isSpanish ? 'Visión a Largo Plazo (ej. independencia, lectura de grado)' : 'Long-term Independence Vision (e.g., independent living, reading target)',
    
    previewTitle: isSpanish ? 'Vista Previa del Documento' : 'Document Output Preview',
    copyBtn: isSpanish ? 'Copiar Declaración' : 'Copy Statement',
    printBtn: isSpanish ? 'Imprimir PDF' : 'Print Statement',
    statTip: isSpanish 
      ? 'De acuerdo con el Código de Educación de California § 56341.1, el equipo del IEP debe considerar las preocupaciones de los padres. El uso de esta plantilla garantiza que sus aportes queden integrados permanentemente.'
      : 'Statutory Safeguard: Under California Education Code § 56341.1, the IEP team MUST consider parent concerns. Attaching this document prevents school teams from omitting your input from the IEP notes.'
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
      
      {/* Left Column: Prep Form & Checklist */}
      <div style={{ gridColumn: '1 / 6', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="grid-col-lg-5">
        
        {/* Meeting Checklist */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.85)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            <CheckCircle2 size={18} color="var(--primary-color)" /> {t.checklistTitle}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '1rem', lineHeight: 1.4 }}>
            {t.checklistSubtitle}
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[t.chk1, t.chk2, t.chk3, t.chk4, t.chk5].map((item, idx) => (
              <label 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.5rem', 
                  fontSize: '0.8rem', 
                  cursor: 'pointer',
                  padding: '0.4rem 0.5rem',
                  borderRadius: '6px',
                  background: 'rgba(0,0,0,0.01)',
                  border: '1px solid var(--glass-border)',
                  lineHeight: 1.4
                }}
              >
                <input type="checkbox" style={{ marginTop: '2px', cursor: 'pointer', width: 'auto' }} />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Statement Form Fields */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            <FileText size={18} color="var(--primary-color)" /> {t.builderTitle}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
            {t.builderSubtitle}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>{t.lblParentName}</label>
              <input 
                type="text" 
                value={parentName} 
                onChange={(e) => { setParentName(e.target.value); persistPrepData({ parentName: e.target.value }); }} 
                style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem', width: '100%' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>{t.lblStrengths}</label>
              <textarea 
                value={strengths} 
                onChange={(e) => { setStrengths(e.target.value); persistPrepData({ strengths: e.target.value }); }} 
                style={{ width: '100%', minHeight: '50px', fontSize: '0.82rem', padding: '0.4rem', borderRadius: '6px' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>{t.lblAcademic}</label>
              <textarea 
                value={academicConcerns} 
                onChange={(e) => { setAcademicConcerns(e.target.value); persistPrepData({ academicConcerns: e.target.value }); }} 
                style={{ width: '100%', minHeight: '40px', fontSize: '0.82rem', padding: '0.4rem', borderRadius: '6px' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>{t.lblSpeech}</label>
              <textarea 
                value={speechConcerns} 
                onChange={(e) => { setSpeechConcerns(e.target.value); persistPrepData({ speechConcerns: e.target.value }); }} 
                style={{ width: '100%', minHeight: '40px', fontSize: '0.82rem', padding: '0.4rem', borderRadius: '6px' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>{t.lblSensory}</label>
              <textarea 
                value={sensoryConcerns} 
                onChange={(e) => { setSensoryConcerns(e.target.value); persistPrepData({ sensoryConcerns: e.target.value }); }} 
                style={{ width: '100%', minHeight: '40px', fontSize: '0.82rem', padding: '0.4rem', borderRadius: '6px' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>{t.lblMotor}</label>
              <textarea 
                value={motorConcerns} 
                onChange={(e) => { setMotorConcerns(e.target.value); persistPrepData({ motorConcerns: e.target.value }); }} 
                style={{ width: '100%', minHeight: '40px', fontSize: '0.82rem', padding: '0.4rem', borderRadius: '6px' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>{t.lblSocial}</label>
              <textarea 
                value={socialConcerns} 
                onChange={(e) => { setSocialConcerns(e.target.value); persistPrepData({ socialConcerns: e.target.value }); }} 
                style={{ width: '100%', minHeight: '40px', fontSize: '0.82rem', padding: '0.4rem', borderRadius: '6px' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>{t.lblServices}</label>
              <textarea 
                value={requestedServices} 
                onChange={(e) => { setRequestedServices(e.target.value); persistPrepData({ requestedServices: e.target.value }); }} 
                style={{ width: '100%', minHeight: '50px', fontSize: '0.82rem', padding: '0.4rem', borderRadius: '6px' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>{t.lblVision}</label>
              <textarea 
                value={parentVision} 
                onChange={(e) => { setParentVision(e.target.value); persistPrepData({ parentVision: e.target.value }); }} 
                style={{ width: '100%', minHeight: '50px', fontSize: '0.82rem', padding: '0.4rem', borderRadius: '6px' }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Interactive Document Preview */}
      <div style={{ gridColumn: '6 / 13', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="grid-col-lg-7">
        
        {/* Actions bar */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <BookOpen size={20} color="var(--primary-color)" />
              {t.previewTitle}
            </h3>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(compileStatementText());
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="btn-primary"
                style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', borderRadius: '8px' }}
              >
                {copied ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#10b981' }}><CheckCircle2 size={14} /> {isSpanish ? '¡Copiado!' : 'Copied!'}</span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><Copy size={14} /> {t.copyBtn}</span>
                )}
              </button>
              <button 
                onClick={handlePrint}
                className="btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', width: 'auto', cursor: 'pointer' }}
              >
                <Printer size={14} />
                <span>{t.printBtn}</span>
              </button>
            </div>
          </div>

          {/* Render Text */}
          <div 
            style={{ 
              background: 'rgba(0,0,0,0.02)', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              border: '1px solid rgba(0,0,0,0.05)', 
              fontSize: '0.85rem', 
              lineHeight: 1.5, 
              whiteSpace: 'pre-wrap', 
              fontFamily: 'monospace',
              maxHeight: '700px',
              overflowY: 'auto',
              color: 'var(--text-main)'
            }}
          >
            {compileStatementText()}
          </div>
        </div>

        {/* Legal safeguard tooltip */}
        <div style={{ padding: '1rem', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '12px', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <Scale size={16} color="var(--primary-color)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.4, margin: 0 }}>
            {t.statTip}
          </p>
        </div>

      </div>

    </div>
  );
}
