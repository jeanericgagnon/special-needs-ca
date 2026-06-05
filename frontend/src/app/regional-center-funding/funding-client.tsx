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
  Check,
  TrendingUp,
  Trash2
} from 'lucide-react';
import { 
  DDS_SERVICE_CODES, 
  EMAIL_TEMPLATES, 
  calculateRespiteTier, 
  compileJustificationBulletPoints,
  REGIONAL_CENTER_METRICS,
  STATEWIDE_AVERAGES
} from '@/lib/funding-data';
import CopyButton from '@/components/copy-button';
import PrintButton from '@/components/print-button';
import { getCaregiverProfileAction } from '../dashboard/child-actions';

export default function FundingClient() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'calculator' | 'appeals' | 'disparities' | 'sdp'>('catalog');
  const [selectedCenterId, setSelectedCenterId] = useState<string>('fdlrc');

  // SDP States
  const [posSpend, setPosSpend] = useState<number>(18500);
  const [oneTimeDeductions, setOneTimeDeductions] = useState<number>(0);
  const [fmsModel, setFmsModel] = useState<'bill-payer' | 'sole-employer' | 'co-employer'>('bill-payer');
  
  interface UnmetNeed {
    id: string;
    name: string;
    costType: 'hourly' | 'flat';
    hourlyRate: number;
    hoursPerWeek: number;
    durationWeeks: number;
    flatAmount: number;
  }

  const [unmetNeeds, setUnmetNeeds] = useState<UnmetNeed[]>([
    {
      id: 'unmet-1',
      name: 'Independent Facilitator (SDP Transition Support)',
      costType: 'flat',
      hourlyRate: 0,
      hoursPerWeek: 0,
      durationWeeks: 0,
      flatAmount: 2500
    },
    {
      id: 'unmet-2',
      name: 'Social Skills Summer Camp (Socialization Need)',
      costType: 'hourly',
      hourlyRate: 35,
      hoursPerWeek: 20,
      durationWeeks: 8,
      flatAmount: 0
    }
  ]);

  const [newNeedName, setNewNeedName] = useState('');
  const [newNeedCostType, setNewNeedCostType] = useState<'hourly' | 'flat'>('flat');
  const [newNeedHourlyRate, setNewNeedHourlyRate] = useState<number>(30);
  const [newNeedHoursPerWeek, setNewNeedHoursPerWeek] = useState<number>(10);
  const [newNeedDurationWeeks, setNewNeedDurationWeeks] = useState<number>(52);
  const [newNeedFlatAmount, setNewNeedFlatAmount] = useState<number>(1000);

  const [sdpCommunity, setSdpCommunity] = useState<number>(5000);
  const [sdpRespite, setSdpRespite] = useState<number>(10000);
  const [sdpTherapies, setSdpTherapies] = useState<number>(4000);
  const [sdpEquipment, setSdpEquipment] = useState<number>(3000);

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
  const selectedTemplateId = 'req-respite';
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

  const selectedCenter = REGIONAL_CENTER_METRICS.find(c => c.id === selectedCenterId) || REGIONAL_CENTER_METRICS[0];

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

    setTimeout(() => {
      setCustomSubject(subjectText);
      setCustomBody(bodyText);
    }, 0);
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

  // Load from local storage and database
  useEffect(() => {
    // 1. Fetch database caregiver values
    getCaregiverProfileAction()
      .then(res => {
        if (res.success && res.profile) {
          if (res.profile.name) setParentName(res.profile.name);
          if (res.profile.phone) setParentPhone(res.profile.phone);
        } else {
          const savedParentName = localStorage.getItem('funding_parent_name');
          const savedParentPhone = localStorage.getItem('funding_parent_phone');
          if (savedParentName) setParentName(savedParentName);
          if (savedParentPhone) setParentPhone(savedParentPhone);
        }
      })
      .catch(() => {
        const savedParentName = localStorage.getItem('funding_parent_name');
        const savedParentPhone = localStorage.getItem('funding_parent_phone');
        if (savedParentName) setParentName(savedParentName);
        if (savedParentPhone) setParentPhone(savedParentPhone);
      });

    // 2. Load child profile and SDP simulation data from localStorage
    setTimeout(() => {
      const savedChildName = localStorage.getItem('funding_child_name');
      const savedChildDob = localStorage.getItem('funding_child_dob');
      const savedCoordName = localStorage.getItem('funding_coordinator_name');

      if (savedChildName) setChildName(savedChildName);
      if (savedChildDob) setChildDob(savedChildDob);
      if (savedCoordName) setCoordinatorName(savedCoordName);

      const savedPosSpend = localStorage.getItem('sdp_pos_spend');
      const savedOneTimeDeductions = localStorage.getItem('sdp_onetime_deductions');
      const savedFmsModel = localStorage.getItem('sdp_fms_model');
      const savedUnmetNeeds = localStorage.getItem('sdp_unmet_needs');
      const savedSdpCommunity = localStorage.getItem('sdp_community');
      const savedSdpRespite = localStorage.getItem('sdp_respite');
      const savedSdpTherapies = localStorage.getItem('sdp_therapies');
      const savedSdpEquipment = localStorage.getItem('sdp_equipment');

      if (savedPosSpend) setPosSpend(parseInt(savedPosSpend));
      if (savedOneTimeDeductions) setOneTimeDeductions(parseInt(savedOneTimeDeductions));
      if (savedFmsModel) setFmsModel(savedFmsModel as 'bill-payer' | 'sole-employer' | 'co-employer');
      if (savedUnmetNeeds) {
        try {
          setUnmetNeeds(JSON.parse(savedUnmetNeeds));
        } catch {
          // ignore
        }
      }
      if (savedSdpCommunity) setSdpCommunity(parseInt(savedSdpCommunity));
      if (savedSdpRespite) setSdpRespite(parseInt(savedSdpRespite));
      if (savedSdpTherapies) setSdpTherapies(parseInt(savedSdpTherapies));
      if (savedSdpEquipment) setSdpEquipment(parseInt(savedSdpEquipment));
    }, 0);
  }, []);

  useEffect(() => {
    localStorage.setItem('sdp_pos_spend', posSpend.toString());
  }, [posSpend]);

  useEffect(() => {
    localStorage.setItem('sdp_onetime_deductions', oneTimeDeductions.toString());
  }, [oneTimeDeductions]);

  useEffect(() => {
    localStorage.setItem('sdp_fms_model', fmsModel);
  }, [fmsModel]);

  useEffect(() => {
    localStorage.setItem('sdp_unmet_needs', JSON.stringify(unmetNeeds));
  }, [unmetNeeds]);

  useEffect(() => {
    localStorage.setItem('sdp_community', sdpCommunity.toString());
  }, [sdpCommunity]);

  useEffect(() => {
    localStorage.setItem('sdp_respite', sdpRespite.toString());
  }, [sdpRespite]);

  useEffect(() => {
    localStorage.setItem('sdp_therapies', sdpTherapies.toString());
  }, [sdpTherapies]);

  useEffect(() => {
    localStorage.setItem('sdp_equipment', sdpEquipment.toString());
  }, [sdpEquipment]);

  const compileSdpProposal = () => {
    const unmetNeedsTotal = unmetNeeds.reduce((acc, need) => {
      return acc + (need.costType === 'flat' ? need.flatAmount : need.hourlyRate * need.hoursPerWeek * need.durationWeeks);
    }, 0);
    const individualBudget = posSpend + unmetNeedsTotal - oneTimeDeductions;
    const fmsFee = fmsModel === 'bill-payer' ? 1800 : fmsModel === 'sole-employer' ? 2400 : 3000;
    const allocatedTotal = sdpCommunity + sdpRespite + sdpTherapies + sdpEquipment + fmsFee;
    const remainingBudget = individualBudget - allocatedTotal;

    let unmetNeedsListText = unmetNeeds.map((need, idx) => {
      const cost = need.costType === 'flat' ? need.flatAmount : (need.hourlyRate * need.hoursPerWeek * need.durationWeeks);
      const detail = need.costType === 'flat' 
        ? `$${cost.toLocaleString()} (Flat Cost)`
        : `$${cost.toLocaleString()} ($${need.hourlyRate}/hr @ ${need.hoursPerWeek} hrs/wk for ${need.durationWeeks} wks)`;
      return `${idx + 1}. ${need.name}: ${detail}`;
    }).join('\n');

    if (unmetNeeds.length === 0) {
      unmetNeedsListText = 'None specified.';
    }

    return `SELF-DETERMINATION PROGRAM (SDP) BUDGET & SPENDING PLAN PROPOSAL
Consumer Name: ${childName} (DOB: ${childDob ? new Date(childDob + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'})
Regional Center: ${selectedCenter.name}
Parent Caregiver: ${parentName}
Proposal Compiled: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

I. PROPOSED INDIVIDUAL BUDGET FORMULATION (W&I Code § 4685.8(n))
1. Base 12-Month Historical POS Expenditures: $${posSpend.toLocaleString()}
2. Adjustments (Unmet Needs & Changes in Circumstance):
${unmetNeedsListText}
   - Total Unmet Needs Adjustments: $${unmetNeedsTotal.toLocaleString()}
3. Deductions (Non-recurring One-Time services): -$${oneTimeDeductions.toLocaleString()}
TOTAL PROPOSED INDIVIDUAL BUDGET (IB): $${individualBudget.toLocaleString()}

II. PROPOSED SPENDING PLAN ALLOCATION (W&I Code § 4685.8(r))
Allocated across standard SDP Service Categories:
- Category A: Employment & Community Integration: $${sdpCommunity.toLocaleString()}
- Category B: Personal Assistance & In-Home Respite: $${sdpRespite.toLocaleString()}
- Category C: Therapeutic, Clinical & Medical Services: $${sdpTherapies.toLocaleString()}
- Category D: Equipment, Technology & Home Adaptations: $${sdpEquipment.toLocaleString()}
- Category E: FMS Administrative Fee (${fmsModel === 'bill-payer' ? 'Bill Payer' : fmsModel === 'sole-employer' ? 'Sole Employer' : 'Co-Employer'} Model): $${fmsFee.toLocaleString()} ($${(fmsFee/12).toFixed(0)}/mo)

TOTAL PROPOSED SPENDING PLAN: $${allocatedTotal.toLocaleString()}
REMAINING UNALLOCATED BALANCE: $${remainingBudget.toLocaleString()}

LEGAL AGENDA SUBMISSION:
Under Welfare and Institutions Code Section 4685.8, Regional Centers must assist consumers in participating in the Self-Determination Program, including the calculation of the Individual Budget and verification of the Spending Plan. The family requests the adoption of this spending plan at the upcoming IPP meeting.`;
  };

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

        <button
          onClick={() => setActiveTab('disparities')}
          className={`tab-btn ${activeTab === 'disparities' ? 'active' : ''}`}
          style={{
            background: activeTab === 'disparities' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: activeTab === 'disparities' ? '#ffffff' : 'var(--text-main)',
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
          <TrendingUp size={18} />
          POS Disparity Analyzer
        </button>

        <button
          onClick={() => setActiveTab('sdp')}
          className={`tab-btn ${activeTab === 'sdp' ? 'active' : ''}`}
          style={{
            background: activeTab === 'sdp' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: activeTab === 'sdp' ? '#ffffff' : 'var(--text-main)',
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
          <Sparkles size={18} />
          SDP Budget Planner
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
              <label style={{ fontSize: '0.8rem' }}>Child&apos;s Nickname</label>
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
                  <span style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary-color)', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
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
              Historically suspended in 2009, <strong>Social Recreation, Specialized Camps, and Non-Medical Therapies</strong> were fully restored by the California Legislature in 2021 (Welfare & Institutions Code § 4648.5). If your service coordinator tells you they &quot;do not fund summer camps&quot; or &quot;do not cover swim lessons,&quot; they are citing outdated guidelines. Ensure you bring up these codes to fund socialization groups.
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
            <div className="glass-panel" style={{ padding: '1.75rem', border: '2px solid var(--primary-color)', background: 'rgba(var(--primary-rgb), 0.02)' }}>
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
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Demand a Written &quot;Notice of Action&quot; (NOA)</h3>
                    <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                      Service coordinators often say &quot;No, we don&apos;t fund that&quot; verbally or over the phone. <strong>A verbal denial is legally invalid.</strong> Under Welfare & Institutions Code § 4710.5, any denial, reduction, or termination of services must be issued in writing. Demand a written Notice of Action.
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
                      Once you receive the written NOA, you have exactly <strong>30 calendar days</strong> to file an appeal. If the regional center is attempting to cut/reduce existing services and you file the appeal within <strong>10 days</strong>, your services will continue uninterrupted during the appeal (&quot;Aid Paid Pending&quot;).
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
                      If mediation fails, you will go to a **Fair Hearing** (administered by the California Office of Administrative Hearings). You will present evidence (school IEP records, private therapy logs, doctor notes, safety statements) to prove the requested service is necessary to support your child&apos;s developmental disability.
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
                In California, **Disability Rights California (DRC)** and the **Office of Clients&apos; Rights Advocacy (OCRA)** provide free legal assistance and representation for Regional Center appeals.
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

      {activeTab === 'disparities' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }} className="iep-grid-layout">
          
          {/* Left Column: Data Comparisons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Center Selector Panel */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <TrendingUp size={22} color="var(--primary-color)" />
                Regional Center Disparity & Spending Analyzer
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                Compare your local California Regional Center&apos;s average Purchase of Service (POS) spending, respite hour allocations, and staffing utilization rates against statewide averages.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '0.5rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="rc-select" style={{ fontWeight: 600 }}>Select Regional Center</label>
                  <select
                    id="rc-select"
                    value={selectedCenterId}
                    onChange={(e) => setSelectedCenterId(e.target.value)}
                    style={{ padding: '0.65rem 0.85rem' }}
                  >
                    {REGIONAL_CENTER_METRICS.map(rc => (
                      <option key={rc.id} value={rc.id}>{rc.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600 }}>Counties Covered:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{selectedCenter.counties}</span>
                </div>
              </div>
            </div>

            {/* Visual Meters Grid */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                Performance & Allocation Metrics
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* 1. POS Spending */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>Average Annual Spending Per Client (Age 0-21)</strong>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-light)' }}>
                      <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>${selectedCenter.avgPosSpend.toLocaleString()}</strong> vs State Average (${STATEWIDE_AVERAGES.avgPosSpend.toLocaleString()})
                    </span>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '8px', height: '16px', overflow: 'hidden', display: 'flex', position: 'relative' }}>
                    <div 
                      style={{ 
                        background: 'var(--primary-color)', 
                        width: `${Math.min(100, (selectedCenter.avgPosSpend / 20000) * 100)}%`, 
                        height: '100%', 
                        borderRadius: '8px 0 0 8px',
                        transition: 'width 0.5s ease-out' 
                      }} 
                    />
                    <div 
                      style={{ 
                        position: 'absolute', 
                        left: `${(STATEWIDE_AVERAGES.avgPosSpend / 20000) * 100}%`, 
                        top: 0, 
                        bottom: 0, 
                        width: '3px', 
                        background: '#ef4444', 
                        zIndex: 10 
                      }} 
                      title="State Average Mark"
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                    <span>$0</span>
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>State Avg: $14.1k</span>
                    <span>$20k+</span>
                  </div>
                </div>

                {/* 2. Respite Hours */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>Average Respite Hours Authorized (Monthly)</strong>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-light)' }}>
                      <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{selectedCenter.avgRespiteHours} hrs</strong> vs State Average ({STATEWIDE_AVERAGES.avgRespiteHours} hrs)
                    </span>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '8px', height: '16px', overflow: 'hidden', display: 'flex', position: 'relative' }}>
                    <div 
                      style={{ 
                        background: '#3b82f6', 
                        width: `${Math.min(100, (selectedCenter.avgRespiteHours / 40) * 100)}%`, 
                        height: '100%', 
                        borderRadius: '8px 0 0 8px',
                        transition: 'width 0.5s ease-out' 
                      }} 
                    />
                    <div 
                      style={{ 
                        position: 'absolute', 
                        left: `${(STATEWIDE_AVERAGES.avgRespiteHours / 40) * 100}%`, 
                        top: 0, 
                        bottom: 0, 
                        width: '3px', 
                        background: '#ef4444', 
                        zIndex: 10 
                      }} 
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                    <span>0 hrs</span>
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>State Avg: 23 hrs</span>
                    <span>40+ hrs</span>
                  </div>
                </div>

                {/* 3. Respite Staffing Utilization */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>Staffing Utilization Rate (Authorized vs Delivered)</strong>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-light)' }}>
                      <strong style={{ color: selectedCenter.utilizationRate < 45 ? '#f59e0b' : 'var(--text-main)', fontSize: '1rem' }}>{selectedCenter.utilizationRate}%</strong> of hours staffed
                    </span>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '8px', height: '16px', overflow: 'hidden', display: 'flex', position: 'relative' }}>
                    <div 
                      style={{ 
                        background: selectedCenter.utilizationRate < 45 ? '#f59e0b' : '#10b981', 
                        width: `${selectedCenter.utilizationRate}%`, 
                        height: '100%', 
                        borderRadius: '8px 0 0 8px',
                        transition: 'width 0.5s ease-out' 
                      }} 
                    />
                    <div 
                      style={{ 
                        position: 'absolute', 
                        left: `${STATEWIDE_AVERAGES.utilizationRate}%`, 
                        top: 0, 
                        bottom: 0, 
                        width: '3px', 
                        background: '#ef4444', 
                        zIndex: 10 
                      }} 
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                    <span>0% (No staffing)</span>
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>State Avg: 50%</span>
                    <span>100% (Fully staffed)</span>
                  </div>
                  {selectedCenter.utilizationRate < 45 && (
                    <div style={{ marginTop: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.78rem', color: '#b91c1c', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                      <ShieldAlert size={14} />
                      <span><strong>Critical Staffing Alert:</strong> Extreme provider shortage in this region. 1 in 2 families fail to find respite workers to cover authorized hours.</span>
                    </div>
                  )}
                </div>

                {/* Regional Center specific context explanation */}
                <div style={{ background: 'rgba(0,0,0,0.01)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Audit & Equity Analysis</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4', margin: 0 }}>
                    {selectedCenter.context}
                  </p>
                </div>

              </div>
            </div>

            {/* Custom Interactive Advocacy Script Builder */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                  <Mail size={18} color="var(--primary-color)" />
                  Generate Disparity-Based Respite Script
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <CopyButton 
                    text={`Subject: Request for In-Home Respite Hours Review - ${childName} (DOB: ${childDob})\n\nDear Coordinator,\n\nI am writing to request a reassessment of our monthly In-Home Respite Care hours. We are currently authorized for hours below the statewide averages, and we are experiencing severe difficulties securing agency-staffed hours.\n\nSpecifically, statistics for our regional center, ${selectedCenter.name}, indicate an average Monthly Respite authorization of ${selectedCenter.avgRespiteHours} hours, with a utilization rate of only ${selectedCenter.utilizationRate}%. Because of these severe vendor staffing shortages, our authorized agency hours are frequently left unstaffed, compounding caregiver burnout.\n\nUnder Welfare and Institutions Code Section 4648, the Regional Center is obligated to provide individualized services to meet our needs. Given that the local agency cannot staff our hours, I request that the Regional Center authorize Self-Directed Respite (Service Code 896) and increase our monthly hours to match the state guidelines, allowing our family to recruit and hire our own care provider directly.\n\nThank you,\n${parentName}`} 
                    size={16} 
                  />
                  <PrintButton />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(0,0,0,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                <div><strong>Subject:</strong> Request for In-Home Respite Hours Review - {childName}</div>
                <div style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', fontSize: '0.85rem', color: '#555' }}>
                  Dear {coordinatorName || 'Service Coordinator'},
                  {"\n\n"}
                  I am writing to request a reassessment of our monthly In-Home Respite Care hours. We are currently authorized for hours below the statewide averages, and we are experiencing severe difficulties securing agency-staffed hours.
                  {"\n\n"}
                  Specifically, statistics for our regional center, <strong>{selectedCenter.name}</strong>, indicate an average Monthly Respite authorization of <strong>{selectedCenter.avgRespiteHours} hours</strong>, with a utilization rate of only <strong>{selectedCenter.utilizationRate}%</strong>. Because of these severe vendor staffing shortages, our authorized agency hours are frequently left unstaffed, compounding caregiver burnout.
                  {"\n\n"}
                  Under Welfare and Institutions Code Section 4648, the Regional Center is obligated to provide individualized services to meet our needs. Given that the local agency cannot staff our hours, I request that the Regional Center authorize <strong>Self-Directed Respite (Service Code 896)</strong> and increase our monthly hours to match the state guidelines, allowing our family to recruit and hire our own care provider directly.
                  {"\n\n"}
                  Thank you,
                  {"\n"}
                  {parentName}
                  {"\n"}
                  {parentPhone}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column Sidebar: Disparity Advocacy Guidance */}
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                ⚖️ Legal Leverage: W&I § 4648
              </h4>
              <p style={{ lineHeight: '1.4', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                California law requires that services are individualized. Under Welfare & Institutions Code § 4648, regional centers must purchase services from any provider if it is necessary to fulfill the IPP goals.
              </p>
              <p style={{ lineHeight: '1.4', color: 'var(--text-light)' }}>
                If your coordinator claims there is an &quot;agency cap&quot; or they &quot;cannot authorize more due to budget,&quot; remind them that <strong>individualized need overrides regional center fiscal policies</strong>.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                ✊ SB 1095 Equity Protections
              </h4>
              <p style={{ lineHeight: '1.4', color: 'var(--text-light)' }}>
                SB 1095 enforces strict DDS reporting requirements on service disparities. Each Regional Center is legally mandated to publish annual reports detailing their POS spending differences between racial/ethnic groups and language barriers. Bringing up these transparency reports in IPP meetings is a powerful way to demand equitable funding.
              </p>
            </div>
            
          </div>

        </div>
      )}

      {/* ----------------- TAB 5: SELF-DETERMINATION PROGRAM (SDP) ----------------- */}
      {activeTab === 'sdp' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }} className="iep-grid-layout animate-fade-in">
          
          {/* Left Column: Budget & Spending Plan Builders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Budget Formulation */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                <Calculator size={20} color="var(--primary-color)" /> SDP Individual Budget Formulation
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                Calculate your proposed SDP Individual Budget (IB) by inputting your prior 12 months of traditional services POS expenditures and adding unmet needs or changes in circumstances.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Historical POS spend */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Prior 12-Month POS Expenditures</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Total spent by Regional Center on services under traditional model.</span>
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <input
                      type="number"
                      min="0"
                      value={posSpend}
                      onChange={(e) => setPosSpend(Math.max(0, parseInt(e.target.value) || 0))}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Unmet Needs List */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Adjustments & Unmet Needs</h3>
                  
                  {unmetNeeds.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>No unmet needs listed. Add one below.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {unmetNeeds.map(need => {
                        const cost = need.costType === 'flat' ? need.flatAmount : (need.hourlyRate * need.hoursPerWeek * need.durationWeeks);
                        return (
                          <div 
                            key={need.id} 
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              background: 'rgba(0,0,0,0.02)', 
                              padding: '0.75rem 1rem', 
                              borderRadius: '10px', 
                              border: '1px solid rgba(0,0,0,0.05)' 
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <strong style={{ fontSize: '0.88rem', display: 'block' }}>{need.name}</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                {need.costType === 'flat' 
                                  ? 'Flat Cost' 
                                  : `$${need.hourlyRate}/hr × ${need.hoursPerWeek} hrs/wk × ${need.durationWeeks} weeks`}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                ${cost.toLocaleString()}
                              </span>
                              <button
                                type="button"
                                onClick={() => setUnmetNeeds(prev => prev.filter(n => n.id !== need.id))}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add Unmet Need Form */}
                  <div style={{ background: 'rgba(var(--primary-rgb), 0.03)', border: '1px dashed rgba(var(--primary-rgb), 0.2)', padding: '1rem', borderRadius: '12px' }}>
                    <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.75rem' }}>
                      ➕ Add Unmet Care Need / Circumstance Change
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.75rem' }}>Service or Resource Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Specialized Swim Safety Lessons"
                          value={newNeedName}
                          onChange={(e) => setNewNeedName(e.target.value)}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        />
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: '0.75rem' }}>Cost Type</label>
                          <select
                            value={newNeedCostType}
                            onChange={(e) => setNewNeedCostType(e.target.value as 'hourly' | 'flat')}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                          >
                            <option value="flat">Flat Cost</option>
                            <option value="hourly">Hourly Rate</option>
                          </select>
                        </div>
                        {newNeedCostType === 'flat' ? (
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem' }}>Flat Amount ($)</label>
                            <input
                              type="number"
                              value={newNeedFlatAmount}
                              onChange={(e) => setNewNeedFlatAmount(Math.max(0, parseInt(e.target.value) || 0))}
                              style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                            />
                          </div>
                        ) : (
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem' }}>Hourly Rate ($)</label>
                            <input
                              type="number"
                              value={newNeedHourlyRate}
                              onChange={(e) => setNewNeedHourlyRate(Math.max(0, parseInt(e.target.value) || 0))}
                              style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                            />
                          </div>
                        )}
                      </div>

                      {newNeedCostType === 'hourly' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem' }}>Hours / Week</label>
                            <input
                              type="number"
                              value={newNeedHoursPerWeek}
                              onChange={(e) => setNewNeedHoursPerWeek(Math.max(0, parseFloat(e.target.value) || 0))}
                              style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                            />
                          </div>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem' }}>Duration (Weeks)</label>
                            <input
                              type="number"
                              value={newNeedDurationWeeks}
                              onChange={(e) => setNewNeedDurationWeeks(Math.max(0, parseInt(e.target.value) || 0))}
                              style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (!newNeedName.trim()) return;
                          const newNeed: UnmetNeed = {
                            id: `unmet-${Date.now()}`,
                            name: newNeedName,
                            costType: newNeedCostType,
                            hourlyRate: newNeedHourlyRate,
                            hoursPerWeek: newNeedHoursPerWeek,
                            durationWeeks: newNeedDurationWeeks,
                            flatAmount: newNeedFlatAmount
                          };
                          setUnmetNeeds(prev => [...prev, newNeed]);
                          setNewNeedName('');
                        }}
                        className="btn-primary"
                        style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                      >
                        Add Adjustments
                      </button>
                    </div>
                  </div>
                </div>

                {/* One time deductions */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>One-Time Deductions (-)</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Non-recurring service costs to subtract from historical spend.</span>
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <input
                      type="number"
                      min="0"
                      value={oneTimeDeductions}
                      onChange={(e) => setOneTimeDeductions(Math.max(0, parseInt(e.target.value) || 0))}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Spending Plan Builder */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                <Sparkles size={20} color="var(--primary-color)" /> Proposed SDP Spending Plan
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                Draft your spending plan. Allocate your proposed budget across the standard DDS service categories. The FMS monthly fee is automatically allocated from your budget.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* FMS Selector */}
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>
                    Financial Management Services (FMS) Model
                  </label>
                  <select
                    value={fmsModel}
                    onChange={(e) => setFmsModel(e.target.value as 'bill-payer' | 'sole-employer' | 'co-employer')}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', fontSize: '0.88rem' }}
                  >
                    <option value="bill-payer">Bill Payer Model (~$150/mo | $1,800/yr)</option>
                    <option value="sole-employer">Sole Employer Model (~$200/mo | $2,400/yr)</option>
                    <option value="co-employer">Co-Employer Model (~$250/mo | $3,000/yr)</option>
                  </select>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem', lineHeight: 1.3 }}>
                    FMS is legally mandated to process payments and handle employer duties under SDP. FMS fees are paid out of your Individual Budget.
                  </p>
                </div>

                {/* Allocations Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem' }}>
                  
                  {/* Community Integration */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Community Integration & Social Recreation</label>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>${sdpCommunity.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={Math.max(sdpCommunity, posSpend + unmetNeeds.reduce((acc, need) => acc + (need.costType === 'flat' ? need.flatAmount : need.hourlyRate * need.hoursPerWeek * need.durationWeeks), 0) - oneTimeDeductions)}
                      step="100"
                      value={sdpCommunity}
                      onChange={(e) => setSdpCommunity(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>camps, social groups, sports lessons, community integration</span>
                  </div>

                  {/* Respite & Personal Care */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Personal Assistance & In-Home Respite</label>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>${sdpRespite.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={Math.max(sdpRespite, posSpend + unmetNeeds.reduce((acc, need) => acc + (need.costType === 'flat' ? need.flatAmount : need.hourlyRate * need.hoursPerWeek * need.durationWeeks), 0) - oneTimeDeductions)}
                      step="100"
                      value={sdpRespite}
                      onChange={(e) => setSdpRespite(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>self-hired respite workers, 1:1 behavior aides, personal assistants</span>
                  </div>

                  {/* Clinical & Therapeutic */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Therapeutic, Clinical & Medical Services</label>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>${sdpTherapies.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={Math.max(sdpTherapies, posSpend + unmetNeeds.reduce((acc, need) => acc + (need.costType === 'flat' ? need.flatAmount : need.hourlyRate * need.hoursPerWeek * need.durationWeeks), 0) - oneTimeDeductions)}
                      step="100"
                      value={sdpTherapies}
                      onChange={(e) => setSdpTherapies(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>private speech therapy, specialized sensory OT, behavior consulting</span>
                  </div>

                  {/* Equipment & Adaptations */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Equipment, Technology & Adaptations</label>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>${sdpEquipment.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={Math.max(sdpEquipment, posSpend + unmetNeeds.reduce((acc, need) => acc + (need.costType === 'flat' ? need.flatAmount : need.hourlyRate * need.hoursPerWeek * need.durationWeeks), 0) - oneTimeDeductions)}
                      step="100"
                      value={sdpEquipment}
                      onChange={(e) => setSdpEquipment(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>sensory swings, communication tablets/AAC apps, safety fences</span>
                  </div>

                </div>

              </div>
            </div>

            {/* Advocacy Letter / Proposal Display */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Proposed Spending Plan Document</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <CopyButton text={compileSdpProposal()} size={16} />
                  <PrintButton />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                <div style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', fontSize: '0.8rem', color: '#555' }}>
                  {compileSdpProposal()}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Calculations Breakdown & Tips */}
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Individual Budget Card */}
            {(() => {
              const unmetNeedsTotal = unmetNeeds.reduce((acc, need) => {
                return acc + (need.costType === 'flat' ? need.flatAmount : need.hourlyRate * need.hoursPerWeek * need.durationWeeks);
              }, 0);
              const individualBudget = posSpend + unmetNeedsTotal - oneTimeDeductions;
              const fmsFee = fmsModel === 'bill-payer' ? 1800 : fmsModel === 'sole-employer' ? 2400 : 3000;
              const allocatedTotal = sdpCommunity + sdpRespite + sdpTherapies + sdpEquipment + fmsFee;
              const remainingBudget = individualBudget - allocatedTotal;
              const isOverAllocated = remainingBudget < 0;

              return (
                <>
                  <div className="glass-panel" style={{ padding: '1.75rem', border: '2px solid var(--primary-color)', background: 'rgba(var(--primary-rgb), 0.02)' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-color)', letterSpacing: '0.04em' }}>
                      Proposed Individual Budget
                    </span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '0.25rem', marginBottom: '1rem' }}>
                      Total: <span style={{ color: 'var(--primary-color)' }}>${individualBudget.toLocaleString()}</span>
                    </h3>

                    {/* Progress Meter */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                        <span>Allocated: ${(allocatedTotal).toLocaleString()}</span>
                        <span>{Math.round((allocatedTotal / Math.max(1, individualBudget)) * 100) || 0}%</span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(0,0,0,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${Math.min(100, (allocatedTotal / Math.max(1, individualBudget)) * 100) || 0}%`, 
                          background: isOverAllocated ? '#ef4444' : allocatedTotal === individualBudget ? '#10b981' : 'var(--primary-color)', 
                          height: '100%', 
                          transition: 'width 0.2s' 
                        }} />
                      </div>
                    </div>

                    <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '0.75rem 1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1rem' }}>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 600 }}>Unallocated Balance</span>
                      <span style={{ 
                        display: 'block', 
                        fontSize: '1.25rem', 
                        fontWeight: 700, 
                        color: isOverAllocated ? '#ef4444' : remainingBudget === 0 ? '#10b981' : 'var(--text-main)', 
                        marginTop: '0.1rem' 
                      }}>
                        {isOverAllocated ? `-$${Math.abs(remainingBudget).toLocaleString()}` : `$${remainingBudget.toLocaleString()}`}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Prior POS History:</span>
                        <strong>${posSpend.toLocaleString()}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Unmet Needs Addition:</span>
                        <strong style={{ color: '#10b981' }}>+${unmetNeedsTotal.toLocaleString()}</strong>
                      </div>
                      {oneTimeDeductions > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>One-Time Deductions:</span>
                          <strong style={{ color: '#ef4444' }}>-${oneTimeDeductions.toLocaleString()}</strong>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                        <span>FMS Annual Fee:</span>
                        <strong>${fmsFee.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Over-allocation Alerts */}
                  {isOverAllocated && (
                    <div className="glass-panel animate-fade-in" style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <ShieldAlert size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ fontSize: '0.78rem', color: '#b91c1c', margin: 0, lineHeight: 1.4 }}>
                        <strong>Over-allocation Warning:</strong> Your spending plan allocations exceed your Individual Budget. Reduce your sliders to balance your spending plan.
                      </p>
                    </div>
                  )}

                  {remainingBudget === 0 && (
                    <div className="glass-panel animate-fade-in" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <Check size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ fontSize: '0.78rem', color: '#047857', margin: 0, lineHeight: 1.4 }}>
                        <strong>Balanced Plan:</strong> Your Spending Plan is fully allocated! This is a perfect configuration to submit to your Service Coordinator.
                      </p>
                    </div>
                  )}
                </>
              );
            })()}

            {/* SDP Informative Card */}
            <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>💡 Self-Determination (W&I § 4685.8)</h4>
              <p style={{ lineHeight: '1.4', color: 'var(--text-light)', margin: 0 }}>
                Under California law, the Self-Determination Program gives you the freedom to choose your own providers. Your budget is determined by your previous 12-month spending, plus any unmet needs or changes in circumstances. Bring this spending plan draft to your IPP review to justify funding changes.
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
