'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { LetterTemplateType } from './ChildProfileContext';

interface AppealsSelectorProps {
  activeTemplate: LetterTemplateType;
  setActiveTemplate: (tpl: LetterTemplateType) => void;
  isSpanish: boolean;
  t: {
    selectTemplate: string;
  };
}

export default function AppealsSelector({ activeTemplate, setActiveTemplate, isSpanish, t }: AppealsSelectorProps) {
  const templatesList = [
    { id: 'iep-request', label: isSpanish ? 'Solicitud de Evaluación IEP' : 'IEP Evaluation Request', badge: 'Ed Code' },
    { id: 'ihss-appeal', label: isSpanish ? 'Apelación de Denegación IHSS' : 'IHSS Denial Appeal', badge: 'W&I Code' },
    { id: 'rc-appeal', label: isSpanish ? 'Denegación del Centro Regional' : 'Regional Center Denial', badge: 'Lanterman' },
    { id: 'ssi-reconsideration', label: isSpanish ? 'Reconsideración de SSI' : 'SSI Reconsideration', badge: 'SSA' },
    { id: 'epsdt-therapy', label: isSpanish ? 'Autorización de Terapia' : 'Therapy Authorization', badge: 'EPSDT' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <FileText size={16} color="var(--primary-color)" /> {t.selectTemplate}
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {templatesList.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => setActiveTemplate(tpl.id as LetterTemplateType)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1px solid var(--glass-border)',
              background: activeTemplate === tpl.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.6)',
              color: activeTemplate === tpl.id ? 'white' : 'var(--text-main)',
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'all 0.2s',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <span>{tpl.label}</span>
            <span style={{ 
              fontSize: '0.7rem', 
              padding: '0.1rem 0.4rem', 
              borderRadius: '4px', 
              background: activeTemplate === tpl.id ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.04)', 
              color: activeTemplate === tpl.id ? 'white' : 'var(--text-light)' 
            }}>
              {tpl.badge}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
