'use client';

import React from 'react';
import { useChildProfile } from './ChildProfileContext';
import { REGIONAL_CENTER_METRICS, STATEWIDE_AVERAGES } from '@/lib/funding-data';
import { Landmark, TrendingUp, AlertTriangle } from 'lucide-react';

export default function DisparityComparison() {
  const { countyDetails } = useChildProfile();

  if (!countyDetails || !countyDetails.regionalCenters || countyDetails.regionalCenters.length === 0) {
    return null;
  }

  const activeRc = countyDetails.regionalCenters[0];
  // Match with metrics dataset
  const metrics = REGIONAL_CENTER_METRICS.find(m => 
    m.name.toLowerCase().includes(activeRc.name.toLowerCase()) || 
    activeRc.name.toLowerCase().includes(m.name.toLowerCase())
  ) || {
    id: 'unknown',
    name: activeRc.name,
    counties: countyDetails.name,
    avgPosSpend: 13500,
    avgRespiteHours: 20,
    utilizationRate: 50,
    disparityScore: 5,
    context: 'Standard regional center operational averages apply. Direct utilization depends on county vendor availability.'
  };

  const getPercent = (value: number, max: number) => {
    return Math.min(100, Math.max(5, (value / max) * 100));
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', border: '1px solid rgba(var(--primary-rgb), 0.1)' }}>
      <div>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', color: 'var(--text-main)' }}>
          <Landmark color="var(--primary-color)" size={18} />
          Regional Center Disparity Audit
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
          Comparing <strong>{metrics.name}</strong> benchmarks against California statewide averages.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        
        {/* Metric 1: Average POS Spend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Average POS Purchase of Service (Annual)</span>
            <span style={{ color: 'var(--primary-color)' }}>${metrics.avgPosSpend.toLocaleString()} <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>vs ${STATEWIDE_AVERAGES.avgPosSpend.toLocaleString()} state</span></span>
          </div>
          <div style={{ height: '8px', background: 'rgba(0,0,0,0.04)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${getPercent(metrics.avgPosSpend, 22000)}%`, height: '100%', background: 'var(--primary-color)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
            <div style={{ left: `${getPercent(STATEWIDE_AVERAGES.avgPosSpend, 22000)}%`, width: '2px', height: '100%', background: '#6b7280', position: 'absolute', top: 0 }} />
          </div>
        </div>

        {/* Metric 2: Average Respite Hours */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Average Respite Allocation (Monthly)</span>
            <span style={{ color: '#10b981' }}>{metrics.avgRespiteHours} hrs <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>vs {STATEWIDE_AVERAGES.avgRespiteHours} hrs state</span></span>
          </div>
          <div style={{ height: '8px', background: 'rgba(0,0,0,0.04)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${getPercent(metrics.avgRespiteHours, 40)}%`, height: '100%', background: '#10b981', borderRadius: '4px', transition: 'width 0.5s ease' }} />
            <div style={{ left: `${getPercent(STATEWIDE_AVERAGES.avgRespiteHours, 40)}%`, width: '2px', height: '100%', background: '#6b7280', position: 'absolute', top: 0 }} />
          </div>
        </div>

        {/* Metric 3: Utilization Rate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Authorized Hours Utilization Rate</span>
            <span style={{ color: metrics.utilizationRate < 45 ? 'var(--danger-color)' : '#d97706' }}>{metrics.utilizationRate}% <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>vs {STATEWIDE_AVERAGES.utilizationRate}% state</span></span>
          </div>
          <div style={{ height: '8px', background: 'rgba(0,0,0,0.04)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${metrics.utilizationRate}%`, height: '100%', background: metrics.utilizationRate < 45 ? 'var(--danger-color)' : '#d97706', borderRadius: '4px', transition: 'width 0.5s ease' }} />
            <div style={{ left: `${STATEWIDE_AVERAGES.utilizationRate}%`, width: '2px', height: '100%', background: '#6b7280', position: 'absolute', top: 0 }} />
          </div>
        </div>

      </div>

      <div style={{ background: 'rgba(var(--primary-rgb), 0.02)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(var(--primary-rgb), 0.05)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)', fontWeight: 600 }}>
          <TrendingUp size={16} /> Regional Context
        </div>
        <p style={{ color: 'var(--text-light)', lineHeight: 1.4 }}>{metrics.context}</p>
      </div>

      {metrics.utilizationRate < 45 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '0.85rem', borderRadius: '8px', display: 'flex', gap: '0.5rem', alignItems: 'start', fontSize: '0.78rem' }}>
          <AlertTriangle color="#d97706" size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <div>
            <strong style={{ color: '#b45309' }}>Low Service Utilization Warning</strong>
            <p style={{ color: '#d97706', marginTop: '0.15rem', lineHeight: 1.3 }}>
              This regional center has a low utilization rate ({metrics.utilizationRate}%). This is typically due to a shortage of agency-employed caregiver vendors in your area. Consider requesting <strong>Self-Directed Respite (Service Code 896)</strong> to hire family/friends instead.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
