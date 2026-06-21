import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { 
  getChildrenByUserId, 
  getCounties, 
  getTaxonomyConditions, 
  getFunctionalNeeds, 
  getMatchedCorePrograms, 
  getProgramsByCriteria,
  getSavedProgramStatuses,
  getChecklistItems,
  getReminders,
  getCountyDetails,
  getChildIepData,
  getChildRespiteData,
  getIepAdvocates,
  getChildWaivers
} from '@/lib/db';
import type {
  CoreProgramMatch,
  Program,
  ProgramStatus,
  ChecklistItem,
  Reminder,
  ChildIepData,
  ChildRespiteData,
  County,
  CountyOffice,
  SchoolDistrict,
  NonprofitOrganization,
  RegionalCenter,
  Selpa,
  ChildWaiver
} from '@/lib/db';
import DashboardClient from './dashboard-client';

interface PageProps {
  searchParams: Promise<{ childId?: string; tab?: string; sub?: string }>;
}

function getAgeInYears(dobString: string): number {
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  // 1. Session check
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  const session = token ? verifyToken(token) : null;

  if (!session) {
    redirect('/login');
  }

  // 2. Load configurations & user profiles
  const children = await getChildrenByUserId(session.userId);
  const counties = await getCounties();
  const conditions = await getTaxonomyConditions();
  const needs = await getFunctionalNeeds();

  // 3. Identify selected child profile and query parameters
  const sParams = await searchParams;
  const selectedChildId = sParams.childId || (children.length > 0 ? children[0].id : null);
  const currentChild = children.find(c => c.id === selectedChildId) || children[0];
  const initialTab = sParams.tab || null;
  const initialSubTab = sParams.sub || null;

  // 4. Fetch child-specific dashboard datasets
  let matchedPrograms: CoreProgramMatch[] = [];
  let crawlerPrograms: Program[] = [];
  let savedStatuses: ProgramStatus[] = [];
  let savedChecklist: ChecklistItem[] = [];
  let savedReminders: Reminder[] = [];
  let countyDetails: (County & {
    countyOffices: CountyOffice[];
    schoolDistricts: SchoolDistrict[];
    localOrganizations: NonprofitOrganization[];
    regionalCenters: RegionalCenter[];
    selpas: Selpa[];
  }) | null = null;
  let savedIepData: ChildIepData = { accommodations: [], goals: [] };
  let savedRespiteData: ChildRespiteData | null = null;
  let savedWaivers: ChildWaiver[] = [];

  if (currentChild) {
    const age = getAgeInYears(currentChild.dob);
    
    // Resolve county details first to get stateId
    countyDetails = await getCountyDetails(currentChild.county_id) || null;
    const stateId = countyDetails?.state_id || 'california';

    // Dynamic matching queries
    matchedPrograms = await getMatchedCorePrograms(
      age, 
      currentChild.conditionIds || [], 
      currentChild.functionalNeedIds || [],
      stateId
    );

    // crawler database matching (use first matched condition name or default)
    const diagnosisName = currentChild.conditionIds?.[0] 
      ? conditions.find(c => c.id === currentChild.conditionIds?.[0])?.name || ''
      : '';
      
    crawlerPrograms = await getProgramsByCriteria(age, diagnosisName);

    // Save states
    savedStatuses = await getSavedProgramStatuses(currentChild.id);
    savedChecklist = await getChecklistItems(currentChild.id);
    savedReminders = await getReminders(currentChild.id);

    // Routing resources (already resolved early for matching queries)
    
    // IEP & Respite child specific configurations
    savedIepData = await getChildIepData(currentChild.id);
    savedRespiteData = await getChildRespiteData(currentChild.id);
    savedWaivers = await getChildWaivers(currentChild.id);
  }

  const localAdvocates = currentChild ? await getIepAdvocates(currentChild.county_id) : [];

  return (
    <DashboardClient 
      counties={counties}
      conditions={conditions}
      needs={needs}
      childrenList={children}
      selectedChildId={selectedChildId}
      matchedPrograms={matchedPrograms}
      crawlerPrograms={crawlerPrograms}
      savedStatuses={savedStatuses}
      savedChecklist={savedChecklist}
      savedReminders={savedReminders}
      countyDetails={countyDetails}
      savedIepData={savedIepData}
      savedRespiteData={savedRespiteData}
      initialTab={initialTab}
      initialSubTab={initialSubTab}
      localAdvocates={localAdvocates}
      savedWaivers={savedWaivers}
    />
  );
}
