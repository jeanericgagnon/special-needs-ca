'use client';

import { useState, useEffect } from 'react';
import { 
  updateProgramStatusAction, 
  toggleChecklistItemAction, 
  addReminderAction, 
  toggleReminderAction, 
  deleteReminderAction,
  deleteChildAction,
  saveChildIepAction,
  saveChildRespiteAction
} from './child-actions';
import type { 
  County, 
  TaxonomyCondition, 
  FunctionalNeed, 
  ChildProfile, 
  Program, 
  ProgramStatus, 
  ChecklistItem, 
  Reminder,
  ChildIepData,
  ChildRespiteData
} from '@/lib/db';
import ChildEditor from './child-editor';
import { 
  User, Plus, Edit, Trash2, ShieldCheck, FileText, Calendar, 
  MapPin, CheckCircle, ChevronDown, ChevronUp, AlertCircle, Phone, 
  Globe, Info, FileCheck, Landmark, Trash,
  Copy, Check, Mail, Sparkles, SlidersHorizontal, Settings, BookOpen, Layers, Calculator
} from 'lucide-react';
import PrintButton from '@/components/print-button';
import ShareButton from '@/components/share-button';
import CopyButton from '@/components/copy-button';

import { IEP_ACCOMMODATIONS, SMART_GOAL_TEMPLATES, SMARTGoalTemplate } from '@/lib/iep-data';
import { DDS_SERVICE_CODES, EMAIL_TEMPLATES, calculateRespiteTier, compileJustificationBulletPoints } from '@/lib/funding-data';

interface DashboardClientProps {
  counties: County[];
  conditions: TaxonomyCondition[];
  needs: FunctionalNeed[];
  childrenList: ChildProfile[];
  selectedChildId: string | null;
  matchedPrograms: any[]; 
  crawlerPrograms: Program[]; 
  savedStatuses: ProgramStatus[];
  savedChecklist: ChecklistItem[];
  savedReminders: Reminder[];
  countyDetails: any; 
  savedIepData: ChildIepData;
  savedRespiteData: ChildRespiteData | null;
}

type TabType = 'benefits' | 'iep' | 'dds' | 'actions' | 'county';

export default function DashboardClient({
  counties,
  conditions,
  needs,
  childrenList,
  selectedChildId,
  matchedPrograms,
  crawlerPrograms,
  savedStatuses,
  savedChecklist,
  savedReminders,
  countyDetails,
  savedIepData,
  savedRespiteData
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('benefits');
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const currentChild = childrenList.find(c => c.id === selectedChildId) || childrenList[0];

  // ----------------------------------------------------
  // IEP Planner Tab State
  // ----------------------------------------------------
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]); 
  const [tokenOverrides, setTokenOverrides] = useState<Record<string, Record<string, string>>>({});

  // ----------------------------------------------------
  // DDS Funding Tab State
  // ----------------------------------------------------
  const [safetyScore, setSafetyScore] = useState<number>(0);
  const [sleepScore, setSleepScore] = useState<number>(0);
  const [medicalScore, setMedicalScore] = useState<number>(0);
  const [behaviorScore, setBehaviorScore] = useState<number>(0);

  // Active email template state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('req-respite');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');

  // ----------------------------------------------------
  // Action Plan Tab State (Reminders Form)
  // ----------------------------------------------------
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderProgId, setReminderProgId] = useState('');

  // Expanded program state for Benefits
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);

  // ----------------------------------------------------
  // Profile Swapping & Initialization Hydration
  // ----------------------------------------------------
  useEffect(() => {
    if (currentChild) {
      setSaveStatus({ type: null, message: '' });

      // 1. Hydrate IEP Planner from DB or LocalStorage (as fallback)
      const localAccKey = `iep_acc_${currentChild.id}`;
      const localGoalsKey = `iep_goals_${currentChild.id}`;
      const localTokensKey = `iep_tokens_${currentChild.id}`;

      let initialAccs = savedIepData.accommodations || [];
      let initialGoals = savedIepData.goals.map(g => g.goal_template_id) || [];
      let initialTokens: Record<string, Record<string, string>> = {};

      savedIepData.goals.forEach(g => {
        try {
          initialTokens[g.goal_template_id] = JSON.parse(g.tokens_json);
        } catch (e) {}
      });

      // Hydrate local cache fallbacks if empty (e.g. running on read-only environments)
      if (initialAccs.length === 0 && localStorage.getItem(localAccKey)) {
        initialAccs = JSON.parse(localStorage.getItem(localAccKey) || '[]');
      }
      if (initialGoals.length === 0 && localStorage.getItem(localGoalsKey)) {
        initialGoals = JSON.parse(localStorage.getItem(localGoalsKey) || '[]');
      }
      if (Object.keys(initialTokens).length === 0 && localStorage.getItem(localTokensKey)) {
        initialTokens = JSON.parse(localStorage.getItem(localTokensKey) || '{}');
      }

      setSelectedAccommodations(initialAccs);
      setSelectedGoals(initialGoals);
      setTokenOverrides(initialTokens);

      // 2. Hydrate DDS Respite scores
      const localRespiteKey = `respite_scores_${currentChild.id}`;
      let safety = 0;
      let sleep = 0;
      let medical = 0;
      let behavior = 0;

      if (savedRespiteData) {
        safety = savedRespiteData.safety_score;
        sleep = savedRespiteData.sleep_score;
        medical = savedRespiteData.medical_score;
        behavior = savedRespiteData.behavior_score;
      } else if (localStorage.getItem(localRespiteKey)) {
        const scores = JSON.parse(localStorage.getItem(localRespiteKey) || '{}');
        safety = scores.safety || 0;
        sleep = scores.sleep || 0;
        medical = scores.medical || 0;
        behavior = scores.behavior || 0;
      }

      setSafetyScore(safety);
      setSleepScore(sleep);
      setMedicalScore(medical);
      setBehaviorScore(behavior);
    }
  }, [currentChild?.id, savedIepData, savedRespiteData]);

  // ----------------------------------------------------
  // DDS Calculations & Justification Compiler
  // ----------------------------------------------------
  const respiteResults = calculateRespiteTier({
    safety: safetyScore,
    sleep: sleepScore,
    medical: medicalScore,
    behavior: behaviorScore
  });

  const justificationBullets = compileJustificationBulletPoints({
    safety: safetyScore,
    sleep: sleepScore,
    medical: medicalScore,
    behavior: behaviorScore
  });

  // Re-compile email template when parameters change
  useEffect(() => {
    const template = EMAIL_TEMPLATES.find(t => t.id === selectedTemplateId);
    if (!template || !currentChild) return;

    let bodyText = template.body;
    let subjectText = template.subject;

    const placeholders: Record<string, string> = {
      coordinator_name: 'Jane Doe', // Standard fallback
      child_name: currentChild.nickname,
      child_dob: currentChild.dob,
      parent_name: 'Sarah Jenkins',
      parent_phone: '(555) 019-2834',
      respite_code: '862 (Agency) / 896 (Self-Directed)',
      requested_hours: respiteResults.suggestedHours.split(' ')[0],
      care_justification: justificationBullets,
      program_name: 'Special Needs Summer Camp',
      program_cost: '$220 per week',
      socialization_needs: `- Requires continuous 1:1 safety supervision due to lack of danger awareness.\n- Faces challenges with verbal social groups, needing visual supports.\n- Struggles with transitions, displaying elevated sensory meltdowns.`,
      discussion_date: 'our recent IPP meeting review',
      requested_service: `${respiteResults.suggestedHours.split(' ')[0]} hours of In-Home Respite Care`
    };

    Object.entries(placeholders).forEach(([key, val]) => {
      bodyText = bodyText.replace(new RegExp(`{{${key}}}`, 'g'), val);
      subjectText = subjectText.replace(new RegExp(`{{${key}}}`, 'g'), val);
    });

    setCustomSubject(subjectText);
    setCustomBody(bodyText);
  }, [
    selectedTemplateId, 
    currentChild, 
    safetyScore, 
    sleepScore, 
    medicalScore, 
    behaviorScore,
    respiteResults.suggestedHours,
    justificationBullets
  ]);

  // ----------------------------------------------------
  // Mutator Actions
  // ----------------------------------------------------
  const handleSaveIepPlan = async () => {
    if (!currentChild) return;
    setSaveStatus({ type: null, message: '' });

    // Format goals parameters
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

    // Save to database
    const res = await saveChildIepAction(currentChild.id, selectedAccommodations, goalsToSave);

    // Sync to localstorage (local cache fallback)
    localStorage.setItem(`iep_acc_${currentChild.id}`, JSON.stringify(selectedAccommodations));
    localStorage.setItem(`iep_goals_${currentChild.id}`, JSON.stringify(selectedGoals));
    localStorage.setItem(`iep_tokens_${currentChild.id}`, JSON.stringify(tokenOverrides));

    if (res.success) {
      setSaveStatus({ type: 'success', message: 'IEP Plan successfully updated on the database!' });
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 4000);
    } else {
      setSaveStatus({ type: 'error', message: res.error || 'Failed to update IEP Plan.' });
    }
  };

  const handleSaveRespiteScores = async () => {
    if (!currentChild) return;
    setSaveStatus({ type: null, message: '' });

    const scores = {
      safety: safetyScore,
      sleep: sleepScore,
      medical: medicalScore,
      behavior: behaviorScore
    };

    const res = await saveChildRespiteAction(currentChild.id, scores);

    // Sync local cache fallback
    localStorage.setItem(`respite_scores_${currentChild.id}`, JSON.stringify(scores));

    if (res.success) {
      setSaveStatus({ type: 'success', message: 'Care demands & Respite parameters saved to profile!' });
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 4000);
    } else {
      setSaveStatus({ type: 'error', message: res.error || 'Failed to save Respite profile.' });
    }
  };

  // Compile full goal text for render previews
  const getGoalPreviewText = (goal: SMARTGoalTemplate) => {
    if (!currentChild) return '';
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

  // Compile copyable full blueprint packet text
  const getFullBlueprintText = () => {
    if (!currentChild) return '';
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

  // ----------------------------------------------------
  // Standard Helpers
  // ----------------------------------------------------
  const calculateAge = (dobString: string) => {
    const dob = new Date(dobString);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (years === 0) {
      const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.4375));
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    return `${years} year${years !== 1 ? 's' : ''}`;
  };

  const getStatusLabel = (progId: string) => {
    const statusObj = savedStatuses.find(s => s.program_id === progId);
    return statusObj ? statusObj.status : 'untracked';
  };

  const handleStatusChange = async (progId: string, status: string) => {
    if (!currentChild) return;
    await updateProgramStatusAction(currentChild.id, progId, status);
  };

  const handleDocToggle = async (docName: string, isChecked: boolean, progId: string) => {
    if (!currentChild) return;
    await toggleChecklistItemAction(currentChild.id, docName, isChecked, progId);
  };

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChild || !reminderTitle || !reminderDate) return;
    await addReminderAction(currentChild.id, reminderTitle, reminderDate, reminderProgId || null);
    setReminderTitle('');
    setReminderDate('');
    setReminderProgId('');
  };

  const handleToggleReminder = async (remId: string, isCompleted: number) => {
    await toggleReminderAction(remId, isCompleted === 0);
  };

  const handleDeleteReminder = async (remId: string) => {
    await deleteReminderAction(remId);
  };

  const handleDeleteChild = async (childId: string) => {
    if (confirm('Are you sure you want to delete this child profile? This will delete all tracked statuses and checklist items.')) {
      await deleteChildAction(childId);
      window.location.href = '/dashboard'; 
    }
  };

  const isDocCollected = (docName: string, progId: string) => {
    return savedChecklist.some(c => c.document_name === docName && c.program_id === progId && c.is_collected === 1);
  };

  return (
    <main className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '1150px' }}>
      
      {/* 1. Header & Switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', marginRight: '0.5rem', background: 'none', WebkitTextFillColor: 'initial', WebkitBackgroundClip: 'initial' }}>Family Portal</h1>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} className="no-print">
              <ShareButton />
              <PrintButton label="Print PDF Summary" />
            </div>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Coordinate care timelines and benefits tracking.</p>
        </div>

        {/* Child selector tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }} className="no-print">
          {childrenList.map(child => (
            <a 
              key={child.id}
              href={`/dashboard?childId=${child.id}`}
              className={child.id === currentChild?.id ? 'tab-btn active' : 'tab-btn'}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', fontWeight: 500, fontSize: '0.9rem', color: child.id === currentChild?.id ? 'white' : 'var(--text-main)', background: child.id === currentChild?.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.7)' }}
            >
              <User size={16} />
              <span>{child.nickname}</span>
            </a>
          ))}

          <button 
            onClick={() => setIsAddingChild(true)}
            className="btn-primary" 
            style={{ width: 'auto', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '12px', fontSize: '0.9rem' }}
          >
            <Plus size={16} />
            <span>Add Child</span>
          </button>
        </div>
      </div>

      {childrenList.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
          <User size={48} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Get Started by Adding a Profile</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem', lineHeight: '1.6' }}>
            To map state waivers, Regional Center funding, and custom school IEP requirements, please create a profile representing your child's age, county, and diagnoses.
          </p>
          <button className="btn-primary" onClick={() => setIsAddingChild(true)}>
            <Plus size={20} /> Create Child Profile
          </button>
        </div>
      ) : (
        <>
          {/* 2. Active Profile Summary Card */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', background: 'rgba(255, 255, 255, 0.85)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ background: 'var(--accent-gradient)', padding: '1rem', borderRadius: '16px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={32} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  {currentChild.nickname}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><Calendar size={14} /> Age: {calculateAge(currentChild.dob)}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={14} /> {counties.find(c => c.id === currentChild.county_id)?.name || currentChild.county_id}</span>
                  <span style={{ background: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary-color)', padding: '0.1rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>
                    {currentChild.conditionIds?.[0] ? currentChild.conditionIds[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Developmental Delay'}
                  </span>
                </div>
                
                {/* Status Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {savedStatuses.filter(s => s.status === 'approved').length > 0 && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>
                      🟢 {savedStatuses.filter(s => s.status === 'approved').length} Approved
                    </span>
                  )}
                  {savedStatuses.filter(s => s.status === 'waiting').length > 0 && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>
                      🟡 {savedStatuses.filter(s => s.status === 'waiting').length} Waiting
                    </span>
                  )}
                  {savedStatuses.filter(s => s.status === 'applied').length > 0 && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>
                      🔵 {savedStatuses.filter(s => s.status === 'applied').length} Applied
                    </span>
                  )}
                  {selectedAccommodations.length > 0 && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.05)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 500 }}>
                      📝 {selectedAccommodations.length} IEP Accommodations
                    </span>
                  )}
                  {respiteResults.score > 0 && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.05)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 500 }}>
                      ⏱️ Respite: {respiteResults.tier} Tier
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }} className="no-print">
              <button 
                onClick={() => setEditingChild(currentChild)}
                className="btn-primary" 
                style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', width: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}
              >
                <Edit size={16} /> Edit Profile
              </button>
              <button 
                onClick={() => handleDeleteChild(currentChild.id)}
                className="btn-primary" 
                style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', width: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>

          {/* Persistent Save Notification Panel */}
          {saveStatus.type && (
            <div 
              className="glass-panel" 
              style={{ 
                padding: '1rem', 
                marginBottom: '1.5rem', 
                background: saveStatus.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', 
                borderLeft: saveStatus.type === 'success' ? '5px solid #10b981' : '5px solid #ef4444',
                color: saveStatus.type === 'success' ? '#065f46' : '#991b1b',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              {saveStatus.type === 'success' ? '✓' : '⚠'} {saveStatus.message}
            </div>
          )}

          {/* 3. Re-organized Tabs Selection */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.08)', marginBottom: '2rem', gap: '1.5rem', overflowX: 'auto' }} className="no-print">
            <button 
              onClick={() => setActiveTab('benefits')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'benefits' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'benefits' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <ShieldCheck size={18} /> Benefits & Trackers
            </button>

            <button 
              onClick={() => setActiveTab('iep')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'iep' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'iep' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <Sparkles size={18} /> IEP Planner
            </button>

            <button 
              onClick={() => setActiveTab('dds')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'dds' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'dds' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <Landmark size={18} /> DDS Respite & Funding
            </button>
            
            <button 
              onClick={() => setActiveTab('actions')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'actions' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'actions' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <FileCheck size={18} /> Action Plan (Todos)
            </button>

            <button 
              onClick={() => setActiveTab('county')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'county' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'county' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <MapPin size={18} /> County Directory
            </button>
          </div>

          {/* 4. Tab Views Panel Container */}
          <div style={{ minHeight: '400px' }}>

            {/* TAB 1: BENEFITS & TRACKERS */}
            {activeTab === 'benefits' && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Core Matched State Programs</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    Based on eligibility criteria matching conditions & functional needs.
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                  {matchedPrograms.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
                      <p>No major state-mandated programs matched this child's profile directly. Edit the child's profile to expand conditions or needs to see matches.</p>
                    </div>
                  ) : (
                    matchedPrograms.map(program => {
                      const status = getStatusLabel(program.id);
                      const isExpanded = expandedProgramId === program.id;
                      
                      return (
                        <div 
                          key={program.id} 
                          className="glass-panel" 
                          style={{ 
                            padding: '1.5rem', 
                            borderLeft: status !== 'untracked' ? '6px solid var(--primary-color)' : '1px solid var(--glass-border)',
                            background: 'rgba(255,255,255,0.7)'
                          }}
                        >
                          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ flex: 1, minWidth: '250px' }}>
                              <h4 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {program.name}
                              </h4>
                              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', lineHeight: '1.5' }}>
                                {program.description}
                              </p>
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                  Category: {program.category}
                                </span>
                                <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                  Verified: {program.last_verified_date}
                                </span>
                              </div>
                            </div>

                            {/* Status controls */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="no-print">
                              <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Status:</label>
                              <select 
                                value={status}
                                onChange={(e) => handleStatusChange(program.id, e.target.value)}
                                style={{ width: 'auto', padding: '0.4rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px' }}
                              >
                                <option value="untracked">Not Tracked (Ignore)</option>
                                <option value="recommended">Recommended (Reviewing)</option>
                                <option value="applied">Applied (Sent Application)</option>
                                <option value="waiting">Waiting for Intake / Assessment</option>
                                <option value="approved">Approved (Active Benefit)</option>
                                <option value="denied">Denied (Notice of Action)</option>
                              </select>

                              <button 
                                onClick={() => setExpandedProgramId(isExpanded ? null : program.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }}
                              >
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Info */}
                          {isExpanded && (
                            <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                              <div>
                                <h5 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                  <Info size={16} /> Eligibility details
                                </h5>
                                <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                  <strong>Who it's for:</strong> {program.who_it_is_for}
                                </p>
                                <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                                  <strong>Qualifying factors:</strong> {program.who_might_qualify}
                                </p>

                                {program.applicationSteps && program.applicationSteps.length > 0 && (
                                  <>
                                    <h6 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Next Steps to Apply:</h6>
                                    <ol style={{ fontSize: '0.85rem', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', lineHeight: '1.5' }}>
                                      {program.applicationSteps.map((step: any) => (
                                        <li key={step.id}>
                                          <strong>{step.title}:</strong> {step.action_description}
                                        </li>
                                      ))}
                                    </ol>
                                  </>
                                )}
                              </div>

                              <div>
                                <h5 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                  <FileCheck size={16} /> Document Checklist
                                </h5>
                                
                                {program.documentRequirements && program.documentRequirements.length > 0 ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    {program.documentRequirements.map((doc: any) => {
                                      const isChecked = isDocCollected(doc.name, program.id);
                                      return (
                                        <label 
                                          key={doc.id}
                                          style={{ 
                                            display: 'flex', 
                                            alignItems: 'flex-start', 
                                            gap: '0.5rem', 
                                            fontSize: '0.85rem', 
                                            cursor: 'pointer', 
                                            padding: '0.5rem',
                                            borderRadius: '8px',
                                            background: isChecked ? 'rgba(99,102,241,0.04)' : 'rgba(0,0,0,0.01)',
                                            border: '1px solid rgba(0,0,0,0.03)'
                                          }}
                                        >
                                          <input 
                                            type="checkbox" 
                                            checked={isChecked}
                                            onChange={(e) => handleDocToggle(doc.name, e.target.checked, program.id)}
                                            style={{ width: 'auto', marginTop: '2px' }}
                                          />
                                          <div>
                                            <span style={{ fontWeight: 600, display: 'block', textDecoration: isChecked ? 'line-through' : 'none' }}>
                                              {doc.name}
                                            </span>
                                            {doc.description && (
                                              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                                {doc.description}
                                              </span>
                                            )}
                                          </div>
                                        </label>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No specific document guidelines registered.</p>
                                )}

                                {status === 'denied' && program.appealInfo && (
                                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px dashed #ef4444', borderRadius: '12px' }}>
                                    <h6 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                                      <AlertCircle size={14} /> Appeal Guide ({program.appealInfo.deadline_days} days deadline)
                                    </h6>
                                    <p style={{ fontSize: '0.75rem', lineHeight: '1.5', whiteSpace: 'pre-line', margin: 0 }}>
                                      {program.appealInfo.appeal_steps}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Database crawler list */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Dynamic Crawled Rules Matching</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Additional matches scraped directly from 33,000+ California state regulations.
                </p>

                <div className="grid">
                  {crawlerPrograms.map(prog => (
                    <div key={prog.id} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.6)' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>{prog.program_name}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
                        <span><strong>Demographic:</strong> {prog.target_demographic}</span>
                        <span><strong>Ages:</strong> {prog.age_limit_min} - {prog.age_limit_max} years</span>
                      </div>
                      <a 
                        href={prog.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ fontSize: '0.85rem', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', fontWeight: 600 }}
                      >
                        <Globe size={14} /> Open Government Source
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: IEP PLANNER */}
            {activeTab === 'iep' && (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Accommodations checklist */}
                  <div className="glass-panel">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Layers size={20} color="var(--primary-color)" />
                      IEP Accommodation Checklist
                    </h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                      Check accommodations to request in your child's classroom.
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
                              background: isChecked ? 'rgba(99, 102, 241, 0.03)' : 'rgba(255,255,255,0.4)',
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
                            background: isAdded ? 'rgba(99, 102, 241, 0.02)' : 'var(--glass-bg)'
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
                            "{getGoalPreviewText(goal)}"
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
                                    style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', borderRadius: '6px' }}
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
                      style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', marginBottom: '1rem' }}
                    >
                      Save IEP Blueprint
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '0.3rem',
                          background: 'rgba(99,102,241,0.08)',
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
            )}

            {/* TAB 3: DDS RESPITE & FUNDING */}
            {activeTab === 'dds' && (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Estimator Quiz */}
                  <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <Calculator size={20} color="var(--primary-color)" />
                      Respite Evaluation Matrix
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                          <label style={{ fontWeight: 600 }}>1. Safety & Wandering Oversight</label>
                          <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{safetyScore} / 5</span>
                        </div>
                        <input type="range" min="0" max="5" value={safetyScore} onChange={(e) => setSafetyScore(parseInt(e.target.value))} style={{ accentColor: 'var(--primary-color)' }} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                          <label style={{ fontWeight: 600 }}>2. Night Waking Supervision</label>
                          <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{sleepScore} / 4</span>
                        </div>
                        <input type="range" min="0" max="4" value={sleepScore} onChange={(e) => setSleepScore(parseInt(e.target.value))} style={{ accentColor: 'var(--primary-color)' }} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                          <label style={{ fontWeight: 600 }}>3. Diapering / Medical Tasks</label>
                          <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{medicalScore} / 4</span>
                        </div>
                        <input type="range" min="0" max="4" value={medicalScore} onChange={(e) => setMedicalScore(parseInt(e.target.value))} style={{ accentColor: 'var(--primary-color)' }} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                          <label style={{ fontWeight: 600 }}>4. Behavioral / Meltdown Severity</label>
                          <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{behaviorScore} / 4</span>
                        </div>
                        <input type="range" min="0" max="4" value={behaviorScore} onChange={(e) => setBehaviorScore(parseInt(e.target.value))} style={{ accentColor: 'var(--primary-color)' }} />
                      </div>
                    </div>
                  </div>

                  {/* Letter Builder */}
                  <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                        <Mail size={16} /> Coordinator Request Letter
                      </h4>
                      <CopyButton text={`Subject: ${customSubject}\n\n${customBody}`} size={16} />
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontStyle: 'italic' }}>
                      {customBody}
                    </div>
                  </div>

                </div>

                {/* Estimator Summary */}
                <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="glass-panel" style={{ border: '2px solid var(--primary-color)', padding: '1.25rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase' }}>Calculated Impact</span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.2rem', marginBottom: '0.75rem' }}>Tier: {respiteResults.tier}</h3>
                    
                    <div style={{ background: 'var(--glass-bg)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
                      {respiteResults.suggestedHours}
                    </div>

                    <button 
                      onClick={handleSaveRespiteScores}
                      className="btn-primary"
                      style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}
                    >
                      Save Care Demands
                    </button>
                  </div>

                  <div className="glass-panel" style={{ padding: '1rem', fontSize: '0.8rem' }}>
                    <h5 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Social Rec Note</h5>
                    <p style={{ margin: 0, color: 'var(--text-light)', lineHeight: 1.4 }}>
                      DDS Code 028 fully restoration funds specialized summer camps and socialization training classes. Bring this up to your worker.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ACTION PLAN (MERGED CHECKLISTS & REMINDERS) */}
            {activeTab === 'actions' && (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
                
                {/* Checklists */}
                <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.85)', padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <FileCheck size={20} color="var(--primary-color)" />
                    Document Gathering Status
                  </h3>

                  {savedChecklist.length > 0 && (
                    (() => {
                      const totalDocs = savedChecklist.length;
                      const collectedDocs = savedChecklist.filter(item => item.is_collected === 1).length;
                      const pct = Math.round((collectedDocs / totalDocs) * 100);
                      
                      return (
                        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.08)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                            <span style={{ fontWeight: 600 }}>Master Checklist Progress</span>
                            <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{collectedDocs} of {totalDocs} files ({pct}%)</span>
                          </div>
                          <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, backgroundColor: 'var(--primary-color)', transition: 'width 0.4s ease' }} />
                          </div>
                        </div>
                      );
                    })()
                  )}

                  {savedChecklist.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Check eligibility results and set their statuses to "Applied" or "Waiting" to populate checklist files.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {savedChecklist.map(item => (
                        <div 
                          key={item.id}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            padding: '0.6rem 1rem',
                            borderBottom: '1px solid rgba(0,0,0,0.04)',
                            background: item.is_collected === 1 ? 'rgba(99,102,241,0.02)' : 'transparent'
                          }}
                        >
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1 }}>
                            <input 
                              type="checkbox"
                              checked={item.is_collected === 1}
                              onChange={(e) => handleDocToggle(item.document_name, e.target.checked, item.program_id || '')}
                              style={{ width: 'auto' }}
                            />
                            <div>
                              <strong style={{ fontSize: '0.9rem', textDecoration: item.is_collected === 1 ? 'line-through' : 'none' }}>{item.document_name}</strong>
                              <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                                Program: {matchedPrograms.find(p => p.id === item.program_id)?.name || item.program_id}
                              </span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Deadlines Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <Calendar size={16} color="var(--primary-color)" />
                      Alert Agenda
                    </h3>

                    {savedReminders.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>No alerts configured.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {savedReminders.map(rem => (
                          <div 
                            key={rem.id}
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              background: rem.is_completed === 1 ? 'rgba(16,185,129,0.03)' : 'rgba(0,0,0,0.01)',
                              padding: '0.6rem 0.85rem',
                              borderRadius: '10px',
                              border: '1px solid rgba(0,0,0,0.02)'
                            }}
                          >
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                              <input 
                                type="checkbox"
                                checked={rem.is_completed === 1}
                                onChange={() => handleToggleReminder(rem.id, rem.is_completed)}
                                style={{ width: 'auto', marginTop: '2px' }}
                              />
                              <div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, textDecoration: rem.is_completed === 1 ? 'line-through' : 'none' }}>{rem.title}</span>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>Due: {rem.due_date}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleDeleteReminder(rem.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add reminder Form */}
                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Create Calendar Alert</h4>
                    <form onSubmit={handleAddReminder} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.75rem' }}>Title</label>
                        <input type="text" value={reminderTitle} onChange={(e) => setReminderTitle(e.target.value)} placeholder="e.g. Call Coordinator" required style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }} />
                      </div>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.75rem' }}>Due Date</label>
                        <input type="date" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} required style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }} />
                      </div>
                      <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Add Alarm</button>
                    </form>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 5: COUNTY DIRECTORY */}
            {activeTab === 'county' && (
              <div className="animate-fade-in">
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>Dynamic County Routing Directory</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    Local contact numbers, school district offices, and Regional Center catchments.
                  </p>
                </div>

                {!countyDetails ? (
                  <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>No resource records found for this county in the database.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    
                    {/* RC Contacts */}
                    <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.7)', padding: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                        <Landmark color="var(--primary-color)" size={18} />
                        California Regional Center Intake
                      </h4>
                      {countyDetails.regionalCenters && countyDetails.regionalCenters.length > 0 ? (
                        countyDetails.regionalCenters.map((rc: any) => (
                          <div key={rc.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                            <strong>{rc.name}</strong>
                            <span><strong>Catchment boundary:</strong> {rc.catchment_boundaries}</span>
                            
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                              <Phone size={14} style={{ flexShrink: 0 }} /> 
                              Intake helpline: 
                              <a href={`tel:${rc.intake_phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{rc.intake_phone}</a>
                              <CopyButton text={rc.intake_phone} size={12} />
                            </span>
                            
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                              <strong>Early Start Contact:</strong> {rc.early_start_contact}
                              <CopyButton text={rc.early_start_contact} size={12} />
                            </span>
                            
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                              <strong>Lanterman Intake:</strong> {rc.lanterman_intake_contact}
                              <CopyButton text={rc.lanterman_intake_contact} size={12} />
                            </span>
                            
                            <a href={rc.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none', marginTop: '0.25rem' }}>
                              <Globe size={14} /> Visit RC Portal
                            </a>
                          </div>
                        ))
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No Regional Center records available.</p>
                      )}
                    </div>

                    {/* County Support Offices */}
                    <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.7)', padding: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                        <MapPin color="var(--primary-color)" size={18} />
                        County Admin Support Offices
                      </h4>
                      {countyDetails.countyOffices && countyDetails.countyOffices.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          {countyDetails.countyOffices.map((office: any) => (
                            <div key={office.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '0.75rem' }}>
                              <strong>{office.office_name}</strong>
                              
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <strong>Address:</strong> {office.address}
                                <CopyButton text={office.address} size={12} />
                              </span>
                              
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <Phone size={14} style={{ flexShrink: 0 }} /> 
                                Phone: 
                                <a href={`tel:${office.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{office.phone}</a>
                                <CopyButton text={office.phone} size={12} />
                              </span>
                              
                              {office.email && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                  <Mail size={14} style={{ flexShrink: 0 }} />
                                  Email: 
                                  <a href={`mailto:${office.email}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{office.email}</a>
                                  <CopyButton text={office.email} size={12} />
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No county-level office records loaded.</p>
                      )}
                    </div>

                    {/* School Districts */}
                    <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.7)', padding: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                        <User color="var(--primary-color)" size={18} />
                        School District Special Education
                      </h4>
                      {countyDetails.schoolDistricts && countyDetails.schoolDistricts.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          {countyDetails.schoolDistricts.map((sd: any) => (
                            <div key={sd.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '0.75rem' }}>
                              <strong>{sd.name}</strong>
                              
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <Phone size={14} style={{ flexShrink: 0 }} /> 
                                SpecEd Helpline: 
                                <a href={`tel:${sd.spec_ed_contact_phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{sd.spec_ed_contact_phone}</a>
                                <CopyButton text={sd.spec_ed_contact_phone} size={12} />
                              </span>
                              
                              {sd.spec_ed_contact_email && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                  <Mail size={14} style={{ flexShrink: 0 }} />
                                  Email: 
                                  <a href={`mailto:${sd.spec_ed_contact_email}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{sd.spec_ed_contact_email}</a>
                                  <CopyButton text={sd.spec_ed_contact_email} size={12} />
                                </span>
                              )}
                              
                              <a href={sd.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none', marginTop: '0.2rem' }}>
                                <Globe size={14} /> District IEP Guidelines
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No school district contacts listed.</p>
                      )}
                    </div>

                  </div>
                )}
              </div>
            )}

          </div>
        </>
      )}

      {/* Hidden Print Container for layout printing */}
      <div className="print-expand" style={{ display: 'none' }}>
        <h1 style={{ color: 'black', background: 'none', WebkitTextFillColor: 'initial', fontSize: '26pt', margin: '0 0 5px 0' }}>
          California Special Needs Family Portal Summary
        </h1>
        <p style={{ fontSize: '11pt', color: '#555', margin: '0 0 20px 0' }}>
          Prepared for consumer <strong>{currentChild?.nickname}</strong> (DOB: {currentChild?.dob}) | Created via CA Special Needs Navigator
        </p>

        {/* 1. Tracked Benefits */}
        <h2 style={{ fontSize: '16pt', borderBottom: '2px solid #333', paddingBottom: '3px', marginTop: '20px' }}>
          Tracked Waiver & Assistance Programs
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
              <th style={{ padding: '6px', fontSize: '10pt' }}>Program Name</th>
              <th style={{ padding: '6px', width: '25%', fontSize: '10pt' }}>Timeline Tracking Status</th>
            </tr>
          </thead>
          <tbody>
            {matchedPrograms.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px', fontSize: '9.5pt', fontWeight: 'bold' }}>{p.name}</td>
                <td style={{ padding: '8px', fontSize: '9.5pt', textTransform: 'capitalize' }}>{getStatusLabel(p.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 2. Respite assessment */}
        {respiteResults.score > 0 && (
          <div style={{ pageBreakInside: 'avoid', marginTop: '30px' }}>
            <h2 style={{ fontSize: '16pt', borderBottom: '2px solid #333', paddingBottom: '3px' }}>
              DDS Respite & Care Demands Evaluation
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
              <div>
                <strong>Supervision safety rating:</strong> {safetyScore} / 5 <br />
                <strong>Night-waking sleep rating:</strong> {sleepScore} / 4 <br />
                <strong>Physical care/medical rating:</strong> {medicalScore} / 4 <br />
                <strong>Behavior management rating:</strong> {behaviorScore} / 4
              </div>
              <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '8px' }}>
                <strong>Calculated support tier:</strong> {respiteResults.tier} <br />
                <strong>Suggested Respite Allocation:</strong> {respiteResults.suggestedHours}
              </div>
            </div>
            <h3 style={{ fontSize: '11pt', marginTop: '15px', marginBottom: '5px' }}>Care Demands Justification Notes:</h3>
            <p style={{ fontSize: '9.5pt', whiteSpace: 'pre-line', margin: 0, fontStyle: 'italic' }}>
              {justificationBullets}
            </p>
          </div>
        )}

        {/* 3. IEP accoms and goals */}
        {(selectedAccommodations.length > 0 || selectedGoals.length > 0) && (
          <div style={{ pageBreakInside: 'avoid', marginTop: '30px' }}>
            <h2 style={{ fontSize: '16pt', borderBottom: '2px solid #333', paddingBottom: '3px' }}>
              Draft IEP Accommodations & Goals blueprint
            </h2>
            
            {selectedAccommodations.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <strong>Target Accommodations List:</strong>
                <ul style={{ fontSize: '9.5pt', paddingLeft: '1.5rem', marginTop: '5px' }}>
                  {selectedAccommodations.map(id => {
                    const item = IEP_ACCOMMODATIONS.find(a => a.id === id);
                    return item ? <li key={id}><strong>{item.title}:</strong> {item.description}</li> : null;
                  })}
                </ul>
              </div>
            )}

            {selectedGoals.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <strong>Measurable Goals Drafts:</strong>
                <ol style={{ fontSize: '9.5pt', paddingLeft: '1.5rem', marginTop: '5px' }}>
                  {selectedGoals.map(id => {
                    const item = SMART_GOAL_TEMPLATES.find(g => g.id === id);
                    return item ? <li key={id} style={{ marginBottom: '8px' }}><strong>{item.title}:</strong> "{getGoalPreviewText(item)}"</li> : null;
                  })}
                </ol>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: '40px', fontSize: '9pt', color: '#777', borderTop: '1px solid #ccc', paddingTop: '10px', textAlign: 'center' }}>
          This timeline summary package consolidates the caregiver records for coordination purposes. Keep medical documentation attached to support the selections.
        </div>
      </div>

      {/* Profile Modals */}
      {isAddingChild && (
        <ChildEditor 
          counties={counties}
          conditions={conditions}
          needs={needs}
          onClose={() => setIsAddingChild(false)}
        />
      )}

      {editingChild && (
        <ChildEditor 
          counties={counties}
          conditions={conditions}
          needs={needs}
          initialChild={editingChild}
          onClose={() => setEditingChild(null)}
        />
      )}

    </main>
  );
}
