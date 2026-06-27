import { getCounties, getProgramWaitlists } from '@/lib/db';
import WizardClient from './wizard-client';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import SourceFreshnessDisclosure from '@/app/components/SourceFreshnessDisclosure';

import { DIAGNOSES } from '@/lib/diagnoses';
import { Metadata } from 'next';

const LAST_REVIEWED_DATE = '2026-06-27';
const SOURCE_CONFIDENCE = 0.95;

const HOMEPAGE_SOURCES = [
  {
    name: 'Medicaid.gov program and eligibility information',
    url: 'https://www.medicaid.gov/',
    verificationStatus: 'official_verified',
    lastReviewedDate: LAST_REVIEWED_DATE,
    sourceType: 'official_federal',
    confidenceScore: SOURCE_CONFIDENCE,
  },
  {
    name: 'Social Security Administration SSI for children',
    url: 'https://www.ssa.gov/ssi/text-child-ussi.htm',
    verificationStatus: 'official_verified',
    lastReviewedDate: LAST_REVIEWED_DATE,
    sourceType: 'official_federal',
    confidenceScore: SOURCE_CONFIDENCE,
  },
  {
    name: 'U.S. Department of Education IDEA information',
    url: 'https://sites.ed.gov/idea/',
    verificationStatus: 'official_verified',
    lastReviewedDate: LAST_REVIEWED_DATE,
    sourceType: 'official_federal',
    confidenceScore: SOURCE_CONFIDENCE,
  },
];

export const metadata: Metadata = {
  title: 'Ablefull — Source-Backed Disability Benefits & Family Action Guides',
  description: 'Find source-backed disability benefits, waiver pathways, IEP guidance, and early intervention next steps. California currently has the deepest public launch coverage, while other states may be launch-ready, partial, or gated.',
  alternates: {
    canonical: '/'
  }
};

export default async function Home() {
  // 1. Fetch counties dynamically from database
  const counties = await getCounties();

  // 1.5. Fetch waitlists dynamically from database
  const waitlists = await getProgramWaitlists();

  // 2. Read active session for quick dashboard link helper
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  const session = token ? verifyToken(token) : null;

  return (
    <>
      {session && (
        <div style={{ background: 'var(--primary-color)', color: 'white', padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
          You are logged in.{' '}
          <Link href="/dashboard" style={{ color: 'white', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.25rem' }}>
            <LayoutDashboard size={14} /> Go to Saved Plans →
          </Link>
        </div>
      )}
      <WizardClient counties={counties} diagnosesList={DIAGNOSES} waitlists={waitlists} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 3rem 1.5rem' }}>
        <SourceFreshnessDisclosure
          sources={HOMEPAGE_SOURCES}
          correctionSuggestionType="other"
          correctionTargetId="homepage-action-engine"
          correctionTargetName="Ablefull homepage"
          correctionButtonLabel="Report a homepage source issue"
        />
      </div>
    </>
  );
}
