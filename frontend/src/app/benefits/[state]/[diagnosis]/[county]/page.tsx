import CatchAllPage, { generateMetadata as catchAllGenerateMetadata } from '../../[[...slug]]/page';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ state: string; diagnosis: string; county: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  return catchAllGenerateMetadata({
    params: Promise.resolve({
      state: p.state,
      slug: [p.diagnosis, p.county]
    })
  });
}

export default async function Page({ params }: Props) {
  const p = await params;
  return (
    <CatchAllPage 
      params={Promise.resolve({
        state: p.state,
        slug: [p.diagnosis, p.county]
      })} 
    />
  );
}
