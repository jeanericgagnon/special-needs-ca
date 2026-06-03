'use client';

import React, { useState, useEffect } from 'react';
import { useChildProfile } from './ChildProfileContext';
import { saveChildIepAction } from '../child-actions';
import { 
  Layers, BookOpen
} from 'lucide-react';
import CopyButton from '@/components/copy-button';
import { IEP_ACCOMMODATIONS, SMART_GOAL_TEMPLATES, SMARTGoalTemplate } from '@/lib/iep-data';

export default function IEPGoalsPanel() {
  const { currentChild, savedIepData, counties } = useChildProfile();

  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [tokenOverrides, setTokenOverrides] = useState<Record<string, Record<string, string>>>({});
  const [iepSaveStatus, setIepSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Hydrate child parameters on profile swap
  useEffect(() => {
    if (currentChild) {
      Promise.resolve().then(() => {
        setIepSaveStatus({ type: null, message: '' });
        const localAccKey = `iep_acc_${currentChild.id}`;
        const localGoalsKey = `iep_goals_${currentChild.id}`;
        const localTokensKey = `iep_tokens_${currentChild.id}`;

        let initialAccs = savedIepData.accommodations || [];
        let initialGoals = savedIepData.goals.map(g => g.goal_template_id) || [];
        let initialTokens: Record<string, Record<string, string>> = {};

        savedIepData.goals.forEach(g => {
          try {
            initialTokens[g.goal_template_id] = JSON.parse(g.tokens_json);
          } catch {}
        });

        // Hydrate local cache fallbacks
        if (initialAccs.length === 0) {
          try {
            const cachedAccs = localStorage.getItem(localAccKey);
            if (cachedAccs) initialAccs = JSON.parse(cachedAccs);
          } catch {}
        }
        if (initialGoals.length === 0) {
          try {
            const cachedGoals = localStorage.getItem(localGoalsKey);
            if (cachedGoals) initialGoals = JSON.parse(cachedGoals);
          } catch {}
        }
        if (Object.keys(initialTokens).length === 0) {
          try {
            const cachedTokens = localStorage.getItem(localTokensKey);
            if (cachedTokens) initialTokens = JSON.parse(cachedTokens);
          } catch {}
        }

        setSelectedAccommodations(initialAccs);
        setSelectedGoals(initialGoals);
        setTokenOverrides(initialTokens);
      });
    }
  }, [currentChild, savedIepData]);

  if (!currentChild) return null;

  // Calculators
  const calculateAge = (dobString?: string) => {
    if (!dobString) return 0;
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  };

  const getGoalPreviewText = (goal: SMARTGoalTemplate) => {
    let text = goal.templateText;
    const tokens = {
      ...goal.defaultTokens,
      name: currentChild.nickname,
      ...(tokenOverrides[goal.id] || {})
    };

    Object.entries(tokens).forEach(([key, val]) => {
      text = text.replace(new RegExp(`{{${key}}}`, 'g'), val || `[${key}]`);
    });
    return text;
  };

  const getFullBlueprintText = () => {
    let text = `SPECIAL ED BLUEPRINT FOR: ${currentChild.nickname.toUpperCase()}\n`;
    text += `Age: ${calculateAge(currentChild.dob)} | County: ${counties.find(c => c.id === currentChild.county_id)?.name || currentChild.county_id}\n`;
    text += `==================================================\n\n`;

    text += `CLASSROOM ACCOMMODATIONS:\n`;
    if (selectedAccommodations.length === 0) {
      text += `- None selected\n`;
    } else {
      selectedAccommodations.forEach(id => {
        const item = IEP_ACCOMMODATIONS.find(a => a.id === id);
        if (item) text += `- [${item.category}] ${item.title}: ${item.description}\n`;
      });
    }

    text += `\nMEASURABLE SMART GOALS:\n`;
    if (selectedGoals.length === 0) {
      text += `- None selected\n`;
    } else {
      selectedGoals.forEach((id, idx) => {
        const item = SMART_GOAL_TEMPLATES.find(g => g.id === id);
        if (item) text += `${idx + 1}. ${item.title}:\n   "${getGoalPreviewText(item)}"\n`;
      });
    }

    return text;
  };

  const handleSaveIepPlan = async () => {
    setIepSaveStatus({ type: null, message: '' });

    const goalsToSave = selectedGoals.map(templateId => {
      const template = SMART_GOAL_TEMPLATES.find(t => t.id === templateId);
      let goalText = template?.templateText || '';
      const tokens = {
        ...template?.defaultTokens,
        name: currentChild.nickname,
        ...(tokenOverrides[templateId] || {})
      };

      Object.entries(tokens).forEach(([key, val]) => {
        goalText = goalText.replace(new RegExp(`{{${key}}}`, 'g'), val || '');
      });

      return {
        templateId,
        text: goalText,
        tokens: tokenOverrides[templateId] || {}
      };
    });

    const res = await saveChildIepAction(currentChild.id, selectedAccommodations, goalsToSave);

    // Sync to localstorage (local cache fallback)
    localStorage.setItem(`iep_acc_${currentChild.id}`, JSON.stringify(selectedAccommodations));
    localStorage.setItem(`iep_goals_${currentChild.id}`, JSON.stringify(selectedGoals));
    localStorage.setItem(`iep_tokens_${currentChild.id}`, JSON.stringify(tokenOverrides));

    if (res.success) {
      setIepSaveStatus({ type: 'success', message: 'IEP Plan successfully updated on the database!' });
      setTimeout(() => setIepSaveStatus({ type: null, message: '' }), 4000);
    } else {
      setIepSaveStatus({ type: 'error', message: res.error || 'Failed to update IEP Plan.' });
    }
  };

  return (
    <div className="animate-fade-in iep-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Accommodations Checklist */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Layers size={20} color="var(--primary-color)" />
            IEP Accommodation Checklist
          </h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Check accommodations to request in your child&apos;s classroom.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {IEP_ACCOMMODATIONS.map(acc => {
              const isChecked = selectedAccommodations.includes(acc.id);
              return (
                <div 
                  key={acc.id}
                  onClick={() => {
                    setSelectedAccommodations(prev => prev.includes(acc.id) ? prev.filter(x => x !== acc.id) : [...prev, acc.id]);
                  }}
                  style={{
                    padding: '1rem',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: isChecked ? 'var(--primary-color)' : 'var(--glass-border)',
                    background: isChecked ? 'rgba(var(--primary-rgb), 0.03)' : 'rgba(255,255,255,0.4)',
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'flex-start'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => {}}
                    style={{ marginTop: '3px', cursor: 'pointer', flexShrink: 0 }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.9rem', display: 'block' }}>{acc.title}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', marginTop: '0.1rem' }}>{acc.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Goal templates selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} color="var(--primary-color)" />
            Measurable SMART IEP Goals
          </h3>

          {SMART_GOAL_TEMPLATES.map(goal => {
            const isAdded = selectedGoals.includes(goal.id);
            const tokens = Object.keys(goal.defaultTokens).filter(k => k !== 'name');

            return (
              <div 
                key={goal.id}
                className="glass-panel"
                style={{
                  borderLeft: isAdded ? '6px solid var(--primary-color)' : '1px solid var(--glass-border)',
                  background: isAdded ? 'rgba(var(--primary-rgb), 0.02)' : 'var(--glass-bg)',
                  padding: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ background: 'rgba(0,0,0,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{goal.area}</span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.25rem 0 0 0' }}>{goal.title}</h4>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedGoals(prev => prev.includes(goal.id) ? prev.filter(x => x !== goal.id) : [...prev, goal.id]);
                    }}
                    className="btn-primary"
                    style={{
                      width: 'auto',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem',
                      background: isAdded ? '#ef4444' : 'var(--primary-color)'
                    }}
                  >
                    {isAdded ? 'Remove' : 'Add to Plan'}
                  </button>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.06)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  &quot;{getGoalPreviewText(goal)}&quot;
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginTop: '1rem' }}>
                  {tokens.map(tk => {
                    const currentVal = tokenOverrides[goal.id]?.[tk] !== undefined 
                      ? tokenOverrides[goal.id][tk] 
                      : goal.defaultTokens[tk];

                    return (
                      <div key={tk} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <label style={{ fontSize: '0.72rem', color: 'var(--text-light)', textTransform: 'capitalize' }}>{tk.replace(/_/g, ' ')}</label>
                        <input 
                          type="text" 
                          value={currentVal}
                          onChange={(e) => {
                            setTokenOverrides(prev => ({
                              ...prev,
                              [goal.id]: {
                                ...(prev[goal.id] || {}),
                                [tk]: e.target.value
                              }
                            }));
                          }}
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Sidebar summary */}
      <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-panel" style={{ border: '2px solid var(--primary-color)', padding: '1.25rem' }}>
          <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>Draft Agenda Summary</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
            Add items to your drafting agenda, save, and export for school teams.
          </p>

          <button 
            onClick={handleSaveIepPlan}
            className="btn-primary"
            style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', marginBottom: '1rem', width: '100%' }}
          >
            Save IEP Blueprint
          </button>

          {iepSaveStatus.message && (
            <div style={{ marginBottom: '1rem', fontSize: '0.75rem', color: iepSaveStatus.type === 'success' ? '#10b981' : '#ef4444', textAlign: 'center', fontWeight: 600 }}>
              {iepSaveStatus.message}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.3rem',
                background: 'rgba(var(--primary-rgb),0.08)',
                padding: '0.5rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--primary-color)',
                cursor: 'pointer'
              }}
            >
              <span>Copy Blueprint Code</span>
              <CopyButton text={getFullBlueprintText()} size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
