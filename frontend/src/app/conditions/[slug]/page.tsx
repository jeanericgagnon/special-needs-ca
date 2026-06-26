import { permanentRedirect } from 'next/navigation';
import { SEO_CLUSTERS } from '@/lib/seo-data';
import { DIAGNOSES_DETAILS } from '@/lib/diagnoses';

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
  permanentRedirect(`/benefits/california/${slug}`);
}

export default async function ConditionPage({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/benefits/california/${slug}`);
}
