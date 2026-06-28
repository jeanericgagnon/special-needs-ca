import { notFound } from 'next/navigation';
import { SEO_CLUSTERS, isPublicSourceBackedFormGuideSlug } from '@/lib/seo-data';
import { getCounties } from '@/lib/db';
import AnswerPage from '@/app/components/answer-page';
import { getSeoPolicyForRoute, hasOfficialProgramSource } from '@/lib/seo-policy';
import { getSafePublishedFormGuideBySlug, getSafePublishedFormGuides } from '@/lib/publishedFormGuides';
import { resolvePublicSourceVerificationStatus } from '@/lib/sourceReviewLabels';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const params: { slug: string }[] = [{ slug: 'soc-821' }];
  for (const key of Object.keys(SEO_CLUSTERS)) {
    if (isPublicSourceBackedFormGuideSlug(key)) {
      params.push({ slug: key });
    }
  }
  try {
    const publishedCaliforniaForms = await getSafePublishedFormGuides('california');
    for (const form of publishedCaliforniaForms) {
      if (form.slug && !params.some((param) => param.slug === form.slug)) {
        params.push({ slug: form.slug });
      }
    }
  } catch {}
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  
  const cluster = SEO_CLUSTERS[slug];
  const publishedForm = await getSafePublishedFormGuideBySlug(slug, 'california');

  if (!isPublicSourceBackedFormGuideSlug(slug) && !publishedForm) {
    return {
      title: 'Form Guide Not Available',
      robots: { index: false, follow: true }
    };
  }
  if (cluster) {
    const policy = getSeoPolicyForRoute('static-page', {
      path: `/forms/${slug}`
    }, {
      hasNoPlaceholderData: true,
      hasOfficialSource: Array.isArray(cluster.officialSources) && cluster.officialSources.some((source) => hasOfficialProgramSource(source.url)),
      lastVerifiedDate: cluster.lastReviewedDate || null,
      confidenceScore: 0.85
    });
    return {
      title: cluster.metaTitle,
      description: cluster.metaDescription,
      alternates: {
        canonical: `/forms/${slug}`
      },
      robots: policy.index ? undefined : { index: false, follow: true }
    };
  }

  if (publishedForm) {
    const lastReviewedDate = publishedForm.last_checked_at || publishedForm.last_verified_at || null;
    const policy = getSeoPolicyForRoute('static-page', {
      path: `/forms/${slug}`
    }, {
      hasNoPlaceholderData: true,
      hasOfficialSource: hasOfficialProgramSource(publishedForm.source_url || '') || hasOfficialProgramSource(publishedForm.pdf_url || ''),
      lastVerifiedDate: lastReviewedDate,
      confidenceScore: typeof publishedForm.confidence_score === 'number' ? publishedForm.confidence_score : null
    });

    return {
      title: `${publishedForm.form_type || 'California Form'} | ${publishedForm.title}`,
      description: publishedForm.description || `Source-backed California form guide for ${publishedForm.title}.`,
      alternates: {
        canonical: `/forms/${slug}`
      },
      robots: policy.index ? undefined : { index: false, follow: true }
    };
  }

  return {
    title: 'Form Guide Not Found',
    robots: { index: false, follow: true }
  };
}

export default async function FormPage({ params }: Props) {
  const { slug } = await params;
  
  const counties = (await getCounties()).map(c => ({ id: c.id, name: c.name }));

  const cluster = SEO_CLUSTERS[slug];
  if (cluster && isPublicSourceBackedFormGuideSlug(slug)) {
    return <AnswerPage slug={slug} counties={counties} />;
  }

  const publishedForm = await getSafePublishedFormGuideBySlug(slug, 'california');

  if (publishedForm) {
    const sourceUrl = publishedForm.source_url || publishedForm.pdf_url || '';
    const sourceTypeLabel = publishedForm.evidence_level
      ? publishedForm.evidence_level.replace(/_/g, ' ')
      : 'published california source pack';
    const title = publishedForm.title || publishedForm.form_type || 'California form guide';
    const signer = publishedForm.who_signs_it?.trim() || 'See the source instructions for who must sign.';
    const submissionRoute = publishedForm.where_to_send_it?.trim() || 'Confirm the current submission route on the linked public source.';
    const quickAnswer = publishedForm.description?.trim()
      ? `${publishedForm.description.trim()} Confirm the latest signer, deadline, and submission route on the linked California source before you act.`
      : `This California form is currently published from the source-pack pipeline. Use the linked public source to confirm the latest signer, submission route, and revision details before you act.`;
    const officialSources = sourceUrl
      ? [{
          name: publishedForm.agency || 'California published form source',
          url: sourceUrl,
          sourceType: sourceTypeLabel,
          confidenceScore: typeof publishedForm.confidence_score === 'number' ? publishedForm.confidence_score : null,
          verificationStatus: resolvePublicSourceVerificationStatus(publishedForm.verification_status, Boolean(sourceUrl)),
          lastReviewedDate: publishedForm.last_checked_at || publishedForm.last_verified_at || null
        }]
      : [];

    const dynamicData = {
      slug,
      category: 'forms' as const,
      title,
      metaTitle: `${publishedForm.form_type || 'California form'} | ${title}`,
      metaDescription: publishedForm.description || `Source-backed California form guide for ${title}.`,
      quickAnswer,
      tldrPoints: [
        { label: 'Form Type', value: publishedForm.form_type || 'Published form' },
        { label: 'Agency', value: publishedForm.agency || 'California agency source' },
        { label: 'Signer', value: signer },
        { label: 'Submission', value: submissionRoute }
      ],
      whenThisMatters: `Use this page when you need the current California source link, signer, and submission route for ${title}.`,
      signsThisMayApply: [
        `You need ${title} for a California disability, appeal, or benefits workflow.`,
        publishedForm.who_uses_it?.trim() || 'The source-pack record identifies a direct form or guide use case for families or applicants.',
        'You want a linked public source before downloading or submitting anything.'
      ],
      whatToDoFirst: [
        'Open the linked California source and confirm the form or guide is still current.',
        'Check whether the source shows a revision date, mailing route, portal route, or county-specific instructions.',
        'Confirm who must sign the form before you fill it out.',
        'Save a copy of the linked source and note the last-checked date shown on this page.'
      ],
      documentsToGather: [
        { name: 'Current form source', description: 'Open the linked California source and save the current PDF or page before you act.', downloadUrl: publishedForm.pdf_url || publishedForm.source_url || undefined },
        { name: 'Supporting records', description: 'Gather the records or notices referenced by the source before you submit the form.' }
      ],
      whoToCall: [
        { name: publishedForm.agency || 'California issuing agency', description: 'Use the linked source page to confirm the current intake office, county office, or appeals route.' }
      ],
      whatToSay: `I am trying to use ${title}. Please confirm who must sign it, where it should be submitted, and whether there is a newer revision or county-specific routing I should use.`,
      commonMistakes: [
        'Submitting the form without checking whether the source now points to a newer revision.',
        'Assuming the signer or mailing route on an older copy is still current.',
        'Treating a statewide form as self-executing without checking county or agency submission instructions.'
      ],
      relatedGuides: [
        { title: 'California Forms Hub', url: '/forms' },
        { title: 'Guides & Resources Index', url: '/benefits' }
      ],
      officialSources,
      lastReviewedDate: publishedForm.last_checked_at || publishedForm.last_verified_at || '',
      callScriptTemplate: {
        intro: `${publishedForm.form_type || 'California form'} confirmation call script`,
        script: `Hello, I am calling to confirm the current instructions for ${title}. Please tell me who must sign it, where it should be submitted, and whether the source page linked here is the current version.`,
        tips: 'Write down the agency name, submission route, and any revision details they confirm.'
      }
    };

    return <AnswerPage data={dynamicData} counties={counties} />;
  }

  notFound();
}
