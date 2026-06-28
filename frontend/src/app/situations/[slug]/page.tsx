import { notFound } from 'next/navigation';
import { SEO_CLUSTERS, getClusterSourceConfidence } from '@/lib/seo-data';
import { getCounties } from '@/lib/db';
import AnswerPage from '@/app/components/answer-page';
import { getSeoPolicyForRoute, hasOfficialProgramSource } from '@/lib/seo-policy';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const key of Object.keys(SEO_CLUSTERS)) {
    if (SEO_CLUSTERS[key].category === 'situations') {
      params.push({ slug: key });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cluster = SEO_CLUSTERS[slug];
  if (cluster) {
    const policy = getSeoPolicyForRoute('static-page', {
      path: `/situations/${slug}`
    }, {
      hasNoPlaceholderData: true,
      hasOfficialSource: Array.isArray(cluster.officialSources) && cluster.officialSources.some((source) => hasOfficialProgramSource(source.url)),
      lastVerifiedDate: cluster.lastReviewedDate || null,
      confidenceScore: getClusterSourceConfidence(cluster)
    });
    return {
      title: cluster.metaTitle,
      description: cluster.metaDescription,
      alternates: {
        canonical: `/situations/${slug}`
      },
      robots: policy.index ? undefined : { index: false, follow: true }
    };
  }

  return {
    title: 'Situation Guide Not Found',
    robots: { index: false, follow: true }
  };
}

export default async function SituationPage({ params }: Props) {
  const { slug } = await params;
  const counties = (await getCounties()).map(c => ({ id: c.id, name: c.name }));

  const cluster = SEO_CLUSTERS[slug];
  if (cluster && cluster.category === 'situations') {
    return <AnswerPage slug={slug} counties={counties} />;
  }

  notFound();
}
