import { getCounties, getProgramWaitlists } from '@/lib/db';
import WizardClient from './wizard-client';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

import { DIAGNOSES } from '@/lib/diagnoses';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Special Needs California Navigator',
  description: 'Navigate special needs benefits, IHSS protective supervision caregiver hours, Regional Center intakes, and school IEP services in California.',
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
    </>
  );
}
