'use client';

import React, { useState, useEffect } from 'react';
import { useChildProfile } from './ChildProfileContext';
import { saveChildWaiverAction, deleteChildWaiverAction } from '../child-actions';
import type { ChildWaiver } from '@/lib/db';
import { 
  Layers, Upload, ImagePlus, Check, Folder, FileText, Trash2
} from 'lucide-react';

export default function WaiverVaultPanel() {
  const { 
    currentChild, 
    savedWaivers, 
    setActiveTab, 
    parentName,
    setParentName, 
    setChildName,
    stateConfig
  } = useChildProfile();

  const [waiverList, setWaiverList] = useState<ChildWaiver[]>(savedWaivers);
  const [uploadingWaiver, setUploadingWaiver] = useState(false);
  const [ocrPreview, setOcrPreview] = useState<boolean | null>(null);
  const [waiverType, setWaiverType] = useState('hcbs-dd-waiver');
  const [waiverName, setWaiverName] = useState('');
  const [waiverEffectiveDate, setWaiverEffectiveDate] = useState('');
  const [waiverExpirationDate, setWaiverExpirationDate] = useState('');
  const [waiverHours, setWaiverHours] = useState<number>(16);
  const [customOcrText, setCustomOcrText] = useState('');

  // Sync state when child changes
  useEffect(() => {
    Promise.resolve().then(() => {
      setWaiverList(savedWaivers || []);
      setOcrPreview(null);
    });
  }, [currentChild, savedWaivers]);

  if (!currentChild) return null;

  const handleSaveWaiver = async () => {
    const newWaiver: ChildWaiver = {
      id: 'waiver-' + Date.now(),
      child_id: currentChild.id,
      waiver_type: waiverType,
      document_name: waiverName || (currentChild.nickname + ' Waiver'),
      file_path: '/uploads/' + waiverType + '.png',
      effective_date: waiverEffectiveDate,
      expiration_date: waiverExpirationDate,
      authorized_hours: waiverHours,
      parsed_content: customOcrText,
      created_at: new Date().toISOString()
    };

    const res = await saveChildWaiverAction(newWaiver);
    if (res.success) {
      setWaiverList(prev => [newWaiver, ...prev]);
      setOcrPreview(null);
      setWaiverName('');
      setWaiverEffectiveDate('');
      setWaiverExpirationDate('');
      setWaiverHours(16);
      setCustomOcrText('');
      alert('Waiver saved successfully to the Vault!');
    } else {
      alert(res.error || 'Failed to save waiver.');
    }
  };

  const handleDeleteWaiver = async (id: string) => {
    if (confirm('Are you sure you want to delete this waiver document?')) {
      const res = await deleteChildWaiverAction(id);
      if (res.success) {
        setWaiverList(prev => prev.filter(w => w.id !== id));
      } else {
        alert(res.error || 'Failed to delete waiver.');
      }
    }
  };

  const handleSimulateOcr = () => {
    setUploadingWaiver(true);
    const isTx = stateConfig?.code === 'TX';
    const isFl = stateConfig?.code === 'FL';
    const isCa = stateConfig?.code === 'CA';
    const stateName = stateConfig?.name || 'California';
    const catchment = stateConfig?.catchmentName || 'Regional Center';
    const waiverProg = stateConfig?.waiverProgram || 'HCBS DD Waiver';
    const medicaid = stateConfig?.medicaidName || 'Medi-Cal';
    const ddAgencyName = stateConfig?.ddAgency || 'Department of Developmental Services';

    setTimeout(() => {
      setUploadingWaiver(false);
      if (waiverType === 'hcbs-dd-waiver') {
        setWaiverName(`${currentChild.nickname} - ${waiverProg} Authorization`);
        setWaiverEffectiveDate("2026-06-01"); // QA-ALLOW
        setWaiverExpirationDate("2027-05-31");
        setWaiverHours(32);
        setCustomOcrText(`State of ${stateName} - ${ddAgencyName}\nHOME AND COMMUNITY-BASED SERVICES WAIVER PROGRAM\nIndividual Support Plan Authorization Record\nClient Nickname: ${currentChild.nickname}\nStatus: Active / Certified\nAuthorized Respite Hours: 32 Hours per Month\nApproval Authority: ${catchment}\nAuthorized Period: 06/01/2026 to 05/31/2027`);
      } else if (waiverType === 'institutional-deeming') {
        setWaiverName(`${currentChild.nickname} - ${medicaid} Institutional Deeming Waiver`);
        setWaiverEffectiveDate("2026-03-15");
        setWaiverExpirationDate("2027-03-14");
        setWaiverHours(0);
        setCustomOcrText(`State Medicaid Agency - ${stateName}\nHOME AND COMMUNITY-BASED SERVICES WAIVER\nINSTITUTIONAL DEEMING ELIGIBILITY WORK SHEET\nClient Name: ${currentChild.nickname}\nEligible Status: Waiver Group B Certification / Deeming Eligibility\nParental Income Deeming: EXEMPT (Deemed eligible based on child's disability status)\nValidity: 03/15/2026 - 03/14/2027`);
      } else if (waiverType === 'ccs-authorization') {
        const progName = isCa ? 'California Children\'s Services (CCS)' : isTx ? 'Texas STAR Kids Pediatric Program' : isFl ? 'Florida Children\'s Medical Services (CMS)' : 'State Children\'s Services';
        setWaiverName(`${currentChild.nickname} - ${progName} Authorization`);
        setWaiverEffectiveDate("2026-04-01");
        setWaiverExpirationDate("2026-09-30");
        setWaiverHours(48);
        setCustomOcrText(`${progName} Program\nSERVICE AUTHORIZATION REQUEST DECISION NOTICE\nRecipient Name: ${currentChild.nickname}\nAuthorized Services: Occupational Therapy (12 sessions), Physical Therapy (36 hours)\nAuthorized Dates: 04/01/2026 to 09/30/2026`);
      } else {
        setWaiverName(`${currentChild.nickname} - Public Benefit Waiver Document`);
        setWaiverEffectiveDate("2026-01-01");
        setWaiverExpirationDate("2026-12-31");
        setWaiverHours(0);
        setCustomOcrText(`Disability Advocacy Services of ${stateName}\nRECORD OF DISABILITY CERTIFICATION / ACCOMMODATION PLAN\nName: ${currentChild.nickname}\nAuthorized Benefits: State Respite Care Allowance\nPeriod: Calendar Year 2026`);
      }
      setOcrPreview(true);
    }, 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={24} color="var(--primary-color)" />
            Waiver Vault & Renewal Center
          </h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Digitize and manage your child&apos;s waiver certifications. Use image-to-text OCR to extract active dates, hours, and auto-generate renewal packets.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Section 1: OCR Uploader */}
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
            <Upload size={18} color="var(--primary-color)" />
            Upload & Scan Document
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Select Waiver Category</label>
            <select 
              value={waiverType}
              onChange={(e) => setWaiverType(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff' }}
            >
              <option value="hcbs-dd-waiver">{stateConfig?.waiverProgram || 'HCBS DD Waiver'} ({stateConfig?.catchmentName || 'Regional Center'})</option>
              <option value="institutional-deeming">{stateConfig?.medicaidName || 'Medi-Cal'} Institutional Deeming Waiver</option>
              <option value="ccs-authorization">{stateConfig?.code === 'CA' ? 'CCS Service Authorization Request (SAR)' : stateConfig?.code === 'TX' ? 'STAR Kids Service Authorization' : stateConfig?.code === 'FL' ? 'CMS Plan Service Authorization' : 'Children\'s Services Service Authorization'}</option>
              <option value="other">Other Public Benefit / Authorization Document</option>
            </select>
          </div>

          {/* Drag and Drop Simulator Area */}
          <div 
            onClick={handleSimulateOcr}
            style={{ 
              border: '2px dashed rgba(var(--primary-rgb), 0.3)', 
              borderRadius: '12px', 
              padding: '2.5rem 1.5rem', 
              textAlign: 'center', 
              background: uploadingWaiver ? 'rgba(var(--primary-rgb), 0.04)' : 'rgba(var(--primary-rgb), 0.01)', 
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem'
            }}
          >
            {uploadingWaiver ? (
              <>
                <div style={{ width: '2.5rem', height: '2.5rem', border: '3px solid rgba(var(--primary-rgb), 0.2)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>Running OCR Engine...</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>Reading digital fields & analyzing key metadata fields...</p>
                </div>
              </>
            ) : (
              <>
                <ImagePlus size={32} color="var(--primary-color)" />
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Click to Drop Waiver Photo or PDF</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>Supports JPG, PNG, or PDF formats. Max 10MB.</p>
                </div>
                <span style={{ fontSize: '0.72rem', background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>Simulate Auto-OCR Scan</span>
              </>
            )}
          </div>

          {/* OCR Results Confirmation Box */}
          {ocrPreview && (
            <div className="animate-fade-in" style={{ background: 'rgba(var(--primary-rgb), 0.02)', border: '1px solid rgba(var(--primary-rgb), 0.1)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'green', fontSize: '0.85rem', fontWeight: 600 }}>
                <Check size={16} /> Scan Successful! Verify Parsed Fields
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.2rem' }}>Document Name</label>
                  <input 
                    type="text" 
                    value={waiverName} 
                    onChange={(e) => setWaiverName(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.2rem' }}>Effective Date</label>
                    <input 
                      type="date" 
                      value={waiverEffectiveDate} 
                      onChange={(e) => setWaiverEffectiveDate(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.2rem' }}>Expiration Date</label>
                    <input 
                      type="date" 
                      value={waiverExpirationDate} 
                      onChange={(e) => setWaiverExpirationDate(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                    />
                  </div>
                </div>

                {waiverType !== 'institutional-deeming' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.2rem' }}>Authorized Care Hours (monthly)</label>
                    <input 
                      type="number" 
                      value={waiverHours} 
                      onChange={(e) => setWaiverHours(parseInt(e.target.value) || 0)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.2rem' }}>Raw OCR Extracted Content</label>
                  <textarea 
                    rows={4} 
                    value={customOcrText} 
                    onChange={(e) => setCustomOcrText(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.8rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button 
                  onClick={handleSaveWaiver}
                  className="btn-primary" 
                  style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                >
                  Save to Vault
                </button>
                <button 
                  onClick={() => setOcrPreview(null)}
                  className="btn-secondary" 
                  style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                >
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Vault Document Inventory */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
            <Folder size={18} color="var(--primary-color)" />
            Vault Inventory & Re-Application Center
          </h4>

          {waiverList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-light)' }}>
              <p style={{ fontSize: '0.95rem' }}>No waiver documents saved in the vault yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.4rem' }}>Upload or drop a document image above to start your digital archive.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {waiverList.map(waiver => {
                const isExpired = waiver.expiration_date ? new Date(waiver.expiration_date) < new Date() : false;
                const expNotice = waiver.expiration_date ? Math.ceil((new Date(waiver.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 365;

                return (
                  <div 
                    key={waiver.id}
                    style={{ 
                      border: '1px solid rgba(0,0,0,0.06)', 
                      borderRadius: '10px', 
                      padding: '1rem', 
                      background: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '8px', background: 'rgba(var(--primary-rgb), 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{waiver.document_name}</strong>
                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(var(--primary-rgb), 0.08)', color: 'var(--primary-color)', fontWeight: 600 }}>
                              {waiver.waiver_type === 'hcbs-dd-waiver' ? (stateConfig?.waiverProgram || 'HCBS DD Waiver') : 
                               waiver.waiver_type === 'institutional-deeming' ? 'Institutional Deeming' :
                               waiver.waiver_type === 'ccs-authorization' ? (stateConfig?.code === 'CA' ? 'CCS Auth' : stateConfig?.code === 'TX' ? 'STAR Kids' : stateConfig?.code === 'FL' ? 'CMS' : 'Children\'s Auth') : 'Benefit Document'}
                            </span>
                            {waiver.authorized_hours ? (
                              <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: '#eefcf5', color: '#10b981', fontWeight: 600 }}>
                                {waiver.authorized_hours} hrs/mo authorized
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleDeleteWaiver(waiver.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '0.2rem' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Expiration Timeline Status bar */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.5rem 0.75rem', 
                      background: isExpired ? '#fef2f2' : expNotice < 45 ? '#fffbeb' : '#f9fafb', 
                      borderRadius: '6px',
                      fontSize: '0.78rem' 
                    }}>
                      <span style={{ color: 'var(--text-light)' }}>
                        Validity: <strong>{waiver.effective_date || 'N/A'}</strong> to <strong>{waiver.expiration_date || 'N/A'}</strong>
                      </span>
                      {isExpired ? (
                        <span style={{ color: 'var(--danger-color)', fontWeight: 700 }}>Expired</span>
                      ) : expNotice < 45 ? (
                        <span style={{ color: '#d97706', fontWeight: 700 }}>Expires in {expNotice}d</span>
                      ) : (
                        <span style={{ color: '#10b981', fontWeight: 700 }}>Active</span>
                      )}
                    </div>

                    {/* Action Center: Generate Renewal or Appeal */}
                    <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.75rem' }}>
                      <button
                        onClick={() => {
                          alert(`RAW EXTRACTED OCR CONTENT:\n\n${waiver.parsed_content || 'No text extracted.'}`);
                        }}
                        className="btn-secondary"
                        style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        Review OCR Text
                      </button>
                      
                      <button
                        onClick={() => {
                          setActiveTab('county');
                          setParentName(parentName || 'Caregiver Parent');
                          setChildName(currentChild.nickname);
                        }}
                        className="btn-primary"
                        style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}
                      >
                        <FileText size={12} /> Find Advocate for Renewal
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Legal Disclaimer Footnote */}
          <div style={{ marginTop: '2rem', padding: '1.25rem', borderTop: '1px dashed rgba(0,0,0,0.08)', fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4 }}>
            <strong>Legal & Estimates Disclaimer:</strong> All estimated care hours, respite allocations, and eligibility statements are based on typical ${stateConfig?.name || 'state'} program parameters and are not guaranteed. Actual program eligibility, parental income deeming exemptions, and care hour authorizations are determined solely by county/state social workers (for ${stateConfig?.personalCareProgram || 'personal care'}), local agency caseworkers (for ${stateConfig?.waiverProgram || 'waiver'}/institutional deeming), and pediatric program administrators. This tool does not provide legal or medical advice.
          </div>
        </div>
      </div>
    </div>
  );
}
