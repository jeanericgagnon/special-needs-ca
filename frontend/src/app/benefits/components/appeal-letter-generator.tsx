'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Copy, Check, Printer, AlertCircle } from 'lucide-react';

interface AppealLetterGeneratorProps {
  diagnosisName: string;
  schoolDistrictName: string;
}

export default function AppealLetterGenerator({ diagnosisName, schoolDistrictName }: AppealLetterGeneratorProps) {
  const [letterType, setLetterType] = useState<'initial-eval' | 'iee' | 'meeting'>('initial-eval');
  const [parentName, setParentName] = useState('[Parent Name]');
  const [parentAddress, setParentAddress] = useState('[Parent Address]');
  const [parentPhone, setParentPhone] = useState('[Parent Phone]');
  const [childName, setChildName] = useState('[Child Name]');
  const [childDob, setChildDob] = useState('[DOB]');
  const [letterText, setLetterText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      let content = '';

      if (letterType === 'initial-eval') {
        content = `${parentName}
${parentAddress}
${parentPhone}

Date: ${today}

To: Director of Special Education
${schoolDistrictName}
Special Education Department

RE: Request for Initial Special Education Evaluation / Section 504 & IEP
Child: ${childName} (DOB: ${childDob})
Diagnosis/Suspected Disability: ${diagnosisName}

Dear Director of Special Education,

I am writing to formally request a comprehensive educational evaluation to determine special education eligibility under the Individuals with Disabilities Education Act (IDEA) and Section 504 of the Rehabilitation Act. I suspect my child, ${childName}, has a disability related to ${diagnosisName} that significantly impacts their access to the educational environment and learning.

Under California Education Code § 56321, please note that the school district is required to provide me with an Assessment Plan within fifteen (15) calendar days from receipt of this written request. 

Please evaluate ${childName} in all areas of suspected disability, including but not limited to:
1. Psycho-educational evaluation (cognitive, learning profiles)
2. Speech and Language Development
3. Occupational Therapy (fine motor, sensory processing)
4. Social-Emotional and Behavioral functioning

I look forward to receiving the Assessment Plan within the statutory 15-day timeline so that evaluations can proceed. Once the Assessment Plan is signed, please compile the evaluations and convene the initial IEP meeting within the 60-day deadline as mandated under CA Education Code § 56344.

Thank you for your prompt attention to this matter.

Sincerely,

_______________________________
${parentName} (Parent/Caregiver Signature)`;
      } else if (letterType === 'iee') {
        content = `${parentName}
${parentAddress}
${parentPhone}

Date: ${today}

To: Director of Special Education
${schoolDistrictName}
Special Education Department

RE: Request for Independent Educational Evaluation (IEE) at Public Expense
Child: ${childName} (DOB: ${childDob})
Diagnosis/Suspected Disability: ${diagnosisName}

Dear Director of Special Education,

I am writing to formally disagree with the school district's recent special education evaluation(s) of my child, ${childName}, and to request an Independent Educational Evaluation (IEE) at public expense under 34 C.F.R. § 300.502 and California Education Code § 56329(b).

Specifically, I disagree with the district's findings in the following areas:
- [Specify evaluations e.g. Psycho-educational assessment / Speech & Language assessment]

Under CA Education Code § 56329 and federal regulations, the district must respond to this request without unnecessary delay by either:
1. Providing me with the agency guidelines and criteria for obtaining an IEE at public expense, or
2. Filing a Due Process Complaint to prove that its own evaluation is appropriate.

Please send me the district's IEE criteria and a list of qualified independent evaluators serving our area. I look forward to your prompt response.

Sincerely,

_______________________________
${parentName} (Parent/Caregiver Signature)`;
      } else if (letterType === 'meeting') {
        content = `${parentName}
${parentAddress}
${parentPhone}

Date: ${today}

To: IEP Team Coordinator / Case Manager
${schoolDistrictName}
Special Education Department

RE: Request for IEP Meeting
Child: ${childName} (DOB: ${childDob})
IEP Date/Category: ${diagnosisName}

Dear IEP Team,

I am writing to request an IEP meeting to review and revise my child's current IEP under California Education Code § 56343(c). 

I am requesting this meeting to discuss:
- Accommodations adjustments related to the impact of ${diagnosisName} on classroom participation.
- Review of progress toward goals and request for additional services/placements.
- Behavioral concerns and potential need for a Functional Behavior Assessment (FBA).

Under California Education Code § 56343.5, the school district must convene an IEP team meeting within thirty (30) calendar days from receipt of a parent's written request (not including school vacations in excess of five days).

Please contact me at your earliest convenience to schedule a mutually agreeable date and time. I look forward to working collaboratively with the IEP team.

Sincerely,

_______________________________
${parentName} (Parent/Caregiver Signature)`;
      }

      setLetterText(content);
    }, 0);
  }, [letterType, parentName, parentAddress, parentPhone, childName, childDob, schoolDistrictName, diagnosisName]);

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
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
          <FileText color="var(--primary-color)" size={24} />
          <h2 style={{ fontSize: '1.4rem', margin: 0 }}>CA Special Education Advocacy Letter Generator</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={handleCopy} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button className="btn-primary" onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
            <Printer size={14} />
            Print Letter
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        
        {/* Input Form */}
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Select Letter Type
            </label>
            <select 
              value={letterType} 
              onChange={(e) => setLetterType(e.target.value as 'initial-eval' | 'iee' | 'meeting')}
              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.9rem', background: 'white' }}
            >
              <option value="initial-eval">Request Initial IEP Evaluation (CA Ed Code § 56321)</option>
              <option value="iee">Request Independent Evaluation (IEE) (CA Ed Code § 56329(b))</option>
              <option value="meeting">Request Emergency IEP Meeting (CA Ed Code § 56343(c))</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Parent Full Name
              </label>
              <input 
                type="text" 
                value={parentName} 
                onChange={(e) => setParentName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Parent Phone
              </label>
              <input 
                type="text" 
                value={parentPhone} 
                onChange={(e) => setParentPhone(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Parent Mailing Address
            </label>
            <input 
              type="text" 
              value={parentAddress} 
              onChange={(e) => setParentAddress(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Child Full Name
              </label>
              <input 
                type="text" 
                value={childName} 
                onChange={(e) => setChildName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Child DOB
              </label>
              <input 
                type="text" 
                value={childDob} 
                onChange={(e) => setChildDob(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.1)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <AlertCircle size={16} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.4 }}>
              <strong>Important:</strong> Under CA law, timelines begin the calendar day after the school district receives your written request. Send your letter via certified mail, or email the SpEd director with delivery confirmation to verify receipt.
            </p>
          </div>
        </div>

        {/* Output Letter Area */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <textarea 
            value={letterText}
            readOnly
            style={{ 
              width: '100%', 
              height: '350px', 
              padding: '1.25rem', 
              borderRadius: '16px', 
              border: '1px solid rgba(0,0,0,0.12)', 
              fontSize: '0.88rem', 
              fontFamily: 'Courier, monospace', 
              lineHeight: '1.5',
              background: '#fafafa',
              resize: 'none'
            }}
          />
        </div>

      </div>

      {/* Print-Only layout */}
      <div className="print-only" style={{ display: 'none', whiteSpace: 'pre-wrap', fontFamily: 'Courier, monospace', fontSize: '11pt', lineHeight: 1.5 }}>
        {letterText}
      </div>
    </div>
  );
}
