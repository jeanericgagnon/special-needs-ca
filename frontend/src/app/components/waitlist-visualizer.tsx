'use client';

import React from 'react';
import { Clock, AlertTriangle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import type { ProgramWaitlist } from '@/lib/db';

interface WaitlistVisualizerProps {
  activeProgramId?: string;
  waitlists: ProgramWaitlist[];
}

export default function WaitlistVisualizer({ activeProgramId, waitlists }: WaitlistVisualizerProps) {
  const filteredPrograms = activeProgramId
    ? waitlists.filter(p => p.program_id === activeProgramId)
    : waitlists;

  const getStatusColor = (status: ProgramWaitlist['status']) => {
    switch (status) {
      case 'critical': return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.2)', bar: 'linear-gradient(90deg, #f87171, #ef4444)' };
      case 'moderate': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)', bar: 'linear-gradient(90deg, #fbbf24, #f59e0b)' };
      case 'standard': return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: 'rgba(16, 185, 129, 0.2)', bar: 'linear-gradient(90deg, #34d399, #10b981)' };
      case 'priority': return { bg: 'rgba(var(--primary-rgb), 0.1)', text: 'var(--primary-color)', border: 'rgba(var(--primary-rgb), 0.2)', bar: 'linear-gradient(90deg, var(--primary-color), var(--primary-color))' };
    }
  };

  return (
    <div className="waitlist-visualizer-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {filteredPrograms.map(p => {
        const colors = getStatusColor(p.status);
        // Calculate progress percentage for visual bar (cap max at 100%)
        const progressPct = Math.min(100, Math.max(8, (p.duration_months / 24) * 100));

        return (
          <div 
            key={p.id} 
            className="glass-panel" 
            style={{ 
              padding: '1.75rem', 
              borderRadius: '20px', 
              background: 'rgba(255, 255, 255, 0.75)', 
              boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
              border: `1px solid ${p.status === 'critical' ? colors.border : 'var(--glass-border)'}`,
              transition: 'transform 0.2s ease',
              margin: '0.5rem 0'
            }}
          >
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{p.name}</h3>
                {p.legal_deadline && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', fontStyle: 'italic' }}>
                    ⚖️ {p.legal_deadline}
                  </span>
                )}
              </div>
              
              {/* Badge */}
              <span style={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                padding: '0.3rem 0.8rem', 
                borderRadius: '999px', 
                backgroundColor: colors.bg, 
                color: colors.text,
                border: `1px solid ${colors.border}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                {p.status === 'critical' && <AlertTriangle size={12} />}
                {p.status === 'moderate' && <Clock size={12} />}
                {p.status === 'standard' && <CheckCircle size={12} />}
                {p.status === 'priority' && <Sparkles size={12} />}
                {p.duration_label}
              </span>
            </div>

            {/* Visual meter track */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ height: '10px', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.04)', borderRadius: '5px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${progressPct}%`, 
                  background: colors.bar, 
                  borderRadius: '5px',
                  transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.35rem' }}>
                <span>0 Days</span>
                <span>3 Months</span>
                <span>6 Months</span>
                <span>1 Year</span>
                <span>2+ Years</span>
              </div>
            </div>

            {/* Explainer paragraph */}
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
              {p.description}
            </p>

            {/* Reserve Capacity Info */}
            {p.reserve_capacity_notice && (
              <div 
                style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '10px', 
                  backgroundColor: 'rgba(var(--primary-rgb), 0.04)', 
                  borderLeft: '3px solid var(--primary-color)',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'flex-start'
                }}
              >
                <ShieldAlert size={16} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                  <strong>How to bypass:</strong> {p.reserve_capacity_notice}
                </div>
              </div>
            )}
            
            {/* Sync Timestamp indicator */}
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-light)', marginTop: '0.75rem', textAlign: 'right', fontStyle: 'italic' }}>
              Last checked: {new Date(p.last_scraped_at).toLocaleDateString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
