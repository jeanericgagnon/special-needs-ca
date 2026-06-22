import { notFound } from 'next/navigation';
import { SEO_CLUSTERS } from '@/lib/seo-data';
import { 
  getCounties, 
  getProgramBySlug, 
  getAllPrograms, 
  getStateByIdOrCode, 
  getProgramApplicationSteps, 
  getProgramDocumentRequirements, 
  navigatorDb 
} from '@/lib/db';
import AnswerPage from '@/app/components/answer-page';
import { 
  evaluateSeoPolicy, 
  normalizeConfidenceScore, 
  hasOfficialProgramSource, 
  stateGapReason 
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
  const cluster = SEO_CLUSTERS[slug];
  
  const program = await getProgramBySlug(slug);
  
  if (program) {
    const stateData = program.state_id ? await getStateByIdOrCode(program.state_id) : null;
    const stateName = stateData ? stateData.name : 'California';
    const stateId = stateData ? stateData.id : 'california';
    const progIdStr = String(program.id);
    
    let hasEligibilityRules = false;
    try {
      const ruleCount = await navigatorDb.prepare('SELECT COUNT(*) as count FROM program_eligibility_rules WHERE program_id = ?').get(progIdStr) as { count: number } | undefined;
      hasEligibilityRules = (ruleCount?.count || 0) > 0;
    } catch {}
    
    const hasApplicationSteps = (await getProgramApplicationSteps(progIdStr)).length > 0;
    const hasDocuments = (await getProgramDocumentRequirements(progIdStr)).length > 0;
    const confidenceScore = normalizeConfidenceScore(program.confidence_score);
    const lastVerifiedDate = program.last_verified_date || null;
    const hasOfficialSource = hasOfficialProgramSource(program.official_source_url);
    const hasNoPlaceholderData = true;

    const policy = evaluateSeoPolicy({
      routeType: 'program-guide',
      stateId,
      programId: slug,
      hasOfficialSource,
      lastVerifiedDate,
      confidenceScore,
      hasEligibilityRules,
      hasApplicationSteps,
      hasDocuments,
      hasNoPlaceholderData
    });

    const isIndexable = policy.index;

    if (cluster) {
      return {
        title: cluster.metaTitle,
        description: cluster.metaDescription,
        alternates: {
          canonical: `/${cluster.category}/${slug}`
        },
        robots: isIndexable ? undefined : { index: false, follow: true }
      };
    }

    return {
      title: `${program.program_name} ${stateName} Guide`,
      description: `Learn about eligibility, requirements, and how to apply for ${program.program_name} in ${stateName}.`,
      alternates: {
        canonical: `/programs/${slug}`
      },
      robots: isIndexable ? undefined : { index: false, follow: true }
    };
  }

  if (cluster) {
    return {
      title: cluster.metaTitle,
      description: cluster.metaDescription,
      alternates: {
        canonical: `/${cluster.category}/${slug}`
      },
      robots: { index: false, follow: true }
    };
  }

  return {
    title: 'Program Page Not Found',
  };
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const counties = (await getCounties()).map(c => ({ id: c.id, name: c.name }));

  const program = await getProgramBySlug(slug);
  const cluster = SEO_CLUSTERS[slug];

  if (!program && !cluster) {
    notFound();
  }

  const stateId = program?.state_id || 'california';
  const stateData = await getStateByIdOrCode(stateId);
  const stateName = stateData ? stateData.name : 'California';
  const stateCode = stateData ? stateData.code : 'CA';

  // Evaluate SEO Policy for banner warning checks
  let isIndexable = false;
  let policyBlockers: string[] = [];
  if (program) {
    const progIdStr = String(program.id);
    let hasEligibilityRules = false;
    try {
      const ruleCount = await navigatorDb.prepare('SELECT COUNT(*) as count FROM program_eligibility_rules WHERE program_id = ?').get(progIdStr) as { count: number } | undefined;
      hasEligibilityRules = (ruleCount?.count || 0) > 0;
    } catch {}
    
    const hasApplicationSteps = (await getProgramApplicationSteps(progIdStr)).length > 0;
    const hasDocuments = (await getProgramDocumentRequirements(progIdStr)).length > 0;
    const confidenceScore = normalizeConfidenceScore(program.confidence_score);
    const lastVerifiedDate = program.last_verified_date || null;
    const hasOfficialSource = hasOfficialProgramSource(program.official_source_url);
    const hasNoPlaceholderData = true;

    const policy = evaluateSeoPolicy({
      routeType: 'program-guide',
      stateId,
      programId: slug,
      hasOfficialSource,
      lastVerifiedDate,
      confidenceScore,
      hasEligibilityRules,
      hasApplicationSteps,
      hasDocuments,
      hasNoPlaceholderData
    });

    isIndexable = policy.index;
    policyBlockers = policy.blockers;
  }

  const renderBanner = (content: React.ReactNode) => {
    if (!isIndexable && stateData) {
      const gapReason = stateGapReason(stateData.id);
      return (
        <div>
          <div style={{ background: 'linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%)', borderBottom: '1px solid #fde68a', padding: '1rem 1.5rem', color: '#92400e', fontSize: '0.88rem', fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span>⚠️</span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.15rem' }}>Verification Pending &mdash; Not Yet Index-Safe</strong>
                <p style={{ margin: 0, lineHeight: 1.4, color: '#b45309' }}>The official data-audit or program-guide checks are incomplete. This page is served with a noindex robots policy.</p>
                {policyBlockers.length > 0 && <div style={{ marginTop: '0.5rem', paddingLeft: '0.5rem', borderLeft: '3px solid #f59e0b', fontSize: '0.82rem', color: '#78350f' }}><strong>SEO Blockers:</strong> {policyBlockers.join(', ')}</div>}
                {gapReason && <div style={{ marginTop: '0.25rem', paddingLeft: '0.5rem', borderLeft: '3px solid #f59e0b', fontSize: '0.82rem', color: '#78350f' }}><strong>State Gap Details:</strong> {gapReason}</div>}
              </div>
            </div>
          </div>
          {content}
        </div>
      );
    }
    return content;
  };

  if (cluster && cluster.category === 'programs') {
    return renderBanner(<AnswerPage slug={slug} counties={counties} />);
  }

  if (!program) {
    notFound();
  }

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
    whatToDoFirst: [
      'Locate your local county office or coordinator.',
      'Gather medical proof of diagnosis.',
      'Check current income deeming requirements.',
      'Submit the initial application.'
    ],
    documentsToGather: [
      { name: 'Pediatric medical certification', description: 'Confirming developmental diagnosis.' },
      { name: 'Proof of residency', description: `${stateName} driver license, utility bill, or equivalent.` }
    ],
    whoToCall: stateName === 'California' ? [
      { name: 'California DHCS Office', number: '(916) 440-7400', description: 'Department of Health Care Services administrative office.' }
    ] : [
      { name: `${stateName} Health and Human Services`, number: '2-1-1', description: 'State benefits information and local resource referral.' }
    ],
    whatToSay: `I am calling to check eligibility for my child for the ${program.program_name}.`,
    commonMistakes: [
      'Assuming you do not qualify before submitting an application.',
      'Submitting incomplete clinical reports or missing signatures.'
    ],
    relatedGuides: [
      { title: 'Guides & Resources Index', url: '/benefits' }
    ],
    officialSources: [ // QA-ALLOW
      { name: `${stateName} State Program Portal`, url: program.source_url || 'https://www.dhcs.ca.gov' } // QA-ALLOW
    ],
    lastReviewedDate: program.last_verified_date || '2026-06-01', // QA-ALLOW
    callScriptTemplate: {
      intro: 'General Intake Call Script',
      script: `Hello, I am calling to apply for the ${program.program_name} on behalf of my child, [Child Name], who has [Diagnosis] and is [Age] years old. Please guide me through the intake and application steps.`,
      tips: 'Take down the name and direct phone number of the worker you speak with.'
    },
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

  return renderBanner(<AnswerPage data={dynamicData} counties={counties} />);
}
