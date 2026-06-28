'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, AlertTriangle, ShieldAlert, PhoneCall, Copy, FileText, 
  ChevronRight, Play, Sparkles, Download, CheckSquare 
} from 'lucide-react';
import { getIhssMonthlyEstimate, getIhssWageDisclosure } from '@/lib/ihssWageDisclosure';

interface IhssMiniProductProps {
  diagnosisName: string;
  initialCountyId?: string;
  initialCountyName?: string;
  initialWage?: number | null;
  initialPhone?: string;
  initialAddress?: string;
  countiesList?: { id: string; name: string }[];
}

const STATIC_COUNTIES: Record<string, { phone: string; address: string }> = {
  'los-angeles': {
    phone: '(888) 944-4477',
    address: '2707 S. Grand Ave, Los Angeles, CA 90007'
  },
  'orange': {
    phone: '(714) 825-3000',
    address: '1505 E Warner Ave, Santa Ana, CA 92705'
  },
  'alameda': {
    phone: '(510) 577-1800',
    address: '6955 Foothill Blvd, Oakland, CA 94605'
  },
  'san-francisco': {
    phone: '(415) 557-5262',
    address: '1650 Mission St, San Francisco, CA 94103'
  }
};

function hasUsableOfficeValue(value?: string | null) {
  const text = String(value || '').trim();
  if (!text) return false;
  if (/local county dpss intake office/i.test(text)) return false;
  if (/still being verified/i.test(text)) return false;
  return true;
}

export default function IhssMiniProduct({
  diagnosisName,
  initialCountyId = '',
  initialCountyName = '',
  initialWage = null,
  initialPhone = '',
  initialAddress = '',
  countiesList = []
}: IhssMiniProductProps) {
  // Navigation tabs
  const [activeSubTab, setActiveSubTab] = useState<'check' | 'roadmap' | 'scripts' | 'docs'>('check');

  // County selection state (for dropdown on generic page)
  const [selectedCountyId, setSelectedCountyId] = useState<string>(initialCountyId || 'los-angeles');
  
  // Resolve active county details
  const activeCountyId = initialCountyId || selectedCountyId;
  const activeCountyName = initialCountyName || 
    (countiesList.find(c => c.id === activeCountyId)?.name || 
     activeCountyId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

  const wageDisclosure = getIhssWageDisclosure('california', activeCountyId, activeCountyName, initialWage ?? null);
  const staticCountyDetails = STATIC_COUNTIES[activeCountyId];
  const countyPhone = staticCountyDetails?.phone || (hasUsableOfficeValue(initialPhone) ? initialPhone : null);
  const countyAddress = staticCountyDetails?.address || (hasUsableOfficeValue(initialAddress) ? initialAddress : null);
  const countyDetails = {
    phone: countyPhone,
    address: countyAddress,
    wage: wageDisclosure?.hourlyRate ?? initialWage ?? null
  };

  // Safety Screener questionnaire states
  const [age, setAge] = useState<string>('5');
  const [behaviors, setBehaviors] = useState({
    elopement: false,
    pica: false,
    selfInjury: false,
    climbing: false,
    electrical: false,
    streetSafety: false
  });
  const [screenSubmitted, setScreenSubmitted] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedLog, setCopiedLog] = useState(false);

  const toggleBehavior = (key: keyof typeof behaviors) => {
    setBehaviors(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Eligibility calculation
  const getFitAssessment = () => {
    const ageNum = parseFloat(age) || 0;
    const checkedCount = Object.values(behaviors).filter(Boolean).length;

    if (ageNum < 2) {
      return {
        rating: 'Lower fit',
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.05)',
        text: `Children under 2 years old are less likely to fit common Protective Supervision patterns. Counties usually expect infants this age to need close supervision regardless of diagnosis. Your child may still be assessed for basic care hours such as feeding or bathing support.`
      };
    }

    if (checkedCount >= 2) {
      return {
        rating: 'Higher fit',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.05)',
        text: `Based on your child's age (${ageNum}) and safety concerns (${checkedCount} checked), this pattern may support a stronger Protective Supervision request. If the county agrees with the documented risks, families may see hour ranges like 195 to 283 per month, but county decisions vary case by case.`
        
      };
    }

    if (checkedCount === 1) {
      return {
        rating: 'Moderate fit',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.05)',
        text: `With 1 checked behavior, the county may still review Protective Supervision, but families usually need strong documentation such as IEP goals, clinician notes, and a safety incident log showing why constant intervention is needed.`
      };
    }

    return {
      rating: 'Limited fit',
      color: '#6b7280',
      bg: 'rgba(107, 114, 128, 0.05)',
      text: `Protective Supervision requires active, dangerous behaviors due to cognitive delays. If your child is fully mobile but does not display safety risks, they will likely be denied Protective Supervision, but can still receive basic care hours.`
    };
  };

  const fitAssessment = getFitAssessment();
  const estimatedHours = Object.values(behaviors).filter(Boolean).length >= 2 ? 283 : (Object.values(behaviors).filter(Boolean).length === 1 ? 195 : 45);
  const monthlyCompensation = getIhssMonthlyEstimate(wageDisclosure, estimatedHours);

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyLog = () => {
    const template = `24-HOUR SAFETY INCIDENT LOG TEMPLATE
Date: [Insert Date]
Child's Name: [Insert Name] (Age: ${age}, Diagnosis: ${diagnosisName})

INCIDENT LOG GRID:
Time | Dangerous Behavior | Immediate Action Taken by Caregiver | Result / Injury Avoided
-----------------------------------------------------------------------------------------
08:15 AM | Attempted to swallow standard Lego brick (Pica) | Physically pried mouth open to retrieve | Prevented choking hazard.
10:42 AM | Opened sliding door, ran toward driveway (Elopement) | Chased and blocked at gate | Prevented running into local street traffic.
02:10 PM | Climbed top of tall bookshelf in playroom | Caught child mid-air as they fell | Prevented severe head/limb fracture.
05:30 PM | Tried to stick metal fork into toaster socket | Grabbed hand, unplugged toaster | Prevented electrical shock.

NOTES FOR HOME VISIT SOCIAL WORKER:
- Child requires constant visual supervision during all waking hours.
- Behavior is non-self-directing and impulsive due to ${diagnosisName}.`;
    
    navigator.clipboard.writeText(template);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', padding: '2rem', marginTop: '2rem' }}>
      
      {/* Premium Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ 
            fontSize: '0.72rem', 
            fontWeight: 700, 
            color: 'var(--primary-color)', 
            background: 'rgba(var(--primary-rgb),0.08)', 
            padding: '0.2rem 0.5rem', 
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            marginBottom: '0.5rem'
          }}>
            <Sparkles size={11} /> California Caregiver Tool
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            IHSS Protective Supervision Mini-Guide
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: '0.2rem 0 0 0' }}>
            A source-backed planning tool to check fit, prepare an intake call, and draft logs for {diagnosisName}.
          </p>
        </div>

        {/* Local County Context Selection */}
        {!initialCountyId && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)' }}>Select California County</label>
            <select
              value={selectedCountyId}
              onChange={(e) => setSelectedCountyId(e.target.value)}
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.85rem',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.1)',
                background: '#fafafa',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              {countiesList.length > 0 ? (
                countiesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
              ) : (
                <>
                  <option value="los-angeles">Los Angeles County</option>
                  <option value="orange">Orange County</option>
                  <option value="alameda">Alameda County</option>
                  <option value="san-francisco">San Francisco</option>
                </>
              )}
            </select>
          </div>
        )}
      </div>

      {/* Navigation tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        <button 
          onClick={() => setActiveSubTab('check')}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            background: activeSubTab === 'check' ? 'var(--primary-color)' : 'transparent',
            color: activeSubTab === 'check' ? 'white' : 'var(--text-light)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          1. Answer & Safety Screener
        </button>
        <button 
          onClick={() => setActiveSubTab('roadmap')}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            background: activeSubTab === 'roadmap' ? 'var(--primary-color)' : 'transparent',
            color: activeSubTab === 'roadmap' ? 'white' : 'var(--text-light)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          2. Step-by-Step Roadmap
        </button>
        <button 
          onClick={() => setActiveSubTab('scripts')}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            background: activeSubTab === 'scripts' ? 'var(--primary-color)' : 'transparent',
            color: activeSubTab === 'scripts' ? 'white' : 'var(--text-light)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          3. Phone Scripts
        </button>
        <button 
          onClick={() => setActiveSubTab('docs')}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            background: activeSubTab === 'docs' ? 'var(--primary-color)' : 'transparent',
            color: activeSubTab === 'docs' ? 'white' : 'var(--text-light)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          4. Essential Documents
        </button>
      </div>

      {/* -------------------- TAB 1: SCREENER & ANSWER -------------------- */}
      {activeSubTab === 'check' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Left: The Answer Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(var(--primary-rgb),0.02)', border: '1px solid rgba(var(--primary-rgb),0.08)', padding: '1.25rem', borderRadius: '16px' }}>
                <strong style={{ fontSize: '1rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <CheckCircle size={16} /> The Answer
                </strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5', margin: 0 }}>
                  <strong>Maybe.</strong> A child with <strong>{diagnosisName}</strong> may qualify for California IHSS Protective Supervision if the county finds severe cognitive or behavioral safety risks that require constant monitoring.
                  The county may authorize a parent or relative provider arrangement when it documents that level of need and approves the provider setup.
                  {' '}In <strong>{activeCountyName}</strong>, we currently show {countyDetails.wage !== null ? <>a checked public county rate estimate of <strong>${countyDetails.wage.toFixed(2)}/hour estimate</strong></> : 'no county-specific rate estimate yet'}.
                  {' '}Actual approved hours and monthly pay depend on the county assessment, current local rate, and authorization.
                </p>
                {wageDisclosure && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: '1.45', margin: '0.6rem 0 0 0' }}>
                    <a href={wageDisclosure.sourceUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                      {wageDisclosure.sourceLabel}
                    </a>{' '}
                    • Confirm with{' '}
                    <a href={wageDisclosure.officialConfirmUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                      the official county IHSS office directory
                    </a>{' '}
                    • Last checked {wageDisclosure.lastVerifiedDate} • {wageDisclosure.explanation}
                  </p>
                )}
              </div>

              <div>
                <strong style={{ fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  What it means for your situation
                </strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                  Under CDSS MPP Section 30-757, Protective Supervision is granted to individuals with severe cognitive impairments (like Down Syndrome or Autism) who are &quot;non-self-directing.&quot; This means they cannot evaluate basic safety risks and engage in hazardous behaviors without realizing the danger. You must show that without your constant visual monitoring, they would likely injure themselves.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#fafafa', padding: '1rem', borderRadius: '12px', border: '1px solid #eee' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>📍 Local County Office Info:</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>🏢 <strong>{activeCountyName} County IHSS Intake</strong></span>
                {countyDetails.address ? (
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>📍 Address: {countyDetails.address}</span>
                ) : (
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                    📍 We are still verifying the current county IHSS office address for {activeCountyName}.
                  </span>
                )}
                {countyDetails.phone ? (
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 700 }}>
                    📞 Call to Apply: <a href={`tel:${countyDetails.phone.replace(/[^\d]/g, '')}`} style={{ textDecoration: 'underline' }}>{countyDetails.phone}</a>
                  </span>
                ) : (
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                    📞 We are still verifying the current county IHSS intake phone for {activeCountyName}. Confirm the latest local contact before relying on this tool.
                  </span>
                )}
              </div>
            </div>

            {/* Right: Screener Form */}
            <div style={{ background: '#fafafa', border: '1px solid #eee', padding: '1.5rem', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                <ShieldAlert size={18} color="var(--primary-color)" />
                Personalized Safety Check
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                Check the behaviors that apply to your child to estimate how closely the situation matches common Protective Supervision factors and possible hour ranges.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Age selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>Child&apos;s Age (Years)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="25" 
                    value={age} 
                    onChange={(e) => { setAge(e.target.value); setScreenSubmitted(false); }}
                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem', width: '80px' }}
                  />
                </div>

                {/* Checklist items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>Safety Risk Deficits:</label>
                  
                  <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <input type="checkbox" checked={behaviors.elopement} onChange={() => { toggleBehavior('elopement'); setScreenSubmitted(false); }} style={{ marginTop: '0.2rem', accentColor: 'var(--primary-color)' }} />
                    <div>
                      <strong>Elopement / Wandering:</strong> Runs toward driveways, streets, or escapes through doors/windows without warning.
                    </div>
                  </label>

                  <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <input type="checkbox" checked={behaviors.pica} onChange={() => { toggleBehavior('pica'); setScreenSubmitted(false); }} style={{ marginTop: '0.2rem', accentColor: 'var(--primary-color)' }} />
                    <div>
                      <strong>Pica / Ingestion Risk:</strong> Attempts to put small toys, coins, dirt, rocks, or chemicals into mouth/swallow.
                    </div>
                  </label>

                  <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <input type="checkbox" checked={behaviors.selfInjury} onChange={() => { toggleBehavior('selfInjury'); setScreenSubmitted(false); }} style={{ marginTop: '0.2rem', accentColor: 'var(--primary-color)' }} />
                    <div>
                      <strong>Self-Injurious Behaviors:</strong> Head-bangs, bites arms, or hits self when frustrated/overwhelmed.
                    </div>
                  </label>

                  <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <input type="checkbox" checked={behaviors.climbing} onChange={() => { toggleBehavior('climbing'); setScreenSubmitted(false); }} style={{ marginTop: '0.2rem', accentColor: 'var(--primary-color)' }} />
                    <div>
                      <strong>High Climbing / Falls:</strong> Attempts to climb tall bookcases, window sills, or counters, unaware of height danger.
                    </div>
                  </label>

                  <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <input type="checkbox" checked={behaviors.electrical} onChange={() => { toggleBehavior('electrical'); setScreenSubmitted(false); }} style={{ marginTop: '0.2rem', accentColor: 'var(--primary-color)' }} />
                    <div>
                      <strong>Stove & Electrical Play:</strong> Tries to dial hot stove burners, play with wall plugs, or keys in electrical sockets.
                    </div>
                  </label>

                  <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <input type="checkbox" checked={behaviors.streetSafety} onChange={() => { toggleBehavior('streetSafety'); setScreenSubmitted(false); }} style={{ marginTop: '0.2rem', accentColor: 'var(--primary-color)' }} />
                    <div>
                      <strong>Lack of Street Safety:</strong> Walks/runs directly into the street without looking for oncoming cars.
                    </div>
                  </label>
                </div>

                <button 
                  onClick={() => setScreenSubmitted(true)}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.5rem', width: '100%', height: '42px' }}
                >
                  <Play size={16} /> Run Eligibility Assessment
                </button>
              </div>

              {screenSubmitted && (
                <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: '12px', background: fitAssessment.bg, border: '1px solid', borderColor: fitAssessment.color }} className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Estimated fit for county review:</strong>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: fitAssessment.color, textTransform: 'uppercase' }}>
                      {fitAssessment.rating}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: '0 0 0.75rem 0', lineHeight: '1.4' }}>
                    {fitAssessment.text}
                  </p>

                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>
                      <span>Estimated Monthly Hours:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{estimatedHours} Hours</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      <span>Estimated Compensation:</span>
                      <strong style={{ color: '#10b981' }}>
                        {monthlyCompensation !== null
                          ? `$${monthlyCompensation.toLocaleString(undefined, { maximumFractionDigits: 0 })} / mo`
                          : 'Still verifying county rate'}
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-light)', margin: '0.45rem 0 0 0', lineHeight: 1.4 }}>
                      {monthlyCompensation !== null
                        ? `Uses the current county IHSS rate estimate for ${activeCountyName}. Confirm the latest county rate before relying on this amount.`
                        : `We are still verifying the current county IHSS rate for ${activeCountyName}. Confirm the latest county rate before relying on a monthly payout estimate.`}
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* -------------------- TAB 2: ROADMAP -------------------- */}
      {activeSubTab === 'roadmap' && (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ChevronRight size={20} color="var(--primary-color)" /> Action Checklist: How to Apply & Win
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Securing Protective Supervision takes preparation. Follow these 5 steps to successfully complete the county application.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ height: '28px', width: '28px', background: 'rgba(var(--primary-rgb),0.08)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                1
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', display: 'block', color: 'var(--text-main)' }}>Apply by Calling your County Office</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', lineHeight: '1.4', display: 'block', marginTop: '0.2rem' }}>
                  {countyDetails.phone ? (
                    <>Call the IHSS intake office for <strong>{activeCountyName} County</strong> at <strong>{countyDetails.phone}</strong>. Specify that you want to apply for In-Home Supportive Services for your child with {diagnosisName}. (See the phone script in the next tab for exactly what to say).</>
                  ) : (
                    <>We are still verifying the current IHSS intake phone for <strong>{activeCountyName} County</strong>. Use the county&apos;s published IHSS office listing before relying on the next step below.</>
                  )}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ height: '28px', width: '28px', background: 'rgba(var(--primary-rgb),0.08)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                2
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', display: 'block', color: 'var(--text-main)' }}>Obtain Pediatrician Signature on SOC 873</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', lineHeight: '1.4', display: 'block', marginTop: '0.2rem' }}>
                  The county generally sends Form SOC 873 (Medical Certification) after intake. Ask your child&apos;s pediatrician to review and sign it if it fits your child&apos;s current care needs, then confirm the county&apos;s current return window before relying on the deadline.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ height: '28px', width: '28px', background: 'rgba(var(--primary-rgb),0.08)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                3
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', display: 'block', color: 'var(--text-main)' }}>Draft Form SOC 821 & Safety Incident Log</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', lineHeight: '1.4', display: 'block', marginTop: '0.2rem' }}>
                  Request Form SOC 821 (Assessment of Need for Protective Supervision) to be completed by your doctor. Simultaneously, start a 24-hour log detailing every safety intervention you make (e.g. stopping them from running away, pulling them down from tall furniture, taking plastic toys out of their mouth).
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ height: '28px', width: '28px', background: 'rgba(var(--primary-rgb),0.08)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                4
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', display: 'block', color: 'var(--text-main)' }}>Prepare for the County Social Worker Home Visit</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', lineHeight: '1.4', display: 'block', marginTop: '0.2rem' }}>
                  A social worker will schedule a home visit. They will interview you and observe your child. Have your safety log, IEP, Regional Center IPP, and pediatrician letters printed and ready to hand to them. Show, rather than just tell, the safety modifications you have made to the house.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ height: '28px', width: '28px', background: 'rgba(var(--primary-rgb),0.08)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                5
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', display: 'block', color: 'var(--text-main)' }}>Receive the Notice of Action (NOA)</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', lineHeight: '1.4', display: 'block', marginTop: '0.2rem' }}>
                  If approved, you will receive a Notice of Action detailing your monthly hours. If the request is denied or reduced, review the deadline listed on your current notice before filing an appeal. You can generate an appeal letter template in the Appeals tab of this dashboard.
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- TAB 3: PHONE SCRIPTS -------------------- */}
      {activeSubTab === 'scripts' && (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PhoneCall size={20} color="var(--primary-color)" /> Intake Application Phone Script
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            When calling county offices, focus entirely on <strong>safety deficits and behavioral risks</strong>. Do not emphasize that your child is sweet or can do tasks independently; focus on their cognitive lack of safety awareness.
          </p>

          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eee', position: 'relative' }}>
            <button 
              onClick={() => handleCopyScript(`Hello, I'm calling to apply for In-Home Supportive Services (IHSS) on behalf of my child who has ${diagnosisName}. They are currently ${age} years old and may need Protective Supervision because they have severe cognitive safety deficits. Specifically, they have no safety awareness: they attempt to elope out of the house into traffic, eat non-food items, and climb high furniture without realizing they could fall. They require close visual monitoring to stay safe. Please mail me an application packet and let me know the current next steps for Form SOC 873.`)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: copiedScript ? '#10b981' : 'white',
                color: copiedScript ? 'white' : 'var(--text-main)',
                border: '1px solid #ddd',
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Copy size={12} /> {copiedScript ? 'Copied!' : 'Copy Script'}
            </button>

            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-color)', display: 'block', marginBottom: '0.5rem' }}>
              Script for Calling Intake{countyDetails.phone ? ` (${countyDetails.phone})` : ''}:
            </span>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: '1.6', margin: 0, paddingRight: '6rem' }}>
              &quot;Hello, I&apos;m calling to apply for In-Home Supportive Services (IHSS) on behalf of my child who has {diagnosisName}. They are currently {age} years old and may need <strong>Protective Supervision</strong> because they have severe cognitive safety deficits. Specifically, they have no safety awareness: they attempt to elope out of the house into traffic, eat non-food items, and climb high furniture without realizing they could fall. They require close visual monitoring to stay safe. Please mail me an application packet and let me know the current next steps for Form SOC 873.&quot;
            </p>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', background: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.15)', padding: '1rem', borderRadius: '12px' }}>
            <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <strong style={{ fontSize: '0.82rem', color: 'var(--text-main)', display: 'block' }}>CRITICAL TIP FOR COGNITIVE ASSESSMENT</strong>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: '0.1rem 0 0 0', lineHeight: '1.4' }}>
                If the intake worker or social worker asks: <em>&quot;Can your child walk or dress themselves?&quot;</em>, and they can, say yes but immediately add: <em>&quot;However, they are completely non-self-directing. They will wander out into traffic or pull a hot pot off the stove if unsupervised for even 30 seconds.&quot;</em> Do not let them downplay cognitive risks because your child is physically capable.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TAB 4: DOCUMENTS -------------------- */}
      {activeSubTab === 'docs' && (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={20} color="var(--primary-color)" /> Essential Documents to Win Protective Supervision
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Counties usually ask for documentary evidence before authorizing Protective Supervision. These 3 documents often carry the most weight.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            <div style={{ padding: '1.25rem', background: '#fafafa', borderRadius: '16px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-color)', background: 'rgba(var(--primary-rgb),0.08)', padding: '0.15rem 0.4rem', borderRadius: '4px', alignSelf: 'flex-start' }}>MANDATORY</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Form SOC 873: Medical Certification</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.4', margin: 0 }}>
                This is a 2-page medical form that must be completed and signed by your child&apos;s pediatrician. The doctor must check &quot;Yes&quot; indicating that your child has a severe mental impairment and requires 24/7 protective supervision. 
              </p>
              <a href="https://www.cdss.ca.gov/Portals/9/FMUD/Forms/Form-English/SOC873.pdf" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 700, textDecoration: 'underline', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                Download SOC 873 PDF <Download size={12} />
              </a>
            </div>

            <div style={{ padding: '1.25rem', background: '#fafafa', borderRadius: '16px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-color)', background: 'rgba(var(--primary-rgb),0.08)', padding: '0.15rem 0.4rem', borderRadius: '4px', alignSelf: 'flex-start' }}>RECOMMENDED</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Form SOC 821: Assessment of Need</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.4', margin: 0 }}>
                Form SOC 821 is specifically for Protective Supervision. The physician evaluates memory, orientation, and judgment. They must rate the child as &quot;severely impaired&quot; in at least one category to satisfy safety monitoring rules.
              </p>
              <a href="https://www.cdss.ca.gov/Portals/9/FMUD/Forms/Form-English/SOC821.pdf" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 700, textDecoration: 'underline', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                Download SOC 821 PDF <Download size={12} />
              </a>
            </div>

            <div style={{ padding: '1.25rem', background: '#fafafa', borderRadius: '16px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.08)', padding: '0.15rem 0.4rem', borderRadius: '4px', alignSelf: 'flex-start' }}>STRONGLY ADVISED</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>24-Hour Safety & Incident Log</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.4', margin: 0 }}>
                This is a log written by you showing exactly what your child did, the danger involved, and how you intervened. A 2-week log is usually sufficient to prove that the supervision needs are constant and exceed general parenting.
              </p>
              
              <button 
                onClick={handleCopyLog}
                style={{
                  marginTop: 'auto',
                  border: '1px solid var(--primary-color)',
                  background: copiedLog ? '#10b981' : 'white',
                  color: copiedLog ? 'white' : 'var(--primary-color)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <Copy size={12} /> {copiedLog ? 'Copied Log Template!' : 'Copy Safety Log Template'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Account Creation Promotion */}
      <div 
        style={{ 
          marginTop: '2rem', 
          borderTop: '1px solid rgba(0,0,0,0.05)', 
          paddingTop: '1.5rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.02) 0%, rgba(var(--primary-rgb), 0.05) 100%)',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(var(--primary-rgb), 0.08)'
        }}
      >
        <div>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckSquare size={16} color="var(--primary-color)" /> Need to Auto-Generate custom forms?
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: 0 }}>
            Create a free account to save your child&apos;s safety log, track county deadlines, and auto-populate formal appeals letters.
          </p>
        </div>
        <a href="/register" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ padding: '0 1rem', height: '36px', fontSize: '0.8rem', width: 'auto', marginTop: 0 }}>
            Save Safety Log & Form Builder
          </button>
        </a>
      </div>

    </div>
  );
}
