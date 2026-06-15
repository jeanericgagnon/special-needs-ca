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
  ageBand: '14-16' | '17' | '18' | '21' | '22';
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
  citation?: string;
}

export default function AdulthoodTransitionPanel({ isSpanish = false }: AdulthoodTransitionPanelProps) {
  const { currentChild, stateConfig } = useChildProfile();
  
  const isTx = stateConfig?.code === 'TX';
  const isFl = stateConfig?.code === 'FL';
  const isCa = stateConfig?.code === 'CA';
  const exitAge = isTx ? '21' : '22';

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [selectedAgeBand, setSelectedAgeBand] = useState<'14-16' | '17' | '18' | '21' | '22'>('18');
  const [childAge, setChildAge] = useState<number>(0);

  const transitionTasks = React.useMemo<TransitionTask[]>(() => {
    if (!stateConfig) return [];
    
    return [
      // Ages 14-16
      {
        id: 'itp-init',
        ageBand: '14-16',
        titleEn: 'Formulate Individual Transition Plan (ITP)',
        titleEs: 'Formular el Plan de Transición Individual (ITP)',
        descEn: `Under ${isCa ? 'California Ed Code' : isTx ? 'Texas Education Code' : isFl ? 'Florida Statutes' : 'Federal IDEA'}, the school district must include transition goals in the IEP starting at age ${isTx || isFl ? '14' : '16'} (or earlier if appropriate). Request vocational and interest assessments.`,
        descEs: `Bajo ${isCa ? 'el Código de Educación de California' : isTx ? 'el Código de Educación de Texas' : isFl ? 'los Estatutos de Florida' : 'la ley federal IDEA'}, el distrito escolar debe incluir metas de transición en el IEP a partir de los ${isTx || isFl ? '14' : '16'} años (o antes si es apropiado). Solicite evaluaciones vocacionales.`,
        citation: isCa ? 'California Education Code § 56345.1' : isTx ? 'Texas Education Code § 29.011' : isFl ? 'Florida Statutes § 1003.571' : '20 U.S.C. § 1414(d)(1)(A)(i)(VIII)'
      },
      {
        id: 'job-training',
        ageBand: '14-16',
        titleEn: `Explore ${isCa ? 'Department of Rehabilitation (DOR)' : isTx ? 'Texas Workforce Commission (TWC)' : isFl ? 'Vocational Rehabilitation (VR)' : 'Vocational Rehabilitation'} Services`,
        titleEs: `Explorar Servicios de ${isCa ? 'DOR (Departamento de Rehabilitación)' : isTx ? 'TWC (Comisión de la Fuerza Laboral de Texas)' : isFl ? 'Rehabilitación Vocacional (VR)' : 'la Agencia Estatal de Rehabilitación Vocacional'}`,
        descEn: `${isCa ? 'DOR' : isTx ? 'TWC' : isFl ? 'VR' : 'The state agency'} provides Student Services (Pre-ETS) including job exploration, workplace readiness training, and work-based learning experiences for students aged 14/16-21.`,
        descEs: `${isCa ? 'DOR' : isTx ? 'TWC' : isFl ? 'VR' : 'La agencia estatal'} ofrece Servicios Estudiantiles (Pre-ETS) que incluyen exploración de empleo, capacitación para el trabajo y experiencias de aprendizaje laboral para estudiantes de 14/16 a 21 años.`
      },
      // Age 17
      {
        id: 'grad-path',
        ageBand: '17',
        titleEn: 'Confirm High School Graduation Pathway',
        titleEs: 'Confirmar Ruta de Graduación de Secundaria',
        descEn: `Determine if the child is on path for a regular high school diploma or a Certificate of Completion. Note: A Certificate keeps the child eligible for school services until age ${exitAge}.`,
        descEs: `Determine si el niño está en camino a un diploma regular o un Certificado de Finalización. Un Certificado mantiene al estudiante elegible para servicios escolares hasta los ${exitAge} años.`,
      },
      {
        id: 'decision-making',
        ageBand: '17',
        titleEn: 'Establish Supported Decision-Making (SDM) / Legal Plan',
        titleEs: 'Establecer Toma de Decisiones con Apoyo (SDM) / Plan Legal',
        descEn: `At age 18, parental rights transfer to the student. Draft a Supported Decision-Making agreement (${isCa ? 'California AB 1663' : isTx ? 'Texas Estates Code § 1357' : isFl ? 'Florida Guardian Advocacy' : 'applicable state guidelines'}) or research guardianship alternatives.`,
        descEs: `A los 18 años, los derechos de los padres se transfieren al estudiante. Redacte un acuerdo de Toma de Decisiones con Apoyo (${isCa ? 'AB 1663 de California' : isTx ? 'Código de Sucesiones de Texas § 1357' : isFl ? 'Defensa del Tutor de Florida' : 'pautas aplicables'}) o investigue alternativas.`,
        citation: isCa ? 'California Probate Code § 21000' : isTx ? 'Texas Estates Code § 1357.001' : isFl ? 'Florida Statutes § 744.3085' : 'Federal Rights Transfer Under IDEA'
      },
      // Age 18
      {
        id: 'ssi-adult',
        ageBand: '18',
        titleEn: 'Apply for Supplemental Security Income (SSI) as an Adult',
        titleEs: 'Solicitar Seguridad de Ingreso Suplementario (SSI) como Adulto',
        descEn: "Apply on the child's 18th birthday. Parental income deeming ceases; only the young adult's own income and assets (limit $2,000) are evaluated.",
        descEs: 'Solicite el día en que cumpla 18 años. Deja de considerarse el ingreso de los padres; solo se evalúan los ingresos y activos del propio joven (límite de $2,000).',
        citation: 'Social Security Act § 1614(a)(3)'
      },
      {
        id: 'medical-redetermination',
        ageBand: '18',
        titleEn: `Redetermine ${stateConfig.medicaidName} Coverage`,
        titleEs: `Redeterminar Cobertura de ${stateConfig.medicaidName}`,
        descEn: `Ensure ${stateConfig.medicaidName} enrollment is moved to an adult category (or tied to SSI). This is critical if the child is on a waiver or institutional deeming program.`,
        descEs: `Asegúrese de que el registro de ${stateConfig.medicaidName} se mueva a una categoría de adulto (o vinculado a SSI). Esto es crítico si el niño está en un programa de exención o deeming institucional.`,
      },
      {
        id: 'vote-selective',
        ageBand: '18',
        titleEn: 'Register to Vote & Selective Service',
        titleEs: 'Registrarse para Votar y Servicio Selectivo',
        descEn: 'Males must register for Selective Service to maintain SSI eligibility. Registering to vote supports civic integration.',
        descEs: 'Los varones deben registrarse en el Servicio Selectivo para mantener la elegibilidad de SSI. Registrarse para votar apoya la integración cívica.',
      },
      // Age 21/22
      {
        id: 'iep-termination',
        ageBand: exitAge,
        titleEn: 'Transition out of School-Based Special Education',
        titleEs: 'Transición Fuera de la Educación Especial Escolar',
        descEn: `The day before the student's ${exitAge} birthday (or end of school term), school-based IEP therapies and placement terminate under IDEA. Ensure transition plan is finalized.`,
        descEs: `El día antes de cumplir ${exitAge} años (o fin de término), las terapias del IEP escolar y colocación terminan bajo IDEA. Asegure que el plan de transición esté finalizado.`,
        citation: isCa ? 'California Education Code § 56026' : isTx ? '19 TAC § 89.1070' : isFl ? 'Rule 6A-6.03028 FAC' : '20 U.S.C. § 1412(a)(1)'
      },
      {
        id: 'rc-adult-day',
        ageBand: exitAge,
        titleEn: `Activate ${stateConfig.catchmentName} Adult Services`,
        titleEs: `Activar Servicios de Adultos del ${stateConfig.catchmentName}`,
        descEn: `Coordinate with the coordinator to fund adult day programs, supported living services, or supported employment through ${stateConfig.catchmentName} or ${stateConfig.ddAgency}.`,
        descEs: `Coordine con el coordinador para financiar programas de día para adultos, servicios de vida independiente o empleo apoyado a través de ${stateConfig.catchmentName} o ${stateConfig.ddAgency}.`,
      },
      {
        id: 'calable-asset',
        ageBand: exitAge,
        titleEn: `Verify ${stateConfig.ableProgram} Protection for SSI Limits`,
        titleEs: `Verificar Protección de ${stateConfig.ableProgram} para Límites de SSI`,
        descEn: `Adults with disabilities receiving SSI and wages must protect earnings from the $2,000 SSI cap using a ${stateConfig.ableProgram} account (allows holding up to $100,000 without affecting SSI).`,
        descEs: `Los adultos con discapacidades que reciben SSI y salarios deben proteger sus ganancias del límite de SSI de $2,000 usando una cuenta ${stateConfig.ableProgram} (permite hasta $100,000 sin afectar el SSI).`,
      }
    ];
  }, [stateConfig, isCa, isTx, isFl, exitAge]);
  
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
        let recommendedBand: '14-16' | '17' | '18' | '21' | '22' | null = null;
        if (dobStr) {
          const dob = new Date(dobStr);
          calculatedAge = Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
          if (calculatedAge >= 14 && calculatedAge <= 16) recommendedBand = '14-16';
          else if (calculatedAge === 17) recommendedBand = '17';
          else if (calculatedAge >= 18 && calculatedAge <= 20) recommendedBand = '18';
          else if (calculatedAge === 21) recommendedBand = isTx ? '21' : '18';
          else if (calculatedAge >= 22) recommendedBand = isTx ? '21' : '22';
        }
  
        setCompletedTaskIds(loadedTasks);
        setChildAge(calculatedAge);
        if (recommendedBand) {
          setSelectedAgeBand(recommendedBand);
        } else {
          setSelectedAgeBand('18');
        }
      });
    }
  }, [currentChild, isTx]);
  
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

  if (!currentChild || !stateConfig) return null;

  // Translations
  const t = {
    title: isSpanish ? 'Línea de Tiempo de Transición a la Adultez' : 'Adulthood Transition Cliff Timeline',
    subtitle: isSpanish 
      ? `Bajo la ley de ${stateConfig.name}, los servicios escolares terminan a los ${exitAge} años. Planifique con anticipación para evitar la interrupción de los apoyos.`
      : `Under IDEA and ${stateConfig.name} law, school-based services end at age ${exitAge}. Coordinate checklists at key milestones to prevent support gaps.`,
    milestone: isSpanish ? 'Hitos de Transición' : 'Transition Milestones',
    ageGroup1: isSpanish ? 'Edades 14–16 (Planificación)' : 'Ages 14–16 (ITP Planning)',
    ageGroup2: isSpanish ? 'Edad 17 (Graduación y SDM)' : 'Age 17 (Graduation & SDM)',
    ageGroup3: isSpanish ? 'Edad 18 (Abismo de Adulto)' : 'Age 18 (SSI & Adult Status)',
    ageGroup4: isSpanish ? `Edad ${exitAge} (Fin del IEP - IDEA)` : `Age ${exitAge} (IDEA Exit & Adult ${stateConfig.catchmentName})`,
    statusCompleted: isSpanish ? 'Completado' : 'Completed',
    statusPending: isSpanish ? 'Pendiente' : 'Pending',
    currentAge: isSpanish ? 'Edad de su hijo:' : 'Your child\'s current age:',
    yearsOld: isSpanish ? 'años' : 'years old',
    syncAgenda: isSpanish ? 'Programar Alerta' : 'Set Alarm',
    statTip: isSpanish 
      ? `De acuerdo con las pautas de ${stateConfig.name}, la elegibilidad para recibir educación especial termina a los ${exitAge} años. Los preparativos para los servicios de adultos de ${stateConfig.catchmentName} deben iniciarse al menos 2 años antes.`
      : `Statutory Tip: ${stateConfig.name} guidelines mandate school services terminate at age ${exitAge}. Adult ${stateConfig.catchmentName} programs, Independent Living Services, and supported employment plans must be negotiated before this exit date.`,
    warningTitle: isSpanish ? '⚠️ Alerta de Hito Importante' : '⚠️ Critical Milestone Alert',
    warningText: isSpanish 
      ? '¡Su hijo tiene 17 años o más! Es imperativo solicitar SSI de inmediato en su cumpleaños número 18 para evitar evaluaciones de ingresos familiares.'
      : 'Your child is 17 or older. It is critical to prepare the SSI application to file immediately on their 18th birthday to bypass parental income rules.'
  };

  const filteredTasks = transitionTasks.filter(task => task.ageBand === selectedAgeBand);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
      
      {/* Sidebar navigation */}
      <div style={{ gridColumn: '1 / 5', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="grid-col-lg-4">
        
        {/* Child Age Banner */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.08)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>{t.currentAge}</span>
          <strong style={{ fontSize: '1.6rem', color: 'var(--primary-color)' }}>{childAge} {t.yearsOld}</strong>
          
          {childAge >= 17 && childAge <= parseInt(exitAge) && (
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
              { id: exitAge as '21' | '22', label: t.ageGroup4 }
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
