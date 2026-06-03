import { notFound } from 'next/navigation';
import { SEO_CLUSTERS } from '@/lib/seo-data';
import { getCounties } from '@/lib/db';
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

  return {
    title: 'Deadline Guide Not Found',
  };
}

export default async function DeadlinePage({ params }: Props) {
  const { slug } = await params;
  const counties = getCounties().map(c => ({ id: c.id, name: c.name }));

  const cluster = SEO_CLUSTERS[slug];
  if (cluster && cluster.category === 'deadlines') {
    return <AnswerPage data={cluster} counties={counties} />;
  }

  notFound();
}
