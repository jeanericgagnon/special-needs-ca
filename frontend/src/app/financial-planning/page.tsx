import type { Metadata } from 'next';
import PlanningClient from './planning-client';

export const metadata: Metadata = {
  title: "CalABLE vs Special Needs Trust (SNT) Planner",
  description: "Protect your child's Medi-Cal and SSI eligibility. Simulate the $2,000 asset limit and determine the best savings strategy using CalABLE accounts and Special Needs Trusts (SNT).",
  openGraph: {
    title: "CalABLE vs Special Needs Trust (SNT) Planner",
    description: "Protect your child's Medi-Cal and SSI eligibility. Simulate the $2,000 asset limit and determine the best savings strategy using CalABLE accounts and Special Needs Trusts (SNT).",
    type: "website",
  }
};

export default function PlanningPage() {
  return <PlanningClient />;
}
