import React from 'react';
import { ExternalLink, Calendar, ShieldCheck, HelpCircle } from 'lucide-react';

export interface DisclosureSource {
  name: string;
  url?: string;
  lastReviewedDate?: string | null;
  verificationStatus?: string | null;
}

interface SourceFreshnessDisclosureProps {
  sources: DisclosureSource[];
}

export default function SourceFreshnessDisclosure({ sources }: SourceFreshnessDisclosureProps) {
  if (!sources || sources.length === 0) {
    return (
      <div 
        className="glass-panel" 
        style={{ 
          marginTop: '3.5rem', 
          padding: '1.5rem 2rem', 
          background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.02) 0%, rgba(180, 83, 9, 0.05) 100%)',
          border: '1px solid rgba(180, 83, 9, 0.1)',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#b45309', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <HelpCircle size={16} /> Source Verification Pending
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.5 }}>
          There are currently no verified official sources or database-backed freshness records linked to this directory path. This listing is pending verification and is not indexed for search engines.
        </p>
      </div>
    );
  }

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
        <ShieldCheck size={16} /> Verified Sources & Freshness Information
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.5 }}>
          Our directory relies on official state rules, county social service directories, and direct program citations. We audit listings regularly to maintain accuracy.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
          {sources.map((src, idx) => {
            const status = (src.verificationStatus || 'unverified').toLowerCase();
            const isVerified = status === 'official_verified' || status === 'human_verified' || status === 'verified';
            
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
                      color: isVerified ? '#0f766e' : '#64748b',
                      background: isVerified ? 'rgba(15, 118, 110, 0.08)' : 'rgba(100, 116, 139, 0.08)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '10px',
                      border: `1px solid ${isVerified ? '#0f766e30' : '#64748b30'}`
                    }}
                  >
                    {isVerified ? 'Verified Source' : 'Public Listing'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-light)' }}>
                  <Calendar size={12} />
                  <span>Last Reviewed: {dateText}</span>
                </div>

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
                    Official Portal <ExternalLink size={11} />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
