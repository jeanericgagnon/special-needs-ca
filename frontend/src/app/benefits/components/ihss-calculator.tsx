'use client';

import React, { useState } from 'react';
import { DollarSign, ShieldCheck, Printer } from 'lucide-react';
import {
  formatIhssHourlyEstimateValue,
  formatIhssMonthlyEstimateValue,
  formatIhssEstimateSourceLabel,
  formatIhssEstimateSummary,
  getIhssMonthlyEstimate,
  getIhssWageDisclosure,
} from '@/lib/ihssWageDisclosure';

interface IhssCalculatorProps {
  countyName: string;
  wageRate: number | null;
}

export default function IhssCalculator({ countyName, wageRate }: IhssCalculatorProps) {
  const [needsSupervision, setNeedsSupervision] = useState(false);
  const [eatingScore, setEatingScore] = useState(1);
  const [dressingScore, setDressingScore] = useState(1);
  const [bathingScore, setBathingScore] = useState(1);
  const [mobilityScore, setMobilityScore] = useState(1);

  // Approximate hour allocations based on rank scores (simplified for parent calculations)
  const getBasicHours = () => {
    let hours = 0;
    
    // Eating hours
    if (eatingScore === 2) hours += 5;
    else if (eatingScore === 3) hours += 12;
    else if (eatingScore >= 4) hours += 20;

    // Dressing hours
    if (dressingScore === 2) hours += 4;
    else if (dressingScore === 3) hours += 8;
    else if (dressingScore >= 4) hours += 14;

    // Bathing hours
    if (bathingScore === 2) hours += 3;
    else if (bathingScore === 3) hours += 7;
    else if (bathingScore >= 4) hours += 12;

    // Mobility hours
    if (mobilityScore === 2) hours += 4;
    else if (mobilityScore === 3) hours += 8;
    else if (mobilityScore >= 4) hours += 15;

    return hours;
  };

  const getSupervisionHours = () => {
    if (!needsSupervision) return 0;
    
    // Severely Impaired rules: if basic hours + supervision needs rank is high,
    // they get the maximum 283 hours, otherwise non-severely impaired get 195 hours.
    const totalBasic = getBasicHours();
    return totalBasic > 20 ? 283 : 195;
  };

  const totalHours = needsSupervision ? getSupervisionHours() : getBasicHours();
  const wageDisclosure = getIhssWageDisclosure('california', countyName, countyName, wageRate ?? null);
  const estimatedWage = wageDisclosure?.hourlyRate ?? null;
  const monthlyPayout = getIhssMonthlyEstimate(wageDisclosure, totalHours);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-panel" style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }} className="no-print">
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <DollarSign color="var(--primary-color)" size={24} />
          <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Interactive IHSS Wage & Payout Estimator</h2>
        </div>
        <button className="btn-secondary" onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          <Printer size={14} />
          Print Estimate
        </button>
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: '1.5' }} className="no-print">
        In California, the In-Home Supportive Services (IHSS) program may pay parent providers when the county authorizes services and approves the provider arrangement. Estimate your family&apos;s hours and projected pay using <strong>{countyName} County&apos;s</strong>{' '}
        {estimatedWage !== null ? (
          <>
            checked public county hourly pay estimate of <strong>{formatIhssHourlyEstimateValue(wageDisclosure)}</strong>.
          </>
        ) : (
          <>current county pay estimate once we verify the latest public wage reference.</>
        )}
        {' '}Treat this as planning guidance, not a county pay guarantee.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        
        {/* Input sliders/controls */}
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, display: 'block', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Cognitive Safety & Supervision Need
            </span>
            <div 
              onClick={() => setNeedsSupervision(prev => !prev)}
              style={{ 
                padding: '0.75rem 1rem', 
                borderRadius: '12px', 
                border: '1px solid',
                borderColor: needsSupervision ? 'var(--primary-color)' : 'rgba(0,0,0,0.1)',
                background: needsSupervision ? 'rgba(var(--primary-rgb), 0.02)' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <input 
                type="checkbox" 
                checked={needsSupervision} 
                onChange={() => {}} 
                style={{ height: '16px', width: '16px', accentColor: 'var(--primary-color)' }}
              />
              <div>
                <strong style={{ fontSize: '0.88rem', display: 'block' }}>Needs 24/7 Protective Supervision</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>
                  Required for elopement/wandering, self-injury risk, or lack of safety awareness.
                </span>
              </div>
            </div>
          </div>

          {!needsSupervision ? (
            <>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  <span>Eating / Feeding Support</span>
                  <span style={{ color: 'var(--primary-color)' }}>Rank {eatingScore}</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={eatingScore} 
                  onChange={(e) => setEatingScore(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'block', marginTop: '0.2rem' }}>
                  {eatingScore === 1 && 'Independent feeding.'}
                  {eatingScore === 2 && 'Needs cutting, minor supervision.'}
                  {eatingScore === 3 && 'Needs prompting, physical assistance.'}
                  {eatingScore >= 4 && 'Complete feeding assistance required.'}
                </span>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  <span>Dressing & Grooming</span>
                  <span style={{ color: 'var(--primary-color)' }}>Rank {dressingScore}</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={dressingScore} 
                  onChange={(e) => setDressingScore(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'block', marginTop: '0.2rem' }}>
                  {dressingScore === 1 && 'Independent dressing.'}
                  {dressingScore === 2 && 'Needs help with buttons/fasteners.'}
                  {dressingScore === 3 && 'Requires sorting and physical assistance.'}
                  {dressingScore >= 4 && 'Must be completely dressed by caregiver.'}
                </span>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  <span>Bathing & Hygiene</span>
                  <span style={{ color: 'var(--primary-color)' }}>Rank {bathingScore}</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={bathingScore} 
                  onChange={(e) => setBathingScore(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'block', marginTop: '0.2rem' }}>
                  {bathingScore === 1 && 'Independent bathing.'}
                  {bathingScore === 2 && 'Requires setup and tub supervision.'}
                  {bathingScore === 3 && 'Needs active washing assistance.'}
                  {bathingScore >= 4 && 'Full physical assistance required.'}
                </span>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  <span>Ambulation & Transfers</span>
                  <span style={{ color: 'var(--primary-color)' }}>Rank {mobilityScore}</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={mobilityScore} 
                  onChange={(e) => setMobilityScore(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'block', marginTop: '0.2rem' }}>
                  {mobilityScore === 1 && 'Independent walking.'}
                  {mobilityScore === 2 && 'Needs close guarding/wheelchair steering.'}
                  {mobilityScore === 3 && 'Requires hand-holding or gait assistance.'}
                  {mobilityScore >= 4 && 'Requires physical lifting/transfers.'}
                </span>
              </div>
            </>
          ) : (
            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <span style={{ display: 'block', fontSize: '0.88rem', color: '#166534', fontWeight: 700, marginBottom: '0.25rem' }}>
                ⭐ Protective Supervision Active
              </span>
              <p style={{ fontSize: '0.8rem', color: '#166534', margin: 0, lineHeight: 1.4 }}>
                If Protective Supervision is later authorized, basic personal care hours are integrated. The county then evaluates the case against either <strong>195 hours/month</strong> (Non-Severely Impaired) or <strong>283 hours/month</strong> (Severely Impaired).
              </p>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.1)', padding: '1.5rem', borderRadius: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-light)', fontWeight: 700 }}>
              Estimated Monthly Allocation
            </span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-color)', margin: '0.5rem 0' }}>
              {totalHours} Hours
            </div>
            
            <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.06)', margin: '1rem 0' }} />

            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-light)', fontWeight: 700 }}>
              Estimated Caregiver Pay
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981', margin: '0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {monthlyPayout !== null ? (
                <>
                  <DollarSign size={28} />
                  {monthlyPayout.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <span style={{ fontSize: '1rem', color: 'var(--text-light)', fontWeight: 400 }}> / month estimate</span>
                </>
              ) : (
                <span style={{ fontSize: '1.15rem', color: 'var(--text-light)', fontWeight: 600 }}>Still being verified</span>
              )}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontStyle: 'italic', display: 'block', marginTop: '0.25rem' }}>
              {formatIhssEstimateSummary(wageDisclosure)}
            </span>
            {wageDisclosure && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'block', marginTop: '0.35rem' }}>
                Source checked:{' '}
                <a href={wageDisclosure.sourceUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                  {formatIhssEstimateSourceLabel(wageDisclosure)}
                </a>{' '}
                • Confirm with{' '}
                <a href={wageDisclosure.officialConfirmUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                  the current official county IHSS office directory
                </a>{' '}
                • Last checked {wageDisclosure.lastVerifiedDate}
              </span>
            )}
          </div>

          <div style={{ background: 'white', padding: '1rem 1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={15} color="var(--primary-color)" /> Legal Assessment Tip
            </span>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.4 }}>
              To support this request, submit the <strong>SOC 873 Medical Certification</strong> signed by your pediatrician. Start keeping a 24-hour safety log documenting risk events (for example, climbing counters, trying to eat non-food items, or opening outer doors) to present during the county home-visit review.
            </p>
          </div>
        </div>

      </div>

      {/* Print representation */}
      <div className="print-only" style={{ display: 'none', borderTop: '2px solid #000', paddingTop: '1.5rem', marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>In-Home Supportive Services (IHSS) Estimate Breakdown</h3>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Location: <strong>{countyName} County, CA</strong> | Caregiver Wage:{' '}
          <strong>{formatIhssHourlyEstimateValue(wageDisclosure)}</strong>
        </p>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Service Category</th>
              <th style={{ padding: '0.5rem' }}>Estimated Allocation</th>
            </tr>
          </thead>
          <tbody>
            {needsSupervision ? (
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>Protective Supervision (Severe Cognitive Impairment)</td>
                <td style={{ padding: '0.5rem' }}>{totalHours} Hours / month</td>
              </tr>
            ) : (
              <>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>Eating Support (Rank {eatingScore})</td>
                  <td style={{ padding: '0.5rem' }}>{eatingScore >= 2 ? 'Yes' : 'Minimal'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>Dressing & Grooming (Rank {dressingScore})</td>
                  <td style={{ padding: '0.5rem' }}>{dressingScore >= 2 ? 'Yes' : 'Minimal'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>Bathing & Hygiene (Rank {bathingScore})</td>
                  <td style={{ padding: '0.5rem' }}>{bathingScore >= 2 ? 'Yes' : 'Minimal'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>Ambulation & Transfers (Rank {mobilityScore})</td>
                  <td style={{ padding: '0.5rem' }}>{mobilityScore >= 2 ? 'Yes' : 'Minimal'}</td>
                </tr>
              </>
            )}
            <tr style={{ fontWeight: 'bold', borderTop: '2px solid #ddd' }}>
              <td style={{ padding: '0.5rem' }}>Total Monthly Hours</td>
              <td style={{ padding: '0.5rem' }}>{totalHours} Hours</td>
            </tr>
            <tr style={{ fontWeight: 'bold', color: '#10b981' }}>
              <td style={{ padding: '0.5rem' }}>Estimated Monthly Pay</td>
              <td style={{ padding: '0.5rem' }}>
                {formatIhssMonthlyEstimateValue(monthlyPayout)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
