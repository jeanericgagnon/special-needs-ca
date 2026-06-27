import React from 'react';
import { Metadata } from 'next';
import FindHelpClient from './find-help-client';
import { getDirectoryFoundationSnapshot } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Parent Support & Special Needs Tools Hub | Ablefull',
  description: 'Explore Ablefull\'s source-backed parent toolkit for disability benefits guidance, county resource directories, IEP timeline calculators, and planning tools.',
  alternates: {
    canonical: '/find-help',
  },
};

export default async function FindHelpPage() {
  const foundationSnapshot = await getDirectoryFoundationSnapshot();
  return <FindHelpClient foundationSnapshot={foundationSnapshot} />;
}
