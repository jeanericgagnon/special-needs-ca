'use client';

import React from 'react';
import { Clock, Scale, ShieldCheck } from 'lucide-react';
import { LetterTemplateType, useChildProfile } from './ChildProfileContext';

const parseDays = (daysStr: string | undefined, defaultDays: number) => {
  if (!daysStr) return defaultDays;
  const match = daysStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : defaultDays;
};

interface IepConcerns {
  speech: boolean;
  sensory: boolean;
  academic: boolean;
  fineMotor: boolean;
  social: boolean;
  behavioral: boolean;
}

interface IhssSafetyConcerns {
  elopement: boolean;
  pica: boolean;
  selfInjury: boolean;
  climbing: boolean;
  electricalSafety: boolean;
}

interface RcLimitations {
  receptiveLanguage: boolean;
  expressiveLanguage: boolean;
  learning: boolean;
  mobility: boolean;
  selfCare: boolean;
  selfDirection: boolean;
}

interface AppealsFormProps {
  activeTemplate: LetterTemplateType;
  isSpanish: boolean;
  t: Record<string, string>;
  calculateDateOffset: (baseDateStr: string, offsetDays: number) => string;

  // IEP State
  schoolDistrict: string;
  setSchoolDistrict: (v: string) => void;
  schoolName: string;
  setSchoolName: (v: string) => void;
  iepSubmissionDate: string;
  setIepSubmissionDate: (v: string) => void;
  iepConcerns: IepConcerns;
  setIepConcerns: React.Dispatch<React.SetStateAction<IepConcerns>>;
  customIepText: string;
  setCustomIepText: (v: string) => void;

  // IHSS State
  ihssCounty: string;
  setIhssCounty: (v: string) => void;
  ihssDenialDate: string;
  setIhssDenialDate: (v: string) => void;
  ihssSafetyConcerns: IhssSafetyConcerns;
  setIhssSafetyConcerns: React.Dispatch<React.SetStateAction<IhssSafetyConcerns>>;
  customIhssText: string;
  setCustomIhssText: (v: string) => void;

  // Regional Center State
  regionalCenterName: string;
  setRegionalCenterName: (v: string) => void;
  rcDenialDate: string;
  setRcDenialDate: (v: string) => void;
  rcDiagnosis: string;
  setRcDiagnosis: (v: string) => void;
  rcLimitations: RcLimitations;
  setRcLimitations: React.Dispatch<React.SetStateAction<RcLimitations>>;
  customRcText: string;
  setCustomRcText: (v: string) => void;

  // SSI State
  ssiDate: string;
  setSsiDate: (v: string) => void;
  ssiDiagnosis: string;
  setSsiDiagnosis: (v: string) => void;
  ssiClinicInfo: string;
  setSsiClinicInfo: (v: string) => void;
  customSsiText: string;
  setCustomSsiText: (v: string) => void;

  // EPSDT State
  therapyType: string;
  setTherapyType: (v: string) => void;
  denialReason: string;
  setDenialReason: (v: string) => void;
  insurancePlanName: string;
  setInsurancePlanName: (v: string) => void;
  prescribingDoctor: string;
  setPrescribingDoctor: (v: string) => void;
  customTherapyText: string;
  setCustomTherapyText: (v: string) => void;
}

export default function AppealsForm({
  activeTemplate,
  isSpanish,
  t,
  calculateDateOffset,

  // IEP
  schoolDistrict,
  setSchoolDistrict,
  schoolName,
  setSchoolName,
  iepSubmissionDate,
  setIepSubmissionDate,
  iepConcerns,
  setIepConcerns,
  customIepText,
  setCustomIepText,

  // IHSS
  ihssCounty,
  setIhssCounty,
  ihssDenialDate,
  setIhssDenialDate,
  ihssSafetyConcerns,
  setIhssSafetyConcerns,
  customIhssText,
  setCustomIhssText,

  // RC
  regionalCenterName,
  setRegionalCenterName,
  rcDenialDate,
  setRcDenialDate,
  rcDiagnosis,
  setRcDiagnosis,
  rcLimitations,
  setRcLimitations,
  customRcText,
  setCustomRcText,

  // SSI
  ssiDate,
  setSsiDate,
  ssiDiagnosis,
  setSsiDiagnosis,
  ssiClinicInfo,
  setSsiClinicInfo,
  customSsiText,
  setCustomSsiText,

  // EPSDT
  therapyType,
  setTherapyType,
  denialReason,
  setDenialReason,
  insurancePlanName,
  setInsurancePlanName,
  prescribingDoctor,
  setPrescribingDoctor,
  customTherapyText,
  setCustomTherapyText
}: AppealsFormProps) {
  const { stateConfig } = useChildProfile();
  const planDays = parseDays(stateConfig?.timelineDaysPlan, 15);
  const meetingDays = parseDays(stateConfig?.timelineDaysMeeting, 60);

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      {/* IEP Request Fields */}
      {activeTemplate === 'iep-request' && (
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t.iepParamsTitle}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            {t.iepParamsSub}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.schoolDistrictLabel}</label>
              <input 
                type="text" 
                value={schoolDistrict} 
                onChange={(e) => setSchoolDistrict(e.target.value)} 
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.schoolNameLabel}</label>
              <input 
                type="text" 
                value={schoolName} 
                onChange={(e) => setSchoolName(e.target.value)} 
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{t.iepSuspectedDelay}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={iepConcerns.speech}
                  onChange={(e) => setIepConcerns(prev => ({ ...prev, speech: e.target.checked }))}
                />
                <span>{t.iepSpeechConcerns}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={iepConcerns.sensory}
                  onChange={(e) => setIepConcerns(prev => ({ ...prev, sensory: e.target.checked }))}
                />
                <span>{t.iepSensoryConcerns}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={iepConcerns.academic}
                  onChange={(e) => setIepConcerns(prev => ({ ...prev, academic: e.target.checked }))}
                />
                <span>{t.iepAcademicConcerns}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={iepConcerns.fineMotor}
                  onChange={(e) => setIepConcerns(prev => ({ ...prev, fineMotor: e.target.checked }))}
                />
                <span>{t.iepFineMotorConcerns}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={iepConcerns.social}
                  onChange={(e) => setIepConcerns(prev => ({ ...prev, social: e.target.checked }))}
                />
                <span>{t.iepSocialConcerns}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={iepConcerns.behavioral}
                  onChange={(e) => setIepConcerns(prev => ({ ...prev, behavioral: e.target.checked }))}
                />
                <span>{t.iepBehavioralConcerns}</span>
              </label>
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.85rem' }}>{t.iepObservedChallenges}</label>
            <textarea 
              value={customIepText}
              onChange={(e) => setCustomIepText(e.target.value)}
              style={{ width: '100%', minHeight: '80px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
            />
          </div>

          {/* Interactive Statutory IEP Timeline Calculator */}
          <div style={{ 
            marginTop: '1.5rem', 
            borderTop: '1px dashed var(--glass-border)', 
            paddingTop: '1.25rem',
            background: 'rgba(var(--primary-rgb), 0.03)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid rgba(var(--primary-rgb), 0.08)'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={14} color="var(--primary-color)" /> {t.iepTimelineTitle}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
              {t.iepTimelineSub}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>{t.submissionDateLabel}</label>
                <input 
                  type="date"
                  value={iepSubmissionDate}
                  onChange={(e) => setIepSubmissionDate(e.target.value)}
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%' }}
                />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', paddingBottom: '0.4rem' }}>
                {t.iepStatCode}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.8rem', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.25rem' }}>
                <span>{t.iepTimeline1}</span>
                <strong style={{ color: 'var(--primary-color)' }}>{calculateDateOffset(iepSubmissionDate, planDays)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.25rem' }}>
                <span>{t.iepTimeline2}</span>
                <strong>{calculateDateOffset(iepSubmissionDate, planDays)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t.iepTimeline3}</span>
                <strong style={{ color: '#10b981' }}>{calculateDateOffset(iepSubmissionDate, planDays + meetingDays)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IHSS Appeal Fields */}
      {activeTemplate === 'ihss-appeal' && (
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t.ihssParamsTitle}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            {t.ihssParamsSub}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.countyNameLabel}</label>
              <input 
                type="text" 
                value={ihssCounty} 
                onChange={(e) => setIhssCounty(e.target.value)} 
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.noticeDateLabel}</label>
              <input 
                type="date" 
                value={ihssDenialDate} 
                onChange={(e) => setIhssDenialDate(e.target.value)} 
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{t.ihssHazardsLabel}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={ihssSafetyConcerns.elopement}
                  onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, elopement: e.target.checked }))}
                />
                <span>{t.ihssElopement}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={ihssSafetyConcerns.pica}
                  onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, pica: e.target.checked }))}
                />
                <span>{t.ihssPica}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={ihssSafetyConcerns.selfInjury}
                  onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, selfInjury: e.target.checked }))}
                />
                <span>{t.ihssSelfInjury}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={ihssSafetyConcerns.climbing}
                  onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, climbing: e.target.checked }))}
                />
                <span>{t.ihssClimbing}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={ihssSafetyConcerns.electricalSafety}
                  onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, electricalSafety: e.target.checked }))}
                />
                <span>{t.ihssElectrical}</span>
              </label>
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.85rem' }}>{t.ihssDescriptionLabel}</label>
            <textarea 
              value={customIhssText}
              onChange={(e) => setCustomIhssText(e.target.value)}
              style={{ width: '100%', minHeight: '80px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
            />
          </div>

          {/* Statutory IHSS Appeal Deadline warning */}
          <div style={{ 
            marginTop: '1.5rem', 
            borderTop: '1px dashed var(--glass-border)', 
            paddingTop: '1.25rem',
            background: 'rgba(239, 68, 68, 0.02)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.08)'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Scale size={14} color="#ef4444" /> {t.ihssTimelineTitle}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
              {t.ihssTimelineSub}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span>{t.noaDateLabel}</span>
              <strong>{ihssDenialDate ? new Date(ihssDenialDate + 'T00:00:00').toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.4rem', borderTop: '1px dashed var(--glass-border)', paddingTop: '0.4rem' }}>
              <span style={{ color: '#b91c1c', fontWeight: 600 }}>{t.filingDeadlineLabel}</span>
              <strong style={{ color: '#ef4444' }}>{calculateDateOffset(ihssDenialDate, 90)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Regional Center Appeal Fields */}
      {activeTemplate === 'rc-appeal' && (
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t.rcParamsTitle}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            {t.rcParamsSub}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.rcNameLabel}</label>
              <input 
                type="text" 
                value={regionalCenterName} 
                onChange={(e) => setRegionalCenterName(e.target.value)} 
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.rcDenialDateLabel}</label>
              <input 
                type="date" 
                value={rcDenialDate} 
                onChange={(e) => setRcDenialDate(e.target.value)} 
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.rcDiagnosisLabel}</label>
              <input 
                type="text" 
                value={rcDiagnosis} 
                onChange={(e) => setRcDiagnosis(e.target.value)} 
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{t.rcLimitationsLabel}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={rcLimitations.receptiveLanguage}
                  onChange={(e) => setRcLimitations(prev => ({ ...prev, receptiveLanguage: e.target.checked }))}
                />
                <span>{t.rcReceptive}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={rcLimitations.expressiveLanguage}
                  onChange={(e) => setRcLimitations(prev => ({ ...prev, expressiveLanguage: e.target.checked }))}
                />
                <span>{t.rcExpressive}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={rcLimitations.learning}
                  onChange={(e) => setRcLimitations(prev => ({ ...prev, learning: e.target.checked }))}
                />
                <span>{t.rcLearning}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={rcLimitations.mobility}
                  onChange={(e) => setRcLimitations(prev => ({ ...prev, mobility: e.target.checked }))}
                />
                <span>{t.rcMobility}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={rcLimitations.selfCare}
                  onChange={(e) => setRcLimitations(prev => ({ ...prev, selfCare: e.target.checked }))}
                />
                <span>{t.rcSelfCare}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={rcLimitations.selfDirection}
                  onChange={(e) => setRcLimitations(prev => ({ ...prev, selfDirection: e.target.checked }))}
                />
                <span>{t.rcSelfDirection}</span>
              </label>
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.85rem' }}>{t.rcDescLabel}</label>
            <textarea 
              value={customRcText}
              onChange={(e) => setCustomRcText(e.target.value)}
              style={{ width: '100%', minHeight: '80px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
            />
          </div>

          {/* Statutory Lanterman Appeal Deadline warning */}
          <div style={{ 
            marginTop: '1.5rem', 
            borderTop: '1px dashed var(--glass-border)', 
            paddingTop: '1.25rem',
            background: 'rgba(239, 68, 68, 0.02)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.08)'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Scale size={14} color="#ef4444" /> {t.rcTimelineTitle}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
              {t.rcTimelineSub}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span>{isSpanish ? 'Fecha de Aviso de Denegación:' : 'Denial Notice Date:'}</span>
              <strong>{rcDenialDate ? new Date(rcDenialDate + 'T00:00:00').toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.4rem', borderTop: '1px dashed var(--glass-border)', paddingTop: '0.4rem' }}>
              <span style={{ color: '#b91c1c', fontWeight: 600 }}>{t.filingDeadlineLabel}</span>
              <strong style={{ color: '#ef4444' }}>{calculateDateOffset(rcDenialDate, 30)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* SSI Reconsideration Fields */}
      {activeTemplate === 'ssi-reconsideration' && (
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t.ssiParamsTitle}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            {t.ssiParamsSub}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.ssiDenialDateLabel}</label>
              <input 
                type="date" 
                value={ssiDate} 
                onChange={(e) => setSsiDate(e.target.value)} 
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.ssiDiagnosisLabel}</label>
              <input 
                type="text" 
                value={ssiDiagnosis} 
                onChange={(e) => setSsiDiagnosis(e.target.value)} 
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.ssiClinicLabel}</label>
              <input 
                type="text" 
                value={ssiClinicInfo} 
                onChange={(e) => setSsiClinicInfo(e.target.value)} 
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.85rem' }}>{t.ssiDescLabel}</label>
            <textarea 
              value={customSsiText}
              onChange={(e) => setCustomSsiText(e.target.value)}
              style={{ width: '100%', minHeight: '80px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
            />
          </div>

          {/* Statutory SSI Reconsideration Deadline warning */}
          <div style={{ 
            marginTop: '1.5rem', 
            borderTop: '1px dashed var(--glass-border)', 
            paddingTop: '1.25rem',
            background: 'rgba(239, 68, 68, 0.02)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.08)'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Scale size={14} color="#ef4444" /> {t.ssiTimelineTitle}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
              {t.ssiTimelineSub}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span>{isSpanish ? 'Fecha de Aviso de Denegación:' : 'Denial Notice Date:'}</span>
              <strong>{ssiDate ? new Date(ssiDate + 'T00:00:00').toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.4rem', borderTop: '1px dashed var(--glass-border)', paddingTop: '0.4rem' }}>
              <span style={{ color: '#b91c1c', fontWeight: 600 }}>{t.filingDeadlineLabel}</span>
              <strong style={{ color: '#ef4444' }}>{calculateDateOffset(ssiDate, 60)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* EPSDT Therapy Fields */}
      {activeTemplate === 'epsdt-therapy' && (
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t.epsdtParamsTitle}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            {t.epsdtParamsSub}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.therapyTypeLabel}</label>
              <select 
                value={therapyType} 
                onChange={(e) => setTherapyType(e.target.value)} 
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', background: 'var(--card-bg, white)', color: 'var(--text-main)' }}
              >
                <option value="Speech-Language Therapy">{isSpanish ? 'Terapia de Habla y Lenguaje' : 'Speech-Language Therapy'}</option>
                <option value="Occupational Therapy">{isSpanish ? 'Terapia Ocupacional' : 'Occupational Therapy'}</option>
                <option value="Physical Therapy">{isSpanish ? 'Terapia Física' : 'Physical Therapy'}</option>
                <option value="Feeding Therapy">{isSpanish ? 'Terapia de Alimentación' : 'Feeding Therapy'}</option>
                <option value="Behavioral Therapy (ABA)">{isSpanish ? 'Terapia Conductual (ABA)' : 'Behavioral Therapy (ABA)'}</option>
                <option value="Mental Health / Psychotherapy">{isSpanish ? 'Salud Mental / Psicoterapia' : 'Mental Health / Psychotherapy'}</option>
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.denialReasonLabel}</label>
              <select 
                value={denialReason} 
                onChange={(e) => setDenialReason(e.target.value)} 
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', background: 'var(--card-bg, white)', color: 'var(--text-main)' }}
              >
                <option value="Excludes developmental delays / Not rehabilitative">{isSpanish ? 'Excluye retrasos del desarrollo / No rehabilitadora' : 'Excludes developmental delays / Not rehabilitative'}</option>
                <option value="Not medically necessary">{isSpanish ? 'No es médicamente necesaria' : 'Not medically necessary'}</option>
                <option value="Exceeds annual session limits">{isSpanish ? 'Excede los límites anuales de sesiones' : 'Exceeds annual session limits'}</option>
                <option value="Lack of progress / Maintenance care only">{isSpanish ? 'Falta de progreso / Solo cuidado de mantenimiento' : 'Lack of progress / Maintenance care only'}</option>
                <option value="Out-of-network provider">{isSpanish ? 'Proveedor fuera de la red' : 'Out-of-network provider'}</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.insuranceNameLabel}</label>
              <input 
                type="text" 
                value={insurancePlanName} 
                onChange={(e) => setInsurancePlanName(e.target.value)} 
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem' }}>{t.physicianLabel}</label>
              <input 
                type="text" 
                value={prescribingDoctor} 
                onChange={(e) => setPrescribingDoctor(e.target.value)} 
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.85rem' }}>{t.epsdtDescLabel}</label>
            <textarea 
              value={customTherapyText}
              onChange={(e) => setCustomTherapyText(e.target.value)}
              style={{ width: '100%', minHeight: '100px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
            />
          </div>

          {/* Statutory EPSDT Appeal Timeline warning */}
          <div style={{ 
            marginTop: '1.5rem', 
            borderTop: '1px dashed var(--glass-border)', 
            paddingTop: '1.25rem',
            background: 'rgba(59, 130, 246, 0.02)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.08)'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={14} color="#3b82f6" /> {t.epsdtTimelineTitle}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
              {t.epsdtTimelineSub}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.25rem' }}>
                <span>{t.epsdtTimeline1}</span>
                <strong style={{ color: '#10b981' }}>{t.epsdtTimeline1Val}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.25rem' }}>
                <span>{t.epsdtTimeline2}</span>
                <strong>{t.epsdtTimeline2Val}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t.epsdtTimeline3}</span>
                <strong>{t.epsdtTimeline3Val}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
