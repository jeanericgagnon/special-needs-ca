import React, { useState } from 'react';
import { runMatchingEngine } from '../../src/engine/matchingEngine.js';
import { conditions, functionalNeeds, counties } from '../../src/data/seedData.js';
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles, UserPlus, FileText } from 'lucide-react';

export default function Screener({ onRegisterProfile, setCurrentTab }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nickname: '',
    dob: '',
    countyId: 'los-angeles',
    zipCode: '',
    conditionIds: [],
    suspectedConditionIds: [],
    functionalNeedIds: [],
    insuranceType: 'private',
    schoolStatus: 'none',
    currentServiceIds: [],
    languagePreference: 'english',
    caregiverNotes: ''
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const toggleCondition = (id, field = 'conditionIds') => {
    setFormData(prev => {
      const arr = prev[field];
      const newArr = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id];
      return { ...prev, [field]: newArr };
    });
  };

  const toggleNeed = (id) => {
    setFormData(prev => {
      const arr = prev.functionalNeedIds;
      const newArr = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id];
      return { ...prev, functionalNeedIds: newArr };
    });
  };

  const toggleCurrentService = (id) => {
    setFormData(prev => {
      const arr = prev.currentServiceIds;
      const newArr = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id];
      return { ...prev, currentServiceIds: newArr };
    });
  };

  // Run the matching engine based on current progress
  const matchResult = step === 4 ? runMatchingEngine(formData) : null;

  const handleRegister = () => {
    onRegisterProfile(formData);
    setCurrentTab('dashboard');
  };

  return (
    <section className="animate-fade-in" style={{ padding: '40px 0' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        
        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          background: 'rgba(255,255,255,0.03)',
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--glass-border)'
        }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 700,
                background: step === s ? 'var(--accent-purple)' : step > s ? 'var(--accent-teal)' : 'var(--bg-tertiary)',
                color: 'white',
                boxShadow: step === s ? '0 0 10px var(--accent-purple-glow)' : 'none',
                transition: 'var(--transition-fast)'
              }}>
                {s}
              </span>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: step === s ? 'var(--text-primary)' : 'var(--text-muted)'
              }} className="desktop-only">
                {s === 1 && 'Child Details'}
                {s === 2 && 'Diagnosis & Needs'}
                {s === 3 && 'Current Services'}
                {s === 4 && 'Preview Scan'}
              </span>
              {s < 4 && <div style={{ width: '40px', height: '1px', background: 'var(--glass-border)' }} className="desktop-only" />}
            </div>
          ))}
        </div>

        {/* Form Screens */}
        <div className="glass-panel" style={{ padding: '36px' }}>
          
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Tell us about your child</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                We use these basic criteria (like age and county) to match against highly localized California benefit limits.
              </p>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Nickname / First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Leo"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-cols-2" style={{ marginTop: '16px' }}>
                <div className="form-group">
                  <label className="form-label">California County</label>
                  <select
                    className="form-select"
                    value={formData.countyId}
                    onChange={(e) => setFormData({ ...formData, countyId: e.target.value })}
                  >
                    {counties.map(c => (
                      <option key={c.id} value={c.id}>{c.name} County</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    maxLength={5}
                    className="form-input"
                    placeholder="e.g., 90010"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Preferred Communication Language</label>
                <select
                  className="form-select"
                  value={formData.languagePreference}
                  onChange={(e) => setFormData({ ...formData, languagePreference: e.target.value })}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish (Español)</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '36px' }}>
                <button
                  disabled={!formData.nickname || !formData.dob}
                  className="btn btn-primary"
                  onClick={nextStep}
                  style={{ opacity: (!formData.nickname || !formData.dob) ? 0.5 : 1 }}
                >
                  Next: Needs & Diagnoses <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DIAGNOSES & FUNCTIONAL NEEDS */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Diagnoses & Functional Needs</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Select all that apply. Many programs trigger based on functional needs (like needing protective supervision) rather than medical labels.
              </p>

              {/* Diagnosis Select */}
              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label className="form-label" style={{ fontSize: '15px', color: 'var(--text-primary)' }}>Diagnosed Conditions</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                  {conditions.map(c => {
                    const active = formData.conditionIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleCondition(c.id, 'conditionIds')}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          border: '1px solid',
                          borderColor: active ? 'var(--accent-purple)' : 'var(--glass-border)',
                          background: active ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                          color: active ? '#a78bfa' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '13px',
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Suspected Diagnoses */}
              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label className="form-label" style={{ fontSize: '15px', color: 'var(--text-primary)' }}>Suspected / Undiagnosed Concerns (No formal diagnosis yet)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                  {conditions.map(c => {
                    if (formData.conditionIds.includes(c.id)) return null;
                    const active = formData.suspectedConditionIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleCondition(c.id, 'suspectedConditionIds')}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          border: '1px solid',
                          borderColor: active ? 'var(--accent-teal)' : 'var(--glass-border)',
                          background: active ? 'rgba(20, 184, 166, 0.15)' : 'rgba(255,255,255,0.02)',
                          color: active ? '#2dd4bf' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '13px',
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        Suspect {c.name}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => toggleCondition('undiagnosed-delay', 'suspectedConditionIds')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid',
                      borderColor: formData.suspectedConditionIds.includes('undiagnosed-delay') ? 'var(--accent-teal)' : 'var(--glass-border)',
                      background: formData.suspectedConditionIds.includes('undiagnosed-delay') ? 'rgba(20, 184, 166, 0.15)' : 'rgba(255,255,255,0.02)',
                      color: formData.suspectedConditionIds.includes('undiagnosed-delay') ? '#2dd4bf' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '13px'
                    }}
                  >
                    General / Suspected Delay
                  </button>
                </div>
              </div>

              {/* Functional Needs */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '12px' }}>Functional Needs & Challenges</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="needs-selector-grid">
                  {functionalNeeds.map(fn => {
                    const active = formData.functionalNeedIds.includes(fn.id);
                    return (
                      <div
                        key={fn.id}
                        onClick={() => toggleNeed(fn.id)}
                        className={`checkbox-card ${active ? 'active' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => {}} // Handled by div onClick
                        />
                        <div>
                          <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block' }}>{fn.name}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px', lineHeight: 1.3 }}>
                            {fn.description}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', borderTop: '1px solid var(--glass-border)', paddingTop: '24px' }}>
                <button className="btn btn-secondary" onClick={prevStep}>
                  <ArrowLeft size={18} /> Back
                </button>
                <button className="btn btn-primary" onClick={nextStep}>
                  Next: Current Services & Insurance <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CURRENT SERVICES & INSURANCE */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Insurance & Current Services</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                This allows us to audit double-coverage opportunities and highlight critical coverage gaps.
              </p>

              <div className="grid-cols-2">
                {/* Insurance Type */}
                <div className="form-group">
                  <label className="form-label">Primary Health Insurance</label>
                  <select
                    className="form-select"
                    value={formData.insuranceType}
                    onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })}
                  >
                    <option value="private">Private Employer Insurance Only</option>
                    <option value="medi-cal">Full-scope Medi-Cal / Medicaid Only</option>
                    <option value="both">Both (Private + Medi-Cal Secondary)</option>
                    <option value="none">Uninsured / None</option>
                  </select>
                </div>

                {/* School Status */}
                <div className="form-group">
                  <label className="form-label">School Accommodation Status</label>
                  <select
                    className="form-select"
                    value={formData.schoolStatus}
                    onChange={(e) => setFormData({ ...formData, schoolStatus: e.target.value })}
                  >
                    <option value="none">No School Accommodations / Not in school</option>
                    <option value="iep">Active Individualized Education Program (IEP)</option>
                    <option value="504">Active Section 504 Accommodation Plan</option>
                    <option value="early-start">Active Birth-to-3 IFSP / Infant services</option>
                  </select>
                </div>
              </div>

              {/* Current Services Checklist */}
              <div className="form-group" style={{ marginTop: '24px' }}>
                <label className="form-label" style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Is your child currently receiving support from these agencies?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="needs-selector-grid">
                  {[
                    { id: 'regional-centers', label: 'California Regional Center connection' },
                    { id: 'early-start', label: 'Early Start / Infant program active' },
                    { id: 'ihss-for-children', label: 'IHSS Caregiver funding active' },
                    { id: 'california-childrens-services', label: 'California Children\'s Services (CCS)' },
                    { id: 'ssi-for-children', label: 'Supplemental Security Income (SSI) Cash aid' },
                    { id: 'calable', label: 'CalABLE active savings account' }
                  ].map(serv => {
                    const active = formData.currentServiceIds.includes(serv.id);
                    return (
                      <div
                        key={serv.id}
                        onClick={() => toggleCurrentService(serv.id)}
                        className={`checkbox-card ${active ? 'active' : ''}`}
                        style={{ padding: '14px' }}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => {}}
                        />
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {serv.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '24px' }}>
                <label className="form-label">Caregiver Notes & Specific Concerns</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Tell us any specifics e.g. 'Struggling with pediatric audiology waitlists, or looking for parent advocate help in Orange County...'"
                  value={formData.caregiverNotes}
                  onChange={(e) => setFormData({ ...formData, caregiverNotes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', borderTop: '1px solid var(--glass-border)', paddingTop: '24px' }}>
                <button className="btn btn-secondary" onClick={prevStep}>
                  <ArrowLeft size={18} /> Back
                </button>
                <button className="btn btn-teal" onClick={nextStep} style={{ padding: '12px 32px' }}>
                  Scan Match Engine <Sparkles size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SCAN & PERSONALIZED PREVIEW */}
          {step === 4 && matchResult && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(20, 184, 166, 0.12)',
                  border: '1px solid var(--accent-teal)',
                  padding: '12px',
                  borderRadius: '50%',
                  color: 'var(--accent-teal)',
                  marginBottom: '16px',
                  boxShadow: '0 0 20px var(--accent-teal-glow)'
                }}>
                  <CheckCircle size={32} />
                </div>
                <h2 style={{ fontSize: '28px' }}>Personalized Preview Complete!</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '580px', margin: '8px auto 0' }}>
                  {matchResult.summaryRationale}
                </p>
              </div>

              {/* Rationale Quote */}
              <div style={{
                background: 'rgba(139, 92, 246, 0.04)',
                borderLeft: '4px solid var(--accent-purple)',
                padding: '18px 24px',
                borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                marginBottom: '32px',
                fontSize: '14px',
                lineHeight: 1.5
              }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '6px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Why these recommendations:
                </strong>
                <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                  "Because you entered {formData.nickname}, age {calculateAge(formData.dob).years}, residing in {counties.find(c => c.id === formData.countyId)?.name || 'CA'} County, with {formData.conditionIds.map(c => conditions.find(cond => cond.id === c)?.name).join(', ') || 'no formal diagnosis yet'}, functional challenges of {formData.functionalNeedIds.map(n => functionalNeeds.find(fn => fn.id === n)?.name).join(', ') || 'none selected'}, and insurance status, the system highly recommends checking these customized routes..."
                </span>
              </div>

              {/* Preview Matches list */}
              <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                High-Priority Matches Detected ({matchResult.highPriority.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                {matchResult.highPriority.map(prog => (
                  <div key={prog.id} className="glass-panel" style={{
                    padding: '20px',
                    borderColor: 'rgba(139, 92, 246, 0.25)',
                    background: 'rgba(17, 24, 44, 0.45)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{prog.name}</h4>
                      <span className="badge badge-purple">High Priority</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{prog.description}</p>
                    <div style={{ fontSize: '12px', color: 'var(--accent-teal)', background: 'rgba(20, 184, 166, 0.05)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(20,184,166,0.1)' }}>
                      <strong>Trigger:</strong> {prog.whyMatched}
                    </div>
                  </div>
                ))}

                {matchResult.possible.slice(0, 2).map(prog => (
                  <div key={prog.id} className="glass-panel" style={{ padding: '20px', background: 'rgba(17, 24, 44, 0.25)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>{prog.name}</h4>
                      <span className="badge badge-teal">Possible Benefit</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{prog.description}</p>
                  </div>
                ))}
              </div>

              {/* Action Panel Call to Action */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(25, 35, 60, 0.8) 0%, rgba(13, 148, 136, 0.1) 100%)',
                border: '1px solid var(--accent-teal)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Save Leo's Benefits Navigator Plan</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', maxWidth: '520px', margin: '0 auto 24px' }}>
                  Create your free account dashboard to claim this plan. Unlock the step-by-step application tracker, custom document checklists, timeline calendar, and reminders.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }} className="screener-final-actions">
                  <button className="btn btn-teal" onClick={handleRegister} style={{ padding: '14px 28px' }}>
                    <UserPlus size={18} /> Create Free Account Dashboard
                  </button>
                  <button className="btn btn-secondary" onClick={prevStep} style={{ padding: '14px 24px' }}>
                    <ArrowLeft size={18} /> Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 600px) {
          .needs-selector-grid {
            grid-template-columns: 1fr !important;
          }
          .screener-final-actions {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .screener-final-actions button {
            width: 100%;
          }
        }
      `}} />
    </section>
  );
}
