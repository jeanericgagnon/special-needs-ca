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
  getChildRespiteData
} from '@/lib/db';
import DashboardClient from './dashboard-client';

interface PageProps {
  searchParams: Promise<{ childId?: string }>;
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
  const children = getChildrenByUserId(session.userId);
  const counties = getCounties();
  const conditions = getTaxonomyConditions();
  const needs = getFunctionalNeeds();

  // 3. Identify selected child profile
  const sParams = await searchParams;
  const selectedChildId = sParams.childId || (children.length > 0 ? children[0].id : null);
  const currentChild = children.find(c => c.id === selectedChildId) || children[0];

  // 4. Fetch child-specific dashboard datasets
  let matchedPrograms: any[] = [];
  let crawlerPrograms: any[] = [];
  let savedStatuses: any[] = [];
  let savedChecklist: any[] = [];
  let savedReminders: any[] = [];
  let countyDetails: any = null;
  let savedIepData: any = { accommodations: [], goals: [] };
  let savedRespiteData: any = null;

  if (currentChild) {
    const age = getAgeInYears(currentChild.dob);
    
    // Dynamic matching queries
    matchedPrograms = getMatchedCorePrograms(
      age, 
      currentChild.conditionIds || [], 
      currentChild.functionalNeedIds || []
    );

    // crawler database matching (use first matched condition name or default)
    const diagnosisName = currentChild.conditionIds?.[0] 
      ? conditions.find(c => c.id === currentChild.conditionIds?.[0])?.name || ''
      : '';
      
    crawlerPrograms = getProgramsByCriteria(age, diagnosisName);

    // Save states
    savedStatuses = getSavedProgramStatuses(currentChild.id);
    savedChecklist = getChecklistItems(currentChild.id);
    savedReminders = getReminders(currentChild.id);

    // Routing resources
    countyDetails = getCountyDetails(currentChild.county_id);
    
    // IEP & Respite child specific configurations
    savedIepData = getChildIepData(currentChild.id);
    savedRespiteData = getChildRespiteData(currentChild.id);
  }

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
    />
  );
}
