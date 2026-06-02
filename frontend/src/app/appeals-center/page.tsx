import type { Metadata } from 'next';
import AppealsClient from './appeals-client';

export const metadata: Metadata = {
  title: "CA Special Needs Appeals & Letter Builder",
  description: "Draft legally-backed appeal letters and assessment request letters. Tailored for California IEPs, IHSS Protective Supervision, Regional Center eligibility, and SSI denials. Uses official CA W&I and Education codes.",
  openGraph: {
    title: "CA Special Needs Appeals & Letter Builder",
    description: "Draft legally-backed appeal letters and assessment request letters. Tailored for California IEPs, IHSS Protective Supervision, Regional Center eligibility, and SSI denials.",
    type: "website",
  }
};

export default function AppealsCenterPage() {
  return <AppealsClient />;
}
