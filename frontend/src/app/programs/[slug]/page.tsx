import { notFound } from 'next/navigation';
import { SEO_CLUSTERS } from '@/lib/seo-data';
import { getCounties, getProgramBySlug } from '@/lib/db';
import AnswerPage from '@/app/components/answer-page';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cluster = SEO_CLUSTERS[slug];
  if (cluster) {
    return {
      title: cluster.metaTitle,
      description: cluster.metaDescription,
    };
  }

  const program = getProgramBySlug(slug);
  if (program) {
    return {
      title: `${program.program_name} California Guide`,
      description: `Learn about eligibility, requirements, and how to apply for ${program.program_name} in California.`,
    };
  }

  return {
    title: 'Program Page Not Found',
  };
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const counties = getCounties().map(c => ({ id: c.id, name: c.name }));

  const cluster = SEO_CLUSTERS[slug];
  if (cluster && cluster.category === 'programs') {
    return <AnswerPage data={cluster} counties={counties} />;
  }

  // Fallback to DB query
  const program = getProgramBySlug(slug);
  if (!program) {
    notFound();
  }

  // Construct dynamic SEOPageData on the fly
  const dynamicData = {
    slug: slug,
    category: 'programs' as const,
    title: `${program.program_name} California Guide`,
    metaTitle: `${program.program_name} | California Eligibility & Application`,
    metaDescription: `Find out if you qualify for ${program.program_name} in California. Learn about income limits, age rules, and required evidence.`,
    quickAnswer: `The ${program.program_name} is a California program targeting ${program.target_demographic}. It has an age limit of ${program.age_limit_min} to ${program.age_limit_max} years. The income requirement is stated as: ${program.income_limit || 'None specified'}.`,
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
      { name: 'Proof of residency', description: 'California driver license, utility bill, or equivalent.' }
    ],
    whoToCall: [
      { name: 'California DHCS Office', number: '(916) 440-7400', description: 'Department of Health Care Services administrative office.' }
    ],
    whatToSay: `I am calling to check eligibility for my child for the ${program.program_name}.`,
    commonMistakes: [
      'Assuming you do not qualify before submitting an application.',
      'Submitting incomplete clinical reports or missing signatures.'
    ],
    relatedGuides: [
      { title: 'Guides & Resources Index', url: '/benefits' }
    ],
    officialSources: [
      { name: 'California State Program Portal', url: program.source_url || 'https://www.dhcs.ca.gov' }
    ],
    lastReviewedDate: '2026-06-01',
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

  return <AnswerPage data={dynamicData} counties={counties} />;
}
