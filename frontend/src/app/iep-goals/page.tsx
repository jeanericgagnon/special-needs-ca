import type { Metadata } from 'next';
import IepGoalsClient from './iep-goals-client';

export const metadata: Metadata = {
  title: "IEP Accommodations & SMART Goals Generator",
  description: "Generate customized, parent-friendly IEP accommodations and SMART goals tailored to your child's specific needs, diagnosis, and grade band. Perfect for CA Special Education planning.",
  openGraph: {
    title: "IEP Accommodations & SMART Goals Generator",
    description: "Generate customized, parent-friendly IEP accommodations and SMART goals tailored to your child's specific needs, diagnosis, and grade band.",
    type: "website",
  }
};

export default function IepGoalsPage() {
  return <IepGoalsClient />;
}
