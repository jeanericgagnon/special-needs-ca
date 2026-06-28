import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getCounties, getFunctionalNeeds } from '@/lib/db';
import { DIAGNOSES } from '@/lib/diagnoses';
import RegisterClient from './register-client';

export const metadata: Metadata = {
  title: 'Create account | Ablefull',
  description: 'Create an Ablefull account to save private plans and documents. This account page is excluded from indexing.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/register',
  },
};

export default async function RegisterPage() {
  // Server-side auth check
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  const session = token ? verifyToken(token) : null;

  if (session) {
    redirect('/dashboard');
  }

  // Fetch counties & functional needs dynamically from database
  const counties = await getCounties();
  const needs = await getFunctionalNeeds();

  return (
    <RegisterClient 
      counties={counties} 
      diagnosesList={DIAGNOSES} 
      needsList={needs} 
    />
  );
}
