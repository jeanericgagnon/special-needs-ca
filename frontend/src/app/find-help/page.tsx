import React from 'react';
import { Metadata } from 'next';
import FindHelpClient from './find-help-client';
import { getDirectoryFoundationSnapshot } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Parent Support & Special Needs Tools Hub | Ablefull',
  description: 'Explore Ablefull\'s parent toolkit for special needs guidance: state benefits wizard, county resource directories, statutory IEP timeline calculators, and IEP goal builders.',
  alternates: {
    canonical: '/find-help',
  },
};

export default async function FindHelpPage() {
  const foundationSnapshot = await getDirectoryFoundationSnapshot();
  return <FindHelpClient foundationSnapshot={foundationSnapshot} />;
}
