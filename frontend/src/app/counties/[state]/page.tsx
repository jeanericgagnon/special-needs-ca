import { getCounties, getStateByIdOrCode } from '@/lib/db';
import { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';
import CountiesClient from './counties-client';
import { getSeoPolicyForRoute } from '@/lib/seo-policy';

type Props = {
  params: Promise<{ state: string }>;
};

import { getDynamicStateConfig } from '@/lib/stateConfigs';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const stateData = await getStateByIdOrCode(p.state);
  if (!stateData) {
    return {
      title: 'State Resource Counties Directory',
      description: 'Find local county-level developmental disability support and resources.'
    };
  }

  const config = getDynamicStateConfig(stateData.id, stateData.name, stateData.code);
  const catchment = config.catchmentName;
  const counties = await getCounties(stateData.id);
  const policy = getSeoPolicyForRoute('state-counties-hub', {
    stateId: stateData.id
  }, {
    entityCount: counties.length,
    hasRealLocalAssets: counties.length > 0,
    hasNoPlaceholderData: true
  });
  return {
    title: `${stateData.name} Counties Special Needs Resource Directories (2026)`,
    description: `Select your ${stateData.name} county to access local developmental services, ${catchment} boundary details, Medicaid waiver rates, and special education advocates.`,
    alternates: {
      canonical: `/counties/${stateData.id}`
    },
    robots: policy.index ? undefined : { index: false, follow: true }
  };
}

export default async function CountiesDirectoryPage({ params }: Props) {
  const p = await params;
  const stateData = await getStateByIdOrCode(p.state);
  if (!stateData) {
    notFound();
  }

  const config = getDynamicStateConfig(stateData.id, stateData.name, stateData.code);
  const counties = await getCounties(stateData.id);
  const catchment = config.catchmentName;

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '5rem' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span 
          style={{ 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            color: 'var(--primary-color)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            display: 'block', 
            marginBottom: '0.5rem' 
          }}
        >
          Local Service Catchments
        </span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <MapPin size={32} color="var(--primary-color)" />
          {stateData.name} Counties Directory
        </h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '850px', margin: '0 auto', color: 'var(--text-light)', lineHeight: '1.6' }}>
          Select your county to find direct lines to {catchment} intake desks, county service offices, special education support, and neighborhood helper hubs.
        </p>
      </div>

      <CountiesClient counties={counties} stateCode={stateData.code.toLowerCase()} stateName={stateData.name} />
    </main>
  );
}
