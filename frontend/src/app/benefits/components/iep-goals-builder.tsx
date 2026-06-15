'use client';

import React, { useState } from 'react';
import { BookOpen, Check, Copy, Printer, Settings } from 'lucide-react';

import { IEPAccommodation, SMARTGoalTemplate } from '@/lib/iep-data';

interface IepGoalsBuilderProps {
  diagnosisName: string;
  accommodations: IEPAccommodation[];
  goals: SMARTGoalTemplate[];
}

export default function IepGoalsBuilder({ diagnosisName, accommodations, goals }: IepGoalsBuilderProps) {
  const [selectedAccs, setSelectedAccs] = useState<string[]>(accommodations.map(a => a.id));
  const [selectedGoals, setSelectedGoals] = useState<string[]>(goals.map(g => g.id));
  const [childName, setChildName] = useState('[Child]');
  const [successRate, setSuccessRate] = useState('80%');
  const [trials, setTrials] = useState('4 out of 5 opportunities');
  const [weeks, setWeeks] = useState('4 consecutive weeks');
  const [copied, setCopied] = useState(false);

  const toggleAcc = (id: string) => {
    setSelectedAccs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const renderGoalText = (goal: SMARTGoalTemplate) => {
    return goal.templateText
      .replace(/\{\{name\}\}/g, childName)
      .replace(/\{\{success_rate\}\}/g, successRate)
      .replace(/\{\{trials\}\}/g, goal.defaultTokens.trials || '4')
      .replace(/\{\{duration\}\}/g, goal.defaultTokens.duration || '2')
      .replace(/\{\{baseline\}\}/g, goal.defaultTokens.baseline || 'baseline')
      .replace(/\{\{target\}\}/g, goal.defaultTokens.target || 'target')
      .replace(/\{\{work_duration\}\}/g, goal.defaultTokens.work_duration || '20')
      .replace(/\{\{on_task_min\}\}/g, goal.defaultTokens.on_task_min || '15')
      .replace(/\{\{redirections\}\}/g, goal.defaultTokens.redirections || '2')
      .replace(/\{\{weeks\}\}/g, weeks)
      .replace(/\{\{words_count\}\}/g, goal.defaultTokens.words_count || '4 to 5')
      .replace(/\{\{cues\}\}/g, goal.defaultTokens.cues || '1')
      .replace(/\{\{steps_count\}\}/g, goal.defaultTokens.steps_count || '3-step')
      .replace(/\{\{words_type\}\}/g, goal.defaultTokens.words_type || 'grade-level')
      .replace(/\{\{words_per_minute\}\}/g, goal.defaultTokens.words_per_minute || '65')
      .replace(/\{\{score_target\}\}/g, goal.defaultTokens.score_target || '3');
  };

  const handleCopy = () => {
    const textParts = [
      `IEP Accommodations and SMART Goals Blueprint for ${childName}`,
      `Diagnosis: ${diagnosisName}`,
      `Generated via Ablefull (ablefull.org)`,
      `==========================================`,
      `\nSELECTED ACCOMMODATIONS:`
    ];

    accommodations.forEach(acc => {
      if (selectedAccs.includes(acc.id)) {
        textParts.push(`- ${acc.title}: ${acc.description} (Rationale: ${acc.rationale})`);
      }
    });

    textParts.push(`\nSELECTED SMART GOALS:`);
    goals.forEach(goal => {
      if (selectedGoals.includes(goal.id)) {
        textParts.push(`- ${goal.title} (${goal.area}):\n  "${renderGoalText(goal)}"`);
      }
    });

    navigator.clipboard.writeText(textParts.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-panel" style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }} className="no-print">
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <BookOpen color="var(--primary-color)" size={24} />
          <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Interactive IEP Goals & Accommodations Builder</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={handleCopy} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <button className="btn-primary" onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
            <Printer size={14} />
            Print Custom Blueprint
          </button>
        </div>
      </div>

      <div style={{ background: 'rgba(var(--primary-rgb), 0.02)', border: '1px solid rgba(var(--primary-rgb), 0.08)', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }} className="no-print">
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            <Settings size={12} style={{ display: 'inline', marginRight: '3px' }} /> Child Name
          </label>
          <input 
            type="text" 
            value={childName} 
            onChange={(e) => setChildName(e.target.value)} 
            placeholder="Child Name"
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.9rem' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Success Target
          </label>
          <input 
            type="text" 
            value={successRate} 
            onChange={(e) => setSuccessRate(e.target.value)} 
            placeholder="e.g. 80%"
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.9rem' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Trial Frequency
          </label>
          <input 
            type="text" 
            value={trials} 
            onChange={(e) => setTrials(e.target.value)} 
            placeholder="e.g. 4 out of 5 trials"
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.9rem' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Time Duration
          </label>
          <input 
            type="text" 
            value={weeks} 
            onChange={(e) => setWeeks(e.target.value)} 
            placeholder="e.g. 4 consecutive weeks"
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Accommodations Checklist */}
        <div className="no-print">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-color)', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.4rem' }}>
            Select Accommodations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {accommodations.map(acc => (
              <div 
                key={acc.id} 
                onClick={() => toggleAcc(acc.id)}
                style={{ 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  border: '1px solid',
                  borderColor: selectedAccs.includes(acc.id) ? 'rgba(var(--primary-rgb), 0.3)' : 'rgba(0,0,0,0.06)',
                  background: selectedAccs.includes(acc.id) ? 'rgba(var(--primary-rgb), 0.01)' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ 
                  height: '18px', 
                  width: '18px', 
                  borderRadius: '4px', 
                  border: '1px solid',
                  borderColor: selectedAccs.includes(acc.id) ? 'var(--primary-color)' : 'rgba(0,0,0,0.3)',
                  background: selectedAccs.includes(acc.id) ? 'var(--primary-color)' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  {selectedAccs.includes(acc.id) && <Check size={12} color="white" />}
                </div>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>{acc.title}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '0 0 0.4rem 0', lineHeight: 1.4 }}>{acc.description}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontStyle: 'italic', display: 'block' }}>
                    <strong>Rationale:</strong> {acc.rationale}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Checklist */}
        <div className="no-print">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-color)', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.4rem' }}>
            Select SMART Goals
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {goals.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                No clinical goal templates pre-formatted for this specific diagnosis. Bring general developmental milestones to request evaluation.
              </p>
            ) : (
              goals.map(goal => (
                <div 
                  key={goal.id} 
                  onClick={() => toggleGoal(goal.id)}
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    border: '1px solid',
                    borderColor: selectedGoals.includes(goal.id) ? 'rgba(var(--primary-rgb), 0.3)' : 'rgba(0,0,0,0.06)',
                    background: selectedGoals.includes(goal.id) ? 'rgba(var(--primary-rgb), 0.01)' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ 
                    height: '18px', 
                    width: '18px', 
                    borderRadius: '4px', 
                    border: '1px solid',
                    borderColor: selectedGoals.includes(goal.id) ? 'var(--primary-color)' : 'rgba(0,0,0,0.3)',
                    background: selectedGoals.includes(goal.id) ? 'var(--primary-color)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {selectedGoals.includes(goal.id) && <Check size={12} color="white" />}
                  </div>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{goal.title}</strong>
                      <span style={{ fontSize: '0.7rem', background: 'rgba(var(--primary-rgb), 0.08)', color: 'var(--primary-color)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                        {goal.area}
                      </span>
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: 'var(--text-light)', 
                      lineHeight: '1.4', 
                      background: 'rgba(0,0,0,0.01)', 
                      padding: '0.5rem 0.75rem', 
                      borderRadius: '8px', 
                      border: '1px dashed rgba(0,0,0,0.06)',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {renderGoalText(goal)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Print-Only Representation */}
      <div className="print-only" style={{ display: 'none', borderTop: '2px solid #000', paddingTop: '1.5rem', marginTop: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>IEP Accommodations & SMART Goals Blueprint</h2>
          <p style={{ fontSize: '1rem', color: '#666', margin: 0 }}>Prepared for: <strong>{childName}</strong> | Diagnosis: <strong>{diagnosisName}</strong></p>
          <span style={{ fontSize: '0.8rem', color: '#999' }}>Generated via Ablefull (ablefull.org)</span>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', borderBottom: '1px solid #ddd', paddingBottom: '0.3rem', marginBottom: '1rem' }}>Selected School Accommodations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {accommodations.filter(a => selectedAccs.includes(a.id)).map(acc => (
              <div key={acc.id} style={{ pageBreakInside: 'avoid' }}>
                <strong style={{ fontSize: '1rem' }}>{acc.title}</strong>
                <p style={{ fontSize: '0.9rem', margin: '0.2rem 0' }}>{acc.description}</p>
                <span style={{ fontSize: '0.85rem', color: '#555', fontStyle: 'italic' }}>
                  <strong>Rationale for IEP Team:</strong> {acc.rationale}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.3rem', borderBottom: '1px solid #ddd', paddingBottom: '0.3rem', marginBottom: '1rem' }}>Draft SMART Goal Templates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {goals.filter(g => selectedGoals.includes(g.id)).map(goal => (
              <div key={goal.id} style={{ pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '1rem' }}>{goal.title}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>{goal.area}</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontStyle: 'italic', background: '#f9f9f9', padding: '0.75rem', borderRadius: '6px', border: '1px solid #eee' }}>
                  &quot;{renderGoalText(goal)}&quot;
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
