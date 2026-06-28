import React, { useState } from 'react';
import { initialVerificationQueue, coverageGaps } from '../data/seedData';
import { 
  ShieldCheck, AlertTriangle, RefreshCw, Layers, 
  MapPin, CheckCircle, Trash2, Heart, PlusCircle, Bookmark 
} from 'lucide-react';

export default function AdminDashboard() {
  const [queue, setQueue] = useState(initialVerificationQueue);
  const [gaps, setGaps] = useState(coverageGaps);
  const [userSubmissions, setUserSubmissions] = useState([
    { id: 'sub-1', providerName: 'Empowerment Respite Agency LLC', category: 'respite', countyId: 'los-angeles', phone: 'Pending review', website: 'https://empowerrespite.com', submittedAt: '2026-05-28', status: 'pending' },
    { id: 'sub-2', providerName: 'Golden Gate Autism Advocates', category: 'advocacy', countyId: 'san-francisco', phone: 'Pending review', website: 'https://ggautismadvocates.org', submittedAt: '2026-05-30', status: 'pending' }
  ]);

  // Dynamic calculations
  const totalVerifiedCount = 28;
  const staleCount = queue.length;
  
  // Interactive Verification Auditor
  const handleVerify = (id) => {
    setQueue(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          verificationLevel: 1, // Elevate to Level 1: Official Source Verified
          reason: 'Verified and audited today! Freshness indicator restored.',
          lastVerifiedDate: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
    alert('Database record verified! Confidence score elevated to Level 1 (High Trust). Freshness date updated.');
  };

  // Remove / Archive record
  const handleArchive = (id) => {
    setQueue(queue.filter(item => item.id !== id));
    alert('Record moved from audit queue to archive logs.');
  };

  // Approve User-Submitted Resource
  const handleApproveSubmission = (id) => {
    setUserSubmissions(userSubmissions.map(sub => sub.id === id ? { ...sub, status: 'approved' } : sub));
    alert('User-submitted resource approved! This provider will be added to the live directory.');
  };

  // Reject Submission
  const handleRejectSubmission = (id) => {
    setUserSubmissions(userSubmissions.filter(sub => sub.id !== id));
    alert('Resource suggestion rejected and logged.');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0' }}>
      
      {/* Head */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>
          Database <span className="gradient-text">Verification & Integrity Portal</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Audit freshness dates, claim user-submitted clinics, review county gaps, and manage Level 1–6 trust verification pipelines.
        </p>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid-cols-3" style={{ marginBottom: '36px' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(139,92,246,0.03)' }}>
          <div style={{ background: 'rgba(139,92,246,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--accent-purple)' }}>
            <Layers size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coverage Integrity</span>
            <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', marginTop: '4px' }}>94.2% Health</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(20,184,166,0.03)' }}>
          <div style={{ background: 'rgba(20,184,166,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--accent-teal)' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Mapped Entities</span>
            <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', marginTop: '4px' }}>26 / 26 Schema</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(244,63,94,0.03)' }}>
          <div style={{ background: 'rgba(244,63,94,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--accent-coral)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Records Needing Audit</span>
            <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', marginTop: '4px' }}>{staleCount} Pending</h3>
          </div>
        </div>
      </div>

      {/* Grid: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }} className="admin-grid-layout">
        
        {/* Left Side: Verification queue */}
        <div>
          <div className="glass-panel" style={{ padding: '24px', height: '100%' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={18} style={{ color: 'var(--accent-purple)' }} /> Active Verification & Freshness Queue
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {queue.map(item => (
                <div key={item.id} style={{
                  background: 'rgba(15,23,42,0.3)',
                  border: '1px solid var(--glass-border)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <span className="badge badge-purple" style={{ fontSize: '9px' }}>{item.recordType}</span>
                      <span className={`badge ${item.verificationLevel >= 5 ? 'badge-coral' : 'badge-teal'}`} style={{ fontSize: '9px' }}>
                        Level {item.verificationLevel}: {item.verificationLevel >= 5 ? 'Stale / Audit Required' : 'Verified'}
                      </span>
                    </div>
                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{item.recordName}</strong>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                      Reason: {item.reason}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }} className="admin-actions-col">
                    <button 
                      onClick={() => handleVerify(item.id)} 
                      className="btn btn-teal" 
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                    >
                      Audit OK
                    </button>
                    <button 
                      onClick={() => handleArchive(item.id)} 
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {queue.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  All database records are fresh and fully audited. Excellent!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: User Submissions & Gaps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* User Submitted resources */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={18} style={{ color: 'var(--accent-teal)' }} /> User Suggestions Inbox
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {userSubmissions.map(sub => (
                <div key={sub.id} style={{
                  background: sub.status === 'approved' ? 'rgba(16,185,129,0.05)' : 'rgba(15,23,42,0.25)',
                  border: '1px solid',
                  borderColor: sub.status === 'approved' ? '#10b981' : 'var(--glass-border)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>Category: {sub.category}</span>
                    <span>County: {sub.countyId}</span>
                  </div>
                  <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block' }}>{sub.providerName}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                    Tel: {sub.phone} | <a href={sub.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-teal)' }}>Website</a>
                  </span>

                  {sub.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button 
                        onClick={() => handleApproveSubmission(sub.id)} 
                        className="btn btn-teal" 
                        style={{ padding: '4px 10px', fontSize: '10px', width: '50%' }}
                      >
                        Approve Live
                      </button>
                      <button 
                        onClick={() => handleRejectSubmission(sub.id)} 
                        style={{ background: 'none', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '4px 10px', fontSize: '10px', borderRadius: '4px', cursor: 'pointer', width: '50%' }}
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981', fontWeight: 600, marginTop: '8px' }}>
                      <CheckCircle size={12} /> Live in directory database
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Coverage Gaps alerts */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} style={{ color: 'var(--accent-coral)' }} /> Known Coverage Gaps
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {gaps.map(gap => (
                <div key={gap.id} style={{
                  background: 'rgba(244,63,94,0.03)',
                  border: '1px solid rgba(244,63,94,0.12)',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <span>{gap.gapCategory}</span>
                    <span style={{ color: 'var(--accent-coral)', textTransform: 'uppercase', fontSize: '10px' }}>{gap.severity} severity</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                    {gap.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 900px) {
          .admin-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .admin-actions-col {
            flex-direction: column !important;
          }
        }
      `}} />
    </div>
  );
}
