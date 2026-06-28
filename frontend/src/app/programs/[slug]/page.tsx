import { notFound } from 'next/navigation';
import { SEO_CLUSTERS, getClusterSourceConfidence } from '@/lib/seo-data';
import { getCounties, getProgramBySlug, getAllPrograms, getStateByIdOrCode } from '@/lib/db';
import AnswerPage from '@/app/components/answer-page';
import { getSeoPolicyForRoute, hasOfficialProgramSource, assertNoPlaceholderData } from '@/lib/seo-policy';

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
  if (cluster) {
    const policy = getSeoPolicyForRoute('static-page', {
      path: `/programs/${slug}`
    }, {
      hasNoPlaceholderData: assertNoPlaceholderData(JSON.stringify(cluster)),
      hasOfficialSource: Array.isArray(cluster.officialSources) && cluster.officialSources.some((source) => hasOfficialProgramSource(source.url)),
      lastVerifiedDate: cluster.lastReviewedDate || null,
      confidenceScore: getClusterSourceConfidence(cluster)
    });
    return {
      title: cluster.metaTitle,
      description: cluster.metaDescription,
      alternates: {
        canonical: `/${cluster.category}/${slug}`
      },
      robots: policy.index ? undefined : { index: false, follow: true }
    };
  }

  const program = await getProgramBySlug(slug);
  if (program) {
    const stateData = program.state_id ? await getStateByIdOrCode(program.state_id) : null;
    const stateName = stateData ? stateData.name : 'California';
    return {
      title: `${program.program_name} ${stateName} Guide`,
      description: `Review the current public program record for ${program.program_name} in ${stateName}, then confirm eligibility, requirements, and application steps against the linked source before relying on it.`,
      alternates: {
        canonical: `/programs/${slug}`
      },
      robots: { index: false, follow: true }
    };
  }

  return {
    title: 'Program Page Not Found',
    robots: { index: false, follow: true }
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
  const hasVerifiedSource = Boolean(program.source_url);
  const hasTargetDemographic = Boolean(program.target_demographic?.trim());
  const hasDiagnosisSignal = Boolean(program.diagnosis_required?.trim());
  const hasAgeRange = Number.isFinite(program.age_limit_min) || Number.isFinite(program.age_limit_max);
  const incomeSummary = program.income_limit?.trim() ? program.income_limit.trim() : null;
  const verificationStatus = program.verification_status || 'source_listed';
  const sourceLabel = program.source_type
    ? program.source_type.replace(/_/g, ' ')
    : 'program source';
  const officialSources = program.source_url
    ? [
        {
          name: `${stateName} program source`,
          url: program.source_url,
          sourceType: sourceLabel,
          confidenceScore: program.confidence_score ?? null,
          verificationStatus,
          lastReviewedDate: program.last_verified_date || program.last_scraped_at || null
        }
      ]
    : [];

  // Construct dynamic SEOPageData on the fly
  const dynamicData = {
    slug: slug,
    category: 'programs' as const,
    title: `${program.program_name} ${stateName} Guide`,
    metaTitle: `${program.program_name} | ${stateName} program guide`,
    metaDescription: `Review the current public record, eligibility signals, and next-step guidance for ${program.program_name} in ${stateName}, then confirm details against the linked source.`,
    quickAnswer: hasVerifiedSource
      ? `This page summarizes the currently saved public source for ${program.program_name} in ${stateName}. Eligibility, age rules, and income details may change, so confirm them against the linked source before you act.`
      : `We have a program record for ${program.program_name} in ${stateName}, but we are still verifying the public source details before treating this page as authoritative guidance.`,
    tldrPoints: [
      { label: 'Audience', value: hasTargetDemographic ? program.target_demographic : 'Still being verified' },
      { label: 'Age Range', value: hasAgeRange ? `${program.age_limit_min} - ${program.age_limit_max} yrs` : 'Still being verified' },
      { label: 'Income Rule', value: incomeSummary || 'Check the source link' },
      { label: 'County Specific', value: program.county_specific || 'Statewide' }
    ],
    whenThisMatters: `Use this page when you want a starting point for ${program.program_name} in ${stateName}, then confirm the final rules, forms, deadlines, and local routing through the linked public source.`,
    signsThisMayApply: [
      hasAgeRange ? `The published eligibility notes reference ages ${program.age_limit_min} through ${program.age_limit_max}.` : 'The published source may include age or stage-based eligibility rules.',
      hasTargetDemographic ? `The source describes the program as serving: ${program.target_demographic}.` : 'The source describes a target audience, diagnosis group, or support need that may fit your family.',
      hasDiagnosisSignal ? `The saved qualification notes mention: ${program.diagnosis_required}.` : 'You have a diagnosis, disability, or need that may match the program, but the public criteria still need verification.'
    ],
    whatToDoFirst: [
      'Open the linked public source and confirm the program is still active.',
      'Write down any eligibility rules, deadlines, and required forms shown on the source.',
      'Gather diagnosis, identity, insurance, or school records that the source says are needed.',
      'Use the linked office, intake, or application route from the source before you submit anything.'
    ],
    documentsToGather: [
      { name: 'Identity and residency records', description: `Keep your current ${stateName} identity and address records ready if the official source asks for them.` },
      { name: 'Diagnosis or eligibility records', description: 'Bring the medical, educational, or functional documentation named on the public source.' }
    ],
    whoToCall: hasVerifiedSource
      ? [
          {
            name: `${stateName} program contact`,
            description: 'Use the phone number, office, or intake route listed on the linked public source.'
          }
        ]
      : [
          {
            name: `${stateName} program source`,
            description: 'We are still verifying the public contact route for this program. Open the source link first before relying on this page.'
          }
        ],
    whatToSay: `I am trying to confirm whether ${program.program_name} is the right fit for my family, what the current eligibility rules are, and which application steps or forms you want me to use.`,
    commonMistakes: [
      'Relying on this summary without opening the linked source and checking the current rules.',
      'Assuming a statewide page automatically handles local intake, deadlines, or county routing.',
      'Submitting paperwork before confirming which forms and signatures the public source requires today.'
    ],
    relatedGuides: [
      { title: 'Guides & Resources Index', url: '/benefits' }
    ],
    officialSources,
    lastReviewedDate: program.last_verified_date || program.last_scraped_at || '',
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
