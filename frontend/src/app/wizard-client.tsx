'use client';

import { useState } from 'react';
import { analyzeOnboarding, AnalysisResult } from './actions';
import type { County, ProgramWaitlist } from '@/lib/db';
import { 
  Loader2, CheckCircle2, HeartHandshake, MapPin, Sparkles, 
  LayoutDashboard, Globe, AlertCircle, ArrowRight, ArrowLeft, 
  Activity, Info, Sparkle, Milestone, HelpCircle, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import DiagnosisAutocomplete from './components/diagnosis-autocomplete';
import WaitlistVisualizer from './components/waitlist-visualizer';
import WaiverComparison from './components/waiver-comparison';
import RespiteExplainer from './components/respite-explainer';
import PrintButton from '@/components/print-button';
import ShareButton from '@/components/share-button';

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
                    boxShadow: isActive ? '0 0 12px rgba(99, 102, 241, 0.2)' : 'none'
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
              <label htmlFor="age">Child's Age (Years)</label>
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
            In your own words, describe other needs or impairments your child has. Mention keywords like <strong>"vision"</strong>, <strong>"hearing"</strong>, <strong>"speech delay"</strong>, <strong>"diapers"</strong>, or safety issues like <strong>"wandering"</strong> and <strong>"supervision"</strong>.
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
                  style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '8px', padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: 'var(--primary-color)', cursor: 'pointer', transition: 'all 0.2s' }}
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
                  Therapy Environment: Is your child's physical/occupational therapy school-based (Medical Therapy Unit) or clinical?
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
              <div className="glass-panel" style={{ background: 'rgba(99, 102, 241, 0.04)', border: '2px solid rgba(99, 102, 241, 0.15)', padding: '2rem', marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
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
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      background: insuranceExcludesHearing === true ? 'rgba(99, 102, 241, 0.15)' : 'white',
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
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      background: severeSafetyRisks === true ? 'rgba(99, 102, 241, 0.15)' : 'white',
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
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      background: exceedsIncomeLimits === true ? 'rgba(99, 102, 241, 0.15)' : 'white',
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
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      background: schoolBasedTherapy === true ? 'rgba(99, 102, 241, 0.15)' : 'white',
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

              {/* Interactive Waiver Comparison */}
              <div style={{ marginBottom: '2.5rem' }}>
                <WaiverComparison />
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
                          <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px dashed rgba(99,102,241,0.2)', padding: '0.75rem', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '1rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                            <strong>Smart Matching Triggers:</strong> {program.trigger_reason}
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                            <span style={{ background: 'rgba(0,0,0,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Category: {program.category.toUpperCase()}</span>
                            <span style={{ background: 'rgba(0,0,0,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Verified: {program.last_verified_date}</span>
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

                        <a 
                          href={program.official_source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-primary" 
                          style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px', display: 'inline-flex', gap: '0.3rem' }}
                        >
                          <Globe size={14} /> Official Site
                        </a>
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
                      href={`/benefits/${diagnosis.toLowerCase().replace(/\s+/g, '-')}/${c.id}`}
                      style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, transition: 'all 0.2s' }}
                    >
                      {diagnosis} in {c.name}
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
