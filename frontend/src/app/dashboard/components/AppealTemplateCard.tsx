'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import PrintButton from '@/components/print-button';

interface AppealTemplateCardProps {
  letterText: string;
  t: {
    previewTitle: string;
    previewSub: string;
    copiedText: string;
    copyLabel: string;
    printLabel: string;
  };
}

export default function AppealTemplateCard({ letterText, t }: AppealTemplateCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{t.previewTitle}</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{t.previewSub}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleCopy}
            className="btn-primary"
            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.82rem', borderRadius: '8px', background: 'rgba(0,0,0,0.04)', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}
          >
            {copied ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#10b981' }}>
                <Check size={14} /> {t.copiedText}
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <Copy size={14} /> {t.copyLabel}
              </span>
            )}
          </button>
          <PrintButton label={t.printLabel} />
        </div>
      </div>

      {/* Simulated Paper Draft Canvas */}
      <div style={{
        background: 'var(--simulated-paper-bg, #f8fafc)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04)',
        minHeight: '400px',
        overflowX: 'auto'
      }}>
        <pre style={{
          fontFamily: 'Courier, monospace',
          fontSize: '0.88rem',
          color: 'var(--text-main, #334155)',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6',
          margin: 0
        }}>
          {letterText}
        </pre>
      </div>
    </div>
  );
}
