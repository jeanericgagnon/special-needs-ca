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
  ChildRespiteData,
  CoreProgramMatch,
  CountyOffice,
  SchoolDistrict,
  NonprofitOrganization,
  RegionalCenter,
  ProgramApplicationStep,
  ProgramDocumentRequirement,
  Selpa
} from '@/lib/db';
import ChildEditor from './child-editor';
import { 
  User, Plus, Edit, Trash2, ShieldCheck, FileText, Calendar, 
  MapPin, ChevronDown, ChevronUp, AlertCircle, Phone, 
  Globe, Info, FileCheck, Landmark, Trash,
  Copy, Check, Mail, Sparkles, BookOpen, Layers, Calculator,
  ShieldAlert, Scale, AlertOctagon, AlertTriangle, Clock
} from 'lucide-react';
import PrintButton from '@/components/print-button';
import ShareButton from '@/components/share-button';
import CopyButton from '@/components/copy-button';

import { IEP_ACCOMMODATIONS, SMART_GOAL_TEMPLATES, SMARTGoalTemplate } from '@/lib/iep-data';
import { EMAIL_TEMPLATES, calculateRespiteTier, compileJustificationBulletPoints } from '@/lib/funding-data';

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
}

type TabType = 'benefits' | 'iep' | 'dds' | 'ihss' | 'appeals' | 'actions' | 'county';

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
  savedRespiteData,
  initialTab,
  initialSubTab
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>(
    (initialTab && ['benefits', 'iep', 'dds', 'ihss', 'appeals', 'actions', 'county'].includes(initialTab)
      ? initialTab
      : 'benefits') as TabType
  );
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const currentChild = childrenList.find(c => c.id === selectedChildId) || childrenList[0];

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
  // IEP Planner Tab State
  // ----------------------------------------------------
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]); 
  const [tokenOverrides, setTokenOverrides] = useState<Record<string, Record<string, string>>>({});

  // ----------------------------------------------------
  // DDS Funding & Financial Planning Tab State
  // ----------------------------------------------------
  const [sdpSubTab, setSdpSubTab] = useState<'respite' | 'sdp' | 'eligibility'>(
    (initialSubTab && ['respite', 'sdp', 'eligibility'].includes(initialSubTab)
      ? initialSubTab
      : 'respite') as 'respite' | 'sdp' | 'eligibility'
  );
  const [posSpend, setPosSpend] = useState<number>(25000);
  const [oneTimeDeductions, setOneTimeDeductions] = useState<number>(0);
  const [fmsModel, setFmsModel] = useState<string>('sole-employer');
  const [unmetNeeds, setUnmetNeeds] = useState<{ id: string; name: string; costType: 'hourly' | 'flat'; hourlyRate: number; hoursPerWeek: number; durationWeeks: number; flatAmount: number; justification: string }[]>([]);
  const [sdpCommunity, setSdpCommunity] = useState<number>(5000);
  const [sdpRespite, setSdpRespite] = useState<number>(10000);
  const [sdpTherapies, setSdpTherapies] = useState<number>(4000);
  const [sdpEquipment, setSdpEquipment] = useState<number>(3000);

  // Financial Planning (Asset Shield) & Deeming States
  const [savingsAmount, setSavingsAmount] = useState<number>(15000);
  const [fundingSource, setFundingSource] = useState<'parents' | 'inheritance' | 'child-injury'>('parents');
  const [expectedBalance, setExpectedBalance] = useState<'low' | 'mid' | 'high'>('mid');
  const [spendingTimeline, setSpendingTimeline] = useState<'immediate' | 'longterm' | 'mixed'>('mixed');

  const [newNeedName, setNewNeedName] = useState('');
  const [newNeedCostType, setNewNeedCostType] = useState<'hourly' | 'flat'>('flat');
  const [newNeedHourlyRate, setNewNeedHourlyRate] = useState<number>(25);
  const [newNeedHoursPerWeek, setNewNeedHoursPerWeek] = useState<number>(10);
  const [newNeedDurationWeeks, setNewNeedDurationWeeks] = useState<number>(12);
  const [newNeedFlatAmount, setNewNeedFlatAmount] = useState<number>(500);

  const [isRcClient, setIsRcClient] = useState<boolean>(true);
  const [hasDiagnosis, setHasDiagnosis] = useState<boolean>(true);
  const [majorLimitations, setMajorLimitations] = useState<number>(3); // Slider 0-7
  const [hasMedicalNeeds, setHasMedicalNeeds] = useState<boolean>(false);
  const [childMediCal, setChildMediCal] = useState<boolean>(false);
  const [familySize, setFamilySize] = useState<number>(4);
  const [grossIncome, setGrossIncome] = useState<number>(135000);
  const [rcChildren, setRcChildren] = useState<number>(1);
  const [showDeemingLetter, setShowDeemingLetter] = useState<boolean>(false);

  // DDS Respite Scores (original)
  const [safetyScore, setSafetyScore] = useState<number>(0);
  const [sleepScore, setSleepScore] = useState<number>(0);
  const [medicalScore, setMedicalScore] = useState<number>(0);
  const [behaviorScore, setBehaviorScore] = useState<number>(0);

  // Active email template state
  const [selectedTemplateId] = useState<string>('req-respite');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');

  // ----------------------------------------------------
  // IHSS Estimator & Safety Journal & Overtime States
  // ----------------------------------------------------
  const [ihssSubTab, setIhssSubTab] = useState<'journal' | 'estimator' | 'overtime'>(
    (initialSubTab && ['journal', 'estimator', 'overtime'].includes(initialSubTab)
      ? initialSubTab
      : 'journal') as 'journal' | 'estimator' | 'overtime'
  );
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [safetyLogHydrated, setSafetyLogHydrated] = useState(false);
  const [logDate, setLogDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  // New Incident Form States
  const [time, setTime] = useState('08:00 AM');
  const [category, setCategory] = useState('Elopement / Wandering');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'critical'>('medium');
  const [details, setDetails] = useState('');
  const [intervention, setIntervention] = useState('');

  // Overtime / Estimator states
  const [feedingRank, setFeedingRank] = useState<number>(1);
  const [bowelBladderRank, setBowelBladderRank] = useState<number>(1);
  const [bathingOralRank, setBathingOralRank] = useState<number>(1);
  const [dressingRank, setDressingRank] = useState<number>(1);
  const [ambulationTransfersRank, setAmbulationTransfersRank] = useState<number>(1);
  const [hasParamedical, setHasParamedical] = useState<boolean>(false);
  const [paramedicalHours, setParamedicalHours] = useState<number>(2);
  const [paramedicalDesc, setParamedicalDesc] = useState<string>('Daily G-tube feeding prep, tube sanitization, and skin site inspection.');
  const [requiresSupervision, setRequiresSupervision] = useState<boolean>(true);
  const [ihssWage, setIhssWage] = useState<number>(18.00);

  const [recipientCount, setRecipientCount] = useState<number>(2);
  const [monthlyHours1, setMonthlyHours1] = useState<number>(120);
  const [monthlyHours2, setMonthlyHours2] = useState<number>(80);
  const [monthlyHours3, setMonthlyHours3] = useState<number>(0);
  const [weeklyTravelHours, setWeeklyTravelHours] = useState<number>(3);
  const [schedule, setSchedule] = useState<Record<string, number>>({});

  // ----------------------------------------------------
  // Appeals & Letters Builder States
  // ----------------------------------------------------
  const [activeTemplate, setActiveTemplate] = useState<'iep-request' | 'ihss-appeal' | 'rc-appeal' | 'ssi-reconsideration' | 'epsdt-therapy'>('iep-request');
  const [iepSubmissionDate, setIepSubmissionDate] = useState('2026-06-01');
  const [copied, setCopied] = useState(false);

  // Common Contact States for Appeals (Prehydrated from profile but customizable)
  const [parentName, setParentName] = useState('Sarah Jenkins');
  const [parentEmail, setParentEmail] = useState('sarah.j@example.com');
  const [parentPhone, setParentPhone] = useState('(555) 019-2834');
  const [parentAddress, setParentAddress] = useState('123 Caregiver Way, Los Angeles, CA 90001');
  const [childName, setChildName] = useState('Liam');
  const [childDob, setChildDob] = useState('2018-05-12');
  const [coordinatorName, setCoordinatorName] = useState('Jane Doe');
  
  // Specific letter settings
  const [schoolDistrict, setSchoolDistrict] = useState('Los Angeles Unified School District (LAUSD)');
  const [schoolName, setSchoolName] = useState('Sunshine Elementary School');
  const [iepConcerns, setIepConcerns] = useState({
    speech: true,
    sensory: true,
    academic: false,
    fineMotor: true,
    social: true,
    behavioral: false,
  });
  const [customIepText, setCustomIepText] = useState('Liam struggles to communicate wants and needs, exhibits sensory overload in loud classrooms, and cannot hold pencils without modifications.');

  const [ihssCounty, setIhssCounty] = useState('Los Angeles');
  const [ihssDenialDate, setIhssDenialDate] = useState('2026-05-15');
  const [ihssSafetyConcerns, setIhssSafetyConcerns] = useState({
    elopement: true,
    pica: false,
    selfInjury: true,
    climbing: true,
    electricalSafety: false
  });
  const [customIhssText, setCustomIhssText] = useState('Liam elopes out of doors and into high-risk traffic zones, head-bangs when overwhelmed, and attempts to climb furniture without any awareness of hazard, requiring constant 24/7 oversight.');

  const [regionalCenterName, setRegionalCenterName] = useState('Frank D. Lanterman Regional Center');
  const [rcDenialDate, setRcDenialDate] = useState('2026-05-20');
  const [rcDiagnosis, setRcDiagnosis] = useState('Autism Spectrum Disorder (Level 3)');
  const [rcLimitations, setRcLimitations] = useState({
    receptiveLanguage: true,
    expressiveLanguage: true,
    learning: true,
    mobility: false,
    selfCare: true,
    selfDirection: true,
  });
  const [customRcText, setCustomRcText] = useState('Liam is non-verbal, cannot perform independent self-care (bathing/feeding), and lacks the self-direction necessary to navigate basic environments safely, satisfying four of the Lanterman Act core limitations.');

  const [ssiDate, setSsiDate] = useState('2026-05-10');
  const [ssiDiagnosis, setSsiDiagnosis] = useState('Autism Spectrum Disorder & Speech Apraxia');
  const [ssiClinicInfo, setSsiClinicInfo] = useState('Children\'s Hospital Los Angeles (CHLA) - Developmental Pediatrics Division');
  const [customSsiText, setCustomSsiText] = useState('Liam meets Childhood Listing 112.10 (Autism spectrum disorder) and exhibits marked limitations in communication (social interaction) and self-regulation (severe emotional dysregulation).');

  const [therapyType, setTherapyType] = useState('Speech-Language Therapy');
  const [denialReason, setDenialReason] = useState('Excludes developmental delays / Not rehabilitative');
  const [insurancePlanName, setInsurancePlanName] = useState('L.A. Care Medi-Cal Managed Care Plan');
  const [prescribingDoctor, setPrescribingDoctor] = useState('Dr. Robert Chen, Pediatric Neurologist');
  const [customTherapyText, setCustomTherapyText] = useState('Liam has expressive-receptive language delay and verbal apraxia. He requires 2 sessions per week of clinical Speech Therapy to develop functional communication, utilizing alternative and augmentative communication (AAC) devices.');

  // ----------------------------------------------------
  // Action Plan Tab State (Reminders Form)
  // ----------------------------------------------------
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderProgId, setReminderProgId] = useState('');

  // Expanded program state for Benefits
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);

  // Milestone Tracker State
  const [timelineTemplate, setTimelineTemplate] = useState<'iep' | 'rc' | 'ihss'>('iep');
  const [submissionDate, setSubmissionDate] = useState('');
  const [iepAssessmentSignedDate, setIepAssessmentSignedDate] = useState('');
  const [activeBreachLetter, setActiveBreachLetter] = useState<string | null>(null);

  // ----------------------------------------------------
  // Sync state to/from URL search parameters
  // ----------------------------------------------------
  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      const timer = setTimeout(() => {
        setActiveTab(initialTab as TabType);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialTab, activeTab]);

  useEffect(() => {
    if (initialSubTab) {
      const timer = setTimeout(() => {
        if (['respite', 'sdp', 'eligibility'].includes(initialSubTab) && initialSubTab !== sdpSubTab) {
          setSdpSubTab(initialSubTab as 'respite' | 'sdp' | 'eligibility');
        }
        if (['journal', 'estimator', 'overtime'].includes(initialSubTab) && initialSubTab !== ihssSubTab) {
          setIhssSubTab(initialSubTab as 'journal' | 'estimator' | 'overtime');
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialSubTab, sdpSubTab, ihssSubTab]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('tab') !== activeTab) {
        url.searchParams.set('tab', activeTab);
        window.history.replaceState(null, '', url.pathname + url.search);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (activeTab === 'dds') {
        if (url.searchParams.get('sub') !== sdpSubTab) {
          url.searchParams.set('sub', sdpSubTab);
          window.history.replaceState(null, '', url.pathname + url.search);
        }
      } else if (activeTab === 'ihss') {
        if (url.searchParams.get('sub') !== ihssSubTab) {
          url.searchParams.set('sub', ihssSubTab);
          window.history.replaceState(null, '', url.pathname + url.search);
        }
      } else {
        if (url.searchParams.has('sub')) {
          url.searchParams.delete('sub');
          window.history.replaceState(null, '', url.pathname + url.search);
        }
      }
    }
  }, [activeTab, sdpSubTab, ihssSubTab]);

  // ----------------------------------------------------
  // Profile Swapping & Initialization Hydration
  // ----------------------------------------------------
  useEffect(() => {
    if (currentChild) {
      const timer = setTimeout(() => {
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
          } catch {}
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

        // 3. Hydrate Safety Log incidents
        try {
          const safetyKey = `ihss_safety_log_${currentChild.id}`;
          const safetyVal = localStorage.getItem(safetyKey);
          if (safetyVal) {
            setIncidents(JSON.parse(safetyVal));
          } else {
            setIncidents(DEFAULT_INCIDENTS);
          }
        } catch {
          setIncidents(DEFAULT_INCIDENTS);
        }
        setSafetyLogHydrated(true);

        // 4. Hydrate IHSS Estimator & Overtime settings
        try {
          const savedFeeding = localStorage.getItem(`ihss_feeding_rank_${currentChild.id}`);
          const savedBowel = localStorage.getItem(`ihss_bowel_rank_${currentChild.id}`);
          const savedBathing = localStorage.getItem(`ihss_bathing_rank_${currentChild.id}`);
          const savedDressing = localStorage.getItem(`ihss_dressing_rank_${currentChild.id}`);
          const savedAmbulation = localStorage.getItem(`ihss_ambulation_rank_${currentChild.id}`);
          const savedParamedical = localStorage.getItem(`ihss_has_paramedical_${currentChild.id}`);
          const savedParamedicalHours = localStorage.getItem(`ihss_paramedical_hours_${currentChild.id}`);
          const savedParamedicalDesc = localStorage.getItem(`ihss_paramedical_desc_${currentChild.id}`);
          const savedSupervision = localStorage.getItem(`ihss_requires_supervision_${currentChild.id}`);
          const savedWage = localStorage.getItem(`ihss_wage_${currentChild.id}`);
          const savedRecipientCount = localStorage.getItem(`ihss_recipient_count_${currentChild.id}`);
          const savedMonthlyHours1 = localStorage.getItem(`ihss_monthly_hours_1_${currentChild.id}`);
          const savedMonthlyHours2 = localStorage.getItem(`ihss_monthly_hours_2_${currentChild.id}`);
          const savedMonthlyHours3 = localStorage.getItem(`ihss_monthly_hours_3_${currentChild.id}`);
          const savedTravelHours = localStorage.getItem(`ihss_travel_hours_${currentChild.id}`);
          const savedSchedule = localStorage.getItem(`ihss_schedule_grid_${currentChild.id}`);

          if (savedFeeding) setFeedingRank(parseInt(savedFeeding));
          if (savedBowel) setBowelBladderRank(parseInt(savedBowel));
          if (savedBathing) setBathingOralRank(parseInt(savedBathing));
          if (savedDressing) setDressingRank(parseInt(savedDressing));
          if (savedAmbulation) setAmbulationTransfersRank(parseInt(savedAmbulation));
          if (savedParamedical) setHasParamedical(savedParamedical === 'true');
          if (savedParamedicalHours) setParamedicalHours(parseFloat(savedParamedicalHours));
          if (savedParamedicalDesc) setParamedicalDesc(savedParamedicalDesc);
          if (savedSupervision) setRequiresSupervision(savedSupervision === 'true');
          if (savedWage) setIhssWage(parseFloat(savedWage));
          if (savedRecipientCount) setRecipientCount(parseInt(savedRecipientCount));
          if (savedMonthlyHours1) setMonthlyHours1(parseInt(savedMonthlyHours1));
          if (savedMonthlyHours2) setMonthlyHours2(parseInt(savedMonthlyHours2));
          if (savedMonthlyHours3) setMonthlyHours3(parseInt(savedMonthlyHours3));
          if (savedTravelHours) setWeeklyTravelHours(parseFloat(savedTravelHours));
          if (savedSchedule) setSchedule(JSON.parse(savedSchedule));
        } catch {}

        // 5. Hydrate Financial & Deeming parameters
        try {
          const savedSavings = localStorage.getItem(`wealth_savings_${currentChild.id}`);
          const savedSource = localStorage.getItem(`wealth_source_${currentChild.id}`);
          const savedBalance = localStorage.getItem(`wealth_balance_${currentChild.id}`);
          const savedTimeline = localStorage.getItem(`wealth_timeline_${currentChild.id}`);
          const savedRcClient = localStorage.getItem(`deeming_rc_client_${currentChild.id}`);
          const savedDiag = localStorage.getItem(`deeming_diagnosis_${currentChild.id}`);
          const savedLimit = localStorage.getItem(`deeming_limit_${currentChild.id}`);
          const savedMedNeeds = localStorage.getItem(`deeming_med_needs_${currentChild.id}`);
          const savedChildMediCal = localStorage.getItem(`deeming_child_medical_${currentChild.id}`);
          const savedFamSize = localStorage.getItem(`deeming_family_size_${currentChild.id}`);
          const savedGrossIncome = localStorage.getItem(`deeming_gross_income_${currentChild.id}`);
          const savedRcChildren = localStorage.getItem(`deeming_rc_children_${currentChild.id}`);

          if (savedSavings) setSavingsAmount(parseInt(savedSavings));
          if (savedSource) setFundingSource(savedSource as 'parents' | 'inheritance' | 'child-injury');
          if (savedBalance) setExpectedBalance(savedBalance as 'low' | 'mid' | 'high');
          if (savedTimeline) setSpendingTimeline(savedTimeline as 'immediate' | 'longterm' | 'mixed');
          if (savedRcClient) setIsRcClient(savedRcClient === 'true');
          if (savedDiag) setHasDiagnosis(savedDiag === 'true');
          if (savedLimit) setMajorLimitations(parseInt(savedLimit));
          if (savedMedNeeds) setHasMedicalNeeds(savedMedNeeds === 'true');
          if (savedChildMediCal) setChildMediCal(savedChildMediCal === 'true');
          if (savedFamSize) setFamilySize(parseInt(savedFamSize));
          if (savedGrossIncome) setGrossIncome(parseInt(savedGrossIncome));
          if (savedRcChildren) setRcChildren(parseInt(savedRcChildren));
        } catch {}

        // 6. Hydrate customized Appeals form overrides
        try {
          // Pre-hydrate default appeals info with child's info
          setChildName(currentChild.nickname);
          setChildDob(currentChild.dob);
          setIepSubmissionDate(new Date().toISOString().split('T')[0]);

          const savedParentName = localStorage.getItem('caregiver_name') || localStorage.getItem('funding_parent_name');
          const savedParentEmail = localStorage.getItem('caregiver_email');
          const savedParentPhone = localStorage.getItem('caregiver_phone') || localStorage.getItem('funding_parent_phone');
          const savedParentAddress = localStorage.getItem('caregiver_address');
          const savedCoordName = localStorage.getItem(`funding_coordinator_name_${currentChild.id}`);

          if (savedParentName) setParentName(savedParentName);
          if (savedParentEmail) setParentEmail(savedParentEmail);
          if (savedParentPhone) setParentPhone(savedParentPhone);
          if (savedParentAddress) setParentAddress(savedParentAddress);
          if (savedCoordName) setCoordinatorName(savedCoordName);
        } catch {}
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentChild, savedIepData, savedRespiteData]);

  // Save Safety Log incidents to localStorage
  useEffect(() => {
    if (currentChild && safetyLogHydrated) {
      localStorage.setItem(`ihss_safety_log_${currentChild.id}`, JSON.stringify(incidents));
    }
  }, [incidents, currentChild, safetyLogHydrated]);

  // Save IHSS parameters to localStorage
  useEffect(() => {
    if (currentChild) {
      localStorage.setItem(`ihss_feeding_rank_${currentChild.id}`, feedingRank.toString());
      localStorage.setItem(`ihss_bowel_rank_${currentChild.id}`, bowelBladderRank.toString());
      localStorage.setItem(`ihss_bathing_rank_${currentChild.id}`, bathingOralRank.toString());
      localStorage.setItem(`ihss_dressing_rank_${currentChild.id}`, dressingRank.toString());
      localStorage.setItem(`ihss_ambulation_rank_${currentChild.id}`, ambulationTransfersRank.toString());
      localStorage.setItem(`ihss_has_paramedical_${currentChild.id}`, hasParamedical.toString());
      localStorage.setItem(`ihss_paramedical_hours_${currentChild.id}`, paramedicalHours.toString());
      localStorage.setItem(`ihss_paramedical_desc_${currentChild.id}`, paramedicalDesc);
      localStorage.setItem(`ihss_requires_supervision_${currentChild.id}`, requiresSupervision.toString());
      localStorage.setItem(`ihss_wage_${currentChild.id}`, ihssWage.toString());
      localStorage.setItem(`ihss_recipient_count_${currentChild.id}`, recipientCount.toString());
      localStorage.setItem(`ihss_monthly_hours_1_${currentChild.id}`, monthlyHours1.toString());
      localStorage.setItem(`ihss_monthly_hours_2_${currentChild.id}`, monthlyHours2.toString());
      localStorage.setItem(`ihss_monthly_hours_3_${currentChild.id}`, monthlyHours3.toString());
      localStorage.setItem(`ihss_travel_hours_${currentChild.id}`, weeklyTravelHours.toString());
      localStorage.setItem(`ihss_schedule_grid_${currentChild.id}`, JSON.stringify(schedule));
    }
  }, [
    currentChild, feedingRank, bowelBladderRank, bathingOralRank, dressingRank, 
    ambulationTransfersRank, hasParamedical, paramedicalHours, paramedicalDesc, 
    requiresSupervision, ihssWage, recipientCount, monthlyHours1, monthlyHours2, 
    monthlyHours3, weeklyTravelHours, schedule
  ]);

  // Save Financial Planning & Deeming to localStorage
  useEffect(() => {
    if (currentChild) {
      localStorage.setItem(`wealth_savings_${currentChild.id}`, savingsAmount.toString());
      localStorage.setItem(`wealth_source_${currentChild.id}`, fundingSource);
      localStorage.setItem(`wealth_balance_${currentChild.id}`, expectedBalance);
      localStorage.setItem(`wealth_timeline_${currentChild.id}`, spendingTimeline);
      localStorage.setItem(`deeming_rc_client_${currentChild.id}`, isRcClient.toString());
      localStorage.setItem(`deeming_diagnosis_${currentChild.id}`, hasDiagnosis.toString());
      localStorage.setItem(`deeming_limit_${currentChild.id}`, majorLimitations.toString());
      localStorage.setItem(`deeming_med_needs_${currentChild.id}`, hasMedicalNeeds.toString());
      localStorage.setItem(`deeming_child_medical_${currentChild.id}`, childMediCal.toString());
      localStorage.setItem(`deeming_family_size_${currentChild.id}`, familySize.toString());
      localStorage.setItem(`deeming_gross_income_${currentChild.id}`, grossIncome.toString());
      localStorage.setItem(`deeming_rc_children_${currentChild.id}`, rcChildren.toString());
    }
  }, [
    currentChild, savingsAmount, fundingSource, expectedBalance, spendingTimeline,
    isRcClient, hasDiagnosis, majorLimitations, hasMedicalNeeds, childMediCal,
    familySize, grossIncome, rcChildren
  ]);

  // Save Appeals / contact data overrides to global localStorage
  useEffect(() => {
    localStorage.setItem('caregiver_name', parentName);
    localStorage.setItem('caregiver_email', parentEmail);
    localStorage.setItem('caregiver_phone', parentPhone);
    localStorage.setItem('caregiver_address', parentAddress);
    if (currentChild) {
      localStorage.setItem(`funding_coordinator_name_${currentChild.id}`, coordinatorName);
    }
  }, [parentName, parentEmail, parentPhone, parentAddress, coordinatorName, currentChild]);

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

    const timer = setTimeout(() => {
      setCustomSubject(subjectText);
      setCustomBody(bodyText);
    }, 0);
    return () => clearTimeout(timer);
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

  // ----------------------------------------------------
  // Financial, Deeming & Appeals Calculators & Helpers
  // ----------------------------------------------------
  const exceedsSsiLimit = savingsAmount > 2000;
  const exceedsCalableSsiLimit = savingsAmount > 100000;

  const getWealthRecommendation = () => {
    if (fundingSource === 'child-injury') {
      return {
        title: 'First-Party Special Needs Trust (SNT) with optional CalABLE wrapper',
        desc: 'Since funds belong directly to the child (e.g. lawsuit settlement or direct inheritance), a First-Party SNT is legally mandated to protect benefits. You can transfer up to $18,000 annually from the trust into a CalABLE account to facilitate tax-free daily spending without trustee signatures.',
        recoveryNote: 'Note: First-Party SNTs require a Medicaid state-recovery provision upon the beneficiary\'s passing.'
      };
    }

    if (expectedBalance === 'high' || fundingSource === 'inheritance') {
      return {
        title: 'Third-Party Special Needs Trust (Master Trust) + CalABLE account combination',
        desc: 'This is the gold-standard setup. For balances exceeding $100,000 or funds originating from extended family wills/wills, establish a Third-Party SNT. This protects the estate from Medicaid recovery. Supplement this by transferring funds into a CalABLE account for daily disability expenditures (QDEs) to maximize flexibility.',
        recoveryNote: 'Third-Party SNTs have no Medicaid clawback provisions. Unused funds pass directly to secondary heirs.'
      };
    }

    return {
      title: 'Direct CalABLE Account (Standalone)',
      desc: 'For expected savings under $100,000 primarily funded by parents or wages, a CalABLE account is the most cost-effective and immediate tool. It takes 15 minutes to open online, carries minimal fees, and allows the child or parents to spend money directly using a debit card for Qualified Disability Expenses.',
      recoveryNote: 'California has outlawed Medicaid estate recovery on CalABLE accounts for residents, making it highly safe.'
    };
  };

  const calculateFplInfo = () => {
    const baseFpl = 15060 + (familySize - 1) * 5380;
    const threshold400 = baseFpl * 4;
    const fplRatio = (grossIncome / baseFpl) * 100;
    let copayPct = 0;
    
    if (fplRatio >= 400 && fplRatio < 500) copayPct = 10;
    else if (fplRatio >= 500 && fplRatio < 600) copayPct = 20;
    else if (fplRatio >= 600 && fplRatio < 700) copayPct = 40;
    else if (fplRatio >= 700 && fplRatio < 800) copayPct = 60;
    else if (fplRatio >= 800 && fplRatio < 900) copayPct = 80;
    else if (fplRatio >= 900) copayPct = 100;

    if (rcChildren > 1 && copayPct > 0) {
      copayPct = Math.round(copayPct / 2);
    }

    const isExemptIncome = grossIncome < threshold400;
    const isFullyExempt = isExemptIncome || childMediCal;

    return {
      baseFpl,
      threshold400: Math.round(threshold400),
      fplRatio: Math.round(fplRatio),
      copayPct: isFullyExempt ? 0 : copayPct,
      afpfFee: isFullyExempt ? 0 : 150,
      isFullyExempt
    };
  };

  const getDeemingRecommendation = () => {
    if (!isRcClient) {
      if (hasMedicalNeeds) {
        return {
          path: 'Home & Community-Based Alternatives (HCBA) Waiver Pathway',
          desc: 'Your child does not receive Regional Center services, but has complex medical/nursing needs. They are a strong candidate for the California HCBA Waiver (nursing level of care). This waiver completely bypasses parental income, giving the child full Medi-Cal.',
          action: 'Contact a local HCBA Waiver agency (e.g. Libertana, Partners in Care) in your county to request an intake assessment.'
        };
      }
      return {
        path: 'Regional Center (Lanterman Act) Intake Pathway',
        desc: 'Institutional Deeming is primarily processed for active Regional Center clients. To qualify, your child must first undergo a Regional Center intake to establish Lanterman Act eligibility.',
        action: 'Request an intake assessment at your county\'s Regional Center.'
      };
    }

    if (majorLimitations >= 3 && hasDiagnosis) {
      return {
        path: 'Lanterman Medicaid HCBS Waiver (Institutional Deeming)',
        desc: 'Based on your child\'s active Regional Center status and functional limitations in 3+ major life activities, they are highly eligible for the Lanterman Medicaid Waiver. Parental income is 100% bypassed, granting the child full Medi-Cal regardless of your family earnings.',
        action: 'Email your Service Coordinator directly and request the Medicaid Waiver Deeming packet. Once approved, the child qualifies for full Medi-Cal with zero parent premium copays.'
      };
    }

    return {
      path: 'Regional Center Reassessment Pathway',
      desc: 'Institutional Deeming requires the client to meet Intermediate Care Facility (ICF-DD) criteria, which includes functional limitations in at least 3 of 7 major life activities (self-care, communication, learning, mobility, self-direction, capacity for independent living, economic self-sufficiency).',
      action: 'Request an IPP meeting with your coordinator to discuss your child\'s escalating limitations in communication, self-care, or safety supervision.'
    };
  };

  const compileDeemingLetter = () => {
    return `Subject: Request for Medicaid Waiver (Institutional Deeming) Enrollment - ${childName}

Dear ${coordinatorName || 'Service Coordinator'},

I hope this email finds you well. I am writing to request that the Regional Center initiate the process to enroll my child, ${childName} (DOB: ${childDob}), in the Lanterman Medicaid Waiver (Institutional Deeming).

As a Regional Center client, ${childName} exhibits significant functional limitations in three or more major life activities (specifically in areas including self-care, self-direction, communication, and learning). Under federal and California DHCS guidelines, these limitations satisfy the ICF-DD level of care required for the HCBS Waiver.

Enrollment in this waiver is crucial for our family as it bypasses parental income limitations, granting ${childName} eligibility for Medi-Cal. This will enable access to essential medical services, behavioral therapies, and equipment necessary for support in our home.

Please let me know what documentation is required to submit the Medicaid Waiver Deeming packet.

Thank you,
${parentName}
${parentPhone}`;
  };

  // Pre-calculate Child Age in Years for Appeals
  const getChildAgeForAppeals = () => {
    if (!childDob) return 0;
    const today = new Date();
    const dob = new Date(childDob);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };
  
  const calculateDateOffset = (baseDateStr: string, offsetDays: number) => {
    if (!baseDateStr) return 'N/A';
    try {
      const date = new Date(baseDateStr + 'T00:00:00');
      date.setDate(date.getDate() + offsetDays);
      return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // Compile letter draft dynamically
  const compileAppealLetterText = (): string => {
    const todayStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    switch (activeTemplate) {
      case 'iep-request': {
        const concernsList: string[] = [];
        if (iepConcerns.speech) concernsList.push('Speech/Language development and expressive communication delays');
        if (iepConcerns.sensory) concernsList.push('Sensory integration and processing disorders');
        if (iepConcerns.academic) concernsList.push('Significant learning difficulties and pre-academic struggles');
        if (iepConcerns.fineMotor) concernsList.push('Fine/gross motor skill delays and occupational support needs');
        if (iepConcerns.social) concernsList.push('Social communication and peer interaction barriers');
        if (iepConcerns.behavioral) concernsList.push('Behavioral struggles and emotional regulation difficulties');

        return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

To:
Director of Special Education / IEP Intake Department
${schoolDistrict}

Re: Written Request for Initial Special Education Assessment
Child Name: ${childName}
Child Date of Birth: ${childDob} (Age: ${getChildAgeForAppeals()})
School: ${schoolName}

Dear Director of Special Education and IEP Team,

I am writing as the parent/caregiver of ${childName} to formally request a comprehensive educational assessment to determine eligibility for special education and related services under the Individuals with Disabilities Education Act (IDEA) and California Education Code. 

I suspect ${childName} has a disability that is negatively impacting their ability to access the general education curriculum. Specifically, ${childName} is exhibiting significant challenges in the following areas:
${concernsList.map(c => `- ${c}`).join('\n')}

Supporting details regarding my child's observed challenges:
${customIepText}

In accordance with California Education Code Section 56321, please provide me with an Assessment Plan within the legally mandated 15-day timeline from receipt of this request. I request that the assessment cover all areas of suspected disability, which may include Psychoeducational (Cognitive/Academic), Speech and Language, Occupational Therapy (OT/Fine Motor), Physical Therapy (PT/Gross Motor), and Functional Behavior (FBA) assessments.

I look forward to receiving the Assessment Plan within the statutory 15 days so that we can schedule the initial IEP meeting within the 60-day calendar limit (California Education Code § 56344) to collaborate on an educational program that matches ${childName}'s needs.

Sincerely,

[Signature]

${parentName}`;
      }

      case 'ihss-appeal': {
        const safetyList: string[] = [];
        if (ihssSafetyConcerns.elopement) safetyList.push('Severe elopement/wandering behaviors (running away into dangerous traffic zones, lakes, or woods)');
        if (ihssSafetyConcerns.pica) safetyList.push('Pica (ingesting dangerous non-food objects like soil, gravel, plastics, or coins)');
        if (ihssSafetyConcerns.selfInjury) safetyList.push('Self-injurious behaviors (head-banging, scratching, wrist-biting, or skin-picking)');
        if (ihssSafetyConcerns.climbing) safetyList.push('High-risk climbing behavior (scaling shelves, doors, or counters without safety awareness)');
        if (ihssSafetyConcerns.electricalSafety) safetyList.push('Severe lack of safety awareness around electrical outlets, open flames, or kitchen appliances');

        return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

To:
State Hearings Division
California Department of Social Services
744 P Street, M.S. 21-97
Sacramento, CA 95814

Re: Request for Fair Hearing / Appeal of IHSS Notice of Action
Recipient: ${childName}
Date of Birth: ${childDob} (Age: ${getChildAgeForAppeals()})
County: ${ihssCounty}
Date of Denial/Reduction Notice: ${ihssDenialDate}

To Whom It May Concern,

I am writing to formally request a Fair Hearing to appeal the Notice of Action dated ${ihssDenialDate} regarding In-Home Supportive Services (IHSS) benefits for my minor child, ${childName}. The county has denied or reduced hours for my child under the category of Protective Supervision.

I dispute the county's determination. Under Welfare and Institutions Code Section 12300 and California Department of Social Services Manual of Policies and Procedures (MPP) Section 30-757.17, my child qualifies for Protective Supervision due to severe mental impairment and a complete lack of safety awareness. 

${childName} exhibits dangerous behaviors that require 24/7 active safety monitoring to prevent severe self-harm or accidental death. Specifically, these behaviors include:
${safetyList.map(s => `- ${s}`).join('\n')}

Clinical details of safety hazards and oversight demands:
${customIhssText}

Contrary to the social worker's assessment, my child's behaviors are not simple tantrums, nor is this standard supervision typical of a child of this age. My child's developmental and cognitive delays prevent them from recognizing hazard. Without constant protective monitoring, my child is at critical risk of injury. 

I request a fair hearing to present medical records, school logs, and a 24-hour safety behavior log confirming that my child meets MPP 30-757 protective criteria. Please schedule this appeal and notify me of the date and location.

Sincerely,

[Signature]

${parentName}`;
      }

      case 'rc-appeal': {
        const limitsList: string[] = [];
        if (rcLimitations.receptiveLanguage) limitsList.push('Receptive Language: Child struggles to understand basic verbal instructions or warnings.');
        if (rcLimitations.expressiveLanguage) limitsList.push('Expressive Language: Child has severe verbal communication deficits or is fully non-verbal.');
        if (rcLimitations.learning) limitsList.push('Learning: Child has severe cognitive delays and educational barriers.');
        if (rcLimitations.mobility) limitsList.push('Mobility: Child has developmental motor planning and physical barriers.');
        if (rcLimitations.selfCare) limitsList.push('Self-Care: Child requires assistance for basic ADLs (feeding, toileting, dressing) far beyond peer averages.');
        if (rcLimitations.selfDirection) limitsList.push('Self-Direction: Child cannot navigate safety parameters, has wandering behaviors, and lacks safety boundaries.');

        return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

To:
Intake Appeal Coordinator
${regionalCenterName}

Re: Formal Appeal of Regional Center Eligibility Denial
Child Name: ${childName}
Date of Birth: ${childDob} (Age: ${getChildAgeForAppeals()})
Date of Denial Notice: ${rcDenialDate}

Dear Appeal Coordinator,

I am writing to formally appeal the determination of eligibility denial dated ${rcDenialDate} regarding my child, ${childName}, under the Lanterman Developmental Disabilities Services Act. The Regional Center has determined that my child does not qualify as developmentally disabled.

I dispute this finding. My child has a diagnosed condition of ${rcDiagnosis}, which constitutes a developmental disability under California Welfare and Institutions Code Section 4512. This condition originated before the age of 18, is expected to continue indefinitely, and constitutes a substantial disability.

Under Welfare and Institutions Code § 4512(l), a substantial disability is defined as significant functional limitations in three or more areas of major life activity. ${childName} exhibits severe functional limitations in the following domains:
${limitsList.map(l => `- ${l}`).join('\n')}

Supporting details regarding my child's developmental limitations:
${customRcText}

I request an informal meeting with the Regional Center intake director, and if necessary, a formal Fair Hearing to present diagnostic records, psychological evaluations, and IEP reports confirming my child's eligibility. 

Under Lanterman Act rules, I submit this appeal within the statutory 30-day window from the receipt of the denial notice. Please schedule an appeal review and contact me to arrange an informal conference.

Sincerely,

[Signature]

${parentName}`;
      }

      case 'ssi-reconsideration': {
        return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

To:
Social Security Administration / Disability Determination Services

Re: Written Request for Reconsideration of Childhood Disability Denial
Claimant Name: ${childName}
Claimant Date of Birth: ${childDob} (Age: ${getChildAgeForAppeals()})
Claimant SSN: [Insert Child's SSN here]
Date of denial notice: ${ssiDate}

To Whom It May Concern,

I am writing to request a Reconsideration of the disability denial notice dated ${ssiDate} regarding Supplemental Security Income (SSI) childhood disability benefits for my child, ${childName}.

I dispute the Social Security Administration's finding that my child's impairment does not meet, medically equal, or functionally equal the listings in the Listing of Impairments. My child has a severe clinical diagnosis of: ${ssiDiagnosis}.

This impairment causes marked and severe functional limitations. Specifically, my child exhibits extreme difficulties in social-emotional functioning, communication, and self-care, satisfying the requirements of SSA Childhood Disability Listings (e.g. Listing 112.10 for Autism Spectrum Disorder).

Clinical descriptions and treating specialist evaluations:
${customSsiText}
Treating Clinical Location: ${ssiClinicInfo}

I submit that the original evaluation failed to consider the full extent of my child's daily care demands, school report cards, and therapy notes. I request a review of all clinical evidence, including the new evaluations and IEP reports which I have enclosed with this request.

Please review this claim and contact me if any further consultative medical examinations are required.

Sincerely,

[Signature]

${parentName}`;
      }

      case 'epsdt-therapy': {
        return `Date: ${todayStr}

From:
${parentName}
${parentAddress}
${parentPhone}
${parentEmail}

To:
Appeals and Grievance Department
${insurancePlanName}

Re: Expedited Appeal of Therapy Authorization Denial / Mandate under EPSDT
Member Name: ${childName}
Member Date of Birth: ${childDob} (Age: ${getChildAgeForAppeals()})
Member ID: [Insert Member ID]
Service Denied: ${therapyType}
Reason for Denial: ${denialReason}

To Whom It May Concern,

I am writing to formally appeal the denial of coverage for ${therapyType} recommended for my child, ${childName}, by their treating clinician, ${prescribingDoctor}. The plan has denied coverage citing: "${denialReason}".

I dispute this denial under federal Medicaid EPSDT mandates and California state law. Specifically, under 42 U.S.C. Section 1396d(r)(5), the federal Medicaid program requires states to provide "early and periodic screening, diagnostic, and treatment services" (EPSDT) to determine physical or mental illnesses or conditions, and provide "necessary health care, diagnostic services, treatment, and other measures... to correct or ameliorate defects and physical and mental illnesses and conditions."

Under California Title 22 Code of Regulations Section 51340, services must be authorized if they are necessary to correct or "ameliorate" a developmental condition. Ameliorate includes maintaining the child's level of functioning or preventing deterioration. 

Denying clinical therapy on the grounds that it is "not rehabilitative" or that it "excludes developmental conditions" is a direct violation of the EPSDT federal mandate. My child requires this therapy as specified below:

${customTherapyText}

I have enclosed a letter of medical necessity from ${prescribingDoctor} confirming that these services are medically necessary. I request that ${insurancePlanName} immediately overturn this denial and authorize the requested sessions.

Under California health plan rules, I request that this grievance be processed on an expedited basis as the ongoing delay in development constitutes a risk of permanent functional loss.

Sincerely,

[Signature]

${parentName}`;
      }

      default:
        return '';
    }
  };

  // ----------------------------------------------------
  // IHSS Safety Log Journal Helpers
  // ----------------------------------------------------
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
    setDetails('');
    setIntervention('');
  };

  const handleDeleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const getCriticalCount = () => incidents.filter(i => i.riskLevel === 'critical').length;
  const getMediumCount = () => incidents.filter(i => i.riskLevel === 'medium').length;

  // IHSS Hours Computations
  const feedingHours = [0, 1.5, 3.5, 6.0, 8.5][feedingRank - 1] || 0;
  const bowelHours = [0, 1.5, 3.0, 5.0, 7.0][bowelBladderRank - 1] || 0;
  const bathingHours = [0, 0.75, 1.5, 2.75, 4.5][bathingOralRank - 1] || 0;
  const dressingHours = [0, 1.0, 2.25, 3.75, 5.25][dressingRank - 1] || 0;
  const ambulationHours = [0, 1.0, 2.25, 3.75, 5.25][ambulationTransfersRank - 1] || 0;
  const paramedicalVal = hasParamedical ? paramedicalHours : 0;

  const totalWeeklyPersonalCare = feedingHours + bowelHours + bathingHours + dressingHours + ambulationHours + paramedicalVal;
  const isSeverelyImpaired = totalWeeklyPersonalCare >= 20;

  const monthlyPersonalCareHours = Math.round(totalWeeklyPersonalCare * 4.33 * 10) / 10;
  
  let protectiveSupervisionHours = 0;
  if (requiresSupervision) {
    protectiveSupervisionHours = isSeverelyImpaired ? 283 : 195;
  }

  const totalMonthlyHours = Math.round((monthlyPersonalCareHours + protectiveSupervisionHours) * 10) / 10;
  const estimatedMonthlyPayout = Math.round(totalMonthlyHours * ihssWage * 100) / 100;

  const compileCaseworkerHandout = () => {
    return `IHSS FUNCTIONAL INDEX & SAFETY ADVOCACY HANDOUT
Recipient Name: ${currentChild?.nickname || childName}
Parent / Caregiver: ${parentName}
Date of Evaluation: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

This document summarizes the caregiver's daily assistance needs and functional index rankings compiled in preparation for the county social worker's in-home assessment.

ESTIMATED FUNCTIONAL SCORES & TIMES:
- Feeding: Rank ${feedingRank} (${feedingHours} hours/week)
- Bowel & Bladder Care: Rank ${bowelBladderRank} (${bowelHours} hours/week)
- Bathing & Oral Hygiene: Rank ${bathingOralRank} (${bathingHours} hours/week)
- Dressing & Undressing: Rank ${dressingRank} (${dressingHours} hours/week)
- Ambulation & Transfers: Rank ${ambulationTransfersRank} (${ambulationHours} hours/week)
${hasParamedical ? `- Paramedical Care: ${paramedicalHours} hours/week (${paramedicalDesc})\n` : ''}
TOTAL ESTIMATED PERSONAL CARE SERVICES: ${totalWeeklyPersonalCare.toFixed(2)} Hours/Week (${monthlyPersonalCareHours.toFixed(1)} Hours/Month)

SEVERELY IMPAIRED (SI) CLASSIFICATION:
Under CDSS MPP Section 30-701(s)(1), a recipient is classified as "Severely Impaired" if they require 20 or more hours per week of personal care services and paramedical care.
- Result: ${isSeverelyImpaired ? 'SEVERELY IMPAIRED STATUS MET' : 'NON-SEVERELY IMPAIRED STATUS'} (Total hours: ${totalWeeklyPersonalCare.toFixed(2)} hours/week)

PROTECTIVE SUPERVISION REQUIREMENT:
${requiresSupervision ? `The recipient exhibits severe cognitive and developmental impairments that prevent danger awareness, presenting constant safety risks (elopement, pica, head-banging). 24/7 Protective Supervision is requested.
- Allocation: ${isSeverelyImpaired ? '283 Hours/Month (Severely Impaired Limit)' : '195 Hours/Month (Non-Severely Impaired Limit)'}` : 'Protective supervision not requested.'}`;
  };

  const compileOvertimeReport = () => {
    const weekly1 = Math.round((monthlyHours1 / 4.33) * 10) / 10;
    const weekly2 = Math.round((monthlyHours2 / 4.33) * 10) / 10;
    const weekly3 = Math.round((monthlyHours3 / 4.33) * 10) / 10;
    
    let totalWeeklyAuth = weekly1;
    if (recipientCount >= 2) totalWeeklyAuth += weekly2;
    if (recipientCount >= 3) totalWeeklyAuth += weekly3;

    const limit = recipientCount > 1 ? 66 : 70;
    const isOverCap = totalWeeklyAuth > limit;
    
    const regularHours = Math.min(40, totalWeeklyAuth);
    const overtimeHours = Math.max(0, totalWeeklyAuth - 40);

    const regularPay = regularHours * ihssWage;
    const overtimePay = overtimeHours * (ihssWage * 1.5);
    const travelPay = weeklyTravelHours * ihssWage;
    
    const totalWeeklyPay = regularPay + overtimePay + travelPay;
    const totalMonthlyPay = totalWeeklyPay * 4.33;

    const parts = [
      "IHSS MULTI-RECIPIENT SCHEDULE & OVERTIME COMPLIANCE REPORT",
      "Provider Name: " + parentName,
      "Log Date: " + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      "Hourly Wage: $" + ihssWage.toFixed(2) + "/hour",
      "",
      "I. AUTHORIZED HOURS BREAKDOWN",
      "- Recipient 1: " + monthlyHours1 + " hours/month (~" + weekly1 + " hours/week)",
      recipientCount >= 2 ? "- Recipient 2: " + monthlyHours2 + " hours/month (~" + weekly2 + " hours/week)" : "",
      recipientCount >= 3 ? "- Recipient 3: " + monthlyHours3 + " hours/month (~" + weekly3 + " hours/week)" : "",
      "TOTAL WEEKLY AUTHORIZED HOURS: " + totalWeeklyAuth.toFixed(1) + " hours/week",
      "",
      "II. COMPLIANCE STATUS & CAPS (W&I Code § 12301.15)",
      "- Provider Cap Rule: " + (recipientCount > 1 ? '66 hours/week (Multi-Recipient Cap)' : '70 hours/week (Single Recipient Exemption Limit)'),
      "- Combined Weekly Workweek: " + totalWeeklyAuth.toFixed(1) + " hours/week",
      "- Compliance Status: " + (isOverCap ? 'WARNING: EXCEEDS WEEKLY WORK CAP' : 'COMPLIANT (Within work cap bounds)'),
      "- Authorized Weekly Travel Time: " + weeklyTravelHours + " hours/week (Max allowed: 7 hours/week)",
      "",
      "III. ESTIMATED WEEKLY & MONTHLY EARNINGS",
      "- Regular Hours: " + regularHours.toFixed(1) + " hrs @ $" + ihssWage.toFixed(2) + "/hr = $" + regularPay.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      "- Overtime Hours (1.5x): " + overtimeHours.toFixed(1) + " hrs @ $" + (ihssWage * 1.5).toFixed(2) + "/hr = $" + overtimePay.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      "- Travel Hours (Regular): " + weeklyTravelHours + " hrs @ $" + ihssWage.toFixed(2) + "/hr = $" + travelPay.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      "TOTAL PROJECTED WEEKLY INCOME: $" + totalWeeklyPay.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      "TOTAL PROJECTED MONTHLY INCOME (4.33 conversion): $" + totalMonthlyPay.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " (Tax-Free)",
      "",
      "This workweek schedule is compiled in accordance with CDSS Welfare & Institutions Code Section 12301.15 rules to prevent workweek violations while maximizing authorized recipient hours."
    ];

    return parts.filter(p => p !== "").join("\n");
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

To: IHSS Social Work Supervisor
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

  return (
    <main className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '1150px' }}>
      <div className="no-print">
      
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
                  {currentChild.nickname}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><Calendar size={14} /> Age: {childAgeText}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={14} /> {counties.find(c => c.id === currentChild.county_id)?.name || currentChild.county_id}</span>
                  <span style={{ background: 'rgba(var(--primary-rgb), 0.08)', color: 'var(--primary-color)', padding: '0.1rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>
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
                    <span style={{ fontSize: '0.75rem', background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary-color)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>
                      🔵 {savedStatuses.filter(s => s.status === 'applied').length} Applied
                    </span>
                  )}
                  {selectedAccommodations.length > 0 && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(var(--primary-rgb), 0.05)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 500 }}>
                      📝 {selectedAccommodations.length} IEP Accommodations
                    </span>
                  )}
                  {respiteResults.score > 0 && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(var(--primary-rgb), 0.05)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 500 }}>
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
              <Landmark size={18} /> DDS & Financial
            </button>

            <button 
              onClick={() => setActiveTab('ihss')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'ihss' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'ihss' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <ShieldAlert size={18} /> IHSS & Overtime
            </button>

            <button 
              onClick={() => setActiveTab('appeals')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'appeals' ? '3px solid var(--primary-color)' : '3px solid transparent', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'appeals' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <Scale size={18} /> Appeals & Letters
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
                      Check accommodations to request in your child&apos;s classroom.
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
                              background: isChecked ? 'rgba(var(--primary-rgb), 0.03)' : 'rgba(255,255,255,0.4)',
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
                            background: isAdded ? 'rgba(var(--primary-rgb), 0.02)' : 'var(--glass-bg)'
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
                            &quot;{getGoalPreviewText(goal)}&quot;
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
                          background: 'rgba(var(--primary-rgb),0.08)',
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
              <div className="animate-fade-in">
                {/* Sub-Tabs Switcher */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto' }} className="no-print">
                  <button
                    onClick={() => setSdpSubTab('respite')}
                    className={`tab-btn ${sdpSubTab === 'respite' ? 'active' : ''}`}
                    style={{
                      background: sdpSubTab === 'respite' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
                      color: sdpSubTab === 'respite' ? '#ffffff' : 'var(--text-main)',
                      border: '1px solid var(--glass-border)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Respite Estimator
                  </button>
                  <button
                    onClick={() => setSdpSubTab('sdp')}
                    className={`tab-btn ${sdpSubTab === 'sdp' ? 'active' : ''}`}
                    style={{
                      background: sdpSubTab === 'sdp' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
                      color: sdpSubTab === 'sdp' ? '#ffffff' : 'var(--text-main)',
                      border: '1px solid var(--glass-border)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    SDP Budget Planner
                  </button>
                  <button
                    onClick={() => setSdpSubTab('eligibility')}
                    className={`tab-btn ${sdpSubTab === 'eligibility' ? 'active' : ''}`}
                    style={{
                      background: sdpSubTab === 'eligibility' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
                      color: sdpSubTab === 'eligibility' ? '#ffffff' : 'var(--text-main)',
                      border: '1px solid var(--glass-border)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Asset & Deeming Helper
                  </button>
                </div>

                {sdpSubTab === 'respite' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
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

                {sdpSubTab === 'sdp' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }} className="iep-grid-layout">
                    {/* Left Column: Budget & Spending Plan Builders */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {/* Budget Formulation */}
                      <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                          <Calculator size={20} color="var(--primary-color)" /> SDP Individual Budget Formulation
                        </h2>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                          Calculate your proposed SDP Individual Budget (IB) by inputting your prior 12 months of traditional services POS expenditures and adding unmet needs or changes in circumstances.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          {/* Historical POS spend */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', alignItems: 'center' }}>
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.9rem' }}>Prior 12-Month POS Expenditures</strong>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Total spent by Regional Center on services under traditional model.</span>
                            </div>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <input
                                type="number"
                                min="0"
                                value={posSpend}
                                onChange={(e) => setPosSpend(Math.max(0, parseInt(e.target.value) || 0))}
                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', width: '100%' }}
                              />
                            </div>
                          </div>

                          {/* Unmet Needs List */}
                          <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Adjustments & Unmet Needs</h3>
                            
                            {unmetNeeds.length === 0 ? (
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>No unmet needs listed. Add one below.</p>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                {unmetNeeds.map(need => {
                                  const cost = need.costType === 'flat' ? need.flatAmount : (need.hourlyRate * need.hoursPerWeek * need.durationWeeks);
                                  return (
                                    <div 
                                      key={need.id} 
                                      style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center', 
                                        background: 'rgba(0,0,0,0.02)', 
                                        padding: '0.75rem 1rem', 
                                        borderRadius: '10px', 
                                        border: '1px solid rgba(0,0,0,0.05)' 
                                      }}
                                    >
                                      <div style={{ flex: 1 }}>
                                        <strong style={{ fontSize: '0.88rem', display: 'block' }}>{need.name}</strong>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                          {need.costType === 'flat' 
                                            ? 'Flat Cost' 
                                            : `$${need.hourlyRate}/hr × ${need.hoursPerWeek} hrs/wk × ${need.durationWeeks} weeks`}
                                        </span>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                          ${cost.toLocaleString()}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => setUnmetNeeds(prev => prev.filter(n => n.id !== need.id))}
                                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                                        >
                                          <Trash2 size={15} />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Add Unmet Need Form */}
                            <div style={{ background: 'rgba(var(--primary-rgb), 0.03)', border: '1px dashed rgba(var(--primary-rgb), 0.2)', padding: '1rem', borderRadius: '12px' }}>
                              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.75rem' }}>
                                ➕ Add Unmet Care Need / Circumstance Change
                              </span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div className="input-group" style={{ marginBottom: 0 }}>
                                  <label style={{ fontSize: '0.75rem' }}>Service or Resource Name</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Specialized Swim Safety Lessons"
                                    value={newNeedName}
                                    onChange={(e) => setNewNeedName(e.target.value)}
                                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%' }}
                                  />
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                  <div className="input-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.75rem' }}>Cost Type</label>
                                    <select
                                      value={newNeedCostType}
                                      onChange={(e) => setNewNeedCostType(e.target.value as 'hourly' | 'flat')}
                                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%' }}
                                    >
                                      <option value="flat">Flat Cost</option>
                                      <option value="hourly">Hourly Rate</option>
                                    </select>
                                  </div>
                                  {newNeedCostType === 'flat' ? (
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                      <label style={{ fontSize: '0.75rem' }}>Flat Amount ($)</label>
                                      <input
                                        type="number"
                                        value={newNeedFlatAmount}
                                        onChange={(e) => setNewNeedFlatAmount(Math.max(0, parseInt(e.target.value) || 0))}
                                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%' }}
                                      />
                                    </div>
                                  ) : (
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                      <label style={{ fontSize: '0.75rem' }}>Hourly Rate ($)</label>
                                      <input
                                        type="number"
                                        value={newNeedHourlyRate}
                                        onChange={(e) => setNewNeedHourlyRate(Math.max(0, parseInt(e.target.value) || 0))}
                                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%' }}
                                      />
                                    </div>
                                  )}
                                </div>

                                {newNeedCostType === 'hourly' && (
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                      <label style={{ fontSize: '0.75rem' }}>Hours / Week</label>
                                      <input
                                        type="number"
                                        value={newNeedHoursPerWeek}
                                        onChange={(e) => setNewNeedHoursPerWeek(Math.max(0, parseFloat(e.target.value) || 0))}
                                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%' }}
                                      />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                      <label style={{ fontSize: '0.75rem' }}>Duration (Weeks)</label>
                                      <input
                                        type="number"
                                        value={newNeedDurationWeeks}
                                        onChange={(e) => setNewNeedDurationWeeks(Math.max(0, parseInt(e.target.value) || 0))}
                                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%' }}
                                      />
                                    </div>
                                  </div>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!newNeedName.trim()) return;
                                    const needItem = {
                                      id: `unmet-${Date.now()}`,
                                      name: newNeedName,
                                      costType: newNeedCostType,
                                      hourlyRate: newNeedHourlyRate,
                                      hoursPerWeek: newNeedHoursPerWeek,
                                      durationWeeks: newNeedDurationWeeks,
                                      flatAmount: newNeedFlatAmount,
                                      justification: ''
                                    };
                                    setUnmetNeeds(prev => [...prev, needItem]);
                                    setNewNeedName('');
                                  }}
                                  className="btn-primary"
                                  style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                                >
                                  Add Adjustments
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* One time deductions */}
                          <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', alignItems: 'center' }}>
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.9rem' }}>One-Time Deductions (-)</strong>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Non-recurring service costs to subtract from historical spend.</span>
                            </div>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <input
                                type="number"
                                min="0"
                                value={oneTimeDeductions}
                                onChange={(e) => setOneTimeDeductions(Math.max(0, parseInt(e.target.value) || 0))}
                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', width: '100%' }}
                              />
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Spending Plan Builder */}
                      <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                          <Sparkles size={20} color="var(--primary-color)" /> Proposed SDP Spending Plan
                        </h2>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                          Draft your spending plan. Allocate your proposed budget across the standard DDS service categories. The FMS monthly fee is automatically allocated from your budget.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          {/* FMS Selector */}
                          <div>
                            <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>
                              Financial Management Services (FMS) Model
                            </label>
                            <select
                              value={fmsModel}
                              onChange={(e) => setFmsModel(e.target.value)}
                              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', fontSize: '0.88rem' }}
                            >
                              <option value="bill-payer">Bill Payer Model (~$150/mo | $1,800/yr)</option>
                              <option value="sole-employer">Sole Employer Model (~$200/mo | $2,400/yr)</option>
                              <option value="co-employer">Co-Employer Model (~$250/mo | $3,000/yr)</option>
                            </select>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem', lineHeight: 1.3 }}>
                              FMS is legally mandated to process payments and handle employer duties under SDP. FMS fees are paid out of your Individual Budget.
                            </p>
                          </div>

                          {/* Allocations Inputs */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem' }}>
                            {/* Community Integration */}
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Community Integration & Social Recreation</label>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>${sdpCommunity.toLocaleString()}</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max={50000}
                                step="100"
                                value={sdpCommunity}
                                onChange={(e) => setSdpCommunity(parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                              />
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>camps, social groups, sports lessons, community integration</span>
                            </div>

                            {/* Respite & Personal Care */}
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Personal Assistance & In-Home Respite</label>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>${sdpRespite.toLocaleString()}</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max={50000}
                                step="100"
                                value={sdpRespite}
                                onChange={(e) => setSdpRespite(parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                              />
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>self-hired respite workers, 1:1 behavior aides, personal assistants</span>
                            </div>

                            {/* Clinical & Therapeutic */}
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Therapeutic, Clinical & Medical Services</label>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>${sdpTherapies.toLocaleString()}</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max={50000}
                                step="100"
                                value={sdpTherapies}
                                onChange={(e) => setSdpTherapies(parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                              />
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>speech/OT/PT sessions, horse/music therapy, clinical consults</span>
                            </div>

                            {/* Equipment & Adaptations */}
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Equipment, Technology & Adaptations</label>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>${sdpEquipment.toLocaleString()}</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max={50000}
                                step="100"
                                value={sdpEquipment}
                                onChange={(e) => setSdpEquipment(parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                              />
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>adaptive strollers, sensory gyms, communication tablets, safety latches</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Sticky Budget calculation panels */}
                    <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {(() => {
                        const calculatedIB = posSpend + unmetNeeds.reduce((acc, need) => acc + (need.costType === 'flat' ? need.flatAmount : need.hourlyRate * need.hoursPerWeek * need.durationWeeks), 0) - oneTimeDeductions;
                        const fmsAnnualFee = fmsModel === 'co-employer' ? 3000 : (fmsModel === 'sole-employer' ? 2400 : 1800);
                        const totalAllocated = sdpCommunity + sdpRespite + sdpTherapies + sdpEquipment + fmsAnnualFee;
                        const remaining = calculatedIB - totalAllocated;
                        const isOverBudget = remaining < 0;

                        return (
                          <>
                            <div className="glass-panel" style={{ border: `2px solid ${isOverBudget ? '#ef4444' : 'var(--primary-color)'}`, padding: '1.25rem' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isOverBudget ? '#ef4444' : 'var(--primary-color)', textTransform: 'uppercase' }}>SDP Budget Allocation</span>
                              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.2rem', marginBottom: '0.75rem' }}>
                                Target IB: ${calculatedIB.toLocaleString()}
                              </h3>
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', margin: '0.5rem 0 1rem 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>Total Allocated:</span>
                                  <strong>${totalAllocated.toLocaleString()}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.5rem' }}>
                                  <span>FMS Fee Allocation:</span>
                                  <strong>${fmsAnnualFee.toLocaleString()}/yr</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(0,0,0,0.06)', paddingTop: '0.5rem', fontSize: '0.85rem' }}>
                                  <span>Remaining Balance:</span>
                                  <strong style={{ color: isOverBudget ? '#ef4444' : '#10b981' }}>
                                    ${remaining.toLocaleString()}
                                  </strong>
                                </div>
                              </div>

                              <button 
                                onClick={() => {
                                  alert('Spending plan draft saved locally for child ' + currentChild.nickname);
                                }}
                                className="btn-primary"
                                style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', width: '100%', background: isOverBudget ? '#64748b' : 'var(--primary-color)' }}
                                disabled={isOverBudget}
                              >
                                Save Spending Plan
                              </button>
                            </div>

                            <div className="glass-panel" style={{ padding: '1rem', fontSize: '0.8rem' }}>
                              <h5 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Self-Determination Rules</h5>
                              <p style={{ margin: 0, color: 'var(--text-light)', lineHeight: 1.4 }}>
                                You control 100% of your budget. You can hire family, direct therapy agencies, or purchase safety equipment without prior authorizations.
                              </p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {sdpSubTab === 'eligibility' && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                        <Scale size={20} color="var(--primary-color)" /> Asset Limits & Deeming Helper Tools
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.4', margin: 0 }}>
                        These helper tools help you verify Medi-Cal asset thresholds, check FCPP co-pays, and plan savings strategies to shield your benefits.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }} className="iep-grid-layout">
                      {/* Column 1: Institutional Deeming & FCPP */}
                      <div style={{ gridColumn: '1 / 7', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="grid-col-lg-6">
                        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', margin: 0 }}>
                            ⚖️ Medi-Cal Deeming & FCPP co-pays
                          </h4>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.5rem', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>RC Client Status:</span>
                              <select 
                                value={isRcClient ? 'yes' : 'no'}
                                onChange={(e) => setIsRcClient(e.target.value === 'yes')}
                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: '100%' }}
                              >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.5rem', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.6rem' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Diagnosis Verified:</span>
                              <select 
                                value={hasDiagnosis ? 'yes' : 'no'}
                                onChange={(e) => setHasDiagnosis(e.target.value === 'yes')}
                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: '100%' }}
                              >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </select>
                            </div>

                            <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.6rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-light)' }}>Life Activity Limitations:</span>
                                <strong>{majorLimitations} of 7</strong>
                              </div>
                              <input
                                type="range" min="0" max="7" value={majorLimitations}
                                onChange={(e) => setMajorLimitations(parseInt(e.target.value))}
                                style={{ width: '100%', cursor: 'pointer', height: '6px', accentColor: 'var(--primary-color)' }}
                              />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.5rem', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.6rem' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Nursing/Medical Needs:</span>
                              <select 
                                value={hasMedicalNeeds ? 'yes' : 'no'}
                                onChange={(e) => setHasMedicalNeeds(e.target.value === 'yes')}
                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: '100%' }}
                              >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.5rem', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.6rem' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Active Medi-Cal:</span>
                              <select 
                                value={childMediCal ? 'yes' : 'no'}
                                onChange={(e) => setChildMediCal(e.target.value === 'yes')}
                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: '100%' }}
                              >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.5rem', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.6rem' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Family Size:</span>
                              <input 
                                type="number" min="1" max="10" value={familySize}
                                onChange={(e) => setFamilySize(Math.max(1, parseInt(e.target.value) || 1))}
                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: '100%' }}
                              />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.5rem', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.6rem' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Gross Income:</span>
                              <input 
                                type="number" min="0" step="5000" value={grossIncome}
                                onChange={(e) => setGrossIncome(Math.max(0, parseInt(e.target.value) || 0))}
                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: '100%' }}
                              />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.5rem', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.6rem' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Regional Center Kids:</span>
                              <input 
                                type="number" min="1" max="5" value={rcChildren}
                                onChange={(e) => setRcChildren(Math.max(1, parseInt(e.target.value) || 1))}
                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: '100%' }}
                              />
                            </div>
                          </div>

                          {/* Calculations Box */}
                          {(() => {
                            const deemingRec = getDeemingRecommendation();
                            const fplInfo = calculateFplInfo();
                            return (
                              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
                                <div style={{ fontSize: '0.85rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.4rem' }}>
                                  <strong>Status:</strong> <span style={{ color: 'var(--primary-color)' }}>{deemingRec.path}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.4' }}>
                                  {deemingRec.desc}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.4rem' }}>
                                  <span>Income FPL Ratio:</span>
                                  <strong>{fplInfo.fplRatio}% FPL</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                  <span>Respite Co-Pay:</span>
                                  <strong style={{ color: fplInfo.copayPct > 0 ? '#f59e0b' : '#10b981' }}>{fplInfo.copayPct}% Fee</strong>
                                </div>
                                
                                {isRcClient && majorLimitations >= 3 && (
                                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <button 
                                      type="button"
                                      onClick={() => setShowDeemingLetter(!showDeemingLetter)}
                                      style={{
                                        width: '100%',
                                        background: 'var(--primary-color)',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0.4rem',
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {showDeemingLetter ? 'Hide Request Letter' : 'Show Request Letter'}
                                    </button>

                                    {showDeemingLetter && (
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.78rem', maxHeight: '180px', overflowY: 'auto' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '0.2rem' }}>
                                          <span>Waiver Draft Letter</span>
                                          <CopyButton text={compileDeemingLetter()} size={12} />
                                        </div>
                                        <pre style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', margin: 0, color: '#555', fontSize: '0.75rem', fontFamily: 'inherit' }}>
                                          {compileDeemingLetter()}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Column 2: Asset Shield (CalABLE / SNT) */}
                      <div style={{ gridColumn: '7 / 13', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="grid-col-lg-6">
                        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', margin: 0 }}>
                            📈 Asset Limits Shielding
                          </h4>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-light)' }}>Planned Savings Limit:</span>
                                <strong>${savingsAmount.toLocaleString()}</strong>
                              </div>
                              <input 
                                type="range" min="500" max="150000" step="500" value={savingsAmount}
                                onChange={(e) => setSavingsAmount(parseInt(e.target.value))}
                                style={{ width: '100%', height: '6px', cursor: 'pointer', accentColor: 'var(--primary-color)' }}
                              />
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.01)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.02)', fontSize: '0.8rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <span>Unprotected Account Cap:</span>
                                <span style={{ color: exceedsSsiLimit ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                                  {exceedsSsiLimit ? 'Exceeded ($2k limit)' : 'Safe'}
                                </span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Protected (CalABLE/SNT):</span>
                                <span style={{ color: exceedsCalableSsiLimit ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
                                  {exceedsCalableSsiLimit ? 'SSI Suspended but Medi-Cal Active' : 'Fully Shielded'}
                                </span>
                              </div>
                            </div>

                             {/* Savings Quiz Parameters */}
                             <div className="input-group" style={{ marginBottom: 0 }}>
                               <label style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Funds Source</label>
                               <select 
                                 value={fundingSource}
                                 onChange={(e) => setFundingSource(e.target.value as 'parents' | 'inheritance' | 'child-injury')}
                                 style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: '100%', marginTop: '0.2rem' }}
                               >
                                 <option value="parents">Parents wages/savings</option>
                                 <option value="inheritance">Inheritance from wills/trusts</option>
                                 <option value="child-injury">Personal injury/direct child assets</option>
                               </select>
                             </div>
 
                             <div className="input-group" style={{ marginBottom: 0 }}>
                               <label style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Expected Lifetime Balance</label>
                               <select 
                                 value={expectedBalance}
                                 onChange={(e) => setExpectedBalance(e.target.value as 'low' | 'mid' | 'high')}
                                 style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: '100%', marginTop: '0.2rem' }}
                               >
                                 <option value="low">Under $20k (Short-term)</option>
                                 <option value="mid">$20k - $100k (Mid-term)</option>
                                 <option value="high">Over $100k (Lifetime/Trusts)</option>
                               </select>
                             </div>
 
                             <div className="input-group" style={{ marginBottom: 0 }}>
                               <label style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Spending Timeline</label>
                               <select 
                                 value={spendingTimeline}
                                 onChange={(e) => setSpendingTimeline(e.target.value as 'immediate' | 'longterm' | 'mixed')}
                                 style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: '100%', marginTop: '0.2rem' }}
                               >
                                <option value="immediate">Immediate/Frequent withdrawals</option>
                                <option value="longterm">Long-term legacy lockup</option>
                                <option value="mixed">Mixed/Flexible strategy</option>
                              </select>
                            </div>
                          </div>

                          {/* Recommendation Box */}
                          {(() => {
                            const rec = getWealthRecommendation();
                            return (
                              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                                <div style={{ fontSize: '0.85rem' }}>
                                  <strong>Shield Recommendation:</strong> <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{rec.title}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.4' }}>
                                  {rec.desc}
                                </div>
                                <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#666', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                                  Note: CalABLE accounts are opened directly at calable.ca.gov. Standalone SNTs require estate planning advisors.
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: IHSS & OVERTIME */}
            {activeTab === 'ihss' && (
              <div className="animate-fade-in">
                {/* Sub-Tabs Switcher */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto' }} className="no-print">
                  <button
                    onClick={() => setIhssSubTab('journal')}
                    className={`tab-btn ${ihssSubTab === 'journal' ? 'active' : ''}`}
                    style={{
                      background: ihssSubTab === 'journal' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
                      color: ihssSubTab === 'journal' ? '#ffffff' : 'var(--text-main)',
                      border: '1px solid var(--glass-border)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Safety Log Journal
                  </button>
                  <button
                    onClick={() => setIhssSubTab('estimator')}
                    className={`tab-btn ${ihssSubTab === 'estimator' ? 'active' : ''}`}
                    style={{
                      background: ihssSubTab === 'estimator' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
                      color: ihssSubTab === 'estimator' ? '#ffffff' : 'var(--text-main)',
                      border: '1px solid var(--glass-border)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Hours Estimator
                  </button>
                  <button
                    onClick={() => setIhssSubTab('overtime')}
                    className={`tab-btn ${ihssSubTab === 'overtime' ? 'active' : ''}`}
                    style={{
                      background: ihssSubTab === 'overtime' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
                      color: ihssSubTab === 'overtime' ? '#ffffff' : 'var(--text-main)',
                      border: '1px solid var(--glass-border)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Overtime Scheduler
                  </button>
                </div>

                {ihssSubTab === 'journal' && (
                  <div>
                    {/* Info Warning Alert */}
                    <div className="glass-panel no-print" style={{ 
                      background: 'rgba(var(--primary-rgb), 0.05)', 
                      border: '1px solid rgba(var(--primary-rgb), 0.2)', 
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
                      
                      {/* Left Column: Form */}
                      <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="grid-col-lg-4">
                        
                        {/* Metadata Block */}
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                            Log Information
                          </h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.8rem' }}>Child&apos;s Name</label>
                              <input 
                                type="text" 
                                value={childName} 
                                onChange={(e) => setChildName(e.target.value)} 
                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
                              />
                            </div>

                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.8rem' }}>Parent/Reporter</label>
                              <input 
                                type="text" 
                                value={parentName} 
                                onChange={(e) => setParentName(e.target.value)} 
                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
                              />
                            </div>

                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.8rem' }}>Log Date</label>
                              <input 
                                type="date" 
                                value={logDate} 
                                onChange={(e) => setLogDate(e.target.value)} 
                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
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
                                placeholder="e.g. 08:15 AM"
                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
                              />
                            </div>

                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.8rem' }}>Behavior Category</label>
                              <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
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
                                onChange={(e) => setRiskLevel(e.target.value as 'low' | 'medium' | 'critical')}
                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
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
                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical', width: '100%' }}
                                required
                              />
                            </div>

                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.8rem' }}>Caregiver Intervention (What did you do?)</label>
                              <textarea 
                                value={intervention} 
                                onChange={(e) => setIntervention(e.target.value)} 
                                placeholder="e.g. Lifted child off sill, locked latch, applied safety lock..."
                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', minHeight: '60px', fontFamily: 'inherit', resize: 'vertical', width: '100%' }}
                                required
                              />
                            </div>

                            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                              Add to Safety Log
                            </button>

                          </div>
                        </form>

                      </div>

                      {/* Right Column: Statistics & Incident List */}
                      <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="grid-col-lg-8">
                        
                        {/* Statistics summary cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }} className="no-print">
                          
                          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.7)', width: '100%' }}>
                            <BookOpen size={24} color="var(--primary-color)" />
                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Logged Incidents</span>
                              <strong style={{ fontSize: '1.3rem' }}>{incidents.length}</strong>
                            </div>
                          </div>

                          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239,68,68,0.1)', width: '100%' }}>
                            <AlertOctagon size={24} color="#ef4444" />
                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Critical Hazards</span>
                              <strong style={{ fontSize: '1.3rem', color: '#ef4444' }}>{getCriticalCount()}</strong>
                            </div>
                          </div>

                          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(245, 158, 11, 0.03)', border: '1px solid rgba(245,158,11,0.1)', width: '100%' }}>
                            <AlertTriangle size={24} color="#f59e0b" />
                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Medium Risks</span>
                              <strong style={{ fontSize: '1.3rem', color: '#f59e0b' }}>{getMediumCount()}</strong>
                            </div>
                          </div>

                        </div>

                        {/* Log List */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Behavior Log: {currentChild.nickname}</h3>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                Reporter: {parentName} | Target Child: {currentChild.nickname} | Log Date: {logDate}
                              </span>
                            </div>

                            <div className="no-print" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Are you sure you want to clear all incidents from this log?')) {
                                    setIncidents([]);
                                  }
                                }}
                                style={{
                                  background: 'none',
                                  border: '1px solid rgba(239, 68, 68, 0.2)',
                                  color: '#ef4444',
                                  borderRadius: '8px',
                                  padding: '0.4rem 0.8rem',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                  transition: 'all 0.2s'
                                }}
                              >
                                Clear Log
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Reset log to default sample incidents? This will overwrite your current log.')) {
                                    setIncidents(DEFAULT_INCIDENTS);
                                  }
                                }}
                                style={{
                                  background: 'none',
                                  border: '1px solid rgba(var(--primary-rgb), 0.2)',
                                  color: 'var(--primary-color)',
                                  borderRadius: '8px',
                                  padding: '0.4rem 0.8rem',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                  transition: 'all 0.2s'
                                }}
                              >
                                Load Sample Logs
                              </button>
                              <PrintButton label="Print Safety Log" />
                            </div>
                          </div>

                          {incidents.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                              <Clock size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                              <p>No safety incidents logged. Add entries using the form.</p>
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
                        </div>

                      </div>

                    </div>
                  </div>
                )}

                {ihssSubTab === 'estimator' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
                    
                    {/* Left Column: FI Sliders */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      
                      {/* Functional Index Guide */}
                      <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                          <Clock size={20} color="var(--primary-color)" /> CDSS Functional Index Assessment
                        </h2>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                          For each personal care task, select the rank that best describes your child&apos;s level of impairment. CDSS Ranks range from **Rank 1 (Independent)** to **Rank 5 (Requires Complete Assistance)**.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          
                          {/* 1. Feeding */}
                          <div style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <label style={{ fontWeight: 600, fontSize: '0.92rem' }}>Feeding assistance (Wiping, cutting, spoons, purees)</label>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-color)' }}>FI Rank: {feedingRank} ({feedingHours} hrs/wk)</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={feedingRank}
                              onChange={(e) => setFeedingRank(parseInt(e.target.value))}
                              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary-color)', margin: '0.5rem 0' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                              <span>Rank 1: Self</span>
                              <span>Rank 3: Needs cut/prep</span>
                              <span>Rank 5: Complete (tube/spoon feed)</span>
                            </div>
                          </div>

                          {/* 2. Bowel & Bladder */}
                          <div style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <label style={{ fontWeight: 600, fontSize: '0.92rem' }}>Bowel & Bladder care (Diapering, wiping, reminders)</label>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-color)' }}>FI Rank: {bowelBladderRank} ({bowelHours} hrs/wk)</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={bowelBladderRank}
                              onChange={(e) => setBowelBladderRank(parseInt(e.target.value))}
                              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary-color)', margin: '0.5rem 0' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                              <span>Rank 1: Potty trained</span>
                              <span>Rank 3: Reminders/wiping</span>
                              <span>Rank 5: 100% Incontinent (diapers)</span>
                            </div>
                          </div>

                          {/* 3. Bathing & Oral Hygiene */}
                          <div style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <label style={{ fontWeight: 600, fontSize: '0.92rem' }}>Bathing, brushing teeth, and brushing hair</label>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-color)' }}>FI Rank: {bathingOralRank} ({bathingHours} hrs/wk)</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={bathingOralRank}
                              onChange={(e) => setBathingOralRank(parseInt(e.target.value))}
                              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary-color)', margin: '0.5rem 0' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                              <span>Rank 1: Independent</span>
                              <span>Rank 3: Needs scrubbing/help</span>
                              <span>Rank 5: Complete physical bath</span>
                            </div>
                          </div>

                          {/* 4. Dressing */}
                          <div style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <label style={{ fontWeight: 600, fontSize: '0.92rem' }}>Dressing & Undressing (Buttons, zippers, shoes)</label>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-color)' }}>FI Rank: {dressingRank} ({dressingHours} hrs/wk)</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={dressingRank}
                              onChange={(e) => setDressingRank(parseInt(e.target.value))}
                              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary-color)', margin: '0.5rem 0' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                              <span>Rank 1: Self</span>
                              <span>Rank 3: Fasteners/help</span>
                              <span>Rank 5: Cannot dress/undress</span>
                            </div>
                          </div>

                          {/* 5. Ambulation & Transfers */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <label style={{ fontWeight: 600, fontSize: '0.92rem' }}>Ambulation & Transfers (Walking, lifting, standing)</label>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-color)' }}>FI Rank: {ambulationTransfersRank} ({ambulationHours} hrs/wk)</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={ambulationTransfersRank}
                              onChange={(e) => setAmbulationTransfersRank(parseInt(e.target.value))}
                              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary-color)', margin: '0.5rem 0' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                              <span>Rank 1: Walk freely</span>
                              <span>Rank 3: Needs guidance/rail</span>
                              <span>Rank 5: Wheelchair/lifting</span>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Paramedical & Protective Supervision Toggle Panel */}
                      <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                          Additional Authorization Parameters
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          
                          {/* Protective Supervision Check */}
                          <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={requiresSupervision}
                                onChange={(e) => setRequiresSupervision(e.target.checked)}
                              />
                              <span>Requires 24/7 Protective Supervision?</span>
                            </label>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginLeft: '1.5rem', marginTop: '0.2rem', lineHeight: 1.4 }}>
                              Check if your child has severe cognitive impairments and displays wandering/elopement hazards or self-injury risks, requiring continuous parent oversight. Adds 195 or 283 hours.
                            </p>
                          </div>

                          {/* Paramedical Check */}
                          <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={hasParamedical}
                                onChange={(e) => setHasParamedical(e.target.checked)}
                              />
                              <span>Does your child require Paramedical services?</span>
                            </label>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginLeft: '1.5rem', marginTop: '0.2rem', lineHeight: 1.4 }}>
                              Includes clinical support delegated to parents by physicians, such as G-Tube prep/feeding, catheterizing, suctioning, specialized physical therapy exercises, or blood glucose tracking.
                            </p>

                            {hasParamedical && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '1rem', marginTop: '1rem', marginLeft: '1.5rem' }} className="animate-fade-in">
                                <div className="input-group" style={{ marginBottom: 0 }}>
                                  <label style={{ fontSize: '0.75rem' }}>Paramedical Care Description</label>
                                  <input
                                    type="text"
                                    value={paramedicalDesc}
                                    onChange={(e) => setParamedicalDesc(e.target.value)}
                                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%' }}
                                  />
                                </div>
                                <div className="input-group" style={{ marginBottom: 0 }}>
                                  <label style={{ fontSize: '0.75rem' }}>Hours/Week</label>
                                  <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={paramedicalHours}
                                    onChange={(e) => setParamedicalHours(Math.max(0, parseFloat(e.target.value) || 0))}
                                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%' }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* County Wage Settings */}
                          <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem', alignItems: 'flex-end' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: 1.4 }}>
                              <strong>IHSS County Minimum Wage:</strong> Change this to match your county&apos;s hourly provider wage (ranges from $16.50 to $20.00/hour across California).
                            </div>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.75rem' }}>Wage / Hour ($)</label>
                              <input
                                type="number"
                                step="0.05"
                                min="16"
                                value={ihssWage}
                                onChange={(e) => setIhssWage(Math.max(0, parseFloat(e.target.value) || 16))}
                                style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%' }}
                              />
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Handout copy script */}
                      <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Caseworker Advocacy Handout</h3>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <CopyButton text={compileCaseworkerHandout()} size={16} />
                            <PrintButton label="Print Handout" />
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                          <div style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', fontSize: '0.8rem', color: '#555' }}>
                            {compileCaseworkerHandout()}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right Column: Calculator Output */}
                    <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      
                      {/* Payout Hero Card */}
                      <div className="glass-panel" style={{ padding: '1.75rem', border: '2px solid var(--primary-color)', background: 'rgba(var(--primary-rgb), 0.02)' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-color)', letterSpacing: '0.04em' }}>
                          Estimated Authorization
                        </span>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', marginBottom: '1rem' }}>
                          Total: <span style={{ color: 'var(--primary-color)' }}>{totalMonthlyHours} Hours/Mo</span>
                        </h3>
                        
                        <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1rem' }}>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>Projected Monthly Income</span>
                          <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 700, color: '#10b981', marginTop: '0.25rem' }}>
                            ${estimatedMonthlyPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>
                            Tax-free income for parent providers
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Personal Care:</span>
                            <strong>{monthlyPersonalCareHours} hrs/mo</strong>
                          </div>
                          {requiresSupervision && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Supervision:</span>
                              <strong>{protectiveSupervisionHours} hrs/mo</strong>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                            <span>Total hours:</span>
                            <strong>{totalMonthlyHours} hrs/mo</strong>
                          </div>
                        </div>
                      </div>

                      {/* Severely Impaired Badge Card */}
                      <div className="glass-panel" style={{ 
                        padding: '1.5rem', 
                        background: isSeverelyImpaired ? 'rgba(16, 185, 129, 0.03)' : 'rgba(245, 158, 11, 0.03)',
                        border: `1px solid ${isSeverelyImpaired ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}`
                      }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 700, 
                          textTransform: 'uppercase', 
                          color: isSeverelyImpaired ? '#10b981' : '#f59e0b',
                          background: isSeverelyImpaired ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px',
                          display: 'inline-block',
                          marginBottom: '0.5rem'
                        }}>
                          {isSeverelyImpaired ? 'Severely Impaired' : 'Non-Severely Impaired'}
                        </span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                          {isSeverelyImpaired ? 'SI Status Confirmed (20+ hrs)' : 'Standard Status (<20 hrs)'}
                        </h4>
                        <p style={{ fontSize: '0.8rem', lineHeight: 1.4, color: 'var(--text-light)', marginTop: '0.4rem', margin: 0 }}>
                          {isSeverelyImpaired 
                            ? 'Since your weekly personal care services total 20+ hours, you are classified as Severely Impaired. If you qualify for Protective Supervision, you will receive the maximum 283 hours/month allocation.'
                            : 'Your weekly personal care hours total less than the 20-hour threshold. If you qualify for Protective Supervision, your total allocation will cap at 195 hours/month.'
                          }
                        </p>
                      </div>

                      {/* Statutory CDSS Tip */}
                      <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
                        <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>💡 CDSS Assessment Rule</h4>
                        <p style={{ lineHeight: '1.4', color: 'var(--text-light)', margin: 0 }}>
                          Under CDSS Manual of Policies and Procedures (MPP) Section 30-761, hours must be authorized based on the child&apos;s **individual need** for services. Bring this printout to your assessment to guide the worker.
                        </p>
                      </div>

                    </div>

                  </div>
                )}

                {ihssSubTab === 'overtime' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
                    
                    {/* Left Column: Form & Schedule */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      
                      {/* Hour Settings Form */}
                      <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                          <Clock size={20} color="var(--primary-color)" /> Workweek Parameters
                        </h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          
                          {/* Recipient Count Selector */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '1rem', alignItems: 'center' }}>
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.9rem' }}>Recipients in Household</strong>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Number of family members receiving IHSS hours.</span>
                            </div>
                            <select
                              value={recipientCount}
                              onChange={(e) => setRecipientCount(parseInt(e.target.value))}
                              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', fontSize: '0.88rem', color: 'var(--text-main)' }}
                            >
                              <option value={1}>1 Recipient</option>
                              <option value={2}>2 Recipients</option>
                              <option value={3}>3 Recipients</option>
                            </select>
                          </div>

                          {/* Monthly Hours 1 */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.9rem' }}>Recipient 1 Monthly Hours</strong>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>~{Math.round((monthlyHours1 / 4.33) * 10) / 10} hours/week limit.</span>
                            </div>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <input
                                type="number"
                                min="0"
                                value={monthlyHours1}
                                onChange={(e) => setMonthlyHours1(Math.max(0, parseInt(e.target.value) || 0))}
                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', width: '100%' }}
                              />
                            </div>
                          </div>

                          {/* Monthly Hours 2 (if 2+ recipients) */}
                          {recipientCount >= 2 && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }} className="animate-fade-in">
                              <div>
                                <strong style={{ display: 'block', fontSize: '0.9rem' }}>Recipient 2 Monthly Hours</strong>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>~{Math.round((monthlyHours2 / 4.33) * 10) / 10} hours/week limit.</span>
                              </div>
                              <div className="input-group" style={{ marginBottom: 0 }}>
                                <input
                                  type="number"
                                  min="0"
                                  value={monthlyHours2}
                                  onChange={(e) => setMonthlyHours2(Math.max(0, parseInt(e.target.value) || 0))}
                                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', width: '100%' }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Monthly Hours 3 (if 3 recipients) */}
                          {recipientCount >= 3 && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }} className="animate-fade-in">
                              <div>
                                <strong style={{ display: 'block', fontSize: '0.9rem' }}>Recipient 3 Monthly Hours</strong>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>~{Math.round((monthlyHours3 / 4.33) * 10) / 10} hours/week limit.</span>
                              </div>
                              <div className="input-group" style={{ marginBottom: 0 }}>
                                <input
                                  type="number"
                                  min="0"
                                  value={monthlyHours3}
                                  onChange={(e) => setMonthlyHours3(Math.max(0, parseInt(e.target.value) || 0))}
                                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', width: '100%' }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Travel Hours */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.9rem' }}>Weekly Travel Time (Hours)</strong>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Authorized time driving between recipients (max 7 hrs/wk).</span>
                            </div>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                max="7"
                                value={weeklyTravelHours}
                                onChange={(e) => setWeeklyTravelHours(Math.max(0, parseFloat(e.target.value) || 0))}
                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', width: '100%' }}
                              />
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* 7-Day Scheduler Grid */}
                      <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                          <Clock size={20} color="var(--primary-color)" /> Workweek Schedule Builder
                        </h2>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                          Plan your daily hours for each recipient to ensure compliance with the daily and weekly caps. Daily hours exceeding 24 hours total are invalid.
                        </p>

                        {/* Table Scheduler Grid */}
                        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                              <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.06)', textAlign: 'left' }}>
                                <th style={{ padding: '0.5rem 0.75rem' }}>Day</th>
                                <th style={{ padding: '0.5rem 0.75rem' }}>Rec. 1 Hours</th>
                                {recipientCount >= 2 && <th style={{ padding: '0.5rem 0.75rem' }}>Rec. 2 Hours</th>}
                                {recipientCount >= 3 && <th style={{ padding: '0.5rem 0.75rem' }}>Rec. 3 Hours</th>}
                                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 'bold' }}>Daily Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                const dayKey = day.toLowerCase().slice(0, 3);
                                
                                const val1 = schedule[`${dayKey}-1`] || 0;
                                const val2 = schedule[`${dayKey}-2`] || 0;
                                const val3 = schedule[`${dayKey}-3`] || 0;

                                const dailyTotal = val1 + (recipientCount >= 2 ? val2 : 0) + (recipientCount >= 3 ? val3 : 0);
                                const isDailyOver = dailyTotal > 24;

                                const handleHourChange = (recIdx: number, val: string) => {
                                  const numericVal = Math.min(24, Math.max(0, parseFloat(val) || 0));
                                  setSchedule(prev => ({
                                    ...prev,
                                    [`${dayKey}-${recIdx}`]: numericVal
                                  }));
                                };

                                return (
                                  <tr key={day} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', background: isDailyOver ? 'rgba(239, 68, 68, 0.05)' : 'none' }}>
                                    <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600 }}>{day}</td>
                                    
                                    {/* Recipient 1 Input */}
                                    <td style={{ padding: '0.4rem 0.5rem' }}>
                                      <input
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        max="24"
                                        value={val1 || ''}
                                        placeholder="0"
                                        onChange={(e) => handleHourChange(1, e.target.value)}
                                        style={{ width: '70px', padding: '0.3rem 0.5rem', fontSize: '0.82rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--glass-bg)', color: 'var(--text-main)' }}
                                      />
                                    </td>

                                    {/* Recipient 2 Input */}
                                    {recipientCount >= 2 && (
                                      <td style={{ padding: '0.4rem 0.5rem' }}>
                                        <input
                                          type="number"
                                          step="0.5"
                                          min="0"
                                          max="24"
                                          value={val2 || ''}
                                          placeholder="0"
                                          onChange={(e) => handleHourChange(2, e.target.value)}
                                          style={{ width: '70px', padding: '0.3rem 0.5rem', fontSize: '0.82rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--glass-bg)', color: 'var(--text-main)' }}
                                        />
                                      </td>
                                    )}

                                    {/* Recipient 3 Input */}
                                    {recipientCount >= 3 && (
                                      <td style={{ padding: '0.4rem 0.5rem' }}>
                                        <input
                                          type="number"
                                          step="0.5"
                                          min="0"
                                          max="24"
                                          value={val3 || ''}
                                          placeholder="0"
                                          onChange={(e) => handleHourChange(3, e.target.value)}
                                          style={{ width: '70px', padding: '0.3rem 0.5rem', fontSize: '0.82rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--glass-bg)', color: 'var(--text-main)' }}
                                        />
                                      </td>
                                    )}

                                    {/* Daily Total Display */}
                                    <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700, color: isDailyOver ? '#ef4444' : 'inherit' }}>
                                      {dailyTotal.toFixed(1)} hrs
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Grid Comparisons */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'rgba(0,0,0,0.01)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                          {(() => {
                            const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                            const sumForRec = (recIdx: number) => days.reduce((acc, d) => acc + (schedule[`${d}-${recIdx}`] || 0), 0);
                            
                            const planned1 = sumForRec(1);
                            const planned2 = sumForRec(2);
                            const planned3 = sumForRec(3);

                            const weekly1 = Math.round((monthlyHours1 / 4.33) * 10) / 10;
                            const weekly2 = Math.round((monthlyHours2 / 4.33) * 10) / 10;
                            const weekly3 = Math.round((monthlyHours3 / 4.33) * 10) / 10;

                            return (
                              <>
                                <div>
                                  <strong>Recipient 1 Hours Check:</strong>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                                    Planned: <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{planned1.toFixed(1)} hrs</span> / Limit: {weekly1.toFixed(1)} hrs
                                  </div>
                                  {planned1 > weekly1 && <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>⚠️ Exceeds limit by {(planned1 - weekly1).toFixed(1)} hrs</span>}
                                </div>

                                {recipientCount >= 2 && (
                                  <div>
                                    <strong>Recipient 2 Hours Check:</strong>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                                      Planned: <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{planned2.toFixed(1)} hrs</span> / Limit: {weekly2.toFixed(1)} hrs
                                    </div>
                                    {planned2 > weekly2 && <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>⚠️ Exceeds limit by {(planned2 - weekly2).toFixed(1)} hrs</span>}
                                  </div>
                                )}

                                {recipientCount >= 3 && (
                                  <div>
                                    <strong>Recipient 3 Hours Check:</strong>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                                      Planned: <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{planned3.toFixed(1)} hrs</span> / Limit: {weekly3.toFixed(1)} hrs
                                    </div>
                                    {planned3 > weekly3 && <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>⚠️ Exceeds limit by {(planned3 - weekly3).toFixed(1)} hrs</span>}
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>

                      </div>

                      {/* Document display block */}
                      <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Compliance & Earnings Report</h3>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <CopyButton text={compileOvertimeReport()} size={16} />
                            <PrintButton label="Print Compliance Report" />
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                          <div style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', fontSize: '0.8rem', color: '#555' }}>
                            {compileOvertimeReport()}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right Column: Earnings Summary */}
                    <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      
                      {(() => {
                        const weekly1 = Math.round((monthlyHours1 / 4.33) * 10) / 10;
                        const weekly2 = Math.round((monthlyHours2 / 4.33) * 10) / 10;
                        const weekly3 = Math.round((monthlyHours3 / 4.33) * 10) / 10;
                        
                        let totalWeeklyAuth = weekly1;
                        if (recipientCount >= 2) totalWeeklyAuth += weekly2;
                        if (recipientCount >= 3) totalWeeklyAuth += weekly3;

                        const limit = recipientCount > 1 ? 66 : 70;
                        const isOverCap = totalWeeklyAuth > limit;
                        
                        const regularHours = Math.min(40, totalWeeklyAuth);
                        const overtimeHours = Math.max(0, totalWeeklyAuth - 40);

                        const regularPay = regularHours * ihssWage;
                        const overtimePay = overtimeHours * (ihssWage * 1.5);
                        const travelPay = weeklyTravelHours * ihssWage;
                        
                        const totalWeeklyPay = regularPay + overtimePay + travelPay;
                        const totalMonthlyPay = totalWeeklyPay * 4.33;

                        return (
                          <>
                            <div className="glass-panel" style={{ padding: '1.75rem', border: `2px solid ${isOverCap ? '#ef4444' : 'var(--primary-color)'}`, background: 'rgba(var(--primary-rgb), 0.02)' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: isOverCap ? '#ef4444' : 'var(--primary-color)', letterSpacing: '0.04em' }}>
                                Workweek Hours Summary
                              </span>
                              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', marginBottom: '1.25rem' }}>
                                Hours: <span style={{ color: isOverCap ? '#ef4444' : 'var(--primary-color)' }}>{totalWeeklyAuth.toFixed(1)} hrs/wk</span>
                              </h3>

                              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '0.75rem 1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.25rem' }}>
                                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 600 }}>Projected Monthly Earnings</span>
                                <span style={{ display: 'block', fontSize: '1.35rem', fontWeight: 700, color: '#10b981', marginTop: '0.15rem' }}>
                                  ${totalMonthlyPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>
                                  Regular & Overtime (Tax-Free)
                                </span>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>Regular Hours (up to 40):</span>
                                  <strong>{regularHours.toFixed(1)} hrs/wk</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>Overtime Hours (1.5x):</span>
                                  <strong style={{ color: 'var(--primary-color)' }}>{overtimeHours.toFixed(1)} hrs/wk</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>Travel Time:</span>
                                  <strong>{weeklyTravelHours} hrs/wk</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                                  <span>Hourly Wage:</span>
                                  <strong>${ihssWage.toFixed(2)}/hr</strong>
                                </div>
                              </div>
                            </div>

                            {/* Overtime Cap Warning */}
                            {isOverCap && (
                              <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <AlertOctagon size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                  <strong style={{ display: 'block', fontSize: '0.85rem', color: '#b91c1c', marginBottom: '0.2rem' }}>Weekly Cap Exceeded!</strong>
                                  <p style={{ fontSize: '0.78rem', color: '#b91c1c', margin: 0, lineHeight: 1.4 }}>
                                    Under Welfare & Institutions Code § 12301.15, providers working for multiple recipients are strictly capped at <strong>66 hours per week</strong>. Working beyond this cap will trigger program violations. Split recipient hours with another provider in the household.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Travel time warning */}
                            {weeklyTravelHours > 7 && (
                              <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem', background: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                  <strong style={{ display: 'block', fontSize: '0.85rem', color: '#d97706', marginBottom: '0.2rem' }}>Travel Cap Warning</strong>
                                  <p style={{ fontSize: '0.78rem', color: '#d97706', margin: 0, lineHeight: 1.4 }}>
                                    Welfare & Institutions Code § 12301.16 caps authorized travel time between clients at <strong>7 hours per week</strong>. Make sure your travel time claim is authorized by your caseworker.
                                  </p>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}

                      {/* Travel rules card */}
                      <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
                        <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>🚗 Travel Time & Overtime Rules</h4>
                        <p style={{ lineHeight: '1.4', color: 'var(--text-light)', margin: 0 }}>
                          Under CDSS rules, if you drive directly from one recipient&apos;s house to another on the same day to perform services, you are entitled to travel time pay. Travel hours are paid at your regular hourly wage, and do not trigger overtime deductions or eat into your 66-hour provider work cap.
                        </p>
                      </div>

                    </div>

                  </div>
                )}
              </div>
            )}

            {/* TAB 5: APPEALS & LETTERS BUILDER */}
            {activeTab === 'appeals' && (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
                
                {/* Template Selector & Settings Sidebar */}
                <div style={{ gridColumn: '1 / 5', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="grid-col-lg-4">
                  
                  {/* Template Selector Cards */}
                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={16} color="var(--primary-color)" /> Select Letter Template
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {[
                        { id: 'iep-request', label: 'IEP Evaluation Request', badge: 'Ed Code' },
                        { id: 'ihss-appeal', label: 'IHSS Denial Appeal', badge: 'W&I Code' },
                        { id: 'rc-appeal', label: 'Regional Center Denial', badge: 'Lanterman' },
                        { id: 'ssi-reconsideration', label: 'SSI Reconsideration', badge: 'SSA' },
                        { id: 'epsdt-therapy', label: 'Therapy Authorization', badge: 'EPSDT' }
                      ].map((tpl) => (
                        <button
                          key={tpl.id}
                          onClick={() => setActiveTemplate(tpl.id as 'iep-request' | 'ihss-appeal' | 'rc-appeal' | 'ssi-reconsideration' | 'epsdt-therapy')}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(0,0,0,0.06)',
                            background: activeTemplate === tpl.id ? 'var(--primary-color)' : 'white',
                            color: activeTemplate === tpl.id ? 'white' : 'var(--text-main)',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            transition: 'all 0.2s',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%'
                          }}
                        >
                          <span>{tpl.label}</span>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            padding: '0.1rem 0.4rem', 
                            borderRadius: '4px', 
                            background: activeTemplate === tpl.id ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.04)', 
                            color: activeTemplate === tpl.id ? 'white' : 'var(--text-light)' 
                          }}>
                            {tpl.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Personal Contact Details */}
                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                      Personal Details
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Parent/Caregiver Name</label>
                        <input 
                          type="text" 
                          value={parentName} 
                          onChange={(e) => setParentName(e.target.value)} 
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
                        />
                      </div>

                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Parent Address</label>
                        <input 
                          type="text" 
                          value={parentAddress} 
                          onChange={(e) => setParentAddress(e.target.value)} 
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
                        />
                      </div>

                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Parent Phone</label>
                        <input 
                          type="text" 
                          value={parentPhone} 
                          onChange={(e) => setParentPhone(e.target.value)} 
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
                        />
                      </div>

                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Parent Email</label>
                        <input 
                          type="text" 
                          value={parentEmail} 
                          onChange={(e) => setParentEmail(e.target.value)} 
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
                        />
                      </div>

                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Child&apos;s Name</label>
                        <input 
                          type="text" 
                          value={childName} 
                          onChange={(e) => setChildName(e.target.value)} 
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
                        />
                      </div>

                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Child&apos;s Date of Birth</label>
                        <input 
                          type="date" 
                          value={childDob} 
                          onChange={(e) => setChildDob(e.target.value)} 
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Template Customizer & Preview Panel */}
                <div style={{ gridColumn: '5 / 13', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="grid-col-lg-8">
                  
                  {/* Parameter settings card */}
                  <div className="glass-panel" style={{ padding: '2rem' }}>
                    
                    {/* IEP Request Fields */}
                    {activeTemplate === 'iep-request' && (
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>IEP Assessment Parameters</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                          Specify district parameters and checking specific delay categories to cite in the assessment plan request.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>School District Name</label>
                            <input 
                              type="text" 
                              value={schoolDistrict} 
                              onChange={(e) => setSchoolDistrict(e.target.value)} 
                              style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
                            />
                          </div>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>School Name</label>
                            <input 
                              type="text" 
                              value={schoolName} 
                              onChange={(e) => setSchoolName(e.target.value)} 
                              style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Areas of suspected delay:</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                            {Object.keys(iepConcerns).map((key) => (
                              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                                  <input 
                                    type="checkbox"
                                    checked={iepConcerns[key as keyof typeof iepConcerns]}
                                    onChange={(e) => setIepConcerns(prev => ({ ...prev, [key]: e.target.checked }))}
                                />
                                <span style={{ textTransform: 'capitalize' }}>
                                  {key.replace(/([A-Z])/g, ' $1')} Concerns
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: '0.85rem' }}>Observed challenges (Specific Details)</label>
                          <textarea 
                            value={customIepText}
                            onChange={(e) => setCustomIepText(e.target.value)}
                            style={{ width: '100%', minHeight: '80px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
                          />
                        </div>

                        {/* Interactive Statutory IEP Timeline Calculator */}
                        <div style={{ 
                          marginTop: '1.5rem', 
                          borderTop: '1px dashed rgba(0,0,0,0.08)', 
                          paddingTop: '1.25rem',
                          background: 'rgba(var(--primary-rgb), 0.03)',
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(var(--primary-rgb), 0.08)'
                        }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Clock size={14} color="var(--primary-color)" /> Statutory California IEP Timelines
                          </h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                            California enforces strict legal limits on school districts. Select your request submission date to calculate your milestones:
                          </p>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.75rem' }}>Submission Date</label>
                              <input 
                                type="date"
                                value={iepSubmissionDate}
                                onChange={(e) => setIepSubmissionDate(e.target.value)}
                                style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%' }}
                              />
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', paddingBottom: '0.4rem' }}>
                              Cites CA Education Code §§ 56321 & 56344
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(0,0,0,0.04)', paddingBottom: '0.25rem' }}>
                              <span>1. Assessment Plan Due (15 Days):</span>
                              <strong style={{ color: 'var(--primary-color)' }}>{calculateDateOffset(iepSubmissionDate, 15)}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(0,0,0,0.04)', paddingBottom: '0.25rem' }}>
                              <span>2. Return Signed Plan By (15 Days):</span>
                              <strong>{calculateDateOffset(iepSubmissionDate, 30)}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>3. Assessments & Initial IEP Meeting Held (60 Days):</span>
                              <strong style={{ color: '#10b981' }}>{calculateDateOffset(iepSubmissionDate, 60)}</strong>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* IHSS Appeal Fields */}
                    {activeTemplate === 'ihss-appeal' && (
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>IHSS Appeal Parameters</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                          Select safety behaviors and safety hazards to contest the In-Home Supportive Services denial decision.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>County Name</label>
                            <input 
                              type="text" 
                              value={ihssCounty} 
                              onChange={(e) => setIhssCounty(e.target.value)} 
                              style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
                            />
                          </div>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Notice of Action Date</label>
                            <input 
                              type="date" 
                              value={ihssDenialDate} 
                              onChange={(e) => setIhssDenialDate(e.target.value)} 
                              style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Safety Hazards checklist:</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox"
                                checked={ihssSafetyConcerns.elopement}
                                onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, elopement: e.target.checked }))}
                              />
                              <span>Elopement & Wandering</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox"
                                checked={ihssSafetyConcerns.pica}
                                onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, pica: e.target.checked }))}
                              />
                              <span>Pica (Swallowing Hazards)</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox"
                                checked={ihssSafetyConcerns.selfInjury}
                                onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, selfInjury: e.target.checked }))}
                              />
                              <span>Self-Injurious Behaviors</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox"
                                checked={ihssSafetyConcerns.climbing}
                                onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, climbing: e.target.checked }))}
                              />
                              <span>Furniture climbing/Falls</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox"
                                checked={ihssSafetyConcerns.electricalSafety}
                                onChange={(e) => setIhssSafetyConcerns(prev => ({ ...prev, electricalSafety: e.target.checked }))}
                              />
                              <span>Appliances / Fire Safety</span>
                            </label>
                          </div>
                        </div>

                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: '0.85rem' }}>Detailed description of safety monitoring needs</label>
                          <textarea 
                            value={customIhssText}
                            onChange={(e) => setCustomIhssText(e.target.value)}
                            style={{ width: '100%', minHeight: '80px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
                          />
                        </div>

                        {/* Statutory IHSS Appeal Deadline warning */}
                        <div style={{ 
                          marginTop: '1.5rem', 
                          borderTop: '1px dashed rgba(0,0,0,0.08)', 
                          paddingTop: '1.25rem',
                          background: 'rgba(239, 68, 68, 0.02)',
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(239, 68, 68, 0.08)'
                        }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Scale size={14} color="#ef4444" /> Statutory IHSS Appeal Timelines
                          </h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                            Under Welfare & Institutions Code § 10951, you must file your fair hearing request within **90 calendar days** of the Notice of Action date.
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span>Notice of Action Date:</span>
                            <strong>{ihssDenialDate ? new Date(ihssDenialDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.4rem', borderTop: '1px dashed rgba(0,0,0,0.04)', paddingTop: '0.4rem' }}>
                            <span style={{ color: '#b91c1c', fontWeight: 600 }}>Filing Submission Deadline:</span>
                            <strong style={{ color: '#ef4444' }}>{calculateDateOffset(ihssDenialDate, 90)}</strong>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Regional Center Appeal Fields */}
                    {activeTemplate === 'rc-appeal' && (
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Regional Center Appeal Parameters</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                          Cite the core developmental limitations to appeal a Regional Center Lanterman Act eligibility decision.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Regional Center Name</label>
                            <input 
                              type="text" 
                              value={regionalCenterName} 
                              onChange={(e) => setRegionalCenterName(e.target.value)} 
                              style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
                            />
                          </div>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Date of Denial Notice</label>
                            <input 
                              type="date" 
                              value={rcDenialDate} 
                              onChange={(e) => setRcDenialDate(e.target.value)} 
                              style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
                            />
                          </div>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Primary Diagnosis</label>
                            <input 
                              type="text" 
                              value={rcDiagnosis} 
                              onChange={(e) => setRcDiagnosis(e.target.value)} 
                              style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Substantial limitations (Select 3+):</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox"
                                checked={rcLimitations.receptiveLanguage}
                                onChange={(e) => setRcLimitations(prev => ({ ...prev, receptiveLanguage: e.target.checked }))}
                              />
                              <span>Receptive Language</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox"
                                checked={rcLimitations.expressiveLanguage}
                                onChange={(e) => setRcLimitations(prev => ({ ...prev, expressiveLanguage: e.target.checked }))}
                              />
                              <span>Expressive Language</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox"
                                checked={rcLimitations.learning}
                                onChange={(e) => setRcLimitations(prev => ({ ...prev, learning: e.target.checked }))}
                              />
                              <span>Learning Delays</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox"
                                checked={rcLimitations.mobility}
                                onChange={(e) => setRcLimitations(prev => ({ ...prev, mobility: e.target.checked }))}
                              />
                              <span>Mobility / Gross Motor</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox"
                                checked={rcLimitations.selfCare}
                                onChange={(e) => setRcLimitations(prev => ({ ...prev, selfCare: e.target.checked }))}
                              />
                              <span>Self-Care (ADLs)</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox"
                                checked={rcLimitations.selfDirection}
                                onChange={(e) => setRcLimitations(prev => ({ ...prev, selfDirection: e.target.checked }))}
                              />
                              <span>Self-Direction / Safety</span>
                            </label>
                          </div>
                        </div>

                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: '0.85rem' }}>Detailed description of qualifying developmental needs</label>
                          <textarea 
                            value={customRcText}
                            onChange={(e) => setCustomRcText(e.target.value)}
                            style={{ width: '100%', minHeight: '80px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
                          />
                        </div>

                        {/* Statutory Lanterman Appeal Deadline warning */}
                        <div style={{ 
                          marginTop: '1.5rem', 
                          borderTop: '1px dashed rgba(0,0,0,0.08)', 
                          paddingTop: '1.25rem',
                          background: 'rgba(239, 68, 68, 0.02)',
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(239, 68, 68, 0.08)'
                        }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Scale size={14} color="#ef4444" /> Lanterman Act Appeal Timelines
                          </h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                            Under Welfare & Institutions Code § 4710.5, you must submit your appeal within **30 calendar days** of the Regional Center eligibility denial notice.
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span>Denial Notice Date:</span>
                            <strong>{rcDenialDate ? new Date(rcDenialDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.4rem', borderTop: '1px dashed rgba(0,0,0,0.04)', paddingTop: '0.4rem' }}>
                            <span style={{ color: '#b91c1c', fontWeight: 600 }}>Filing Submission Deadline:</span>
                            <strong style={{ color: '#ef4444' }}>{calculateDateOffset(rcDenialDate, 30)}</strong>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* SSI Reconsideration Fields */}
                    {activeTemplate === 'ssi-reconsideration' && (
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>SSI Reconsideration Parameters</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                          Cite clinical diagnoses and medical listings to appeal a childhood Supplemental Security Income denial.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Date of Denial Notice</label>
                            <input 
                              type="date" 
                              value={ssiDate} 
                              onChange={(e) => setSsiDate(e.target.value)} 
                              style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
                            />
                          </div>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Clinical Diagnosis</label>
                            <input 
                              type="text" 
                              value={ssiDiagnosis} 
                              onChange={(e) => setSsiDiagnosis(e.target.value)} 
                              style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
                            />
                          </div>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Treating Hospital / Specialists</label>
                            <input 
                              type="text" 
                              value={ssiClinicInfo} 
                              onChange={(e) => setSsiClinicInfo(e.target.value)} 
                              style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
                            />
                          </div>
                        </div>

                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: '0.85rem' }}>Description of Childhood Listing matches (marked limitations)</label>
                          <textarea 
                            value={customSsiText}
                            onChange={(e) => setCustomSsiText(e.target.value)}
                            style={{ width: '100%', minHeight: '80px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
                          />
                        </div>

                        {/* Statutory SSI Reconsideration Deadline warning */}
                        <div style={{ 
                          marginTop: '1.5rem', 
                          borderTop: '1px dashed rgba(0,0,0,0.08)', 
                          paddingTop: '1.25rem',
                          background: 'rgba(239, 68, 68, 0.02)',
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(239, 68, 68, 0.08)'
                        }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Scale size={14} color="#ef4444" /> Social Security Appeal Timelines
                          </h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                            Under Social Security rules (20 CFR § 416.1401), you must file a request for Reconsideration within **60 calendar days** of receipt of the denial notice.
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span>Denial Notice Date:</span>
                            <strong>{ssiDate ? new Date(ssiDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.4rem', borderTop: '1px dashed rgba(0,0,0,0.04)', paddingTop: '0.4rem' }}>
                            <span style={{ color: '#b91c1c', fontWeight: 600 }}>Filing Submission Deadline:</span>
                            <strong style={{ color: '#ef4444' }}>{calculateDateOffset(ssiDate, 60)}</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* EPSDT Therapy Fields */}
                    {activeTemplate === 'epsdt-therapy' && (
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Therapy Denial Appeal Parameters (EPSDT Mandate)</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                          Provide details about the denied therapy and insurance plan. Under federal law, Medi-Cal plans must authorize therapies that &quot;correct or ameliorate&quot; a condition.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Therapy Type</label>
                            <select 
                              value={therapyType} 
                              onChange={(e) => setTherapyType(e.target.value)} 
                              style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', background: 'white', color: 'var(--text-main)' }}
                            >
                              <option value="Speech-Language Therapy">Speech-Language Therapy</option>
                              <option value="Occupational Therapy">Occupational Therapy</option>
                              <option value="Physical Therapy">Physical Therapy</option>
                              <option value="Feeding Therapy">Feeding Therapy</option>
                              <option value="Behavioral Therapy (ABA)">Behavioral Therapy (ABA)</option>
                              <option value="Mental Health / Psychotherapy">Mental Health / Psychotherapy</option>
                            </select>
                          </div>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Denial Reason</label>
                            <select 
                              value={denialReason} 
                              onChange={(e) => setDenialReason(e.target.value)} 
                              style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', background: 'white', color: 'var(--text-main)' }}
                            >
                              <option value="Excludes developmental delays / Not rehabilitative">Excludes developmental delays / Not rehabilitative</option>
                              <option value="Not medically necessary">Not medically necessary</option>
                              <option value="Exceeds annual session limits">Exceeds annual session limits</option>
                              <option value="Lack of progress / Maintenance care only">Lack of progress / Maintenance care only</option>
                              <option value="Out-of-network provider">Out-of-network provider</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Insurance / Managed Care Plan Name</label>
                            <input 
                              type="text" 
                              value={insurancePlanName} 
                              onChange={(e) => setInsurancePlanName(e.target.value)} 
                              style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
                            />
                          </div>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Prescribing Physician / Specialist</label>
                            <input 
                              type="text" 
                              value={prescribingDoctor} 
                              onChange={(e) => setPrescribingDoctor(e.target.value)} 
                              style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem', width: '100%' }}
                            />
                          </div>
                        </div>

                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: '0.85rem' }}>Ameliorating therapeutic necessity statement (Clinical details)</label>
                          <textarea 
                            value={customTherapyText}
                            onChange={(e) => setCustomTherapyText(e.target.value)}
                            style={{ width: '100%', minHeight: '100px', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '8px' }}
                          />
                        </div>

                        {/* Statutory EPSDT Appeal Timeline warning */}
                        <div style={{ 
                          marginTop: '1.5rem', 
                          borderTop: '1px dashed rgba(0,0,0,0.08)', 
                          paddingTop: '1.25rem',
                          background: 'rgba(59, 130, 246, 0.02)',
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(59, 130, 246, 0.08)'
                        }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <ShieldCheck size={14} color="#3b82f6" /> Federal EPSDT & State Appeal Timelines
                          </h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                            Under Medi-Cal Managed Care rules (Title 22 CCR § 51014.1), you have **60 calendar days** from the date of the denial Notice of Action to file an appeal.
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(0,0,0,0.04)', paddingBottom: '0.25rem' }}>
                              <span>Expedited Appeal Decision:</span>
                              <strong style={{ color: '#10b981' }}>Within 72 Hours</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(0,0,0,0.04)', paddingBottom: '0.25rem' }}>
                              <span>Standard Internal Appeal:</span>
                              <strong>Within 30 Days</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Fair Hearing filing (if internal appeal denied):</span>
                              <strong>Within 120 Days</strong>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>

                  {/* Render Compiled Letter Editor */}
                  <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Generated Request Letter</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Instantly formatted to official agency standards</span>
                      </div>

                      {(() => {
                        const letterText = compileAppealLetterText();
                        return (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(letterText);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              }}
                              className="btn-primary"
                              style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.82rem', borderRadius: '8px', background: 'rgba(0,0,0,0.04)', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}
                            >
                              {copied ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#10b981' }}><Check size={14} /> Copied!</span>
                              ) : (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><Copy size={14} /> Copy to Clipboard</span>
                              )}
                            </button>
                            <PrintButton label="Print Letter" />
                          </div>
                        );
                      })()}
                    </div>

                    {/* Simulated Paper Draft Canvas */}
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: '12px',
                      padding: '2rem',
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04)',
                      minHeight: '400px',
                      overflowX: 'auto'
                    }}
                    >
                      <pre style={{
                        fontFamily: 'Courier, monospace',
                        fontSize: '0.88rem',
                        color: '#334155',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.6',
                        margin: 0
                      }}>
                        {compileAppealLetterText()}
                      </pre>
                    </div>
                    
                    {/* Legal Advisory warning */}
                    <div style={{ 
                      marginTop: '1.5rem', 
                      background: 'rgba(245, 158, 11, 0.05)', 
                      border: '1px solid rgba(245, 158, 11, 0.2)', 
                      borderRadius: '12px', 
                      padding: '1rem', 
                      display: 'flex', 
                      gap: '0.75rem', 
                      alignItems: 'flex-start' 
                    }}>
                      <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ fontSize: '0.8rem', color: '#b45309', margin: 0, lineHeight: 1.4 }}>
                        <strong>Legal Disclaimer:</strong> The CA Special Needs Navigator is an educational tool. This builder provides templates referencing California regulations but does not constitute formal legal counsel. Always review and attach supporting medical records before sending letters to agencies.
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* TAB 4: ACTION PLAN (MERGED CHECKLISTS & REMINDERS) */}
            {activeTab === 'actions' && (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
                
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
                        {savedChecklist.map(item => (
                          <div 
                            key={item.id}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              padding: '0.6rem 1rem',
                              borderBottom: '1px solid rgba(0,0,0,0.04)',
                              background: item.is_collected === 1 ? 'rgba(var(--primary-rgb),0.02)' : 'transparent'
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
      </div>

      {/* Hidden Print Container for layout printing */}
      <div className="print-expand" style={{ display: 'none' }}>
        {activeTab === 'ihss' && ihssSubTab === 'journal' ? (
          /* Render official SOC 825 style Safety Log table */
          <div style={{ color: 'black', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1.5rem', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '8pt', fontWeight: 'bold', textTransform: 'uppercase', lineHeight: '1.2' }}>
                State of California — Health and Human Services Agency<br />
                California Department of Social Services (CDSS)
              </div>
              <div style={{ fontSize: '11pt', fontWeight: 'bold', border: '1.5px solid #000', padding: '0.2rem 0.6rem', textTransform: 'uppercase' }}>
                SOC 825 Protective Supervision Plan / Behavior Log
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', border: '1px solid #000', padding: '1rem', marginBottom: '1.5rem', fontSize: '10pt', borderRadius: '4px' }}>
              <div>
                <strong>RECIPIENT NAME:</strong> {currentChild?.nickname || childName}<br />
                <strong>DATE OF BIRTH:</strong> {currentChild?.dob || 'N/A'}<br />
                <strong>COUNTY OFFICE:</strong> {counties.find(c => c.id === currentChild?.county_id)?.name || 'California'}
              </div>
              <div>
                <strong>PRIMARY PROVIDER:</strong> {parentName}<br />
                <strong>LOG DATE:</strong> {logDate}<br />
                <strong>STATUS:</strong> ACTIVE RECORD
              </div>
            </div>

            <p style={{ fontSize: '10pt', marginBottom: '1rem', lineHeight: '1.4' }}>
              Under CDSS Manual of Policies and Procedures (MPP) Section 30-757.17, protective supervision is provided to minor children who require 24-hour supervision to protect them from injuring themselves or others. Below is the active log of safety risk incidents and the immediate caregiver interventions executed to safeguard the recipient.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '9.5pt', border: '1px solid #000' }}>
              <thead>
                <tr style={{ background: '#f2f2f2', borderBottom: '1.5px solid #000', textAlign: 'left' }}>
                  <th style={{ padding: '8px', border: '1px solid #000', width: '12%' }}>Time</th>
                  <th style={{ padding: '8px', border: '1px solid #000', width: '25%' }}>Behavior Category & Risk</th>
                  <th style={{ padding: '8px', border: '1px solid #000', width: '38%' }}>Dangerous Behavior / Incident Details</th>
                  <th style={{ padding: '8px', border: '1px solid #000', width: '25%' }}>Immediate Caregiver Intervention</th>
                </tr>
              </thead>
              <tbody>
                {incidents.length > 0 ? (
                  incidents.map((inc) => (
                    <tr key={inc.id} style={{ borderBottom: '1px solid #000' }}>
                      <td style={{ padding: '8px', border: '1px solid #000', fontWeight: 'bold', verticalAlign: 'top' }}>
                        {inc.time}
                      </td>
                      <td style={{ padding: '8px', border: '1px solid #000', verticalAlign: 'top' }}>
                        <div><strong>{inc.category}</strong></div>
                        <div style={{ 
                          fontSize: '8pt', 
                          fontWeight: 'bold', 
                          color: inc.riskLevel === 'critical' ? '#ef4444' : inc.riskLevel === 'medium' ? '#f59e0b' : '#10b981',
                          textTransform: 'uppercase',
                          marginTop: '2px'
                        }}>
                          [{inc.riskLevel} hazard]
                        </div>
                      </td>
                      <td style={{ padding: '8px', border: '1px solid #000', verticalAlign: 'top', lineHeight: '1.3' }}>
                        {inc.details}
                      </td>
                      <td style={{ padding: '8px', border: '1px solid #000', verticalAlign: 'top', lineHeight: '1.3' }}>
                        {inc.intervention}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ padding: '20px', textAlign: 'center', border: '1px solid #000', fontStyle: 'italic' }}>
                      No safety incidents logged for this date.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div style={{ marginTop: '2.5rem', pageBreakInside: 'avoid' }}>
              <p style={{ fontSize: '9pt', fontStyle: 'italic', borderTop: '1px solid #ccc', paddingTop: '0.75rem', color: '#444' }}>
                I declare under penalty of perjury under the laws of the State of California that the information entered in this 24-Hour Protective Supervision Safety Log is true, correct, and represents actual behaviors and caregiver interventions.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '10pt' }}>
                <div>
                  Parent/Caregiver Signature: _________________________________________
                </div>
                <div>
                  Date: ____________________
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'ihss' && ihssSubTab === 'estimator' ? (
          /* Render Caseworker Advocacy Handout */
          <div style={{ color: 'black', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <h1 style={{ fontSize: '20pt', borderBottom: '2.5px solid #000', paddingBottom: '5px', margin: '0 0 1.5rem 0' }}>
              IHSS Functional Index Assessment & Clinical Advocacy Brief
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', border: '1px solid #ddd', padding: '1rem', marginBottom: '1.5rem', fontSize: '10pt', background: '#fafafa' }}>
              <div>
                <strong>RECIPIENT NAME:</strong> {currentChild?.nickname || childName}<br />
                <strong>DATE OF BIRTH:</strong> {currentChild?.dob || 'N/A'}<br />
                <strong>COUNTY OF RESIDENCE:</strong> {counties.find(c => c.id === currentChild?.county_id)?.name || 'California'}
              </div>
              <div>
                <strong>PREPARED BY:</strong> {parentName} (Parent / Caregiver)<br />
                <strong>EVALUATION DATE:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}<br />
                <strong>WAGE RATE:</strong> ${ihssWage.toFixed(2)}/hour
              </div>
            </div>

            <h2 style={{ fontSize: '14pt', margin: '1.5rem 0 0.75rem 0', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '3px' }}>
              I. Functional Needs Assessment & Ranks
            </h2>
            <p style={{ fontSize: '10pt', marginBottom: '1rem', lineHeight: '1.4' }}>
              Under CDSS MPP Section 30-756, the social worker assesses the recipient&apos;s level of independence in specific activities of daily living (ADLs) using a ranking scale of 1 to 5. Below are the estimated rankings based on the recipient&apos;s actual developmental care needs.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5pt', border: '1px solid #ddd' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #aaa', textAlign: 'left' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Activity / Task</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', width: '15%' }}>Assigned Rank</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', width: '25%' }}>Weekly Allocation</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', width: '35%' }}>Regulatory Guidance / Description</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Feeding</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>Rank {feedingRank}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{feedingHours} Hours / Week</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Includes assistance with cutting food, spoon feeding, or managing dysphagia risks.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Bowel & Bladder Care</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>Rank {bowelBladderRank}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{bowelHours} Hours / Week</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Includes diapering, toileting prompts, catheter care, and cleanup.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Bathing & Oral Hygiene</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>Rank {bathingOralRank}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{bathingHours} Hours / Week</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Includes physical bathing support, hair washing, and teeth brushing prompting.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Dressing & Undressing</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>Rank {dressingRank}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{dressingHours} Hours / Week</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Includes selecting clothes, fastening buttons/zippers, orthotic bracing assistance.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Ambulation & Transfers</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>Rank {ambulationTransfersRank}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{ambulationHours} Hours / Week</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Includes help walking, transitioning to wheelchair, and safety transfers.</td>
                </tr>
                {hasParamedical && (
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Paramedical Care</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>N/A</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{paramedicalHours} Hours / Week</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{paramedicalDesc || 'Complex medical treatments ordered by a doctor.'}</td>
                  </tr>
                )}
                <tr style={{ background: '#f9f9f9', fontWeight: 'bold' }}>
                  <td colSpan={2} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Total Weekly Personal Care:</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{totalWeeklyPersonalCare.toFixed(2)} Hours / Week</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', color: '#555', fontWeight: 'normal' }}>
                    ~{monthlyPersonalCareHours.toFixed(1)} Hours / Month
                  </td>
                </tr>
              </tbody>
            </table>

            <h2 style={{ fontSize: '14pt', margin: '1.5rem 0 0.75rem 0', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '3px' }}>
              II. MPP Regulation Classifications
            </h2>
            <div style={{ fontSize: '10pt', display: 'flex', flexDirection: 'column', gap: '0.8rem', lineHeight: '1.4' }}>
              <div>
                <strong>1. SEVERELY IMPAIRED (SI) STATUS (MPP § 30-701(s)(1)):</strong>
                <div style={{ paddingLeft: '1rem', marginTop: '3px' }}>
                  A recipient is classified as &quot;Severely Impaired&quot; if they require 20 or more hours per week of personal care services and paramedical care.
                  <br />
                  <strong>Evaluation:</strong> {isSeverelyImpaired ? 'SEVERELY IMPAIRED STATUS MET' : 'NON-SEVERELY IMPAIRED'} ({totalWeeklyPersonalCare.toFixed(2)} hours/week).
                </div>
              </div>

              <div>
                <strong>2. PROTECTIVE SUPERVISION REQUIREMENT (MPP § 30-757):</strong>
                <div style={{ paddingLeft: '1rem', marginTop: '3px' }}>
                  {requiresSupervision ? (
                    <>
                      Recipient requires 24-hour monitoring to protect them against injury due to severe cognitive impairment, displaying a severe lack of danger awareness (e.g. elopement risk, self-injurious behavior, or pica).
                      <br />
                      <strong>Requested Allocation:</strong> {isSeverelyImpaired ? '283 Hours / Month (Severely Impaired Limit)' : '195 Hours / Month (Non-Severely Impaired Limit)'}
                    </>
                  ) : (
                    'Protective supervision not requested in current parameters.'
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #ddd', paddingTop: '1rem', marginTop: '1rem', background: '#fafafa', padding: '1rem', borderRadius: '4px' }}>
                <strong>Authorized Case Summary Forecast:</strong>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem', fontSize: '9.5pt' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '4px 0' }}>Personal Care Hours:</td>
                      <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 'bold' }}>{monthlyPersonalCareHours.toFixed(1)} Hours/Month</td>
                    </tr>
                    {requiresSupervision && (
                      <tr>
                        <td style={{ padding: '4px 0' }}>Protective Supervision:</td>
                        <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 'bold' }}>{protectiveSupervisionHours} Hours/Month</td>
                      </tr>
                    )}
                    <tr style={{ borderTop: '1px solid #ccc', fontWeight: 'bold' }}>
                      <td style={{ padding: '6px 0' }}>Total Estimated IHSS Hours:</td>
                      <td style={{ padding: '6px 0', textAlign: 'right', fontSize: '11pt', color: 'var(--primary-color)' }}>{totalMonthlyHours.toFixed(1)} Hours/Month</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 0' }}>Estimated Monthly Payout Value:</td>
                      <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 'bold', color: '#10b981' }}>${estimatedMonthlyPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })} / Month</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginTop: '2rem', pageBreakInside: 'avoid', fontSize: '9pt', color: '#666', borderTop: '1px solid #ccc', paddingTop: '0.5rem', textAlign: 'center' }}>
              Note: This report is compiled as a caregiver advocacy briefing for regional center and IHSS coordination. Standard clinical and pediatric records should accompany this briefing.
            </div>
          </div>
        ) : activeTab === 'ihss' && ihssSubTab === 'overtime' ? (
          /* Render Overtime Compliance Report */
          <div style={{ color: 'black', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <h1 style={{ fontSize: '20pt', borderBottom: '2.5px solid #000', paddingBottom: '5px', margin: '0 0 1.5rem 0' }}>
              IHSS Multi-Recipient Schedule & Overtime Compliance Report
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', border: '1px solid #ddd', padding: '1rem', marginBottom: '1.5rem', fontSize: '10pt', background: '#fafafa' }}>
              <div>
                <strong>PROVIDER NAME:</strong> {parentName}<br />
                <strong>REPORT GENERATION DATE:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}<br />
                <strong>HOURLY WAGE RATE:</strong> ${ihssWage.toFixed(2)}/hour
              </div>
              <div>
                <strong>RECIPIENTS COUNT:</strong> {recipientCount}<br />
                <strong>TRAVEL EXEMPTION:</strong> AUTHORIZED
              </div>
            </div>

            {(() => {
              const weekly1 = Math.round((monthlyHours1 / 4.33) * 10) / 10;
              const weekly2 = Math.round((monthlyHours2 / 4.33) * 10) / 10;
              const weekly3 = Math.round((monthlyHours3 / 4.33) * 10) / 10;
              
              let totalWeeklyAuth = weekly1;
              if (recipientCount >= 2) totalWeeklyAuth += weekly2;
              if (recipientCount >= 3) totalWeeklyAuth += weekly3;

              const limit = recipientCount > 1 ? 66 : 70;
              const isOverCap = totalWeeklyAuth > limit;
              
              const regularHours = Math.min(40, totalWeeklyAuth);
              const overtimeHours = Math.max(0, totalWeeklyAuth - 40);

              const regularPay = regularHours * ihssWage;
              const overtimePay = overtimeHours * (ihssWage * 1.5);
              const travelPay = weeklyTravelHours * ihssWage;
              
              const totalWeeklyPay = regularPay + overtimePay + travelPay;
              const totalMonthlyPay = totalWeeklyPay * 4.33;

              return (
                <>
                  <h2 style={{ fontSize: '14pt', margin: '1.5rem 0 0.75rem 0', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '3px' }}>
                    I. Authorized Work Hours Breakdown
                  </h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5pt', border: '1px solid #ddd', marginBottom: '1.5rem' }}>
                    <thead>
                      <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #aaa', textAlign: 'left' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Recipient</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Authorized Monthly Hours</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Calculated Weekly Hours (~4.33)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Recipient 1</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{monthlyHours1} Hours/Month</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{weekly1.toFixed(1)} Hours/Week</td>
                      </tr>
                      {recipientCount >= 2 && (
                        <tr>
                          <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Recipient 2</td>
                          <td style={{ padding: '8px', border: '1px solid #ddd' }}>{monthlyHours2} Hours/Month</td>
                          <td style={{ padding: '8px', border: '1px solid #ddd' }}>{weekly2.toFixed(1)} Hours/Week</td>
                        </tr>
                      )}
                      {recipientCount >= 3 && (
                        <tr>
                          <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Recipient 3</td>
                          <td style={{ padding: '8px', border: '1px solid #ddd' }}>{monthlyHours3} Hours/Month</td>
                          <td style={{ padding: '8px', border: '1px solid #ddd' }}>{weekly3.toFixed(1)} Hours/Week</td>
                        </tr>
                      )}
                      <tr style={{ background: '#f9f9f9', fontWeight: 'bold' }}>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Total Combined:</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{(monthlyHours1 + (recipientCount >= 2 ? monthlyHours2 : 0) + (recipientCount >= 3 ? monthlyHours3 : 0))} Hours/Month</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{totalWeeklyAuth.toFixed(1)} Hours/Week</td>
                      </tr>
                    </tbody>
                  </table>

                  <h2 style={{ fontSize: '14pt', margin: '1.5rem 0 0.75rem 0', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '3px' }}>
                    II. Compliance Verification (W&I Code § 12301.15)
                  </h2>
                  <div style={{ fontSize: '10pt', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: '1.4', marginBottom: '1.5rem' }}>
                    <div>
                      <strong>Weekly Workweek Cap Rule:</strong> {recipientCount > 1 ? '66 Hours / Week (Multi-Recipient Cap)' : '70 Hours / Week (Single-Recipient Exemption Cap)'}
                    </div>
                    <div>
                      <strong>Combined Weekly Workweek:</strong> {totalWeeklyAuth.toFixed(1)} Hours / Week
                    </div>
                    <div>
                      <strong>Provider Exemption Status:</strong>{' '}
                      <span style={{ fontWeight: 'bold', color: isOverCap ? '#ef4444' : '#10b981' }}>
                        {isOverCap ? 'NON-COMPLIANT (EXCEEDS WEEKLY WORK CAP - VIOLATION RISK)' : 'COMPLIANT (WITHIN REGULATORY WORK CAP)'}
                      </span>
                    </div>
                    <div>
                      <strong>Weekly Travel Time Authorized:</strong> {weeklyTravelHours} Hours / Week (Max allowed: 7 hours/week)
                    </div>
                  </div>

                  <h2 style={{ fontSize: '14pt', margin: '1.5rem 0 0.75rem 0', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '3px' }}>
                    III. Earnings & Payout Summary (Tax-Free Caregiver Income)
                  </h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5pt', border: '1px solid #ddd' }}>
                    <thead>
                      <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #aaa', textAlign: 'left' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Payment Element</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Rate / Hours</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Weekly Value</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Monthly Value (~4.33)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Regular Hours</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{regularHours.toFixed(1)} Hours @ ${ihssWage.toFixed(2)}/hr</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>${regularPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>${(regularPay * 4.33).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Overtime Hours (1.5x)</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{overtimeHours.toFixed(1)} Hours @ ${(ihssWage * 1.5).toFixed(2)}/hr</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>${overtimePay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>${(overtimePay * 4.33).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      </tr>
                      {weeklyTravelHours > 0 && (
                        <tr>
                          <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Travel Hours</td>
                          <td style={{ padding: '8px', border: '1px solid #ddd' }}>{weeklyTravelHours} Hours @ ${ihssWage.toFixed(2)}/hr</td>
                          <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>${travelPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>${(travelPay * 4.33).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                      )}
                      <tr style={{ background: '#f9f9f9', fontWeight: 'bold', fontSize: '10.5pt' }}>
                        <td colSpan={2} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Total Estimated Income:</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', color: '#10b981' }}>${totalWeeklyPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', color: '#10b981' }}>${totalMonthlyPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ marginTop: '2.5rem', pageBreakInside: 'avoid' }}>
                    <p style={{ fontSize: '9pt', fontStyle: 'italic', borderTop: '1px solid #ccc', paddingTop: '0.75rem', color: '#444' }}>
                      This workweek schedule is compiled in accordance with CDSS Welfare & Institutions Code Section 12301.15 rules to prevent workweek violations while maximizing authorized recipient hours.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '10pt' }}>
                      <div>
                        Provider Signature: _________________________________________
                      </div>
                      <div>
                        Date: ____________________
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        ) : activeTab === 'appeals' ? (
          /* Render Appeal Letter print-out */
          <div style={{ 
            color: 'black', 
            fontFamily: '"Times New Roman", Times, serif', 
            fontSize: '11pt', 
            lineHeight: '1.6', 
            padding: '0.5in 0.5in',
            margin: '0 auto',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            <pre style={{
              fontFamily: '"Times New Roman", Times, serif',
              whiteSpace: 'pre-wrap',
              fontSize: '11pt',
              lineHeight: '1.5',
              margin: 0,
              color: 'black'
            }}>
              {compileAppealLetterText()}
            </pre>
          </div>
        ) : (
          /* Default: Consolidated Case File Summary */
          <>
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
                        return item ? <li key={id} style={{ marginBottom: '8px' }}><strong>{item.title}:</strong> &quot;{getGoalPreviewText(item)}&quot;</li> : null;
                      })}
                    </ol>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop: '40px', fontSize: '9pt', color: '#777', borderTop: '1px solid #ccc', paddingTop: '10px', textAlign: 'center' }}>
              This timeline summary package consolidates the caregiver records for coordination purposes. Keep medical documentation attached to support the selections.
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
