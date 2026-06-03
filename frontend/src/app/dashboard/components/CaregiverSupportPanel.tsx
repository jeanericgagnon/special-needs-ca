'use client';

import React, { useState, useEffect } from 'react';
import { useChildProfile } from './ChildProfileContext';
import { 
  Heart, Phone, HelpCircle, 
  Info, Landmark, Calendar 
} from 'lucide-react';

interface CaregiverSupportPanelProps {
  isSpanish?: boolean;
}

export default function CaregiverSupportPanel({ isSpanish = false }: CaregiverSupportPanelProps) {
  const { currentChild } = useChildProfile();
  
  // Self-Care Log State (weekly checkmarks for Mon-Sun)
  const [selfCareDays, setSelfCareDays] = useState<Record<string, boolean>>({
    Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false
  });

  // Stress Screener States
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  // Load self-care logs on mount/swap
  useEffect(() => {
    if (currentChild) {
      const savedLog = localStorage.getItem(`selfcare_log_${currentChild.id}`);
      let logData = { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false };
      if (savedLog) {
        try {
          logData = JSON.parse(savedLog);
        } catch {
          // ignore
        }
      }
      Promise.resolve().then(() => {
        setSelfCareDays(logData);
        setQ1(false);
        setQ2(false);
        setQ3(false);
        setQ4(false);
      });
    }
  }, [currentChild]);

  // Persist selfcare log
  const toggleSelfCareDay = (day: string) => {
    if (!currentChild) return;
    const updated = {
      ...selfCareDays,
      [day]: !selfCareDays[day]
    };
    setSelfCareDays(updated);
    localStorage.setItem(`selfcare_log_${currentChild.id}`, JSON.stringify(updated));
  };

  if (!currentChild) return null;

  // Calculate stress score (0 to 4)
  const stressScore = [q1, q2, q3, q4].filter(Boolean).length;

  const getStressResultText = () => {
    if (isSpanish) {
      if (stressScore === 0) return 'Estrés bajo. ¡Excelente! Siga cuidando de sí mismo.';
      if (stressScore <= 2) return 'Estrés moderado. Considere programar tiempo de descanso semanal y explorar el apoyo de pares.';
      return 'Estrés alto detectado. Le recomendamos contactar a su Coordinador de Servicios de Centro Regional para solicitar "Horas de Respiro por Crisis" (Crisis Respite) o llamar a una línea de apoyo para cuidadores.';
    } else {
      if (stressScore === 0) return 'Low stress level. Great job prioritizing balance!';
      if (stressScore <= 2) return 'Moderate stress level. Consider setting aside weekly self-care hours and connecting with local support groups.';
      return 'High caregiver burnout risk. We highly recommend asking your Regional Center Service Coordinator for "Crisis Respite" hours or contacting California support hotlines.';
    }
  };

  // Translations
  const t = {
    title: isSpanish ? 'Centro de Bienestar del Cuidador' : 'Caregiver Wellness & Support Hub',
    subtitle: isSpanish 
      ? 'El cuidado de un hijo con necesidades especiales puede generar agotamiento (burnout). Acceda a recursos de salud mental y registre su propio cuidado.'
      : 'Prioritize your mental health. Track daily self-care goals, assess caregiver burnout risks, and connect directly with California support systems.',
    
    directoriesTitle: isSpanish ? 'Directorios de Apoyo y Crisis' : 'Hotlines & Support Directories',
    hotline1: isSpanish ? 'Línea de Crisis y Apoyo (988)' : '988 Suicide & Crisis Lifeline',
    hotline1Desc: isSpanish ? 'Llamada o mensaje de texto gratuito las 24 horas para apoyo confidencial.' : 'Call or text 988. Free, confidential support available 24/7.',
    hotline2: isSpanish ? 'Línea de Apoyo CalHOPE (Warmline)' : 'CalHOPE Support Warmline',
    hotline2Desc: isSpanish ? 'Apoyo emocional no urgente y recursos de salud mental: (833) 317-4673.' : 'Peer-run warmline offering emotional support and resource routing: (833) 317-4673.',
    hotline3: isSpanish ? 'Línea para Padres de California' : 'California Parent Youth Helpline',
    hotline3Desc: isSpanish ? 'Asesoramiento gratuito para padres en tiempos de estrés: (855) 427-2736.' : 'Free, confidential support and counseling for parenting stress: (855) 427-2736.',

    respiteTitle: isSpanish ? 'Respiro por Crisis del Centro Regional' : 'Regional Center Crisis Respite',
    respiteDesc: isSpanish 
      ? 'Si enfrenta emergencias médicas o agotamiento extremo, tiene derecho a solicitar horas de Respiro por Crisis (Crisis Respite) a su Coordinador de Servicios de inmediato. No requiere una revisión anual del IPP.'
      : 'Under Lanterman Act guidelines, if you face medical emergencies or extreme caregiver exhaustion, you have the right to request immediate "Crisis Respite" hours from your Service Coordinator.',
    respiteCit: 'W&I Code § 4685',

    selfcareTitle: isSpanish ? 'Registro Semanal de Autocuidado' : 'Weekly Self-Care Activity Log',
    selfcareSubtitle: isSpanish 
      ? 'Marque los días en los que dedicó al menos 15 minutos exclusivamente para usted (caminar, leer, terapia, ver a un amigo):'
      : 'Check off days when you dedicated at least 15 minutes to yourself (e.g., exercise, quiet time, therapy, talking with friends):',
    mon: isSpanish ? 'Lun' : 'Mon',
    tue: isSpanish ? 'Mar' : 'Tue',
    wed: isSpanish ? 'Mié' : 'Wed',
    thu: isSpanish ? 'Jue' : 'Thu',
    fri: isSpanish ? 'Vie' : 'Fri',
    sat: isSpanish ? 'Sáb' : 'Sat',
    sun: isSpanish ? 'Dom' : 'Sun',
    completedDays: isSpanish ? 'Días completados esta semana:' : 'Self-care days completed this week:',

    screenerTitle: isSpanish ? 'Evaluación Rápida de Estrés del Cuidador' : 'Caregiver Stress Screener',
    screenerSubtitle: isSpanish 
      ? 'Identifique los síntomas de agotamiento completando este cuestionario rápido:'
      : 'Identify early signs of physical and emotional fatigue. Check all that apply:',
    q1Text: isSpanish ? '¿Se siente abrumado o agotado físicamente la mayor parte del tiempo?' : 'Feel overwhelmed or physically exhausted most days?',
    q2Text: isSpanish ? '¿Tiene problemas para dormir debido a la ansiedad sobre las necesidades de su hijo?' : 'Experience sleep disruption due to worry over your child\'s schedule?',
    q3Text: isSpanish ? '¿Siente que carece de tiempo libre o está aislado socialmente?' : 'Feel isolated from social networks or short on leisure time?',
    q4Text: isSpanish ? '¿Siente un estrés significativo al coordinar terapias, IEPs y citas?' : 'Suffer significant anxiety managing IEPs, IHSS paperwork, or medical audits?',
    scoreTitle: isSpanish ? 'Nivel de Estrés:' : 'Burnout Risk Score:',
    scoreEx: isSpanish ? 'de 4 respuestas afirmativas' : 'of 4 positive answers',
    fcaLink: isSpanish ? 'Visite Family Caregiver Alliance (CA)' : 'Explore Family Caregiver Alliance (CA)',
    statTip: isSpanish 
      ? 'Consejo de salud mental: Los cuidadores de niños con discapacidades tienen un riesgo 3 veces mayor de sufrir depresión. Priorizar el autocuidado no es un lujo, es una necesidad clínica.'
      : 'Mental Health Guideline: Parent caregivers of children with intellectual or developmental delays experience chronic caregiver burden comparable to combat veterans. Securing respite is an essential health intervention.'
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayLabels = [t.mon, t.tue, t.wed, t.thu, t.fri, t.sat, t.sun];

  return (
    <div className="animate-fade-in iep-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
      
      {/* Left: Support Directories & Hotlines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Hub Header & Directories */}
        <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.85)' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            <Heart size={22} color="var(--primary-color)" />
            {t.title}
          </h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.88rem', marginBottom: '2rem', lineHeight: 1.5 }}>
            {t.subtitle}
          </p>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
            <Phone size={18} color="var(--primary-color)" />
            {t.directoriesTitle}
          </h4>

          {/* Hotline List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { title: t.hotline1, desc: t.hotline1Desc, num: '988' },
              { title: t.hotline2, desc: t.hotline2Desc, num: '(833) 317-4673' },
              { title: t.hotline3, desc: t.hotline3Desc, num: '(855) 427-2736' }
            ].map((hotline, idx) => (
              <div 
                key={idx} 
                style={{ 
                  padding: '1rem', 
                  background: 'rgba(255,255,255,0.5)', 
                  border: '1px solid var(--glass-border)', 
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>{hotline.title}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', marginTop: '0.2rem', lineHeight: 1.3 }}>{hotline.desc}</span>
                </div>
                <a 
                  href={`tel:${hotline.num.replace(/[^0-9]/g, '')}`}
                  className="btn-primary" 
                  style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem', whiteSpace: 'nowrap', borderRadius: '6px' }}
                >
                  {isSpanish ? 'Llamar' : 'Call'} {hotline.num}
                </a>
              </div>
            ))}
          </div>

          {/* Crisis Respite Guidance */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
              <Landmark size={18} color="var(--primary-color)" />
              {t.respiteTitle}
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', lineHeight: 1.5, margin: 0 }}>
              {t.respiteDesc}
            </p>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', fontSize: '0.72rem', color: 'var(--primary-color)', fontWeight: 600, marginTop: '0.5rem' }}>
              <Landmark size={12} />
              <span>California Welfare & Institutions Code § 4685</span>
            </div>
          </div>

        </div>

      </div>

      {/* Right: Self Care Log & Stress Screener */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Weekly Self Care Log */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.85)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            <Calendar size={18} color="var(--primary-color)" />
            {t.selfcareTitle}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '1.25rem' }}>
            {t.selfcareSubtitle}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.25rem', marginBottom: '1.25rem' }}>
            {daysOfWeek.map((day, idx) => {
              const isChecked = selfCareDays[day] === true;
              return (
                <div 
                  key={day}
                  onClick={() => toggleSelfCareDay(day)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isChecked ? 'var(--primary-color)' : 'var(--glass-border)',
                    background: isChecked ? 'rgba(var(--primary-rgb), 0.08)' : 'rgba(255,255,255,0.4)',
                    color: isChecked ? 'var(--primary-color)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>{dayLabels[idx]}</div>
                  <div style={{ fontSize: '1.1rem' }}>{isChecked ? '🟢' : '⚪'}</div>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{t.completedDays}</span>
            <strong style={{ color: 'var(--primary-color)', fontSize: '0.95rem' }}>
              {Object.values(selfCareDays).filter(Boolean).length} / 7
            </strong>
          </div>
        </div>

        {/* Burnout Screener */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.85)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            <HelpCircle size={18} color="var(--primary-color)" />
            {t.screenerTitle}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '1rem' }}>
            {t.screenerSubtitle}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', alignItems: 'flex-start' }}>
              <input type="checkbox" checked={q1} onChange={(e) => setQ1(e.target.checked)} style={{ marginTop: '2px', width: 'auto' }} />
              <span>{t.q1Text}</span>
            </label>
            <label style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', alignItems: 'flex-start' }}>
              <input type="checkbox" checked={q2} onChange={(e) => setQ2(e.target.checked)} style={{ marginTop: '2px', width: 'auto' }} />
              <span>{t.q2Text}</span>
            </label>
            <label style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', alignItems: 'flex-start' }}>
              <input type="checkbox" checked={q3} onChange={(e) => setQ3(e.target.checked)} style={{ marginTop: '2px', width: 'auto' }} />
              <span>{t.q3Text}</span>
            </label>
            <label style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', alignItems: 'flex-start' }}>
              <input type="checkbox" checked={q4} onChange={(e) => setQ4(e.target.checked)} style={{ marginTop: '2px', width: 'auto' }} />
              <span>{t.q4Text}</span>
            </label>
          </div>

          <div style={{ background: 'rgba(var(--primary-rgb), 0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(var(--primary-rgb), 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
              <span>{t.scoreTitle}</span>
              <strong>{stressScore} {t.scoreEx}</strong>
            </div>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.4, margin: 0 }}>
              {getStressResultText()}
            </p>

            {stressScore >= 3 && (
              <a 
                href="https://www.caregiver.org/" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, marginTop: '0.6rem', textDecoration: 'underline' }}
              >
                {t.fcaLink} →
              </a>
            )}
          </div>
        </div>

        {/* Info panel */}
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
