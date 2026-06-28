import React from 'react';
import { ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import ContributionModal from '@/components/contribution-modal';
import { getSourceReviewDisplay } from '@/lib/sourceReviewLabels';

export interface DisclosureSource {
  name: string;
  url?: string;
  lastReviewedDate?: string | null;
  verificationStatus?: string | null;
  sourceType?: string | null;
  confidenceScore?: number | null;
}

interface SourceFreshnessDisclosureProps {
  sources: DisclosureSource[];
  correctionSuggestionType?: 'advocate' | 'district' | 'program' | 'other';
  correctionTargetId?: string | null;
  correctionTargetName?: string;
  correctionButtonLabel?: string;
}

export default function SourceFreshnessDisclosure({
  sources,
  correctionSuggestionType = 'other',
  correctionTargetId = null,
  correctionTargetName,
  correctionButtonLabel = 'Report a correction',
}: SourceFreshnessDisclosureProps) {
  const hasSources = Array.isArray(sources) && sources.length > 0;
  const shouldRender = hasSources || Boolean(correctionTargetId || correctionTargetName);
  if (!shouldRender) return null;

  return (
    <div 
      className="glass-panel" 
      style={{ 
        marginTop: '3.5rem', 
        padding: '1.5rem 2rem', 
        background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.02) 0%, rgba(var(--primary-rgb), 0.05) 100%)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px'
      }}
    >
      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <ShieldCheck size={16} /> Source Notes & Freshness Information
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.5 }}>
          We show the public sources we relied on, when we last checked them, and whether each item is source-backed, publicly linked, or still needs deeper verification. Treat any rates, timelines, and eligibility notes on this page as guidance until you confirm the current official source for your county or program. If something looks wrong, please report a correction before relying on it.
        </p>

        <div>
          <ContributionModal
            suggestionType={correctionSuggestionType}
            targetId={correctionTargetId}
            targetName={correctionTargetName || 'this page'}
            buttonLabel={correctionButtonLabel}
          />
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.45 }}>
          Missing a local office, program, or source-backed contact? Use the correction flow to suggest a source-backed update. We keep thin or unverified local entries gated until that review is complete.
        </p>

        {hasSources ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
            {sources.map((src, idx) => {
            const reviewDisplay = getSourceReviewDisplay(src.verificationStatus);
            const confidenceLabel = typeof src.confidenceScore === 'number' && Number.isFinite(src.confidenceScore)
              ? `${Math.round(src.confidenceScore * 100)}% confidence`
              : null;
            const sourceTypeLabel = src.sourceType
              ? String(src.sourceType).replace(/_/g, ' ')
              : null;
            
            let dateText = 'Unknown';
            if (src.lastReviewedDate) {
              try {
                dateText = new Date(src.lastReviewedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                });
              } catch {
                dateText = src.lastReviewedDate;
              }
            }

            return (
              <div 
                key={idx} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.5)', 
                  border: '1px solid rgba(0, 0, 0, 0.04)', 
                  borderRadius: '12px', 
                  padding: '1rem',
                  fontSize: '0.82rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{src.name}</strong>
                  <span 
                    style={{ 
                      fontSize: '0.68rem', 
                      fontWeight: 700, 
                      color: reviewDisplay.color,
                      background: reviewDisplay.background,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '10px',
                      border: `1px solid ${reviewDisplay.borderColor}`
                    }}
                  >
                    {reviewDisplay.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-light)' }}>
                  <Calendar size={12} />
                  <span>Last Checked: {dateText}</span>
                </div>

                {(sourceTypeLabel || confidenceLabel) && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', lineHeight: 1.4 }}>
                    {[sourceTypeLabel ? `Source type: ${sourceTypeLabel}` : null, confidenceLabel].filter(Boolean).join(' • ')}
                  </div>
                )}

                {src.url && (
                  <a 
                    href={src.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.2rem', 
                      color: 'var(--primary-color)', 
                      textDecoration: 'none', 
                      fontWeight: 600,
                      marginTop: '0.2rem'
                    }}
                  >
                    Open Source <ExternalLink size={11} />
                  </a>
                )}
              </div>
            );
            })}
          </div>
        ) : (
          <div
            style={{
              marginTop: '0.5rem',
              background: 'rgba(255, 255, 255, 0.5)',
              border: '1px solid rgba(0, 0, 0, 0.04)',
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '0.82rem',
              color: 'var(--text-light)',
              lineHeight: 1.5,
            }}
          >
            We are still verifying the direct public source notes for this surface. Please use the correction flow above if you have a current public source we should review before this page is treated as fully source-backed.
          </div>
        )}
      </div>
    </div>
  );
}
