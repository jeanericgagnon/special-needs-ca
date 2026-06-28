'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Plus, Trash2, Info, 
  Clock, AlertOctagon, AlertTriangle, BookOpen 
} from 'lucide-react';
import PrintButton from '@/components/print-button';
import CopyButton from '@/components/copy-button';
import { DEFAULT_CA_IHSS_ESTIMATE_HOURLY, getDefaultCaIhssWageDisclosure } from '@/lib/ihssWageDisclosure';

interface SafetyIncident {
  id: string;
  time: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'critical';
  details: string;
  intervention: string;
}

const DEFAULT_INCIDENTS: SafetyIncident[] = [
  {
    id: 'inc-1',
    time: '08:15 AM',
    category: 'Elopement / Wandering',
    riskLevel: 'critical',
    details: 'Unlocked the front deadbolt lock while parent was in kitchen. Child eloped into the active driveway toward the main street with zero awareness of oncoming cars.',
    intervention: 'Chased child down, retrieved physically, carried back inside, locked deadbolt, and added safety cover to the doorknob.'
  },
  {
    id: 'inc-2',
    time: '11:30 AM',
    category: 'Pica (Swallowing non-foods)',
    riskLevel: 'critical',
    details: 'Attempted to swallow small decorative gravel pebbles from a potted indoor plant, presenting an immediate choking/toxicity risk.',
    intervention: 'Verbally redirected, physically swept mouth to clear pebbles, and moved all potted plants to locked shelving areas.'
  },
  {
    id: 'inc-3',
    time: '03:45 PM',
    category: 'Self-Injurious Behavior',
    riskLevel: 'medium',
    details: 'Began severe head-banging against the drywall and picking at scabs on arms when instructed to transition from tablet to dinner.',
    intervention: 'Placed soft floor cushions behind child\'s head, applied noise-canceling headphones, and sat next to child to guide sensory calm down.'
  },
  {
    id: 'inc-4',
    time: '07:20 PM',
    category: 'Climbing / Fall Hazards',
    riskLevel: 'medium',
    details: 'Scaled the kitchen counter attempting to reach upper cabinets to access sugar jars, ignoring warnings and risking a 4-foot fall onto tiles.',
    intervention: 'Caught child, helped them step down safely, verbally explained the danger, and installed cabinet safety latches.'
  }
];

export default function BehaviorLogClient() {
  const defaultIhssDisclosure = getDefaultCaIhssWageDisclosure();
  const [activeTab, setActiveTab] = useState<'journal' | 'estimator' | 'overtime'>('journal');
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [hydrated, setHydrated] = useState(false);
  
  // New Incident Form States
  const [time, setTime] = useState('08:00 AM');
  const [category, setCategory] = useState('Elopement / Wandering');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'critical'>('medium');
  const [details, setDetails] = useState('');
  const [intervention, setIntervention] = useState('');

  // Parent/Child info for printable header
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [logDate, setLogDate] = useState('2026-06-02');

  // Hours Estimator States
  const [feedingRank, setFeedingRank] = useState<number>(1);
  const [bowelBladderRank, setBowelBladderRank] = useState<number>(1);
  const [bathingOralRank, setBathingOralRank] = useState<number>(1);
  const [dressingRank, setDressingRank] = useState<number>(1);
  const [ambulationTransfersRank, setAmbulationTransfersRank] = useState<number>(1);

  const [hasParamedical, setHasParamedical] = useState<boolean>(false);
  const [paramedicalHours, setParamedicalHours] = useState<number>(2);
  const [paramedicalDesc, setParamedicalDesc] = useState<string>('Daily G-tube feeding prep, tube sanitization, and skin site inspection.');
  const [requiresSupervision, setRequiresSupervision] = useState<boolean>(true);
  const [ihssWage, setIhssWage] = useState<number>(DEFAULT_CA_IHSS_ESTIMATE_HOURLY);

  // Overtime Planner States
  const [recipientCount, setRecipientCount] = useState<number>(2);
  const [monthlyHours1, setMonthlyHours1] = useState<number>(120);
  const [monthlyHours2, setMonthlyHours2] = useState<number>(80);
  const [monthlyHours3, setMonthlyHours3] = useState<number>(0);
  const [weeklyTravelHours, setWeeklyTravelHours] = useState<number>(3);
  const [schedule, setSchedule] = useState<Record<string, number>>({});

  // Load from localStorage on client mount
  useEffect(() => {
    setTimeout(() => {
      const saved = localStorage.getItem('ca_special_needs_safety_log');
      if (saved) {
        try {
          setIncidents(JSON.parse(saved));
        } catch {
          setIncidents([]);
        }
      } else {
        setIncidents([]);
      }
      
      const savedChild = localStorage.getItem('ca_special_needs_safety_child') || localStorage.getItem('child_name') || localStorage.getItem('iep_student_name');
      if (savedChild) setChildName(savedChild);
      
      const savedParent = localStorage.getItem('ca_special_needs_safety_parent') || localStorage.getItem('caregiver_name');
      if (savedParent) setParentName(savedParent);

      const savedDate = localStorage.getItem('ca_special_needs_safety_date');
      if (savedDate) setLogDate(savedDate);
      else setLogDate(new Date().toISOString().split('T')[0]);

      // Estimator LocalStorage Load
      const savedFeeding = localStorage.getItem('ihss_feeding_rank');
      const savedBowel = localStorage.getItem('ihss_bowel_rank');
      const savedBathing = localStorage.getItem('ihss_bathing_rank');
      const savedDressing = localStorage.getItem('ihss_dressing_rank');
      const savedAmbulation = localStorage.getItem('ihss_ambulation_rank');
      const savedParamedical = localStorage.getItem('ihss_has_paramedical');
      const savedParamedicalHours = localStorage.getItem('ihss_paramedical_hours');
      const savedParamedicalDesc = localStorage.getItem('ihss_paramedical_desc');
      const savedSupervision = localStorage.getItem('ihss_requires_supervision');
      if (savedFeeding) setFeedingRank(parseInt(savedFeeding));
      if (savedBowel) setBowelBladderRank(parseInt(savedBowel));
      if (savedBathing) setBathingOralRank(parseInt(savedBathing));
      if (savedDressing) setDressingRank(parseInt(savedDressing));
      if (savedAmbulation) setAmbulationTransfersRank(parseInt(savedAmbulation));
      if (savedParamedical) setHasParamedical(savedParamedical === 'true');
      if (savedParamedicalHours) setParamedicalHours(parseFloat(savedParamedicalHours));
      if (savedParamedicalDesc) setParamedicalDesc(savedParamedicalDesc);
      if (savedSupervision) setRequiresSupervision(savedSupervision === 'true');

      const savedRecipientCount = localStorage.getItem('ihss_recipient_count');
      const savedMonthlyHours1 = localStorage.getItem('ihss_monthly_hours_1');
      const savedMonthlyHours2 = localStorage.getItem('ihss_monthly_hours_2');
      const savedMonthlyHours3 = localStorage.getItem('ihss_monthly_hours_3');
      const savedTravelHours = localStorage.getItem('ihss_travel_hours');
      const savedSchedule = localStorage.getItem('ihss_schedule_grid');

      if (savedRecipientCount) setRecipientCount(parseInt(savedRecipientCount));
      if (savedMonthlyHours1) setMonthlyHours1(parseInt(savedMonthlyHours1));
      if (savedMonthlyHours2) setMonthlyHours2(parseInt(savedMonthlyHours2));
      if (savedMonthlyHours3) setMonthlyHours3(parseInt(savedMonthlyHours3));
      if (savedTravelHours) setWeeklyTravelHours(parseFloat(savedTravelHours));
      if (savedSchedule) {
        try {
          setSchedule(JSON.parse(savedSchedule));
        } catch {}
      }

      setHydrated(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ihss_recipient_count', recipientCount.toString());
    }
  }, [recipientCount, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ihss_monthly_hours_1', monthlyHours1.toString());
    }
  }, [monthlyHours1, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ihss_monthly_hours_2', monthlyHours2.toString());
    }
  }, [monthlyHours2, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ihss_monthly_hours_3', monthlyHours3.toString());
    }
  }, [monthlyHours3, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ihss_travel_hours', weeklyTravelHours.toString());
    }
  }, [weeklyTravelHours, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ihss_schedule_grid', JSON.stringify(schedule));
    }
  }, [schedule, hydrated]);

  // Save to localStorage when incidents change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ca_special_needs_safety_log', JSON.stringify(incidents));
    }
  }, [incidents, hydrated]);

  // Persist Metadata States
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ca_special_needs_safety_child', childName);
      localStorage.setItem('child_name', childName);
      localStorage.setItem('funding_child_name', childName);
      localStorage.setItem('iep_student_name', childName);
    }
  }, [childName, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ca_special_needs_safety_parent', parentName);
      localStorage.setItem('caregiver_name', parentName);
      localStorage.setItem('funding_parent_name', parentName);
    }
  }, [parentName, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ca_special_needs_safety_date', logDate);
    }
  }, [logDate, hydrated]);

  // Update helpers that persist to localStorage
  const updateFeedingRank = (val: number) => { setFeedingRank(val); localStorage.setItem('ihss_feeding_rank', val.toString()); };
  const updateBowelRank = (val: number) => { setBowelBladderRank(val); localStorage.setItem('ihss_bowel_rank', val.toString()); };
  const updateBathingRank = (val: number) => { setBathingOralRank(val); localStorage.setItem('ihss_bathing_rank', val.toString()); };
  const updateDressingRank = (val: number) => { setDressingRank(val); localStorage.setItem('ihss_dressing_rank', val.toString()); };
  const updateAmbulationRank = (val: number) => { setAmbulationTransfersRank(val); localStorage.setItem('ihss_ambulation_rank', val.toString()); };
  const updateHasParamedical = (val: boolean) => { setHasParamedical(val); localStorage.setItem('ihss_has_paramedical', val.toString()); };
  const updateParamedicalHours = (val: number) => { setParamedicalHours(val); localStorage.setItem('ihss_paramedical_hours', val.toString()); };
  const updateParamedicalDesc = (val: string) => { setParamedicalDesc(val); localStorage.setItem('ihss_paramedical_desc', val); };
  const updateRequiresSupervision = (val: boolean) => { setRequiresSupervision(val); localStorage.setItem('ihss_requires_supervision', val.toString()); };
  const updateIhssWage = (val: number) => { setIhssWage(val); localStorage.setItem('ihss_wage', val.toString()); };

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || !intervention.trim()) return;

    const newInc: SafetyIncident = {
      id: `inc-${Date.now()}`,
      time,
      category,
      riskLevel,
      details,
      intervention
    };

    setIncidents(prev => [...prev, newInc]);
    
    // Reset inputs
    setDetails('');
    setIntervention('');
  };

  const handleDeleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return '#ef4444'; // Red
      case 'medium': return '#f59e0b'; // Amber
      default: return '#10b981'; // Green
    }
  };

  const getCriticalCount = () => incidents.filter(i => i.riskLevel === 'critical').length;
  const getMediumCount = () => incidents.filter(i => i.riskLevel === 'medium').length;

  // CDSS task hours mappings
  const feedingHours = [0, 1.5, 3.5, 6.0, 8.5][feedingRank - 1] || 0;
  const bowelHours = [0, 1.5, 3.0, 5.0, 7.0][bowelBladderRank - 1] || 0;
  const bathingHours = [0, 0.75, 1.5, 2.75, 4.5][bathingOralRank - 1] || 0;
  const dressingHours = [0, 1.0, 2.25, 3.75, 5.25][dressingRank - 1] || 0;
  const ambulationHours = [0, 1.0, 2.25, 3.75, 5.25][ambulationTransfersRank - 1] || 0;
  const paramedicalVal = hasParamedical ? paramedicalHours : 0;

  const totalWeeklyPersonalCare = feedingHours + bowelHours + bathingHours + dressingHours + ambulationHours + paramedicalVal;
  const isSeverelyImpaired = totalWeeklyPersonalCare >= 20;

  const monthlyPersonalCareHours = Math.round(totalWeeklyPersonalCare * 4.33 * 10) / 10;
  
  let protectiveSupervisionHours = 0;
  if (requiresSupervision) {
    protectiveSupervisionHours = isSeverelyImpaired ? 283 : 195;
  }

  const totalMonthlyHours = Math.round((monthlyPersonalCareHours + protectiveSupervisionHours) * 10) / 10;
  const estimatedMonthlyPayout = Math.round(totalMonthlyHours * ihssWage * 100) / 100;

  const compileCaseworkerHandout = () => {
    return `IHSS FUNCTIONAL INDEX & SAFETY ADVOCACY HANDOUT
Recipient Name: ${childName}
Parent / Caregiver: ${parentName}
Date of Evaluation: ${new Date(logDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

This document summarizes the caregiver's daily assistance needs and functional index rankings compiled in preparation for the county social worker's in-home assessment.

ESTIMATED FUNCTIONAL SCORES & TIMES:
- Feeding: Rank ${feedingRank} (${feedingHours} hours/week)
- Bowel & Bladder Care: Rank ${bowelBladderRank} (${bowelHours} hours/week)
- Bathing & Oral Hygiene: Rank ${bathingOralRank} (${bathingHours} hours/week)
- Dressing & Undressing: Rank ${dressingRank} (${dressingHours} hours/week)
- Ambulation & Transfers: Rank ${ambulationTransfersRank} (${ambulationHours} hours/week)
${hasParamedical ? `- Paramedical Care: ${paramedicalHours} hours/week (${paramedicalDesc})\n` : ''}
TOTAL ESTIMATED PERSONAL CARE SERVICES: ${totalWeeklyPersonalCare.toFixed(2)} Hours/Week (${monthlyPersonalCareHours.toFixed(1)} Hours/Month)

SEVERELY IMPAIRED (SI) CLASSIFICATION:
Under CDSS MPP Section 30-701(s)(1), a recipient is classified as "Severely Impaired" if they require 20 or more hours per week of personal care services and paramedical care.
- Result: ${isSeverelyImpaired ? 'SEVERELY IMPAIRED STATUS MET' : 'NON-SEVERELY IMPAIRED STATUS'} (Total hours: ${totalWeeklyPersonalCare.toFixed(2)} hours/week)

PROTECTIVE SUPERVISION REQUIREMENT:
${requiresSupervision ? `The recipient exhibits severe cognitive and developmental impairments that prevent danger awareness, presenting constant safety risks (elopement, pica, head-banging). 24/7 Protective Supervision is requested.
- Allocation: ${isSeverelyImpaired ? '283 Hours/Month (Severely Impaired Limit)' : '195 Hours/Month (Non-Severely Impaired Limit)'}` : 'Protective supervision not requested.'}`;
  };

  const compileOvertimeReport = () => {
    const weekly1 = Math.round((monthlyHours1 / 4.33) * 10) / 10;
    const weekly2 = Math.round((monthlyHours2 / 4.33) * 10) / 10;
    const weekly3 = Math.round((monthlyHours3 / 4.33) * 10) / 10;
    
    let totalWeeklyAuth = weekly1;
    if (recipientCount >= 2) totalWeeklyAuth += weekly2;
    if (recipientCount >= 3) totalWeeklyAuth += weekly3;

    const limit = recipientCount > 1 ? 66 : 70;
    const isOverCap = totalWeeklyAuth > limit;
    
    const regularHours = Math.min(40, totalWeeklyAuth);
    const overtimeHours = Math.max(0, totalWeeklyAuth - 40);

    const regularPay = regularHours * ihssWage;
    const overtimePay = overtimeHours * (ihssWage * 1.5);
    const travelPay = weeklyTravelHours * ihssWage;
    
    const totalWeeklyPay = regularPay + overtimePay + travelPay;
    const totalMonthlyPay = totalWeeklyPay * 4.33;

    const parts = [
      "IHSS MULTI-RECIPIENT SCHEDULE & OVERTIME COMPLIANCE REPORT",
      "Provider Name: " + parentName,
      "Log Date: " + new Date(logDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      "Provider Pay Rate Estimate: $" + ihssWage.toFixed(2) + "/hour",
      "",
      "I. AUTHORIZED HOURS BREAKDOWN",
      "- Recipient 1: " + monthlyHours1 + " hours/month (~" + weekly1 + " hours/week)",
      recipientCount >= 2 ? "- Recipient 2: " + monthlyHours2 + " hours/month (~" + weekly2 + " hours/week)" : "",
      recipientCount >= 3 ? "- Recipient 3: " + monthlyHours3 + " hours/month (~" + weekly3 + " hours/week)" : "",
      "TOTAL WEEKLY AUTHORIZED HOURS: " + totalWeeklyAuth.toFixed(1) + " hours/week",
      "",
      "II. COMPLIANCE STATUS & CAPS (W&I Code § 12301.15)",
      "- Provider Cap Rule: " + (recipientCount > 1 ? '66 hours/week (Multi-Recipient Cap)' : '70 hours/week (Single Recipient Exemption Limit)'),
      "- Combined Weekly Workweek: " + totalWeeklyAuth.toFixed(1) + " hours/week",
      "- Compliance Status: " + (isOverCap ? 'WARNING: EXCEEDS WEEKLY WORK CAP' : 'COMPLIANT (Within work cap bounds)'),
      "- Authorized Weekly Travel Time: " + weeklyTravelHours + " hours/week (Max allowed: 7 hours/week)",
      "",
      "III. ESTIMATED WEEKLY & MONTHLY EARNINGS",
      "- Regular Hours: " + regularHours.toFixed(1) + " hrs @ $" + ihssWage.toFixed(2) + "/hr = $" + regularPay.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      "- Overtime Hours (1.5x): " + overtimeHours.toFixed(1) + " hrs @ $" + (ihssWage * 1.5).toFixed(2) + "/hr = $" + overtimePay.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      "- Travel Hours (Regular): " + weeklyTravelHours + " hrs @ $" + ihssWage.toFixed(2) + "/hr = $" + travelPay.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      "TOTAL PROJECTED WEEKLY INCOME: $" + totalWeeklyPay.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      "TOTAL ESTIMATED MONTHLY PAY (4.33 conversion): $" + totalMonthlyPay.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      "",
      "This workweek schedule is compiled in accordance with CDSS Welfare & Institutions Code Section 12301.15 rules to prevent workweek violations while maximizing authorized recipient hours."
    ];

    return parts.filter(p => p !== "").join("\n");
  };

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '5rem', maxWidth: '1150px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <ShieldAlert size={48} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
        <h1>IHSS 24-Hour Behavior & Safety Log</h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', color: 'var(--text-light)' }}>
          Document elopement, self-harm, pica, and climbing incidents. Present this printable safety journal to your county social worker to substantiate the need for 24/7 Protective Supervision.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }} className="no-print">
        <button
          onClick={() => setActiveTab('journal')}
          style={{
            background: activeTab === 'journal' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: activeTab === 'journal' ? '#ffffff' : 'var(--text-main)',
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
          24-Hour Safety Journal
        </button>

        <button
          onClick={() => setActiveTab('estimator')}
          style={{
            background: activeTab === 'estimator' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: activeTab === 'estimator' ? '#ffffff' : 'var(--text-main)',
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
          <Clock size={18} />
          IHSS Task Hours Estimator
        </button>

        <button
          onClick={() => setActiveTab('overtime')}
          style={{
            background: activeTab === 'overtime' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: activeTab === 'overtime' ? '#ffffff' : 'var(--text-main)',
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
          <Clock size={18} />
          IHSS Overtime Scheduler
        </button>
      </div>

      {/* ----------------- TAB 1: SAFETY LOG JOURNAL ----------------- */}
      {activeTab === 'journal' && (
        <div className="animate-fade-in">
          {/* Info Warning Alert */}
          <div className="glass-panel no-print" style={{ 
            background: 'rgba(var(--primary-rgb), 0.05)', 
            border: '1px solid rgba(var(--primary-rgb), 0.2)', 
            borderRadius: '24px', 
            padding: '1.5rem', 
            marginBottom: '2rem',
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'flex-start'
          }}>
            <Info size={24} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Why is this log crucial?</strong>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                Under California DSS regulations, minor children are generally reviewed for Protective Supervision only when parents can document a need for **continuous safety monitoring** due to developmental impairments. Standard pediatric delays are usually insufficient. Social workers expect to see a written, dated log detailing safety risk incidents and the immediate caregiver interventions that kept the child safe.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
            
            {/* Left Column: Form and Settings */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="grid-col-lg-4">
              
              {/* Metadata Block */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                  Log Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Child&apos;s Name</label>
                    <input 
                      type="text" 
                      value={childName} 
                      onChange={(e) => setChildName(e.target.value)} 
                      placeholder="Child's name"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Parent/Reporter</label>
                    <input 
                      type="text" 
                      value={parentName} 
                      onChange={(e) => setParentName(e.target.value)} 
                      placeholder="Parent or caregiver name"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Log Date</label>
                    <input 
                      type="date" 
                      value={logDate} 
                      onChange={(e) => setLogDate(e.target.value)} 
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Form to Add New Incident */}
              <form onSubmit={handleAddIncident} className="glass-panel no-print" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Plus size={18} color="var(--primary-color)" /> Log Safety Incident
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Time of Incident</label>
                    <input 
                      type="text" 
                      value={time} 
                      onChange={(e) => setTime(e.target.value)} 
                      placeholder="e.g. 02:30 PM"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Behavior Category</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    >
                      <option value="Elopement / Wandering">Elopement / Wandering</option>
                      <option value="Pica (Swallowing non-foods)">Pica (Swallowing non-foods)</option>
                      <option value="Self-Injurious Behavior">Self-Injurious Behavior</option>
                      <option value="Climbing / Fall Hazards">Climbing / Fall Hazards</option>
                      <option value="Fire / Water Hazards">Fire / Water Hazards</option>
                      <option value="Aggressive Outburst">Aggressive Outburst</option>
                      <option value="Other Safety Risk">Other Safety Risk</option>
                    </select>
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Risk Level</label>
                    <select 
                      value={riskLevel} 
                      onChange={(e) => setRiskLevel(e.target.value as SafetyIncident['riskLevel'])}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    >
                      <option value="low">Low Risk (Minor concern)</option>
                      <option value="medium">Medium Risk (Needs monitoring)</option>
                      <option value="critical">Critical Risk (Immediate injury risk)</option>
                    </select>
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Incident Details (What did child do?)</label>
                    <textarea 
                      value={details} 
                      onChange={(e) => setDetails(e.target.value)} 
                      placeholder="e.g. Unlocked window, climbed onto sill to jump down..."
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                      required
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Caregiver Intervention (What did you do?)</label>
                    <textarea 
                      value={intervention} 
                      onChange={(e) => setIntervention(e.target.value)} 
                      placeholder="e.g. Lifted child off sill, locked latch, applied safety lock..."
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', minHeight: '60px', fontFamily: 'inherit', resize: 'vertical' }}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Add to Safety Log
                  </button>

                </div>
              </form>

            </div>

            {/* Right Column: Active Log Table & Dashboard */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="grid-col-lg-8">
              
              {/* Dashboard statistics summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }} className="no-print">
                
                <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.7)' }}>
                  <BookOpen size={24} color="var(--primary-color)" />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Logged Incidents</span>
                    <strong style={{ fontSize: '1.3rem' }}>{incidents.length}</strong>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239,68,68,0.1)' }}>
                  <AlertOctagon size={24} color="#ef4444" />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Critical Hazards</span>
                    <strong style={{ fontSize: '1.3rem', color: '#ef4444' }}>{getCriticalCount()}</strong>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(245, 158, 11, 0.03)', border: '1px solid rgba(245,158,11,0.1)' }}>
                  <AlertTriangle size={24} color="#f59e0b" />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Medium Risks</span>
                    <strong style={{ fontSize: '1.3rem', color: '#f59e0b' }}>{getMediumCount()}</strong>
                  </div>
                </div>

              </div>

              {/* Active Log Grid/Table */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Behavior Log: {childName}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      Reporter: {parentName} | Date: {new Date(logDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="no-print" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to clear all incidents from this log?')) {
                          setIncidents([]);
                        }
                      }}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        borderRadius: '8px',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                    >
                      Clear Log
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Reset log to default sample incidents? This will overwrite your current log.')) {
                          setIncidents(DEFAULT_INCIDENTS);
                        }
                      }}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(var(--primary-rgb), 0.2)',
                        color: 'var(--primary-color)',
                        borderRadius: '8px',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                    >
                      Load Sample Logs
                    </button>
                    <PrintButton label="Print Safety Log" />
                  </div>
                </div>

                {/* Incident Rows */}
                {incidents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                    <Clock size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                    <p>No safety incidents logged. Add entries using the sidebar form.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {incidents.map((inc) => (
                      <div 
                        key={inc.id}
                        style={{
                          background: 'rgba(255,255,255,0.65)',
                          border: '1px solid rgba(0,0,0,0.05)',
                          borderRadius: '16px',
                          padding: '1.25rem',
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'flex-start',
                          transition: 'all 0.2s',
                          position: 'relative'
                        }}
                        className="incident-row-item"
                      >
                        <div style={{
                          height: '32px',
                          width: '32px',
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          flexShrink: 0
                        }}>
                          <Clock size={14} color="var(--text-light)" />
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{inc.time} - {inc.category}</strong>
                              <span style={{ 
                                marginLeft: '0.5rem',
                                display: 'inline-block',
                                background: `${getRiskColor(inc.riskLevel)}15`,
                                color: getRiskColor(inc.riskLevel),
                                border: `1px solid ${getRiskColor(inc.riskLevel)}30`,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '0.1rem 0.4rem',
                                borderRadius: '4px',
                                textTransform: 'uppercase'
                              }}>
                                {inc.riskLevel}
                              </span>
                            </div>
                            
                            <button
                              onClick={() => handleDeleteIncident(inc.id)}
                              className="no-print"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: '0.2rem',
                                borderRadius: '4px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                opacity: 0.7,
                                transition: 'opacity 0.2s'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                              title="Delete incident"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                            <p style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)' }}>
                              <strong>Safety Hazard Detail:</strong> {inc.details}
                            </p>
                            <p style={{ margin: 0, color: 'var(--text-light)' }}>
                              <strong>Caregiver Intervention:</strong> <span style={{ color: 'var(--primary-color)', fontWeight: 500 }}>{inc.intervention}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Standard CDSS header declaration (visible only during print) */}
                <div 
                  style={{ display: 'none', marginTop: '2rem', borderTop: '2px solid #000', paddingTop: '1rem', fontSize: '0.8rem' }}
                  className="print-expand"
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <span><strong>Child Recipient:</strong> {childName}</span>
                    <span><strong>Parent Caregiver:</strong> {parentName}</span>
                    <span><strong>Date Verified:</strong> {logDate}</span>
                    <span><strong>Signature:</strong> ___________________________</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1rem', fontStyle: 'italic', margin: 0 }}>
                    This safety log declares physical hazard occurrences and redirection times observed within a 24-hour window. Retain as support documentation for CDSS SOC 825 protective reviews.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ----------------- TAB 2: HOURS ESTIMATOR ----------------- */}
      {activeTab === 'estimator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }} className="iep-grid-layout animate-fade-in">
          
          {/* Left Column: FI Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Functional Index Guide */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                <Clock size={20} color="var(--primary-color)" /> CDSS Functional Index Assessment
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                For each personal care task, select the rank that best describes your child&apos;s level of impairment. CDSS Ranks range from **Rank 1 (Independent)** to **Rank 5 (Requires Complete Assistance)**.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* 1. Feeding */}
                <div style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.92rem' }}>Feeding assistance (Wiping, cutting, spoons, purees)</label>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-color)' }}>FI Rank: {feedingRank} ({feedingHours} hrs/wk)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={feedingRank}
                    onChange={(e) => updateFeedingRank(parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary-color)', margin: '0.5rem 0' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                    <span>Rank 1: Self</span>
                    <span>Rank 3: Needs cut/prep</span>
                    <span>Rank 5: Complete (tube/spoon feed)</span>
                  </div>
                </div>

                {/* 2. Bowel & Bladder */}
                <div style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.92rem' }}>Bowel & Bladder care (Diapering, wiping, reminders)</label>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-color)' }}>FI Rank: {bowelBladderRank} ({bowelHours} hrs/wk)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={bowelBladderRank}
                    onChange={(e) => updateBowelRank(parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary-color)', margin: '0.5rem 0' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                    <span>Rank 1: Potty trained</span>
                    <span>Rank 3: Reminders/wiping</span>
                    <span>Rank 5: 100% Incontinent (diapers)</span>
                  </div>
                </div>

                {/* 3. Bathing & Oral Hygiene */}
                <div style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.92rem' }}>Bathing, brushing teeth, and brushing hair</label>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-color)' }}>FI Rank: {bathingOralRank} ({bathingHours} hrs/wk)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={bathingOralRank}
                    onChange={(e) => updateBathingRank(parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary-color)', margin: '0.5rem 0' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                    <span>Rank 1: Independent</span>
                    <span>Rank 3: Needs scrubbing/help</span>
                    <span>Rank 5: Complete physical bath</span>
                  </div>
                </div>

                {/* 4. Dressing */}
                <div style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.92rem' }}>Dressing & Undressing (Buttons, zippers, shoes)</label>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-color)' }}>FI Rank: {dressingRank} ({dressingHours} hrs/wk)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={dressingRank}
                    onChange={(e) => updateDressingRank(parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary-color)', margin: '0.5rem 0' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                    <span>Rank 1: Self</span>
                    <span>Rank 3: Fasteners/help</span>
                    <span>Rank 5: Cannot dress/undress</span>
                  </div>
                </div>

                {/* 5. Ambulation & Transfers */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.92rem' }}>Ambulation & Transfers (Walking, lifting, standing)</label>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-color)' }}>FI Rank: {ambulationTransfersRank} ({ambulationHours} hrs/wk)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={ambulationTransfersRank}
                    onChange={(e) => updateAmbulationRank(parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary-color)', margin: '0.5rem 0' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                    <span>Rank 1: Walk freely</span>
                    <span>Rank 3: Needs guidance/rail</span>
                    <span>Rank 5: Wheelchair/lifting</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Paramedical & Protective Supervision Toggle Panel */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                Additional Authorization Parameters
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Protective Supervision Check */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={requiresSupervision}
                      onChange={(e) => updateRequiresSupervision(e.target.checked)}
                    />
                    <span>Requires 24/7 Protective Supervision?</span>
                  </label>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginLeft: '1.5rem', marginTop: '0.2rem', lineHeight: 1.4 }}>
                    Check if your child has severe cognitive impairments and displays wandering/elopement hazards or self-injury risks, requiring continuous parent oversight. Adds 195 or 283 hours.
                  </p>
                </div>

                {/* Paramedical Check */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={hasParamedical}
                      onChange={(e) => updateHasParamedical(e.target.checked)}
                    />
                    <span>Does your child require Paramedical services?</span>
                  </label>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginLeft: '1.5rem', marginTop: '0.2rem', lineHeight: 1.4 }}>
                    Includes clinical support delegated to parents by physicians, such as G-Tube prep/feeding, catheterizing, suctioning, specialized physical therapy exercises, or blood glucose tracking.
                  </p>

                  {hasParamedical && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '1rem', marginTop: '1rem', marginLeft: '1.5rem' }} className="animate-fade-in">
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.75rem' }}>Paramedical Care Description</label>
                        <input
                          type="text"
                          value={paramedicalDesc}
                          onChange={(e) => updateParamedicalDesc(e.target.value)}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        />
                      </div>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.75rem' }}>Hours/Week</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={paramedicalHours}
                          onChange={(e) => updateParamedicalHours(Math.max(0, parseFloat(e.target.value) || 0))}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* County Wage Settings */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: 1.4 }}>
                    <strong>Checked default estimate:</strong> This standalone tool starts with a checked estimate for {defaultIhssDisclosure.countyName} County because it does not know your county yet. Use the override field only for private planning math, and confirm your own county&apos;s latest public rate before relying on any payout estimate.
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem' }}>Planning wage override ($/hour)</label>
                    <input
                      type="number"
                      step="0.05"
                      min="16"
                      value={ihssWage}
                      onChange={(e) => updateIhssWage(Math.max(0, parseFloat(e.target.value) || DEFAULT_CA_IHSS_ESTIMATE_HOURLY))}
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.75rem', lineHeight: 1.5 }}>
                  Source checked:{' '}
                  <a href={defaultIhssDisclosure.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>
                    public county wage reference
                  </a>
                  {' '}• Last checked {defaultIhssDisclosure.lastVerifiedDate}. Default checked estimate: ${defaultIhssDisclosure.hourlyRate?.toFixed(2)}/hour estimate. {defaultIhssDisclosure.explanation}
                </div>

              </div>
            </div>

            {/* Handout copy script */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Caseworker Advocacy Handout</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <CopyButton text={compileCaseworkerHandout()} size={16} />
                  <PrintButton />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                <div style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', fontSize: '0.8rem', color: '#555' }}>
                  {compileCaseworkerHandout()}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Calculator Output */}
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Payout Hero Card */}
            <div className="glass-panel" style={{ padding: '1.75rem', border: '2px solid var(--primary-color)', background: 'rgba(var(--primary-rgb), 0.02)' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-color)', letterSpacing: '0.04em' }}>
                Estimated Planning Scenario
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', marginBottom: '1rem' }}>
                Total: <span style={{ color: 'var(--primary-color)' }}>{totalMonthlyHours} Hours/Mo</span>
              </h3>
              
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1rem' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>Estimated Monthly Income</span>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 700, color: '#10b981', marginTop: '0.25rem' }}>
                  ${estimatedMonthlyPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>
                  Estimate only. Confirm the county rate, approval status, and authorized hours before relying on this amount.
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Personal Care:</span>
                  <strong>{monthlyPersonalCareHours} hrs/mo</strong>
                </div>
                {requiresSupervision && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Supervision:</span>
                    <strong>{protectiveSupervisionHours} hrs/mo</strong>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                  <span>Total hours:</span>
                  <strong>{totalMonthlyHours} hrs/mo</strong>
                </div>
              </div>
            </div>

            {/* Severely Impaired Badge Card */}
            <div className="glass-panel" style={{ 
              padding: '1.5rem', 
              background: isSeverelyImpaired ? 'rgba(16, 185, 129, 0.03)' : 'rgba(245, 158, 11, 0.03)',
              border: `1px solid ${isSeverelyImpaired ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}`
            }}>
              <span style={{ 
                fontSize: '0.7rem', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                color: isSeverelyImpaired ? '#10b981' : '#f59e0b',
                background: isSeverelyImpaired ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                padding: '0.15rem 0.4rem',
                borderRadius: '4px',
                display: 'inline-block',
                marginBottom: '0.5rem'
              }}>
                {isSeverelyImpaired ? 'Severely Impaired' : 'Non-Severely Impaired'}
              </span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                {isSeverelyImpaired ? 'SI Status Confirmed (20+ hrs)' : 'Standard Status (<20 hrs)'}
              </h4>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.4, color: 'var(--text-light)', marginTop: '0.4rem', margin: 0 }}>
                {isSeverelyImpaired 
                  ? 'Since your weekly personal care services total 20+ hours, the county may classify the case as Severely Impaired. If Protective Supervision is later approved, the county often evaluates the case against the 283 hours/month ceiling.'
                  : 'Your weekly personal care hours total less than the 20-hour threshold. If Protective Supervision is later approved, the county often evaluates the case against the 195 hours/month ceiling.'
                }
              </p>
            </div>

            {/* Statutory CDSS Tip */}
            <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>💡 CDSS Assessment Rule</h4>
              <p style={{ lineHeight: '1.4', color: 'var(--text-light)' }}>
                Under CDSS Manual of Policies and Procedures (MPP) Section 30-761, hours must be authorized based on the child&apos;s **individual need** for services. Bring this printout to your assessment to guide the worker.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ----------------- TAB 3: OVERTIME & MULTI-RECIPIENT SCHEDULER ----------------- */}
      {activeTab === 'overtime' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }} className="iep-grid-layout animate-fade-in">
          
          {/* Left Column: Form & Schedule */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Hour Settings Form */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                <Clock size={20} color="var(--primary-color)" /> Workweek Parameters
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Recipient Count Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Recipients in Household</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Number of family members receiving IHSS hours.</span>
                  </div>
                  <select
                    value={recipientCount}
                    onChange={(e) => setRecipientCount(parseInt(e.target.value))}
                    style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', fontSize: '0.88rem', color: 'var(--text-main)' }}
                  >
                    <option value={1}>1 Recipient</option>
                    <option value={2}>2 Recipients</option>
                    <option value={3}>3 Recipients</option>
                  </select>
                </div>

                {/* Monthly Hours 1 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Recipient 1 Monthly Hours</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>~{Math.round((monthlyHours1 / 4.33) * 10) / 10} hours/week limit.</span>
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <input
                      type="number"
                      min="0"
                      value={monthlyHours1}
                      onChange={(e) => setMonthlyHours1(Math.max(0, parseInt(e.target.value) || 0))}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Monthly Hours 2 (if 2+ recipients) */}
                {recipientCount >= 2 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }} className="animate-fade-in">
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem' }}>Recipient 2 Monthly Hours</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>~{Math.round((monthlyHours2 / 4.33) * 10) / 10} hours/week limit.</span>
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <input
                        type="number"
                        min="0"
                        value={monthlyHours2}
                        onChange={(e) => setMonthlyHours2(Math.max(0, parseInt(e.target.value) || 0))}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>
                )}

                {/* Monthly Hours 3 (if 3 recipients) */}
                {recipientCount >= 3 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }} className="animate-fade-in">
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem' }}>Recipient 3 Monthly Hours</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>~{Math.round((monthlyHours3 / 4.33) * 10) / 10} hours/week limit.</span>
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <input
                        type="number"
                        min="0"
                        value={monthlyHours3}
                        onChange={(e) => setMonthlyHours3(Math.max(0, parseInt(e.target.value) || 0))}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>
                )}

                {/* Travel Hours */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Weekly Travel Time (Hours)</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Authorized time driving between recipients (max 7 hrs/wk).</span>
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="7"
                      value={weeklyTravelHours}
                      onChange={(e) => setWeeklyTravelHours(Math.max(0, parseFloat(e.target.value) || 0))}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* 7-Day Scheduler Grid */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                <Clock size={20} color="var(--primary-color)" /> Workweek Schedule Builder
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                Plan your daily hours for each recipient to ensure compliance with the daily and weekly caps. Daily hours exceeding 24 hours total are invalid.
              </p>

              {/* Table Scheduler Grid */}
              <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.06)', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Day</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Rec. 1 Hours</th>
                      {recipientCount >= 2 && <th style={{ padding: '0.5rem 0.75rem' }}>Rec. 2 Hours</th>}
                      {recipientCount >= 3 && <th style={{ padding: '0.5rem 0.75rem' }}>Rec. 3 Hours</th>}
                      <th style={{ padding: '0.5rem 0.75rem', fontWeight: 'bold' }}>Daily Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                      const dayKey = day.toLowerCase().slice(0, 3);
                      
                      const val1 = schedule[`${dayKey}-1`] || 0;
                      const val2 = schedule[`${dayKey}-2`] || 0;
                      const val3 = schedule[`${dayKey}-3`] || 0;

                      const dailyTotal = val1 + (recipientCount >= 2 ? val2 : 0) + (recipientCount >= 3 ? val3 : 0);
                      const isDailyOver = dailyTotal > 24;

                      const handleHourChange = (recIdx: number, val: string) => {
                        const numericVal = Math.min(24, Math.max(0, parseFloat(val) || 0));
                        setSchedule(prev => ({
                          ...prev,
                          [`${dayKey}-${recIdx}`]: numericVal
                        }));
                      };

                      return (
                        <tr key={day} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', background: isDailyOver ? 'rgba(239, 68, 68, 0.05)' : 'none' }}>
                          <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600 }}>{day}</td>
                          
                          {/* Recipient 1 Input */}
                          <td style={{ padding: '0.4rem 0.5rem' }}>
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              max="24"
                              value={val1 || ''}
                              placeholder="0"
                              onChange={(e) => handleHourChange(1, e.target.value)}
                              style={{ width: '70px', padding: '0.3rem 0.5rem', fontSize: '0.82rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--glass-bg)', color: 'var(--text-main)' }}
                            />
                          </td>

                          {/* Recipient 2 Input */}
                          {recipientCount >= 2 && (
                            <td style={{ padding: '0.4rem 0.5rem' }}>
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                max="24"
                                value={val2 || ''}
                                placeholder="0"
                                onChange={(e) => handleHourChange(2, e.target.value)}
                                style={{ width: '70px', padding: '0.3rem 0.5rem', fontSize: '0.82rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--glass-bg)', color: 'var(--text-main)' }}
                              />
                            </td>
                          )}

                          {/* Recipient 3 Input */}
                          {recipientCount >= 3 && (
                            <td style={{ padding: '0.4rem 0.5rem' }}>
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                max="24"
                                value={val3 || ''}
                                placeholder="0"
                                onChange={(e) => handleHourChange(3, e.target.value)}
                                style={{ width: '70px', padding: '0.3rem 0.5rem', fontSize: '0.82rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--glass-bg)', color: 'var(--text-main)' }}
                              />
                            </td>
                          )}

                          {/* Daily Total Display */}
                          <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700, color: isDailyOver ? '#ef4444' : 'inherit' }}>
                            {dailyTotal.toFixed(1)} hrs
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Grid Comparisons / Under-over allocations alerts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'rgba(0,0,0,0.01)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                {(() => {
                  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                  const sumForRec = (recIdx: number) => days.reduce((acc, d) => acc + (schedule[`${d}-${recIdx}`] || 0), 0);
                  
                  const planned1 = sumForRec(1);
                  const planned2 = sumForRec(2);
                  const planned3 = sumForRec(3);

                  const weekly1 = Math.round((monthlyHours1 / 4.33) * 10) / 10;
                  const weekly2 = Math.round((monthlyHours2 / 4.33) * 10) / 10;
                  const weekly3 = Math.round((monthlyHours3 / 4.33) * 10) / 10;

                  return (
                    <>
                      <div>
                        <strong>Recipient 1 Hours Check:</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                          Planned: <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{planned1.toFixed(1)} hrs</span> / Limit: {weekly1.toFixed(1)} hrs
                        </div>
                        {planned1 > weekly1 && <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>⚠️ Exceeds limit by {(planned1 - weekly1).toFixed(1)} hrs</span>}
                      </div>

                      {recipientCount >= 2 && (
                        <div>
                          <strong>Recipient 2 Hours Check:</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                            Planned: <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{planned2.toFixed(1)} hrs</span> / Limit: {weekly2.toFixed(1)} hrs
                          </div>
                          {planned2 > weekly2 && <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>⚠️ Exceeds limit by {(planned2 - weekly2).toFixed(1)} hrs</span>}
                        </div>
                      )}

                      {recipientCount >= 3 && (
                        <div>
                          <strong>Recipient 3 Hours Check:</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                            Planned: <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{planned3.toFixed(1)} hrs</span> / Limit: {weekly3.toFixed(1)} hrs
                          </div>
                          {planned3 > weekly3 && <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>⚠️ Exceeds limit by {(planned3 - weekly3).toFixed(1)} hrs</span>}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

            </div>

            {/* Document display block */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Compliance & Earnings Report</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <CopyButton text={compileOvertimeReport()} size={16} />
                  <PrintButton />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                <div style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', fontSize: '0.8rem', color: '#555' }}>
                  {compileOvertimeReport()}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Earnings Summary & Cap Warnings */}
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Earnings Hero Card */}
            {(() => {
              const weekly1 = Math.round((monthlyHours1 / 4.33) * 10) / 10;
              const weekly2 = Math.round((monthlyHours2 / 4.33) * 10) / 10;
              const weekly3 = Math.round((monthlyHours3 / 4.33) * 10) / 10;
              
              let totalWeeklyAuth = weekly1;
              if (recipientCount >= 2) totalWeeklyAuth += weekly2;
              if (recipientCount >= 3) totalWeeklyAuth += weekly3;

              const limit = recipientCount > 1 ? 66 : 70;
              const isOverCap = totalWeeklyAuth > limit;
              
              const regularHours = Math.min(40, totalWeeklyAuth);
              const overtimeHours = Math.max(0, totalWeeklyAuth - 40);

              const regularPay = regularHours * ihssWage;
              const overtimePay = overtimeHours * (ihssWage * 1.5);
              const travelPay = weeklyTravelHours * ihssWage;
              
              const totalWeeklyPay = regularPay + overtimePay + travelPay;
              const totalMonthlyPay = totalWeeklyPay * 4.33;

              return (
                <>
                  <div className="glass-panel" style={{ padding: '1.75rem', border: `2px solid ${isOverCap ? '#ef4444' : 'var(--primary-color)'}`, background: 'rgba(var(--primary-rgb), 0.02)' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: isOverCap ? '#ef4444' : 'var(--primary-color)', letterSpacing: '0.04em' }}>
                      Workweek Hours Summary
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', marginBottom: '1.25rem' }}>
                      Hours: <span style={{ color: isOverCap ? '#ef4444' : 'var(--primary-color)' }}>{totalWeeklyAuth.toFixed(1)} hrs/wk</span>
                    </h3>

                    <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '0.75rem 1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.25rem' }}>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 600 }}>Projected Monthly Earnings</span>
                      <span style={{ display: 'block', fontSize: '1.35rem', fontWeight: 700, color: '#10b981', marginTop: '0.15rem' }}>
                        ${totalMonthlyPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>
                        Regular & Overtime Pay
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Regular Hours (up to 40):</span>
                        <strong>{regularHours.toFixed(1)} hrs/wk</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Overtime Hours (1.5x):</span>
                        <strong style={{ color: 'var(--primary-color)' }}>{overtimeHours.toFixed(1)} hrs/wk</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Travel Time:</span>
                        <strong>{weeklyTravelHours} hrs/wk</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                        <span>Pay Rate:</span>
                        <strong>${ihssWage.toFixed(2)}/hour estimate</strong>
                      </div>
                    </div>
                  </div>

                  {/* Overtime Cap Warning */}
                  {isOverCap && (
                    <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <AlertOctagon size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.85rem', color: '#b91c1c', marginBottom: '0.2rem' }}>Weekly Cap Exceeded!</strong>
                        <p style={{ fontSize: '0.78rem', color: '#b91c1c', margin: 0, lineHeight: 1.4 }}>
                          Under Welfare & Institutions Code § 12301.15, providers working for multiple recipients are strictly capped at <strong>66 hours per week</strong>. Working beyond this cap will trigger program violations. Split recipient hours with another provider in the household.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Travel time warning */}
                  {weeklyTravelHours > 7 && (
                    <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem', background: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.85rem', color: '#d97706', marginBottom: '0.2rem' }}>Travel Cap Warning</strong>
                        <p style={{ fontSize: '0.78rem', color: '#d97706', margin: 0, lineHeight: 1.4 }}>
                          Welfare & Institutions Code § 12301.16 caps authorized travel time between clients at <strong>7 hours per week</strong>. Make sure your travel time claim is authorized by your caseworker.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {/* Travel info card */}
            <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>🚗 Travel Time & Overtime Rules</h4>
              <p style={{ lineHeight: '1.4', color: 'var(--text-light)', margin: 0 }}>
                Under CDSS rules, if you drive directly from one recipient&apos;s house to another on the same day to perform services, you may be paid for eligible travel time. Travel hours are generally paid at your regular pay rate and do not count toward the 66-hour provider work cap in the same way as service hours.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Hidden Print Container for Caseworker Handout */}
      <div 
        style={{ display: 'none', marginTop: '2rem', borderTop: '2px solid #000', paddingTop: '1rem', fontSize: '0.8rem' }}
        className="print-expand"
      >
        <pre style={{
          fontFamily: 'Courier, monospace',
          fontSize: '0.82rem',
          color: '#334155',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.5',
          margin: 0
        }}>
          {compileCaseworkerHandout()}
        </pre>
      </div>

      {/* Hidden Print Container for Court-Ready Safety Journal Table */}
      <div 
        style={{ display: 'none', marginTop: '3rem', borderTop: '2px solid #000', paddingTop: '1rem', pageBreakBefore: 'always', fontSize: '9.5pt' }}
        className="print-expand"
      >
        <h2 style={{ fontSize: '15pt', textAlign: 'center', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>
          24-HOUR BEHAVIOR & SAFETY LOG
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <span><strong>Child Recipient:</strong> {childName}</span>
          <span><strong>Parent/Reporter:</strong> {parentName}</span>
          <span><strong>Date of Log:</strong> {logDate}</span>
          <span><strong>Total Incidents:</strong> {incidents.length} (Critical: {getCriticalCount()}, Medium: {getMediumCount()})</span>
        </div>

        <h3 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '0.75rem', borderBottom: '1px solid #000', paddingBottom: '3px' }}>
          I. Chronological Incident Log Table
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9pt', border: '1px solid #cbd5e1', marginBottom: '2rem' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #94a3b8', textAlign: 'left' }}>
              <th style={{ padding: '8px', border: '1px solid #cbd5e1', width: '12%' }}>Time</th>
              <th style={{ padding: '8px', border: '1px solid #cbd5e1', width: '23%' }}>Category & Risk</th>
              <th style={{ padding: '8px', border: '1px solid #cbd5e1', width: '38%' }}>Observed Safety Hazard Detail</th>
              <th style={{ padding: '8px', border: '1px solid #cbd5e1', width: '27%' }}>Caregiver Safety Intervention</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => (
              <tr key={inc.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                <td style={{ padding: '8px', border: '1px solid #cbd5e1', fontWeight: 600, verticalAlign: 'top' }}>{inc.time}</td>
                <td style={{ padding: '8px', border: '1px solid #cbd5e1', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 600 }}>{inc.category}</div>
                  <span style={{ 
                    fontSize: '7.5pt', 
                    fontWeight: 700, 
                    color: inc.riskLevel === 'critical' ? '#ef4444' : inc.riskLevel === 'medium' ? '#d97706' : '#10b981',
                    textTransform: 'uppercase'
                  }}>
                    {inc.riskLevel}
                  </span>
                </td>
                <td style={{ padding: '8px', border: '1px solid #cbd5e1', lineHeight: '1.4', verticalAlign: 'top' }}>{inc.details}</td>
                <td style={{ padding: '8px', border: '1px solid #cbd5e1', lineHeight: '1.4', fontStyle: 'italic', color: '#0f766e', verticalAlign: 'top' }}>{inc.intervention}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem', textAlign: 'center' }}>
            <span>Parent/Caregiver Signature</span>
          </div>
          <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem', textAlign: 'center' }}>
            <span>Date Signed</span>
          </div>
        </div>

        <p style={{ fontSize: '7pt', color: '#64748b', marginTop: '2.5rem', fontStyle: 'italic', margin: 0 }}>
          Notice: This behavior log is constructed in support of IHSS Protective Supervision assessment criteria under CDSS MPP Section 30-757.17. Any recorded incident represents an active intervention required to prevent physical injury or property hazard.
        </p>
      </div>

    </main>
  );
}
