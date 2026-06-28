import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'County directory redirect | Ablefull',
  description: 'This helper route redirects families into the current county directory entry point and is intentionally excluded from indexing.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/counties',
  },
};

export default function CountiesRootPage() {
  redirect('/counties/california');
}
