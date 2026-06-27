import type { Metadata } from 'next';
import LaunchToolLanding from '@/app/components/launch-tool-landing';

const LAST_REVIEWED_DATE = '2026-06-20';
const SOURCE_CONFIDENCE = 0.95;

const sources = [
  {
    name: 'California Department of Social Services IHSS program information',
    url: 'https://www.cdss.ca.gov/in-home-supportive-services',
    verificationStatus: 'official_verified',
    lastReviewedDate: LAST_REVIEWED_DATE,
    sourceType: 'official_state',
    confidenceScore: SOURCE_CONFIDENCE,
  },
  {
    name: 'California Department of Social Services county IHSS office directory',
    url: 'https://www.cdss.ca.gov/inforesources/county-ihss-offices',
    verificationStatus: 'official_verified',
    lastReviewedDate: LAST_REVIEWED_DATE,
    sourceType: 'official_state',
    confidenceScore: SOURCE_CONFIDENCE,
  },
];

export const metadata: Metadata = {
  title: 'IHSS Protective Supervision Behavior Log',
  description:
    'Use Ablefull’s public IHSS behavior log landing page to understand what incidents to document, what county reviewers usually look for, and where to verify current California IHSS rules before saving your own log.',
  alternates: {
    canonical: '/ihss-behavior-log',
  },
};

export default function BehaviorLogPage() {
  return (
    <LaunchToolLanding
      eyebrow="California IHSS tool"
      title="IHSS behavior log and incident tracker"
      description="This landing page explains how families usually document wandering, self-injury, pica, and other safety incidents for California IHSS Protective Supervision requests. The saved working log still lives inside your private dashboard, but the public page stays crawlable so families can understand the process before signing in."
      bullets={[
        'Review the kinds of incident details county workers usually expect: date, time, trigger, risk, caregiver intervention, and what harm was prevented.',
        'See why ordinary supervision is usually not enough on its own and why California counties focus on non-self-direction and continuous safety risks.',
        'Jump into the private tool only when you are ready to save entries, print a log, or organize incidents for an appeal or reassessment.',
      ]}
      primaryCtaLabel="Open the saved log tool"
      primaryCtaHref="/dashboard?tab=ihss&sub=journal"
      secondaryCtaLabel="Review California county IHSS contacts"
      secondaryCtaHref="/counties/california"
      disclaimer="This page is informational and source-backed, but it is not legal advice and it does not promise approval. County IHSS decisions still depend on current official rules, your child’s records, and the county assessment."
      sources={sources}
      correctionSuggestionType="other"
    />
  );
}
