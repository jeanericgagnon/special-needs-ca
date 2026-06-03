import { notFound, redirect } from 'next/navigation';
import { SEO_CLUSTERS } from '@/lib/seo-data';
import { getCounties } from '@/lib/db';
import AnswerPage from '@/app/components/answer-page';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (slug === 'soc-821') {
    const target = SEO_CLUSTERS['ihss-protective-supervision'];
    if (target) {
      return {
        title: target.metaTitle,
        description: target.metaDescription,
      };
    }
  }
  
  const cluster = SEO_CLUSTERS[slug];
  if (cluster) {
    return {
      title: cluster.metaTitle,
      description: cluster.metaDescription,
    };
  }

  return {
    title: 'Form Guide Not Found',
  };
}

export default async function FormPage({ params }: Props) {
  const { slug } = await params;
  
  if (slug === 'soc-821') {
    redirect('/situations/ihss-protective-supervision');
  }
  
  const counties = getCounties().map(c => ({ id: c.id, name: c.name }));

  const cluster = SEO_CLUSTERS[slug];
  if (cluster && cluster.category === 'forms') {
    return <AnswerPage data={cluster} counties={counties} />;
  }

  notFound();
}

