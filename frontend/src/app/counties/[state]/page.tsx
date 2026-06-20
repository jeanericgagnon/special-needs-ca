import { getCounties, getStateByIdOrCode, getCountyDetails } from '@/lib/db';
import { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';
import CountiesClient from './counties-client';
import { getDynamicStateConfig } from '@/lib/stateConfigs';
import {
  evaluateSeoPolicy,
  assertNoPlaceholderData,
  normalizeConfidenceScore,
  SEO_STATE_ALLOWLIST
} from '@/lib/seo-policy';

type Props = {
  params: Promise<{ state: string }>;
};

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

  // Evaluate the state-counties-hub policy
  const counties = await getCounties(stateData.id);
  
  let hasRealLocalAssets = false;
  let totalConfidence = 0;
  let confidenceCount = 0;
  let minDate: string | null = null;
  let hasOfficialSource = false;

  for (const c of counties) {
    const details = await getCountyDetails(c.id);
    if (!details) continue;

    const offices = details.countyOffices || [];
    const countyDistricts = details.schoolDistricts || [];
    const rcs = details.regionalCenters || [];

    const hasRequiredContactInfo = offices.length > 0;
    const hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(details));

    const rcDates = rcs.map(rc => rc.last_verified_date).filter(Boolean) as string[];
    const sdDates = countyDistricts.map(sd => sd.last_verified_date).filter(Boolean) as string[];
    const coDates = offices.map(co => co.last_verified_date).filter(Boolean) as string[];
    const allDates = [...rcDates, ...sdDates, ...coDates];
    const lastVerDate = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : null;

    if (lastVerDate) {
      if (!minDate || lastVerDate < minDate) {
        minDate = lastVerDate;
      }
    }

    const rcScores = rcs.map(rc => normalizeConfidenceScore(rc.confidence_score)).filter((s): s is number => s !== null);
    const sdScores = countyDistricts.map(sd => normalizeConfidenceScore(sd.confidence_score)).filter((s): s is number => s !== null);
    const coScores = offices.map(co => normalizeConfidenceScore(co.confidence_score)).filter((s): s is number => s !== null);
    const allScores = [...rcScores, ...sdScores, ...coScores];
    const confScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

    if (confScore !== null) {
      totalConfidence += confScore;
      confidenceCount++;
    }

    let countyHasOfficialSource = false;
    if (rcs.some(rc => !!rc.source_url) || countyDistricts.some(sd => !!sd.source_url) || offices.some(co => !!co.source_url)) {
      countyHasOfficialSource = true;
      hasOfficialSource = true;
    }

    const countyPolicy = evaluateSeoPolicy({
      routeType: 'county-hub',
      stateId: stateData.id,
      countyId: c.id,
      entityCount: countyDistricts.length,
      hasOfficialSource: countyHasOfficialSource,
      lastVerifiedDate: lastVerDate,
      confidenceScore: confScore,
      hasRequiredContactInfo,
      hasNoPlaceholderData
    });

    if (countyPolicy.index) {
      hasRealLocalAssets = true;
    }
  }

  const avgConfidenceScore = confidenceCount > 0 ? totalConfidence / confidenceCount : null;

  const policy = evaluateSeoPolicy({
    routeType: 'state-counties-hub',
    stateId: stateData.id,
    entityCount: counties.length,
    hasOfficialSource,
    lastVerifiedDate: minDate,
    confidenceScore: avgConfidenceScore,
    hasRealLocalAssets,
    hasNoPlaceholderData: counties.every(c => assertNoPlaceholderData(JSON.stringify(c)))
  });

  const isIndexable = policy.index;

  return {
    title: `${stateData.name} Counties Special Needs Resource Directories (2026)`,
    description: `Select your ${stateData.name} county to access local developmental services, ${catchment} boundary details, Medicaid waiver rates, and special education advocates.`,
    alternates: {
      canonical: `/counties/${stateData.id}`
    },
    robots: isIndexable ? undefined : { index: false, follow: true }
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
