import { notFound } from 'next/navigation';
import { SEO_CLUSTERS, getClusterSourceConfidence } from '@/lib/seo-data';
import { getCounties } from '@/lib/db';
import { DIAGNOSES_DETAILS } from '@/lib/diagnoses';
import AnswerPage from '@/app/components/answer-page';
import { getSeoPolicyForRoute, hasOfficialProgramSource, assertNoPlaceholderData } from '@/lib/seo-policy';
import { resolvePublicSourceVerificationStatus } from '@/lib/sourceReviewLabels';

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
  if (cluster) {
    const policy = getSeoPolicyForRoute('static-page', {
      path: `/conditions/${slug}`,
      diagnosisId: slug,
    }, {
      hasNoPlaceholderData: assertNoPlaceholderData(JSON.stringify(cluster)),
      hasOfficialSource: Array.isArray(cluster.officialSources) && cluster.officialSources.some((source) => hasOfficialProgramSource(source.url)),
      lastVerifiedDate: cluster.lastReviewedDate || null,
      confidenceScore: getClusterSourceConfidence(cluster),
    });
    return {
      title: cluster.metaTitle,
      description: cluster.metaDescription,
      alternates: {
        canonical: `/conditions/${slug}`,
      },
      robots: policy.index ? undefined : { index: false, follow: true },
    };
  }

  const diagnosis = DIAGNOSES_DETAILS.find(d => d.id === slug);
  if (diagnosis) {
    const diagnosisOfficialSources = [
      'https://www.dds.ca.gov',
      'https://www.cde.ca.gov',
    ];
    const policy = getSeoPolicyForRoute('static-page', {
      path: `/conditions/${slug}`,
      diagnosisId: slug,
    }, {
      hasNoPlaceholderData: true,
      hasOfficialSource: diagnosisOfficialSources.some((url) => hasOfficialProgramSource(url)),
      lastVerifiedDate: diagnosis.last_verified_date || null,
      confidenceScore: null,
    });
    return {
      title: `${diagnosis.name} California Public Support Guide`,
      description: `Review source-backed California public benefit, school-support, and intake pathways that families often check for children with ${diagnosis.name}, then confirm the current next step against public sources.`,
      alternates: {
        canonical: `/conditions/${slug}`,
      },
      robots: policy.index ? undefined : { index: false, follow: true },
    };
  }

  return {
    title: 'Condition Page Not Found',
    robots: { index: false, follow: true },
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

  // Build a dynamic SEOPageData object based on the diagnosis details from diagnoses.ts
  const dynamicData = {
    slug: slug,
    category: 'conditions' as const,
    title: `${diag.name} California Public Support Guide`,
    metaTitle: `${diag.name} California Support Guide | Public Benefits & School Routes`,
    metaDescription: `Review source-backed California public benefit, school-support, and intake pathways families often check after a ${diag.name} diagnosis, with public next-step guidance and source links.`,
    quickAnswer: `${diag.parent_friendly_explanation} In California, families often review several public support pathways after a ${diag.name} diagnosis, depending on the child's functional needs, age, and current program rules. That can include school evaluation requests, Regional Center screening when developmental-service criteria may fit, Medi-Cal pathways, and Supplemental Security Income (SSI). Each route still needs current source review and agency confirmation.`,
    tldrPoints: [
      { label: 'Regional Center Fit', value: diag.regional_center_relevance === 1 ? 'High screening fit' : 'Conditional' },
      { label: 'School IEP Support', value: diag.iep_relevance === 1 ? 'Likely worth screening' : 'Conditional' },
      { label: 'CCS Therapy Unit', value: diag.ccs_relevance === 1 ? 'Medical screening fit' : 'Check medical criteria' },
      { label: 'CalABLE Savings', value: 'Tax-Exempt' }
    ],
    whenThisMatters: diag.age_specific_notes || 'Immediately at diagnosis or starting early intervention under age 3.',
    signsThisMayApply: [
      `A clinical medical diagnosis of ${diag.name}.`,
      'Delays in milestones such as speech, cognitive skills, or motor coordination.',
      'Significant struggles in traditional school environments or social interactions.'
    ],
    whatToDoFirst: [
      'Keep a formal diagnostic report signed by your pediatrician, psychologist, or specialist ready for current public intake and school review steps.',
      'Review your local Regional Center intake or Early Start page to see whether a screening request makes sense for your child.',
      'Prepare a written request for a school special-education evaluation and confirm the district’s current submission path.'
    ],
    documentsToGather: [
      { name: 'Specialist clinical diagnostic report', description: `Verifying clinical diagnosis of ${diag.name}.` },
      { name: 'Private pediatric therapy evaluations', description: 'Speech, occupational, or behavioral therapy records.' }
    ],
    whoToCall: [
      { name: 'California DDS State Office (statewide information line)', number: '(916) 654-1690', description: 'State developmental-services office for statewide information; use your local Regional Center for intake routing and county-level next steps.' }
    ],
    whatToSay: `My child has a diagnosis of ${diag.name} and I would like to schedule an intake assessment to understand the available services and next steps.`,
    commonMistakes: [
      'Waiting for the school to suggest assessments instead of making a written request and keeping a dated copy for your records.',
      'Assuming income alone settles Medi-Cal eligibility without checking child-specific pathways, waiver rules, or other current exceptions.'
    ],
    relatedGuides: [
      { title: 'IEP Request Guide', url: '/situations/iep-evaluation-request' },
      { title: 'Guides & Resources Index', url: '/benefits' }
    ],
    officialSources: ([
      {
        name: 'California Department of Developmental Services',
        url: 'https://www.dds.ca.gov',
        verificationStatus: resolvePublicSourceVerificationStatus(null, true),
        sourceType: 'official_state',
        confidenceScore: null,
        lastReviewedDate: diag.last_verified_date || null,
      },
      {
        name: 'California Department of Education',
        url: 'https://www.cde.ca.gov',
        verificationStatus: resolvePublicSourceVerificationStatus(null, true),
        sourceType: 'official_state',
        confidenceScore: null,
        lastReviewedDate: diag.last_verified_date || null,
      }
    ]),
    lastReviewedDate: diag.last_verified_date || '',
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

  return <AnswerPage data={dynamicData} counties={counties} />;
}
