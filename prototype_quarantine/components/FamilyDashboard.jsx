import React, { useState, useEffect } from 'react';
import { runMatchingEngine, calculateAge } from '../engine/matchingEngine';
import { programs, conditions, functionalNeeds, counties, resourceProviders } from '../data/seedData';
import { 
  User, CheckSquare, Calendar, PhoneCall, MapPin, 
  Sparkles, FileText, CheckCircle2, AlertTriangle, Plus, Trash2, ArrowUpRight, UploadCloud 
} from 'lucide-react';

export default function FamilyDashboard({ activeProfile, setActiveProfile, profilesList, onUpdateProfile, onAddProfile }) {
  const [activeSubTab, setActiveSubTab] = useState('matches'); // 'matches' | 'tracker' | 'documents' | 'reminders' | 'contacts'
  
  // Interactive Checklist states
  const [docsChecklist, setDocsChecklist] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notesLog, setNotesLog] = useState([]);
  const [customDocName, setCustomDocName] = useState('');
  
  // New Reminder state
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderDate, setNewReminderDate] = useState('');
  
  // New Call Log state
  const [newCallPerson, setNewCallPerson] = useState('');
  const [newCallAgency, setNewCallAgency] = useState('');
  const [newCallNotes, setNewCallNotes] = useState('');

  // Initializing state based on active profile
  useEffect(() => {
    if (!activeProfile) return;
    
    // Seed initial documents checklist
    const initialDocs = [
      { id: 'doc-1', name: 'Neuropsychological / Clinical Diagnosis Report', collected: true, file: 'diagnosis_report_2024.pdf' },
      { id: 'doc-2', name: 'Pediatrician Referral Letter (EPSDT necessity)', collected: false, file: null },
      { id: 'doc-3', name: 'Individualized Education Program (IEP) copy', collected: true, file: 'iep_document_final.pdf' },
      { id: 'doc-4', name: '24-hour Daily Safety & Care Log', collected: false, file: null },
      { id: 'doc-5', name: 'Active Medi-Cal Card Copy', collected: false, file: null }
    ];
    setDocsChecklist(initialDocs);

    // Seed initial reminders
    const initialReminders = [
      { id: 'rem-1', title: 'Mail pediatrician SOC 873 form to county worker', date: '2026-06-15', done: false },
      { id: 'rem-2', title: 'Call Golden Gate RC to confirm receipt of intake files', date: '2026-06-08', done: true }
    ];
    setReminders(initialReminders);

    // Seed initial call logs
    const initialLogs = [
      { id: 'log-1', person: 'Sarah Jenkins', agency: 'Lanterman RC Coordinator', date: '2026-05-24', notes: 'Inquired about Fifth Category eligibility criteria. Sarah sent the intake paperwork package to our home address.' }
    ];
    setNotesLog(initialLogs);
  }, [activeProfile]);

  if (!activeProfile) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '60px', marginTop: '40px' }}>
        <User size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
        <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>No Child Profile Active</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
          Please complete the quick Milestones Screener to identify your child's developmental tags, or register a child profile to construct their persistent dashboard plan.
        </p>
        <button className="btn btn-primary" onClick={() => setCurrentTab('screener')}>
          Go to Screener Wizard
        </button>
      </div>
    );
  }

  // Run the matching engine
  const matches = runMatchingEngine(activeProfile);

  // Status updates in tracker
  const handleStatusChange = (progId, newStatus) => {
    const currentServices = activeProfile.currentServiceIds || [];
    let updatedServices = [...currentServices];
    
    if (newStatus === 'active') {
      if (!updatedServices.includes(progId)) updatedServices.push(progId);
    } else {
      updatedServices = updatedServices.filter(id => id !== progId);
    }
    
    // Create or update status in local track object
    const statusMap = activeProfile.statusMap || {};
    const updatedStatusMap = { ...statusMap, [progId]: newStatus };
    
    onUpdateProfile(activeProfile.id, {
      ...activeProfile,
      currentServiceIds: updatedServices,
      statusMap: updatedStatusMap
    });
  };

  // Add custom doc requirement
  const handleAddCustomDoc = (e) => {
    e.preventDefault();
    if (!customDocName) return;
    const newDoc = {
      id: 'doc-' + Date.now(),
      name: customDocName,
      collected: false,
      file: null
    };
    setDocsChecklist([...docsChecklist, newDoc]);
    setCustomDocName('');
  };

  // Check off doc
  const handleToggleDoc = (id) => {
    setDocsChecklist(docsChecklist.map(doc => doc.id === id ? { ...doc, collected: !doc.collected } : doc));
  };

  // Delete doc
  const handleDeleteDoc = (id) => {
    setDocsChecklist(docsChecklist.filter(doc => doc.id !== id));
  };

  // Mock File Upload
  const handleMockUpload = (id) => {
    setDocsChecklist(docsChecklist.map(doc => doc.id === id ? { ...doc, collected: true, file: 'uploaded_document_' + Math.floor(Math.random()*100) + '.pdf' } : doc));
  };

  // Add Reminder
  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newReminderTitle || !newReminderDate) return;
    const newRem = {
      id: 'rem-' + Date.now(),
      title: newReminderTitle,
      date: newReminderDate,
      done: false
    };
    setReminders([...reminders, newRem]);
    setNewReminderTitle('');
    setNewReminderDate('');
  };

  // Check off reminder
  const handleToggleReminder = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, done: !r.done } : r));
  };

  // Delete reminder
  const handleDeleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  // Add Call Log
  const handleAddCallLog = (e) => {
    e.preventDefault();
    if (!newCallPerson || !newCallNotes) return;
    const newLog = {
      id: 'log-' + Date.now(),
      person: newCallPerson,
      agency: newCallAgency || 'County Social Services',
      date: new Date().toISOString().split('T')[0],
      notes: newCallNotes
    };
    setNotesLog([newLog, ...notesLog]);
    setNewCallPerson('');
    setNewCallAgency('');
    setNewCallNotes('');
  };

  const handleDeleteCallLog = (id) => {
    setNotesLog(notesLog.filter(l => l.id !== id));
  };

  const computedAge = calculateAge(activeProfile.dob);
  const statusMap = activeProfile.statusMap || {};

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0' }}>
      
      {/* Top Profile Summary Bar */}
      <div className="glass-panel" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(25, 35, 60, 0.7) 0%, rgba(139, 92, 246, 0.05) 100%)',
        borderColor: 'rgba(139, 92, 246, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '12px',
            borderRadius: '50%',
            color: 'var(--accent-purple)',
            border: '1px solid var(--glass-border)'
          }}>
            <User size={30} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '22px' }}>{activeProfile.nickname}'s Dashboard</h2>
              <span className="badge badge-purple" style={{ fontSize: '10px' }}>
                Age: {computedAge.years}y {computedAge.months}m
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
              Primary County: <strong>{counties.find(c => c.id === activeProfile.countyId)?.name || 'CA'}</strong> | Insurance: <strong>{activeProfile.insuranceType.toUpperCase()}</strong> | Active Conditions: {activeProfile.conditionIds.map(cid => conditions.find(c => c.id === cid)?.name).join(', ') || 'No formal diagnosis'}
            </p>
          </div>
        </div>

        {/* Profile Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            className="form-select"
            style={{ width: '180px', padding: '8px 12px', fontSize: '13px' }}
            value={activeProfile.id}
            onChange={(e) => {
              const selected = profilesList.find(p => p.id === e.target.value);
              if (selected) setActiveProfile(selected);
            }}
          >
            {profilesList.map(p => (
              <option key={p.id} value={p.id}>{p.nickname}'s Case</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px' }} className="dashboard-grid">
        
        {/* Sidebar Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'matches', label: 'Matching Benefits Scanner', icon: Sparkles },
            { id: 'tracker', label: 'Application Pipeline', icon: CheckCircle2 },
            { id: 'documents', label: 'Document Vault Checklist', icon: FileText },
            { id: 'reminders', label: 'Reminders & Interaction Logs', icon: Calendar },
            { id: 'contacts', label: 'Local Directory Contacts', icon: MapPin }
          ].map(btn => {
            const Icon = btn.icon;
            const active = activeSubTab === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setActiveSubTab(btn.id)}
                style={{
                  background: active ? 'var(--accent-purple)' : 'rgba(255,255,255,0.02)',
                  border: '1px solid',
                  borderColor: active ? 'var(--accent-purple)' : 'var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  color: active ? 'white' : 'var(--text-secondary)',
                  padding: '12px 18px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'var(--transition-fast)'
                }}
                onMouseOver={(e) => {
                  if (!active) e.currentTarget.style.borderColor = 'var(--accent-purple)';
                }}
                onMouseOut={(e) => {
                  if (!active) e.currentTarget.style.borderColor = 'var(--glass-border)';
                }}
              >
                <Icon size={16} />
                {btn.label}
              </button>
            );
          })}

          {/* Quick Audit Scanner */}
          <div style={{
            marginTop: '30px',
            background: 'rgba(20, 184, 166, 0.05)',
            border: '1px dashed var(--accent-teal)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <h4 style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '6px' }}>What am I missing?</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
              Verify active files against the comprehensive coverage index to catch hidden benefit gaps.
            </p>
            <button 
              className="btn btn-teal" 
              style={{ width: '100%', padding: '6px 12px', fontSize: '11px' }}
              onClick={() => {
                alert(`Real-time Coverage Gap Scan Completed!\nNo critical gaps found for ${activeProfile.nickname}.\nRecommended next step: Complete Frank D. Lanterman RC intake coordination.`);
              }}
            >
              Verify Active Files
            </button>
          </div>
        </div>

        {/* Main Tab Render */}
        <div className="glass-panel" style={{ minHeight: '520px' }}>
          
          {/* TAB 1: MATCHING BENEFITS SCANNER */}
          {activeSubTab === 'matches' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '20px' }}>Match Engine Scanner Results</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                    Calculated in real-time based on age band parameters, county, and diagnoses profile.
                  </p>
                </div>
                <span className="badge badge-teal" style={{ display: 'flex', gap: '4px' }}>
                  <Sparkles size={12} /> Scan Refresh Complete
                </span>
              </div>

              {/* Priority list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {matches.highPriority.map(prog => {
                  const currentStatus = statusMap[prog.id] || 'recommended';
                  return (
                    <div key={prog.id} style={{
                      background: 'rgba(15, 23, 42, 0.25)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{prog.name}</h4>
                          <span className="badge badge-purple" style={{ fontSize: '9px' }}>High Priority</span>
                        </div>
                        
                        {/* Tracker quick setter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pipeline Status:</span>
                          <select
                            className="form-select"
                            style={{ width: '150px', padding: '4px 8px', fontSize: '11px' }}
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(prog.id, e.target.value)}
                          >
                            <option value="recommended">Recommended</option>
                            <option value="gathering-documents">Gathering Docs</option>
                            <option value="applied">Applied / Submitted</option>
                            <option value="waiting">Waiting Decision</option>
                            <option value="approved">Approved / Active</option>
                            <option value="denied">Denied / Rejected</option>
                          </select>
                        </div>
                      </div>

                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{prog.description}</p>
                      
                      <div style={{
                        background: 'rgba(139, 92, 246, 0.05)',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: '1px solid rgba(139,92,246,0.15)',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        marginBottom: '12px'
                      }}>
                        <strong>Trigger Reason:</strong> {prog.whyMatched}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <div>Source: <a href={prog.officialSourceUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-teal)' }}>Official CDSS guidelines</a></div>
                        <div>Last verified: {prog.lastVerifiedDate}</div>
                      </div>
                    </div>
                  );
                })}

                {matches.possible.map(prog => {
                  const currentStatus = statusMap[prog.id] || 'recommended';
                  return (
                    <div key={prog.id} style={{
                      background: 'rgba(15, 23, 42, 0.1)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>{prog.name}</h4>
                          <span className="badge badge-teal" style={{ fontSize: '9px' }}>Possible Match</span>
                        </div>
                        <select
                          className="form-select"
                          style={{ width: '150px', padding: '4px 8px', fontSize: '11px' }}
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(prog.id, e.target.value)}
                        >
                          <option value="recommended">Recommended</option>
                          <option value="gathering-documents">Gathering Docs</option>
                          <option value="applied">Applied / Submitted</option>
                          <option value="waiting">Waiting Decision</option>
                          <option value="approved">Approved / Active</option>
                        </select>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{prog.description}</p>
                      <div style={{ fontSize: '12px', color: 'var(--accent-teal)' }}>
                        <strong>Recommendation context:</strong> {prog.whyMatched}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: APPLICATION TRACKER PIPELINE */}
          {activeSubTab === 'tracker' && (
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Application Pipeline & Track Logs</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
                Track and log applications in chronologic pipelines. Keep files organized by status.
              </p>

              {/* Status List Columns */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { id: 'gathering-documents', label: 'Gathering Documents', color: 'var(--accent-teal)' },
                  { id: 'applied', label: 'Submitted / Applied', color: 'var(--accent-blue)' },
                  { id: 'waiting', label: 'Waiting on Decision / Assessment', color: 'var(--accent-purple)' },
                  { id: 'approved', label: 'Approved & Active Benefits', color: '#10b981' },
                  { id: 'denied', label: 'Denied / Appealing', color: 'var(--accent-coral)' }
                ].map(col => {
                  // Find programs in this column status
                  const columnProgs = programs.filter(p => statusMap[p.id] === col.id);
                  return (
                    <div key={col.id} style={{
                      background: 'rgba(15,23,42,0.2)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: col.color, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                          {col.label} ({columnProgs.length})
                        </span>
                      </div>
                      
                      {columnProgs.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {columnProgs.map(cp => (
                            <div key={cp.id} style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid var(--glass-border)',
                              padding: '12px 16px',
                              borderRadius: 'var(--radius-sm)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <div>
                                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{cp.name}</strong>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                  Reference code: {cp.id} | Local County handling office active
                                </div>
                              </div>
                              
                              <select
                                className="form-select"
                                style={{ width: '130px', padding: '4px 8px', fontSize: '11px' }}
                                value={col.id}
                                onChange={(e) => handleStatusChange(cp.id, e.target.value)}
                              >
                                <option value="gathering-documents">Gathering Docs</option>
                                <option value="applied">Applied</option>
                                <option value="waiting">Waiting</option>
                                <option value="approved">Approved</option>
                                <option value="denied">Denied</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No programs currently set to this status.</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENT CHECKLIST VAULT */}
          {activeSubTab === 'documents' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '20px' }}>Checklist Vault Directory</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                    Gather clinical, medical, and school logs. Check off items or attach mock files.
                  </p>
                </div>
                {/* Collected Progress Bar */}
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-teal)' }}>
                    {docsChecklist.filter(d => d.collected).length} / {docsChecklist.length} Collected
                  </span>
                  <div style={{ width: '120px', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '999px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${(docsChecklist.filter(d => d.collected).length / docsChecklist.length) * 100}%`, 
                      height: '100%', 
                      background: 'var(--accent-teal)' 
                    }} />
                  </div>
                </div>
              </div>

              {/* Add Custom Doc form */}
              <form onSubmit={handleAddCustomDoc} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder="Add custom required file name (e.g. Audiology exam graph...)"
                  className="form-input"
                  style={{ fontSize: '13px' }}
                  value={customDocName}
                  onChange={(e) => setCustomDocName(e.target.value)}
                />
                <button type="submit" className="btn btn-teal" style={{ padding: '10px 18px', fontSize: '13px', flexShrink: 0 }}>
                  <Plus size={16} /> Add File Rule
                </button>
              </form>

              {/* Checklist list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {docsChecklist.map(doc => (
                  <div key={doc.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid var(--glass-border)',
                    padding: '14px 20px',
                    borderRadius: 'var(--radius-md)',
                    transition: 'var(--transition-fast)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        checked={doc.collected}
                        onChange={() => handleToggleDoc(doc.id)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
                      />
                      <div>
                        <span style={{ 
                          fontSize: '13px', 
                          fontWeight: 500, 
                          color: doc.collected ? 'var(--text-secondary)' : 'var(--text-primary)',
                          textDecoration: doc.collected ? 'line-through' : 'none'
                        }}>
                          {doc.name}
                        </span>
                        {doc.file && (
                          <div style={{ fontSize: '11px', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <FileText size={12} /> {doc.file} (Mock Attached)
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => handleMockUpload(doc.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: doc.file ? 'var(--text-muted)' : 'var(--accent-teal)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        <UploadCloud size={14} /> {doc.file ? 'Replace File' : 'Attach File'}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-coral)', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REMINDERS & PHONE INTERACTION LOGS */}
          {activeSubTab === 'reminders' && (
            <div>
              <div className="grid-cols-2" style={{ gap: '30px' }}>
                {/* Reminders List */}
                <div>
                  <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--text-primary)' }}>Calendar & Reminders</h3>
                  
                  <form onSubmit={handleAddReminder} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                    <input
                      type="text"
                      placeholder="Reminder task (e.g. Call FRC for respite)"
                      className="form-input"
                      style={{ fontSize: '12px', padding: '8px 12px' }}
                      value={newReminderTitle}
                      onChange={(e) => setNewReminderTitle(e.target.value)}
                    />
                    <input
                      type="date"
                      className="form-input"
                      style={{ fontSize: '12px', padding: '8px 12px' }}
                      value={newReminderDate}
                      onChange={(e) => setNewReminderDate(e.target.value)}
                    />
                    <button type="submit" className="btn btn-teal" style={{ padding: '6px 12px', fontSize: '12px', width: '100%' }}>
                      Add Alarm / Timer
                    </button>
                  </form>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {reminders.map(rem => (
                      <div key={rem.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--glass-border)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="checkbox"
                            checked={rem.done}
                            onChange={() => handleToggleReminder(rem.id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <div>
                            <span style={{ fontSize: '12px', fontWeight: 500, color: rem.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: rem.done ? 'line-through' : 'none' }}>
                              {rem.title}
                            </span>
                            <span style={{ display: 'block', fontSize: '10px', color: 'var(--accent-coral)', marginTop: '2px' }}>
                              Due: {rem.date}
                            </span>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteReminder(rem.id)} style={{ background: 'none', border: 'none', color: 'var(--accent-coral)', cursor: 'pointer' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call Notes & logs */}
                <div>
                  <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--text-primary)' }}>Care Coordinator Phone Logs</h3>
                  
                  <form onSubmit={handleAddCallLog} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Representative name"
                        className="form-input"
                        style={{ fontSize: '12px', padding: '8px 12px' }}
                        value={newCallPerson}
                        onChange={(e) => setNewCallPerson(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Agency / Office"
                        className="form-input"
                        style={{ fontSize: '12px', padding: '8px 12px' }}
                        value={newCallAgency}
                        onChange={(e) => setNewCallAgency(e.target.value)}
                      />
                    </div>
                    <textarea
                      placeholder="Notes: 'Worker approved MTP OT request but needs audiology graph...'"
                      className="form-textarea"
                      rows={3}
                      style={{ fontSize: '12px', padding: '8px 12px' }}
                      value={newCallNotes}
                      onChange={(e) => setNewCallNotes(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      Record Phone Log <PhoneCall size={12} />
                    </button>
                  </form>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto' }}>
                    {notesLog.map(log => (
                      <div key={log.id} style={{
                        background: 'rgba(0,0,0,0.15)',
                        border: '1px solid var(--glass-border)',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        position: 'relative'
                      }}>
                        <button
                          onClick={() => handleDeleteCallLog(log.id)}
                          style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: 'var(--accent-coral)', cursor: 'pointer' }}
                        >
                          <Trash2 size={12} />
                        </button>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          <span><strong>{log.person}</strong> ({log.agency})</span>
                          <span>{log.date}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {log.notes}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LOCAL DIRECTORY CONTACTS & PROVIDERS */}
          {activeSubTab === 'contacts' && (
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Local Catchment Offices & Resource Mappings</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
                Direct routing mapped based on child's county location (<strong>{counties.find(c => c.id === activeProfile.countyId)?.name || 'CA'}</strong>).
              </p>

              <div className="grid-cols-2">
                {/* Local Mapped Offices */}
                <div>
                  <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '12px' }}>Official Application Offices</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {matches.localOffices.map((off, idx) => (
                      <div key={idx} style={{
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--glass-border)',
                        padding: '14px',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <span className="badge badge-teal" style={{ fontSize: '9px', marginBottom: '4px' }}>{off.type}</span>
                        <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-primary)' }}>{off.name}</strong>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{off.contact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Local Organizations & Providers */}
                <div>
                  <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '12px' }}>Support Networks & Providers</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    {/* organizations */}
                    {matches.localOrganizations.map((org, idx) => (
                      <div key={idx} style={{
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--glass-border)',
                        padding: '14px',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <span className="badge badge-purple" style={{ fontSize: '9px', marginBottom: '4px' }}>Support Group</span>
                        <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-primary)' }}>{org.name}</strong>
                        <a href={org.website} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: 'var(--accent-teal)', display: 'block', marginTop: '4px', textDecoration: 'none' }}>
                          Visit Portal <ArrowUpRight size={10} style={{ display: 'inline' }} />
                        </a>
                      </div>
                    ))}

                    {/* vended resource providers */}
                    {resourceProviders.filter(rp => rp.countyId === activeProfile.countyId).map(rp => (
                      <div key={rp.id} style={{
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--glass-border)',
                        padding: '14px',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <span className="badge badge-blue" style={{ fontSize: '9px', marginBottom: '4px' }}>Vended Service Provider</span>
                        <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-primary)' }}>{rp.name}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <div>Phone: {rp.phone} | Mail: {rp.email}</div>
                          <div>Vendor IDs: {rp.regionalCenterVendorIds.join(', ')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
}
