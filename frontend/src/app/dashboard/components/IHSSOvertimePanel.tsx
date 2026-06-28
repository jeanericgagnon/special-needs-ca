'use client';

import React, { useState, useEffect } from 'react';
import { useChildProfile } from './ChildProfileContext';
import { 
  Info, Plus, BookOpen, AlertOctagon, AlertTriangle, Trash2
} from 'lucide-react';
import CopyButton from '@/components/copy-button';
import {
  DEFAULT_CA_IHSS_ESTIMATE_HOURLY,
  formatIhssEstimateSourceLabel,
  getDefaultCaIhssWageDisclosure,
  getIhssWageDisclosure,
} from '@/lib/ihssWageDisclosure';
import { 
  getSafetyIncidentsAction, saveSafetyIncidentAction, deleteSafetyIncidentAction,
  getIhssOvertimeScheduleAction, saveIhssOvertimeScheduleAction
} from '../child-actions';

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

export default function IHSSOvertimePanel() {
  const defaultIhssDisclosure = getDefaultCaIhssWageDisclosure();
  const { currentChild, countyDetails, parentName, setParentName, childName, setChildName, stateConfig, isSpanish } = useChildProfile();
  const countyIhssDisclosure = countyDetails
    ? getIhssWageDisclosure(
        countyDetails.state_id || 'california',
        countyDetails.id,
        countyDetails.name,
        countyDetails.ihss_wage_rate ?? null,
      )
    : null;
  const activeIhssDisclosure = countyIhssDisclosure ?? defaultIhssDisclosure;
  const activeIhssCountyName = countyDetails?.name || activeIhssDisclosure.countyName;

  const [ihssSubTab, setIhssSubTab] = useState<'journal' | 'estimator' | 'overtime'>('journal');

  // Safety Log Journal States
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [logDate, setLogDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [category, setCategory] = useState<string>('Elopement / Wandering');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'critical'>('medium');
  const [details, setDetails] = useState<string>('');
  const [intervention, setIntervention] = useState<string>('');

  // Estimator States
  const [feedingRank, setFeedingRank] = useState<number>(1);
  const [bowelBladderRank, setBowelBladderRank] = useState<number>(1);
  const [bathingOralRank, setBathingOralRank] = useState<number>(1);
  const [dressingRank, setDressingRank] = useState<number>(1);
  const [ambulationTransfersRank, setAmbulationTransfersRank] = useState<number>(1);
  const [hasParamedical, setHasParamedical] = useState<boolean>(false);
  const [paramedicalHours, setParamedicalHours] = useState<number>(2);
  const [paramedicalDesc, setParamedicalDesc] = useState<string>('Daily G-tube feeding prep, tube sanitization, and skin site inspection.');
  const [requiresSupervision, setRequiresSupervision] = useState<boolean>(true);
  const [ihssWage, setIhssWage] = useState<number>(activeIhssDisclosure.hourlyRate ?? DEFAULT_CA_IHSS_ESTIMATE_HOURLY);

  // Overtime states
  const [recipientCount, setRecipientCount] = useState<number>(1);
  const [monthlyHours1, setMonthlyHours1] = useState<number>(120);
  const [monthlyHours2, setMonthlyHours2] = useState<number>(80);
  const [monthlyHours3, setMonthlyHours3] = useState<number>(0);
  const [weeklyTravelHours, setWeeklyTravelHours] = useState<number>(3);
  const [schedule, setSchedule] = useState<Record<string, number>>({});
  const [scheduleSaveStatus, setScheduleSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Hydrate child states on swap
  useEffect(() => {
    if (currentChild) {
      Promise.resolve().then(() => {
        setLogDate(new Date().toISOString().split('T')[0]);
        setScheduleSaveStatus({ type: null, message: '' });
        
        getSafetyIncidentsAction(currentChild.id).then(res => {
          if (res.success && res.incidents && res.incidents.length > 0) {
            setIncidents(res.incidents.map((inc: { id: string; time: string; category: string; risk_level?: string; riskLevel?: string; details: string; intervention: string }) => ({
              id: inc.id,
              time: inc.time,
              category: inc.category,
              riskLevel: (inc.risk_level || inc.riskLevel) as 'low' | 'medium' | 'critical',
              details: inc.details,
              intervention: inc.intervention
            })));
          } else {
            setIncidents(DEFAULT_INCIDENTS);
            // Save defaults in background
            DEFAULT_INCIDENTS.forEach(inc => {
              saveSafetyIncidentAction({
                id: inc.id,
                time: inc.time,
                category: inc.category,
                risk_level: inc.riskLevel,
                details: inc.details,
                intervention: inc.intervention
              }, currentChild.id);
            });
          }
        });

        // Estimator & Overtime parameters hydration from DB, fallback to localStorage
        getIhssOvertimeScheduleAction(currentChild.id).then(res => {
          if (res.success && res.schedule) {
            const s = res.schedule;
            setFeedingRank(s.feeding_rank ?? 1);
            setBowelBladderRank(s.bowel_rank ?? 1);
            setBathingOralRank(s.bathing_rank ?? 1);
            setDressingRank(s.dressing_rank ?? 1);
            setAmbulationTransfersRank(s.ambulation_rank ?? 1);
            setHasParamedical(s.has_paramedical === 1);
            setParamedicalHours(s.paramedical_hours ?? 2);
            setParamedicalDesc(s.paramedical_desc ?? 'Daily G-tube feeding prep, tube sanitization, and skin site inspection.');
            setRequiresSupervision(s.requires_supervision === 1);
            setIhssWage(s.ihss_wage ?? activeIhssDisclosure.hourlyRate ?? DEFAULT_CA_IHSS_ESTIMATE_HOURLY); // QA-ALLOW
            setRecipientCount(s.recipient_count ?? 1);
            setMonthlyHours1(s.monthly_hours_1 ?? 120);
            setMonthlyHours2(s.monthly_hours_2 ?? 80);
            setMonthlyHours3(s.monthly_hours_3 ?? 0);
            setWeeklyTravelHours(s.weekly_travel_hours ?? 3);
            try {
              if (s.schedule_grid_json) {
                setSchedule(JSON.parse(s.schedule_grid_json));
              }
            } catch {}
          } else {
            try {
              const savedFeeding = localStorage.getItem(`ihss_feeding_rank_${currentChild.id}`);
              const savedBowel = localStorage.getItem(`ihss_bowel_rank_${currentChild.id}`);
              const savedBathing = localStorage.getItem(`ihss_bathing_rank_${currentChild.id}`);
              const savedDressing = localStorage.getItem(`ihss_dressing_rank_${currentChild.id}`);
              const savedAmbulation = localStorage.getItem(`ihss_ambulation_rank_${currentChild.id}`);
              const savedParamedical = localStorage.getItem(`ihss_has_paramedical_${currentChild.id}`);
              const savedParamedicalHours = localStorage.getItem(`ihss_paramedical_hours_${currentChild.id}`);
              const savedParamedicalDesc = localStorage.getItem(`ihss_paramedical_desc_${currentChild.id}`);
              const savedSupervision = localStorage.getItem(`ihss_requires_supervision_${currentChild.id}`);
              const savedWage = localStorage.getItem(`ihss_wage_${currentChild.id}`);
              const savedRecipientCount = localStorage.getItem(`ihss_recipient_count_${currentChild.id}`);
              const savedMonthlyHours1 = localStorage.getItem(`ihss_monthly_hours_1_${currentChild.id}`);
              const savedMonthlyHours2 = localStorage.getItem(`ihss_monthly_hours_2_${currentChild.id}`);
              const savedMonthlyHours3 = localStorage.getItem(`ihss_monthly_hours_3_${currentChild.id}`);
              const savedTravelHours = localStorage.getItem(`ihss_travel_hours_${currentChild.id}`);
              const savedSchedule = localStorage.getItem(`ihss_schedule_grid_${currentChild.id}`);

              if (savedFeeding) setFeedingRank(parseInt(savedFeeding));
              if (savedBowel) setBowelBladderRank(parseInt(savedBowel));
              if (savedBathing) setBathingOralRank(parseInt(savedBathing));
              if (savedDressing) setDressingRank(parseInt(savedDressing));
              if (savedAmbulation) setAmbulationTransfersRank(parseInt(savedAmbulation));
              if (savedParamedical) setHasParamedical(savedParamedical === 'true');
              if (savedParamedicalHours) setParamedicalHours(parseFloat(savedParamedicalHours));
              if (savedParamedicalDesc) setParamedicalDesc(savedParamedicalDesc);
              if (savedSupervision) setRequiresSupervision(savedSupervision === 'true');
              if (savedWage) setIhssWage(parseFloat(savedWage));
              else setIhssWage(activeIhssDisclosure.hourlyRate ?? DEFAULT_CA_IHSS_ESTIMATE_HOURLY);
              if (savedRecipientCount) setRecipientCount(parseInt(savedRecipientCount));
              if (savedMonthlyHours1) setMonthlyHours1(parseInt(savedMonthlyHours1));
              if (savedMonthlyHours2) setMonthlyHours2(parseInt(savedMonthlyHours2));
              if (savedMonthlyHours3) setMonthlyHours3(parseInt(savedMonthlyHours3));
              if (savedTravelHours) setWeeklyTravelHours(parseFloat(savedTravelHours));
              if (savedSchedule) setSchedule(JSON.parse(savedSchedule));
            } catch {}
          }
        });
      });
    }
  }, [activeIhssDisclosure.hourlyRate, currentChild]);

  const handleSaveSchedule = async () => {
    if (!currentChild) return;
    setScheduleSaveStatus({ type: null, message: '' });
    const payload = {
      feeding_rank: feedingRank,
      bowel_rank: bowelBladderRank,
      bathing_rank: bathingOralRank,
      dressing_rank: dressingRank,
      ambulation_rank: ambulationTransfersRank,
      has_paramedical: hasParamedical ? 1 : 0,
      paramedical_hours: paramedicalHours,
      paramedical_desc: paramedicalDesc,
      requires_supervision: requiresSupervision ? 1 : 0,
      ihss_wage: ihssWage,
      recipient_count: recipientCount,
      monthly_hours_1: monthlyHours1,
      monthly_hours_2: monthlyHours2,
      monthly_hours_3: monthlyHours3,
      weekly_travel_hours: weeklyTravelHours,
      schedule_grid_json: JSON.stringify(schedule)
    };
    const res = await saveIhssOvertimeScheduleAction(currentChild.id, payload);
    if (res.success) {
      setScheduleSaveStatus({ type: 'success', message: 'Estimator & Overtime parameters saved!' });
      setTimeout(() => setScheduleSaveStatus({ type: null, message: '' }), 4000);
    } else {
      setScheduleSaveStatus({ type: 'error', message: res.error || 'Failed to save parameters.' });
    }
  };

  if (!currentChild) return null;

  // Calculators
  const getCriticalCount = () => incidents.filter(i => i.riskLevel === 'critical').length;
  const getMediumCount = () => incidents.filter(i => i.riskLevel === 'medium').length;

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || !intervention.trim()) return;

    const newInc = {
      id: 'inc-' + Date.now(),
      time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category,
      riskLevel,
      details,
      intervention
    };

    saveSafetyIncidentAction({
      id: newInc.id,
      time: newInc.time,
      category: newInc.category,
      risk_level: newInc.riskLevel,
      details: newInc.details,
      intervention: newInc.intervention
    }, currentChild.id).then(() => {
      setIncidents(prev => [newInc, ...prev]);
    });

    setTime('');
    setDetails('');
    setIntervention('');
  };

  const handleDeleteIncident = (id: string) => {
    deleteSafetyIncidentAction(id).then(() => {
      setIncidents(prev => prev.filter(i => i.id !== id));
    });
  };

  const getRiskColor = (level: string) => {
    if (level === 'critical') return '#ef4444';
    if (level === 'medium') return '#f59e0b';
    return '#3b82f6';
  };

  // Hours dynamic allocations based on ranks (CDSS guidelines)
  const getHoursForRank = (rank: number, minHours: number, maxHours: number) => {
    if (rank === 1) return 0;
    return minHours + ((rank - 2) * (maxHours - minHours)) / 3;
  };

  const feedingHours = Math.round(getHoursForRank(feedingRank, 1.5, 7.0) * 10) / 10;
  const bowelHours = Math.round(getHoursForRank(bowelBladderRank, 2.0, 8.0) * 10) / 10;
  const bathingHours = Math.round(getHoursForRank(bathingOralRank, 1.5, 5.0) * 10) / 10;
  const dressingHours = Math.round(getHoursForRank(dressingRank, 1.5, 5.0) * 10) / 10;
  const ambulationHours = Math.round(getHoursForRank(ambulationTransfersRank, 2.0, 6.0) * 10) / 10;

  const weeklyPersonalCare = feedingHours + bowelHours + bathingHours + dressingHours + ambulationHours;
  const weeklyTotal = weeklyPersonalCare + (hasParamedical ? paramedicalHours : 0);
  const monthlyPersonalCareHours = Math.round(weeklyPersonalCare * 4.33);

  const protectiveSupervisionHours = requiresSupervision ? (weeklyTotal >= 20 ? 283 : 195) : 0;
  const totalMonthlyHours = Math.round(weeklyTotal * 4.33) + protectiveSupervisionHours;
  const estimatedMonthlyPayout = totalMonthlyHours * ihssWage;
  const isSeverelyImpaired = weeklyTotal >= 20;

  const compileCaseworkerHandout = () => {
    const programUpper = (stateConfig.personalCareProgram || 'Personal Care').toUpperCase();
    const stateUpper = (stateConfig.name || 'State').toUpperCase();
    return `${programUpper} ADVOCACY HANDOUT: CARE DEMANDS ASSESSMENT
Target Client: ${childName} (Age: ${currentChild.dob ? Math.floor((new Date().getTime() - new Date(currentChild.dob).getTime()) / 31557600000) : 'N/A'})
Assessment Date: ${logDate}
Reporter: ${parentName}

1. FUNCTIONAL INDEX ASSESSMENT RANKS (${stateUpper} MEDICAID GUIDELINES)
- Feeding assistance: Rank ${feedingRank} (${feedingHours} hours/week)
- Bowel & Bladder: Rank ${bowelBladderRank} (${bowelHours} hours/week)
- Bathing & Oral: Rank ${bathingOralRank} (${bathingHours} hours/week)
- Dressing: Rank ${dressingRank} (${dressingHours} hours/week)
- Ambulation & Transfers: Rank ${ambulationTransfersRank} (${ambulationHours} hours/week)

Weekly Personal Care Subtotal: ${weeklyPersonalCare.toFixed(1)} Hours/Week
Status: ${isSeverelyImpaired ? 'Highly Impaired / High Needs (20+ hours)' : 'Standard Needs'}

2. ADDITIONAL PARAMETERS
- Paramedical Care Needs: ${hasParamedical ? 'Yes - ' + paramedicalHours + ' hrs/wk (' + paramedicalDesc + ')' : 'No'}
- Continuous Safety Oversight Required: ${requiresSupervision ? 'Yes - Requires continuous safety oversight due to elopement/self-injury hazards' : 'No'}

3. PROJECTED MONTHLY AUTHORIZATION
Estimated Monthly Hours: ${totalMonthlyHours} Hours
Checked ${activeIhssCountyName} County hourly provider estimate used for planning: $${ihssWage.toFixed(2)}/hour. Confirm the current county rate, approval status, and authorized hours before relying on this amount.
Reference source checked: ${activeIhssDisclosure.sourceUrl} (last checked ${activeIhssDisclosure.lastVerifiedDate}).`;
  };

  return (
    <div className="animate-fade-in">
      {/* Sub-Tabs Switcher */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto' }} className="no-print">
        <button
          onClick={() => setIhssSubTab('journal')}
          className={`tab-btn ${ihssSubTab === 'journal' ? 'active' : ''}`}
          style={{
            background: ihssSubTab === 'journal' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: ihssSubTab === 'journal' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid var(--glass-border)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Safety Log Journal
        </button>
        <button
          onClick={() => setIhssSubTab('estimator')}
          className={`tab-btn ${ihssSubTab === 'estimator' ? 'active' : ''}`}
          style={{
            background: ihssSubTab === 'estimator' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: ihssSubTab === 'estimator' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid var(--glass-border)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Hours Estimator
        </button>
        <button
          onClick={() => setIhssSubTab('overtime')}
          className={`tab-btn ${ihssSubTab === 'overtime' ? 'active' : ''}`}
          style={{
            background: ihssSubTab === 'overtime' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: ihssSubTab === 'overtime' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid var(--glass-border)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Overtime Scheduler
        </button>
      </div>

      {ihssSubTab === 'journal' && (
        <div>
          <div className="glass-panel no-print" style={{ background: 'rgba(var(--primary-rgb), 0.05)', border: '1px solid rgba(var(--primary-rgb), 0.2)', borderRadius: '24px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <Info size={24} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{isSpanish ? '¿Por qué es crucial este registro?' : 'Why is this log crucial?'}</strong>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                {isSpanish 
                  ? `Bajo las regulaciones de ${stateConfig.medicaidName}, los niños menores suelen ser evaluados para supervisión o atención personal cuando los padres pueden demostrar que el niño necesita monitoreo continuo de seguridad debido a deficiencias en el desarrollo. Los evaluadores esperan ver un registro detallado de los incidentes y las intervenciones correspondientes.`
                  : `Under ${stateConfig.name} ${stateConfig.personalCareProgram === 'IHSS Protective Supervision' ? 'DSS' : 'Medicaid'} regulations, minor children are generally evaluated for personal care or supervision hours when parents can document a need for continuous monitoring or assistance due to developmental impairments. Assessors expect to see a written, dated log detailing safety risk incidents and caregiver interventions.`}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }} className="iep-grid-layout">
            {/* Left Column: Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>Log Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Child&apos;s Name</label>
                    <input type="text" value={childName} onChange={(e) => setChildName(e.target.value)} style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Parent/Reporter</label>
                    <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Log Date</label>
                    <input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }} />
                  </div>
                </div>
              </div>

              <form onSubmit={handleAddIncident} className="glass-panel no-print" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Plus size={18} color="var(--primary-color)" /> Log Safety Incident
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time (e.g. 08:15 AM)" style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }} />
                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}>
                    <option value="Elopement / Wandering">Elopement / Wandering</option>
                    <option value="Pica (Swallowing non-foods)">Pica (Swallowing non-foods)</option>
                    <option value="Self-Injurious Behavior">Self-Injurious Behavior</option>
                    <option value="Climbing / Fall Hazards">Climbing / Fall Hazards</option>
                    <option value="Fire / Water Hazards">Fire / Water Hazards</option>
                    <option value="Aggressive Outburst">Aggressive Outburst</option>
                    <option value="Other Safety Risk">Other Safety Risk</option>
                  </select>
                  <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as 'low' | 'medium' | 'critical')} style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}>
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="critical">Critical Risk</option>
                  </select>
                  <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Incident Details (What did child do?)" style={{ padding: '0.5rem', fontSize: '0.85rem', minHeight: '80px', fontFamily: 'inherit', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }} required />
                  <textarea value={intervention} onChange={(e) => setIntervention(e.target.value)} placeholder="Intervention (What did you do?)" style={{ padding: '0.5rem', fontSize: '0.85rem', minHeight: '60px', fontFamily: 'inherit', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }} required />
                  <button type="submit" className="btn-primary" style={{ padding: '0.75rem' }}>Add to Safety Log</button>
                </div>
              </form>
            </div>

            {/* Right Column: Statistics & Logs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={20} color="var(--primary-color)" />
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'block' }}>Logged</span>
                    <strong>{incidents.length}</strong>
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.02)' }}>
                  <AlertOctagon size={20} color="#ef4444" />
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'block' }}>Critical</span>
                    <strong style={{ color: '#ef4444' }}>{getCriticalCount()}</strong>
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.02)' }}>
                  <AlertTriangle size={20} color="#f59e0b" />
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'block' }}>Medium</span>
                    <strong style={{ color: '#f59e0b' }}>{getMediumCount()}</strong>
                  </div>
                </div>
              </div>

              {/* Log inventory */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Behavior Log: {currentChild.nickname}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Log Date: {logDate} | Reporter: {parentName}</span>
                  </div>
                  <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => { 
                        if (confirm('Clear all?')) {
                          Promise.all(incidents.map(inc => deleteSafetyIncidentAction(inc.id))).then(() => {
                            setIncidents([]);
                          });
                        }
                      }} 
                      style={{ border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'none', cursor: 'pointer', borderRadius: '6px' }}
                    >
                      Clear Log
                    </button>
                    <button 
                      onClick={() => {
                        Promise.all(DEFAULT_INCIDENTS.map(inc => saveSafetyIncidentAction({
                          id: inc.id,
                          time: inc.time,
                          category: inc.category,
                          risk_level: inc.riskLevel,
                          details: inc.details,
                          intervention: inc.intervention
                        }, currentChild.id))).then(() => {
                          setIncidents(DEFAULT_INCIDENTS);
                        });
                      }} 
                      style={{ border: '1px solid rgba(var(--primary-rgb), 0.2)', color: 'var(--primary-color)', padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'none', cursor: 'pointer', borderRadius: '6px' }}
                    >
                      Load Sample
                    </button>
                  </div>
                </div>

                {incidents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                    <p>No safety incidents logged yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {incidents.map(inc => (
                      <div key={inc.id} style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '10px', padding: '1rem', background: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong>{inc.time} - {inc.category}</strong>
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', padding: '0.1rem 0.3rem', borderRadius: '4px', background: `${getRiskColor(inc.riskLevel)}15`, color: getRiskColor(inc.riskLevel), fontWeight: 700, textTransform: 'uppercase' }}>{inc.riskLevel}</span>
                          </div>
                          <button onClick={() => handleDeleteIncident(inc.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.82rem' }}><strong>Hazard:</strong> {inc.details}</p>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-light)' }}><strong>Intervention:</strong> <span style={{ color: 'var(--primary-color)' }}>{inc.intervention}</span></p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {ihssSubTab === 'estimator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }} className="iep-grid-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>{isSpanish ? `Evaluación del Índice Funcional de ${stateConfig.name}` : `${stateConfig.name} Functional Index Assessment`}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <label style={{ fontWeight: 600 }}>Feeding (wiping, prep, tube feed)</label>
                    <strong>Rank: {feedingRank} ({feedingHours} hrs/wk)</strong>
                  </div>
                  <input type="range" min="1" max="5" value={feedingRank} onChange={(e) => setFeedingRank(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <label style={{ fontWeight: 600 }}>Bowel & Bladder (diapers, reminders)</label>
                    <strong>Rank: {bowelBladderRank} ({bowelHours} hrs/wk)</strong>
                  </div>
                  <input type="range" min="1" max="5" value={bowelBladderRank} onChange={(e) => setBowelBladderRank(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <label style={{ fontWeight: 600 }}>Bathing & Oral Hygiene</label>
                    <strong>Rank: {bathingOralRank} ({bathingHours} hrs/wk)</strong>
                  </div>
                  <input type="range" min="1" max="5" value={bathingOralRank} onChange={(e) => setBathingOralRank(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <label style={{ fontWeight: 600 }}>Dressing & Undressing</label>
                    <strong>Rank: {dressingRank} ({dressingHours} hrs/wk)</strong>
                  </div>
                  <input type="range" min="1" max="5" value={dressingRank} onChange={(e) => setDressingRank(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <label style={{ fontWeight: 600 }}>Ambulation & Transfers</label>
                    <strong>Rank: {ambulationTransfersRank} ({ambulationHours} hrs/wk)</strong>
                  </div>
                  <input type="range" min="1" max="5" value={ambulationTransfersRank} onChange={(e) => setAmbulationTransfersRank(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                </div>
              </div>
            </div>

            {/* Additional parameters */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Additional Authorization Parameters</h3>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.88rem' }}>
                  <input type="checkbox" checked={requiresSupervision} onChange={(e) => setRequiresSupervision(e.target.checked)} />
                  <span>{isSpanish ? `¿Requiere supervisión continua o seguridad las 24 horas?` : `Requires continuous care or supervision?`}</span>
                </label>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: '0.2rem 0 0 1.25rem' }}>{isSpanish ? `Agrega horas mensuales de supervisión según la gravedad del caso.` : `Adds supervision/care hours depending on impairment severity.`}</p>
              </div>

              <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.88rem' }}>
                  <input type="checkbox" checked={hasParamedical} onChange={(e) => setHasParamedical(e.target.checked)} />
                  <span>Requires Paramedical Services?</span>
                </label>
                {hasParamedical && (
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginTop: '0.5rem', marginLeft: '1.25rem' }}>
                    <input type="text" value={paramedicalDesc} onChange={(e) => setParamedicalDesc(e.target.value)} placeholder="Description" style={{ padding: '0.3rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <input type="number" step="0.5" value={paramedicalHours} onChange={(e) => setParamedicalHours(Math.max(0, parseFloat(e.target.value) || 0))} placeholder="Hours/wk" style={{ padding: '0.3rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}><strong>Checked county estimate:</strong> We start with a checked estimate for {activeIhssCountyName} County. Change the field only if you want a private planning override, and confirm the latest public county rate before relying on the payout math.</span>
                <input type="number" step="0.05" value={ihssWage} onChange={(e) => setIhssWage(Math.max(16, parseFloat(e.target.value) || DEFAULT_CA_IHSS_ESTIMATE_HOURLY))} style={{ padding: '0.3rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'block', marginTop: '0.5rem' }}>
                Source checked:{' '}
                <a href={activeIhssDisclosure.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>
                  {formatIhssEstimateSourceLabel(activeIhssDisclosure)}
                </a>
                {' '}• Last checked {activeIhssDisclosure.lastVerifiedDate}. Checked estimate: {activeIhssDisclosure.hourlyRate !== null ? `$${activeIhssDisclosure.hourlyRate.toFixed(2)}/hour estimate.` : 'Still being verified.'} {activeIhssDisclosure.explanation}
              </span>
            </div>

            {/* caseworker handout */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Caseworker Advocacy Handout</h4>
                <CopyButton text={compileCaseworkerHandout()} size={14} />
              </div>
              <pre style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', margin: 0, fontSize: '0.78rem', fontFamily: 'inherit', color: '#555', background: 'rgba(0,0,0,0.01)', padding: '0.8rem', borderRadius: '8px' }}>
                {compileCaseworkerHandout()}
              </pre>
            </div>
          </div>

          {/* Right Column: Calculator Output */}
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', border: '2px solid var(--primary-color)', background: 'rgba(var(--primary-rgb), 0.01)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase' }}>Estimated Planning Scenario</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.2rem' }}>Total: {totalMonthlyHours} Hours/Mo</h3>
              
              <div style={{ background: '#eefcf5', border: '1px solid #cbf7e1', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', margin: '0.75rem 0' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'block' }}>Estimated Monthly Provider Payout</span>
                <strong style={{ fontSize: '1.3rem', color: '#10b981' }}>${estimatedMonthlyPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                  Estimate only. Confirm the county rate, approval status, and authorized hours before relying on this amount.
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
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
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', background: isSeverelyImpaired ? 'rgba(16, 185, 129, 0.02)' : 'rgba(245, 158, 11, 0.02)', border: `1px solid ${isSeverelyImpaired ? '#cbf7e1' : '#fef3c7'}` }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: isSeverelyImpaired ? '#10b981' : '#f59e0b', textTransform: 'uppercase' }}>{isSeverelyImpaired ? (isSpanish ? 'Impedimento Severo' : 'High Needs') : (isSpanish ? 'Impedimento No Severo' : 'Standard Needs')}</span>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0.2rem 0' }}>{isSpanish ? 'Estado de Necesidad Confirmado (20+ hrs)' : 'High Needs Status Confirmed (20+ hrs)'}</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-light)', lineHeight: 1.3 }}>{isSeverelyImpaired ? `May support a high-hours request under ${stateConfig.personalCareProgram}, subject to agency review.` : `Estimated base hours under ${stateConfig.personalCareProgram}.`}</p>
            </div>
            <button
              onClick={handleSaveSchedule}
              className="btn-primary w-full"
              style={{ padding: '0.75rem', display: 'block', width: '100%', marginTop: '0.5rem' }}
            >
              Save Estimator & Overtime Parameters
            </button>
            {scheduleSaveStatus.type && (
              <div style={{
                padding: '0.5rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                textAlign: 'center',
                marginTop: '0.5rem',
                background: scheduleSaveStatus.type === 'success' ? '#eefcf5' : '#fef2f2',
                border: `1px solid ${scheduleSaveStatus.type === 'success' ? '#cbf7e1' : '#fee2e2'}`,
                color: scheduleSaveStatus.type === 'success' ? '#10b981' : '#ef4444'
              }}>
                {scheduleSaveStatus.message}
              </div>
            )}
          </div>
        </div>
      )}

      {ihssSubTab === 'overtime' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }} className="iep-grid-layout">
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Workweek Parameters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.25fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.88rem' }}>Recipients in Household</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Number of family members receiving hours.</span>
                </div>
                <select value={recipientCount} onChange={(e) => setRecipientCount(parseInt(e.target.value))} style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}>
                  <option value={1}>1 Recipient</option>
                  <option value={2}>2 Recipients</option>
                  <option value={3}>3 Recipients</option>
                </select>
              </div>

              <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '2fr 1.25fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.88rem' }}>Recipient 1 Monthly Hours</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>~{Math.round((monthlyHours1 / 4.33) * 10) / 10} hours/week.</span>
                </div>
                <input type="number" value={monthlyHours1} onChange={(e) => setMonthlyHours1(Math.max(0, parseInt(e.target.value) || 0))} style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }} />
              </div>

              {recipientCount >= 2 && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '2fr 1.25fr', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.88rem' }}>Recipient 2 Monthly Hours</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>~{Math.round((monthlyHours2 / 4.33) * 10) / 10} hours/week.</span>
                  </div>
                  <input type="number" value={monthlyHours2} onChange={(e) => setMonthlyHours2(Math.max(0, parseInt(e.target.value) || 0))} style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
              )}

              {recipientCount >= 3 && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '2fr 1.25fr', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.88rem' }}>Recipient 3 Monthly Hours</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>~{Math.round((monthlyHours3 / 4.33) * 10) / 10} hours/week.</span>
                  </div>
                  <input type="number" value={monthlyHours3} onChange={(e) => setMonthlyHours3(Math.max(0, parseInt(e.target.value) || 0))} style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
              )}

              <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '2fr 1.25fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.88rem' }}>Weekly Travel Hours</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Time spent traveling between recipients.</span>
                </div>
                <input type="number" step="0.5" value={weeklyTravelHours} onChange={(e) => setWeeklyTravelHours(Math.max(0, parseFloat(e.target.value) || 0))} style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }} />
              </div>
            </div>
          </div>

          {/* Right Column: Scheduler metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(() => {
              const weekHours1 = monthlyHours1 / 4.33;
              const weekHours2 = monthlyHours2 / 4.33;
              const weekHours3 = monthlyHours3 / 4.33;
              const totalWeekWork = (recipientCount >= 3 ? weekHours3 : 0) + (recipientCount >= 2 ? weekHours2 : 0) + weekHours1;
              const totalTravel = weeklyTravelHours;
              const grandWeekly = totalWeekWork + totalTravel;

              const regularHours = Math.min(40, grandWeekly);
              const overtimeHours = Math.max(0, grandWeekly - 40);
              const totalMonthlyEstPay = (regularHours * ihssWage + overtimeHours * ihssWage * 1.5) * 4.33;

              return (
                <div className="glass-panel" style={{ padding: '1.5rem', border: '2px solid var(--primary-color)' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase' }}>Workweek Overtime</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.2rem' }}>{Math.round(grandWeekly * 10) / 10} Hours/Week</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', margin: '0.75rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Regular Hours (Straight):</span>
                      <strong>{Math.round(regularHours * 10) / 10} hrs</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: overtimeHours > 0 ? '#ef4444' : 'var(--text-main)' }}>
                      <span>Overtime (1.5x wage):</span>
                      <strong>{Math.round(overtimeHours * 10) / 10} hrs</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                      <span>Monthly Est Wages:</span>
                      <strong style={{ color: '#10b981' }}>${totalMonthlyEstPay.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                    </div>
                  </div>
                </div>
              );
            })()}
            <button
              onClick={handleSaveSchedule}
              className="btn-primary w-full"
              style={{ padding: '0.75rem', display: 'block', width: '100%', marginTop: '0.5rem' }}
            >
              Save Estimator & Overtime Parameters
            </button>
            {scheduleSaveStatus.type && (
              <div style={{
                padding: '0.5rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                textAlign: 'center',
                marginTop: '0.5rem',
                background: scheduleSaveStatus.type === 'success' ? '#eefcf5' : '#fef2f2',
                border: `1px solid ${scheduleSaveStatus.type === 'success' ? '#cbf7e1' : '#fee2e2'}`,
                color: scheduleSaveStatus.type === 'success' ? '#10b981' : '#ef4444'
              }}>
                {scheduleSaveStatus.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
