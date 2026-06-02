'use client';

import React, { useState } from 'react';
import { HelpCircle, RefreshCw, Sparkles, Smile, ShieldAlert, Award, FileText } from 'lucide-react';

export default function RespiteExplainer() {
  const [ageRange, setAgeRange] = useState<string>('under-3');
  const [behaviorSeverity, setBehaviorSeverity] = useState<string>('low');
  const [caregiverCount, setCaregiverCount] = useState<string>('two');
  const [hasSleepIssues, setHasSleepIssues] = useState<boolean>(false);

  // Simple simulator logic to estimate monthly respite hour tier
  const estimateRespiteHours = () => {
    let score = 0;
    
    // Age factors (younger kids have lower baseline scores because of neurotypical parenting expectations)
    if (ageRange === 'under-3') score += 1;
    else if (ageRange === '3-5') score += 3;
    else score += 5; // 6-18

    // Behavior factor
    if (behaviorSeverity === 'high') score += 7;
    else if (behaviorSeverity === 'medium') score += 4;
    else score += 1;

    // Caregiver factor (single parents get higher score)
    if (caregiverCount === 'single') score += 3;

    // Sleep issues add significantly
    if (hasSleepIssues) score += 4;

    // Interpret score
    if (score <= 4) {
      return {
        hours: '0 Hours (Baseline)',
        verdict: 'Typical Parental Care Assessment',
        color: '#ef4444',
        explanation: 'At this age/need level, Regional Centers usually argue that the care demands match those of a typically developing child (e.g., all 2-year-olds need constant supervision). To qualify, you must document "extraordinary care" demands that exceed typical parenting.'
      };
    } else if (score <= 9) {
      return {
        hours: '12 - 20 Hours / Month',
        verdict: 'Standard Respite relief',
        color: '#f59e0b',
        explanation: 'Your child exhibits moderate care needs exceeding typical peers. This tier provides standard parent-relief hours through a licensed respite agency vendor.'
      };
    } else {
      return {
        hours: '30 - 60+ Hours / Month',
        verdict: 'Enhanced/High Respite Hours',
        color: '#10b981',
        explanation: 'Significant self-injurious behaviors, elopement risks, or severe sleep disturbances require constant vigilance. The IPP team assesses higher tiers of support to prevent placement or caregiver burnout.'
      };
    }
  };

  const estimation = estimateRespiteHours();

  return (
    <div className="glass-panel respite-explainer-card" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.75)' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <HelpCircle color="var(--primary-color)" size={24} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: 0 }}>Regional Center Respite: The 0-Hour Mystery</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        
        {/* Left: Explainer text */}
        <div style={{ fontSize: '0.92rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '1rem' }}>
            Many caregivers are shocked when a California Regional Center awards them <strong>0 hours</strong> of respite care. This happens because respite is governed by the concept of <strong>"Extraordinary Care Requirements."</strong>
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Under DDS guidelines, Regional Centers assume parents are naturally responsible for the basic supervision, cleaning, and feeding of their children. They will only fund respite if caregiving demands are **substantially greater** than those of a typically developing child of the identical age.
          </p>
          
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.08)', marginBottom: '1.5rem' }}>
            <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <ShieldAlert size={14} color="#ef4444" /> Why Eli Got 0 Hours:
            </strong>
            <span style={{ fontSize: '0.82rem', display: 'block', lineHeight: '1.4' }}>
              If a child is 2 years old and potty-trained/non-verbal, the intake team will argue that <em>all</em> 2-year-olds need diapers changed and constant supervision, claiming no "extraordinary care" threshold is met yet.
            </span>
          </div>

          <strong style={{ color: 'var(--text-main)', display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>How to prove "Extraordinary Care":</strong>
          <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: 0 }}>
            <li>Log extreme safety concerns (pica/eating non-food, eloping, head-banging).</li>
            <li>Document severe sleep disruption (child awake 2-4 hours every night).</li>
            <li>Collect notes showing the child is rejected from standard daycare settings.</li>
          </ul>
        </div>

        {/* Right: Interactive Simulator */}
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '16px', 
          background: 'white', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          border: '1px solid rgba(0,0,0,0.04)' 
        }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
            Respite Allocation Simulator
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            
            {/* Age Range */}
            <div>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Child Age Range:</label>
              <select 
                value={ageRange} 
                onChange={(e) => setAgeRange(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '8px', fontSize: '0.85rem' }}
              >
                <option value="under-3">Under 3 Years Old (Early Start)</option>
                <option value="3-5">3 to 5 Years Old (Preschool)</option>
                <option value="6-18">6 to 18 Years Old (K-12)</option>
              </select>
            </div>

            {/* Behavior severity */}
            <div>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Safety / Behavior Needs:</label>
              <select 
                value={behaviorSeverity} 
                onChange={(e) => setBehaviorSeverity(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '8px', fontSize: '0.85rem' }}
              >
                <option value="low">Mild / Standard delays (No safety risks)</option>
                <option value="medium">Moderate behavior issues (Wandering, frequent tantrums)</option>
                <option value="high">Severe safety risks (Self-injury, constant elopement, pica)</option>
              </select>
            </div>

            {/* Caregivers in household */}
            <div>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Caregivers in Household:</label>
              <select 
                value={caregiverCount} 
                onChange={(e) => setCaregiverCount(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '8px', fontSize: '0.85rem' }}
              >
                <option value="two">Two or more caregivers</option>
                <option value="single">Single Parent / Sole Caregiver</option>
              </select>
            </div>

            {/* Sleep issues checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0' }}>
              <input 
                type="checkbox" 
                id="sleepIssues" 
                checked={hasSleepIssues}
                onChange={(e) => setHasSleepIssues(e.target.checked)}
              />
              <label htmlFor="sleepIssues" style={{ fontWeight: 500, cursor: 'pointer' }}>
                Child has severe chronic sleep issues
              </label>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.06)', margin: '0.5rem 0' }} />

            {/* Simulation result output */}
            <div style={{ 
              padding: '1rem', 
              borderRadius: '10px', 
              backgroundColor: 'rgba(99, 102, 241, 0.03)',
              border: `1px solid rgba(99, 102, 241, 0.1)`
            }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-light)' }}>
                Estimated Assessment Output:
              </span>
              <strong style={{ display: 'block', fontSize: '1.25rem', color: estimation.color, margin: '0.2rem 0' }}>
                {estimation.hours}
              </strong>
              <span style={{ fontWeight: 600, display: 'block', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                {estimation.verdict}
              </span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.4rem', lineHeight: '1.4', margin: '0.4rem 0 0 0' }}>
                {estimation.explanation}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
