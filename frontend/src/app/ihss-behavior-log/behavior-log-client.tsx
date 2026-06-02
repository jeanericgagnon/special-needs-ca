'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, Plus, Trash2, Printer, Info, 
  Clock, AlertOctagon, AlertTriangle, BookOpen, Check 
} from 'lucide-react';
import PrintButton from '@/components/print-button';

interface SafetyIncident {
  id: string;
  time: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'critical';
  details: string;
  intervention: string;
}

const DEFAULT_INCIDENTS: SafetyIncident[] = [
  {
    id: 'inc-1',
    time: '08:15 AM',
    category: 'Elopement / Wandering',
    riskLevel: 'critical',
    details: 'Unlocked the front deadbolt lock while parent was in kitchen. Child eloped into the active driveway toward the main street with zero awareness of oncoming cars.',
    intervention: 'Chased child down, retrieved physically, carried back inside, locked deadbolt, and added safety cover to the doorknob.'
  },
  {
    id: 'inc-2',
    time: '11:30 AM',
    category: 'Pica (Swallowing non-foods)',
    riskLevel: 'critical',
    details: 'Attempted to swallow small decorative gravel pebbles from a potted indoor plant, presenting an immediate choking/toxicity risk.',
    intervention: 'Verbally redirected, physically swept mouth to clear pebbles, and moved all potted plants to locked shelving areas.'
  },
  {
    id: 'inc-3',
    time: '03:45 PM',
    category: 'Self-Injurious Behavior',
    riskLevel: 'medium',
    details: 'Began severe head-banging against the drywall and picking at scabs on arms when instructed to transition from tablet to dinner.',
    intervention: 'Placed soft floor cushions behind child\'s head, applied noise-canceling headphones, and sat next to child to guide sensory calm down.'
  },
  {
    id: 'inc-4',
    time: '07:20 PM',
    category: 'Climbing / Fall Hazards',
    riskLevel: 'medium',
    details: 'Scaled the kitchen counter attempting to reach upper cabinets to access sugar jars, ignoring warnings and risking a 4-foot fall onto tiles.',
    intervention: 'Caught child, helped them step down safely, verbally explained the danger, and installed cabinet safety latches.'
  }
];

export default function BehaviorLogClient() {
  const [incidents, setIncidents] = useState<SafetyIncident[]>(DEFAULT_INCIDENTS);
  
  // New Incident Form States
  const [time, setTime] = useState('08:00 AM');
  const [category, setCategory] = useState('Elopement / Wandering');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'critical'>('medium');
  const [details, setDetails] = useState('');
  const [intervention, setIntervention] = useState('');

  // Parent/Child info for printable header
  const [parentName, setParentName] = useState('Jane Doe');
  const [childName, setChildName] = useState('Alex');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || !intervention.trim()) return;

    const newInc: SafetyIncident = {
      id: `inc-${Date.now()}`,
      time,
      category,
      riskLevel,
      details,
      intervention
    };

    setIncidents(prev => [...prev, newInc]);
    
    // Reset inputs
    setDetails('');
    setIntervention('');
  };

  const handleDeleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return '#ef4444'; // Red
      case 'medium': return '#f59e0b'; // Amber
      default: return '#10b981'; // Green
    }
  };

  const getCriticalCount = () => incidents.filter(i => i.riskLevel === 'critical').length;
  const getMediumCount = () => incidents.filter(i => i.riskLevel === 'medium').length;

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '5rem', maxWidth: '1150px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <ShieldAlert size={48} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
        <h1>IHSS 24-Hour Behavior & Safety Log</h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', color: 'var(--text-light)' }}>
          Document elopement, self-harm, pica, and climbing incidents. Present this printable safety journal to your county social worker to substantiate the need for 24/7 Protective Supervision.
        </p>
      </div>

      {/* Info Warning Alert */}
      <div className="glass-panel no-print" style={{ 
        background: 'rgba(99, 102, 241, 0.05)', 
        border: '1px solid rgba(99, 102, 241, 0.2)', 
        borderRadius: '24px', 
        padding: '1.5rem', 
        marginBottom: '2rem',
        display: 'flex', 
        gap: '1rem', 
        alignItems: 'flex-start'
      }}>
        <Info size={24} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Why is this log crucial?</strong>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
            Under California DSS regulations, minor children only qualify for Protective Supervision if parents prove the child needs **continuous safety monitoring** due to developmental impairments. Standard pediatric delays are insufficient. Social workers expect to see a written, dated log detailing safety risk incidents and the immediate caregiver interventions that kept the child safe.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        
        {/* Left Column: Form and Settings */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="grid-col-lg-4">
          
          {/* Metadata Block */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
              Log Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Child's Name</label>
                <input 
                  type="text" 
                  value={childName} 
                  onChange={(e) => setChildName(e.target.value)} 
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Parent/Reporter</label>
                <input 
                  type="text" 
                  value={parentName} 
                  onChange={(e) => setParentName(e.target.value)} 
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Log Date</label>
                <input 
                  type="date" 
                  value={logDate} 
                  onChange={(e) => setLogDate(e.target.value)} 
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          {/* Form to Add New Incident */}
          <form onSubmit={handleAddIncident} className="glass-panel no-print" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Plus size={18} color="var(--primary-color)" /> Log Safety Incident
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Time of Incident</label>
                <input 
                  type="text" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  placeholder="e.g. 02:30 PM"
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Behavior Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                >
                  <option value="Elopement / Wandering">Elopement / Wandering</option>
                  <option value="Pica (Swallowing non-foods)">Pica (Swallowing non-foods)</option>
                  <option value="Self-Injurious Behavior">Self-Injurious Behavior</option>
                  <option value="Climbing / Fall Hazards">Climbing / Fall Hazards</option>
                  <option value="Fire / Water Hazards">Fire / Water Hazards</option>
                  <option value="Aggressive Outburst">Aggressive Outburst</option>
                  <option value="Other Safety Risk">Other Safety Risk</option>
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Risk Level</label>
                <select 
                  value={riskLevel} 
                  onChange={(e) => setRiskLevel(e.target.value as any)}
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                >
                  <option value="low">Low Risk (Minor concern)</option>
                  <option value="medium">Medium Risk (Needs monitoring)</option>
                  <option value="critical">Critical Risk (Immediate injury risk)</option>
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Incident Details (What did child do?)</label>
                <textarea 
                  value={details} 
                  onChange={(e) => setDetails(e.target.value)} 
                  placeholder="e.g. Unlocked window, climbed onto sill to jump down..."
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                  required
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Caregiver Intervention (What did you do?)</label>
                <textarea 
                  value={intervention} 
                  onChange={(e) => setIntervention(e.target.value)} 
                  placeholder="e.g. Lifted child off sill, locked latch, applied safety lock..."
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', minHeight: '60px', fontFamily: 'inherit', resize: 'vertical' }}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Add to Safety Log
              </button>

            </div>
          </form>

        </div>

        {/* Right Column: Active Log Table & Dashboard */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="grid-col-lg-8">
          
          {/* Dashboard statistics summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }} className="no-print">
            
            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.7)' }}>
              <BookOpen size={24} color="var(--primary-color)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Logged Incidents</span>
                <strong style={{ fontSize: '1.3rem' }}>{incidents.length}</strong>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239,68,68,0.1)' }}>
              <AlertOctagon size={24} color="#ef4444" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Critical Hazards</span>
                <strong style={{ fontSize: '1.3rem', color: '#ef4444' }}>{getCriticalCount()}</strong>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(245, 158, 11, 0.03)', border: '1px solid rgba(245,158,11,0.1)' }}>
              <AlertTriangle size={24} color="#f59e0b" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Medium Risks</span>
                <strong style={{ fontSize: '1.3rem', color: '#f59e0b' }}>{getMediumCount()}</strong>
              </div>
            </div>

          </div>

          {/* Active Log Grid/Table */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Behavior Log: {childName}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  Reporter: {parentName} | Date: {new Date(logDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div className="no-print">
                <PrintButton label="Print Safety Log" />
              </div>
            </div>

            {/* Incident Rows */}
            {incidents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                <Clock size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p>No safety incidents logged. Add entries using the sidebar form.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {incidents.map((inc) => (
                  <div 
                    key={inc.id}
                    style={{
                      background: 'rgba(255,255,255,0.65)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                    className="incident-row-item"
                  >
                    <div style={{
                      height: '32px',
                      width: '32px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      <Clock size={14} color="var(--text-light)" />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{inc.time} - {inc.category}</strong>
                          <span style={{ 
                            marginLeft: '0.5rem',
                            display: 'inline-block',
                            background: `${getRiskColor(inc.riskLevel)}15`,
                            color: getRiskColor(inc.riskLevel),
                            border: `1px solid ${getRiskColor(inc.riskLevel)}30`,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            textTransform: 'uppercase'
                          }}>
                            {inc.riskLevel}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteIncident(inc.id)}
                          className="no-print"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '0.2rem',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            opacity: 0.7,
                            transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                          title="Delete incident"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                        <p style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)' }}>
                          <strong>Safety Hazard Detail:</strong> {inc.details}
                        </p>
                        <p style={{ margin: 0, color: 'var(--text-light)' }}>
                          <strong>Caregiver Intervention:</strong> <span style={{ color: 'var(--primary-color)', fontWeight: 500 }}>{inc.intervention}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Standard CDSS header declaration (visible only during print) */}
            <div 
              style={{ display: 'none', marginTop: '2rem', borderTop: '2px solid #000', paddingTop: '1rem', fontSize: '0.8rem' }}
              className="print-expand"
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <span><strong>Child Recipient:</strong> {childName}</span>
                <span><strong>Parent Caregiver:</strong> {parentName}</span>
                <span><strong>Date Verified:</strong> {logDate}</span>
                <span><strong>Signature:</strong> ___________________________</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1rem', fontStyle: 'italic', margin: 0 }}>
                This safety log declares physical hazard occurrences and redirection times observed within a 24-hour window. Retain as support documentation for CDSS SOC 825 protective reviews.
              </p>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
