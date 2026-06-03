'use client';

import React, { useState } from 'react';
import { Landmark, ShieldAlert, Award, FileText, Check } from 'lucide-react';

interface WaiverDetails {
  id: string;
  name: string;
  shortName: string;
  agency: string;
  eligibility: string;
  deemingRule: string;
  waitlist: string;
  coreServices: string[];
  limitations: string;
}

const waivers: WaiverDetails[] = [
  {
    id: 'hcbs-dd',
    name: 'HCBS DD Waiver (Lanterman)',
    shortName: 'Lanterman Waiver',
    agency: 'California Regional Centers (DDS)',
    eligibility: 'Developmental disability (Autism, Intellectual Disability, Cerebral Palsy, Epilepsy, or Fifth Category) originating before age 18 and causing substantial limits in 3+ major life domains.',
    deemingRule: 'Yes (Institutional Deeming) — Parental income is completely bypassed for Medi-Cal eligibility if the child receives at least one regional center service annually.',
    waitlist: 'No waitlist. Intakes must be completed within 45 days. (Note: Specific services like behavior therapy or respite placements may have local provider delays.)',
    coreServices: [
      'Respite care hours (parent relief)',
      'Behavioral therapies (ABA, PBS) funding',
      'Social skills groups and camp fees',
      'Adaptive equipment & safety aids',
      'Lifelong Service Coordination (IPP)'
    ],
    limitations: 'Does not cover intensive skilled private-duty nursing. Only covers developmental/behavioral needs, not purely physical or acute medical needs.'
  },
  {
    id: 'hcba',
    name: 'HCBA Waiver (Alternatives)',
    shortName: 'Nursing/Medical Waiver',
    agency: 'Local Waiver Agencies (DHCS)',
    eligibility: 'Complex medical needs meeting nursing facility level of care (e.g. ventilator dependence, G-tube feeding, continuous IV, severe physical limits).',
    deemingRule: 'Yes (Institutional Deeming) — Parental income is ignored. The child is evaluated as a household of one, allowing them to qualify for full-scope Medi-Cal.',
    waitlist: 'Yes (Capped list). Capped since July 2023. Current wait list is 1.5 to 2+ years unless under Reserve Capacity (e.g., under age 21 or transitioning).',
    coreServices: [
      'Waiver Personal Care Services (WPCS)',
      'Private Duty Nursing (RN or LVN care)',
      'Home modification (wheelchair ramps)',
      'Utility bill assistance (medical machinery)',
      'Transitions from skilled nursing facilities'
    ],
    limitations: 'High waiting times (unless reserve slot). Strictly tied to clinical nursing facility level of care. Must demonstrate daily medical nursing necessity.'
  },
  {
    id: 'epsdt',
    name: 'EPSDT Medi-Cal (Standard)',
    shortName: 'Standard Medi-Cal',
    agency: 'County Social Services / DHCS',
    eligibility: 'Standard California residents under 21 who meet income guidelines (under 266% FPL) or bypass income via another waiver.',
    deemingRule: 'No — Traditional family income limits apply. Standard Medi-Cal checks caregiver wealth/salary unless the child is linked to HCBS-DD or HCBA.',
    waitlist: 'No waitlist. Eligible children are enrolled directly once paperwork is verified.',
    coreServices: [
      'Medically necessary Speech, OT, PT, ABA',
      'Routine pediatric medical & dental exams',
      'Incontinence diapers and supplies (after age 3)',
      'Standard prescription drugs & transport',
      'Mental health counseling & specialist visits'
    ],
    limitations: 'Parental income is counted. Does not provide respite hours or personal care hours (IHSS is a separate program).'
  }
];

export default function WaiverComparison() {
  const [activeMobileTab, setActiveMobileTab] = useState<string>('hcbs-dd');
  const activeWaiver = waivers.find(w => w.id === activeMobileTab) || waivers[0];

  return (
    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.75)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Award color="var(--primary-color)" size={24} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: 0 }}>California Medi-Cal Waivers Comparison Matrix</h2>
      </div>
      <p style={{ fontSize: '0.92rem', color: 'var(--text-light)', marginBottom: '2rem', lineHeight: '1.5' }}>
        Medi-Cal waivers bypass parent income limits, letting special needs children access full healthcare, therapies, and in-home support. Review the side-by-side comparison below.
      </p>

      {/* 1. Desktop Matrix Table (hidden on mobile, styled via flex/table) */}
      <div className="desktop-only-table-wrapper" style={{ overflowX: 'auto', marginBottom: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.08)' }}>
              <th style={{ padding: '1rem', width: '20%', fontWeight: 700, color: 'var(--text-light)' }}>Feature</th>
              {waivers.map(w => (
                <th key={w.id} style={{ padding: '1rem', width: '26%', fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                    {w.id === 'hcbs-dd' && <Landmark size={16} />}
                    {w.id === 'hcba' && <ShieldAlert size={16} />}
                    {w.id === 'epsdt' && <FileText size={16} />}
                    {w.shortName}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', fontWeight: 'normal', marginTop: '0.15rem' }}>{w.agency}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Row 1: Target Profile */}
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, verticalAlign: 'top', color: 'var(--text-main)' }}>🎯 Target Clinical Profile</td>
              {waivers.map(w => (
                <td key={w.id} style={{ padding: '1rem', verticalAlign: 'top', color: 'var(--text-light)', lineHeight: 1.4 }}>
                  {w.eligibility}
                </td>
              ))}
            </tr>

            {/* Row 2: Deeming Rules */}
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', background: 'rgba(16, 185, 129, 0.01)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, verticalAlign: 'top', color: 'var(--text-main)' }}>💰 Parent Income Bypass</td>
              {waivers.map(w => (
                <td key={w.id} style={{ padding: '1rem', verticalAlign: 'top', color: 'var(--text-light)', lineHeight: 1.4 }}>
                  {w.deemingRule}
                </td>
              ))}
            </tr>

            {/* Row 3: Waitlist */}
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', background: 'rgba(239, 68, 68, 0.01)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, verticalAlign: 'top', color: 'var(--text-main)' }}>⏳ Waitlist Status</td>
              {waivers.map(w => (
                <td key={w.id} style={{ padding: '1rem', verticalAlign: 'top', color: 'var(--text-light)', lineHeight: 1.4 }}>
                  {w.waitlist}
                </td>
              ))}
            </tr>

            {/* Row 4: Core Services */}
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, verticalAlign: 'top', color: 'var(--text-main)' }}>🌟 Core Services</td>
              {waivers.map(w => (
                <td key={w.id} style={{ padding: '1rem', verticalAlign: 'top', color: 'var(--text-light)' }}>
                  <ul style={{ paddingLeft: '1rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem', lineHeight: 1.4 }}>
                    {w.coreServices.map((srv, idx) => (
                      <li key={idx} style={{ listStyleType: 'circle' }}>{srv}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Row 5: Limitations */}
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, verticalAlign: 'top', color: 'var(--text-main)' }}>⚠️ Key Exclusions</td>
              {waivers.map(w => (
                <td key={w.id} style={{ padding: '1rem', verticalAlign: 'top', color: 'var(--text-light)', lineHeight: 1.4 }}>
                  {w.limitations}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Responsive Tabbed Layout (hidden on desktop via css) */}
      <div className="mobile-only-tabs-wrapper" style={{ display: 'none' }}>
        {/* Tabs switcher */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', marginBottom: '1.25rem', paddingBottom: '0.5rem' }}>
          {waivers.map(w => (
            <button
              key={w.id}
              onClick={() => setActiveMobileTab(w.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.82rem',
                backgroundColor: activeMobileTab === w.id ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.03)',
                color: activeMobileTab === w.id ? 'white' : 'var(--text-light)',
                transition: 'all 0.2s'
              }}
            >
              {w.shortName}
            </button>
          ))}
        </div>

        {/* Mobile active content details card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.15rem 0' }}>{activeWaiver.name}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600 }}>Admin: {activeWaiver.agency}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
              <strong>🎯 Clinical Profile:</strong>
              <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-light)' }}>{activeWaiver.eligibility}</p>
            </div>
            
            <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.06)' }}>
              <strong>💰 Parent Income Deeming:</strong>
              <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-light)' }}>{activeWaiver.deemingRule}</p>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.06)' }}>
              <strong>⏳ Waitlist Status:</strong>
              <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-light)' }}>{activeWaiver.waitlist}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.85rem' }}>
            <strong>🌟 Core Services Provided:</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
              {activeWaiver.coreServices.map((srv, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  <Check size={12} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{srv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS to toggle between Desktop Matrix and Mobile Tabs */}
      <style jsx global>{`
        @media (max-width: 850px) {
          .desktop-only-table-wrapper {
            display: none !important;
          }
          .mobile-only-tabs-wrapper {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
