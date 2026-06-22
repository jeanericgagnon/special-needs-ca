import { getCounties, getProgramWaitlists } from '@/lib/db';
import WizardClient from './wizard-client';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

import { DIAGNOSES } from '@/lib/diagnoses';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ablefull — 50-State Disability Benefits Guide',
  description: 'Find disability benefits, waiver programs, IEP advocacy, and early intervention resources for your child — across all 50 states.',
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
      <div style={{ 
        background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)', 
        borderBottom: '1px solid #cbd5e1', 
        padding: '0.75rem 1rem', 
        textAlign: 'center', 
        fontSize: '0.9rem', 
        color: '#334155', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '0.5rem', 
        flexWrap: 'wrap',
        fontFamily: "'Outfit', sans-serif"
      }}>
        <span style={{ fontWeight: 500 }}>Compare IEP dispute win/loss rates & inclusion metrics across school districts:</span>
        <Link href="/school-districts" className="home-explore-link">
          Explore School District Dashboards →
        </Link>
      </div>
      <WizardClient counties={counties} diagnosesList={DIAGNOSES} waitlists={waitlists} />
    </>
  );
}
