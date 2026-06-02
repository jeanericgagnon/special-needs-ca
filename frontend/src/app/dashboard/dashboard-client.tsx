'use client';

import { useState } from 'react';
import { 
  updateProgramStatusAction, 
  toggleChecklistItemAction, 
  addReminderAction, 
  toggleReminderAction, 
  deleteReminderAction,
  deleteChildAction
} from './child-actions';
import type { 
  County, 
  TaxonomyCondition, 
  FunctionalNeed, 
  ChildProfile, 
  Program, 
  ProgramStatus, 
  ChecklistItem, 
  Reminder 
} from '@/lib/db';
import ChildEditor from './child-editor';
import { 
  User, Plus, Edit, Trash2, ShieldCheck, FileText, Calendar, 
  MapPin, CheckCircle, ChevronDown, ChevronUp, AlertCircle, Phone, 
  Globe, Info, FileCheck, Landmark, CheckSquare, Square, Trash 
} from 'lucide-react';

interface DashboardClientProps {
  counties: County[];
  conditions: TaxonomyCondition[];
  needs: FunctionalNeed[];
  childrenList: ChildProfile[];
  selectedChildId: string | null;
  // Dynamic matched data for the selected child
  matchedPrograms: any[]; // Relational matched programs (core)
  crawlerPrograms: Program[]; // 33k db crawler matching programs
  savedStatuses: ProgramStatus[];
  savedChecklist: ChecklistItem[];
  savedReminders: Reminder[];
  countyDetails: any; // Dynamic county data
}

type TabType = 'benefits' | 'county' | 'reminders' | 'checklist';

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
  countyDetails
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('benefits');
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  const [isAddingChild, setIsAddingChild] = useState(false);
  
  // Collapsed states for benefits panel
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
  
  // Custom reminder form state
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderProgId, setReminderProgId] = useState('');

  const currentChild = childrenList.find(c => c.id === selectedChildId) || childrenList[0];

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
      window.location.href = '/dashboard'; // Force full refresh/redirect
    }
  };

  // Helper to check if a document is collected
  const isDocCollected = (docName: string, progId: string) => {
    return savedChecklist.some(c => c.document_name === docName && c.program_id === progId && c.is_collected === 1);
  };

  return (
    <main className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '1150px' }}>
      
      {/* 1. Header & Children Switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Family Portal</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Coordinate care timelines and benefits tracking.</p>
        </div>

        {/* Child selector tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
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

      {/* No Child Onboarding View */}
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
          {/* 2. Active Child Summary Panel */}
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
                    {currentChild.conditionIds?.[0] || 'Diagnosed Condition'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
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

          {/* 3. Dashboard Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.08)', marginBottom: '2rem', gap: '1.5rem', overflowX: 'auto' }}>
            <button 
              onClick={() => setActiveTab('benefits')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'benefits' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'benefits' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ShieldCheck size={18} /> Benefits & Trackers
            </button>
            
            <button 
              onClick={() => setActiveTab('checklist')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'checklist' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'checklist' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FileCheck size={18} /> Document Checklist
            </button>

            <button 
              onClick={() => setActiveTab('county')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'county' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'county' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Landmark size={18} /> County Resources
            </button>

            <button 
              onClick={() => setActiveTab('reminders')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'reminders' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'reminders' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Calendar size={18} /> Deadlines & Reminders
            </button>
          </div>

          {/* 4. Tab Views Content */}
          <div style={{ minHeight: '400px' }}>
            
            {/* TAB A: BENEFITS & TRACKER */}
            {activeTab === 'benefits' && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Core Matched State Programs</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    Based on eligibility criteria matching conditions & functional needs.
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                  {matchedPrograms.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
                      <p>No major state-mandated programs matched this child's profile directly. Check other tabs or expand your child's functional needs checklist.</p>
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

                            {/* Tracking Controls */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Track Status:</label>
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

                          {/* Expanded guides and checklist */}
                          {isExpanded && (
                            <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                              
                              <div>
                                <h5 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                  <Info size={16} /> Eligibility & Application Details
                                </h5>
                                <p style={{ fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                                  <strong>Who it's for:</strong> {program.who_it_is_for}
                                </p>
                                <p style={{ fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                  <strong>Qualifying bounds:</strong> {program.who_might_qualify}
                                </p>

                                {program.applicationSteps && program.applicationSteps.length > 0 && (
                                  <>
                                    <h6 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Next Steps to Apply:</h6>
                                    <ol style={{ fontSize: '0.85rem', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', lineHeight: '1.5' }}>
                                      {program.applicationSteps.map((step: any) => (
                                        <li key={step.id}>
                                          <strong>{step.title}:</strong> {step.action_description}
                                          {step.apply_url_or_contact && (
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                              Link/Contact: {step.apply_url_or_contact}
                                            </span>
                                          )}
                                        </li>
                                      ))}
                                    </ol>
                                  </>
                                )}
                              </div>

                              <div>
                                <h5 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                  <FileText size={16} /> Required Document Checklist
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
                                      <AlertCircle size={14} /> Denial Appeal Guide (Deadline: {program.appealInfo.deadline_days})
                                    </h6>
                                    <p style={{ fontSize: '0.75rem', lineHeight: '1.5', marginBottom: '0.5rem' }}>
                                      <strong>Typical Denial Claim:</strong> {program.appealInfo.denial_reasons}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                                      <strong>Steps to Appeal:</strong>\n{program.appealInfo.appeal_steps}
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

                {/* Database crawler matched long-tail rules list */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Dynamic Crawled Rules Matching</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  These matching regulations are parsed directly from our database of 33,000+ scraped California state documents.
                </p>

                <div className="grid" style={{ marginTop: '1rem' }}>
                  {crawlerPrograms.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem' }}>
                      <p>No additional crawler rules matched. Keep searching!</p>
                    </div>
                  ) : (
                    crawlerPrograms.map(prog => (
                      <div key={prog.id} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.6)' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>{prog.program_name}</h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
                          <span><strong>Demographic:</strong> {prog.target_demographic}</span>
                          <span><strong>Ages:</strong> {prog.age_limit_min} - {prog.age_limit_max} years</span>
                          <span><strong>Income Cap:</strong> {prog.income_limit}</span>
                        </div>
                        <a 
                          href={prog.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ fontSize: '0.85rem', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', fontWeight: 600 }}
                        >
                          <Globe size={14} /> Open Government Source Document
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB B: DOCUMENT CHECKLIST */}
            {activeTab === 'checklist' && (
              <div className="animate-fade-in">
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>Master Document Checklist</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    Aggregate file checklist across all benefit programs you are actively tracking.
                  </p>
                </div>

                <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.85)', padding: '2rem' }}>
                  {savedChecklist.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <FileCheck size={36} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
                      <p style={{ color: 'var(--text-light)' }}>
                        Your master checklist is empty. Make sure you set a program status to "Applied" or "Waiting" and check its expanded panels to unlock checkboxes!
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {savedChecklist.map(item => (
                        <div 
                          key={item.id}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            padding: '0.8rem 1.2rem',
                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                            background: item.is_collected === 1 ? 'rgba(99,102,241,0.03)' : 'transparent'
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
                              <strong style={{ fontSize: '0.95rem', textDecoration: item.is_collected === 1 ? 'line-through' : 'none' }}>
                                {item.document_name}
                              </strong>
                              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                Program: {matchedPrograms.find(p => p.id === item.program_id)?.name || item.program_id}
                              </span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB C: COUNTY RESOURCES */}
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
                    
                    {/* 1. Regional Centers */}
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
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={14} /> Intake helpline: {rc.intake_phone}</span>
                            <span><strong>Early Start Contact:</strong> {rc.early_start_contact}</span>
                            <span><strong>Lanterman Intake:</strong> {rc.lanterman_intake_contact}</span>
                            <span><strong>Languages spoken:</strong> {rc.languages}</span>
                            <a href={rc.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none', marginTop: '0.25rem' }}>
                              <Globe size={14} /> Visit RC Portal
                            </a>
                          </div>
                        ))
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No Regional Center records available.</p>
                      )}
                    </div>

                    {/* 2. County Government Offices */}
                    <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.7)', padding: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                        <MapPin color="var(--primary-color)" size={18} />
                        County Admin Support Offices
                      </h4>
                      {countyDetails.countyOffices && countyDetails.countyOffices.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          {countyDetails.countyOffices.map((office: any) => (
                            <div key={office.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                              <strong>{office.office_name}</strong>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Program: {matchedPrograms.find(p => p.id === office.program_id)?.name || office.program_id}</span>
                              <span><strong>Address:</strong> {office.address}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={14} /> Phone: {office.phone}</span>
                              {office.email && <span><strong>Email:</strong> {office.email}</span>}
                              {office.website && (
                                <a href={office.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
                                  <Globe size={14} /> Visit County Website
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No county-level office records loaded.</p>
                      )}
                    </div>

                    {/* 3. School District IEP Offices */}
                    <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.7)', padding: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                        <User color="var(--primary-color)" size={18} />
                        School District Special Education
                      </h4>
                      {countyDetails.schoolDistricts && countyDetails.schoolDistricts.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {countyDetails.schoolDistricts.map((sd: any) => (
                            <div key={sd.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                              <strong>{sd.name}</strong>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={14} /> SpecEd Helpline: {sd.spec_ed_contact_phone}</span>
                              {sd.spec_ed_contact_email && <span><strong>Email:</strong> {sd.spec_ed_contact_email}</span>}
                              <a href={sd.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
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

            {/* TAB D: REMINDERS & DEADLINES */}
            {activeTab === 'reminders' && (
              <div className="animate-fade-in">
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>Timelines & Application Deadlines</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    Keep on top of renewal dates and state hearing response periods.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                  
                  {/* Reminders List */}
                  <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.85)', padding: '2rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Active Notifications</h4>
                    {savedReminders.length === 0 ? (
                      <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>No pending deadlines registered.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {savedReminders.map(rem => (
                          <div 
                            key={rem.id}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              padding: '0.8rem',
                              borderRadius: '12px',
                              background: rem.is_completed === 1 ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.5)',
                              border: '1px solid rgba(0,0,0,0.04)'
                            }}
                          >
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flex: 1 }}>
                              <input 
                                type="checkbox"
                                checked={rem.is_completed === 1}
                                onChange={() => handleToggleReminder(rem.id, rem.is_completed)}
                                style={{ width: 'auto' }}
                              />
                              <div>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', textDecoration: rem.is_completed === 1 ? 'line-through' : 'none' }}>
                                  {rem.title}
                                </span>
                                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                  Due: {rem.due_date}
                                </span>
                              </div>
                            </label>
                            
                            <button 
                              onClick={() => handleDeleteReminder(rem.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }}
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Reminder Form */}
                  <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.85)', padding: '2rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Create Calendar Alert</h4>
                    <form onSubmit={handleAddReminder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="input-group">
                        <label htmlFor="remTitle">Reminder Title</label>
                        <input 
                          type="text" 
                          id="remTitle"
                          value={reminderTitle}
                          onChange={(e) => setReminderTitle(e.target.value)}
                          placeholder="e.g. IHSS SOC 873 evaluation form due"
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label htmlFor="remDate">Alert Date</label>
                        <input 
                          type="date" 
                          id="remDate"
                          value={reminderDate}
                          onChange={(e) => setReminderDate(e.target.value)}
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label htmlFor="remProg">Program Reference (Optional)</label>
                        <select 
                          id="remProg"
                          value={reminderProgId}
                          onChange={(e) => setReminderProgId(e.target.value)}
                        >
                          <option value="">None</option>
                          {matchedPrograms.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <button type="submit" className="btn-primary">
                        Set Reminder Alert
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            )}

          </div>
        </>
      )}

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
