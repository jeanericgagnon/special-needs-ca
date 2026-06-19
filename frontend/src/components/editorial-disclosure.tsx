import React from 'react';
import { ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';

interface EditorialDisclosureProps {
  verificationState?: 'official-verified' | 'human-reviewed' | 'crawler-verified' | 'unverified';
  agencyName?: string;
  sourceUrl?: string;
  lastVerifiedDate?: string | null;
  policyCitation?: string;
  nextSteps?: string[];
}

export default function EditorialDisclosure({
  verificationState = 'unverified',
  agencyName,
  sourceUrl,
  lastVerifiedDate,
  policyCitation,
  nextSteps,
}: EditorialDisclosureProps) {
  let finalVerificationState = verificationState;
  
  if (finalVerificationState === 'official-verified' && !sourceUrl) {
    finalVerificationState = 'unverified';
  }
  if (finalVerificationState === 'human-reviewed' && !lastVerifiedDate) {
    finalVerificationState = 'unverified';
  }
  if (finalVerificationState === 'crawler-verified' && !sourceUrl) {
    finalVerificationState = 'unverified';
  }

  const isVerified = finalVerificationState !== 'unverified';

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
        {isVerified ? (
          <ShieldCheck size={18} color="#0f766e" style={{ flexShrink: 0, marginTop: '2px' }} />
        ) : (
          <AlertCircle size={18} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
        )}
        <div>
          <strong style={{ color: 'var(--text-main)', display: 'block', fontSize: '0.9rem' }}>
            {isVerified ? 'Verified Guide & Policy Citation' : 'Verification Status Pending'}
          </strong>
          <span style={{ fontSize: '0.8rem', lineHeight: '1.4', display: 'block', marginTop: '0.25rem' }}>
            {finalVerificationState === 'official-verified' && (
              <>
                Source: {sourceUrl ? (
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                    {agencyName || 'Official Agency'}
                  </a>
                ) : (
                  agencyName || 'Official Agency'
                )}
                {lastVerifiedDate ? ` • Last reviewed: ${lastVerifiedDate}` : ''}
                {policyCitation ? ` (under citation: ${policyCitation})` : ''}.
              </>
            )}
            {finalVerificationState === 'human-reviewed' && (
              <>
                Reviewed by Ablefull editorial workflow on {lastVerifiedDate}.
              </>
            )}
            {finalVerificationState === 'crawler-verified' && (
              <>
                Automatically extracted from {sourceUrl ? (
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                    official portals
                  </a>
                ) : 'official portals'}
                {lastVerifiedDate ? ` • Last updated: ${lastVerifiedDate}` : ''}.
              </>
            )}
            {finalVerificationState === 'unverified' && (
              <>
                Source verification pending. This page is excluded from search indexing until verification is complete.
              </>
            )}
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
