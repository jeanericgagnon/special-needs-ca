import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ state: string; county: string }>;
};

export const metadata: Metadata = {
  title: 'County route redirect | Ablefull',
  description: 'This helper route redirects legacy county URLs into the current benefits surface and is intentionally excluded from indexing.',
  robots: {
    index: false,
    follow: true,
  },
};

export default async function CountyDetailRedirectPage({ params }: Props) {
  const { state, county } = await params;
  redirect(`/benefits/${state}/${county}`);
}
