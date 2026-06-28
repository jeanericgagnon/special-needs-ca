import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Financial planning workflow redirect | Ablefull',
  description: 'This helper route redirects families into the private financial planning workflow and is intentionally excluded from indexing.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/financial-planning',
  },
};

export default function PlanningPage() {
  redirect('/dashboard?tab=dds&sub=eligibility');
}
