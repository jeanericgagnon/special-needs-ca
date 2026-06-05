'use client';

import React, { useState, useEffect } from 'react';
import { useChildProfile } from './ChildProfileContext';
import { 
  Clock, Calendar, ChevronRight, Info, Scale 
} from 'lucide-react';
import { addReminderAction, toggleTransitionTaskAction, getChildTransitionTasksAction } from '../child-actions';

interface AdulthoodTransitionPanelProps {
  isSpanish?: boolean;
}

interface TransitionTask {
  id: string;
  ageBand: '14-16' | '17' | '18' | '22';
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
  citation?: string;
}

const TRANSITION_TASKS: TransitionTask[] = [
  // Ages 14-16
  {
    id: 'itp-init',
    ageBand: '14-16',
    titleEn: 'Formulate Individual Transition Plan (ITP)',
    titleEs: 'Formular el Plan de Transición Individual (ITP)',
    descEn: 'Under California Ed Code, the school district must include transition goals in the IEP starting at age 16 (or 14 if appropriate). Request vocational and interest assessments.',
    descEs: 'Bajo el Código de Educación de California, el distrito escolar debe incluir metas de transición en el IEP a partir de los 16 años (o 14 si es apropiado). Solicite evaluaciones vocacionales.',
    citation: 'California Education Code § 56345.1'
  },
  {
    id: 'job-training',
    ageBand: '14-16',
    titleEn: 'Explore Department of Rehabilitation (DOR) Services',
    titleEs: 'Explorar Servicios del Departamento de Rehabilitación (DOR)',
    descEn: 'DOR provides Student Services (Pre-ETS) including job exploration, workplace readiness training, and work-based learning experiences for students aged 16-21.',
    descEs: 'DOR ofrece Servicios Estudiantiles (Pre-ETS) que incluyen exploración de empleo, capacitación para el trabajo y experiencias de aprendizaje laboral para estudiantes de 16 a 21 años.',
  },
  // Age 17
  {
    id: 'grad-path',
    ageBand: '17',
    titleEn: 'Confirm High School Graduation Pathway',
    titleEs: 'Confirmar Ruta de Graduación de Secundaria',
    descEn: 'Determine if the child is on path for a regular high school diploma or a Certificate of Completion. Note: A Certificate keeps the child eligible for school services until age 22.',
    descEs: 'Determine si el niño está en camino a un diploma regular o un Certificado de Finalización. Un Certificado mantiene al estudiante elegible para servicios escolares hasta los 22 años.',
  },
  {
    id: 'decision-making',
    ageBand: '17',
    titleEn: 'Establish Supported Decision-Making (SDM) / Legal Plan',
    titleEs: 'Establecer Toma de Decisiones con Apoyo (SDM) / Plan Legal',
    descEn: 'At age 18, parental educational rights transfer to the student. Draft a Supported Decision-Making agreement (California AB 1663) or research conservatorship alternatives.',
    descEs: 'A los 18 años, los derechos educativos de los padres se transfieren al estudiante. Redacte un acuerdo de Toma de Decisiones con Apoyo (AB 1663) o investigue alternativas de tutela.',
    citation: 'California Probate Code § 21000'
  },
  // Age 18
  {
    id: 'ssi-adult',
    ageBand: '18',
    titleEn: 'Apply for Supplemental Security Income (SSI) as an Adult',
    titleEs: 'Solicitar Seguridad de Ingreso Suplementario (SSI) como Adulto',
    descEn: 'Apply on the child\'s 18th birthday. Parental income deeming ceases; only the young adult\'s own income and assets (limit $2,000) are evaluated.',
    descEs: 'Solicite el día en que cumpla 18 años. Deja de considerarse el ingreso de los padres; solo se evalúan los ingresos y activos del propio joven (límite de $2,000).',
    citation: 'Social Security Act § 1614(a)(3)'
  },
  {
    id: 'medical-redetermination',
    ageBand: '18',
    titleEn: 'Redetermine Medi-Cal Coverage',
    titleEs: 'Redeterminar Cobertura de Medi-Cal',
    descEn: 'Ensure Medi-Cal enrollment is moved to an adult category (or tied to SSI). This is critical if the child is on the Lanterman Institutional Deeming waiver.',
    descEs: 'Asegúrese de que el registro de Medi-Cal se mueva a una categoría de adulto (o vinculado a SSI). Crítico si el niño está en la exención de Deeming del Centro Regional.',
  },
  {
    id: 'vote-selective',
    ageBand: '18',
    titleEn: 'Register to Vote & Selective Service',
    titleEs: 'Registrarse para Votar y Servicio Selectivo',
    descEn: 'Males must register for Selective Service to maintain SSI eligibility. Registering to vote supports civic integration.',
    descEs: 'Los varones deben registrarse en el Servicio Selectivo para mantener la elegibilidad de SSI. Registrarse para votar apoya la integración cívica.',
  },
  // Age 22
  {
    id: 'iep-termination',
    ageBand: '22',
    titleEn: 'Transition out of School-Based Special Education',
    titleEs: 'Transición Fuera de la Educación Especial Escolar',
    descEn: 'The day before the student\'s 22nd birthday (or end of school term), school-based IEP therapies and placement terminate under IDEA. Ensure transition plan is finalized.',
    descEs: 'El día antes de cumplir 22 años (o fin de término), las terapias del IEP escolar y colocación terminan bajo IDEA. Asegure que el plan de transición esté finalizado.',
    citation: 'California Education Code § 56026'
  },
  {
    id: 'rc-adult-day',
    ageBand: '22',
    titleEn: 'Activate Regional Center Adult Services',
    titleEs: 'Activar Servicios de Adultos del Centro Regional',
    descEn: 'Coordinate with the Service Coordinator to fund adult day programs, Independent Living Services (ILS), Supported Living Services (SLS), or Supported Employment (SC 950).',
    descEs: 'Coordine con el Coordinador de Servicios para financiar programas de día para adultos, Servicios de Vida Independiente (ILS) o Empleo con Apoyo (SC 950).',
  },
  {
    id: 'calable-asset',
    ageBand: '22',
    titleEn: 'Verify CalABLE Protection for SSI Limits',
    titleEs: 'Verificar Protección de CalABLE para Límites de SSI',
    descEn: 'Adults with disabilities receiving SSI and wages must protect earnings from the $2,000 SSI cap using a CalABLE account (allows holding up to $100,000 for SSI).',
    descEs: 'Los adultos con discapacidades que reciben SSI y salarios deben proteger sus ganancias del límite de SSI de $2,000 usando una cuenta CalABLE (permite hasta $100,000).',
  }
];

export default function AdulthoodTransitionPanel({ isSpanish = false }: AdulthoodTransitionPanelProps) {
  const { currentChild } = useChildProfile();
  
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [selectedAgeBand, setSelectedAgeBand] = useState<'14-16' | '17' | '18' | '22'>('18');
  const [childAge, setChildAge] = useState<number>(0);
 
  // Load completed tasks on mount/swap
  useEffect(() => {
    if (currentChild) {
      getChildTransitionTasksAction(currentChild.id).then(res => {
        let loadedTasks: string[] = [];
        if (res.success && res.tasks) {
          loadedTasks = res.tasks;
        }
 
        // Auto-set recommended tab based on child age if possible
        const dobStr = currentChild.dob;
        let calculatedAge = 0;
        let recommendedBand: '14-16' | '17' | '18' | '22' | null = null;
        if (dobStr) {
          const dob = new Date(dobStr);
          calculatedAge = Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
          if (calculatedAge >= 14 && calculatedAge <= 16) recommendedBand = '14-16';
          else if (calculatedAge === 17) recommendedBand = '17';
          else if (calculatedAge === 18 || calculatedAge === 19 || calculatedAge === 20 || calculatedAge === 21) recommendedBand = '18';
          else if (calculatedAge >= 22) recommendedBand = '22';
        }
 
        setCompletedTaskIds(loadedTasks);
        setChildAge(calculatedAge);
        if (recommendedBand) {
          setSelectedAgeBand(recommendedBand);
        }
      });
    }
  }, [currentChild]);
 
  // Persist completed tasks
  const toggleTaskCompleted = (id: string) => {
    if (!currentChild) return;
    const isCompleted = completedTaskIds.includes(id);
    const updated = isCompleted 
      ? completedTaskIds.filter(x => x !== id)
      : [...completedTaskIds, id];
    
    setCompletedTaskIds(updated);
    toggleTransitionTaskAction(currentChild.id, id, !isCompleted);
  };

  const handleSyncAlarm = async (task: TransitionTask) => {
    if (!currentChild) return;
    const title = isSpanish 
      ? `ALERTA TRANSICIÓN: ${task.titleEs}` 
      : `TRANSITION ALARM: ${task.titleEn}`;
    
    const today = new Date();
    today.setDate(today.getDate() + 30); // Set default reminder for 30 days out
    const dateStr = today.toISOString().split('T')[0];

    try {
      await addReminderAction(currentChild.id, title, dateStr, task.id);
      alert(isSpanish 
        ? 'Alarma de transición agregada a su Agenda de Alertas (programada para dentro de 30 días).'
        : 'Transition milestone alarm successfully synced to your Alert Agenda (set to trigger in 30 days).'
      );
    } catch (e) {
      console.error(e);
      alert('Failed to sync transition reminder.');
    }
  };

  if (!currentChild) return null;

  // Translations
  const t = {
    title: isSpanish ? 'Línea de Tiempo de Transición a la Adultez' : 'Adulthood Transition Cliff Timeline',
    subtitle: isSpanish 
      ? 'Bajo la ley de California, los servicios escolares terminan a los 22 años. Planifique con anticipación para evitar la interrupción de los apoyos.'
      : 'Under IDEA and California law, school-based services end at age 22. Coordinate checklists at key milestones to prevent support gaps.',
    milestone: isSpanish ? 'Hitos de Transición' : 'Transition Milestones',
    ageGroup1: isSpanish ? 'Edades 14–16 (Planificación)' : 'Ages 14–16 (ITP Planning)',
    ageGroup2: isSpanish ? 'Edad 17 (Graduación y SDM)' : 'Age 17 (Graduation & SDM)',
    ageGroup3: isSpanish ? 'Edad 18 (Abismo de Adulto)' : 'Age 18 (SSI & Adult Status)',
    ageGroup4: isSpanish ? 'Edad 22 (Fin del IEP - IDEA)' : 'Age 22 (IDEA Exit & Adult RC)',
    statusCompleted: isSpanish ? 'Completado' : 'Completed',
    statusPending: isSpanish ? 'Pendiente' : 'Pending',
    currentAge: isSpanish ? 'Edad de su hijo:' : 'Your child\'s current age:',
    yearsOld: isSpanish ? 'años' : 'years old',
    syncAgenda: isSpanish ? 'Programar Alerta' : 'Set Alarm',
    statTip: isSpanish 
      ? 'De acuerdo con el Código de Educación de California § 56026, la elegibilidad para recibir educación especial termina el día anterior al cumpleaños número 22. Los preparativos deben iniciarse al menos 2 años antes.'
      : 'Statutory Tip: California Ed Code § 56026 mandates school services terminate at age 22. Adult Regional Center day programs, Independent Living Services, and supported employment plans must be negotiated in the IPP before this exit date.',
    warningTitle: isSpanish ? '⚠️ Alerta de Hito Importante' : '⚠️ Critical Milestone Alert',
    warningText: isSpanish 
      ? '¡Su hijo tiene 17 años o más! Es imperativo solicitar SSI de inmediato en su cumpleaños número 18 para evitar evaluaciones de ingresos familiares.'
      : 'Your child is 17 or older. It is critical to prepare the SSI application to file immediately on their 18th birthday to bypass parental income rules.'
  };

  const filteredTasks = TRANSITION_TASKS.filter(task => task.ageBand === selectedAgeBand);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
      
      {/* Sidebar navigation */}
      <div style={{ gridColumn: '1 / 5', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="grid-col-lg-4">
        
        {/* Child Age Banner */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.08)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>{t.currentAge}</span>
          <strong style={{ fontSize: '1.6rem', color: 'var(--primary-color)' }}>{childAge} {t.yearsOld}</strong>
          
          {childAge >= 17 && childAge <= 22 && (
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '8px' }}>
              <strong style={{ fontSize: '0.75rem', color: '#b45309', display: 'block', marginBottom: '0.2rem' }}>{t.warningTitle}</strong>
              <span style={{ fontSize: '0.7rem', color: '#b45309', lineHeight: 1.3, display: 'block' }}>{t.warningText}</span>
            </div>
          )}
        </div>

        {/* Milestone Buttons */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
            <Clock size={16} color="var(--primary-color)" /> {t.milestone}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { id: '14-16' as const, label: t.ageGroup1 },
              { id: '17' as const, label: t.ageGroup2 },
              { id: '18' as const, label: t.ageGroup3 },
              { id: '22' as const, label: t.ageGroup4 }
            ].map((band) => (
              <button
                key={band.id}
                onClick={() => setSelectedAgeBand(band.id)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--glass-border)',
                  background: selectedAgeBand === band.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.6)',
                  color: selectedAgeBand === band.id ? 'white' : 'var(--text-main)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <span>{band.label}</span>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Task List */}
      <div style={{ gridColumn: '5 / 13', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="grid-col-lg-8">
        
        {/* Header */}
        <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.85)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{t.title}</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.88rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
            {t.subtitle}
          </p>

          {/* Tasks Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2rem' }}>
            {filteredTasks.map(task => {
              const isCompleted = completedTaskIds.includes(task.id);
              return (
                <div 
                  key={task.id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'var(--glass-border)',
                    background: isCompleted ? 'rgba(16, 185, 129, 0.02)' : 'rgba(255,255,255,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer', flex: 1, alignItems: 'flex-start' }}>
                      <input 
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => toggleTaskCompleted(task.id)}
                        style={{ marginTop: '3px', cursor: 'pointer', width: 'auto' }}
                      />
                      <div>
                        <strong style={{ fontSize: '1rem', textDecoration: isCompleted ? 'line-through' : 'none', color: 'var(--text-main)' }}>
                          {isSpanish ? task.titleEs : task.titleEn}
                        </strong>
                        <span style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                          {isSpanish ? task.descEs : task.descEn}
                        </span>
                      </div>
                    </label>

                    <button
                      onClick={() => handleSyncAlarm(task)}
                      className="btn-secondary"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.2rem', width: 'auto', flexShrink: 0, cursor: 'pointer' }}
                    >
                      <Calendar size={12} />
                      <span>{t.syncAgenda}</span>
                    </button>
                  </div>

                  {task.citation && (
                    <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', fontSize: '0.72rem', color: 'var(--primary-color)', fontWeight: 600, paddingLeft: '2rem' }}>
                      <Scale size={12} />
                      <span>{task.citation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legal safeguard tooltip */}
        <div style={{ padding: '1rem', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '12px', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <Info size={16} color="var(--primary-color)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.4, margin: 0 }}>
            {t.statTip}
          </p>
        </div>

      </div>

    </div>
  );
}
