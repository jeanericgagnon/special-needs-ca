import { notFound } from 'next/navigation';
import { SEO_CLUSTERS } from '@/lib/seo-data';
import { getCounties } from '@/lib/db';
import AnswerPage from '@/app/components/answer-page';

import { getSeoPolicyForRoute, robotsForPolicy } from '@/lib/seo-policy';

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
    });
    return {
      title: cluster.metaTitle,
      description: cluster.metaDescription,
      alternates: {
        canonical: `/situations/${slug}`
      },
      robots: robotsForPolicy(policy)
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
