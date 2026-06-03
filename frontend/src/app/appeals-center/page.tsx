import { redirect } from 'next/navigation';

export default function AppealsCenterPage() {
  redirect('/dashboard?tab=appeals');
}
