import type { Metadata } from 'next';
import LaunchToolLanding from '@/app/components/launch-tool-landing';

const LAST_REVIEWED_DATE = '2026-06-20';
const FEDERAL_SOURCE_CONFIDENCE = 0.93;
const STATE_SOURCE_CONFIDENCE = 0.94;

const sources = [
  {
    name: 'U.S. Department of Education IDEA information',
    url: 'https://sites.ed.gov/idea/',
    verificationStatus: 'official_verified',
    lastReviewedDate: LAST_REVIEWED_DATE,
    sourceType: 'official_federal',
    confidenceScore: FEDERAL_SOURCE_CONFIDENCE,
  },
  {
    name: 'California Department of Education special education rights and dispute resources',
    url: 'https://www.cde.ca.gov/sp/se/',
    verificationStatus: 'official_verified',
    lastReviewedDate: LAST_REVIEWED_DATE,
    sourceType: 'official_state',
    confidenceScore: STATE_SOURCE_CONFIDENCE,
  },
];

export const metadata: Metadata = {
  title: 'IEP Goal Builder and Parent Request Letter Tool',
  description:
    'Learn how Ablefull’s IEP goal builder helps families draft measurable school requests, organize accommodations, and save working notes privately after reviewing public IDEA and California special education sources.',
  alternates: {
    canonical: '/iep-goals',
  },
};

export default function IepGoalsPage() {
  return (
    <LaunchToolLanding
      eyebrow="Special education tool"
      title="IEP goal builder and parent letter workflow"
      description="This landing page explains how the IEP tool helps families turn needs into measurable school requests, document concerns before meetings, and save drafts privately. The live working editor stays inside your account, but the public entry page gives parents a source-backed overview first."
      bullets={[
        'Use the builder to organize current performance concerns, draft measurable goals, and keep parent language consistent before the meeting.',
        'Pair the goal workflow with evaluation requests, records requests, or disagreement letters when you need a dated paper trail.',
        'Treat the generated language as a starting point that should still be compared against your district’s current policies and the official special education safeguards in your state.',
      ]}
      primaryCtaLabel="Open the private IEP builder"
      primaryCtaHref="/dashboard?tab=iep"
      secondaryCtaLabel="Review special education guides"
      secondaryCtaHref="/find-help"
      disclaimer="This page provides source-backed educational guidance, not legal advice. School districts can require local forms, timelines, and dispute steps that must be confirmed against current official state or district materials."
      sources={sources}
      correctionSuggestionType="other"
    />
  );
}
