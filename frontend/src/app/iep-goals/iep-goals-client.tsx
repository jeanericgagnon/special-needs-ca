'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Settings, 
  BookOpen, 
  Layers, 
  SlidersHorizontal,
  FileText,
  HelpCircle
} from 'lucide-react';
import { IEP_ACCOMMODATIONS, SMART_GOAL_TEMPLATES, SMARTGoalTemplate } from '@/lib/iep-data';
import CopyButton from '@/components/copy-button';
import PrintButton from '@/components/print-button';
import ShareButton from '@/components/share-button';

export default function IepGoalsClient() {
  const [activeTab, setActiveTab] = useState<'goals' | 'statement'>('goals');

  // Parent Input Statement States
  const [strengths, setStrengths] = useState('Liam has a wonderful sense of humor, loves building with blocks, and is highly motivated by visual rewards.');
  const [academicConcerns, setAcademicConcerns] = useState('Liam is struggling with letter recognition and writing. He has difficulty remaining focused during group circles.');
  const [sensoryConcerns, setSensoryConcerns] = useState('He gets overwhelmed in loud settings (like the cafeteria) and struggles with unexpected transitions.');
  const [socialConcerns, setSocialConcerns] = useState('Liam struggles to initiate play with peers and tends to engage in parallel play rather than interactive play.');
  const [parentVision, setParentVision] = useState('Our vision is for Liam to communicate his needs independently, develop friendships, and fully access class curriculum with appropriate supports.');

  // Filters state
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');

  // Shared student state
  const [studentName, setStudentName] = useState<string>('Liam');

  // Custom token overrides state: templateId -> tokenKey -> value
  const [tokenOverrides, setTokenOverrides] = useState<Record<string, Record<string, string>>>({});

  // Selected items package state
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]); // template IDs

  // Load from local storage on mount
  useEffect(() => {
    const savedAccs = localStorage.getItem('iep_selected_accommodations');
    const savedGoals = localStorage.getItem('iep_selected_goals');
    const savedName = localStorage.getItem('iep_student_name') || localStorage.getItem('child_name') || localStorage.getItem('funding_child_name') || localStorage.getItem('ca_special_needs_safety_child');
    
    const savedStrengths = localStorage.getItem('iep_parent_strengths');
    const savedAcademic = localStorage.getItem('iep_parent_academic');
    const savedSensory = localStorage.getItem('iep_parent_sensory');
    const savedSocial = localStorage.getItem('iep_parent_social');
    const savedVision = localStorage.getItem('iep_parent_vision');

    const timer = setTimeout(() => {
      if (savedAccs) setSelectedAccommodations(JSON.parse(savedAccs));
      if (savedGoals) setSelectedGoals(JSON.parse(savedGoals));
      if (savedName) setStudentName(savedName);
      if (savedStrengths) setStrengths(savedStrengths);
      if (savedAcademic) setAcademicConcerns(savedAcademic);
      if (savedSensory) setSensoryConcerns(savedSensory);
      if (savedSocial) setSocialConcerns(savedSocial);
      if (savedVision) setParentVision(savedVision);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const updateStrengths = (val: string) => { setStrengths(val); localStorage.setItem('iep_parent_strengths', val); };
  const updateAcademic = (val: string) => { setAcademicConcerns(val); localStorage.setItem('iep_parent_academic', val); };
  const updateSensory = (val: string) => { setSensoryConcerns(val); localStorage.setItem('iep_parent_sensory', val); };
  const updateSocial = (val: string) => { setSocialConcerns(val); localStorage.setItem('iep_parent_social', val); };
  const updateVision = (val: string) => { setParentVision(val); localStorage.setItem('iep_parent_vision', val); };

  // Sync to local storage
  const saveToLocalStorage = (accs: string[], goals: string[], name: string) => {
    localStorage.setItem('iep_selected_accommodations', JSON.stringify(accs));
    localStorage.setItem('iep_selected_goals', JSON.stringify(goals));
    localStorage.setItem('iep_student_name', name);
    localStorage.setItem('child_name', name);
    localStorage.setItem('funding_child_name', name);
    localStorage.setItem('ca_special_needs_safety_child', name);
  };

  const handleNameChange = (val: string) => {
    setStudentName(val);
    saveToLocalStorage(selectedAccommodations, selectedGoals, val);
  };

  const toggleAccommodation = (id: string) => {
    const newAccs = selectedAccommodations.includes(id)
      ? selectedAccommodations.filter(x => x !== id)
      : [...selectedAccommodations, id];
    setSelectedAccommodations(newAccs);
    saveToLocalStorage(newAccs, selectedGoals, studentName);
  };

  const toggleGoal = (id: string) => {
    const newGoals = selectedGoals.includes(id)
      ? selectedGoals.filter(x => x !== id)
      : [...selectedGoals, id];
    setSelectedGoals(newGoals);
    saveToLocalStorage(selectedAccommodations, newGoals, studentName);
  };

  const clearPackage = () => {
    setSelectedAccommodations([]);
    setSelectedGoals([]);
    saveToLocalStorage([], [], studentName);
  };

  const handleTokenChange = (templateId: string, key: string, val: string) => {
    setTokenOverrides(prev => {
      const next = {
        ...prev,
        [templateId]: {
          ...(prev[templateId] || {}),
          [key]: val
        }
      };
      return next;
    });
  };

  // Compile full text of a goal with current token state
  const compileGoalText = (template: SMARTGoalTemplate) => {
    let text = template.templateText;
    const currentTokens = {
      ...template.defaultTokens,
      name: studentName,
      ...(tokenOverrides[template.id] || {})
    };

    Object.entries(currentTokens).forEach(([key, val]) => {
      text = text.replace(new RegExp(`{{${key}}}`, 'g'), val || `[${key}]`);
    });
    return text;
  };

  const compileParentStatementText = (): string => {
    const todayStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    return `PARENT CONCERNS & INPUT STATEMENT FOR THE IEP
Student Name: ${studentName}
Date: ${todayStr}
Submitted By: Parent / Legal Guardian

--------------------------------------------------
LEGAL CITATION REFERENCE (CALIFORNIA):
Under California Education Code Section 56341.1(a)(1), the IEP team is legally mandated to consider the concerns of the parent for enhancing the education of their child. The parent has the absolute right to have their input statement incorporated in full under Section A (Parent Concerns) of the student&apos;s IEP document.
--------------------------------------------------

1. STUDENT STRENGTHS, MOTIVATORS & PERSONAL INTERESTS:
${strengths || 'Not specified.'}

2. ACADEMIC & EDUCATIONAL CONCERNS:
${academicConcerns || 'Not specified.'}

3. SENSORY, REGULATION & PHYSICAL CHALLENGES:
${sensoryConcerns || 'Not specified.'}

4. SOCIAL, EMOTIONAL & PLAY SKILLS:
${socialConcerns || 'Not specified.'}

5. PARENTAL VISION FOR STUDENT&apos;S FUTURE & PROGRESS CRITERIA:
${parentVision || 'Not specified.'}

Submitted respectfully by,

[Caregiver Signature]
Parent / Legal Guardian`;
  };

  // Unique lists for filters
  const diagnoses = ['All', 'Autism Spectrum Disorder (ASD)', 'Attention Deficit Hyperactivity Disorder (ADHD)', 'Speech and Language Delay', 'Specific Learning Disability (SLD)'];
  const grades = ['All', 'Preschool/TK', 'Elementary', 'Middle & High School'];
  const areas = ['All', 'Social Skills', 'Focus & Attention', 'Executive Function', 'Reading & Writing', 'Sensory Regulation', 'Behavior', 'Self-Advocacy', 'Communication'];

  // Filter lists
  const filteredAccommodations = IEP_ACCOMMODATIONS.filter(acc => {
    if (selectedArea !== 'All') {
      const areaMap: Record<string, string> = {
        'Social Skills': 'Speech & Social',
        'Focus & Attention': 'Academic & Task',
        'Executive Function': 'Academic & Task',
        'Reading & Writing': 'Academic & Task',
        'Sensory Regulation': 'Sensory & Regulation',
        'Behavior': 'Behavior & Motivation',
        'Self-Advocacy': 'Speech & Social',
        'Communication': 'Speech & Social'
      };
      return acc.category === areaMap[selectedArea] || acc.category === 'Visual & Environmental';
    }
    return true;
  });

  const filteredGoals = SMART_GOAL_TEMPLATES.filter(goal => {
    const diagMatch = selectedDiagnosis === 'All' || goal.diagnosis === selectedDiagnosis;
    const gradeMatch = selectedGrade === 'All' || goal.gradeBand === selectedGrade;
    const areaMatch = selectedArea === 'All' || goal.area === selectedArea;
    return diagMatch && gradeMatch && areaMatch;
  });

  // Package compilation text for Copy all
  const compiledPackageText = () => {
    let output = `IEP ACCELERATION BLUEPRINT FOR ${studentName.toUpperCase()}\n`;
    output += `Generated by California Special Needs Navigator\n`;
    output += `==================================================\n\n`;

    output += `SELECTED ACCOMMODATIONS:\n`;
    if (selectedAccommodations.length === 0) {
      output += `- None selected\n`;
    } else {
      selectedAccommodations.forEach(id => {
        const item = IEP_ACCOMMODATIONS.find(a => a.id === id);
        if (item) {
          output += `- [${item.category}] ${item.title}: ${item.description}\n`;
        }
      });
    }
    output += `\n--------------------------------------------------\n\n`;

    output += `CUSTOM MEASURABLE GOALS:\n`;
    if (selectedGoals.length === 0) {
      output += `- None selected\n`;
    } else {
      selectedGoals.forEach((id, index) => {
        const item = SMART_GOAL_TEMPLATES.find(g => g.id === id);
        if (item) {
          output += `${index + 1}. [${item.area}] ${item.title}:\n`;
          output += `   "${compileGoalText(item)}"\n\n`;
        }
      });
    }
    return output;
  };

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '6rem' }}>
      
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Sparkles size={36} color="var(--primary-color)" style={{ verticalAlign: 'middle' }} />
          IEP Collaboration & Concerns Portal
        </h1>
        <p style={{ maxWidth: '700px', margin: '1rem auto 0 auto', fontSize: '1.1rem' }}>
          Equip yourself for your next IEP meeting. Generate measurable SMART goals, choose classroom accommodations, or draft a formal Parent Input Statement.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }} className="no-print">
        <button
          onClick={() => setActiveTab('goals')}
          style={{
            background: activeTab === 'goals' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: activeTab === 'goals' ? '#ffffff' : 'var(--text-main)',
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
          <BookOpen size={18} />
          Goals & Accommodations
        </button>

        <button
          onClick={() => setActiveTab('statement')}
          style={{
            background: activeTab === 'statement' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: activeTab === 'statement' ? '#ffffff' : 'var(--text-main)',
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
          <FileText size={18} />
          Parent Input Statement
        </button>
      </div>

      {activeTab === 'goals' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }} className="iep-grid-layout">
          
          {/* Left Interactive Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Controls Panel */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: 700 }}>
                <SlidersHorizontal size={18} color="var(--primary-color)" />
                Filter & Personalize Blueprint
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="input-group">
                  <label htmlFor="diag-select">Diagnosis Category</label>
                  <select 
                    id="diag-select" 
                    value={selectedDiagnosis} 
                    onChange={(e) => setSelectedDiagnosis(e.target.value)}
                  >
                    {diagnoses.map(d => (
                      <option key={d} value={d}>{d === 'All' ? 'All Diagnoses' : d.replace(' Spectrum Disorder (ASD)', '').replace(' Hyperactivity Disorder (ADHD)', '')}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="grade-select">Grade Level / Band</label>
                  <select 
                    id="grade-select" 
                    value={selectedGrade} 
                    onChange={(e) => setSelectedGrade(e.target.value)}
                  >
                    {grades.map(g => (
                      <option key={g} value={g}>{g === 'All' ? 'All Grade Bands' : g}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="student-name-input">Child&apos;s Name (for goals)</label>
                  <input 
                    id="student-name-input"
                    type="text" 
                    value={studentName} 
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Liam"
                  />
                </div>
              </div>

              {/* Area Filter Tags */}
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                  Area of Difficulty
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {areas.map(a => (
                    <button
                      key={a}
                      onClick={() => setSelectedArea(a)}
                      style={{
                        background: selectedArea === a ? 'var(--primary-color)' : 'rgba(var(--primary-rgb), 0.05)',
                        color: selectedArea === a ? '#ffffff' : 'var(--text-main)',
                        border: '1px solid',
                        borderColor: selectedArea === a ? 'var(--primary-color)' : 'var(--glass-border)',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Goals Selection Section */}
            <div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <BookOpen size={22} color="var(--primary-color)" />
                Measurable SMART Goal Templates ({filteredGoals.length})
              </h2>
              
              {filteredGoals.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                  <p>No goal templates match your exact combination of filters. Try selecting &quot;All Diagnoses&quot; or adjusting the Area.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {filteredGoals.map(goal => {
                    const isAdded = selectedGoals.includes(goal.id);
                    const tokens = Object.keys(goal.defaultTokens).filter(k => k !== 'name');

                    return (
                      <div 
                        key={goal.id} 
                        className="glass-panel" 
                        style={{ 
                          padding: '1.75rem',
                          borderLeft: isAdded ? '6px solid var(--primary-color)' : '1px solid var(--glass-border)',
                          background: isAdded ? 'rgba(var(--primary-rgb), 0.03)' : 'var(--glass-bg)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                          <div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.4rem' }}>
                              <span className="program-tag" style={{ margin: 0, fontSize: '0.75rem' }}>{goal.diagnosis.split(' ')[0]}</span>
                              <span className="program-tag" style={{ margin: 0, fontSize: '0.75rem', background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)' }}>{goal.area}</span>
                              <span className="program-tag" style={{ margin: 0, fontSize: '0.75rem', background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)' }}>{goal.gradeBand}</span>
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{goal.title}</h3>
                          </div>
                          <button
                            onClick={() => toggleGoal(goal.id)}
                            className="btn-primary"
                            style={{
                              width: 'auto',
                              padding: '0.5rem 1rem',
                              fontSize: '0.85rem',
                              borderRadius: '10px',
                              background: isAdded ? '#ef4444' : 'var(--primary-color)',
                              borderColor: isAdded ? '#ef4444' : 'var(--primary-color)'
                            }}
                          >
                            {isAdded ? (
                              <>
                                <Trash2 size={14} />
                                <span>Remove Goal</span>
                              </>
                            ) : (
                              <>
                                <Plus size={14} />
                                <span>Add to Plan</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Rendered Live Goal Block */}
                        <div 
                          style={{ 
                            background: 'rgba(0,0,0,0.02)', 
                            borderRadius: '12px', 
                            padding: '1.25rem', 
                            border: '1px dashed rgba(0,0,0,0.08)',
                            fontSize: '0.95rem',
                            lineHeight: 1.6,
                            fontStyle: 'italic',
                            color: 'var(--text-main)',
                            position: 'relative'
                          }}
                        >
                          <span style={{ position: 'absolute', top: '-8px', left: '15px', background: 'var(--glass-bg)', padding: '0 0.4rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-light)', fontWeight: 700 }}>
                            Live Preview
                          </span>
                          &quot;{compileGoalText(goal)}&quot;
                          <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                            <CopyButton text={compileGoalText(goal)} size={14} />
                          </div>
                        </div>

                        {/* Customize Goal Token Inputs */}
                        <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                            <Settings size={12} />
                            Customize Parameters
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                            {tokens.map(tokenKey => {
                              const currentVal = tokenOverrides[goal.id]?.[tokenKey] !== undefined 
                                ? tokenOverrides[goal.id][tokenKey] 
                                : goal.defaultTokens[tokenKey];

                              return (
                                <div key={tokenKey} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  <label style={{ fontSize: '0.75rem', textTransform: 'capitalize', color: 'var(--text-light)' }}>
                                    {tokenKey.replace(/_/g, ' ')}
                                  </label>
                                  <input
                                    type="text"
                                    value={currentVal}
                                    onChange={(e) => handleTokenChange(goal.id, tokenKey, e.target.value)}
                                    style={{
                                      padding: '0.4rem 0.75rem',
                                      fontSize: '0.85rem',
                                      borderRadius: '8px',
                                      border: '1px solid rgba(0,0,0,0.08)'
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accommodations Selection Section */}
            <div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Layers size={22} color="var(--primary-color)" />
                Classroom & Test Accommodations Checklist
              </h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Check the items that support your child&apos;s access to learning. Recommended based on difficulty focus areas.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {filteredAccommodations.map(acc => {
                  const isChecked = selectedAccommodations.includes(acc.id);

                  return (
                    <div 
                      key={acc.id} 
                      className="glass-panel"
                      onClick={() => toggleAccommodation(acc.id)}
                      style={{
                        padding: '1.25rem',
                        cursor: 'pointer',
                        borderLeft: isChecked ? '5px solid var(--primary-color)' : '1px solid var(--glass-border)',
                        background: isChecked ? 'rgba(var(--primary-rgb), 0.02)' : 'var(--glass-bg)',
                        display: 'flex',
                        gap: '0.85rem',
                        alignItems: 'flex-start',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Controlled by panel click
                        style={{ marginTop: '0.2rem', cursor: 'pointer', flexShrink: 0 }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {acc.category}
                        </span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{acc.title}</h4>
                        <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}>{acc.description}</p>
                        <span style={{ fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--text-light)' }}>
                          <strong>Why:</strong> {acc.rationale}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Sidebar - Selected Package Review */}
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--primary-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <FileText size={18} color="var(--primary-color)" />
                My IEP Blueprint
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                  <span>Student:</span>
                  <strong>{studentName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                  <span>Accommodations:</span>
                  <span className="program-tag" style={{ margin: 0, padding: '0.1rem 0.5rem' }}>{selectedAccommodations.length} selected</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                  <span>Measurable Goals:</span>
                  <span className="program-tag" style={{ margin: 0, padding: '0.1rem 0.5rem' }}>{selectedGoals.length} selected</span>
                </div>
              </div>

              {/* Actions list */}
              { (selectedAccommodations.length > 0 || selectedGoals.length > 0) ? (
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <PrintButton />
                    </div>
                    <ShareButton title={`IEP Blueprint for ${studentName}`} />
                  </div>
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.4rem',
                      background: 'rgba(var(--primary-rgb),0.08)',
                      padding: '0.6rem',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--primary-color)'
                    }}
                  >
                    <span>Copy Blueprint Block</span>
                    <CopyButton text={compiledPackageText()} size={16} />
                  </div>
                  
                  <button
                    onClick={clearPackage}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textDecoration: 'underline',
                      marginTop: '0.5rem'
                    }}
                  >
                    Clear Selection
                  </button>
                </div>
              ) : (
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', textAlign: 'center', marginTop: '1rem', border: '1px dashed rgba(0,0,0,0.05)' }}>
                  <HelpCircle size={20} color="var(--text-light)" style={{ marginBottom: '0.25rem' }} />
                  <p style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>Select goals and checklists on the left to start compiling your meeting agenda.</p>
                </div>
              )}
            </div>

            {/* Quick Informational Tip Card */}
            <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                💡 California Parent Tip
              </h4>
              <p style={{ lineHeight: '1.4', color: 'var(--text-light)' }}>
                Under CA Education Code § 56341.1, you have the legal right to request an IEP team meeting at any time. Once requested in writing, the school has exactly <strong>30 calendar days</strong> (not counting school vacations over 5 days) to hold the meeting.
              </p>
            </div>

          </div>

        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }} className="iep-grid-layout">
          
          {/* Left Parent Input Forms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Sparkles size={22} color="var(--primary-color)" />
                Draft Parent Input Concerns
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                Drafting your parent concerns in advance ensures they are incorporated in full in Section A (Parent Concerns) of the student&apos;s IEP document. Under California Ed Code § 56341.1, the IEP team must legally consider your input.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="student-name-statement" style={{ fontWeight: 600 }}>Child&apos;s Name</label>
                  <input
                    id="student-name-statement"
                    type="text"
                    value={studentName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    style={{ padding: '0.6rem 0.85rem' }}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="strengths-input" style={{ fontWeight: 600 }}>1. Student Strengths, Motivators & Interests</label>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: '0 0 0.4rem 0' }}>
                    What does your child do well? What are their favorite activities, hobbies, toys, and motivators?
                  </p>
                  <textarea
                    id="strengths-input"
                    value={strengths}
                    onChange={(e) => updateStrengths(e.target.value)}
                    style={{ width: '100%', minHeight: '90px', padding: '0.75rem', borderRadius: '8px', fontSize: '0.88rem', lineHeight: '1.5' }}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="academic-input" style={{ fontWeight: 600 }}>2. Academic & Educational Concerns</label>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: '0 0 0.4rem 0' }}>
                    What learning barriers do you observe? E.g. reading delays, arithmetic, letter writing, attention issues.
                  </p>
                  <textarea
                    id="academic-input"
                    value={academicConcerns}
                    onChange={(e) => updateAcademic(e.target.value)}
                    style={{ width: '100%', minHeight: '90px', padding: '0.75rem', borderRadius: '8px', fontSize: '0.88rem', lineHeight: '1.5' }}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="sensory-input" style={{ fontWeight: 600 }}>3. Sensory & Physical Challenges</label>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: '0 0 0.4rem 0' }}>
                    Sensory processing issues? Self-regulation needs? Fine or gross motor challenges (pencil grip, buttons)?
                  </p>
                  <textarea
                    id="sensory-input"
                    value={sensoryConcerns}
                    onChange={(e) => updateSensory(e.target.value)}
                    style={{ width: '100%', minHeight: '90px', padding: '0.75rem', borderRadius: '8px', fontSize: '0.88rem', lineHeight: '1.5' }}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="social-input" style={{ fontWeight: 600 }}>4. Social, Emotional & Play Skills</label>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: '0 0 0.4rem 0' }}>
                    How does your child interact with peers? Any social communication delays, anxiety, safety risks?
                  </p>
                  <textarea
                    id="social-input"
                    value={socialConcerns}
                    onChange={(e) => updateSocial(e.target.value)}
                    style={{ width: '100%', minHeight: '90px', padding: '0.75rem', borderRadius: '8px', fontSize: '0.88rem', lineHeight: '1.5' }}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="vision-input" style={{ fontWeight: 600 }}>5. Parental Vision for the Future</label>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: '0 0 0.4rem 0' }}>
                    What is your vision for your child this school year? What are your short-term and long-term goals?
                  </p>
                  <textarea
                    id="vision-input"
                    value={parentVision}
                    onChange={(e) => updateVision(e.target.value)}
                    style={{ width: '100%', minHeight: '90px', padding: '0.75rem', borderRadius: '8px', fontSize: '0.88rem', lineHeight: '1.5' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Preview & Export */}
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--primary-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <FileText size={18} color="var(--primary-color)" />
                Input Statement Preview
              </h3>
              
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.4', marginBottom: '1.25rem' }}>
                This is a live preview of the formal concerns document that you can copy or print for your IEP team.
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <PrintButton />
                </div>
                <ShareButton title={`IEP Parent Input Statement - ${studentName}`} />
              </div>

              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.4rem',
                  background: 'rgba(var(--primary-rgb),0.08)',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                <span>Copy Statement Block</span>
                <CopyButton text={compileParentStatementText()} size={16} />
              </div>

              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.08)', fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: '1.4' }}>
                <strong>How to use:</strong> Hand the printed report to your coordinator at the start of the IEP meeting and request: &quot;Please append this statement to Section A of my child&apos;s IEP under Parent Concerns.&quot;
              </div>
            </div>

            {/* Legal Tip */}
            <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                💡 California Ed Code Tip
              </h4>
              <p style={{ lineHeight: '1.4', color: 'var(--text-light)' }}>
                You have the absolute right to have your comments documented exactly as written. The school district cannot censor, edit, or summarize your written concerns.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Print Container for Goals & Accommodations */}
      {activeTab === 'goals' && (
        <div className="print-expand" style={{ display: 'none' }}>
          <h1 style={{ color: 'black', background: 'none', WebkitTextFillColor: 'initial', fontSize: '26pt', margin: '0 0 5px 0' }}>
            IEP Collaboration Blueprint
          </h1>
          <p style={{ fontSize: '11pt', color: '#555', margin: '0 0 20px 0' }}>
            Prepared for student <strong>{studentName}</strong> | Created via CA Special Needs Navigator ({new Date().toLocaleDateString()})
          </p>

          <h2 style={{ fontSize: '16pt', borderBottom: '2px solid #333', paddingBottom: '3px', marginTop: '20px' }}>
            Selected Classroom Accommodations
          </h2>
          {selectedAccommodations.length === 0 ? (
            <p style={{ fontStyle: 'italic' }}>No classroom accommodations selected.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
                  <th style={{ padding: '6px', width: '25%', fontSize: '10pt' }}>Category</th>
                  <th style={{ padding: '6px', width: '30%', fontSize: '10pt' }}>Accommodation</th>
                  <th style={{ padding: '6px', fontSize: '10pt' }}>Implementation Guidance & Rationale</th>
                </tr>
              </thead>
              <tbody>
                {selectedAccommodations.map(id => {
                  const item = IEP_ACCOMMODATIONS.find(a => a.id === id);
                  if (!item) return null;
                  return (
                    <tr key={id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '6px', fontWeight: 'bold', fontSize: '9.5pt' }}>{item.category}</td>
                      <td style={{ padding: '6px', fontWeight: 'bold', fontSize: '9.5pt' }}>{item.title}</td>
                      <td style={{ padding: '6px', fontSize: '9pt' }}>
                        {item.description} <br />
                        <span style={{ color: '#666', fontStyle: 'italic' }}>Rationale: {item.rationale}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <h2 style={{ fontSize: '16pt', borderBottom: '2px solid #333', paddingBottom: '3px', marginTop: '30px' }}>
            Draft Measurable IEP Goals (SMART Format)
          </h2>
          {selectedGoals.length === 0 ? (
            <p style={{ fontStyle: 'italic' }}>No measurable goals selected.</p>
          ) : (
            <div style={{ marginTop: '10px' }}>
              {selectedGoals.map((id, index) => {
                const goal = SMART_GOAL_TEMPLATES.find(g => g.id === id);
                if (!goal) return null;
                return (
                  <div key={id} style={{ marginBottom: '15px', pageBreakInside: 'avoid', border: '1px solid #ccc', padding: '10px', borderRadius: '6px' }}>
                    <h3 style={{ fontSize: '12pt', margin: '0 0 5px 0' }}>
                      Goal {index + 1}: {goal.title} ({goal.area})
                    </h3>
                    <p style={{ margin: '5px 0 0 0', fontStyle: 'italic', fontSize: '10.5pt', lineHeight: '1.4' }}>
                      &quot;{compileGoalText(goal)}&quot;
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: '40px', fontSize: '9pt', color: '#777', borderTop: '1px solid #ccc', paddingTop: '10px', textAlign: 'center' }}>
            This document is a collaborative drafting tool prepared by the caregiver. Under federal IDEA law (20 U.S.C. § 1414), parents are equal members of the IEP team and have the right to present draft goals and accommodation recommendations for school consideration.
          </div>
        </div>
      )}

      {/* Hidden Print Container for Parent Input Statement */}
      {activeTab === 'statement' && (
        <div className="print-expand" style={{ display: 'none' }}>
          <h1 style={{ color: 'black', background: 'none', WebkitTextFillColor: 'initial', fontSize: '26pt', margin: '0 0 5px 0' }}>
            IEP Parent Input & Concerns Statement
          </h1>
          <p style={{ fontSize: '11pt', color: '#555', margin: '0 0 20px 0' }}>
            Prepared for student: <strong>{studentName}</strong> | Created via CA Special Needs Navigator ({new Date().toLocaleDateString()})
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px' }}>
              <h3 style={{ fontSize: '12pt', margin: '0 0 5px 0', borderBottom: '1px solid #eee', paddingBottom: '3px' }}>
                Legal Authority Reference
              </h3>
              <p style={{ fontSize: '9.5pt', color: '#555', lineHeight: '1.4', margin: 0 }}>
                Under California Education Code Section 56341.1(a)(1), the IEP team is legally mandated to consider the concerns of the parent for enhancing the education of their child. The parent has the absolute right to have their input statement incorporated in full under Section A (Parent Concerns) of the student&apos;s IEP document.
              </p>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', pageBreakInside: 'avoid' }}>
              <h3 style={{ fontSize: '11pt', margin: '0 0 5px 0', borderBottom: '1px solid #eee', paddingBottom: '3px', fontWeight: 'bold' }}>
                1. Student Strengths, Motivators & Personal Interests
              </h3>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '10pt', lineHeight: '1.5', margin: '5px 0 0 0' }}>
                {strengths}
              </p>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', pageBreakInside: 'avoid' }}>
              <h3 style={{ fontSize: '11pt', margin: '0 0 5px 0', borderBottom: '1px solid #eee', paddingBottom: '3px', fontWeight: 'bold' }}>
                2. Academic & Educational Concerns
              </h3>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '10pt', lineHeight: '1.5', margin: '5px 0 0 0' }}>
                {academicConcerns}
              </p>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', pageBreakInside: 'avoid' }}>
              <h3 style={{ fontSize: '11pt', margin: '0 0 5px 0', borderBottom: '1px solid #eee', paddingBottom: '3px', fontWeight: 'bold' }}>
                3. Sensory, Regulation & Physical Challenges
              </h3>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '10pt', lineHeight: '1.5', margin: '5px 0 0 0' }}>
                {sensoryConcerns}
              </p>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', pageBreakInside: 'avoid' }}>
              <h3 style={{ fontSize: '11pt', margin: '0 0 5px 0', borderBottom: '1px solid #eee', paddingBottom: '3px', fontWeight: 'bold' }}>
                4. Social, Emotional & Play Skills
              </h3>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '10pt', lineHeight: '1.5', margin: '5px 0 0 0' }}>
                {socialConcerns}
              </p>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', pageBreakInside: 'avoid' }}>
              <h3 style={{ fontSize: '11pt', margin: '0 0 5px 0', borderBottom: '1px solid #eee', paddingBottom: '3px', fontWeight: 'bold' }}>
                5. Parental Vision for the Student&apos;s Future
              </h3>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '10pt', lineHeight: '1.5', margin: '5px 0 0 0' }}>
                {parentVision}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '40px', fontSize: '9pt', color: '#777', borderTop: '1px solid #ccc', paddingTop: '10px', textAlign: 'center' }}>
            This document represents the formal parental input statement. The IEP team is requested to copy these sections directly into the IEP document&apos;s Parent Concerns section.
          </div>
        </div>
      )}

    </main>
  );
}
