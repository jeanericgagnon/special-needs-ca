import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Appeals workflow redirect | Ablefull',
  description: 'This helper route redirects families into the private appeals workflow and is intentionally excluded from indexing.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/appeals-center',
  },
};

export default function AppealsCenterPage() {
  redirect('/dashboard?tab=appeals');
}
