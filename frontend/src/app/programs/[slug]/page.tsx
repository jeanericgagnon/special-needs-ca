import { notFound } from 'next/navigation';
import { SEO_CLUSTERS } from '@/lib/seo-data';
import { getCounties, getProgramBySlug, getAllPrograms, getStateByIdOrCode, navigatorDb, getProgramApplicationSteps, getProgramDocumentRequirements, CountyOffice } from '@/lib/db';
import AnswerPage from '@/app/components/answer-page';
import SeoSchema from '@/app/components/seo-schema';
import { constructMetadata, generateBreadcrumbsSchema } from '@/lib/seo-helpers';
import { evaluateSeoPolicy, robotsForPolicy, assertNoPlaceholderData } from '@/lib/seo-policy';

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
  let hasEligibilityRules = false;
  let hasApplicationSteps = false;
  let hasDocuments = false;
  let hasNoPlaceholderData = true;
  let confidenceScore: number | null = null;
  let stateId = 'california';

  if (program) {
    stateId = program.state_id || 'california';
    const progIdStr = String(program.id);
    const ruleCount = await navigatorDb.prepare('SELECT COUNT(*) as count FROM program_eligibility_rules WHERE program_id = ?').get(progIdStr) as { count: number } | undefined;
    hasEligibilityRules = (ruleCount?.count || 0) > 0;
    hasApplicationSteps = (await getProgramApplicationSteps(progIdStr)).length > 0;
    hasDocuments = (await getProgramDocumentRequirements(progIdStr)).length > 0;
    hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(program));
    confidenceScore = program.confidence_score !== null && program.confidence_score !== undefined
      ? Number(program.confidence_score) / 5.0
      : null;
  }

  const policy = evaluateSeoPolicy({
    routeType: 'program-guide',
    stateId,
    programId: slug,
    hasOfficialSource: !!program?.source_url,
    lastVerifiedDate: program?.last_verified_date || null,
    confidenceScore,
    hasEligibilityRules,
    hasApplicationSteps,
    hasDocuments,
    hasNoPlaceholderData
  });

  if (cluster) {
    return constructMetadata({
      title: cluster.metaTitle || `${cluster.title} | Ablefull`,
      description: cluster.metaDescription || `Eligibility and application guide.`,
      canonicalUrl: `/programs/${slug}`,
      robots: robotsForPolicy(policy),
    });
  }

  if (program) {
    const stateData = program.state_id ? await getStateByIdOrCode(program.state_id) : null;
    const stateName = stateData ? stateData.name : 'California';
    return constructMetadata({
      title: `${program.program_name} | ${stateName} Eligibility & Application Guide`,
      description: `Learn about eligibility, income limits, and how to apply for ${program.program_name} in ${stateName}.`,
      canonicalUrl: `/programs/${slug}`,
      robots: robotsForPolicy(policy),
    });
  }

  return {
    title: 'Program Page Not Found',
  };
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const counties = (await getCounties()).map(c => ({ id: c.id, name: c.name }));

  const cluster = SEO_CLUSTERS[slug];
  if (cluster && cluster.category === 'programs') {
    return <AnswerPage slug={slug} counties={counties} />;
  }

  // Fallback to DB query
  const program = await getProgramBySlug(slug);
  if (!program) {
    notFound();
  }

  const stateData = program.state_id ? await getStateByIdOrCode(program.state_id) : null;
  const stateName = stateData ? stateData.name : 'California';
  const stateCode = stateData ? stateData.code : 'CA';

  const progIdStr = String(program.id);
  const dbSteps = await getProgramApplicationSteps(progIdStr);
  const dbDocs = await getProgramDocumentRequirements(progIdStr);
  const dbOffices = await navigatorDb.prepare('SELECT * FROM county_offices WHERE program_id = ?').all(progIdStr) as CountyOffice[];

  const whatToDoFirst = dbSteps.length > 0
    ? dbSteps.map(step => step.action_description)
    : ['Verification/application steps pending. Details will be published once officially verified.'];

  const documentsToGather = dbDocs.length > 0
    ? dbDocs.map(doc => ({ name: doc.name, description: doc.description || '' }))
    : [
        { name: 'Required documents pending verification', description: 'Official document requirements will be populated upon verification.' }
      ];

  const whoToCall = dbOffices.length > 0
    ? dbOffices.map(off => ({
        name: off.office_name,
        number: off.phone,
        description: `Local office address: ${off.address}`
      }))
    : [
        { name: 'Official contacts pending verification', description: 'Contact details will be populated once officially verified.' }
      ];

  const officialSources = program.source_url ? [
    { name: `${stateName} State Program Portal`, url: program.source_url }
  ] : [];

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
    whatToDoFirst,
    documentsToGather,
    whoToCall,
    whatToSay: `I am calling to check eligibility for my child for the ${program.program_name}.`,
    commonMistakes: [
      'Assuming you do not qualify before submitting an application.',
      'Submitting incomplete clinical reports or missing signatures.'
    ],
    relatedGuides: [
      { title: 'Guides & Resources Index', url: '/benefits' }
    ],
    officialSources,
    lastReviewedDate: program.last_verified_date || null,
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

  // Evaluate policy in component body
  let hasEligibilityRules = false;
  let hasApplicationSteps = false;
  let hasDocuments = false;
  let hasNoPlaceholderData = true;
  let confidenceScore: number | null = null;
  const stateId = program.state_id || 'california';

  const ruleCount = await navigatorDb.prepare('SELECT COUNT(*) as count FROM program_eligibility_rules WHERE program_id = ?').get(progIdStr) as { count: number } | undefined;
  hasEligibilityRules = (ruleCount?.count || 0) > 0;
  hasApplicationSteps = (await getProgramApplicationSteps(progIdStr)).length > 0;
  hasDocuments = (await getProgramDocumentRequirements(progIdStr)).length > 0;
  hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(program));
  confidenceScore = program.confidence_score !== null && program.confidence_score !== undefined
    ? Number(program.confidence_score) / 5.0
    : null;

  const policy = evaluateSeoPolicy({
    routeType: 'program-guide',
    stateId,
    programId: slug,
    hasOfficialSource: !!program?.source_url,
    lastVerifiedDate: program?.last_verified_date || null,
    confidenceScore,
    hasEligibilityRules,
    hasApplicationSteps,
    hasDocuments,
    hasNoPlaceholderData
  });

  // Generate structured schemas
  const breadcrumbList = generateBreadcrumbsSchema([
    { name: 'Home', item: '/' },
    { name: 'Guides', item: '/benefits' },
    { name: stateName, item: `/benefits/${program.state_id || 'california'}` },
    { name: program.program_name, item: `/programs/${slug}` }
  ]);

  const govServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: program.program_name,
    provider: {
      '@type': 'GovernmentOrganization',
      name: `${stateName} Developmental Services`
    },
    serviceAudience: program.target_demographic,
    description: `Eligibility and application guide for ${program.program_name} in ${stateName}.`
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Who qualifies for ${program.program_name} in ${stateName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Children in ${stateName} with diagnoses matching ${program.diagnosis_required || 'developmental delays'} between the ages of ${program.age_limit_min} and ${program.age_limit_max} years.`
        }
      }
    ]
  };

  return (
    <>
      <SeoSchema data={policy.index ? [breadcrumbList, govServiceSchema, faqSchema] : [breadcrumbList]} />
      <AnswerPage data={dynamicData} counties={counties} />
    </>
  );
}
