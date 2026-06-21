'use client';

import React, { useState, useEffect } from 'react';
import { 
  Coins, Shield, HelpCircle, CheckCircle2, 
  AlertTriangle, TrendingUp, BookOpen, Sparkles, Scale,
  Mail
} from 'lucide-react';
import CopyButton from '@/components/copy-button';
import PrintButton from '@/components/print-button';
import { getCaregiverProfileAction } from '../dashboard/child-actions';
import { stateConfigs } from '@/lib/stateConfigs';

export default function PlanningClient() {
  const [activeTab, setActiveTab] = useState<'shield' | 'deeming'>('shield');
  const [selectedState, setSelectedState] = useState<string>('california');
  const [hydrated, setHydrated] = useState(false);

  // Profile Cache States
  const [parentName, setParentName] = useState('Sarah Jenkins');
  const [parentPhone, setParentPhone] = useState('(555) 019-2834');
  const [childName, setChildName] = useState('Liam');
  const [childDob, setChildDob] = useState('2018-05-12');
  const [coordinatorName, setCoordinatorName] = useState('Jane Doe');

  // Load from profile cache on mount
  useEffect(() => {
    const savedState = localStorage.getItem('selected_state');
    const timer = setTimeout(() => {
      if (savedState) {
        setSelectedState(savedState);
      }
      setHydrated(true);
    }, 0);

    Promise.resolve().then(() => {
      // 1. First fetch database values
      getCaregiverProfileAction()
        .then(res => {
          if (res.success && res.profile) {
            if (res.profile.name) setParentName(res.profile.name);
            if (res.profile.phone) setParentPhone(res.profile.phone);
          } else {
            const savedParentName = localStorage.getItem('caregiver_name') || localStorage.getItem('funding_parent_name') || localStorage.getItem('ca_special_needs_safety_parent');
            const savedParentPhone = localStorage.getItem('caregiver_phone') || localStorage.getItem('funding_parent_phone');
            if (savedParentName) setParentName(savedParentName);
            if (savedParentPhone) setParentPhone(savedParentPhone);
          }
        })
        .catch(() => {
          const savedParentName = localStorage.getItem('caregiver_name') || localStorage.getItem('funding_parent_name') || localStorage.getItem('ca_special_needs_safety_parent');
          const savedParentPhone = localStorage.getItem('caregiver_phone') || localStorage.getItem('funding_parent_phone');
          if (savedParentName) setParentName(savedParentName);
          if (savedParentPhone) setParentPhone(savedParentPhone);
        });

      // 2. Load remaining local-only / child values
      const savedChildName = localStorage.getItem('child_name') || localStorage.getItem('iep_student_name') || localStorage.getItem('funding_child_name') || localStorage.getItem('ca_special_needs_safety_child');
      const savedChildDob = localStorage.getItem('child_dob') || localStorage.getItem('funding_child_dob');
      const savedCoordName = localStorage.getItem('funding_coordinator_name');

      if (savedChildName) setChildName(savedChildName);
      if (savedChildDob) setChildDob(savedChildDob);
      if (savedCoordName) setCoordinatorName(savedCoordName);
    });

    return () => clearTimeout(timer);
  }, []);

  const stateConfig = stateConfigs[selectedState] || stateConfigs['california'];

  const updateSelectedState = (val: string) => {
    setSelectedState(val);
    localStorage.setItem('selected_state', val);
  };

  // ----- TAB 1: ASSET SHIELD SIMULATOR STATES -----
  const [savingsAmount, setSavingsAmount] = useState(15000);
  const [fundingSource, setFundingSource] = useState<'parents' | 'inheritance' | 'child-injury'>('parents');
  const [expectedBalance, setExpectedBalance] = useState<'low' | 'mid' | 'high'>('mid');
  const [spendingTimeline, setSpendingTimeline] = useState<'immediate' | 'longterm' | 'mixed'>('mixed');

  // ----- TAB 2: DEEMING & CO-PAY STATES -----
  const [isRcClient, setIsRcClient] = useState<boolean>(true);
  const [hasDiagnosis, setHasDiagnosis] = useState<boolean>(true);
  const [majorLimitations, setMajorLimitations] = useState<number>(3); // Slider 0-7
  const [hasMedicalNeeds, setHasMedicalNeeds] = useState<boolean>(false);
  const [childMediCal, setChildMediCal] = useState<boolean>(false);

  // Family Cost Participation (FCPP) Inputs
  const [familySize, setFamilySize] = useState<number>(4);
  const [grossIncome, setGrossIncome] = useState<number>(135000);
  const [rcChildren, setRcChildren] = useState<number>(1);

  // Asset recommendation logic
  const getRecommendation = () => {
    const able = stateConfig.ableProgram || 'ABLE Account';
    const medicaid = stateConfig.medicaidName || 'Medicaid';
    const stateName = stateConfig.name || 'California';

    if (fundingSource === 'child-injury') {
      return {
        title: `First-Party Special Needs Trust (SNT) with optional ${able} wrapper`,
        desc: `Since funds belong directly to the child (e.g. lawsuit settlement or direct inheritance), a First-Party SNT is legally mandated to protect benefits. You can transfer up to $18,000 annually from the trust into a ${able} account to facilitate tax-free daily spending without trustee signatures.`,
        recoveryNote: 'Note: First-Party SNTs require a Medicaid state-recovery provision upon the beneficiary\'s passing.'
      };
    }

    if (expectedBalance === 'high' || fundingSource === 'inheritance') {
      return {
        title: `Third-Party Special Needs Trust (Master Trust) + ${able} account combination`,
        desc: `This is the gold-standard setup. For balances exceeding $100,000 or funds originating from extended family wills/wills, establish a Third-Party SNT. This protects the estate from Medicaid recovery. Supplement this by transferring funds into a ${able} account for daily disability expenditures (QDEs) to maximize flexibility.`,
        recoveryNote: 'Third-Party SNTs have no Medicaid clawback provisions. Unused funds pass directly to secondary heirs.'
      };
    }

    return {
      title: `Direct ${able} Account (Standalone)`,
      desc: `For expected savings under $100,000 primarily funded by parents or wages, a ${able} account is the most cost-effective and immediate tool. It takes 15 minutes to open online, carries minimal fees, and allows the child or parents to spend money directly using a debit card for Qualified Disability Expenses.`,
      recoveryNote: selectedState === 'california'
        ? 'California has outlawed Medicaid estate recovery on CalABLE accounts for residents, making it highly safe.'
        : `Many states protect ${able} accounts from Medicaid recovery, but rules vary. Consult ${stateConfig.stateMedicaidAgency || 'your state Medicaid agency'} guidelines.`
    };
  };

  const recommendation = getRecommendation();
  const exceedsSsiLimit = savingsAmount > 2000;
  const exceedsCalableSsiLimit = savingsAmount > 100000;

  // FPL & Fee Calculation logic
  const calculateFplInfo = () => {
    // 2026 CA Poverty Guidelines
    const baseFpl = 15060 + (familySize - 1) * 5380;
    const threshold400 = baseFpl * 4;
    const isExemptIncome = grossIncome < threshold400;
    
    let copayPct = 0;
    const fplRatio = (grossIncome / baseFpl) * 100;
    
    if (fplRatio >= 400 && fplRatio < 500) copayPct = 10;
    else if (fplRatio >= 500 && fplRatio < 600) copayPct = 20;
    else if (fplRatio >= 600 && fplRatio < 700) copayPct = 40;
    else if (fplRatio >= 700 && fplRatio < 800) copayPct = 60;
    else if (fplRatio >= 800 && fplRatio < 900) copayPct = 80;
    else if (fplRatio >= 900) copayPct = 100;
    
    // Adjust for multiple RC children
    if (rcChildren > 1 && copayPct > 0) {
      copayPct = Math.round(copayPct / 2);
    }
    
    // Child having Medi-Cal makes you FCPP / AFPF exempt!
    const isFullyExempt = isExemptIncome || childMediCal;

    return {
      baseFpl,
      threshold400: Math.round(threshold400),
      fplRatio: Math.round(fplRatio),
      copayPct: isFullyExempt ? 0 : copayPct,
      afpfFee: isFullyExempt ? 0 : 150,
      isFullyExempt
    };
  };

  const fplInfo = calculateFplInfo();

  // Deeming Screener recommendation logic
  const getDeemingRecommendation = () => {
    const catchment = stateConfig.catchmentName || 'Developmental Services Agency';
    const waiver = stateConfig.waiverProgram || 'HCBS Waiver';
    const medicaid = stateConfig.medicaidName || 'Medicaid';
    const stateName = stateConfig.name || 'California';

    if (selectedState !== 'california') {
      if (!isRcClient) {
        if (hasMedicalNeeds) {
          return {
            path: 'Home & Community-Based Services (HCBS) Waiver Pathway',
            desc: `Your child does not receive services from ${catchment}, but has complex medical/nursing needs. They may be a strong candidate for an HCBS Medical/Nursing Waiver. This waiver bypasses parental income, granting the child full ${medicaid}.`,
            action: `Contact ${stateConfig.stateMedicaidAgency || 'your state Medicaid agency'} to request an intake assessment for medical/nursing level of care waivers.`
          };
        }
        return {
          path: `${catchment} Intake Pathway`,
          desc: `Medicaid Waiver eligibility is primarily processed for clients of ${catchment}. To qualify, your child must first undergo an intake assessment to establish eligibility.`,
          action: `Request an intake assessment at the local **${stateConfig.ddAgency || 'developmental services agency'}** to initiate services.`
        };
      }

      if (majorLimitations >= 3 && hasDiagnosis) {
        return {
          path: `${waiver} (Institutional Deeming)`,
          desc: `Based on your child's active ${catchment} status and functional limitations in 3+ major life activities, they are highly eligible for the ${waiver} waiver. Parental income is 100% bypassed, granting the child full ${medicaid} regardless of family earnings.`,
          action: `Email your Service Coordinator or Caseworker directly and request the ${waiver} application packet. Once approved, the child qualifies for full ${medicaid} with no deeming of parental income.`
        };
      }

      return {
        path: `${catchment} Reassessment Pathway`,
        desc: `Institutional Deeming waiver eligibility requires the client to meet specific developmental level of care criteria, which generally includes functional limitations in at least 3 of 7 major life activities (self-care, communication, learning, mobility, self-direction, capacity for independent living, economic self-sufficiency).`,
        action: `Request a meeting with your coordinator or caseworker to discuss your child's limitations in communication, self-care, or safety supervision.`
      };
    }

    // Default California logic
    if (!isRcClient) {
      if (hasMedicalNeeds) {
        return {
          path: 'Home & Community-Based Alternatives (HCBA) Waiver Pathway',
          desc: 'Your child does not receive Regional Center services, but has complex medical/nursing needs. They are a strong candidate for the California HCBA Waiver (nursing level of care). This waiver completely bypasses parental income, giving the child full Medi-Cal.',
          action: 'Contact a local HCBA Waiver agency (e.g. Libertana, Partners in Care) in your county to request an intake assessment. Note: slots are capped and waitlisted.'
        };
      }
      return {
        path: 'Regional Center (Lanterman Act) Intake Pathway',
        desc: 'Institutional Deeming is primarily processed for active Regional Center clients. To qualify, your child must first undergo a Regional Center intake to establish Lanterman Act eligibility.',
        action: 'Request an intake assessment at your county\'s Regional Center. Diagnosis must originate before age 18 and constitute a substantial disability.'
      };
    }

    if (majorLimitations >= 3 && hasDiagnosis) {
      return {
        path: 'Lanterman Medicaid HCBS Waiver (Institutional Deeming)',
        desc: 'Based on your child\'s active Regional Center status and functional limitations in 3+ major life activities, they are highly eligible for the Lanterman Medicaid Waiver. Parental income is 100% bypassed, granting the child full Medi-Cal regardless of your family earnings.',
        action: 'Email your Service Coordinator directly and request the Medicaid Waiver Deeming packet. Once approved, the child qualifies for full Medi-Cal with zero parent premium copays.'
      };
    }

    return {
      path: 'Regional Center Reassessment Pathway',
      desc: 'Institutional Deeming requires the client to meet Intermediate Care Facility (ICF-DD) criteria, which includes functional limitations in at least 3 of 7 major life activities (self-care, communication, learning, mobility, self-direction, capacity for independent living, economic self-sufficiency).',
      action: 'Request an IPP meeting with your coordinator to discuss your child\'s escalating limitations in communication, self-care, or safety supervision.'
    };
  };

  const deemingRec = getDeemingRecommendation();

  const compileDeemingLetter = () => {
    const waiver = selectedState === 'california' 
      ? 'Lanterman Medicaid Waiver (Institutional Deeming)'
      : `${stateConfig.waiverProgram} (Institutional Deeming)`;

    const agency = stateConfig.catchmentName || 'Developmental Services Agency';
    const medicaid = stateConfig.medicaidName || 'Medicaid';

    const citationText = selectedState === 'california'
      ? 'Under federal and California DHCS guidelines, these limitations satisfy the ICF-DD level of care required for the HCBS Waiver.'
      : `Under federal guidelines and ${stateConfig.ddAgency || 'state'} rules, these limitations satisfy the developmental level of care required for the ${stateConfig.waiverProgram || 'HCBS Waiver'}.`;

    return `Subject: Request for Medicaid Waiver (Institutional Deeming) Enrollment - ${childName}

Dear ${coordinatorName || 'Service Coordinator'},

I hope this email finds you well. I am writing to request that ${agency} initiate the process to enroll my child, ${childName} (DOB: ${childDob}), in the ${waiver}.

As a client of ${agency}, ${childName} exhibits significant functional limitations in three or more major life activities (specifically in areas including self-care, self-direction, communication, and learning). ${citationText}

Enrollment in this waiver is crucial for our family as it bypasses parental income limitations, granting ${childName} eligibility for ${medicaid}. This will enable access to essential medical services, behavioral therapies, and equipment necessary for support in our home.

Please let me know what documentation is required to submit the Medicaid Waiver application packet.

Thank you,
${parentName}
${parentPhone}`;
  };

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '5rem', maxWidth: '1150px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Coins size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
        <h1>{selectedState === 'california' ? 'California' : stateConfig.name} Special Needs Financial & Benefit Planner</h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 1.5rem', color: 'var(--text-light)' }}>
          Protect your child&apos;s {stateConfig.medicaidName || 'Medicaid'} and SSI eligibility. Simulate asset limits, analyze cost sharing fees, and screen for Institutional Deeming income bypasses.
        </p>

        {/* State selector dropdown */}
        <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }} className="no-print">
          <select
            value={hydrated ? selectedState : 'california'}
            onChange={(e) => updateSelectedState(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1.25rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '12px',
              border: '1px solid var(--glass-border)',
              background: 'white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              outline: 'none',
              textAlign: 'center'
            }}
          >
            {Object.keys(stateConfigs).map((key) => (
              <option key={key} value={key}>
                {stateConfigs[key].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }} className="no-print">
        <button
          onClick={() => setActiveTab('shield')}
          className={`tab-btn ${activeTab === 'shield' ? 'active' : ''}`}
          style={{
            background: activeTab === 'shield' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: activeTab === 'shield' ? '#ffffff' : 'var(--text-main)',
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
          <Scale size={18} />
          Asset Shield Simulator ({stateConfig.ableProgram || 'ABLE'}/SNT)
        </button>

        <button
          onClick={() => setActiveTab('deeming')}
          className={`tab-btn ${activeTab === 'deeming' ? 'active' : ''}`}
          style={{
            background: activeTab === 'deeming' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: activeTab === 'deeming' ? '#ffffff' : 'var(--text-main)',
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
          <Scale size={18} />
          {stateConfig.medicaidName || 'Medicaid'} Deeming & {selectedState === 'california' ? 'Family Fees' : 'Cost Sharing'}
        </button>
      </div>

      {/* ----------------- TAB 1: ASSET SHIELD SIMULATOR ----------------- */}
      {activeTab === 'shield' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Simulator Panel */}
          <div className="glass-panel" style={{ padding: '2.5rem', background: 'rgba(255, 255, 255, 0.85)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
              <TrendingUp size={20} color="var(--primary-color)" /> Asset Limit Eligibility Simulator
            </h2>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '2rem' }}>
              {stateConfig.name || 'California'} Medicaid ({stateConfig.medicaidName || 'Medi-Cal'}) and SSI impose a strict **$2,000 asset limit** on individuals. Exceeding this cap disqualifies your child from medical services and monthly checks. Slide the bar to simulate your planned savings and see the shielding impact of {stateConfig.ableProgram || 'ABLE'} accounts and SNTs.
            </p>

            {/* Slider control */}
            <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Planned Savings / Investment Target:</span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>${savingsAmount.toLocaleString()}</strong>
              </div>
              
              <input 
                type="range" 
                min="500" 
                max="150000" 
                step="500"
                value={savingsAmount}
                onChange={(e) => setSavingsAmount(parseInt(e.target.value))}
                style={{ width: '100%', height: '8px', cursor: 'pointer', accentColor: 'var(--primary-color)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                <span>$500</span>
                <span>$2,000 (Standard Limit)</span>
                <span>$50,000</span>
                <span>$100,000 (SSI {stateConfig.ableProgram || 'ABLE'} Limit)</span>
                <span>$150,000+</span>
              </div>
            </div>

            {/* Visual Bar Comparison Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flexWrap: 'wrap' }} className="iep-grid-layout">
              
              {/* Card A: Unprotected Account */}
              <div style={{ 
                background: exceedsSsiLimit ? 'rgba(239, 68, 68, 0.02)' : 'rgba(16, 185, 129, 0.02)',
                border: `1px solid ${exceedsSsiLimit ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'}`,
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Standard Savings Account</span>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.05)', fontWeight: 600 }}>Unprotected</span>
                  </div>
                  
                  <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden', margin: '1rem 0' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min((savingsAmount / 2000) * 100, 100)}%`, 
                      background: exceedsSsiLimit ? '#ef4444' : '#10b981',
                      transition: 'width 0.2s ease'
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '1.25rem' }}>
                    <span>Asset Cap: $2,000</span>
                    <span>Current: ${savingsAmount.toLocaleString()}</span>
                  </div>
                </div>

                {exceedsSsiLimit ? (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', background: 'rgba(239, 68, 68, 0.05)', padding: '0.85rem', borderRadius: '10px' }}>
                    <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.78rem', color: '#b91c1c', lineHeight: 1.4 }}>
                      <strong>Benefit Disqualification!</strong> Your child exceeds the $2,000 limit by <strong>${(savingsAmount - 2000).toLocaleString()}</strong>. They will lose {stateConfig.medicaidName || 'Medicaid'} eligibility and monthly SSI payments.
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', background: 'rgba(16, 185, 129, 0.05)', padding: '0.85rem', borderRadius: '10px' }}>
                    <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.78rem', color: '#15803d' }}>
                      <strong>Eligible.</strong> Balances remain under the $2,000 cap. Benefits are protected.
                    </div>
                  </div>
                )}
              </div>

              {/* Card B: Protected Account */}
              <div style={{ 
                background: exceedsCalableSsiLimit ? 'rgba(245, 158, 11, 0.02)' : 'rgba(16, 185, 129, 0.02)',
                border: `1px solid ${exceedsCalableSsiLimit ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'}`,
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{stateConfig.ableProgram || 'ABLE'} or Special Needs Trust</span>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary-color)', fontWeight: 700 }}>Asset Shielded</span>
                  </div>
                  
                  <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden', margin: '1rem 0' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min((savingsAmount / 100000) * 100, 100)}%`, 
                      background: exceedsCalableSsiLimit ? '#f59e0b' : '#10b981',
                      transition: 'width 0.2s ease'
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '1.25rem' }}>
                    <span>SSI Shield Cap: $100,000 (SNT has no cap)</span>
                    <span>Current: ${savingsAmount.toLocaleString()}</span>
                  </div>
                </div>

                {exceedsCalableSsiLimit ? (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', background: 'rgba(245, 158, 11, 0.05)', padding: '0.85rem', borderRadius: '10px' }}>
                    <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.78rem', color: '#b45309', lineHeight: 1.4 }}>
                      <strong>SSI Suspended, {stateConfig.medicaidName || 'Medicaid'} Safe.</strong> {stateConfig.ableProgram || 'ABLE'} shields up to $100,000 for SSI. The excess limits will temporarily suspend SSI checks, but **{stateConfig.medicaidName || 'Medicaid'} remains 100% active**. (Use SNT to shield over $100k).
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', background: 'rgba(16, 185, 129, 0.05)', padding: '0.85rem', borderRadius: '10px' }}>
                    <Shield size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.78rem', color: '#15803d', lineHeight: 1.4 }}>
                      <strong>100% Shielded.</strong> Under {stateConfig.name || 'California'} {stateConfig.ableProgram || 'ABLE'}/SNT guidelines, these assets are completely ignored. Benefits remain fully protected.
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
            
            {/* Left: Interactive Quiz Panel */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="grid-col-lg-5">
              
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <HelpCircle size={18} color="var(--primary-color)" /> Savings Strategy Finder
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Question 1 */}
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>1. What is the source of the savings funds?</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="q1" 
                          checked={fundingSource === 'parents'} 
                          onChange={() => setFundingSource('parents')} 
                        />
                        <span>Parents&apos; savings, child wages, or family gifts</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="q1" 
                          checked={fundingSource === 'inheritance'} 
                          onChange={() => setFundingSource('inheritance')} 
                        />
                        <span>Inheritance from wills, estates, or trust fund payouts</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="q1" 
                          checked={fundingSource === 'child-injury'} 
                          onChange={() => setFundingSource('child-injury')} 
                        />
                        <span>Injury lawsuit settlement or direct child assets</span>
                      </label>
                    </div>
                  </div>

                  {/* Question 2 */}
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>2. What is the target savings limit?</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="q2" 
                          checked={expectedBalance === 'low'} 
                          onChange={() => setExpectedBalance('low')} 
                        />
                        <span>Under $20,000 (Short-term needs)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="q2" 
                          checked={expectedBalance === 'mid'} 
                          onChange={() => setExpectedBalance('mid')} 
                        />
                        <span>$20,000 - $100,000 (Educational / vehicle / therapy budget)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="q2" 
                          checked={expectedBalance === 'high'} 
                          onChange={() => setExpectedBalance('high')} 
                        />
                        <span>Over $100,000 (Lifetime care estate allocation)</span>
                      </label>
                    </div>
                  </div>

                  {/* Question 3 */}
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>3. What is the spending timeline expectation?</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="q3" 
                          checked={spendingTimeline === 'immediate'} 
                          onChange={() => setSpendingTimeline('immediate')} 
                        />
                        <span>Immediate (Frequent, small daily expense withdrawals)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="q3" 
                          checked={spendingTimeline === 'longterm'} 
                          onChange={() => setSpendingTimeline('longterm')} 
                        />
                        <span>Long-Term (Funds locked away for child&apos;s adult future)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="q3" 
                          checked={spendingTimeline === 'mixed'} 
                          onChange={() => setSpendingTimeline('mixed')} 
                        />
                        <span>Combination (Some daily flexibility, some legacy protection)</span>
                      </label>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right: Advisor Recommendation & Setup Directories */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="grid-col-lg-7">
              
              {/* Strategy Recommendation Card */}
              <div className="glass-panel" style={{ padding: '2rem', borderLeft: '6px solid var(--primary-color)', background: 'linear-gradient(to right, rgba(var(--primary-rgb), 0.02), transparent)' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  color: 'var(--primary-color)', 
                  textTransform: 'uppercase', 
                  background: 'rgba(var(--primary-rgb), 0.08)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  display: 'inline-block',
                  marginBottom: '0.5rem'
                }}>
                  Recommended Strategy
                </span>
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                  {recommendation.title}
                </h3>
                
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  {recommendation.desc}
                </p>

                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  <strong>Estate Recovery Warning:</strong> {recommendation.recoveryNote}
                </div>
              </div>

              {/* Setup Directories */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={18} color="var(--primary-color)" /> Asset Shield Setup Directories
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Directory 1: CalABLE */}
                  <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Sparkles size={14} color="var(--primary-color)" /> {stateConfig.ableProgram || 'ABLE'} Account Setup Details
                    </h4>
                    <ul style={{ paddingLeft: '1rem', fontSize: '0.82rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.25rem', lineHeight: 1.4 }}>
                      <li><strong>Contribution Cap:</strong> Up to $18,000 annually (or more if the child is employed under ABLE to Work rules).</li>
                      <li><strong>Tax Shield:</strong> Earnings grow 100% tax-free when used for Qualified Disability Expenses (QDE).</li>
                      <li><strong>What is a QDE?</strong> Extremely broad: housing, groceries, transit, therapies, assistive tech, tuition, and funeral costs.</li>
                      <li><strong>How to open:</strong> Open directly online via your state&apos;s official {stateConfig.ableProgram || 'ABLE'} portal{selectedState === 'california' && <> at <a href="https://calable.ca.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>calable.ca.gov</a></>} with a minimum deposit.</li>
                    </ul>
                  </div>

                  {/* Directory 2: Third-Party SNT */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Scale size={14} color="var(--primary-color)" /> Third-Party Special Needs Trust Guidelines
                    </h4>
                    <ul style={{ paddingLeft: '1rem', fontSize: '0.82rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.25rem', lineHeight: 1.4 }}>
                      <li><strong>No Savings Limit:</strong> Can hold millions of dollars without affecting SSI or {stateConfig.medicaidName || 'Medicaid'}.</li>
                      <li><strong>Asset Sourcing:</strong> Must be funded by **family assets** (parents&apos; estate, grandparents&apos; will, life insurance). Never fund with the child&apos;s own wages/direct gifts.</li>
                      <li><strong>Medicaid Reclamation:</strong> Completely immune to state {stateConfig.medicaidName || 'Medicaid'} estate reclamation rules.</li>
                      <li><strong>Trustee Oversight:</strong> Requires appointing a trustee (family member or corporate) to sign off on distributions. Trustee pays vendors directly; funds cannot go directly to the child.</li>
                    </ul>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ----------------- TAB 2: DEEMING & FAMILY FEES ----------------- */}
      {activeTab === 'deeming' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }} className="iep-grid-layout">
          
          {/* Left Column Forms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* A. Institutional Deeming Checklist */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                <Shield size={20} color="var(--primary-color)" /> {stateConfig.medicaidName || 'Medicaid'} Institutional Deeming Screener
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                Institutional Deeming completely bypasses parent income, allowing children with severe developmental delays or medical needs to qualify for full {stateConfig.medicaidName || 'Medicaid'}. Answer the screening questions below:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Q1 */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isRcClient}
                    onChange={(e) => setIsRcClient(e.target.checked)}
                  />
                  <span>Is your child currently a client of {selectedState === 'california' ? 'a California Regional Center' : stateConfig.catchmentName || 'a state developmental services agency'}?</span>
                </label>

                {/* Q2 */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={hasDiagnosis}
                    onChange={(e) => setHasDiagnosis(e.target.checked)}
                  />
                  <span>Has a qualifying diagnosis (Autism, Cerebral Palsy, Epilepsy, Down Syndrome, or Intellectual Disability)?</span>
                </label>

                {/* Q3 */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Major Life Activity limitations:</label>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-color)' }}>{majorLimitations} of 7 areas</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: '0.2rem 0' }}>
                    Areas: Self-Care, Receptive/Expressive Language, Learning, Mobility, Self-Direction, Capacity for Independent Living, Economic Self-Sufficiency. (Requires 3+ for Waiver).
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="7"
                    value={majorLimitations}
                    onChange={(e) => setMajorLimitations(parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary-color)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                    <span>0: Mild delays</span>
                    <span>3: Waiver minimum</span>
                    <span>7: Severe limitations</span>
                  </div>
                </div>

                {/* Q4 */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', cursor: 'pointer', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={hasMedicalNeeds}
                    onChange={(e) => setHasMedicalNeeds(e.target.checked)}
                  />
                  <span>Has complex medical needs (G-tube, suctioning, catheter, ventilator, daily injections)?</span>
                </label>

                {/* Q5 */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', cursor: 'pointer', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={childMediCal}
                    onChange={(e) => setChildMediCal(e.target.checked)}
                  />
                  <span>Does your child already have active {stateConfig.medicaidName || 'Medicaid'}?</span>
                </label>

              </div>
            </div>

            {/* B. Family Cost Participation & Program Fees Calculator */}
            {selectedState === 'california' ? (
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                  <Coins size={20} color="var(--primary-color)" /> Regional Center Family Fee (FCPP/AFPF) Calculator
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  California charges families above **400% of the Federal Poverty Level (FPL)** cost-sharing fees for Respite/Camp (FCPP) or an annual $150 program fee (AFPF), unless the child has Medi-Cal. Calculate your fee obligation:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
                  
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="family-size" style={{ fontSize: '0.82rem' }}>Family size (House size)</label>
                    <input
                      id="family-size"
                      type="number"
                      min="1"
                      max="10"
                      value={familySize}
                      onChange={(e) => setFamilySize(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="gross-income" style={{ fontSize: '0.82rem' }}>Gross annual income</label>
                    <input
                      id="gross-income"
                      type="number"
                      min="0"
                      step="5000"
                      value={grossIncome}
                      onChange={(e) => setGrossIncome(Math.max(0, parseInt(e.target.value) || 0))}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="rc-children" style={{ fontSize: '0.82rem' }}>Children receiving RC services</label>
                    <input
                      id="rc-children"
                      type="number"
                      min="1"
                      max="5"
                      value={rcChildren}
                      onChange={(e) => setRcChildren(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>

                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                  <Coins size={20} color="var(--primary-color)" /> {stateConfig.name || 'State'} Medicaid Cost Sharing & Premiums
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                  Under federal guidelines, HCBS waivers (Medicaid waivers) are designed to provide services to individuals in their homes rather than institutions. While institutional deeming ignores parental income for *eligibility*, some states utilize a small premium fee system based on parental income to offset costs.
                  <br /><br />
                  For {stateConfig.name || 'your state'}, contact the **{stateConfig.ddAgency || 'developmental services agency'}** or **{stateConfig.stateMedicaidAgency || 'Medicaid agency'}** to inquire if your child&apos;s matched waivers ({stateConfig.waiverProgram || 'HCBS Waivers'}) have any cost-sharing requirements.
                </p>
              </div>
            )}

            {/* C. Appeal Coordinator Letter Builder */}
            {isRcClient && majorLimitations >= 3 && (
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                    <Mail size={18} color="var(--primary-color)" />
                    Request for Deeming Enrollment
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <CopyButton text={compileDeemingLetter()} size={16} />
                    <PrintButton />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(0,0,0,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                  <div><strong>Subject:</strong> Request for {stateConfig.medicaidName || 'Medicaid'} Waiver (Institutional Deeming) Enrollment</div>
                  <div style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', fontSize: '0.82rem', color: '#555' }}>
                    {compileDeemingLetter().split('\n\n').slice(1).join('\n\n')}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column Sidebar: Calculations Output & Legal Tip */}
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* A. Screener Results */}
            <div className="glass-panel" style={{ padding: '1.75rem', border: '2px solid var(--primary-color)', background: 'rgba(var(--primary-rgb), 0.02)' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-color)', letterSpacing: '0.04em' }}>
                Deeming Result
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                Recommended: <span style={{ color: 'var(--primary-color)' }}>{deemingRec.path}</span>
              </h3>
              
              <p style={{ fontSize: '0.82rem', lineHeight: '1.4', color: 'var(--text-main)', marginBottom: '1rem' }}>
                {deemingRec.desc}
              </p>

              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '0.85rem', borderRadius: '10px', fontSize: '0.82rem' }}>
                <strong>Immediate Action:</strong> <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', lineHeight: '1.4' }}>{deemingRec.action}</p>
              </div>
            </div>

            {/* B. Co-Pay Output */}
            {selectedState === 'california' ? (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.04em' }}>
                  Fee Assessment
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.25rem', marginBottom: '0.75rem' }}>
                  RC Fee Share Status
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.25rem' }}>
                    <span>Income FPL Ratio:</span>
                    <strong>{fplInfo.fplRatio}% FPL</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.25rem' }}>
                    <span>400% FPL Cap:</span>
                    <strong>${fplInfo.threshold400.toLocaleString()}/yr</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.25rem' }}>
                    <span>Annual Fee (AFPF):</span>
                    <strong style={{ color: fplInfo.afpfFee > 0 ? '#f59e0b' : '#10b981' }}>
                      {fplInfo.afpfFee > 0 ? `$${fplInfo.afpfFee}/yr` : '$0 (Exempt)'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.25rem' }}>
                    <span>Respite Co-Pay (FCPP):</span>
                    <strong style={{ color: fplInfo.copayPct > 0 ? '#f59e0b' : '#10b981' }}>
                      {fplInfo.copayPct}% Co-pay
                    </strong>
                  </div>
                </div>

                {fplInfo.isFullyExempt && (
                  <div style={{ marginTop: '0.75rem', background: 'rgba(16, 185, 129, 0.05)', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', color: '#15803d', display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                    <CheckCircle2 size={12} />
                    <span>Your income is under the cap or child has Medi-Cal. You pay <strong>$0</strong>.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.04em' }}>
                  Waiver Cost Sharing
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.25rem', marginBottom: '0.75rem' }}>
                  {stateConfig.name} Medicaid Cost Sharing
                </h3>
                <p style={{ fontSize: '0.8rem', lineHeight: '1.4', color: 'var(--text-light)', margin: 0 }}>
                  For children qualifying via Institutional Deeming (Medicaid waivers), parental income is completely bypassed for eligibility. Most states do not impose sliding-scale premium fees, though some programs (such as TEFRA / Katie Beckett waivers in certain jurisdictions) may include modest monthly premiums based on household income. Contact {stateConfig.stateMedicaidAgency || 'your state Medicaid agency'} to confirm any specific premium guidelines.
                </p>
              </div>
            )}

            {/* C. Legal Tip */}
            {selectedState === 'california' ? (
              <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  💡 Medi-Cal Co-Pay Shield
                </h4>
                <p style={{ lineHeight: '1.4', color: 'var(--text-light)' }}>
                  Under Welfare & Institutions Code § 4783(c), the Family Cost Participation Program co-payments **do not apply** to families of children who have active Medi-Cal. Enrolling in the Institutional Deeming Waiver shields you from all respite co-payments!
                </p>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  💡 {stateConfig.medicaidName || 'Medicaid'} Waiver Benefit
                </h4>
                <p style={{ lineHeight: '1.4', color: 'var(--text-light)', margin: 0 }}>
                  Enrolling in the {stateConfig.waiverProgram || 'HCBS Medicaid Waiver'} gives your child access to full Medicaid coverage. This acts as a secondary insurance, covering co-pays, deductibles, specialized therapies, diapers, and respite care that private insurances may deny.
                </p>
              </div>
            )}

          </div>

        </div>
      )}

    </main>
  );
}
