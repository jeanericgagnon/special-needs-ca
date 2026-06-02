'use client';

import { useActionState, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { registerAction } from '../auth-actions';
import type { County, FunctionalNeed } from '@/lib/db';
import Link from 'next/link';
import { Lock, Mail, HeartHandshake, User, Calendar, Sparkles, Loader2 } from 'lucide-react';
import DiagnosisAutocomplete from '../components/diagnosis-autocomplete';

interface RegisterClientProps {
  counties: County[];
  diagnosesList: string[];
  needsList: FunctionalNeed[];
}

export default function RegisterClient({ counties, diagnosesList, needsList }: RegisterClientProps) {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const searchParams = useSearchParams();

  // Onboarding parameters pre-fills
  const preNickname = searchParams.get('nickname') === 'My-Child' ? '' : searchParams.get('nickname') || '';
  const preDob = searchParams.get('dob') || '';
  const preCountyId = searchParams.get('countyId') || '';
  const preDiagnosis = searchParams.get('diagnosis') || '';

  const [diagnosis, setDiagnosis] = useState(preDiagnosis);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  // Smart Mapping: Watch diagnosis changes and auto-select relevant needs
  const applySmartNeedsMapping = (diagnosisVal: string) => {
    const lowerVal = diagnosisVal.toLowerCase();
    let autoChecked: string[] = [];

    if (lowerVal.includes('autism')) {
      autoChecked = ['protective-supervision', 'speech-therapy', 'respite-care', 'iep-evaluation'];
    } else if (lowerVal.includes('down syndrome') || lowerVal.includes('trisomy 21')) {
      autoChecked = ['speech-therapy', 'iep-evaluation', 'diapers-incontinence-supplies', 'respite-care'];
    } else if (lowerVal.includes('cerebral palsy')) {
      autoChecked = ['diapers-incontinence-supplies', 'iep-evaluation', 'respite-care'];
    } else if (lowerVal.includes('hearing') || lowerVal.includes('deaf')) {
      autoChecked = ['hearing-aids', 'speech-therapy', 'iep-evaluation'];
    } else if (lowerVal.includes('vision') || lowerVal.includes('blind') || lowerVal.includes('cvi')) {
      autoChecked = ['vision-services', 'iep-evaluation'];
    } else if (lowerVal.includes('adhd') || lowerVal.includes('attention deficit')) {
      autoChecked = ['iep-evaluation', 'protective-supervision'];
    } else if (lowerVal.includes('dyslexia') || lowerVal.includes('learning')) {
      autoChecked = ['iep-evaluation', 'speech-therapy'];
    }

    if (autoChecked.length > 0) {
      // Merge with previously selected needs
      setSelectedNeeds(prev => {
        const combined = new Set([...prev, ...autoChecked]);
        return Array.from(combined);
      });
    }
  };

  // Run mapping on mount if preDiagnosis is passed
  useEffect(() => {
    if (preDiagnosis) {
      applySmartNeedsMapping(preDiagnosis);
    }
  }, [preDiagnosis]);

  const handleDiagnosisChange = (val: string) => {
    setDiagnosis(val);
    applySmartNeedsMapping(val);
  };

  const handleNeedToggle = (needId: string) => {
    setSelectedNeeds(prev => 
      prev.includes(needId) ? prev.filter(id => id !== needId) : [...prev, needId]
    );
  };

  return (
    <main className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <HeartHandshake size={36} color="var(--primary-color)" />
          <span style={{ fontSize: '1.5rem', fontWeight: 700, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CA Special Needs Navigator
          </span>
        </Link>
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '780px', margin: '0 auto', padding: '2.5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.8rem' }}>Create Your Account</h2>
        <p style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          Sign up to save your benefits search, create child profiles, and compile action timelines.
        </p>

        {state?.error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '2rem', textAlign: 'center', fontWeight: 500 }}>
            {state.error}
          </div>
        )}

        {/* Action form */}
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            
            {/* Column 1: Credentials */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-color)', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                1. Account Details
              </h3>
              
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    placeholder="you@example.com" 
                    required 
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    id="password" 
                    name="password"
                    placeholder="Min 6 characters" 
                    required 
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword"
                    placeholder="Repeat password" 
                    required 
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Onboarding Child (Optional) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-color)', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} /> 2. Child Profile (Optional)
              </h3>
              
              <div className="input-group">
                <label htmlFor="nickname">Child's Nickname</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    id="nickname" 
                    name="nickname"
                    defaultValue={preNickname}
                    placeholder="e.g. Liam" 
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="dob">Date of Birth</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="date" 
                    id="dob" 
                    name="dob"
                    defaultValue={preDob}
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label htmlFor="countyId">County</label>
                  <select id="countyId" name="countyId" defaultValue={preCountyId}>
                    <option value="">Select...</option>
                    {counties.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="diagnosis">Diagnosis</label>
                  <DiagnosisAutocomplete
                    id="diagnosis"
                    name="diagnosis"
                    value={diagnosis}
                    onChange={handleDiagnosisChange}
                    diagnosesList={diagnosesList}
                    placeholder="Search diagnosis..."
                  />
                </div>
              </div>

              {/* Functional Needs checklist with smart selection notifications */}
              <div className="input-group" style={{ marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span>Needed Support Directory</span>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(99,102,241,0.08)', color: 'var(--primary-color)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>Auto-Matched</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {needsList.map(need => {
                    const isChecked = selectedNeeds.includes(need.id);
                    return (
                      <label 
                        key={need.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: '0.5rem', 
                          fontSize: '0.85rem', 
                          cursor: 'pointer', 
                          fontWeight: 'normal',
                          padding: '0.4rem',
                          borderRadius: '8px',
                          background: isChecked ? 'rgba(99,102,241,0.04)' : 'transparent',
                          border: isChecked ? '1px solid rgba(99,102,241,0.1)' : '1px solid transparent'
                        }}
                      >
                        <input 
                          type="checkbox" 
                          name="functionalNeedIds"
                          value={need.id}
                          checked={isChecked}
                          onChange={() => handleNeedToggle(need.id)}
                          style={{ width: 'auto', marginTop: '2px' }}
                        />
                        <div>
                          <strong>{need.name}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>{need.description}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          <button type="submit" className="btn-primary" disabled={isPending} style={{ marginTop: '1rem' }}>
            {isPending ? <Loader2 className="animate-spin" size={18} /> : null}
            {isPending ? 'Registering...' : 'Create Account & Get Started'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-light)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
