'use client';

import { useState, useEffect } from 'react';
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
  Reminder,
  ChildIepData,
  ChildRespiteData,
  CoreProgramMatch,
  CountyOffice,
  SchoolDistrict,
  NonprofitOrganization,
  RegionalCenter,
  ProgramApplicationStep,
  ProgramDocumentRequirement,
  Selpa,
  IepAdvocate,
  ChildWaiver
} from '@/lib/db';
import ChildEditor from './child-editor';
import { 
  User, Plus, Edit, Trash2, ShieldCheck, Calendar, 
  MapPin, ChevronDown, ChevronUp, AlertCircle, Phone, 
  Globe, Info, FileCheck, Landmark, Trash,
  Check, Mail, Sparkles, BookOpen, Layers,
  ShieldAlert, Scale, Clock, LayoutDashboard
} from 'lucide-react';
import PrintButton from '@/components/print-button';
import ShareButton from '@/components/share-button';
import CopyButton from '@/components/copy-button';

import { ChildProfileProvider, useChildProfile } from './components/ChildProfileContext';
import IEPGoalsPanel from './components/IEPGoalsPanel';
import RespiteCalculator from './components/RespiteCalculator';
import IHSSOvertimePanel from './components/IHSSOvertimePanel';
import WaiverVaultPanel from './components/WaiverVaultPanel';
import CareRoadmapPanel from './components/CareRoadmapPanel';
import AppealsCenterPanel from './components/AppealsCenterPanel';
import KnowledgeBasePanel from './components/KnowledgeBasePanel';
import DirectoryReviews from './components/DirectoryReviews';
import WaitlistTrackerPanel from './components/WaitlistTrackerPanel';
import IEPPrepPanel from './components/IEPPrepPanel';
import AdulthoodTransitionPanel from './components/AdulthoodTransitionPanel';
import CaregiverSupportPanel from './components/CaregiverSupportPanel';
import DocumentOcrPanel from './components/DocumentOcrPanel';
import InboxPanel from './components/InboxPanel';
import ShareSettingsWidget from './components/ShareSettingsWidget';
import { sanitizeText } from '@/lib/storage-helper';
import { TrustBadge } from '@/app/counties/components/CorrectionFlow';

interface DashboardClientProps {
  counties: County[];
  conditions: TaxonomyCondition[];
  needs: FunctionalNeed[];
  childrenList: ChildProfile[];
  selectedChildId: string | null;
  matchedPrograms: CoreProgramMatch[];
  crawlerPrograms: Program[];
  savedStatuses: ProgramStatus[];
  savedChecklist: ChecklistItem[];
  savedReminders: Reminder[];
  countyDetails: (County & {
    countyOffices: CountyOffice[];
    schoolDistricts: SchoolDistrict[];
    localOrganizations: NonprofitOrganization[];
    regionalCenters: RegionalCenter[];
    selpas: Selpa[];
  }) | null;
  savedIepData: ChildIepData;
  savedRespiteData: ChildRespiteData | null;
  initialTab?: string | null;
  initialSubTab?: string | null;
  localAdvocates?: IepAdvocate[];
  savedWaivers?: ChildWaiver[];
}

function calculateAge(dobString: string) {
  const dob = new Date(dobString);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  const years = Math.abs(ageDate.getUTCFullYear() - 1970);
  if (years === 0) {
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.4375));
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  return `${years} year${years !== 1 ? 's' : ''}`;
}

interface MilestoneInfo {
  id: string;
  title: string;
  citation: string;
  dueDate: string;
  daysRemaining: number;
  breachType: string;
  stage: number;
  description: string;
}

export default function DashboardClient(props: DashboardClientProps) {
  return (
    <ChildProfileProvider {...props}>
      <DashboardInnerClient />
    </ChildProfileProvider>
  );
}

function DashboardInnerClient() {
  const {
    counties,
    conditions,
    needs,
    childrenList,
    setSelectedChildId,
    currentChild,
    matchedPrograms,
    crawlerPrograms,
    savedStatuses,
    savedChecklist,
    savedReminders,
    countyDetails,
    localAdvocates,
    activeTab,
    setActiveTab,
    isSpanish,
    setIsSpanish
  } = useChildProfile();

  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  const [isAddingChild, setIsAddingChild] = useState(false);

  const toggleLanguage = () => {
    const newVal = !isSpanish;
    setIsSpanish(newVal);
    localStorage.setItem('caregiver_lang', newVal ? 'es' : 'en');
  };

  const [childAgeText, setChildAgeText] = useState<string>('');
  useEffect(() => {
    if (currentChild?.dob) {
      const timer = setTimeout(() => {
        setChildAgeText(calculateAge(currentChild.dob));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentChild?.dob]);

  // ----------------------------------------------------
  // Local States for Benefits & Actions Tabs
  // ----------------------------------------------------
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderProgId, setReminderProgId] = useState('');
  const [timelineTemplate, setTimelineTemplate] = useState<'iep' | 'rc' | 'ihss'>('iep');
  const [submissionDate, setSubmissionDate] = useState('');
  const [iepAssessmentSignedDate, setIepAssessmentSignedDate] = useState('');
  const [activeBreachLetter, setActiveBreachLetter] = useState<string | null>(null);

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
    // Sanitize title to prevent XSS
    const sanitizedTitle = sanitizeText(reminderTitle);
    await addReminderAction(currentChild.id, sanitizedTitle, reminderDate, reminderProgId || null);
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

  const handleSyncTimelineReminders = async (milestones: MilestoneInfo[]) => {
    if (!currentChild) return;
    try {
      let syncedCount = 0;
      for (const m of milestones) {
        const title = `${m.title} (${m.citation})`;
        const exists = savedReminders.some(r => r.title === title && r.child_id === currentChild.id);
        if (!exists) {
          await addReminderAction(currentChild.id, title, m.dueDate, m.id);
          syncedCount++;
        }
      }
      alert(syncedCount > 0 ? `Successfully synchronized ${syncedCount} timeline alarms to your Agenda.` : 'Timelines are already synced to your Alert Agenda.');
    } catch (e) {
      console.error(e);
      alert('Failed to sync timelines to Alert Agenda.');
    }
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

  const getMilestones = (): MilestoneInfo[] => {
    if (!submissionDate) return [];
    const sub = new Date(submissionDate + 'T00:00:00');
    if (isNaN(sub.getTime())) return [];

    const formatDate = (d: Date) => {
      return d.toISOString().split('T')[0];
    };

    const addDays = (d: Date, days: number) => {
      const result = new Date(d);
      result.setDate(result.getDate() + days);
      return result;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (timelineTemplate === 'iep') {
      const planDue = addDays(sub, 15);
      const daysToPlan = Math.ceil((planDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let meetingDue: Date;
      if (iepAssessmentSignedDate) {
        const signed = new Date(iepAssessmentSignedDate + 'T00:00:00');
        meetingDue = addDays(signed, 60);
      } else {
        meetingDue = addDays(sub, 75);
      }
      const daysToMeeting = Math.ceil((meetingDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return [
        {
          id: 'iep-plan',
          title: 'Assessment Plan Provided by District',
          citation: 'CA Ed Code § 56321',
          dueDate: formatDate(planDue),
          daysRemaining: daysToPlan,
          breachType: 'iep-15-day',
          stage: 1,
          description: 'The school district must provide a proposed Assessment Plan to the parent within 15 calendar days of the initial written referral.'
        },
        {
          id: 'iep-meeting',
          title: 'IEP Assessment Complete & Meeting Held',
          citation: 'CA Ed Code § 56344(a)',
          dueDate: formatDate(meetingDue),
          daysRemaining: daysToMeeting,
          breachType: 'iep-60-day',
          stage: 2,
          description: 'The district must complete the assessments and hold the IEP team eligibility/placement meeting within 60 calendar days of receiving the signed Assessment Plan.'
        }
      ];
    } else if (timelineTemplate === 'rc') {
      const intakeDue = addDays(sub, 15);
      const daysToIntake = Math.ceil((intakeDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      const eligibilityDue = addDays(sub, 120);
      const daysToElig = Math.ceil((eligibilityDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return [
        {
          id: 'rc-intake',
          title: 'Initial Intake Interview Completed',
          citation: 'Welfare & Institutions Code § 4642(a)',
          dueDate: formatDate(intakeDue),
          daysRemaining: daysToIntake,
          breachType: 'rc-15-day',
          stage: 1,
          description: 'Regional Center intake and assessment services must be initiated/performed within 15 consecutive days of the initial request.'
        },
        {
          id: 'rc-eligibility',
          title: 'Eligibility Determined & IPP Held',
          citation: 'Welfare & Institutions Code § 4642 & 4646',
          dueDate: formatDate(eligibilityDue),
          daysRemaining: daysToElig,
          breachType: 'rc-120-day',
          stage: 2,
          description: 'The Regional Center has a maximum of 120 days from the initial request to finalize eligibility determination and hold the IPP meeting.'
        }
      ];
    } else {
      const visitDue = addDays(sub, 30);
      const daysToVisit = Math.ceil((visitDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return [
        {
          id: 'ihss-decision',
          title: 'County In-Home Assessment & Decision',
          citation: 'CDSS MPP § 30-759.2',
          dueDate: formatDate(visitDue),
          daysRemaining: daysToVisit,
          breachType: 'ihss-30-day',
          stage: 1,
          description: 'The county welfare department has a maximum of 30 calendar days from the date of application (or SOC 873 medical form receipt) to perform the home visit and issue an eligibility determination.'
        }
      ];
    }
  };

  const compileBreachLetter = (breachType: string, milestone: MilestoneInfo) => {
    if (!currentChild) return '';
    const childCounty = counties.find(c => c.id === currentChild.county_id);
    const countyName = childCounty ? childCounty.name : '[County Name]';
    const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const dobStr = currentChild.dob ? new Date(currentChild.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '[Child Date of Birth]';
    const districtName = countyDetails?.schoolDistricts?.[0]?.name || '[School District Name]';
    const rcName = countyDetails?.regionalCenters?.[0]?.name || '[Regional Center Name]';
    const daysOverdue = Math.abs(milestone.daysRemaining);

    const formattedSubDate = submissionDate ? new Date(submissionDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '[Submission Date]';
    const formattedDueDate = milestone.dueDate ? new Date(milestone.dueDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '[Due Date]';

    switch (breachType) {
      case 'iep-15-day':
        return `Subject: URGENT: Special Education Assessment Plan Overdue - ${currentChild.nickname}

To: Director of Special Education / IEP Coordinator
${districtName}
${countyName} County, CA

Date: ${todayStr}

Dear Special Education Administrator,

I am writing to follow up on the written referral for a special education assessment for my child, ${currentChild.nickname} (DOB: ${dobStr}), which was submitted to the district on ${formattedSubDate}.

Under California Education Code Section 56321, the school district is required to provide parents with a proposed Assessment Plan within 15 calendar days of receiving a written referral. 

As of today, ${todayStr}, it has been ${daysOverdue} days since my request, and the statutory deadline of ${formattedDueDate} has passed. I have not yet received the proposed Assessment Plan.

Please provide the Assessment Plan immediately so that we can proceed with the necessary evaluations without further delay.

Sincerely,

[Parent Name]
[Parent Signature]
[Parent Contact Info]`;

      case 'iep-60-day':
        const formattedSignedDate = iepAssessmentSignedDate ? new Date(iepAssessmentSignedDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '[Signed Date]';
        return `Subject: URGENT: Demand for IEP Eligibility/Placement Meeting - ${currentChild.nickname}

To: IEP Coordinator / Case Manager
${districtName}
${countyName} County, CA

Date: ${todayStr}

Dear IEP Coordinator,

I am writing to formally request the immediate scheduling of an IEP meeting for my child, ${currentChild.nickname} (DOB: ${dobStr}).

On ${formattedSignedDate}, I returned the signed Assessment Plan consenting to special education evaluations. According to California Education Code Section 56344(a), the school district must complete all assessments and hold an IEP team meeting to determine eligibility and placement within 60 calendar days of receiving the signed consent.

The 60-day statutory deadline was ${formattedDueDate}. Today is ${todayStr} (which is ${daysOverdue} days past the deadline), and an IEP meeting has not yet been scheduled or held.

Please contact me immediately to schedule the IEP meeting.

Sincerely,

[Parent Name]
[Parent Signature]
[Parent Contact Info]`;

      case 'rc-15-day':
        return `Subject: URGENT: Request for Intake Appointment - W&I Code § 4642 - ${currentChild.nickname}

To: Intake Coordinator
${rcName}

Date: ${todayStr}

Dear Intake Coordinator,

I am writing to follow up on the request for Regional Center services for my child, ${currentChild.nickname} (DOB: ${dobStr}), submitted on ${formattedSubDate}.

Pursuant to California Welfare and Institutions Code Section 4642(a), intake and assessment services must be performed within 15 consecutive days of the initial request for services. 

The 15-day statutory deadline was ${formattedDueDate}. As of today, it has been ${daysOverdue} days since my request and the intake interview has not been completed.

Please contact me immediately to schedule the intake appointment.

Sincerely,

[Parent Name]
[Parent Signature]
[Parent Contact Info]`;

      case 'rc-120-day':
        return `Subject: URGENT: Demand for Eligibility Decision and IPP - W&I Code § 4642 - ${currentChild.nickname}

To: Executive Director / Case Manager Supervisor
${rcName}

Date: ${todayStr}

Dear Regional Center Director,

I am writing to formally demand an eligibility determination and, if eligible, the immediate scheduling of an Individual Program Plan (IPP) meeting for my child, ${currentChild.nickname} (DOB: ${dobStr}).

My initial request for intake and eligibility determination was submitted to the Regional Center on ${formattedSubDate}. Under California Welfare and Institutions Code Sections 4642(a) and 4646, the Regional Center must determine eligibility and complete the IPP within 120 days of the initial request.

The 120-day statutory timeline expired on ${formattedDueDate}. Today is ${todayStr}, meaning the Regional Center is now ${daysOverdue} days out of compliance.

Please contact me within 48 hours to confirm my child's eligibility status and schedule the IPP meeting.

Sincerely,

[Parent Name]
[Parent Signature]
[Parent Contact Info]`;

      case 'ihss-30-day':
        return `Subject: URGENT: Demand for In-Home Assessment & Eligibility Decision - MPP § 30-759.2 - ${currentChild.nickname}

To: Social Services Supervisor
County of ${countyName} Social Services Agency

Date: ${todayStr}

Dear IHSS Supervisor,

I am writing regarding the In-Home Supportive Services (IHSS) application for my child, ${currentChild.nickname} (DOB: ${dobStr}), submitted on ${formattedSubDate}.

Under California Department of Social Services (CDSS) Manual of Policies and Procedures (MPP) Section 30-759.2, the county welfare department is required to perform the in-home assessment and issue a notice of action within 30 days of receiving the application or the completed medical certification.

The 30-day regulatory deadline was ${formattedDueDate}. Today is ${todayStr}, and it has been ${daysOverdue} days since the request, but the assessment and eligibility determination have not been completed.

Please contact me immediately to schedule the in-home visit.

Sincerely,

[Parent Name]
[Parent Signature]
[Parent Contact Info]`;

      default:
        return '';
    }
  };

  return (
    <main className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '1150px' }}>
      <div className="no-print">
      
      {/* 1. Header & Switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', marginRight: '0.5rem', background: 'none', WebkitTextFillColor: 'initial', WebkitBackgroundClip: 'initial' }}>
              {isSpanish ? 'Portal Familiar' : 'Family Portal'}
            </h1>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} className="no-print">
              <ShareButton />
              <PrintButton label={isSpanish ? 'Imprimir Resumen PDF' : 'Print PDF Summary'} />
              <button
                onClick={toggleLanguage}
                className="btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', cursor: 'pointer', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', width: 'auto' }}
              >
                🇺🇸/🇪🇸 {isSpanish ? 'English' : 'Español'}
              </button>
            </div>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
            {isSpanish ? 'Coordine líneas de tiempo de atención y seguimiento de beneficios.' : 'Coordinate care timelines and benefits tracking.'}
          </p>
        </div>

        {/* Child selector tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }} className="no-print">
          {childrenList.map(child => (
            <button 
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={child.id === currentChild?.id ? 'tab-btn active' : 'tab-btn'}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid var(--glass-border)', fontWeight: 500, fontSize: '0.9rem', color: child.id === currentChild?.id ? 'white' : 'var(--text-main)', background: child.id === currentChild?.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
            >
              <User size={16} />
              <span>{child.nickname}</span>
            </button>
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
            To map state waivers, Regional Center funding, and custom school IEP requirements, please create a profile representing your child&apos;s age, county, and diagnoses.
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
                  {currentChild?.nickname}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><Calendar size={14} /> Age: {childAgeText}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={14} /> {counties.find(c => c.id === currentChild?.county_id)?.name || currentChild?.county_id}</span>
                  <span style={{ background: 'rgba(var(--primary-rgb), 0.08)', color: 'var(--primary-color)', padding: '0.1rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>
                    {currentChild?.conditionIds?.[0] ? currentChild.conditionIds[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Developmental Delay'}
                  </span>
                </div>
                
                {/* Status Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {savedStatuses.filter(s => s.status === 'approved').length > 0 && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>
                      🟢 {savedStatuses.filter(s => s.status === 'approved').length} Approved
                    </span>
                  )}
                  {savedStatuses.filter(s => s.status === 'applied' || s.status === 'waiting').length > 0 && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>
                      🔵 {savedStatuses.filter(s => s.status === 'applied' || s.status === 'waiting').length} Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }} className="no-print">
              <button 
                onClick={() => setEditingChild(currentChild)}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', width: 'auto' }}
              >
                <Edit size={14} /> Edit Profile
              </button>
              <button 
                onClick={() => currentChild && handleDeleteChild(currentChild.id)}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: '0.3rem', width: 'auto' }}
              >
                <Trash2 size={14} /> Delete Profile
              </button>
            </div>
          </div>

          {/* 3. Global Dashboard Tab Navigation Menu */}
          <div style={{ borderBottom: '1px solid var(--glass-border)', marginBottom: '2rem', display: 'flex', gap: '1.5rem', overflowX: 'auto' }} className="no-print">
            <button
              onClick={() => setActiveTab('roadmap')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'roadmap' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'roadmap' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <LayoutDashboard size={18} /> {isSpanish ? 'Mapa de Ruta' : 'Care Roadmap'}
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'benefits' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'benefits' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <ShieldCheck size={18} /> {isSpanish ? 'Beneficios' : 'State Benefits'}
            </button>
            <button
              onClick={() => setActiveTab('dds')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'dds' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'dds' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <Layers size={18} /> {isSpanish ? 'Respiro y DDS' : 'Respite & DDS'}
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'actions' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'actions' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <FileCheck size={18} /> {isSpanish ? 'Plan de Acción' : 'Action Plan'}
            </button>
            <button
              onClick={() => setActiveTab('waivers')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'waivers' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'waivers' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <Layers size={18} /> {isSpanish ? 'Bóveda de Exenciones' : 'Waiver Vault'}
            </button>
            <button
              onClick={() => setActiveTab('county')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'county' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'county' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <MapPin size={18} /> {isSpanish ? 'Directorio Local' : 'Local Directory'}
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'knowledge' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'knowledge' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <BookOpen size={18} /> {isSpanish ? 'Biblioteca de Guías' : 'Knowledge Base'}
            </button>
            <button
              onClick={() => setActiveTab('waitlists')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'waitlists' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'waitlists' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <FileCheck size={18} /> {isSpanish ? 'Listas de Espera' : 'Waitlists'}
            </button>
          </div>

          {/* 4. Tab Views Panel Container */}
          <div style={{ minHeight: '400px' }}>

            {/* TAB 1: BENEFITS & TRACKERS */}
            {activeTab === 'benefits' && (
              <div className="animate-fade-in">

                {/* Denial Funnel Banner — shown when any program is marked Denied */}
                {savedStatuses.some(s => s.status === 'denied') && (() => {
                  const deniedPrograms = matchedPrograms.filter(p => savedStatuses.some(s => s.program_id === p.id && s.status === 'denied'));
                  const topAdvocates = (localAdvocates || []).slice(0, 3);
                  return (
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(239,68,68,0.04)', border: '2px solid rgba(239,68,68,0.2)', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ background: 'rgba(239,68,68,0.1)', padding: '0.6rem', borderRadius: '10px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                          <AlertCircle size={22} color="#dc2626" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.25rem' }}>
                            ⚠️ Denial Detected — Appeal Options Available
                          </h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                            {deniedPrograms.map(p => p.name).join(', ')} {deniedPrograms.length === 1 ? 'has been' : 'have been'} marked as Denied.
                            You have the right to appeal. Acting quickly is critical — most deadlines are <strong>90 days or less</strong> from your Notice of Action.
                          </p>
                          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => setActiveTab('county')}
                              style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: '10px', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                              <Scale size={15} /> Find Local Advocate
                            </button>
                            <button
                              onClick={() => setActiveTab('actions')}
                              style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                              <Clock size={15} /> Check Appeal Deadlines
                            </button>
                            <button
                              onClick={() => setActiveTab('knowledge')}
                              style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                              <BookOpen size={15} /> Read Appeal Guide
                            </button>
                          </div>
                        </div>
                      </div>

                      {topAdvocates.length > 0 && (
                        <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(239,68,68,0.1)', paddingTop: '1.25rem' }}>
                          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Local Advocates in Your County</p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                            {topAdvocates.map(adv => (
                              <div key={adv.id} style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
                                <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.1rem' }}>{adv.name}</strong>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.4rem' }}>{adv.credentials}</span>
                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                  {adv.phone && (
                                    <a href={`tel:${adv.phone}`} style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 600, textDecoration: 'none' }}>{adv.phone}</a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => setActiveTab('county')} style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: '#dc2626', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                            View Full Specialist Directory →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Core Matched State Programs</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    Based on eligibility criteria matching conditions & functional needs.
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                  {matchedPrograms.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
                      <p>No major state-mandated programs matched this child&apos;s profile directly. Edit the child&apos;s profile to expand conditions or needs to see matches.</p>
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
                                  <strong>Who it&apos;s for:</strong> {program.who_it_is_for}
                                </p>
                                <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                                  <strong>Qualifying factors:</strong> {program.who_might_qualify}
                                </p>

                                {program.applicationSteps && program.applicationSteps.length > 0 && (
                                  <>
                                    <h6 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Next Steps to Apply:</h6>
                                    <ol style={{ fontSize: '0.85rem', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', lineHeight: '1.5' }}>
                                      {program.applicationSteps.map((step: ProgramApplicationStep) => (
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
                                    {program.documentRequirements.map((doc: ProgramDocumentRequirement) => {
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
                                            background: isChecked ? 'rgba(var(--primary-rgb),0.04)' : 'rgba(0,0,0,0.01)',
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

            {/* TAB 0: CARE ROADMAP PANEL */}
            {activeTab === 'roadmap' && <CareRoadmapPanel key={currentChild?.id || 'none'} isSpanish={isSpanish} />}

            {/* TAB 2: IEP PLANNER */}
            {activeTab === 'iep' && <IEPGoalsPanel key={currentChild?.id || 'none'} />}

            {/* TAB 3: DDS RESPITE & FUNDING */}
            {activeTab === 'dds' && <RespiteCalculator key={currentChild?.id || 'none'} isSpanish={isSpanish} />}

            {/* TAB 4: IHSS & OVERTIME */}
            {activeTab === 'ihss' && <IHSSOvertimePanel key={currentChild?.id || 'none'} />}

            {/* TAB 5: APPEALS & LETTERS BUILDER */}
            {activeTab === 'appeals' && <AppealsCenterPanel key={currentChild?.id || 'none'} isSpanish={isSpanish} />}

            {/* TAB 6: ACTION PLAN (MERGED CHECKLISTS & REMINDERS) */}
            {activeTab === 'actions' && (
              <div className="animate-fade-in iep-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
                
                {/* Left Column: Checklists & Timeline Tracker */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
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
                          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(var(--primary-rgb), 0.04)', border: '1px solid rgba(var(--primary-rgb), 0.08)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
                        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Check eligibility results and set their statuses to &quot;Applied&quot; or &quot;Waiting&quot; to populate checklist files.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {savedChecklist.map(item => {
                          // Determine matching specialist
                          let matchedAdvocate = null;
                          if (item.program_id === 'iep-special-education') {
                            matchedAdvocate = localAdvocates.find(a => 
                              ((a.specialties || '') + ' ' + (a.credentials || '')).toLowerCase().includes('iep') ||
                              ((a.specialties || '') + ' ' + (a.credentials || '')).toLowerCase().includes('education')
                            );
                          } else if (item.program_id === 'regional-centers') {
                            matchedAdvocate = localAdvocates.find(a => 
                              ((a.specialties || '') + ' ' + (a.description || '')).toLowerCase().includes('regional center') ||
                              ((a.specialties || '') + ' ' + (a.description || '')).toLowerCase().includes('lanterman')
                            );
                          } else if (item.program_id === 'ihss-for-children') {
                            matchedAdvocate = localAdvocates.find(a => 
                              ((a.specialties || '') + ' ' + (a.description || '')).toLowerCase().includes('ihss') ||
                              ((a.specialties || '') + ' ' + (a.description || '')).toLowerCase().includes('behavior') ||
                              ((a.specialties || '') + ' ' + (a.description || '')).toLowerCase().includes('autism')
                            );
                          }
                          if (!matchedAdvocate && localAdvocates.length > 0) {
                            matchedAdvocate = localAdvocates[0];
                          }

                          return (
                            <div 
                              key={item.id}
                              style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: '0.5rem',
                                padding: '0.8rem 1rem',
                                borderBottom: '1px solid rgba(0,0,0,0.04)',
                                background: item.is_collected === 1 ? 'rgba(var(--primary-rgb),0.02)' : 'transparent',
                                borderRadius: '8px',
                                marginBottom: '0.25rem'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                                
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                  {item.document_name === 'SOC 873 Medical Certification Form' && (
                                    <a
                                      href="https://www.cdss.ca.gov/cdssweb/entres/forms/english/soc873.pdf"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn-secondary"
                                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', width: 'auto', background: 'rgba(var(--primary-rgb), 0.05)', border: '1px solid rgba(var(--primary-rgb), 0.15)', color: 'var(--primary-color)', textDecoration: 'none', borderRadius: '6px', fontWeight: 600 }}
                                    >
                                      <Globe size={12} /> Download PDF ↗
                                    </a>
                                  )}
                                </div>
                              </div>

                              {matchedAdvocate && item.is_collected !== 1 && (
                                <div style={{ 
                                  marginTop: '0.25rem', 
                                  fontSize: '0.75rem', 
                                  color: 'var(--text-light)', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '0.4rem', 
                                  background: 'rgba(var(--primary-rgb), 0.02)', 
                                  padding: '0.4rem 0.6rem', 
                                  borderRadius: '6px', 
                                  border: '1px solid rgba(var(--primary-rgb), 0.06)' 
                                }}>
                                  <Sparkles size={12} color="var(--primary-color)" style={{ flexShrink: 0 }} />
                                  <span>Need local support? Contact:</span>
                                  <strong style={{ color: 'var(--text-main)' }}>{matchedAdvocate.name}</strong>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontStyle: 'italic' }}>({matchedAdvocate.credentials})</span>
                                  <button
                                    onClick={() => {
                                      setActiveTab('county');
                                    }}
                                    style={{ 
                                      marginLeft: 'auto', 
                                      background: 'none', 
                                      border: 'none', 
                                      color: 'var(--primary-color)', 
                                      fontWeight: 600, 
                                      padding: 0, 
                                      cursor: 'pointer', 
                                      fontSize: '0.72rem', 
                                      textDecoration: 'underline' 
                                    }}
                                  >
                                    View Specialist Directory
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Statutory Timeline & Milestone Tracker */}
                  <div className="glass-panel animate-fade-in" style={{ background: 'rgba(255,255,255,0.85)', padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Clock size={20} color="var(--primary-color)" />
                      Statutory Timeline & Milestone Tracker
                    </h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                      Input the date you submitted formal requests to California agencies (IEP, Regional Center, or IHSS) to compute legally mandated response deadlines and download compliance letters.
                    </p>

                    {/* Pathway Selection */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                      {[
                        { id: 'iep' as const, label: 'School District IEP' },
                        { id: 'rc' as const, label: 'Regional Center Lanterman' },
                        { id: 'ihss' as const, label: 'County IHSS personal care' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setTimelineTemplate(tab.id);
                            setSubmissionDate('');
                            setIepAssessmentSignedDate('');
                            setActiveBreachLetter(null);
                          }}
                          className={timelineTemplate === tab.id ? 'tab-btn active' : 'tab-btn'}
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.85rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(0,0,0,0.06)',
                            fontWeight: 500,
                            cursor: 'pointer',
                            color: timelineTemplate === tab.id ? 'white' : 'var(--text-main)',
                            background: timelineTemplate === tab.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.7)'
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Date Inputs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                          {timelineTemplate === 'iep' && 'IEP Referral Submission Date'}
                          {timelineTemplate === 'rc' && 'Regional Center Request Date'}
                          {timelineTemplate === 'ihss' && 'IHSS Application or SOC 873 Date'}
                        </label>
                        <input
                          type="date"
                          value={submissionDate}
                          onChange={(e) => setSubmissionDate(e.target.value)}
                          style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                        />
                      </div>

                      {timelineTemplate === 'iep' && (
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                            Signed Assessment Plan Date <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>(Optional)</span>
                          </label>
                          <input
                            type="date"
                            value={iepAssessmentSignedDate}
                            onChange={(e) => setIepAssessmentSignedDate(e.target.value)}
                            style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                          />
                        </div>
                      )}
                    </div>

                    {timelineTemplate === 'iep' && (
                      <div style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <Info size={16} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.75rem', color: '#b45309', lineHeight: 1.4 }}>
                          Note: California Education Code excludes school holidays and summer breaks exceeding 5 days from the 15-day and 60-day deadlines.
                        </span>
                      </div>
                    )}

                    {/* Calculated Milestones */}
                    {submissionDate ? (
                      (() => {
                        const milestones = getMilestones();
                        return (
                          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>Computed Statutory Timelines</h4>
                              <button
                                type="button"
                                onClick={() => handleSyncTimelineReminders(milestones)}
                                className="btn-primary"
                                style={{
                                  padding: '0.4rem 0.8rem',
                                  fontSize: '0.75rem',
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  width: 'auto',
                                  cursor: 'pointer'
                                }}
                              >
                                <Calendar size={12} /> Sync to Alarm Agenda
                              </button>
                            </div>

                            {/* Timeline Stages */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid rgba(0,0,0,0.05)' }}>
                              {milestones.map((m, idx) => {
                                const isBreached = m.daysRemaining < 0;
                                const isCompleted = savedReminders.some(r => r.title.startsWith(m.title) && r.child_id === currentChild?.id && r.is_completed === 1);

                                return (
                                  <div key={m.id} style={{ position: 'relative', marginBottom: idx < milestones.length - 1 ? '0.5rem' : 0 }}>
                                    {/* Timeline dot */}
                                    <div
                                      style={{
                                        position: 'absolute',
                                        left: '-29px',
                                        top: '4px',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        backgroundColor: isCompleted ? '#10b981' : isBreached ? '#ef4444' : 'var(--primary-color)',
                                        border: '3px solid white',
                                        boxShadow: '0 0 0 2px rgba(0,0,0,0.05)'
                                      }}
                                    />
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                                      <div>
                                        <span style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block', color: 'var(--text-main)' }}>
                                          {m.title}
                                        </span>
                                        <span style={{ fontSize: '0.72rem', color: 'var(--primary-color)', fontWeight: 600, display: 'inline-block', marginRight: '0.5rem' }}>
                                          {m.citation}
                                        </span>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', marginTop: '0.2rem', lineHeight: 1.4 }}>
                                          {m.description}
                                        </span>
                                      </div>

                                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isBreached && !isCompleted ? '#ef4444' : 'var(--text-main)' }}>
                                          Due: {m.dueDate}
                                        </span>
                                        {isCompleted ? (
                                          <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                            <Check size={10} /> Completed
                                          </span>
                                        ) : isBreached ? (
                                          <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.1rem 0.4rem', background: '#fee2e2', borderRadius: '4px', border: '1px solid #fecaca' }}>
                                            <ShieldAlert size={10} /> OVERDUE BY {Math.abs(m.daysRemaining)} DAYS
                                          </span>
                                        ) : (
                                          <span style={{ fontSize: '0.7rem', color: m.daysRemaining <= 5 ? '#d97706' : 'var(--text-light)', fontWeight: 700 }}>
                                            {m.daysRemaining} days remaining
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Action if breached & not completed */}
                                    {isBreached && !isCompleted && (
                                      <div style={{ marginTop: '0.75rem', background: 'rgba(239,68,68,0.03)', border: '1px dashed rgba(239,68,68,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                                        <p style={{ fontSize: '0.75rem', color: '#b91c1c', margin: '0 0 0.5rem 0', fontWeight: 500 }}>
                                          This timeline is legally past due. You have the right to request immediate resolution.
                                        </p>
                                        <button
                                          type="button"
                                          onClick={() => setActiveBreachLetter(activeBreachLetter === m.breachType ? null : m.breachType)}
                                          className="btn-secondary"
                                          style={{
                                            padding: '0.3rem 0.6rem',
                                            fontSize: '0.7rem',
                                            borderRadius: '6px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            cursor: 'pointer',
                                            color: '#b91c1c',
                                            borderColor: '#fca5a5',
                                            background: '#fef2f2'
                                          }}
                                        >
                                          <Mail size={12} /> {activeBreachLetter === m.breachType ? 'Hide Demand Letter' : 'Generate Compliance Letter'}
                                        </button>

                                        {activeBreachLetter === m.breachType && (
                                          <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(239,68,68,0.1)', paddingTop: '0.75rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>Copyable Email / Demand Letter</span>
                                              <CopyButton text={compileBreachLetter(m.breachType, m)} size={12} />
                                            </div>
                                            <pre
                                              style={{
                                                padding: '0.75rem',
                                                background: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                whiteSpace: 'pre-wrap',
                                                lineHeight: 1.5,
                                                maxHeight: '220px',
                                                overflowY: 'auto',
                                                color: '#334155',
                                                fontFamily: 'monospace',
                                                margin: 0
                                              }}
                                            >
                                              {compileBreachLetter(m.breachType, m)}
                                            </pre>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.01)', border: '1px dashed rgba(0,0,0,0.05)', borderRadius: '10px' }}>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', margin: 0 }}>
                          Select your request/submission date above to calculate timelines.
                        </p>
                      </div>
                    )}
                  </div>
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

            {/* TAB: WAIVER VAULT */}
            {activeTab === 'waivers' && <WaiverVaultPanel key={currentChild?.id || 'none'} />}

            {/* TAB: KNOWLEDGE BASE */}
            {activeTab === 'knowledge' && <KnowledgeBasePanel isSpanish={isSpanish} />}

            {/* TAB: WAITLISTS */}
            {activeTab === 'waitlists' && <WaitlistTrackerPanel isSpanish={isSpanish} />}

            {/* TAB: IEP PREP */}
            {activeTab === 'iepprep' && <IEPPrepPanel isSpanish={isSpanish} />}

            {/* TAB: TRANSITION CLIFF */}
            {activeTab === 'transition' && <AdulthoodTransitionPanel isSpanish={isSpanish} />}

            {/* TAB: CAREGIVER SUPPORT */}
            {activeTab === 'support' && <CaregiverSupportPanel isSpanish={isSpanish} />}

            {/* TAB: CLINICAL DOCUMENT VAULT OCR */}
            {activeTab === 'documents' && <DocumentOcrPanel />}

            {/* TAB: MESSAGING HUB */}
            {activeTab === 'inbox' && <InboxPanel />}

            {/* TAB: PORTAL SHARING SETTINGS */}
            {activeTab === 'share' && <ShareSettingsWidget />}

            {/* TAB: COUNTY DIRECTORY */}
            {activeTab === 'county' && (() => {
              const stateCatchments: Record<string, string> = {
                'california': 'Regional Center',
                'texas': 'LIDDA',
                'florida': 'APD Office',
                'new-york': 'OPWDD Front Door'
              };

              const stateNames: Record<string, string> = {
                'california': 'California',
                'texas': 'Texas',
                'florida': 'Florida',
                'new-york': 'New York'
              };

              const childCounty = counties.find(c => c.id === currentChild?.county_id);
              const childStateId = childCounty?.state_id || 'california';
              const catchmentLabel = stateCatchments[childStateId] || 'Developmental Disability Agency';
              const stateNameStr = stateNames[childStateId] || 'State';

              return (
                <div className="animate-fade-in">
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>Dynamic County Routing Directory</h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      Local contact numbers, school district offices, and {catchmentLabel} catchments.
                    </p>
                  </div>

                  {!countyDetails ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
                      <p>No resource records found for this county in the database.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                      
                      {/* RC/LIDDA Contacts */}
                      <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.7)', padding: '1.5rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                          <Landmark color="var(--primary-color)" size={18} />
                          {stateNameStr} {catchmentLabel} Intake
                        </h4>
                        {countyDetails.regionalCenters && countyDetails.regionalCenters.length > 0 ? (
                          countyDetails.regionalCenters.map((rc: RegionalCenter) => (
                            <div key={rc.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                              <strong>{rc.name}</strong>
                              <span><strong>Catchment boundary:</strong> {rc.catchment_boundaries}</span>
                              
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <Phone size={14} style={{ flexShrink: 0 }} /> 
                                Intake helpline: 
                                <a href={`tel:${rc.intake_phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{rc.intake_phone}</a>
                                <CopyButton text={rc.intake_phone} size={12} />
                              </span>
                              
                              {rc.early_start_contact && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                  <strong>Early Intervention Contact:</strong> {rc.early_start_contact}
                                  <CopyButton text={rc.early_start_contact} size={12} />
                                </span>
                              )}
                              
                              {rc.lanterman_intake_contact && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                  <strong>Services Intake Contact:</strong> {rc.lanterman_intake_contact}
                                  <CopyButton text={rc.lanterman_intake_contact} size={12} />
                                </span>
                              )}
                              
                              <a href={rc.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none', marginTop: '0.25rem' }}>
                                <Globe size={14} /> Visit Agency Portal
                              </a>
                              <TrustBadge
                                status={rc.verification_status}
                                lastVerifiedDate={rc.last_verified_date}
                                sourceUrl={rc.source_url || rc.website}
                                entityId={rc.id}
                                entityName={rc.name}
                                entityType="regional_center"
                              />
                              <DirectoryReviews
                                entityType="regional_center"
                                entityId={rc.id}
                                entityName={rc.name}
                                countyId={currentChild?.county_id || ''}
                                isSpanish={isSpanish}
                              />
                            </div>
                          ))
                        ) : (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No {catchmentLabel} records available.</p>
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
                            {countyDetails.countyOffices.map((office: CountyOffice) => (
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
                                {office.website && (
                                  <a href={office.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none', marginTop: '0.25rem' }}>
                                    <Globe size={14} /> Visit Office Webpage
                                  </a>
                                )}
                                <TrustBadge
                                  status={office.verification_status}
                                  lastVerifiedDate={office.last_verified_date}
                                  sourceUrl={office.source_url || office.website}
                                  entityId={office.id}
                                  entityName={office.office_name}
                                  entityType="county_office"
                                />
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
                          <BookOpen color="var(--primary-color)" size={18} />
                          School District Special Education
                        </h4>
                        {countyDetails.schoolDistricts && countyDetails.schoolDistricts.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {countyDetails.schoolDistricts.map((sd: SchoolDistrict) => (
                              <div key={sd.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '0.75rem' }}>
                                <strong>{sd.name}</strong>
                                
                                {sd.spec_ed_contact_phone && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    <Phone size={14} style={{ flexShrink: 0 }} /> 
                                    SpecEd Helpline: 
                                    <a href={`tel:${sd.spec_ed_contact_phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{sd.spec_ed_contact_phone}</a>
                                    <CopyButton text={sd.spec_ed_contact_phone} size={12} />
                                  </span>
                                )}
                                
                                {sd.spec_ed_contact_email && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    <Mail size={14} style={{ flexShrink: 0 }} />
                                    Email: 
                                    <a href={`mailto:${sd.spec_ed_contact_email}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{sd.spec_ed_contact_email}</a>
                                    <CopyButton text={sd.spec_ed_contact_email} size={12} />
                                  </span>
                                )}
                                
                                {sd.website && (
                                  <a href={sd.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none', marginTop: '0.2rem' }}>
                                    <Globe size={14} /> District IEP Guidelines
                                  </a>
                                )}
                                <TrustBadge
                                  status={sd.verification_status}
                                  lastVerifiedDate={sd.last_verified_date}
                                  sourceUrl={sd.source_url || sd.website}
                                  entityId={sd.id}
                                  entityName={sd.name}
                                  entityType="school_district"
                                />
                                <DirectoryReviews
                                  entityType="school_district"
                                  entityId={sd.id}
                                  entityName={sd.name}
                                  countyId={currentChild?.county_id || ''}
                                  isSpanish={isSpanish}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No school district contacts listed.</p>
                        )}
                      </div>

                      {/* Nonprofit Support Organizations */}
                      <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.7)', padding: '1.5rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                          <Globe color="var(--primary-color)" size={18} />
                          Local Nonprofit & Support Organizations
                        </h4>
                        {countyDetails.localOrganizations && countyDetails.localOrganizations.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {countyDetails.localOrganizations.map((org: NonprofitOrganization) => (
                              <div key={org.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '0.75rem' }}>
                                <strong>{org.name}</strong>
                                {org.focus_condition && org.focus_condition !== 'any' && (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                                    Focus: {org.focus_condition.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </span>
                                )}
                                
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                  <Phone size={14} style={{ flexShrink: 0 }} /> 
                                  Phone: 
                                  <a href={`tel:${org.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{org.phone}</a>
                                  <CopyButton text={org.phone} size={12} />
                                </span>
                                
                                {org.website && (
                                  <a href={org.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none', marginTop: '0.2rem' }}>
                                    <Globe size={14} /> Visit Support Site
                                  </a>
                                )}
                                <TrustBadge
                                  status={org.verification_status}
                                  lastVerifiedDate={org.last_verified_date}
                                  sourceUrl={org.source_url || org.website}
                                  entityId={org.id}
                                  entityName={org.name}
                                  entityType="nonprofit"
                                />
                                <DirectoryReviews
                                  entityType="nonprofit"
                                  entityId={org.id}
                                  entityName={org.name}
                                  countyId={currentChild?.county_id || ''}
                                  isSpanish={isSpanish}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No local support organizations listed.</p>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              );
            })()}

          </div>
        </>
      )}
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
