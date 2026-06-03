import { redirect } from 'next/navigation';

export default function IepGoalsPage() {
  redirect('/dashboard?tab=iep');
}
