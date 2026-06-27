import type { Metadata } from 'next';
import LaunchToolLanding from '@/app/components/launch-tool-landing';

const sources = [
  {
    name: 'Medicaid.gov program and eligibility information',
    url: 'https://www.medicaid.gov/',
    verificationStatus: 'official_verified',
  },
  {
    name: 'Social Security Administration SSI for children',
    url: 'https://www.ssa.gov/ssi/text-child-ussi.htm',
    verificationStatus: 'official_verified',
  },
  {
    name: 'U.S. Department of Education IDEA information',
    url: 'https://sites.ed.gov/idea/',
    verificationStatus: 'official_verified',
  },
];

export const metadata: Metadata = {
  title: 'Disability Benefits Matcher and Program Guide Hub',
  description:
    'Use Ablefull’s benefits matcher hub to move from diagnosis, age, county, and needs into source-backed program paths, application steps, forms, deadlines, and appeals.',
  alternates: {
    canonical: '/benefits',
  },
};

export default function BenefitsPage() {
  return (
    <LaunchToolLanding
      eyebrow="Benefits matcher"
      title="Find benefits, forms, and next steps by diagnosis, age, county, and need"
      description="Ablefull’s public benefits hub is designed to help families move from a child’s diagnosis and needs into source-backed Medicaid, waiver, school, and early-intervention paths. The private workflow is for saving progress, but the public matcher and guides should help you understand the official lanes first."
      bullets={[
        'Start with state and county routing so you know which official DD, Medicaid, education, or early-intervention system owns the next step.',
        'Use source-backed program guides to compare eligibility rules, document requirements, application steps, and appeal paths before acting.',
        'Open the private workflow only when you want to save a plan, keep evidence checklists, or track deadlines across multiple programs.',
      ]}
      primaryCtaLabel="Open California benefits guides"
      primaryCtaHref="/benefits/california"
      secondaryCtaLabel="Browse public forms and checklists"
      secondaryCtaHref="/forms"
      disclaimer="Ablefull does not promise approval, eligibility, or payment amounts. Benefit paths, deadlines, and forms still need to be confirmed against the linked public sources for the exact state, county, and program."
      sources={sources}
      correctionSuggestionType="program"
    />
  );
}
