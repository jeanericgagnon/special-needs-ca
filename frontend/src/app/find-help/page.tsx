import React from 'react';
import { Metadata } from 'next';
import FindHelpClient from './find-help-client';
import { getDirectoryFoundationSnapshot } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Parent Support & Special Needs Tools Hub | Ablefull',
  description: 'Explore Ablefull\'s parent toolkit for disability benefits guidance, county resource directories, IEP timeline calculators, and planning tools. This mixed hub stays noindex until each linked surface meets the current launch evidence gate.',
  alternates: {
    canonical: '/find-help',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default async function FindHelpPage() {
  const foundationSnapshot = await getDirectoryFoundationSnapshot();
  return <FindHelpClient foundationSnapshot={foundationSnapshot} />;
}
