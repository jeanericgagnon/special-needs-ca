import { redirect } from 'next/navigation';

export default function PlanningPage() {
  redirect('/dashboard?tab=dds&sub=eligibility');
}
