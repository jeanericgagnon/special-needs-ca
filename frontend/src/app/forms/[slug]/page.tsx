import { notFound, redirect } from 'next/navigation';
import { SEO_CLUSTERS } from '@/lib/seo-data';
import { getCounties } from '@/lib/db';
import AnswerPage from '@/app/components/answer-page';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const params: { slug: string }[] = [{ slug: 'soc-821' }];
  for (const key of Object.keys(SEO_CLUSTERS)) {
    if (SEO_CLUSTERS[key].category === 'forms') {
      params.push({ slug: key });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  
  const cluster = SEO_CLUSTERS[slug];
  if (cluster) {
    return {
      title: cluster.metaTitle,
      description: cluster.metaDescription,
      alternates: {
        canonical: `/forms/${slug}`
      },
      robots: { index: false, follow: true }
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
  if (cluster && cluster.category === 'forms') {
    return <AnswerPage slug={slug} counties={counties} />;
  }

  notFound();
}

