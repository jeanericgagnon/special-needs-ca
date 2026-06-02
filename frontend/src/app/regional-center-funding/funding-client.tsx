'use client';

import { useState, useEffect } from 'react';
import { 
  Calculator, 
  BookOpen, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  FileCheck,
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { 
  DDS_SERVICE_CODES, 
  EMAIL_TEMPLATES, 
  calculateRespiteTier, 
  compileJustificationBulletPoints 
} from '@/lib/funding-data';
import CopyButton from '@/components/copy-button';
import PrintButton from '@/components/print-button';
import ShareButton from '@/components/share-button';

export default function FundingClient() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'calculator' | 'appeals'>('catalog');

  // Input states for Coordinator Request builder & Estimator Letter
  const [parentName, setParentName] = useState('Sarah Jenkins');
  const [parentPhone, setParentPhone] = useState('(555) 019-2834');
  const [childName, setChildName] = useState('Liam');
  const [childDob, setChildDob] = useState('2018-05-12');
  const [coordinatorName, setCoordinatorName] = useState('Jane Doe');

  // Respite Quiz Answers
  const [safetyScore, setSafetyScore] = useState<number>(0);
  const [sleepScore, setSleepScore] = useState<number>(0);
  const [medicalScore, setMedicalScore] = useState<number>(0);
  const [behaviorScore, setBehaviorScore] = useState<number>(0);

  // Active custom Email Template selected
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('req-respite');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');

  // Calculate respite outputs based on scores
  const respiteResults = calculateRespiteTier({
    safety: safetyScore,
    sleep: sleepScore,
    medical: medicalScore,
    behavior: behaviorScore
  });

  const justificationBullets = compileJustificationBulletPoints({
    safety: safetyScore,
    sleep: sleepScore,
    medical: medicalScore,
    behavior: behaviorScore
  });

  // Re-compile email template content when input state changes
  useEffect(() => {
    const template = EMAIL_TEMPLATES.find(t => t.id === selectedTemplateId);
    if (!template) return;

    let bodyText = template.body;
    let subjectText = template.subject;

    // Fills templates using active inputs
    const placeholders: Record<string, string> = {
      coordinator_name: coordinatorName,
      child_name: childName,
      child_dob: childDob,
      parent_name: parentName,
      parent_phone: parentPhone,
      respite_code: '862 (Agency) / 896 (Self-Directed)',
      requested_hours: respiteResults.suggestedHours.split(' ')[0], // Extract start range e.g. "20"
      care_justification: justificationBullets,
      program_name: 'Specialized Summer Day Camp',
      program_cost: '$250 per week',
      socialization_needs: `- Struggles with initiating play and cooperative sharing with peers.\n- Has high elopement risk in public environments, needing a 1:1 aide.\n- Requires structured sensory regulation breaks during active games.`,
      discussion_date: 'yesterday\'s meeting',
      requested_service: `${respiteResults.suggestedHours.split(' ')[0]} hours of monthly In-Home Respite Care`
    };

    Object.entries(placeholders).forEach(([key, val]) => {
      bodyText = bodyText.replace(new RegExp(`{{${key}}}`, 'g'), val);
      subjectText = subjectText.replace(new RegExp(`{{${key}}}`, 'g'), val);
    });

    setCustomSubject(subjectText);
    setCustomBody(bodyText);
  }, [
    selectedTemplateId, 
    parentName, 
    parentPhone, 
    childName, 
    childDob, 
    coordinatorName, 
    safetyScore, 
    sleepScore, 
    medicalScore, 
    behaviorScore,
    respiteResults.suggestedHours,
    justificationBullets
  ]);

  // Load from local storage
  useEffect(() => {
    const savedParentName = localStorage.getItem('funding_parent_name');
    const savedParentPhone = localStorage.getItem('funding_parent_phone');
    const savedChildName = localStorage.getItem('funding_child_name');
    const savedChildDob = localStorage.getItem('funding_child_dob');
    const savedCoordName = localStorage.getItem('funding_coordinator_name');

    if (savedParentName) setParentName(savedParentName);
    if (savedParentPhone) setParentPhone(savedParentPhone);
    if (savedChildName) setChildName(savedChildName);
    if (savedChildDob) setChildDob(savedChildDob);
    if (savedCoordName) setCoordinatorName(savedCoordName);
  }, []);

  // Save changes helper
  const handleConfigChange = (key: string, val: string) => {
    if (key === 'parentName') { setParentName(val); localStorage.setItem('funding_parent_name', val); }
    if (key === 'parentPhone') { setParentPhone(val); localStorage.setItem('funding_parent_phone', val); }
    if (key === 'childName') { setChildName(val); localStorage.setItem('funding_child_name', val); }
    if (key === 'childDob') { setChildDob(val); localStorage.setItem('funding_child_dob', val); }
    if (key === 'coordinatorName') { setCoordinatorName(val); localStorage.setItem('funding_coordinator_name', val); }
  };

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '6rem' }}>
      
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Calculator size={36} color="var(--primary-color)" style={{ verticalAlign: 'middle' }} />
          DDS Regional Center Funding Portal
        </h1>
        <p style={{ maxWidth: '750px', margin: '1rem auto 0 auto', fontSize: '1.1rem' }}>
          Demystifying California Department of Developmental Services (DDS) authorizations. Estimate respite care hours, draft justification request letters, and navigate Lanterman Act appeals.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }} className="no-print">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
          style={{
            background: activeTab === 'catalog' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: activeTab === 'catalog' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid var(--glass-border)',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <BookOpen size={18} />
          Service Codes Explainer
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
          style={{
            background: activeTab === 'calculator' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: activeTab === 'calculator' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid var(--glass-border)',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <Calculator size={18} />
          Respite Hours Calculator
        </button>

        <button
          onClick={() => setActiveTab('appeals')}
          className={`tab-btn ${activeTab === 'appeals' ? 'active' : ''}`}
          style={{
            background: activeTab === 'appeals' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: activeTab === 'appeals' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid var(--glass-border)',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <ShieldAlert size={18} />
          Denials & Appeals Guide
        </button>
      </div>

      {/* Main Form Fields Persistent Panel for custom letters */}
      {(activeTab === 'calculator' || activeTab === 'appeals') && (
        <div className="glass-panel no-print" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-color)', letterSpacing: '0.04em', marginBottom: '1rem' }}>
            📋 Pre-fill Coordinator Request Parameters
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>Parent Caregiver Name</label>
              <input 
                type="text" 
                value={parentName} 
                onChange={(e) => handleConfigChange('parentName', e.target.value)}
                style={{ padding: '0.6rem 0.85rem', fontSize: '0.9rem' }}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>Parent Phone Number</label>
              <input 
                type="text" 
                value={parentPhone} 
                onChange={(e) => handleConfigChange('parentPhone', e.target.value)}
                style={{ padding: '0.6rem 0.85rem', fontSize: '0.9rem' }}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>Child\'s Nickname</label>
              <input 
                type="text" 
                value={childName} 
                onChange={(e) => handleConfigChange('childName', e.target.value)}
                style={{ padding: '0.6rem 0.85rem', fontSize: '0.9rem' }}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>Child DOB</label>
              <input 
                type="date" 
                value={childDob} 
                onChange={(e) => handleConfigChange('childDob', e.target.value)}
                style={{ padding: '0.6rem 0.85rem', fontSize: '0.9rem' }}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>Service Coordinator Name</label>
              <input 
                type="text" 
                value={coordinatorName} 
                onChange={(e) => handleConfigChange('coordinatorName', e.target.value)}
                style={{ padding: '0.6rem 0.85rem', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 1: CATALOG ----------------- */}
      {activeTab === 'catalog' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {DDS_SERVICE_CODES.map(item => (
              <div key={item.code} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                    Code {item.code}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)' }}>{item.category}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{item.name}</h3>
                
                <p style={{ fontSize: '0.88rem', fontStyle: 'italic', background: 'rgba(0,0,0,0.01)', padding: '0.5rem 0.75rem', borderRadius: '8px', borderLeft: '3px solid rgba(0,0,0,0.08)' }}>
                  <strong>Parent translation:</strong> {item.parentSummary}
                </p>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.5rem' }}>
                  <strong>Who qualifies:</strong> <p style={{ fontSize: '0.85rem', margin: '0.1rem 0 0.5rem 0' }}>{item.qualifyingCriteria}</p>
                  <strong>Typical limits:</strong> <p style={{ fontSize: '0.85rem', margin: '0.1rem 0 0 0' }}>{item.typicalAuthLimits}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Restored Social Rec Callout Banner */}
          <div className="glass-panel" style={{ borderLeft: '6px solid var(--primary-color)', padding: '1.5rem 2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--primary-color)" />
              Lanterman Act Update: Restoration of Social Rec & Camps
            </h3>
            <p style={{ fontSize: '0.92rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
              Historically suspended in 2009, <strong>Social Recreation, Specialized Camps, and Non-Medical Therapies</strong> were fully restored by the California Legislature in 2021 (Welfare & Institutions Code § 4648.5). If your service coordinator tells you they "do not fund summer camps" or "do not cover swim lessons," they are citing outdated guidelines. Ensure you bring up these codes to fund socialization groups.
            </p>
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: CALCULATOR ----------------- */}
      {activeTab === 'calculator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }} className="iep-grid-layout">
          
          {/* Left Quiz & Letter Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Quiz panel */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Calculator size={22} color="var(--primary-color)" />
                Respite Allocation Assessment
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Q1: Safety */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.98rem' }}>1. Safety Supervision & Elopement Risk</label>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>Score: {safetyScore} / 5</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>Does the child run away from safe boundaries (elopement), eat non-food items (pica), self-injure, or display no danger awareness?</p>
                  <input 
                    type="range" 
                    min="0" 
                    max="5" 
                    value={safetyScore} 
                    onChange={(e) => setSafetyScore(parseInt(e.target.value))}
                    style={{ cursor: 'pointer', accentColor: 'var(--primary-color)', margin: '0.5rem 0' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                    <span>0: Age-appropriate safety</span>
                    <span>3: Moderate oversight</span>
                    <span>5: Constant 1:1 watch (dangerous)</span>
                  </div>
                </div>

                {/* Q2: Sleep */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.98rem' }}>2. Sleep Disturbances & Night Waking</label>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>Score: {sleepScore} / 4</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>Does the child wake frequently at night or have severe insomnia, requiring caregivers to stay awake to supervise and prevent damage or injury?</p>
                  <input 
                    type="range" 
                    min="0" 
                    max="4" 
                    value={sleepScore} 
                    onChange={(e) => setSleepScore(parseInt(e.target.value))}
                    style={{ cursor: 'pointer', accentColor: 'var(--primary-color)', margin: '0.5rem 0' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                    <span>0: Sleeps through night</span>
                    <span>2: Wakes 1-2 times</span>
                    <span>4: Wakes 3+ times / hours of supervision</span>
                  </div>
                </div>

                {/* Q3: Medical & Self-Care */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.98rem' }}>3. Medical Fragility & Physical Care Needs</label>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>Score: {medicalScore} / 4</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>Does the child require G-tube feeding, suctioning, catheter care, seizure tracking, or full assistance with diapering/toileting past age-typical thresholds?</p>
                  <input 
                    type="range" 
                    min="0" 
                    max="4" 
                    value={medicalScore} 
                    onChange={(e) => setMedicalScore(parseInt(e.target.value))}
                    style={{ cursor: 'pointer', accentColor: 'var(--primary-color)', margin: '0.5rem 0' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                    <span>0: Independent in self-care</span>
                    <span>2: Wiping/diaper support</span>
                    <span>4: Intense medical tasks / complete care</span>
                  </div>
                </div>

                {/* Q4: Behaviors */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.98rem' }}>4. Behavioral Support Needs & Physical Aggression</label>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>Score: {behaviorScore} / 4</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>Does the child exhibit frequent aggressive meltdowns (hitting, biting, screaming), severe tantrums, or destruction of property?</p>
                  <input 
                    type="range" 
                    min="0" 
                    max="4" 
                    value={behaviorScore} 
                    onChange={(e) => setBehaviorScore(parseInt(e.target.value))}
                    style={{ cursor: 'pointer', accentColor: 'var(--primary-color)', margin: '0.5rem 0' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                    <span>0: Normal tantrums</span>
                    <span>2: Meltdowns multiple times/week</span>
                    <span>4: Daily aggression / severe outbursts</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Request template script view */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                  <Mail size={18} color="var(--primary-color)" />
                  Generated Service Request Letter
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CopyButton text={`Subject: ${customSubject}\n\n${customBody}`} size={16} />
                  <PrintButton />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(0,0,0,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                  <strong>Subject:</strong> {customSubject}
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'inherit' }}>
                  {customBody}
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar - Score Outcome */}
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.75rem', border: '2px solid var(--primary-color)', background: 'rgba(99, 102, 241, 0.02)' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-color)', letterSpacing: '0.04em' }}>
                Assessment Output
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                Calculated Support Tier: <span style={{ color: 'var(--primary-color)' }}>{respiteResults.tier}</span>
              </h3>
              
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.25rem' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>Suggested Respite Allocation</span>
                <span style={{ display: 'block', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {respiteResults.suggestedHours}
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', lineHeight: '1.4', color: 'var(--text-main)' }}>
                {respiteResults.summary}
              </p>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', marginTop: '1rem', paddingTop: '1rem', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                <strong>How to request:</strong> Copy the letter below, adjust details, and email it directly to your service coordinator to request an IPP meeting.
              </div>
            </div>

            {/* Quick guide card */}
            <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>💡 IPP Statutory Timelines</h4>
              <p style={{ lineHeight: '1.4', color: 'var(--text-light)' }}>
                According to CA Welfare & Institutions Code § 4646(c), the Regional Center must hold a meeting to review or amend the IPP within <strong>30 days</strong> of your written request. Always email your coordinator to establish a clear paper trail.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ----------------- TAB 3: APPEALS ----------------- */}
      {activeTab === 'appeals' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }} className="iep-grid-layout">
          
          {/* Left Appeals Guide */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Step-by-Step guide */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <ShieldAlert size={22} color="var(--primary-color)" />
                What to Do If Denied: The Lanterman Appeal Pathway
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="appeals-timeline">
                
                {/* Step 1 */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                  <div style={{ background: 'var(--primary-color)', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    1
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Demand a Written "Notice of Action" (NOA)</h3>
                    <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                      Service coordinators often say "No, we don\'t fund that" verbally or over the phone. <strong>A verbal denial is legally invalid.</strong> Under Welfare & Institutions Code § 4710.5, any denial, reduction, or termination of services must be issued in writing. Demand a written Notice of Action.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem' }}>
                  <div style={{ background: 'var(--primary-color)', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    2
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>File the Appeal Request Within 30 Days</h3>
                    <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                      Once you receive the written NOA, you have exactly <strong>30 calendar days</strong> to file an appeal. If the regional center is attempting to cut/reduce existing services and you file the appeal within <strong>10 days</strong>, your services will continue uninterrupted during the appeal ("Aid Paid Pending").
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem' }}>
                  <div style={{ background: 'var(--primary-color)', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    3
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Request an Informal Meeting or Mediation</h3>
                    <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                      After filing, you can choose to hold an **Informal Meeting** with a Regional Center supervisor, or proceed to **Mediation** (where an independent administrative law judge helps negotiate a solution). Many denials are settled here without going to a full trial.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem' }}>
                  <div style={{ background: 'var(--primary-color)', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    4
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Attend the Fair Hearing</h3>
                    <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                      If mediation fails, you will go to a **Fair Hearing** (administered by the California Office of Administrative Hearings). You will present evidence (school IEP records, private therapy logs, doctor notes, safety statements) to prove the requested service is necessary to support your child\'s developmental disability.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Written NOA Request Email block */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                  <FileCheck size={18} color="var(--primary-color)" />
                  Notice of Action (NOA) Request Script
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CopyButton text={`Subject: Formal Request for Written Notice of Action (NOA) - ${childName}\n\n${EMAIL_TEMPLATES.find(t => t.id === 'appeal-denial')?.body.replace('{{coordinator_name}}', coordinatorName).replace('{{discussion_date}}', 'our recent meeting').replace('{{requested_service}}', 'the requested hours').replace('{{child_name}}', childName).replace('{{parent_name}}', parentName).replace('{{parent_phone}}', parentPhone)}`} size={16} />
                  <PrintButton />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(0,0,0,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                <div>
                  <strong>Subject:</strong> Formal Request for Written Notice of Action (NOA) - {childName}
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'inherit' }}>
                  {EMAIL_TEMPLATES.find(t => t.id === 'appeal-denial')?.body
                    .replace('{{coordinator_name}}', coordinatorName)
                    .replace('{{discussion_date}}', 'our recent discussion')
                    .replace('{{requested_service}}', 'the requested hours')
                    .replace('{{child_name}}', childName)
                    .replace('{{parent_name}}', parentName)
                    .replace('{{parent_phone}}', parentPhone)
                  }
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar - Support contacts */}
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                ⚖️ Free Legal Support
              </h4>
              <p style={{ lineHeight: '1.4', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                In California, **Disability Rights California (DRC)** and the **Office of Clients\' Rights Advocacy (OCRA)** provide free legal assistance and representation for Regional Center appeals.
              </p>
              <a 
                href="https://www.disabilityrightsca.org" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
              >
                Visit Disability Rights CA <ArrowRight size={12} />
              </a>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>⌛ Timeline Note</h4>
              <p style={{ lineHeight: '1.4', color: 'var(--text-light)' }}>
                If you file an appeal of a service decrease within **10 days** of receiving a written NOA, the law guarantees you continue receiving the service until the appeal is fully resolved. Do not miss this window.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Hidden Print Container for layout printing */}
      <div className="print-expand" style={{ display: 'none' }}>
        <h1 style={{ color: 'black', background: 'none', WebkitTextFillColor: 'initial', fontSize: '26pt', margin: '0 0 5px 0' }}>
          DDS Regional Center Request Pack
        </h1>
        <p style={{ fontSize: '11pt', color: '#555', margin: '0 0 20px 0' }}>
          Prepared for consumer <strong>{childName}</strong> (DOB: {childDob}) | Case Manager: {coordinatorName}
        </p>

        <h2 style={{ fontSize: '16pt', borderBottom: '2px solid #333', paddingBottom: '3px', marginTop: '20px' }}>
          Estimated Respite Care Evaluation
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
              <th style={{ padding: '6px', fontSize: '10pt' }}>Assessment Area</th>
              <th style={{ padding: '6px', width: '20%', fontSize: '10pt' }}>Parent Score</th>
              <th style={{ padding: '6px', width: '60%', fontSize: '10pt' }}>Documented Care Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Safety Supervision</td>
              <td style={{ padding: '8px' }}>{safetyScore} / 5</td>
              <td style={{ padding: '8px', fontSize: '9.5pt' }}>
                {safetyScore >= 4 ? 'Severe danger or elopement concerns. Requires active visual checks.' : safetyScore >= 2 ? 'Lacks safety awareness. Needs continuous verbal redirection.' : 'Age appropriate.'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Sleep Disruption</td>
              <td style={{ padding: '8px' }}>{sleepScore} / 4</td>
              <td style={{ padding: '8px', fontSize: '9.5pt' }}>
                {sleepScore >= 3 ? 'Child wakes multiple times nightly, keeping parents awake and creating fatigue risk.' : sleepScore >= 1 ? 'Needs assistance falling asleep or brief nighttime checking.' : 'Sleeps through.'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Medical & Physical Needs</td>
              <td style={{ padding: '8px' }}>{medicalScore} / 4</td>
              <td style={{ padding: '8px', fontSize: '9.5pt' }}>
                {medicalScore >= 3 ? 'Requires diapering past typical age, or medically complex procedures (G-tube, seizures).' : 'Standard physical skills.'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Behavior Support</td>
              <td style={{ padding: '8px' }}>{behaviorScore} / 4</td>
              <td style={{ padding: '8px', fontSize: '9.5pt' }}>
                {behaviorScore >= 3 ? 'Exhibits severe meltdowns or physical aggression, placing load on parents.' : 'Typical boundaries.'}
              </td>
            </tr>
            <tr style={{ borderTop: '2px solid #333', fontWeight: 'bold' }}>
              <td style={{ padding: '8px' }}>Summary Evaluation</td>
              <td style={{ padding: '8px' }}>Score: {respiteResults.score}</td>
              <td style={{ padding: '8px' }}>
                Recommended Tier: {respiteResults.tier} ({respiteResults.suggestedHours})
              </td>
            </tr>
          </tbody>
        </table>

        <h2 style={{ fontSize: '16pt', borderBottom: '2px solid #333', paddingBottom: '3px', marginTop: '30px' }}>
          Formal Lanterman Act Request
        </h2>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', marginTop: '10px', pageBreakInside: 'avoid' }}>
          <h3 style={{ fontSize: '12pt', margin: '0 0 5px 0' }}>Draft Request Letter (IPP Review Agenda)</h3>
          <p style={{ whiteSpace: 'pre-wrap', fontSize: '10pt', lineHeight: '1.5', margin: 0 }}>
            {customBody}
          </p>
        </div>

        <div style={{ marginTop: '40px', fontSize: '9pt', color: '#777', borderTop: '1px solid #ccc', paddingTop: '10px', textAlign: 'center' }}>
          Under California law (Lanterman Developmental Disabilities Services Act, Welfare & Institutions Code § 4500 et seq.), the state has a statutory obligation to provide services and supports to enable individuals with developmental disabilities to live independently in the community.
        </div>
      </div>

    </main>
  );
}
