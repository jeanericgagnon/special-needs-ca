import { notFound, permanentRedirect } from 'next/navigation';
import { SEO_CLUSTERS } from '@/lib/seo-data';
import { 
  getCounties, 
  getProgramBySlug, 
  getAllPrograms, 
  getStateByIdOrCode,
  navigatorDb,
  getProgramApplicationSteps,
  getProgramDocumentRequirements
} from '@/lib/db';
import AnswerPage from '@/app/components/answer-page';
import { 
  getSeoPolicyForRoute, 
  assertNoPlaceholderData, 
  normalizeConfidenceScore, 
  hasOfficialProgramSource 
} from '@/lib/seo-policy';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const key of Object.keys(SEO_CLUSTERS)) {
    if (SEO_CLUSTERS[key].category === 'programs') {
      params.push({ slug: key });
    }
  }
  try {
    const programs = await getAllPrograms();
    for (const prog of programs) {
      const idStr = String(prog.id);
      if (!params.some(p => p.slug === idStr)) {
        params.push({ slug: idStr });
      }
      const slung = idStr.toLowerCase().replace(/_/g, '-');
      if (!params.some(p => p.slug === slung)) {
        params.push({ slug: slung });
      }
    }
  } catch {}
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  
  const program = await getProgramBySlug(slug);
  if (program && program.state_id) {
    permanentRedirect(`/benefits/${program.state_id}/program/${slug}`);
  }

  const cluster = SEO_CLUSTERS[slug];
  const programStateId = program?.state_id || null;
  const verificationStatus = program?.verification_status || null;
  const lastVerifiedDate = program?.last_verified_date || null;
  let hasEligibilityRules = false;
  let hasVerifiedEligibilityRules = false;
  let hasApplicationSteps = false;
  let hasDocuments = false;
  let confidenceScore: number | null = null;

  if (program) {
    const progIdStr = String(program.id);
    const ruleCount = await navigatorDb.prepare('SELECT COUNT(*) as count FROM program_eligibility_rules WHERE program_id = ?').get(progIdStr) as { count: number } | undefined;
    hasEligibilityRules = (ruleCount?.count || 0) > 0;
    hasVerifiedEligibilityRules = hasEligibilityRules && (program.verification_status === 'official_verified' || program.verification_status === 'verified' || program.verification_status === 'human_verified');
    hasApplicationSteps = (await getProgramApplicationSteps(progIdStr)).length > 0;
    hasDocuments = (await getProgramDocumentRequirements(progIdStr)).length > 0;
    confidenceScore = normalizeConfidenceScore(program.confidence_score);
  }

  const policy = getSeoPolicyForRoute('program-guide', {
    stateId: programStateId || 'california',
    programId: slug
  }, {
    hasOfficialSource: hasOfficialProgramSource(program?.source_url),
    lastVerifiedDate,
    confidenceScore,
    hasEligibilityRules,
    hasVerifiedEligibilityRules,
    hasApplicationSteps,
    hasDocuments,
    hasNoPlaceholderData: program ? assertNoPlaceholderData(JSON.stringify(program)) : true,
    programStateId,
    verificationStatus
  });

  return {
    title: cluster ? cluster.metaTitle : `${program?.program_name || formatParam(slug)} - Program Guide`,
    description: cluster ? cluster.metaDescription : `Details and guidelines for ${program?.program_name || formatParam(slug)}.`,
    alternates: {
      canonical: policy.canonicalUrl
    },
    robots: {
      index: policy.index,
      follow: policy.follow
    }
  };
}

function formatParam(val: string): string {
  return val.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const counties = (await getCounties()).map(c => ({ id: c.id, name: c.name }));

  const program = await getProgramBySlug(slug);
  if (program && program.state_id) {
    permanentRedirect(`/benefits/${program.state_id}/program/${slug}`);
  }

  const cluster = SEO_CLUSTERS[slug];
  if (cluster && cluster.category === 'programs' && !program) {
    return <AnswerPage slug={slug} counties={counties} />;
  }

  if (!program) {
    notFound();
  }

  const stateData = program.state_id ? await getStateByIdOrCode(program.state_id) : null;
  const stateName = stateData ? stateData.name : 'California';
  const stateCode = stateData ? stateData.code : 'CA';

  const programStateId = program.state_id || null;
  const verificationStatus = program.verification_status || null;
  const lastVerifiedDate = program.last_verified_date || null;
  let hasEligibilityRules = false;
  let hasVerifiedEligibilityRules = false;
  let hasApplicationSteps = false;
  let hasDocuments = false;
  let confidenceScore: number | null = null;

  const progIdStr = String(program.id);
  const ruleCount = await navigatorDb.prepare('SELECT COUNT(*) as count FROM program_eligibility_rules WHERE program_id = ?').get(progIdStr) as { count: number } | undefined;
  hasEligibilityRules = (ruleCount?.count || 0) > 0;
  hasVerifiedEligibilityRules = hasEligibilityRules && (program.verification_status === 'official_verified' || program.verification_status === 'verified' || program.verification_status === 'human_verified');
  
  const steps = await getProgramApplicationSteps(progIdStr);
  hasApplicationSteps = steps.length > 0;
  
  const docs = await getProgramDocumentRequirements(progIdStr);
  hasDocuments = docs.length > 0;
  
  confidenceScore = normalizeConfidenceScore(program.confidence_score);

  const policy = getSeoPolicyForRoute('program-guide', {
    stateId: programStateId || 'california',
    programId: slug
  }, {
    hasOfficialSource: hasOfficialProgramSource(program.source_url),
    lastVerifiedDate,
    confidenceScore,
    hasEligibilityRules,
    hasVerifiedEligibilityRules,
    hasApplicationSteps,
    hasDocuments,
    hasNoPlaceholderData: assertNoPlaceholderData(JSON.stringify(program)),
    programStateId,
    verificationStatus
  });

  // Construct dynamic SEOPageData on the fly
  const dynamicData = {
    slug: slug,
    category: 'programs' as const,
    title: `${program.program_name} ${stateName} Guide`,
    metaTitle: `${program.program_name} | ${stateName} Eligibility & Application`,
    metaDescription: `Find out if you qualify for ${program.program_name} in ${stateName}. Learn about income limits, age rules, and required evidence.`,
    quickAnswer: `The ${program.program_name} is a ${stateName} program targeting ${program.target_demographic}. It has an age limit of ${program.age_limit_min} to ${program.age_limit_max} years. The income requirement is stated as: ${program.income_limit || 'None specified'}.`,
    tldrPoints: [
      { label: 'Demographic', value: program.target_demographic },
      { label: 'Age Range', value: `${program.age_limit_min} - ${program.age_limit_max} yrs` },
      { label: 'Income Limit', value: program.income_limit || 'None' },
      { label: 'County Specific', value: program.county_specific || 'Statewide' }
    ],
    whenThisMatters: `When seeking assistance under ${program.program_name} for a child falling within the target demographic.`,
    signsThisMayApply: [
      `Child is between ${program.age_limit_min} and ${program.age_limit_max} years of age.`,
      `Meets the stated demographic criteria: ${program.target_demographic}.`,
      `Meets the specified conditions and diagnoses: ${program.diagnosis_required || 'Any documented disability'}.`
    ],
    whatToDoFirst: policy.index && hasApplicationSteps
      ? steps.map(s => `${s.title}: ${s.action_description}`)
      : ['Not yet verified'],
    documentsToGather: policy.index && hasDocuments
      ? docs.map(d => ({ name: d.name, description: d.description || '' }))
      : [],
    whoToCall: [],
    whatToSay: '',
    commonMistakes: [
      'Assuming you do not qualify before submitting an application.',
      'Submitting incomplete clinical reports or missing signatures.'
    ],
    relatedGuides: [
      { title: 'Guides & Resources Index', url: '/benefits' }
    ],
    officialSources: (program.source_url ? [
      { name: `${stateName} State Program Portal`, url: program.source_url }
    ] : []),
    lastReviewedDate: program.last_verified_date || '',
    callScriptTemplate: undefined,
    eligibilityQuiz: [
      {
        question: `Is your child's age between ${program.age_limit_min} and ${program.age_limit_max}?`,
        options: [
          { text: 'Yes, fits the age limit', score: 'high' as const, reason: 'The child meets the age limits for this program.' },
          { text: 'No, younger or older', score: 'low' as const, reason: 'This program has strict age requirements.' }
        ]
      }
    ]
  };

  return <AnswerPage data={dynamicData} counties={counties} />;
}
