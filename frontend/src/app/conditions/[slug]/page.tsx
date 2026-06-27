import { notFound } from 'next/navigation';
import { SEO_CLUSTERS } from '@/lib/seo-data';
import { getCounties } from '@/lib/db';
import { DIAGNOSES_DETAILS } from '@/lib/diagnoses';
import AnswerPage from '@/app/components/answer-page';
import { getSeoPolicyForRoute, hasOfficialProgramSource } from '@/lib/seo-policy';

type Props = {
  params: Promise<{ slug: string }>;
};

const CONDITION_SOURCE_CONFIDENCE = 0.85;

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
      hasNoPlaceholderData: true,
      hasOfficialSource: Array.isArray(cluster.officialSources) && cluster.officialSources.some((source) => hasOfficialProgramSource(source.url)),
      lastVerifiedDate: cluster.lastReviewedDate || null,
      confidenceScore: CONDITION_SOURCE_CONFIDENCE,
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
      confidenceScore: CONDITION_SOURCE_CONFIDENCE,
    });
    return {
      title: `${diagnosis.name} Benefits in California | Program Guide`,
      description: `Learn which California public programs, school supports, and intake paths may apply for children with ${diagnosis.name}, and confirm each next step against current public sources.`,
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
    title: `${diag.name} Benefits in California: Complete Parent Guide`,
    metaTitle: `${diag.name} Benefits California | Lanterman Act & School Aid`,
    metaDescription: `Discover which California public benefits, therapies, and school support plans may apply for children with ${diag.name}, with source-backed next-step guidance.`,
    quickAnswer: `${diag.parent_friendly_explanation} In California, children with ${diag.name} may qualify for specialized public benefit and school-support pathways depending on their diagnosis details, functional needs, and current program rules. That can include IEP evaluations in public schools, Regional Center review under the Lanterman Act when developmental criteria are met, Medi-Cal, and Supplemental Security Income (SSI).`,
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
        verificationStatus: 'official_verified',
        sourceType: 'official_state',
        confidenceScore: CONDITION_SOURCE_CONFIDENCE,
        lastReviewedDate: diag.last_verified_date || null,
      },
      {
        name: 'California Department of Education',
        url: 'https://www.cde.ca.gov',
        verificationStatus: 'official_verified',
        sourceType: 'official_state',
        confidenceScore: CONDITION_SOURCE_CONFIDENCE,
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
