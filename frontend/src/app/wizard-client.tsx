'use client';

import { useState, useEffect } from 'react';
import { analyzeOnboarding, AnalysisResult } from './actions';
import type { County, ProgramWaitlist } from '@/lib/db';
import { 
  Loader2, CheckCircle2, HeartHandshake, Sparkles, 
  LayoutDashboard, Globe, AlertCircle, ArrowRight, ArrowLeft, 
  Activity, Info, Sparkle, Milestone, HelpCircle, ShieldAlert,
  ChevronDown, ChevronUp, Clock, Coins, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import DiagnosisAutocomplete from './components/diagnosis-autocomplete';
import WaitlistVisualizer from './components/waitlist-visualizer';
import WaiverComparison from './components/waiver-comparison';
import RespiteExplainer from './components/respite-explainer';
import PrintButton from '@/components/print-button';
import ShareButton from '@/components/share-button';
import { hasNonNegatedKeyword } from '@/lib/negation';

interface WizardClientProps {
  counties: County[];
  diagnosesList: string[];
  waitlists: ProgramWaitlist[];
}

type WizardStep = 1 | 2 | 3 | 4 | 5;

export default function WizardClient({ counties, diagnosesList, waitlists }: WizardClientProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [age, setAge] = useState<string>('');
  const [countyId, setCountyId] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [additionalText, setAdditionalText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // Dynamic Refiner states
  const [insuranceExcludesHearing, setInsuranceExcludesHearing] = useState<boolean | null>(null);
  const [severeSafetyRisks, setSevereSafetyRisks] = useState<boolean | null>(null);
  const [schoolBasedTherapy, setSchoolBasedTherapy] = useState<boolean | null>(null);
  const [exceedsIncomeLimits, setExceedsIncomeLimits] = useState<boolean | null>(null);

  // Financial breakdown toggle and waitlist bypass quiz states
  const [showFinancialBreakdown, setShowFinancialBreakdown] = useState(false);
  const [bypassAgeUnder21, setBypassAgeUnder21] = useState(false);
  const [bypassFacilityStay, setBypassFacilityStay] = useState(false);
  const [bypassWaiverTransfer, setBypassWaiverTransfer] = useState(false);

  // Auto-fill age bypass based on wizard input
  useEffect(() => {
    if (analysis && age) {
      const ageNum = parseInt(age);
      setTimeout(() => {
        if (!isNaN(ageNum) && ageNum < 21) {
          setBypassAgeUnder21(true);
        } else {
          setBypassAgeUnder21(false);
        }
      }, 0);
    }
  }, [analysis, age]);

  const getEstimatedFinancialValues = (coreMatches: { id: string; name: string }[]) => {
    let total = 0;
    const items = coreMatches.map(program => {
      let value = 0;
      let label = '';
      let calcDesc = '';

      switch (program.id) {
        case 'ihss-for-children':
          if (severeSafetyRisks === true || hasNonNegatedKeyword(additionalText, ['safety', 'wander', 'elope', 'supervision', 'danger', 'behavior'])) {
            value = 45360;
            label = 'IHSS Protective Supervision';
            calcDesc = 'Based on 210 hours/mo at CA average $18/hr for safety monitoring';
          } else {
            value = 12960;
            label = 'IHSS Personal Care Hours';
            calcDesc = 'Based on 60 hours/mo at CA average $18/hr for ADL support';
          }
          break;
        case 'regional-centers':
          if (severeSafetyRisks === true || hasNonNegatedKeyword(additionalText, ['safety', 'wander', 'elope', 'supervision', 'behavior', 'respite'])) {
            value = 24000;
            label = 'Regional Center Respite & Behavior Services';
            calcDesc = 'Estimated high-needs funding for respite care and behavioral support';
          } else {
            value = 12000;
            label = 'Regional Center Standard Services';
            calcDesc = 'Estimated standard respite, social rec, and case coordination support';
          }
          break;
        case 'ssi-for-children':
          value = 12168;
          label = 'Supplemental Security Income (SSI)';
          calcDesc = 'Based on maximum CA state/federal monthly benefit of $1,014';
          break;
        case 'california-childrens-services':
          value = 18000;
          label = 'CCS Medical Therapy Program';
          calcDesc = 'PT/OT at MTU clinic equivalent valuation (2x/wk at $150/sess)';
          break;
        case 'iep-special-education':
          value = 22000;
          label = 'Special Education (IEP Services)';
          calcDesc = 'School-based speech, specialized instruction, and paraprofessional support';
          break;
        case 'hearing-aid-coverage':
          value = 3000;
          label = 'Hearing Aid Coverage (HACCP)';
          calcDesc = 'DHCS allowance for pediatric fittings and audiology devices';
          break;
        case 'early-start':
          value = 8500;
          label = 'Early Start Intervention';
          calcDesc = 'State-funded early speech, OT, and infant development services';
          break;
        case 'medi-cal-for-kids-and-teens':
          value = 7200;
          label = 'Medi-Cal EPSDT Coverage';
          calcDesc = 'Private health insurance premium equivalent for comprehensive coverage';
          break;
        case 'calable':
          value = 1200;
          label = 'CalABLE Tax-Advantaged Account';
          calcDesc = 'Estimated annual tax savings and asset shield valuation';
          break;
        default:
          value = 5000;
          label = program.name;
          calcDesc = 'Estimated annual program benefit valuation';
      }
      total += value;
      return { id: program.id, label, value, calcDesc };
    });

    return { items, total };
  };

  const ALL_SUGGESTIONS = [
    { label: 'Safety / Wandering issues', text: 'needs continuous safety supervision, has elopement/wandering behaviors' },
    { label: 'Speech therapy needs', text: 'needs speech-language therapy and communication supports' },
    { label: 'Potty / Diaper delay (Age 3+)', text: 'has bowel and bladder incontinence delays, needs diapers' },
    { label: 'Respite care relief', text: 'needs respite caregiver breaks to prevent caregiver burnout' },
    { label: 'Hearing assistance', text: 'has hearing loss, needs hearing aids and audiology evaluations' },
    { label: 'Visual support services', text: 'has vision impairment, needs specialized school visual teaching' },
    { label: 'IEP school assessment', text: 'needs school district IEP special education evaluations' },
    { label: 'Physical therapy aids', text: 'needs physical and occupational therapies for orthopedic mobility' },
    { label: 'Feeding / G-Tube therapy', text: 'needs feeding therapies, uses G-Tube or has swallowing difficulties' },
    { label: 'Medi-Cal waiver bypass', text: 'needs to bypass family income limits via institutional deeming waivers' },
    { label: 'Mental health therapies', text: 'needs behavioral health and mental counseling support' },
    { label: 'Wheelchair / Mobility aids', text: 'needs wheelchair access, specialized strollers, and physical equipment' }
  ];

  const [clickedTags, setClickedTags] = useState<string[]>([]);
  const availableSuggestions = ALL_SUGGESTIONS.filter(s => !clickedTags.includes(s.label));
  const visibleSuggestions = availableSuggestions.slice(0, 5);

  const handleNextStep = () => {
    if (step === 1 && (!age || !countyId)) return;
    if (step === 2 && !diagnosis) return;
    setStep(prev => (prev + 1) as WizardStep);
  };

  const handlePrevStep = () => {
    setStep(prev => (prev - 1) as WizardStep);
  };

  const handleSuggestionClick = (label: string, text: string) => {
    setAdditionalText(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return text;
      if (trimmed.endsWith('.') || trimmed.endsWith(',')) return `${trimmed} ${text}`;
      return `${trimmed}, ${text}`;
    });
    setClickedTags(prev => [...prev, label]);
  };

  // Helper to determine if follow-up refiners are relevant based on step 2 & 3 answers
  const getRelevantQuestions = () => {
    const list: string[] = [];
    const lowerDiag = diagnosis.toLowerCase();
    const lowerText = additionalText.toLowerCase();

    // 1. Hearing Aid Private Insurance Exclusion (HACCP)
    if (
      lowerDiag.includes('hearing') || 
      lowerDiag.includes('deaf') || 
      lowerText.includes('hearing') || 
      lowerText.includes('deaf') || 
      lowerText.includes('ear') || 
      lowerText.includes('audio')
    ) {
      list.push('hearing');
    }

    // 2. Safety Supervision Risks (IHSS)
    if (
      lowerDiag.includes('autism') || 
      lowerDiag.includes('asd') || 
      lowerDiag.includes('down') || 
      lowerDiag.includes('cerebral') || 
      lowerDiag.includes('adhd') ||
      lowerText.includes('safety') || 
      lowerText.includes('wander') || 
      lowerText.includes('supervision') || 
      lowerText.includes('elope') || 
      lowerText.includes('run away') || 
      lowerText.includes('behavior')
    ) {
      list.push('safety');
    }

    // 3. Lanterman Act Institutional Deeming (Waiver for Income limits)
    if (
      lowerDiag.includes('autism') || 
      lowerDiag.includes('asd') || 
      lowerDiag.includes('down') || 
      lowerDiag.includes('cerebral') || 
      lowerDiag.includes('intellectual')
    ) {
      list.push('income');
    }

    // 4. Physical / Occupational School CCS Therapy
    if (
      lowerDiag.includes('cerebral') || 
      lowerDiag.includes('physical') || 
      lowerDiag.includes('wheelchair') || 
      lowerText.includes('physical') || 
      lowerText.includes('therapy') || 
      lowerText.includes('mobility') || 
      lowerText.includes('wheelchair')
    ) {
      list.push('physical');
    }

    return list;
  };

  // Triggers the analysis query directly (either from Step 3 if no questions are relevant, or Step 4)
  const triggerScreenerSubmit = async (
    useRefiners: boolean, 
    overrides?: { age: number; countyId: string; diagnosis: string }
  ) => {
    setLoading(true);
    setStep(5); // Move to results step
    try {
      const activeRefiners = useRefiners ? {
        insuranceExcludesHearing: insuranceExcludesHearing || undefined,
        severeSafetyRisks: severeSafetyRisks || undefined,
        schoolBasedTherapy: schoolBasedTherapy || undefined,
        exceedsIncomeLimits: exceedsIncomeLimits || undefined
      } : {};

      const queryAge = overrides ? overrides.age : (parseInt(age) || 5);
      const queryCounty = overrides ? overrides.countyId : (countyId || 'los-angeles');
      const queryDiagnosis = overrides ? overrides.diagnosis : (diagnosis || 'Developmental Delay (CA Education Code)');

      const result = await analyzeOnboarding(
        queryAge, 
        queryCounty, 
        queryDiagnosis, 
        overrides ? '' : additionalText, 
        activeRefiners
      );
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      setStep(1); // Revert on failure
    } finally {
      setLoading(false);
    }
  };

  const handleSkipOnboarding = () => {
    const defaultAge = '5';
    const defaultCounty = 'los-angeles';
    const defaultDiag = 'Developmental Delay (CA Education Code)';
    
    setAge(defaultAge);
    setCountyId(defaultCounty);
    setDiagnosis(defaultDiag);
    
    triggerScreenerSubmit(false, {
      age: 5,
      countyId: defaultCounty,
      diagnosis: defaultDiag
    });
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const relevant = getRelevantQuestions();
    if (relevant.length > 0) {
      setStep(4); // Show dynamic refiners page
    } else {
      triggerScreenerSubmit(false); // Skip straight to matching
    }
  };

  const resetWizard = () => {
    setAge('');
    setCountyId('');
    setDiagnosis('');
    setAdditionalText('');
    setInsuranceExcludesHearing(null);
    setSevereSafetyRisks(null);
    setSchoolBasedTherapy(null);
    setExceedsIncomeLimits(null);
    setClickedTags([]);
    setAnalysis(null);
    setStep(1);
  };

  const getMockDob = (ageYears: string) => {
    const ageNum = parseInt(ageYears) || 0;
    const date = new Date();
    date.setFullYear(date.getFullYear() - ageNum);
    return date.toISOString().split('T')[0];
  };

  const relevantQuestions = getRelevantQuestions();

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '5rem', maxWidth: '850px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <HeartHandshake size={48} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
        <h1>California Special Needs Navigator</h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', color: 'var(--text-light)' }}>
          Input details to screen for specialized wagers and programs. Allow the wizard to compile matches based on CA state rules.
        </p>
      </div>

      {/* Visual Assessment Step Stepper */}
      {step < 5 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '520px', margin: '0 auto 3rem', position: 'relative', padding: '0 1rem' }}>
          {/* Stepper background line */}
          <div style={{ position: 'absolute', top: '16px', left: '2.5rem', right: '2.5rem', height: '2px', backgroundColor: 'rgba(0,0,0,0.06)', zIndex: 0 }} />
          
          {/* Active progress line */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '16px', 
              left: '2.5rem', 
              width: `calc(${((step - 1) / 3) * 100}% - ${((step - 1) / 3) * 5}rem)`, 
              height: '2px', 
              backgroundColor: 'var(--primary-color)', 
              zIndex: 0, 
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
            }} 
          />
          
          {[1, 2, 3, 4].map((num) => {
            const isCompleted = step > num;
            const isActive = step === num;
            
            return (
              <div 
                key={num} 
                style={{ 
                  zIndex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  width: '80px'
                }}
              >
                <div 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: isCompleted ? 'var(--primary-color)' : isActive ? 'var(--glass-bg)' : 'rgba(0,0,0,0.02)',
                    border: isCompleted ? 'none' : isActive ? '2px solid var(--primary-color)' : '1px solid rgba(0,0,0,0.08)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '0.85rem', 
                    fontWeight: 700, 
                    color: isCompleted ? 'white' : isActive ? 'var(--primary-color)' : 'var(--text-light)',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? '0 0 12px rgba(var(--primary-rgb), 0.2)' : 'none'
                  }}
                >
                  {isCompleted ? '✓' : num}
                </div>
                <span 
                  style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: isActive ? 700 : 500, 
                    color: isActive ? 'var(--primary-color)' : 'var(--text-light)',
                    transition: 'color 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {num === 1 ? 'Location' : num === 2 ? 'Diagnosis' : num === 3 ? 'Needs' : 'Refinement'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 1: AGE & LOCATION */}
      {step === 1 && (
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Milestone size={18} color="var(--primary-color)" /> Step 1: Age & Location
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>1 of 3</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="input-group">
              <label htmlFor="age">Child&apos;s Age (Years)</label>
              <input 
                type="number" 
                id="age" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 4"
                min="0"
                max="21"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="county">California County</label>
              <select 
                id="county" 
                value={countyId}
                onChange={(e) => setCountyId(e.target.value)}
                required
              >
                <option value="">Select county...</option>
                {counties.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              type="button" 
              onClick={handleSkipOnboarding}
              style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline', padding: 0 }}
            >
              Skip Onboarding & Browse All Programs
            </button>
            <button 
              type="button" 
              onClick={handleNextStep}
              className="btn-primary" 
              disabled={!age || !countyId}
              style={{ width: 'auto', padding: '0.8rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Next Step <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PRIMARY DIAGNOSIS */}
      {step === 2 && (
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} color="var(--primary-color)" /> Step 2: Primary Diagnosis
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>2 of 3</span>
          </div>

          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="diagnosis">Primary Diagnosis</label>
            <DiagnosisAutocomplete
              id="diagnosis"
              value={diagnosis}
              onChange={setDiagnosis}
              diagnosesList={diagnosesList}
              placeholder="Search or type diagnosis (e.g. Autism, Down Syndrome, Cerebral Palsy...)"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              type="button" 
              onClick={handlePrevStep}
              className="btn-primary" 
              style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', width: 'auto', padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button 
              type="button" 
              onClick={handleSkipOnboarding}
              style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
            >
              Skip Onboarding
            </button>
            <button 
              type="button" 
              onClick={handleNextStep}
              className="btn-primary" 
              disabled={!diagnosis}
              style={{ width: 'auto', padding: '0.8rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Next Step <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: OTHER NEEDS & IMPAIRMENTS */}
      {step === 3 && (
        <form onSubmit={handleStep3Submit} className="glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={18} color="var(--primary-color)" /> Step 3: Specific Support Needs
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>3 of 3</span>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            In your own words, describe other needs or impairments your child has. Mention keywords like <strong>&quot;vision&quot;</strong>, <strong>&quot;hearing&quot;</strong>, <strong>&quot;speech delay&quot;</strong>, <strong>&quot;diapers&quot;</strong>, or safety issues like <strong>&quot;wandering&quot;</strong> and <strong>&quot;supervision&quot;</strong>.
          </p>

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="additionalText">Observed Needs & Delays</label>
            <textarea 
              id="additionalText"
              value={additionalText}
              onChange={(e) => setAdditionalText(e.target.value)}
              placeholder="e.g. Liam has sensory delays, visual impairments, and wanders when outdoors requiring constant safety supervision..."
              style={{ width: '100%', minHeight: '130px', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', fontFamily: 'inherit', resize: 'vertical', fontSize: '0.95rem' }}
            />
          </div>

          {/* Suggestion Tags */}
          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.5rem' }}>
              Quick Suggestions (Click to add to your notes):
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {visibleSuggestions.map(s => (
                <button 
                  key={s.label}
                  type="button"
                  onClick={() => handleSuggestionClick(s.label, s.text)}
                  style={{ background: 'rgba(var(--primary-rgb),0.06)', border: '1px solid rgba(var(--primary-rgb),0.1)', borderRadius: '8px', padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: 'var(--primary-color)', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  + {s.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              type="button" 
              onClick={handlePrevStep}
              className="btn-primary" 
              style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', width: 'auto', padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              style={{ width: 'auto', padding: '0.8rem 2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Analyze observed needs <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: OPTIONAL DYNAMIC REFINERS */}
      {step === 4 && (
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} color="var(--primary-color)" /> Optional: Refine California Waivers
            </h2>
            <button 
              onClick={() => triggerScreenerSubmit(false)}
              style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
            >
              Skip Questions & See Matches →
            </button>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '2.5rem', lineHeight: '1.5' }}>
            Answer these optional follow-up questions to widdle down exact rules (like private insurance exceptions for hearing aids). **You can skip or submit at any point.**
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2.5rem' }}>
            
            {/* A. Hearing aid program (HACCP) Refiner */}
            {relevantQuestions.includes('hearing') && (
              <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                  Hearing Device Exclusions: Does your private health insurance cover hearing aid fittings and devices?
                </strong>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setInsuranceExcludesHearing(true)}
                    className="tab-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: insuranceExcludesHearing === true ? 'var(--primary-color)' : 'white', color: insuranceExcludesHearing === true ? 'white' : 'var(--text-main)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                  >
                    No, private insurance excludes hearing aids
                  </button>
                  <button 
                    onClick={() => setInsuranceExcludesHearing(false)}
                    className="tab-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: insuranceExcludesHearing === false ? 'var(--primary-color)' : 'white', color: insuranceExcludesHearing === false ? 'white' : 'var(--text-main)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                  >
                    Yes, they are covered
                  </button>
                  <button 
                    onClick={() => setInsuranceExcludesHearing(null)}
                    className="tab-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: insuranceExcludesHearing === null ? 'rgba(0,0,0,0.04)' : 'white', color: insuranceExcludesHearing === null ? 'var(--primary-color)' : 'var(--text-light)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', fontWeight: insuranceExcludesHearing === null ? 600 : 'normal' }}
                  >
                    Skip / Not Sure
                  </button>
                </div>
              </div>
            )}

            {/* B. Safety risks (IHSS Protective Supervision) Refiner */}
            {relevantQuestions.includes('safety') && (
              <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <strong style={{ fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldAlert size={16} color="var(--primary-color)" /> Safety Supervision: Does your child exhibit severe wandering, self-injury, or safety risks requiring 24/7 observation?
                </strong>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setSevereSafetyRisks(true)}
                    className="tab-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: severeSafetyRisks === true ? 'var(--primary-color)' : 'white', color: severeSafetyRisks === true ? 'white' : 'var(--text-main)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                  >
                    Yes, active safety risks are present
                  </button>
                  <button 
                    onClick={() => setSevereSafetyRisks(false)}
                    className="tab-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: severeSafetyRisks === false ? 'var(--primary-color)' : 'white', color: severeSafetyRisks === false ? 'white' : 'var(--text-main)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                  >
                    No, behaviors do not present hazard
                  </button>
                  <button 
                    onClick={() => setSevereSafetyRisks(null)}
                    className="tab-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: severeSafetyRisks === null ? 'rgba(0,0,0,0.04)' : 'white', color: severeSafetyRisks === null ? 'var(--primary-color)' : 'var(--text-light)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', fontWeight: severeSafetyRisks === null ? 600 : 'normal' }}
                  >
                    Skip / Not Sure
                  </button>
                </div>
              </div>
            )}

            {/* C. Income Thresholds (Lanterman Institutional Deeming) Refiner */}
            {relevantQuestions.includes('income') && (
              <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                  Medi-Cal Income Limits: Does your household income exceed standard Medi-Cal thresholds?
                </strong>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setExceedsIncomeLimits(true)}
                    className="tab-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: exceedsIncomeLimits === true ? 'var(--primary-color)' : 'white', color: exceedsIncomeLimits === true ? 'white' : 'var(--text-main)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                  >
                    Yes, we exceed income limits
                  </button>
                  <button 
                    onClick={() => setExceedsIncomeLimits(false)}
                    className="tab-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: exceedsIncomeLimits === false ? 'var(--primary-color)' : 'white', color: exceedsIncomeLimits === false ? 'white' : 'var(--text-main)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                  >
                    No, we fall within low-income caps
                  </button>
                  <button 
                    onClick={() => setExceedsIncomeLimits(null)}
                    className="tab-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: exceedsIncomeLimits === null ? 'rgba(0,0,0,0.04)' : 'white', color: exceedsIncomeLimits === null ? 'var(--primary-color)' : 'var(--text-light)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', fontWeight: exceedsIncomeLimits === null ? 600 : 'normal' }}
                  >
                    Skip / Not Sure
                  </button>
                </div>
              </div>
            )}

            {/* D. CCS Therapy Locations Refiner */}
            {relevantQuestions.includes('physical') && (
              <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                  Therapy Environment: Is your child&apos;s physical/occupational therapy school-based (Medical Therapy Unit) or clinical?
                </strong>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setSchoolBasedTherapy(true)}
                    className="tab-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: schoolBasedTherapy === true ? 'var(--primary-color)' : 'white', color: schoolBasedTherapy === true ? 'white' : 'var(--text-main)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                  >
                    School-Based MTU (Income rules waived)
                  </button>
                  <button 
                    onClick={() => setSchoolBasedTherapy(false)}
                    className="tab-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: schoolBasedTherapy === false ? 'var(--primary-color)' : 'white', color: schoolBasedTherapy === false ? 'white' : 'var(--text-main)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                  >
                    Clinical Private Therapy (Subject to income cap)
                  </button>
                  <button 
                    onClick={() => setSchoolBasedTherapy(null)}
                    className="tab-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: schoolBasedTherapy === null ? 'rgba(0,0,0,0.04)' : 'white', color: schoolBasedTherapy === null ? 'var(--primary-color)' : 'var(--text-light)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', fontWeight: schoolBasedTherapy === null ? 600 : 'normal' }}
                  >
                    Skip / Not Sure
                  </button>
                </div>
              </div>
            )}

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              type="button" 
              onClick={handlePrevStep}
              className="btn-primary" 
              style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', width: 'auto', padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={16} /> Back
            </button>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                type="button" 
                onClick={() => triggerScreenerSubmit(false)}
                className="btn-primary" 
                style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', width: 'auto', padding: '0.8rem 1.5rem' }}
              >
                Skip Answers
              </button>
              
              <button 
                type="button" 
                onClick={() => triggerScreenerSubmit(true)}
                className="btn-primary"
                style={{ width: 'auto', padding: '0.8rem 2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Find Custom Matches <Activity size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: SCREENER LOADER & RESULTS VIEW */}
      {step === 5 && (
        <div className="animate-fade-in">
          
          {loading && (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <Loader2 className="animate-spin" size={48} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem' }} />
              <h3>Analyzing California Relational Rules...</h3>
              <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
                Cross-referencing your diagnosis and keywords against 33,893 state policy records.
              </p>
            </div>
          )}

          {!loading && analysis && (
            <div>
              {/* Dynamic Matches Conversion Header */}
              <div className="glass-panel" style={{ background: 'rgba(var(--primary-rgb), 0.04)', border: '2px solid rgba(var(--primary-rgb), 0.15)', padding: '2rem', marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Sparkles color="var(--primary-color)" size={20} />
                    Save & Track Care Timeline
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5' }}>
                    Create a free portal profile to save these custom matches, compile document checklists (like SOC medical logs), set hearing deadlines, and map local county office helpers.
                  </p>
                </div>
                
                <Link 
                  href={`/register?nickname=My-Child&dob=${getMockDob(age)}&countyId=${countyId}&diagnosis=${diagnosis}`}
                  style={{ textDecoration: 'none' }}
                >
                  <button className="btn-primary" style={{ display: 'inline-flex', width: 'auto' }}>
                    <LayoutDashboard size={18} /> Save & Track Benefits
                  </button>
                </Link>
              </div>

              {/* RATIONALE CARDS: WHY WE THINK SO */}
              <div className="glass-panel" style={{ marginBottom: '2.5rem', background: 'rgba(255,255,255,0.85)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                  <Info color="var(--primary-color)" size={20} /> Smart Screening Rationale
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingLeft: '1.2rem', fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                  {analysis.explanations.map((exp, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <Sparkle size={14} color="var(--primary-color)" style={{ marginTop: '4px', flexShrink: 0 }} />
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dynamic Live Screening Filters */}
              <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem', background: 'rgba(255,255,255,0.8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                    <Milestone size={16} color="var(--primary-color)" /> Live Screening Filters
                  </h3>
                  <button onClick={resetWizard} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                    ← Restart Onboarding
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="refine-age" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Age (Years)</label>
                    <input 
                      type="number" 
                      id="refine-age"
                      value={age} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setAge(val);
                        triggerScreenerSubmit(true, { age: parseInt(val) || 0, countyId, diagnosis });
                      }}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', borderRadius: '8px', background: 'white' }}
                      min="0"
                      max="21"
                    />
                  </div>
                  
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="refine-county" style={{ fontSize: '0.8rem', fontWeight: 600 }}>County</label>
                    <select 
                      id="refine-county"
                      value={countyId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCountyId(val);
                        triggerScreenerSubmit(true, { age: parseInt(age) || 0, countyId: val, diagnosis });
                      }}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', borderRadius: '8px', background: 'white' }}
                    >
                      {counties.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="refine-diagnosis" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Diagnosis</label>
                    <DiagnosisAutocomplete
                      id="refine-diagnosis"
                      value={diagnosis}
                      onChange={(val) => {
                        setDiagnosis(val);
                        triggerScreenerSubmit(true, { age: parseInt(age) || 0, countyId, diagnosis: val });
                      }}
                      diagnosesList={diagnosesList}
                      placeholder="Search diagnosis..."
                    />
                  </div>
                </div>

                {/* Optional Refiner Quick Toggle Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
                  <button
                    onClick={() => {
                      const nextVal = insuranceExcludesHearing === true ? null : true;
                      setInsuranceExcludesHearing(nextVal);
                      setTimeout(() => triggerScreenerSubmit(true), 50);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.78rem',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      border: '1px solid rgba(var(--primary-rgb), 0.2)',
                      background: insuranceExcludesHearing === true ? 'rgba(var(--primary-rgb), 0.15)' : 'white',
                      color: insuranceExcludesHearing === true ? 'var(--primary-color)' : 'var(--text-light)',
                      fontWeight: insuranceExcludesHearing === true ? '600' : 'normal',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    {insuranceExcludesHearing === true ? '✓ ' : '+ '} Insurance Excludes Hearing Aids
                  </button>

                  <button
                    onClick={() => {
                      const nextVal = severeSafetyRisks === true ? null : true;
                      setSevereSafetyRisks(nextVal);
                      setTimeout(() => triggerScreenerSubmit(true), 50);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.78rem',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      border: '1px solid rgba(var(--primary-rgb), 0.2)',
                      background: severeSafetyRisks === true ? 'rgba(var(--primary-rgb), 0.15)' : 'white',
                      color: severeSafetyRisks === true ? 'var(--primary-color)' : 'var(--text-light)',
                      fontWeight: severeSafetyRisks === true ? '600' : 'normal',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    {severeSafetyRisks === true ? '✓ ' : '+ '} Severe Safety Risks (Wandering)
                  </button>

                  <button
                    onClick={() => {
                      const nextVal = exceedsIncomeLimits === true ? null : true;
                      setExceedsIncomeLimits(nextVal);
                      setTimeout(() => triggerScreenerSubmit(true), 50);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.78rem',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      border: '1px solid rgba(var(--primary-rgb), 0.2)',
                      background: exceedsIncomeLimits === true ? 'rgba(var(--primary-rgb), 0.15)' : 'white',
                      color: exceedsIncomeLimits === true ? 'var(--primary-color)' : 'var(--text-light)',
                      fontWeight: exceedsIncomeLimits === true ? '600' : 'normal',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    {exceedsIncomeLimits === true ? '✓ ' : '+ '} Income Exceeds Medi-Cal Cap
                  </button>

                  <button
                    onClick={() => {
                      const nextVal = schoolBasedTherapy === true ? null : true;
                      setSchoolBasedTherapy(nextVal);
                      setTimeout(() => triggerScreenerSubmit(true), 50);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.78rem',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      border: '1px solid rgba(var(--primary-rgb), 0.2)',
                      background: schoolBasedTherapy === true ? 'rgba(var(--primary-rgb), 0.15)' : 'white',
                      color: schoolBasedTherapy === true ? 'var(--primary-color)' : 'var(--text-light)',
                      fontWeight: schoolBasedTherapy === true ? '600' : 'normal',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    {schoolBasedTherapy === true ? '✓ ' : '+ '} School-Based Therapies (MTU)
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ margin: 0 }}>Here is what we think your child qualifies for:</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.2rem', margin: 0 }}>
                    Based on active filters: {age} years old, {countyId.toUpperCase()} County, and diagnosed with {diagnosis}.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <ShareButton />
                  <PrintButton label="Print Action Plan" />
                </div>
              </div>

              {/* Projected Financial Care Package Value Hero */}
              {(() => {
                const { items: financialItems, total: totalFinancialValue } = getEstimatedFinancialValues(analysis.coreMatches);
                return (
                  <div className="glass-panel" style={{ 
                    background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.08) 0%, rgba(167, 139, 250, 0.08) 100%)',
                    border: '1px solid rgba(var(--primary-rgb), 0.2)',
                    padding: '2rem',
                    borderRadius: '24px',
                    marginBottom: '2.5rem',
                    boxShadow: 'var(--glass-shadow)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(var(--primary-rgb),0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
                      <div style={{ width: '100%' }}>
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.3rem', 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          color: 'var(--primary-color)', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em', 
                          marginBottom: '0.5rem',
                          background: 'rgba(var(--primary-rgb),0.1)',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '20px'
                        }}>
                          <Coins size={12} /> Projected Care Package Value
                        </span>
                        <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.2rem 0 0.5rem 0', display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                          ${totalFinancialValue.toLocaleString()}
                          <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-light)' }}>/ year</span>
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                          Estimated value of matched state program slots, specialized therapies, diapers, and respite care. Bypassing parental income deeming rules unlocks these services at no cost.
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.8rem', width: '100%', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1.25rem', marginTop: '0.25rem', alignItems: 'center' }}>
                        <button 
                          onClick={() => setShowFinancialBreakdown(!showFinancialBreakdown)}
                          type="button"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary-color)',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: 0
                          }}
                        >
                          {showFinancialBreakdown ? (
                            <>Hide Itemized Valuation Breakdown <ChevronUp size={16} /></>
                          ) : (
                            <>View Itemized Valuation Breakdown <ChevronDown size={16} /></>
                          )}
                        </button>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <TrendingUp size={14} /> {financialItems.length} Programs Matched
                        </span>
                      </div>
                    </div>

                    {/* Itemized Grid (toggled) */}
                    {showFinancialBreakdown && (
                      <div style={{ 
                        marginTop: '1.5rem', 
                        borderTop: '1px dashed rgba(0,0,0,0.08)', 
                        paddingTop: '1.5rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1rem',
                        animation: 'slideDownFade 0.3s ease forwards'
                      }}>
                        {financialItems.map(item => (
                          <div key={item.id} style={{ 
                            background: 'var(--glass-bg)', 
                            border: '1px solid var(--glass-border)', 
                            borderRadius: '16px', 
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                          }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.label}</span>
                                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-color)', whiteSpace: 'nowrap' }}>
                                  +${item.value.toLocaleString()}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.4', margin: 0 }}>
                                {item.calcDesc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Interactive Waiver Comparison */}
              <div style={{ marginBottom: '2.5rem' }}>
                <WaiverComparison />
              </div>

              {/* Interactive Reserve Capacity Waitlist Bypass Checker */}
              <div className="glass-panel" style={{ 
                border: '1px solid rgba(239, 68, 68, 0.15)',
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '2rem',
                borderRadius: '24px',
                marginBottom: '2.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Clock color="#ef4444" size={22} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    Reserve Capacity Waitlist Bypass Checker
                  </h3>
                </div>
                
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  The high-needs <strong>HCBA Waiver</strong> is capped and currently carries a 2-year waiting list. However, California reserves slots that completely bypass the waitlist under <strong>Reserve Capacity</strong> rules. Check the conditions below to see if your child qualifies:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.75rem', 
                    fontSize: '0.9rem', 
                    fontWeight: 500, 
                    cursor: 'pointer',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.01)',
                    border: '1px solid rgba(0,0,0,0.02)',
                    transition: 'all 0.2s'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={bypassAgeUnder21}
                      onChange={(e) => setBypassAgeUnder21(e.target.checked)}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <strong>Child is under 21 years old</strong>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>
                        Protected under federal EPSDT (Early and Periodic Screening, Diagnostic and Treatment) Medicaid rules.
                      </span>
                    </div>
                  </label>

                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.75rem', 
                    fontSize: '0.9rem', 
                    fontWeight: 500, 
                    cursor: 'pointer',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.01)',
                    border: '1px solid rgba(0,0,0,0.02)',
                    transition: 'all 0.2s'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={bypassFacilityStay}
                      onChange={(e) => setBypassFacilityStay(e.target.checked)}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <strong>Resided in a health or subacute facility for 60+ consecutive days</strong>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>
                        Applies to children currently in hospitals, pediatric subacute facilities, or skilled nursing facilities transitioning home.
                      </span>
                    </div>
                  </label>

                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.75rem', 
                    fontSize: '0.9rem', 
                    fontWeight: 500, 
                    cursor: 'pointer',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.01)',
                    border: '1px solid rgba(0,0,0,0.02)',
                    transition: 'all 0.2s'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={bypassWaiverTransfer}
                      onChange={(e) => setBypassWaiverTransfer(e.target.checked)}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <strong>Transferring from another active Medi-Cal waiver program</strong>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>
                        Transferring from Regional Center HCBS DD waiver, or other California home and community-based services.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Dynamic Warning or Success Alert */}
                {(bypassAgeUnder21 || bypassFacilityStay || bypassWaiverTransfer) ? (
                  <div style={{ 
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(52, 211, 153, 0.08) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '1.25rem',
                    borderRadius: '16px',
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start',
                    animation: 'fadeIn 0.3s ease forwards'
                  }}>
                    <CheckCircle2 color="#10b981" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                        🎉 Potential Waitlist Bypass Confirmed!
                      </strong>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                        Under California Department of Health Care Services (DHCS) regulations, your child matches one or more <strong>Reserve Capacity</strong> rules. When applying for the HCBA Waiver, instruct your local Waiver Agency that you qualify for a priority slot, allowing your child to completely skip the 2-year wait list.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    background: 'rgba(0,0,0,0.02)',
                    border: '1px dashed rgba(0,0,0,0.06)',
                    padding: '1.25rem',
                    borderRadius: '16px',
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start'
                  }}>
                    <Info color="var(--text-light)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                        If none of these apply, the standard waitlist is approximately 24 months. You should still submit an application to secure your spot on the waitlist while exploring Regional Center and IHSS services which have no enrollment caps.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* CORE PROGRAMS MATCHED (Detailed checks based on rules) */}
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Matched Core State Programs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                {analysis.coreMatches.length === 0 ? (
                  <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-light)' }}>No major state-mandated waivers triggered. Review additional details or contact your local school district for general evaluation.</p>
                  </div>
                ) : (
                  analysis.coreMatches.map(program => (
                    <div key={program.id} className="glass-panel" style={{ background: 'rgba(255,255,255,0.7)', borderLeft: '6px solid var(--primary-color)', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ flex: 1, minWidth: '250px' }}>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>{program.name}</h4>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '0.75rem' }}>{program.description}</p>
                          <div style={{ background: 'rgba(var(--primary-rgb),0.06)', border: '1px dashed rgba(var(--primary-rgb),0.2)', padding: '0.75rem', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '1rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                            <strong>Smart Matching Triggers:</strong> {program.trigger_reason}
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                            {program.category && (
                              <span style={{ background: 'rgba(0,0,0,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Category: {program.category.toUpperCase()}</span>
                            )}
                            {program.last_verified_date && (
                              <span style={{ background: 'rgba(0,0,0,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Verified: {program.last_verified_date}</span>
                            )}
                          </div>

                          {/* Program Specific visual aids */}
                          {program.id === 'ihss-for-children' && (
                            <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.25rem' }}>
                              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>⏳ IHSS Wait & Assessment Times</h5>
                              <WaitlistVisualizer activeProgramId="ihss" waitlists={waitlists} />
                            </div>
                          )}
                          
                          {program.id === 'regional-centers' && (
                            <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                              <div>
                                <h5 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>⏳ Regional Center Intake Timeline</h5>
                                <WaitlistVisualizer activeProgramId="regional-centers" waitlists={waitlists} />
                              </div>
                              <RespiteExplainer />
                            </div>
                          )}

                          {program.id === 'california-childrens-services' && (
                            <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.25rem' }}>
                              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>⏳ CCS Assessment Timeline</h5>
                              <WaitlistVisualizer activeProgramId="ccs" waitlists={waitlists} />
                            </div>
                          )}

                          {program.id === 'ssi-for-children' && (
                            <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.25rem' }}>
                              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>⏳ SSI Determination Timeline</h5>
                              <WaitlistVisualizer activeProgramId="ssi" waitlists={waitlists} />
                            </div>
                          )}
                        </div>

                        {program.official_source_url && (
                          <a 
                            href={program.official_source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-primary" 
                            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px', display: 'inline-flex', gap: '0.3rem' }}
                          >
                            <Globe size={14} /> Official Site
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* DYNAMIC CRAWLER MATCHES */}
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.25rem' }}>Dynamic Crawled Matches</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Relevant statutes extracted from our database of 33,000+ scraped California policies.
              </p>
              
              <div className="grid">
                {analysis.crawlerMatches.length === 0 ? (
                  <div className="glass-panel" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-light)' }}>No additional long-tail crawler documents matched. Try refining your keywords.</p>
                  </div>
                ) : (
                  analysis.crawlerMatches.map(prog => (
                    <div key={prog.id} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>{prog.program_name}</h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
                          <span><strong>Ages:</strong> {prog.age_limit_min} - {prog.age_limit_max} years</span>
                          <span><strong>Target:</strong> {prog.target_demographic}</span>
                        </div>
                      </div>
                      
                      <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="program-tag" style={{ marginTop: 0 }}>{diagnosis} Match</span>
                        <a 
                          href={prog.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ fontSize: '0.8rem', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none', fontWeight: 600 }}
                        >
                          <Globe size={12} /> Source Doc
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Dynamic County Directory Index Link */}
              <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Local Resource Directories</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Direct directory routing for CA Counties. View local Regional Centers and offices:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>
                  {counties.slice(0, 8).map(c => (
                    <Link 
                      key={c.id} 
                      href={`/counties/${c.id}`}
                      style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, transition: 'all 0.2s' }}
                    >
                      {c.name} County Guide
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}
    </main>
  );
}
