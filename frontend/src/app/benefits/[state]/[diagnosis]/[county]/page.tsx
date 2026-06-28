import { getProgramsForDiagnosis, getCountyDetails, getIepAdvocates, getStateByIdOrCode, CountyOffice, SchoolDistrict, IepAdvocate, NonprofitOrganization } from '@/lib/db';
import { Metadata } from 'next';
import { CheckCircle2, MapPin, Activity, Phone, Globe, Landmark, ShieldCheck, FileCheck, Award } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CopyButton from '@/components/copy-button';
import ContributionModal from '@/components/contribution-modal';
import PrintButton from '@/components/print-button';
import ShareButton from '@/components/share-button';
import CountyMapClient from '@/app/benefits/components/county-map-client';
import DirectoryFoundationPanel from '@/app/components/directory-foundation-panel';
import { getDynamicStateConfig } from '@/lib/stateConfigs';
import { TrustBadge } from '@/app/counties/components/CorrectionFlow';
import SourceFreshnessDisclosure from '@/app/components/SourceFreshnessDisclosure';
import { getCountyDiagnosisTruthEligibility, isPublicDirectoryRecordEligible, isPublicRecordEligible } from '@/lib/publicTruth';
import { evaluateSeoPolicy, normalizeConfidenceScore, assertNoPlaceholderData } from '@/lib/seo-policy';

type Props = {
  params: Promise<{ state: string; diagnosis: string; county: string }>;
};

function LocalVerificationNotice({
  label,
  countyName,
  suggestionType = 'other',
}: {
  label: string;
  countyName: string;
  suggestionType?: 'other' | 'district' | 'program';
}) {
  const targetId = `${countyName}-${label}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ margin: 0 }}>
        We are still verifying local entries for {label} in {countyName} County before showing them publicly.
      </p>
      <div>
        <ContributionModal
          suggestionType={suggestionType}
          targetId={targetId}
          targetName={`${countyName} County ${label}`}
          buttonLabel="Suggest a local source to review"
        />
      </div>
    </div>
  );
}

// Formatting helpers
function formatParam(val: string): string {
  return val
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bca\b/i, 'CA');
}

// Generate organic Titles and Descriptions for Search Engines
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const stateData = await getStateByIdOrCode(p.state);
  const stateId = stateData ? stateData.id : 'california';
  const stateName = stateData ? stateData.name : 'California';
  const stateCode = stateData ? stateData.code.toUpperCase() : 'CA';
  const config = getDynamicStateConfig(stateId, stateName, stateCode);
  const diagnosisFormatted = formatParam(p.diagnosis);
  const countyFormatted = formatParam(p.county);
  const countyData = await getCountyDetails(p.county);
  const truth = getCountyDiagnosisTruthEligibility(stateId, p.diagnosis, p.county, countyData);

  const sdList = (countyData?.schoolDistricts || []).filter(isPublicRecordEligible);
  const coList = (countyData?.countyOffices || []).filter(isPublicRecordEligible);
  const rcList = (countyData?.regionalCenters || []).filter(isPublicRecordEligible);
  const rcScores = rcList.map((rc) => normalizeConfidenceScore(rc.confidence_score)).filter((s: number | null): s is number => s !== null);
  const sdScores = sdList.map((sd) => normalizeConfidenceScore(sd.confidence_score)).filter((s: number | null): s is number => s !== null);
  const coScores = coList.map((co) => normalizeConfidenceScore(co.confidence_score)).filter((s: number | null): s is number => s !== null);
  const allScores = [...rcScores, ...sdScores, ...coScores];
  const confScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

  const hasOfficialSource = rcList.some((rc) => !!rc.source_url) || sdList.some((sd) => !!sd.source_url) || coList.some((co) => !!co.source_url);
  const hasRequiredContactInfo = coList.length > 0;
  const publicCountyPayload = countyData
    ? {
        ...countyData,
        schoolDistricts: sdList,
        countyOffices: coList,
        regionalCenters: rcList,
        localOrganizations: (countyData.localOrganizations || []).filter(isPublicDirectoryRecordEligible),
      }
    : null;
  const hasNoPlaceholderData = publicCountyPayload ? assertNoPlaceholderData(JSON.stringify(publicCountyPayload)) : false;
  const hasRealLocalAssets = sdList.length > 0 || coList.length > 0 || rcList.length > 0;
  const lastVerifiedDate = [
    ...rcList.map((rc) => rc.last_verified_date).filter(Boolean),
    ...sdList.map((sd) => sd.last_verified_date).filter(Boolean),
    ...coList.map((co) => co.last_verified_date).filter(Boolean)
  ].sort().at(-1) || null;

  const policy = evaluateSeoPolicy({
    routeType: 'county-condition',
    stateId,
    countyId: p.county,
    diagnosisId: p.diagnosis,
    entityCount: sdList.length,
    confidenceScore: confScore,
    hasOfficialSource,
    lastVerifiedDate,
    hasRequiredContactInfo,
    hasNoPlaceholderData,
    hasRealLocalAssets
  });

  const canIndex = truth.indexSafe && policy.index;

  return {
    title: `${diagnosisFormatted} Benefits & Services in ${countyFormatted} County, ${stateCode}`,
    description: `Review ${stateName} public benefit routes, ${config.catchmentName} intake links, ${config.personalCareProgram} pay estimates, and school support guidance for ${diagnosisFormatted} in ${countyFormatted} County.`,
    alternates: {
      canonical: `/benefits/${stateId}/${p.diagnosis}/${p.county}`
    },
    robots: canIndex ? undefined : { index: false, follow: true }
  };
}

export default async function SEOLandingPage({ params }: Props) {
  const p = await params;
  const stateData = await getStateByIdOrCode(p.state);
  if (!stateData) {
    notFound();
  }

  const stateId = stateData.id;
  const stateName = stateData.name;
  const stateCode = stateData.code.toUpperCase();
  const config = getDynamicStateConfig(stateId, stateName, stateCode);

  const diagnosisFormatted = formatParam(p.diagnosis);
  const countyFormatted = formatParam(p.county);

  // 1. Fetch County Details
  const countyData = await getCountyDetails(p.county);
  if (!countyData) {
    notFound();
  }

  const truth = getCountyDiagnosisTruthEligibility(stateId, p.diagnosis, p.county, countyData);

  const sdList = (countyData.schoolDistricts || []).filter(isPublicRecordEligible);
  const coList = (countyData.countyOffices || []).filter(isPublicRecordEligible);
  const rcList = (countyData.regionalCenters || []).filter(isPublicRecordEligible);
  const rcScores = rcList.map((rc) => normalizeConfidenceScore(rc.confidence_score)).filter((s: number | null): s is number => s !== null);
  const sdScores = sdList.map((sd) => normalizeConfidenceScore(sd.confidence_score)).filter((s: number | null): s is number => s !== null);
  const coScores = coList.map((co) => normalizeConfidenceScore(co.confidence_score)).filter((s: number | null): s is number => s !== null);
  const allScores = [...rcScores, ...sdScores, ...coScores];
  const confScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

  const hasOfficialSource = rcList.some((rc) => !!rc.source_url) || sdList.some((sd) => !!sd.source_url) || coList.some((co) => !!co.source_url);
  const hasRequiredContactInfo = coList.length > 0;
  const publicCountyPayload = {
    ...countyData,
    schoolDistricts: sdList,
    countyOffices: coList,
    regionalCenters: rcList,
    localOrganizations: (countyData.localOrganizations || []).filter(isPublicDirectoryRecordEligible),
  };
  const hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(publicCountyPayload));
  const hasRealLocalAssets = sdList.length > 0 || coList.length > 0 || rcList.length > 0;
  const lastVerifiedDate = [
    ...rcList.map((rc) => rc.last_verified_date).filter(Boolean),
    ...sdList.map((sd) => sd.last_verified_date).filter(Boolean),
    ...coList.map((co) => co.last_verified_date).filter(Boolean)
  ].sort().at(-1) || null;

  const policy = evaluateSeoPolicy({
    routeType: 'county-condition',
    stateId,
    countyId: p.county,
    diagnosisId: p.diagnosis,
    entityCount: sdList.length,
    confidenceScore: confScore,
    hasOfficialSource,
    lastVerifiedDate,
    hasRequiredContactInfo,
    hasNoPlaceholderData,
    hasRealLocalAssets
  });

  const isIndexable = truth.indexSafe && policy.index;

  // 1.5. Fetch local IEP advocates serving this county
  const localAdvocates = (await getIepAdvocates(p.county)).filter(isPublicDirectoryRecordEligible);

  // 2. Fetch matched programs from crawler database
  const programs = await getProgramsForDiagnosis(diagnosisFormatted);

  // 3. Compile sources for SourceFreshnessDisclosure
  const eligibleRegionalCenters = rcList;
  const eligibleDistricts = sdList;
  const eligibleCountyOffices = coList;
  const eligibleNonprofits = (countyData.localOrganizations || []).filter(isPublicDirectoryRecordEligible);

  const freshnessSources = [];
  if (eligibleRegionalCenters.length > 0) {
    const rc = eligibleRegionalCenters[0];
    freshnessSources.push({
      name: rc.name,
      url: rc.source_url || undefined,
      lastReviewedDate: rc.last_verified_date,
      verificationStatus: rc.verification_status,
      sourceType: rc.source_type,
      confidenceScore: rc.confidence_score ?? null
    });
  }
  if (eligibleDistricts.length > 0) {
    eligibleDistricts.forEach((sd: SchoolDistrict) => {
      freshnessSources.push({
        name: sd.name,
        url: sd.source_url || undefined,
        lastReviewedDate: sd.last_verified_date,
        verificationStatus: sd.verification_status,
        sourceType: sd.source_type,
        confidenceScore: sd.confidence_score ?? null
      });
    });
  }
  if (eligibleCountyOffices.length > 0) {
    eligibleCountyOffices.forEach((office: CountyOffice) => {
      freshnessSources.push({
        name: office.office_name,
        url: office.source_url || undefined,
        lastReviewedDate: office.last_verified_date,
        verificationStatus: office.verification_status,
        sourceType: office.source_type,
        confidenceScore: office.confidence_score ?? null
      });
    });
  }

  interface MapResource {
    id: string;
    type: 'regional-center' | 'school-board';
    name: string;
    address: string;
    phone: string;
    description: string;
    x: number;
    y: number;
  }

  // Compile Map resources list
  const mapResources: MapResource[] = [];
  
  if (eligibleRegionalCenters.length > 0) {
    mapResources.push({
      id: 'rc-1',
      type: 'regional-center',
      name: eligibleRegionalCenters[0].name,
      address: `Intake Desk, ${countyFormatted}, ${stateCode}`,
      phone: eligibleRegionalCenters[0].intake_phone,
      description: `${config.catchmentName} coordinating ${config.waiverProgram} developmental support: ${eligibleRegionalCenters[0].catchment_boundaries}`,
      x: 210,
      y: 260
    });
  }

  if (eligibleDistricts.length > 0) {
    mapResources.push({
      id: 'sd-1',
      type: 'school-board',
      name: eligibleDistricts[0].name,
      address: `Special Education Department, ${countyFormatted}, ${stateCode}`,
      phone: eligibleDistricts[0].spec_ed_contact_phone || '',
      description: `Special education district coordinator responsible for IEP evaluations, placement, and inclusion LRE classrooms.`,
      x: 580,
      y: 120
    });
  }
  const ihssOffice = eligibleCountyOffices.find((o: CountyOffice) => o.program_id === 'ihss-for-children');

  // ----------------------------------------------------
  // Dynamic JSON-LD Structured Data
  // ----------------------------------------------------
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the Regional Center serving ${countyFormatted} County for ${diagnosisFormatted}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: eligibleRegionalCenters[0]
            ? `Families in ${countyFormatted} County are served by ${eligibleRegionalCenters[0].name}. You can reach their intake line at ${eligibleRegionalCenters[0].intake_phone}.`
            : `California Regional Centers coordinate Lanterman Act developmental services. Contact the California Department of Developmental Services to find your catchment center.`
        }
      },
      {
        '@type': 'Question',
        name: `How do I apply for In-Home Supportive Services (IHSS) in ${countyFormatted} County?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: ihssOffice
            ? `Start the IHSS intake and application process through ${ihssOffice.office_name} at ${ihssOffice.address}. Phone: ${ihssOffice.phone}. If the county authorizes services, some families may be able to use a parent or relative provider when the current local rules allow it.`
            : `Start IHSS through your local county department of social services. If services are authorized, some families may be able to use a parent or relative provider depending on the current county program rules.`
        }
      }
    ]
  };

  const medicalConditionSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    name: diagnosisFormatted,
    possibleTreatment: [
      { '@type': 'MedicalTherapy', name: 'Speech Therapy' },
      { '@type': 'MedicalTherapy', name: 'Occupational Therapy' },
      { '@type': 'MedicalTherapy', name: 'Behavioral Intervention (ABA)' }
    ]
  };

  const schoolDistrictsSchema = {
    '@context': 'https://schema.org',
    '@graph': eligibleDistricts.map((sd: SchoolDistrict) => ({
      '@type': 'EducationalOrganization',
      'name': sd.name,
      'telephone': sd.spec_ed_contact_phone,
      'email': sd.spec_ed_contact_email,
      'url': sd.website,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': countyFormatted,
        'addressRegion': stateCode,
        'addressCountry': 'US'
      },
      'description': `${sd.name} Special Education department in ${countyFormatted} County. Inclusion rate: ${sd.inclusion_rate_pct}%. SDC self-contained rate: ${sd.self_contained_rate_pct}%.`
    }))
  };

  const localAdvocatesSchema = {
    '@context': 'https://schema.org',
    '@graph': localAdvocates.map((adv: IepAdvocate) => ({
      '@type': 'ProfessionalService',
      'name': adv.name,
      'telephone': adv.phone,
      'email': adv.email,
      'url': adv.website,
      'image': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400',
      'description': `${adv.name} is a professional special education IEP advocate serving ${countyFormatted} County. Credentials: ${adv.credentials}. Rate: ${adv.price_rate}. Experience: ${adv.experience_years} years.`,
      'priceRange': adv.price_rate,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': countyFormatted,
        'addressRegion': stateCode,
        'addressCountry': 'US'
      }
    }))
  };

  const nonprofitSchema = {
    '@context': 'https://schema.org',
    '@graph': eligibleNonprofits.slice(0, 6).map((org: NonprofitOrganization) => ({
      '@type': 'NonprofitOrganization',
      'name': org.name,
      'telephone': org.phone,
      'url': org.website,
      'sameAs': org.source_url || undefined,
      'areaServed': `${countyFormatted} County, ${stateCode}`,
      'description': org.focus_condition ? `${org.name} supports families with ${org.focus_condition}.` : `${org.name} serves families in ${countyFormatted} County.`
    }))
  };

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '5rem' }}>
      
      {/* Dynamic JSON-LD Structured Data Injection */}
      {isIndexable && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalConditionSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolDistrictsSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(localAdvocatesSchema) }}
          />
          {eligibleNonprofits.length > 0 && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(nonprofitSchema) }}
            />
          )}
        </>
      )}

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          {diagnosisFormatted} Benefits in {countyFormatted} County
        </h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto 1.5rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
          Navigating developmental care in {countyFormatted} County. If you have a child with {diagnosisFormatted}, this page can help you review source-backed {config.medicaidName} pathways, county rate estimates, and educational routing that are currently published for this county.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
          <ShareButton />
          <PrintButton label="Print PDF Directory Guide" />
        </div>
      </div>

      {/* NEW: Interactive Coordinates Map Canvas */}
      {mapResources.length > 0 && (
        <div style={{ marginBottom: '4rem' }} className="no-print">
          <CountyMapClient countyName={countyFormatted} resources={mapResources} />
        </div>
      )}

      {/* Local Routing Information */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        
        <div className="glass-panel" style={{ background: 'rgba(99, 102, 241, 0.03)', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <MapPin color="var(--primary-color)" size={24} />
            <h2 style={{ fontSize: '1.4rem' }}>Local Resource Directory ({countyFormatted})</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
            
            {/* Regional Center */}
            {eligibleRegionalCenters.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <Landmark size={16} /> Regional Center
                </strong>
                <strong>{eligibleRegionalCenters[0].name}</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{eligibleRegionalCenters[0].catchment_boundaries}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <Phone size={14} style={{ flexShrink: 0 }} /> 
                  Intake: 
                  <a href={`tel:${eligibleRegionalCenters[0].intake_phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{eligibleRegionalCenters[0].intake_phone}</a>
                  <CopyButton text={eligibleRegionalCenters[0].intake_phone} size={11} />
                </span>
                <TrustBadge
                  status={eligibleRegionalCenters[0].verification_status}
                  lastVerifiedDate={eligibleRegionalCenters[0].last_verified_date}
                  sourceUrl={eligibleRegionalCenters[0].source_url}
                  sourceType={eligibleRegionalCenters[0].source_type}
                  confidenceScore={eligibleRegionalCenters[0].confidence_score}
                  entityId={eligibleRegionalCenters[0].id}
                  entityName={eligibleRegionalCenters[0].name}
                  entityType="regional_center"
                />
              </div>
            ) : (
              <LocalVerificationNotice label="regional center routing" countyName={countyData.name} />
            )}

            {/* School District IEPs */}
            {eligibleDistricts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <ShieldCheck size={16} /> Special Ed & Inclusion Stats
                </strong>
                {eligibleDistricts.map((district: SchoolDistrict) => (
                  <div key={district.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{district.name}</strong>
                      <ContributionModal suggestionType="district" targetId={district.id} targetName={district.name} buttonLabel="Suggest Update" />
                    </div>
                    
                    {district.total_enrollment && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block' }}>
                        Enrollment: ~{district.total_enrollment.toLocaleString()} students ({district.special_ed_pct}% SpEd)
                      </span>
                    )}

                    {district.inclusion_rate_pct && (
                      <div style={{ marginTop: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                          <span>Inclusion Rate (Gen-Ed &gt;80%)</span>
                          <strong style={{ color: '#10b981' }}>{district.inclusion_rate_pct}%</strong>
                        </div>
                        <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${district.inclusion_rate_pct}%`, backgroundColor: '#10b981', borderRadius: '3px' }} />
                        </div>
                      </div>
                    )}

                    {district.spec_ed_contact_phone && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <Phone size={13} style={{ flexShrink: 0 }} /> 
                          Helpline: 
                          <a href={`tel:${district.spec_ed_contact_phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{district.spec_ed_contact_phone}</a>
                          <CopyButton text={district.spec_ed_contact_phone} size={11} />
                        </span>
                      </div>
                    )}
                    <TrustBadge
                      status={district.verification_status}
                      lastVerifiedDate={district.last_verified_date}
                      sourceUrl={district.source_url}
                      sourceType={district.source_type}
                      confidenceScore={district.confidence_score}
                      entityId={district.id}
                      entityName={district.name}
                      entityType="school_district"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <LocalVerificationNotice label="special education district contacts" countyName={countyData.name} suggestionType="district" />
            )}

            {/* County Office Contacts */}
            {eligibleCountyOffices.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <FileCheck size={16} /> County Service Office
                </strong>
                {eligibleCountyOffices.map((office: CountyOffice) => (
                  <div key={office.id} style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <strong>{office.office_name}</strong>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                      <strong>Address:</strong> {office.address}
                      <CopyButton text={office.address} size={11} />
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <Phone size={13} style={{ flexShrink: 0 }} /> 
                      Phone: 
                      <a href={`tel:${office.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{office.phone}</a>
                      <CopyButton text={office.phone} size={11} />
                    </span>
                    <TrustBadge
                      status={office.verification_status}
                      lastVerifiedDate={office.last_verified_date}
                      sourceUrl={office.source_url}
                      sourceType={office.source_type}
                      confidenceScore={office.confidence_score}
                      entityId={office.id}
                      entityName={office.office_name}
                      entityType="county_office"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <LocalVerificationNotice label="county service offices" countyName={countyData.name} />
            )}

          </div>

          {eligibleNonprofits.length > 0 ? (
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '2.5rem', paddingTop: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                Local Nonprofit & Family Support Organizations
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {eligibleNonprofits.slice(0, 6).map((org: NonprofitOrganization) => (
                  <DirectoryFoundationPanel
                    key={org.id}
                    entityType="nonprofit"
                    heading="Family support organization"
                    record={org}
                    pageType="county_diagnosis"
                    stateId={stateId}
                    countyId={countyData.id}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '2.5rem', paddingTop: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
                Local Nonprofit & Family Support Organizations
              </h3>
              <LocalVerificationNotice label="nonprofit and family support listings" countyName={countyData.name} />
            </div>
          )}

          <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem' }} className="no-print">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ display: 'inline-flex', width: 'auto' }}>
                <Activity size={18} /> Run the Dynamic Eligibility Wizard
              </button>
            </Link>
          </div>
        </div>

      </div>

      {/* Local IEP Advocates Section */}
      {localAdvocates && localAdvocates.length > 0 ? (
        <div className="glass-panel" style={{ background: 'rgba(99, 102, 241, 0.02)', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <Award color="var(--primary-color)" size={24} />
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Local IEP Advocates serving {countyFormatted} County</h2>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            Special education advisors and legal advocates serving families in {countyFormatted} County. Advocate listings below are limited to public records that pass the shared truth eligibility checks.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {localAdvocates.map((adv: IepAdvocate) => (
              <DirectoryFoundationPanel
                key={adv.id}
                entityType="advocate"
                heading="Special education advocate"
                record={adv}
                subtitle={adv.specialties || null}
                pageType="county_diagnosis"
                stateId={stateId}
                countyId={countyData.id}
              />
            ))}
          </div>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <Link 
              href={`/advocates?county=${p.county}`} 
              style={{ 
                fontSize: '0.9rem', 
                color: 'var(--primary-color)', 
                textDecoration: 'none', 
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              View Full Advocates Directory for {countyFormatted} County →
            </Link>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ background: 'rgba(99, 102, 241, 0.02)', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <Award color="var(--primary-color)" size={24} />
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Local IEP Advocates serving {countyFormatted} County</h2>
          </div>
          <LocalVerificationNotice label="IEP advocate listings" countyName={countyData.name} />
        </div>
      )}

      {/* Matched Programs Grid */}
      <h2 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        State and Federal Programs for {diagnosisFormatted}
      </h2>
      
      <div className="grid">
        {programs.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
            <p>No program rules explicitly indexed for this diagnosis yet. Use our Wizard to map general disability services.</p>
          </div>
        ) : (
          programs.map((program) => (
            <div key={program.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '230px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <CheckCircle2 color="var(--primary-color)" size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{program.program_name}</h3>
                </div>
                
                <div style={{ marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span><strong>Demographic:</strong> {program.target_demographic}</span>
                  <span><strong>Age limits:</strong> {program.age_limit_min} to {program.age_limit_max} years</span>
                  <span><strong>Income rule:</strong> {program.income_limit}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
                <span className="program-tag" style={{ marginTop: 0 }}>{diagnosisFormatted} Eligible</span>
                <a 
                  href={program.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ fontSize: '0.8rem', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none', fontWeight: 600 }}
                >
                  <Globe size={12} /> Source Doc
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <SourceFreshnessDisclosure
        sources={freshnessSources}
        correctionSuggestionType="other"
        correctionTargetId={`${stateId}-${p.diagnosis}-${p.county}`}
        correctionTargetName={`${diagnosisFormatted} in ${countyFormatted} County`}
        correctionButtonLabel="Report a correction"
      />
    </main>
  );
}
