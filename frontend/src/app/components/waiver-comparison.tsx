'use client';

import React, { useState } from 'react';
import { Landmark, ShieldAlert, Award, FileText, ChevronRight, Check, X } from 'lucide-react';

interface WaiverDetails {
  id: string;
  name: string;
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
    agency: 'California Regional Centers (DDS)',
    eligibility: 'Developmental disability (Autism, Intellectual Disability, Cerebral Palsy, Epilepsy) originating before age 18 and causing substantial limits in 3+ major life domains.',
    deemingRule: 'Yes (Institutional Deeming) — Parental income is completely bypassed for Medi-Cal eligibility if the child is vended by a Regional Center and receives at least one regional center service annually.',
    waitlist: 'No waitlist for entry. Intakes must be completed within 45 days. (Note: Specific services like behavior therapy or respite placements may have local provider delays.)',
    coreServices: [
      'Respite care hours (in-home/out-of-home parent relief)',
      'Behavioral therapies (ABA, PBS) copay/insurance funding',
      'Social skills groups and specialized classes',
      'Adaptive equipment and home environmental modifications',
      'Lifelong Service Coordination (IPP)'
    ],
    limitations: 'Does not cover intensive skilled private-duty nursing. Only covers developmental/behavioral needs, not purely physical or acute medical needs.'
  },
  {
    id: 'hcba',
    name: 'HCBA Waiver (Alternatives)',
    agency: 'Local Waiver Agencies (DHCS)',
    eligibility: 'Complex medical needs meeting nursing facility level of care (e.g. ventilator dependence, tracheostomy, G-tube feeding, continuous IV infusions, severe physical limits).',
    deemingRule: 'Yes (Institutional Deeming) — Parental income is ignored. The child is evaluated as a household of one, allowing them to qualify for full-scope Medi-Cal to fund in-home medical care.',
    waitlist: 'Yes (Capped list). Capped since July 12, 2023. Current wait list is 1.5 to 2+ years unless under Reserve Capacity (e.g., under age 21 or transitioning from other programs).',
    coreServices: [
      'Waiver Personal Care Services (WPCS) — pays parents for medical oversight hours',
      'Private Duty Nursing (RN or LVN care in the home)',
      'Home modification funding (wheelchair ramps, bathroom safety)',
      'Utility bill assistance (for running medical machinery)',
      'Transitions from skilled nursing facilities back to home'
    ],
    limitations: 'High waiting times. Strictly tied to clinical nursing facility level of care. Must demonstrate daily medical necessity for nursing interventions.'
  },
  {
    id: 'epsdt',
    name: 'EPSDT Medi-Cal (Standard)',
    agency: 'County Social Services / DHCS',
    eligibility: 'Standard California residents under 21 who meet income guidelines (under 266% FPL) or bypass income via another waiver.',
    deemingRule: 'No — Traditional family income limits apply. Standard Medi-Cal checks caregiver wealth/salary unless the child is linked to HCBS-DD or HCBA.',
    waitlist: 'No waitlist. Eligible children are enrolled directly once paperwork is verified.',
    coreServices: [
      'Unlimited medically necessary therapies (Speech, OT, PT, ABA)',
      'Routine pediatric medical, dental, and optical exams',
      'Incontinence diapers and supplies (after age 3)',
      'Standard prescription drugs and medical transportation',
      'Mental health counseling and pediatric specialist visits'
    ],
    limitations: 'Parental income is counted. Does not provide respite hours or personal care hours (IHSS is a separate state plan service, though EPSDT provides the Medi-Cal link to it).'
  }
];

export default function WaiverComparison() {
  const [activeTab, setActiveTab] = useState<string>('hcbs-dd');

  const activeWaiver = waivers.find(w => w.id === activeTab) || waivers[0];

  return (
    <div className="glass-panel waiver-comparison-card" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.75)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <Award color="var(--primary-color)" size={24} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: 0 }}>California Medi-Cal Waivers Comparison</h2>
      </div>
      <p style={{ fontSize: '0.92rem', color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
        Medi-Cal waivers bypass parent income limits, letting special needs children access full healthcare, therapies, and in-home support. Toggle the options below to find the right waiver.
      </p>

      {/* Tabs list */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)', 
        paddingBottom: '0.75rem',
        marginBottom: '1.5rem',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {waivers.map(w => (
          <button
            key={w.id}
            onClick={() => setActiveTab(w.id)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: activeTab === w.id ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.03)',
              color: activeTab === w.id ? 'white' : 'var(--text-light)',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            {w.id === 'hcbs-dd' && <Landmark size={14} />}
            {w.id === 'hcba' && <ShieldAlert size={14} />}
            {w.id === 'epsdt' && <FileText size={14} />}
            {w.name.split(' ')[0] + ' ' + (w.id === 'epsdt' ? 'Medi-Cal' : 'Waiver')}
          </button>
        ))}
      </div>

      {/* Content panel */}
      <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        
        {/* Title and Admin Agency */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            {activeWaiver.name}
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600 }}>
            🏛️ Administered by: {activeWaiver.agency}
          </span>
        </div>

        {/* Dynamic Detail grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          {/* Eligibility & Deeming */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.08)' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>🎯 Target Clinical Profile:</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0, lineHeight: '1.4' }}>{activeWaiver.eligibility}</p>
            </div>
            
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.08)' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>💰 Parent Income Bypass (Deeming):</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0, lineHeight: '1.4' }}>{activeWaiver.deemingRule}</p>
            </div>
          </div>

          {/* Waitlist and Key Limitations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              borderRadius: '12px', 
              background: activeWaiver.id === 'hcba' ? 'rgba(239, 68, 68, 0.03)' : 'rgba(0,0,0,0.02)', 
              border: activeWaiver.id === 'hcba' ? '1px solid rgba(239, 68, 68, 0.08)' : '1px solid rgba(0,0,0,0.05)' 
            }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>⏳ Waitlist & Processing:</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0, lineHeight: '1.4' }}>{activeWaiver.waitlist}</p>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>⚠️ Key Exclusions/Limits:</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0, lineHeight: '1.4' }}>{activeWaiver.limitations}</p>
            </div>
          </div>

        </div>

        {/* Core Services Section */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.25rem' }}>
          <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>🌟 Core Services Provided:</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem' }}>
            {activeWaiver.coreServices.map((service, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.85rem' }}>
                <Check size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ color: 'var(--text-main)' }}>{service}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
