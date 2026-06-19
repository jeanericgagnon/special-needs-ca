import React from 'react';
import { ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';

interface EditorialDisclosureProps {
  agencyName?: string;
  policyCitation?: string;
  lastReviewedDate?: string;
  nextSteps?: string[];
}

export default function EditorialDisclosure({
  agencyName = 'State Developmental Services',
  policyCitation,
  lastReviewedDate = 'June 2026',
  nextSteps,
}: EditorialDisclosureProps) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.4)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: '16px',
        padding: '1.25rem',
        fontSize: '0.85rem',
        color: 'var(--text-light)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
        <ShieldCheck size={18} color="#0f766e" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: 'var(--text-main)', display: 'block', fontSize: '0.9rem' }}>
            EEAT Verified Guide & Policy Citation
          </strong>
          <span style={{ fontSize: '0.8rem', lineHeight: '1.4', display: 'block', marginTop: '0.25rem' }}>
            Compiled and reviewed by special needs family experts. This guide is directly mapped to official{' '}
            <strong style={{ color: 'var(--text-main)' }}>{agencyName}</strong> regulations{' '}
            {policyCitation ? (
              <>
                (including <code style={{ background: '#f1f5f9', padding: '0.1rem 0.3rem', borderRadius: '4px', fontFamily: 'monospace' }}>{policyCitation}</code>)
              </>
            ) : null}
            . Last updated: <strong style={{ color: 'var(--text-main)' }}>{lastReviewedDate}</strong>.
          </span>
        </div>
      </div>

      {nextSteps && nextSteps.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.04)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
          <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <BookOpen size={14} color="var(--primary-color)" /> Next Steps Checklist
          </strong>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {nextSteps.map((step, idx) => (
              <li key={idx} style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
