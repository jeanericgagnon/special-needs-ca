import { notFound } from 'next/navigation';
import { SEO_CLUSTERS } from '@/lib/seo-data';
import { getCounties, navigatorDb, DbProgram } from '@/lib/db';
import { DIAGNOSES_DETAILS } from '@/lib/diagnoses';
import AnswerPage from '@/app/components/answer-page';
import SeoSchema from '@/app/components/seo-schema';
import { constructMetadata, generateBreadcrumbsSchema } from '@/lib/seo-helpers';
import { evaluateSeoPolicy, robotsForPolicy, assertNoPlaceholderData, mapShortDiagToDbId } from '@/lib/seo-policy';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const key of Object.keys(SEO_CLUSTERS)) {
    if (SEO_CLUSTERS[key].category === 'conditions') {
      params.push({ slug: key });
    }
  }
  for (const diag of DIAGNOSES_DETAILS) {
    if (!params.some(p => p.slug === diag.id)) {
      params.push({ slug: diag.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cluster = SEO_CLUSTERS[slug];
  
  const mappedId = mapShortDiagToDbId(slug);
  const conditionRow = await navigatorDb.prepare('SELECT * FROM conditions WHERE id = ?').get(mappedId) as { last_verified_date?: string; source_url?: string } | undefined;
  const condPrograms = await navigatorDb.prepare(`
    SELECT DISTINCT p.* FROM programs p
    JOIN program_eligibility_rules r ON p.id = r.program_id
    WHERE r.required_condition = ? AND p.state_id = 'california'
  `).all(mappedId) as DbProgram[];

  const dates = condPrograms.map(p => p.last_verified_date).filter((d): d is string => !!d);
  if (conditionRow?.last_verified_date) {
    dates.push(conditionRow.last_verified_date);
  }
  const lastVerifiedDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;

  const scores = condPrograms.map(p => p.confidence_score).filter((s): s is number => s !== null && s !== undefined);
  const confidenceScore = scores.length > 0 ? (scores.reduce((sum, s) => sum + s, 0) / scores.length) / 5.0 : null;

  const hasOfficialSource = (conditionRow?.source_url ? (!conditionRow.source_url.includes('ablefull.org') && !conditionRow.source_url.includes('california-navigator.org')) : false) || condPrograms.some(p => !!p.official_source_url);

  const policy = evaluateSeoPolicy({
    routeType: 'condition-hub',
    stateId: 'california',
    diagnosisId: slug,
    confidenceScore,
    hasOfficialSource,
    lastVerifiedDate,
    hasNoPlaceholderData: condPrograms.every(p => assertNoPlaceholderData(JSON.stringify(p)))
  });

  if (cluster) {
    return constructMetadata({
      title: cluster.metaTitle || `${cluster.title} | Ablefull`,
      description: cluster.metaDescription || `Complete guide.`,
      canonicalUrl: `/conditions/${slug}`,
      robots: robotsForPolicy(policy),
    });
  }

  const diagnosis = DIAGNOSES_DETAILS.find(d => d.id === slug);
  if (diagnosis) {
    return constructMetadata({
      title: `${diagnosis.name} Benefits in California: Complete Parent Guide`,
      description: `Learn how to get Regional Center funding, school IEP support, and financial help for children with ${diagnosis.name} in California.`,
      canonicalUrl: `/conditions/${slug}`,
      robots: robotsForPolicy(policy),
    });
  }

  return {
    title: 'Condition Page Not Found',
  };
}

export default async function ConditionPage({ params }: Props) {
  const { slug } = await params;
  const counties = (await getCounties()).map(c => ({ id: c.id, name: c.name }));

  const cluster = SEO_CLUSTERS[slug];
  if (cluster && cluster.category === 'conditions') {
    return <AnswerPage data={cluster} counties={counties} />;
  }

  // Fallback to taxonomy condition details
  const diag = DIAGNOSES_DETAILS.find(d => d.id === slug);
  if (!diag) {
    notFound();
  }

  const mappedId = mapShortDiagToDbId(slug);
  const conditionRow = await navigatorDb.prepare('SELECT * FROM conditions WHERE id = ?').get(mappedId) as { last_verified_date?: string; source_url?: string } | undefined;
  const condPrograms = await navigatorDb.prepare(`
    SELECT DISTINCT p.* FROM programs p
    JOIN program_eligibility_rules r ON p.id = r.program_id
    WHERE r.required_condition = ? AND p.state_id = 'california'
  `).all(mappedId) as DbProgram[];

  const dates = condPrograms.map(p => p.last_verified_date).filter((d): d is string => !!d);
  if (conditionRow?.last_verified_date) {
    dates.push(conditionRow.last_verified_date);
  }
  const lastVerifiedDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;

  const scores = condPrograms.map(p => p.confidence_score).filter((s): s is number => s !== null && s !== undefined);
  const confidenceScore = scores.length > 0 ? (scores.reduce((sum, s) => sum + s, 0) / scores.length) / 5.0 : null;

  const hasOfficialSource = (conditionRow?.source_url ? (!conditionRow.source_url.includes('ablefull.org') && !conditionRow.source_url.includes('california-navigator.org')) : false) || condPrograms.some(p => !!p.official_source_url);

  const policy = evaluateSeoPolicy({
    routeType: 'condition-hub',
    stateId: 'california',
    diagnosisId: slug,
    confidenceScore,
    hasOfficialSource,
    lastVerifiedDate,
    hasNoPlaceholderData: condPrograms.every(p => assertNoPlaceholderData(JSON.stringify(p)))
  });

  const officialSources = [];
  if (conditionRow?.source_url && !conditionRow.source_url.includes('ablefull.org') && !conditionRow.source_url.includes('california-navigator.org')) {
    officialSources.push({
      name: `${diag.name} Official Guidelines`,
      url: conditionRow.source_url
    });
  }
  condPrograms.forEach(p => {
    if (p.official_source_url && !p.official_source_url.includes('ablefull.org')) {
      officialSources.push({
        name: `${p.name} Official Portal`,
        url: p.official_source_url
      });
    }
  });

  // Build a dynamic SEOPageData object based on the diagnosis details from diagnoses.ts
  const dynamicData = {
    slug: slug,
    category: 'conditions' as const,
    title: `${diag.name} Benefits in California: Complete Parent Guide`,
    metaTitle: `${diag.name} Benefits California | Lanterman Act & School Aid`,
    metaDescription: `Discover what public benefits, therapies, and school support plans your child is entitled to in California for ${diag.name}.`,
    quickAnswer: `${diag.parent_friendly_explanation} In California, children with ${diag.name} may be eligible depending on criteria for specialized public benefits. This includes Individualized Education Programs (IEP) in public schools, Regional Center support under the Lanterman Act if developmental criteria are met, Medi-Cal, and Supplemental Security Income (SSI).`,
    tldrPoints: [
      { label: 'Regional Center Focus', value: diag.regional_center_relevance === 1 ? 'High Eligibility' : 'Conditional' },
      { label: 'School IEP Support', value: diag.iep_relevance === 1 ? 'Available' : 'Conditional' },
      { label: 'CCS Therapy Unit', value: diag.ccs_relevance === 1 ? 'Medically Eligible' : 'Check Medical Criteria' },
      { label: 'CalABLE Savings', value: 'Tax-Exempt' }
    ],
    whenThisMatters: diag.age_specific_notes || 'Immediately at diagnosis or starting early intervention under age 3.',
    signsThisMayApply: [
      `A clinical medical diagnosis of ${diag.name}.`,
      'Delays in milestones such as speech, cognitive skills, or motor coordination.',
      'Significant struggles in traditional school environments or social interactions.'
    ],
    whatToDoFirst: [
      'Establish a formal diagnostic report signed by your pediatrician or psychologist.',
      'Contact your local Regional Center to request a Lanterman Act or Early Start assessment.',
      'Submit a written evaluation request for special education services (IEP) to your school district.'
    ],
    documentsToGather: [
      { name: 'Specialist clinical diagnostic report', description: `Verifying clinical diagnosis of ${diag.name}.` },
      { name: 'Private pediatric therapy evaluations', description: 'Speech, occupational, or behavioral therapy records.' }
    ],
    whoToCall: [
      { name: 'California DDS Intake Liaison', number: '(916) 654-1690', description: 'State developmental services office.' }
    ],
    whatToSay: `My child has a diagnosis of ${diag.name} and I would like to schedule an intake assessment to establish qualifying services.`,
    commonMistakes: [
      'Waiting for the school to suggest assessments. You must request them in writing to start the 15-day timeline.',
      'Assuming your income disqualifies you from getting Medi-Cal services for your child.'
    ],
    relatedGuides: [
      { title: 'IEP Request Guide', url: '/situations/iep-evaluation-request' },
      { title: 'Guides & Resources Index', url: '/benefits' }
    ],
    officialSources,
    lastReviewedDate: diag.last_verified_date || null,
    callScriptTemplate: {
      intro: 'Lanterman Intake Call Helper',
      script: `Hello, I am calling to request an intake assessment for my child, [Child Name], who has been diagnosed with ${diag.name}. They are [Age] years old. They have significant functional deficits, and I want to establish Regional Center support services.`,
      tips: 'Mention specific functional limitations in self-care, communication, or learning.'
    },
    eligibilityQuiz: [
      {
        question: `Does your child have a clinical diagnosis of ${diag.name}?`,
        options: [
          { text: 'Yes, confirmed by specialist', score: 'high' as const, reason: 'A certified medical diagnosis is the primary requirement.' },
          { text: 'No, under observation', score: 'med' as const, reason: 'You should request formal diagnostic evaluations from a clinician.' }
        ]
      }
    ]
  };

  // Generate structured schemas
  const breadcrumbList = generateBreadcrumbsSchema([
    { name: 'Home', item: '/' },
    { name: 'Guides', item: '/benefits' },
    { name: 'California', item: `/benefits/california` },
    { name: diag.name, item: `/conditions/${slug}` }
  ]);

  const medicalConditionSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    name: diag.name,
    description: diag.parent_friendly_explanation,
    possibleTreatment: [
      {
        '@type': 'MedicalTherapy',
        name: 'Occupational Therapy'
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Speech-Language Therapy'
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Physical Therapy'
      }
    ]
  };

  return (
    <>
      <SeoSchema data={policy.index ? [breadcrumbList, medicalConditionSchema] : [breadcrumbList]} />
      <AnswerPage data={dynamicData} counties={counties} />
    </>
  );
}
