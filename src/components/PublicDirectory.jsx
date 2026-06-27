import React, { useState } from 'react';
import { programs, counties, conditions, functionalNeeds, guides, resourceProviders } from '../data/seedData';
import { Search, MapPin, Activity, ShieldCheck, Compass, HelpCircle, FileText, ArrowRight, Bookmark, AlertTriangle, Sparkles } from 'lucide-react';

export default function PublicDirectory({ setCurrentTab, setSelectedCountyId }) {
  const [activeCatalog, setActiveCatalog] = useState('programs'); // 'programs' | 'counties' | 'conditions' | 'needs' | 'guides'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null); // { type, id } e.g., { type: 'program', id: 'ihss-for-children' }

  const handleRecordClick = (type, id) => {
    setSelectedRecord({ type, id });
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedRecord(null);
  };

  const getRecordData = () => {
    if (!selectedRecord) return null;
    const { type, id } = selectedRecord;
    if (type === 'program') return programs.find(p => p.id === id);
    if (type === 'county') return counties.find(c => c.id === id);
    if (type === 'condition') return conditions.find(c => c.id === id);
    if (type === 'need') return functionalNeeds.find(n => n.id === id);
    if (type === 'guide') return guides.find(g => g.id === id);
    return null;
  };

  // Filter lists based on search query
  const getFilteredItems = (type) => {
    const q = searchQuery.toLowerCase();
    if (type === 'programs') return programs.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    if (type === 'counties') return counties.filter(c => c.name.toLowerCase().includes(q));
    if (type === 'conditions') return conditions.filter(c => c.name.toLowerCase().includes(q) || c.aliases.some(a => a.toLowerCase().includes(q)));
    if (type === 'needs') return functionalNeeds.filter(n => n.name.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));
    if (type === 'guides') return guides.filter(g => g.title.toLowerCase().includes(q) || g.summary.toLowerCase().includes(q));
    return [];
  };

  const activeItems = getFilteredItems(activeCatalog);
  const detailData = getRecordData();

  // Helper for rendering badges
  const getConfidenceText = (score) => {
    if (score >= 5) return 'Level 1: Source-backed record';
    if (score >= 4) return 'Level 2: Organization-backed record';
    return 'Level 3: Partner-backed record';
  };

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0' }}>
      
      {/* Detail Page Render */}
      {selectedRecord && detailData ? (
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          
          {/* Back Navigation & Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <button className="btn btn-secondary" onClick={handleBack} style={{ padding: '8px 16px', fontSize: '13px' }}>
              ← Back to Catalog
            </button>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              SEO URL: <code style={{ color: 'var(--accent-teal)', background: 'rgba(20,184,166,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                /ca/{selectedRecord.type === 'program' ? 'programs' : selectedRecord.type === 'county' ? 'counties' : selectedRecord.type === 'condition' ? 'conditions' : selectedRecord.type === 'need' ? 'needs' : 'guides'}/{selectedRecord.id}
              </code>
            </div>
          </div>

          {/* Render: Program Detail */}
          {selectedRecord.type === 'program' && (
            <div className="glass-panel" style={{ padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <span className="badge badge-purple">{detailData.category || 'California State Program'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--accent-teal)' }} />
                  {getConfidenceText(detailData.confidenceScore)}
                </div>
              </div>

              <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>{detailData.name}</h2>
              <p style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '24px', lineHeight: 1.6 }}>{detailData.description}</p>

              <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '30px 0' }} />

              <div className="grid-cols-2" style={{ gap: '40px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', color: 'var(--accent-purple)', marginBottom: '12px' }}>Who is it for?</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{detailData.whoItIsFor}</p>

                  <h3 style={{ fontSize: '18px', color: 'var(--accent-purple)', marginBottom: '12px' }}>Eligibility Criteria</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{detailData.whoMightQualify}</p>

                  <h3 style={{ fontSize: '18px', color: 'var(--accent-purple)', marginBottom: '12px' }}>Related Programs</h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {detailData.relatedProgramIds?.map(rid => (
                      <button
                        key={rid}
                        onClick={() => handleRecordClick('program', rid)}
                        className="badge badge-blue"
                        style={{ cursor: 'pointer', border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.1)' }}
                      >
                        {programs.find(p => p.id === rid)?.name || rid}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '18px', color: 'var(--accent-teal)', marginBottom: '12px' }}>Required Documents</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
                    {detailData.requiredDocuments.map((doc, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        <span style={{ color: 'var(--accent-teal)', fontWeight: 800 }}>✓</span>
                        {doc}
                      </li>
                    ))}
                  </ul>

                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '8px' }}>Official Reference Information</h4>
                    <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div><strong>Source URL:</strong> <a href={detailData.officialSourceUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-teal)' }}>{detailData.officialSourceUrl}</a></div>
                      <div><strong>Last Verified:</strong> {detailData.lastVerifiedDate}</div>
                      <div><strong>Trust note:</strong> Source-backed demo record. Confirm current eligibility, forms, and contact details before relying on them.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps Timeline */}
              <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', marginTop: '40px', marginBottom: '20px' }}>Application Procedure</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {detailData.applicationSteps.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', background: 'rgba(15,23,42,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--accent-purple)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: 'white',
                      flexShrink: 0
                    }}>
                      {step.step || (idx + 1)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>{step.title}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Appeal Section */}
              {detailData.appealInfo && (
                <div style={{
                  marginTop: '40px',
                  background: 'rgba(244,63,94,0.04)',
                  border: '1px solid rgba(244,63,94,0.15)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-coral)', marginBottom: '12px' }}>
                    <AlertTriangle size={20} />
                    <h3 style={{ fontSize: '18px', margin: 0 }}>Appeal Process: What if you are denied?</h3>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div><strong>Deadline to File Appeal:</strong> {detailData.appealInfo.deadlineDays}</div>
                    <div><strong>Common Denial Reasons:</strong> {detailData.appealInfo.denialReasons}</div>
                    <div style={{ whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                      {detailData.appealInfo.appealSteps}
                    </div>
                    <div><strong>Appeal Form:</strong> <a href={detailData.appealInfo.officialAppealSourceUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-coral)', fontWeight: 600 }}>{detailData.appealInfo.appealFormName} Download</a></div>
                  </div>
                </div>
              )}

              {/* Action Banner */}
              <div style={{
                background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(99,102,241,0.1) 100%)',
                border: '1px solid var(--accent-purple)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                textAlign: 'center',
                marginTop: '48px'
              }}>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Check whether {detailData.name} may fit your child&apos;s situation</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                  Run a custom matching scan to see what exact files, rules, and local contacts apply based on their functional profile.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  <button className="btn btn-teal" onClick={() => setCurrentTab('screener')}>
                    Check What Your Child is Missing <ArrowRight size={16} />
                  </button>
                  <button className="btn btn-secondary" onClick={() => setCurrentTab('screener')}>
                    Create Free Account to Save Plan
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Render: County Detail */}
          {selectedRecord.type === 'county' && (
            <div className="glass-panel" style={{ padding: '40px' }}>
              <span className="badge badge-teal" style={{ marginBottom: '16px' }}>Local Routing Map</span>
              <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>{detailData.name} County Office Directory</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                Complete benefits coordination offices and local family resource clinics serving {detailData.name} County residents.
              </p>

              <div className="grid-cols-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                    <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '12px' }}>In-Home Supportive Services (IHSS)</h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <div><strong>Office Name:</strong> {detailData.ihssOffice}</div>
                      <div style={{ marginTop: '4px' }}><strong>Contact Info:</strong> {detailData.ihssContact}</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                    <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '12px' }}>Medi-Cal / BenefitsCal Office</h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <div><strong>Office Name:</strong> {detailData.mediCalOffice}</div>
                      <div style={{ marginTop: '4px' }}><strong>Contact Info:</strong> {detailData.mediCalContact}</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                    <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '12px' }}>California Children's Services (CCS)</h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <div><strong>Office Name:</strong> {detailData.ccsOffice}</div>
                      <div style={{ marginTop: '4px' }}><strong>Contact Info:</strong> {detailData.ccsContact}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                    <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '12px' }}>County Behavioral Health</h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <div><strong>24/7 Access Line:</strong> {detailData.behavioralHealthLine}</div>
                      <div style={{ marginTop: '4px' }}><strong>Health Department:</strong> {detailData.publicHealthDept}</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                    <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '12px' }}>Special Education & School District</h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <div><strong>County Education Office:</strong> {detailData.officeOfEducation}</div>
                      <div style={{ marginTop: '4px' }}><strong>Local School Districts:</strong></div>
                      {detailData.schoolDistricts?.map((sd, i) => (
                        <div key={i} style={{ marginTop: '4px', background: 'rgba(0,0,0,0.15)', padding: '8px', borderRadius: '4px' }}>
                          <div><strong>{sd.name}</strong></div>
                          <div>Phone: {sd.specEdPhone} | Web: <a href={sd.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-teal)' }}>Link</a></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                    <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '12px' }}>Local FRC & Nonprofits</h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <div><strong>Primary Family Resource Center:</strong> {detailData.familyResourceCenter}</div>
                      {detailData.localOrganizations?.map((org, i) => (
                        <div key={i} style={{ marginTop: '4px' }}>• <a href={org.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-purple)' }}>{org.name}</a></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Render: Condition Detail */}
          {selectedRecord.type === 'condition' && (
            <div className="glass-panel" style={{ padding: '40px' }}>
              <span className="badge badge-purple" style={{ marginBottom: '16px' }}>Diagnostic Resource Taxonomy</span>
              <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>{detailData.name}</h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {detailData.aliases?.map((a, i) => (
                  <span key={i} className="badge badge-secondary" style={{ fontSize: '11px' }}>Alias: {a}</span>
                ))}
              </div>
              
              <p style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '24px', lineHeight: 1.6 }}>{detailData.parentFriendlyExplanation}</p>

              <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '30px 0' }} />

              <div className="grid-cols-2">
                <div>
                  <h3 style={{ fontSize: '18px', color: 'var(--accent-purple)', marginBottom: '12px' }}>Official System Eligibility Mappings</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                      <span>Regional Center developmental category:</span>
                      <strong style={{ color: detailData.categoryMappings.regionalCenterRelevance ? 'var(--accent-teal)' : 'var(--text-muted)' }}>
                        {detailData.categoryMappings.regionalCenterRelevance ? 'Yes (developmental)' : 'No (unless paired)'}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                      <span>School District Special Ed category:</span>
                      <strong style={{ color: detailData.categoryMappings.iepRelevance ? 'var(--accent-teal)' : 'var(--text-muted)' }}>
                        {detailData.categoryMappings.iepRelevance ? 'Yes (may support eligibility)' : 'No'}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                      <span>California Children\'s Services (CCS):</span>
                      <strong style={{ color: detailData.categoryMappings.ccsRelevance ? 'var(--accent-teal)' : 'var(--text-muted)' }}>
                        {detailData.categoryMappings.ccsRelevance ? 'Yes (medically eligible)' : 'No (unless complex/physical)'}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                      <span>SSI Childhood disability listing:</span>
                      <strong style={{ color: detailData.categoryMappings.ssiRelevance ? 'var(--accent-teal)' : 'var(--text-muted)' }}>
                        {detailData.categoryMappings.ssiRelevance ? 'Yes (listing match)' : 'Requires functional test'}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                      <span>CalABLE savings qualification:</span>
                      <strong style={{ color: detailData.categoryMappings.calAbleRelevance ? 'var(--accent-teal)' : 'var(--text-muted)' }}>
                        {detailData.categoryMappings.calAbleRelevance ? 'Yes (onset before 26)' : 'No'}
                      </strong>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '18px', color: 'var(--accent-purple)', marginTop: '24px', marginBottom: '12px' }}>Common Functional Needs</h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {detailData.commonFunctionalNeeds?.map(nid => (
                      <button
                        key={nid}
                        onClick={() => handleRecordClick('need', nid)}
                        className="badge badge-teal"
                        style={{ cursor: 'pointer' }}
                      >
                        {functionalNeeds.find(f => f.id === nid)?.name || nid}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '18px', color: 'var(--accent-teal)', marginBottom: '12px' }}>Recommended Program Pathways</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {detailData.commonProgramIds?.map(pid => {
                      const prog = programs.find(p => p.id === pid);
                      return (
                        <div
                          key={pid}
                          onClick={() => handleRecordClick('program', pid)}
                          style={{
                            padding: '12px 16px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontSize: '13px',
                            transition: 'var(--transition-fast)'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
                          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                        >
                          <strong>{prog?.name || pid}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                            {prog?.description.slice(0, 80)}...
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <h3 style={{ fontSize: '18px', color: 'var(--accent-teal)', marginTop: '24px', marginBottom: '12px' }}>Milestones & Age Triggers</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '6px', border: '1px solid var(--glass-border)', lineHeight: 1.5 }}>
                    {detailData.ageSpecificNotes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Render: Need Detail */}
          {selectedRecord.type === 'need' && (
            <div className="glass-panel" style={{ padding: '40px' }}>
              <span className="badge badge-teal" style={{ marginBottom: '16px' }}>Functional Need Guide</span>
              <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>{detailData.name}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>{detailData.description}</p>

              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>Programs Commonly Triggered by this Need</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {detailData.programTriggers?.map(pid => {
                  const prog = programs.find(p => p.id === pid);
                  return (
                    <div
                      key={pid}
                      onClick={() => handleRecordClick('program', pid)}
                      className="glass-panel"
                      style={{ padding: '20px', cursor: 'pointer', borderColor: 'rgba(20,184,166,0.2)' }}
                    >
                      <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '6px' }}>{prog?.name || pid}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{prog?.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Render: Guide Detail */}
          {selectedRecord.type === 'guide' && (
            <div className="glass-panel" style={{ padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-teal)', marginBottom: '12px', fontSize: '12px', fontWeight: 600 }}>
                <FileText size={16} />
                How-To Parent Guide • Verified {detailData.lastVerifiedDate}
              </div>
              <h2 style={{ fontSize: '30px', marginBottom: '20px', lineHeight: 1.25 }}>{detailData.title}</h2>
              <p style={{ fontStyle: 'italic', fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '30px', borderLeft: '3px solid var(--accent-purple)', paddingLeft: '16px' }}>
                {detailData.summary}
              </p>
              
              {/* Main Markdown Simulated content */}
              <div style={{
                fontSize: '15px',
                lineHeight: 1.7,
                color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap'
              }}>
                {detailData.content}
              </div>

              {/* Source citations */}
              <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '40px 0' }} />
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <strong>Source Reference:</strong> <a href={detailData.officialSource} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-teal)' }}>{detailData.officialSource}</a>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Grid Catalog Page */
        <div>
          {/* SEO Heading & Hero */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '38px', marginBottom: '12px' }}>
              California Disability <span className="gradient-text">Benefits Directory</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '640px', margin: '0 auto' }}>
              Search and browse source-backed California program records, local office contacts, educational rights, and developmental guidance.
            </p>
          </div>

          {/* Search Bar & Tabs */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '36px'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto', width: '100%' }}>
              <input
                type="text"
                placeholder="Search programs, diagnoses (e.g. Down Syndrome), functional needs, or county guides..."
                className="form-input"
                style={{ paddingLeft: '48px', fontSize: '16px', borderRadius: '9999px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
            </div>

            {/* Tab Selectors */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              borderBottom: '1px solid var(--glass-border)',
              paddingBottom: '12px'
            }}>
              {[
                { id: 'programs', label: 'Statewide Programs', icon: Compass },
                { id: 'counties', label: 'County Mappings', icon: MapPin },
                { id: 'conditions', label: 'Conditions Taxonomy', icon: Activity },
                { id: 'needs', label: 'Functional Needs', icon: HelpCircle },
                { id: 'guides', label: 'How-to Guides', icon: FileText }
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeCatalog === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveCatalog(tab.id);
                      setSearchQuery('');
                    }}
                    style={{
                      background: active ? 'var(--accent-purple)' : 'none',
                      border: 'none',
                      borderRadius: '20px',
                      color: active ? 'white' : 'var(--text-secondary)',
                      padding: '8px 18px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Render */}
          <div className="grid-cols-3">
            {activeItems.length > 0 ? (
              activeItems.map(item => (
                <div
                  key={item.id}
                  className="glass-panel animate-fade-in"
                  onClick={() => handleRecordClick(
                    activeCatalog === 'programs' ? 'program' :
                    activeCatalog === 'counties' ? 'county' :
                    activeCatalog === 'conditions' ? 'condition' :
                    activeCatalog === 'needs' ? 'need' : 'guide',
                    item.id
                  )}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '200px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span className="badge badge-teal" style={{ fontSize: '10px' }}>
                        {activeCatalog === 'programs' && 'Benefit Program'}
                        {activeCatalog === 'counties' && 'Local Routing'}
                        {activeCatalog === 'conditions' && 'Taxonomy'}
                        {activeCatalog === 'needs' && 'Functional'}
                        {activeCatalog === 'guides' && 'Resource Guide'}
                      </span>
                      {activeCatalog === 'programs' && (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ver. 2026</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '17px', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>
                      {item.name || item.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {item.description || item.summary || `Click to view local office routing directory and state-wide maps for ${item.name}.`}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--accent-purple)',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginTop: '16px'
                  }}>
                    View detailed resource page →
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                No records matched your search query. Try entering a different keyword.
              </div>
            )}
          </div>

          {/* Quick Guide Card Carousel Trigger */}
          <div style={{ marginTop: '56px', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--glass-border)', padding: '24px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>Not sure what matches your family profile?</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Our rules-based evaluation matching engine does the heavy lifting instantly.</p>
            <button className="btn btn-teal" onClick={() => setCurrentTab('screener')}>
              Scan Milestones Milestones <Sparkles size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
