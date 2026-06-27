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

  const hasReviewedSource = finalVerificationState !== 'unverified';

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
        {hasReviewedSource ? (
          <ShieldCheck size={18} color="#0f766e" style={{ flexShrink: 0, marginTop: '2px' }} />
        ) : (
          <AlertCircle size={18} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
        )}
        <div>
          <strong style={{ color: 'var(--text-main)', display: 'block', fontSize: '0.9rem' }}>
            {hasReviewedSource ? 'Source Notes & Policy Citation' : 'Source Review Pending'}
          </strong>
          <span style={{ fontSize: '0.8rem', lineHeight: '1.4', display: 'block', marginTop: '0.25rem' }}>
            {finalVerificationState === 'official-verified' && (
              <>
                Source-backed note: {sourceUrl ? (
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                    {agencyName || 'Public agency source'}
                  </a>
                ) : (
                  agencyName || 'Public agency source'
                )}
                {lastVerifiedDate ? ` • Last checked: ${lastVerifiedDate}` : ''}
                {policyCitation ? ` (under citation: ${policyCitation})` : ''}.
              </>
            )}
            {finalVerificationState === 'human-reviewed' && (
              <>
                Reviewed in Ablefull&apos;s editorial workflow on {lastVerifiedDate}.
              </>
            )}
            {finalVerificationState === 'crawler-verified' && (
              <>
                Automatically extracted from {sourceUrl ? (
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                    public source pages
                  </a>
                ) : 'public source pages'}
                {lastVerifiedDate ? ` • Last updated: ${lastVerifiedDate}` : ''}.
              </>
            )}
            {finalVerificationState === 'unverified' && (
              <>
                Source review is still pending. This page stays out of search indexing until that review is complete.
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
