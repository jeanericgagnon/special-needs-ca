import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ state: string; county: string }>;
};

export default async function CountyDetailRedirectPage({ params }: Props) {
  const { state, county } = await params;
  redirect(`/benefits/${state}/${county}`);
}
