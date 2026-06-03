import { redirect } from 'next/navigation';

export default function FundingPage() {
  redirect('/dashboard?tab=dds&sub=respite');
}
