'use client';

import { useState } from 'react';
import { saveChildAction } from './child-actions';
import type { County, TaxonomyCondition, FunctionalNeed, ChildProfile } from '@/lib/db';
import { X, Loader2, Sparkles } from 'lucide-react';
import { DIAGNOSES } from '@/lib/diagnoses';
import DiagnosisAutocomplete from '../components/diagnosis-autocomplete';

interface ChildEditorProps {
  counties: County[];
  conditions: TaxonomyCondition[];
  needs: FunctionalNeed[];
  initialChild?: ChildProfile;
  onClose: () => void;
}

export default function ChildEditor({ counties, needs, initialChild, onClose }: ChildEditorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(initialChild?.functionalNeedIds || []);
  const [diagnosis, setDiagnosis] = useState(initialChild?.conditionIds?.[0] || '');

  const applySmartNeedsMapping = (diagnosisVal: string) => {
    const lowerVal = diagnosisVal.toLowerCase();
    let autoChecked: string[] = [];

    if (lowerVal.includes('autism')) {
      autoChecked = ['protective-supervision', 'speech-therapy', 'respite-care', 'iep-evaluation'];
    } else if (lowerVal.includes('down syndrome') || lowerVal.includes('trisomy 21')) {
      autoChecked = ['speech-therapy', 'iep-evaluation', 'diapers-incontinence-supplies', 'respite-care'];
    } else if (lowerVal.includes('cerebral palsy')) {
      autoChecked = ['diapers-incontinence-supplies', 'iep-evaluation', 'respite-care'];
    } else if (lowerVal.includes('hearing') || lowerVal.includes('deaf')) {
      autoChecked = ['hearing-aids', 'speech-therapy', 'iep-evaluation'];
    } else if (lowerVal.includes('vision') || lowerVal.includes('blind') || lowerVal.includes('cvi')) {
      autoChecked = ['vision-services', 'iep-evaluation'];
    } else if (lowerVal.includes('adhd') || lowerVal.includes('attention deficit')) {
      autoChecked = ['iep-evaluation', 'protective-supervision'];
    } else if (lowerVal.includes('dyslexia') || lowerVal.includes('learning')) {
      autoChecked = ['iep-evaluation', 'speech-therapy'];
    }

    if (autoChecked.length > 0) {
      setSelectedNeeds(prev => {
        const combined = new Set([...prev, ...autoChecked]);
        return Array.from(combined);
      });
    }
  };

  const handleDiagnosisChange = (val: string) => {
    setDiagnosis(val);
    applySmartNeedsMapping(val);
  };

  const handleNeedToggle = (id: string) => {
    setSelectedNeeds(prev => 
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Read the typed/selected primary diagnosis and append to conditionIds
    const primaryDiagnosis = formData.get('primaryDiagnosis') as string;
    if (primaryDiagnosis) {
      formData.append('conditionIds', primaryDiagnosis);
    }
    
    // Append needs manually to FormData
    selectedNeeds.forEach(n => formData.append('functionalNeedIds', n));

    const result = await saveChildAction(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content animate-fade-in" style={{ maxWidth: '650px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles color="var(--primary-color)" size={20} />
            {initialChild ? 'Edit Child Profile' : 'Add Child Profile'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {initialChild && <input type="hidden" name="childId" value={initialChild.id} />}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label htmlFor="nickname">Nickname / First Name</label>
              <input 
                type="text" 
                id="nickname" 
                name="nickname" 
                defaultValue={initialChild?.nickname} 
                placeholder="e.g. Liam"
                required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="dob">Date of Birth</label>
              <input 
                type="date" 
                id="dob" 
                name="dob" 
                defaultValue={initialChild?.dob} 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label htmlFor="countyId">California County</label>
              <select id="countyId" name="countyId" defaultValue={initialChild?.county_id} required>
                <option value="">Select a county...</option>
                {counties.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="zipCode">Zip Code (Optional)</label>
              <input 
                type="text" 
                id="zipCode" 
                name="zipCode" 
                defaultValue={initialChild?.zip_code} 
                placeholder="e.g. 90025" 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label htmlFor="insuranceType">Insurance Status</label>
              <select id="insuranceType" name="insuranceType" defaultValue={initialChild?.insurance_type}>
                <option value="private">Private Commercial Insurance</option>
                <option value="medi-cal">Medi-Cal (State Medicaid)</option>
                <option value="both">Both (Medi-Cal Secondary)</option>
                <option value="none">No Insurance Coverage</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="schoolStatus">School / Education Status</label>
              <select id="schoolStatus" name="schoolStatus" defaultValue={initialChild?.school_status}>
                <option value="none">Not in School (e.g. Under 3)</option>
                <option value="preschool">Preschool / Early Start</option>
                <option value="iep">Active School IEP Plan</option>
                <option value="504">Active 504 Accommodations</option>
                <option value="private-school">Private / Home School</option>
              </select>
            </div>
          </div>

          {/* Conditions search datalist */}
          <div className="input-group">
            <label htmlFor="primaryDiagnosis">Primary Diagnosis</label>
            <DiagnosisAutocomplete
              id="primaryDiagnosis"
              name="primaryDiagnosis"
              value={diagnosis}
              onChange={handleDiagnosisChange}
              diagnosesList={DIAGNOSES}
              placeholder="Search diagnoses (e.g. Down Syndrome, Rett Syndrome, Epilepsy...)"
              required
            />
          </div>

          {/* Functional Needs checkboxes */}
          <div className="input-group">
            <label>Needed Therapies & Supports (Select all that apply)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              {needs.map(n => (
                <label key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 'normal' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedNeeds.includes(n.id)}
                    onChange={() => handleNeedToggle(n.id)}
                    style={{ width: 'auto' }}
                  />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem' }}>{n.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{n.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="caregiverNotes">Caregiver Observations & Notes</label>
            <textarea 
              id="caregiverNotes" 
              name="caregiverNotes" 
              defaultValue={initialChild?.caregiver_notes}
              placeholder="List specific behaviors, safety issues (e.g. elopement, wandering), or medical therapies..."
              style={{ width: '100%', minHeight: '100px', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn-primary" onClick={onClose} style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', width: 'auto' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? <Loader2 className="animate-spin" /> : null}
              {loading ? 'Saving Profile...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
