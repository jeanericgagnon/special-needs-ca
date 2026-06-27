import { getCounties, getStateByIdOrCode } from '@/lib/db';
import { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';
import CountiesClient from './counties-client';
import { getSeoPolicyForRoute } from '@/lib/seo-policy';
import { getPartialStatePolicy, isLaunchSurfaceSuppressed } from '@/lib/launchStatePolicy';

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
  const partialStatePolicy = getPartialStatePolicy(stateData.id);
  const counties = await getCounties(stateData.id);
  if (partialStatePolicy && isLaunchSurfaceSuppressed(stateData.id, 'state-counties-hub')) {
    return {
      title: `${stateData.name} county directory is being verified`,
      description: `${stateData.name} county-level directory surfaces remain gated until the blocked local evidence families are reverified.`,
      alternates: {
        canonical: `/counties/${stateData.id}`
      },
      robots: { index: false, follow: true }
    };
  }
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
  const partialStatePolicy = getPartialStatePolicy(stateData.id);

  if (partialStatePolicy && isLaunchSurfaceSuppressed(stateData.id, 'state-counties-hub')) {
    return (
      <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            className="glass-panel"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.10) 0%, rgba(245, 158, 11, 0.04) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              padding: '2rem',
              borderRadius: '24px'
            }}
          >
            <h1 style={{ fontSize: '2rem', margin: '0 0 0.75rem 0' }}>{stateData.name} county directory is still being verified</h1>
            <p style={{ margin: '0 0 1rem 0', lineHeight: 1.6, color: 'var(--text-main)' }}>
              We are intentionally suppressing county-level directory navigation for {stateData.name} until the remaining local evidence gaps are closed.
            </p>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#92400e' }}>{partialStatePolicy.unavailableMessage}</p>
          </div>
          <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.94)', padding: '1.5rem 1.75rem', borderRadius: '20px' }}>
            <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-light)' }}>
              The statewide audit surface can stay visible, but county, district, and city pages remain gated and noindex until the official public local proof is reviewable.
            </p>
          </div>
        </div>
      </main>
    );
  }

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
