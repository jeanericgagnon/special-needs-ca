import { redirect } from 'next/navigation';

export default function BehaviorLogPage() {
  redirect('/dashboard?tab=ihss&sub=journal');
}
