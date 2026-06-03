import React from 'react';
import { Shield, BookOpen, AlertCircle } from 'lucide-react';

export default function Footer({ setCurrentTab }) {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--glass-border)',
      padding: '48px 0 24px',
      marginTop: '64px',
      fontSize: '14px',
      color: 'var(--text-secondary)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '40px',
          marginBottom: '40px'
        }} className="footer-grid">
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span className="gradient-text" style={{ fontSize: '18px', fontWeight: 800 }}>
                CALIFORNIA DISABILITY NAVIGATOR
              </span>
            </div>
            <p style={{ maxWidth: '440px', marginBottom: '16px', lineHeight: 1.6 }}>
              A structured knowledge base mapping California disability programs, Regional Center intake, county-level routing, special education advocacy, and parent resources. Created to empower caregivers.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-teal)', fontSize: '13px', fontWeight: 600 }}>
              <Shield size={16} />
              100% Free • Independent • Privacy First
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }}>Navigating Benefits</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button 
                  onClick={() => setCurrentTab('screener')} 
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit' }}
                  onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
                  onMouseOut={(e) => e.target.style.color = 'inherit'}
                >
                  Start Eligibility Screener
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab('directory')} 
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit' }}
                  onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
                  onMouseOut={(e) => e.target.style.color = 'inherit'}
                >
                  Browse Program Catalog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab('admin')} 
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit' }}
                  onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
                  onMouseOut={(e) => e.target.style.color = 'inherit'}
                >
                  Admin Verification Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }}>Helpful Resources</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <a href="https://www.disabilityrightsca.org" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>
                  Disability Rights CA
                </a>
              </li>
              <li>
                <a href="https://www.dds.ca.gov" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>
                  Dept of Developmental Services
                </a>
              </li>
              <li>
                <a href="https://www.dhcs.ca.gov" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>
                  DHCS Medi-Cal Portal
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            background: 'rgba(244, 63, 94, 0.05)',
            border: '1px solid rgba(244, 63, 94, 0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            fontSize: '13px',
            lineHeight: 1.5,
            color: 'var(--text-secondary)'
          }}>
            <AlertCircle size={20} style={{ color: 'var(--accent-coral)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Legal & Medical Disclaimer</strong>
              The information provided by this navigator is for educational and informational purposes only. It does not constitute legal, medical, educational, or benefits advice. We recommend screening, but decisions on eligibility are made strictly by official government agencies (such as CDSS, SSA, DDS, and local school districts). Always consult with qualified advocates, attorneys, or clinical specialists.
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginTop: '8px'
          }} className="footer-bottom">
            <span>© 2026 California Disability Navigator. All rights reserved. Built to wow families.</span>
            <span>Last database audit: May 2026</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            gap: 10px !important;
            text-align: center;
          }
        }
      `}} />
    </footer>
  );
}
