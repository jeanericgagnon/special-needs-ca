import type { Metadata } from 'next';
import LaunchToolLanding from '@/app/components/launch-tool-landing';

const SOURCE_CONFIDENCE = 0.95;

const sources = [
  {
    name: 'California Department of Developmental Services regional center information',
    url: 'https://www.dds.ca.gov/rc/',
    verificationStatus: 'official_verified',
    sourceType: 'official_state',
    confidenceScore: SOURCE_CONFIDENCE,
  },
  {
    name: 'California Lanterman Act and consumer rights resources',
    url: 'https://www.dds.ca.gov/general/appeals-complaints-comments/',
    verificationStatus: 'official_verified',
    sourceType: 'official_state',
    confidenceScore: SOURCE_CONFIDENCE,
  },
];

export const metadata: Metadata = {
  title: 'Regional Center Funding Roadmap',
  description:
    'Understand how Ablefull’s regional center roadmap helps California families organize service requests, respite questions, and funding follow-ups before saving a working plan in the dashboard.',
  alternates: {
    canonical: '/regional-center-funding',
  },
};

export default function FundingPage() {
  return (
    <LaunchToolLanding
      eyebrow="California DDS roadmap"
      title="Regional center funding and service roadmap"
      description="This public landing page explains how families can organize California regional center requests, respite planning, Purchase of Service questions, and appeal follow-ups before saving notes in their private dashboard workflow."
      bullets={[
        'Start with the regional center intake or service coordinator lane that matches your county so you know which office owns your request.',
        'Track the documents, service notes, and follow-up questions that usually matter for respite, social recreation, self-determination, or Purchase of Service discussions.',
        'Use the private planner only when you are ready to save a roadmap, keep notes by child, or prepare for an IPP, denial, or complaint conversation.',
      ]}
      primaryCtaLabel="Open the private DDS roadmap"
      primaryCtaHref="/dashboard?tab=dds&sub=respite"
      secondaryCtaLabel="Review California county routes"
      secondaryCtaHref="/benefits/california"
      disclaimer="This page is source-backed guidance for California families, not a promise of funding or service approval. Regional center eligibility, POS policy, and appeal rights still have to be confirmed against the current DDS or regional center source material."
      sources={sources}
      correctionSuggestionType="other"
    />
  );
}
